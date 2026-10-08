
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('public/index.html','utf8');
const now=Date.now(),listeners={},nodes={};
const kinds=['emergency','followup','finished','machines','loss','kpi','usage','po','new'];
const buttons=kinds.map(kind=>({dataset:{resumeDetail:kind},addEventListener:(name,fn)=>listeners[kind]=fn,focus(){}}));
const holder={innerHTML:'',querySelectorAll:()=>buttons};
nodes['home-smart-resume']=holder;
nodes['modal-content']={innerHTML:''};
nodes['modal-bg']={classList:{add(value){assert.equal(value,'active');this.active=true;}}};
nodes['resume-detail-close']={addEventListener(){},focus(){}};
const entries=['kritikal','perhatian','normal'].map((status,i)=>({'Timestamp Input':new Date(now-i*1000).toISOString(),'Tanggal':'2026-10-08','Nama Mesin':'AHU '+(i+1),'Kode Mesin':'AHU-'+i,'Status':status,'Deskripsi Masalah':'<unsafe>','Tindakan Perbaikan':'Check','Nama Material':'Seal',qty:i+1,minutes:30}));
const c={console,Date,Map,Array,ENTRIES:entries,SPAREPART_LOKASI:[{nama:'New seal',needsReview:true},{nama:'Reviewed',needsReview:false}],SPAREPART_ETA:[{noPO:'PO-1',namaMaterial:'Motor',estimasiEta:'2026-01-01'}],KPI_DEPARTMENT_MTD:[{Tahun:'2026',KPI:'Loss',Polaritas:'-', 'Target Oct':2,'Realisasi Oct':1}],KPI_KERJA:[],KPI_DEPARTMENT_META:{year:2026,latestActualMonth:'Oct'},KK_BULAN:[],document:{getElementById:id=>nodes[id]||null},renderTrainingSparepartNotice_:()=>{},escapeHtml:s=>String(s).replaceAll('<','&lt;').replaceAll('>','&gt;'),dashStatusKey:s=>s,analyticsMachineBucket_:e=>({key:e['Kode Mesin'],nama:e['Nama Mesin']}),anIsBreakdown:()=>true,parseDurationMinutes:e=>e.minutes,getHomeKerugianPerJamRp:()=>60000,fmtDurationMinutes:n=>n+' menit',parseSparepartDetail:()=>[{}],sparepartEntryTotalQty:e=>e.qty,poStatusKey:()=> 'overdue',kkPolaritasOk:()=>true,closeModal(){}};
vm.createContext(c);
const start=html.indexOf('function renderHomeSmartResume(){'),end=html.indexOf('/* ---------------------------------------------------------------------\n   HOME HERO',start);
vm.runInContext(html.slice(start,end),c);
c.renderHomeSmartResume();
assert(holder.innerHTML.includes('1 Sparepart Baru'));
assert.equal((holder.innerHTML.match(/data-resume-detail=/g)||[]).length,9);
for(const kind of kinds){listeners[kind]();assert(nodes['modal-bg'].classList.active);assert(nodes['modal-content'].innerHTML.includes('<table>'));assert(!nodes['modal-content'].innerHTML.includes('<unsafe>'));}
assert.equal(c.homeSmartResumeDetailData('followup',entries).rows.length,1);
assert.equal(c.homeSmartResumeDetailData('machines',entries).rows.length,3);
assert.equal(c.homeSmartResumeDetailData('loss',entries).rows[0][3],'Rp 30.000');
assert.equal(c.homeSmartResumeDetailData('po',entries).rows[0][0],'PO-1');
assert.equal(c.homeSmartResumeDetailData('new',entries).rows[0][1],'-');
// Old activity is excluded, while pending master notifications remain visible.
c.ENTRIES=[{...entries[0],'Timestamp Input':new Date(now-25*3600000).toISOString()}];c.renderHomeSmartResume();assert(holder.innerHTML.includes('1 Sparepart Baru'));assert(!holder.innerHTML.includes('data-resume-detail="emergency"'));
c.ENTRIES=[];c.renderHomeSmartResume();assert(holder.innerHTML.includes('1 Sparepart Baru'));
c.SPAREPART_LOKASI=[];c.renderHomeSmartResume();assert(!holder.innerHTML.includes('Sparepart Baru'));
// All inline scripts still parse.
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);
console.log('Smart Resume: PASS (all nine detail clicks, status/date filters, loss, PO fields, empty logbook, pending master, escaping).');
