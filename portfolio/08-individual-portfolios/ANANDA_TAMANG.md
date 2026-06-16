# Individual Portfolio — Tamang Ananda

## 1. My Role

- **Name:** Tamang Ananda
- **Team:** CampusMarketplace capstone team
- **Project:** CampusMarketplace
- **Main responsibilities:** Database and backend coordination, QA tracking, MVP verification support, and email/OTP planning
- **Roles held during the semester:** Project Manager in early and Week 9 sprint materials, QA Lead in Week 11 and Week 12 materials, and database/backend contributor across sprint packets

## 2. My Strongest Contributions

| Contribution | What I personally did | Evidence link |
|---|---|---|
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
- **What AI helped with:** Understanding backend/database implementation ideas, organizing sprint wording, and thinking through OTP/email integration steps
- **What I personally checked:** I checked whether the repo, sprint packets, and MVP evidence actually matched what the AI-assisted explanation claimed
- **What I personally changed:** I adapted the ideas to our campus email verification flow, our MongoDB/backend plan, and our sprint/QA documentation
- **How I tested or verified it:** By comparing the output to the actual project files, sprint evidence, and the final MVP story we could defend
- **One part I still do not fully understand:** A complete production-ready email delivery setup with all provider-side configuration and failure handling

## 5. One Problem I Helped Solve

- **Problem:** The project needed a clear backend/database direction and a believable MVP verification story instead of too many unfinished features
- **Why it mattered:** Without that focus, the team could not confidently explain how authentication, verification, listings, and demo readiness fit together
- **What I did:** I helped anchor the project around database/backend ownership, QA checkpoints, and email verification planning in the sprint materials
- **What changed:** The repo and portfolio now show a more defensible MVP narrative with identified limitations, ownership, and fallback plans instead of vague claims
- **Evidence link:** [Week 9 sprint packet](../../docs/Sprint_Packet/Week_9/Weekly%20Sprint%20Packet%20-%20Week9.md), [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md), [Week 12 sprint packet](../../docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md)

## 6. Reflection

### What I learned

- Backend readiness is not just code; it also depends on configuration, verification logic, QA proof, and realistic demo planning.

### What I am most proud of

- I am most proud that the team ended with a real full-stack marketplace story that connects auth, data, QA, and portfolio evidence.

### What I should have done better

- I should have kept even clearer individual evidence and receipts during each sprint so my personal contributions were easier to prove later.

### What I would improve next

- I would improve test setup, seed data, CI-backed backend verification, and the real email provider integration path.

### One skill I want to continue developing

- I want to continue developing backend testing and deployment skills, especially for Flask APIs connected to MongoDB and external services.

## 7. My Best Evidence Links

1. [Team Agreement](../../docs/TEAMAGREEMENT.md)
2. [Week 2 sprint packet](../../docs/Sprint_Packet/Weekly%20Sprint%20Packet%20-%20Week2.md)
3. [Week 9 sprint packet](../../docs/Sprint_Packet/Week_9/Weekly%20Sprint%20Packet%20-%20Week9.md)
4. [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md)
5. [Week 12 sprint packet](../../docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md)
