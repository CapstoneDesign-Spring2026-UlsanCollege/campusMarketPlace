# Backup Demo Plan

## Backup Triggers

Use the backup plan if:

- GitHub Pages does not load
- Backend hosting is asleep or unavailable
- MongoDB connection fails
- OTP email is delayed
- Cloudinary upload fails
- Classroom network blocks a service

## Backup Order

1. Run the app locally.
2. Use a pre-verified demo account.
3. Use existing demo listings.
4. Skip live OTP delivery and explain provider dependency.
5. Use local image fallback or existing image URLs.
6. Show GitHub code evidence if live UI fails.
7. Show sprint/portfolio evidence for completed work.

## Local Commands

Backend:

```bash
source .venv/bin/activate
python app.py
```

Frontend:

```bash
npm run dev
```

## Screens or Files to Have Ready

- [Final MVP Demo](../04-final-product/FINAL_MVP_DEMO.md)
- [Setup and Run Guide](../04-final-product/SETUP_AND_RUN_GUIDE.md)
- [Architecture Final](../04-final-product/ARCHITECTURE_FINAL.md)
- [QA Report](../05-qa-and-stabilization/QA_REPORT.md)
- [Bugs and Limitations](../05-qa-and-stabilization/BUGS_AND_LIMITATIONS.md)
- [AI Code Ownership Audit](../06-ai-and-code-ownership/AI_CODE_OWNERSHIP_AUDIT.md)

## Message to Instructor if Backup Is Needed

The live service depends on external deployment, database, email, and image storage configuration. The local/code evidence shows the implemented routes and UI, and the portfolio documents which parts need external credentials.
