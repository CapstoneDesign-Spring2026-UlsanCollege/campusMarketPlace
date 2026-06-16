# Final Presentation Script

Maximum time: 15 minutes.

## 1. Project Story - 2 minutes

CampusMarketplace solves a simple campus problem: students need a safer, more relevant way to buy and sell items with other students. General marketplaces are too broad, and group chats are hard to search or trust. Our solution is a campus-focused marketplace for Ulsan College students, centered on campus email verification and student-to-student exchange.

## 2. Live MVP Demo - 5 minutes

Demo path:

1. Open the frontend.
2. Show signup/login with campus email rule.
3. Browse marketplace listings.
4. Use search or category browsing.
5. Open an item detail page.
6. Show seller/profile information.
7. Create or update a listing from the authenticated flow.
8. Mention image upload and OTP requirements if external services are not configured live.

## 3. Semester Journey - 2 minutes

The project started with pitch, team agreement, user stories, wireframes, and architecture planning. Around midterm, the team focused on proving a smaller deployed frontend and auth story. In Sprint 3, the work shifted to MVP verification: JWT login, verification gate, item endpoints, and real API calls. In Sprint 4 and the final weeks, the product gained search, dashboard, image support, profiles, reviews, messaging endpoints, dark mode, and final polish.

## 4. QA and Engineering Evidence - 2 minutes

Show the QA report and explain that the team has manual test notes, endpoint-level integration test drafts, and sprint packets documenting bugs and risks. Be honest: the test suite needs a missing fixture before it becomes strong CI evidence, and frontend tests are still placeholder-level.

## 5. AI Use and Code Ownership - 1 minute

AI tools helped with suggestions, boilerplate, debugging, and documentation structure. The team reviewed and adapted the work for the real campus marketplace. AI-assisted code only counts where the team can explain and run it.

## 6. Technical Defense - 3 minutes

Be ready to answer:

- Why React + Vite?
- Why Flask + MongoDB?
- How does JWT login work?
- How do item ownership checks work?
- What happens if email, Cloudinary, or deployment services fail?
- What would be improved next?

## Closing

CampusMarketplace is not mystery code. It has a visible repo, final docs, linked evidence, known limitations, and a clear demo path.
