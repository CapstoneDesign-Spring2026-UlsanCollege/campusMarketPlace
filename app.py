import os
from pathlib import Path
from uuid import uuid4
from datetime import datetime, timedelta, timezone

import certifi
import jwt
from bson import ObjectId
import smtplib
import ssl
from email.message import EmailMessage
import requests
try:
    import cloudinary
    import cloudinary.uploader
except Exception:
    cloudinary = None
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory, has_request_context
import re
from flask_cors import CORS
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError, OperationFailure
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.utils import secure_filename

load_dotenv(dotenv_path=Path(__file__).resolve().parent / '.env')


MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME', 'campus_marketplace')
jwt_secret_from_env = os.getenv('JWT_SECRET')
app_env = os.getenv(
    'APP_ENV', os.getenv('FLASK_ENV', 'development')
).strip().lower()
is_render_host = bool(
    os.getenv('RENDER')
    or os.getenv('RENDER_SERVICE_ID')
    or os.getenv('RENDER_EXTERNAL_HOSTNAME')
)
is_production = app_env == 'production' or is_render_host

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
    'http://localhost:5176,https://capstonedesign-spring2026-ulsancollege.github.io',
)
CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', '').strip()
CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '').strip()
# Accept the correct key and the common Render typo as a fallback.
CLOUDINARY_API_SECRET = os.getenv(
    'CLOUDINARY_API_SECRET',
    os.getenv('CLOUDINARY_API_SECRECT', ''),
).strip()
CLOUDINARY_UPLOAD_FOLDER = os.getenv(
    'CLOUDINARY_UPLOAD_FOLDER',
    'campus-marketplace',
).strip('/')

if not MONGODB_URI:
    raise RuntimeError('MONGODB_URI is required')

use_cloudinary = bool(
    CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
)
if use_cloudinary and cloudinary is None:
    raise RuntimeError(
        'Cloudinary is configured but SDK is not installed. '
        'Install dependency: cloudinary'
    )
if use_cloudinary and cloudinary is not None:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )
elif is_production:
    raise RuntimeError(
        'Cloudinary must be configured in production so uploaded images do not disappear after Render restarts.'
    )

IMAGE_STORAGE_MODE = 'cloudinary' if use_cloudinary else 'local-disk'

# Email and SMTP configuration
SMTP_HOST = os.getenv('SMTP_HOST', '').strip()
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER', '').strip()
SMTP_PASS = os.getenv('SMTP_PASS', '').strip()
EMAIL_FROM = os.getenv('EMAIL_FROM', SMTP_USER).strip()
OTP_TTL_SECONDS = int(os.getenv('OTP_TTL_SECONDS', '600'))  # OTP expires in 10 minutes
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '').strip()
SENDGRID_FROM = os.getenv('SENDGRID_FROM', EMAIL_FROM).strip()
RESEND_COOLDOWN_SECONDS = int(os.getenv('RESEND_COOLDOWN_SECONDS', '120'))  # 2 minutes default

# Connect to MongoDB database
client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=8000,
    connectTimeoutMS=8000,
    tlsCAFile=certifi.where(),
)
db = client[MONGODB_DB_NAME]
users = db.users
pending_signups = db.pending_signups
items = db.items
message_threads = db.message_threads
message_messages = db.message_messages
# Adopt richer status values for listings
ITEM_STATUSES = {'draft', 'active', 'reserved', 'sold', 'removed'}


def ensure_items_collection_schema():
    """Ensure the items collection has JSON schema validation."""
    items_validator = {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': [
                'title',
                'description',
                'price',
                'images',
                'seller_id',
                'status',
                'createdAt',
                'updatedAt',
            ],
            'properties': {
                'title': {'bsonType': 'string', 'minLength': 1},
                'description': {'bsonType': 'string', 'minLength': 1},
                # Allow either a numeric price OR a richer price object {amount, currency}
                'price': {
                    'anyOf': [
                        {'bsonType': ['double', 'int', 'long', 'decimal'], 'minimum': 0},
                        {
                            'bsonType': 'object',
                            'required': ['amount', 'currency'],
                            'properties': {
                                'amount': {
                                    'bsonType': ['double', 'int', 'long', 'decimal'],
                                    'minimum': 0,
                                },
                                'currency': {'bsonType': 'string', 'minLength': 2},
                            },
                        },
                    ]
                },
                'category': {'bsonType': ['string', 'null']},
                # Images may be legacy strings or modern objects with url/alt/order
                'images': {
                    'bsonType': 'array',
                    'minItems': 1,
                    'items': {
                        'anyOf': [
                            {'bsonType': 'string', 'minLength': 1},
                            {
                                'bsonType': 'object',
                                'required': ['url'],
                                'properties': {
                                    'url': {'bsonType': 'string', 'minLength': 1},
                                    'alt': {'bsonType': ['string', 'null']},
                                    'order': {'bsonType': ['int', 'long']},
                                },
                            },
                        ]
                    },
                },
                'seller_id': {'bsonType': 'objectId'},
                'seller_verified': {'bsonType': 'bool'},
                'status': {'enum': list(ITEM_STATUSES)},
                'condition': {'bsonType': ['string', 'null']},
                'location': {'bsonType': ['string', 'null']},
                'tags': {'bsonType': ['array'], 'items': {'bsonType': 'string'}},
                'views': {'bsonType': ['int', 'long'], 'minimum': 0},
                'favoritesCount': {'bsonType': ['int', 'long'], 'minimum': 0},
                'createdAt': {'bsonType': 'date'},
                'updatedAt': {'bsonType': 'date'},
                'soldAt': {'bsonType': ['date', 'null']},
                'expiresAt': {'bsonType': ['date', 'null']},
            },
        }
    }


def generate_otp(length=6):
    from random import randint

    # Generate a zero-padded numeric OTP
    max_val = 10 ** length - 1
    val = randint(0, max_val)
    return str(val).zfill(length)


def send_email(to_address, subject, body_text, body_html=None):
    """Send a simple email using SMTP if configured. In development, logs to console."""
    # Prefer SendGrid API when configured
    if SENDGRID_API_KEY:
        payload = {
            'personalizations': [{'to': [{'email': to_address}], 'subject': subject}],
            'from': {'email': SENDGRID_FROM or EMAIL_FROM},
            'content': [{'type': 'text/plain', 'value': body_text}],
        }
        if body_html:
            payload['content'] = [
                {'type': 'text/plain', 'value': body_text},
                {'type': 'text/html', 'value': body_html},
            ]

        try:
            resp = requests.post(
                'https://api.sendgrid.com/v3/mail/send',
                headers={
                    'Authorization': f'Bearer {SENDGRID_API_KEY}',
                    'Content-Type': 'application/json',
                },
                json=payload,
                timeout=10,
            )
            if resp.status_code >= 200 and resp.status_code < 300:
                return True
            print('SendGrid send failed:', resp.status_code, resp.text)
        except Exception as exc:
            print('SendGrid exception:', exc)

    # Fallback to SMTP if configured
    if SMTP_HOST and SMTP_USER and SMTP_PASS:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = EMAIL_FROM
        msg['To'] = to_address
        msg.set_content(body_text)
        if body_html:
            msg.add_alternative(body_html, subtype='html')

        try:
            context = ssl.create_default_context()
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
            return True
        except Exception as exc:
            print('Failed to send email via SMTP:', exc)

    # Development fallback: log message
    print('Email not sent (no provider configured). To:', to_address)
    print('Subject:', subject)
    print('Body:', body_text)
    return False


