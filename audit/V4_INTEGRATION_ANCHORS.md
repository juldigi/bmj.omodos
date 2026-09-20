# V4 Integration Anchors

## sidebar-and-topnav
~~~text
03290:         <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03291:         <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03292:       </svg>
03293:     </div>
03294:     <div class="app-splash-spinner"><i class="ph-bold ph-circle-notch ph-spin"></i></div>
03295:     <div class="app-splash-text" id="app-splash-text">Menyiapkan Data...</div>
03296:     <div class="app-splash-sub">Mohon tunggu sebentar, seluruh data aplikasi sedang dimuat.</div>
03297:   </div>
03298: </div>
03299: 
03300: <div class="app" id="app-root">
03301:   <div class="sidebar-overlay" id="sidebar-overlay"></div>
03302: 
03303:   <div class="dash-hover-zone" id="dash-hover-zone"></div>
03304: 
03305:   <aside class="sidebar" id="sidebar">
03306:     <div class="brand">
03307:       <div class="mark omodos-logo">
03308:         <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03309:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03310:           <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03311:           <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03312:           <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03313:           <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03314:         </svg>
03315:       </div>
03316:       <div class="txt"><b>OMODOS</b><span>Packaging Offset &middot; BMJ</span></div>
03317:     </div>
03318: 
03319:     <!-- ============ ZERO-EFFORT NAV: 5 kategori utama, maks 2 level ============
03320:          Home | Logbook | Reports & Field Work | Insights | People & Meetings
03321:          Setting dititipkan kecil di dalam People & Meetings (utilitas, bukan menu utama). -->
03322:     <div class="nav-group">
03323:       <button class="nav-btn active" data-view="dashboard"><span class="ico"><i class="ph-bold ph-house"></i></span> Home</button>
03324:     </div>
03325: 
03326:     <div class="nav-group nav-group-collapsible">
03327:       <button class="nav-parent-btn" data-group="logbook"><span class="ico"><i class="ph-bold ph-book-open-text"></i></span> Logbook <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03328:       <div class="nav-submenu" data-submenu="logbook">
03329:         <button class="nav-btn" data-view="input"><span class="ico"><i class="ph-bold ph-pencil-simple"></i></span> Input Logbook</button>
03330:         <button class="nav-btn" data-view="utama"><span class="ico"><i class="ph-bold ph-list-bullets"></i></span> Lihat Logbook <span class="count" id="cnt-utama">0</span></button>
03331:       </div>
03332:     </div>
03333: 
03334:     <div class="nav-group nav-group-collapsible" data-group-key="report">
03335:       <button class="nav-parent-btn" data-group="report"><span class="ico"><i class="ph-bold ph-clipboard-text"></i></span> Reports & Field Work <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03336:       <div class="nav-submenu" data-submenu="report">
03337:         <button class="nav-btn" data-view="project-center"><span class="ico"><i class="ph-bold ph-buildings"></i></span> Project Center</button>
03338:         <button class="nav-btn" data-view="patrol"><span class="ico"><i class="ph-bold ph-shield-check"></i></span> Patrol Harian</button>
03339:         <button class="nav-btn" data-view="sparepart"><span class="ico"><i class="ph-bold ph-wrench"></i></span> Sparepart</button>
03340:         <button class="nav-btn" data-view="corrective-report"><span class="ico"><i class="ph-bold ph-first-aid-kit"></i></span> Corrective Report</button>
03341:       </div>
03342:     </div>
03343: 
03344:     <div class="nav-group nav-group-collapsible" data-group-key="wtp">
03345:       <button class="nav-parent-btn" data-group="wtp"><span class="ico"><i class="ph-bold ph-drop"></i></span> Water Treatment Plant <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03346:       <div class="nav-submenu" data-submenu="wtp">
03347:         <button class="nav-btn" data-view="report" id="nav-btn-input-ipal"><span class="ico"><i class="ph-bold ph-drop"></i></span> Input IPAL</button>
03348:       </div>
03349:     </div>
03350: 
03351:     <div class="nav-group nav-group-collapsible" data-group-key="energy">
03352:       <button class="nav-parent-btn" data-group="energy"><span class="ico"><i class="ph-bold ph-lightning"></i></span> Energy & Utility <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03353:       <div class="nav-submenu" data-submenu="energy">
03354:         <button class="nav-btn" data-view="energy-utility"><span class="ico"><i class="ph-bold ph-gauge"></i></span> Konsumsi Listrik & Air (ENPI)</button>
03355:       </div>
03356:     </div>
03357: 
03358:     <div class="nav-group">
03359:       <button class="nav-btn" data-view="insights-hub"><span class="ico"><i class="ph-bold ph-chart-bar"></i></span> Insights</button>
03360:     </div>
03361: 
03362:     <div class="nav-group nav-group-collapsible" data-group-key="kpidept">
03363:       <button class="nav-parent-btn" data-group="kpidept"><span class="ico"><i class="ph-bold ph-target"></i></span> KPI Department <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03364:       <div class="nav-submenu" data-submenu="kpidept">
03365:         <button class="nav-btn" data-view="kpi-department"><span class="ico"><i class="ph-bold ph-target"></i></span> Dashboard KPI Department</button>
03366:         <button class="nav-btn" data-view="kpi-input"><span class="ico"><i class="ph-bold ph-clipboard-text"></i></span> Input KPI &amp; Kertas Kerja</button>
03367:         <button class="nav-btn" data-view="machine-breakdown"><span class="ico"><i class="ph-bold ph-chart-line-up"></i></span> Breakdown Mesin (MTD/YTD)</button>
03368:         <button class="nav-btn" data-view="record-ytd"><span class="ico"><i class="ph-bold ph-calendar-blank"></i></span> Record YTD Mesin (2019-2024)</button>
03369:         <button class="nav-btn" data-view="run-hour-comparison"><span class="ico"><i class="ph-bold ph-clock-countdown"></i></span> Run Hour Comparison</button>
03370:         <button class="nav-btn" data-view="energy-cost-toe"><span class="ico"><i class="ph-bold ph-coins"></i></span> Biaya Energi & TOE (EnPI)</button>
03371:       </div>
03372:     </div>
03373: 
03374:     <div class="nav-group">
03375:       <button class="nav-btn" data-view="people-hub"><span class="ico"><i class="ph-bold ph-users-four"></i></span> People & Meetings</button>
03376:     </div>
03377: 
03378:     <!-- Pengaturan: utilitas, dipisah dari 5 kategori utama (bukan tugas harian). -->
03379:     <div class="nav-group nav-group-collapsible nav-group-settings">
03380:       <button class="nav-parent-btn" data-group="pengaturan"><span class="ico"><i class="ph-bold ph-gear-six"></i></span> Pengaturan <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03381:       <div class="nav-submenu" data-submenu="pengaturan">
03382:         <button class="nav-btn" data-view="database"><span class="ico"><i class="ph-bold ph-database"></i></span> Database Mesin</button>
03383:         <button class="nav-btn" data-view="tema"><span class="ico"><i class="ph-bold ph-palette"></i></span> Tema Aplikasi</button>
03384:         <button class="nav-btn" data-view="setting"><span class="ico"><i class="ph-bold ph-plugs-connected"></i></span> Master Koneksi</button>
03385:       </div>
03386:     </div>
03387: 
03388:     <div class="sidebar-user-box" id="sidebar-user-box">
03389:       <div class="su-info" id="rbac-user-badge">-</div>
03390:       <button type="button" class="btn btn-sm su-logout-btn" id="btn-logout" title="Keluar dari aplikasi">
03391:         <i class="ph-bold ph-sign-out"></i> Logout
03392:       </button>
03393:     </div>
03394:   </aside>
03395: 
03396:   <main class="main">
03397:     <div class="topbar-title-row">
03398:       <button class="topbar-menu-btn" id="btn-open-sidebar"><i class="ph-bold ph-list"></i></button>
03399:       <button class="topbar-menu-btn lc-quick-btn" id="btn-lc-quick-toggle" type="button" title="Tampilan Sederhana: sederhanakan tampilan" aria-pressed="false" aria-label="Aktifkan Tampilan Sederhana"><i class="ph-bold ph-brain"></i></button>
03400:       <button class="topbar-menu-btn" id="btn-open-pengaturan" type="button" title="Pengaturan" aria-label="Buka Pengaturan"><i class="ph-bold ph-gear-six"></i></button>
03401:     </div>
03402: 
03403:     <div class="i40-banner">
03404:       <div class="i40-hex omodos-logo">
03405:         <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03406:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03407:           <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03408:           <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03409:           <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03410:           <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03411:         </svg>
03412:       </div>
03413:       <div class="i40-text">
03414:         <div class="t1">OMODOS</div>
03415:         <div class="t2">OMODOS - Smart Maintenance Reporting Platform | Packaging Offset © 2026 IDJ</div>
03416:       </div>
03417:       <div class="i40-pulse"><span class="dot"></span>SYSTEM ONLINE</div>
03418:     </div>
03419: 
03420:     <div id="config-banner-holder"></div>
03421:     <div id="offline-banner-holder"></div>
03422: 
03423:     <section class="view" id="view-input">
03424:       <div class="topbar">
03425:         <div>
~~~

