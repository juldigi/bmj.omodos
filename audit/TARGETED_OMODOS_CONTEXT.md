# Targeted OMODOS Context

## latestLogbookForMachine_ — 2 hit(s)
### Around L16350
~~~text
16335:   const mk=norm_(machine && (machine.kode||machine['Kode Mesin']));
16336:   const mn=norm_(machine && (machine.nama||machine['Nama Mesin']));
16337:   if(rk && mk) return rk===mk;
16338:   return !!(rn && mn && rn===mn);
16339: }
16340: function latestEntryPerMachine(){
16341:   const map = {};
16342:   sotEntries(ENTRIES).forEach(e=>{
16343:     const keys=[String(e['Nama Mesin']||''),String(e['Kode Mesin']||'')].filter(Boolean);
16344:     keys.forEach(k=>{
16345:       if(!map[k] || machineEventTs_(e)>machineEventTs_(map[k])) map[k]=e;
16346:     });
16347:   });
16348:   return map;
16349: }
16350: function latestLogbookForMachine_(machine){
16351:   let best=null,bestTs=-Infinity;
16352:   sotEntries(ENTRIES).forEach(e=>{
16353:     if(!machineMatchRecord_(e,machine))return;
16354:     const t=machineEventTs_(e);if(t>bestTs){best=e;bestTs=t;}
16355:   });
16356:   return best;
16357: }
16358: 
16359: // [FIX] HOME_PRIORITY_KODE_MESIN & HOME_MACHINE_FILTER dipindah ke atas
16360: // (dekat deklarasi PREVIOUS_ACTIVE_VIEW/DASHBOARD_TIMER_INTERVAL) — lihat
16361: // catatan di sana. Jangan dideklarasikan ulang di sini.
16362: function dashboardMachineList(){
16363:   if(!Array.isArray(MACHINES)) return [];
16364:   let list = MACHINES
16365:     .slice()
16366:     .sort((a,b)=> String(a['Nama Mesin']||'').localeCompare(String(b['Nama Mesin']||'')))
16367:     .map(m=> ({ kode: m['Kode Mesin']||'', nama: m['Nama Mesin']||'' }))
16368:     .filter(m=> m.nama);
16369:   if(HOME_MACHINE_FILTER === 'priority'){
16370:     list = list.filter(m=> HOME_PRIORITY_KODE_MESIN.includes(m.kode));
16371:   }
16372:   return list;
16373: }
16374: 
16375: function dashTimerStartIso(e){
16376:   const tgl = e['Tanggal'];
16377:   if(!tgl) return '';
16378:   const wkt = fmtTime(e['Waktu']) || '00:00';
16379:   const d = new Date(`${String(tgl).slice(0,10)}T${wkt}:00`);
~~~

### Around L19229
~~~text
19214:     keys.forEach(key=>{
19215:       if(!map[key] || patrolEventTs_(r)>patrolEventTs_(map[key])) map[key]=r;
19216:     });
19217:   });
19218:   return map;
19219: }
19220: function latestPatrolForMachine_(machine){
19221:   let best=null,bestTs=-Infinity;
19222:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19223:     if(!machineMatchRecord_(r,machine))return;
19224:     const t=patrolEventTs_(r);if(t>bestTs){best=r;bestTs=t;}
19225:   });
19226:   return best;
19227: }
19228: function machineLatestStatusSnapshot_(machine){
19229:   const log=latestLogbookForMachine_(machine), patrol=latestPatrolForMachine_(machine);
19230:   const logTs=machineEventTs_(log), patrolTs=patrolEventTs_(patrol);
19231:   if(!log && !patrol) return {key:'none',source:'none',sourceLabel:'Belum Ada Data',ts:-Infinity,record:null,description:'Belum ada data Logbook atau Patrol sejak 1 September 2026.'};
19232:   if(patrol && patrolTs>=logTs){
19233:     return {key:pmSeverityKey(patrol.severity),source:'patrol',sourceLabel:'Patrol',ts:patrolTs,record:patrol,
19234:       description:patrol.deskripsiTemuan||patrol.titikInspeksi||'Patrol tersimpan tanpa catatan temuan.'};
19235:   }
19236:   return {key:dashStatusKey(log && log['Status']),source:'logbook',sourceLabel:'Logbook',ts:logTs,record:log,
19237:     description:(log&&log['Deskripsi Masalah'])||'Logbook tersimpan tanpa deskripsi masalah.'};
19238: }
19239: function formatMachineStatusTime_(ts){
19240:   if(!Number.isFinite(ts)||ts<=0)return 'Belum ada waktu tercatat';
19241:   return new Date(ts).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
19242: }
19243: /* ---------------- PATROL HARIAN (checklist tablet-first) ---------------- */
19244: // Menggantikan form Predictive Maintenance lama, tapi tetap memakai data
19245: // layer yang sama (PM_REPORTS / LS_PM_KEY / apiGet('predictiveReports') /
19246: // apiPost({action:'savePredictiveReport'|'deletePredictiveReport'})) supaya
19247: // Visual Dashboard, Copilot, dan backend Cloudflare TIDAK perlu diubah.
19248: const PATROL_CHECKLIST_DEF = {
19249:   'Elektrikal': ['Panel bersih','Lampu indikator normal','Tidak ada alarm','Tidak ada bau gosong','Kabel aman','Fan panel normal','Suhu panel normal','E-Stop berfungsi normal'],
19250:   'Mekanikal': ['Suara normal','Getaran normal','Bearing normal','Coupling normal','Belt normal','Gear normal','Safety guard normal','Baut/mur kencang'],
19251:   'Pneumatic': ['Tekanan normal','Tidak ada kebocoran','Selang dalam kondisi baik','FRL (Filter-Regulator-Lubricator) normal'],
19252:   'Lubrikasi': ['Level oli normal','Tidak ada kebocoran oli','Grease cukup'],
19253:   'Housekeeping': ['Area bersih','Tidak ada tumpahan','Jalur aman/tidak terhalang','Petugas memakai APD','Guard/pelindung lengkap']
19254: };
19255: // [FITUR BARU] Toggle tampil/sembunyi per kategori General Checking (Elektrikal,
19256: // Mekanikal, Pneumatic, Lubrikasi, Housekeeping) di menu Patrol Harian, diatur
19257: // dari Master Koneksi > "Kategori General Checking — Patrol Harian". Disimpan
19258: // localStorage (biar langsung kepakai offline) + disinkron ke backend Apps
~~~

## latestPatrolForMachine_ — 2 hit(s)
### Around L19220
~~~text
19205: function homePatrolRecords_(){
19206:   const summary = Array.isArray(HOME_PATROL_STATUS) ? HOME_PATROL_STATUS : [];
19207:   const full = (typeof canAccessView_==='function' && canAccessView_('patrol') && Array.isArray(PM_REPORTS)) ? PM_REPORTS : [];
19208:   return summary.concat(full);
19209: }
19210: function latestPmStatusPerMachine(){
19211:   const map = {};
19212:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19213:     const keys=[String(r.namaMesin||''),String(r.kodeMesin||'')].filter(Boolean);
19214:     keys.forEach(key=>{
19215:       if(!map[key] || patrolEventTs_(r)>patrolEventTs_(map[key])) map[key]=r;
19216:     });
19217:   });
19218:   return map;
19219: }
19220: function latestPatrolForMachine_(machine){
19221:   let best=null,bestTs=-Infinity;
19222:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19223:     if(!machineMatchRecord_(r,machine))return;
19224:     const t=patrolEventTs_(r);if(t>bestTs){best=r;bestTs=t;}
19225:   });
19226:   return best;
19227: }
19228: function machineLatestStatusSnapshot_(machine){
19229:   const log=latestLogbookForMachine_(machine), patrol=latestPatrolForMachine_(machine);
19230:   const logTs=machineEventTs_(log), patrolTs=patrolEventTs_(patrol);
19231:   if(!log && !patrol) return {key:'none',source:'none',sourceLabel:'Belum Ada Data',ts:-Infinity,record:null,description:'Belum ada data Logbook atau Patrol sejak 1 September 2026.'};
19232:   if(patrol && patrolTs>=logTs){
19233:     return {key:pmSeverityKey(patrol.severity),source:'patrol',sourceLabel:'Patrol',ts:patrolTs,record:patrol,
19234:       description:patrol.deskripsiTemuan||patrol.titikInspeksi||'Patrol tersimpan tanpa catatan temuan.'};
19235:   }
19236:   return {key:dashStatusKey(log && log['Status']),source:'logbook',sourceLabel:'Logbook',ts:logTs,record:log,
19237:     description:(log&&log['Deskripsi Masalah'])||'Logbook tersimpan tanpa deskripsi masalah.'};
19238: }
19239: function formatMachineStatusTime_(ts){
19240:   if(!Number.isFinite(ts)||ts<=0)return 'Belum ada waktu tercatat';
19241:   return new Date(ts).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
19242: }
19243: /* ---------------- PATROL HARIAN (checklist tablet-first) ---------------- */
19244: // Menggantikan form Predictive Maintenance lama, tapi tetap memakai data
19245: // layer yang sama (PM_REPORTS / LS_PM_KEY / apiGet('predictiveReports') /
19246: // apiPost({action:'savePredictiveReport'|'deletePredictiveReport'})) supaya
19247: // Visual Dashboard, Copilot, dan backend Cloudflare TIDAK perlu diubah.
19248: const PATROL_CHECKLIST_DEF = {
19249:   'Elektrikal': ['Panel bersih','Lampu indikator normal','Tidak ada alarm','Tidak ada bau gosong','Kabel aman','Fan panel normal','Suhu panel normal','E-Stop berfungsi normal'],
~~~

### Around L19229
~~~text
19214:     keys.forEach(key=>{
19215:       if(!map[key] || patrolEventTs_(r)>patrolEventTs_(map[key])) map[key]=r;
19216:     });
19217:   });
19218:   return map;
19219: }
19220: function latestPatrolForMachine_(machine){
19221:   let best=null,bestTs=-Infinity;
19222:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19223:     if(!machineMatchRecord_(r,machine))return;
19224:     const t=patrolEventTs_(r);if(t>bestTs){best=r;bestTs=t;}
19225:   });
19226:   return best;
19227: }
19228: function machineLatestStatusSnapshot_(machine){
19229:   const log=latestLogbookForMachine_(machine), patrol=latestPatrolForMachine_(machine);
19230:   const logTs=machineEventTs_(log), patrolTs=patrolEventTs_(patrol);
19231:   if(!log && !patrol) return {key:'none',source:'none',sourceLabel:'Belum Ada Data',ts:-Infinity,record:null,description:'Belum ada data Logbook atau Patrol sejak 1 September 2026.'};
19232:   if(patrol && patrolTs>=logTs){
19233:     return {key:pmSeverityKey(patrol.severity),source:'patrol',sourceLabel:'Patrol',ts:patrolTs,record:patrol,
19234:       description:patrol.deskripsiTemuan||patrol.titikInspeksi||'Patrol tersimpan tanpa catatan temuan.'};
19235:   }
19236:   return {key:dashStatusKey(log && log['Status']),source:'logbook',sourceLabel:'Logbook',ts:logTs,record:log,
19237:     description:(log&&log['Deskripsi Masalah'])||'Logbook tersimpan tanpa deskripsi masalah.'};
19238: }
19239: function formatMachineStatusTime_(ts){
19240:   if(!Number.isFinite(ts)||ts<=0)return 'Belum ada waktu tercatat';
19241:   return new Date(ts).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
19242: }
19243: /* ---------------- PATROL HARIAN (checklist tablet-first) ---------------- */
19244: // Menggantikan form Predictive Maintenance lama, tapi tetap memakai data
19245: // layer yang sama (PM_REPORTS / LS_PM_KEY / apiGet('predictiveReports') /
19246: // apiPost({action:'savePredictiveReport'|'deletePredictiveReport'})) supaya
19247: // Visual Dashboard, Copilot, dan backend Cloudflare TIDAK perlu diubah.
19248: const PATROL_CHECKLIST_DEF = {
19249:   'Elektrikal': ['Panel bersih','Lampu indikator normal','Tidak ada alarm','Tidak ada bau gosong','Kabel aman','Fan panel normal','Suhu panel normal','E-Stop berfungsi normal'],
19250:   'Mekanikal': ['Suara normal','Getaran normal','Bearing normal','Coupling normal','Belt normal','Gear normal','Safety guard normal','Baut/mur kencang'],
19251:   'Pneumatic': ['Tekanan normal','Tidak ada kebocoran','Selang dalam kondisi baik','FRL (Filter-Regulator-Lubricator) normal'],
19252:   'Lubrikasi': ['Level oli normal','Tidak ada kebocoran oli','Grease cukup'],
19253:   'Housekeeping': ['Area bersih','Tidak ada tumpahan','Jalur aman/tidak terhalang','Petugas memakai APD','Guard/pelindung lengkap']
19254: };
19255: // [FITUR BARU] Toggle tampil/sembunyi per kategori General Checking (Elektrikal,
19256: // Mekanikal, Pneumatic, Lubrikasi, Housekeeping) di menu Patrol Harian, diatur
19257: // dari Master Koneksi > "Kategori General Checking — Patrol Harian". Disimpan
19258: // localStorage (biar langsung kepakai offline) + disinkron ke backend Apps
~~~

