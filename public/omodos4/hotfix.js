/* OFFSET_WAYS_MODULE_LOADER_V1 — isolated module; no changes to the login bootstrap */
(function(){
'use strict';
function loadOffsetWaysModule(){
  if(!document.getElementById('omodos-offset-ways-style')){
    var style=document.createElement('link');
    style.id='omodos-offset-ways-style';
    style.rel='stylesheet';
    style.href='/omodos4/offset-ways.css';
    document.head.appendChild(style);
  }
  if(document.getElementById('omodos-offset-ways-script')) return;
  var script=document.createElement('script');
  script.id='omodos-offset-ways-script';
  script.src='/omodos4/offset-ways.js';
  script.async=true;
  document.head.appendChild(script);
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',loadOffsetWaysModule,{once:true});
else loadOffsetWaysModule();
})();


/* PATROL_CHECKLIST_PHOTOS_AND_LOGBOOK_OTHER_AREA_V1 */
(function(){
'use strict';
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
function byId(id){return document.getElementById(id);}
function safeText(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
ready(function(){
  /* Logbook: let users save an area that is not listed in the master area list. */
  var category=byId('select-kategoriArea'), area=byId('select-namaArea');
  if(category&&area&&!byId('input-namaArea-lainnya')){
    var field=document.createElement('div');
    field.className='field';
    field.id='field-namaArea-lainnya';
    field.hidden=true;
    field.innerHTML='<label for="input-namaArea-lainnya">Nama area lainnya</label><input type="text" id="input-namaArea-lainnya" name="namaAreaLainnya" placeholder="Masukkan nama area..." autocomplete="off">';
    area.closest('.field').insertAdjacentElement('afterend',field);
  }
  var customArea=byId('input-namaArea-lainnya');
  var originalPopulate=window.populateWorkAreaOptions_;
  if(category&&area&&typeof originalPopulate==='function'&&!window.__omodosOtherAreaPopulateWrapped){
    window.__omodosOtherAreaPopulateWrapped=true;
    window.populateWorkAreaOptions_=function(cat,select,value){
      if(cat==='Lainnya'){
        select.innerHTML='<option value="">Pilih area...</option><option value="Lainnya">Lainnya</option>';
        select.value='Lainnya';
        if(customArea)customArea.value=value&&value!=='Lainnya'?String(value):customArea.value;
        return;
      }
      originalPopulate(cat,select,value);
      if(cat&&cat!==''){
        if(!Array.from(select.options).some(o=>o.value==='Lainnya'))select.insertAdjacentHTML('beforeend','<option value="Lainnya">Lainnya (isi nama area)</option>');
        if(value&&!Array.from(select.options).some(o=>o.value===value)){
          select.value='Lainnya';
          if(customArea)customArea.value=String(value);
        }
      }
    };
    category.insertAdjacentHTML('beforeend','<option value="Lainnya">Lainnya</option>');
  }
  function syncOtherArea(){
    if(!category||!area||!customArea)return;
    var isArea=byId('select-lokasiPekerjaan')&&byId('select-lokasiPekerjaan').value==='Area';
    var show=isArea&&(category.value==='Lainnya'||area.value==='Lainnya');
    var field=byId('field-namaArea-lainnya');
    if(field)field.hidden=!show;
    customArea.required=!!show;
    customArea.disabled=!show;
    if(show&&category.value==='Lainnya'&&area.value!=='Lainnya'){
      area.innerHTML='<option value="">Pilih area...</option><option value="Lainnya">Lainnya</option>';
      area.value='Lainnya';
    }
  }
  if(category&&area){
    category.addEventListener('change',function(){setTimeout(syncOtherArea,0);});
    area.addEventListener('change',syncOtherArea);
    var loc=byId('select-lokasiPekerjaan');if(loc)loc.addEventListener('change',function(){setTimeout(syncOtherArea,0);});
    var form=byId('form-entry');if(form)form.addEventListener('reset',function(){setTimeout(syncOtherArea,0);});
    var originalSync=window.syncLogbookLocationForm_;
    if(typeof originalSync==='function'&&!window.__omodosOtherAreaSyncWrapped){
      window.__omodosOtherAreaSyncWrapped=true;
      window.syncLogbookLocationForm_=function(){originalSync();syncOtherArea();};
    }
    var originalApply=window.applyLogbookLocationPayload_;
    if(typeof originalApply==='function'&&!window.__omodosOtherAreaApplyWrapped){
      window.__omodosOtherAreaApplyWrapped=true;
      window.applyLogbookLocationPayload_=function(entry){
        if(entry&&entry.lokasiPekerjaan==='Area'&&(entry.kategoriArea==='Lainnya'||entry.namaArea==='Lainnya')){
          var typedField=entry.ID?byId('input-edit-namaArea-lainnya'):customArea;
          var typed=String((typedField&&typedField.value)||entry.namaAreaLainnya||'').trim();
          if(!typed)throw new Error('Masukkan nama area lainnya.');
          entry.namaArea=typed;entry.namaAreaLainnya=typed;
          entry.kodeMesin='-';entry.namaMesin='-';entry.namaUnit='-';
          entry.lokasi=entry.kategoriArea===entry.namaArea?entry.kategoriArea:entry.kategoriArea+' · '+entry.namaArea;
          return entry;
        }
        return originalApply(entry);
      };
    }
    syncOtherArea();
  }

  /* Patrol: one shared picker offers Camera and Gallery. Checklist photos become
     finding records tagged with the exact checklist category/index/item, so they
     travel through the existing compressed-file and backend attachment pipeline. */
  var checklistInput=byId('patrol-temuan-file-input');
  var checklistPreview=byId('patrol-temuan-file-preview');
  if(!checklistInput||window.__omodosChecklistPhotoPickerReady)return;
  window.__omodosChecklistPhotoPickerReady=true;
  var pendingCheckpoint=null;
  var picker=document.createElement('div');
  picker.id='omodos-patrol-photo-picker';
  picker.hidden=true;
  picker.innerHTML='<div class="omodos-patrol-picker-backdrop" data-picker-close></div><div class="omodos-patrol-picker-card" role="dialog" aria-modal="true" aria-labelledby="omodos-patrol-picker-title"><div id="omodos-patrol-picker-title" style="font-weight:700;font-size:16px;margin-bottom:6px">Tambah lampiran</div><div id="omodos-patrol-picker-sub" style="font-size:12px;color:var(--text-dim);margin-bottom:14px">Pilih sumber foto atau video.</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button type="button" class="btn btn-primary" data-picker-camera><i class="ph-bold ph-camera"></i> Kamera</button><button type="button" class="btn btn-ghost" data-picker-gallery><i class="ph-bold ph-images"></i> Galeri</button></div><button type="button" class="btn btn-ghost" data-picker-close style="width:100%;margin-top:10px">Batal</button></div>';
  picker.style.cssText='position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:18px';
  picker.querySelector('.omodos-patrol-picker-backdrop').style.cssText='position:absolute;inset:0;background:rgba(0,0,0,.58)';
  picker.querySelector('.omodos-patrol-picker-card').style.cssText='position:relative;width:min(100%,380px);padding:18px;border:1px solid var(--line);border-radius:14px;background:var(--panel);box-shadow:0 18px 60px rgba(0,0,0,.3)';
  var cameraInput=document.createElement('input');cameraInput.type='file';cameraInput.accept='image/*';cameraInput.capture='environment';cameraInput.multiple=true;cameraInput.hidden=true;
  var galleryInput=document.createElement('input');galleryInput.type='file';galleryInput.accept='image/*,video/*';galleryInput.multiple=true;galleryInput.hidden=true;
  document.body.append(picker,cameraInput,galleryInput);
  function closePicker(){picker.hidden=true;cameraInput.value='';galleryInput.value='';}
  function openPicker(checkpoint){
    pendingCheckpoint=checkpoint||null;
    var sub=byId('omodos-patrol-picker-sub');
    if(sub)sub.textContent=checkpoint?'Lampirkan bukti untuk: '+checkpoint.item:'Lampiran untuk temuan di luar checklist.';
    picker.hidden=false;
  }
  picker.querySelectorAll('[data-picker-close]').forEach(function(b){b.addEventListener('click',closePicker);});
  picker.querySelector('[data-picker-camera]').addEventListener('click',function(){closePicker();cameraInput.click();});
  picker.querySelector('[data-picker-gallery]').addEventListener('click',function(){closePicker();galleryInput.click();});
  function routeFiles(fileList){
    var files=Array.from(fileList||[]);if(!files.length)return;
    var checkpoint=pendingCheckpoint;pendingCheckpoint=null;
    var transfer=new DataTransfer();files.forEach(function(f){transfer.items.add(f);});
    checklistInput.value='';
    checklistInput.files=transfer.files;
    checklistInput.dispatchEvent(new Event('change',{bubbles:true}));
    if(!checkpoint)return;
    var expected=files.length,started=Date.now(),lastCount=-1,stable=0;
    var poll=setInterval(function(){
      var count=(typeof PATROL_FINDING_FILES!=='undefined'&&PATROL_FINDING_FILES)?PATROL_FINDING_FILES.length:0;
      if(count===expected){stable++;if(stable>=2){clearInterval(poll);saveCheckpointFinding(checkpoint);return;}}
      else stable=0;
      if(count!==lastCount)lastCount=count;
      if(Date.now()-started>30000){clearInterval(poll);if(typeof toast==='function')toast('Foto belum selesai diproses. Silakan coba lagi.',true);}
    },150);
  }
  cameraInput.addEventListener('change',function(){routeFiles(cameraInput.files);});
  galleryInput.addEventListener('change',function(){routeFiles(galleryInput.files);});
  function checkpointBadge(checkpoint,files){
    var rows=document.querySelectorAll('#patrol-checklist-groups [data-kategori][data-idx]');
    rows.forEach(function(row){
      if(row.dataset.kategori!==checkpoint.category||String(row.dataset.idx)!==String(checkpoint.index))return;
      var outer=row.parentElement;
      var old=outer.parentElement.querySelector(':scope > .omodos-checkpoint-photo-note[data-for="'+CSS.escape(checkpoint.category+'|'+checkpoint.index)+'"]');
      if(old)old.remove();
      var note=document.createElement('div');note.className='omodos-checkpoint-photo-note';note.dataset.for=checkpoint.category+'|'+checkpoint.index;
      note.style.cssText='font-size:11px;color:var(--green);margin:-2px 0 9px 0;';
      note.textContent='📎 '+files.length+' lampiran tersimpan untuk titik checklist ini';
      outer.insertAdjacentElement('afterend',note);
    });
  }
  function saveCheckpointFinding(cp){
    var files=PATROL_FINDING_FILES.map(function(f){return {name:f.name,type:f._isVideo?'video':'image',viewUrl:f._localUrl,base64:f.base64,mimeType:f.mimeType};});
    if(!files.length)return;
    var existing=PATROL_STATE.findings.find(function(f){return f.source==='checklist'&&f.checklistCategory===cp.category&&String(f.checklistIndex)===String(cp.index);});
    if(existing){existing.files=(existing.files||[]).concat(files);existing.prioritas=cp.status==='abnormal'?'Tinggi':'Sedang';existing.checklistStatus=cp.status;}
    else PATROL_STATE.findings.push({id:'CHK-'+Date.now()+'-'+Math.floor(Math.random()*900+100),kategori:'Checklist Patrol',prioritas:cp.status==='abnormal'?'Tinggi':'Sedang',deskripsi:'Checklist '+cp.category+' — '+cp.item+' ('+(cp.status==='abnormal'?'Abnormal':'Warning')+')',status:'Open',source:'checklist',checklistCategory:cp.category,checklistIndex:cp.index,checklistItem:cp.item,checklistStatus:cp.status,files:files});
    PATROL_FINDING_FILES=[];
    if(checklistPreview)checklistPreview.innerHTML='';
    var desc=byId('patrol-temuan-deskripsi');if(desc)desc.value='';
    var yes=document.querySelector('[data-ada-temuan="ya"]');if(yes&&!yes.classList.contains('active'))yes.click();
    if(typeof renderPatrolFindingsInputList==='function')renderPatrolFindingsInputList();
    checkpointBadge(cp,files);
    if(typeof toast==='function')toast('Lampiran ditautkan ke titik checklist: '+cp.item+'.');
  }
  document.addEventListener('click',function(ev){
    var btn=ev.target.closest&&ev.target.closest('#patrol-checklist-groups .patrol-chk-btn');
    if(!btn)return;
    var status=btn.dataset.status;
    if(status!=='warning'&&status!=='abnormal')return;
    setTimeout(function(){
      var row=btn.closest('[data-kategori][data-idx]');
      if(!row)return;
      var itemNode=row.parentElement&&row.parentElement.firstElementChild;
      var item=itemNode?itemNode.textContent.trim():'Titik checklist';
      openPicker({category:row.dataset.kategori,index:row.dataset.idx,item:item,status:status});
    },0);
  },true);
  var bottomDrop=byId('patrol-temuan-file-drop');
  if(bottomDrop)bottomDrop.addEventListener('click',function(ev){
    if(ev.target===checklistInput)return;
    ev.preventDefault();ev.stopImmediatePropagation();openPicker(null);
  },true);
  var style=document.createElement('style');style.textContent='#omodos-patrol-photo-picker[hidden]{display:none!important}.omodos-checkpoint-photo-note{overflow-wrap:anywhere}@media(max-width:520px){#omodos-patrol-photo-picker .omodos-patrol-picker-card{padding:15px}}';
  document.head.appendChild(style);
});
})();


/* COPILOT_EXTERNAL_SEARCH_LINKS_V1 — make external AI research sources openable from Copilot output. */
(function(){
'use strict';
function inCopilot(node){
  var el=node&&node.parentElement;
  while(el&&el!==document.body){
    var id=String(el.id||'').toLowerCase();
    var cls=String(el.className&&el.className.baseVal||el.className||'').toLowerCase();
    if(/copilot|ai-internet|internet-research|external-ai/.test(id+' '+cls))return true;
    el=el.parentElement;
  }
  return false;
}
function linkifyTextNode(node){
  if(!node||node.nodeType!==Node.TEXT_NODE||!inCopilot(node))return;
  var text=node.nodeValue||'';
  if(!/https?:\/\//i.test(text)||node.parentElement&&node.parentElement.closest('a,button,script,style,textarea,input,select,option'))return;
  var re=/https?:\/\/[^\s<>"']+/gi,match,last=0,frag=document.createDocumentFragment(),changed=false;
  while((match=re.exec(text))){
    var raw=match[0],url=raw.replace(/[),.;!?]+$/,'');
    if(!url)continue;
    frag.appendChild(document.createTextNode(text.slice(last,match.index)));
    var a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.className='omodos-copilot-source-link';a.textContent=url;
    frag.appendChild(a);
    last=match.index+url.length;changed=true;
  }
  if(!changed)return;
  frag.appendChild(document.createTextNode(text.slice(last)));
  node.parentNode.replaceChild(frag,node);
}
function scan(root){
  if(!root)return;
  var containers=[];
  if(root.nodeType===1&&(/copilot|ai-internet|internet-research|external-ai/i.test(String(root.id||'')+' '+String(root.className||''))||inCopilot(root)))containers.push(root);
  if(root.querySelectorAll)containers=containers.concat(Array.from(root.querySelectorAll('[id*="copilot" i],[class*="copilot" i],[id*="internet-research" i],[class*="internet-research" i],[id*="external-ai" i],[class*="external-ai" i]')));
  containers.forEach(function(container){
    var walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT),nodes=[],n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(linkifyTextNode);
  });
}
function boot(){
  scan(document.body);
  var observer=new MutationObserver(function(records){records.forEach(function(r){r.addedNodes&&r.addedNodes.forEach(function(n){if(n.nodeType===1)scan(n);else if(n.nodeType===3)linkifyTextNode(n);});});});
  observer.observe(document.body,{childList:true,subtree:true});
}
var style=document.createElement('style');
style.textContent='.omodos-copilot-source-link{color:var(--primary,#2563eb);text-decoration:underline;text-underline-offset:2px;overflow-wrap:anywhere;cursor:pointer}.omodos-copilot-source-link:focus-visible{outline:2px solid currentColor;outline-offset:2px}';
document.head.appendChild(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* COPILOT_RECORD_CARD_DETAIL_MODAL_V1: connect internal Copilot result cards to the full source record. */
(function(){
'use strict';
var rows = window.__omodosCopilotDetailRows || (window.__omodosCopilotDetailRows = new Map());
var nextId = Number(window.__omodosCopilotDetailNextId || 0);
var installed = false;
function esc(value){
  return String(value==null?'':value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function installRenderer(){
  if(typeof window.copilotRowCardHtml_!=='function'||window.copilotRowCardHtml_.__detailPatched)return false;
  var original=window.copilotRowCardHtml_;
  var wrapped=function(row,sourceName,index){
    var html=original.apply(this,arguments);
    nextId+=1; window.__omodosCopilotDetailNextId=nextId;
    rows.set(String(nextId),{row:row,source:String(sourceName||'Data OMODOS'),index:Number(index||0)});
    return html.replace('<article class="copilot-data-record"','<article tabindex="0" role="button" aria-label="Buka detail pekerjaan" data-copilot-detail-id="'+nextId+'" class="copilot-data-record copilot-detail-clickable"');
  };
  wrapped.__detailPatched=true;
  window.copilotRowCardHtml_=wrapped;
  return true;
}
function ensureModal(){
  var el=document.getElementById('copilot-record-detail-modal');
  if(el)return el;
  el=document.createElement('div');
  el.id='copilot-record-detail-modal';
  el.className='copilot-detail-modal';
  el.hidden=true;
  el.innerHTML='<div class="copilot-detail-backdrop" data-detail-close></div><section class="copilot-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="copilot-detail-title"><header class="copilot-detail-header"><div><div class="copilot-detail-eyebrow">COPILOT · DATA INTERNAL</div><h2 id="copilot-detail-title">Detail Pekerjaan</h2><div id="copilot-detail-source" class="copilot-detail-source"></div></div><button type="button" class="copilot-detail-close" aria-label="Tutup detail" data-detail-close>×</button></header><div id="copilot-detail-content" class="copilot-detail-content"></div><footer class="copilot-detail-footer"><button type="button" class="btn btn-sm" data-detail-close>Tutup</button></footer></section>';
  document.body.appendChild(el);
  el.addEventListener('click',function(ev){if(ev.target&&ev.target.closest('[data-detail-close]'))closeModal();});
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&!el.hidden)closeModal();});
  return el;
}
function isSensitive(key){
  return /password|token|base64|attachment.*data|file.*data|session|authorization|secret|api.?key/i.test(String(key||''));
}
function showDetail(id){
  var item=rows.get(String(id));
  if(!item||!item.row)return;
  var modal=ensureModal(),row=item.row;
  var title='';
  try{title=typeof window.copilotRowLabel_==='function'?window.copilotRowLabel_(row):'';}catch(_){}
  document.getElementById('copilot-detail-title').textContent=title||'Detail Pekerjaan';
  document.getElementById('copilot-detail-source').textContent=item.source+(Number.isFinite(item.index)?' · Hasil #'+(item.index+1):'');
  var content=document.getElementById('copilot-detail-content');
  content.replaceChildren();
  var entries=Object.entries(row).filter(function(pair){return !isSensitive(pair[0])&&pair[1]!==null&&pair[1]!==undefined&&pair[1]!=='';});
  entries.sort(function(a,b){
    var preferred=['ID','Tanggal','Waktu','Nama Mesin','Kode Mesin','Status','Status Pekerjaan','Deskripsi Masalah','Deskripsi','Tindakan Perbaikan','Penyebab','PIC','Pelapor'];
    var ai=preferred.findIndex(function(k){return k.toLowerCase()===a[0].toLowerCase();});
    var bi=preferred.findIndex(function(k){return k.toLowerCase()===b[0].toLowerCase();});
    return (ai<0?999:ai)-(bi<0?999:bi);
  });
  if(!entries.length){var empty=document.createElement('p');empty.className='copilot-detail-empty';empty.textContent='Detail record tidak tersedia.';content.appendChild(empty);}
  entries.forEach(function(pair){
    var value=pair[1];
    if(typeof value==='object'){
      try{value=JSON.stringify(value,null,2);}catch(_){value=String(value);}
    }
    var field=document.createElement('div');field.className='copilot-detail-field';
    var label=document.createElement('div');label.className='copilot-detail-label';label.textContent=String(pair[0]).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ');
    var val=document.createElement('div');val.className='copilot-detail-value';val.textContent=String(value);
    field.append(label,val);content.appendChild(field);
  });
  modal.hidden=false;
  document.body.classList.add('copilot-detail-open');
  var close=modal.querySelector('.copilot-detail-close');if(close)close.focus();
}
function closeModal(){
  var modal=document.getElementById('copilot-record-detail-modal');
  if(!modal)return;
  modal.hidden=true;document.body.classList.remove('copilot-detail-open');
}
function installEvents(){
  if(installed||!document.body)return;
  installed=true;
  document.addEventListener('click',function(ev){
    var card=ev.target&&ev.target.closest&&ev.target.closest('.copilot-data-record[data-copilot-detail-id]');
    if(!card)return;
    if(ev.target.closest('a,button,input,select,textarea'))return;
    ev.preventDefault();showDetail(card.getAttribute('data-copilot-detail-id'));
  });
  document.addEventListener('keydown',function(ev){
    if(ev.key!=='Enter'&&ev.key!==' ')return;
    var card=ev.target&&ev.target.closest&&ev.target.closest('.copilot-data-record[data-copilot-detail-id]');
    if(!card)return;
    ev.preventDefault();showDetail(card.getAttribute('data-copilot-detail-id'));
  });
  var style=document.createElement('style');
  style.textContent='.copilot-detail-clickable{cursor:pointer;transition:border-color .15s,transform .15s,box-shadow .15s}.copilot-detail-clickable:hover,.copilot-detail-clickable:focus-visible{border-color:var(--blue,#5b9dff);box-shadow:0 0 0 2px color-mix(in srgb,var(--blue,#5b9dff) 20%,transparent);outline:none}.copilot-detail-clickable:after{content:"Ketuk untuk melihat detail";display:block;margin-top:7px;font-size:10px;color:var(--blue,#5b9dff)}.copilot-detail-modal[hidden]{display:none!important}.copilot-detail-modal{position:fixed;inset:0;z-index:12000;display:grid;place-items:center;padding:16px;padding-top:calc(16px + env(safe-area-inset-top,0px));padding-bottom:calc(16px + env(safe-area-inset-bottom,0px))}.copilot-detail-backdrop{position:absolute;inset:0;background:rgba(4,10,20,.72);backdrop-filter:blur(3px)}.copilot-detail-dialog{position:relative;display:flex;flex-direction:column;width:min(720px,100%);max-height:100%;background:var(--panel,#fff);color:var(--text,#111827);border:1px solid var(--line,#d1d5db);border-radius:16px;box-shadow:0 24px 70px rgba(0,0,0,.35);overflow:hidden}.copilot-detail-header{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:17px;border-bottom:1px solid var(--line,#d1d5db)}.copilot-detail-eyebrow{font-size:10px;letter-spacing:.09em;font-weight:800;color:var(--blue,#2563eb)}.copilot-detail-header h2{font-size:17px;line-height:1.35;margin:5px 0 3px;overflow-wrap:anywhere}.copilot-detail-source{font-size:11px;color:var(--text-dim,#64748b)}.copilot-detail-close{width:34px;height:34px;border:1px solid var(--line,#d1d5db);border-radius:9px;background:var(--panel-2,#f3f4f6);color:inherit;font-size:24px;line-height:1;cursor:pointer}.copilot-detail-content{padding:14px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:9px}.copilot-detail-field{min-width:0;border:1px solid var(--line,#d1d5db);border-radius:10px;padding:10px;background:var(--panel-2,rgba(128,128,128,.06))}.copilot-detail-label{font-size:10px;line-height:1.35;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim,#64748b);margin-bottom:5px;overflow-wrap:anywhere}.copilot-detail-value{font-size:12px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word}.copilot-detail-empty{grid-column:1/-1;color:var(--text-dim,#64748b)}.copilot-detail-footer{display:flex;justify-content:flex-end;padding:12px 14px;border-top:1px solid var(--line,#d1d5db)}@media(max-width:520px){.copilot-detail-modal{padding:8px;padding-top:calc(8px + env(safe-area-inset-top,0px));padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}.copilot-detail-dialog{border-radius:13px}.copilot-detail-header{padding:13px}.copilot-detail-content{padding:10px;grid-template-columns:1fr;gap:7px}}';
  document.head.appendChild(style);
}
function boot(){
  installEvents();installRenderer();
  var attempts=0;
  var timer=setInterval(function(){attempts++;if(installRenderer()||attempts>=40)clearInterval(timer);},100);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();


/* OMODOS REVIEW FIXES — 2026-10-17
   - unit-aware logbook material quantities
   - preserve line breaks in logbook descriptions
   - mobile-safe fullscreen/orientation behavior
   - material suggestions in the existing logbook edit modal
*/
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261017__) return;
window.__OMODOS_REVIEW_FIXES_20261017__ = true;

function esc(v){
  try { return typeof escapeHtml==='function' ? escapeHtml(String(v==null?'':v)) : String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
  catch(e){ return String(v==null?'':v); }
}
function addUnits(){
  const holder=document.getElementById('sparepart-rows');
  if(!holder) return;
  holder.querySelectorAll('.sparepart-row').forEach(row=>{
    const qtyField=row.querySelector('.sp-jumlah')?.closest('.field');
    if(!qtyField || row.querySelector('.sp-unit')) return;
    const id=Number(row.dataset.id);
    let data=null;
    try{ data=(typeof SPAREPART_ROWS!=='undefined' ? SPAREPART_ROWS.find(r=>Number(r.id)===id) : null); }catch(e){}
    const unit=String(data?.unit||'pcs');
    const options=['pcs','unit','set','kg','g','mg','ml','mL','L','liter','meter','m','cm','roll','botol','kaleng','pack','lembar','tube','drum','galon','box','pair','sachet'];
    if(unit && !options.includes(unit)) options.unshift(unit);
    const html='<div class="field sp-unit-field"><label>Satuan</label><select class="sp-unit" aria-label="Satuan jumlah material">'+options.map(o=>'<option value="'+o+'" '+(o===unit?'selected':'')+'>'+o+'</option>').join('')+'</select></div>';
    qtyField.insertAdjacentHTML('afterend',html);
    const select=row.querySelector('.sp-unit');
    if(select) select.addEventListener('change',()=>{ try{syncSparepartRowsFromDom();}catch(e){} });
    const qty=row.querySelector('.sp-jumlah');
    if(qty){ qty.removeAttribute('step'); qty.setAttribute('step','any'); qty.setAttribute('min','0.001'); qty.setAttribute('inputmode','decimal'); }
  });
}
const oldRender=window.renderSparepartRows;
if(typeof oldRender==='function'){
  window.renderSparepartRows=function(){
    const result=oldRender.apply(this,arguments);
    addUnits();
    return result;
  };
}
const oldSync=window.syncSparepartRowsFromDom;
if(typeof oldSync==='function'){
  window.syncSparepartRowsFromDom=function(){
    const result=oldSync.apply(this,arguments);
    try{
      const holder=document.getElementById('sparepart-rows');
      if(holder && typeof SPAREPART_ROWS!=='undefined'){
        holder.querySelectorAll('.sparepart-row').forEach(el=>{
          const row=SPAREPART_ROWS.find(r=>Number(r.id)===Number(el.dataset.id));
          if(row){ row.unit=el.querySelector('.sp-unit')?.value||row.unit||'pcs'; }
        });
      }
    }catch(e){}
    return result;
  };
}
const oldBuild=window.buildMaterialFieldsFromRows;
if(typeof oldBuild==='function'){
  window.buildMaterialFieldsFromRows=function(){
    const data=oldBuild.apply(this,arguments);
    if(data && Array.isArray(data.detail)){
      data.namaMaterial=data.detail.map(r=>{
        const name=String(r.nama||'').trim();
        const qty=String(r.jumlah||'').trim();
        const unit=String(r.unit||'pcs').trim()||'pcs';
        return name ? (qty ? name+' ('+qty+' '+unit+')' : name) : '';
      }).filter(Boolean).join('; ');
    }
    return data;
  };
}

/* Duplicate legacy material suggestion renderer removed; one cached picker is installed by V4 below. */
const style=document.createElement('style');
style.textContent=
  '.detail-row .v{white-space:pre-wrap;overflow-wrap:anywhere}'+
  '#entry-view-mode .detail-row .v,#modal-content .detail-row .v{white-space:pre-wrap;overflow-wrap:anywhere}'+
  '#entry-view-mode [data-edit-field="Deskripsi Masalah"],#entry-view-mode [data-edit-field="Tindakan Perbaikan"],#entry-view-mode [data-edit-field="Catatan Tambahan"]{white-space:pre-wrap;min-height:100px}'+
  '#sparepart-rows .sparepart-row{align-items:end}'+
  '#sparepart-rows .sp-unit-field{min-width:90px}'+
  '#entry-view-mode .sp-suggest-box.open{display:block}';
document.head.appendChild(style);

/* The legacy login helper was locking orientation to landscape and requesting
   fullscreen again on visibility changes. Disable that behavior on phones;
   never force a mobile device into landscape. */
if(typeof window.aktifkanFullscreen==='function'){
  window.aktifkanFullscreen=function(){
    const mobile=window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    if(mobile) return;
    const el=document.documentElement;
    try{
      if(!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(()=>{});
    }catch(e){}
  };
}
function init(){
  addUnits();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
/* addUnits is invoked by renderSparepartRows; edit suggestions are attached by the edit-form wrapper. */
})();


/* V2 duplicate picker removed; single indexed edit picker is installed below. */

/* OMODOS_REVIEW_FIXES_20261017_V3
   Preserve multiline job descriptions and protect an in-progress logbook form
   against accidental browser navigation/reload. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261017_V3__)return;
window.__OMODOS_REVIEW_FIXES_20261017_V3__=true;
function isMobile(){try{return window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;}catch(e){return window.innerWidth<768;}}
/* The original login helper calls screen.orientation.lock('landscape'). Prevent
   that lock on touch/mobile devices even if another legacy listener calls it. */
try{
  const orientation=screen.orientation;
  if(orientation&&typeof orientation.lock==='function'&&!orientation.lock.__omodosMobileGuard){
    const originalLock=orientation.lock.bind(orientation);
    const guarded=function(value){if(isMobile()&&String(value||'').toLowerCase().includes('landscape'))return Promise.resolve();return originalLock(value);};
    guarded.__omodosMobileGuard=true;
    orientation.lock=guarded;
  }
}catch(e){}
/* Let Enter create a real new line in logbook textareas, without parent form
   shortcuts intercepting the key; line breaks are retained in detail views. */
function bindMultiline(){
  document.querySelectorAll('#form-entry textarea[name="deskripsiMasalah"],#form-entry textarea[name="tindakanPerbaikan"],#form-entry textarea[name="catatan"],#entry-view-mode textarea[data-edit-field="Deskripsi Masalah"],#entry-view-mode textarea[data-edit-field="Tindakan Perbaikan"],#entry-view-mode textarea[data-edit-field="Catatan Tambahan"]').forEach(el=>{
    if(el.dataset.multilineEnterGuard==='1')return;
    el.dataset.multilineEnterGuard='1';
    el.addEventListener('keydown',ev=>{if(ev.key==='Enter'&&!ev.isComposing){ev.stopPropagation();}},true);
  });
}
/* Warn only when a user has actually changed logbook fields and is about to
   leave/reload. This does not silently reload or discard the entered text. */
function bindDirtyGuard(){
  const form=document.getElementById('form-entry');if(!form||form.dataset.dirtyGuard==='1')return;
  form.dataset.dirtyGuard='1';let dirty=false;
  form.addEventListener('input',()=>{dirty=true;});
  form.addEventListener('change',()=>{dirty=true;});
  form.addEventListener('reset',()=>{dirty=false;});
  form.addEventListener('submit',()=>{dirty=false;});
  window.addEventListener('beforeunload',ev=>{if(!dirty)return;ev.preventDefault();ev.returnValue='';});
}
function boot(){bindMultiline();bindDirtyGuard();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
/* Render wrappers and one-time boot replace the document-wide observer. */
})();


/* OMODOS_REVIEW_FIXES_20261017_V4
   Load the authoritative sparepart master before showing edit suggestions,
   keep selected units in the structured payload/legacy text, and avoid
   forcing mobile orientation. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261017_V4__)return;
window.__OMODOS_REVIEW_FIXES_20261017_V4__=true;
function mobile(){try{return matchMedia('(max-width: 767px), (pointer: coarse)').matches;}catch(e){return innerWidth<768;}}
/* Re-wrap fullscreen helper after all older hotfix layers have loaded. */
if(typeof window.aktifkanFullscreen==='function'){
 const safeFullscreen=function(){
   if(mobile())return;
   try{const el=document.documentElement;if(!document.fullscreenElement&&el.requestFullscreen)el.requestFullscreen().catch(()=>{});}catch(e){}
 };
 window.aktifkanFullscreen=safeFullscreen;
}
/* Edit-logbook material picker: refresh the master list if cache is empty,
   then populate results on focus (including an empty search) for touch users. */
function escape(v){try{return typeof escapeHtml==='function'?escapeHtml(String(v==null?'':v)):String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}catch(e){return '';}}
let materialPickerMasterRef_=null;
let materialPickerMasterLength_=-1;
let materialPickerNameIndex_=[];
let materialPickerSapIndex_=[];
function buildMaterialPickerIndex_(){
 let master=[];try{master=Array.isArray(SPAREPART_LOKASI)?SPAREPART_LOKASI:[];}catch(e){}
 if(master!==materialPickerMasterRef_||master.length!==materialPickerMasterLength_){
  const names=new Map(),saps=new Map();
  for(const row of master){
   if(!row||typeof row!=='object')continue;
   const name=String(row.nama||'').trim(),sap=String(row.sap||'').trim();
   const nk=name.toLocaleLowerCase('id'),sk=sap.toLocaleLowerCase('id');
   if(nk&&!names.has(nk))names.set(nk,{row,key:nk});
   if(sk&&!saps.has(sk))saps.set(sk,{row,key:sk});
  }
  materialPickerMasterRef_=master;materialPickerMasterLength_=master.length;
  materialPickerNameIndex_=Array.from(names.values());materialPickerSapIndex_=Array.from(saps.values());
 }
 return {master,name:materialPickerNameIndex_,sap:materialPickerSapIndex_};
}
function bindEditPicker(){
 const holder=document.getElementById('entry-view-mode');if(!holder)return;
 const name=holder.querySelector('[data-edit-field="Nama Material"]');
 const sap=holder.querySelector('[data-edit-field="Material Number SAP"]');
 if(!name||!sap)return;
 [name,sap].forEach(input=>{
  const field=input.closest('.field');if(!field)return;
  field.querySelectorAll('.sp-suggest-box').forEach(box=>{if(!box.classList.contains('omodos-edit-material-picker'))box.remove();});
  let box=field.querySelector('.omodos-edit-material-picker');
  if(!box){box=document.createElement('div');box.className='sp-suggest-box omodos-edit-material-picker';box.style.cssText='display:none;position:absolute;z-index:10040;left:0;right:0;top:100%;max-height:240px;overflow:auto;background:var(--panel,#fff);border:1px solid var(--line,#d1d5db);border-radius:9px;box-shadow:0 8px 24px rgba(0,0,0,.18);';field.style.position='relative';field.appendChild(box);}
  if(input.dataset.materialPickerV4==='1')return;
  input.dataset.materialPickerV4='1';
  const byName=input===name;let items=[],timer=null;
  const render=()=>{
   const idx=buildMaterialPickerIndex_(),query=String(input.value||'').trim().toLocaleLowerCase('id');
   const candidates=byName?idx.name:idx.sap;items=[];
   for(const candidate of candidates){if(query&&!candidate.key.includes(query))continue;items.push(candidate.row);if(items.length>=30)break;}
   if(!items.length){box.innerHTML='<div style="padding:10px 12px;color:var(--text-dim)">'+(idx.master.length?'Tidak ada material yang cocok.':'Master material belum termuat. Coba fokuskan kembali setelah koneksi tersedia.')+'</div>';box.classList.add('open');return;}
   box.innerHTML=items.map((x,i)=>'<button type="button" data-v4-pick="'+i+'" style="display:flex;width:100%;text-align:left;flex-direction:column;gap:2px;padding:10px 12px;border:0;border-bottom:1px solid var(--line,#e5e7eb);background:transparent;color:inherit;cursor:pointer"><span>'+escape(byName?x.nama:x.sap)+'</span><small>'+escape(byName?('SAP: '+(x.sap||'-')):(x.nama||'Nama material belum tersedia'))+'</small></button>').join('');
   box.classList.add('open');
  };
  const loadThenRender=async()=>{
   let master=[];try{master=Array.isArray(SPAREPART_LOKASI)?SPAREPART_LOKASI:[];}catch(e){}
   if(!master.length&&typeof syncSparepartLokasiFromBackend==='function'){try{await syncSparepartLokasiFromBackend();}catch(e){}}
   render();
  };
  input.addEventListener('focus',loadThenRender);
  input.addEventListener('input',()=>{if(timer)clearTimeout(timer);timer=setTimeout(render,110);});
  input.addEventListener('keydown',ev=>{if(ev.key==='Escape'){box.classList.remove('open');box.innerHTML='';}});
  box.addEventListener('pointerdown',ev=>{const opt=ev.target.closest('[data-v4-pick]');if(!opt)return;ev.preventDefault();const item=items[Number(opt.dataset.v4Pick)];if(!item)return;name.value=item.nama||'';sap.value=item.sap||'';box.classList.remove('open');box.innerHTML='';name.dispatchEvent(new Event('input',{bubbles:true}));sap.dispatchEvent(new Event('input',{bubbles:true}));});
  input.addEventListener('blur',()=>setTimeout(()=>{if(!box.contains(document.activeElement)){box.classList.remove('open');box.innerHTML='';}},300));
 });
}
const renderEditBeforePickerV4_=window.renderEntryEditForm;
if(typeof renderEditBeforePickerV4_==='function'&&!renderEditBeforePickerV4_.__materialPickerV4){const wrapped=function(){const result=renderEditBeforePickerV4_.apply(this,arguments);bindEditPicker();return result;};wrapped.__materialPickerV4=true;window.renderEntryEditForm=wrapped;}
function boot(){bindEditPicker();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
/* Render wrappers and one-time boot replace the document-wide observer. */
/* Ensure quantity is decimal-capable and keep units reflected in every
   material detail before the legacy-compatible logbook payload is assembled. */
const prevBuild=window.buildMaterialFieldsFromRows;
if(typeof prevBuild==='function'&&!prevBuild.__unitV4){
 const wrapped=function(){
   try{if(typeof syncSparepartRowsFromDom==='function')syncSparepartRowsFromDom();}catch(e){}
   const data=prevBuild.apply(this,arguments);
   if(data&&Array.isArray(data.detail)){
     data.detail=data.detail.map(r=>({...r,unit:String(r.unit||'pcs').trim()||'pcs'}));
     data.namaMaterial=data.detail.map(r=>{const n=String(r.nama||'').trim(),q=String(r.jumlah||'').trim(),u=String(r.unit||'pcs').trim();return n?(q?n+' ('+q+' '+u+')':n):'';}).filter(Boolean).join('; ');
   }
   return data;
 };
 wrapped.__unitV4=true;window.buildMaterialFieldsFromRows=wrapped;
}
const css=document.createElement('style');
css.textContent='#form-entry textarea[name="deskripsiMasalah"],#form-entry textarea[name="tindakanPerbaikan"],#form-entry textarea[name="catatan"],#entry-view-mode textarea{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55}.omodos-edit-material-picker.open{display:block!important}';
document.head.appendChild(css);
})();


/* OMODOS_REVIEW_FIXES_20261018_V5
   Flush the existing logbook draft immediately on lifecycle transitions.
   This does not trigger reloads; it reduces the chance that a sudden browser
   refresh/background suspension loses the last few seconds of typing. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261018_V5__)return;
window.__OMODOS_REVIEW_FIXES_20261018_V5__=true;
function flushLogbookDraft(){
  try{
    if(typeof formEntryDraftSaveTimer!=='undefined' && formEntryDraftSaveTimer){
      clearTimeout(formEntryDraftSaveTimer);
      formEntryDraftSaveTimer=null;
    }
  }catch(e){}
  try{
    if(typeof saveFormEntryDraft==='function') saveFormEntryDraft();
  }catch(e){}
}
function bind(){
  const form=document.getElementById('form-entry');
  if(form && form.dataset.lifecycleDraftFlush!=='1'){
    form.dataset.lifecycleDraftFlush='1';
    ['input','change'].forEach(type=>form.addEventListener(type,()=>{
      try{
        if(typeof saveFormEntryDraftDebounced==='function') saveFormEntryDraftDebounced();
        else if(typeof saveFormEntryDraft==='function') saveFormEntryDraft();
      }catch(e){}
    },{capture:true}));
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();

window.addEventListener('pagehide',flushLogbookDraft,{capture:true});
window.addEventListener('beforeunload',flushLogbookDraft,{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushLogbookDraft();},{capture:true});
})();


/* OMODOS_REVIEW_FIXES_20261018_V6
   Prevent accidental native form submission from helper buttons.
   Only the explicit "Simpan Logbook" control may submit the logbook form.
   Draft persistence remains handled by the existing draft system and V5. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261018_V6__)return;
window.__OMODOS_REVIEW_FIXES_20261018_V6__=true;
function guardForm(){
  const form=document.getElementById('form-entry');
  if(!form)return;
  form.querySelectorAll('button:not([type])').forEach(button=>{
    if(button.id==='btn-submit')return;
    button.type='button';
    button.dataset.omodosExplicitButtonType='1';
  });
  if(form.dataset.omodosSubmitGuard!=='1'){
    form.dataset.omodosSubmitGuard='1';
    form.addEventListener('submit',function(ev){
      const submitter=ev.submitter;
      if(!submitter || submitter.id!=='btn-submit'){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        if(typeof window.toast==='function')window.toast('Pengiriman form dibatalkan untuk mencegah submit tidak sengaja. Gunakan tombol Simpan Logbook.',true);
      }
    },true);
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',guardForm,{once:true});else guardForm();

})();


/* OMODOS_REVIEW_FIXES_20261018_V7
   Hard block legacy landscape/fullscreen requests on mobile at the browser API
   boundary. The old visibilitychange and first-click listeners call a lexical
   helper, so replacing only window.aktifkanFullscreen is not sufficient. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261018_V7__)return;
window.__OMODOS_REVIEW_FIXES_20261018_V7__=true;
function isMobile(){
  try{return matchMedia('(max-width: 767px), (pointer: coarse)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);}
  catch(e){return innerWidth<768;}
}
try{
  const orientation=screen.orientation;
  if(orientation&&typeof orientation.lock==='function'&&!orientation.lock.__omodosOrientationGuardV7){
    const original=orientation.lock.bind(orientation);
    const guarded=function(value){
      if(isMobile()&&/landscape/i.test(String(value||'')))return Promise.resolve();
      return original(value);
    };
    guarded.__omodosOrientationGuardV7=true;
    try{Object.defineProperty(orientation,'lock',{configurable:true,writable:true,value:guarded});}
    catch(e){try{orientation.lock=guarded;}catch(ignore){}}
  }
}catch(e){}
try{
  const proto=Element.prototype;
  const original=proto.requestFullscreen;
  if(typeof original==='function'&&!original.__omodosFullscreenGuardV7){
    const guarded=function(){
      if(isMobile())return Promise.resolve();
      return original.apply(this,arguments);
    };
    guarded.__omodosFullscreenGuardV7=true;
    Object.defineProperty(proto,'requestFullscreen',{configurable:true,writable:true,value:guarded});
  }
}catch(e){}
function unlockMobile(){
  if(!isMobile())return;
  try{if(screen.orientation&&typeof screen.orientation.unlock==='function')screen.orientation.unlock();}catch(e){}
}
unlockMobile();
window.addEventListener('pageshow',unlockMobile,{passive:true});
window.addEventListener('orientationchange',unlockMobile,{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')unlockMobile();},{passive:true});
})();


/* OMODOS_REVIEW_FIXES_20261018_V8
   Prevent implicit Enter/native form submits with no explicit submitter. Those
   can navigate to the form action and look like an unexpected application reload. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261018_V8__)return;
window.__OMODOS_REVIEW_FIXES_20261018_V8__=true;
function bind(){
  const form=document.getElementById('form-entry');
  if(!form || form.dataset.omodosImplicitSubmitGuard==='1')return;
  form.dataset.omodosImplicitSubmitGuard='1';
  form.addEventListener('submit',function(ev){
    if(!ev.submitter || ev.submitter.id!=='btn-submit'){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      if(typeof window.toast==='function')window.toast('Form tidak dikirim otomatis. Gunakan tombol Simpan Logbook.',true);
    }
  },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();

})();


/* OMODOS_REVIEW_FIXES_20261018_V9
   Ignore stale auth failures and avoid forced reload when the current session
   expires. Explicit user logout retains the original reload behavior. */
(function(){
'use strict';
if(window.__OMODOS_REVIEW_FIXES_20261018_V9__)return;
window.__OMODOS_REVIEW_FIXES_20261018_V9__=true;

const originalLogout=window.logoutUser;
if(typeof originalLogout==='function'){
  window.logoutUser=function(options){
    options=options||{};
    if(options.reload !== false)return originalLogout.apply(this,arguments);
    try{
      if(typeof deactivateAccountDataCaches_==='function')
        deactivateAccountDataCaches_(CURRENT_USER&&CURRENT_USER.username);
    }catch(e){
      if(typeof toast==='function')toast('Sesi belum dapat ditutup dengan aman karena cache lokal gagal diamankan. Coba lagi.',true);
      return;
    }
    const tokenToRevoke=SESSION_TOKEN;
    if(tokenToRevoke&&WEB_APP_URL){
      fetch(WEB_APP_URL,{
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8'},
        body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke}),
        keepalive:true
      }).catch(()=>{});
    }
    CURRENT_USER=null;
    SESSION_TOKEN='';
    SESSION_EXPIRES_AT='';
    PERMISSIONS={};
    FEATURE_REGISTRY=[];
    try{
      localStorage.removeItem(SS_USER_KEY);
      localStorage.removeItem(SS_TOKEN_KEY);
      localStorage.removeItem(SS_TOKEN_EXP_KEY);
      localStorage.removeItem(LS_PERM_KEY);
      localStorage.removeItem(LS_FEATURES_KEY);
    }catch(e){}
    try{if(typeof resetSettingAuth==='function')resetSettingAuth();}catch(e){}
    const gate=document.getElementById('login-gate');
    const appRoot=document.getElementById('app-root');
    if(appRoot)appRoot.classList.remove('unlocked','dash-mode','menu-visible');
    if(gate){gate.style.display='';gate.style.opacity='1';}
    const form=document.getElementById('form-login');
    if(form)form.reset();
    const errEl=document.getElementById('login-err');
    if(errEl)errEl.textContent='';
    const userField=document.getElementById('login-username');
    if(userField)setTimeout(()=>userField.focus(),50);
    try{READY_READS.clear();ACTIVE_READS.clear();READ_GENERATION++;}catch(e){}
    /* No location.reload(): show the login gate in the current document. */
  };
}

const originalAuthFailure=window.handleApiAuthFailure_;
if(typeof originalAuthFailure==='function'){
  window.handleApiAuthFailure_=function(message,requestToken){
    const msg=String(message||'');
    if(!/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(msg))
      return originalAuthFailure.apply(this,arguments);

    const activeToken=(SETTING_AUTH_OK&&SETTING_SESSION_TOKEN)?SETTING_SESSION_TOKEN:SESSION_TOKEN;
    /* Ignore late failures from a request made under an older session. */
    if(requestToken && requestToken !== SESSION_TOKEN && requestToken !== SETTING_SESSION_TOKEN)return;

    if(SETTING_AUTH_OK&&SETTING_SESSION_TOKEN&&requestToken===SETTING_SESSION_TOKEN){
      resetSettingAuth();
      return;
    }
    if(requestToken && requestToken !== activeToken)return;
    if(typeof window.logoutUser==='function')
      return window.logoutUser({reload:false,reason:'session-expired'});
    return originalAuthFailure.apply(this,arguments);
  };
}
})();


/* OMODOS Superadmin-only embedded factory status home.
   Ordinary roles keep their existing homepage. */
(function(){
  'use strict';
  if(window.__OMODOS_FACTORY_HOME_GUARD__)return;
  window.__OMODOS_FACTORY_HOME_GUARD__=true;
  function user(){try{if(typeof CURRENT_USER!=='undefined'&&CURRENT_USER)return CURRENT_USER;}catch(e){}return window.CURRENT_USER||window.currentUser||null;}
  function allowed(){const u=user(),role=String(u&&(u.role||u.Role||u.roleName||u.role_name||u.level)||'').toLowerCase().replace(/[\s_-]+/g,'');return role==='superadmin';}
  function removeView(){document.querySelectorAll('#omodos-superadmin-factory-home').forEach(node=>{const view=node.closest('.view');node.remove();if(view)view.classList.remove('omodos-superadmin-factory-home');});document.documentElement.classList.remove('omodos-superadmin-factory-home');}
  function sync(){
    if(!allowed()){removeView();return;}
    if(typeof window.OMODOS_FACTORY_HOME_SYNC==='function'){window.OMODOS_FACTORY_HOME_SYNC();return;}
    if(document.querySelector('script[data-omodos-factory-home-script]'))return;
    const script=document.createElement('script');script.src='/omodos4/factory-home-superadmin.js?v=smart-resume-21';script.async=true;script.dataset.omodosFactoryHomeScript='1';
    script.onload=()=>{try{window.OMODOS_FACTORY_HOME_SYNC?.();}catch(e){}};script.onerror=()=>{script.remove();};(document.head||document.documentElement).appendChild(script);
  }
  document.addEventListener('DOMContentLoaded',sync);window.addEventListener('pageshow',sync);window.addEventListener('focus',sync);setInterval(sync,1200);sync();
})();

/* LOGBOOK_REVIEW_FIXES_20261021_V1 — custom area, MO, edit photos, incremental refresh and memory-safe PDF export. */
(function(){
'use strict';
if(window.__OMODOS_LOGBOOK_REVIEW_20261021_V1__)return;
window.__OMODOS_LOGBOOK_REVIEW_20261021_V1__=true;
const byId=id=>document.getElementById(id),q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>{try{return typeof escapeHtml==='function'?escapeHtml(String(v==null?'':v)):String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}catch(e){return String(v==null?'':v);}};
const pendingEditPhotos=new Map();
function notice(m,b){if(typeof window.toast==='function')window.toast(m,!!b);else if(b)console.error('[OMODOS Logbook]',m);}
function installMoField(){
 const form=byId('form-entry'),n=form&&q('[name="nomorNotifikasi"]',form);if(!form||!n||q('#input-nomorMO',form))return;
 const d=document.createElement('div');d.className='field';d.id='field-nomorMO';d.innerHTML='<label for="input-nomorMO">Nomor MO (Maintenance Order, opsional)</label><input type="text" id="input-nomorMO" name="nomorMO" autocomplete="off" placeholder="Contoh: 4000123456">';
 n.closest('.field')?.insertAdjacentElement('afterend',d);
}
function dateValue(v){const s=String(v==null?'':v).trim();if(!s)return null;let d=new Date(s);if(!Number.isNaN(d.getTime()))return d;const m=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);if(m){d=new Date(+m[3],+m[2]-1,+m[1]);if(!Number.isNaN(d.getTime()))return d;}return null;}
window.refreshLogbookLocal_=function(entry,saved,mode){
 try{
  const add=mode==='add',id=String(add?(saved&&(saved.id||saved.ID)||entry.ID||entry.id||''):(entry.ID||entry.id||''));
  const rows=Array.isArray(window.ENTRIES)?window.ENTRIES:[];let row=rows.find(x=>String(x.ID||x.id||'')===id)||{ID:id};
  const map={tanggal:'Tanggal',waktu:'Waktu',shift:'Shift',namaPelapor:'Nama Pelapor',personilTambahanStr:'Personil Tambahan',semuaPersonil:'Semua Personil',kodeMesin:'Kode Mesin',namaMesin:'Nama Mesin',namaUnit:'Nama Unit',lokasiPekerjaan:'Lokasi Pekerjaan',kategoriArea:'Kategori Area',namaArea:'Nama Area',lokasi:'Lokasi/Area',jenisPekerjaan:'Jenis Pekerjaan',prioritas:'Prioritas',deskripsiMasalah:'Deskripsi Masalah',tindakanPerbaikan:'Tindakan Perbaikan',sparePart:'Spare Part Digunakan',namaMaterial:'Nama Material',materialNumberSAP:'Material Number SAP',status:'Status',jamMulai:'Jam Mulai',jamSelesai:'Jam Selesai',downtime:'Downtime (menit)',catatan:'Catatan Tambahan',menyebabkanDowntime:'Menyebabkan Downtime',durasiPekerjaan:'Durasi Pekerjaan (menit)',groupingPekerjaan:'Grouping Pekerjaan',groupingTeam:'Grouping Team',nomorNotifikasi:'Nomor Notifikasi Pekerjaan',nomorMO:'Nomor MO'};
  Object.entries(map).forEach(([a,b])=>{if(Object.prototype.hasOwnProperty.call(entry,a))row[b]=entry[a];});
  if(add){row.ID=id;row['Timestamp Input']=new Date().toISOString();row.Timestamp=row.Timestamp||row['Timestamp Input'];}
  if(saved&&Array.isArray(saved.attachments))row['Lampiran (JSON)']=JSON.stringify(saved.attachments);else if(add)row['Lampiran (JSON)']='[]';
  if(id&&!rows.some(x=>String(x.ID||x.id||'')===id))rows.unshift(row);
  rows.sort((a,b)=>{const da=dateValue(a['Timestamp Input']||a.Timestamp||a.Tanggal),db=dateValue(b['Timestamp Input']||b.Timestamp||b.Tanggal);return(db?db.getTime():0)-(da?da.getTime():0);});
  if(typeof window.invalidateLogbookSortCache_==='function')window.invalidateLogbookSortCache_();
  window.ENTRIES=rows;
  try{if(typeof renderDashboardCriticalSummary==='function')renderDashboardCriticalSummary();}catch(e){}
  try{if(typeof renderHomeSmartResume==='function')renderHomeSmartResume();}catch(e){}
  return row;
 }catch(e){console.warn('[OMODOS] Logbook local refresh failed',e);return null;}
};
function loadImage(file){return new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(Error('Foto gagal dibaca.'));r.onload=()=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('Foto tidak dapat dibuka. Pilih JPG/PNG.'));img.src=String(r.result);};r.readAsDataURL(file);});}
async function compressEditPhoto(file){
 if(!file||!String(file.type||'').toLowerCase().startsWith('image/'))throw Error('Pilih foto yang didukung browser.');
 if(file.size>40*1024*1024)throw Error('Ukuran foto awal maksimal 40 MB.');
 let bitmap=null,img=null;
 try{
  if(typeof createImageBitmap==='function'){try{bitmap=await createImageBitmap(file);}catch(e){}}
  if(!bitmap)img=await loadImage(file);
  const w=bitmap?bitmap.width:img.naturalWidth,h=bitmap?bitmap.height:img.naturalHeight,scale=Math.min(1,1600/Math.max(w,h));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(w*scale));canvas.height=Math.max(1,Math.round(h*scale));
  const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)throw Error('Browser tidak dapat menyiapkan kompresi foto.');
  ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap||img,0,0,canvas.width,canvas.height);
  const blob=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Kompresi foto gagal.')),'image/jpeg',0.78));
  canvas.width=0;canvas.height=0;if(bitmap){bitmap.close?.();bitmap=null;}img=null;
  if(blob.size>8.5*1024*1024)throw Error('Foto masih lebih dari 8,5 MB setelah dikompres. Pilih foto lebih kecil.');
  const base64=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result).split(',')[1]||'');r.onerror=()=>reject(Error('Hasil foto gagal dibaca.'));r.readAsDataURL(blob);});
  return{name:String(file.name||'foto-logbook').replace(/\.[^.]+$/,'')+'.jpg',mimeType:'image/jpeg',base64,localUrl:URL.createObjectURL(blob)};
 }catch(e){if(bitmap)bitmap.close?.();throw e;}
}
function getAttachments(entry){try{const raw=entry&&entry['Lampiran (JSON)'];const x=Array.isArray(raw)?raw:JSON.parse(String(raw||'[]'));return Array.isArray(x)?x:[];}catch(e){return[];}}
function isImageFile(f){return/image/i.test(String(f&&(f.mimeType||f.type)||''))||/\.(jpe?g|png|webp)(\?|$)/i.test(String(f&&(f.viewUrl||f.previewUrl||f.thumbUrl)||''));}
function renderEditPhotos(holder,entry,id){
 const host=q('[data-edit-photo-preview]',holder);if(!host)return;
 const old=getAttachments(entry).filter(f=>isImageFile(f)&&(f.viewUrl||f.previewUrl||f.thumbUrl)),pending=pendingEditPhotos.get(String(id))||[];
 const showingAll=host.dataset.showAllOldPhotos==='1';
 const visibleOld=showingAll?old:old.slice(0,6);
 const remaining=old.length-visibleOld.length;
 const oldCards=visibleOld.map((f,i)=>{
  const url=f.viewUrl||f.previewUrl||f.thumbUrl||'';
  if(!url)return '';
  const thumb=[f.thumbUrl,f.previewUrl].find(candidate=>candidate&&candidate!==url)||'';
  const preview=thumb?'<img src="'+esc(thumb)+'" alt="Foto tersimpan" loading="lazy" decoding="async" fetchpriority="low">':'<span style="display:flex;align-items:center;justify-content:center;width:100px;height:76px;border-radius:5px;background:var(--panel-2,#f0f4f7);font-size:10px;text-align:center;padding:4px">Buka foto tersimpan</span>';
  return '<a class="omodos-edit-photo-current" href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">'+preview+'<span>Foto lama '+(i+1)+'</span></a>';
 }).filter(Boolean);
 const newCards=pending.map((f,i)=>'<div class="omodos-edit-photo-current"><img src="'+esc(f.localUrl)+'" alt="Foto baru" loading="lazy" decoding="async"><span>Foto baru '+(i+1)+'</span><button type="button" data-edit-photo-remove="'+i+'">Hapus</button></div>');
 host.innerHTML=[...visibleOld,...newCards,remaining?'<button type="button" class="btn btn-ghost btn-sm" data-edit-photo-show-all>Tampilkan '+remaining+' foto lama lainnya</button>':''].join('')||'<span class="omodos-edit-photo-empty">Belum ada foto.</span>';
 const showAll=host.querySelector('[data-edit-photo-show-all]');
 if(showAll)showAll.addEventListener('click',()=>{host.dataset.showAllOldPhotos='1';renderEditPhotos(holder,entry,id);});
 qa('[data-edit-photo-remove]',host).forEach(btn=>btn.addEventListener('click',()=>{const files=pendingEditPhotos.get(String(id))||[],removed=files.splice(+btn.dataset.editPhotoRemove,1)[0];if(removed&&removed.localUrl)URL.revokeObjectURL(removed.localUrl);pendingEditPhotos.set(String(id),files);renderEditPhotos(holder,entry,id);}));
}
function attachEditUi(entry){
 const holder=byId('entry-view-mode');if(!holder||!q('#btn-save-entry-edit',holder))return;const id=String(entry&&(entry.ID||entry.id)||'');if(!id)return;
 if(!q('[data-edit-field="Nomor MO"]',holder)){const n=q('[data-edit-field="Nomor Notifikasi Pekerjaan"]',holder),field=document.createElement('div');field.className='field';field.dataset.editWrap='Nomor MO';field.innerHTML='<label for="edit-nomorMO">Nomor MO (Maintenance Order, opsional)</label><input type="text" id="edit-nomorMO" data-edit-field="Nomor MO" value="'+esc(entry['Nomor MO']||'')+'" placeholder="Contoh: 4000123456" autocomplete="off">';if(n&&n.closest('.field'))n.closest('.field').insertAdjacentElement('afterend',field);else(q('.grid2',holder)||holder).appendChild(field);}
 const kind=q('#edit-location-kind',holder),category=q('#edit-area-category',holder),area=q('#edit-area-name',holder);
 if(category&&!Array.from(category.options).some(o=>o.value==='Lainnya'))category.add(new Option('Lainnya','Lainnya'));
 if(!q('#field-edit-area-lainnya',holder)){const f=document.createElement('div');f.className='field';f.id='field-edit-area-lainnya';f.innerHTML='<label for="input-edit-namaArea-lainnya">Nama Area Lainnya</label><input type="text" id="input-edit-namaArea-lainnya" autocomplete="off" placeholder="Masukkan nama area...">';const ar=byId('edit-area-name-wrap');if(ar)ar.insertAdjacentElement('afterend',f);else(q('.grid3',holder)||holder).appendChild(f);}
 const other=q('#input-edit-namaArea-lainnya',holder),otherWrap=q('#field-edit-area-lainnya',holder),catValue=String(entry['Kategori Area']||'').trim(),areaValue=String(entry['Nama Area']||'').trim();
 if(category&&catValue){if(!Array.from(category.options).some(o=>o.value===catValue))category.add(new Option(catValue,catValue));category.value=catValue;}
 if(category&&area&&areaValue){try{if(typeof populateWorkAreaOptions_==='function')populateWorkAreaOptions_(category.value,area,areaValue);}catch(e){}if(!Array.from(area.options).some(o=>o.value===areaValue)){area.value='Lainnya';if(other)other.value=areaValue;}else if(other)other.value='';}
 const sync=()=>{const visible=!!(kind&&kind.value==='Area'&&area&&area.value==='Lainnya');if(otherWrap)otherWrap.hidden=!visible;if(other){other.disabled=!visible;other.required=visible;}};
 kind?.addEventListener('change',sync);category?.addEventListener('change',()=>setTimeout(sync,0));area?.addEventListener('change',sync);sync();
 if(!q('#edit-entry-photo-input',holder)){const panel=document.createElement('div');panel.className='field omodos-edit-photo-panel';panel.innerHTML='<label for="edit-entry-photo-input">Foto Bukti Pekerjaan</label><div class="sub" style="margin:0 0 8px">Foto lama tetap tersimpan; foto baru dikompres sebelum diunggah.</div><input type="file" id="edit-entry-photo-input" accept="image/*" multiple><div class="omodos-edit-photo-grid" data-edit-photo-preview></div>';const actions=q('#btn-save-entry-edit',holder)?.closest('div');actions?.insertAdjacentElement('beforebegin',panel);q('#edit-entry-photo-input',holder)?.addEventListener('change',async ev=>{const selected=Array.from(ev.target.files||[]).filter(f=>String(f.type||'').startsWith('image/'));ev.target.value='';if(!selected.length)return;const pending=pendingEditPhotos.get(id)||[];for(const file of selected){try{notice('Mengompres foto '+file.name+'...');pending.push(await compressEditPhoto(file));notice('Foto siap diunggah bersama perubahan Logbook.');}catch(error){notice(error.message||'Foto gagal diproses.',true);}}pendingEditPhotos.set(id,pending);renderEditPhotos(holder,entry,id);});}
 renderEditPhotos(holder,entry,id);
}
const renderEdit=window.renderEntryEditForm;
if(typeof renderEdit==='function'&&!renderEdit.__logbookReviewV1){const wrapped=function(){const result=renderEdit.apply(this,arguments);try{attachEditUi(arguments[0]||{});}catch(e){console.warn('[OMODOS] Edit Logbook UI not ready',e);}return result;};wrapped.__logbookReviewV1=true;window.renderEntryEditForm=wrapped;}
window.takeLogbookEditFiles_=id=>(pendingEditPhotos.get(String(id))||[]).map(({name,mimeType,base64})=>({name,mimeType,base64}));
window.clearLogbookEditFiles_=id=>{(pendingEditPhotos.get(String(id))||[]).forEach(f=>{if(f.localUrl)URL.revokeObjectURL(f.localUrl);});pendingEditPhotos.delete(String(id));};

