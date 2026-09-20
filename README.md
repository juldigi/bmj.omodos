# OMODOS — Recovery Baseline

Repository resmi baru setelah migrasi akun GitHub:

- Repository: `juldigi/bmj.omodos`
- Production: `https://omodos.offsetbmj.workers.dev`
- Recovery baseline captured: 2026-09-20T12:30:47Z
- Production root status saat capture: HTTP 200
- Frontend SHA-256: `70ed5c8f6a06e221f568911a5d422ee138ccc169342add50e622306270cd3b8f`

## Status

`public/index.html` adalah salinan byte-identical dari frontend production yang aktif pada waktu capture.

Folder `recovery/production/` menyimpan snapshot, response headers, metadata, dan checksum sebagai rollback/reference baseline.

Backend production **belum diganti atau ditimpa**. Worker `omodos`, Durable Object, SQLite-backed MaintenanceStore, session/RBAC, serta data production tetap menjadi source of truth sampai source backend dipulihkan dan diaudit.

## Aturan recovery

1. Jangan rebuild OMODOS dari nol.
2. Jangan migrasikan storage ke D1 tanpa kebutuhan dan migration plan.
3. Pertahankan arsitektur existing Cloudflare Workers + Durable Objects + SQLite-backed MaintenanceStore.
4. Semua perubahan OMODOS 4.0 harus additive/non-destructive.
5. OMODOS 4.0 tetap Superadmin-only, dengan frontend gate dan backend gate.
6. Existing Logbook, Patrol, Sparepart, KPI, IPAL, Copilot, auth, RBAC, file preview, dan data existing tidak boleh mengalami regresi.
7. Sebelum deploy source baru ke Worker, backend source/config harus dipulihkan dan regression test harus lulus.

## Recovery workflow

`.github/workflows/recover-production.yml` melakukan GET read-only terhadap production dan menyimpan snapshot untuk audit. Workflow tidak mengubah Worker/database.