## home-and-view-shells
~~~text
04080:         <div><h1>Logbook</h1><div class="sub">Seluruh catatan pekerjaan maintenance, diurutkan dari yang paling baru diposting.</div></div>
04081:         <div class="stat-strip" id="stat-strip"></div>
04082:       </div>
04083:       <div class="lb-tabbar" data-lb-tabbar></div>
04084:       <div class="filter-bar">
04085:         <input class="grow" type="text" id="search-utama" placeholder="Cari mesin, pelapor, deskripsi...">
04086:         <select id="filter-status"><option value="">Semua Status</option><option>Selesai</option><option>Proses</option><option>Pending</option><option>Emergency</option></select>
04087:         <select id="filter-jenis"><option value="">Semua Jenis</option></select>
04088:         <select id="filter-group"><option value="">Semua Group</option><option>Electrical</option><option>Mechanical</option><option>Workshop</option><option>Project</option><option>Warehouse</option><option>Planning</option><option>IPAL</option></select>
04089:         <button class="btn btn-sm" id="btn-refresh-utama"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04090:       </div>
04091:       <div id="list-utama"></div>
04092:     </section>
04093: 
04094:     <section class="view" id="view-mesin">
04095:       <div class="topbar"><div><h1>Logbook per Mesin</h1><div class="sub">Riwayat pekerjaan dikelompokkan per unit mesin.</div></div></div>
04096:       <div class="lb-tabbar" data-lb-tabbar></div>
04097:       <div class="filter-bar" style="margin-bottom:12px;">
04098:         <label for="machine-select" style="font-size:12px;font-weight:700;color:var(--text-dim);">Pilih Mesin</label>
04099:         <select id="machine-select" class="grow"><option value="">Pilih mesin...</option></select>
04100:       </div>
04101:       <div id="list-mesin"></div>
04102:     </section>
04103: 
04104:     <section class="view" id="view-tanggal">
04105:       <div class="topbar">
04106:         <div><h1>Logbook per Tanggal</h1><div class="sub">Dikelompokkan berdasarkan tanggal pelaporan, terbaru di atas.</div></div>
04107:         <div class="sort-toggle"><button class="active" data-sort="desc">Terbaru</button><button data-sort="asc">Terlama</button><button id="btn-toggle-nodate" type="button">Tanpa Tanggal</button></div>
04108:       </div>
04109:       <div class="lb-tabbar" data-lb-tabbar></div>
04110:       <div id="list-tanggal"></div>
04111:     </section>
04112: 
04113:     <section class="view" id="view-pelapor">
04114:       <div class="topbar"><div><h1>Logbook per Pelapor</h1><div class="sub">Riwayat pekerjaan dikelompokkan per nama teknisi/pelapor.</div></div></div>
04115:       <div class="lb-tabbar" data-lb-tabbar></div>
04116:       <div class="machine-chip-row" id="pelapor-chips"></div>
04117:       <div id="list-pelapor"></div>
04118:     </section>
04119: 
04120:     <section class="view" id="view-group">
04121:       <div class="topbar"><div><h1>Logbook per Group Pekerjaan</h1><div class="sub">Riwayat pekerjaan dikelompokkan per divisi/grup kerja.</div></div></div>
04122:       <div class="lb-tabbar" data-lb-tabbar></div>
04123:       <div class="machine-chip-row" id="group-chips"></div>
04124:       <div id="list-group"></div>
04125:     </section>
04126: 
04127:     <section class="view active" id="view-dashboard">
04128:       <div class="topbar">
04129:         <div><h1>Home</h1><div class="sub">Ringkasan status mesin &amp; jalan pintas menu.</div></div>
04130:         <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
04131:           <div class="machine-chip-row" id="home-mesin-filter" style="margin-bottom:0;">
04132:             <button type="button" class="machine-chip active" data-home-filter="priority">Mesin Prioritas</button>
04133:             <button type="button" class="machine-chip" data-home-filter="all">Semua Mesin</button>
04134:           </div>
04135:           <button class="btn btn-sm" id="btn-lc-priority-only" data-lc-only aria-pressed="false"><i class="ph-bold ph-warning"></i> Fokus Utama</button>
04136:           <button class="btn btn-sm" id="btn-refresh-dashboard"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04137:         </div>
04138:       </div>
04139: 
04140:       <div class="section-title home-status-title"><i class="ph-bold ph-gauge"></i> Status Mesin Sekarang</div>
04141:       <div class="dash-grid" id="dash-grid"></div>
04142: 
04143:       <div class="home-below" id="home-below">
04144:         <div class="home-below-row">
04145:           <div class="home-greeting-block">
04146:             <div class="home-greeting" id="home-greeting">Halo 👋</div>
04147:             <div class="home-date" id="home-date"></div>
04148:           </div>
04149:           <div class="home-critical-alert" id="home-critical-alert"></div>
04150:         </div>
04151:         <div class="home-smart-resume" id="home-smart-resume"></div>
04152:       </div>
04153:     </section>
04154: 
04155:     <section class="view" id="view-insights-hub">
04156:       <div class="topbar">
04157:         <div><h1>Insights</h1><div class="sub">Ketuk salah satu untuk melihat.</div></div>
04158:       </div>
04159:       <div class="insights-hub-grid" id="insights-hub-grid">
04160:         <button class="insights-hub-card" data-view="report">
04161:           <span class="ihc-ico">📝</span><span class="ihc-title">Input Report</span>
04162:           <span class="ihc-desc">Buat/isi laporan: IPAL, RCA, Laporan Proyek — semua kategori dalam satu tempat</span>
04163:         </button>
04164:         <button class="insights-hub-card" data-view="analitik">
04165:           <span class="ihc-ico">📊</span><span class="ihc-title">Dashboard Analitik</span>
04166:           <span class="ihc-desc">MTTR, MTBF, downtime, Pareto — otomatis dari Logbook</span>
04167:         </button>
04168:         <button class="insights-hub-card" data-view="correlation">
04169:           <span class="ihc-ico">🔗</span><span class="ihc-title">Correlation Analysis</span>
04170:           <span class="ihc-desc">Cari pola tersembunyi penyebab breakdown</span>
04171:         </button>
04172:         <button class="insights-hub-card" data-view="diagnostic">
04173:           <span class="ihc-ico">🩺</span><span class="ihc-title">Diagnostic Wizard</span>
04174:           <span class="ihc-desc">Masukkan gejala, sistem sarankan penyebab</span>
04175:         </button>
04176:         <button class="insights-hub-card" data-view="durasi">
04177:           <span class="ihc-ico">⏱</span><span class="ihc-title">Top Durasi Pekerjaan</span>
04178:           <span class="ihc-desc">50 pekerjaan dengan durasi terlama</span>
04179:         </button>
04180:         <button class="insights-hub-card" data-view="knowledge">
04181:           <span class="ihc-ico">📚</span><span class="ihc-title">Knowledge Base</span>
04182:           <span class="ihc-desc">Masalah umum, best practice, lessons learned</span>
04183:         </button>
04184:         <button class="insights-hub-card" data-view="expert-finder">
04185:           <span class="ihc-ico">🧑‍🔧</span><span class="ihc-title">Expert Finder</span>
04186:           <span class="ihc-desc">Personil paling berpengalaman per area</span>
04187:         </button>
04188:         <button class="insights-hub-card" data-view="knowledge-graph">
04189:           <span class="ihc-ico">🕸</span><span class="ihc-title">Knowledge Graph</span>
04190:           <span class="ihc-desc">Peta hubungan personil, mesin, sparepart, masalah</span>
04191:         </button>
04192:         <button class="insights-hub-card" data-view="downtime">
04193:           <span class="ihc-ico">⚡</span><span class="ihc-title">Analisa Downtime E&amp;M</span>
04194:           <span class="ihc-desc">Upload &amp; analisa downtime Elektrikal/Mekanikal dari Excel, gabungkan jadi resume Year-to-Date</span>
04195:         </button>
04196:         <button class="insights-hub-card" data-view="wiki">
04197:           <span class="ihc-ico">📖</span><span class="ihc-title">Maintenance Wikipedia</span>
04198:           <span class="ihc-desc">Jelajah data mesin & sparepart saling terhubung</span>
04199:         </button>
04200:       </div>
04201:     </section>
04202: 
04203:     <section class="view" id="view-durasi">
04204:       <div class="topbar">
04205:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
04206:         <div><h1>Top Durasi Pekerjaan</h1><div class="sub">50 pekerjaan dengan durasi pengerjaan terlama secara keseluruhan (semua mesin digabung), berdasarkan kolom Durasi Pekerjaan.</div></div>
04207:         <button class="btn btn-sm" id="btn-refresh-durasi"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04208:       </div>
04209:       <div id="list-durasi"></div>
04210:     </section>
04211: 
04212:     <section class="view" id="view-analitik">
04213:       <div class="topbar">
04214:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
04215:         <div><h1>Digital War Room</h1><div class="sub">Semua angka dihitung otomatis dari data Logbook (real-time), termasuk MTTR, MTBF, downtime, availability, dan Pareto 80/20 penyebab kerusakan.</div></div>
04216:         <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
04217:           <select id="analitik-sumber" style="width:auto;" title="Sumber data untuk seluruh KPI &amp; grafik di bawah">
04218:             <option value="historis">📊 Logbook (Otomatis)</option>
04219:             <option value="downtime_em">⚡ Analisa Downtime E&amp;M</option>
04220:           </select>
04221:           <select id="analitik-periode-mode" style="width:auto;">
04222:             <option value="bulan">Per Bulan</option>
04223:             <option value="quarter">Per Quarter</option>
04224:             <option value="semester">Per Semester</option>
04225:             <option value="tahun">Per Tahun</option>
04226:             <option value="custom">Rentang Tanggal</option>
04227:             <option value="all" selected>Semua Periode</option>
04228:           </select>
04229:           <button class="btn btn-sm" id="btn-refresh-analitik"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04230:         </div>
04231:       </div>
04232:       <div class="an-period-row" id="an-period-row" style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;margin:-6px 0 14px;">
04233:         <div class="field" id="an-p-bulan-wrap" style="display:none;margin:0;">
04234:           <label>Bulan</label>
04235:           <select id="an-p-bulan">
04236:             <option value="01">Januari</option><option value="02">Februari</option><option value="03">Maret</option>
04237:             <option value="04">April</option><option value="05">Mei</option><option value="06">Juni</option>
04238:             <option value="07">Juli</option><option value="08">Agustus</option><option value="09">September</option>
04239:             <option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
04240:           </select>
04241:         </div>
04242:         <div class="field" id="an-p-quarter-wrap" style="display:none;margin:0;">
04243:           <label>Quarter</label>
04244:           <select id="an-p-quarter">
04245:             <option value="1">Q1 (Jan-Mar)</option><option value="2">Q2 (Apr-Jun)</option>
04246:             <option value="3">Q3 (Jul-Sep)</option><option value="4">Q4 (Okt-Des)</option>
04247:           </select>
04248:         </div>
04249:         <div class="field" id="an-p-semester-wrap" style="display:none;margin:0;">
04250:           <label>Semester</label>
~~~

