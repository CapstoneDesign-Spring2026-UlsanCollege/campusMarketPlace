# AI Code Ownership Audit - Campus Marketplace

> **Purpose:** Document team understanding of the project, especially parts created or modified with AI assistance.
> 
> **Date created:** 2026-04-29

---

## 1) Team + Project

- **Team:** CapstoneDesign-Spring2026-UlsanCollege
- **Project name:** Campus Marketplace
- **Current repo:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace
- **Current demo link:** https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/
- **Date updated:** 2026-04-29

---

## 2) What Our App Currently Does

A React + Vite frontend application that provides campus community members with a marketplace to buy, sell, and post service requests within the territory of Ulsan College.

### Core Features (Current Implementation):

- **Home page** - Campus marketplace branding and navigation hub
- **Signup page** - User registration with front-end validation:
  - First/last name required
  - Campus email format validation (@office.uc.ac.kr)
  - Password strength validation and confirmation matching
- **Navigation layout** - Shared across all pages for consistent UX
- **Responsive UI** - Built with Bootstrap 5 for mobile and desktop

### MVP Flow

Our main user can:

1. Land on the home page with campus marketplace branding
2. Navigate to the signup page
3. Enter valid first/last name, campus email, and strong password
4. Create an account (frontend validation complete, backend integration pending)
5. Access a dashboard (planned for next phase)

---

## 3) What Works Right Now

| Working item | Evidence link | Owner who can explain it |
|---|---|---|
| Home page with navigation | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) | [Frontend Team] |
| Signup UI & form validation | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) | [Frontend Team] |
| Email format validation (@office.uc.ac.kr) | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) | [Frontend Team] |
| Password strength & confirmation | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) | [Frontend Team] |
| React + Vite build setup | [Repository](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace) | [Frontend Lead] |

---

## 4) Code We Understand

| Code area | File / folder | What it does | Who can explain it? | Evidence |
|---|---|---|---|---|
| Frontend setup | `Frontend/` | React + Vite app powered by Vite bundler | [Frontend Lead] | [README.md](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/README.md) |
| Signup form | `Frontend/src/components/` | Collects email/password and validates inputs | [Frontend Team] | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) |
| Project docs | `docs/` | Project documentation and specifications | [Project Manager] | [Repository](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace) |
| CSS styling | `Frontend/src/styles/` or component files | Responsive design using Bootstrap 5 | [Frontend Designers] | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) |

---

## 5) Code We Do NOT Fully Understand Yet

Be honest. This is not automatically bad. Hiding it is bad.

| Code area | What is confusing? | Risk level | Owner | Next step |
|---|---|---|---|---|
| Backend integration points | How to connect signup form to Flask backend | High | [Backend Lead] | Implement signup API endpoint and connect frontend |
| MongoDB schema | Database design for users, listings, requests | light | [Database Owner] | Design and document MongoDB collections |
| State management | How data flows between components | Medium | [Frontend Team] | Set up Context API or state management library |
| Authentication flow | JWT tokens, session management | High | [Security Lead] | Implement backend auth and frontend token storage |
| Buy/sell listing workflow | How users create and browse listings | High | [Product Owner] | Design and implement listing pages and backend routes |

---

## 6) AI-Assisted Work

Document any code generated or significantly modified with AI assistance (ChatGPT, GitHub Copilot, etc.). Be specific about what AI helped with and what humans changed.

| Area | AI tool used | What AI helped with | What humans checked/changed | Evidence |
|---|---|---|---|---|
| Signup form validation | [Copilot] | Initial form validation logic and regex patterns | Reviewed for security; customized for campus email format (@office.uc.ac.kr) | [PR}(https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/9)|
| Bootstrap integration | [Chatgpt] | Responsive grid and component setup | Adapted to project branding and custom styling | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) |
| Vite configuration | [Copilot] | Build config and dev server setup | Reviewed and tested locally | [Frontend/vite.config.js] |
| [Will be adding more as applicable] | | | | |

---

## 7) Bugs / Unreliable Features

