from pathlib import Path

WORKER = Path("src/worker.js")
source = WORKER.read_text(encoding="utf-8")
before = source

def replace_or_confirm(old, new, confirmation, label):
    global source
    count = source.count(old)
    if count == 1:
        source = source.replace(old, new, 1)
    elif count == 0 and confirmation in source:
        print(f"{label}: already applied")
    else:
        raise SystemExit(f"{label}: expected one clean anchor or existing patch; found {count}")

replace_or_confirm(
    'ensureHeaderColumns_(sh, ["Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)"]);',
    'ensureHeaderColumns_(sh, ["Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)", "Lokasi Jenis", "Kategori Area", "Nama Area", "Checklist Notes (JSON)"]);',
    'ensureHeaderColumns_(sh, ["Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)", "Lokasi Jenis", "Kategori Area", "Nama Area", "Checklist Notes (JSON)"]);',
    "Patrol additive columns"
)
replace_or_confirm(
    '      "Waktu Patrol": report.waktuPatrol || "",',
    '      "Waktu Patrol": report.waktuPatrol || "",\n'
    '      "Lokasi Jenis": report.lokasiJenis || "Mesin",\n'
    '      "Kategori Area": report.kategoriArea || "",\n'
    '      "Nama Area": report.namaArea || "",\n'
    '      "Checklist Notes (JSON)": JSON.stringify(report.checklistNotes || {}),',
    '"Checklist Notes (JSON)": JSON.stringify(report.checklistNotes || {}),',
    "Patrol row mapping"
)

home_anchor = '  function getHomePatrolLatest_(includeDetails) {'
home_start = source.find(home_anchor)
if home_start < 0:
    raise SystemExit("Home Patrol function anchor missing")
loop_anchor = '    rows.forEach(function(r) {\n'
loop_pos = source.find(loop_anchor, home_start)
if loop_pos < 0:
    raise SystemExit("Home Patrol rows loop anchor missing")
home_end = source.find('\n  function ', home_start + len(home_anchor))
if home_end < 0:
    home_end = len(source)
home_block = source[home_start:home_end]
area_skip = '      if (String(r["Lokasi Jenis"] || "").toLowerCase() === "area") return;\n'
if area_skip not in home_block:
    insert_pos = loop_pos + len(loop_anchor)
    source = source[:insert_pos] + area_skip + source[insert_pos:]
else:
    print("Home Patrol area exclusion: already applied")

assets_old = '  return env.ASSETS.fetch(request);\n} };'
if "OMODOS_PATROL_REVIEW_V1" not in source:
    assets_new = (
        '  const response = await env.ASSETS.fetch(request);\n'
        '  const contentType = response.headers.get("content-type") || "";\n'
        '  if (request.method !== "GET" || response.status !== 200 || !contentType.includes("text/html")) return response;\n'
        '  const marker = "<!-- OMODOS_PATROL_REVIEW_V1 -->";\n'
        '  const injection = marker + \'<script src="/omodos4/patrol-area-feedback.js?v=20261108-1" defer></script><script src="/omodos4/patrol-review-enhancements.js?v=20261108-1" defer></script>\';\n'
        '  const html = await response.text();\n'
        '  if (html.includes(marker)) return new Response(html, response);\n'
        '  const body = html.includes("</body>") ? html.replace("</body>", injection + "</body>") : html + injection;\n'
        '  const headers = new Headers(response.headers);\n'
        '  headers.delete("content-length");\n'
        '  headers.set("cache-control", "no-store, no-cache, must-revalidate");\n'
        '  return new Response(body, { status: response.status, statusText: response.statusText, headers });\n'
        '} };'
    )
    count = source.count(assets_old)
    if count != 1:
        raise SystemExit(f"HTML enhancement injection: expected 1 anchor, found {count}")
    source = source.replace(assets_old, assets_new, 1)
else:
    print("HTML enhancement injection: already applied")

if source.count("Checklist Notes (JSON)") != 2:
    raise SystemExit("Patrol notes schema is incomplete")
if source.count("OMODOS_PATROL_REVIEW_V1") != 1:
    raise SystemExit("Patrol sidecar injection marker must appear once")

if source != before:
    WORKER.write_text(source, encoding="utf-8")
    print("Patched Worker additively.")
else:
    print("Worker already contains the complete Patrol review patch; no rewrite needed.")
