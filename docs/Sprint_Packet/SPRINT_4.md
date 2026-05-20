<!--
SPRINT 4 PACKET

This template tracks the three weeks of Sprint 4 (Week 12 → Week 14).
Create at least one issue per week and link them together as a sprint sequence.

How to use:
1. The PM creates this Issue for each week
2. The team fills in all sections
3. Each student adds a comment with their receipts
4. Link everything to GitHub evidence
-->

# Sprint 4 Packet

## Team

**Team Name**

[campusMarketPlace]

**Sprint Number**

[Sprint 4: Week 12 → Week 14]

**Repository**

[CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace)

**Live Demo**

[CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

**PM for this Sprint**

[Rai Sudarshan]

---

# Sprint 4 Overview

## Sprint Goal

Complete the full marketplace loop and prepare for final submission including:
- Functional listings browse UI connected to live backend
- OTP email verification fully working (SendGrid)
- Automated pytest smoke tests covering core flows
- Search and category filtering on the homepage
- User dashboard to manage and mark listings as sold
- Polished final demo and documentation

---

# Weekly Breakdown

## Week 12: Close the Gaps — Listings UI + Email + Tests

### Demo

**Status:** Backend verified — closing frontend and infrastructure gaps from Sprint 3

[https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

### Demo Script

Step 1: Register with campus email (@office.uc.ac.kr) — receive real OTP email  
Step 2: Verify OTP and log in with JWT  
Step 3: Browse homepage grid of real listings fetched from API  
Step 4: Post a new listing using the composer form (image + details)

### Backup Plan

- Manually pre-verified test accounts to bypass email sending if SendGrid setup delays
- Static mock data grid as fallback for listings UI demo
- Screenshots of working API responses as evidence

---

## Week 13: Feature Completion — Search, Dashboard, Image Upload

### Demo

**Status:** [To be updated]

[link to staging or updated live demo]

### Demo Script

Step 1: Login and land on homepage with real listings grid  
Step 2: Use search bar and category filter to find an item  
Step 3: Open user dashboard — view own listings, mark one as sold  
Step 4: Upload an item with an image — confirm Cloudinary URL stored in MongoDB

### Backup Plan

- Pre-loaded demo account with sample listings for search demo
- Screenshot evidence of dashboard and sold status in database
- Fallback to image URL text input if Cloudinary upload has issues

---

## Week 14: Final Demo Polish + Submission

### Demo

**Status:** [To be updated]

[link to live demo or recorded presentation]

### Demo Script

Step 1: Full user journey — register, verify email, post item with image  
Step 2: Another user browses, searches, and finds the item  
Step 3: Dashboard shows seller's listing management and sold status  
Step 4: Technical architecture walkthrough + roadmap for post-capstone features

### Backup Plan

- Recorded 3–5 minute walkthrough with voiceover
- Slide deck with embedded screenshots of each core flow
- GitHub evidence links for every completed issue/PR

---

# Project Board Snapshot

Link to your **GitHub Project board**.

[Project board link](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects)

## Current Board State

### Week 12: To Do

- [ ] Build listings browse UI (homepage grid connected to GET /api/items)
- [ ] Integrate SendGrid for OTP email sending
- [ ] Write pytest smoke tests (auth + item endpoints)
- [ ] Cloudinary image upload wired to post form

### Week 12: Doing

- [ ] [Issue link]
- [ ] [Issue link]

### Week 12: Done

- [ ] [Issue link]
- [ ] [Issue link]

---

## Definition of Done

- Code review approved by at least one team member
- All pytest smoke tests passing
- Feature manually verified end-to-end on staging
- No broken existing flows (auth, post item) after merge
- Documentation updated where non-obvious

---

### Week 13: To Do

- [ ] Search bar and category filter on homepage
- [ ] User dashboard — list own items, mark as sold
- [ ] PATCH /api/items/<id> endpoint (mark sold)
- [ ] Full end-to-end integration test (register → post → browse → sold)

### Week 13: Doing

- [ ] [Issue link]
- [ ] [Issue link]

### Week 13: Done

- [ ] [Issue link]
- [ ] [Issue link]

---

### Week 14: To Do

- [ ] Final UI polish (spacing, mobile responsiveness, empty states)
- [ ] Production deployment verification on Render
- [ ] Final documentation pass (README, API docs)
- [ ] Record demo video walkthrough as backup

### Week 14: Doing

- [ ] [Issue link]
- [ ] [Issue link]

### Week 14: Done

- [ ] [Issue link]
- [ ] [Issue link]

---

# Sprint Notes

## What Shipped (Target)

**Week 12:**
- [ ] Listings browse UI live on homepage (real API data)
- [ ] OTP email sending via SendGrid functional
- [ ] pytest smoke test suite (auth + items)
- [ ] Image upload (Cloudinary) integrated with post form

**Week 13:**
- [ ] Search and category filter on homepage
- [ ] User dashboard with mark-as-sold functionality
- [ ] PATCH /api/items/<id> endpoint
- [ ] End-to-end integration tested

**Week 14:**
- [ ] Polished, mobile-responsive UI
- [ ] Final production deployment on Render confirmed
- [ ] README and API documentation updated
- [ ] Demo video recorded as final submission backup

---

## What Broke

**Week 12 Issues:**
- [Problem 1]
- [Problem 2]

**Week 13 Issues:**
- [Problem 1]
- [Problem 2]

**Week 14 Issues:**
- [Problem 1]
- [Problem 2]

---

## Next Sprint Plan

**Post-Sprint 4 (Post-Capstone):**
- [ ] Messaging system between buyer and seller
- [ ] Payment integration
- [ ] Mobile app (React Native)
- [ ] Recommendation engine
- [ ] Expand to other campus institutions

---

## Risks or Blockers

- **Risk:** SendGrid account setup / domain verification takes time  
  - **Mitigation:** Start Week 12 Day 1; use manual account verification as fallback for demos

- **Risk:** Cloudinary API integration unfamiliar to team  
  - **Mitigation:** Sagar spikes a minimal working upload in Week 12; team builds on top

- **Risk:** Search feature scope creep (full-text vs. simple filter)  
  - **Mitigation:** Start with simple `?category=` and `?q=` query params; no Elasticsearch

- **Risk:** Final demo environment instability on Render  
  - **Mitigation:** Keep GitHub Pages as stable fallback; test Render deploy daily in Week 14

---

# Engineering Practice (Sprint 4)

## Testing & CI/CD

All code merged to `main` must:
- ✅ Pass pytest smoke tests (auth + items)
- ✅ Pass linting and code quality checks
- ✅ Include test coverage for any new endpoint or component
- ✅ Deploy successfully to staging before merge
- ✅ Not break existing verified flows (login, post item)

**Evidence:**

- [CI workflow runs](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/actions)
- [pytest test results]
- [Successful staging deployments](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

---

# Individual Contribution Receipts

**Each team member must add a comment on this Issue with their receipts.**

### Minimum Requirements:

- 2–3 pull requests or significant contributions per week
- Code reviews on at least one team PR per week
- Issue completions linked to evidence
- Documentation or presentation contributions

### Ownership Map for Sprint 4

| Area | Owner |
|---|---|
| Listings browse UI + search/filter | Rai Aayuska |
| Dashboard UI + mark-as-sold form | Gayatri K. Bhandari |
| PATCH /api/items endpoint + pytest | Sob Sagar |
| SendGrid email integration + Flask routing | Rai Sudarshan |
| Cloudinary image upload + MongoDB schema | Ananda Tamang |

### Example Receipt Comment:

> **@username — Week 12 Receipt**
> - PR #XX: [brief description]
> - PR #XX: [brief description]
> - Reviewed PR #XX (approved / requested changes)
> - Closed Issue #XX
> - [Any doc/presentation work]