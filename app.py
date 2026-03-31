from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/signup")
def signup():
    return render_template("signup.html")

@app.route("/login")
def login():
    return "<h1>Login Page Coming Soon</h1>"

if __name__ == "__main__":
    app.run(debug=True)