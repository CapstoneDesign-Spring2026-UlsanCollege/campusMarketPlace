<!--
Weekly Sprint Packet - Week6
Define, Clean Up, Harden

This week focuses on stabilizing the codebase and preparing the foundation
for feature development in Week 7 and the pitch in Week 8.
-->

# Sprint 2, Week 6: Define, Clean Up, Harden

## Team

**Team Name**

[campusMarketPlace]

**Sprint Number**



Week 6 

**Repository**

[CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace)

**Live Demo**

[CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)


**PM for this Week**

[Rai Aayuska]

**Week Duration**

[2026.04.08] → [2026.04.17]

---

# Sprint 6 Focus

## Sprint Goal

Establish a clean, well-defined, and hardened foundation for feature development and the midterm pitch.

**Key Objectives:**
- [ ] Define final technical specifications
- [ ] Clean up and refactor existing codebase
- [ ] Harden core functionality and stability
- [ ] Document architecture and design decisions
- [ ] Prepare infrastructure for demo

---

# Demo

**Status:** Preparation phase - core features stabilizing

## Demo Script

What we can show this week (if applicable):

**Step 1:** Login and authentication flow
- Show user onboarding
- Verify session management

**Step 2:** Core marketplace data model
- Display database structure
- Show API endpoints

**Step 3:** Basic UI/UX workflow
- Navigate through main pages
- Demonstrate existing features from Sprint 1

**Step 4:** Performance baseline
- Show response times
- Demonstrate stability under load

---

## Backup Plan

If live demo is not ready:

- [ ] Screenshots of working features
- [ ] Architecture diagram and documentation
- [ ] API endpoint documentation with curl examples
- [ ] Database schema visualization

---

# Project Board Snapshot

**GitHub Project Board:**

[Link to project board](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects)

## Sprint Goal Statement

Define, clean up, and harden the codebase to prepare for Week 7 feature development and Week 8 pitch.

---

## Current Board State

### To Do

Issues that need to be started:

- [ ] [Code cleanup: Remove dead code](issue-link)
- [ ] [Refactor: Extract reusable components](issue-link)
- [ ] [Documentation: Update architecture doc](issue-link)
- [ ] [Testing: Increase coverage to 70%](issue-link)
- [ ] [Security: Implement input validation](issue-link)
- [ ] [Performance: Optimize database queries](issue-link)
- [ ] [Infrastructure: Set up staging environment](issue-link)
- [ ] [Design: Finalize UI mockups for Week 7](issue-link)

### Doing

Issues currently in progress:

- [ ] [Issue: Refactor authentication service](issue-link)
- [ ] [Issue: Clean up frontend components](issue-link)
- [ ] [Issue: Harden API error handling](issue-link)

### Done

Issues completed this week:

- [ ] [Issue: Setup Vite for frontend environment]([issue-link](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/24))
- [ ] [Issue: Set up development environment](issue-link)
- [ ] [Issue: Define database schema](issue-link)

---

# Sprint Notes

## What Shipped This Week

What actually got completed by end of Week 6:

- [ ] Cleaned codebase with reduced technical debt
- [ ] Removed or deprecated unused features
- [ ] Documented architecture decisions
- [ ] Improved test coverage to [X]%
- [ ] Staging environment established
- [ ] API documentation updated
- [ ] UI/UX mockups finalized for Week 7
- [ ] Performance baseline established
- [x] Setup Vite for frontend environment

**Shipping Details:**

- Merged PRs: [list PR links]
- Completed issues: [list issue links (https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/issues/24)]
- Documentation added: [list links]

---

## What Broke This Week

Problems encountered and how they were resolved:

### Problem 1: [Deploying Github Pages]

**Description:** 

[Deployment to GitHub Pages kept failing, and the site was not publishing the React frontend build.]

**Root Cause:**

[The repository was still using the default Jekyll Pages workflow in jekyll-gh-pages.yml, which builds from the repo root instead of building the Vite app inside Frontend.
Also, the frontend is a SPA, so it needed GitHub Pages-compatible routing and base path settings in main.jsx and vite.config.js.]

**Resolution:**

[Replaced the Jekyll workflow in jekyll-gh-pages.yml with a Node/Vite GitHub Actions workflow that:
runs in Frontend
installs dependencies with npm ci
runs npm run build
uploads Frontend/dist and deploys via GitHub Pages actions
Set Pages source to GitHub Actions in repository settings.
Updated routing to HashRouter in main.jsx.
Set Vite base to /campusMarketPlace/ in vite.config.js.]