## machine status — 0 hit(s)
- No match.

## status mesin — 13 hit(s)
### Around L1806
~~~text
01791: .dash-card .dc-desc{font-size:clamp(11px,4.4cqi,13px);opacity:.85;color:#fff;overflow-wrap:anywhere;word-break:break-word;flex:1 1 auto;}
01792: /* [ADAPTIVE] dc-recap = baris Machine Score paling bawah, dipisah garis
01793:    (border-top) dari konten di atasnya. flex-wrap + min-width:0 mencegah teks
01794:    bintang/skor menumpuk kalau lebar card sangat sempit (mis. 1 kolom di HP kecil). */
01795: .dash-card .dc-recap{
01796:   display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;margin-top:auto;padding-top:8px;
01797:   border-top:1px solid rgba(255,255,255,.15);font-size:11px;color:#fff;opacity:.85;font-family:var(--font-mono);
01798: }
01799: .dash-card .dc-recap span{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-width:0;overflow-wrap:anywhere;word-break:break-word;}
01800: .dash-card .dc-timer{
01801:   margin-top:10px;font-family:var(--font-mono);font-size:13px;font-weight:700;
01802:   padding:6px 10px;border-radius:7px;text-align:center;
01803:   background:rgba(255,255,255,.18);color:#fff;overflow-wrap:anywhere;word-break:break-word;
01804: }
01805: 
01806: /* [FIX] Card mesin di Home: HANYA menampilkan Kode Mesin + Status Mesin
01807:    saat card-nya SENDIRI sempit (bukan lagi berdasarkan lebar LAYAR) —
01808:    supaya konsisten baik di mode portrait (2 kolom, card lebar → info
01809:    lengkap tetap muat) maupun landscape (6 kolom, card jadi sempit → info
01810:    diringkas otomatis), tanpa perlu breakpoint terpisah untuk tiap
01811:    kombinasi. Memakai @container (bukan @media) karena .dash-card sudah
01812:    didaftarkan sebagai container query context sendiri (container-type:
01813:    inline-size;container-name:dashcard) — jadi treshold-nya mengikuti
01814:    lebar card actual, bukan lebar viewport. */
01815: @container dashcard (max-width: 150px){
01816:   .dash-card .dc-name,
01817:   .dash-card .dc-desc,
01818:   .dash-card .dc-recap{ display:none; }
01819:   /* Kode & status jadi info utama saat card sempit -> naikkan sedikit
01820:      ukuran fontnya supaya tetap enak dibaca. */
01821:   .dash-card .dc-kode{ font-size:clamp(12px,7cqi,14px); opacity:.9; }
01822:   .dash-card .dc-status{ font-size:clamp(12px,7.2cqi,14px); margin-bottom:0; }
01823:   .dash-card{ padding:12px; }
01824: }
01825: /* [ADAPTIF] Sekarang container-type:size (bukan cuma inline-size) di
01826:    .dash-card, jadi bisa query TINGGI card juga -- dipakai supaya saat
01827:    grid harus menampung banyak mesin di layar pendek (tanpa scroll,
01828:    lihat #dash-grid di bawah) dan tiap baris jadi rendah, info sekunder
01829:    otomatis disembunyikan bertahap alih-alih teks terpotong/overflow.
01830:    Threshold bertingkat: makin pendek card, makin sedikit info yang
01831:    ditampilkan, tapi Kode Mesin + Status (info paling penting) SELALU
01832:    tampil di semua ukuran. */
01833: @container dashcard (max-height: 130px){
01834:   .dash-card{ padding:10px; }
01835:   .dash-card .dc-recap{ display:none; }
~~~

### Around L1980
~~~text
01965:   flex:0 0 auto;
01966:   width:100%;
01967:   max-width:100%;
01968:   box-sizing:border-box;
01969: }
01970: .app.dash-mode .main .view{ display:none; }
01971: .app.dash-mode .main #view-dashboard.active{ display:flex; }
01972: 
01973: .app.dash-mode #view-dashboard.active{
01974:   flex-direction:column;
01975:   flex:1 1 auto;
01976:   min-height:0;
01977:   width:100%;
01978: }
01979: .app.dash-mode #view-dashboard .topbar{flex:0 0 auto;margin-bottom:6px;width:100%;}
01980: /* Judul "Home" & sub-teks diperkecil supaya area cards status mesin yang mendominasi layar */
01981: .app.dash-mode #view-dashboard .topbar h1{font-size:clamp(14px,1.9vh,17px);margin:0 0 2px 0;}
01982: .app.dash-mode #view-dashboard .topbar .sub{font-size:clamp(10px,1.3vh,11.5px);}
01983: .app.dash-mode #view-dashboard .topbar .btn-sm{padding:5px 9px;font-size:11px;}
01984: 
01985: .app.dash-mode #dash-grid{
01986:   flex:1 1 auto;
01987:   min-height:0;
01988:   width:100%;
01989:   display:grid;
01990:   gap:10px;
01991:   /* [FIX] SEMUA card mesin harus tampil sekaligus di layar TANPA scroll
01992:      internal, di ukuran layar manapun -- baris grid menyusut/membesar
01993:      otomatis membagi rata tinggi yang tersedia (minmax(0,1fr) di setiap
01994:      baris hasil grid-auto-rows), bukan dipatok tinggi minimum tetap.
01995:      Supaya info di dalam card tidak terpotong/overflow saat baris jadi
01996:      pendek (banyak mesin / layar pendek), .dash-card sekarang jadi
01997:      container query TINGGI juga (container-type:size, lihat rule
01998:      @container dashcard di atas) -- info sekunder (deskripsi, recap,
01999:      nama) otomatis disembunyikan bertahap sesuai tinggi card aktual,
02000:      Kode Mesin + Status selalu tampil di semua ukuran. */
02001:   grid-auto-rows:minmax(0, 1fr);
02002:   overflow:hidden;
02003:   box-sizing:border-box;
02004: }
02005: /* [FITUR BARU] Kalau card mesin melebihi 3 baris pada ukuran layar saat ini,
02006:    grid TIDAK lagi dipaksa menyusut supaya semua card muat sekaligus (yang
02007:    bikin info kepenceng kalau mesinnya banyak) -- card dikembalikan ke tinggi
02008:    wajar & area grid diberi scroll internal vertikal. Kelas .scroll-mode
02009:    ditambah/dilepas otomatis oleh JS (lihat updateDashGridScrollMode) sesuai
~~~

### Around L2024
~~~text
02009:    ditambah/dilepas otomatis oleh JS (lihat updateDashGridScrollMode) sesuai
02010:    hasil hitung jumlah baris aktual (jumlah card / jumlah kolom saat ini). */
02011: .app.dash-mode #dash-grid.scroll-mode{
02012:   grid-auto-rows:minmax(96px, auto);
02013:   overflow-y:auto;
02014:   overflow-x:hidden;
02015:   -webkit-overflow-scrolling:touch;
02016:   align-content:start;
02017: }
02018: .app.dash-mode #dash-grid.scroll-mode .dash-card{min-height:96px;}
02019: .app.dash-mode .dash-card{overflow:hidden;min-height:0;min-width:0;padding:clamp(6px,1.8vh,18px) clamp(8px,1.4vw,18px);box-sizing:border-box;}
02020: .app.dash-mode .dash-card .dc-desc{-webkit-line-clamp:2;min-height:0;}
02021: .app.dash-mode .dash-card .dc-name{font-size:clamp(11px,1.5vh,15px);}
02022: .app.dash-mode .dash-card .dc-status{margin-bottom:2px;}
02023: 
02024: /* ============ HOME PAGE: status mesin di atas, sisanya di bawah,
02025:    toolbar sidebar ditampilkan horizontal (karena sidebar disembunyikan
02026:    dalam mode fullscreen Home). Semua bagian memakai flex sizing supaya
02027:    halaman tetap pas satu layar tanpa scroll, adaptif ke tinggi/lebar. ============ */
02028: .home-status-title{flex:0 0 auto;margin:0 0 6px;font-size:clamp(11px,1.5vh,13px);}
02029: .app.dash-mode #view-dashboard.active #dash-grid{flex:1 1 auto;}
02030: /* Blok bawah (sapaan, alert, toolbar shortcut) dibuat sekompak mungkin
02031:    supaya tidak berebut ruang dengan grid status mesin, dan halaman Home
02032:    tidak pernah butuh scroll di ukuran layar manapun. */
02033: .home-below{
02034:   flex:0 0 auto;width:100%;box-sizing:border-box;
02035:   display:flex;flex-direction:column;gap:6px;
02036:   margin-top:8px;padding-top:8px;border-top:1px solid var(--line-soft);
02037: }
02038: .home-below-row{
02039:   display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
02040: }
02041: .home-greeting-block{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;min-width:0;}
02042: .home-greeting{font-family:var(--font-display);font-weight:700;font-size:clamp(12px,1.5vh,15px);color:var(--text);white-space:nowrap;}
02043: .home-date{font-size:10.5px;color:var(--text-dim);white-space:nowrap;}
02044: .home-critical-alert{
02045:   display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:flex-end;
02046:   min-width:0;flex:1 1 auto;
02047:   /* [FIX] Banner ini nempel ke kanan (justify-content:flex-end), persis di
02048:      sudut yang sama dengan FAB Copilot (position:fixed;right:22px;bottom:88px;
02049:      width:56px). Tergantung jumlah card mesin & posisi scroll, banner ini bisa
02050:      mendarat tepat di belakang FAB sehingga teksnya (mis. "1 Perlu Perhatian")
02051:      terpotong/ketutup. Padding kanan ini mereservasi ruang aman permanen
02052:      (lebar FAB + jarak dari tepi + sedikit buffer) supaya chip selalu wrap
02053:      ke baris baru SEBELUM masuk ke zona FAB, bukan malah ketutup di baliknya. */
~~~

### Around L2031
~~~text
02016:   align-content:start;
02017: }
02018: .app.dash-mode #dash-grid.scroll-mode .dash-card{min-height:96px;}
02019: .app.dash-mode .dash-card{overflow:hidden;min-height:0;min-width:0;padding:clamp(6px,1.8vh,18px) clamp(8px,1.4vw,18px);box-sizing:border-box;}
02020: .app.dash-mode .dash-card .dc-desc{-webkit-line-clamp:2;min-height:0;}
02021: .app.dash-mode .dash-card .dc-name{font-size:clamp(11px,1.5vh,15px);}
02022: .app.dash-mode .dash-card .dc-status{margin-bottom:2px;}
02023: 
02024: /* ============ HOME PAGE: status mesin di atas, sisanya di bawah,
02025:    toolbar sidebar ditampilkan horizontal (karena sidebar disembunyikan
02026:    dalam mode fullscreen Home). Semua bagian memakai flex sizing supaya
02027:    halaman tetap pas satu layar tanpa scroll, adaptif ke tinggi/lebar. ============ */
02028: .home-status-title{flex:0 0 auto;margin:0 0 6px;font-size:clamp(11px,1.5vh,13px);}
02029: .app.dash-mode #view-dashboard.active #dash-grid{flex:1 1 auto;}
02030: /* Blok bawah (sapaan, alert, toolbar shortcut) dibuat sekompak mungkin
02031:    supaya tidak berebut ruang dengan grid status mesin, dan halaman Home
02032:    tidak pernah butuh scroll di ukuran layar manapun. */
02033: .home-below{
02034:   flex:0 0 auto;width:100%;box-sizing:border-box;
02035:   display:flex;flex-direction:column;gap:6px;
02036:   margin-top:8px;padding-top:8px;border-top:1px solid var(--line-soft);
02037: }
02038: .home-below-row{
02039:   display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;
02040: }
02041: .home-greeting-block{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;min-width:0;}
02042: .home-greeting{font-family:var(--font-display);font-weight:700;font-size:clamp(12px,1.5vh,15px);color:var(--text);white-space:nowrap;}
02043: .home-date{font-size:10.5px;color:var(--text-dim);white-space:nowrap;}
02044: .home-critical-alert{
02045:   display:flex;gap:6px;flex-wrap:wrap;align-items:center;justify-content:flex-end;
02046:   min-width:0;flex:1 1 auto;
02047:   /* [FIX] Banner ini nempel ke kanan (justify-content:flex-end), persis di
02048:      sudut yang sama dengan FAB Copilot (position:fixed;right:22px;bottom:88px;
02049:      width:56px). Tergantung jumlah card mesin & posisi scroll, banner ini bisa
02050:      mendarat tepat di belakang FAB sehingga teksnya (mis. "1 Perlu Perhatian")
02051:      terpotong/ketutup. Padding kanan ini mereservasi ruang aman permanen
02052:      (lebar FAB + jarak dari tepi + sedikit buffer) supaya chip selalu wrap
02053:      ke baris baru SEBELUM masuk ke zona FAB, bukan malah ketutup di baliknya. */
02054:   padding-right:84px;box-sizing:border-box;
02055: }
02056: .home-critical-chip{
02057:   display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:999px;
02058:   font-size:10.5px;font-weight:700;letter-spacing:.3px;white-space:nowrap;
02059:   font-family:var(--font-mono);cursor:default;
02060: }
~~~

