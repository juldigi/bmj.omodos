# OMODOS — Production & Recovery Baseline

Repository resmi OMODOS setelah migrasi GitHub dan Cloudflare:

- Repository: `juldigi/bmj.omodos`
- Production aktif: `https://omodos.juldigi.workers.dev`
- Worker: `omodos`
- Runtime: Cloudflare Workers + Static Assets
- Data store: Durable Object `MAINTENANCE` dengan class SQLite-backed `MaintenanceStore`
- Recovery baseline awal: 2026-09-20
- Migrasi ke akun Cloudflare baru selesai: 2026-09-24
- Release hygiene terakhir: 2026-10-01

## Status produksi

Source backend aktif sudah tersimpan di `src/worker.js` dan konfigurasi deployment aktif berada di `wrangler.jsonc`.

Frontend production berada di `public/index.html`. Lapisan OMODOS 4.0 berada di `public/omodos4/` dan tetap menggunakan data existing OMODOS sebagai source of truth, bukan database V4 terpisah.

Migrasi Cloudflare sudah selesai. Export bridge, akses migrasi sementara, dan binding/secret sekali pakai yang digunakan selama proses migrasi sudah ditutup/dibersihkan. Deployment berikutnya menggunakan workflow dan konfigurasi akun Cloudflare baru.

Folder `recovery/production/` tetap dipertahankan sebagai rollback/reference baseline historis dan tidak boleh dianggap sebagai source terbaru.

## Guardrail arsitektur

1. Jangan rebuild OMODOS dari nol.
2. Jangan mengganti storage ke D1 tanpa kebutuhan, desain migrasi, dan rollback plan yang eksplisit.
3. Pertahankan Cloudflare Worker + Durable Object + SQLite-backed `MaintenanceStore`.
4. Perubahan harus additive/non-destructive terhadap data production.
5. OMODOS 4.0 tetap Superadmin-only melalui gate frontend dan backend.
6. Logbook, Patrol, Sparepart, KPI, IPAL, Copilot, auth/session, RBAC, upload/preview file, master data, dan workflow existing tidak boleh mengalami regresi.
7. Home/status mesin harus tetap menggunakan source of truth yang sudah ditetapkan dan tidak diubah hanya untuk kepentingan visual.
8. Endpoint/secret migrasi sementara tidak boleh diaktifkan kembali setelah migrasi selesai.
9. Setiap perubahan production harus melewati pemeriksaan syntax/config, browser regression, dan production smoke ketika GitHub Actions tersedia.

## Release verification

- `.github/workflows/browser-qa-v4.yml` memeriksa kontrak UI, RBAC, source-truth, upload/media, Patrol, Sparepart, Master Mesin, Master Personil, Meeting, dan navigasi OMODOS 4.
- `.github/workflows/production-smoke.yml` memeriksa production shell, login invalid-safe response, asset OMODOS 4, build marker, dan label/fungsi kritis.
- `.github/workflows/deploy-omodos-new.yml` adalah jalur deployment GitHub Actions untuk akun Cloudflare baru.
- Integrasi Cloudflare GitHub juga membangun commit repository dan menjadi verifikasi deployment terpisah.

Jika GitHub Actions gagal sebelum langkah pertama dibuat (job tanpa steps/log), perlakukan sebagai masalah runner/account Actions dan jangan otomatis menganggap source OMODOS gagal. Tetap verifikasi hasil Cloudflare build dan ulangi regression runner setelah Actions tersedia kembali.
