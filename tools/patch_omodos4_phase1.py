from pathlib import Path
import sys

path = Path("public/index.html")
src = path.read_text(encoding="utf-8", errors="strict")

MARKER = "OMODOS4_PHASE1_SAFE"
if MARKER in src:
    print("OMODOS 4 Phase 1 already applied; no changes.")
    sys.exit(0)

css = r'''
<!-- OMODOS4_PHASE1_SAFE -->
<style id="omodos4-phase1-style">
.v4-nav-group{border-top:1px solid var(--line-soft);padding-top:8px;margin-top:8px}
.v4-nav-group .nav-parent-btn{font-weight:800}
.v4-nav-group .nav-parent-btn .v4-badge{margin-left:auto;font:700 9px/1 var(--font-mono);padding:3px 6px;border-radius:999px;border:1px solid var(--line);color:var(--text-dim);background:var(--panel-2)}
.v4-shell{--v4-gap:12px}
.v4-shell .v4-hero{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:16px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(135deg,var(--panel),var(--panel-2));margin-bottom:14px}
.v4-shell .v4-eyebrow{font:700 10px/1.2 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim)}
.v4-shell .v4-title{font:800 clamp(22px,3vw,34px)/1.1 var(--font-display);margin:6px 0}
.v4-shell .v4-sub{font-size:12.5px;line-height:1.55;color:var(--text-dim);max-width:760px}
.v4-shell .v4-source{flex:0 0 auto;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font:700 10px/1 var(--font-mono);color:var(--green);background:var(--panel-2)}
.v4-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--v4-gap);margin-bottom:16px}
.v4-card{border:1px solid var(--line);border-radius:13px;background:var(--panel);padding:13px;min-width:0}
.v4-card .v4-k{font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em}
.v4-card .v4-v{font:800 26px/1 var(--font-display);margin-top:7px}
.v4-card .v4-note{font-size:10.5px;color:var(--text-dim);margin-top:6px;line-height:1.4}
.v4-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:var(--v4-gap)}
.v4-section-title{display:flex;align-items:center;gap:7px;font:800 13px/1.2 var(--font-display);margin-bottom:10px}
.v4-list{display:grid;gap:8px}
.v4-row{display:grid;grid-template-columns:minmax(110px,.55fr) minmax(0,1.45fr);gap:10px;padding:9px 0;border-top:1px solid var(--line-soft)}
.v4-row:first-child{border-top:0;padding-top:0}
.v4-row .v4-meta{font-size:10.5px;color:var(--text-dim);line-height:1.4}
.v4-row .v4-main{font-size:12px;line-height:1.45;overflow-wrap:anywhere}
.v4-empty{font-size:12px;color:var(--text-dim);padding:10px 0}
.v4-chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:999px;padding:3px 7px;font-size:9.5px;color:var(--text-dim);margin:2px 4px 2px 0}
@media(max-width:900px){.v4-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.v4-grid{grid-template-columns:1fr}.v4-shell .v4-hero{flex-direction:column}.v4-shell .v4-source{align-self:flex-start}}
@media(max-width:560px){.v4-summary{grid-template-columns:1fr}.v4-row{grid-template-columns:1fr;gap:3px}}
</style>
'''

nav = r'''
    <div class="nav-group nav-group-collapsible v4-nav-group" data-group-key="omodos4" id="v4-nav-group" style="display:none;">
      <button class="nav-parent-btn" data-group="omodos4"><span class="ico"><i class="ph-bold ph-cpu"></i></span> OMODOS 4.0 <span class="v4-badge">SUPERADMIN</span> <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
      <div class="nav-submenu" data-submenu="omodos4">
        <button class="nav-btn v4-nav-btn" data-view="omodos4" data-v4-root="1"><span class="ico"><i class="ph-bold ph-command"></i></span> Command Center</button>
      </div>
    </div>

'''

