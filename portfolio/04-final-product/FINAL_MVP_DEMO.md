# Final MVP Demo

## Main User Flow

1. Open the frontend demo or run the app locally.
2. Create an account with a campus email ending in `@office.uc.ac.kr`.
3. Verify the email OTP if email delivery is configured.
4. Log in and reach the authenticated experience.
5. Browse marketplace listings.
6. Search or filter by category.
7. Open an item detail page and review seller/item information.
8. Create a new listing with item details and image support.
9. Use dashboard/profile features to manage user state.
10. Use the backup path if external email/image/deployment services fail.

## Access

- Frontend demo: https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/
- Repository: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace
- Backend local URL by default: `http://localhost:5050`
- Frontend local URL by default: `http://localhost:5173`

## Demo Credentials

No public demo credentials are committed in this repo. For a live demo, use a pre-created test account or create one during rehearsal with a valid `@office.uc.ac.kr` email. If OTP email delivery is unavailable, use a locally pre-verified database account for the demo and explain the limitation.

## Demo Notes

- Email OTP delivery requires SendGrid or SMTP settings.
- Cloudinary image upload requires Cloudinary environment variables.
- MongoDB must be reachable for backend data flows.
- The frontend can be shown from GitHub Pages even if backend services are unavailable, but the full MVP requires the Flask API.

## Evidence Links

- Final backend: [app.py](../../app.py)
- Frontend routes: [Frontend/src/routes](../../Frontend/src/routes)
- API service: [Frontend/src/services/api.js](../../Frontend/src/services/api.js)
- README run instructions: [README.md](../../README.md)
- Week 11 MVP verification: [Week 11 packet](../02-semester-journey/weekly-sprints/WEEK_11.md)
- Week 13 feature completion: [Week 13 packet](../02-semester-journey/weekly-sprints/WEEK_13.md)
