from datetime import datetime, timezone

from bson import ObjectId


ITEM_STATUSES = {'draft', 'active', 'sold', 'removed'}


def _clean_images(data):
    images = []

    raw_images = data.get('images')
    if isinstance(raw_images, list):
        images = [str(url).strip() for url in raw_images if str(url).strip()]
    elif isinstance(raw_images, str) and raw_images.strip():
        images = [raw_images.strip()]

    primary_image = str(data.get('image', '')).strip()
    if primary_image and primary_image not in images:
        images.insert(0, primary_image)

    return images


def validate_item_payload(data):
    """Validate incoming item payload.

    Returns (True, cleaned_data) or (False, error_message).
    """
    if not isinstance(data, dict):
        return False, 'Invalid payload.'

    required_fields = ['title', 'description', 'price', 'category']
    missing = [f for f in required_fields if not str(data.get(f, '')).strip()]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"

    try:
        price = float(data['price'])
        if price < 0:
            return False, 'Price must be a positive number.'
    except (ValueError, TypeError):
        return False, 'Price must be a valid number.'

    images = _clean_images(data)
    if not images:
        return False, 'At least one image URL is required.'

    status = str(data.get('status', 'active')).strip().lower() or 'active'
    if status not in ITEM_STATUSES:
        return False, 'Status must be one of: draft, active, sold, removed.'

    cleaned = {
        'title': str(data['title']).strip(),
        'description': str(data['description']).strip(),
        'price': price,
        'category': str(data['category']).strip(),
        'location': str(data.get('location', '')).strip() or None,
        'images': images,
        'image': images[0],
        'status': status,
    }

    meeting_notes = str(data.get('meeting_notes', '')).strip() or None
    if meeting_notes:
        cleaned['meeting_notes'] = meeting_notes

    return True, cleaned


def build_item_doc(cleaned_data, seller_id, user_doc):
    """Build the MongoDB document for an item from cleaned data and seller info."""
    if isinstance(seller_id, ObjectId):
        seller_obj = seller_id
    else:
        try:
            seller_obj = ObjectId(str(seller_id))
        except Exception:
            seller_obj = None

    now = datetime.now(timezone.utc)
    item_doc = {
        'seller_id': seller_obj,
        'sellerId': seller_obj,
        'sellerName': f"{user_doc.get('firstName','')} {user_doc.get('lastName','')}",
        'seller_verified': bool(user_doc.get('isVerified', False)),
        'title': cleaned_data['title'],
        'description': cleaned_data['description'],
        'price': cleaned_data['price'],
        'category': cleaned_data['category'],
        'location': cleaned_data.get('location'),
        'images': cleaned_data.get('images', []),
        'image': cleaned_data.get('image'),
        'status': cleaned_data.get('status', 'active'),
        'meeting_notes': cleaned_data.get('meeting_notes'),
        'soldAt': now if cleaned_data.get('status') == 'sold' else None,
        'expiresAt': None,
        'createdAt': now,
        'updatedAt': now,
    }

    return item_doc
