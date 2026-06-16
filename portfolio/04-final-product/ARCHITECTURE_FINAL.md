# Final Architecture

## Tech Stack

| Area | Technology |
|---|---|
| Frontend | React 18, Vite, React Router |
| Styling | Custom CSS in `Frontend/src/assets/styles/global.css` |
| Backend | Flask 3 |
| Database | MongoDB via PyMongo |
| Auth | JWT, password hashing, OTP verification flow |
| Images | Local uploads in development, Cloudinary when configured |
| Email | SendGrid preferred, SMTP fallback |
| Deployment | GitHub Pages frontend, Render-style backend configuration |

## Major Folders

- `Frontend/`: React + Vite frontend
- `Frontend/src/routes/`: page-level frontend routes
- `Frontend/src/components/`: reusable UI pieces
- `Frontend/src/services/`: API, auth, currency, i18n helpers
- `app.py`: main Flask backend
- `models/`: backend model helpers
- `tests/`: integration test draft/evidence
- `docs/`: semester documentation
- `portfolio/`: final handoff portfolio

## Major Frontend Screens

- Home
- Browse
- Search
- Login
- Signup
- Dashboard
- ItemDetail
- Messages
- Profile
- EditProfile
- PublicProfile
- ChangePassword

## Major Backend Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/verify-email-otp`
- `POST /api/auth/resend-email-otp`
- `GET /api/auth/me`
- `GET /api/profile`
- `PUT /api/profile`
- `PUT /api/profile/password`
- `POST /api/profile/avatar`
- `DELETE /api/profile/avatar`
- `POST /api/uploads/image`
- `GET /api/items`
- `GET /api/items/<item_id>`
- `POST /api/items`
- `PUT /api/items/<item_id>`
- `POST /api/items/<item_id>/favorite`
- `GET /api/users/<user_id>`
- `GET /api/users/<user_id>/reviews`
- `POST /api/users/<user_id>/reviews`
- `GET /api/messages/threads`
- `POST /api/messages/threads`
- `GET /api/messages/threads/<thread_id>`
- `POST /api/messages/threads/<thread_id>/read`
- `GET /api/messages/threads/<thread_id>/messages`
- `POST /api/messages/threads/<thread_id>/messages`

## Data Model Areas

- Users
- Email verification records
- Items/listings
- Images/avatar URLs
- Favorite item IDs
- Message threads and messages
- Seller reviews

## Text Diagram

```text
[Student Browser]
      |
      v
[React + Vite Frontend on GitHub Pages]
      |
      v
[Flask API / app.py]
      |
      +--> [MongoDB: users, items, messages, reviews]
      +--> [SendGrid or SMTP: OTP email]
      +--> [Cloudinary or local uploads: images]
```

## Evidence

- Backend routes: [app.py](../../app.py)
- Frontend app: [Frontend/src/App.jsx](../../Frontend/src/App.jsx)
- API helper: [Frontend/src/services/api.js](../../Frontend/src/services/api.js)
- Original architecture sketch: [docs/Architecture_sketch.md](../../docs/Architecture_sketch.md)
