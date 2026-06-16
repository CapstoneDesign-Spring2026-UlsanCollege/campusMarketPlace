# Scope Decisions

| Feature or idea | Final status | Why | Evidence |
|---|---|---|---|
| Campus-only marketplace | Included | Core project purpose from the first pitch | [PROJECTPITCH.md](../../docs/PROJECTPITCH.md) |
| React + Vite frontend | Included | Became the final frontend stack and is used by `Frontend/` | [Frontend/package.json](../../Frontend/package.json) |
| Flask backend | Included | Main API implementation is in Flask | [app.py](../../app.py) |
| MongoDB | Included | Final backend stores users/items/messages/reviews in MongoDB collections | [app.py](../../app.py) |
| Campus email signup | Included | Required trust gate for Ulsan College students | [README.md](../../README.md) |
| OTP email verification | Working with limitations | Endpoints and email sender exist, but real delivery needs SendGrid/SMTP env vars | [app.py](../../app.py), [README.md](../../README.md) |
| Login and JWT auth | Included | Required for dashboard/profile/listing ownership | [app.py](../../app.py) |
| Browse active listings | Included | Main buyer flow | [Frontend/src/routes/Browse.jsx](../../Frontend/src/routes/Browse.jsx), [app.py](../../app.py) |
| Create item listing | Included | Main seller flow | [Frontend/src/routes/Dashboard.jsx](../../Frontend/src/routes/Dashboard.jsx), [app.py](../../app.py) |
| Search and category filtering | Included | Needed to find listings | [Frontend/src/routes/Search.jsx](../../Frontend/src/routes/Search.jsx), [Frontend/src/constants/categories.js](../../Frontend/src/constants/categories.js) |
| Image upload | Working with limitations | Supports Cloudinary or local storage, requires env configuration | [README.md](../../README.md), [app.py](../../app.py) |
| User dashboard | Included | Lets signed-in users manage their experience | [Frontend/src/routes/Dashboard.jsx](../../Frontend/src/routes/Dashboard.jsx) |
| Profile editing and avatars | Included | Final polish and user identity feature | [Frontend/src/routes/Profile.jsx](../../Frontend/src/routes/Profile.jsx), [Frontend/src/routes/EditProfile.jsx](../../Frontend/src/routes/EditProfile.jsx), [docs/ProfileTesting.md](../../docs/ProfileTesting.md) |
| Favorites/loved items | Included | Implemented in backend/profile evidence | [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py) |
| Seller reviews | Included | Implemented in backend and integration test draft | [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py) |
| Messaging | Working with limitations | Backend routes and frontend page exist, but final demo should have a backup plan | [Frontend/src/routes/Messages.jsx](../../Frontend/src/routes/Messages.jsx), [app.py](../../app.py) |
| Payments | Cut | Out of scope and not needed for campus in-person exchange | [docs/Design Doc v1.md](../../docs/Design%20Doc%20v1.md) |
| Shipping/delivery | Cut | Marketplace is campus/local exchange | [docs/Design Doc v1.md](../../docs/Design%20Doc%20v1.md) |
| Admin dashboard | Nice Later | Mentioned as optional in early scope, not required for final MVP | [docs/PROJECT_1.md](../../docs/PROJECT_1.md) |
| Recommendation engine | Nice Later | Advanced feature held after MVP | [docs/Design Doc v1.md](../../docs/Design%20Doc%20v1.md) |
| Native mobile app | Cut | Responsive web app is enough for capstone MVP | [docs/Design Doc v1.md](../../docs/Design%20Doc%20v1.md) |
