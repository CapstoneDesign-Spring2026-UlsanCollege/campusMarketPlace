# Deployment and Demo Plan

## How the App Will Be Shown

Primary plan:

1. Open the frontend demo at https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/
2. Confirm the backend API is reachable.
3. Demonstrate signup/login or use a pre-created verified demo account.
4. Browse/search listings.
5. Open an item detail page.
6. Create or update a listing.
7. Show profile/dashboard features.
8. Briefly show backend/API evidence in GitHub if needed.

## Required Accounts or Services

- GitHub Pages frontend
- Backend hosting service, likely Render
- MongoDB database
- Optional SendGrid/SMTP for OTP
- Optional Cloudinary for persistent image uploads

## Local-Run Requirements

- Python virtual environment with `requirements.txt`
- Node/npm dependencies installed
- `.env` configured
- MongoDB available
- Backend on port `5050`
- Frontend on port `5173`

## Demo Data

Use controlled demo data:

- One verified buyer account
- One verified seller account
- At least three marketplace items across different categories
- At least one item with an image
- At least one profile/avatar example if Cloudinary is configured

## Backup Option

- Run locally from the cloned repo.
- Use screenshots or code walkthrough if hosting fails.
- Use manually pre-verified database users if email delivery fails.
- Use existing image URLs or local upload fallback if Cloudinary fails.
- Show GitHub PR/commit evidence for features that cannot be live-demonstrated.

## Known Risks

- Backend deployment may be down or sleeping.
- MongoDB/Cloudinary/SendGrid credentials may be missing or expired.
- Email OTP cannot be demonstrated without provider configuration.
- Network issues can break live demo flow.
- Tests are not a full automated safety net yet.