function installPdfButton(){
 const host=q('#view-utama .topbar');if(!host||byId('btn-logbook-export-pdf'))return;
 const btn=document.createElement('button');btn.type='button';btn.id='btn-logbook-export-pdf';btn.className='btn btn-sm';btn.innerHTML='<i class="ph-bold ph-file-pdf"></i> Export PDF Logbook';btn.addEventListener('click',()=>showPdfDialog());
 const stat=q('#stat-strip',host);if(stat)stat.insertAdjacentElement('afterend',btn);else host.appendChild(btn);
}
function pdfHtmlEscape_(v){return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function logbookMachineChoices_(){
 const found=new Map();
 const add=(codeValue,nameValue)=>{
  const code=String(codeValue||'').trim().toLocaleLowerCase('id');
  const name=String(nameValue||'').trim().toLocaleLowerCase('id');
  const cleanCode=/^[—–-]+$/.test(code)?'':code;
  const cleanName=/^[—–-]+$/.test(name)?'':name;
  if(!cleanCode&&!cleanName)return;
  const key=cleanCode?'c:'+cleanCode:'n:'+cleanName;
  if(!found.has(key))found.set(key,{key,code:cleanCode,name:cleanName,label:[codeValue,nameValue].map(x=>String(x||'').trim()).filter(x=>x&&!/^[—–-]+$/.test(x)).join(' — ')});
 };
 try{if(typeof MACHINES!=='undefined'&&Array.isArray(MACHINES))MACHINES.forEach(m=>add(m['Kode Mesin']||m.kodeMesin,m['Nama Mesin']||m.namaMesin));}catch(e){}
 const rows=Array.isArray(window.ENTRIES)?window.ENTRIES:(typeof ENTRIES!=='undefined'&&Array.isArray(ENTRIES)?ENTRIES:[]);
 rows.forEach(e=>{if(String(e['Lokasi Pekerjaan']||'').toLowerCase()!=='area')add(e['Kode Mesin'],e['Nama Mesin']);});
 return Array.from(found.values()).sort((a,b)=>a.label.localeCompare(b.label,'id'));
}
function logbookExportTimestamp_(e){
 if(!e||typeof e!=='object')return null;
 const raw=e['Timestamp Input']||e.Timestamp||e.timestamp||e['Created At']||e.CreatedAt;
 if(raw){const direct=raw instanceof Date?new Date(raw.getTime()):new Date(raw);if(Number.isFinite(direct.getTime()))return direct;}
 const date=String(e['Tanggal']||e.tanggal||'').trim();
 const time=String(e['Waktu']||e.waktu||'00:00').trim();
 const hm=time.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);
 let d=new Date(date+'T'+(hm?String(hm[1]).padStart(2,'0')+':'+hm[2]+':'+(hm[3]||'00'):'00:00:00'));
 if(Number.isFinite(d.getTime()))return d;
 const m=date.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
 if(m){d=new Date(+m[3],+m[2]-1,+m[1],hm?+hm[1]:0,hm?+hm[2]:0,hm&&hm[3]?+hm[3]:0);if(Number.isFinite(d.getTime()))return d;}
 return null;
}
function showPdfDialog(options){
 options=options||{};
 const singleId=options.entryId==null?'':String(options.entryId);
 if(byId('omodos-logbook-pdf-modal'))return;
 const m=document.createElement('div');m.id='omodos-logbook-pdf-modal';m.className='omodos-logbook-pdf-overlay';
 const isSingle=!!singleId;
 const machineChoices=logbookMachineChoices_();
 const machineOptions='<option value="">Semua mesin / area</option>'+machineChoices.map(x=>'<option value="'+pdfHtmlEscape_(x.key)+'" data-code="'+pdfHtmlEscape_(x.code)+'" data-name="'+pdfHtmlEscape_(x.name)+'">'+pdfHtmlEscape_(x.label)+'</option>').join('');
 const filters=isSingle?'':'<div id="omodos-logbook-pdf-filters"><label for="omodos-logbook-pdf-period">Periode laporan</label><select id="omodos-logbook-pdf-period"><option value="90">90 hari terakhir</option><option value="24h">24 jam terakhir</option><option value="30">30 hari terakhir</option><option value="year">Tahun berjalan</option><option value="all">Semua data yang tersedia</option></select><label for="omodos-logbook-pdf-machine" style="margin-top:12px">Mesin (opsional)</label><select id="omodos-logbook-pdf-machine">'+machineOptions+'</select></div>';
 m.innerHTML='<section class="omodos-logbook-pdf-dialog" role="dialog" aria-modal="true" aria-labelledby="omodos-logbook-pdf-title"><div class="omodos-logbook-pdf-heading"><div><strong id="omodos-logbook-pdf-title">'+(isSingle?'Export Detail Logbook':'Export Report Logbook')+'</strong><p>'+(isSingle?'PDF hanya berisi catatan yang sedang dibuka.':'Pilih periode dan/atau mesin. Filter mesin dapat digabung dengan periode.')+'</p></div><button type="button" data-pdf-close aria-label="Tutup">×</button></div>'+filters+'<div class="omodos-logbook-pdf-actions"><button type="button" class="btn btn-ghost btn-sm" data-pdf-close>Batal</button><button type="button" class="btn btn-primary btn-sm" id="btn-logbook-pdf-download">Unduh PDF</button></div><p class="omodos-logbook-pdf-note">Termasuk tanggal/waktu, mesin atau area, status, uraian, tindakan, nomor notifikasi, MO dan catatan.</p></section>';
 m.dataset.entryId=singleId;
 document.body.appendChild(m);
 qa('[data-pdf-close]',m).forEach(b=>b.addEventListener('click',()=>m.remove()));
 m.addEventListener('click',e=>{if(e.target===m)m.remove();});
 byId('btn-logbook-pdf-download').addEventListener('click',()=>exportPdf(m));
}
window.exportLogbookPdfForEntry_=function(id){showPdfDialog({entryId:id});};
function safePdfText(v){return String(v==null||v===''?'-':v).replace(/\r/g,'').replace(/\t/g,' ').replace(/[^\x20-\x7E]/g,' ').replace(/\s+/g,' ').trim()||'-';}
function exportPdf(modal){
 if(!window.jspdf||typeof window.jspdf.jsPDF!=='function'){notice('Library PDF belum termuat. Coba kembali saat koneksi stabil.',true);return;}
 const allSource=Array.isArray(window.ENTRIES)?window.ENTRIES:(typeof ENTRIES!=='undefined'&&Array.isArray(ENTRIES)?ENTRIES:[]);
 const singleId=String(modal&&modal.dataset.entryId||'');
 const period=q('#omodos-logbook-pdf-period',modal)?.value||'90';
 const machineSelect=q('#omodos-logbook-pdf-machine',modal);
 const machineOption=machineSelect&&machineSelect.selectedOptions?machineSelect.selectedOptions[0]:null;
 const machineCode=String(machineOption&&machineOption.dataset.code||'');
 const machineName=String(machineOption&&machineOption.dataset.name||'');
 const machineLabel=machineOption&&machineOption.value?String(machineOption.textContent||''):'';
 const now=new Date();
 const cutoff=new Date(now);
 if(period==='24h')cutoff.setTime(now.getTime()-24*60*60*1000);
 else if(period==='30')cutoff.setDate(cutoff.getDate()-30);
 else if(period==='90')cutoff.setDate(cutoff.getDate()-90);
 else if(period==='year'){cutoff.setMonth(0,1);cutoff.setHours(0,0,0,0);}
 let rows=singleId?allSource.filter(e=>String(e.ID||e.id||'')===singleId):allSource.filter(e=>{
  if(period!=='all'){
   const d=logbookExportTimestamp_(e);
   if(!d||d<cutoff||d>now)return false;
  }
  if(machineSelect&&machineSelect.value){
   if(String(e['Lokasi Pekerjaan']||'').toLowerCase()==='area')return false;
   const code=String(e['Kode Mesin']||'').trim().toLocaleLowerCase('id').replace(/^[—–-]+$/,'');
   const name=String(e['Nama Mesin']||'').trim().toLocaleLowerCase('id').replace(/^[—–-]+$/,'');
   if(machineCode){if(code===machineCode)return true;if(!code&&machineName&&name===machineName)return true;return false;}
   return !!machineName&&name===machineName;
  }
  return true;
 });
 rows=rows.slice().sort((a,b)=>(logbookExportTimestamp_(b)?.getTime()||0)-(logbookExportTimestamp_(a)?.getTime()||0));
 if(!rows.length){notice(singleId?'Catatan Logbook tidak ditemukan.':'Tidak ada entri Logbook yang cocok dengan filter.',true);return;}
 if(rows.length>3000){notice('Lebih dari 3.000 entri. Pilih periode yang lebih singkat atau filter satu mesin untuk mencegah Out Of Memory.',true);return;}
 if(!singleId&&period==='all'&&rows.length>1200&&!window.confirm('Ada '+rows.length+' entri. Export semua dapat membebani browser. Lanjutkan?'))return;
 const {jsPDF}=window.jspdf,pdf=new jsPDF('p','pt','a4',{compress:true}),pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight(),left=36,right=36,bottom=42;
 const periodLabel=period==='all'?'Semua data':period==='year'?'Tahun berjalan':period==='24h'?'24 jam terakhir':period+' hari terakhir';
 const label=singleId?'Detail satu Logbook':periodLabel+(machineLabel?' | Mesin: '+machineLabel:'');
 let y=42;
 const header=()=>{pdf.setFont('helvetica','bold');pdf.setFontSize(14);pdf.text(singleId?'DETAIL LOGBOOK MAINTENANCE':'LAPORAN LOGBOOK MAINTENANCE',left,y);y+=18;pdf.setFont('helvetica','normal');pdf.setFontSize(8.5);pdf.text('Filter: '+safePdfText(label)+' | Dibuat: '+now.toLocaleString('id-ID'),left,y);y+=12;pdf.text('Jumlah entri: '+rows.length,left,y);y+=15;pdf.setDrawColor(180);pdf.line(left,y,pw-right,y);y+=12;};
 header();
 const line=(name,value)=>{const lines=pdf.splitTextToSize(name+': '+safePdfText(value),pw-left-right);if(y+lines.length*11>ph-bottom){pdf.addPage();y=34;header();}pdf.setFont('helvetica','normal');pdf.setFontSize(9);pdf.text(lines,left,y);y+=lines.length*11;};
 rows.forEach((e,i)=>{
  if(y+52>ph-bottom){pdf.addPage();y=34;header();}
  const location=String(e['Lokasi Pekerjaan']||'').toLowerCase()==='area'?(e['Lokasi/Area']||e['Nama Area']||'-'):[e['Kode Mesin'],e['Nama Mesin']].filter(Boolean).join(' - ');
  const d=logbookExportTimestamp_(e);
  pdf.setFont('helvetica','bold');pdf.setFontSize(10.5);pdf.text((i+1)+'. '+(d?d.toLocaleDateString('id-ID'):(e['Tanggal']||'-'))+' | '+safePdfText(location).slice(0,110),left,y);y+=14;
  line('Waktu Lapor',e['Waktu']);line('Status / Prioritas',safePdfText(e['Status'])+' / '+safePdfText(e['Prioritas']));line('Nomor MO',e['Nomor MO']);line('Nomor Notifikasi',e['Nomor Notifikasi Pekerjaan']);line('Jenis Pekerjaan',e['Jenis Pekerjaan']);line('Pelapor / Shift',[e['Nama Pelapor'],e['Shift']].filter(Boolean).join(' / '));line('Deskripsi Masalah',e['Deskripsi Masalah']);line('Tindakan Perbaikan',e['Tindakan Perbaikan']);line('Catatan',e['Catatan Tambahan']);pdf.setDrawColor(220);pdf.line(left,y+2,pw-right,y+2);y+=12;
 });
 const total=pdf.internal.getNumberOfPages();for(let page=1;page<=total;page++){pdf.setPage(page);pdf.setFont('helvetica','normal');pdf.setFontSize(8);pdf.setTextColor(110);pdf.text('OMODOS | Report Logbook | Halaman '+page+' / '+total,pw-right,ph-18,{align:'right'});}
 pdf.save((singleId?'Detail_Logbook':'Report_Logbook')+'_'+now.toISOString().replace(/[-:]/g,'').slice(0,15)+'.pdf');modal.remove();notice('PDF berhasil dibuat ('+rows.length+' entri).');
}