### Around L2097
~~~text
02082: .hsr-narrative{font-size:clamp(11px,1.35vh,12.5px);color:var(--text-dim);line-height:1.45;overflow-wrap:anywhere;}
02083: .hsr-narrative b{color:var(--text);font-weight:700;}
02084: .hsr-stats{display:flex;flex-wrap:wrap;gap:6px;}
02085: .hsr-stat{
02086:   display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;
02087:   font-size:10.5px;font-weight:700;font-family:var(--font-mono);white-space:nowrap;
02088:   background:var(--panel-2);border:1px solid var(--line);color:var(--text-dim);
02089: }
02090: .hsr-stat.lv-kritikal{background:color-mix(in srgb, var(--red) 16%, transparent);color:var(--red);border-color:var(--red-dim);}
02091: .hsr-stat.lv-perhatian{background:rgba(245,166,35,.16);color:var(--amber);border-color:var(--amber-dim);}
02092: .hsr-stat.lv-aman{background:rgba(61,220,151,.14);color:var(--green);border-color:var(--green-dim);}
02093: .hsr-empty{font-size:11.5px;color:var(--text-dim);}
02094: @media (max-height:640px){
02095:   /* Layar pendek: jangan sembunyikan Smart Resume, cukup sembunyikan
02096:      baris sapaan & alert (info sekunder) dan padatkan jarak supaya
02097:      grid status mesin tetap yang paling dominan. */
02098:   .home-below{margin-top:4px;padding-top:4px;gap:4px;}
02099:   .home-below-row{display:none;}
02100:   .home-smart-resume{padding:6px 10px;}
02101:   .hsr-narrative{-webkit-line-clamp:2;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;}
02102: }
02103: @media (max-height:460px){
02104:   /* Sangat pendek (mis. HP landscape): sembunyikan narasi panjang, sisakan
02105:      judul + chip statistik saja supaya tetap ringkas 1 baris. */
02106:   .hsr-narrative{display:none;}
02107: }
02108: .sidebar-user-box{
02109:   margin-top:auto;padding:12px 14px;border-top:1px solid var(--line-soft);
02110:   display:flex;flex-direction:column;gap:8px;flex-shrink:0;
02111: }
02112: .sidebar-user-box .su-info{font-size:11.5px;color:var(--text-dim);line-height:1.4;overflow:hidden;text-overflow:ellipsis;}
02113: .sidebar-user-box .su-info i{margin-right:5px;color:var(--text);}
02114: .su-logout-btn{width:100%;justify-content:center;color:var(--red);border-color:var(--red-dim);}
02115: .su-logout-btn:hover{background:color-mix(in srgb, var(--red) 10%, transparent);}
02116: .sidebar-overlay{
02117:   display:none;position:fixed;inset:0;background:rgba(2,2,3,.6);
02118:   backdrop-filter:blur(2px);z-index:39;
02119: }
02120: .sidebar-overlay.active{display:block;}
02121: .topbar-menu-btn{display:none;}
02122: .bottom-nav{
02123:   display:none;
02124: }
02125: 
02126: /* [FIX] Sidebar HANYA untuk desktop (mouse + layar lebar). Tablet & HP --
~~~

### Around L2184
~~~text
02169:   /* [FIX] Halaman Home pakai mode "dash-mode": sidebar-nya diatur oleh
02170:      rule terpisah `.app.dash-mode .sidebar` (3 class -> spesifisitas
02171:      lebih tinggi dari `.sidebar.open` yang cuma 2 class), jadi walau
02172:      tombol hamburang menambahkan class .open, transform tetap
02173:      translateX(-100%) dan sidebar TIDAK PERNAH terlihat di Home saat di
02174:      HP/tablet. Rule di bawah ini spesifisitasnya lebih tinggi lagi
02175:      (.app.dash-mode .sidebar.open = 4 class) supaya menang. */
02176:   .app.dash-mode .sidebar.open{transform:translateX(0);}
02177:   /* Supaya area sidebar-user-box (info user + tombol Logout) di paling
02178:      bawah drawer selalu tersisa ruang dan tidak mepet/ tertutup safe
02179:      area perangkat saat drawer dibuka di HP/tablet. */
02180:   .sidebar-user-box{padding-bottom:calc(12px + env(safe-area-inset-bottom,0px));}
02181:   .main{padding:18px 16px 92px 16px;}
02182:   /* Halaman Home (dash-mode) pakai height:100vh + overflow:hidden sendiri,
02183:      jadi butuh padding-bottom terpisah supaya bottom-nav (fixed, di atas
02184:      konten) tidak menutupi baris terakhir cards status mesin. */
02185:   .app.dash-mode .main{padding-bottom:calc(72px + env(safe-area-inset-bottom,0px));}
02186:   .topbar-menu-btn{
02187:     display:inline-flex;align-items:center;justify-content:center;
02188:     width:38px;height:38px;border-radius:9px;background:var(--panel-2);
02189:     border:1px solid var(--line);color:var(--text);font-size:18px;cursor:pointer;
02190:     margin-right:10px;flex-shrink:0;
02191:   }
02192:   .topbar-title-row{display:flex;align-items:center;}
02193: 
02194:   .bottom-nav{
02195:     display:flex;position:fixed;left:0;right:0;bottom:0;z-index:50;
02196:     background:var(--panel-glass); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
02197:     border-top:1px solid var(--line);
02198:     padding:7px 3px calc(7px + env(safe-area-inset-bottom,0px)) 3px;
02199:     justify-content:space-around;
02200:     box-shadow:0 -6px 20px rgba(0,0,0,.35);
02201:   }
02202:   .bottom-nav-btn{
02203:     display:flex;flex-direction:column;align-items:center;gap:2px;
02204:     background:none;border:none;color:var(--text-dim);font-size:8.5px;
02205:     font-family:var(--font-body);font-weight:600;padding:4px 2px;border-radius:8px;
02206:     flex:1;min-width:0;cursor:pointer;transition:color var(--trans);
02207:   }
02208:   .bottom-nav-btn .ico{font-size:17px;}
02209:   .bottom-nav-btn .label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
02210:   .bottom-nav-btn.active{color:#ff6b76;}
02211:   .bottom-nav-btn.group-active{color:#ff6b76;}
02212:   .bottom-nav-btn span.label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:56px;}
02213: }
~~~

### Around L2807
~~~text
02792: 
02793: .topbar-menu-btn.lc-quick-btn{position:relative;}
02794: .topbar-menu-btn.lc-quick-btn[aria-pressed="true"]{color:var(--red);border-color:var(--red);}
02795: .topbar-menu-btn.lc-quick-btn[aria-pressed="true"]::after{content:'';position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--red);box-shadow:0 0 6px var(--red);}
02796: 
02797: /* --- Mode aktif: body.low-cognitive --- */
02798: body.low-cognitive{ font-size:16.5px; }
02799: body.low-cognitive [data-lc-hide]{ display:none !important; }
02800: 
02801: /* Kurangi animasi & efek visual berlebih */
02802: body.low-cognitive *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; }
02803: body.low-cognitive .card, body.low-cognitive .dash-card, body.low-cognitive .an-card,
02804: body.low-cognitive .sidebar, body.low-cognitive .modal, body.low-cognitive .btn{ box-shadow:none !important; }
02805: body.low-cognitive .dash-card:hover{ transform:none !important; filter:none !important; }
02806: /* Pengecualian: kedip status Normal/Perlu Perhatian/Kritikal di card mesin Home BUKAN
02807:    animasi dekoratif — ini sinyal status mesin (aman/butuh perhatian/breakdown)
02808:    yang wajib tetap terlihat berkedip walau Mode Low-Cognitive aktif.
02809:    Frekuensi sengaja beda per status (lihat dashPulseGreen/Amber/Red di atas). */
02810: body.low-cognitive .dash-card.status-normal{ animation-duration:2.6s !important; animation-iteration-count:infinite !important; }
02811: body.low-cognitive .dash-card.status-perhatian{ animation-duration:1.6s !important; animation-iteration-count:infinite !important; }
02812: body.low-cognitive .dash-card.status-kritikal{ animation-duration:.6s !important; animation-iteration-count:infinite !important; }
02813: 
02814: /* Whitespace lebih lega + card lebih sederhana */
02815: body.low-cognitive .card{ padding:22px !important; margin-bottom:22px !important; border-width:1px !important; }
02816: body.low-cognitive .topbar{ margin-bottom:20px !important; }
02817: body.low-cognitive .i40-banner{ display:none !important; }
02818: 
02819: /* Font & tap target lebih besar, kontras lebih tinggi */
02820: body.low-cognitive h1{ font-size:22px !important; }
02821: body.low-cognitive .sub{ font-size:14px !important; opacity:1 !important; }
02822: body.low-cognitive label{ font-size:14px !important; font-weight:700 !important; }
02823: body.low-cognitive .section-title{ font-size:15px !important; }
02824: body.low-cognitive .btn{ min-height:48px !important; padding:12px 20px !important; font-size:15px !important; }
02825: /* Home controls share compact dimensions, including mobile low cognitive mode. */
02826: body.low-cognitive #home-mesin-filter .machine-chip,
02827: body.low-cognitive #btn-lc-priority-only,
02828: body.low-cognitive #btn-refresh-dashboard{
02829:   display:inline-flex;align-items:center;justify-content:center;gap:6px;
02830:   min-height:30px !important;padding:5px 11px !important;font-size:12px !important;
02831:   line-height:18px !important;border-radius:8px !important;
02832: }
02833: 
02834: body.low-cognitive input, body.low-cognitive select, body.low-cognitive textarea{ min-height:48px !important; font-size:15.5px !important; padding:12px 14px !important; }
02835: body.low-cognitive .nav-btn, body.low-cognitive .nav-parent-btn{ min-height:48px !important; font-size:15px !important; }
02836: body.low-cognitive .bottom-nav-btn{ min-height:52px !important; }
~~~

