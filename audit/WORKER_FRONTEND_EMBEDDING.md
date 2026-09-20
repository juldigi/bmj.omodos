# OMODOS Worker Frontend Embedding Audit

- Audited UTC: 2026-09-20T13:23:51.272650+00:00
- Recovery version: v68 / 0ff07d98-66e4-423c-80a5-2a2009b7be5e
- Worker module: worker.js
- Worker bytes: 893686
- Worker SHA-256: fd8ae6b16ad8d60218d99f8590694647bab90edd7422c391450a0bdeb38b640b
- Live HTML bytes: 1637898
- Live HTML SHA-256: 3294f7addcc91e96cf2e44591a6bb9a05a69817cbd5505f78fcddaf0279749ac
- Repo HTML bytes: 1637898
- Repo HTML SHA-256: 3294f7addcc91e96cf2e44591a6bb9a05a69817cbd5505f78fcddaf0279749ac
- Repo HTML equals live HTML: YES
- Exact live HTML embedded in worker: NO
- Exact repo HTML embedded in worker: NO

## Marker map

- <!doctype html: count=0, first_position=-1
- <html: count=0, first_position=-1
- </html>: count=0, first_position=-1
- view-sparepart: count=0, first_position=-1
- attachSparepartPaginationHandlers: count=0, first_position=-1
- OMODOS_COPILOT_BANTUAN_HOTFIX: count=0, first_position=-1
- OMODOS4_PHASE1_SAFE: count=0, first_position=-1
- omodos4.view: count=5, first_position=573458
- MaintenanceStore: count=3, first_position=892982
- const $ = (sel: count=0, first_position=-1
- window.switchToView: count=0, first_position=-1

## HTML boundary positions

- doctype positions: []
- html positions: []
- closing html positions: []

## Exact chunk presence

- live 128 bytes: prefix=NO, suffix=NO
- repo 128 bytes: prefix=NO, suffix=NO
- live 256 bytes: prefix=NO, suffix=NO
- repo 256 bytes: prefix=NO, suffix=NO
- live 512 bytes: prefix=NO, suffix=NO
- repo 512 bytes: prefix=NO, suffix=NO
- live 1024 bytes: prefix=NO, suffix=NO
- repo 1024 bytes: prefix=NO, suffix=NO
- live 2048 bytes: prefix=NO, suffix=NO
- repo 2048 bytes: prefix=NO, suffix=NO

## Common encoding presence

- live gzip9: encoded_bytes=410042, present=NO
- live zlib9: encoded_bytes=410030, present=NO
- live base64: encoded_bytes=2183864, present=NO
- repo gzip9: encoded_bytes=410042, present=NO
- repo zlib9: encoded_bytes=410030, present=NO
- repo base64: encoded_bytes=2183864, present=NO

## Patch readiness

- Frontend embedding method is not yet identifiable from static markers.
