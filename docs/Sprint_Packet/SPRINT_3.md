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
## Contribution Receipts - [Name]

### Week 9
- PR: [PR link] — [Brief description of work]
- Issue: [Issue link] — [What was fixed/implemented]
- Review: [PR review link] — [Feedback provided]

### Week 10
- PR: [PR link] — [Feature/fix added]
- Documentation: [Link to doc update] — [What was documented]

### Week 11
- PR: [PR link] — [Final feature or bug fix]
- Testing: [Evidence of testing] — [What was verified]

### Ownership Summary
I own the [area: e.g., "item API endpoints" / "auth forms" / "database schema"] and can explain:
- How [component] works
- Why [design decision] was made
- How to test [feature]

### AI Use This Sprint
- AI tool: [Copilot/ChatGPT/Other]
- Helped with: [specific task]
- I personally: [verified/changed/tested this]
- One thing I still do not fully understand: [learning gap]
```

---

# Instructor Notes

**Comments:**  
[Instructor feedback here]

**Suggestions:**  
[Recommendations for improvement]

---

**Last Updated:** Week 11 End  
**Next Review:** Week 12 Stabilization