Document any known issues that impact the MVP or user experience.

| Bug / problem | Severity | Evidence link | Owner | Next action |
|---|---|---|---|---|
| Domain Deployment | P0 |[Repository](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace) | [Deploy lead |
| No marketplace listing page | P1 | [Repository](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace) | [Frontend Team and Backend Team] | Design and implement product listing page |
| Mobile responsiveness needs testing | P2 | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) | [Frontend Team] | Test on multiple devices and fix layout issues |

### Severity Guide:

- **P0:** Final demo cannot work without this fix
- **P1:** Core feature broken or unreliable
- **P2:** Important but a workaround exists
- **P3:** Polish / nice improvement

---

## 8) Risk List

| Risk | Why it matters | Mitigation | Owner |
|---|---|---|---|
| Database schema fully defination | Cannot implement API endpoints without knowing data structure | Design MongoDB schema for users, listings, requests, messages | [Database Owner] |
| No authentication system | Anyone can access user data; security risk | Implement JWT tokens, password hashing, session management | [Security Lead] |
| Limited team bandwidth | Scope creep (buy/sell, requests, tutoring) may overwhelm team | Prioritize MVP (sign up, login, browse listings); defer other features to next sprint | [Project Manager] |
| Unclear role assignments | Team members may duplicate work or leave gaps | Finalize RACI matrix and update Section 9 (Ownership Map) | [Project Manager] |

---

## 9) Team Ownership Map

Each student must own at least one part of the project and be able to explain it.

| Student | Owned area | Can explain? | Evidence link | Needs help with |
|---|---|---|---|---|
| [Sob Sagar] | Frontend / React components | Needs work | [PR](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) | [Frontend] |
| [Sudarshan Rai] | Backend / Flask API | Needs work |[PR](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29)  | [Frontend/app.py] |
| [Ananda Tamang] | Database / MongoDB | Needs work | [PR](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29) | [MongoDB Atlas] |
| [Aayuska Rai] | UI/UX Design | Needs work | [PR](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26) | [Frontend] |
| [Gayatri K. Bhandari] | DevOps / Deployment | Needs work | [No PR] | [Github pages Workflow] |

---

## 10) Tech Stack

| Area | Technology | Rationale |
|---|---|---|
| **Frontend** | React 18 + Vite | Fast build, hot module replacement, modern React |
| **Frontend UI** | Bootstrap 5 | Responsive design, accessible components, campus branding |
| **Backend** | Flask 3 | Lightweight Python framework, easy to learn and extend |
| **Database** | MongoDB + PyMongo | Document-based, flexible schema, good for marketplace listings |
| **Deployment** | GitHub Pages (frontend) | Free, integrated with GitHub, automatic deployment |
| **Build & Package** | npm + pip | Standard package managers for JS and Python |

---

## 11) Top 3 Stabilization Goals

Before adding more features, we will stabilize:

1. **Complete backend signup/login** - Implement Flask API endpoints, MongoDB integration, and JWT authentication
2. **Test MVP flow end-to-end** - Verify user can sign up, log in, and view marketplace without errors

---

## 12) Definition of Done for Sprint 3

By the end of Sprint 3, we should be able to show:

- [ ] Core MVP flow works (signup → login → browse listings)
- [ ] Core MVP flow has video evidence or demo
- [ ] P0 bugs are fixed or clearly documented with workarounds
- [ ] Every team member can explain one code/doc/test area they own
- [ ] All AI-assisted code has been reviewed and tested by humans
- [ ] Weekly Sprint Packet links this audit and references PRs/issues

---

## 13) Next Steps

1. **Assign owners** to Section 9 (Team Ownership Map) — each person must claim a piece
2. **Implement backend** — start with signup/login endpoints and MongoDB connection
3. **Update this audit weekly** — mark bugs as fixed, update ownership, add new risks
4. **Schedule code review** — human review all AI-generated code before merging to main

---

**Last updated:** 2026-04-29  
**Next review:** [Sprint 3 end date]



