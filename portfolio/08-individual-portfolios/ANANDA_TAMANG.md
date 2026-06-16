# Individual Portfolio — Tamang Ananda

## 1. My Role

- **Name:** Tamang Ananda
- **Team:** CampusMarketplace capstone team
- **Project:** CampusMarketplace
- **Main responsibilities:** UI/frontend improvement, database and backend coordination, QA tracking, MVP verification support, and email/OTP planning
- **Roles held during the semester:** Project Manager in early and Week 9 sprint materials, QA Lead in Week 11 and Week 12 materials, database/backend contributor in sprint packets, and frontend/UI contributor through later marketplace polish commits

## 2. My Strongest Contributions

| Contribution | What I personally did | Evidence link |
|---|---|---|
| Frontend UI and usability improvement | Improved marketplace-facing screens and visual polish, including localized marketplace pages, better dark-mode toggle visibility, stronger page icon visibility, and darker header/footer styling for readability. | [Localize remaining marketplace screens](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/8b6d843), [Improve dark mode toggle visibility](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/5b6fe8f), [Improve outer page icon visibility](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/563b49b), [Darken header and footer](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/028d79e) |
| Project management and sprint coordination | Took PM responsibility in sprint planning documents and helped keep the team focused on the MVP path and deliverables. | [Week 2 sprint packet](../../docs/Sprint_Packet/Weekly%20Sprint%20Packet%20-%20Week2.md), [Week 9 sprint packet](../../docs/Sprint_Packet/Week_9/Weekly%20Sprint%20Packet%20-%20Week9.md) |
| Database and backend ownership | Supported the MongoDB/database direction and was listed as the owner for the database layer in sprint evidence and AI ownership tracking. | [Sprint 3 packet](../../docs/Sprint_Packet/SPRINT_3.md), [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md), [AI ownership audit](../06-ai-and-code-ownership/AI_CODE_OWNERSHIP_AUDIT.md) |
| QA and MVP verification | Led QA-related verification work during the MVP phase and helped document what was complete, what was risky, and what still needed fallback handling. | [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md), [Week 12 sprint packet](../../docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md) |

## 3. One Area I Can Explain Clearly

- **Area:** Email verification and OTP readiness in the backend/MVP flow
- **File, folder, Issue, PR, or doc:** [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md), [Week 12 sprint packet](../../docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md), [Issue #38](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/38)
- **What it does:** It defines the verification gate for campus signup and tracks the missing step of actually sending the OTP/verification email through a provider.
- **How it works:** A user signs up with a campus email, the backend keeps verification status in the user flow, and protected behavior depends on that verified state. The sprint packets show that the verification gate existed, while real email delivery still needed provider integration.
- **How it was tested:** The team documented the verification flow in sprint QA materials and used a manual fallback for demo readiness when provider delivery was not fully wired yet.
- **One possible failure or limitation:** If the email provider is not configured correctly, users cannot complete real verification even if the backend gate exists.
- **Evidence link:** [Week 11 risk and QA section](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md), [Week 12 backlog and risks](../../docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md)

## 4. My AI Use

- **AI tools used:** ChatGPT and other AI assistants for explanation, debugging direction, and documentation drafting
- **What AI helped with:** Understanding backend/database implementation ideas, organizing sprint wording, thinking through OTP/email integration steps, and refining UI/frontend polish ideas for readability and visibility
- **What I personally checked:** I checked whether the repo, sprint packets, and MVP evidence actually matched what the AI-assisted explanation claimed
- **What I personally changed:** I adapted the ideas to our campus email verification flow, our MongoDB/backend plan, our sprint/QA documentation, and the actual frontend styling and marketplace screen improvements I committed
- **How I tested or verified it:** By comparing the output to the actual project files, sprint evidence, and the final MVP story we could defend
- **One part I still do not fully understand:** A complete production-ready email delivery setup with all provider-side configuration and failure handling

## 5. One Problem I Helped Solve

- **Problem:** The product needed both a defensible MVP story and a cleaner, more usable frontend for the final presentation
- **Why it mattered:** Even if the backend flow existed, weak readability or confusing UI details would hurt the demo and make the product feel unfinished
- **What I did:** I helped anchor the project around backend/database ownership and QA checkpoints, and I also improved the frontend through marketplace localization and UI visibility/readability fixes
- **What changed:** The repo now shows both a more defensible MVP narrative and a more polished frontend presentation, especially in marketplace screens, navigation visibility, and dark-mode readability
- **Evidence link:** [Localize remaining marketplace screens](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/8b6d843), [Improve dark mode toggle visibility](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/5b6fe8f), [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md)

## 6. Reflection

### What I learned

- Backend readiness is not just code; it also depends on configuration, verification logic, QA proof, and a frontend that is clear enough to demo confidently.

### What I am most proud of

- I am most proud that the team ended with a real full-stack marketplace story that connects auth, data, QA, UI polish, and portfolio evidence.

### What I should have done better

- I should have kept even clearer individual evidence and receipts during each sprint so my personal contributions were easier to prove later.

### What I would improve next

- I would improve test setup, seed data, CI-backed backend verification, the real email provider integration path, and more structured UI regression checking.

### One skill I want to continue developing

- I want to continue developing both backend testing and frontend product-polish skills, especially for full-stack apps that need to be solid technically and present well in demos.

## 7. My Best Evidence Links

1. [Marketplace UI Localization Pass](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/8b6d843) - Shows large-scale frontend work across Dashboard, ItemDetail, Profile, Login, Signup, and related marketplace screens.
2. [Dark Mode Toggle Visibility Improvement](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/5b6fe8f) - Shows targeted UI polish work to improve navbar usability and dark-mode visibility.
3. [Final Portfolio Buildout](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f44e000) - Shows the full portfolio structure, MVP documentation, QA packets, AI ownership docs, and final presentation prep being added to the repo.
4. [Final Presentation Deck Added](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/55de9a6) - Shows the final presentation PPTX and slide README being added for submission and defense use.
5. [Live Deployed Application](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) - Shows the working deployed product that the portfolio and presentation point to.
