# Sprint 4, Week 5: Build Signup End-to-End

## Team

**Team Name**

[CampusMarketplace]

**Sprint Number**

[Sprint 4]

**Repository**

[CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace)

**PM for this Week**

[Sudarshan Rai]

**Week Duration**

[Week 5]

---

# Sprint 4 Focus

## Sprint Goal

Build a simple and fast signup system.

**Key Objectives:**
- [x] Signup page loads correctly
- [x] Campus email validation works
- [x] Valid signup saves user successfully in MongoDB

---

# Demo

**Status:** Working demo via localhost (python app.py) or short recorded video

## Demo Script

**Step 1:** Open the register page

**Step 2:** Enter valid campus email and password

**Step 3:** Submit the form

**Step 4:** Show saved user in MongoDB

## Backup Plan

- [x] Recorded demo video
- [x] Screenshots of signup page
- [x] Screenshot of successful signup message
- [x] Screenshot/proof of MongoDB saved data
- [x] GitHub PR links as evidence

---

# Project Board Snapshot

**GitHub Project Board:**

[Sprint Board](https://github.com/orgs/CapstoneDesign-Spring2026-UlsanCollege/projects/15)

## Sprint Goal Statement

Deliver the full signup flow with UI, validation, backend logic, database integration, and testing.

---

## Task Breakdown (Owners + PR Slices)

### Issue 1: Signup Page UI

**Owner:** Aayuska (Frontend)

**Tasks:**
- Create register page
- Add form fields: name, email, password
- Add submit button

**Definition of Done:**
- Page loads at register route
- Form is visible and styled
- Inputs accept user data
- PR merged to main

### Issue 2: Campus Email Validation

**Owner:** Ananda (QA + Validation)

**Tasks:**
- Validate email format
- Allow only campus domain emails
- Show error for invalid emails

**Definition of Done:**
- Invalid emails rejected
- Error message shown
- Valid campus email accepted
- PR merged with test cases

### Issue 3: MongoDB Connection

**Owner:** Gayatri (Database)

**Tasks:**
- Set up MongoDB Atlas cluster
- Connect using PyMongo
- Verify insert/read path

**Definition of Done:**
- Database connects successfully
- Test script runs without error
- Can insert test user
- PR merged

### Issue 4: Signup Backend Logic

**Owner:** Sudarshan (Backend)

**Tasks:**
- Create signup route
- Receive form data
- Hash password
- Save user to database

**Definition of Done:**
- Data received from form
- Password hashed
- User stored in MongoDB
- No crashes or runtime errors
- PR merged

### Issue 5: Integration + Testing

**Owner:** Sagar (PM support + Integration)

**Tasks:**
- Connect frontend and backend
- Test full signup flow

**Definition of Done:**
- Signup to DB works end-to-end
- No blocking errors
- Tested with multiple inputs
- PR merged

---

## PR Strategy

One clean PR per issue:
- PR 1: Signup UI
- PR 2: Email validation
- PR 3: DB setup
- PR 4: Backend logic
- PR 5: Integration

Each PR must be:
- Small
- Reviewed
- Linked to issue

---

## Current Board State

### To Do

- [ ] Signup UI
- [ ] Email validation

### Doing

- [ ] MongoDB setup
- [ ] Backend route

### Done

- [x] Flask setup
- [x] Project structure

---

# Sprint Notes

## What Shipped This Week

- [x] Signup page UI created
- [x] MongoDB connected
- [x] Users can register successfully

## What Broke This Week

### Problem 1: MongoDB Authentication Errors

**Description:**

Authentication failed during Atlas connection.

**Root Cause:**

Incorrect credentials and network access configuration.

**Resolution:**

Updated connection string and allowlist configuration.

### Problem 2: Email Validation Bugs

**Description:**

Some invalid emails were accepted unexpectedly.

**Root Cause:**

Validation edge cases were not fully covered.

**Resolution:**

Added stricter validation checks and tests.

### Problem 3: Integration Delays

**Description:**

Frontend-backend connection took longer than planned.

**Root Cause:**

Sequencing and dependency coordination across tasks.

**Resolution:**

Focused integration pass and task handoff cleanup.

---

## Next Week Plan (Week 6)

**Week 6 Theme:** Define, Clean Up, Harden

### High Priority

- [ ] Implement login system
- [ ] Add session management
- [ ] Update navbar for authenticated users

### Medium Priority

- [ ] Improve validation and error handling
- [ ] Refactor shared auth logic

### Lower Priority

- [ ] UI polish
- [ ] Documentation cleanup

---

## Risks or Blockers

### Risk 1: MongoDB Setup Confusion

**Impact:** Medium

**Mitigation Plan:** Share a single documented setup guide.

**Status:** Active

### Risk 2: Password Hashing Errors

**Impact:** High

**Mitigation Plan:** Add tests for hash/verify flow.

**Status:** Active

### Risk 3: Team Unfamiliar with Flask

**Impact:** Medium

**Mitigation Plan:** Pair programming and code walkthrough sessions.

**Status:** Active

---

# Engineering Practice: Week 5

## Practice Used

Issue-driven development (Issue -> Branch -> PR -> Review)

**Evidence:**
- PR links
- Issue tracking
- GitHub commit history

---

# Individual Contribution Receipts

Each member should post:
- PR link
- Issue link
- Review/comment link

---

# Definition of Done (Quick Check)

- [x] Signup works end-to-end
- [x] Data saved in database
- [x] Board updated
- [x] PRs merged
- [x] Demo ready

---

# Instructor Notes

(Leave blank)

