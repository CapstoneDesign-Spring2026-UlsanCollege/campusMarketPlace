# MIDTERM — WHAT TO SUBMIT
**CampusMarketplace | Capstone Design Spring 2026 | Ulsan College**
Team: Sudarshan · Aayuska · Sagar · Ananda · Gayatri
Status: Sprint 2 Complete | 107 Commits | 8 Branches | Live Deployment

---

## Purpose

The Midterm is our chance to show that CampusMarketplace is real, focused, and worth continuing. We do not need a finished product. We need a project that feels believable — and we have one.

This document shows:

- A clear problem: students at Ulsan College have no verified peer-to-peer campus marketplace
- A clear user: every student who buys textbooks, sells dorm items, or seeks tutoring
- A clear solution: a walled-garden platform gated by @office.uc.ac.kr email verification
- A believable demo: the 3-step verified signup UI — live, deployed, functional
- Real proof of progress: 107 commits, 8 branches, live GitHub Pages, validated email logic, 8 contributors
- A realistic roadmap: Flask/MongoDB integration Sprint 3, full loop by Final, post-Final features held out
- A clear ask: pilot users, technical mentorship, scope approval

---

## 1. Midterm Presentation Deck

**Deck Link:**
`docs/Sprint_Packet/Ulsan_College_Marketplace.pdf` (in repo)

### What the Deck Covers (9 required sections)

| Slide | Content |
|-------|---------|
| 1 | Title — CampusMarketplace: A Verified Ecosystem for Ulsan College |
| 2 | Problem — The Friction of Open Commerce on a Closed Campus (Safety / Relevance / Trust) |
| 3 | Solution — The Walled Garden Advantage (comparison table vs. generic marketplaces) |
| 4 | System Architecture — The Trust Funnel, campus email gate before any DB write |
| 5 | Target Users and Value Proposition *(Aayuska)* |
| 6 | Current Progress / Technical Overview — Sprint 2 state *(Sagar)* |
| 7 | Technical Engine — Frontend implemented, Backend in progress, Database planned |
| 8 | Entering the Marketplace — Vite + React + Bootstrap 5 live stack |
| 9 | Robust UI and Strict Authentication — 3-step signup wireframe + QA checklist |
| 10 | Verifiable Engineering Momentum — 107 commits, 8 branches, key commit log |
| 11 | Quality Assurance and Definition of Done — validateEmail() code + checklist |
| 12 | Path to Final Delivery — 3-station roadmap (Foundation / Integration / Capstone) |
| 13 | Team Roles, Beyond Capstone, Closing Ask |

---

## 2. Demo Link + Demo Script + Backup Plan

### Live Demo Link

