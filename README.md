
## Campus Marketplace

Campus Marketplace is a campus-only buying and selling platform built for Ulsan College students. It lets verified users create accounts with their school email, sign in securely, and browse a shared marketplace experience designed for student-to-student trading.

The project combines a React + Vite frontend with a Flask + MongoDB backend. Current features include a validated signup flow, login, authenticated dashboard access, image uploads, and a marketplace feed for listings. It is meant to make it easy for students to post items, discover deals, and trade safely within the university community.

## Pages
🚀 [Live Demo]([https://username.github.io/repo])(https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

## Repository
[Repository](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace)
### Signup
The Signup page provides a seamless experience for new users to create an account and join the campus marketplace community.

# Campus Marketplace Frontend

This repository now contains only the React + Vite frontend for Campus Marketplace.

## Project Structure

- `Frontend/` - React app powered by Vite
- `docs/` - project documentation

## Run Locally

```bash
# backend
source .venv/bin/activate
python app.py

# frontend
cd Frontend
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Image Upload Storage (Important)

Uploaded listing images are written to the backend upload directory.

- Local development default: `./uploads`
- Production recommended: set `UPLOAD_DIR` to a persistent disk mount (example: `/var/data/uploads`)

If `UPLOAD_DIR` is not set in production, images may disappear after app restarts or redeploys when using ephemeral filesystem hosting.

### Recommended: Cloudinary (Permanent Object Storage)

The backend now supports Cloudinary uploads for listing images and profile avatars.

Add these environment variables to enable it:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Optional: `CLOUDINARY_UPLOAD_FOLDER` (default: `campus-marketplace`)

When these variables are present, image uploads are stored in Cloudinary instead of local disk.

Render note: the backend treats Render as production-like, so if Cloudinary is missing there, image uploads are rejected instead of being saved to ephemeral disk.

### Render checklist

Use this checklist after updating the Render service:

1. Confirm `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are set.
2. Confirm `MONGODB_URI` and `JWT_SECRET` are set.
3. Redeploy the backend service.
4. Open `/api/health` and verify it returns `"cloudinaryConfigured": true` and `"imageStorage": "cloudinary"`.
5. Upload a new image and confirm the response `storage` field is `cloudinary`.
6. Re-upload any old items or avatars that were previously stored on local disk.

Install dependencies after pulling this change:

```bash
pip install -r requirements.txt
```

## Build

### Implemented
- Home page with campus marketplace branding
- Navigation layout shared across pages
- Signup UI with front-end validation for required first/last name
- Signup UI validation for campus email format: @office.uc.ac.kr
- Signup UI validation for password strength and confirmation matching

### Planned
- Functional signup/login backend
- Buy and sell listing workflows
- Request board and tutoring/service posts
- MongoDB integration for user and listing data

## Tech Stack

| Area | Technology |
|------|------------|
| Backend | Flask 3 |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| Database (planned/in progress) | MongoDB (PyMongo) |

## Project Structure

```text
campusMarketPlace/
|-- app.py
|-- requirements.txt
|-- README.md
|-- index.html
|-- package.json
|-- package-lock.json
|-- .env
|-- .env.example
|-- Frontend/
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
