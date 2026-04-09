import os
from datetime import datetime, timedelta, timezone

import certifi
import jwt
from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from werkzeug.security import check_password_hash, generate_password_hash

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'campus_marketplace')
JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-production')
JWT_EXPIRES_HOURS = int(os.getenv('JWT_EXPIRES_HOURS', '24'))
FRONTEND_ORIGIN = os.getenv('FRONTEND_ORIGIN', 'http://localhost:5173')
ADDITIONAL_FRONTEND_ORIGINS = os.getenv(
    'ADDITIONAL_FRONTEND_ORIGINS',
    'http://localhost:5176',
)

if not MONGODB_URI:
    raise RuntimeError('MONGODB_URI is required')

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=8000,
    connectTimeoutMS=8000,
    tlsCAFile=certifi.where(),
)
db = client[MONGODB_DB_NAME]
users = db.users

try:
    client.admin.command('ping')
    users.create_index('email', unique=True)
except Exception as exc:
    raise RuntimeError(
        'MongoDB connection failed. Check Atlas username/password and '
        'Network Access IP allowlist.'
    ) from exc

app = Flask(__name__)
allowed_origins = [FRONTEND_ORIGIN]
allowed_origins.extend(
    [
        origin.strip()
        for origin in ADDITIONAL_FRONTEND_ORIGINS.split(',')
        if origin.strip()
    ]
)
CORS(app, resources={r'/api/*': {'origins': allowed_origins}})


def json_error(message, status_code):
    return jsonify({'error': message}), status_code


def normalize_email(email):
    return email.strip().lower()


def build_user_payload(user_doc):
    return {
        'id': str(user_doc['_id']),
        'firstName': user_doc['firstName'],
        'middleName': user_doc.get('middleName', ''),
        'lastName': user_doc['lastName'],
        'email': user_doc['email'],
        'isVerified': user_doc.get('isVerified', False),
    }


def is_allowed_email(email):
    return email.endswith('@office.uc.ac.kr')


def issue_token(user_doc):
    payload = {
        'sub': str(user_doc['_id']),
        'email': user_doc['email'],
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_HOURS),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


@app.get('/api/health')
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({'ok': True, 'database': MONGODB_DB_NAME})
    except Exception as exc:  # pragma: no cover - simple connection diagnostic
        return json_error(f'Database connection failed: {exc}', 500)


@app.post('/api/auth/signup')
def signup():
    data = request.get_json(silent=True) or {}
    required_fields = ['firstName', 'lastName', 'email', 'password']

    missing_fields = [
        field
        for field in required_fields
        if not str(data.get(field, '')).strip()
    ]
    if missing_fields:
        missing_list = ', '.join(missing_fields)
        return json_error(f'Missing required fields: {missing_list}', 400)

    first_name = data['firstName'].strip()
    middle_name = str(data.get('middleName', '')).strip()
    last_name = data['lastName'].strip()
    email = normalize_email(data['email'])
    password = str(data['password'])

    if not is_allowed_email(email):
        return json_error(
            'Only @office.uc.ac.kr email addresses are allowed.',
            400,
        )

    if users.find_one({'email': email}):
        return json_error('An account with this email already exists.', 409)

    user_doc = {
        'firstName': first_name,
        'middleName': middle_name,
        'lastName': last_name,
        'email': email,
        'passwordHash': generate_password_hash(password),
        'isVerified': False,
        'createdAt': datetime.now(timezone.utc),
        'updatedAt': datetime.now(timezone.utc),
    }

    try:
        result = users.insert_one(user_doc)
    except DuplicateKeyError:
        return json_error('An account with this email already exists.', 409)

    saved_user = users.find_one({'_id': result.inserted_id})
    token = issue_token(saved_user)

    return jsonify({
        'message': 'Account created successfully.',
        'token': token,
        'user': build_user_payload(saved_user),
    }), 201


@app.post('/api/auth/login')
def login():
    data = request.get_json(silent=True) or {}
    email = normalize_email(str(data.get('email', '')))
    password = str(data.get('password', ''))

    if not email or not password:
        return json_error('Email and password are required.', 400)

    user_doc = users.find_one({'email': email})
    if not user_doc:
        return json_error('Invalid email or password.', 401)

    if not check_password_hash(user_doc['passwordHash'], password):
        return json_error('Invalid email or password.', 401)

    token = issue_token(user_doc)

    return jsonify({
        'message': 'Login successful.',
        'token': token,
        'user': build_user_payload(user_doc),
    })


@app.get('/api/auth/me')
def me():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return json_error('Missing bearer token.', 401)

    token = auth_header.removeprefix('Bearer ').strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return json_error('Invalid or expired token.', 401)

    user_doc = users.find_one({'_id': ObjectId(payload['sub'])})
    if not user_doc:
        return json_error('User not found.', 404)

    return jsonify({'user': build_user_payload(user_doc)})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')), debug=True)
