# Logbook + Access Integration Anchors

## id="filter-status" @ L4123
~~~text
04105:             <div class="dt-table-scroll"><table class="dt-table" id="dt-ytdRecurringTable"></table></div>
04106:             <div class="section-title" style="margin-top:22px;"><i class="ph-bold ph-calendar-blank"></i> Rekap Per Bulan (Tahun Terpilih)</div>
04107:             <p class="dt-desc">Breakdown downtime &amp; jumlah isu tiap bulan yang datanya sudah tersimpan — bukan cuma total YTD. Klik salah satu card bulan untuk melihat detail tiap pekerjaan/masalahnya.</p>
04108:             <div id="dt-monthlyRecapGrid" class="database-grid"></div>
04109:             <div style="margin-top:16px;"><button type="button" class="btn" id="dt-ytdExportBtn"><i class="ph-bold ph-download-simple"></i> Download Excel Resume</button></div>
04110:           </div>
04111:         </div>
04112:       </div>
04113:     </section>
04114: 
04115:     <section class="view" id="view-utama">
04116:       <div class="topbar">
04117:         <div><h1>Logbook</h1><div class="sub">Seluruh catatan pekerjaan maintenance, diurutkan dari yang paling baru diposting.</div></div>
04118:         <div class="stat-strip" id="stat-strip"></div>
04119:       </div>
04120:       <div class="lb-tabbar" data-lb-tabbar></div>
04121:       <div class="filter-bar">
04122:         <input class="grow" type="text" id="search-utama" placeholder="Cari mesin, pelapor, deskripsi...">
04123:         <select id="filter-status"><option value="">Semua Status</option><option>Selesai</option><option>Proses</option><option>Pending</option><option>Emergency</option></select>
04124:         <select id="filter-jenis"><option value="">Semua Jenis</option></select>
04125:         <select id="filter-group"><option value="">Semua Group</option><option>Electrical</option><option>Mechanical</option><option>Workshop</option><option>Project</option><option>Warehouse</option><option>Planning</option><option>IPAL</option></select>
04126:         <button class="btn btn-sm" id="btn-refresh-utama"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04127:       </div>
04128:       <div id="list-utama"></div>
04129:     </section>
04130: 
04131:     <section class="view" id="view-mesin">
04132:       <div class="topbar"><div><h1>Logbook per Mesin</h1><div class="sub">Riwayat pekerjaan dikelompokkan per unit mesin.</div></div></div>
04133:       <div class="lb-tabbar" data-lb-tabbar></div>
04134:       <div class="filter-bar" style="margin-bottom:12px;">
04135:         <label for="machine-select" style="font-size:12px;font-weight:700;color:var(--text-dim);">Pilih Mesin</label>
04136:         <select id="machine-select" class="grow"><option value="">Pilih mesin...</option></select>
04137:       </div>
04138:       <div id="list-mesin"></div>
04139:     </section>
04140: 
04141:     <section class="view" id="view-tanggal">
04142:       <div class="topbar">
04143:         <div><h1>Logbook per Tanggal</h1><div class="sub">Dikelompokkan berdasarkan tanggal pelaporan, terbaru di atas.</div></div>
04144:         <div class="sort-toggle"><button class="active" data-sort="desc">Terbaru</button><button data-sort="asc">Terlama</button><button id="btn-toggle-nodate" type="button">Tanpa Tanggal</button></div>
04145:       </div>
04146:       <div class="lb-tabbar" data-lb-tabbar></div>
04147:       <div id="list-tanggal"></div>
04148:     </section>
04149: 
04150:     <section class="view" id="view-pelapor">
04151:       <div class="topbar"><div><h1>Logbook per Pelapor</h1><div class="sub">Riwayat pekerjaan dikelompokkan per nama teknisi/pelapor.</div></div></div>
04152:       <div class="lb-tabbar" data-lb-tabbar></div>
04153:       <div class="machine-chip-row" id="pelapor-chips"></div>
04154:       <div id="list-pelapor"></div>
04155:     </section>
04156: 
04157:     <section class="view" id="view-group">
04158:       <div class="topbar"><div><h1>Logbook per Group Pekerjaan</h1><div class="sub">Riwayat pekerjaan dikelompokkan per divisi/grup kerja.</div></div></div>
04159:       <div class="lb-tabbar" data-lb-tabbar></div>
04160:       <div class="machine-chip-row" id="group-chips"></div>
04161:       <div id="list-group"></div>
04162:     </section>
~~~

## filter-status @ L3741
~~~text
03723:         <button class="machine-chip" data-pmc-type="sga"><i class="ph-bold ph-users-three"></i> SGA</button>
03724:       </div>
03725: 
03726:       <div class="card" style="margin-top:14px;" id="pmc-toolbar-card">
03727:         <div class="pmc-toolbar">
03728:           <input type="text" id="pmc-search" placeholder="Cari judul/tema/nama tim..." style="flex:1;min-width:200px;">
03729:           <button type="button" class="btn btn-sm" id="pmc-btn-toggle-filter" aria-expanded="false"><i class="ph-bold ph-funnel"></i> Filter</button>
03730:           <div class="pmc-view-toggle">
03731:             <button type="button" class="btn btn-sm active" id="pmc-view-card" title="Card View"><i class="ph-bold ph-squares-four"></i></button>
03732:             <button type="button" class="btn btn-sm" id="pmc-view-table" title="Table View"><i class="ph-bold ph-table"></i></button>
03733:           </div>
03734:           <button type="button" class="btn btn-primary btn-sm" id="pmc-btn-add"><i class="ph-bold ph-plus"></i> Tambah Project</button>
03735:         </div>
03736:         <div class="pmc-toolbar" id="pmc-toolbar-filters" style="display:none;margin-top:10px;padding-top:10px;border-top:1px solid var(--line-soft);">
03737:           <select id="pmc-filter-tahun"><option value="">Semua Tahun</option></select>
03738:           <select id="pmc-filter-area"><option value="">Semua Area</option></select>
03739:           <select id="pmc-filter-mesin"><option value="">Semua Mesin</option></select>
03740:           <select id="pmc-filter-pic"><option value="">Semua PIC</option></select>
03741:           <select id="pmc-filter-status">
03742:             <option value="">Semua Status</option>
03743:             <option>Planning</option><option>On Going</option><option>Hold</option><option>Completed</option><option>Cancel</option>
03744:           </select>
03745:         </div>
03746:       </div>
03747: 
03748:       <div id="pmc-list-wrap" style="margin-top:14px;"></div>
03749:     </section>
03750: 
03751:     <section class="view" id="view-people-hub">
03752:       <div class="topbar">
03753:         <div><h1>People & Meetings</h1><div class="sub">Ketuk salah satu untuk melihat.</div></div>
03754:       </div>
03755:       <div class="insights-hub-grid" id="people-hub-grid">
03756:         <button class="insights-hub-card" data-view="pi-dashboard">
03757:           <span class="ihc-ico">🧠</span><span class="ihc-title">PI Dashboard</span>
03758:           <span class="ihc-desc">Ringkasan kompetensi teknis & soft skill semua personil</span>
03759:         </button>
03760:         <button class="insights-hub-card" data-view="pi-personnel">
03761:           <span class="ihc-ico">🪪</span><span class="ihc-title">Personnel</span>
03762:           <span class="ihc-desc">Profil lengkap tiap karyawan</span>
03763:         </button>
03764:         <button class="insights-hub-card" data-view="pi-smart-resume">
03765:           <span class="ihc-ico">🌟</span><span class="ihc-title">Smart Recognition &amp; Resume</span>
03766:           <span class="ihc-desc">Rekomendasi &amp; ringkasan otomatis, dari seluruh data aplikasi</span>
03767:         </button>
03768:         <button class="insights-hub-card" data-view="pi-softskill">
03769:           <span class="ihc-ico">📝</span><span class="ihc-title">Soft Skill Assessment</span>
03770:           <span class="ihc-desc">Penilaian supervisor, skala 1-5</span>
03771:         </button>
03772:         <button class="insights-hub-card" data-view="pi-hardskill">
03773:           <span class="ihc-ico">🛠️</span><span class="ihc-title">Hard Skill Assessment</span>
03774:           <span class="ihc-desc">Penilaian kompetensi teknis per unit</span>
03775:         </button>
03776:         <button class="insights-hub-card" data-view="meeting">
03777:           <span class="ihc-ico">🧑‍🤝‍🧑</span><span class="ihc-title">Meeting Management</span>
03778:           <span class="ihc-desc">Jadwal, notulen, follow up & keputusan</span>
03779:         </button>
03780:       </div>
~~~

## filter-status @ L3807
~~~text
03789:         </div>
03790:       </div>
03791: 
03792:       <div class="pmc-dash-grid" id="mtg-dash-grid"></div>
03793: 
03794:       <div class="machine-chip-row" id="mtg-mode-tabs">
03795:         <button class="machine-chip active" data-mtg-mode="schedule"><i class="ph-bold ph-calendar-check"></i> Jadwal &amp; Minutes</button>
03796:         <button class="machine-chip" data-mtg-mode="followup"><i class="ph-bold ph-list-checks"></i> Follow Up Tracker</button>
03797:         <button class="machine-chip" data-mtg-mode="decision"><i class="ph-bold ph-gavel"></i> Decision Log</button>
03798:         <button class="machine-chip" data-mtg-mode="analytics"><i class="ph-bold ph-chart-bar"></i> Meeting Analytics</button>
03799:       </div>
03800: 
03801:       <div class="card" style="margin-top:14px;" id="mtg-toolbar-card">
03802:         <div class="pmc-toolbar" id="mtg-toolbar-schedule">
03803:           <input type="text" id="mtg-search" placeholder="Cari judul meeting...">
03804:           <input type="date" id="mtg-filter-tanggal">
03805:           <select id="mtg-filter-jenis"><option value="">Semua Jenis Meeting</option></select>
03806:           <select id="mtg-filter-pic"><option value="">Semua PIC/Moderator</option></select>
03807:           <select id="mtg-filter-status">
03808:             <option value="">Semua Status</option>
03809:             <option>Scheduled</option><option>Ongoing</option><option>Finished</option><option>Cancelled</option>
03810:           </select>
03811:           <select id="mtg-filter-department"><option value="">Semua Department</option></select>
03812:           <button type="button" class="btn btn-primary btn-sm" id="mtg-btn-add"><i class="ph-bold ph-plus"></i> Meeting Baru</button>
03813:         </div>
03814:         <div class="pmc-toolbar" id="mtg-toolbar-followup" style="display:none;">
03815:           <select id="mtg-fu-filter-pic"><option value="">Semua PIC</option></select>
03816:           <select id="mtg-fu-filter-jenis"><option value="">Semua Jenis Meeting</option></select>
03817:           <select id="mtg-fu-filter-prioritas"><option value="">Semua Prioritas</option></select>
03818:           <select id="mtg-fu-filter-status">
03819:             <option value="">Semua Status</option>
03820:             <option>Open</option><option>On Progress</option><option>Waiting</option><option>Hold</option><option>Closed</option><option>Cancelled</option>
03821:           </select>
03822:         </div>
03823:       </div>
03824: 
03825:       <div id="mtg-list-wrap" style="margin-top:14px;"></div>
03826:     </section>
03827: 
03828:     <section class="view" id="view-patrol">
03829:       <div class="topbar">
03830:         <div>
03831:           <h1>Patrol Harian</h1>
03832:           <div class="sub">Ketuk mesin → isi checklist → simpan. Selesai dalam 3 langkah.</div>
03833:         </div>
03834:       </div>
03835: 
03836:       <div class="machine-chip-row" id="patrol-tabs">
03837:         <button class="machine-chip active" data-ptab="mulai"><i class="ph-bold ph-play"></i> Mulai Patrol</button>
03838:         <button class="machine-chip" data-ptab="temuan"><i class="ph-bold ph-warning"></i> Daftar Temuan</button>
03839:         <button class="machine-chip" data-ptab="riwayat"><i class="ph-bold ph-clock-counter-clockwise"></i> Riwayat Patrol</button>
03840:         <button class="machine-chip" data-ptab="statistik"><i class="ph-bold ph-chart-bar"></i> Statistik</button>
03841:       </div>
03842: 
03843:       <!-- TAB 1: MULAI PATROL (wizard 3 langkah) -->
03844:       <div class="patrol-panel" id="patrol-panel-mulai">
03845:         <div class="card" id="patrol-step-1">
03846:           <div class="section-title"><i class="ph-bold ph-number-circle-one"></i> Pilih Mesin</div>
~~~

