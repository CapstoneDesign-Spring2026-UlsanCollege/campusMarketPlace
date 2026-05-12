
## Campus Marketplace

Campus Marketplace is a campus-only buying and selling platform built for Ulsan College students. It lets verified users create accounts with their school email, sign in securely, and browse a shared marketplace experience designed for student-to-student trading.

The project combines a React + Vite frontend with a Flask + MongoDB backend. Current features include a validated signup flow, login, authenticated dashboard access, image uploads, and a marketplace feed for listings. It is meant to make it easy for students to post items, discover deals, and trade safely within the university community.

## Pages
🚀 [Live Demo]([https://username.github.io/repo])(https://capstonedesign-spring2026-ulsancollege.github.io/campusMarketPlace/)

## Repository
[Repository](https://github.com/CapstoneDesign-Spring2026-UlsanCollege/campusMarketPlace)
### Signup
The Signup page provides a seamless experience for new users to create an account and join the campus marketplace community.

# Campus Marketplace Frontend

This repository now contains only the React + Vite frontend for Campus Marketplace.

## Project Structure

- `Frontend/` - React app powered by Vite
- `docs/` - project documentation

## Run Locally

```bash
# backend
source .venv/bin/activate
python app.py

# frontend
cd Frontend
npm install
npm run dev
```

Open the local URL shown by Vite (usually `http://localhost:5173`).

## Build

### Implemented
- Home page with campus marketplace branding
- Navigation layout shared across pages
- Signup UI with front-end validation for required first/last name
- Signup UI validation for campus email format: @office.uc.ac.kr
- Signup UI validation for password strength and confirmation matching

### Planned
- Functional signup/login backend
- Buy and sell listing workflows
- Request board and tutoring/service posts
- MongoDB integration for user and listing data

## Tech Stack

| Area | Technology |
|------|------------|
| Backend | Flask 3 |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| Database (planned/in progress) | MongoDB (PyMongo) |

## Project Structure

```text
campusMarketPlace/
|-- app.py
|-- requirements.txt
|-- templates/
|   |-- base.html
|   |-- index.html
|   `-- signup.html
|-- static/
|   |-- css/
|   |   |-- style.css
|   |   `-- signup.css
|   |-- js/
|   |   |-- main.js
|   |   `-- signup.js
|   `-- images/
`-- docs/
```


## License

Academic project use.
=======
