WEEKLY SPRINT PACKET(Week 5)

Weekly Sprint Packet Team Team Name
CampusMarketplace

Sprint Number
Sprint 4

Repository
https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace.git

PM for this Sprint
Sudarshan Rai

Demo
Working demo via localhost (python app.py) or short recorded video

Demo Script
Step 1: Open /register page
Step 2: Enter valid campus email + password
Step 3: Submit form
Step 4: Show user saved in database (MongoDB)

Backup Plan
Recorded demo video
Screenshots:
Signup page
Successful signup message
MongoDB saved data
GitHub PRs as proof

Project Board Snapshot
https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15

Sprint Goal
 Build a simple and fast sign-up system
✔ Signup page loads
✔ Campus email validation works
✔ Valid signup saves user successfully in DB

 TASK BREAKDOWN (WITH OWNERS + PR SLICES)

 Issue 1: Signup Page UI
Owner: Aayuska (Frontend)
Tasks:
Create register.html
Add form fields:
Name
Email
Password
Add submit button
 Definition of Done:
Page loads at /register
Form is visible and styled
Inputs accept user data
PR merged to main

 Issue 2: Campus Email Validation
Owner: Ananda (QA + Validation)
Tasks:
Validate email format:
Must include campus domain (e.g. @college.edu)
Show error if invalid
 Definition of Done:
Invalid emails rejected
Error message shown
Valid campus email accepted
PR merged with test cases

 Issue 3: MongoDB Connection
Owner: Gayatri (Database)
Tasks:
Setup cluster in MongoDB Atlas
Create db.py
Connect using PyMongo
 Definition of Done:
Database connects successfully
test_db.py runs without error
Can insert test user
PR merged

 Issue 4: Signup Backend Logic
Owner: Sudarshan (Backend)
Tasks:
Create /register route
Receive form data
Hash password
Save to DB
 Definition of Done:
Data received from form
Password hashed
User stored in MongoDB
No crash/errors
PR merged

 Issue 5: Integration + Testing
Owner: Sagar (PM support + Integration)
Tasks:
Connect frontend + backend
Test full signup flow

Definition of Done:
Signup → DB works end-to-end
No errors
Tested with multiple inputs
PR merged

 PR STRATEGY (VERY IMPORTANT)
One clean PR per issue:
PR 1 → Signup UI
PR 2 → Email validation
PR 3 → DB setup
PR 4 → Backend logic
PR 5 → Integration
✔ Each PR:
Small
Reviewed
Linked to issue

 Current Board State
To Do
Signup UI
Email validation
Doing
MongoDB setup
Backend route
Done
Flask setup
Project structure

 Sprint Notes
 What Shipped
Signup page UI created
MongoDB connected
Users can register successfully

 What Broke
MongoDB auth errors
Email validation bugs
Integration delays

 Next Sprint Plan
Login system
Session management
Navbar update

 Risks or Blockers
MongoDB setup confusion
Password hashing errors
Team unfamiliar with Flask

 Engineering Practice
Practice: Issue-Driven Development (Issue → Branch → PR → Review)
Evidence:
PR links
Issue tracking
GitHub commits

 Individual Contribution Receipts
Each member must post:
PR link
Issue link
Review/comment

 Definition of Done (Quick Check)
✔ Signup works end-to-end
✔ Data saved in DB
✔ Board updated
✔ PRs merged
✔ Demo ready

 Instructor Notes
(Leave blank)

