# Individual Portfolio — Rai Sudarshan

## 1. My Role

- **Name:** Rai Sudarshan
- **Team:** CapstoneDesign-Spring2026-UlsanCollege
- **Project:** campusMarketPlace
- **Main responsibilities:** Backend/API development, authentication and database setup, upload handling, frontend CI support, sprint documentation, and repository hygiene
- **Roles held during the semester:** Backend Developer, API Integrator, CI/DevOps Support, Documentation Contributor

## 2. My Strongest Contributions

| Contribution | What I personally did | Evidence link |
|---|---|---|
| Project foundation and HTML boilerplate | Set up the initial HTML base and early project structure that the rest of the app built on | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/1 |
| Authentication hardening | Added confirm-password handling and later rate limiting on auth endpoints to improve login/signup safety | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f0055058b2fca76890f5571b3d6d9601980b097e https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/0d3215bc40cdf44227980bb132eb850fe8124cbb |
| Flask app initialization and database setup | Initialized the Flask application, connected MongoDB, and improved database connection comments and configuration | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f4e45a81e6a55ee4afee4dbfcb6e1a57f21d63b8 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/b2def49c9e7d4b56dd96b8a017c68d64c43e9366 |
| User authentication and token flow | Added signup, login-related comments, JWT token generation, and supporting auth endpoint work | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/550cc3079808579d6bfe19ae1b784c462d7b0579 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/e6e5f6477f021c86cf35f2e2316d6620b0a54845 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/c7e88b3c03b98fad6783031fde0364ca2fc7437e |
| Marketplace API endpoints | Implemented endpoints for marketplace items, user profile summary, message threads, and avatar upload | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/dfb331b5fc753162123bfc2398ba6f1432f02221 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/659663d52f3fa79da4ab30856ae8acd042b75d35 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/cc000e7423de29547b66c24e8be6e08ae9770c1c https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/05ad30249c3fb2b644211df00d2d5c25d5f1a215 |
| Upload configuration and limits | Configured the upload folder path, capped image upload size at 5MB, and kept uploads organized in the repo | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/e00a4968880063e3c8eaffb57dea2c07273f333d https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/24f4d1120d66dd13f3291ee84393fc06cc22fed4 |
| Frontend CI and repo hygiene | Fixed the frontend CI pipeline, updated `.gitignore`, and prevented `node_modules` and uploads from polluting the repo | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f14d10a20bee0411a47d0fa0d9168a65b5c585d3 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/816954f036862a6789a5e1279aab455058f71c44 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/c65c2a9abdcb7852503a9337d1c5acd6c178a75a |
| Sprint documentation and weekly packets | Added and revised sprint packet documentation across multiple weeks so project history stayed complete | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/de5d7a68a0e0cb8683284c8304f92e03eb12153e https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/cce63a3fa9048d516a15ebda5d6091c65f1571c3 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/105 |
| Week 12 sprint work | Created Week 12 sprint packet work and later merged the completed version | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/96 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/105 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/09a119694b8bcbd41076a69e50ec5076dfe94701 |
| Backend comments, clarity, and app cleanup | Updated comments and cleaned server code for email/SMTP, OTP TTL, title text, and general app readability | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/8d1f2766964bad2ac76a8964a771c8135e0f9e90 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/eea565daf9e78199cdcc08ee994505846227ecec https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/855dc51a97c12c9b4d4c280ae97ea0d55ff866ea |

## 3. One Area I Can Explain Clearly

- **Area:** Backend authentication and marketplace API design
- **File, folder, Issue, PR, or doc:** `app.py` changes across backend commits, including Flask initialization, MongoDB connection, JWT auth, signup/login, and endpoint additions
- **What it does:** Powers the core backend for the marketplace: user authentication, token generation, item retrieval, profile summaries, message threads, avatar uploads, and upload handling
- **How it works:** Flask bootstraps the server, connects to MongoDB, and exposes REST endpoints for the frontend. Authentication uses password handling and JWT token generation. Upload endpoints validate size and use a configured upload folder path. Marketplace and profile endpoints return JSON data for React components to render
- **How it was tested:** By running the application locally, checking server startup behavior, verifying endpoint responses, and confirming that frontend changes could consume the data without breaking the UI
- **One possible failure or limitation:** If the database connection or upload path is misconfigured, the backend can boot but fail at runtime for auth, uploads, or item queries; this needs environment checks and integration tests
- **Evidence link:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f4e45a81e6a55ee4afee4dbfcb6e1a57f21d63b8 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/b2def49c9e7d4b56dd96b8a017c68d64c43e9366 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/550cc3079808579d6bfe19ae1b784c462d7b0579 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/dfb331b5fc753162123bfc2398ba6f1432f02221

## 4. My AI Use

- **AI tools used:** GitHub Copilot and ChatGPT for drafting, cleanup, and troubleshooting support
- **What AI helped with:** Suggested endpoint structure, wording for comments and sprint docs, ideas for CI and repo hygiene fixes, and small refactoring suggestions
- **What I personally checked:** I reviewed all AI output for accuracy, checked commit diffs, and verified that backend and CI changes matched the project requirements
- **What I personally changed:** I adjusted AI suggestions to fit the actual Flask/MongoDB codebase, corrected wording, and applied the final implementation myself
- **How I tested or verified it:** I ran the app locally, checked endpoint responses, confirmed CI-related file changes, and reviewed merge results in the repository
- **One part I still do not fully understand:** The best way to structure larger backend prompts so AI suggestions stay consistent across multiple related files

## 5. One Problem I Helped Solve

- **Problem:** The backend needed stronger authentication safeguards and a cleaner API foundation before the rest of the app could depend on it
- **Why it mattered:** Without a stable auth and database layer, user signup/login, uploads, and marketplace data retrieval could not work reliably
- **What I did:** I added auth-related improvements, rate limiting, JWT support, database initialization, and several core endpoints while also cleaning up comments and configuration
- **What changed:** The backend became more secure, easier to understand, and ready for frontend integration and later feature work
- **Evidence link:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/0d3215bc40cdf44227980bb132eb850fe8124cbb https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f4e45a81e6a55ee4afee4dbfcb6e1a57f21d63b8 https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/c7e88b3c03b98fad6783031fde0364ca2fc7437e

## 6. Reflection

### What I learned

- How to set up and extend a Flask backend for a real project
- How MongoDB, JWT authentication, and file uploads fit together in a marketplace app
- How CI, `.gitignore`, and repository hygiene affect team workflow
- How documentation work matters as much as code when a project is graded and maintained

### What I am most proud of

- Building a large part of the backend foundation that other features depended on
- Helping the project move from basic setup into a working authenticated application
- Keeping the sprint and week-by-week project history organized

### What I should have done better

- Added more automated tests earlier
- Documented endpoint behavior more formally while the backend was still changing quickly
- Separated some commits into smaller, easier-to-review changes

### What I would improve next

- Add stronger integration tests for auth, uploads, and marketplace endpoints
- Improve error handling and validation messages in the backend
- Add more explicit API documentation for frontend developers

### One skill I want to continue developing

- Backend architecture and API reliability for full-stack applications

## 7. My Best Evidence Links

1. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/1
2. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/0d3215bc40cdf44227980bb132eb850fe8124cbb
3. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f4e45a81e6a55ee4afee4dbfcb6e1a57f21d63b8
4. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/105
5. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/05ad30249c3fb2b644211df00d2d5c25d5f1a215

---

Notes: this draft consolidates the visible commits and PRs for Raisudarshan2002. If you want, I can also make this more formal, shorten it for submission, or add a matching file name change to keep the portfolio folder consistent.

