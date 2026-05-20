# Profile Testing Notes

## What to verify
- Signed-in users stay in the authenticated nav when opening Profile.
- Clicking Home while signed in keeps users in the dashboard experience.
- Profile loads the current signed-in user's details.
- Edit Profile saves name and location.
- Avatar uploads are resized client-side and displayed as a clean avatar.
- Avatar delete removes the current avatar.

## Local test steps
1. Start backend:
   ```bash
   /Users/gayatribhandari/Documents/campusMarketPlace/.venv/bin/python app.py
   ```
2. Start frontend:
   ```bash
   cd Frontend && npm run dev
   ```
3. Sign in, open Profile, upload a square image, and confirm it shows as a fixed-size avatar.
4. Click Home while signed in and confirm you remain in the dashboard.

## Test data
- Email format: `@office.uc.ac.kr`
- Password must include uppercase, lowercase, number, and special character.