view = r'''
    <section class="view v4-shell" id="view-omodos4" data-v4-shell="1">
      <div class="topbar">
        <div>
          <div class="v4-eyebrow">Industrial Intelligence Layer</div>
          <h1 style="margin-top:4px;">OMODOS 4.0</h1>
          <div class="sub">Command Center Superadmin yang membaca data existing tanpa membuat duplikasi sumber data.</div>
        </div>
        <button class="btn btn-sm" id="btn-v4-refresh" type="button"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
      </div>

      <div class="v4-hero">
        <div>
          <div class="v4-eyebrow">OBSERVE • CONNECT • UNDERSTAND</div>
          <div class="v4-title">Command Center</div>
          <div class="v4-sub">Ringkasan ini dihitung dari data OMODOS yang sudah dimuat di browser. Phase 1 tidak menulis data baru dan tidak mengubah workflow Logbook, Patrol, Sparepart, KPI, IPAL, maupun modul existing.</div>
        </div>
        <div class="v4-source"><i class="ph-bold ph-database"></i> EXISTING DATA</div>
      </div>

      <div class="v4-summary" id="v4-summary"></div>

      <div class="v4-grid">
        <div class="v4-card">
          <div class="v4-section-title"><i class="ph-bold ph-warning-diamond"></i> Things to Look At</div>
          <div id="v4-look-at" class="v4-list"></div>
        </div>
        <div class="v4-card">
          <div class="v4-section-title"><i class="ph-bold ph-clock-counter-clockwise"></i> What Changed?</div>
          <div id="v4-changed" class="v4-list"></div>
        </div>
        <div class="v4-card" style="grid-column:1/-1;">
          <div class="v4-section-title"><i class="ph-bold ph-sparkle"></i> Latest Intelligence</div>
          <div id="v4-latest" class="v4-list"></div>
        </div>
      </div>
    </section>

'''

