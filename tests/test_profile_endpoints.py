import os
import io
import json
import pytest
from pathlib import Path

# These tests require a running MongoDB and the Flask app to be configured
# with a test database. Set environment variable TEST_MONGODB_URI before
# running to avoid touching production data.

TEST_DB_URI = os.getenv('TEST_MONGODB_URI')

pytestmark = pytest.mark.skipif(
    not TEST_DB_URI,
    reason='Set TEST_MONGODB_URI to run integration tests against a test database',
)


def test_signup_login_and_avatar_upload(client):
    # This test assumes the pytest fixture `client` is configured to provide
    # a Flask test client against the application using the test DB.
    email = 'itest@example.com'
    password = 'Test1234!'

    # Signup
    resp = client.post('/api/auth/signup', json={'firstName': 'IT', 'lastName': 'User', 'email': email, 'password': password})
    assert resp.status_code == 201
    data = resp.get_json()
    assert 'token' in data
    token = data['token']

    # Upload avatar using an in-memory small PNG
    img = io.BytesIO()
    # A tiny 1x1 PNG binary
    img.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0bIDAT\x08\xd7c``\x00\x00\x00\x04\x00\x01\x0d\n\x2dB\x00\x00\x00\x00IEND\xaeB`\x82')
    img.seek(0)

    rv = client.post('/api/profile/avatar', data={'image': (img, 'small.png')}, headers={'Authorization': f'Bearer {token}'}, content_type='multipart/form-data')
    assert rv.status_code == 201
    rv_data = rv.get_json()
    assert 'url' in rv_data

    # Delete avatar
    rv2 = client.delete('/api/profile/avatar', headers={'Authorization': f'Bearer {token}'})
    assert rv2.status_code == 200


def test_profile_can_store_dummy_payment_method(client):
    email = 'payment-demo@example.com'
    password = 'Test1234!'

    signup = client.post('/api/auth/signup', json={'firstName': 'Pay', 'lastName': 'Demo', 'email': email, 'password': password})
    assert signup.status_code == 201
    token = signup.get_json()['token']

    updated = client.put(
        '/api/profile',
        json={
            'paymentMethods': [
                {
                    'id': 'demo-campus-card',
                    'label': 'Campus Visa (Demo)',
                    'type': 'Card',
                    'provider': 'Demo card',
                    'last4': '4242',
                    'isDefault': True,
                }
            ]
        },
        headers={'Authorization': f'Bearer {token}'},
    )
    assert updated.status_code == 200
    updated_data = updated.get_json()
    assert updated_data['user']['paymentMethods'] == [
        {
            'id': 'demo-campus-card',
            'label': 'Campus Visa (Demo)',
            'type': 'Card',
            'provider': 'Demo card',
            'last4': '4242',
            'isDefault': True,
        }
    ]

    profile = client.get('/api/profile', headers={'Authorization': f'Bearer {token}'})
    assert profile.status_code == 200
    profile_data = profile.get_json()
    assert profile_data['user']['paymentMethods'] == [
        {
            'id': 'demo-campus-card',
            'label': 'Campus Visa (Demo)',
            'type': 'Card',
            'provider': 'Demo card',
            'last4': '4242',
            'isDefault': True,
        }
    ]


def test_item_status_can_be_updated_by_owner(client):
    email = 'item-owner@example.com'
    password = 'Test1234!'

    signup = client.post('/api/auth/signup', json={'firstName': 'Item', 'lastName': 'Owner', 'email': email, 'password': password})
    assert signup.status_code == 201
    token = signup.get_json()['token']

    created = client.post(
        '/api/items',
        json={
            'title': 'Textbook',
            'description': 'Calculus book',
            'price': 10,
            'category': 'Books',
            'status': 'active',
            'image': 'https://example.com/book.jpg',
            'images': ['https://example.com/book.jpg'],
        },
        headers={'Authorization': f'Bearer {token}'},
    )
    assert created.status_code == 201
    item_id = created.get_json()['item']['_id']

    updated = client.put(
        f'/api/items/{item_id}',
        json={'status': 'reserved'},
        headers={'Authorization': f'Bearer {token}'},
    )
    assert updated.status_code == 200
    updated_item = updated.get_json()['item']
    assert updated_item['status'] == 'reserved'


def test_item_can_be_loved_and_saved_to_profile(client):
    email = 'favorite-owner@example.com'
    password = 'Test1234!'

    signup = client.post('/api/auth/signup', json={'firstName': 'Love', 'lastName': 'Owner', 'email': email, 'password': password})
    assert signup.status_code == 201
    token = signup.get_json()['token']

    created = client.post(
        '/api/items',
        json={
            'title': 'Desk Lamp',
            'description': 'Warm light lamp',
            'price': 15,
            'category': 'Home',
            'status': 'active',
            'image': 'https://example.com/lamp.jpg',
            'images': ['https://example.com/lamp.jpg'],
        },
        headers={'Authorization': f'Bearer {token}'},
    )
    assert created.status_code == 201
    item_id = created.get_json()['item']['_id']

    loved = client.post(
        f'/api/items/{item_id}/favorite',
        headers={'Authorization': f'Bearer {token}'},
    )
    assert loved.status_code == 200
    loved_data = loved.get_json()
    assert loved_data['isLoved'] is True
    assert item_id in loved_data['favoriteItemIds']

    profile = client.get('/api/profile', headers={'Authorization': f'Bearer {token}'})
    assert profile.status_code == 200
    profile_data = profile.get_json()
    assert profile_data['user']['favoriteItemIds'] == [item_id]
    assert len(profile_data['favoriteItems']) == 1
    assert profile_data['favoriteItems'][0]['_id'] == item_id


def test_seller_reviews_can_be_created_and_fetched(client):
    seller_email = 'review-seller@example.com'
    reviewer_email = 'review-buyer@example.com'
    password = 'Test1234!'

    seller_signup = client.post('/api/auth/signup', json={'firstName': 'Seller', 'lastName': 'One', 'email': seller_email, 'password': password})
    assert seller_signup.status_code == 201
    seller_id = seller_signup.get_json()['user']['id']

    reviewer_signup = client.post('/api/auth/signup', json={'firstName': 'Reviewer', 'lastName': 'One', 'email': reviewer_email, 'password': password})
    assert reviewer_signup.status_code == 201
    reviewer_token = reviewer_signup.get_json()['token']

    created_review = client.post(
        f'/api/users/{seller_id}/reviews',
        json={'rating': 5, 'comment': 'Great seller and fast reply.'},
        headers={'Authorization': f'Bearer {reviewer_token}'},
    )
    assert created_review.status_code == 201
    review_data = created_review.get_json()
    assert review_data['review']['rating'] == 5
    assert review_data['review']['comment'] == 'Great seller and fast reply.'

    fetched_reviews = client.get(f'/api/users/{seller_id}/reviews')
    assert fetched_reviews.status_code == 200
    fetched_data = fetched_reviews.get_json()
    assert len(fetched_data['reviews']) == 1
    assert fetched_data['reviews'][0]['rating'] == 5
    assert fetched_data['reviews'][0]['comment'] == 'Great seller and fast reply.'


# Note: To run these tests locally, create a conftest.py fixture that creates
# a Flask test client and configures the app to use TEST_MONGODB_URI. This
# file intentionally leaves those details out to avoid assumptions about your
# CI/test configuration.
