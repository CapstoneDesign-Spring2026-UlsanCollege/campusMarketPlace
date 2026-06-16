# AI Code Ownership Audit

## Rule

AI-assisted work only counts if the team can run it, explain it, test it, debug it, and link evidence.

## Existing Evidence

- Original audit: [docs/Sprint_Packet/Week_9/AI Code Ownership Audit.md](../../docs/Sprint_Packet/Week_9/AI%20Code%20Ownership%20Audit.md)
- Week 11 AI/ownership check: [WEEK_11.md](../02-semester-journey/weekly-sprints/WEEK_11.md)
- Final code: [app.py](../../app.py), [Frontend/src](../../Frontend/src)

## AI Tools Used

- GitHub Copilot, according to the Week 9 and Week 11 audit materials
- ChatGPT/Claude/Gemini-style tools, according to sprint packet notes

## What AI Helped With

- Form validation and regex suggestions
- Bootstrap/responsive UI guidance
- Vite/build configuration guidance
- Backend route/schema boilerplate
- Debugging and API implementation suggestions
- Sprint packet structure and wording
- PR summary/review wording

## Human Review and Changes

Humans reviewed, customized, and tested the project against the campus marketplace requirements:

- Campus email requirement changed to `@office.uc.ac.kr`
- Password strength and signup validation were adjusted for the app
- Flask/MongoDB routes were integrated into the real backend
- Frontend API calls were connected to real backend responses
- Environment variable behavior was documented for deployment
- Sprint packets and portfolio documents link evidence rather than treating AI output as proof by itself

## Code Areas Each Student Can Explain

| Student | Code/doc area | Evidence |
|---|---|---|
| Sudarshan Rai | Documentation, backend setup, final portfolio, setup/run guide, Sprint 4 planning | [TEAMAGREEMENT.md](../../docs/TEAMAGREEMENT.md), [SPRINT_4.md](../../docs/Sprint_Packet/SPRINT_4.md) |
| Sagar Sob | Backend/API and QA ownership in sprint materials | [Week 11 packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md) |
| Gayatri K. Bhandari | Frontend, demo driver, deployment/front-end integration evidence | [Week 11 packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md) |
| Aayuska Rai | UI/UX, AI steward, Sprint 4/Week 13 materials | [Week 13 packet](../../docs/Sprint_Packet/Week_13/Weekly%20Sprint%20Packet%20-%20Week13.md) |
| Ananda Tamang | Database, QA, email/OTP work in sprint materials | [Week 11 packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md) |

## Confusing or Risky Code Areas

| Area | Risk | Mitigation |
|---|---|---|
| OTP email delivery | Requires external provider configuration | Rehearse with SendGrid/SMTP or use pre-verified account |
| Cloudinary image upload | Requires external credentials | Configure env vars or use local fallback for local demo |
| Integration tests | Test file exists but fixture is missing | Add `conftest.py` and test DB setup |
| Messaging | More complex than core marketplace demo | Keep backup demo path and explain scope |
| Deployment | Depends on GitHub Pages, Render, MongoDB, Cloudinary, email provider | Rehearse local run |

## Representative AI-Assisted PRs and Evidence

- PR #26 Vite setup: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26
- PR #29 backend setup: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/29
- PR #55 real API calls: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/55
- PR #56 JWT fix: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/56
- PR #57 signup lifecycle fix: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/57
- PR #58 item detail endpoint: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/58
- PR #59 item listing endpoints: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/59
- PR #60 post item composer: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/60
- PR #61 item schema/indexes: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/61
- PR #62 email verification gate: https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/62

## Remaining Ownership Risks

- Every student should personally verify that they can explain the code area listed for them.
- Each student should add their own individual portfolio page before submission.
- The team should rehearse technical questions around auth, MongoDB collections, item ownership, CORS, image uploads, email OTP, and deployment.
