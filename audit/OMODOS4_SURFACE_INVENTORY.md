# OMODOS 4 Surface Inventory

## OMODOS 4.0 — 1
- L8333: // TypeError pada switchToView(). OMODOS 4.0 memakai switchToView langsung

## omodos4.view — 0

## Command Center — 0

## Machine Intelligence — 0

## Predictive Intelligence — 0

## Smart Field — 0

## Sparepart Intelligence — 0

## Reliability & Loss — 0

## Operation Intelligence — 0

## People Intelligence 4.0 — 0

## AI Intelligence — 0

## Improvement Intelligence — 0

## Factory Brain — 0

## Maintenance War Room — 0

## War Room — 1
- L4215: <div><h1>Digital War Room</h1><div class="sub">Semua angka dihitung otomatis dari data Logbook (real-time), termasuk MTTR, MTBF, downtime, availability, dan Pareto 80/20 penyebab kerusakan.</div></div>

## Time Machine — 0

## What Changed — 0

## Machine Health Passport — 0

## Failure Memory — 0

## Ask OMODOS — 0

## Role_Permissions — 14
- L6971: let RBAC_ROLE_PERMISSIONS_DRAFT={};
- L6998: const features=groups[groupName], allowed=features.filter(f=>RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey]?.[role]).length;
- L7007: const key=f.PermissionKey, p=RBAC_ROLE_PERMISSIONS_DRAFT[key]||{}, lc=RBAC_LC_PERMISSIONS_DRAFT[key]||{};
- L7018: const key=e.target.dataset.permkey; if(RBAC_ROLE_PERMISSIONS_DRAFT[key]) RBAC_ROLE_PERMISSIONS_DRAFT[key][RBAC_SELECTED_ROLE]=!!e.target.checked;
- L7026: RBAC_ROLE_FEATURES.filter(f=>String(f.Group||'Umum')===group).forEach(f=>{ if(RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey]) RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey][RBAC_SELECTED_ROLE]=value; });
- L7033: const allowed=RBAC_ROLE_FEATURES.filter(f=>RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey]?.[RBAC_SELECTED_ROLE]).length;
- L7067: RBAC_ROLE_PERMISSIONS_DRAFT=cloneRoleMatrix_(PERMISSIONS,RBAC_ROLE_FEATURES);
- L7079: const updates = JSON.parse(JSON.stringify(RBAC_ROLE_PERMISSIONS_DRAFT||{}));
- L7110: let stage = 'menyimpan Role Access (Role_Permissions + Tampilan Sederhana)';
- L7115: // Role_Permissions di database SQLite sudah berubah walau UI melaporkan
- L7121: // atomik untuk ini (saveRoleAccessConfig_, menulis Role_Permissions +
- L7139: throw new Error('Verifikasi langsung Role_Permissions gagal: '+directDiff.slice(0,6).join('; ')+(directDiff.length>6?` (+${directDiff.length-6} lainnya)`:''));
- L7163: throw new Error('Verifikasi fresh Role_Permissions gagal: '+diff.slice(0,6).join('; ')+(diff.length>6?` (+${diff.length-6} lainnya)`:''));
- L25437: // [FIX] Kalau penyimpanan akses UTAMA (Role_Permissions/Feature

