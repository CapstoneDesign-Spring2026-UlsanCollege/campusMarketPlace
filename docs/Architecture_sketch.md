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
- main screens:(html, css and javascript)
Login page
Home / marketplace page
Item listing page

- key actions:
Login
Create item
View items


**Backend / Logic**
- main responsibilities:(python + flask)
  - Handle API requests  
  - Authenticate users  
  - Process item listings  
  - Handle item requests (buy/interest requests)
  - Manage image upload references  
- validation / rules:
  - Check login credentials  
  - Validate form inputs  
  - Ensure images are linked to items  


**Database / Storage**
- main data stored:(MongoDB, Cloudinary)
  - Users (email, password, name)
  - Items (title, price, description)
  - Item Images (image URL / file reference)
  - Item Requests (buyer requests, status)

**Other service (if needed)**
- service:(none for now)
- purpose:

### Simple text version
```md
[Frontend]
  -> sends requests to [Backend]
  -> uploads images and submits forms

[Backend]
  -> handles logic and validation
  -> processes login, items, and requests
  -> stores data in [Database]
  -> stores image references (or connects to storage)

[Database]
  -> stores users, items, image links, and item requests
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
