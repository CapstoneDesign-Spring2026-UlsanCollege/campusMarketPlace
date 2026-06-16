# Campus Marketplace Sprint Backlog

This backlog turns the current project docs into a practical build order.
It is focused on the smallest path to a reliable demo and the remaining class deliverables.

## Goal

Ship a believable campus marketplace with a stable core loop:
register or log in, post an item, browse listings, view details, and manage sold items.

## Priority 1: MVP Core Loop

1. Authentication flow
   - Finish persistent login/session handling.
   - Confirm signup, login, logout, and protected routes behave consistently.
   - Keep the campus email verification rule intact.

2. Listings workflow
   - Create, edit, and delete item listings.
   - Add title, description, price, category, condition, and image upload.
   - Make new listings appear immediately in the browse view.

3. Browse and detail pages
   - Show a live homepage grid of available listings.
   - Add item detail pages with full listing information.
   - Ensure empty-state and error-state UI is clear.

4. Search and filter
   - Add keyword search.
   - Add category filters for at least textbooks, electronics, furniture, and clothing.
   - Add a simple price filter if time allows.

5. Sold-state management
   - Let the owner mark a listing as sold.
   - Hide sold items from the public browse page.
   - Keep the owner dashboard up to date.

## Priority 2: Trust and Demo Quality

1. Image storage
   - Keep uploads working in development and deployment.
   - Use persistent storage for production so images do not disappear.

2. Email delivery
   - Verify OTP delivery works reliably in the real deployment setup.
   - Keep a local fallback for development.

3. Validation and feedback
   - Add clear form validation for required fields.
   - Show useful error messages when login or posting fails.

4. Mobile responsiveness
   - Make the main browse, detail, and form pages usable on a phone.

## Priority 3: Scope-Add Features

1. Request board
   - Add a page for students to post item requests.
   - Let sellers browse requests and respond.

2. Services section
   - Add tutoring or skill listings if the core marketplace is stable first.

3. Messaging
   - Treat this as stretch work only.
   - Do not block the MVP on chat.

4. Ratings and reviews
   - Also stretch work only.
   - Add only if the core loop is complete early.

## Suggested Sprint Order

- Sprint A: auth/session + listings create + browse grid
- Sprint B: item detail page + search/filter + sold state
- Sprint C: image storage + deployment hardening + demo polish
- Sprint D: request board or services, only if the MVP is already stable

## Definition of Done

- The app works end to end without manual database edits.
- A new user can register or log in, post an item, and see it on the marketplace.
- A buyer can search, open the item detail page, and view accurate data.
- A seller can mark an item as sold and remove it from public browse results.
- The deployed version matches the local version closely enough to demo with confidence.

## Open Questions

- Which backend flow is the current source of truth for auth: Flask routes or frontend state?
- Which storage path is the production target for images?
- Do you want the request board before services, or should services stay out of scope?
