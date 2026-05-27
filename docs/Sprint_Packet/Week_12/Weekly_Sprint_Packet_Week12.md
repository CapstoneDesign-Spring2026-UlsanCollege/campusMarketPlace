# Week 12 Weekly Sprint Packet - Close the Gaps


One submission per team. PM or Scribe submits this Issue by Friday at 23:59.


**Evidence rule:** If it is not linked, it did not happen.


**AI rule:** AI-assisted work only counts if your team can run it, explain it, test it, debug it, and link evidence.


---


## 0) Team + Sprint Info


- **Team:** CampusMarketplace
- **Week:** 12
- **Sprint:** Sprint 4
- **Phase:** Close the Gaps - Listings UI + Email + Tests
- **PM:** Rai Sudarshan
- **Scribe:** Rai Aayuska
- **QA Lead:** Tamang Ananda
- **Demo Driver:** Gayatri K. Bhandari
- **AI Steward:** Rai Aayuska


---


## 1) Verified MVP Core Flow


Our main user can:
1. Register with a campus email (@office.uc.ac.kr)
2. Log in with JWT-authenticated accounts
3. Browse and post marketplace items with images, price, and category


**Core Flow Verification Issue**
- Issue link: [add issue link]


**Verification Result**
- [x] Partly verified


**Brief explanation:**
The Week 11 backend flow is in place and remains the baseline for Week 12. This week focuses on closing the remaining gaps around listings browsing, email verification delivery, image upload, and automated tests so the core flow is not just functional but repeatable and demo-ready.


---


## 2) Weekly Progress Demo


- **Demo type:** code walkthrough + live UI demo + screenshots
- **Demo link or evidence:** [add staging or live demo link]


**What changed since last week?**
1. Sprint 4 Week 12 started with the goal of closing front-end and infrastructure gaps from the MVP verification sprint.
2. Listings browse UI work is being aligned with the real GET /api/items backend response.
3. OTP email delivery, pytest smoke tests, and Cloudinary upload wiring are the remaining infrastructure tasks for the sprint.


**3-bullet demo script**
1. Register with a campus email and confirm the verification flow is ready for real OTP delivery.
2. Log in and browse the homepage listings grid powered by real API data.
3. Post a new item with title, price, category, and image upload, then confirm it appears in the items API response.


**Backup plan**
If the demo fails, we will show:
- Screenshots of the live API responses for auth and items
- A code walkthrough of the Week 12 frontend and backend changes
- GitHub PR links and commit history as evidence of progress


---


## 3) Board Snapshot


- **Board link or screenshot:** [add project board link]


### Done this week


| Item | Owner | Definition of DoD met? | Evidence link |
|---|---|---|---|
| [Week 12 item 1] | [owner] | [Yes/No] | [link] |
| [Week 12 item 2] | [owner] | [Yes/No] | [link] |
| [Week 12 item 3] | [owner] | [Yes/No] | [link] |


### Doing now


| Item | Owner | Next action | Blocked? |
|---|---|---|---|
| Build listings browse UI | Gayatri K. Bhandari | Connect homepage grid to GET /api/items | No |
| Integrate OTP email sending | Ananda Tamang | Wire SendGrid and verify delivery path | No |
| Add pytest smoke tests | Rai Sudarshan | Create auth and item endpoint tests | No |


### To Do next


| Item | Owner | Definition of Done | Priority |
|---|---|---|---|
| Cloudinary image upload integration | Sob Sagar | Post form uploads real images and stores URLs | High |
| Search and category filtering | Gayatri K. Bhandari | Homepage supports browsing by query and category | High |
| Dashboard for managing listings | Rai Aayuska | Seller can view and update own items | Medium |
| CI enforcement on PRs | Rai Sudarshan | Tests run automatically on pull requests | Medium |


### Scope cut / Nice Later


Items we are not doing before final unless the core flow is stable:
- In-app chat / messaging between buyer and seller
- Payment integration
- Recommendation engine
- Cross-campus expansion work


