# Bantuan & Copilot Audit

## Bantuan — 3 hit(s)
### Around line 12110
~~~text
12104: /* =========================================================
12105:    INPUT REPORT (kategori: IPAL, RCA, dll)
12106:    ========================================================= */
12107: const REPORT_CATEGORIES = [
12108:   { key:'ipal',           icon:'💧', title:'Laporan IPAL', sub:'Catat pemeriksaan dan bahan kimia pengolahan air limbah.', enabled:true },
12109:   { key:'rca',            icon:'▦',  title:'RCA', sub:'Cari akar penyebab masalah dan catat tindakan perbaikan.', enabled:true },
12110:   { key:'ai',             icon:'✦',  title:'Analisa AI', sub:'Minta bantuan AI membaca data dan memberi saran. Tetap periksa hasilnya.', enabled:true },
12111:   { key:'report-hub',     icon:'🗂', title:'Riwayat Laporan', sub:'Lihat laporan yang sudah pernah disimpan.', enabled:true },
12112: ];
12113: let IPAL_CURRENT = null; // draft object sedang diedit
12114: 
12115: function renderReportView(){
12116:   $('#btn-report-back-cat').style.display = 'none';
12117:   $('#ipal-form-wrap').style.display = 'none';
12118:   $('#ipal-form-wrap').innerHTML = '';
12119:   const grid = $('#report-cat-grid');
12120:   grid.style.display = 'grid';
12121:   grid.innerHTML = REPORT_CATEGORIES.map(c => `
12122:     <div class="report-cat-card" data-cat="${c.key}">
12123:       <div class="report-cat-icon">${c.icon}</div>
~~~

### Around line 24150
~~~text
24144:     </div>
24145:     <div class="pi-profile-section">
24146:       <h4><i class="ph-bold ph-lightbulb"></i> Rekomendasi</h4>
24147:       <ul style="margin:0;padding-left:18px;line-height:1.7;">
24148:         ${rec.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}
24149:       </ul>
24150:       <div class="sub" style="margin-top:10px;">Rekomendasi dihasilkan 100% lokal dari data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item yang sudah tersimpan di aplikasi ini (tanpa API/LLM eksternal) — gunakan sebagai bantuan pengambilan keputusan, tetap verifikasi di lapangan.</div>
24151:     </div>
24152:   `;
24153:   $('#modal-bg').classList.add('active');
24154:   $('#btn-close-modal').addEventListener('click', closeModal);
24155: }
24156: 
24157: 
24158: function generatePiAiRecommendation(nama, tech, techScore, softScore, itemAvgs){
24159:   const belum = piBelumKompetenList(tech);
24160:   const softEntries = Object.entries(itemAvgs).filter(([,v])=>v!=null);
24161:   const weakSoft = softEntries.filter(([,v])=>v<=3).sort((a,b)=>a[1]-b[1]).map(([k])=>k);
24162:   const strongSoft = softEntries.filter(([,v])=>v>=4).map(([k])=>k);
24163: 
~~~

### Around line 28172
~~~text
28166:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28167:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28168:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28169:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28170:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28171:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28172:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28173:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28174:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28175:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28176:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28177:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
28178:     'pi-softskill':['Penilaian perilaku','Lihat penilaian kemampuan perilaku personel.','Pilih personel atau periode.','Baca hasil sebagai bahan pengembangan.'],
28179:     'pi-hardskill':['Penilaian teknis','Lihat kemampuan teknis yang sudah dinilai.','Pilih personel atau unit kompetensi.','Baca bagian yang sudah mampu dan yang masih perlu belajar.']
28180:   });
28181: 
28182:   const VIEW_NAMES=Object.freeze({
28183:     dashboard:'Beranda',input:'Catat Logbook',utama:'Lihat Logbook','project-center':'Proyek & Perbaikan',
28184:     patrol:'Pemeriksaan Harian',sparepart:'Suku Cadang','corrective-report':'Laporan Perbaikan',report:'Buat Laporan',
28185:     'energy-utility':'Energi & Air','insights-hub':'Analisis & Pengetahuan','kpi-department':'Target Kerja Departemen',
~~~

## help — 5 hit(s)
### Around line 6109
~~~text
06103:    Health Score, Dashboard Analitik, Copilot, Correlation/Diagnostic, Expert
06104:    Finder, saran Knowledge Base, dll). Data itu HANYA dipakai sebagai
06105:    pembanding historis (ditampilkan terpisah & diberi label eksplisit di
06106:    tempat yang relevan), tidak pernah dicampur ke angka utama.
06107:    Data pada/setelah cutoff (diinput langsung lewat aplikasi ini) itulah
06108:    yang jadi source of truth. Ganti SOT_CUTOFF_DATE di sini kalau cutoff-nya
06109:    berubah -- satu tempat ini mengatur seluruh fitur yang memakai helper di
06110:    bawah, tidak perlu ubah satu-satu di tiap fitur. */
06111: const SOT_CUTOFF_DATE = new Date('2026-09-01T00:00:00');
06112: function isSotEntry(e){
06113:   const d = new Date(e && e['Tanggal']);
06114:   return !isNaN(d) && d >= SOT_CUTOFF_DATE;
06115: }
06116: function isHistoricalEntry(e){
06117:   const d = new Date(e && e['Tanggal']);
06118:   return !isNaN(d) && d < SOT_CUTOFF_DATE;
06119: }
06120: // Entri source-of-truth (>= cutoff) dari sebuah list (default: ENTRIES global).
06121: function sotEntries(list){
06122:   return (list || ENTRIES).filter(isSotEntry);
~~~

### Around line 8764
~~~text
08758: }
08759: 
08760: function updateSidebarCounts(){
08761:   $('#cnt-utama').textContent = ENTRIES.length;
08762: }
08763: 
08764: /* ---------------- HELPERS ---------------- */
08765: function escapeHtml(s){
08766:   if(s===undefined || s===null) return '';
08767:   return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
08768: }
08769: function statusClass(status){
08770:   const s = String(status||'').toLowerCase();
08771:   if(s.includes('selesai')) return 'selesai';
08772:   if(s.includes('proses')) return 'proses';
08773:   if(s.includes('emergency')) return 'emergency';
08774:   return 'pending';
08775: }
08776: function prioClass(p){
08777:   const s = String(p||'').toLowerCase();
~~~

### Around line 11463
~~~text
11457:   const desk = ((entry['Deskripsi Masalah']||'') + ' ' + (entry['Tindakan Perbaikan']||'')).toLowerCase();
11458:   if(/listrik|kabel|electrical|elektrik|kontak listrik|konsleting|korslet|power/i.test(desk)) return 'Electrical Failure';
11459:   if(/mekanis|mechanical|roll|bearing|gear|belt|chain|pin|shaft|poros|as /i.test(desk)) return 'Mechanical Failure';
11460:   return 'Kegagalan Proses';
11461: }
11462: 
11463: // ---- Fishbone "cause tree" helpers ----
11464: // Setiap kategori (Man/Machine/dst) menyimpan array of node: { text, children:[...] }.
11465: // Struktur ini rekursif sehingga tiap faktor bisa punya faktor turunan (cabang) tanpa batas kedalaman.
11466: function newCauseNode(text){ return { text: text || '', children: [] }; }
11467: 
11468: function normalizeCauseNode_(n){
11469:   if(typeof n === 'string') return newCauseNode(n);
11470:   if(!n || typeof n !== 'object') return newCauseNode('');
11471:   return { text: String(n.text || ''), children: Array.isArray(n.children) ? n.children.map(normalizeCauseNode_) : [] };
11472: }
11473: 
11474: // Menerima format lama (array of string) maupun format baru (array of node) — dipakai saat
11475: // memuat report tersimpan lama supaya tetap kompatibel.
11476: function normalizeCausesByCategory(raw){
~~~

### Around line 15034
~~~text
15028: const filterSparepartCollectionEl = $('#filter-sparepart-collection');
15029: if(filterSparepartCollectionEl) filterSparepartCollectionEl.addEventListener('change', applySparepartFilters);
15030: const sortSparepartEl = $('#sort-sparepart');
15031: if(sortSparepartEl) sortSparepartEl.addEventListener('change', applySparepartFilters);
15032: $('#btn-refresh-sparepart').addEventListener('click', async ()=>{ await loadAll(); await syncSparepartStatusFromBackend(); renderSparepartView(); toast('Data diperbarui'); });
15033: 
15034: /* ---------------- EXPORT EXCEL: helper generik (dipakai di semua tab) ---------------- */
15035: function sparepartExportExcel(filename, headers, rows){
15036:   if(!rows.length){ toast('Tidak ada data untuk diekspor.', true); return; }
15037:   const thead = `<tr>${headers.map(h=>`<th style="border:1px solid #999;padding:5px;background:#eee;">${escapeHtml(h)}</th>`).join('')}</tr>`;
15038:   const tbody = rows.map(r=> `<tr>${r.map(c=>`<td style="border:1px solid #999;padding:5px;">${escapeHtml(String(c??'-'))}</td>`).join('')}</tr>`).join('');
15039:   const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
15040:   <head><meta charset="utf-8"></head>
15041:   <body><table style="border-collapse:collapse;">${thead}${tbody}</table></body></html>`;
15042:   const blob = new Blob(['\ufeff', html], { type: 'application/vnd.ms-excel' });
15043:   const url = URL.createObjectURL(blob);
15044:   const a = document.createElement('a');
15045:   a.href = url; a.download = filename;
15046:   document.body.appendChild(a); a.click(); document.body.removeChild(a);
15047:   setTimeout(()=> URL.revokeObjectURL(url), 4000);
~~~

### Around line 28122
~~~text
28116: .legacy-simple-glossary{margin-top:2px}
28117: .legacy-simple-glossary>summary{cursor:pointer;font:700 12px/1.4 var(--font-body,system-ui);color:var(--text-dim,#586579);min-height:38px;display:flex;align-items:center}
28118: .legacy-simple-glossary-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;padding-top:6px}
28119: .legacy-simple-glossary-grid div{padding:8px 10px;border:1px solid var(--line-soft,#e6eaf0);border-radius:9px;background:var(--panel-2,#f7f9fc)}
28120: .legacy-simple-glossary-grid b{display:block;font-size:11.5px;color:var(--text,#152238)}
28121: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28122: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28123: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28124: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28125: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28126: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28127: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28128: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28129: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28130: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28131: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28132: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28133: </style>
28134: <script id="legacy-low-cognitive-script">
28135: (function(){
~~~

## copilot — 346 hit(s)
### Around line 99
~~~text
00093:       if(typeof renderPiDashboardView === 'function'){ try{ renderPiDashboardView(); }catch(e){} }
00094:       toast('Hard skill assessment berhasil disimpan & tersinkron ke Personnel + PI Dashboard');
00095:     }catch(err){ toast('Gagal menyimpan hard skill: ' + err.message, true); }
00096:   }
00097: });
00098: 
00099: const _oldCopilotPageResume =
00100:   typeof window.copilotPageResume === 'function'
00101:     ? window.copilotPageResume
00102:     : function(){ return []; };
00103: window.copilotPageResume = function(view){
00104:   const items = _oldCopilotPageResume(view) || [];
00105:   if(['pi-dashboard','pi-personnel','pi-softskill','pi-hardskill','pi-smart-resume'].includes(view)){
00106:     const totalPersonil = (typeof piEmployeeList === 'function') ? piEmployeeList().length : 0;
00107:     const totalSoft = (typeof loadPiSoftskill === 'function') ? loadPiSoftskill().length : 0;
00108:     const totalHard = (typeof loadPiHardSkill === 'function')
00109:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00110:       : 0;
00111:     items.push({
00112:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
~~~

### Around line 100
~~~text
00094:       toast('Hard skill assessment berhasil disimpan & tersinkron ke Personnel + PI Dashboard');
00095:     }catch(err){ toast('Gagal menyimpan hard skill: ' + err.message, true); }
00096:   }
00097: });
00098: 
00099: const _oldCopilotPageResume =
00100:   typeof window.copilotPageResume === 'function'
00101:     ? window.copilotPageResume
00102:     : function(){ return []; };
00103: window.copilotPageResume = function(view){
00104:   const items = _oldCopilotPageResume(view) || [];
00105:   if(['pi-dashboard','pi-personnel','pi-softskill','pi-hardskill','pi-smart-resume'].includes(view)){
00106:     const totalPersonil = (typeof piEmployeeList === 'function') ? piEmployeeList().length : 0;
00107:     const totalSoft = (typeof loadPiSoftskill === 'function') ? loadPiSoftskill().length : 0;
00108:     const totalHard = (typeof loadPiHardSkill === 'function')
00109:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00110:       : 0;
00111:     items.push({
00112:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
00113:       text:`Total personil <b>${totalPersonil}</b>, soft skill assessment <b>${totalSoft}</b>, hard skill assessment <b>${totalHard}</b>.`,
~~~

### Around line 101
~~~text
00095:     }catch(err){ toast('Gagal menyimpan hard skill: ' + err.message, true); }
00096:   }
00097: });
00098: 
00099: const _oldCopilotPageResume =
00100:   typeof window.copilotPageResume === 'function'
00101:     ? window.copilotPageResume
00102:     : function(){ return []; };
00103: window.copilotPageResume = function(view){
00104:   const items = _oldCopilotPageResume(view) || [];
00105:   if(['pi-dashboard','pi-personnel','pi-softskill','pi-hardskill','pi-smart-resume'].includes(view)){
00106:     const totalPersonil = (typeof piEmployeeList === 'function') ? piEmployeeList().length : 0;
00107:     const totalSoft = (typeof loadPiSoftskill === 'function') ? loadPiSoftskill().length : 0;
00108:     const totalHard = (typeof loadPiHardSkill === 'function')
00109:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00110:       : 0;
00111:     items.push({
00112:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
00113:       text:`Total personil <b>${totalPersonil}</b>, soft skill assessment <b>${totalSoft}</b>, hard skill assessment <b>${totalHard}</b>.`,
00114:       sub:'Copilot sudah ditautkan ke master personil, soft skill, hard skill, dan profil personil.',
~~~

### Around line 103
~~~text
00097: });
00098: 
00099: const _oldCopilotPageResume =
00100:   typeof window.copilotPageResume === 'function'
00101:     ? window.copilotPageResume
00102:     : function(){ return []; };
00103: window.copilotPageResume = function(view){
00104:   const items = _oldCopilotPageResume(view) || [];
00105:   if(['pi-dashboard','pi-personnel','pi-softskill','pi-hardskill','pi-smart-resume'].includes(view)){
00106:     const totalPersonil = (typeof piEmployeeList === 'function') ? piEmployeeList().length : 0;
00107:     const totalSoft = (typeof loadPiSoftskill === 'function') ? loadPiSoftskill().length : 0;
00108:     const totalHard = (typeof loadPiHardSkill === 'function')
00109:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00110:       : 0;
00111:     items.push({
00112:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
00113:       text:`Total personil <b>${totalPersonil}</b>, soft skill assessment <b>${totalSoft}</b>, hard skill assessment <b>${totalHard}</b>.`,
00114:       sub:'Copilot sudah ditautkan ke master personil, soft skill, hard skill, dan profil personil.',
00115:       sources:[]
00116:     });
~~~

### Around line 104
~~~text
00098: 
00099: const _oldCopilotPageResume =
00100:   typeof window.copilotPageResume === 'function'
00101:     ? window.copilotPageResume
00102:     : function(){ return []; };
00103: window.copilotPageResume = function(view){
00104:   const items = _oldCopilotPageResume(view) || [];
00105:   if(['pi-dashboard','pi-personnel','pi-softskill','pi-hardskill','pi-smart-resume'].includes(view)){
00106:     const totalPersonil = (typeof piEmployeeList === 'function') ? piEmployeeList().length : 0;
00107:     const totalSoft = (typeof loadPiSoftskill === 'function') ? loadPiSoftskill().length : 0;
00108:     const totalHard = (typeof loadPiHardSkill === 'function')
00109:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00110:       : 0;
00111:     items.push({
00112:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
00113:       text:`Total personil <b>${totalPersonil}</b>, soft skill assessment <b>${totalSoft}</b>, hard skill assessment <b>${totalHard}</b>.`,
00114:       sub:'Copilot sudah ditautkan ke master personil, soft skill, hard skill, dan profil personil.',
00115:       sources:[]
00116:     });
00117:   }
~~~

### Around line 114
~~~text
00108:     const totalHard = (typeof loadPiHardSkill === 'function')
00109:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00110:       : 0;
00111:     items.push({
00112:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
00113:       text:`Total personil <b>${totalPersonil}</b>, soft skill assessment <b>${totalSoft}</b>, hard skill assessment <b>${totalHard}</b>.`,
00114:       sub:'Copilot sudah ditautkan ke master personil, soft skill, hard skill, dan profil personil.',
00115:       sources:[]
00116:     });
00117:   }
00118:   return items;
00119: };
00120: 
00121: </script>
00122: <link rel="preconnect" href="https://fonts.googleapis.com">
00123: <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Poppins:wght@500;600;700;800&family=VT323&family=Playfair+Display:wght@600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
00124: 
00125: <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
00126: <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
00127: <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
~~~

### Around line 1214
~~~text
01208: }
01209: 
01210: .database-grid{
01211:   display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;
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
~~~

### Around line 1215
~~~text
01209: 
01210: .database-grid{
01211:   display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;
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
~~~

### Around line 1221
~~~text
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
~~~

### Around line 1222
~~~text
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
~~~

### Around line 1223
~~~text
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
~~~

### Around line 1224
~~~text
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
~~~

### Around line 1225
~~~text
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
~~~

### Around line 1226
~~~text
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
~~~

### Around line 1227
~~~text
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
~~~

### Around line 1228
~~~text
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
~~~

### Around line 1229
~~~text
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
~~~

### Around line 1230
~~~text
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
~~~

### Around line 1231
~~~text
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
~~~

### Around line 1232
~~~text
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
~~~

### Around line 1233
~~~text
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
~~~

### Around line 1234
~~~text
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
~~~

### Around line 1235
~~~text
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
~~~

### Around line 1236
~~~text
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
~~~

### Around line 1237
~~~text
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
~~~

### Around line 1238
~~~text
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
~~~

### Around line 1239
~~~text
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
~~~

### Around line 1240
~~~text
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
~~~

### Around line 1241
~~~text
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
~~~

### Around line 1242
~~~text
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
~~~

### Around line 1243
~~~text
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

### Around line 1244
~~~text
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

### Around line 1245
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
~~~

### Around line 1246
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
~~~

### Around line 1247
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
~~~

### Around line 1248
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
~~~

### Around line 1249
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
~~~

### Around line 1250
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
~~~

### Around line 1251
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
~~~

### Around line 1252
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
~~~

### Around line 1253
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
~~~

### Around line 1254
~~~text
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
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
~~~

### Around line 1255
~~~text
01249: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
~~~

### Around line 1256
~~~text
01250: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
~~~

### Around line 1257
~~~text
01251: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
~~~

### Around line 1258
~~~text
01252: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
~~~

### Around line 1259
~~~text
01253: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
~~~

### Around line 1260
~~~text
01254: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
~~~

### Around line 1261
~~~text
01255: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
~~~

### Around line 1262
~~~text
01256: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
~~~

### Around line 1263
~~~text
01257: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
~~~

### Around line 1264
~~~text
01258: .copilot-record-list{display:grid;gap:7px;}
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01269: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01270: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01271: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01272: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01273: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01274: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01275: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01276: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01277: .copilot-actions{display:flex;gap:8px;margin-top:8px;align-items:center;}
~~~

### Around line 1265
~~~text
01259: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1266
~~~text
01260: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1267
~~~text
01261: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1268
~~~text
01262: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1269
~~~text
01263: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1270
~~~text
01264: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1271
~~~text
01265: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1272
~~~text
01266: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1273
~~~text
01267: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1274
~~~text
01268: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
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
~~~

### Around line 1275
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
~~~

### Around line 1276
~~~text
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
~~~

### Around line 1277
~~~text
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
~~~

### Around line 1278
~~~text
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
~~~

### Around line 1279
~~~text
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
~~~

### Around line 1280
~~~text
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
~~~

### Around line 1281
~~~text
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
~~~

### Around line 1283
~~~text
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
~~~

### Around line 1284
~~~text
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
~~~

### Around line 2048
~~~text
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
02061: .home-critical-chip.lv-kritikal{background:color-mix(in srgb, var(--red) 16%, transparent);color:var(--red);border:1px solid var(--red-dim);}
~~~

### Around line 2075
~~~text
02069:   display:flex;flex-direction:column;gap:6px;width:100%;box-sizing:border-box;
02070:   border:1px solid var(--line-soft);border-radius:10px;background:var(--panel);
02071:   padding:8px 12px;
02072: }
02073: .hsr-head{display:flex;align-items:center;gap:6px;flex-wrap:wrap;justify-content:space-between;
02074:   /* [FIX] Sama seperti .home-critical-alert -- card Smart Resume Pabrik bisa
02075:      melebar sampai dekat sudut kanan bawah tempat FAB Copilot mengambang.
02076:      Reserved padding supaya "24 jam terakhir" tidak pernah ketutup FAB. */
02077:   padding-right:64px;box-sizing:border-box;
02078: }
02079: .hsr-title{display:flex;align-items:center;gap:6px;font-family:var(--font-display);font-weight:700;font-size:clamp(11px,1.4vh,13px);color:var(--text);}
02080: .hsr-title i{color:var(--red);}
02081: .hsr-period{font-size:10px;color:var(--text-dim);font-family:var(--font-mono);white-space:nowrap;}
02082: .hsr-narrative{font-size:clamp(11px,1.35vh,12.5px);color:var(--text-dim);line-height:1.45;overflow-wrap:anywhere;}
02083: .hsr-narrative b{color:var(--text);font-weight:700;}
02084: .hsr-stats{display:flex;flex-wrap:wrap;gap:6px;}
02085: .hsr-stat{
02086:   display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;
02087:   font-size:10.5px;font-weight:700;font-family:var(--font-mono);white-space:nowrap;
02088:   background:var(--panel-2);border:1px solid var(--line);color:var(--text-dim);
~~~

### Around line 3229
~~~text
03223: #sparepart-lokasi-table .sp-master-name{font-weight:600;min-width:0;}
03224: #sparepart-lokasi-table .sp-master-location{color:var(--text-dim);}
03225: #sparepart-lokasi-table .sp-master-price{font-family:var(--font-mono);color:var(--amber);}
03226: #sparepart-lokasi-table .sp-master-stock{font-family:var(--font-mono);color:var(--green);white-space:nowrap!important;}
03227: #sparepart-lokasi-table .sp-master-actions{display:flex;gap:6px;justify-content:flex-end;}
03228: #sparepart-lokasi-table [data-label]::before{display:none;}
03229: #copilot-clear-data{flex:0 0 auto!important;}
03230: @media(max-width:900px){
03231:   #view-sparepart .sp-collect-table.omodos-responsive-table>tbody>tr>td.cell-material{grid-column:span 2!important;}
03232:   #view-sparepart .sp-collect-table.omodos-responsive-table>tbody>tr>td.cell-material::before{margin-bottom:4px;}
03233:   #sparepart-lokasi-table .sp-master-row{grid-template-columns:repeat(2,minmax(0,1fr));gap:0;padding:6px;}
03234:   #sparepart-lokasi-table .sp-master-row>[data-label]{min-width:0;padding:8px 9px;border-bottom:1px solid var(--line-soft);}
03235:   #sparepart-lokasi-table .sp-master-row>[data-label]::before{content:attr(data-label);display:block;margin-bottom:3px;color:var(--text-dim);font-family:var(--font-mono);font-size:9.5px;font-weight:700;text-transform:uppercase;}
03236:   #sparepart-lokasi-table .sp-master-name{grid-column:1/-1;font-size:13px;}
03237:   #sparepart-lokasi-table .sp-master-actions{justify-content:flex-start;}
03238: }
03239: @media(max-width:520px){
03240:   .copilot-actions{display:grid!important;grid-template-columns:1fr 1fr!important;}
03241:   #copilot-clear-data{grid-column:1/-1!important;width:100%;justify-content:center;}
03242: }
~~~

### Around line 3240
~~~text
03234:   #sparepart-lokasi-table .sp-master-row>[data-label]{min-width:0;padding:8px 9px;border-bottom:1px solid var(--line-soft);}
03235:   #sparepart-lokasi-table .sp-master-row>[data-label]::before{content:attr(data-label);display:block;margin-bottom:3px;color:var(--text-dim);font-family:var(--font-mono);font-size:9.5px;font-weight:700;text-transform:uppercase;}
03236:   #sparepart-lokasi-table .sp-master-name{grid-column:1/-1;font-size:13px;}
03237:   #sparepart-lokasi-table .sp-master-actions{justify-content:flex-start;}
03238: }
03239: @media(max-width:520px){
03240:   .copilot-actions{display:grid!important;grid-template-columns:1fr 1fr!important;}
03241:   #copilot-clear-data{grid-column:1/-1!important;width:100%;justify-content:center;}
03242: }
03243: </style>
03244: <link rel="stylesheet" href="/omodos4/omodos4.css">
03245: 
03246: <!-- OMODOS4_PHASE1_SAFE -->
03247: <style id="omodos4-phase1-style">
03248: .v4-nav-group{border-top:1px solid var(--line-soft);padding-top:8px;margin-top:8px}
03249: .v4-nav-group .nav-parent-btn{font-weight:800}
03250: .v4-nav-group .nav-parent-btn .v4-badge{margin-left:auto;font:700 9px/1 var(--font-mono);padding:3px 6px;border-radius:999px;border:1px solid var(--line);color:var(--text-dim);background:var(--panel-2)}
03251: .v4-shell{--v4-gap:12px}
03252: .v4-shell .v4-hero{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:16px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(135deg,var(--panel),var(--panel-2));margin-bottom:14px}
03253: .v4-shell .v4-eyebrow{font:700 10px/1.2 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim)}
~~~

### Around line 3241
~~~text
03235:   #sparepart-lokasi-table .sp-master-row>[data-label]::before{content:attr(data-label);display:block;margin-bottom:3px;color:var(--text-dim);font-family:var(--font-mono);font-size:9.5px;font-weight:700;text-transform:uppercase;}
03236:   #sparepart-lokasi-table .sp-master-name{grid-column:1/-1;font-size:13px;}
03237:   #sparepart-lokasi-table .sp-master-actions{justify-content:flex-start;}
03238: }
03239: @media(max-width:520px){
03240:   .copilot-actions{display:grid!important;grid-template-columns:1fr 1fr!important;}
03241:   #copilot-clear-data{grid-column:1/-1!important;width:100%;justify-content:center;}
03242: }
03243: </style>
03244: <link rel="stylesheet" href="/omodos4/omodos4.css">
03245: 
03246: <!-- OMODOS4_PHASE1_SAFE -->
03247: <style id="omodos4-phase1-style">
03248: .v4-nav-group{border-top:1px solid var(--line-soft);padding-top:8px;margin-top:8px}
03249: .v4-nav-group .nav-parent-btn{font-weight:800}
03250: .v4-nav-group .nav-parent-btn .v4-badge{margin-left:auto;font:700 9px/1 var(--font-mono);padding:3px 6px;border-radius:999px;border:1px solid var(--line);color:var(--text-dim);background:var(--panel-2)}
03251: .v4-shell{--v4-gap:12px}
03252: .v4-shell .v4-hero{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;padding:16px;border:1px solid var(--line);border-radius:14px;background:linear-gradient(135deg,var(--panel),var(--panel-2));margin-bottom:14px}
03253: .v4-shell .v4-eyebrow{font:700 10px/1.2 var(--font-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--text-dim)}
03254: .v4-shell .v4-title{font:800 clamp(22px,3vw,34px)/1.1 var(--font-display);margin:6px 0}
~~~

### Around line 5857
~~~text
05851:       <button class="btn btn-sm" id="app-error-modal-copy" type="button"><i class="ph-bold ph-copy"></i> Salin Detail</button>
05852:       <button class="btn btn-sm btn-primary" id="app-error-modal-ok" type="button">Tutup</button>
05853:     </div>
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
~~~

### Around line 5860
~~~text
05854:   </div>
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
~~~

### Around line 5861
~~~text
05855: </div>
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
~~~

### Around line 5862
~~~text
05856: 
05857: <!-- ============ AI TANYA JAWAB COPILOT ============
05858:      Internal-first: pertanyaan dicari lebih dulu di data aplikasi yang sudah
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
~~~

### Around line 5865
~~~text
05859:      tersedia di browser. AI external hanya dipanggil jika pengguna memilihnya. -->
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
~~~

### Around line 5866
~~~text
05860: <button id="copilot-fab" type="button" title="AI Tanya Jawab OMODOS" aria-label="Buka AI Tanya Jawab">
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
~~~

### Around line 5867
~~~text
05861:   <span class="copilot-fab-icon">🤖</span>
05862:   <span class="copilot-fab-dot" id="copilot-fab-dot"></span>
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
~~~

### Around line 5869
~~~text
05863: </button>
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
~~~

### Around line 5870
~~~text
05864: 
05865: <div class="copilot-bg" id="copilot-bg">
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
~~~

### Around line 5872
~~~text
05866:   <div class="copilot-panel" id="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
05867:     <div class="copilot-head">
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
~~~

### Around line 5874
~~~text
05868:       <div>
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
~~~

### Around line 5875
~~~text
05869:         <div class="copilot-title" id="copilot-title">🤖 AI Tanya Jawab OMODOS</div>
05870:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
~~~

### Around line 5877
~~~text
05871:       </div>
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
~~~

### Around line 5878
~~~text
05872:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
~~~

### Around line 5879
~~~text
05873:     </div>
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
~~~

### Around line 5880
~~~text
05874:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
~~~

### Around line 5881
~~~text
05875:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
~~~

### Around line 5882
~~~text
05876:     </div>
05877:     <div class="copilot-composer">
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
~~~

### Around line 5884
~~~text
05878:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05879:       <div class="copilot-actions">
05880:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05881:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05882:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05883:       </div>
05884:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05885:     </div>
05886:   </div>
05887: </div>
05888: 
05889: <script>
05890: 
05891: /* =========================================================
05892:    GLOBAL ERROR POPUP
05893:    =========================================================
05894:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05895:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05896:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05897:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
~~~

### Around line 6103
~~~text
06097: }
06098: 
06099: /* ---------------- [FITUR BARU] SOURCE OF TRUTH CUTOFF (LOGBOOK) ----------------
06100:    Seluruh data logbook hasil EXPORT dari OneNote (yaitu semua entri dengan
06101:    Tanggal SEBELUM cutoff ini) belum bisa dipastikan tervalidasi -- jadi
06102:    TIDAK dianggap source of truth untuk perhitungan/analisa apapun (Machine
06103:    Health Score, Dashboard Analitik, Copilot, Correlation/Diagnostic, Expert
06104:    Finder, saran Knowledge Base, dll). Data itu HANYA dipakai sebagai
06105:    pembanding historis (ditampilkan terpisah & diberi label eksplisit di
06106:    tempat yang relevan), tidak pernah dicampur ke angka utama.
06107:    Data pada/setelah cutoff (diinput langsung lewat aplikasi ini) itulah
06108:    yang jadi source of truth. Ganti SOT_CUTOFF_DATE di sini kalau cutoff-nya
06109:    berubah -- satu tempat ini mengatur seluruh fitur yang memakai helper di
06110:    bawah, tidak perlu ubah satu-satu di tiap fitur. */
06111: const SOT_CUTOFF_DATE = new Date('2026-09-01T00:00:00');
06112: function isSotEntry(e){
06113:   const d = new Date(e && e['Tanggal']);
06114:   return !isNaN(d) && d >= SOT_CUTOFF_DATE;
06115: }
06116: function isHistoricalEntry(e){
~~~

### Around line 6577
~~~text
06571: // (baik lewat klik menu yang seharusnya sudah disembunyikan, maupun akses
06572: // URL/hash langsung). Core function halaman lain tetap berjalan normal.
06573: function showAccessDenied(){
06574:   toast('Akses ditolak — Anda tidak memiliki izin untuk membuka menu ini.', true);
06575: }
06576: 
06577: /* ---------------- COPILOT: PELACAK ERROR/BUG TEKNIS ----------------
06578:  * Menangkap error JS & promise rejection yang benar-benar terjadi di
06579:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06580:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06581:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06582:  */
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
~~~

### Around line 6579
~~~text
06573: function showAccessDenied(){
06574:   toast('Akses ditolak — Anda tidak memiliki izin untuk membuka menu ini.', true);
06575: }
06576: 
06577: /* ---------------- COPILOT: PELACAK ERROR/BUG TEKNIS ----------------
06578:  * Menangkap error JS & promise rejection yang benar-benar terjadi di
06579:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06580:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06581:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06582:  */
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
~~~

### Around line 6583
~~~text
06577: /* ---------------- COPILOT: PELACAK ERROR/BUG TEKNIS ----------------
06578:  * Menangkap error JS & promise rejection yang benar-benar terjadi di
06579:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06580:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06581:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06582:  */
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06593: });
06594: 
06595: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06596:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
~~~

### Around line 6584
~~~text
06578:  * Menangkap error JS & promise rejection yang benar-benar terjadi di
06579:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06580:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06581:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06582:  */
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06593: });
06594: 
06595: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06596:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
06597:    boleh diakses oleh akun berperan Superadmin. TIDAK ADA LAGI username/
~~~

### Around line 6585
~~~text
06579:  * browser (bukan simulasi), supaya Copilot bisa melaporkannya sebagai
06580:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06581:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06582:  */
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06593: });
06594: 
06595: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06596:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
06597:    boleh diakses oleh akun berperan Superadmin. TIDAK ADA LAGI username/
06598:    password hardcode di frontend — verifikasi akun dilakukan lewat
~~~

### Around line 6586
~~~text
06580:  * "Isu Teknis Terdeteksi" saat merangkum halaman yang sedang dibuka.
06581:  * Disimpan di memori saja (maks 20 terbaru), tidak dikirim ke server.
06582:  */
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06593: });
06594: 
06595: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06596:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
06597:    boleh diakses oleh akun berperan Superadmin. TIDAK ADA LAGI username/
06598:    password hardcode di frontend — verifikasi akun dilakukan lewat
06599:    backend yang sama dengan login utama (action:'login' di code.gs),
~~~

### Around line 6589
~~~text
06583: let COPILOT_ERROR_LOG = [];
06584: function copilotLogError(msg, srcInfo){
06585:   COPILOT_ERROR_LOG.unshift({ msg: String(msg||'Error tidak diketahui').slice(0,300), src: srcInfo||'', time: Date.now(), view: PREVIOUS_ACTIVE_VIEW });
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06593: });
06594: 
06595: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06596:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
06597:    boleh diakses oleh akun berperan Superadmin. TIDAK ADA LAGI username/
06598:    password hardcode di frontend — verifikasi akun dilakukan lewat
06599:    backend yang sama dengan login utama (action:'login' di code.gs),
06600:    yang mengembalikan role sebenarnya dari akun tsb.
06601: 
06602:    PENTING (perilaku akses Setting): kalau pengguna yang SEDANG login
~~~

### Around line 6592
~~~text
06586:   if(COPILOT_ERROR_LOG.length > 20) COPILOT_ERROR_LOG.length = 20;
06587: }
06588: window.addEventListener('error', (ev)=>{
06589:   copilotLogError(ev.message, ev.filename ? (ev.filename.split('/').pop()+':'+ev.lineno) : '');
06590: });
06591: window.addEventListener('unhandledrejection', (ev)=>{
06592:   copilotLogError('Promise error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason)));
06593: });
06594: 
06595: /* ---------------- PROTEKSI MENU MASTER MESIN & KONEKSI ----------------
06596:    Menu Setting berisi kredensial database SQLite & data master, jadi hanya
06597:    boleh diakses oleh akun berperan Superadmin. TIDAK ADA LAGI username/
06598:    password hardcode di frontend — verifikasi akun dilakukan lewat
06599:    backend yang sama dengan login utama (action:'login' di code.gs),
06600:    yang mengembalikan role sebenarnya dari akun tsb.
06601: 
06602:    PENTING (perilaku akses Setting): kalau pengguna yang SEDANG login
06603:    memang ber-role Superadmin, menu ini langsung terbuka tanpa login
06604:    ulang. Kalau bukan, sistem meminta login dengan akun Superadmin lain
06605:    (step-up auth) khusus untuk membuka menu ini — status step-up ini
~~~

### Around line 8162
~~~text
08156: }
08157: 
08158: /* ---------------- NAVIGATION ---------------- */
08159: function handleViewRenderError_(view, label, err){
08160:   const msg = err && err.message ? err.message : String(err || 'Error tidak diketahui');
08161:   console.error('[OMODOS] Gagal render view:', {view, label, error:err});
08162:   try{ if(typeof copilotLogError === 'function') copilotLogError('Render '+view+': '+msg, label||''); }catch(e){}
08163:   toast('Gagal memuat '+(label||view)+': '+msg, true);
08164: }
08165: function invokeViewRenderer_(view, renderer, label){
08166:   try{
08167:     const result = renderer();
08168:     if(result && typeof result.then === 'function'){
08169:       result.catch(err=>handleViewRenderError_(view,label,err));
08170:     }
08171:     return result;
08172:   }catch(err){
08173:     handleViewRenderError_(view,label,err);
08174:     return null;
08175:   }
~~~

### Around line 16075
~~~text
16069: }
16070: 
16071: /* ---------------- HALAMAN MESIN ---------------- */
16072: function wikiPageMesin(kodeOrNama){
16073:   const m = findMachineByIdentity_(kodeOrNama);
16074:   const kode = m ? (m['Kode Mesin']||m['Nama Mesin']) : kodeOrNama;
16075:   const entries = copilotEntriesFor(kode).slice().sort((a,b)=> new Date(b['Tanggal'])-new Date(a['Tanggal']));
16076:   const hs = machineHealthScore(kode);
16077:   const dna = computeMaintenanceDNA(kode);
16078:   const breakdownEntries = entries.filter(anIsBreakdown);
16079: 
16080:   // Personil yang pernah menangani mesin ini
16081:   const registeredNames = new Set(PERSONIL.map(p=>p['Nama Personil']).filter(Boolean));
16082:   const personilCount = {};
16083:   entries.forEach(e=> splitPelaporNames(e['Nama Pelapor']).filter(n=>registeredNames.has(n)).forEach(n=> personilCount[n]=(personilCount[n]||0)+1));
16084:   const personilRanked = Object.entries(personilCount).sort((a,b)=>b[1]-a[1]);
16085: 
16086:   // Seluruh sparepart yang pernah dipakai di mesin ini + estimasi biaya maintenance
16087:   const sparepartCount = {}; let biayaTotal = 0;
16088:   entries.forEach(e=> parseSparepartDetail(e).forEach(d=>{
~~~

### Around line 16766
~~~text
16760:     refreshCurrentView();
16761:   }catch(err){
16762:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16763:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16764:   }
16765: }
16766: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16767: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16768: 
16769: async function quickUpdateStatus(id){
16770:   const val = $('#quick-status').value;
16771:   if(!val) return;
16772:   try{
16773:     await apiPost({action:'updateStatus', id, status: val});
16774:     toast('Status diperbarui');
16775:     closeModal();
16776:     await loadAll();
16777:     refreshCurrentView();
16778:   }catch(err){ toast('Gagal update status: ' + err.message, true); }
16779: }
~~~

### Around line 18311
~~~text
18305:   });
18306: }
18307: 
18308: function openMachineDetail(kode){
18309:   const m = findMachineByIdentity_(kode);
18310:   if(!m) return;
18311:   COPILOT_LAST_MACHINE = m['Kode Mesin'] || m['Nama Mesin'];
18312:   const spec = getMachineSpec(m);
18313:   const manualUrl = getMachineManualUrl(m);
18314:   const hs = machineHealthScore(m['Kode Mesin'] || m['Nama Mesin']);
18315:   $('#modal-content').innerHTML = `
18316:     <div class="modal-head">
18317:       <div>
18318:         <span class="badge" style="background:var(--panel-2);border:1px solid var(--line);">${escapeHtml(m['Kode Mesin']||'-')}</span>
18319:         <h2 style="font-family:var(--font-display);margin:8px 0 0 0;">${escapeHtml(m['Nama Mesin']||'-')}</h2>
18320:       </div>
18321:       <button class="modal-close" id="btn-close-modal">✕</button>
18322:     </div>
18323:     <button type="button" class="btn btn-sm" id="btn-open-wiki-mesin" style="margin-bottom:10px;"><i class="ph-bold ph-book-open-text"></i> Buka Halaman Wiki Mesin Ini</button>
18324:     <div class="detail-row"><div class="k">Kategori</div><div class="v">${escapeHtml(m['Kategori']||'-')}</div></div>
~~~

### Around line 18362
~~~text
18356: }
18357: /* ==================================================================
18358:    MAINTENANCE DNA — "rekam medis" tiap mesin.
18359:    100% hasil olahan histori Logbook/PM yang sudah ada (BUKAN AI, tidak ada
18360:    pemanggilan model apapun) — murni agregasi & keyword-matching dari data
18361:    nyata. Sengaja memakai fungsi yang SAMA dengan Machine Health Score,
18362:    Copilot (copilotRepeatedProblems, copilotEntriesFor) dan menu lain supaya
18363:    angkanya selalu konsisten di seluruh aplikasi (tidak ada mismatch).
18364:    ================================================================== */
18365: const DNA_KOMPONEN_PHRASES = [
18366:   'vacuum valve','sensor feeder','servo feeder','bearing delivery','bearing feeder',
18367:   'register','vacuum','servo','bearing','sensor','solenoid','encoder','inverter',
18368:   'gripper','sucker','blanket','plate cylinder','impression cylinder','roller tinta',
18369:   'roller air','pompa','pump','motor','valve','belt','v-belt','seal','gear','chain',
18370:   'rantai','pulley','clutch','kabel','fuse','relay','kopling','nozzle','filter'
18371: ];
18372: const DNA_AREA_KEYWORDS = [
18373:   { area:'Feeder', keys:['feeder','pengumpan','sucker','suction feeder'] },
18374:   { area:'Delivery', keys:['delivery','output','tumpukan keluar','penerima'] },
18375:   { area:'Printing Unit', keys:['printing unit','unit cetak','blanket','plate cylinder','impression','roller tinta','roller air','cetak'] },
~~~

### Around line 18385
~~~text
18379:   { area:'Mekanikal Umum', keys:['bearing','gear','chain','rantai','belt','clutch','kopling','pompa','pump','valve','motor','roll'] },
18380: ];
18381: 
18382: function computeMaintenanceDNA(kodeOrNama){
18383:   const m = findMachineByIdentity_(kodeOrNama);
18384:   const canonicalMachineKey = m ? (m['Kode Mesin'] || m['Nama Mesin']) : kodeOrNama;
18385:   const all = copilotEntriesFor(canonicalMachineKey); // seluruh histori (all-time), bukan cuma 90 hari
18386:   const breakdownEntries = all.filter(anIsBreakdown);
18387:   const improvementEntries = all.filter(e=> String(e['Jenis Pekerjaan']||'').toLowerCase().includes('improvement'));
18388:   const pmLogbookEntries = all.filter(e=> String(e['Jenis Pekerjaan']||'').toLowerCase().includes('preventive'));
18389:   const pmPatrolEntries = (PM_REPORTS||[]).filter(r=> machineRecordMatchesIdentity_(r,canonicalMachineKey));
18390:   const totalPM = pmLogbookEntries.length + pmPatrolEntries.length;
18391: 
18392:   // Histori isu Elektrikal/Mekanikal dari laporan bulanan yang sudah diupload
18393:   // di menu Analisa Downtime (semua bulan tersimpan, bukan cuma 90 hari) —
18394:   // dicocokkan ke mesin ini lewat WORKCENTER, digabung supaya DNA tidak
18395:   // kehilangan info yang sudah pernah dilaporkan lewat menu tsb.
18396:   const emEntries = getDowntimeEmEntriesForMachine(canonicalMachineKey);
18397:   const emDowntimeMin = emEntries.reduce((s,r)=> s + (r.downtimeVal||0), 0);
18398: 
~~~

### Around line 18411
~~~text
18405:   // Karakter (bintang) — pakai fungsi Machine Health Score yang sama dipakai di Database Mesin,
18406:   // supaya rating di DNA selalu sinkron dengan yang ditampilkan di tempat lain.
18407:   const hs = machineHealthScore(canonicalMachineKey);
18408: 
18409:   // Penyakit Bawaan — pola kerusakan berulang. Digabung dari 2 sumber, tiap item
18410:   // ditandai sumbernya supaya jelas asalnya: (1) Logbook — pakai fungsi yang sama
18411:   // dengan insight Copilot "Pola Kerusakan Berulang"; (2) Analisa Downtime E&M —
18412:   // dikelompokkan dari uraian isu histori bulanan yang sudah diupload.
18413:   const repeatedLogbook = copilotRepeatedProblems(canonicalMachineKey, 2).map(g=> ({ label:g.label, count:g.count, bestFix:g.bestFix, source:'logbook' }));
18414:   const emGroups = {};
18415:   emEntries.forEach(r=>{
18416:     const key = String(r.descVal||'').trim().toLowerCase().slice(0,60);
18417:     if(!key) return;
18418:     if(!emGroups[key]) emGroups[key] = { label:r.descVal, count:0, bestFix:null, source:'downtime' };
18419:     emGroups[key].count++;
18420:   });
18421:   const repeatedEm = Object.values(emGroups).filter(g=> g.count >= 2);
18422:   const repeated = [...repeatedLogbook, ...repeatedEm].sort((a,b)=> b.count-a.count).slice(0,5);
18423: 
18424:   // Komponen Lemah — cari frasa komponen yang paling sering disebut di Deskripsi Masalah/Tindakan Perbaikan
~~~

### Around line 18413
~~~text
18407:   const hs = machineHealthScore(canonicalMachineKey);
18408: 
18409:   // Penyakit Bawaan — pola kerusakan berulang. Digabung dari 2 sumber, tiap item
18410:   // ditandai sumbernya supaya jelas asalnya: (1) Logbook — pakai fungsi yang sama
18411:   // dengan insight Copilot "Pola Kerusakan Berulang"; (2) Analisa Downtime E&M —
18412:   // dikelompokkan dari uraian isu histori bulanan yang sudah diupload.
18413:   const repeatedLogbook = copilotRepeatedProblems(canonicalMachineKey, 2).map(g=> ({ label:g.label, count:g.count, bestFix:g.bestFix, source:'logbook' }));
18414:   const emGroups = {};
18415:   emEntries.forEach(r=>{
18416:     const key = String(r.descVal||'').trim().toLowerCase().slice(0,60);
18417:     if(!key) return;
18418:     if(!emGroups[key]) emGroups[key] = { label:r.descVal, count:0, bestFix:null, source:'downtime' };
18419:     emGroups[key].count++;
18420:   });
18421:   const repeatedEm = Object.values(emGroups).filter(g=> g.count >= 2);
18422:   const repeated = [...repeatedLogbook, ...repeatedEm].sort((a,b)=> b.count-a.count).slice(0,5);
18423: 
18424:   // Komponen Lemah — cari frasa komponen yang paling sering disebut di Deskripsi Masalah/Tindakan Perbaikan
18425:   // (breakdown logbook) DAN di Uraian isu Analisa Downtime E&M yang sudah diupload untuk mesin ini.
18426:   // Sumber tiap komponen dilacak (bisa muncul di kedua sumber sekaligus) supaya bisa ditampilkan asalnya.
~~~

### Around line 19248
~~~text
19242:   return new Date(ts).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
19243: }
19244: /* ---------------- PATROL HARIAN (checklist tablet-first) ---------------- */
19245: // Menggantikan form Predictive Maintenance lama, tapi tetap memakai data
19246: // layer yang sama (PM_REPORTS / LS_PM_KEY / apiGet('predictiveReports') /
19247: // apiPost({action:'savePredictiveReport'|'deletePredictiveReport'})) supaya
19248: // Visual Dashboard, Copilot, dan backend Cloudflare TIDAK perlu diubah.
19249: const PATROL_CHECKLIST_DEF = {
19250:   'Elektrikal': ['Panel bersih','Lampu indikator normal','Tidak ada alarm','Tidak ada bau gosong','Kabel aman','Fan panel normal','Suhu panel normal','E-Stop berfungsi normal'],
19251:   'Mekanikal': ['Suara normal','Getaran normal','Bearing normal','Coupling normal','Belt normal','Gear normal','Safety guard normal','Baut/mur kencang'],
19252:   'Pneumatic': ['Tekanan normal','Tidak ada kebocoran','Selang dalam kondisi baik','FRL (Filter-Regulator-Lubricator) normal'],
19253:   'Lubrikasi': ['Level oli normal','Tidak ada kebocoran oli','Grease cukup'],
19254:   'Housekeeping': ['Area bersih','Tidak ada tumpahan','Jalur aman/tidak terhalang','Petugas memakai APD','Guard/pelindung lengkap']
19255: };
19256: // [FITUR BARU] Toggle tampil/sembunyi per kategori General Checking (Elektrikal,
19257: // Mekanikal, Pneumatic, Lubrikasi, Housekeeping) di menu Patrol Harian, diatur
19258: // dari Master Koneksi > "Kategori General Checking — Patrol Harian". Disimpan
19259: // localStorage (biar langsung kepakai offline) + disinkron ke backend Apps
19260: // Script (Script Properties) via action 'patrolCategoryConfig' (GET) /
19261: // 'savePatrolCategoryConfig' (POST) -- pola sama persis dengan ANALITIK_CONFIG.
~~~

### Around line 21756
~~~text
21750: // API saat layar dikunci.
21751: document.addEventListener('visibilitychange', () => {
21752:   if (document.visibilityState === 'visible') aktifkanFullscreen();
21753: });
21754: 
21755: /* =========================================================
21756:    AI MAINTENANCE COPILOT
21757:    Rule engine yang membaca ENTRIES/MACHINES/KB_ENTRIES yang sama
21758:    dengan menu Analitik & Knowledge Base, lalu menyusun insight
21759:    berbahasa natural. Tidak memanggil API eksternal apa pun — semua
21760:    dihitung di browser sehingga gratis, instan, dan datanya konsisten
21761:    dengan menu lain di aplikasi ini.
21762:    ========================================================= */
21763: 
21764: // Interval default Preventive Maintenance (hari) dipakai untuk deteksi
21765: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21766: // localStorage per-browser, tidak mengubah data di database SQLite).
21767: function copilotPmIntervalDays(){
21768:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
21769: }
~~~

### Around line 21765
~~~text
21759:    berbahasa natural. Tidak memanggil API eksternal apa pun — semua
21760:    dihitung di browser sehingga gratis, instan, dan datanya konsisten
21761:    dengan menu lain di aplikasi ini.
21762:    ========================================================= */
21763: 
21764: // Interval default Preventive Maintenance (hari) dipakai untuk deteksi
21765: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21766: // localStorage per-browser, tidak mengubah data di database SQLite).
21767: function copilotPmIntervalDays(){
21768:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
21769: }
21770: 
21771: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
21772: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
21773: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
21774: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
21775: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
21776: function copilotEntriesFor(kodeOrNama){
21777:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
21778:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
~~~

### Around line 21767
~~~text
21761:    dengan menu lain di aplikasi ini.
21762:    ========================================================= */
21763: 
21764: // Interval default Preventive Maintenance (hari) dipakai untuk deteksi
21765: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21766: // localStorage per-browser, tidak mengubah data di database SQLite).
21767: function copilotPmIntervalDays(){
21768:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
21769: }
21770: 
21771: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
21772: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
21773: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
21774: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
21775: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
21776: function copilotEntriesFor(kodeOrNama){
21777:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
21778:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
21779: }
21780: 
~~~

### Around line 21768
~~~text
21762:    ========================================================= */
21763: 
21764: // Interval default Preventive Maintenance (hari) dipakai untuk deteksi
21765: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21766: // localStorage per-browser, tidak mengubah data di database SQLite).
21767: function copilotPmIntervalDays(){
21768:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
21769: }
21770: 
21771: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
21772: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
21773: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
21774: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
21775: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
21776: function copilotEntriesFor(kodeOrNama){
21777:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
21778:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
21779: }
21780: 
21781: // Total downtime (menit) dalam suatu bulan kalender (0-indexed month) utk scope tertentu
~~~

### Around line 21771
~~~text
21765: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21766: // localStorage per-browser, tidak mengubah data di database SQLite).
21767: function copilotPmIntervalDays(){
21768:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
21769: }
21770: 
21771: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
21772: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
21773: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
21774: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
21775: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
21776: function copilotEntriesFor(kodeOrNama){
21777:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
21778:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
21779: }
21780: 
21781: // Total downtime (menit) dalam suatu bulan kalender (0-indexed month) utk scope tertentu
21782: function copilotMonthDowntime(kodeOrNama, year, month){
21783:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).reduce((sum,e)=>{
21784:     const d = new Date(e['Tanggal']);
~~~

### Around line 21776
~~~text
21770: 
21771: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
21772: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
21773: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
21774: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
21775: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
21776: function copilotEntriesFor(kodeOrNama){
21777:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
21778:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
21779: }
21780: 
21781: // Total downtime (menit) dalam suatu bulan kalender (0-indexed month) utk scope tertentu
21782: function copilotMonthDowntime(kodeOrNama, year, month){
21783:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).reduce((sum,e)=>{
21784:     const d = new Date(e['Tanggal']);
21785:     if(isNaN(d) || d.getFullYear()!==year || d.getMonth()!==month) return sum;
21786:     return sum + (parseDurationMinutes(e)||0);
21787:   }, 0);
21788: }
21789: function copilotMonthBreakdownCount(kodeOrNama, year, month){
~~~

### Around line 21782
~~~text
21776: function copilotEntriesFor(kodeOrNama){
21777:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
21778:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
21779: }
21780: 
21781: // Total downtime (menit) dalam suatu bulan kalender (0-indexed month) utk scope tertentu
21782: function copilotMonthDowntime(kodeOrNama, year, month){
21783:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).reduce((sum,e)=>{
21784:     const d = new Date(e['Tanggal']);
21785:     if(isNaN(d) || d.getFullYear()!==year || d.getMonth()!==month) return sum;
21786:     return sum + (parseDurationMinutes(e)||0);
21787:   }, 0);
21788: }
21789: function copilotMonthBreakdownCount(kodeOrNama, year, month){
21790:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).filter(e=>{
21791:     const d = new Date(e['Tanggal']);
21792:     return !isNaN(d) && d.getFullYear()===year && d.getMonth()===month;
21793:   }).length;
21794: }
21795: // Deret downtime bulanan (menit) N bulan terakhir termasuk bulan berjalan
~~~

## help-card — 0 hit(s)
- No match.

## bantuan-card — 0 hit(s)
- No match.

## panduan — 4 hit(s)
### Around line 8154
~~~text
08148: function renderConfigBanner(){
08149:   const holder = $('#config-banner-holder');
08150:   if(WEB_APP_URL){ holder.innerHTML = ''; return; }
08151:   holder.innerHTML = `
08152:     <div class="config-banner">
08153:       ⚠️ <b>Belum terhubung ke database SQLite.</b> Buka menu <b>Master Mesin &amp; Koneksi</b> di sidebar,
08154:       lalu tempelkan URL Web App dari Cloudflare (lihat <code>PANDUAN_SETUP.md</code>).
08155:     </div>`;
08156: }
08157: 
08158: /* ---------------- NAVIGATION ---------------- */
08159: function handleViewRenderError_(view, label, err){
08160:   const msg = err && err.message ? err.message : String(err || 'Error tidak diketahui');
08161:   console.error('[OMODOS] Gagal render view:', {view, label, error:err});
08162:   try{ if(typeof copilotLogError === 'function') copilotLogError('Render '+view+': '+msg, label||''); }catch(e){}
08163:   toast('Gagal memuat '+(label||view)+': '+msg, true);
08164: }
08165: function invokeViewRenderer_(view, renderer, label){
08166:   try{
08167:     const result = renderer();
~~~

### Around line 28152
~~~text
28146:     downtime:['Waktu berhenti mesin','Baca file downtime Elektrikal dan Mekanikal lalu buat ringkasan.','Pilih file Excel dan jalankan analisa.','Periksa hasil sebelum menyimpan atau mengunduh.'],
28147:     utama:['Lihat Logbook','Lihat seluruh catatan pekerjaan dari yang paling baru.','Gunakan pencarian atau filter bila datanya banyak.','Tekan catatan untuk melihat detail.'],
28148:     mesin:['Logbook per mesin','Lihat catatan hanya untuk mesin yang dipilih.','Pilih mesin dari daftar.','Baca catatan terbaru atau buka detailnya.'],
28149:     tanggal:['Logbook per tanggal','Cari pekerjaan berdasarkan tanggal.','Pilih tanggal atau rentang waktu.','Buka catatan yang ingin dibaca.'],
28150:     pelapor:['Logbook per pelapor','Cari catatan berdasarkan orang yang membuat laporan.','Pilih nama pelapor.','Buka catatan yang ingin dibaca.'],
28151:     group:['Logbook per grup','Cari catatan berdasarkan grup kerja.','Pilih grup.','Buka catatan yang ingin dibaca.'],
28152:     'insights-hub':['Analisis dan pengetahuan','Pilih alat bantu untuk memahami masalah maintenance.','Pilih analisis, panduan penyebab, atau pengetahuan.','Baca bukti sebelum mengambil keputusan.'],
28153:     durasi:['Durasi pekerjaan','Lihat pekerjaan yang memakan waktu paling lama.','Pilih rentang data.','Baca daftar pekerjaan dan durasinya.'],
28154:     analitik:['Ringkasan analisis','Lihat MTTR, MTBF, downtime, dan pola masalah.','Pilih rentang atau mesin bila tersedia.','Mulai dari angka yang paling perlu perhatian.'],
28155:     'kpi-department':['Target kerja departemen','Lihat target dan hasil kerja departemen.','Pilih periode yang ingin dilihat.','Bandingkan target dengan hasil yang tercatat.'],
28156:     'kpi-input':['Isi target kerja','Masukkan atau perbarui data KPI dan kertas kerja.','Isi periode dan nilai yang benar.','Simpan lalu periksa kembali hasilnya.'],
28157:     'machine-breakdown':['Riwayat kerusakan mesin','Catat dan lihat jumlah kerusakan mesin per bulan atau tahun.','Pilih tambah atau ubah data.','Isi nilai lalu simpan.'],
28158:     'record-ytd':['Riwayat mesin tahunan','Lihat data mesin dari tahun ke tahun.','Pilih atau tambahkan data tahun.','Periksa nilainya lalu simpan.'],
28159:     'run-hour-comparison':['Bandingkan jam operasi','Bandingkan jam operasi mesin antarperiode.','Pilih atau tambahkan data.','Baca perbedaannya lalu simpan bila ada perubahan.'],
28160:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28161:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28162:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28163:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28164:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28165:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
~~~

### Around line 28164
~~~text
28158:     'record-ytd':['Riwayat mesin tahunan','Lihat data mesin dari tahun ke tahun.','Pilih atau tambahkan data tahun.','Periksa nilainya lalu simpan.'],
28159:     'run-hour-comparison':['Bandingkan jam operasi','Bandingkan jam operasi mesin antarperiode.','Pilih atau tambahkan data.','Baca perbedaannya lalu simpan bila ada perubahan.'],
28160:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28161:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28162:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28163:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28164:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28165:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28166:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28167:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28168:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28169:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28170:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28171:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28172:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28173:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28174:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28175:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28176:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28177:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
~~~

### Around line 28207
~~~text
28201:     'People & Meetings':'Orang & Rapat','Input Report':'Buat Laporan','Dashboard & Analytics':'Ringkasan & Grafik',
28202:     'Factory Project':'Proyek Pabrik','Filter':'Saring Data','Tambah Project':'Tambah Proyek',
28203:     'PI Dashboard':'Ringkasan Kemampuan','Personnel':'Data Personel','Meeting Management':'Kelola Rapat',
28204:     'Meeting Analytics':'Ringkasan Rapat','Meeting Baru':'Buat Rapat','Open':'Belum Selesai',
28205:     'Download Excel Hasil Analisa':'Unduh Hasil Excel','Download Excel Resume':'Unduh Ringkasan Excel',
28206:     'Refresh':'Muat Ulang','Dashboard Analitik':'Ringkasan Analisis','Correlation Analysis':'Cari Hubungan Data',
28207:     'Diagnostic Wizard':'Panduan Cari Penyebab','Knowledge Base':'Pusat Pengetahuan',
28208:     'Knowledge Center':'Pusat Pengetahuan','Expert Finder':'Cari Teknisi Berpengalaman',
28209:     'Knowledge Graph':'Peta Hubungan Pengetahuan','Import Excel':'Ambil dari Excel',
28210:     'Import Excel (Upload File)':'Ambil dari File Excel','Tambah / Update Data':'Tambah / Ubah Data',
28211:     'Export Excel':'Unduh Excel','Export PDF':'Unduh PDF','Export Word':'Unduh Word',
28212:     'Reset':'Atur Ulang','Reset Konteks':'Kosongkan Pilihan','Reset Tampilan':'Atur Ulang Tampilan',
28213:     'User Management':'Kelola Pengguna','Role Access':'Hak Akses','Template Patrol':'Daftar Pemeriksaan Patrol',
28214:     'Tambah User':'Tambah Pengguna','Simpan Role Access':'Simpan Hak Akses','Edit':'Ubah','Batal Edit':'Batal Mengubah',
28215:     'Simpan Report RCA':'Simpan Laporan RCA','Buat Report IPAL Baru':'Buat Laporan IPAL Baru','Simpan Report':'Simpan Laporan',
28216:     'Import Semua Baris':'Ambil Semua Baris','Update Progress':'Tambah Perkembangan','Simpan Update':'Simpan Perkembangan',
28217:     'Edit Data':'Ubah Data','Tambah File (lewat Edit Data)':'Tambah File','Tambah Update Progress':'Tambah Perkembangan',
28218:     'Edit Meeting Ini':'Ubah Rapat Ini','Simpan Meeting':'Simpan Rapat','Tambah Action Item':'Tambah Tugas',
28219:     'Soft Skill Assessment':'Penilaian Perilaku','Hard Skill Assessment':'Penilaian Teknis',
28220:     'Smart Recognition & Resume Personil':'Ringkasan Otomatis Personel','Smart Recognition':'Pengenalan Otomatis',
~~~

## petunjuk — 1 hit(s)
### Around line 28163
~~~text
28157:     'machine-breakdown':['Riwayat kerusakan mesin','Catat dan lihat jumlah kerusakan mesin per bulan atau tahun.','Pilih tambah atau ubah data.','Isi nilai lalu simpan.'],
28158:     'record-ytd':['Riwayat mesin tahunan','Lihat data mesin dari tahun ke tahun.','Pilih atau tambahkan data tahun.','Periksa nilainya lalu simpan.'],
28159:     'run-hour-comparison':['Bandingkan jam operasi','Bandingkan jam operasi mesin antarperiode.','Pilih atau tambahkan data.','Baca perbedaannya lalu simpan bila ada perubahan.'],
28160:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28161:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28162:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28163:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28164:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28165:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28166:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28167:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28168:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28169:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28170:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28171:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28172:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28173:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28174:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28175:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28176:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
~~~

## how to — 0 hit(s)
- No match.

## Visible help container/button candidates

- L24150: <div class="sub" style="margin-top:10px;">Rekomendasi dihasilkan 100% lokal dari data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item yang sudah tersimpan di aplikasi ini (tanpa API/LLM eksternal) — gunakan sebagai bantuan pengambilan keputusan, tetap verifikasi di lapangan.</div>