script = r'''
<script id="omodos4-phase1-script">
(function(){
  'use strict';

  const V4_PERMISSION_ROOT = 'omodos4.view';

  function v4IsSuperadmin(){
    try{
      return typeof isSuperadmin === 'function'
        ? isSuperadmin()
        : !!(typeof CURRENT_USER !== 'undefined' && CURRENT_USER && CURRENT_USER.role === 'Superadmin');
    }catch(e){ return false; }
  }

  function v4Entries(){
    try{
      const rows = (typeof ENTRIES !== 'undefined' && Array.isArray(ENTRIES)) ? ENTRIES : [];
      return typeof sotEntries === 'function' ? sotEntries(rows) : rows;
    }catch(e){ return []; }
  }

  function v4Text(obj){
    if(!obj || typeof obj !== 'object') return '';
    return Object.values(obj).filter(v=>v!=null && typeof v!=='object').join(' ').toLowerCase();
  }

  function v4MachineName(e){
    return String((e && (e['Nama Mesin'] || e['Kode Mesin'] || e['Mesin'])) || '-').trim() || '-';
  }

  function v4Status(e){
    return String((e && (e['Status'] || e['Status Pekerjaan'] || e['Status Mesin'])) || '').trim();
  }

  function v4IsDone(e){
    const s=v4Status(e).toLowerCase();
    return ['selesai','done','completed','closed','close'].some(x=>s===x || s.includes(x));
  }

  function v4IsCritical(e){
    const t=v4Text(e);
    return /emergency|breakdown|critical|kritis|stop mesin|downtime/.test(t) && !v4IsDone(e);
  }

  function v4DateValue(e){
    const raw=(e && (e['Timestamp'] || e['UpdatedAt'] || e['Tanggal'] || e['Tanggal Laporan'])) || '';
    const d=new Date(raw);
    return Number.isFinite(d.getTime()) ? d.getTime() : 0;
  }

  function v4FmtDate(ms){
    if(!ms) return '-';
    try{return new Date(ms).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});}catch(e){return new Date(ms).toLocaleString();}
  }

  function v4Escape(value){
    if(typeof escapeHtml === 'function') return escapeHtml(String(value==null?'':value));
    return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function v4Describe(e){
    if(!e) return '-';
    return String(
      e['Deskripsi Pekerjaan'] || e['Deskripsi'] || e['Masalah'] ||
      e['Keterangan'] || e['Jenis Pekerjaan'] || 'Catatan maintenance'
    ).trim();
  }

  function v4TodayKey(){
    const d=new Date();
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+day;
  }

  function v4DateKey(e){
    const ms=v4DateValue(e);
    if(!ms) return '';
    const d=new Date(ms);
    const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
    return y+'-'+m+'-'+day;
  }

  function v4SparepartPending(){
    try{
      if(typeof sparepartRows !== 'function') return null;
      return sparepartRows().filter(r=>String((r.sap&&r.sap.status)||'PENDING').toUpperCase()!=='COMPLETED').length;
    }catch(e){ return null; }
  }

  function v4PatrolCount(){
    try{
      if(typeof PM_REPORTS !== 'undefined' && Array.isArray(PM_REPORTS)) return PM_REPORTS.length;
    }catch(e){}
    return null;
  }

  function v4Card(label,value,note,icon){
    return '<div class="v4-card"><div class="v4-k"><i class="ph-bold '+icon+'"></i> '+v4Escape(label)+'</div><div class="v4-v">'+v4Escape(value)+'</div><div class="v4-note">'+v4Escape(note)+'</div></div>';
  }

  function v4Row(e){
    const ms=v4DateValue(e);
    const machine=v4MachineName(e);
    const status=v4Status(e) || 'Tanpa status';
    return '<div class="v4-row"><div class="v4-meta">'+v4Escape(machine)+'<br>'+v4Escape(v4FmtDate(ms))+'</div><div class="v4-main">'+v4Escape(v4Describe(e))+'<div><span class="v4-chip">'+v4Escape(status)+'</span></div></div></div>';
  }

  function renderOmodos4(){
    if(!v4IsSuperadmin()){
      if(typeof showAccessDenied === 'function') showAccessDenied();
      return false;
    }

    const entries=v4Entries();
    const open=entries.filter(e=>!v4IsDone(e));
    const critical=open.filter(v4IsCritical);
    const criticalMachines=new Set(critical.map(v4MachineName).filter(x=>x&&x!=='-'));
    const machines=new Set(entries.map(v4MachineName).filter(x=>x&&x!=='-'));
    const todayKey=v4TodayKey();
    const today=entries.filter(e=>v4DateKey(e)===todayKey);
    const pendingSp=v4SparepartPending();
    const patrolCount=v4PatrolCount();

    const summary=document.getElementById('v4-summary');
    if(summary){
      summary.innerHTML=[
        v4Card('Critical Machines',criticalMachines.size,'Mesin dengan catatan aktif yang mengandung sinyal emergency/breakdown.','ph-warning'),
        v4Card('Open Logbook',open.length,'Record Logbook yang belum berstatus selesai/closed.','ph-list-checks'),
        v4Card('Activity Today',today.length,'Record source-of-truth yang bertanggal hari ini.','ph-calendar-check'),
        v4Card('Sparepart Pending',pendingSp==null?'—':pendingSp,pendingSp==null?'Sumber sparepart belum dimuat pada sesi ini.':'Pemakaian yang belum berstatus collect + SAP selesai.','ph-package'),
        v4Card('Patrol Loaded',patrolCount==null?'—':patrolCount,patrolCount==null?'Sumber Patrol belum dimuat pada sesi ini.':'Jumlah record Patrol yang tersedia di memori aplikasi.','ph-shield-check'),
        v4Card('Machines Observed',machines.size,'Mesin unik yang muncul pada data maintenance existing.','ph-factory')
      ].join('');
    }

    const attention=[...critical].sort((a,b)=>v4DateValue(b)-v4DateValue(a)).slice(0,8);
    const look=document.getElementById('v4-look-at');
    if(look) look.innerHTML=attention.length ? attention.map(v4Row).join('') : '<div class="v4-empty">Tidak ada record aktif dengan sinyal emergency/breakdown pada data yang sedang dimuat.</div>';

    const changed=[...today].sort((a,b)=>v4DateValue(b)-v4DateValue(a)).slice(0,8);
    const changedEl=document.getElementById('v4-changed');
    if(changedEl) changedEl.innerHTML=changed.length ? changed.map(v4Row).join('') : '<div class="v4-empty">Belum ada perubahan Logbook bertanggal hari ini pada data yang sedang dimuat.</div>';

    const latest=[...entries].sort((a,b)=>v4DateValue(b)-v4DateValue(a)).slice(0,12);
    const latestEl=document.getElementById('v4-latest');
    if(latestEl) latestEl.innerHTML=latest.length ? latest.map(v4Row).join('') : '<div class="v4-empty">Belum ada record maintenance untuk diringkas.</div>';

    return true;
  }

  window.OMODOS4 = Object.assign(window.OMODOS4 || {}, {
    version:'4.0-phase1-recovery',
    permissionRoot:V4_PERMISSION_ROOT,
    isAllowed:v4IsSuperadmin,
    render:renderOmodos4
  });
  window.renderOmodos4 = renderOmodos4;

  const refresh=document.getElementById('btn-v4-refresh');
  if(refresh) refresh.addEventListener('click',()=>{ renderOmodos4(); if(typeof toast==='function') toast('OMODOS 4.0 diperbarui dari data existing.'); });
})();
</script>
'''

