# OMODOS 4 Data Reuse Audit

- Audited UTC: 2026-09-20T13:07:30.193141+00:00
- OMODOS 4 lexical occurrences inspected: 118
- Total literal API paths in Worker: 7
- API paths lexically near OMODOS 4 code: 3

## Existing data domains referenced near OMODOS 4

- logbook: YES
- patrol: YES
- sparepart: YES
- kpi: YES
- ipal: YES
- maintenance: YES
- machine: YES

## Authorization context

- exact_key: YES
- superadmin_near: YES
- rbac_near: YES
- session_near: YES
- 403_near: YES

## Dedicated V4 persistence check

- No SQL table name containing omodos4 or v4 was detected.

## Write-operation proximity

- SQL INSERT: 0 lexical occurrence(s) in broad V4 proximity windows
- SQL UPDATE: 0 lexical occurrence(s) in broad V4 proximity windows
- SQL DELETE: 0 lexical occurrence(s) in broad V4 proximity windows
- CREATE TABLE: 0 lexical occurrence(s) in broad V4 proximity windows
- HTTP POST: 1770 lexical occurrence(s) in broad V4 proximity windows
- HTTP PUT: 0 lexical occurrence(s) in broad V4 proximity windows
- HTTP PATCH: 0 lexical occurrence(s) in broad V4 proximity windows
- HTTP DELETE: 0 lexical occurrence(s) in broad V4 proximity windows
- These are proximity counts only; they do not prove that the write belongs to OMODOS 4.

## Existing API paths near OMODOS 4

- /api/setup/
- /api/setup/finish
- /api/setup/import

## Conclusion

- Evidence supports OMODOS 4 as an intelligence layer over existing OMODOS domains rather than a duplicate V4 database.