/* LOGBOOK_LIGHTWEIGHT_FILE_PREVIEWS_V1 — avoid loading full uploaded media just to build Logbook preview cards. */
function installLightweightLogbookAttachmentGrid(){
 if(typeof window.renderAttachGrid==='function'&&!window.renderAttachGrid.__omodosLogbookAttachmentLiteV1){
  const originalGrid=window.renderAttachGrid;
  const wrappedGrid=function(atts,label){
   const modal=byId('modal-bg'),showAll=byId('btn-entry-show-all-attachments');
   const inLogbookDetail=!!window.__OMODOS_LOGBOOK_DETAIL_RENDERING_V1||!!(showAll&&modal&&modal.classList.contains('active'));
   if(!inLogbookDetail||String(label||'')!=='Lampiran'||!Array.isArray(atts))return originalGrid.apply(this,arguments);
   const light=atts.map(a=>{
    if(!a||!/\/files\//.test(String(a.viewUrl||'')))return a;
    const mime=String(a.mimeType||'').toLowerCase(),type=String(a.type||'').toLowerCase();
    if(type==='image'||type==='video'||mime.startsWith('image/')||mime.startsWith('video/'))return {...a,type:'file'};
    return a;
   });
   return String(originalGrid.apply(this,[light,label])).replace('— klik untuk memperbesar','— klik untuk membuka lampiran');
  };
  wrappedGrid.__omodosLogbookAttachmentLiteV1=true;
  window.renderAttachGrid=wrappedGrid;
 }
 if(typeof window.openDetail==='function'&&!window.openDetail.__omodosLogbookDetailScopeV1){
  const originalOpen=window.openDetail;
  const wrappedOpen=function(){
   const previous=window.__OMODOS_LOGBOOK_DETAIL_RENDERING_V1;
   window.__OMODOS_LOGBOOK_DETAIL_RENDERING_V1=true;
   try{return originalOpen.apply(this,arguments);}
   finally{window.__OMODOS_LOGBOOK_DETAIL_RENDERING_V1=previous;}
  };
  wrappedOpen.__omodosLogbookDetailScopeV1=true;
  window.openDetail=wrappedOpen;
 }
}
function boot(){installMoField();installPdfButton();installLightweightLogbookAttachmentGrid();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();window.addEventListener('pageshow',boot,{passive:true});
/* OMODOS_LAZY_VENDOR_LOAD_V1 — defer rarely-used export and graph bundles. */
(function(){
 'use strict';
 const files={
  html2canvas:{src:'/vendor/html2canvas.min.js',ready:()=>typeof window.html2canvas==='function'},
  docx:{src:'/vendor/docx.min.js',ready:()=>!!(window.docx&&window.docx.Document)},
  exceljs:{src:'/vendor/exceljs.min.js',ready:()=>!!(window.ExcelJS&&window.ExcelJS.Workbook)},
  vis:{src:'/vendor/vis-network.min.js',ready:()=>!!(window.vis&&window.vis.Network)}
 };
 const pending=window.__OMODOS_LAZY_VENDOR_PROMISES__||(window.__OMODOS_LAZY_VENDOR_PROMISES__={});
 window.omodosLoadVendor_=function(name){
  const item=files[name];if(!item)return Promise.reject(new Error('Library tidak terdaftar: '+name));
  if(item.ready())return Promise.resolve(true);if(pending[name])return pending[name];
  pending[name]=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src=item.src;script.async=true;script.dataset.omodosLazyVendor=name;
   script.onload=()=>{if(item.ready())resolve(true);else reject(new Error('File termuat tetapi '+name+' tidak tersedia'));};
   script.onerror=()=>reject(new Error('Gagal memuat '+item.src));document.head.appendChild(script);
  }).catch(err=>{delete pending[name];throw err;});return pending[name];
 };
 function wrap(name,deps){
  const original=window[name];if(typeof original!=='function'||original.__omodosLazyVendorWrapped)return;
  const wrapped=function(){const context=this,args=arguments;return Promise.all(deps.map(dep=>window.omodosLoadVendor_(dep))).then(()=>original.apply(context,args)).catch(err=>{console.error('[OMODOS] Lazy vendor gagal:',name,err);if(typeof window.toast==='function')window.toast('Fitur belum bisa dimuat ('+deps.join(', ')+'). Periksa koneksi lalu coba lagi.',true);});};
  wrapped.__omodosLazyVendorWrapped=true;window[name]=wrapped;
 }
 wrap('exportRcaPdf',['html2canvas']);wrap('exportRcaDocx',['html2canvas','docx']);wrap('exportRcaXlsx',['html2canvas','exceljs']);
 wrap('exportProjectPdf',['html2canvas']);wrap('exportProjectDocx',['docx']);wrap('exportProjectXlsx',['exceljs']);wrap('renderKnowledgeGraphView',['vis']);
})();
const css=document.createElement('style');css.textContent=[
 '.omodos-edit-photo-panel{grid-column:1/-1;margin-top:8px;padding:12px;border:1px solid var(--line,#dbe3e8);border-radius:10px;background:var(--panel-2,#f8fafc)}',
 '#entry-view-mode .omodos-edit-photo-grid{display:flex;flex-wrap:wrap;gap:8px;margin-top:9px}',
 '#entry-view-mode .omodos-edit-photo-current{display:flex;flex-direction:column;gap:4px;max-width:112px;padding:5px;border:1px solid var(--line,#dbe3e8);border-radius:8px;color:var(--text,#203040);font-size:10px;text-decoration:none;overflow-wrap:anywhere}',
 '#entry-view-mode .omodos-edit-photo-current img{width:100px;height:76px;object-fit:cover;border-radius:5px;background:#e9eef1}',
 '#entry-view-mode .omodos-edit-photo-empty{font-size:11px;color:var(--text-dim,#708090)}','#field-edit-area-lainnya[hidden]{display:none!important}',
 '.omodos-logbook-pdf-overlay{position:fixed;inset:0;z-index:100500;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,24,35,.54);backdrop-filter:blur(3px)}',
 '.omodos-logbook-pdf-dialog{width:min(100%,440px);padding:18px;border:1px solid var(--line,#dbe3e8);border-radius:14px;background:var(--panel,#fff);color:var(--text,#1e3443);box-shadow:0 12px 44px rgba(0,0,0,.22)}',
 '.omodos-logbook-pdf-heading{display:flex;justify-content:space-between;gap:12px;margin-bottom:16px}.omodos-logbook-pdf-heading strong{font-size:16px}.omodos-logbook-pdf-heading p,.omodos-logbook-pdf-note{margin:4px 0;color:var(--text-dim,#708090);font-size:11px;line-height:1.45}',
 '.omodos-logbook-pdf-dialog>label{display:block;margin-bottom:6px;font-size:12px;font-weight:700}.omodos-logbook-pdf-dialog select{width:100%;min-height:40px;padding:8px;border:1px solid var(--line,#cfd9df);border-radius:8px;background:var(--panel-2,#f6f8fa);color:inherit}',
 '.omodos-logbook-pdf-actions{display:flex;justify-content:flex-end;gap:8px;margin-top:16px}.omodos-logbook-pdf-note{margin-top:12px}#btn-logbook-export-pdf{margin-left:8px;flex:0 0 auto}',
 '@media(max-width:700px){#btn-logbook-export-pdf{margin:8px 0 0}.omodos-logbook-pdf-dialog{padding:14px}.omodos-logbook-pdf-actions button{min-height:38px}}'
].join('\n');document.head.appendChild(css);
})();