def send_verification_otp(user_email, otp_code):
    subject = 'Your Campus Marketplace verification code'
    body = f'Your verification code is: {otp_code}\n\nIt will expire in {OTP_TTL_SECONDS // 60} minutes.'
    html = f'<p>Your verification code is: <strong>{otp_code}</strong></p><p>It will expire in {OTP_TTL_SECONDS // 60} minutes.</p>'
    return send_email(user_email, subject, body, html)

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


def ensure_messages_collection_schema():
    """Ensure the messaging collections exist with light validation."""
    thread_validator = {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': [
                'item_id',
                'buyer_id',
                'seller_id',
                'participants',
                'createdAt',
                'updatedAt',
            ],
            'properties': {
                'item_id': {'bsonType': 'objectId'},
                'buyer_id': {'bsonType': 'objectId'},
                'seller_id': {'bsonType': 'objectId'},
                'participants': {
                    'bsonType': 'array',
                    'minItems': 2,
                    'items': {'bsonType': 'objectId'},
                },
                'buyer_name': {'bsonType': ['string', 'null']},
                'seller_name': {'bsonType': ['string', 'null']},
                'item_title': {'bsonType': ['string', 'null']},
                'item_status': {'bsonType': ['string', 'null']},
                'item_image': {'bsonType': ['string', 'null']},
                'latest_message': {'bsonType': ['string', 'null']},
                'latest_message_at': {'bsonType': ['date', 'null']},
                'createdAt': {'bsonType': 'date'},
                'updatedAt': {'bsonType': 'date'},
            },
        }
    }

    message_validator = {
        '$jsonSchema': {
            'bsonType': 'object',
            'required': ['thread_id', 'sender_id', 'body', 'createdAt'],
            'properties': {
                'thread_id': {'bsonType': 'objectId'},
                'sender_id': {'bsonType': 'objectId'},
                'sender_name': {'bsonType': ['string', 'null']},
                'body': {'bsonType': 'string', 'minLength': 1},
                'createdAt': {'bsonType': 'date'},
            },
        }
    }

    collection_names = db.list_collection_names()
    if 'message_threads' in collection_names:
        try:
            db.command({
                'collMod': 'message_threads',
                'validator': thread_validator,
                'validationLevel': 'moderate',
            })
        except OperationFailure:
            pass
    else:
        db.create_collection(
            'message_threads',
            validator=thread_validator,
            validationLevel='moderate',
        )

    if 'message_messages' in collection_names:
        try:
            db.command({
                'collMod': 'message_messages',
                'validator': message_validator,
                'validationLevel': 'moderate',
            })
        except OperationFailure:
            pass
    else:
        db.create_collection(
            'message_messages',
            validator=message_validator,
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
        first = images[0]
        # If images are objects with 'url', expose legacy `image` as URL string.
        if isinstance(first, dict):
            item_doc['image'] = first.get('url')
        else:
            item_doc['image'] = first
    elif item_doc.get('image'):
        image_value = item_doc.get('image')
        if isinstance(image_value, dict):
            item_doc['image'] = image_value.get('url')
            item_doc['images'] = [image_value]
        else:
            item_doc['images'] = [image_value]
    else:
        item_doc['images'] = []
        item_doc['image'] = None

    # Normalize image URLs to absolute so the frontend can reliably load them.
    image_val = item_doc.get('image')
    if isinstance(image_val, str) and image_val:
        # If it's not already an absolute URL, and we're in a request context,
        # prefix with the current host URL so clients receive a stable absolute URL.
        if not re.match(r'^https?://', image_val) and has_request_context():
            base = request.host_url.rstrip('/')
            item_doc['image'] = f"{base}/{image_val.lstrip('/')}"

    # Also normalize any images entries that are plain strings to absolute URLs.
    if isinstance(item_doc.get('images'), list) and has_request_context():
        normalized = []
        base = request.host_url.rstrip('/')
        for v in item_doc.get('images'):
            if isinstance(v, str) and v and not re.match(r'^https?://', v) and not v.startswith('data:') and not v.startswith('blob:'):
                normalized.append(f"{base}/{v.lstrip('/')}")
            else:
                normalized.append(v)
        item_doc['images'] = normalized

    # Normalize price: keep numeric `price` for frontend compatibility,
    # expose `price_currency` if a richer price object exists.
    raw_price = item_doc.get('price')
    if isinstance(raw_price, dict):
        amount = raw_price.get('amount')
        currency = raw_price.get('currency')
        try:
            item_doc['price'] = float(amount) if amount is not None else None
        except Exception:
            item_doc['price'] = amount
        if currency:
            item_doc['price_currency'] = currency

    for dt_field in ('createdAt', 'updatedAt', 'soldAt', 'expiresAt'):
        if dt_field in item_doc and hasattr(item_doc[dt_field], 'isoformat'):
            item_doc[dt_field] = item_doc[dt_field].isoformat()

    # Attach seller avatar URL (public-facing) when possible so clients
    # can render profile pictures without additional lookups.
    try:
        seller_id_str = item_doc.get('seller_id') or item_doc.get('sellerId')
        if seller_id_str:
            seller_oid = parse_object_id(seller_id_str)
            if seller_oid:
                seller_doc = users.find_one({'_id': seller_oid})
                if seller_doc:
                    avatar_val = seller_doc.get('avatar') or seller_doc.get('avatarUrl')
                    if avatar_val:
                        if isinstance(avatar_val, str) and avatar_val.strip():
                            if re.match(r'^https?://', avatar_val):
                                item_doc['sellerAvatarUrl'] = avatar_val
                            elif has_request_context():
                                item_doc['sellerAvatarUrl'] = f"{request.host_url.rstrip('/')}/api/uploads/{str(avatar_val).lstrip('/')}"
                    else:
                        item_doc['sellerAvatarUrl'] = ''
    except Exception:
        # Fail gracefully if lookups fail; don't block item serialization.
        pass

    return item_doc


def serialize_message_thread_document(thread_doc, current_user_id=None):
    thread_doc['_id'] = str(thread_doc['_id'])
    for field in ('item_id', 'buyer_id', 'seller_id'):
        if field in thread_doc and thread_doc[field] is not None:
            thread_doc[field] = str(thread_doc[field])
    if isinstance(thread_doc.get('participants'), list):
        thread_doc['participants'] = [str(participant) for participant in thread_doc['participants'] if participant is not None]
    if current_user_id:
        current_user_str = str(current_user_id)
        if thread_doc.get('buyer_id') == current_user_str:
            thread_doc['other_user_id'] = thread_doc.get('seller_id')
            thread_doc['other_user_name'] = thread_doc.get('seller_name', 'Seller')
            thread_doc['current_user_role'] = 'buyer'
        else:
            thread_doc['other_user_id'] = thread_doc.get('buyer_id')
            thread_doc['other_user_name'] = thread_doc.get('buyer_name', 'Buyer')
            thread_doc['current_user_role'] = 'seller'
    if 'latest_message_at' in thread_doc and hasattr(thread_doc['latest_message_at'], 'isoformat'):
        thread_doc['latest_message_at'] = thread_doc['latest_message_at'].isoformat()
    if 'createdAt' in thread_doc and hasattr(thread_doc['createdAt'], 'isoformat'):
        thread_doc['createdAt'] = thread_doc['createdAt'].isoformat()
    if 'updatedAt' in thread_doc and hasattr(thread_doc['updatedAt'], 'isoformat'):
        thread_doc['updatedAt'] = thread_doc['updatedAt'].isoformat()
    return thread_doc


def serialize_message_document(message_doc):
    message_doc['_id'] = str(message_doc['_id'])
    message_doc['thread_id'] = str(message_doc['thread_id'])
    message_doc['sender_id'] = str(message_doc['sender_id'])
    if 'createdAt' in message_doc and hasattr(message_doc['createdAt'], 'isoformat'):
        message_doc['createdAt'] = message_doc['createdAt'].isoformat()
    return message_doc


try:
    client.admin.command('ping')
    users.create_index('email', unique=True)
    try:
        pending_signups.create_index('email', unique=True)
    except Exception:
        pass
    ensure_items_collection_schema()
    ensure_messages_collection_schema()
    items = db.items
    items.create_index([('seller_id', 1), ('createdAt', -1)])
    items.create_index([('status', 1), ('createdAt', -1)])
    items.create_index([('category', 1), ('status', 1), ('createdAt', -1)])
    items.create_index([('createdAt', -1)])
    # Index price for range queries (supports numeric price or price.amount)
    try:
        items.create_index([('price', 1)])
    except Exception:
        pass
    try:
        items.create_index([('price.amount', 1)])
    except Exception:
        pass
    # Text index for search on title and description
    try:
        items.create_index([('title', 'text'), ('description', 'text')], name='items_text_idx')
    except Exception:
        pass
    try:
        message_threads.create_index([('item_id', 1), ('buyer_id', 1)], unique=True)
        message_threads.create_index([('participants', 1), ('updatedAt', -1)])
        message_threads.create_index([('updatedAt', -1)])
    except Exception:
        pass
    try:
        message_messages.create_index([('thread_id', 1), ('createdAt', 1)])
    except Exception:
        pass
except Exception as exc:
    raise RuntimeError(
        'MongoDB connection failed. Check Atlas username/password and '
        'Network Access IP allowlist.'
    ) from exc

# Initialize Flask application
app = Flask(__name__)
upload_dir_env = os.getenv('UPLOAD_DIR', '').strip()
if upload_dir_env:
    upload_path = Path(upload_dir_env)
    if not upload_path.is_absolute():
        upload_path = Path(__file__).resolve().parent / upload_path
else:
    upload_path = Path(__file__).resolve().parent / 'uploads'

# Configure upload folder path
UPLOAD_FOLDER = upload_path.resolve()
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

# Maximum image upload size: 5MB
MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.avif',
    '.bmp',
    '.tif',
    '.tiff',
    '.heic',
    '.heif',
    '.ico',
}
ALLOWED_IMAGE_MIMETYPES = {
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/bmp',
    'image/tiff',
    'image/heic',
    'image/heif',
    'image/x-icon',
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
# For development, enable permissive CORS so local frontend dev servers
# (different ports/hosts like localhost vs 127.0.0.1) can interact without
# failing preflight checks. In production we continue to restrict to
# configured frontend origins.
if is_production:
    CORS(app, resources={r'/api/*': {'origins': allowed_origins}})
else:
    CORS(app, resources={r'/api/*': {'origins': '*'}})


def json_error(message, status_code):
    return jsonify({'error': message}), status_code


def upload_image_to_storage(uploaded_file, folder):
    safe_filename = secure_filename(uploaded_file.filename)
    if not safe_filename:
        return None, json_error('The uploaded filename is not valid.', 400)

    file_extension = os.path.splitext(safe_filename)[1].lower()
    if file_extension not in ALLOWED_IMAGE_EXTENSIONS:
        return None, json_error(
            'Only supported image formats are allowed '
            '(JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, HEIF, ICO).',
            400,
        )

    if uploaded_file.mimetype not in ALLOWED_IMAGE_MIMETYPES:
        return None, json_error('Only image uploads are allowed.', 400)

    if request.content_length and request.content_length > MAX_IMAGE_UPLOAD_BYTES:
        return None, json_error('Image must be smaller than 5 MB.', 413)

    if use_cloudinary:
        cloudinary_folder = '/'.join(
            part.strip('/') for part in [CLOUDINARY_UPLOAD_FOLDER, folder] if part
        )
        upload_result = cloudinary.uploader.upload(
            uploaded_file.stream,
            folder=cloudinary_folder,
            resource_type='image',
            public_id=f"{uuid4().hex}-{os.path.splitext(safe_filename)[0]}",
            overwrite=False,
        )
        return {
            'filename': upload_result.get('public_id') or safe_filename,
            'url': upload_result.get('secure_url'),
            'public_id': upload_result.get('public_id'),
            'storage': 'cloudinary',
        }, None

    if is_production:
        return None, json_error(
            'Image uploads require Cloudinary in production. Local disk storage on Render is ephemeral.',
            500,
        )

    stored_filename = f"{uuid4().hex}-{safe_filename}"
    stored_path = UPLOAD_FOLDER / stored_filename
    uploaded_file.save(stored_path)
    file_url = f"{request.host_url.rstrip('/')}/api/uploads/{stored_filename}"

    return {
        'filename': stored_filename,
        'url': file_url,
        'public_id': None,
        'storage': 'local',
    }, None


@app.errorhandler(RequestEntityTooLarge)
def handle_request_too_large(_error):
    return json_error('Image must be smaller than 5 MB.', 413)


def normalize_email(email):
    return email.strip().lower()


def ensure_utc_datetime(value):
    if not isinstance(value, datetime):
        return None
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def get_verification_record(email):
    pending_doc = pending_signups.find_one({'email': email})
    if pending_doc:
        return pending_doc, pending_signups

    user_doc = users.find_one({'email': email})
    if user_doc and not user_doc.get('isVerified'):
        return user_doc, users

    return None, None


def format_resend_available_at(sent_at):
    sent_at = ensure_utc_datetime(sent_at)
    if not sent_at:
        return None
    return (
        sent_at + timedelta(seconds=RESEND_COOLDOWN_SECONDS)
    ).isoformat()


def build_user_payload(user_doc):
    payment_methods = user_doc.get('paymentMethods', [])
    if not isinstance(payment_methods, list):
        payment_methods = []

    favorite_item_ids = user_doc.get('favoriteItemIds', [])
    if not isinstance(favorite_item_ids, list):
        favorite_item_ids = []

    normalized_favorite_item_ids = []
    for item_id in favorite_item_ids:
        item_id_str = str(item_id).strip()
        if item_id_str and item_id_str not in normalized_favorite_item_ids:
            normalized_favorite_item_ids.append(item_id_str)

    reviews = user_doc.get('reviews', [])
    if not isinstance(reviews, list):
        reviews = []

    serialized_reviews = []
    total_rating = 0
    rating_count = 0
    for review in reviews:
        if not isinstance(review, dict):
            continue

        serialized_review = serialize_review_document(dict(review))
        if serialized_review:
            serialized_reviews.append(serialized_review)
            rating_value = serialized_review.get('rating')
            if isinstance(rating_value, (int, float)):
                total_rating += rating_value
                rating_count += 1

    average_rating = round(total_rating / rating_count, 1) if rating_count else 0

    return {
        'id': str(user_doc['_id']),
        'firstName': user_doc['firstName'],
        'middleName': user_doc.get('middleName', ''),
        'lastName': user_doc['lastName'],
        'email': user_doc['email'],
        'isVerified': user_doc.get('isVerified', False),
        'location': user_doc.get('location', ''),
        'avatar': user_doc.get('avatar', ''),
        'paymentMethods': payment_methods,
        'favoriteItemIds': normalized_favorite_item_ids,
        'reviews': serialized_reviews,
        'reviewCount': rating_count,
        'averageRating': average_rating,
    }


def serialize_review_document(review_doc):
    review_doc['_id'] = str(review_doc.get('_id') or review_doc.get('id') or uuid4())
    if review_doc.get('reviewerId') is not None:
        review_doc['reviewerId'] = str(review_doc['reviewerId'])
    if review_doc.get('authorId') is not None:
        review_doc['authorId'] = str(review_doc['authorId'])
    if review_doc.get('author_id') is not None:
        review_doc['author_id'] = str(review_doc['author_id'])
    if review_doc.get('sellerId') is not None:
        review_doc['sellerId'] = str(review_doc['sellerId'])
    if review_doc.get('seller_id') is not None:
        review_doc['seller_id'] = str(review_doc['seller_id'])

    rating_value = review_doc.get('rating', 0)
    try:
        review_doc['rating'] = max(1, min(5, int(rating_value)))
    except Exception:
        review_doc['rating'] = 0

    review_doc['comment'] = str(review_doc.get('comment', '')).strip()

    for field in ('createdAt', 'updatedAt'):
        if field in review_doc and hasattr(review_doc[field], 'isoformat'):
            review_doc[field] = review_doc[field].isoformat()

    if not review_doc['comment']:
        review_doc['comment'] = ''

    return review_doc


def get_favorite_item_ids(user_doc):
    favorite_item_ids = user_doc.get('favoriteItemIds', [])
    if not isinstance(favorite_item_ids, list):
        return []

    normalized = []
    for item_id in favorite_item_ids:
        item_id_str = str(item_id).strip()
        if item_id_str and item_id_str not in normalized:
            normalized.append(item_id_str)

    return normalized


def annotate_item_favorite_state(item_doc, favorite_item_ids):
    item_id = str(item_doc.get('_id'))
    is_favorite = item_id in favorite_item_ids
    item_doc['isLoved'] = is_favorite
    item_doc['isFavorited'] = is_favorite
    item_doc['isLiked'] = is_favorite
    item_doc['liked'] = is_favorite
    return item_doc


def get_safe_payment_methods(user_doc):
    methods = user_doc.get('paymentMethods', [])
    if not isinstance(methods, list):
        return []

    safe_methods = []
    allowed_keys = {'id', 'label', 'type', 'provider', 'last4', 'isDefault'}
    for method in methods:
        if isinstance(method, dict):
            safe_methods.append({key: method[key] for key in allowed_keys if key in method and method[key] is not None})
        elif isinstance(method, str) and method.strip():
            safe_methods.append({'label': method.strip()})

    return safe_methods


def fetch_user_activity(user_id):
    sell_history = list(
        items.find({'seller_id': user_id})
        .sort('createdAt', -1)
        .limit(20)
    )

    buy_query = {
        '$or': [
            {'buyer_id': user_id},
            {'buyerId': user_id},
            {'purchasedBy': user_id},
            {'purchased_by': user_id},
        ]
    }
    buy_history = list(
        items.find(buy_query)
        .sort('createdAt', -1)
        .limit(20)
    )

    return {
        'buyHistory': [serialize_item_document(item) for item in buy_history],
        'sellHistory': [serialize_item_document(item) for item in sell_history],
    }


def fetch_favorite_items(user_doc):
    favorite_item_ids = get_favorite_item_ids(user_doc)
    if not favorite_item_ids:
        return []

    favorite_item_oids = [
        item_oid for item_oid in (parse_object_id(item_id) for item_id in favorite_item_ids)
        if item_oid
    ]
    if not favorite_item_oids:
        return []

    favorite_items = list(items.find({'_id': {'$in': favorite_item_oids}}))
    favorite_lookup = {str(item['_id']): item for item in favorite_items}
    ordered_items = [
        favorite_lookup[item_id]
        for item_id in favorite_item_ids
        if item_id in favorite_lookup
    ]
    return [serialize_item_document(item) for item in ordered_items]


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

# Generate JWT authentication token
def issue_token(user_doc):
    payload = {
        'sub': str(user_doc['_id']),
        'email': user_doc['email'],
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRES_HOURS),
        'iat': datetime.now(timezone.utc),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm='HS256')


