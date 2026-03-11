# PROJECT.md - Capstone Design Project Overview

This document explains what our team is building and why it matters.

---

## Team Information

**Team Name:** Campusmarket Place
**Repository:** https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace.gitgit

### Team Members

| Name | Role Rotation (First Week) |
|---|---|
| Aayushka Rai | Frontend Lead — HTML/CSS page layouts, responsive design |
| Gayatri K. Bhandari | Frontend + UX — JavaScript interactivity, form validation, search/filter |
| Sudarshan Rai | Backend Lead — Flask routes, authentication, session management, image uploads |
| Aananda Tamang | Database + Backend — Schema design, SQL queries, data models, seed data |
| Sagar Sob | Integration + QA — Testing, GitHub management, documentation, connecting frontend to backend |

---

## Project Title

**CampusMarketPlace** — A Campus Buy-and-Sell Platform for University Students

---

## Problem Statement

University students regularly accumulate items they no longer need — textbooks from completed courses, electronics they've upgraded from, furniture at the end of a lease — but have no centralized, trusted way to sell them within their campus community. Existing platforms like Facebook Marketplace or Craigslist are open to the general public, making transactions less safe and less convenient for students who simply want to trade with people on the same campus. Students end up either throwing away usable items or spending too much time coordinating sales through scattered group chats and bulletin boards.

---

## Target Users

- **University students** who want to sell items they no longer need (textbooks, electronics, furniture, clothing, dorm supplies)
- **University students** who want to buy affordable, secondhand items from peers on the same campus
- **University administrators** (optional) who may moderate listings to keep the platform safe and appropriate

---

## Project Goal

The system will provide a web-based marketplace scoped to a single university campus where students can create an account, post items for sale with images and descriptions, and browse/search/filter available listings by category, price, and condition. Buyers can view listing details and contact sellers directly. Each user will have a personal dashboard to manage their own active listings, mark items as sold, and edit or remove posts.

---

## Core Features (First Version)

1. **User Registration & Login** — Students can create an account with a username, email, and password (hashed), log in, and log out with persistent sessions.
2. **Create Listing** — Logged-in users can post an item for sale with a title, description, price, category, item condition, and an uploaded image.
3. **Browse & View Listings** — All visitors can see a grid of available listings and click into a detail page showing full information and seller contact.
4. **Search & Filter** — Users can search listings by keyword and filter by category (Textbooks, Electronics, Furniture, Clothing, Other), price range, and condition (New, Like New, Good, Fair).
5. **User Dashboard** — Each user has a dashboard to view, edit, mark as sold, or delete their own listings.

---

## Demo Scenario (Very Important)

**Step 1:** A new student (Buyer) opens the CampusMarketPlace homepage in a browser and sees a grid of available listings. They click "Register," create an account, and are redirected to the login page. They log in successfully and see a welcome message.

**Step 2:** A different student (Seller) is already logged in. They click "Post Item," fill out the form with a used textbook's title, description, price ($25), select category "Textbooks" and condition "Good," upload a photo of the book, and submit. The listing immediately appears on the homepage.

**Step 3:** The Buyer uses the search bar to type "textbook," selects the "Textbooks" category filter, and sets a max price of $30. The search results show the Seller's listing. The Buyer clicks on it and sees the full detail page with the image, description, price, condition, and the Seller's contact information.

**Step 4:** The Seller goes to their Dashboard, sees their posted textbook, and after completing the sale in person, clicks "Mark as Sold." The listing disappears from the public browse page. The Seller can also edit or delete the listing from this dashboard.

---

## Minimum Viable Product (MVP)

The MVP will allow a user to register, log in, post a listing with an image, and browse all active listings on a homepage grid. Search by keyword and a single listing detail page will also be functional. No messaging, no filters, no admin panel — just the core loop of post, browse, and view. The app must run without crashing, load on mobile, and handle basic form validation.

---

## Stretch Goals (Optional)

- In-app messaging between buyer and seller (so students don't have to share personal contact info publicly)
- Email verification on registration to confirm real university email addresses (.edu)
- Sort listings by price (low to high, high to low) and by date posted (newest first)
- Admin panel for moderating listings (delete inappropriate posts, ban users)
- Wishlist/save-for-later feature so buyers can bookmark items
- Image compression on upload to keep storage manageable
- Dark mode toggle

---

## Technology Stack

| Area | Tool |
|---|---|
| Frontend | HTML + CSS + JavaScript (Bootstrap 5 for responsive layout) |
| Backend | Python (Flask) with Jinja2 templating |
| Database | SQLite (development) — upgrade to PostgreSQL for production if needed |
| Hosting | PythonAnywhere (free tier, Flask-friendly) or Render |

---

## Project Scope Rules

To keep the project realistic:
- Start with the MVP (register, login, post, browse) before adding search/filter
- Add one feature per sprint — don't try to build everything in one week
- Focus on working software over perfect software

We will **avoid**:
- Building a mobile app (responsive web is sufficient)
- Implementing a payment system (transactions happen in person on campus)
- Adding real-time chat (contact info display is the MVP approach)
- Any feature that requires external API keys or paid services

A good project is:

```
Demoable  ✓  (clear 4-step demo scenario defined above)
Feasible  ✓  (HTML/CSS/JS + Flask + SQLite, all free, all beginner-friendly)
Well-scoped  ✓  (5 core features, 8-week timeline, clear role assignments)
```

---

## Weekly Development Process

Our team will work in weekly sprints following this cycle:

```
Idea
  ↓
Issue (create on GitHub with description + acceptance criteria)
  ↓
Branch (feature/branch-name from dev)
  ↓
Pull Request (at least 1 reviewer before merge)
  ↓
Merge (into dev branch only)
  ↓
Demo (show working feature in weekly standup)
```

Each week ends with a Sprint Packet submission.

**Sprint Schedule:**

| Week | Phase | Focus |
|---|---|---|
| 1–2 | Setup & Foundation | Repo, folder structure, Flask hello world, base template, database schema |
| 3–5 | Core Features | Registration, login, create listing, browse listings, detail page |
| 5–6 | Search & Polish | Search bar, category/price/condition filters, dashboard, responsive design |
| 7–8 | Testing & Deployment | End-to-end testing, bug fixes, README, demo preparation, final merge |

---

## Project Evolution

This document will be updated when:
- The scope changes (features added or dropped)
- New features are added beyond the original core 5
- The demo scenario evolves based on what's actually built
- Technology decisions change (e.g., switching from SQLite to PostgreSQL)

All changes will be tracked via Git commits with clear messages (e.g., `docs: update PROJECT.md — dropped messaging, added wishlist to stretch goals`).

---

## What a Good Project Looks Like

Strong projects usually:
- Solve a clear problem ✓ *(students need a campus-scoped marketplace)*
- Have a simple demo ✓ *(register → post → search → view — 4 clean steps)*
- Grow gradually ✓ *(MVP first, then search, then stretch goals)*
- Focus on reliability ✓ *(hashed passwords, parameterized queries, input validation)*
- Maintain clear documentation ✓ *(this document + README + GitHub Issues)*

**The goal is not to build something huge. The goal is to build something that works, is demoable, and shows we understand the full development cycle.**
