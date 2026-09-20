# OMODOS Production QA — Post Recovery

- QA UTC: 2026-09-20T13:25:37.796673+00:00
- Production: https://omodos.offsetbmj.workers.dev
- Live bytes: 1637898
- Repo bytes: 1637898
- Live SHA-256: 3294f7addcc91e96cf2e44591a6bb9a05a69817cbd5505f78fcddaf0279749ac
- Repo SHA-256: 3294f7addcc91e96cf2e44591a6bb9a05a69817cbd5505f78fcddaf0279749ac
- Live equals repo: YES

## Browser QA

- Phases: open, structural, non-superadmin, superadmin, pagination, errors-checked
- V4 structural: {"title": "OMODOS - Smart Maintenance Reporting Platform | Packaging Offset || © 2026 IDJ", "v4Nav": true, "v4View": true, "v4Namespace": true, "v4Renderer": true, "gate": true, "rbac": true, "sparepartPager": true, "switchView": true}
- Non-Superadmin: {"allowed": false, "display": "none", "go": false, "active": false}
- Superadmin: {"allowed": true, "display": "", "go": true, "active": true, "cards": 6}
- Sparepart pagination: {"ok": true, "message": ""}
- Fatal browser errors: 0
- Same-origin failed requests observed: 9

## Safe backend GET probes

- /api/health: status=404, content_type=, sampled_bytes=0
- /health: status=404, content_type=, sampled_bytes=0
- /api/v1/health: status=404, content_type=, sampled_bytes=0
