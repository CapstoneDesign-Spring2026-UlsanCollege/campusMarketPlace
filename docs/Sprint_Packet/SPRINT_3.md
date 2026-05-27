<!--
SPRINT 3 PACKET - MVP Verification Sprint

This sprint packet tracks Sprint 3 across Week 9 → Week 11.
Use this as the sprint-level summary (separate from weekly packets).

How to use:
1. PM updates this file at the end of each week
2. Add evidence links for every shipped item
3. Keep risks/ownership updated
4. Use this as source for final presentation prep
-->

# Sprint 3 Packet

## Team

**Team Name**  
CampusMarketplace

**Sprint Number**  
Sprint 3 (Week 9 → Week 11)

**Repository**  
[CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace)

**Live Demo**  
[CampusMarketplace Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

**PM for this Sprint**  
Tamang Ananda

---

# Sprint 3 Overview

## Sprint Goal

Stabilize and verify the MVP end-to-end flow with clear engineering ownership and evidence:
- Signup/login reliability with verification gate behavior
- Item posting and browsing backend readiness
- Frontend-backend integration quality
- Bug tracking, risk control, and delivery confidence

### Sprint Theme

MVP Verification + QA + Ownership Proof

---

# Weekly Breakdown

## Week 9: MVP Verification Kickoff

### Demo

**Status:** MVP stabilizing with backend validation hardening

[CampusMarketplace Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

### Demo Script

Step 1: Show login system behavior with valid and invalid credentials  
Step 2: Demonstrate backend authentication handling with Flask and MongoDB  
Step 3: Verify email verification gate blocking unverified accounts  
Step 4: Display item API structure and planned next feature direction

### Backup Plan

- Pre-recorded demo video of auth flows
- Screenshots of login success/failure states
- Localhost demo fallback (`python3 app.py`)
- Postman screenshots of API responses

---

## Week 10: QA Hardening + Integration Validation

### Demo

**Status:** End-to-end flow stabilizing with bug reduction

[CampusMarketplace Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

### Demo Script

Step 1: Run signup and login with various validation edge cases  
Step 2: Verify item API endpoints respond correctly with proper payloads  
Step 3: Confirm frontend and backend integration stability across flows  
Step 4: Show bug triage list with owners and mitigation status

### Backup Plan

- API response screenshots from Postman/curl
- Code walkthrough of critical routes in app.py
- Bug/issue list with PR evidence links
- Feature branch fallback with stable demo path

---

## Week 11: MVP Verification Complete + Code Ownership Proof

### Demo

**Status:** Core MVP flow fully implemented and verified

[CampusMarketplace Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

### Demo Script

Step 1: Sign up with campus email and show verification-required message  
Step 2: Attempt login before verification and confirm 403 blocked access  
Step 3: Log in as verified user and demonstrate dashboard access  
Step 4: Post a new item via composer and confirm it appears in item listings API

### Backup Plan

- API response screenshots for each endpoint
- Code walkthrough of signup, login, and item routes in app.py
- Merged PR list with evidence links (#55–#62)
- Recorded video walkthrough of full MVP flow

---

## Project Board Snapshot

**Board Link**  
[Team Project Board](https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15)

## Current Board State

### Week 9: To Do

- [x] Stabilize login flow and backend validation
- [x] Confirm frontend-backend auth connectivity
- [x] Define item feature implementation path

### Week 9: Doing

- [ ] [Integration testing](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pulls?q=is%3Apr+is%3Aopen)
- [ ] [Auth bug fixes](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects)

### Week 9: Done

- [x] Login flow improvements
- [x] MongoDB integration progress
- [x] Item structure planning
- [The link to Pull requests #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55)
- [The link to Pull requests #56](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/56)

---

### Week 10: To Do

- [ ] End-to-end test checklist
- [ ] Error handling polish
- [ ] CI test command integration

### Week 10: Doing

- [ ] [Auth and API QA](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects)
- [ ] [Route consistency validation](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pulls)

### Week 10: Done

- [x] Core API validation improvements
- [x] Integration bug triage
- [x] Sprint planning for Week 11 verification
- [The link to Pull requests #57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57)
- [The link to Pull requests #58](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/58)

---

### Week 11: To Do

- [ ] Automated tests for auth endpoints
- [ ] Email provider integration
- [ ] Frontend item browsing page completion

### Week 11: Doing

- [ ] [Full MVP flow verification](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects)
- [ ] [CI test setup preparation](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pulls)

### Week 11: Done

- [x] Email verification gate merged
- [x] Item schema validation and MongoDB indexes merged
- [x] Item listing endpoints merged
- [x] Composer form connected to backend
- [x] JWT/auth bug fixes merged
- [The link to Pull requests #59](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59)
- [The link to Pull requests #60](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/60)
- [The link to Pull requests #61](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/61)
- [The link to Pull requests #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62)

---

## Definition of Done

- Code review approved
- All tests passing (or documented plan for Week 12)
- Documentation updated
- Core MVP flow demonstrated with evidence
- No P0 issues blocking demo
- Team ownership documented

---

# Sprint Notes

## What Shipped (Target)

**Week 9:**
- [x] Login system stabilized with backend validation
- [x] Improved frontend-backend auth connectivity
- [x] Item feature structure and API design planned

**Week 10:**
- [x] Core API validation and consistency improved
- [x] Integration testing completed with bug identification  
- [x] Sprint planning and risk mitigation documented

**Week 11:**
- [x] Email verification gate enforced on login
- [x] Item schema validation with MongoDB indexes
- [x] Item listing endpoints (GET /api/items, GET /api/items/<id>)
- [x] Post item composer form fully integrated
- [x] Mock data replaced with real API calls
- [x] JWT/auth bugs fixed

---

## What Broke

**Week 9 Issues:**
- Session persistence gaps for some login states
- UI inconsistency between auth states
- [Related PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55)

**Week 10 Issues:**
- Incomplete automation for regression testing  
- Integration timing friction between frontend/backend tasks
- [Related PR #57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57)

**Week 11 Issues:**
- Verification email sending pipeline not fully integrated
- Frontend listings page incomplete in some render paths
- [Related PR #60](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/60)

---

## Next Sprint Plan

**Post-Sprint 3 (Week 12 QA Day):**
- [ ] Add automated pytest suite for signup/login/items
- [ ] Integrate email provider (SendGrid or similar) for verification emails
- [ ] Complete and polish item browsing UI
- [ ] Enforce CI checks on all incoming pull requests
- [ ] Run final end-to-end MVP verification and capture demo evidence

---

## Risks or Blockers

- **Risk:** Email verification emails not actually sent to users
  - **Mitigation:** Setup email provider API key early; use manual verification for demo accounts

- **Risk:** Limited automated test coverage — bugs caught by manual review only
  - **Mitigation:** Prioritize smoke tests for auth/items in Week 12; build full coverage after

- **Risk:** Frontend item listing page incomplete
  - **Mitigation:** Assign as first task for Week 12; unblock Gayatri by finalizing API contract

- **Risk:** Time pressure before final submission
  - **Mitigation:** Freeze non-MVP scope now; focus on core signup→login→post→browse reliability only

---

# Engineering Practice (Sprint 3)

## Core Flow Verification + Security Hardening

All code merged to `main` this sprint must:
- ✅ Demonstrate verified MVP flow behavior (signup → verified login → item post → item browse)
- ✅ Include evidence links (PRs, issues, demo screenshots)
- ✅ Show human review of AI-assisted changes
- ✅ Improve auth validation and security posture

**Key Disciplines:**
- Email verification gate enforced on login
- JWT/password validation hardened
- Item schema validated with MongoDB indexes
- Mock data replaced with real API integration

**Evidence:**

- [GitHub Actions Workflow](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/actions)
- [Merged Pull Requests](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pulls?q=is%3Apr+is%3Aclosed)
- [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)
- [Code Ownership Audit](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/docs/Sprint_Packet/Week_9/AI%20Code%20Ownership%20Audit.md)

---

# Team Ownership Map

| Member | Owned Area | What They Can Explain | Evidence | Confidence |
|---|---|---|---|---|
| Sob Sagar | Backend auth + item API (app.py routes) | Email verification gate, item endpoints, JWT flow | [PR #62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62), [PR #59](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59) | Clear |
| Rai Sudarshan | Backend Flask setup + CI/docs | Flask architecture, requirements.txt, GitHub Actions setup | [PR #29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) | Needs work on CI |
| Ananda Tamang | MongoDB/database layer | Database schema, user collection, item collection, indexing | [PR #29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) | Clear |
| Rai Aayuska | UI/UX design + frontend decisions | Bootstrap 5 setup, responsive design, component structure | [PR #26](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) | Needs work; defer to Gayatri for forms |
| Gayatri K. Bhandari | Frontend forms + API integration | Signup/Login UI, form validation, API integration, state management | [PR #55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55), [PR #57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57) | Clear |

### Areas Needing Clarification
| Area | Confusion | Owner | Plan to Understand |
|---|---|---|---|
| Email sending / OTP flow | How to integrate email provider and tie OTP to `isVerified` flag | Ananda Tamang | Research SendGrid or similar; implement `/api/auth/verify` endpoint |
| CI pipeline | How GitHub Actions currently deploys and what triggers it | Rai Sudarshan | Read `.github/workflows/main.yml`; add pytest automation |
| File uploads | Where uploaded files are stored and how to serve them | Sob Sagar | Evaluate S3 vs Cloudinary vs local uploads for MVP |

---

# AI Use & Code Review Summary

### AI Tools Used This Sprint
- **GitHub Copilot** — Code suggestions in app.py and frontend components
- **ChatGPT / Claude** — PR descriptions, sprint packet drafting, architecture review

### What AI Helped With
- Boilerplate for item schema validation and MongoDB index setup
- PR description writing and documentation review
- Sprint packet structure and wording

### What Humans Reviewed or Changed
- Tested all API endpoints manually via curl/Postman
- Reviewed and adjusted item schema fields to match actual use cases
- Verified JWT behavior manually (signup returns no token, unverified login returns 403, verified login returns token)
- Debugged and fixed malformed JWT subject issue independently
- Tested form submission lifecycle and fixed signup state management

---

# Plan for Next Week (Week 12 QA Day)

### Top 3 Priorities
1. **Add automated tests** for signup, login, and item creation (pytest + CI)
2. **Complete email sending integration** (SendGrid or similar provider)
3. **Build and verify item browsing UI** (frontend component connected to real API)

### First Tasks When Class Starts
- Gayatri K. Bhandari — Start the item listings UI component
- Sob Sagar — Write pytest tests for auth and item endpoints
- Ananda Tamang — Research and begin email provider integration

### QA Verification Checklist
- [ ] Sign up with valid campus email → show verification message
- [ ] Attempt login before verification → confirm 403 response
- [ ] Login as verified user → confirm JWT issued and dashboard loads
- [ ] Post a new item via composer → confirm item appears in GET /api/items
- [ ] Open item detail page → confirm data loads correctly
- [ ] Run pytest suite → all auth and item tests pass

---

# Definition of Done (Sprint 3 Closure)

- [x] All major PRs merged to main
- [x] Code review approval documented
- [x] MVP core flow is demonstrable
- [x] Team ownership map is complete and honest
- [x] Risk/blocker list is up-to-date
- [x] AI-assisted code is human-reviewed
- [ ] Automated tests added (target: Week 12)
- [ ] Email integration completed (target: Week 12)

---

# Individual Contribution Receipts

**Each team member must add a comment below with 2–3 links minimum.**

### Receipt Template

```
# Contribution Receipts - Sprint 3 (Week 9-11)

---

## Contribution Receipts - Sob Sagar

### Week 9
- PR: [#55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55) — Backend auth flow stabilization and validation hardening
- Issue: [Login validation improvements](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects) — Verified JWT behavior and fixed malformed JWT subject issue
- Review: Peer review of login state management integration — Approved auth connectivity fixes

### Week 10
- PR: [#57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57) — Core API validation and consistency improvements
- Documentation: [Sprint 3 Board State](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/docs/Sprint_Packet/SPRINT_3.md#current-board-state) — Documented integration testing findings

### Week 11
- PR: [#59](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59) — Item listing endpoints (GET /api/items, GET /api/items/<id>)
- PR: [#62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62) — Email verification gate enforced on login + JWT bug fixes
- Testing: Tested all API endpoints via curl/Postman — Verified item schema validation and MongoDB indexes working correctly

### Ownership Summary
I own the **backend auth + item API (app.py routes)** and can explain:
- How the email verification gate blocks unverified users with 403 response
- Why we enforce JWT validation before item operations
- How to test item endpoints with valid/invalid payloads via Postman

### AI Use This Sprint
- AI tool: GitHub Copilot
- Helped with: Boilerplate code for item schema validation and MongoDB index setup
- I personally: Tested and debugged all API behaviors manually; fixed JWT subject issue independently
- One thing I still do not fully understand: Email provider integration flow and OTP tying to `isVerified` flag

---

## Contribution Receipts - Rai Sudarshan

### Week 9
- PR: [#29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) — Flask backend architecture and requirements.txt setup
- Issue: [CI/GitHub Actions configuration](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects) — Initialized deployment pipeline
- Documentation: [Backend README](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/README.md) — Documented project structure

### Week 10
- PR: [#29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) (ongoing) — CI/CD pipeline configuration continued
- Documentation: [GitHub Actions Workflow](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/actions) — Verified GitHub Pages auto-deploy setup

### Week 11
- PR: [#29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) — Final CI setup for automated testing preparation
- Documentation: [requirements.txt updated](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/requirements.txt) — Added dependencies for Week 12 pytest

### Ownership Summary
I own the **Flask backend setup + CI/GitHub Actions pipeline** and can explain:
- How Flask application entry point (app.py) is configured
- Why GitHub Actions triggers on pull requests and how it deploys to GitHub Pages
- How to add new Python dependencies and ensure they're installed

### AI Use This Sprint
- AI tool: ChatGPT
- Helped with: GitHub Actions workflow YAML syntax and Python dependency management best practices
- I personally: Reviewed and adjusted workflow to match project needs; tested deployment manually
- One thing I still do not fully understand: How to integrate pytest into CI pipeline and enforce test passing before merge

---

## Contribution Receipts - Ananda Tamang

### Week 9
- PR: [#29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) — MongoDB database schema design and collection initialization
- Issue: [Database structure for User collection](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects) — Defined user fields (email, password, isVerified, firstName, lastName)
- Review: Peer review of schema — Approved structure for item collection with seller info

### Week 10
- PR: [#29](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) (ongoing) — Item collection schema refinement
- Documentation: [MongoDB indexing strategy](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/docs/Sprint_Packet/SPRINT_3.md) — Documented why indexes improve query performance

### Week 11
- PR: [#60](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/60) — Item schema validation with MongoDB indexes merged
- Testing: Verified MongoDB index creation on startup — Confirmed queries execute within acceptable latency
- Documentation: [Schema fields finalized](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/models/item.py) — Documented all item fields and validation rules

### Ownership Summary
I own the **MongoDB database layer and schema design** and can explain:
- How user schema validates email format and stores password hashed
- Why item schema includes seller info and supports multiple images
- How MongoDB indexes are created and why they matter for query performance

### AI Use This Sprint
- AI tool: GitHub Copilot + ChatGPT
- Helped with: PyMongo syntax for schema validation and index creation
- I personally: Reviewed schema fields to match product requirements; tested index performance; decided on field naming conventions
- One thing I still do not fully understand: How to design and integrate email verification token storage alongside `isVerified` flag


### Scribe/PM Responsibilities
I maintained documentation of:
- All weekly demos and demo scripts (backup plans included)
- PR evidence links for shipped work (PRs #55-#62)
- Team ownership clarity and honest assessment of confusion areas
- Risk tracking with mitigation strategies
- Definition of Done and engineering practices
- Individual contribution tracking (this receipt document)
- Week 12 planning and transition handoff

### Ownership Summary
As **PM & Scribe**, I own:
- **Sprint documentation and evidence trail** — Every shipped item has a PR link; every risk has a mitigation; every team member has ownership mapped
- **Week 9-11 narrative** — Demo scripts, weekly summaries, what shipped/broke/risks
- **Team coordination** — Defined roles, ownership, and planning for post-sprint work

### AI Use This Sprint
- AI tool: ChatGPT + Claude
- Helped with: Sprint packet structure, risk categorization, documentation drafting, and receipt template
- I personally: Reviewed all AI suggestions for accuracy; verified every PR link works; interviews team for ownership clarity; edited and finalized all documentation
- One thing I still do not fully understand: Email OTP implementation flow and how to design email verification tokens for future sprints

**PM Impact:**  
Sprint 3 documentation complete and consolidated. All team contributions tracked with evidence. Ready for Week 12 QA handoff and final evaluation.

---

## Contribution Receipts - Rai Aayuska

### Week 9
- PR: [#26](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) — Bootstrap 5 frontend framework and responsive design foundation
- Issue: [Navbar component responsive layout](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects) — Implemented mobile-first design
- Review: Peer review of component styling — Approved consistent spacing and color scheme

### Week 10
- PR: [#26](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) (ongoing) — Component library expansion with form styles
- Documentation: [UI/UX design guidelines](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/docs/WIREFRAME.md) — Updated wireframes to reflect implemented designs

### Week 11
- PR: [#26](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) — Final responsive design polish for MVP
- Testing: Cross-browser testing on mobile and desktop — Verified responsive breakpoints working correctly
- Documentation: [Component library documented](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/Frontend/src/components/) — Added component usage examples

### Ownership Summary
I own the **UI/UX design and responsive frontend foundation** and can explain:
- How Bootstrap 5 grid system enables mobile-first design
- Why we chose specific breakpoints for tablet/mobile views
- How to add new styled components following the established patterns

### AI Use This Sprint
- AI tool: GitHub Copilot
- Helped with: Bootstrap utility classes and CSS media query suggestions
- I personally: Reviewed all AI suggestions for design consistency; tested on real devices; adjusted spacing/colors for accessibility
- One thing I still do not fully understand: How forms validate and connect to backend API (defer to Gayatri for implementation details)

---

## Contribution Receipts - Gayatri K. Bhandari

### Week 9
- PR: [#55](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55) — Signup/Login form UI components and initial API integration
- Issue: [Form validation and error states](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects) — Implemented campus email format validation on frontend
- Review: Peer review of login state management — Approved handling of verified/unverified user states

### Week 10
- PR: [#57](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57) — Form validation improvements and API response error handling
- Documentation: [Form component API contract](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/Frontend/src/routes/Login.jsx) — Documented expected API responses
- Testing: End-to-end signup/login flow on localhost — Verified form submission lifecycle and state transitions

### Week 11
- PR: [#61](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/61) — Post item composer form fully integrated with backend API
- PR: [#62](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62) — Mock data replaced with real API calls
- Testing: Verified form submissions create items in MongoDB — Confirmed item appears in GET /api/items response

### Ownership Summary
I own the **frontend forms + API integration and state management** and can explain:
- How signup/login forms validate input and handle backend responses
- Why we store JWT token in localStorage and include it in item posting requests
- How to test form submissions end-to-end from UI to database

### AI Use This Sprint
- AI tool: GitHub Copilot + ChatGPT
- Helped with: React form state management patterns and API fetch error handling
- I personally: Tested all form flows manually; debugged signup state persistence issues; verified API payload correctness
- One thing I still do not fully understand: How to build and optimize the item listings page component for browsing many items
---

**All receipts submitted:** May 21, 2026  
**Ready for instructor review:** 

---

# Instructor Notes

**Comments:**  
[Instructor feedback here]

**Suggestions:**  
[Recommendations for improvement]

---

**Last Updated:** Week 11 End  
**Next Review:** Week 12 Stabilization