/* LOGBOOK_DOWNTIME_CHOICE_V1 — keep work duration separate from machine downtime. */
(function(){
'use strict';
if(window.__OMODOS_LOGBOOK_DOWNTIME_CHOICE_V1__)return;
window.__OMODOS_LOGBOOK_DOWNTIME_CHOICE_V1__=true;
const byId=id=>document.getElementById(id);
function timeMinutes(value){
  const match=String(value==null?'':value).trim().match(/^(\d{1,2}):([0-5]\d)(?::[0-5]\d)?$/);
  if(!match)return null;
  const hour=Number(match[1]),minute=Number(match[2]);
  if(hour>23||minute>59)return null;
  return hour*60+minute;
}
function durationMinutes(start,finish){
  const a=timeMinutes(start),b=timeMinutes(finish);
  if(a===null||b===null)return null;
  return (b-a+1440)%1440;
}
function toast(message,isError){
  if(typeof window.toast==='function')window.toast(message,!!isError);
  else if(isError)console.warn('[OMODOS Logbook]',message);
}
function bindCreateForm(){
  const form=byId('form-entry'),start=byId('input-jamMulai'),finish=byId('input-jamSelesai'),duration=byId('input-downtime');
  if(!form||!start||!finish||!duration||form.dataset.omodosDowntimeChoiceV1==='1')return false;
  const durationWrap=duration.closest('.field');
  if(!durationWrap)return false;
  let choice=byId('select-menyebabkanDowntime');
  if(!choice){
    /* Reuse a matching field already rendered by the main form. The hotfix must not add a second downtime question. */
    const matchingFields=Array.from(form.querySelectorAll('.field')).filter(field=>/apakah pekerjaan ini menyebabkan downtime mesin\?/i.test((field.querySelector('label')||{}).textContent||''));
    const existingField=matchingFields.find(field=>field.querySelector('select'));
    if(existingField){
      choice=existingField.querySelector('select');
      choice.id='select-menyebabkanDowntime';
      choice.name='menyebabkanDowntime';
      choice.required=true;
      const existingLabel=existingField.querySelector('label');
      if(existingLabel)existingLabel.setAttribute('for','select-menyebabkanDowntime');
      matchingFields.filter(field=>field!==existingField).forEach(field=>field.remove());
    }else{
      const field=document.createElement('div');
      field.className='field';
      field.id='field-menyebabkanDowntime';
      field.innerHTML='<label for="select-menyebabkanDowntime">Apakah pekerjaan ini menyebabkan downtime mesin?</label><select id="select-menyebabkanDowntime" name="menyebabkanDowntime" required><option value="">Pilih Ya atau Tidak...</option><option value="Ya">Ya, mesin berhenti</option><option value="Tidak">Tidak, hanya durasi pekerjaan</option></select><div class="sub" style="margin-top:5px">Pilih Ya untuk menghitung durasi ke downtime mesin. Pilih Tidak agar jam tetap tercatat sebagai durasi pekerjaan saja.</div>';
      durationWrap.insertAdjacentElement('beforebegin',field);
      choice=byId('select-menyebabkanDowntime');
    }
  }
  /* Always deduplicate the question, including when the canonical ID already exists. */
  const allDowntimeFields=Array.from(form.querySelectorAll('.field')).filter(field=>/apakah pekerjaan ini menyebabkan downtime mesin\?/i.test((field.querySelector('label')||{}).textContent||''));
  const canonicalDowntimeField=allDowntimeFields.find(field=>field.querySelector('select#select-menyebabkanDowntime'))||allDowntimeFields.find(field=>field.querySelector('select'));
  if(canonicalDowntimeField){
    const canonicalSelect=canonicalDowntimeField.querySelector('select');
    canonicalSelect.id='select-menyebabkanDowntime';
    canonicalSelect.name='menyebabkanDowntime';
    canonicalSelect.required=true;
    const canonicalLabel=canonicalDowntimeField.querySelector('label');
    if(canonicalLabel)canonicalLabel.setAttribute('for','select-menyebabkanDowntime');
    allDowntimeFields.filter(field=>field!==canonicalDowntimeField).forEach(field=>field.remove());
    choice=canonicalSelect;
  }
  duration.name='durasiPekerjaan';
  duration.setAttribute('aria-label','Durasi Pekerjaan (menit, otomatis)');
  duration.setAttribute('inputmode','numeric');
  duration.setAttribute('min','0');
  duration.setAttribute('step','1');
  const label=durationWrap.querySelector('label');
  if(label)label.textContent='Durasi Pekerjaan (menit, otomatis)';
  let downtimeField=byId('input-recorded-downtime');
  if(!downtimeField){
    downtimeField=document.createElement('input');
    downtimeField.type='hidden';
    downtimeField.id='input-recorded-downtime';
    downtimeField.name='downtime';
    form.appendChild(downtimeField);
  }
  function refreshDuration(){
    const minutes=durationMinutes(start.value,finish.value);
    duration.value=minutes===null?'':String(minutes);
    downtimeField.value=choice.value==='Tidak'?'0':choice.value==='Ya'&&minutes!==null?String(minutes):'';
  }
  start.addEventListener('input',refreshDuration);
  start.addEventListener('change',refreshDuration);
  finish.addEventListener('input',refreshDuration);
  finish.addEventListener('change',refreshDuration);
  choice.addEventListener('change',refreshDuration);
  form.addEventListener('reset',()=>setTimeout(refreshDuration,0));
  form.addEventListener('submit',function(ev){
    if(!choice.value){
      ev.preventDefault();
      ev.stopImmediatePropagation();
      toast('Pilih apakah pekerjaan menyebabkan downtime: Ya atau Tidak.',true);
      choice.focus();
      return;
    }
    refreshDuration();
  },true);
  form.dataset.omodosDowntimeChoiceV1='1';
  refreshDuration();
  return true;
}
function bindEditForm(entry){
  const holder=byId('entry-view-mode');
  if(!holder)return;
  const durationWrap=holder.querySelector('[data-edit-wrap="Downtime (menit)"]');
  const durationInput=durationWrap&&durationWrap.querySelector('[data-edit-field="Downtime (menit)"]');
  if(!durationWrap||!durationInput||durationWrap.dataset.omodosDowntimeChoiceV1==='1')return;
  const storedDuration=entry&&entry['Durasi Pekerjaan (menit)'];
  const calculated=durationMinutes(entry&&entry['Jam Mulai'],entry&&entry['Jam Selesai']);
  let durationValue=calculated;
  if(durationValue===null){
    const candidate=storedDuration!==undefined&&storedDuration!==null&&String(storedDuration).trim()!==''?storedDuration:entry&&entry['Downtime (menit)'];
    const n=Number(candidate);
    durationValue=Number.isFinite(n)&&n>=0?n:null;
  }
  durationInput.value=durationValue===null?'':String(durationValue);
  durationInput.readOnly=true;
  durationInput.min='0';
  durationInput.step='1';
  durationInput.setAttribute('data-edit-field','Durasi Pekerjaan (menit)');
  const durationLabel=durationWrap.querySelector('label');
  if(durationLabel)durationLabel.textContent='Durasi Pekerjaan (menit)';
  const field=document.createElement('div');
  field.className='field';
  field.id='edit-field-menyebabkan-downtime';
  field.innerHTML='<label for="edit-menyebabkan-downtime">Apakah pekerjaan ini menyebabkan downtime mesin?</label><select id="edit-menyebabkan-downtime"><option value="Ya">Ya, mesin berhenti</option><option value="Tidak">Tidak, hanya durasi pekerjaan</option></select>';
  durationWrap.insertAdjacentElement('afterend',field);
  const select=byId('edit-menyebabkan-downtime');
  const rawChoice=String(entry&&entry['Menyebabkan Downtime']||'').trim().toLowerCase();
  select.value=rawChoice==='ya'||rawChoice==='yes'||rawChoice==='true'||rawChoice==='1'?'Ya':
    rawChoice==='tidak'||rawChoice==='no'||rawChoice==='false'||rawChoice==='0'?'Tidak':
    Number(entry&&entry['Downtime (menit)'])>0?'Ya':'Tidak';
  const start=holder.querySelector('[data-edit-field="Jam Mulai"]');
  const finish=holder.querySelector('[data-edit-field="Jam Selesai"]');
  const refresh=()=>{
    const minutes=durationMinutes(start&&start.value,finish&&finish.value);
    if(minutes!==null)durationInput.value=String(minutes);
  };
  if(start){start.addEventListener('input',refresh);start.addEventListener('change',refresh);}
  if(finish){finish.addEventListener('input',refresh);finish.addEventListener('change',refresh);}
  durationWrap.dataset.omodosDowntimeChoiceV1='1';
}
function wrapEditRenderer(){
  if(typeof window.renderEntryEditForm!=='function'||window.renderEntryEditForm.__omodosDowntimeChoiceV1)return false;
  const original=window.renderEntryEditForm;
  const wrapped=function(entry){
    const result=original.apply(this,arguments);
    try{bindEditForm(entry||{});}catch(e){console.warn('[OMODOS] Downtime edit field unavailable',e);}
    return result;
  };
  wrapped.__omodosDowntimeChoiceV1=true;
  window.renderEntryEditForm=wrapped;
  return true;
}
function wrapApiPost(){
  if(typeof window.apiPost!=='function'||window.apiPost.__omodosDowntimeChoiceV1)return false;
  const original=window.apiPost;
  const wrapped=function(payload){
    try{
      if(payload&&payload.action==='updateEntry'&&payload.entry){
        const select=byId('edit-menyebabkan-downtime');
        const durationInput=byId('entry-view-mode')&&byId('entry-view-mode').querySelector('[data-edit-field="Durasi Pekerjaan (menit)"]');
        if(select){
          const minutes=durationMinutes(payload.entry.jamMulai,payload.entry.jamSelesai);
          const fallback=Number(durationInput&&durationInput.value);
          const duration=minutes!==null?minutes:Number.isFinite(fallback)&&fallback>=0?Math.round(fallback):0;
          payload.entry.menyebabkanDowntime=select.value;
          payload.entry.durasiPekerjaan=duration;
          payload.entry.downtime=select.value==='Ya'?duration:0;
        }
      }
    }catch(e){console.warn('[OMODOS] Downtime payload normalization failed',e);}
    return original.apply(this,arguments);
  };
  wrapped.__omodosDowntimeChoiceV1=true;
  window.apiPost=wrapped;
  return true;
}
function boot(){
  bindCreateForm();
  wrapEditRenderer();
  wrapApiPost();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
let attempts=0;
const retry=setInterval(()=>{
  attempts++;
  const formReady=bindCreateForm();
  const editReady=wrapEditRenderer();
  const apiReady=wrapApiPost();
  if((formReady&&editReady&&apiReady)||attempts>=40)clearInterval(retry);
},100);
})();

/* LOGBOOK_SPAREPART_REVIEW_FIXES_20261029_V1
   Show/persist per-sparepart notes during create and quantities/notes during edit. */
(function(){
'use strict';
if(window.__OMODOS_LOGBOOK_SPAREPART_REVIEW_20261029_V1__)return;
window.__OMODOS_LOGBOOK_SPAREPART_REVIEW_20261029_V1__=true;
const byId=function(id){return document.getElementById(id);};
const q=function(selector,root){return (root||document).querySelector(selector);};
const qa=function(selector,root){return Array.from((root||document).querySelectorAll(selector));};
const escValue=function(value){return String(value==null?'':value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});};
const stateRows=function(){return Array.isArray(window.SPAREPART_ROWS)?window.SPAREPART_ROWS:[];};
const getName=function(r){return String(r&&(r.nama||r.name||r.material||r.namaMaterial)||'').trim();};
const getSap=function(r){return String(r&&(r.sap||r.materialNumberSAP||r.materialNumber||r.sapNumber)||'').trim();};
const getQty=function(r){return r&&(r.jumlah!==undefined?r.jumlah:r.qty!==undefined?r.qty:'');};
const getUnit=function(r){return String(r&&(r.unit||r.satuan)||'pcs').trim()||'pcs';};
const getNote=function(r){return String(r&&(r.catatan||r.note||r.notes)||'').trim();};

function syncCreateNotes(){
 const holder=byId('sparepart-rows');
 if(!holder)return;
 const states=stateRows();
 holder.querySelectorAll('.sparepart-row').forEach(function(row){
  const id=Number(row.dataset.id);
  const state=states.find(function(item){return Number(item.id)===id;})||{};
  let input=row.querySelector('.sp-catatan');
  if(!input){
   const wrap=document.createElement('div');
   wrap.className='field sp-note-field';
   wrap.innerHTML='<label>Catatan Sparepart (opsional)</label><textarea class="sp-catatan" rows="2" maxlength="500" placeholder="Keterangan pemakaian sparepart"></textarea>';
   row.appendChild(wrap);
   input=wrap.querySelector('.sp-catatan');
  }
  if(input&&document.activeElement!==input)input.value=getNote(state);
  if(input&&input.dataset.noteBound!=='1'){
   input.dataset.noteBound='1';
   const saveNote=function(){const item=stateRows().find(function(r){return Number(r.id)===id;});if(item)item.catatan=input.value;};
   input.addEventListener('input',saveNote);
   input.addEventListener('change',saveNote);
  }
 });
}
const oldRender=window.renderSparepartRows;
if(typeof oldRender==='function'&&!oldRender.__logbookSparepartNotesV1){
 const wrapped=function(){const result=oldRender.apply(this,arguments);try{syncCreateNotes();}catch(e){}return result;};
 wrapped.__logbookSparepartNotesV1=true;
 window.renderSparepartRows=wrapped;
}
const oldSync=window.syncSparepartRowsFromDom;
if(typeof oldSync==='function'&&!oldSync.__logbookSparepartNotesV1){
 const wrapped=function(){
  const result=oldSync.apply(this,arguments);
  try{
   const holder=byId('sparepart-rows'),states=stateRows();
   if(holder)holder.querySelectorAll('.sparepart-row').forEach(function(row){
    const state=states.find(function(item){return Number(item.id)===Number(row.dataset.id);});
    const input=row.querySelector('.sp-catatan');
    if(state&&input)state.catatan=String(input.value||'').trim();
   });
  }catch(e){}
  return result;
 };
 wrapped.__logbookSparepartNotesV1=true;
 window.syncSparepartRowsFromDom=wrapped;
}
const oldBuild=window.buildMaterialFieldsFromRows;
if(typeof oldBuild==='function'&&!oldBuild.__logbookSparepartDetailsV1){
 const wrapped=function(){
  try{if(typeof window.syncSparepartRowsFromDom==='function')window.syncSparepartRowsFromDom();}catch(e){}
  const data=oldBuild.apply(this,arguments);
  if(!data||typeof data!=='object')return data;
  const original=Array.isArray(data.sparepartDetail)?data.sparepartDetail:(Array.isArray(data.detail)?data.detail:[]);
  const states=stateRows(),used=new Set();
  const details=original.map(function(item){
   item=item||{};
   const name=getName(item),sap=getSap(item);
   let state=states.find(function(r){
    if(!r||used.has(r))return false;
    const sameName=getName(r).toLocaleLowerCase('id')===name.toLocaleLowerCase('id');
    const sameSap=getSap(r).toLocaleLowerCase('id')===sap.toLocaleLowerCase('id');
    return !!(name||sap)&&sameName&&sameSap;
   });
   if(!state)state=states.find(function(r){
    if(!r||used.has(r))return false;
    return !!((name&&getName(r).toLocaleLowerCase('id')===name.toLocaleLowerCase('id'))||(sap&&getSap(r).toLocaleLowerCase('id')===sap.toLocaleLowerCase('id')));
   });
   if(state)used.add(state);
   return {nama:name,sap:sap,jumlah:getQty(item),unit:getUnit(item.unit?item:(state||item)),catatan:getNote(item)||(state?getNote(state):'')};
  }).filter(function(item){return item.nama||item.sap||String(item.jumlah||'').trim()||item.catatan;});
  data.detail=details;
  data.sparepartDetail=details;
  return data;
 };
 wrapped.__logbookSparepartDetailsV1=true;
 window.buildMaterialFieldsFromRows=wrapped;
}

const units=['pcs','unit','set','kg','g','mg','ml','mL','L','liter','meter','m','cm','roll','botol','kaleng','pack','lembar','tube','drum','galon','box','pair','sachet'];
function parseDetails(entry){
 const raw=entry&&(entry['Sparepart Detail (JSON)']||entry.sparepartDetail||entry['Sparepart Detail']);
 let details=null;
 if(Array.isArray(raw))details=raw;
 else if(raw){try{const parsed=JSON.parse(String(raw));if(Array.isArray(parsed))details=parsed;}catch(e){}}
 if(Array.isArray(details))return details.map(function(r){return {nama:getName(r),sap:getSap(r),jumlah:getQty(r),unit:getUnit(r),catatan:getNote(r)};});
 const names=String(entry&&(entry['Nama Material']||entry.namaMaterial)||'').split(';').map(function(v){return v.trim();}).filter(Boolean);
 const saps=String(entry&&(entry['Material Number SAP']||entry.materialNumberSAP)||'').split(';').map(function(v){return v.trim();});
 const parsed=names.map(function(value,index){
  const match=value.match(/^(.*?)\s*\((\d+(?:[.,]\d+)?)\s*([^()]*)\)\s*$/);
  return {nama:match?match[1].trim():value,sap:saps[index]||'',jumlah:match?match[2].replace(',','.'): '',unit:match&&match[3]?match[3].trim():'pcs',catatan:''};
 });
 if(!names.length)return saps.filter(Boolean).map(function(sap){return {nama:'',sap:sap,jumlah:'',unit:'pcs',catatan:''};});
 return parsed;
}
function readEditDetails(panel){
 return qa('[data-edit-sparepart-row]',panel).map(function(row){
  return {nama:String(q('[data-edit-part-name]',row).value||'').trim(),sap:String(q('[data-edit-part-sap]',row).value||'').trim(),jumlah:String(q('[data-edit-part-qty]',row).value||'').trim(),unit:String(q('[data-edit-part-unit]',row).value||'pcs').trim()||'pcs',catatan:String(q('[data-edit-part-note]',row).value||'').trim()};
 }).filter(function(r){return r.nama||r.sap||r.jumlah||r.catatan;});
}
function renderEditRows(panel,details){
 const host=q('[data-edit-sparepart-list]',panel);
 if(!host)return;
 const rows=details.length?details:[{nama:'',sap:'',jumlah:'',unit:'pcs',catatan:''}];
 host.innerHTML=rows.map(function(r){
  const unit=String(r.unit||'pcs'),opts=units.slice();
  if(unit&&!opts.includes(unit))opts.unshift(unit);
  return '<div class="omodos-edit-sparepart-row" data-edit-sparepart-row>'+
   '<div class="omodos-edit-sparepart-field"><label>Nama Sparepart</label><input type="text" data-edit-part-name value="'+escValue(r.nama)+'" placeholder="Nama material"></div>'+
   '<div class="omodos-edit-sparepart-field"><label>Material Number SAP</label><input type="text" data-edit-part-sap value="'+escValue(r.sap)+'" placeholder="Nomor SAP (opsional)"></div>'+
   '<div class="omodos-edit-sparepart-field"><label>Jumlah pemakaian *</label><input type="number" data-edit-part-qty min="0.001" step="any" inputmode="decimal" value="'+escValue(r.jumlah)+'" placeholder="Qty"></div>'+
   '<div class="omodos-edit-sparepart-field"><label>Satuan</label><select data-edit-part-unit>'+opts.map(function(u){return '<option value="'+escValue(u)+'" '+(u===unit?'selected':'')+'>'+escValue(u)+'</option>';}).join('')+'</select></div>'+
   '<div class="omodos-edit-sparepart-field omodos-edit-sparepart-note"><label>Catatan Sparepart (opsional)</label><textarea data-edit-part-note rows="2" maxlength="500" placeholder="Keterangan pemakaian">'+escValue(r.catatan)+'</textarea></div>'+
   '<div class="omodos-edit-sparepart-row-actions"><button type="button" class="btn btn-ghost btn-sm" data-edit-sparepart-remove>Hapus sparepart</button></div></div>';
 }).join('');
 qa('[data-edit-sparepart-remove]',host).forEach(function(button){
  button.addEventListener('click',function(){const row=button.closest('[data-edit-sparepart-row]');if(row)row.remove();if(!qa('[data-edit-sparepart-row]',host).length)renderEditRows(panel,[]);});
 });
}
function ensureEditPanel(entry){
 const holder=byId('entry-view-mode');
 if(!holder||!q('#btn-save-entry-edit',holder))return;
 const id=String(entry&&(entry.ID||entry.id)||'');
 if(!id)return;
 let panel=byId('edit-sparepart-details-panel');
 if(panel&&panel.dataset.entryId===id)return;
 if(panel)panel.remove();
 const nameField=q('[data-edit-field="Nama Material"]',holder),sapField=q('[data-edit-field="Material Number SAP"]',holder);
 if(nameField&&nameField.closest('.field'))nameField.closest('.field').hidden=true;
 if(sapField&&sapField.closest('.field'))sapField.closest('.field').hidden=true;
 panel=document.createElement('section');panel.id='edit-sparepart-details-panel';panel.className='omodos-edit-sparepart-panel';panel.dataset.entryId=id;
 panel.innerHTML='<div class="omodos-edit-sparepart-heading"><div><strong>Sparepart Digunakan</strong><p>Periksa atau ubah jumlah pemakaian dan catatan setiap material.</p></div><button type="button" class="btn btn-ghost btn-sm" data-edit-sparepart-add>+ Tambah sparepart</button></div><div data-edit-sparepart-list></div><p class="omodos-edit-sparepart-hint">Jumlah wajib diisi jika nama atau nomor SAP sparepart diisi.</p>';
 const anchor=(sapField&&sapField.closest('.field'))||(nameField&&nameField.closest('.field'));
 if(anchor)anchor.insertAdjacentElement('afterend',panel);
 else{const actions=q('#btn-save-entry-edit',holder).closest('div');if(actions)actions.insertAdjacentElement('beforebegin',panel);else holder.appendChild(panel);}
 renderEditRows(panel,parseDetails(entry));
 q('[data-edit-sparepart-add]',panel).addEventListener('click',function(){const details=readEditDetails(panel);details.push({nama:'',sap:'',jumlah:'',unit:'pcs',catatan:''});renderEditRows(panel,details);});
}
const oldEditRenderer=window.renderEntryEditForm;
if(typeof oldEditRenderer==='function'&&!oldEditRenderer.__logbookSparepartDetailsV1){
 const wrapped=function(){const result=oldEditRenderer.apply(this,arguments);try{ensureEditPanel(arguments[0]||{});}catch(e){console.warn('[OMODOS] Edit sparepart details tidak siap',e);}return result;};
 wrapped.__logbookSparepartDetailsV1=true;
 window.renderEntryEditForm=wrapped;
}
function prepareEditPayload(payload){
 if(!payload||payload.action!=='updateEntry'||!payload.entry)return;
 const holder=byId('entry-view-mode'),panel=byId('edit-sparepart-details-panel');
 if(!holder||!panel||!q('#btn-save-entry-edit',holder))return;
 const details=readEditDetails(panel);
 payload.entry.sparepartDetail=details;
 payload.entry.namaMaterial=details.length?details.map(function(r){const name=r.nama||r.sap;return r.jumlah?name+' ('+r.jumlah+' '+r.unit+')':name;}).join('; '):'-';
 payload.entry.materialNumberSAP=details.length?details.map(function(r){return r.sap||'';}).join('; '):'-';
 payload.entry.sparePart=details.length?details.map(function(r){return r.nama||r.sap;}).join('; '):'-';
 const nameField=q('[data-edit-field="Nama Material"]',holder),sapField=q('[data-edit-field="Material Number SAP"]',holder);
 if(nameField)nameField.value=payload.entry.namaMaterial;
 if(sapField)sapField.value=payload.entry.materialNumberSAP;
 if(payload.entry['Nama Material']!==undefined)payload.entry['Nama Material']=payload.entry.namaMaterial;
 if(payload.entry['Material Number SAP']!==undefined)payload.entry['Material Number SAP']=payload.entry.materialNumberSAP;
}
const oldApiPost=window.apiPost;
if(typeof oldApiPost==='function'&&!oldApiPost.__logbookSparepartDetailsV1){
 const wrapped=function(payload){try{prepareEditPayload(payload);}catch(e){console.warn('[OMODOS] Sparepart edit payload normalization failed',e);}return oldApiPost.apply(this,arguments);};
 wrapped.__logbookSparepartDetailsV1=true;
 window.apiPost=wrapped;
}
const style=document.createElement('style');
style.textContent=[
 '#sparepart-rows .sparepart-row .sp-note-field{grid-column:1/-1;flex:1 0 100%;width:100%;min-width:0;margin-top:4px}',
 '#sparepart-rows .sparepart-row .sp-note-field textarea{box-sizing:border-box;width:100%;min-height:52px;resize:vertical}',
 '#edit-sparepart-details-panel{grid-column:1/-1;margin:12px 0;padding:14px;border:1px solid var(--line,#dbe3e8);border-radius:12px;background:var(--panel-2,#f7f9fb)}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:12px}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-heading strong{font-size:14px}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-heading p,#edit-sparepart-details-panel .omodos-edit-sparepart-hint{font-size:11px;color:var(--text-dim,#667788);margin:4px 0}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-row{display:grid;grid-template-columns:2fr 1.4fr .8fr .9fr;gap:9px;padding:12px 0;border-top:1px solid var(--line,#dbe3e8)}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-field{min-width:0}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-field label{display:block;font-size:11px;margin-bottom:5px}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-field input,#edit-sparepart-details-panel .omodos-edit-sparepart-field select,#edit-sparepart-details-panel .omodos-edit-sparepart-field textarea{box-sizing:border-box;width:100%;min-width:0;padding:8px;border:1px solid var(--line,#cbd5e1);border-radius:7px;background:var(--panel,#fff);color:inherit;font:inherit;font-size:12px}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-note,#edit-sparepart-details-panel .omodos-edit-sparepart-row-actions{grid-column:1/-1}',
 '#edit-sparepart-details-panel .omodos-edit-sparepart-row-actions{text-align:right}',
 '@media(max-width:760px){#edit-sparepart-details-panel .omodos-edit-sparepart-row{grid-template-columns:1fr 1fr}}'
].join('\n');
document.head.appendChild(style);
function boot(){try{syncCreateNotes();}catch(e){}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.addEventListener('pageshow',boot,{passive:true});
})();
