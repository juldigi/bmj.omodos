# Login Connection Anchors

## WEB_APP_URL — 86
### Around line 6051
~~~text
06035: // dipakai oleh getViewLocalStorageKeys(), yang dipanggil saat aplikasi
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
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
06060: // dari menu Patrol sesuai RBAC.
06061: let HOME_PATROL_STATUS = [];
06062: 
06063: /* ---------------- [PERF FIX] SEED SEKALI, LALU DELTA SAJA ----------------
06064:    Sebelumnya SETIAP kali aplikasi dibuka (termasuk di tablet high-spec),
06065:    loadAll() mengunduh ULANG seluruh Logbook + master data dari nol lewat
06066:    Cloudflare -- yang lambat karena Cloudflare (bukan tabletnya)
06067:    yang jadi bottleneck: baca ribuan baris database SQLite tiap request.
06068:    Sekarang: kunjungan PERTAMA di gadget tersebut tetap unduh penuh
06069:    ("seed") dan disimpan ke localStorage. Kunjungan-kunjungan berikutnya:
06070:    1) render dulu dari cache localStorage (instan, tanpa nunggu network),
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
~~~

### Around line 6052
~~~text
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
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
06060: // dari menu Patrol sesuai RBAC.
06061: let HOME_PATROL_STATUS = [];
06062: 
06063: /* ---------------- [PERF FIX] SEED SEKALI, LALU DELTA SAJA ----------------
06064:    Sebelumnya SETIAP kali aplikasi dibuka (termasuk di tablet high-spec),
06065:    loadAll() mengunduh ULANG seluruh Logbook + master data dari nol lewat
06066:    Cloudflare -- yang lambat karena Cloudflare (bukan tabletnya)
06067:    yang jadi bottleneck: baca ribuan baris database SQLite tiap request.
06068:    Sekarang: kunjungan PERTAMA di gadget tersebut tetap unduh penuh
06069:    ("seed") dan disimpan ke localStorage. Kunjungan-kunjungan berikutnya:
06070:    1) render dulu dari cache localStorage (instan, tanpa nunggu network),
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
06085: function saveSeedCache_(key, payload){
~~~

### Around line 6609
~~~text
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
06609:    terpisah total dari koneksi Cloudflare (WEB_APP_URL) & dari
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
06627:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-lock-key"></i> Akses Master Mesin &amp; Koneksi</h2></div>
06628:       <button class="modal-close" id="btn-close-modal">✕</button>
06629:     </div>
06630:     <div style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Menu ini berisi data master &amp; koneksi database SQLite, khusus akun ber-role <b>Superadmin</b>. Masukkan username &amp; password akun Superadmin Anda untuk melanjutkan. Akses ini hanya berlaku selama Anda berada di menu ini — begitu pindah menu, Anda perlu memverifikasi ulang untuk masuk ke sini.</div>
06631:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06632:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06633:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06634:     <div style="margin-top:16px;display:flex;gap:10px;">
06635:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06636:     </div>
06637:   `;
06638:   $('#modal-bg').classList.add('active');
06639:   $('#btn-close-modal').addEventListener('click', closeModal);
06640:   const submit = async ()=>{
06641:     const u = $('#setting-login-username').value.trim();
06642:     const p = $('#setting-login-password').value;
~~~

### Around line 6618
~~~text
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
06628:       <button class="modal-close" id="btn-close-modal">✕</button>
06629:     </div>
06630:     <div style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Menu ini berisi data master &amp; koneksi database SQLite, khusus akun ber-role <b>Superadmin</b>. Masukkan username &amp; password akun Superadmin Anda untuk melanjutkan. Akses ini hanya berlaku selama Anda berada di menu ini — begitu pindah menu, Anda perlu memverifikasi ulang untuk masuk ke sini.</div>
06631:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06632:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06633:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06634:     <div style="margin-top:16px;display:flex;gap:10px;">
06635:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06636:     </div>
06637:   `;
06638:   $('#modal-bg').classList.add('active');
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
~~~

### Around line 6619
~~~text
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
06628:       <button class="modal-close" id="btn-close-modal">✕</button>
06629:     </div>
06630:     <div style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Menu ini berisi data master &amp; koneksi database SQLite, khusus akun ber-role <b>Superadmin</b>. Masukkan username &amp; password akun Superadmin Anda untuk melanjutkan. Akses ini hanya berlaku selama Anda berada di menu ini — begitu pindah menu, Anda perlu memverifikasi ulang untuk masuk ke sini.</div>
06631:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06632:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06633:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06634:     <div style="margin-top:16px;display:flex;gap:10px;">
06635:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06636:     </div>
06637:   `;
06638:   $('#modal-bg').classList.add('active');
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
~~~

### Around line 6647
~~~text
06631:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06632:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06633:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06634:     <div style="margin-top:16px;display:flex;gap:10px;">
06635:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06636:     </div>
06637:   `;
06638:   $('#modal-bg').classList.add('active');
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
06678:       if(onSuccess) onSuccess();
06679:     }catch(err){
06680:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
~~~

### Around line 6656
~~~text
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
06678:       if(onSuccess) onSuccess();
06679:     }catch(err){
06680:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06681:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06682:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06683:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06684:       errEl.style.display = 'block';
06685:     }finally{
06686:       submitBtn.disabled = false;
06687:       submitBtn.innerHTML = originalLabel;
06688:     }
06689:   };
~~~

### Around line 6669
~~~text
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
06678:       if(onSuccess) onSuccess();
06679:     }catch(err){
06680:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06681:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06682:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06683:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06684:       errEl.style.display = 'block';
06685:     }finally{
06686:       submitBtn.disabled = false;
06687:       submitBtn.innerHTML = originalLabel;
06688:     }
06689:   };
06690:   $('#btn-setting-login-submit').addEventListener('click', submit);
06691:   $('#setting-login-password').addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ ev.preventDefault(); submit(); } });
06692:   setTimeout(()=> $('#setting-login-username') && $('#setting-login-username').focus(), 50);
06693: }
06694: 
06695: /* ======================================================================
06696:    [RBAC] USER MANAGEMENT & ROLE ACCESS MANAGEMENT (khusus Superadmin)
06697:    ----------------------------------------------------------------------
06698:    Mengikuti pola render-ke-container yang sudah dipakai di menu Setting
06699:    lain (renderMachineTable, renderPersonilTable, dst). Semua data
06700:    (user, role, permission) diambil & disimpan lewat code.gs — frontend
06701:    di sini hanya UI, tidak menyimpan apa pun secara lokal.
06702:    ====================================================================== */
~~~

### Around line 6880
~~~text
06864:     RBAC_ACTIVITY_OFFSET+=batch.length;
06865:     RBAC_ACTIVITY_DONE=batch.length<RBAC_ACTIVITY_PAGE_SIZE;
06866:     renderRbacUserActivityPanel_();
06867:   }catch(err){
06868:     holder.innerHTML=`<div style="color:var(--red);font-size:12.5px;padding:12px 0;">Gagal memuat aktivitas user: ${escapeHtml(err.message||String(err))}</div>`;
06869:   }
06870: }
06871: 
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
06889:       return;
06890:     }
06891:     const dateRows = (res.dateFixSample||[]).map(x=> `<tr><td>${escapeHtml(String(x.id))}</td><td>${escapeHtml(x.oldValue)}</td><td>→ ${escapeHtml(x.newValue)}</td></tr>`).join('');
06892:     const jenisRows = (res.jenisFixSample||[]).map(x=> `<tr><td>${escapeHtml(String(x.id))}</td><td>${escapeHtml(x.oldDeskripsi)}</td><td>→ Jenis Pekerjaan: ${escapeHtml(x.newJenis)}</td></tr>`).join('');
06893:     holder.innerHTML = `
06894:       <div class="sub" style="margin-bottom:8px;">Ditemukan <b>${res.dateFixCount} baris</b> dengan tanggal bermasalah dan <b>${res.jenisFixCount} baris</b> dengan "Preventive" salah kolom. Contoh (maks 30 per kategori ditampilkan):</div>
06895:       ${res.dateFixCount ? `<div style="font-weight:600;font-size:12.5px;margin:10px 0 4px;">📅 Perbaikan Tanggal</div>
06896:         <div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>ID</th><th>Sebelum</th><th>Sesudah</th></tr></thead><tbody>${dateRows}</tbody></table></div>` : ''}
06897:       ${res.jenisFixCount ? `<div style="font-weight:600;font-size:12.5px;margin:14px 0 4px;">🛠 Perbaikan Jenis Pekerjaan</div>
06898:         <div style="overflow-x:auto;"><table class="data-table"><thead><tr><th>ID</th><th>Deskripsi Masalah Lama</th><th>Perubahan</th></tr></thead><tbody>${jenisRows}</tbody></table></div>` : ''}
06899:       <button class="btn btn-sm btn-primary" id="btn-apply-data-fix" style="margin-top:14px;"><i class="ph-bold ph-check"></i> Terapkan Semua Perbaikan (${res.dateFixCount + res.jenisFixCount} baris)</button>
06900:     `;
06901:     $('#btn-apply-data-fix').addEventListener('click', applyLogbookDataFix);
06902:   }catch(err){
06903:     btn.disabled = false; btn.innerHTML = oldLabel;
06904:     toast('Gagal memindai: ' + err.message, true);
06905:   }
06906: }
06907: async function applyLogbookDataFix(){
06908:   if(!confirm('Terapkan perbaikan ini ke database SQLite sekarang? Tindakan ini akan MENGUBAH data langsung di sheet Logbook dan tidak bisa di-undo otomatis.')) return;
06909:   const applyBtn = $('#btn-apply-data-fix');
06910:   const oldLabel = applyBtn.innerHTML;
06911:   applyBtn.disabled = true; applyBtn.innerHTML = '<span class="ai-spinner" style="width:11px;height:11px;"></span> Menerapkan...';
06912:   try{
06913:     const res = await apiPost({ action:'fixLogbookDataQuality', actor: CURRENT_USER.username, dryRun: false });
~~~

### Around line 7162
~~~text
07146:     RBAC_ROLE_FEATURES=FEATURE_REGISTRY.slice().sort((a,b)=>String(a.Group||'').localeCompare(String(b.Group||''))||String(a.Label||'').localeCompare(String(b.Label||'')));
07147:     RBAC_ROLE_PERMISSIONS_DRAFT=cloneRoleMatrix_(PERMISSIONS,RBAC_ROLE_FEATURES);
07148:     RBAC_LC_PERMISSIONS_DRAFT=cloneRoleMatrix_(window.LC_PERMISSIONS,RBAC_ROLE_FEATURES);
07149:     renderRbacRoleShell_();
07150:     $('#btn-save-permissions').onclick=handleSavePermissions_;
07151:   }catch(err){
07152:     holder.innerHTML=`<div style="color:var(--red);font-size:12.5px;">Gagal memuat Role Access: ${escapeHtml(err.message||String(err))}</div>`;
07153:   }
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
07171:   const matrixDiff = (expected, actual)=>{
07172:     const diff = [];
07173:     Object.keys(expected || {}).forEach(key=>{
07174:       ['Supervisor','Technician'].forEach(role=>{
07175:         const exp = !!(expected[key] && expected[key][role]);
07176:         const act = !!(actual && actual[key] && actual[key][role]);
07177:         if(exp !== act) diff.push(`${key} [${role}] dikirim=${exp}, diterima=${act}`);
07178:       });
07179:     });
07180:     return diff;
07181:   };
07182:   const matrixMatches = (expected, actual)=> matrixDiff(expected, actual).length === 0;
07183: 
07184:   const featuresPayload = (FEATURE_REGISTRY || [])
07185:     .filter(f=>f && f.PermissionKey)
07186:     .map(f=>({ PermissionKey:String(f.PermissionKey), Label:String(f.Label||f.PermissionKey), Group:String(f.Group||'Umum') }));
07187: 
07188:   statusEl.textContent = 'Tahap 1/2 — menyimpan akses (atomik)...';
07189:   if(saveBtn) saveBtn.disabled = true;
07190:   let stage = 'menyimpan Role Access (Role_Permissions + Tampilan Sederhana)';
07191:   try{
07192:     // [FIX ROOT CAUSE] Sebelumnya di sini ada DUA request terpisah
07193:     // (savePermissions lalu saveLcPermissions). Kalau request kedua gagal
07194:     // (timeout/rate limit/koneksi putus) SETELAH request pertama sukses,
07195:     // Role_Permissions di database SQLite sudah berubah walau UI melaporkan
~~~

### Around line 7275
~~~text
07259:   }catch(err){
07260:     const raw = (err && err.message) ? err.message : String(err || 'Gagal menyimpan perubahan akses.');
07261:     let hint = '';
07262:     if(/UNKNOWN_ACTION|Action tidak terdaftar|METHOD_NOT_ALLOWED/i.test(raw)){
07263:       hint = ' Backend /exec yang aktif belum memakai Code.gs terbaru. Deploy > Manage deployments > Edit > pilih New version, lalu Deploy.';
07264:     }else if(/Backend mengirim halaman HTML|Unexpected token.*</i.test(raw)){
07265:       hint = ' Deployment Web App kemungkinan meminta login Google. Untuk frontend GitHub Pages, deploy Cloudflare sebagai Web App yang dieksekusi sebagai pemilik/deployer dan dapat diakses Anyone.';
07266:     }else if(/Failed to fetch|NetworkError|Load failed|CORS/i.test(raw)){
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
07284: 
07285: let SPAREPART_STATUS = {}; // {entryId: 'DONE' | 'PENDING'} — status validasi collect admin gudang
07286: 
07287: const $ = (sel, root=document) => root.querySelector(sel);
07288: const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
07289: 
07290: /* ---------------- PAGINATION STANDAR GLOBAL ----------------
07291:    Dipakai oleh halaman/list/table yang dapat berisi banyak data.
07292:    Pilihan: 10 / 25 / 50 / 100 / Semua.
07293:    Tidak mengubah data sumber; hanya mengatur item yang tampil di browser. */
07294: const UNIVERSAL_PAGE_SIZE_OPTIONS = [10,25,50,100,0];
07295: const UNIVERSAL_PAGINATION_TARGETS = [
07296:   'list-utama','list-mesin','list-tanggal','list-pelapor','list-group','list-durasi',
07297:   'database-grid','list-patrol-temuan','list-patrol-riwayat','kb-list','kb-suggest-list',
07298:   'list-rca-saved','list-project-report','list-sparepart-eta','list-sparepart-opname',
07299:   'list-sparepart-warehouse','sparepart-lokasi-table','mbd-tbody','ryt-tbody','rhc-tbody',
07300:   'ect-tbody','cr-tbody','eng-tbody','machine-list-table','personil-list-table','pct-list-table',
07301:   'rbac-user-table','pmc-list-wrap','mtg-list-wrap','ipal-saved-list','list-expert-finder',
07302:   'pi-personnel-grid','pi-sr-grid','pi-ss-history','pi-hs-history','pi-dash-gap-table','kd-grid',
07303:   'an-machine-grid','kpi-kerja-table','corr-pairs-table','pareto-table','imp-preview-table','sp-opname-checklist'
07304: ];
07305: const UNIVERSAL_PAGINATION_STATE = new Map();
07306: 
07307: (function injectUniversalPaginationStyle(){
07308:   if(document.getElementById('universal-pagination-style')) return;
~~~

### Around line 7466
~~~text
07450: // kontras komponen UI/aksen >= 3:1 terhadap latar). Lihat token CSS
07451: // `html[data-theme="key"]{...}` di <head> untuk nilai warna masing-masing.
07452: const THEME_REGISTRY = [
07453:   { key:'omodos',           label:'Clean (Default)',                 desc:'Tema default brand OMODOS — terang, bersih, tanpa efek glow.', swatch:['#eef0f3','#ffffff','#7c1420'] },
07454:   { key:'red-black',        label:'Dark',                            desc:'Tema gelap kontras tinggi, nyaman untuk kerja malam hari.',    swatch:['#08090b','#1a1d21','#ff5566'] },
07455:   { key:'abu-profesional',  label:'Professional',                    desc:'Terang netral abu-abu, gaya dashboard korporat.',             swatch:['#eef0f2','#ffffff','#1a4fa0'] }
07456: ];
07457: 
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
07475:   const holder = $('#theme-manager-grid');
07476:   if(!holder) return;
07477:   const current = document.documentElement.getAttribute('data-theme') || 'omodos';
07478:   holder.innerHTML = THEME_REGISTRY.map(t => `
07479:     <div class="theme-card ${t.key===current?'active':''}" data-theme-key="${t.key}" title="${escapeHtml(t.desc)}">
07480:       <div class="theme-thumb">${t.swatch.map(c=>`<span style="background:${c};"></span>`).join('')}</div>
07481:       <div class="theme-name">${escapeHtml(t.label)}</div>
07482:       <div class="theme-desc">${escapeHtml(t.desc)}</div>
07483:       <div class="theme-active-badge"><i class="ph-bold ph-check"></i></div>
07484:     </div>
07485:   `).join('');
07486:   $$('.theme-card', holder).forEach(card => card.addEventListener('click', ()=> setAppTheme(card.dataset.themeKey)));
07487: }
07488: renderThemeManager();
07489: 
07490: /* ---------------- STYLE MANAGER ("Gaya Tampilan Aplikasi") ----------------
07491:    Terpisah total dari THEME_REGISTRY di atas. THEME_REGISTRY = palet WARNA
07492:    (html[data-theme]). STYLE_REGISTRY = BENTUK seluruh komponen aplikasi
07493:    (html[data-style]) — sudut card/tombol/input/badge, font, ketebalan
07494:    border, bayangan, tekstur latar, bentuk sidebar, dst (lihat CSS
07495:    `html[data-style="key"]{...}` di <head>). Kedua pilihan independen dan
07496:    bisa dikombinasikan bebas: pilih gaya apa pun tetap memakai palet warna
07497:    yang sedang aktif dari Theme Manager. 'klasik' = tampilan default
07498:    aplikasi saat ini (tanpa atribut data-style / tanpa override bentuk). */
07499: const LS_STYLE_KEY = 'app_style';
~~~

### Around line 7522
~~~text
07506: ];
07507: function setAppStyle(style, opts={}){
07508:   if(style === 'low-cognitive'){
07509:     document.documentElement.removeAttribute('data-style');
07510:     setLowCognitiveMode(true, opts);
07511:     localStorage.setItem(LS_STYLE_KEY, style);
07512:     renderStyleManagerActiveState_();
07513:     return;
07514:   }
07515:   if(document.body.classList.contains('low-cognitive')){
07516:     setLowCognitiveMode(false, { announce:false });
07517:   }
07518:   if(style === 'klasik'){ document.documentElement.removeAttribute('data-style'); }
07519:   else{ document.documentElement.setAttribute('data-style', style); }
07520:   localStorage.setItem(LS_STYLE_KEY, style);
07521:   renderStyleManagerActiveState_();
07522:   if(opts.persist !== false && CURRENT_USER && WEB_APP_URL){
07523:     apiPost({ action:'saveStylePref', actor: CURRENT_USER.username, style }).catch(()=>{});
07524:   }
07525: }
07526: function renderStyleManagerActiveState_(){
07527:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07528:   $$('.style-card').forEach(c => c.classList.toggle('active', c.dataset.styleKey === current));
07529: }
07530: function renderStyleManager(){
07531:   const holder = $('#style-manager-grid');
07532:   if(!holder) return;
07533:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07534:   holder.innerHTML = STYLE_REGISTRY.map(s => `
07535:     <div class="style-card ${s.key===current?'active':''}" data-style-key="${s.key}" title="${escapeHtml(s.desc)}">
07536:       <div class="style-thumb"><i class="ph-bold ${s.icon}"></i></div>
07537:       <div class="style-name">${escapeHtml(s.label)}</div>
07538:       <div class="style-desc">${escapeHtml(s.desc)}</div>
07539:       <div class="style-active-badge"><i class="ph-bold ph-check"></i></div>
07540:     </div>
07541:   `).join('');
07542:   $$('.style-card', holder).forEach(card => card.addEventListener('click', ()=> setAppStyle(card.dataset.styleKey)));
07543: }
07544: renderStyleManager();
07545: 
07546: /* ---------------- LOW COGNITIVE MODE ----------------
07547:    Fitur ini murni presentational (CSS class body.low-cognitive +
07548:    atribut [data-lc-hide] pada markup) — tidak menyentuh struktur
07549:    data, LocalStorage key lain, atau logika bisnis manapun. State
07550:    ON/OFF disimpan sendiri di key `app_low_cognitive`. Ada dua titik
07551:    kontrol yang saling sinkron: switch di halaman Settings dan
07552:    quick-toggle ikon otak di topbar. */
07553: const LS_LOW_COGNITIVE_KEY = 'app_low_cognitive';
07554: 
07555: function isLowCognitiveActive(){
~~~

### Around line 7816
~~~text
07800:     resetSettingAuth();
07801:     return;
07802:   }
07803:   logoutUser();
07804: }
07805: // Session-only read cache; isolated by backend, token and parameters.
07806: const READY_READS = new Map();
07807: const ACTIVE_READS = new Map();
07808: let READ_GENERATION = 0;
07809: function invalidatePreparedReads_(){
07810:   READY_READS.clear(); READ_GENERATION++;
07811:   if(typeof PMC_STATE !== 'undefined') PMC_STATE.loaded = false;
07812:   if(typeof MTG_STATE !== 'undefined') MTG_STATE.loaded = false;
07813: }
07814: async function apiGet(action, params={}, retries=2){
07815:   const token = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07816:   const key = JSON.stringify([WEB_APP_URL, token, action, Object.keys(params).sort().map(k=>[k,params[k]])]);
07817:   const fresh = params.fresh || params._ts;
07818:   const cached = READY_READS.get(key);
07819:   if(!fresh && cached && Date.now()-cached.time < 60000) return structuredReadCopy_(cached.data);
07820:   const activeKey = key + ':' + READ_GENERATION;
07821:   if(ACTIVE_READS.has(activeKey)) return structuredReadCopy_(await ACTIVE_READS.get(activeKey));
07822:   const generation = READ_GENERATION;
07823:   const promise = apiGetNetwork_(action, params, retries).then(data=>{
07824:     if(generation === READ_GENERATION) READY_READS.set(key,{data:structuredReadCopy_(data),time:Date.now()});
07825:     return data;
07826:   });
07827:   ACTIVE_READS.set(activeKey,promise);
07828:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07829: }
07830: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07831: 
07832: async function apiGetNetwork_(action, params={}, retries=2){
07833:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07834:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07835:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07836:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07837:   const qs = new URLSearchParams({action, ...params}).toString();
07838:   let lastErr=null;
07839:   for(let attempt=0; attempt<=retries; attempt++){
07840:     try{
07841:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07842:       const json = await parseApiResponse_(res);
07843:       if(!json.ok){
07844:         handleApiAuthFailure_(json.error || '', requestToken);
07845:         throw new Error(json.error || 'Gagal mengambil data');
07846:       }
07847:       return json.data;
07848:     }catch(e){
07849:       lastErr=e;
~~~

### Around line 7834
~~~text
07818:   const cached = READY_READS.get(key);
07819:   if(!fresh && cached && Date.now()-cached.time < 60000) return structuredReadCopy_(cached.data);
07820:   const activeKey = key + ':' + READ_GENERATION;
07821:   if(ACTIVE_READS.has(activeKey)) return structuredReadCopy_(await ACTIVE_READS.get(activeKey));
07822:   const generation = READ_GENERATION;
07823:   const promise = apiGetNetwork_(action, params, retries).then(data=>{
07824:     if(generation === READ_GENERATION) READY_READS.set(key,{data:structuredReadCopy_(data),time:Date.now()});
07825:     return data;
07826:   });
07827:   ACTIVE_READS.set(activeKey,promise);
07828:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07829: }
07830: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07831: 
07832: async function apiGetNetwork_(action, params={}, retries=2){
07833:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07834:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07835:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07836:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07837:   const qs = new URLSearchParams({action, ...params}).toString();
07838:   let lastErr=null;
07839:   for(let attempt=0; attempt<=retries; attempt++){
07840:     try{
07841:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07842:       const json = await parseApiResponse_(res);
07843:       if(!json.ok){
07844:         handleApiAuthFailure_(json.error || '', requestToken);
07845:         throw new Error(json.error || 'Gagal mengambil data');
07846:       }
07847:       return json.data;
07848:     }catch(e){
07849:       lastErr=e;
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
07867:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
~~~

### Around line 7841
~~~text
07825:     return data;
07826:   });
07827:   ACTIVE_READS.set(activeKey,promise);
07828:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07829: }
07830: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07831: 
07832: async function apiGetNetwork_(action, params={}, retries=2){
07833:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07834:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07835:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07836:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07837:   const qs = new URLSearchParams({action, ...params}).toString();
07838:   let lastErr=null;
07839:   for(let attempt=0; attempt<=retries; attempt++){
07840:     try{
07841:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07842:       const json = await parseApiResponse_(res);
07843:       if(!json.ok){
07844:         handleApiAuthFailure_(json.error || '', requestToken);
07845:         throw new Error(json.error || 'Gagal mengambil data');
07846:       }
07847:       return json.data;
07848:     }catch(e){
07849:       lastErr=e;
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
07867:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07868:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07869:   try{
07870:     // text/plain menghindari CORS preflight ke Cloudflare
07871:     const requestBodyText = JSON.stringify(securedPayload);
07872:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07873:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07874:     // membiarkan upload putus dan record tersisa hanya filename.
~~~

### Around line 7862
~~~text
07846:       }
07847:       return json.data;
07848:     }catch(e){
07849:       lastErr=e;
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
07867:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07868:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07869:   try{
07870:     // text/plain menghindari CORS preflight ke Cloudflare
07871:     const requestBodyText = JSON.stringify(securedPayload);
07872:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07873:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07874:     // membiarkan upload putus dan record tersisa hanya filename.
07875:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07876:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07877:     }
07878:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07879:       method: 'POST',
07880:       mode: 'cors',
07881:       credentials: 'omit',
07882:       redirect: 'follow',
07883:       cache: 'no-store',
07884:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07885:       body: requestBodyText
07886:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07887:     const json = await parseApiResponse_(res);
07888:     if(!json.ok){
07889:       handleApiAuthFailure_(json.error || '', requestToken);
07890:       throw new Error(json.error || 'Gagal menyimpan data');
07891:     }
07892:     invalidatePreparedReads_();
07893:     setAppOnlineStatus(true);
07894:     return json;
07895:   }catch(err){
~~~

### Around line 7878
~~~text
07862:   if(!WEB_APP_URL){
07863:     if(payload.action !== 'login') queueForSync_(payload);
07864:     throw new Error('NO_URL');
07865:   }
07866:   if(payload.action !== 'login' && !SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07867:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07868:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07869:   try{
07870:     // text/plain menghindari CORS preflight ke Cloudflare
07871:     const requestBodyText = JSON.stringify(securedPayload);
07872:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07873:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07874:     // membiarkan upload putus dan record tersisa hanya filename.
07875:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07876:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07877:     }
07878:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07879:       method: 'POST',
07880:       mode: 'cors',
07881:       credentials: 'omit',
07882:       redirect: 'follow',
07883:       cache: 'no-store',
07884:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07885:       body: requestBodyText
07886:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07887:     const json = await parseApiResponse_(res);
07888:     if(!json.ok){
07889:       handleApiAuthFailure_(json.error || '', requestToken);
07890:       throw new Error(json.error || 'Gagal menyimpan data');
07891:     }
07892:     invalidatePreparedReads_();
07893:     setAppOnlineStatus(true);
07894:     return json;
07895:   }catch(err){
07896:     // Kegagalan level jaringan (offline/tidak terjangkau) -> antre untuk
07897:     // disinkron otomatis nanti begitu internet kembali. Kegagalan dari
07898:     // server (json.ok === false, misal validasi) TIDAK diantre karena
07899:     // request sudah benar-benar sampai & ditolak, bukan soal koneksi.
07900:     const isNetworkErr = err instanceof TypeError ||
07901:       /Failed to fetch|NetworkError|Load failed|Backend timeout|AbortError|aborted/i.test(err.message || '');
07902:     if(isNetworkErr){
07903:       queueForSync_(securedPayload);
07904:       setAppOnlineStatus(false);
07905:     }
07906:     throw err;
07907:   }
07908: }
07909: 
07910: /* ---------------- RBAC: PULIHKAN SESI SAAT REFRESH HALAMAN ----------------
07911:    CURRENT_USER (username/role) di-cache di localStorage supaya refresh
~~~

### Around line 7982
~~~text
07966:   // karena satu kali gagal terhubung.
07967:   await refreshRbacFromServer_();
07968: })();
07969: 
07970: // [FIX ROOT CAUSE] Sebelumnya PERMISSIONS/FEATURE_REGISTRY di akun yang
07971: // SUDAH login hanya disegarkan SEKALI, tepat saat halaman pertama dibuka
07972: // (restoreRbacSession_ di atas). Kalau tab akun lain dibiarkan terbuka
07973: // lama, atau device-nya dikunci lalu dibuka lagi tanpa reload penuh,
07974: // perubahan yang Superadmin simpan di Role Access Management tidak akan
07975: // pernah terlihat sampai user itu logout+login ulang atau menutup total
07976: // lalu membuka ulang tab-nya -- inilah salah satu sumber laporan "menu
07977: // yang muncul tidak sesuai config admin" di akun lain. Fungsi ini
07978: // diekstrak supaya bisa dipanggil ulang secara berkala DAN setiap kali
07979: // tab kembali terlihat (mis. dibuka lagi setelah di-minimize di HP),
07980: // tanpa mengubah perilaku restoreRbacSession_ di atas sama sekali.
07981: async function refreshRbacFromServer_(){
07982:   if(!CURRENT_USER || !SESSION_TOKEN || !WEB_APP_URL) return;
07983:   try{
07984:     const [features, permissions] = await Promise.all([
07985:       apiGet('features'),
07986:       apiGet('permissions')
07987:     ]);
07988:     FEATURE_REGISTRY = mergeFeatureRegistry(features || []);
07989:     PERMISSIONS = permissions || {};
07990:     cacheRbacSession_();
07991:     applyRbacToUi();
07992:   }catch(e){
07993:     // Biarkan sesi tetap aktif dengan cache terakhir; tidak melakukan apa-apa.
07994:   }
07995: }
07996: // Segarkan tiap 3 menit selagi tab terbuka & terlihat, dan segera saat tab
07997: // kembali aktif (mis. user balik dari aplikasi lain di HP). Ringan karena
07998: // permission/feature di backend sudah di-cache 10 menit (CacheService),
07999: // jadi tidak membebani database SQLite.
08000: setInterval(()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); }, 3*60*1000);
08001: document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); });
08002: 
08003: /* ---------------- LOGOUT ----------------
08004:    Membersihkan sesi RBAC (CURRENT_USER, permission, feature registry) &
08005:    status login menu Setting, lalu menampilkan kembali login-gate supaya
08006:    pengguna wajib login ulang dengan akun (username/password) untuk
08007:    masuk ke aplikasi lagi. Data yang sudah tersimpan di database SQLite
08008:    tidak terpengaruh sama sekali oleh logout. */
08009: function logoutUser(){
08010:   try{
08011:     deactivateAccountDataCaches_(CURRENT_USER&&CURRENT_USER.username);
08012:   }catch(e){
08013:     toast('Logout dibatalkan karena cache lokal belum berhasil diamankan. Coba kembali setelah ruang penyimpanan browser tersedia.', true);
08014:     return;
08015:   }
~~~

### Around line 8017
~~~text
08001: document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); });
08002: 
08003: /* ---------------- LOGOUT ----------------
08004:    Membersihkan sesi RBAC (CURRENT_USER, permission, feature registry) &
08005:    status login menu Setting, lalu menampilkan kembali login-gate supaya
08006:    pengguna wajib login ulang dengan akun (username/password) untuk
08007:    masuk ke aplikasi lagi. Data yang sudah tersimpan di database SQLite
08008:    tidak terpengaruh sama sekali oleh logout. */
08009: function logoutUser(){
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
08027:   SESSION_EXPIRES_AT = '';
08028:   PERMISSIONS = {};
08029:   FEATURE_REGISTRY = [];
08030:   try{ localStorage.removeItem(SS_USER_KEY); localStorage.removeItem(SS_TOKEN_KEY); localStorage.removeItem(SS_TOKEN_EXP_KEY); localStorage.removeItem(LS_PERM_KEY); localStorage.removeItem(LS_FEATURES_KEY); }catch(e){}
08031:   if(typeof resetSettingAuth === 'function') resetSettingAuth();
08032: 
08033:   const gate = document.getElementById('login-gate');
08034:   const appRoot = document.getElementById('app-root');
08035:   if(appRoot) appRoot.classList.remove('unlocked', 'dash-mode', 'menu-visible');
08036:   if(gate){
08037:     gate.style.display = '';
08038:     gate.style.opacity = '1';
08039:   }
08040:   const form = document.getElementById('form-login');
08041:   if(form) form.reset();
08042:   const errEl = document.getElementById('login-err');
08043:   if(errEl) errEl.textContent = '';
08044:   const userField = document.getElementById('login-username');
08045:   if(userField) setTimeout(()=> userField.focus(), 50);
08046: 
08047:   // Hapus state runtime akun lama lalu reload. Cache data/draft/offline
08048:   // tidak dihapus: semuanya sudah dipindahkan ke namespace akun yang logout,
08049:   // sehingga akun berikutnya tidak mewarisi cache tersebut.
08050:   try{ READY_READS.clear(); ACTIVE_READS.clear(); READ_GENERATION++; }catch(e){}
~~~

### Around line 8018
~~~text
08002: 
08003: /* ---------------- LOGOUT ----------------
08004:    Membersihkan sesi RBAC (CURRENT_USER, permission, feature registry) &
08005:    status login menu Setting, lalu menampilkan kembali login-gate supaya
08006:    pengguna wajib login ulang dengan akun (username/password) untuk
08007:    masuk ke aplikasi lagi. Data yang sudah tersimpan di database SQLite
08008:    tidak terpengaruh sama sekali oleh logout. */
08009: function logoutUser(){
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
08027:   SESSION_EXPIRES_AT = '';
08028:   PERMISSIONS = {};
08029:   FEATURE_REGISTRY = [];
08030:   try{ localStorage.removeItem(SS_USER_KEY); localStorage.removeItem(SS_TOKEN_KEY); localStorage.removeItem(SS_TOKEN_EXP_KEY); localStorage.removeItem(LS_PERM_KEY); localStorage.removeItem(LS_FEATURES_KEY); }catch(e){}
08031:   if(typeof resetSettingAuth === 'function') resetSettingAuth();
08032: 
08033:   const gate = document.getElementById('login-gate');
08034:   const appRoot = document.getElementById('app-root');
08035:   if(appRoot) appRoot.classList.remove('unlocked', 'dash-mode', 'menu-visible');
08036:   if(gate){
08037:     gate.style.display = '';
08038:     gate.style.opacity = '1';
08039:   }
08040:   const form = document.getElementById('form-login');
08041:   if(form) form.reset();
08042:   const errEl = document.getElementById('login-err');
08043:   if(errEl) errEl.textContent = '';
08044:   const userField = document.getElementById('login-username');
08045:   if(userField) setTimeout(()=> userField.focus(), 50);
08046: 
08047:   // Hapus state runtime akun lama lalu reload. Cache data/draft/offline
08048:   // tidak dihapus: semuanya sudah dipindahkan ke namespace akun yang logout,
08049:   // sehingga akun berikutnya tidak mewarisi cache tersebut.
08050:   try{ READY_READS.clear(); ACTIVE_READS.clear(); READ_GENERATION++; }catch(e){}
08051:   setTimeout(()=> location.reload(), 60);
~~~

### Around line 8094
~~~text
08078:   if(isSecurityConfigAction_(payload && payload.action)) return;
08079:   const q = loadSyncQueue_();
08080:   const queuedPayload = {...payload};
08081:   delete queuedPayload.sessionToken;
08082:   // Cegah item identik menumpuk jika pengguna menekan simpan lagi setelah
08083:   // timeout. Payload berbeda tetap dipertahankan sebagai operasi terpisah.
08084:   const signature = JSON.stringify(queuedPayload);
08085:   if(q.some(item => JSON.stringify(item.payload) === signature)){
08086:     renderOfflineBanner();
08087:     return;
08088:   }
08089:   q.push({ id: 'sync_'+Date.now()+'_'+Math.random().toString(36).slice(2), payload:queuedPayload, ts: Date.now() });
08090:   saveSyncQueue_(q);
08091: }
08092: 
08093: async function flushSyncQueue_(){
08094:   if(!WEB_APP_URL) return;
08095:   const q = loadSyncQueue_();
08096:   if(!q.length) return;
08097:   const remaining = [];
08098:   let discardedSecurityConfig = 0;
08099:   for(const item of q){
08100:     if(isSecurityConfigAction_(item && item.payload && item.payload.action)){ discardedSecurityConfig++; continue; }
08101:     try{
08102:       if(!SESSION_TOKEN) throw new Error('AUTH_REQUIRED');
08103:       const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
08104:       const res = await fetchWithTimeout_(WEB_APP_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify({...item.payload, sessionToken:requestToken}) }, 60000); // PATCHED 60s
08105:       const json = await parseApiResponse_(res);
08106:       if(!json.ok) throw new Error(json.error || 'gagal');
08107:     }catch(e){
08108:       remaining.push(item); // masih gagal, coba lagi di kesempatan berikutnya
08109:     }
08110:   }
08111:   const successCount = q.length - remaining.length - discardedSecurityConfig;
08112:   saveSyncQueue_(remaining);
08113:   if(successCount > 0){
08114:     setAppOnlineStatus(true);
08115:     toast(`${successCount} data berhasil disinkron otomatis ke server.`);
08116:     try{ await loadAll(); }catch(e){}
08117:   }
08118: }
08119: 
08120: function setAppOnlineStatus(isOnline){
08121:   const changed = APP_ONLINE_STATUS !== isOnline;
08122:   APP_ONLINE_STATUS = isOnline;
08123:   renderOfflineBanner();
08124:   if(isOnline && changed) flushSyncQueue_();
08125: }
08126: 
08127: function renderOfflineBanner(){
~~~

### Around line 8104
~~~text
08088:   }
08089:   q.push({ id: 'sync_'+Date.now()+'_'+Math.random().toString(36).slice(2), payload:queuedPayload, ts: Date.now() });
08090:   saveSyncQueue_(q);
08091: }
08092: 
08093: async function flushSyncQueue_(){
08094:   if(!WEB_APP_URL) return;
08095:   const q = loadSyncQueue_();
08096:   if(!q.length) return;
08097:   const remaining = [];
08098:   let discardedSecurityConfig = 0;
08099:   for(const item of q){
08100:     if(isSecurityConfigAction_(item && item.payload && item.payload.action)){ discardedSecurityConfig++; continue; }
08101:     try{
08102:       if(!SESSION_TOKEN) throw new Error('AUTH_REQUIRED');
08103:       const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
08104:       const res = await fetchWithTimeout_(WEB_APP_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify({...item.payload, sessionToken:requestToken}) }, 60000); // PATCHED 60s
08105:       const json = await parseApiResponse_(res);
08106:       if(!json.ok) throw new Error(json.error || 'gagal');
08107:     }catch(e){
08108:       remaining.push(item); // masih gagal, coba lagi di kesempatan berikutnya
08109:     }
08110:   }
08111:   const successCount = q.length - remaining.length - discardedSecurityConfig;
08112:   saveSyncQueue_(remaining);
08113:   if(successCount > 0){
08114:     setAppOnlineStatus(true);
08115:     toast(`${successCount} data berhasil disinkron otomatis ke server.`);
08116:     try{ await loadAll(); }catch(e){}
08117:   }
08118: }
08119: 
08120: function setAppOnlineStatus(isOnline){
08121:   const changed = APP_ONLINE_STATUS !== isOnline;
08122:   APP_ONLINE_STATUS = isOnline;
08123:   renderOfflineBanner();
08124:   if(isOnline && changed) flushSyncQueue_();
08125: }
08126: 
08127: function renderOfflineBanner(){
08128:   const holder = $('#offline-banner-holder');
08129:   if(!holder) return;
08130:   if(!WEB_APP_URL){ holder.innerHTML=''; return; } // sudah ditangani config-banner terpisah
08131:   const q = loadSyncQueue_();
08132:   if(!navigator.onLine || !APP_ONLINE_STATUS){
08133:     holder.innerHTML = `<div class="offline-banner">📴 <b>Mode Offline</b> — aplikasi tetap bisa dipakai seperti biasa, data disimpan lokal di perangkat ini${q.length?` (<b>${q.length} data</b> menunggu sinkron)`:''}. Begitu internet kembali, data akan otomatis tersinkron ke server.</div>`;
08134:   } else if(q.length){
08135:     holder.innerHTML = `<div class="offline-banner syncing">🔄 Menyinkronkan <b>${q.length} data</b> yang tertunda ke server...</div>`;
08136:   } else {
08137:     holder.innerHTML = '';
~~~

### Around line 8130
~~~text
08114:     setAppOnlineStatus(true);
08115:     toast(`${successCount} data berhasil disinkron otomatis ke server.`);
08116:     try{ await loadAll(); }catch(e){}
08117:   }
08118: }
08119: 
08120: function setAppOnlineStatus(isOnline){
08121:   const changed = APP_ONLINE_STATUS !== isOnline;
08122:   APP_ONLINE_STATUS = isOnline;
08123:   renderOfflineBanner();
08124:   if(isOnline && changed) flushSyncQueue_();
08125: }
08126: 
08127: function renderOfflineBanner(){
08128:   const holder = $('#offline-banner-holder');
08129:   if(!holder) return;
08130:   if(!WEB_APP_URL){ holder.innerHTML=''; return; } // sudah ditangani config-banner terpisah
08131:   const q = loadSyncQueue_();
08132:   if(!navigator.onLine || !APP_ONLINE_STATUS){
08133:     holder.innerHTML = `<div class="offline-banner">📴 <b>Mode Offline</b> — aplikasi tetap bisa dipakai seperti biasa, data disimpan lokal di perangkat ini${q.length?` (<b>${q.length} data</b> menunggu sinkron)`:''}. Begitu internet kembali, data akan otomatis tersinkron ke server.</div>`;
08134:   } else if(q.length){
08135:     holder.innerHTML = `<div class="offline-banner syncing">🔄 Menyinkronkan <b>${q.length} data</b> yang tertunda ke server...</div>`;
08136:   } else {
08137:     holder.innerHTML = '';
08138:   }
08139: }
08140: 
08141: window.addEventListener('online', ()=> setAppOnlineStatus(true));
08142: window.addEventListener('offline', ()=> setAppOnlineStatus(false));
08143: // Polling berkala jaga-jaga: browser kadang telat memicu event 'online', atau
08144: // koneksi "menyala" tapi sebenarnya tidak bisa menjangkau Web App-nya.
08145: setInterval(()=>{ if(navigator.onLine) flushSyncQueue_(); }, 60000); // PATCHED 60s
08146: renderOfflineBanner();
08147: 
08148: /* ---------------- CONFIG BANNER ---------------- */
08149: function renderConfigBanner(){
08150:   const holder = $('#config-banner-holder');
08151:   if(WEB_APP_URL){ holder.innerHTML = ''; return; }
08152:   holder.innerHTML = `
08153:     <div class="config-banner">
08154:       ⚠️ <b>Belum terhubung ke database SQLite.</b> Buka menu <b>Master Mesin &amp; Koneksi</b> di sidebar,
08155:       lalu tempelkan URL Web App dari Cloudflare (lihat <code>PANDUAN_SETUP.md</code>).
08156:     </div>`;
08157: }
08158: 
08159: /* ---------------- NAVIGATION ---------------- */
08160: function handleViewRenderError_(view, label, err){
08161:   const msg = err && err.message ? err.message : String(err || 'Error tidak diketahui');
08162:   console.error('[OMODOS] Gagal render view:', {view, label, error:err});
08163:   try{ if(typeof copilotLogError === 'function') copilotLogError('Render '+view+': '+msg, label||''); }catch(e){}
~~~

### Around line 8151
~~~text
08135:     holder.innerHTML = `<div class="offline-banner syncing">🔄 Menyinkronkan <b>${q.length} data</b> yang tertunda ke server...</div>`;
08136:   } else {
08137:     holder.innerHTML = '';
08138:   }
08139: }
08140: 
08141: window.addEventListener('online', ()=> setAppOnlineStatus(true));
08142: window.addEventListener('offline', ()=> setAppOnlineStatus(false));
08143: // Polling berkala jaga-jaga: browser kadang telat memicu event 'online', atau
08144: // koneksi "menyala" tapi sebenarnya tidak bisa menjangkau Web App-nya.
08145: setInterval(()=>{ if(navigator.onLine) flushSyncQueue_(); }, 60000); // PATCHED 60s
08146: renderOfflineBanner();
08147: 
08148: /* ---------------- CONFIG BANNER ---------------- */
08149: function renderConfigBanner(){
08150:   const holder = $('#config-banner-holder');
08151:   if(WEB_APP_URL){ holder.innerHTML = ''; return; }
08152:   holder.innerHTML = `
08153:     <div class="config-banner">
08154:       ⚠️ <b>Belum terhubung ke database SQLite.</b> Buka menu <b>Master Mesin &amp; Koneksi</b> di sidebar,
08155:       lalu tempelkan URL Web App dari Cloudflare (lihat <code>PANDUAN_SETUP.md</code>).
08156:     </div>`;
08157: }
08158: 
08159: /* ---------------- NAVIGATION ---------------- */
08160: function handleViewRenderError_(view, label, err){
08161:   const msg = err && err.message ? err.message : String(err || 'Error tidak diketahui');
08162:   console.error('[OMODOS] Gagal render view:', {view, label, error:err});
08163:   try{ if(typeof copilotLogError === 'function') copilotLogError('Render '+view+': '+msg, label||''); }catch(e){}
08164:   toast('Gagal memuat '+(label||view)+': '+msg, true);
08165: }
08166: function invokeViewRenderer_(view, renderer, label){
08167:   try{
08168:     const result = renderer();
08169:     if(result && typeof result.then === 'function'){
08170:       result.catch(err=>handleViewRenderError_(view,label,err));
08171:     }
08172:     return result;
08173:   }catch(err){
08174:     handleViewRenderError_(view,label,err);
08175:     return null;
08176:   }
08177: }
08178: function switchToView(enteringView){
08179:   enteringView = String(enteringView||'').trim();
08180:   if(!enteringView){ toast('Tujuan halaman tidak valid.', true); return false; }
08181:   if(typeof canAccessView_ === 'function' && !canAccessView_(enteringView)){
08182:     showAccessDenied();
08183:     return false;
08184:   }
~~~

### Around line 8214
~~~text
08198:     if(b.dataset.view===enteringView){ b.classList.add('active'); return; }
08199:     if(b.dataset.group){
08200:       const submenu = $(`.nav-submenu[data-submenu="${b.dataset.group}"]`);
08201:       if(submenu && $(`.nav-btn[data-view="${enteringView}"]`, submenu)) b.classList.add('group-active');
08202:     }
08203:   });
08204:   $$('.view').forEach(v=>v.classList.remove('active'));
08205:   enteringViewEl.classList.add('active');
08206: 
08207:   // Fitur AI harus selalu kembali ke kondisi default setiap kali pengguna
08208:   // meninggalkan halaman ini — supaya tidak ada hasil analisa "nyangkut"
08209:   // dari sesi sebelumnya saat pengguna kembali lagi ke menu AI.
08210:   if(leavingView === 'ai' && enteringView !== 'ai'){ resetAiView(); }
08211: 
08212:   // Menu Setting: begitu pengguna meninggalkan menu ini ke menu lain,
08213:   // status login direset — supaya kembali ke menu Setting nanti wajib
08214:   // login ulang. Koneksi Cloudflare (WEB_APP_URL) TIDAK terpengaruh
08215:   // sama sekali oleh reset ini, tetap tersambung seperti biasa.
08216:   if(leavingView === 'setting' && enteringView !== 'setting'){ resetSettingAuth(); }
08217: 
08218:   // Hentikan interval jam berjalan Visual Dashboard saat berpindah halaman,
08219:   // supaya tidak terus berjalan di background dan membuang resource.
08220:   if(leavingView === 'dashboard' && enteringView !== 'dashboard' && DASHBOARD_TIMER_INTERVAL){
08221:     clearInterval(DASHBOARD_TIMER_INTERVAL); DASHBOARD_TIMER_INTERVAL = null;
08222:   }
08223: 
08224:   // Visual Dashboard tampil fullscreen: menu kiri disembunyikan dan hanya
08225:   // muncul saat tombol "Tampilkan Menu" diklik.
08226:   if(enteringView === 'dashboard'){
08227:     $('#app-root').classList.add('dash-mode');
08228:     closeDashMenu();
08229:   } else if(leavingView === 'dashboard'){
08230:     $('#app-root').classList.remove('dash-mode');
08231:     closeDashMenu();
08232:   }
08233: 
08234:   if(enteringView === 'utama') invokeViewRenderer_(enteringView, renderUtama, 'renderUtama');
08235:   if(enteringView === 'mesin') invokeViewRenderer_(enteringView, renderMesinView, 'renderMesinView');
08236:   if(enteringView === 'tanggal') invokeViewRenderer_(enteringView, renderTanggalView, 'renderTanggalView');
08237:   if(enteringView === 'pelapor') invokeViewRenderer_(enteringView, renderPelaporView, 'renderPelaporView');
08238:   if(enteringView === 'group') invokeViewRenderer_(enteringView, renderGroupView, 'renderGroupView');
08239:   if(enteringView === 'dashboard') invokeViewRenderer_(enteringView, renderDashboardView, 'renderDashboardView');
08240:   if(enteringView === 'omodos4') invokeViewRenderer_(enteringView, renderOmodos4, 'renderOmodos4');
08241:   if(enteringView === 'durasi') invokeViewRenderer_(enteringView, renderDurasiView, 'renderDurasiView');
08242:   if(enteringView === 'correlation') invokeViewRenderer_(enteringView, renderCorrelationView, 'renderCorrelationView');
08243:   if(enteringView === 'diagnostic') invokeViewRenderer_(enteringView, renderDiagnosticView, 'renderDiagnosticView');
08244:   if(enteringView === 'analitik') invokeViewRenderer_(enteringView, renderAnalitikView, 'renderAnalitikView');
08245:   if(enteringView === 'kpi-department') invokeViewRenderer_(enteringView, renderKpiDepartmentView, 'renderKpiDepartmentView');
08246:   if(enteringView === 'kpi-input') invokeViewRenderer_(enteringView, renderKpiKerjaTable, 'renderKpiKerjaTable');
08247:   if(enteringView === 'machine-breakdown') invokeViewRenderer_(enteringView, reloadAndRenderMachineBreakdown, 'reloadAndRenderMachineBreakdown');
~~~

