# Week 11 Weekly Sprint Packet - MVP Verification


One submission per team. PM or Scribe submits this Issue by Friday at 23:59.


**Evidence rule:** If it is not linked, it did not happen.


**AI rule:** AI-assisted work only counts if your team can run it, explain it, test it, debug it, and link evidence.


---


## 0) Team + Sprint Info


- **Team:** CampusMarketplace
- **Week:** 11
- **Sprint:** Sprint 3
- **Phase:** MVP Verification + Code Ownership
- **PM:** Sob Sagar
- **Scribe:** Rai Sudarshan
- **QA Lead:** Tamang Ananda
- **Demo Driver:** Gayatri K. Bhandari
- **AI Steward:** Rai Aayuska


---


## 1) Verified MVP Core Flow


Our main user can:
1. Register with a campus email (@office.uc.ac.kr) 
2. Log in only after email verification (403 returned for unverified accounts)
3. Browse and post marketplace items with images, price, and category


**Core Flow Verification Issue**
- Issue link: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues?q=is%3Aissue%20state%3Aclosed


**Verification Result**
- [x] Partly verified


**Brief explanation:**
Signup, login with JWT auth, item listing API, and item composer form are all implemented and functional. The email verification gate (PR #62) is merged and blocks unverified users from logging in. Full end-to-end verification from signup → verified login → post item → browse items has been tested locally. CI is not yet enforcing automated test runs.


---


## 2) Weekly Progress Demo


- **Demo type:** code walkthrough + screenshots
- **Demo link or evidence:** https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/


**What changed since last week?**
1. Email verification gate enforced — login now returns 403 for unverified accounts (PR #62)
2. Item listing API endpoints fully implemented with schema validation and MongoDB indexes (PRs #58, #59, #61)
3. Post item composer form built and connected to real backend endpoints (PRs #60, #55)


**3-bullet demo script**
1. Sign up with a campus email → confirm "please verify your email" message and no token issued
2. Attempt login before verification → confirm 403 response; log in as verified user → confirm JWT issued and dashboard loads
3. Post a new item via the composer form → confirm item appears in the listings API response


**Backup plan**
If the demo fails, we will show:
- Screenshots of API responses from Postman/curl for each endpoint
- Code walkthrough of `app.py` signup, login, and item routes
- Git log showing merged PRs as evidence of shipped work


---


## 3) Board Snapshot


- **Board link or screenshot:** https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15


### Done this week


| Item | Owner | Definition of Done met? | Evidence link |
|---|---|---|---|
| Email verification gate on login | Sob Sagar | Yes | [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62) |
| Item schema validation + MongoDB indexes | Sob Sagar | Yes | [PR #61](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/61) |
| Post item composer form (UI) | Gayatri K. Bhandari | Yes | [PR #60](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/60) |
| Item listing API endpoints | Sob Sagar | Yes | [PR #59](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59) |
| GET /api/items/<id> endpoint | Sob Sagar | Yes | [PR #58](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/58) |
| Fix signup form submission lifecycle | Gayatri K. Bhandari | Yes | [PR #57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57) |
| Fix malformed JWT subject handling | Sob Sagar | Yes | [PR #56](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/56) |
| Replace mock data with real API endpoints | Gayatri K. Bhandari | Yes | [PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55) |


### Doing now


| Item | Owner | Next action | Blocked? |
|---|---|---|---|
| End-to-end MVP flow test | QA Lead (Sob Sagar) | Run full signup → login → post → browse test | No |
| CI automated test setup | Rai Sudarshan | Add test script to GitHub Actions workflow | No |
| Email verification email sending | Ananda Tamang | Integrate email provider (e.g. SendGrid) to actually send OTP | No |


### To Do next


| Item | Owner | Definition of Done | Priority |
|---|---|---|---|
| Automated tests for auth endpoints | Sob Sagar | pytest passes for signup/login/items | High |
| Email sending integration | Ananda Tamang | Verified user receives verification email | High |
| Item browsing UI (listings page) | Gayatri K. Bhandari | Frontend displays real items from API | High |
| CI enforcement on PRs | Rai Sudarshan | GitHub Actions runs tests on every PR | Medium |


### Scope cut / Nice Later


Items we are not doing before final unless the core flow is stable:
- In-app chat / messaging between buyer and seller
- Payment integration
- Rating and review system
- Search and filter UI


---


## 4) What We Shipped


List 3-8 shipped or improved items. Every item needs a link.


- ✅ Email verification gate — login blocked with 403 for unverified accounts: [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62)
- ✅ Item listing API with full schema validation and MongoDB indexes: [PR #61](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/61)
- ✅ Post item composer form connected to backend: [PR #60](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/60)
- ✅ GET /api/items and GET /api/items/<id> endpoints: [PR #58](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/58), [PR #59](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59)
- ✅ Replaced mock data with real API calls in frontend: [PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55)
- ✅ Fixed malformed JWT subject and signup submission bugs: [PR #56](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/56), [PR #57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57)


---


## 5) Bugs / Broken Things


| Bug / problem | Severity | Owner | Evidence / Issue link | Next step |
|---|---|---|---|---|
| Email verification emails not actually sent (gate exists but no OTP email) | P1 | Ananda Tamang | [Issue #38](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/38) | Integrate email provider |
| No automated tests — manual testing only | P2 | Rai Sudarshan | [workflows/main.yml](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/.github/workflows/main.yml) | Add pytest to CI |
| Item listing page not yet built in frontend | P2 | Gayatri K. Bhandari | [PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55) | Build listings UI connected to API |
| File upload stores URL strings only — no actual file storage | P3 | Sob Sagar | [PR #52](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52) | Integrate cloud storage (e.g. S3 or Cloudinary) |


**Severity guide:**
- P0: final demo cannot work
- P1: core feature broken or unreliable
- P2: important but workaround exists
- P3: polish or nice improvement


---


## 6) Risks / Blockers


| Risk / blocker | Owner | What we need | Evidence link | Mitigation |
|---|---|---|---|---|
| Email sending not implemented — verification gate exists but users can't actually verify | Ananda Tamang | Email provider API key and integration | [Issue #38](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/38) | Manually set `isVerified: true` in MongoDB for demo accounts until email is integrated |
| No automated tests — bugs caught only by manual review | Rai Sudarshan | pytest suite + CI integration | [workflows/main.yml](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/.github/workflows/main.yml) | Add basic smoke tests before Week 12 QA Day |
| Frontend listings page missing — API works but no UI to browse items | Gayatri K. Bhandari | React listings component connected to GET /api/items | [PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55) | Prioritize listings UI as first task Week 12 |


---


## 7) Engineering Practice Spine


**This week's main spine:**
- [x] Core flow verification


**Optional additional evidence:**
- [x] Security basics
- [x] Refactoring/cleanup


**What we did:**
- Enforced email verification gate on login (security): [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62)
- Enforced strong JWT_SECRET in production, reject weak secrets: [PR #54](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/54)
- Added server-side password validation (reject weak passwords): [PR #48](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/48)
- Fixed Authorization header missing on API requests: [PR #51](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/51)


**Evidence link:**
- [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62), [PR #54](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/54), [PR #51](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/51)


---


## 8) AI Use + Code Ownership Check


### AI tools used this week


- **GitHub Copilot:** Used for code suggestions in app.py and frontend components
- **ChatGPT / Claude / Gemini / other:** Claude used for reviewing PR #62 summary and sprint packet drafting
- **Other:** None


### What AI helped with


- Initial boilerplate for item schema validation and MongoDB index setup
- Reviewing and drafting PR descriptions
- Sprint packet structure and wording


### What humans reviewed or changed


- Tested all API endpoints manually via curl/Postman
- Reviewed and adjusted item schema fields to match actual use cases
- Verified JWT behavior manually (signup no token, unverified login 403, verified login success)
- Debugged and fixed malformed JWT subject issue independently


### Code ownership map


| Student | Area owned | Evidence link | Can explain? |
|---|---|---|---|
| Sob Sagar | Backend auth + item API (`app.py`) | [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62), [PR #59](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59) | Clear |
| Rai Sudarshan | Backend Flask setup + CI/docs | [PR #29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) | Needs work |
| Ananda Tamang | MongoDB / database layer | [PR #29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) | Clear |
| Rai Aayuska | UI/UX design + frontend components | [PR #26](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) | Needs work |
| Gayatri K. Bhandari | Frontend forms + API integration | [PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55), [PR #57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57) | Clear |


### Code we do not fully understand yet


| Area | What is confusing? | Owner | Plan to understand/fix |
|---|---|---|---|
| Email sending / OTP flow | How to integrate an email provider and tie OTP to `isVerified` flag | Ananda Tamang | Research SendGrid or similar; add `/api/auth/verify` endpoint |
| CI pipeline | How GitHub Actions currently deploys and what triggers it | Rai Sudarshan | Read `workflows/main.yml`, add pytest step |


---


## 9) Plan for Week 12 QA Day


**Top 3 QA/stabilization goals:**
1. Build frontend item listings page connected to real GET /api/items endpoint
2. Add pytest smoke tests for signup, login, and item create endpoints
3. Manually verify full MVP flow: signup → set isVerified → login → post item → browse item


**First task next class**
When class starts, we will immediately:
- Gayatri K. Bhandari starts the listings UI component
- Sob Sagar writes pytest tests for auth and item endpoints
- Ananda Tamang researches email provider integration for OTP


---


## 10) Individual Contribution Receipts


Each student must comment below with 2-3 links minimum.


Copy/paste this in your comment:


```
## Contribution Receipts - Name

- Receipt 1:
- Receipt 2:
- Receipt 3:

### 1-sentence contribution summary


### AI Use Note

- AI tool used:
- What AI helped with:
- What I personally checked or changed:
- How I tested or verified it:
- One thing I still do not fully understand:
```


---


## 11) Instructor Notes


Leave blank.