# 1) CSS before </head>
if "</head>" not in src:
    raise SystemExit("Missing </head> anchor")
src = src.replace("</head>", css + "\n</head>", 1)

# 2) Add sidebar parent before settings.
nav_anchor = '    <!-- Pengaturan: utilitas, dipisah dari 5 kategori utama (bukan tugas harian). -->'
if nav_anchor not in src:
    raise SystemExit("Sidebar anchor not found")
src = src.replace(nav_anchor, nav + nav_anchor, 1)

# 3) Add V4 view after Home and before Insights.
view_anchor = '    <section class="view" id="view-insights-hub">'
if view_anchor not in src:
    raise SystemExit("View anchor not found")
src = src.replace(view_anchor, view + view_anchor, 1)

# 4) Add explicit root permission metadata into the existing feature registry merge.
merge_anchor = '  const discovered = discoverFeatureRegistryFromDom();'
merge_insert = """  const discovered = discoverFeatureRegistryFromDom();
  if(!discovered.some(f=>f.PermissionKey==='omodos4.view')){
    discovered.push({PermissionKey:'omodos4.view',Label:'OMODOS 4.0 (Superadmin Root)',Group:'OMODOS 4.0'});
  }"""
if merge_anchor not in src:
    raise SystemExit("Feature registry merge anchor not found")
src = src.replace(merge_anchor, merge_insert, 1)

# 5) Hard Superadmin gate for direct routing/tampering.
access_anchor = """  if(!view) return false;
  const permissionView = permissionViewFor_(view);"""
access_insert = """  if(!view) return false;
  if(view === 'omodos4' || view.startsWith('omodos4-')) return isSuperadmin();
  const permissionView = permissionViewFor_(view);"""
if access_anchor not in src:
    raise SystemExit("canAccessView_ anchor not found")
src = src.replace(access_anchor, access_insert, 1)

# 6) Invoke renderer when entering V4.
render_anchor = "  if(enteringView === 'dashboard') invokeViewRenderer_(enteringView, renderDashboardView, 'renderDashboardView');"
render_insert = render_anchor + "\n  if(enteringView === 'omodos4') invokeViewRenderer_(enteringView, renderOmodos4, 'renderOmodos4');"
if render_anchor not in src:
    raise SystemExit("switchToView renderer anchor not found")
src = src.replace(render_anchor, render_insert, 1)

# 7) Append isolated implementation before body close.
if "</body>" not in src:
    raise SystemExit("Missing </body> anchor")
src = src.replace("</body>", script + "\n</body>", 1)

# Safety checks
required = [
    "OMODOS4_PHASE1_SAFE",
    'id="v4-nav-group"',
    'id="view-omodos4"',
    "omodos4.view",
    "view.startsWith('omodos4-')",
    "window.OMODOS4",
    "function renderOmodos4()"
]
missing=[x for x in required if x not in src]
if missing:
    raise SystemExit("Post-patch validation missing: "+", ".join(missing))

path.write_text(src, encoding="utf-8")
print("Applied safe OMODOS 4 Phase 1 frontend shell.")