## Feature_Registry — 21
- L6108: CURRENT_USER / PERMISSIONS / FEATURE_REGISTRY diisi dari respons login
- L6112: refresh dalam tab yang sama. PERMISSIONS & FEATURE_REGISTRY ikut
- L6251: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
- L6265: if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
- L6285: localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
- L6299: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
- L6413: const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
- L6481: const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
- L7063: FEATURE_REGISTRY=mergeFeatureRegistry(featuresRaw);
- L7066: RBAC_ROLE_FEATURES=FEATURE_REGISTRY.slice().sort((a,b)=>String(a.Group||'').localeCompare(String(b.Group||''))||String(a.Label||'').localeCompare(String(b.Label||'')));
- L7104: const featuresPayload = (FEATURE_REGISTRY || [])
- L7171: if(mainRes && mainRes.features && mainRes.features.length) FEATURE_REGISTRY = mergeFeatureRegistry(mainRes.features);
- L7890: // [FIX ROOT CAUSE] Sebelumnya PERMISSIONS/FEATURE_REGISTRY di akun yang
- L7908: FEATURE_REGISTRY = mergeFeatureRegistry(features || []);
- L7949: FEATURE_REGISTRY = [];
- L8311: const knownFeature = FEATURE_REGISTRY.some(f => f.PermissionKey === permKey);
- L8380: const known = FEATURE_REGISTRY.some(f=>f.PermissionKey===key);
- L20896: FEATURE_REGISTRY = (typeof window.mergeFeatureRegistry === 'function')
- L25348: if(typeof FEATURE_REGISTRY === 'undefined' || !Array.isArray(FEATURE_REGISTRY)) return;
- L25356: FEATURE_REGISTRY.forEach(f=>{
- L27781: const known = FEATURE_REGISTRY && FEATURE_REGISTRY.some(f=>f.PermissionKey===key);

## RBAC_ROLE_FEATURES — 9
- L6970: let RBAC_ROLE_FEATURES=[];
- L6989: RBAC_ROLE_FEATURES.forEach(f=>{
- L7026: RBAC_ROLE_FEATURES.filter(f=>String(f.Group||'Umum')===group).forEach(f=>{ if(RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey]) RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey][RBAC_SELECTED_ROLE]=value; });
- L7032: const total=RBAC_ROLE_FEATURES.length;
- L7033: const allowed=RBAC_ROLE_FEATURES.filter(f=>RBAC_ROLE_PERMISSIONS_DRAFT[f.PermissionKey]?.[RBAC_SELECTED_ROLE]).length;
- L7038: const groups=[...new Set(RBAC_ROLE_FEATURES.map(f=>String(f.Group||'Umum')))].sort((a,b)=>a.localeCompare(b));
- L7066: RBAC_ROLE_FEATURES=FEATURE_REGISTRY.slice().sort((a,b)=>String(a.Group||'').localeCompare(String(b.Group||''))||String(a.Label||'').localeCompare(String(b.Label||'')));
- L7067: RBAC_ROLE_PERMISSIONS_DRAFT=cloneRoleMatrix_(PERMISSIONS,RBAC_ROLE_FEATURES);
- L7068: RBAC_LC_PERMISSIONS_DRAFT=cloneRoleMatrix_(window.LC_PERMISSIONS,RBAC_ROLE_FEATURES);

## canAccessView_ — 8
- L8101: if(typeof canAccessView_ === 'function' && !canAccessView_(enteringView)){
- L8305: function canAccessView_(view){
- L8315: return (views||[]).some(v=>canAccessView_(v));
- L8327: if(!canAccessView_(view)){
- L18159: const canPatrolDetail=canAccessView_('patrol');
- L18218: if(!canAccessView_('patrol')){ showAccessDenied(); return; }
- L18956: if(CURRENT_USER && typeof canAccessView_==='function' && !canAccessView_('patrol')){
- L19124: const full = (typeof canAccessView_==='function' && canAccessView_('patrol') && Array.isArray(PM_REPORTS)) ? PM_REPORTS : [];

## applyRbacToNavigation_ — 0

## CURRENT_USER.role — 6
- L6291: if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
- L6293: return !!(p && p[CURRENT_USER.role]);
- L6295: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
- L6487: userBadge.innerHTML = `<i class="ph-bold ph-user-circle"></i> ${escapeHtml(CURRENT_USER.displayName || CURRENT_USER.username)} <span style="opacity:.65;">(${escapeHtml(CURRENT_USER.role)})</span>`;
- L25316: if(CURRENT_USER.role === 'Superadmin') return false; // Superadmin selalu full, sama seperti RBAC akses biasa
- L25318: return !!(p && p[CURRENT_USER.role]);

## Unique data-view inventory
- ${enteringView} — L8121
- ${view} — L25034
- analitik — L4164
- corrective-report — L3340
- correlation — L4168
- dashboard — L3323
- database — L3382
- diagnostic — L4172
- downtime — L4192
- durasi — L4176
- energy-cost-toe — L3370
- energy-utility — L3354
- expert-finder — L4184
- input — L3329
- insights-hub — L3359
- knowledge — L4180
- knowledge-graph — L4188
- kpi-department — L3365
- kpi-input — L3366
- machine-breakdown — L3367
- meeting — L3739
- patrol — L3338
- people-hub — L3375
- pi-dashboard — L3719
- pi-hardskill — L3735
- pi-personnel — L3723
- pi-smart-resume — L3727
- pi-softskill — L3731
- project-center — L3337
- record-ytd — L3368
- report — L3347
- run-hour-comparison — L3369
- setting — L3384
- sparepart — L3339
- tema — L3383
- utama — L3330
- wiki — L4196

Total unique views: 37

