import os
from pathlib import Path
from uuid import uuid4
from datetime import datetime, timedelta, timezone

import certifi
import jwt
from bson import ObjectId
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, OperationFailure
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.utils import secure_filename

load_dotenv()


MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'campus_marketplace')
jwt_secret_from_env = os.getenv('JWT_SECRET')
app_env = os.getenv(
    'APP_ENV', os.getenv('FLASK_ENV', 'development')
).strip().lower()
is_production = app_env == 'production'

if not jwt_secret_from_env:
    if is_production:
        raise RuntimeError('JWT_SECRET is required in production')
    JWT_SECRET = 'dev-only-insecure-secret'
else:
    JWT_SECRET = jwt_secret_from_env

weak_secrets = {
    'change-me-in-production',
    'change-this-to-a-long-random-secret',
    'replace-with-a-long-random-string',
    'dev-only-insecure-secret',
}
if is_production and JWT_SECRET in weak_secrets:
    raise RuntimeError('JWT_SECRET is insecure in production')
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
items = db.items
ITEM_STATUSES = {'available', 'sold', 'pending'}


def ensure_items_collection_schema():
    """Ensure the items collection has JSON schema validation."""
    items_validator = {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': [
                'title',
                'description',
                'price',
                'category',
                'images',
                'seller_id',
                'status',
                'createdAt',
                'updatedAt',
            ],
            'properties': {
                'title': {'bsonType': 'string', 'minLength': 1},
                'description': {'bsonType': 'string', 'minLength': 1},
                'price': {
                    'bsonType': ['double', 'int', 'long', 'decimal'],
                    'minimum': 0,
                },
                'category': {'bsonType': 'string', 'minLength': 1},
                'images': {
                    'bsonType': 'array',
                    'minItems': 1,
                    'items': {'bsonType': 'string', 'minLength': 1},
                },
                'seller_id': {'bsonType': 'objectId'},
                'seller_verified': {'bsonType': 'bool'},
                'status': {'enum': list(ITEM_STATUSES)},
                'createdAt': {'bsonType': 'date'},
                'updatedAt': {'bsonType': 'date'},
                'soldAt': {'bsonType': ['date', 'null']},
                'location': {'bsonType': ['string', 'null']},
                'meeting_notes': {'bsonType': ['string', 'null']},
                'rating_count': {'bsonType': ['int', 'long'], 'minimum': 0},
                'rating_avg': {
                    'bsonType': ['double', 'int', 'long', 'decimal'],
                    'minimum': 0,
                    'maximum': 5,
                },
                'expiresAt': {'bsonType': ['date', 'null']},
                'requests_count': {'bsonType': ['int', 'long'], 'minimum': 0},
            },
        }
    }

    collection_names = db.list_collection_names()
    if 'items' in collection_names:
        try:
            db.command({
                'collMod': 'items',
                'validator': items_validator,
                'validationLevel': 'moderate',
            })
        except OperationFailure:
            # If schema update is not permitted, continue with existing
            # collection settings.
            pass
    else:
        db.create_collection(
            'items',
            validator=items_validator,
            validationLevel='moderate',
        )


def serialize_item_document(item_doc):
    """Normalize item docs for JSON and legacy frontend fields."""
    item_doc['_id'] = str(item_doc['_id'])

    seller_obj = item_doc.get('seller_id') or item_doc.get('sellerId')
    if isinstance(seller_obj, ObjectId):
        seller_obj = str(seller_obj)
    elif seller_obj is not None:
        seller_obj = str(seller_obj)
    item_doc['seller_id'] = seller_obj
    item_doc['sellerId'] = seller_obj

    images = item_doc.get('images')
    if isinstance(images, list) and images:
        item_doc['image'] = images[0]
    elif item_doc.get('image'):
        item_doc['images'] = [item_doc['image']]
    else:
        item_doc['images'] = []
        item_doc['image'] = None

    for dt_field in ('createdAt', 'updatedAt', 'soldAt', 'expiresAt'):
        if dt_field in item_doc and hasattr(item_doc[dt_field], 'isoformat'):
            item_doc[dt_field] = item_doc[dt_field].isoformat()

    return item_doc


