<!--
TEMPLATE - Weekly Sprint Packet Issue

How to use this template:

1. The PM (or Scribe) creates this Issue.
2. The team fills in all sections.
3. Each student must add a comment with their receipts.
4. Everything should link to GitHub evidence when possible.

Reminder:

If it isn't linked, it didn't happen.
-->

# Weekly Sprint Packet — Week 13

## Team

**Team Name**

Campus Marketplace

**Sprint Number**

Week 13: Feature Completion — Search, Dashboard, Image Upload

**Repository**

https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace

**PM for this Sprint**

[Rai aayuska]


---

# Demo

Provide a **working demo link or short video**.

**Live Demo:** https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/

**Backend API:** https://campusmarketplace-lndr.onrender.com/api


## Demo Script

What will you show during the demo?

**Step 1:** Login and land on homepage with real listings grid
- User authenticates with JWT token
- Homepage displays all active items from MongoDB
- ItemGrid component renders with ItemCard components showing item details

**Step 2:** Use search bar and category filter to find an item
- Type in search bar to filter listings
- Select category from categories dropdown
- Results update in real-time using Browse/Search routes
- Confirm filtering works with API queries

**Step 3:** Open user dashboard — view own listings, mark one as sold
- Navigate to Dashboard route
- Display user's created items
- Click on an item and change status from "active" to "sold"
- Confirm MongoDB document updates and UI reflects change

**Step 4:** Upload an item with an image — confirm Cloudinary URL stored in MongoDB
- Go to create item form
- Upload image via Cloudinary integration
- Fill in title, description, price, category
- Submit form and verify MongoDB contains Cloudinary URL
- Confirm image displays on item card in grid


---

## Backup Plan

If the live demo fails, what will you show instead?

- Pre-loaded demo account with sample listings for search demo
- Screenshot evidence of dashboard and sold status in database
- Screenshot/video of image URL stored in MongoDB after Cloudinary upload
- Fallback to image URL text input if Cloudinary upload has issues
- Pre-recorded video showing complete user flow

---

# Project Board Snapshot

Link to your **GitHub Project board**.

https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/projects


## Sprint Goal

Complete core marketplace features:
- Full-text search with category filtering across all items
- User dashboard with ability to manage (view, edit, mark as sold) own listings
- Image upload integration with Cloudinary for product photos
- Persistent storage of all items and user data in MongoDB
- Multi-currency display (USD/KRW) and language preference support

---

## Current Board State

List the important issues in each column.

### To Do

- [ ] Final UI polish on dashboard
- [ ] Performance optimization for large image uploads
- [ ] Accessibility audit for search/filter components

### Doing

- [ ] Search endpoint and frontend integration
- [ ] Dashboard item management (edit, delete, status change)
- [ ] Cloudinary image upload configuration

### Done

- [x] Backend API routes (item CRUD, authentication, image handling)
- [x] Frontend routes (Home, Browse, Search, Dashboard, Login, Signup, Profile)
- [x] JWT authentication flow
- [x] MongoDB item and user models
- [x] Cloudinary integration and fallback local storage
- [x] ItemGrid and ItemCard display components
- [x] Navbar with auth state and navigation
- [x] API client with automatic token injection
- [x] Multi-currency support (USD/KRW)
- [x] Multi-language support with localStorage persistence

---

# Sprint Notes

## What Shipped

What actually worked by the end of the sprint?

- **Search & Filtering:** Full working search bar and category dropdown that queries MongoDB and updates ItemGrid in real-time
- **User Dashboard:** Users can view all their listings, edit item details, and change status (active/sold/removed)
- **Image Upload:** Cloudinary integration successfully stores image URLs in MongoDB; images display correctly on item cards
- **Item Management:** Create, read, update, delete operations fully functional on backend and frontend
- **Authentication:** JWT-based login/signup with secure token storage and automatic token injection in API requests
- **Item Display:** ItemGrid displays items with pagination, ItemCard shows image, title, price, category
- **Multi-currency:** Real-time currency conversion between USD and KRW with localStorage persistence
- **Multi-language:** UI supports multiple languages with localStorage persistence
- **Responsive Design:** Navbar, Footer, and layout components work across device sizes
- **Production Deployment:** Backend configured for Render.com with proper environment variable handling

---

## What Broke

Problems encountered this week.

- [Cloudinary SDK availability issue — handled with try/except for optional dependency]
- [Local image storage as fallback when Cloudinary not configured in development]
- [CORS configuration required for frontend and backend on different origins]
- [MongoDB connection string validation for production environments]

---

## Next Sprint Plan

What will the team work on next week?

- [ ] Add messaging/inbox system for buyer-seller communication
- [ ] Implement user reviews and ratings
- [ ] Add favorites/wishlist feature
- [ ] Email notification system for item sold/new message alerts
- [ ] Advanced search filters (price range, date posted, seller ratings)
- [ ] User profile customization and seller badges
- [ ] Payment integration (if required)
- [ ] Mobile responsiveness refinement

---

## Risks or Blockers

Anything that might slow down the project.

- Cloudinary quota limits if many images uploaded (monitor and budget)
- MongoDB connection timeout in production (implement retry logic)
- CORS issues if deploying to different domain (ensure FRONTEND_ORIGIN env vars set)
- Large image uploads affecting performance (implement compression and progress indicator)
- JWT token expiration edge cases (implement refresh token logic)

---

# Engineering Practice (if required this week)

Describe the engineering practice used this week.

**Practice:** Continuous Integration & Environment-Based Configuration

**Details:**
- Environment variable validation at startup (production safety checks)
- Slack detection for weak JWT secrets in production
- Multiple deployment targets support (Render.com, GitHub Pages, localhost)
- Fallback image storage strategy (Cloudinary → local disk)
- Error handling for optional dependencies (Cloudinary SDK)
- CORS configuration for multiple frontend origins

**Evidence:**

- Production secret validation in app.py (lines 44-57)
- Multi-environment support in api.js for GitHub Pages and Render.com
- Cloudinary config with error handling (app.py lines 82-87)
- Environment variable fallbacks and defaults throughout codebase

---

# Individual Contribution Receipts

Each team member must **add a comment on this Issue** with their receipts.

Minimum: 2-3 links

Examples of receipts:

- Pull Request
- Issue completed
- commit
- code review comment
- documentation change
- CI run
- screenshot of working feature

---

## Example Receipt Comment

Each student should post a comment like this:

```text
**[Student Name]**

Contribution Receipts

PR:
https://github.com/org/repo/pull/XX

Issues completed:
- https://github.com/org/repo/issues/XX
- https://github.com/org/repo/issues/YY

Code Review:
https://github.com/org/repo/pull/ZZ#discussion

Implementation Evidence:
- [link to commit or file changes related to search feature]
- [link to commit or file changes related to dashboard]
- [link to commit or file changes related to image upload]
```

---

# Definition of Done (Quick Check)

Confirm that:

- [ ] Demo works or has backup
- [ ] Project board is updated
- [ ] Sprint notes are written
- [ ] Each member posted receipts
- [ ] Links are working
- [ ] All CRUD operations tested
- [ ] UI/UX passes basic usability check
- [ ] No console errors in browser DevTools
- [ ] Backend API endpoints respond correctly
- [ ] Images upload and display correctly

---

# Instructor Notes (leave blank)

Comments:

Suggestions:
