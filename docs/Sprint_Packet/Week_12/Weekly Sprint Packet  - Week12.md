# Week 12 Weekly Sprint Packet - Stabilize & Demo Readiness

One submission per team. PM submits this Issue by Friday at 23:59.

**Evidence rule:** If it is not linked, it did not happen.

---

## 0) Team + Sprint Info

- **Team:** CampusMarketplace
- **Week:** 12
- **Sprint:** Sprint 4
- **Phase:** Stabilize + Demo Readiness
- **PM:** Rai Sudarshan
- **QA Lead:** Tamang Ananda
- **Demo Driver:** Gayatri K. Bhandari
- **AI Steward:** Rai Aayuska

---

## 1) Verified MVP Core Flow

Main user must be able to:
1. Register with a campus email (@office.uc.ac.kr)
2. Verify email and then log in (verified accounts only)
3. Post listings with images, price, category and browse listings

**Core Flow Verification Issue**
- Open issues: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues

**Verification Result**
- [ ] Partly verified — pending email integration and final UI polish

**Notes:** Signup, JWT auth, and item APIs are implemented. This week focuses on making verification functional, adding smoke tests, and finishing the listings UI for the demo.

---

## 2) Weekly Progress Demo

- **Demo type:** Local live demo (Vite dev) + fallback curl/Postman evidence
- **Demo link or evidence:** GitHub Pages and repo PR links

**What changed since last week?**
1. Vite proxy and CORS fixes added for local dev.
2. `docker-compose.yml` added to support local MongoDB for developers.
3. Frontend wiring for API calls and basic `ItemGrid` exists.

**3-bullet demo script**
1. Start backend (`python app.py`) and frontend (`npm run dev`) and open http://localhost:5173
2. Create a signup; for demo accounts flip `isVerified` in DB if email sending is not set up
3. Post an item via composer and show it on the listings page

**Backup plan**
- Show screenshots / curl responses for signup/login/items and a code walkthrough of `app.py` and `Frontend/src/services/api.js`.

---

## 3) Board Snapshot

- **Board link:** https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15

### Done this week

| Item | Owner | Done? | Evidence |
|---|---:|---:|---|
| Vite dev proxy & CORS | Rai Aayuska | Yes | `Frontend/vite.config.js`, `.env` |
| Local DB compose | Rai Sudarshan | Yes | `docker-compose.yml` |
| Frontend API wiring | Gayatri K. Bhandari | Partial | `Frontend/src/services/api.js` |

### Doing now

| Item | Owner | Next action | Blocked? |
|---|---|---|---|
| Email verification | Ananda Tamang | Add provider + `/api/auth/verify` | Needs API key |
| Pytest smoke tests + CI | Rai Sudarshan | Write tests and enable in workflow | No |
| Listings UI finish | Gayatri K. Bhandari | Display real items with pagination | No |

### To Do next

| Item | Owner | Definition of Done | Priority |
|---|---|---:|---|
| Email provider integration | Ananda Tamang | Verified email sends and `/api/auth/verify` flips `isVerified` | High |
| Add smoke tests | Sob Sagar | `pytest` tests for signup/login/items | High |
| CI enforcement | Rai Sudarshan | Run tests on PRs | Medium |

---

## 4) What We Shipped

- Vite proxy + CORS tweaks
- `docker-compose.yml` for local MongoDB
- Frontend API wiring and ItemGrid component

---

## 5) Bugs / Broken Things

| Bug | Severity | Owner | Evidence | Next step |
|---|---|---|---|---|
| Email sending not implemented | P1 | Ananda Tamang | Issue tracker | Integrate provider or manual verify for demo |
| No automated tests | P2 | Rai Sudarshan | `.github/workflows/main.yml` | Add pytest tests and enable CI |
| Listings UI incomplete | P2 | Gayatri K. Bhandari | Frontend components | Finish rendering real items |

---

## 6) Risks / Blockers

| Risk | Owner | Need | Mitigation |
|---|---|---|---|
| Email sending not implemented | Ananda Tamang | Provider API key | Manually flip `isVerified` for demo accounts |
| Docker not available to devs | Rai Sudarshan | Install Docker Desktop | Use Atlas for quick demos |

---

## 7) Engineering Practice Spine

- Core stability and reproducible local demo

---

## 8) AI Use + Code Ownership Check

- Record AI-assisted work in PRs and be ready to explain changes.

---

## 9) Plan for Week 13 Demo Day

Top priorities:
1. Implement email verification end-to-end
2. Add pytest smoke tests and enable CI
3. Finalize listings UI and pagination

---

## 10) Individual Contribution Receipts

Paste receipts here as in Week 11 template.

---

## 11) Instructor Notes


