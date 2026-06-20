
# Campus Marketplace

A campus-only buying and selling platform built for **Ulsan College students**. Users can create accounts with their school email (`@office.uc.ac.kr`), verify via OTP, and participate in a trusted student-to-student marketplace.

## 🎯 Overview

| Aspect | Details |
|--------|---------|
| **Team** | Gayatri K. Bhandari, Aayuska Rai, Sudarshan Rai, Sagar Sob, Ananda Tamang |
| **Target Users** | Ulsan College students seeking affordable items, textbooks, electronics, dorm supplies |
| **Problem Solved** | Safe, campus-verified marketplace for student trading (vs. public platforms) |
| **Live Demo** | 🚀 [Frontend Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) |
| **Repository** | [GitHub](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace) |

## ✨ Features

### Core MVP Features
- ✅ Campus email signup (`@office.uc.ac.kr`) with OTP verification
- ✅ Secure login with JWT authentication
- ✅ Browse marketplace listings with search and categories
- ✅ Create, edit, and manage item listings
- ✅ Image uploads (Cloudinary or local storage)
- ✅ User profiles with avatar support
- ✅ Public seller profiles and reviews
- ✅ Favorites/liked items
- ✅ Messaging between users
- ✅ Dark mode toggle
- ✅ Multi-language and currency preferences

### Additional Features
- Protected dashboard for authenticated users
- Listing status management (active/sold/unavailable)
- Password update and profile editing
- Seller review system
- Message thread conversations

## 🛠 Tech Stack

| Area | Technology |
|------|------------|
| **Frontend** | React 18, Vite, React Router, CSS |
| **Backend** | Flask 3, Python |
| **Database** | MongoDB (PyMongo) |
| **Authentication** | JWT, password hashing, OTP verification |
| **File Storage** | Cloudinary (recommended) or local uploads |
| **Email** | SendGrid (preferred) or SMTP |
| **Deployment** | GitHub Pages (frontend), Render (backend) |

## 📂 Project Structure

```
campusMarketPlace/
├── Frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── routes/             # Page-level components
│   │   ├── services/           # API, auth, i18n helpers
│   │   ├── assets/styles/      # Global styling
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # React entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                     # Node.js configuration (reference)
├── app.py                       # Flask backend server
├── models/                      # Backend data models
├── tests/                       # Integration tests
├── docs/                        # Semester documentation
├── portfolio/                   # Final project portfolio
│   ├── 01-project-overview/    # Project summary and scope
│   ├── 02-semester-journey/    # Sprint documentation
│   ├── 03-design-and-planning/ # Architecture and design docs
│   ├── 04-final-product/       # Final MVP documentation
│   ├── 05-qa-and-stabilization/# QA reports and testing
│   ├── 06-ai-and-code-ownership/# Code ownership audit
│   ├── 07-final-presentation/  # Presentation materials
│   └── 08-individual-portfolios/# Team member portfolios
├── requirements.txt            # Python dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+
- MongoDB URI (local or Atlas)
- (Optional) SendGrid API key for email OTP

### 1. Backend Setup

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration (see below)

# Start Flask backend
python app.py
```

Backend runs at: `http://localhost:5050`

### 2. Frontend Setup

```bash
# Install dependencies
cd Frontend
npm install

# Start Vite dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Test the App

1. Open `http://localhost:5173` in browser
2. Sign up with `test@office.uc.ac.kr`
3. Verify OTP (check console if email not configured)
4. Browse marketplace and create listings

## ⚙️ Environment Configuration

Create a `.env` file in the project root with:

```bash
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusmarketplace

# JWT
JWT_SECRET=your-secret-key-here

# Email Configuration (choose one)
# Option 1: SendGrid (recommended)
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM=noreply@campus-marketplace.com

# Option 2: SMTP fallback
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# Image Storage (optional)
# Option 1: Cloudinary (recommended for production)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CLOUDINARY_UPLOAD_FOLDER=campus-marketplace

# Option 2: Local storage (development default)
UPLOAD_DIR=./uploads

# Environment
FLASK_ENV=development
FLASK_APP=app.py
```

## 📨 Email OTP Setup

