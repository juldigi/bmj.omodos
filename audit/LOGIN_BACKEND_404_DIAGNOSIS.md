# OMODOS Login Backend 404 Diagnosis

- UTC: 2026-09-20T13:57:23.010007+00:00
- Frontend bytes: 1642417

## Frontend login/API anchors

### apiPost — 1 sampled hit(s)
- around line 7858
~~~text
07850:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07851:       if(attempt<retries){
07852:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07853:       }
07854:     }
07855:   }
07856:   throw lastErr;
07857: }
07858: async function apiPost(payload){
07859:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07860:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
07861:   // saat koneksi belum dikonfigurasi tidak pernah ikut sinkron otomatis.
07862:   if(!WEB_APP_URL){
07863:     if(payload.action !== 'login') queueForSync_(payload);
07864:     throw new Error('NO_URL');
07865:   }
07866:   if(payload.action !== 'login' && !SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
~~~

### WEB_APP_URL — 12 sampled hit(s)
- around line 6051
~~~text
06043: const LS_IPAL_KEY = 'logbook_ipal_reports';
06044: const LS_PM_KEY = 'logbook_predictive_reports';
06045: const LS_GR_KEY = 'logbook_general_reports';
06046: const LS_PI_SOFTSKILL_KEY = 'pi_softskill_assessments';
06047: const LS_PI_HARDSKILL_KEY = 'pi_hardskill_assessments_v1';
06048: const LS_PI_PERSONNEL_KEY = 'pi_personnel_master_v1';
06049: 
06050: const LS_URL_KEY = 'logbook_cloudflare_api_v1';
06051: const DEFAULT_WEB_APP_URL = location.origin + '/api';
06052: let WEB_APP_URL = DEFAULT_WEB_APP_URL;
06053: let ENTRIES = [];
06054: let MACHINES = [];
06055: let PERSONIL = [];
06056: let PATROL_TEMPLATE = []; // item checklist patrol spesifik per mesin, dari sheet Patrol_Checklist_Template
06057: let KB_ENTRIES = [];
06058: // Ringkasan Patrol minimum dari bootstrap untuk Home. Tidak berisi file,
06059: // checklist detail, rekomendasi, atau data lain yang hanya boleh dibuka
~~~
- around line 6052
~~~text
06044: const LS_PM_KEY = 'logbook_predictive_reports';
06045: const LS_GR_KEY = 'logbook_general_reports';
06046: const LS_PI_SOFTSKILL_KEY = 'pi_softskill_assessments';
06047: const LS_PI_HARDSKILL_KEY = 'pi_hardskill_assessments_v1';
06048: const LS_PI_PERSONNEL_KEY = 'pi_personnel_master_v1';
06049: 
06050: const LS_URL_KEY = 'logbook_cloudflare_api_v1';
06051: const DEFAULT_WEB_APP_URL = location.origin + '/api';
06052: let WEB_APP_URL = DEFAULT_WEB_APP_URL;
06053: let ENTRIES = [];
06054: let MACHINES = [];
06055: let PERSONIL = [];
06056: let PATROL_TEMPLATE = []; // item checklist patrol spesifik per mesin, dari sheet Patrol_Checklist_Template
06057: let KB_ENTRIES = [];
06058: // Ringkasan Patrol minimum dari bootstrap untuk Home. Tidak berisi file,
06059: // checklist detail, rekomendasi, atau data lain yang hanya boleh dibuka
06060: // dari menu Patrol sesuai RBAC.
~~~
- around line 6609
~~~text
06601:    yang mengembalikan role sebenarnya dari akun tsb.
06602: 
06603:    PENTING (perilaku akses Setting): kalau pengguna yang SEDANG login
06604:    memang ber-role Superadmin, menu ini langsung terbuka tanpa login
06605:    ulang. Kalau bukan, sistem meminta login dengan akun Superadmin lain
06606:    (step-up auth) khusus untuk membuka menu ini — status step-up ini
06607:    HANYA berlaku selama pengguna tetap berada di menu Setting, begitu
06608:    pindah menu otomatis di-reset (wajib login ulang tiap kembali). Ini
06609:    terpisah total dari koneksi Cloudflare (WEB_APP_URL) & dari
06610:    sesi login utama (CURRENT_USER), yang tidak ikut berubah/hilang. */
06611: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06612: let SETTING_SESSION_TOKEN = '';
06613: function isSettingAuthed(){
06614:   return SETTING_AUTH_OK === true || isSuperadmin();
06615: }
06616: function resetSettingAuth(){
06617:   const tokenToRevoke = SETTING_SESSION_TOKEN;
~~~
- around line 6618
~~~text
06610:    sesi login utama (CURRENT_USER), yang tidak ikut berubah/hilang. */
06611: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06612: let SETTING_SESSION_TOKEN = '';
06613: function isSettingAuthed(){
06614:   return SETTING_AUTH_OK === true || isSuperadmin();
06615: }
06616: function resetSettingAuth(){
06617:   const tokenToRevoke = SETTING_SESSION_TOKEN;
06618:   if(tokenToRevoke && WEB_APP_URL){
06619:     fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke})}).catch(()=>{});
06620:   }
06621:   SETTING_AUTH_OK = false;
06622:   SETTING_SESSION_TOKEN = '';
06623: }
06624: function showSettingLoginModal(onSuccess){
06625:   $('#modal-content').innerHTML = `
06626:     <div class="modal-head">
~~~
- around line 6619
~~~text
06611: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06612: let SETTING_SESSION_TOKEN = '';
06613: function isSettingAuthed(){
06614:   return SETTING_AUTH_OK === true || isSuperadmin();
06615: }
06616: function resetSettingAuth(){
06617:   const tokenToRevoke = SETTING_SESSION_TOKEN;
06618:   if(tokenToRevoke && WEB_APP_URL){
06619:     fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke})}).catch(()=>{});
06620:   }
06621:   SETTING_AUTH_OK = false;
06622:   SETTING_SESSION_TOKEN = '';
06623: }
06624: function showSettingLoginModal(onSuccess){
06625:   $('#modal-content').innerHTML = `
06626:     <div class="modal-head">
06627:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-lock-key"></i> Akses Master Mesin &amp; Koneksi</h2></div>
~~~
- around line 6647
~~~text
06639:   $('#btn-close-modal').addEventListener('click', closeModal);
06640:   const submit = async ()=>{
06641:     const u = $('#setting-login-username').value.trim();
06642:     const p = $('#setting-login-password').value;
06643:     const errEl = $('#setting-login-error');
06644:     const submitBtn = $('#btn-setting-login-submit');
06645:     errEl.style.display = 'none';
06646:     if(!u || !p) return;
06647:     if(!WEB_APP_URL){
06648:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App).';
06649:       errEl.style.display = 'block';
06650:       return;
06651:     }
06652:     submitBtn.disabled = true;
06653:     const originalLabel = submitBtn.innerHTML;
06654:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06655:     try{
~~~
- around line 6656
~~~text
06648:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App).';
06649:       errEl.style.display = 'block';
06650:       return;
06651:     }
06652:     submitBtn.disabled = true;
06653:     const originalLabel = submitBtn.innerHTML;
06654:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06655:     try{
06656:       const res = await fetchWithTimeout_(WEB_APP_URL, {
06657:         method: 'POST',
06658:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
06659:         body: JSON.stringify({ action: 'login', username: u, password: p })
06660:       }, 30000);
06661:       const json = await parseApiResponse_(res);
06662:       if(!json.ok || !json.user){
06663:         errEl.textContent = json.error || 'Username atau password salah.';
06664:         errEl.style.display = 'block';
~~~
- around line 6669
~~~text
06661:       const json = await parseApiResponse_(res);
06662:       if(!json.ok || !json.user){
06663:         errEl.textContent = json.error || 'Username atau password salah.';
06664:         errEl.style.display = 'block';
06665:         return;
06666:       }
06667:       if(json.user.role !== 'Superadmin'){
06668:         if(json.sessionToken){
06669:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06670:         }
06671:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06672:         errEl.style.display = 'block';
06673:         return;
06674:       }
06675:       SETTING_AUTH_OK = true;
06676:       SETTING_SESSION_TOKEN = json.sessionToken || '';
06677:       closeModal();
~~~
- around line 6880
~~~text
06872: // [FITUR BARU] Preview + terapkan perbaikan kualitas data Logbook (tanggal
06873: // kosong/masa depan → 2025, "Preventive" yang salah taruh di Deskripsi
06874: // Masalah → dipindah ke Jenis Pekerjaan). Selalu preview (dryRun) dulu
06875: // sebelum tombol "Terapkan" muncul, supaya Superadmin bisa meninjau daftar
06876: // perubahan konkret (bukan cuma angka) sebelum benar-benar menulis ke Sheets.
06877: async function previewLogbookDataFix(){
06878:   const holder = $('#data-fix-result');
06879:   const btn = $('#btn-preview-data-fix');
06880:   if(!WEB_APP_URL){ toast('Fitur AI External membutuhkan koneksi backend Cloudflare -- belum tersambung.', true); return; }
06881:   const oldLabel = btn.innerHTML;
06882:   btn.disabled = true; btn.innerHTML = '<span class="ai-spinner" style="width:11px;height:11px;"></span> Memindai...';
06883:   holder.innerHTML = '';
06884:   try{
06885:     const res = await apiPost({ action:'fixLogbookDataQuality', actor: CURRENT_USER.username, dryRun: true });
06886:     btn.disabled = false; btn.innerHTML = oldLabel;
06887:     if(!res.dateFixCount && !res.jenisFixCount){
06888:       holder.innerHTML = `<div class="sub" style="color:var(--green,#3fc978);">✅ Tidak ditemukan data bermasalah -- tanggal & Jenis Pekerjaan semuanya sudah rapi.</div>`;
~~~
- around line 7162
~~~text
07154: }
07155: 
07156: async function handleSavePermissions_(){
07157:   const statusEl = $('#rp-status');
07158:   const saveBtn = $('#btn-save-permissions');
07159:   const updates = JSON.parse(JSON.stringify(RBAC_ROLE_PERMISSIONS_DRAFT||{}));
07160:   const lcUpdates = JSON.parse(JSON.stringify(RBAC_LC_PERMISSIONS_DRAFT||{}));
07161:   if(!Object.keys(updates).length){ toast('Tidak ada konfigurasi akses yang dapat disimpan.', true); return false; }
07162:   if(!WEB_APP_URL || new URL(WEB_APP_URL, location.origin).origin !== location.origin){
07163:     toast('URL backend harus menggunakan domain aplikasi yang sama.', true);
07164:     return false;
07165:   }
07166:   if(!SESSION_TOKEN && !(SETTING_AUTH_OK && SETTING_SESSION_TOKEN)){
07167:     toast('Sesi login tidak tersedia. Login ulang lalu buka kembali Role Access Management.', true);
07168:     return false;
07169:   }
07170: 
~~~
- around line 7275
~~~text
07267:       hint = ' Browser tidak dapat mengakses Web App. Pastikan URL berakhiran /exec dan deployment mengizinkan akses dari browser publik.';
07268:     }else if(/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/i.test(raw)){
07269:       hint = ' Sesi autentikasi sudah tidak valid; login ulang diperlukan.';
07270:     }else if(/FORBIDDEN|rbac\.manage/i.test(raw)){
07271:       hint = ' Request harus memakai sesi Superadmin.';
07272:     }
07273:     statusEl.textContent = 'Gagal pada tahap: ' + stage + '.';
07274:     toast('Gagal ' + stage + ': ' + raw + hint, true);
07275:     console.error('[RBAC SAVE FAILED]', {stage, error:err, backend:WEB_APP_URL});
07276:     return false;
07277:   }finally{
07278:     if(saveBtn) saveBtn.disabled = false;
07279:   }
07280: }
07281: // Penanda agar patch Tampilan Sederhana lama di bagian bawah file TIDAK membungkus
07282: // fungsi ini lagi. Fungsi di atas sudah menyimpan RBAC + LC secara atomik.
07283: handleSavePermissions_.__lcAtomic = true;
~~~
- around line 7466
~~~text
07458: // Terapkan tema ke seluruh halaman (CSS Variables) tanpa reload. Disimpan
07459: // ke localStorage (fallback) dan, kalau sedang login & terhubung ke
07460: // code.gs, juga disimpan sebagai preferensi user di server (single source
07461: // of truth) supaya tema ikut tersimpan per akun.
07462: function setAppTheme(theme, opts={}){
07463:   document.documentElement.setAttribute('data-theme', theme);
07464:   localStorage.setItem(LS_THEME_KEY, theme);
07465:   renderThemeManagerActiveState_();
07466:   if(opts.persist !== false && CURRENT_USER && WEB_APP_URL){
07467:     apiPost({ action:'saveThemePref', actor: CURRENT_USER.username, theme }).catch(()=>{});
07468:   }
07469: }
07470: function renderThemeManagerActiveState_(){
07471:   const current = document.documentElement.getAttribute('data-theme') || 'omodos';
07472:   $$('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.themeKey === current));
07473: }
07474: function renderThemeManager(){
~~~

### login_action — 4 sampled hit(s)
- around line 6600
~~~text
06592: window.addEventListener('unhandledrejection', (ev)=>{
06593:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06594: });
06595: 
06596: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06597:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
06598:    boleh diakses oleh akun berperan Superadmin. TIDAK ADA LAGI username/
06599:    password hardcode di frontend — verifikasi akun dilakukan lewat
06600:    backend yang sama dengan login utama (action:'login' di code.gs),
06601:    yang mengembalikan role sebenarnya dari akun tsb.
06602: 
06603:    PENTING (perilaku akses Setting): kalau pengguna yang SEDANG login
06604:    memang ber-role Superadmin, menu ini langsung terbuka tanpa login
06605:    ulang. Kalau bukan, sistem meminta login dengan akun Superadmin lain
06606:    (step-up auth) khusus untuk membuka menu ini — status step-up ini
06607:    HANYA berlaku selama pengguna tetap berada di menu Setting, begitu
06608:    pindah menu otomatis di-reset (wajib login ulang tiap kembali). Ini
~~~
- around line 6659
~~~text
06651:     }
06652:     submitBtn.disabled = true;
06653:     const originalLabel = submitBtn.innerHTML;
06654:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06655:     try{
06656:       const res = await fetchWithTimeout_(WEB_APP_URL, {
06657:         method: 'POST',
06658:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
06659:         body: JSON.stringify({ action: 'login', username: u, password: p })
06660:       }, 30000);
06661:       const json = await parseApiResponse_(res);
06662:       if(!json.ok || !json.user){
06663:         errEl.textContent = json.error || 'Username atau password salah.';
06664:         errEl.style.display = 'block';
06665:         return;
06666:       }
06667:       if(json.user.role !== 'Superadmin'){
~~~
- around line 6777
~~~text
06769: let RBAC_ACTIVITY_ROWS=[];
06770: let RBAC_ACTIVITY_OFFSET=0;
06771: let RBAC_ACTIVITY_DONE=false;
06772: const RBAC_ACTIVITY_PAGE_SIZE=200;
06773: let RBAC_ACTIVITY_FILTER={user:'',type:'all',q:''};
06774: 
06775: function auditActionLabel_(action){
06776:   const map={
06777:     login:'Login',login_failed:'Login gagal',logout:'Logout',
06778:     createUser:'Tambah user',updateUser:'Ubah user/role',resetPassword:'Reset password',
06779:     setUserActive:'Ubah status user',deleteUser:'Hapus user',
06780:     savePermissions:'Ubah role access',saveLcPermissions:'Ubah Tampilan Sederhana',saveRoleAccessConfig:'Ubah konfigurasi akses',
06781:     saveThemePref:'Ubah tema',saveStylePref:'Ubah style',
06782:     addEntry:'Tambah Logbook',updateStatus:'Ubah Logbook',deleteEntry:'Hapus Logbook'
06783:   };
06784:   if(map[action]) return map[action];
06785:   return String(action||'Aktivitas').replace(/^v4\./,'OMODOS 4 · ').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/_/g,' ');
~~~
- around line 20975
~~~text
20967: 
20968:     submitBtn.disabled = true;
20969:     const originalLabel = submitBtn.innerHTML;
20970:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
20971:     try{
20972:       const res = await fetchWithTimeout_(WEB_APP_URL, {
20973:         method: 'POST',
20974:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
20975:         body: JSON.stringify({ action: 'login', username: u, password: p })
20976:       }, 30000);
20977:       const json = await parseApiResponse_(res);
20978:       if(!json.ok){
20979:         errEl.textContent = json.error || 'Username atau password salah. Silakan coba lagi.';
20980:         const box = document.querySelector('.login-box');
20981:         box.style.animation = 'none';
20982:         void box.offsetWidth;
20983:         box.style.animation = 'modalIn 320ms cubic-bezier(.4,0,.2,1)';
~~~

### login_handler — 12 sampled hit(s)
- around line 183
~~~text
00175: html:not([data-theme="red-black"]) .card, html:not([data-theme="red-black"]) .sidebar{ box-shadow:0 1px 3px rgba(0,0,0,.06) !important; }
00176: 
00177: /* Judul/brand di app banyak memakai efek gradient text-clip (warna tetap
00178:    merah walau tema diganti) — dipaksa jadi warna solid mengikuti teks
00179:    dasar tema aktif (var(--text)) di luar tema merah-hitam default. */
00180: html:not([data-theme="red-black"]) .topbar h1,
00181: html:not([data-theme="red-black"]) .brand .txt b,
00182: html:not([data-theme="red-black"]) .i40-banner .i40-text .t1,
00183: html:not([data-theme="red-black"]) .login-box h1,
00184: html:not([data-theme="red-black"]) .section-title,
00185: html:not([data-theme="red-black"]) .nav-parent-btn.active{
00186:   background:none !important; -webkit-text-fill-color:var(--text) !important;
00187:   color:var(--text) !important; filter:none !important; animation:none !important;
00188: }
00189: 
00190: .theme-manager-grid{
00191:   display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:14px;
~~~
- around line 251
~~~text
00243:   filter:brightness(1.08) !important; box-shadow:none !important;
00244: }
00245: html:not([data-theme="red-black"]) .card:hover{
00246:   border-color:var(--line) !important; box-shadow:0 6px 20px -12px rgba(0,0,0,.25) !important;
00247: }
00248: html:not([data-theme="red-black"]) .card::before{
00249:   background:linear-gradient(90deg, transparent, var(--line), transparent) !important; opacity:1 !important;
00250: }
00251: html:not([data-theme="red-black"]) #login-gate{
00252:   background:var(--bg) !important;
00253: }
00254: html:not([data-theme="red-black"]) #login-gate::before,
00255: html:not([data-theme="red-black"]) #login-gate::after{
00256:   display:none !important;
00257: }
00258: html:not([data-theme="red-black"]) .login-box{
00259:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
~~~
- around line 254
~~~text
00246:   border-color:var(--line) !important; box-shadow:0 6px 20px -12px rgba(0,0,0,.25) !important;
00247: }
00248: html:not([data-theme="red-black"]) .card::before{
00249:   background:linear-gradient(90deg, transparent, var(--line), transparent) !important; opacity:1 !important;
00250: }
00251: html:not([data-theme="red-black"]) #login-gate{
00252:   background:var(--bg) !important;
00253: }
00254: html:not([data-theme="red-black"]) #login-gate::before,
00255: html:not([data-theme="red-black"]) #login-gate::after{
00256:   display:none !important;
00257: }
00258: html:not([data-theme="red-black"]) .login-box{
00259:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
00260:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00261: }
00262: 
~~~
- around line 255
~~~text
00247: }
00248: html:not([data-theme="red-black"]) .card::before{
00249:   background:linear-gradient(90deg, transparent, var(--line), transparent) !important; opacity:1 !important;
00250: }
00251: html:not([data-theme="red-black"]) #login-gate{
00252:   background:var(--bg) !important;
00253: }
00254: html:not([data-theme="red-black"]) #login-gate::before,
00255: html:not([data-theme="red-black"]) #login-gate::after{
00256:   display:none !important;
00257: }
00258: html:not([data-theme="red-black"]) .login-box{
00259:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
00260:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00261: }
00262: 
00263: /* ===================================================================
~~~
- around line 258
~~~text
00250: }
00251: html:not([data-theme="red-black"]) #login-gate{
00252:   background:var(--bg) !important;
00253: }
00254: html:not([data-theme="red-black"]) #login-gate::before,
00255: html:not([data-theme="red-black"]) #login-gate::after{
00256:   display:none !important;
00257: }
00258: html:not([data-theme="red-black"]) .login-box{
00259:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
00260:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00261: }
00262: 
00263: /* ===================================================================
00264:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00265:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00266:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
~~~
- around line 323
~~~text
00315:    Intelligence, dst) tanpa perlu menulis ulang tiap class satu-satu. */
00316: 
00317: html[data-style] [class*="card"]:not(.theme-card):not(.style-card):not(.dash-card),
00318: html[data-style] [class*="chip"],
00319: html[data-style] [class*="badge"],
00320: html[data-style] [class*="pill"],
00321: html[data-style] [class*="box"],
00322: html[data-style] .modal,
00323: html[data-style] .login-box,
00324: html[data-style] .btn,
00325: html[data-style] input, html[data-style] select, html[data-style] textarea{
00326:   transition: border-radius var(--trans), border-color var(--trans), box-shadow var(--trans), background var(--trans), clip-path var(--trans), transform var(--trans);
00327: }
00328: 
00329: /* Style Manager: hanya gaya yang benar-benar dipakai — Klasik (default, tanpa override), Holographic, Minimalis, Elegant Corporate, Tampilan Sederhana. Gaya lain yang sebelumnya ada di sini sudah dihapus karena tidak dipakai lagi. */
00330: 
00331: /* ---------- 18. HOLOGRAPHIC ---------- */
~~~
- around line 334
~~~text
00326:   transition: border-radius var(--trans), border-color var(--trans), box-shadow var(--trans), background var(--trans), clip-path var(--trans), transform var(--trans);
00327: }
00328: 
00329: /* Style Manager: hanya gaya yang benar-benar dipakai — Klasik (default, tanpa override), Holographic, Minimalis, Elegant Corporate, Tampilan Sederhana. Gaya lain yang sebelumnya ada di sini sudah dihapus karena tidak dipakai lagi. */
00330: 
00331: /* ---------- 18. HOLOGRAPHIC ---------- */
00332: html[data-style="holographic"]{ --font-display:'Rajdhani', sans-serif; --font-body:'Inter', sans-serif; }
00333: html[data-style="holographic"] [class*="card"]:not(.theme-card):not(.style-card):not(.dash-card),
00334: html[data-style="holographic"] [class*="box"], html[data-style="holographic"] .modal, html[data-style="holographic"] .login-box{
00335:   border-radius:14px !important; border:1px solid transparent !important;
00336:   background:
00337:     linear-gradient(var(--panel-2), var(--panel)) padding-box,
00338:     linear-gradient(120deg, #ff8fe0, #8fd0ff, #b6ff9e, #ff8fe0) border-box !important;
00339:   background-size:100% 100%, 300% 300% !important;
00340:   animation:styleHoloShift 6s linear infinite !important;
00341: }
00342: @keyframes styleHoloShift{ 0%{background-position:0 0, 0% 50%;} 100%{background-position:0 0, 200% 50%;} }
~~~
- around line 352
~~~text
00344: html[data-style="holographic"] input, html[data-style="holographic"] select, html[data-style="holographic"] textarea{ border-radius:10px !important; }
00345: html[data-style="holographic"] [class*="chip"], html[data-style="holographic"] [class*="badge"], html[data-style="holographic"] [class*="pill"]{ border-radius:999px !important; }
00346: 
00347: /* ---------- 7. MINIMALIS ---------- */
00348: html[data-style="minimalis"]{ --font-display:'Inter', sans-serif; --font-body:'Inter', sans-serif; }
00349: html[data-style="minimalis"] body::before, html[data-style="minimalis"] body::after,
00350: html[data-style="minimalis"] .scanline-overlay, html[data-style="minimalis"] .scanline-sweep{ display:none !important; }
00351: html[data-style="minimalis"] [class*="card"]:not(.theme-card):not(.style-card):not(.dash-card),
00352: html[data-style="minimalis"] [class*="box"], html[data-style="minimalis"] .modal, html[data-style="minimalis"] .login-box{
00353:   border-radius:10px !important; border:1px solid var(--line) !important;
00354:   background:var(--panel) !important; box-shadow:none !important;
00355: }
00356: html[data-style="minimalis"] .btn{ border-radius:8px !important; box-shadow:none !important; }
00357: html[data-style="minimalis"] .btn-primary{ background:var(--red) !important; box-shadow:none !important; }
00358: html[data-style="minimalis"] input, html[data-style="minimalis"] select, html[data-style="minimalis"] textarea{ border-radius:8px !important; box-shadow:none !important; }
00359: html[data-style="minimalis"] [class*="chip"], html[data-style="minimalis"] [class*="badge"], html[data-style="minimalis"] [class*="pill"]{ border-radius:8px !important; }
00360: html[data-style="minimalis"] .sidebar{ background:var(--panel) !important; backdrop-filter:none !important; box-shadow:none; }
~~~
- around line 370
~~~text
00362: html[data-style="minimalis"] .topbar h1{ background:none !important; -webkit-text-fill-color:unset; color:var(--text) !important; animation:none !important; filter:none !important; }
00363: html[data-style="minimalis"] .stat-chip::before{ display:none; }
00364: 
00365: /* ---------- 10. ELEGAN KORPORAT ---------- */
00366: html[data-style="elegan-korporat"]{ --font-display:'Playfair Display', serif; --font-body:'Inter', sans-serif; }
00367: html[data-style="elegan-korporat"] body::before, html[data-style="elegan-korporat"] body::after,
00368: html[data-style="elegan-korporat"] .scanline-overlay, html[data-style="elegan-korporat"] .scanline-sweep{ opacity:.3; animation:none !important; }
00369: html[data-style="elegan-korporat"] [class*="card"]:not(.theme-card):not(.style-card):not(.dash-card),
00370: html[data-style="elegan-korporat"] [class*="box"], html[data-style="elegan-korporat"] .modal, html[data-style="elegan-korporat"] .login-box{
00371:   border-radius:6px !important; border:1px solid var(--line) !important;
00372:   box-shadow:0 6px 20px -14px rgba(0,0,0,.5) !important;
00373: }
00374: html[data-style="elegan-korporat"] .btn{ border-radius:5px !important; letter-spacing:.4px; }
00375: html[data-style="elegan-korporat"] input, html[data-style="elegan-korporat"] select, html[data-style="elegan-korporat"] textarea{ border-radius:5px !important; }
00376: html[data-style="elegan-korporat"] [class*="chip"], html[data-style="elegan-korporat"] [class*="badge"], html[data-style="elegan-korporat"] [class*="pill"]{ border-radius:5px !important; }
00377: html[data-style="elegan-korporat"] .sidebar{ backdrop-filter:none !important; background:var(--panel) !important; border-right:1px solid var(--line); }
00378: html[data-style="elegan-korporat"] .brand .mark{ border-radius:4px; animation:none !important; }
~~~
- around line 2358
~~~text
02350: .section-title::after{content:"";flex:1;height:1px;background:linear-gradient(90deg, var(--line), transparent);margin-left:6px;}
02351: 
02352: .nav-btn.active::after{
02353:   content:"";position:absolute;right:8px;top:50%;transform:translateY(-50%);
02354:   width:5px;height:5px;background:var(--red);box-shadow:0 0 6px 2px var(--red-glow);
02355:   clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
02356: }
02357: 
02358: #login-gate{
02359:   position:fixed;inset:0;z-index:1000;
02360:   display:flex;align-items:center;justify-content:center;
02361:   background:
02362:     radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--red) 10%, transparent), transparent 45%),
02363:     radial-gradient(circle at 85% 85%, rgba(184,16,42,.10), transparent 40%),
02364:     linear-gradient(color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02365:     linear-gradient(90deg, color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02366:     var(--bg);
~~~
- around line 2370
~~~text
02362:     radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--red) 10%, transparent), transparent 45%),
02363:     radial-gradient(circle at 85% 85%, rgba(184,16,42,.10), transparent 40%),
02364:     linear-gradient(color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02365:     linear-gradient(90deg, color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02366:     var(--bg);
02367:   background-size:auto,auto,38px 38px,38px 38px;
02368:   padding:20px;
02369: }
02370: #login-gate::before{
02371:   content:"";position:absolute;inset:0;pointer-events:none;
02372:   background:repeating-linear-gradient(0deg, color-mix(in srgb, var(--red) 3%, transparent) 0px, color-mix(in srgb, var(--red) 3%, transparent) 1px, transparent 1px, transparent 3px);
02373:   mix-blend-mode:overlay;
02374: }
02375: #login-gate::after{
02376:   content:"";position:absolute;inset:0;pointer-events:none;
02377:   background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--red) 18%, transparent), transparent 55%);
02378:   animation:loginGlow 10s ease-in-out infinite;
~~~
- around line 2375
~~~text
02367:   background-size:auto,auto,38px 38px,38px 38px;
02368:   padding:20px;
02369: }
02370: #login-gate::before{
02371:   content:"";position:absolute;inset:0;pointer-events:none;
02372:   background:repeating-linear-gradient(0deg, color-mix(in srgb, var(--red) 3%, transparent) 0px, color-mix(in srgb, var(--red) 3%, transparent) 1px, transparent 1px, transparent 3px);
02373:   mix-blend-mode:overlay;
02374: }
02375: #login-gate::after{
02376:   content:"";position:absolute;inset:0;pointer-events:none;
02377:   background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--red) 18%, transparent), transparent 55%);
02378:   animation:loginGlow 10s ease-in-out infinite;
02379: }
02380: @keyframes loginGlow{0%,100%{opacity:.5;}50%{opacity:1;}}
02381: .login-box{
02382:   position:relative;width:100%;max-width:380px;
02383:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
~~~

### fetch_calls — 4 sampled hit(s)
- around line 6619
~~~text
06611: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06612: let SETTING_SESSION_TOKEN = '';
06613: function isSettingAuthed(){
06614:   return SETTING_AUTH_OK === true || isSuperadmin();
06615: }
06616: function resetSettingAuth(){
06617:   const tokenToRevoke = SETTING_SESSION_TOKEN;
06618:   if(tokenToRevoke && WEB_APP_URL){
06619:     fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke})}).catch(()=>{});
06620:   }
06621:   SETTING_AUTH_OK = false;
06622:   SETTING_SESSION_TOKEN = '';
06623: }
06624: function showSettingLoginModal(onSuccess){
06625:   $('#modal-content').innerHTML = `
06626:     <div class="modal-head">
06627:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-lock-key"></i> Akses Master Mesin &amp; Koneksi</h2></div>
~~~
- around line 6669
~~~text
06661:       const json = await parseApiResponse_(res);
06662:       if(!json.ok || !json.user){
06663:         errEl.textContent = json.error || 'Username atau password salah.';
06664:         errEl.style.display = 'block';
06665:         return;
06666:       }
06667:       if(json.user.role !== 'Superadmin'){
06668:         if(json.sessionToken){
06669:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06670:         }
06671:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06672:         errEl.style.display = 'block';
06673:         return;
06674:       }
06675:       SETTING_AUTH_OK = true;
06676:       SETTING_SESSION_TOKEN = json.sessionToken || '';
06677:       closeModal();
~~~
- around line 7790
~~~text
07782:     }
07783:     throw new Error('Respons backend bukan JSON yang valid. HTTP ' + res.status + '.');
07784:   }
07785: }
07786: async function fetchWithTimeout_(url, options={}, timeoutMs=45000){
07787:   // PATCHED v2.1 - timeout 45s default + pesan cold start
07788:   const controller = new AbortController();
07789:   const timer = setTimeout(()=>controller.abort(), timeoutMs);
07790:   try{ return await fetch(url, {...options, signal:controller.signal}); }
07791:   catch(err){
07792:     if(err && err.name==='AbortError') throw new Error('Backend timeout setelah '+Math.round(timeoutMs/1000)+' detik. Periksa koneksi internet lalu coba kembali.');
07793:     throw err;
07794:   }finally{ clearTimeout(timer); }
07795: }
07796: function handleApiAuthFailure_(message, requestToken){
07797:   const msg = String(message || '');
07798:   if(!/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(msg)) return;
~~~
- around line 8018
~~~text
08010:   try{
08011:     deactivateAccountDataCaches_(CURRENT_USER&&CURRENT_USER.username);
08012:   }catch(e){
08013:     toast('Logout dibatalkan karena cache lokal belum berhasil diamankan. Coba kembali setelah ruang penyimpanan browser tersedia.', true);
08014:     return;
08015:   }
08016:   const tokenToRevoke = SESSION_TOKEN;
08017:   if(tokenToRevoke && WEB_APP_URL){
08018:     fetch(WEB_APP_URL, {
08019:       method:'POST',
08020:       headers:{'Content-Type':'text/plain;charset=utf-8'},
08021:       body:JSON.stringify({action:'logout', sessionToken:tokenToRevoke}),
08022:       keepalive:true
08023:     }).catch(()=>{});
08024:   }
08025:   CURRENT_USER = null;
08026:   SESSION_TOKEN = '';
~~~

## Live production probes

- GET_root: {"status": 200, "content_type": "text/html", "bytes": 1642417, "sha256": "f5b9e2fd1905c16f00a42b7411af040abd1342b3b40266bebac5ca5f6fadcef5", "prefix": "<!DOCTYPE html> <html lang=\"id\"> <head> <meta charset=\"UTF-8\"> <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no\"> <!-- ==="}
- POST_root_unknown_action: {"status": 405, "content_type": "", "bytes": 0, "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "prefix": ""}
- POST_api_unknown_action: {"status": 404, "content_type": "", "bytes": 0, "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "prefix": ""}
- GET_api: {"status": 404, "content_type": "", "bytes": 0, "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "prefix": ""}

## Recovered Worker route map (version 68)

### login_action — 20 sampled hit(s)
- around worker line 624
~~~text
00614:     const since = timeMs(body && body.since, until - 30 * 864e5);
00615:     return enforceSourceTruthRange({ since: Math.min(since, until), until: Math.max(since, until) });
00616:   }
00617:   __name(standardRange, "standardRange");
00618:   function jakartaDayRange(daysBack) {
00619:     const shifted = new Date(Date.now() + 7 * 36e5);
00620:     const startUtc = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysBack) - 7 * 36e5;
00621:     return { since: startUtc, until: startUtc + 864e5 - 1 };
00622:   }
00623:   __name(jakartaDayRange, "jakartaDayRange");
00624:   function previousLoginRange(actor) {
00625:     if (!actor) return null;
00626:     const sessions = sourceRows(SHEETS.sessions).filter((r) => lower(first(r, ["Username"])) === lower(actor)).map((r) => timeMs(first(r, ["CreatedAt", "Created At"]), NaN)).filter(Number.isFinite).sort((a, b) => b - a);
00627:     if (sessions.length < 2) return null;
00628:     return { since: sessions[1], until: sessions[0] - 1, label: "PREVIOUS_LOGIN" };
00629:   }
00630:   __name(previousLoginRange, "previousLoginRange");
00631:   function previousShiftRange() {
00632:     const events = sourceRows(SHEETS.logbook).map((r) => ({ t: dateValue(r), shift: text(first(r, ["Shift"])), r })).filter((x) => x.t && x.shift).sort((a, b) => b.t - a.t);
00633:     if (!events.length) return null;
00634:     const groups = [];
~~~
- around worker line 628
~~~text
00618:   function jakartaDayRange(daysBack) {
00619:     const shifted = new Date(Date.now() + 7 * 36e5);
00620:     const startUtc = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysBack) - 7 * 36e5;
00621:     return { since: startUtc, until: startUtc + 864e5 - 1 };
00622:   }
00623:   __name(jakartaDayRange, "jakartaDayRange");
00624:   function previousLoginRange(actor) {
00625:     if (!actor) return null;
00626:     const sessions = sourceRows(SHEETS.sessions).filter((r) => lower(first(r, ["Username"])) === lower(actor)).map((r) => timeMs(first(r, ["CreatedAt", "Created At"]), NaN)).filter(Number.isFinite).sort((a, b) => b - a);
00627:     if (sessions.length < 2) return null;
00628:     return { since: sessions[1], until: sessions[0] - 1, label: "PREVIOUS_LOGIN" };
00629:   }
00630:   __name(previousLoginRange, "previousLoginRange");
00631:   function previousShiftRange() {
00632:     const events = sourceRows(SHEETS.logbook).map((r) => ({ t: dateValue(r), shift: text(first(r, ["Shift"])), r })).filter((x) => x.t && x.shift).sort((a, b) => b.t - a.t);
00633:     if (!events.length) return null;
00634:     const groups = [];
00635:     let cur = null;
00636:     for (const e of events) {
00637:       const local = new Date(e.t + 7 * 36e5), day = local.toISOString().slice(0, 10), key = day + "|" + e.shift;
00638:       if (!cur || cur.key !== key) {
~~~
- around worker line 630
~~~text
00620:     const startUtc = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysBack) - 7 * 36e5;
00621:     return { since: startUtc, until: startUtc + 864e5 - 1 };
00622:   }
00623:   __name(jakartaDayRange, "jakartaDayRange");
00624:   function previousLoginRange(actor) {
00625:     if (!actor) return null;
00626:     const sessions = sourceRows(SHEETS.sessions).filter((r) => lower(first(r, ["Username"])) === lower(actor)).map((r) => timeMs(first(r, ["CreatedAt", "Created At"]), NaN)).filter(Number.isFinite).sort((a, b) => b - a);
00627:     if (sessions.length < 2) return null;
00628:     return { since: sessions[1], until: sessions[0] - 1, label: "PREVIOUS_LOGIN" };
00629:   }
00630:   __name(previousLoginRange, "previousLoginRange");
00631:   function previousShiftRange() {
00632:     const events = sourceRows(SHEETS.logbook).map((r) => ({ t: dateValue(r), shift: text(first(r, ["Shift"])), r })).filter((x) => x.t && x.shift).sort((a, b) => b.t - a.t);
00633:     if (!events.length) return null;
00634:     const groups = [];
00635:     let cur = null;
00636:     for (const e of events) {
00637:       const local = new Date(e.t + 7 * 36e5), day = local.toISOString().slice(0, 10), key = day + "|" + e.shift;
00638:       if (!cur || cur.key !== key) {
00639:         cur = { key, shift: e.shift, day, times: [] };
00640:         groups.push(cur);
~~~
- around worker line 656
~~~text
00646:     const g = groups[1];
00647:     return { since: Math.min(...g.times), until: Math.max(...g.times), shift: g.shift, label: "PREVIOUS_RECORDED_SHIFT" };
00648:   }
00649:   __name(previousShiftRange, "previousShiftRange");
00650:   function resolveChangeRange(body) {
00651:     const preset = text(body && body.preset);
00652:     if (preset === "yesterday") {
00653:       const r = enforceSourceTruthRange(jakartaDayRange(1));
00654:       return { ...r, label: "YESTERDAY" };
00655:     }
00656:     if (preset === "previousLogin") {
00657:       const r = previousLoginRange(body && body.actor);
00658:       if (r) return { ...enforceSourceTruthRange(r), label: r.label };
00659:     }
00660:     if (preset === "previousShift") {
00661:       const r = previousShiftRange();
00662:       if (r) return { ...enforceSourceTruthRange(r), shift: r.shift, label: r.label };
00663:     }
00664:     return { ...standardRange(body || {}), label: preset === "selected" ? "SELECTED" : "CUSTOM" };
00665:   }
00666:   __name(resolveChangeRange, "resolveChangeRange");
~~~
- around worker line 657
~~~text
00647:     return { since: Math.min(...g.times), until: Math.max(...g.times), shift: g.shift, label: "PREVIOUS_RECORDED_SHIFT" };
00648:   }
00649:   __name(previousShiftRange, "previousShiftRange");
00650:   function resolveChangeRange(body) {
00651:     const preset = text(body && body.preset);
00652:     if (preset === "yesterday") {
00653:       const r = enforceSourceTruthRange(jakartaDayRange(1));
00654:       return { ...r, label: "YESTERDAY" };
00655:     }
00656:     if (preset === "previousLogin") {
00657:       const r = previousLoginRange(body && body.actor);
00658:       if (r) return { ...enforceSourceTruthRange(r), label: r.label };
00659:     }
00660:     if (preset === "previousShift") {
00661:       const r = previousShiftRange();
00662:       if (r) return { ...enforceSourceTruthRange(r), shift: r.shift, label: r.label };
00663:     }
00664:     return { ...standardRange(body || {}), label: preset === "selected" ? "SELECTED" : "CUSTOM" };
00665:   }
00666:   __name(resolveChangeRange, "resolveChangeRange");
00667:   function scopeContext(body) {
~~~
- around worker line 3663
~~~text
03653:             if (mime.indexOf("image/") === 0) allowed = true;
03654:             if (!allowed && mime !== "") throw { code: "VALIDATION_ERROR", message: "Tipe file tidak diizinkan: " + mime };
03655:           }
03656:         });
03657:       }
03658:     });
03659:   }
03660:   __name(validatePayload_, "validatePayload_");
03661:   const ACTION_REGISTRY = {
03662:     // AUTH (public or session)
03663:     "login": { permission: null, audit: false, idempotent: false, handler: "handleLogin_" },
03664:     "logout": { permission: null, audit: true, idempotent: true, handler: "handleLogout_" },
03665:     // USER MANAGEMENT
03666:     "users": { permission: "rbac.manage", audit: false, idempotent: false, handler: "handleGetUsers_", method: "GET" },
03667:     "createUser": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleCreateUser_" },
03668:     "updateUser": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleUpdateUser_" },
03669:     "resetPassword": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleResetPassword_" },
03670:     "setUserActive": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleSetUserActive_" },
03671:     "deleteUser": { permission: "rbac.manage", audit: true, idempotent: true, handler: "handleDeleteUser_" },
03672:     "permissions": { permission: "rbac.manage", audit: false, idempotent: false, handler: "getPermissionMatrix_", method: "GET" },
03673:     "lcPermissions": { permission: "rbac.manage", audit: false, idempotent: false, handler: "getLcPermissionMatrix_", method: "GET" },
~~~
- around worker line 3715
~~~text
03705:     // "Nama Pelapor" di Input Logbook, penugasan Patrol, dst) -- BUKAN data
03706:     // sensitif milik halaman People/PI Personnel Dashboard saja. Sebelumnya
03707:     // action ini mensyaratkan permission 'person.read', yang lewat viewMap_
03708:     // di checkPermission_ terhubung ke 'view.pi-personnel' (halaman People &
03709:     // Meetings) -- permission yang SAMA SEKALI TIDAK BERKAITAN dengan Input
03710:     // Logbook/Patrol. Akibatnya role yang hanya diberi akses ke Input
03711:     // Logbook & Patrol (wajar, tanpa akses ke People Dashboard) gagal
03712:     // memuat daftar Personil sama sekali, dan dropdown personil di kedua
03713:     // menu itu jadi kosong tanpa pesan error apa pun (dikeluarkan diam-diam
03714:     // dari prepareManifest karena requirePermission_ gagal). Sekarang dibuka
03715:     // untuk siapa pun yang sudah login (permission:null, sama seperti
03716:     // 'bootstrap'), sama seperti 'personil' memang dipakai lintas-halaman.
03717:     // 'piPersonnelMaster' (data HR lebih detail: ID Karyawan, Job Title,
03718:     // dst -- khusus halaman People/PI Personnel) TETAP digate seperti semula.
03719:     "personil": { permission: null, audit: false, idempotent: false, handler: "getPersonilList_", method: "GET" },
03720:     "piPersonnelMaster": { permission: "person.read", audit: false, idempotent: false, handler: "getPiPersonnelMaster_", method: "GET" },
03721:     "addPersonil": { permission: "person.manage", audit: true, idempotent: true, handler: "addPersonil_" },
03722:     "updatePersonil": { permission: "person.manage", audit: true, idempotent: true, handler: "updatePersonil_" },
03723:     "deletePersonil": { permission: "person.manage", audit: true, idempotent: true, handler: "deletePersonil_" },
03724:     "savePiPersonnelMaster": { permission: "person.manage", audit: true, idempotent: true, handler: "savePiPersonnelMaster_" },
03725:     "deletePiPersonnelMaster": { permission: "person.manage", audit: true, idempotent: true, handler: "deletePiPersonnelMaster_" },
~~~
- around worker line 3795
~~~text
03785:     "v4.createWarRoom": { permission: "omodos4.warroom", audit: true, idempotent: true, handler: "handleOmodos4_", method: "POST" },
03786:     "v4.updateWarRoom": { permission: "omodos4.warroom", audit: true, idempotent: true, handler: "handleOmodos4_", method: "POST" },
03787:     // THEME
03788:     "saveThemePref": { permission: null, audit: true, idempotent: true, handler: "handleSaveThemePref_" },
03789:     "saveStylePref": { permission: null, audit: true, idempotent: true, handler: "handleSaveStylePref_" }
03790:   };
03791:   function resolveAction_(action) {
03792:     return ACTION_REGISTRY[action] || null;
03793:   }
03794:   __name(resolveAction_, "resolveAction_");
03795:   function handleLogin_(body) {
03796:     var username = String(body.username || "").trim();
03797:     var password = String(body.password || "");
03798:     var rejectLogin_ = /* @__PURE__ */ __name(function(message, reason) {
03799:       if (username) {
03800:         try {
03801:           writeAuditLog_(username, "", "login_failed", "user", username, null, { username, reason: reason || "rejected" }, body.transactionId || "", "failed");
03802:         } catch (e) {
03803:         }
03804:       }
03805:       return jsonOut_({ ok: false, error: message });
~~~
- around worker line 3798
~~~text
03788:     "saveThemePref": { permission: null, audit: true, idempotent: true, handler: "handleSaveThemePref_" },
03789:     "saveStylePref": { permission: null, audit: true, idempotent: true, handler: "handleSaveStylePref_" }
03790:   };
03791:   function resolveAction_(action) {
03792:     return ACTION_REGISTRY[action] || null;
03793:   }
03794:   __name(resolveAction_, "resolveAction_");
03795:   function handleLogin_(body) {
03796:     var username = String(body.username || "").trim();
03797:     var password = String(body.password || "");
03798:     var rejectLogin_ = /* @__PURE__ */ __name(function(message, reason) {
03799:       if (username) {
03800:         try {
03801:           writeAuditLog_(username, "", "login_failed", "user", username, null, { username, reason: reason || "rejected" }, body.transactionId || "", "failed");
03802:         } catch (e) {
03803:         }
03804:       }
03805:       return jsonOut_({ ok: false, error: message });
03806:     }, "rejectLogin_");
03807:     if (!username || !password) return rejectLogin_("Username dan password wajib", "missing_credentials");
03808:     var foundRow = findUserRow_(username);
~~~
- around worker line 3801
~~~text
03791:   function resolveAction_(action) {
03792:     return ACTION_REGISTRY[action] || null;
03793:   }
03794:   __name(resolveAction_, "resolveAction_");
03795:   function handleLogin_(body) {
03796:     var username = String(body.username || "").trim();
03797:     var password = String(body.password || "");
03798:     var rejectLogin_ = /* @__PURE__ */ __name(function(message, reason) {
03799:       if (username) {
03800:         try {
03801:           writeAuditLog_(username, "", "login_failed", "user", username, null, { username, reason: reason || "rejected" }, body.transactionId || "", "failed");
03802:         } catch (e) {
03803:         }
03804:       }
03805:       return jsonOut_({ ok: false, error: message });
03806:     }, "rejectLogin_");
03807:     if (!username || !password) return rejectLogin_("Username dan password wajib", "missing_credentials");
03808:     var foundRow = findUserRow_(username);
03809:     if (!foundRow) return rejectLogin_("Username atau password salah.", "unknown_user");
03810:     var u = foundRow.user;
03811:     if (!normalizeBool_(u.Active)) return rejectLogin_("Akun non-aktif", "account_inactive");
~~~
- around worker line 3806
~~~text
03796:     var username = String(body.username || "").trim();
03797:     var password = String(body.password || "");
03798:     var rejectLogin_ = /* @__PURE__ */ __name(function(message, reason) {
03799:       if (username) {
03800:         try {
03801:           writeAuditLog_(username, "", "login_failed", "user", username, null, { username, reason: reason || "rejected" }, body.transactionId || "", "failed");
03802:         } catch (e) {
03803:         }
03804:       }
03805:       return jsonOut_({ ok: false, error: message });
03806:     }, "rejectLogin_");
03807:     if (!username || !password) return rejectLogin_("Username dan password wajib", "missing_credentials");
03808:     var foundRow = findUserRow_(username);
03809:     if (!foundRow) return rejectLogin_("Username atau password salah.", "unknown_user");
03810:     var u = foundRow.user;
03811:     if (!normalizeBool_(u.Active)) return rejectLogin_("Akun non-aktif", "account_inactive");
03812:     var ok = verifyPassword_(password, u.PasswordHash, u.Salt);
03813:     if (!ok) return rejectLogin_("Username atau password salah.", "invalid_password");
03814:     if (String(u.PasswordHash).indexOf("v2$") !== 0) {
03815:       try {
03816:         var newSalt = genSalt_(32);
~~~
- around worker line 3807
~~~text
03797:     var password = String(body.password || "");
03798:     var rejectLogin_ = /* @__PURE__ */ __name(function(message, reason) {
03799:       if (username) {
03800:         try {
03801:           writeAuditLog_(username, "", "login_failed", "user", username, null, { username, reason: reason || "rejected" }, body.transactionId || "", "failed");
03802:         } catch (e) {
03803:         }
03804:       }
03805:       return jsonOut_({ ok: false, error: message });
03806:     }, "rejectLogin_");
03807:     if (!username || !password) return rejectLogin_("Username dan password wajib", "missing_credentials");
03808:     var foundRow = findUserRow_(username);
03809:     if (!foundRow) return rejectLogin_("Username atau password salah.", "unknown_user");
03810:     var u = foundRow.user;
03811:     if (!normalizeBool_(u.Active)) return rejectLogin_("Akun non-aktif", "account_inactive");
03812:     var ok = verifyPassword_(password, u.PasswordHash, u.Salt);
03813:     if (!ok) return rejectLogin_("Username atau password salah.", "invalid_password");
03814:     if (String(u.PasswordHash).indexOf("v2$") !== 0) {
03815:       try {
03816:         var newSalt = genSalt_(32);
03817:         var newHash = hashPasswordV2_(password, newSalt, PBKDF2_ITERATIONS);
~~~

### fetch_handler — 20 sampled hit(s)
- around worker line 178
~~~text
00168:     } },
00169:     DriveApp: { Access: { ANYONE_WITH_LINK: 1 }, Permission: { VIEW: 1 }, getFolderById: folder, getFoldersByName: /* @__PURE__ */ __name((n) => iter([folder(n)]), "getFoldersByName"), createFolder: folder },
00170:     ContentService: { MimeType: { JSON: "application/json" }, createTextOutput(content) {
00171:       return { getContent: /* @__PURE__ */ __name(() => content, "getContent"), setMimeType() {
00172:         return this;
00173:       } };
00174:     } },
00175:     Session: { getScriptTimeZone: /* @__PURE__ */ __name(() => "Asia/Jakarta", "getScriptTimeZone") },
00176:     Logger: { log() {
00177:     } },
00178:     UrlFetchApp: { async fetch(url, opts = {}) {
00179:       const u = new URL(url);
00180:       if (!["generativelanguage.googleapis.com", "api.groq.com"].includes(u.hostname)) throw Error("AI host is not allowed");
00181:       const res = await fetch(url, { method: opts.method || "GET", headers: { ...opts.contentType ? { "Content-Type": opts.contentType } : {}, ...opts.headers }, body: opts.payload, signal: AbortSignal.timeout(2e4) });
00182:       const text = await res.text();
00183:       return { getResponseCode: /* @__PURE__ */ __name(() => res.status, "getResponseCode"), getContentText: /* @__PURE__ */ __name(() => text, "getContentText") };
00184:     } }
00185:   };
00186:   function commit() {
00187:     for (const [name, indices] of dirty) {
00188:       sql.exec("INSERT OR IGNORE INTO sheets(name) VALUES(?)", name);
~~~
- around worker line 181
~~~text
00171:       return { getContent: /* @__PURE__ */ __name(() => content, "getContent"), setMimeType() {
00172:         return this;
00173:       } };
00174:     } },
00175:     Session: { getScriptTimeZone: /* @__PURE__ */ __name(() => "Asia/Jakarta", "getScriptTimeZone") },
00176:     Logger: { log() {
00177:     } },
00178:     UrlFetchApp: { async fetch(url, opts = {}) {
00179:       const u = new URL(url);
00180:       if (!["generativelanguage.googleapis.com", "api.groq.com"].includes(u.hostname)) throw Error("AI host is not allowed");
00181:       const res = await fetch(url, { method: opts.method || "GET", headers: { ...opts.contentType ? { "Content-Type": opts.contentType } : {}, ...opts.headers }, body: opts.payload, signal: AbortSignal.timeout(2e4) });
00182:       const text = await res.text();
00183:       return { getResponseCode: /* @__PURE__ */ __name(() => res.status, "getResponseCode"), getContentText: /* @__PURE__ */ __name(() => text, "getContentText") };
00184:     } }
00185:   };
00186:   function commit() {
00187:     for (const [name, indices] of dirty) {
00188:       sql.exec("INSERT OR IGNORE INTO sheets(name) VALUES(?)", name);
00189:       if (deleted.has(name)) sql.exec("DELETE FROM sheet_rows WHERE sheet=?", name);
00190:       for (const n of indices) sql.exec("INSERT OR REPLACE INTO sheet_rows(sheet,n,data) VALUES(?,?,?)", name, n, encode(load(name)[n - 1] ?? []));
00191:     }
~~~
- around worker line 6710
~~~text
06700:   function deleteSparepartOpname_(body) {
06701:     const sh = getOrCreateSheet_(SHEET_SPAREPART_OPNAME, SPAREPART_OPNAME_HEADERS);
06702:     const found = findSparepartOpnameRow_(sh, body.id);
06703:     if (!found) return jsonOut_({ ok: false, error: "Data opname tidak ditemukan." });
06704:     sh.deleteRow(found.rowIndex);
06705:     return jsonOut_({ ok: true });
06706:   }
06707:   __name(deleteSparepartOpname_, "deleteSparepartOpname_");
06708:   async function callGeminiModel_(modelName, apiKey, payload) {
06709:     const url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent";
06710:     const response = await UrlFetchApp.fetch(url, {
06711:       method: "post",
06712:       contentType: "application/json",
06713:       headers: { "x-goog-api-key": apiKey },
06714:       payload: JSON.stringify(payload),
06715:       muteHttpExceptions: true
06716:     });
06717:     const httpCode = response.getResponseCode();
06718:     if (httpCode !== 200) {
06719:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06720:     }
~~~
- around worker line 6728
~~~text
06718:     if (httpCode !== 200) {
06719:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06720:     }
06721:     const raw = JSON.parse(response.getContentText());
06722:     const candidate = (raw.candidates || [])[0];
06723:     return { success: true, raw, candidate };
06724:   }
06725:   __name(callGeminiModel_, "callGeminiModel_");
06726:   async function callGroqModel_(modelName, apiKey, systemPrompt, userPrompt) {
06727:     const url = "https://api.groq.com/openai/v1/chat/completions";
06728:     const response = await UrlFetchApp.fetch(url, {
06729:       method: "post",
06730:       contentType: "application/json",
06731:       headers: { "Authorization": "Bearer " + apiKey },
06732:       payload: JSON.stringify({
06733:         model: modelName,
06734:         messages: [
06735:           { role: "system", content: systemPrompt },
06736:           { role: "user", content: userPrompt }
06737:         ],
06738:         max_tokens: 2048,
~~~
- around worker line 6754
~~~text
06744:     if (httpCode !== 200) {
06745:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06746:     }
06747:     const raw = JSON.parse(response.getContentText());
06748:     const text = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content || "";
06749:     return { success: true, text };
06750:   }
06751:   __name(callGroqModel_, "callGroqModel_");
06752:   async function getGroqAvailableModels_(apiKey) {
06753:     try {
06754:       const response = await UrlFetchApp.fetch("https://api.groq.com/openai/v1/models", {
06755:         method: "get",
06756:         headers: { "Authorization": "Bearer " + apiKey },
06757:         muteHttpExceptions: true
06758:       });
06759:       if (response.getResponseCode() !== 200) return [];
06760:       const raw = JSON.parse(response.getContentText());
06761:       const rows = Array.isArray(raw.data) ? raw.data : [];
06762:       return rows.map(function(x) {
06763:         return String(x.id || "");
06764:       }).filter(function(id) {
~~~
- around worker line 7186
~~~text
07176:     Logger.log("Migrasi selesai.");
07177:   }
07178:   __name(migrateAddNewColumns, "migrateAddNewColumns");
07179:   async function authorizeAiFeature() {
07180:     const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
07181:     if (!apiKey) {
07182:       Logger.log("GEMINI_API_KEY belum diatur di Cloudflare Worker Secrets.");
07183:       return;
07184:     }
07185:     const url = "https://generativelanguage.googleapis.com/v1beta/models/" + GEMINI_MODELS[0] + ":generateContent";
07186:     const response = await UrlFetchApp.fetch(url, {
07187:       method: "post",
07188:       contentType: "application/json",
07189:       headers: { "x-goog-api-key": apiKey },
07190:       payload: JSON.stringify({
07191:         contents: [{ role: "user", parts: [{ text: 'Balas dengan kata "OK" saja.' }] }]
07192:       }),
07193:       muteHttpExceptions: true
07194:     });
07195:     Logger.log("Kode status: " + response.getResponseCode());
07196:     Logger.log("Respons: " + response.getContentText().slice(0, 300));
~~~
- around worker line 9312
~~~text
09302:     this.env = env;
09303:     this.tail = Promise.resolve();
09304:     this.rate = /* @__PURE__ */ new Map();
09305:   }
09306:   enqueue(fn) {
09307:     const task = this.tail.then(fn);
09308:     this.tail = task.catch(() => {
09309:     });
09310:     return task;
09311:   }
09312:   async fetch(request) {
09313:     let body;
09314:     if (request.method === "POST" && new URL(request.url).pathname === "/api") {
09315:       if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09316:       try {
09317:         body = await request.json();
09318:       } catch {
09319:         return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
09320:       }
09321:       if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
09322:     }
~~~
- around worker line 9314
~~~text
09304:     this.rate = /* @__PURE__ */ new Map();
09305:   }
09306:   enqueue(fn) {
09307:     const task = this.tail.then(fn);
09308:     this.tail = task.catch(() => {
09309:     });
09310:     return task;
09311:   }
09312:   async fetch(request) {
09313:     let body;
09314:     if (request.method === "POST" && new URL(request.url).pathname === "/api") {
09315:       if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09316:       try {
09317:         body = await request.json();
09318:       } catch {
09319:         return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
09320:       }
09321:       if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
09322:     }
09323:     return this.enqueue(() => this.run(request, body));
09324:   }
~~~
- around worker line 9362
~~~text
09352:       return json({ ok: false, error: err }, String(body && body.action || "").startsWith("v4.") ? v4Status(err) : 400);
09353:     }
09354:   }
09355:   async run(request, parsedBody) {
09356:     const url = new URL(request.url), sql = this.state.storage.sql;
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
~~~
- around worker line 9416
~~~text
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
09409:             if (m[2]) end = Math.min(end, Number(m[2]));
09410:           } else start = Math.max(0, f.size - Number(m[2]));
09411:           if (start > end || start >= f.size) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09412:           headers["Content-Range"] = `bytes ${start}-${end}/${f.size}`;
09413:           headers["Content-Length"] = String(end - start + 1);
09414:           return new Response(f.data.subarray(start, end + 1), { status: 206, headers });
09415:         }
09416:         return new Response(request.method === "HEAD" ? null : f.data, { headers });
09417:       }
09418:       const token = (request.headers.get("Authorization") || "").replace(/^Bearer /, "");
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
~~~
- around worker line 9430
~~~text
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
09433:         const all = store.listProperties();
09434:         const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
09435:         const safe = all.filter((x) => !sensitive.test(x.key));
09436:         const excludedKeys = all.filter((x) => sensitive.test(x.key)).map((x) => x.key);
09437:         backend.auditSystemEvent({
09438:           actor: auth.session.username,
09439:           role: auth.session.role,
09440:           action: "backup.config.list",
~~~
- around worker line 9453
~~~text
09443:         });
09444:         transact(() => store.commit());
09445:         return json({ ok: true, data: {
09446:           properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
09447:           excludedKeys,
09448:           secretsIncluded: false,
09449:           note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
09450:         } });
09451:       }
09452:       if (url.pathname === "/api/backup/files") {
09453:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09454:         const auth = backupAuth();
09455:         if (auth.response) return auth.response;
09456:         const files = store.listFiles();
09457:         backend.auditSystemEvent({
09458:           actor: auth.session.username,
09459:           role: auth.session.role,
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
09463:         });
~~~

### route_path — 15 sampled hit(s)
- around worker line 6727
~~~text
06717:     const httpCode = response.getResponseCode();
06718:     if (httpCode !== 200) {
06719:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06720:     }
06721:     const raw = JSON.parse(response.getContentText());
06722:     const candidate = (raw.candidates || [])[0];
06723:     return { success: true, raw, candidate };
06724:   }
06725:   __name(callGeminiModel_, "callGeminiModel_");
06726:   async function callGroqModel_(modelName, apiKey, systemPrompt, userPrompt) {
06727:     const url = "https://api.groq.com/openai/v1/chat/completions";
06728:     const response = await UrlFetchApp.fetch(url, {
06729:       method: "post",
06730:       contentType: "application/json",
06731:       headers: { "Authorization": "Bearer " + apiKey },
06732:       payload: JSON.stringify({
06733:         model: modelName,
06734:         messages: [
06735:           { role: "system", content: systemPrompt },
06736:           { role: "user", content: userPrompt }
06737:         ],
~~~
- around worker line 6754
~~~text
06744:     if (httpCode !== 200) {
06745:       return { success: false, httpCode, errorText: response.getContentText().slice(0, 300) };
06746:     }
06747:     const raw = JSON.parse(response.getContentText());
06748:     const text = raw.choices && raw.choices[0] && raw.choices[0].message && raw.choices[0].message.content || "";
06749:     return { success: true, text };
06750:   }
06751:   __name(callGroqModel_, "callGroqModel_");
06752:   async function getGroqAvailableModels_(apiKey) {
06753:     try {
06754:       const response = await UrlFetchApp.fetch("https://api.groq.com/openai/v1/models", {
06755:         method: "get",
06756:         headers: { "Authorization": "Bearer " + apiKey },
06757:         muteHttpExceptions: true
06758:       });
06759:       if (response.getResponseCode() !== 200) return [];
06760:       const raw = JSON.parse(response.getContentText());
06761:       const rows = Array.isArray(raw.data) ? raw.data : [];
06762:       return rows.map(function(x) {
06763:         return String(x.id || "");
06764:       }).filter(function(id) {
~~~
- around worker line 9314
~~~text
09304:     this.rate = /* @__PURE__ */ new Map();
09305:   }
09306:   enqueue(fn) {
09307:     const task = this.tail.then(fn);
09308:     this.tail = task.catch(() => {
09309:     });
09310:     return task;
09311:   }
09312:   async fetch(request) {
09313:     let body;
09314:     if (request.method === "POST" && new URL(request.url).pathname === "/api") {
09315:       if (Number(request.headers.get("Content-Length") || 0) > 50 * 1024 * 1024) return json({ ok: false, error: "UPLOAD_TOO_LARGE" }, 413);
09316:       try {
09317:         body = await request.json();
09318:       } catch {
09319:         return json({ ok: false, error: "VALIDATION_ERROR: Invalid JSON" }, 400);
09320:       }
09321:       if (["aiAnalyze", "aiGroq", "aiInternetResearch", "aiKbEnrich", "groqFixTypo", "groqKbEnrich", "v4.aiAsk"].includes(body.action)) return this.ai(request, body);
09322:     }
09323:     return this.enqueue(() => this.run(request, body));
09324:   }
~~~
- around worker line 9361
~~~text
09351:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09352:       return json({ ok: false, error: err }, String(body && body.action || "").startsWith("v4.") ? v4Status(err) : 400);
09353:     }
09354:   }
09355:   async run(request, parsedBody) {
09356:     const url = new URL(request.url), sql = this.state.storage.sql;
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
~~~
- around worker line 9365
~~~text
09355:   async run(request, parsedBody) {
09356:     const url = new URL(request.url), sql = this.state.storage.sql;
09357:     this.init(request);
09358:     const store = this.store, backend = this.backend;
09359:     const transact = /* @__PURE__ */ __name((fn) => this.state.storage.transactionSync(fn), "transact");
09360:     try {
09361:       if (url.pathname.startsWith("/api/setup/")) {
09362:         if (request.method !== "POST" || !equal(request.headers.get("X-Setup-Token"), this.env.SETUP_TOKEN)) return json({ ok: false, error: "FORBIDDEN" }, 403);
09363:         if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") === "1") return json({ ok: false, error: "SETUP_CLOSED" }, 409);
09364:         const body = await request.json();
09365:         if (url.pathname === "/api/setup/import") {
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
~~~
- around worker line 9376
~~~text
09366:           if (typeof body.name !== "string" || !Array.isArray(body.rows) || body.rows.some((r) => !Array.isArray(r))) return json({ ok: false, error: "INVALID_IMPORT" }, 400);
09367:           const hash = createHash2("sha256").update(encode(body.rows)).digest("hex");
09368:           const key = "IMPORT_" + body.name;
09369:           const prev = store.services.PropertiesService.getScriptProperties().getProperty(key);
09370:           if (prev === hash) return json({ ok: true, reused: true });
09371:           store.importSheet(body.name, body.rows);
09372:           store.services.PropertiesService.getScriptProperties().setProperty(key, hash);
09373:           transact(() => store.commit());
09374:           return json({ ok: true, sheet: body.name, records: Math.max(0, body.rows.length - 1) });
09375:         }
09376:         if (url.pathname === "/api/setup/finish") {
09377:           const sheets = store.spreadsheet.getSheets();
09378:           if (!Array.isArray(body.sheets) || body.sheets.length !== sheets.length) return json({ ok: false, error: "IMPORT_INCOMPLETE" }, 400);
09379:           for (const item of body.sheets) {
09380:             const s = store.spreadsheet.getSheetByName(item.name);
09381:             if (!s || Math.max(0, s.getLastRow() - 1) !== item.rows) return json({ ok: false, error: "IMPORT_COUNT_MISMATCH: " + item.name }, 400);
09382:           }
09383:           const users = store.spreadsheet.getSheetByName("Users");
09384:           if (!users || users.getLastRow() < 2) return json({ ok: false, error: "USERS_REQUIRED" }, 400);
09385:           const sessions = store.spreadsheet.getSheetByName("Sessions");
09386:           if (sessions && sessions.getLastRow() > 1) {
~~~
- around worker line 9397
~~~text
09387:             const headers = sessions.getRange(1, 1, 1, sessions.getLastColumn()).getValues()[0], col = headers.indexOf("RevokedAt");
09388:             if (col >= 0) sessions.getRange(2, col + 1, sessions.getLastRow() - 1, 1).setValues(Array.from({ length: sessions.getLastRow() - 1 }, () => [/* @__PURE__ */ new Date()]));
09389:           }
09390:           store.services.PropertiesService.getScriptProperties().setProperty("MIGRATION_READY", "1");
09391:           transact(() => store.commit());
09392:           return json({ ok: true, ready: true });
09393:         }
09394:         return json({ ok: false, error: "NOT_FOUND" }, 404);
09395:       }
09396:       if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") return json({ ok: false, error: "DATABASE_NOT_IMPORTED: Administrator perlu mengimpor database." }, 503);
09397:       if (url.pathname.startsWith("/files/")) {
09398:         const f = store.file(url.pathname.slice(7));
09399:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09400:         const inline = /^(image\/(png|jpeg|gif|webp)|video\/|audio\/|application\/pdf)/.test(f.mime);
09401:         const headers = { "Content-Type": f.mime, "Content-Length": String(f.size), "Accept-Ranges": "bytes", "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" };
09402:         const range = request.headers.get("Range");
09403:         if (range) {
09404:           const m = /^bytes=(\d*)-(\d*)$/.exec(range);
09405:           let start = 0, end = f.size - 1;
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
~~~
- around worker line 9398
~~~text
09388:             if (col >= 0) sessions.getRange(2, col + 1, sessions.getLastRow() - 1, 1).setValues(Array.from({ length: sessions.getLastRow() - 1 }, () => [/* @__PURE__ */ new Date()]));
09389:           }
09390:           store.services.PropertiesService.getScriptProperties().setProperty("MIGRATION_READY", "1");
09391:           transact(() => store.commit());
09392:           return json({ ok: true, ready: true });
09393:         }
09394:         return json({ ok: false, error: "NOT_FOUND" }, 404);
09395:       }
09396:       if (store.services.PropertiesService.getScriptProperties().getProperty("MIGRATION_READY") !== "1") return json({ ok: false, error: "DATABASE_NOT_IMPORTED: Administrator perlu mengimpor database." }, 503);
09397:       if (url.pathname.startsWith("/files/")) {
09398:         const f = store.file(url.pathname.slice(7));
09399:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09400:         const inline = /^(image\/(png|jpeg|gif|webp)|video\/|audio\/|application\/pdf)/.test(f.mime);
09401:         const headers = { "Content-Type": f.mime, "Content-Length": String(f.size), "Accept-Ranges": "bytes", "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(f.name)}`, "Cache-Control": "private, max-age=3600", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "sandbox; default-src 'none'" };
09402:         const range = request.headers.get("Range");
09403:         if (range) {
09404:           const m = /^bytes=(\d*)-(\d*)$/.exec(range);
09405:           let start = 0, end = f.size - 1;
09406:           if (!m || !m[1] && !m[2]) return new Response(null, { status: 416, headers: { "Content-Range": "bytes */" + f.size } });
09407:           if (m[1]) {
09408:             start = Number(m[1]);
~~~
- around worker line 9429
~~~text
09419:       const backupAuth = /* @__PURE__ */ __name(() => {
09420:         if (!token) return { response: json({ ok: false, error: "AUTH_REQUIRED" }, 401) };
09421:         try {
09422:           const session = backend.requireSession(token);
09423:           if (session.role !== "Superadmin") return { response: json({ ok: false, error: "FORBIDDEN" }, 403) };
09424:           return { session };
09425:         } catch (e) {
09426:           return { response: json({ ok: false, error: (e.code ? e.code + ": " : "") + (e.message || String(e)) }, 401) };
09427:         }
09428:       }, "backupAuth");
09429:       if (url.pathname === "/api/backup/config") {
09430:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09431:         const auth = backupAuth();
09432:         if (auth.response) return auth.response;
09433:         const all = store.listProperties();
09434:         const sensitive = /password|secret|token|api[_-]?key|gemini|groq|setup/i;
09435:         const safe = all.filter((x) => !sensitive.test(x.key));
09436:         const excludedKeys = all.filter((x) => sensitive.test(x.key)).map((x) => x.key);
09437:         backend.auditSystemEvent({
09438:           actor: auth.session.username,
09439:           role: auth.session.role,
~~~
- around worker line 9452
~~~text
09442:           payload: { safePropertyCount: safe.length, excludedPropertyCount: excludedKeys.length }
09443:         });
09444:         transact(() => store.commit());
09445:         return json({ ok: true, data: {
09446:           properties: Object.fromEntries(safe.map((x) => [x.key, x.value])),
09447:           excludedKeys,
09448:           secretsIncluded: false,
09449:           note: "Sensitive properties are intentionally excluded and must be restored through approved secret management."
09450:         } });
09451:       }
09452:       if (url.pathname === "/api/backup/files") {
09453:         if (request.method !== "GET") return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09454:         const auth = backupAuth();
09455:         if (auth.response) return auth.response;
09456:         const files = store.listFiles();
09457:         backend.auditSystemEvent({
09458:           actor: auth.session.username,
09459:           role: auth.session.role,
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
~~~
- around worker line 9467
~~~text
09457:         backend.auditSystemEvent({
09458:           actor: auth.session.username,
09459:           role: auth.session.role,
09460:           action: "backup.files.list",
09461:           entity: "SYSTEM_BACKUP",
09462:           payload: { fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) }
09463:         });
09464:         transact(() => store.commit());
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
09475:           return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
09476:         }
09477:         const f = store.file(id);
~~~
- around worker line 9473
~~~text
09463:         });
09464:         transact(() => store.commit());
09465:         return json({ ok: true, data: { files, fileCount: files.length, totalBytes: files.reduce((n, x) => n + x.size, 0) } });
09466:       }
09467:       if (url.pathname.startsWith("/api/backup/file/")) {
09468:         if (!["GET", "HEAD"].includes(request.method)) return json({ ok: false, error: "METHOD_NOT_ALLOWED" }, 405);
09469:         const auth = backupAuth();
09470:         if (auth.response) return auth.response;
09471:         let id = "";
09472:         try {
09473:           id = decodeURIComponent(url.pathname.slice("/api/backup/file/".length));
09474:         } catch {
09475:           return json({ ok: false, error: "INVALID_FILE_ID" }, 400);
09476:         }
09477:         const f = store.file(id);
09478:         if (!f) return json({ ok: false, error: "FILE_NOT_FOUND" }, 404);
09479:         return new Response(request.method === "HEAD" ? null : f.data, { headers: {
09480:           "Content-Type": f.mime || "application/octet-stream",
09481:           "Content-Length": String(f.size),
09482:           "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(f.name || "attachment")}`,
09483:           "Cache-Control": "no-store",
~~~

### json_response — 20 sampled hit(s)
- around worker line 9
~~~text
00001: var __defProp = Object.defineProperty;
00002: var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
00003: 
00004: // src/worker.mjs
00005: import { DurableObject } from "cloudflare:workers";
00006: 
00007: // src/storage.mjs
00008: import { createHash, createHmac, randomUUID } from "node:crypto";
00009: var encode = /* @__PURE__ */ __name((value) => JSON.stringify(value, function(k, v) {
00010:   return this[k] instanceof Date ? { $date: this[k].toISOString() } : v;
00011: }), "encode");
00012: var decode = /* @__PURE__ */ __name((value) => JSON.parse(value, (k, v) => v && typeof v === "object" && Object.keys(v).length === 1 && v.$date ? new Date(v.$date) : v), "decode");
00013: var clone = /* @__PURE__ */ __name((v) => decode(encode(v)), "clone");
00014: function createStorage(sql, env = {}, origin = "http://localhost:8787") {
00015:   sql.exec("CREATE TABLE IF NOT EXISTS sheets(name TEXT PRIMARY KEY)");
00016:   sql.exec("CREATE TABLE IF NOT EXISTS sheet_rows(sheet TEXT NOT NULL,n INTEGER NOT NULL,data TEXT NOT NULL,PRIMARY KEY(sheet,n))");
00017:   sql.exec("CREATE TABLE IF NOT EXISTS props(k TEXT PRIMARY KEY,v TEXT)");
00018:   sql.exec("CREATE TABLE IF NOT EXISTS files(id TEXT PRIMARY KEY,name TEXT,mime TEXT,size INTEGER)");
00019:   sql.exec("CREATE TABLE IF NOT EXISTS file_chunks(id TEXT,n INTEGER,data BLOB,PRIMARY KEY(id,n))");
~~~
- around worker line 170
~~~text
00160:     } }), "getDocumentLock") },
00161:     Utilities: { getUuid: randomUUID, DigestAlgorithm: { SHA_256: "sha256" }, Charset: { UTF_8: "utf8" }, computeDigest: /* @__PURE__ */ __name((a, s) => Array.from(createHash("sha256").update(typeof s === "string" ? s : bytes(s)).digest()), "computeDigest"), computeHmacSha256Signature: /* @__PURE__ */ __name((v, k) => Array.from(createHmac("sha256", bytes(k)).update(bytes(v)).digest()), "computeHmacSha256Signature"), base64Decode: /* @__PURE__ */ __name((s) => Array.from(Buffer.from(s, "base64")), "base64Decode"), newBlob(v, mime, name) {
00162:       return { buffer: bytes(v), mime, name, getBytes() {
00163:         return Array.from(this.buffer);
00164:       } };
00165:     }, formatDate(d, tz, pattern) {
00166:       const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).formatToParts(new Date(d)).map((x) => [x.type, x.value]));
00167:       return pattern.replace(/yyyy|MM|dd|HH|mm|ss/g, (x) => ({ yyyy: p.year, MM: p.month, dd: p.day, HH: p.hour, mm: p.minute, ss: p.second })[x]);
00168:     } },
00169:     DriveApp: { Access: { ANYONE_WITH_LINK: 1 }, Permission: { VIEW: 1 }, getFolderById: folder, getFoldersByName: /* @__PURE__ */ __name((n) => iter([folder(n)]), "getFoldersByName"), createFolder: folder },
00170:     ContentService: { MimeType: { JSON: "application/json" }, createTextOutput(content) {
00171:       return { getContent: /* @__PURE__ */ __name(() => content, "getContent"), setMimeType() {
00172:         return this;
00173:       } };
00174:     } },
00175:     Session: { getScriptTimeZone: /* @__PURE__ */ __name(() => "Asia/Jakarta", "getScriptTimeZone") },
00176:     Logger: { log() {
00177:     } },
00178:     UrlFetchApp: { async fetch(url, opts = {}) {
00179:       const u = new URL(url);
00180:       if (!["generativelanguage.googleapis.com", "api.groq.com"].includes(u.hostname)) throw Error("AI host is not allowed");
~~~
- around worker line 256
~~~text
00246: import { pbkdf2Sync as nativePbkdf2 } from "node:crypto";
00247: 
00248: // src/kpi_department_source.mjs
00249: var KPI_DEPARTMENT_SOURCE_META = { "sourceFile": "04_Kertas_Kerja_Offset_Technical-2026_Dashboard_Rev.003(2).xlsx", "version": "KPI-OFFSET-2026-REV003-2-20260911", "year": 2026, "latestActualMonth": "Jul", "kpiCount": 9, "rawRowCount": 763, "sourceSheets": [{ "sheet": "Dashboard", "dimension": "A1:Q29", "nonEmptyCells": 104, "formulaCells": 37, "errorCells": 0 }, { "sheet": "Kertas Kerja", "dimension": "A2:CA579", "nonEmptyCells": 765, "formulaCells": 323, "errorCells": 0 }, { "sheet": "Kertas Kerja (Simple View)", "dimension": "A1:N16", "nonEmptyCells": 121, "formulaCells": 65, "errorCells": 0 }, { "sheet": "chart_Printing", "dimension": "A1:AM106", "nonEmptyCells": 1029, "formulaCells": 518, "errorCells": 2 }, { "sheet": "visual chart_Printing MTD", "dimension": "B2:P31", "nonEmptyCells": 264, "formulaCells": 160, "errorCells": 160 }, { "sheet": "visual chart_Printing YTD", "dimension": "B2:P31", "nonEmptyCells": 211, "formulaCells": 131, "errorCells": 131 }, { "sheet": "Chart_Conv 01 Autoplaten", "dimension": "A1:BF127", "nonEmptyCells": 1526, "formulaCells": 605, "errorCells": 0 }, { "sheet": "Chart_Conv 02 Folder Gluer", "dimension": "A1:AQ119", "nonEmptyCells": 1476, "formulaCells": 299, "errorCells": 0 }, { "sheet": "Summary Converting '23", "dimension": "A3:AP114", "nonEmptyCells": 2660, "formulaCells": 2213, "errorCells": 2312 }, { "sheet": "Yearly_Printing", "dimension": "A1:Q82", "nonEmptyCells": 613, "formulaCells": 270, "errorCells": 0 }, { "sheet": "Yearly_Conv", "dimension": "A1:AM128", "nonEmptyCells": 1199, "formulaCells": 658, "errorCells": 554 }, { "sheet": "Record YTD", "dimension": "A1:DO49", "nonEmptyCells": 477, "formulaCells": 38, "errorCells": 0 }, { "sheet": "Sheet1", "dimension": "A1", "nonEmptyCells": 0, "formulaCells": 0, "errorCells": 0 }],
00250: var KPI_DEPARTMENT_MTD = [{ "Tahun": 2026, "No": 1, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Printing (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "Bulanan", "Target Tahunan": 5, "Source Sheet": "Kertas Kerja", "Source Row": 11, "Target Jan": 5, "Realisasi Jan": 15.656296882092782, "Target Feb": 5, "Realisasi Feb": 6.318747117483973, "Target Mar": 5, "Realisasi Mar": 4.68920625484085, "Target Apr": 5, "Realisasi Apr": 15.525870963318084, "Target Mei": 5, "Realisasi Mei": 7.62377114441052, "Target Jun": 5, "Realisasi Jun": 10.916110861630836, "Target Jul": 5, "Realisasi Jul": 3.898408072337987, "Target Agust": 5, "Realisasi Agust": null, "Target Sep": 5, "Realisasi Sep": null, "Target Okt": 5, "Realisasi Okt": null, "Target Nop": 5, "Realisasi Nop": null, "Target Des": 5, "Realisasi Des": null }, { "Tahun": 2026, "No": 2, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Converting 01 AP (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "Bulanan", "Target Tahunan": 2, "Source Sheet": "Kertas Kerja", "Source Row": 12, "Target Jan": 2, "Realisasi Jan": 1.8066575826949087, "Target Feb": 2, "Realisasi Feb": 2.3813616720139623, "Target Mar": 2, "Realisasi Mar": 1.8161812164068791, "Target Apr": 2, "Realisasi Apr": 3.0814213748533916, "Target Mei": 2, "Realisasi Mei": 0.3269207893359613, "Target Jun": 2, "Realisasi Jun": 6.340006045444016, "Target Jul": 2, "Realisasi Jul": 1.566130196892243, "Target Agust": 2, "Realisasi Agust": null
00251: var KPI_DEPARTMENT_YTD = [{ "Tahun": 2026, "No": 1, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Printing (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "YTD", "Target Tahunan": 5, "Source Sheet": "Kertas Kerja", "Source Row": 22, "Target Jan": 5, "Realisasi Jan": 15.656296882092782, "Target Feb": 5, "Realisasi Feb": 11.009574678385617, "Target Mar": 5, "Realisasi Mar": 8.957941913971162, "Target Apr": 5, "Realisasi Apr": 10.69799853235145, "Target Mei": 5, "Realisasi Mei": 10.0440198337798, "Target Jun": 5, "Realisasi Jun": 10.181384495000538, "Target Jul": 5, "Realisasi Jul": 9.419773229058473, "Target Agust": 5, "Realisasi Agust": null, "Target Sep": 5, "Realisasi Sep": null, "Target Okt": 5, "Realisasi Okt": null, "Target Nop": 5, "Realisasi Nop": null, "Target Des": 5, "Realisasi Des": null }, { "Tahun": 2026, "No": 2, "Perspective": "INTERNAL BUSINESS PROCESS", "Data Producer": "Offset - Technical", "Divisi": "Offset", "Department": "Offset Technical", "KPI": "Machine Loss Time - Converting 01 AP (%)", "Satuan": "%", "Polaritas": "Minimized", "Rumus": "(Losthrs/RunHrs)*100", "Periode Perhitungan": "YTD", "Target Tahunan": 2, "Source Sheet": "Kertas Kerja", "Source Row": 23, "Target Jan": 2, "Realisasi Jan": 1.8066575826949087, "Target Feb": 2, "Realisasi Feb": 2.189124738528858, "Target Mar": 2, "Realisasi Mar": 2.027823155545782, "Target Apr": 2, "Realisasi Apr": 2.336493422781958, "Target Mei": 2, "Realisasi Mei": 1.902142010372774, "Target Jun": 2, "Realisasi Jun": 2.722265297883894, "Target Jul": 2, "Realisasi Jul": 2.553848761980074, "Target Agust": 2, "Realisasi Agust": null, "Target S
00252: var KPI_DEPARTMENT_RAW_ROWS = [{ "Sheet": "Dashboard", "Row": 1, "DataJSON": '{"P":"MonthLookup"}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 2, "DataJSON": '{"B":"OFFSET - TECHNICAL PERFORMANCE DASHBOARD","P":"Jan","Q":12}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 3, "DataJSON": '{"P":"Feb","Q":14}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 4, "DataJSON": '{"P":"Mar","Q":16}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 5, "DataJSON": `{"B":"PILIH BULAN","D":"PILIH TAHUN","F":"Kartu KPI di bawah otomatis mengambil data TARGET & REALISASI bulan/tahun terpilih dari sheet 'Kertas Kerja' (sumber data asli, tidak diubah).","P":"Apr","Q":18}`, "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 6, "DataJSON": '{"B":"Jul","D":2026,"F":"Periode ditampilkan: Jul 2026","P":"Mei","Q":20}', "FormulaJSON": '{"F":"CONCATENATE(\\"Periode ditampilkan: \\",$B$6,\\" \\",$D$6)"}' }, { "Sheet": "Dashboard", "Row": 7, "DataJSON": '{"P":"Jun","Q":22}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 8, "DataJSON": '{"B":"Machine Loss Time - Printing (%)","F":"Machine Loss Time - Converting 01 AP (%)","J":"Machine Loss Time - Converting 02 FG (%)","P":"Jul","Q":24}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 9, "DataJSON": '{"B":"Divisi: Offset   |   Satuan: %   |   Minimized","F":"Divisi: Offset   |   Satuan: %   |   Minimized","J":"Divisi: Offset   |   Satuan: %   |   Minimized","P":"Agust","Q":26}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 10, "DataJSON": '{"B":"TARGET","C":"REALISASI","F":"TARGET","G":"REALISASI","J":"TARGET","K":"REALISASI","P":"Sep","Q":28}', "FormulaJSON": "{}" }, { "Sheet": "Dashboard", "Row": 11, "DataJSON": '{"B":5,"C":3.898408072337987,"F":2,"G":1.566130196892243,"J":2,"K":3.48958376
00253: 
00254: // src/omodos4.mjs
00255: function createOmodos4({ SpreadsheetApp, Utilities, ContentService, Session }) {
00256:   const json2 = /* @__PURE__ */ __name((value) => ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON), "json");
00257:   const ss = /* @__PURE__ */ __name(() => SpreadsheetApp.getActiveSpreadsheet(), "ss");
00258:   const nowIso = /* @__PURE__ */ __name(() => (/* @__PURE__ */ new Date()).toISOString(), "nowIso");
00259:   const uuid = /* @__PURE__ */ __name(() => Utilities && Utilities.getUuid ? Utilities.getUuid() : "v4_" + Date.now() + "_" + Math.random().toString(36).slice(2), "uuid");
00260:   const SHEETS = {
00261:     machines: "Master_Mesin",
00262:     logbook: "Logbook",
00263:     predictive: "Predictive_Maintenance",
00264:     patrolTemplate: "Patrol_Checklist_Template",
00265:     sparepartLokasi: "Sparepart_Lokasi",
00266:     sparepartEta: "Sparepart_ETA",
~~~
- around worker line 1919
~~~text
01909:   }
01910:   __name(runScenario, "runScenario");
01911:   const SCENARIO_HEADERS = ["ID", "Name", "CreatedAt", "Actor", "ParamsJSON", "Status"];
01912:   const SCENARIO_RESULT_HEADERS = ["ID", "ScenarioID", "GeneratedAt", "LogicVersion", "ResultJSON"];
01913:   function saveScenario(body) {
01914:     const name = text(body.name);
01915:     if (!name) return { ok: false, error: "VALIDATION_ERROR: name wajib" };
01916:     const result = runScenario(body);
01917:     if (!result.ok) return result;
01918:     const id = uuid(), ts = nowIso();
01919:     ensureSheet("V4_Scenario", SCENARIO_HEADERS).appendRow([id, name, ts, text(body.actor), JSON.stringify(result.data.params), "SAVED"]);
01920:     ensureSheet("V4_Scenario_Result", SCENARIO_RESULT_HEADERS).appendRow([uuid(), id, ts, result.data.logicVersion, JSON.stringify(result.data)]);
01921:     return { ok: true, data: { id, name, savedAt: ts, result: result.data } };
01922:   }
01923:   __name(saveScenario, "saveScenario");
01924:   function getScenarios() {
01925:     const scenarios = rows("V4_Scenario").sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 100);
01926:     const results = rows("V4_Scenario_Result");
01927:     return { ok: true, data: { scenarios: scenarios.map((s) => {
01928:       const last = results.filter((r) => text(r.ScenarioID) === text(s.ID)).sort((a, b) => dateValue(b) - dateValue(a))[0];
01929:       return { scenario: cleanRecord(s, 12), latestResult: last ? cleanRecord(last, 8) : null };
~~~
- around worker line 1920
~~~text
01910:   __name(runScenario, "runScenario");
01911:   const SCENARIO_HEADERS = ["ID", "Name", "CreatedAt", "Actor", "ParamsJSON", "Status"];
01912:   const SCENARIO_RESULT_HEADERS = ["ID", "ScenarioID", "GeneratedAt", "LogicVersion", "ResultJSON"];
01913:   function saveScenario(body) {
01914:     const name = text(body.name);
01915:     if (!name) return { ok: false, error: "VALIDATION_ERROR: name wajib" };
01916:     const result = runScenario(body);
01917:     if (!result.ok) return result;
01918:     const id = uuid(), ts = nowIso();
01919:     ensureSheet("V4_Scenario", SCENARIO_HEADERS).appendRow([id, name, ts, text(body.actor), JSON.stringify(result.data.params), "SAVED"]);
01920:     ensureSheet("V4_Scenario_Result", SCENARIO_RESULT_HEADERS).appendRow([uuid(), id, ts, result.data.logicVersion, JSON.stringify(result.data)]);
01921:     return { ok: true, data: { id, name, savedAt: ts, result: result.data } };
01922:   }
01923:   __name(saveScenario, "saveScenario");
01924:   function getScenarios() {
01925:     const scenarios = rows("V4_Scenario").sort((a, b) => dateValue(b) - dateValue(a)).slice(0, 100);
01926:     const results = rows("V4_Scenario_Result");
01927:     return { ok: true, data: { scenarios: scenarios.map((s) => {
01928:       const last = results.filter((r) => text(r.ScenarioID) === text(s.ID)).sort((a, b) => dateValue(b) - dateValue(a))[0];
01929:       return { scenario: cleanRecord(s, 12), latestResult: last ? cleanRecord(last, 8) : null };
01930:     }) } };
~~~
- around worker line 2405
~~~text
02395:     return sh;
02396:   }
02397:   __name(ensureSheet, "ensureSheet");
02398:   const WAR_HEADERS = ["ID", "Title", "Machine", "Severity", "Status", "StartedAt", "UpdatedAt", "Owner", "NextCheckpoint", "Summary", "CreatedBy"];
02399:   const WAR_EVENT_HEADERS = ["ID", "WarRoomID", "Timestamp", "Type", "Message", "Actor", "DataJSON"];
02400:   function createWarRoom(body) {
02401:     const title = text(body.title), machine = text(body.machine);
02402:     if (!title || !machine) return { ok: false, error: "VALIDATION_ERROR: title dan machine wajib" };
02403:     const id = uuid(), ts = nowIso();
02404:     ensureSheet("V4_War_Room", WAR_HEADERS).appendRow([id, title, machine, text(body.severity) || "P1", "OPEN", ts, ts, text(body.owner), text(body.nextCheckpoint), text(body.summary), text(body.actor)]);
02405:     ensureSheet("V4_War_Room_Event", WAR_EVENT_HEADERS).appendRow([uuid(), id, ts, "created", "War Room created", text(body.actor), JSON.stringify({ severity: body.severity || "P1" })]);
02406:     return { ok: true, data: { id, title, machine, status: "OPEN", startedAt: ts } };
02407:   }
02408:   __name(createWarRoom, "createWarRoom");
02409:   function updateWarRoom(body) {
02410:     const id = text(body.id || body.warRoomId);
02411:     if (!id) return { ok: false, error: "VALIDATION_ERROR: id wajib" };
02412:     const sh = ensureSheet("V4_War_Room", WAR_HEADERS), values = sh.getDataRange().getValues(), h = values[0], idCol = h.indexOf("ID");
02413:     let row = -1;
02414:     for (let i = 1; i < values.length; i++) if (text(values[i][idCol]) === id) {
02415:       row = i + 1;
~~~
- around worker line 2442
~~~text
02432:       if (patch[k] !== void 0 && String(patch[k]) !== String(before[k] ?? "")) changed[k] = { before: before[k] ?? "", after: patch[k] };
02433:     });
02434:     if (body.message || Object.keys(changed).length) {
02435:       ensureSheet("V4_War_Room_Event", WAR_EVENT_HEADERS).appendRow([
02436:         uuid(),
02437:         id,
02438:         nowIso(),
02439:         text(body.type) || (Object.keys(changed).length ? "state-change" : "update"),
02440:         text(body.message) || (Object.keys(changed).length ? "War Room state updated" : "Update"),
02441:         text(body.actor),
02442:         JSON.stringify({ changes: changed, data: body.data || {} })
02443:       ]);
02444:     }
02445:     return { ok: true, data: { id, updatedAt: patch.UpdatedAt, changes: changed } };
02446:   }
02447:   __name(updateWarRoom, "updateWarRoom");
02448:   function getWarRoom(body) {
02449:     const wars = rows("V4_War_Room").sort((a, b) => dateValue(b) - dateValue(a));
02450:     const events = rows("V4_War_Room_Event").sort((a, b) => dateValue(b) - dateValue(a));
02451:     const id = text(body.id || body.warRoomId);
02452:     if (id) {
~~~
- around worker line 2931
~~~text
02921:       var obj = rowToObj_(hdr, values[i]);
02922:       if (obj["DeletedAt"] && String(obj["DeletedAt"]).trim() !== "") continue;
02923:       if (obj["Active"] === false || String(obj["Active"]).toLowerCase() === "false") {
02924:         if (sheetName === SHEET_USERS) {
02925:         } else if (obj["DeletedAt"]) continue;
02926:       }
02927:       out.push(obj);
02928:     }
02929:     if (cache && headers.length < 30) {
02930:       try {
02931:         cache.put(cacheKey, JSON.stringify(out), CACHE_TTL_SECONDS);
02932:       } catch (e) {
02933:       }
02934:     }
02935:     return out;
02936:   }
02937:   __name(getGenericRowsLegacyV1_, "getGenericRowsLegacyV1_");
02938:   function invalidateCacheForSheet_(sheetName) {
02939:     var cache = getCache_();
02940:     if (!cache) return;
02941:     try {
~~~
- around worker line 3329
~~~text
03319:       if (cached) {
03320:         try {
03321:           return JSON.parse(cached);
03322:         } catch (e) {
03323:         }
03324:       }
03325:     }
03326:     var rows = getGenericRows_(SHEET_FEATURES, ["PermissionKey", "Label", "Group"]);
03327:     if (cache) {
03328:       try {
03329:         cache.put("feature_registry", JSON.stringify(rows), CACHE_TTL_SECONDS);
03330:       } catch (e) {
03331:       }
03332:     }
03333:     return rows;
03334:   }
03335:   __name(getFeatureRegistryOut_, "getFeatureRegistryOut_");
03336:   function getPermissionMatrix_() {
03337:     var cache = getCache_();
03338:     if (cache) {
03339:       var cached = cache.get("perm_matrix");
~~~
- around worker line 3350
~~~text
03340:       if (cached) {
03341:         try {
03342:           return JSON.parse(cached);
03343:         } catch (e) {
03344:         }
03345:       }
03346:     }
03347:     var rows = getGenericRows_(SHEET_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
03348:     if (cache) {
03349:       try {
03350:         cache.put("perm_matrix", JSON.stringify(rows), CACHE_TTL_SECONDS);
03351:       } catch (e) {
03352:       }
03353:     }
03354:     return rows;
03355:   }
03356:   __name(getPermissionMatrix_, "getPermissionMatrix_");
03357:   function getLcPermissionMatrix_() {
03358:     var cache = getCache_();
03359:     if (cache) {
03360:       var cached = cache.get("lc_perm_matrix");
~~~
- around worker line 3371
~~~text
03361:       if (cached) {
03362:         try {
03363:           return JSON.parse(cached);
03364:         } catch (e) {
03365:         }
03366:       }
03367:     }
03368:     var rows = getGenericRows_(SHEET_LC_PERMISSIONS, ["Role", "PermissionKey", "Allowed"]);
03369:     if (cache) {
03370:       try {
03371:         cache.put("lc_perm_matrix", JSON.stringify(rows), CACHE_TTL_SECONDS);
03372:       } catch (e) {
03373:       }
03374:     }
03375:     return rows;
03376:   }
03377:   __name(getLcPermissionMatrix_, "getLcPermissionMatrix_");
03378:   function checkPermission_(role, permissionKey) {
03379:     if (!role) return false;
03380:     if (String(role).toLowerCase() === "superadmin") return true;
03381:     var matrix = getPermissionMatrix_();
~~~
- around worker line 3455
~~~text
03445:         if (value && typeof value === "object") {
03446:           var out = {};
03447:           Object.keys(value).forEach(function(k) {
03448:             if (/password|sessiontoken|authorization|apikey|api_key|secret|base64|passwordhash|salt/i.test(k)) out[k] = "[REDACTED]";
03449:             else out[k] = redact(value[k], depth + 1);
03450:           });
03451:           return out;
03452:         }
03453:         return typeof value === "string" && value.length > 2e3 ? value.substring(0, 2e3) + "\u2026" : value;
03454:       }, "redact");
03455:       var beforeStr = beforeObj ? JSON.stringify(redact(beforeObj)).substring(0, 5e3) : "";
03456:       var afterStr = afterObj ? JSON.stringify(redact(afterObj)).substring(0, 5e3) : "";
03457:       sh.appendRow([nowIso_(), actor || "", role || "", action || "", entity || "", entityId || "", transactionId || "", beforeStr, afterStr, result || "ok", ""]);
03458:     } catch (e) {
03459:     }
03460:   }
03461:   __name(writeAuditLog_, "writeAuditLog_");
03462:   function getTransactionResult_(transactionId, expectedAction, expectedRequestHash) {
03463:     if (!transactionId) return null;
03464:     var sh = getSS_().getSheetByName(TX_LOG_SHEET);
03465:     if (!sh) return null;
~~~

### durable_object — 5 sampled hit(s)
- around worker line 5
~~~text
00001: var __defProp = Object.defineProperty;
00002: var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
00003: 
00004: // src/worker.mjs
00005: import { DurableObject } from "cloudflare:workers";
00006: 
00007: // src/storage.mjs
00008: import { createHash, createHmac, randomUUID } from "node:crypto";
00009: var encode = /* @__PURE__ */ __name((value) => JSON.stringify(value, function(k, v) {
00010:   return this[k] instanceof Date ? { $date: this[k].toISOString() } : v;
00011: }), "encode");
00012: var decode = /* @__PURE__ */ __name((value) => JSON.parse(value, (k, v) => v && typeof v === "object" && Object.keys(v).length === 1 && v.$date ? new Date(v.$date) : v), "decode");
00013: var clone = /* @__PURE__ */ __name((v) => decode(encode(v)), "clone");
00014: function createStorage(sql, env = {}, origin = "http://localhost:8787") {
00015:   sql.exec("CREATE TABLE IF NOT EXISTS sheets(name TEXT PRIMARY KEY)");
~~~
- around worker line 9553
~~~text
09543:     } catch (e) {
09544:       store.rollback();
09545:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09546:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09547:       return json({ ok: false, error: err }, String(requestedAction).startsWith("v4.") ? v4Status(err) : 400);
09548:     }
09549:   }
09550: };
09551: 
09552: // src/worker.mjs
09553: var MaintenanceStore = class extends DurableObject {
09554:   static {
09555:     __name(this, "MaintenanceStore");
09556:   }
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
~~~
- around worker line 9555
~~~text
09545:       const err = (e.code ? e.code + ": " : "") + (e.message || String(e));
09546:       const requestedAction = request.method === "POST" ? parsedBody && parsedBody.action || "" : url.searchParams.get("action") || "";
09547:       return json({ ok: false, error: err }, String(requestedAction).startsWith("v4.") ? v4Status(err) : 400);
09548:     }
09549:   }
09550: };
09551: 
09552: // src/worker.mjs
09553: var MaintenanceStore = class extends DurableObject {
09554:   static {
09555:     __name(this, "MaintenanceStore");
09556:   }
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
~~~
- around worker line 9567
~~~text
09557:   constructor(ctx, env) {
09558:     super(ctx, env);
09559:     this.application = new Application(ctx, env);
09560:   }
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~
- around worker line 9571
~~~text
09561:   fetch(request) {
09562:     return this.application.fetch(request);
09563:   }
09564: };
09565: var worker_default = { async fetch(request, env) {
09566:   const url = new URL(request.url);
09567:   if (url.pathname === "/api" || url.pathname.startsWith("/api/") || url.pathname.startsWith("/files/")) return env.MAINTENANCE.get(env.MAINTENANCE.idFromName("maintenance-production")).fetch(request);
09568:   return env.ASSETS.fetch(request);
09569: } };
09570: export {
09571:   MaintenanceStore,
09572:   worker_default as default
09573: };
09574: //# sourceMappingURL=worker.js.map
~~~

## Route literals of interest

- /api
- /api/
- /api/backup
- /api/backup/config
- /api/backup/file/
- /api/backup/files
- /api/setup/
- /api/setup/finish
- /api/setup/import