### Around L4166
~~~text
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
04163: 
04164:     <section class="view active" id="view-dashboard">
04165:       <div class="topbar">
04166:         <div><h1>Home</h1><div class="sub">Ringkasan status mesin &amp; jalan pintas menu.</div></div>
04167:         <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
04168:           <div class="machine-chip-row" id="home-mesin-filter" style="margin-bottom:0;">
04169:             <button type="button" class="machine-chip active" data-home-filter="priority">Mesin Prioritas</button>
04170:             <button type="button" class="machine-chip" data-home-filter="all">Semua Mesin</button>
04171:           </div>
04172:           <button class="btn btn-sm" id="btn-lc-priority-only" data-lc-only aria-pressed="false"><i class="ph-bold ph-warning"></i> Fokus Utama</button>
04173:           <button class="btn btn-sm" id="btn-refresh-dashboard"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04174:         </div>
04175:       </div>
04176: 
04177:       <div class="section-title home-status-title"><i class="ph-bold ph-gauge"></i> Status Mesin Sekarang</div>
04178:       <div class="dash-grid" id="dash-grid"></div>
04179: 
04180:       <div class="home-below" id="home-below">
04181:         <div class="home-below-row">
04182:           <div class="home-greeting-block">
04183:             <div class="home-greeting" id="home-greeting">Halo 👋</div>
04184:             <div class="home-date" id="home-date"></div>
04185:           </div>
04186:           <div class="home-critical-alert" id="home-critical-alert"></div>
04187:         </div>
04188:         <div class="home-smart-resume" id="home-smart-resume"></div>
04189:       </div>
04190:     </section>
04191: 
04192: 
04193:     <section class="view v4-shell" id="view-omodos4" data-v4-shell="1">
04194:       <div class="topbar">
04195:         <div>
~~~

### Around L4177
~~~text
04162:     </section>
04163: 
04164:     <section class="view active" id="view-dashboard">
04165:       <div class="topbar">
04166:         <div><h1>Home</h1><div class="sub">Ringkasan status mesin &amp; jalan pintas menu.</div></div>
04167:         <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
04168:           <div class="machine-chip-row" id="home-mesin-filter" style="margin-bottom:0;">
04169:             <button type="button" class="machine-chip active" data-home-filter="priority">Mesin Prioritas</button>
04170:             <button type="button" class="machine-chip" data-home-filter="all">Semua Mesin</button>
04171:           </div>
04172:           <button class="btn btn-sm" id="btn-lc-priority-only" data-lc-only aria-pressed="false"><i class="ph-bold ph-warning"></i> Fokus Utama</button>
04173:           <button class="btn btn-sm" id="btn-refresh-dashboard"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04174:         </div>
04175:       </div>
04176: 
04177:       <div class="section-title home-status-title"><i class="ph-bold ph-gauge"></i> Status Mesin Sekarang</div>
04178:       <div class="dash-grid" id="dash-grid"></div>
04179: 
04180:       <div class="home-below" id="home-below">
04181:         <div class="home-below-row">
04182:           <div class="home-greeting-block">
04183:             <div class="home-greeting" id="home-greeting">Halo 👋</div>
04184:             <div class="home-date" id="home-date"></div>
04185:           </div>
04186:           <div class="home-critical-alert" id="home-critical-alert"></div>
04187:         </div>
04188:         <div class="home-smart-resume" id="home-smart-resume"></div>
04189:       </div>
04190:     </section>
04191: 
04192: 
04193:     <section class="view v4-shell" id="view-omodos4" data-v4-shell="1">
04194:       <div class="topbar">
04195:         <div>
04196:           <div class="v4-eyebrow">Industrial Intelligence Layer</div>
04197:           <h1 style="margin-top:4px;">OMODOS 4.0</h1>
04198:           <div class="sub">Command Center Superadmin yang membaca data existing tanpa membuat duplikasi sumber data.</div>
04199:         </div>
04200:         <button class="btn btn-sm" id="btn-v4-refresh" type="button"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04201:       </div>
04202: 
04203:       <div class="v4-hero">
04204:         <div>
04205:           <div class="v4-eyebrow">OBSERVE • CONNECT • UNDERSTAND</div>
04206:           <div class="v4-title">Command Center</div>
~~~

### Around L16302
~~~text
16287:   if(s.includes('proses')) return 'perhatian';
16288:   if(s.includes('pending')) return 'perhatian';
16289:   if(s.includes('selesai')) return 'normal';
16290:   return 'none';
16291: }
16292: function dashStatusLabel(key){
16293:   return {normal:'Normal', perhatian:'Perlu Perhatian', kritikal:'Kritikal', none:'Belum Ada Data'}[key] || 'Belum Ada Data';
16294: }
16295: function dashStatusColorVar(key){
16296:   return {normal:'var(--green)', perhatian:'var(--amber)', kritikal:'var(--red)', none:'var(--text-dim)'}[key] || 'var(--text-dim)';
16297: }
16298: function dashSeverityRank(key){
16299:   return {none:-1, normal:0, perhatian:1, kritikal:2}[key] ?? -1;
16300: }
16301: 
16302: // [FIX SOT] Status Mesin Sekarang di Home HARUS hanya mencerminkan data
16303: // source-of-truth (Tanggal >= SOT_CUTOFF_DATE) -- entri historis (hasil
16304: // export OneNote sebelum cutoff) tidak boleh menentukan status "sekarang"
16305: // sebuah mesin, karena validitasnya belum bisa dipastikan. Kalau mesin
16306: // belum punya entri SOT sama sekali, dianggap status "none" (Belum Ada
16307: // Data), BUKAN jatuh ke entri historis terakhirnya.
16308: function machineEventTs_(e){
16309:   if(!e) return -Infinity;
16310:   let t=Date.parse(e['Timestamp Input']||'');
16311:   if(Number.isFinite(t)) return t;
16312:   const tanggal=String(e['Tanggal']||'').slice(0,10), waktu=fmtTime(e['Waktu'])||'00:00';
16313:   t=Date.parse(tanggal ? (tanggal+'T'+waktu+':00') : '');
16314:   return Number.isFinite(t)?t:-Infinity;
16315: }
16316: function patrolEventTs_(r){
16317:   if(!r) return -Infinity;
16318:   const n=Number(r.ts); if(Number.isFinite(n)&&n>0) return n;
16319:   const tanggal=String(r.tanggal||'').slice(0,10), waktu=String(r.waktuPatrol||'00:00').slice(0,5);
16320:   const t=Date.parse(tanggal ? (tanggal+'T'+waktu+':00') : '');
16321:   return Number.isFinite(t)?t:-Infinity;
16322: }
16323: function isSotPatrolRecord_(r){
16324:   if(!r || !r.patrolMode) return false;
16325:   const tanggal=String(r.tanggal||'').slice(0,10);
16326:   if(tanggal){
16327:     const day=Date.parse(tanggal+'T00:00:00');
16328:     if(Number.isFinite(day)) return day>=SOT_CUTOFF_DATE.getTime();
16329:   }
16330:   return patrolEventTs_(r)>=SOT_CUTOFF_DATE.getTime();
16331: }
~~~

