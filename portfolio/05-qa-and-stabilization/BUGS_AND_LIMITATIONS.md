# Bugs and Limitations

| Bug or limitation | Severity | Status | Evidence | Workaround or next step |
|---|---|---|---|---|
| OTP email delivery requires SendGrid or SMTP configuration | P1 | Accepted | [README.md](../../README.md), [app.py](../../app.py) | Use configured provider or pre-verified demo account |
| Cloudinary uploads require external credentials | P2 | Accepted | [README.md](../../README.md), [app.py](../../app.py) | Configure Cloudinary or use local dev fallback |
| Automated backend tests need a Flask test client fixture | P2 | Open | [tests/test_profile_endpoints.py](../../tests/test_profile_endpoints.py) | Add `conftest.py` and test database setup |
| Frontend tests are a placeholder | P2 | Open | [Frontend/package.json](../../Frontend/package.json) | Add real component/integration tests |
| Some weekly sprint packets are missing | P3 | Accepted | [weekly-sprints](../02-semester-journey/weekly-sprints) | Document gaps honestly |
| Some weekly packets contain placeholders/TBD links | P3 | Accepted | [docs/Sprint_Packet](../../docs/Sprint_Packet) | Replace with links if team has external evidence |
| Live demo depends on GitHub Pages, backend hosting, MongoDB, and network | P1 | Accepted | [DEPLOYMENT_AND_DEMO_PLAN.md](../04-final-product/DEPLOYMENT_AND_DEMO_PLAN.md) | Rehearse local backup |
| No committed seed-data script | P3 | Open | Repo inspection | Add seed script or prepare manual demo data |
| Admin moderation not implemented | P3 | Accepted | [SCOPE_DECISIONS.md](../01-project-overview/SCOPE_DECISIONS.md) | Treat as post-MVP |
| Payment/shipping not implemented | P3 | Accepted | [SCOPE_DECISIONS.md](../01-project-overview/SCOPE_DECISIONS.md) | Keep out of final MVP |

Severity guide:

- P0: final demo cannot work
- P1: core feature broken or unreliable
- P2: important but workaround exists
- P3: polish or nice improvement