try:
    client.admin.command('ping')
    users.create_index('email', unique=True)
    ensure_items_collection_schema()
    items = db.items
    items.create_index([('seller_id', 1), ('createdAt', -1)])
    items.create_index([('status', 1), ('createdAt', -1)])
    items.create_index([('category', 1), ('status', 1), ('createdAt', -1)])
    items.create_index([('createdAt', -1)])
except Exception as exc:
    raise RuntimeError(
        'MongoDB connection failed. Check Atlas username/password and '
        'Network Access IP allowlist.'
    ) from exc

app = Flask(__name__)
UPLOAD_FOLDER = Path(__file__).resolve().parent / 'uploads'
UPLOAD_FOLDER.mkdir(exist_ok=True)
MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
ALLOWED_IMAGE_MIMETYPES = {
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
}

app.config['MAX_CONTENT_LENGTH'] = MAX_IMAGE_UPLOAD_BYTES
app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)

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


@app.errorhandler(RequestEntityTooLarge)
def handle_request_too_large(_error):
    return json_error('Image must be smaller than 5 MB.', 413)


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


def parse_object_id(value):
    try:
        return ObjectId(value)
    except (TypeError, ValueError):
        return None


def is_allowed_email(email):
    return email.endswith('@office.uc.ac.kr')


def is_strong_password(password):
    if len(password) < 8:
        return False, 'Password must be at least 8 characters long.'
    if not any(c.isupper() for c in password):
        return False, 'Password must contain at least one uppercase letter.'
    if not any(c.islower() for c in password):
        return False, 'Password must contain at least one lowercase letter.'
    if not any(c.isdigit() for c in password):
        return False, 'Password must contain at least one number.'
    if not any(not c.isalnum() for c in password):
        return False, 'Password must contain at least one special character.'
    if ' ' in password:
        return False, 'Password cannot contain spaces.'
    return True, ''


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


