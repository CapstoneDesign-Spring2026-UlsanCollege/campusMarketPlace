# Individual Portfolio — Rai Aayuska

## 1. My Role

* **Name:** Rai Aayuska
* **Team:** CapstoneDesign-Spring2026-UlsanCollege
* **Project:** campusMarketPlace
* **Main responsibilities:** Frontend UI/UX, profile page features, file upload fixes, documentation updates, GitHub Pages workflow setup
* **Roles held during the semester:** Contributor, Frontend Developer, Documentation Owner

## 2. My Strongest Contributions

| Contribution                                         | What I personally did                                                                                           | Evidence Link                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Improve overall layout and visual hierarchy          | Refined global styling and extended the Messages route functionality.                                           | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/161                                                                                                                                                                       |
| Profile page & profile button integration            | Added profile page, profile button in navbar, hamburger menu, and currency/language toggles.                    | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94                                                                                                                                                                        |
| Currency & language toggle + currency display update | Implemented toggle UI and updated currency displays from USD to KRW across the frontend.                        | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/74<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/e392d9d5d26afba78b163dc2708d7b1bb43b34a6                                         |
| File upload bug fix                                  | Diagnosed and fixed file upload handling so uploads succeed end-to-end; coordinated backend and frontend fixes. | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/88d3d6ab381cd6a205cb161a7641a18294fc91f3                                         |
| Add Vite frontend / Setup Vite                       | Initialized the React frontend using Vite and added the initial project structure and configuration.            | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/25<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/26                                                                                 |
| GitHub Actions workflow for Pages                    | Added CI workflow for GitHub Pages deployment and resolved CORS issues.                                         | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/54f22782dd0e86841c4052a65b1179dcc249ad5a                                                                                                                                |
| Update backend / `app.py` changes                    | Updated server logic and backend fixes to improve profile and API behavior.                                     | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/48<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/d4ec9608a60e51865d11220d40c1806cce2b8efb                                         |
| MIDTERM and documentation improvements               | Reorganized and updated MIDTERM submission files and supporting documentation.                                  | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/36e493d2ddb0ddcf4d456af5ea536798aab1afb7<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/b9471bb7be565486faa2935c72f49f92b375a97e |
| Resolve merge conflicts and feature merges           | Resolved conflicts and merged profile and dashboard features into `main`.                                       | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/3945ccbb40e82707f9d30f7e29358368a350bf50<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/726bb3cf2a818ca0515f9833f70e21abc1b3a001 |
| UI/UX updates and light mode                         | Implemented UI improvements and a light mode theme for improved accessibility and user experience.              | https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/107<br>https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/8aef2047912e67643ba5ed55ada77e914bc3dec9                                        |

## 3. One Area I Can Explain Clearly

* **Area:** Profile page and profile navigation
* **File, folder, Issue, PR, or doc:** PR #94 (Profile Feature)
* **What it does:** Adds a user profile page accessible through a profile button in the navigation bar. It allows users to view and edit personal information, change currency and language settings, and access purchase and selling history.
* **How it works:** React components render the profile interface. The navbar conditionally displays the profile button for authenticated users. The profile page communicates with backend APIs to retrieve and update user information. Currency and language preferences update application state and displayed content.
* **How it was tested:** Performed manual browser testing by navigating to the profile page, editing fields, and using the currency/language toggles. Verified API responses and application behavior during local development.
* **One possible failure or limitation:** Frontend functionality may break if backend API schemas change or authentication tokens expire. Additional error handling and integration testing would reduce this risk.
* **Evidence Link:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94

## 4. My AI Use

* **AI tools used:** GitHub Copilot and ChatGPT
* **What AI helped with:** Drafting PR descriptions, commit messages, documentation wording, UI text improvements, and troubleshooting suggestions.
* **What I personally checked:** Reviewed all AI-generated suggestions for correctness and tested any code before committing.
* **What I personally changed:** Implemented final code changes, refined generated text, and corrected inaccurate suggestions.
* **How I tested or verified it:** Ran the application locally, reviewed pull request diffs, and ensured CI checks passed where applicable.
* **One part I still do not fully understand:** How to consistently create prompts that produce accurate code suggestions for large-scale refactoring tasks.

## 5. One Problem I Helped Solve

* **Problem:** File upload functionality was failing, preventing users from uploading images and files.
* **Why it mattered:** Uploads are required for item listings and profile management, making this a critical feature.
* **What I did:** Investigated the issue, fixed the upload handler and related frontend code, and submitted PR #52.
* **What changed:** File uploads now work correctly, and related UI and documentation were updated.
* **Evidence Link:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52

## 6. Reflection

### What I Learned

* How to integrate frontend React features with backend APIs.
* How to troubleshoot file upload and CORS-related deployment issues.

### What I Am Most Proud Of

* Building the profile page experience and implementing the currency toggle functionality.

### What I Should Have Done Better

* Added automated integration testing earlier in the development process.

### What I Would Improve Next

* Implement end-to-end testing for profile and file upload workflows.

### One Skill I Want to Continue Developing

* Full-stack integration testing and CI/CD automation.

## 7. My Best Evidence Links

1. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/74
2. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/52
3. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/94
4. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/48
5. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/109
6. https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/161