def get_current_user_from_request():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, None, json_error('Missing bearer token.', 401)

    token = auth_header.removeprefix('Bearer ').strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return None, None, json_error('Invalid or expired token.', 401)

    user_id = parse_object_id(payload.get('sub'))
    if not user_id:
        return None, None, json_error('Invalid or expired token.', 401)

    user_doc = users.find_one({'_id': user_id})
    if not user_doc:
        return None, None, json_error('Invalid or expired token.', 401)

    return user_id, user_doc, None


def get_optional_current_user_from_request():
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, None, None

    token = auth_header.removeprefix('Bearer ').strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return None, None, json_error('Invalid or expired token.', 401)

    user_id = parse_object_id(payload.get('sub'))
    if not user_id:
        return None, None, json_error('Invalid or expired token.', 401)

    user_doc = users.find_one({'_id': user_id})
    if not user_doc:
        return None, None, json_error('Invalid or expired token.', 401)

    return user_id, user_doc, None


def build_message_thread_payload(thread_doc, current_user_id=None):
    payload = dict(thread_doc)
    payload = serialize_message_thread_document(payload, current_user_id=current_user_id)
    payload['buyerName'] = thread_doc.get('buyer_name', 'Buyer')
    payload['sellerName'] = thread_doc.get('seller_name', 'Seller')
    payload['itemTitle'] = thread_doc.get('item_title', '')
    payload['itemStatus'] = thread_doc.get('item_status', '')
    payload['itemImage'] = thread_doc.get('item_image', '')
    payload['latestMessage'] = thread_doc.get('latest_message', '')
    payload['latestMessageAt'] = payload.pop('latest_message_at', None)
    # Compute unread count for the current user (messages with createdAt > last_read)
    try:
        thread_oid = thread_doc.get('_id')
        # thread_doc may have stringified _id after serialize; attempt to parse
        if isinstance(thread_oid, str):
            thread_oid = parse_object_id(thread_oid)
    except Exception:
        thread_oid = None

    unread_count = 0
    if current_user_id and thread_oid:
        try:
            last_read_map = thread_doc.get('last_read', {}) or {}
            last_read_str = last_read_map.get(str(current_user_id))
            if last_read_str:
                try:
                    last_read_dt = datetime.fromisoformat(last_read_str.replace('Z', '+00:00'))
                except Exception:
                    last_read_dt = None
            else:
                last_read_dt = None

            query = {'thread_id': thread_oid}
            if last_read_dt:
                query['createdAt'] = {'$gt': last_read_dt}

            unread_count = message_messages.count_documents(query)
        except Exception:
            unread_count = 0

    payload['unreadCount'] = int(unread_count)
    return payload