## filter-status @ L9183
~~~text
09165:   const emergency = ENTRIES.filter(e=>statusClass(e['Status'])==='emergency').length;
09166:   const todayCount = ENTRIES.filter(e=> e['Tanggal']===today).length;
09167:   return {total, selesai, proses, emergency, todayCount};
09168: }
09169: 
09170: function renderUtama(){
09171:   const s = computeStats();
09172:   $('#stat-strip').innerHTML = `
09173:     <button type="button" class="stat-chip ${LOGBOOK_CARD_FILTER==='total'?'active':''}" data-logbook-stat="total" aria-pressed="${LOGBOOK_CARD_FILTER==='total'}"><span class="n">${s.total}</span><span class="l">Total</span></button>
09174:     <button type="button" class="stat-chip ${LOGBOOK_CARD_FILTER==='selesai'?'active':''}" data-logbook-stat="selesai" aria-pressed="${LOGBOOK_CARD_FILTER==='selesai'}"><span class="n" style="color:var(--green)">${s.selesai}</span><span class="l">Selesai</span></button>
09175:     <button type="button" class="stat-chip ${LOGBOOK_CARD_FILTER==='proses'?'active':''}" data-logbook-stat="proses" aria-pressed="${LOGBOOK_CARD_FILTER==='proses'}"><span class="n" style="color:var(--amber)">${s.proses}</span><span class="l">Proses</span></button>
09176:     <button type="button" class="stat-chip ${LOGBOOK_CARD_FILTER==='emergency'?'active':''}" data-logbook-stat="emergency" aria-pressed="${LOGBOOK_CARD_FILTER==='emergency'}"><span class="n" style="color:var(--red)">${s.emergency}</span><span class="l">Emergency</span></button>
09177:     <button type="button" class="stat-chip ${LOGBOOK_CARD_FILTER==='today'?'active':''}" data-logbook-stat="today" aria-pressed="${LOGBOOK_CARD_FILTER==='today'}"><span class="n">${s.todayCount}</span><span class="l">Hari Ini</span></button>
09178:   `;
09179:   $$('[data-logbook-stat]', $('#stat-strip')).forEach(btn=>btn.addEventListener('click',()=>{
09180:     LOGBOOK_CARD_FILTER = btn.dataset.logbookStat || 'total';
09181:     // KPI card adalah shortcut filter utama: bersihkan filter lain agar jumlah
09182:     // yang tampil benar-benar sama dengan angka pada card yang dipilih.
09183:     $('#search-utama').value=''; $('#filter-status').value=''; $('#filter-jenis').value=''; $('#filter-group').value='';
09184:     $$('[data-logbook-stat]', $('#stat-strip')).forEach(b=>{ const on=b.dataset.logbookStat===LOGBOOK_CARD_FILTER; b.classList.toggle('active',on); b.setAttribute('aria-pressed',String(on)); });
09185:     applyUtamaFilters();
09186:   }));
09187: 
09188:   const jenisSet = Array.from(new Set(ENTRIES.map(e=>e['Jenis Pekerjaan']).filter(Boolean)));
09189:   $('#filter-jenis').innerHTML = '<option value="">Semua Jenis</option>' + jenisSet.map(j=>`<option>${escapeHtml(j)}</option>`).join('');
09190: 
09191:   applyUtamaFilters();
09192: }
09193: 
09194: function applyUtamaFilters(){
09195:   const q = ($('#search-utama').value || '').toLowerCase();
09196:   const st = $('#filter-status').value;
09197:   const jn = $('#filter-jenis').value;
09198:   const gr = $('#filter-group').value;
09199:   const now = new Date();
09200:   const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
09201:   let filtered = ENTRIES.filter(e=>{
09202:     if(LOGBOOK_CARD_FILTER==='today' && String(e['Tanggal']||'').slice(0,10)!==today) return false;
09203:     if(['selesai','proses','emergency'].includes(LOGBOOK_CARD_FILTER) && statusClass(e['Status'])!==LOGBOOK_CARD_FILTER) return false;
09204:     if(st && (e['Status']||'') !== st) return false;
09205:     if(jn && (e['Jenis Pekerjaan']||'') !== jn) return false;
09206:     if(gr && (e['Grouping Pekerjaan']||'') !== gr) return false;
09207:     if(q){
09208:       const hay = [e['Nama Mesin'],e['Kode Mesin'],e['Nama Unit'],e['Nama Pelapor'],e['Deskripsi Masalah'],e['Lokasi/Area'],e['Nomor Notifikasi Pekerjaan']].join(' ').toLowerCase();
09209:       if(!hay.includes(q)) return false;
09210:     }
09211:     return true;
09212:   });
09213:   // Pastikan urutan tampil SELALU dari yang paling baru diposting ke Google
09214:   // Sheets (kolom "Timestamp Input"), terlepas dari urutan aslinya di ENTRIES.
09215:   // Pastikan urutan tampil SELALU dari yang paling baru diposting ke Google 
09216: // Sheets (kolom "Timestamp Input"), terlepas dari urutan aslinya di ENTRIES.
09217: // Namun, jika laporan tidak memiliki status, posisikan di bagian paling bawah.
09218: filtered = filtered.slice().sort((a, b) => {
09219:   const statusA = (a['Status'] || '').trim();
09220:   const statusB = (b['Status'] || '').trim();
09221: 
09222:   // Jika salah satu status kosong, pindahkan ke paling bawah
~~~

## filter-status @ L9245
~~~text
09227:   // urutkan berdasarkan Timestamp Input (terbaru di paling atas)
09228:   return new Date(b['Timestamp Input']) - new Date(a['Timestamp Input']);
09229: });
09230:   const holder = $('#list-utama');
09231:   if(filtered.length===0){
09232:     holder.innerHTML = `<div class="empty-state"><div class="ico"><i class="ph-bold ph-notebook"></i></div>Tidak ada data logbook yang cocok.</div>`;
09233:     return;
09234:   }
09235:   holder.innerHTML = filtered.map((e,i)=>entryCardHtml(e, filtered.length-i)).join('');
09236:   attachEntryClickHandlers(holder);
09237: }
09238: function resetLogbookCardFilterForManual_(){
09239:   if(LOGBOOK_CARD_FILTER!=='total'){
09240:     LOGBOOK_CARD_FILTER='total';
09241:     $$('[data-logbook-stat]', $('#stat-strip')).forEach(b=>{ const on=b.dataset.logbookStat==='total'; b.classList.toggle('active',on); b.setAttribute('aria-pressed',String(on)); });
09242:   }
09243: }
09244: $('#search-utama').addEventListener('input', ()=>{ resetLogbookCardFilterForManual_(); applyUtamaFilters(); });
09245: $('#filter-status').addEventListener('change', ()=>{ resetLogbookCardFilterForManual_(); applyUtamaFilters(); });
09246: $('#filter-jenis').addEventListener('change', ()=>{ resetLogbookCardFilterForManual_(); applyUtamaFilters(); });
09247: $('#filter-group').addEventListener('change', ()=>{ resetLogbookCardFilterForManual_(); applyUtamaFilters(); });
09248: $('#btn-refresh-utama').addEventListener('click', async ()=>{ await loadAll(); renderUtama(); toast('Data diperbarui'); });
09249: 
09250: /* ---------------- VIEW: PER MESIN ---------------- */
09251: // Mencocokkan entri logbook ke mesin di Database Mesin memakai Kode Mesin
09252: // sebagai kunci utama (lebih stabil, jarang typo dibanding nama bebas),
09253: // dengan fallback ke Nama Mesin (case-insensitive, trim) kalau Kode Mesin
09254: // kosong/tidak cocok. Ini supaya entri lama yang penulisan namanya sedikit
09255: // beda (kapital/spasi) tetap terhubung ke mesin yang benar di database,
09256: // bukan otomatis nyasar ke "Lainnya".
09257: function norm_(s){ return String(s||'').trim().toLowerCase(); }
09258: 
09259: function buildMachineIndex_(){
09260:   const list = MACHINES.map(m=>{
09261:     const kode = String(m['Kode Mesin']||'').trim();
09262:     const nama = String(m['Nama Mesin']||'').trim();
09263:     const key = kode || nama; // kunci filter unik per mesin
09264:     const label = nama || kode;
09265:     return { key, label, kode, nama };
09266:   }).filter(m=> m.key);
09267:   const byKode = {}, byNama = {};
09268:   list.forEach(m=>{
09269:     if(m.kode) byKode[norm_(m.kode)] = m.key;
09270:     if(m.nama) byNama[norm_(m.nama)] = m.key;
09271:   });
09272:   return { list, byKode, byNama };
09273: }
09274: function matchEntryMachineKey_(e, idx){
09275:   const kode = norm_(e['Kode Mesin']);
09276:   if(kode && idx.byKode[kode]) return idx.byKode[kode];
09277:   const nama = norm_(e['Nama Mesin']);
09278:   if(nama && idx.byNama[nama]) return idx.byNama[nama];
09279:   return 'Lainnya';
09280: }
09281: function renderMesinView(){
09282:   const idx = buildMachineIndex_();
09283:   const machineList = idx.list.slice().sort((a,b)=> a.label.localeCompare(b.label,'id'));
09284:   const hasUnregistered = ENTRIES.some(e => (e['Kode Mesin']||e['Nama Mesin']) && matchEntryMachineKey_(e, idx) === 'Lainnya');
~~~

## filter-status @ L27080
~~~text
27062: 
27063:   $$('#pmc-mode-tabs .machine-chip').forEach(btn=>{
27064:     btn.addEventListener('click', ()=>{
27065:       $$('#pmc-mode-tabs .machine-chip').forEach(b=>b.classList.remove('active'));
27066:       btn.classList.add('active');
27067:       PMC_STATE.mode = btn.dataset.pmcMode;
27068:       pmcRenderList();
27069:     });
27070:   });
27071: 
27072:   $$('#pmc-type-tabs .machine-chip').forEach(btn=>{
27073:     btn.addEventListener('click', ()=>{
27074:       $$('#pmc-type-tabs .machine-chip').forEach(b=>b.classList.remove('active'));
27075:       btn.classList.add('active');
27076:       PMC_STATE.type = btn.dataset.pmcType;
27077:       PMC_STATE.filters = {tahun:'',area:'',mesin:'',pic:'',status:''};
27078:       PMC_STATE.search = '';
27079:       $('#pmc-search').value = '';
27080:       $('#pmc-filter-status').value = '';
27081:       pmcPopulateFilterOptions();
27082:       pmcRenderList();
27083:     });
27084:   });
27085: 
27086:   $('#pmc-search').addEventListener('input', (e)=>{ PMC_STATE.search = e.target.value; pmcRenderList(); });
27087:   $('#pmc-filter-tahun').addEventListener('change', e=>{ PMC_STATE.filters.tahun = e.target.value; pmcRenderList(); });
27088:   $('#pmc-filter-area').addEventListener('change', e=>{ PMC_STATE.filters.area = e.target.value; pmcRenderList(); });
27089:   $('#pmc-filter-mesin').addEventListener('change', e=>{ PMC_STATE.filters.mesin = e.target.value; pmcRenderList(); });
27090:   $('#pmc-filter-pic').addEventListener('change', e=>{ PMC_STATE.filters.pic = e.target.value; pmcRenderList(); });
27091:   $('#pmc-filter-status').addEventListener('change', e=>{ PMC_STATE.filters.status = e.target.value; pmcRenderList(); });
27092: 
27093:   $('#pmc-view-card').addEventListener('click', ()=>{
27094:     PMC_STATE.view = 'card';
27095:     $('#pmc-view-card').classList.add('active'); $('#pmc-view-table').classList.remove('active');
27096:     pmcRenderList();
27097:   });
27098:   $('#pmc-view-table').addEventListener('click', ()=>{
27099:     PMC_STATE.view = 'table';
27100:     $('#pmc-view-table').classList.add('active'); $('#pmc-view-card').classList.remove('active');
27101:     pmcRenderList();
27102:   });
27103:   $('#pmc-btn-add').addEventListener('click', ()=> pmcOpenForm(PMC_STATE.type, null));
27104: }
27105: 
27106: async function renderPmcView(){
27107:   pmcBindStaticUI();
27108:   $('#pmc-list-wrap').innerHTML = '<div class="pmc-empty"><i class="ph-bold ph-spinner"></i> Memuat data...</div>';
27109:   await pmcLoadAll();
27110:   pmcPopulateFilterOptions();
27111:   pmcRenderDashboard();
27112:   pmcRenderList();
27113: }
27114: 
27115: 
27116: /* =========================================================
27117:    MEETING MANAGEMENT MODULE
27118:    ---------------------------------------------------------
27119:    Modul baru & independen (namespace MTG_*), tidak mengubah
~~~

## filter-status @ L27785
~~~text
27767: 
27768: /* ---------------- BINDING UI STATIS ---------------- */
27769: let MTG_UI_BOUND = false;
27770: function mtgBindStaticUI(){
27771:   if(MTG_UI_BOUND) return;
27772:   MTG_UI_BOUND = true;
27773:   $$('#mtg-mode-tabs .machine-chip').forEach(btn=>{
27774:     btn.addEventListener('click', ()=>{
27775:       $$('#mtg-mode-tabs .machine-chip').forEach(b=>b.classList.remove('active'));
27776:       btn.classList.add('active');
27777:       MTG_STATE.mode = btn.dataset.mtgMode;
27778:       mtgRenderCurrentMode();
27779:     });
27780:   });
27781:   $('#mtg-search').addEventListener('input', e=>{ MTG_STATE.search = e.target.value; mtgRenderSchedule(); });
27782:   $('#mtg-filter-tanggal').addEventListener('change', e=>{ MTG_STATE.filters.tanggal = e.target.value; mtgRenderSchedule(); });
27783:   $('#mtg-filter-jenis').addEventListener('change', e=>{ MTG_STATE.filters.jenis = e.target.value; mtgRenderSchedule(); });
27784:   $('#mtg-filter-pic').addEventListener('change', e=>{ MTG_STATE.filters.pic = e.target.value; mtgRenderSchedule(); });
27785:   $('#mtg-filter-status').addEventListener('change', e=>{ MTG_STATE.filters.status = e.target.value; mtgRenderSchedule(); });
27786:   $('#mtg-filter-department').addEventListener('change', e=>{ MTG_STATE.filters.department = e.target.value; mtgRenderSchedule(); });
27787:   $('#mtg-btn-add').addEventListener('click', ()=> mtgOpenWizard(null));
27788: 
27789:   $('#mtg-fu-filter-pic').addEventListener('change', e=>{ MTG_STATE.fuFilters.pic = e.target.value; mtgRenderFollowup(); });
27790:   $('#mtg-fu-filter-jenis').addEventListener('change', e=>{ MTG_STATE.fuFilters.jenis = e.target.value; mtgRenderFollowup(); });
27791:   $('#mtg-fu-filter-prioritas').addEventListener('change', e=>{ MTG_STATE.fuFilters.prioritas = e.target.value; mtgRenderFollowup(); });
27792:   $('#mtg-fu-filter-status').addEventListener('change', e=>{ MTG_STATE.fuFilters.status = e.target.value; mtgRenderFollowup(); });
27793: }
27794: 
27795: async function renderMtgView(){
27796:   mtgBindStaticUI();
27797:   $('#mtg-list-wrap').innerHTML = '<div class="pmc-empty"><i class="ph-bold ph-spinner"></i> Memuat data meeting...</div>';
27798:   await mtgLoadAll();
27799:   mtgPopulateFilterOptions();
27800:   mtgRenderDashboard();
27801:   mtgRenderCurrentMode();
27802: }
27803: 
27804: </script>
27805: 
27806: <script>
27807: /* =====================================================================
27808:    [PATCH] ROLE ACCESS MANAGEMENT — GATING TAB INTERNAL (BUKAN CUMA MENU)
27809:    ---------------------------------------------------------------------
27810:    Sebelumnya Role Access Management hanya mengatur menu/halaman
27811:    (data-view). Tab internal di dalam satu halaman — mis. "Mulai Patrol /
27812:    Daftar Temuan / Riwayat / Statistik" di Patrol, mode di Project Center
27813:    & Meeting Management, tab di Sparepart & Downtime — tidak bisa diatur
27814:    sama sekali dan tidak dites terpisah. Patch ini membuat SEMUA tab
27815:    tersebut ikut tersapu otomatis (sama seperti menu), otomatis muncul di
27816:    tabel Role Access, dan digate baik dari sisi tampilan (disembunyikan)
27817:    maupun dari sisi klik (diblokir sebelum handler asli sempat jalan) —
27818:    tanpa mengubah logic switching tab yang sudah ada di masing-masing
27819:    fitur. Kalau nanti ada kelompok tab baru cukup tambah satu baris di
27820:    RBAC_TAB_GROUPS di bawah, tidak perlu sentuh logic tab itu sendiri.
27821:    ===================================================================== */
27822: (function(){
27823: 
27824: const RBAC_TAB_GROUPS = [
~~~

## filter-group @ L5301
~~~text
05283:     <section class="view" id="view-ai">
05284:       <button class="btn btn-sm btn-back-to-input-report" onclick="goToView('report')" style="margin-bottom:10px;"><i class="ph-bold ph-arrow-left"></i> Input Report</button>
05285:       <div class="topbar">
05286:         <div>
05287:           <h1>Analisa AI &amp; Rekomendasi</h1>
05288:           <div class="sub">Cari solusi berdasarkan pola dari seluruh riwayat logbook yang sudah tercatat.</div>
05289:         </div>
05290:       </div>
05291: 
05292:       <div class="card" style="margin-bottom:18px;">
05293:         <div class="section-title"><i class="ph-bold ph-magnifying-glass"></i> Deskripsikan Masalah</div>
05294:         <div class="grid2">
05295:           <div class="field">
05296:             <label>Filter Mesin (opsional)</label>
05297:             <select id="ai-filter-mesin"><option value="">Semua Mesin</option></select>
05298:           </div>
05299:           <div class="field">
05300:             <label>Filter Group Pekerjaan (opsional)</label>
05301:             <select id="ai-filter-group"><option value="">Semua Group</option><option>Electrical</option><option>Mechanical</option><option>Workshop</option><option>Project</option><option>Warehouse</option><option>Planning</option><option>IPAL</option></select>
05302:           </div>
05303:         </div>
05304:         <div class="field">
05305:           <label>Jelaskan gejala / masalah yang ingin dianalisa</label>
05306:           <textarea id="ai-query" rows="3" placeholder="Contoh: sheeting mesin bagian roll pulling tidak rata, hasil cetak bergeser..."></textarea>
05307:         </div>
05308:         <div class="field">
05309:           <label>Spesifikasi / Tipe / Codename Bawaan Pabrik (opsional)</label>
05310:           <input type="text" id="ai-spesifikasi" placeholder="Contoh: Bobst Expertfold 110, Heidelberg SM 102, servo motor Yaskawa SGMJV-04A...">
05311:           <div class="sub" style="margin-top:4px;">Isi tipe/model/codename asli mesin atau komponen agar riset internet lebih akurat dan spesifik (tidak generik).</div>
05312:         </div>
05313:         <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
05314:           <button class="btn btn-primary" id="btn-ai-analyze"><i class="ph-bold ph-sparkle"></i> Analisa &amp; Cari Rekomendasi</button>
05315:           <span id="ai-status" style="font-size:12.5px;color:var(--text-dim);"></span>
05316:         </div>
05317:       </div>
05318: 
05319:       <div id="ai-result-holder">
05320:         <div id="ai-result-context"></div>
05321:         <div id="ai-result-backend"></div>
05322:         <div id="ai-result-local"></div>
05323:       </div>
05324: 
05325:       <div class="card" style="margin-top:18px;">
05326:         <div class="section-title"><i class="ph-bold ph-question"></i> Bagaimana Analisa AI Bekerja</div>
05327:         <div class="sub">
05328:           Setiap kali Anda menekan "Analisa &amp; Cari Rekomendasi", aplikasi menampilkan <b>dua kartu hasil yang terpisah</b>:
05329:           <br><br>
05330:           🌐 <b>Hasil Riset Internet (AI + Google Search)</b> — AI (Gemini) benar-benar melakukan pencarian internet secara real-time
05331:           (manual pabrikan, forum teknisi, dokumentasi resmi) untuk menyusun <b>ringkasan diagnosa</b> dan <b>langkah perbaikan
05332:           step-by-step</b> yang spesifik terhadap masalah Anda. Jika kolom <b>Spesifikasi/Tipe/Codename Pabrik</b> diisi, pencarian
05333:           akan lebih terarah ke tipe mesin/komponen tersebut. Sumber/link asli yang ditemukan AI ditampilkan di bagian bawah kartu ini.
05334:           <br><br>
05335:           📋 <b>Analisa Lokal (dari Riwayat Logbook)</b> — dihitung 100% dari data logbook internal di perangkat Anda, <b>tanpa
05336:           memanggil AI eksternal sama sekali</b>. Menampilkan tindakan perbaikan yang paling sering terbukti dipakai pada kasus
05337:           serupa di riwayat Anda — tetap tersedia walau kuota AI habis atau internet lambat.
05338:           <br><br>
05339:           Kedua kartu ini sengaja dipisah supaya jelas mana solusi hasil riset internet dan mana solusi hasil pengalaman internal
05340:           tim — silakan bandingkan keduanya. Model utama yang dipakai adalah <b>Gemini</b> dengan fallback otomatis ke model
~~~

## filter-group @ L18990
~~~text
18972: }
18973: 
18974: function runAiAnalysis(){
18975:   const contextHolder = $('#ai-result-context');
18976:   const backendHolder = $('#ai-result-backend');
18977:   const localHolder = $('#ai-result-local');
18978:   try{
18979:     const query = $('#ai-query').value.trim();
18980:     if(!query){ contextHolder.innerHTML=''; backendHolder.innerHTML=''; localHolder.innerHTML=''; return; }
18981: 
18982:     if(!WEB_APP_URL){
18983:       contextHolder.innerHTML = '';
18984:       localHolder.innerHTML = '';
18985:       backendHolder.innerHTML = `<div class="empty-state"><div class="ico"><i class="ph-bold ph-notebook"></i></div>Aplikasi belum terhubung ke database SQLite. Buka menu "Master Mesin & Koneksi" lalu sambungkan URL Web App terlebih dahulu.</div>`;
18986:       return;
18987:     }
18988: 
18989:     const mesinFilter = $('#ai-filter-mesin').value;
18990:     const groupFilter = $('#ai-filter-group').value;
18991:     const spesifikasi = ($('#ai-spesifikasi').value || '').trim();
18992: 
18993:     const {matches, anchorMachine} = computeAiMatches(query, mesinFilter, groupFilter);
18994:     renderAiContext(query, matches, anchorMachine);
18995: 
18996:     const localRecs = computeLocalRecommendations(matches);
18997:     renderLocalAiSection(query, matches, localRecs);
18998: 
18999:     runBackendAnalysis(query, matches, localRecs, spesifikasi);
19000:   }catch(err){
19001:     console.error('AI analyze error:', err);
19002:     backendHolder.innerHTML = `<div class="empty-state"><div class="ico">⚠️</div>Terjadi kesalahan saat menganalisa: ${escapeHtml(err.message)}</div>`;
19003:   }
19004: }
19005: 
19006: function renderAiView(){
19007:   populateAiFilters();
19008: }
19009: 
19010: function resetAiView(){
19011:   const q = $('#ai-query'); if(q) q.value = '';
19012:   const sp = $('#ai-spesifikasi'); if(sp) sp.value = '';
19013:   const fm = $('#ai-filter-mesin'); if(fm) fm.value = '';
19014:   const fg = $('#ai-filter-group'); if(fg) fg.value = '';
19015:   const st = $('#ai-status'); if(st) st.textContent = '';
19016:   const ctx = $('#ai-result-context'); if(ctx) ctx.innerHTML = '';
19017:   const bk = $('#ai-result-backend'); if(bk) bk.innerHTML = '';
19018:   const lc = $('#ai-result-local'); if(lc) lc.innerHTML = '';
19019: }
19020: 
19021: $('#btn-ai-analyze').addEventListener('click', ()=>{
19022:   if(!$('#ai-query').value.trim()){ toast('Jelaskan dulu masalah yang ingin dianalisa.', true); return; }
19023:   runAiAnalysis();
19024: });
19025: 
19026: /* ---------------- PREDICTIVE MAINTENANCE (PATROL) ---------------- */
19027: // Sama seperti Report IPAL: cache lokal dulu supaya form tetap responsif,
19028: // lalu disinkronkan ke Google Sheet (sheet "Predictive Maintenance") lewat
19029: // backend Web App. Backend akan otomatis membuat sheet tsb bila belum ada.
~~~

## filter-group @ L19014
~~~text
18996:     const localRecs = computeLocalRecommendations(matches);
18997:     renderLocalAiSection(query, matches, localRecs);
18998: 
18999:     runBackendAnalysis(query, matches, localRecs, spesifikasi);
19000:   }catch(err){
19001:     console.error('AI analyze error:', err);
19002:     backendHolder.innerHTML = `<div class="empty-state"><div class="ico">⚠️</div>Terjadi kesalahan saat menganalisa: ${escapeHtml(err.message)}</div>`;
19003:   }
19004: }
19005: 
19006: function renderAiView(){
19007:   populateAiFilters();
19008: }
19009: 
19010: function resetAiView(){
19011:   const q = $('#ai-query'); if(q) q.value = '';
19012:   const sp = $('#ai-spesifikasi'); if(sp) sp.value = '';
19013:   const fm = $('#ai-filter-mesin'); if(fm) fm.value = '';
19014:   const fg = $('#ai-filter-group'); if(fg) fg.value = '';
19015:   const st = $('#ai-status'); if(st) st.textContent = '';
19016:   const ctx = $('#ai-result-context'); if(ctx) ctx.innerHTML = '';
19017:   const bk = $('#ai-result-backend'); if(bk) bk.innerHTML = '';
19018:   const lc = $('#ai-result-local'); if(lc) lc.innerHTML = '';
19019: }
19020: 
19021: $('#btn-ai-analyze').addEventListener('click', ()=>{
19022:   if(!$('#ai-query').value.trim()){ toast('Jelaskan dulu masalah yang ingin dianalisa.', true); return; }
19023:   runAiAnalysis();
19024: });
19025: 
19026: /* ---------------- PREDICTIVE MAINTENANCE (PATROL) ---------------- */
19027: // Sama seperti Report IPAL: cache lokal dulu supaya form tetap responsif,
19028: // lalu disinkronkan ke Google Sheet (sheet "Predictive Maintenance") lewat
19029: // backend Web App. Backend akan otomatis membuat sheet tsb bila belum ada.
19030: let PM_REPORTS = [];
19031: function loadPmReportsLocal(){
19032:   try{ return JSON.parse(localStorage.getItem(LS_PM_KEY) || '[]'); }catch(e){ return []; }
19033: }
19034: function savePmReportsLocal(list){
19035:   localStorage.setItem(LS_PM_KEY, JSON.stringify(list));
19036:   PM_REPORTS = list;
19037: }
19038: function loadPmReports(){
19039:   if(CURRENT_USER && typeof canAccessView_==='function' && !canAccessView_('patrol')){
19040:     PM_REPORTS = [];
19041:     return PM_REPORTS;
19042:   }
19043:   PM_REPORTS = loadPmReportsLocal();
19044:   return PM_REPORTS;
19045: }
19046: 
19047: // Findings Patrol versi lama dapat menyimpan blob: URL lokal, sedangkan kolom
19048: // Files sudah punya URL permanen Cloudflare. Petakan ulang berdasarkan urutan
19049: // agar data lama langsung pulih di gadget lain tanpa perlu edit ulang record.
19050: function hydratePatrolFindingFiles_(findings, stableFiles){
19051:   const out = Array.isArray(findings) ? JSON.parse(JSON.stringify(findings)) : [];
19052:   const stable = Array.isArray(stableFiles) ? stableFiles.filter(Boolean) : [];
19053:   let cursor = 0;
~~~

## applyLogbook @ L6899
~~~text
06881:   holder.innerHTML = '';
06882:   try{
06883:     const res = await apiPost({ action:'fixLogbookDataQuality', actor: CURRENT_USER.username, dryRun: true });
06884:     btn.disabled = false; btn.innerHTML = oldLabel;
06885:     if(!res.dateFixCount && !res.jenisFixCount){
06886:       holder.innerHTML = `<div class="sub" style="color:var(--green,#3fc978);">✅ Tidak ditemukan data bermasalah -- tanggal & Jenis Pekerjaan semuanya sudah rapi.</div>`;
06887:       return;
06888:     }
06889:     const dateRows = (res.dateFixSample||[]).map(x=> `<tr><td>${escapeHtml(String(x.id))}</td><td>${escapeHtml(x.oldValue)}</td><td>→ ${escapeHtml(x.newValue)}</td></tr>`).join('');
06890:     const jenisRows = (res.jenisFixSample||[]).map(x=> `<tr><td>${escapeHtml(String(x.id))}</td><td>${escapeHtml(x.oldDeskripsi)}</td><td>→ Jenis Pekerjaan: ${escapeHtml(x.newJenis)}</td></tr>`).join('');
06891:     holder.innerHTML = `
06892:       <div class="sub" style="margin-bottom:8px;">Ditemukan <b>${res.dateFixCount} baris</b> dengan tanggal bermasalah dan <b>${res.jenisFixCount} baris</b> dengan "Preventive" salah kolom. Contoh (maks 30 per kategori ditampilkan):</div>
06893:       ${res.dateFixCount ? `<div style="font-weight:600;font-size:12.5px;margin:10px 0 4px;">📅 Perbaikan Tanggal</div>
06894:         <div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>ID</th><th>Sebelum</th><th>Sesudah</th></tr></thead><tbody>${dateRows}</tbody></table></div>` : ''}
06895:       ${res.jenisFixCount ? `<div style="font-weight:600;font-size:12.5px;margin:14px 0 4px;">🛠 Perbaikan Jenis Pekerjaan</div>
06896:         <div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>ID</th><th>Deskripsi Masalah Lama</th><th>Perubahan</th></tr></thead><tbody>${jenisRows}</tbody></table></div>` : ''}
06897:       <button class="btn btn-sm btn-primary" id="btn-apply-data-fix" style="margin-top:14px;"><i class="ph-bold ph-check"></i> Terapkan Semua Perbaikan (${res.dateFixCount + res.jenisFixCount} baris)</button>
06898:     `;
06899:     $('#btn-apply-data-fix').addEventListener('click', applyLogbookDataFix);
06900:   }catch(err){
06901:     btn.disabled = false; btn.innerHTML = oldLabel;
06902:     toast('Gagal memindai: ' + err.message, true);
06903:   }
06904: }
06905: async function applyLogbookDataFix(){
06906:   if(!confirm('Terapkan perbaikan ini ke database SQLite sekarang? Tindakan ini akan MENGUBAH data langsung di sheet Logbook dan tidak bisa di-undo otomatis.')) return;
06907:   const applyBtn = $('#btn-apply-data-fix');
06908:   const oldLabel = applyBtn.innerHTML;
06909:   applyBtn.disabled = true; applyBtn.innerHTML = '<span class="ai-spinner" style="width:11px;height:11px;"></span> Menerapkan...';
06910:   try{
06911:     const res = await apiPost({ action:'fixLogbookDataQuality', actor: CURRENT_USER.username, dryRun: false });
06912:     toast(`Perbaikan diterapkan: ${res.dateFixCount} tanggal + ${res.jenisFixCount} Jenis Pekerjaan.`);
06913:     $('#data-fix-result').innerHTML = `<div class="sub" style="color:var(--green,#3fc978);">✅ Selesai diterapkan. Memuat ulang data...</div>`;
06914:     ENTRIES = await apiGet('list');
06915:     goToView('setting');
06916:   }catch(err){
06917:     applyBtn.disabled = false; applyBtn.innerHTML = oldLabel;
06918:     toast('Gagal menerapkan: ' + err.message, true);
06919:   }
06920: }
06921: 
06922: async function renderRbacUserTable(){
06923:   const holder = $('#rbac-user-table');
06924:   if(!holder) return;
06925:   holder.innerHTML = '<div style="color:var(--text-dim);font-size:12.5px;">Memuat daftar user...</div>';
06926:   try{
06927:     const users = await apiGet('users', { actor: CURRENT_USER.username });
06928:     if(!users.length){ holder.innerHTML = '<div style="color:var(--text-dim);font-size:12.5px;">Belum ada user selain Superadmin default.</div>'; return; }
06929:     holder.innerHTML = `
06930:       <table class="data-table">
06931:         <thead><tr><th>Username</th><th>Nama</th><th>Role</th><th>Status</th><th>Aksi</th></tr></thead>
06932:         <tbody>
06933:           ${users.map(u => `
06934:             <tr data-username="${escapeHtml(u.username)}">
06935:               <td>${escapeHtml(u.username)}</td>
06936:               <td>${escapeHtml(u.displayName || '-')}</td>
06937:               <td>
06938:                 <select class="ru-edit-role" ${u.username===CURRENT_USER.username?'disabled':''}>
~~~

## User Management @ L5392
~~~text
05374:         .rbac-role-switch{display:flex;gap:6px;padding:4px;border:1px solid var(--line);border-radius:10px;background:var(--panel-2);}
05375:         .rbac-role-switch button{border:0;background:transparent;color:var(--text-dim);padding:7px 11px;border-radius:7px;cursor:pointer;font-weight:700;}
05376:         .rbac-role-switch button.active{background:var(--red);color:#fff;}
05377:         .rbac-role-group{border:1px solid var(--line);border-radius:10px;background:var(--panel-2);margin-bottom:8px;overflow:hidden;}
05378:         .rbac-role-group>summary{cursor:pointer;list-style:none;padding:10px 12px;display:flex;justify-content:space-between;gap:10px;align-items:center;font-weight:700;}
05379:         .rbac-role-group>summary::-webkit-details-marker{display:none;}
05380:         .rbac-role-group-body{border-top:1px solid var(--line-soft);}
05381:         .rbac-compact-row{display:grid;grid-template-columns:minmax(180px,1fr) auto auto;gap:12px;align-items:center;padding:9px 12px;border-bottom:1px solid var(--line-soft);}
05382:         .rbac-compact-row:last-child{border-bottom:0;}
05383:         .rbac-feature-name{font-size:12.5px;font-weight:650;}.rbac-feature-key{font-size:9.5px;color:var(--text-dim);font-family:var(--font-mono);}
05384:         .rbac-toggle-label{display:flex;align-items:center;gap:6px;font-size:11px;color:var(--text-dim);white-space:nowrap;}
05385:         .rbac-group-actions{display:flex;gap:5px;flex-wrap:wrap;}
05386:         @media(max-width:760px){.rbac-activity-item{grid-template-columns:1fr 1fr}.rbac-compact-row{grid-template-columns:1fr 1fr}.rbac-feature-cell{grid-column:1/-1}.rbac-toggle-label{white-space:normal}}
05387:       </style>
05388: 
05389:       <div class="setting-tabs-wrap">
05390:         <div class="setting-tabs" id="setting-tabs">
05391:           <button class="setting-tab-btn active" data-tab="koneksi"><i class="ph-bold ph-link"></i> Koneksi</button>
05392:           <button class="setting-tab-btn" data-tab="users"><i class="ph-bold ph-users"></i> User Management</button>
05393:           <button class="setting-tab-btn" data-tab="roles"><i class="ph-bold ph-shield-check"></i> Role Access</button>
05394:           <button class="setting-tab-btn" data-tab="mesin"><i class="ph-bold ph-gear-six"></i> Mesin</button>
05395:           <button class="setting-tab-btn" data-tab="patrol-template"><i class="ph-bold ph-list-checks"></i> Template Patrol</button>
05396:           <button class="setting-tab-btn" data-tab="patrol-kategori"><i class="ph-bold ph-toggle-right"></i> Kategori Patrol</button>
05397:           <button class="setting-tab-btn" data-tab="personil"><i class="ph-bold ph-users-three"></i> Personil</button>
05398:           <button class="setting-tab-btn" data-tab="formula"><i class="ph-bold ph-function"></i> Formula</button>
05399:           
05400:         </div>
05401:       </div>
05402: 
05403:       <!-- TAB: KONEKSI -->
05404:       <div class="setting-tab-panel active" id="setting-tab-panel-koneksi">
05405:         <div class="card" style="margin-bottom:18px;">
05406:           <div class="section-title"><i class="ph-bold ph-link"></i> URL Web App (Cloudflare)</div>
05407:           <div class="field">
05408:             <input type="text" id="input-webapp-url" placeholder="https://nama-aplikasi.workers.dev/api">
05409:           </div>
05410:           <button class="btn btn-primary btn-sm" id="btn-save-url">Simpan &amp; Hubungkan</button>
05411:           <span id="conn-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
05412:           <div class="sub" style="margin-top:10px;">Tempel URL dari deployment <code>/exec</code> Cloudflare. URL ini disimpan lokal di browser (localStorage) karena dibutuhkan untuk koneksi awal. Setelah simpan, semua setting lain di tab ini akan tersimpan di database SQLite.<br><br><b>Semua tab lain (Mesin, Personil, Patrol, Formula, Sparepart) 100% tersimpan di database SQLite</b>, bukan hanya lokal. Cek di Spreadsheet kamu akan muncul sheet baru: <code>Analitik_Config</code>, <code>Patrol_Category_Config</code>, <code>Patrol_General_Checklist</code>.</div>
05413:         </div>
05414:       </div>
05415: 
05416:       <!-- TAB: USER MANAGEMENT -->
05417:       <div class="setting-tab-panel" id="setting-tab-panel-users">
05418:         <div id="rbac-admin-section"></div>
05419:         <div class="setting-tab-empty" id="rbac-empty-hint" style="display:none;">Memuat data user... Jika tetap kosong, pastikan kamu login sebagai Superadmin.</div>
05420:       </div>
05421: 
05422:       <!-- TAB: ROLE ACCESS MANAGEMENT -->
05423:       <div class="setting-tab-panel" id="setting-tab-panel-roles">
05424:         <div id="rbac-role-section"></div>
05425:       </div>
05426: 
05427:       <!-- TAB: MESIN -->
05428:       <div class="setting-tab-panel" id="setting-tab-panel-mesin">
05429:         <div class="card" style="margin-bottom:18px;">
05430:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Mesin Baru</div>
05431:           <div class="grid3">
~~~

## User Management @ L5416
~~~text
05398:           <button class="setting-tab-btn" data-tab="formula"><i class="ph-bold ph-function"></i> Formula</button>
05399:           
05400:         </div>
05401:       </div>
05402: 
05403:       <!-- TAB: KONEKSI -->
05404:       <div class="setting-tab-panel active" id="setting-tab-panel-koneksi">
05405:         <div class="card" style="margin-bottom:18px;">
05406:           <div class="section-title"><i class="ph-bold ph-link"></i> URL Web App (Cloudflare)</div>
05407:           <div class="field">
05408:             <input type="text" id="input-webapp-url" placeholder="https://nama-aplikasi.workers.dev/api">
05409:           </div>
05410:           <button class="btn btn-primary btn-sm" id="btn-save-url">Simpan &amp; Hubungkan</button>
05411:           <span id="conn-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
05412:           <div class="sub" style="margin-top:10px;">Tempel URL dari deployment <code>/exec</code> Cloudflare. URL ini disimpan lokal di browser (localStorage) karena dibutuhkan untuk koneksi awal. Setelah simpan, semua setting lain di tab ini akan tersimpan di database SQLite.<br><br><b>Semua tab lain (Mesin, Personil, Patrol, Formula, Sparepart) 100% tersimpan di database SQLite</b>, bukan hanya lokal. Cek di Spreadsheet kamu akan muncul sheet baru: <code>Analitik_Config</code>, <code>Patrol_Category_Config</code>, <code>Patrol_General_Checklist</code>.</div>
05413:         </div>
05414:       </div>
05415: 
05416:       <!-- TAB: USER MANAGEMENT -->
05417:       <div class="setting-tab-panel" id="setting-tab-panel-users">
05418:         <div id="rbac-admin-section"></div>
05419:         <div class="setting-tab-empty" id="rbac-empty-hint" style="display:none;">Memuat data user... Jika tetap kosong, pastikan kamu login sebagai Superadmin.</div>
05420:       </div>
05421: 
05422:       <!-- TAB: ROLE ACCESS MANAGEMENT -->
05423:       <div class="setting-tab-panel" id="setting-tab-panel-roles">
05424:         <div id="rbac-role-section"></div>
05425:       </div>
05426: 
05427:       <!-- TAB: MESIN -->
05428:       <div class="setting-tab-panel" id="setting-tab-panel-mesin">
05429:         <div class="card" style="margin-bottom:18px;">
05430:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Mesin Baru</div>
05431:           <div class="grid3">
05432:             <div class="field"><label>Kode Mesin</label><input type="text" id="new-kode-mesin" placeholder="OFU-1"></div>
05433:             <div class="field"><label>Nama Mesin</label><input type="text" id="new-nama-mesin" placeholder="Offset Machine #5"></div>
05434:           </div>
05435:           <div class="grid3">
05436:             <div class="field"><label>Model</label><input type="text" id="new-model-mesin" placeholder="cth: CD 102-8+L"></div>
05437:             <div class="field"><label>Kategori</label><input type="text" id="new-kategori-mesin" placeholder="A - Offset Printing"></div>
05438:             <div class="field"><label>Lokasi/Area</label><input type="text" id="new-lokasi-mesin" placeholder="cth: Ruang Cetak Offset"></div>
05439:           </div>
05440:           <div class="field"><label>Nama Mesin (Deskripsi Lengkap)</label><input type="text" id="new-deskripsi-mesin" placeholder="cth: OFFSET UV INK - 5 MACHINE + INLINE INS"></div>
05441:           <div class="field"><label>Fungsi Mesin (Bahasa Indonesia)</label><textarea id="new-fungsi-mesin" rows="3" placeholder="Jelaskan fungsi mesin ini secara singkat."></textarea></div>
05442:           <div class="field"><label>Spesifikasi Mesin</label><textarea id="new-spesifikasi-mesin" rows="4" placeholder="cth: Kapasitas 8000 lembar/jam, tahun pembuatan 2015, tegangan 380V, dst."></textarea></div>
05443:           <div class="grid2">
05444:             <div class="field"><label>Link Manual Book / Referensi</label><input type="text" id="new-link-referensi-mesin" placeholder="https://..."></div>
05445:             <div class="field"><label>Keterangan Sumber</label><input type="text" id="new-keterangan-sumber-mesin" placeholder="cth: Situs resmi pabrikan"></div>
05446:           </div>
05447:           <div class="field">
05448:             <label>Manual Book (PDF)</label>
05449:             <input type="file" id="new-manual-pdf" accept="application/pdf">
05450:             <div id="manual-pdf-preview" style="margin-top:8px;font-size:12px;color:var(--text-dim);"></div>
05451:           </div>
05452:           <button class="btn btn-sm" id="btn-add-machine">+ Tambah Mesin</button>
05453:           <button class="btn btn-sm" id="btn-cancel-edit-machine" style="display:none;">Batal Edit</button>
05454:           <div style="margin-top:16px;" id="machine-list-table"></div>
05455:         </div>
~~~

## User Management @ L6694
~~~text
06676:       if(onSuccess) onSuccess();
06677:     }catch(err){
06678:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06679:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06680:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06681:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06682:       errEl.style.display = 'block';
06683:     }finally{
06684:       submitBtn.disabled = false;
06685:       submitBtn.innerHTML = originalLabel;
06686:     }
06687:   };
06688:   $('#btn-setting-login-submit').addEventListener('click', submit);
06689:   $('#setting-login-password').addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ ev.preventDefault(); submit(); } });
06690:   setTimeout(()=> $('#setting-login-username') && $('#setting-login-username').focus(), 50);
06691: }
06692: 
06693: /* ======================================================================
06694:    [RBAC] USER MANAGEMENT & ROLE ACCESS MANAGEMENT (khusus Superadmin)
06695:    ----------------------------------------------------------------------
06696:    Mengikuti pola render-ke-container yang sudah dipakai di menu Setting
06697:    lain (renderMachineTable, renderPersonilTable, dst). Semua data
06698:    (user, role, permission) diambil & disimpan lewat code.gs — frontend
06699:    di sini hanya UI, tidak menyimpan apa pun secara lokal.
06700:    ====================================================================== */
06701: function renderRbacAdminSection(){
06702:   const holder = $('#rbac-admin-section');
06703:   if(!holder) return;
06704:   if(!isSettingAuthed()){ holder.innerHTML = ''; return; }
06705:   holder.innerHTML = `
06706:     <div class="card" style="margin-bottom:18px;">
06707:       <div class="section-title"><i class="ph-bold ph-users"></i> User Management <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
06708:       <div class="sub" style="margin-bottom:12px;">Kelola akun aplikasi tanpa bercampur dengan pengaturan role. Setiap aktivitas user dicatat ke Audit Log terpusat.</div>
06709:       <div class="grid3">
06710:         <div class="field"><label>Username</label><input type="text" id="ru-username" placeholder="cth: budi.santoso" autocomplete="off"></div>
06711:         <div class="field"><label>Nama Tampilan</label><input type="text" id="ru-displayname" placeholder="cth: Budi Santoso"></div>
06712:         <div class="field"><label>Role</label>
06713:           <select id="ru-role">
06714:             <option value="Technician">Technician</option>
06715:             <option value="Supervisor">Supervisor</option>
06716:             <option value="Superadmin">Superadmin</option>
06717:           </select>
06718:         </div>
06719:       </div>
06720:       <div class="field"><label>Password (min. 6 karakter)</label><input type="password" id="ru-password" placeholder="Password awal" autocomplete="new-password"></div>
06721:       <button class="btn btn-sm btn-primary" id="btn-add-user"><i class="ph-bold ph-user-plus"></i> Tambah User</button>
06722:       <span id="ru-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
06723:       <div style="margin-top:16px;" id="rbac-user-table"></div>
06724:     </div>
06725: 
06726:     <div class="card" style="margin-bottom:18px;">
06727:       <div class="section-title"><i class="ph-bold ph-activity"></i> User Activity Monitor</div>
06728:       <div class="sub">Pantau login, logout, perubahan data/konfigurasi, serta operasi yang gagal. Detail sensitif seperti password, token, API key, hash, dan salt tetap disensor oleh backend.</div>
06729:       <div id="rbac-user-activity"></div>
06730:     </div>
06731: 
06732:     <div class="card" style="margin-bottom:18px;">
06733:       <div class="section-title"><i class="ph-bold ph-broom"></i> Perbaikan Kualitas Data Logbook <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
~~~

## User Management @ L28212
~~~text
28194: 
28195:   const SIMPLE_TEXT=Object.freeze({
28196:     'Home':'Beranda','Project Center':'Pusat Proyek','Corrective Report':'Laporan Perbaikan',
28197:     'Dashboard KPI Department':'Target Kerja Departemen','Breakdown Mesin (MTD/YTD)':'Riwayat Kerusakan Mesin',
28198:     'Database Mesin':'Data Mesin','Reports & Field Work':'Laporan & Pekerjaan Lapangan','Water Treatment Plant':'Pengolahan Air',
28199:     'Energy & Utility':'Energi & Utilitas','Insights':'Analisis & Pengetahuan','KPI Department':'Target Kerja Departemen',
28200:     'People & Meetings':'Orang & Rapat','Input Report':'Buat Laporan','Dashboard & Analytics':'Ringkasan & Grafik',
28201:     'Factory Project':'Proyek Pabrik','Filter':'Saring Data','Tambah Project':'Tambah Proyek',
28202:     'PI Dashboard':'Ringkasan Kemampuan','Personnel':'Data Personel','Meeting Management':'Kelola Rapat',
28203:     'Meeting Analytics':'Ringkasan Rapat','Meeting Baru':'Buat Rapat','Open':'Belum Selesai',
28204:     'Download Excel Hasil Analisa':'Unduh Hasil Excel','Download Excel Resume':'Unduh Ringkasan Excel',
28205:     'Refresh':'Muat Ulang','Dashboard Analitik':'Ringkasan Analisis','Correlation Analysis':'Cari Hubungan Data',
28206:     'Diagnostic Wizard':'Panduan Cari Penyebab','Knowledge Base':'Pusat Pengetahuan',
28207:     'Knowledge Center':'Pusat Pengetahuan','Expert Finder':'Cari Teknisi Berpengalaman',
28208:     'Knowledge Graph':'Peta Hubungan Pengetahuan','Import Excel':'Ambil dari Excel',
28209:     'Import Excel (Upload File)':'Ambil dari File Excel','Tambah / Update Data':'Tambah / Ubah Data',
28210:     'Export Excel':'Unduh Excel','Export PDF':'Unduh PDF','Export Word':'Unduh Word',
28211:     'Reset':'Atur Ulang','Reset Konteks':'Kosongkan Pilihan','Reset Tampilan':'Atur Ulang Tampilan',
28212:     'User Management':'Kelola Pengguna','Role Access':'Hak Akses','Template Patrol':'Daftar Pemeriksaan Patrol',
28213:     'Tambah User':'Tambah Pengguna','Simpan Role Access':'Simpan Hak Akses','Edit':'Ubah','Batal Edit':'Batal Mengubah',
28214:     'Simpan Report RCA':'Simpan Laporan RCA','Buat Report IPAL Baru':'Buat Laporan IPAL Baru','Simpan Report':'Simpan Laporan',
28215:     'Import Semua Baris':'Ambil Semua Baris','Update Progress':'Tambah Perkembangan','Simpan Update':'Simpan Perkembangan',
28216:     'Edit Data':'Ubah Data','Tambah File (lewat Edit Data)':'Tambah File','Tambah Update Progress':'Tambah Perkembangan',
28217:     'Edit Meeting Ini':'Ubah Rapat Ini','Simpan Meeting':'Simpan Rapat','Tambah Action Item':'Tambah Tugas',
28218:     'Soft Skill Assessment':'Penilaian Perilaku','Hard Skill Assessment':'Penilaian Teknis',
28219:     'Smart Recognition & Resume Personil':'Ringkasan Otomatis Personel','Smart Recognition':'Pengenalan Otomatis',
28220:     'Smart Resume (Ringkasan Otomatis)':'Ringkasan Otomatis','Radar Chart — Soft Skill':'Grafik Penilaian Perilaku',
28221:     'Radar Chart — Hard Skill':'Grafik Penilaian Teknis','Hard Skill Detail':'Detail Kemampuan Teknis',
28222:     'Hard Skill Competency — Detail':'Detail Kompetensi Teknis','Soft Skill Summary (Penilaian Terbaru)':'Ringkasan Penilaian Perilaku Terbaru',
28223:     'Generate Report RCA':'Buat Laporan RCA','Sparepart Management':'Kelola Suku Cadang',
28224:     'Auto-Sync Knowledge Base':'Sinkronkan Pengetahuan Otomatis','Scan Ulang':'Periksa Ulang',
28225:     'Card View':'Tampilan Kartu','Table View':'Tampilan Tabel','Status Project':'Status Proyek',
28226:     'Progress per Bulan (rata-rata update)':'Perkembangan Rata-rata per Bulan','Jumlah Project per Jenis':'Jumlah Proyek per Jenis',
28227:     'Laporan Proyek — Project Status Report':'Laporan Status Proyek','Update Action Item':'Ubah Tugas',
28228:     'Analisa Downtime Elektrikal & Mekanikal':'Analisa Waktu Berhenti Elektrikal & Mekanikal',
28229:     'Analisa Downtime E&M':'Analisa Waktu Berhenti E&M','People Intelligence Dashboard':'Ringkasan Kemampuan Personel',
28230:     '+ Simpan KPI':'Simpan Target Kerja','Sinkron Data Aktual KPI Department':'Ambil Data Target Terbaru',
28231:     'Muat Data dari Excel':'Ambil Data Excel','Simpan PO':'Simpan Pesanan','Simpan Hasil Opname':'Simpan Hasil Cek Stok',
28232:     '+ Simpan Data Sparepart':'Simpan Suku Cadang','Impor Data Elektrikal Standar':'Ambil Daftar Pemeriksaan Elektrikal',
28233:     'Impor Data Mekanikal Standar':'Ambil Daftar Pemeriksaan Mekanikal','Simpan Formula':'Simpan Rumus',
28234:     'Impor Data Personil (Packaging Offset Technical)':'Ambil Data Personel Packaging Offset',
28235:     'Simpan Assessment Manual':'Simpan Penilaian Manual','Tanya Internal':'Tanya Data OMODOS','AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.':'AI luar hanya dipakai jika Anda menekan tombolnya. Data yang dikirim dibatasi pada bagian yang berhubungan dengan pertanyaan.',
28236:     'AI External':'Tanya AI Luar','Bersihkan Data':'Hapus Percakapan',
28237:     'Mulai Checklist':'Mulai Pemeriksaan','Lanjut ke Temuan':'Lanjut ke Catatan Temuan',
28238:     'Analisa Data':'Periksa Data','Tambah Milestone':'Tambah Tahap Penting',
28239:     'Auto-detect':'Cari Otomatis','Auto-detect (default: NOTE)':'Cari Otomatis (biasanya kolom NOTE)',
28240:     'Smart Recognition':'Pengenalan Otomatis','Resume Psikologis (Indikatif — dari Soft Skill Assessment)':'Ringkasan Perilaku dari Penilaian',
28241:     'Update Progress':'Perbarui Perkembangan','Daftar Project':'Daftar Proyek',
28242:     'Timeline Gantt':'Jadwal Proyek','Progress':'Perkembangan',
28243:     'Factory Project, Kaizen & SGA dalam satu tempat.':'Proyek pabrik, Kaizen, dan SGA dalam satu tempat.',
28244:     'Card View':'Tampilan Kartu','Table View':'Tampilan Tabel'
28245:   });
28246: 
28247:   const GLOSSARY=[
28248:     ['Maintenance','Perawatan mesin agar tetap bekerja dengan baik.'],['Logbook','Catatan pekerjaan maintenance.'],['Patrol','Pemeriksaan rutin mesin.'],
28249:     ['Personel','Orang atau karyawan yang bekerja.'],['PIC','Orang yang bertanggung jawab pada suatu tugas.'],
28250:     ['PO','Pesanan pembelian barang.'],['Opname','Pengecekan jumlah barang secara langsung.'],['Utilitas','Listrik, air, udara, dan kebutuhan pendukung.'],
28251:     ['Milestone','Tahap penting dalam sebuah proyek.'],['Assessment','Penilaian kemampuan atau hasil kerja.'],
~~~

## Role Access @ L2935
~~~text
02917: .pmc-chart-card h4{margin:0 0 10px 0;font-size:12.5px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.3px;}
02918: .pmc-chart-card canvas{max-height:220px;}
02919: .pmc-gantt-row{display:grid;grid-template-columns:180px 1fr;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--line);}
02920: .pmc-gantt-label{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
02921: .pmc-gantt-track{position:relative;height:18px;background:rgba(255,255,255,.05);border-radius:6px;}
02922: .pmc-gantt-bar{position:absolute;top:0;height:100%;border-radius:6px;font-size:9.5px;color:#fff;display:flex;align-items:center;padding-left:6px;overflow:hidden;white-space:nowrap;}
02923: 
02924: /* ===== Meeting Management (reuses pmc-* design tokens) ===== */
02925: .pmc-item-card{background:var(--panel,#171a1e);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:14px;}
02926: .pmc-item-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;gap:8px;}
02927: .pmc-item-title{font-weight:700;font-size:14px;margin-bottom:6px;}
02928: .pmc-item-sub{font-size:11.5px;color:var(--text-dim);margin-bottom:4px;}
02929: .pmc-item-actions{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;}
02930: .mtg-type-pick.active{border-color:var(--red,#ff5566) !important;}
02931: table.data-table{width:100%;border-collapse:collapse;font-size:12px;}
02932: table.data-table th, table.data-table td{padding:8px 10px;border-bottom:1px solid rgba(255,255,255,.07);text-align:left;vertical-align:top;}
02933: .chip-row .machine-chip{cursor:default;}
02934: 
02935: /* [FIX BUG NYATA] Tabel data (mis. Role Access Management) punya kolom
02936:    dengan lebar tetap dalam pixel (mis. Supervisor/Technician 110px) --
02937:    di layar sempit, kolom PERTAMA yang tidak punya lebar eksplisit (mis.
02938:    "Fitur / Menu") jadi TERSISA sangat sempit (~30px), memaksa browser
02939:    memecah teksnya HURUF PER HURUF secara vertikal ("F/i/t/u/r"). Selain
02940:    tidak terbaca, ini juga membuat tabel jadi SANGAT tinggi (satu tabel
02941:    Role Access bisa sampai belasan ribu piksel tingginya).
02942:    Fix lama menggunakan scroll horizontal. Aturan global terbaru di bagian akhir
02943:    menggantinya dengan grid responsif tanpa horizontal scroll agar field tetap
02944:    berjajar dan otomatis pindah ke baris berikutnya saat ruang habis. */
02945: @media(max-width:700px){
02946:   table.data-table{
02947:     display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;
02948:   }
02949:   table.data-table thead, table.data-table tbody{ display:table;width:100%; }
02950:   table.data-table th:first-child, table.data-table td:first-child{
02951:     min-width:120px;white-space:normal;
02952:   }
02953: }
02954: 
02955: /* =========================================================
02956:    MODE POLOS — matikan semua animasi & background bergaris/
02957:    gradient dekoratif di seluruh halaman & header utama.
02958:    Diletakkan paling akhir supaya menang dari semua aturan
02959:    tema/style di atas (termasuk yang dipilih lewat menu Tema/Style).
02960:    ========================================================= */
02961: *, *::before, *::after{
02962:   animation:none !important;
02963: }
02964: /* Pengecualian: pulsa status Normal/Perlu Perhatian/Kritikal di card menu Home
02965:    tetap perlu berjalan (indikator penting) walau Mode Polos mematikan
02966:    animasi lain -- lihat definisi dashPulseGreen/Amber/Red di atas.
02967:    Ditarget ke card itu sendiri (bukan lagi ke isi/anak card), karena
02968:    redesign kedip sekarang berupa glow di tepi card, teks tidak lagi ikut
02969:    dianimasikan supaya selalu stabil & mudah dibaca. */
02970: .dash-card.status-normal{
02971:   animation: dashPulseGreen 2.6s ease-in-out infinite !important;
02972: }
02973: .dash-card.status-perhatian{
02974:   animation: dashPulseAmber 1.8s ease-in-out infinite !important;
~~~

## Role Access @ L3038
~~~text
03020: table{ max-width:100%; }
03021: pre, code{ white-space:pre-wrap; word-break:break-word; overflow-wrap:anywhere; }
03022: .modal, .app-error-modal, .card, .bnav-sheet{ max-width:100%; }
03023: 
03024: /* Cegah teks/kata panjang tanpa spasi (URL, ID, angka panjang) mendorong
03025:    layout melebar ke samping di kartu, tabel, dan label detail. */
03026: .detail-row .v, .card, td, th, .pi-emp-card, .lb-tab, .stat-chip{
03027:   overflow-wrap:anywhere;
03028: }
03029: 
03030: /* --- Tablet (901px-1024px): sempurnakan transisi sebelum breakpoint 900px ---
03031:    [FIX BUG KRITIS] Sebelumnya rule ini "@media(max-width:1024px)" TANPA batas
03032:    bawah -- otomatis ikut berlaku juga di lebar HP (mis. 390px), karena 390
03033:    juga < 1024. Karena blok ini muncul SETELAH blok "@media(max-width:900px)"
03034:    di bawah (yang seharusnya mengatur drawer mobile: grid-template-columns:1fr),
03035:    urutan cascade CSS membuat rule tablet ini MENANG dan MENIMPA-nya di semua
03036:    lebar HP -- akibatnya #app-root TETAP mereservasi kolom sidebar 210px
03037:    permanen di HP, menyisakan sisa ruang konten yang jauh lebih sempit dari
03038:    seharusnya (terverifikasi lewat screenshot: tabel Role Access Management
03039:    sampai memecah teks header huruf-per-huruf karena cuma dapat ~180px dari
03040:    390px layar). Ini bug SERIUS yang kemungkinan memengaruhi SEMUA halaman di
03041:    mode mobile, bukan cuma satu tempat -- makanya ditandai "BUG KRITIS", bukan
03042:    sekadar catatan kecil. Fix: beri batas bawah "min-width:901px" supaya rule
03043:    tablet ini TIDAK PERNAH berlaku di rentang mobile (≤900px) yang sudah
03044:    ditangani terpisah oleh drawer/off-canvas sidebar.
03045:    [FIX-2] "and (pointer:fine)" ditambahkan supaya rule sidebar-kolom-mini
03046:    di sini KHUSUS untuk jendela desktop/laptop (mouse) yang lebarnya
03047:    kebetulan ada di rentang 901-1024px. TANPA syarat ini, tablet sungguhan
03048:    (mis. iPad landscape/iPad Mini landscape yang lebarnya sering pas di
03049:    901-1024px) ikut kena rule ini karena muncul BELAKANGAN di cascade CSS
03050:    (menang atas rule sentuh/@media(pointer:coarse) di atas) -- akibatnya
03051:    sidebar kolom permanen tetap muncul & bottom-nav tetap hilang di tablet
03052:    landscape, padahal sidebar seharusnya HANYA untuk desktop. */
03053: @media(min-width:901px) and (max-width:1024px) and (pointer:fine){
03054:   .app{ grid-template-columns:210px 1fr; }
03055:   .main{ padding:24px 20px 100px 20px; }
03056:   .grid3{ grid-template-columns:1fr 1fr; }
03057:   .pi-card-grid, .insights-hub-grid, .attach-grid{
03058:     grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
03059:   }
03060: }
03061: 
03062: /* --- ≤900px (drawer aktif): rapikan sisa elemen yang belum ikut menyusut --- */
03063: @media(max-width:900px){
03064:   .grid3{ grid-template-columns:1fr 1fr; }
03065:   .modal-bg, .app-error-modal-bg{ padding:20px 12px; }
03066:   .modal, .app-error-modal{ padding:18px; max-height:calc(100vh - 40px); overflow-y:auto; }
03067:   .detail-row{ flex-direction:column; gap:2px; }
03068:   .detail-row .k{ width:auto; }
03069:   .attach-grid{ grid-template-columns:repeat(auto-fill,minmax(120px,1fr)); }
03070:   .theme-manager-grid, .style-manager-grid{ grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); }
03071: }
03072: 
03073: /* --- ≤700px (HP): konten satu kolom, jarak dipadatkan --- */
03074: @media(max-width:700px){
03075:   .grid3, .grid2{ grid-template-columns:1fr; }
03076:   .topbar{ align-items:flex-start; }
03077:   .topbar h1{ font-size:19px; }
~~~

## Role Access @ L6191
~~~text
06173: // bagian FORMULA MTBF/MTTR di bawah). Konstanta ini hanya dipakai sebagai
06174: // nilai default/fallback kalau belum pernah diisi sama sekali.
06175: const HOME_KERUGIAN_PER_JAM_RP_DEFAULT = 5000000; // Rp 5.000.000 / jam downtime (default awal)
06176: function getHomeKerugianPerJamRp(){
06177:   return (typeof ANALITIK_CONFIG !== 'undefined' && ANALITIK_CONFIG && Number(ANALITIK_CONFIG.kerugianPerJam) > 0)
06178:     ? Number(ANALITIK_CONFIG.kerugianPerJam)
06179:     : HOME_KERUGIAN_PER_JAM_RP_DEFAULT;
06180: }
06181: 
06182: /* ---------------- RBAC STATE ----------------
06183:    CURRENT_USER / PERMISSIONS / FEATURE_REGISTRY diisi dari respons login
06184:    code.gs (single source of truth). Disimpan di localStorage (bukan
06185:    sessionStorage) supaya sesi login TETAP tersimpan walau tab/file HTML
06186:    ditutup lalu dibuka lagi di browser yang sama, bukan cuma bertahan saat
06187:    refresh dalam tab yang sama. PERMISSIONS & FEATURE_REGISTRY ikut
06188:    di-cache juga (bukan cuma CURRENT_USER) supaya sesi tetap bisa langsung
06189:    dipulihkan & UI langsung unlock walau pemulihan sempat gagal terhubung
06190:    ke server saat halaman baru dibuka — lalu disegarkan lagi dari code.gs
06191:    begitu server terjangkau, supaya perubahan Role Access Management tetap
06192:    berlaku tanpa perlu logout paksa.                                       */
06193: const SS_USER_KEY = 'logbook_rbac_user';
06194: const SS_TOKEN_KEY = 'logbook_session_token';
06195: const SS_TOKEN_EXP_KEY = 'logbook_session_expires_at';
06196: const LS_PERM_KEY = 'logbook_rbac_permissions';
06197: const LS_FEATURES_KEY = 'logbook_rbac_features';
06198: const LS_ACCOUNT_CACHE_OWNER_KEY = 'omodos_account_cache_active_owner_v1';
06199: const LS_ACCOUNT_CACHE_PREFIX = 'omodos_account_cache_v1_';
06200: const ACCOUNT_CACHE_EXACT_KEYS = new Set([
06201:   'app_low_cognitive_draft_form_entry',
06202:   'logbook_pending_sync_queue',
06203:   'logbook_rca_reports',
06204:   'logbook_sparepart_status',
06205:   'logbook_sparepart_lokasi',
06206:   'logbook_sparepart_eta',
06207:   'logbook_sparepart_warehouse',
06208:   'logbook_sparepart_opname',
06209:   'logbook_kpi_kerja',
06210:   'logbook_analitik_config',
06211:   'logbook_patrol_general_items',
06212:   'logbook_patrol_category_config',
06213:   'logbook_ipal_reports',
06214:   'logbook_predictive_reports',
06215:   'logbook_general_reports',
06216:   'pi_softskill_assessments',
06217:   'pi_hardskill_assessments_v1',
06218:   'pi_personnel_master_v1',
06219:   'omodos_machine_breakdown',
06220:   'omodos_record_ytd',
06221:   'omodos_run_hour_comparison',
06222:   'omodos_energy_cost_toe',
06223:   'omodos_corrective_report',
06224:   'omodos_energy_utility',
06225:   'logbook_lc_permissions'
06226: ]);
06227: const ACCOUNT_CACHE_DYNAMIC_PREFIXES = ['omodos_seed_v1_','emdt_history_'];
06228: function accountCacheOwnerId_(username){
06229:   const text=String(username||'').trim().toLowerCase();
06230:   if(!text) return '';
~~~

## Role Access @ L6375
~~~text
06357:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06358:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06359:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06360:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06361:   }catch(e){}
06362: }
06363: 
06364: function hasPermission(permissionKey){
06365:   if(!CURRENT_USER) return false;
06366:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06367:   const p = PERMISSIONS[permissionKey];
06368:   return !!(p && p[CURRENT_USER.role]);
06369: }
06370: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06371: 
06372: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06373: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06374: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06375: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06376: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06377: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06378: function discoverFeatureRegistryFromDom(){
06379:   const seen = new Set();
06380:   const list = [];
06381:   const labelOf = (btn)=>{
06382:     const clone = btn.cloneNode(true);
06383:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06384:     return clone.textContent.replace(/\s+/g,' ').trim();
06385:   };
06386:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06387:     const view = btn.dataset.view;
06388:     if(!view) return;
06389:     const key = 'view.' + view;
06390:     if(seen.has(key)) return;
06391:     seen.add(key);
06392:     const groupEl = btn.closest('.nav-group-collapsible');
06393:     let group = 'Umum';
06394:     if(groupEl){
06395:       const parentBtn = groupEl.querySelector('.nav-parent-btn');
06396:       if(parentBtn){ const g = labelOf(parentBtn); if(g) group = g; }
06397:     }
06398:     list.push({ PermissionKey:key, Label: labelOf(btn) || view, Group: group });
06399:   });
06400:   // Grup collapsible itu sendiri juga jadi "fitur" tergate-able (untuk
06401:   // menyembunyikan seluruh grup, bukan cuma item di dalamnya).
06402:   document.querySelectorAll('.sidebar .nav-group-collapsible[data-group-key]').forEach(g=>{
06403:     const gk = g.dataset.groupKey;
06404:     if(!gk) return;
06405:     const key = 'group.' + gk;
06406:     if(seen.has(key)) return;
06407:     seen.add(key);
06408:     const parentBtn = g.querySelector('.nav-parent-btn');
06409:     list.push({ PermissionKey:key, Label: (parentBtn ? labelOf(parentBtn) : gk) + ' (Grup)', Group: 'Grup Menu' });
06410:   });
06411:   // [FIX] Halaman yang HANYA bisa dibuka lewat kartu hub (Insights, People
06412:   // & Meetings, dst) — bukan lewat sidebar langsung — sebelumnya TIDAK
06413:   // pernah tersapu, jadi tidak pernah muncul di Role Access Management
06414:   // walau sudah digate oleh goToView(). Sekarang SEMUA elemen ber-atribut
~~~

## Role Access @ L6413
~~~text
06395:       const parentBtn = groupEl.querySelector('.nav-parent-btn');
06396:       if(parentBtn){ const g = labelOf(parentBtn); if(g) group = g; }
06397:     }
06398:     list.push({ PermissionKey:key, Label: labelOf(btn) || view, Group: group });
06399:   });
06400:   // Grup collapsible itu sendiri juga jadi "fitur" tergate-able (untuk
06401:   // menyembunyikan seluruh grup, bukan cuma item di dalamnya).
06402:   document.querySelectorAll('.sidebar .nav-group-collapsible[data-group-key]').forEach(g=>{
06403:     const gk = g.dataset.groupKey;
06404:     if(!gk) return;
06405:     const key = 'group.' + gk;
06406:     if(seen.has(key)) return;
06407:     seen.add(key);
06408:     const parentBtn = g.querySelector('.nav-parent-btn');
06409:     list.push({ PermissionKey:key, Label: (parentBtn ? labelOf(parentBtn) : gk) + ' (Grup)', Group: 'Grup Menu' });
06410:   });
06411:   // [FIX] Halaman yang HANYA bisa dibuka lewat kartu hub (Insights, People
06412:   // & Meetings, dst) — bukan lewat sidebar langsung — sebelumnya TIDAK
06413:   // pernah tersapu, jadi tidak pernah muncul di Role Access Management
06414:   // walau sudah digate oleh goToView(). Sekarang SEMUA elemen ber-atribut
06415:   // [data-view] di seluruh halaman ikut disapu, tidak cuma yang ada di
06416:   // sidebar, supaya menu/halaman baru — dari mana pun pintu masuknya
06417:   // (sidebar, kartu hub, tombol lain) — otomatis terdeteksi dan otomatis
06418:   // bisa diatur aksesnya, tanpa perlu ada yang menambah daftar manual.
06419:   const hubGroupLabel = {
06420:     'insights-hub-grid': 'Insights (Hub)',
06421:     'people-hub-grid': 'People & Meetings (Hub)'
06422:   };
06423:   document.querySelectorAll('[data-view]').forEach(el=>{
06424:     const view = el.dataset.view;
06425:     if(!view) return;
06426:     const key = 'view.' + view;
06427:     if(seen.has(key)) return;
06428:     seen.add(key);
06429:     let group = 'Halaman Lainnya';
06430:     for(const gridId in hubGroupLabel){
06431:       if(el.closest('#'+gridId)){ group = hubGroupLabel[gridId]; break; }
06432:     }
06433:     list.push({ PermissionKey:key, Label: labelOf(el) || view, Group: group });
06434:   });
06435:   const tabGroups = [
06436:     { attr:'data-ptab', group:'Tab: Patrol Harian' },
06437:     { attr:'data-sptab', group:'Tab: Sparepart' },
06438:     { attr:'data-mtg-mode', group:'Tab: Meeting Management' },
06439:     { attr:'data-pmc-mode', group:'Tab: Project Center' },
06440:     { attr:'data-dttab', group:'Tab: Downtime' }
06441:   ];
06442:   tabGroups.forEach(cfg=>{
06443:     document.querySelectorAll('['+cfg.attr+']').forEach(el=>{
06444:       const val=el.getAttribute(cfg.attr);
06445:       if(!val) return;
06446:       const key='tab.'+cfg.attr.replace(/^data-/,'')+'.'+val;
06447:       if(seen.has(key)) return;
06448:       seen.add(key);
06449:       list.push({
06450:         PermissionKey:key,
06451:         Label:el.textContent.replace(/\s+/g,' ').trim() || val,
06452:         Group:cfg.group
~~~

## Role Access @ L6486
~~~text
06468:   const byKey = {};
06469:   discovered.forEach(f=> byKey[f.PermissionKey] = f);
06470:   (backendList||[]).forEach(f=>{
06471:     if(!f || !f.PermissionKey) return;
06472:     byKey[f.PermissionKey] = Object.assign({}, byKey[f.PermissionKey] || {}, f);
06473:   });
06474:   return Object.values(byKey);
06475: }
06476: window.mergeFeatureRegistry = mergeFeatureRegistry;
06477: 
06478: // Render ulang sidebar (sembunyikan menu/submenu yang tidak diizinkan) dan
06479: // info user yang sedang login. Dipanggil setelah login sukses.
06480: function applyRbacToUi(){
06481:   $$('.nav-btn[data-view]').forEach(btn=>{
06482:     const view = btn.dataset.view;
06483:     // [FIX] "Home" (dashboard) DIKECUALIKAN dari RBAC gating -- ini halaman
06484:     // utama/landing page aplikasi, wajib selalu bisa diakses SEMUA role tanpa
06485:     // terkecuali. Sebelumnya kalau permission 'view.dashboard' untuk role
06486:     // tertentu belum di-centang di Role Access Management (mis. lupa di-set
06487:     // saat menambah role baru), tombol Home hilang total dari sidebar MAUPUN
06488:     // bottom-nav untuk role itu -- mengunci user dari halaman utamanya sendiri.
06489:     if(view === 'dashboard'){ btn.style.display = ''; return; }
06490:     const key = 'view.' + view;
06491:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06492:     // Hanya menu yang terdaftar di Feature Registry yang digate; menu lain
06493:     // (kalau ada) tetap tampil seperti semula supaya tidak mengubah UX yang
06494:     // belum terdaftar.
06495:     const allowed = !known || hasPermission(key);
06496:     btn.style.display = allowed ? '' : 'none';
06497:   });
06498:   // Sembunyikan grup kalau (a) SEMUA submenu di dalamnya disembunyikan, ATAU
06499:   // (b) grup itu sendiri punya permission 'group.<key>' yang secara eksplisit
06500:   // di-nonaktifkan di Role Access Management (mis. Superadmin sengaja
06501:   // mematikan seluruh grup "Reports & Field Work" untuk role tertentu, walau
06502:   // submenu di dalamnya belum tentu satu-satu di-nonaktifkan).
06503:   // [FIX] Sebelumnya permission 'group.<key>' HANYA dipakai untuk Low
06504:   // Cognitive Mode (data-lc-hide) -- tidak pernah benar-benar menyembunyikan
06505:   // grup dari Role Access Management biasa. Sekarang keduanya diperiksa.
06506:   // [FIX] Tombol bottom-nav mobile (data-group="...") sebelumnya TIDAK ikut
06507:   // disembunyikan sama sekali oleh RBAC -- hanya sidebar yang tergate,
06508:   // sehingga tombol grup di bottom-nav tetap muncul walau seluruh isinya
06509:   // (atau grupnya sendiri) tidak diizinkan untuk role tsb. Sekarang
06510:   // visibilitas bottom-nav-btn[data-group] SELALU disamakan dengan grup
06511:   // sidebar yang bersangkutan.
06512:   $$('.nav-group-collapsible').forEach(group=>{
06513:     const parentBtn = $('.nav-parent-btn', group);
06514:     const groupKey = (parentBtn && parentBtn.dataset.group) || group.dataset.groupKey || '';
06515:     // [FIX] Baris 'group.<key>' otomatis terdaftar di Role Access Management
06516:     // sebagai baris TERPISAH ("... (Grup)") dari menu-menu di dalamnya. Karena
06517:     // Simpan Role Access selalu mengirim SEMUA baris yang sedang tampil di
06518:     // tabel (bukan hanya yang diubah), baris grup yang tidak sengaja
06519:     // dibiarkan tidak tercentang otomatis tersimpan sebagai "ditolak" (false)
06520:     // begitu Superadmin menyimpan perubahan apa pun -- walau menu di dalam
06521:     // grup itu (mis. Patrol Harian) sudah eksplisit diizinkan satu-satu.
06522:     // Akibatnya seluruh grup (Reports & Field Work, Water Treatment Plant,
06523:     // Energy & Utility, KPI Department, dst) raib untuk role tsb walau
06524:     // isinya sudah diizinkan -- ini penyebab utama "menu sidebar/bottom bar
06525:     // tidak sesuai konfigurasi akun". Supaya konsisten dengan menu individual
~~~

## Role Access @ L6505
~~~text
06487:     // saat menambah role baru), tombol Home hilang total dari sidebar MAUPUN
06488:     // bottom-nav untuk role itu -- mengunci user dari halaman utamanya sendiri.
06489:     if(view === 'dashboard'){ btn.style.display = ''; return; }
06490:     const key = 'view.' + view;
06491:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06492:     // Hanya menu yang terdaftar di Feature Registry yang digate; menu lain
06493:     // (kalau ada) tetap tampil seperti semula supaya tidak mengubah UX yang
06494:     // belum terdaftar.
06495:     const allowed = !known || hasPermission(key);
06496:     btn.style.display = allowed ? '' : 'none';
06497:   });
06498:   // Sembunyikan grup kalau (a) SEMUA submenu di dalamnya disembunyikan, ATAU
06499:   // (b) grup itu sendiri punya permission 'group.<key>' yang secara eksplisit
06500:   // di-nonaktifkan di Role Access Management (mis. Superadmin sengaja
06501:   // mematikan seluruh grup "Reports & Field Work" untuk role tertentu, walau
06502:   // submenu di dalamnya belum tentu satu-satu di-nonaktifkan).
06503:   // [FIX] Sebelumnya permission 'group.<key>' HANYA dipakai untuk Low
06504:   // Cognitive Mode (data-lc-hide) -- tidak pernah benar-benar menyembunyikan
06505:   // grup dari Role Access Management biasa. Sekarang keduanya diperiksa.
06506:   // [FIX] Tombol bottom-nav mobile (data-group="...") sebelumnya TIDAK ikut
06507:   // disembunyikan sama sekali oleh RBAC -- hanya sidebar yang tergate,
06508:   // sehingga tombol grup di bottom-nav tetap muncul walau seluruh isinya
06509:   // (atau grupnya sendiri) tidak diizinkan untuk role tsb. Sekarang
06510:   // visibilitas bottom-nav-btn[data-group] SELALU disamakan dengan grup
06511:   // sidebar yang bersangkutan.
06512:   $$('.nav-group-collapsible').forEach(group=>{
06513:     const parentBtn = $('.nav-parent-btn', group);
06514:     const groupKey = (parentBtn && parentBtn.dataset.group) || group.dataset.groupKey || '';
06515:     // [FIX] Baris 'group.<key>' otomatis terdaftar di Role Access Management
06516:     // sebagai baris TERPISAH ("... (Grup)") dari menu-menu di dalamnya. Karena
06517:     // Simpan Role Access selalu mengirim SEMUA baris yang sedang tampil di
06518:     // tabel (bukan hanya yang diubah), baris grup yang tidak sengaja
06519:     // dibiarkan tidak tercentang otomatis tersimpan sebagai "ditolak" (false)
06520:     // begitu Superadmin menyimpan perubahan apa pun -- walau menu di dalam
06521:     // grup itu (mis. Patrol Harian) sudah eksplisit diizinkan satu-satu.
06522:     // Akibatnya seluruh grup (Reports & Field Work, Water Treatment Plant,
06523:     // Energy & Utility, KPI Department, dst) raib untuk role tsb walau
06524:     // isinya sudah diizinkan -- ini penyebab utama "menu sidebar/bottom bar
06525:     // tidak sesuai konfigurasi akun". Supaya konsisten dengan menu individual
06526:     // (default: izinkan, kecuali memang tidak ada satu pun menu di dalamnya
06527:     // yang diizinkan), grup sekarang HANYA disembunyikan berdasarkan
06528:     // visibilitas submenu di dalamnya -- permission 'group.<key>' tidak lagi
06529:     // dipakai sebagai gate tambahan yang bisa mengunci seluruh grup secara
06530:     // tidak sengaja.
06531:     const visibleChild = Array.from(group.querySelectorAll('.nav-btn[data-view], .v4-nav-btn[data-v4-workspace]')).some(b => b.style.display !== 'none');
06532:     const visible = visibleChild;
06533:     group.style.display = visible ? '' : 'none';
06534:     if(groupKey){
06535:       $$('.bottom-nav-btn[data-group="'+groupKey+'"]').forEach(bn=>{ bn.style.display = visible ? '' : 'none'; });
06536:     }
06537:   });
06538:   // [FIX] Grup sidebar TUNGGAL (bukan collapsible) yang cuma membungkus satu
06539:   // nav-btn, mis. "Home", "Insights", "People & Meetings" -- kalau nav-btn
06540:   // di dalamnya disembunyikan (tidak diizinkan), div pembungkusnya sendiri
06541:   // sebelumnya tetap ada di DOM (kosong, tapi masih mengambil margin-bottom),
06542:   // menyisakan celah kosong di sidebar. Sekarang div pembungkus itu ikut
06543:   // disembunyikan total kalau satu-satunya isinya tidak diizinkan.
06544:   $$('.nav-group:not(.nav-group-collapsible)').forEach(group=>{
~~~

## Role Access Management @ L6552
~~~text
06534:     if(groupKey){
06535:       $$('.bottom-nav-btn[data-group="'+groupKey+'"]').forEach(bn=>{ bn.style.display = visible ? '' : 'none'; });
06536:     }
06537:   });
06538:   // [FIX] Grup sidebar TUNGGAL (bukan collapsible) yang cuma membungkus satu
06539:   // nav-btn, mis. "Home", "Insights", "People & Meetings" -- kalau nav-btn
06540:   // di dalamnya disembunyikan (tidak diizinkan), div pembungkusnya sendiri
06541:   // sebelumnya tetap ada di DOM (kosong, tapi masih mengambil margin-bottom),
06542:   // menyisakan celah kosong di sidebar. Sekarang div pembungkus itu ikut
06543:   // disembunyikan total kalau satu-satunya isinya tidak diizinkan.
06544:   $$('.nav-group:not(.nav-group-collapsible)').forEach(group=>{
06545:     const visibleChild = $$('.nav-btn[data-view]', group).some(b => b.style.display !== 'none');
06546:     group.style.display = visibleChild ? '' : 'none';
06547:   });
06548:   // [FIX] Elemen [data-view] di LUAR sidebar (mis. kartu di Insights Hub /
06549:   // People & Meetings Hub) juga harus ikut disembunyikan kalau rolenya
06550:   // tidak diizinkan — sebelumnya cuma digate saat diklik (goToView), jadi
06551:   // kartunya tetap kelihatan walau ujung-ujungnya "Akses ditolak". Dengan
06552:   // ini, tampilan menu selalu konsisten dengan Role Access Management.
06553:   $$('[data-view]').forEach(el=>{
06554:     if(el.closest('.sidebar')) return; // sudah ditangani di atas
06555:     // [FIX] Sama seperti di atas: Home (dashboard) selalu tampil di manapun
06556:     // elemennya berada (termasuk tombol bottom-nav mobile), tidak ikut digate.
06557:     if(el.dataset.view === 'dashboard'){ el.style.display = ''; return; }
06558:     const key = 'view.' + el.dataset.view;
06559:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06560:     const allowed = !known || hasPermission(key);
06561:     el.style.display = allowed ? '' : 'none';
06562:   });
06563:   const userBadge = $('#rbac-user-badge');
06564:   if(userBadge && CURRENT_USER){
06565:     userBadge.innerHTML = `<i class="ph-bold ph-user-circle"></i> ${escapeHtml(CURRENT_USER.displayName || CURRENT_USER.username)} <span style="opacity:.65;">(${escapeHtml(CURRENT_USER.role)})</span>`;
06566:   }
06567: }
06568: 
06569: // "Access Denied": dipanggil saat mencoba masuk ke view yang tidak diizinkan
06570: // (baik lewat klik menu yang seharusnya sudah disembunyikan, maupun akses
06571: // URL/hash langsung). Core function halaman lain tetap berjalan normal.
06572: function showAccessDenied(){
06573:   toast('Akses ditolak — Anda tidak memiliki izin untuk membuka menu ini.', true);
06574: }
06575: 
06576: /* ---------------- COPILOT: PELACAK ERROR/BUG TEKNIS ----------------
06577:  * Menangkap error JS & promise rejection yang benar-benar terjadi di
06578:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06579:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06580:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06581:  */
06582: let COPILOT_ERROR_LOG = [];
06583: function copilotLogError(msg, srcInfo){
06584:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06585:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06586: }
06587: window.addEventListener('error', (ev)=>{
06588:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06589: });
06590: window.addEventListener('unhandledrejection', (ev)=>{
06591:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
~~~

## copilot-actions @ L1277
~~~text
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01277: .copilot-actions{display:flex;gap:8px;margin-top:8px;align-items:center;}
01278: .copilot-actions .btn{flex:1;justify-content:center;}
01279: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01280: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01281: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01282: @media(max-width:780px){
01283:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01284:   .copilot-panel{width:100vw;}
01285: }
01286: .ci-source-toggle{
01287:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01288:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01289: }
01290: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01291: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01293: .ci-source-row{
01294:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01295:   color:var(--text-dim);
01296: }
01297: .ci-source-row:last-child{border-bottom:none;}
01298: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01299: .ci-source-mesin{font-weight:600;color:var(--text);}
01300: .ci-source-desc{flex:1;min-width:120px;}
01301: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01302: 
01303: .ci-card{
01304:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01305:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01306: }
01307: .ci-card.lv-critical{border-left-color:var(--red);}
01308: .ci-card.lv-warning{border-left-color:var(--amber);}
01309: .ci-card.lv-info{border-left-color:#5b9dff;}
01310: .ci-card.lv-good{border-left-color:var(--green);}
01311: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01312: .ci-card.lv-critical .ci-head{color:var(--red);}
01313: .ci-card.lv-warning .ci-head{color:var(--amber);}
01314: .ci-card.lv-info .ci-head{color:#5b9dff;}
01315: .ci-card.lv-good .ci-head{color:var(--green);}
01316: .ci-text{font-size:13px;line-height:1.55;}
~~~

## copilot-actions @ L3240
~~~text
03222: #sparepart-lokasi-table .sp-master-sap{font-family:var(--font-mono);color:var(--text-dim);}
03223: #sparepart-lokasi-table .sp-master-name{font-weight:600;min-width:0;}
03224: #sparepart-lokasi-table .sp-master-location{color:var(--text-dim);}
03225: #sparepart-lokasi-table .sp-master-price{font-family:var(--font-mono);color:var(--amber);}
03226: #sparepart-lokasi-table .sp-master-stock{font-family:var(--font-mono);color:var(--green);white-space:nowrap!important;}
03227: #sparepart-lokasi-table .sp-master-actions{display:flex;gap:6px;justify-content:flex-end;}
03228: #sparepart-lokasi-table [data-label]::before{display:none;}
03229: #copilot-clear-data{flex:0 0 auto!important;}
03230: @media(max-width:900px){
03231:   #view-sparepart .sp-collect-table.omodos-responsive-table>tbody>tr>td.cell-material{grid-column:span 2!important;}
03232:   #view-sparepart .sp-collect-table.omodos-responsive-table>tbody>tr>td.cell-material::before{margin-bottom:4px;}
03233:   #sparepart-lokasi-table .sp-master-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:0;padding:6px;}
03234:   #sparepart-lokasi-table .sp-master-row>[data-label]{min-width:0;padding:8px 9px;border-bottom:1px solid var(--line-soft);}
03235:   #sparepart-lokasi-table .sp-master-row>[data-label]::before{content:attr(data-label);display:block;margin-bottom:3px;color:var(--text-dim);font-family:var(--font-mono);font-size:9.5px;font-weight:700;text-transform:uppercase;}
03236:   #sparepart-lokasi-table .sp-master-name{grid-column:1/-1;font-size:13px;}
03237:   #sparepart-lokasi-table .sp-master-actions{justify-content:flex-start;}
03238: }
03239: @media(max-width:520px){
03240:   .copilot-actions{display:grid!important;grid-template-columns:1fr 1fr!important;}
03241:   #copilot-clear-data{grid-column:1/-1!important;width:100%;justify-content:center;}
03242: }
03243: </style>
03244: 
03245: <!-- OMODOS4_PHASE1_SAFE -->
03246: <style id="omodos4-phase1-style">
03247: .v4-nav-group{border-top:1px solid var(--line-soft);padding-top:8px;margin-top:8px}
03248: .v4-nav-group .nav-parent-btn{font-weight:800}
03249: .v4-nav-group .nav-parent-btn .v4-badge{margin-left:auto;font:700 9px/1 var(--font-mono);padding:3px 6px;border-radius:999px;border:1px solid var(--line);color:var(--text-dim);background:var(--panel-2)}
03250: .v4-shell{--v4-gap:12px}
03251: .v4-shell .v4-hero{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:16px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(135deg,var(--panel),var(--panel-2));margin-bottom:14px}
03252: .v4-shell .v4-eyebrow{font:700 10px/1.2 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim)}
03253: .v4-shell .v4-title{font:800 clamp(22px,3vw,34px)/1.1 var(--font-display);margin:6px 0}
03254: .v4-shell .v4-sub{font-size:12.5px;line-height:1.55;color:var(--text-dim);max-width:760px}
03255: .v4-shell .v4-source{flex:0 0 auto;border:1px solid var(--line);border-radius:999px;padding:7px 10px;font:700 10px/1 var(--font-mono);color:var(--green);background:var(--panel-2)}
03256: .v4-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--v4-gap);margin-bottom:16px}
03257: .v4-card{border:1px solid var(--line);border-radius:13px;background:var(--panel);padding:13px;min-width:0}
03258: .v4-card .v4-k{font-size:10px;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em}
03259: .v4-card .v4-v{font:800 26px/1 var(--font-display);margin-top:7px}
03260: .v4-card .v4-note{font-size:10.5px;color:var(--text-dim);margin-top:6px;line-height:1.4}
03261: .v4-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:var(--v4-gap)}
03262: .v4-section-title{display:flex;align-items:center;gap:7px;font:800 13px/1.2 var(--font-display);margin-bottom:10px}
03263: .v4-list{display:grid;gap:8px}
03264: .v4-row{display:grid;grid-template-columns:minmax(110px,.55fr) minmax(0,1.45fr);gap:10px;padding:9px 0;border-top:1px solid var(--line-soft)}
03265: .v4-row:first-child{border-top:0;padding-top:0}
03266: .v4-row .v4-meta{font-size:10.5px;color:var(--text-dim);line-height:1.4}
03267: .v4-row .v4-main{font-size:12px;line-height:1.45;overflow-wrap:anywhere}
03268: .v4-empty{font-size:12px;color:var(--text-dim);padding:10px 0}
03269: .v4-chip{display:inline-flex;align-items:center;gap:5px;border:1px solid var(--line);border-radius:999px;padding:3px 7px;font-size:9.5px;color:var(--text-dim);margin:2px 4px 2px 0}
03270: @media(max-width:900px){.v4-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.v4-grid{grid-template-columns:1fr}.v4-shell .v4-hero{flex-direction:column}.v4-shell .v4-source{align-self:flex-start}}
03271: @media(max-width:560px){.v4-summary{grid-template-columns:1fr}.v4-row{grid-template-columns:1fr;gap:3px}}
03272: </style>
03273: 
03274: </head>
03275: <body>
03276: <div class="scanline-overlay"></div>
03277: <div class="scanline-sweep"></div>
03278: 
03279: <div id="login-gate">
~~~

## copilot-actions @ L5878
~~~text
05860:   <span class="copilot-fab-icon">🤖</span>
05861:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05862: </button>
05863: 
05864: <div class="copilot-bg" id="copilot-bg">
05865:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05866:     <div class="copilot-head">
05867:       <div>
05868:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05869:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05870:       </div>
05871:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05872:     </div>
05873:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05874:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05875:     </div>
05876:     <div class="copilot-composer">
05877:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05878:       <div class="copilot-actions">
05879:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05880:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05881:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05882:       </div>
05883:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05884:     </div>
05885:   </div>
05886: </div>
05887: 
05888: <script>
05889: 
05890: /* =========================================================
05891:    GLOBAL ERROR POPUP
05892:    =========================================================
05893:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05894:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05895:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05896:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05897:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05898: 
05899:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05900:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05901:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05902:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05903:       satu handler tombol yang sudah ada di seluruh aplikasi.
05904:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05905:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05906:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05907:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05908: (function(){
05909:   function extractErrorInfo(err){
05910:     if(err instanceof Error){
05911:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05912:     }
05913:     if(typeof err === 'string'){
05914:       return { message: err, detail: err };
05915:     }
05916:     try{
05917:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
~~~

## copilot-clear-data @ L23027
~~~text
23009:   $('#copilot-bg').classList.add('active');
23010:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23011: }
23012: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23013: function copilotClearData_(){
23014:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23015:   const q=$('#copilot-question'); if(q) q.value='';
23016:   const body=$('#copilot-body');
23017:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23018:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23019:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23020: }
23021: 
23022: $('#copilot-fab').addEventListener('click',openCopilot);
23023: $('#copilot-close').addEventListener('click',closeCopilot);
23024: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23025: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23026: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23027: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23028: $('#copilot-question').addEventListener('keydown',ev=>{
23029:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23030: });
23031: 
23032: /* =========================================================
23033:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23034:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23035:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23036:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23037:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23038:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23039:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23040:    ========================================================= */
23041: 
23042: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23043: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23044: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23045: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23046: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23047: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23048: const PI_TECH_DATA = [];
23049: 
23050: // ---- Katalog 10 aspek Soft Skill Assessment ----
23051: const PI_SOFTSKILL_ITEMS = [
23052:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23053:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23054:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23055: ];
23056: 
23057: 
23058: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23059: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23060: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23061: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23062: const PI_DISC_MAP = {
23063:   'Disiplin': 'C',
23064:   'Integritas': 'C',
23065:   'Kerja Sama Tim': 'I',
23066:   'Komunikasi': 'I',
~~~

