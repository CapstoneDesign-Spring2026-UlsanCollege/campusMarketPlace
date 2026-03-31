from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt

app = Flask(__name__)

# ✅ Strong CORS (allow everything for dev)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=False)

# DB
client = MongoClient("mongodb://localhost:27017/")
db = client["uc_marketplace"]
users = db["users"]

# ✅ Explicit OPTIONS handler (preflight)
@app.route("/register", methods=["OPTIONS"])
def register_options():
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

# ✅ Main route
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.json

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not name or not email or not password:
            return jsonify({"error": "All fields required"}), 400

        hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        users.insert_one({
            "name": name,
            "email": email,
            "password": hashed_pw.decode("utf-8")
        })

        return jsonify({"message": "User registered successfully"}), 200

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Server error"}), 500

# ✅ Final safety headers (every response)
@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    return response

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)