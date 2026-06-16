# Individual Portfolio — Gayatri Kumari Bhandari

## 1. My Role

- **Name:** Gayatri Kumari Bhandari
- **Team:** Campus Marketplace
- **Project:** Campus MarketPlace 
- **Responsibilities:** Full-stack development (frontend & backend), database architecture, deployment, image management
- **Roles held:** Full-stack Developer, DevOps Engineer

## 2. My Strongest Contributions

| Contribution | What I did | Evidence |
|---|---|---|
| **Full-stack Architecture Setup** | Designed and implemented the entire tech stack combining React + Vite frontend with Flask + MongoDB backend, configured environment variables and deployment pipeline | [app.py](../../app.py), [Frontend/vite.config.js](../../Frontend/vite.config.js), [Architecture sketch](../../docs/Architecture_sketch.md), [Setup and run guide](../04-final-product/SETUP_AND_RUN_GUIDE.md) |
| **MongoDB Database Integration & API Endpoints** | Built complete backend API infrastructure with user authentication (JWT), avatar uploads, profile endpoints, message threading, item marketplace endpoints, and OTP system | [app.py](../../app.py), [models/item.py](../../models/item.py), [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py), [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md) |
| **Cloudinary Image Integration** | Implemented image upload and management using Cloudinary for marketplace items and user avatars, handling 5MB file size limits | [app.py](../../app.py), [README.md](../../README.md), [Week 9 sprint packet](../../docs/Sprint_Packet/Week_9/Weekly%20Sprint%20Packet%20-%20Week9.md), [QA report](../05-qa-and-stabilization/QA_REPORT.md) |
| **Render Deployment & Hosting** | Successfully deployed the complete application on Render platform with Flask backend and MongoDB Atlas cloud database configuration | [Deployment and demo plan](../04-final-product/DEPLOYMENT_AND_DEMO_PLAN.md), [Final MVP demo](../04-final-product/FINAL_MVP_DEMO.md), [Live demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) |
| **Frontend UI/UX Polish & Typography** | Enhanced user interface with improved typography system (Inter + Plus Jakarta Sans), dark mode support, accessibility improvements, and responsive design refinements | [Frontend/src/assets/styles/global.css](../../Frontend/src/assets/styles/global.css), [Frontend/src/App.jsx](../../Frontend/src/App.jsx), [Browse route](../../Frontend/src/routes/Browse.jsx), [Edit profile route](../../Frontend/src/routes/EditProfile.jsx) |

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
- **Evidence:** [app.py](../../app.py), [models/item.py](../../models/item.py), [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py), [Profile route](../../Frontend/src/routes/Profile.jsx), [Edit profile route](../../Frontend/src/routes/EditProfile.jsx), [Messages route](../../Frontend/src/routes/Messages.jsx), [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md)

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

