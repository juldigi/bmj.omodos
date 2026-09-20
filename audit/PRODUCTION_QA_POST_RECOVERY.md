# OMODOS Production QA — Post Recovery

- QA UTC: 2026-09-20T13:33:15.855915+00:00
- Production: https://omodos.offsetbmj.workers.dev
- Live bytes: 1637800
- Repo bytes: 1637800
- Live SHA-256: f3e3158751dea126185c953ed11a8555ae3560c2826a65f02f9256cc796e402e
- Repo SHA-256: f3e3158751dea126185c953ed11a8555ae3560c2826a65f02f9256cc796e402e
- Live equals repo: YES

## Browser QA

- Phases: open, structural, non-superadmin, superadmin, pagination, vendor-smoke, errors-checked
- V4 structural: {"title": "OMODOS - Smart Maintenance Reporting Platform | Packaging Offset || © 2026 IDJ", "v4Nav": true, "v4View": true, "v4Namespace": true, "v4Renderer": true, "gate": true, "rbac": true, "sparepartPager": true, "switchView": true, "html2canvas": true, "jspdf": true, "docx": true, "xlsx": true, "exceljs": true, "chart": true, "vis": true}
- Non-Superadmin: {"allowed": false, "display": "none", "go": false, "active": false}
- Superadmin: {"allowed": true, "display": "", "go": true, "active": true, "cards": 6}
- Sparepart pagination: {"ok": true, "message": ""}
- Fatal browser errors: 0
- Same-origin failed requests observed: 0
- Vendor smoke: {"jspdf": true, "xlsx": true, "exceljs": true, "vis": true}

## Production vendor assets

- /vendor/html2canvas.min.js: status=200, content_type=text/javascript, bytes=198689
- /vendor/jspdf.min.js: status=200, content_type=text/javascript, bytes=365730
- /vendor/docx.min.js: status=200, content_type=text/javascript, bytes=742858
- /vendor/xlsx.min.js: status=200, content_type=text/javascript, bytes=881727
- /vendor/exceljs.min.js: status=200, content_type=text/javascript, bytes=947702
- /vendor/chart.min.js: status=200, content_type=text/javascript, bytes=208522
- /vendor/vis-network.min.js: status=200, content_type=text/javascript, bytes=688911

## Safe backend GET probes

- /api/health: status=404, content_type=, sampled_bytes=0
- /health: status=404, content_type=, sampled_bytes=0
- /api/v1/health: status=404, content_type=, sampled_bytes=0