### Using SendGrid (Recommended)
1. Create [SendGrid account](https://sendgrid.com)
2. Generate API key from dashboard
3. Set `SENDGRID_API_KEY` in `.env`
4. Restart backend and test signup

### Using SMTP
1. Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
2. Restart backend

### Local Testing (No Email Configured)
- OTP will print to backend console
- Use printed OTP for signup verification

## 🖼️ Image Storage

### Development
- Images stored in `./uploads/` directory
- No configuration needed

### Production (Cloudinary - Recommended)
1. Create [Cloudinary account](https://cloudinary.com)
2. Set environment variables:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Redeploy backend
4. Verify: `GET /api/health` should show `"imageStorage": "cloudinary"`

### Render Deployment
If deploying to Render, Cloudinary is required (Render has ephemeral filesystem).

## 🏗️ Build & Deployment

### Build Frontend
```bash
cd Frontend
npm run build
```
Output: `Frontend/dist/`

### Deploy Frontend (GitHub Pages)
```bash
npm run build
# Commit and push to main branch
# GitHub Actions will auto-deploy
```

### Deploy Backend (Render)
1. Connect Render to GitHub repo
2. Set environment variables in Render dashboard
3. Deploy with `python app.py`

### Deployment Checklist
- ✅ MongoDB URI configured
- ✅ JWT_SECRET set
- ✅ Cloudinary credentials (or local storage confirmed)
- ✅ Email service configured (SendGrid or SMTP)
- ✅ All env vars set in deployment platform
- ✅ Health check: `GET /api/health`

## 📚 Documentation

### Project Documentation
- [Project Summary](portfolio/01-project-overview/PROJECT_SUMMARY.md) - Overview and value statement
- [Final MVP Scope](portfolio/01-project-overview/FINAL_MVP_SCOPE.md) - Features and limitations
- [Architecture](portfolio/04-final-product/ARCHITECTURE_FINAL.md) - Tech stack and data model
- [Setup Guide](portfolio/04-final-product/SETUP_AND_RUN_GUIDE.md) - Detailed setup steps

### Semester Documentation
- [User Stories](docs/USERSTORIES.md) - Feature descriptions
- [Design Doc](docs/Design%20Doc%20v1.md) - UI/UX design
- [Wireframes](docs/WIREFRAME.md) - Page mockups
- [Sprint Documentation](docs/Sprint_Packet/) - Weekly progress
- [QA Report](portfolio/05-qa-and-stabilization/QA_REPORT.md) - Testing results

### Team Portfolios
- [Gayatri K. Bhandari](portfolio/08-individual-portfolios/GAYATRI_KUMARI_BHANDARI.md)
- [Aayuska Rai](portfolio/08-individual-portfolios/RAI_AAYUSKA.md)
- [Sudarshan Rai](portfolio/08-individual-portfolios/RAI_SUDARSHAN.md)
- [Sagar Sob](portfolio/08-individual-portfolios/SAGAR_SOB.md)
- [Ananda Tamang](portfolio/08-individual-portfolios/ANANDA_TAMANG.md)

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register with campus email
- `POST /api/auth/verify-email-otp` - Verify OTP
- `POST /api/auth/login` - Login and get JWT
- `POST /api/auth/resend-email-otp` - Resend OTP

### Items (Listings)
- `GET /api/items` - Browse all listings
- `GET /api/items/<item_id>` - Get item details
- `POST /api/items` - Create new listing
- `PUT /api/items/<item_id>` - Update listing
- `POST /api/items/<item_id>/favorite` - Favorite/unfavorite item

### User Profiles
- `GET /api/profile` - Get authenticated user profile
- `PUT /api/profile` - Update profile
- `PUT /api/profile/password` - Change password
- `POST /api/profile/avatar` - Upload avatar
- `DELETE /api/profile/avatar` - Delete avatar

### Seller Pages
- `GET /api/users/<user_id>` - Get public seller profile
- `GET /api/users/<user_id>/reviews` - Get seller reviews
- `POST /api/users/<user_id>/reviews` - Post review

### Messaging
- `GET /api/messages/threads` - List message threads
- `POST /api/messages/threads` - Start new thread
- `GET /api/messages/threads/<thread_id>/messages` - Get messages
- `POST /api/messages/threads/<thread_id>/messages` - Send message

### Utilities
- `POST /api/uploads/image` - Upload image
- `GET /api/health` - Health check

## 🧪 Testing

```bash
# Run integration tests (requires TEST_MONGODB_URI)
pytest tests/test_profile_endpoints.py

# Frontend build test
npm --prefix Frontend run build
```

## 📝 Notes

- **Email Verification**: When email is not configured, OTP is printed to backend console
- **Image Storage**: Development uses local uploads; production requires Cloudinary
- **JWT Tokens**: Stored in localStorage on frontend; included in all authenticated requests
- **Campus Email**: Signup restricted to `@office.uc.ac.kr` domain for university verification

## 🤝 Contributing

This is a capstone project for the Spring 2026 semester. For questions or suggestions, contact the team or open an issue on GitHub.

## 📄 License

MIT

---

**Last Updated**: June 2026
**Team**: Capstone Design Spring 2026, Ulsan College
|   |-- index.html
|   |-- package.json
|   |-- package-lock.json
|   |-- vite.config.js
|   |-- src/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   |-- assets/
|   |   |   `-- styles/
|   |   |       `-- global.css
|   |   |-- components/
|   |   |   |-- Footer.jsx
|   |   |   |-- ItemCard.jsx
|   |   |   |-- ItemGrid.jsx
|   |   |   `-- Navbar.jsx
|   |   |-- constants/
|   |   |   `-- categories.js
|   |   |-- routes/
|   |   |   |-- Browse.jsx
|   |   |   |-- Dashboard.jsx
|   |   |   |-- Home.jsx
|   |   |   |-- Login.jsx
|   |   |   `-- Signup.jsx
|   |   `-- services/
|   |       `-- api.js
|   `-- dist/                  (build output)
|-- models/
|   |-- __init__.py
|   `-- item.py
|-- uploads/
|-- docs/
|   |-- Architecture_sketch.md
|   |-- Design Doc v1.md
|   |-- PROJECT_1.md
|   |-- PROJECTPITCH.md
|   |-- TEAMAGREEMENT.md
|   |-- USERSTORIES.md
|   |-- WIREFRAME.md
|   |-- questions.md
|   |-- Midterm/
|   `-- Sprint_Packet/
`-- .github/
```


## License

Academic project use.
=======
