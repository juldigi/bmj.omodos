# Production Login Path Audit

## Respon backend bukan JSON valid — 0 hit(s)
## response backend — 0 hit(s)
## login — 139 hit(s)
### Around line 183
~~~text
00173:   display:none !important;
00174: }
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
00192: }
00193: .theme-card{
00194:   position:relative; border:1px solid var(--line); border-radius:var(--radius);
00195:   background:var(--panel-2); padding:12px; cursor:pointer; transition:var(--trans);
00196:   display:flex; flex-direction:column; gap:10px;
00197: }
00198: .theme-card:hover{ border-color:var(--red); transform:translateY(-2px); }
00199: .theme-card.active{ border-color:var(--red); box-shadow:0 0 0 2px var(--red-glow); }
00200: .theme-card .theme-thumb{
00201:   height:64px; border-radius:8px; overflow:hidden; display:flex; border:1px solid var(--line-soft);
00202: }
00203: .theme-card .theme-thumb span{ flex:1; height:100%; }
00204: .theme-card .theme-name{ font-family:var(--font-display); font-weight:700; font-size:14px; color:var(--text); }
~~~

### Around line 251
~~~text
00241: }
00242: html:not([data-theme="red-black"]) .btn-primary:hover{
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
00260:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00261: }
00262: 
00263: /* ===================================================================
00264:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00265:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00266:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00267:    karena tidak dipakai lagi.
00268:    =================================================================== */
00269: 
00270: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00271:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00272: html[data-theme="omodos"]{
~~~

### Around line 254
~~~text
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
00260:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00261: }
00262: 
00263: /* ===================================================================
00264:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00265:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00266:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00267:    karena tidak dipakai lagi.
00268:    =================================================================== */
00269: 
00270: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00271:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00272: html[data-theme="omodos"]{
00273:   --bg:#eef0f3; --bg-grid:#e4e7eb; --panel:#ffffff; --panel-2:#f6f7f9;
00274:   --panel-glass:rgba(255,255,255,.9); --line:#dfe2e7; --line-soft:#ebedf0;
00275:   --text:#12141a; --text-dim:#5b6472;
~~~

### Around line 255
~~~text
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
00260:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00261: }
00262: 
00263: /* ===================================================================
00264:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00265:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00266:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00267:    karena tidak dipakai lagi.
00268:    =================================================================== */
00269: 
00270: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00271:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00272: html[data-theme="omodos"]{
00273:   --bg:#eef0f3; --bg-grid:#e4e7eb; --panel:#ffffff; --panel-2:#f6f7f9;
00274:   --panel-glass:rgba(255,255,255,.9); --line:#dfe2e7; --line-soft:#ebedf0;
00275:   --text:#12141a; --text-dim:#5b6472;
00276:   --red:#7c1420; --red-dim:#f0d5d8; --red-glow:rgba(124,20,32,.14);
~~~

### Around line 258
~~~text
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
00264:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00265:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00266:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00267:    karena tidak dipakai lagi.
00268:    =================================================================== */
00269: 
00270: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00271:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00272: html[data-theme="omodos"]{
00273:   --bg:#eef0f3; --bg-grid:#e4e7eb; --panel:#ffffff; --panel-2:#f6f7f9;
00274:   --panel-glass:rgba(255,255,255,.9); --line:#dfe2e7; --line-soft:#ebedf0;
00275:   --text:#12141a; --text-dim:#5b6472;
00276:   --red:#7c1420; --red-dim:#f0d5d8; --red-glow:rgba(124,20,32,.14);
00277:   --amber:#8a5a00; --amber-dim:#f0ddb0; --green:#146c43; --green-dim:#c9e8d7;
00278:   --blue:#00AEEF; --holo-2:#8a3a34; --holo-3:#5c130d;
00279:   --focus-ring:#0b5fae;
~~~

### Around line 323
~~~text
00313:    `[class*="pill"]`, `[class*="box"]` dipakai supaya efek bentuk
00314:    menjangkau SELURUH modul aplikasi (Logbook, Report, Analitik, People
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
00343: html[data-style="holographic"] .btn{ border-radius:12px !important; }
00344: html[data-style="holographic"] input, html[data-style="holographic"] select, html[data-style="holographic"] textarea{ border-radius:10px !important; }
~~~

### Around line 334
~~~text
00324: html[data-style] .btn,
00325: html[data-style] input, html[data-style] select, html[data-style] textarea{
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
00343: html[data-style="holographic"] .btn{ border-radius:12px !important; }
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
~~~

### Around line 352
~~~text
00342: @keyframes styleHoloShift{ 0%{background-position:0 0, 0% 50%;} 100%{background-position:0 0, 200% 50%;} }
00343: html[data-style="holographic"] .btn{ border-radius:12px !important; }
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
00361: html[data-style="minimalis"] .brand .mark{ animation:none !important; box-shadow:none; }
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
~~~

### Around line 370
~~~text
00360: html[data-style="minimalis"] .sidebar{ background:var(--panel) !important; backdrop-filter:none !important; box-shadow:none; }
00361: html[data-style="minimalis"] .brand .mark{ animation:none !important; box-shadow:none; }
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
00379: html[data-style="elegan-korporat"] .topbar h1{ font-weight:700; letter-spacing:.2px; text-transform:none; }
00380: html[data-style="elegan-korporat"] .section-title{ font-weight:700; letter-spacing:.2px; }
00381: 
00382: /* ---------- Style Manager card grid (mirip Theme Manager) ---------- */
00383: .style-manager-grid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(200px,1fr)); gap:12px; }
00384: .style-card{
00385:   background:var(--panel-2); border:1px solid var(--line); border-radius:12px;
00386:   padding:14px; cursor:pointer; transition:.15s; position:relative;
00387: }
00388: .style-card:hover{ border-color:var(--red); transform:translateY(-2px); }
00389: .style-card.active{ border-color:var(--red); box-shadow:0 0 0 2px var(--red-glow); }
00390: .style-card .style-thumb{
00391:   height:44px; border-radius:8px; margin-bottom:10px; border:1px solid var(--line);
~~~

### Around line 2358
~~~text
02348: .card:hover::before{opacity:1;}
02349: .section-title{position:relative;}
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
~~~

### Around line 2370
~~~text
02360:   display:flex;align-items:center;justify-content:center;
02361:   background:
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
02379: }
02380: @keyframes loginGlow{0%,100%{opacity:.5;}50%{opacity:1;}}
02381: .login-box{
02382:   position:relative;width:100%;max-width:380px;
02383:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
02384:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02385:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02386:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02387:   text-align:center;
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
~~~

### Around line 2375
~~~text
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
02379: }
02380: @keyframes loginGlow{0%,100%{opacity:.5;}50%{opacity:1;}}
02381: .login-box{
02382:   position:relative;width:100%;max-width:380px;
02383:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
02384:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02385:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02386:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02387:   text-align:center;
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
~~~

### Around line 2378
~~~text
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
02384:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02385:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02386:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02387:   text-align:center;
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02397: }
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
~~~

### Around line 2380
~~~text
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
02384:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02385:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02386:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02387:   text-align:center;
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02397: }
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
~~~

### Around line 2381
~~~text
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
02384:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02385:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02386:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02387:   text-align:center;
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02397: }
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
~~~

