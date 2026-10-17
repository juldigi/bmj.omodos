(function(){
'use strict';
if(window.__OMODOS_PATROL_AREA_FEEDBACK_V1__) return;
window.__OMODOS_PATROL_AREA_FEEDBACK_V1__ = true;

function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn,{once:true}); else fn(); }
function esc(v){ return String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function toastSafe(msg,isError){ if(typeof toast==='function') toast(msg,!!isError); else window.alert(msg); }

ready(function(){
  /* LOGBOOK: add an explicit custom-area path without changing the master list. */
  try{
    if(typeof OMODOS_WORK_AREAS!=='undefined' && typeof populateWorkAreaOptions_==='function'){
      const originalPopulate = populateWorkAreaOptions_;
      populateWorkAreaOptions_ = function(category,select,value){
        originalPopulate(category,select,value);
        if(!select) return;
        if(!Array.from(select.options).some(o=>o.value==='Lainnya')){
          const option=document.createElement('option');
          option.value='Lainnya'; option.textContent='Lainnya (area belum tersedia)';
          select.appendChild(option);
        }
        if(value==='Lainnya') select.value='Lainnya';
      };
      const category=$('#select-kategoriArea');
      const name=$('#select-namaArea');
      const areaFields=$('#entry-area-fields');
      if(category && !Array.from(category.options).some(o=>o.value==='Lainnya')){
        const option=document.createElement('option'); option.value='Lainnya'; option.textContent='Lainnya'; category.appendChild(option);
      }
      if(areaFields && !$('#input-namaArea-lainnya')){
        const wrap=document.createElement('div');
        wrap.className='field'; wrap.id='entry-custom-area-wrap'; wrap.hidden=true;
        wrap.innerHTML='<label for="input-namaArea-lainnya">Nama area yang belum tersedia</label><input type="text" id="input-namaArea-lainnya" placeholder="Masukkan nama area" autocomplete="off"><div class="sub">Nama ini akan disimpan pada Logbook.</div>';
        areaFields.appendChild(wrap);
      }
      const custom=$('#input-namaArea-lainnya');
      function syncCustomArea(){
        if(!category||!name||!custom) return;
        const isArea=$('#select-lokasiPekerjaan') && $('#select-lokasiPekerjaan').value==='Area';
        const isCustom=isArea && (category.value==='Lainnya'||name.value==='Lainnya');
        $('#entry-custom-area-wrap').hidden=!isCustom;
        custom.required=!!isCustom;
        if(isCustom && category.value==='Lainnya' && name.value!=='Lainnya'){
          name.value='Lainnya';
        }
      }
      category.addEventListener('change',function(){
        if(category.value==='Lainnya'){
          originalPopulate('Lainnya',name,'');
          if(!Array.from(name.options).some(o=>o.value==='Lainnya')){
            const o=document.createElement('option');o.value='Lainnya';o.textContent='Lainnya (isi nama area)';name.appendChild(o);
          }
          name.value='Lainnya';
        }
        syncCustomArea();
      });
      name.addEventListener('change',syncCustomArea);
      $('#select-lokasiPekerjaan').addEventListener('change',syncCustomArea);
      const originalApply=applyLogbookLocationPayload_;
      applyLogbookLocationPayload_ = function(entry){
        if(entry && entry.lokasiPekerjaan==='Area' && (entry.kategoriArea==='Lainnya'||entry.namaArea==='Lainnya')){
          const customName=String(custom.value||'').trim();
          if(!customName) throw new Error('Nama area baru wajib diisi.');
          const categoryName=entry.kategoriArea==='Lainnya'?'Lainnya':entry.kategoriArea;
          entry.kategoriArea=categoryName;
          entry.namaArea=customName;
          entry.kodeMesin='-'; entry.namaMesin='-'; entry.namaUnit='-';
          entry.lokasi=categoryName==='Lainnya'?customName:(categoryName+' · '+customName);
          return entry;
        }
        return originalApply(entry);
      };
      syncCustomArea();
      const form=$('#form-entry');
      if(form) form.addEventListener('reset',()=>setTimeout(()=>{if(custom)custom.value='';syncCustomArea();},0));
    }
  }catch(e){ console.warn('[OMODOS feedback] custom Logbook area not initialized',e); }

  /* PATROL: one photo set per exact checklist checkpoint. */
  try{
    if(typeof PATROL_STATE==='undefined' || !$('#patrol-checklist-groups')) return;
    const photos = Object.create(null);
    const labels = Object.create(null);
    let activeKey='';
    let pickerMode='gallery';
    const picker=document.createElement('input');
    picker.type='file'; picker.accept='image/*'; picker.multiple=true;
    picker.style.display='none'; picker.id='omodos-patrol-checkpoint-photo-input';
    const cameraPicker=document.createElement('input');
    cameraPicker.type='file'; cameraPicker.accept='image/*'; cameraPicker.capture='environment'; cameraPicker.multiple=true;
    cameraPicker.style.display='none'; cameraPicker.id='omodos-patrol-checkpoint-camera-input';
    document.body.append(picker,cameraPicker);

    const style=document.createElement('style');
    style.textContent='.patrol-checkpoint-photo{display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:5px 0 8px 0;font-size:11px;color:var(--text-dim)}.patrol-checkpoint-photo button{font-size:11px}.patrol-checkpoint-photo img{width:44px;height:44px;object-fit:cover;border-radius:7px;border:1px solid var(--line)}.omodos-photo-choice{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.58);display:flex;align-items:center;justify-content:center;padding:18px}.omodos-photo-choice-card{width:min(360px,100%);background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 18px 60px rgba(0,0,0,.35)}.omodos-photo-choice-card h3{margin:0 0 6px;font-size:16px}.omodos-photo-choice-card p{font-size:12px;color:var(--text-dim);margin:0 0 14px}.omodos-photo-choice-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}.omodos-photo-choice-actions button{min-height:44px}';
    document.head.appendChild(style);

    function checkpointKey(category,index){ return String(category)+'::'+String(index); }
    function itemText(row){
      const item=row && row.parentElement && row.parentElement.querySelector('div[style*="font-size:15px"]');
      return item ? item.textContent.trim() : 'Titik pemeriksaan';
    }
    function refreshPhotoRow(key){
      const row=Array.from(document.querySelectorAll('#patrol-checklist-groups [data-kategori][data-idx]')).find(r=>checkpointKey(r.dataset.kategori,r.dataset.idx)===key);
      if(!row) return;
      let slot=row.parentElement.querySelector('[data-checkpoint-photo="'+CSS.escape(key)+'"]');
      if(!slot){slot=document.createElement('div');slot.className='patrol-checkpoint-photo';slot.dataset.checkpointPhoto=key;row.parentElement.appendChild(slot);}
      const list=photos[key]||[];
      slot.innerHTML=list.map((f,i)=>'<span title="'+esc(f.name)+'"><img src="'+esc(f.viewUrl)+'" alt="Foto '+(i+1)+'"></span>').join('');
      const label=document.createElement('span');label.textContent=list.length?list.length+' foto terlampir':'Foto belum ditambahkan';slot.appendChild(label);
      const add=document.createElement('button');add.type='button';add.className='btn btn-sm btn-ghost';add.textContent=list.length?'Tambah foto':'Pilih foto';add.addEventListener('click',()=>openChoice(key));slot.appendChild(add);
      if(list.length){const remove=document.createElement('button');remove.type='button';remove.className='btn btn-sm btn-ghost';remove.textContent='Hapus foto';remove.addEventListener('click',()=>{(photos[key]||[]).forEach(f=>{try{URL.revokeObjectURL(f.viewUrl)}catch(e){}});delete photos[key];refreshPhotoRow(key);});slot.appendChild(remove);}
    }
    function openChoice(key){
      activeKey=key;
      const old=document.querySelector('.omodos-photo-choice');if(old)old.remove();
      const label=labels[key]||'titik pemeriksaan';
      const modal=document.createElement('div');modal.className='omodos-photo-choice';
      modal.innerHTML='<div class="omodos-photo-choice-card" role="dialog" aria-modal="true"><h3>Tambah foto pemeriksaan</h3><p>'+esc(label)+'</p><div class="omodos-photo-choice-actions"><button type="button" class="btn btn-primary" data-photo-source="camera"><i class="ph-bold ph-camera"></i> Kamera</button><button type="button" class="btn btn-ghost" data-photo-source="gallery"><i class="ph-bold ph-images"></i> Galeri</button></div><button type="button" class="btn btn-ghost" data-photo-cancel style="width:100%;margin-top:8px">Batal</button></div>';
      document.body.appendChild(modal);
      modal.querySelector('[data-photo-source="camera"]').addEventListener('click',()=>{modal.remove();pickerMode='camera';cameraPicker.value='';cameraPicker.click();});
      modal.querySelector('[data-photo-source="gallery"]').addEventListener('click',()=>{modal.remove();pickerMode='gallery';picker.value='';picker.click();});
      modal.querySelector('[data-photo-cancel]').addEventListener('click',()=>modal.remove());
      modal.addEventListener('click',e=>{if(e.target===modal)modal.remove();});
    }
    function resizePhoto(file){
      return new Promise((resolve,reject)=>{
        const url=URL.createObjectURL(file),img=new Image();
        img.onload=()=>{
          try{
            const max=1280,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));
            const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
            canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
            const data=canvas.toDataURL('image/jpeg',0.82);
            URL.revokeObjectURL(url);
            resolve({data,width:canvas.width,height:canvas.height});
          }catch(e){URL.revokeObjectURL(url);reject(e);}
        };
        img.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('Foto tidak dapat dibaca.'));};
        img.src=url;
      });
    }
    async function handleFiles(input){
      if(!activeKey||!input.files||!input.files.length)return;
      const key=activeKey;
      const selected=Array.from(input.files).filter(f=>f.type.startsWith('image/'));
      if(!selected.length){toastSafe('Pilih file foto dari kamera atau galeri.',true);return;}
      if(!photos[key])photos[key]=[];
      for(const file of selected){
        try{
          const resized=await resizePhoto(file);
          const base64=resized.data.split(',')[1];
          photos[key].push({name:file.name||('foto-patrol-'+Date.now()+'.jpg'),type:'image',mimeType:'image/jpeg',base64,viewUrl:resized.data,previewUrl:resized.data,thumbUrl:resized.data});
        }catch(e){toastSafe('Foto gagal diproses: '+(e.message||String(e)),true);}
      }
      refreshPhotoRow(key);
      toastSafe('Foto terhubung ke titik pemeriksaan: '+(labels[key]||'Checklist')+'.');
      input.value='';
    }
    picker.addEventListener('change',()=>handleFiles(picker));
    cameraPicker.addEventListener('change',()=>handleFiles(cameraPicker));

    const holder=$('#patrol-checklist-groups');
    holder.addEventListener('click',function(ev){
      const btn=ev.target.closest('.patrol-chk-btn');
      if(!btn)return;
      const status=btn.dataset.status;
      const row=btn.closest('[data-kategori][data-idx]');
      if(!row)return;
      const key=checkpointKey(row.dataset.kategori,row.dataset.idx);
      labels[key]=itemText(row);
      if(status==='warning'||status==='abnormal') openChoice(key);
      else if(photos[key]){photos[key].forEach(f=>{try{URL.revokeObjectURL(f.viewUrl)}catch(e){}});delete photos[key];refreshPhotoRow(key);}
    });

    const save=$('#btn-patrol-save');
    if(save) save.addEventListener('click',function(){
      const injected=[];
      Object.keys(photos).forEach(key=>{
        const files=photos[key]||[];if(!files.length)return;
        const parts=key.split('::');const category=parts[0],index=parts.slice(1).join('::');
        const row=Array.from(document.querySelectorAll('#patrol-checklist-groups [data-kategori][data-idx]')).find(r=>checkpointKey(r.dataset.kategori,r.dataset.idx)===key);
        const item=labels[key]||(row?itemText(row):'Titik pemeriksaan');
        const status=(PATROL_STATE.checklist[category]||{})[index];
        if(status!=='warning'&&status!=='abnormal')return;
        injected.push({id:'CHK-'+Date.now()+'-'+Math.floor(Math.random()*100000),kategori:category,prioritas:status==='abnormal'?'Tinggi':'Sedang',deskripsi:'['+status.toUpperCase()+'] '+item, status:'Open',source:'checklist',checklistCategory:category,checklistIndex:index,checklistItem:item,checklistStatus:status,files:files.map(f=>({name:f.name,type:'image',mimeType:f.mimeType,base64:f.base64,viewUrl:f.viewUrl,previewUrl:f.previewUrl,thumbUrl:f.thumbUrl}))});
      });
      if(injected.length) PATROL_STATE.findings = (PATROL_STATE.findings||[]).filter(f=>f.source!=='checklist').concat(injected);
    },true);

    function clearCheckpointPhotos(){Object.keys(photos).forEach(key=>{(photos[key]||[]).forEach(f=>{try{if(String(f.viewUrl||'').startsWith('blob:'))URL.revokeObjectURL(f.viewUrl)}catch(e){}});delete photos[key];});document.querySelectorAll('[data-checkpoint-photo]').forEach(el=>el.remove());}
    if(typeof patrolResetWizard==='function'){const originalReset=patrolResetWizard;patrolResetWizard=function(){clearCheckpointPhotos();originalReset();};}
    if(typeof patrolSelectMachine==='function'){const originalSelectMachine=patrolSelectMachine;patrolSelectMachine=function(){clearCheckpointPhotos();originalSelectMachine.apply(this,arguments);};}
    const originalRender=renderPatrolChecklist;
    renderPatrolChecklist=function(){
      originalRender();
      Object.keys(PATROL_STATE.checklist||{}).forEach(category=>{
        Object.keys(PATROL_STATE.checklist[category]||{}).forEach(index=>{
          const key=checkpointKey(category,index);
          const status=PATROL_STATE.checklist[category][index];
          const row=Array.from(document.querySelectorAll('#patrol-checklist-groups [data-kategori][data-idx]')).find(r=>checkpointKey(r.dataset.kategori,r.dataset.idx)===key);
          if(row){labels[key]=itemText(row);if(status==='warning'||status==='abnormal')refreshPhotoRow(key);}
        });
      });
    };
  }catch(e){ console.warn('[OMODOS feedback] checklist photo attachments not initialized',e); }
});
})();