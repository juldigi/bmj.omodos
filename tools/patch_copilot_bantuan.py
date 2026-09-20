from pathlib import Path
import sys

path=Path("public/index.html")
src=path.read_text(encoding="utf-8",errors="strict")

MARKER="COPILOT_BANTUAN_ONLY_V1"
if MARKER in src:
    print("Copilot Bantuan patch already applied.")
    sys.exit(0)

# 1) Add Bantuan button inside Copilot actions only.
old_actions = '''        <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
        <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
        <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>'''
new_actions = '''        <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
        <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
        <button class="btn btn-sm btn-ghost" type="button" id="copilot-help" aria-expanded="false" title="Buka bantuan untuk halaman yang sedang digunakan"><i class="ph-bold ph-question"></i> Bantuan</button>
        <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>'''
if old_actions not in src:
    raise SystemExit("Copilot action anchor not found")
src=src.replace(old_actions,new_actions,1)

# 2) Add isolated help styles and hard-hide old page-level guide.
style_anchor='<script id="legacy-low-cognitive-script">'
help_style = '''<!-- COPILOT_BANTUAN_ONLY_V1 -->
<style id="copilot-help-style">
/* Bantuan tidak lagi mengambil ruang di halaman utama. */
.legacy-simple-guide{display:none!important}
.copilot-help-card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:14px;margin:0 0 12px;box-shadow:0 8px 24px rgba(15,23,42,.06)}
.copilot-help-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:10px}
.copilot-help-eyebrow{font:700 9.5px/1.2 var(--font-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--text-dim)}
.copilot-help-title{font:800 17px/1.25 var(--font-display);color:var(--text);margin-top:3px}
.copilot-help-purpose{font:600 12px/1.55 var(--font-body);color:var(--text);margin-bottom:10px}
.copilot-help-close{border:1px solid var(--line);background:var(--panel-2);color:var(--text-dim);width:32px;height:32px;border-radius:9px;cursor:pointer;flex:0 0 auto}
.copilot-help-steps{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.copilot-help-step{display:flex;gap:8px;align-items:flex-start;padding:9px 10px;border:1px solid var(--line-soft);border-radius:10px;background:var(--panel-2);font:600 11.5px/1.45 var(--font-body);color:var(--text)}
.copilot-help-step b{display:grid;place-items:center;min-width:22px;height:22px;border-radius:999px;background:var(--accent);color:#fff;font-size:10px}
.copilot-help-glossary{margin-top:10px;border-top:1px solid var(--line-soft);padding-top:8px}
.copilot-help-glossary summary{cursor:pointer;font:700 11px/1.4 var(--font-body);color:var(--text-dim);min-height:32px;display:flex;align-items:center}
.copilot-help-glossary-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}
.copilot-help-term{padding:7px 8px;border:1px solid var(--line-soft);border-radius:8px;background:var(--panel-2)}
.copilot-help-term b{display:block;font-size:10.5px;color:var(--text)}
.copilot-help-term span{display:block;margin-top:2px;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
@media(max-width:620px){.copilot-help-steps,.copilot-help-glossary-grid{grid-template-columns:1fr}}
</style>
'''
if style_anchor not in src:
    raise SystemExit("Legacy cognitive script anchor not found")
src=src.replace(style_anchor,help_style+style_anchor,1)

# 3) Expose existing guide data to Copilot without duplicating it.
glossary_anchor='''  function glossaryHtml(){
    return '<details class="legacy-simple-glossary"><summary>Arti kata yang sering muncul</summary><div class="legacy-simple-glossary-grid">'+
      GLOSSARY.map(x=>'<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('')+'</div></details>';
  }
'''
glossary_repl='''  window.OMODOS_HELP_DATA=Object.freeze({
    guides:VIEW_GUIDES,
    viewNames:VIEW_NAMES,
    glossary:GLOSSARY
  });

  function glossaryHtml(){
    return '<details class="legacy-simple-glossary"><summary>Arti kata yang sering muncul</summary><div class="legacy-simple-glossary-grid">'+
      GLOSSARY.map(x=>'<div><b>'+x[0]+'</b><span>'+x[1]+'</span></div>').join('')+'</div></details>';
  }
'''
if glossary_anchor not in src:
    raise SystemExit("Glossary function anchor not found")
src=src.replace(glossary_anchor,glossary_repl,1)

# 4) Remove page-level guide rendering. Also clean up any old guide if a stale
# DOM fragment exists during hot reload / future reuse.
old_ensure='''  function ensureGuide(view){
    if(!view||!view.id||view.id==='view-omodos4'||view.querySelector(':scope > .legacy-simple-guide'))return;
    const key=view.id.replace(/^view-/,'');
    const g=VIEW_GUIDES[key];if(!g)return;
    const guide=document.createElement('div');guide.className='legacy-simple-guide';guide.dataset.simpleGuide=key;
    guide.innerHTML='<div class="legacy-simple-guide-title">'+g[0]+'</div>'+
      '<div class="legacy-simple-guide-purpose">'+g[1]+'</div>'+
      '<div class="legacy-simple-guide-steps"><div class="legacy-simple-step"><b>1</b>'+g[2]+'</div><div class="legacy-simple-step"><b>2</b>'+g[3]+'</div></div>'+
      glossaryHtml();
    const top=view.querySelector(':scope > .topbar');
    if(top)top.insertAdjacentElement('afterend',guide);else view.prepend(guide);
  }
'''
new_ensure='''  function ensureGuide(view){
    if(!view||!view.querySelectorAll)return;
    view.querySelectorAll(':scope > .legacy-simple-guide').forEach(el=>el.remove());
  }
'''
if old_ensure not in src:
    raise SystemExit("ensureGuide implementation anchor not found")