### Around L18279
~~~text
18264:       <div class="detail-row"><div class="k">Nilai Kondisi</div><div class="v">${escapeHtml(String(score))}/100</div></div>
18265:       <div class="detail-row"><div class="k">Temuan</div><div class="v">${temuan} temuan • ${escapeHtml(p.deskripsiTemuan||'-')}</div></div>
18266:       <div class="detail-row"><div class="k">Petugas</div><div class="v">${escapeHtml(p.petugas||'-')}</div></div>`
18267:       : `<div class="detail-row"><div class="k">Sumber Terbaru</div><div class="v">Patrol</div></div>
18268:          <div class="detail-row"><div class="k">Waktu Update</div><div class="v">${escapeHtml(formatMachineStatusTime_(snap.ts))}</div></div>
18269:          <div class="detail-row"><div class="k">Status Operasional</div><div class="v">${escapeHtml(dashStatusLabel(snap.key))}</div></div>
18270:          <div class="ai-note-box" style="margin-top:10px;">🔒 Detail temuan Patrol mengikuti Role Access Patrol.</div>`;
18271:   }else{
18272:     body='<div class="empty-state" style="padding:18px;"><div class="ico"><i class="ph-bold ph-info"></i></div>Belum ada data Logbook atau Patrol sejak 1 September 2026 untuk mesin ini.</div>';
18273:   }
18274:   $('#modal-content').innerHTML=`
18275:     <div class="modal-head">
18276:       <div>
18277:         <span class="badge" style="background:var(--panel-2);border:1px solid var(--line);">${escapeHtml(machine.kode||'-')}</span>
18278:         <h2 style="font-family:var(--font-display);margin:8px 0 0 0;">${escapeHtml(machine.nama||'-')}</h2>
18279:         <div class="sub">Status mesin terkini berdasarkan data Logbook atau Patrol yang waktunya paling baru.</div>
18280:       </div>
18281:       <button class="modal-close" id="btn-close-modal">✕</button>
18282:     </div>
18283:     <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:14px;">
18284:       <span class="badge badge-${snap.key==='kritikal'?'emergency':snap.key==='perhatian'?'proses':snap.key==='normal'?'selesai':'pending'}" style="font-size:13px;">${escapeHtml(dashStatusLabel(snap.key))}</span>
18285:       <span style="font-size:12px;color:var(--text-dim);">${escapeHtml(snap.sourceLabel)} • ${escapeHtml(formatMachineStatusTime_(snap.ts))}</span>
18286:     </div>
18287:     ${body}
18288:     <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px;">
18289:       ${canLogbookDetail&&snap.source==='logbook'&&snap.record&&snap.record['ID']?'<button type="button" class="btn btn-sm" id="btn-open-current-source"><i class="ph-bold ph-notebook"></i> Buka Catatan Logbook</button>':''}
18290:       ${canPatrolDetail&&snap.source==='patrol'&&snap.record&&snap.record.id?'<button type="button" class="btn btn-sm" id="btn-open-current-source"><i class="ph-bold ph-list-checks"></i> Buka Detail Patrol</button>':''}
18291:       <button type="button" class="btn btn-primary" id="btn-open-machine-full-detail"><i class="ph-bold ph-gear-six"></i> Lihat Detail Mesin</button>
18292:     </div>`;
18293:   $('#modal-bg').classList.add('active');
18294:   $('#btn-close-modal')?.addEventListener('click',closeModal);
18295:   $('#btn-open-machine-full-detail')?.addEventListener('click',()=>openMachineDetail(machine.kode||machine.nama));
18296:   $('#btn-open-current-source')?.addEventListener('click',()=>{
18297:     if(snap.source==='logbook'){
18298:       if(!canAccessLogbookDetail_()){ showAccessDenied(); return; }
18299:       if(snap.record&&snap.record['ID']) openDetail(snap.record['ID']);
18300:     }else if(snap.source==='patrol'){
18301:       if(!canAccessView_('patrol')){ showAccessDenied(); return; }
18302:       if(snap.record&&snap.record.id) openPatrolSessionDetail(snap.record.id);
18303:     }
18304:   });
18305: }
18306: 
18307: function openMachineDetail(kode){
18308:   const m = findMachineByIdentity_(kode);
~~~

### Around L25107
~~~text
25092:     if(typeof escapeHtml === 'function') return escapeHtml(String(s==null?'':s));
25093:     return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
25094:   }
25095:   function cleanText(t){ return String(t||'').replace(/\s+/g,' ').trim(); }
25096:   function stripLeadingIcon(t){ return cleanText(t).replace(/^[^\p{L}\p{N}]+/u,'').trim(); }
25097: 
25098:   /* ---------- 1) Siapa pengguna utama per grup menu (heuristik dari label grup) ---------- */
25099:   const GROUP_USER_MAP = {
25100:     'Log Book': 'Teknisi & Supervisor Maintenance yang mencatat pekerjaan harian',
25101:     'Report': 'Supervisor/Engineer yang menyusun laporan resmi (IPAL, RCA, Proyek)',
25102:     'Analitik': 'Engineer/Manager Maintenance untuk menganalisa performa & tren',
25103:     'People Intelligence': 'Tim HR/People Development & Supervisor untuk menilai kompetensi personil',
25104:     'Setting': 'Administrator/IT yang mengelola konfigurasi & master data aplikasi'
25105:   };
25106:   const VIEW_USER_OVERRIDE = {
25107:     dashboard:'Semua staf shift, untuk memantau status mesin secara real-time',
25108:     wiki:'Seluruh pengguna aplikasi, untuk menelusuri riwayat mesin/personil/sparepart',
25109:     'knowledge-graph':'Engineer/Manager, untuk melihat keterkaitan antar data maintenance',
25110:     'expert-finder':'Supervisor, untuk menentukan personil paling tepat menangani suatu masalah',
25111:     database:'Admin/Engineer, untuk mengelola master data mesin',
25112:     tema:'Seluruh pengguna, untuk menyesuaikan tampilan aplikasi'
25113:   };
25114: 
25115:   /* ---------- 2) Breadcrumb: Menu → Submenu → Halaman (dibaca langsung dari DOM sidebar) ---------- */
25116:   function buildBreadcrumb(view){
25117:     const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
25118:     const pageLabel = (typeof copilotViewLabel==='function') ? copilotViewLabel(view) : view;
25119:     if(!btn) return { crumbs:['Aplikasi', pageLabel], groupLabel:null };
25120:     const label = stripLeadingIcon(btn.textContent).replace(/\d+$/,'').trim() || pageLabel;
25121:     const submenu = btn.closest('.nav-submenu');
25122:     let groupLabel = null;
25123:     if(submenu){
25124:       const parentBtn = document.querySelector(`.nav-parent-btn[data-group="${submenu.dataset.submenu}"]`);
25125:       if(parentBtn) groupLabel = stripLeadingIcon(parentBtn.textContent);
25126:     }
25127:     const crumbs = ['Aplikasi'];
25128:     if(groupLabel) crumbs.push(groupLabel);
25129:     crumbs.push(label);
25130:     return { crumbs, groupLabel };
25131:   }
25132: 
25133:   function resolveMainUser(view, groupLabel){
25134:     if(VIEW_USER_OVERRIDE[view]) return VIEW_USER_OVERRIDE[view];
25135:     if(groupLabel && GROUP_USER_MAP[groupLabel]) return GROUP_USER_MAP[groupLabel];
25136:     return 'Tim Maintenance/Teknik terkait';
~~~

### Around L28401
~~~text
28386:       const rows = (typeof ENTRIES !== 'undefined' && Array.isArray(ENTRIES)) ? ENTRIES : [];
28387:       return typeof sotEntries === 'function' ? sotEntries(rows) : rows;
28388:     }catch(e){ return []; }
28389:   }
28390: 
28391:   function v4Text(obj){
28392:     if(!obj || typeof obj !== 'object') return '';
28393:     return Object.values(obj).filter(v=>v!=null && typeof v!=='object').join(' ').toLowerCase();
28394:   }
28395: 
28396:   function v4MachineName(e){
28397:     return String((e && (e['Nama Mesin'] || e['Kode Mesin'] || e['Mesin'])) || '-').trim() || '-';
28398:   }
28399: 
28400:   function v4Status(e){
28401:     return String((e && (e['Status'] || e['Status Pekerjaan'] || e['Status Mesin'])) || '').trim();
28402:   }
28403: 
28404:   function v4IsDone(e){
28405:     const s=v4Status(e).toLowerCase();
28406:     return ['selesai','done','completed','closed','close'].some(x=>s===x || s.includes(x));
28407:   }
28408: 
28409:   function v4IsCritical(e){
28410:     const t=v4Text(e);
28411:     return /emergency|breakdown|critical|kritis|stop mesin|downtime/.test(t) && !v4IsDone(e);
28412:   }
28413: 
28414:   function v4DateValue(e){
28415:     const raw=(e && (e['Timestamp'] || e['UpdatedAt'] || e['Tanggal'] || e['Tanggal Laporan'])) || '';
28416:     const d=new Date(raw);
28417:     return Number.isFinite(d.getTime()) ? d.getTime() : 0;
28418:   }
28419: 
28420:   function v4FmtDate(ms){
28421:     if(!ms) return '-';
28422:     try{return new Date(ms).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});}catch(e){return new Date(ms).toLocaleString();}
28423:   }
28424: 
28425:   function v4Escape(value){
28426:     if(typeof escapeHtml === 'function') return escapeHtml(String(value==null?'':value));
28427:     return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
28428:   }
28429: 
28430:   function v4Describe(e){
~~~

## filter-status — 11 hit(s)
### Around L3741
~~~text
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
~~~

### Around L3807
~~~text
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
~~~

### Around L3818
~~~text
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
03847:           <div class="sub" style="margin-bottom:10px;">Pilih mesin dari dropdown, lalu lanjutkan ke checklist.</div>
~~~

### Around L4123
~~~text
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
~~~

### Around L9183
~~~text
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
~~~

### Around L9196
~~~text
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
09223:   if (statusA === '' && statusB !== '') return 1;
09224:   if (statusA !== '' && statusB === '') return -1;
09225: 
~~~

### Around L9245
~~~text
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
~~~

### Around L27080
~~~text
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
~~~

### Around L27091
~~~text
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
27120:    fungsi/variabel modul lain. Menyimpan data lewat action
~~~

### Around L27785
~~~text
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
~~~

### Around L27792
~~~text
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
~~~

## filter-group — 7 hit(s)
### Around L4125
~~~text
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
~~~

### Around L5301
~~~text
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
~~~

### Around L9183
~~~text
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
~~~

### Around L9198
~~~text
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
09223:   if (statusA === '' && statusB !== '') return 1;
09224:   if (statusA !== '' && statusB === '') return -1;
09225: 
09226:   // Jika kedua status sama-sama kosong atau sama-sama memiliki status, 
09227:   // urutkan berdasarkan Timestamp Input (terbaru di paling atas)
~~~

### Around L9247
~~~text
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
~~~

### Around L18990
~~~text
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
~~~

### Around L19014
~~~text
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
~~~

## patrol-machine-select — 5 hit(s)
### Around L3849
~~~text
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
03847:           <div class="sub" style="margin-bottom:10px;">Pilih mesin dari dropdown, lalu lanjutkan ke checklist.</div>
03848:           <div class="field" style="margin-bottom:10px;">
03849:             <label for="patrol-machine-select">Mesin</label>
03850:             <select id="patrol-machine-select"><option value="">Pilih mesin...</option></select>
03851:           </div>
03852:           <button type="button" class="btn btn-primary" id="btn-patrol-select-machine"><i class="ph-bold ph-arrow-right"></i> Mulai Checklist</button>
03853:         </div>
03854: 
03855:         <div class="card" id="patrol-step-2" style="display:none;margin-top:16px;">
03856:           <div style="margin-bottom:14px;">
03857:             <button type="button" class="btn btn-ghost" id="btn-patrol-back-1"><i class="ph-bold ph-arrow-left"></i> Ganti Mesin</button>
03858:           </div>
03859:           <div class="section-title"><i class="ph-bold ph-number-circle-two"></i> Checklist Kondisi — <span id="patrol-step2-mesin"></span></div>
03860: 
03861:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-info"></i> Informasi Umum Patrol</div>
03862:           <div class="grid2">
03863:             <div class="field"><label>Tanggal</label><input type="date" id="patrol-tanggal" required></div>
03864:             <div class="field"><label>Waktu Patrol</label><input type="time" id="patrol-waktu" required></div>
03865:           </div>
03866:           <div class="grid3">
03867:             <div class="field"><label>Shift</label>
03868:               <select id="patrol-shift" required><option>Shift 1</option><option>Shift 2</option><option>Shift 3</option><option>Non-Shift</option></select>
03869:             </div>
03870:             <div class="field"><label>Grouping Team</label>
03871:               <select id="patrol-grouping-team" required>
03872:                 <option>A</option><option>B</option><option>C</option><option>D</option><option>Non-Shift</option>
03873:               </select>
03874:             </div>
03875:             <div class="field"><label>Nama Pelapor / Petugas Patrol</label>
03876:               <select id="patrol-nama-pelapor" required>
03877:                 <option value="">Pilih personil...</option>
03878:               </select>
~~~

### Around L3850
~~~text
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
03847:           <div class="sub" style="margin-bottom:10px;">Pilih mesin dari dropdown, lalu lanjutkan ke checklist.</div>
03848:           <div class="field" style="margin-bottom:10px;">
03849:             <label for="patrol-machine-select">Mesin</label>
03850:             <select id="patrol-machine-select"><option value="">Pilih mesin...</option></select>
03851:           </div>
03852:           <button type="button" class="btn btn-primary" id="btn-patrol-select-machine"><i class="ph-bold ph-arrow-right"></i> Mulai Checklist</button>
03853:         </div>
03854: 
03855:         <div class="card" id="patrol-step-2" style="display:none;margin-top:16px;">
03856:           <div style="margin-bottom:14px;">
03857:             <button type="button" class="btn btn-ghost" id="btn-patrol-back-1"><i class="ph-bold ph-arrow-left"></i> Ganti Mesin</button>
03858:           </div>
03859:           <div class="section-title"><i class="ph-bold ph-number-circle-two"></i> Checklist Kondisi — <span id="patrol-step2-mesin"></span></div>
03860: 
03861:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-info"></i> Informasi Umum Patrol</div>
03862:           <div class="grid2">
03863:             <div class="field"><label>Tanggal</label><input type="date" id="patrol-tanggal" required></div>
03864:             <div class="field"><label>Waktu Patrol</label><input type="time" id="patrol-waktu" required></div>
03865:           </div>
03866:           <div class="grid3">
03867:             <div class="field"><label>Shift</label>
03868:               <select id="patrol-shift" required><option>Shift 1</option><option>Shift 2</option><option>Shift 3</option><option>Non-Shift</option></select>
03869:             </div>
03870:             <div class="field"><label>Grouping Team</label>
03871:               <select id="patrol-grouping-team" required>
03872:                 <option>A</option><option>B</option><option>C</option><option>D</option><option>Non-Shift</option>
03873:               </select>
03874:             </div>
03875:             <div class="field"><label>Nama Pelapor / Petugas Patrol</label>
03876:               <select id="patrol-nama-pelapor" required>
03877:                 <option value="">Pilih personil...</option>
03878:               </select>
03879:             </div>
~~~

### Around L19463
~~~text
19448:   return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
19449: }
19450: function Utilities_nowTimeStr(){
19451:   const d = new Date();
19452:   return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
19453: }
19454: 
19455: function patrolResetWizard(){
19456:   PATROL_STATE = { id:null, kodeMesin:'', namaMesin:'', checklist:{}, findings:[] };
19457:   PATROL_FINDING_FILES = [];
19458:   $('#patrol-step-1').style.display = '';
19459:   $('#patrol-step-2').style.display = 'none';
19460:   $('#patrol-step-3').style.display = 'none';
19461:   $('#patrol-temuan-form-holder').style.display = 'none';
19462:   $$('.machine-chip[data-ada-temuan]').forEach(b=>b.classList.remove('active'));
19463:   const machineSelect = $('#patrol-machine-select'); if(machineSelect) machineSelect.value = '';
19464:   // Reset field info umum patrol ke default (tanggal & waktu saat ini), persis seperti
19465:   // form Input Logbook, supaya siap dipakai untuk sesi patrol berikutnya.
19466:   $('#patrol-tanggal').value = Utilities_todayStr();
19467:   $('#patrol-waktu').value = Utilities_nowTimeStr();
19468:   $('#patrol-shift').selectedIndex = 0;
19469:   $('#patrol-grouping-team').selectedIndex = 0;
19470:   $('#patrol-nama-pelapor').value = '';
19471:   renderPatrolMachineGrid();
19472: }
19473: 
19474: function renderPatrolMachineGrid(){
19475:   const select = $('#patrol-machine-select');
19476:   if(!select) return;
19477:   const current=select.value;
19478:   const list=MACHINES.slice().sort((a,b)=>String(a['Nama Mesin']||'').localeCompare(String(b['Nama Mesin']||''),'id'));
19479:   select.innerHTML='<option value="">Pilih mesin...</option>'+list.map(m=>{
19480:     const kode=String(m['Kode Mesin']||''),nama=String(m['Nama Mesin']||'');
19481:     return `<option value="${escapeHtml(kode||nama)}" data-kode="${escapeHtml(kode)}" data-nama="${escapeHtml(nama)}">${escapeHtml(nama||kode||'-')}${kode?' — '+escapeHtml(kode):''}</option>`;
19482:   }).join('');
19483:   if(current && Array.from(select.options).some(o=>o.value===current)) select.value=current;
19484:   const btn=$('#btn-patrol-select-machine'); if(btn) btn.disabled=!list.length;
19485: }
19486: 
19487: function patrolSelectMachine(kode, nama){
19488:   PATROL_STATE.kodeMesin = kode;
19489:   PATROL_STATE.namaMesin = nama;
19490:   PATROL_STATE.checklist = {};
19491:   $('#patrol-step-1').style.display = 'none';
19492:   $('#patrol-step-2').style.display = '';
~~~

### Around L19475
~~~text
19460:   $('#patrol-step-3').style.display = 'none';
19461:   $('#patrol-temuan-form-holder').style.display = 'none';
19462:   $$('.machine-chip[data-ada-temuan]').forEach(b=>b.classList.remove('active'));
19463:   const machineSelect = $('#patrol-machine-select'); if(machineSelect) machineSelect.value = '';
19464:   // Reset field info umum patrol ke default (tanggal & waktu saat ini), persis seperti
19465:   // form Input Logbook, supaya siap dipakai untuk sesi patrol berikutnya.
19466:   $('#patrol-tanggal').value = Utilities_todayStr();
19467:   $('#patrol-waktu').value = Utilities_nowTimeStr();
19468:   $('#patrol-shift').selectedIndex = 0;
19469:   $('#patrol-grouping-team').selectedIndex = 0;
19470:   $('#patrol-nama-pelapor').value = '';
19471:   renderPatrolMachineGrid();
19472: }
19473: 
19474: function renderPatrolMachineGrid(){
19475:   const select = $('#patrol-machine-select');
19476:   if(!select) return;
19477:   const current=select.value;
19478:   const list=MACHINES.slice().sort((a,b)=>String(a['Nama Mesin']||'').localeCompare(String(b['Nama Mesin']||''),'id'));
19479:   select.innerHTML='<option value="">Pilih mesin...</option>'+list.map(m=>{
19480:     const kode=String(m['Kode Mesin']||''),nama=String(m['Nama Mesin']||'');
19481:     return `<option value="${escapeHtml(kode||nama)}" data-kode="${escapeHtml(kode)}" data-nama="${escapeHtml(nama)}">${escapeHtml(nama||kode||'-')}${kode?' — '+escapeHtml(kode):''}</option>`;
19482:   }).join('');
19483:   if(current && Array.from(select.options).some(o=>o.value===current)) select.value=current;
19484:   const btn=$('#btn-patrol-select-machine'); if(btn) btn.disabled=!list.length;
19485: }
19486: 
19487: function patrolSelectMachine(kode, nama){
19488:   PATROL_STATE.kodeMesin = kode;
19489:   PATROL_STATE.namaMesin = nama;
19490:   PATROL_STATE.checklist = {};
19491:   $('#patrol-step-1').style.display = 'none';
19492:   $('#patrol-step-2').style.display = '';
19493:   $('#patrol-step-3').style.display = 'none';
19494:   $('#patrol-step2-mesin').textContent = nama + ' (' + (kode||'-') + ')';
19495:   renderPatrolChecklist();
19496:   $('#patrol-step-2').scrollIntoView({behavior:'smooth', block:'start'});
19497: }
19498: 
19499: function renderPatrolChecklist(){
19500:   const holder = $('#patrol-checklist-groups');
19501:   // Gabungkan checklist generik (PATROL_CHECKLIST_DEF) dengan item spesifik mesin dari
19502:   // PATROL_TEMPLATE (sheet Patrol_Checklist_Template). Item spesifik mesin SELALU
19503:   // ditampilkan lebih dulu (paling atas), dipisah dengan pembatas dari kategori
19504:   // general checking di bawahnya, supaya petugas patrol langsung melihat poin yang
~~~

### Around L20082
~~~text
20067:     { label:'Closed', value: closedCount, icon:'ph-check-circle' },
20068:     { label:'Rata-rata Score', value: avgScore + '/100', icon:'ph-gauge' }
20069:   ];
20070:   $('#patrol-stat-cards').innerHTML = cards.map(c=>`
20071:     <div class="card" style="text-align:center;">
20072:       <div style="font-size:22px;"><i class="ph-bold ${c.icon}"></i></div>
20073:       <div style="font-size:24px;font-weight:800;margin-top:6px;">${c.value}</div>
20074:       <div class="sub">${c.label}</div>
20075:     </div>`).join('');
20076: }
20077: 
20078: /* ---- Entry point (dipanggil dari switchToView) ---- */
20079: function renderPatrolView(){
20080:   patrolResetWizard();
20081:   loadPmReports();
20082:   const select=$('#patrol-machine-select'), startBtn=$('#btn-patrol-select-machine');
20083:   if(startBtn && !startBtn._bound){
20084:     startBtn._bound=true;
20085:     startBtn.addEventListener('click',()=>{
20086:       const opt=select && select.options[select.selectedIndex];
20087:       if(!opt || !select.value){ toast('Pilih mesin terlebih dahulu.', true); return; }
20088:       patrolSelectMachine(opt.dataset.kode||select.value,opt.dataset.nama||opt.textContent||select.value);
20089:     });
20090:   }
20091:   syncPmReportsFromBackend().then(()=>{
20092:     if(PATROL_ACTIVE_TAB==='temuan') renderPatrolTemuanList();
20093:     if(PATROL_ACTIVE_TAB==='riwayat') renderPatrolRiwayatList();
20094:     if(PATROL_ACTIVE_TAB==='statistik') renderPatrolStatistik();
20095:   });
20096: }
20097: 
20098: /* ================================================================
20099:    REPORT HUB — Riwayat Laporan (WI Generator + Laporan Proyek)
20100:    Semua tersimpan ke sheet baru "Reports" lewat Web App yang sama
20101:    (action: generalReports / saveGeneralReport / deleteGeneralReport),
20102:    dengan cache lokal supaya tetap responsif tanpa koneksi.
20103:    ================================================================ */
20104: let GENERAL_REPORTS = [];
20105: 
20106: function loadGrReportsLocal(){
20107:   try{ return JSON.parse(localStorage.getItem(LS_GR_KEY) || '[]'); }catch(e){ return []; }
20108: }
20109: function saveGrReportsLocal(list){
20110:   localStorage.setItem(LS_GR_KEY, JSON.stringify(list));
20111:   GENERAL_REPORTS = list;
~~~

## User Management — 5 hit(s)
### Around L5392
~~~text
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
~~~

### Around L5416
~~~text
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
~~~

### Around L6694
~~~text
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
~~~

### Around L6707
~~~text
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
06734:       <div class="sub" style="margin-bottom:12px;">Untuk data logbook hasil migrasi/export OneNote yang salah input:
06735:         <b>(1)</b> Tanggal kosong atau tanggal masa depan → dipindah ke tahun <b>2025</b> (bulan/tanggal dipertahankan kalau ada).
06736:         <b>(2)</b> Baris yang kolom "Deskripsi Masalah"-nya hanya berisi "Preventive"/"PM" dipindahkan ke kolom "Jenis Pekerjaan".
~~~

### Around L28212
~~~text
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
~~~

## Role Access — 46 hit(s)
### Around L2935
~~~text
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
~~~

### Around L2941
~~~text
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
~~~

### Around L3038
~~~text
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
~~~

### Around L5393
~~~text
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
~~~

### Around L5422
~~~text
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
~~~

### Around L6191
~~~text
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
~~~

### Around L6375
~~~text
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
~~~

### Around L6377
~~~text
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
~~~

### Around L6413
~~~text
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
~~~

### Around L6486
~~~text
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
~~~

### Around L6500
~~~text
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
06526:     // (default: izinkan, kecuali memang tidak ada satu pun menu di dalamnya
06527:     // yang diizinkan), grup sekarang HANYA disembunyikan berdasarkan
06528:     // visibilitas submenu di dalamnya -- permission 'group.<key>' tidak lagi
06529:     // dipakai sebagai gate tambahan yang bisa mengunci seluruh grup secara
~~~

### Around L6505
~~~text
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
~~~

### Around L6515
~~~text
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

### Around L6517
~~~text
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
06545:     const visibleChild = $$('.nav-btn[data-view]', group).some(b => b.style.display !== 'none');
06546:     group.style.display = visibleChild ? '' : 'none';
~~~

### Around L6552
~~~text
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
~~~

### Around L6694
~~~text
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
~~~

### Around L6755
~~~text
06740:     </div>
06741:   `;
06742:   $('#btn-add-user').addEventListener('click', handleAddUser_);
06743:   renderRbacUserTable();
06744:   loadRbacUserActivity(true);
06745:   const btnPreviewDataFix = $('#btn-preview-data-fix');
06746:   if(btnPreviewDataFix) btnPreviewDataFix.addEventListener('click', previewLogbookDataFix);
06747: }
06748: 
06749: function renderRoleAccessSection(){
06750:   const holder=$('#rbac-role-section');
06751:   if(!holder) return;
06752:   if(!isSettingAuthed()){ holder.innerHTML=''; return; }
06753:   holder.innerHTML=`
06754:     <div class="card" style="margin-bottom:18px;">
06755:       <div class="section-title"><i class="ph-bold ph-shield-check"></i> Role Access Management <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
06756:       <div class="sub">Pilih satu role, lalu buka hanya kelompok menu yang ingin diatur. Superadmin tetap memiliki full access. Pengaturan akses utama dan Tampilan Sederhana disimpan secara atomik.</div>
06757:       <div id="rbac-permission-table"></div>
06758:       <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px;">
06759:         <button class="btn btn-sm btn-primary" id="btn-save-permissions"><i class="ph-bold ph-floppy-disk"></i> Simpan Role Access</button>
06760:         <span id="rp-status" style="font-size:12.5px;color:var(--text-dim);"></span>
06761:       </div>
06762:     </div>
06763:   `;
06764:   renderRbacPermissionTable();
06765: }
06766: 
06767: let RBAC_ACTIVITY_ROWS=[];
06768: let RBAC_ACTIVITY_OFFSET=0;
06769: let RBAC_ACTIVITY_DONE=false;
06770: const RBAC_ACTIVITY_PAGE_SIZE=200;
06771: let RBAC_ACTIVITY_FILTER={user:'',type:'all',q:''};
06772: 
06773: function auditActionLabel_(action){
06774:   const map={
06775:     login:'Login',login_failed:'Login gagal',logout:'Logout',
06776:     createUser:'Tambah user',updateUser:'Ubah user/role',resetPassword:'Reset password',
06777:     setUserActive:'Ubah status user',deleteUser:'Hapus user',
06778:     savePermissions:'Ubah role access',saveLcPermissions:'Ubah Tampilan Sederhana',saveRoleAccessConfig:'Ubah konfigurasi akses',
06779:     saveThemePref:'Ubah tema',saveStylePref:'Ubah style',
06780:     addEntry:'Tambah Logbook',updateStatus:'Ubah Logbook',deleteEntry:'Hapus Logbook'
06781:   };
06782:   if(map[action]) return map[action];
06783:   return String(action||'Aktivitas').replace(/^v4\./,'OMODOS 4 · ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ');
06784: }
~~~

