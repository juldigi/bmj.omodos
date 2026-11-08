(function(){
'use strict';
if(window.__OMODOS_PATROL_REVIEW_ENHANCEMENTS_V1__) return;
window.__OMODOS_PATROL_REVIEW_ENHANCEMENTS_V1__ = true;

const PR_GROUP_OPTIONS = ['Electrical','Mechanical','Mechanical & Electrical','Workshop','Project','Warehouse','Planning','IPAL','Meeting','5R'];
const pr$ = (selector,root=document) => root.querySelector(selector);
const pr$$ = (selector,root=document) => Array.from(root.querySelectorAll(selector));
const prEsc = value => String(value == null ? '' : value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const prToast = (message,error) => { if(typeof window.toast === 'function') window.toast(message,!!error); };
const prParseObject = value => {
  if(value && typeof value === 'object' && !Array.isArray(value)) return value;
  try { const parsed=JSON.parse(value||'{}'); return parsed && typeof parsed==='object' && !Array.isArray(parsed) ? parsed : {}; }
  catch(_){ return {}; }
};
const prState = () => typeof PATROL_STATE !== 'undefined' && PATROL_STATE ? PATROL_STATE : null;

function prAddGroupingOptions(select,selected){
  if(!select) return;
  const current = selected == null ? select.value : String(selected);
  PR_GROUP_OPTIONS.forEach(label=>{
    if(!Array.from(select.options).some(option=>option.value===label)){
      const option=document.createElement('option'); option.value=label; option.textContent=label; select.appendChild(option);
    }
  });
  if(current) select.value=current;
}
function prInstallLogbookGrouping(){
  prAddGroupingOptions(pr$('select[name="groupingPekerjaan"]'));
  if(typeof window.renderEntryEditForm==='function' && !window.renderEntryEditForm.__prWrapped){
    const original=window.renderEntryEditForm;
    const wrapped=function(entry){
      const result=original.apply(this,arguments);
      const holder=pr$('#entry-view-mode');
      const old=holder && pr$('[data-edit-field="Grouping Pekerjaan"]',holder);
      if(old){
        const value=String(old.value || (entry && entry['Grouping Pekerjaan']) || '');
        const select=document.createElement('select'); select.dataset.editField='Grouping Pekerjaan';
        PR_GROUP_OPTIONS.forEach(label=>{const option=document.createElement('option');option.value=label;option.textContent=label;select.appendChild(option);});
        if(value && !PR_GROUP_OPTIONS.includes(value)){const option=document.createElement('option');option.value=value;option.textContent=value;select.appendChild(option);}
        select.value=value; old.replaceWith(select);
      }
      return result;
    };
    wrapped.__prWrapped=true; window.renderEntryEditForm=wrapped;
  }
}
function prAreas(){return globalThis.OMODOS_WORK_AREAS || {};}
function prInstallAreaPicker(){
  const step=pr$('#patrol-step-1'), machineField=pr$('#patrol-machine-select') && pr$('#patrol-machine-select').closest('.field'), start=pr$('#btn-patrol-select-machine');
  if(!step || !machineField || !start || pr$('#patrol-location-kind')) return;
  const modeWrap=document.createElement('div'); modeWrap.className='field';
  modeWrap.innerHTML='<label for="patrol-location-kind">Jenis Lokasi Patrol</label><select id="patrol-location-kind"><option value="Mesin">Mesin / Peralatan</option><option value="Area">Area</option></select>';
  machineField.parentNode.insertBefore(modeWrap,machineField);
  const areaWrap=document.createElement('div'); areaWrap.id='patrol-area-fields'; areaWrap.className='grid2'; areaWrap.hidden=true;
  areaWrap.innerHTML='<div class="field"><label for="patrol-area-category">Kategori Area</label><select id="patrol-area-category"><option value="">Pilih kategori area...</option></select></div><div class="field"><label for="patrol-area-name">Area / Lokasi</label><select id="patrol-area-name" disabled><option value="">Pilih area...</option></select></div><div class="field" id="patrol-area-custom-wrap" hidden><label for="patrol-area-custom">Nama area lainnya</label><input id="patrol-area-custom" type="text" autocomplete="off" placeholder="Masukkan nama area"></div>';
  machineField.parentNode.insertBefore(areaWrap,start);
  const mode=pr$('#patrol-location-kind'),category=pr$('#patrol-area-category'),area=pr$('#patrol-area-name'),customWrap=pr$('#patrol-area-custom-wrap'),custom=pr$('#patrol-area-custom');
  Object.keys(prAreas()).sort((a,b)=>a.localeCompare(b,'id')).forEach(name=>{const o=document.createElement('option');o.value=name;o.textContent=name;category.appendChild(o);});
  const other=document.createElement('option');other.value='Lainnya';other.textContent='Lainnya';category.appendChild(other);
  function sync(){const isArea=mode.value==='Area',isCustom=isArea&&(category.value==='Lainnya'||area.value==='Lainnya');machineField.hidden=isArea;areaWrap.hidden=!isArea;customWrap.hidden=!isCustom;custom.required=!!isCustom;}
  function populate(){const values=prAreas()[category.value]||[];area.innerHTML='<option value="">Pilih area...</option>'+values.map(name=>'<option value="'+prEsc(name)+'">'+prEsc(name)+'</option>').join('')+'<option value="Lainnya">Lainnya</option>';area.disabled=!category.value||category.value==='Lainnya';if(category.value==='Lainnya')area.value='Lainnya';sync();}
  mode.addEventListener('change',sync);category.addEventListener('change',populate);area.addEventListener('change',sync);populate();sync();
  window.__OMODOS_PATROL_AREA_UI_RESET__=()=>{mode.value='Mesin';category.value='';area.innerHTML='<option value="">Pilih area...</option>';area.disabled=true;custom.value='';sync();};
  window.__OMODOS_PATROL_AREA_UI_RESTORE__=record=>{
    mode.value=record && record.lokasiJenis==='Area'?'Area':'Mesin';
    if(mode.value==='Area'){category.value=record.kategoriArea||'';populate();if(Array.from(area.options).some(o=>o.value===(record.namaArea||'')))area.value=record.namaArea||'';else{area.value='Lainnya';custom.value=record.namaArea||'';}}
    sync();
  };
  start.addEventListener('click',event=>{
    if(mode.value!=='Area')return;
    event.preventDefault();event.stopImmediatePropagation();
    const categoryValue=category.value,areaValue=area.value,customValue=String(custom.value||'').trim();
    const name=(categoryValue==='Lainnya'||areaValue==='Lainnya')?customValue:areaValue;
    if(!categoryValue){prToast('Pilih kategori area Patrol terlebih dahulu.',true);return;}
    if(!name){prToast('Pilih atau isi nama area Patrol.',true);return;}
    if(typeof window.patrolSelectArea==='function')window.patrolSelectArea({kategoriArea:categoryValue,namaArea:name});
  },true);
}
function prSetArea(location){
  const state=prState(); if(!state)return;
  const category=String(location.kategoriArea||'').trim(),name=String(location.namaArea||'').trim();
  if(!category||!name){prToast('Kategori area dan nama area wajib diisi.',true);return;}
  Object.assign(state,{id:null,ts:null,kodeMesin:'AREA',namaMesin:'Area · '+category+' · '+name,lokasiJenis:'Area',kategoriArea:category,namaArea:name,checklist:{},checklistNotes:{},findings:[]});
  if(pr$('#patrol-step-1'))pr$('#patrol-step-1').style.display='none';
  if(pr$('#patrol-step-2'))pr$('#patrol-step-2').style.display='';
  if(pr$('#patrol-step-3'))pr$('#patrol-step-3').style.display='none';
  const heading=pr$('#patrol-step2-mesin');if(heading)heading.textContent='Area: '+category+' · '+name;
  const heading3=pr$('#patrol-step3-mesin');if(heading3)heading3.textContent='Area: '+category+' · '+name;
  if(typeof window.renderPatrolChecklist==='function')window.renderPatrolChecklist();
  if(pr$('#patrol-step-2'))pr$('#patrol-step-2').scrollIntoView({behavior:'smooth',block:'start'});
}
window.patrolSelectArea=prSetArea;

function prEnsureState(){const state=prState();if(!state)return;if(!state.checklistNotes)state.checklistNotes={};if(!state.lokasiJenis)state.lokasiJenis='Mesin';}
function prInstallStateWrappers(){
  if(typeof window.patrolSelectMachine==='function'&&!window.patrolSelectMachine.__prWrapped){
    const original=window.patrolSelectMachine;const wrapped=function(){const result=original.apply(this,arguments);prEnsureState();Object.assign(prState(),{lokasiJenis:'Mesin',kategoriArea:'',namaArea:'',checklistNotes:{}});if(window.__OMODOS_PATROL_AREA_UI_RESET__)window.__OMODOS_PATROL_AREA_UI_RESET__();return result;};wrapped.__prWrapped=true;window.patrolSelectMachine=wrapped;
  }
  if(typeof window.patrolResetWizard==='function'&&!window.patrolResetWizard.__prWrapped){
    const original=window.patrolResetWizard;const wrapped=function(){const result=original.apply(this,arguments);prEnsureState();Object.assign(prState(),{lokasiJenis:'Mesin',kategoriArea:'',namaArea:'',checklistNotes:{}});if(window.__OMODOS_PATROL_AREA_UI_RESET__)window.__OMODOS_PATROL_AREA_UI_RESET__();return result;};wrapped.__prWrapped=true;window.patrolResetWizard=wrapped;
  }
  if(typeof window.patrolLoadSessionForEdit==='function'&&!window.patrolLoadSessionForEdit.__prWrapped){
    const original=window.patrolLoadSessionForEdit;const wrapped=function(id){const reports=typeof PM_REPORTS!=='undefined'?PM_REPORTS:[];const record=reports.find(row=>String(row.id)===String(id));const result=original.apply(this,arguments);if(record){prEnsureState();Object.assign(prState(),{lokasiJenis:record.lokasiJenis||'Mesin',kategoriArea:record.kategoriArea||'',namaArea:record.namaArea||'',checklistNotes:prParseObject(record.checklistNotes)});if(window.__OMODOS_PATROL_AREA_UI_RESTORE__)window.__OMODOS_PATROL_AREA_UI_RESTORE__(record);if(typeof window.renderPatrolChecklist==='function')window.renderPatrolChecklist();}return result;};wrapped.__prWrapped=true;window.patrolLoadSessionForEdit=wrapped;
  }
  if(typeof window.homePatrolRecords_==='function'&&!window.homePatrolRecords_.__prWrapped){
    const original=window.homePatrolRecords_;
    const wrapped=function(){return (original.apply(this,arguments)||[]).filter(record=>String(record.lokasiJenis||record['Lokasi Jenis']||'Mesin').toLowerCase()!=='area');};
    wrapped.__prWrapped=true;window.homePatrolRecords_=wrapped;
  }
  if(typeof window.persistPmReport==='function'&&!window.persistPmReport.__prWrapped){
    const original=window.persistPmReport;const wrapped=async function(report,files){
      const state=prState()||{},notes=prParseObject((report&&report.checklistNotes)||state.checklistNotes),findings=(report&&report.findings||[]).map(f=>{
        const item={...f};
        if(item.source==='checklist'){const cat=item.checklistCategory||'',idx=String(item.checklistIndex==null?'':item.checklistIndex),note=String((notes[cat]||{})[idx]||item.keterangan||'').trim();if(note){item.keterangan=note;const marker='Keterangan: '+note;if(!String(item.deskripsi||'').includes(marker))item.deskripsi=String(item.deskripsi||'')+' — '+marker;}}
        return item;
      });
      const enriched={...report,lokasiJenis:report.lokasiJenis||state.lokasiJenis||'Mesin',kategoriArea:report.kategoriArea||state.kategoriArea||'',namaArea:report.namaArea||state.namaArea||'',checklistNotes:notes,findings};
      return original.call(this,enriched,files);
    };wrapped.__prWrapped=true;window.persistPmReport=wrapped;
  }
}
function prInstallHydration(){
  if(typeof window.apiGet==='function'&&!window.apiGet.__prWrapped){
    const original=window.apiGet;const wrapped=async function(action){const result=await original.apply(this,arguments);if(action==='predictiveReports'&&Array.isArray(result)){window.__OMODOS_PR_RAW__=new Map();result.forEach(row=>{const id=row.id||row.ID;if(id)window.__OMODOS_PR_RAW__.set(String(id),row);});}return result;};wrapped.__prWrapped=true;window.apiGet=wrapped;
  }
  if(typeof window.syncPmReportsFromBackend==='function'&&!window.syncPmReportsFromBackend.__prWrapped){
    const original=window.syncPmReportsFromBackend;const wrapped=async function(){const result=await original.apply(this,arguments),raw=window.__OMODOS_PR_RAW__||new Map(),reports=typeof PM_REPORTS!=='undefined'?PM_REPORTS:[];const merged=reports.map(record=>{const source=raw.get(String(record.id))||{};return {...record,lokasiJenis:source.lokasiJenis||source['Lokasi Jenis']||record.lokasiJenis||'Mesin',kategoriArea:source.kategoriArea||source['Kategori Area']||record.kategoriArea||'',namaArea:source.namaArea||source['Nama Area']||record.namaArea||'',checklistNotes:prParseObject(source.checklistNotes||source['Checklist Notes (JSON)']||record.checklistNotes)};});if(typeof window.savePmReportsLocal==='function')window.savePmReportsLocal(merged);return result;};wrapped.__prWrapped=true;window.syncPmReportsFromBackend=wrapped;
  }
}
function prStatus(category,index){const state=prState();return state&&state.checklist&&state.checklist[category]?state.checklist[category][index]:'';}
function prNote(category,index){const state=prState();return state&&state.checklistNotes&&state.checklistNotes[category]?state.checklistNotes[category][index]||'':'';}
function prRenderNotes(){
  const holder=pr$('#patrol-checklist-groups'),state=prState();if(!holder||!state)return;
  pr$$('.patrol-checkpoint-note',holder).forEach(node=>node.remove());
  pr$$('.patrol-checklist-category [data-kategori][data-idx]',holder).forEach(row=>{
    const category=row.dataset.kategori,index=String(row.dataset.idx),status=prStatus(category,index);
    if(status!=='warning'&&status!=='abnormal')return;
    const wrap=document.createElement('div');wrap.className='patrol-checkpoint-note';wrap.style.cssText='width:100%;margin:7px 0 9px;padding:8px 10px;border:1px solid var(--line);border-radius:9px;background:var(--panel-2);';
    const label=document.createElement('label');label.textContent=status==='abnormal'?'Keterangan Abnormal (opsional)':'Keterangan Warning (opsional)';label.style.cssText='display:block;font-size:12px;font-weight:700;margin-bottom:5px;';
    const input=document.createElement('textarea');input.rows=2;input.maxLength=1200;input.placeholder='Jelaskan kondisi pada titik pemeriksaan ini...';input.value=prNote(category,index);input.style.cssText='width:100%;min-height:58px;';input.dataset.prCategory=category;input.dataset.prIndex=index;
    input.addEventListener('input',()=>{if(!state.checklistNotes[category])state.checklistNotes[category]={};state.checklistNotes[category][index]=input.value;});
    wrap.append(label,input);row.parentElement.appendChild(wrap);
  });
}
function prInstallNotes(){
  const holder=pr$('#patrol-checklist-groups');if(!holder||holder.dataset.prNotesBound)return;holder.dataset.prNotesBound='1';prEnsureState();
  if(typeof window.renderPatrolChecklist==='function'&&!window.renderPatrolChecklist.__prNotesWrapped){
    const original=window.renderPatrolChecklist;const wrapped=function(){const result=original.apply(this,arguments);prEnsureState();prRenderNotes();return result;};wrapped.__prNotesWrapped=true;window.renderPatrolChecklist=wrapped;
  }
  holder.addEventListener('click',event=>{const button=event.target.closest('.patrol-chk-btn');if(!button)return;const row=button.closest('[data-kategori][data-idx]');if(!row)return;const category=row.dataset.kategori,index=String(row.dataset.idx);if(button.dataset.status!=='warning'&&button.dataset.status!=='abnormal'&&prState().checklistNotes[category])delete prState().checklistNotes[category][index];Promise.resolve().then(prRenderNotes);});
  prRenderNotes();
}
function prInstallPhotoWarning(){
  const style=document.createElement('style');style.textContent='.patrol-photo-reminder{margin:0 0 12px;padding:9px 10px;border:1px solid var(--amber);border-radius:9px;background:rgba(245,158,11,.10);font-size:12px;line-height:1.45}.patrol-photo-reminder strong{display:block;margin-bottom:3px}';document.head.appendChild(style);
  const observer=new MutationObserver(()=>{const modal=pr$('.omodos-photo-choice');if(!modal||pr$('.patrol-photo-reminder',modal))return;const card=pr$('.omodos-photo-choice-card',modal);if(!card)return;const reminder=document.createElement('div');reminder.className='patrol-photo-reminder';reminder.innerHTML='<strong>Perhatian sebelum mengirim foto</strong>Pastikan foto memperlihatkan kondisi abnormal/warning dan sesuai dengan titik checklist yang dipilih. Foto akan tertaut pada titik pemeriksaan ini.';const paragraph=pr$('p',card);if(paragraph)paragraph.insertAdjacentElement('afterend',reminder);else card.insertBefore(reminder,card.firstChild);});
  observer.observe(document.body,{childList:true,subtree:true});
}
function prPersonnel(){
  const names=new Set();['#patrol-nama-pelapor','#select-namaPelapor'].forEach(selector=>{const select=pr$(selector);if(select)Array.from(select.options||[]).forEach(option=>{const name=String(option.value||option.textContent||'').trim();if(name&&name!=='Pilih personil...')names.add(name);});});
  return Array.from(names).sort((a,b)=>a.localeCompare(b,'id'));
}
function prAskCloser(previous){
  return new Promise(resolve=>{
    const modal=document.createElement('div');modal.id='patrol-close-finding-modal';modal.style.cssText='position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.62);display:flex;align-items:center;justify-content:center;padding:18px;';
    const names=prPersonnel(),listId='patrol-close-person-list';
    modal.innerHTML='<div role="dialog" aria-modal="true" style="width:min(420px,100%);background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;"><h3 style="margin:0 0 6px;">Konfirmasi Penutupan Temuan</h3><p style="font-size:12px;color:var(--text-dim);margin:0 0 12px;">Pilih atau ketik nama personil yang menyelesaikan temuan ini.</p><label for="patrol-close-person" style="display:block;font-size:12px;font-weight:700;margin-bottom:5px;">Nama personil penutup</label><input id="patrol-close-person" list="'+listId+'" placeholder="Nama personil..." autocomplete="off" style="width:100%;min-height:44px;"><datalist id="'+listId+'">'+names.map(name=>'<option value="'+prEsc(name)+'"></option>').join('')+'</datalist><div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px;"><button type="button" class="btn btn-ghost" data-pr-cancel>Batal</button><button type="button" class="btn btn-primary" data-pr-save>Tutup Temuan</button></div><div data-pr-error style="display:none;color:var(--red);font-size:12px;margin-top:8px;">Nama personil wajib diisi.</div></div>';
    document.body.appendChild(modal);const input=pr$('#patrol-close-person',modal);input.value=previous||'';
    const finish=value=>{modal.remove();resolve(value);};
    pr$('[data-pr-cancel]',modal).addEventListener('click',()=>finish(null));
    pr$('[data-pr-save]',modal).addEventListener('click',()=>{const value=String(input.value||'').trim();if(!value){pr$('[data-pr-error]',modal).style.display='block';input.focus();return;}finish(value);});
    input.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();pr$('[data-pr-save]',modal).click();}if(event.key==='Escape')finish(null);});
    modal.addEventListener('click',event=>{if(event.target===modal)finish(null);});setTimeout(()=>input.focus(),30);
  });
}
function prInstallCloseAudit(){
  const holder=pr$('#list-patrol-temuan');if(!holder||holder.dataset.prCloseAuditBound)return;holder.dataset.prCloseAuditBound='1';
  holder.addEventListener('click',async event=>{
    const button=event.target.closest('.patrol-temuan-status');if(!button)return;
    event.preventDefault();event.stopImmediatePropagation();
    const reports=typeof PM_REPORTS!=='undefined'?PM_REPORTS:[],report=reports.find(row=>String(row.id)===String(button.dataset.report));
    const finding=report&&Array.isArray(report.findings)?report.findings.find(row=>String(row.id)===String(button.dataset.finding)):null;if(!report||!finding)return;
    const next=button.dataset.set;let closer='';
    if(next==='Closed'){closer=await prAskCloser(finding.closedBy||'');if(!closer)return;}
    const old={status:finding.status,closedBy:finding.closedBy,closedAt:finding.closedAt};finding.status=next;
    if(next==='Closed'){finding.closedBy=closer;finding.closedAt=new Date().toISOString();}else{delete finding.closedBy;delete finding.closedAt;}
    try{const result=await window.persistPmReport(report,[]);if(typeof window.renderPatrolTemuanList==='function')window.renderPatrolTemuanList();if(result&&result.synced===false)prToast('Status tersimpan di perangkat ini, tetapi sinkronisasi server belum berhasil.',true);else prToast(next==='Closed'?'Temuan ditutup oleh '+closer+'.':'Status temuan diubah ke "'+next+'".');}
    catch(error){Object.assign(finding,old);prToast('Gagal menyimpan status temuan: '+(error.message||String(error)),true);if(typeof window.renderPatrolTemuanList==='function')window.renderPatrolTemuanList();}
  },true);
}
function prInstallPresentation(){
  if(typeof window.renderPatrolTemuanList==='function'&&!window.renderPatrolTemuanList.__prPresented){
    const original=window.renderPatrolTemuanList;const wrapped=function(){const result=original.apply(this,arguments);const holder=pr$('#list-patrol-temuan');pr$$('.patrol-temuan-status',holder||document).forEach(button=>{const reports=typeof PM_REPORTS!=='undefined'?PM_REPORTS:[],report=reports.find(row=>String(row.id)===String(button.dataset.report)),finding=report&&(report.findings||[]).find(row=>String(row.id)===String(button.dataset.finding)),card=button.closest('.card');if(card&&finding&&finding.closedBy&&!pr$('[data-pr-closed-by]',card)){const line=document.createElement('div');line.dataset.prClosedBy='1';line.className='sub';line.style.marginTop='7px';line.textContent='Ditutup oleh: '+finding.closedBy+(finding.closedAt?' · '+new Date(finding.closedAt).toLocaleString('id-ID'):'');card.appendChild(line);}});return result;};wrapped.__prPresented=true;window.renderPatrolTemuanList=wrapped;
  }
  if(typeof window.openPatrolSessionDetail==='function'&&!window.openPatrolSessionDetail.__prPresented){
    const original=window.openPatrolSessionDetail;const wrapped=function(id){const result=original.apply(this,arguments),reports=typeof PM_REPORTS!=='undefined'?PM_REPORTS:[],record=reports.find(row=>String(row.id)===String(id)),modal=pr$('#modal-content');if(record&&modal){if(record.lokasiJenis==='Area'){const title=pr$('.modal-head h2',modal),badge=pr$('.modal-head .badge',modal);if(title)title.textContent='Area · '+(record.namaArea||record.namaMesin||'-');if(badge)badge.textContent=record.kategoriArea||'Area';}const closed=(record.findings||[]).filter(f=>f.closedBy);
        if(closed.length&&!pr$('#pr-closed-findings',modal)){
          const section=document.createElement('div');section.id='pr-closed-findings';section.style.marginTop='10px';
          const title=document.createElement('div');title.className='section-title';title.textContent='Riwayat Penutupan Temuan';section.appendChild(title);
          closed.forEach(f=>{const line=document.createElement('div');line.className='detail-row';line.textContent=(f.deskripsi||f.kategori||'Temuan')+' — Ditutup oleh: '+f.closedBy+(f.closedAt?' · '+new Date(f.closedAt).toLocaleString('id-ID'):'');section.appendChild(line);});
          const lastHeader=Array.from(modal.querySelectorAll('.section-title')).pop();if(lastHeader)lastHeader.insertAdjacentElement('afterend',section);else modal.appendChild(section);
        }
        const anchor=pr$('.section-title',modal);if(anchor&&record.checklistNotes){const box=document.createElement('div');Object.keys(record.checklistNotes).forEach(category=>Object.keys(record.checklistNotes[category]||{}).forEach(index=>{const note=String(record.checklistNotes[category][index]||'').trim();if(!note)return;const row=document.createElement('div');row.className='detail-row';row.innerHTML='<div class="k">'+prEsc(category)+' · Item '+(Number(index)+1)+'</div><div class="v">'+prEsc(note)+'</div>';box.appendChild(row);}));if(box.childNodes.length)anchor.insertAdjacentElement('afterend',box);}}return result;};wrapped.__prPresented=true;window.openPatrolSessionDetail=wrapped;
  }
}
function prInstall(){
  if(!pr$('#view-patrol'))return false;
  prInstallLogbookGrouping();prInstallAreaPicker();prInstallStateWrappers();prEnsureState();prInstallNotes();prInstallPhotoWarning();prInstallHydration();prInstallCloseAudit();prInstallPresentation();return true;
}
function prBoot(){let attempts=0;const timer=setInterval(()=>{attempts++;try{if(prInstall()||attempts>=40)clearInterval(timer);}catch(error){console.warn('[OMODOS Patrol review]',error);if(attempts>=40)clearInterval(timer);}},50);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',prBoot,{once:true});else prBoot();
})();