@app.get('/api/health')
def health_check():
    try:
        client.admin.command('ping')
        return jsonify({
            'ok': True,
            'database': MONGODB_DB_NAME,
            'imageStorage': IMAGE_STORAGE_MODE,
            'cloudinaryConfigured': use_cloudinary,
        })
    except Exception as exc:  # Simple database connection diagnostic
        return json_error(f'Database connection failed: {exc}', 500)


@app.get('/api/uploads/<path:filename>')
def serve_uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


@app.post('/api/uploads/image')
def upload_image():
    uploaded_file = request.files.get('image') or request.files.get('file')
    if not uploaded_file or not uploaded_file.filename:
        return json_error('An image file is required.', 400)

    upload_data, error_response = upload_image_to_storage(uploaded_file, 'listings')
    if error_response is not None:
        return error_response

    return jsonify({
        'message': 'Image uploaded successfully.',
        'filename': upload_data['filename'],
        'url': upload_data['url'],
        'storage': upload_data['storage'],
    }), 201


@app.post('/api/profile/avatar')
def upload_profile_avatar():
    """Upload and attach an avatar image to the authenticated user's profile."""
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

    uploaded_file = request.files.get('image') or request.files.get('avatar')
    if not uploaded_file or not uploaded_file.filename:
        return json_error('An image file is required.', 400)

    upload_data, error_response = upload_image_to_storage(uploaded_file, 'avatars')
    if error_response is not None:
        return error_response

    try:
        users.update_one(
            {'_id': user_id},
            {
                '$set': {
                    'avatar': upload_data['url']
                    if upload_data['storage'] == 'cloudinary'
                    else upload_data['filename'],
                    'avatar_public_id': upload_data['public_id'],
                    'updatedAt': datetime.now(timezone.utc),
                }
            },
        )
    except Exception as exc:
        return json_error(f'Failed to attach avatar to profile: {str(exc)}', 500)

    return jsonify({
        'message': 'Avatar uploaded successfully.',
        'filename': upload_data['filename'],
        'url': upload_data['url'],
        'storage': upload_data['storage'],
    }), 201