### Around L6759
~~~text
06744:   loadRbacUserActivity(true);
06745:   const btnPreviewDataFix = $('#btn-preview-data-fix');
06746:   if(btnPreviewDataFix) btnPreviewDataFix.addEventListener('click', previewLogbookDataFix);
06747: }
06748: 
06749: function renderRoleAccessSection(){
06750:   const holder=$('#rbac-role-section');
06751:   if(!holder) return;
06752:   if(!isSettingAuthed()){ holder.innerHTML=''; return; }
06753:   holder.innerHTML=`
06754:     <div class="card" style="margin-bottom:18px;">
06755:       <div class="section-title"><i class="ph-bold ph-shield-check"></i> Role Access Management <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
06756:       <div class="sub">Pilih satu role, lalu buka hanya kelompok menu yang ingin diatur. Superadmin tetap memiliki full access. Pengaturan akses utama dan Tampilan Sederhana disimpan secara atomik.</div>
06757:       <div id="rbac-permission-table"></div>
06758:       <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:12px;">
06759:         <button class="btn btn-sm btn-primary" id="btn-save-permissions"><i class="ph-bold ph-floppy-disk"></i> Simpan Role Access</button>
06760:         <span id="rp-status" style="font-size:12.5px;color:var(--text-dim);"></span>
06761:       </div>
06762:     </div>
06763:   `;
06764:   renderRbacPermissionTable();
06765: }
06766: 
06767: let RBAC_ACTIVITY_ROWS=[];
06768: let RBAC_ACTIVITY_OFFSET=0;
06769: let RBAC_ACTIVITY_DONE=false;
06770: const RBAC_ACTIVITY_PAGE_SIZE=200;
06771: let RBAC_ACTIVITY_FILTER={user:'',type:'all',q:''};
06772: 
06773: function auditActionLabel_(action){
06774:   const map={
06775:     login:'Login',login_failed:'Login gagal',logout:'Logout',
06776:     createUser:'Tambah user',updateUser:'Ubah user/role',resetPassword:'Reset password',
06777:     setUserActive:'Ubah status user',deleteUser:'Hapus user',
06778:     savePermissions:'Ubah role access',saveLcPermissions:'Ubah Tampilan Sederhana',saveRoleAccessConfig:'Ubah konfigurasi akses',
06779:     saveThemePref:'Ubah tema',saveStylePref:'Ubah style',
06780:     addEntry:'Tambah Logbook',updateStatus:'Ubah Logbook',deleteEntry:'Hapus Logbook'
06781:   };
06782:   if(map[action]) return map[action];
06783:   return String(action||'Aktivitas').replace(/^v4\./,'OMODOS 4 · ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ');
06784: }
06785: function auditActivityType_(row){
06786:   const a=String(row.Action||'').toLowerCase(), r=String(row.Result||'').toLowerCase();
06787:   if(r.includes('fail')||a==='login_failed') return 'failed';
06788:   if(a==='login') return 'login';
~~~

### Around L6778
~~~text
06763:   `;
06764:   renderRbacPermissionTable();
06765: }
06766: 
06767: let RBAC_ACTIVITY_ROWS=[];
06768: let RBAC_ACTIVITY_OFFSET=0;
06769: let RBAC_ACTIVITY_DONE=false;
06770: const RBAC_ACTIVITY_PAGE_SIZE=200;
06771: let RBAC_ACTIVITY_FILTER={user:'',type:'all',q:''};
06772: 
06773: function auditActionLabel_(action){
06774:   const map={
06775:     login:'Login',login_failed:'Login gagal',logout:'Logout',
06776:     createUser:'Tambah user',updateUser:'Ubah user/role',resetPassword:'Reset password',
06777:     setUserActive:'Ubah status user',deleteUser:'Hapus user',
06778:     savePermissions:'Ubah role access',saveLcPermissions:'Ubah Tampilan Sederhana',saveRoleAccessConfig:'Ubah konfigurasi akses',
06779:     saveThemePref:'Ubah tema',saveStylePref:'Ubah style',
06780:     addEntry:'Tambah Logbook',updateStatus:'Ubah Logbook',deleteEntry:'Hapus Logbook'
06781:   };
06782:   if(map[action]) return map[action];
06783:   return String(action||'Aktivitas').replace(/^v4\./,'OMODOS 4 · ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ');
06784: }
06785: function auditActivityType_(row){
06786:   const a=String(row.Action||'').toLowerCase(), r=String(row.Result||'').toLowerCase();
06787:   if(r.includes('fail')||a==='login_failed') return 'failed';
06788:   if(a==='login') return 'login';
06789:   if(a==='logout') return 'logout';
06790:   return 'change';
06791: }
06792: function auditTimestamp_(v){
06793:   const d=new Date(v); return isNaN(d)?escapeHtml(String(v||'-')):escapeHtml(d.toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'medium'}));
06794: }
06795: function auditDetailText_(row){
06796:   const raw=String(row.AfterJSON||row.BeforeJSON||'').trim();
06797:   if(!raw) return '';
06798:   try{ return JSON.stringify(JSON.parse(raw),null,2); }catch(e){ return raw; }
06799: }
06800: function renderRbacUserActivityPanel_(){
06801:   const holder=$('#rbac-user-activity'); if(!holder) return;
06802:   const users=[...new Set(RBAC_ACTIVITY_ROWS.map(r=>String(r.Actor||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
06803:   let rows=RBAC_ACTIVITY_ROWS.slice();
06804:   if(RBAC_ACTIVITY_FILTER.user) rows=rows.filter(r=>String(r.Actor||'')===RBAC_ACTIVITY_FILTER.user);
06805:   if(RBAC_ACTIVITY_FILTER.type!=='all') rows=rows.filter(r=>auditActivityType_(r)===RBAC_ACTIVITY_FILTER.type);
06806:   if(RBAC_ACTIVITY_FILTER.q){
06807:     const q=RBAC_ACTIVITY_FILTER.q.toLowerCase();
~~~

### Around L7150
~~~text
07135: }
07136: async function renderRbacPermissionTable(){
07137:   const holder=$('#rbac-permission-table'); if(!holder) return;
07138:   holder.innerHTML='<div style="color:var(--text-dim);font-size:12.5px;">Memuat konfigurasi role...</div>';
07139:   try{
07140:     const [featuresRaw,permissions,lcPermissions]=await Promise.all([apiGet('features'),apiGet('permissions'),apiGet('lcPermissions')]);
07141:     FEATURE_REGISTRY=mergeFeatureRegistry(featuresRaw);
07142:     PERMISSIONS=permissions||{};
07143:     window.LC_PERMISSIONS=lcPermissions||{};
07144:     RBAC_ROLE_FEATURES=FEATURE_REGISTRY.slice().sort((a,b)=>String(a.Group||'').localeCompare(String(b.Group||''))||String(a.Label||'').localeCompare(String(b.Label||'')));
07145:     RBAC_ROLE_PERMISSIONS_DRAFT=cloneRoleMatrix_(PERMISSIONS,RBAC_ROLE_FEATURES);
07146:     RBAC_LC_PERMISSIONS_DRAFT=cloneRoleMatrix_(window.LC_PERMISSIONS,RBAC_ROLE_FEATURES);
07147:     renderRbacRoleShell_();
07148:     $('#btn-save-permissions').onclick=handleSavePermissions_;
07149:   }catch(err){
07150:     holder.innerHTML=`<div style="color:var(--red);font-size:12.5px;">Gagal memuat Role Access: ${escapeHtml(err.message||String(err))}</div>`;
07151:   }
07152: }
07153: 
07154: async function handleSavePermissions_(){
07155:   const statusEl = $('#rp-status');
07156:   const saveBtn = $('#btn-save-permissions');
07157:   const updates = JSON.parse(JSON.stringify(RBAC_ROLE_PERMISSIONS_DRAFT||{}));
07158:   const lcUpdates = JSON.parse(JSON.stringify(RBAC_LC_PERMISSIONS_DRAFT||{}));
07159:   if(!Object.keys(updates).length){ toast('Tidak ada konfigurasi akses yang dapat disimpan.', true); return false; }
07160:   if(!WEB_APP_URL || new URL(WEB_APP_URL, location.origin).origin !== location.origin){
07161:     toast('URL backend harus menggunakan domain aplikasi yang sama.', true);
07162:     return false;
07163:   }
07164:   if(!SESSION_TOKEN && !(SETTING_AUTH_OK && SETTING_SESSION_TOKEN)){
07165:     toast('Sesi login tidak tersedia. Login ulang lalu buka kembali Role Access Management.', true);
07166:     return false;
07167:   }
07168: 
07169:   const matrixDiff = (expected, actual)=>{
07170:     const diff = [];
07171:     Object.keys(expected || {}).forEach(key=>{
07172:       ['Supervisor','Technician'].forEach(role=>{
07173:         const exp = !!(expected[key] && expected[key][role]);
07174:         const act = !!(actual && actual[key] && actual[key][role]);
07175:         if(exp !== act) diff.push(`${key} [${role}] dikirim=${exp}, diterima=${act}`);
07176:       });
07177:     });
07178:     return diff;
07179:   };
~~~

## user-management — 0 hit(s)
- No match.

## role-access — 0 hit(s)
- No match.

## Bantuan — 3 hit(s)
### Around L12109
~~~text
12094:   const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
12095:   const url = URL.createObjectURL(blob);
12096:   const a = document.createElement('a');
12097:   a.href = url;
12098:   a.download = `RCA_${String(machineName).replace(/[^a-z0-9]+/gi,'_')}_${new Date().toISOString().slice(0,10)}.doc`;
12099:   document.body.appendChild(a); a.click(); document.body.removeChild(a);
12100:   setTimeout(()=> URL.revokeObjectURL(url), 4000);
12101: }
12102: 
12103: /* =========================================================
12104:    INPUT REPORT (kategori: IPAL, RCA, dll)
12105:    ========================================================= */
12106: const REPORT_CATEGORIES = [
12107:   { key:'ipal',           icon:'💧', title:'Laporan IPAL', sub:'Catat pemeriksaan dan bahan kimia pengolahan air limbah.', enabled:true },
12108:   { key:'rca',            icon:'▦',  title:'RCA', sub:'Cari akar penyebab masalah dan catat tindakan perbaikan.', enabled:true },
12109:   { key:'ai',             icon:'✦',  title:'Analisa AI', sub:'Minta bantuan AI membaca data dan memberi saran. Tetap periksa hasilnya.', enabled:true },
12110:   { key:'report-hub',     icon:'🗂', title:'Riwayat Laporan', sub:'Lihat laporan yang sudah pernah disimpan.', enabled:true },
12111: ];
12112: let IPAL_CURRENT = null; // draft object sedang diedit
12113: 
12114: function renderReportView(){
12115:   $('#btn-report-back-cat').style.display = 'none';
12116:   $('#ipal-form-wrap').style.display = 'none';
12117:   $('#ipal-form-wrap').innerHTML = '';
12118:   const grid = $('#report-cat-grid');
12119:   grid.style.display = 'grid';
12120:   grid.innerHTML = REPORT_CATEGORIES.map(c => `
12121:     <div class="report-cat-card" data-cat="${c.key}">
12122:       <div class="report-cat-icon">${c.icon}</div>
12123:       <div class="report-cat-title">${escapeHtml(c.title)}${c.key==='report-hub' ? ' <span class="count" id="cnt-report-hub">0</span>' : ''}</div>
12124:       <div class="report-cat-sub">${escapeHtml(c.sub)}</div>
12125:     </div>
12126:   `).join('');
12127:   $$('.report-cat-card[data-cat]').forEach(card=>{
12128:     card.addEventListener('click', ()=>{
12129:       const key = card.dataset.cat;
12130:       const cat = REPORT_CATEGORIES.find(c=>c.key===key);
12131:       if(!cat || !cat.enabled) return;
12132:       if(key === 'rca'){ goToView('rca'); return; }
12133:       if(key === 'ipal'){ openIpalCategory(); return; }
12134:       if(key === 'ai'){ goToView('ai'); return; }
12135:       if(key === 'report-hub'){ goToView('report-hub'); return; }
12136:     });
12137:   });
12138: }
~~~

### Around L24149
~~~text
24134:           <div class="pi-gap-row"><span>Soft Skill</span><b>${r.softScore!=null? r.softScore+'%':'-'}</b></div>
24135:           <div class="pi-gap-row"><span>Kaizen Selesai (PIC)</span><b>${r.kaizen.completed}</b></div>
24136:           <div class="pi-gap-row"><span>Meeting Action Closed (PIC)</span><b>${r.meeting.closed} / ${r.meeting.total}</b></div>
24137:         </div>
24138:       </div>
24139:     </div>
24140:     <div class="pi-profile-section">
24141:       <h4><i class="ph-bold ph-sparkle"></i> Smart Resume (Ringkasan Otomatis)</h4>
24142:       <p style="line-height:1.6;">${narrative}</p>
24143:     </div>
24144:     <div class="pi-profile-section">
24145:       <h4><i class="ph-bold ph-lightbulb"></i> Rekomendasi</h4>
24146:       <ul style="margin:0;padding-left:18px;line-height:1.7;">
24147:         ${rec.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}
24148:       </ul>
24149:       <div class="sub" style="margin-top:10px;">Rekomendasi dihasilkan 100% lokal dari data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item yang sudah tersimpan di aplikasi ini (tanpa API/LLM eksternal) — gunakan sebagai bantuan pengambilan keputusan, tetap verifikasi di lapangan.</div>
24150:     </div>
24151:   `;
24152:   $('#modal-bg').classList.add('active');
24153:   $('#btn-close-modal').addEventListener('click', closeModal);
24154: }
24155: 
24156: 
24157: function generatePiAiRecommendation(nama, tech, techScore, softScore, itemAvgs){
24158:   const belum = piBelumKompetenList(tech);
24159:   const softEntries = Object.entries(itemAvgs).filter(([,v])=>v!=null);
24160:   const weakSoft = softEntries.filter(([,v])=>v<=3).sort((a,b)=>a[1]-b[1]).map(([k])=>k);
24161:   const strongSoft = softEntries.filter(([,v])=>v>=4).map(([k])=>k);
24162: 
24163:   const strengths = [];
24164:   if(techScore!=null && techScore>=80) strengths.push('Kompetensi teknis kuat (' + techScore + '% unit kompetensi kompeten).');
24165:   if(strongSoft.length) strengths.push('Soft skill unggul pada: ' + strongSoft.join(', ') + '.');
24166:   if(!strengths.length) strengths.push('Belum cukup data untuk menyimpulkan kekuatan utama.');
24167: 
24168:   const gapSummary = [];
24169:   if(belum.length) gapSummary.push('Unit kompetensi teknis yang belum dikuasai: ' + belum.join('; ') + '.');
24170:   if(weakSoft.length) gapSummary.push('Aspek soft skill dengan skor rendah (≤3): ' + weakSoft.join(', ') + '.');
24171:   if(!belum.length && !weakSoft.length) gapSummary.push('Tidak ditemukan gap signifikan berdasarkan data yang tersedia.');
24172: 
24173:   const priorities = [];
24174:   belum.slice(0,3).forEach(b=>priorities.push('Teknis: ' + b));
24175:   weakSoft.slice(0,3).forEach(s=>priorities.push('Soft Skill: ' + s));
24176:   if(!priorities.length) priorities.push('Pertahankan performa saat ini, arahkan ke pengembangan lanjutan (stretch assignment).');
24177: 
24178:   const dev = [];
~~~

### Around L28171
~~~text
28156:     'machine-breakdown':['Riwayat kerusakan mesin','Catat dan lihat jumlah kerusakan mesin per bulan atau tahun.','Pilih tambah atau ubah data.','Isi nilai lalu simpan.'],
28157:     'record-ytd':['Riwayat mesin tahunan','Lihat data mesin dari tahun ke tahun.','Pilih atau tambahkan data tahun.','Periksa nilainya lalu simpan.'],
28158:     'run-hour-comparison':['Bandingkan jam operasi','Bandingkan jam operasi mesin antarperiode.','Pilih atau tambahkan data.','Baca perbedaannya lalu simpan bila ada perubahan.'],
28159:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28160:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28161:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28162:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28163:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28164:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28165:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28166:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28167:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28168:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28169:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28170:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28171:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28172:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28173:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28174:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28175:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28176:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
28177:     'pi-softskill':['Penilaian perilaku','Lihat penilaian kemampuan perilaku personel.','Pilih personel atau periode.','Baca hasil sebagai bahan pengembangan.'],
28178:     'pi-hardskill':['Penilaian teknis','Lihat kemampuan teknis yang sudah dinilai.','Pilih personel atau unit kompetensi.','Baca bagian yang sudah mampu dan yang masih perlu belajar.']
28179:   });
28180: 
28181:   const VIEW_NAMES=Object.freeze({
28182:     dashboard:'Beranda',input:'Catat Logbook',utama:'Lihat Logbook','project-center':'Proyek & Perbaikan',
28183:     patrol:'Pemeriksaan Harian',sparepart:'Suku Cadang','corrective-report':'Laporan Perbaikan',report:'Buat Laporan',
28184:     'energy-utility':'Energi & Air','insights-hub':'Analisis & Pengetahuan','kpi-department':'Target Kerja Departemen',
28185:     'kpi-input':'Isi Target Kerja','machine-breakdown':'Riwayat Kerusakan Mesin','record-ytd':'Riwayat Mesin Tahunan',
28186:     'run-hour-comparison':'Bandingkan Jam Operasi','energy-cost-toe':'Biaya Energi','people-hub':'Orang & Rapat',
28187:     database:'Data Mesin',tema:'Tampilan Aplikasi',setting:'Pengaturan Utama'
28188:   });
28189: 
28190:   const GROUP_NAMES=Object.freeze({
28191:     report:'Laporan & Pekerjaan Lapangan',wtp:'Pengolahan Air',energy:'Energi & Utilitas',
28192:     kpidept:'Target Kerja Departemen',pengaturan:'Pengaturan'
28193:   });
28194: 
28195:   const SIMPLE_TEXT=Object.freeze({
28196:     'Home':'Beranda','Project Center':'Pusat Proyek','Corrective Report':'Laporan Perbaikan',
28197:     'Dashboard KPI Department':'Target Kerja Departemen','Breakdown Mesin (MTD/YTD)':'Riwayat Kerusakan Mesin',
28198:     'Database Mesin':'Data Mesin','Reports & Field Work':'Laporan & Pekerjaan Lapangan','Water Treatment Plant':'Pengolahan Air',
28199:     'Energy & Utility':'Energi & Utilitas','Insights':'Analisis & Pengetahuan','KPI Department':'Target Kerja Departemen',
28200:     'People & Meetings':'Orang & Rapat','Input Report':'Buat Laporan','Dashboard & Analytics':'Ringkasan & Grafik',
~~~

## copilot-help — 0 hit(s)
- No match.

## copilot-panel — 4 hit(s)
### Around L1227
~~~text
01212: }
01213: 
01214: /* ---------------- AI TANYA JAWAB COPILOT ---------------- */
01215: #copilot-fab{
01216:   position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:850;
01217:   width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--red),var(--amber));
01218:   border:none;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;
01219:   font-size:25px;transition:transform var(--trans),box-shadow var(--trans);touch-action:manipulation;
01220: }
01221: #copilot-fab:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(0,0,0,.38);}
01222: #copilot-fab:active{transform:scale(.96);}
01223: .copilot-fab-icon{filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));}
01224: .copilot-fab-dot{display:none!important;}
01225: .copilot-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;display:none;opacity:0;transition:opacity var(--trans);}
01226: .copilot-bg.active{display:block;opacity:1;}
01227: .copilot-panel{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--panel);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform var(--trans);box-shadow:-10px 0 30px rgba(0,0,0,.35);}
01228: .copilot-bg.active .copilot-panel{transform:translateX(0);}
01229: .copilot-head{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 12px;border-bottom:1px solid var(--line);}
01230: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01231: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01232: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01233: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01234: .copilot-msg{display:flex;margin:10px 0;}
01235: .copilot-msg.user{justify-content:flex-end;}
01236: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01237: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01238: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01239: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01240: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01241: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01242: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01243: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01244: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01245: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01246: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01247: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01248: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01249: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
~~~

