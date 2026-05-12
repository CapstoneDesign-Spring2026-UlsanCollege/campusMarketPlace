from datetime import datetime, timezone
from bson import ObjectId


def validate_item_payload(data):
    """Validate incoming item payload. Returns (True, cleaned_data) or (False, error_message)."""
    if not isinstance(data, dict):
        return False, 'Invalid payload.'

    required_fields = ['title', 'description', 'price', 'category', 'location']
    missing = [f for f in required_fields if not str(data.get(f, '')).strip()]
    if missing:
        return False, f"Missing required fields: {', '.join(missing)}"

    try:
        price = float(data['price'])
        if price < 0:
            return False, 'Price must be a positive number.'
    except (ValueError, TypeError):
        return False, 'Price must be a valid number.'

    cleaned = {
        'title': str(data['title']).strip(),
        'description': str(data['description']).strip(),
        'price': price,
        'category': str(data['category']).strip(),
        'location': str(data['location']).strip(),
        'image': str(data.get('image', '')).strip() or None,
    }

    # Optional fields validation
    if 'status' in data:
        status = str(data.get('status', '')).strip()
        if status:
            cleaned['status'] = status

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
        'sellerId': seller_obj,
        'sellerName': f"{user_doc.get('firstName','')} {user_doc.get('lastName','')}",
        'title': cleaned_data['title'],
        'description': cleaned_data['description'],
        'price': cleaned_data['price'],
        'category': cleaned_data['category'],
        'location': cleaned_data['location'],
        'image': cleaned_data.get('image'),
        'status': cleaned_data.get('status', 'available'),
        'createdAt': now,
        'updatedAt': now,
    }

    return item_doc
