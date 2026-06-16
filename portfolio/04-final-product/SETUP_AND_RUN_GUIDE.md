# Setup and Run Guide

## Required Software

- Python 3
- Node.js and npm
- MongoDB local instance or MongoDB Atlas connection string
- Optional: SendGrid or SMTP account for OTP emails
- Optional: Cloudinary account for persistent image uploads

## Clone

```bash
git clone https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace.git
cd campusMarketPlace
```

## Backend Setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` with safe local values:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `JWT_SECRET`
- `FRONTEND_ORIGIN`
- Optional `SENDGRID_API_KEY`, `SENDGRID_FROM`, SMTP variables
- Optional Cloudinary variables

Run the backend:

```bash
source .venv/bin/activate
python app.py
```

Default backend port: `5050`.

## Frontend Setup

```bash
npm install
npm --prefix Frontend install
npm run dev
```

Default Vite URL: `http://localhost:5173`.

## Build

```bash
npm run build
```

## Test Commands

Frontend placeholder test:

```bash
npm --prefix Frontend test
```

Backend/integration tests:

```bash
TEST_MONGODB_URI="mongodb://localhost:27017/campus_marketplace_test" pytest
```

Current limitation: [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py) expects a Flask `client` fixture, but the repo does not currently include `conftest.py`. Add that fixture before expecting the pytest file to run end-to-end in CI.

## Seed Data

No seed script was found. For demo data, create users/listings through the app or insert controlled test documents in a local MongoDB database.

## Troubleshooting

- If signup rejects an email, confirm it ends with `@office.uc.ac.kr`.
- If OTP email is not received, confirm SendGrid/SMTP variables and sender verification.
- If image uploads fail in production-like environments, configure Cloudinary variables.
- If frontend API calls fail, confirm the backend is running and CORS/`FRONTEND_ORIGIN` are configured.
- If GitHub Pages routing fails, confirm the frontend uses the configured Vite base path.

## Do Not Commit Secrets

Use `.env` locally and keep real API keys, database credentials, and JWT secrets out of Git.