@app.get('/api/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.post('/api/uploads/image')
def upload_image():
    uploaded_file = request.files.get('image') or request.files.get('file')
    if not uploaded_file or not uploaded_file.filename:
        return json_error('An image file is required.', 400)

    safe_filename = secure_filename(uploaded_file.filename)
    if not safe_filename:
        return json_error('The uploaded filename is not valid.', 400)

    file_extension = os.path.splitext(safe_filename)[1].lower()
    if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
        return json_error(
            'Only JPG, PNG, GIF, and WebP images are allowed.',
            400,
        )

    if uploaded_file.mimetype not in ALLOWED_IMAGE_MIMETYPES:
        return json_error('Only image uploads are allowed.', 400)

    if (
        request.content_length
        and request.content_length > MAX_IMAGE_UPLOAD_BYTES
    ):
        return json_error('Image must be smaller than 5 MB.', 413)

    stored_filename = f"{uuid4().hex}-{safe_filename}"
    stored_path = UPLOAD_FOLDER / stored_filename
    uploaded_file.save(stored_path)

    file_url = f"{request.host_url.rstrip('/')}/api/uploads/{stored_filename}"

    return jsonify({
        'message': 'Image uploaded successfully.',
        'filename': stored_filename,
        'url': file_url,
    }), 201


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

    is_valid, error_msg = is_strong_password(password)
    if not is_valid:
        return json_error(error_msg, 400)

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

    return jsonify({
        'message': 'Account created successfully. Please verify your email before logging in.',
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

    if not user_doc.get('isVerified', False):
        return json_error('Please verify your email address before logging in.', 403)

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

    user_id = parse_object_id(payload.get('sub'))
    if not user_id:
        return json_error('Invalid or expired token.', 401)

    user_doc = users.find_one({'_id': user_id})
    if not user_doc:
        return json_error('Invalid or expired token.', 401)

    return jsonify({'user': build_user_payload(user_doc)})


@app.get('/api/items')
def get_items():
    """Fetch all marketplace items with pagination and filtering."""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        category = request.args.get('category', None)
        # Validate pagination
        if page < 1:
            page = 1
        if limit < 1 or limit > 100:
            limit = 20
        skip = (page - 1) * limit
        # Build query filter
        query_filter = {}
        if category:
            query_filter['category'] = category
        # Fetch items
        items_list = list(
            items.find(query_filter)
            .sort('createdAt', -1)
            .skip(skip)
            .limit(limit)
        )
        # Convert ObjectIds/dates and preserve legacy response fields.
        items_list = [serialize_item_document(item) for item in items_list]
        total = items.count_documents(query_filter)
        return jsonify({
            'items': items_list,
            'pagination': {
                'page': page,
                'limit': limit,
                'total': total,
                'pages': (total + limit - 1) // limit,
            },
        })
    except Exception as exc:
        return json_error(f'Failed to fetch items: {str(exc)}', 500)


@app.get('/api/items/<item_id>')
def get_item(item_id):
    """Fetch a single marketplace item by id."""
    oid = parse_object_id(item_id)
    if not oid:
        return json_error('Invalid item id.', 400)

    try:
        item_doc = items.find_one({'_id': oid})
    except Exception as exc:
        return json_error(f'Failed to fetch item: {str(exc)}', 500)

    if not item_doc:
        return json_error('Item not found.', 404)

    # Normalize for JSON consumption.
    item_doc = serialize_item_document(item_doc)

    return jsonify({'item': item_doc})


@app.post('/api/items')
def create_item():
    """Create a new marketplace item."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return json_error('Missing bearer token.', 401)

    token = auth_header.removeprefix('Bearer ').strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return json_error('Invalid or expired token.', 401)

    seller_id = parse_object_id(payload.get('sub'))
    if not seller_id:
        return json_error('Invalid or expired token.', 401)

    user_doc = users.find_one({'_id': seller_id})
    if not user_doc:
        return json_error('Invalid or expired token.', 401)

    data = request.get_json(silent=True) or {}
    required_fields = ['title', 'description', 'price', 'category']

    missing_fields = [
        field
        for field in required_fields
        if not str(data.get(field, '')).strip()
    ]
    if missing_fields:
        missing_list = ', '.join(missing_fields)
        return json_error(f'Missing required fields: {missing_list}', 400)

    try:
        price = float(data['price'])
        if price < 0:
            return json_error('Price must be a positive number.', 400)
    except (ValueError, TypeError):
        return json_error('Price must be a valid number.', 400)

    status = (
        str(data.get('status', 'available')).strip().lower() or 'available'
    )
    if status not in ITEM_STATUSES:
        return json_error(
            'Status must be one of: available, sold, pending.',
            400,
        )

    raw_images = data.get('images')
    images = []
    if isinstance(raw_images, list):
        images = [str(url).strip() for url in raw_images if str(url).strip()]
    elif isinstance(raw_images, str) and raw_images.strip():
        images = [raw_images.strip()]

    primary_image = str(data.get('image', '')).strip()
    if primary_image and primary_image not in images:
        images.insert(0, primary_image)

    if not images:
        return json_error('At least one image URL is required.', 400)

    now = datetime.now(timezone.utc)
    location = str(data.get('location', '')).strip() or None
    meeting_notes = str(data.get('meeting_notes', '')).strip() or None

    item_doc = {
        'seller_id': seller_id,
        'sellerId': seller_id,
        'sellerName': f"{user_doc['firstName']} {user_doc['lastName']}",
        'seller_verified': bool(user_doc.get('isVerified', False)),
        'title': str(data['title']).strip(),
        'description': str(data['description']).strip(),
        'price': price,
        'category': str(data['category']).strip(),
        'images': images,
        'image': images[0],
        'location': location,
        'meeting_notes': meeting_notes,
        'status': status,
        'rating_count': 0,
        'rating_avg': 0.0,
        'requests_count': 0,
        'soldAt': now if status == 'sold' else None,
        'expiresAt': None,
        'createdAt': now,
        'updatedAt': now,
    }

    try:
        result = items.insert_one(item_doc)
        item_doc['_id'] = result.inserted_id
        item_doc = serialize_item_document(item_doc)
        return jsonify({
            'message': 'Item created successfully.',
            'item': item_doc,
        }), 201
    except Exception as exc:
        return json_error(f'Failed to create item: {str(exc)}', 500)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')), debug=True)
