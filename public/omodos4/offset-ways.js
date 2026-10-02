/* OMODOS Offset Ways + OMODOS 2.0 — additive UI module */
(function(){
'use strict';

var THEME_KEY = 'omodos-2.0';
var THEME_LABEL = 'OMODOS 2.0';
var PAGE_ID = 'view-offset-ways';
var NAV_ID = 'nav-offset-ways';
var STATE = { records: [], loaded: false, loading: false, saving: false, activeTab: 'overview', oee: null, teep: null, editingId: '' };
var BEHAVIORS = [
  {key:'daily-management', title:'Daily Management Discipline', local:'Disiplin Manajemen Harian', detail:'Review KPI secara rutin, tindak lanjuti aksi, dan pastikan rencana berjalan dengan baik.', icon:'ph-calendar-check'},
  {key:'fast-response', title:'Fast Problem Response', local:'Respons Cepat terhadap Masalah', detail:'Identifikasi masalah dengan cepat, libatkan tim lintas departemen, dan selesaikan bersama.', icon:'ph-lightning'},
  {key:'leader-follow-through', title:'Leader Follow Through', local:'Tindak Lanjut oleh Pemimpin', detail:'Turun langsung ke lapangan, memberi arahan, dan memastikan pelaksanaan konsisten sampai tuntas.', icon:'ph-users-three'},
  {key:'accountability', title:'Clear Accountability', local:'Tanggung Jawab yang Jelas', detail:'Perjelas peran, tanggung jawab, dan target; lakukan peninjauan secara terbuka.', icon:'ph-target'},
  {key:'decision-speed', title:'Decision at the Right Level', local:'Keputusan Cepat pada Level yang Tepat', detail:'Ambil keputusan yang tepat dan cepat sesuai kewenangan, berdasarkan data dan fakta.', icon:'ph-gauge'},
  {key:'standard-enforcement', title:'Standard Enforcement', local:'Konsistensi Menjalankan Standar', detail:'Pastikan standar kerja dijalankan secara konsisten oleh semua departemen.', icon:'ph-check-square'},
  {key:'leader-as-coach', title:'Leader as Coach', local:'Pemimpin yang Mendengar dan Mendukung', detail:'Dengarkan, dukung, dan ciptakan ruang bagi setiap orang untuk belajar serta berkembang.', icon:'ph-handshake'}
];
var TOOLS = [
  {n:5, title:'Cost Saving (OPEX)', local:'Penghematan Biaya Operasional', detail:'Mengurangi biaya operasional secara efektif dan berkelanjutan.', icon:'ph-coins', color:'blue'},
  {n:4, title:'OEE', local:'Availability, Performance, Quality', detail:'Meningkatkan efektivitas mesin dan pemanfaatan waktu produksi.', icon:'ph-chart-line-up', color:'orange'},
  {n:3, title:'Quality', local:'NC, Reject, Complaint', detail:'Menghasilkan produk sesuai standar dan menekan produk tidak sesuai.', icon:'ph-check-circle', color:'gold'},
  {n:2, title:'Keandalan Mesin', local:'MTBF, MTTR', detail:'Meningkatkan keandalan melalui perawatan yang efektif dan respons gangguan yang cepat.', icon:'ph-wrench', color:'green'},
  {n:1, title:'5R', local:'Ringkas, Rapi, Resik, Rawat, Rajin', detail:'Menciptakan lingkungan kerja yang rapi, aman, disiplin, dan efisien secara konsisten.', icon:'ph-broom', color:'navy'}
];
var MAINTENANCE_ROLES = [
  {n:1, title:'Menjaga Keandalan Mesin', tasks:['Preventive maintenance tepat waktu','Condition monitoring','Pemeriksaan komponen kritis','Menekan breakdown'], outcome:'Availability meningkat', icon:'ph-shield-check', color:'orange'},
  {n:2, title:'Mempercepat Respons Gangguan', tasks:['Respons cepat','Eskalasi jelas','Analisis awal yang tepat','Koordinasi lintas tim'], outcome:'Downtime turun, MTTR menurun', icon:'ph-clock-countdown', color:'blue'},
  {n:3, title:'Menjaga Kondisi Optimal', tasks:['Setting dan adjustment','Pelumasan, alignment, cleaning','Kontrol komponen utama'], outcome:'Performance lebih stabil', icon:'ph-gear', color:'gold'},
  {n:4, title:'Mendukung Kualitas Produk', tasks:['Menjaga akurasi mesin','Mencegah defect','Memastikan kondisi mesin stabil setelah perbaikan'], outcome:'Kualitas membaik', icon:'ph-check-circle', color:'green'},
  {n:5, title:'Menghilangkan Akar Masalah', tasks:['Root cause analysis (RCA)','Koreksi permanen','Standardisasi perbaikan','Lesson learned'], outcome:'Masalah tidak berulang', icon:'ph-target', color:'red'},
  {n:6, title:'Continuous Improvement', tasks:['Kaizen teknis','Modifikasi improvement','Mengurangi loss energi dan sparepart','Productive maintenance'], outcome:'Mendukung OEE, TEEP, dan cost saving', icon:'ph-trend-up', color:'blue'}
];

function $(id){ return document.getElementById(id); }
function esc(value){
  return String(value == null ? '' : value).replace(/[&<>"']/g, function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
}
function currentUser(){
  try { if(typeof CURRENT_USER !== 'undefined' && CURRENT_USER) return CURRENT_USER; } catch(e){}
  return window.CURRENT_USER || null;
}
function isSuperadmin(){
  var u = currentUser();
  return !!u && String(u.role || u.Role || '').toLowerCase() === 'superadmin';
}
function currentName(){
  var u = currentUser() || {};
  return String(u.displayName || u.DisplayName || u.username || u.Username || '');
}
function localDate(){
  var d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function num(id, fallback){
  var el = $(id);
  if(!el) return fallback;
  var value = String(el.value == null ? '' : el.value).trim();
  if(value === '') return NaN;
  var n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}
function fmt(value, decimals){
  if(!Number.isFinite(Number(value))) return '—';
  return Number(value).toLocaleString('id-ID',{minimumFractionDigits:decimals == null ? 1 : decimals, maximumFractionDigits:decimals == null ? 1 : decimals});
}
function pct(value){
  return Number.isFinite(value) ? fmt(value*100,1)+'%' : '—';
}
function hoursText(value){
  if(!Number.isFinite(value) || value < 0) return '—';
  var mins = Math.round(value*60);
  var h = Math.floor(mins/60);
  var m = mins%60;
  if(m === 60){ h++; m=0; }
  if(h && m) return h+' jam '+m+' menit';
  if(h) return h+' jam';
  return m+' menit';
}
function statusClass(status){
  var s = String(status || '').toLowerCase();
  if(s === 'done' || s === 'selesai') return 'done';
  if(s === 'in progress' || s === 'proses') return 'progress';
  return 'open';
}
function randomId(){
  try { if(window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID(); } catch(e){}
  return 'ow-'+Date.now()+'-'+Math.random().toString(36).slice(2,12);
}
function apiUrl(){
  try { return typeof WEB_APP_URL !== 'undefined' ? String(WEB_APP_URL || '') : ''; } catch(e){ return ''; }
}
function sessionToken(){
  try {
    if(typeof SETTING_AUTH_OK !== 'undefined' && SETTING_AUTH_OK && typeof SETTING_SESSION_TOKEN !== 'undefined' && SETTING_SESSION_TOKEN) return SETTING_SESSION_TOKEN;
    return typeof SESSION_TOKEN !== 'undefined' ? String(SESSION_TOKEN || '') : '';
  } catch(e){ return ''; }
}
async function apiRequest(action, payload){
  var url = apiUrl();
  var token = sessionToken();
  if(!url || !token) throw new Error('Sesi login belum siap. Muat ulang setelah masuk kembali.');
  var body = Object.assign({}, payload || {}, {action:action, sessionToken:token});
  if((action === 'offsetWaysSave' || action === 'offsetWaysDelete' || action === 'saveThemePref') && !body.transactionId) body.transactionId = randomId();
  var opts = {
    method:'POST', mode:'cors', credentials:'omit', redirect:'follow', cache:'no-store',
    headers:{'Content-Type':'text/plain;charset=utf-8'},
    body:JSON.stringify(body)
  };
  var res;
  if(typeof fetchWithTimeout_ === 'function') res = await fetchWithTimeout_(url, opts, 45000);
  else res = await fetch(url, opts);
  var json = typeof parseApiResponse_ === 'function' ? await parseApiResponse_(res) : await res.json();
  if(!json || json.ok !== true){
    var error = json && json.error;
    throw new Error(typeof error === 'string' ? error : (error && error.message) || ('Permintaan gagal ('+(res && res.status || 'tanpa status')+')'));
  }
  return Object.prototype.hasOwnProperty.call(json,'data') ? json.data : json;
}
function announce(message, kind){
  var el = $('ow-global-message');
  if(!el) return;
  el.textContent = message;
  el.className = 'ow-message' + (kind ? ' '+kind : '');
  el.style.display = 'block';
}
function syncFeatureRegistry(){
  try{
    if(typeof FEATURE_REGISTRY === 'undefined' || !Array.isArray(FEATURE_REGISTRY)) return;
    if(!FEATURE_REGISTRY.some(function(f){return f && f.PermissionKey === 'view.offset-ways';})){
      FEATURE_REGISTRY.push({PermissionKey:'view.offset-ways', Label:'Offset Ways', Group:'Pengaturan'});
    }
  }catch(e){}
}
function ensureNav(){
  var side = $('sidebar');
  var settings = side && side.querySelector('.nav-group-settings');
  if(!side || !settings) return null;
  var nav = $(NAV_ID);
  if(!nav){
    nav = document.createElement('div');
    nav.className = 'nav-group ow-admin-nav';
    nav.id = NAV_ID;
    nav.style.display = 'none';
    nav.innerHTML = '<button class="nav-btn" type="button" data-view="offset-ways"><span class="ico"><i class="ph-bold ph-compass-tool"></i></span> Offset Ways</button>';
    settings.parentNode.insertBefore(nav, settings);
    var button = nav.querySelector('[data-view="offset-ways"]');
    if(button) button.addEventListener('click', function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      if(!isSuperadmin()){ syncAuth(); return; }
      if(typeof window.goToView === 'function') window.goToView('offset-ways');
      else if(typeof goToView === 'function') goToView('offset-ways');
      else manualNavigate();
      setTimeout(onPageOpen, 40);
    });
  }
  syncFeatureRegistry();
  return nav;
}
function ensurePage(){
  var page = $(PAGE_ID);
  if(page) return page;
  var main = document.querySelector('.main');
  if(!main) return null;
  page = document.createElement('section');
  page.className = 'view ow-page';
  page.id = PAGE_ID;
  page.innerHTML = pageMarkup();
  main.appendChild(page);
  bindPageEvents(page);
  return page;
}
function manualNavigate(){
  var page = ensurePage();
  if(!page || !isSuperadmin()) return;
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  page.classList.add('active');
  document.querySelectorAll('.nav-btn[data-view],.bottom-nav-btn[data-view]').forEach(function(b){b.classList.toggle('active', b.getAttribute('data-view') === 'offset-ways');});
  onPageOpen();
}
function syncAuth(){
  ensureNav();
  var nav = $(NAV_ID);
  var page = $(PAGE_ID);
  var allowed = isSuperadmin();
  if(nav) nav.style.display = allowed ? '' : 'none';
  if(page){
    page.setAttribute('aria-hidden', allowed ? 'false' : 'true');
    if(!allowed){
      page.style.display = 'none';
      if(page.classList.contains('active')){
        page.classList.remove('active');
        var dashboard = $('view-dashboard');
        if(dashboard) dashboard.classList.add('active');
      }
    }else{
      page.style.display = '';
    }
  }
  applySavedThemePreference();
}
function pageMarkup(){
  return '<div class="topbar ow-page-topbar"><div><div class="ow-eyebrow">BMJ PACKAGING OFFSET · TECHNICAL DEPARTMENT</div><h1>OFFSET <span>WAYS</span></h1><div class="sub">Our Motto, Our Duty, Our Strategy — panduan kerja untuk mencapai Operational Excellence.</div></div><div class="ow-online"><span></span> PEDOMAN DEPARTEMEN</div></div>'+
  '<div id="ow-global-message" class="ow-message" style="display:none" role="status"></div>'+
  '<div class="ow-hero"><div class="ow-hero-copy"><div class="ow-brandline"><span class="ow-bmj-square"></span><b>BMJ</b><i></i><span>Packaging Offset<br>Technical Department</span></div><div class="ow-hero-title">OFFSET <em>WAYS</em></div><div class="ow-hero-ribbon">OMODOS: Our Motto, Our Duty, Our Strategy</div><p>Tools memberi tahu apa yang perlu diperbaiki. Perilaku memastikan perbaikan benar-benar terlaksana.</p></div><div class="ow-hero-graphic" aria-hidden="true"><div class="ow-orbit ow-orbit-a"></div><div class="ow-orbit ow-orbit-b"></div><div class="ow-gear"><i class="ph-bold ph-target"></i></div><div class="ow-graphic-pill ow-pill-a">SAFETY</div><div class="ow-graphic-pill ow-pill-b">QUALITY</div><div class="ow-graphic-pill ow-pill-c">ZERO LOSS</div></div></div>'+
  '<div class="ow-tabs" role="tablist" aria-label="Bagian Offset Ways">'+
    '<button type="button" class="ow-tab active" role="tab" aria-selected="true" data-ow-tab="overview"><i class="ph-bold ph-compass-tool"></i> Isi Poster</button>'+
    '<button type="button" class="ow-tab" role="tab" aria-selected="false" data-ow-tab="oee"><i class="ph-bold ph-chart-line-up"></i> Kalkulator OEE</button>'+
    '<button type="button" class="ow-tab" role="tab" aria-selected="false" data-ow-tab="teep"><i class="ph-bold ph-calendar-clock"></i> Kalkulator TEEP</button>'+
    '<button type="button" class="ow-tab" role="tab" aria-selected="false" data-ow-tab="actions"><i class="ph-bold ph-list-checks"></i> Tindak Lanjut</button>'+
  '</div>'+
  '<div class="ow-pane" data-ow-pane="overview">'+overviewMarkup()+'</div>'+
  '<div class="ow-pane" data-ow-pane="oee" style="display:none">'+oeeMarkup()+'</div>'+
  '<div class="ow-pane" data-ow-pane="teep" style="display:none">'+teepMarkup()+'</div>'+
  '<div class="ow-pane" data-ow-pane="actions" style="display:none">'+actionsMarkup()+'</div>'+
  '<div class="ow-footer"><i class="ph-bold ph-target"></i><b>Operational Excellence</b><span>=</span><strong>Strong Tools</strong><span>+</span><em>Right Behaviors</em><small>#togethermovingforward</small></div>';
}
function overviewMarkup(){
  var motto = [
    {title:'Safety First', local:'Utamakan Keselamatan', icon:'ph-shield-plus', color:'green'},
    {title:'Quality #1', local:'Kualitas Nomor Satu', icon:'ph-medal', color:'orange'},
    {title:'Zero Losses', local:'Menuju Nol Kerugian', icon:'ph-chart-line-up', color:'blue'},
    {title:'100% Ownership', local:'Tanggung Jawab Bersama', icon:'ph-users-three', color:'orange'}
  ];
  var mottoHtml = motto.map(function(x){return '<article class="ow-value-card '+x.color+'"><div class="ow-value-icon"><i class="ph-bold '+x.icon+'"></i></div><div><b>'+esc(x.title)+'</b><span>'+esc(x.local)+'</span></div></article>';}).join('');
  var toolsHtml = TOOLS.map(function(x){return '<article class="ow-tool-card '+x.color+'"><div class="ow-tool-number">'+x.n+'</div><div class="ow-tool-icon"><i class="ph-bold '+x.icon+'"></i></div><div class="ow-tool-copy"><h4>'+esc(x.title)+'</h4><b>'+esc(x.local)+'</b><p>'+esc(x.detail)+'</p></div></article>';}).join('');
  var behaviorHtml = BEHAVIORS.map(function(x,i){return '<article class="ow-behavior-card"><div class="ow-behavior-no">'+(i+1)+'</div><div class="ow-behavior-icon"><i class="ph-bold '+x.icon+'"></i></div><div class="ow-behavior-copy"><h4>'+esc(x.title)+'</h4><b>'+esc(x.local)+'</b><p>'+esc(x.detail)+'</p></div></article>';}).join('');
  var roleHtml = MAINTENANCE_ROLES.map(function(x){return '<article class="ow-role-card '+x.color+'"><div class="ow-role-head"><span>'+x.n+'</span><i class="ph-bold '+x.icon+'"></i><h4>'+esc(x.title)+'</h4></div><ul>'+x.tasks.map(function(t){return '<li>'+esc(t)+'</li>';}).join('')+'</ul><div class="ow-role-outcome">'+esc(x.outcome)+'</div></article>';}).join('');
  return '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">OUR MOTTO</span><h2>Nilai yang Menjadi Pegangan</h2></div><p>Nilai bersama untuk setiap keputusan dan aktivitas di area kerja.</p></div><div class="ow-motto-grid">'+mottoHtml+'</div></section>'+
  '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">OUR DUTY</span><h2>Aliran Material dan Informasi</h2></div><p>Pastikan material dan informasi pendukung mengalir lancar, akurat, serta tepat waktu.</p></div><div class="ow-duty-panel"><div class="ow-duty-statement">Memastikan material beserta informasi pendukungnya mengalir lancar mulai dari <b>RMS</b> hingga <b>FPS</b>.</div><div class="ow-flowline"><div class="ow-flow-node"><i class="ph-bold ph-package"></i><b>Material</b></div><span class="ow-flow-plus">+</span><div class="ow-flow-node"><i class="ph-bold ph-file-text"></i><b>Informasi</b></div><span class="ow-flow-arrow"><i class="ph-bold ph-arrow-right"></i></span><div class="ow-flow-node ow-flow-point"><b>RMS</b><small>Titik awal</small></div><span class="ow-flow-arrow"><i class="ph-bold ph-arrow-right"></i></span><div class="ow-flow-node ow-flow-process"><i class="ph-bold ph-lightning"></i><b>Proses lancar</b></div><span class="ow-flow-arrow"><i class="ph-bold ph-arrow-right"></i></span><div class="ow-flow-node ow-flow-point"><b>FPS</b><small>Titik akhir</small></div></div><div class="ow-note"><i class="ph-bold ph-info"></i> Gunakan kepanjangan resmi RMS dan FPS sesuai istilah internal BMJ; diagram ini tidak mengasumsikan kepanjangan kedua singkatan tersebut.</div></div></section>'+
  '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">OUR STRATEGY</span><h2>2 Lapisan Operational Excellence</h2></div><p>Tools menjelaskan apa yang ditingkatkan. Perilaku menjelaskan bagaimana perubahan diwujudkan.</p></div><div class="ow-strategy-grid"><div class="ow-strategy-column"><div class="ow-column-head tools"><i class="ph-bold ph-gear-six"></i><div><b>Layer 1 — Tools</b><span>What we improve · Apa yang kita tingkatkan</span></div></div><div class="ow-tool-stack">'+toolsHtml+'</div><div class="ow-direction-note"><i class="ph-bold ph-arrow-up-right"></i> Dibaca dari fondasi 5R menuju hasil: keandalan, kualitas, OEE, lalu penghematan biaya.</div></div><div class="ow-strategy-column"><div class="ow-column-head behaviors"><i class="ph-bold ph-users-three"></i><div><b>Layer 2 — Behaviors</b><span>How we make it happen · Cara kita mewujudkannya</span></div></div><div class="ow-behavior-stack">'+behaviorHtml+'</div></div></div><div class="ow-synthesis"><i class="ph-bold ph-lightbulb"></i><span><b>Tools</b> tells us <strong>what</strong> to improve. <b>Behaviors</b> tells us <strong>how</strong> to make it happen.</span></div></section>'+
  '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">MAINTENANCE ROLE</span><h2>6 Peran Tim Maintenance</h2></div><p>Dari mencegah kerusakan hingga menghilangkan akar masalah dan meningkatkan hasil operasional.</p></div><div class="ow-role-grid">'+roleHtml+'</div><div class="ow-maintenance-summary"><i class="ph-bold ph-gear-six"></i><span>Maintenance mendukung <b>keandalan mesin, kestabilan proses, kualitas produk, dan perbaikan berkelanjutan.</b></span></div></section>';
}
function oeeMarkup(){
  return '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">OVERALL EQUIPMENT EFFECTIVENESS</span><h2>Kalkulator OEE</h2></div><p>Masukkan data aktual satu shift. Hasil dihitung otomatis, dan dapat disimpan ke database OMODOS.</p></div><div class="ow-form-layout"><form id="ow-oee-form" class="ow-form-card"><div class="ow-form-heading"><i class="ph-bold ph-sliders-horizontal"></i><div><b>Data masukan</b><span>Contoh awal mengikuti angka pada poster.</span></div></div><div class="ow-form-grid"><label class="ow-field ow-field-wide">Mesin / area<input id="ow-oee-machine" type="text" maxlength="120" placeholder="Contoh: Offset Press #5"></label><label class="ow-field">Tanggal pengukuran<input id="ow-oee-date" type="date" required></label><label class="ow-field">Shift<select id="ow-oee-shift"><option value="1">Shift 1</option><option value="2">Shift 2</option><option value="3">Shift 3</option><option value="Gabungan">Gabungan shift</option></select></label><label class="ow-field">Plant Operating Time (jam)<input id="ow-oee-pot" type="number" min="0.01" step="0.01" value="8" required><small>Waktu operasi pabrik dalam contoh.</small></label><label class="ow-field">Planned Shutdown (jam)<input id="ow-oee-psd" type="number" min="0" step="0.01" value="1" required><small>Waktu yang tidak dijadwalkan untuk produksi.</small></label><label class="ow-field">Downtime saat jadwal produksi (jam)<input id="ow-oee-downtime" type="number" min="0" step="0.01" value="1" required><small>Gangguan selama waktu produksi terjadwal.</small></label><label class="ow-field">Kecepatan ideal (lembar/jam)<input id="ow-oee-speed" type="number" min="0.01" step="1" value="15000" required></label><label class="ow-field">Total produksi (lembar)<input id="ow-oee-total" type="number" min="0" step="1" value="72000" required></label><label class="ow-field">Produk baik (lembar)<input id="ow-oee-good" type="number" min="0" step="1" value="70000" required></label></div><div class="ow-form-actions"><button class="ow-btn primary" type="button" data-ow-save-oee><i class="ph-bold ph-floppy-disk"></i> Simpan perhitungan</button><span>Data baru tersimpan hanya setelah tombol dipilih.</span></div></form><div class="ow-result-card"><div class="ow-result-heading"><i class="ph-bold ph-chart-line-up"></i><div><b>Hasil perhitungan</b><span>Berubah otomatis saat input diubah.</span></div></div><div id="ow-oee-results"></div></div></div><div class="ow-explain-strip"><div><b>Availability</b><span>Operating Time ÷ Planned Production Time</span></div><div><b>Performance</b><span>Total produksi ÷ output ideal selama Operating Time</span></div><div><b>Quality</b><span>Produk baik ÷ total produksi</span></div></div><div class="ow-subsection-head"><h3>Riwayat perhitungan OEE</h3><span>Disimpan di database, bukan hanya di browser.</span></div><div id="ow-oee-history" class="ow-record-list"></div></section>';
}
function teepMarkup(){
  return '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">TOTAL EFFECTIVE EQUIPMENT PERFORMANCE</span><h2>Kalkulator TEEP</h2></div><p>TEEP = OEE × Utilization. Contoh 3 shift menggunakan asumsi setiap shift memiliki jam dan hasil yang sama.</p></div><div class="ow-form-layout"><form id="ow-teep-form" class="ow-form-card"><div class="ow-form-heading"><i class="ph-bold ph-calendar-clock"></i><div><b>Waktu kalender dan jadwal produksi</b><span>Isi sesuai periode yang ingin dinilai.</span></div></div><div class="ow-form-grid"><label class="ow-field ow-field-wide">Mesin / area<input id="ow-teep-machine" type="text" maxlength="120" placeholder="Samakan dengan data OEE bila relevan"></label><label class="ow-field">Tanggal pengukuran<input id="ow-teep-date" type="date" required></label><label class="ow-field">Jumlah shift per hari<input id="ow-teep-shifts" type="number" min="1" max="4" step="1" value="3" required></label><label class="ow-field">Jam per shift<input id="ow-teep-hours" type="number" min="0.01" step="0.01" value="8" required></label><label class="ow-field">Planned Shutdown per shift (jam)<input id="ow-teep-psd" type="number" min="0" step="0.01" value="1" required></label><label class="ow-field ow-field-wide ow-checkbox-field"><input id="ow-teep-use-oee" type="checkbox" checked><span><b>Gunakan hasil OEE dari kalkulator OEE</b><small>Matikan pilihan ini bila ingin memasukkan OEE secara manual.</small></span></label><label class="ow-field" id="ow-teep-manual-wrap">OEE manual (%)<input id="ow-teep-manual-oee" type="number" min="0" max="100" step="0.01" value="66.67" disabled></label></div><div class="ow-form-actions"><button class="ow-btn primary" type="button" data-ow-save-teep><i class="ph-bold ph-floppy-disk"></i> Simpan perhitungan</button><span>Hasil akan dihitung ulang saat input berubah.</span></div></form><div class="ow-result-card"><div class="ow-result-heading"><i class="ph-bold ph-calendar-check"></i><div><b>Hasil pemanfaatan waktu</b><span>Ringkasan per shift dan periode kalender.</span></div></div><div id="ow-teep-results"></div></div></div><div class="ow-note ow-note-prominent"><i class="ph-bold ph-info"></i><span>TEEP harian yang ditampilkan adalah ilustrasi jika setiap shift mempunyai OEE dan jadwal yang sama. Untuk hasil aktual, gunakan data seluruh shift dalam periode yang sama.</span></div><div class="ow-subsection-head"><h3>Riwayat perhitungan TEEP</h3><span>Data tersimpan di database OMODOS.</span></div><div id="ow-teep-history" class="ow-record-list"></div></section>';
}
function actionsMarkup(){
  var options = BEHAVIORS.map(function(b){return '<option value="'+esc(b.key)+'">'+esc(b.local)+'</option>';}).join('');
  return '<section class="ow-section"><div class="ow-section-heading"><div><span class="ow-kicker">BEHAVIORS → ACTIONS</span><h2>Tindak Lanjut dan Akuntabilitas</h2></div><p>Ubah prinsip perilaku menjadi aksi yang mempunyai penanggung jawab, tenggat, dan status yang dapat ditinjau kembali.</p></div><div class="ow-action-layout"><form id="ow-action-form" class="ow-form-card"><div class="ow-form-heading"><i class="ph-bold ph-list-checks"></i><div><b id="ow-action-form-title">Catat tindak lanjut</b><span>Semua catatan disimpan ke database OMODOS.</span></div></div><input id="ow-action-id" type="hidden" value=""><div class="ow-form-grid"><label class="ow-field ow-field-wide">Perilaku yang diterapkan<select id="ow-action-behavior" required>'+options+'</select></label><label class="ow-field ow-field-wide">Aksi / masalah yang ditindaklanjuti<input id="ow-action-title" type="text" maxlength="160" required placeholder="Contoh: Review downtime berulang pada unit feeder"></label><label class="ow-field">Penanggung jawab<input id="ow-action-owner" type="text" maxlength="120" required placeholder="Nama penanggung jawab"></label><label class="ow-field">Tenggat waktu<input id="ow-action-due" type="date"></label><label class="ow-field">Mesin / area (opsional)<input id="ow-action-machine" type="text" maxlength="120" placeholder="Nama mesin atau area"></label><label class="ow-field">Status<select id="ow-action-status"><option value="Open">Belum mulai</option><option value="In Progress">Sedang dikerjakan</option><option value="Done">Selesai</option></select></label><label class="ow-field ow-field-wide">Catatan / bukti tindak lanjut<textarea id="ow-action-notes" rows="4" maxlength="4000" placeholder="Catat tindakan, hasil review, atau bukti penyelesaian."></textarea></label></div><div class="ow-form-actions"><button class="ow-btn primary" id="ow-action-submit" type="submit"><i class="ph-bold ph-floppy-disk"></i> Simpan tindak lanjut</button><button class="ow-btn secondary" id="ow-action-cancel" type="button" data-ow-cancel-edit style="display:none">Batal edit</button><span>Catatan dapat diperbarui atau dihapus oleh Superadmin.</span></div></form><div class="ow-action-guidance"><div class="ow-guidance-head"><i class="ph-bold ph-users-three"></i><b>7 perilaku yang dapat dipilih</b></div><div class="ow-guidance-list">'+BEHAVIORS.map(function(b,i){return '<div><span>'+(i+1)+'</span><p><b>'+esc(b.local)+'</b><small>'+esc(b.detail)+'</small></p></div>';}).join('')+'</div></div></div><div class="ow-subsection-head"><h3>Daftar tindak lanjut</h3><span id="ow-action-count">Memuat data…</span></div><div id="ow-behavior-list" class="ow-record-list"></div><div class="ow-subsection-head"><h3>Riwayat kalkulator</h3><span>Perhitungan OEE dan TEEP yang sudah disimpan.</span></div><div id="ow-calculation-history" class="ow-record-list"></div><div id="ow-records-status" class="ow-records-status">Menyiapkan sinkronisasi database…</div></section>';
}
function fieldNumber(id, fallback){return num(id, fallback);}
function oeeInputs(){
  return {
    machine: $('ow-oee-machine') ? $('ow-oee-machine').value.trim() : '',
    date: $('ow-oee-date') ? $('ow-oee-date').value : localDate(),
    shift: $('ow-oee-shift') ? $('ow-oee-shift').value : '1',
    pot: fieldNumber('ow-oee-pot',8),
    psd: fieldNumber('ow-oee-psd',1),
    downtime: fieldNumber('ow-oee-downtime',1),
    speed: fieldNumber('ow-oee-speed',15000),
    total: fieldNumber('ow-oee-total',72000),
    good: fieldNumber('ow-oee-good',70000)
  };
}
function calculateOee(input){
  var p=input||oeeInputs();
  var errors=[];
  if(!Number.isFinite(p.pot) || !(p.pot > 0)) errors.push('Plant Operating Time harus lebih dari 0.');
  if(!Number.isFinite(p.psd) || p.psd < 0 || p.psd >= p.pot) errors.push('Planned Shutdown harus 0 atau lebih, dan lebih kecil daripada Plant Operating Time.');
  var ppt=Math.max(0,p.pot-p.psd);
  if(!Number.isFinite(p.downtime) || p.downtime < 0 || p.downtime > ppt) errors.push('Downtime tidak boleh melebihi Planned Production Time.');
  if(!Number.isFinite(p.speed) || !(p.speed > 0)) errors.push('Kecepatan ideal harus lebih dari 0.');
  if(!Number.isFinite(p.total) || !(p.total > 0)) errors.push('Total produksi harus lebih dari 0.');
  if(!Number.isFinite(p.good) || p.good < 0 || p.good > p.total) errors.push('Produk baik harus berada di antara 0 dan total produksi.');
  var op=Math.max(0,ppt-p.downtime);
  var theoretical=op*p.speed;
  var availability=ppt>0 ? op/ppt : 0;
  var performance=theoretical>0 ? p.total/theoretical : 0;
  var quality=p.total>0 ? p.good/p.total : 0;
  var oee=availability*performance*quality;
  var netHours=p.speed>0 ? p.total/p.speed : 0;
  var goodHours=p.speed>0 ? p.good/p.speed : 0;
  var speedLoss=op-netHours;
  var qualityLoss=p.speed>0 ? (p.total-p.good)/p.speed : 0;
  var warnings=[];
  if(theoretical>0 && p.total>theoretical) warnings.push('Total produksi melebihi output ideal berdasarkan waktu operasi. Periksa jam operasi dan kecepatan ideal.');
  if(speedLoss < -0.0001) warnings.push('Waktu ekuivalen output melebihi waktu operasi. Periksa konsistensi data.');
  return {valid:errors.length===0, errors:errors, warnings:warnings, pot:p.pot, psd:p.psd, ppt:ppt, downtime:p.downtime, operating:op, speed:p.speed, total:p.total, good:p.good, theoretical:theoretical, availability:availability, performance:performance, quality:quality, oee:oee, netHours:netHours, goodHours:goodHours, speedLoss:Math.max(0,speedLoss), qualityLoss:qualityLoss};
}
function metricCard(title,value,subtitle,color){
  return '<div class="ow-metric '+(color||'')+'"><span>'+esc(title)+'</span><b>'+esc(value)+'</b><small>'+esc(subtitle||'')+'</small></div>';
}
function renderOeeResults(){
  var target=$('ow-oee-results');
  if(!target) return;
  var input=oeeInputs();
  var r=calculateOee(input);
  STATE.oee=r;
  var html='<div class="ow-metrics-grid">'+
    metricCard('OEE',pct(r.oee),'OEE = Availability × Performance × Quality','primary')+
    metricCard('Availability',pct(r.availability),'Operating Time ÷ PPT','blue')+
    metricCard('Performance',pct(r.performance),'Output aktual ÷ output ideal','orange')+
    metricCard('Quality',pct(r.quality),'Produk baik ÷ total produksi','green')+
  '</div><div class="ow-time-breakdown"><h4>Bagaimana waktu digunakan?</h4>'+
    '<div><span>Planned Production Time</span><b>'+hoursText(r.ppt)+'</b></div>'+
    '<div><span>Operating Time</span><b>'+hoursText(r.operating)+'</b></div>'+
    '<div><span>Net Operating Time</span><b>'+hoursText(r.netHours)+'</b></div>'+
    '<div><span>Fully Productive Time</span><b>'+hoursText(r.goodHours)+'</b></div>'+
    '<div><span>Downtime</span><b>'+hoursText(r.downtime)+'</b></div>'+
    '<div><span>Speed loss (ekuivalen waktu)</span><b>'+hoursText(r.speedLoss)+'</b></div>'+
    '<div><span>Quality loss (ekuivalen waktu)</span><b>'+hoursText(r.qualityLoss)+'</b></div>'+
  '</div>';
  if(r.errors.length) html+='<div class="ow-alert error"><b>Periksa input:</b><ul>'+r.errors.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  if(r.warnings.length) html+='<div class="ow-alert warning">'+r.warnings.map(esc).join('<br>')+'</div>';
  target.innerHTML=html;
  updateTeepResults();
}
function teepInputs(){
  var use=$('ow-teep-use-oee');
  var linked=!!(use && use.checked);
  var oee=linked ? (STATE.oee && STATE.oee.valid ? STATE.oee.oee : null) : fieldNumber('ow-teep-manual-oee',66.67)/100;
  return {
    machine: $('ow-teep-machine') ? $('ow-teep-machine').value.trim() : '',
    date: $('ow-teep-date') ? $('ow-teep-date').value : localDate(),
    shifts: fieldNumber('ow-teep-shifts',3),
    hours: fieldNumber('ow-teep-hours',8),
    psd: fieldNumber('ow-teep-psd',1),
    useOee: linked,
    oee: oee,
    manualOee: fieldNumber('ow-teep-manual-oee',66.67)
  };
}
function calculateTeep(input){
  var p=input||teepInputs(), errors=[], warnings=[];
  if(!(p.shifts>=1 && p.shifts<=4 && Math.floor(p.shifts)===p.shifts)) errors.push('Jumlah shift harus bilangan bulat antara 1 dan 4.');
  if(!(p.hours>0)) errors.push('Jam per shift harus lebih dari 0.');
  if(!Number.isFinite(p.psd) || p.psd<0 || p.psd>=p.hours) errors.push('Planned Shutdown harus 0 atau lebih dan lebih kecil daripada jam per shift.');
  if(p.oee==null || !Number.isFinite(p.oee)) errors.push('Hasil OEE belum valid. Periksa kalkulator OEE atau masukkan OEE manual.');
  else if(p.oee<0 || p.oee>1) errors.push('OEE harus berada pada rentang 0–100%. Periksa kembali data sumber.');
  var calendar=p.shifts*p.hours;
  var pptPer=Math.max(0,p.hours-p.psd);
  var planned=p.shifts*pptPer;
  var shutdown=p.shifts*p.psd;
  var util=calendar>0 ? planned/calendar : 0;
  var teep=(p.oee==null || !Number.isFinite(p.oee)) ? 0 : p.oee*util;
  var productive=calendar*teep;
  return {valid:errors.length===0, errors:errors, warnings:warnings, shifts:p.shifts, hours:p.hours, psdPer:p.psd, calendar:calendar, pptPer:pptPer, planned:planned, shutdown:shutdown, utilization:util, oee:p.oee, teep:teep, productive:productive};
}
function updateTeepResults(){
  var target=$('ow-teep-results');
  if(!target) return;
  var manualWrap=$('ow-teep-manual-oee');
  var use=$('ow-teep-use-oee');
  if(manualWrap && use) manualWrap.disabled=use.checked;
  var p=teepInputs();
  var r=calculateTeep(p);
  STATE.teep=r;
  var html='<div class="ow-formula-band"><span>TEEP</span><b>OEE × Utilization</b></div>'+
    '<div class="ow-metrics-grid ow-teep-metrics">'+
      metricCard('TEEP',pct(r.teep),'Efektivitas terhadap waktu kalender','primary')+
      metricCard('OEE yang dipakai',p.oee==null?'—':pct(p.oee),p.useOee?'Terhubung ke kalkulator OEE':'OEE manual','blue')+
      metricCard('Utilization',pct(r.utilization),'PPT total ÷ waktu kalender','purple')+
      metricCard('Waktu produktif ekuivalen',hoursText(r.productive),'Dari '+fmt(r.calendar,1)+' jam waktu kalender','green')+
    '</div><div class="ow-time-breakdown"><h4>Ringkasan waktu</h4>'+
      '<div><span>Waktu kalender</span><b>'+hoursText(r.calendar)+'</b></div>'+
      '<div><span>PPT per shift</span><b>'+hoursText(r.pptPer)+'</b></div>'+
      '<div><span>Total PPT semua shift</span><b>'+hoursText(r.planned)+'</b></div>'+
      '<div><span>Total Planned Shutdown</span><b>'+hoursText(r.shutdown)+'</b></div>'+
      '<div><span>Utilization per shift</span><b>'+pct(r.hours>0?r.pptPer/r.hours:0)+'</b></div>'+
    '</div>';
  if(r.errors.length) html+='<div class="ow-alert error"><b>Periksa input:</b><ul>'+r.errors.map(function(x){return '<li>'+esc(x)+'</li>';}).join('')+'</ul></div>';
  if(r.warnings.length) html+='<div class="ow-alert warning">'+r.warnings.map(esc).join('<br>')+'</div>';
  target.innerHTML=html;
}
function activateTab(name){
  STATE.activeTab=name;
  var page=$(PAGE_ID); if(!page)return;
  page.querySelectorAll('[data-ow-tab]').forEach(function(b){
    var on=b.getAttribute('data-ow-tab')===name;
    b.classList.toggle('active',on);
    b.setAttribute('aria-selected',on?'true':'false');
  });
  page.querySelectorAll('[data-ow-pane]').forEach(function(p){
    p.style.display=p.getAttribute('data-ow-pane')===name?'':'none';
  });
  if(name==='oee') renderOeeResults();
  if(name==='teep') updateTeepResults();
  if(name==='actions') renderRecords();
}
function bindPageEvents(page){
  if(page.__owBound) return;
  page.__owBound=true;
  page.addEventListener('click',function(ev){
    var tab=ev.target.closest && ev.target.closest('[data-ow-tab]');
    if(tab){ev.preventDefault();activateTab(tab.getAttribute('data-ow-tab'));return;}
    if(ev.target.closest && ev.target.closest('[data-ow-save-oee]')){ev.preventDefault();saveCalculation('oee');return;}
    if(ev.target.closest && ev.target.closest('[data-ow-save-teep]')){ev.preventDefault();saveCalculation('teep');return;}
    var del=ev.target.closest && ev.target.closest('[data-ow-delete]');
    if(del){ev.preventDefault();deleteRecord(del.getAttribute('data-ow-delete'));return;}
    var load=ev.target.closest && ev.target.closest('[data-ow-load]');
    if(load){ev.preventDefault();loadCalculation(load.getAttribute('data-ow-load'));return;}
    var edit=ev.target.closest && ev.target.closest('[data-ow-edit]');
    if(edit){ev.preventDefault();editBehavior(edit.getAttribute('data-ow-edit'));return;}
    if(ev.target.closest && ev.target.closest('[data-ow-cancel-edit]')){ev.preventDefault();resetActionForm();return;}
  });
  page.addEventListener('input',function(ev){
    if(ev.target.closest && (ev.target.closest('#ow-oee-form') || ev.target.closest('#ow-teep-form'))){
      renderOeeResults();
    }
  });
  page.addEventListener('change',function(ev){
    if(ev.target.id==='ow-teep-use-oee') updateTeepResults();
    if(ev.target.closest && (ev.target.closest('#ow-oee-form') || ev.target.closest('#ow-teep-form'))) renderOeeResults();
  });
  var form=$('ow-action-form');
  if(form) form.addEventListener('submit',function(ev){ev.preventDefault();saveBehavior();});
}
function payloadForRow(row){
  try{return JSON.parse(row.PayloadJSON || '{}');}catch(e){return {};}
}
function recordsOfType(type){
  return STATE.records.filter(function(r){return r && r.Type===type;});
}
function recordDate(row){
  return row.UpdatedAt || row.CreatedAt || '';
}
function labelDate(value){
  if(!value) return 'Tanggal tidak diisi';
  var d=new Date(value);
  if(Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});
}
function behaviorTitle(key){
  var b=BEHAVIORS.find(function(x){return x.key===key;});
  return b ? b.local : 'Tindak lanjut';
}
function recordCard(row, kind){
  var payload=payloadForRow(row);
  var isBehavior=row.Type==='behavior-action';
  var machine=row.Machine ? '<span><i class="ph-bold ph-factory"></i> '+esc(row.Machine)+'</span>' : '';
  var owner=row.Owner ? '<span><i class="ph-bold ph-user"></i> '+esc(row.Owner)+'</span>' : '';
  var due=row.DueDate ? '<span><i class="ph-bold ph-calendar"></i> Tenggat '+esc(row.DueDate)+'</span>' : '';
  var status=row.Status || 'Tersimpan';
  var details='';
  if(isBehavior){
    details='<div class="ow-record-category">'+esc(behaviorTitle(payload.behavior))+'</div>'+
      (payload.notes?'<p>'+esc(payload.notes)+'</p>':'')+
      '<div class="ow-record-meta">'+owner+machine+due+'</div>';
  }else{
    var result=payload.result || {};
    var summary=row.Type==='oee-calculation'
      ? 'OEE '+pct(Number(result.oee))+' · Availability '+pct(Number(result.availability))+' · Performance '+pct(Number(result.performance))+' · Quality '+pct(Number(result.quality))
      : 'TEEP '+pct(Number(result.teep))+' · Utilization '+pct(Number(result.utilization))+' · OEE '+pct(Number(result.oee));
    details='<div class="ow-record-category">'+(row.Type==='oee-calculation'?'Perhitungan OEE':'Perhitungan TEEP')+'</div><p>'+esc(summary)+'</p><div class="ow-record-meta">'+machine+'<span><i class="ph-bold ph-clock"></i> '+esc(labelDate(recordDate(row)))+'</span></div>';
  }
  var actions=isBehavior
    ? '<button class="ow-mini-btn" type="button" data-ow-edit="'+esc(row.ID)+'"><i class="ph-bold ph-pencil-simple"></i> Edit</button>'
    : '<button class="ow-mini-btn" type="button" data-ow-load="'+esc(row.ID)+'"><i class="ph-bold ph-arrow-u-up-left"></i> Muat</button>';
  actions+='<button class="ow-mini-btn danger" type="button" data-ow-delete="'+esc(row.ID)+'"><i class="ph-bold ph-trash"></i> Hapus</button>';
  return '<article class="ow-record-card"><div class="ow-record-icon '+(isBehavior?'behavior':row.Type==='oee-calculation'?'oee':'teep')+'"><i class="ph-bold '+(isBehavior?'ph-list-checks':row.Type==='oee-calculation'?'ph-chart-line-up':'ph-calendar-clock')+'"></i></div><div class="ow-record-main"><div class="ow-record-top"><h4>'+esc(row.Title||'Catatan Offset Ways')+'</h4><span class="ow-status '+statusClass(status)+'">'+esc(status==='Open'?'Belum mulai':status==='In Progress'?'Sedang dikerjakan':status==='Done'?'Selesai':status)+'</span></div>'+details+'<small class="ow-record-time">Diperbarui '+esc(labelDate(recordDate(row)))+'</small></div><div class="ow-record-actions">'+actions+'</div></article>';
}
function renderList(targetId, rows, kind, emptyText){
  var target=$(targetId);
  if(!target)return;
  if(!rows.length){target.innerHTML='<div class="ow-empty"><i class="ph-bold ph-folder-open"></i><b>Belum ada catatan</b><span>'+esc(emptyText||'Catatan akan tampil di sini setelah disimpan.')+'</span></div>';return;}
  target.innerHTML=rows.map(function(r){return recordCard(r,kind);}).join('');
}
function renderRecords(){
  var actions=recordsOfType('behavior-action').sort(function(a,b){return String(recordDate(b)).localeCompare(String(recordDate(a)));});
  var calcs=STATE.records.filter(function(r){return r && (r.Type==='oee-calculation'||r.Type==='teep-calculation');}).sort(function(a,b){return String(recordDate(b)).localeCompare(String(recordDate(a)));});
  renderList('ow-behavior-list',actions,'behavior','Isi formulir di atas untuk mencatat tindak lanjut berdasarkan salah satu dari tujuh perilaku.');
  renderList('ow-calculation-history',calcs,'calculation','Simpan hasil dari kalkulator OEE atau TEEP untuk melihat riwayatnya.');
  renderList('ow-oee-history',recordsOfType('oee-calculation').sort(function(a,b){return String(recordDate(b)).localeCompare(String(recordDate(a)));}),'oee','Simpan hasil perhitungan OEE untuk membuat riwayat.');
  renderList('ow-teep-history',recordsOfType('teep-calculation').sort(function(a,b){return String(recordDate(b)).localeCompare(String(recordDate(a)));}),'teep','Simpan hasil perhitungan TEEP untuk membuat riwayat.');
  var count=$('ow-action-count');
  if(count) count.textContent=actions.length+' tindak lanjut · '+actions.filter(function(x){return x.Status==='Done';}).length+' selesai';
  var status=$('ow-records-status');
  if(status){
    status.className='ow-records-status success';
    status.textContent='Tersinkron ke database OMODOS · '+STATE.records.length+' catatan tersimpan.';
  }
}
async function loadRecords(){
  if(!isSuperadmin() || STATE.loading) return;
  STATE.loading=true;
  var status=$('ow-records-status');
  if(status){status.className='ow-records-status';status.textContent='Mengambil catatan dari database OMODOS…';}
  try{
    var data=await apiRequest('offsetWaysRead',{});
    STATE.records=Array.isArray(data)?data:[];
    STATE.loaded=true;
    renderRecords();
  }catch(err){
    STATE.loaded=false;
    if(status){status.className='ow-records-status error';status.textContent='Sinkronisasi belum berhasil: '+String(err.message||err)+'. Perhitungan masih bisa digunakan, tetapi data belum tersimpan/terbaca.';}
    renderRecords();
  }finally{STATE.loading=false;}
}
function onPageOpen(){
  if(!isSuperadmin()){
    syncAuth();
    return;
  }
  var page=ensurePage();
  if(!page)return;
  renderOeeResults();
  if($('ow-oee-date') && !$('ow-oee-date').value) $('ow-oee-date').value=localDate();
  if($('ow-teep-date') && !$('ow-teep-date').value) $('ow-teep-date').value=localDate();
  if($('ow-action-owner') && !$('ow-action-owner').value) $('ow-action-owner').value=currentName();
  if(!STATE.loaded) loadRecords(); else renderRecords();
}
function fullRecord(type, title, machine, owner, dueDate, status, payload, id){
  return {id:id||'', type:type, title:title, machine:machine||'', owner:owner||'', dueDate:dueDate||'', status:status||'Tersimpan', payload:payload||{}};
}
async function saveCalculation(kind){
  if(!isSuperadmin() || STATE.saving) return;
  var oee=kind==='oee';
  var input=oee?oeeInputs():teepInputs();
  if(!input.date){
    announce('Pilih tanggal pengukuran terlebih dahulu.','error');
    if(oee) activateTab('oee'); else activateTab('teep');
    return;
  }
  var result=oee?calculateOee(input):calculateTeep(input);
  if(!result.valid){
    announce('Periksa input terlebih dahulu. Perhitungan belum disimpan.','error');
    if(oee) activateTab('oee'); else activateTab('teep');
    return;
  }
  var type=oee?'oee-calculation':'teep-calculation';
  var title=(oee?'OEE':'TEEP')+' · '+(input.machine||'Mesin/area belum diisi')+' · '+(input.date||localDate())+(oee?' · Shift '+input.shift:' · '+input.shifts+' shift');
  var button=document.querySelector(oee?'[data-ow-save-oee]':'[data-ow-save-teep]');
  var oldLabel=button?button.innerHTML:'';
  STATE.saving=true;
  if(button){button.disabled=true;button.innerHTML='<i class="ph-bold ph-spinner-gap ow-spin"></i> Menyimpan…';}
  try{
    await apiRequest('offsetWaysSave',{record:fullRecord(type,title,input.machine,'', '', 'Tersimpan',{version:1,inputs:input,result:result})});
    STATE.loaded=false;
    await loadRecords();
    announce('Perhitungan '+(oee?'OEE':'TEEP')+' berhasil disimpan ke database.','success');
  }catch(err){announce('Belum berhasil menyimpan perhitungan: '+String(err.message||err),'error');}
  finally{
    STATE.saving=false;
    if(button){button.disabled=false;button.innerHTML=oldLabel;}
  }
}
async function saveBehavior(){
  if(!isSuperadmin()) return;
  var id=$('ow-action-id').value.trim();
  var behavior=$('ow-action-behavior').value;
  var title=$('ow-action-title').value.trim();
  var owner=$('ow-action-owner').value.trim();
  var due=$('ow-action-due').value;
  var machine=$('ow-action-machine').value.trim();
  var status=$('ow-action-status').value;
  var notes=$('ow-action-notes').value.trim();
  if(!title || !owner || !behavior){
    announce('Isi perilaku, aksi, dan penanggung jawab terlebih dahulu.','error');return;
  }
  var row=fullRecord('behavior-action',title,machine,owner,due,status,{behavior:behavior,notes:notes});
  row.id=id;
  var submit=$('ow-action-submit');
  if(submit){submit.disabled=true;submit.innerHTML='<i class="ph-bold ph-spinner-gap ow-spin"></i> Menyimpan…';}
  try{
    await apiRequest('offsetWaysSave',{record:row});
    resetActionForm();
    STATE.loaded=false;
    await loadRecords();
    announce('Tindak lanjut berhasil disimpan ke database.','success');
  }catch(err){announce('Belum berhasil menyimpan tindak lanjut: '+String(err.message||err),'error');}
  finally{if(submit){submit.disabled=false;submit.innerHTML='<i class="ph-bold ph-floppy-disk"></i> Simpan tindak lanjut';}}
}
async function deleteRecord(id){
  if(!isSuperadmin() || !id) return;
  if(typeof window.confirm==='function' && !window.confirm('Hapus catatan ini dari daftar Offset Ways?')) return;
  try{
    await apiRequest('offsetWaysDelete',{id:id});
    STATE.loaded=false;
    await loadRecords();
    announce('Catatan berhasil dihapus.','success');
  }catch(err){announce('Belum berhasil menghapus catatan: '+String(err.message||err),'error');}
}
function findRecord(id){return STATE.records.find(function(r){return String(r.ID)===String(id);})||null;}
function editBehavior(id){
  var row=findRecord(id);
  if(!row || row.Type!=='behavior-action') return;
  var p=payloadForRow(row);
  $('ow-action-id').value=row.ID;
  $('ow-action-behavior').value=p.behavior||BEHAVIORS[0].key;
  $('ow-action-title').value=row.Title||'';
  $('ow-action-owner').value=row.Owner||'';
  $('ow-action-due').value=row.DueDate||'';
  $('ow-action-machine').value=row.Machine||'';
  $('ow-action-status').value=row.Status||'Open';
  $('ow-action-notes').value=p.notes||'';
  $('ow-action-form-title').textContent='Perbarui tindak lanjut';
  $('ow-action-submit').innerHTML='<i class="ph-bold ph-floppy-disk"></i> Simpan perubahan';
  $('ow-action-cancel').style.display='';
  activateTab('actions');
  $('ow-action-title').focus();
}
function resetActionForm(){
  var form=$('ow-action-form');
  if(form) form.reset();
  $('ow-action-id').value='';
  $('ow-action-owner').value=currentName();
  $('ow-action-form-title').textContent='Catat tindak lanjut';
  $('ow-action-submit').innerHTML='<i class="ph-bold ph-floppy-disk"></i> Simpan tindak lanjut';
  $('ow-action-cancel').style.display='none';
}
function loadCalculation(id){
  var row=findRecord(id); if(!row) return;
  var p=payloadForRow(row), input=p.inputs||{};
  if(row.Type==='oee-calculation'){
    var pairs={machine:'ow-oee-machine',date:'ow-oee-date',shift:'ow-oee-shift',pot:'ow-oee-pot',psd:'ow-oee-psd',downtime:'ow-oee-downtime',speed:'ow-oee-speed',total:'ow-oee-total',good:'ow-oee-good'};
    Object.keys(pairs).forEach(function(k){if($(pairs[k]) && input[k]!=null) $(pairs[k]).value=input[k];});
    activateTab('oee');
    renderOeeResults();
  }else{
    var pairs2={machine:'ow-teep-machine',date:'ow-teep-date',shifts:'ow-teep-shifts',hours:'ow-teep-hours',psd:'ow-teep-psd',manualOee:'ow-teep-manual-oee'};
    Object.keys(pairs2).forEach(function(k){if($(pairs2[k]) && input[k]!=null) $(pairs2[k]).value=input[k];});
    if($('ow-teep-use-oee')) $('ow-teep-use-oee').checked=!!input.useOee;
    activateTab('teep');
    updateTeepResults();
  }
  announce('Input kalkulator dimuat dari riwayat. Angka dapat diubah sebelum disimpan kembali.','success');
}
function ensureThemeOption(){
  var view=$('view-tema');
  if(!view || $('ow-theme-option')) return;
  var card=document.createElement('section');
  card.id='ow-theme-option';
  card.className='ow-theme-option';
  card.innerHTML='<div class="ow-theme-preview" aria-hidden="true"><div class="ow-preview-brand"><span></span><b>BMJ</b><i></i><strong>Technical Department</strong></div><div class="ow-preview-title">OMODOS <em>2.0</em></div><div class="ow-preview-ribbon">OFFSET WAYS · OPERATIONAL EXCELLENCE</div><div class="ow-preview-cards"><span><i class="ph-bold ph-shield-check"></i>Safety</span><span><i class="ph-bold ph-medal"></i>Quality</span><span><i class="ph-bold ph-chart-line-up"></i>OEE</span><span><i class="ph-bold ph-users-three"></i>Ownership</span></div></div><div class="ow-theme-option-body"><div><span class="ow-kicker">TEMA BARU</span><h2>OMODOS 2.0</h2><p>Tampilan terang terinspirasi poster Offset Ways: biru BMJ, aksen emas dan hijau, kartu informasi yang jelas, ikon visual, serta sudut membulat.</p><div class="ow-theme-swatches"><i></i><i></i><i></i><i></i><i></i></div><small id="ow-theme-status">Tema belum dipilih.</small></div><button type="button" class="ow-btn primary" data-ow-theme-apply><i class="ph-bold ph-palette"></i> Terapkan OMODOS 2.0</button></div>';
  var top=view.querySelector('.topbar');
  if(top && top.parentNode) top.insertAdjacentElement('afterend',card);
  else view.insertBefore(card,view.firstChild);
  card.querySelector('[data-ow-theme-apply]').addEventListener('click',applyAndSaveTheme);
}
function applyTheme(){
  document.documentElement.classList.add('omodos-theme-20');
  if(document.body) document.body.classList.add('omodos-theme-20');
  try{localStorage.setItem('omodos-theme-pref-v1',THEME_KEY);}catch(e){}
  updateThemeCardStatus();
}
function clearTheme(){
  document.documentElement.classList.remove('omodos-theme-20');
  if(document.body) document.body.classList.remove('omodos-theme-20');
  try{localStorage.removeItem('omodos-theme-pref-v1');}catch(e){}
  updateThemeCardStatus();
}
function updateThemeCardStatus(){
  var status=$('ow-theme-status');
  var button=document.querySelector('[data-ow-theme-apply]');
  var active=document.documentElement.classList.contains('omodos-theme-20');
  if(status) status.textContent=active?'Tema OMODOS 2.0 sedang aktif.':'Tema belum dipilih.';
  if(button) button.innerHTML=active?'<i class="ph-bold ph-check-circle"></i> Tema sedang digunakan':'<i class="ph-bold ph-palette"></i> Terapkan OMODOS 2.0';
}
async function applyAndSaveTheme(){
  applyTheme();
  var u=currentUser();
  try{if(typeof CURRENT_USER!=='undefined' && CURRENT_USER) CURRENT_USER.ThemePref=THEME_KEY;}catch(e){}
  try{if(u) u.ThemePref=THEME_KEY;}catch(e){}
  var status=$('ow-theme-status');
  if(status) status.textContent='Tema aktif. Menyimpan pilihan ke database…';
  try{
    await apiRequest('saveThemePref',{theme:THEME_KEY});
    if(status) status.textContent='Tema OMODOS 2.0 aktif dan pilihan tersimpan ke akun Anda.';
  }catch(err){
    if(status) status.textContent='Tema aktif pada perangkat ini, tetapi sinkronisasi akun belum berhasil: '+String(err.message||err);
  }
}
function applySavedThemePreference(){
  var u=currentUser();
  if(!u){clearTheme();return;}
  var pref=u.ThemePref || u.themePref || u.theme || '';
  if(String(pref).toLowerCase()===THEME_KEY){applyTheme();return;}
  if(pref){clearTheme();return;}
  try{
    if(localStorage.getItem('omodos-theme-pref-v1')===THEME_KEY) applyTheme();
    else clearTheme();
  }catch(e){clearTheme();}
}
function installThemeHook(){
  try{
    if(typeof window.setAppTheme==='function' && !window.setAppTheme.__omodos20Wrapped){
      var original=window.setAppTheme;
      var wrapped=function(name){
        if(String(name||'').toLowerCase()===THEME_KEY){applyTheme();return true;}
        clearTheme();
        return original.apply(this,arguments);
      };
      wrapped.__omodos20Wrapped=true;
      window.setAppTheme=wrapped;
    }
  }catch(e){}
}
function bindThemePreference(){
  installThemeHook();
  ensureThemeOption();
  applySavedThemePreference();
  var view=$('view-tema');
  if(view && !view.__owThemeObserver){
    view.__owThemeObserver=new MutationObserver(function(){ensureThemeOption();});
    view.__owThemeObserver.observe(view,{childList:true,subtree:true});
  }
}
function installRouteGuard(){
  try{
    if(typeof window.goToView==='function' && !window.goToView.__offsetWaysAdminGuard){
      var original=window.goToView;
      var guarded=function(view){
        if(String(view||'').trim()==='offset-ways' && !isSuperadmin()){
          syncAuth();
          try{if(typeof toast==='function')toast('Menu Offset Ways hanya tersedia untuk Superadmin.',true);}catch(e){}
          return false;
        }
        return original.apply(this,arguments);
      };
      guarded.__offsetWaysAdminGuard=true;
      window.goToView=guarded;
    }
  }catch(e){}
}
function boot(){
  installRouteGuard();
  ensureNav();
  ensurePage();
  bindThemePreference();
  syncAuth();
  var pageForGuard=$(PAGE_ID);
  if(pageForGuard && !pageForGuard.__owAccessObserver){
    pageForGuard.__owAccessObserver=new MutationObserver(function(){
      if(!isSuperadmin() && pageForGuard.classList.contains('active')) syncAuth();
    });
    pageForGuard.__owAccessObserver.observe(pageForGuard,{attributes:true,attributeFilter:['class','style']});
  }
  var badge=$('rbac-user-badge');
  if(badge && !badge.__owAuthObserver){
    badge.__owAuthObserver=new MutationObserver(function(){syncAuth();});
    badge.__owAuthObserver.observe(badge,{childList:true,subtree:true,characterData:true});
  }
  var login=$('form-login');
  if(login && !login.__owAuthListener){
    login.__owAuthListener=true;
    login.addEventListener('submit',function(){setTimeout(syncAuth,500);setTimeout(syncAuth,1600);});
  }
  var logout=$('btn-logout');
  if(logout && !logout.__owLogoutListener){
    logout.__owLogoutListener=true;
    logout.addEventListener('click',function(){setTimeout(syncAuth,100);});
  }
  document.addEventListener('click',function(ev){
    var nav=ev.target.closest && ev.target.closest('#'+NAV_ID+' [data-view="offset-ways"]');
    if(nav && !isSuperadmin()){ev.preventDefault();ev.stopPropagation();syncAuth();}
  },true);
  if(isSuperadmin()) loadRecords();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

window.OMODOS_OFFSET_WAYS = {
  version:'1.0.0',
  reload:loadRecords,
  applyTheme:applyAndSaveTheme,
  calculateOee:calculateOee,
  calculateTeep:calculateTeep
};
})();