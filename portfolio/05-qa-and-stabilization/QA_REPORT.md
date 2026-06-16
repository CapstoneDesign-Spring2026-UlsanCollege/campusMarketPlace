# QA Report

## Core Flow Checklist

| Check | Status | Evidence |
|---|---|---|
| Frontend builds with Vite | Needs final run before submission | [Frontend/package.json](../../Frontend/package.json) |
| Backend starts locally | Needs final run before submission | [app.py](../../app.py) |
| Campus email validation | Implemented | [app.py](../../app.py), [README.md](../../README.md) |
| Strong password validation | Implemented | [app.py](../../app.py) |
| Signup endpoint | Implemented | [app.py](../../app.py) |
| Login endpoint | Implemented | [app.py](../../app.py) |
| OTP verification endpoints | Implemented with service dependency | [app.py](../../app.py) |
| Browse listings | Implemented | [Frontend/src/routes/Browse.jsx](../../Frontend/src/routes/Browse.jsx) |
| Item detail | Implemented | [Frontend/src/routes/ItemDetail.jsx](../../Frontend/src/routes/ItemDetail.jsx) |
| Create/update items | Implemented | [app.py](../../app.py), [Frontend/src/routes/Dashboard.jsx](../../Frontend/src/routes/Dashboard.jsx) |
| Profile/avatar flow | Implemented; manual test notes exist | [docs/ProfileTesting.md](../../docs/ProfileTesting.md) |
| Messaging flow | Implemented but should be demo-tested | [Frontend/src/routes/Messages.jsx](../../Frontend/src/routes/Messages.jsx), [app.py](../../app.py) |

## Manual Test Evidence

- Profile testing notes: [docs/ProfileTesting.md](../../docs/ProfileTesting.md)
- Week 11 verification packet: [WEEK_11.md](../02-semester-journey/weekly-sprints/WEEK_11.md)
- Week 13 feature completion packet: [WEEK_13.md](../02-semester-journey/weekly-sprints/WEEK_13.md)

## Automated Tests

The repo contains [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py), which covers:

- Signup/login and avatar upload/delete
- Owner item status update
- Favorite item persistence
- Seller review creation/fetch

Limitation: the test file is skipped unless `TEST_MONGODB_URI` is set and expects a Flask test client fixture that is not included in the repo.

## CI Evidence

- GitHub workflows exist in [.github/workflows](../../.github/workflows)
- Frontend test script currently returns success with "No frontend tests"
- CI should be improved to run real backend tests after a test fixture is added

## Browser or Device Checks

- The app is built as a responsive React web app.
- Profile testing notes include browser-based local steps.
- Final rehearsal should include desktop and mobile viewport checks.

## Accessibility Checks

No formal accessibility audit file was found. Basic checks before demo should include keyboard navigation, visible focus states, readable contrast in dark mode, labels/placeholders, and alt text for meaningful images.

## Security Basics

- Password strength validation exists.
- Campus email validation exists.
- JWT secret configuration is documented.
- Production-like image storage behavior avoids silently using ephemeral local storage when Cloudinary is missing.
- Secrets must stay in `.env` and not be committed.

## Deployment Reliability

- Frontend GitHub Pages deployment is documented.
- Backend deployment depends on environment variables and external services.
- Backup demo should be ready.