### Around line 2393
~~~text
02383:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
02384:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02385:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02386:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02387:   text-align:center;
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02397: }
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
~~~

### Around line 2398
~~~text
02388: }
02389: @keyframes holoBorderPulse{
02390:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02391:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02397: }
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
~~~

### Around line 2402
~~~text
02392: }
02393: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02394:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02395:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02396:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02397: }
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
~~~

### Around line 2408
~~~text
02398: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
02424: .omodos-logo{
02425:   background:none !important;box-shadow:none !important;clip-path:none !important;
02426:   border-radius:0 !important;animation:none !important;
02427:   display:flex !important;align-items:center;justify-content:center;
02428: }
02429: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
~~~

### Around line 2409
~~~text
02399:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
02424: .omodos-logo{
02425:   background:none !important;box-shadow:none !important;clip-path:none !important;
02426:   border-radius:0 !important;animation:none !important;
02427:   display:flex !important;align-items:center;justify-content:center;
02428: }
02429: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02430:   background:none !important;color:inherit !important;
~~~

### Around line 2410
~~~text
02400:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
02424: .omodos-logo{
02425:   background:none !important;box-shadow:none !important;clip-path:none !important;
02426:   border-radius:0 !important;animation:none !important;
02427:   display:flex !important;align-items:center;justify-content:center;
02428: }
02429: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02430:   background:none !important;color:inherit !important;
02431: }
~~~

### Around line 2411
~~~text
02401:   animation:hexSpinCounter 10s linear infinite;}
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
02424: .omodos-logo{
02425:   background:none !important;box-shadow:none !important;clip-path:none !important;
02426:   border-radius:0 !important;animation:none !important;
02427:   display:flex !important;align-items:center;justify-content:center;
02428: }
02429: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02430:   background:none !important;color:inherit !important;
02431: }
02432: .omodos-logo span{display:none !important;}
~~~

### Around line 2412
~~~text
02402: .login-box h1{
02403:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02404:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
02424: .omodos-logo{
02425:   background:none !important;box-shadow:none !important;clip-path:none !important;
02426:   border-radius:0 !important;animation:none !important;
02427:   display:flex !important;align-items:center;justify-content:center;
02428: }
02429: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02430:   background:none !important;color:inherit !important;
02431: }
02432: .omodos-logo span{display:none !important;}
02433: .omodos-logo-svg{width:100%;height:100%;display:block;}
~~~

### Around line 2415
~~~text
02405:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02406:   text-transform:uppercase;
02407: }
02408: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02409: .login-box .field{text-align:left;margin-bottom:16px;}
02410: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02411: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02412: .login-box .login-err{
02413:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02414: }
02415: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02416: 
02417: /* =====================================================================
02418:    OMODOS BRAND IDENTITY
02419:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02420:    and stay consistent regardless of the active color theme / visual
02421:    style, so all the shape/animation rules that other themes apply to
02422:    .mark / .i40-hex are neutralized here with !important.
02423:    ===================================================================== */
02424: .omodos-logo{
02425:   background:none !important;box-shadow:none !important;clip-path:none !important;
02426:   border-radius:0 !important;animation:none !important;
02427:   display:flex !important;align-items:center;justify-content:center;
02428: }
02429: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02430:   background:none !important;color:inherit !important;
02431: }
02432: .omodos-logo span{display:none !important;}
02433: .omodos-logo-svg{width:100%;height:100%;display:block;}
02434: .brand .mark.omodos-logo{width:38px;height:38px;}
02435: .i40-banner .i40-hex.omodos-logo{width:50px;height:50px;}
02436: 
~~~