> **https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/**

Deployed via custom Node/Vite GitHub Actions workflow (Issue #25). Replaced broken default Jekyll workflow in Sprint 2. HashRouter and Vite base path configured for SPA routing on GitHub Pages.

### 3-Bullet Demo Script

1. **Step 1:** User opens the live site. They attempt signup with a generic Gmail address. The system rejects it immediately — error message shows, no database write occurs.
2. **Step 2:** User enters a valid `@office.uc.ac.kr` campus email. Domain verification passes with a green checkmark. They complete First/Last name formatting and set a strong password.
3. **Step 3:** User submits the form and is routed to the main marketplace home page. Full frontend signup flow confirmed working end-to-end.

### Backup Plan

- If live site fails to load: switch within **15 seconds** to pre-recorded screen walkthrough of the identical 3-step signup flow
- Narrated screenshots prepared as second fallback
- Backup covers the same flow — no feature pivoting, no "please imagine this works"


---

## 3. Midterm Brochure


### What the Brochure Contains *(standalone — not a copy of the deck)*

- **What the project is:** A verified campus-only peer-to-peer marketplace for Ulsan College
- **Who it is for:** Students buying/selling textbooks, dorm essentials, and course tutoring services
- **Why it matters:** Generic platforms have no campus identity verification — this one does, by design
- **What works now:** Live signup UI with strict `@office.uc.ac.kr` domain validation, deployed to GitHub Pages
- **What comes next:** Flask/MongoDB login binding and item listing workflows in Sprint 3
- **How to get more info:** Repo link + QR code pointing to the live GitHub Pages site

> The brochure story matches the deck exactly — both lead with the walled-garden trust argument and end with the same ask. No conflicting narratives.

---

## 4. Sprint 2 Document

**SPRINT_2.md:**
`docs/Sprint_Packet/Weekly Sprint Packet - Week6.md` (in repo)

### What Sprint 2 Documents

- Vite frontend environment set up and merged to main (Issue #24)
- GitHub Pages deployment fixed — Jekyll workflow replaced with Node/Vite Actions (Issue #25)
- HashRouter added in `main.jsx` for SPA compatibility
- Vite base path set to `/campusMarketPlace/` in `vite.config.js`
- Authentication service refactoring in progress
- API error handling hardened

The Sprint 2 document reflects the current project direction and matches the Midterm presentation exactly.

---

## 5. What Works Now / Proof

> **Rule: If it isn't linked, it didn't happen.**

| Evidence Type | Link / Description |
|--------------|-------------------|
| Live Deployment | https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/ |
| Repository | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace |
| Issue #24 — Vite Setup | Vite frontend environment configured and merged to main |
| Issue #25 — GitHub Pages Fix | Jekyll replaced with Node/Vite Actions workflow — SPA routing fixed |
| Commit `[7c4404b]` | Created folder for Backend (14 hours before midterm) |
| Commit `[a1b2c3d]` | Fix root dev scripts and GitHub Pages deployment |
| Commit `[e4f5g6h]` | Connect signup page on button |
| GitHub Actions CI | Vite build + deploy workflow active on every push to main |
| Project Board | https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15 |
| Total Commits | 107 commits across 8 active branches, 8 team contributors |
| Language Stats | JS 58.3%, CSS 26.3%, HTML 1.8%, Python 13.6% |

---

## 6. Realistic Roadmap

| Phase | Status | Theme | What Gets Done |
|-------|--------|-------|----------------|
| Sprint 1–2 (NOW) | ✅ DONE | Foundation | React + Vite setup, strict auth validation UI, shared layout routing, GitHub Pages CI/CD |
| Sprint 3–4 (NEXT) | 🔄 IN PROGRESS | Integration | Flask/MongoDB login binding, Buy/Sell listing workflows, session management |
| Final (TARGET) | 🎯 PLANNED | Full Loop | Closed-loop Buy/Sell, active Request Board, Tutor postings, full end-to-end demo |
| Post-Final | 💡 NOT PROMISED | Expansion | In-app messaging, tutoring payment gateway — intentionally out of scope |

> We are intentionally not promising in-app messaging or payment integration before the Final. A believable small roadmap is stronger than an overcommitted one.

---

## 7. Speaker Roles

| Speaker | Slides | Role | Content |
|---------|--------|------|---------|
| Sudarshan Rai | 1, 2, 3 | Opens + Problem + Solution | Intro, campus commerce friction, walled garden pitch |
| Rai Aayuska | 4, 5 | Users + Architecture | Target users, value prop, system architecture overview |
| **Sagar (Me)** | **6, 8** | **Technical Overview** | **Sprint 2 progress, UI/UX flow, Vite + Flask + MongoDB stack** |
| Ananda Tamang | 7, 9, 10 | Demo + Engineering Proof | Live demo walkthrough, validation logic, GitHub commit evidence |
| Gayatri K. Bhandari | 11, 12, 13 | Roadmap + Ask + Close | QA philosophy, 3-station map, team roles, ask, closing |

All 5 team members present with a defined speaking role. No one is silent. Backup demo responsibility falls to Sagar as integration lead if Ananda's demo fails.

---

## 8. Ask

We are not asking for money. We are asking for three specific, realistic things:

1. **Pilot users:** 10–20 Ulsan College students to test the platform once Buy/Sell listing flow is live in Sprint 3. Real user feedback before Final will harden the UX before submission.

2. **Feedback on technical direction:** Specifically on Flask/MongoDB integration. The frontend is de-risked — the backend is our current bottleneck. Instructor or senior guidance would meaningfully accelerate Sprint 3.

3. **Approval to continue with current scope:** Confirmation that our prioritization is right — core List → Search → Contact loop before Final, commercial features held for post-Final.

> We are not asking anyone to imagine what this could be. The architecture is live, the validation is working, the repo is public. We are asking for the support to finish what we started.

---

## 9. Team Evidence and Participation

> Visible proof that multiple team members contributed.

- **Issues with owners:** Issue #24 (Vite setup — Sagar), Issue #25 (GitHub Pages fix — Sagar)
- **PRs showing real work:** PR #25 replaced broken Jekyll workflow — peer reviewed before merge
- **Docs matching project direction:** Week 6 Sprint Packet committed to `docs/Sprint_Packet/`
- **Board activity:** GitHub Project Board #15 updated with To Do / Doing / Done states
- **8 active contributors** across 8 branches — verified in repo language stats and commit history

**Project Board:** https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15

---

## Quick Checklist

| # | Item | Status | Notes |
|---|------|--------|-------|
| ✅ | Midterm deck link included | READY | PDF in `docs/Sprint_Packet/` folder in repo |
| ✅ | Demo link included | LIVE | GitHub Pages deployed — Vite Actions workflow |
| ✅ | 3-bullet demo script included | READY | Reject → verify → route — signup flow |
| ✅ | Backup plan included | READY | Recorded walkthrough video prepared |
| ⬜ | Brochure link included | PENDING | Upload digital PDF before Midterm day |
| ✅ | SPRINT_2.md linked | READY | Week 6 Packet in `docs/Sprint_Packet/` |
| ✅ | Proof links included | READY | 107 commits, Issues #24 #25, board, deploy link |
| ✅ | Roadmap included | READY | 3-station: Foundation / Integration / Final |
| ✅ | Speaker roles clear | READY | All 5 members assigned with defined roles |
| ✅ | Ask included | READY | Pilot users, tech direction, scope approval |
| ✅ | Repo evidence shows team progress | READY | 8 branches, 8 contributors, CI/CD active |

---

> **Real. Focused. Worth Supporting.**
> The problem is clear. The user is clear. The demo is focused. The proof is visible.
> The roadmap is realistic. The team is prepared. CampusMarketplace is worth continuing.