### Around L1228
~~~text
01213: 
01214: /* ---------------- AI TANYA JAWAB COPILOT ---------------- */
01215: #copilot-fab{
01216:   position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:850;
01217:   width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,var(--red),var(--amber));
01218:   border:none;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;
01219:   font-size:25px;transition:transform var(--trans),box-shadow var(--trans);touch-action:manipulation;
01220: }
01221: #copilot-fab:hover{transform:translateY(-2px) scale(1.04);box-shadow:0 10px 28px rgba(0,0,0,.38);}
01222: #copilot-fab:active{transform:scale(.96);}
01223: .copilot-fab-icon{filter:drop-shadow(0 1px 2px rgba(0,0,0,.35));}
01224: .copilot-fab-dot{display:none!important;}
01225: .copilot-bg{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:900;display:none;opacity:0;transition:opacity var(--trans);}
01226: .copilot-bg.active{display:block;opacity:1;}
01227: .copilot-panel{position:fixed;top:0;right:0;bottom:0;width:min(440px,100vw);background:var(--panel);border-left:1px solid var(--line);display:flex;flex-direction:column;transform:translateX(100%);transition:transform var(--trans);box-shadow:-10px 0 30px rgba(0,0,0,.35);}
01228: .copilot-bg.active .copilot-panel{transform:translateX(0);}
01229: .copilot-head{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 12px;border-bottom:1px solid var(--line);}
01230: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01231: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01232: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01233: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01234: .copilot-msg{display:flex;margin:10px 0;}
01235: .copilot-msg.user{justify-content:flex-end;}
01236: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01237: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01238: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01239: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01240: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01241: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01242: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01243: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01244: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01245: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01246: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01247: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01248: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01249: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
~~~