@app.delete('/api/profile/avatar')
def delete_profile_avatar():
    """Remove a user's avatar file and clear the avatar field from their profile."""
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

    avatar_val = user_doc.get('avatar')
    if not avatar_val:
        return json_error('No avatar to delete.', 400)

    avatar_public_id = user_doc.get('avatar_public_id')
    if avatar_public_id and use_cloudinary:
        try:
            cloudinary.uploader.destroy(avatar_public_id, resource_type='image')
        except Exception:
            pass
    elif isinstance(avatar_val, str) and avatar_val and not re.match(r'^https?://', avatar_val):
        # Attempt to delete old local avatar files.
        try:
            file_path = UPLOAD_FOLDER / str(avatar_val)
            if file_path.exists():
                file_path.unlink()
        except Exception:
            pass

    try:
        users.update_one(
            {'_id': user_id},
            {
                '$unset': {'avatar': '', 'avatar_public_id': ''},
                '$set': {'updatedAt': datetime.now(timezone.utc)},
            },
        )
    except Exception as exc:
        return json_error(f'Failed to clear avatar from profile: {str(exc)}', 500)

    return jsonify({'message': 'Avatar removed.'})

# User signup endpoint
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

    existing_user = users.find_one({'email': email})
    if existing_user and existing_user.get('isVerified'):
        return json_error('An account with this email already exists.', 409)

    otp = generate_otp()
    now = datetime.now(timezone.utc)
    pending_doc = {
        'firstName': first_name,
        'middleName': middle_name,
        'lastName': last_name,
        'email': email,
        'passwordHash': generate_password_hash(password),
        'emailOtp': otp,
        'emailOtpExpiresAt': now + timedelta(seconds=OTP_TTL_SECONDS),
        'emailOtpSentAt': now,
        'createdAt': now,
        'updatedAt': now,
    }

    try:
        pending_signups.update_one(
            {'email': email},
            {
                '$set': {
                    'firstName': first_name,
                    'middleName': middle_name,
                    'lastName': last_name,
                    'email': email,
                    'passwordHash': pending_doc['passwordHash'],
                    'emailOtp': otp,
                    'emailOtpExpiresAt': pending_doc['emailOtpExpiresAt'],
                    'emailOtpSentAt': now,
                    'updatedAt': now,
                },
                '$setOnInsert': {'createdAt': now},
            },
            upsert=True,
        )
    except DuplicateKeyError:
        return json_error('A verification request already exists for this email.', 409)

    saved_pending = pending_signups.find_one({'email': email})
    otp_sent = send_verification_otp(email, saved_pending.get('emailOtp'))
    if not otp_sent:
        return json_error(
            'Verification code could not be sent. Check SendGrid/SMTP settings and the verified sender address.',
            502,
        )

    resend_available_at = format_resend_available_at(
        saved_pending.get('emailOtpSentAt')
    )

    return jsonify({
        'message': 'Verification code sent. Your account will be created after OTP verification.',
        'requiresVerification': True,
        'email': email,
        'resendAvailableAt': resend_available_at,
    }), 201

# User login endpoint
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



@app.post('/api/auth/verify-email-otp')
def verify_email_otp():
    data = request.get_json(silent=True) or {}
    email = normalize_email(str(data.get('email', '')))
    otp = str(data.get('otp', '')).strip()

    if not email or not otp:
        return json_error('Email and OTP are required.', 400)

    signup_doc, signup_collection = get_verification_record(email)
    if not signup_doc:
        return json_error('Invalid email or OTP.', 400)

    if signup_collection is users and signup_doc.get('isVerified'):
        return json_error('Email already verified.', 400)

    stored_otp = signup_doc.get('emailOtp')
    expires_at = ensure_utc_datetime(signup_doc.get('emailOtpExpiresAt'))
    now = datetime.now(timezone.utc)

    if not stored_otp or not expires_at or now > expires_at:
        return json_error('OTP expired or not found. Request a new code.', 400)

    if otp != stored_otp:
        return json_error('Invalid OTP.', 400)

    if signup_collection is pending_signups:
        created_user = {
            'firstName': signup_doc['firstName'],
            'middleName': signup_doc.get('middleName', ''),
            'lastName': signup_doc['lastName'],
            'email': signup_doc['email'],
            'passwordHash': signup_doc['passwordHash'],
            'isVerified': True,
            'favoriteItemIds': [],
            'createdAt': now,
            'updatedAt': now,
        }
        users.insert_one(created_user)
        pending_signups.delete_one({'_id': signup_doc['_id']})
        user_doc = users.find_one({'email': email})
    else:
        # Legacy path for older unverified users already stored in users.
        users.update_one(
            {'_id': signup_doc['_id']},
            {
                '$set': {'isVerified': True, 'updatedAt': now},
                '$unset': {'emailOtp': '', 'emailOtpExpiresAt': '', 'emailOtpSentAt': ''},
            },
        )
        user_doc = users.find_one({'_id': signup_doc['_id']})
    token = issue_token(user_doc)

    return jsonify({
        'message': 'Email verified.',
        'token': token,
        'user': build_user_payload(user_doc),
    })


@app.post('/api/auth/resend-email-otp')
def resend_email_otp():
    data = request.get_json(silent=True) or {}
    email = normalize_email(str(data.get('email', '')))

    if not email:
        return json_error('Email is required.', 400)

    signup_doc, signup_collection = get_verification_record(email)
    if not signup_doc:
        return json_error('No account found for that email.', 404)

    if signup_collection is users and signup_doc.get('isVerified'):
        return json_error('Account already verified.', 400)

    now = datetime.now(timezone.utc)
    last_sent = ensure_utc_datetime(signup_doc.get('emailOtpSentAt'))
    if last_sent:
        elapsed = (now - last_sent).total_seconds()
        if elapsed < RESEND_COOLDOWN_SECONDS:
            retry_after = int(RESEND_COOLDOWN_SECONDS - elapsed)
            return json_error(f'Please wait {retry_after} seconds before requesting a new code.', 429)

    otp = generate_otp()
    expires_at = now + timedelta(seconds=OTP_TTL_SECONDS)

    update_fields = {
        'emailOtp': otp,
        'emailOtpExpiresAt': expires_at,
        'emailOtpSentAt': now,
        'updatedAt': now,
    }
    signup_collection.update_one(
        {'_id': signup_doc['_id']},
        {'$set': update_fields},
    )

    otp_sent = send_verification_otp(email, otp)
    if not otp_sent:
        return json_error(
            'Verification code could not be resent. Check SendGrid/SMTP settings and the verified sender address.',
            502,
        )

    resend_available_at = format_resend_available_at(now)
    return jsonify({'message': 'Verification code resent.', 'resendAvailableAt': resend_available_at})


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

