# Architecture Sketch — CampusMarketplace

---

## 1) Architecture summary

**System name:** 
CampusMarketplace

**Main users:** 
- Students (buyers/sellers) 

**Main job of the system:** 
Allow students to buy, sell, and manage items within a campus marketplace.

---

## 2) Context view

### Fill this in

**Users**
- Student: logs in, creates listings, browses items 

**Main system**
- CampusMarketplace Web Application

**External services / systems**
- Database (MongoDB) 
- Authentication handling (inside backend for now)

---

### Simple text version

```md
[Student] ---> [CampusMarketplace Web App] ---> [Database]

```

### Notes
- Students log in, view items, and create listings
- Database stores users, items, and login data

---

## 3) Container view

**Frontend / UI**
- main screens:
Login page
Home / marketplace page
Item listing page

- key actions:
Login
Create item
View items


**Backend / Logic**
- main responsibilities:
Handle API requests
Authenticate users
Process item listings

- validation / rules:
Check login credentials
Validate form inputs
Handle errors


**Database / Storage**
- main data stored:
Users (email, password, name)
Items (title, price, description)
Listings


**Other service (if needed)**
- service:(none for now)
- purpose:

### Simple text version
```md
[Frontend]
 -> sends requests to [Backend]
 -> displays responses to users


[Backend]
 -> handles logic and validation
 -> processes login and item actions
 -> stores data in [Database]


[Database]
 -> stores users, items, and listings
```

---

## 4) Sprint 1 focus
**What part are we actually building first?**
- User login system (frontend + backend + basic database)


**What is out of scope for now?**
- Full marketplace features
- Messaging system
- Payment system
- Mobile App feature


---

## 5) Quality check
- [ ] users are visible
- [ ] the system is visible
- [ ] major internal parts are visible
- [ ] external dependencies are visible
- [ ] the diagram matches our MVP
- [ ] the diagram matches our wireframes
- [ ] the diagram is small enough to explain in 30 seconds

---
