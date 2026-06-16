# Individual Portfolio — SOBSAGAR (Sagar Sob)

## 1. My Role

- **Name:** Sagar Sob (SOBSAGAR)
- **Team:** CapstoneDesign-Spring2026-UlsanCollege
- **Project:** CampusMarketPlace — a campus-focused buy/sell marketplace web application built with Flask (backend) and a JavaScript frontend
- **Main responsibilities:** Backend development (Flask/Python), security fixes, messaging feature implementation, sprint documentation, and project management rotation
- **Roles held during the semester:**
  - **Scribe** (initial assigned role) — recorded team decisions, updated documentation, flagged blockers, maintained sprint packets
  - **Project Manager / PM** (rotation) — led sprint planning in Week 4, created all sprint issues, tracked the project board, wrote sprint notes
  - **Backend Developer** — implemented auth security fix, messaging API endpoints, and backend infrastructure setup

---

## 2. My Strongest Contributions

| Contribution | What I personally did | Evidence link |
|---|---|---|
| Security fix: JWT issued before email verification | Identified the vulnerability where the signup endpoint issued auth tokens before users verified their email. Removed the `issue_token()` call from signup, added an `isVerified` 403 gate in login, updated user-facing messages, tested via Postman/curl locally | [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62) |
| Messages feature — full UI/UX and API overhaul | Built the full-screen messages layout, fixed send button clipping (Issue #143), added Enter-to-send, implemented per-message sent/delivered/seen status with read receipts, polished bubble design and typography across 10+ issues | [Issues #131–#143](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues?q=is%3Aissue+author%3ASOBSAGAR) |
| Backend folder and Flask app scaffolding | Created the backend folder structure in April, set up the Flask app with auth routes and password validation (PR #12), establishing the foundation for all subsequent backend work | [PR #12](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/12) |
| Sprint documentation and PM duties | Added Sprint 4 documentation, Week 11 sprint packet, midterm submission doc, and led sprint planning including full issue creation and task assignment for the team | [Sprint_Packet/SPRINT_4.md](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/docs/Sprint_Packet/SPRINT_4.md) |

---

## 3. One Area I Can Explain Clearly

- **Area:** JWT Security — preventing auth token issuance before email verification
- **File, folder, Issue, PR, or doc:** [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62) — closes Issue #38
- **What it does:** Enforces that a user must verify their email address before they can receive a JWT token and log into the application. Before this fix, the signup endpoint issued a token immediately, letting unverified accounts bypass the verification step entirely.
- **How it works:**
  1. **Signup endpoint** — the `issue_token()` call was removed; the response now tells the user to verify their email before logging in.
  2. **Login endpoint** — an `isVerified` check was added that returns HTTP 403 (Forbidden) if the user has not completed email verification. No token is issued.
- **How it was tested:** Ran `python app.py` locally; tested both flows manually — confirmed signup returns no token, and login with an unverified account returns 403. Postman/curl used for endpoint verification.
- **One possible failure or limitation:** Existing users in the database who had already signed up but never verified their email before this patch was deployed would be silently locked out at login with no clear path to re-request verification. A migration or re-send-verification flow would be needed to handle this edge case gracefully.
- **Evidence link:** [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62)

---

## 4. My AI Use

- **AI tools used:** Claude (likely used for code drafting and debugging assistance, consistent with team practices during the capstone)
- **What AI helped with:** Drafting boilerplate Flask route structures, suggesting CSS layout fixes for the messages panel (e.g., `grid-template-rows: minmax(0, 1fr)` for Issue #143), and generating initial pytest scaffolding for endpoint smoke tests
- **What I personally checked:** Verified that the JWT fix actually blocked unverified logins end-to-end by testing manually; confirmed that the messages layout changes rendered correctly in the browser at multiple screen sizes; reviewed that the `isVerified` field was correctly set in the database schema
- **What I personally changed:** Adjusted the HTTP status code choice (403 vs 401) based on the semantic difference between unauthenticated and unauthorized; refined the CSS overflow and grid-row fix after AI suggestions did not fully account for the existing `.page-shell` grid inheritance
- **How I tested or verified it:** Manual Postman testing for the auth fix; browser visual testing for the messages UI; local `python app.py` runs before each PR
- **One part I still do not fully understand:** The exact timing behavior of JWT expiry interacting with the `isVerified` flag — specifically, whether a token issued before this fix (to a now-unverified user) would still be accepted by middleware after the patch was deployed

---

## 5. One Problem I Helped Solve

- **Problem:** The messaging page had a critical UX bug where the send button was completely clipped and invisible. The compose area was hidden by `overflow: hidden` on the `.messages-panel` container, and the grid container lacked explicit row sizing, causing the panel to shrink below the compose row.
- **Why it mattered:** Without a visible and functional send button, users could not send messages at all — the core messaging feature was broken in the current layout. This blocked the final messaging demo.
- **What I did:** Filed Issue #143 with a detailed root-cause analysis identifying two separate bugs (overflow clipping + missing `grid-template-rows`). Then implemented the fix in the commit "Fix #143: send button clipped — grid row height and panel overflow," removing `overflow: hidden` from `.messages-panel`, adding `grid-template-rows: minmax(0, 1fr)` to `.messages-shell`, and adjusting the `calc(100vh - ...)` height to prevent recurrence.
- **What changed:** The compose area and send button became fully visible and functional. The messages page layout became stable across viewport sizes, and the fix was merged as part of the June 10 batch of messaging improvements.
- **Evidence link:** [Issue #143](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/143)

---

## 6. Reflection

### What I learned

- How JWT authentication flows actually work end-to-end, and how subtle timing bugs in auth (issuing tokens too early) can create serious security holes that are easy to overlook during development
- How CSS grid layout interacts with inherited properties — especially how `overflow: hidden` on a parent can silently clip child content in ways that are hard to debug without understanding the full layout tree
- How to write structured sprint documentation that is actually useful to the team, not just a formality

### What I am most proud of

- The security fix in PR #62 — I independently identified a real authentication vulnerability, understood its implications (unverified users bypassing email gates), implemented the fix correctly across both signup and login paths, and got it merged. It was a small PR but it mattered for product integrity.
- The messaging overhaul in early June — going from a broken, visually inconsistent page to a polished, full-featured messaging experience with read receipts across 10+ tracked issues felt like real ownership of a feature.

### What I should have done better

- Started backend implementation earlier. The backend folder wasn't created until mid-April, which compressed the time available for building and testing API endpoints.
- Wrote more automated tests. The PATCH /api/items endpoint and pytest coverage were assigned to me in Sprint 4, and relying primarily on manual Postman testing is not a sustainable practice.

### What I would improve next

- Add proper integration tests (pytest with a test database) for every endpoint I own, not just smoke tests
- Document the API endpoints in a shared spec (OpenAPI/Swagger) so frontend and backend stay in sync without constant back-and-forth

### One skill I want to continue developing

- Backend security: specifically OAuth flows, token refresh handling, and rate limiting — the email verification fix gave me a taste of thinking adversarially about auth, and I want to go deeper into secure API design

---

## 7. My Best Evidence Links

1. [PR #62 — fix: do not issue JWT token before email verification (merged)](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62)
2. [Issue #143 — Bug: Send button clipped; overflow:hidden on panel cuts compose actions row](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/143)
3. [PR #12 — feat: Add Flask backend with auth and password validation](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/12)
4. [Commit — "Add sent/delivered/seen message status with read receipts" (Jun 10, 2026)](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commits/main?author=SOBSAGAR)
5. [Sprint_Packet/SPRINT_4.md — Sprint 4 documentation authored by Sagar](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/docs/Sprint_Packet/SPRINT_4.md)