# Fetch authenticated user profile
@app.get('/api/profile')
def profile_summary():
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

    activity = fetch_user_activity(user_id)
    user_payload = build_user_payload(user_doc)
    user_payload['paymentMethods'] = get_safe_payment_methods(user_doc)
    user_payload['favoriteItemIds'] = get_favorite_item_ids(user_doc)
    favorite_items = fetch_favorite_items(user_doc)

    # Expose avatarUrl as an absolute URL when available so frontend can load it.
    avatar_val = user_doc.get('avatar') or user_doc.get('avatarUrl')
    if avatar_val:
        if isinstance(avatar_val, str) and avatar_val.strip():
            if re.match(r'^https?://', avatar_val):
                user_payload['avatarUrl'] = avatar_val
            else:
                user_payload['avatarUrl'] = f"{request.host_url.rstrip('/')}/api/uploads/{str(avatar_val).lstrip('/')}"
    else:
        user_payload['avatarUrl'] = ''

    return jsonify({
        'user': user_payload,
        'profile': {
            'location': user_doc.get('location', ''),
            'paymentMethods': get_safe_payment_methods(user_doc),
            'sellCount': len(activity['sellHistory']),
            'buyCount': len(activity['buyHistory']),
            'favoriteCount': len(favorite_items),
        },
        'buyHistory': activity['buyHistory'],
        'sellHistory': activity['sellHistory'],
        'favoriteItems': favorite_items,
    })


@app.put('/api/profile')
def update_profile():
    """Update basic profile fields for the current authenticated user.

    Accepts JSON body with optional keys: firstName, lastName, location
    Returns the updated user payload on success.
    """
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

    data = request.get_json(silent=True) or {}
    updates = {}
    if 'firstName' in data:
        fn = str(data.get('firstName', '')).strip()
        if fn:
            updates['firstName'] = fn
    if 'lastName' in data:
        ln = str(data.get('lastName', '')).strip()
        if ln:
            updates['lastName'] = ln
    if 'location' in data:
        loc = str(data.get('location', '')).strip()
        updates['location'] = loc

    if not updates:
        return json_error('No profile fields provided to update.', 400)

    updates['updatedAt'] = datetime.now(timezone.utc)

    try:
        users.update_one({'_id': user_id}, {'$set': updates})
    except Exception as exc:
        return json_error(f'Failed to update profile: {str(exc)}', 500)

    updated_user_doc = users.find_one({'_id': user_id})
    return jsonify({'user': build_user_payload(updated_user_doc)})


@app.put('/api/profile/password')
def update_profile_password():
    user_id, user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}
    current_password = str(data.get('currentPassword', '')).strip()
    new_password = str(data.get('password') or data.get('newPassword') or '').strip()

    if not current_password:
        return json_error('Current password is required.', 400)
    if not new_password:
        return json_error('New password is required.', 400)

    if not check_password_hash(user_doc['passwordHash'], current_password):
        return json_error('Current password is incorrect.', 400)

    is_valid, error_msg = is_strong_password(new_password)
    if not is_valid:
        return json_error(error_msg, 400)

    try:
        users.update_one(
            {'_id': user_id},
            {
                '$set': {
                    'passwordHash': generate_password_hash(new_password),
                    'updatedAt': datetime.now(timezone.utc),
                }
            },
        )
    except Exception as exc:
        return json_error(f'Failed to update password: {str(exc)}', 500)

    return jsonify({'message': 'Password updated successfully.'})

# Retrieve user message threads
@app.get('/api/messages/threads')
def get_message_threads():
    user_id, _user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    thread_docs = list(
        message_threads.find({'participants': user_id}).sort('updatedAt', -1)
    )
    return jsonify({
        'threads': [build_message_thread_payload(thread_doc, current_user_id=user_id) for thread_doc in thread_docs],
    })


@app.post('/api/messages/threads')
def open_message_thread():
    user_id, user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    data = request.get_json(silent=True) or {}
    item_id = parse_object_id(data.get('itemId'))
    if not item_id:
        return json_error('A valid itemId is required.', 400)

    item_doc = items.find_one({'_id': item_id})
    if not item_doc:
        return json_error('Item not found.', 404)

    if item_doc.get('status') != 'active':
        return json_error('Messages are only available for active listings.', 400)

    seller_id = item_doc.get('seller_id') or item_doc.get('sellerId')
    if not isinstance(seller_id, ObjectId):
        seller_id = parse_object_id(seller_id)
    if not seller_id:
        return json_error('Listing seller not found.', 404)

    if seller_id == user_id:
        return json_error('You cannot message yourself about your own listing.', 400)

    seller_doc = users.find_one({'_id': seller_id})
    if not seller_doc:
        return json_error('Listing seller not found.', 404)

    buyer_name = f"{user_doc.get('firstName', '').strip()} {user_doc.get('lastName', '').strip()}".strip() or 'Buyer'
    seller_name = f"{seller_doc.get('firstName', '').strip()} {seller_doc.get('lastName', '').strip()}".strip() or 'Seller'
    now = datetime.now(timezone.utc)

    thread_doc = message_threads.find_one({
        'item_id': item_id,
        'buyer_id': user_id,
        'seller_id': seller_id,
    })
    is_new_thread = thread_doc is None
    if is_new_thread:
        thread_doc = {
            'item_id': item_id,
            'buyer_id': user_id,
            'seller_id': seller_id,
            'participants': [user_id, seller_id],
            'buyer_name': buyer_name,
            'seller_name': seller_name,
            'item_title': item_doc.get('title', ''),
            'item_status': item_doc.get('status', ''),
            'item_image': item_doc.get('image', ''),
            'latest_message': '',
            'latest_message_at': None,
            'createdAt': now,
            'updatedAt': now,
            'last_read': {},
        }
        inserted = message_threads.insert_one(thread_doc)
        thread_doc['_id'] = inserted.inserted_id
    # Mark the opener as having last-read at this moment so messages prior are not treated as unread for them
    try:
        message_threads.update_one({'_id': thread_doc['_id']}, {'$set': {f'last_read.{str(user_id)}': datetime.now(timezone.utc).isoformat(), 'updatedAt': datetime.now(timezone.utc)}})
        # refresh thread_doc
        thread_doc = message_threads.find_one({'_id': thread_doc['_id']})
    except Exception:
        pass

    return jsonify({
        'thread': build_message_thread_payload(thread_doc, current_user_id=user_id),
    }), 201 if is_new_thread else 200


@app.get('/api/messages/threads/<thread_id>')
def get_message_thread(thread_id):
    user_id, _user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    thread_oid = parse_object_id(thread_id)
    if not thread_oid:
        return json_error('Invalid thread id.', 400)

    thread_doc = message_threads.find_one({'_id': thread_oid})
    if not thread_doc:
        return json_error('Conversation not found.', 404)

    if user_id not in thread_doc.get('participants', []):
        return json_error('You do not have access to this conversation.', 403)

    return jsonify({
        'thread': build_message_thread_payload(thread_doc, current_user_id=user_id),
    })


@app.post('/api/messages/threads/<thread_id>/read')
def mark_thread_read(thread_id):
    """Mark the current user as having read the conversation up to now."""
    user_id, _user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    thread_oid = parse_object_id(thread_id)
    if not thread_oid:
        return json_error('Invalid thread id.', 400)

    thread_doc = message_threads.find_one({'_id': thread_oid})
    if not thread_doc:
        return json_error('Conversation not found.', 404)

    if user_id not in thread_doc.get('participants', []):
        return json_error('You do not have access to this conversation.', 403)

    now = datetime.now(timezone.utc)
    try:
        message_threads.update_one({'_id': thread_oid}, {'$set': {f'last_read.{str(user_id)}': now.isoformat(), 'updatedAt': now}})
    except Exception as exc:
        return json_error(f'Failed to mark thread read: {str(exc)}', 500)

    thread_doc = message_threads.find_one({'_id': thread_oid})
    return jsonify({'thread': build_message_thread_payload(thread_doc, current_user_id=user_id)})


