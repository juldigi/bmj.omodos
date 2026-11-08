from pathlib import Path

WORKER = Path("src/worker.js")
source = WORKER.read_text(encoding="utf-8")
before = source

def replace_once(old, new, label):
    global source
    count = source.count(old)
    if count != 1:
        raise SystemExit(f"{label}: expected 1 anchor, found {count}")
    source = source.replace(old, new, 1)

replace_once(
    'ensureHeaderColumns_(sh, ["Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)"]);',
    'ensureHeaderColumns_(sh, ["Patrol Mode", "Checklist (JSON)", "Counts (JSON)", "Score", "Findings (JSON)", "Lokasi Jenis", "Kategori Area", "Nama Area", "Checklist Notes (JSON)"]);',
    "Patrol additive columns"
)
replace_once(
    '      "Waktu Patrol": report.waktuPatrol || "",',
    '      "Waktu Patrol": report.waktuPatrol || "",\n'
    '      "Lokasi Jenis": report.lokasiJenis || "Mesin",\n'
    '      "Kategori Area": report.kategoriArea || "",\n'
    '      "Nama Area": report.namaArea || "",\n'
    '      "Checklist Notes (JSON)": JSON.stringify(report.checklistNotes || {}),',
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
insert_pos = loop_pos + len(loop_anchor)
source = (
    source[:insert_pos]
    + '      if (String(r["Lokasi Jenis"] || "").toLowerCase() === "area") return;\n'
    + source[insert_pos:]
)

assets_old = '  return env.ASSETS.fetch(request);\n} };'
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
replace_once(assets_old, assets_new, "HTML enhancement injection")

if source == before:
    raise SystemExit("No worker changes were made")
if source.count("Checklist Notes (JSON)") != 2:
    raise SystemExit("Patrol notes schema is incomplete")
if source.count("OMODOS_PATROL_REVIEW_V1") != 1:
    raise SystemExit("Patrol sidecar injection marker must appear once")

WORKER.write_text(source, encoding="utf-8")
print("Patched Worker additively: Patrol area/notes columns, home-area exclusion, and frontend sidecar injection.")
