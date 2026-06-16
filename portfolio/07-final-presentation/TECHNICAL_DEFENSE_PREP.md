# Technical Defense Prep

## Likely Questions

| Question | Prepared answer |
|---|---|
| What problem does this solve? | It gives Ulsan College students a campus-focused place to buy/sell items with more trust and relevance than public marketplaces. |
| Why campus email? | The email domain creates a basic trust gate so the marketplace is scoped to students. |
| Why React + Vite? | Vite gave the team a fast frontend dev/build workflow, and React made routing and reusable components easier. |
| Why Flask? | Flask is lightweight, Python-based, and practical for capstone API development. |
| Why MongoDB? | Listings, users, messages, and reviews fit flexible document storage, and the team planned MongoDB during early architecture changes. |
| How is auth handled? | The backend validates credentials and issues JWTs. Protected endpoints read the Bearer token and identify the current user. |
| How is ownership enforced? | Item update routes compare the authenticated user ID with the item seller ID before allowing edits. |
| How are images stored? | The backend supports local uploads for development and Cloudinary when configured. |
| What if OTP email fails? | Use configured SendGrid/SMTP for production; for demo, use a pre-verified account as backup. |
| What are the biggest limitations? | External service configuration, incomplete automated tests, and missing formal weekly evidence for some weeks. |
| What would you improve next? | Add real CI tests, seed data, stronger messaging UX, admin moderation, and better deployment monitoring. |

## Code Areas to Show

- Auth routes in [app.py](../../app.py)
- Item routes in [app.py](../../app.py)
- Frontend API helper in [Frontend/src/services/api.js](../../Frontend/src/services/api.js)
- Dashboard/listing UI in [Frontend/src/routes/Dashboard.jsx](../../Frontend/src/routes/Dashboard.jsx)
- Browse/search UI in [Frontend/src/routes/Browse.jsx](../../Frontend/src/routes/Browse.jsx) and [Frontend/src/routes/Search.jsx](../../Frontend/src/routes/Search.jsx)

## Honest Limitations to State

- The app needs configured services for a complete hosted demo.
- Automated tests exist as a draft but need fixture setup.
- Some semester docs are incomplete or placeholder-heavy.
- Other team members still need to add their individual portfolio pages.