1. [app.py](../../app.py) - Core Flask backend with auth, profiles, items, messages, and upload routes
2. [models/item.py](../../models/item.py) - Marketplace data model and schema structure
3. [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py) - Automated checks for profile endpoints
4. [Frontend/src/App.jsx](../../Frontend/src/App.jsx) - Frontend routing and application shell
5. [Frontend/src/routes/Browse.jsx](../../Frontend/src/routes/Browse.jsx) - Item discovery and listing flow
6. [Frontend/src/routes/Profile.jsx](../../Frontend/src/routes/Profile.jsx) - Profile display and user data flow
7. [Frontend/src/routes/EditProfile.jsx](../../Frontend/src/routes/EditProfile.jsx) - Profile editing and demo payment methods
8. [Frontend/src/routes/Messages.jsx](../../Frontend/src/routes/Messages.jsx) - Messaging UI and threading surface
9. [Frontend/src/assets/styles/global.css](../../Frontend/src/assets/styles/global.css) - Typography, dark mode, and responsive polish
10. [docs/PROJECTPITCH.md](../../docs/PROJECTPITCH.md), [docs/PROJECT_1.md](../../docs/PROJECT_1.md), [docs/USERSTORIES.md](../../docs/USERSTORIES.md), [docs/WIREFRAME.md](../../docs/WIREFRAME.md) - Planning and scope evidence
11. [docs/Architecture_sketch.md](../../docs/Architecture_sketch.md), [docs/Design Doc v1.md](../../docs/Design%20Doc%20v1.md) - System design evidence
12. [docs/Sprint_Packet/Week_9/AI Code Ownership Audit.md](../../docs/Sprint_Packet/Week_9/AI%20Code%20Ownership%20Audit.md), [docs/Sprint_Packet/Week_11/Weekly Sprint Packet - Week11.md](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md), [docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md](../../docs/Sprint_Packet/Week_12/Weekly_Sprint_Packet_Week12.md), [docs/Sprint_Packet/Week_13/Weekly Sprint Packet - Week13.md](../../docs/Sprint_Packet/Week_13/Weekly%20Sprint%20Packet%20-%20Week13.md) - Ownership and MVP verification trail
13. [portfolio/04-final-product/FINAL_MVP_DEMO.md](../04-final-product/FINAL_MVP_DEMO.md), [portfolio/04-final-product/DEPLOYMENT_AND_DEMO_PLAN.md](../04-final-product/DEPLOYMENT_AND_DEMO_PLAN.md), [portfolio/04-final-product/SETUP_AND_RUN_GUIDE.md](../04-final-product/SETUP_AND_RUN_GUIDE.md), [portfolio/05-qa-and-stabilization/QA_REPORT.md](../05-qa-and-stabilization/QA_REPORT.md), [portfolio/07-final-presentation/FINAL_PRESENTATION_SCRIPT.md](../07-final-presentation/FINAL_PRESENTATION_SCRIPT.md) - Delivery and demo artifacts
14. [portfolio/06-ai-and-code-ownership/AI_CODE_OWNERSHIP_AUDIT.md](../06-ai-and-code-ownership/AI_CODE_OWNERSHIP_AUDIT.md), [portfolio/06-ai-and-code-ownership/AI_USE_SUMMARY.md](../06-ai-and-code-ownership/AI_USE_SUMMARY.md) - Human-reviewed AI use and code ownership record
15. [Live deployed application](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/) - Working product in production

## 8. Additional Evidence Index

If you need a fast walkthrough of my work by area, these are the strongest evidence anchors:

- Backend and auth: [app.py](../../app.py), [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py), [Week 11 sprint packet](../../docs/Sprint_Packet/Week_11/Weekly%20Sprint%20Packet%20-%20Week11.md)
- Data model and schema: [models/item.py](../../models/item.py), [docs/Architecture_sketch.md](../../docs/Architecture_sketch.md), [portfolio/04-final-product/ARCHITECTURE_FINAL.md](../04-final-product/ARCHITECTURE_FINAL.md)
- Frontend work: [Frontend/src/App.jsx](../../Frontend/src/App.jsx), [Frontend/src/routes/Browse.jsx](../../Frontend/src/routes/Browse.jsx), [Frontend/src/routes/Profile.jsx](../../Frontend/src/routes/Profile.jsx), [Frontend/src/routes/EditProfile.jsx](../../Frontend/src/routes/EditProfile.jsx), [Frontend/src/assets/styles/global.css](../../Frontend/src/assets/styles/global.css)
- Deployment and demo: [portfolio/04-final-product/DEPLOYMENT_AND_DEMO_PLAN.md](../04-final-product/DEPLOYMENT_AND_DEMO_PLAN.md), [portfolio/04-final-product/FINAL_MVP_DEMO.md](../04-final-product/FINAL_MVP_DEMO.md), [README.md](../../README.md), [Live demo](https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)
- QA and ownership proof: [portfolio/05-qa-and-stabilization/QA_REPORT.md](../05-qa-and-stabilization/QA_REPORT.md), [docs/Sprint_Packet/Week_9/AI Code Ownership Audit.md](../../docs/Sprint_Packet/Week_9/AI%20Code%20Ownership%20Audit.md), [portfolio/06-ai-and-code-ownership/AI_CODE_OWNERSHIP_AUDIT.md](../06-ai-and-code-ownership/AI_CODE_OWNERSHIP_AUDIT.md)
