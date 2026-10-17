# OMODOS Focused Code Context

## function switchToView(
### Around line 8214
~~~text
08202: function invokeViewRenderer_(view, renderer, label){
08203:   try{
08204:     const result = renderer();
08205:     if(result && typeof result.then === 'function'){
08206:       result.catch(err=>handleViewRenderError_(view,label,err));
08207:     }
08208:     return result;
08209:   }catch(err){
08210:     handleViewRenderError_(view,label,err);
08211:     return null;
08212:   }
08213: }
08214: function switchToView(enteringView){
08215:   enteringView = String(enteringView||'').trim();
08216:   if(!enteringView){ toast('Tujuan halaman tidak valid.', true); return false; }
08217:   if(typeof canAccessView_ === 'function' && !canAccessView_(enteringView)){
08218:     showAccessDenied();
08219:     return false;
08220:   }
08221:   const enteringViewEl = document.getElementById('view-' + enteringView);
08222:   if(!enteringViewEl){
08223:     console.error('[OMODOS] View target tidak ditemukan:', enteringView);
08224:     toast('Halaman "' + enteringView + '" belum tersedia. Muat ulang aplikasi lalu coba lagi.', true);
08225:     return false;
08226:   }
08227: 
08228:   const leavingView = PREVIOUS_ACTIVE_VIEW;
08229: 
08230:   $$('.nav-btn').forEach(b=>b.classList.remove('active'));
08231:   $$('.nav-btn').forEach(b=>{ if(b.dataset.view===enteringView) b.classList.add('active'); });
08232:   $$('.bottom-nav-btn').forEach(b=>{ b.classList.remove('active'); b.classList.remove('group-active'); });
08233:   $$('.bottom-nav-btn').forEach(b=>{
08234:     if(b.dataset.view===enteringView){ b.classList.add('active'); return; }
08235:     if(b.dataset.group){
08236:       const submenu = $(`.nav-submenu[data-submenu="${b.dataset.group}"]`);
08237:       if(submenu && $(`.nav-btn[data-view="${enteringView}"]`, submenu)) b.classList.add('group-active');
08238:     }
08239:   });
08240:   $$('.view').forEach(v=>v.classList.remove('active'));
08241:   enteringViewEl.classList.add('active');
08242: 
08243:   // Fitur AI harus selalu kembali ke kondisi default setiap kali pengguna
08244:   // meninggalkan halaman ini — supaya tidak ada hasil analisa "nyangkut"
08245:   // dari sesi sebelumnya saat pengguna kembali lagi ke menu AI.
08246:   if(leavingView === 'ai' && enteringView !== 'ai'){ resetAiView(); }
08247: 
08248:   // Menu Setting: begitu pengguna meninggalkan menu ini ke menu lain,
08249:   // status login direset — supaya kembali ke menu Setting nanti wajib
08250:   // login ulang. Koneksi Cloudflare (WEB_APP_URL) TIDAK terpengaruh
08251:   // sama sekali oleh reset ini, tetap tersambung seperti biasa.
08252:   if(leavingView === 'setting' && enteringView !== 'setting'){ resetSettingAuth(); }
08253: 
08254:   // Hentikan interval jam berjalan Visual Dashboard saat berpindah halaman,
08255:   // supaya tidak terus berjalan di background dan membuang resource.
08256:   if(leavingView === 'dashboard' && enteringView !== 'dashboard' && DASHBOARD_TIMER_INTERVAL){
08257:     clearInterval(DASHBOARD_TIMER_INTERVAL); DASHBOARD_TIMER_INTERVAL = null;
08258:   }
08259: 
08260:   // Visual Dashboard tampil fullscreen: menu kiri disembunyikan dan hanya
08261:   // muncul saat tombol "Tampilkan Menu" diklik.
08262:   if(enteringView === 'dashboard'){
08263:     $('#app-root').classList.add('dash-mode');
08264:     closeDashMenu();
08265:   } else if(leavingView === 'dashboard'){
08266:     $('#app-root').classList.remove('dash-mode');
08267:     closeDashMenu();
08268:   }
08269: 
08270:   if(enteringView === 'utama') invokeViewRenderer_(enteringView, renderUtama, 'renderUtama');
08271:   if(enteringView === 'mesin') invokeViewRenderer_(enteringView, renderMesinView, 'renderMesinView');
08272:   if(enteringView === 'tanggal') invokeViewRenderer_(enteringView, renderTanggalView, 'renderTanggalView');
08273:   if(enteringView === 'pelapor') invokeViewRenderer_(enteringView, renderPelaporView, 'renderPelaporView');
08274:   if(enteringView === 'group') invokeViewRenderer_(enteringView, renderGroupView, 'renderGroupView');
08275:   if(enteringView === 'dashboard') invokeViewRenderer_(enteringView, renderDashboardView, 'renderDashboardView');
08276:   if(enteringView === 'omodos4') invokeViewRenderer_(enteringView, renderOmodos4, 'renderOmodos4');
08277:   if(enteringView === 'durasi') invokeViewRenderer_(enteringView, renderDurasiView, 'renderDurasiView');
08278:   if(enteringView === 'correlation') invokeViewRenderer_(enteringView, renderCorrelationView, 'renderCorrelationView');
~~~

## function attachSparepartPaginationHandlers(
### Around line 15082
~~~text
15070:     if(totalPages>9 && p!==1 && p!==totalPages && Math.abs(p-page)>2) continue;
15071:     if(last && p-last>1) nav += '<span style="padding:0 3px;color:var(--text-dim);">…</span>';
15072:     nav += '<button type="button" data-pg="'+p+'" class="'+(p===page?'active':'')+'">'+p+'</button>';
15073:     last=p;
15074:   }
15075:   nav += '<button type="button" data-sp-pg-action="next" '+(page>=totalPages?'disabled':'')+'>Halaman Selanjutnya</button>'+
15076:     '<button type="button" data-sp-pg-action="last" '+(page>=totalPages?'disabled':'')+'>Halaman Akhir</button>';
15077:   const from=totalRows ? (SP_COLLECT_PAGE_SIZE===0?1:(page-1)*SP_COLLECT_PAGE_SIZE+1) : 0;
15078:   const to=SP_COLLECT_PAGE_SIZE===0?totalRows:Math.min(totalRows,page*SP_COLLECT_PAGE_SIZE);
15079:   return '<div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:center;">'+sizeHtml+
15080:     '<span style="color:var(--text-dim);font-size:11.5px;">Menampilkan '+from+'–'+to+' dari '+totalRows+' data</span>'+nav+'</div>';
15081: }
15082: function attachSparepartPaginationHandlers(pager){
15083:   $$('button[data-pg]', pager).forEach(btn=> btn.addEventListener('click', ()=>{
15084:     const pg = Number(btn.dataset.pg);
15085:     if(!pg || btn.disabled) return;
15086:     SP_COLLECT_PAGE = pg;
15087:     renderSparepartCollectTable();
15088:   }));
15089:   $$('button[data-sp-pg-action]', pager).forEach(btn=>btn.addEventListener('click',()=>{
15090:     if(btn.disabled)return;
15091:     const rows=sparepartCollectFilteredSorted();
15092:     const pages=SP_COLLECT_PAGE_SIZE===0?1:Math.max(1,Math.ceil(rows.length/SP_COLLECT_PAGE_SIZE));
15093:     const action=btn.dataset.spPgAction;
15094:     if(action==='first')SP_COLLECT_PAGE=1;
15095:     if(action==='prev')SP_COLLECT_PAGE=Math.max(1,SP_COLLECT_PAGE-1);
15096:     if(action==='next')SP_COLLECT_PAGE=Math.min(pages,SP_COLLECT_PAGE+1);
15097:     if(action==='last')SP_COLLECT_PAGE=pages;
15098:     renderSparepartCollectTable();
15099:   }));
15100:   const sizeSel=$('select[data-sp-page-size]',pager);
15101:   if(sizeSel) sizeSel.addEventListener('change',()=>{
15102:     SP_COLLECT_PAGE_SIZE=Number(sizeSel.value);
15103:     SP_COLLECT_PAGE=1;
15104:     renderSparepartCollectTable();
15105:   });
15106: }
15107: 
15108: async function setDailyCollectionStatus(id, collected){
15109:   const nextStatus = collected ? 'COMPLETED' : 'PENDING';
15110:   const actor = (CURRENT_USER && (CURRENT_USER.displayName || CURRENT_USER.username)) || '';
15111:   if(!WEB_APP_URL) throw new Error('Backend Cloudflare belum terhubung. Status collection tidak diubah agar data lintas perangkat tetap konsisten.');
15112:   await apiPost({ action:'updateSparepartSap', id, status:nextStatus, sapDoc:'', pic:actor });
15113:   setSparepartSapEntry(id, { status:nextStatus, sapDoc:'', pic:actor, updatedAt:new Date().toISOString() });
15114: }
15115: 
15116: function attachSparepartHandlers(root){
15117:   $$('.sp-detail', root).forEach(btn=>{
15118:     btn.addEventListener('click', (ev)=>{ ev.stopPropagation(); openDetail(btn.dataset.id); });
15119:   });
15120:   $$('.sp-collect-toggle', root).forEach(cb=>{
15121:     cb.addEventListener('change', async ()=>{
15122:       const id = cb.dataset.id;
15123:       const wanted = cb.checked;
15124:       cb.disabled = true;
15125:       const row = cb.closest('tr');
15126:       try{
15127:         await setDailyCollectionStatus(id, wanted);
15128:         if(row) row.classList.toggle('is-collected', wanted);
15129:         const label = cb.closest('.sp-collect-check')?.querySelector('.sp-collect-check-label');
15130:         const ico = cb.closest('.sp-collect-check')?.querySelector('i');
15131:         if(label) label.textContent = wanted ? 'Sudah' : 'Belum';
15132:         if(ico) ico.className = `ph-bold ${wanted?'ph-check':'ph-package'}`;
15133:         renderSparepartCollectDash();
15134:         toast(wanted ? 'Ditandai: sudah dicollect Warehouse dan diinput ke SAP.' : 'Status dikembalikan menjadi belum dicollect.');
15135:         // Jika filter hanya menampilkan salah satu status, refresh list agar record
15136:         // langsung pindah dari antrian pending ke hasil completed (atau sebaliknya).
15137:         if($('#filter-sparepart-collection')?.value) renderSparepartCollectTable();
15138:       }catch(e){
15139:         cb.checked = !wanted;
15140:         toast(e.message || 'Gagal menyimpan status Daily Collection.', true);
15141:       }finally{
15142:         cb.disabled = false;
15143:       }
15144:     });
15145:   });
15146: }
~~~

## function renderSparepartCollectTable(
### Around line 15001
~~~text
14989:     return true;
14990:   });
14991: 
14992:   rows.sort((a,b)=>{
14993:     if(sortBy==='date-asc') return sparepartEntryTime(a.entry) - sparepartEntryTime(b.entry);
14994:     if(sortBy==='material-asc') return String(a.entry['Nama Material']||'').localeCompare(String(b.entry['Nama Material']||''));
14995:     if(sortBy==='qty-desc') return sparepartEntryTotalQty(b.entry) - sparepartEntryTotalQty(a.entry);
14996:     return sparepartEntryTime(b.entry) - sparepartEntryTime(a.entry);
14997:   });
14998:   return rows;
14999: }
15000: 
15001: function renderSparepartCollectTable(){
15002:   const tbody = $('#sp-collect-tbody');
15003:   const empty = $('#sp-collect-empty');
15004:   const pager = $('#sp-collect-pagination');
15005:   if(!tbody) return;
15006: 
15007:   const rows = sparepartCollectFilteredSorted();
15008:   if(!rows.length){
15009:     tbody.innerHTML = '';
15010:     empty.style.display = 'block';
15011:     pager.innerHTML = '';
15012:     return;
15013:   }
15014:   empty.style.display = 'none';
15015: 
15016:   const totalPages = SP_COLLECT_PAGE_SIZE===0 ? 1 : Math.max(1, Math.ceil(rows.length / SP_COLLECT_PAGE_SIZE));
15017:   if(SP_COLLECT_PAGE > totalPages) SP_COLLECT_PAGE = totalPages;
15018:   const startIdx = SP_COLLECT_PAGE_SIZE===0 ? 0 : (SP_COLLECT_PAGE-1) * SP_COLLECT_PAGE_SIZE;
15019:   const pageRows = SP_COLLECT_PAGE_SIZE===0 ? rows : rows.slice(startIdx, startIdx + SP_COLLECT_PAGE_SIZE);
15020: 
15021:   tbody.innerHTML = pageRows.map(({entry:e, sap})=>{
15022:     const id = e['ID'];
15023:     const detail = parseSparepartDetail(e);
15024:     const materialHtml = detail.length
15025:       ? detail.filter(d=>d.nama).map(d=> wikiLinkHtml('sparepart', d.nama, d.nama)).join(', ')
15026:       : escapeHtml(e['Nama Material']||'(Tanpa nama material)');
15027:     const mesinKey = isAreaEntry_(e) ? '' : (e['Kode Mesin'] || e['Nama Mesin']);
15028:     const mesinHtml = mesinKey ? wikiLinkHtml('mesin', mesinKey, e['Nama Mesin']||'-') : escapeHtml(logbookLocationLabel_(e));
15029:     const teknisiHtml = e['Nama Pelapor'] ? splitPelaporNames(e['Nama Pelapor']).map(n=>wikiLinkHtml('personil', n, n)).join(', ') : '-';
15030:     const wo = e['Nomor WO'] || e['No WO'] || e['WO'] || '-';
15031:     const qty = sparepartEntryTotalQty(e);
15032:     const collected = (sap.status||'PENDING') === 'COMPLETED';
15033:     return `
15034:     <tr class="${collected?'is-collected':''}" data-id="${escapeHtml(id)}">
15035:       <td class="sp-collect-mark-cell">
15036:         <label class="sp-collect-check" title="${collected?'Sudah dicollect Warehouse dan diinput ke SAP':'Tandai jika Warehouse sudah meng-collect dan menginput ke SAP'}">
15037:           <input type="checkbox" class="sp-collect-toggle" data-id="${escapeHtml(id)}" ${collected?'checked':''}>
15038:           <span class="sp-collect-check-ui"><i class="ph-bold ${collected?'ph-check':'ph-package'}"></i></span>
15039:           <span class="sp-collect-check-label">${collected?'Sudah':'Belum'}</span>
15040:         </label>
15041:       </td>
15042:       <td>${fmtDate(e['Tanggal'])}</td>
15043:       <td style="font-family:var(--font-mono);">${escapeHtml(id)}</td>
15044:       <td>${mesinHtml}</td>
15045:       <td>${escapeHtml(wo)}</td>
15046:       <td>${teknisiHtml}</td>
15047:       <td class="cell-material">${materialHtml || '(Tanpa nama material)'}<div style="font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);">SAP: ${escapeHtml(e['Material Number SAP']||'-')}</div></td>
15048:       <td style="text-align:center;">${qty}</td>
15049:       <td>
15050:         <div style="display:flex;gap:4px;">
15051:           <button type="button" class="btn btn-sm btn-ghost sp-detail" data-id="${escapeHtml(id)}" title="Lihat Detail Logbook"><i class="ph-bold ph-eye"></i><span class="sp-detail-label"> Detail</span></button>
15052:         </div>
15053:       </td>
15054:     </tr>`;
15055:   }).join('');
15056: 
15057:   pager.innerHTML = renderSparepartPaginationHtml(SP_COLLECT_PAGE, totalPages, rows.length);
15058:   attachSparepartHandlers(tbody);
15059:   attachSparepartPaginationHandlers(pager);
15060: }
15061: 
15062: function renderSparepartPaginationHtml(page, totalPages, totalRows){
15063:   const sizeOptions=[10,25,50,100,0];
15064:   const sizeHtml='<label style="font-size:11.5px;color:var(--text-dim);">Tampilkan</label><select data-sp-page-size style="height:32px;min-width:82px;">'+
15065:     sizeOptions.map(v=>'<option value="'+v+'" '+(SP_COLLECT_PAGE_SIZE===v?'selected':'')+'>'+(v===0?'Semua':v)+'</option>').join('')+'</select>';
~~~

## function applySparepartFilters(
### Around line 14968
~~~text
14956:       <div class="l" style="margin-top:6px;">${completed} sudah dicollect &amp; diinput SAP · ${pending} masih menunggu dari ${rows.length} record pemakaian</div>
14957:     </div>`;
14958:   const strip = $('#sparepart-stat-strip');
14959:   if(strip){
14960:     strip.innerHTML = `
14961:       <div class="stat-chip"><div class="n">${rows.length}</div><div class="l">Record Pemakaian</div></div>
14962:       <div class="stat-chip"><div class="n" style="color:var(--green)">${completed}</div><div class="l">Sudah Collect + SAP</div></div>
14963:       <div class="stat-chip"><div class="n" style="color:var(--amber)">${pending}</div><div class="l">Belum Collect</div></div>
14964:     `;
14965:   }
14966: }
14967: 
14968: function applySparepartFilters(){
14969:   SP_COLLECT_PAGE = 1;
14970:   renderSparepartCollectTable();
14971: }
14972: 
14973: function sparepartCollectFilteredSorted(){
14974:   const q = ($('#search-sparepart').value || '').toLowerCase();
14975:   const collectionF = $('#filter-sparepart-collection') ? $('#filter-sparepart-collection').value : '';
14976:   const sortBy = $('#sort-sparepart') ? $('#sort-sparepart').value : 'date-desc';
14977:   let rows = sparepartRows();
14978: 
14979:   rows = rows.filter(({entry:e, sap})=>{
14980:     const collectionStatus = (sap.status||'PENDING') === 'COMPLETED' ? 'COMPLETED' : 'PENDING';
14981:     if(collectionF && collectionStatus !== collectionF) return false;
14982:     if(q){
14983:       const hay = [
14984:         e['Nama Material'], e['Material Number SAP'], e['Nama Mesin'], e['Kode Mesin'],
14985:         e['ID'], e['Nomor WO'], e['No WO'], e['Nama Pelapor'], e['Nama Unit'],
14986:       ].join(' ').toLowerCase();
14987:       if(!hay.includes(q)) return false;
14988:     }
14989:     return true;
14990:   });
14991: 
14992:   rows.sort((a,b)=>{
14993:     if(sortBy==='date-asc') return sparepartEntryTime(a.entry) - sparepartEntryTime(b.entry);
14994:     if(sortBy==='material-asc') return String(a.entry['Nama Material']||'').localeCompare(String(b.entry['Nama Material']||''));
14995:     if(sortBy==='qty-desc') return sparepartEntryTotalQty(b.entry) - sparepartEntryTotalQty(a.entry);
14996:     return sparepartEntryTime(b.entry) - sparepartEntryTime(a.entry);
14997:   });
14998:   return rows;
14999: }
15000: 
15001: function renderSparepartCollectTable(){
15002:   const tbody = $('#sp-collect-tbody');
15003:   const empty = $('#sp-collect-empty');
15004:   const pager = $('#sp-collect-pagination');
15005:   if(!tbody) return;
15006: 
15007:   const rows = sparepartCollectFilteredSorted();
15008:   if(!rows.length){
15009:     tbody.innerHTML = '';
15010:     empty.style.display = 'block';
15011:     pager.innerHTML = '';
15012:     return;
15013:   }
15014:   empty.style.display = 'none';
15015: 
15016:   const totalPages = SP_COLLECT_PAGE_SIZE===0 ? 1 : Math.max(1, Math.ceil(rows.length / SP_COLLECT_PAGE_SIZE));
15017:   if(SP_COLLECT_PAGE > totalPages) SP_COLLECT_PAGE = totalPages;
15018:   const startIdx = SP_COLLECT_PAGE_SIZE===0 ? 0 : (SP_COLLECT_PAGE-1) * SP_COLLECT_PAGE_SIZE;
15019:   const pageRows = SP_COLLECT_PAGE_SIZE===0 ? rows : rows.slice(startIdx, startIdx + SP_COLLECT_PAGE_SIZE);
15020: 
15021:   tbody.innerHTML = pageRows.map(({entry:e, sap})=>{
15022:     const id = e['ID'];
15023:     const detail = parseSparepartDetail(e);
15024:     const materialHtml = detail.length
15025:       ? detail.filter(d=>d.nama).map(d=> wikiLinkHtml('sparepart', d.nama, d.nama)).join(', ')
15026:       : escapeHtml(e['Nama Material']||'(Tanpa nama material)');
15027:     const mesinKey = isAreaEntry_(e) ? '' : (e['Kode Mesin'] || e['Nama Mesin']);
15028:     const mesinHtml = mesinKey ? wikiLinkHtml('mesin', mesinKey, e['Nama Mesin']||'-') : escapeHtml(logbookLocationLabel_(e));
15029:     const teknisiHtml = e['Nama Pelapor'] ? splitPelaporNames(e['Nama Pelapor']).map(n=>wikiLinkHtml('personil', n, n)).join(', ') : '-';
15030:     const wo = e['Nomor WO'] || e['No WO'] || e['WO'] || '-';
15031:     const qty = sparepartEntryTotalQty(e);
15032:     const collected = (sap.status||'PENDING') === 'COMPLETED';
~~~

## const $ = (sel
### Around line 7319
~~~text
07307:     console.error('[RBAC SAVE FAILED]', {stage, error:err, backend:WEB_APP_URL});
07308:     return false;
07309:   }finally{
07310:     if(saveBtn) saveBtn.disabled = false;
07311:   }
07312: }
07313: // Penanda agar patch Tampilan Sederhana lama di bagian bawah file TIDAK membungkus
07314: // fungsi ini lagi. Fungsi di atas sudah menyimpan RBAC + LC secara atomik.
07315: handleSavePermissions_.__lcAtomic = true;
07316: 
07317: let SPAREPART_STATUS = {}; // {entryId: 'DONE' | 'PENDING'} — status validasi collect admin gudang
07318: 
07319: const $ = (sel, root=document) => root.querySelector(sel);
07320: const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
07321: 
07322: /* ---------------- PAGINATION STANDAR GLOBAL ----------------
07323:    Dipakai oleh halaman/list/table yang dapat berisi banyak data.
07324:    Pilihan: 10 / 25 / 50 / 100 / Semua.
07325:    Tidak mengubah data sumber; hanya mengatur item yang tampil di browser. */
07326: const UNIVERSAL_PAGE_SIZE_OPTIONS = [10,25,50,100,0];
07327: const UNIVERSAL_PAGINATION_TARGETS = [
07328:   'list-utama','list-mesin','list-tanggal','list-pelapor','list-group','list-durasi',
07329:   'database-grid','list-patrol-temuan','list-patrol-riwayat','kb-list','kb-suggest-list',
07330:   'list-rca-saved','list-project-report','list-sparepart-eta','list-sparepart-opname',
07331:   'list-sparepart-warehouse','sparepart-lokasi-table','mbd-tbody','ryt-tbody','rhc-tbody',
07332:   'ect-tbody','cr-tbody','eng-tbody','machine-list-table','personil-list-table','pct-list-table',
07333:   'rbac-user-table','pmc-list-wrap','mtg-list-wrap','ipal-saved-list','list-expert-finder',
07334:   'pi-personnel-grid','pi-sr-grid','pi-ss-history','pi-hs-history','pi-dash-gap-table','kd-grid',
07335:   'an-machine-grid','kpi-kerja-table','corr-pairs-table','pareto-table','imp-preview-table','sp-opname-checklist'
07336: ];
07337: const UNIVERSAL_PAGINATION_STATE = new Map();
07338: 
07339: (function injectUniversalPaginationStyle(){
07340:   if(document.getElementById('universal-pagination-style')) return;
07341:   const style=document.createElement('style');
07342:   style.id='universal-pagination-style';
07343:   style.textContent=`
07344:     .universal-pager{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:12px 0 18px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}
07345:     .universal-pager .up-left,.universal-pager .up-right{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
07346:     .universal-pager label,.universal-pager .up-info{font-size:11.5px;color:var(--text-dim);font-weight:600}
07347:     .universal-pager select{min-width:86px;height:34px}
07348:     .universal-pager button{min-width:34px;height:34px;padding:0 9px;border:1px solid var(--line);border-radius:8px;background:var(--panel-2);color:var(--text);font:700 11px/1 var(--font-body);cursor:pointer}
07349:     .universal-pager button:hover:not(:disabled){border-color:var(--red);color:var(--red)}
07350:     .universal-pager button.active{background:var(--red);border-color:var(--red);color:var(--on-accent)}
07351:     .universal-pager button:disabled{opacity:.4;cursor:not-allowed}
07352:     @media(max-width:640px){.universal-pager{align-items:stretch}.universal-pager .up-left,.universal-pager .up-right{width:100%}.universal-pager .up-right{justify-content:center}.universal-pager .up-info{width:100%}}
07353:   `;
07354:   document.head.appendChild(style);
07355: })();
07356: function universalPaginationItems_(container,id){
07357:   if(!container) return [];
07358:   if(id==='list-tanggal' || id==='list-durasi') return Array.from(container.querySelectorAll('.entry'));
07359:   if(container.tagName==='TBODY') return Array.from(container.children).filter(x=>x.tagName==='TR');
07360:   if(container.tagName==='TABLE'){
07361:     const tb=container.tBodies && container.tBodies[0];
07362:     return tb ? Array.from(tb.rows) : [];
07363:   }
07364:   const table=container.querySelector(':scope > table');
07365:   if(table && table.tBodies && table.tBodies[0]) return Array.from(table.tBodies[0].rows);
07366:   const direct=Array.from(container.children).filter(x=>!x.classList.contains('empty-state'));
07367:   if(direct.length===1){
07368:     const wrap=direct[0];
07369:     if(wrap.tagName==='TABLE' && wrap.tBodies && wrap.tBodies[0]) return Array.from(wrap.tBodies[0].rows);
07370:     const nestedTable=wrap.querySelector(':scope > table');
07371:     if(nestedTable && nestedTable.tBodies && nestedTable.tBodies[0]) return Array.from(nestedTable.tBodies[0].rows);
07372:     const nested=Array.from(wrap.children).filter(x=>!x.classList.contains('group-header')&&!x.classList.contains('section-title')&&!x.classList.contains('empty-state'));
07373:     if(nested.length>1) return nested;
07374:   }
07375:   return direct;
07376: }
07377: function universalPagerAnchor_(container){
07378:   if(container.tagName==='TBODY') return container.closest('table') || container;
07379:   return container;
07380: }
07381: function universalPaginationState_(id){
07382:   if(!UNIVERSAL_PAGINATION_STATE.has(id)) UNIVERSAL_PAGINATION_STATE.set(id,{page:1,size:10,total:-1,observer:null,scheduled:false});
07383:   return UNIVERSAL_PAGINATION_STATE.get(id);
~~~

## const $$ =
### Around line 7320
~~~text
07308:     return false;
07309:   }finally{
07310:     if(saveBtn) saveBtn.disabled = false;
07311:   }
07312: }
07313: // Penanda agar patch Tampilan Sederhana lama di bagian bawah file TIDAK membungkus
07314: // fungsi ini lagi. Fungsi di atas sudah menyimpan RBAC + LC secara atomik.
07315: handleSavePermissions_.__lcAtomic = true;
07316: 
07317: let SPAREPART_STATUS = {}; // {entryId: 'DONE' | 'PENDING'} — status validasi collect admin gudang
07318: 
07319: const $ = (sel, root=document) => root.querySelector(sel);
07320: const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
07321: 
07322: /* ---------------- PAGINATION STANDAR GLOBAL ----------------
07323:    Dipakai oleh halaman/list/table yang dapat berisi banyak data.
07324:    Pilihan: 10 / 25 / 50 / 100 / Semua.
07325:    Tidak mengubah data sumber; hanya mengatur item yang tampil di browser. */
07326: const UNIVERSAL_PAGE_SIZE_OPTIONS = [10,25,50,100,0];
07327: const UNIVERSAL_PAGINATION_TARGETS = [
07328:   'list-utama','list-mesin','list-tanggal','list-pelapor','list-group','list-durasi',
07329:   'database-grid','list-patrol-temuan','list-patrol-riwayat','kb-list','kb-suggest-list',
07330:   'list-rca-saved','list-project-report','list-sparepart-eta','list-sparepart-opname',
07331:   'list-sparepart-warehouse','sparepart-lokasi-table','mbd-tbody','ryt-tbody','rhc-tbody',
07332:   'ect-tbody','cr-tbody','eng-tbody','machine-list-table','personil-list-table','pct-list-table',
07333:   'rbac-user-table','pmc-list-wrap','mtg-list-wrap','ipal-saved-list','list-expert-finder',
07334:   'pi-personnel-grid','pi-sr-grid','pi-ss-history','pi-hs-history','pi-dash-gap-table','kd-grid',
07335:   'an-machine-grid','kpi-kerja-table','corr-pairs-table','pareto-table','imp-preview-table','sp-opname-checklist'
07336: ];
07337: const UNIVERSAL_PAGINATION_STATE = new Map();
07338: 
07339: (function injectUniversalPaginationStyle(){
07340:   if(document.getElementById('universal-pagination-style')) return;
07341:   const style=document.createElement('style');
07342:   style.id='universal-pagination-style';
07343:   style.textContent=`
07344:     .universal-pager{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:12px 0 18px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}
07345:     .universal-pager .up-left,.universal-pager .up-right{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
07346:     .universal-pager label,.universal-pager .up-info{font-size:11.5px;color:var(--text-dim);font-weight:600}
07347:     .universal-pager select{min-width:86px;height:34px}
07348:     .universal-pager button{min-width:34px;height:34px;padding:0 9px;border:1px solid var(--line);border-radius:8px;background:var(--panel-2);color:var(--text);font:700 11px/1 var(--font-body);cursor:pointer}
07349:     .universal-pager button:hover:not(:disabled){border-color:var(--red);color:var(--red)}
07350:     .universal-pager button.active{background:var(--red);border-color:var(--red);color:var(--on-accent)}
07351:     .universal-pager button:disabled{opacity:.4;cursor:not-allowed}
07352:     @media(max-width:640px){.universal-pager{align-items:stretch}.universal-pager .up-left,.universal-pager .up-right{width:100%}.universal-pager .up-right{justify-content:center}.universal-pager .up-info{width:100%}}
07353:   `;
07354:   document.head.appendChild(style);
07355: })();
07356: function universalPaginationItems_(container,id){
07357:   if(!container) return [];
07358:   if(id==='list-tanggal' || id==='list-durasi') return Array.from(container.querySelectorAll('.entry'));
07359:   if(container.tagName==='TBODY') return Array.from(container.children).filter(x=>x.tagName==='TR');
07360:   if(container.tagName==='TABLE'){
07361:     const tb=container.tBodies && container.tBodies[0];
07362:     return tb ? Array.from(tb.rows) : [];
07363:   }
07364:   const table=container.querySelector(':scope > table');
07365:   if(table && table.tBodies && table.tBodies[0]) return Array.from(table.tBodies[0].rows);
07366:   const direct=Array.from(container.children).filter(x=>!x.classList.contains('empty-state'));
07367:   if(direct.length===1){
07368:     const wrap=direct[0];
07369:     if(wrap.tagName==='TABLE' && wrap.tBodies && wrap.tBodies[0]) return Array.from(wrap.tBodies[0].rows);
07370:     const nestedTable=wrap.querySelector(':scope > table');
07371:     if(nestedTable && nestedTable.tBodies && nestedTable.tBodies[0]) return Array.from(nestedTable.tBodies[0].rows);
07372:     const nested=Array.from(wrap.children).filter(x=>!x.classList.contains('group-header')&&!x.classList.contains('section-title')&&!x.classList.contains('empty-state'));
07373:     if(nested.length>1) return nested;
07374:   }
07375:   return direct;
07376: }
07377: function universalPagerAnchor_(container){
07378:   if(container.tagName==='TBODY') return container.closest('table') || container;
07379:   return container;
07380: }
07381: function universalPaginationState_(id){
07382:   if(!UNIVERSAL_PAGINATION_STATE.has(id)) UNIVERSAL_PAGINATION_STATE.set(id,{page:1,size:10,total:-1,observer:null,scheduled:false});
07383:   return UNIVERSAL_PAGINATION_STATE.get(id);
07384: }
~~~

## function latestLogbookForMachine_
### Around line 16472
~~~text
16460:   return !!(rn && mn && rn===mn);
16461: }
16462: function latestEntryPerMachine(){
16463:   const map = {};
16464:   sotEntries(ENTRIES).forEach(e=>{
16465:     const keys=[String(e['Nama Mesin']||''),String(e['Kode Mesin']||'')].filter(Boolean);
16466:     keys.forEach(k=>{
16467:       if(!map[k] || machineEventTs_(e)>machineEventTs_(map[k])) map[k]=e;
16468:     });
16469:   });
16470:   return map;
16471: }
16472: function latestLogbookForMachine_(machine){
16473:   let best=null,bestTs=-Infinity;
16474:   sotEntries(ENTRIES).forEach(e=>{
16475:     if(!machineMatchRecord_(e,machine))return;
16476:     const t=machineEventTs_(e);if(t>bestTs){best=e;bestTs=t;}
16477:   });
16478:   return best;
16479: }
16480: 
16481: // [FIX] HOME_PRIORITY_KODE_MESIN & HOME_MACHINE_FILTER dipindah ke atas
16482: // (dekat deklarasi PREVIOUS_ACTIVE_VIEW/DASHBOARD_TIMER_INTERVAL) — lihat
16483: // catatan di sana. Jangan dideklarasikan ulang di sini.
16484: function dashboardMachineList(){
16485:   if(!Array.isArray(MACHINES)) return [];
16486:   let list = MACHINES
16487:     .slice()
16488:     .sort((a,b)=> String(a['Nama Mesin']||'').localeCompare(String(b['Nama Mesin']||'')))
16489:     .map(m=> ({ kode: m['Kode Mesin']||'', nama: m['Nama Mesin']||'' }))
16490:     .filter(m=> m.nama);
16491:   if(HOME_MACHINE_FILTER === 'priority'){
16492:     list = list.filter(m=> HOME_PRIORITY_KODE_MESIN.includes(m.kode));
16493:   }
16494:   return list;
16495: }
16496: 
16497: function dashTimerStartIso(e){
16498:   const tgl = e['Tanggal'];
16499:   if(!tgl) return '';
16500:   const wkt = fmtTime(e['Waktu']) || '00:00';
16501:   const d = new Date(`${String(tgl).slice(0,10)}T${wkt}:00`);
16502:   return isNaN(d) ? '' : d.toISOString();
16503: }
16504: 
16505: function pmSeverityKey(sev){
16506:   if(sev === 'Kritikal') return 'kritikal';
16507:   if(sev === 'Perlu Perhatian') return 'perhatian';
16508:   if(sev === 'Normal') return 'normal';
16509:   return 'none';
16510: }
16511: function healthStatusKey(hs){
16512:   if(!hs || hs.label === 'Belum Ada Data') return 'none';
16513:   if(hs.label === 'Excellent' || hs.label === 'Good') return 'normal';
16514:   if(hs.label === 'Perlu Perhatian') return 'perhatian';
16515:   return 'kritikal'; // Critical
16516: }
16517: // [EDIT] Statistik MTBF/MTTR/Lost Time per mesin, dihitung HANYA dari entri
16518: // breakdown 24 jam terakhir (dipakai untuk mengisi deskripsi card Home,
16519: // menggantikan teks deskripsi masalah/temuan patrol yang lama).
16520: function machine24hStats(nama){
16521:   const now = Date.now();
16522:   // [FIX] Sama seperti bug di renderHomeSmartResume(): clampToSot() di sini
16523:   // memaksa cutoff jadi 1 Sept 2026 selama tanggal sistem masih SEBELUM itu,
16524:   // sehingga "cutoff > now" dan filter di bawah mustahil terpenuhi -- deskripsi
16525:   // kartu mesin (MTBF/MTTR/Lost Time) di Beranda selalu kosong. Jendela
16526:   // rolling 24 jam tidak perlu clamp ke SOT_CUTOFF_DATE (itu untuk menyaring
16527:   // data historis OneNote berbasis field 'Tanggal', bukan aktivitas real-time).
16528:   const cutoff = now - 24*60*60*1000;
16529:   const entries = (typeof ENTRIES !== 'undefined' && Array.isArray(ENTRIES)) ? ENTRIES.filter(e=>{
16530:     if(e['Nama Mesin'] !== nama) return false;
16531:     const t = new Date(e['Timestamp Input']).getTime();
16532:     return !isNaN(t) && t >= cutoff && t <= now;
16533:   }) : [];
16534:   const breakdownEntries = entries.filter(anIsBreakdown);
16535:   const bkDates = breakdownEntries.map(e=>new Date(e['Tanggal'])).filter(d=>!isNaN(d)).sort((a,b)=>a-b);
16536:   let mtbfJam = null;
~~~

## function latestPatrolForMachine_
### Around line 19375
~~~text
19363:   return summary.concat(full);
19364: }
19365: function latestPmStatusPerMachine(){
19366:   const map = {};
19367:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19368:     const keys=[String(r.namaMesin||''),String(r.kodeMesin||'')].filter(Boolean);
19369:     keys.forEach(key=>{
19370:       if(!map[key] || patrolEventTs_(r)>patrolEventTs_(map[key])) map[key]=r;
19371:     });
19372:   });
19373:   return map;
19374: }
19375: function latestPatrolForMachine_(machine){
19376:   let best=null,bestTs=-Infinity;
19377:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19378:     if(!machineMatchRecord_(r,machine))return;
19379:     const t=patrolEventTs_(r);if(t>bestTs){best=r;bestTs=t;}
19380:   });
19381:   return best;
19382: }
19383: function machineLatestStatusSnapshot_(machine){
19384:   const log=latestLogbookForMachine_(machine), patrol=latestPatrolForMachine_(machine);
19385:   const logTs=machineEventTs_(log), patrolTs=patrolEventTs_(patrol);
19386:   if(!log && !patrol) return {key:'none',source:'none',sourceLabel:'Belum Ada Data',ts:-Infinity,record:null,description:'Belum ada data Logbook atau Patrol sejak 1 September 2026.'};
19387:   if(patrol && patrolTs>=logTs){
19388:     return {key:pmSeverityKey(patrol.severity),source:'patrol',sourceLabel:'Patrol',ts:patrolTs,record:patrol,
19389:       description:patrol.deskripsiTemuan||patrol.titikInspeksi||'Patrol tersimpan tanpa catatan temuan.'};
19390:   }
19391:   return {key:dashStatusKey(log && log['Status']),source:'logbook',sourceLabel:'Logbook',ts:logTs,record:log,
19392:     description:(log&&log['Deskripsi Masalah'])||'Logbook tersimpan tanpa deskripsi masalah.'};
19393: }
19394: function formatMachineStatusTime_(ts){
19395:   if(!Number.isFinite(ts)||ts<=0)return 'Belum ada waktu tercatat';
19396:   return new Date(ts).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
19397: }
19398: /* ---------------- PATROL HARIAN (checklist tablet-first) ---------------- */
19399: // Menggantikan form Predictive Maintenance lama, tapi tetap memakai data
19400: // layer yang sama (PM_REPORTS / LS_PM_KEY / apiGet('predictiveReports') /
19401: // apiPost({action:'savePredictiveReport'|'deletePredictiveReport'})) supaya
19402: // Visual Dashboard, Copilot, dan backend Cloudflare TIDAK perlu diubah.
19403: const PATROL_CHECKLIST_DEF = {
19404:   'Elektrikal': ['Panel bersih','Lampu indikator normal','Tidak ada alarm','Tidak ada bau gosong','Kabel aman','Fan panel normal','Suhu panel normal','E-Stop berfungsi normal'],
19405:   'Mekanikal': ['Suara normal','Getaran normal','Bearing normal','Coupling normal','Belt normal','Gear normal','Safety guard normal','Baut/mur kencang'],
19406:   'Pneumatic': ['Tekanan normal','Tidak ada kebocoran','Selang dalam kondisi baik','FRL (Filter-Regulator-Lubricator) normal'],
19407:   'Lubrikasi': ['Level oli normal','Tidak ada kebocoran oli','Grease cukup'],
19408:   'Housekeeping': ['Area bersih','Tidak ada tumpahan','Jalur aman/tidak terhalang','Petugas memakai APD','Guard/pelindung lengkap']
19409: };
19410: // [FITUR BARU] Toggle tampil/sembunyi per kategori General Checking (Elektrikal,
19411: // Mekanikal, Pneumatic, Lubrikasi, Housekeeping) di menu Patrol Harian, diatur
19412: // dari Master Koneksi > "Kategori General Checking — Patrol Harian". Disimpan
19413: // localStorage (biar langsung kepakai offline) + disinkron ke backend Apps
19414: // Script (Script Properties) via action 'patrolCategoryConfig' (GET) /
19415: // 'savePatrolCategoryConfig' (POST) -- pola sama persis dengan ANALITIK_CONFIG.
19416: // Key object HARUS sama persis dengan key di PATROL_CHECKLIST_DEF di atas.
19417: // Kategori yang belum pernah diatur (key tidak ada di object) dianggap AKTIF
19418: // (tampil) secara default -- lihat renderPatrolChecklist().
19419: let PATROL_CATEGORY_CONFIG = {};
19420: function loadPatrolCategoryConfigLocal(){
19421:   try{ return JSON.parse(localStorage.getItem(LS_PATROL_CATEGORY_CONFIG_KEY)||'{}') || {}; }
19422:   catch(e){ return {}; }
19423: }
19424: function savePatrolCategoryConfigLocal(cfg){
19425:   localStorage.setItem(LS_PATROL_CATEGORY_CONFIG_KEY, JSON.stringify(cfg));
19426:   PATROL_CATEGORY_CONFIG = cfg;
19427: }
19428: async function syncPatrolCategoryConfigFromBackend(){
19429:   PATROL_CATEGORY_CONFIG = loadPatrolCategoryConfigLocal();
19430:   if(!WEB_APP_URL) return PATROL_CATEGORY_CONFIG;
19431:   try{
19432:     const remote = await apiGet('patrolCategoryConfig');
19433:     if(remote && typeof remote === 'object') savePatrolCategoryConfigLocal(remote);
19434:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
19435:   return PATROL_CATEGORY_CONFIG;
19436: }
19437: 
19438: // [FITUR BARU] Sebelumnya menu Setting "Kategori General Checking" cuma bisa
19439: // nyala/matikan kategori (Elektrikal/Mekanikal/dst), ISI ITEM di dalam tiap
~~~

## function currentMachineStatusSnapshot_
No match.

## omodos4.view
### Around line 6499
~~~text
06487:       });
06488:     });
06489:   });
06490:   return list;
06491: }
06492: window.discoverFeatureRegistry = discoverFeatureRegistryFromDom;
06493: 
06494: // Gabungkan daftar dari backend (kalau ada label/grup kustom) dengan hasil
06495: // scan DOM (sumber kebenaran menu yang benar-benar ADA). DOM selalu menang
06496: // untuk keberadaan fitur; backend hanya boleh menambah metadata.
06497: function mergeFeatureRegistry(backendList){
06498:   const discovered = discoverFeatureRegistryFromDom();
06499:   if(!discovered.some(f=>f.PermissionKey==='omodos4.view')){
06500:     discovered.push({PermissionKey:'omodos4.view',Label:'OMODOS 4.0 (Superadmin Root)',Group:'OMODOS 4.0'});
06501:   }
06502:   const byKey = {};
06503:   discovered.forEach(f=> byKey[f.PermissionKey] = f);
06504:   (backendList||[]).forEach(f=>{
06505:     if(!f || !f.PermissionKey) return;
06506:     byKey[f.PermissionKey] = Object.assign({}, byKey[f.PermissionKey] || {}, f);
06507:   });
06508:   return Object.values(byKey);
06509: }
06510: window.mergeFeatureRegistry = mergeFeatureRegistry;
06511: 
06512: // Render ulang sidebar (sembunyikan menu/submenu yang tidak diizinkan) dan
06513: // info user yang sedang login. Dipanggil setelah login sukses.
06514: function applyRbacToUi(){
06515:   $$('.nav-btn[data-view]').forEach(btn=>{
06516:     const view = btn.dataset.view;
06517:     // [FIX] "Home" (dashboard) DIKECUALIKAN dari RBAC gating -- ini halaman
06518:     // utama/landing page aplikasi, wajib selalu bisa diakses SEMUA role tanpa
06519:     // terkecuali. Sebelumnya kalau permission 'view.dashboard' untuk role
06520:     // tertentu belum di-centang di Role Access Management (mis. lupa di-set
06521:     // saat menambah role baru), tombol Home hilang total dari sidebar MAUPUN
06522:     // bottom-nav untuk role itu -- mengunci user dari halaman utamanya sendiri.
06523:     if(view === 'dashboard'){ btn.style.display = ''; return; }
06524:     const key = 'view.' + view;
06525:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06526:     // Hanya menu yang terdaftar di Feature Registry yang digate; menu lain
06527:     // (kalau ada) tetap tampil seperti semula supaya tidak mengubah UX yang
06528:     // belum terdaftar.
06529:     const allowed = !known || hasPermission(key);
06530:     btn.style.display = allowed ? '' : 'none';
06531:   });
06532:   // Sembunyikan grup kalau (a) SEMUA submenu di dalamnya disembunyikan, ATAU
06533:   // (b) grup itu sendiri punya permission 'group.<key>' yang secara eksplisit
06534:   // di-nonaktifkan di Role Access Management (mis. Superadmin sengaja
06535:   // mematikan seluruh grup "Reports & Field Work" untuk role tertentu, walau
06536:   // submenu di dalamnya belum tentu satu-satu di-nonaktifkan).
06537:   // [FIX] Sebelumnya permission 'group.<key>' HANYA dipakai untuk Low
06538:   // Cognitive Mode (data-lc-hide) -- tidak pernah benar-benar menyembunyikan
06539:   // grup dari Role Access Management biasa. Sekarang keduanya diperiksa.
06540:   // [FIX] Tombol bottom-nav mobile (data-group="...") sebelumnya TIDAK ikut
06541:   // disembunyikan sama sekali oleh RBAC -- hanya sidebar yang tergate,
06542:   // sehingga tombol grup di bottom-nav tetap muncul walau seluruh isinya
06543:   // (atau grupnya sendiri) tidak diizinkan untuk role tsb. Sekarang
06544:   // visibilitas bottom-nav-btn[data-group] SELALU disamakan dengan grup
06545:   // sidebar yang bersangkutan.
06546:   $$('.nav-group-collapsible').forEach(group=>{
06547:     const parentBtn = $('.nav-parent-btn', group);
06548:     const groupKey = (parentBtn && parentBtn.dataset.group) || group.dataset.groupKey || '';
06549:     // [FIX] Baris 'group.<key>' otomatis terdaftar di Role Access Management
06550:     // sebagai baris TERPISAH ("... (Grup)") dari menu-menu di dalamnya. Karena
06551:     // Simpan Role Access selalu mengirim SEMUA baris yang sedang tampil di
06552:     // tabel (bukan hanya yang diubah), baris grup yang tidak sengaja
06553:     // dibiarkan tidak tercentang otomatis tersimpan sebagai "ditolak" (false)
06554:     // begitu Superadmin menyimpan perubahan apa pun -- walau menu di dalam
06555:     // grup itu (mis. Patrol Harian) sudah eksplisit diizinkan satu-satu.
06556:     // Akibatnya seluruh grup (Reports & Field Work, Water Treatment Plant,
06557:     // Energy & Utility, KPI Department, dst) raib untuk role tsb walau
06558:     // isinya sudah diizinkan -- ini penyebab utama "menu sidebar/bottom bar
06559:     // tidak sesuai konfigurasi akun". Supaya konsisten dengan menu individual
06560:     // (default: izinkan, kecuali memang tidak ada satu pun menu di dalamnya
06561:     // yang diizinkan), grup sekarang HANYA disembunyikan berdasarkan
06562:     // visibilitas submenu di dalamnya -- permission 'group.<key>' tidak lagi
06563:     // dipakai sebagai gate tambahan yang bisa mengunci seluruh grup secara
~~~

### Around line 6500
~~~text
06488:     });
06489:   });
06490:   return list;
06491: }
06492: window.discoverFeatureRegistry = discoverFeatureRegistryFromDom;
06493: 
06494: // Gabungkan daftar dari backend (kalau ada label/grup kustom) dengan hasil
06495: // scan DOM (sumber kebenaran menu yang benar-benar ADA). DOM selalu menang
06496: // untuk keberadaan fitur; backend hanya boleh menambah metadata.
06497: function mergeFeatureRegistry(backendList){
06498:   const discovered = discoverFeatureRegistryFromDom();
06499:   if(!discovered.some(f=>f.PermissionKey==='omodos4.view')){
06500:     discovered.push({PermissionKey:'omodos4.view',Label:'OMODOS 4.0 (Superadmin Root)',Group:'OMODOS 4.0'});
06501:   }
06502:   const byKey = {};
06503:   discovered.forEach(f=> byKey[f.PermissionKey] = f);
06504:   (backendList||[]).forEach(f=>{
06505:     if(!f || !f.PermissionKey) return;
06506:     byKey[f.PermissionKey] = Object.assign({}, byKey[f.PermissionKey] || {}, f);
06507:   });
06508:   return Object.values(byKey);
06509: }
06510: window.mergeFeatureRegistry = mergeFeatureRegistry;
06511: 
06512: // Render ulang sidebar (sembunyikan menu/submenu yang tidak diizinkan) dan
06513: // info user yang sedang login. Dipanggil setelah login sukses.
06514: function applyRbacToUi(){
06515:   $$('.nav-btn[data-view]').forEach(btn=>{
06516:     const view = btn.dataset.view;
06517:     // [FIX] "Home" (dashboard) DIKECUALIKAN dari RBAC gating -- ini halaman
06518:     // utama/landing page aplikasi, wajib selalu bisa diakses SEMUA role tanpa
06519:     // terkecuali. Sebelumnya kalau permission 'view.dashboard' untuk role
06520:     // tertentu belum di-centang di Role Access Management (mis. lupa di-set
06521:     // saat menambah role baru), tombol Home hilang total dari sidebar MAUPUN
06522:     // bottom-nav untuk role itu -- mengunci user dari halaman utamanya sendiri.
06523:     if(view === 'dashboard'){ btn.style.display = ''; return; }
06524:     const key = 'view.' + view;
06525:     const known = FEATURE_REGISTRY.some(f => f.PermissionKey === key);
06526:     // Hanya menu yang terdaftar di Feature Registry yang digate; menu lain
06527:     // (kalau ada) tetap tampil seperti semula supaya tidak mengubah UX yang
06528:     // belum terdaftar.
06529:     const allowed = !known || hasPermission(key);
06530:     btn.style.display = allowed ? '' : 'none';
06531:   });
06532:   // Sembunyikan grup kalau (a) SEMUA submenu di dalamnya disembunyikan, ATAU
06533:   // (b) grup itu sendiri punya permission 'group.<key>' yang secara eksplisit
06534:   // di-nonaktifkan di Role Access Management (mis. Superadmin sengaja
06535:   // mematikan seluruh grup "Reports & Field Work" untuk role tertentu, walau
06536:   // submenu di dalamnya belum tentu satu-satu di-nonaktifkan).
06537:   // [FIX] Sebelumnya permission 'group.<key>' HANYA dipakai untuk Low
06538:   // Cognitive Mode (data-lc-hide) -- tidak pernah benar-benar menyembunyikan
06539:   // grup dari Role Access Management biasa. Sekarang keduanya diperiksa.
06540:   // [FIX] Tombol bottom-nav mobile (data-group="...") sebelumnya TIDAK ikut
06541:   // disembunyikan sama sekali oleh RBAC -- hanya sidebar yang tergate,
06542:   // sehingga tombol grup di bottom-nav tetap muncul walau seluruh isinya
06543:   // (atau grupnya sendiri) tidak diizinkan untuk role tsb. Sekarang
06544:   // visibilitas bottom-nav-btn[data-group] SELALU disamakan dengan grup
06545:   // sidebar yang bersangkutan.
06546:   $$('.nav-group-collapsible').forEach(group=>{
06547:     const parentBtn = $('.nav-parent-btn', group);
06548:     const groupKey = (parentBtn && parentBtn.dataset.group) || group.dataset.groupKey || '';
06549:     // [FIX] Baris 'group.<key>' otomatis terdaftar di Role Access Management
06550:     // sebagai baris TERPISAH ("... (Grup)") dari menu-menu di dalamnya. Karena
06551:     // Simpan Role Access selalu mengirim SEMUA baris yang sedang tampil di
06552:     // tabel (bukan hanya yang diubah), baris grup yang tidak sengaja
06553:     // dibiarkan tidak tercentang otomatis tersimpan sebagai "ditolak" (false)
06554:     // begitu Superadmin menyimpan perubahan apa pun -- walau menu di dalam
06555:     // grup itu (mis. Patrol Harian) sudah eksplisit diizinkan satu-satu.
06556:     // Akibatnya seluruh grup (Reports & Field Work, Water Treatment Plant,
06557:     // Energy & Utility, KPI Department, dst) raib untuk role tsb walau
06558:     // isinya sudah diizinkan -- ini penyebab utama "menu sidebar/bottom bar
06559:     // tidak sesuai konfigurasi akun". Supaya konsisten dengan menu individual
06560:     // (default: izinkan, kecuali memang tidak ada satu pun menu di dalamnya
06561:     // yang diizinkan), grup sekarang HANYA disembunyikan berdasarkan
06562:     // visibilitas submenu di dalamnya -- permission 'group.<key>' tidak lagi
06563:     // dipakai sebagai gate tambahan yang bisa mengunci seluruh grup secara
06564:     // tidak sengaja.
~~~

### Around line 28797
~~~text
28785:     schedule(root||document);
28786:   });
28787:   obs.observe(document.body,{childList:true,subtree:true,characterData:true});
28788:   window.enhanceLegacyLowCognitiveUi=enhance;
28789: })();
28790: </script>
28791: 
28792: 
28793: <script id="omodos4-phase1-script">
28794: (function(){
28795:   'use strict';
28796: 
28797:   const V4_PERMISSION_ROOT = 'omodos4.view';
28798: 
28799:   function v4IsSuperadmin(){
28800:     try{
28801:       return typeof isSuperadmin === 'function'
28802:         ? isSuperadmin()
28803:         : !!(typeof CURRENT_USER !== 'undefined' && CURRENT_USER && CURRENT_USER.role === 'Superadmin');
28804:     }catch(e){ return false; }
28805:   }
28806: 
28807:   function v4Entries(){
28808:     try{
28809:       const rows = (typeof ENTRIES !== 'undefined' && Array.isArray(ENTRIES)) ? ENTRIES : [];
28810:       return typeof sotEntries === 'function' ? sotEntries(rows) : rows;
28811:     }catch(e){ return []; }
28812:   }
28813: 
28814:   function v4Text(obj){
28815:     if(!obj || typeof obj !== 'object') return '';
28816:     return Object.values(obj).filter(v=>v!=null && typeof v!=='object').join(' ').toLowerCase();
28817:   }
28818: 
28819:   function v4MachineName(e){
28820:     return String((e && (e['Nama Mesin'] || e['Kode Mesin'] || e['Mesin'])) || '-').trim() || '-';
28821:   }
28822: 
28823:   function v4Status(e){
28824:     return String((e && (e['Status'] || e['Status Pekerjaan'] || e['Status Mesin'])) || '').trim();
28825:   }
28826: 
28827:   function v4IsDone(e){
28828:     const s=v4Status(e).toLowerCase();
28829:     return ['selesai','done','completed','closed','close'].some(x=>s===x || s.includes(x));
28830:   }
28831: 
28832:   function v4IsCritical(e){
28833:     const t=v4Text(e);
28834:     return /emergency|breakdown|critical|kritis|stop mesin|downtime/.test(t) && !v4IsDone(e);
28835:   }
28836: 
28837:   function v4DateValue(e){
28838:     const raw=(e && (e['Timestamp'] || e['UpdatedAt'] || e['Tanggal'] || e['Tanggal Laporan'])) || '';
28839:     const d=new Date(raw);
28840:     return Number.isFinite(d.getTime()) ? d.getTime() : 0;
28841:   }
28842: 
28843:   function v4FmtDate(ms){
28844:     if(!ms) return '-';
28845:     try{return new Date(ms).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});}catch(e){return new Date(ms).toLocaleString();}
28846:   }
28847: 
28848:   function v4Escape(value){
28849:     if(typeof escapeHtml === 'function') return escapeHtml(String(value==null?'':value));
28850:     return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
28851:   }
28852: 
28853:   function v4Describe(e){
28854:     if(!e) return '-';
28855:     return String(
28856:       e['Deskripsi Pekerjaan'] || e['Deskripsi'] || e['Masalah'] ||
28857:       e['Keterangan'] || e['Jenis Pekerjaan'] || 'Catatan maintenance'
28858:     ).trim();
28859:   }
28860: 
28861:   function v4TodayKey(){
~~~

## Bantuan
### Around line 5914
~~~text
05902:         <div class="copilot-ctx" id="copilot-ctx">Internal terlebih dahulu · seluruh data aplikasi yang tersedia</div>
05903:       </div>
05904:       <button class="modal-close" id="copilot-close" type="button" aria-label="Tutup Copilot">✕</button>
05905:     </div>
05906:     <div id="copilot-body" class="copilot-body" aria-live="polite">
05907:       <div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Untuk pertanyaan mesin, AI Internal mencari lintas seluruh database aplikasi, bukan hanya halaman yang sedang dibuka.</div>
05908:     </div>
05909:     <div class="copilot-composer">
05910:       <textarea id="copilot-question" placeholder="Tanyakan sesuatu tentang data/aplikasi OMODOS..." aria-label="Pertanyaan Copilot"></textarea>
05911:       <div class="copilot-actions">
05912:         <button class="btn btn-primary btn-sm" type="button" id="copilot-ask-internal"><i class="ph-bold ph-magnifying-glass"></i> Tanya Internal</button>
05913:         <button class="btn btn-sm" type="button" id="copilot-ask-external" disabled><i class="ph-bold ph-sparkle"></i> AI External</button>
05914:         <button class="btn btn-sm" type="button" id="copilot-help" title="Buka bantuan untuk halaman yang sedang digunakan"><i class="ph-bold ph-question"></i> Bantuan</button>
05915:         <button class="btn btn-sm btn-ghost" type="button" id="copilot-clear-data" title="Bersihkan percakapan dan konteks pencarian Copilot; tidak menghapus database aplikasi"><i class="ph-bold ph-broom"></i> Bersihkan Data</button>
05916:       </div>
05917:       <div class="copilot-footnote">AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.</div>
05918:     </div>
05919:   </div>
05920: </div>
05921: 
05922: <script>
05923: 
05924: /* =========================================================
05925:    GLOBAL ERROR POPUP
05926:    =========================================================
05927:    Tujuan: setiap kali ada error saat pengguna mengklik tombol APAPUN di
05928:    seluruh aplikasi, muncul popup berisi keterangan errornya — bukan cuma
05929:    diam/gagal senyap. Diletakkan paling awal di <script> supaya monkeypatch
05930:    addEventListener di bawah ini aktif SEBELUM listener tombol lain di
05931:    kode ini didaftarkan (termasuk tombol yang dirender dinamis belakangan).
05932: 
05933:    Ada 3 lapis penangkapan supaya cakupannya menyeluruh:
05934:    1) Monkeypatch EventTarget.addEventListener khusus event 'click':
05935:       setiap click-handler dibungkus try/catch (untuk error sinkron) dan
05936:       .catch() (untuk handler async/Promise) tanpa perlu mengubah satu per
05937:       satu handler tombol yang sudah ada di seluruh aplikasi.
05938:    2) window 'error' — jaring pengaman untuk error runtime lain yang lolos
05939:       (mis. dipicu dari onclick inline atau kode di luar addEventListener).
05940:    3) window 'unhandledrejection' — menangkap Promise/async yang reject
05941:       tanpa .catch (mis. pola `apiPost(...).then(...)` tanpa `.catch`). */
05942: (function(){
05943:   function extractErrorInfo(err){
05944:     if(err instanceof Error){
05945:       return { message: err.message || 'Terjadi kesalahan.', detail: err.stack || String(err) };
05946:     }
05947:     if(typeof err === 'string'){
05948:       return { message: err, detail: err };
05949:     }
05950:     try{
05951:       return { message: (err && err.message) || 'Terjadi kesalahan yang tidak diketahui.', detail: JSON.stringify(err, null, 2) };
05952:     }catch(e){
05953:       return { message: 'Terjadi kesalahan yang tidak diketahui.', detail: String(err) };
05954:     }
05955:   }
05956: 
05957:   function showAppErrorPopup(err, context){
05958:     const info = extractErrorInfo(err);
05959:     console.error('[App Error]' + (context ? ' [' + context + ']' : ''), err);
05960:     const bg = document.getElementById('app-error-modal-bg');
05961:     if(!bg){ return; } // markup belum siap (mis. error terjadi sebelum DOM termuat)
05962:     const msgEl = document.getElementById('app-error-modal-message');
05963:     const detailEl = document.getElementById('app-error-modal-detail');
05964:     if(msgEl) msgEl.textContent = info.message + (context ? '  (pada: ' + context + ')' : '');
05965:     if(detailEl) detailEl.textContent = info.detail;
05966:     bg.classList.add('active');
05967:   }
05968:   // Expose global supaya bisa dipanggil manual dari bagian kode lain kalau perlu
05969:   // (mis. dari blok catch yang sudah ada) tanpa perlu menduplikasi UI modal.
05970:   window.showAppErrorPopup = showAppErrorPopup;
05971: 
05972:   function wireModalButtons(){
05973:     const bg = document.getElementById('app-error-modal-bg');
05974:     const closeBtn = document.getElementById('app-error-modal-close');
05975:     const okBtn = document.getElementById('app-error-modal-ok');
05976:     const copyBtn = document.getElementById('app-error-modal-copy');
05977:     const detailEl = document.getElementById('app-error-modal-detail');
05978:     if(!bg) return;
~~~

### Around line 12213
~~~text
12201:   a.href = url;
12202:   a.download = `RCA_${String(machineName).replace(/[^a-z0-9]+/gi,'_')}_${new Date().toISOString().slice(0,10)}.doc`;
12203:   document.body.appendChild(a); a.click(); document.body.removeChild(a);
12204:   setTimeout(()=> URL.revokeObjectURL(url), 4000);
12205: }
12206: 
12207: /* =========================================================
12208:    INPUT REPORT (kategori: IPAL, RCA, dll)
12209:    ========================================================= */
12210: const REPORT_CATEGORIES = [
12211:   { key:'ipal',           icon:'💧', title:'Laporan IPAL', sub:'Catat pemeriksaan dan bahan kimia pengolahan air limbah.', enabled:true },
12212:   { key:'rca',            icon:'▦',  title:'RCA', sub:'Cari akar penyebab masalah dan catat tindakan perbaikan.', enabled:true },
12213:   { key:'ai',             icon:'✦',  title:'Analisa AI', sub:'Minta bantuan AI membaca data dan memberi saran. Tetap periksa hasilnya.', enabled:true },
12214:   { key:'report-hub',     icon:'🗂', title:'Riwayat Laporan', sub:'Lihat laporan yang sudah pernah disimpan.', enabled:true },
12215: ];
12216: let IPAL_CURRENT = null; // draft object sedang diedit
12217: 
12218: function renderReportView(){
12219:   $('#btn-report-back-cat').style.display = 'none';
12220:   $('#ipal-form-wrap').style.display = 'none';
12221:   $('#ipal-form-wrap').innerHTML = '';
12222:   const grid = $('#report-cat-grid');
12223:   grid.style.display = 'grid';
12224:   grid.innerHTML = REPORT_CATEGORIES.map(c => `
12225:     <div class="report-cat-card" data-cat="${c.key}">
12226:       <div class="report-cat-icon">${c.icon}</div>
12227:       <div class="report-cat-title">${escapeHtml(c.title)}${c.key==='report-hub' ? ' <span class="count" id="cnt-report-hub">0</span>' : ''}</div>
12228:       <div class="report-cat-sub">${escapeHtml(c.sub)}</div>
12229:     </div>
12230:   `).join('');
12231:   $$('.report-cat-card[data-cat]').forEach(card=>{
12232:     card.addEventListener('click', ()=>{
12233:       const key = card.dataset.cat;
12234:       const cat = REPORT_CATEGORIES.find(c=>c.key===key);
12235:       if(!cat || !cat.enabled) return;
12236:       if(key === 'rca'){ goToView('rca'); return; }
12237:       if(key === 'ipal'){ openIpalCategory(); return; }
12238:       if(key === 'ai'){ goToView('ai'); return; }
12239:       if(key === 'report-hub'){ goToView('report-hub'); return; }
12240:     });
12241:   });
12242: }
12243: 
12244: $('#btn-report-back-cat').addEventListener('click', ()=>{
12245:   $('#report-cat-grid').style.display = 'grid';
12246:   $('#ipal-form-wrap').style.display = 'none';
12247:   $('#btn-report-back-cat').style.display = 'none';
12248: });
12249: 
12250: function openIpalCategory(){
12251:   $('#report-cat-grid').style.display = 'none';
12252:   $('#btn-report-back-cat').style.display = '';
12253:   renderIpalLanding();
12254: }
12255: 
12256: function loadIpalReportsLocal(){
12257:   try{ return JSON.parse(localStorage.getItem(LS_IPAL_KEY) || '[]'); }
12258:   catch(e){ return []; }
12259: }
12260: function saveIpalReportsLocal(list){
12261:   localStorage.setItem(LS_IPAL_KEY, JSON.stringify(list));
12262: }
12263: // Kompatibilitas nama lama
12264: function loadIpalReports(){ return loadIpalReportsLocal(); }
12265: function saveIpalReports(list){ saveIpalReportsLocal(list); }
12266: 
12267: async function syncIpalReportsFromBackend(){
12268:   if(!WEB_APP_URL) return loadIpalReportsLocal();
12269:   try{
12270:     const remote = await apiGet('ipalReports');
12271:     if(Array.isArray(remote)){
12272:       const normalized = remote.map(r=>({
12273:         id: r.id || r.ID,
12274:         pelapor: r.pelapor || r.Pelapor || '',
12275:         bulan: r.bulan || r.Bulan || '',
12276:         outletLabel: r.outletLabel || r.OutletLabel || '',
12277:         daily: typeof r.daily === 'string' ? JSON.parse(r.daily || '{}') : (r.daily || (typeof r.DailyJSON === 'string' ? JSON.parse(r.DailyJSON||'{}') : {})),
~~~

### Around line 23288
~~~text
23276:       'Daily Collection dipakai untuk proses pengambilan dan pencatatan ke SAP.'
23277:     ]},
23278:     setting:{title:'Master Koneksi',steps:[
23279:       'User Management digunakan untuk memantau pengguna dan aktivitas.',
23280:       'Role Access Management digunakan untuk mengatur akses fitur per role.',
23281:       'Perubahan akses sebaiknya diuji dengan role terkait setelah disimpan.'
23282:     ]},
23283:     omodos4:{title:'OMODOS 4.0 Command Center',steps:[
23284:       'Halaman ini khusus Superadmin dan membaca data existing tanpa input ganda.',
23285:       'Gunakan ringkasan Things to Look At, What Changed?, dan Latest Intelligence untuk prioritas pengecekan.'
23286:     ]}
23287:   };
23288:   return helpMap[view] || {title:'Bantuan Halaman',steps:[
23289:     'Gunakan menu dan filter yang tersedia pada halaman ini.',
23290:     'Bila ada data yang tidak sesuai, sebutkan nama halaman, mesin, atau record pada Tanya Internal agar Copilot membatasi konteks pencarian.',
23291:     'Tombol Bersihkan Data hanya membersihkan percakapan/konteks Copilot dan tidak menghapus database.'
23292:   ]};
23293: }
23294: function copilotShowHelp_(){
23295:   const body=$('#copilot-body'); if(!body) return;
23296:   const view=copilotActiveView_();
23297:   const help=copilotHelpForView_(view);
23298:   const items=(help.steps||[]).map((step,i)=>`
23299:     <div class="copilot-data-record">
23300:       <div class="copilot-record-top">
23301:         <span class="copilot-record-index">${i+1}</span>
23302:         <div class="copilot-record-title">${escapeHtml(step)}</div>
23303:       </div>
23304:     </div>`).join('');
23305:   body.insertAdjacentHTML('beforeend',`
23306:     <div class="copilot-msg internal" data-copilot-help-card>
23307:       <div class="copilot-bubble">
23308:         <div class="copilot-answer-head">Bantuan · ${escapeHtml(help.title)}</div>
23309:         <div class="copilot-category-card cat-default">
23310:           <div class="copilot-category-head">
23311:             <div class="copilot-category-title"><span class="copilot-category-icon">❓</span><div>${escapeHtml(help.title)}<small>Panduan singkat sesuai halaman yang sedang dibuka</small></div></div>
23312:           </div>
23313:           <div class="copilot-list">${items}</div>
23314:         </div>
23315:       </div>
23316:     </div>`);
23317:   body.scrollTop=body.scrollHeight;
23318: }
23319: 
23320: function copilotClearData_(){
23321:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23322:   const q=$('#copilot-question'); if(q) q.value='';
23323:   const body=$('#copilot-body');
23324:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23325:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23326:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23327: }
23328: 
23329: $('#copilot-fab').addEventListener('click',openCopilot);
23330: $('#copilot-close').addEventListener('click',closeCopilot);
23331: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23332: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23333: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23334: $('#copilot-help')?.addEventListener('click',copilotShowHelp_);
23335: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23336: $('#copilot-question').addEventListener('keydown',ev=>{
23337:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23338: });
23339: 
23340: /* =========================================================
23341:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23342:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23343:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23344:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23345:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23346:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23347:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23348:    ========================================================= */
23349: 
23350: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23351: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23352: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
~~~

### Around line 23308
~~~text
23296:   const view=copilotActiveView_();
23297:   const help=copilotHelpForView_(view);
23298:   const items=(help.steps||[]).map((step,i)=>`
23299:     <div class="copilot-data-record">
23300:       <div class="copilot-record-top">
23301:         <span class="copilot-record-index">${i+1}</span>
23302:         <div class="copilot-record-title">${escapeHtml(step)}</div>
23303:       </div>
23304:     </div>`).join('');
23305:   body.insertAdjacentHTML('beforeend',`
23306:     <div class="copilot-msg internal" data-copilot-help-card>
23307:       <div class="copilot-bubble">
23308:         <div class="copilot-answer-head">Bantuan · ${escapeHtml(help.title)}</div>
23309:         <div class="copilot-category-card cat-default">
23310:           <div class="copilot-category-head">
23311:             <div class="copilot-category-title"><span class="copilot-category-icon">❓</span><div>${escapeHtml(help.title)}<small>Panduan singkat sesuai halaman yang sedang dibuka</small></div></div>
23312:           </div>
23313:           <div class="copilot-list">${items}</div>
23314:         </div>
23315:       </div>
23316:     </div>`);
23317:   body.scrollTop=body.scrollHeight;
23318: }
23319: 
23320: function copilotClearData_(){
23321:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23322:   const q=$('#copilot-question'); if(q) q.value='';
23323:   const body=$('#copilot-body');
23324:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23325:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23326:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23327: }
23328: 
23329: $('#copilot-fab').addEventListener('click',openCopilot);
23330: $('#copilot-close').addEventListener('click',closeCopilot);
23331: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23332: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23333: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23334: $('#copilot-help')?.addEventListener('click',copilotShowHelp_);
23335: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23336: $('#copilot-question').addEventListener('keydown',ev=>{
23337:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23338: });
23339: 
23340: /* =========================================================
23341:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23342:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23343:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23344:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23345:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23346:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23347:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23348:    ========================================================= */
23349: 
23350: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23351: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23352: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23353: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23354: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23355: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23356: const PI_TECH_DATA = [];
23357: 
23358: // ---- Katalog 10 aspek Soft Skill Assessment ----
23359: const PI_SOFTSKILL_ITEMS = [
23360:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23361:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23362:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23363: ];
23364: 
23365: 
23366: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23367: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23368: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23369: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23370: const PI_DISC_MAP = {
23371:   'Disiplin': 'C',
23372:   'Integritas': 'C',
~~~

### Around line 24513
~~~text
24501:         </div>
24502:       </div>
24503:     </div>
24504:     <div class="pi-profile-section">
24505:       <h4><i class="ph-bold ph-sparkle"></i> Smart Resume (Ringkasan Otomatis)</h4>
24506:       <p style="line-height:1.6;">${narrative}</p>
24507:     </div>
24508:     <div class="pi-profile-section">
24509:       <h4><i class="ph-bold ph-lightbulb"></i> Rekomendasi</h4>
24510:       <ul style="margin:0;padding-left:18px;line-height:1.7;">
24511:         ${rec.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}
24512:       </ul>
24513:       <div class="sub" style="margin-top:10px;">Rekomendasi dihasilkan 100% lokal dari data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item yang sudah tersimpan di aplikasi ini (tanpa API/LLM eksternal) — gunakan sebagai bantuan pengambilan keputusan, tetap verifikasi di lapangan.</div>
24514:     </div>
24515:   `;
24516:   $('#modal-bg').classList.add('active');
24517:   $('#btn-close-modal').addEventListener('click', closeModal);
24518: }
24519: 
24520: 
24521: function generatePiAiRecommendation(nama, tech, techScore, softScore, itemAvgs){
24522:   const belum = piBelumKompetenList(tech);
24523:   const softEntries = Object.entries(itemAvgs).filter(([,v])=>v!=null);
24524:   const weakSoft = softEntries.filter(([,v])=>v<=3).sort((a,b)=>a[1]-b[1]).map(([k])=>k);
24525:   const strongSoft = softEntries.filter(([,v])=>v>=4).map(([k])=>k);
24526: 
24527:   const strengths = [];
24528:   if(techScore!=null && techScore>=80) strengths.push('Kompetensi teknis kuat (' + techScore + '% unit kompetensi kompeten).');
24529:   if(strongSoft.length) strengths.push('Soft skill unggul pada: ' + strongSoft.join(', ') + '.');
24530:   if(!strengths.length) strengths.push('Belum cukup data untuk menyimpulkan kekuatan utama.');
24531: 
24532:   const gapSummary = [];
24533:   if(belum.length) gapSummary.push('Unit kompetensi teknis yang belum dikuasai: ' + belum.join('; ') + '.');
24534:   if(weakSoft.length) gapSummary.push('Aspek soft skill dengan skor rendah (≤3): ' + weakSoft.join(', ') + '.');
24535:   if(!belum.length && !weakSoft.length) gapSummary.push('Tidak ditemukan gap signifikan berdasarkan data yang tersedia.');
24536: 
24537:   const priorities = [];
24538:   belum.slice(0,3).forEach(b=>priorities.push('Teknis: ' + b));
24539:   weakSoft.slice(0,3).forEach(s=>priorities.push('Soft Skill: ' + s));
24540:   if(!priorities.length) priorities.push('Pertahankan performa saat ini, arahkan ke pengembangan lanjutan (stretch assignment).');
24541: 
24542:   const dev = [];
24543:   if(tech && tech.selfLearning && tech.selfLearning!=='-') dev.push('Self-Learning/Training (teknis): ' + tech.selfLearning.replace(/\n/g,' '));
24544:   if(tech && tech.mentoring && tech.mentoring!=='-') dev.push('Mentoring (teknis): ' + tech.mentoring.replace(/\n/g,' '));
24545:   if(tech && tech.coaching && tech.coaching!=='-') dev.push('Coaching (teknis): ' + tech.coaching.replace(/\n/g,' '));
24546:   if(weakSoft.length) dev.push('Coaching soft skill difokuskan pada: ' + weakSoft.join(', ') + ', melalui bimbingan langsung supervisor dan on-the-job feedback berkala.');
24547:   if(!dev.length) dev.push('Tidak ada rekomendasi pengembangan spesifik dari data saat ini.');
24548: 
24549:   return { gapSummary, strengths, priorities, dev };
24550: }
24551: 
24552: 
24553: function piRadarChart(canvasId, labels, values, datasetLabel, maxVal){
24554:   const safeLabels = Array.isArray(labels) ? labels : [];
24555:   const safeValues = Array.isArray(values) ? values : [];
24556:   if(!safeLabels.length || !safeValues.length){
24557:     piDestroyChart('radar_'+canvasId);
24558:     const canvas = document.getElementById(canvasId);
24559:     if(canvas){
24560:       const wrap = canvas.parentElement;
24561:       if(wrap) wrap.innerHTML = '<div class="wiki-empty">Belum ada data untuk ditampilkan.</div>';
24562:     }
24563:     return;
24564:   }
24565:   piRadarMulti(canvasId, safeLabels, safeValues, datasetLabel || 'Score', maxVal || 5);
24566: }
24567: 
24568: function openEmployeeProfile(nama){
24569:   const tech = piFindTech(nama);
24570:   const techScore = piTechScore(tech);
24571:   const softScore = piSoftskillLatestScore(nama);
24572:   const itemAvgs = piSoftskillItemAverages(nama);
24573:   const hist = piSoftskillHistory(nama);
24574:   const belum = piBelumKompetenList(tech);
24575:   const hardItems = piHardSkillFullItems(nama);
24576:   const hardRadar = piHardSkillRadarData(nama);
24577:   const photo = piPhotoUrl(nama);
~~~

### Around line 28561
~~~text
28549: .legacy-simple-glossary-grid span{display:block;margin-top:2px;font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28550: .legacy-simple-helper{font:500 11.5px/1.45 var(--font-body,system-ui);color:var(--text-dim,#586579)}
28551: body.low-cognitive .legacy-simple-guide{padding:16px 18px}
28552: body.low-cognitive .legacy-simple-guide-title{font-size:19px}
28553: body.low-cognitive .legacy-simple-guide-purpose,body.low-cognitive .legacy-simple-step{font-size:14px}
28554: @media(max-width:760px){.legacy-simple-guide-steps,.legacy-simple-glossary-grid{grid-template-columns:1fr}.legacy-simple-guide{margin:8px 0 12px;padding:12px}.legacy-simple-step{min-height:44px}}
28555: /* Readability floor for legacy micro-labels that were previously 7.5–9.5px. */
28556: .bottom-nav-btn{font-size:10.5px!important;min-height:44px}
28557: .copilot-summary-label,.copilot-category-title small,.copilot-count-badge,.copilot-record-index,.copilot-scope-lock small,
28558: .copilot-kv-key,.copilot-external-kv span,.mtl-src-badge,.dash-card .dc-kode,.pmc-gantt-bar,
28559: .rbac-feature-key,.btn-why-remove{font-size:10.5px!important;line-height:1.35!important}
28560: table.omodos-responsive-table>tbody>tr>td::before,#sparepart-lokasi-table td::before{font-size:10.5px!important;line-height:1.35!important}
28561: /* BANTUAN_PAGE_CARD_REMOVAL_V1 */
28562: .legacy-simple-guide{display:none!important}
28563: </style>
28564: <script id="legacy-low-cognitive-script">
28565: (function(){
28566:   const VIEW_GUIDES=Object.freeze({
28567:     dashboard:['Beranda','Lihat keadaan aplikasi secara singkat.','Baca kartu yang paling penting.','Tekan menu untuk membuka pekerjaan yang ingin dilakukan.'],
28568:     input:['Catat pekerjaan','Tulis pekerjaan maintenance yang baru dilakukan.','Pilih mesin lalu isi masalah atau pekerjaan.','Periksa isian, lalu simpan Logbook.'],
28569:     report:['Buat laporan','Pilih jenis laporan yang ingin dibuat.','Pilih kategori laporan.','Isi data lalu tekan tombol simpan.'],
28570:     'report-hub':['Laporan tersimpan','Cari laporan yang sudah pernah dibuat.','Pilih jenis laporan.','Buka laporan untuk membaca atau mengubahnya.'],
28571:     'project-report':['Laporan proyek','Catat tujuan, jadwal, hasil, dan perkembangan proyek.','Isi data utama proyek.','Tambahkan milestone bila perlu, lalu simpan.'],
28572:     'project-center':['Proyek dan perbaikan','Lihat Factory Project, Kaizen, dan SGA di satu tempat.','Pilih jenis proyek yang ingin dilihat.','Tekan proyek untuk membuka detail atau perkembangan.'],
28573:     'people-hub':['Orang dan rapat','Buka data personel, kemampuan, atau rapat.','Pilih kartu yang sesuai kebutuhan.','Buka detail untuk melihat data lengkap.'],
28574:     meeting:['Rapat','Catat jadwal, hasil rapat, keputusan, dan tugas.','Buat atau pilih rapat.','Isi keputusan dan tugas, lalu simpan.'],
28575:     patrol:['Pemeriksaan harian','Periksa kondisi mesin langkah demi langkah.','Pilih mesin dan ikuti daftar pemeriksaan.','Catat temuan lalu simpan Patrol.'],
28576:     downtime:['Waktu berhenti mesin','Baca file downtime Elektrikal dan Mekanikal lalu buat ringkasan.','Pilih file Excel dan jalankan analisa.','Periksa hasil sebelum menyimpan atau mengunduh.'],
28577:     utama:['Lihat Logbook','Lihat seluruh catatan pekerjaan dari yang paling baru.','Gunakan pencarian atau filter bila datanya banyak.','Tekan catatan untuk melihat detail.'],
28578:     mesin:['Logbook per mesin','Lihat catatan hanya untuk mesin yang dipilih.','Pilih mesin dari daftar.','Baca catatan terbaru atau buka detailnya.'],
28579:     tanggal:['Logbook per tanggal','Cari pekerjaan berdasarkan tanggal.','Pilih tanggal atau rentang waktu.','Buka catatan yang ingin dibaca.'],
28580:     pelapor:['Logbook per pelapor','Cari catatan berdasarkan orang yang membuat laporan.','Pilih nama pelapor.','Buka catatan yang ingin dibaca.'],
28581:     group:['Logbook per grup','Cari catatan berdasarkan grup kerja.','Pilih grup.','Buka catatan yang ingin dibaca.'],
28582:     'insights-hub':['Analisis dan pengetahuan','Pilih alat bantu untuk memahami masalah maintenance.','Pilih analisis, panduan penyebab, atau pengetahuan.','Baca bukti sebelum mengambil keputusan.'],
28583:     durasi:['Durasi pekerjaan','Lihat pekerjaan yang memakan waktu paling lama.','Pilih rentang data.','Baca daftar pekerjaan dan durasinya.'],
28584:     analitik:['Ringkasan analisis','Lihat MTTR, MTBF, downtime, dan pola masalah.','Pilih rentang atau mesin bila tersedia.','Mulai dari angka yang paling perlu perhatian.'],
28585:     'kpi-department':['Target kerja departemen','Lihat target dan hasil kerja departemen.','Pilih periode yang ingin dilihat.','Bandingkan target dengan hasil yang tercatat.'],
28586:     'kpi-input':['Isi target kerja','Masukkan atau perbarui data KPI dan kertas kerja.','Isi periode dan nilai yang benar.','Simpan lalu periksa kembali hasilnya.'],
28587:     'machine-breakdown':['Riwayat kerusakan mesin','Catat dan lihat jumlah kerusakan mesin per bulan atau tahun.','Pilih tambah atau ubah data.','Isi nilai lalu simpan.'],
28588:     'record-ytd':['Riwayat mesin tahunan','Lihat data mesin dari tahun ke tahun.','Pilih atau tambahkan data tahun.','Periksa nilainya lalu simpan.'],
28589:     'run-hour-comparison':['Bandingkan jam operasi','Bandingkan jam operasi mesin antarperiode.','Pilih atau tambahkan data.','Baca perbedaannya lalu simpan bila ada perubahan.'],
28590:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28591:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28592:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28593:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28594:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28595:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28596:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28597:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28598:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28599:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28600:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28601:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28602:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28603:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28604:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28605:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28606:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28607:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
28608:     'pi-softskill':['Penilaian perilaku','Lihat penilaian kemampuan perilaku personel.','Pilih personel atau periode.','Baca hasil sebagai bahan pengembangan.'],
28609:     'pi-hardskill':['Penilaian teknis','Lihat kemampuan teknis yang sudah dinilai.','Pilih personel atau unit kompetensi.','Baca bagian yang sudah mampu dan yang masih perlu belajar.']
28610:   });
28611: 
28612:   const VIEW_NAMES=Object.freeze({
28613:     dashboard:'Beranda',input:'Catat Logbook',utama:'Lihat Logbook','project-center':'Proyek & Perbaikan',
28614:     patrol:'Pemeriksaan Harian',sparepart:'Suku Cadang','corrective-report':'Laporan Perbaikan',report:'Buat Laporan',
28615:     'energy-utility':'Energi & Air','insights-hub':'Analisis & Pengetahuan','kpi-department':'Target Kerja Departemen',
28616:     'kpi-input':'Isi Target Kerja','machine-breakdown':'Riwayat Kerusakan Mesin','record-ytd':'Riwayat Mesin Tahunan',
28617:     'run-hour-comparison':'Bandingkan Jam Operasi','energy-cost-toe':'Biaya Energi','people-hub':'Orang & Rapat',
28618:     database:'Data Mesin',tema:'Tampilan Aplikasi',setting:'Pengaturan Utama'
28619:   });
28620: 
28621:   const GROUP_NAMES=Object.freeze({
28622:     report:'Laporan & Pekerjaan Lapangan',wtp:'Pengolahan Air',energy:'Energi & Utilitas',
28623:     kpidept:'Target Kerja Departemen',pengaturan:'Pengaturan'
28624:   });
28625: 
~~~

### Around line 28602
~~~text
28590:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28591:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28592:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28593:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28594:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28595:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28596:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28597:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28598:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28599:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28600:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28601:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28602:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28603:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28604:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28605:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28606:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28607:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
28608:     'pi-softskill':['Penilaian perilaku','Lihat penilaian kemampuan perilaku personel.','Pilih personel atau periode.','Baca hasil sebagai bahan pengembangan.'],
28609:     'pi-hardskill':['Penilaian teknis','Lihat kemampuan teknis yang sudah dinilai.','Pilih personel atau unit kompetensi.','Baca bagian yang sudah mampu dan yang masih perlu belajar.']
28610:   });
28611: 
28612:   const VIEW_NAMES=Object.freeze({
28613:     dashboard:'Beranda',input:'Catat Logbook',utama:'Lihat Logbook','project-center':'Proyek & Perbaikan',
28614:     patrol:'Pemeriksaan Harian',sparepart:'Suku Cadang','corrective-report':'Laporan Perbaikan',report:'Buat Laporan',
28615:     'energy-utility':'Energi & Air','insights-hub':'Analisis & Pengetahuan','kpi-department':'Target Kerja Departemen',
28616:     'kpi-input':'Isi Target Kerja','machine-breakdown':'Riwayat Kerusakan Mesin','record-ytd':'Riwayat Mesin Tahunan',
28617:     'run-hour-comparison':'Bandingkan Jam Operasi','energy-cost-toe':'Biaya Energi','people-hub':'Orang & Rapat',
28618:     database:'Data Mesin',tema:'Tampilan Aplikasi',setting:'Pengaturan Utama'
28619:   });
28620: 
28621:   const GROUP_NAMES=Object.freeze({
28622:     report:'Laporan & Pekerjaan Lapangan',wtp:'Pengolahan Air',energy:'Energi & Utilitas',
28623:     kpidept:'Target Kerja Departemen',pengaturan:'Pengaturan'
28624:   });
28625: 
28626:   const SIMPLE_TEXT=Object.freeze({
28627:     'Home':'Beranda','Project Center':'Pusat Proyek','Corrective Report':'Laporan Perbaikan',
28628:     'Dashboard KPI Department':'Target Kerja Departemen','Breakdown Mesin (MTD/YTD)':'Riwayat Kerusakan Mesin',
28629:     'Database Mesin':'Data Mesin','Reports & Field Work':'Laporan & Pekerjaan Lapangan','Water Treatment Plant':'Pengolahan Air',
28630:     'Energy & Utility':'Energi & Utilitas','Insights':'Analisis & Pengetahuan','KPI Department':'Target Kerja Departemen',
28631:     'People & Meetings':'Orang & Rapat','Input Report':'Buat Laporan','Dashboard & Analytics':'Ringkasan & Grafik',
28632:     'Factory Project':'Proyek Pabrik','Filter':'Saring Data','Tambah Project':'Tambah Proyek',
28633:     'PI Dashboard':'Ringkasan Kemampuan','Personnel':'Data Personel','Meeting Management':'Kelola Rapat',
28634:     'Meeting Analytics':'Ringkasan Rapat','Meeting Baru':'Buat Rapat','Open':'Belum Selesai',
28635:     'Download Excel Hasil Analisa':'Unduh Hasil Excel','Download Excel Resume':'Unduh Ringkasan Excel',
28636:     'Refresh':'Muat Ulang','Dashboard Analitik':'Ringkasan Analisis','Correlation Analysis':'Cari Hubungan Data',
28637:     'Diagnostic Wizard':'Panduan Cari Penyebab','Knowledge Base':'Pusat Pengetahuan',
28638:     'Knowledge Center':'Pusat Pengetahuan','Expert Finder':'Cari Teknisi Berpengalaman',
28639:     'Knowledge Graph':'Peta Hubungan Pengetahuan','Import Excel':'Ambil dari Excel',
28640:     'Import Excel (Upload File)':'Ambil dari File Excel','Tambah / Update Data':'Tambah / Ubah Data',
28641:     'Export Excel':'Unduh Excel','Export PDF':'Unduh PDF','Export Word':'Unduh Word',
28642:     'Reset':'Atur Ulang','Reset Konteks':'Kosongkan Pilihan','Reset Tampilan':'Atur Ulang Tampilan',
28643:     'User Management':'Kelola Pengguna','Role Access':'Hak Akses','Template Patrol':'Daftar Pemeriksaan Patrol',
28644:     'Tambah User':'Tambah Pengguna','Simpan Role Access':'Simpan Hak Akses','Edit':'Ubah','Batal Edit':'Batal Mengubah',
28645:     'Simpan Report RCA':'Simpan Laporan RCA','Buat Report IPAL Baru':'Buat Laporan IPAL Baru','Simpan Report':'Simpan Laporan',
28646:     'Import Semua Baris':'Ambil Semua Baris','Update Progress':'Tambah Perkembangan','Simpan Update':'Simpan Perkembangan',
28647:     'Edit Data':'Ubah Data','Tambah File (lewat Edit Data)':'Tambah File','Tambah Update Progress':'Tambah Perkembangan',
28648:     'Edit Meeting Ini':'Ubah Rapat Ini','Simpan Meeting':'Simpan Rapat','Tambah Action Item':'Tambah Tugas',
28649:     'Soft Skill Assessment':'Penilaian Perilaku','Hard Skill Assessment':'Penilaian Teknis',
28650:     'Smart Recognition & Resume Personil':'Ringkasan Otomatis Personel','Smart Recognition':'Pengenalan Otomatis',
28651:     'Smart Resume (Ringkasan Otomatis)':'Ringkasan Otomatis','Radar Chart — Soft Skill':'Grafik Penilaian Perilaku',
28652:     'Radar Chart — Hard Skill':'Grafik Penilaian Teknis','Hard Skill Detail':'Detail Kemampuan Teknis',
28653:     'Hard Skill Competency — Detail':'Detail Kompetensi Teknis','Soft Skill Summary (Penilaian Terbaru)':'Ringkasan Penilaian Perilaku Terbaru',
28654:     'Generate Report RCA':'Buat Laporan RCA','Sparepart Management':'Kelola Suku Cadang',
28655:     'Auto-Sync Knowledge Base':'Sinkronkan Pengetahuan Otomatis','Scan Ulang':'Periksa Ulang',
28656:     'Card View':'Tampilan Kartu','Table View':'Tampilan Tabel','Status Project':'Status Proyek',
28657:     'Progress per Bulan (rata-rata update)':'Perkembangan Rata-rata per Bulan','Jumlah Project per Jenis':'Jumlah Proyek per Jenis',
28658:     'Laporan Proyek — Project Status Report':'Laporan Status Proyek','Update Action Item':'Ubah Tugas',
28659:     'Analisa Downtime Elektrikal & Mekanikal':'Analisa Waktu Berhenti Elektrikal & Mekanikal',
28660:     'Analisa Downtime E&M':'Analisa Waktu Berhenti E&M','People Intelligence Dashboard':'Ringkasan Kemampuan Personel',
28661:     '+ Simpan KPI':'Simpan Target Kerja','Sinkron Data Aktual KPI Department':'Ambil Data Target Terbaru',
28662:     'Muat Data dari Excel':'Ambil Data Excel','Simpan PO':'Simpan Pesanan','Simpan Hasil Opname':'Simpan Hasil Cek Stok',
28663:     '+ Simpan Data Sparepart':'Simpan Suku Cadang','Impor Data Elektrikal Standar':'Ambil Daftar Pemeriksaan Elektrikal',
28664:     'Impor Data Mekanikal Standar':'Ambil Daftar Pemeriksaan Mekanikal','Simpan Formula':'Simpan Rumus',
28665:     'Impor Data Personil (Packaging Offset Technical)':'Ambil Data Personel Packaging Offset',
28666:     'Simpan Assessment Manual':'Simpan Penilaian Manual','Tanya Internal':'Tanya Data OMODOS','AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.':'AI luar hanya dipakai jika Anda menekan tombolnya. Data yang dikirim dibatasi pada bagian yang berhubungan dengan pertanyaan.',
~~~

## copilot-data-record
### Around line 1260
~~~text
01248: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01249: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01250: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01251: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01252: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01253: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01254: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01255: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01256: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01257: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01258: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
01308: .ci-card.lv-critical{border-left-color:var(--red);}
01309: .ci-card.lv-warning{border-left-color:var(--amber);}
01310: .ci-card.lv-info{border-left-color:#5b9dff;}
01311: .ci-card.lv-good{border-left-color:var(--green);}
01312: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01313: .ci-card.lv-critical .ci-head{color:var(--red);}
01314: .ci-card.lv-warning .ci-head{color:var(--amber);}
01315: .ci-card.lv-info .ci-head{color:#5b9dff;}
01316: .ci-card.lv-good .ci-head{color:var(--green);}
01317: .ci-text{font-size:13px;line-height:1.55;}
01318: .ci-text b{color:var(--text);}
01319: .ci-sub{font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.5;}
01320: 
01321: /* ---------------- ANALITIK & DASHBOARD ---------------- */
01322: .an-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:18px;}
01323: .an-kpi{
01324:   background:linear-gradient(180deg, var(--panel-2), var(--panel));border:1px solid var(--line);
~~~

### Around line 23076
~~~text
23064: }
23065: 
23066: function copilotPrettyFieldName_(key){
23067:   return String(key||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ').replace(/\s+/g,' ').trim();
23068: }
23069: 
23070: function copilotRowCardHtml_(row,sourceName,index){
23071:   const fields=copilotCompactFields_(row);
23072:   const title=copilotRowLabel_(row);
23073:   const fieldHtml=fields.length ? '<div class="copilot-kv-grid">'+fields.map(f=>
23074:     '<div class="copilot-kv"><div class="copilot-kv-key">'+escapeHtml(copilotPrettyFieldName_(f.key))+'</div><div class="copilot-kv-value">'+escapeHtml(f.value)+'</div></div>'
23075:   ).join('')+'</div>' : '<div class="copilot-record-empty">Detail ringkas tidak tersedia.</div>';
23076:   return '<article class="copilot-data-record" data-copilot-source="'+escapeHtml(sourceName||'')+'">'+
23077:     '<div class="copilot-record-top"><span class="copilot-record-index">#'+(index+1)+'</span><div class="copilot-record-title">'+escapeHtml(title)+'</div></div>'+
23078:     fieldHtml+'</article>';
23079: }
23080: 
23081: function copilotExternalAutoCategory_(text){
23082:   const n=copilotNorm_(text);
23083:   if(/bahaya|risiko|safety|keselamatan|warning|peringatan|catatan/.test(n)) return {title:'Risiko & Catatan',icon:'⚠️',tone:'warning'};
23084:   if(/langkah|tindakan|rekomendasi|solusi|perbaikan|action/.test(n)) return {title:'Tindakan & Rekomendasi',icon:'🛠️',tone:'action'};
23085:   if(/sparepart|material|part|komponen|bearing|seal|sensor/.test(n)) return {title:'Komponen / Sparepart',icon:'📦',tone:'sparepart'};
23086:   if(/kpi|mtbf|mttr|downtime|trend|angka|data/.test(n)) return {title:'Data & Analisis',icon:'📊',tone:'kpi'};
23087:   if(/penyebab|diagnos|indikasi|gejala|temuan|root cause/.test(n)) return {title:'Diagnosis & Temuan',icon:'🔎',tone:'diagnosis'};
23088:   return {title:'Ringkasan',icon:'✨',tone:'summary'};
23089: }
23090: 
23091: function copilotNarrativeBodyHtml_(text){
23092:   const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
23093:   const list=[], paragraphs=[], kv=[];
23094:   lines.forEach(line=>{
23095:     const bullet=line.match(/^(?:[-*•]|\d+[.)])\s+(.+)/);
23096:     const pair=!bullet && line.length<240 ? line.match(/^([^:]{2,45}):\s*(.+)$/) : null;
23097:     if(bullet) list.push(bullet[1]);
23098:     else if(pair) kv.push({k:pair[1],v:pair[2]});
23099:     else paragraphs.push(line.replace(/^#{1,6}\s*/,'').replace(/^\*\*(.+)\*\*$/,'$1'));
23100:   });
23101:   let out='';
23102:   if(kv.length) out+='<div class="copilot-external-kv-grid">'+kv.map(x=>'<div class="copilot-external-kv"><span>'+escapeHtml(x.k)+'</span><b>'+escapeHtml(x.v)+'</b></div>').join('')+'</div>';
23103:   if(paragraphs.length) out+=paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('');
23104:   if(list.length) out+='<ul class="copilot-external-list">'+list.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
23105:   return out || '<div class="copilot-record-empty">Tidak ada isi yang dapat ditampilkan.</div>';
23106: }
23107: 
23108: function copilotExternalCardsHtml_(text,data){
23109:   const raw=String(text||'').trim();
23110:   const sections=[];
23111:   const paragraphs=raw ? raw.split(/\n\s*\n+/).map(x=>x.trim()).filter(Boolean) : [];
23112:   paragraphs.forEach(p=>{
23113:     const first=(p.split(/\r?\n/)[0]||'').trim();
23114:     const headingMatch=first.match(/^(?:#{1,6}\s*)?(?:\*\*)?([A-Za-zÀ-ÿ0-9 /&()_-]{3,70})(?:\*\*)?:?$/);
23115:     const looksHeading=headingMatch && p.split(/\r?\n/).length>1 && first.length<72;
23116:     if(looksHeading){
23117:       const title=headingMatch[1].replace(/\*\*/g,'').trim();
23118:       const body=p.split(/\r?\n/).slice(1).join('\n').trim();
23119:       const auto=copilotExternalAutoCategory_(title+' '+body);
23120:       sections.push({title,icon:auto.icon,tone:auto.tone,body:body||title});
23121:     }else{
23122:       const auto=copilotExternalAutoCategory_(p);
23123:       const existing=sections.find(x=>x.title===auto.title);
23124:       if(existing) existing.body += '\n'+p; else sections.push({title:auto.title,icon:auto.icon,tone:auto.tone,body:p});
23125:     }
23126:   });
23127:   if(data && Array.isArray(data.langkahPerbaikan) && data.langkahPerbaikan.length){
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
23135:   return '<div class="copilot-external-card-stack">'+sections.slice(0,10).map(sec=>
23136:     '<section class="copilot-external-card ext-'+sec.tone+'"><div class="copilot-external-head"><span class="copilot-external-icon">'+sec.icon+'</span><span>'+escapeHtml(sec.title)+'</span></div><div class="copilot-external-body">'+copilotNarrativeBodyHtml_(sec.body)+'</div></section>'
23137:   ).join('')+'</div>';
23138: }
23139: 
23140: function copilotInternalAnswer_(question){
~~~

### Around line 23299
~~~text
23287:   };
23288:   return helpMap[view] || {title:'Bantuan Halaman',steps:[
23289:     'Gunakan menu dan filter yang tersedia pada halaman ini.',
23290:     'Bila ada data yang tidak sesuai, sebutkan nama halaman, mesin, atau record pada Tanya Internal agar Copilot membatasi konteks pencarian.',
23291:     'Tombol Bersihkan Data hanya membersihkan percakapan/konteks Copilot dan tidak menghapus database.'
23292:   ]};
23293: }
23294: function copilotShowHelp_(){
23295:   const body=$('#copilot-body'); if(!body) return;
23296:   const view=copilotActiveView_();
23297:   const help=copilotHelpForView_(view);
23298:   const items=(help.steps||[]).map((step,i)=>`
23299:     <div class="copilot-data-record">
23300:       <div class="copilot-record-top">
23301:         <span class="copilot-record-index">${i+1}</span>
23302:         <div class="copilot-record-title">${escapeHtml(step)}</div>
23303:       </div>
23304:     </div>`).join('');
23305:   body.insertAdjacentHTML('beforeend',`
23306:     <div class="copilot-msg internal" data-copilot-help-card>
23307:       <div class="copilot-bubble">
23308:         <div class="copilot-answer-head">Bantuan · ${escapeHtml(help.title)}</div>
23309:         <div class="copilot-category-card cat-default">
23310:           <div class="copilot-category-head">
23311:             <div class="copilot-category-title"><span class="copilot-category-icon">❓</span><div>${escapeHtml(help.title)}<small>Panduan singkat sesuai halaman yang sedang dibuka</small></div></div>
23312:           </div>
23313:           <div class="copilot-list">${items}</div>
23314:         </div>
23315:       </div>
23316:     </div>`);
23317:   body.scrollTop=body.scrollHeight;
23318: }
23319: 
23320: function copilotClearData_(){
23321:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23322:   const q=$('#copilot-question'); if(q) q.value='';
23323:   const body=$('#copilot-body');
23324:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23325:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23326:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23327: }
23328: 
23329: $('#copilot-fab').addEventListener('click',openCopilot);
23330: $('#copilot-close').addEventListener('click',closeCopilot);
23331: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23332: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23333: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23334: $('#copilot-help')?.addEventListener('click',copilotShowHelp_);
23335: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23336: $('#copilot-question').addEventListener('keydown',ev=>{
23337:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23338: });
23339: 
23340: /* =========================================================
23341:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23342:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23343:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23344:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23345:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23346:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23347:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23348:    ========================================================= */
23349: 
23350: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23351: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23352: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23353: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23354: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23355: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23356: const PI_TECH_DATA = [];
23357: 
23358: // ---- Katalog 10 aspek Soft Skill Assessment ----
23359: const PI_SOFTSKILL_ITEMS = [
23360:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23361:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23362:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23363: ];
~~~

## copilot-external-card
### Around line 1250
~~~text
01238: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01239: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01240: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01241: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01242: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01243: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01244: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01245: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01246: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01247: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01248: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01249: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01250: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01251: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01252: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01253: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01254: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01255: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01256: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01257: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01258: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
01308: .ci-card.lv-critical{border-left-color:var(--red);}
01309: .ci-card.lv-warning{border-left-color:var(--amber);}
01310: .ci-card.lv-info{border-left-color:#5b9dff;}
01311: .ci-card.lv-good{border-left-color:var(--green);}
01312: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01313: .ci-card.lv-critical .ci-head{color:var(--red);}
01314: .ci-card.lv-warning .ci-head{color:var(--amber);}
~~~

### Around line 1251
~~~text
01239: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01240: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01241: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01242: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01243: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01244: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01245: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01246: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01247: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01248: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01249: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01250: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01251: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01252: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01253: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01254: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01255: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01256: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01257: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01258: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
01308: .ci-card.lv-critical{border-left-color:var(--red);}
01309: .ci-card.lv-warning{border-left-color:var(--amber);}
01310: .ci-card.lv-info{border-left-color:#5b9dff;}
01311: .ci-card.lv-good{border-left-color:var(--green);}
01312: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01313: .ci-card.lv-critical .ci-head{color:var(--red);}
01314: .ci-card.lv-warning .ci-head{color:var(--amber);}
01315: .ci-card.lv-info .ci-head{color:#5b9dff;}
~~~

### Around line 1271
~~~text
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
01308: .ci-card.lv-critical{border-left-color:var(--red);}
01309: .ci-card.lv-warning{border-left-color:var(--amber);}
01310: .ci-card.lv-info{border-left-color:#5b9dff;}
01311: .ci-card.lv-good{border-left-color:var(--green);}
01312: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01313: .ci-card.lv-critical .ci-head{color:var(--red);}
01314: .ci-card.lv-warning .ci-head{color:var(--amber);}
01315: .ci-card.lv-info .ci-head{color:#5b9dff;}
01316: .ci-card.lv-good .ci-head{color:var(--green);}
01317: .ci-text{font-size:13px;line-height:1.55;}
01318: .ci-text b{color:var(--text);}
01319: .ci-sub{font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.5;}
01320: 
01321: /* ---------------- ANALITIK & DASHBOARD ---------------- */
01322: .an-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:18px;}
01323: .an-kpi{
01324:   background:linear-gradient(180deg, var(--panel-2), var(--panel));border:1px solid var(--line);
01325:   border-radius:12px;padding:16px 18px;position:relative;overflow:hidden;
01326: }
01327: .an-kpi .lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);font-family:var(--font-mono);}
01328: .an-kpi .val{font-family:var(--font-mono);font-size:26px;font-weight:700;margin-top:6px;line-height:1;}
01329: .an-kpi .sub{font-size:11px;color:var(--text-dim);margin-top:6px;}
01330: .an-kpi.k-mttr .val{color:var(--amber);}
01331: .an-kpi.k-mtbf .val{color:var(--blue,#5b9dff);}
01332: .an-kpi.k-downtime .val{color:var(--red);}
01333: .an-kpi.k-avail .val{color:var(--green);}
01334: .an-section-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
01335: @media (max-width:900px){.an-section-grid{grid-template-columns:1fr;}}
~~~

### Around line 1275
~~~text
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
01308: .ci-card.lv-critical{border-left-color:var(--red);}
01309: .ci-card.lv-warning{border-left-color:var(--amber);}
01310: .ci-card.lv-info{border-left-color:#5b9dff;}
01311: .ci-card.lv-good{border-left-color:var(--green);}
01312: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01313: .ci-card.lv-critical .ci-head{color:var(--red);}
01314: .ci-card.lv-warning .ci-head{color:var(--amber);}
01315: .ci-card.lv-info .ci-head{color:#5b9dff;}
01316: .ci-card.lv-good .ci-head{color:var(--green);}
01317: .ci-text{font-size:13px;line-height:1.55;}
01318: .ci-text b{color:var(--text);}
01319: .ci-sub{font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.5;}
01320: 
01321: /* ---------------- ANALITIK & DASHBOARD ---------------- */
01322: .an-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:18px;}
01323: .an-kpi{
01324:   background:linear-gradient(180deg, var(--panel-2), var(--panel));border:1px solid var(--line);
01325:   border-radius:12px;padding:16px 18px;position:relative;overflow:hidden;
01326: }
01327: .an-kpi .lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);font-family:var(--font-mono);}
01328: .an-kpi .val{font-family:var(--font-mono);font-size:26px;font-weight:700;margin-top:6px;line-height:1;}
01329: .an-kpi .sub{font-size:11px;color:var(--text-dim);margin-top:6px;}
01330: .an-kpi.k-mttr .val{color:var(--amber);}
01331: .an-kpi.k-mtbf .val{color:var(--blue,#5b9dff);}
01332: .an-kpi.k-downtime .val{color:var(--red);}
01333: .an-kpi.k-avail .val{color:var(--green);}
01334: .an-section-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;}
01335: @media (max-width:900px){.an-section-grid{grid-template-columns:1fr;}}
01336: .an-card{
01337:   background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-bottom:14px;
01338: }
01339: 
~~~

### Around line 23135
~~~text
23123:       const existing=sections.find(x=>x.title===auto.title);
23124:       if(existing) existing.body += '\n'+p; else sections.push({title:auto.title,icon:auto.icon,tone:auto.tone,body:p});
23125:     }
23126:   });
23127:   if(data && Array.isArray(data.langkahPerbaikan) && data.langkahPerbaikan.length){
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
23135:   return '<div class="copilot-external-card-stack">'+sections.slice(0,10).map(sec=>
23136:     '<section class="copilot-external-card ext-'+sec.tone+'"><div class="copilot-external-head"><span class="copilot-external-icon">'+sec.icon+'</span><span>'+escapeHtml(sec.title)+'</span></div><div class="copilot-external-body">'+copilotNarrativeBodyHtml_(sec.body)+'</div></section>'
23137:   ).join('')+'</div>';
23138: }
23139: 
23140: function copilotInternalAnswer_(question){
23141:   const qn=copilotNorm_(question);
23142:   if(!qn) return {html:'Masukkan pertanyaan terlebih dahulu.',context:[],confidence:'low'};
23143:   if(/fungsi|halaman ini|menu ini|fitur ini/.test(qn)){
23144:     const view=PREVIOUS_ACTIVE_VIEW||'dashboard';
23145:     const info=COPILOT_PAGE_INFO[view];
23146:     if(info){
23147:       const viewName=copilotViewLabel(view);
23148:       const html='<div class="copilot-answer-head">AI Internal · konteks aplikasi</div>'+
23149:         '<div class="copilot-category-stack"><section class="copilot-category-card cat-default">'+
23150:         '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">🧭</span><span>Konteks Halaman</span></div><span class="copilot-count-badge">Aktif</span></div>'+
23151:         '<div class="copilot-category-sub">'+escapeHtml(viewName)+'</div><div class="copilot-page-explain">'+escapeHtml(info)+'</div></section></div>';
23152:       return {html,context:['Halaman aktif: '+viewName+'. '+info],confidence:'high'};
23153:     }
23154:   }
23155:   const machineTargets=copilotResolveMachineTargets_(question);
23156:   const machineIntent=/\b(mesin|machine|workcenter|work center|equipment)\b/.test(qn) || machineTargets.length>0;
23157:   const groups=copilotSearchInternal_(question);
23158:   const wantsCount=/\b(berapa|jumlah|total)\b/.test(qn);
23159:   const context=[];
23160:   if(machineIntent && !machineTargets.length){
23161:     return {html:'<div class="copilot-answer-head">AI Internal · scope mesin</div><div class="copilot-empty-card"><span>⚙️</span><div><b>Mesin yang dimaksud belum dapat dipastikan</b><small>Saya tidak akan menampilkan data mesin lain untuk mengisi kekosongan. Gunakan nama/kode mesin persis seperti di Master Mesin.</small></div></div>',context:[],confidence:'low'};
23162:   }
23163:   if(!groups.length){
23164:     return {html:'<div class="copilot-answer-head">AI Internal</div><div class="copilot-empty-card"><span>🔎</span><div><b>Data relevan belum ditemukan</b><small>Coba gunakan nama mesin, kode material, tanggal, status, atau kategori data yang lebih spesifik. AI External tetap dapat dipakai untuk pengetahuan umum.</small></div></div>',context:[],confidence:'low'};
23165:   }
23166:   const machineQuery=machineIntent;
23167:   const machineScopeLabel=machineTargets.map(t=>t.label).join(', ');
23168:   const visible=groups.slice(0,machineQuery?10:6);
23169:   const top=visible[0];
23170:   const totalHits=visible.reduce((sum,g)=>sum+g.total,0);
23171:   let html='<div class="copilot-answer-head">AI Internal · '+(machineQuery?'pencarian lintas seluruh database':'data aplikasi')+'</div>';
23172:   if(machineScopeLabel) html+='<div class="copilot-scope-lock"><span>🔒</span><div><b>Scope dikunci: '+escapeHtml(machineScopeLabel)+'</b><small>Record tanpa identitas mesin yang cocok persis tidak ditampilkan.</small></div></div>';
23173:   html+='<div class="copilot-answer-summary"><div><span class="copilot-summary-number">'+totalHits.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">kecocokan ditampilkan</span></div><div><span class="copilot-summary-number">'+visible.length+'</span><span class="copilot-summary-label">kategori data</span></div>'+(wantsCount&&top?'<div><span class="copilot-summary-number">'+top.total.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">'+escapeHtml(top.src.name)+'</span></div>':'')+'</div>';
23174:   html+='<div class="copilot-category-stack">';
23175:   visible.forEach(g=>{
23176:     const meta=copilotCategoryMeta_(g.src.name);
23177:     html+='<section class="copilot-category-card cat-'+meta.tone+'">'+
23178:       '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">'+meta.icon+'</span><div><span>'+escapeHtml(meta.label)+'</span><small>'+escapeHtml(g.src.name)+'</small></div></div><span class="copilot-count-badge">'+g.total+' cocok</span></div>'+
23179:       '<div class="copilot-record-list">'+g.matches.slice(0,machineQuery?6:4).map((r,i)=>copilotRowCardHtml_(r,g.src.name,i)).join('')+'</div>'+
23180:       (g.total>g.matches.slice(0,machineQuery?6:4).length?'<div class="copilot-more-note">+'+(g.total-g.matches.slice(0,machineQuery?6:4).length)+' data relevan lain tersedia di kategori ini.</div>':'')+'</section>';
23181:     g.matches.slice(0,machineQuery?6:4).forEach(r=>{ if(context.length<14) context.push('['+g.src.name+'] '+copilotRowText_(r).slice(0,700)); });
23182:   });
23183:   html+='</div>';
23184:   const high=(top.sourceHit && top.total>0) || (top.total>=3);
23185:   if(!high) html+='<div class="copilot-confidence-note">Kecocokan data internal masih terbatas. Gunakan AI External bila memerlukan interpretasi atau referensi tambahan.</div>';
23186:   return {html,context,confidence:high?'high':'medium'};
23187: }
23188: 
23189: function copilotAppendMessage_(type,content,isHtml){
23190:   const body=$('#copilot-body');
23191:   if(!body) return;
23192:   const msg=document.createElement('div'); msg.className=`copilot-msg ${type}`;
23193:   const bubble=document.createElement('div'); bubble.className='copilot-bubble';
23194:   if(isHtml) bubble.innerHTML=content; else bubble.textContent=content;
23195:   msg.appendChild(bubble); body.appendChild(msg); body.scrollTop=body.scrollHeight;
23196:   return msg;
23197: }
23198: function copilotSetThinking_(label){
23199:   const el=copilotAppendMessage_('internal',`<div class="copilot-thinking"><span class="ai-spinner"></span>${escapeHtml(label||'Mencari data internal...')}</div>`,true);
~~~

### Around line 23136
~~~text
23124:       if(existing) existing.body += '\n'+p; else sections.push({title:auto.title,icon:auto.icon,tone:auto.tone,body:p});
23125:     }
23126:   });
23127:   if(data && Array.isArray(data.langkahPerbaikan) && data.langkahPerbaikan.length){
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
23135:   return '<div class="copilot-external-card-stack">'+sections.slice(0,10).map(sec=>
23136:     '<section class="copilot-external-card ext-'+sec.tone+'"><div class="copilot-external-head"><span class="copilot-external-icon">'+sec.icon+'</span><span>'+escapeHtml(sec.title)+'</span></div><div class="copilot-external-body">'+copilotNarrativeBodyHtml_(sec.body)+'</div></section>'
23137:   ).join('')+'</div>';
23138: }
23139: 
23140: function copilotInternalAnswer_(question){
23141:   const qn=copilotNorm_(question);
23142:   if(!qn) return {html:'Masukkan pertanyaan terlebih dahulu.',context:[],confidence:'low'};
23143:   if(/fungsi|halaman ini|menu ini|fitur ini/.test(qn)){
23144:     const view=PREVIOUS_ACTIVE_VIEW||'dashboard';
23145:     const info=COPILOT_PAGE_INFO[view];
23146:     if(info){
23147:       const viewName=copilotViewLabel(view);
23148:       const html='<div class="copilot-answer-head">AI Internal · konteks aplikasi</div>'+
23149:         '<div class="copilot-category-stack"><section class="copilot-category-card cat-default">'+
23150:         '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">🧭</span><span>Konteks Halaman</span></div><span class="copilot-count-badge">Aktif</span></div>'+
23151:         '<div class="copilot-category-sub">'+escapeHtml(viewName)+'</div><div class="copilot-page-explain">'+escapeHtml(info)+'</div></section></div>';
23152:       return {html,context:['Halaman aktif: '+viewName+'. '+info],confidence:'high'};
23153:     }
23154:   }
23155:   const machineTargets=copilotResolveMachineTargets_(question);
23156:   const machineIntent=/\b(mesin|machine|workcenter|work center|equipment)\b/.test(qn) || machineTargets.length>0;
23157:   const groups=copilotSearchInternal_(question);
23158:   const wantsCount=/\b(berapa|jumlah|total)\b/.test(qn);
23159:   const context=[];
23160:   if(machineIntent && !machineTargets.length){
23161:     return {html:'<div class="copilot-answer-head">AI Internal · scope mesin</div><div class="copilot-empty-card"><span>⚙️</span><div><b>Mesin yang dimaksud belum dapat dipastikan</b><small>Saya tidak akan menampilkan data mesin lain untuk mengisi kekosongan. Gunakan nama/kode mesin persis seperti di Master Mesin.</small></div></div>',context:[],confidence:'low'};
23162:   }
23163:   if(!groups.length){
23164:     return {html:'<div class="copilot-answer-head">AI Internal</div><div class="copilot-empty-card"><span>🔎</span><div><b>Data relevan belum ditemukan</b><small>Coba gunakan nama mesin, kode material, tanggal, status, atau kategori data yang lebih spesifik. AI External tetap dapat dipakai untuk pengetahuan umum.</small></div></div>',context:[],confidence:'low'};
23165:   }
23166:   const machineQuery=machineIntent;
23167:   const machineScopeLabel=machineTargets.map(t=>t.label).join(', ');
23168:   const visible=groups.slice(0,machineQuery?10:6);
23169:   const top=visible[0];
23170:   const totalHits=visible.reduce((sum,g)=>sum+g.total,0);
23171:   let html='<div class="copilot-answer-head">AI Internal · '+(machineQuery?'pencarian lintas seluruh database':'data aplikasi')+'</div>';
23172:   if(machineScopeLabel) html+='<div class="copilot-scope-lock"><span>🔒</span><div><b>Scope dikunci: '+escapeHtml(machineScopeLabel)+'</b><small>Record tanpa identitas mesin yang cocok persis tidak ditampilkan.</small></div></div>';
23173:   html+='<div class="copilot-answer-summary"><div><span class="copilot-summary-number">'+totalHits.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">kecocokan ditampilkan</span></div><div><span class="copilot-summary-number">'+visible.length+'</span><span class="copilot-summary-label">kategori data</span></div>'+(wantsCount&&top?'<div><span class="copilot-summary-number">'+top.total.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">'+escapeHtml(top.src.name)+'</span></div>':'')+'</div>';
23174:   html+='<div class="copilot-category-stack">';
23175:   visible.forEach(g=>{
23176:     const meta=copilotCategoryMeta_(g.src.name);
23177:     html+='<section class="copilot-category-card cat-'+meta.tone+'">'+
23178:       '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">'+meta.icon+'</span><div><span>'+escapeHtml(meta.label)+'</span><small>'+escapeHtml(g.src.name)+'</small></div></div><span class="copilot-count-badge">'+g.total+' cocok</span></div>'+
23179:       '<div class="copilot-record-list">'+g.matches.slice(0,machineQuery?6:4).map((r,i)=>copilotRowCardHtml_(r,g.src.name,i)).join('')+'</div>'+
23180:       (g.total>g.matches.slice(0,machineQuery?6:4).length?'<div class="copilot-more-note">+'+(g.total-g.matches.slice(0,machineQuery?6:4).length)+' data relevan lain tersedia di kategori ini.</div>':'')+'</section>';
23181:     g.matches.slice(0,machineQuery?6:4).forEach(r=>{ if(context.length<14) context.push('['+g.src.name+'] '+copilotRowText_(r).slice(0,700)); });
23182:   });
23183:   html+='</div>';
23184:   const high=(top.sourceHit && top.total>0) || (top.total>=3);
23185:   if(!high) html+='<div class="copilot-confidence-note">Kecocokan data internal masih terbatas. Gunakan AI External bila memerlukan interpretasi atau referensi tambahan.</div>';
23186:   return {html,context,confidence:high?'high':'medium'};
23187: }
23188: 
23189: function copilotAppendMessage_(type,content,isHtml){
23190:   const body=$('#copilot-body');
23191:   if(!body) return;
23192:   const msg=document.createElement('div'); msg.className=`copilot-msg ${type}`;
23193:   const bubble=document.createElement('div'); bubble.className='copilot-bubble';
23194:   if(isHtml) bubble.innerHTML=content; else bubble.textContent=content;
23195:   msg.appendChild(bubble); body.appendChild(msg); body.scrollTop=body.scrollHeight;
23196:   return msg;
23197: }
23198: function copilotSetThinking_(label){
23199:   const el=copilotAppendMessage_('internal',`<div class="copilot-thinking"><span class="ai-spinner"></span>${escapeHtml(label||'Mencari data internal...')}</div>`,true);
23200:   if(el) el.dataset.thinking='1'; return el;
~~~

## copilot-result-group
### Around line 1242
~~~text
01230: .copilot-head{display:flex;justify-content:space-between;align-items:flex-start;padding:calc(16px + env(safe-area-inset-top,0px)) 16px 12px;border-bottom:1px solid var(--line);}
01231: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01232: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01233: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01234: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01235: .copilot-msg{display:flex;margin:10px 0;}
01236: .copilot-msg.user{justify-content:flex-end;}
01237: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01238: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01239: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01240: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01241: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01242: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01243: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01244: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01245: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01246: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01247: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01248: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01249: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01250: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01251: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01252: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01253: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01254: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01255: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01256: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01257: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01258: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
~~~

### Around line 1243
~~~text
01231: .copilot-title{font-family:var(--font-display);font-size:17px;font-weight:700;}
01232: .copilot-ctx{font-size:11.5px;color:var(--text-dim);margin-top:3px;line-height:1.4;}
01233: .copilot-body{flex:1;overflow-y:auto;padding:14px 14px 8px;scroll-behavior:smooth;}
01234: .copilot-welcome{padding:12px 13px;border:1px solid var(--line);border-radius:12px;background:var(--panel-2);font-size:12.5px;line-height:1.55;color:var(--text-dim);}
01235: .copilot-msg{display:flex;margin:10px 0;}
01236: .copilot-msg.user{justify-content:flex-end;}
01237: .copilot-bubble{max-width:92%;border-radius:13px;padding:10px 12px;font-size:13px;line-height:1.55;overflow-wrap:anywhere;white-space:normal;}
01238: .copilot-msg.user .copilot-bubble{background:var(--red);color:#fff;border-bottom-right-radius:4px;}
01239: .copilot-msg.internal .copilot-bubble,.copilot-msg.external .copilot-bubble{background:var(--panel-2);border:1px solid var(--line);border-bottom-left-radius:4px;}
01240: .copilot-msg.external .copilot-bubble{border-left:3px solid var(--amber);}
01241: .copilot-answer-head{font-size:10px;text-transform:uppercase;letter-spacing:.55px;color:var(--text-dim);font-weight:700;margin-bottom:6px;}
01242: .copilot-result-group{margin-top:9px;padding-top:8px;border-top:1px solid var(--line);}
01243: .copilot-result-group:first-of-type{border-top:0;padding-top:0;}
01244: .copilot-result-title{font-weight:700;margin-bottom:4px;}
01245: .copilot-result-row{font-size:12px;color:var(--text-dim);padding:3px 0;overflow-wrap:anywhere;}
01246: .copilot-answer-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(105px,1fr));gap:7px;margin:8px 0 10px;}
01247: .copilot-answer-summary>div{border:1px solid var(--line);border-radius:9px;background:color-mix(in srgb,var(--panel) 86%,transparent);padding:9px 10px;min-width:0;}
01248: .copilot-summary-number{display:block;font:700 17px/1.05 var(--font-display);color:var(--text);}
01249: .copilot-summary-label{display:block;margin-top:4px;font-size:9.5px;line-height:1.25;color:var(--text-dim);overflow-wrap:anywhere;}
01250: .copilot-category-stack,.copilot-external-card-stack{display:grid;gap:10px;margin-top:9px;}
01251: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01252: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01253: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01254: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01255: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01256: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01257: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01258: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
~~~

## aiInternetResearch
No match.

## function renderCopilot
No match.

## function openCopilot
### Around line 23242
~~~text
23230:       thinking?.remove();
23231:       copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · scope mesin</div><div class="copilot-empty-card"><span>🔒</span><div><b>Jawaban ditahan karena keluar dari scope mesin</b><small>AI External mendeteksi referensi ke mesin lain. Tidak ada bagian jawaban lintas-mesin yang ditampilkan. Perjelas pertanyaan atau coba lagi.</small></div></div>',true);
23232:       return;
23233:     }
23234:     thinking?.remove();
23235:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External · hasil terstruktur</div>'+copilotExternalCardsHtml_(text,data),true);
23236:   }catch(err){
23237:     thinking?.remove();
23238:     copilotAppendMessage_('external','<div class="copilot-answer-head">AI External</div><div class="copilot-empty-card"><span>⚠️</span><div><b>Gagal menghubungi AI External</b><small>'+escapeHtml(err.message||String(err))+'</small></div></div>',true);
23239:   }finally{ btn.disabled=false; }
23240: }
23241: 
23242: function openCopilot(){
23243:   $('#copilot-bg').classList.add('active');
23244:   setTimeout(()=>$('#copilot-question')?.focus(),80);
23245: }
23246: function closeCopilot(){ $('#copilot-bg').classList.remove('active'); }
23247: 
23248: function copilotActiveView_(){
23249:   const active = document.querySelector('.view.active');
23250:   if(active && String(active.id||'').startsWith('view-')) return String(active.id).slice(5);
23251:   return PREVIOUS_ACTIVE_VIEW || 'dashboard';
23252: }
23253: function copilotHelpForView_(view){
23254:   const helpMap = {
23255:     dashboard:{title:'Home & Status Mesin',steps:[
23256:       'Lihat status mesin berdasarkan data Logbook atau Patrol yang paling baru.',
23257:       'Klik card mesin untuk membuka status terkini terlebih dahulu.',
23258:       'Gunakan Lihat Detail Mesin bila ingin membuka informasi mesin yang lebih lengkap.'
23259:     ]},
23260:     utama:{title:'View Logbook',steps:[
23261:       'Gunakan dropdown Mesin untuk membatasi data ke satu mesin.',
23262:       'Filter Status, Jenis, dan Group dapat digabungkan dengan pencarian.',
23263:       'Card Total, Selesai, Proses, Emergency, dan Hari Ini berfungsi sebagai shortcut filter.'
23264:     ]},
23265:     mesin:{title:'Logbook per Mesin',steps:[
23266:       'Pilih mesin dari dropdown untuk melihat riwayat pekerjaan unit tersebut.',
23267:       'Data memakai mapping Kode Mesin terlebih dahulu dan Nama Mesin sebagai fallback.'
23268:     ]},
23269:     patrol:{title:'Patrol Harian',steps:[
23270:       'Pilih mesin dari dropdown, isi checklist, lalu simpan.',
23271:       'Gunakan tab Temuan, Riwayat Patrol, dan Statistik untuk meninjau hasil.'
23272:     ]},
23273:     sparepart:{title:'Sparepart',steps:[
23274:       'Cari berdasarkan Material Number SAP atau nama material.',
23275:       'Periksa lokasi dan jumlah sebelum menyimpan atau menandai pengambilan.',
23276:       'Daily Collection dipakai untuk proses pengambilan dan pencatatan ke SAP.'
23277:     ]},
23278:     setting:{title:'Master Koneksi',steps:[
23279:       'User Management digunakan untuk memantau pengguna dan aktivitas.',
23280:       'Role Access Management digunakan untuk mengatur akses fitur per role.',
23281:       'Perubahan akses sebaiknya diuji dengan role terkait setelah disimpan.'
23282:     ]},
23283:     omodos4:{title:'OMODOS 4.0 Command Center',steps:[
23284:       'Halaman ini khusus Superadmin dan membaca data existing tanpa input ganda.',
23285:       'Gunakan ringkasan Things to Look At, What Changed?, dan Latest Intelligence untuk prioritas pengecekan.'
23286:     ]}
23287:   };
23288:   return helpMap[view] || {title:'Bantuan Halaman',steps:[
23289:     'Gunakan menu dan filter yang tersedia pada halaman ini.',
23290:     'Bila ada data yang tidak sesuai, sebutkan nama halaman, mesin, atau record pada Tanya Internal agar Copilot membatasi konteks pencarian.',
23291:     'Tombol Bersihkan Data hanya membersihkan percakapan/konteks Copilot dan tidak menghapus database.'
23292:   ]};
23293: }
23294: function copilotShowHelp_(){
23295:   const body=$('#copilot-body'); if(!body) return;
23296:   const view=copilotActiveView_();
23297:   const help=copilotHelpForView_(view);
23298:   const items=(help.steps||[]).map((step,i)=>`
23299:     <div class="copilot-data-record">
23300:       <div class="copilot-record-top">
23301:         <span class="copilot-record-index">${i+1}</span>
23302:         <div class="copilot-record-title">${escapeHtml(step)}</div>
23303:       </div>
23304:     </div>`).join('');
23305:   body.insertAdjacentHTML('beforeend',`
23306:     <div class="copilot-msg internal" data-copilot-help-card>
~~~

## copilot-record-title
### Around line 1263
~~~text
01251: .copilot-category-card,.copilot-external-card{--copilot-accent:var(--blue);border:1px solid var(--line);border-top:2px solid var(--copilot-accent);border-radius:11px;background:linear-gradient(180deg,color-mix(in srgb,var(--panel-2) 94%,var(--copilot-accent) 6%),var(--panel-2));padding:10px;min-width:0;box-shadow:0 6px 18px rgba(0,0,0,.12);}
01252: .copilot-category-card.cat-logbook{--copilot-accent:#5aa9ff}.copilot-category-card.cat-machine{--copilot-accent:#9b8cff}.copilot-category-card.cat-people{--copilot-accent:#53d3b2}.copilot-category-card.cat-knowledge{--copilot-accent:#c796ff}.copilot-category-card.cat-sparepart{--copilot-accent:#ffb04d}.copilot-category-card.cat-patrol{--copilot-accent:#5bd6ff}.copilot-category-card.cat-kpi{--copilot-accent:#3ddc97}.copilot-category-card.cat-energy{--copilot-accent:#f4d35e}.copilot-category-card.cat-report{--copilot-accent:#ff8090}.copilot-category-card.cat-default{--copilot-accent:var(--text-dim)}
01253: .copilot-category-head,.copilot-external-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;margin-bottom:8px;}
01254: .copilot-category-title{display:flex;align-items:flex-start;gap:8px;min-width:0;font:700 12px/1.25 var(--font-display);color:var(--text);}
01255: .copilot-category-title>div{min-width:0}.copilot-category-title small{display:block;margin-top:2px;font:500 9.5px/1.25 var(--font-body);color:var(--text-dim);overflow-wrap:anywhere;}
01256: .copilot-category-icon,.copilot-external-icon{font-size:16px;line-height:1;flex:0 0 auto;}
01257: .copilot-count-badge{flex:0 0 auto;border:1px solid color-mix(in srgb,var(--copilot-accent) 50%,var(--line));background:color-mix(in srgb,var(--copilot-accent) 11%,transparent);color:var(--copilot-accent);border-radius:999px;padding:3px 7px;font:700 9.5px/1.1 var(--font-mono);}
01258: .copilot-category-sub{font-size:10.5px;color:var(--text-dim);margin:-2px 0 8px}.copilot-page-explain{font-size:12.5px;line-height:1.55;color:var(--text);}
01259: .copilot-record-list{display:grid;gap:7px;}
01260: .copilot-data-record{border:1px solid var(--line-soft);border-radius:9px;background:var(--panel);padding:8px 9px;min-width:0;}
01261: .copilot-record-top{display:flex;align-items:flex-start;gap:7px;margin-bottom:7px;}
01262: .copilot-record-index{flex:0 0 auto;border-radius:5px;background:color-mix(in srgb,var(--copilot-accent) 12%,transparent);color:var(--copilot-accent);padding:2px 5px;font:700 9px/1.2 var(--font-mono);}
01263: .copilot-record-title{font-weight:700;font-size:11.5px;line-height:1.35;color:var(--text);min-width:0;overflow-wrap:anywhere;}
01264: .copilot-kv-grid,.copilot-external-kv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:6px;}
01265: .copilot-kv,.copilot-external-kv{border-radius:7px;background:var(--panel-2);padding:6px 7px;min-width:0;}
01266: .copilot-kv-key,.copilot-external-kv span{display:block;font-size:8.5px;text-transform:uppercase;letter-spacing:.35px;color:var(--text-dim);margin-bottom:2px;overflow-wrap:anywhere;}
01267: .copilot-kv-value,.copilot-external-kv b{display:block;font-size:10.5px;line-height:1.35;color:var(--text);font-weight:600;overflow-wrap:anywhere;word-break:break-word;}
01268: .copilot-more-note,.copilot-confidence-note{margin-top:8px;padding:7px 8px;border-radius:7px;background:color-mix(in srgb,var(--panel) 82%,transparent);font-size:10px;line-height:1.35;color:var(--text-dim);}
01269: .copilot-empty-card{display:flex;align-items:flex-start;gap:9px;border:1px dashed var(--line);border-radius:10px;background:var(--panel-2);padding:11px 12px;}.copilot-empty-card>span{font-size:18px}.copilot-empty-card b{display:block;font-size:12px;color:var(--text);margin-bottom:3px}.copilot-empty-card small{display:block;font-size:10.5px;line-height:1.4;color:var(--text-dim)}
01270: .copilot-scope-lock{display:flex;align-items:flex-start;gap:8px;margin:7px 0 10px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--green) 38%,var(--line));border-radius:9px;background:color-mix(in srgb,var(--green) 7%,var(--panel-2));}.copilot-scope-lock>span{font-size:14px}.copilot-scope-lock b{display:block;font-size:11px;color:var(--green);margin-bottom:2px}.copilot-scope-lock small{display:block;font-size:9.5px;line-height:1.35;color:var(--text-dim)}
01271: .copilot-external-card{--copilot-accent:var(--blue)}.copilot-external-card.ext-warning{--copilot-accent:var(--amber)}.copilot-external-card.ext-action{--copilot-accent:var(--green)}.copilot-external-card.ext-sparepart{--copilot-accent:#ffb04d}.copilot-external-card.ext-kpi{--copilot-accent:#53d3b2}.copilot-external-card.ext-diagnosis{--copilot-accent:#9b8cff}.copilot-external-card.ext-source{--copilot-accent:#5aa9ff}.copilot-external-card.ext-summary{--copilot-accent:#ff8090}
01272: .copilot-external-head{justify-content:flex-start;font:700 11.5px/1.25 var(--font-display);color:var(--copilot-accent);margin-bottom:7px;}
01273: .copilot-external-body{font-size:11.5px;line-height:1.5;color:var(--text-dim)}.copilot-external-body p{margin:0 0 7px}.copilot-external-body p:last-child{margin-bottom:0}.copilot-external-list{margin:6px 0 0;padding-left:18px}.copilot-external-list li{margin:4px 0;color:var(--text)}
01274: .copilot-record-empty{font-size:10.5px;color:var(--text-dim)}
01275: @media(max-width:520px){.copilot-answer-summary{grid-template-columns:repeat(2,minmax(0,1fr))}.copilot-kv-grid,.copilot-external-kv-grid{grid-template-columns:1fr}.copilot-category-card,.copilot-external-card{padding:9px}.copilot-count-badge{font-size:9px}}
01276: .copilot-composer{border-top:1px solid var(--line);padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px));background:var(--panel);}
01277: .copilot-composer textarea{width:100%;min-height:58px;max-height:130px;resize:vertical;margin:0;}
01278: .copilot-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:8px;align-items:center;} /* COPILOT_HELP_LOGBOOK_MACHINE_FILTER_V1 */
01279: .copilot-actions .btn{flex:1;justify-content:center;}
01280: .copilot-actions .btn[disabled]{opacity:.45;cursor:not-allowed;}
01281: .copilot-footnote{font-size:10.5px;color:var(--text-dim);margin-top:7px;line-height:1.35;}
01282: .copilot-thinking{display:flex;align-items:center;gap:7px;color:var(--text-dim);font-size:12px;}
01283: @media(max-width:780px){
01284:   #copilot-fab{right:14px;bottom:calc(82px + env(safe-area-inset-bottom,0px));width:50px;height:50px;font-size:22px;}
01285:   .copilot-panel{width:100vw;}
01286: }
01287: .ci-source-toggle{
01288:   margin-top:10px;display:inline-flex;align-items:center;gap:6px;background:none;border:1px solid var(--line);
01289:   border-radius:6px;padding:5px 10px;font-size:11.5px;color:var(--text-dim);cursor:pointer;transition:var(--trans);
01290: }
01291: .ci-source-toggle:hover{border-color:var(--amber);color:var(--amber);}
01292: .ci-source-toggle.open{border-color:var(--amber);color:var(--amber);}
01293: .ci-source-list{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden;}
01294: .ci-source-row{
01295:   display:flex;flex-wrap:wrap;gap:8px;padding:7px 10px;font-size:11.5px;border-bottom:1px solid var(--line);
01296:   color:var(--text-dim);
01297: }
01298: .ci-source-row:last-child{border-bottom:none;}
01299: .ci-source-date{font-family:var(--font-mono);white-space:nowrap;}
01300: .ci-source-mesin{font-weight:600;color:var(--text);}
01301: .ci-source-desc{flex:1;min-width:120px;}
01302: .ci-source-durasi{font-family:var(--font-mono);white-space:nowrap;color:var(--amber);}
01303: 
01304: .ci-card{
01305:   border:1px solid var(--line);border-left:3px solid var(--line);border-radius:10px;
01306:   background:var(--panel-2);padding:12px 14px;margin-bottom:10px;
01307: }
01308: .ci-card.lv-critical{border-left-color:var(--red);}
01309: .ci-card.lv-warning{border-left-color:var(--amber);}
01310: .ci-card.lv-info{border-left-color:#5b9dff;}
01311: .ci-card.lv-good{border-left-color:var(--green);}
01312: .ci-head{display:flex;align-items:center;gap:8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;margin-bottom:6px;}
01313: .ci-card.lv-critical .ci-head{color:var(--red);}
01314: .ci-card.lv-warning .ci-head{color:var(--amber);}
01315: .ci-card.lv-info .ci-head{color:#5b9dff;}
01316: .ci-card.lv-good .ci-head{color:var(--green);}
01317: .ci-text{font-size:13px;line-height:1.55;}
01318: .ci-text b{color:var(--text);}
01319: .ci-sub{font-size:11px;color:var(--text-dim);margin-top:6px;line-height:1.5;}
01320: 
01321: /* ---------------- ANALITIK & DASHBOARD ---------------- */
01322: .an-kpi-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px;margin-bottom:18px;}
01323: .an-kpi{
01324:   background:linear-gradient(180deg, var(--panel-2), var(--panel));border:1px solid var(--line);
01325:   border-radius:12px;padding:16px 18px;position:relative;overflow:hidden;
01326: }
01327: .an-kpi .lbl{font-size:10.5px;text-transform:uppercase;letter-spacing:.6px;color:var(--text-dim);font-family:var(--font-mono);}
~~~

### Around line 23077
~~~text
23065: 
23066: function copilotPrettyFieldName_(key){
23067:   return String(key||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ').replace(/\s+/g,' ').trim();
23068: }
23069: 
23070: function copilotRowCardHtml_(row,sourceName,index){
23071:   const fields=copilotCompactFields_(row);
23072:   const title=copilotRowLabel_(row);
23073:   const fieldHtml=fields.length ? '<div class="copilot-kv-grid">'+fields.map(f=>
23074:     '<div class="copilot-kv"><div class="copilot-kv-key">'+escapeHtml(copilotPrettyFieldName_(f.key))+'</div><div class="copilot-kv-value">'+escapeHtml(f.value)+'</div></div>'
23075:   ).join('')+'</div>' : '<div class="copilot-record-empty">Detail ringkas tidak tersedia.</div>';
23076:   return '<article class="copilot-data-record" data-copilot-source="'+escapeHtml(sourceName||'')+'">'+
23077:     '<div class="copilot-record-top"><span class="copilot-record-index">#'+(index+1)+'</span><div class="copilot-record-title">'+escapeHtml(title)+'</div></div>'+
23078:     fieldHtml+'</article>';
23079: }
23080: 
23081: function copilotExternalAutoCategory_(text){
23082:   const n=copilotNorm_(text);
23083:   if(/bahaya|risiko|safety|keselamatan|warning|peringatan|catatan/.test(n)) return {title:'Risiko & Catatan',icon:'⚠️',tone:'warning'};
23084:   if(/langkah|tindakan|rekomendasi|solusi|perbaikan|action/.test(n)) return {title:'Tindakan & Rekomendasi',icon:'🛠️',tone:'action'};
23085:   if(/sparepart|material|part|komponen|bearing|seal|sensor/.test(n)) return {title:'Komponen / Sparepart',icon:'📦',tone:'sparepart'};
23086:   if(/kpi|mtbf|mttr|downtime|trend|angka|data/.test(n)) return {title:'Data & Analisis',icon:'📊',tone:'kpi'};
23087:   if(/penyebab|diagnos|indikasi|gejala|temuan|root cause/.test(n)) return {title:'Diagnosis & Temuan',icon:'🔎',tone:'diagnosis'};
23088:   return {title:'Ringkasan',icon:'✨',tone:'summary'};
23089: }
23090: 
23091: function copilotNarrativeBodyHtml_(text){
23092:   const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
23093:   const list=[], paragraphs=[], kv=[];
23094:   lines.forEach(line=>{
23095:     const bullet=line.match(/^(?:[-*•]|\d+[.)])\s+(.+)/);
23096:     const pair=!bullet && line.length<240 ? line.match(/^([^:]{2,45}):\s*(.+)$/) : null;
23097:     if(bullet) list.push(bullet[1]);
23098:     else if(pair) kv.push({k:pair[1],v:pair[2]});
23099:     else paragraphs.push(line.replace(/^#{1,6}\s*/,'').replace(/^\*\*(.+)\*\*$/,'$1'));
23100:   });
23101:   let out='';
23102:   if(kv.length) out+='<div class="copilot-external-kv-grid">'+kv.map(x=>'<div class="copilot-external-kv"><span>'+escapeHtml(x.k)+'</span><b>'+escapeHtml(x.v)+'</b></div>').join('')+'</div>';
23103:   if(paragraphs.length) out+=paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('');
23104:   if(list.length) out+='<ul class="copilot-external-list">'+list.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
23105:   return out || '<div class="copilot-record-empty">Tidak ada isi yang dapat ditampilkan.</div>';
23106: }
23107: 
23108: function copilotExternalCardsHtml_(text,data){
23109:   const raw=String(text||'').trim();
23110:   const sections=[];
23111:   const paragraphs=raw ? raw.split(/\n\s*\n+/).map(x=>x.trim()).filter(Boolean) : [];
23112:   paragraphs.forEach(p=>{
23113:     const first=(p.split(/\r?\n/)[0]||'').trim();
23114:     const headingMatch=first.match(/^(?:#{1,6}\s*)?(?:\*\*)?([A-Za-zÀ-ÿ0-9 /&()_-]{3,70})(?:\*\*)?:?$/);
23115:     const looksHeading=headingMatch && p.split(/\r?\n/).length>1 && first.length<72;
23116:     if(looksHeading){
23117:       const title=headingMatch[1].replace(/\*\*/g,'').trim();
23118:       const body=p.split(/\r?\n/).slice(1).join('\n').trim();
23119:       const auto=copilotExternalAutoCategory_(title+' '+body);
23120:       sections.push({title,icon:auto.icon,tone:auto.tone,body:body||title});
23121:     }else{
23122:       const auto=copilotExternalAutoCategory_(p);
23123:       const existing=sections.find(x=>x.title===auto.title);
23124:       if(existing) existing.body += '\n'+p; else sections.push({title:auto.title,icon:auto.icon,tone:auto.tone,body:p});
23125:     }
23126:   });
23127:   if(data && Array.isArray(data.langkahPerbaikan) && data.langkahPerbaikan.length){
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
23135:   return '<div class="copilot-external-card-stack">'+sections.slice(0,10).map(sec=>
23136:     '<section class="copilot-external-card ext-'+sec.tone+'"><div class="copilot-external-head"><span class="copilot-external-icon">'+sec.icon+'</span><span>'+escapeHtml(sec.title)+'</span></div><div class="copilot-external-body">'+copilotNarrativeBodyHtml_(sec.body)+'</div></section>'
23137:   ).join('')+'</div>';
23138: }
23139: 
23140: function copilotInternalAnswer_(question){
23141:   const qn=copilotNorm_(question);
~~~

### Around line 23302
~~~text
23290:     'Bila ada data yang tidak sesuai, sebutkan nama halaman, mesin, atau record pada Tanya Internal agar Copilot membatasi konteks pencarian.',
23291:     'Tombol Bersihkan Data hanya membersihkan percakapan/konteks Copilot dan tidak menghapus database.'
23292:   ]};
23293: }
23294: function copilotShowHelp_(){
23295:   const body=$('#copilot-body'); if(!body) return;
23296:   const view=copilotActiveView_();
23297:   const help=copilotHelpForView_(view);
23298:   const items=(help.steps||[]).map((step,i)=>`
23299:     <div class="copilot-data-record">
23300:       <div class="copilot-record-top">
23301:         <span class="copilot-record-index">${i+1}</span>
23302:         <div class="copilot-record-title">${escapeHtml(step)}</div>
23303:       </div>
23304:     </div>`).join('');
23305:   body.insertAdjacentHTML('beforeend',`
23306:     <div class="copilot-msg internal" data-copilot-help-card>
23307:       <div class="copilot-bubble">
23308:         <div class="copilot-answer-head">Bantuan · ${escapeHtml(help.title)}</div>
23309:         <div class="copilot-category-card cat-default">
23310:           <div class="copilot-category-head">
23311:             <div class="copilot-category-title"><span class="copilot-category-icon">❓</span><div>${escapeHtml(help.title)}<small>Panduan singkat sesuai halaman yang sedang dibuka</small></div></div>
23312:           </div>
23313:           <div class="copilot-list">${items}</div>
23314:         </div>
23315:       </div>
23316:     </div>`);
23317:   body.scrollTop=body.scrollHeight;
23318: }
23319: 
23320: function copilotClearData_(){
23321:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23322:   const q=$('#copilot-question'); if(q) q.value='';
23323:   const body=$('#copilot-body');
23324:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23325:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23326:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23327: }
23328: 
23329: $('#copilot-fab').addEventListener('click',openCopilot);
23330: $('#copilot-close').addEventListener('click',closeCopilot);
23331: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23332: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23333: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23334: $('#copilot-help')?.addEventListener('click',copilotShowHelp_);
23335: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23336: $('#copilot-question').addEventListener('keydown',ev=>{
23337:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23338: });
23339: 
23340: /* =========================================================
23341:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23342:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23343:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23344:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23345:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23346:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23347:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23348:    ========================================================= */
23349: 
23350: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23351: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23352: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23353: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23354: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23355: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23356: const PI_TECH_DATA = [];
23357: 
23358: // ---- Katalog 10 aspek Soft Skill Assessment ----
23359: const PI_SOFTSKILL_ITEMS = [
23360:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23361:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23362:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23363: ];
23364: 
23365: 
23366: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
~~~

## data-copilot
### Around line 23076
~~~text
23064: }
23065: 
23066: function copilotPrettyFieldName_(key){
23067:   return String(key||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ').replace(/\s+/g,' ').trim();
23068: }
23069: 
23070: function copilotRowCardHtml_(row,sourceName,index){
23071:   const fields=copilotCompactFields_(row);
23072:   const title=copilotRowLabel_(row);
23073:   const fieldHtml=fields.length ? '<div class="copilot-kv-grid">'+fields.map(f=>
23074:     '<div class="copilot-kv"><div class="copilot-kv-key">'+escapeHtml(copilotPrettyFieldName_(f.key))+'</div><div class="copilot-kv-value">'+escapeHtml(f.value)+'</div></div>'
23075:   ).join('')+'</div>' : '<div class="copilot-record-empty">Detail ringkas tidak tersedia.</div>';
23076:   return '<article class="copilot-data-record" data-copilot-source="'+escapeHtml(sourceName||'')+'">'+
23077:     '<div class="copilot-record-top"><span class="copilot-record-index">#'+(index+1)+'</span><div class="copilot-record-title">'+escapeHtml(title)+'</div></div>'+
23078:     fieldHtml+'</article>';
23079: }
23080: 
23081: function copilotExternalAutoCategory_(text){
23082:   const n=copilotNorm_(text);
23083:   if(/bahaya|risiko|safety|keselamatan|warning|peringatan|catatan/.test(n)) return {title:'Risiko & Catatan',icon:'⚠️',tone:'warning'};
23084:   if(/langkah|tindakan|rekomendasi|solusi|perbaikan|action/.test(n)) return {title:'Tindakan & Rekomendasi',icon:'🛠️',tone:'action'};
23085:   if(/sparepart|material|part|komponen|bearing|seal|sensor/.test(n)) return {title:'Komponen / Sparepart',icon:'📦',tone:'sparepart'};
23086:   if(/kpi|mtbf|mttr|downtime|trend|angka|data/.test(n)) return {title:'Data & Analisis',icon:'📊',tone:'kpi'};
23087:   if(/penyebab|diagnos|indikasi|gejala|temuan|root cause/.test(n)) return {title:'Diagnosis & Temuan',icon:'🔎',tone:'diagnosis'};
23088:   return {title:'Ringkasan',icon:'✨',tone:'summary'};
23089: }
23090: 
23091: function copilotNarrativeBodyHtml_(text){
23092:   const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
23093:   const list=[], paragraphs=[], kv=[];
23094:   lines.forEach(line=>{
23095:     const bullet=line.match(/^(?:[-*•]|\d+[.)])\s+(.+)/);
23096:     const pair=!bullet && line.length<240 ? line.match(/^([^:]{2,45}):\s*(.+)$/) : null;
23097:     if(bullet) list.push(bullet[1]);
23098:     else if(pair) kv.push({k:pair[1],v:pair[2]});
23099:     else paragraphs.push(line.replace(/^#{1,6}\s*/,'').replace(/^\*\*(.+)\*\*$/,'$1'));
23100:   });
23101:   let out='';
23102:   if(kv.length) out+='<div class="copilot-external-kv-grid">'+kv.map(x=>'<div class="copilot-external-kv"><span>'+escapeHtml(x.k)+'</span><b>'+escapeHtml(x.v)+'</b></div>').join('')+'</div>';
23103:   if(paragraphs.length) out+=paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('');
23104:   if(list.length) out+='<ul class="copilot-external-list">'+list.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
23105:   return out || '<div class="copilot-record-empty">Tidak ada isi yang dapat ditampilkan.</div>';
23106: }
23107: 
23108: function copilotExternalCardsHtml_(text,data){
23109:   const raw=String(text||'').trim();
23110:   const sections=[];
23111:   const paragraphs=raw ? raw.split(/\n\s*\n+/).map(x=>x.trim()).filter(Boolean) : [];
23112:   paragraphs.forEach(p=>{
23113:     const first=(p.split(/\r?\n/)[0]||'').trim();
23114:     const headingMatch=first.match(/^(?:#{1,6}\s*)?(?:\*\*)?([A-Za-zÀ-ÿ0-9 /&()_-]{3,70})(?:\*\*)?:?$/);
23115:     const looksHeading=headingMatch && p.split(/\r?\n/).length>1 && first.length<72;
23116:     if(looksHeading){
23117:       const title=headingMatch[1].replace(/\*\*/g,'').trim();
23118:       const body=p.split(/\r?\n/).slice(1).join('\n').trim();
23119:       const auto=copilotExternalAutoCategory_(title+' '+body);
23120:       sections.push({title,icon:auto.icon,tone:auto.tone,body:body||title});
23121:     }else{
23122:       const auto=copilotExternalAutoCategory_(p);
23123:       const existing=sections.find(x=>x.title===auto.title);
23124:       if(existing) existing.body += '\n'+p; else sections.push({title:auto.title,icon:auto.icon,tone:auto.tone,body:p});
23125:     }
23126:   });
23127:   if(data && Array.isArray(data.langkahPerbaikan) && data.langkahPerbaikan.length){
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
23135:   return '<div class="copilot-external-card-stack">'+sections.slice(0,10).map(sec=>
23136:     '<section class="copilot-external-card ext-'+sec.tone+'"><div class="copilot-external-head"><span class="copilot-external-icon">'+sec.icon+'</span><span>'+escapeHtml(sec.title)+'</span></div><div class="copilot-external-body">'+copilotNarrativeBodyHtml_(sec.body)+'</div></section>'
23137:   ).join('')+'</div>';
23138: }
23139: 
23140: function copilotInternalAnswer_(question){
~~~

### Around line 23306
~~~text
23294: function copilotShowHelp_(){
23295:   const body=$('#copilot-body'); if(!body) return;
23296:   const view=copilotActiveView_();
23297:   const help=copilotHelpForView_(view);
23298:   const items=(help.steps||[]).map((step,i)=>`
23299:     <div class="copilot-data-record">
23300:       <div class="copilot-record-top">
23301:         <span class="copilot-record-index">${i+1}</span>
23302:         <div class="copilot-record-title">${escapeHtml(step)}</div>
23303:       </div>
23304:     </div>`).join('');
23305:   body.insertAdjacentHTML('beforeend',`
23306:     <div class="copilot-msg internal" data-copilot-help-card>
23307:       <div class="copilot-bubble">
23308:         <div class="copilot-answer-head">Bantuan · ${escapeHtml(help.title)}</div>
23309:         <div class="copilot-category-card cat-default">
23310:           <div class="copilot-category-head">
23311:             <div class="copilot-category-title"><span class="copilot-category-icon">❓</span><div>${escapeHtml(help.title)}<small>Panduan singkat sesuai halaman yang sedang dibuka</small></div></div>
23312:           </div>
23313:           <div class="copilot-list">${items}</div>
23314:         </div>
23315:       </div>
23316:     </div>`);
23317:   body.scrollTop=body.scrollHeight;
23318: }
23319: 
23320: function copilotClearData_(){
23321:   COPILOT_LAST_MACHINE=null; COPILOT_LAST_QUESTION=''; COPILOT_LAST_CONTEXT=[]; COPILOT_LAST_CONFIDENCE='low';
23322:   const q=$('#copilot-question'); if(q) q.value='';
23323:   const body=$('#copilot-body');
23324:   if(body) body.innerHTML='<div class="copilot-welcome">Tanyakan data atau hal yang ada di OMODOS, misalnya status pekerjaan, histori mesin, material sparepart, personil, KPI, project, meeting, patrol, atau Knowledge Base. Saya akan mencari data internal terlebih dahulu di seluruh database aplikasi.</div>';
23325:   const ext=$('#copilot-ask-external'); if(ext) ext.disabled=true;
23326:   toast('Data percakapan dan konteks Copilot dibersihkan. Database aplikasi tidak dihapus.');
23327: }
23328: 
23329: $('#copilot-fab').addEventListener('click',openCopilot);
23330: $('#copilot-close').addEventListener('click',closeCopilot);
23331: $('#copilot-bg').addEventListener('click',ev=>{ if(ev.target.id==='copilot-bg') closeCopilot(); });
23332: $('#copilot-ask-internal').addEventListener('click',copilotAskInternal_);
23333: $('#copilot-ask-external').addEventListener('click',copilotAskExternal_);
23334: $('#copilot-help')?.addEventListener('click',copilotShowHelp_);
23335: $('#copilot-clear-data')?.addEventListener('click',copilotClearData_);
23336: $('#copilot-question').addEventListener('keydown',ev=>{
23337:   if(ev.key==='Enter'&&!ev.shiftKey){ ev.preventDefault(); copilotAskInternal_(); }
23338: });
23339: 
23340: /* =========================================================
23341:    PEOPLE INTELLIGENCE SYSTEM (module baru)
23342:    - Sumber kompetensi teknis: 02__Assessment_TechComp_Result -
23343:      Offset Technical.xlsx (dibaca apa adanya, tidak diubah/di-rename).
23344:    - Soft Skill Assessment: modul baru, dinilai Supervisor skala 1-5,
23345:      disimpan di localStorage (pola sama seperti modul lain di app ini)
23346:      dan otomatis diantre ke sync queue kalau WEB_APP_URL sudah diisi
23347:      (memakai fungsi queueForSync_ / dst yang sudah ada, kalau tersedia).
23348:    ========================================================= */
23349: 
23350: // ---- Source of truth: hasil Assessment Kompetensi Teknis (read-only) ----
23351: // [HARDCODE REMOVED] PI_TECH_DATA sebelumnya berisi data personil/hard skill
23352: // yang di-hardcode langsung di kode. Sesuai kebijakan "Data strictly manual",
23353: // tidak ada lagi data karyawan/PI yang di-hardcode di sini — seluruh data
23354: // kompetensi teknis personil berasal murni dari Hard Skill Assessment manual
23355: // (PI_HS_ASSESSMENTS, tersimpan di database SQLite) lewat piFindTech() di bawah.
23356: const PI_TECH_DATA = [];
23357: 
23358: // ---- Katalog 10 aspek Soft Skill Assessment ----
23359: const PI_SOFTSKILL_ITEMS = [
23360:   'Disiplin','Integritas','Kerja Sama Tim','Komunikasi','Inisiatif',
23361:   'Pemecahan Masalah','Tanggung Jawab','Kemampuan Beradaptasi',
23362:   'Kesadaran Keselamatan Kerja','Kemauan Belajar dan Berkembang'
23363: ];
23364: 
23365: 
23366: // ---- Pemetaan indikatif 10 aspek Soft Skill Assessment ke beberapa kerangka kepribadian ----
23367: // Catatan: ini BUKAN alat tes psikometri resmi (bukan MBTI/DISC/Big Five/EQ asli).
23368: // Ini hanya interpretasi heuristik untuk membantu Supervisor/HR membaca kecenderungan
23369: // gaya kerja & kematangan emosional dari skor asesmen soft skill yang sudah ada (skala 1-5).
23370: const PI_DISC_MAP = {
~~~

## function copilotSearchInternal_(
### Around line 22990
~~~text
22978: function copilotRowDate_(row){
22979:   const keys=['Tanggal','tanggal','Date','date','Tanggal Input','Timestamp Input','Created At','createdAt','Jadwal Meeting','Tanggal Meeting'];
22980:   for(const k of keys){ if(row&&row[k]) return String(row[k]).slice(0,10); }
22981:   return '';
22982: }
22983: function copilotRowLabel_(row){
22984:   const keys=['Nama Mesin','Nama Material','Material Number SAP','Material Number','Nama','Nama Personil','Judul','title','Nama Project','Nama Tim','Jenis Meeting','Status','Tanggal','Lokasi Gudang','Lokasi/Area','Deskripsi Masalah','ID'];
22985:   const parts=[];
22986:   keys.forEach(k=>{ if(row&&row[k]!==undefined&&row[k]!==''&&parts.length<4) parts.push(String(row[k])); });
22987:   if(parts.length) return parts.join(' · ');
22988:   const text=copilotRowText_(row); return text.slice(0,180)+(text.length>180?'…':'');
22989: }
22990: function copilotSearchInternal_(question){
22991:   const qn=copilotNorm_(question), tokens=copilotTokens_(question), today=copilotLocalToday_();
22992:   const wantsToday=/hari ini|today/.test(qn);
22993:   const wantsLatest=/\b(terbaru|terkini|latest)\b/.test(qn);
22994:   const statusTerms=['selesai','proses','pending','emergency','planning','completed','on going','hold','cancel','closed','open','normal','perhatian','kritikal','critical'];
22995:   const askedStatus=statusTerms.find(x=>qn.includes(x))||'';
22996:   const sources=copilotDataSources_();
22997:   const machineTargets=copilotResolveMachineTargets_(question);
22998:   const machineAliases=Array.from(new Set(machineTargets.flatMap(t=>t.aliases)));
22999:   const machineIntent=/\b(mesin|machine|workcenter|work center|equipment)\b/.test(qn) || machineTargets.length>0;
23000:   const intents=copilotIntentProfile_(question);
23001:   if(machineIntent && !machineTargets.length) return [];
23002:   const groups=[];
23003:   for(const src of sources){
23004:     if(!copilotSourceAllowedByIntent_(src.name,intents)) continue;
23005:     const sourceNorms=[...src.keywords.map(copilotNorm_),copilotNorm_(src.name)];
23006:     const sourceHit=sourceNorms.some(k=>k&&qn.includes(k));
23007:     let contentTokens=tokens.filter(t=>!sourceNorms.some(k=>k===t||k.split(' ').includes(t)) && !statusTerms.includes(t));
23008:     if(machineTargets.length) contentTokens=contentTokens.filter(t=>!machineAliases.some(a=>a.split(/\s+/).includes(t)));
23009:     const ranked=[];
23010:     for(const row of src.rows){
23011:       if(machineTargets.length && !copilotRowMatchesMachineTargets_(row,machineTargets,src.name)) continue;
23012:       if(!copilotRowMatchesIntent_(row,intents,src.name)) continue;
23013:       const txt=copilotNorm_(copilotRowText_(row));
23014:       let score=sourceHit?4:0, contentHits=0;
23015:       if(machineTargets.length) score+=20;
23016:       for(const t of contentTokens){ if(txt.includes(t)){ score+=3; contentHits++; } }
23017:       const minContentHits=contentTokens.length ? Math.max(1,Math.ceil(contentTokens.length*0.55)) : 0;
23018:       if(contentTokens.length && contentHits<minContentHits) continue;
23019:       if(askedStatus){ if(txt.includes(askedStatus)) score+=3; else continue; }
23020:       if(wantsToday && copilotRowDate_(row)!==today) continue;
23021:       if(score>0 || machineTargets.length || sourceHit) ranked.push({row,score,date:copilotRowDate_(row)});
23022:     }
23023:     ranked.sort((a,b)=>b.score-a.score || (wantsLatest?String(b.date||'').localeCompare(String(a.date||'')):0));
23024:     if(ranked.length) groups.push({src,total:ranked.length,matches:ranked.slice(0,8).map(x=>x.row),sourceHit,machineHit:machineTargets.length>0,machineTargets});
23025:   }
23026:   groups.sort((a,b)=>(Number(b.machineHit)-Number(a.machineHit))||(b.sourceHit-a.sourceHit)||(b.total-a.total));
23027:   return groups.slice(0,12);
23028: }
23029: function copilotCategoryMeta_(sourceName){
23030:   const n=copilotNorm_(sourceName);
23031:   if(/logbook|maintenance/.test(n)) return {icon:'📘',label:'Logbook & Maintenance',tone:'logbook'};
23032:   if(/database mesin|machine|mesin|workcenter/.test(n)) return {icon:'⚙️',label:'Mesin & Equipment',tone:'machine'};
23033:   if(/personil|personnel|hard skill|soft skill|employee/.test(n)) return {icon:'👥',label:'People & Kompetensi',tone:'people'};
23034:   if(/knowledge|kb|lesson|best practice/.test(n)) return {icon:'🧠',label:'Knowledge Base',tone:'knowledge'};
23035:   if(/sparepart|material|warehouse|opname|\bpo\b|eta|sap status/.test(n)) return {icon:'📦',label:'Sparepart & Warehouse',tone:'sparepart'};
23036:   if(/patrol|predictive|finding|temuan/.test(n)) return {icon:'🛡️',label:'Patrol & Predictive',tone:'patrol'};
23037:   if(/kpi|breakdown|record ytd|run hour/.test(n)) return {icon:'📊',label:'KPI & Performance',tone:'kpi'};
23038:   if(/energy|utility|toe|ipal/.test(n)) return {icon:'⚡',label:'Energy & Utility',tone:'energy'};
23039:   if(/project|kaizen|sga|meeting|rca|corrective|report/.test(n)) return {icon:'🗂️',label:'Report & Improvement',tone:'report'};
23040:   return {icon:'🧩',label:String(sourceName||'Data OMODOS'),tone:'default'};
23041: }
23042: 
23043: function copilotCompactFields_(row){
23044:   if(!row || typeof row!=='object') return [];
23045:   const preferred=[
23046:     'Status','status','Tanggal','tanggal','Waktu','waktu','Nama Mesin','namaMesin','Kode Mesin','kodeMesin',
23047:     'Nama Unit','Unit','Nama Material','Material Number SAP','Material Number','Lokasi Gudang','Lokasi/Area','Lokasi',
23048:     'Nama Pelapor','Pelapor','PIC','pic','Petugas','petugas','Shift','shift','Severity','severity','Durasi','Downtime',
23049:     'Deskripsi Masalah','deskripsiTemuan','Deskripsi Temuan','Tindakan Perbaikan','Rekomendasi','rekomendasi','Judul','title','ID'
23050:   ];
23051:   const skip=/password|token|base64|attachment.*data|file.*data|session/i;
23052:   const seen=new Set(), fields=[];
23053:   const push=(k,v)=>{
23054:     if(fields.length>=7 || seen.has(k) || skip.test(k) || v===null || v===undefined || v==='') return;
~~~

## function copilotCompactFields_(
### Around line 23043
~~~text
23031:   if(/logbook|maintenance/.test(n)) return {icon:'📘',label:'Logbook & Maintenance',tone:'logbook'};
23032:   if(/database mesin|machine|mesin|workcenter/.test(n)) return {icon:'⚙️',label:'Mesin & Equipment',tone:'machine'};
23033:   if(/personil|personnel|hard skill|soft skill|employee/.test(n)) return {icon:'👥',label:'People & Kompetensi',tone:'people'};
23034:   if(/knowledge|kb|lesson|best practice/.test(n)) return {icon:'🧠',label:'Knowledge Base',tone:'knowledge'};
23035:   if(/sparepart|material|warehouse|opname|\bpo\b|eta|sap status/.test(n)) return {icon:'📦',label:'Sparepart & Warehouse',tone:'sparepart'};
23036:   if(/patrol|predictive|finding|temuan/.test(n)) return {icon:'🛡️',label:'Patrol & Predictive',tone:'patrol'};
23037:   if(/kpi|breakdown|record ytd|run hour/.test(n)) return {icon:'📊',label:'KPI & Performance',tone:'kpi'};
23038:   if(/energy|utility|toe|ipal/.test(n)) return {icon:'⚡',label:'Energy & Utility',tone:'energy'};
23039:   if(/project|kaizen|sga|meeting|rca|corrective|report/.test(n)) return {icon:'🗂️',label:'Report & Improvement',tone:'report'};
23040:   return {icon:'🧩',label:String(sourceName||'Data OMODOS'),tone:'default'};
23041: }
23042: 
23043: function copilotCompactFields_(row){
23044:   if(!row || typeof row!=='object') return [];
23045:   const preferred=[
23046:     'Status','status','Tanggal','tanggal','Waktu','waktu','Nama Mesin','namaMesin','Kode Mesin','kodeMesin',
23047:     'Nama Unit','Unit','Nama Material','Material Number SAP','Material Number','Lokasi Gudang','Lokasi/Area','Lokasi',
23048:     'Nama Pelapor','Pelapor','PIC','pic','Petugas','petugas','Shift','shift','Severity','severity','Durasi','Downtime',
23049:     'Deskripsi Masalah','deskripsiTemuan','Deskripsi Temuan','Tindakan Perbaikan','Rekomendasi','rekomendasi','Judul','title','ID'
23050:   ];
23051:   const skip=/password|token|base64|attachment.*data|file.*data|session/i;
23052:   const seen=new Set(), fields=[];
23053:   const push=(k,v)=>{
23054:     if(fields.length>=7 || seen.has(k) || skip.test(k) || v===null || v===undefined || v==='') return;
23055:     if(!['string','number','boolean'].includes(typeof v)) return;
23056:     let txt=String(v).replace(/\s+/g,' ').trim();
23057:     if(!txt) return;
23058:     if(txt.length>180) txt=txt.slice(0,177)+'…';
23059:     seen.add(k); fields.push({key:k,value:txt});
23060:   };
23061:   preferred.forEach(k=>{ if(Object.prototype.hasOwnProperty.call(row,k)) push(k,row[k]); });
23062:   Object.entries(row).forEach(([k,v])=>push(k,v));
23063:   return fields.slice(0,6);
23064: }
23065: 
23066: function copilotPrettyFieldName_(key){
23067:   return String(key||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ').replace(/\s+/g,' ').trim();
23068: }
23069: 
23070: function copilotRowCardHtml_(row,sourceName,index){
23071:   const fields=copilotCompactFields_(row);
23072:   const title=copilotRowLabel_(row);
23073:   const fieldHtml=fields.length ? '<div class="copilot-kv-grid">'+fields.map(f=>
23074:     '<div class="copilot-kv"><div class="copilot-kv-key">'+escapeHtml(copilotPrettyFieldName_(f.key))+'</div><div class="copilot-kv-value">'+escapeHtml(f.value)+'</div></div>'
23075:   ).join('')+'</div>' : '<div class="copilot-record-empty">Detail ringkas tidak tersedia.</div>';
23076:   return '<article class="copilot-data-record" data-copilot-source="'+escapeHtml(sourceName||'')+'">'+
23077:     '<div class="copilot-record-top"><span class="copilot-record-index">#'+(index+1)+'</span><div class="copilot-record-title">'+escapeHtml(title)+'</div></div>'+
23078:     fieldHtml+'</article>';
23079: }
23080: 
23081: function copilotExternalAutoCategory_(text){
23082:   const n=copilotNorm_(text);
23083:   if(/bahaya|risiko|safety|keselamatan|warning|peringatan|catatan/.test(n)) return {title:'Risiko & Catatan',icon:'⚠️',tone:'warning'};
23084:   if(/langkah|tindakan|rekomendasi|solusi|perbaikan|action/.test(n)) return {title:'Tindakan & Rekomendasi',icon:'🛠️',tone:'action'};
23085:   if(/sparepart|material|part|komponen|bearing|seal|sensor/.test(n)) return {title:'Komponen / Sparepart',icon:'📦',tone:'sparepart'};
23086:   if(/kpi|mtbf|mttr|downtime|trend|angka|data/.test(n)) return {title:'Data & Analisis',icon:'📊',tone:'kpi'};
23087:   if(/penyebab|diagnos|indikasi|gejala|temuan|root cause/.test(n)) return {title:'Diagnosis & Temuan',icon:'🔎',tone:'diagnosis'};
23088:   return {title:'Ringkasan',icon:'✨',tone:'summary'};
23089: }
23090: 
23091: function copilotNarrativeBodyHtml_(text){
23092:   const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
23093:   const list=[], paragraphs=[], kv=[];
23094:   lines.forEach(line=>{
23095:     const bullet=line.match(/^(?:[-*•]|\d+[.)])\s+(.+)/);
23096:     const pair=!bullet && line.length<240 ? line.match(/^([^:]{2,45}):\s*(.+)$/) : null;
23097:     if(bullet) list.push(bullet[1]);
23098:     else if(pair) kv.push({k:pair[1],v:pair[2]});
23099:     else paragraphs.push(line.replace(/^#{1,6}\s*/,'').replace(/^\*\*(.+)\*\*$/,'$1'));
23100:   });
23101:   let out='';
23102:   if(kv.length) out+='<div class="copilot-external-kv-grid">'+kv.map(x=>'<div class="copilot-external-kv"><span>'+escapeHtml(x.k)+'</span><b>'+escapeHtml(x.v)+'</b></div>').join('')+'</div>';
23103:   if(paragraphs.length) out+=paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('');
23104:   if(list.length) out+='<ul class="copilot-external-list">'+list.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
23105:   return out || '<div class="copilot-record-empty">Tidak ada isi yang dapat ditampilkan.</div>';
23106: }
23107: 
~~~

## function copilotRowLabel_(
### Around line 22983
~~~text
22971:   if(intents.includes('sparepart') && /logbook/.test(n)){
22972:     const material=String(row?.['Nama Material'] ?? row?.['Material Number SAP'] ?? row?.['Material Number'] ?? '').trim();
22973:     if(!material) return false;
22974:   }
22975:   return true;
22976: }
22977: 
22978: function copilotRowDate_(row){
22979:   const keys=['Tanggal','tanggal','Date','date','Tanggal Input','Timestamp Input','Created At','createdAt','Jadwal Meeting','Tanggal Meeting'];
22980:   for(const k of keys){ if(row&&row[k]) return String(row[k]).slice(0,10); }
22981:   return '';
22982: }
22983: function copilotRowLabel_(row){
22984:   const keys=['Nama Mesin','Nama Material','Material Number SAP','Material Number','Nama','Nama Personil','Judul','title','Nama Project','Nama Tim','Jenis Meeting','Status','Tanggal','Lokasi Gudang','Lokasi/Area','Deskripsi Masalah','ID'];
22985:   const parts=[];
22986:   keys.forEach(k=>{ if(row&&row[k]!==undefined&&row[k]!==''&&parts.length<4) parts.push(String(row[k])); });
22987:   if(parts.length) return parts.join(' · ');
22988:   const text=copilotRowText_(row); return text.slice(0,180)+(text.length>180?'…':'');
22989: }
22990: function copilotSearchInternal_(question){
22991:   const qn=copilotNorm_(question), tokens=copilotTokens_(question), today=copilotLocalToday_();
22992:   const wantsToday=/hari ini|today/.test(qn);
22993:   const wantsLatest=/\b(terbaru|terkini|latest)\b/.test(qn);
22994:   const statusTerms=['selesai','proses','pending','emergency','planning','completed','on going','hold','cancel','closed','open','normal','perhatian','kritikal','critical'];
22995:   const askedStatus=statusTerms.find(x=>qn.includes(x))||'';
22996:   const sources=copilotDataSources_();
22997:   const machineTargets=copilotResolveMachineTargets_(question);
22998:   const machineAliases=Array.from(new Set(machineTargets.flatMap(t=>t.aliases)));
22999:   const machineIntent=/\b(mesin|machine|workcenter|work center|equipment)\b/.test(qn) || machineTargets.length>0;
23000:   const intents=copilotIntentProfile_(question);
23001:   if(machineIntent && !machineTargets.length) return [];
23002:   const groups=[];
23003:   for(const src of sources){
23004:     if(!copilotSourceAllowedByIntent_(src.name,intents)) continue;
23005:     const sourceNorms=[...src.keywords.map(copilotNorm_),copilotNorm_(src.name)];
23006:     const sourceHit=sourceNorms.some(k=>k&&qn.includes(k));
23007:     let contentTokens=tokens.filter(t=>!sourceNorms.some(k=>k===t||k.split(' ').includes(t)) && !statusTerms.includes(t));
23008:     if(machineTargets.length) contentTokens=contentTokens.filter(t=>!machineAliases.some(a=>a.split(/\s+/).includes(t)));
23009:     const ranked=[];
23010:     for(const row of src.rows){
23011:       if(machineTargets.length && !copilotRowMatchesMachineTargets_(row,machineTargets,src.name)) continue;
23012:       if(!copilotRowMatchesIntent_(row,intents,src.name)) continue;
23013:       const txt=copilotNorm_(copilotRowText_(row));
23014:       let score=sourceHit?4:0, contentHits=0;
23015:       if(machineTargets.length) score+=20;
23016:       for(const t of contentTokens){ if(txt.includes(t)){ score+=3; contentHits++; } }
23017:       const minContentHits=contentTokens.length ? Math.max(1,Math.ceil(contentTokens.length*0.55)) : 0;
23018:       if(contentTokens.length && contentHits<minContentHits) continue;
23019:       if(askedStatus){ if(txt.includes(askedStatus)) score+=3; else continue; }
23020:       if(wantsToday && copilotRowDate_(row)!==today) continue;
23021:       if(score>0 || machineTargets.length || sourceHit) ranked.push({row,score,date:copilotRowDate_(row)});
23022:     }
23023:     ranked.sort((a,b)=>b.score-a.score || (wantsLatest?String(b.date||'').localeCompare(String(a.date||'')):0));
23024:     if(ranked.length) groups.push({src,total:ranked.length,matches:ranked.slice(0,8).map(x=>x.row),sourceHit,machineHit:machineTargets.length>0,machineTargets});
23025:   }
23026:   groups.sort((a,b)=>(Number(b.machineHit)-Number(a.machineHit))||(b.sourceHit-a.sourceHit)||(b.total-a.total));
23027:   return groups.slice(0,12);
23028: }
23029: function copilotCategoryMeta_(sourceName){
23030:   const n=copilotNorm_(sourceName);
23031:   if(/logbook|maintenance/.test(n)) return {icon:'📘',label:'Logbook & Maintenance',tone:'logbook'};
23032:   if(/database mesin|machine|mesin|workcenter/.test(n)) return {icon:'⚙️',label:'Mesin & Equipment',tone:'machine'};
23033:   if(/personil|personnel|hard skill|soft skill|employee/.test(n)) return {icon:'👥',label:'People & Kompetensi',tone:'people'};
23034:   if(/knowledge|kb|lesson|best practice/.test(n)) return {icon:'🧠',label:'Knowledge Base',tone:'knowledge'};
23035:   if(/sparepart|material|warehouse|opname|\bpo\b|eta|sap status/.test(n)) return {icon:'📦',label:'Sparepart & Warehouse',tone:'sparepart'};
23036:   if(/patrol|predictive|finding|temuan/.test(n)) return {icon:'🛡️',label:'Patrol & Predictive',tone:'patrol'};
23037:   if(/kpi|breakdown|record ytd|run hour/.test(n)) return {icon:'📊',label:'KPI & Performance',tone:'kpi'};
23038:   if(/energy|utility|toe|ipal/.test(n)) return {icon:'⚡',label:'Energy & Utility',tone:'energy'};
23039:   if(/project|kaizen|sga|meeting|rca|corrective|report/.test(n)) return {icon:'🗂️',label:'Report & Improvement',tone:'report'};
23040:   return {icon:'🧩',label:String(sourceName||'Data OMODOS'),tone:'default'};
23041: }
23042: 
23043: function copilotCompactFields_(row){
23044:   if(!row || typeof row!=='object') return [];
23045:   const preferred=[
23046:     'Status','status','Tanggal','tanggal','Waktu','waktu','Nama Mesin','namaMesin','Kode Mesin','kodeMesin',
23047:     'Nama Unit','Unit','Nama Material','Material Number SAP','Material Number','Lokasi Gudang','Lokasi/Area','Lokasi',
~~~

## function copilotInternalAnswer_(
### Around line 23140
~~~text
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
23135:   return '<div class="copilot-external-card-stack">'+sections.slice(0,10).map(sec=>
23136:     '<section class="copilot-external-card ext-'+sec.tone+'"><div class="copilot-external-head"><span class="copilot-external-icon">'+sec.icon+'</span><span>'+escapeHtml(sec.title)+'</span></div><div class="copilot-external-body">'+copilotNarrativeBodyHtml_(sec.body)+'</div></section>'
23137:   ).join('')+'</div>';
23138: }
23139: 
23140: function copilotInternalAnswer_(question){
23141:   const qn=copilotNorm_(question);
23142:   if(!qn) return {html:'Masukkan pertanyaan terlebih dahulu.',context:[],confidence:'low'};
23143:   if(/fungsi|halaman ini|menu ini|fitur ini/.test(qn)){
23144:     const view=PREVIOUS_ACTIVE_VIEW||'dashboard';
23145:     const info=COPILOT_PAGE_INFO[view];
23146:     if(info){
23147:       const viewName=copilotViewLabel(view);
23148:       const html='<div class="copilot-answer-head">AI Internal · konteks aplikasi</div>'+
23149:         '<div class="copilot-category-stack"><section class="copilot-category-card cat-default">'+
23150:         '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">🧭</span><span>Konteks Halaman</span></div><span class="copilot-count-badge">Aktif</span></div>'+
23151:         '<div class="copilot-category-sub">'+escapeHtml(viewName)+'</div><div class="copilot-page-explain">'+escapeHtml(info)+'</div></section></div>';
23152:       return {html,context:['Halaman aktif: '+viewName+'. '+info],confidence:'high'};
23153:     }
23154:   }
23155:   const machineTargets=copilotResolveMachineTargets_(question);
23156:   const machineIntent=/\b(mesin|machine|workcenter|work center|equipment)\b/.test(qn) || machineTargets.length>0;
23157:   const groups=copilotSearchInternal_(question);
23158:   const wantsCount=/\b(berapa|jumlah|total)\b/.test(qn);
23159:   const context=[];
23160:   if(machineIntent && !machineTargets.length){
23161:     return {html:'<div class="copilot-answer-head">AI Internal · scope mesin</div><div class="copilot-empty-card"><span>⚙️</span><div><b>Mesin yang dimaksud belum dapat dipastikan</b><small>Saya tidak akan menampilkan data mesin lain untuk mengisi kekosongan. Gunakan nama/kode mesin persis seperti di Master Mesin.</small></div></div>',context:[],confidence:'low'};
23162:   }
23163:   if(!groups.length){
23164:     return {html:'<div class="copilot-answer-head">AI Internal</div><div class="copilot-empty-card"><span>🔎</span><div><b>Data relevan belum ditemukan</b><small>Coba gunakan nama mesin, kode material, tanggal, status, atau kategori data yang lebih spesifik. AI External tetap dapat dipakai untuk pengetahuan umum.</small></div></div>',context:[],confidence:'low'};
23165:   }
23166:   const machineQuery=machineIntent;
23167:   const machineScopeLabel=machineTargets.map(t=>t.label).join(', ');
23168:   const visible=groups.slice(0,machineQuery?10:6);
23169:   const top=visible[0];
23170:   const totalHits=visible.reduce((sum,g)=>sum+g.total,0);
23171:   let html='<div class="copilot-answer-head">AI Internal · '+(machineQuery?'pencarian lintas seluruh database':'data aplikasi')+'</div>';
23172:   if(machineScopeLabel) html+='<div class="copilot-scope-lock"><span>🔒</span><div><b>Scope dikunci: '+escapeHtml(machineScopeLabel)+'</b><small>Record tanpa identitas mesin yang cocok persis tidak ditampilkan.</small></div></div>';
23173:   html+='<div class="copilot-answer-summary"><div><span class="copilot-summary-number">'+totalHits.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">kecocokan ditampilkan</span></div><div><span class="copilot-summary-number">'+visible.length+'</span><span class="copilot-summary-label">kategori data</span></div>'+(wantsCount&&top?'<div><span class="copilot-summary-number">'+top.total.toLocaleString('id-ID')+'</span><span class="copilot-summary-label">'+escapeHtml(top.src.name)+'</span></div>':'')+'</div>';
23174:   html+='<div class="copilot-category-stack">';
23175:   visible.forEach(g=>{
23176:     const meta=copilotCategoryMeta_(g.src.name);
23177:     html+='<section class="copilot-category-card cat-'+meta.tone+'">'+
23178:       '<div class="copilot-category-head"><div class="copilot-category-title"><span class="copilot-category-icon">'+meta.icon+'</span><div><span>'+escapeHtml(meta.label)+'</span><small>'+escapeHtml(g.src.name)+'</small></div></div><span class="copilot-count-badge">'+g.total+' cocok</span></div>'+
23179:       '<div class="copilot-record-list">'+g.matches.slice(0,machineQuery?6:4).map((r,i)=>copilotRowCardHtml_(r,g.src.name,i)).join('')+'</div>'+
23180:       (g.total>g.matches.slice(0,machineQuery?6:4).length?'<div class="copilot-more-note">+'+(g.total-g.matches.slice(0,machineQuery?6:4).length)+' data relevan lain tersedia di kategori ini.</div>':'')+'</section>';
23181:     g.matches.slice(0,machineQuery?6:4).forEach(r=>{ if(context.length<14) context.push('['+g.src.name+'] '+copilotRowText_(r).slice(0,700)); });
23182:   });
23183:   html+='</div>';
23184:   const high=(top.sourceHit && top.total>0) || (top.total>=3);
23185:   if(!high) html+='<div class="copilot-confidence-note">Kecocokan data internal masih terbatas. Gunakan AI External bila memerlukan interpretasi atau referensi tambahan.</div>';
23186:   return {html,context,confidence:high?'high':'medium'};
23187: }
23188: 
23189: function copilotAppendMessage_(type,content,isHtml){
23190:   const body=$('#copilot-body');
23191:   if(!body) return;
23192:   const msg=document.createElement('div'); msg.className=`copilot-msg ${type}`;
23193:   const bubble=document.createElement('div'); bubble.className='copilot-bubble';
23194:   if(isHtml) bubble.innerHTML=content; else bubble.textContent=content;
23195:   msg.appendChild(bubble); body.appendChild(msg); body.scrollTop=body.scrollHeight;
23196:   return msg;
23197: }
23198: function copilotSetThinking_(label){
23199:   const el=copilotAppendMessage_('internal',`<div class="copilot-thinking"><span class="ai-spinner"></span>${escapeHtml(label||'Mencari data internal...')}</div>`,true);
23200:   if(el) el.dataset.thinking='1'; return el;
23201: }
23202: async function copilotAskInternal_(){
23203:   const qEl=$('#copilot-question'); const q=String(qEl?.value||'').trim();
23204:   if(!q){ toast('Tulis pertanyaan untuk Copilot.',true); return; }
~~~

## function copilotRowCardHtml_(
### Around line 23070
~~~text
23058:     if(txt.length>180) txt=txt.slice(0,177)+'…';
23059:     seen.add(k); fields.push({key:k,value:txt});
23060:   };
23061:   preferred.forEach(k=>{ if(Object.prototype.hasOwnProperty.call(row,k)) push(k,row[k]); });
23062:   Object.entries(row).forEach(([k,v])=>push(k,v));
23063:   return fields.slice(0,6);
23064: }
23065: 
23066: function copilotPrettyFieldName_(key){
23067:   return String(key||'').replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_\.]/g,' ').replace(/\s+/g,' ').trim();
23068: }
23069: 
23070: function copilotRowCardHtml_(row,sourceName,index){
23071:   const fields=copilotCompactFields_(row);
23072:   const title=copilotRowLabel_(row);
23073:   const fieldHtml=fields.length ? '<div class="copilot-kv-grid">'+fields.map(f=>
23074:     '<div class="copilot-kv"><div class="copilot-kv-key">'+escapeHtml(copilotPrettyFieldName_(f.key))+'</div><div class="copilot-kv-value">'+escapeHtml(f.value)+'</div></div>'
23075:   ).join('')+'</div>' : '<div class="copilot-record-empty">Detail ringkas tidak tersedia.</div>';
23076:   return '<article class="copilot-data-record" data-copilot-source="'+escapeHtml(sourceName||'')+'">'+
23077:     '<div class="copilot-record-top"><span class="copilot-record-index">#'+(index+1)+'</span><div class="copilot-record-title">'+escapeHtml(title)+'</div></div>'+
23078:     fieldHtml+'</article>';
23079: }
23080: 
23081: function copilotExternalAutoCategory_(text){
23082:   const n=copilotNorm_(text);
23083:   if(/bahaya|risiko|safety|keselamatan|warning|peringatan|catatan/.test(n)) return {title:'Risiko & Catatan',icon:'⚠️',tone:'warning'};
23084:   if(/langkah|tindakan|rekomendasi|solusi|perbaikan|action/.test(n)) return {title:'Tindakan & Rekomendasi',icon:'🛠️',tone:'action'};
23085:   if(/sparepart|material|part|komponen|bearing|seal|sensor/.test(n)) return {title:'Komponen / Sparepart',icon:'📦',tone:'sparepart'};
23086:   if(/kpi|mtbf|mttr|downtime|trend|angka|data/.test(n)) return {title:'Data & Analisis',icon:'📊',tone:'kpi'};
23087:   if(/penyebab|diagnos|indikasi|gejala|temuan|root cause/.test(n)) return {title:'Diagnosis & Temuan',icon:'🔎',tone:'diagnosis'};
23088:   return {title:'Ringkasan',icon:'✨',tone:'summary'};
23089: }
23090: 
23091: function copilotNarrativeBodyHtml_(text){
23092:   const lines=String(text||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
23093:   const list=[], paragraphs=[], kv=[];
23094:   lines.forEach(line=>{
23095:     const bullet=line.match(/^(?:[-*•]|\d+[.)])\s+(.+)/);
23096:     const pair=!bullet && line.length<240 ? line.match(/^([^:]{2,45}):\s*(.+)$/) : null;
23097:     if(bullet) list.push(bullet[1]);
23098:     else if(pair) kv.push({k:pair[1],v:pair[2]});
23099:     else paragraphs.push(line.replace(/^#{1,6}\s*/,'').replace(/^\*\*(.+)\*\*$/,'$1'));
23100:   });
23101:   let out='';
23102:   if(kv.length) out+='<div class="copilot-external-kv-grid">'+kv.map(x=>'<div class="copilot-external-kv"><span>'+escapeHtml(x.k)+'</span><b>'+escapeHtml(x.v)+'</b></div>').join('')+'</div>';
23103:   if(paragraphs.length) out+=paragraphs.map(p=>'<p>'+escapeHtml(p)+'</p>').join('');
23104:   if(list.length) out+='<ul class="copilot-external-list">'+list.map(x=>'<li>'+escapeHtml(x)+'</li>').join('')+'</ul>';
23105:   return out || '<div class="copilot-record-empty">Tidak ada isi yang dapat ditampilkan.</div>';
23106: }
23107: 
23108: function copilotExternalCardsHtml_(text,data){
23109:   const raw=String(text||'').trim();
23110:   const sections=[];
23111:   const paragraphs=raw ? raw.split(/\n\s*\n+/).map(x=>x.trim()).filter(Boolean) : [];
23112:   paragraphs.forEach(p=>{
23113:     const first=(p.split(/\r?\n/)[0]||'').trim();
23114:     const headingMatch=first.match(/^(?:#{1,6}\s*)?(?:\*\*)?([A-Za-zÀ-ÿ0-9 /&()_-]{3,70})(?:\*\*)?:?$/);
23115:     const looksHeading=headingMatch && p.split(/\r?\n/).length>1 && first.length<72;
23116:     if(looksHeading){
23117:       const title=headingMatch[1].replace(/\*\*/g,'').trim();
23118:       const body=p.split(/\r?\n/).slice(1).join('\n').trim();
23119:       const auto=copilotExternalAutoCategory_(title+' '+body);
23120:       sections.push({title,icon:auto.icon,tone:auto.tone,body:body||title});
23121:     }else{
23122:       const auto=copilotExternalAutoCategory_(p);
23123:       const existing=sections.find(x=>x.title===auto.title);
23124:       if(existing) existing.body += '\n'+p; else sections.push({title:auto.title,icon:auto.icon,tone:auto.tone,body:p});
23125:     }
23126:   });
23127:   if(data && Array.isArray(data.langkahPerbaikan) && data.langkahPerbaikan.length){
23128:     sections.push({title:'Langkah Perbaikan',icon:'🛠️',tone:'action',body:data.langkahPerbaikan.map((x,i)=>(i+1)+'. '+x).join('\n')});
23129:   }
23130:   if(data && data.catatan) sections.push({title:'Catatan Penting',icon:'⚠️',tone:'warning',body:String(data.catatan)});
23131:   if(data && Array.isArray(data.sumberInternet) && data.sumberInternet.length){
23132:     sections.push({title:'Sumber Referensi',icon:'🔗',tone:'source',body:data.sumberInternet.map(x=>(x.title||'Sumber')+': '+(x.url||'')).join('\n')});
23133:   }
23134:   if(!sections.length) sections.push({title:'Ringkasan',icon:'✨',tone:'summary',body:raw||'AI External tidak mengembalikan jawaban.'});
~~~

## Deskripsi Pekerjaan
### Around line 3584
~~~text
03572:           </div>
03573:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-clipboard-text"></i> Detail Pekerjaan</div>
03574:           <div class="field"><label>Jenis Pekerjaan</label>
03575:             <select name="jenisPekerjaan" required>
03576:               <option>Preventive Maintenance</option>
03577:               <option>Corrective Maintenance</option>
03578:               <option>Predictive Maintenance</option>
03579:               <option>Emergency Repair</option>
03580:               <option>Instalasi</option><option>Modifikasi</option><option>Pemindahan</option><option>Pelepasan / Dismantle / Uninstall</option>
03581:               <option>Lainnya</option>
03582:             </select>
03583:           </div>
03584:           <div class="field"><label>Deskripsi Pekerjaan / Masalah
03585:             <button type="button" class="btn-ai-fix" id="btn-ai-fix-deskripsiMasalah" title="Perbaiki typo &amp; ejaan menggunakan AI External"><i class="ph-bold ph-magic-wand"></i> Koreksi AI External</button>
03586:           </label><textarea name="deskripsiMasalah" id="ta-deskripsiMasalah" rows="3" placeholder="Jelaskan pekerjaan, kebutuhan, atau masalah yang ditemukan..." required></textarea></div>
03587:           <div class="field"><label>Tindakan Perbaikan yang Dilakukan
03588:             <button type="button" class="btn-ai-fix" id="btn-ai-fix-tindakanPerbaikan" title="Perbaiki typo &amp; ejaan menggunakan AI External"><i class="ph-bold ph-magic-wand"></i> Koreksi AI External</button>
03589:           </label><textarea name="tindakanPerbaikan" id="ta-tindakanPerbaikan" rows="3" placeholder="Jelaskan tindakan yang sudah/sedang dilakukan..." required></textarea></div>
03590:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-wrench"></i> Sparepart yang Digunakan</div>
03591:           <div id="sparepart-rows"></div>
03592:           <button type="button" class="btn btn-ghost btn-sm" id="btn-add-sparepart-row" style="margin:4px 0 8px 0;"><i class="ph-bold ph-plus"></i> Tambah Sparepart Lain</button>
03593: 
03594:           <div class="grid3">
03595:             <div class="field"><label>Status Pekerjaan</label>
03596:               <select name="status" required><option>Proses</option><option>Selesai</option><option>Pending</option><option>Emergency</option></select>
03597:             </div>
03598:             <div class="field"><label>Jam Mulai</label><input type="time" name="jamMulai" id="input-jamMulai" required></div>
03599:             <div class="field"><label>Jam Selesai</label><input type="time" name="jamSelesai" id="input-jamSelesai" required></div>
03600:           </div>
03601:           <div class="field"><label>Estimasi Pekerjaan (Otomatis)</label><input type="text" name="downtime" id="input-downtime" placeholder="Terisi otomatis dari Jam Mulai & Jam Selesai" readonly></div>
03602:           <div class="field"><label>Catatan Tambahan
03603:             <button type="button" class="btn-ai-fix" id="btn-ai-fix-catatan" title="Perbaiki typo &amp; ejaan menggunakan AI External"><i class="ph-bold ph-magic-wand"></i> Koreksi AI External</button>
03604:           </label><textarea name="catatan" id="ta-catatan" rows="2" placeholder="Rekomendasi tindak lanjut, kondisi khusus, dll." required></textarea></div>
03605: 
03606:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-paperclip"></i> Lampiran Foto / Video</div>
03607:           <div class="file-drop" id="file-drop">
03608:             <i class="ph-bold ph-upload-simple"></i> Klik atau tarik file ke sini (foto/video bukti pekerjaan) — opsional. Foto otomatis dikompres ke maks. 720px, video ke maks. 540p.
03609:             <input type="file" id="file-input" accept="image/*,video/*" multiple style="display:none;">
03610:           </div>
03611:           <div class="file-preview-row" id="file-preview-row"></div>
03612: 
03613:           <div id="wizard-nav" style="display:none;margin-top:18px;"></div>
03614: 
03615:           <div style="margin-top:22px;display:flex;gap:10px;" id="entry-actions-bar">
03616:             <button type="submit" class="btn btn-primary" id="btn-submit"><i class="ph-bold ph-check-circle"></i> Simpan Logbook</button>
03617:             <button type="reset" class="btn btn-ghost">Bersihkan Form</button>
03618:           </div>
03619:         </form>
03620:       </div>
03621:     </section>
03622: 
03623:     <section class="view" id="view-report">
03624:       <div class="topbar">
03625:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
03626:         <div><h1>Approval Center</h1><div class="sub">Review item yang menunggu keputusan, sekaligus akses report terkait bila dibutuhkan.</div></div>
03627:         <button class="btn btn-sm" id="btn-report-back-cat" style="display:none;"><i class="ph-bold ph-arrow-left"></i> Kembali ke Kategori</button>
03628:       </div>
03629: 
03630:       <div id="report-cat-grid" class="report-cat-grid"></div>
03631: 
03632:       <div id="ipal-form-wrap" style="display:none;"></div>
03633:     </section>
03634: 
03635:     <section class="view" id="view-report-hub">
03636:       <button class="btn btn-sm btn-back-to-input-report" onclick="goToView('report')" style="margin-bottom:10px;"><i class="ph-bold ph-arrow-left"></i> Input Report</button>
03637:       <div class="topbar">
03638:         <div><h1>Riwayat Laporan</h1><div class="sub" id="report-hub-sub">Semua riwayat report — IPAL, RCA &amp; Laporan Proyek — dalam satu tempat, per kategori.</div></div>
03639:         <div style="display:flex;gap:8px;">
03640:           <button class="btn btn-sm" id="btn-report-hub-back-cat" style="display:none;"><i class="ph-bold ph-arrow-left"></i> Kembali ke Kategori</button>
03641:           <button class="btn btn-sm" id="btn-report-hub-refresh"><i class="ph-bold ph-arrows-clockwise"></i> Muat Ulang</button>
03642:         </div>
03643:       </div>
03644: 
03645:       <div id="report-hub-cat-grid" class="report-cat-grid"></div>
03646: 
03647:       <div id="report-hub-detail" style="display:none;">
03648:         <div class="filter-bar" id="report-hub-filterbar" style="display:none;">
~~~

### Around line 28856
~~~text
28844:     if(!ms) return '-';
28845:     try{return new Date(ms).toLocaleString('id-ID',{dateStyle:'medium',timeStyle:'short'});}catch(e){return new Date(ms).toLocaleString();}
28846:   }
28847: 
28848:   function v4Escape(value){
28849:     if(typeof escapeHtml === 'function') return escapeHtml(String(value==null?'':value));
28850:     return String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
28851:   }
28852: 
28853:   function v4Describe(e){
28854:     if(!e) return '-';
28855:     return String(
28856:       e['Deskripsi Pekerjaan'] || e['Deskripsi'] || e['Masalah'] ||
28857:       e['Keterangan'] || e['Jenis Pekerjaan'] || 'Catatan maintenance'
28858:     ).trim();
28859:   }
28860: 
28861:   function v4TodayKey(){
28862:     const d=new Date();
28863:     const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
28864:     return y+'-'+m+'-'+day;
28865:   }
28866: 
28867:   function v4DateKey(e){
28868:     const ms=v4DateValue(e);
28869:     if(!ms) return '';
28870:     const d=new Date(ms);
28871:     const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), day=String(d.getDate()).padStart(2,'0');
28872:     return y+'-'+m+'-'+day;
28873:   }
28874: 
28875:   function v4SparepartPending(){
28876:     try{
28877:       if(typeof sparepartRows !== 'function') return null;
28878:       return sparepartRows().filter(r=>String((r.sap&&r.sap.status)||'PENDING').toUpperCase()!=='COMPLETED').length;
28879:     }catch(e){ return null; }
28880:   }
28881: 
28882:   function v4PatrolCount(){
28883:     try{
28884:       if(typeof PM_REPORTS !== 'undefined' && Array.isArray(PM_REPORTS)) return PM_REPORTS.length;
28885:     }catch(e){}
28886:     return null;
28887:   }
28888: 
28889:   function v4Card(label,value,note,icon){
28890:     return '<div class="v4-card"><div class="v4-k"><i class="ph-bold '+icon+'"></i> '+v4Escape(label)+'</div><div class="v4-v">'+v4Escape(value)+'</div><div class="v4-note">'+v4Escape(note)+'</div></div>';
28891:   }
28892: 
28893:   function v4Row(e){
28894:     const ms=v4DateValue(e);
28895:     const machine=v4MachineName(e);
28896:     const status=v4Status(e) || 'Tanpa status';
28897:     return '<div class="v4-row"><div class="v4-meta">'+v4Escape(machine)+'<br>'+v4Escape(v4FmtDate(ms))+'</div><div class="v4-main">'+v4Escape(v4Describe(e))+'<div><span class="v4-chip">'+v4Escape(status)+'</span></div></div></div>';
28898:   }
28899: 
28900:   function renderOmodos4(){
28901:     if(!v4IsSuperadmin()){
28902:       if(typeof showAccessDenied === 'function') showAccessDenied();
28903:       return false;
28904:     }
28905: 
28906:     const entries=v4Entries();
28907:     const open=entries.filter(e=>!v4IsDone(e));
28908:     const critical=open.filter(v4IsCritical);
28909:     const criticalMachines=new Set(critical.map(v4MachineName).filter(x=>x&&x!=='-'));
28910:     const machines=new Set(entries.map(v4MachineName).filter(x=>x&&x!=='-'));
28911:     const todayKey=v4TodayKey();
28912:     const today=entries.filter(e=>v4DateKey(e)===todayKey);
28913:     const pendingSp=v4SparepartPending();
28914:     const patrolCount=v4PatrolCount();
28915: 
28916:     const summary=document.getElementById('v4-summary');
28917:     if(summary){
28918:       summary.innerHTML=[
28919:         v4Card('Critical Machines',criticalMachines.size,'Mesin dengan catatan aktif yang mengandung sinyal emergency/breakdown.','ph-warning'),
28920:         v4Card('Open Logbook',open.length,'Record Logbook yang belum berstatus selesai/closed.','ph-list-checks'),
~~~

## Nama Material
### Around line 5106
~~~text
05094:         </div>
05095: 
05096:         <div class="filter-bar sp-sticky-filter">
05097:           <input class="grow" type="text" id="search-sparepart" placeholder="Cari material, SAP, mesin, logbook no, WO, PIC...">
05098:           <select id="filter-sparepart-collection" aria-label="Filter status collection">
05099:             <option value="">Semua Collection</option>
05100:             <option value="PENDING">Belum Dicollect</option>
05101:             <option value="COMPLETED">Sudah Dicollect + SAP</option>
05102:           </select>
05103:           <select id="sort-sparepart">
05104:             <option value="date-desc">Tanggal Terbaru</option>
05105:             <option value="date-asc">Tanggal Terlama</option>
05106:             <option value="material-asc">Nama Material A-Z</option>
05107:             <option value="qty-desc">Qty Terbesar</option>
05108:           </select>
05109:           <button class="btn btn-sm" id="btn-refresh-sparepart"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
05110:           <button class="btn btn-sm" id="btn-export-sparepart-collect"><i class="ph-bold ph-file-xls"></i> Export Excel</button>
05111:         </div>
05112: 
05113:         <div class="sp-table-wrap card" style="padding:0;overflow:hidden;">
05114:           <div style="max-width:100%;">
05115:             <table class="sp-collect-table">
05116:               <thead><tr>
05117:                 <th style="width:120px;">Tandai</th>
05118:                 <th>Date</th><th>Logbook No</th><th>Machine</th><th>WO</th><th>PIC</th>
05119:                 <th>Spare Part</th><th>Qty</th><th>Lihat Detail</th>
05120:               </tr></thead>
05121:               <tbody id="sp-collect-tbody"></tbody>
05122:             </table>
05123:           </div>
05124:           <div class="empty-state" id="sp-collect-empty" style="display:none;"><div class="ico"><i class="ph-bold ph-wrench"></i></div>Tidak ada data sparepart yang cocok.</div>
05125:         </div>
05126:         <div class="sp-pagination" id="sp-collect-pagination"></div>
05127:       </div>
05128: 
05129:       <!-- ============ TAB 2: PO MONITORING ============ -->
05130:       <div id="sp-tabPO" class="sp-tab-panel">
05131:         <div class="sp-dash-grid" id="sp-po-dash"></div>
05132: 
05133:         <div class="card" style="margin-bottom:16px;">
05134:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Purchase Order</div>
05135:           <div class="grid2">
05136:             <div class="field"><label>Nama Material / Spare Part</label><input type="text" id="sp-eta-nama" placeholder="Nama material/sparepart"></div>
05137:             <div class="field"><label>Material Number SAP (opsional)</label><input type="text" id="sp-eta-sap" placeholder="Nomor SAP"></div>
05138:             <div class="field"><label>Nomor PO</label><input type="text" id="sp-eta-nopo" placeholder="Nomor Purchase Order"></div>
05139:             <div class="field"><label>Vendor</label><input type="text" id="sp-eta-vendor" placeholder="Nama vendor/supplier"></div>
05140:             <div class="field"><label>Qty PO</label><input type="number" id="sp-eta-qty" min="1" placeholder="1"></div>
05141:             <div class="field"><label>Tanggal Order</label><input type="date" id="sp-eta-tglpo"></div>
05142:             <div class="field"><label>ETA (Estimasi Tiba)</label><input type="date" id="sp-eta-tgletaeta"></div>
05143:             <div class="field" style="grid-column:1/-1;"><label>Catatan (opsional)</label><input type="text" id="sp-eta-catatan" placeholder="Nomor tracking, dsb."></div>
05144:           </div>
05145:           <button type="button" class="btn btn-sm btn-primary" id="btn-add-sparepart-eta" style="margin-top:6px;"><i class="ph-bold ph-plus"></i> Simpan PO</button>
05146:         </div>
05147: 
05148:         <div class="filter-bar sp-sticky-filter">
05149:           <input class="grow" type="text" id="search-sparepart-eta" placeholder="Cari material, SAP, nomor PO, vendor...">
05150:           <select id="filter-sparepart-eta-status">
05151:             <option value="">Semua Status</option>
05152:             <option value="waiting">Waiting</option>
05153:             <option value="intransit">In Transit</option>
05154:             <option value="overdue">Overdue</option>
05155:             <option value="arrived">Arrived</option>
05156:             <option value="warehouse">Warehouse</option>
05157:           </select>
05158:           <button class="btn btn-sm" id="btn-export-sparepart-po"><i class="ph-bold ph-file-xls"></i> Export Excel</button>
05159:         </div>
05160:         <div id="list-sparepart-eta"></div>
05161:       </div>
05162: 
05163:       <!-- ============ TAB 3: WAREHOUSE VALIDATION ============ -->
05164:       <div id="sp-tabWarehouse" class="sp-tab-panel">
05165:         <div class="card" style="margin-bottom:16px;">
05166:           <div class="section-title"><i class="ph-bold ph-warehouse"></i> Validasi PO yang Sudah Arrived</div>
05167:           <div class="sub">Hanya menampilkan PO berstatus <b>Arrived</b> yang belum divalidasi. Setelah divalidasi, status PO otomatis berubah menjadi <b>Warehouse</b>.</div>
05168:         </div>
05169:         <div class="filter-bar sp-sticky-filter">
05170:           <input class="grow" type="text" id="search-sparepart-warehouse" placeholder="Cari material, SAP, nomor PO...">
~~~

### Around line 5136
~~~text
05124:           <div class="empty-state" id="sp-collect-empty" style="display:none;"><div class="ico"><i class="ph-bold ph-wrench"></i></div>Tidak ada data sparepart yang cocok.</div>
05125:         </div>
05126:         <div class="sp-pagination" id="sp-collect-pagination"></div>
05127:       </div>
05128: 
05129:       <!-- ============ TAB 2: PO MONITORING ============ -->
05130:       <div id="sp-tabPO" class="sp-tab-panel">
05131:         <div class="sp-dash-grid" id="sp-po-dash"></div>
05132: 
05133:         <div class="card" style="margin-bottom:16px;">
05134:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Purchase Order</div>
05135:           <div class="grid2">
05136:             <div class="field"><label>Nama Material / Spare Part</label><input type="text" id="sp-eta-nama" placeholder="Nama material/sparepart"></div>
05137:             <div class="field"><label>Material Number SAP (opsional)</label><input type="text" id="sp-eta-sap" placeholder="Nomor SAP"></div>
05138:             <div class="field"><label>Nomor PO</label><input type="text" id="sp-eta-nopo" placeholder="Nomor Purchase Order"></div>
05139:             <div class="field"><label>Vendor</label><input type="text" id="sp-eta-vendor" placeholder="Nama vendor/supplier"></div>
05140:             <div class="field"><label>Qty PO</label><input type="number" id="sp-eta-qty" min="1" placeholder="1"></div>
05141:             <div class="field"><label>Tanggal Order</label><input type="date" id="sp-eta-tglpo"></div>
05142:             <div class="field"><label>ETA (Estimasi Tiba)</label><input type="date" id="sp-eta-tgletaeta"></div>
05143:             <div class="field" style="grid-column:1/-1;"><label>Catatan (opsional)</label><input type="text" id="sp-eta-catatan" placeholder="Nomor tracking, dsb."></div>
05144:           </div>
05145:           <button type="button" class="btn btn-sm btn-primary" id="btn-add-sparepart-eta" style="margin-top:6px;"><i class="ph-bold ph-plus"></i> Simpan PO</button>
05146:         </div>
05147: 
05148:         <div class="filter-bar sp-sticky-filter">
05149:           <input class="grow" type="text" id="search-sparepart-eta" placeholder="Cari material, SAP, nomor PO, vendor...">
05150:           <select id="filter-sparepart-eta-status">
05151:             <option value="">Semua Status</option>
05152:             <option value="waiting">Waiting</option>
05153:             <option value="intransit">In Transit</option>
05154:             <option value="overdue">Overdue</option>
05155:             <option value="arrived">Arrived</option>
05156:             <option value="warehouse">Warehouse</option>
05157:           </select>
05158:           <button class="btn btn-sm" id="btn-export-sparepart-po"><i class="ph-bold ph-file-xls"></i> Export Excel</button>
05159:         </div>
05160:         <div id="list-sparepart-eta"></div>
05161:       </div>
05162: 
05163:       <!-- ============ TAB 3: WAREHOUSE VALIDATION ============ -->
05164:       <div id="sp-tabWarehouse" class="sp-tab-panel">
05165:         <div class="card" style="margin-bottom:16px;">
05166:           <div class="section-title"><i class="ph-bold ph-warehouse"></i> Validasi PO yang Sudah Arrived</div>
05167:           <div class="sub">Hanya menampilkan PO berstatus <b>Arrived</b> yang belum divalidasi. Setelah divalidasi, status PO otomatis berubah menjadi <b>Warehouse</b>.</div>
05168:         </div>
05169:         <div class="filter-bar sp-sticky-filter">
05170:           <input class="grow" type="text" id="search-sparepart-warehouse" placeholder="Cari material, SAP, nomor PO...">
05171:         </div>
05172:         <div id="list-sparepart-warehouse"></div>
05173:       </div>
05174: 
05175:       <!-- ============ TAB 4: DAILY STOCK OPNAME ============ -->
05176:       <div id="sp-tabOpname" class="sp-tab-panel">
05177:         <div class="card sp-target-banner" id="sp-target-banner" style="margin-bottom:16px;">
05178:           <div class="sp-target-top">
05179:             <div><i class="ph-bold ph-target"></i> Target Harian Stock Opname</div>
05180:             <div class="sp-target-num" id="sp-target-num">0 / 30 item</div>
05181:           </div>
05182:           <div class="hmi-bar"><div class="fill" id="sp-target-fill" style="width:0%;"></div></div>
05183:           <div class="sp-target-sub" id="sp-target-sub">Belum ada item yang di-opname hari ini.</div>
05184:         </div>
05185: 
05186:         <div class="sp-dash-grid" id="sp-opname-dash"></div>
05187: 
05188:         <div class="card" style="margin-bottom:16px;">
05189:           <div class="section-title"><i class="ph-bold ph-list-checks"></i> Checklist Opname Hari Ini</div>
05190:           <div class="sub" style="margin-bottom:10px;">Dibuat otomatis dari master Lokasi Sparepart (menu Setting), 20–30 item per hari agar seluruh rak tercover bertahap. Klik salah satu item untuk mengisi hasil hitung fisik.</div>
05191:           <div id="sp-opname-checklist"></div>
05192:         </div>
05193: 
05194:         <div class="card" style="margin-bottom:16px;">
05195:           <div class="section-title"><i class="ph-bold ph-clipboard-text"></i> Input Manual Hasil Opname</div>
05196:           <div class="grid2">
05197:             <div class="field"><label>Part No (opsional)</label><input type="text" id="sp-opname-partno" placeholder="Part number internal"></div>
05198:             <div class="field"><label>Nama Material</label><input type="text" id="sp-opname-nama" placeholder="Nama material/sparepart"></div>
05199:             <div class="field"><label>Material Number SAP (opsional)</label><input type="text" id="sp-opname-sap" placeholder="Nomor SAP"></div>
05200:             <div class="field"><label>SAP Stock (opsional, auto kalau SAP cocok)</label><input type="number" id="sp-opname-sistem" placeholder="0"></div>
~~~

### Around line 5198
~~~text
05186:         <div class="sp-dash-grid" id="sp-opname-dash"></div>
05187: 
05188:         <div class="card" style="margin-bottom:16px;">
05189:           <div class="section-title"><i class="ph-bold ph-list-checks"></i> Checklist Opname Hari Ini</div>
05190:           <div class="sub" style="margin-bottom:10px;">Dibuat otomatis dari master Lokasi Sparepart (menu Setting), 20–30 item per hari agar seluruh rak tercover bertahap. Klik salah satu item untuk mengisi hasil hitung fisik.</div>
05191:           <div id="sp-opname-checklist"></div>
05192:         </div>
05193: 
05194:         <div class="card" style="margin-bottom:16px;">
05195:           <div class="section-title"><i class="ph-bold ph-clipboard-text"></i> Input Manual Hasil Opname</div>
05196:           <div class="grid2">
05197:             <div class="field"><label>Part No (opsional)</label><input type="text" id="sp-opname-partno" placeholder="Part number internal"></div>
05198:             <div class="field"><label>Nama Material</label><input type="text" id="sp-opname-nama" placeholder="Nama material/sparepart"></div>
05199:             <div class="field"><label>Material Number SAP (opsional)</label><input type="text" id="sp-opname-sap" placeholder="Nomor SAP"></div>
05200:             <div class="field"><label>SAP Stock (opsional, auto kalau SAP cocok)</label><input type="number" id="sp-opname-sistem" placeholder="0"></div>
05201:             <div class="field"><label>Physical Stock (hasil hitung)</label><input type="number" id="sp-opname-fisik" placeholder="0"></div>
05202:             <div class="field"><label>Lokasi Rak (opsional)</label><input type="text" id="sp-opname-lokasi" placeholder="mis. Rak A-3"></div>
05203:             <div class="field" style="grid-column:1/-1;"><label>Catatan (opsional)</label><input type="text" id="sp-opname-catatan" placeholder="Kondisi barang, alasan selisih, dsb."></div>
05204:           </div>
05205:           <button type="button" class="btn btn-sm btn-primary" id="btn-add-sparepart-opname" style="margin-top:6px;"><i class="ph-bold ph-plus"></i> Simpan Hasil Opname</button>
05206:         </div>
05207: 
05208:         <div class="filter-bar sp-sticky-filter">
05209:           <input class="grow" type="text" id="search-sparepart-opname" placeholder="Cari part no, nama material, SAP, lokasi rak...">
05210:           <select id="filter-sparepart-opname-scope">
05211:             <option value="today">Hari Ini</option>
05212:             <option value="all">Semua Riwayat</option>
05213:           </select>
05214:           <button class="btn btn-sm" id="btn-export-sparepart-opname"><i class="ph-bold ph-file-xls"></i> Export Excel</button>
05215:         </div>
05216:         <div id="list-sparepart-opname"></div>
05217:       </div>
05218: 
05219:       <!-- ============ TAB 5: MASTER SPAREPART (dipindah dari Master Koneksi) ============ -->
05220:       <div id="sp-tabMaster" class="sp-tab-panel">
05221:         <div class="card" style="margin-bottom:18px;">
05222:           <div class="section-title"><i class="ph-bold ph-map-pin"></i> Master Sparepart — Lokasi, Harga &amp; Stock Gudang</div>
05223:           <div class="sub" style="margin-bottom:12px;">
05224:             Satu data master per Material Number SAP dipakai bersama oleh SELURUH fitur yang berhubungan dengan sparepart:
05225:             kartu ringkasan &amp; grafik cost di menu Sparepart, kartu lokasi rak yang otomatis dicocokkan dari form input Logbook,
05226:             dan Stock Sistem di checklist Stock Opname. Cukup diisi/diedit di satu tempat ini.
05227:             <br>Sebelumnya ada di menu Master Koneksi, sekarang dipindah ke sini supaya 1 tempat dengan Daily Collection &amp; PO Monitoring.
05228:           </div>
05229:           <div class="grid3">
05230:             <div class="field"><label>Material Number SAP</label><input type="text" id="sl-sap" placeholder="1000234567"></div>
05231:             <div class="field"><label>Nama Material</label><input type="text" id="sl-nama" placeholder="Bearing 6205"></div>
05232:             <div class="field"><label>Lokasi Gudang/Rak</label><input type="text" id="sl-lokasi" placeholder="Gudang A - Rak 3B"></div>
05233:           </div>
05234:           <div class="grid3">
05235:             <div class="field"><label>Harga Satuan (Rp)</label><input type="number" id="sl-harga" min="0" step="100" placeholder="0"></div>
05236:             <div class="field"><label>Stock Qty</label><input type="number" id="sl-stock" min="0" step="1" placeholder="0"></div>
05237:             <div class="field"><label>Satuan</label><input type="text" id="sl-satuan" placeholder="cth: pcs, unit, set"></div>
05238:           </div>
05239:           <button class="btn btn-sm" id="btn-save-sparepart-lokasi">+ Simpan Data Sparepart</button>
05240:           <button class="btn btn-sm" id="btn-cancel-edit-sparepart-lokasi" style="display:none;">Batal Edit</button>
05241:           <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
05242:             <div class="field" style="flex:1 1 280px;margin:0;">
05243:               <label for="search-master-sparepart">Cari Sparepart</label>
05244:               <div style="position:relative;">
05245:                 <i class="ph-bold ph-magnifying-glass" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
05246:                 <input type="search" id="search-master-sparepart" placeholder="Cari Nama Material atau Material Number SAP..." autocomplete="off" style="padding-left:36px;">
05247:               </div>
05248:             </div>
05249:             <button type="button" class="btn btn-sm" id="btn-reset-master-sparepart-search" style="margin-top:18px;"><i class="ph-bold ph-x"></i> Reset</button>
05250:           </div>
05251:           <div id="master-sparepart-search-info" style="font-size:12px;color:var(--text-dim);margin-top:6px;"></div>
05252:           <div style="margin-top:10px;" id="sparepart-lokasi-table"></div>
05253:         </div>
05254:       </div>
05255:     </section>
05256: 
05257:     <section class="view" id="view-expert-finder">
05258:       <div class="topbar">
05259:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05260:         <div><h1>People Intelligence</h1><div class="sub">Ranking personil paling berpengalaman, dihitung otomatis dari histori Logbook (Nama Pelapor, Status, Jenis Pekerjaan) yang sudah tersimpan — tidak ada data baru yang perlu diisi.</div></div>
05261:         <div class="stat-strip" id="ef-stat-strip"></div>
05262:       </div>
~~~

### Around line 5209
~~~text
05197:             <div class="field"><label>Part No (opsional)</label><input type="text" id="sp-opname-partno" placeholder="Part number internal"></div>
05198:             <div class="field"><label>Nama Material</label><input type="text" id="sp-opname-nama" placeholder="Nama material/sparepart"></div>
05199:             <div class="field"><label>Material Number SAP (opsional)</label><input type="text" id="sp-opname-sap" placeholder="Nomor SAP"></div>
05200:             <div class="field"><label>SAP Stock (opsional, auto kalau SAP cocok)</label><input type="number" id="sp-opname-sistem" placeholder="0"></div>
05201:             <div class="field"><label>Physical Stock (hasil hitung)</label><input type="number" id="sp-opname-fisik" placeholder="0"></div>
05202:             <div class="field"><label>Lokasi Rak (opsional)</label><input type="text" id="sp-opname-lokasi" placeholder="mis. Rak A-3"></div>
05203:             <div class="field" style="grid-column:1/-1;"><label>Catatan (opsional)</label><input type="text" id="sp-opname-catatan" placeholder="Kondisi barang, alasan selisih, dsb."></div>
05204:           </div>
05205:           <button type="button" class="btn btn-sm btn-primary" id="btn-add-sparepart-opname" style="margin-top:6px;"><i class="ph-bold ph-plus"></i> Simpan Hasil Opname</button>
05206:         </div>
05207: 
05208:         <div class="filter-bar sp-sticky-filter">
05209:           <input class="grow" type="text" id="search-sparepart-opname" placeholder="Cari part no, nama material, SAP, lokasi rak...">
05210:           <select id="filter-sparepart-opname-scope">
05211:             <option value="today">Hari Ini</option>
05212:             <option value="all">Semua Riwayat</option>
05213:           </select>
05214:           <button class="btn btn-sm" id="btn-export-sparepart-opname"><i class="ph-bold ph-file-xls"></i> Export Excel</button>
05215:         </div>
05216:         <div id="list-sparepart-opname"></div>
05217:       </div>
05218: 
05219:       <!-- ============ TAB 5: MASTER SPAREPART (dipindah dari Master Koneksi) ============ -->
05220:       <div id="sp-tabMaster" class="sp-tab-panel">
05221:         <div class="card" style="margin-bottom:18px;">
05222:           <div class="section-title"><i class="ph-bold ph-map-pin"></i> Master Sparepart — Lokasi, Harga &amp; Stock Gudang</div>
05223:           <div class="sub" style="margin-bottom:12px;">
05224:             Satu data master per Material Number SAP dipakai bersama oleh SELURUH fitur yang berhubungan dengan sparepart:
05225:             kartu ringkasan &amp; grafik cost di menu Sparepart, kartu lokasi rak yang otomatis dicocokkan dari form input Logbook,
05226:             dan Stock Sistem di checklist Stock Opname. Cukup diisi/diedit di satu tempat ini.
05227:             <br>Sebelumnya ada di menu Master Koneksi, sekarang dipindah ke sini supaya 1 tempat dengan Daily Collection &amp; PO Monitoring.
05228:           </div>
05229:           <div class="grid3">
05230:             <div class="field"><label>Material Number SAP</label><input type="text" id="sl-sap" placeholder="1000234567"></div>
05231:             <div class="field"><label>Nama Material</label><input type="text" id="sl-nama" placeholder="Bearing 6205"></div>
05232:             <div class="field"><label>Lokasi Gudang/Rak</label><input type="text" id="sl-lokasi" placeholder="Gudang A - Rak 3B"></div>
05233:           </div>
05234:           <div class="grid3">
05235:             <div class="field"><label>Harga Satuan (Rp)</label><input type="number" id="sl-harga" min="0" step="100" placeholder="0"></div>
05236:             <div class="field"><label>Stock Qty</label><input type="number" id="sl-stock" min="0" step="1" placeholder="0"></div>
05237:             <div class="field"><label>Satuan</label><input type="text" id="sl-satuan" placeholder="cth: pcs, unit, set"></div>
05238:           </div>
05239:           <button class="btn btn-sm" id="btn-save-sparepart-lokasi">+ Simpan Data Sparepart</button>
05240:           <button class="btn btn-sm" id="btn-cancel-edit-sparepart-lokasi" style="display:none;">Batal Edit</button>
05241:           <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
05242:             <div class="field" style="flex:1 1 280px;margin:0;">
05243:               <label for="search-master-sparepart">Cari Sparepart</label>
05244:               <div style="position:relative;">
05245:                 <i class="ph-bold ph-magnifying-glass" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
05246:                 <input type="search" id="search-master-sparepart" placeholder="Cari Nama Material atau Material Number SAP..." autocomplete="off" style="padding-left:36px;">
05247:               </div>
05248:             </div>
05249:             <button type="button" class="btn btn-sm" id="btn-reset-master-sparepart-search" style="margin-top:18px;"><i class="ph-bold ph-x"></i> Reset</button>
05250:           </div>
05251:           <div id="master-sparepart-search-info" style="font-size:12px;color:var(--text-dim);margin-top:6px;"></div>
05252:           <div style="margin-top:10px;" id="sparepart-lokasi-table"></div>
05253:         </div>
05254:       </div>
05255:     </section>
05256: 
05257:     <section class="view" id="view-expert-finder">
05258:       <div class="topbar">
05259:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05260:         <div><h1>People Intelligence</h1><div class="sub">Ranking personil paling berpengalaman, dihitung otomatis dari histori Logbook (Nama Pelapor, Status, Jenis Pekerjaan) yang sudah tersimpan — tidak ada data baru yang perlu diisi.</div></div>
05261:         <div class="stat-strip" id="ef-stat-strip"></div>
05262:       </div>
05263:       <div class="filter-bar">
05264:         <input class="grow" type="text" id="search-expert-nama" placeholder="Cari nama personil...">
05265:         <input class="grow" type="text" id="search-expert-konteks" placeholder="Ranking khusus untuk mesin/masalah tertentu (mis. nama mesin, kode mesin, atau kata kunci masalah)...">
05266:         <button class="btn btn-sm" id="btn-reset-expert-konteks"><i class="ph-bold ph-x"></i> Reset Konteks</button>
05267:       </div>
05268:       <div class="sub" id="ef-konteks-info" style="margin:-6px 0 14px 2px;"></div>
05269:       <div id="list-expert-finder"></div>
05270:     </section>
05271: 
05272:     <section class="view" id="view-knowledge-graph">
05273:       <div class="topbar">
~~~

### Around line 5231
~~~text
05219:       <!-- ============ TAB 5: MASTER SPAREPART (dipindah dari Master Koneksi) ============ -->
05220:       <div id="sp-tabMaster" class="sp-tab-panel">
05221:         <div class="card" style="margin-bottom:18px;">
05222:           <div class="section-title"><i class="ph-bold ph-map-pin"></i> Master Sparepart — Lokasi, Harga &amp; Stock Gudang</div>
05223:           <div class="sub" style="margin-bottom:12px;">
05224:             Satu data master per Material Number SAP dipakai bersama oleh SELURUH fitur yang berhubungan dengan sparepart:
05225:             kartu ringkasan &amp; grafik cost di menu Sparepart, kartu lokasi rak yang otomatis dicocokkan dari form input Logbook,
05226:             dan Stock Sistem di checklist Stock Opname. Cukup diisi/diedit di satu tempat ini.
05227:             <br>Sebelumnya ada di menu Master Koneksi, sekarang dipindah ke sini supaya 1 tempat dengan Daily Collection &amp; PO Monitoring.
05228:           </div>
05229:           <div class="grid3">
05230:             <div class="field"><label>Material Number SAP</label><input type="text" id="sl-sap" placeholder="1000234567"></div>
05231:             <div class="field"><label>Nama Material</label><input type="text" id="sl-nama" placeholder="Bearing 6205"></div>
05232:             <div class="field"><label>Lokasi Gudang/Rak</label><input type="text" id="sl-lokasi" placeholder="Gudang A - Rak 3B"></div>
05233:           </div>
05234:           <div class="grid3">
05235:             <div class="field"><label>Harga Satuan (Rp)</label><input type="number" id="sl-harga" min="0" step="100" placeholder="0"></div>
05236:             <div class="field"><label>Stock Qty</label><input type="number" id="sl-stock" min="0" step="1" placeholder="0"></div>
05237:             <div class="field"><label>Satuan</label><input type="text" id="sl-satuan" placeholder="cth: pcs, unit, set"></div>
05238:           </div>
05239:           <button class="btn btn-sm" id="btn-save-sparepart-lokasi">+ Simpan Data Sparepart</button>
05240:           <button class="btn btn-sm" id="btn-cancel-edit-sparepart-lokasi" style="display:none;">Batal Edit</button>
05241:           <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
05242:             <div class="field" style="flex:1 1 280px;margin:0;">
05243:               <label for="search-master-sparepart">Cari Sparepart</label>
05244:               <div style="position:relative;">
05245:                 <i class="ph-bold ph-magnifying-glass" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
05246:                 <input type="search" id="search-master-sparepart" placeholder="Cari Nama Material atau Material Number SAP..." autocomplete="off" style="padding-left:36px;">
05247:               </div>
05248:             </div>
05249:             <button type="button" class="btn btn-sm" id="btn-reset-master-sparepart-search" style="margin-top:18px;"><i class="ph-bold ph-x"></i> Reset</button>
05250:           </div>
05251:           <div id="master-sparepart-search-info" style="font-size:12px;color:var(--text-dim);margin-top:6px;"></div>
05252:           <div style="margin-top:10px;" id="sparepart-lokasi-table"></div>
05253:         </div>
05254:       </div>
05255:     </section>
05256: 
05257:     <section class="view" id="view-expert-finder">
05258:       <div class="topbar">
05259:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05260:         <div><h1>People Intelligence</h1><div class="sub">Ranking personil paling berpengalaman, dihitung otomatis dari histori Logbook (Nama Pelapor, Status, Jenis Pekerjaan) yang sudah tersimpan — tidak ada data baru yang perlu diisi.</div></div>
05261:         <div class="stat-strip" id="ef-stat-strip"></div>
05262:       </div>
05263:       <div class="filter-bar">
05264:         <input class="grow" type="text" id="search-expert-nama" placeholder="Cari nama personil...">
05265:         <input class="grow" type="text" id="search-expert-konteks" placeholder="Ranking khusus untuk mesin/masalah tertentu (mis. nama mesin, kode mesin, atau kata kunci masalah)...">
05266:         <button class="btn btn-sm" id="btn-reset-expert-konteks"><i class="ph-bold ph-x"></i> Reset Konteks</button>
05267:       </div>
05268:       <div class="sub" id="ef-konteks-info" style="margin:-6px 0 14px 2px;"></div>
05269:       <div id="list-expert-finder"></div>
05270:     </section>
05271: 
05272:     <section class="view" id="view-knowledge-graph">
05273:       <div class="topbar">
05274:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05275:         <div><h1>Knowledge Graph</h1><div class="sub">Visualisasi hubungan antar Personil, Mesin, Sparepart/SAP, dan Masalah — dibangun otomatis dari data Logbook yang sudah ada (vis-network). Klik node untuk detail, drag untuk atur posisi, scroll untuk zoom.</div></div>
05276:         <div class="stat-strip" id="kg-stat-strip"></div>
05277:       </div>
05278:       <div class="filter-bar">
05279:         <input class="grow" type="text" id="search-kg" placeholder="Cari & sorot node (nama personil, mesin, sparepart, kata kunci masalah)...">
05280:         <select id="filter-kg-type">
05281:           <option value="">Semua Tipe Node</option>
05282:           <option value="personil">Personil</option>
05283:           <option value="mesin">Mesin</option>
05284:           <option value="sparepart">Sparepart</option>
05285:           <option value="masalah">Masalah</option>
05286:         </select>
05287:         <button class="btn btn-sm" id="btn-kg-reset-view"><i class="ph-bold ph-arrows-out-cardinal"></i> Reset Tampilan</button>
05288:       </div>
05289:       <div class="card" style="padding:0;overflow:hidden;">
05290:         <div id="kg-network" style="width:100%;height:70vh;background:var(--panel-2);"></div>
05291:       </div>
05292:       <div class="card" id="kg-node-detail" style="margin-top:16px;display:none;"></div>
05293:     </section>
05294: 
05295:     <section class="view" id="view-wiki">
~~~

### Around line 5246
~~~text
05234:           <div class="grid3">
05235:             <div class="field"><label>Harga Satuan (Rp)</label><input type="number" id="sl-harga" min="0" step="100" placeholder="0"></div>
05236:             <div class="field"><label>Stock Qty</label><input type="number" id="sl-stock" min="0" step="1" placeholder="0"></div>
05237:             <div class="field"><label>Satuan</label><input type="text" id="sl-satuan" placeholder="cth: pcs, unit, set"></div>
05238:           </div>
05239:           <button class="btn btn-sm" id="btn-save-sparepart-lokasi">+ Simpan Data Sparepart</button>
05240:           <button class="btn btn-sm" id="btn-cancel-edit-sparepart-lokasi" style="display:none;">Batal Edit</button>
05241:           <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
05242:             <div class="field" style="flex:1 1 280px;margin:0;">
05243:               <label for="search-master-sparepart">Cari Sparepart</label>
05244:               <div style="position:relative;">
05245:                 <i class="ph-bold ph-magnifying-glass" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
05246:                 <input type="search" id="search-master-sparepart" placeholder="Cari Nama Material atau Material Number SAP..." autocomplete="off" style="padding-left:36px;">
05247:               </div>
05248:             </div>
05249:             <button type="button" class="btn btn-sm" id="btn-reset-master-sparepart-search" style="margin-top:18px;"><i class="ph-bold ph-x"></i> Reset</button>
05250:           </div>
05251:           <div id="master-sparepart-search-info" style="font-size:12px;color:var(--text-dim);margin-top:6px;"></div>
05252:           <div style="margin-top:10px;" id="sparepart-lokasi-table"></div>
05253:         </div>
05254:       </div>
05255:     </section>
05256: 
05257:     <section class="view" id="view-expert-finder">
05258:       <div class="topbar">
05259:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05260:         <div><h1>People Intelligence</h1><div class="sub">Ranking personil paling berpengalaman, dihitung otomatis dari histori Logbook (Nama Pelapor, Status, Jenis Pekerjaan) yang sudah tersimpan — tidak ada data baru yang perlu diisi.</div></div>
05261:         <div class="stat-strip" id="ef-stat-strip"></div>
05262:       </div>
05263:       <div class="filter-bar">
05264:         <input class="grow" type="text" id="search-expert-nama" placeholder="Cari nama personil...">
05265:         <input class="grow" type="text" id="search-expert-konteks" placeholder="Ranking khusus untuk mesin/masalah tertentu (mis. nama mesin, kode mesin, atau kata kunci masalah)...">
05266:         <button class="btn btn-sm" id="btn-reset-expert-konteks"><i class="ph-bold ph-x"></i> Reset Konteks</button>
05267:       </div>
05268:       <div class="sub" id="ef-konteks-info" style="margin:-6px 0 14px 2px;"></div>
05269:       <div id="list-expert-finder"></div>
05270:     </section>
05271: 
05272:     <section class="view" id="view-knowledge-graph">
05273:       <div class="topbar">
05274:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05275:         <div><h1>Knowledge Graph</h1><div class="sub">Visualisasi hubungan antar Personil, Mesin, Sparepart/SAP, dan Masalah — dibangun otomatis dari data Logbook yang sudah ada (vis-network). Klik node untuk detail, drag untuk atur posisi, scroll untuk zoom.</div></div>
05276:         <div class="stat-strip" id="kg-stat-strip"></div>
05277:       </div>
05278:       <div class="filter-bar">
05279:         <input class="grow" type="text" id="search-kg" placeholder="Cari & sorot node (nama personil, mesin, sparepart, kata kunci masalah)...">
05280:         <select id="filter-kg-type">
05281:           <option value="">Semua Tipe Node</option>
05282:           <option value="personil">Personil</option>
05283:           <option value="mesin">Mesin</option>
05284:           <option value="sparepart">Sparepart</option>
05285:           <option value="masalah">Masalah</option>
05286:         </select>
05287:         <button class="btn btn-sm" id="btn-kg-reset-view"><i class="ph-bold ph-arrows-out-cardinal"></i> Reset Tampilan</button>
05288:       </div>
05289:       <div class="card" style="padding:0;overflow:hidden;">
05290:         <div id="kg-network" style="width:100%;height:70vh;background:var(--panel-2);"></div>
05291:       </div>
05292:       <div class="card" id="kg-node-detail" style="margin-top:16px;display:none;"></div>
05293:     </section>
05294: 
05295:     <section class="view" id="view-wiki">
05296:       <style>
05297:         .wiki-group-list{display:grid;gap:8px;margin-top:8px;}
05298:         .wiki-group-card{border:1px solid var(--line);border-radius:10px;background:var(--panel-2);overflow:hidden;}
05299:         .wiki-group-card>summary{cursor:pointer;list-style:none;padding:10px 12px;display:flex;justify-content:space-between;gap:10px;align-items:center;font-weight:700;}
05300:         .wiki-group-card>summary::-webkit-details-marker{display:none;}
05301:         .wiki-group-content{padding:10px 12px;border-top:1px solid var(--line-soft);}
05302:         .wiki-group-count{font-size:10.5px;color:var(--text-dim);font-weight:500;}
05303:       </style>
05304:       <div class="topbar">
05305:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05306:         <div><h1>Maintenance Wikipedia</h1><div class="sub">Semua data Mesin, Sparepart, Personil, dsb saling terhubung — klik nama di halaman mana pun untuk berpindah ke halaman terkait, seperti Wikipedia. Data diambil langsung dari Logbook &amp; Master yang sudah ada, otomatis sinkron.</div></div>
05307:       </div>
05308:       <div class="filter-bar">
05309:         <button class="btn btn-sm" id="btn-wiki-back" disabled><i class="ph-bold ph-arrow-left"></i> Kembali</button>
05310:         <input class="grow" type="text" id="search-wiki" placeholder="Cari mesin, sparepart, atau personil...">
~~~

### Around line 12763
~~~text
12751: let SPAREPART_LOKASI_EDIT_NAME = null;
12752: 
12753: function loadSparepartLokasiLocal(){ try{ return JSON.parse(localStorage.getItem(LS_SPAREPART_LOKASI_KEY)||'[]'); }catch(e){ return []; } }
12754: function saveSparepartLokasiLocal(list){ localStorage.setItem(LS_SPAREPART_LOKASI_KEY, JSON.stringify(list)); SPAREPART_LOKASI = list; }
12755: async function syncSparepartLokasiFromBackend(){
12756:   SPAREPART_LOKASI = loadSparepartLokasiLocal();
12757:   if(!WEB_APP_URL) return SPAREPART_LOKASI;
12758:   try{
12759:     const remote = await apiGet('sparepartLokasi');
12760:     if(Array.isArray(remote)){
12761:       const normalized = remote.map(r=>({
12762:         sap: String(r['Material Number SAP']||'').trim(),
12763:         nama: r['Nama Material']||'',
12764:         lokasiGudang: r['Lokasi Gudang']||'',
12765:         harga: Number(r['Harga Satuan']) || 0,
12766:         stockQty: (r['Stock Qty']===''||r['Stock Qty']==null) ? null : Number(r['Stock Qty']),
12767:         satuan: r['Satuan']||'',
12768:         needsReview: r['Perlu Verifikasi']===true || String(r['Perlu Verifikasi']).toLowerCase()==='true',
12769:         sourceLogbook: r['Sumber Logbook']||''
12770:       }));
12771:       saveSparepartLokasiLocal(normalized);
12772:     }
12773:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12774:   return SPAREPART_LOKASI;
12775: }
12776: function findSparepartLokasiBySap(sap){
12777:   const s = String(sap||'').trim();
12778:   if(!s) return null;
12779:   return SPAREPART_LOKASI.find(x=> x.sap === s) || null;
12780: }
12781: // [EDIT] Menggantikan findStockSistemBySap yang dulu baca dari STOCK_SPAREPART
12782: // (sheet Stock_Sparepart terpisah, perlu tombol "Muat Ulang Stock" manual) --
12783: // sekarang Stock Qty adalah bagian dari master SPAREPART_LOKASI yang sama,
12784: // jadi otomatis tersedia begitu SPAREPART_LOKASI sudah dimuat (loadAll),
12785: // tanpa perlu langkah muat ulang terpisah.
12786: function findStockSistemBySap(sap){
12787:   const r = findSparepartLokasiBySap(sap);
12788:   return (r && r.stockQty != null) ? r.stockQty : null;
12789: }
12790: function resetSparepartLokasiForm(){
12791:   SPAREPART_LOKASI_EDIT_SAP = null;
12792:   SPAREPART_LOKASI_EDIT_NAME = null;
12793:   $('#sl-sap').value=''; $('#sl-nama').value=''; $('#sl-lokasi').value=''; $('#sl-harga').value='';
12794:   const stockEl = $('#sl-stock'), satuanEl = $('#sl-satuan');
12795:   if(stockEl) stockEl.value=''; if(satuanEl) satuanEl.value='';
12796:   $('#btn-save-sparepart-lokasi').innerHTML = '+ Simpan Data Sparepart';
12797:   $('#btn-cancel-edit-sparepart-lokasi').style.display = 'none';
12798: }
12799: let SPAREPART_LOKASI_SEARCH = '';
12800: function renderSparepartLokasiTable(){
12801:   const holder = $('#sparepart-lokasi-table');
12802:   if(!holder) return;
12803:   const q = String(SPAREPART_LOKASI_SEARCH||'').trim().toLowerCase();
12804:   const rows = !q ? SPAREPART_LOKASI : SPAREPART_LOKASI.filter(r=>
12805:     String(r.nama||'').toLowerCase().includes(q) || String(r.sap||'').toLowerCase().includes(q)
12806:   );
12807:   const info = $('#master-sparepart-search-info');
12808:   if(info) info.textContent = q ? `${rows.length} dari ${SPAREPART_LOKASI.length} sparepart ditemukan` : `${SPAREPART_LOKASI.length} sparepart tersedia`;
12809:   if(!SPAREPART_LOKASI.length){ holder.innerHTML = `<div style="color:var(--text-dim);font-size:13px;">Belum ada data sparepart.</div>`; return; }
12810:   if(!rows.length){ holder.innerHTML = `<div class="empty-state" style="padding:18px;"><div class="ico"><i class="ph-bold ph-magnifying-glass"></i></div>Tidak ada sparepart yang cocok dengan pencarian.</div>`; return; }
12811:   holder.innerHTML = `<div class="sp-master-list">
12812:     ${rows.map(r=>`
12813:       <div class="sp-master-row">
12814:         <div class="sp-master-sap" data-label="Material Number SAP">${escapeHtml(r.sap)}</div>
12815:         <div class="sp-master-name" data-label="Nama Material">${escapeHtml(r.nama||'-')}</div>
12816:         <div class="sp-master-location" data-label="Lokasi">${escapeHtml(r.lokasiGudang||'-')}</div>
12817:         <div class="sp-master-price" data-label="Harga">Rp${Number(r.harga||0).toLocaleString('id-ID')}</div>
12818:         <div class="sp-master-stock" data-label="Stock">${r.stockQty!=null ? r.stockQty : '-'} ${escapeHtml(r.satuan||'')}</div>
12819:         <div class="sp-master-actions" data-label="Aksi">
12820:           <button type="button" class="btn btn-sm sl-edit" data-sap="${escapeHtml(r.sap)}" data-name="${escapeHtml(r.nama)}" title="Edit"><i class="ph-bold ph-pencil-simple"></i></button>
12821:           <button type="button" class="btn btn-sm btn-danger sl-delete" data-sap="${escapeHtml(r.sap)}" ${r.sap?'':'disabled'} title="${r.sap?'Hapus':'Lengkapi nomor SAP sebelum menghapus'}"><i class="ph-bold ph-trash"></i></button>
12822:         </div>
12823:       </div>`).join('')}
12824:   </div>`;
12825:   $$('.sl-edit', holder).forEach(btn=> btn.addEventListener('click', ()=>{
12826:     const r = SPAREPART_LOKASI.find(x=>btn.dataset.sap ? x.sap===btn.dataset.sap : x.nama===btn.dataset.name); if(!r) return;
12827:     SPAREPART_LOKASI_EDIT_SAP = r.sap;
~~~

### Around line 12815
~~~text
12803:   const q = String(SPAREPART_LOKASI_SEARCH||'').trim().toLowerCase();
12804:   const rows = !q ? SPAREPART_LOKASI : SPAREPART_LOKASI.filter(r=>
12805:     String(r.nama||'').toLowerCase().includes(q) || String(r.sap||'').toLowerCase().includes(q)
12806:   );
12807:   const info = $('#master-sparepart-search-info');
12808:   if(info) info.textContent = q ? `${rows.length} dari ${SPAREPART_LOKASI.length} sparepart ditemukan` : `${SPAREPART_LOKASI.length} sparepart tersedia`;
12809:   if(!SPAREPART_LOKASI.length){ holder.innerHTML = `<div style="color:var(--text-dim);font-size:13px;">Belum ada data sparepart.</div>`; return; }
12810:   if(!rows.length){ holder.innerHTML = `<div class="empty-state" style="padding:18px;"><div class="ico"><i class="ph-bold ph-magnifying-glass"></i></div>Tidak ada sparepart yang cocok dengan pencarian.</div>`; return; }
12811:   holder.innerHTML = `<div class="sp-master-list">
12812:     ${rows.map(r=>`
12813:       <div class="sp-master-row">
12814:         <div class="sp-master-sap" data-label="Material Number SAP">${escapeHtml(r.sap)}</div>
12815:         <div class="sp-master-name" data-label="Nama Material">${escapeHtml(r.nama||'-')}</div>
12816:         <div class="sp-master-location" data-label="Lokasi">${escapeHtml(r.lokasiGudang||'-')}</div>
12817:         <div class="sp-master-price" data-label="Harga">Rp${Number(r.harga||0).toLocaleString('id-ID')}</div>
12818:         <div class="sp-master-stock" data-label="Stock">${r.stockQty!=null ? r.stockQty : '-'} ${escapeHtml(r.satuan||'')}</div>
12819:         <div class="sp-master-actions" data-label="Aksi">
12820:           <button type="button" class="btn btn-sm sl-edit" data-sap="${escapeHtml(r.sap)}" data-name="${escapeHtml(r.nama)}" title="Edit"><i class="ph-bold ph-pencil-simple"></i></button>
12821:           <button type="button" class="btn btn-sm btn-danger sl-delete" data-sap="${escapeHtml(r.sap)}" ${r.sap?'':'disabled'} title="${r.sap?'Hapus':'Lengkapi nomor SAP sebelum menghapus'}"><i class="ph-bold ph-trash"></i></button>
12822:         </div>
12823:       </div>`).join('')}
12824:   </div>`;
12825:   $$('.sl-edit', holder).forEach(btn=> btn.addEventListener('click', ()=>{
12826:     const r = SPAREPART_LOKASI.find(x=>btn.dataset.sap ? x.sap===btn.dataset.sap : x.nama===btn.dataset.name); if(!r) return;
12827:     SPAREPART_LOKASI_EDIT_SAP = r.sap;
12828:     SPAREPART_LOKASI_EDIT_NAME = r.nama;
12829:     $('#sl-sap').value = r.sap; $('#sl-nama').value = r.nama||''; $('#sl-lokasi').value = r.lokasiGudang||''; $('#sl-harga').value = r.harga||'';
12830:     const stockEl = $('#sl-stock'), satuanEl = $('#sl-satuan');
12831:     if(stockEl) stockEl.value = r.stockQty!=null ? r.stockQty : '';
12832:     if(satuanEl) satuanEl.value = r.satuan||'';
12833:     $('#btn-save-sparepart-lokasi').innerHTML = '<i class="ph-bold ph-check-circle"></i> Simpan Perubahan';
12834:     $('#btn-cancel-edit-sparepart-lokasi').style.display = 'inline-flex';
12835:     $('#sl-sap').scrollIntoView({behavior:'smooth', block:'center'});
12836:   }));
12837:   $$('.sl-delete', holder).forEach(btn=> btn.addEventListener('click', async ()=>{
12838:     if(!confirm(`Hapus data sparepart untuk SAP "${btn.dataset.sap}"?`)) return;
12839:     const list = SPAREPART_LOKASI.filter(x=>x.sap!==btn.dataset.sap);
12840:     saveSparepartLokasiLocal(list);
12841:     renderSparepartLokasiTable();
12842:     try{ await apiPost({ action:'deleteSparepartLokasi', sap: btn.dataset.sap }); }catch(e){ toast('Tersimpan lokal, gagal sinkron ke server: '+e.message, true); }
12843:   }));
12844: }
12845: const btnSaveSparepartLokasi = $('#btn-save-sparepart-lokasi');
12846: if(btnSaveSparepartLokasi) btnSaveSparepartLokasi.addEventListener('click', async ()=>{
12847:   const sap = $('#sl-sap').value.trim();
12848:   if(!sap){ toast('Material Number SAP wajib diisi.', true); return; }
12849:   const stockVal = $('#sl-stock') ? $('#sl-stock').value : '';
12850:   const data = {
12851:     sap, originalName: SPAREPART_LOKASI_EDIT_NAME, nama: $('#sl-nama').value.trim(), lokasiGudang: $('#sl-lokasi').value.trim(),
12852:     harga: Number($('#sl-harga').value)||0,
12853:     stockQty: stockVal==='' ? null : Number(stockVal)||0,
12854:     satuan: $('#sl-satuan') ? $('#sl-satuan').value.trim() : ''
12855:   };
12856:   const list = SPAREPART_LOKASI.filter(x=>x.sap!==sap && (SPAREPART_LOKASI_EDIT_SAP ? x.sap!==SPAREPART_LOKASI_EDIT_SAP : x.nama!==SPAREPART_LOKASI_EDIT_NAME));
12857:   list.push(data);
12858:   saveSparepartLokasiLocal(list);
12859:   resetSparepartLokasiForm();
12860:   renderSparepartLokasiTable();
12861:   try{
12862:     await apiPost({ action:'saveSparepartLokasi', lokasi: data });
12863:     toast('✓ Data sparepart tersimpan di database SQLite (sheet Sparepart_Lokasi)');
12864:   }catch(e){
12865:     toast('✗ Tersimpan lokal, gagal sinkron ke database SQLite: '+e.message, true);
12866:   }
12867: });
12868: const btnCancelSparepartLokasi = $('#btn-cancel-edit-sparepart-lokasi');
12869: if(btnCancelSparepartLokasi) btnCancelSparepartLokasi.addEventListener('click', resetSparepartLokasiForm);
12870: const searchMasterSparepart = $('#search-master-sparepart');
12871: if(searchMasterSparepart) searchMasterSparepart.addEventListener('input', ()=>{
12872:   SPAREPART_LOKASI_SEARCH = searchMasterSparepart.value || '';
12873:   renderSparepartLokasiTable();
12874: });
12875: const resetMasterSparepartSearch = $('#btn-reset-master-sparepart-search');
12876: if(resetMasterSparepartSearch) resetMasterSparepartSearch.addEventListener('click', ()=>{
12877:   SPAREPART_LOKASI_SEARCH = '';
12878:   if(searchMasterSparepart) searchMasterSparepart.value = '';
12879:   renderSparepartLokasiTable();
~~~

### Around line 14783
~~~text
14771:     $('#analitik-config-status').textContent = '✓ Tersimpan di database SQLite (sheet Analitik_Config)';
14772:     toast('Formula tersimpan di database SQLite ✓');
14773:   }catch(e){
14774:     $('#analitik-config-status').textContent = '✗ Gagal sinkron ke database SQLite: '+e.message+' (tersimpan lokal saja)';
14775:     toast('Gagal simpan ke Sheets: '+e.message, true);
14776:   }
14777:   try{ if(typeof renderHomeSmartResume === 'function') renderHomeSmartResume(); }catch(e){}
14778: });
14779: 
14780: /* ---------------- PARSING DETAIL SPAREPART DARI LOGBOOK ----------------
14781:    Satu entri logbook bisa memuat beberapa material sekaligus, digabung
14782:    jadi satu string dipisah "; " (lihat buildMaterialFieldsFromRows()):
14783:    'Nama Material' = "Bearing 6205 (2 pcs); Seal XX (1 pcs)"
14784:    'Material Number SAP' = "1000234; 1000235"
14785:    Fungsi ini memecahnya kembali menjadi array {nama, sap, qty} per material,
14786:    supaya bisa dicocokkan satu-satu dengan master Lokasi Sparepart. */
14787: function parseSparepartDetail(entry){
14788:   const saved=safeJsonParseClient_(entry['Sparepart Detail (JSON)'],null);
14789:   if(Array.isArray(saved)) return saved.map(r=>({nama:r.nama||'',sap:r.sap||'',qty:Number(r.jumlah??r.qty)||0}));
14790:   const namaList = String(entry['Nama Material']||'').split(';').map(s=>s.trim()).filter(Boolean);
14791:   const sapList = String(entry['Material Number SAP']||'').split(';').map(s=>s.trim()).filter(Boolean);
14792:   const len = Math.max(namaList.length, sapList.length) || (namaList.length || sapList.length ? 1 : 0);
14793:   const out = [];
14794:   for(let i=0;i<len;i++){
14795:     const namaRaw = namaList[i] || '';
14796:     const m = namaRaw.match(/^(.*?)\s*\((\d+(?:\.\d+)?)\s*pcs\)\s*$/i);
14797:     out.push({ nama: m ? m[1].trim() : namaRaw, qty: m ? Number(m[2]) : 1, sap: sapList[i] || '' });
14798:   }
14799:   return out;
14800: }
14801: 
14802: // Total qty pemakaian sparepart dalam satu entri (dijumlah dari semua detail material).
14803: function sparepartEntryTotalQty(e){
14804:   const detail = parseSparepartDetail(e);
14805:   return detail.reduce((s,d)=> s + (d.qty||1), 0) || 1;
14806: }
14807: 
14808: /* =========================================================
14809:    Sumber data collection: SELALU dari ENTRIES (Logbook) — modul ini
14810:    TIDAK PERNAH membuat record pemakaian sparepart sendiri. ID entri
14811:    logbook dipakai apa adanya sebagai relational key ke SPAREPART_STATUS. */
14812: // Menu Sparepart menampilkan seluruh data pengambilan valid dari Logbook,
14813: // tanpa cutoff tersembunyi yang membuat data di Sheets hilang dari frontend.
14814: function sparepartRows(){
14815:   return sotEntries(ENTRIES)
14816:     .filter(e => {
14817:       const nama = norm_(e['Nama Material']);
14818:       const sap = norm_(e['Material Number SAP']);
14819:       return nama !== '' || sap !== '';
14820:     })
14821:     .map(e=>({ entry:e, sap: getSparepartSapEntry(e['ID']) }))
14822:     // Laporan terbaru di atas. "Timestamp Input" (ISO string, diisi otomatis
14823:     // saat entry disimpan) dipakai sebagai acuan utama karena paling presisi;
14824:     // kalau kosong, fallback ke gabungan Tanggal+Waktu yang diisi manual.
14825:     .sort((a,b)=> sparepartEntryTime(b.entry) - sparepartEntryTime(a.entry));
14826: }
14827: 
14828: function sparepartEntryTime(e){
14829:   const ts = e['Timestamp Input'];
14830:   if(ts){
14831:     const t = new Date(ts).getTime();
14832:     if(!isNaN(t)) return t;
14833:   }
14834:   const t2 = new Date(`${e['Tanggal']||''}T${e['Waktu']||'00:00'}`).getTime();
14835:   return isNaN(t2) ? 0 : t2;
14836: }
14837: 
14838: function isSameLocalDate(dateLike, ref){
14839:   const a = new Date(dateLike), b = ref || new Date();
14840:   if(isNaN(a)) return false;
14841:   return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
14842: }
14843: 
14844: let SP_COLLECT_PAGE = 1;
14845: let SP_COLLECT_PAGE_SIZE = 10;
14846: 
14847: function renderTrainingSparepartNotice_(){
~~~

### Around line 14790
~~~text
14778: });
14779: 
14780: /* ---------------- PARSING DETAIL SPAREPART DARI LOGBOOK ----------------
14781:    Satu entri logbook bisa memuat beberapa material sekaligus, digabung
14782:    jadi satu string dipisah "; " (lihat buildMaterialFieldsFromRows()):
14783:    'Nama Material' = "Bearing 6205 (2 pcs); Seal XX (1 pcs)"
14784:    'Material Number SAP' = "1000234; 1000235"
14785:    Fungsi ini memecahnya kembali menjadi array {nama, sap, qty} per material,
14786:    supaya bisa dicocokkan satu-satu dengan master Lokasi Sparepart. */
14787: function parseSparepartDetail(entry){
14788:   const saved=safeJsonParseClient_(entry['Sparepart Detail (JSON)'],null);
14789:   if(Array.isArray(saved)) return saved.map(r=>({nama:r.nama||'',sap:r.sap||'',qty:Number(r.jumlah??r.qty)||0}));
14790:   const namaList = String(entry['Nama Material']||'').split(';').map(s=>s.trim()).filter(Boolean);
14791:   const sapList = String(entry['Material Number SAP']||'').split(';').map(s=>s.trim()).filter(Boolean);
14792:   const len = Math.max(namaList.length, sapList.length) || (namaList.length || sapList.length ? 1 : 0);
14793:   const out = [];
14794:   for(let i=0;i<len;i++){
14795:     const namaRaw = namaList[i] || '';
14796:     const m = namaRaw.match(/^(.*?)\s*\((\d+(?:\.\d+)?)\s*pcs\)\s*$/i);
14797:     out.push({ nama: m ? m[1].trim() : namaRaw, qty: m ? Number(m[2]) : 1, sap: sapList[i] || '' });
14798:   }
14799:   return out;
14800: }
14801: 
14802: // Total qty pemakaian sparepart dalam satu entri (dijumlah dari semua detail material).
14803: function sparepartEntryTotalQty(e){
14804:   const detail = parseSparepartDetail(e);
14805:   return detail.reduce((s,d)=> s + (d.qty||1), 0) || 1;
14806: }
14807: 
14808: /* =========================================================
14809:    Sumber data collection: SELALU dari ENTRIES (Logbook) — modul ini
14810:    TIDAK PERNAH membuat record pemakaian sparepart sendiri. ID entri
14811:    logbook dipakai apa adanya sebagai relational key ke SPAREPART_STATUS. */
14812: // Menu Sparepart menampilkan seluruh data pengambilan valid dari Logbook,
14813: // tanpa cutoff tersembunyi yang membuat data di Sheets hilang dari frontend.
14814: function sparepartRows(){
14815:   return sotEntries(ENTRIES)
14816:     .filter(e => {
14817:       const nama = norm_(e['Nama Material']);
14818:       const sap = norm_(e['Material Number SAP']);
14819:       return nama !== '' || sap !== '';
14820:     })
14821:     .map(e=>({ entry:e, sap: getSparepartSapEntry(e['ID']) }))
14822:     // Laporan terbaru di atas. "Timestamp Input" (ISO string, diisi otomatis
14823:     // saat entry disimpan) dipakai sebagai acuan utama karena paling presisi;
14824:     // kalau kosong, fallback ke gabungan Tanggal+Waktu yang diisi manual.
14825:     .sort((a,b)=> sparepartEntryTime(b.entry) - sparepartEntryTime(a.entry));
14826: }
14827: 
14828: function sparepartEntryTime(e){
14829:   const ts = e['Timestamp Input'];
14830:   if(ts){
14831:     const t = new Date(ts).getTime();
14832:     if(!isNaN(t)) return t;
14833:   }
14834:   const t2 = new Date(`${e['Tanggal']||''}T${e['Waktu']||'00:00'}`).getTime();
14835:   return isNaN(t2) ? 0 : t2;
14836: }
14837: 
14838: function isSameLocalDate(dateLike, ref){
14839:   const a = new Date(dateLike), b = ref || new Date();
14840:   if(isNaN(a)) return false;
14841:   return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate();
14842: }
14843: 
14844: let SP_COLLECT_PAGE = 1;
14845: let SP_COLLECT_PAGE_SIZE = 10;
14846: 
14847: function renderTrainingSparepartNotice_(){
14848:   const pending=(SPAREPART_LOKASI||[]).filter(r=>r.needsReview);
14849:   [['view-sparepart','training-sparepart-notice']].forEach(([target,id])=>{
14850:     const host=document.getElementById(target),old=document.getElementById(id);
14851:     if(old) old.remove(); if(!host || !pending.length) return;
14852:     const n=document.createElement('div');n.id=id;n.className='card';n.setAttribute('role','status');
14853:     n.textContent=pending.length+' sparepart baru dari Logbook perlu dilengkapi di Master Sparepart: '+pending.map(r=>r.nama||r.sap).join(', ');
14854:     if(target==='home-smart-resume') host.before(n); else host.prepend(n);
~~~

## Jumlah Material
No match.

## Satuan
### Around line 1780
~~~text
01768:   /* [ADAPTIVE] Jadikan tiap card sebagai container query context sendiri,
01769:      supaya ukuran teks di dalamnya menyesuaikan LEBAR CARD itu sendiri
01770:      (bukan lebar layar/viewport) — card kecil di grid padat tetap dapat
01771:      ukuran teks yang pas & tidak terpotong, card besar dapat teks lebih besar. */
01772:   container-type:size;container-name:dashcard;
01773: }
01774: .dash-card:hover{transform:translateY(-3px);filter:brightness(1.1);}
01775: /* [ADAPTIVE] dc-top pakai flex-wrap + min-width:0 supaya nama/kode mesin yang
01776:    panjang tidak menumpuk (overlap) dengan LED indikator di layar sempit —
01777:    kalau ruang tidak cukup, LED akan turun ke baris baru alih-alih menindih teks. */
01778: .dash-card .dc-top{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;gap:6px 10px;margin-bottom:10px;}
01779: .dash-card .dc-top-text{min-width:0;flex:1 1 140px;}
01780: /* [ADAPTIVE] Semua ukuran font kartu memakai satuan cqi (container query
01781:    inline-size) dg clamp() sbg batas atas/bawah, jadi mengikuti lebar CARD,
01782:    bukan viewport — teks tidak lagi kepotong/overflow di card sempit maupun
01783:    kekecilan di card lebar. overflow-wrap+break-word tetap dipertahankan
01784:    sbg jaring pengaman utk kata yg sangat panjang. */
01785: .dash-card .dc-name{font-family:var(--font-display);font-weight:600;font-size:clamp(12px,6.2cqi,16px);color:#fff;line-height:1.3;overflow-wrap:anywhere;word-break:break-word;}
01786: .dash-card .dc-kode{font-family:var(--font-mono);font-size:clamp(9.5px,4.6cqi,11.5px);opacity:.75;color:#fff;margin-top:2px;line-height:1.3;overflow-wrap:anywhere;word-break:break-word;}
01787: .dash-card .dc-status{font-size:clamp(10px,4.8cqi,12px);font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;color:#fff;overflow-wrap:anywhere;word-break:break-word;line-height:1.4;}
01788: /* [FIX] Deskripsi TIDAK dipotong lagi (dulu line-clamp:2 + ellipsis bisa
01789:    memotong kalimat penting). Sekarang teks dibiarkan turun baris sebanyak
01790:    perlu; tinggi card menyesuaikan (grid tetap rapi krn dash-card pakai
01791:    flex-direction:column & dc-recap didorong ke bawah via margin-top:auto). */
01792: .dash-card .dc-desc{font-size:clamp(11px,4.4cqi,13px);opacity:.85;color:#fff;overflow-wrap:anywhere;word-break:break-word;flex:1 1 auto;}
01793: /* [ADAPTIVE] dc-recap = baris Machine Score paling bawah, dipisah garis
01794:    (border-top) dari konten di atasnya. flex-wrap + min-width:0 mencegah teks
01795:    bintang/skor menumpuk kalau lebar card sangat sempit (mis. 1 kolom di HP kecil). */
01796: .dash-card .dc-recap{
01797:   display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;margin-top:auto;padding-top:8px;
01798:   border-top:1px solid rgba(255,255,255,.15);font-size:11px;color:#fff;opacity:.85;font-family:var(--font-mono);
01799: }
01800: .dash-card .dc-recap span{display:flex;flex-wrap:wrap;align-items:center;gap:4px;min-width:0;overflow-wrap:anywhere;word-break:break-word;}
01801: .dash-card .dc-timer{
01802:   margin-top:10px;font-family:var(--font-mono);font-size:13px;font-weight:700;
01803:   padding:6px 10px;border-radius:7px;text-align:center;
01804:   background:rgba(255,255,255,.18);color:#fff;overflow-wrap:anywhere;word-break:break-word;
01805: }
01806: 
01807: /* [FIX] Card mesin di Home: HANYA menampilkan Kode Mesin + Status Mesin
01808:    saat card-nya SENDIRI sempit (bukan lagi berdasarkan lebar LAYAR) —
01809:    supaya konsisten baik di mode portrait (2 kolom, card lebar → info
01810:    lengkap tetap muat) maupun landscape (6 kolom, card jadi sempit → info
01811:    diringkas otomatis), tanpa perlu breakpoint terpisah untuk tiap
01812:    kombinasi. Memakai @container (bukan @media) karena .dash-card sudah
01813:    didaftarkan sebagai container query context sendiri (container-type:
01814:    inline-size;container-name:dashcard) — jadi treshold-nya mengikuti
01815:    lebar card actual, bukan lebar viewport. */
01816: @container dashcard (max-width: 150px){
01817:   .dash-card .dc-desc,
01818:   .dash-card .dc-recap{ display:none; }
01819:   /* Kode & status jadi info utama saat card sempit -> naikkan sedikit
01820:      ukuran fontnya supaya tetap enak dibaca. */
01821:   .dash-card .dc-kode{ font-size:clamp(12px,7cqi,14px); opacity:.9; }
01822:   .dash-card .dc-status{ font-size:clamp(12px,7.2cqi,14px); margin-bottom:0; }
01823:   .dash-card{ padding:12px; }
01824: }
01825: /* [ADAPTIF] Sekarang container-type:size (bukan cuma inline-size) di
01826:    .dash-card, jadi bisa query TINGGI card juga -- dipakai supaya saat
01827:    grid harus menampung banyak mesin di layar pendek (tanpa scroll,
01828:    lihat #dash-grid di bawah) dan tiap baris jadi rendah, info sekunder
01829:    otomatis disembunyikan bertahap alih-alih teks terpotong/overflow.
01830:    Threshold bertingkat: makin pendek card, makin sedikit info yang
01831:    ditampilkan, tapi Kode Mesin + Status (info paling penting) SELALU
01832:    tampil di semua ukuran. */
01833: @container dashcard (max-height: 130px){
01834:   .dash-card{ padding:10px; }
01835:   .dash-card .dc-recap{ display:none; }
01836:   .dash-card .dc-desc{ -webkit-line-clamp:1;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden; }
01837: }
01838: @container dashcard (max-height: 90px){
01839:   .dash-card .dc-desc{ display:none; }
01840:   .dash-card .dc-top{ margin-bottom:4px; }
01841: }
01842: @container dashcard (max-height: 60px){
01843:   .dash-card .dc-name{ display:block; }
01844:   .dash-card{ padding:8px; justify-content:center; }
~~~

### Around line 4488
~~~text
04476: 
04477:       <div class="card" style="margin-bottom:18px;">
04478:         <div class="section-title"><i class="ph-bold ph-clipboard-text"></i> KPI Kertas Kerja — Target &amp; Realisasi per Bulan</div>
04479:         <div class="sub" style="margin-bottom:12px;">
04480:           Database KPI Department menggunakan workbook aktual sebagai source of truth. Data 2026 disinkronkan otomatis dari file sumber; form ini tetap tersedia untuk Admin/Supervisor jika perlu koreksi terkontrol atau menambah periode berikutnya.
04481:         </div>
04482:         <div class="grid3">
04483:           <div class="field"><label>Tahun</label><input type="number" id="kk-tahun" step="1" placeholder="2026"></div>
04484:           <div class="field"><label>Perspective</label><input type="text" id="kk-perspective" placeholder="INTERNAL BUSINESS PROCESS"></div>
04485:           <div class="field"><label>Data Producer</label><input type="text" id="kk-producer" placeholder="Offset - Technical"></div>
04486:           <div class="field"><label>Divisi / Lini</label><input type="text" id="kk-divisi" placeholder="Printing / Converting 01 Autoplaten / dst"></div>
04487:           <div class="field"><label>Nama KPI</label><input type="text" id="kk-kpi" placeholder="Machine Loss Time - Printing (%)"></div>
04488:           <div class="field"><label>Satuan</label><input type="text" id="kk-satuan" placeholder="%, Hours, Rp, dsb"></div>
04489:           <div class="field"><label>Polaritas</label>
04490:             <select id="kk-polaritas">
04491:               <option value="Minimized">Minimized (makin kecil makin baik)</option>
04492:               <option value="Maximized">Maximized (makin besar makin baik)</option>
04493:             </select>
04494:           </div>
04495:           <div class="field"><label>Rumus</label><input type="text" id="kk-rumus" placeholder="(Losthrs/RunHrs)*100"></div>
04496:           <div class="field"><label>Periode Perhitungan</label><input type="text" id="kk-periode" placeholder="Bulanan"></div>
04497:           <div class="field"><label>Target Tahunan</label><input type="number" id="kk-target-tahunan" step="0.01" placeholder="0"></div>
04498:         </div>
04499:         <div class="sub" style="margin:10px 0 6px;">Target &amp; Realisasi per bulan</div>
04500:         <div id="kk-bulan-grid" class="kk-bulan-grid"></div>
04501:         <div style="margin-top:12px;">
04502:           <button class="btn btn-sm btn-primary" id="btn-save-kpi-kerja">+ Simpan KPI</button>
04503:           <button class="btn btn-sm" id="btn-cancel-edit-kpi-kerja" style="display:none;">Batal Edit</button>
04504:           <button class="btn btn-sm" id="btn-seed-kpi-kerja"><i class="ph-bold ph-arrows-clockwise"></i> Sinkron Data Aktual KPI Department</button>
04505:           <button class="btn btn-sm" id="btn-import-kpiKerja"><i class="ph-bold ph-file-xls"></i> Import Excel</button>
04506:         </div>
04507:         <div style="margin-top:18px;" id="kpi-kerja-table"></div>
04508:       </div>
04509:     </section>
04510: 
04511:     <section class="view" id="view-machine-breakdown">
04512:       <div class="topbar">
04513:         <div><h1>Breakdown Mesin (MTD/YTD)</h1><div class="sub">Data mentah sumber ODIN per mesin (El BD, Mech BD, Run Hrs, MTBF/MTTR) — bahan hitung Ringkasan KPI di atas. Input ulang kombinasi Tahun+Bulan+Periode+Mesin yang sama akan meng-update baris lama, bukan menambah baru.</div></div>
04514:       </div>
04515: 
04516:       <div class="card" style="margin-bottom:16px;">
04517:         <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:end;">
04518:           <div>
04519:             <label style="font-size:12px;color:var(--text-dim);">Tahun</label><br>
04520:             <select id="mbd-tahun-filter" class="input" style="width:110px;"></select>
04521:           </div>
04522:           <div>
04523:             <label style="font-size:12px;color:var(--text-dim);">Bulan</label><br>
04524:             <select id="mbd-bulan-filter" class="input" style="width:120px;">
04525:               <option value="">Semua</option>
04526:               <option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>Mei</option><option>Jun</option>
04527:               <option>Jul</option><option>Agust</option><option>Sep</option><option>Okt</option><option>Nop</option><option>Des</option>
04528:             </select>
04529:           </div>
04530:           <div>
04531:             <label style="font-size:12px;color:var(--text-dim);">Periode</label><br>
04532:             <select id="mbd-periode-filter" class="input" style="width:100px;">
04533:               <option value="">Semua</option>
04534:               <option>MTD</option>
04535:               <option>YTD</option>
04536:             </select>
04537:           </div>
04538:           <button class="btn btn-sm btn-primary" id="btn-mbd-add" style="margin-left:auto;">
04539:             <i class="ph-bold ph-plus"></i> Tambah / Update Data
04540:           </button>
04541:         </div>
04542:       </div>
04543: 
04544:       <div id="mbd-form-card" class="card" style="display:none;margin-bottom:16px;">
04545:         <div class="an-card-title" id="mbd-form-title"><i class="ph-bold ph-pencil-simple"></i> Input Breakdown Mesin</div>
04546:         <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:10px;">
04547:           <div><label style="font-size:12px;color:var(--text-dim);">Tahun *</label><input type="number" id="mbd-f-tahun" class="input" placeholder="2026"></div>
04548:           <div><label style="font-size:12px;color:var(--text-dim);">Bulan *</label>
04549:             <select id="mbd-f-bulan" class="input">
04550:               <option value="">Pilih</option>
04551:               <option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>Mei</option><option>Jun</option>
04552:               <option>Jul</option><option>Agust</option><option>Sep</option><option>Okt</option><option>Nop</option><option>Des</option>
~~~

### Around line 4924
~~~text
04912:             <label style="font-size:12px;color:var(--text-dim);">Nama Area (manual)</label>
04913:             <input type="text" id="eng-f-area-manual" class="input" placeholder="cth. Compressor no.2, Offset Plant">
04914:           </div>
04915:           <div><label style="font-size:12px;color:var(--text-dim);">Jenis *</label>
04916:             <select id="eng-f-jenis" class="input">
04917:               <option value="">Pilih</option>
04918:               <option>Listrik</option>
04919:               <option>Water Consumption</option>
04920:               <option>Compressed Air</option>
04921:             </select>
04922:           </div>
04923:           <div><label style="font-size:12px;color:var(--text-dim);">Nilai (Konsumsi) *</label><input type="number" step="any" id="eng-f-nilai" class="input" placeholder="kWh atau m3"></div>
04924:           <div><label style="font-size:12px;color:var(--text-dim);">Satuan</label><input type="text" id="eng-f-satuan" class="input" placeholder="kWh / m3" readonly></div>
04925:           <div><label style="font-size:12px;color:var(--text-dim);">Output Produksi *</label><input type="number" step="any" id="eng-f-output" class="input" placeholder="Sheet atau M3"></div>
04926:           <div><label style="font-size:12px;color:var(--text-dim);">Satuan Output</label><input type="text" id="eng-f-satuan-output" class="input" placeholder="Sheet / M3" readonly></div>
04927:           <div>
04928:             <label style="font-size:12px;color:var(--text-dim);">Rasio Efisiensi (auto)</label>
04929:             <input type="text" id="eng-f-rasio" class="input" readonly style="background:var(--bg-alt,rgba(255,255,255,0.04));font-weight:600;">
04930:           </div>
04931:         </div>
04932:         <div style="margin-top:10px;"><label style="font-size:12px;color:var(--text-dim);">Catatan</label><input type="text" id="eng-f-catatan" class="input" style="width:100%;"></div>
04933:         <div style="display:flex;gap:8px;margin-top:12px;">
04934:           <button class="btn btn-sm btn-primary" id="btn-eng-save"><i class="ph-bold ph-check"></i> Simpan</button>
04935:           <button class="btn btn-sm" id="btn-eng-cancel">Batal</button>
04936:         </div>
04937:       </div>
04938: 
04939:       <div id="eng-empty" style="display:none;color:var(--text-dim);font-size:13px;padding:20px;text-align:center;"></div>
04940:       <div class="card" style="overflow-x:auto;">
04941:         <table class="data-table" id="eng-table" style="width:100%;font-size:12.5px;">
04942:           <thead><tr><th>Bulan</th><th>Area/Mesin</th><th>Jenis</th><th>Nilai</th><th>Satuan</th><th>Output</th><th>Rasio Efisiensi</th><th>Catatan</th><th></th></tr></thead>
04943:           <tbody id="eng-tbody"></tbody>
04944:         </table>
04945:       </div>
04946:     </section>
04947: 
04948:     <section class="view" id="view-correlation">
04949:       <div class="topbar">
04950:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
04951:         <div><h1>Correlation Analysis</h1><div class="sub">Mencari keterkaitan/pola tersembunyi antar variabel dari data Logbook &amp; Project Improvement — mana yang benar-benar berkorelasi dengan breakdown, bukan cuma asumsi.</div></div>
04952:         <div style="display:flex;gap:8px;align-items:center;">
04953:           <select id="corr-periode" style="width:auto;">
04954:             <option value="90">3 Bulan Terakhir</option>
04955:             <option value="180">6 Bulan Terakhir</option>
04956:             <option value="365">12 Bulan Terakhir</option>
04957:             <option value="0" selected>Semua Data</option>
04958:           </select>
04959:           <button class="btn btn-sm" id="btn-refresh-correlation"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04960:         </div>
04961:       </div>
04962: 
04963:       <div class="an-card" id="corr-pm-card">
04964:         <div class="an-card-title"><i class="ph-bold ph-shield-check"></i> Korelasi PM Compliance vs Jumlah Breakdown</div>
04965:         <div class="sub" style="margin-bottom:10px;">Menghitung koefisien korelasi Pearson (r) antara jumlah pekerjaan Preventive Maintenance dan jumlah Breakdown/Emergency, per mesin per bulan. Nilai r mendekati -1 berarti makin rajin PM, makin sedikit breakdown (bagus). Mendekati 0 berarti tidak ada hubungan yang jelas.</div>
04966:         <div id="corr-pm-result"></div>
04967:       </div>
04968: 
04969:       <div class="an-section-grid">
04970:         <div class="an-card">
04971:           <div class="an-card-title"><i class="ph-bold ph-calendar-blank"></i> Breakdown per Hari dalam Seminggu</div>
04972:           <canvas id="chart-corr-dow" height="230"></canvas>
04973:         </div>
04974:         <div class="an-card">
04975:           <div class="an-card-title"><i class="ph-bold ph-sun"></i> Breakdown per Shift</div>
04976:           <canvas id="chart-corr-shift" height="230"></canvas>
04977:         </div>
04978:       </div>
04979: 
04980:       <div class="an-card">
04981:         <div class="an-card-title"><i class="ph-bold ph-hourglass-medium"></i> Rata-rata Durasi Perbaikan per Jenis Pekerjaan</div>
04982:         <canvas id="chart-corr-durasi" height="240"></canvas>
04983:       </div>
04984: 
04985:       <div class="an-card">
04986:         <div class="an-card-title"><i class="ph-bold ph-grid-nine"></i> Heatmap Hari vs Shift (Jumlah Kejadian)</div>
04987:         <div class="sub" style="margin-bottom:10px;">Semakin gelap warnanya, semakin sering kejadian terjadi pada kombinasi hari &amp; shift tersebut — untuk melihat apakah ada pola waktu tertentu yang rawan.</div>
04988:         <div id="corr-heatmap"></div>
~~~

### Around line 4926
~~~text
04914:           </div>
04915:           <div><label style="font-size:12px;color:var(--text-dim);">Jenis *</label>
04916:             <select id="eng-f-jenis" class="input">
04917:               <option value="">Pilih</option>
04918:               <option>Listrik</option>
04919:               <option>Water Consumption</option>
04920:               <option>Compressed Air</option>
04921:             </select>
04922:           </div>
04923:           <div><label style="font-size:12px;color:var(--text-dim);">Nilai (Konsumsi) *</label><input type="number" step="any" id="eng-f-nilai" class="input" placeholder="kWh atau m3"></div>
04924:           <div><label style="font-size:12px;color:var(--text-dim);">Satuan</label><input type="text" id="eng-f-satuan" class="input" placeholder="kWh / m3" readonly></div>
04925:           <div><label style="font-size:12px;color:var(--text-dim);">Output Produksi *</label><input type="number" step="any" id="eng-f-output" class="input" placeholder="Sheet atau M3"></div>
04926:           <div><label style="font-size:12px;color:var(--text-dim);">Satuan Output</label><input type="text" id="eng-f-satuan-output" class="input" placeholder="Sheet / M3" readonly></div>
04927:           <div>
04928:             <label style="font-size:12px;color:var(--text-dim);">Rasio Efisiensi (auto)</label>
04929:             <input type="text" id="eng-f-rasio" class="input" readonly style="background:var(--bg-alt,rgba(255,255,255,0.04));font-weight:600;">
04930:           </div>
04931:         </div>
04932:         <div style="margin-top:10px;"><label style="font-size:12px;color:var(--text-dim);">Catatan</label><input type="text" id="eng-f-catatan" class="input" style="width:100%;"></div>
04933:         <div style="display:flex;gap:8px;margin-top:12px;">
04934:           <button class="btn btn-sm btn-primary" id="btn-eng-save"><i class="ph-bold ph-check"></i> Simpan</button>
04935:           <button class="btn btn-sm" id="btn-eng-cancel">Batal</button>
04936:         </div>
04937:       </div>
04938: 
04939:       <div id="eng-empty" style="display:none;color:var(--text-dim);font-size:13px;padding:20px;text-align:center;"></div>
04940:       <div class="card" style="overflow-x:auto;">
04941:         <table class="data-table" id="eng-table" style="width:100%;font-size:12.5px;">
04942:           <thead><tr><th>Bulan</th><th>Area/Mesin</th><th>Jenis</th><th>Nilai</th><th>Satuan</th><th>Output</th><th>Rasio Efisiensi</th><th>Catatan</th><th></th></tr></thead>
04943:           <tbody id="eng-tbody"></tbody>
04944:         </table>
04945:       </div>
04946:     </section>
04947: 
04948:     <section class="view" id="view-correlation">
04949:       <div class="topbar">
04950:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
04951:         <div><h1>Correlation Analysis</h1><div class="sub">Mencari keterkaitan/pola tersembunyi antar variabel dari data Logbook &amp; Project Improvement — mana yang benar-benar berkorelasi dengan breakdown, bukan cuma asumsi.</div></div>
04952:         <div style="display:flex;gap:8px;align-items:center;">
04953:           <select id="corr-periode" style="width:auto;">
04954:             <option value="90">3 Bulan Terakhir</option>
04955:             <option value="180">6 Bulan Terakhir</option>
04956:             <option value="365">12 Bulan Terakhir</option>
04957:             <option value="0" selected>Semua Data</option>
04958:           </select>
04959:           <button class="btn btn-sm" id="btn-refresh-correlation"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04960:         </div>
04961:       </div>
04962: 
04963:       <div class="an-card" id="corr-pm-card">
04964:         <div class="an-card-title"><i class="ph-bold ph-shield-check"></i> Korelasi PM Compliance vs Jumlah Breakdown</div>
04965:         <div class="sub" style="margin-bottom:10px;">Menghitung koefisien korelasi Pearson (r) antara jumlah pekerjaan Preventive Maintenance dan jumlah Breakdown/Emergency, per mesin per bulan. Nilai r mendekati -1 berarti makin rajin PM, makin sedikit breakdown (bagus). Mendekati 0 berarti tidak ada hubungan yang jelas.</div>
04966:         <div id="corr-pm-result"></div>
04967:       </div>
04968: 
04969:       <div class="an-section-grid">
04970:         <div class="an-card">
04971:           <div class="an-card-title"><i class="ph-bold ph-calendar-blank"></i> Breakdown per Hari dalam Seminggu</div>
04972:           <canvas id="chart-corr-dow" height="230"></canvas>
04973:         </div>
04974:         <div class="an-card">
04975:           <div class="an-card-title"><i class="ph-bold ph-sun"></i> Breakdown per Shift</div>
04976:           <canvas id="chart-corr-shift" height="230"></canvas>
04977:         </div>
04978:       </div>
04979: 
04980:       <div class="an-card">
04981:         <div class="an-card-title"><i class="ph-bold ph-hourglass-medium"></i> Rata-rata Durasi Perbaikan per Jenis Pekerjaan</div>
04982:         <canvas id="chart-corr-durasi" height="240"></canvas>
04983:       </div>
04984: 
04985:       <div class="an-card">
04986:         <div class="an-card-title"><i class="ph-bold ph-grid-nine"></i> Heatmap Hari vs Shift (Jumlah Kejadian)</div>
04987:         <div class="sub" style="margin-bottom:10px;">Semakin gelap warnanya, semakin sering kejadian terjadi pada kombinasi hari &amp; shift tersebut — untuk melihat apakah ada pola waktu tertentu yang rawan.</div>
04988:         <div id="corr-heatmap"></div>
04989:       </div>
04990: 
~~~

### Around line 4942
~~~text
04930:           </div>
04931:         </div>
04932:         <div style="margin-top:10px;"><label style="font-size:12px;color:var(--text-dim);">Catatan</label><input type="text" id="eng-f-catatan" class="input" style="width:100%;"></div>
04933:         <div style="display:flex;gap:8px;margin-top:12px;">
04934:           <button class="btn btn-sm btn-primary" id="btn-eng-save"><i class="ph-bold ph-check"></i> Simpan</button>
04935:           <button class="btn btn-sm" id="btn-eng-cancel">Batal</button>
04936:         </div>
04937:       </div>
04938: 
04939:       <div id="eng-empty" style="display:none;color:var(--text-dim);font-size:13px;padding:20px;text-align:center;"></div>
04940:       <div class="card" style="overflow-x:auto;">
04941:         <table class="data-table" id="eng-table" style="width:100%;font-size:12.5px;">
04942:           <thead><tr><th>Bulan</th><th>Area/Mesin</th><th>Jenis</th><th>Nilai</th><th>Satuan</th><th>Output</th><th>Rasio Efisiensi</th><th>Catatan</th><th></th></tr></thead>
04943:           <tbody id="eng-tbody"></tbody>
04944:         </table>
04945:       </div>
04946:     </section>
04947: 
04948:     <section class="view" id="view-correlation">
04949:       <div class="topbar">
04950:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
04951:         <div><h1>Correlation Analysis</h1><div class="sub">Mencari keterkaitan/pola tersembunyi antar variabel dari data Logbook &amp; Project Improvement — mana yang benar-benar berkorelasi dengan breakdown, bukan cuma asumsi.</div></div>
04952:         <div style="display:flex;gap:8px;align-items:center;">
04953:           <select id="corr-periode" style="width:auto;">
04954:             <option value="90">3 Bulan Terakhir</option>
04955:             <option value="180">6 Bulan Terakhir</option>
04956:             <option value="365">12 Bulan Terakhir</option>
04957:             <option value="0" selected>Semua Data</option>
04958:           </select>
04959:           <button class="btn btn-sm" id="btn-refresh-correlation"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
04960:         </div>
04961:       </div>
04962: 
04963:       <div class="an-card" id="corr-pm-card">
04964:         <div class="an-card-title"><i class="ph-bold ph-shield-check"></i> Korelasi PM Compliance vs Jumlah Breakdown</div>
04965:         <div class="sub" style="margin-bottom:10px;">Menghitung koefisien korelasi Pearson (r) antara jumlah pekerjaan Preventive Maintenance dan jumlah Breakdown/Emergency, per mesin per bulan. Nilai r mendekati -1 berarti makin rajin PM, makin sedikit breakdown (bagus). Mendekati 0 berarti tidak ada hubungan yang jelas.</div>
04966:         <div id="corr-pm-result"></div>
04967:       </div>
04968: 
04969:       <div class="an-section-grid">
04970:         <div class="an-card">
04971:           <div class="an-card-title"><i class="ph-bold ph-calendar-blank"></i> Breakdown per Hari dalam Seminggu</div>
04972:           <canvas id="chart-corr-dow" height="230"></canvas>
04973:         </div>
04974:         <div class="an-card">
04975:           <div class="an-card-title"><i class="ph-bold ph-sun"></i> Breakdown per Shift</div>
04976:           <canvas id="chart-corr-shift" height="230"></canvas>
04977:         </div>
04978:       </div>
04979: 
04980:       <div class="an-card">
04981:         <div class="an-card-title"><i class="ph-bold ph-hourglass-medium"></i> Rata-rata Durasi Perbaikan per Jenis Pekerjaan</div>
04982:         <canvas id="chart-corr-durasi" height="240"></canvas>
04983:       </div>
04984: 
04985:       <div class="an-card">
04986:         <div class="an-card-title"><i class="ph-bold ph-grid-nine"></i> Heatmap Hari vs Shift (Jumlah Kejadian)</div>
04987:         <div class="sub" style="margin-bottom:10px;">Semakin gelap warnanya, semakin sering kejadian terjadi pada kombinasi hari &amp; shift tersebut — untuk melihat apakah ada pola waktu tertentu yang rawan.</div>
04988:         <div id="corr-heatmap"></div>
04989:       </div>
04990: 
04991:       <div class="an-card">
04992:         <div class="an-card-title"><i class="ph-bold ph-link"></i> Pasangan Mesin &amp; Jenis Masalah Paling Sering Berkorelasi</div>
04993:         <div class="sub" style="margin-bottom:10px;">Kombinasi mesin + kata kunci masalah yang paling sering muncul bersamaan di Logbook — kandidat kuat untuk didokumentasikan di Knowledge Base sebagai Frequently Problem.</div>
04994:         <div id="corr-pairs-table"></div>
04995:       </div>
04996:     </section>
04997: 
04998:     <section class="view" id="view-diagnostic">
04999:       <div class="topbar">
05000:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05001:         <div><h1>Diagnostic Wizard</h1><div class="sub">"Dokter mesin" berbasis data sendiri — masukkan gejala yang terlihat, sistem mencari kasus mirip dari Logbook, Report RCA, dan Knowledge Base, lalu menyarankan kemungkinan penyebab &amp; tindakan yang pernah berhasil.</div></div>
05002:       </div>
05003: 
05004:       <div class="card" style="margin-bottom:16px;">
05005:         <div class="section-title"><i class="ph-bold ph-stethoscope"></i> Langkah 1 — Pilih Mesin (opsional)</div>
05006:         <div class="sub" style="margin-bottom:10px;">Kosongkan kalau gejalanya umum / belum tahu mesin mana yang bermasalah.</div>
~~~

### Around line 5092
~~~text
05080:         <button class="btn btn-ghost sp-tab-btn" data-sptab="sp-tabPO"><i class="ph-bold ph-truck"></i> PO Monitoring</button>
05081:         <button class="btn btn-ghost sp-tab-btn" data-sptab="sp-tabWarehouse"><i class="ph-bold ph-warehouse"></i> Warehouse Validation</button>
05082:         <button class="btn btn-ghost sp-tab-btn" data-sptab="sp-tabOpname"><i class="ph-bold ph-clipboard-text"></i> Stock Opname</button>
05083:         <button class="btn btn-ghost sp-tab-btn" data-sptab="sp-tabMaster"><i class="ph-bold ph-database"></i> Master Sparepart</button>
05084:       </div>
05085: 
05086:       <!-- ============ TAB 1: DAILY SPAREPART COLLECTION ============ -->
05087:       <div id="sp-tabCollect" class="sp-tab-panel active">
05088:         <div class="sp-dash-grid" id="sp-collect-dash"></div>
05089: 
05090:         <div class="card" style="margin-bottom:16px;">
05091:           <div class="section-title"><i class="ph-bold ph-chart-bar"></i> Analisa Periodik Pengambilan Sparepart per Bulan</div>
05092:           <div class="sub" style="margin-bottom:10px;">Jumlah pengambilan &amp; estimasi cost dihitung dari data logbook, dicocokkan dengan Harga Satuan di menu Setting &gt; Lokasi Sparepart.</div>
05093:           <div style="height:260px;"><canvas id="chart-sparepart-periodik"></canvas></div>
05094:         </div>
05095: 
05096:         <div class="filter-bar sp-sticky-filter">
05097:           <input class="grow" type="text" id="search-sparepart" placeholder="Cari material, SAP, mesin, logbook no, WO, PIC...">
05098:           <select id="filter-sparepart-collection" aria-label="Filter status collection">
05099:             <option value="">Semua Collection</option>
05100:             <option value="PENDING">Belum Dicollect</option>
05101:             <option value="COMPLETED">Sudah Dicollect + SAP</option>
05102:           </select>
05103:           <select id="sort-sparepart">
05104:             <option value="date-desc">Tanggal Terbaru</option>
05105:             <option value="date-asc">Tanggal Terlama</option>
05106:             <option value="material-asc">Nama Material A-Z</option>
05107:             <option value="qty-desc">Qty Terbesar</option>
05108:           </select>
05109:           <button class="btn btn-sm" id="btn-refresh-sparepart"><i class="ph-bold ph-arrows-clockwise"></i> Refresh</button>
05110:           <button class="btn btn-sm" id="btn-export-sparepart-collect"><i class="ph-bold ph-file-xls"></i> Export Excel</button>
05111:         </div>
05112: 
05113:         <div class="sp-table-wrap card" style="padding:0;overflow:hidden;">
05114:           <div style="max-width:100%;">
05115:             <table class="sp-collect-table">
05116:               <thead><tr>
05117:                 <th style="width:120px;">Tandai</th>
05118:                 <th>Date</th><th>Logbook No</th><th>Machine</th><th>WO</th><th>PIC</th>
05119:                 <th>Spare Part</th><th>Qty</th><th>Lihat Detail</th>
05120:               </tr></thead>
05121:               <tbody id="sp-collect-tbody"></tbody>
05122:             </table>
05123:           </div>
05124:           <div class="empty-state" id="sp-collect-empty" style="display:none;"><div class="ico"><i class="ph-bold ph-wrench"></i></div>Tidak ada data sparepart yang cocok.</div>
05125:         </div>
05126:         <div class="sp-pagination" id="sp-collect-pagination"></div>
05127:       </div>
05128: 
05129:       <!-- ============ TAB 2: PO MONITORING ============ -->
05130:       <div id="sp-tabPO" class="sp-tab-panel">
05131:         <div class="sp-dash-grid" id="sp-po-dash"></div>
05132: 
05133:         <div class="card" style="margin-bottom:16px;">
05134:           <div class="section-title"><i class="ph-bold ph-plus-circle"></i> Tambah Purchase Order</div>
05135:           <div class="grid2">
05136:             <div class="field"><label>Nama Material / Spare Part</label><input type="text" id="sp-eta-nama" placeholder="Nama material/sparepart"></div>
05137:             <div class="field"><label>Material Number SAP (opsional)</label><input type="text" id="sp-eta-sap" placeholder="Nomor SAP"></div>
05138:             <div class="field"><label>Nomor PO</label><input type="text" id="sp-eta-nopo" placeholder="Nomor Purchase Order"></div>
05139:             <div class="field"><label>Vendor</label><input type="text" id="sp-eta-vendor" placeholder="Nama vendor/supplier"></div>
05140:             <div class="field"><label>Qty PO</label><input type="number" id="sp-eta-qty" min="1" placeholder="1"></div>
05141:             <div class="field"><label>Tanggal Order</label><input type="date" id="sp-eta-tglpo"></div>
05142:             <div class="field"><label>ETA (Estimasi Tiba)</label><input type="date" id="sp-eta-tgletaeta"></div>
05143:             <div class="field" style="grid-column:1/-1;"><label>Catatan (opsional)</label><input type="text" id="sp-eta-catatan" placeholder="Nomor tracking, dsb."></div>
05144:           </div>
05145:           <button type="button" class="btn btn-sm btn-primary" id="btn-add-sparepart-eta" style="margin-top:6px;"><i class="ph-bold ph-plus"></i> Simpan PO</button>
05146:         </div>
05147: 
05148:         <div class="filter-bar sp-sticky-filter">
05149:           <input class="grow" type="text" id="search-sparepart-eta" placeholder="Cari material, SAP, nomor PO, vendor...">
05150:           <select id="filter-sparepart-eta-status">
05151:             <option value="">Semua Status</option>
05152:             <option value="waiting">Waiting</option>
05153:             <option value="intransit">In Transit</option>
05154:             <option value="overdue">Overdue</option>
05155:             <option value="arrived">Arrived</option>
05156:             <option value="warehouse">Warehouse</option>
~~~

### Around line 5235
~~~text
05223:           <div class="sub" style="margin-bottom:12px;">
05224:             Satu data master per Material Number SAP dipakai bersama oleh SELURUH fitur yang berhubungan dengan sparepart:
05225:             kartu ringkasan &amp; grafik cost di menu Sparepart, kartu lokasi rak yang otomatis dicocokkan dari form input Logbook,
05226:             dan Stock Sistem di checklist Stock Opname. Cukup diisi/diedit di satu tempat ini.
05227:             <br>Sebelumnya ada di menu Master Koneksi, sekarang dipindah ke sini supaya 1 tempat dengan Daily Collection &amp; PO Monitoring.
05228:           </div>
05229:           <div class="grid3">
05230:             <div class="field"><label>Material Number SAP</label><input type="text" id="sl-sap" placeholder="1000234567"></div>
05231:             <div class="field"><label>Nama Material</label><input type="text" id="sl-nama" placeholder="Bearing 6205"></div>
05232:             <div class="field"><label>Lokasi Gudang/Rak</label><input type="text" id="sl-lokasi" placeholder="Gudang A - Rak 3B"></div>
05233:           </div>
05234:           <div class="grid3">
05235:             <div class="field"><label>Harga Satuan (Rp)</label><input type="number" id="sl-harga" min="0" step="100" placeholder="0"></div>
05236:             <div class="field"><label>Stock Qty</label><input type="number" id="sl-stock" min="0" step="1" placeholder="0"></div>
05237:             <div class="field"><label>Satuan</label><input type="text" id="sl-satuan" placeholder="cth: pcs, unit, set"></div>
05238:           </div>
05239:           <button class="btn btn-sm" id="btn-save-sparepart-lokasi">+ Simpan Data Sparepart</button>
05240:           <button class="btn btn-sm" id="btn-cancel-edit-sparepart-lokasi" style="display:none;">Batal Edit</button>
05241:           <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
05242:             <div class="field" style="flex:1 1 280px;margin:0;">
05243:               <label for="search-master-sparepart">Cari Sparepart</label>
05244:               <div style="position:relative;">
05245:                 <i class="ph-bold ph-magnifying-glass" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
05246:                 <input type="search" id="search-master-sparepart" placeholder="Cari Nama Material atau Material Number SAP..." autocomplete="off" style="padding-left:36px;">
05247:               </div>
05248:             </div>
05249:             <button type="button" class="btn btn-sm" id="btn-reset-master-sparepart-search" style="margin-top:18px;"><i class="ph-bold ph-x"></i> Reset</button>
05250:           </div>
05251:           <div id="master-sparepart-search-info" style="font-size:12px;color:var(--text-dim);margin-top:6px;"></div>
05252:           <div style="margin-top:10px;" id="sparepart-lokasi-table"></div>
05253:         </div>
05254:       </div>
05255:     </section>
05256: 
05257:     <section class="view" id="view-expert-finder">
05258:       <div class="topbar">
05259:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05260:         <div><h1>People Intelligence</h1><div class="sub">Ranking personil paling berpengalaman, dihitung otomatis dari histori Logbook (Nama Pelapor, Status, Jenis Pekerjaan) yang sudah tersimpan — tidak ada data baru yang perlu diisi.</div></div>
05261:         <div class="stat-strip" id="ef-stat-strip"></div>
05262:       </div>
05263:       <div class="filter-bar">
05264:         <input class="grow" type="text" id="search-expert-nama" placeholder="Cari nama personil...">
05265:         <input class="grow" type="text" id="search-expert-konteks" placeholder="Ranking khusus untuk mesin/masalah tertentu (mis. nama mesin, kode mesin, atau kata kunci masalah)...">
05266:         <button class="btn btn-sm" id="btn-reset-expert-konteks"><i class="ph-bold ph-x"></i> Reset Konteks</button>
05267:       </div>
05268:       <div class="sub" id="ef-konteks-info" style="margin:-6px 0 14px 2px;"></div>
05269:       <div id="list-expert-finder"></div>
05270:     </section>
05271: 
05272:     <section class="view" id="view-knowledge-graph">
05273:       <div class="topbar">
05274:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05275:         <div><h1>Knowledge Graph</h1><div class="sub">Visualisasi hubungan antar Personil, Mesin, Sparepart/SAP, dan Masalah — dibangun otomatis dari data Logbook yang sudah ada (vis-network). Klik node untuk detail, drag untuk atur posisi, scroll untuk zoom.</div></div>
05276:         <div class="stat-strip" id="kg-stat-strip"></div>
05277:       </div>
05278:       <div class="filter-bar">
05279:         <input class="grow" type="text" id="search-kg" placeholder="Cari & sorot node (nama personil, mesin, sparepart, kata kunci masalah)...">
05280:         <select id="filter-kg-type">
05281:           <option value="">Semua Tipe Node</option>
05282:           <option value="personil">Personil</option>
05283:           <option value="mesin">Mesin</option>
05284:           <option value="sparepart">Sparepart</option>
05285:           <option value="masalah">Masalah</option>
05286:         </select>
05287:         <button class="btn btn-sm" id="btn-kg-reset-view"><i class="ph-bold ph-arrows-out-cardinal"></i> Reset Tampilan</button>
05288:       </div>
05289:       <div class="card" style="padding:0;overflow:hidden;">
05290:         <div id="kg-network" style="width:100%;height:70vh;background:var(--panel-2);"></div>
05291:       </div>
05292:       <div class="card" id="kg-node-detail" style="margin-top:16px;display:none;"></div>
05293:     </section>
05294: 
05295:     <section class="view" id="view-wiki">
05296:       <style>
05297:         .wiki-group-list{display:grid;gap:8px;margin-top:8px;}
05298:         .wiki-group-card{border:1px solid var(--line);border-radius:10px;background:var(--panel-2);overflow:hidden;}
05299:         .wiki-group-card>summary{cursor:pointer;list-style:none;padding:10px 12px;display:flex;justify-content:space-between;gap:10px;align-items:center;font-weight:700;}
~~~

### Around line 5237
~~~text
05225:             kartu ringkasan &amp; grafik cost di menu Sparepart, kartu lokasi rak yang otomatis dicocokkan dari form input Logbook,
05226:             dan Stock Sistem di checklist Stock Opname. Cukup diisi/diedit di satu tempat ini.
05227:             <br>Sebelumnya ada di menu Master Koneksi, sekarang dipindah ke sini supaya 1 tempat dengan Daily Collection &amp; PO Monitoring.
05228:           </div>
05229:           <div class="grid3">
05230:             <div class="field"><label>Material Number SAP</label><input type="text" id="sl-sap" placeholder="1000234567"></div>
05231:             <div class="field"><label>Nama Material</label><input type="text" id="sl-nama" placeholder="Bearing 6205"></div>
05232:             <div class="field"><label>Lokasi Gudang/Rak</label><input type="text" id="sl-lokasi" placeholder="Gudang A - Rak 3B"></div>
05233:           </div>
05234:           <div class="grid3">
05235:             <div class="field"><label>Harga Satuan (Rp)</label><input type="number" id="sl-harga" min="0" step="100" placeholder="0"></div>
05236:             <div class="field"><label>Stock Qty</label><input type="number" id="sl-stock" min="0" step="1" placeholder="0"></div>
05237:             <div class="field"><label>Satuan</label><input type="text" id="sl-satuan" placeholder="cth: pcs, unit, set"></div>
05238:           </div>
05239:           <button class="btn btn-sm" id="btn-save-sparepart-lokasi">+ Simpan Data Sparepart</button>
05240:           <button class="btn btn-sm" id="btn-cancel-edit-sparepart-lokasi" style="display:none;">Batal Edit</button>
05241:           <div style="margin-top:16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
05242:             <div class="field" style="flex:1 1 280px;margin:0;">
05243:               <label for="search-master-sparepart">Cari Sparepart</label>
05244:               <div style="position:relative;">
05245:                 <i class="ph-bold ph-magnifying-glass" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-dim);"></i>
05246:                 <input type="search" id="search-master-sparepart" placeholder="Cari Nama Material atau Material Number SAP..." autocomplete="off" style="padding-left:36px;">
05247:               </div>
05248:             </div>
05249:             <button type="button" class="btn btn-sm" id="btn-reset-master-sparepart-search" style="margin-top:18px;"><i class="ph-bold ph-x"></i> Reset</button>
05250:           </div>
05251:           <div id="master-sparepart-search-info" style="font-size:12px;color:var(--text-dim);margin-top:6px;"></div>
05252:           <div style="margin-top:10px;" id="sparepart-lokasi-table"></div>
05253:         </div>
05254:       </div>
05255:     </section>
05256: 
05257:     <section class="view" id="view-expert-finder">
05258:       <div class="topbar">
05259:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05260:         <div><h1>People Intelligence</h1><div class="sub">Ranking personil paling berpengalaman, dihitung otomatis dari histori Logbook (Nama Pelapor, Status, Jenis Pekerjaan) yang sudah tersimpan — tidak ada data baru yang perlu diisi.</div></div>
05261:         <div class="stat-strip" id="ef-stat-strip"></div>
05262:       </div>
05263:       <div class="filter-bar">
05264:         <input class="grow" type="text" id="search-expert-nama" placeholder="Cari nama personil...">
05265:         <input class="grow" type="text" id="search-expert-konteks" placeholder="Ranking khusus untuk mesin/masalah tertentu (mis. nama mesin, kode mesin, atau kata kunci masalah)...">
05266:         <button class="btn btn-sm" id="btn-reset-expert-konteks"><i class="ph-bold ph-x"></i> Reset Konteks</button>
05267:       </div>
05268:       <div class="sub" id="ef-konteks-info" style="margin:-6px 0 14px 2px;"></div>
05269:       <div id="list-expert-finder"></div>
05270:     </section>
05271: 
05272:     <section class="view" id="view-knowledge-graph">
05273:       <div class="topbar">
05274:         <button class="btn btn-sm btn-back-to-insights" onclick="goToView('insights-hub')" style="margin-right:8px;"><i class="ph-bold ph-arrow-left"></i></button>
05275:         <div><h1>Knowledge Graph</h1><div class="sub">Visualisasi hubungan antar Personil, Mesin, Sparepart/SAP, dan Masalah — dibangun otomatis dari data Logbook yang sudah ada (vis-network). Klik node untuk detail, drag untuk atur posisi, scroll untuk zoom.</div></div>
05276:         <div class="stat-strip" id="kg-stat-strip"></div>
05277:       </div>
05278:       <div class="filter-bar">
05279:         <input class="grow" type="text" id="search-kg" placeholder="Cari & sorot node (nama personil, mesin, sparepart, kata kunci masalah)...">
05280:         <select id="filter-kg-type">
05281:           <option value="">Semua Tipe Node</option>
05282:           <option value="personil">Personil</option>
05283:           <option value="mesin">Mesin</option>
05284:           <option value="sparepart">Sparepart</option>
05285:           <option value="masalah">Masalah</option>
05286:         </select>
05287:         <button class="btn btn-sm" id="btn-kg-reset-view"><i class="ph-bold ph-arrows-out-cardinal"></i> Reset Tampilan</button>
05288:       </div>
05289:       <div class="card" style="padding:0;overflow:hidden;">
05290:         <div id="kg-network" style="width:100%;height:70vh;background:var(--panel-2);"></div>
05291:       </div>
05292:       <div class="card" id="kg-node-detail" style="margin-top:16px;display:none;"></div>
05293:     </section>
05294: 
05295:     <section class="view" id="view-wiki">
05296:       <style>
05297:         .wiki-group-list{display:grid;gap:8px;margin-top:8px;}
05298:         .wiki-group-card{border:1px solid var(--line);border-radius:10px;background:var(--panel-2);overflow:hidden;}
05299:         .wiki-group-card>summary{cursor:pointer;list-style:none;padding:10px 12px;display:flex;justify-content:space-between;gap:10px;align-items:center;font-weight:700;}
05300:         .wiki-group-card>summary::-webkit-details-marker{display:none;}
05301:         .wiki-group-content{padding:10px 12px;border-top:1px solid var(--line-soft);}
~~~

### Around line 12741
~~~text
12729:       saveSparepartStatusLocal();
12730:       return true;
12731:     }
12732:   }catch(e){ /* backend tidak tersedia: pakai cache lokal yang sudah dimuat */ }
12733:   return false;
12734: }
12735: 
12736: /* ---------------- MASTER SPAREPART: LOKASI, HARGA & STOCK GUDANG (Setting) ----------------
12737:    [EDIT] Sebelumnya "Stock Sparepart Gudang" (read-only, sheet terpisah
12738:    Stock_Sparepart) dan "Lokasi & Harga Sparepart" (Sparepart_Lokasi, CRUD)
12739:    adalah dua card & dua sumber data yang terpisah. Sekarang DIGABUNG jadi
12740:    satu master (SPAREPART_LOKASI, dari sheet Sparepart_Lokasi yang sudah
12741:    diperluas kolomnya: SAP, Nama, Lokasi Gudang, Harga Satuan, Stock Qty,
12742:    Satuan) supaya SATU Material Number SAP = SATU baris data yang dipakai
12743:    bersama oleh SELURUH fitur sparepart: kartu & grafik cost di menu
12744:    Sparepart, kartu lokasi rak di form input Logbook, dan Stock Sistem di
12745:    Stock Opname (dulu baca dari STOCK_SPAREPART terpisah, sekarang dari
12746:    sini juga -- lihat findStockSistemBySap di bawah). Backend otomatis
12747:    meng-impor sisa data dari sheet Stock_Sparepart lama (kalau ada) ke
12748:    master ini sekali jalan, jadi tidak ada data yang hilang. */
12749: let SPAREPART_LOKASI = [];
12750: let SPAREPART_LOKASI_EDIT_SAP = null;
12751: let SPAREPART_LOKASI_EDIT_NAME = null;
12752: 
12753: function loadSparepartLokasiLocal(){ try{ return JSON.parse(localStorage.getItem(LS_SPAREPART_LOKASI_KEY)||'[]'); }catch(e){ return []; } }
12754: function saveSparepartLokasiLocal(list){ localStorage.setItem(LS_SPAREPART_LOKASI_KEY, JSON.stringify(list)); SPAREPART_LOKASI = list; }
12755: async function syncSparepartLokasiFromBackend(){
12756:   SPAREPART_LOKASI = loadSparepartLokasiLocal();
12757:   if(!WEB_APP_URL) return SPAREPART_LOKASI;
12758:   try{
12759:     const remote = await apiGet('sparepartLokasi');
12760:     if(Array.isArray(remote)){
12761:       const normalized = remote.map(r=>({
12762:         sap: String(r['Material Number SAP']||'').trim(),
12763:         nama: r['Nama Material']||'',
12764:         lokasiGudang: r['Lokasi Gudang']||'',
12765:         harga: Number(r['Harga Satuan']) || 0,
12766:         stockQty: (r['Stock Qty']===''||r['Stock Qty']==null) ? null : Number(r['Stock Qty']),
12767:         satuan: r['Satuan']||'',
12768:         needsReview: r['Perlu Verifikasi']===true || String(r['Perlu Verifikasi']).toLowerCase()==='true',
12769:         sourceLogbook: r['Sumber Logbook']||''
12770:       }));
12771:       saveSparepartLokasiLocal(normalized);
12772:     }
12773:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12774:   return SPAREPART_LOKASI;
12775: }
12776: function findSparepartLokasiBySap(sap){
12777:   const s = String(sap||'').trim();
12778:   if(!s) return null;
12779:   return SPAREPART_LOKASI.find(x=> x.sap === s) || null;
12780: }
12781: // [EDIT] Menggantikan findStockSistemBySap yang dulu baca dari STOCK_SPAREPART
12782: // (sheet Stock_Sparepart terpisah, perlu tombol "Muat Ulang Stock" manual) --
12783: // sekarang Stock Qty adalah bagian dari master SPAREPART_LOKASI yang sama,
12784: // jadi otomatis tersedia begitu SPAREPART_LOKASI sudah dimuat (loadAll),
12785: // tanpa perlu langkah muat ulang terpisah.
12786: function findStockSistemBySap(sap){
12787:   const r = findSparepartLokasiBySap(sap);
12788:   return (r && r.stockQty != null) ? r.stockQty : null;
12789: }
12790: function resetSparepartLokasiForm(){
12791:   SPAREPART_LOKASI_EDIT_SAP = null;
12792:   SPAREPART_LOKASI_EDIT_NAME = null;
12793:   $('#sl-sap').value=''; $('#sl-nama').value=''; $('#sl-lokasi').value=''; $('#sl-harga').value='';
12794:   const stockEl = $('#sl-stock'), satuanEl = $('#sl-satuan');
12795:   if(stockEl) stockEl.value=''; if(satuanEl) satuanEl.value='';
12796:   $('#btn-save-sparepart-lokasi').innerHTML = '+ Simpan Data Sparepart';
12797:   $('#btn-cancel-edit-sparepart-lokasi').style.display = 'none';
12798: }
12799: let SPAREPART_LOKASI_SEARCH = '';
12800: function renderSparepartLokasiTable(){
12801:   const holder = $('#sparepart-lokasi-table');
12802:   if(!holder) return;
12803:   const q = String(SPAREPART_LOKASI_SEARCH||'').trim().toLowerCase();
12804:   const rows = !q ? SPAREPART_LOKASI : SPAREPART_LOKASI.filter(r=>
12805:     String(r.nama||'').toLowerCase().includes(q) || String(r.sap||'').toLowerCase().includes(q)
~~~

### Around line 12742
~~~text
12730:       return true;
12731:     }
12732:   }catch(e){ /* backend tidak tersedia: pakai cache lokal yang sudah dimuat */ }
12733:   return false;
12734: }
12735: 
12736: /* ---------------- MASTER SPAREPART: LOKASI, HARGA & STOCK GUDANG (Setting) ----------------
12737:    [EDIT] Sebelumnya "Stock Sparepart Gudang" (read-only, sheet terpisah
12738:    Stock_Sparepart) dan "Lokasi & Harga Sparepart" (Sparepart_Lokasi, CRUD)
12739:    adalah dua card & dua sumber data yang terpisah. Sekarang DIGABUNG jadi
12740:    satu master (SPAREPART_LOKASI, dari sheet Sparepart_Lokasi yang sudah
12741:    diperluas kolomnya: SAP, Nama, Lokasi Gudang, Harga Satuan, Stock Qty,
12742:    Satuan) supaya SATU Material Number SAP = SATU baris data yang dipakai
12743:    bersama oleh SELURUH fitur sparepart: kartu & grafik cost di menu
12744:    Sparepart, kartu lokasi rak di form input Logbook, dan Stock Sistem di
12745:    Stock Opname (dulu baca dari STOCK_SPAREPART terpisah, sekarang dari
12746:    sini juga -- lihat findStockSistemBySap di bawah). Backend otomatis
12747:    meng-impor sisa data dari sheet Stock_Sparepart lama (kalau ada) ke
12748:    master ini sekali jalan, jadi tidak ada data yang hilang. */
12749: let SPAREPART_LOKASI = [];
12750: let SPAREPART_LOKASI_EDIT_SAP = null;
12751: let SPAREPART_LOKASI_EDIT_NAME = null;
12752: 
12753: function loadSparepartLokasiLocal(){ try{ return JSON.parse(localStorage.getItem(LS_SPAREPART_LOKASI_KEY)||'[]'); }catch(e){ return []; } }
12754: function saveSparepartLokasiLocal(list){ localStorage.setItem(LS_SPAREPART_LOKASI_KEY, JSON.stringify(list)); SPAREPART_LOKASI = list; }
12755: async function syncSparepartLokasiFromBackend(){
12756:   SPAREPART_LOKASI = loadSparepartLokasiLocal();
12757:   if(!WEB_APP_URL) return SPAREPART_LOKASI;
12758:   try{
12759:     const remote = await apiGet('sparepartLokasi');
12760:     if(Array.isArray(remote)){
12761:       const normalized = remote.map(r=>({
12762:         sap: String(r['Material Number SAP']||'').trim(),
12763:         nama: r['Nama Material']||'',
12764:         lokasiGudang: r['Lokasi Gudang']||'',
12765:         harga: Number(r['Harga Satuan']) || 0,
12766:         stockQty: (r['Stock Qty']===''||r['Stock Qty']==null) ? null : Number(r['Stock Qty']),
12767:         satuan: r['Satuan']||'',
12768:         needsReview: r['Perlu Verifikasi']===true || String(r['Perlu Verifikasi']).toLowerCase()==='true',
12769:         sourceLogbook: r['Sumber Logbook']||''
12770:       }));
12771:       saveSparepartLokasiLocal(normalized);
12772:     }
12773:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12774:   return SPAREPART_LOKASI;
12775: }
12776: function findSparepartLokasiBySap(sap){
12777:   const s = String(sap||'').trim();
12778:   if(!s) return null;
12779:   return SPAREPART_LOKASI.find(x=> x.sap === s) || null;
12780: }
12781: // [EDIT] Menggantikan findStockSistemBySap yang dulu baca dari STOCK_SPAREPART
12782: // (sheet Stock_Sparepart terpisah, perlu tombol "Muat Ulang Stock" manual) --
12783: // sekarang Stock Qty adalah bagian dari master SPAREPART_LOKASI yang sama,
12784: // jadi otomatis tersedia begitu SPAREPART_LOKASI sudah dimuat (loadAll),
12785: // tanpa perlu langkah muat ulang terpisah.
12786: function findStockSistemBySap(sap){
12787:   const r = findSparepartLokasiBySap(sap);
12788:   return (r && r.stockQty != null) ? r.stockQty : null;
12789: }
12790: function resetSparepartLokasiForm(){
12791:   SPAREPART_LOKASI_EDIT_SAP = null;
12792:   SPAREPART_LOKASI_EDIT_NAME = null;
12793:   $('#sl-sap').value=''; $('#sl-nama').value=''; $('#sl-lokasi').value=''; $('#sl-harga').value='';
12794:   const stockEl = $('#sl-stock'), satuanEl = $('#sl-satuan');
12795:   if(stockEl) stockEl.value=''; if(satuanEl) satuanEl.value='';
12796:   $('#btn-save-sparepart-lokasi').innerHTML = '+ Simpan Data Sparepart';
12797:   $('#btn-cancel-edit-sparepart-lokasi').style.display = 'none';
12798: }
12799: let SPAREPART_LOKASI_SEARCH = '';
12800: function renderSparepartLokasiTable(){
12801:   const holder = $('#sparepart-lokasi-table');
12802:   if(!holder) return;
12803:   const q = String(SPAREPART_LOKASI_SEARCH||'').trim().toLowerCase();
12804:   const rows = !q ? SPAREPART_LOKASI : SPAREPART_LOKASI.filter(r=>
12805:     String(r.nama||'').toLowerCase().includes(q) || String(r.sap||'').toLowerCase().includes(q)
12806:   );
~~~

## editLogbook
No match.

## logbook-edit
No match.

## materialSelect
No match.

## addLogbookMaterial
No match.

## function renderLogbook
No match.

## function openEditLogbook
No match.

## function saveLogbook
No match.

## location.reload
### Around line 8087
~~~text
08075:   }
08076:   const form = document.getElementById('form-login');
08077:   if(form) form.reset();
08078:   const errEl = document.getElementById('login-err');
08079:   if(errEl) errEl.textContent = '';
08080:   const userField = document.getElementById('login-username');
08081:   if(userField) setTimeout(()=> userField.focus(), 50);
08082: 
08083:   // Hapus state runtime akun lama lalu reload. Cache data/draft/offline
08084:   // tidak dihapus: semuanya sudah dipindahkan ke namespace akun yang logout,
08085:   // sehingga akun berikutnya tidak mewarisi cache tersebut.
08086:   try{ READY_READS.clear(); ACTIVE_READS.clear(); READ_GENERATION++; }catch(e){}
08087:   setTimeout(()=> location.reload(), 60);
08088: }
08089: document.addEventListener('click', (e)=>{
08090:   if(e.target.closest('#btn-logout')){
08091:     if(confirm('Keluar dari aplikasi? Anda perlu login lagi untuk melanjutkan.')) logoutUser();
08092:   }
08093: });
08094: 
08095: /* ---------------- OFFLINE MODE: ANTREAN SINKRON OTOMATIS ----------------
08096:    Aplikasi ini SUDAH menyimpan semua data ke localStorage dulu sebelum
08097:    mengirim ke backend (lihat pola persistPmReport, saveGrReportsLocal, dkk),
08098:    jadi tetap bisa dipakai penuh tanpa internet. Yang ditambahkan di sini:
08099:    setiap kali apiPost gagal karena masalah jaringan, payload-nya diantre;
08100:    begitu koneksi kembali (event 'online' / polling berkala), antrean ini
08101:    otomatis dikirim ulang ke backend tanpa perlu aksi manual dari pengguna. */
08102: const LS_SYNC_QUEUE_KEY = 'logbook_pending_sync_queue';
08103: let APP_ONLINE_STATUS = navigator.onLine;
08104: 
08105: function loadSyncQueue_(){ try{ return JSON.parse(localStorage.getItem(LS_SYNC_QUEUE_KEY) || '[]'); }catch(e){ return []; } }
08106: function saveSyncQueue_(q){ localStorage.setItem(LS_SYNC_QUEUE_KEY, JSON.stringify(q)); renderOfflineBanner(); }
08107: function isSecurityConfigAction_(action){
08108:   return ['savePermissions','saveLcPermissions','saveRoleAccessConfig','createUser','updateUser','resetPassword','setUserActive','deleteUser'].includes(String(action||''));
08109: }
08110: function queueForSync_(payload){
08111:   // Konfigurasi keamanan harus online-only. Jangan simpan request role/permission
08112:   // ke antrean offline karena request lama dapat menimpa konfigurasi terbaru saat
08113:   // koneksi pulih beberapa menit/jam kemudian.
08114:   if(isSecurityConfigAction_(payload && payload.action)) return;
08115:   const q = loadSyncQueue_();
08116:   const queuedPayload = {...payload};
08117:   delete queuedPayload.sessionToken;
08118:   // Cegah item identik menumpuk jika pengguna menekan simpan lagi setelah
08119:   // timeout. Payload berbeda tetap dipertahankan sebagai operasi terpisah.
08120:   const signature = JSON.stringify(queuedPayload);
08121:   if(q.some(item => JSON.stringify(item.payload) === signature)){
08122:     renderOfflineBanner();
08123:     return;
08124:   }
08125:   q.push({ id: 'sync_'+Date.now()+'_'+Math.random().toString(36).slice(2), payload:queuedPayload, ts: Date.now() });
08126:   saveSyncQueue_(q);
08127: }
08128: 
08129: async function flushSyncQueue_(){
08130:   if(!WEB_APP_URL) return;
08131:   const q = loadSyncQueue_();
08132:   if(!q.length) return;
08133:   const remaining = [];
08134:   let discardedSecurityConfig = 0;
08135:   for(const item of q){
08136:     if(isSecurityConfigAction_(item && item.payload && item.payload.action)){ discardedSecurityConfig++; continue; }
08137:     try{
08138:       if(!SESSION_TOKEN) throw new Error('AUTH_REQUIRED');
08139:       const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
08140:       const res = await fetchWithTimeout_(WEB_APP_URL, { method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body: JSON.stringify({...item.payload, sessionToken:requestToken}) }, 60000); // PATCHED 60s
08141:       const json = await parseApiResponse_(res);
08142:       if(!json.ok) throw new Error(json.error || 'gagal');
08143:     }catch(e){
08144:       remaining.push(item); // masih gagal, coba lagi di kesempatan berikutnya
08145:     }
08146:   }
08147:   const successCount = q.length - remaining.length - discardedSecurityConfig;
08148:   saveSyncQueue_(remaining);
08149:   if(successCount > 0){
08150:     setAppOnlineStatus(true);
08151:     toast(`${successCount} data berhasil disinkron otomatis ke server.`);
~~~

### Around line 8373
~~~text
08361: function clearViewLocalCache(viewId){
08362:   const cfg = getViewLocalStorageKeys()[viewId];
08363:   if(!cfg) return;
08364:   const ok = confirm(
08365:     `Hapus cache lokal "${cfg.label}" di browser ini?\n\n`+
08366:     `- Data yang SUDAH tersimpan di database SQLite TIDAK akan terhapus.\n`+
08367:     `- Hanya salinan/cache di browser ini yang dibersihkan (berguna kalau ada data lama/rusak yang masih nyangkut).\n`+
08368:     `- Halaman akan otomatis reload setelah ini.`
08369:   );
08370:   if(!ok) return;
08371:   cfg.keys.forEach(k=>{ try{ localStorage.removeItem(k); }catch(e){} });
08372:   toast('Cache lokal "'+cfg.label+'" berhasil dihapus. Memuat ulang halaman...');
08373:   setTimeout(()=> location.reload(), 600);
08374: }
08375: function ensureClearLocalCacheButton(viewId){
08376:   const cfg = getViewLocalStorageKeys()[viewId];
08377:   const section = document.getElementById('view-' + viewId);
08378:   if(!section) return;
08379:   const topbar = section.querySelector('.topbar');
08380:   if(!topbar) return;
08381:   let btn = topbar.querySelector('.btn-clear-local-cache');
08382:   if(!cfg){ if(btn) btn.remove(); return; }
08383:   if(!btn){
08384:     btn = document.createElement('button');
08385:     btn.type = 'button';
08386:     btn.className = 'btn btn-sm btn-clear-local-cache';
08387:     btn.style.marginLeft = 'auto';
08388:     btn.innerHTML = '<i class="ph-bold ph-trash"></i> Hapus Cache Lokal';
08389:     btn.title = 'Hapus cache localStorage halaman ini di browser (tidak menghapus data di database SQLite)';
08390:     btn.addEventListener('click', ()=> clearViewLocalCache(viewId));
08391:     topbar.appendChild(btn);
08392:   }
08393: }
08394: function openNavGroup(group){
08395:   Array.from(document.querySelectorAll('.nav-parent-btn[data-group]')).forEach(b=>{
08396:     const groupKey = b.dataset.group;
08397:     const sub = document.querySelector(`.nav-submenu[data-submenu="${groupKey}"]`);
08398:     if(!sub) return;
08399:     if(groupKey === group){ b.classList.add('active','open'); sub.classList.add('open'); }
08400:     else { b.classList.remove('active'); }
08401:   });
08402: }
08403: Array.from(document.querySelectorAll('.nav-parent-btn[data-group]')).forEach(btn=>{
08404:   btn.addEventListener('click', ()=>{
08405:     const groupKey = btn.dataset.group;
08406:     if(!groupKey) return;
08407:     const sub = document.querySelector(`.nav-submenu[data-submenu="${groupKey}"]`);
08408:     if(!sub) return;
08409:     const willOpen = !sub.classList.contains('open');
08410:     sub.classList.toggle('open', willOpen);
08411:     btn.classList.toggle('open', willOpen);
08412:   });
08413: });
08414: const VIEW_PERMISSION_PARENT = Object.freeze({
08415:   mesin:'utama', tanggal:'utama', pelapor:'utama', group:'utama',
08416:   rca:'report', 'report-hub':'report', 'project-report':'report', ai:'report'
08417: });
08418: function permissionViewFor_(view){
08419:   view = String(view||'').trim();
08420:   return VIEW_PERMISSION_PARENT[view] || view;
08421: }
08422: function canAccessView_(view){
08423:   view = String(view||'').trim();
08424:   if(!view) return false;
08425:   if(view === 'omodos4' || view.startsWith('omodos4-')) return isSuperadmin();
08426:   const permissionView = permissionViewFor_(view);
08427:   if(permissionView === 'dashboard') return true;
08428:   const permKey = 'view.' + permissionView;
08429:   const knownFeature = FEATURE_REGISTRY.some(f => f.PermissionKey === permKey);
08430:   return !knownFeature || hasPermission(permKey);
08431: }
08432: function canAccessAnyView_(views){
08433:   return (views||[]).some(v=>canAccessView_(v));
08434: }
08435: function canAccessLogbookDetail_(){
08436:   return canAccessAnyView_(['input','utama','mesin','tanggal','pelapor','group']);
08437: }
~~~

## screen.orientation
### Around line 21961
~~~text
21949:   const element = document.documentElement; // Mengambil seluruh halaman HTML
21950: 
21951:   if (element.requestFullscreen) {
21952:     element.requestFullscreen().catch(()=>{});
21953:   } else if (element.webkitRequestFullscreen) { /* Safari / iOS */
21954:     element.webkitRequestFullscreen();
21955:   } else if (element.msRequestFullscreen) { /* IE11 */
21956:     element.msRequestFullscreen();
21957:   }
21958:   // Kunci ke orientasi landscape kalau tablet dipasang mendatar -- opsional,
21959:   // browser yang tidak mendukung Screen Orientation API akan diam saja.
21960:   try{
21961:     if (screen.orientation && screen.orientation.lock) {
21962:       screen.orientation.lock('landscape').catch(()=>{});
21963:     }
21964:   }catch(e){}
21965: }
21966: 
21967: // Opsi A: Memicu fullscreen ketika tombol login ditekan (Direkomendasikan)
21968: // Silakan sesuaikan ID/Class form login Anda. Contoh:
21969: const loginForm = document.querySelector('.login-box form') || document.querySelector('form');
21970: if (loginForm) {
21971:   loginForm.addEventListener('submit', () => {
21972:     aktifkanFullscreen();
21973:   });
21974: }
21975: 
21976: // Opsi B: Memicu fullscreen secara halus saat pengguna mengetuk bagian layar mana saja untuk pertama kalinya
21977: document.addEventListener('click', () => {
21978:   aktifkanFullscreen();
21979: }, { once: true }); // 'once: true' memastikan ini hanya berjalan satu kali saat klik pertama
21980: 
21981: // Opsi C: coba lagi otomatis setiap kali user kembali ke tab ini (mis. tablet
21982: // sempat dikunci lalu dibuka lagi) -- browser kadang keluar dari fullscreen
21983: // API saat layar dikunci.
21984: document.addEventListener('visibilitychange', () => {
21985:   if (document.visibilityState === 'visible') aktifkanFullscreen();
21986: });
21987: 
21988: /* =========================================================
21989:    AI MAINTENANCE COPILOT
21990:    Rule engine yang membaca ENTRIES/MACHINES/KB_ENTRIES yang sama
21991:    dengan menu Analitik & Knowledge Base, lalu menyusun insight
21992:    berbahasa natural. Tidak memanggil API eksternal apa pun — semua
21993:    dihitung di browser sehingga gratis, instan, dan datanya konsisten
21994:    dengan menu lain di aplikasi ini.
21995:    ========================================================= */
21996: 
21997: // Interval default Preventive Maintenance (hari) dipakai untuk deteksi
21998: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21999: // localStorage per-browser, tidak mengubah data di database SQLite).
22000: function copilotPmIntervalDays(){
22001:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
22002: }
22003: 
22004: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
22005: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
22006: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
22007: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
22008: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
22009: function copilotEntriesFor(kodeOrNama){
22010:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
22011:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
22012: }
22013: 
22014: // Total downtime (menit) dalam suatu bulan kalender (0-indexed month) utk scope tertentu
22015: function copilotMonthDowntime(kodeOrNama, year, month){
22016:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).reduce((sum,e)=>{
22017:     const d = new Date(e['Tanggal']);
22018:     if(isNaN(d) || d.getFullYear()!==year || d.getMonth()!==month) return sum;
22019:     return sum + (parseDurationMinutes(e)||0);
22020:   }, 0);
22021: }
22022: function copilotMonthBreakdownCount(kodeOrNama, year, month){
22023:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).filter(e=>{
22024:     const d = new Date(e['Tanggal']);
22025:     return !isNaN(d) && d.getFullYear()===year && d.getMonth()===month;
~~~

### Around line 21962
~~~text
21950: 
21951:   if (element.requestFullscreen) {
21952:     element.requestFullscreen().catch(()=>{});
21953:   } else if (element.webkitRequestFullscreen) { /* Safari / iOS */
21954:     element.webkitRequestFullscreen();
21955:   } else if (element.msRequestFullscreen) { /* IE11 */
21956:     element.msRequestFullscreen();
21957:   }
21958:   // Kunci ke orientasi landscape kalau tablet dipasang mendatar -- opsional,
21959:   // browser yang tidak mendukung Screen Orientation API akan diam saja.
21960:   try{
21961:     if (screen.orientation && screen.orientation.lock) {
21962:       screen.orientation.lock('landscape').catch(()=>{});
21963:     }
21964:   }catch(e){}
21965: }
21966: 
21967: // Opsi A: Memicu fullscreen ketika tombol login ditekan (Direkomendasikan)
21968: // Silakan sesuaikan ID/Class form login Anda. Contoh:
21969: const loginForm = document.querySelector('.login-box form') || document.querySelector('form');
21970: if (loginForm) {
21971:   loginForm.addEventListener('submit', () => {
21972:     aktifkanFullscreen();
21973:   });
21974: }
21975: 
21976: // Opsi B: Memicu fullscreen secara halus saat pengguna mengetuk bagian layar mana saja untuk pertama kalinya
21977: document.addEventListener('click', () => {
21978:   aktifkanFullscreen();
21979: }, { once: true }); // 'once: true' memastikan ini hanya berjalan satu kali saat klik pertama
21980: 
21981: // Opsi C: coba lagi otomatis setiap kali user kembali ke tab ini (mis. tablet
21982: // sempat dikunci lalu dibuka lagi) -- browser kadang keluar dari fullscreen
21983: // API saat layar dikunci.
21984: document.addEventListener('visibilitychange', () => {
21985:   if (document.visibilityState === 'visible') aktifkanFullscreen();
21986: });
21987: 
21988: /* =========================================================
21989:    AI MAINTENANCE COPILOT
21990:    Rule engine yang membaca ENTRIES/MACHINES/KB_ENTRIES yang sama
21991:    dengan menu Analitik & Knowledge Base, lalu menyusun insight
21992:    berbahasa natural. Tidak memanggil API eksternal apa pun — semua
21993:    dihitung di browser sehingga gratis, instan, dan datanya konsisten
21994:    dengan menu lain di aplikasi ini.
21995:    ========================================================= */
21996: 
21997: // Interval default Preventive Maintenance (hari) dipakai untuk deteksi
21998: // "PM terlambat". Bisa diubah pengguna lewat panel Copilot (disimpan di
21999: // localStorage per-browser, tidak mengubah data di database SQLite).
22000: function copilotPmIntervalDays(){
22001:   return parseInt(localStorage.getItem('copilot_pm_interval') || '30', 10) || 30;
22002: }
22003: 
22004: // [FIX SOT] Fungsi ini dipakai ~10 perhitungan Copilot berbeda (MTBF, rasio
22005: // PM, breakdown bulan berjalan, dst) dan sengaja bersifat all-time (bukan
22006: // cuma 90 hari) -- jadi paling berisiko mencampur data historis OneNote
22007: // yang belum tervalidasi kalau tidak dibatasi di sini. Satu perbaikan di
22008: // titik ini otomatis berlaku untuk seluruh pemanggilnya.
22009: function copilotEntriesFor(kodeOrNama){
22010:   if(!kodeOrNama || kodeOrNama === '__all__') return sotEntries();
22011:   return sotEntries().filter(e=> machineRecordMatchesIdentity_(e,kodeOrNama));
22012: }
22013: 
22014: // Total downtime (menit) dalam suatu bulan kalender (0-indexed month) utk scope tertentu
22015: function copilotMonthDowntime(kodeOrNama, year, month){
22016:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).reduce((sum,e)=>{
22017:     const d = new Date(e['Tanggal']);
22018:     if(isNaN(d) || d.getFullYear()!==year || d.getMonth()!==month) return sum;
22019:     return sum + (parseDurationMinutes(e)||0);
22020:   }, 0);
22021: }
22022: function copilotMonthBreakdownCount(kodeOrNama, year, month){
22023:   return copilotEntriesFor(kodeOrNama).filter(anIsBreakdown).filter(e=>{
22024:     const d = new Date(e['Tanggal']);
22025:     return !isNaN(d) && d.getFullYear()===year && d.getMonth()===month;
22026:   }).length;
~~~

## orientationchange
### Around line 16616
~~~text
16604:   const cols = colTemplate ? colTemplate.split(/\s+/).filter(Boolean).length : 1;
16605:   const rows = Math.ceil(cards / Math.max(1, cols));
16606:   holder.classList.toggle('scroll-mode', rows > 3);
16607: }
16608: let DASH_GRID_RESIZE_TO = null;
16609: window.addEventListener('resize', ()=>{
16610:   clearTimeout(DASH_GRID_RESIZE_TO);
16611:   DASH_GRID_RESIZE_TO = setTimeout(()=>{
16612:     const viewDash = document.getElementById('view-dashboard');
16613:     if(viewDash && viewDash.classList.contains('active')) updateDashGridScrollMode();
16614:   }, 150);
16615: });
16616: window.addEventListener('orientationchange', ()=>{
16617:   setTimeout(()=>{
16618:     const viewDash = document.getElementById('view-dashboard');
16619:     if(viewDash && viewDash.classList.contains('active')) updateDashGridScrollMode();
16620:   }, 250);
16621: });
16622: 
16623: function startDashboardTimers(){
16624:   if(DASHBOARD_TIMER_INTERVAL) clearInterval(DASHBOARD_TIMER_INTERVAL);
16625:   updateDashboardTimers();
16626:   DASHBOARD_TIMER_INTERVAL = setInterval(updateDashboardTimers, 1000);
16627: }
16628: function updateDashboardTimers(){
16629:   $$('.dc-timer').forEach(el=>{
16630:     const startIso = el.dataset.start;
16631:     const start = startIso ? new Date(startIso) : null;
16632:     if(!start || isNaN(start)){ el.textContent = '⏱ --:--:--'; return; }
16633:     const diff = Math.max(0, Math.floor((Date.now() - start.getTime())/1000));
16634:     const hh = String(Math.floor(diff/3600)).padStart(2,'0');
16635:     const mm = String(Math.floor((diff%3600)/60)).padStart(2,'0');
16636:     const ss = String(diff%60).padStart(2,'0');
16637:     el.textContent = `⏱ ${hh}:${mm}:${ss} dari waktu kejadian.`;
16638:   });
16639: }
16640: 
16641: function openDashboardDetail(namaMesin, e){
16642:   if(!e){
16643:     $('#modal-content').innerHTML = `
16644:       <div class="modal-head">
16645:         <div><h2 style="font-family:var(--font-display);margin:0;">${escapeHtml(namaMesin)}</h2></div>
16646:         <button class="modal-close" id="btn-close-modal">✕</button>
16647:       </div>
16648:       <div class="empty-state" style="padding:24px;"><div class="ico"><i class="ph-bold ph-notebook"></i></div>Belum ada riwayat pekerjaan untuk mesin ini.</div>
16649:     `;
16650:     $('#modal-bg').classList.add('active');
16651:     $('#btn-close-modal').addEventListener('click', closeModal);
16652:     return;
16653:   }
16654:   const key = dashStatusKey(e['Status']);
16655:   const showTimer = key==='proses' || key==='emergency';
16656:   const rows = [
16657:     ['Nama Unit', e['Nama Unit']],
16658:     ['Nama PIC / Pelapor', e['Nama Pelapor']],
16659:     ['Deskripsi Masalah', e['Deskripsi Masalah']],
16660:     ['Tindakan Perbaikan (Corrective Action)', e['Tindakan Perbaikan']],
16661:     ['Tanggal Lapor', fmtDate(e['Tanggal'])],
16662:     ['Waktu Lapor', fmtTime(e['Waktu'])],
16663:   ];
16664:   $('#modal-content').innerHTML = `
16665:     <div class="modal-head">
16666:       <div>
16667:         <span class="badge badge-${statusClass(e['Status'])}"><span class="led led-${key}" style="margin-right:4px;vertical-align:middle;"></span>${escapeHtml(dashStatusLabel(key))}</span>
16668:         <h2 style="font-family:var(--font-display);margin:8px 0 0 0;">${escapeHtml(namaMesin)}</h2>
16669:       </div>
16670:       <button class="modal-close" id="btn-close-modal">✕</button>
16671:     </div>
16672:     ${rows.filter(r=>r[1]).map(r=>`<div class="detail-row"><div class="k">${r[0]}</div><div class="v">${escapeHtml(r[1])}</div></div>`).join('')}
16673:     ${showTimer ? `<div class="detail-row"><div class="k">Waktu Berjalan</div><div class="v" id="modal-timer-live">--:--:--</div></div>` : ''}
16674:     <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
16675:       <select id="quick-status" style="width:auto;">
16676:         <option value="">Update status...</option>
16677:         <option>Proses</option><option>Selesai</option><option>Pending</option><option>Emergency</option>
16678:       </select>
16679:       <button class="btn btn-sm btn-primary" id="btn-quick-status">Terapkan</button>
16680:       <button type="button" class="btn btn-sm btn-ghost" id="btn-dash-open-full">Buka Detail Lengkap Logbook</button>
~~~

## window.onresize
No match.