## rbac-and-navigation
~~~text
06260:     SESSION_EXPIRES_AT = '';
06261:   }
06262:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06263:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06264:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06265:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06266: }catch(e){}
06267: try{
06268:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06269: }catch(e){
06270:   CURRENT_USER = null;
06271:   SESSION_TOKEN = '';
06272:   SESSION_EXPIRES_AT = '';
06273:   try{
06274:     localStorage.removeItem(SS_USER_KEY);
06275:     localStorage.removeItem(SS_TOKEN_KEY);
06276:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06277:   }catch(clearErr){}
06278: }
06279: function cacheRbacSession_(){
06280:   try{
06281:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06282:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06283:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06284:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06285:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06286:   }catch(e){}
06287: }
06288: 
06289: function hasPermission(permissionKey){
06290:   if(!CURRENT_USER) return false;
06291:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06292:   const p = PERMISSIONS[permissionKey];
06293:   return !!(p && p[CURRENT_USER.role]);
06294: }
06295: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06296: 
06297: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06298: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06299: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06300: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06301: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06302: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06303: function discoverFeatureRegistryFromDom(){
06304:   const seen = new Set();
06305:   const list = [];
06306:   const labelOf = (btn)=>{
06307:     const clone = btn.cloneNode(true);
06308:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06309:     return clone.textContent.replace(/\s+/g,' ').trim();
06310:   };
06311:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06312:     const view = btn.dataset.view;
06313:     if(!view) return;
06314:     const key = 'view.' + view;
06315:     if(seen.has(key)) return;
06316:     seen.add(key);
06317:     const groupEl = btn.closest('.nav-group-collapsible');
06318:     let group = 'Umum';
06319:     if(groupEl){
06320:       const parentBtn = groupEl.querySelector('.nav-parent-btn');
06321:       if(parentBtn){ const g = labelOf(parentBtn); if(g) group = g; }
06322:     }
06323:     list.push({ PermissionKey:key, Label: labelOf(btn) || view, Group: group });
06324:   });
06325:   // Grup collapsible itu sendiri juga jadi "fitur" tergate-able (untuk
06326:   // menyembunyikan seluruh grup, bukan cuma item di dalamnya).
06327:   document.querySelectorAll('.sidebar .nav-group-collapsible[data-group-key]').forEach(g=>{
06328:     const gk = g.dataset.groupKey;
06329:     if(!gk) return;
06330:     const key = 'group.' + gk;
06331:     if(seen.has(key)) return;
06332:     seen.add(key);
06333:     const parentBtn = g.querySelector('.nav-parent-btn');
06334:     list.push({ PermissionKey:key, Label: (parentBtn ? labelOf(parentBtn) : gk) + ' (Grup)', Group: 'Grup Menu' });
06335:   });
06336:   // [FIX] Halaman yang HANYA bisa dibuka lewat kartu hub (Insights, People
06337:   // & Meetings, dst) — bukan lewat sidebar langsung — sebelumnya TIDAK
06338:   // pernah tersapu, jadi tidak pernah muncul di Role Access Management
06339:   // walau sudah digate oleh goToView(). Sekarang SEMUA elemen ber-atribut
06340:   // [data-view] di seluruh halaman ikut disapu, tidak cuma yang ada di
06341:   // sidebar, supaya menu/halaman baru — dari mana pun pintu masuknya
06342:   // (sidebar, kartu hub, tombol lain) — otomatis terdeteksi dan otomatis
06343:   // bisa diatur aksesnya, tanpa perlu ada yang menambah daftar manual.
06344:   const hubGroupLabel = {
06345:     'insights-hub-grid': 'Insights (Hub)',
06346:     'people-hub-grid': 'People & Meetings (Hub)'
06347:   };
06348:   document.querySelectorAll('[data-view]').forEach(el=>{
06349:     const view = el.dataset.view;
06350:     if(!view) return;
06351:     const key = 'view.' + view;
06352:     if(seen.has(key)) return;
06353:     seen.add(key);
06354:     let group = 'Halaman Lainnya';
06355:     for(const gridId in hubGroupLabel){
06356:       if(el.closest('#'+gridId)){ group = hubGroupLabel[gridId]; break; }
06357:     }
06358:     list.push({ PermissionKey:key, Label: labelOf(el) || view, Group: group });
06359:   });
06360:   const tabGroups = [
06361:     { attr:'data-ptab', group:'Tab: Patrol Harian' },
06362:     { attr:'data-sptab', group:'Tab: Sparepart' },
06363:     { attr:'data-mtg-mode', group:'Tab: Meeting Management' },
06364:     { attr:'data-pmc-mode', group:'Tab: Project Center' },
06365:     { attr:'data-dttab', group:'Tab: Downtime' }
06366:   ];
06367:   tabGroups.forEach(cfg=>{
06368:     document.querySelectorAll('['+cfg.attr+']').forEach(el=>{
06369:       const val=el.getAttribute(cfg.attr);
06370:       if(!val) return;
06371:       const key='tab.'+cfg.attr.replace(/^data-/,'')+'.'+val;
06372:       if(seen.has(key)) return;
06373:       seen.add(key);
06374:       list.push({
06375:         PermissionKey:key,
06376:         Label:el.textContent.replace(/\s+/g,' ').trim() || val,
06377:         Group:cfg.group
06378:       });
06379:     });
06380:   });
06381:   return list;
06382: }
06383: window.discoverFeatureRegistry = discoverFeatureRegistryFromDom;
06384: 
06385: // Gabungkan daftar dari backend (kalau ada label/grup kustom) dengan hasil
06386: // scan DOM (sumber kebenaran menu yang benar-benar ADA). DOM selalu menang
06387: // untuk keberadaan fitur; backend hanya boleh menambah metadata.
06388: function mergeFeatureRegistry(backendList){
06389:   const discovered = discoverFeatureRegistryFromDom();
06390:   const byKey = {};
06391:   discovered.forEach(f=> byKey[f.PermissionKey] = f);
06392:   (backendList||[]).forEach(f=>{
06393:     if(!f || !f.PermissionKey) return;
06394:     byKey[f.PermissionKey] = Object.assign({}, byKey[f.PermissionKey] || {}, f);
06395:   });
06396:   return Object.values(byKey);
06397: }
06398: window.mergeFeatureRegistry = mergeFeatureRegistry;
06399: 
06400: // Render ulang sidebar (sembunyikan menu/submenu yang tidak diizinkan) dan
06401: // info user yang sedang login. Dipanggil setelah login sukses.
06402: function applyRbacToUi(){
06403:   $$('.nav-btn[data-view]').forEach(btn=>{
06404:     const view = btn.dataset.view;
06405:     // [FIX] "Home" (dashboard) DIKECUALIKAN dari RBAC gating -- ini halaman
06406:     // utama/landing page aplikasi, wajib selalu bisa diakses SEMUA role tanpa
06407:     // terkecuali. Sebelumnya kalau permission 'view.dashboard' untuk role
06408:     // tertentu belum di-centang di Role Access Management (mis. lupa di-set
06409:     // saat menambah role baru), tombol Home hilang total dari sidebar MAUPUN
06410:     // bottom-nav untuk role itu -- mengunci user dari halaman utamanya sendiri.
06411:     if(view === 'dashboard'){ btn.style.display = ''; return; }
06412:     const key = 'view.' + view;
06413:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06414:     // Hanya menu yang terdaftar di Feature Registry yang digate; menu lain
06415:     // (kalau ada) tetap tampil seperti semula supaya tidak mengubah UX yang
06416:     // belum terdaftar.
06417:     const allowed = !known || hasPermission(key);
06418:     btn.style.display = allowed ? '' : 'none';
06419:   });
06420:   // Sembunyikan grup kalau (a) SEMUA submenu di dalamnya disembunyikan, ATAU
06421:   // (b) grup itu sendiri punya permission 'group.<key>' yang secara eksplisit
06422:   // di-nonaktifkan di Role Access Management (mis. Superadmin sengaja
06423:   // mematikan seluruh grup "Reports & Field Work" untuk role tertentu, walau
06424:   // submenu di dalamnya belum tentu satu-satu di-nonaktifkan).
06425:   // [FIX] Sebelumnya permission 'group.<key>' HANYA dipakai untuk Low
06426:   // Cognitive Mode (data-lc-hide) -- tidak pernah benar-benar menyembunyikan
06427:   // grup dari Role Access Management biasa. Sekarang keduanya diperiksa.
06428:   // [FIX] Tombol bottom-nav mobile (data-group="...") sebelumnya TIDAK ikut
06429:   // disembunyikan sama sekali oleh RBAC -- hanya sidebar yang tergate,
06430:   // sehingga tombol grup di bottom-nav tetap muncul walau seluruh isinya
06431:   // (atau grupnya sendiri) tidak diizinkan untuk role tsb. Sekarang
06432:   // visibilitas bottom-nav-btn[data-group] SELALU disamakan dengan grup
06433:   // sidebar yang bersangkutan.
06434:   $$('.nav-group-collapsible').forEach(group=>{
06435:     const parentBtn = $('.nav-parent-btn', group);
06436:     const groupKey = (parentBtn && parentBtn.dataset.group) || group.dataset.groupKey || '';
06437:     // [FIX] Baris 'group.<key>' otomatis terdaftar di Role Access Management
06438:     // sebagai baris TERPISAH ("... (Grup)") dari menu-menu di dalamnya. Karena
06439:     // Simpan Role Access selalu mengirim SEMUA baris yang sedang tampil di
06440:     // tabel (bukan hanya yang diubah), baris grup yang tidak sengaja
06441:     // dibiarkan tidak tercentang otomatis tersimpan sebagai "ditolak" (false)
06442:     // begitu Superadmin menyimpan perubahan apa pun -- walau menu di dalam
06443:     // grup itu (mis. Patrol Harian) sudah eksplisit diizinkan satu-satu.
06444:     // Akibatnya seluruh grup (Reports & Field Work, Water Treatment Plant,
06445:     // Energy & Utility, KPI Department, dst) raib untuk role tsb walau
06446:     // isinya sudah diizinkan -- ini penyebab utama "menu sidebar/bottom bar
06447:     // tidak sesuai konfigurasi akun". Supaya konsisten dengan menu individual
06448:     // (default: izinkan, kecuali memang tidak ada satu pun menu di dalamnya
06449:     // yang diizinkan), grup sekarang HANYA disembunyikan berdasarkan
06450:     // visibilitas submenu di dalamnya -- permission 'group.<key>' tidak lagi
06451:     // dipakai sebagai gate tambahan yang bisa mengunci seluruh grup secara
06452:     // tidak sengaja.
06453:     const visibleChild = Array.from(group.querySelectorAll('.nav-btn[data-view], .v4-nav-btn[data-v4-workspace]')).some(b => b.style.display !== 'none');
06454:     const visible = visibleChild;
06455:     group.style.display = visible ? '' : 'none';
06456:     if(groupKey){
06457:       $$('.bottom-nav-btn[data-group="'+groupKey+'"]').forEach(bn=>{ bn.style.display = visible ? '' : 'none'; });
06458:     }
06459:   });
06460:   // [FIX] Grup sidebar TUNGGAL (bukan collapsible) yang cuma membungkus satu
06461:   // nav-btn, mis. "Home", "Insights", "People & Meetings" -- kalau nav-btn
06462:   // di dalamnya disembunyikan (tidak diizinkan), div pembungkusnya sendiri
06463:   // sebelumnya tetap ada di DOM (kosong, tapi masih mengambil margin-bottom),
06464:   // menyisakan celah kosong di sidebar. Sekarang div pembungkus itu ikut
06465:   // disembunyikan total kalau satu-satunya isinya tidak diizinkan.
06466:   $$('.nav-group:not(.nav-group-collapsible)').forEach(group=>{
06467:     const visibleChild = $$('.nav-btn[data-view]', group).some(b => b.style.display !== 'none');
06468:     group.style.display = visibleChild ? '' : 'none';
06469:   });
06470:   // [FIX] Elemen [data-view] di LUAR sidebar (mis. kartu di Insights Hub /
06471:   // People & Meetings Hub) juga harus ikut disembunyikan kalau rolenya
06472:   // tidak diizinkan — sebelumnya cuma digate saat diklik (goToView), jadi
06473:   // kartunya tetap kelihatan walau ujung-ujungnya "Akses ditolak". Dengan
06474:   // ini, tampilan menu selalu konsisten dengan Role Access Management.
06475:   $$('[data-view]').forEach(el=>{
06476:     if(el.closest('.sidebar')) return; // sudah ditangani di atas
06477:     // [FIX] Sama seperti di atas: Home (dashboard) selalu tampil di manapun
06478:     // elemennya berada (termasuk tombol bottom-nav mobile), tidak ikut digate.
06479:     if(el.dataset.view === 'dashboard'){ el.style.display = ''; return; }
06480:     const key = 'view.' + el.dataset.view;
06481:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06482:     const allowed = !known || hasPermission(key);
06483:     el.style.display = allowed ? '' : 'none';
06484:   });
06485:   const userBadge = $('#rbac-user-badge');
06486:   if(userBadge && CURRENT_USER){
06487:     userBadge.innerHTML = `<i class="ph-bold ph-user-circle"></i> ${escapeHtml(CURRENT_USER.displayName || CURRENT_USER.username)} <span style="opacity:.65;">(${escapeHtml(CURRENT_USER.role)})</span>`;
06488:   }
06489: }
06490: 
06491: // "Access Denied": dipanggil saat mencoba masuk ke view yang tidak diizinkan
06492: // (baik lewat klik menu yang seharusnya sudah disembunyikan, maupun akses
06493: // URL/hash langsung). Core function halaman lain tetap berjalan normal.
06494: function showAccessDenied(){
06495:   toast('Akses ditolak — Anda tidak memiliki izin untuk membuka menu ini.', true);
06496: }
06497: 
06498: /* ---------------- COPILOT: PELACAK ERROR/BUG TEKNIS ----------------
06499:  * Menangkap error JS & promise rejection yang benar-benar terjadi di
06500:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06501:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06502:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06503:  */
06504: let COPILOT_ERROR_LOG = [];
06505: function copilotLogError(msg, srcInfo){
~~~

## view-access-routing
~~~text
08288:     const groupKey = btn.dataset.group;
08289:     if(!groupKey) return;
08290:     const sub = document.querySelector(`.nav-submenu[data-submenu="${groupKey}"]`);
08291:     if(!sub) return;
08292:     const willOpen = !sub.classList.contains('open');
08293:     sub.classList.toggle('open', willOpen);
08294:     btn.classList.toggle('open', willOpen);
08295:   });
08296: });
08297: const VIEW_PERMISSION_PARENT = Object.freeze({
08298:   mesin:'utama', tanggal:'utama', pelapor:'utama', group:'utama',
08299:   rca:'report', 'report-hub':'report', 'project-report':'report', ai:'report'
08300: });
08301: function permissionViewFor_(view){
08302:   view = String(view||'').trim();
08303:   return VIEW_PERMISSION_PARENT[view] || view;
08304: }
08305: function canAccessView_(view){
08306:   view = String(view||'').trim();
08307:   if(!view) return false;
08308:   const permissionView = permissionViewFor_(view);
08309:   if(permissionView === 'dashboard') return true;
08310:   const permKey = 'view.' + permissionView;
08311:   const knownFeature = FEATURE_REGISTRY.some(f => f.PermissionKey === permKey);
08312:   return !knownFeature || hasPermission(permKey);
08313: }
08314: function canAccessAnyView_(views){
08315:   return (views||[]).some(v=>canAccessView_(v));
08316: }
08317: function canAccessLogbookDetail_(){
08318:   return canAccessAnyView_(['input','utama','mesin','tanggal','pelapor','group']);
08319: }
08320: 
08321: function goToView(view){
08322:   view = String(view||'').trim();
08323:   if(!view){ toast('Tujuan halaman tidak valid.', true); return false; }
08324: 
08325:   // Semua navigasi user-facing wajib melewati satu gate ini. Home adalah
08326:   // landing page invariant: applyRbacToUi memang selalu menampilkannya.
08327:   if(!canAccessView_(view)){
08328:     showAccessDenied();
08329:     return false;
08330:   }
08331: 
08332:   // Jangan biarkan typo/target view yang belum dirender berubah menjadi
08333:   // TypeError pada switchToView(). OMODOS 4.0 memakai switchToView langsung
08334:   // setelah shell dinamisnya dibuat, jadi guard ini hanya untuk goToView.
08335:   const targetView = document.getElementById('view-' + view);
08336:   if(!targetView){
08337:     console.error('[OMODOS] View target tidak ditemukan:', view);
08338:     toast('Halaman "' + view + '" belum tersedia. Muat ulang aplikasi lalu coba lagi.', true);
08339:     return false;
08340:   }
08341: 
08342:   // Menu Setting SELALU meminta login ulang setiap kali diakses.
08343:   if(view === 'setting' && !isSettingAuthed()){
08344:     showSettingLoginModal(()=> switchToView('setting'));
08345:     return false;
08346:   }
08347:   switchToView(view);
08348:   return true;
08349: }
08350: $$('.nav-btn').forEach(btn=>{
08351:   btn.addEventListener('click', ()=> goToView(btn.dataset.view));
08352: });
08353: // Menu sidebar "Water Treatment Plant > Input IPAL" langsung membuka form
08354: // IPAL (melewati grid pilihan kategori Input Report), tapi tetap
08355: // menggunakan view & elemen DOM Input Report yang sama (view-report) supaya
08356: // tidak perlu duplikasi logic IPAL yang sudah ada.
08357: const navBtnInputIpal = $('#nav-btn-input-ipal');
08358: if(navBtnInputIpal){
08359:   navBtnInputIpal.addEventListener('click', ()=>{ if(typeof openIpalCategory==='function') openIpalCategory(); });
08360: }
08361: $$('.bottom-nav-btn').forEach(btn=>{
08362:   btn.addEventListener('click', ()=>{
08363:     if(btn.dataset.view){ goToView(btn.dataset.view); closeBnavSheet(); }
08364:     else if(btn.dataset.group){ openBnavSheet(btn.dataset.group); }
08365:   });
08366: });
08367: 
08368: /* ---------------- MOBILE BOTTOM-NAV GROUP SHEET ---------------- */
08369: const BNAV_GROUP_LABELS = { logbook:'Logbook', report:'Reports & Field Work', wtp:'Water Treatment Plant', energy:'Energy & Utility', kpidept:'KPI Department', analitik:'Insights', people:'People & Meetings', pengaturan:'Pengaturan', setting:'Setting' };
08370: function openBnavSheet(group){
08371:   const submenu = $(`.nav-submenu[data-submenu="${group}"]`);
08372:   if(!submenu) return;
08373:   $('#bnav-sheet-title').textContent = BNAV_GROUP_LABELS[group] || group;
08374:   const list = $('#bnav-sheet-list');
08375:   list.innerHTML = '';
08376:   $$('.nav-btn', submenu).forEach(navBtn=>{
08377:     const view = String(navBtn.dataset.view||'').trim();
08378:     if(!view) return;
08379:     const key = 'view.' + view;
08380:     const known = FEATURE_REGISTRY.some(f=>f.PermissionKey===key);
08381:     const allowed = view === 'dashboard' || !known || hasPermission(key);
08382:     // applyRbacToUi menyembunyikan item terlarang di sidebar. Sheet mobile
08383:     // harus memakai aturan yang sama, bukan meng-clone item tersembunyi.
08384:     if(!allowed || navBtn.style.display === 'none') return;
08385:     const b = document.createElement('button');
08386:     b.innerHTML = navBtn.innerHTML;
08387:     b.dataset.view = view;
08388:     b.addEventListener('click', ()=>{
08389:       if(goToView(b.dataset.view) !== false) closeBnavSheet();
08390:     });
08391:     list.appendChild(b);
08392:   });
08393:   if(!list.children.length){
08394:     toast('Tidak ada menu yang diizinkan pada kategori ini.', true);
08395:     return;
08396:   }
08397:   $('#bnav-sheet-bg').classList.add('open');
08398: }
08399: function closeBnavSheet(){
08400:   $('#bnav-sheet-bg').classList.remove('open');
08401: }
08402: $('#bnav-sheet-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='bnav-sheet-bg') closeBnavSheet(); });
08403: 
08404: /* ---------------- MOBILE SIDEBAR DRAWER ---------------- */
08405: function openSidebarDrawer(){
~~~

