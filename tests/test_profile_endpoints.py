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


# Note: To run these tests locally, create a conftest.py fixture that creates
# a Flask test client and configures the app to use TEST_MONGODB_URI. This
# file intentionally leaves those details out to avoid assumptions about your
# CI/test configuration.