@app.get('/api/messages/threads/<thread_id>/messages')
def get_message_thread_messages(thread_id):
    user_id, _user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    thread_oid = parse_object_id(thread_id)
    if not thread_oid:
        return json_error('Invalid thread id.', 400)

    thread_doc = message_threads.find_one({'_id': thread_oid})
    if not thread_doc:
        return json_error('Conversation not found.', 404)

    if user_id not in thread_doc.get('participants', []):
        return json_error('You do not have access to this conversation.', 403)

    since_value = str(request.args.get('since', '')).strip()
    query = {'thread_id': thread_oid}
    if since_value:
        try:
            since_dt = datetime.fromisoformat(since_value.replace('Z', '+00:00'))
            query['createdAt'] = {'$gt': since_dt}
        except ValueError:
            pass

    message_docs = list(message_messages.find(query).sort('createdAt', 1))
    return jsonify({
        'thread': build_message_thread_payload(thread_doc, current_user_id=user_id),
        'messages': [serialize_message_document(message_doc) for message_doc in message_docs],
    })


@app.post('/api/messages/threads/<thread_id>/messages')
def send_message(thread_id):
    user_id, user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    thread_oid = parse_object_id(thread_id)
    if not thread_oid:
        return json_error('Invalid thread id.', 400)

    thread_doc = message_threads.find_one({'_id': thread_oid})
    if not thread_doc:
        return json_error('Conversation not found.', 404)

    if user_id not in thread_doc.get('participants', []):
        return json_error('You do not have access to this conversation.', 403)

    data = request.get_json(silent=True) or {}
    body = str(data.get('body', '')).strip()
    if not body:
        return json_error('Message body is required.', 400)
    if len(body) > 1000:
        return json_error('Messages must be 1000 characters or fewer.', 400)

    sender_name = f"{user_doc.get('firstName', '').strip()} {user_doc.get('lastName', '').strip()}".strip() or 'Student'
    now = datetime.now(timezone.utc)
    message_doc = {
        'thread_id': thread_oid,
        'sender_id': user_id,
        'sender_name': sender_name,
        'body': body,
        'createdAt': now,
    }
    inserted = message_messages.insert_one(message_doc)
    message_doc['_id'] = inserted.inserted_id

    message_threads.update_one(
        {'_id': thread_oid},
        {
            '$set': {
                'latest_message': body,
                'latest_message_at': now,
                'updatedAt': now,
            }
        },
    )

    # Do not modify recipient last_read here; recipient will see this message as unread until they mark as read or open the thread.

    return jsonify({
        'message': serialize_message_document(message_doc),
        'thread': build_message_thread_payload(
            message_threads.find_one({'_id': thread_oid}),
            current_user_id=user_id,
        ),
    }), 201