---


## 4) What We Shipped


List 3-8 shipped or improved items. Every item needs a link.


- ✅ Week 11 core backend flow remains working as the baseline for Sprint 4: [Week 11 packet](../Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md)
- ✅ Sprint 4 Week 12 packet created and aligned to the next milestone: [Sprint 4 packet](../SPRINT_4.md)
- ⏳ Listings browse UI work started against real API data: [add PR link]
- ⏳ OTP email sending integration in progress: [add PR link]
- ⏳ pytest smoke test setup in progress: [add PR link]


---


## 5) Bugs / Broken Things


| Bug / problem | Severity | Owner | Evidence / Issue link | Next step |
|---|---|---|---|---|
| OTP email delivery is not fully wired yet | P1 | Ananda Tamang | [Issue link] | Integrate email provider and verify delivery |
| Listings UI still needs live API wiring | P1 | Gayatri K. Bhandari | [Issue link] | Connect homepage grid to backend data |
| Automated tests are not yet enforced in CI | P2 | Rai Sudarshan | [workflow link] | Add pytest and CI checks |
| Cloudinary upload flow needs end-to-end verification | P2 | Sob Sagar | [Issue link] | Test upload, storage, and frontend preview |


**Severity guide:**
- P0: final demo cannot work
- P1: core feature broken or unreliable
- P2: important but workaround exists
- P3: polish or nice improvement


---


## 6) Risks / Blockers


| Risk / blocker | Owner | What we need | Evidence link | Mitigation |
|---|---|---|---|---|
| Email provider setup may take time | Ananda Tamang | SendGrid API key and verified sender setup | [Issue link] | Start immediately and keep manual verification fallback ready |
| Frontend listings UI may drift from backend response shape | Gayatri K. Bhandari | Stable GET /api/items response contract | [API link] | Build against the live API and test with real data |
| Tests may expose hidden auth/item bugs late in the sprint | Rai Sudarshan | Fast smoke tests and local CI runs | [workflow link] | Add small tests first, then expand coverage |


---


## 7) Engineering Practice Spine


**This week's main spine:**
- [x] Core flow verification


**Optional additional evidence:**
- [x] Security basics
- [x] Refactoring/cleanup


**What we did:**
- Kept the Week 11 auth and item backend as the working base for Sprint 4.
- Started filling the missing listings, email, and test infrastructure pieces.
- Began aligning the frontend to real API responses instead of mock data.


**Evidence link:**
- [add evidence links]


---


## 8) AI Use + Code Ownership Check


### AI tools used this week


- **GitHub Copilot:** Used for drafting sprint packet structure and implementation ideas
- **ChatGPT / Claude / Gemini / other:** Used for planning and formatting support
- **Other:** None


### What AI helped with


- Drafting the Week 12 sprint packet in the same style as the Week 11 packet
- Organizing the sprint goals into demo, board, risk, and evidence sections
- Summarizing the remaining implementation gaps for Sprint 4


### What humans reviewed or changed


- Reviewed the packet for correctness against the current sprint plan
- Confirmed the Week 11 sprint structure was preserved where useful
- Adjusted the Week 12 goals to match the current sprint direction


### Code ownership map


| Student | Area owned | Evidence link | Can explain? |
|---|---|---|---|
| Sob Sagar | Backend auth + item API | [PR link] | Clear |
| Rai Sudarshan | Backend Flask setup + CI/docs | [PR link] | Needs work |
| Ananda Tamang | MongoDB / database + email verification | [PR link] | Clear |
| Rai Aayuska | UI/UX design + frontend components | [PR link] | Needs work |
| Gayatri K. Bhandari | Frontend forms + API integration | [PR link] | Clear |


### Code we do not fully understand yet


- [Add any remaining unfamiliar code paths or modules]


---


## 9) Receipts / Links


- [Project board link]
- [Week 11 packet](../Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md)
- [Sprint 4 packet](../SPRINT_4.md)
- [Add PR links]
- [Add issue links]

