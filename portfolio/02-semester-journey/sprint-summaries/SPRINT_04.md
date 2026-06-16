# Sprint 04 Summary

## Goal

Complete the marketplace loop and prepare for final submission with listings UI, OTP email, tests, search, dashboard, images, and final documentation.

## Planned Work

- Browse UI connected to real backend data
- OTP email sending with SendGrid/SMTP
- Pytest smoke tests
- Cloudinary image upload
- Search and category filtering
- Dashboard item management
- Final UI polish and deployment verification

## Completed Work

- Final code contains item CRUD, search/browse routes, dashboard, profile/avatar support, favorites, seller reviews, messaging endpoints, image upload support, dark mode, language/currency support, and deployment configuration notes.
- Week 13 packet records many final feature completions.

## Incomplete Work

- Formal sprint packet evidence is incomplete for Weeks 14-16.
- Tests need additional setup before they are executable in CI.
- OTP and Cloudinary require external environment configuration.

## Major Scope Changes

- Payment, recommendation engine, native mobile app, and cross-campus expansion remained out of scope.

## Strongest Evidence

- [SPRINT_4.md](../../../docs/Sprint_Packet/SPRINT_4.md)
- [Week 12](../weekly-sprints/WEEK_12.md)
- [Week 13](../weekly-sprints/WEEK_13.md)
- [app.py](../../../app.py)
- [Frontend/src](../../../Frontend/src)

## Bugs or Risks

- Email provider, Cloudinary, MongoDB, and Render/GitHub Pages deployment rely on environment variables and external services.

## Moved Into Final Sprint

- Final docs, QA summary, backup demo plan, technical defense prep, and link cleanup.