@app.get('/api/items')
def get_items():
    """Fetch all marketplace items with pagination and filtering."""
    try:
        _current_user_id, current_user_doc, auth_error = get_optional_current_user_from_request()
        if auth_error:
            return auth_error

        page = request.args.get('page', 1, type=int)
        skip = request.args.get('skip', None, type=int)
        limit = request.args.get('limit', 20, type=int)
        category = request.args.get('category', None)
        status = request.args.get('status', None)
        # Validate pagination
        if skip is not None and skip < 0:
            skip = 0
        if page < 1:
            page = 1
        if limit < 1 or limit > 100:
            limit = 20
        if skip is None:
            skip = (page - 1) * limit
        page = (skip // limit) + 1
        # Build query filter
        query_filter = {}
        if category:
            query_filter['category'] = category
        if status:
            # only accept known status values
            status_val = str(status).strip().lower()
            if status_val in ITEM_STATUSES:
                query_filter['status'] = status_val
        # Fetch items
        items_list = list(
            items.find(query_filter)
            .sort('createdAt', -1)
            .skip(skip)
            .limit(limit)
        )
        # Convert ObjectIds/dates and preserve legacy response fields.
        favorite_item_ids = set(get_favorite_item_ids(current_user_doc)) if current_user_doc else set()
        items_list = [
            annotate_item_favorite_state(serialize_item_document(item), favorite_item_ids)
            for item in items_list
        ]
        total = items.count_documents(query_filter)
        return jsonify({
            'items': items_list,
            'pagination': {
                'page': page,
                'limit': limit,
                'skip': skip,
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

    _current_user_id, current_user_doc, auth_error = get_optional_current_user_from_request()
    if auth_error:
        return auth_error

    try:
        item_doc = items.find_one({'_id': oid})
    except Exception as exc:
        return json_error(f'Failed to fetch item: {str(exc)}', 500)

    if not item_doc:
        return json_error('Item not found.', 404)

    # Normalize for JSON consumption.
    item_doc = serialize_item_document(item_doc)
    favorite_item_ids = set(get_favorite_item_ids(current_user_doc)) if current_user_doc else set()
    item_doc = annotate_item_favorite_state(item_doc, favorite_item_ids)

    return jsonify({'item': item_doc})


@app.post('/api/items/<item_id>/favorite')
def toggle_item_favorite(item_id):
    """Toggle the current user's favorite state for an item."""
    user_id, user_doc, auth_error = get_current_user_from_request()
    if auth_error:
        return auth_error

    item_oid = parse_object_id(item_id)
    if not item_oid:
        return json_error('Invalid item id.', 400)

    item_doc = items.find_one({'_id': item_oid})
    if not item_doc:
        return json_error('Item not found.', 404)

    favorite_item_ids = get_favorite_item_ids(user_doc)
    item_id_str = str(item_oid)
    is_favorited = item_id_str in favorite_item_ids
    now = datetime.now(timezone.utc)

    if is_favorited:
        updated_favorites = [fav_id for fav_id in favorite_item_ids if fav_id != item_id_str]
        next_count = max(0, int(item_doc.get('favoritesCount', 0) or 0) - 1)
    else:
        updated_favorites = favorite_item_ids + [item_id_str]
        next_count = max(0, int(item_doc.get('favoritesCount', 0) or 0) + 1)

    try:
        users.update_one(
            {'_id': user_id},
            {
                '$set': {
                    'favoriteItemIds': updated_favorites,
                    'updatedAt': now,
                },
            },
        )
        items.update_one(
            {'_id': item_oid},
            {
                '$set': {
                    'favoritesCount': next_count,
                    'updatedAt': now,
                },
            },
        )
    except Exception as exc:
        return json_error(f'Failed to update favorites: {str(exc)}', 500)

    refreshed_item = items.find_one({'_id': item_oid})
    refreshed_item = annotate_item_favorite_state(
        serialize_item_document(refreshed_item),
        set(updated_favorites),
    )

    return jsonify({
        'message': 'Favorite updated successfully.',
        'item': refreshed_item,
        'isLoved': not is_favorited,
        'favoriteItemIds': updated_favorites,
    })


@app.get('/api/users/<user_id>')
def get_public_user(user_id):
    """Fetch a user's public profile information (no auth required)."""
    oid = parse_object_id(user_id)
    if not oid:
        return json_error('Invalid user id.', 400)

    try:
        user_doc = users.find_one({'_id': oid})
    except Exception as exc:
        return json_error(f'Failed to fetch user: {str(exc)}', 500)

    if not user_doc:
        return json_error('User not found.', 404)

    payload = build_user_payload(user_doc)
    avatar_val = user_doc.get('avatar') or user_doc.get('avatarUrl')
    if avatar_val:
        if isinstance(avatar_val, str) and avatar_val.strip():
            if re.match(r'^https?://', avatar_val):
                payload['avatarUrl'] = avatar_val
            else:
                payload['avatarUrl'] = f"{request.host_url.rstrip('/')}/api/uploads/{str(avatar_val).lstrip('/')}"
    else:
        payload['avatarUrl'] = ''

    return jsonify({'user': payload})


@app.get('/api/users/<user_id>/reviews')
def get_public_user_reviews(user_id):
    """Fetch public reviews for a seller/user."""
    oid = parse_object_id(user_id)
    if not oid:
        return json_error('Invalid user id.', 400)

    try:
        user_doc = users.find_one({'_id': oid}, {'reviews': 1})
    except Exception as exc:
        return json_error(f'Failed to fetch reviews: {str(exc)}', 500)

    if not user_doc:
        return json_error('User not found.', 404)

    reviews = user_doc.get('reviews', [])
    if not isinstance(reviews, list):
        reviews = []

    serialized_reviews = []
    for review in reviews:
        if isinstance(review, dict):
            serialized_reviews.append(serialize_review_document(dict(review)))

    serialized_reviews.sort(key=lambda review: review.get('createdAt', ''), reverse=True)
    return jsonify({'reviews': serialized_reviews})


@app.post('/api/users/<user_id>/reviews')
def create_public_user_review(user_id):
    """Create or replace a review for a seller/user."""
    reviewer_id, reviewer_doc, error_response = get_current_user_from_request()
    if error_response:
        return error_response

    target_oid = parse_object_id(user_id)
    if not target_oid:
        return json_error('Invalid user id.', 400)

    if str(reviewer_id) == str(target_oid):
        return json_error('You cannot review your own profile.', 400)

    try:
        target_doc = users.find_one({'_id': target_oid})
    except Exception as exc:
        return json_error(f'Failed to load user: {str(exc)}', 500)

    if not target_doc:
        return json_error('User not found.', 404)

    data = request.get_json(silent=True) or {}
    comment = str(data.get('comment', '')).strip()
    rating_value = data.get('rating')

    try:
        rating = int(rating_value)
    except (TypeError, ValueError):
        return json_error('Rating must be an integer between 1 and 5.', 400)

    if rating < 1 or rating > 5:
        return json_error('Rating must be between 1 and 5.', 400)

    if not comment:
        return json_error('Review comment is required.', 400)

    if len(comment) > 1000:
        return json_error('Review comment must be 1000 characters or fewer.', 400)

    now = datetime.now(timezone.utc)
    existing_reviews = target_doc.get('reviews', [])
    if not isinstance(existing_reviews, list):
        existing_reviews = []

    seller_avatar = reviewer_doc.get('avatar') or reviewer_doc.get('avatarUrl') or ''
    if seller_avatar and isinstance(seller_avatar, str) and seller_avatar.strip() and not re.match(r'^https?://', seller_avatar):
        seller_avatar = f"{request.host_url.rstrip('/')}/api/uploads/{seller_avatar.lstrip('/')}"

    review_payload = {
        '_id': str(uuid4()),
        'reviewerId': str(reviewer_id),
        'reviewerName': f"{reviewer_doc.get('firstName', '').strip()} {reviewer_doc.get('lastName', '').strip()}".strip() or 'Anonymous',
        'reviewerAvatarUrl': seller_avatar,
        'rating': rating,
        'comment': comment,
        'createdAt': now,
        'updatedAt': now,
    }

    filtered_reviews = []
    for review in existing_reviews:
        if not isinstance(review, dict):
            continue
        if str(review.get('reviewerId')) == str(reviewer_id):
            continue
        filtered_reviews.append(review)

    filtered_reviews.append(review_payload)

    try:
        users.update_one(
            {'_id': target_oid},
            {'$set': {'reviews': filtered_reviews, 'updatedAt': now}},
        )
    except Exception as exc:
        return json_error(f'Failed to save review: {str(exc)}', 500)

    serialized_reviews = [serialize_review_document(dict(review)) for review in filtered_reviews if isinstance(review, dict)]
    serialized_reviews.sort(key=lambda review: review.get('createdAt', ''), reverse=True)
    rating_values = [review.get('rating', 0) for review in serialized_reviews if isinstance(review.get('rating'), (int, float))]
    average_rating = round(sum(rating_values) / len(rating_values), 1) if rating_values else 0

    return jsonify({
        'message': 'Review saved successfully.',
        'review': serialize_review_document(dict(review_payload)),
        'reviews': serialized_reviews,
        'reviewCount': len(rating_values),
        'averageRating': average_rating,
    }), 201


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
        str(data.get('status', 'active')).strip().lower() or 'active'
    )
    if status not in ITEM_STATUSES:
        return json_error(
            'Status must be one of: draft, active, sold, removed.',
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


@app.put('/api/items/<item_id>')
def update_item(item_id):
    """Update an existing marketplace item owned by the current seller."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return json_error('Missing bearer token.', 401)

    token = auth_header.removeprefix('Bearer ').strip()
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
    except jwt.PyJWTError:
        return json_error('Invalid or expired token.', 401)

    seller_id = parse_object_id(payload.get('sub'))
    item_oid = parse_object_id(item_id)
    if not seller_id or not item_oid:
        return json_error('Invalid item id.', 400)

    item_doc = items.find_one({'_id': item_oid})
    if not item_doc:
        return json_error('Item not found.', 404)

    item_seller_id = item_doc.get('seller_id') or item_doc.get('sellerId')
    if str(item_seller_id) != str(seller_id):
        return json_error('You can only edit your own listings.', 403)

    data = request.get_json(silent=True) or {}
    updates = {}

    if 'status' in data:
        status = str(data.get('status', '')).strip().lower()
        if status not in ITEM_STATUSES:
            return json_error(
                'Status must be one of: draft, active, reserved, sold, removed.',
                400,
            )
        updates['status'] = status
        updates['soldAt'] = datetime.now(timezone.utc) if status == 'sold' else None

    for field in ('title', 'description', 'category', 'location', 'meeting_notes'):
        if field in data:
            value = str(data.get(field, '')).strip()
            if field in {'title', 'description', 'category'} and not value:
                return json_error(f'{field} is required.', 400)
            updates[field] = value or None

    if 'price' in data:
        try:
            price = float(data['price'])
            if price < 0:
                return json_error('Price must be a positive number.', 400)
        except (ValueError, TypeError):
            return json_error('Price must be a valid number.', 400)
        updates['price'] = price

    if 'image' in data or 'images' in data:
        raw_images = data.get('images')
        images = []
        if isinstance(raw_images, list):
            images = [str(url).strip() for url in raw_images if str(url).strip()]
        elif isinstance(raw_images, str) and raw_images.strip():
            images = [raw_images.strip()]

        primary_image = str(data.get('image', '')).strip()
        if primary_image and primary_image not in images:
            images.insert(0, primary_image)

        if images:
            updates['images'] = images
            updates['image'] = images[0]

    if not updates:
        return json_error('No updates provided.', 400)

    updates['updatedAt'] = datetime.now(timezone.utc)

    try:
        items.update_one({'_id': item_oid}, {'$set': updates})
        updated_item = items.find_one({'_id': item_oid})
        return jsonify({
            'message': 'Item updated successfully.',
            'item': serialize_item_document(updated_item),
        })
    except Exception as exc:
        return json_error(f'Failed to update item: {str(exc)}', 500)


if __name__ == '__main__':
    print(f'Image upload storage mode: {IMAGE_STORAGE_MODE}')
    app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5050')), debug=True)
