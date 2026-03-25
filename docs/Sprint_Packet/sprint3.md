# Weekly Sprint Packet — Week 4

**Team:** CampusMarketplace  
**Week #:** 4  
**PM (this week):** Sagar Sob  
**Scribe (this week):** _(fill in)_

---

## Demo link (live or video)

TBD — will be a localhost recording or live run of `python app.py`

---

## Demo script (3 bullets)

- Show `/register` — fill out form, submit, user is saved in MongoDB with hashed password
- Show `/login` — log in with registered credentials, navbar updates to show username + Logout
- Show `/logout` — session cleared, navbar reverts to Login / Sign Up buttons

---

## Demo backup plan

- Pre-recorded video of registration → login → logout flow
- Screenshots in `docs/images/` (Flask running, register form, MongoDB document, logged-in state)
- GitHub activity (PRs, merged issues) as process evidence

---

## Board / Project link

TBD — _(create GitHub Project board and paste link here)_

---

## Board snapshot (To Do / Doing / Done)

**To Do**
- [ ] Create listing form + route — @AayushkaRai _(Sprint 5)_
- [ ] Browse listings page — @AayushkaRai _(Sprint 5)_
- [ ] Update README with setup instructions — @SudarshanRai

**Doing**
- [ ] Decision issue: resolve tech stack to Flask + MongoDB — @SagarSob
- [ ] Flask project setup (`app.py`, folder structure, `requirements.txt`) — @SudarshanRai
- [ ] MongoDB Atlas setup + PyMongo connection (`db.py`) — @GayatriKBhandari
- [ ] Jinja2 base template + navbar with Bootstrap 5 — @Aayuska
- [ ] Registration form template (`register.html`) — @Aayuska
- [ ] Login form template (`login.html`) — @Aayuska
- [ ] `/register` route (validate, hash, store) — @SudarshanRai + @GayatriKBhandari
- [ ] `/login` route (verify, session) + `/logout` — @SudarshanRai + @GayatriKBhandari
- [ ] QA: test registration + login with valid/invalid inputs — @AnandaTamang

**Done**
- [x] Static landing page (HTML/CSS) — Sprint 1
- [x] GitHub issue + PR templates — Sprint 1
- [x] Team agreement — Sprint 1
- [x] Sprint 4 planning + task assignment — @SagarSob

---

## Definition of Done (for this week)

- Merged to `main` via PR with at least 1 reviewer
- Works locally: `pip install -r requirements.txt` → `python app.py` → app runs
- Used a branch (not direct to `main`)
- Commit messages use conventional format (`feat:`, `fix:`, `docs:`)
- PR links an issue (`Closes #<number>`)

---

## Sprint notes

**Shipped (what improved):**
- _(fill at end of week)_

**Broke / Problems:**
- _(fill at end of week)_

**Next plan (top 3):**
- Create listing page (form + image upload + MongoDB insert)
- Browse listings page (grid of all active listings)
- Listing detail page (single item view with seller info)

**Risks / Blockers:**
- Team has zero Flask/MongoDB experience — mitigate with pair programming on Day 1
- MongoDB Atlas setup may confuse some members — Gayatri writes setup guide + `test_db.py` on Day 1
- `.env` secrets could be accidentally committed — `.gitignore` must be set up before any `.env` exists
- If login isn't ready by demo, fall back to demoing registration only

---

## Engineering practice spine (choose 1) + evidence

**Focus:** Issue-Driven Git Workflow (Issue → Branch → PR → Review → Merge)

**Evidence link(s):** _(paste 3+ merged PR links at end of week)_

**Result:** First sprint where every code change goes through the full GitHub workflow with real code.

---

## Individual Contribution Receipts (REQUIRED)

Each member posts a comment on this issue with 2–3 links:

> **[Name] — Receipts**
> - PR: https://github.com/.../pull/XX
> - Issue closed: https://github.com/.../issues/YY
> - Review: https://github.com/.../pull/ZZ#discussion

---

## Task Breakdown by Person

| Person | Role | Tasks |
|---|---|---|
| Sagar Sob | PM | File Decision issue (tech stack), create all sprint issues Day 1, track board, write sprint notes |
| Sudarshan Rai | Backend Lead | `app.py` setup, `requirements.txt`, `/register` route, `/login` route, `/logout` route, password hashing |
| Gayatri K. Bhandari | Database | MongoDB Atlas cluster, `db.py` connection helper, `.env.example`, `test_db.py`, support registration/login queries |
| Aayuska | Frontend Lead | `base.html` (Bootstrap 5 + navbar), `register.html`, `login.html`, `index.html`, conditional navbar |
| Ananda Tamang | QA Lead | Test all registration/login scenarios, file Bug issues for failures, verify form validation |

---

## Tech Stack (per PROJECTPITCH.md)

| Area | Tool |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python (Flask) |
| Database | MongoDB (Atlas free tier) |
| Hosting | Render |

---

## Folder Structure (end of Sprint 4)

```
campusMarketPlace/
├── app.py
├── db.py
├── requirements.txt
├── .env.example
├── .gitignore
├── templates/
│   ├── base.html
│   ├── index.html
│   ├── register.html
│   └── login.html
├── static/
│   ├── css/style.css
│   └── images/logo.png
└── docs/
    ├── Sprint_Packet/Sprint4.md
    └── images/
```