### Around L1284
~~~text
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
~~~

### Around L5865
~~~text
05850:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05851:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05852:     </div>
05853:   </div>
05854: </div>
05855: 
05856: <!-- ============ AI TANYA JAWAB COPILOT ============
05857:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05858:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05859: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
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
~~~

## data-view="setting — 1 hit(s)
### Around L3421
~~~text
03406: 
03407: 
03408:     <div class="nav-group nav-group-collapsible v4-nav-group" data-group-key="omodos4" id="v4-nav-group" style="display:none;">
03409:       <button class="nav-parent-btn" data-group="omodos4"><span class="ico"><i class="ph-bold ph-cpu"></i></span> OMODOS 4.0 <span class="v4-badge">SUPERADMIN</span> <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03410:       <div class="nav-submenu" data-submenu="omodos4">
03411:         <button class="nav-btn v4-nav-btn" data-view="omodos4" data-v4-root="1"><span class="ico"><i class="ph-bold ph-command"></i></span> Command Center</button>
03412:       </div>
03413:     </div>
03414: 
03415:     <!-- Pengaturan: utilitas, dipisah dari 5 kategori utama (bukan tugas harian). -->
03416:     <div class="nav-group nav-group-collapsible nav-group-settings">
03417:       <button class="nav-parent-btn" data-group="pengaturan"><span class="ico"><i class="ph-bold ph-gear-six"></i></span> Pengaturan <span class="chev"><i class="ph-bold ph-caret-down"></i></span></button>
03418:       <div class="nav-submenu" data-submenu="pengaturan">
03419:         <button class="nav-btn" data-view="database"><span class="ico"><i class="ph-bold ph-database"></i></span> Database Mesin</button>
03420:         <button class="nav-btn" data-view="tema"><span class="ico"><i class="ph-bold ph-palette"></i></span> Tema Aplikasi</button>
03421:         <button class="nav-btn" data-view="setting"><span class="ico"><i class="ph-bold ph-plugs-connected"></i></span> Master Koneksi</button>
03422:       </div>
03423:     </div>
03424: 
03425:     <div class="sidebar-user-box" id="sidebar-user-box">
03426:       <div class="su-info" id="rbac-user-badge">-</div>
03427:       <button type="button" class="btn btn-sm su-logout-btn" id="btn-logout" title="Keluar dari aplikasi">
03428:         <i class="ph-bold ph-sign-out"></i> Logout
03429:       </button>
03430:     </div>
03431:   </aside>
03432: 
03433:   <main class="main">
03434:     <div class="topbar-title-row">
03435:       <button class="topbar-menu-btn" id="btn-open-sidebar"><i class="ph-bold ph-list"></i></button>
03436:       <button class="topbar-menu-btn lc-quick-btn" id="btn-lc-quick-toggle" type="button" title="Tampilan Sederhana: sederhanakan tampilan" aria-pressed="false" aria-label="Aktifkan Tampilan Sederhana"><i class="ph-bold ph-brain"></i></button>
03437:       <button class="topbar-menu-btn" id="btn-open-pengaturan" type="button" title="Pengaturan" aria-label="Buka Pengaturan"><i class="ph-bold ph-gear-six"></i></button>
03438:     </div>
03439: 
03440:     <div class="i40-banner">
03441:       <div class="i40-hex omodos-logo">
03442:         <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03443:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03444:           <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03445:           <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03446:           <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03447:           <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03448:         </svg>
03449:       </div>
03450:       <div class="i40-text">
~~~

## data-view='setting — 0 hit(s)
- No match.

