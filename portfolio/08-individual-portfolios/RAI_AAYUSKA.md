# Individual Portfolio — Rai Aayuska

## 1. My Role

- **Name:** Rai Aayuska
- **Team:** CapstoneDesign-Spring2026-UlsanCollege
- **Project:** campusMarketPlace
- **Main responsibilities:** Frontend UI/UX, profile page features, file upload fixes, documentation updates, GitHub Pages workflow setup
- **Roles held during the semester:** Contributor, Frontend developer, Documentation owner

## 2. My Strongest Contributions


| Contribution | What I personally did | Evidence link |
|---|---|---|
| Add Vite frontend / Setup Vite | Initialized the modern React frontend using Vite and added initial app structure and config | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/25 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26 |
| Profile page & profile button integration | Added profile page, profile button in navbar, hamburger menu, and currency/language toggles | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94 |
| Currency & language toggle + currency display update | Implemented the toggle UI and updated currency displays from USD to KRW across the frontend | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/74 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/e392d9d5d26afba78b163dc2708d7b1bb43b34a6 |
| File upload bug fix | Diagnosed and fixed file upload handling so uploads succeed end-to-end; coordinated backend fix and frontend changes | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/88d3d6ab381cd6a205cb161a7641a18294fc91f3 |
| GitHub Actions workflow for Pages | Added CI workflow to deploy frontend to GitHub Pages and fixed CORS issues for the site | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/54f22782dd0e86841c4052a65b1179dcc249ad5a |
| Update backend / `app.py` changes | Updated server logic and small backend fixes referenced in PRs, improving profile and API behavior | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/48 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/d4ec9608a60e51865d11220d40c1806cce2b8efb |
| MIDTERM and docs improvements | Reorganized and updated MIDTERM_SUBMISSION and other docs to improve evidence and links | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/36e493d2ddb0ddcf4d456af5ea536798aab1afb7 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/b9471bb7be565486faa2935c72f49f92b375a97e |
| Resolve merge conflicts and feature merges | Resolved conflicts to merge profile feature and dashboard changes cleanly into `main` | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/3945ccbb40e82707f9d30f7e29358368a350bf50 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/726bb3cf2a818ca0515f9833f70e21abc1b3a001 |
| UI/UX updates and new light mode | Implemented UI tweaks and a new light mode theme to improve accessibility and look-and-feel | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/107 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/8aef2047912e67643ba5ed55ada77e914bc3dec9 |


## 3. One Area I Can Explain Clearly

- **Area:** Profile page and profile navigation
- **File, folder, Issue, PR, or doc:** PR #94 (profile feature) — https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94
- **What it does:** Adds a user profile page reachable from a profile button in the navbar. Provides view/edit of user details, toggles for currency/language, and links to purchase/sell history.
- **How it works:** Frontend React components render the profile UI; the navbar component conditionally shows the profile button when authenticated. The profile page fetches user data from backend endpoints and posts updates to the profile API. Currency/language toggles update UI state and format displays accordingly.
- **How it was tested:** Manual UI testing in the browser (navigating to profile, editing fields, toggling currency), and verified changes by running the app and checking that API calls returned expected responses. Linked commits include fixes for CORS and file upload behavior that were validated during testing.
- **One possible failure or limitation:** If backend profile endpoints change schema or authentication tokens expire, frontend profile operations may fail; mitigation: add defensive error handling and integration tests.
- **Evidence link:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94

## 4. My AI Use

- **AI tools used:** GitHub Copilot and ChatGPT (used as drafting and suggestion aids)
- **What AI helped with:** Drafting PR descriptions and commit messages, proposing wording for README/docs, suggesting small UI/text refinements and troubleshooting approaches
- **What I personally checked:** All AI suggestions for correctness; reviewed and tested any code changes before committing
- **What I personally changed:** Implemented the final code and UI changes, edited AI-proposed text for clarity and accuracy, and removed or modified any incorrect suggestions
- **How I tested or verified it:** Ran the app locally for manual testing, reviewed diffs in PRs, and ensured CI/linting passed where applicable
- **One part I still do not fully understand:** How to craft prompts that yield consistently precise code suggestions for complex refactors

## 5. One Problem I Helped Solve

- **Problem:** File upload handler was not functioning, causing user image/uploads to fail
- **Why it mattered:** Uploads are required for item listings and profiles; without them core features were broken
- **What I did:** Traced the bug, applied a fix to the upload handler and supporting frontend code, and opened PR #52
- **What changed:** File uploads now succeed; related UI and docs were updated to reflect the fix
- **Evidence link:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52

## 6. Reflection

### What I learned

- How to integrate UI features across a React frontend and coordinate with backend endpoints
- How to diagnose and fix file upload issues and CORS problems for GitHub Pages deployment

### What I am most proud of

- Delivering the profile experience and currency toggle that improved UX for users

### What I should have done better

- Added automated integration tests earlier to catch upload and CORS issues sooner

### What I would improve next

- Introduce end-to-end tests covering profile and upload flows

### One skill I want to continue developing

- Full-stack integration testing and CI automation

## 7. My Best Evidence Links

1. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/74
2. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52
3. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94
4. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/48
5. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/109

---

Notes: this is a draft based on your GitHub commits/PRs. Tell me any wording changes or additional evidence you'd like included and I'll update the file.