### Around line 2449
~~~text
02439:    kontras di atas latar gelap/abu. */
02440: html[data-theme="red-black"] .omodos-logo{
02441:   border-radius:50% !important;
02442:   border:none !important;
02443:   box-shadow:
02444:     0 0 0 1px rgba(255,255,255,.9),
02445:     inset 0 0 0 1px rgba(255,255,255,.9) !important;
02446:   box-sizing:border-box;
02447: }
02448: 
02449: .login-box .omodos-logo{width:76px;height:76px;margin:0 auto 14px auto;}
02450: .login-box .omodos-wordmark{
02451:   font-family:var(--font-brand);font-size:26px;font-weight:800;letter-spacing:6px;
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
~~~

### Around line 2450
~~~text
02440: html[data-theme="red-black"] .omodos-logo{
02441:   border-radius:50% !important;
02442:   border:none !important;
02443:   box-shadow:
02444:     0 0 0 1px rgba(255,255,255,.9),
02445:     inset 0 0 0 1px rgba(255,255,255,.9) !important;
02446:   box-sizing:border-box;
02447: }
02448: 
02449: .login-box .omodos-logo{width:76px;height:76px;margin:0 auto 14px auto;}
02450: .login-box .omodos-wordmark{
02451:   font-family:var(--font-brand);font-size:26px;font-weight:800;letter-spacing:6px;
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
~~~

### Around line 2455
~~~text
02445:     inset 0 0 0 1px rgba(255,255,255,.9) !important;
02446:   box-sizing:border-box;
02447: }
02448: 
02449: .login-box .omodos-logo{width:76px;height:76px;margin:0 auto 14px auto;}
02450: .login-box .omodos-wordmark{
02451:   font-family:var(--font-brand);font-size:26px;font-weight:800;letter-spacing:6px;
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
02472:      (omodos/abu-profesional) latar splash tidak sinkron dengan tema aktif
02473:      dan logo jadi kurang kontras. Sekarang ikut var(--bg)/var(--text) tema
02474:      aktif, sama seperti seluruh halaman lain, supaya "DNA" splash selalu
02475:      senada dengan tema yang sedang dipakai. Kontras logo otomatis ikut
02476:      benar juga, karena rule cincin putih di .omodos-logo (utk tema gelap
~~~

### Around line 2459
~~~text
02449: .login-box .omodos-logo{width:76px;height:76px;margin:0 auto 14px auto;}
02450: .login-box .omodos-wordmark{
02451:   font-family:var(--font-brand);font-size:26px;font-weight:800;letter-spacing:6px;
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
02472:      (omodos/abu-profesional) latar splash tidak sinkron dengan tema aktif
02473:      dan logo jadi kurang kontras. Sekarang ikut var(--bg)/var(--text) tema
02474:      aktif, sama seperti seluruh halaman lain, supaya "DNA" splash selalu
02475:      senada dengan tema yang sedang dipakai. Kontras logo otomatis ikut
02476:      benar juga, karena rule cincin putih di .omodos-logo (utk tema gelap
02477:      red-black) berlaku global ke elemen ini juga. */
02478:   background:var(--bg, #0d0f14);
02479:   opacity:0; transition:opacity 320ms ease, background-color var(--trans, 220ms);
02480: }
~~~

### Around line 2460
~~~text
02450: .login-box .omodos-wordmark{
02451:   font-family:var(--font-brand);font-size:26px;font-weight:800;letter-spacing:6px;
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
02472:      (omodos/abu-profesional) latar splash tidak sinkron dengan tema aktif
02473:      dan logo jadi kurang kontras. Sekarang ikut var(--bg)/var(--text) tema
02474:      aktif, sama seperti seluruh halaman lain, supaya "DNA" splash selalu
02475:      senada dengan tema yang sedang dipakai. Kontras logo otomatis ikut
02476:      benar juga, karena rule cincin putih di .omodos-logo (utk tema gelap
02477:      red-black) berlaku global ke elemen ini juga. */
02478:   background:var(--bg, #0d0f14);
02479:   opacity:0; transition:opacity 320ms ease, background-color var(--trans, 220ms);
02480: }
02481: #app-splash.show{ display:flex; }
~~~

### Around line 2461
~~~text
02451:   font-family:var(--font-brand);font-size:26px;font-weight:800;letter-spacing:6px;
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
02472:      (omodos/abu-profesional) latar splash tidak sinkron dengan tema aktif
02473:      dan logo jadi kurang kontras. Sekarang ikut var(--bg)/var(--text) tema
02474:      aktif, sama seperti seluruh halaman lain, supaya "DNA" splash selalu
02475:      senada dengan tema yang sedang dipakai. Kontras logo otomatis ikut
02476:      benar juga, karena rule cincin putih di .omodos-logo (utk tema gelap
02477:      red-black) berlaku global ke elemen ini juga. */
02478:   background:var(--bg, #0d0f14);
02479:   opacity:0; transition:opacity 320ms ease, background-color var(--trans, 220ms);
02480: }
02481: #app-splash.show{ display:flex; }
02482: #app-splash.visible{ opacity:1; }
~~~

### Around line 2462
~~~text
02452:   margin:0 0 10px 0;color:#12141a;background:none;-webkit-text-fill-color:currentColor;
02453:   animation:none;text-transform:uppercase;
02454: }
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
02472:      (omodos/abu-profesional) latar splash tidak sinkron dengan tema aktif
02473:      dan logo jadi kurang kontras. Sekarang ikut var(--bg)/var(--text) tema
02474:      aktif, sama seperti seluruh halaman lain, supaya "DNA" splash selalu
02475:      senada dengan tema yang sedang dipakai. Kontras logo otomatis ikut
02476:      benar juga, karena rule cincin putih di .omodos-logo (utk tema gelap
02477:      red-black) berlaku global ke elemen ini juga. */
02478:   background:var(--bg, #0d0f14);
02479:   opacity:0; transition:opacity 320ms ease, background-color var(--trans, 220ms);
02480: }
02481: #app-splash.show{ display:flex; }
02482: #app-splash.visible{ opacity:1; }
02483: .app-splash-box{ text-align:center; padding:20px; }
~~~

### Around line 2465
~~~text
02455: .login-box .omodos-tagline{
02456:   font-size:11px;letter-spacing:1px;color:#12141a;font-family:var(--font-mono);
02457:   text-transform:uppercase;margin-bottom:18px;
02458: }
02459: .login-box .omodos-tagline b{font-weight:800;}
02460: .login-box .omodos-tagline .c-blue{color:#00AEEF;}
02461: .login-box .omodos-tagline .c-pink{color:#EC008C;}
02462: .login-box .omodos-tagline .c-amber{color:#E0A400;}
02463: 
02464: /* ---------------- APP SPLASH SCREEN ----------------
02465:    Ditampilkan setelah login berhasil, SEBELUM Home muncul, sambil seluruh
02466:    data aplikasi (loadAll) disiapkan di belakang layar. Tujuannya supaya
02467:    pengguna tidak melihat Home dalam kondisi kosong/setengah termuat. */
02468: #app-splash{
02469:   position:fixed; inset:0; z-index:9999;
02470:   display:none; align-items:center; justify-content:center;
02471:   /* [FIX] Dulu hardcode #0d0f14 (selalu gelap) sehingga di tema terang
02472:      (omodos/abu-profesional) latar splash tidak sinkron dengan tema aktif
02473:      dan logo jadi kurang kontras. Sekarang ikut var(--bg)/var(--text) tema
02474:      aktif, sama seperti seluruh halaman lain, supaya "DNA" splash selalu
02475:      senada dengan tema yang sedang dipakai. Kontras logo otomatis ikut
02476:      benar juga, karena rule cincin putih di .omodos-logo (utk tema gelap
02477:      red-black) berlaku global ke elemen ini juga. */
02478:   background:var(--bg, #0d0f14);
02479:   opacity:0; transition:opacity 320ms ease, background-color var(--trans, 220ms);
02480: }
02481: #app-splash.show{ display:flex; }
02482: #app-splash.visible{ opacity:1; }
02483: .app-splash-box{ text-align:center; padding:20px; }
02484: .app-splash-box .omodos-logo{ width:72px; height:72px; margin:0 auto 18px auto; animation:appSplashPulse 1.8s ease-in-out infinite; }
02485: @keyframes appSplashPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.06);opacity:.85;}}
02486: .app-splash-spinner{ font-size:22px; color:var(--blue, #00AEEF); margin-bottom:14px; }
~~~

### Around line 2499
~~~text
02489:   font-weight:700; letter-spacing:.4px; margin-bottom:8px;
02490: }
02491: .app-splash-sub{
02492:   font-family:var(--font-mono, inherit); color:var(--text-dim, #8b93a0); font-size:11.5px;
02493:   letter-spacing:.3px;
02494: }
02495: .omodos-divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
02496: .omodos-divider span{flex:1;height:1px;background:rgba(0,0,0,.18);}
02497: .omodos-divider i{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.35);flex-shrink:0;}
02498: 
02499: /* Login screen: fixed light brand splash, independent of the active
02500:    dark/alternate theme, matching the OMODOS identity artwork. */
02501: #login-gate{
02502:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02503:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02504: }
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
~~~

### Around line 2501
~~~text
02491: .app-splash-sub{
02492:   font-family:var(--font-mono, inherit); color:var(--text-dim, #8b93a0); font-size:11.5px;
02493:   letter-spacing:.3px;
02494: }
02495: .omodos-divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
02496: .omodos-divider span{flex:1;height:1px;background:rgba(0,0,0,.18);}
02497: .omodos-divider i{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.35);flex-shrink:0;}
02498: 
02499: /* Login screen: fixed light brand splash, independent of the active
02500:    dark/alternate theme, matching the OMODOS identity artwork. */
02501: #login-gate{
02502:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02503:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02504: }
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
~~~

### Around line 2505
~~~text
02495: .omodos-divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
02496: .omodos-divider span{flex:1;height:1px;background:rgba(0,0,0,.18);}
02497: .omodos-divider i{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.35);flex-shrink:0;}
02498: 
02499: /* Login screen: fixed light brand splash, independent of the active
02500:    dark/alternate theme, matching the OMODOS identity artwork. */
02501: #login-gate{
02502:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02503:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02504: }
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
~~~

### Around line 2506
~~~text
02496: .omodos-divider span{flex:1;height:1px;background:rgba(0,0,0,.18);}
02497: .omodos-divider i{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.35);flex-shrink:0;}
02498: 
02499: /* Login screen: fixed light brand splash, independent of the active
02500:    dark/alternate theme, matching the OMODOS identity artwork. */
02501: #login-gate{
02502:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02503:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02504: }
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
~~~