src=src.replace(old_ensure,new_ensure,1)

# 5) Add Copilot Bantuan renderer near existing open/close functions.
open_anchor='''function openCopilot(){
  $('#copilot-bg').classList.add('active');
  setTimeout(()=>$('#copilot-question')?.focus(),80);
}
function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
'''
help_logic='''function copilotActiveViewKey_(){
  const active=document.querySelector('.view.active[id^="view-"]');
  return active ? active.id.replace(/^view-/,'') : 'dashboard';
}
function copilotHelpEscape_(value){
  return typeof escapeHtml==='function' ? escapeHtml(String(value==null?'':value)) : String(value==null?'':value);
}
function copilotHelpHtml_(){
  const data=window.OMODOS_HELP_DATA||{};
  const guides=data.guides||{};
  const names=data.viewNames||{};
  const glossary=Array.isArray(data.glossary)?data.glossary:[];
  const key=copilotActiveViewKey_();
  const g=guides[key] || [
    names[key] || 'Bantuan OMODOS',
    'Bantuan singkat untuk halaman yang sedang digunakan.',
    'Pilih fungsi yang ingin digunakan.',
    'Periksa data sebelum menyimpan atau mengambil tindakan.'
  ];
  const terms=glossary.map(x=>
    '<div class="copilot-help-term"><b>'+copilotHelpEscape_(x[0])+'</b><span>'+copilotHelpEscape_(x[1])+'</span></div>'
  ).join('');
  return '<section class="copilot-help-card" data-help-view="'+copilotHelpEscape_(key)+'">'+
    '<div class="copilot-help-head"><div><div class="copilot-help-eyebrow">Bantuan halaman aktif</div>'+
    '<div class="copilot-help-title">'+copilotHelpEscape_(g[0])+'</div></div>'+
    '<button type="button" class="copilot-help-close" id="copilot-help-close" aria-label="Tutup Bantuan">✕</button></div>'+
    '<div class="copilot-help-purpose">'+copilotHelpEscape_(g[1])+'</div>'+
    '<div class="copilot-help-steps">'+
      '<div class="copilot-help-step"><b>1</b><span>'+copilotHelpEscape_(g[2])+'</span></div>'+
      '<div class="copilot-help-step"><b>2</b><span>'+copilotHelpEscape_(g[3])+'</span></div>'+
    '</div>'+
    (terms?'<details class="copilot-help-glossary"><summary>Arti kata yang sering muncul</summary><div class="copilot-help-glossary-grid">'+terms+'</div></details>':'')+
  '</section>';
}
function copilotCloseHelp_(){
  document.querySelector('#copilot-body .copilot-help-card')?.remove();
  const btn=document.getElementById('copilot-help');
  if(btn)btn.setAttribute('aria-expanded','false');
}
function copilotOpenHelp_(){
  const body=document.getElementById('copilot-body');
  if(!body)return;
  body.querySelector('.copilot-help-card')?.remove();
  body.insertAdjacentHTML('afterbegin',copilotHelpHtml_());
  const btn=document.getElementById('copilot-help');
  if(btn)btn.setAttribute('aria-expanded','true');
  document.getElementById('copilot-help-close')?.addEventListener('click',copilotCloseHelp_);
  body.scrollTop=0;
}
function openCopilot(){
  $('#copilot-bg').classList.add('active');
  setTimeout(()=>$('#copilot-question')?.focus(),80);
}
function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
'''
if open_anchor not in src:
    raise SystemExit("openCopilot anchor not found")
src=src.replace(open_anchor,help_logic,1)

# 6) Bind Bantuan button and ensure clear-data does not delete the user's page
# guide data; it only closes the contextual help panel.
event_anchor="""$('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
$('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
"""
event_repl="""$('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
$('#copilot-help')?.addEventListener('click',copilotOpenHelp_);
$('#copilot-clear-data')?.addEventListener('click',()=>{ copilotCloseHelp_(); copilotClearData_(); });
"""
if event_anchor not in src:
    raise SystemExit("Copilot event anchor not found")
src=src.replace(event_anchor,event_repl,1)

# Safety assertions
checks=[
    MARKER,
    'id="copilot-help"',
    "window.OMODOS_HELP_DATA",
    "function copilotOpenHelp_()",
    "function copilotCloseHelp_()",
    ".legacy-simple-guide{display:none!important}",
]
missing=[x for x in checks if x not in src]
if missing:
    raise SystemExit("Post-patch checks missing: "+", ".join(missing))
if old_ensure in src:
    raise SystemExit("Old page-level guide injector still present")

path.write_text(src,encoding="utf-8")
print("Applied Copilot-only Bantuan patch.")
