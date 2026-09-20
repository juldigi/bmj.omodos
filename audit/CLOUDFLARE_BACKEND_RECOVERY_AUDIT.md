# OMODOS Cloudflare Backend Recovery Audit

- Audited UTC: 2026-09-20T13:06:20.921097+00:00
- Worker: omodos
- Compatibility date: 2026-09-01
- Downloaded bundle bytes: 893937
- Bundle SHA-256: 64c55eb715dc347b0e30c47e0594fc730610fd7efc3bede1d2d0995833cba670
- Multipart parts: 1

## Recovered parts

- worker.js — 893686 bytes — application/javascript+module — SHA-256 fd8ae6b16ad8d60218d99f8590694647bab90edd7422c391450a0bdeb38b640b

## Architecture fingerprints

- Durable Object: YES
- MaintenanceStore: YES
- SQLite: YES
- Session: YES
- RBAC / permission: YES
- OMODOS 4: YES
- omodos4.view exact: YES
- Superadmin: YES

## OMODOS 4 authorization audit

- omodos4 occurrences: 118
- omodos4.view exact occurrences: 5
- V4 occurrence near Superadmin check: YES
- V4 occurrence near permission/RBAC logic: YES
- V4 occurrence near auth/session logic: YES
- V4 occurrence near deny/403 logic: YES

## V4 API surface

- No explicit /api/*omodos4* or /api/v4* literal endpoint strings found.

## Bindings (names/types only)

- Metadata bindings were not parseable from the recovered multipart payload.

## Secret-safety scan

- api_token_assignment: 0 candidate(s)
- password_assignment: 0 candidate(s)
- secret_assignment: 0 candidate(s)
- bearer_literal: 0 candidate(s)
- Candidate values are intentionally never written to this report or workflow logs.

## Recovery conclusion

- Backend already contains the exact omodos4.view permission key with nearby Superadmin/RBAC logic. Treat backend gate as present pending behavioral API testing.
