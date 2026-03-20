"""
CampusMarketplace Backend Server
Sprint 2 — User Story: Account creation, Login, Signup
"""

from flask import Flask, jsonify, request, session
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
import re

app = Flask(__name__)
app.secret_key = "dev-secret-key-change-later"
CORS(app, supports_credentials=True)

# ============================================
# DATABASE SETUP
# ============================================
DATABASE = os.path.join(os.path.dirname(__file__), "marketplace.db")


def get_db():
    """Connect to SQLite database."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # So we can access columns by name
    return conn


def init_db():
    """Create tables if they don't exist."""
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


# Create tables when server starts
init_db()


# ============================================
# HEALTH CHECK
# ============================================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "CampusMarketplace API is running",
        "version": "0.1.0",
        "sprint": 2
    })


# ============================================
# PASSWORD VALIDATION
# ============================================
def validate_password(password):
    """
    Check if password meets strength requirements.
    Returns a list of error messages (empty = password is valid).
    """
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least 1 uppercase letter (A-Z)")

    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least 1 lowercase letter (a-z)")

    if not re.search(r"[0-9]", password):
        errors.append("Password must contain at least 1 number (0-9)")

    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>/?]", password):
        errors.append("Password must contain at least 1 special character (!@#$%^&*)")

    return errors


@app.route("/api/password-rules", methods=["GET"])
def password_rules():
    """
    Return the password rules so the frontend can display them.
    Gayatri can use this to show rules on the signup page.
    """
    return jsonify({
        "rules": [
            "At least 8 characters long",
            "At least 1 uppercase letter (A-Z)",
            "At least 1 lowercase letter (a-z)",
            "At least 1 number (0-9)",
            "At least 1 special character (!@#$%^&*)"
        ]
    }), 200


# ============================================
# SIGNUP (Register a new account)
# ============================================
@app.route("/api/signup", methods=["POST"])
def signup():
    """
    Register a new user.
    Expects JSON: { "username": "...", "email": "...", "password": "..." }
    """
    data = request.get_json()

    # --- Validation ---
    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not username:
        return jsonify({"error": "Username is required"}), 400
    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not password:
        return jsonify({"error": "Password is required"}), 400

    # --- Password Strength Validation ---
    password_errors = validate_password(password)
    if password_errors:
        return jsonify({
            "error": "Password does not meet requirements",
            "password_errors": password_errors
        }), 400

    # --- Check if user already exists ---
    conn = get_db()
    existing_user = conn.execute(
        "SELECT id FROM users WHERE email = ? OR username = ?",
        (email, username)
    ).fetchone()

    if existing_user:
        conn.close()
        return jsonify({"error": "Username or email already exists"}), 409

    # --- Create the user ---
    hashed_password = generate_password_hash(password)

    try:
        conn.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        conn.commit()
    except Exception as e:
        conn.close()
        return jsonify({"error": "Failed to create account"}), 500

    conn.close()

    return jsonify({
        "message": "Account created successfully!",
        "user": {
            "username": username,
            "email": email
        }
    }), 201


# ============================================
# LOGIN
# ============================================
@app.route("/api/login", methods=["POST"])
def login():
    """
    Log in an existing user.
    Expects JSON: { "email": "...", "password": "..." }
    """
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # --- Find user in database ---
    conn = get_db()
    user = conn.execute(
        "SELECT * FROM users WHERE email = ?",
        (email,)
    ).fetchone()
    conn.close()

    if not user:
        return jsonify({"error": "No account found with this email"}), 404

    # --- Check password ---
    if not check_password_hash(user["password"], password):
        return jsonify({"error": "Incorrect password"}), 401

    # --- Login successful ---
    return jsonify({
        "message": "Login successful!",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        }
    }), 200


# ============================================
# LOGOUT
# ============================================
@app.route("/api/logout", methods=["POST"])
def logout():
    """Log out the current user."""
    return jsonify({"message": "Logged out successfully"}), 200


# ============================================
# GET ALL USERS (for testing/debug only)
# ============================================
@app.route("/api/users", methods=["GET"])
def get_users():
    """List all registered users (debug endpoint)."""
    conn = get_db()
    users = conn.execute("SELECT id, username, email, created_at FROM users").fetchall()
    conn.close()

    user_list = []
    for user in users:
        user_list.append({
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "created_at": user["created_at"]
        })

    return jsonify({
        "users": user_list,
        "count": len(user_list)
    }), 200


# ============================================
# PLACEHOLDER: Listings (for Sprint 3)
# ============================================
@app.route("/api/listings", methods=["GET"])
def get_listings():
    """Placeholder listings endpoint."""
    sample_listings = [
        {
            "id": 1,
            "title": "Calculus Textbook",
            "description": "Used for one semester, good condition",
            "price": 15000,
            "category": "Textbooks",
            "condition": "Good",
            "seller": "student1"
        },
        {
            "id": 2,
            "title": "Scientific Calculator",
            "description": "TI-84, works perfectly",
            "price": 25000,
            "category": "Electronics",
            "condition": "Like New",
            "seller": "student2"
        },
        {
            "id": 3,
            "title": "Desk Lamp",
            "description": "LED lamp, adjustable brightness",
            "price": 8000,
            "category": "Furniture",
            "condition": "Good",
            "seller": "student3"
        }
    ]

    return jsonify({
        "listings": sample_listings,
        "count": len(sample_listings)
    }), 200


# ============================================
# RUN SERVER
# ============================================
if __name__ == "__main__":
    print("\n  CampusMarketplace API Server")
    print("  ----------------------------")
    print("  Health check : http://localhost:5000/")
    print("  Signup       : POST http://localhost:5000/api/signup")
    print("  Login        : POST http://localhost:5000/api/login")
    print("  Users (debug): http://localhost:5000/api/users")
    print("  Listings     : http://localhost:5000/api/listings")
    print()
    app.run(debug=True, port=5000)