### Around line 2511
~~~text
02501: #login-gate{
02502:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02503:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02504: }
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
~~~

### Around line 2514
~~~text
02504: }
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
02533: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02534: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02535: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
~~~

### Around line 2515
~~~text
02505: #login-gate::before,#login-gate::after{display:none !important;}
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
02533: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02534: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02535: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02536: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
~~~

### Around line 2516
~~~text
02506: .login-box{
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
02533: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02534: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02535: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02536: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
02537: .rca-why-list li{margin-bottom:4px;font-size:13.5px;}
~~~

### Around line 2517
~~~text
02507:   border:1px solid #e4e6ea !important;
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
02533: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02534: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02535: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02536: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
02537: .rca-why-list li{margin-bottom:4px;font-size:13.5px;}
02538: .btn-why-remove{
~~~

### Around line 2518
~~~text
02508:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
02533: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02534: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02535: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02536: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
02537: .rca-why-list li{margin-bottom:4px;font-size:13.5px;}
02538: .btn-why-remove{
02539:   display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;
~~~

### Around line 2519
~~~text
02509:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02510: }
02511: .login-box .sub-title{
02512:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02513: }
02514: .login-box .field label{color:#12141a;}
02515: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02516: .login-box input::placeholder{color:#9aa1ab;}
02517: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02518: .login-box .btn-primary:hover{background:#5f0f18;}
02519: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02520: .app{display:none;}
02521: .app.unlocked{display:grid;}
02522: .rca-doc-title{
02523:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02524:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02525: }
02526: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02527: .rca-section:first-child{margin-top:16px;}
02528: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02529: .rca-section-heading{
02530:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02531:   padding:2px 4px;border-radius:5px;flex:1;
02532: }
02533: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02534: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02535: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02536: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
02537: .rca-why-list li{margin-bottom:4px;font-size:13.5px;}
02538: .btn-why-remove{
02539:   display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;
02540:   border:1px solid var(--line);background:var(--panel-2);color:var(--text-dim);cursor:pointer;font-size:9px;
~~~

### Around line 3279
~~~text
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
~~~

### Around line 3280
~~~text
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
~~~

### Around line 3294
~~~text
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
~~~

### Around line 3297
~~~text
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
~~~

### Around line 3301
~~~text
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
~~~

### Around line 3303
~~~text
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
~~~

### Around line 3306
~~~text
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

### Around line 3308
~~~text
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
03328: 
03329: <div class="app" id="app-root">
~~~

### Around line 5420
~~~text
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
~~~

### Around line 5559
~~~text
05549:             estimasi kerugian finansial dari Total Lost Time 24 jam terakhir.
05550:           </div>
05551:           <button class="btn btn-sm btn-primary" id="btn-save-analitik-config">Simpan Formula</button>
05552:           <span id="analitik-config-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
05553:         </div>
05554:       </div>
05555: 
05556:       </section>
05557: 
05558:     <!-- [THEME MANAGER] Dipindah keluar dari Master Koneksi menjadi menu
05559:          mandiri (data-view="tema") supaya bisa diakses tanpa perlu login
05560:          ulang Master Koneksi. Satu-satunya tempat pengelolaan seluruh tema
05561:          aplikasi. Dirender dinamis lewat renderThemeManager() dari
05562:          THEME_REGISTRY (lihat kode skrip di bawah) supaya menambah tema
05563:          baru cukup menambah satu entri registry. -->
05564:     <section class="view" id="view-tema">
05565:       <div class="topbar"><div><h1>Tema Aplikasi</h1><div class="sub">Atur tampilan visual aplikasi: pilih tema warna dan Tampilan Sederhana.</div></div></div>
05566:       <div class="card" style="margin-bottom:18px;">
05567:         <div class="section-title"><i class="ph-bold ph-palette"></i> Theme Manager</div>
05568:         <div class="sub" style="margin-bottom:14px;">Pilih tema tampilan aplikasi. Klik salah satu kartu untuk langsung menerapkan tema ke seluruh halaman tanpa reload. Tema aktif ditandai dengan indikator centang &amp; disimpan otomatis ke akun Anda.</div>
05569:         <div class="theme-manager-grid" id="theme-manager-grid"></div>
05570:       </div>
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
~~~

### Around line 5585
~~~text
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
~~~

### Around line 6018
~~~text
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
~~~

### Around line 6139
~~~text
06129: }
06130: // Gabungkan sebuah timestamp cutoff lain (mis. rolling 90 hari) dengan
06131: // SOT_CUTOFF_DATE, ambil yang PALING BARU (paling ketat) di antara
06132: // keduanya -- supaya jendela waktu manapun yang dipakai suatu fitur tidak
06133: // pernah mundur sampai menyentuh data historis OneNote yang belum tervalidasi.
06134: function clampToSot(cutoffMs){
06135:   return Math.max(cutoffMs, SOT_CUTOFF_DATE.getTime());
06136: }
06137: 
06138: /* Promise loadAll() awal (dipicu saat halaman baru dibuka, terlepas dari
06139:    status login). Dipakai supaya Home tidak menampilkan data kosong kalau
06140:    login selesai lebih dulu daripada loadAll() awal — lihat initLoginGate
06141:    & restoreRbacSession_. */
06142: let INITIAL_LOAD_PROMISE = Promise.resolve();
06143: const ANALITIK_CHARTS = {}; // simpan instance Chart.js aktif supaya bisa di-destroy sebelum re-render
06144: let PENDING_FILES = []; // {name, mimeType, base64}
06145: let CURRENT_MACHINE_FILTER = null;
06146: let CURRENT_PELAPOR_FILTER = null;
06147: let CURRENT_GROUP_FILTER = null;
06148: let DATE_SORT = 'desc';
06149: let SHOW_NO_DATE = false;
06150: let PREVIOUS_ACTIVE_VIEW = 'input';
06151: let DASHBOARD_TIMER_INTERVAL = null;
06152: 
06153: // Daftar Kode Mesin yang dianggap "Mesin Prioritas" di Home — mesin-mesin utama
06154: // jalur produksi (Offset UV #5, Offset #8, Autoplaten #2/5-9, Folder Gluer #1-3,
06155: // Inspection Machine #3-4), sama dengan cakupan mesin yang sudah punya template
06156: // checklist patrol spesifik. Bisa diperluas nanti lewat Database Mesin tanpa
06157: // mengubah daftar ini — daftar ini murni untuk MENYARING kartu mana yang tampil
06158: // di filter "Mesin Prioritas", bukan sumber data mesin itu sendiri.
06159: // [FIX] Dipindahkan ke sini (dari dekat dashboardMachineList()) karena
06160: // restoreRbacSession_() bisa memanggil renderDashboardView() -> dashboardMachineList()
~~~

### Around line 6140
~~~text
06130: // Gabungkan sebuah timestamp cutoff lain (mis. rolling 90 hari) dengan
06131: // SOT_CUTOFF_DATE, ambil yang PALING BARU (paling ketat) di antara
06132: // keduanya -- supaya jendela waktu manapun yang dipakai suatu fitur tidak
06133: // pernah mundur sampai menyentuh data historis OneNote yang belum tervalidasi.
06134: function clampToSot(cutoffMs){
06135:   return Math.max(cutoffMs, SOT_CUTOFF_DATE.getTime());
06136: }
06137: 
06138: /* Promise loadAll() awal (dipicu saat halaman baru dibuka, terlepas dari
06139:    status login). Dipakai supaya Home tidak menampilkan data kosong kalau
06140:    login selesai lebih dulu daripada loadAll() awal — lihat initLoginGate
06141:    & restoreRbacSession_. */
06142: let INITIAL_LOAD_PROMISE = Promise.resolve();
06143: const ANALITIK_CHARTS = {}; // simpan instance Chart.js aktif supaya bisa di-destroy sebelum re-render
06144: let PENDING_FILES = []; // {name, mimeType, base64}
06145: let CURRENT_MACHINE_FILTER = null;
06146: let CURRENT_PELAPOR_FILTER = null;
06147: let CURRENT_GROUP_FILTER = null;
06148: let DATE_SORT = 'desc';
06149: let SHOW_NO_DATE = false;
06150: let PREVIOUS_ACTIVE_VIEW = 'input';
06151: let DASHBOARD_TIMER_INTERVAL = null;
06152: 
06153: // Daftar Kode Mesin yang dianggap "Mesin Prioritas" di Home — mesin-mesin utama
06154: // jalur produksi (Offset UV #5, Offset #8, Autoplaten #2/5-9, Folder Gluer #1-3,
06155: // Inspection Machine #3-4), sama dengan cakupan mesin yang sudah punya template
06156: // checklist patrol spesifik. Bisa diperluas nanti lewat Database Mesin tanpa
06157: // mengubah daftar ini — daftar ini murni untuk MENYARING kartu mana yang tampil
06158: // di filter "Mesin Prioritas", bukan sumber data mesin itu sendiri.
06159: // [FIX] Dipindahkan ke sini (dari dekat dashboardMachineList()) karena
06160: // restoreRbacSession_() bisa memanggil renderDashboardView() -> dashboardMachineList()
06161: // SEBELUM eksekusi script sampai ke deklarasi const/let aslinya di bawah — const/let
~~~

### Around line 6185
~~~text
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
~~~

### Around line 6187
~~~text
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
~~~

### Around line 6377
~~~text
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
06396:     if(groupEl){
06397:       const parentBtn = groupEl.querySelector('.nav-parent-btn');
06398:       if(parentBtn){ const g = labelOf(parentBtn); if(g) group = g; }
~~~

## fetch( — 4 hit(s)
### Around line 6619
~~~text
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
~~~

### Around line 6669
~~~text
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
~~~

### Around line 7790
~~~text
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
~~~

### Around line 8018
~~~text
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
~~~

## workers.dev — 1 hit(s)
### Around line 5409
~~~text
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
~~~

## api/ — 9 hit(s)
### Around line 5011
~~~text
05001:       </div>
05002:       <input type="text" id="kb-search" placeholder="Cari judul, mesin, atau tag..." style="margin-bottom:14px;">
05003:       <div class="card" id="kb-suggest-card" style="margin-bottom:16px;display:none;">
05004:         <div class="section-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
05005:           <span><i class="ph-bold ph-magic-wand"></i> Saran Otomatis (AI Lokal) dari Seluruh Menu</span>
05006:           <div style="display:flex;gap:8px;flex-wrap:wrap;">
05007:             <button class="btn btn-sm btn-ghost" id="btn-kb-suggest-refresh"><i class="ph-bold ph-arrows-clockwise"></i> Scan Ulang</button>
05008:             <button class="btn btn-sm btn-primary" id="btn-kb-autosync"><i class="ph-bold ph-robot"></i> Auto-Sync ke KB (AI Groq)</button>
05009:           </div>
05010:         </div>
05011:         <div class="sub" style="margin-bottom:10px;">Dipindai otomatis 100% lokal (tanpa API/LLM eksternal) dari seluruh konten menu/fitur yang sudah ada di aplikasi ini — Logbook (isu berulang), Report RCA, &amp; temuan Predictive Maintenance (Warning/Critical) untuk kategori <b>Frequently Problem</b>/<b>Lessons Learned</b>, Kaizen/Project Improvement &amp; Report Hub (Work Instruction) untuk <b>Best Practice</b>, serta Meeting Action Item yang sudah selesai (Closed) untuk <b>Lessons Learned</b> — lalu dicocokkan otomatis ke kategori Knowledge Base yang sesuai. Data yang sudah pernah ditambahkan tidak akan muncul lagi. Klik "Tambahkan" untuk meninjau satu-satu, atau <b>"Auto-Sync ke KB"</b> untuk memproses SEMUA saran sekaligus di belakang layar: tiap item otomatis dirapikan AI (Groq), dicek dulu supaya tidak duplikat/mirip dengan entri lain, lalu langsung dikirim ke Sheets.</div>
05012:         <div id="kb-suggest-list"></div>
05013:       </div>
05014:       <div id="kb-list" class="kb-grid"></div>
05015:     </section>
05016: 
05017:     <section class="view" id="view-rca">
05018:       <button class="btn btn-sm btn-back-to-input-report" onclick="goToView('report')" style="margin-bottom:10px;"><i class="ph-bold ph-arrow-left"></i> Input Report</button>
05019:       <div class="topbar">
05020:         <div><h1>Generate Report RCA</h1><div class="sub">Laporan Root Cause Analysis mengikuti format dokumen resmi — Why-Why Analysis &amp; Fishbone Diagram (Root Cause / Corrective Action / Recommended Action). Semua kolom native editable, isi manual atau pakai tombol "Isi Otomatis (Gunakan AI)" sebagai alternatif draft awal.</div></div>
05021:       </div>
05022:       <div class="machine-chip-row" id="rca-machine-chips"></div>
05023:       <div id="rca-summary-holder"></div>
05024:       <div id="rca-report-output"></div>
05025: 
05026:       <div class="card" style="margin-top:18px;">
05027:         <div class="section-title"><i class="ph-bold ph-archive"></i> Report RCA Tersimpan</div>
05028:         <div id="list-rca-saved"></div>
05029:       </div>
05030:     </section>
05031: 
05032:     <section class="view" id="view-database">
~~~

### Around line 5656
~~~text
05646:       </div>
05647:       <div class="field" style="max-width:340px;margin-bottom:14px;">
05648:         <input type="text" id="pi-personnel-search" placeholder="Cari nama / posisi jabatan...">
05649:       </div>
05650:       <div class="pi-card-grid" id="pi-personnel-grid"></div>
05651:     </section>
05652: 
05653:     <section class="view" id="view-pi-smart-resume">
05654:       <div class="topbar">
05655:         <button class="btn btn-sm btn-back-to-people" onclick="goToView('people-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05656:         <div><h1>Smart Recognition &amp; Resume Personil</h1><div class="sub">Pengenalan &amp; rekomendasi personil dihasilkan 100% lokal (tanpa API/LLM eksternal) — dirangkum otomatis dari SELURUH konten aplikasi yang sudah tersimpan: Logbook (Expert Finder), Hard Skill &amp; Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item. Klik kartu personil untuk melihat Smart Resume lengkap + rekomendasi.</div></div>
05657:       </div>
05658:       <div class="field" style="max-width:340px;margin-bottom:14px;">
05659:         <input type="text" id="pi-sr-search" placeholder="Cari nama personil...">
05660:       </div>
05661:       <div class="pi-card-grid" id="pi-sr-grid"></div>
05662:     </section>
05663: 
05664:     <section class="view" id="view-pi-softskill">
05665:       <div class="topbar">
05666:         <button class="btn btn-sm btn-back-to-people" onclick="goToView('people-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05667:         <div><h1>Soft Skill Assessment</h1><div class="sub">Penilaian Supervisor terhadap Soft Skill karyawan, skala 1-5 untuk 10 aspek.</div></div>
05668:       </div>
05669:       <div class="card" style="margin-bottom:16px;" id="pi-ss-form-card">
05670:         <div class="section-title" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
05671:           <span><i class="ph-bold ph-clipboard-text"></i> Form Penilaian Baru</span>
05672:           <label class="lc-switch" id="pi-ss-wizard-toggle-wrap" title="Ubah cara mengisi form: sekaligus (Standar) atau bertahap per langkah (Wizard)">
05673:             <input type="checkbox" id="pi-ss-wizard-toggle" aria-label="Aktifkan Mode Wizard">
05674:             <span class="lc-track" aria-hidden="true"></span>
05675:             <span class="lc-switch-label" id="pi-ss-wizard-toggle-label">Mode Wizard</span>
05676:           </label>
05677:         </div>
~~~

### Around line 10677
~~~text
10667:       gejala:[r.vibrasi,r.suhu,r.suara,r.kebocoran,r.kelistrikan,r.pelumasan].filter(Boolean).join(', '), tanggal:r.tanggal||''
10668:     }));
10669: }
10670: 
10671: function kbAlreadyLinked(sourceType, sourceId){
10672:   return KB_ENTRIES.some(k=> k.sourceType===sourceType && String(k.sourceId)===String(sourceId));
10673: }
10674: 
10675: // [EDIT] Semua adapter sumber terdaftar di sini — menambahkan menu/fitur baru
10676: // sebagai sumber Knowledge Base cukup dengan menambah 1 fungsi kbSourceXxx()
10677: // (yang membaca data menu tsb, tanpa API/LLM eksternal — "AI lokal" berbasis
10678: // data & aturan yang sudah ada di aplikasi) lalu daftarkan di sini dengan
10679: // kategori KB yang paling sesuai.
10680: function kbBuildSuggestions(){
10681:   const out = [];
10682:   kbSourceLogbook().forEach(c=>{
10683:     if(kbAlreadyLinked('logbook', c.sourceId)) return;
10684:     out.push({
10685:       kategori:'Frequently Problem', sourceType:'logbook', sourceId:c.sourceId,
10686:       judul: c.judul, kodeMesin:c.kodeMesin, namaMesin:c.namaMesin,
10687:       konten: `Masalah ini tercatat ${c.count}x di Logbook pada mesin ${c.namaMesin||'-'}.\n\nMasalah: ${c.masalah}${c.solusi ? '\n\nTindakan/Solusi yang biasa dipakai: '+c.solusi : ''}`,
10688:       tags: [c.jenis, c.namaMesin].filter(Boolean).join(', '),
10689:       badge: `📋 Logbook · ${c.count}x kejadian`,
10690:       score: 8 + Math.min(c.count, 20) // makin sering berulang, makin diprioritaskan
10691:     });
10692:   });
10693:   kbSourceKaizen().forEach(c=>{
10694:     if(kbAlreadyLinked('kaizen', c.sourceId)) return;
10695:     out.push({
10696:       kategori:'Best Practice', sourceType:'kaizen', sourceId:c.sourceId,
10697:       judul: c.judul, kodeMesin:'', namaMesin:c.namaMesin,
10698:       konten: `Permasalahan: ${c.permasalahan||'-'}\n\nIde Perbaikan: ${c.ide||'-'}\n\nBefore-After: ${c.beforeAfter||'-'}\n\nBenefit: ${c.benefit||'-'}`,
~~~

### Around line 10757
~~~text
10747:     });
10748:   });
10749:   // [OPTIMASI AI LOKAL] Sebelumnya urutan saran selalu tetap mengikuti
10750:   // urutan sumber didaftarkan (Logbook dulu, baru Kaizen, dst) --
10751:   // masalah yang baru terjadi 2x bisa nongol duluan dibanding masalah yang
10752:   // sudah 20x berulang hanya karena sumbernya sama. Sekarang diurutkan
10753:   // berdasarkan "skor kepentingan": isu berulang (Logbook) diberi bobot
10754:   // PALING TINGGI dan proporsional ke jumlah kejadian (semakin sering
10755:   // terjadi = semakin mendesak didokumentasikan supaya tidak terus
10756:   // ditangani dari nol tiap kali), sisanya diberi bobot dasar per jenis
10757:   // sumber. Murni aturan lokal, tanpa API/LLM eksternal -- konsisten
10758:   // dengan filosofi AI lokal yang sudah dipakai di seluruh fitur saran ini.
10759:   out.sort((a,b)=> (b.score||0) - (a.score||0));
10760:   return out;
10761: }
10762: 
10763: async function kbRenderSuggestions(){
10764:   const card = $('#kb-suggest-card');
10765:   const holder = $('#kb-suggest-list');
10766:   if(!card || !holder) return;
10767:   try{ if(typeof pmcLoadAll === 'function') await pmcLoadAll(false); }catch(e){}
10768:   try{ if(typeof syncRcaReportsFromBackend === 'function') await syncRcaReportsFromBackend(); }catch(e){}
10769:   // [EDIT] Ikut memuat data Meeting Management & Report Hub supaya saran
10770:   // otomatis KB benar-benar berbasis seluruh konten menu/fitur yang ada,
10771:   // bukan cuma Logbook/Kaizen/RCA.
10772:   try{ if(typeof mtgLoadAll === 'function') await mtgLoadAll(false); }catch(e){}
10773:   try{ if(typeof syncGrReportsFromBackend === 'function') await syncGrReportsFromBackend(); }catch(e){}
10774:   // [FIX] Predictive Maintenance ditambahkan sebagai sumber ke-6, tapi
10775:   // datanya (PM_REPORTS) sebelumnya tidak ikut dimuat di sini -- kalau user
10776:   // belum pernah buka menu Predictive Maintenance duluan di sesi yang sama,
10777:   // sumber ini akan kosong padahal datanya sebenarnya ada di Sheets.
10778:   try{ if(typeof syncPmReportsFromBackend === 'function') await syncPmReportsFromBackend(); }catch(e){}
~~~

### Around line 10805
~~~text
10795:     });
10796:   });
10797: }
10798: 
10799: // [FITUR BARU: AI LOKAL] Deteksi entri yang isinya mirip entri lain yang
10800: // sudah ada, dipakai sebagai peringatan (bukan blokir) sebelum menyimpan --
10801: // supaya Knowledge Base tidak lama-lama terisi banyak entri yang sebenarnya
10802: // membahas hal yang sama persis (mengurangi kualitas pencarian & bikin tim
10803: // ragu mana yang paling update). Murni token-overlap (Jaccard similarity)
10804: // atas kata-kata bermakna (>=4 huruf) di judul+konten, dibandingkan HANYA
10805: // dengan entri di kategori yang sama -- tanpa API/LLM eksternal, konsisten
10806: // dengan filosofi AI lokal yang sudah dipakai di seluruh fitur KB ini.
10807: function kbTokenSet(str){
10808:   return new Set(kbNormalize(str).split(/[^a-z0-9]+/).filter(w=> w.length>=4));
10809: }
10810: function kbSimilarity(textA, textB){
10811:   const A = kbTokenSet(textA), B = kbTokenSet(textB);
10812:   if(!A.size || !B.size) return 0;
10813:   let inter = 0;
10814:   A.forEach(w=>{ if(B.has(w)) inter++; });
10815:   const union = new Set([...A, ...B]).size;
10816:   return union ? inter/union : 0;
10817: }
10818: function kbFindSimilarEntries(judul, konten, kategori, excludeId){
10819:   const text = judul + ' ' + konten;
10820:   return KB_ENTRIES
10821:     .filter(k=> k.id !== excludeId && k.kategori === kategori)
10822:     .map(k=> ({ k, sim: kbSimilarity(text, (k.judul||'') + ' ' + (k.konten||'')) }))
10823:     .filter(x=> x.sim >= 0.35) // ambang batas -- di bawah ini dianggap kebetulan kata umum yang sama, bukan duplikat
10824:     .sort((a,b)=> b.sim - a.sim);
10825: }
10826: 
~~~

