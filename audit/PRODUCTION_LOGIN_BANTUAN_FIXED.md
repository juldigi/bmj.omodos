# OMODOS Production Login + Bantuan Fix

- UTC: 2026-09-20T14:11:35.695053+00:00
- Version: 63132ccc-7490-4fd9-9c58-11394b5e7051
- Deployment: 849afb47-ca5e-431a-ac70-be318e0f9c5a
- Frontend SHA-256: f5b9e2fd1905c16f00a42b7411af040abd1342b3b40266bebac5ca5f6fadcef5
- Requested asset uploads: 0
- Bindings: ASSETS, GEMINI_API_KEY, GROQ_API_KEY, MAINTENANCE, SETUP_TOKEN
- Smoke: {"attempt": 1, "root_status": 200, "root_sha": "f5b9e2fd1905c16f00a42b7411af040abd1342b3b40266bebac5ca5f6fadcef5", "root_matches_latest": true, "help_button": true, "legacy_help_hidden": true, "api_status": 200, "api_json": true, "login_status": 200, "login_json": true, "bindings": ["ASSETS", "GEMINI_API_KEY", "GROQ_API_KEY", "MAINTENANCE", "SETUP_TOKEN"]}

## Result
- PASS: login backend returns JSON.
- PASS: current frontend is deployed.
- PASS: legacy page-level Bantuan is hidden/removed.
- PASS: Bantuan button remains in Copilot.
- PASS: critical Cloudflare bindings/secrets are preserved.