### Around line 8558
~~~text
08542:   ripple.style.top = (ev.clientY - rect.top - size/2) + 'px';
08543:   btn.appendChild(ripple);
08544:   setTimeout(()=> ripple.remove(), 600);
08545: });
08546: 
08547: /* ---------------- DATA LOADING ---------------- */
08548: let PREPARATION_PROMISE = null;
08549: async function loadAll(){
08550:   if(PREPARATION_PROMISE) return PREPARATION_PROMISE;
08551:   PREPARATION_PROMISE = prepareAllData_();
08552:   try{ return await PREPARATION_PROMISE; }finally{ PREPARATION_PROMISE = null; }
08553: }
08554: async function prepareAllData_(){
08555:   // Yield until all script declarations (including project/meeting state) exist.
08556:   await new Promise(resolve=>setTimeout(resolve,0));
08557:   const token = SESSION_TOKEN;
08558:   if(!WEB_APP_URL || !token) throw new Error('AUTH_REQUIRED');
08559: 
08560:   const manifest = await apiGet('prepareManifest', {fresh:'1'}, 1);
08561:   if(!manifest || !Array.isArray(manifest.actions)) throw new Error('Manifest persiapan backend tidak valid.');
08562: 
08563:   // Backend baru selalu menempatkan bootstrap sebagai sumber minimum untuk
08564:   // membuka Home. Tetap kompatibel dengan backend transisi yang belum
08565:   // mencantumkannya: jalur legacy memakai machines/personil sebagai minimum.
08566:   const hasBootstrap = manifest.actions.includes('bootstrap');
08567:   const pending = manifest.actions.slice();
08568:   const data = {};
08569:   const errors = [];
08570:   let done = 0;
08571:   const progress = ()=>{
08572:     const el = document.getElementById('app-splash-text');
08573:     if(el) el.textContent = 'Menyiapkan data… '+done+' / '+manifest.actions.length;
08574:   };
08575:   progress();
08576: 
08577:   await Promise.all(Array.from({length:Math.min(4,Math.max(1,pending.length))},async()=>{
08578:     while(pending.length){
08579:       const action = pending.shift();
08580:       try{
08581:         data[action] = await apiGet(action, {}, 1);
08582:       }catch(e){
08583:         errors.push({action,message:String(e&&e.message||e)});
08584:       }
08585:       done++;
08586:       progress();
08587:     }
08588:   }));
08589: 
08590:   if(token !== SESSION_TOKEN) throw new Error('SESSION_INVALID');
08591: 
~~~

### Around line 11032
~~~text
11016:       toast('Entri dihapus');
11017:       closeModal();
11018:       await renderKnowledgeView();
11019:     }catch(err){ toast('Gagal menghapus: ' + err.message, true); }
11020:   });
11021: 
11022:   // [FITUR BARU] "Rapikan & Lengkapi dengan AI" (Groq) -- lihat
11023:   // handleGroqKbEnrich_ di code.gs. Hasilnya ditampilkan sebagai panel
11024:   // review Sebelum/Sesudah TEPAT DI DALAM form yang sama (bukan modal
11025:   // terpisah), supaya state form (kategori/mesin/sumber yang sudah dipilih)
11026:   // tidak hilang. User tetap yang memutuskan Terapkan/Abaikan per hasil.
11027:   const btnKbEnrich = $('#btn-kb-ai-enrich');
11028:   if(btnKbEnrich) btnKbEnrich.addEventListener('click', async ()=>{
11029:     const judulEl = $('#kb-f-judul'), kontenEl = $('#kb-f-konten'), tagsEl = $('#kb-f-tags'), katEl = $('#kb-f-kategori');
11030:     const judul = judulEl.value.trim(), konten = kontenEl.value.trim();
11031:     if(!judul && !konten){ toast('Isi judul atau konten dulu sebelum dirapikan.', true); return; }
11032:     if(!WEB_APP_URL){ toast('Fitur AI External membutuhkan koneksi backend Cloudflare -- belum tersambung.', true); return; }
11033:     $('#kb-enrich-review')?.remove(); // hapus hasil review sebelumnya kalau tombol diklik ulang
11034:     const oldLabel = btnKbEnrich.innerHTML;
11035:     btnKbEnrich.disabled = true; btnKbEnrich.innerHTML = '<span class="ai-spinner" style="width:11px;height:11px;"></span> Merapikan...';
11036:     try{
11037:       const res = await apiPost({ action:'groqKbEnrich', judul, konten, kategori: katEl.value });
11038:       const panel = document.createElement('div');
11039:       panel.id = 'kb-enrich-review';
11040:       panel.className = 'ai-fix-diff-box new';
11041:       panel.style.marginTop = '10px';
11042:       panel.innerHTML = `
11043:         <div style="font-weight:700;margin-bottom:8px;"><i class="ph-bold ph-sparkle"></i> Usulan AI External -- tinjau dulu sebelum diterapkan</div>
11044:         <div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">Judul</div>
11045:         <div style="margin-bottom:8px;">${escapeHtml(res.judul||'-')}</div>
11046:         <div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">Konten</div>
11047:         <div style="white-space:pre-wrap;margin-bottom:8px;">${escapeHtml(res.konten||'-')}</div>
11048:         <div style="font-size:11px;color:var(--text-dim);margin-bottom:2px;">Tags usulan</div>
11049:         <div style="margin-bottom:10px;">${escapeHtml(res.tags||'-')}</div>
11050:         <div style="display:flex;gap:8px;">
11051:           <button type="button" class="btn btn-sm btn-primary" id="btn-kb-enrich-apply"><i class="ph-bold ph-check"></i> Terapkan ke Form</button>
11052:           <button type="button" class="btn btn-sm btn-ghost" id="btn-kb-enrich-dismiss">Abaikan</button>
11053:         </div>`;
11054:       kontenEl.closest('.field').appendChild(panel);
11055:       $('#btn-kb-enrich-apply').addEventListener('click', ()=>{
11056:         judulEl.value = res.judul || judulEl.value;
11057:         kontenEl.value = res.konten || kontenEl.value;
11058:         if(res.tags) tagsEl.value = res.tags;
11059:         panel.remove();
11060:         toast('Diterapkan ke form -- cek sekali lagi sebelum Simpan.');
11061:       });
11062:       $('#btn-kb-enrich-dismiss').addEventListener('click', ()=> panel.remove());
11063:     }catch(err){
11064:       toast('Gagal merapikan dengan AI: ' + (err.message||err), true);
11065:     }finally{
~~~

### Around line 11093
~~~text
11077: const btnKbSuggestRefresh = $('#btn-kb-suggest-refresh');
11078: if(btnKbSuggestRefresh) btnKbSuggestRefresh.addEventListener('click', kbRenderSuggestions);
11079: 
11080: // [FITUR BARU] Auto-Sync ke KB (AI Groq) -- mengolah SEMUA saran otomatis
11081: // sekaligus tanpa perlu buka form satu-satu: tiap kandidat (1) dicek dulu
11082: // kemiripannya dengan entri yang SUDAH ADA (termasuk entri yang baru saja
11083: // ditambahkan di batch yang sama -- KB_ENTRIES di-update langsung tiap
11084: // iterasi supaya 2 kandidat yang sebenarnya mirip TIDAK berdua-duanya lolos
11085: // masuk hanya karena diproses dalam 1 batch yang sama), (2) kalau bukan
11086: // duplikat, dirapikan dulu oleh Groq (handleGroqKbEnrich_ di code.gs) --
11087: // fail-open: kalau Groq gagal/timeout, tetap disimpan versi asli daripada
11088: // kehilangan datanya sama sekali, (3) baru dikirim ke Sheets lewat action
11089: // 'saveKbEntry' yang sama dipakai form manual. Diproses SATU PER SATU
11090: // (bukan paralel) supaya ramah terhadap rate-limit Groq & supaya
11091: // pengecekan duplikat di poin (1) akurat antar-item dalam batch yang sama.
11092: async function kbAutoSyncAll(){
11093:   if(!WEB_APP_URL){ toast('Auto-Sync butuh koneksi database SQLite (menu Setting) -- belum tersambung.', true); return; }
11094:   const allSuggestions = kbBuildSuggestions();
11095:   if(!allSuggestions.length){ toast('Tidak ada saran baru untuk disinkronkan -- semua sumber sudah tercakup di KB.'); return; }
11096:   const CAP = 50; // batas wajar per-jalan supaya tidak berjalan berjam-jam tanpa disadari; sisanya bisa dijalankan lagi setelah batch ini selesai
11097:   const batch = allSuggestions.slice(0, CAP);
11098:   const truncNote = allSuggestions.length > CAP ? `\n\n(Dibatasi ${CAP} dari total ${allSuggestions.length} saran yang tersedia -- sisanya bisa di-Auto-Sync lagi setelah batch ini selesai, karena yang sudah masuk KB tidak akan disarankan ulang.)` : '';
11099:   if(!confirm(`Auto-Sync akan memproses ${batch.length} saran: tiap item dicek duplikat, dirapikan AI (Groq), lalu dikirim ke Sheets secara otomatis tanpa review manual. Proses berjalan satu-per-satu dan bisa memakan waktu beberapa menit.${truncNote}\n\nLanjutkan?`)) return;
11100: 
11101:   $('#modal-content').innerHTML = `
11102:     <div class="modal-head"><div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-robot"></i> Auto-Sync Knowledge Base</h2></div></div>
11103:     <div class="sub" id="kb-autosync-status" style="margin-bottom:10px;">Memulai...</div>
11104:     <div id="kb-autosync-log" style="max-height:340px;overflow-y:auto;font-size:12.5px;line-height:1.8;border:1px solid var(--line);border-radius:8px;padding:8px 10px;"></div>
11105:     <div style="margin-top:16px;display:flex;gap:10px;">
11106:       <button class="btn btn-ghost" id="btn-kb-autosync-close" disabled>Sedang berjalan...</button>
11107:     </div>
11108:   `;
11109:   $('#modal-bg').classList.add('active');
11110:   const logEl = $('#kb-autosync-log');
11111:   const statusEl = $('#kb-autosync-status');
11112:   const closeBtn = $('#btn-kb-autosync-close');
11113:   const addLog = (icon, text)=>{
11114:     const row = document.createElement('div');
11115:     row.textContent = `${icon} ${text}`;
11116:     logEl.appendChild(row);
11117:     logEl.scrollTop = logEl.scrollHeight;
11118:   };
11119: 
11120:   let added = 0, skippedDup = 0, failed = 0;
11121:   for(let i=0; i<batch.length; i++){
11122:     const s = batch[i];
11123:     statusEl.textContent = `Memproses ${i+1}/${batch.length}: ${s.judul}`;
11124: 
11125:     const similar = kbFindSimilarEntries(s.judul, s.konten, s.kategori, null);
11126:     if(similar.length){
~~~

### Around line 11365
~~~text
11349:       <div style="margin-top:14px;">
11350:         <button class="btn btn-primary" id="btn-generate-rca"><i class="ph-bold ph-file-text"></i> Buat Laporan RCA</button>
11351:       </div>
11352:     </div>`;
11353:   $('#btn-generate-rca').addEventListener('click', ()=> generateRcaReport(RCA_MACHINE_FILTER, sel.entry, sel.mins));
11354: }
11355: 
11356: let RCA_TITLE = '';
11357: let RCA_SECTIONS = [];
11358: let RCA_SECTION_SEQ = 0;
11359: let RCA_CURRENT_ID = null;
11360: function loadRcaReportsLocal(){
11361:   try{ return JSON.parse(localStorage.getItem(LS_RCA_KEY) || '[]'); }catch(e){ return []; }
11362: }
11363: function saveRcaReportsLocal(list){ localStorage.setItem(LS_RCA_KEY, JSON.stringify(list)); }
11364: async function syncRcaReportsFromBackend(){
11365:   if(!WEB_APP_URL) return loadRcaReportsLocal();
11366:   try{
11367:     const remote = await apiGet('rcaReports');
11368:     if(Array.isArray(remote)){
11369:       const normalized = remote.map(r=>({
11370:         id: r.id || r.ID, ts: Number(r.ts || r.Timestamp) || Date.now(),
11371:         machineName: r.machineName || r['Nama Mesin'] || '',
11372:         title: r.title || r.Title || '',
11373:         sections: typeof r.sections === 'string' ? JSON.parse(r.sections || '[]') : (r.sections || (typeof r.SectionsJSON === 'string' ? JSON.parse(r.SectionsJSON||'[]') : [])),
11374:       }));
11375:       saveRcaReportsLocal(normalized);
11376:       return normalized;
11377:     }
11378:   }catch(e){ /* action 'rcaReports' mungkin belum tersedia di backend; pakai cache lokal */ }
11379:   return loadRcaReportsLocal();
11380: }
11381: async function persistRcaReport(report){
11382:   const list = loadRcaReportsLocal();
11383:   const idx = list.findIndex(x=>x.id===report.id);
11384:   if(idx >= 0) list[idx] = report; else list.push(report);
11385:   saveRcaReportsLocal(list);
11386:   if(!WEB_APP_URL) return { id: report.id, synced:false, reason:'NO_URL' };
11387:   try{
11388:     await apiPost({ action:'saveRcaReport', report: { id: report.id, machineName: report.machineName, title: report.title, sections: JSON.stringify(report.sections||[]) } });
11389:     return { id: report.id, synced:true };
11390:   }catch(e){ return { id: report.id, synced:false, reason: e.message }; }
11391: }
11392: async function deleteRcaReportRemote(id){
11393:   saveRcaReportsLocal(loadRcaReportsLocal().filter(r=>r.id!==id));
11394:   if(!WEB_APP_URL) return;
11395:   try{ await apiPost({ action:'deleteRcaReport', id }); }
11396:   catch(e){ /* backend belum mendukung penghapusan remote; data lokal tetap terhapus */ }
11397: }
11398: function renderRcaSavedList(){
~~~

### Around line 11386
~~~text
11370:         id: r.id || r.ID, ts: Number(r.ts || r.Timestamp) || Date.now(),
11371:         machineName: r.machineName || r['Nama Mesin'] || '',
11372:         title: r.title || r.Title || '',
11373:         sections: typeof r.sections === 'string' ? JSON.parse(r.sections || '[]') : (r.sections || (typeof r.SectionsJSON === 'string' ? JSON.parse(r.SectionsJSON||'[]') : [])),
11374:       }));
11375:       saveRcaReportsLocal(normalized);
11376:       return normalized;
11377:     }
11378:   }catch(e){ /* action 'rcaReports' mungkin belum tersedia di backend; pakai cache lokal */ }
11379:   return loadRcaReportsLocal();
11380: }
11381: async function persistRcaReport(report){
11382:   const list = loadRcaReportsLocal();
11383:   const idx = list.findIndex(x=>x.id===report.id);
11384:   if(idx >= 0) list[idx] = report; else list.push(report);
11385:   saveRcaReportsLocal(list);
11386:   if(!WEB_APP_URL) return { id: report.id, synced:false, reason:'NO_URL' };
11387:   try{
11388:     await apiPost({ action:'saveRcaReport', report: { id: report.id, machineName: report.machineName, title: report.title, sections: JSON.stringify(report.sections||[]) } });
11389:     return { id: report.id, synced:true };
11390:   }catch(e){ return { id: report.id, synced:false, reason: e.message }; }
11391: }
11392: async function deleteRcaReportRemote(id){
11393:   saveRcaReportsLocal(loadRcaReportsLocal().filter(r=>r.id!==id));
11394:   if(!WEB_APP_URL) return;
11395:   try{ await apiPost({ action:'deleteRcaReport', id }); }
11396:   catch(e){ /* backend belum mendukung penghapusan remote; data lokal tetap terhapus */ }
11397: }
11398: function renderRcaSavedList(){
11399:   const holder = $('#list-rca-saved');
11400:   if(!holder) return;
11401:   const list = loadRcaReportsLocal().slice().sort((a,b)=> b.ts - a.ts);
11402:   if(!list.length){
11403:     holder.innerHTML = `<div class="report-cat-sub">Belum ada report RCA tersimpan.</div>`;
11404:     return;
11405:   }
11406:   holder.innerHTML = list.map(r => `
11407:     <div class="ipal-saved-item" data-id="${escapeHtml(r.id)}">
11408:       <div>
11409:         <b>${escapeHtml(r.title || '(Tanpa judul)')}</b>
11410:         <div class="report-cat-sub">Mesin: ${escapeHtml(r.machineName || '-')}</div>
11411:       </div>
11412:       <div style="display:flex;gap:8px;">
11413:         <button class="btn btn-sm rca-open" data-id="${escapeHtml(r.id)}"><i class="ph-bold ph-pencil-simple"></i> Edit</button>
11414:         <button class="btn btn-sm btn-danger rca-delete" data-id="${escapeHtml(r.id)}"><i class="ph-bold ph-trash"></i></button>
11415:       </div>
11416:     </div>`).join('');
11417:   $$('.rca-open', holder).forEach(b=> b.addEventListener('click', ()=>{
11418:     const rep = loadRcaReportsLocal().find(r=>r.id===b.dataset.id);
11419:     if(rep) openSavedRcaReport(rep);
~~~

### Around line 11394
~~~text
11378:   }catch(e){ /* action 'rcaReports' mungkin belum tersedia di backend; pakai cache lokal */ }
11379:   return loadRcaReportsLocal();
11380: }
11381: async function persistRcaReport(report){
11382:   const list = loadRcaReportsLocal();
11383:   const idx = list.findIndex(x=>x.id===report.id);
11384:   if(idx >= 0) list[idx] = report; else list.push(report);
11385:   saveRcaReportsLocal(list);
11386:   if(!WEB_APP_URL) return { id: report.id, synced:false, reason:'NO_URL' };
11387:   try{
11388:     await apiPost({ action:'saveRcaReport', report: { id: report.id, machineName: report.machineName, title: report.title, sections: JSON.stringify(report.sections||[]) } });
11389:     return { id: report.id, synced:true };
11390:   }catch(e){ return { id: report.id, synced:false, reason: e.message }; }
11391: }
11392: async function deleteRcaReportRemote(id){
11393:   saveRcaReportsLocal(loadRcaReportsLocal().filter(r=>r.id!==id));
11394:   if(!WEB_APP_URL) return;
11395:   try{ await apiPost({ action:'deleteRcaReport', id }); }
11396:   catch(e){ /* backend belum mendukung penghapusan remote; data lokal tetap terhapus */ }
11397: }
11398: function renderRcaSavedList(){
11399:   const holder = $('#list-rca-saved');
11400:   if(!holder) return;
11401:   const list = loadRcaReportsLocal().slice().sort((a,b)=> b.ts - a.ts);
11402:   if(!list.length){
11403:     holder.innerHTML = `<div class="report-cat-sub">Belum ada report RCA tersimpan.</div>`;
11404:     return;
11405:   }
11406:   holder.innerHTML = list.map(r => `
11407:     <div class="ipal-saved-item" data-id="${escapeHtml(r.id)}">
11408:       <div>
11409:         <b>${escapeHtml(r.title || '(Tanpa judul)')}</b>
11410:         <div class="report-cat-sub">Mesin: ${escapeHtml(r.machineName || '-')}</div>
11411:       </div>
11412:       <div style="display:flex;gap:8px;">
11413:         <button class="btn btn-sm rca-open" data-id="${escapeHtml(r.id)}"><i class="ph-bold ph-pencil-simple"></i> Edit</button>
11414:         <button class="btn btn-sm btn-danger rca-delete" data-id="${escapeHtml(r.id)}"><i class="ph-bold ph-trash"></i></button>
11415:       </div>
11416:     </div>`).join('');
11417:   $$('.rca-open', holder).forEach(b=> b.addEventListener('click', ()=>{
11418:     const rep = loadRcaReportsLocal().find(r=>r.id===b.dataset.id);
11419:     if(rep) openSavedRcaReport(rep);
11420:   }));
11421:   $$('.rca-delete', holder).forEach(b=> b.addEventListener('click', async (e)=>{
11422:     e.stopPropagation();
11423:     if(!confirm('Hapus report RCA ini?')) return;
11424:     await deleteRcaReportRemote(b.dataset.id);
11425:     renderRcaSavedList();
11426:   }));
11427: }
~~~

### Around line 11587
~~~text
11571:   return section;
11572: }
11573: 
11574: function parseAiRcaText(summary){
11575:   const out = { whys: [null,null,null,null,null], rootCause:'', recommendedAction:'' };
11576:   const lines = String(summary||'').split('\n').map(l=>l.trim()).filter(Boolean);
11577:   lines.forEach(line=>{
11578:     let m;
11579:     if((m = line.match(/^why\s*([1-5])\s*[:.\-]\s*(.+)$/i))){ out.whys[+m[1]-1] = m[2].trim(); }
11580:     else if((m = line.match(/^root\s*cause\s*[:.\-]\s*(.+)$/i))){ out.rootCause = m[1].trim(); }
11581:     else if((m = line.match(/^(recommended action|rekomendasi)\s*[:.\-]\s*(.+)$/i))){ out.recommendedAction = m[2].trim(); }
11582:   });
11583:   return out;
11584: }
11585: 
11586: async function aiFillSectionFromBackend(section, entry){
11587:   if(!WEB_APP_URL){ aiFillSectionLocal(section, entry); return { ok:false, reason:'NO_URL' }; }
11588:   const query = `Buatkan analisa Root Cause Analysis (5-Why) untuk masalah mesin berikut, gunakan juga referensi pengetahuan umum/industri (internet) yang relevan, bukan hanya data logbook ini saja.
11589: Deskripsi Masalah: ${truncateText(entry['Deskripsi Masalah'], 300)}
11590: Tindakan Perbaikan yang sudah dilakukan: ${truncateText(entry['Tindakan Perbaikan'], 300)}
11591: Mesin/Unit: ${entry['Nama Mesin']||'-'} / ${entry['Nama Unit']||'-'}
11592: Jawab dengan format baris per baris persis seperti ini (isi bagian setelah tanda titik dua, satu baris tiap poin, tanpa penjelasan tambahan lain):
11593: Why 1: ...
11594: Why 2: ...
11595: Why 3: ...
11596: Why 4: ...
11597: Why 5: ...
11598: Root Cause: ...
11599: Recommended Action: ...`;
11600:   try{
11601:     const res = await apiPost({ action:'aiAnalyze', mode:'freeform', query, cases:[{
11602:       id: entry['ID'], mesin: entry['Nama Mesin'], unit: entry['Nama Unit'],
11603:       masalah: truncateText(entry['Deskripsi Masalah'], 300),
11604:       tindakan: truncateText(entry['Tindakan Perbaikan'], 300),
11605:       tanggal: entry['Tanggal']
11606:     }], localPatterns:[] });
11607:     if(!res || !res.data){ aiFillSectionLocal(section, entry); return { ok:false, reason:'NO_DATA' }; }
11608:     const parsed = parseAiRcaText(res.data.summary);
11609:     const localAnalysis = analyzeRCA(entry);
11610:     section.whys = [0,1,2,3,4].map(i => parsed.whys[i] || localAnalysis.whyChain[i]);
11611:     section.rootCause = parsed.rootCause || localAnalysis.whyChain[2];
11612:     section.recommendedAction = parsed.recommendedAction
11613:       || (Array.isArray(res.data.recommendations) && res.data.recommendations[0] && res.data.recommendations[0].tindakan)
11614:       || localAnalysis.rekomendasi[0];
11615:     section.causesByCategory = {};
11616:     Object.keys(localAnalysis.causesByCategory).forEach(k=>{ section.causesByCategory[k] = localAnalysis.causesByCategory[k].slice(); });
11617:     if(!section.correctiveAction) section.correctiveAction = entry['Tindakan Perbaikan'] || '-';
11618:     if(localAnalysis.primary) section.kategori = RCA_CATEGORY_LABEL[localAnalysis.primary.kategori].replace(/\s*\(.*\)/,'');
11619:     return { ok:true };
11620:   }catch(err){
~~~

### Around line 12184
~~~text
12168:   $('#btn-report-back-cat').style.display = '';
12169:   renderIpalLanding();
12170: }
12171: 
12172: function loadIpalReportsLocal(){
12173:   try{ return JSON.parse(localStorage.getItem(LS_IPAL_KEY) || '[]'); }
12174:   catch(e){ return []; }
12175: }
12176: function saveIpalReportsLocal(list){
12177:   localStorage.setItem(LS_IPAL_KEY, JSON.stringify(list));
12178: }
12179: // Kompatibilitas nama lama
12180: function loadIpalReports(){ return loadIpalReportsLocal(); }
12181: function saveIpalReports(list){ saveIpalReportsLocal(list); }
12182: 
12183: async function syncIpalReportsFromBackend(){
12184:   if(!WEB_APP_URL) return loadIpalReportsLocal();
12185:   try{
12186:     const remote = await apiGet('ipalReports');
12187:     if(Array.isArray(remote)){
12188:       const normalized = remote.map(r=>({
12189:         id: r.id || r.ID,
12190:         pelapor: r.pelapor || r.Pelapor || '',
12191:         bulan: r.bulan || r.Bulan || '',
12192:         outletLabel: r.outletLabel || r.OutletLabel || '',
12193:         daily: typeof r.daily === 'string' ? JSON.parse(r.daily || '{}') : (r.daily || (typeof r.DailyJSON === 'string' ? JSON.parse(r.DailyJSON||'{}') : {})),
12194:         chemical: typeof r.chemical === 'string' ? JSON.parse(r.chemical || '[]') : (r.chemical || (typeof r.ChemicalJSON === 'string' ? JSON.parse(r.ChemicalJSON||'[]') : [])),
12195:       }));
12196:       saveIpalReportsLocal(normalized);
12197:       return normalized;
12198:     }
12199:   }catch(e){
12200:     // action 'ipalReports' mungkin belum tersedia di backend (script belum ditambahkan);
12201:     // gunakan cache lokal sebagai fallback, tidak mengganggu pengguna dengan error.
12202:   }
12203:   return loadIpalReportsLocal();
12204: }
12205: 
12206: async function persistIpalReport(report){
12207:   // Selalu simpan ke cache lokal dulu supaya tidak ada data hilang.
12208:   const list = loadIpalReportsLocal();
12209:   const idx = list.findIndex(x=>x.id===report.id);
12210:   if(idx >= 0) list[idx] = report; else list.push(report);
12211:   saveIpalReportsLocal(list);
12212: 
12213:   if(!WEB_APP_URL) return { synced:false, reason:'NO_URL' };
12214:   try{
12215:     await apiPost({ action:'saveIpalReport', report: {
12216:       id: report.id, pelapor: report.pelapor, bulan: report.bulan, outletLabel: report.outletLabel,
12217:       daily: JSON.stringify(report.daily || {}), chemical: JSON.stringify(report.chemical || []),
~~~

### Around line 12213
~~~text
12197:       return normalized;
12198:     }
12199:   }catch(e){
12200:     // action 'ipalReports' mungkin belum tersedia di backend (script belum ditambahkan);
12201:     // gunakan cache lokal sebagai fallback, tidak mengganggu pengguna dengan error.
12202:   }
12203:   return loadIpalReportsLocal();
12204: }
12205: 
12206: async function persistIpalReport(report){
12207:   // Selalu simpan ke cache lokal dulu supaya tidak ada data hilang.
12208:   const list = loadIpalReportsLocal();
12209:   const idx = list.findIndex(x=>x.id===report.id);
12210:   if(idx >= 0) list[idx] = report; else list.push(report);
12211:   saveIpalReportsLocal(list);
12212: 
12213:   if(!WEB_APP_URL) return { synced:false, reason:'NO_URL' };
12214:   try{
12215:     await apiPost({ action:'saveIpalReport', report: {
12216:       id: report.id, pelapor: report.pelapor, bulan: report.bulan, outletLabel: report.outletLabel,
12217:       daily: JSON.stringify(report.daily || {}), chemical: JSON.stringify(report.chemical || []),
12218:     }});
12219:     return { synced:true };
12220:   }catch(e){
12221:     return { synced:false, reason: e.message };
12222:   }
12223: }
12224: 
12225: async function deleteIpalReportRemote(id){
12226:   saveIpalReportsLocal(loadIpalReportsLocal().filter(r=>r.id!==id));
12227:   if(!WEB_APP_URL) return;
12228:   try{ await apiPost({ action:'deleteIpalReport', id }); }
12229:   catch(e){ /* backend belum mendukung penghapusan remote; data lokal tetap terhapus */ }
12230: }
12231: 
12232: function blankIpalReport(){
12233:   return {
12234:     id: 'IPAL-' + Date.now(),
12235:     pelapor: '',
12236:     bulan: new Date().toISOString().slice(0,7),
12237:     outletLabel: '',
12238:     daily: {},   // { "1": {outlet:'', ph:''}, ... }
12239:     chemical: [], // filled by ensureChemicalWeeks()
12240:   };
12241: }
12242: 
12243: function daysInMonth(bulanYYYYMM){
12244:   const [y,m] = String(bulanYYYYMM || '').split('-').map(Number);
12245:   if(!y || !m) return 31;
12246:   return new Date(y, m, 0).getDate();
~~~

### Around line 12227
~~~text
12211:   saveIpalReportsLocal(list);
12212: 
12213:   if(!WEB_APP_URL) return { synced:false, reason:'NO_URL' };
12214:   try{
12215:     await apiPost({ action:'saveIpalReport', report: {
12216:       id: report.id, pelapor: report.pelapor, bulan: report.bulan, outletLabel: report.outletLabel,
12217:       daily: JSON.stringify(report.daily || {}), chemical: JSON.stringify(report.chemical || []),
12218:     }});
12219:     return { synced:true };
12220:   }catch(e){
12221:     return { synced:false, reason: e.message };
12222:   }
12223: }
12224: 
12225: async function deleteIpalReportRemote(id){
12226:   saveIpalReportsLocal(loadIpalReportsLocal().filter(r=>r.id!==id));
12227:   if(!WEB_APP_URL) return;
12228:   try{ await apiPost({ action:'deleteIpalReport', id }); }
12229:   catch(e){ /* backend belum mendukung penghapusan remote; data lokal tetap terhapus */ }
12230: }
12231: 
12232: function blankIpalReport(){
12233:   return {
12234:     id: 'IPAL-' + Date.now(),
12235:     pelapor: '',
12236:     bulan: new Date().toISOString().slice(0,7),
12237:     outletLabel: '',
12238:     daily: {},   // { "1": {outlet:'', ph:''}, ... }
12239:     chemical: [], // filled by ensureChemicalWeeks()
12240:   };
12241: }
12242: 
12243: function daysInMonth(bulanYYYYMM){
12244:   const [y,m] = String(bulanYYYYMM || '').split('-').map(Number);
12245:   if(!y || !m) return 31;
12246:   return new Date(y, m, 0).getDate();
12247: }
12248: 
12249: function weekRangesForMonth(bulanYYYYMM){
12250:   const total = daysInMonth(bulanYYYYMM);
12251:   const ranges = [[1,6],[7,13],[14,20],[21,27],[28,total]];
12252:   return ranges.filter(r => r[0] <= total);
12253: }
12254: 
12255: function ensureChemicalWeeks(report){
12256:   const ranges = weekRangesForMonth(report.bulan);
12257:   const existing = report.chemical || [];
12258:   report.chemical = ranges.map((r, i) => {
12259:     const prev = existing[i] || {};
12260:     return {
~~~

### Around line 12312
~~~text
12296:   }));
12297:   $$('.ipal-delete').forEach(b=> b.addEventListener('click', async (e)=>{
12298:     e.stopPropagation();
12299:     if(!confirm('Hapus report IPAL ini?')) return;
12300:     await deleteIpalReportRemote(b.dataset.id);
12301:     renderIpalLanding();
12302:   }));
12303: }
12304: 
12305: async function renderIpalLanding(){
12306:   const wrap = $('#ipal-form-wrap');
12307:   wrap.style.display = '';
12308:   const localList = loadIpalReportsLocal();
12309:   wrap.innerHTML = `
12310:     <div class="card" style="margin-bottom:18px;">
12311:       <div class="section-title"><i class="ph-bold ph-drop"></i> Report IPAL
12312:         <span class="report-cat-sub" id="ipal-sync-status" style="margin-left:auto;font-weight:400;">${WEB_APP_URL ? 'Menyinkronkan…' : 'Belum tersambung ke database SQLite'}</span>
12313:       </div>
12314:       <div class="grid2">
12315:         <button class="btn btn-primary" id="btn-ipal-new"><i class="ph-bold ph-plus"></i> Buat Report IPAL Baru</button>
12316:       </div>
12317:       <div id="ipal-saved-list" class="ipal-saved-list">${ipalListHTML(localList)}</div>
12318:     </div>
12319:     <div id="ipal-form-content"></div>
12320:   `;
12321:   $('#btn-ipal-new').addEventListener('click', ()=>{
12322:     IPAL_CURRENT = ensureChemicalWeeks(blankIpalReport());
12323:     renderIpalForm();
12324:   });
12325:   bindIpalListEvents();
12326: 
12327:   if(WEB_APP_URL){
12328:     const remoteList = await syncIpalReportsFromBackend();
12329:     const listEl = $('#ipal-saved-list');
12330:     const statusEl = $('#ipal-sync-status');
12331:     if(listEl) listEl.innerHTML = ipalListHTML(remoteList);
12332:     if(statusEl) statusEl.textContent = '● Tersambung ke database SQLite';
12333:     bindIpalListEvents();
12334:   }
12335: }
12336: 
12337: function syncIpalFromDOM(){
12338:   if(!IPAL_CURRENT) return;
12339:   const root = $('#ipal-form-content');
12340:   if(!root) return;
12341:   IPAL_CURRENT.pelapor = $('#ipal-pelapor', root)?.value ?? IPAL_CURRENT.pelapor;
12342:   const newBulan = $('#ipal-bulan', root)?.value;
12343:   if(newBulan && newBulan !== IPAL_CURRENT.bulan){
12344:     IPAL_CURRENT.bulan = newBulan;
12345:     ensureChemicalWeeks(IPAL_CURRENT);
~~~

### Around line 12327
~~~text
12311:       <div class="section-title"><i class="ph-bold ph-drop"></i> Report IPAL
12312:         <span class="report-cat-sub" id="ipal-sync-status" style="margin-left:auto;font-weight:400;">${WEB_APP_URL ? 'Menyinkronkan…' : 'Belum tersambung ke database SQLite'}</span>
12313:       </div>
12314:       <div class="grid2">
12315:         <button class="btn btn-primary" id="btn-ipal-new"><i class="ph-bold ph-plus"></i> Buat Report IPAL Baru</button>
12316:       </div>
12317:       <div id="ipal-saved-list" class="ipal-saved-list">${ipalListHTML(localList)}</div>
12318:     </div>
12319:     <div id="ipal-form-content"></div>
12320:   `;
12321:   $('#btn-ipal-new').addEventListener('click', ()=>{
12322:     IPAL_CURRENT = ensureChemicalWeeks(blankIpalReport());
12323:     renderIpalForm();
12324:   });
12325:   bindIpalListEvents();
12326: 
12327:   if(WEB_APP_URL){
12328:     const remoteList = await syncIpalReportsFromBackend();
12329:     const listEl = $('#ipal-saved-list');
12330:     const statusEl = $('#ipal-sync-status');
12331:     if(listEl) listEl.innerHTML = ipalListHTML(remoteList);
12332:     if(statusEl) statusEl.textContent = '● Tersambung ke database SQLite';
12333:     bindIpalListEvents();
12334:   }
12335: }
12336: 
12337: function syncIpalFromDOM(){
12338:   if(!IPAL_CURRENT) return;
12339:   const root = $('#ipal-form-content');
12340:   if(!root) return;
12341:   IPAL_CURRENT.pelapor = $('#ipal-pelapor', root)?.value ?? IPAL_CURRENT.pelapor;
12342:   const newBulan = $('#ipal-bulan', root)?.value;
12343:   if(newBulan && newBulan !== IPAL_CURRENT.bulan){
12344:     IPAL_CURRENT.bulan = newBulan;
12345:     ensureChemicalWeeks(IPAL_CURRENT);
12346:     renderIpalForm();
12347:     return;
12348:   }
12349:   IPAL_CURRENT.outletLabel = $('#ipal-outlet-label', root)?.value ?? IPAL_CURRENT.outletLabel;
12350:   $$('.ipal-daily-outlet', root).forEach(inp=>{
12351:     const d = inp.dataset.day;
12352:     IPAL_CURRENT.daily[d] = IPAL_CURRENT.daily[d] || {};
12353:     IPAL_CURRENT.daily[d].outlet = inp.value;
12354:   });
12355:   $$('.ipal-daily-ph', root).forEach(inp=>{
12356:     const d = inp.dataset.day;
12357:     IPAL_CURRENT.daily[d] = IPAL_CURRENT.daily[d] || {};
12358:     IPAL_CURRENT.daily[d].ph = inp.value;
12359:   });
12360:   $$('.ipal-chem-input', root).forEach(inp=>{
~~~

### Around line 12615
~~~text
12599:   });
12600: }
12601: function saveSparepartStatusLocal(){
12602:   localStorage.setItem(LS_SPAREPART_KEY, JSON.stringify(SPAREPART_STATUS));
12603: }
12604: function getSparepartSapEntry(id){
12605:   return SPAREPART_STATUS[id] || { status:'PENDING', sapDoc:'', pic:'' };
12606: }
12607: function setSparepartSapEntry(id, patch){
12608:   const cur = getSparepartSapEntry(id);
12609:   SPAREPART_STATUS[id] = { ...cur, ...patch };
12610:   saveSparepartStatusLocal();
12611: }
12612: async function syncSparepartStatusFromBackend(){
12613:   // Source of truth lintas device: Sparepart_SAP_Status di backend.
12614:   // Cache localStorage hanya fallback tampilan ketika backend belum terjangkau.
12615:   if(!WEB_APP_URL) return false;
12616:   try{
12617:     const remoteSap = await apiGet('sparepartSapStatus');
12618:     if(Array.isArray(remoteSap)){
12619:       const next = {};
12620:       remoteSap.forEach(r=>{
12621:         const id = String(r['ID']||r['Entry ID']||'').trim();
12622:         if(!id) return;
12623:         const raw = String(r['Status']||'PENDING').toUpperCase();
12624:         next[id] = {
12625:           status:(raw==='DONE'||raw==='COMPLETED'||raw==='COLLECTED')?'COMPLETED':'PENDING',
12626:           sapDoc:r['SAP Doc No']||'',
12627:           pic:r['PIC']||'',
12628:           updatedAt:r['Updated At']||''
12629:         };
12630:       });
12631:       SPAREPART_STATUS = next;
12632:       saveSparepartStatusLocal();
12633:       return true;
12634:     }
12635:   }catch(e){ /* fallback endpoint legacy di bawah */ }
12636:   try{
12637:     const remote = await apiGet('sparepartStatus');
12638:     if(remote && typeof remote === 'object' && !Array.isArray(remote)){
12639:       const next = {};
12640:       Object.keys(remote).forEach(id=>{
12641:         const raw = String(remote[id]||'PENDING').toUpperCase();
12642:         next[id] = { status:(raw==='DONE'||raw==='COMPLETED'||raw==='COLLECTED')?'COMPLETED':'PENDING', sapDoc:'', pic:'' };
12643:       });
12644:       SPAREPART_STATUS = next;
12645:       saveSparepartStatusLocal();
12646:       return true;
12647:     }
12648:   }catch(e){ /* backend tidak tersedia: pakai cache lokal yang sudah dimuat */ }
~~~

### Around line 12672
~~~text
12656:    satu master (SPAREPART_LOKASI, dari sheet Sparepart_Lokasi yang sudah
12657:    diperluas kolomnya: SAP, Nama, Lokasi Gudang, Harga Satuan, Stock Qty,
12658:    Satuan) supaya SATU Material Number SAP = SATU baris data yang dipakai
12659:    bersama oleh SELURUH fitur sparepart: kartu & grafik cost di menu
12660:    Sparepart, kartu lokasi rak di form input Logbook, dan Stock Sistem di
12661:    Stock Opname (dulu baca dari STOCK_SPAREPART terpisah, sekarang dari
12662:    sini juga -- lihat findStockSistemBySap di bawah). Backend otomatis
12663:    meng-impor sisa data dari sheet Stock_Sparepart lama (kalau ada) ke
12664:    master ini sekali jalan, jadi tidak ada data yang hilang. */
12665: let SPAREPART_LOKASI = [];
12666: let SPAREPART_LOKASI_EDIT_SAP = null;
12667: 
12668: function loadSparepartLokasiLocal(){ try{ return JSON.parse(localStorage.getItem(LS_SPAREPART_LOKASI_KEY)||'[]'); }catch(e){ return []; } }
12669: function saveSparepartLokasiLocal(list){ localStorage.setItem(LS_SPAREPART_LOKASI_KEY, JSON.stringify(list)); SPAREPART_LOKASI = list; }
12670: async function syncSparepartLokasiFromBackend(){
12671:   SPAREPART_LOKASI = loadSparepartLokasiLocal();
12672:   if(!WEB_APP_URL) return SPAREPART_LOKASI;
12673:   try{
12674:     const remote = await apiGet('sparepartLokasi');
12675:     if(Array.isArray(remote)){
12676:       const normalized = remote.map(r=>({
12677:         sap: String(r['Material Number SAP']||'').trim(),
12678:         nama: r['Nama Material']||'',
12679:         lokasiGudang: r['Lokasi Gudang']||'',
12680:         harga: Number(r['Harga Satuan']) || 0,
12681:         stockQty: (r['Stock Qty']===''||r['Stock Qty']==null) ? null : Number(r['Stock Qty']),
12682:         satuan: r['Satuan']||''
12683:       }));
12684:       saveSparepartLokasiLocal(normalized);
12685:     }
12686:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12687:   return SPAREPART_LOKASI;
12688: }
12689: function findSparepartLokasiBySap(sap){
12690:   const s = String(sap||'').trim();
12691:   if(!s) return null;
12692:   return SPAREPART_LOKASI.find(x=> x.sap === s) || null;
12693: }
12694: // [EDIT] Menggantikan findStockSistemBySap yang dulu baca dari STOCK_SPAREPART
12695: // (sheet Stock_Sparepart terpisah, perlu tombol "Muat Ulang Stock" manual) --
12696: // sekarang Stock Qty adalah bagian dari master SPAREPART_LOKASI yang sama,
12697: // jadi otomatis tersedia begitu SPAREPART_LOKASI sudah dimuat (loadAll),
12698: // tanpa perlu langkah muat ulang terpisah.
12699: function findStockSistemBySap(sap){
12700:   const r = findSparepartLokasiBySap(sap);
12701:   return (r && r.stockQty != null) ? r.stockQty : null;
12702: }
12703: function resetSparepartLokasiForm(){
12704:   SPAREPART_LOKASI_EDIT_SAP = null;
12705:   $('#sl-sap').value=''; $('#sl-nama').value=''; $('#sl-lokasi').value=''; $('#sl-harga').value='';
~~~

### Around line 12808
~~~text
12792: });
12793: 
12794: /* ---------------- DATA MANUAL/EDIT MTBF & MTTR PER BULAN ---------------- */
12795: /* ---------------- KPI KERTAS KERJA (Target vs Realisasi per bulan) ---------------- */
12796: const KK_BULAN = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agust','Sep','Okt','Nop','Des'];
12797: let KPI_KERJA = [];
12798: let KPI_DEPARTMENT_MTD = [];
12799: let KPI_DEPARTMENT_YTD = [];
12800: let KPI_DEPARTMENT_META = null;
12801: let KD_ACHIEVEMENT_CHART = null;
12802: let KPI_KERJA_EDIT_ID = null;
12803: 
12804: function loadKpiKerjaLocal(){ try{ return JSON.parse(localStorage.getItem(LS_KPI_KERJA_KEY)||'[]'); }catch(e){ return []; } }
12805: function saveKpiKerjaLocal(list){ localStorage.setItem(LS_KPI_KERJA_KEY, JSON.stringify(list)); KPI_KERJA = list; }
12806: async function syncKpiKerjaFromBackend(){
12807:   KPI_KERJA = loadKpiKerjaLocal();
12808:   if(!WEB_APP_URL) return KPI_KERJA;
12809:   try{
12810:     const remote = await apiGet('kpiKerjaList');
12811:     if(Array.isArray(remote)) saveKpiKerjaLocal(remote);
12812:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12813:   return KPI_KERJA;
12814: }
12815: 
12816: async function syncKpiDepartmentData(){
12817:   if(!WEB_APP_URL) return {mtd:KPI_DEPARTMENT_MTD,ytd:KPI_DEPARTMENT_YTD,meta:KPI_DEPARTMENT_META};
12818:   try{
12819:     const payload = await apiGet('kpiDepartmentData');
12820:     if(payload && typeof payload === 'object'){
12821:       if(Array.isArray(payload.mtd)){
12822:         KPI_DEPARTMENT_MTD = payload.mtd;
12823:         const officialKeys = new Set(payload.mtd.map(r=>String(r['Tahun']||'')+'|'+String(r['KPI']||'')));
12824:         const preserved = KPI_KERJA.filter(r=>!officialKeys.has(String(r['Tahun']||'')+'|'+String(r['KPI']||'')));
12825:         saveKpiKerjaLocal([...preserved, ...payload.mtd]);
12826:       }
12827:       if(Array.isArray(payload.ytd)) KPI_DEPARTMENT_YTD = payload.ytd;
12828:       if(payload.meta) KPI_DEPARTMENT_META = payload.meta;
12829:     }
12830:   }catch(e){ console.warn('KPI Department source sync gagal:', e); }
12831:   return {mtd:KPI_DEPARTMENT_MTD,ytd:KPI_DEPARTMENT_YTD,meta:KPI_DEPARTMENT_META};
12832: }
12833: 
12834: function kkPolaritasOk(polaritas, target, realisasi){
12835:   if(target === '' || target === null || target === undefined) return null;
12836:   if(realisasi === '' || realisasi === null || realisasi === undefined) return null;
12837:   target = Number(target); realisasi = Number(realisasi);
12838:   if(isNaN(target) || isNaN(realisasi)) return null;
12839:   return polaritas === 'Maximized' ? (realisasi >= target) : (realisasi <= target);
12840: }
12841: 
~~~

### Around line 12817
~~~text
12801: let KD_ACHIEVEMENT_CHART = null;
12802: let KPI_KERJA_EDIT_ID = null;
12803: 
12804: function loadKpiKerjaLocal(){ try{ return JSON.parse(localStorage.getItem(LS_KPI_KERJA_KEY)||'[]'); }catch(e){ return []; } }
12805: function saveKpiKerjaLocal(list){ localStorage.setItem(LS_KPI_KERJA_KEY, JSON.stringify(list)); KPI_KERJA = list; }
12806: async function syncKpiKerjaFromBackend(){
12807:   KPI_KERJA = loadKpiKerjaLocal();
12808:   if(!WEB_APP_URL) return KPI_KERJA;
12809:   try{
12810:     const remote = await apiGet('kpiKerjaList');
12811:     if(Array.isArray(remote)) saveKpiKerjaLocal(remote);
12812:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12813:   return KPI_KERJA;
12814: }
12815: 
12816: async function syncKpiDepartmentData(){
12817:   if(!WEB_APP_URL) return {mtd:KPI_DEPARTMENT_MTD,ytd:KPI_DEPARTMENT_YTD,meta:KPI_DEPARTMENT_META};
12818:   try{
12819:     const payload = await apiGet('kpiDepartmentData');
12820:     if(payload && typeof payload === 'object'){
12821:       if(Array.isArray(payload.mtd)){
12822:         KPI_DEPARTMENT_MTD = payload.mtd;
12823:         const officialKeys = new Set(payload.mtd.map(r=>String(r['Tahun']||'')+'|'+String(r['KPI']||'')));
12824:         const preserved = KPI_KERJA.filter(r=>!officialKeys.has(String(r['Tahun']||'')+'|'+String(r['KPI']||'')));
12825:         saveKpiKerjaLocal([...preserved, ...payload.mtd]);
12826:       }
12827:       if(Array.isArray(payload.ytd)) KPI_DEPARTMENT_YTD = payload.ytd;
12828:       if(payload.meta) KPI_DEPARTMENT_META = payload.meta;
12829:     }
12830:   }catch(e){ console.warn('KPI Department source sync gagal:', e); }
12831:   return {mtd:KPI_DEPARTMENT_MTD,ytd:KPI_DEPARTMENT_YTD,meta:KPI_DEPARTMENT_META};
12832: }
12833: 
12834: function kkPolaritasOk(polaritas, target, realisasi){
12835:   if(target === '' || target === null || target === undefined) return null;
12836:   if(realisasi === '' || realisasi === null || realisasi === undefined) return null;
12837:   target = Number(target); realisasi = Number(realisasi);
12838:   if(isNaN(target) || isNaN(realisasi)) return null;
12839:   return polaritas === 'Maximized' ? (realisasi >= target) : (realisasi <= target);
12840: }
12841: 
12842: function kkBuildBulanGrid(){
12843:   const holder = $('#kk-bulan-grid');
12844:   if(!holder) return;
12845:   holder.innerHTML = KK_BULAN.map(b => `
12846:     <div class="kk-bulan-cell">
12847:       <div class="kk-bulan-lbl">${b}</div>
12848:       <input type="number" step="0.01" placeholder="Target" data-kk-bulan="${b}" data-kk-type="target" title="Target ${b}">
12849:       <input type="number" step="0.01" placeholder="Realisasi" data-kk-bulan="${b}" data-kk-type="realisasi" title="Realisasi ${b}">
12850:     </div>
~~~

### Around line 13195
~~~text
13179: ['#kd-tahun','#kd-bulan','#kd-divisi','#kd-period'].forEach(sel=>{const el=$(sel);if(el)el.addEventListener('change',()=>{kdPopulateFilters();renderKpiDepartmentView();});});
13180: const kdRefreshBtn=$('#btn-kd-refresh');if(kdRefreshBtn)kdRefreshBtn.addEventListener('click',async()=>{await renderKpiDepartmentView();toast('KPI Department diperbarui dari database.');});
13181: 
13182: /* ===================== BREAKDOWN MESIN (MTD/YTD) =====================
13183:    Data mentah per-mesin dari sheet chart_Printing/Chart_Conv di Excel Kertas Kerja.
13184:    Terpisah dari KPI_KERJA (ringkasan) supaya tidak dobel -- lihat SHEET_MACHINE_BREAKDOWN
13185:    di backend. Key unik Tahun+Bulan+Periode+Mesin: input ulang kombinasi yang sama = update. */
13186: const LS_MBD_KEY = 'omodos_machine_breakdown';
13187: let MACHINE_BREAKDOWN = [];
13188: let MBD_EDIT_ID = null;
13189: 
13190: function loadMbdLocal(){ try{ return JSON.parse(localStorage.getItem(LS_MBD_KEY)||'[]'); }catch(e){ return []; } }
13191: function saveMbdLocal(list){ localStorage.setItem(LS_MBD_KEY, JSON.stringify(list)); MACHINE_BREAKDOWN = list; }
13192: 
13193: async function loadMachineBreakdownList(){
13194:   MACHINE_BREAKDOWN = loadMbdLocal();
13195:   if(!WEB_APP_URL) return MACHINE_BREAKDOWN;
13196:   try{
13197:     const remote = await apiGet('machineBreakdownList');
13198:     if(Array.isArray(remote)){ saveMbdLocal(remote); } else if(remote && Array.isArray(remote.data)){ saveMbdLocal(remote.data); }
13199:   }catch(e){ /* pakai cache lokal kalau offline */ }
13200:   return MACHINE_BREAKDOWN;
13201: }
13202: 
13203: function mbdResetForm(){
13204:   MBD_EDIT_ID = null;
13205:   ['tahun','bulan','periode','lini','mesin','elbd','mechbd','totallost','runhrs','mtbfel','mttrel','mtbfmech','mttrmech','bdeventsel','bdeventmech','catatan'].forEach(function(k){
13206:     const el = $('#mbd-f-'+k); if(el) el.value = '';
13207:   });
13208:   const title = $('#mbd-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Input Breakdown Mesin';
13209: }
13210: 
13211: function mbdShowForm(row){
13212:   const card = $('#mbd-form-card'); if(card) card.style.display = 'block';
13213:   if(row){
13214:     MBD_EDIT_ID = row['ID'];
13215:     $('#mbd-f-tahun').value = row['Tahun']||'';
13216:     $('#mbd-f-bulan').value = row['Bulan']||'';
13217:     $('#mbd-f-periode').value = row['Periode']||'';
13218:     $('#mbd-f-lini').value = row['Lini']||'';
13219:     $('#mbd-f-mesin').value = row['Mesin']||'';
13220:     $('#mbd-f-elbd').value = row['El BD']||'';
13221:     $('#mbd-f-mechbd').value = row['Mech BD']||'';
13222:     $('#mbd-f-totallost').value = row['Total Lost']||'';
13223:     $('#mbd-f-runhrs').value = row['Run Hrs']||'';
13224:     $('#mbd-f-mtbfel').value = row['MTBF EL']||'';
13225:     $('#mbd-f-mttrel').value = row['MTTR EL']||'';
13226:     $('#mbd-f-mtbfmech').value = row['MTBF Mech']||'';
13227:     $('#mbd-f-mttrmech').value = row['MTTR Mech']||'';
13228:     $('#mbd-f-bdeventsel').value = row['BD Events EL']||'';
~~~

### Around line 13642
~~~text
13626: const btnImportKpiKerja = $('#btn-import-kpiKerja');
13627: if(btnImportKpiKerja) btnImportKpiKerja.addEventListener('click', ()=> openImportModal('kpiKerja'));
13628: 
13629: /* ===================== RECORD YTD MESIN (rekap tahunan per mesin, 2019-2024) =====================
13630:    Sumber: sheet 'Record YTD' di Excel Offset_Technical_2026_Terintegrasi.xlsx. Key unik Tahun+Mesin:
13631:    input ulang kombinasi yang sama akan meng-update baris lama, bukan menambah baru. */
13632: const LS_RYT_KEY = 'omodos_record_ytd';
13633: let RECORD_YTD = [];
13634: let RYT_EDIT_ID = null;
13635: let RYT_CHART = null;
13636: 
13637: function loadRytLocal(){ try{ return JSON.parse(localStorage.getItem(LS_RYT_KEY)||'[]'); }catch(e){ return []; } }
13638: function saveRytLocal(list){ localStorage.setItem(LS_RYT_KEY, JSON.stringify(list)); RECORD_YTD = list; }
13639: 
13640: async function loadRecordYtdList(){
13641:   RECORD_YTD = loadRytLocal();
13642:   if(!WEB_APP_URL) return RECORD_YTD;
13643:   try{
13644:     const remote = await apiGet('recordYtdList');
13645:     if(Array.isArray(remote)){ saveRytLocal(remote); } else if(remote && Array.isArray(remote.data)){ saveRytLocal(remote.data); }
13646:   }catch(e){ /* pakai cache lokal kalau offline */ }
13647:   return RECORD_YTD;
13648: }
13649: 
13650: function rytResetForm(){
13651:   RYT_EDIT_ID = null;
13652:   ['tahun','divisi','mesin','runhours','mtbf','targetmtbf','mttr','targetmttr','losttime','maxlosttime','bdevent','catatan'].forEach(function(k){
13653:     const el = $('#ryt-f-'+k); if(el) el.value = '';
13654:   });
13655:   const title = $('#ryt-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Input Record YTD Mesin';
13656: }
13657: 
13658: function rytShowForm(row){
13659:   const card = $('#ryt-form-card'); if(card) card.style.display = 'block';
13660:   if(row){
13661:     RYT_EDIT_ID = row['ID'];
13662:     $('#ryt-f-tahun').value = row['Tahun']||'';
13663:     $('#ryt-f-divisi').value = row['Divisi']||'';
13664:     $('#ryt-f-mesin').value = row['Mesin']||'';
13665:     $('#ryt-f-runhours').value = row['Run Hours']||'';
13666:     $('#ryt-f-mtbf').value = row['MTBF']||'';
13667:     $('#ryt-f-targetmtbf').value = row['Target MTBF']||'';
13668:     $('#ryt-f-mttr').value = row['MTTR']||'';
13669:     $('#ryt-f-targetmttr').value = row['Target MTTR']||'';
13670:     $('#ryt-f-losttime').value = row['Lost Time (%)']||'';
13671:     $('#ryt-f-maxlosttime').value = row['Max Lost Time (%)']||'';
13672:     $('#ryt-f-bdevent').value = row['Breakdown Event']||'';
13673:     $('#ryt-f-catatan').value = row['Catatan']||'';
13674:     const title = $('#ryt-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Edit Record YTD Mesin';
13675:   } else {
~~~

### Around line 13847
~~~text
13831:   btnRytSave.disabled = false;
13832: });
13833: 
13834: /* ===================== RUN HOUR COMPARISON (jam operasi bulanan per lini) =====================
13835:    Sumber: sheet 'Run Hour Comparison' di Excel. Key unik Tahun+Lini. */
13836: const LS_RHC_KEY = 'omodos_run_hour_comparison';
13837: let RUN_HOUR_COMPARISON = [];
13838: let RHC_EDIT_ID = null;
13839: let RHC_CHART = null;
13840: const RHC_BULAN_KEYS = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agust','Sep','Okt','Nop','Des'];
13841: 
13842: function loadRhcLocal(){ try{ return JSON.parse(localStorage.getItem(LS_RHC_KEY)||'[]'); }catch(e){ return []; } }
13843: function saveRhcLocal(list){ localStorage.setItem(LS_RHC_KEY, JSON.stringify(list)); RUN_HOUR_COMPARISON = list; }
13844: 
13845: async function loadRunHourComparisonList(){
13846:   RUN_HOUR_COMPARISON = loadRhcLocal();
13847:   if(!WEB_APP_URL) return RUN_HOUR_COMPARISON;
13848:   try{
13849:     const remote = await apiGet('runHourComparisonList');
13850:     if(Array.isArray(remote)){ saveRhcLocal(remote); } else if(remote && Array.isArray(remote.data)){ saveRhcLocal(remote.data); }
13851:   }catch(e){ /* pakai cache lokal kalau offline */ }
13852:   return RUN_HOUR_COMPARISON;
13853: }
13854: 
13855: function rhcRowSum(r){
13856:   return RHC_BULAN_KEYS.reduce(function(s,b){ return s + (Number(r[b])||0); }, 0);
13857: }
13858: 
13859: function rhcResetForm(){
13860:   RHC_EDIT_ID = null;
13861:   ['tahun','lini','jan','feb','mar','apr','mei','jun','jul','agust','sep','okt','nop','des','catatan'].forEach(function(k){
13862:     const el = $('#rhc-f-'+k); if(el) el.value = '';
13863:   });
13864:   const title = $('#rhc-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Input Run Hour per Lini';
13865: }
13866: 
13867: function rhcShowForm(row){
13868:   const card = $('#rhc-form-card'); if(card) card.style.display = 'block';
13869:   if(row){
13870:     RHC_EDIT_ID = row['ID'];
13871:     $('#rhc-f-tahun').value = row['Tahun']||'';
13872:     $('#rhc-f-lini').value = row['Lini']||'';
13873:     RHC_BULAN_KEYS.forEach(function(b){
13874:       const el = $('#rhc-f-'+b.toLowerCase()); if(el) el.value = row[b]||'';
13875:     });
13876:     $('#rhc-f-catatan').value = row['Catatan']||'';
13877:     const title = $('#rhc-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Edit Run Hour per Lini';
13878:   } else {
13879:     rhcResetForm();
13880:   }
~~~

### Around line 14025
~~~text
14009: 
14010: /* ===================== ENERGY COST & TOE (biaya energi & EnPI granular) =====================
14011:    Sumber: sheet '2025'/'2026' (Kwh Offset) di Excel. Key unik Tahun+Bulan. Energy Use (kWh),
14012:    Energy Cost, Cost/Sheet, dan EnPI DIHITUNG di sini secara real-time dari data mentah
14013:    (Energy Use GWh x Tariff, dst) -- bukan hardcode -- supaya selalu sinkron kalau data diedit.
14014:    TOE tetap manual karena faktor konversinya tidak ada di file Excel sumber. */
14015: const LS_ECT_KEY = 'omodos_energy_cost_toe';
14016: let ENERGY_COST_TOE = [];
14017: let ECT_EDIT_ID = null;
14018: let ECT_CHART = null;
14019: 
14020: function loadEctLocal(){ try{ return JSON.parse(localStorage.getItem(LS_ECT_KEY)||'[]'); }catch(e){ return []; } }
14021: function saveEctLocal(list){ localStorage.setItem(LS_ECT_KEY, JSON.stringify(list)); ENERGY_COST_TOE = list; }
14022: 
14023: async function loadEnergyCostToeList(){
14024:   ENERGY_COST_TOE = loadEctLocal();
14025:   if(!WEB_APP_URL) return ENERGY_COST_TOE;
14026:   try{
14027:     const remote = await apiGet('energyCostToeList');
14028:     if(Array.isArray(remote)){ saveEctLocal(remote); } else if(remote && Array.isArray(remote.data)){ saveEctLocal(remote.data); }
14029:   }catch(e){ /* pakai cache lokal kalau offline */ }
14030:   return ENERGY_COST_TOE;
14031: }
14032: 
14033: // Formula persis mengikuti header kolom di Excel sheet '2025'/'2026':
14034: // Energy Use(kWh) = Energy Use(GWh) x 1.000.000
14035: // Energy cost (IDR) = Energy Use(kWh) x Tariff (IDR/kWh)
14036: // Energy cost/sheet (IDR) = Energy cost / Good Sheet Produced
14037: // EnPI (kWh/Sheet) = Energy Use(kWh) / Good Sheet Produced
14038: function ectCompute(r){
14039:   const gwh = Number(r['Energy Use (GWh)']);
14040:   const goodSheet = Number(r['Good Sheet Produced']);
14041:   const tariff = Number(r['Tariff (IDR/kWh)']);
14042:   const kwh = (gwh || gwh === 0) && !isNaN(gwh) ? gwh * 1000000 : null;
14043:   const cost = (kwh !== null && !isNaN(tariff)) ? kwh * tariff : null;
14044:   const costPerSheet = (cost !== null && goodSheet) ? cost / goodSheet : null;
14045:   const enpi = (kwh !== null && goodSheet) ? kwh / goodSheet : null;
14046:   return { kwh: kwh, cost: cost, costPerSheet: costPerSheet, enpi: enpi };
14047: }
14048: 
14049: function ectResetForm(){
14050:   ECT_EDIT_ID = null;
14051:   ['tahun','bulan','goodsheet','standmeter','energygwh','toe','catatan'].forEach(function(k){
14052:     const el = $('#ect-f-'+k); if(el) el.value = '';
14053:   });
14054:   $('#ect-f-tariff').value = '1154.46';
14055:   const title = $('#ect-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Input Energy Cost & TOE';
14056: }
14057: 
14058: function ectShowForm(row){
~~~

### Around line 14233
~~~text
14217:   }catch(e){ toast('Gagal menyimpan: '+e.message, true); }
14218:   btnEctSave.disabled = false;
14219: });
14220: 
14221: /* ===================== CORRECTIVE REPORT =====================
14222:    Log per-event breakdown dari sheet Ori.../Verifikasi... di Excel. Key unik utama:
14223:    No. Notifikasi SAP -- lihat correctiveReportKey_ di backend. */
14224: const LS_CR_KEY = 'omodos_corrective_report';
14225: let CORRECTIVE_REPORT = [];
14226: let CR_EDIT_ID = null;
14227: 
14228: function loadCrLocal(){ try{ return JSON.parse(localStorage.getItem(LS_CR_KEY)||'[]'); }catch(e){ return []; } }
14229: function saveCrLocal(list){ localStorage.setItem(LS_CR_KEY, JSON.stringify(list)); CORRECTIVE_REPORT = list; }
14230: 
14231: async function loadCorrectiveReportList(){
14232:   CORRECTIVE_REPORT = loadCrLocal();
14233:   if(!WEB_APP_URL) return CORRECTIVE_REPORT;
14234:   try{
14235:     const remote = await apiGet('correctiveReportList');
14236:     if(Array.isArray(remote)){ saveCrLocal(remote); } else if(remote && Array.isArray(remote.data)){ saveCrLocal(remote.data); }
14237:   }catch(e){ /* pakai cache lokal kalau offline */ }
14238:   return CORRECTIVE_REPORT;
14239: }
14240: 
14241: function crResetForm(){
14242:   CR_EDIT_ID = null;
14243:   ['tahun','bulan','mesin','start','finish','group','section','elec','mech','comp','notif','status','problem'].forEach(function(k){
14244:     const el = $('#cr-f-'+k); if(el) el.value = '';
14245:   });
14246:   const title = $('#cr-form-title'); if(title) title.innerHTML = '<i class="ph-bold ph-pencil-simple"></i> Input Corrective Report';
14247: }
14248: 
14249: function crToDatetimeLocal(v){
14250:   if(!v) return '';
14251:   const d = new Date(v);
14252:   if(isNaN(d.getTime())) return '';
14253:   const pad = n=> String(n).padStart(2,'0');
14254:   return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
14255: }
14256: 
14257: function crShowForm(row){
14258:   const card = $('#cr-form-card'); if(card) card.style.display = 'block';
14259:   if(row){
14260:     CR_EDIT_ID = row['ID'];
14261:     $('#cr-f-tahun').value = row['Tahun']||'';
14262:     $('#cr-f-bulan').value = row['Bulan']||'';
14263:     $('#cr-f-mesin').value = row['Mesin']||'';
14264:     $('#cr-f-start').value = crToDatetimeLocal(row['Start']);
14265:     $('#cr-f-finish').value = crToDatetimeLocal(row['Finish']);
14266:     $('#cr-f-group').value = row['Group']||'';
~~~

### Around line 14410
~~~text
14394: });
14395: const crSearchInput = $('#cr-search');
14396: if(crSearchInput) crSearchInput.addEventListener('input', renderCorrectiveReportView);
14397: 
14398: /* ===================== ENERGY & UTILITY (ENPI) =====================
14399:    Konsumsi listrik/air per Area+Bulan+Tahun+Jenis. Key unik gabungan -- lihat
14400:    energyUtilityKey_ di backend. Sumber: WTP, COMPRESSOR, Kwh Offset, SEUs & Energy Mapping. */
14401: const LS_ENG_KEY = 'omodos_energy_utility';
14402: let ENERGY_UTILITY = [];
14403: let ENG_EDIT_ID = null;
14404: 
14405: function loadEngLocal(){ try{ return JSON.parse(localStorage.getItem(LS_ENG_KEY)||'[]'); }catch(e){ return []; } }
14406: function saveEngLocal(list){ localStorage.setItem(LS_ENG_KEY, JSON.stringify(list)); ENERGY_UTILITY = list; }
14407: 
14408: async function loadEnergyUtilityList(){
14409:   ENERGY_UTILITY = loadEngLocal();
14410:   if(!WEB_APP_URL) return ENERGY_UTILITY;
14411:   try{
14412:     const remote = await apiGet('energyUtilityList');
14413:     if(Array.isArray(remote)){ saveEngLocal(remote); } else if(remote && Array.isArray(remote.data)){ saveEngLocal(remote.data); }
14414:   }catch(e){ /* pakai cache lokal kalau offline */ }
14415:   return ENERGY_UTILITY;
14416: }
14417: 
14418: // Area non-mesin yang tetap relevan untuk ENPI walau bukan mesin produksi individual
14419: // (WTP dan Compressor adalah UTILITY, bukan mesin produksi -- makanya tidak ada di Database Mesin).
14420: const ENG_NON_MACHINE_AREAS = ['WTP', 'Compressor', 'Offset Plant (Keseluruhan)', 'Converting Plant (Keseluruhan)'];
14421: 
14422: // Satuan konsumsi & output otomatis berdasarkan Jenis dipilih.
14423: const ENG_JENIS_UNIT_MAP = {
14424:   'Listrik':            { satuan: 'kWh', satuanOutput: 'Sheet', rasioLabel: 'kWh/Sheet' },
14425:   'Water Consumption':  { satuan: 'm3',  satuanOutput: 'M3 Output', rasioLabel: 'm3/M3' },
14426:   'Compressed Air':     { satuan: 'kWh', satuanOutput: 'M3 Udara', rasioLabel: 'kWh/M3' }
14427: };
14428: 
14429: function engPopulateAreaSelect(){
14430:   const sel = $('#eng-f-area'); if(!sel) return;
14431:   const cur = sel.value;
14432:   const machineOptions = MACHINES.map(m=>
14433:     `<option value="${escapeHtml(m['Nama Mesin']||'')}">${escapeHtml(m['Nama Mesin']||'')}${m['Kode Mesin'] ? ' ('+escapeHtml(m['Kode Mesin'])+')' : ''}</option>`
14434:   ).join('');
14435:   const nonMachineOptions = ENG_NON_MACHINE_AREAS.map(a=> `<option value="${escapeHtml(a)}">${escapeHtml(a)} (Utility)</option>`).join('');
14436:   sel.innerHTML = `<option value="">Pilih area/mesin...</option>
14437:     <optgroup label="Mesin (dari Database Mesin)">${machineOptions || '<option disabled>Belum ada mesin di Database Mesin</option>'}</optgroup>
14438:     <optgroup label="Area Utility">${nonMachineOptions}</optgroup>
14439:     <option value="${MACHINE_LAINNYA_VALUE}">Lainnya (tidak ada di daftar)</option>`;
14440:   if(cur && [...sel.options].some(o=> o.value===cur)) sel.value = cur;
14441:   engToggleAreaLainnya();
14442: }
14443: 
~~~

### Around line 14652
~~~text
14636: /* ---------------- FORMULA MTBF/MTTR: JAM OPERASI, JUMLAH MESIN & KONSTANTA KERUGIAN ---------------- */
14637: // [EDIT] kerugianPerJam ditambahkan supaya nilai "Rp kerugian per jam downtime"
14638: // yang dipakai di Smart Resume Home tidak lagi hardcode di kode, melainkan
14639: // input dari menu Master Koneksi (form ini) dan disimpan sepaket dengan
14640: // konfigurasi Formula MTBF/MTTR lainnya (localStorage + sinkron ke backend).
14641: const ANALITIK_CONFIG_DEFAULT = { jamOperasiPerHari: 24, jumlahMesinManual: '', kerugianPerJam: HOME_KERUGIAN_PER_JAM_RP_DEFAULT };
14642: let ANALITIK_CONFIG = Object.assign({}, ANALITIK_CONFIG_DEFAULT);
14643: function loadAnalitikConfigLocal(){
14644:   try{
14645:     const saved = JSON.parse(localStorage.getItem(LS_ANALITIK_CONFIG_KEY)||'null');
14646:     return Object.assign({}, ANALITIK_CONFIG_DEFAULT, saved || {});
14647:   }catch(e){ return Object.assign({}, ANALITIK_CONFIG_DEFAULT); }
14648: }
14649: function saveAnalitikConfigLocal(cfg){ localStorage.setItem(LS_ANALITIK_CONFIG_KEY, JSON.stringify(cfg)); ANALITIK_CONFIG = cfg; }
14650: async function syncAnalitikConfigFromBackend(){
14651:   ANALITIK_CONFIG = loadAnalitikConfigLocal();
14652:   if(!WEB_APP_URL) return ANALITIK_CONFIG;
14653:   try{
14654:     const remote = await apiGet('analitikConfig');
14655:     if(remote && typeof remote === 'object'){
14656:       const cfg = {
14657:         jamOperasiPerHari: Number(remote.jamOperasiPerHari)||24,
14658:         jumlahMesinManual: remote.jumlahMesinManual || '',
14659:         kerugianPerJam: Number(remote.kerugianPerJam) > 0 ? Number(remote.kerugianPerJam) : HOME_KERUGIAN_PER_JAM_RP_DEFAULT
14660:       };
14661:       saveAnalitikConfigLocal(cfg);
14662:     }
14663:   }catch(e){ /* action belum tersedia; pakai cache lokal */ }
14664:   return ANALITIK_CONFIG;
14665: }
14666: function renderAnalitikConfigForm(){
14667:   if($('#cfg-jam-operasi')) $('#cfg-jam-operasi').value = ANALITIK_CONFIG.jamOperasiPerHari || 24;
14668:   if($('#cfg-jumlah-mesin')) $('#cfg-jumlah-mesin').value = ANALITIK_CONFIG.jumlahMesinManual || '';
14669:   if($('#cfg-kerugian-per-jam')) $('#cfg-kerugian-per-jam').value = ANALITIK_CONFIG.kerugianPerJam || HOME_KERUGIAN_PER_JAM_RP_DEFAULT;
14670: }
14671: const btnSaveAnalitikConfig = $('#btn-save-analitik-config');
14672: if(btnSaveAnalitikConfig) btnSaveAnalitikConfig.addEventListener('click', async ()=>{
14673:   const cfg = {
14674:     jamOperasiPerHari: Number($('#cfg-jam-operasi').value)||24,
14675:     jumlahMesinManual: $('#cfg-jumlah-mesin').value.trim(),
14676:     kerugianPerJam: Number($('#cfg-kerugian-per-jam').value) > 0 ? Number($('#cfg-kerugian-per-jam').value) : HOME_KERUGIAN_PER_JAM_RP_DEFAULT
14677:   };
14678:   saveAnalitikConfigLocal(cfg);
14679:   $('#analitik-config-status').textContent = 'Menyimpan ke database SQLite...';
14680:   try{
14681:     const res = await apiPost({ action:'saveAnalitikConfig', ...cfg });
14682:     $('#analitik-config-status').textContent = '✓ Tersimpan di database SQLite (sheet Analitik_Config)';
14683:     toast('Formula tersimpan di database SQLite ✓');
14684:   }catch(e){
14685:     $('#analitik-config-status').textContent = '✗ Gagal sinkron ke database SQLite: '+e.message+' (tersimpan lokal saja)';
~~~

### Around line 15009
~~~text
14993:     if(action==='prev')SP_COLLECT_PAGE=Math.max(1,SP_COLLECT_PAGE-1);
14994:     if(action==='next')SP_COLLECT_PAGE=Math.min(pages,SP_COLLECT_PAGE+1);
14995:     if(action==='last')SP_COLLECT_PAGE=pages;
14996:     renderSparepartCollectTable();
14997:   }));
14998:   const sizeSel=$('select[data-sp-page-size]',pager);
14999:   if(sizeSel) sizeSel.addEventListener('change',()=>{
15000:     SP_COLLECT_PAGE_SIZE=Number(sizeSel.value);
15001:     SP_COLLECT_PAGE=1;
15002:     renderSparepartCollectTable();
15003:   });
15004: }
15005: 
15006: async function setDailyCollectionStatus(id, collected){
15007:   const nextStatus = collected ? 'COMPLETED' : 'PENDING';
15008:   const actor = (CURRENT_USER && (CURRENT_USER.displayName || CURRENT_USER.username)) || '';
15009:   if(!WEB_APP_URL) throw new Error('Backend Cloudflare belum terhubung. Status collection tidak diubah agar data lintas perangkat tetap konsisten.');
15010:   await apiPost({ action:'updateSparepartSap', id, status:nextStatus, sapDoc:'', pic:actor });
15011:   setSparepartSapEntry(id, { status:nextStatus, sapDoc:'', pic:actor, updatedAt:new Date().toISOString() });
15012: }
15013: 
15014: function attachSparepartHandlers(root){
15015:   $$('.sp-detail', root).forEach(btn=>{
15016:     btn.addEventListener('click', (ev)=>{ ev.stopPropagation(); openDetail(btn.dataset.id); });
15017:   });
15018:   $$('.sp-collect-toggle', root).forEach(cb=>{
15019:     cb.addEventListener('change', async ()=>{
15020:       const id = cb.dataset.id;
15021:       const wanted = cb.checked;
15022:       cb.disabled = true;
15023:       const row = cb.closest('tr');
15024:       try{
15025:         await setDailyCollectionStatus(id, wanted);
15026:         if(row) row.classList.toggle('is-collected', wanted);
15027:         const label = cb.closest('.sp-collect-check')?.querySelector('.sp-collect-check-label');
15028:         const ico = cb.closest('.sp-collect-check')?.querySelector('i');
15029:         if(label) label.textContent = wanted ? 'Sudah' : 'Belum';
15030:         if(ico) ico.className = `ph-bold ${wanted?'ph-check':'ph-package'}`;
15031:         renderSparepartCollectDash();
15032:         toast(wanted ? 'Ditandai: sudah dicollect Warehouse dan diinput ke SAP.' : 'Status dikembalikan menjadi belum dicollect.');
15033:         // Jika filter hanya menampilkan salah satu status, refresh list agar record
15034:         // langsung pindah dari antrian pending ke hasil completed (atau sebaliknya).
15035:         if($('#filter-sparepart-collection')?.value) renderSparepartCollectTable();
15036:       }catch(e){
15037:         cb.checked = !wanted;
15038:         toast(e.message || 'Gagal menyimpan status Daily Collection.', true);
15039:       }finally{
15040:         cb.disabled = false;
15041:       }
15042:     });
~~~

## parseApiResponse_ — 6
### Around line 6661
~~~text
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
06678:       if(onSuccess) onSuccess();
06679:     }catch(err){
06680:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06681:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06682:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06683:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06684:       errEl.style.display = 'block';
06685:     }finally{
06686:       submitBtn.disabled = false;
06687:       submitBtn.innerHTML = originalLabel;
06688:     }
06689:   };
06690:   $('#btn-setting-login-submit').addEventListener('click', submit);
06691:   $('#setting-login-password').addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ ev.preventDefault(); submit(); } });
06692:   setTimeout(()=> $('#setting-login-username') && $('#setting-login-username').focus(), 50);
06693: }
06694: 
~~~

### Around line 7774
~~~text
07758: if(lcModeToggle) lcModeToggle.addEventListener('change', ()=> setLowCognitiveMode(lcModeToggle.checked));
07759: 
07760: const lcQuickBtn = $('#btn-lc-quick-toggle');
07761: if(lcQuickBtn) lcQuickBtn.addEventListener('click', ()=> setLowCognitiveMode(!isLowCognitiveActive()));
07762: 
07763: 
07764: /* ---------------- TOAST ---------------- */
07765: function toast(msg, isError=false){
07766:   const t = $('#toast');
07767:   t.textContent = msg;
07768:   t.className = 'toast active' + (isError ? ' error' : '');
07769:   clearTimeout(t._timer);
07770:   t._timer = setTimeout(()=> t.classList.remove('active'), 3800);
07771: }
07772: 
07773: /* ---------------- API ---------------- */
07774: async function parseApiResponse_(res){
07775:   const raw = await res.text();
07776:   try{
07777:     return JSON.parse(raw);
07778:   }catch(err){
07779:     const looksHtml = /^\s*</.test(raw) || /<!doctype|<html/i.test(raw);
07780:     if(looksHtml){
07781:       throw new Error('Backend mengirim halaman HTML, bukan JSON. Pastikan Cloudflare sudah di-deploy sebagai Web App versi terbaru, akses deployment diizinkan, dan endpoint /api tersedia.');
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
07799:   if(SETTING_AUTH_OK && SETTING_SESSION_TOKEN && requestToken === SETTING_SESSION_TOKEN){
07800:     resetSettingAuth();
07801:     return;
07802:   }
07803:   logoutUser();
07804: }
07805: // Session-only read cache; isolated by backend, token and parameters.
07806: const READY_READS = new Map();
07807: const ACTIVE_READS = new Map();
~~~

### Around line 7842
~~~text
07826:   });
07827:   ACTIVE_READS.set(activeKey,promise);
07828:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07829: }
07830: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07831: 
07832: async function apiGetNetwork_(action, params={}, retries=2){
07833:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07834:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07835:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07836:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07837:   const qs = new URLSearchParams({action, ...params}).toString();
07838:   let lastErr=null;
07839:   for(let attempt=0; attempt<=retries; attempt++){
07840:     try{
07841:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07842:       const json = await parseApiResponse_(res);
07843:       if(!json.ok){
07844:         handleApiAuthFailure_(json.error || '', requestToken);
07845:         throw new Error(json.error || 'Gagal mengambil data');
07846:       }
07847:       return json.data;
07848:     }catch(e){
07849:       lastErr=e;
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
07867:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07868:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07869:   try{
07870:     // text/plain menghindari CORS preflight ke Cloudflare
07871:     const requestBodyText = JSON.stringify(securedPayload);
07872:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07873:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07874:     // membiarkan upload putus dan record tersisa hanya filename.
07875:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
~~~

### Around line 7887
~~~text
07871:     const requestBodyText = JSON.stringify(securedPayload);
07872:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07873:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07874:     // membiarkan upload putus dan record tersisa hanya filename.
07875:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07876:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07877:     }
07878:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07879:       method: 'POST',
07880:       mode: 'cors',
07881:       credentials: 'omit',
07882:       redirect: 'follow',
07883:       cache: 'no-store',
07884:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07885:       body: requestBodyText
07886:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07887:     const json = await parseApiResponse_(res);
07888:     if(!json.ok){
07889:       handleApiAuthFailure_(json.error || '', requestToken);
07890:       throw new Error(json.error || 'Gagal menyimpan data');
07891:     }
07892:     invalidatePreparedReads_();
07893:     setAppOnlineStatus(true);
07894:     return json;
07895:   }catch(err){
07896:     // Kegagalan level jaringan (offline/tidak terjangkau) -> antre untuk
07897:     // disinkron otomatis nanti begitu internet kembali. Kegagalan dari
07898:     // server (json.ok === false, misal validasi) TIDAK diantre karena
07899:     // request sudah benar-benar sampai & ditolak, bukan soal koneksi.
07900:     const isNetworkErr = err instanceof TypeError ||
07901:       /Failed to fetch|NetworkError|Load failed|Backend timeout|AbortError|aborted/i.test(err.message || '');
07902:     if(isNetworkErr){
07903:       queueForSync_(securedPayload);
07904:       setAppOnlineStatus(false);
07905:     }
07906:     throw err;
07907:   }
07908: }
07909: 
07910: /* ---------------- RBAC: PULIHKAN SESI SAAT REFRESH HALAMAN ----------------
07911:    CURRENT_USER (username/role) di-cache di localStorage supaya refresh
07912:    halaman ATAU membuka lagi file/tab-nya di browser yang sama tidak
07913:    memaksa login ulang. Permission & feature registry TETAP diambil ulang
07914:    dari code.gs (single source of truth) tiap kali, bukan dari cache,
07915:    supaya perubahan Role Access Management langsung berlaku begitu halaman
07916:    dibuka lagi. */
07917: (async function restoreRbacSession_(){
07918:   if(!CURRENT_USER) return;
07919:   const gate = document.getElementById('login-gate');
07920:   const appRoot = document.getElementById('app-root');
~~~

### Around line 8105
~~~text
08089:   q.push({ id: 'sync_'+Date.now()+'_'+Math.random().toString(36).slice(2), payload:queuedPayload, ts: Date.now() });
08090:   saveSyncQueue_(q);
08091: }
08092: 
08093: async function flushSyncQueue_(){
08094:   if(!WEB_APP_URL) return;
08095:   const q = loadSyncQueue_();
08096:   if(!q.length) return;
08097:   const remaining = [];
08098:   let discardedSecurityConfig = 0;
08099:   for(const item of q){
08100:     if(isSecurityConfigAction_(item && item.payload && item.payload.action)){ discardedSecurityConfig++; continue; }
08101:     try{
08102:       if(!SESSION_TOKEN) throw new Error('AUTH_REQUIRED');
08103:       const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
08104:       const res = await fetchWithTimeout_(WEB_APP_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify({...item.payload, sessionToken:requestToken}) }, 60000); // PATCHED 60s
08105:       const json = await parseApiResponse_(res);
08106:       if(!json.ok) throw new Error(json.error || 'gagal');
08107:     }catch(e){
08108:       remaining.push(item); // masih gagal, coba lagi di kesempatan berikutnya
08109:     }
08110:   }
08111:   const successCount = q.length - remaining.length - discardedSecurityConfig;
08112:   saveSyncQueue_(remaining);
08113:   if(successCount > 0){
08114:     setAppOnlineStatus(true);
08115:     toast(`${successCount} data berhasil disinkron otomatis ke server.`);
08116:     try{ await loadAll(); }catch(e){}
08117:   }
08118: }
08119: 
08120: function setAppOnlineStatus(isOnline){
08121:   const changed = APP_ONLINE_STATUS !== isOnline;
08122:   APP_ONLINE_STATUS = isOnline;
08123:   renderOfflineBanner();
08124:   if(isOnline && changed) flushSyncQueue_();
08125: }
08126: 
08127: function renderOfflineBanner(){
08128:   const holder = $('#offline-banner-holder');
08129:   if(!holder) return;
08130:   if(!WEB_APP_URL){ holder.innerHTML=''; return; } // sudah ditangani config-banner terpisah
08131:   const q = loadSyncQueue_();
08132:   if(!navigator.onLine || !APP_ONLINE_STATUS){
08133:     holder.innerHTML = `<div class="offline-banner">📴 <b>Mode Offline</b> — aplikasi tetap bisa dipakai seperti biasa, data disimpan lokal di perangkat ini${q.length?` (<b>${q.length} data</b> menunggu sinkron)`:''}. Begitu internet kembali, data akan otomatis tersinkron ke server.</div>`;
08134:   } else if(q.length){
08135:     holder.innerHTML = `<div class="offline-banner syncing">🔄 Menyinkronkan <b>${q.length} data</b> yang tertunda ke server...</div>`;
08136:   } else {
08137:     holder.innerHTML = '';
08138:   }
~~~

### Around line 20977
~~~text
20961:     errEl.textContent = '';
20962: 
20963:     if(!WEB_APP_URL){
20964:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App). Hubungi Superadmin untuk konfigurasi awal.';
20965:       return;
20966:     }
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
20984:         return;
20985:       }
20986:       if(!json.sessionToken){
20987:         throw new Error('Backend Cloudflare masih versi lama. Deploy ulang FinalOMODOSRilis.gs terbaru, lalu gunakan URL /exec deployment tersebut.');
20988:       }
20989:       invalidatePreparedReads_();
20990:       activateAccountDataCaches_(json.user&&json.user.username,{claimExisting:false});
20991:       CURRENT_USER = json.user;
20992:       SESSION_TOKEN = json.sessionToken || '';
20993:       SESSION_EXPIRES_AT = json.expiresAt || '';
20994:       PERMISSIONS = json.permissions || {};
20995:       // Gabungkan daftar dari backend dengan hasil scan DOM sidebar saat ini,
20996:       // supaya menu apa pun (baru/lama, terdaftar di code.gs atau tidak)
20997:       // SELALU tergate oleh Role Access Management — tidak ada yang lolos
20998:       // tampil begitu saja hanya karena belum sempat didaftarkan manual.
20999:       FEATURE_REGISTRY = (typeof window.mergeFeatureRegistry === 'function')
21000:         ? window.mergeFeatureRegistry(json.features || [])
21001:         : (json.features || []);
21002:       try{ cacheRbacSession_(); }catch(e){}
21003:       applyRbacToUi();
21004:       // [FIX] Sinkronkan matrix Tampilan Sederhana dari backend (kalau sudah
21005:       // tersedia -- lihat handleSaveLcPermissions_/getLcPermissionMatrix_ di
21006:       // code.gs) supaya perubahan yang diatur Superadmin di satu device ikut
21007:       // berlaku untuk user lain, bukan cuma tersimpan lokal di browser yang
21008:       // dipakai mengatur. Backend lama yang belum di-deploy ulang cukup tidak
21009:       // mengirim field ini (undefined) -- fallback ke localStorage yang sudah
21010:       // dimuat lebih awal, tidak menimbulkan error.
~~~

## fetchWithTimeout_ — 6
### Around line 7786
~~~text
07770:   t._timer = setTimeout(()=> t.classList.remove('active'), 3800);
07771: }
07772: 
07773: /* ---------------- API ---------------- */
07774: async function parseApiResponse_(res){
07775:   const raw = await res.text();
07776:   try{
07777:     return JSON.parse(raw);
07778:   }catch(err){
07779:     const looksHtml = /^\s*</.test(raw) || /<!doctype|<html/i.test(raw);
07780:     if(looksHtml){
07781:       throw new Error('Backend mengirim halaman HTML, bukan JSON. Pastikan Cloudflare sudah di-deploy sebagai Web App versi terbaru, akses deployment diizinkan, dan endpoint /api tersedia.');
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
07799:   if(SETTING_AUTH_OK && SETTING_SESSION_TOKEN && requestToken === SETTING_SESSION_TOKEN){
07800:     resetSettingAuth();
07801:     return;
07802:   }
07803:   logoutUser();
07804: }
07805: // Session-only read cache; isolated by backend, token and parameters.
07806: const READY_READS = new Map();
07807: const ACTIVE_READS = new Map();
07808: let READ_GENERATION = 0;
07809: function invalidatePreparedReads_(){
07810:   READY_READS.clear(); READ_GENERATION++;
07811:   if(typeof PMC_STATE !== 'undefined') PMC_STATE.loaded = false;
07812:   if(typeof MTG_STATE !== 'undefined') MTG_STATE.loaded = false;
07813: }
07814: async function apiGet(action, params={}, retries=2){
07815:   const token = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07816:   const key = JSON.stringify([WEB_APP_URL, token, action, Object.keys(params).sort().map(k=>[k,params[k]])]);
07817:   const fresh = params.fresh || params._ts;
07818:   const cached = READY_READS.get(key);
07819:   if(!fresh && cached && Date.now()-cached.time < 60000) return structuredReadCopy_(cached.data);
~~~

### Around line 20972
~~~text
20956: 
20957:   form.addEventListener('submit', async function(e){
20958:     e.preventDefault();
20959:     const u = document.getElementById('login-username').value.trim();
20960:     const p = document.getElementById('login-password').value;
20961:     errEl.textContent = '';
20962: 
20963:     if(!WEB_APP_URL){
20964:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App). Hubungi Superadmin untuk konfigurasi awal.';
20965:       return;
20966:     }
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
20984:         return;
20985:       }
20986:       if(!json.sessionToken){
20987:         throw new Error('Backend Cloudflare masih versi lama. Deploy ulang FinalOMODOSRilis.gs terbaru, lalu gunakan URL /exec deployment tersebut.');
20988:       }
20989:       invalidatePreparedReads_();
20990:       activateAccountDataCaches_(json.user&&json.user.username,{claimExisting:false});
20991:       CURRENT_USER = json.user;
20992:       SESSION_TOKEN = json.sessionToken || '';
20993:       SESSION_EXPIRES_AT = json.expiresAt || '';
20994:       PERMISSIONS = json.permissions || {};
20995:       // Gabungkan daftar dari backend dengan hasil scan DOM sidebar saat ini,
20996:       // supaya menu apa pun (baru/lama, terdaftar di code.gs atau tidak)
20997:       // SELALU tergate oleh Role Access Management — tidak ada yang lolos
20998:       // tampil begitu saja hanya karena belum sempat didaftarkan manual.
20999:       FEATURE_REGISTRY = (typeof window.mergeFeatureRegistry === 'function')
21000:         ? window.mergeFeatureRegistry(json.features || [])
21001:         : (json.features || []);
21002:       try{ cacheRbacSession_(); }catch(e){}
21003:       applyRbacToUi();
21004:       // [FIX] Sinkronkan matrix Tampilan Sederhana dari backend (kalau sudah
21005:       // tersedia -- lihat handleSaveLcPermissions_/getLcPermissionMatrix_ di
~~~

## form-login — 3
### Around line 3294
~~~text
03278: 
03279: <div id="login-gate">
03280:   <div class="login-box">
03281:     <div class="omodos-logo">
03282:       <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03283:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03284:         <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03285:         <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03286:         <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03287:         <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03288:       </svg>
03289:     </div>
03290:     <h1 class="omodos-wordmark">OMODOS</h1>
03291:     <div class="omodos-tagline">OUR <b class="c-blue">MOTTO</b>. OUR <b class="c-pink">DUTY</b>. OUR <b class="c-amber">STRATEGY</b>.</div>
03292:     <div class="omodos-divider"><span></span><i></i><span></span></div>
03293:     <div class="sub-title">Smart Maintenance Reporting Platform <br> Packaging Offset BMJ</div>
03294:     <form id="form-login" autocomplete="off">
03295:       <div class="field">
03296:         <label>Username</label>
03297:         <input type="text" id="login-username" name="username" placeholder="Masukkan username" required>
03298:       </div>
03299:       <div class="field">
03300:         <label>Password</label>
03301:         <input type="password" id="login-password" name="password" placeholder="Masukkan password" required>
03302:       </div>
03303:       <button type="submit" class="btn btn-primary" id="btn-login-submit">
03304:         <i class="ph-bold ph-lock-key"></i> Masuk
03305:       </button>
03306:       <div class="login-err" id="login-err"></div>
03307:     </form>
03308:     <div class="login-foot">PT BUKIT MURIA JAYA <br> © 2026 IDJ. All Rights Reserved.</div>
03309:   </div>
03310: </div>
03311: 
03312: <div id="app-splash">
03313:   <div class="app-splash-box">
03314:     <div class="omodos-logo">
03315:       <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03316:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03317:         <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03318:         <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03319:         <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03320:         <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03321:       </svg>
03322:     </div>
03323:     <div class="app-splash-spinner"><i class="ph-bold ph-circle-notch ph-spin"></i></div>
03324:     <div class="app-splash-text" id="app-splash-text">Menyiapkan Data...</div>
03325:     <div class="app-splash-sub">Mohon tunggu sebentar, seluruh data aplikasi sedang dimuat.</div>
03326:   </div>
03327: </div>
~~~

### Around line 8040
~~~text
08024:   }
08025:   CURRENT_USER = null;
08026:   SESSION_TOKEN = '';
08027:   SESSION_EXPIRES_AT = '';
08028:   PERMISSIONS = {};
08029:   FEATURE_REGISTRY = [];
08030:   try{ localStorage.removeItem(SS_USER_KEY); localStorage.removeItem(SS_TOKEN_KEY); localStorage.removeItem(SS_TOKEN_EXP_KEY); localStorage.removeItem(LS_PERM_KEY); localStorage.removeItem(LS_FEATURES_KEY); }catch(e){}
08031:   if(typeof resetSettingAuth === 'function') resetSettingAuth();
08032: 
08033:   const gate = document.getElementById('login-gate');
08034:   const appRoot = document.getElementById('app-root');
08035:   if(appRoot) appRoot.classList.remove('unlocked', 'dash-mode', 'menu-visible');
08036:   if(gate){
08037:     gate.style.display = '';
08038:     gate.style.opacity = '1';
08039:   }
08040:   const form = document.getElementById('form-login');
08041:   if(form) form.reset();
08042:   const errEl = document.getElementById('login-err');
08043:   if(errEl) errEl.textContent = '';
08044:   const userField = document.getElementById('login-username');
08045:   if(userField) setTimeout(()=> userField.focus(), 50);
08046: 
08047:   // Hapus state runtime akun lama lalu reload. Cache data/draft/offline
08048:   // tidak dihapus: semuanya sudah dipindahkan ke namespace akun yang logout,
08049:   // sehingga akun berikutnya tidak mewarisi cache tersebut.
08050:   try{ READY_READS.clear(); ACTIVE_READS.clear(); READ_GENERATION++; }catch(e){}
08051:   setTimeout(()=> location.reload(), 60);
08052: }
08053: document.addEventListener('click', (e)=>{
08054:   if(e.target.closest('#btn-logout')){
08055:     if(confirm('Keluar dari aplikasi? Anda perlu login lagi untuk melanjutkan.')) logoutUser();
08056:   }
08057: });
08058: 
08059: /* ---------------- OFFLINE MODE: ANTREAN SINKRON OTOMATIS ----------------
08060:    Aplikasi ini SUDAH menyimpan semua data ke localStorage dulu sebelum
08061:    mengirim ke backend (lihat pola persistPmReport, saveGrReportsLocal, dkk),
08062:    jadi tetap bisa dipakai penuh tanpa internet. Yang ditambahkan di sini:
08063:    setiap kali apiPost gagal karena masalah jaringan, payload-nya diantre;
08064:    begitu koneksi kembali (event 'online' / polling berkala), antrean ini
08065:    otomatis dikirim ulang ke backend tanpa perlu aksi manual dari pengguna. */
08066: const LS_SYNC_QUEUE_KEY = 'logbook_pending_sync_queue';
08067: let APP_ONLINE_STATUS = navigator.onLine;
08068: 
08069: function loadSyncQueue_(){ try{ return JSON.parse(localStorage.getItem(LS_SYNC_QUEUE_KEY) || '[]'); }catch(e){ return []; } }
08070: function saveSyncQueue_(q){ localStorage.setItem(LS_SYNC_QUEUE_KEY, JSON.stringify(q)); renderOfflineBanner(); }
08071: function isSecurityConfigAction_(action){
08072:   return ['savePermissions','saveLcPermissions','saveRoleAccessConfig','createUser','updateUser','resetPassword','setUserActive','deleteUser'].includes(String(action||''));
08073: }
~~~

### Around line 20953
~~~text
20937:     }catch(e){ /* kalau gagal, lanjut tanpa gambar */ }
20938:   }
20939: 
20940:   const buf = await wb.xlsx.writeBuffer();
20941:   downloadBlob(new Blob([buf], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `Laporan-Proyek-${(p.kodeProyek||p.namaProyek||'report').replace(/[^a-z0-9]+/gi,'_')}.xlsx`);
20942:   toast('Excel (.xlsx) laporan proyek berhasil diunduh.');
20943: }
20944: 
20945: /* ---------------- LOGIN GATE (RBAC) ----------------
20946:    Login sekarang divalidasi oleh code.gs (single source of truth untuk
20947:    user, role, password & permission), bukan lagi username/password
20948:    hardcode di frontend. code.gs mengembalikan role & permission matrix
20949:    yang lalu dipakai applyRbacToUi() untuk merender menu sesuai izin. */
20950: (function initLoginGate(){
20951:   const gate = document.getElementById('login-gate');
20952:   const appRoot = document.getElementById('app-root');
20953:   const form = document.getElementById('form-login');
20954:   const errEl = document.getElementById('login-err');
20955:   const submitBtn = document.getElementById('btn-login-submit');
20956: 
20957:   form.addEventListener('submit', async function(e){
20958:     e.preventDefault();
20959:     const u = document.getElementById('login-username').value.trim();
20960:     const p = document.getElementById('login-password').value;
20961:     errEl.textContent = '';
20962: 
20963:     if(!WEB_APP_URL){
20964:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App). Hubungi Superadmin untuk konfigurasi awal.';
20965:       return;
20966:     }
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
20984:         return;
20985:       }
20986:       if(!json.sessionToken){
~~~

## localStorage — 161
### Around line 43
~~~text
00027:       name: 'OMODOS - Maintenance Operating System',
00028:       short_name: 'OMODOS',
00029:       start_url: startUrl,
00030:       scope: startUrl,
00031:       display: 'fullscreen',
00032:       orientation: 'any',
00033:       background_color: '#111318',
00034:       theme_color: '#111318',
00035:       icons: []
00036:     };
00037:     var blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
00038:     document.getElementById('pwa-manifest-link').setAttribute('href', URL.createObjectURL(blob));
00039:   })();
00040: </script>
00041: <title>OMODOS - Smart Maintenance Reporting Platform | Packaging Offset || © 2026 IDJ</title>
00042: <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='38' fill='none' stroke='%23111111' stroke-width='16'/%3E%3Cpath d='M50 88 A38 38 0 0 1 21.7 74.8' fill='none' stroke='%2300AEEF' stroke-width='16'/%3E%3Cpath d='M21.7 74.8 A38 38 0 0 1 50 88' fill='none' stroke='%23EC008C' stroke-width='16'/%3E%3Cpath d='M50 88 A38 38 0 0 0 78.3 74.8' fill='none' stroke='%23FFC20E' stroke-width='16'/%3E%3C/svg%3E">
00043: <script>(function(){ try{ var t = localStorage.getItem('app_theme') || 'omodos'; document.documentElement.setAttribute('data-theme', t); }catch(e){} try{ var s = localStorage.getItem('app_style') || 'klasik'; if(s !== 'klasik'){ document.documentElement.setAttribute('data-style', s); } }catch(e){} })();
00044: document.addEventListener('click', async (e)=>{
00045:   if(e.target.closest('#btn-pi-hs-add-row')){
00046:     renderPiHardSkillEditItems([...PI_HS_EDIT_ITEMS, piBlankHardSkillItem()]);
00047:   }
00048:   if(e.target.closest('.pi-hs-row-remove')){
00049:     const row = e.target.closest('.pi-hs-unit-row');
00050:     const idx = Number(row.dataset.idx);
00051:     const next = PI_HS_EDIT_ITEMS.slice();
00052:     next.splice(idx,1);
00053:     renderPiHardSkillEditItems(next);
00054:   }
00055:   if(e.target.closest('#btn-pi-hs-save-manual')){
00056:     const resume = piComputeHardSkillResume(PI_HS_EDIT_ITEMS);
00057:     const selectedNama = $('#pi-hs-employee').value;
00058:     // Guard: nama HARUS berasal dari daftar karyawan master (dropdown), tidak
00059:     // boleh string kosong/lain-lain yang bisa membuat "karyawan hantu" baru
00060:     // ikut tersimpan ke database SQLite & muncul lagi di dropdown berikutnya.
00061:     const validNames = piEmployeeList();
00062:     if(!selectedNama || !validNames.includes(selectedNama)){
00063:       toast('Nama karyawan tidak valid atau daftar karyawan belum termuat. Silakan tunggu data selesai dimuat lalu pilih ulang nama karyawan.', true);
00064:       return;
00065:     }
00066:     const payload = {
00067:       nama: selectedNama,
00068:       posisi: $('#pi-hs-position').value.trim(),
00069:       tahun: Number($('#pi-hs-year').value)||new Date().getFullYear(),
00070:       assessor: $('#pi-hs-assessor').value.trim(),
00071:       items: PI_HS_EDIT_ITEMS,
00072:       kompeten: resume.kompeten,
00073:       belumKompeten: resume.belumKompeten,
00074:       // Penjelasan Belum Kompeten SELALU dihitung otomatis dari penjelasan
00075:       // per unit kompetensi (satu penjelasan terikat ke satu unit) — tidak
00076:       // ada lagi input manual terpisah di level resume agar tidak double input.
~~~

### Around line 2761
~~~text
02745: #view-downtime .stat-grid .stat.mech .val{color:var(--amber);}
02746: 
02747: /* === SRS LOW COGNITIVE PATCH REAL === */
02748: .readonly-banner{margin:0 0 12px;padding:10px 12px;border:1px solid var(--line);background:var(--panel-2);border-radius:10px;color:var(--text-dim);font-size:12px}
02749: .mission-focus{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin:0 0 16px}
02750: .mission-card{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:14px}
02751: .mission-card .n{font:700 28px var(--font-display);color:var(--text)}
02752: .mission-card .l{font-size:12px;color:var(--text-dim)}
02753: .mission-list{display:grid;gap:10px}
02754: .mission-item{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:12px}
02755: .srs-toolbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
02756: .srs-toolbar input,.srs-toolbar select{min-height:48px}
02757: .single-col-form .grid2,.single-col-form .grid3,.single-col-form .grid4{display:grid !important;grid-template-columns:1fr !important}
02758: 
02759: /* ==========================================================
02760:    LOW COGNITIVE MODE
02761:    Diaktifkan lewat body.low-cognitive (disimpan di localStorage
02762:    key `app_low_cognitive`). CSS override saja — tidak menyentuh
02763:    struktur data/logika bisnis. Elemen yang diberi atribut
02764:    [data-lc-hide] otomatis disembunyikan saat mode aktif.
02765:    ========================================================== */
02766: 
02767: /* --- Switch component (dipakai di Settings & Quick Settings) --- */
02768: .lc-switch{position:relative;display:inline-flex;align-items:center;gap:12px;cursor:pointer;user-select:none;}
02769: .lc-switch input{position:absolute;opacity:0;width:1px;height:1px;}
02770: .lc-switch .lc-track{width:52px;height:30px;background:var(--line);border-radius:999px;position:relative;transition:background var(--trans);flex-shrink:0;}
02771: .lc-switch .lc-track::after{content:'';position:absolute;top:3px;left:3px;width:24px;height:24px;background:#fff;border-radius:50%;transition:transform var(--trans);box-shadow:0 1px 3px rgba(0,0,0,.35);}
02772: .lc-switch input:checked + .lc-track{background:var(--red);}
02773: .lc-switch input:checked + .lc-track::after{transform:translateX(22px);}
02774: .lc-switch input:focus-visible + .lc-track{outline:2px solid var(--red);outline-offset:2px;}
02775: .lc-switch .lc-switch-label{font-size:13.5px;font-weight:600;color:var(--text);}
02776: 
02777: /* ---------------- FORM WIZARD MODE ----------------
02778:    Dipakai di form panjang (mis. #form-entry). Saat mode wizard aktif,
02779:    form diberi class "wizard-mode" dan setiap section (dibungkus otomatis
02780:    oleh initFormWizard() jadi .wizard-step) disembunyikan kecuali step
02781:    yang sedang aktif (.wizard-step.active). Mode standar = default,
02782:    semua step tampil sekaligus seperti form biasa (tanpa class tambahan). */
02783: form.wizard-mode .wizard-step{ display:none; }
02784: form.wizard-mode .wizard-step.active{ display:block; animation:wizardStepIn .18s ease; }
02785: @keyframes wizardStepIn{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:translateY(0);} }
02786: .wizard-progress{ display:flex; align-items:center; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
02787: .wizard-progress .wp-dot{ flex:1; min-width:18px; height:6px; border-radius:4px; background:var(--line); transition:background var(--trans); }
02788: .wizard-progress .wp-dot.done, .wizard-progress .wp-dot.current{ background:var(--red); }
02789: .wizard-stepinfo{ font-size:12.5px; color:var(--text-dim); margin-bottom:14px; }
02790: .wizard-stepinfo b{ color:var(--text); }
02791: .wizard-nav-btns{ display:flex; gap:10px; }
02792: 
02793: .topbar-menu-btn.lc-quick-btn{position:relative;}
02794: .topbar-menu-btn.lc-quick-btn[aria-pressed="true"]{color:var(--red);border-color:var(--red);}
~~~

### Around line 5413
~~~text
05397:           <button class="setting-tab-btn" data-tab="patrol-kategori"><i class="ph-bold ph-toggle-right"></i> Kategori Patrol</button>
05398:           <button class="setting-tab-btn" data-tab="personil"><i class="ph-bold ph-users-three"></i> Personil</button>
05399:           <button class="setting-tab-btn" data-tab="formula"><i class="ph-bold ph-function"></i> Formula</button>
05400:           
05401:         </div>
05402:       </div>
05403: 
05404:       <!-- TAB: KONEKSI -->
05405:       <div class="setting-tab-panel active" id="setting-tab-panel-koneksi">
05406:         <div class="card" style="margin-bottom:18px;">
05407:           <div class="section-title"><i class="ph-bold ph-link"></i> URL Web App (Cloudflare)</div>
05408:           <div class="field">
05409:             <input type="text" id="input-webapp-url" placeholder="https://nama-aplikasi.workers.dev/api">
05410:           </div>
05411:           <button class="btn btn-primary btn-sm" id="btn-save-url">Simpan &amp; Hubungkan</button>
05412:           <span id="conn-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
05413:           <div class="sub" style="margin-top:10px;">Tempel URL dari deployment <code>/exec</code> Cloudflare. URL ini disimpan lokal di browser (localStorage) karena dibutuhkan untuk koneksi awal. Setelah simpan, semua setting lain di tab ini akan tersimpan di database SQLite.<br><br><b>Semua tab lain (Mesin, Personil, Patrol, Formula, Sparepart) 100% tersimpan di database SQLite</b>, bukan hanya lokal. Cek di Spreadsheet kamu akan muncul sheet baru: <code>Analitik_Config</code>, <code>Patrol_Category_Config</code>, <code>Patrol_General_Checklist</code>.</div>
05414:         </div>
05415:       </div>
05416: 
05417:       <!-- TAB: USER MANAGEMENT -->
05418:       <div class="setting-tab-panel" id="setting-tab-panel-users">
05419:         <div id="rbac-admin-section"></div>
05420:         <div class="setting-tab-empty" id="rbac-empty-hint" style="display:none;">Memuat data user... Jika tetap kosong, pastikan kamu login sebagai Superadmin.</div>
05421:       </div>
05422: 
05423:       <!-- TAB: ROLE ACCESS MANAGEMENT -->
05424:       <div class="setting-tab-panel" id="setting-tab-panel-roles">
05425:         <div id="rbac-role-section"></div>
05426:       </div>
05427: 
05428:       <!-- TAB: MESIN -->
05429:       <div class="setting-tab-panel" id="setting-tab-panel-mesin">
05430:         <div class="card" style="margin-bottom:18px;">
05431:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Mesin Baru</div>
05432:           <div class="grid3">
05433:             <div class="field"><label>Kode Mesin</label><input type="text" id="new-kode-mesin" placeholder="OFU-1"></div>
05434:             <div class="field"><label>Nama Mesin</label><input type="text" id="new-nama-mesin" placeholder="Offset Machine #5"></div>
05435:           </div>
05436:           <div class="grid3">
05437:             <div class="field"><label>Model</label><input type="text" id="new-model-mesin" placeholder="cth: CD 102-8+L"></div>
05438:             <div class="field"><label>Kategori</label><input type="text" id="new-kategori-mesin" placeholder="A - Offset Printing"></div>
05439:             <div class="field"><label>Lokasi/Area</label><input type="text" id="new-lokasi-mesin" placeholder="cth: Ruang Cetak Offset"></div>
05440:           </div>
05441:           <div class="field"><label>Nama Mesin (Deskripsi Lengkap)</label><input type="text" id="new-deskripsi-mesin" placeholder="cth: OFFSET UV INK - 5 MACHINE + INLINE INS"></div>
05442:           <div class="field"><label>Fungsi Mesin (Bahasa Indonesia)</label><textarea id="new-fungsi-mesin" rows="3" placeholder="Jelaskan fungsi mesin ini secara singkat."></textarea></div>
05443:           <div class="field"><label>Spesifikasi Mesin</label><textarea id="new-spesifikasi-mesin" rows="4" placeholder="cth: Kapasitas 8000 lembar/jam, tahun pembuatan 2015, tegangan 380V, dst."></textarea></div>
05444:           <div class="grid2">
05445:             <div class="field"><label>Link Manual Book / Referensi</label><input type="text" id="new-link-referensi-mesin" placeholder="https://..."></div>
05446:             <div class="field"><label>Keterangan Sumber</label><input type="text" id="new-keterangan-sumber-mesin" placeholder="cth: Situs resmi pabrikan"></div>
~~~

### Around line 5587
~~~text
05571: 
05572:       <!-- [STYLE MANAGER] Terpisah dari palet warna di atas. Mengubah BENTUK
05573:            seluruh komponen aplikasi (card, tombol, input, badge, sidebar,
05574:            dst) lewat atribut html[data-style]. Palet warna yang dipilih di
05575:            Theme Manager di atas TETAP dipakai — kedua pilihan independen &
05576:            bisa dikombinasikan bebas. Dirender dinamis dari STYLE_REGISTRY
05577:            lewat renderStyleManager(). -->
05578:       <div class="card" style="margin-bottom:18px;">
05579:         <div class="section-title"><i class="ph-bold ph-shapes"></i> Style Manager — Gaya Tampilan Aplikasi</div>
05580:         <div class="sub" style="margin-bottom:14px;">Ubah bentuk & nuansa seluruh tampilan aplikasi (card, tombol, input, sidebar, dll) — bukan sekadar warna. Palet warna tetap mengikuti pilihan Theme Manager di atas, jadi gaya apa pun bisa dipadukan dengan warna apa pun.</div>
05581:         <div class="style-manager-grid" id="style-manager-grid"></div>
05582:       </div>
05583: 
05584:       <!-- [LOW COGNITIVE MODE] Dipindah keluar dari Master Koneksi ke menu
05585:            Tema Aplikasi supaya bisa diakses tanpa perlu login ulang Master
05586:            Koneksi. Ada juga quick-toggle di topbar (ikon otak) untuk akses
05587:            cepat. State disimpan di localStorage key `app_low_cognitive` dan
05588:            diterapkan lewat class body.low-cognitive (lihat CSS & fungsi
05589:            setLowCognitiveMode() di kode skrip). -->
05590:       <div class="card" id="lc-mode-card">
05591:         <div class="section-title"><i class="ph-bold ph-brain"></i> Tampilan Sederhana</div>
05592:         <div class="sub" style="margin-bottom:14px;">
05593:           Sederhanakan tampilan aplikasi: sembunyikan info &amp; menu sekunder, perbesar teks dan tombol,
05594:           kurangi animasi &amp; efek visual, dan fokuskan hanya pada pekerjaan utama (Dashboard, Input, History, Search, Setting).
05595:           Cocok dipakai saat kerja lapangan, beban kerja tinggi, atau butuh tampilan yang lebih ringan.
05596:         </div>
05597:         <label class="lc-switch">
05598:           <input type="checkbox" id="lc-mode-toggle" aria-label="Aktifkan Tampilan Sederhana">
05599:           <span class="lc-track" aria-hidden="true"></span>
05600:           <span class="lc-switch-label" id="lc-mode-toggle-label">Nonaktif</span>
05601:         </label>
05602:       </div>
05603:     </section>
05604: 
05605:     <!-- ============ PEOPLE INTELLIGENCE SYSTEM ============
05606:          Modul baru: menggabungkan hasil Assessment Kompetensi Teknis
05607:          (sumber: 02__Assessment_TechComp_Result - Offset Technical.xlsx)
05608:          dengan Soft Skill Assessment (baru, dinilai Supervisor 1-5).
05609:          Data teknis TIDAK diubah/diganti — hanya dibaca & ditampilkan
05610:          apa adanya sebagai satu-satunya sumber kebenaran (source of truth). -->
05611:     <section class="view" id="view-pi-dashboard">
05612:       <div class="topbar">
05613:         <button class="btn btn-sm btn-back-to-people" onclick="goToView('people-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05614:         <div><h1>People Intelligence Dashboard</h1><div class="sub">Ringkasan gabungan Kompetensi Teknis &amp; Soft Skill seluruh personil, berdasarkan data Assessment Teknis dan Soft Skill Assessment.</div></div>
05615:       </div>
05616:       <div class="stat-strip" id="pi-dash-stats"></div>
05617:       <div class="pi-2col" style="margin-top:16px;">
05618:         <div class="card">
05619:           <div class="section-title"><i class="ph-bold ph-chart-bar"></i> Hard Skill vs Soft Skill Score per Personil</div>
05620:           <div style="height:320px;"><canvas id="pi-chart-compare"></canvas></div>
~~~

### Around line 6017
~~~text
06001:     // jadi tidak perlu memunculkan popup mengganggu untuk kasus ini (dulu
06002:     // muncul setiap pengguna menekan tombol Share/Bagikan bawaan browser).
06003:     const isGenericCrossOriginNoise = !e.error && e.message === 'Script error.' && !e.filename && !e.lineno && !e.colno;
06004:     if(isGenericCrossOriginNoise) return;
06005:     if(e && e.error) showAppErrorPopup(e.error);
06006:     else if(e && e.message) showAppErrorPopup(e.message);
06007:   });
06008:   window.addEventListener('unhandledrejection', function(e){
06009:     showAppErrorPopup(e && e.reason);
06010:   });
06011: })();
06012: 
06013: /* =========================================================
06014:    LOGBOOK MAINTENANCE — FRONTEND LOGIC
06015:    ========================================================= */
06016: // --- Dipindahkan ke sini (perbaikan bug "can't access lexical declaration before initialization") ---
06017: // Konstanta-konstanta key localStorage ini sebelumnya dideklarasikan tersebar jauh di bawah,
06018: // padahal getViewLocalStorageKeys() bisa terpanggil lebih awal (mis. saat sesi login yang sudah
06019: // tersimpan otomatis dipulihkan lalu langsung switchToView('dashboard') dijalankan secara sinkron).
06020: // Karena semua value pada object literal getViewLocalStorageKeys() langsung dievaluasi saat object
06021: // dibuat (bukan lazy per-key), variabel yang belum sempat dideklarasikan menyebabkan TDZ error.
06022: // Dipindah ke awal script supaya selalu sudah terinisialisasi sebelum sempat dipakai.
06023: const LS_FORM_ENTRY_DRAFT_KEY = 'app_low_cognitive_draft_form_entry';
06024: const LS_RCA_KEY = 'logbook_rca_reports';
06025: const LS_SPAREPART_KEY = 'logbook_sparepart_status';
06026: const LS_SPAREPART_LOKASI_KEY = 'logbook_sparepart_lokasi';
06027: const LS_SPAREPART_ETA_KEY = 'logbook_sparepart_eta';
06028: const LS_SPAREPART_WAREHOUSE_KEY = 'logbook_sparepart_warehouse';
06029: const LS_SPAREPART_OPNAME_KEY = 'logbook_sparepart_opname';
06030: const LS_KPI_KERJA_KEY = 'logbook_kpi_kerja';
06031: const LS_ANALITIK_CONFIG_KEY = 'logbook_analitik_config';
06032: // [FIX-TDZ] Key cache Patrol General harus dideklarasikan sebelum restoreRbacSession_ -> switchToView -> getViewLocalStorageKeys.
06033: const LS_PATROL_GENERAL_ITEMS_KEY = 'logbook_patrol_general_items';
06034: // [FIX] Dipindah ke sini (dari dekat PATROL_CHECKLIST_DEF di bawah) karena
06035: // dipakai oleh getViewLocalStorageKeys(), yang dipanggil saat aplikasi
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
06043: const LS_IPAL_KEY = 'logbook_ipal_reports';
06044: const LS_PM_KEY = 'logbook_predictive_reports';
06045: const LS_GR_KEY = 'logbook_general_reports';
06046: const LS_PI_SOFTSKILL_KEY = 'pi_softskill_assessments';
06047: const LS_PI_HARDSKILL_KEY = 'pi_hardskill_assessments_v1';
06048: const LS_PI_PERSONNEL_KEY = 'pi_personnel_master_v1';
06049: 
06050: const LS_URL_KEY = 'logbook_cloudflare_api_v1';
~~~

### Around line 6018
~~~text
06002:     // muncul setiap pengguna menekan tombol Share/Bagikan bawaan browser).
06003:     const isGenericCrossOriginNoise = !e.error && e.message === 'Script error.' && !e.filename && !e.lineno && !e.colno;
06004:     if(isGenericCrossOriginNoise) return;
06005:     if(e && e.error) showAppErrorPopup(e.error);
06006:     else if(e && e.message) showAppErrorPopup(e.message);
06007:   });
06008:   window.addEventListener('unhandledrejection', function(e){
06009:     showAppErrorPopup(e && e.reason);
06010:   });
06011: })();
06012: 
06013: /* =========================================================
06014:    LOGBOOK MAINTENANCE — FRONTEND LOGIC
06015:    ========================================================= */
06016: // --- Dipindahkan ke sini (perbaikan bug "can't access lexical declaration before initialization") ---
06017: // Konstanta-konstanta key localStorage ini sebelumnya dideklarasikan tersebar jauh di bawah,
06018: // padahal getViewLocalStorageKeys() bisa terpanggil lebih awal (mis. saat sesi login yang sudah
06019: // tersimpan otomatis dipulihkan lalu langsung switchToView('dashboard') dijalankan secara sinkron).
06020: // Karena semua value pada object literal getViewLocalStorageKeys() langsung dievaluasi saat object
06021: // dibuat (bukan lazy per-key), variabel yang belum sempat dideklarasikan menyebabkan TDZ error.
06022: // Dipindah ke awal script supaya selalu sudah terinisialisasi sebelum sempat dipakai.
06023: const LS_FORM_ENTRY_DRAFT_KEY = 'app_low_cognitive_draft_form_entry';
06024: const LS_RCA_KEY = 'logbook_rca_reports';
06025: const LS_SPAREPART_KEY = 'logbook_sparepart_status';
06026: const LS_SPAREPART_LOKASI_KEY = 'logbook_sparepart_lokasi';
06027: const LS_SPAREPART_ETA_KEY = 'logbook_sparepart_eta';
06028: const LS_SPAREPART_WAREHOUSE_KEY = 'logbook_sparepart_warehouse';
06029: const LS_SPAREPART_OPNAME_KEY = 'logbook_sparepart_opname';
06030: const LS_KPI_KERJA_KEY = 'logbook_kpi_kerja';
06031: const LS_ANALITIK_CONFIG_KEY = 'logbook_analitik_config';
06032: // [FIX-TDZ] Key cache Patrol General harus dideklarasikan sebelum restoreRbacSession_ -> switchToView -> getViewLocalStorageKeys.
06033: const LS_PATROL_GENERAL_ITEMS_KEY = 'logbook_patrol_general_items';
06034: // [FIX] Dipindah ke sini (dari dekat PATROL_CHECKLIST_DEF di bawah) karena
06035: // dipakai oleh getViewLocalStorageKeys(), yang dipanggil saat aplikasi
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
06043: const LS_IPAL_KEY = 'logbook_ipal_reports';
06044: const LS_PM_KEY = 'logbook_predictive_reports';
06045: const LS_GR_KEY = 'logbook_general_reports';
06046: const LS_PI_SOFTSKILL_KEY = 'pi_softskill_assessments';
06047: const LS_PI_HARDSKILL_KEY = 'pi_hardskill_assessments_v1';
06048: const LS_PI_PERSONNEL_KEY = 'pi_personnel_master_v1';
06049: 
06050: const LS_URL_KEY = 'logbook_cloudflare_api_v1';
06051: const DEFAULT_WEB_APP_URL = location.origin + '/api';
~~~

### Around line 6020
~~~text
06004:     if(isGenericCrossOriginNoise) return;
06005:     if(e && e.error) showAppErrorPopup(e.error);
06006:     else if(e && e.message) showAppErrorPopup(e.message);
06007:   });
06008:   window.addEventListener('unhandledrejection', function(e){
06009:     showAppErrorPopup(e && e.reason);
06010:   });
06011: })();
06012: 
06013: /* =========================================================
06014:    LOGBOOK MAINTENANCE — FRONTEND LOGIC
06015:    ========================================================= */
06016: // --- Dipindahkan ke sini (perbaikan bug "can't access lexical declaration before initialization") ---
06017: // Konstanta-konstanta key localStorage ini sebelumnya dideklarasikan tersebar jauh di bawah,
06018: // padahal getViewLocalStorageKeys() bisa terpanggil lebih awal (mis. saat sesi login yang sudah
06019: // tersimpan otomatis dipulihkan lalu langsung switchToView('dashboard') dijalankan secara sinkron).
06020: // Karena semua value pada object literal getViewLocalStorageKeys() langsung dievaluasi saat object
06021: // dibuat (bukan lazy per-key), variabel yang belum sempat dideklarasikan menyebabkan TDZ error.
06022: // Dipindah ke awal script supaya selalu sudah terinisialisasi sebelum sempat dipakai.
06023: const LS_FORM_ENTRY_DRAFT_KEY = 'app_low_cognitive_draft_form_entry';
06024: const LS_RCA_KEY = 'logbook_rca_reports';
06025: const LS_SPAREPART_KEY = 'logbook_sparepart_status';
06026: const LS_SPAREPART_LOKASI_KEY = 'logbook_sparepart_lokasi';
06027: const LS_SPAREPART_ETA_KEY = 'logbook_sparepart_eta';
06028: const LS_SPAREPART_WAREHOUSE_KEY = 'logbook_sparepart_warehouse';
06029: const LS_SPAREPART_OPNAME_KEY = 'logbook_sparepart_opname';
06030: const LS_KPI_KERJA_KEY = 'logbook_kpi_kerja';
06031: const LS_ANALITIK_CONFIG_KEY = 'logbook_analitik_config';
06032: // [FIX-TDZ] Key cache Patrol General harus dideklarasikan sebelum restoreRbacSession_ -> switchToView -> getViewLocalStorageKeys.
06033: const LS_PATROL_GENERAL_ITEMS_KEY = 'logbook_patrol_general_items';
06034: // [FIX] Dipindah ke sini (dari dekat PATROL_CHECKLIST_DEF di bawah) karena
06035: // dipakai oleh getViewLocalStorageKeys(), yang dipanggil saat aplikasi
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
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
~~~

### Around line 6032
~~~text
06016: // --- Dipindahkan ke sini (perbaikan bug "can't access lexical declaration before initialization") ---
06017: // Konstanta-konstanta key localStorage ini sebelumnya dideklarasikan tersebar jauh di bawah,
06018: // padahal getViewLocalStorageKeys() bisa terpanggil lebih awal (mis. saat sesi login yang sudah
06019: // tersimpan otomatis dipulihkan lalu langsung switchToView('dashboard') dijalankan secara sinkron).
06020: // Karena semua value pada object literal getViewLocalStorageKeys() langsung dievaluasi saat object
06021: // dibuat (bukan lazy per-key), variabel yang belum sempat dideklarasikan menyebabkan TDZ error.
06022: // Dipindah ke awal script supaya selalu sudah terinisialisasi sebelum sempat dipakai.
06023: const LS_FORM_ENTRY_DRAFT_KEY = 'app_low_cognitive_draft_form_entry';
06024: const LS_RCA_KEY = 'logbook_rca_reports';
06025: const LS_SPAREPART_KEY = 'logbook_sparepart_status';
06026: const LS_SPAREPART_LOKASI_KEY = 'logbook_sparepart_lokasi';
06027: const LS_SPAREPART_ETA_KEY = 'logbook_sparepart_eta';
06028: const LS_SPAREPART_WAREHOUSE_KEY = 'logbook_sparepart_warehouse';
06029: const LS_SPAREPART_OPNAME_KEY = 'logbook_sparepart_opname';
06030: const LS_KPI_KERJA_KEY = 'logbook_kpi_kerja';
06031: const LS_ANALITIK_CONFIG_KEY = 'logbook_analitik_config';
06032: // [FIX-TDZ] Key cache Patrol General harus dideklarasikan sebelum restoreRbacSession_ -> switchToView -> getViewLocalStorageKeys.
06033: const LS_PATROL_GENERAL_ITEMS_KEY = 'logbook_patrol_general_items';
06034: // [FIX] Dipindah ke sini (dari dekat PATROL_CHECKLIST_DEF di bawah) karena
06035: // dipakai oleh getViewLocalStorageKeys(), yang dipanggil saat aplikasi
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
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
06060: // dari menu Patrol sesuai RBAC.
06061: let HOME_PATROL_STATUS = [];
06062: 
06063: /* ---------------- [PERF FIX] SEED SEKALI, LALU DELTA SAJA ----------------
06064:    Sebelumnya SETIAP kali aplikasi dibuka (termasuk di tablet high-spec),
06065:    loadAll() mengunduh ULANG seluruh Logbook + master data dari nol lewat
~~~

### Around line 6035
~~~text
06019: // tersimpan otomatis dipulihkan lalu langsung switchToView('dashboard') dijalankan secara sinkron).
06020: // Karena semua value pada object literal getViewLocalStorageKeys() langsung dievaluasi saat object
06021: // dibuat (bukan lazy per-key), variabel yang belum sempat dideklarasikan menyebabkan TDZ error.
06022: // Dipindah ke awal script supaya selalu sudah terinisialisasi sebelum sempat dipakai.
06023: const LS_FORM_ENTRY_DRAFT_KEY = 'app_low_cognitive_draft_form_entry';
06024: const LS_RCA_KEY = 'logbook_rca_reports';
06025: const LS_SPAREPART_KEY = 'logbook_sparepart_status';
06026: const LS_SPAREPART_LOKASI_KEY = 'logbook_sparepart_lokasi';
06027: const LS_SPAREPART_ETA_KEY = 'logbook_sparepart_eta';
06028: const LS_SPAREPART_WAREHOUSE_KEY = 'logbook_sparepart_warehouse';
06029: const LS_SPAREPART_OPNAME_KEY = 'logbook_sparepart_opname';
06030: const LS_KPI_KERJA_KEY = 'logbook_kpi_kerja';
06031: const LS_ANALITIK_CONFIG_KEY = 'logbook_analitik_config';
06032: // [FIX-TDZ] Key cache Patrol General harus dideklarasikan sebelum restoreRbacSession_ -> switchToView -> getViewLocalStorageKeys.
06033: const LS_PATROL_GENERAL_ITEMS_KEY = 'logbook_patrol_general_items';
06034: // [FIX] Dipindah ke sini (dari dekat PATROL_CHECKLIST_DEF di bawah) karena
06035: // dipakai oleh getViewLocalStorageKeys(), yang dipanggil saat aplikasi
06036: // pertama kali dibuka (restoreRbacSession_ -> switchToView ->
06037: // ensureClearLocalCacheButton) -- jauh SEBELUM baris deklarasi lama
06038: // dieksekusi. const/let tidak di-hoist seperti var, jadi mengaksesnya
06039: // sebelum baris deklarasinya dieksekusi melempar ReferenceError ("Cannot
06040: // access before initialization" / temporal dead zone). Deklarasi di sini
06041: // dipastikan sudah berjalan sebelum switchToView() pertama kali dipanggil.
06042: const LS_PATROL_CATEGORY_CONFIG_KEY = 'logbook_patrol_category_config';
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
06060: // dari menu Patrol sesuai RBAC.
06061: let HOME_PATROL_STATUS = [];
06062: 
06063: /* ---------------- [PERF FIX] SEED SEKALI, LALU DELTA SAJA ----------------
06064:    Sebelumnya SETIAP kali aplikasi dibuka (termasuk di tablet high-spec),
06065:    loadAll() mengunduh ULANG seluruh Logbook + master data dari nol lewat
06066:    Cloudflare -- yang lambat karena Cloudflare (bukan tabletnya)
06067:    yang jadi bottleneck: baca ribuan baris database SQLite tiap request.
06068:    Sekarang: kunjungan PERTAMA di gadget tersebut tetap unduh penuh
~~~

### Around line 6069
~~~text
06053: let ENTRIES = [];
06054: let MACHINES = [];
06055: let PERSONIL = [];
06056: let PATROL_TEMPLATE = []; // item checklist patrol spesifik per mesin, dari sheet Patrol_Checklist_Template
06057: let KB_ENTRIES = [];
06058: // Ringkasan Patrol minimum dari bootstrap untuk Home. Tidak berisi file,
06059: // checklist detail, rekomendasi, atau data lain yang hanya boleh dibuka
06060: // dari menu Patrol sesuai RBAC.
06061: let HOME_PATROL_STATUS = [];
06062: 
06063: /* ---------------- [PERF FIX] SEED SEKALI, LALU DELTA SAJA ----------------
06064:    Sebelumnya SETIAP kali aplikasi dibuka (termasuk di tablet high-spec),
06065:    loadAll() mengunduh ULANG seluruh Logbook + master data dari nol lewat
06066:    Cloudflare -- yang lambat karena Cloudflare (bukan tabletnya)
06067:    yang jadi bottleneck: baca ribuan baris database SQLite tiap request.
06068:    Sekarang: kunjungan PERTAMA di gadget tersebut tetap unduh penuh
06069:    ("seed") dan disimpan ke localStorage. Kunjungan-kunjungan berikutnya:
06070:    1) render dulu dari cache localStorage (instan, tanpa nunggu network),
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
06085: function saveSeedCache_(key, payload){
06086:   try{ localStorage.setItem(LS_SEED_PREFIX+key, JSON.stringify(payload)); }
06087:   catch(e){ /* localStorage penuh/nonaktif -- lewati diam-diam, app tetap jalan pakai memori */ }
06088: }
06089: // Upsert-by-ID: dipakai untuk menggabungkan hasil delta Logbook ke cache
06090: // lama tanpa duplikat, plus membuang entri yang sudah dihapus (deletedIds).
06091: function mergeByIdInto_(list, changed, deletedIds, idField){
06092:   idField = idField || 'ID';
06093:   const byId = {};
06094:   list.forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06095:   (changed||[]).forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06096:   (deletedIds||[]).forEach(id=>{ delete byId[id]; });
06097:   return Object.values(byId);
06098: }
06099: 
06100: /* ---------------- [FITUR BARU] SOURCE OF TRUTH CUTOFF (LOGBOOK) ----------------
06101:    Seluruh data logbook hasil EXPORT dari OneNote (yaitu semua entri dengan
06102:    Tanggal SEBELUM cutoff ini) belum bisa dipastikan tervalidasi -- jadi
~~~

### Around line 6070
~~~text
06054: let MACHINES = [];
06055: let PERSONIL = [];
06056: let PATROL_TEMPLATE = []; // item checklist patrol spesifik per mesin, dari sheet Patrol_Checklist_Template
06057: let KB_ENTRIES = [];
06058: // Ringkasan Patrol minimum dari bootstrap untuk Home. Tidak berisi file,
06059: // checklist detail, rekomendasi, atau data lain yang hanya boleh dibuka
06060: // dari menu Patrol sesuai RBAC.
06061: let HOME_PATROL_STATUS = [];
06062: 
06063: /* ---------------- [PERF FIX] SEED SEKALI, LALU DELTA SAJA ----------------
06064:    Sebelumnya SETIAP kali aplikasi dibuka (termasuk di tablet high-spec),
06065:    loadAll() mengunduh ULANG seluruh Logbook + master data dari nol lewat
06066:    Cloudflare -- yang lambat karena Cloudflare (bukan tabletnya)
06067:    yang jadi bottleneck: baca ribuan baris database SQLite tiap request.
06068:    Sekarang: kunjungan PERTAMA di gadget tersebut tetap unduh penuh
06069:    ("seed") dan disimpan ke localStorage. Kunjungan-kunjungan berikutnya:
06070:    1) render dulu dari cache localStorage (instan, tanpa nunggu network),
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
06085: function saveSeedCache_(key, payload){
06086:   try{ localStorage.setItem(LS_SEED_PREFIX+key, JSON.stringify(payload)); }
06087:   catch(e){ /* localStorage penuh/nonaktif -- lewati diam-diam, app tetap jalan pakai memori */ }
06088: }
06089: // Upsert-by-ID: dipakai untuk menggabungkan hasil delta Logbook ke cache
06090: // lama tanpa duplikat, plus membuang entri yang sudah dihapus (deletedIds).
06091: function mergeByIdInto_(list, changed, deletedIds, idField){
06092:   idField = idField || 'ID';
06093:   const byId = {};
06094:   list.forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06095:   (changed||[]).forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06096:   (deletedIds||[]).forEach(id=>{ delete byId[id]; });
06097:   return Object.values(byId);
06098: }
06099: 
06100: /* ---------------- [FITUR BARU] SOURCE OF TRUTH CUTOFF (LOGBOOK) ----------------
06101:    Seluruh data logbook hasil EXPORT dari OneNote (yaitu semua entri dengan
06102:    Tanggal SEBELUM cutoff ini) belum bisa dipastikan tervalidasi -- jadi
06103:    TIDAK dianggap source of truth untuk perhitungan/analisa apapun (Machine
~~~

### Around line 6082
~~~text
06066:    Cloudflare -- yang lambat karena Cloudflare (bukan tabletnya)
06067:    yang jadi bottleneck: baca ribuan baris database SQLite tiap request.
06068:    Sekarang: kunjungan PERTAMA di gadget tersebut tetap unduh penuh
06069:    ("seed") dan disimpan ke localStorage. Kunjungan-kunjungan berikutnya:
06070:    1) render dulu dari cache localStorage (instan, tanpa nunggu network),
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
06085: function saveSeedCache_(key, payload){
06086:   try{ localStorage.setItem(LS_SEED_PREFIX+key, JSON.stringify(payload)); }
06087:   catch(e){ /* localStorage penuh/nonaktif -- lewati diam-diam, app tetap jalan pakai memori */ }
06088: }
06089: // Upsert-by-ID: dipakai untuk menggabungkan hasil delta Logbook ke cache
06090: // lama tanpa duplikat, plus membuang entri yang sudah dihapus (deletedIds).
06091: function mergeByIdInto_(list, changed, deletedIds, idField){
06092:   idField = idField || 'ID';
06093:   const byId = {};
06094:   list.forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06095:   (changed||[]).forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06096:   (deletedIds||[]).forEach(id=>{ delete byId[id]; });
06097:   return Object.values(byId);
06098: }
06099: 
06100: /* ---------------- [FITUR BARU] SOURCE OF TRUTH CUTOFF (LOGBOOK) ----------------
06101:    Seluruh data logbook hasil EXPORT dari OneNote (yaitu semua entri dengan
06102:    Tanggal SEBELUM cutoff ini) belum bisa dipastikan tervalidasi -- jadi
06103:    TIDAK dianggap source of truth untuk perhitungan/analisa apapun (Machine
06104:    Health Score, Dashboard Analitik, Copilot, Correlation/Diagnostic, Expert
06105:    Finder, saran Knowledge Base, dll). Data itu HANYA dipakai sebagai
06106:    pembanding historis (ditampilkan terpisah & diberi label eksplisit di
06107:    tempat yang relevan), tidak pernah dicampur ke angka utama.
06108:    Data pada/setelah cutoff (diinput langsung lewat aplikasi ini) itulah
06109:    yang jadi source of truth. Ganti SOT_CUTOFF_DATE di sini kalau cutoff-nya
06110:    berubah -- satu tempat ini mengatur seluruh fitur yang memakai helper di
06111:    bawah, tidak perlu ubah satu-satu di tiap fitur. */
06112: const SOT_CUTOFF_DATE = new Date('2026-09-01T00:00:00');
06113: function isSotEntry(e){
06114:   const d = new Date(e && e['Tanggal']);
06115:   return !isNaN(d) && d >= SOT_CUTOFF_DATE;
~~~

### Around line 6086
~~~text
06070:    1) render dulu dari cache localStorage (instan, tanpa nunggu network),
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
06085: function saveSeedCache_(key, payload){
06086:   try{ localStorage.setItem(LS_SEED_PREFIX+key, JSON.stringify(payload)); }
06087:   catch(e){ /* localStorage penuh/nonaktif -- lewati diam-diam, app tetap jalan pakai memori */ }
06088: }
06089: // Upsert-by-ID: dipakai untuk menggabungkan hasil delta Logbook ke cache
06090: // lama tanpa duplikat, plus membuang entri yang sudah dihapus (deletedIds).
06091: function mergeByIdInto_(list, changed, deletedIds, idField){
06092:   idField = idField || 'ID';
06093:   const byId = {};
06094:   list.forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06095:   (changed||[]).forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06096:   (deletedIds||[]).forEach(id=>{ delete byId[id]; });
06097:   return Object.values(byId);
06098: }
06099: 
06100: /* ---------------- [FITUR BARU] SOURCE OF TRUTH CUTOFF (LOGBOOK) ----------------
06101:    Seluruh data logbook hasil EXPORT dari OneNote (yaitu semua entri dengan
06102:    Tanggal SEBELUM cutoff ini) belum bisa dipastikan tervalidasi -- jadi
06103:    TIDAK dianggap source of truth untuk perhitungan/analisa apapun (Machine
06104:    Health Score, Dashboard Analitik, Copilot, Correlation/Diagnostic, Expert
06105:    Finder, saran Knowledge Base, dll). Data itu HANYA dipakai sebagai
06106:    pembanding historis (ditampilkan terpisah & diberi label eksplisit di
06107:    tempat yang relevan), tidak pernah dicampur ke angka utama.
06108:    Data pada/setelah cutoff (diinput langsung lewat aplikasi ini) itulah
06109:    yang jadi source of truth. Ganti SOT_CUTOFF_DATE di sini kalau cutoff-nya
06110:    berubah -- satu tempat ini mengatur seluruh fitur yang memakai helper di
06111:    bawah, tidak perlu ubah satu-satu di tiap fitur. */
06112: const SOT_CUTOFF_DATE = new Date('2026-09-01T00:00:00');
06113: function isSotEntry(e){
06114:   const d = new Date(e && e['Tanggal']);
06115:   return !isNaN(d) && d >= SOT_CUTOFF_DATE;
06116: }
06117: function isHistoricalEntry(e){
06118:   const d = new Date(e && e['Tanggal']);
06119:   return !isNaN(d) && d < SOT_CUTOFF_DATE;
~~~

### Around line 6087
~~~text
06071:    2) di background, minta HANYA data yang berubah sejak kunjungan
06072:       terakhir (delta), gabungkan ke cache, simpan lagi.
06073:    Untuk Logbook (paling berat & paling sering berubah) delta betulan
06074:    dibaca dari server pakai parameter 'since' (lihat getLogbookList_ di
06075:    code.gs). Untuk master data yang jarang berubah (Machines, Personil,
06076:    Patrol Template) cukup pola stale-while-revalidate: tampilkan cache
06077:    lama secepatnya, lalu diam-diam disegarkan penuh di background --
06078:    sudah cukup terasa instan karena tidak pernah menunggu network sama
06079:    sekali untuk BISA menampilkan sesuatu. */
06080: const LS_SEED_PREFIX = 'omodos_seed_v1_';
06081: function loadSeedCache_(key){
06082:   try{ const raw = localStorage.getItem(LS_SEED_PREFIX+key); return raw ? JSON.parse(raw) : null; }
06083:   catch(e){ return null; }
06084: }
06085: function saveSeedCache_(key, payload){
06086:   try{ localStorage.setItem(LS_SEED_PREFIX+key, JSON.stringify(payload)); }
06087:   catch(e){ /* localStorage penuh/nonaktif -- lewati diam-diam, app tetap jalan pakai memori */ }
06088: }
06089: // Upsert-by-ID: dipakai untuk menggabungkan hasil delta Logbook ke cache
06090: // lama tanpa duplikat, plus membuang entri yang sudah dihapus (deletedIds).
06091: function mergeByIdInto_(list, changed, deletedIds, idField){
06092:   idField = idField || 'ID';
06093:   const byId = {};
06094:   list.forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06095:   (changed||[]).forEach(item=>{ if(item && item[idField]!==undefined) byId[item[idField]] = item; });
06096:   (deletedIds||[]).forEach(id=>{ delete byId[id]; });
06097:   return Object.values(byId);
06098: }
06099: 
06100: /* ---------------- [FITUR BARU] SOURCE OF TRUTH CUTOFF (LOGBOOK) ----------------
06101:    Seluruh data logbook hasil EXPORT dari OneNote (yaitu semua entri dengan
06102:    Tanggal SEBELUM cutoff ini) belum bisa dipastikan tervalidasi -- jadi
06103:    TIDAK dianggap source of truth untuk perhitungan/analisa apapun (Machine
06104:    Health Score, Dashboard Analitik, Copilot, Correlation/Diagnostic, Expert
06105:    Finder, saran Knowledge Base, dll). Data itu HANYA dipakai sebagai
06106:    pembanding historis (ditampilkan terpisah & diberi label eksplisit di
06107:    tempat yang relevan), tidak pernah dicampur ke angka utama.
06108:    Data pada/setelah cutoff (diinput langsung lewat aplikasi ini) itulah
06109:    yang jadi source of truth. Ganti SOT_CUTOFF_DATE di sini kalau cutoff-nya
06110:    berubah -- satu tempat ini mengatur seluruh fitur yang memakai helper di
06111:    bawah, tidak perlu ubah satu-satu di tiap fitur. */
06112: const SOT_CUTOFF_DATE = new Date('2026-09-01T00:00:00');
06113: function isSotEntry(e){
06114:   const d = new Date(e && e['Tanggal']);
06115:   return !isNaN(d) && d >= SOT_CUTOFF_DATE;
06116: }
06117: function isHistoricalEntry(e){
06118:   const d = new Date(e && e['Tanggal']);
06119:   return !isNaN(d) && d < SOT_CUTOFF_DATE;
06120: }
~~~

### Around line 6186
~~~text
06170: // Estimasi kerugian finansial pabrik per JAM downtime breakdown, dipakai untuk
06171: // menghitung dampak finansial Lost Time 24 jam terakhir di Smart Resume Home.
06172: // [EDIT] Nilai ini TIDAK di-hardcode lagi — sekarang diinput lewat menu
06173: // Master Koneksi > Formula MTBF & MTTR (field "Estimasi Kerugian per Jam
06174: // Downtime (Rp)") dan disimpan di ANALITIK_CONFIG.kerugianPerJam (lihat
06175: // bagian FORMULA MTBF/MTTR di bawah). Konstanta ini hanya dipakai sebagai
06176: // nilai default/fallback kalau belum pernah diisi sama sekali.
06177: const HOME_KERUGIAN_PER_JAM_RP_DEFAULT = 5000000; // Rp 5.000.000 / jam downtime (default awal)
06178: function getHomeKerugianPerJamRp(){
06179:   return (typeof ANALITIK_CONFIG !== 'undefined' && ANALITIK_CONFIG && Number(ANALITIK_CONFIG.kerugianPerJam) > 0)
06180:     ? Number(ANALITIK_CONFIG.kerugianPerJam)
06181:     : HOME_KERUGIAN_PER_JAM_RP_DEFAULT;
06182: }
06183: 
06184: /* ---------------- RBAC STATE ----------------
06185:    CURRENT_USER / PERMISSIONS / FEATURE_REGISTRY diisi dari respons login
06186:    code.gs (single source of truth). Disimpan di localStorage (bukan
06187:    sessionStorage) supaya sesi login TETAP tersimpan walau tab/file HTML
06188:    ditutup lalu dibuka lagi di browser yang sama, bukan cuma bertahan saat
06189:    refresh dalam tab yang sama. PERMISSIONS & FEATURE_REGISTRY ikut
06190:    di-cache juga (bukan cuma CURRENT_USER) supaya sesi tetap bisa langsung
06191:    dipulihkan & UI langsung unlock walau pemulihan sempat gagal terhubung
06192:    ke server saat halaman baru dibuka — lalu disegarkan lagi dari code.gs
06193:    begitu server terjangkau, supaya perubahan Role Access Management tetap
06194:    berlaku tanpa perlu logout paksa.                                       */
06195: const SS_USER_KEY = 'logbook_rbac_user';
06196: const SS_TOKEN_KEY = 'logbook_session_token';
06197: const SS_TOKEN_EXP_KEY = 'logbook_session_expires_at';
06198: const LS_PERM_KEY = 'logbook_rbac_permissions';
06199: const LS_FEATURES_KEY = 'logbook_rbac_features';
06200: const LS_ACCOUNT_CACHE_OWNER_KEY = 'omodos_account_cache_active_owner_v1';
06201: const LS_ACCOUNT_CACHE_PREFIX = 'omodos_account_cache_v1_';
06202: const ACCOUNT_CACHE_EXACT_KEYS = new Set([
06203:   'app_low_cognitive_draft_form_entry',
06204:   'logbook_pending_sync_queue',
06205:   'logbook_rca_reports',
06206:   'logbook_sparepart_status',
06207:   'logbook_sparepart_lokasi',
06208:   'logbook_sparepart_eta',
06209:   'logbook_sparepart_warehouse',
06210:   'logbook_sparepart_opname',
06211:   'logbook_kpi_kerja',
06212:   'logbook_analitik_config',
06213:   'logbook_patrol_general_items',
06214:   'logbook_patrol_category_config',
06215:   'logbook_ipal_reports',
06216:   'logbook_predictive_reports',
06217:   'logbook_general_reports',
06218:   'pi_softskill_assessments',
06219:   'pi_hardskill_assessments_v1',
~~~

### Around line 6249
~~~text
06233:   let h1=2166136261, h2=2246822519;
06234:   for(let i=0;i<text.length;i++){
06235:     const code=text.charCodeAt(i);
06236:     h1=Math.imul(h1^code,16777619);
06237:     h2=Math.imul(h2^code,3266489917);
06238:   }
06239:   return (h1>>>0).toString(36)+(h2>>>0).toString(36);
06240: }
06241: function isAccountDataCacheKey_(key){
06242:   key=String(key||'');
06243:   if(!key || key===LS_ACCOUNT_CACHE_OWNER_KEY || key.startsWith(LS_ACCOUNT_CACHE_PREFIX)) return false;
06244:   return ACCOUNT_CACHE_EXACT_KEYS.has(key) || ACCOUNT_CACHE_DYNAMIC_PREFIXES.some(prefix=>key.startsWith(prefix));
06245: }
06246: function collectAccountDataCacheKeys_(){
06247:   const keys=[];
06248:   try{
06249:     for(let i=0;i<localStorage.length;i++){
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
~~~

### Around line 6250
~~~text
06234:   for(let i=0;i<text.length;i++){
06235:     const code=text.charCodeAt(i);
06236:     h1=Math.imul(h1^code,16777619);
06237:     h2=Math.imul(h2^code,3266489917);
06238:   }
06239:   return (h1>>>0).toString(36)+(h2>>>0).toString(36);
06240: }
06241: function isAccountDataCacheKey_(key){
06242:   key=String(key||'');
06243:   if(!key || key===LS_ACCOUNT_CACHE_OWNER_KEY || key.startsWith(LS_ACCOUNT_CACHE_PREFIX)) return false;
06244:   return ACCOUNT_CACHE_EXACT_KEYS.has(key) || ACCOUNT_CACHE_DYNAMIC_PREFIXES.some(prefix=>key.startsWith(prefix));
06245: }
06246: function collectAccountDataCacheKeys_(){
06247:   const keys=[];
06248:   try{
06249:     for(let i=0;i<localStorage.length;i++){
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
~~~

### Around line 6256
~~~text
06240: }
06241: function isAccountDataCacheKey_(key){
06242:   key=String(key||'');
06243:   if(!key || key===LS_ACCOUNT_CACHE_OWNER_KEY || key.startsWith(LS_ACCOUNT_CACHE_PREFIX)) return false;
06244:   return ACCOUNT_CACHE_EXACT_KEYS.has(key) || ACCOUNT_CACHE_DYNAMIC_PREFIXES.some(prefix=>key.startsWith(prefix));
06245: }
06246: function collectAccountDataCacheKeys_(){
06247:   const keys=[];
06248:   try{
06249:     for(let i=0;i<localStorage.length;i++){
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
~~~

### Around line 6258
~~~text
06242:   key=String(key||'');
06243:   if(!key || key===LS_ACCOUNT_CACHE_OWNER_KEY || key.startsWith(LS_ACCOUNT_CACHE_PREFIX)) return false;
06244:   return ACCOUNT_CACHE_EXACT_KEYS.has(key) || ACCOUNT_CACHE_DYNAMIC_PREFIXES.some(prefix=>key.startsWith(prefix));
06245: }
06246: function collectAccountDataCacheKeys_(){
06247:   const keys=[];
06248:   try{
06249:     for(let i=0;i<localStorage.length;i++){
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
~~~

### Around line 6260
~~~text
06244:   return ACCOUNT_CACHE_EXACT_KEYS.has(key) || ACCOUNT_CACHE_DYNAMIC_PREFIXES.some(prefix=>key.startsWith(prefix));
06245: }
06246: function collectAccountDataCacheKeys_(){
06247:   const keys=[];
06248:   try{
06249:     for(let i=0;i<localStorage.length;i++){
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
~~~

### Around line 6262
~~~text
06246: function collectAccountDataCacheKeys_(){
06247:   const keys=[];
06248:   try{
06249:     for(let i=0;i<localStorage.length;i++){
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
~~~

### Around line 6266
~~~text
06250:       const key=localStorage.key(i);
06251:       if(isAccountDataCacheKey_(key)) keys.push(key);
06252:     }
06253:   }catch(e){}
06254:   return keys;
06255: }
06256: function moveLocalStorageKey_(fromKey,toKey){
06257:   let value=null;
06258:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06296:   }
06297:   return ok;
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
~~~

### Around line 6275
~~~text
06259:   if(value===null) return true;
06260:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06261:   try{
06262:     localStorage.setItem(toKey,value);
06263:     return true;
06264:   }catch(err){
06265:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06266:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06267:     return false;
06268:   }
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06296:   }
06297:   return ok;
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06300:   const ownerId=accountCacheOwnerId_(username);
06301:   if(!ownerId) return true;
06302:   let previous='';
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
~~~

### Around line 6285
~~~text
06269: }
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06296:   }
06297:   return ok;
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06300:   const ownerId=accountCacheOwnerId_(username);
06301:   if(!ownerId) return true;
06302:   let previous='';
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
~~~

### Around line 6286
~~~text
06270: function stashAccountDataCachesById_(ownerId){
06271:   ownerId=String(ownerId||'').trim();
06272:   if(!ownerId) return true;
06273:   const keys=collectAccountDataCacheKeys_();
06274:   for(const key of keys){
06275:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06276:   }
06277:   return true;
06278: }
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06296:   }
06297:   return ok;
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06300:   const ownerId=accountCacheOwnerId_(username);
06301:   if(!ownerId) return true;
06302:   let previous='';
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
~~~

### Around line 6295
~~~text
06279: function restoreAccountDataCachesById_(ownerId){
06280:   ownerId=String(ownerId||'').trim();
06281:   if(!ownerId) return true;
06282:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06283:   const scoped=[];
06284:   try{
06285:     for(let i=0;i<localStorage.length;i++){
06286:       const key=localStorage.key(i);
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06296:   }
06297:   return ok;
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06300:   const ownerId=accountCacheOwnerId_(username);
06301:   if(!ownerId) return true;
06302:   let previous='';
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
~~~

### Around line 6303
~~~text
06287:       if(key && key.startsWith(prefix)) scoped.push(key);
06288:     }
06289:   }catch(e){ return false; }
06290:   let ok=true;
06291:   for(const scopedKey of scoped){
06292:     let original='';
06293:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06294:     if(!isAccountDataCacheKey_(original)) continue;
06295:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06296:   }
06297:   return ok;
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06300:   const ownerId=accountCacheOwnerId_(username);
06301:   if(!ownerId) return true;
06302:   let previous='';
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
~~~

### Around line 6314
~~~text
06298: }
06299: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06300:   const ownerId=accountCacheOwnerId_(username);
06301:   if(!ownerId) return true;
06302:   let previous='';
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
~~~

### Around line 6319
~~~text
06303:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06304:   if(previous && previous!==ownerId){
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
~~~

### Around line 6321
~~~text
06305:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06306:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06307:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06308:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06309:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06310:   }
06311:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06312:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06313:   }
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
~~~

### Around line 6330
~~~text
06314:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06315:   return true;
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
~~~

### Around line 6332
~~~text
06316: }
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
~~~

### Around line 6333
~~~text
06317: function deactivateAccountDataCaches_(username){
06318:   let ownerId=accountCacheOwnerId_(username);
06319:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06320:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06321:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06322:   return true;
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
~~~

### Around line 6339
~~~text
06323: }
06324: let CURRENT_USER = null;        // { username, role, displayName }
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
~~~

### Around line 6341
~~~text
06325: let SESSION_TOKEN = '';
06326: let SESSION_EXPIRES_AT = '';
06327: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06328: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06329: try{
06330:   const cached = localStorage.getItem(SS_USER_KEY);
06331:   if(cached) CURRENT_USER = JSON.parse(cached);
06332:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06333:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06334:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
~~~

### Around line 6351
~~~text
06335:     CURRENT_USER = null;
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
~~~

### Around line 6352
~~~text
06336:     SESSION_TOKEN = '';
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
~~~

### Around line 6353
~~~text
06337:     SESSION_EXPIRES_AT = '';
06338:   }
06339:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06340:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06341:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06386:     return clone.textContent.replace(/\s+/g,' ').trim();
~~~

### Around line 6358
~~~text
06342:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06386:     return clone.textContent.replace(/\s+/g,' ').trim();
06387:   };
06388:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06389:     const view = btn.dataset.view;
06390:     if(!view) return;
06391:     const key = 'view.' + view;
~~~

### Around line 6359
~~~text
06343: }catch(e){}
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06386:     return clone.textContent.replace(/\s+/g,' ').trim();
06387:   };
06388:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06389:     const view = btn.dataset.view;
06390:     if(!view) return;
06391:     const key = 'view.' + view;
06392:     if(seen.has(key)) return;
~~~

### Around line 6360
~~~text
06344: try{
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06386:     return clone.textContent.replace(/\s+/g,' ').trim();
06387:   };
06388:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06389:     const view = btn.dataset.view;
06390:     if(!view) return;
06391:     const key = 'view.' + view;
06392:     if(seen.has(key)) return;
06393:     seen.add(key);
~~~

### Around line 6361
~~~text
06345:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06386:     return clone.textContent.replace(/\s+/g,' ').trim();
06387:   };
06388:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06389:     const view = btn.dataset.view;
06390:     if(!view) return;
06391:     const key = 'view.' + view;
06392:     if(seen.has(key)) return;
06393:     seen.add(key);
06394:     const groupEl = btn.closest('.nav-group-collapsible');
~~~

### Around line 6362
~~~text
06346: }catch(e){
06347:   CURRENT_USER = null;
06348:   SESSION_TOKEN = '';
06349:   SESSION_EXPIRES_AT = '';
06350:   try{
06351:     localStorage.removeItem(SS_USER_KEY);
06352:     localStorage.removeItem(SS_TOKEN_KEY);
06353:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06354:   }catch(clearErr){}
06355: }
06356: function cacheRbacSession_(){
06357:   try{
06358:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06359:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06360:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06361:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06362:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06363:   }catch(e){}
06364: }
06365: 
06366: function hasPermission(permissionKey){
06367:   if(!CURRENT_USER) return false;
06368:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06369:   const p = PERMISSIONS[permissionKey];
06370:   return !!(p && p[CURRENT_USER.role]);
06371: }
06372: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06373: 
06374: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06375: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06376: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06377: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06378: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06379: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06380: function discoverFeatureRegistryFromDom(){
06381:   const seen = new Set();
06382:   const list = [];
06383:   const labelOf = (btn)=>{
06384:     const clone = btn.cloneNode(true);
06385:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06386:     return clone.textContent.replace(/\s+/g,' ').trim();
06387:   };
06388:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06389:     const view = btn.dataset.view;
06390:     if(!view) return;
06391:     const key = 'view.' + view;
06392:     if(seen.has(key)) return;
06393:     seen.add(key);
06394:     const groupEl = btn.closest('.nav-group-collapsible');
06395:     let group = 'Umum';
~~~

### Around line 7253
~~~text
07237:     const verified = await Promise.all(verifyCalls);
07238:     const savedPermissions = verified[0] || {};
07239:     const savedLc = Object.keys(lcUpdates).length ? (verified[1] || {}) : (window.LC_PERMISSIONS || {});
07240: 
07241:     if(!matrixMatches(updates, savedPermissions)){
07242:       const diff = matrixDiff(updates, savedPermissions);
07243:       throw new Error('Verifikasi fresh Role_Permissions gagal: '+diff.slice(0,6).join('; ')+(diff.length>6?` (+${diff.length-6} lainnya)`:''));
07244:     }
07245:     if(Object.keys(lcUpdates).length && !matrixMatches(lcUpdates, savedLc)){
07246:       const diff = matrixDiff(lcUpdates, savedLc);
07247:       throw new Error('Verifikasi fresh Tampilan Sederhana gagal: '+diff.slice(0,6).join('; ')+(diff.length>6?` (+${diff.length-6} lainnya)`:''));
07248:     }
07249: 
07250:     PERMISSIONS = savedPermissions;
07251:     if(mainRes && mainRes.features && mainRes.features.length) FEATURE_REGISTRY = mergeFeatureRegistry(mainRes.features);
07252:     window.LC_PERMISSIONS = savedLc;
07253:     try{ localStorage.setItem('logbook_lc_permissions', JSON.stringify(savedLc)); }catch(e){}
07254:     cacheRbacSession_();
07255:     statusEl.textContent = 'Tersimpan & terverifikasi dari database SQLite.';
07256:     toast('Perubahan Role Access berhasil disimpan dan dibaca ulang dari database SQLite.');
07257:     applyRbacToUi();
07258:     return true;
07259:   }catch(err){
07260:     const raw = (err && err.message) ? err.message : String(err || 'Gagal menyimpan perubahan akses.');
07261:     let hint = '';
07262:     if(/UNKNOWN_ACTION|Action tidak terdaftar|METHOD_NOT_ALLOWED/i.test(raw)){
07263:       hint = ' Backend /exec yang aktif belum memakai Code.gs terbaru. Deploy > Manage deployments > Edit > pilih New version, lalu Deploy.';
07264:     }else if(/Backend mengirim halaman HTML|Unexpected token.*</i.test(raw)){
07265:       hint = ' Deployment Web App kemungkinan meminta login Google. Untuk frontend GitHub Pages, deploy Cloudflare sebagai Web App yang dieksekusi sebagai pemilik/deployer dan dapat diakses Anyone.';
07266:     }else if(/Failed to fetch|NetworkError|Load failed|CORS/i.test(raw)){
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
07284: 
07285: let SPAREPART_STATUS = {}; // {entryId: 'DONE' | 'PENDING'} — status validasi collect admin gudang
07286: 
~~~

### Around line 7459
~~~text
07443:    Theme Manager). THEME_REGISTRY adalah single source daftar tema —
07444:    menambah tema baru cukup menambah satu entri di sini + token CSS
07445:    `html[data-theme="key"]{...}` yang bersangkutan (lihat <style> di
07446:    <head>), otomatis muncul sebagai card di Theme Manager tanpa ubah
07447:    markup lain. `swatch` hanya dipakai untuk thumbnail preview kartu. */
07448: const LS_THEME_KEY = 'app_theme';
07449: // Semua tema di bawah ini memenuhi WCAG 2.2 level AA (kontras teks >= 4.5:1,
07450: // kontras komponen UI/aksen >= 3:1 terhadap latar). Lihat token CSS
07451: // `html[data-theme="key"]{...}` di <head> untuk nilai warna masing-masing.
07452: const THEME_REGISTRY = [
07453:   { key:'omodos',           label:'Clean (Default)',                 desc:'Tema default brand OMODOS — terang, bersih, tanpa efek glow.', swatch:['#eef0f3','#ffffff','#7c1420'] },
07454:   { key:'red-black',        label:'Dark',                            desc:'Tema gelap kontras tinggi, nyaman untuk kerja malam hari.',    swatch:['#08090b','#1a1d21','#ff5566'] },
07455:   { key:'abu-profesional',  label:'Professional',                    desc:'Terang netral abu-abu, gaya dashboard korporat.',             swatch:['#eef0f2','#ffffff','#1a4fa0'] }
07456: ];
07457: 
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
07475:   const holder = $('#theme-manager-grid');
07476:   if(!holder) return;
07477:   const current = document.documentElement.getAttribute('data-theme') || 'omodos';
07478:   holder.innerHTML = THEME_REGISTRY.map(t => `
07479:     <div class="theme-card ${t.key===current?'active':''}" data-theme-key="${t.key}" title="${escapeHtml(t.desc)}">
07480:       <div class="theme-thumb">${t.swatch.map(c=>`<span style="background:${c};"></span>`).join('')}</div>
07481:       <div class="theme-name">${escapeHtml(t.label)}</div>
07482:       <div class="theme-desc">${escapeHtml(t.desc)}</div>
07483:       <div class="theme-active-badge"><i class="ph-bold ph-check"></i></div>
07484:     </div>
07485:   `).join('');
07486:   $$('.theme-card', holder).forEach(card => card.addEventListener('click', ()=> setAppTheme(card.dataset.themeKey)));
07487: }
07488: renderThemeManager();
07489: 
07490: /* ---------------- STYLE MANAGER ("Gaya Tampilan Aplikasi") ----------------
07491:    Terpisah total dari THEME_REGISTRY di atas. THEME_REGISTRY = palet WARNA
07492:    (html[data-theme]). STYLE_REGISTRY = BENTUK seluruh komponen aplikasi
~~~

### Around line 7464
~~~text
07448: const LS_THEME_KEY = 'app_theme';
07449: // Semua tema di bawah ini memenuhi WCAG 2.2 level AA (kontras teks >= 4.5:1,
07450: // kontras komponen UI/aksen >= 3:1 terhadap latar). Lihat token CSS
07451: // `html[data-theme="key"]{...}` di <head> untuk nilai warna masing-masing.
07452: const THEME_REGISTRY = [
07453:   { key:'omodos',           label:'Clean (Default)',                 desc:'Tema default brand OMODOS — terang, bersih, tanpa efek glow.', swatch:['#eef0f3','#ffffff','#7c1420'] },
07454:   { key:'red-black',        label:'Dark',                            desc:'Tema gelap kontras tinggi, nyaman untuk kerja malam hari.',    swatch:['#08090b','#1a1d21','#ff5566'] },
07455:   { key:'abu-profesional',  label:'Professional',                    desc:'Terang netral abu-abu, gaya dashboard korporat.',             swatch:['#eef0f2','#ffffff','#1a4fa0'] }
07456: ];
07457: 
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
07475:   const holder = $('#theme-manager-grid');
07476:   if(!holder) return;
07477:   const current = document.documentElement.getAttribute('data-theme') || 'omodos';
07478:   holder.innerHTML = THEME_REGISTRY.map(t => `
07479:     <div class="theme-card ${t.key===current?'active':''}" data-theme-key="${t.key}" title="${escapeHtml(t.desc)}">
07480:       <div class="theme-thumb">${t.swatch.map(c=>`<span style="background:${c};"></span>`).join('')}</div>
07481:       <div class="theme-name">${escapeHtml(t.label)}</div>
07482:       <div class="theme-desc">${escapeHtml(t.desc)}</div>
07483:       <div class="theme-active-badge"><i class="ph-bold ph-check"></i></div>
07484:     </div>
07485:   `).join('');
07486:   $$('.theme-card', holder).forEach(card => card.addEventListener('click', ()=> setAppTheme(card.dataset.themeKey)));
07487: }
07488: renderThemeManager();
07489: 
07490: /* ---------------- STYLE MANAGER ("Gaya Tampilan Aplikasi") ----------------
07491:    Terpisah total dari THEME_REGISTRY di atas. THEME_REGISTRY = palet WARNA
07492:    (html[data-theme]). STYLE_REGISTRY = BENTUK seluruh komponen aplikasi
07493:    (html[data-style]) — sudut card/tombol/input/badge, font, ketebalan
07494:    border, bayangan, tekstur latar, bentuk sidebar, dst (lihat CSS
07495:    `html[data-style="key"]{...}` di <head>). Kedua pilihan independen dan
07496:    bisa dikombinasikan bebas: pilih gaya apa pun tetap memakai palet warna
07497:    yang sedang aktif dari Theme Manager. 'klasik' = tampilan default
~~~

### Around line 7511
~~~text
07495:    `html[data-style="key"]{...}` di <head>). Kedua pilihan independen dan
07496:    bisa dikombinasikan bebas: pilih gaya apa pun tetap memakai palet warna
07497:    yang sedang aktif dari Theme Manager. 'klasik' = tampilan default
07498:    aplikasi saat ini (tanpa atribut data-style / tanpa override bentuk). */
07499: const LS_STYLE_KEY = 'app_style';
07500: const STYLE_REGISTRY = [
07501:   { key:'klasik',          label:'Klasik (Default)',      desc:'Tampilan bawaan aplikasi saat ini, tanpa perubahan bentuk.',              icon:'ph-square' },
07502:   { key:'holographic',     label:'Holographic',           desc:'Border gradient warna-warni bergerak, efek kilau hologram.',                icon:'ph-rainbow' },
07503:   { key:'minimalis',       label:'Minimalis',             desc:'Flat, tanpa bayangan/dekorasi, fokus ke konten.',                          icon:'ph-square-half' },
07504:   { key:'elegan-korporat', label:'Elegant Corporate',     desc:'Font serif pada judul, garis tipis rapi, kesan formal & tenang.',          icon:'ph-briefcase' },
07505:   { key:'low-cognitive',   label:'Tampilan Sederhana',         desc:'Sederhanakan tampilan: teks lebih besar, tanpa animasi, satu kolom.',      icon:'ph-brain' }
07506: ];
07507: function setAppStyle(style, opts={}){
07508:   if(style === 'low-cognitive'){
07509:     document.documentElement.removeAttribute('data-style');
07510:     setLowCognitiveMode(true, opts);
07511:     localStorage.setItem(LS_STYLE_KEY, style);
07512:     renderStyleManagerActiveState_();
07513:     return;
07514:   }
07515:   if(document.body.classList.contains('low-cognitive')){
07516:     setLowCognitiveMode(false, { announce:false });
07517:   }
07518:   if(style === 'klasik'){ document.documentElement.removeAttribute('data-style'); }
07519:   else{ document.documentElement.setAttribute('data-style', style); }
07520:   localStorage.setItem(LS_STYLE_KEY, style);
07521:   renderStyleManagerActiveState_();
07522:   if(opts.persist !== false && CURRENT_USER && WEB_APP_URL){
07523:     apiPost({ action:'saveStylePref', actor: CURRENT_USER.username, style }).catch(()=>{});
07524:   }
07525: }
07526: function renderStyleManagerActiveState_(){
07527:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07528:   $$('.style-card').forEach(c => c.classList.toggle('active', c.dataset.styleKey === current));
07529: }
07530: function renderStyleManager(){
07531:   const holder = $('#style-manager-grid');
07532:   if(!holder) return;
07533:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07534:   holder.innerHTML = STYLE_REGISTRY.map(s => `
07535:     <div class="style-card ${s.key===current?'active':''}" data-style-key="${s.key}" title="${escapeHtml(s.desc)}">
07536:       <div class="style-thumb"><i class="ph-bold ${s.icon}"></i></div>
07537:       <div class="style-name">${escapeHtml(s.label)}</div>
07538:       <div class="style-desc">${escapeHtml(s.desc)}</div>
07539:       <div class="style-active-badge"><i class="ph-bold ph-check"></i></div>
07540:     </div>
07541:   `).join('');
07542:   $$('.style-card', holder).forEach(card => card.addEventListener('click', ()=> setAppStyle(card.dataset.styleKey)));
07543: }
07544: renderStyleManager();
~~~

### Around line 7520
~~~text
07504:   { key:'elegan-korporat', label:'Elegant Corporate',     desc:'Font serif pada judul, garis tipis rapi, kesan formal & tenang.',          icon:'ph-briefcase' },
07505:   { key:'low-cognitive',   label:'Tampilan Sederhana',         desc:'Sederhanakan tampilan: teks lebih besar, tanpa animasi, satu kolom.',      icon:'ph-brain' }
07506: ];
07507: function setAppStyle(style, opts={}){
07508:   if(style === 'low-cognitive'){
07509:     document.documentElement.removeAttribute('data-style');
07510:     setLowCognitiveMode(true, opts);
07511:     localStorage.setItem(LS_STYLE_KEY, style);
07512:     renderStyleManagerActiveState_();
07513:     return;
07514:   }
07515:   if(document.body.classList.contains('low-cognitive')){
07516:     setLowCognitiveMode(false, { announce:false });
07517:   }
07518:   if(style === 'klasik'){ document.documentElement.removeAttribute('data-style'); }
07519:   else{ document.documentElement.setAttribute('data-style', style); }
07520:   localStorage.setItem(LS_STYLE_KEY, style);
07521:   renderStyleManagerActiveState_();
07522:   if(opts.persist !== false && CURRENT_USER && WEB_APP_URL){
07523:     apiPost({ action:'saveStylePref', actor: CURRENT_USER.username, style }).catch(()=>{});
07524:   }
07525: }
07526: function renderStyleManagerActiveState_(){
07527:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07528:   $$('.style-card').forEach(c => c.classList.toggle('active', c.dataset.styleKey === current));
07529: }
07530: function renderStyleManager(){
07531:   const holder = $('#style-manager-grid');
07532:   if(!holder) return;
07533:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07534:   holder.innerHTML = STYLE_REGISTRY.map(s => `
07535:     <div class="style-card ${s.key===current?'active':''}" data-style-key="${s.key}" title="${escapeHtml(s.desc)}">
07536:       <div class="style-thumb"><i class="ph-bold ${s.icon}"></i></div>
07537:       <div class="style-name">${escapeHtml(s.label)}</div>
07538:       <div class="style-desc">${escapeHtml(s.desc)}</div>
07539:       <div class="style-active-badge"><i class="ph-bold ph-check"></i></div>
07540:     </div>
07541:   `).join('');
07542:   $$('.style-card', holder).forEach(card => card.addEventListener('click', ()=> setAppStyle(card.dataset.styleKey)));
07543: }
07544: renderStyleManager();
07545: 
07546: /* ---------------- LOW COGNITIVE MODE ----------------
07547:    Fitur ini murni presentational (CSS class body.low-cognitive +
07548:    atribut [data-lc-hide] pada markup) — tidak menyentuh struktur
07549:    data, LocalStorage key lain, atau logika bisnis manapun. State
07550:    ON/OFF disimpan sendiri di key `app_low_cognitive`. Ada dua titik
07551:    kontrol yang saling sinkron: switch di halaman Settings dan
07552:    quick-toggle ikon otak di topbar. */
07553: const LS_LOW_COGNITIVE_KEY = 'app_low_cognitive';
~~~

### Around line 7549
~~~text
07533:   const current = document.body.classList.contains('low-cognitive') ? 'low-cognitive' : (document.documentElement.getAttribute('data-style') || 'klasik');
07534:   holder.innerHTML = STYLE_REGISTRY.map(s => `
07535:     <div class="style-card ${s.key===current?'active':''}" data-style-key="${s.key}" title="${escapeHtml(s.desc)}">
07536:       <div class="style-thumb"><i class="ph-bold ${s.icon}"></i></div>
07537:       <div class="style-name">${escapeHtml(s.label)}</div>
07538:       <div class="style-desc">${escapeHtml(s.desc)}</div>
07539:       <div class="style-active-badge"><i class="ph-bold ph-check"></i></div>
07540:     </div>
07541:   `).join('');
07542:   $$('.style-card', holder).forEach(card => card.addEventListener('click', ()=> setAppStyle(card.dataset.styleKey)));
07543: }
07544: renderStyleManager();
07545: 
07546: /* ---------------- LOW COGNITIVE MODE ----------------
07547:    Fitur ini murni presentational (CSS class body.low-cognitive +
07548:    atribut [data-lc-hide] pada markup) — tidak menyentuh struktur
07549:    data, LocalStorage key lain, atau logika bisnis manapun. State
07550:    ON/OFF disimpan sendiri di key `app_low_cognitive`. Ada dua titik
07551:    kontrol yang saling sinkron: switch di halaman Settings dan
07552:    quick-toggle ikon otak di topbar. */
07553: const LS_LOW_COGNITIVE_KEY = 'app_low_cognitive';
07554: 
07555: function isLowCognitiveActive(){
07556:   try{ return localStorage.getItem(LS_LOW_COGNITIVE_KEY) === '1'; }catch(e){ return false; }
07557: }
07558: 
07559: function setLowCognitiveMode(on, opts={}){
07560:   document.body.classList.toggle('low-cognitive', !!on);
07561:   try{ localStorage.setItem(LS_LOW_COGNITIVE_KEY, on ? '1' : '0'); }catch(e){}
07562: 
07563:   const chk = $('#lc-mode-toggle');
07564:   if(chk) chk.checked = !!on;
07565:   const lbl = $('#lc-mode-toggle-label');
07566:   if(lbl) lbl.textContent = on ? 'Aktif' : 'Nonaktif';
07567:   const quickBtn = $('#btn-lc-quick-toggle');
07568:   if(quickBtn){
07569:     quickBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
07570:     quickBtn.setAttribute('aria-label', on ? 'Matikan Tampilan Sederhana' : 'Aktifkan Tampilan Sederhana');
07571:   }
07572:   if(on){
07573:     initLowCognitiveWizard();
07574:     lcWizardGoToStep(0);
07575:   }else{
07576:     // Mode dimatikan -> lepas juga filter "Fokus Utama" di Dashboard supaya
07577:     // tidak ada state tersembunyi yang membingungkan saat kembali ke tampilan normal.
07578:     setLcPriorityOnly(false);
07579:   }
07580:   if(opts.announce !== false) toast(on ? 'Tampilan Sederhana aktif' : 'Tampilan Sederhana nonaktif');
07581: }
07582: 
~~~

### Around line 7556
~~~text
07540:     </div>
07541:   `).join('');
07542:   $$('.style-card', holder).forEach(card => card.addEventListener('click', ()=> setAppStyle(card.dataset.styleKey)));
07543: }
07544: renderStyleManager();
07545: 
07546: /* ---------------- LOW COGNITIVE MODE ----------------
07547:    Fitur ini murni presentational (CSS class body.low-cognitive +
07548:    atribut [data-lc-hide] pada markup) — tidak menyentuh struktur
07549:    data, LocalStorage key lain, atau logika bisnis manapun. State
07550:    ON/OFF disimpan sendiri di key `app_low_cognitive`. Ada dua titik
07551:    kontrol yang saling sinkron: switch di halaman Settings dan
07552:    quick-toggle ikon otak di topbar. */
07553: const LS_LOW_COGNITIVE_KEY = 'app_low_cognitive';
07554: 
07555: function isLowCognitiveActive(){
07556:   try{ return localStorage.getItem(LS_LOW_COGNITIVE_KEY) === '1'; }catch(e){ return false; }
07557: }
07558: 
07559: function setLowCognitiveMode(on, opts={}){
07560:   document.body.classList.toggle('low-cognitive', !!on);
07561:   try{ localStorage.setItem(LS_LOW_COGNITIVE_KEY, on ? '1' : '0'); }catch(e){}
07562: 
07563:   const chk = $('#lc-mode-toggle');
07564:   if(chk) chk.checked = !!on;
07565:   const lbl = $('#lc-mode-toggle-label');
07566:   if(lbl) lbl.textContent = on ? 'Aktif' : 'Nonaktif';
07567:   const quickBtn = $('#btn-lc-quick-toggle');
07568:   if(quickBtn){
07569:     quickBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
07570:     quickBtn.setAttribute('aria-label', on ? 'Matikan Tampilan Sederhana' : 'Aktifkan Tampilan Sederhana');
07571:   }
07572:   if(on){
07573:     initLowCognitiveWizard();
07574:     lcWizardGoToStep(0);
07575:   }else{
07576:     // Mode dimatikan -> lepas juga filter "Fokus Utama" di Dashboard supaya
07577:     // tidak ada state tersembunyi yang membingungkan saat kembali ke tampilan normal.
07578:     setLcPriorityOnly(false);
07579:   }
07580:   if(opts.announce !== false) toast(on ? 'Tampilan Sederhana aktif' : 'Tampilan Sederhana nonaktif');
07581: }
07582: 
07583: /* ---- Wizard step-by-step untuk form Input Logbook (hanya aktif secara
07584:    visual saat body.low-cognitive; struktur data form / FormData tidak
07585:    berubah sama sekali karena hanya membungkus elemen yang sudah ada ke
07586:    dalam <div class="lc-step"> tanpa mengubah name/id apapun). ---- */
07587: let LC_WIZARD_STEPS = [];
07588: let LC_WIZARD_INDEX = 0;
07589: 
~~~

## workers.dev — 1
### Around line 5409
~~~text
05393:           <button class="setting-tab-btn" data-tab="users"><i class="ph-bold ph-users"></i> User Management</button>
05394:           <button class="setting-tab-btn" data-tab="roles"><i class="ph-bold ph-shield-check"></i> Role Access</button>
05395:           <button class="setting-tab-btn" data-tab="mesin"><i class="ph-bold ph-gear-six"></i> Mesin</button>
05396:           <button class="setting-tab-btn" data-tab="patrol-template"><i class="ph-bold ph-list-checks"></i> Template Patrol</button>
05397:           <button class="setting-tab-btn" data-tab="patrol-kategori"><i class="ph-bold ph-toggle-right"></i> Kategori Patrol</button>
05398:           <button class="setting-tab-btn" data-tab="personil"><i class="ph-bold ph-users-three"></i> Personil</button>
05399:           <button class="setting-tab-btn" data-tab="formula"><i class="ph-bold ph-function"></i> Formula</button>
05400:           
05401:         </div>
05402:       </div>
05403: 
05404:       <!-- TAB: KONEKSI -->
05405:       <div class="setting-tab-panel active" id="setting-tab-panel-koneksi">
05406:         <div class="card" style="margin-bottom:18px;">
05407:           <div class="section-title"><i class="ph-bold ph-link"></i> URL Web App (Cloudflare)</div>
05408:           <div class="field">
05409:             <input type="text" id="input-webapp-url" placeholder="https://nama-aplikasi.workers.dev/api">
05410:           </div>
05411:           <button class="btn btn-primary btn-sm" id="btn-save-url">Simpan &amp; Hubungkan</button>
05412:           <span id="conn-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
05413:           <div class="sub" style="margin-top:10px;">Tempel URL dari deployment <code>/exec</code> Cloudflare. URL ini disimpan lokal di browser (localStorage) karena dibutuhkan untuk koneksi awal. Setelah simpan, semua setting lain di tab ini akan tersimpan di database SQLite.<br><br><b>Semua tab lain (Mesin, Personil, Patrol, Formula, Sparepart) 100% tersimpan di database SQLite</b>, bukan hanya lokal. Cek di Spreadsheet kamu akan muncul sheet baru: <code>Analitik_Config</code>, <code>Patrol_Category_Config</code>, <code>Patrol_General_Checklist</code>.</div>
05414:         </div>
05415:       </div>
05416: 
05417:       <!-- TAB: USER MANAGEMENT -->
05418:       <div class="setting-tab-panel" id="setting-tab-panel-users">
05419:         <div id="rbac-admin-section"></div>
05420:         <div class="setting-tab-empty" id="rbac-empty-hint" style="display:none;">Memuat data user... Jika tetap kosong, pastikan kamu login sebagai Superadmin.</div>
05421:       </div>
05422: 
05423:       <!-- TAB: ROLE ACCESS MANAGEMENT -->
05424:       <div class="setting-tab-panel" id="setting-tab-panel-roles">
05425:         <div id="rbac-role-section"></div>
05426:       </div>
05427: 
05428:       <!-- TAB: MESIN -->
05429:       <div class="setting-tab-panel" id="setting-tab-panel-mesin">
05430:         <div class="card" style="margin-bottom:18px;">
05431:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Mesin Baru</div>
05432:           <div class="grid3">
05433:             <div class="field"><label>Kode Mesin</label><input type="text" id="new-kode-mesin" placeholder="OFU-1"></div>
05434:             <div class="field"><label>Nama Mesin</label><input type="text" id="new-nama-mesin" placeholder="Offset Machine #5"></div>
05435:           </div>
05436:           <div class="grid3">
05437:             <div class="field"><label>Model</label><input type="text" id="new-model-mesin" placeholder="cth: CD 102-8+L"></div>
05438:             <div class="field"><label>Kategori</label><input type="text" id="new-kategori-mesin" placeholder="A - Offset Printing"></div>
05439:             <div class="field"><label>Lokasi/Area</label><input type="text" id="new-lokasi-mesin" placeholder="cth: Ruang Cetak Offset"></div>
05440:           </div>
05441:           <div class="field"><label>Nama Mesin (Deskripsi Lengkap)</label><input type="text" id="new-deskripsi-mesin" placeholder="cth: OFFSET UV INK - 5 MACHINE + INLINE INS"></div>
05442:           <div class="field"><label>Fungsi Mesin (Bahasa Indonesia)</label><textarea id="new-fungsi-mesin" rows="3" placeholder="Jelaskan fungsi mesin ini secara singkat."></textarea></div>
~~~

## nama-aplikasi.workers.dev/api — 1
## URL Web App — 6
### Around line 5407
~~~text
05391:         <div class="setting-tabs" id="setting-tabs">
05392:           <button class="setting-tab-btn active" data-tab="koneksi"><i class="ph-bold ph-link"></i> Koneksi</button>
05393:           <button class="setting-tab-btn" data-tab="users"><i class="ph-bold ph-users"></i> User Management</button>
05394:           <button class="setting-tab-btn" data-tab="roles"><i class="ph-bold ph-shield-check"></i> Role Access</button>
05395:           <button class="setting-tab-btn" data-tab="mesin"><i class="ph-bold ph-gear-six"></i> Mesin</button>
05396:           <button class="setting-tab-btn" data-tab="patrol-template"><i class="ph-bold ph-list-checks"></i> Template Patrol</button>
05397:           <button class="setting-tab-btn" data-tab="patrol-kategori"><i class="ph-bold ph-toggle-right"></i> Kategori Patrol</button>
05398:           <button class="setting-tab-btn" data-tab="personil"><i class="ph-bold ph-users-three"></i> Personil</button>
05399:           <button class="setting-tab-btn" data-tab="formula"><i class="ph-bold ph-function"></i> Formula</button>
05400:           
05401:         </div>
05402:       </div>
05403: 
05404:       <!-- TAB: KONEKSI -->
05405:       <div class="setting-tab-panel active" id="setting-tab-panel-koneksi">
05406:         <div class="card" style="margin-bottom:18px;">
05407:           <div class="section-title"><i class="ph-bold ph-link"></i> URL Web App (Cloudflare)</div>
05408:           <div class="field">
05409:             <input type="text" id="input-webapp-url" placeholder="https://nama-aplikasi.workers.dev/api">
05410:           </div>
05411:           <button class="btn btn-primary btn-sm" id="btn-save-url">Simpan &amp; Hubungkan</button>
05412:           <span id="conn-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
05413:           <div class="sub" style="margin-top:10px;">Tempel URL dari deployment <code>/exec</code> Cloudflare. URL ini disimpan lokal di browser (localStorage) karena dibutuhkan untuk koneksi awal. Setelah simpan, semua setting lain di tab ini akan tersimpan di database SQLite.<br><br><b>Semua tab lain (Mesin, Personil, Patrol, Formula, Sparepart) 100% tersimpan di database SQLite</b>, bukan hanya lokal. Cek di Spreadsheet kamu akan muncul sheet baru: <code>Analitik_Config</code>, <code>Patrol_Category_Config</code>, <code>Patrol_General_Checklist</code>.</div>
05414:         </div>
05415:       </div>
05416: 
05417:       <!-- TAB: USER MANAGEMENT -->
05418:       <div class="setting-tab-panel" id="setting-tab-panel-users">
05419:         <div id="rbac-admin-section"></div>
05420:         <div class="setting-tab-empty" id="rbac-empty-hint" style="display:none;">Memuat data user... Jika tetap kosong, pastikan kamu login sebagai Superadmin.</div>
05421:       </div>
05422: 
05423:       <!-- TAB: ROLE ACCESS MANAGEMENT -->
05424:       <div class="setting-tab-panel" id="setting-tab-panel-roles">
05425:         <div id="rbac-role-section"></div>
05426:       </div>
05427: 
05428:       <!-- TAB: MESIN -->
05429:       <div class="setting-tab-panel" id="setting-tab-panel-mesin">
05430:         <div class="card" style="margin-bottom:18px;">
05431:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Mesin Baru</div>
05432:           <div class="grid3">
05433:             <div class="field"><label>Kode Mesin</label><input type="text" id="new-kode-mesin" placeholder="OFU-1"></div>
05434:             <div class="field"><label>Nama Mesin</label><input type="text" id="new-nama-mesin" placeholder="Offset Machine #5"></div>
05435:           </div>
05436:           <div class="grid3">
05437:             <div class="field"><label>Model</label><input type="text" id="new-model-mesin" placeholder="cth: CD 102-8+L"></div>
05438:             <div class="field"><label>Kategori</label><input type="text" id="new-kategori-mesin" placeholder="A - Offset Printing"></div>
05439:             <div class="field"><label>Lokasi/Area</label><input type="text" id="new-lokasi-mesin" placeholder="cth: Ruang Cetak Offset"></div>
05440:           </div>
~~~

### Around line 6648
~~~text
06632:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06633:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06634:     <div style="margin-top:16px;display:flex;gap:10px;">
06635:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06636:     </div>
06637:   `;
06638:   $('#modal-bg').classList.add('active');
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
06678:       if(onSuccess) onSuccess();
06679:     }catch(err){
06680:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06681:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
~~~

### Around line 8155
~~~text
08139: }
08140: 
08141: window.addEventListener('online', ()=> setAppOnlineStatus(true));
08142: window.addEventListener('offline', ()=> setAppOnlineStatus(false));
08143: // Polling berkala jaga-jaga: browser kadang telat memicu event 'online', atau
08144: // koneksi "menyala" tapi sebenarnya tidak bisa menjangkau Web App-nya.
08145: setInterval(()=>{ if(navigator.onLine) flushSyncQueue_(); }, 60000); // PATCHED 60s
08146: renderOfflineBanner();
08147: 
08148: /* ---------------- CONFIG BANNER ---------------- */
08149: function renderConfigBanner(){
08150:   const holder = $('#config-banner-holder');
08151:   if(WEB_APP_URL){ holder.innerHTML = ''; return; }
08152:   holder.innerHTML = `
08153:     <div class="config-banner">
08154:       ⚠️ <b>Belum terhubung ke database SQLite.</b> Buka menu <b>Master Mesin &amp; Koneksi</b> di sidebar,
08155:       lalu tempelkan URL Web App dari Cloudflare (lihat <code>PANDUAN_SETUP.md</code>).
08156:     </div>`;
08157: }
08158: 
08159: /* ---------------- NAVIGATION ---------------- */
08160: function handleViewRenderError_(view, label, err){
08161:   const msg = err && err.message ? err.message : String(err || 'Error tidak diketahui');
08162:   console.error('[OMODOS] Gagal render view:', {view, label, error:err});
08163:   try{ if(typeof copilotLogError === 'function') copilotLogError('Render '+view+': '+msg, label||''); }catch(e){}
08164:   toast('Gagal memuat '+(label||view)+': '+msg, true);
08165: }
08166: function invokeViewRenderer_(view, renderer, label){
08167:   try{
08168:     const result = renderer();
08169:     if(result && typeof result.then === 'function'){
08170:       result.catch(err=>handleViewRenderError_(view,label,err));
08171:     }
08172:     return result;
08173:   }catch(err){
08174:     handleViewRenderError_(view,label,err);
08175:     return null;
08176:   }
08177: }
08178: function switchToView(enteringView){
08179:   enteringView = String(enteringView||'').trim();
08180:   if(!enteringView){ toast('Tujuan halaman tidak valid.', true); return false; }
08181:   if(typeof canAccessView_ === 'function' && !canAccessView_(enteringView)){
08182:     showAccessDenied();
08183:     return false;
08184:   }
08185:   const enteringViewEl = document.getElementById('view-' + enteringView);
08186:   if(!enteringViewEl){
08187:     console.error('[OMODOS] View target tidak ditemukan:', enteringView);
08188:     toast('Halaman "' + enteringView + '" belum tersedia. Muat ulang aplikasi lalu coba lagi.', true);
~~~

### Around line 17749
~~~text
17733:     toast('Gagal menyimpan: ' + err.message, true);
17734:   }finally{
17735:     btn.disabled = false; btn.innerHTML = '<i class="ph-bold ph-check-circle"></i> Simpan Logbook';
17736:   }
17737: });
17738: 
17739: /* ---------------- SETTING VIEW: KONEKSI & MASTER MESIN ---------------- */
17740: $('#input-webapp-url').value = WEB_APP_URL; $('#input-webapp-url').readOnly = true;
17741: function updateConnStatus(){
17742:   $('#conn-status').textContent = WEB_APP_URL ? '● Tersambung' : '○ Belum tersambung';
17743:   $('#conn-status').style.color = WEB_APP_URL ? 'var(--green)' : 'var(--text-dim)';
17744: }
17745: updateConnStatus();
17746: 
17747: $('#btn-save-url').addEventListener('click', async ()=>{
17748:   const val = DEFAULT_WEB_APP_URL; $('#input-webapp-url').value = val;
17749:   if(!val){ toast('Masukkan URL Web App terlebih dahulu.', true); return; }
17750:   WEB_APP_URL = val;
17751:   localStorage.setItem(LS_URL_KEY, val);
17752:   updateConnStatus();
17753:   toast('Menghubungkan...');
17754:   await loadAll();
17755:   renderMachineTable();
17756:   populatePctMachineSelect();
17757:   toast('Berhasil terhubung ke database SQLite ✓');
17758: });
17759: 
17760: let PENDING_MANUAL_PDF = null; // {name, mimeType, base64}
17761: const inputManualPdf = $('#new-manual-pdf');
17762: if(inputManualPdf){
17763:   inputManualPdf.addEventListener('change', async (ev)=>{
17764:     const file = ev.target.files && ev.target.files[0];
17765:     const previewEl = $('#manual-pdf-preview');
17766:     PENDING_MANUAL_PDF = null;
17767:     if(!file){ previewEl.innerHTML = ''; return; }
17768:     if(file.type !== 'application/pdf'){
17769:       toast('File Manual Book harus berformat PDF.', true);
17770:       ev.target.value = '';
17771:       previewEl.innerHTML = '';
17772:       return;
17773:     }
17774:     previewEl.innerHTML = `Membaca "${escapeHtml(file.name)}"...`;
17775:     const reader = new FileReader();
17776:     reader.onload = ()=>{
17777:       const base64 = reader.result.split(',')[1];
17778:       PENDING_MANUAL_PDF = { name: file.name, mimeType: 'application/pdf', base64 };
17779:       const kb = (file.size/1024).toFixed(0);
17780:       previewEl.innerHTML = `<i class="ph-bold ph-file-pdf" style="color:#ff6b76;"></i> "${escapeHtml(file.name)}" siap diunggah (${kb} KB)`;
17781:     };
17782:     reader.onerror = ()=>{ toast('Gagal membaca file PDF.', true); previewEl.innerHTML = ''; };
~~~

### Around line 19005
~~~text
18989:   }catch(err){
18990:     showBackendUnavailable(err.message);
18991:   }
18992: }
18993: 
18994: function runAiAnalysis(){
18995:   const contextHolder = $('#ai-result-context');
18996:   const backendHolder = $('#ai-result-backend');
18997:   const localHolder = $('#ai-result-local');
18998:   try{
18999:     const query = $('#ai-query').value.trim();
19000:     if(!query){ contextHolder.innerHTML=''; backendHolder.innerHTML=''; localHolder.innerHTML=''; return; }
19001: 
19002:     if(!WEB_APP_URL){
19003:       contextHolder.innerHTML = '';
19004:       localHolder.innerHTML = '';
19005:       backendHolder.innerHTML = `<div class="empty-state"><div class="ico"><i class="ph-bold ph-notebook"></i></div>Aplikasi belum terhubung ke database SQLite. Buka menu "Master Mesin & Koneksi" lalu sambungkan URL Web App terlebih dahulu.</div>`;
19006:       return;
19007:     }
19008: 
19009:     const mesinFilter = $('#ai-filter-mesin').value;
19010:     const groupFilter = $('#ai-filter-group').value;
19011:     const spesifikasi = ($('#ai-spesifikasi').value || '').trim();
19012: 
19013:     const {matches, anchorMachine} = computeAiMatches(query, mesinFilter, groupFilter);
19014:     renderAiContext(query, matches, anchorMachine);
19015: 
19016:     const localRecs = computeLocalRecommendations(matches);
19017:     renderLocalAiSection(query, matches, localRecs);
19018: 
19019:     runBackendAnalysis(query, matches, localRecs, spesifikasi);
19020:   }catch(err){
19021:     console.error('AI analyze error:', err);
19022:     backendHolder.innerHTML = `<div class="empty-state"><div class="ico">⚠️</div>Terjadi kesalahan saat menganalisa: ${escapeHtml(err.message)}</div>`;
19023:   }
19024: }
19025: 
19026: function renderAiView(){
19027:   populateAiFilters();
19028: }
19029: 
19030: function resetAiView(){
19031:   const q = $('#ai-query'); if(q) q.value = '';
19032:   const sp = $('#ai-spesifikasi'); if(sp) sp.value = '';
19033:   const fm = $('#ai-filter-mesin'); if(fm) fm.value = '';
19034:   const fg = $('#ai-filter-group'); if(fg) fg.value = '';
19035:   const st = $('#ai-status'); if(st) st.textContent = '';
19036:   const ctx = $('#ai-result-context'); if(ctx) ctx.innerHTML = '';
19037:   const bk = $('#ai-result-backend'); if(bk) bk.innerHTML = '';
19038:   const lc = $('#ai-result-local'); if(lc) lc.innerHTML = '';
~~~

### Around line 20964
~~~text
20948:    hardcode di frontend. code.gs mengembalikan role & permission matrix
20949:    yang lalu dipakai applyRbacToUi() untuk merender menu sesuai izin. */
20950: (function initLoginGate(){
20951:   const gate = document.getElementById('login-gate');
20952:   const appRoot = document.getElementById('app-root');
20953:   const form = document.getElementById('form-login');
20954:   const errEl = document.getElementById('login-err');
20955:   const submitBtn = document.getElementById('btn-login-submit');
20956: 
20957:   form.addEventListener('submit', async function(e){
20958:     e.preventDefault();
20959:     const u = document.getElementById('login-username').value.trim();
20960:     const p = document.getElementById('login-password').value;
20961:     errEl.textContent = '';
20962: 
20963:     if(!WEB_APP_URL){
20964:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App). Hubungi Superadmin untuk konfigurasi awal.';
20965:       return;
20966:     }
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
20984:         return;
20985:       }
20986:       if(!json.sessionToken){
20987:         throw new Error('Backend Cloudflare masih versi lama. Deploy ulang FinalOMODOSRilis.gs terbaru, lalu gunakan URL /exec deployment tersebut.');
20988:       }
20989:       invalidatePreparedReads_();
20990:       activateAccountDataCaches_(json.user&&json.user.username,{claimExisting:false});
20991:       CURRENT_USER = json.user;
20992:       SESSION_TOKEN = json.sessionToken || '';
20993:       SESSION_EXPIRES_AT = json.expiresAt || '';
20994:       PERMISSIONS = json.permissions || {};
20995:       // Gabungkan daftar dari backend dengan hasil scan DOM sidebar saat ini,
20996:       // supaya menu apa pun (baru/lama, terdaftar di code.gs atau tidak)
20997:       // SELALU tergate oleh Role Access Management — tidak ada yang lolos
~~~

