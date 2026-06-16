# Individual Portfolio — Gayatri Kumari Bhandari

## 1. My Role

- **Name:** Gayatri Kumari Bhandari
- **Team:** CapstoneDesign-Spring2026-UlsanCollege
- **Project:** Campus MarketPlace - A campus-only buying and selling platform for Ulsan College students
- **Responsibilities:** Full-stack development (frontend & backend), database architecture, deployment, image management
- **Roles held:** Full-stack Developer, DevOps Engineer

## 2. My Strongest Contributions

| Contribution | What I did | Evidence |
|---|---|---|
| **Full-stack Architecture Setup** | Designed and implemented the entire tech stack combining React + Vite frontend with Flask + MongoDB backend, configured environment variables and deployment pipeline | [App.py backend initialization](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/f4e45a8), [Frontend configuration](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/Frontend/vite.config.js) |
| **MongoDB Database Integration & API Endpoints** | Built complete backend API infrastructure with user authentication (JWT), avatar uploads, profile endpoints, message threading, item marketplace endpoints, and OTP system | [User endpoints](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commits?author=bhandari&grep=endpoint), [Avatar upload](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/05ad302) |
| **Cloudinary Image Integration** | Implemented image upload and management using Cloudinary for marketplace items and user avatars, handling 5MB file size limits | [Upload configuration](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/24f4d11), [Avatar endpoint](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/05ad302) |
| **Render Deployment & Hosting** | Successfully deployed the complete application on Render platform with Flask backend and MongoDB Atlas cloud database configuration | [Live Demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) |
| **Frontend UI/UX Polish & Typography** | Enhanced user interface with improved typography system (Inter + Plus Jakarta Sans), dark mode support, accessibility improvements, and responsive design refinements | [Font improvements](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/366abcd), [Dark mode implementation](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/7b196f4) |

## 3. One Area I Can Explain Clearly

- **Area:** MongoDB Database Schema Design & Flask API Endpoints for E-Commerce Platform
- **What it does:** Manages all user data (profiles, authentication), marketplace listings, messages, and image references in a NoSQL database structure, with REST API endpoints for the React frontend to communicate securely
- **How it works:** 
  - Users register with email validation (OTP), store hashed passwords and JWT tokens
  - Items are stored with seller references, images (Cloudinary URLs), pricing, and category tags
  - Messages use thread-based structure for user-to-user communication
  - All endpoints require authentication middleware to verify JWT tokens
  - Images are uploaded to Cloudinary (not stored in database), only URLs stored in MongoDB
- **How it was tested:** 
  - Tested signup/login flow with real SendGrid OTP delivery
  - Verified API responses through Postman
  - Tested image upload size limits and Cloudinary integration
  - Validated JWT token authentication on protected endpoints
- **Evidence:** [Test profile endpoints](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/tests/test_profile_endpoints.py), [App.py with all endpoints](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/app.py)

## 4. My AI Use

- **Tools used:** GitHub Copilot, Claude, ChatGPT
- **What AI helped with:** 
  - Generating Flask endpoint boilerplate and error handling
  - MongoDB query optimization and schema suggestions
  - React component structure and hooks patterns
  - CSS refinements for dark mode and accessibility
  - Debugging JWT token implementation
  - Writing test cases and validation logic
- **What I checked or changed:** 
  - Verified all database queries work correctly with actual MongoDB
  - Tested authentication flow end-to-end
  - Modified AI-generated code to fit project architecture
  - Adjusted CSS generated suggestions for brand colors and design system
  - Validated that endpoints handle edge cases (missing fields, file size limits, etc.)
- **How I verified it:** 
  - Ran local server and tested in browser
  - Used console logs to trace data flow
  - Tested with invalid inputs to ensure error handling
  - Deployed to Render and verified live functionality
  - Code review with team before merging to main
- **One thing I still do not understand:** 
  - Deep optimization of MongoDB queries for large-scale datasets (e.g., indexing strategies for 100K+ users and millions of items)

## 5. One Problem I Helped Solve

- **Problem:** Users couldn't upload profile avatars and marketplace items needed to display images efficiently without storing them on the server
- **Solution:** Integrated Cloudinary as an external image hosting service with Flask backend endpoints that handle file upload, validation (5MB limit), and URL storage in MongoDB. Created React components to display images directly from Cloudinary CDN
- **Impact:** Reduced server storage costs, improved image load times with CDN, enabled rich media marketplace experience

## 6. Reflection

### What I learned

- How to design scalable NoSQL databases vs traditional SQL (MongoDB flexibility for marketplace data)
- Full deployment pipeline: local development → environment configuration → Render hosting → MongoDB Atlas
- Frontend-backend integration patterns and REST API design principles
- Managing authentication and security (JWT tokens, OTP validation, password hashing)
- The importance of accessibility and design systems (typography, dark mode, color contrast)

### What I am proud of

- Successfully shipped a complete full-stack application from zero to live in production
- Built a robust authentication system that handles email validation and secure token management
- Implemented a professional UI with cohesive typography system and dark mode
- Created clean, well-documented API endpoints that the frontend team could work with confidently
- Solved real problems (image storage, deployment complexity) with elegant solutions

### What I should have done better

- Spent more time on database indexing and query optimization earlier in the project
- Implemented more comprehensive API testing (unit tests) instead of just manual testing
- Created better error handling and validation messages for API responses
- Documented the database schema more thoroughly for team knowledge sharing
- Set up monitoring/logging on Render earlier to catch production issues faster

### What I would improve next

- Add caching layer (Redis) to reduce database queries for frequently accessed data
- Implement API rate limiting to prevent abuse
- Add comprehensive logging and error tracking (Sentry or similar)
- Create database migrations system for schema versioning
- Set up automated testing pipeline in CI/CD workflow

### One skill I want to keep developing

- Backend API optimization and database performance tuning (query optimization, indexing strategies, load testing)

## 7. Best Evidence Links

1. [Font & Typography Improvements](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/commit/366abcd) - Shows recent UI polish work
2. [Flask App.py with Core API Endpoints](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/app.py) - Complete backend implementation
3. [MongoDB Integration & User Model](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/models/item.py) - Data architecture
4. [Frontend React App Structure](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace/blob/main/Frontend/src/App.jsx) - Frontend routing and state management
5. [Live Deployed Application](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) - Working product in production