**PR/Issue Link:**

[[Link to PR or issue](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/pull/25)]

---

### Problem 2: [Issue Title]

**Description:** 

[Description of what went wrong]

**Root Cause:**

[Why it happened]

**Resolution:**

[How it was fixed]

**PR/Issue Link:**

[Link to PR or issue]

---

### Problem 3: [Issue Title]

**Description:** 

[Description of what went wrong]

**Root Cause:**

[Why it happened]

**Resolution:**

[How it was fixed]

**PR/Issue Link:**

[Link to PR or issue]

---

## Next Week Plan (Week 7)

What will the team work on next week?

**Week 7 Theme:** Build, Test, Rehearse

### High Priority

- [ ] Implement [Feature 1] 
  - Issue: [link]
  - Assigned to: [name]
  
- [ ] Build [Feature 2]
  - Issue: [link]
  - Assigned to: [name]
  
- [ ] Add comprehensive tests for core flows
  - Issue: [link]
  - Assigned to: [name]

### Medium Priority

- [ ] Rehearse presentation
  - Assigned to: [PM/presentation lead]
  
- [ ] Prepare demo script
  - Assigned to: [name]
  
- [ ] Create presentation deck outline
  - Assigned to: [name]

### Lower Priority

- [ ] Polish UI/UX
  - Issue: [link]
  
- [ ] Optimize performance
  - Issue: [link]

---

## Risks or Blockers

Anything that might slow down the project:

### Risk 1: [Risk Title]

**Description:** 

[What could go wrong]

**Impact:** 

High / Medium / Low

**Mitigation Plan:**

[How to prevent or handle it]

**Status:** 

Active / Resolved

---

### Risk 2: [Risk Title]

**Description:** 

[What could go wrong]

**Impact:** 

High / Medium / Low

**Mitigation Plan:**

[How to prevent or handle it]

**Status:** 

Active / Resolved

---

### Risk 3: [Risk Title]

**Description:** 

[What could go wrong]

**Impact:** 

High / Medium / Low

**Mitigation Plan:**

[How to prevent or handle it]

**Status:** 

Active / Resolved

---

### Blocker: [Blocker Title]

**Description:**

[What is blocking progress]

**Impact on Timeline:**

[When this needs resolution]

**Owner:**

[Who is working on it]

**Resolution Target:**

[When should this be resolved]

---

# Engineering Practice: Week 6

## Code Quality & Cleanup

### Implemented Practices:

- [ ] **Code Review:** All PRs require 1+ approval before merge
  - Evidence: [Link to PR review policy or example](pr-link)
  
- [ ] **Linting & Formatting:** Automated checks on all commits
  - Evidence: [Link to GitHub Actions workflow](workflow-link)
  
- [ ] **Technical Debt Reduction:** Refactored [X] components
  - Evidence: [Link to cleanup PRs](pr-links)
  
- [ ] **Documentation:** Updated [X] docs
  - Evidence: [Link to documentation](doc-links)

### Testing

- [ ] **Unit Tests:** Added tests for [X] functions
  - Evidence: [Link to test commits/PRs](test-links)
  
- [ ] **Test Coverage:** Current coverage: [X]%
  - Evidence: [Link to coverage report](coverage-link)
  
- [ ] **Integration Tests:** Set up basic integration tests
  - Evidence: [Link to test suite](test-links)

### Performance

- [ ] **Profiling:** Identified bottlenecks in [X] areas
  - Evidence: [Link to performance report or issue](perf-link)
  
- [ ] **Optimization:** Improved query performance by [X]%
  - Evidence: [Link to optimization PR](pr-link)

### Infrastructure

- [ ] **Staging Setup:** Deployed staging environment
  - URL: [staging-url]
  - Evidence: [Link to deployment PR or workflow](deploy-link)
  
- [ ] **CI/CD:** All tests pass on every commit
  - Evidence: [Link to CI workflow runs](ci-link)

---

# Individual Contribution Receipts

**Each team member must add a comment on this Issue with their receipts.**

## Contribution Guidelines

**Minimum per person for Week 6:**
- 2-3 pull requests or significant contributions
- At least 1 code review on a teammate's PR
- Documentation or technical artifact
- Active participation in team meetings

## Receipt Template