### Around line 22419
~~~text
22409:       text: WEB_APP_URL ? 'Aplikasi <b>sudah tersambung</b> ke Web App Cloudflare.' : '<b>Belum tersambung</b> ke database SQLite — data hanya tersimpan lokal di browser ini dan bisa hilang kalau cache dibersihkan.',
22410:       sub: `Master data: ${MACHINES.length} mesin, ${PERSONIL.length} personil, ${SPAREPART_LOKASI.length} lokasi sparepart.`, sources: [] });
22411:   }
22412: 
22413:   else if(view === 'ai'){
22414:     items.push({ level:'info', icon:'🧠', title:'Halaman Analisa AI', text:'Halaman ini menampilkan analisa/rekomendasi berbasis data maintenance yang sudah tercatat.', sub:'', sources: [] });
22415:   }
22416: 
22417:   // [LINKAGE] Project Management Center (Factory Project/Kaizen/SGA) belum
22418:   // pernah dianalisis Copilot sebelumnya — sekarang ditautkan supaya
22419:   // insight lokal (100% dari data, tanpa API/LLM eksternal) juga tersedia
22420:   // di sini: total per kategori, breakdown status, dan daftar item yang
22421:   // sudah lewat target tanggal (Target Finish/Tanggal/Jadwal Meeting) tapi
22422:   // belum Completed/Cancel — memakai fungsi pmcIsOverdue() yang sama
22423:   // dengan yang dipakai untuk badge "Overdue" di halaman Project Center
22424:   // sendiri, supaya definisi overdue konsisten di seluruh aplikasi.
22425:   else if(view === 'project-center'){
22426:     if(typeof pmcLoadAll === 'function'){ try{ pmcLoadAll(); }catch(e){} }
22427:     const cats = ['factory','kaizen','sga'];
22428:     let totalAll = 0, overdueAll = 0;
22429:     const overdueSources = [];
22430:     const byStatus = {};
22431:     cats.forEach(type=>{
22432:       const meta = PMC_META[type];
22433:       const rows = (PMC_STATE.data && PMC_STATE.data[type]) || [];
22434:       totalAll += rows.length;
22435:       rows.forEach(item=>{
22436:         const st = item[meta.status] || '-';
22437:         byStatus[st] = (byStatus[st]||0) + 1;
22438:         if(typeof pmcIsOverdue === 'function' && pmcIsOverdue(meta, item)){
22439:           overdueAll++;
22440:           overdueSources.push({
~~~

### Around line 24089
~~~text
24079:     toast(`Impor tersimpan lokal (${added} baru): ${err.message}`, true);
24080:     if(statusEl) statusEl.textContent = `Tersimpan lokal (belum tersinkron ke server): ${added} baru ditambahkan.`;
24081:   }
24082: }
24083: const btnSeedPiPersonnel = $('#btn-seed-pi-personnel');
24084: if(btnSeedPiPersonnel) btnSeedPiPersonnel.addEventListener('click', seedPiPersonnelMaster);
24085: 
24086: /* =========================================================
24087:    SMART RECOGNITION & RESUME PERSONIL
24088:    [FITUR BARU] Rekomendasi & ringkasan otomatis 100% lokal (bukan
24089:    API/LLM eksternal) — dihitung murni dari data yang SUDAH ADA & sudah
24090:    tersimpan di aplikasi ini, digabung lintas menu:
24091:      • Logbook (lewat expertFinderStats: jumlah kasus, breakdown, tingkat
24092:        penyelesaian, jumlah mesin ditangani, lama pengalaman)
24093:      • Hard Skill & Soft Skill Assessment (menu PI)
24094:      • Kaizen / Project Improvement (PMC_STATE, sebagai PIC yang statusnya
24095:        Completed)
24096:      • Meeting Action Item (MTG_STATE, sebagai PIC yang statusnya Closed)
24097:    Tidak ada input manual baru — cukup buka menu ini, sistem otomatis
24098:    mengenali ("Smart Recognition") kekuatan tiap personil lewat badge, lalu
24099:    menyusun narasi ringkasan + rekomendasi ("Smart Resume") berbasis aturan
24100:    di atas data tsb.
24101:    ========================================================= */
24102: function piSrKaizenStats(nama){
24103:   const list = (typeof PMC_STATE !== 'undefined' && PMC_STATE.data && PMC_STATE.data.kaizen) ? PMC_STATE.data.kaizen : [];
24104:   const mine = list.filter(k=> String(k.PIC||'').trim() === nama);
24105:   const completed = mine.filter(k=> String(k.Status||'').toLowerCase()==='completed' || Number(k['Progress (%)'])>=100);
24106:   return { total: mine.length, completed: completed.length };
24107: }
24108: function piSrMeetingStats(nama){
24109:   const list = (typeof MTG_STATE !== 'undefined' && Array.isArray(MTG_STATE.actions)) ? MTG_STATE.actions : [];
24110:   const mine = list.filter(a=> String(a['PIC']||'').trim() === nama);
~~~

### Around line 24243
~~~text
24233:     </div>
24234:     <div class="pi-profile-section">
24235:       <h4><i class="ph-bold ph-sparkle"></i> Smart Resume (Ringkasan Otomatis)</h4>
24236:       <p style="line-height:1.6;">${narrative}</p>
24237:     </div>
24238:     <div class="pi-profile-section">
24239:       <h4><i class="ph-bold ph-lightbulb"></i> Rekomendasi</h4>
24240:       <ul style="margin:0;padding-left:18px;line-height:1.7;">
24241:         ${rec.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}
24242:       </ul>
24243:       <div class="sub" style="margin-top:10px;">Rekomendasi dihasilkan 100% lokal dari data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item yang sudah tersimpan di aplikasi ini (tanpa API/LLM eksternal) — gunakan sebagai bantuan pengambilan keputusan, tetap verifikasi di lapangan.</div>
24244:     </div>
24245:   `;
24246:   $('#modal-bg').classList.add('active');
24247:   $('#btn-close-modal').addEventListener('click', closeModal);
24248: }
24249: 
24250: 
24251: function generatePiAiRecommendation(nama, tech, techScore, softScore, itemAvgs){
24252:   const belum = piBelumKompetenList(tech);
24253:   const softEntries = Object.entries(itemAvgs).filter(([,v])=>v!=null);
24254:   const weakSoft = softEntries.filter(([,v])=>v<=3).sort((a,b)=>a[1]-b[1]).map(([k])=>k);
24255:   const strongSoft = softEntries.filter(([,v])=>v>=4).map(([k])=>k);
24256: 
24257:   const strengths = [];
24258:   if(techScore!=null && techScore>=80) strengths.push('Kompetensi teknis kuat (' + techScore + '% unit kompetensi kompeten).');
24259:   if(strongSoft.length) strengths.push('Soft skill unggul pada: ' + strongSoft.join(', ') + '.');
24260:   if(!strengths.length) strengths.push('Belum cukup data untuk menyimpulkan kekuatan utama.');
24261: 
24262:   const gapSummary = [];
24263:   if(belum.length) gapSummary.push('Unit kompetensi teknis yang belum dikuasai: ' + belum.join('; ') + '.');
24264:   if(weakSoft.length) gapSummary.push('Aspek soft skill dengan skor rendah (≤3): ' + weakSoft.join(', ') + '.');
~~~

### Around line 25169
~~~text
25159:         });
25160:       }
25161:     }catch(e){}
25162:     return items;
25163:   };
25164: })();
25165: </script>
25166: 
25167: <script>
25168: /* =====================================================================
25169:    LOCAL AI COPILOT ENGINE — 100% OFFLINE, TANPA API/LLM EKSTERNAL
25170:    ---------------------------------------------------------------------
25171:    Prinsip:
25172:    1) Copilot HANYA membaca DOM + data halaman yang sedang aktif
25173:       (elemen di dalam #view-<id> yang sedang punya class "active",
25174:       ditambah struktur menu/breadcrumb). Tidak ada pemanggilan
25175:       jaringan/API ke luar untuk menghasilkan penjelasan atau jawaban.
25176:    2) Setiap kali pengguna pindah halaman, seluruh context lama
25177:       DIBUANG dan dibangun ULANG dari nol (lihat buildPageContext()).
25178:       Tidak ada carry-over data dari halaman sebelumnya.
25179:    3) Hasilnya disisipkan ke resume Copilot yang sudah ada: posisi
25180:       halaman (breadcrumb menu), pengguna utama, dan daftar fitur yang
25181:       terdeteksi otomatis di halaman aktif.
25182:    ===================================================================== */
25183: (function(){
25184: 
25185:   function esc(s){
25186:     if(typeof escapeHtml === 'function') return escapeHtml(String(s==null?'':s));
25187:     return String(s==null?'':s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
25188:   }
25189:   function cleanText(t){ return String(t||'').replace(/\s+/g,' ').trim(); }
25190:   function stripLeadingIcon(t){ return cleanText(t).replace(/^[^\p{L}\p{N}]+/u,'').trim(); }
~~~

## Content-Type — 7 hit(s)
### Around line 6619
~~~text
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
~~~

### Around line 6658
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
~~~

### Around line 6669
~~~text
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
~~~

### Around line 7884
~~~text
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
~~~

### Around line 8020
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
~~~

### Around line 8104
~~~text
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
~~~

### Around line 20974
~~~text
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
~~~

## credentials: — 1 hit(s)
### Around line 7881
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
~~~

## Production root

- HTTP: 200
- Content-Type: text/html
- Cache-Control: no-store, no-cache, must-revalidate, max-age=0
- Build: bantuan-copilot-20260920
- SHA-256: f5b9e2fd1905c16f00a42b7411af040abd1342b3b40266bebac5ca5f6fadcef5
- Matches repo index: YES

## Literal URLs likely relevant to auth/API

- https://fonts.googleapis.com
- https://fonts.googleapis.com/css2?family=Orbitron:wght
- https://nama-aplikasi.workers.dev/api

## Literal relative paths likely relevant to auth/API

- /api
