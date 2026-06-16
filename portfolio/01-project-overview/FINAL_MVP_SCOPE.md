# Final MVP Scope

## Final Core User Flow

1. A student opens the CampusMarketplace frontend.
2. The student signs up with a valid `@office.uc.ac.kr` email.
3. The student verifies the OTP flow when email delivery is configured.
4. The student logs in and receives a JWT.
5. The student browses active listings.
6. The student creates a listing with title, description, price, category, status, and image data.
7. Another student searches or browses listings, opens an item detail page, views seller information, and can use messaging/profile/review features where available.
8. The seller manages listing status from the dashboard or API.

## Features Included in Final MVP

- React + Vite frontend routing and shared layout
- Signup/login with campus email validation
- OTP verification endpoints and email delivery support
- JWT-authenticated protected flows
- Marketplace item list, item detail, create item, update item status
- MongoDB-backed user and item storage
- Image upload support with Cloudinary configuration and local fallback
- User profile, edit profile, password update, avatar upload/delete
- Public seller profiles and seller reviews
- Favorites/loved items
- Messaging thread and message API endpoints
- Search and category browsing routes
- Dark mode and UI polish
- Language and currency preference support
- GitHub Pages frontend deployment configuration
- Render-oriented backend configuration notes

## Features That Work Reliably

- Frontend build with Vite
- Backend Flask app startup with required environment variables
- API route definitions for auth, profile, items, messages, users, reviews, favorites, uploads, and health checks
- Campus email/password validation logic
- Listing CRUD basics through backend endpoints
- Profile/avatar endpoint logic
- GitHub Pages frontend build workflow

## Features That Work With Limitations

- Email OTP requires SendGrid or SMTP environment configuration.
- Cloudinary image storage requires Cloudinary environment variables; otherwise local storage is used in development and production-like environments may reject uploads.
- Integration tests in `tests/test_profile_endpoints.py` require `TEST_MONGODB_URI` and a Flask test client fixture that is not currently included.
- Frontend test script is a placeholder that exits successfully with "No frontend tests."
- Live frontend and backend deployment reliability depends on external GitHub Pages and Render configuration.
- Some early docs mention planned features or older stacks that changed during the semester.

## Features Excluded From Final MVP

- Payment processing
- Shipping or delivery workflow
- Native mobile app
- Admin moderation dashboard
- Recommendation engine
- Full real-time chat infrastructure beyond current message endpoints
- Cross-campus expansion
- Production-grade automated regression suite
