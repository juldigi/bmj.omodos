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

## sparepart-rows
### Around line 3591
~~~text
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
03649:           <input class="grow" type="text" id="search-report-hub" placeholder="Cari judul, kode, PIC/penulis...">
03650:           <select id="filter-report-hub-type" style="display:none;">
03651:             <option value="">Semua Jenis</option>
03652:             <option value="wi">Work Instruction</option>
03653:             <option value="project">Laporan Proyek</option>
03654:           </select>
03655:         </div>
~~~

### Around line 17280
~~~text
17268: /* ---------------- SPAREPART ROWS (INPUT LOGBOOK) ---------------- */
17269: let SPAREPART_ROW_ID = 0;
17270: let SPAREPART_ROWS = [];
17271: function addSparepartRow(){
17272:   SPAREPART_ROWS.push({ id: ++SPAREPART_ROW_ID, nama:'', sap:'', jumlah:'' });
17273:   renderSparepartRows();
17274: }
17275: function removeSparepartRow(id){
17276:   SPAREPART_ROWS = SPAREPART_ROWS.filter(r=>r.id!==id);
17277:   if(!SPAREPART_ROWS.length) addSparepartRow(); else renderSparepartRows();
17278: }
17279: function renderSparepartRows(){
17280:   const holder = $('#sparepart-rows');
17281:   if(!holder) return;
17282:   holder.innerHTML = SPAREPART_ROWS.map((r,i)=>`
17283:     <div class="sparepart-row" data-id="${r.id}">
17284:       <div class="field"><label>${i===0?'Nama Material yang Digunakan (opsional)':'Nama Material (opsional)'}</label>
17285:         <div class="sp-suggest-wrap">
17286:           <input type="text" class="sp-nama" autocomplete="off" placeholder="Ketik nama material untuk melihat suggestion" value="${escapeHtml(r.nama)}">
17287:           <div class="sp-suggest-box sp-nama-suggest"></div>
17288:         </div>
17289:       </div>
17290:       <div class="field"><label><span>Material Number SAP (opsional)</span><span class="sp-lokasi-hint" style="font-size:11px;font-weight:400;color:var(--amber);">${(()=>{ const l=findSparepartLokasiBySap(r.sap); return l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : ''; })()}</span></label>
17291:         <div class="sp-suggest-wrap">
17292:           <input type="text" class="sp-sap" autocomplete="off" placeholder="Ketik nomor material untuk melihat suggestion" value="${escapeHtml(r.sap)}">
17293:           <div class="sp-suggest-box sp-sap-suggest"></div>
17294:         </div>
17295:       </div>
17296:       <div class="field"><label>Jumlah (wajib jika menggunakan sparepart)</label>
17297:         <input type="number" class="sp-jumlah" min="1" step="1" inputmode="numeric" placeholder="Masukkan jumlah pemakaian jika menggunakan sparepart" value="${escapeHtml(r.jumlah)}">
17298:       </div>
17299:       ${SPAREPART_ROWS.length>1 ? `<button type="button" class="sparepart-row-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>` : `<span></span>`}
17300:     </div>`).join('');
17301:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17302:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17303:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17304:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17305:   $$('.sp-nama, .sp-sap', holder).forEach(el=> el.addEventListener('blur', ()=> setTimeout(()=> closeSparepartSuggestBox_(el.closest('.sparepart-row')), 150)));
17306:   $$('.sp-jumlah', holder).forEach(el=> el.addEventListener('input', syncSparepartRowsFromDom));
17307:   $$('.sparepart-row-remove', holder).forEach(btn=>{
17308:     btn.addEventListener('click', ()=> removeSparepartRow(Number(btn.dataset.id)));
17309:   });
17310: }
17311: function closeSparepartSuggestBox_(rowEl){
17312:   if(!rowEl) return;
17313:   $$('.sp-suggest-box', rowEl).forEach(box=>{ box.classList.remove('open'); box.innerHTML=''; });
17314: }
17315: /* Menampilkan suggestion KHUSUS berdasarkan field yang sedang diketik:
17316:    - field Nama Material -> filter & cocokkan HANYA terhadap x.nama
17317:    - field Material Number SAP -> filter & cocokkan HANYA terhadap x.sap
17318:    Dibuat custom (bukan <datalist> bawaan browser) supaya suggestion tidak
17319:    pernah "ketuker" antara nama & nomor material seperti pada native datalist. */
17320: function handleSparepartLookupInput_(rowEl, source){
17321:   if(!rowEl) return;
17322:   const namaEl = $('.sp-nama', rowEl);
17323:   const sapEl = $('.sp-sap', rowEl);
17324:   const master = Array.isArray(SPAREPART_LOKASI) ? SPAREPART_LOKASI : [];
17325:   const normalize = v=>String(v||'').trim().toLowerCase();
17326: 
17327:   if(source === 'nama'){
17328:     const box = $('.sp-nama-suggest', rowEl);
17329:     const q = normalize(namaEl.value);
17330:     if(box){
17331:       const seen = new Set();
17332:       const results = q ? master.filter(x=>{
17333:         const key = normalize(x.nama);
17334:         if(!key || !key.includes(q) || seen.has(key)) return false;
17335:         seen.add(key); return true;
17336:       }).slice(0,30) : [];
17337:       renderSparepartSuggestBox_(box, results, (item)=>{
17338:         namaEl.value = item.nama || '';
17339:         sapEl.value = item.sap || '';
17340:         closeSparepartSuggestBox_(rowEl);
17341:         syncSparepartRowsFromDom();
17342:       }, x=>x.nama, x=> x.sap ? `SAP: ${x.sap}` : 'Belum ada nomor material');
17343:     }
17344:     // Preserve manual edits; fill the paired field only after an explicit suggestion selection.
~~~

### Around line 17379
~~~text
17367:   if(!results.length){ box.classList.remove('open'); box.innerHTML=''; return; }
17368:   box.innerHTML = results.map((x,idx)=>`
17369:     <div class="sp-suggest-item" data-idx="${idx}">
17370:       <span class="sp-suggest-main">${escapeHtml(mainFn(x)||'-')}</span>
17371:       <span class="sp-suggest-sub">${escapeHtml(subFn(x)||'')}</span>
17372:     </div>`).join('');
17373:   box.classList.add('open');
17374:   $$('.sp-suggest-item', box).forEach(el=>{
17375:     el.addEventListener('mousedown', (ev)=>{ ev.preventDefault(); onPick(results[Number(el.dataset.idx)]); });
17376:   });
17377: }
17378: function syncSparepartRowsFromDom(){
17379:   $$('.sparepart-row', $('#sparepart-rows')).forEach(rowEl=>{
17380:     const id = Number(rowEl.dataset.id);
17381:     const row = SPAREPART_ROWS.find(r=>r.id===id);
17382:     if(!row) return;
17383:     row.nama = $('.sp-nama', rowEl).value;
17384:     row.sap = $('.sp-sap', rowEl).value;
17385:     row.jumlah = $('.sp-jumlah', rowEl).value;
17386:     const hintEl = $('.sp-lokasi-hint', rowEl);
17387:     if(hintEl){
17388:       const l = findSparepartLokasiBySap(row.sap);
17389:       hintEl.innerHTML = l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : '';
17390:     }
17391:   });
17392: }
17393: function resetSparepartRows(){
17394:   SPAREPART_ROWS = [];
17395:   addSparepartRow();
17396: }
17397: resetSparepartRows();
17398: const btnAddSparepartRow = $('#btn-add-sparepart-row');
17399: if(btnAddSparepartRow) btnAddSparepartRow.addEventListener('click', addSparepartRow);
17400: 
17401: /* ---------------- PERSONIL TAMBAHAN (INPUT LOGBOOK) ----------------
17402:    Baris opsional untuk menambahkan personil lain selain Nama Pelapor /
17403:    Teknisi Utama. Polanya disamakan dengan SPAREPART ROWS di atas supaya
17404:    konsisten: array state + render ulang ke dalam container setiap ada
17405:    perubahan (tambah/hapus/pilih nama). */
17406: let ADDITIONAL_PERSONIL_ID = 0;
17407: let ADDITIONAL_PERSONIL_ROWS = [];
17408: function addAdditionalPersonilRow(){
17409:   ADDITIONAL_PERSONIL_ROWS.push({ id: ++ADDITIONAL_PERSONIL_ID, nama:'' });
17410:   renderAdditionalPersonil();
17411: }
17412: function removeAdditionalPersonilRow(id){
17413:   ADDITIONAL_PERSONIL_ROWS = ADDITIONAL_PERSONIL_ROWS.filter(r=>r.id!==id);
17414:   renderAdditionalPersonil();
17415: }
17416: function renderAdditionalPersonil(){
17417:   const holder = $('#additional-personil-container');
17418:   if(!holder) return;
17419:   const mainName = ($('#select-namaPelapor') && $('#select-namaPelapor').value) || '';
17420:   const names = (typeof PERSONIL !== 'undefined' ? PERSONIL : [])
17421:     .map(p=>p['Nama Personil']).filter(Boolean).sort();
17422:   holder.innerHTML = ADDITIONAL_PERSONIL_ROWS.map(r=>`
17423:     <div class="additional-personil-row" data-id="${r.id}" style="display:flex; gap:8px; align-items:center;">
17424:       <select class="ap-nama" style="flex:1;">
17425:         <option value="">Pilih personil...</option>
17426:         ${names.map(n=>`<option value="${escapeHtml(n)}" ${r.nama===n?'selected':''} ${n===mainName?'disabled':''}>${escapeHtml(n)}</option>`).join('')}
17427:       </select>
17428:       <button type="button" class="btn btn-ghost btn-sm additional-personil-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>
17429:     </div>`).join('');
17430:   $$('.ap-nama', holder).forEach(el=> el.addEventListener('change', ()=>{
17431:     const id = Number(el.closest('.additional-personil-row').dataset.id);
17432:     const row = ADDITIONAL_PERSONIL_ROWS.find(r=>r.id===id);
17433:     if(row) row.nama = el.value;
17434:   }));
17435:   $$('.additional-personil-remove', holder).forEach(btn=>{
17436:     btn.addEventListener('click', ()=> removeAdditionalPersonilRow(Number(btn.dataset.id)));
17437:   });
17438: }
17439: function getAdditionalPersonilNames(){
17440:   return ADDITIONAL_PERSONIL_ROWS.map(r=>r.nama).filter(Boolean);
17441: }
17442: function resetAdditionalPersonil(){
17443:   ADDITIONAL_PERSONIL_ROWS = [];
~~~

### Around line 17667
~~~text
17655:   $$('.fp-media').forEach(el=>{
17656:     el.addEventListener('click', (ev)=>{
17657:       ev.stopPropagation();
17658:       openLightbox(el.dataset.url, el.dataset.type, el.dataset.name);
17659:     });
17660:   });
17661: }
17662: 
17663: /* ---------------- FORM WIZARD MODE (Mode Standar <-> Mode Wizard) ----------------
17664:    Toggle switch (reuse komponen .lc-switch) untuk mengubah form panjang jadi
17665:    alur step-by-step. Section form yang sudah ada (dipisah oleh .section-title)
17666:    otomatis dibungkus jadi .wizard-step tanpa perlu ubah markup satu-satu, jadi
17667:    struktur & handler input yang sudah ada (file-drop, sparepart-rows, dst) tetap
17668:    utuh — cuma direparent ke wrapper step-nya. Kalau user klik Submit padahal
17669:    step wizard belum lengkap, submit dicegah + toast peringatan + lompat ke
17670:    step yang belum lengkap (lihat form._wizardGuardSubmit, dipanggil di
17671:    handler submit form-entry di bawah). */
17672: function initFormWizard(formSel, toggleSel, labelSel, navSel){
17673:   const form = $(formSel), toggle = $(toggleSel), label = $(labelSel), nav = $(navSel);
17674:   if(!form || !toggle || !nav || form.dataset.wizardReady) return;
17675:   form.dataset.wizardReady = '1';
17676: 
17677:   const actionsBar = form.querySelector('#entry-actions-bar');
17678:   const kids = Array.from(form.children).filter(el=> el !== actionsBar && el !== nav);
17679:   const groups = [];
17680:   kids.forEach(el=>{
17681:     if(el.classList.contains('section-title') || !groups.length){
17682:       groups.push({ title: el.classList.contains('section-title') ? el.textContent.trim() : 'Data', els: [] });
17683:     }
17684:     groups[groups.length-1].els.push(el);
17685:   });
17686:   const steps = groups.map((g, i)=>{
17687:     const wrap = document.createElement('div');
17688:     wrap.className = 'wizard-step';
17689:     wrap.dataset.step = i;
17690:     wrap.dataset.title = g.title;
17691:     g.els[0].parentNode.insertBefore(wrap, g.els[0]);
17692:     g.els.forEach(el=> wrap.appendChild(el));
17693:     return wrap;
17694:   });
17695:   let current = 0;
17696: 
17697:   const requiredFieldsIn = stepEl => $$('input[required], select[required], textarea[required]', stepEl);
17698:   // PENTING: pakai `f.validity.valid`, BUKAN `f.checkValidity()`/`reportValidity()`.
17699:   // Field yang berada di step non-aktif punya `display:none` (lewat CSS
17700:   // `form.wizard-mode .wizard-step{display:none}`), dan elemen yang tidak
17701:   // dirender otomatis "barred from constraint validation" oleh browser —
17702:   // artinya checkValidity() SELALU return true untuknya walau kosong.
17703:   // Sebelumnya ini membuat validasi step tersembunyi lolos begitu saja.
17704:   // `.validity.valid` tetap mencerminkan constraint sebenarnya terlepas
17705:   // dari status render, jadi baris kosong di step manapun tetap terdeteksi.
17706:   const stepIsValid = stepEl => requiredFieldsIn(stepEl).every(f=> f.validity.valid);
17707:   const firstInvalidStepIndex = () => steps.findIndex(s=> !stepIsValid(s));
17708:   // Fokuskan & tampilkan pesan validasi native untuk field tertentu, meski
17709:   // field itu ada di step yang sedang disembunyikan (harus dipindah ke
17710:   // step aktif dulu supaya reportValidity() punya efek visual).
17711:   function focusInvalidField(f){
17712:     const stepEl = f.closest('.wizard-step');
17713:     if(stepEl){ const idx = steps.indexOf(stepEl); if(idx !== -1) goToStep(idx); }
17714:     setTimeout(()=>{ f.reportValidity(); f.focus({preventScroll:false}); }, 0);
17715:   }
17716: 
17717:   function renderNav(){
17718:     if(!form.classList.contains('wizard-mode')){ nav.style.display='none'; nav.innerHTML=''; return; }
17719:     nav.style.display = '';
17720:     nav.innerHTML = `
17721:       <div class="wizard-progress">${steps.map((s,i)=>`<span class="wp-dot ${i<current?'done':(i===current?'current':'')}"></span>`).join('')}</div>
17722:       <div class="wizard-stepinfo">Langkah <b>${current+1}</b> dari <b>${steps.length}</b>: <b>${escapeHtml(steps[current].dataset.title||'')}</b></div>
17723:       <div class="wizard-nav-btns">
17724:         ${current>0 ? `<button type="button" class="btn btn-ghost btn-sm" id="wizard-btn-prev"><i class="ph-bold ph-arrow-left"></i> Sebelumnya</button>` : ''}
17725:         ${current<steps.length-1 ? `<button type="button" class="btn btn-primary btn-sm" id="wizard-btn-next">Lanjut <i class="ph-bold ph-arrow-right"></i></button>` : ''}
17726:       </div>`;
17727:     const btnPrev = $('#wizard-btn-prev', nav), btnNext = $('#wizard-btn-next', nav);
17728:     if(btnPrev) btnPrev.addEventListener('click', ()=> goToStep(current-1));
17729:     // Sengaja TIDAK ada validasi wajib di sini untuk pindah "Lanjut" antar
17730:     // langkah — konsisten dengan aturan "validasi hanya sekali, di tombol
17731:     // Simpan akhir" (lihat form._wizardGuardSubmit / validateFormEntryOnce
~~~

## btn-add-sparepart-row
### Around line 3592
~~~text
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
03649:           <input class="grow" type="text" id="search-report-hub" placeholder="Cari judul, kode, PIC/penulis...">
03650:           <select id="filter-report-hub-type" style="display:none;">
03651:             <option value="">Semua Jenis</option>
03652:             <option value="wi">Work Instruction</option>
03653:             <option value="project">Laporan Proyek</option>
03654:           </select>
03655:         </div>
03656:         <div id="report-hub-grid" class="report-cat-grid"></div>
~~~

### Around line 17398
~~~text
17386:     const hintEl = $('.sp-lokasi-hint', rowEl);
17387:     if(hintEl){
17388:       const l = findSparepartLokasiBySap(row.sap);
17389:       hintEl.innerHTML = l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : '';
17390:     }
17391:   });
17392: }
17393: function resetSparepartRows(){
17394:   SPAREPART_ROWS = [];
17395:   addSparepartRow();
17396: }
17397: resetSparepartRows();
17398: const btnAddSparepartRow = $('#btn-add-sparepart-row');
17399: if(btnAddSparepartRow) btnAddSparepartRow.addEventListener('click', addSparepartRow);
17400: 
17401: /* ---------------- PERSONIL TAMBAHAN (INPUT LOGBOOK) ----------------
17402:    Baris opsional untuk menambahkan personil lain selain Nama Pelapor /
17403:    Teknisi Utama. Polanya disamakan dengan SPAREPART ROWS di atas supaya
17404:    konsisten: array state + render ulang ke dalam container setiap ada
17405:    perubahan (tambah/hapus/pilih nama). */
17406: let ADDITIONAL_PERSONIL_ID = 0;
17407: let ADDITIONAL_PERSONIL_ROWS = [];
17408: function addAdditionalPersonilRow(){
17409:   ADDITIONAL_PERSONIL_ROWS.push({ id: ++ADDITIONAL_PERSONIL_ID, nama:'' });
17410:   renderAdditionalPersonil();
17411: }
17412: function removeAdditionalPersonilRow(id){
17413:   ADDITIONAL_PERSONIL_ROWS = ADDITIONAL_PERSONIL_ROWS.filter(r=>r.id!==id);
17414:   renderAdditionalPersonil();
17415: }
17416: function renderAdditionalPersonil(){
17417:   const holder = $('#additional-personil-container');
17418:   if(!holder) return;
17419:   const mainName = ($('#select-namaPelapor') && $('#select-namaPelapor').value) || '';
17420:   const names = (typeof PERSONIL !== 'undefined' ? PERSONIL : [])
17421:     .map(p=>p['Nama Personil']).filter(Boolean).sort();
17422:   holder.innerHTML = ADDITIONAL_PERSONIL_ROWS.map(r=>`
17423:     <div class="additional-personil-row" data-id="${r.id}" style="display:flex; gap:8px; align-items:center;">
17424:       <select class="ap-nama" style="flex:1;">
17425:         <option value="">Pilih personil...</option>
17426:         ${names.map(n=>`<option value="${escapeHtml(n)}" ${r.nama===n?'selected':''} ${n===mainName?'disabled':''}>${escapeHtml(n)}</option>`).join('')}
17427:       </select>
17428:       <button type="button" class="btn btn-ghost btn-sm additional-personil-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>
17429:     </div>`).join('');
17430:   $$('.ap-nama', holder).forEach(el=> el.addEventListener('change', ()=>{
17431:     const id = Number(el.closest('.additional-personil-row').dataset.id);
17432:     const row = ADDITIONAL_PERSONIL_ROWS.find(r=>r.id===id);
17433:     if(row) row.nama = el.value;
17434:   }));
17435:   $$('.additional-personil-remove', holder).forEach(btn=>{
17436:     btn.addEventListener('click', ()=> removeAdditionalPersonilRow(Number(btn.dataset.id)));
17437:   });
17438: }
17439: function getAdditionalPersonilNames(){
17440:   return ADDITIONAL_PERSONIL_ROWS.map(r=>r.nama).filter(Boolean);
17441: }
17442: function resetAdditionalPersonil(){
17443:   ADDITIONAL_PERSONIL_ROWS = [];
17444:   renderAdditionalPersonil();
17445: }
17446: resetAdditionalPersonil();
17447: 
17448: /* ---------------- KOREKSI PENULISAN VIA AI EXTERNAL ----------------
17449:    Semua field yang menyediakan fitur koreksi penulisan mengirim teks ke
17450:    backend Cloudflare. Backend memilih provider external yang tersedia
17451:    (Groq, dengan fallback Gemini). API key tidak pernah berada di browser.
17452:    Koreksi manual selalu ditampilkan Sebelum/Sesudah agar user tetap
17453:    memutuskan apakah usulan diterapkan. Jalur koreksi otomatis saat simpan
17454:    bersifat fail-open: bila AI external tidak tersedia, teks asli tetap
17455:    disimpan dan pengguna diberi informasi, bukan kehilangan input. */
17456: async function groqFixTextRaw(text, fieldLabel, options){
17457:   const original = String(text||'').trim();
17458:   if(!original) return null;
17459:   const opts = options || {};
17460:   try{
17461:     const res = await apiPost({ action:'groqFixTypo', text: original, field: fieldLabel, provider:'external' });
17462:     const corrected = (res && typeof res.corrected === 'string') ? res.corrected.trim() : '';
~~~

## form-logbook
No match.

## EDITING_ENTRY
No match.

## edit-entry
### Around line 16772
~~~text
16760:     ['Estimasi Pekerjaan', e['Downtime (menit)']],
16761:     ['Catatan', e['Catatan Tambahan']],
16762:     ['Keterangan', isOneNoteImport(e['Tanggal']) ? 'Import dari OneNote' : ''],
16763:   ];
16764:   const st = statusClass(e['Status']);
16765:   $('#modal-content').innerHTML = `
16766:     <div class="modal-head">
16767:       <div>
16768:         <span class="badge badge-${st}"><span class="led led-${st}" style="margin-right:4px;vertical-align:middle;"></span>${escapeHtml(e['Status']||'-')}</span>
16769:         <h2 style="font-family:var(--font-display);margin:8px 0 0 0;">${mesinKey ? wikiLinkHtml('mesin', mesinKey, e['Nama Mesin']||'-') : escapeHtml(logbookLocationLabel_(e))}</h2>
16770:       </div>
16771:       <div style="display:flex;gap:8px;">
16772:         <button class="btn btn-sm" id="btn-edit-entry"><i class="ph-bold ph-pencil-simple"></i> Edit</button>
16773:         <button class="btn btn-sm btn-danger" id="btn-delete-entry"><i class="ph-bold ph-trash"></i> Hapus</button>
16774:         <button class="modal-close" id="btn-close-modal">✕</button>
16775:       </div>
16776:     </div>
16777:     <div id="entry-view-mode">
16778:       ${rows.filter(r=>r[1]).map(r=>`<div class="detail-row"><div class="k">${r[0]}</div><div class="v">${customRowHtml.hasOwnProperty(r[0]) ? customRowHtml[r[0]] : escapeHtml(r[1])}</div></div>`).join('')}
16779:       ${renderAttachGrid(atts, 'Lampiran')}
16780:       <div style="margin-top:20px;display:flex;gap:10px;">
16781:         <select id="quick-status" style="width:auto;">
16782:           <option value="">Ubah status...</option>
16783:           <option>Proses</option><option>Selesai</option><option>Pending</option><option>Emergency</option>
16784:         </select>
16785:         <button class="btn btn-sm btn-primary" id="btn-quick-status">Terapkan</button>
16786:       </div>
16787:     </div>
16788:   `;
16789:   $('#modal-bg').classList.add('active');
16790:   $('#btn-close-modal').addEventListener('click', closeModal);
16791:   $('#btn-delete-entry').addEventListener('click', ()=> deleteEntry(id));
16792:   $('#btn-edit-entry').addEventListener('click', ()=> renderEntryEditForm(e));
16793:   $('#btn-quick-status').addEventListener('click', ()=> quickUpdateStatus(id));
16794:   bindAttachGridClicks($('#modal-content'));
16795: }
16796: // [FITUR EDIT LOGBOOK] Ganti tampilan detail (read-only) di dalam modal yang sama
16797: // menjadi form yang bisa diedit langsung, lalu kirim ke backend lewat action
16798: // 'updateEntry' (meng-update baris yang sudah ada di Sheet, bukan menambah baris baru).
16799: const ENTRY_EDIT_FIELDS = [
16800:   { key:'Tanggal', label:'Tanggal', type:'date', toInput:v=>v?String(v).slice(0,10):'' },
16801:   { key:'Waktu', label:'Waktu Lapor', type:'time' },
16802:   { key:'Shift', label:'Shift', type:'select', options:['Pagi','Siang','Malam'] },
16803:   { key:'Grouping Pekerjaan', label:'Grouping Pekerjaan', type:'text' },
16804:   { key:'Grouping Team', label:'Grouping Team', type:'text' },
16805:   { key:'Nama Pelapor', label:'Nama Pelapor', type:'text' },
16806:   { key:'Personil Tambahan', label:'Personil Tambahan (pisah koma)', type:'text' },
16807:   { key:'Nomor Notifikasi Pekerjaan', label:'Nomor Notifikasi Pekerjaan', type:'text' },
16808:   { key:'Kode Mesin', label:'Kode Mesin', type:'text' },
16809:   { key:'Nama Mesin', label:'Nama Mesin', type:'text' },
16810:   { key:'Nama Unit', label:'Nama Unit (Sub-Mesin)', type:'text' },
16811:   { key:'Jenis Pekerjaan', label:'Jenis Pekerjaan', type:'text' },
16812:   { key:'Prioritas', label:'Prioritas', type:'select', options:['Low','Medium','High','Urgent'] },
16813:   { key:'Status', label:'Status', type:'select', options:['Proses','Selesai','Pending','Emergency'] },
16814:   { key:'Deskripsi Masalah', label:'Deskripsi Masalah', type:'textarea' },
16815:   { key:'Tindakan Perbaikan', label:'Tindakan Perbaikan', type:'textarea' },
16816:   { key:'Nama Material', label:'Nama Material', type:'text' },
16817:   { key:'Material Number SAP', label:'Material Number SAP', type:'text' },
16818:   { key:'Spare Part Digunakan', label:'Spare Part (catatan)', type:'text' },
16819:   { key:'Jam Mulai', label:'Jam Mulai', type:'time' },
16820:   { key:'Jam Selesai', label:'Jam Selesai', type:'time' },
16821:   { key:'Downtime (menit)', label:'Estimasi Pekerjaan (menit)', type:'number' },
16822:   { key:'Catatan Tambahan', label:'Catatan', type:'textarea' }
16823: ];
16824: function renderEntryEditForm(e){
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
~~~

### Around line 16792
~~~text
16780:       <div style="margin-top:20px;display:flex;gap:10px;">
16781:         <select id="quick-status" style="width:auto;">
16782:           <option value="">Ubah status...</option>
16783:           <option>Proses</option><option>Selesai</option><option>Pending</option><option>Emergency</option>
16784:         </select>
16785:         <button class="btn btn-sm btn-primary" id="btn-quick-status">Terapkan</button>
16786:       </div>
16787:     </div>
16788:   `;
16789:   $('#modal-bg').classList.add('active');
16790:   $('#btn-close-modal').addEventListener('click', closeModal);
16791:   $('#btn-delete-entry').addEventListener('click', ()=> deleteEntry(id));
16792:   $('#btn-edit-entry').addEventListener('click', ()=> renderEntryEditForm(e));
16793:   $('#btn-quick-status').addEventListener('click', ()=> quickUpdateStatus(id));
16794:   bindAttachGridClicks($('#modal-content'));
16795: }
16796: // [FITUR EDIT LOGBOOK] Ganti tampilan detail (read-only) di dalam modal yang sama
16797: // menjadi form yang bisa diedit langsung, lalu kirim ke backend lewat action
16798: // 'updateEntry' (meng-update baris yang sudah ada di Sheet, bukan menambah baris baru).
16799: const ENTRY_EDIT_FIELDS = [
16800:   { key:'Tanggal', label:'Tanggal', type:'date', toInput:v=>v?String(v).slice(0,10):'' },
16801:   { key:'Waktu', label:'Waktu Lapor', type:'time' },
16802:   { key:'Shift', label:'Shift', type:'select', options:['Pagi','Siang','Malam'] },
16803:   { key:'Grouping Pekerjaan', label:'Grouping Pekerjaan', type:'text' },
16804:   { key:'Grouping Team', label:'Grouping Team', type:'text' },
16805:   { key:'Nama Pelapor', label:'Nama Pelapor', type:'text' },
16806:   { key:'Personil Tambahan', label:'Personil Tambahan (pisah koma)', type:'text' },
16807:   { key:'Nomor Notifikasi Pekerjaan', label:'Nomor Notifikasi Pekerjaan', type:'text' },
16808:   { key:'Kode Mesin', label:'Kode Mesin', type:'text' },
16809:   { key:'Nama Mesin', label:'Nama Mesin', type:'text' },
16810:   { key:'Nama Unit', label:'Nama Unit (Sub-Mesin)', type:'text' },
16811:   { key:'Jenis Pekerjaan', label:'Jenis Pekerjaan', type:'text' },
16812:   { key:'Prioritas', label:'Prioritas', type:'select', options:['Low','Medium','High','Urgent'] },
16813:   { key:'Status', label:'Status', type:'select', options:['Proses','Selesai','Pending','Emergency'] },
16814:   { key:'Deskripsi Masalah', label:'Deskripsi Masalah', type:'textarea' },
16815:   { key:'Tindakan Perbaikan', label:'Tindakan Perbaikan', type:'textarea' },
16816:   { key:'Nama Material', label:'Nama Material', type:'text' },
16817:   { key:'Material Number SAP', label:'Material Number SAP', type:'text' },
16818:   { key:'Spare Part Digunakan', label:'Spare Part (catatan)', type:'text' },
16819:   { key:'Jam Mulai', label:'Jam Mulai', type:'time' },
16820:   { key:'Jam Selesai', label:'Jam Selesai', type:'time' },
16821:   { key:'Downtime (menit)', label:'Estimasi Pekerjaan (menit)', type:'number' },
16822:   { key:'Catatan Tambahan', label:'Catatan', type:'textarea' }
16823: ];
16824: function renderEntryEditForm(e){
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
~~~

## renderEntries
No match.

## populateSparepart
No match.

## function addSparepart
### Around line 17271
~~~text
17259:     blob=await compressVideoFile(file);
17260:     if(blob!==file){ mimeType='video/webm'; name=name.replace(/\.[^.]+$/, '')+'.webm'; }
17261:   }
17262:   if(blob.size > MAX_CLIENT_UPLOAD_BYTES){
17263:     throw new Error(`File "${name}" masih terlalu besar setelah kompresi (${(blob.size/1024/1024).toFixed(1)} MB). Maksimal 9 MB per file.`);
17264:   }
17265:   return {name,mimeType,base64:await fileToBase64(blob),_blob:blob};
17266: }
17267: 
17268: /* ---------------- SPAREPART ROWS (INPUT LOGBOOK) ---------------- */
17269: let SPAREPART_ROW_ID = 0;
17270: let SPAREPART_ROWS = [];
17271: function addSparepartRow(){
17272:   SPAREPART_ROWS.push({ id: ++SPAREPART_ROW_ID, nama:'', sap:'', jumlah:'' });
17273:   renderSparepartRows();
17274: }
17275: function removeSparepartRow(id){
17276:   SPAREPART_ROWS = SPAREPART_ROWS.filter(r=>r.id!==id);
17277:   if(!SPAREPART_ROWS.length) addSparepartRow(); else renderSparepartRows();
17278: }
17279: function renderSparepartRows(){
17280:   const holder = $('#sparepart-rows');
17281:   if(!holder) return;
17282:   holder.innerHTML = SPAREPART_ROWS.map((r,i)=>`
17283:     <div class="sparepart-row" data-id="${r.id}">
17284:       <div class="field"><label>${i===0?'Nama Material yang Digunakan (opsional)':'Nama Material (opsional)'}</label>
17285:         <div class="sp-suggest-wrap">
17286:           <input type="text" class="sp-nama" autocomplete="off" placeholder="Ketik nama material untuk melihat suggestion" value="${escapeHtml(r.nama)}">
17287:           <div class="sp-suggest-box sp-nama-suggest"></div>
17288:         </div>
17289:       </div>
17290:       <div class="field"><label><span>Material Number SAP (opsional)</span><span class="sp-lokasi-hint" style="font-size:11px;font-weight:400;color:var(--amber);">${(()=>{ const l=findSparepartLokasiBySap(r.sap); return l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : ''; })()}</span></label>
17291:         <div class="sp-suggest-wrap">
17292:           <input type="text" class="sp-sap" autocomplete="off" placeholder="Ketik nomor material untuk melihat suggestion" value="${escapeHtml(r.sap)}">
17293:           <div class="sp-suggest-box sp-sap-suggest"></div>
17294:         </div>
17295:       </div>
17296:       <div class="field"><label>Jumlah (wajib jika menggunakan sparepart)</label>
17297:         <input type="number" class="sp-jumlah" min="1" step="1" inputmode="numeric" placeholder="Masukkan jumlah pemakaian jika menggunakan sparepart" value="${escapeHtml(r.jumlah)}">
17298:       </div>
17299:       ${SPAREPART_ROWS.length>1 ? `<button type="button" class="sparepart-row-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>` : `<span></span>`}
17300:     </div>`).join('');
17301:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17302:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17303:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17304:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17305:   $$('.sp-nama, .sp-sap', holder).forEach(el=> el.addEventListener('blur', ()=> setTimeout(()=> closeSparepartSuggestBox_(el.closest('.sparepart-row')), 150)));
17306:   $$('.sp-jumlah', holder).forEach(el=> el.addEventListener('input', syncSparepartRowsFromDom));
17307:   $$('.sparepart-row-remove', holder).forEach(btn=>{
17308:     btn.addEventListener('click', ()=> removeSparepartRow(Number(btn.dataset.id)));
17309:   });
17310: }
17311: function closeSparepartSuggestBox_(rowEl){
17312:   if(!rowEl) return;
17313:   $$('.sp-suggest-box', rowEl).forEach(box=>{ box.classList.remove('open'); box.innerHTML=''; });
17314: }
17315: /* Menampilkan suggestion KHUSUS berdasarkan field yang sedang diketik:
17316:    - field Nama Material -> filter & cocokkan HANYA terhadap x.nama
17317:    - field Material Number SAP -> filter & cocokkan HANYA terhadap x.sap
17318:    Dibuat custom (bukan <datalist> bawaan browser) supaya suggestion tidak
17319:    pernah "ketuker" antara nama & nomor material seperti pada native datalist. */
17320: function handleSparepartLookupInput_(rowEl, source){
17321:   if(!rowEl) return;
17322:   const namaEl = $('.sp-nama', rowEl);
17323:   const sapEl = $('.sp-sap', rowEl);
17324:   const master = Array.isArray(SPAREPART_LOKASI) ? SPAREPART_LOKASI : [];
17325:   const normalize = v=>String(v||'').trim().toLowerCase();
17326: 
17327:   if(source === 'nama'){
17328:     const box = $('.sp-nama-suggest', rowEl);
17329:     const q = normalize(namaEl.value);
17330:     if(box){
17331:       const seen = new Set();
17332:       const results = q ? master.filter(x=>{
17333:         const key = normalize(x.nama);
17334:         if(!key || !key.includes(q) || seen.has(key)) return false;
17335:         seen.add(key); return true;
~~~

## function renderSparepartRows
### Around line 17279
~~~text
17267: 
17268: /* ---------------- SPAREPART ROWS (INPUT LOGBOOK) ---------------- */
17269: let SPAREPART_ROW_ID = 0;
17270: let SPAREPART_ROWS = [];
17271: function addSparepartRow(){
17272:   SPAREPART_ROWS.push({ id: ++SPAREPART_ROW_ID, nama:'', sap:'', jumlah:'' });
17273:   renderSparepartRows();
17274: }
17275: function removeSparepartRow(id){
17276:   SPAREPART_ROWS = SPAREPART_ROWS.filter(r=>r.id!==id);
17277:   if(!SPAREPART_ROWS.length) addSparepartRow(); else renderSparepartRows();
17278: }
17279: function renderSparepartRows(){
17280:   const holder = $('#sparepart-rows');
17281:   if(!holder) return;
17282:   holder.innerHTML = SPAREPART_ROWS.map((r,i)=>`
17283:     <div class="sparepart-row" data-id="${r.id}">
17284:       <div class="field"><label>${i===0?'Nama Material yang Digunakan (opsional)':'Nama Material (opsional)'}</label>
17285:         <div class="sp-suggest-wrap">
17286:           <input type="text" class="sp-nama" autocomplete="off" placeholder="Ketik nama material untuk melihat suggestion" value="${escapeHtml(r.nama)}">
17287:           <div class="sp-suggest-box sp-nama-suggest"></div>
17288:         </div>
17289:       </div>
17290:       <div class="field"><label><span>Material Number SAP (opsional)</span><span class="sp-lokasi-hint" style="font-size:11px;font-weight:400;color:var(--amber);">${(()=>{ const l=findSparepartLokasiBySap(r.sap); return l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : ''; })()}</span></label>
17291:         <div class="sp-suggest-wrap">
17292:           <input type="text" class="sp-sap" autocomplete="off" placeholder="Ketik nomor material untuk melihat suggestion" value="${escapeHtml(r.sap)}">
17293:           <div class="sp-suggest-box sp-sap-suggest"></div>
17294:         </div>
17295:       </div>
17296:       <div class="field"><label>Jumlah (wajib jika menggunakan sparepart)</label>
17297:         <input type="number" class="sp-jumlah" min="1" step="1" inputmode="numeric" placeholder="Masukkan jumlah pemakaian jika menggunakan sparepart" value="${escapeHtml(r.jumlah)}">
17298:       </div>
17299:       ${SPAREPART_ROWS.length>1 ? `<button type="button" class="sparepart-row-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>` : `<span></span>`}
17300:     </div>`).join('');
17301:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17302:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17303:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17304:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17305:   $$('.sp-nama, .sp-sap', holder).forEach(el=> el.addEventListener('blur', ()=> setTimeout(()=> closeSparepartSuggestBox_(el.closest('.sparepart-row')), 150)));
17306:   $$('.sp-jumlah', holder).forEach(el=> el.addEventListener('input', syncSparepartRowsFromDom));
17307:   $$('.sparepart-row-remove', holder).forEach(btn=>{
17308:     btn.addEventListener('click', ()=> removeSparepartRow(Number(btn.dataset.id)));
17309:   });
17310: }
17311: function closeSparepartSuggestBox_(rowEl){
17312:   if(!rowEl) return;
17313:   $$('.sp-suggest-box', rowEl).forEach(box=>{ box.classList.remove('open'); box.innerHTML=''; });
17314: }
17315: /* Menampilkan suggestion KHUSUS berdasarkan field yang sedang diketik:
17316:    - field Nama Material -> filter & cocokkan HANYA terhadap x.nama
17317:    - field Material Number SAP -> filter & cocokkan HANYA terhadap x.sap
17318:    Dibuat custom (bukan <datalist> bawaan browser) supaya suggestion tidak
17319:    pernah "ketuker" antara nama & nomor material seperti pada native datalist. */
17320: function handleSparepartLookupInput_(rowEl, source){
17321:   if(!rowEl) return;
17322:   const namaEl = $('.sp-nama', rowEl);
17323:   const sapEl = $('.sp-sap', rowEl);
17324:   const master = Array.isArray(SPAREPART_LOKASI) ? SPAREPART_LOKASI : [];
17325:   const normalize = v=>String(v||'').trim().toLowerCase();
17326: 
17327:   if(source === 'nama'){
17328:     const box = $('.sp-nama-suggest', rowEl);
17329:     const q = normalize(namaEl.value);
17330:     if(box){
17331:       const seen = new Set();
17332:       const results = q ? master.filter(x=>{
17333:         const key = normalize(x.nama);
17334:         if(!key || !key.includes(q) || seen.has(key)) return false;
17335:         seen.add(key); return true;
17336:       }).slice(0,30) : [];
17337:       renderSparepartSuggestBox_(box, results, (item)=>{
17338:         namaEl.value = item.nama || '';
17339:         sapEl.value = item.sap || '';
17340:         closeSparepartSuggestBox_(rowEl);
17341:         syncSparepartRowsFromDom();
17342:       }, x=>x.nama, x=> x.sap ? `SAP: ${x.sap}` : 'Belum ada nomor material');
17343:     }
~~~

## data-sparepart
No match.

## select[name="material"]
No match.

## sparepartSelect
No match.

## function renderLogbookTable
No match.

## function syncSparepartRowsFromDom
### Around line 17378
~~~text
17366: function renderSparepartSuggestBox_(box, results, onPick, mainFn, subFn){
17367:   if(!results.length){ box.classList.remove('open'); box.innerHTML=''; return; }
17368:   box.innerHTML = results.map((x,idx)=>`
17369:     <div class="sp-suggest-item" data-idx="${idx}">
17370:       <span class="sp-suggest-main">${escapeHtml(mainFn(x)||'-')}</span>
17371:       <span class="sp-suggest-sub">${escapeHtml(subFn(x)||'')}</span>
17372:     </div>`).join('');
17373:   box.classList.add('open');
17374:   $$('.sp-suggest-item', box).forEach(el=>{
17375:     el.addEventListener('mousedown', (ev)=>{ ev.preventDefault(); onPick(results[Number(el.dataset.idx)]); });
17376:   });
17377: }
17378: function syncSparepartRowsFromDom(){
17379:   $$('.sparepart-row', $('#sparepart-rows')).forEach(rowEl=>{
17380:     const id = Number(rowEl.dataset.id);
17381:     const row = SPAREPART_ROWS.find(r=>r.id===id);
17382:     if(!row) return;
17383:     row.nama = $('.sp-nama', rowEl).value;
17384:     row.sap = $('.sp-sap', rowEl).value;
17385:     row.jumlah = $('.sp-jumlah', rowEl).value;
17386:     const hintEl = $('.sp-lokasi-hint', rowEl);
17387:     if(hintEl){
17388:       const l = findSparepartLokasiBySap(row.sap);
17389:       hintEl.innerHTML = l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : '';
17390:     }
17391:   });
17392: }
17393: function resetSparepartRows(){
17394:   SPAREPART_ROWS = [];
17395:   addSparepartRow();
17396: }
17397: resetSparepartRows();
17398: const btnAddSparepartRow = $('#btn-add-sparepart-row');
17399: if(btnAddSparepartRow) btnAddSparepartRow.addEventListener('click', addSparepartRow);
17400: 
17401: /* ---------------- PERSONIL TAMBAHAN (INPUT LOGBOOK) ----------------
17402:    Baris opsional untuk menambahkan personil lain selain Nama Pelapor /
17403:    Teknisi Utama. Polanya disamakan dengan SPAREPART ROWS di atas supaya
17404:    konsisten: array state + render ulang ke dalam container setiap ada
17405:    perubahan (tambah/hapus/pilih nama). */
17406: let ADDITIONAL_PERSONIL_ID = 0;
17407: let ADDITIONAL_PERSONIL_ROWS = [];
17408: function addAdditionalPersonilRow(){
17409:   ADDITIONAL_PERSONIL_ROWS.push({ id: ++ADDITIONAL_PERSONIL_ID, nama:'' });
17410:   renderAdditionalPersonil();
17411: }
17412: function removeAdditionalPersonilRow(id){
17413:   ADDITIONAL_PERSONIL_ROWS = ADDITIONAL_PERSONIL_ROWS.filter(r=>r.id!==id);
17414:   renderAdditionalPersonil();
17415: }
17416: function renderAdditionalPersonil(){
17417:   const holder = $('#additional-personil-container');
17418:   if(!holder) return;
17419:   const mainName = ($('#select-namaPelapor') && $('#select-namaPelapor').value) || '';
17420:   const names = (typeof PERSONIL !== 'undefined' ? PERSONIL : [])
17421:     .map(p=>p['Nama Personil']).filter(Boolean).sort();
17422:   holder.innerHTML = ADDITIONAL_PERSONIL_ROWS.map(r=>`
17423:     <div class="additional-personil-row" data-id="${r.id}" style="display:flex; gap:8px; align-items:center;">
17424:       <select class="ap-nama" style="flex:1;">
17425:         <option value="">Pilih personil...</option>
17426:         ${names.map(n=>`<option value="${escapeHtml(n)}" ${r.nama===n?'selected':''} ${n===mainName?'disabled':''}>${escapeHtml(n)}</option>`).join('')}
17427:       </select>
17428:       <button type="button" class="btn btn-ghost btn-sm additional-personil-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>
17429:     </div>`).join('');
17430:   $$('.ap-nama', holder).forEach(el=> el.addEventListener('change', ()=>{
17431:     const id = Number(el.closest('.additional-personil-row').dataset.id);
17432:     const row = ADDITIONAL_PERSONIL_ROWS.find(r=>r.id===id);
17433:     if(row) row.nama = el.value;
17434:   }));
17435:   $$('.additional-personil-remove', holder).forEach(btn=>{
17436:     btn.addEventListener('click', ()=> removeAdditionalPersonilRow(Number(btn.dataset.id)));
17437:   });
17438: }
17439: function getAdditionalPersonilNames(){
17440:   return ADDITIONAL_PERSONIL_ROWS.map(r=>r.nama).filter(Boolean);
17441: }
17442: function resetAdditionalPersonil(){
~~~

## function handleSparepartLookupInput_(
### Around line 17320
~~~text
17308:     btn.addEventListener('click', ()=> removeSparepartRow(Number(btn.dataset.id)));
17309:   });
17310: }
17311: function closeSparepartSuggestBox_(rowEl){
17312:   if(!rowEl) return;
17313:   $$('.sp-suggest-box', rowEl).forEach(box=>{ box.classList.remove('open'); box.innerHTML=''; });
17314: }
17315: /* Menampilkan suggestion KHUSUS berdasarkan field yang sedang diketik:
17316:    - field Nama Material -> filter & cocokkan HANYA terhadap x.nama
17317:    - field Material Number SAP -> filter & cocokkan HANYA terhadap x.sap
17318:    Dibuat custom (bukan <datalist> bawaan browser) supaya suggestion tidak
17319:    pernah "ketuker" antara nama & nomor material seperti pada native datalist. */
17320: function handleSparepartLookupInput_(rowEl, source){
17321:   if(!rowEl) return;
17322:   const namaEl = $('.sp-nama', rowEl);
17323:   const sapEl = $('.sp-sap', rowEl);
17324:   const master = Array.isArray(SPAREPART_LOKASI) ? SPAREPART_LOKASI : [];
17325:   const normalize = v=>String(v||'').trim().toLowerCase();
17326: 
17327:   if(source === 'nama'){
17328:     const box = $('.sp-nama-suggest', rowEl);
17329:     const q = normalize(namaEl.value);
17330:     if(box){
17331:       const seen = new Set();
17332:       const results = q ? master.filter(x=>{
17333:         const key = normalize(x.nama);
17334:         if(!key || !key.includes(q) || seen.has(key)) return false;
17335:         seen.add(key); return true;
17336:       }).slice(0,30) : [];
17337:       renderSparepartSuggestBox_(box, results, (item)=>{
17338:         namaEl.value = item.nama || '';
17339:         sapEl.value = item.sap || '';
17340:         closeSparepartSuggestBox_(rowEl);
17341:         syncSparepartRowsFromDom();
17342:       }, x=>x.nama, x=> x.sap ? `SAP: ${x.sap}` : 'Belum ada nomor material');
17343:     }
17344:     // Preserve manual edits; fill the paired field only after an explicit suggestion selection.
17345:   }else if(source === 'sap'){
17346:     const box = $('.sp-sap-suggest', rowEl);
17347:     const q = normalize(sapEl.value);
17348:     if(box){
17349:       const seen = new Set();
17350:       const results = q ? master.filter(x=>{
17351:         const key = normalize(x.sap);
17352:         if(!key || !key.includes(q) || seen.has(key)) return false;
17353:         seen.add(key); return true;
17354:       }).slice(0,30) : [];
17355:       renderSparepartSuggestBox_(box, results, (item)=>{
17356:         sapEl.value = item.sap || '';
17357:         namaEl.value = item.nama || '';
17358:         closeSparepartSuggestBox_(rowEl);
17359:         syncSparepartRowsFromDom();
17360:       }, x=>x.sap, x=> x.nama ? x.nama : 'Nama material belum tersedia');
17361:     }
17362:     // Preserve manual edits; fill the paired field only after an explicit suggestion selection.
17363:   }
17364:   syncSparepartRowsFromDom();
17365: }
17366: function renderSparepartSuggestBox_(box, results, onPick, mainFn, subFn){
17367:   if(!results.length){ box.classList.remove('open'); box.innerHTML=''; return; }
17368:   box.innerHTML = results.map((x,idx)=>`
17369:     <div class="sp-suggest-item" data-idx="${idx}">
17370:       <span class="sp-suggest-main">${escapeHtml(mainFn(x)||'-')}</span>
17371:       <span class="sp-suggest-sub">${escapeHtml(subFn(x)||'')}</span>
17372:     </div>`).join('');
17373:   box.classList.add('open');
17374:   $$('.sp-suggest-item', box).forEach(el=>{
17375:     el.addEventListener('mousedown', (ev)=>{ ev.preventDefault(); onPick(results[Number(el.dataset.idx)]); });
17376:   });
17377: }
17378: function syncSparepartRowsFromDom(){
17379:   $$('.sparepart-row', $('#sparepart-rows')).forEach(rowEl=>{
17380:     const id = Number(rowEl.dataset.id);
17381:     const row = SPAREPART_ROWS.find(r=>r.id===id);
17382:     if(!row) return;
17383:     row.nama = $('.sp-nama', rowEl).value;
17384:     row.sap = $('.sp-sap', rowEl).value;
~~~

## function renderSparepartSuggestBox_(
### Around line 17366
~~~text
17354:       }).slice(0,30) : [];
17355:       renderSparepartSuggestBox_(box, results, (item)=>{
17356:         sapEl.value = item.sap || '';
17357:         namaEl.value = item.nama || '';
17358:         closeSparepartSuggestBox_(rowEl);
17359:         syncSparepartRowsFromDom();
17360:       }, x=>x.sap, x=> x.nama ? x.nama : 'Nama material belum tersedia');
17361:     }
17362:     // Preserve manual edits; fill the paired field only after an explicit suggestion selection.
17363:   }
17364:   syncSparepartRowsFromDom();
17365: }
17366: function renderSparepartSuggestBox_(box, results, onPick, mainFn, subFn){
17367:   if(!results.length){ box.classList.remove('open'); box.innerHTML=''; return; }
17368:   box.innerHTML = results.map((x,idx)=>`
17369:     <div class="sp-suggest-item" data-idx="${idx}">
17370:       <span class="sp-suggest-main">${escapeHtml(mainFn(x)||'-')}</span>
17371:       <span class="sp-suggest-sub">${escapeHtml(subFn(x)||'')}</span>
17372:     </div>`).join('');
17373:   box.classList.add('open');
17374:   $$('.sp-suggest-item', box).forEach(el=>{
17375:     el.addEventListener('mousedown', (ev)=>{ ev.preventDefault(); onPick(results[Number(el.dataset.idx)]); });
17376:   });
17377: }
17378: function syncSparepartRowsFromDom(){
17379:   $$('.sparepart-row', $('#sparepart-rows')).forEach(rowEl=>{
17380:     const id = Number(rowEl.dataset.id);
17381:     const row = SPAREPART_ROWS.find(r=>r.id===id);
17382:     if(!row) return;
17383:     row.nama = $('.sp-nama', rowEl).value;
17384:     row.sap = $('.sp-sap', rowEl).value;
17385:     row.jumlah = $('.sp-jumlah', rowEl).value;
17386:     const hintEl = $('.sp-lokasi-hint', rowEl);
17387:     if(hintEl){
17388:       const l = findSparepartLokasiBySap(row.sap);
17389:       hintEl.innerHTML = l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : '';
17390:     }
17391:   });
17392: }
17393: function resetSparepartRows(){
17394:   SPAREPART_ROWS = [];
17395:   addSparepartRow();
17396: }
17397: resetSparepartRows();
17398: const btnAddSparepartRow = $('#btn-add-sparepart-row');
17399: if(btnAddSparepartRow) btnAddSparepartRow.addEventListener('click', addSparepartRow);
17400: 
17401: /* ---------------- PERSONIL TAMBAHAN (INPUT LOGBOOK) ----------------
17402:    Baris opsional untuk menambahkan personil lain selain Nama Pelapor /
17403:    Teknisi Utama. Polanya disamakan dengan SPAREPART ROWS di atas supaya
17404:    konsisten: array state + render ulang ke dalam container setiap ada
17405:    perubahan (tambah/hapus/pilih nama). */
17406: let ADDITIONAL_PERSONIL_ID = 0;
17407: let ADDITIONAL_PERSONIL_ROWS = [];
17408: function addAdditionalPersonilRow(){
17409:   ADDITIONAL_PERSONIL_ROWS.push({ id: ++ADDITIONAL_PERSONIL_ID, nama:'' });
17410:   renderAdditionalPersonil();
17411: }
17412: function removeAdditionalPersonilRow(id){
17413:   ADDITIONAL_PERSONIL_ROWS = ADDITIONAL_PERSONIL_ROWS.filter(r=>r.id!==id);
17414:   renderAdditionalPersonil();
17415: }
17416: function renderAdditionalPersonil(){
17417:   const holder = $('#additional-personil-container');
17418:   if(!holder) return;
17419:   const mainName = ($('#select-namaPelapor') && $('#select-namaPelapor').value) || '';
17420:   const names = (typeof PERSONIL !== 'undefined' ? PERSONIL : [])
17421:     .map(p=>p['Nama Personil']).filter(Boolean).sort();
17422:   holder.innerHTML = ADDITIONAL_PERSONIL_ROWS.map(r=>`
17423:     <div class="additional-personil-row" data-id="${r.id}" style="display:flex; gap:8px; align-items:center;">
17424:       <select class="ap-nama" style="flex:1;">
17425:         <option value="">Pilih personil...</option>
17426:         ${names.map(n=>`<option value="${escapeHtml(n)}" ${r.nama===n?'selected':''} ${n===mainName?'disabled':''}>${escapeHtml(n)}</option>`).join('')}
17427:       </select>
17428:       <button type="button" class="btn btn-ghost btn-sm additional-personil-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>
17429:     </div>`).join('');
17430:   $$('.ap-nama', holder).forEach(el=> el.addEventListener('change', ()=>{
~~~

## function renderEntryEditForm(
### Around line 16824
~~~text
16812:   { key:'Prioritas', label:'Prioritas', type:'select', options:['Low','Medium','High','Urgent'] },
16813:   { key:'Status', label:'Status', type:'select', options:['Proses','Selesai','Pending','Emergency'] },
16814:   { key:'Deskripsi Masalah', label:'Deskripsi Masalah', type:'textarea' },
16815:   { key:'Tindakan Perbaikan', label:'Tindakan Perbaikan', type:'textarea' },
16816:   { key:'Nama Material', label:'Nama Material', type:'text' },
16817:   { key:'Material Number SAP', label:'Material Number SAP', type:'text' },
16818:   { key:'Spare Part Digunakan', label:'Spare Part (catatan)', type:'text' },
16819:   { key:'Jam Mulai', label:'Jam Mulai', type:'time' },
16820:   { key:'Jam Selesai', label:'Jam Selesai', type:'time' },
16821:   { key:'Downtime (menit)', label:'Estimasi Pekerjaan (menit)', type:'number' },
16822:   { key:'Catatan Tambahan', label:'Catatan', type:'textarea' }
16823: ];
16824: function renderEntryEditForm(e){
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
~~~

## data-edit-field
### Around line 16831
~~~text
16819:   { key:'Jam Mulai', label:'Jam Mulai', type:'time' },
16820:   { key:'Jam Selesai', label:'Jam Selesai', type:'time' },
16821:   { key:'Downtime (menit)', label:'Estimasi Pekerjaan (menit)', type:'number' },
16822:   { key:'Catatan Tambahan', label:'Catatan', type:'textarea' }
16823: ];
16824: function renderEntryEditForm(e){
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
~~~

### Around line 16835
~~~text
16823: ];
16824: function renderEntryEditForm(e){
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
~~~

### Around line 16837
~~~text
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
~~~

### Around line 16841
~~~text
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
~~~

### Around line 16842
~~~text
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
~~~

### Around line 16843
~~~text
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16907: 
~~~

### Around line 16864
~~~text
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16907: 
16908: async function quickUpdateStatus(id){
16909:   const val = $('#quick-status').value;
16910:   if(!val) return;
16911:   try{
16912:     await apiPost({action:'updateStatus', id, status: val});
16913:     toast('Status diperbarui');
16914:     closeModal();
16915:     await loadAll();
16916:     refreshCurrentView();
16917:   }catch(err){ toast('Gagal update status: ' + err.message, true); }
16918: }
16919: async function deleteEntry(id){
16920:   if(!confirm('Hapus entri logbook ini? Tindakan ini tidak bisa dibatalkan.')) return;
16921:   try{
16922:     await apiPost({action:'deleteEntry', id});
16923:     toast('Entri dihapus');
16924:     closeModal();
16925:     await loadAll();
16926:     refreshCurrentView();
16927:   }catch(err){ toast('Gagal menghapus: ' + err.message, true); }
16928: }
~~~

## updateEntry
### Around line 16798
~~~text
16786:       </div>
16787:     </div>
16788:   `;
16789:   $('#modal-bg').classList.add('active');
16790:   $('#btn-close-modal').addEventListener('click', closeModal);
16791:   $('#btn-delete-entry').addEventListener('click', ()=> deleteEntry(id));
16792:   $('#btn-edit-entry').addEventListener('click', ()=> renderEntryEditForm(e));
16793:   $('#btn-quick-status').addEventListener('click', ()=> quickUpdateStatus(id));
16794:   bindAttachGridClicks($('#modal-content'));
16795: }
16796: // [FITUR EDIT LOGBOOK] Ganti tampilan detail (read-only) di dalam modal yang sama
16797: // menjadi form yang bisa diedit langsung, lalu kirim ke backend lewat action
16798: // 'updateEntry' (meng-update baris yang sudah ada di Sheet, bukan menambah baris baru).
16799: const ENTRY_EDIT_FIELDS = [
16800:   { key:'Tanggal', label:'Tanggal', type:'date', toInput:v=>v?String(v).slice(0,10):'' },
16801:   { key:'Waktu', label:'Waktu Lapor', type:'time' },
16802:   { key:'Shift', label:'Shift', type:'select', options:['Pagi','Siang','Malam'] },
16803:   { key:'Grouping Pekerjaan', label:'Grouping Pekerjaan', type:'text' },
16804:   { key:'Grouping Team', label:'Grouping Team', type:'text' },
16805:   { key:'Nama Pelapor', label:'Nama Pelapor', type:'text' },
16806:   { key:'Personil Tambahan', label:'Personil Tambahan (pisah koma)', type:'text' },
16807:   { key:'Nomor Notifikasi Pekerjaan', label:'Nomor Notifikasi Pekerjaan', type:'text' },
16808:   { key:'Kode Mesin', label:'Kode Mesin', type:'text' },
16809:   { key:'Nama Mesin', label:'Nama Mesin', type:'text' },
16810:   { key:'Nama Unit', label:'Nama Unit (Sub-Mesin)', type:'text' },
16811:   { key:'Jenis Pekerjaan', label:'Jenis Pekerjaan', type:'text' },
16812:   { key:'Prioritas', label:'Prioritas', type:'select', options:['Low','Medium','High','Urgent'] },
16813:   { key:'Status', label:'Status', type:'select', options:['Proses','Selesai','Pending','Emergency'] },
16814:   { key:'Deskripsi Masalah', label:'Deskripsi Masalah', type:'textarea' },
16815:   { key:'Tindakan Perbaikan', label:'Tindakan Perbaikan', type:'textarea' },
16816:   { key:'Nama Material', label:'Nama Material', type:'text' },
16817:   { key:'Material Number SAP', label:'Material Number SAP', type:'text' },
16818:   { key:'Spare Part Digunakan', label:'Spare Part (catatan)', type:'text' },
16819:   { key:'Jam Mulai', label:'Jam Mulai', type:'time' },
16820:   { key:'Jam Selesai', label:'Jam Selesai', type:'time' },
16821:   { key:'Downtime (menit)', label:'Estimasi Pekerjaan (menit)', type:'number' },
16822:   { key:'Catatan Tambahan', label:'Catatan', type:'textarea' }
16823: ];
16824: function renderEntryEditForm(e){
16825:   const holder = $('#entry-view-mode');
16826:   if(!holder) return;
16827:   const fieldHtml = ENTRY_EDIT_FIELDS.map(f=>{
16828:     const raw = e[f.key] || '';
16829:     const val = f.toInput ? f.toInput(raw) : raw;
16830:     if(f.type === 'textarea'){
16831:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><textarea data-edit-field="${f.key}" rows="3">${escapeHtml(val)}</textarea></div>`;
16832:     }
16833:     if(f.type === 'select'){
16834:       const opts = f.options.map(o=>`<option value="${escapeHtml(o)}" ${String(val)===o?'selected':''}>${escapeHtml(o)}</option>`).join('');
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
~~~

### Around line 16895
~~~text
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16907: 
16908: async function quickUpdateStatus(id){
16909:   const val = $('#quick-status').value;
16910:   if(!val) return;
16911:   try{
16912:     await apiPost({action:'updateStatus', id, status: val});
16913:     toast('Status diperbarui');
16914:     closeModal();
16915:     await loadAll();
16916:     refreshCurrentView();
16917:   }catch(err){ toast('Gagal update status: ' + err.message, true); }
16918: }
16919: async function deleteEntry(id){
16920:   if(!confirm('Hapus entri logbook ini? Tindakan ini tidak bisa dibatalkan.')) return;
16921:   try{
16922:     await apiPost({action:'deleteEntry', id});
16923:     toast('Entri dihapus');
16924:     closeModal();
16925:     await loadAll();
16926:     refreshCurrentView();
16927:   }catch(err){ toast('Gagal menghapus: ' + err.message, true); }
16928: }
16929: function refreshCurrentView(){
16930:   const navActive = $('.nav-btn.active');
16931:   const activeSection = document.querySelector('.view.active');
16932:   const active = (navActive && navActive.dataset.view)
16933:     || (activeSection && String(activeSection.id||'').replace(/^view-/,''))
16934:     || PREVIOUS_ACTIVE_VIEW
16935:     || 'dashboard';
16936:   const renderers = {
16937:     utama:renderUtama, mesin:renderMesinView, tanggal:renderTanggalView,
16938:     pelapor:renderPelaporView, group:renderGroupView, durasi:renderDurasiView,
16939:     correlation:renderCorrelationView, diagnostic:renderDiagnosticView,
16940:     dashboard:renderDashboardView
16941:   };
16942:   if(renderers[active]){
16943:     try{
16944:       const result = renderers[active]();
16945:       if(result && typeof result.then === 'function'){
16946:         result.catch(err=>{
16947:           console.error('[OMODOS] refreshCurrentView gagal:', active, err);
16948:           toast('Gagal memperbarui halaman: ' + (err&&err.message?err.message:String(err)), true);
16949:         });
16950:       }
16951:     }catch(err){
16952:       console.error('[OMODOS] refreshCurrentView gagal:', active, err);
16953:       toast('Gagal memperbarui halaman: ' + (err&&err.message?err.message:String(err)), true);
16954:     }
16955:   }
16956: }
16957: 
16958: /* ---------------- ESTIMASI PEKERJAAN (AUTO-CALCULATED) ---------------- */
16959: function computeEstimasi(){
~~~

## btn-save-entry-edit
### Around line 16847
~~~text
16835:       return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><select data-edit-field="${f.key}">${opts}</select></div>`;
16836:     }
16837:     return `<div class="field" data-edit-wrap="${f.key}"><label>${escapeHtml(f.label)}</label><input type="${f.type}" data-edit-field="${f.key}" value="${escapeHtml(val)}"></div>`;
16838:   }).join('');
16839:   holder.innerHTML = `
16840:     <div class="grid3">
16841:       <div class="field"><label>Lokasi Pekerjaan</label><select data-edit-field="Lokasi Pekerjaan" id="edit-location-kind"><option>Mesin</option><option>Area</option></select></div>
16842:       <div class="field" id="edit-area-category-wrap"><label>Kategori Area</label><select data-edit-field="Kategori Area" id="edit-area-category"><option value="">Pilih kategori...</option>${Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('')}</select></div>
16843:       <div class="field" id="edit-area-name-wrap"><label>Area</label><select data-edit-field="Nama Area" id="edit-area-name"></select></div>
16844:     </div>
16845:     <div class="grid2">${fieldHtml}</div>
16846:     <div style="margin-top:16px;display:flex;gap:10px;">
16847:       <button class="btn btn-primary btn-sm" id="btn-save-entry-edit"><i class="ph-bold ph-floppy-disk"></i> Simpan Perubahan</button>
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16907: 
16908: async function quickUpdateStatus(id){
16909:   const val = $('#quick-status').value;
16910:   if(!val) return;
16911:   try{
~~~

### Around line 16860
~~~text
16848:       <button class="btn btn-ghost btn-sm" id="btn-cancel-entry-edit">Batal</button>
16849:     </div>
16850:   `;
16851:   const kind=$('#edit-location-kind'),category=$('#edit-area-category'),name=$('#edit-area-name');
16852:   kind.value=isAreaEntry_(e)?'Area':'Mesin';category.value=e['Kategori Area']||'';
16853:   populateWorkAreaOptions_(category.value,name,e['Nama Area']);
16854:   const sync=()=>{const area=kind.value==='Area';
16855:     $('#edit-area-category-wrap').hidden=!area;$('#edit-area-name-wrap').hidden=!area;
16856:     ['Kode Mesin','Nama Mesin','Nama Unit'].forEach(key=>{const wrap=holder.querySelector('[data-edit-wrap="'+key+'"]');if(wrap)wrap.hidden=area;});
16857:   };
16858:   kind.addEventListener('change',sync);category.addEventListener('change',()=>populateWorkAreaOptions_(category.value,name,''));sync();
16859:   $('#btn-cancel-entry-edit').addEventListener('click', ()=> openDetail(e['ID']));
16860:   $('#btn-save-entry-edit').addEventListener('click', ()=> saveEntryEdit(e['ID']));
16861: }
16862: async function saveEntryEdit(id){
16863:   const holder = $('#entry-view-mode');
16864:   const fieldEls = $$('[data-edit-field]', holder);
16865:   const entry = { ID: id };
16866:   const keyToPayload = {
16867:     'Lokasi Pekerjaan':'lokasiPekerjaan','Kategori Area':'kategoriArea','Nama Area':'namaArea',
16868:     'Tanggal':'tanggal', 'Waktu':'waktu', 'Shift':'shift', 'Grouping Pekerjaan':'groupingPekerjaan',
16869:     'Grouping Team':'groupingTeam', 'Nama Pelapor':'namaPelapor', 'Nomor Notifikasi Pekerjaan':'nomorNotifikasi',
16870:     'Kode Mesin':'kodeMesin', 'Nama Mesin':'namaMesin', 'Nama Unit':'namaUnit', 'Jenis Pekerjaan':'jenisPekerjaan',
16871:     'Prioritas':'prioritas', 'Status':'status', 'Deskripsi Masalah':'deskripsiMasalah', 'Tindakan Perbaikan':'tindakanPerbaikan',
16872:     'Nama Material':'namaMaterial', 'Material Number SAP':'materialNumberSAP', 'Spare Part Digunakan':'sparePart',
16873:     'Jam Mulai':'jamMulai', 'Jam Selesai':'jamSelesai', 'Downtime (menit)':'downtime', 'Catatan Tambahan':'catatan'
16874:   };
16875:   fieldEls.forEach(el=>{
16876:     const key = el.dataset.editField;
16877:     const val = el.value;
16878:     if(key === 'Personil Tambahan'){
16879:       const arr = val.split(',').map(s=>s.trim()).filter(Boolean);
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16907: 
16908: async function quickUpdateStatus(id){
16909:   const val = $('#quick-status').value;
16910:   if(!val) return;
16911:   try{
16912:     await apiPost({action:'updateStatus', id, status: val});
16913:     toast('Status diperbarui');
16914:     closeModal();
16915:     await loadAll();
16916:     refreshCurrentView();
16917:   }catch(err){ toast('Gagal update status: ' + err.message, true); }
16918: }
16919: async function deleteEntry(id){
16920:   if(!confirm('Hapus entri logbook ini? Tindakan ini tidak bisa dibatalkan.')) return;
16921:   try{
16922:     await apiPost({action:'deleteEntry', id});
16923:     toast('Entri dihapus');
16924:     closeModal();
~~~

### Around line 16892
~~~text
16880:       entry.personilTambahan = arr;
16881:       entry.personilTambahanStr = arr.join(', ');
16882:       return;
16883:     }
16884:     const payloadKey = keyToPayload[key];
16885:     if(payloadKey) entry[payloadKey] = val;
16886:   });
16887:   try{applyLogbookLocationPayload_(entry);}catch(err){toast(err.message,true);return;}
16888:   if(!entry.tanggal || !entry.shift || !entry.namaPelapor || !entry.kodeMesin || !entry.namaMesin || !entry.jenisPekerjaan || !entry.prioritas || !entry.deskripsiMasalah || !entry.tindakanPerbaikan || !entry.status){
16889:     toast('Lengkapi semua field wajib (Tanggal, Shift, Nama Pelapor, Mesin, Jenis Pekerjaan, Prioritas, Status, Deskripsi Masalah, Tindakan Perbaikan).', true);
16890:     return;
16891:   }
16892:   const btn = $('#btn-save-entry-edit');
16893:   btn.disabled = true; btn.textContent = 'Menyimpan...';
16894:   try{
16895:     await apiPost({ action:'updateEntry', entry });
16896:     toast('Perubahan Logbook tersimpan ✓');
16897:     closeModal();
16898:     await loadAll();
16899:     refreshCurrentView();
16900:   }catch(err){
16901:     toast('Gagal menyimpan perubahan: ' + err.message, true);
16902:     btn.disabled = false; btn.textContent = 'Simpan Perubahan';
16903:   }
16904: }
16905: function closeModal(){ $('#modal-bg').classList.remove('active'); COPILOT_LAST_MACHINE = null; }
16906: $('#modal-bg').addEventListener('click', (ev)=>{ if(ev.target.id==='modal-bg') closeModal(); });
16907: 
16908: async function quickUpdateStatus(id){
16909:   const val = $('#quick-status').value;
16910:   if(!val) return;
16911:   try{
16912:     await apiPost({action:'updateStatus', id, status: val});
16913:     toast('Status diperbarui');
16914:     closeModal();
16915:     await loadAll();
16916:     refreshCurrentView();
16917:   }catch(err){ toast('Gagal update status: ' + err.message, true); }
16918: }
16919: async function deleteEntry(id){
16920:   if(!confirm('Hapus entri logbook ini? Tindakan ini tidak bisa dibatalkan.')) return;
16921:   try{
16922:     await apiPost({action:'deleteEntry', id});
16923:     toast('Entri dihapus');
16924:     closeModal();
16925:     await loadAll();
16926:     refreshCurrentView();
16927:   }catch(err){ toast('Gagal menghapus: ' + err.message, true); }
16928: }
16929: function refreshCurrentView(){
16930:   const navActive = $('.nav-btn.active');
16931:   const activeSection = document.querySelector('.view.active');
16932:   const active = (navActive && navActive.dataset.view)
16933:     || (activeSection && String(activeSection.id||'').replace(/^view-/,''))
16934:     || PREVIOUS_ACTIVE_VIEW
16935:     || 'dashboard';
16936:   const renderers = {
16937:     utama:renderUtama, mesin:renderMesinView, tanggal:renderTanggalView,
16938:     pelapor:renderPelaporView, group:renderGroupView, durasi:renderDurasiView,
16939:     correlation:renderCorrelationView, diagnostic:renderDiagnosticView,
16940:     dashboard:renderDashboardView
16941:   };
16942:   if(renderers[active]){
16943:     try{
16944:       const result = renderers[active]();
16945:       if(result && typeof result.then === 'function'){
16946:         result.catch(err=>{
16947:           console.error('[OMODOS] refreshCurrentView gagal:', active, err);
16948:           toast('Gagal memperbarui halaman: ' + (err&&err.message?err.message:String(err)), true);
16949:         });
16950:       }
16951:     }catch(err){
16952:       console.error('[OMODOS] refreshCurrentView gagal:', active, err);
16953:       toast('Gagal memperbarui halaman: ' + (err&&err.message?err.message:String(err)), true);
16954:     }
16955:   }
16956: }
~~~

## SPAREPART_ROWS.map
### Around line 7755
~~~text
07743:       if(typeof RadioNodeList !== 'undefined' && el instanceof RadioNodeList){
07744:         Array.from(el).forEach(radio=>{ radio.checked = (radio.value === value); });
07745:       }else{
07746:         el.value = value;
07747:       }
07748:     });
07749:     if(draft.kodeMesinLainnya && $('#input-kodeMesin-lainnya')) $('#input-kodeMesin-lainnya').value = draft.kodeMesinLainnya;
07750:     if(draft.namaMesinLainnya && $('#input-namaMesin-lainnya')) $('#input-namaMesin-lainnya').value = draft.namaMesinLainnya;
07751:     syncLogbookLocationForm_();
07752: 
07753:     if(Array.isArray(draft.spareparts) && draft.spareparts.length && typeof renderSparepartRows === 'function'){
07754:       SPAREPART_ROWS = draft.spareparts;
07755:       SPAREPART_ROW_ID = Math.max(0, ...SPAREPART_ROWS.map(r=>r.id||0));
07756:       renderSparepartRows();
07757:     }
07758:     if(Array.isArray(draft.additionalPersonil) && typeof ADDITIONAL_PERSONIL_ROWS !== 'undefined'){
07759:       ADDITIONAL_PERSONIL_ROWS = draft.additionalPersonil;
07760:       if(ADDITIONAL_PERSONIL_ROWS.length){
07761:         ADDITIONAL_PERSONIL_ID = Math.max(0, ...ADDITIONAL_PERSONIL_ROWS.map(r=>r.id||0));
07762:       }
07763:       if(typeof renderAdditionalPersonil==='function') renderAdditionalPersonil();
07764:   if(typeof renderPatrolAdditionalPersonil_==='function') renderPatrolAdditionalPersonil_();
07765:     }
07766:     if(typeof computeEstimasi === 'function') computeEstimasi();
07767:   }finally{
07768:     FORM_ENTRY_DRAFT_RESTORING = false;
07769:   }
07770: 
07771:   toast('Draft Input Logbook sebelumnya berhasil dipulihkan.');
07772: 
07773:   if(document.body.classList.contains('low-cognitive')){
07774:     initLowCognitiveWizard();
07775:     lcWizardGoToStep(draft.step || 0);
07776:   }
07777: }
07778: 
07779: const formEntryForDraft = $('#form-entry');
07780: if(formEntryForDraft){
07781:   formEntryForDraft.addEventListener('input', saveFormEntryDraftDebounced);
07782:   formEntryForDraft.addEventListener('change', saveFormEntryDraftDebounced);
07783:   formEntryForDraft.addEventListener('reset', ()=>{
07784:     clearFormEntryDraft();
07785:     setTimeout(()=>{ if(document.body.classList.contains('low-cognitive')) lcWizardGoToStep(0); }, 0);
07786:   });
07787: }
07788: 
07789: // Terapkan langsung saat halaman dimuat (sebelum interaksi apapun) supaya
07790: // tidak ada "flash" tampilan normal kalau user sudah pernah mengaktifkannya.
07791: setLowCognitiveMode(isLowCognitiveActive(), { announce:false });
07792: 
07793: const lcModeToggle = $('#lc-mode-toggle');
07794: if(lcModeToggle) lcModeToggle.addEventListener('change', ()=> setLowCognitiveMode(lcModeToggle.checked));
07795: 
07796: const lcQuickBtn = $('#btn-lc-quick-toggle');
07797: if(lcQuickBtn) lcQuickBtn.addEventListener('click', ()=> setLowCognitiveMode(!isLowCognitiveActive()));
07798: 
07799: 
07800: /* ---------------- TOAST ---------------- */
07801: function toast(msg, isError=false){
07802:   const t = $('#toast');
07803:   t.textContent = msg;
07804:   t.className = 'toast active' + (isError ? ' error' : '');
07805:   clearTimeout(t._timer);
07806:   t._timer = setTimeout(()=> t.classList.remove('active'), 3800);
07807: }
07808: 
07809: /* ---------------- API ---------------- */
07810: async function parseApiResponse_(res){
07811:   const raw = await res.text();
07812:   try{
07813:     return JSON.parse(raw);
07814:   }catch(err){
07815:     const looksHtml = /^\s*</.test(raw) || /<!doctype|<html/i.test(raw);
07816:     if(looksHtml){
07817:       throw new Error('Backend mengirim halaman HTML, bukan JSON. Pastikan Cloudflare sudah di-deploy sebagai Web App versi terbaru, akses deployment diizinkan, dan endpoint /api tersedia.');
07818:     }
07819:     throw new Error('Respons backend bukan JSON yang valid. HTTP ' + res.status + '.');
~~~

### Around line 17282
~~~text
17270: let SPAREPART_ROWS = [];
17271: function addSparepartRow(){
17272:   SPAREPART_ROWS.push({ id: ++SPAREPART_ROW_ID, nama:'', sap:'', jumlah:'' });
17273:   renderSparepartRows();
17274: }
17275: function removeSparepartRow(id){
17276:   SPAREPART_ROWS = SPAREPART_ROWS.filter(r=>r.id!==id);
17277:   if(!SPAREPART_ROWS.length) addSparepartRow(); else renderSparepartRows();
17278: }
17279: function renderSparepartRows(){
17280:   const holder = $('#sparepart-rows');
17281:   if(!holder) return;
17282:   holder.innerHTML = SPAREPART_ROWS.map((r,i)=>`
17283:     <div class="sparepart-row" data-id="${r.id}">
17284:       <div class="field"><label>${i===0?'Nama Material yang Digunakan (opsional)':'Nama Material (opsional)'}</label>
17285:         <div class="sp-suggest-wrap">
17286:           <input type="text" class="sp-nama" autocomplete="off" placeholder="Ketik nama material untuk melihat suggestion" value="${escapeHtml(r.nama)}">
17287:           <div class="sp-suggest-box sp-nama-suggest"></div>
17288:         </div>
17289:       </div>
17290:       <div class="field"><label><span>Material Number SAP (opsional)</span><span class="sp-lokasi-hint" style="font-size:11px;font-weight:400;color:var(--amber);">${(()=>{ const l=findSparepartLokasiBySap(r.sap); return l ? `<i class="ph-bold ph-map-pin"></i> Lokasi: ${escapeHtml(l.lokasiGudang||'-')}` : ''; })()}</span></label>
17291:         <div class="sp-suggest-wrap">
17292:           <input type="text" class="sp-sap" autocomplete="off" placeholder="Ketik nomor material untuk melihat suggestion" value="${escapeHtml(r.sap)}">
17293:           <div class="sp-suggest-box sp-sap-suggest"></div>
17294:         </div>
17295:       </div>
17296:       <div class="field"><label>Jumlah (wajib jika menggunakan sparepart)</label>
17297:         <input type="number" class="sp-jumlah" min="1" step="1" inputmode="numeric" placeholder="Masukkan jumlah pemakaian jika menggunakan sparepart" value="${escapeHtml(r.jumlah)}">
17298:       </div>
17299:       ${SPAREPART_ROWS.length>1 ? `<button type="button" class="sparepart-row-remove" data-id="${r.id}"><i class="ph-bold ph-trash"></i></button>` : `<span></span>`}
17300:     </div>`).join('');
17301:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17302:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('input', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17303:   $$('.sp-nama', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'nama')));
17304:   $$('.sp-sap', holder).forEach(el=> el.addEventListener('focus', ()=> handleSparepartLookupInput_(el.closest('.sparepart-row'), 'sap')));
17305:   $$('.sp-nama, .sp-sap', holder).forEach(el=> el.addEventListener('blur', ()=> setTimeout(()=> closeSparepartSuggestBox_(el.closest('.sparepart-row')), 150)));
17306:   $$('.sp-jumlah', holder).forEach(el=> el.addEventListener('input', syncSparepartRowsFromDom));
17307:   $$('.sparepart-row-remove', holder).forEach(btn=>{
17308:     btn.addEventListener('click', ()=> removeSparepartRow(Number(btn.dataset.id)));
17309:   });
17310: }
17311: function closeSparepartSuggestBox_(rowEl){
17312:   if(!rowEl) return;
17313:   $$('.sp-suggest-box', rowEl).forEach(box=>{ box.classList.remove('open'); box.innerHTML=''; });
17314: }
17315: /* Menampilkan suggestion KHUSUS berdasarkan field yang sedang diketik:
17316:    - field Nama Material -> filter & cocokkan HANYA terhadap x.nama
17317:    - field Material Number SAP -> filter & cocokkan HANYA terhadap x.sap
17318:    Dibuat custom (bukan <datalist> bawaan browser) supaya suggestion tidak
17319:    pernah "ketuker" antara nama & nomor material seperti pada native datalist. */
17320: function handleSparepartLookupInput_(rowEl, source){
17321:   if(!rowEl) return;
17322:   const namaEl = $('.sp-nama', rowEl);
17323:   const sapEl = $('.sp-sap', rowEl);
17324:   const master = Array.isArray(SPAREPART_LOKASI) ? SPAREPART_LOKASI : [];
17325:   const normalize = v=>String(v||'').trim().toLowerCase();
17326: 
17327:   if(source === 'nama'){
17328:     const box = $('.sp-nama-suggest', rowEl);
17329:     const q = normalize(namaEl.value);
17330:     if(box){
17331:       const seen = new Set();
17332:       const results = q ? master.filter(x=>{
17333:         const key = normalize(x.nama);
17334:         if(!key || !key.includes(q) || seen.has(key)) return false;
17335:         seen.add(key); return true;
17336:       }).slice(0,30) : [];
17337:       renderSparepartSuggestBox_(box, results, (item)=>{
17338:         namaEl.value = item.nama || '';
17339:         sapEl.value = item.sap || '';
17340:         closeSparepartSuggestBox_(rowEl);
17341:         syncSparepartRowsFromDom();
17342:       }, x=>x.nama, x=> x.sap ? `SAP: ${x.sap}` : 'Belum ada nomor material');
17343:     }
17344:     // Preserve manual edits; fill the paired field only after an explicit suggestion selection.
17345:   }else if(source === 'sap'){
17346:     const box = $('.sp-sap-suggest', rowEl);
~~~

## sparepartData
No match.

## function submitEntry
No match.

## form-entry
### Around line 2791
~~~text
02779: 
02780: /* --- Switch component (dipakai di Settings & Quick Settings) --- */
02781: .lc-switch{position:relative;display:inline-flex;align-items:center;gap:12px;cursor:pointer;user-select:none;}
02782: .lc-switch input{position:absolute;opacity:0;width:1px;height:1px;}
02783: .lc-switch .lc-track{width:52px;height:30px;background:var(--line);border-radius:999px;position:relative;transition:background var(--trans);flex-shrink:0;}
02784: .lc-switch .lc-track::after{content:'';position:absolute;top:3px;left:3px;width:24px;height:24px;background:#fff;border-radius:50%;transition:transform var(--trans);box-shadow:0 1px 3px rgba(0,0,0,.35);}
02785: .lc-switch input:checked + .lc-track{background:var(--red);}
02786: .lc-switch input:checked + .lc-track::after{transform:translateX(22px);}
02787: .lc-switch input:focus-visible + .lc-track{outline:2px solid var(--red);outline-offset:2px;}
02788: .lc-switch .lc-switch-label{font-size:13.5px;font-weight:600;color:var(--text);}
02789: 
02790: /* ---------------- FORM WIZARD MODE ----------------
02791:    Dipakai di form panjang (mis. #form-entry). Saat mode wizard aktif,
02792:    form diberi class "wizard-mode" dan setiap section (dibungkus otomatis
02793:    oleh initFormWizard() jadi .wizard-step) disembunyikan kecuali step
02794:    yang sedang aktif (.wizard-step.active). Mode standar = default,
02795:    semua step tampil sekaligus seperti form biasa (tanpa class tambahan). */
02796: form.wizard-mode .wizard-step{ display:none; }
02797: form.wizard-mode .wizard-step.active{ display:block; animation:wizardStepIn .18s ease; }
02798: @keyframes wizardStepIn{ from{ opacity:0; transform:translateY(6px);} to{ opacity:1; transform:translateY(0);} }
02799: .wizard-progress{ display:flex; align-items:center; gap:6px; margin-bottom:14px; flex-wrap:wrap; }
02800: .wizard-progress .wp-dot{ flex:1; min-width:18px; height:6px; border-radius:4px; background:var(--line); transition:background var(--trans); }
02801: .wizard-progress .wp-dot.done, .wizard-progress .wp-dot.current{ background:var(--red); }
02802: .wizard-stepinfo{ font-size:12.5px; color:var(--text-dim); margin-bottom:14px; }
02803: .wizard-stepinfo b{ color:var(--text); }
02804: .wizard-nav-btns{ display:flex; gap:10px; }
02805: 
02806: .topbar-menu-btn.lc-quick-btn{position:relative;}
02807: .topbar-menu-btn.lc-quick-btn[aria-pressed="true"]{color:var(--red);border-color:var(--red);}
02808: .topbar-menu-btn.lc-quick-btn[aria-pressed="true"]::after{content:'';position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--red);box-shadow:0 0 6px var(--red);}
02809: 
02810: /* --- Mode aktif: body.low-cognitive --- */
02811: body.low-cognitive{ font-size:16.5px; }
02812: body.low-cognitive [data-lc-hide]{ display:none !important; }
02813: 
02814: /* Kurangi animasi & efek visual berlebih */
02815: body.low-cognitive *{ animation-duration:.001ms !important; animation-iteration-count:1 !important; scroll-behavior:auto !important; }
02816: body.low-cognitive .card, body.low-cognitive .dash-card, body.low-cognitive .an-card,
02817: body.low-cognitive .sidebar, body.low-cognitive .modal, body.low-cognitive .btn{ box-shadow:none !important; }
02818: body.low-cognitive .dash-card:hover{ transform:none !important; filter:none !important; }
02819: /* Pengecualian: kedip status Normal/Perlu Perhatian/Kritikal di card mesin Home BUKAN
02820:    animasi dekoratif — ini sinyal status mesin (aman/butuh perhatian/breakdown)
02821:    yang wajib tetap terlihat berkedip walau Mode Low-Cognitive aktif.
02822:    Frekuensi sengaja beda per status (lihat dashPulseGreen/Amber/Red di atas). */
02823: body.low-cognitive .dash-card.status-normal{ animation-duration:2.6s !important; animation-iteration-count:infinite !important; }
02824: body.low-cognitive .dash-card.status-perhatian{ animation-duration:1.6s !important; animation-iteration-count:infinite !important; }
02825: body.low-cognitive .dash-card.status-kritikal{ animation-duration:.6s !important; animation-iteration-count:infinite !important; }
02826: 
02827: /* Whitespace lebih lega + card lebih sederhana */
02828: body.low-cognitive .card{ padding:22px !important; margin-bottom:22px !important; border-width:1px !important; }
02829: body.low-cognitive .topbar{ margin-bottom:20px !important; }
02830: body.low-cognitive .i40-banner{ display:none !important; }
02831: 
02832: /* Font & tap target lebih besar, kontras lebih tinggi */
02833: body.low-cognitive h1{ font-size:22px !important; }
02834: body.low-cognitive .sub{ font-size:14px !important; opacity:1 !important; }
02835: body.low-cognitive label{ font-size:14px !important; font-weight:700 !important; }
02836: body.low-cognitive .section-title{ font-size:15px !important; }
02837: body.low-cognitive .btn{ min-height:48px !important; padding:12px 20px !important; font-size:15px !important; }
02838: /* Home controls share compact dimensions, including mobile low cognitive mode. */
02839: body.low-cognitive #home-mesin-filter .machine-chip,
02840: body.low-cognitive #btn-lc-priority-only,
02841: body.low-cognitive #btn-refresh-dashboard{
02842:   display:inline-flex;align-items:center;justify-content:center;gap:6px;
02843:   min-height:30px !important;padding:5px 11px !important;font-size:12px !important;
02844:   line-height:18px !important;border-radius:8px !important;
02845: }
02846: 
02847: body.low-cognitive input, body.low-cognitive select, body.low-cognitive textarea{ min-height:48px !important; font-size:15.5px !important; padding:12px 14px !important; }
02848: body.low-cognitive .nav-btn, body.low-cognitive .nav-parent-btn{ min-height:48px !important; font-size:15px !important; }
02849: body.low-cognitive .bottom-nav-btn{ min-height:52px !important; }
02850: 
02851: /* Form: paksa satu kolom supaya fokus pada satu input sekaligus */
02852: body.low-cognitive .grid2, body.low-cognitive .grid3, body.low-cognitive .grid4{ display:grid !important; grid-template-columns:1fr !important; }
02853: 
02854: /* Sidebar: otomatis collapse submenu selain yang sedang aktif supaya menu tidak penuh */
02855: body.low-cognitive .nav-submenu:not(.open){ display:none !important; }
~~~

### Around line 3495
~~~text
03483:           <h1>Input Logbook Harian</h1>
03484:           <div class="sub">Catat pekerjaan maintenance yang baru dikerjakan atau sedang berjalan.</div>
03485:         </div>
03486:         <label class="lc-switch" id="form-wizard-toggle-wrap" title="Ubah cara mengisi form: sekaligus (Standar) atau bertahap per langkah (Wizard)">
03487:           <input type="checkbox" id="form-wizard-toggle" aria-label="Aktifkan Mode Wizard">
03488:           <span class="lc-track" aria-hidden="true"></span>
03489:           <span class="lc-switch-label" id="form-wizard-toggle-label">Mode Wizard</span>
03490:         </label>
03491:       </div>
03492: 
03493:       <div class="card">
03494:         <div class="sub" role="note">Jika data pada field teks tidak tersedia, isi dengan simbol <b>-</b>. Jumlah sparepart wajib diisi jika menggunakan sparepart.</div>
03495: <form id="form-entry" novalidate>
03496:           <div class="section-title"><i class="ph-bold ph-info"></i> Informasi Umum</div>
03497:           <div class="grid2">
03498:             <div class="field"><label>Tanggal</label><input type="date" name="tanggal" required></div>
03499:             <div class="field"><label>Shift</label>
03500:               <select name="shift" required><option>Shift 1</option><option>Shift 2</option><option>Shift 3</option><option>Non-Shift</option></select>
03501:             </div>
03502:           </div>
03503:           <div class="grid3">
03504:             <div class="field"><label>Grouping Pekerjaan</label>
03505:               <select name="groupingPekerjaan" required>
03506:                 <option>Electrical</option>
03507:                 <option>Mechanical</option>
03508:                 <option>Workshop</option>
03509:                 <option>Project</option>
03510:                 <option>Warehouse</option>
03511:                 <option>Planning</option>
03512:                 <option>IPAL</option>
03513:               </select>
03514:             </div>
03515:             <div class="field"><label>Grouping Team</label>
03516:               <select name="groupingTeam" required>
03517:                 <option>A</option><option>B</option><option>C</option><option>D</option><option>Non-Shift</option>
03518:               </select>
03519:             </div>
03520:             <div class="field"><label>Prioritas</label>
03521:               <select name="prioritas" required><option>Rendah</option><option selected>Sedang</option><option>Tinggi</option><option>Emergency</option></select>
03522:             </div>
03523:           </div>
03524:           <div class="grid2">
03525:             <div class="field"><label>Nama Pelapor / Teknisi Utama <span style="color:var(--red);">*</span></label>
03526:               <select name="namaPelapor" id="select-namaPelapor" required>
03527:                 <option value="">Pilih personil...</option>
03528:               </select>
03529:               <div class="sub" style="margin-top:4px;">Teknisi utama. Jika tim, tambah personil lain di bawah (opsional).</div>
03530:             </div>
03531:             <div class="field"><label>Nomor Notifikasi Pekerjaan</label><input type="text" name="nomorNotifikasi" placeholder="Contoh: 10023456" required></div>
03532:           </div>
03533:           <div class="field" id="field-additional-personil" style="margin-top:10px;">
03534:             <label>Personil Tambahan (Opsional - tidak wajib)</label>
03535:             <div class="sub" style="margin-bottom:8px;">Klik tombol di bawah jika pekerjaan dikerjakan lebih dari 1 orang. Bisa kosong.</div>
03536:             <div id="additional-personil-container" style="display:flex; flex-direction:column; gap:8px;"></div>
03537:             <button type="button" class="btn btn-ghost btn-sm" id="btn-add-personil-tambahan" style="margin-top:8px;"><i class="ph-bold ph-users-three"></i> Tambah Personil Lain</button>
03538:           </div>
03539: 
03540:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-map-pin"></i> Lokasi Pekerjaan</div>
03541:           <div class="field"><label for="select-lokasiPekerjaan">Pekerjaan di</label><select name="lokasiPekerjaan" id="select-lokasiPekerjaan"><option value="Mesin">Mesin / Peralatan</option><option value="Area">Area</option></select></div>
03542:           <div id="entry-area-fields" class="grid2" hidden>
03543:             <div class="field"><label for="select-kategoriArea">Kategori Area</label><select name="kategoriArea" id="select-kategoriArea" disabled><option value="">Pilih kategori...</option></select></div>
03544:             <div class="field"><label for="select-namaArea">Area</label><select name="namaArea" id="select-namaArea" disabled><option value="">Pilih area...</option></select></div>
03545:           </div>
03546:           <div id="entry-machine-fields">
03547:           <div class="section-title" style="margin-top:6px;"><i class="ph-bold ph-gear-six"></i> Mesin / Peralatan</div>
03548:           <div class="grid3">
03549:             <div class="field"><label>Kode Mesin</label>
03550: 		<select name="kodeMesin" id="select-kodeMesin" required>
03551:               <option value="">Pilih kode mesin...</option>
03552:             </select>
03553: 	</div>
03554: 
03555: 
03556:             <div class="field"><label>Nama Mesin</label>
03557: 	<select name="namaMesin" id="select-namaMesin" required>
03558:               <option value="">Pilih nama mesin...</option>
03559:             </select>
~~~

### Around line 7690
~~~text
07678: );
07679: 
07680: /* ---- Draft otomatis untuk form Input Logbook ----
07681:    Menyimpan progres pengisian (nilai field + baris sparepart + langkah
07682:    wizard aktif) ke localStorage supaya tidak hilang kalau user pindah
07683:    halaman/menutup app sebelum menekan Simpan. Key baru, terpisah dari
07684:    seluruh key LocalStorage yang sudah ada, dan tidak mengubah struktur
07685:    `entry` yang dikirim ke server (hanya dibaca ulang untuk mengisi form). */
07686: let FORM_ENTRY_DRAFT_RESTORING = false;
07687: let formEntryDraftSaveTimer = null;
07688: 
07689: function collectFormEntryDraft(){
07690:   const form = $('#form-entry');
07691:   if(!form) return null;
07692:   const fd = new FormData(form);
07693:   const fields = Object.fromEntries(fd.entries());
07694:   const kodeLainnya = $('#input-kodeMesin-lainnya');
07695:   const namaLainnya = $('#input-namaMesin-lainnya');
07696:   return {
07697:     fields,
07698:     kodeMesinLainnya: kodeLainnya ? kodeLainnya.value : '',
07699:     namaMesinLainnya: namaLainnya ? namaLainnya.value : '',
07700:     spareparts: (typeof SPAREPART_ROWS !== 'undefined') ? SPAREPART_ROWS : [],
07701:     additionalPersonil: (typeof ADDITIONAL_PERSONIL_ROWS !== 'undefined') ? ADDITIONAL_PERSONIL_ROWS : [],
07702:     step: LC_WIZARD_INDEX,
07703:     ts: Date.now()
07704:   };
07705: }
07706: 
07707: function saveFormEntryDraft(){
07708:   if(FORM_ENTRY_DRAFT_RESTORING) return;
07709:   try{
07710:     const draft = collectFormEntryDraft();
07711:     if(!draft) return;
07712:     localStorage.setItem(LS_FORM_ENTRY_DRAFT_KEY, JSON.stringify(draft));
07713:   }catch(e){}
07714: }
07715: function saveFormEntryDraftDebounced(){
07716:   clearTimeout(formEntryDraftSaveTimer);
07717:   formEntryDraftSaveTimer = setTimeout(saveFormEntryDraft, 500);
07718: }
07719: function clearFormEntryDraft(){
07720:   try{ localStorage.removeItem(LS_FORM_ENTRY_DRAFT_KEY); }catch(e){}
07721: }
07722: function loadFormEntryDraft(){
07723:   try{ return JSON.parse(localStorage.getItem(LS_FORM_ENTRY_DRAFT_KEY) || 'null'); }catch(e){ return null; }
07724: }
07725: 
07726: function restoreFormEntryDraft(){
07727:   const draft = loadFormEntryDraft();
07728:   if(!draft || !draft.fields) return;
07729:   const form = $('#form-entry');
07730:   if(!form) return;
07731:   // Draft cuma dianggap relevan kalau ada isian nyata (bukan form kosong).
07732:   const hasContent = Object.values(draft.fields).some(v => v && String(v).trim());
07733:   if(!hasContent) return;
07734: 
07735:   FORM_ENTRY_DRAFT_RESTORING = true;
07736:   try{
07737:     if(draft.fields.lokasiPekerjaan) $('#select-lokasiPekerjaan').value=draft.fields.lokasiPekerjaan;
07738:     $('#select-kategoriArea').value=draft.fields.kategoriArea||'';
07739:     populateWorkAreaOptions_($('#select-kategoriArea').value,$('#select-namaArea'),draft.fields.namaArea);
07740:     Object.entries(draft.fields).forEach(([name, value])=>{
07741:       const el = form.elements.namedItem(name);
07742:       if(!el || value === undefined) return;
07743:       if(typeof RadioNodeList !== 'undefined' && el instanceof RadioNodeList){
07744:         Array.from(el).forEach(radio=>{ radio.checked = (radio.value === value); });
07745:       }else{
07746:         el.value = value;
07747:       }
07748:     });
07749:     if(draft.kodeMesinLainnya && $('#input-kodeMesin-lainnya')) $('#input-kodeMesin-lainnya').value = draft.kodeMesinLainnya;
07750:     if(draft.namaMesinLainnya && $('#input-namaMesin-lainnya')) $('#input-namaMesin-lainnya').value = draft.namaMesinLainnya;
07751:     syncLogbookLocationForm_();
07752: 
07753:     if(Array.isArray(draft.spareparts) && draft.spareparts.length && typeof renderSparepartRows === 'function'){
07754:       SPAREPART_ROWS = draft.spareparts;
~~~

### Around line 7729
~~~text
07717:   formEntryDraftSaveTimer = setTimeout(saveFormEntryDraft, 500);
07718: }
07719: function clearFormEntryDraft(){
07720:   try{ localStorage.removeItem(LS_FORM_ENTRY_DRAFT_KEY); }catch(e){}
07721: }
07722: function loadFormEntryDraft(){
07723:   try{ return JSON.parse(localStorage.getItem(LS_FORM_ENTRY_DRAFT_KEY) || 'null'); }catch(e){ return null; }
07724: }
07725: 
07726: function restoreFormEntryDraft(){
07727:   const draft = loadFormEntryDraft();
07728:   if(!draft || !draft.fields) return;
07729:   const form = $('#form-entry');
07730:   if(!form) return;
07731:   // Draft cuma dianggap relevan kalau ada isian nyata (bukan form kosong).
07732:   const hasContent = Object.values(draft.fields).some(v => v && String(v).trim());
07733:   if(!hasContent) return;
07734: 
07735:   FORM_ENTRY_DRAFT_RESTORING = true;
07736:   try{
07737:     if(draft.fields.lokasiPekerjaan) $('#select-lokasiPekerjaan').value=draft.fields.lokasiPekerjaan;
07738:     $('#select-kategoriArea').value=draft.fields.kategoriArea||'';
07739:     populateWorkAreaOptions_($('#select-kategoriArea').value,$('#select-namaArea'),draft.fields.namaArea);
07740:     Object.entries(draft.fields).forEach(([name, value])=>{
07741:       const el = form.elements.namedItem(name);
07742:       if(!el || value === undefined) return;
07743:       if(typeof RadioNodeList !== 'undefined' && el instanceof RadioNodeList){
07744:         Array.from(el).forEach(radio=>{ radio.checked = (radio.value === value); });
07745:       }else{
07746:         el.value = value;
07747:       }
07748:     });
07749:     if(draft.kodeMesinLainnya && $('#input-kodeMesin-lainnya')) $('#input-kodeMesin-lainnya').value = draft.kodeMesinLainnya;
07750:     if(draft.namaMesinLainnya && $('#input-namaMesin-lainnya')) $('#input-namaMesin-lainnya').value = draft.namaMesinLainnya;
07751:     syncLogbookLocationForm_();
07752: 
07753:     if(Array.isArray(draft.spareparts) && draft.spareparts.length && typeof renderSparepartRows === 'function'){
07754:       SPAREPART_ROWS = draft.spareparts;
07755:       SPAREPART_ROW_ID = Math.max(0, ...SPAREPART_ROWS.map(r=>r.id||0));
07756:       renderSparepartRows();
07757:     }
07758:     if(Array.isArray(draft.additionalPersonil) && typeof ADDITIONAL_PERSONIL_ROWS !== 'undefined'){
07759:       ADDITIONAL_PERSONIL_ROWS = draft.additionalPersonil;
07760:       if(ADDITIONAL_PERSONIL_ROWS.length){
07761:         ADDITIONAL_PERSONIL_ID = Math.max(0, ...ADDITIONAL_PERSONIL_ROWS.map(r=>r.id||0));
07762:       }
07763:       if(typeof renderAdditionalPersonil==='function') renderAdditionalPersonil();
07764:   if(typeof renderPatrolAdditionalPersonil_==='function') renderPatrolAdditionalPersonil_();
07765:     }
07766:     if(typeof computeEstimasi === 'function') computeEstimasi();
07767:   }finally{
07768:     FORM_ENTRY_DRAFT_RESTORING = false;
07769:   }
07770: 
07771:   toast('Draft Input Logbook sebelumnya berhasil dipulihkan.');
07772: 
07773:   if(document.body.classList.contains('low-cognitive')){
07774:     initLowCognitiveWizard();
07775:     lcWizardGoToStep(draft.step || 0);
07776:   }
07777: }
07778: 
07779: const formEntryForDraft = $('#form-entry');
07780: if(formEntryForDraft){
07781:   formEntryForDraft.addEventListener('input', saveFormEntryDraftDebounced);
07782:   formEntryForDraft.addEventListener('change', saveFormEntryDraftDebounced);
07783:   formEntryForDraft.addEventListener('reset', ()=>{
07784:     clearFormEntryDraft();
07785:     setTimeout(()=>{ if(document.body.classList.contains('low-cognitive')) lcWizardGoToStep(0); }, 0);
07786:   });
07787: }
07788: 
07789: // Terapkan langsung saat halaman dimuat (sebelum interaksi apapun) supaya
07790: // tidak ada "flash" tampilan normal kalau user sudah pernah mengaktifkannya.
07791: setLowCognitiveMode(isLowCognitiveActive(), { announce:false });
07792: 
07793: const lcModeToggle = $('#lc-mode-toggle');
~~~

### Around line 7779
~~~text
07767:   }finally{
07768:     FORM_ENTRY_DRAFT_RESTORING = false;
07769:   }
07770: 
07771:   toast('Draft Input Logbook sebelumnya berhasil dipulihkan.');
07772: 
07773:   if(document.body.classList.contains('low-cognitive')){
07774:     initLowCognitiveWizard();
07775:     lcWizardGoToStep(draft.step || 0);
07776:   }
07777: }
07778: 
07779: const formEntryForDraft = $('#form-entry');
07780: if(formEntryForDraft){
07781:   formEntryForDraft.addEventListener('input', saveFormEntryDraftDebounced);
07782:   formEntryForDraft.addEventListener('change', saveFormEntryDraftDebounced);
07783:   formEntryForDraft.addEventListener('reset', ()=>{
07784:     clearFormEntryDraft();
07785:     setTimeout(()=>{ if(document.body.classList.contains('low-cognitive')) lcWizardGoToStep(0); }, 0);
07786:   });
07787: }
07788: 
07789: // Terapkan langsung saat halaman dimuat (sebelum interaksi apapun) supaya
07790: // tidak ada "flash" tampilan normal kalau user sudah pernah mengaktifkannya.
07791: setLowCognitiveMode(isLowCognitiveActive(), { announce:false });
07792: 
07793: const lcModeToggle = $('#lc-mode-toggle');
07794: if(lcModeToggle) lcModeToggle.addEventListener('change', ()=> setLowCognitiveMode(lcModeToggle.checked));
07795: 
07796: const lcQuickBtn = $('#btn-lc-quick-toggle');
07797: if(lcQuickBtn) lcQuickBtn.addEventListener('click', ()=> setLowCognitiveMode(!isLowCognitiveActive()));
07798: 
07799: 
07800: /* ---------------- TOAST ---------------- */
07801: function toast(msg, isError=false){
07802:   const t = $('#toast');
07803:   t.textContent = msg;
07804:   t.className = 'toast active' + (isError ? ' error' : '');
07805:   clearTimeout(t._timer);
07806:   t._timer = setTimeout(()=> t.classList.remove('active'), 3800);
07807: }
07808: 
07809: /* ---------------- API ---------------- */
07810: async function parseApiResponse_(res){
07811:   const raw = await res.text();
07812:   try{
07813:     return JSON.parse(raw);
07814:   }catch(err){
07815:     const looksHtml = /^\s*</.test(raw) || /<!doctype|<html/i.test(raw);
07816:     if(looksHtml){
07817:       throw new Error('Backend mengirim halaman HTML, bukan JSON. Pastikan Cloudflare sudah di-deploy sebagai Web App versi terbaru, akses deployment diizinkan, dan endpoint /api tersedia.');
07818:     }
07819:     throw new Error('Respons backend bukan JSON yang valid. HTTP ' + res.status + '.');
07820:   }
07821: }
07822: async function fetchWithTimeout_(url, options={}, timeoutMs=45000){
07823:   // PATCHED v2.1 - timeout 45s default + pesan cold start
07824:   const controller = new AbortController();
07825:   const timer = setTimeout(()=>controller.abort(), timeoutMs);
07826:   try{ return await fetch(url, {...options, signal:controller.signal}); }
07827:   catch(err){
07828:     if(err && err.name==='AbortError') throw new Error('Backend timeout setelah '+Math.round(timeoutMs/1000)+' detik. Periksa koneksi internet lalu coba kembali.');
07829:     throw err;
07830:   }finally{ clearTimeout(timer); }
07831: }
07832: function handleApiAuthFailure_(message, requestToken){
07833:   const msg = String(message || '');
07834:   if(!/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(msg)) return;
07835:   if(SETTING_AUTH_OK && SETTING_SESSION_TOKEN && requestToken === SETTING_SESSION_TOKEN){
07836:     resetSettingAuth();
07837:     return;
07838:   }
07839:   logoutUser();
07840: }
07841: // Session-only read cache; isolated by backend, token and parameters.
07842: const READY_READS = new Map();
07843: const ACTIVE_READS = new Map();
~~~

### Around line 8831
~~~text
08819:   entry.lokasiPekerjaan='Mesin';entry.kategoriArea='-';entry.namaArea='-';
08820:   if(entry.kodeMesin===MACHINE_LAINNYA_VALUE)entry.kodeMesin=$('#input-kodeMesin-lainnya').value.trim();
08821:   if(entry.namaMesin===MACHINE_LAINNYA_VALUE)entry.namaMesin=$('#input-namaMesin-lainnya').value.trim();
08822:   if(!entry.kodeMesin||!entry.namaMesin)throw new Error('Kode Mesin dan Nama Mesin wajib diisi.');
08823:   const machine=MACHINES.find(m=>String(m['Kode Mesin']||'').trim()===entry.kodeMesin||String(m['Nama Mesin']||'').trim()===entry.namaMesin);
08824:   entry.lokasi=machine?String(machine['Lokasi/Area']||'').trim():'-';
08825:  }
08826:  return entry;
08827: }
08828: $('#select-kategoriArea').innerHTML='<option value="">Pilih kategori...</option>'+Object.keys(OMODOS_WORK_AREAS).map(a=>'<option>'+escapeHtml(a)+'</option>').join('');
08829: $('#select-lokasiPekerjaan').addEventListener('change',syncLogbookLocationForm_);
08830: $('#select-kategoriArea').addEventListener('change',()=>populateWorkAreaOptions_($('#select-kategoriArea').value,$('#select-namaArea'),''));
08831: $('#form-entry').addEventListener('reset',()=>setTimeout(syncLogbookLocationForm_,0));
08832: syncLogbookLocationForm_();
08833: 
08834: function updateSidebarCounts(){
08835:   $('#cnt-utama').textContent = ENTRIES.length;
08836: }
08837: 
08838: /* ---------------- HELPERS ---------------- */
08839: function escapeHtml(s){
08840:   if(s===undefined || s===null) return '';
08841:   return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
08842: }
08843: function statusClass(status){
08844:   const s = String(status||'').toLowerCase();
08845:   if(s.includes('selesai')) return 'selesai';
08846:   if(s.includes('proses')) return 'proses';
08847:   if(s.includes('emergency')) return 'emergency';
08848:   return 'pending';
08849: }
08850: function prioClass(p){
08851:   const s = String(p||'').toLowerCase();
08852:   if(s.includes('tinggi')||s.includes('emergency')) return 'tinggi';
08853:   if(s.includes('sedang')) return 'sedang';
08854:   return 'rendah';
08855: }
08856: function fmtDate(d){
08857:   if(!d) return '-';
08858:   const dt = new Date(d);
08859:   if(isNaN(dt)) return d;
08860:   return dt.toLocaleDateString('id-ID', {weekday:'short', day:'2-digit', month:'short', year:'numeric'});
08861: }
08862: 
08863: /* Kunci tanggal ternormalisasi (YYYY-MM-DD) dipakai untuk mengelompokkan & mengurutkan
08864:    entri per tanggal. Backend database SQLite kadang mengembalikan nilai tanggal sebagai
08865:    objek Date (bukan string), yang kalau dipakai langsung sebagai key object akan
08866:    di-toString() otomatis (mis. "Fri Aug 07 2026 00:00:00 GMT+0700...") — kalau key
08867:    seperti itu diurutkan dengan .sort() biasa, urutannya jadi alfabetis per nama bulan/hari,
08868:    BUKAN kronologis, sehingga sortir "Terbaru"/"Terlama" jadi kacau. Fungsi ini memastikan
08869:    key selalu format ISO yyyy-mm-dd yang urut secara leksikografis = urut secara kronologis.*/
08870: function dateKeyOf(tgl){
08871:   if(!tgl) return null;
08872:   const dt = new Date(tgl);
08873:   if(isNaN(dt)) return null;
08874:   const y = dt.getFullYear();
08875:   const m = String(dt.getMonth()+1).padStart(2,'0');
08876:   const d = String(dt.getDate()).padStart(2,'0');
08877:   return `${y}-${m}-${d}`;
08878: }
08879: 
08880: function isFutureDate(tgl){
08881:   if(!tgl) return false;
08882:   const d = new Date(tgl);
08883:   if(isNaN(d)) return false;
08884:   const today = new Date(); today.setHours(23,59,59,999);
08885:   return d.getTime() > today.getTime();
08886: }
08887: 
08888: /* Laporan logbook dengan Tanggal sebelum 15 Agustus 2026 adalah hasil
08889:    migrasi data lama dari OneNote (sebelum aplikasi ini dipakai), jadi
08890:    diberi keterangan "Import dari OneNote" di kartu logbook-nya. */
08891: const ONENOTE_IMPORT_CUTOFF = new Date('2026-08-15T00:00:00');
08892: function isOneNoteImport(tgl){
08893:   if(!tgl) return false;
08894:   const d = new Date(tgl);
08895:   if(isNaN(d)) return false;
~~~

### Around line 17527
~~~text
17515: [['ta-deskripsiMasalah','btn-ai-fix-deskripsiMasalah','Deskripsi Masalah / Kerusakan'],
17516:  ['ta-tindakanPerbaikan','btn-ai-fix-tindakanPerbaikan','Tindakan Perbaikan yang Dilakukan'],
17517:  ['input-namaUnit','btn-ai-fix-namaUnit','Nama Unit (Sub-Mesin)'],
17518:  ['ta-catatan','btn-ai-fix-catatan','Catatan Tambahan']]
17519:   .forEach(([taId,btnId,label])=>{
17520:     const b = document.getElementById(btnId);
17521:     if(b) b.addEventListener('click', ()=> groqFixTextareaTypo(taId, btnId, label));
17522:   });
17523: 
17524: // [FITUR BARU] Koreksi typo OTOMATIS untuk seluruh field manual/prose di
17525: // form Input Logbook, dijalankan otomatis saat "Simpan Logbook" diklik --
17526: // SEBELUM data dikirim ke Sheets (lihat pemanggilannya di
17527: // $('#form-entry').addEventListener('submit', ...) di bawah). User tidak
17528: // perlu klik tombol AI satu-satu lagi (tombol manual di atas tetap ada
17529: // untuk yang mau intip hasilnya sebelum submit).
17530: //
17531: // Field yang di-cover: Deskripsi Masalah, Tindakan Perbaikan, Nama Unit,
17532: // dan Catatan -- semuanya teks bebas yang diketik manual.
17533: // SENGAJA TIDAK termasuk: Nomor Notifikasi Pekerjaan (nomor/ID kerja dari
17534: // SAP -- kalau AI "membetulkan" satu digit angka ID, nomor itu jadi salah
17535: // total dan sulit dilacak/dibetulkan lagi setelah tersimpan). Field selain
17536: // itu semua <select> (Shift, Mesin, Jenis Pekerjaan, Status, dst) yang
17537: // memang sudah dipilih dari daftar, bukan diketik bebas, jadi tidak perlu
17538: // dikoreksi ejaan.
17539: const GROQ_AUTOFIX_ENTRY_FIELDS = [
17540:   { key:'deskripsiMasalah', label:'Deskripsi Masalah / Kerusakan' },
17541:   { key:'tindakanPerbaikan', label:'Tindakan Perbaikan yang Dilakukan' },
17542:   { key:'namaUnit', label:'Nama Unit (Sub-Mesin)' },
17543:   { key:'catatan', label:'Catatan' }
17544: ];
17545: async function groqAutoFixEntryFields(entry){
17546:   let changedCount = 0;
17547:   // Paralel (Promise.all), bukan sequential, supaya total tambahan waktu
17548:   // sebelum simpan cuma sekitar 1 request Groq, bukan 4x berturut-turut.
17549:   await Promise.all(GROQ_AUTOFIX_ENTRY_FIELDS.map(async ({key,label})=>{
17550:     if(!entry[key]) return;
17551:     const corrected = await groqFixTextRaw(entry[key], label, {failOpen:true});
17552:     if(corrected){ entry[key] = corrected; changedCount++; }
17553:   }));
17554:   return changedCount;
17555: }
17556: 
17557: function buildMaterialFieldsFromRows(){
17558:   syncSparepartRowsFromDom();
17559:   // Seluruh field sparepart bersifat opsional. Simpan setiap nilai yang
17560:   // memang diisi tanpa memaksa kelengkapan field lain pada baris yang sama.
17561:   const rows = SPAREPART_ROWS
17562:     .map(r=>({...r,nama:norm_(r.nama)?String(r.nama).trim():'',sap:norm_(r.sap)?String(r.sap).trim():'',jumlah:norm_(r.jumlah)?r.jumlah:''}))
17563:     .filter(r=>r.nama.trim() || r.sap.trim() || String(r.jumlah).trim())
17564:     .map(r=>{
17565:       const master = r.sap.trim() ? findSparepartLokasiBySap(r.sap.trim()) : null;
17566:       return { ...r, lokasiSparepart: master ? String(master.lokasiGudang||'').trim() : '' };
17567:     });
17568:   rows.forEach((r,i)=>{ if(!(Number(r.jumlah)>0) || !Number.isFinite(Number(r.jumlah))) throw new Error('Jumlah sparepart baris '+(i+1)+' wajib diisi dengan angka lebih dari 0.'); if(!r.nama.trim() && !r.sap.trim()) throw new Error('Isi nama atau nomor SAP sparepart baris '+(i+1)+'.'); });
17569:   const namaMaterial = rows.map(r=> r.jumlah ? `${r.nama.trim()} (${r.jumlah} pcs)` : r.nama.trim()).filter(Boolean).join('; ');
17570:   const materialNumberSAP = rows.map(r=> r.sap.trim()).filter(Boolean).join('; ');
17571:   // Backend lama mewajibkan kolom Lokasi Sparepart. Nilai fallback ini
17572:   // menjaga kompatibilitas tanpa menjadikan input sparepart wajib bagi user.
17573:   const lokasiSparepart = rows.length
17574:     ? rows.map(r=>r.lokasiSparepart || 'Belum terdaftar').join('; ')
17575:     : 'Tidak menggunakan sparepart';
17576:   return { namaMaterial, materialNumberSAP, lokasiSparepart, detail: rows };
17577: }
17578: 
17579: /* ---------------- FILE UPLOAD (FORM) ---------------- */
17580: const fileDrop = $('#file-drop');
17581: const fileInput = $('#file-input');
17582: fileDrop.addEventListener('click', ()=> fileInput.click());
17583: fileDrop.addEventListener('dragover', ev=>{ ev.preventDefault(); fileDrop.style.borderColor='var(--red)'; });
17584: fileDrop.addEventListener('dragleave', ()=>{ fileDrop.style.borderColor='var(--line)'; });
17585: fileDrop.addEventListener('drop', ev=>{
17586:   ev.preventDefault(); fileDrop.style.borderColor='var(--line)';
17587:   handleFiles(ev.dataTransfer.files);
17588: });
17589: fileInput.addEventListener('change', ()=> { handleFiles(fileInput.files); fileInput.value=''; });
17590: 
17591: async function handleFiles(fileList){
~~~

### Around line 17671
~~~text
17659:     });
17660:   });
17661: }
17662: 
17663: /* ---------------- FORM WIZARD MODE (Mode Standar <-> Mode Wizard) ----------------
17664:    Toggle switch (reuse komponen .lc-switch) untuk mengubah form panjang jadi
17665:    alur step-by-step. Section form yang sudah ada (dipisah oleh .section-title)
17666:    otomatis dibungkus jadi .wizard-step tanpa perlu ubah markup satu-satu, jadi
17667:    struktur & handler input yang sudah ada (file-drop, sparepart-rows, dst) tetap
17668:    utuh — cuma direparent ke wrapper step-nya. Kalau user klik Submit padahal
17669:    step wizard belum lengkap, submit dicegah + toast peringatan + lompat ke
17670:    step yang belum lengkap (lihat form._wizardGuardSubmit, dipanggil di
17671:    handler submit form-entry di bawah). */
17672: function initFormWizard(formSel, toggleSel, labelSel, navSel){
17673:   const form = $(formSel), toggle = $(toggleSel), label = $(labelSel), nav = $(navSel);
17674:   if(!form || !toggle || !nav || form.dataset.wizardReady) return;
17675:   form.dataset.wizardReady = '1';
17676: 
17677:   const actionsBar = form.querySelector('#entry-actions-bar');
17678:   const kids = Array.from(form.children).filter(el=> el !== actionsBar && el !== nav);
17679:   const groups = [];
17680:   kids.forEach(el=>{
17681:     if(el.classList.contains('section-title') || !groups.length){
17682:       groups.push({ title: el.classList.contains('section-title') ? el.textContent.trim() : 'Data', els: [] });
17683:     }
17684:     groups[groups.length-1].els.push(el);
17685:   });
17686:   const steps = groups.map((g, i)=>{
17687:     const wrap = document.createElement('div');
17688:     wrap.className = 'wizard-step';
17689:     wrap.dataset.step = i;
17690:     wrap.dataset.title = g.title;
17691:     g.els[0].parentNode.insertBefore(wrap, g.els[0]);
17692:     g.els.forEach(el=> wrap.appendChild(el));
17693:     return wrap;
17694:   });
17695:   let current = 0;
17696: 
17697:   const requiredFieldsIn = stepEl => $$('input[required], select[required], textarea[required]', stepEl);
17698:   // PENTING: pakai `f.validity.valid`, BUKAN `f.checkValidity()`/`reportValidity()`.
17699:   // Field yang berada di step non-aktif punya `display:none` (lewat CSS
17700:   // `form.wizard-mode .wizard-step{display:none}`), dan elemen yang tidak
17701:   // dirender otomatis "barred from constraint validation" oleh browser —
17702:   // artinya checkValidity() SELALU return true untuknya walau kosong.
17703:   // Sebelumnya ini membuat validasi step tersembunyi lolos begitu saja.
17704:   // `.validity.valid` tetap mencerminkan constraint sebenarnya terlepas
17705:   // dari status render, jadi baris kosong di step manapun tetap terdeteksi.
17706:   const stepIsValid = stepEl => requiredFieldsIn(stepEl).every(f=> f.validity.valid);
17707:   const firstInvalidStepIndex = () => steps.findIndex(s=> !stepIsValid(s));
17708:   // Fokuskan & tampilkan pesan validasi native untuk field tertentu, meski
17709:   // field itu ada di step yang sedang disembunyikan (harus dipindah ke
17710:   // step aktif dulu supaya reportValidity() punya efek visual).
17711:   function focusInvalidField(f){
17712:     const stepEl = f.closest('.wizard-step');
17713:     if(stepEl){ const idx = steps.indexOf(stepEl); if(idx !== -1) goToStep(idx); }
17714:     setTimeout(()=>{ f.reportValidity(); f.focus({preventScroll:false}); }, 0);
17715:   }
17716: 
17717:   function renderNav(){
17718:     if(!form.classList.contains('wizard-mode')){ nav.style.display='none'; nav.innerHTML=''; return; }
17719:     nav.style.display = '';
17720:     nav.innerHTML = `
17721:       <div class="wizard-progress">${steps.map((s,i)=>`<span class="wp-dot ${i<current?'done':(i===current?'current':'')}"></span>`).join('')}</div>
17722:       <div class="wizard-stepinfo">Langkah <b>${current+1}</b> dari <b>${steps.length}</b>: <b>${escapeHtml(steps[current].dataset.title||'')}</b></div>
17723:       <div class="wizard-nav-btns">
17724:         ${current>0 ? `<button type="button" class="btn btn-ghost btn-sm" id="wizard-btn-prev"><i class="ph-bold ph-arrow-left"></i> Sebelumnya</button>` : ''}
17725:         ${current<steps.length-1 ? `<button type="button" class="btn btn-primary btn-sm" id="wizard-btn-next">Lanjut <i class="ph-bold ph-arrow-right"></i></button>` : ''}
17726:       </div>`;
17727:     const btnPrev = $('#wizard-btn-prev', nav), btnNext = $('#wizard-btn-next', nav);
17728:     if(btnPrev) btnPrev.addEventListener('click', ()=> goToStep(current-1));
17729:     // Sengaja TIDAK ada validasi wajib di sini untuk pindah "Lanjut" antar
17730:     // langkah — konsisten dengan aturan "validasi hanya sekali, di tombol
17731:     // Simpan akhir" (lihat form._wizardGuardSubmit / validateFormEntryOnce
17732:     // di handler submit). Wizard boleh dijelajah bebas maju-mundur.
17733:     if(btnNext) btnNext.addEventListener('click', ()=> goToStep(current+1));
17734:   }
17735:   function goToStep(i){
~~~

### Around line 17765
~~~text
17753:   toggle.addEventListener('change', ()=> setWizardMode(toggle.checked));
17754:   // Default: Mode Wizard AKTIF untuk first-time user / non-teknis (aturan
17755:   // "default to wizard mode"). Kalau user pernah pilih manual sebelumnya,
17756:   // preferensi itu dihormati (localStorage).
17757:   let savedRaw = null;
17758:   try{ savedRaw = localStorage.getItem('form_wizard_' + form.id); }catch(e){}
17759:   const saved = savedRaw === null ? true : savedRaw === '1';
17760:   toggle.checked = saved;
17761:   setWizardMode(saved);
17762: 
17763:   // Satu-satunya titik validasi sebelum data benar-benar dikirim ke server —
17764:   // dipakai sama persis oleh Mode Standar maupun Mode Wizard (lihat handler
17765:   // submit #form-entry). Karena form diberi atribut `novalidate`, browser
17766:   // TIDAK melakukan validasi otomatis apa pun sendiri (yang sebelumnya
17767:   // berperilaku beda antar mode: di Mode Standar auto-divalidasi browser
17768:   // sebelum event submit sempat berjalan, sementara di Mode Wizard field di
17769:   // step tersembunyi malah dilewati) — sekarang satu fungsi ini yang jadi
17770:   // sumber kebenaran tunggal untuk kedua mode.
17771:   form._wizardGuardSubmit = function(){
17772:     const idx = firstInvalidStepIndex();
17773:     if(idx === -1) return true;
17774:     goToStep(idx);
17775:     const firstInvalid = steps[idx].querySelector('input, select, textarea');
17776:     const invalidField = requiredFieldsIn(steps[idx]).find(f=> !f.validity.valid) || firstInvalid;
17777:     if(invalidField) focusInvalidField(invalidField);
17778:     toast(form.classList.contains('wizard-mode')
17779:       ? `Lengkapi dulu langkah "${steps[idx].dataset.title||('Langkah '+(idx+1))}" sebelum menyimpan.`
17780:       : `Lengkapi field yang wajib diisi di bagian "${steps[idx].dataset.title||('Langkah '+(idx+1))}".`, true);
17781:     return false;
17782:   };
17783: }
17784: initFormWizard('#form-entry', '#form-wizard-toggle', '#form-wizard-toggle-label', '#wizard-nav');
17785: // [FIX WIZARD] Toggle "Mode Wizard" di halaman Soft Skill Assessment & Hard Skill Assessment
17786: // sudah ada di HTML (#pi-ss-wizard-toggle / #pi-hs-wizard-toggle) tapi sebelumnya TIDAK PERNAH
17787: // disambungkan ke initFormWizard() -- hanya #form-entry (Input Logbook) yang diaktifkan.
17788: // Akibatnya toggle di dua halaman itu tidak melakukan apa-apa saat diklik.
17789: // initFormWizard tidak mensyaratkan elemen <form> asli, jadi aman dipakai pada <div class="card">.
17790: initFormWizard('#pi-ss-form-card', '#pi-ss-wizard-toggle', '#pi-ss-wizard-toggle-label', '#pi-ss-wizard-nav');
17791: initFormWizard('#pi-hs-form-card', '#pi-hs-wizard-toggle', '#pi-hs-wizard-toggle-label', '#pi-hs-wizard-nav');
17792: 
17793: /* ---------------- FORM SUBMIT ---------------- */
17794: $('#form-entry').addEventListener('submit', async (ev)=>{
17795:   ev.preventDefault();
17796:   if(ev.target._wizardGuardSubmit && !ev.target._wizardGuardSubmit()) return;
17797:   if(!WEB_APP_URL){ toast('Hubungkan aplikasi ke database SQLite dulu (menu Master Mesin & Koneksi).', true); return; }
17798:   const btn = $('#btn-submit');
17799:   btn.disabled = true; btn.textContent = 'Menyimpan...';
17800:   try{
17801:     const fd = new FormData(ev.target);
17802:     const entry = Object.fromEntries(fd.entries());
17803:     applyLogbookLocationPayload_(entry);
17804:     const additionalNames = (typeof getAdditionalPersonilNames === 'function') ? getAdditionalPersonilNames() : [];
17805:     entry.personilTambahan = additionalNames;
17806:     entry.personilTambahanStr = additionalNames.join(', ');
17807:     entry.semuaPersonil = [entry.namaPelapor, ...additionalNames].filter(Boolean).join(', ');
17808:     const jenisLower = String(entry.jenisPekerjaan||'').toLowerCase();
17809:     entry.isPreventive = jenisLower.includes('preventive');
17810:     const sparepartFields = buildMaterialFieldsFromRows();
17811:     entry.namaMaterial = sparepartFields.namaMaterial;
17812:     entry.materialNumberSAP = sparepartFields.materialNumberSAP;
17813:     entry.lokasiSparepart = sparepartFields.lokasiSparepart;
17814:     entry.sparepartDetail = sparepartFields.detail;
17815:     const now = new Date();
17816:     entry.waktu = now.toTimeString().slice(0,5);
17817:     // [FITUR BARU] Koreksi typo otomatis (Groq) untuk field manual/prose --
17818:     // dijalankan di sini: SETELAH validasi lolos (jadi tidak ada percobaan
17819:     // koreksi kalau datanya sendiri belum valid), tapi SEBELUM apiPost ke
17820:     // Sheets, sesuai permintaan. Fail-open: kalau backend/koneksi Groq
17821:     // bermasalah, groqFixTextRaw() di dalamnya sudah menangkap error sendiri
17822:     // dan mengembalikan teks asli -- proses simpan TETAP lanjut.
17823:     btn.innerHTML = '<span class="ai-spinner" style="width:12px;height:12px;"></span> Memeriksa ejaan (AI)...';
17824:     const groqChangedCount = await groqAutoFixEntryFields(entry);
17825:     btn.disabled = true; btn.textContent = 'Menyimpan...';
17826:     ['namaUnit','tindakanPerbaikan','catatan','nomorNotifikasi'].forEach(k=>{ if(!String(entry[k]||'').trim()) entry[k]='-'; });
17827:     const files = PENDING_FILES.map(f=>({name:f.name, mimeType:f.mimeType, base64:f.base64}));
17828:     const saved = await apiPost({action:'addEntry', entry, files});
17829:     if(saved.newSpareparts && saved.newSpareparts.length) toast(saved.newSpareparts.length+' sparepart baru ditambahkan. Lengkapi datanya di menu Sparepart.');
~~~

### Around line 17784
~~~text
17772:     const idx = firstInvalidStepIndex();
17773:     if(idx === -1) return true;
17774:     goToStep(idx);
17775:     const firstInvalid = steps[idx].querySelector('input, select, textarea');
17776:     const invalidField = requiredFieldsIn(steps[idx]).find(f=> !f.validity.valid) || firstInvalid;
17777:     if(invalidField) focusInvalidField(invalidField);
17778:     toast(form.classList.contains('wizard-mode')
17779:       ? `Lengkapi dulu langkah "${steps[idx].dataset.title||('Langkah '+(idx+1))}" sebelum menyimpan.`
17780:       : `Lengkapi field yang wajib diisi di bagian "${steps[idx].dataset.title||('Langkah '+(idx+1))}".`, true);
17781:     return false;
17782:   };
17783: }
17784: initFormWizard('#form-entry', '#form-wizard-toggle', '#form-wizard-toggle-label', '#wizard-nav');
17785: // [FIX WIZARD] Toggle "Mode Wizard" di halaman Soft Skill Assessment & Hard Skill Assessment
17786: // sudah ada di HTML (#pi-ss-wizard-toggle / #pi-hs-wizard-toggle) tapi sebelumnya TIDAK PERNAH
17787: // disambungkan ke initFormWizard() -- hanya #form-entry (Input Logbook) yang diaktifkan.
17788: // Akibatnya toggle di dua halaman itu tidak melakukan apa-apa saat diklik.
17789: // initFormWizard tidak mensyaratkan elemen <form> asli, jadi aman dipakai pada <div class="card">.
17790: initFormWizard('#pi-ss-form-card', '#pi-ss-wizard-toggle', '#pi-ss-wizard-toggle-label', '#pi-ss-wizard-nav');
17791: initFormWizard('#pi-hs-form-card', '#pi-hs-wizard-toggle', '#pi-hs-wizard-toggle-label', '#pi-hs-wizard-nav');
17792: 
17793: /* ---------------- FORM SUBMIT ---------------- */
17794: $('#form-entry').addEventListener('submit', async (ev)=>{
17795:   ev.preventDefault();
17796:   if(ev.target._wizardGuardSubmit && !ev.target._wizardGuardSubmit()) return;
17797:   if(!WEB_APP_URL){ toast('Hubungkan aplikasi ke database SQLite dulu (menu Master Mesin & Koneksi).', true); return; }
17798:   const btn = $('#btn-submit');
17799:   btn.disabled = true; btn.textContent = 'Menyimpan...';
17800:   try{
17801:     const fd = new FormData(ev.target);
17802:     const entry = Object.fromEntries(fd.entries());
17803:     applyLogbookLocationPayload_(entry);
17804:     const additionalNames = (typeof getAdditionalPersonilNames === 'function') ? getAdditionalPersonilNames() : [];
17805:     entry.personilTambahan = additionalNames;
17806:     entry.personilTambahanStr = additionalNames.join(', ');
17807:     entry.semuaPersonil = [entry.namaPelapor, ...additionalNames].filter(Boolean).join(', ');
17808:     const jenisLower = String(entry.jenisPekerjaan||'').toLowerCase();
17809:     entry.isPreventive = jenisLower.includes('preventive');
17810:     const sparepartFields = buildMaterialFieldsFromRows();
17811:     entry.namaMaterial = sparepartFields.namaMaterial;
17812:     entry.materialNumberSAP = sparepartFields.materialNumberSAP;
17813:     entry.lokasiSparepart = sparepartFields.lokasiSparepart;
17814:     entry.sparepartDetail = sparepartFields.detail;
17815:     const now = new Date();
17816:     entry.waktu = now.toTimeString().slice(0,5);
17817:     // [FITUR BARU] Koreksi typo otomatis (Groq) untuk field manual/prose --
17818:     // dijalankan di sini: SETELAH validasi lolos (jadi tidak ada percobaan
17819:     // koreksi kalau datanya sendiri belum valid), tapi SEBELUM apiPost ke
17820:     // Sheets, sesuai permintaan. Fail-open: kalau backend/koneksi Groq
17821:     // bermasalah, groqFixTextRaw() di dalamnya sudah menangkap error sendiri
17822:     // dan mengembalikan teks asli -- proses simpan TETAP lanjut.
17823:     btn.innerHTML = '<span class="ai-spinner" style="width:12px;height:12px;"></span> Memeriksa ejaan (AI)...';
17824:     const groqChangedCount = await groqAutoFixEntryFields(entry);
17825:     btn.disabled = true; btn.textContent = 'Menyimpan...';
17826:     ['namaUnit','tindakanPerbaikan','catatan','nomorNotifikasi'].forEach(k=>{ if(!String(entry[k]||'').trim()) entry[k]='-'; });
17827:     const files = PENDING_FILES.map(f=>({name:f.name, mimeType:f.mimeType, base64:f.base64}));
17828:     const saved = await apiPost({action:'addEntry', entry, files});
17829:     if(saved.newSpareparts && saved.newSpareparts.length) toast(saved.newSpareparts.length+' sparepart baru ditambahkan. Lengkapi datanya di menu Sparepart.');
17830:     toast(groqChangedCount ? `Logbook berhasil disimpan ✓ (${groqChangedCount} field ejaan diperbaiki otomatis)` : 'Logbook berhasil disimpan ✓');
17831:     clearFormEntryDraft();
17832:     ev.target.reset();
17833:     PENDING_FILES = [];
17834:     renderFilePreviews();
17835:     resetSparepartRows();
17836:     if(typeof resetAdditionalPersonil === 'function') resetAdditionalPersonil();
17837:     // Penyimpanan sudah sukses; refresh seluruh modul berjalan di background
17838:     // agar satu endpoint lambat tidak mengunci tombol/form tanpa batas.
17839:     loadAll().catch(()=>{});
17840:     syncLogbookLocationForm_();
17841:   }catch(err){
17842:     toast('Gagal menyimpan: ' + err.message, true);
17843:   }finally{
17844:     btn.disabled = false; btn.innerHTML = '<i class="ph-bold ph-check-circle"></i> Simpan Logbook';
17845:   }
17846: });
17847: 
17848: /* ---------------- SETTING VIEW: KONEKSI & MASTER MESIN ---------------- */
~~~

## const rows = SPAREPART_ROWS
### Around line 17561
~~~text
17549:   await Promise.all(GROQ_AUTOFIX_ENTRY_FIELDS.map(async ({key,label})=>{
17550:     if(!entry[key]) return;
17551:     const corrected = await groqFixTextRaw(entry[key], label, {failOpen:true});
17552:     if(corrected){ entry[key] = corrected; changedCount++; }
17553:   }));
17554:   return changedCount;
17555: }
17556: 
17557: function buildMaterialFieldsFromRows(){
17558:   syncSparepartRowsFromDom();
17559:   // Seluruh field sparepart bersifat opsional. Simpan setiap nilai yang
17560:   // memang diisi tanpa memaksa kelengkapan field lain pada baris yang sama.
17561:   const rows = SPAREPART_ROWS
17562:     .map(r=>({...r,nama:norm_(r.nama)?String(r.nama).trim():'',sap:norm_(r.sap)?String(r.sap).trim():'',jumlah:norm_(r.jumlah)?r.jumlah:''}))
17563:     .filter(r=>r.nama.trim() || r.sap.trim() || String(r.jumlah).trim())
17564:     .map(r=>{
17565:       const master = r.sap.trim() ? findSparepartLokasiBySap(r.sap.trim()) : null;
17566:       return { ...r, lokasiSparepart: master ? String(master.lokasiGudang||'').trim() : '' };
17567:     });
17568:   rows.forEach((r,i)=>{ if(!(Number(r.jumlah)>0) || !Number.isFinite(Number(r.jumlah))) throw new Error('Jumlah sparepart baris '+(i+1)+' wajib diisi dengan angka lebih dari 0.'); if(!r.nama.trim() && !r.sap.trim()) throw new Error('Isi nama atau nomor SAP sparepart baris '+(i+1)+'.'); });
17569:   const namaMaterial = rows.map(r=> r.jumlah ? `${r.nama.trim()} (${r.jumlah} pcs)` : r.nama.trim()).filter(Boolean).join('; ');
17570:   const materialNumberSAP = rows.map(r=> r.sap.trim()).filter(Boolean).join('; ');
17571:   // Backend lama mewajibkan kolom Lokasi Sparepart. Nilai fallback ini
17572:   // menjaga kompatibilitas tanpa menjadikan input sparepart wajib bagi user.
17573:   const lokasiSparepart = rows.length
17574:     ? rows.map(r=>r.lokasiSparepart || 'Belum terdaftar').join('; ')
17575:     : 'Tidak menggunakan sparepart';
17576:   return { namaMaterial, materialNumberSAP, lokasiSparepart, detail: rows };
17577: }
17578: 
17579: /* ---------------- FILE UPLOAD (FORM) ---------------- */
17580: const fileDrop = $('#file-drop');
17581: const fileInput = $('#file-input');
17582: fileDrop.addEventListener('click', ()=> fileInput.click());
17583: fileDrop.addEventListener('dragover', ev=>{ ev.preventDefault(); fileDrop.style.borderColor='var(--red)'; });
17584: fileDrop.addEventListener('dragleave', ()=>{ fileDrop.style.borderColor='var(--line)'; });
17585: fileDrop.addEventListener('drop', ev=>{
17586:   ev.preventDefault(); fileDrop.style.borderColor='var(--line)';
17587:   handleFiles(ev.dataTransfer.files);
17588: });
17589: fileInput.addEventListener('change', ()=> { handleFiles(fileInput.files); fileInput.value=''; });
17590: 
17591: async function handleFiles(fileList){
17592:   const files = Array.from(fileList);
17593:   for(const file of files){
17594:     if(file.size > 120 * 1024 * 1024){
17595:       toast(`File "${file.name}" terlalu besar (maks 120MB sebelum kompresi).`, true);
17596:       continue;
17597:     }
17598:     const isImage = file.type.startsWith('image');
17599:     const isVideo = file.type.startsWith('video');
17600:     let blob = file, mimeType = file.type, name = file.name;
17601: 
17602:     if(isImage){
17603:       toast(`Mengompres foto "${file.name}"...`);
17604:       blob = await compressImageFile(file);
17605:       mimeType = 'image/jpeg';
17606:       name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
17607:     } else if(isVideo){
17608:       toast(`Mengompres video "${file.name}", mohon tunggu (± sepanjang durasi video)...`);
17609:       blob = await compressVideoFile(file);
17610:       if(blob !== file){
17611:         mimeType = 'video/webm';
17612:         name = file.name.replace(/\.[^.]+$/, '') + '.webm';
17613:       }
17614:     }
17615: 
17616:     if(blob.size > MAX_CLIENT_UPLOAD_BYTES){
17617:       toast(`File "${name}" masih terlalu besar setelah kompresi (${(blob.size/1024/1024).toFixed(1)} MB). Maksimal 9 MB per file.`, true);
17618:       continue;
17619:     }
17620: 
17621:     await new Promise((resolveRead)=>{
17622:       const reader = new FileReader();
17623:       reader.onload = ()=>{
17624:         const base64 = reader.result.split(',')[1];
17625:         PENDING_FILES.push({
~~~

## Jumlah sparepart baris
### Around line 17568
~~~text
17556: 
17557: function buildMaterialFieldsFromRows(){
17558:   syncSparepartRowsFromDom();
17559:   // Seluruh field sparepart bersifat opsional. Simpan setiap nilai yang
17560:   // memang diisi tanpa memaksa kelengkapan field lain pada baris yang sama.
17561:   const rows = SPAREPART_ROWS
17562:     .map(r=>({...r,nama:norm_(r.nama)?String(r.nama).trim():'',sap:norm_(r.sap)?String(r.sap).trim():'',jumlah:norm_(r.jumlah)?r.jumlah:''}))
17563:     .filter(r=>r.nama.trim() || r.sap.trim() || String(r.jumlah).trim())
17564:     .map(r=>{
17565:       const master = r.sap.trim() ? findSparepartLokasiBySap(r.sap.trim()) : null;
17566:       return { ...r, lokasiSparepart: master ? String(master.lokasiGudang||'').trim() : '' };
17567:     });
17568:   rows.forEach((r,i)=>{ if(!(Number(r.jumlah)>0) || !Number.isFinite(Number(r.jumlah))) throw new Error('Jumlah sparepart baris '+(i+1)+' wajib diisi dengan angka lebih dari 0.'); if(!r.nama.trim() && !r.sap.trim()) throw new Error('Isi nama atau nomor SAP sparepart baris '+(i+1)+'.'); });
17569:   const namaMaterial = rows.map(r=> r.jumlah ? `${r.nama.trim()} (${r.jumlah} pcs)` : r.nama.trim()).filter(Boolean).join('; ');
17570:   const materialNumberSAP = rows.map(r=> r.sap.trim()).filter(Boolean).join('; ');
17571:   // Backend lama mewajibkan kolom Lokasi Sparepart. Nilai fallback ini
17572:   // menjaga kompatibilitas tanpa menjadikan input sparepart wajib bagi user.
17573:   const lokasiSparepart = rows.length
17574:     ? rows.map(r=>r.lokasiSparepart || 'Belum terdaftar').join('; ')
17575:     : 'Tidak menggunakan sparepart';
17576:   return { namaMaterial, materialNumberSAP, lokasiSparepart, detail: rows };
17577: }
17578: 
17579: /* ---------------- FILE UPLOAD (FORM) ---------------- */
17580: const fileDrop = $('#file-drop');
17581: const fileInput = $('#file-input');
17582: fileDrop.addEventListener('click', ()=> fileInput.click());
17583: fileDrop.addEventListener('dragover', ev=>{ ev.preventDefault(); fileDrop.style.borderColor='var(--red)'; });
17584: fileDrop.addEventListener('dragleave', ()=>{ fileDrop.style.borderColor='var(--line)'; });
17585: fileDrop.addEventListener('drop', ev=>{
17586:   ev.preventDefault(); fileDrop.style.borderColor='var(--line)';
17587:   handleFiles(ev.dataTransfer.files);
17588: });
17589: fileInput.addEventListener('change', ()=> { handleFiles(fileInput.files); fileInput.value=''; });
17590: 
17591: async function handleFiles(fileList){
17592:   const files = Array.from(fileList);
17593:   for(const file of files){
17594:     if(file.size > 120 * 1024 * 1024){
17595:       toast(`File "${file.name}" terlalu besar (maks 120MB sebelum kompresi).`, true);
17596:       continue;
17597:     }
17598:     const isImage = file.type.startsWith('image');
17599:     const isVideo = file.type.startsWith('video');
17600:     let blob = file, mimeType = file.type, name = file.name;
17601: 
17602:     if(isImage){
17603:       toast(`Mengompres foto "${file.name}"...`);
17604:       blob = await compressImageFile(file);
17605:       mimeType = 'image/jpeg';
17606:       name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
17607:     } else if(isVideo){
17608:       toast(`Mengompres video "${file.name}", mohon tunggu (± sepanjang durasi video)...`);
17609:       blob = await compressVideoFile(file);
17610:       if(blob !== file){
17611:         mimeType = 'video/webm';
17612:         name = file.name.replace(/\.[^.]+$/, '') + '.webm';
17613:       }
17614:     }
17615: 
17616:     if(blob.size > MAX_CLIENT_UPLOAD_BYTES){
17617:       toast(`File "${name}" masih terlalu besar setelah kompresi (${(blob.size/1024/1024).toFixed(1)} MB). Maksimal 9 MB per file.`, true);
17618:       continue;
17619:     }
17620: 
17621:     await new Promise((resolveRead)=>{
17622:       const reader = new FileReader();
17623:       reader.onload = ()=>{
17624:         const base64 = reader.result.split(',')[1];
17625:         PENDING_FILES.push({
17626:           name, mimeType, base64,
17627:           _localUrl: URL.createObjectURL(blob),
17628:           _isVideo: isVideo
17629:         });
17630:         renderFilePreviews();
17631:         const kb = (blob.size/1024).toFixed(0);
17632:         toast(`"${name}" siap diunggah (${kb} KB)`);
~~~

## sparePart:
### Around line 5224
~~~text
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
~~~

### Around line 12736
~~~text
12724:       Object.keys(remote).forEach(id=>{
12725:         const raw = String(remote[id]||'PENDING').toUpperCase();
12726:         next[id] = { status:(raw==='DONE'||raw==='COMPLETED'||raw==='COLLECTED')?'COMPLETED':'PENDING', sapDoc:'', pic:'' };
12727:       });
12728:       SPAREPART_STATUS = next;
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
~~~

### Around line 12743
~~~text
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
12807:   const info = $('#master-sparepart-search-info');
~~~

### Around line 14853
~~~text
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
14855:   });
14856: }
14857: function renderSparepartView(){
14858:   renderTrainingSparepartNotice_();
14859:   loadSparepartStatusLocal();
14860:   renderSparepartCollectDash();
14861:   applySparepartFilters();
14862:   renderSparepartPeriodikChart();
14863:   syncSparepartStatusFromBackend().then((synced)=>{ if(synced){ renderSparepartCollectDash(); applySparepartFilters(); } });
14864: 
14865:   renderSparepartPoDash();
14866:   renderSparepartEtaList();
14867:   syncSparepartEtaFromBackend().then(()=>{ renderSparepartPoDash(); renderSparepartEtaList(); renderSparepartWarehouseList(); });
14868: 
14869:   renderSparepartWarehouseList();
14870:   syncSparepartWarehouseFromBackend().then(()=> renderSparepartWarehouseList());
14871: 
14872:   renderSparepartOpnameList();
14873:   renderSparepartTargetBanner();
14874:   renderSparepartOpnameDash();
14875:   renderSparepartOpnameChecklist();
14876:   syncSparepartOpnameFromBackend().then(()=>{
14877:     renderSparepartOpnameList(); renderSparepartTargetBanner(); renderSparepartOpnameDash(); renderSparepartOpnameChecklist();
14878:   });
14879: 
14880:   // Tab "Master Sparepart" (Lokasi/Harga/Stock) sebelumnya HANYA dirender
14881:   // saat masuk menu Setting, sehingga tab ini tampak kosong/lama muncul
14882:   // kalau user belum pernah membuka Setting di sesi tsb. Render dulu dari
14883:   // cache lokal (instan), lalu sinkron ke backend & render ulang.
14884:   renderSparepartLokasiTable();
14885:   syncSparepartLokasiFromBackend().then(()=> renderSparepartLokasiTable());
14886: }
14887: 
14888: let SPAREPART_PERIODIK_CHART = null;
14889: function renderSparepartPeriodikChart(){
14890:   const canvas = $('#chart-sparepart-periodik');
14891:   if(!canvas || typeof Chart === 'undefined') return;
14892:   const byMonth = {}; // { 'YYYY-MM': { qty, cost } }
14893:   sparepartRows().forEach(({entry:e})=>{
14894:     const d = new Date(e['Tanggal']);
14895:     if(isNaN(d)) return;
14896:     const key = d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0');
14897:     if(!byMonth[key]) byMonth[key] = { qty:0, cost:0 };
14898:     parseSparepartDetail(e).forEach(det=>{
14899:       byMonth[key].qty += det.qty || 1;
14900:       const lokasi = findSparepartLokasiBySap(det.sap);
14901:       if(lokasi) byMonth[key].cost += (lokasi.harga||0) * (det.qty||1);
14902:     });
14903:   });
14904:   const months = Object.keys(byMonth).sort().slice(-12); // 12 bulan terakhir yang ada datanya
14905:   const colors = (typeof anThemeColors === 'function') ? anThemeColors() : { red:'#e63946', amber:'#ffb703', text:'#eceef0', line:'rgba(255,255,255,.08)' };
14906:   if(SPAREPART_PERIODIK_CHART) SPAREPART_PERIODIK_CHART.destroy();
14907:   SPAREPART_PERIODIK_CHART = new Chart(canvas, {
14908:     data: {
14909:       labels: months,
14910:       datasets: [
14911:         { type:'bar', label:'Jumlah Pengambilan', data: months.map(m=>byMonth[m].qty), backgroundColor: colors.amber, yAxisID:'y' },
14912:         { type:'line', label:'Estimasi Cost (Rp)', data: months.map(m=>byMonth[m].cost), borderColor: colors.red, backgroundColor:'color-mix(in srgb, var(--red) 15%, transparent)', tension:.3, yAxisID:'y1' }
14913:       ]
14914:     },
14915:     options: {
14916:       interaction:{ mode:'index', intersect:false },
14917:       plugins:{ legend:{ labels:{ color: colors.text } } },
~~~

### Around line 15181
~~~text
15169: }
15170: const btnExportCollect = $('#btn-export-sparepart-collect');
15171: if(btnExportCollect) btnExportCollect.addEventListener('click', ()=>{
15172:   const rows = sparepartCollectFilteredSorted().map(({entry:e, sap})=>[
15173:     fmtDate(e['Tanggal']), e['ID'], e['Nama Mesin']||'-', e['Nomor WO']||e['No WO']||'-',
15174:     e['Nama Pelapor']||'-', e['Nama Material']||'-', sparepartEntryTotalQty(e),
15175:     (sap.status||'PENDING')==='COMPLETED' ? 'Sudah Dicollect + SAP' : 'Belum Dicollect'
15176:   ]);
15177:   sparepartExportExcel('Sparepart_Daily_Collection.xls',
15178:     ['Date','Logbook No','Machine','WO','PIC','Spare Part','Qty','Status Collection'], rows);
15179: });
15180: 
15181: /* ---------------- SPAREPART: TAB SWITCH ---------------- */
15182: document.querySelectorAll('#view-sparepart .sp-tab-btn').forEach(btn=>{
15183:   btn.addEventListener('click', ()=>{
15184:     document.querySelectorAll('#view-sparepart .sp-tab-btn').forEach(b=>b.classList.remove('active'));
15185:     document.querySelectorAll('#view-sparepart .sp-tab-panel').forEach(p=>p.classList.remove('active'));
15186:     btn.classList.add('active');
15187:     $('#'+btn.dataset.sptab).classList.add('active');
15188:   });
15189: });
15190: 
15191: /* =========================================================
15192:    TAB 2: PO MONITORING
15193:    Dikelola independen (nomor PO, vendor, ETA), TIDAK terhubung ke record
15194:    pemakaian sparepart Logbook — hanya dipakai untuk memantau kedatangan
15195:    barang yang sudah dipesan ke vendor.
15196:    ========================================================= */
15197: let SPAREPART_ETA = [];
15198: function loadSparepartEtaLocal(){
15199:   try{ SPAREPART_ETA = JSON.parse(localStorage.getItem(LS_SPAREPART_ETA_KEY) || '[]'); }
15200:   catch(e){ SPAREPART_ETA = []; }
15201:   // Migrasi status lama (MENUNGGU/TERLAMBAT/TIBA) ke status PO baru
15202:   SPAREPART_ETA.forEach(item=>{
15203:     if(item.status==='MENUNGGU') item.status='WAITING';
15204:     else if(item.status==='TERLAMBAT') item.status='WAITING'; // overdue dihitung otomatis dari tanggal
15205:     else if(item.status==='TIBA') item.status='ARRIVED';
15206:   });
15207: }
15208: function saveSparepartEtaLocal(){ localStorage.setItem(LS_SPAREPART_ETA_KEY, JSON.stringify(SPAREPART_ETA)); }
15209: 
15210: // Status PO final ditentukan otomatis dari tanggal, kecuali sudah ARRIVED/WAREHOUSE (manual/validasi).
15211: function poStatusKey(item){
15212:   if(item.status === 'WAREHOUSE') return 'warehouse';
15213:   if(item.status === 'ARRIVED') return 'arrived';
15214:   const today = new Date(); today.setHours(0,0,0,0);
15215:   if(item.estimasiEta){
15216:     const eta = new Date(item.estimasiEta);
15217:     if(!isNaN(eta) && eta < today) return 'overdue';
15218:   }
15219:   if(item.tanggalPO){
15220:     const po = new Date(item.tanggalPO);
15221:     if(!isNaN(po) && po <= today) return 'intransit';
15222:   }
15223:   return 'waiting';
15224: }
15225: const PO_STATUS_LABEL = { waiting:'Waiting', intransit:'In Transit', overdue:'Overdue', arrived:'Arrived', warehouse:'Warehouse' };
15226: 
15227: loadSparepartEtaLocal();
15228: async function syncSparepartEtaFromBackend(){
15229:   if(!WEB_APP_URL) return SPAREPART_ETA;
15230:   try{
15231:     const remote = await apiGet('sparepartEta');
15232:     if(Array.isArray(remote)){
15233:       SPAREPART_ETA = remote.map(r=>{
15234:         let status = r['Status']||'WAITING';
15235:         if(status==='MENUNGGU') status='WAITING'; else if(status==='TERLAMBAT') status='WAITING'; else if(status==='TIBA') status='ARRIVED';
15236:         return {
15237:           id: r['ID']||('PO-'+Date.now()+Math.random()),
15238:           namaMaterial: r['Nama Material']||'',
15239:           sap: r['Material Number SAP']||'',
15240:           noPO: r['Nomor PO']||'',
15241:           vendor: r['Vendor']||'',
15242:           qty: Number(r['Qty'])||1,
15243:           tanggalPO: r['Tanggal PO']||'',
15244:           estimasiEta: r['Estimasi ETA']||'',
15245:           status,
~~~

### Around line 15914
~~~text
15902:       });
15903:     }
15904:   });
15905: 
15906:   const edges = [];
15907:   edgeWeights.forEach((weight, key)=>{
15908:     const [from,to] = key.split('|');
15909:     edges.push({ from, to, value: weight });
15910:   });
15911:   return { nodes: [...nodes.values()], edges };
15912: }
15913: 
15914: const KG_GROUP_COLORS = { personil:'#4d9de8', mesin:'#e63946', sparepart:'#ffb703', masalah:'#39ffc4' };
15915: const KG_GROUP_LABELS = { personil:'Personil', mesin:'Mesin', sparepart:'Sparepart', masalah:'Masalah' };
15916: 
15917: function renderKnowledgeGraphView(){
15918:   const holder = $('#kg-network');
15919:   if(typeof vis === 'undefined'){
15920:     holder.innerHTML = `<div style="padding:20px;color:var(--text-dim);font-size:13px;">Library vis-network gagal dimuat (butuh koneksi internet untuk CDN). Coba refresh halaman.</div>`;
15921:     return;
15922:   }
15923:   const data = buildKnowledgeGraphData();
15924:   KG_ALL_NODES = data.nodes;
15925:   KG_ALL_EDGES = data.edges;
15926: 
15927:   $('#kg-stat-strip').innerHTML = `
15928:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='personil').length}</div><div class="l">Personil</div></div>
15929:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='mesin').length}</div><div class="l">Mesin</div></div>
15930:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='sparepart').length}</div><div class="l">Sparepart</div></div>
15931:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='masalah').length}</div><div class="l">Masalah</div></div>
15932:   `;
15933: 
15934:   kgDrawNetwork();
15935: }
15936: 
15937: function kgDrawNetwork(){
15938:   const holder = $('#kg-network');
15939:   const typeFilter = $('#filter-kg-type').value;
15940:   const q = ($('#search-kg').value || '').trim().toLowerCase();
15941: 
15942:   let nodesToShow = KG_ALL_NODES.filter(n=> !typeFilter || n.group===typeFilter);
15943:   let nodeIds = new Set(nodesToShow.map(n=>n.id));
15944:   let edgesToShow = KG_ALL_EDGES.filter(e=> nodeIds.has(e.from) && nodeIds.has(e.to));
15945: 
15946:   // Kalau ada pencarian: persempit ke node yang cocok + tetangga langsungnya
15947:   // (ego network), supaya fokus ke bagian graph yang relevan saja.
15948:   if(q){
15949:     const matched = new Set(nodesToShow.filter(n=> n.label.toLowerCase().includes(q)).map(n=>n.id));
15950:     if(matched.size){
15951:       const keep = new Set(matched);
15952:       edgesToShow.forEach(e=>{ if(matched.has(e.from)) keep.add(e.to); if(matched.has(e.to)) keep.add(e.from); });
15953:       nodesToShow = nodesToShow.filter(n=> keep.has(n.id));
15954:       nodeIds = new Set(nodesToShow.map(n=>n.id));
15955:       edgesToShow = edgesToShow.filter(e=> nodeIds.has(e.from) && nodeIds.has(e.to));
15956:     }
15957:   }
15958: 
15959:   const visNodes = new vis.DataSet(nodesToShow.map(n=>({
15960:     id:n.id, label:n.label, group:n.group,
15961:     color:{ background:KG_GROUP_COLORS[n.group], border:KG_GROUP_COLORS[n.group] },
15962:     font:{ color:'#eceef0', size:13 }
15963:   })));
15964:   const visEdges = new vis.DataSet(edgesToShow.map((e,i)=>({ id:i, from:e.from, to:e.to, value:e.value, color:{ color:'rgba(255,255,255,.18)' } })));
15965: 
15966:   if(KG_NETWORK){ KG_NETWORK.destroy(); KG_NETWORK = null; }
15967:   KG_NETWORK = new vis.Network(holder, { nodes:visNodes, edges:visEdges }, {
15968:     nodes:{ shape:'dot', size:16, borderWidth:2 },
15969:     edges:{ smooth:{ type:'continuous' }, scaling:{ min:1, max:6 } },
15970:     physics:{ stabilization:{ iterations:120 }, barnesHut:{ gravitationalConstant:-2500, springLength:110 } },
15971:     interaction:{ hover:true, tooltipDelay:150, dragNodes:true, zoomView:true, dragView:true },
15972:     groups:{
15973:       personil:{ color:{ background:KG_GROUP_COLORS.personil, border:KG_GROUP_COLORS.personil } },
15974:       mesin:{ color:{ background:KG_GROUP_COLORS.mesin, border:KG_GROUP_COLORS.mesin } },
15975:       sparepart:{ color:{ background:KG_GROUP_COLORS.sparepart, border:KG_GROUP_COLORS.sparepart } },
15976:       masalah:{ color:{ background:KG_GROUP_COLORS.masalah, border:KG_GROUP_COLORS.masalah } }
15977:     }
15978:   });
~~~

### Around line 15915
~~~text
15903:     }
15904:   });
15905: 
15906:   const edges = [];
15907:   edgeWeights.forEach((weight, key)=>{
15908:     const [from,to] = key.split('|');
15909:     edges.push({ from, to, value: weight });
15910:   });
15911:   return { nodes: [...nodes.values()], edges };
15912: }
15913: 
15914: const KG_GROUP_COLORS = { personil:'#4d9de8', mesin:'#e63946', sparepart:'#ffb703', masalah:'#39ffc4' };
15915: const KG_GROUP_LABELS = { personil:'Personil', mesin:'Mesin', sparepart:'Sparepart', masalah:'Masalah' };
15916: 
15917: function renderKnowledgeGraphView(){
15918:   const holder = $('#kg-network');
15919:   if(typeof vis === 'undefined'){
15920:     holder.innerHTML = `<div style="padding:20px;color:var(--text-dim);font-size:13px;">Library vis-network gagal dimuat (butuh koneksi internet untuk CDN). Coba refresh halaman.</div>`;
15921:     return;
15922:   }
15923:   const data = buildKnowledgeGraphData();
15924:   KG_ALL_NODES = data.nodes;
15925:   KG_ALL_EDGES = data.edges;
15926: 
15927:   $('#kg-stat-strip').innerHTML = `
15928:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='personil').length}</div><div class="l">Personil</div></div>
15929:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='mesin').length}</div><div class="l">Mesin</div></div>
15930:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='sparepart').length}</div><div class="l">Sparepart</div></div>
15931:     <div class="stat-chip"><div class="n">${data.nodes.filter(n=>n.group==='masalah').length}</div><div class="l">Masalah</div></div>
15932:   `;
15933: 
15934:   kgDrawNetwork();
15935: }
15936: 
15937: function kgDrawNetwork(){
15938:   const holder = $('#kg-network');
15939:   const typeFilter = $('#filter-kg-type').value;
15940:   const q = ($('#search-kg').value || '').trim().toLowerCase();
15941: 
15942:   let nodesToShow = KG_ALL_NODES.filter(n=> !typeFilter || n.group===typeFilter);
15943:   let nodeIds = new Set(nodesToShow.map(n=>n.id));
15944:   let edgesToShow = KG_ALL_EDGES.filter(e=> nodeIds.has(e.from) && nodeIds.has(e.to));
15945: 
15946:   // Kalau ada pencarian: persempit ke node yang cocok + tetangga langsungnya
15947:   // (ego network), supaya fokus ke bagian graph yang relevan saja.
15948:   if(q){
15949:     const matched = new Set(nodesToShow.filter(n=> n.label.toLowerCase().includes(q)).map(n=>n.id));
15950:     if(matched.size){
15951:       const keep = new Set(matched);
15952:       edgesToShow.forEach(e=>{ if(matched.has(e.from)) keep.add(e.to); if(matched.has(e.to)) keep.add(e.from); });
15953:       nodesToShow = nodesToShow.filter(n=> keep.has(n.id));
15954:       nodeIds = new Set(nodesToShow.map(n=>n.id));
15955:       edgesToShow = edgesToShow.filter(e=> nodeIds.has(e.from) && nodeIds.has(e.to));
15956:     }
15957:   }
15958: 
15959:   const visNodes = new vis.DataSet(nodesToShow.map(n=>({
15960:     id:n.id, label:n.label, group:n.group,
15961:     color:{ background:KG_GROUP_COLORS[n.group], border:KG_GROUP_COLORS[n.group] },
15962:     font:{ color:'#eceef0', size:13 }
15963:   })));
15964:   const visEdges = new vis.DataSet(edgesToShow.map((e,i)=>({ id:i, from:e.from, to:e.to, value:e.value, color:{ color:'rgba(255,255,255,.18)' } })));
15965: 
15966:   if(KG_NETWORK){ KG_NETWORK.destroy(); KG_NETWORK = null; }
15967:   KG_NETWORK = new vis.Network(holder, { nodes:visNodes, edges:visEdges }, {
15968:     nodes:{ shape:'dot', size:16, borderWidth:2 },
15969:     edges:{ smooth:{ type:'continuous' }, scaling:{ min:1, max:6 } },
15970:     physics:{ stabilization:{ iterations:120 }, barnesHut:{ gravitationalConstant:-2500, springLength:110 } },
15971:     interaction:{ hover:true, tooltipDelay:150, dragNodes:true, zoomView:true, dragView:true },
15972:     groups:{
15973:       personil:{ color:{ background:KG_GROUP_COLORS.personil, border:KG_GROUP_COLORS.personil } },
15974:       mesin:{ color:{ background:KG_GROUP_COLORS.mesin, border:KG_GROUP_COLORS.mesin } },
15975:       sparepart:{ color:{ background:KG_GROUP_COLORS.sparepart, border:KG_GROUP_COLORS.sparepart } },
15976:       masalah:{ color:{ background:KG_GROUP_COLORS.masalah, border:KG_GROUP_COLORS.masalah } }
15977:     }
15978:   });
15979: 
~~~

### Around line 15975
~~~text
15963:   })));
15964:   const visEdges = new vis.DataSet(edgesToShow.map((e,i)=>({ id:i, from:e.from, to:e.to, value:e.value, color:{ color:'rgba(255,255,255,.18)' } })));
15965: 
15966:   if(KG_NETWORK){ KG_NETWORK.destroy(); KG_NETWORK = null; }
15967:   KG_NETWORK = new vis.Network(holder, { nodes:visNodes, edges:visEdges }, {
15968:     nodes:{ shape:'dot', size:16, borderWidth:2 },
15969:     edges:{ smooth:{ type:'continuous' }, scaling:{ min:1, max:6 } },
15970:     physics:{ stabilization:{ iterations:120 }, barnesHut:{ gravitationalConstant:-2500, springLength:110 } },
15971:     interaction:{ hover:true, tooltipDelay:150, dragNodes:true, zoomView:true, dragView:true },
15972:     groups:{
15973:       personil:{ color:{ background:KG_GROUP_COLORS.personil, border:KG_GROUP_COLORS.personil } },
15974:       mesin:{ color:{ background:KG_GROUP_COLORS.mesin, border:KG_GROUP_COLORS.mesin } },
15975:       sparepart:{ color:{ background:KG_GROUP_COLORS.sparepart, border:KG_GROUP_COLORS.sparepart } },
15976:       masalah:{ color:{ background:KG_GROUP_COLORS.masalah, border:KG_GROUP_COLORS.masalah } }
15977:     }
15978:   });
15979: 
15980:   KG_NETWORK.on('click', (params)=>{
15981:     if(!params.nodes.length){ $('#kg-node-detail').style.display = 'none'; return; }
15982:     kgShowNodeDetail(params.nodes[0]);
15983:   });
15984: 
15985:   if(!holder.querySelector('.kg-legend')){
15986:     holder.insertAdjacentHTML('afterend', `<div class="kg-legend">${Object.keys(KG_GROUP_COLORS).map(g=>
15987:       `<span><span class="dot" style="background:${KG_GROUP_COLORS[g]};"></span>${KG_GROUP_LABELS[g]}</span>`
15988:     ).join('')}</div>`);
15989:   }
15990: }
15991: 
15992: function kgShowNodeDetail(nodeId){
15993:   const [type, ...rest] = nodeId.split(':');
15994:   const label = rest.join(':');
15995:   const panel = $('#kg-node-detail');
15996:   panel.style.display = 'block';
15997: 
15998:   if(type==='p'){
15999:     const stats = expertFinderStats(ENTRIES).find(s=>s.nama===label);
16000:     panel.innerHTML = `
16001:       <div class="section-title"><i class="ph-bold ph-user"></i> ${escapeHtml(label)}</div>
16002:       ${stats ? `<div class="sub">${stats.total} kasus · ${stats.breakdown} breakdown · ${Math.round(stats.successRate*100)}% selesai · ${stats.mesinCount} mesin berbeda</div>` : `<div class="sub">Belum ada histori kasus.</div>`}
16003:       <button type="button" class="btn btn-sm" style="margin-top:10px;" id="kg-goto-pelapor"><i class="ph-bold ph-arrow-right"></i> Lihat Histori Lengkap</button>
16004:       <button type="button" class="btn btn-sm" style="margin-top:10px;" id="kg-goto-wiki-p"><i class="ph-bold ph-book-open-text"></i> Buka Halaman Wiki</button>
16005:     `;
16006:     $('#kg-goto-pelapor').addEventListener('click', ()=>{ CURRENT_PELAPOR_FILTER = label; goToView('pelapor'); });
16007:     $('#kg-goto-wiki-p').addEventListener('click', ()=> openWikiPage('personil', label));
16008:   } else if(type==='m'){
16009:     const m = findMachineByIdentity_(label);
16010:     const kode = m ? (m['Kode Mesin']||m['Nama Mesin']) : label;
16011:     const displayName = m ? (m['Nama Mesin']||m['Kode Mesin']||label) : label;
16012:     const hs = machineHealthScore(kode);
16013:     panel.innerHTML = `
16014:       <div class="section-title"><i class="ph-bold ph-gear-six"></i> ${escapeHtml(displayName)}</div>
16015:       <div class="sub">Machine Health: ${hs.score}% (${escapeHtml(hs.label)}) · ${hs.breakdown} breakdown tercatat</div>
16016:       <button type="button" class="btn btn-sm" style="margin-top:10px;" id="kg-goto-mesin"><i class="ph-bold ph-arrow-right"></i> Lihat Detail Mesin</button>
16017:       <button type="button" class="btn btn-sm" style="margin-top:10px;" id="kg-goto-wiki-m"><i class="ph-bold ph-book-open-text"></i> Buka Halaman Wiki</button>
16018:     `;
16019:     $('#kg-goto-mesin').addEventListener('click', ()=> openMachineDetail(kode));
16020:     $('#kg-goto-wiki-m').addEventListener('click', ()=> openWikiPage('mesin', kode));
16021:   } else if(type==='s'){
16022:     const relatedMesin = new Map();
16023:     // [FIX SOT] Konsisten dengan buildKnowledgeGraphData() -- relasi hanya dari data source-of-truth.
16024:     sotEntries().forEach(e=>{
16025:       if(!parseSparepartDetail(e).some(d=>d.nama.toLowerCase()===label.toLowerCase())) return;
16026:       if(isAreaEntry_(e) || !(e['Kode Mesin']||e['Nama Mesin'])) return;
16027:       const bucket=analyticsMachineBucket_(e);
16028:       relatedMesin.set(bucket.key,bucket.nama);
16029:     });
16030:     panel.innerHTML = `
16031:       <div class="section-title"><i class="ph-bold ph-wrench"></i> ${escapeHtml(label)}</div>
16032:       <div class="sub">Dipakai di ${relatedMesin.size} mesin berbeda: ${[...relatedMesin.values()].filter(Boolean).map(escapeHtml).join(', ') || '-'}</div>
16033:       <button type="button" class="btn btn-sm" style="margin-top:10px;" id="kg-goto-wiki-s"><i class="ph-bold ph-book-open-text"></i> Buka Halaman Wiki</button>
16034:     `;
16035:     $('#kg-goto-wiki-s').addEventListener('click', ()=> openWikiPage('sparepart', label));
16036:   } else if(type==='k'){
16037:     const relatedMesin = new Map();
16038:     // [FIX SOT] Sama seperti di atas.
16039:     sotEntries().forEach(e=>{
~~~

### Around line 17566
~~~text
17554:   return changedCount;
17555: }
17556: 
17557: function buildMaterialFieldsFromRows(){
17558:   syncSparepartRowsFromDom();
17559:   // Seluruh field sparepart bersifat opsional. Simpan setiap nilai yang
17560:   // memang diisi tanpa memaksa kelengkapan field lain pada baris yang sama.
17561:   const rows = SPAREPART_ROWS
17562:     .map(r=>({...r,nama:norm_(r.nama)?String(r.nama).trim():'',sap:norm_(r.sap)?String(r.sap).trim():'',jumlah:norm_(r.jumlah)?r.jumlah:''}))
17563:     .filter(r=>r.nama.trim() || r.sap.trim() || String(r.jumlah).trim())
17564:     .map(r=>{
17565:       const master = r.sap.trim() ? findSparepartLokasiBySap(r.sap.trim()) : null;
17566:       return { ...r, lokasiSparepart: master ? String(master.lokasiGudang||'').trim() : '' };
17567:     });
17568:   rows.forEach((r,i)=>{ if(!(Number(r.jumlah)>0) || !Number.isFinite(Number(r.jumlah))) throw new Error('Jumlah sparepart baris '+(i+1)+' wajib diisi dengan angka lebih dari 0.'); if(!r.nama.trim() && !r.sap.trim()) throw new Error('Isi nama atau nomor SAP sparepart baris '+(i+1)+'.'); });
17569:   const namaMaterial = rows.map(r=> r.jumlah ? `${r.nama.trim()} (${r.jumlah} pcs)` : r.nama.trim()).filter(Boolean).join('; ');
17570:   const materialNumberSAP = rows.map(r=> r.sap.trim()).filter(Boolean).join('; ');
17571:   // Backend lama mewajibkan kolom Lokasi Sparepart. Nilai fallback ini
17572:   // menjaga kompatibilitas tanpa menjadikan input sparepart wajib bagi user.
17573:   const lokasiSparepart = rows.length
17574:     ? rows.map(r=>r.lokasiSparepart || 'Belum terdaftar').join('; ')
17575:     : 'Tidak menggunakan sparepart';
17576:   return { namaMaterial, materialNumberSAP, lokasiSparepart, detail: rows };
17577: }
17578: 
17579: /* ---------------- FILE UPLOAD (FORM) ---------------- */
17580: const fileDrop = $('#file-drop');
17581: const fileInput = $('#file-input');
17582: fileDrop.addEventListener('click', ()=> fileInput.click());
17583: fileDrop.addEventListener('dragover', ev=>{ ev.preventDefault(); fileDrop.style.borderColor='var(--red)'; });
17584: fileDrop.addEventListener('dragleave', ()=>{ fileDrop.style.borderColor='var(--line)'; });
17585: fileDrop.addEventListener('drop', ev=>{
17586:   ev.preventDefault(); fileDrop.style.borderColor='var(--line)';
17587:   handleFiles(ev.dataTransfer.files);
17588: });
17589: fileInput.addEventListener('change', ()=> { handleFiles(fileInput.files); fileInput.value=''; });
17590: 
17591: async function handleFiles(fileList){
17592:   const files = Array.from(fileList);
17593:   for(const file of files){
17594:     if(file.size > 120 * 1024 * 1024){
17595:       toast(`File "${file.name}" terlalu besar (maks 120MB sebelum kompresi).`, true);
17596:       continue;
17597:     }
17598:     const isImage = file.type.startsWith('image');
17599:     const isVideo = file.type.startsWith('video');
17600:     let blob = file, mimeType = file.type, name = file.name;
17601: 
17602:     if(isImage){
17603:       toast(`Mengompres foto "${file.name}"...`);
17604:       blob = await compressImageFile(file);
17605:       mimeType = 'image/jpeg';
17606:       name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
17607:     } else if(isVideo){
17608:       toast(`Mengompres video "${file.name}", mohon tunggu (± sepanjang durasi video)...`);
17609:       blob = await compressVideoFile(file);
17610:       if(blob !== file){
17611:         mimeType = 'video/webm';
17612:         name = file.name.replace(/\.[^.]+$/, '') + '.webm';
17613:       }
17614:     }
17615: 
17616:     if(blob.size > MAX_CLIENT_UPLOAD_BYTES){
17617:       toast(`File "${name}" masih terlalu besar setelah kompresi (${(blob.size/1024/1024).toFixed(1)} MB). Maksimal 9 MB per file.`, true);
17618:       continue;
17619:     }
17620: 
17621:     await new Promise((resolveRead)=>{
17622:       const reader = new FileReader();
17623:       reader.onload = ()=>{
17624:         const base64 = reader.result.split(',')[1];
17625:         PENDING_FILES.push({
17626:           name, mimeType, base64,
17627:           _localUrl: URL.createObjectURL(blob),
17628:           _isVideo: isVideo
17629:         });
17630:         renderFilePreviews();
~~~

### Around line 22300
~~~text
22288: }
22289: 
22290: /* ---------------- RESUME COPILOT BERDASARKAN HALAMAN YANG SEDANG DIBUKA ----------------
22291:    Alih-alih selalu menganalisis seluruh pabrik, Copilot sekarang membaca menu/halaman
22292:    yang sedang aktif (PREVIOUS_ACTIVE_VIEW) dan hanya mengumpulkan + menampilkan data
22293:    yang relevan dengan halaman tsb. Setiap item tetap wajib punya "sources" (data mentah)
22294:    supaya bisa ditelusuri, sama seperti insight per-mesin. */
22295: function copilotViewLabel(view){
22296:   const map = {
22297:     utama:'Logbook — Ringkasan', mesin:'Logbook — Per Mesin', tanggal:'Logbook — Per Tanggal',
22298:     pelapor:'Logbook — Per Pelapor', group:'Logbook — Per Group Pekerjaan', dashboard:'Visual Dashboard',
22299:     durasi:'Top Durasi Pekerjaan', analitik:'Dashboard Analitik', correlation:'Correlation Analysis', diagnostic:'Diagnostic Wizard', knowledge:'Knowledge Base',
22300:     patrol:'Patrol Harian', sparepart:'Sparepart Management', database:'Database Mesin',
22301:     input:'Input Logbook',
22302:     report:'Input Report', 'report-hub':'Riwayat Laporan', 'project-report':'Laporan Proyek',
22303:     'project-center':'Project Management Center', meeting:'Meeting Management',
22304:     rca:'RCA', ipal:'IPAL', downtime:'Analisa Downtime E&M', ai:'Analisa AI', setting:'Setting', tema:'Tema Aplikasi',
22305:     'expert-finder':'Expert Finder', 'knowledge-graph':'Knowledge Graph', wiki:'Maintenance Wikipedia',
22306:     'insights-hub':'Insights Hub', 'people-hub':'People & Meetings',
22307:     'pi-dashboard':'People Intelligence — Dashboard', 'pi-personnel':'People Intelligence — Personil',
22308:     'pi-softskill':'People Intelligence — Soft Skill', 'pi-hardskill':'People Intelligence — Hard Skill',
22309:     'pi-smart-resume':'Smart Recognition & Resume Personil'
22310:   };
22311:   return map[view] || 'Halaman Ini';
22312: }
22313: 
22314: // Deskripsi singkat fungsi tiap menu — selalu ditampilkan sebagai item
22315: // PERTAMA di resume Copilot, apapun kondisi datanya, supaya orang yang
22316: // baru pertama buka menu tsb langsung tahu menu itu buat apa.
22317: const COPILOT_PAGE_INFO = {
22318:   utama: 'Daftar semua entri Logbook maintenance (Tanggal, Mesin, Status, Deskripsi Masalah, Tindakan Perbaikan, dll) — pusat pencatatan pekerjaan harian.',
22319:   mesin: 'Logbook yang sama, difilter per Mesin — untuk melihat riwayat pekerjaan satu mesin tertentu secara berurutan.',
22320:   tanggal: 'Logbook yang sama, difilter per Tanggal — untuk melihat semua pekerjaan yang terjadi di hari tertentu.',
22321:   pelapor: 'Logbook yang sama, difilter per Nama Pelapor/Personil — untuk melihat riwayat pekerjaan satu orang.',
22322:   group: 'Logbook yang sama, difilter per Grouping Pekerjaan (Electrical/Mechanical/Workshop/dll).',
22323:   dashboard: 'Papan status real-time semua mesin (card berwarna sesuai status: normal/proses/emergency), diambil dari Logbook & Predictive Maintenance mana yang lebih terkini.',
22324:   durasi: 'Daftar pekerjaan dengan durasi pengerjaan terlama, untuk menemukan pekerjaan yang paling menyita waktu.',
22325:   analitik: 'Dashboard grafik: Pareto kerusakan per mesin, distribusi jam rawan breakdown, tren bulanan, dan metrik lain dari histori Logbook.',
22326:   correlation: 'Analisis korelasi antar variabel: PM Compliance vs jumlah breakdown (koefisien Pearson), pola hari/shift rawan breakdown, durasi perbaikan per jenis pekerjaan, dan pasangan mesin+masalah yang paling sering berulang.',
22327:   diagnostic: 'Diagnostic Wizard — masukkan gejala kerusakan, sistem mencari kasus mirip dari Logbook, Report RCA, dan Knowledge Base, lalu menyarankan kemungkinan penyebab & tindakan yang pernah berhasil dipakai.',
22328:   knowledge: 'Basis pengetahuan (Knowledge Base) — kumpulan catatan solusi/SOP yang disimpan manual untuk referensi ke depan.',
22329:   patrol: 'Checklist inspeksi harian mesin (Patrol Harian) — temuan & Machine Condition Score di sini ikut memengaruhi status card mesin di Visual Dashboard.',
22330:   sparepart: 'Manajemen sparepart: status collect sparepart per pekerjaan Logbook, tracking ETA sparepart setelah PO, dan Stock Opname mandiri (target harian 30 item).',
22331:   database: 'Master data seluruh mesin (spesifikasi, kategori, Manual Book PDF) — klik satu mesin untuk lihat Machine Health Score & Maintenance DNA-nya.',
22332:   report: 'Form input laporan (IPAL, RCA, Laporan Proyek, dll) — titik masuk untuk membuat laporan baru di luar Logbook harian.',
22333:   'report-hub': 'Riwayat semua laporan yang pernah dibuat (IPAL, RCA, Laporan Proyek), dikumpulkan jadi satu tempat per kategori.',
22334:   'project-report': 'Input & pantau status/progress/timeline proyek yang sedang berjalan.',
22335:   'project-center': 'Pusat manajemen improvement project department: Factory Project (skala besar), Kaizen (continuous improvement), dan SGA (Small Group Activity) — lengkap dengan dashboard, filter, dan histori progress.',
22336:   meeting: 'Meeting Management — jadwal meeting (harian/mingguan/bulanan), notulen (Agenda/Diskusi/Keputusan), dan tracking Action Item per PIC lengkap dengan status & Due Date.',
22337:   input: 'Form Input Logbook — titik masuk utama pencatatan pekerjaan maintenance harian (Mesin, Status, Deskripsi Masalah, Tindakan Perbaikan, dll).',
22338:   tema: 'Pengaturan tampilan aplikasi: Theme Manager (palet warna) dan Style Manager (bentuk/gaya visual card, tombol, sidebar) — murni preferensi tampilan, tidak memengaruhi data.',
22339:   'insights-hub': 'Pintu masuk cepat (satu tap) ke berbagai halaman analitik & laporan: Dashboard Analitik, Correlation Analysis, Diagnostic Wizard, Expert Finder, Knowledge Graph, dan lainnya.',
22340:   'people-hub': 'Pintu masuk cepat ke modul People & Meetings: Meeting Management dan People Intelligence (Personil, Soft Skill, Hard Skill, Smart Resume).',
22341:   'pi-dashboard': 'People Intelligence — Dashboard ringkasan kompetensi & performa seluruh personil, digabung dari Soft Skill Assessment, Hard Skill Assessment, dan histori Logbook.',
22342:   'pi-personnel': 'People Intelligence — Daftar kartu personil beserta skor kompetensi masing-masing, klik satu personil untuk lihat profil lengkapnya.',
22343:   'pi-softskill': 'People Intelligence — Form & riwayat penilaian Soft Skill Assessment personil oleh direct manager.',
22344:   'pi-hardskill': 'People Intelligence — Form & riwayat penilaian Hard Skill Assessment (per Unit Kompetensi) personil oleh direct manager.',
22345:   'pi-smart-resume': 'Smart Recognition & Resume Personil — rekomendasi & ringkasan tiap personil, dihasilkan otomatis 100% lokal dari gabungan data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item.',
22346:   rca: 'Root Cause Analysis — form Why-Why & Fishbone Diagram untuk menganalisis akar masalah suatu kejadian.',
22347:   ipal: 'Form & riwayat laporan pengelolaan IPAL (Instalasi Pengolahan Air Limbah) bulanan.',
22348:   downtime: 'Analisa Downtime Elektrikal & Mekanikal — upload laporan bulanan, lihat rekap per bulan, dan histori/YTD.',
22349:   ai: 'Halaman rekomendasi/analisa AI atas data maintenance yang sudah tercatat.',
22350:   setting: 'Koneksi ke database SQLite (Web App URL) & master data (Mesin, Personil, Lokasi Sparepart) — pusat konfigurasi aplikasi.',
22351:   'expert-finder': 'Ranking personil paling berpengalaman berdasarkan histori Logbook (jumlah kasus, breakdown, tingkat penyelesaian, lama pengalaman). Klik personil untuk lihat histori lengkapnya.',
22352:   'knowledge-graph': 'Visualisasi hubungan antar Personil, Mesin, Sparepart, dan Masalah dalam bentuk graph interaktif (vis-network), dibangun otomatis dari Logbook.',
22353:   wiki: 'Maintenance Wikipedia — halaman detail Mesin/Personil/Sparepart yang saling terhubung dua arah, semua nama di aplikasi bisa diklik untuk pindah ke sini.'
22354: };
22355: 
22356: function copilotPageResume(view){
22357:   const items = [];
22358:   // [FIX SOT] Jendela 30/90 hari di-clamp ke SOT_CUTOFF_DATE supaya TIDAK
22359:   // PERNAH mundur menyentuh data historis OneNote yang belum tervalidasi --
22360:   // perubahan di sini otomatis berlaku untuk SEMUA cabang di bawah yang
22361:   // memakai cutoff30/cutoff90 (Logbook, Home/Dashboard, Durasi, Analitik,
22362:   // Knowledge, Patrol, Sparepart, dll), tidak perlu diubah satu-satu.
22363:   const cutoff30 = new Date(clampToSot(Date.now() - 30*86400000));
22364:   const cutoff90 = new Date(clampToSot(Date.now() - 90*86400000));
~~~

## sparePartDigunakan
No match.

## namaMaterial:
### Around line 15238
~~~text
15226: 
15227: loadSparepartEtaLocal();
15228: async function syncSparepartEtaFromBackend(){
15229:   if(!WEB_APP_URL) return SPAREPART_ETA;
15230:   try{
15231:     const remote = await apiGet('sparepartEta');
15232:     if(Array.isArray(remote)){
15233:       SPAREPART_ETA = remote.map(r=>{
15234:         let status = r['Status']||'WAITING';
15235:         if(status==='MENUNGGU') status='WAITING'; else if(status==='TERLAMBAT') status='WAITING'; else if(status==='TIBA') status='ARRIVED';
15236:         return {
15237:           id: r['ID']||('PO-'+Date.now()+Math.random()),
15238:           namaMaterial: r['Nama Material']||'',
15239:           sap: r['Material Number SAP']||'',
15240:           noPO: r['Nomor PO']||'',
15241:           vendor: r['Vendor']||'',
15242:           qty: Number(r['Qty'])||1,
15243:           tanggalPO: r['Tanggal PO']||'',
15244:           estimasiEta: r['Estimasi ETA']||'',
15245:           status,
15246:           tanggalTiba: r['Tanggal Tiba']||'',
15247:           catatan: r['Catatan']||'',
15248:           createdAt: r['Timestamp']||new Date().toISOString()
15249:         };
15250:       });
15251:       saveSparepartEtaLocal();
15252:     }
15253:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
15254:   return SPAREPART_ETA;
15255: }
15256: 
15257: $('#btn-add-sparepart-eta').addEventListener('click', async ()=>{
15258:   const nama = $('#sp-eta-nama').value.trim();
15259:   const nopo = $('#sp-eta-nopo').value.trim();
15260:   const eta = $('#sp-eta-tgletaeta').value;
15261:   if(!nama || !nopo || !eta){ toast('Nama Material, Nomor PO, dan ETA wajib diisi.', true); return; }
15262:   const item = {
15263:     id: 'PO-' + Date.now(),
15264:     namaMaterial: nama,
15265:     sap: $('#sp-eta-sap').value.trim(),
15266:     noPO: nopo,
15267:     vendor: $('#sp-eta-vendor').value.trim(),
15268:     qty: Number($('#sp-eta-qty').value) || 1,
15269:     tanggalPO: $('#sp-eta-tglpo').value || '',
15270:     estimasiEta: eta,
15271:     catatan: $('#sp-eta-catatan').value.trim(),
15272:     status: 'WAITING',
15273:     tanggalTiba: '',
15274:     createdAt: new Date().toISOString()
15275:   };
15276:   SPAREPART_ETA.push(item);
15277:   saveSparepartEtaLocal();
15278:   ['sp-eta-nama','sp-eta-sap','sp-eta-nopo','sp-eta-vendor','sp-eta-qty','sp-eta-tglpo','sp-eta-tgletaeta','sp-eta-catatan'].forEach(id=> { const el=$('#'+id); if(el) el.value=''; });
15279:   toast('Purchase Order tersimpan.');
15280:   renderSparepartPoDash();
15281:   renderSparepartEtaList();
15282:   try{ await apiPost({ action:'saveSparepartEta', ...item }); }
15283:   catch(e){ /* backend mungkin belum mendukung action ini; data lokal tetap tersimpan */ }
15284: });
15285: 
15286: function renderSparepartPoDash(){
15287:   const holder = $('#sp-po-dash');
15288:   if(!holder) return;
15289:   const keys = SPAREPART_ETA.map(poStatusKey);
15290:   const count = k => keys.filter(x=>x===k).length;
15291:   const cards = [
15292:     { ico:'ph-clock', n: count('waiting'), l:'Waiting' },
15293:     { ico:'ph-truck', n: count('intransit'), l:'In Transit', accent:'accent-amber' },
15294:     { ico:'ph-warning', n: count('overdue'), l:'Overdue', accent:'accent-red' },
15295:     { ico:'ph-package', n: count('arrived'), l:'Arrived' },
15296:     { ico:'ph-warehouse', n: count('warehouse'), l:'Warehouse', accent:'accent-green' }
15297:   ];
15298:   holder.innerHTML = cards.map(c=>`
15299:     <div class="sp-dash-card ${c.accent||''}">
15300:       <div class="ico"><i class="ph-bold ${c.ico}"></i></div>
15301:       <div class="n">${c.n}</div>
15302:       <div class="l">${c.l}</div>
~~~

### Around line 15264
~~~text
15252:     }
15253:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
15254:   return SPAREPART_ETA;
15255: }
15256: 
15257: $('#btn-add-sparepart-eta').addEventListener('click', async ()=>{
15258:   const nama = $('#sp-eta-nama').value.trim();
15259:   const nopo = $('#sp-eta-nopo').value.trim();
15260:   const eta = $('#sp-eta-tgletaeta').value;
15261:   if(!nama || !nopo || !eta){ toast('Nama Material, Nomor PO, dan ETA wajib diisi.', true); return; }
15262:   const item = {
15263:     id: 'PO-' + Date.now(),
15264:     namaMaterial: nama,
15265:     sap: $('#sp-eta-sap').value.trim(),
15266:     noPO: nopo,
15267:     vendor: $('#sp-eta-vendor').value.trim(),
15268:     qty: Number($('#sp-eta-qty').value) || 1,
15269:     tanggalPO: $('#sp-eta-tglpo').value || '',
15270:     estimasiEta: eta,
15271:     catatan: $('#sp-eta-catatan').value.trim(),
15272:     status: 'WAITING',
15273:     tanggalTiba: '',
15274:     createdAt: new Date().toISOString()
15275:   };
15276:   SPAREPART_ETA.push(item);
15277:   saveSparepartEtaLocal();
15278:   ['sp-eta-nama','sp-eta-sap','sp-eta-nopo','sp-eta-vendor','sp-eta-qty','sp-eta-tglpo','sp-eta-tgletaeta','sp-eta-catatan'].forEach(id=> { const el=$('#'+id); if(el) el.value=''; });
15279:   toast('Purchase Order tersimpan.');
15280:   renderSparepartPoDash();
15281:   renderSparepartEtaList();
15282:   try{ await apiPost({ action:'saveSparepartEta', ...item }); }
15283:   catch(e){ /* backend mungkin belum mendukung action ini; data lokal tetap tersimpan */ }
15284: });
15285: 
15286: function renderSparepartPoDash(){
15287:   const holder = $('#sp-po-dash');
15288:   if(!holder) return;
15289:   const keys = SPAREPART_ETA.map(poStatusKey);
15290:   const count = k => keys.filter(x=>x===k).length;
15291:   const cards = [
15292:     { ico:'ph-clock', n: count('waiting'), l:'Waiting' },
15293:     { ico:'ph-truck', n: count('intransit'), l:'In Transit', accent:'accent-amber' },
15294:     { ico:'ph-warning', n: count('overdue'), l:'Overdue', accent:'accent-red' },
15295:     { ico:'ph-package', n: count('arrived'), l:'Arrived' },
15296:     { ico:'ph-warehouse', n: count('warehouse'), l:'Warehouse', accent:'accent-green' }
15297:   ];
15298:   holder.innerHTML = cards.map(c=>`
15299:     <div class="sp-dash-card ${c.accent||''}">
15300:       <div class="ico"><i class="ph-bold ${c.ico}"></i></div>
15301:       <div class="n">${c.n}</div>
15302:       <div class="l">${c.l}</div>
15303:     </div>`).join('');
15304: }
15305: 
15306: function renderSparepartEtaList(){
15307:   const holder = $('#list-sparepart-eta');
15308:   if(!holder) return;
15309:   const q = ($('#search-sparepart-eta').value || '').toLowerCase();
15310:   const stF = $('#filter-sparepart-eta-status').value;
15311:   let rows = SPAREPART_ETA.map(item=> ({ item, key: poStatusKey(item) }));
15312:   rows = rows.filter(({item,key})=>{
15313:     if(stF && key !== stF) return false;
15314:     if(q){
15315:       const hay = [item.namaMaterial, item.sap, item.noPO, item.vendor, item.catatan].join(' ').toLowerCase();
15316:       if(!hay.includes(q)) return false;
15317:     }
15318:     return true;
15319:   });
15320:   rows.sort((a,b)=>{
15321:     const order = { overdue:0, intransit:1, waiting:2, arrived:3, warehouse:4 };
15322:     if(order[a.key] !== order[b.key]) return order[a.key]-order[b.key];
15323:     return new Date(a.item.estimasiEta||0) - new Date(b.item.estimasiEta||0);
15324:   });
15325: 
15326:   if(!rows.length){
15327:     holder.innerHTML = `<div class="empty-state"><div class="ico"><i class="ph-bold ph-truck"></i></div>Belum ada data PO yang cocok. Total tersimpan: ${SPAREPART_ETA.length}.</div>`;
15328:     return;
~~~

### Around line 15396
~~~text
15384:   catch(e){ SPAREPART_WAREHOUSE = []; }
15385: }
15386: function saveSparepartWarehouseLocal(){ localStorage.setItem(LS_SPAREPART_WAREHOUSE_KEY, JSON.stringify(SPAREPART_WAREHOUSE)); }
15387: loadSparepartWarehouseLocal();
15388: async function syncSparepartWarehouseFromBackend(){
15389:   if(!WEB_APP_URL) return SPAREPART_WAREHOUSE;
15390:   try{
15391:     const remote = await apiGet('sparepartWarehouse');
15392:     if(Array.isArray(remote)){
15393:       SPAREPART_WAREHOUSE = remote.map(r=>({
15394:         poId: r['PO ID']||'',
15395:         noPO: r['Nomor PO']||'',
15396:         namaMaterial: r['Nama Material']||'',
15397:         qtyMatch: r['Qty Match']||'',
15398:         condition: r['Condition']||'',
15399:         location: r['Warehouse Location']||'',
15400:         sapUpdated: r['SAP Updated']==='YA',
15401:         validator: r['Validator']||'',
15402:         validationDate: r['Validation Date']||''
15403:       }));
15404:       saveSparepartWarehouseLocal();
15405:     }
15406:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
15407:   return SPAREPART_WAREHOUSE;
15408: }
15409: function findWarehouseValidation(poId){ return SPAREPART_WAREHOUSE.find(x=>x.poId===poId) || null; }
15410: 
15411: function renderSparepartWarehouseList(){
15412:   const holder = $('#list-sparepart-warehouse');
15413:   if(!holder) return;
15414:   const q = ($('#search-sparepart-warehouse').value || '').toLowerCase();
15415:   let rows = SPAREPART_ETA.filter(item=> poStatusKey(item)==='arrived');
15416:   rows = rows.filter(item=>{
15417:     if(q){
15418:       const hay = [item.namaMaterial, item.sap, item.noPO].join(' ').toLowerCase();
15419:       if(!hay.includes(q)) return false;
15420:     }
15421:     return true;
15422:   });
15423: 
15424:   if(!rows.length){
15425:     holder.innerHTML = `<div class="empty-state"><div class="ico"><i class="ph-bold ph-warehouse"></i></div>Tidak ada PO berstatus Arrived yang menunggu validasi.</div>`;
15426:     return;
15427:   }
15428:   holder.innerHTML = rows.map(item=>{
15429:     const existing = findWarehouseValidation(item.id) || {};
15430:     return `
15431:     <div class="sp-wh-row" data-id="${escapeHtml(item.id)}">
15432:       <div class="body">
15433:         <div class="material">${wikiLinkHtml("sparepart", item.namaMaterial, item.namaMaterial)}</div>
15434:         <div class="meta">PO: ${escapeHtml(item.noPO)}${item.vendor?(' · Vendor: '+escapeHtml(item.vendor)):''} · Qty PO: ${item.qty} · Tiba: ${item.tanggalTiba?fmtDate(item.tanggalTiba):'-'}</div>
15435:         <div class="sp-wh-form">
15436:           <div class="field"><label>Qty Match</label>
15437:             <select class="sp-inline-select sp-wh-qtymatch">
15438:               <option value="Sesuai" ${existing.qtyMatch==='Sesuai'?'selected':''}>Sesuai</option>
15439:               <option value="Kurang" ${existing.qtyMatch==='Kurang'?'selected':''}>Kurang</option>
15440:               <option value="Lebih" ${existing.qtyMatch==='Lebih'?'selected':''}>Lebih</option>
15441:             </select>
15442:           </div>
15443:           <div class="field"><label>Condition</label>
15444:             <select class="sp-inline-select sp-wh-condition">
15445:               <option value="Good" ${existing.condition==='Good'?'selected':''}>Good</option>
15446:               <option value="Damaged" ${existing.condition==='Damaged'?'selected':''}>Damaged</option>
15447:               <option value="Partial" ${existing.condition==='Partial'?'selected':''}>Partial</option>
15448:             </select>
15449:           </div>
15450:           <div class="field"><label>Warehouse Location</label><input type="text" class="sp-inline-input sp-wh-location" value="${escapeHtml(existing.location||'')}" placeholder="mis. Rak A-3" style="width:100%;"></div>
15451:           <div class="field"><label>SAP Updated</label>
15452:             <select class="sp-inline-select sp-wh-sapupdated">
15453:               <option value="0" ${!existing.sapUpdated?'selected':''}>Belum</option>
15454:               <option value="1" ${existing.sapUpdated?'selected':''}>Sudah</option>
15455:             </select>
15456:           </div>
15457:           <div class="field"><label>Validator</label><input type="text" class="sp-inline-input sp-wh-validator" value="${escapeHtml(existing.validator||'')}" placeholder="Nama validator" style="width:100%;"></div>
15458:           <div class="field"><label>Validation Date</label><input type="date" class="sp-inline-input sp-wh-date" value="${escapeHtml(existing.validationDate||new Date().toISOString().slice(0,10))}" style="width:100%;"></div>
15459:         </div>
15460:       </div>
~~~

### Around line 15474
~~~text
15462:         <button type="button" class="btn btn-sm btn-primary sp-wh-validate" data-id="${escapeHtml(item.id)}"><i class="ph-bold ph-check-circle"></i> Validate</button>
15463:       </div>
15464:     </div>`;
15465:   }).join('');
15466: 
15467:   $$('.sp-wh-validate', holder).forEach(btn=> btn.addEventListener('click', async ()=>{
15468:     const row = btn.closest('.sp-wh-row');
15469:     const id = btn.dataset.id;
15470:     const item = SPAREPART_ETA.find(x=>x.id===id); if(!item) return;
15471:     const validator = row.querySelector('.sp-wh-validator').value.trim();
15472:     if(!validator){ toast('Nama Validator wajib diisi sebelum validasi.', true); return; }
15473:     const payload = {
15474:       poId: id, noPO: item.noPO, namaMaterial: item.namaMaterial,
15475:       qtyMatch: row.querySelector('.sp-wh-qtymatch').value,
15476:       condition: row.querySelector('.sp-wh-condition').value,
15477:       location: row.querySelector('.sp-wh-location').value.trim(),
15478:       sapUpdated: row.querySelector('.sp-wh-sapupdated').value === '1',
15479:       validator,
15480:       validationDate: row.querySelector('.sp-wh-date').value || new Date().toISOString().slice(0,10)
15481:     };
15482:     SPAREPART_WAREHOUSE = SPAREPART_WAREHOUSE.filter(x=>x.poId!==id);
15483:     SPAREPART_WAREHOUSE.push(payload);
15484:     saveSparepartWarehouseLocal();
15485:     item.status = 'WAREHOUSE';
15486:     saveSparepartEtaLocal();
15487:     toast('Validasi tersimpan — status PO menjadi Warehouse Available.');
15488:     renderSparepartPoDash(); renderSparepartEtaList(); renderSparepartWarehouseList();
15489:     try{ await apiPost({ action:'saveSparepartWarehouse', ...payload }); }catch(e){}
15490:     try{ await apiPost({ action:'updateSparepartEta', id, status:'WAREHOUSE' }); }catch(e){}
15491:   }));
15492: }
15493: const searchWhEl = $('#search-sparepart-warehouse');
15494: if(searchWhEl) searchWhEl.addEventListener('input', renderSparepartWarehouseList);
15495: 
15496: /* =========================================================
15497:    TAB 4: DAILY STOCK OPNAME
15498:    Pencatatan hasil hitung fisik stok gudang, dibandingkan dengan stok
15499:    sistem (dicocokkan via SAP dari master Sparepart_Lokasi -- lihat
15500:    findStockSistemBySap di bagian "MASTER SPAREPART" di atas).
15501:    Checklist harian 20-30 item dibuat otomatis dari master Lokasi Sparepart.
15502:    ========================================================= */
15503: const SPAREPART_OPNAME_DAILY_TARGET = 30;
15504: let SPAREPART_OPNAME = [];
15505: function loadSparepartOpnameLocal(){
15506:   try{ SPAREPART_OPNAME = JSON.parse(localStorage.getItem(LS_SPAREPART_OPNAME_KEY) || '[]'); }
15507:   catch(e){ SPAREPART_OPNAME = []; }
15508: }
15509: function saveSparepartOpnameLocal(){ localStorage.setItem(LS_SPAREPART_OPNAME_KEY, JSON.stringify(SPAREPART_OPNAME)); }
15510: loadSparepartOpnameLocal();
15511: async function syncSparepartOpnameFromBackend(){
15512:   if(!WEB_APP_URL) return SPAREPART_OPNAME;
15513:   try{
15514:     const remote = await apiGet('sparepartOpname');
15515:     if(Array.isArray(remote)){
15516:       SPAREPART_OPNAME = remote.map(r=>({
15517:         id: r['ID']||('OP-'+Date.now()+Math.random()),
15518:         tanggal: r['Tanggal']||'',
15519:         partNo: r['Part No']||'',
15520:         namaMaterial: r['Nama Material']||'',
15521:         sap: r['Material Number SAP']||'',
15522:         stockSistem: r['Stock Sistem']===''||r['Stock Sistem']==null ? null : Number(r['Stock Sistem']),
15523:         stockFisik: Number(r['Stock Fisik'])||0,
15524:         selisih: r['Selisih']===''||r['Selisih']==null ? null : Number(r['Selisih']),
15525:         lokasi: r['Lokasi Rak']||'',
15526:         catatan: r['Catatan']||'',
15527:         createdAt: r['Timestamp']||new Date().toISOString()
15528:       }));
15529:       saveSparepartOpnameLocal();
15530:     }
15531:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
15532:   return SPAREPART_OPNAME;
15533: }
15534: 
15535: $('#sp-opname-sap').addEventListener('change', ()=>{
15536:   const auto = findStockSistemBySap($('#sp-opname-sap').value.trim());
15537:   if(auto!=null) $('#sp-opname-sistem').value = auto;
15538: });
~~~

### Around line 15520
~~~text
15508: }
15509: function saveSparepartOpnameLocal(){ localStorage.setItem(LS_SPAREPART_OPNAME_KEY, JSON.stringify(SPAREPART_OPNAME)); }
15510: loadSparepartOpnameLocal();
15511: async function syncSparepartOpnameFromBackend(){
15512:   if(!WEB_APP_URL) return SPAREPART_OPNAME;
15513:   try{
15514:     const remote = await apiGet('sparepartOpname');
15515:     if(Array.isArray(remote)){
15516:       SPAREPART_OPNAME = remote.map(r=>({
15517:         id: r['ID']||('OP-'+Date.now()+Math.random()),
15518:         tanggal: r['Tanggal']||'',
15519:         partNo: r['Part No']||'',
15520:         namaMaterial: r['Nama Material']||'',
15521:         sap: r['Material Number SAP']||'',
15522:         stockSistem: r['Stock Sistem']===''||r['Stock Sistem']==null ? null : Number(r['Stock Sistem']),
15523:         stockFisik: Number(r['Stock Fisik'])||0,
15524:         selisih: r['Selisih']===''||r['Selisih']==null ? null : Number(r['Selisih']),
15525:         lokasi: r['Lokasi Rak']||'',
15526:         catatan: r['Catatan']||'',
15527:         createdAt: r['Timestamp']||new Date().toISOString()
15528:       }));
15529:       saveSparepartOpnameLocal();
15530:     }
15531:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
15532:   return SPAREPART_OPNAME;
15533: }
15534: 
15535: $('#sp-opname-sap').addEventListener('change', ()=>{
15536:   const auto = findStockSistemBySap($('#sp-opname-sap').value.trim());
15537:   if(auto!=null) $('#sp-opname-sistem').value = auto;
15538: });
15539: 
15540: $('#btn-add-sparepart-opname').addEventListener('click', async ()=>{
15541:   const nama = $('#sp-opname-nama').value.trim();
15542:   const fisikStr = $('#sp-opname-fisik').value;
15543:   if(!nama || fisikStr===''){ toast('Nama Material dan Physical Stock wajib diisi.', true); return; }
15544:   const sap = $('#sp-opname-sap').value.trim();
15545:   const sistem = $('#sp-opname-sistem').value === '' ? null : Number($('#sp-opname-sistem').value);
15546:   const fisik = Number(fisikStr);
15547:   const item = {
15548:     id: 'OP-' + Date.now(),
15549:     tanggal: new Date().toISOString().slice(0,10),
15550:     partNo: $('#sp-opname-partno').value.trim(),
15551:     namaMaterial: nama,
15552:     sap,
15553:     stockSistem: sistem,
15554:     stockFisik: fisik,
15555:     selisih: sistem!=null ? (fisik - sistem) : null,
15556:     lokasi: $('#sp-opname-lokasi').value.trim(),
15557:     catatan: $('#sp-opname-catatan').value.trim(),
15558:     createdAt: new Date().toISOString()
15559:   };
15560:   SPAREPART_OPNAME.push(item);
15561:   saveSparepartOpnameLocal();
15562:   ['sp-opname-partno','sp-opname-nama','sp-opname-sap','sp-opname-sistem','sp-opname-fisik','sp-opname-lokasi','sp-opname-catatan'].forEach(id=> { const el=$('#'+id); if(el) el.value=''; });
15563:   toast('Hasil stock opname tersimpan.');
15564:   renderSparepartOpnameList();
15565:   renderSparepartTargetBanner();
15566:   renderSparepartOpnameDash();
15567:   renderSparepartOpnameChecklist();
15568:   try{ await apiPost({ action:'saveSparepartOpname', ...item }); }
15569:   catch(e){ /* backend mungkin belum mendukung action ini; data lokal tetap tersimpan */ }
15570: });
15571: 
15572: function sparepartOpnameToday(){
15573:   const today = new Date().toISOString().slice(0,10);
15574:   return SPAREPART_OPNAME.filter(x=> String(x.createdAt||'').slice(0,10) === today);
15575: }
15576: 
15577: function renderSparepartTargetBanner(){
15578:   const todayCount = sparepartOpnameToday().length;
15579:   const pct = Math.min(100, Math.round((todayCount/SPAREPART_OPNAME_DAILY_TARGET)*100));
15580:   $('#sp-target-num').textContent = `${todayCount} / ${SPAREPART_OPNAME_DAILY_TARGET} item`;
15581:   $('#sp-target-fill').style.width = pct + '%';
15582:   $('#sp-target-sub').textContent = todayCount >= SPAREPART_OPNAME_DAILY_TARGET
15583:     ? '🎉 Target harian tercapai — terima kasih sudah menyelesaikan stock opname hari ini.'
15584:     : `Masih perlu ${SPAREPART_OPNAME_DAILY_TARGET - todayCount} item lagi untuk mencapai target harian.`;
~~~

### Around line 15551
~~~text
15539: 
15540: $('#btn-add-sparepart-opname').addEventListener('click', async ()=>{
15541:   const nama = $('#sp-opname-nama').value.trim();
15542:   const fisikStr = $('#sp-opname-fisik').value;
15543:   if(!nama || fisikStr===''){ toast('Nama Material dan Physical Stock wajib diisi.', true); return; }
15544:   const sap = $('#sp-opname-sap').value.trim();
15545:   const sistem = $('#sp-opname-sistem').value === '' ? null : Number($('#sp-opname-sistem').value);
15546:   const fisik = Number(fisikStr);
15547:   const item = {
15548:     id: 'OP-' + Date.now(),
15549:     tanggal: new Date().toISOString().slice(0,10),
15550:     partNo: $('#sp-opname-partno').value.trim(),
15551:     namaMaterial: nama,
15552:     sap,
15553:     stockSistem: sistem,
15554:     stockFisik: fisik,
15555:     selisih: sistem!=null ? (fisik - sistem) : null,
15556:     lokasi: $('#sp-opname-lokasi').value.trim(),
15557:     catatan: $('#sp-opname-catatan').value.trim(),
15558:     createdAt: new Date().toISOString()
15559:   };
15560:   SPAREPART_OPNAME.push(item);
15561:   saveSparepartOpnameLocal();
15562:   ['sp-opname-partno','sp-opname-nama','sp-opname-sap','sp-opname-sistem','sp-opname-fisik','sp-opname-lokasi','sp-opname-catatan'].forEach(id=> { const el=$('#'+id); if(el) el.value=''; });
15563:   toast('Hasil stock opname tersimpan.');
15564:   renderSparepartOpnameList();
15565:   renderSparepartTargetBanner();
15566:   renderSparepartOpnameDash();
15567:   renderSparepartOpnameChecklist();
15568:   try{ await apiPost({ action:'saveSparepartOpname', ...item }); }
15569:   catch(e){ /* backend mungkin belum mendukung action ini; data lokal tetap tersimpan */ }
15570: });
15571: 
15572: function sparepartOpnameToday(){
15573:   const today = new Date().toISOString().slice(0,10);
15574:   return SPAREPART_OPNAME.filter(x=> String(x.createdAt||'').slice(0,10) === today);
15575: }
15576: 
15577: function renderSparepartTargetBanner(){
15578:   const todayCount = sparepartOpnameToday().length;
15579:   const pct = Math.min(100, Math.round((todayCount/SPAREPART_OPNAME_DAILY_TARGET)*100));
15580:   $('#sp-target-num').textContent = `${todayCount} / ${SPAREPART_OPNAME_DAILY_TARGET} item`;
15581:   $('#sp-target-fill').style.width = pct + '%';
15582:   $('#sp-target-sub').textContent = todayCount >= SPAREPART_OPNAME_DAILY_TARGET
15583:     ? '🎉 Target harian tercapai — terima kasih sudah menyelesaikan stock opname hari ini.'
15584:     : `Masih perlu ${SPAREPART_OPNAME_DAILY_TARGET - todayCount} item lagi untuk mencapai target harian.`;
15585: }
15586: 
15587: function renderSparepartOpnameDash(){
15588:   const holder = $('#sp-opname-dash');
15589:   if(!holder) return;
15590:   const today = sparepartOpnameToday();
15591:   const completed = today.length;
15592:   const remaining = Math.max(0, SPAREPART_OPNAME_DAILY_TARGET - completed);
15593:   const withSistem = today.filter(x=>x.selisih!=null);
15594:   const matched = withSistem.filter(x=>x.selisih===0).length;
15595:   const accuracy = withSistem.length ? Math.round((matched/withSistem.length)*100) : 100;
15596:   const cards = [
15597:     { ico:'ph-target', n: SPAREPART_OPNAME_DAILY_TARGET, l:'Daily Target' },
15598:     { ico:'ph-check-circle', n: completed, l:'Completed', accent:'accent-green' },
15599:     { ico:'ph-hourglass', n: remaining, l:'Remaining', accent: remaining>0?'accent-amber':'accent-green' },
15600:     { ico:'ph-percent', n: accuracy+'%', l:'Accuracy', accent: accuracy>=95?'accent-green':(accuracy>=80?'accent-amber':'accent-red') }
15601:   ];
15602:   holder.innerHTML = cards.map(c=>`
15603:     <div class="sp-dash-card ${c.accent||''}">
15604:       <div class="ico"><i class="ph-bold ${c.ico}"></i></div>
15605:       <div class="n">${c.n}</div>
15606:       <div class="l">${c.l}</div>
15607:     </div>`).join('');
15608: }
15609: 
15610: // Checklist harian 20-30 item, dibuat otomatis dari master Lokasi Sparepart
15611: // (Setting > Lokasi Sparepart), memprioritaskan item yang belum di-opname hari ini.
15612: function sparepartOpnameChecklistItems(){
15613:   const todaySap = new Set(sparepartOpnameToday().map(x=>x.sap).filter(Boolean));
15614:   const master = (SPAREPART_LOKASI||[]).slice();
15615:   const size = Math.max(20, Math.min(30, master.length || 20));
~~~

## materialNumberSAP:
No match.

## formData.get("deskripsiMasalah")
No match.

## new FormData(formEntryForDraft)
No match.

## const payload =
### Around line 67
~~~text
00055:   }
00056:   if(e.target.closest('#btn-pi-hs-save-manual')){
00057:     const resume = piComputeHardSkillResume(PI_HS_EDIT_ITEMS);
00058:     const selectedNama = $('#pi-hs-employee').value;
00059:     // Guard: nama HARUS berasal dari daftar karyawan master (dropdown), tidak
00060:     // boleh string kosong/lain-lain yang bisa membuat "karyawan hantu" baru
00061:     // ikut tersimpan ke database SQLite & muncul lagi di dropdown berikutnya.
00062:     const validNames = piEmployeeList();
00063:     if(!selectedNama || !validNames.includes(selectedNama)){
00064:       toast('Nama karyawan tidak valid atau daftar karyawan belum termuat. Silakan tunggu data selesai dimuat lalu pilih ulang nama karyawan.', true);
00065:       return;
00066:     }
00067:     const payload = {
00068:       nama: selectedNama,
00069:       posisi: $('#pi-hs-position').value.trim(),
00070:       tahun: Number($('#pi-hs-year').value)||new Date().getFullYear(),
00071:       assessor: $('#pi-hs-assessor').value.trim(),
00072:       items: PI_HS_EDIT_ITEMS,
00073:       kompeten: resume.kompeten,
00074:       belumKompeten: resume.belumKompeten,
00075:       // Penjelasan Belum Kompeten SELALU dihitung otomatis dari penjelasan
00076:       // per unit kompetensi (satu penjelasan terikat ke satu unit) — tidak
00077:       // ada lagi input manual terpisah di level resume agar tidak double input.
00078:       penjelasanBelumKompeten: resume.penjelasanBelumKompeten,
00079:       selfLearning: $('#pi-hs-resume-selflearning').value.trim(),
00080:       mentoring: $('#pi-hs-resume-mentoring').value.trim(),
00081:       coaching: $('#pi-hs-resume-coaching').value.trim()
00082:     };
00083:     if(!payload.nama || !payload.posisi || !payload.items.length){ toast('Lengkapi nama, posisi, dan minimal satu unit kompetensi hard skill.', true); return; }
00084:     if(payload.items.some(it=>!it.unitKompetensi || !it.statusManager)){ toast('Lengkapi Unit Kompetensi dan status penilaian (Kompeten/Belum Kompeten) dari direct manager untuk setiap baris.', true); return; }
00085:     if(payload.items.some(it=>it.statusManager==='Belum Kompeten' && !String(it.penjelasanBelumKompeten||'').trim())){ toast('Isi Penjelasan untuk setiap unit kompetensi berstatus Belum Kompeten.', true); return; }
00086:     try{
00087:       await apiPost({action:'savePiHardskill', assessment:payload});
00088:       // Sinkronkan ulang dari backend lalu langsung dorong hasilnya ke Personnel
00089:       // (card personil) dan PI Dashboard supaya kedua menu itu langsung
00090:       // menampilkan hasil assessment terbaru tanpa perlu reload halaman.
00091:       await piSyncHardSkillFromBackend();
00092:       renderPiHardSkillHistory();
00093:       if(typeof renderPiPersonnelView === 'function'){ try{ renderPiPersonnelView(); }catch(e){} }
00094:       if(typeof renderPiDashboardView === 'function'){ try{ renderPiDashboardView(); }catch(e){} }
00095:       toast('Hard skill assessment berhasil disimpan & tersinkron ke Personnel + PI Dashboard');
00096:     }catch(err){ toast('Gagal menyimpan hard skill: ' + err.message, true); }
00097:   }
00098: });
00099: 
00100: const _oldCopilotPageResume =
00101:   typeof window.copilotPageResume === 'function'
00102:     ? window.copilotPageResume
00103:     : function(){ return []; };
00104: window.copilotPageResume = function(view){
00105:   const items = _oldCopilotPageResume(view) || [];
00106:   if(['pi-dashboard','pi-personnel','pi-softskill','pi-hardskill','pi-smart-resume'].includes(view)){
00107:     const totalPersonil = (typeof piEmployeeList === 'function') ? piEmployeeList().length : 0;
00108:     const totalSoft = (typeof loadPiSoftskill === 'function') ? loadPiSoftskill().length : 0;
00109:     const totalHard = (typeof loadPiHardSkill === 'function')
00110:       ? (((PI_HS_ASSESSMENTS && PI_HS_ASSESSMENTS.length) ? PI_HS_ASSESSMENTS.length : loadPiHardSkill().length) || 0)
00111:       : 0;
00112:     items.push({
00113:       level:'info', icon:'🧠', title:'Ringkasan People Intelligence',
00114:       text:`Total personil <b>${totalPersonil}</b>, soft skill assessment <b>${totalSoft}</b>, hard skill assessment <b>${totalHard}</b>.`,
00115:       sub:'Copilot sudah ditautkan ke master personil, soft skill, hard skill, dan profil personil.',
00116:       sources:[]
00117:     });
00118:   }
00119:   return items;
00120: };
00121: 
00122: </script>
00123: <link rel="preconnect" href="https://fonts.googleapis.com">
00124: <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;700;800;900&family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Poppins:wght@500;600;700;800&family=VT323&family=Playfair+Display:wght@600;700;800&family=Press+Start+2P&display=swap" rel="stylesheet">
00125: 
00126: <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
00127: <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
00128: <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
00129: <style>
00130: :root{
00131:   /* ==== TEMA DEFAULT: Merah-Hitam (WCAG 2.2 AA) ====
~~~

### Around line 12908
~~~text
12896:   KPI_KERJA = loadKpiKerjaLocal();
12897:   if(!WEB_APP_URL) return KPI_KERJA;
12898:   try{
12899:     const remote = await apiGet('kpiKerjaList');
12900:     if(Array.isArray(remote)) saveKpiKerjaLocal(remote);
12901:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
12902:   return KPI_KERJA;
12903: }
12904: 
12905: async function syncKpiDepartmentData(){
12906:   if(!WEB_APP_URL) return {mtd:KPI_DEPARTMENT_MTD,ytd:KPI_DEPARTMENT_YTD,meta:KPI_DEPARTMENT_META};
12907:   try{
12908:     const payload = await apiGet('kpiDepartmentData');
12909:     if(payload && typeof payload === 'object'){
12910:       if(Array.isArray(payload.mtd)){
12911:         KPI_DEPARTMENT_MTD = payload.mtd;
12912:         const officialKeys = new Set(payload.mtd.map(r=>String(r['Tahun']||'')+'|'+String(r['KPI']||'')));
12913:         const preserved = KPI_KERJA.filter(r=>!officialKeys.has(String(r['Tahun']||'')+'|'+String(r['KPI']||'')));
12914:         saveKpiKerjaLocal([...preserved, ...payload.mtd]);
12915:       }
12916:       if(Array.isArray(payload.ytd)) KPI_DEPARTMENT_YTD = payload.ytd;
12917:       if(payload.meta) KPI_DEPARTMENT_META = payload.meta;
12918:     }
12919:   }catch(e){ console.warn('KPI Department source sync gagal:', e); }
12920:   return {mtd:KPI_DEPARTMENT_MTD,ytd:KPI_DEPARTMENT_YTD,meta:KPI_DEPARTMENT_META};
12921: }
12922: 
12923: function kkPolaritasOk(polaritas, target, realisasi){
12924:   if(target === '' || target === null || target === undefined) return null;
12925:   if(realisasi === '' || realisasi === null || realisasi === undefined) return null;
12926:   target = Number(target); realisasi = Number(realisasi);
12927:   if(isNaN(target) || isNaN(realisasi)) return null;
12928:   return polaritas === 'Maximized' ? (realisasi >= target) : (realisasi <= target);
12929: }
12930: 
12931: function kkBuildBulanGrid(){
12932:   const holder = $('#kk-bulan-grid');
12933:   if(!holder) return;
12934:   holder.innerHTML = KK_BULAN.map(b => `
12935:     <div class="kk-bulan-cell">
12936:       <div class="kk-bulan-lbl">${b}</div>
12937:       <input type="number" step="0.01" placeholder="Target" data-kk-bulan="${b}" data-kk-type="target" title="Target ${b}">
12938:       <input type="number" step="0.01" placeholder="Realisasi" data-kk-bulan="${b}" data-kk-type="realisasi" title="Realisasi ${b}">
12939:     </div>
12940:   `).join('');
12941: }
12942: 
12943: function resetKpiKerjaForm(){
12944:   KPI_KERJA_EDIT_ID = null;
12945:   ['#kk-tahun','#kk-perspective','#kk-producer','#kk-divisi','#kk-kpi','#kk-satuan','#kk-rumus','#kk-periode','#kk-target-tahunan'].forEach(sel=>{ const el=$(sel); if(el) el.value=''; });
12946:   const pol = $('#kk-polaritas'); if(pol) pol.value = 'Minimized';
12947:   const yearField = $('#kk-tahun'); if(yearField && !yearField.value) yearField.value = new Date().getFullYear();
12948:   kkBuildBulanGrid();
12949:   const btnCancel = $('#btn-cancel-edit-kpi-kerja'); if(btnCancel) btnCancel.style.display = 'none';
12950: }
12951: 
12952: function renderKpiKerjaTable(){
12953:   kkBuildBulanGrid();
12954:   const holder = $('#kpi-kerja-table');
12955:   if(!holder) return;
12956:   if(!KPI_KERJA.length){ holder.innerHTML = `<div style="color:var(--text-dim);font-size:13px;">Belum ada data KPI. Klik "Isi KPI Standar" atau tambah manual di atas.</div>`; return; }
12957:   const rows = KPI_KERJA.slice().sort((a,b)=> String(b['Tahun']).localeCompare(String(a['Tahun'])) || String(a['Divisi']||'').localeCompare(String(b['Divisi']||'')) || String(a['KPI']||'').localeCompare(String(b['KPI']||'')));
12958:   holder.innerHTML = `<div style="overflow-x:auto;"><table class="kk-table"><thead><tr>
12959:       <th>Tahun</th><th>Divisi</th><th>KPI</th><th>Satuan</th><th>Polaritas</th><th>Target Tahunan</th><th>Aksi</th>
12960:     </tr></thead><tbody>
12961:     ${rows.map(r=>`<tr>
12962:       <td>${escapeHtml(String(r['Tahun']||''))}</td>
12963:       <td>${escapeHtml(r['Divisi']||'')}</td>
12964:       <td>${escapeHtml(r['KPI']||'')}</td>
12965:       <td>${escapeHtml(r['Satuan']||'')}</td>
12966:       <td>${escapeHtml(r['Polaritas']||'')}</td>
12967:       <td>${escapeHtml(String(r['Target Tahunan']!==undefined?r['Target Tahunan']:''))}</td>
12968:       <td>
12969:         <button class="btn btn-sm" data-kk-edit="${r['ID']}"><i class="ph-bold ph-pencil-simple"></i></button>
12970:         <button class="btn btn-sm" data-kk-del="${r['ID']}"><i class="ph-bold ph-trash"></i></button>
12971:       </td>
12972:     </tr>`).join('')}
~~~

### Around line 15473
~~~text
15461:       <div class="actions">
15462:         <button type="button" class="btn btn-sm btn-primary sp-wh-validate" data-id="${escapeHtml(item.id)}"><i class="ph-bold ph-check-circle"></i> Validate</button>
15463:       </div>
15464:     </div>`;
15465:   }).join('');
15466: 
15467:   $$('.sp-wh-validate', holder).forEach(btn=> btn.addEventListener('click', async ()=>{
15468:     const row = btn.closest('.sp-wh-row');
15469:     const id = btn.dataset.id;
15470:     const item = SPAREPART_ETA.find(x=>x.id===id); if(!item) return;
15471:     const validator = row.querySelector('.sp-wh-validator').value.trim();
15472:     if(!validator){ toast('Nama Validator wajib diisi sebelum validasi.', true); return; }
15473:     const payload = {
15474:       poId: id, noPO: item.noPO, namaMaterial: item.namaMaterial,
15475:       qtyMatch: row.querySelector('.sp-wh-qtymatch').value,
15476:       condition: row.querySelector('.sp-wh-condition').value,
15477:       location: row.querySelector('.sp-wh-location').value.trim(),
15478:       sapUpdated: row.querySelector('.sp-wh-sapupdated').value === '1',
15479:       validator,
15480:       validationDate: row.querySelector('.sp-wh-date').value || new Date().toISOString().slice(0,10)
15481:     };
15482:     SPAREPART_WAREHOUSE = SPAREPART_WAREHOUSE.filter(x=>x.poId!==id);
15483:     SPAREPART_WAREHOUSE.push(payload);
15484:     saveSparepartWarehouseLocal();
15485:     item.status = 'WAREHOUSE';
15486:     saveSparepartEtaLocal();
15487:     toast('Validasi tersimpan — status PO menjadi Warehouse Available.');
15488:     renderSparepartPoDash(); renderSparepartEtaList(); renderSparepartWarehouseList();
15489:     try{ await apiPost({ action:'saveSparepartWarehouse', ...payload }); }catch(e){}
15490:     try{ await apiPost({ action:'updateSparepartEta', id, status:'WAREHOUSE' }); }catch(e){}
15491:   }));
15492: }
15493: const searchWhEl = $('#search-sparepart-warehouse');
15494: if(searchWhEl) searchWhEl.addEventListener('input', renderSparepartWarehouseList);
15495: 
15496: /* =========================================================
15497:    TAB 4: DAILY STOCK OPNAME
15498:    Pencatatan hasil hitung fisik stok gudang, dibandingkan dengan stok
15499:    sistem (dicocokkan via SAP dari master Sparepart_Lokasi -- lihat
15500:    findStockSistemBySap di bagian "MASTER SPAREPART" di atas).
15501:    Checklist harian 20-30 item dibuat otomatis dari master Lokasi Sparepart.
15502:    ========================================================= */
15503: const SPAREPART_OPNAME_DAILY_TARGET = 30;
15504: let SPAREPART_OPNAME = [];
15505: function loadSparepartOpnameLocal(){
15506:   try{ SPAREPART_OPNAME = JSON.parse(localStorage.getItem(LS_SPAREPART_OPNAME_KEY) || '[]'); }
15507:   catch(e){ SPAREPART_OPNAME = []; }
15508: }
15509: function saveSparepartOpnameLocal(){ localStorage.setItem(LS_SPAREPART_OPNAME_KEY, JSON.stringify(SPAREPART_OPNAME)); }
15510: loadSparepartOpnameLocal();
15511: async function syncSparepartOpnameFromBackend(){
15512:   if(!WEB_APP_URL) return SPAREPART_OPNAME;
15513:   try{
15514:     const remote = await apiGet('sparepartOpname');
15515:     if(Array.isArray(remote)){
15516:       SPAREPART_OPNAME = remote.map(r=>({
15517:         id: r['ID']||('OP-'+Date.now()+Math.random()),
15518:         tanggal: r['Tanggal']||'',
15519:         partNo: r['Part No']||'',
15520:         namaMaterial: r['Nama Material']||'',
15521:         sap: r['Material Number SAP']||'',
15522:         stockSistem: r['Stock Sistem']===''||r['Stock Sistem']==null ? null : Number(r['Stock Sistem']),
15523:         stockFisik: Number(r['Stock Fisik'])||0,
15524:         selisih: r['Selisih']===''||r['Selisih']==null ? null : Number(r['Selisih']),
15525:         lokasi: r['Lokasi Rak']||'',
15526:         catatan: r['Catatan']||'',
15527:         createdAt: r['Timestamp']||new Date().toISOString()
15528:       }));
15529:       saveSparepartOpnameLocal();
15530:     }
15531:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
15532:   return SPAREPART_OPNAME;
15533: }
15534: 
15535: $('#sp-opname-sap').addEventListener('change', ()=>{
15536:   const auto = findStockSistemBySap($('#sp-opname-sap').value.trim());
15537:   if(auto!=null) $('#sp-opname-sistem').value = auto;
~~~

### Around line 27127
~~~text
27115:   const data = {};
27116:   if(PMC_STATE.editId) data.ID = PMC_STATE.editId;
27117:   let missingReq = false;
27118:   meta.fields.forEach(f=>{
27119:     const id = 'pmc-f-'+f.k.replace(/[^a-zA-Z0-9]/g,'_');
27120:     const el = document.getElementById(id);
27121:     const v = el ? el.value.trim() : '';
27122:     if(f.req && !v) missingReq = true;
27123:     data[f.k] = v;
27124:   });
27125:   if(missingReq){ toast('Lengkapi field wajib (*)', true); return; }
27126: 
27127:   const payload = {action: meta.saveAction, data: data};
27128:   for(const ff of meta.fileFields){
27129:     const files = pendingFiles[ff.key]||[];
27130:     if(files.length){
27131:       payload[ff.key] = (await Promise.all(files.map(f=>prepareUploadPayload_(f)))).map(({_blob,...x})=>x);
27132:     }
27133:   }
27134:   const btn = $('#pmc-btn-save');
27135:   btn.disabled = true; btn.innerHTML = '<i class="ph-bold ph-spinner"></i> Menyimpan...';
27136:   try{
27137:     await apiPost(payload);
27138:     toast('Data '+meta.label+' tersimpan.');
27139:     closeModal();
27140:     await pmcLoadAll(true);
27141:     pmcPopulateFilterOptions();
27142:     pmcRenderDashboard();
27143:     pmcRenderList();
27144:   }catch(err){
27145:     toast('Gagal menyimpan: '+err.message, true);
27146:     btn.disabled = false; btn.innerHTML = '<i class="ph-bold ph-check-circle"></i> Simpan';
27147:   }
27148: }
27149: 
27150: async function pmcDeleteItem(type, id){
27151:   if(!confirm('Hapus data ini? Tindakan tidak bisa dibatalkan.')) return;
27152:   try{
27153:     await apiPost({action: PMC_META[type].deleteAction, id: id});
27154:     toast('Data dihapus.');
27155:     closeModal();
27156:     await pmcLoadAll(true);
27157:     pmcPopulateFilterOptions();
27158:     pmcRenderDashboard();
27159:     pmcRenderList();
27160:   }catch(err){
27161:     toast('Gagal menghapus: '+err.message, true);
27162:   }
27163: }
27164: 
27165: function pmcOpenProgressLogForm(type, item){
27166:   const meta = PMC_META[type];
27167:   const history = (item['Progress Log (JSON)']||[]);
27168:   const historyHtml = history.slice().reverse().map(h=>`
27169:     <div style="border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin-bottom:6px;font-size:12px;">
27170:       <b>${escapeHtml(h.tanggal||'')}</b> — ${escapeHtml(h.pic||'')} — ${escapeHtml(String(h.persentase||''))}%<br>
27171:       ${escapeHtml(h.keterangan||'')}
27172:       ${h.kendala?`<div style="color:#ef4444;">Kendala: ${escapeHtml(h.kendala)}</div>`:''}
27173:       ${h.rencanaBerikutnya?`<div style="color:var(--text-dim);">Rencana: ${escapeHtml(h.rencanaBerikutnya)}</div>`:''}
27174:     </div>`).join('') || '<div class="pmc-empty">Belum ada histori update.</div>';
27175: 
27176:   $('#modal-content').innerHTML = `
27177:     <div class="modal-head">
27178:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-notepad"></i> Update Progress — ${escapeHtml(item[meta.title]||'')}</h2></div>
27179:       <button class="modal-close" id="btn-close-modal">✕</button>
27180:     </div>
27181:     <div class="grid2">
27182:       <div class="field"><label>Tanggal</label><input type="date" id="pmc-log-tanggal" value="${new Date().toISOString().slice(0,10)}"></div>
27183:       <div class="field"><label>PIC</label><input type="text" id="pmc-log-pic" value="${escapeHtml(item[meta.pic]||'')}"></div>
27184:       <div class="field"><label>Persentase (%)</label><input type="number" id="pmc-log-persen" min="0" max="100" value="${escapeHtml(String(item[meta.progress]||0))}"></div>
27185:     </div>
27186:     <div class="field"><label>Keterangan</label><textarea id="pmc-log-ket" rows="2"></textarea></div>
27187:     <div class="field"><label>Kendala</label><textarea id="pmc-log-kendala" rows="2"></textarea></div>
27188:     <div class="field"><label>Rencana Berikutnya</label><textarea id="pmc-log-rencana" rows="2"></textarea></div>
27189:     <div class="field"><label>Foto (opsional)</label>
27190:       <div class="file-drop" id="pmc-log-filedrop" style="padding:10px;"><i class="ph-bold ph-camera"></i> Klik untuk pilih foto
27191:         <input type="file" id="pmc-log-fileinput" accept="image/*" multiple style="display:none;">
~~~

## function logoutUser(
### Around line 8045
~~~text
08033: // kembali aktif (mis. user balik dari aplikasi lain di HP). Ringan karena
08034: // permission/feature di backend sudah di-cache 10 menit (CacheService),
08035: // jadi tidak membebani database SQLite.
08036: setInterval(()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); }, 3*60*1000);
08037: document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); });
08038: 
08039: /* ---------------- LOGOUT ----------------
08040:    Membersihkan sesi RBAC (CURRENT_USER, permission, feature registry) &
08041:    status login menu Setting, lalu menampilkan kembali login-gate supaya
08042:    pengguna wajib login ulang dengan akun (username/password) untuk
08043:    masuk ke aplikasi lagi. Data yang sudah tersimpan di database SQLite
08044:    tidak terpengaruh sama sekali oleh logout. */
08045: function logoutUser(){
08046:   try{
08047:     deactivateAccountDataCaches_(CURRENT_USER&&CURRENT_USER.username);
08048:   }catch(e){
08049:     toast('Logout dibatalkan karena cache lokal belum berhasil diamankan. Coba kembali setelah ruang penyimpanan browser tersedia.', true);
08050:     return;
08051:   }
08052:   const tokenToRevoke = SESSION_TOKEN;
08053:   if(tokenToRevoke && WEB_APP_URL){
08054:     fetch(WEB_APP_URL, {
08055:       method:'POST',
08056:       headers:{'Content-Type':'text/plain;charset=utf-8'},
08057:       body:JSON.stringify({action:'logout', sessionToken:tokenToRevoke}),
08058:       keepalive:true
08059:     }).catch(()=>{});
08060:   }
08061:   CURRENT_USER = null;
08062:   SESSION_TOKEN = '';
08063:   SESSION_EXPIRES_AT = '';
08064:   PERMISSIONS = {};
08065:   FEATURE_REGISTRY = [];
08066:   try{ localStorage.removeItem(SS_USER_KEY); localStorage.removeItem(SS_TOKEN_KEY); localStorage.removeItem(SS_TOKEN_EXP_KEY); localStorage.removeItem(LS_PERM_KEY); localStorage.removeItem(LS_FEATURES_KEY); }catch(e){}
08067:   if(typeof resetSettingAuth === 'function') resetSettingAuth();
08068: 
08069:   const gate = document.getElementById('login-gate');
08070:   const appRoot = document.getElementById('app-root');
08071:   if(appRoot) appRoot.classList.remove('unlocked', 'dash-mode', 'menu-visible');
08072:   if(gate){
08073:     gate.style.display = '';
08074:     gate.style.opacity = '1';
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
~~~

## const logoutUser =
No match.

## logoutUser = function
No match.

## handleApiAuthFailure_(
### Around line 7832
~~~text
07820:   }
07821: }
07822: async function fetchWithTimeout_(url, options={}, timeoutMs=45000){
07823:   // PATCHED v2.1 - timeout 45s default + pesan cold start
07824:   const controller = new AbortController();
07825:   const timer = setTimeout(()=>controller.abort(), timeoutMs);
07826:   try{ return await fetch(url, {...options, signal:controller.signal}); }
07827:   catch(err){
07828:     if(err && err.name==='AbortError') throw new Error('Backend timeout setelah '+Math.round(timeoutMs/1000)+' detik. Periksa koneksi internet lalu coba kembali.');
07829:     throw err;
07830:   }finally{ clearTimeout(timer); }
07831: }
07832: function handleApiAuthFailure_(message, requestToken){
07833:   const msg = String(message || '');
07834:   if(!/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(msg)) return;
07835:   if(SETTING_AUTH_OK && SETTING_SESSION_TOKEN && requestToken === SETTING_SESSION_TOKEN){
07836:     resetSettingAuth();
07837:     return;
07838:   }
07839:   logoutUser();
07840: }
07841: // Session-only read cache; isolated by backend, token and parameters.
07842: const READY_READS = new Map();
07843: const ACTIVE_READS = new Map();
07844: let READ_GENERATION = 0;
07845: function invalidatePreparedReads_(){
07846:   READY_READS.clear(); READ_GENERATION++;
07847:   if(typeof PMC_STATE !== 'undefined') PMC_STATE.loaded = false;
07848:   if(typeof MTG_STATE !== 'undefined') MTG_STATE.loaded = false;
07849: }
07850: async function apiGet(action, params={}, retries=2){
07851:   const token = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07852:   const key = JSON.stringify([WEB_APP_URL, token, action, Object.keys(params).sort().map(k=>[k,params[k]])]);
07853:   const fresh = params.fresh || params._ts;
07854:   const cached = READY_READS.get(key);
07855:   if(!fresh && cached && Date.now()-cached.time < 60000) return structuredReadCopy_(cached.data);
07856:   const activeKey = key + ':' + READ_GENERATION;
07857:   if(ACTIVE_READS.has(activeKey)) return structuredReadCopy_(await ACTIVE_READS.get(activeKey));
07858:   const generation = READ_GENERATION;
07859:   const promise = apiGetNetwork_(action, params, retries).then(data=>{
07860:     if(generation === READ_GENERATION) READY_READS.set(key,{data:structuredReadCopy_(data),time:Date.now()});
07861:     return data;
07862:   });
07863:   ACTIVE_READS.set(activeKey,promise);
07864:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07865: }
07866: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07867: 
07868: async function apiGetNetwork_(action, params={}, retries=2){
07869:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07870:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07871:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07872:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07873:   const qs = new URLSearchParams({action, ...params}).toString();
07874:   let lastErr=null;
07875:   for(let attempt=0; attempt<=retries; attempt++){
07876:     try{
07877:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07878:       const json = await parseApiResponse_(res);
07879:       if(!json.ok){
07880:         handleApiAuthFailure_(json.error || '', requestToken);
07881:         throw new Error(json.error || 'Gagal mengambil data');
07882:       }
07883:       return json.data;
07884:     }catch(e){
07885:       lastErr=e;
07886:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07887:       if(attempt<retries){
07888:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07889:       }
07890:     }
07891:   }
07892:   throw lastErr;
07893: }
07894: async function apiPost(payload){
07895:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07896:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
~~~

### Around line 7880
~~~text
07868: async function apiGetNetwork_(action, params={}, retries=2){
07869:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07870:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07871:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07872:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07873:   const qs = new URLSearchParams({action, ...params}).toString();
07874:   let lastErr=null;
07875:   for(let attempt=0; attempt<=retries; attempt++){
07876:     try{
07877:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07878:       const json = await parseApiResponse_(res);
07879:       if(!json.ok){
07880:         handleApiAuthFailure_(json.error || '', requestToken);
07881:         throw new Error(json.error || 'Gagal mengambil data');
07882:       }
07883:       return json.data;
07884:     }catch(e){
07885:       lastErr=e;
07886:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07887:       if(attempt<retries){
07888:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07889:       }
07890:     }
07891:   }
07892:   throw lastErr;
07893: }
07894: async function apiPost(payload){
07895:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07896:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
07897:   // saat koneksi belum dikonfigurasi tidak pernah ikut sinkron otomatis.
07898:   if(!WEB_APP_URL){
07899:     if(payload.action !== 'login') queueForSync_(payload);
07900:     throw new Error('NO_URL');
07901:   }
07902:   if(payload.action !== 'login' && !SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07903:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07904:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07905:   try{
07906:     // text/plain menghindari CORS preflight ke Cloudflare
07907:     const requestBodyText = JSON.stringify(securedPayload);
07908:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07909:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07910:     // membiarkan upload putus dan record tersisa hanya filename.
07911:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07912:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07913:     }
07914:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07915:       method: 'POST',
07916:       mode: 'cors',
07917:       credentials: 'same-origin',
07918:       redirect: 'follow',
07919:       cache: 'no-store',
07920:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07921:       body: requestBodyText
07922:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07923:     const json = await parseApiResponse_(res);
07924:     if(!json.ok){
07925:       handleApiAuthFailure_(json.error || '', requestToken);
07926:       throw new Error(json.error || 'Gagal menyimpan data');
07927:     }
07928:     invalidatePreparedReads_();
07929:     setAppOnlineStatus(true);
07930:     return json;
07931:   }catch(err){
07932:     // Kegagalan level jaringan (offline/tidak terjangkau) -> antre untuk
07933:     // disinkron otomatis nanti begitu internet kembali. Kegagalan dari
07934:     // server (json.ok === false, misal validasi) TIDAK diantre karena
07935:     // request sudah benar-benar sampai & ditolak, bukan soal koneksi.
07936:     const isNetworkErr = err instanceof TypeError ||
07937:       /Failed to fetch|NetworkError|Load failed|Backend timeout|AbortError|aborted/i.test(err.message || '');
07938:     if(isNetworkErr){
07939:       queueForSync_(securedPayload);
07940:       setAppOnlineStatus(false);
07941:     }
07942:     throw err;
07943:   }
07944: }
~~~

### Around line 7925
~~~text
07913:     }
07914:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07915:       method: 'POST',
07916:       mode: 'cors',
07917:       credentials: 'same-origin',
07918:       redirect: 'follow',
07919:       cache: 'no-store',
07920:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07921:       body: requestBodyText
07922:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07923:     const json = await parseApiResponse_(res);
07924:     if(!json.ok){
07925:       handleApiAuthFailure_(json.error || '', requestToken);
07926:       throw new Error(json.error || 'Gagal menyimpan data');
07927:     }
07928:     invalidatePreparedReads_();
07929:     setAppOnlineStatus(true);
07930:     return json;
07931:   }catch(err){
07932:     // Kegagalan level jaringan (offline/tidak terjangkau) -> antre untuk
07933:     // disinkron otomatis nanti begitu internet kembali. Kegagalan dari
07934:     // server (json.ok === false, misal validasi) TIDAK diantre karena
07935:     // request sudah benar-benar sampai & ditolak, bukan soal koneksi.
07936:     const isNetworkErr = err instanceof TypeError ||
07937:       /Failed to fetch|NetworkError|Load failed|Backend timeout|AbortError|aborted/i.test(err.message || '');
07938:     if(isNetworkErr){
07939:       queueForSync_(securedPayload);
07940:       setAppOnlineStatus(false);
07941:     }
07942:     throw err;
07943:   }
07944: }
07945: 
07946: /* ---------------- RBAC: PULIHKAN SESI SAAT REFRESH HALAMAN ----------------
07947:    CURRENT_USER (username/role) di-cache di localStorage supaya refresh
07948:    halaman ATAU membuka lagi file/tab-nya di browser yang sama tidak
07949:    memaksa login ulang. Permission & feature registry TETAP diambil ulang
07950:    dari code.gs (single source of truth) tiap kali, bukan dari cache,
07951:    supaya perubahan Role Access Management langsung berlaku begitu halaman
07952:    dibuka lagi. */
07953: (async function restoreRbacSession_(){
07954:   if(!CURRENT_USER) return;
07955:   const gate = document.getElementById('login-gate');
07956:   const appRoot = document.getElementById('app-root');
07957:   // Unlock LANGSUNG memakai sesi & permission yang sudah di-cache di
07958:   // localStorage (dari login sebelumnya), TANPA menunggu server dulu.
07959:   // Ini mencegah refresh/buka-ulang balik ke halaman login hanya gara-gara
07960:   // koneksi ke server sedang lambat/gagal saat halaman baru dimuat —
07961:   // sesuatu yang sebelumnya bisa terjadi kalau pemulihan sesi mensyaratkan
07962:   // fetch features/permissions berhasil lebih dulu.
07963:   applyRbacToUi();
07964:   if(gate) gate.style.display = 'none';
07965:   document.getElementById('app-splash')?.classList.add('show','visible');
07966:   // [FIX] switchToView('dashboard') dipanggil lewat setTimeout(...,0), BUKAN
07967:   // langsung sinkron di sini. Alasan: IIFE ini jalan di TENGAH proses parsing
07968:   // script (jauh sebelum baris const LS_MBD_KEY/LS_CR_KEY/LS_ENG_KEY di bawah
07969:   // dieksekusi). switchToView() memanggil ensureClearLocalCacheButton() ->
07970:   // getViewLocalStorageKeys() yang mereferensikan const-const tsb -- karena
07971:   // masih dalam temporal dead zone, ini melempar
07972:   // "ReferenceError: Cannot access 'LS_MBD_KEY' before initialization"
07973:   // setiap kali ada sesi RBAC yang di-cache (mis. user buka ulang browser
07974:   // setelah pernah login). Menunda 1 tick memastikan seluruh script (semua
07975:   // deklarasi const) sudah selesai dieksekusi dulu sebelum switchToView jalan.
07976:   if(typeof switchToView === 'function'){ setTimeout(()=> switchToView('dashboard'), 0); }
07977:   // [FIX] Sebelumnya "Promise.resolve(INITIAL_LOAD_PROMISE).then(...)" dipanggil
07978:   // LANGSUNG di sini secara sinkron. INITIAL_LOAD_PROMISE dibaca PADA SAAT ITU
07979:   // JUGA, padahal nilainya masih default (Promise.resolve() dari deklarasi
07980:   // awal) -- promise loadAll() yang SESUNGGUHNYA baru di-assign belakangan oleh
07981:   // IIFE init() (dekat baris 19000-an), yang berjalan SETELAH baris ini secara
07982:   // sinkron. Akibatnya .then() di sini nempel ke promise BASI yang sudah
07983:   // resolved duluan, sehingga callback-nya (render ulang Home) tereksekusi
07984:   // hampir seketika -- SEBELUM data ENTRIES/MACHINES/KPI_KERJA/SPAREPART_ETA
07985:   // yang sebenarnya selesai dimuat oleh loadAll() yang sungguhan. Untuk sesi
07986:   // yang di-restore dari cache (bukan login baru), tidak ada render ulang lain
07987:   // setelah loadAll() betul-betul selesai -- jadi Home/Smart Resume (termasuk
07988:   // chip KPI/PO/Sparepart Terpakai) bisa nyangkut di kondisi data belum
07989:   // lengkap. Menunda pembacaan INITIAL_LOAD_PROMISE lewat setTimeout(...,0)
~~~

## function resetSettingAuth(
### Around line 6648
~~~text
06636:    memang ber-role Superadmin, menu ini langsung terbuka tanpa login
06637:    ulang. Kalau bukan, sistem meminta login dengan akun Superadmin lain
06638:    (step-up auth) khusus untuk membuka menu ini — status step-up ini
06639:    HANYA berlaku selama pengguna tetap berada di menu Setting, begitu
06640:    pindah menu otomatis di-reset (wajib login ulang tiap kembali). Ini
06641:    terpisah total dari koneksi Cloudflare (WEB_APP_URL) & dari
06642:    sesi login utama (CURRENT_USER), yang tidak ikut berubah/hilang. */
06643: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06644: let SETTING_SESSION_TOKEN = '';
06645: function isSettingAuthed(){
06646:   return SETTING_AUTH_OK === true || isSuperadmin();
06647: }
06648: function resetSettingAuth(){
06649:   const tokenToRevoke = SETTING_SESSION_TOKEN;
06650:   if(tokenToRevoke && WEB_APP_URL){
06651:     fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke})}).catch(()=>{});
06652:   }
06653:   SETTING_AUTH_OK = false;
06654:   SETTING_SESSION_TOKEN = '';
06655: }
06656: function showSettingLoginModal(onSuccess){
06657:   $('#modal-content').innerHTML = `
06658:     <div class="modal-head">
06659:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-lock-key"></i> Akses Master Mesin &amp; Koneksi</h2></div>
06660:       <button class="modal-close" id="btn-close-modal">✕</button>
06661:     </div>
06662:     <div style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Menu ini berisi data master &amp; koneksi database SQLite, khusus akun ber-role <b>Superadmin</b>. Masukkan username &amp; password akun Superadmin Anda untuk melanjutkan. Akses ini hanya berlaku selama Anda berada di menu ini — begitu pindah menu, Anda perlu memverifikasi ulang untuk masuk ke sini.</div>
06663:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06664:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06665:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06666:     <div style="margin-top:16px;display:flex;gap:10px;">
06667:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06668:     </div>
06669:   `;
06670:   $('#modal-bg').classList.add('active');
06671:   $('#btn-close-modal').addEventListener('click', closeModal);
06672:   const submit = async ()=>{
06673:     const u = $('#setting-login-username').value.trim();
06674:     const p = $('#setting-login-password').value;
06675:     const errEl = $('#setting-login-error');
06676:     const submitBtn = $('#btn-setting-login-submit');
06677:     errEl.style.display = 'none';
06678:     if(!u || !p) return;
06679:     if(!WEB_APP_URL){
06680:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App).';
06681:       errEl.style.display = 'block';
06682:       return;
06683:     }
06684:     submitBtn.disabled = true;
06685:     const originalLabel = submitBtn.innerHTML;
06686:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06687:     try{
06688:       const res = await fetchWithTimeout_(WEB_APP_URL, {
06689:         method: 'POST',
06690:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
06691:         body: JSON.stringify({ action: 'login', username: u, password: p })
06692:       }, 30000);
06693:       const json = await parseApiResponse_(res);
06694:       if(!json.ok || !json.user){
06695:         errEl.textContent = json.error || 'Username atau password salah.';
06696:         errEl.style.display = 'block';
06697:         return;
06698:       }
06699:       if(json.user.role !== 'Superadmin'){
06700:         if(json.sessionToken){
06701:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06702:         }
06703:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06704:         errEl.style.display = 'block';
06705:         return;
06706:       }
06707:       SETTING_AUTH_OK = true;
06708:       SETTING_SESSION_TOKEN = json.sessionToken || '';
06709:       closeModal();
06710:       if(onSuccess) onSuccess();
06711:     }catch(err){
06712:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
~~~

## function apiGet(
### Around line 7850
~~~text
07838:   }
07839:   logoutUser();
07840: }
07841: // Session-only read cache; isolated by backend, token and parameters.
07842: const READY_READS = new Map();
07843: const ACTIVE_READS = new Map();
07844: let READ_GENERATION = 0;
07845: function invalidatePreparedReads_(){
07846:   READY_READS.clear(); READ_GENERATION++;
07847:   if(typeof PMC_STATE !== 'undefined') PMC_STATE.loaded = false;
07848:   if(typeof MTG_STATE !== 'undefined') MTG_STATE.loaded = false;
07849: }
07850: async function apiGet(action, params={}, retries=2){
07851:   const token = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07852:   const key = JSON.stringify([WEB_APP_URL, token, action, Object.keys(params).sort().map(k=>[k,params[k]])]);
07853:   const fresh = params.fresh || params._ts;
07854:   const cached = READY_READS.get(key);
07855:   if(!fresh && cached && Date.now()-cached.time < 60000) return structuredReadCopy_(cached.data);
07856:   const activeKey = key + ':' + READ_GENERATION;
07857:   if(ACTIVE_READS.has(activeKey)) return structuredReadCopy_(await ACTIVE_READS.get(activeKey));
07858:   const generation = READ_GENERATION;
07859:   const promise = apiGetNetwork_(action, params, retries).then(data=>{
07860:     if(generation === READ_GENERATION) READY_READS.set(key,{data:structuredReadCopy_(data),time:Date.now()});
07861:     return data;
07862:   });
07863:   ACTIVE_READS.set(activeKey,promise);
07864:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07865: }
07866: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07867: 
07868: async function apiGetNetwork_(action, params={}, retries=2){
07869:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07870:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07871:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07872:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07873:   const qs = new URLSearchParams({action, ...params}).toString();
07874:   let lastErr=null;
07875:   for(let attempt=0; attempt<=retries; attempt++){
07876:     try{
07877:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07878:       const json = await parseApiResponse_(res);
07879:       if(!json.ok){
07880:         handleApiAuthFailure_(json.error || '', requestToken);
07881:         throw new Error(json.error || 'Gagal mengambil data');
07882:       }
07883:       return json.data;
07884:     }catch(e){
07885:       lastErr=e;
07886:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07887:       if(attempt<retries){
07888:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07889:       }
07890:     }
07891:   }
07892:   throw lastErr;
07893: }
07894: async function apiPost(payload){
07895:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07896:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
07897:   // saat koneksi belum dikonfigurasi tidak pernah ikut sinkron otomatis.
07898:   if(!WEB_APP_URL){
07899:     if(payload.action !== 'login') queueForSync_(payload);
07900:     throw new Error('NO_URL');
07901:   }
07902:   if(payload.action !== 'login' && !SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07903:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07904:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07905:   try{
07906:     // text/plain menghindari CORS preflight ke Cloudflare
07907:     const requestBodyText = JSON.stringify(securedPayload);
07908:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07909:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07910:     // membiarkan upload putus dan record tersisa hanya filename.
07911:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07912:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07913:     }
07914:     const res = await fetchWithTimeout_(WEB_APP_URL, {
~~~

## function apiPost(
### Around line 7894
~~~text
07882:       }
07883:       return json.data;
07884:     }catch(e){
07885:       lastErr=e;
07886:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07887:       if(attempt<retries){
07888:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07889:       }
07890:     }
07891:   }
07892:   throw lastErr;
07893: }
07894: async function apiPost(payload){
07895:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07896:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
07897:   // saat koneksi belum dikonfigurasi tidak pernah ikut sinkron otomatis.
07898:   if(!WEB_APP_URL){
07899:     if(payload.action !== 'login') queueForSync_(payload);
07900:     throw new Error('NO_URL');
07901:   }
07902:   if(payload.action !== 'login' && !SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07903:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07904:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07905:   try{
07906:     // text/plain menghindari CORS preflight ke Cloudflare
07907:     const requestBodyText = JSON.stringify(securedPayload);
07908:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07909:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07910:     // membiarkan upload putus dan record tersisa hanya filename.
07911:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07912:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07913:     }
07914:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07915:       method: 'POST',
07916:       mode: 'cors',
07917:       credentials: 'same-origin',
07918:       redirect: 'follow',
07919:       cache: 'no-store',
07920:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07921:       body: requestBodyText
07922:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07923:     const json = await parseApiResponse_(res);
07924:     if(!json.ok){
07925:       handleApiAuthFailure_(json.error || '', requestToken);
07926:       throw new Error(json.error || 'Gagal menyimpan data');
07927:     }
07928:     invalidatePreparedReads_();
07929:     setAppOnlineStatus(true);
07930:     return json;
07931:   }catch(err){
07932:     // Kegagalan level jaringan (offline/tidak terjangkau) -> antre untuk
07933:     // disinkron otomatis nanti begitu internet kembali. Kegagalan dari
07934:     // server (json.ok === false, misal validasi) TIDAK diantre karena
07935:     // request sudah benar-benar sampai & ditolak, bukan soal koneksi.
07936:     const isNetworkErr = err instanceof TypeError ||
07937:       /Failed to fetch|NetworkError|Load failed|Backend timeout|AbortError|aborted/i.test(err.message || '');
07938:     if(isNetworkErr){
07939:       queueForSync_(securedPayload);
07940:       setAppOnlineStatus(false);
07941:     }
07942:     throw err;
07943:   }
07944: }
07945: 
07946: /* ---------------- RBAC: PULIHKAN SESI SAAT REFRESH HALAMAN ----------------
07947:    CURRENT_USER (username/role) di-cache di localStorage supaya refresh
07948:    halaman ATAU membuka lagi file/tab-nya di browser yang sama tidak
07949:    memaksa login ulang. Permission & feature registry TETAP diambil ulang
07950:    dari code.gs (single source of truth) tiap kali, bukan dari cache,
07951:    supaya perubahan Role Access Management langsung berlaku begitu halaman
07952:    dibuka lagi. */
07953: (async function restoreRbacSession_(){
07954:   if(!CURRENT_USER) return;
07955:   const gate = document.getElementById('login-gate');
07956:   const appRoot = document.getElementById('app-root');
07957:   // Unlock LANGSUNG memakai sesi & permission yang sudah di-cache di
07958:   // localStorage (dari login sebelumnya), TANPA menunggu server dulu.
~~~

## location.href
### Around line 26
~~~text
00014: <meta name="mobile-web-app-capable" content="yes">
00015: <meta name="apple-mobile-web-app-capable" content="yes">
00016: <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
00017: <meta name="apple-mobile-web-app-title" content="OMODOS">
00018: <meta name="theme-color" content="#111318">
00019: <link rel="manifest" id="pwa-manifest-link" href="">
00020: <script src="/work-areas.js"></script>
00021: <script>
00022:   // Manifest dibuat dinamis (bukan file statis) supaya start_url-nya selalu
00023:   // mengikuti URL deployment /exec yang sedang dipakai (Cloudflare tidak
00024:   // bisa menyajikan file manifest.json terpisah di path tetap).
00025:   (function(){
00026:     var startUrl = window.location.href.split('?')[0].split('#')[0];
00027:     var manifest = {
00028:       name: 'OMODOS - Maintenance Operating System',
00029:       short_name: 'OMODOS',
00030:       start_url: startUrl,
00031:       scope: startUrl,
00032:       display: 'fullscreen',
00033:       orientation: 'any',
00034:       background_color: '#111318',
00035:       theme_color: '#111318',
00036:       icons: []
00037:     };
00038:     var blob = new Blob([JSON.stringify(manifest)], { type: 'application/manifest+json' });
00039:     document.getElementById('pwa-manifest-link').setAttribute('href', URL.createObjectURL(blob));
00040:   })();
00041: </script>
00042: <title>OMODOS - Smart Maintenance Reporting Platform | Packaging Offset || © 2026 IDJ</title>
00043: <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='38' fill='none' stroke='%23111111' stroke-width='16'/%3E%3Cpath d='M50 88 A38 38 0 0 1 21.7 74.8' fill='none' stroke='%2300AEEF' stroke-width='16'/%3E%3Cpath d='M21.7 74.8 A38 38 0 0 1 50 88' fill='none' stroke='%23EC008C' stroke-width='16'/%3E%3Cpath d='M50 88 A38 38 0 0 0 78.3 74.8' fill='none' stroke='%23FFC20E' stroke-width='16'/%3E%3C/svg%3E">
00044: <script>(function(){ try{ var t = localStorage.getItem('app_theme') || 'omodos'; document.documentElement.setAttribute('data-theme', t); }catch(e){} try{ var s = localStorage.getItem('app_style') || 'klasik'; if(s !== 'klasik'){ document.documentElement.setAttribute('data-style', s); } }catch(e){} })();
00045: document.addEventListener('click', async (e)=>{
00046:   if(e.target.closest('#btn-pi-hs-add-row')){
00047:     renderPiHardSkillEditItems([...PI_HS_EDIT_ITEMS, piBlankHardSkillItem()]);
00048:   }
00049:   if(e.target.closest('.pi-hs-row-remove')){
00050:     const row = e.target.closest('.pi-hs-unit-row');
00051:     const idx = Number(row.dataset.idx);
00052:     const next = PI_HS_EDIT_ITEMS.slice();
00053:     next.splice(idx,1);
00054:     renderPiHardSkillEditItems(next);
00055:   }
00056:   if(e.target.closest('#btn-pi-hs-save-manual')){
00057:     const resume = piComputeHardSkillResume(PI_HS_EDIT_ITEMS);
00058:     const selectedNama = $('#pi-hs-employee').value;
00059:     // Guard: nama HARUS berasal dari daftar karyawan master (dropdown), tidak
00060:     // boleh string kosong/lain-lain yang bisa membuat "karyawan hantu" baru
00061:     // ikut tersimpan ke database SQLite & muncul lagi di dropdown berikutnya.
00062:     const validNames = piEmployeeList();
00063:     if(!selectedNama || !validNames.includes(selectedNama)){
00064:       toast('Nama karyawan tidak valid atau daftar karyawan belum termuat. Silakan tunggu data selesai dimuat lalu pilih ulang nama karyawan.', true);
00065:       return;
00066:     }
00067:     const payload = {
00068:       nama: selectedNama,
00069:       posisi: $('#pi-hs-position').value.trim(),
00070:       tahun: Number($('#pi-hs-year').value)||new Date().getFullYear(),
00071:       assessor: $('#pi-hs-assessor').value.trim(),
00072:       items: PI_HS_EDIT_ITEMS,
00073:       kompeten: resume.kompeten,
00074:       belumKompeten: resume.belumKompeten,
00075:       // Penjelasan Belum Kompeten SELALU dihitung otomatis dari penjelasan
00076:       // per unit kompetensi (satu penjelasan terikat ke satu unit) — tidak
00077:       // ada lagi input manual terpisah di level resume agar tidak double input.
00078:       penjelasanBelumKompeten: resume.penjelasanBelumKompeten,
00079:       selfLearning: $('#pi-hs-resume-selflearning').value.trim(),
00080:       mentoring: $('#pi-hs-resume-mentoring').value.trim(),
00081:       coaching: $('#pi-hs-resume-coaching').value.trim()
00082:     };
00083:     if(!payload.nama || !payload.posisi || !payload.items.length){ toast('Lengkapi nama, posisi, dan minimal satu unit kompetensi hard skill.', true); return; }
00084:     if(payload.items.some(it=>!it.unitKompetensi || !it.statusManager)){ toast('Lengkapi Unit Kompetensi dan status penilaian (Kompeten/Belum Kompeten) dari direct manager untuk setiap baris.', true); return; }
00085:     if(payload.items.some(it=>it.statusManager==='Belum Kompeten' && !String(it.penjelasanBelumKompeten||'').trim())){ toast('Isi Penjelasan untuk setiap unit kompetensi berstatus Belum Kompeten.', true); return; }
00086:     try{
00087:       await apiPost({action:'savePiHardskill', assessment:payload});
00088:       // Sinkronkan ulang dari backend lalu langsung dorong hasilnya ke Personnel
00089:       // (card personil) dan PI Dashboard supaya kedua menu itu langsung
00090:       // menampilkan hasil assessment terbaru tanpa perlu reload halaman.
~~~

## session expired
No match.

## SESSION_INVALID
### Around line 7300
~~~text
07288:     toast('Perubahan Role Access berhasil disimpan dan dibaca ulang dari database SQLite.');
07289:     applyRbacToUi();
07290:     return true;
07291:   }catch(err){
07292:     const raw = (err && err.message) ? err.message : String(err || 'Gagal menyimpan perubahan akses.');
07293:     let hint = '';
07294:     if(/UNKNOWN_ACTION|Action tidak terdaftar|METHOD_NOT_ALLOWED/i.test(raw)){
07295:       hint = ' Backend /exec yang aktif belum memakai Code.gs terbaru. Deploy > Manage deployments > Edit > pilih New version, lalu Deploy.';
07296:     }else if(/Backend mengirim halaman HTML|Unexpected token.*</i.test(raw)){
07297:       hint = ' Deployment Web App kemungkinan meminta login Google. Untuk frontend GitHub Pages, deploy Cloudflare sebagai Web App yang dieksekusi sebagai pemilik/deployer dan dapat diakses Anyone.';
07298:     }else if(/Failed to fetch|NetworkError|Load failed|CORS/i.test(raw)){
07299:       hint = ' Browser tidak dapat mengakses Web App. Pastikan URL berakhiran /exec dan deployment mengizinkan akses dari browser publik.';
07300:     }else if(/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/i.test(raw)){
07301:       hint = ' Sesi autentikasi sudah tidak valid; login ulang diperlukan.';
07302:     }else if(/FORBIDDEN|rbac\.manage/i.test(raw)){
07303:       hint = ' Request harus memakai sesi Superadmin.';
07304:     }
07305:     statusEl.textContent = 'Gagal pada tahap: ' + stage + '.';
07306:     toast('Gagal ' + stage + ': ' + raw + hint, true);
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
~~~

### Around line 7834
~~~text
07822: async function fetchWithTimeout_(url, options={}, timeoutMs=45000){
07823:   // PATCHED v2.1 - timeout 45s default + pesan cold start
07824:   const controller = new AbortController();
07825:   const timer = setTimeout(()=>controller.abort(), timeoutMs);
07826:   try{ return await fetch(url, {...options, signal:controller.signal}); }
07827:   catch(err){
07828:     if(err && err.name==='AbortError') throw new Error('Backend timeout setelah '+Math.round(timeoutMs/1000)+' detik. Periksa koneksi internet lalu coba kembali.');
07829:     throw err;
07830:   }finally{ clearTimeout(timer); }
07831: }
07832: function handleApiAuthFailure_(message, requestToken){
07833:   const msg = String(message || '');
07834:   if(!/AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(msg)) return;
07835:   if(SETTING_AUTH_OK && SETTING_SESSION_TOKEN && requestToken === SETTING_SESSION_TOKEN){
07836:     resetSettingAuth();
07837:     return;
07838:   }
07839:   logoutUser();
07840: }
07841: // Session-only read cache; isolated by backend, token and parameters.
07842: const READY_READS = new Map();
07843: const ACTIVE_READS = new Map();
07844: let READ_GENERATION = 0;
07845: function invalidatePreparedReads_(){
07846:   READY_READS.clear(); READ_GENERATION++;
07847:   if(typeof PMC_STATE !== 'undefined') PMC_STATE.loaded = false;
07848:   if(typeof MTG_STATE !== 'undefined') MTG_STATE.loaded = false;
07849: }
07850: async function apiGet(action, params={}, retries=2){
07851:   const token = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07852:   const key = JSON.stringify([WEB_APP_URL, token, action, Object.keys(params).sort().map(k=>[k,params[k]])]);
07853:   const fresh = params.fresh || params._ts;
07854:   const cached = READY_READS.get(key);
07855:   if(!fresh && cached && Date.now()-cached.time < 60000) return structuredReadCopy_(cached.data);
07856:   const activeKey = key + ':' + READ_GENERATION;
07857:   if(ACTIVE_READS.has(activeKey)) return structuredReadCopy_(await ACTIVE_READS.get(activeKey));
07858:   const generation = READ_GENERATION;
07859:   const promise = apiGetNetwork_(action, params, retries).then(data=>{
07860:     if(generation === READ_GENERATION) READY_READS.set(key,{data:structuredReadCopy_(data),time:Date.now()});
07861:     return data;
07862:   });
07863:   ACTIVE_READS.set(activeKey,promise);
07864:   try{ return structuredReadCopy_(await promise); }finally{ ACTIVE_READS.delete(activeKey); }
07865: }
07866: function structuredReadCopy_(data){ return data === undefined ? data : JSON.parse(JSON.stringify(data)); }
07867: 
07868: async function apiGetNetwork_(action, params={}, retries=2){
07869:   // PATCHED v2.1 - 45s + retry 2x dengan backoff, prioritas bootstrap
07870:   if(!WEB_APP_URL){ throw new Error('NO_URL'); }
07871:   if(!SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07872:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07873:   const qs = new URLSearchParams({action, ...params}).toString();
07874:   let lastErr=null;
07875:   for(let attempt=0; attempt<=retries; attempt++){
07876:     try{
07877:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07878:       const json = await parseApiResponse_(res);
07879:       if(!json.ok){
07880:         handleApiAuthFailure_(json.error || '', requestToken);
07881:         throw new Error(json.error || 'Gagal mengambil data');
07882:       }
07883:       return json.data;
07884:     }catch(e){
07885:       lastErr=e;
07886:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07887:       if(attempt<retries){
07888:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07889:       }
07890:     }
07891:   }
07892:   throw lastErr;
07893: }
07894: async function apiPost(payload){
07895:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07896:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
07897:   // saat koneksi belum dikonfigurasi tidak pernah ikut sinkron otomatis.
07898:   if(!WEB_APP_URL){
~~~

### Around line 7886
~~~text
07874:   let lastErr=null;
07875:   for(let attempt=0; attempt<=retries; attempt++){
07876:     try{
07877:       const res = await fetchWithTimeout_(WEB_APP_URL + '?' + qs, {headers:{Authorization:'Bearer '+requestToken}}, 45000);
07878:       const json = await parseApiResponse_(res);
07879:       if(!json.ok){
07880:         handleApiAuthFailure_(json.error || '', requestToken);
07881:         throw new Error(json.error || 'Gagal mengambil data');
07882:       }
07883:       return json.data;
07884:     }catch(e){
07885:       lastErr=e;
07886:       if(/FORBIDDEN|PERMISSION|UNKNOWN_ACTION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED|ACCOUNT_INACTIVE/.test(e.message||'')) throw e;
07887:       if(attempt<retries){
07888:         await new Promise(r=>setTimeout(r, 1200*(attempt+1)));
07889:       }
07890:     }
07891:   }
07892:   throw lastErr;
07893: }
07894: async function apiPost(payload){
07895:   // Tetap antrekan operasi tulis ketika URL belum tersedia. Sebelumnya
07896:   // fungsi berhenti sebelum masuk blok try/catch sehingga data yang dibuat
07897:   // saat koneksi belum dikonfigurasi tidak pernah ikut sinkron otomatis.
07898:   if(!WEB_APP_URL){
07899:     if(payload.action !== 'login') queueForSync_(payload);
07900:     throw new Error('NO_URL');
07901:   }
07902:   if(payload.action !== 'login' && !SESSION_TOKEN){ throw new Error('AUTH_REQUIRED'); }
07903:   const requestToken = (SETTING_AUTH_OK && SETTING_SESSION_TOKEN) ? SETTING_SESSION_TOKEN : SESSION_TOKEN;
07904:   const securedPayload = payload.action === 'login' ? payload : {...payload, sessionToken:requestToken};
07905:   try{
07906:     // text/plain menghindari CORS preflight ke Cloudflare
07907:     const requestBodyText = JSON.stringify(securedPayload);
07908:     // Cloudflare endpoint membatasi request 50 MB. Base64 lebih besar ±33%
07909:     // dari file asli, jadi hentikan lebih awal dengan pesan yang jelas alih-alih
07910:     // membiarkan upload putus dan record tersisa hanya filename.
07911:     if(new Blob([requestBodyText]).size > 45 * 1024 * 1024){
07912:       throw new Error('Total lampiran terlalu besar untuk satu kali simpan. Kurangi jumlah/ukuran file lalu coba lagi.');
07913:     }
07914:     const res = await fetchWithTimeout_(WEB_APP_URL, {
07915:       method: 'POST',
07916:       mode: 'cors',
07917:       credentials: 'same-origin',
07918:       redirect: 'follow',
07919:       cache: 'no-store',
07920:       headers: { 'Content-Type': 'text/plain;charset=utf-8' },
07921:       body: requestBodyText
07922:     }, 60000); // PATCHED: 60s untuk POST (upload file bisa lama)
07923:     const json = await parseApiResponse_(res);
07924:     if(!json.ok){
07925:       handleApiAuthFailure_(json.error || '', requestToken);
07926:       throw new Error(json.error || 'Gagal menyimpan data');
07927:     }
07928:     invalidatePreparedReads_();
07929:     setAppOnlineStatus(true);
07930:     return json;
07931:   }catch(err){
07932:     // Kegagalan level jaringan (offline/tidak terjangkau) -> antre untuk
07933:     // disinkron otomatis nanti begitu internet kembali. Kegagalan dari
07934:     // server (json.ok === false, misal validasi) TIDAK diantre karena
07935:     // request sudah benar-benar sampai & ditolak, bukan soal koneksi.
07936:     const isNetworkErr = err instanceof TypeError ||
07937:       /Failed to fetch|NetworkError|Load failed|Backend timeout|AbortError|aborted/i.test(err.message || '');
07938:     if(isNetworkErr){
07939:       queueForSync_(securedPayload);
07940:       setAppOnlineStatus(false);
07941:     }
07942:     throw err;
07943:   }
07944: }
07945: 
07946: /* ---------------- RBAC: PULIHKAN SESI SAAT REFRESH HALAMAN ----------------
07947:    CURRENT_USER (username/role) di-cache di localStorage supaya refresh
07948:    halaman ATAU membuka lagi file/tab-nya di browser yang sama tidak
07949:    memaksa login ulang. Permission & feature registry TETAP diambil ulang
07950:    dari code.gs (single source of truth) tiap kali, bukan dari cache,
~~~

### Around line 8626
~~~text
08614:     while(pending.length){
08615:       const action = pending.shift();
08616:       try{
08617:         data[action] = await apiGet(action, {}, 1);
08618:       }catch(e){
08619:         errors.push({action,message:String(e&&e.message||e)});
08620:       }
08621:       done++;
08622:       progress();
08623:     }
08624:   }));
08625: 
08626:   if(token !== SESSION_TOKEN) throw new Error('SESSION_INVALID');
08627: 
08628:   // Jangan biarkan satu modul opsional (KPI/Meeting/Energy/Report/dll)
08629:   // menggagalkan seluruh login. Yang wajib hanya bootstrap; pada backend
08630:   // legacy, machines+personil menjadi minimum kompatibilitas.
08631:   const criticalActions = hasBootstrap ? ['bootstrap'] : ['machines','personil'];
08632:   const fatal = errors.filter(e=>criticalActions.includes(e.action));
08633:   if(fatal.length){
08634:     throw new Error('Data dasar aplikasi gagal dimuat. Coba masuk kembali. '+fatal.map(e=>e.action+': '+e.message).join('; '));
08635:   }
08636: 
08637:   const bootstrap = (data.bootstrap && typeof data.bootstrap==='object') ? data.bootstrap : {};
08638:   const entriesSource = Array.isArray(data.list)
08639:     ? data.list
08640:     : (Array.isArray(bootstrap.recentEntries) ? bootstrap.recentEntries : (Array.isArray(bootstrap.entries) ? bootstrap.entries : []));
08641:   const machineSource = Array.isArray(data.machines)
08642:     ? data.machines
08643:     : (Array.isArray(bootstrap.machines) ? bootstrap.machines : []);
08644:   const personSource = Array.isArray(data.personil)
08645:     ? data.personil
08646:     : (Array.isArray(bootstrap.personil) ? bootstrap.personil : []);
08647:   const patrolTemplateSource = Array.isArray(data.patrolChecklistTemplate)
08648:     ? data.patrolChecklistTemplate
08649:     : (Array.isArray(bootstrap.patrolTemplate) ? bootstrap.patrolTemplate : []);
08650: 
08651:   for(const [name,value] of [['Logbook',entriesSource],['machines',machineSource],['personil',personSource],['patrol template',patrolTemplateSource]]){
08652:     if(!Array.isArray(value)) throw new Error('Format data '+name+' tidak valid.');
08653:   }
08654: 
08655:   // Simpan peringatan diagnostik tanpa memblokir user. Setiap view tetap
08656:   // punya sync/lazy render sendiri, sehingga endpoint opsional dapat pulih
08657:   // saat menu tersebut dibuka atau data dimuat ulang.
08658:   const optionalErrors = errors.filter(e=>!criticalActions.includes(e.action));
08659:   window.OMODOS_PREPARE_WARNINGS = optionalErrors.slice();
08660:   if(optionalErrors.length){
08661:     console.warn('[OMODOS] Persiapan parsial; modul opsional akan memakai fallback/lazy retry:', optionalErrors);
08662:   }
08663: 
08664:   // Keep prefetched responses fresh throughout hydration, even on slow connections.
08665:   READY_READS.forEach(value=>{value.time=Date.now();});
08666:   ENTRIES = entriesSource.slice().sort((a,b)=>new Date(b['Timestamp Input'])-new Date(a['Timestamp Input']));
08667:   MACHINES = machineSource.map(m=>({...m,'Kode Mesin':norm_(m['Kode Mesin']) ? String(m['Kode Mesin']).trim() : '', 'Nama Mesin':norm_(m['Nama Mesin']) ? String(m['Nama Mesin']).trim() : (norm_(m['Kode Mesin']) ? String(m['Kode Mesin']).trim() : 'Mesin tanpa nama')}));
08668:   PERSONIL = personSource;
08669:   PATROL_TEMPLATE = patrolTemplateSource;
08670:   HOME_PATROL_STATUS = Array.isArray(bootstrap.homePatrolLatest) ? bootstrap.homePatrolLatest.slice() : [];
08671: 
08672:   const tasks = [['predictiveReports',syncPmReportsFromBackend],['generalReports',syncGrReportsFromBackend],['ipalReports',syncIpalReportsFromBackend],['rcaReports',syncRcaReportsFromBackend],['kbEntries',loadKbEntries],['sparepartLokasi',syncSparepartLokasiFromBackend],['sparepartStatus',syncSparepartStatusFromBackend],['sparepartEta',syncSparepartEtaFromBackend],['sparepartWarehouse',syncSparepartWarehouseFromBackend],['sparepartOpname',syncSparepartOpnameFromBackend],['kpiKerjaList',syncKpiKerjaFromBackend],['kpiDepartmentData',syncKpiDepartmentData],['machineBreakdownList',loadMachineBreakdownList],['recordYtdList',loadRecordYtdList],['runHourComparisonList',loadRunHourComparisonList],['energyCostToeList',loadEnergyCostToeList],['correctiveReportList',loadCorrectiveReportList],['energyUtilityList',loadEnergyUtilityList],['analitikConfig',syncAnalitikConfigFromBackend],['patrolCategoryConfig',syncPatrolCategoryConfigFromBackend],['patrolGeneralChecklist',syncPatrolGeneralChecklistFromBackend],['piHardSkillStandard',piSyncHardSkillFromBackend],['piSoftskillAssessments',piSyncSoftskillFromBackend],['piPersonnelMaster',syncPiPersonnelMasterFromBackend]];
08673:   for(const [action,fn] of tasks){
08674:     if(Object.prototype.hasOwnProperty.call(data,action)){
08675:       try{ await fn(); }
08676:       catch(err){
08677:         window.OMODOS_PREPARE_WARNINGS.push({action,message:String(err&&err.message||err)});
08678:         console.warn('[OMODOS] Hydration opsional gagal:',action,err);
08679:       }
08680:     }
08681:   }
08682:   if(data.pmcFactoryProjects && data.pmcKaizens && data.pmcSgas){
08683:     try{ await pmcLoadAll(true); }catch(err){ window.OMODOS_PREPARE_WARNINGS.push({action:'project-center',message:String(err&&err.message||err)}); }
08684:   }
08685:   if(data.meetingList && data.meetingActionList){
08686:     try{ await mtgLoadAll(true); }catch(err){ window.OMODOS_PREPARE_WARNINGS.push({action:'meeting',message:String(err&&err.message||err)}); }
08687:   }
08688: 
08689:   populateMachineSelects();
08690:   engPopulateAreaSelect();
~~~

### Around line 24061
~~~text
24049:   const serverIds = new Set(serverRows.map(r=>String(r&&r.id||'')).filter(Boolean));
24050:   const missingLegacy = legacyLocal.filter(r=>r&&r.id&&r.nama&&!serverIds.has(String(r.id)));
24051:   for(const assessment of missingLegacy){
24052:     try{
24053:       await apiPost({
24054:         action:'savePiSoftskill',
24055:         assessment,
24056:         transactionId:'PI-SS-MIGRATE-'+String(assessment.id),
24057:         actor:(CURRENT_USER&&CURRENT_USER.username)||''
24058:       });
24059:       serverIds.add(String(assessment.id));
24060:     }catch(err){
24061:       if(/FORBIDDEN|PERMISSION|AUTH_REQUIRED|SESSION_INVALID|SESSION_EXPIRED/.test(String(err&&err.message||err))) break;
24062:       console.warn('[OMODOS] Soft Skill legacy migration tertunda:',assessment.id,err);
24063:       break;
24064:     }
24065:   }
24066:   return PI_SOFTSKILL_ASSESSMENTS;
24067: }
24068: async function savePiSoftskill(assessment){
24069:   if(!assessment||!assessment.nama) throw new Error('Data Soft Skill Assessment tidak valid.');
24070:   const id = assessment.id || ('ss_'+Date.now()+'_'+Math.random().toString(36).slice(2,8));
24071:   const record = {...assessment,id};
24072:   const current = piSoftskillMergeById_(PI_SOFTSKILL_ASSESSMENTS, loadPiSoftskillLocal_()).filter(r=>String(r&&r.id)!==String(id));
24073:   current.push(record);
24074:   PI_SOFTSKILL_ASSESSMENTS = current;
24075:   savePiSoftskillLocal_(current);
24076:   const transactionId = 'PI-SS-'+String(id);
24077:   try{
24078:     await apiPost({action:'savePiSoftskill',assessment:record,transactionId,actor:(CURRENT_USER&&CURRENT_USER.username)||''});
24079:     await piSyncSoftskillFromBackend();
24080:     return record;
24081:   }catch(err){
24082:     // apiPost otomatis memasukkan kegagalan jaringan ke offline sync queue.
24083:     // Cache lokal dipertahankan agar assessment tidak hilang saat perangkat offline.
24084:     if(/FORBIDDEN|PERMISSION|VALIDATION|UNKNOWN_ACTION/.test(String(err&&err.message||err))){
24085:       PI_SOFTSKILL_ASSESSMENTS = current.filter(r=>String(r&&r.id)!==String(id));
24086:       savePiSoftskillLocal_(PI_SOFTSKILL_ASSESSMENTS);
24087:     }
24088:     throw err;
24089:   }
24090: }
24091: 
24092: function piNormalizeName(name){
24093:   return String(name||'')
24094:     .toLowerCase()
24095:     .replace(/\([^)]*\)/g, ' ')
24096:     .replace(/[^a-z0-9]+/g, ' ')
24097:     .replace(/\b(pt|mr|mrs|ms|bpk|ibu|saudara|sdr|teknisi|operator|staff|supervisor|leader|group|admin)\b/g, ' ')
24098:     .replace(/\s+/g, ' ')
24099:     .trim();
24100: }
24101: function piNamesMatch(a,b){
24102:   const na = piNormalizeName(a);
24103:   const nb = piNormalizeName(b);
24104:   return !!na && !!nb && (na===nb || na.includes(nb) || nb.includes(na));
24105: }
24106: function piFindByName(list, nama, getter){
24107:   return (list||[]).find(item=> piNamesMatch(getter(item), nama)) || null;
24108: }
24109: function piFilterByName(list, nama, getter){
24110:   return (list||[]).filter(item=> piNamesMatch(getter(item), nama));
24111: }
24112: function piLatestByDate(list, getDate){
24113:   return (list||[]).slice().sort((a,b)=> new Date(getDate(b)||0) - new Date(getDate(a)||0))[0] || null;
24114: }
24115: 
24116: function piEmployeeList(){
24117:   const names = new Map();
24118:   // [EDIT] Sumber utama sekarang PI_PERSONNEL_MASTER (Master Personil khusus
24119:   // People Intelligent) — bukan lagi PERSONIL (Master Personil umum di menu
24120:   // Master Koneksi), supaya daftar personil di seluruh menu People
24121:   // Intelligent murni linkage ke data yang memang di-scope untuk PI saja.
24122:   // PERSONIL tetap dipertahankan sebagai fallback supaya nama yang cuma
24123:   // pernah dinilai lewat Soft/Hard Skill Assessment (belum ada di master
24124:   // manapun) tetap muncul.
24125:   try{ (PI_PERSONNEL_MASTER||[]).forEach(p=>{ if(p && p['Nama']) names.set(piNormalizeName(p['Nama']), p['Nama']); }); }catch(e){}
~~~

## APP_SESSION
No match.

## SESSION_TOKEN = null
No match.

## SESSION_TOKEN = ''
### Around line 6357
~~~text
06345:   }
06346:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06347:   return true;
06348: }
06349: function deactivateAccountDataCaches_(username){
06350:   let ownerId=accountCacheOwnerId_(username);
06351:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06352:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06353:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06354:   return true;
06355: }
06356: let CURRENT_USER = null;        // { username, role, displayName }
06357: let SESSION_TOKEN = '';
06358: let SESSION_EXPIRES_AT = '';
06359: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06360: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06361: try{
06362:   const cached = localStorage.getItem(SS_USER_KEY);
06363:   if(cached) CURRENT_USER = JSON.parse(cached);
06364:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06365:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06366:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06367:     CURRENT_USER = null;
06368:     SESSION_TOKEN = '';
06369:     SESSION_EXPIRES_AT = '';
06370:   }
06371:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06372:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06373:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06374:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06375: }catch(e){}
06376: try{
06377:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06378: }catch(e){
06379:   CURRENT_USER = null;
06380:   SESSION_TOKEN = '';
06381:   SESSION_EXPIRES_AT = '';
06382:   try{
06383:     localStorage.removeItem(SS_USER_KEY);
06384:     localStorage.removeItem(SS_TOKEN_KEY);
06385:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06386:   }catch(clearErr){}
06387: }
06388: function cacheRbacSession_(){
06389:   try{
06390:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06391:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06392:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06393:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06394:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06395:   }catch(e){}
06396: }
06397: 
06398: function hasPermission(permissionKey){
06399:   if(!CURRENT_USER) return false;
06400:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06401:   const p = PERMISSIONS[permissionKey];
06402:   return !!(p && p[CURRENT_USER.role]);
06403: }
06404: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06405: 
06406: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06407: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06408: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06409: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06410: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06411: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06412: function discoverFeatureRegistryFromDom(){
06413:   const seen = new Set();
06414:   const list = [];
06415:   const labelOf = (btn)=>{
06416:     const clone = btn.cloneNode(true);
06417:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06418:     return clone.textContent.replace(/\s+/g,' ').trim();
06419:   };
06420:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06421:     const view = btn.dataset.view;
~~~

### Around line 6368
~~~text
06356: let CURRENT_USER = null;        // { username, role, displayName }
06357: let SESSION_TOKEN = '';
06358: let SESSION_EXPIRES_AT = '';
06359: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06360: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06361: try{
06362:   const cached = localStorage.getItem(SS_USER_KEY);
06363:   if(cached) CURRENT_USER = JSON.parse(cached);
06364:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06365:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06366:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06367:     CURRENT_USER = null;
06368:     SESSION_TOKEN = '';
06369:     SESSION_EXPIRES_AT = '';
06370:   }
06371:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06372:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06373:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06374:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06375: }catch(e){}
06376: try{
06377:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06378: }catch(e){
06379:   CURRENT_USER = null;
06380:   SESSION_TOKEN = '';
06381:   SESSION_EXPIRES_AT = '';
06382:   try{
06383:     localStorage.removeItem(SS_USER_KEY);
06384:     localStorage.removeItem(SS_TOKEN_KEY);
06385:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06386:   }catch(clearErr){}
06387: }
06388: function cacheRbacSession_(){
06389:   try{
06390:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06391:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06392:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06393:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06394:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06395:   }catch(e){}
06396: }
06397: 
06398: function hasPermission(permissionKey){
06399:   if(!CURRENT_USER) return false;
06400:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06401:   const p = PERMISSIONS[permissionKey];
06402:   return !!(p && p[CURRENT_USER.role]);
06403: }
06404: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06405: 
06406: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06407: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06408: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06409: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06410: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06411: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06412: function discoverFeatureRegistryFromDom(){
06413:   const seen = new Set();
06414:   const list = [];
06415:   const labelOf = (btn)=>{
06416:     const clone = btn.cloneNode(true);
06417:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06418:     return clone.textContent.replace(/\s+/g,' ').trim();
06419:   };
06420:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06421:     const view = btn.dataset.view;
06422:     if(!view) return;
06423:     const key = 'view.' + view;
06424:     if(seen.has(key)) return;
06425:     seen.add(key);
06426:     const groupEl = btn.closest('.nav-group-collapsible');
06427:     let group = 'Umum';
06428:     if(groupEl){
06429:       const parentBtn = groupEl.querySelector('.nav-parent-btn');
06430:       if(parentBtn){ const g = labelOf(parentBtn); if(g) group = g; }
06431:     }
06432:     list.push({ PermissionKey:key, Label: labelOf(btn) || view, Group: group });
~~~

### Around line 6380
~~~text
06368:     SESSION_TOKEN = '';
06369:     SESSION_EXPIRES_AT = '';
06370:   }
06371:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06372:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06373:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06374:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06375: }catch(e){}
06376: try{
06377:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06378: }catch(e){
06379:   CURRENT_USER = null;
06380:   SESSION_TOKEN = '';
06381:   SESSION_EXPIRES_AT = '';
06382:   try{
06383:     localStorage.removeItem(SS_USER_KEY);
06384:     localStorage.removeItem(SS_TOKEN_KEY);
06385:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06386:   }catch(clearErr){}
06387: }
06388: function cacheRbacSession_(){
06389:   try{
06390:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06391:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06392:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06393:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06394:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06395:   }catch(e){}
06396: }
06397: 
06398: function hasPermission(permissionKey){
06399:   if(!CURRENT_USER) return false;
06400:   if(CURRENT_USER.role === 'Superadmin') return true; // selalu full access, tidak dapat dibatasi
06401:   const p = PERMISSIONS[permissionKey];
06402:   return !!(p && p[CURRENT_USER.role]);
06403: }
06404: function isSuperadmin(){ return !!CURRENT_USER && CURRENT_USER.role === 'Superadmin'; }
06405: 
06406: // ---- Sumber kebenaran fitur/menu: SELALU discan langsung dari sidebar
06407: // (dan grup collapsible-nya) yang sedang ada di DOM, bukan dari daftar
06408: // yang diketik manual. Dipakai di setiap titik yang mengisi FEATURE_REGISTRY
06409: // (login, restore sesi, buka Role Access Management) supaya menu apa pun —
06410: // baru, lama, atau belum sempat didaftarkan di backend — tetap otomatis
06411: // tergate oleh Role Access Management, tidak ada yang hardcoded/lolos.
06412: function discoverFeatureRegistryFromDom(){
06413:   const seen = new Set();
06414:   const list = [];
06415:   const labelOf = (btn)=>{
06416:     const clone = btn.cloneNode(true);
06417:     clone.querySelectorAll('.ico, .chev, .count, .ihc-desc').forEach(el=> el.remove());
06418:     return clone.textContent.replace(/\s+/g,' ').trim();
06419:   };
06420:   document.querySelectorAll('.sidebar .nav-btn[data-view]').forEach(btn=>{
06421:     const view = btn.dataset.view;
06422:     if(!view) return;
06423:     const key = 'view.' + view;
06424:     if(seen.has(key)) return;
06425:     seen.add(key);
06426:     const groupEl = btn.closest('.nav-group-collapsible');
06427:     let group = 'Umum';
06428:     if(groupEl){
06429:       const parentBtn = groupEl.querySelector('.nav-parent-btn');
06430:       if(parentBtn){ const g = labelOf(parentBtn); if(g) group = g; }
06431:     }
06432:     list.push({ PermissionKey:key, Label: labelOf(btn) || view, Group: group });
06433:   });
06434:   // Grup collapsible itu sendiri juga jadi "fitur" tergate-able (untuk
06435:   // menyembunyikan seluruh grup, bukan cuma item di dalamnya).
06436:   document.querySelectorAll('.sidebar .nav-group-collapsible[data-group-key]').forEach(g=>{
06437:     const gk = g.dataset.groupKey;
06438:     if(!gk) return;
06439:     const key = 'group.' + gk;
06440:     if(seen.has(key)) return;
06441:     seen.add(key);
06442:     const parentBtn = g.querySelector('.nav-parent-btn');
06443:     list.push({ PermissionKey:key, Label: (parentBtn ? labelOf(parentBtn) : gk) + ' (Grup)', Group: 'Grup Menu' });
06444:   });
~~~

### Around line 6644
~~~text
06632:    backend yang sama dengan login utama (action:'login' di code.gs),
06633:    yang mengembalikan role sebenarnya dari akun tsb.
06634: 
06635:    PENTING (perilaku akses Setting): kalau pengguna yang SEDANG login
06636:    memang ber-role Superadmin, menu ini langsung terbuka tanpa login
06637:    ulang. Kalau bukan, sistem meminta login dengan akun Superadmin lain
06638:    (step-up auth) khusus untuk membuka menu ini — status step-up ini
06639:    HANYA berlaku selama pengguna tetap berada di menu Setting, begitu
06640:    pindah menu otomatis di-reset (wajib login ulang tiap kembali). Ini
06641:    terpisah total dari koneksi Cloudflare (WEB_APP_URL) & dari
06642:    sesi login utama (CURRENT_USER), yang tidak ikut berubah/hilang. */
06643: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06644: let SETTING_SESSION_TOKEN = '';
06645: function isSettingAuthed(){
06646:   return SETTING_AUTH_OK === true || isSuperadmin();
06647: }
06648: function resetSettingAuth(){
06649:   const tokenToRevoke = SETTING_SESSION_TOKEN;
06650:   if(tokenToRevoke && WEB_APP_URL){
06651:     fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke})}).catch(()=>{});
06652:   }
06653:   SETTING_AUTH_OK = false;
06654:   SETTING_SESSION_TOKEN = '';
06655: }
06656: function showSettingLoginModal(onSuccess){
06657:   $('#modal-content').innerHTML = `
06658:     <div class="modal-head">
06659:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-lock-key"></i> Akses Master Mesin &amp; Koneksi</h2></div>
06660:       <button class="modal-close" id="btn-close-modal">✕</button>
06661:     </div>
06662:     <div style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Menu ini berisi data master &amp; koneksi database SQLite, khusus akun ber-role <b>Superadmin</b>. Masukkan username &amp; password akun Superadmin Anda untuk melanjutkan. Akses ini hanya berlaku selama Anda berada di menu ini — begitu pindah menu, Anda perlu memverifikasi ulang untuk masuk ke sini.</div>
06663:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06664:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06665:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06666:     <div style="margin-top:16px;display:flex;gap:10px;">
06667:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06668:     </div>
06669:   `;
06670:   $('#modal-bg').classList.add('active');
06671:   $('#btn-close-modal').addEventListener('click', closeModal);
06672:   const submit = async ()=>{
06673:     const u = $('#setting-login-username').value.trim();
06674:     const p = $('#setting-login-password').value;
06675:     const errEl = $('#setting-login-error');
06676:     const submitBtn = $('#btn-setting-login-submit');
06677:     errEl.style.display = 'none';
06678:     if(!u || !p) return;
06679:     if(!WEB_APP_URL){
06680:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App).';
06681:       errEl.style.display = 'block';
06682:       return;
06683:     }
06684:     submitBtn.disabled = true;
06685:     const originalLabel = submitBtn.innerHTML;
06686:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06687:     try{
06688:       const res = await fetchWithTimeout_(WEB_APP_URL, {
06689:         method: 'POST',
06690:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
06691:         body: JSON.stringify({ action: 'login', username: u, password: p })
06692:       }, 30000);
06693:       const json = await parseApiResponse_(res);
06694:       if(!json.ok || !json.user){
06695:         errEl.textContent = json.error || 'Username atau password salah.';
06696:         errEl.style.display = 'block';
06697:         return;
06698:       }
06699:       if(json.user.role !== 'Superadmin'){
06700:         if(json.sessionToken){
06701:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06702:         }
06703:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06704:         errEl.style.display = 'block';
06705:         return;
06706:       }
06707:       SETTING_AUTH_OK = true;
06708:       SETTING_SESSION_TOKEN = json.sessionToken || '';
~~~

### Around line 6654
~~~text
06642:    sesi login utama (CURRENT_USER), yang tidak ikut berubah/hilang. */
06643: let SETTING_AUTH_OK = false; // in-memory saja (bukan sessionStorage) -> reset tiap pindah menu
06644: let SETTING_SESSION_TOKEN = '';
06645: function isSettingAuthed(){
06646:   return SETTING_AUTH_OK === true || isSuperadmin();
06647: }
06648: function resetSettingAuth(){
06649:   const tokenToRevoke = SETTING_SESSION_TOKEN;
06650:   if(tokenToRevoke && WEB_APP_URL){
06651:     fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:tokenToRevoke})}).catch(()=>{});
06652:   }
06653:   SETTING_AUTH_OK = false;
06654:   SETTING_SESSION_TOKEN = '';
06655: }
06656: function showSettingLoginModal(onSuccess){
06657:   $('#modal-content').innerHTML = `
06658:     <div class="modal-head">
06659:       <div><h2 style="font-family:var(--font-display);margin:0;"><i class="ph-bold ph-lock-key"></i> Akses Master Mesin &amp; Koneksi</h2></div>
06660:       <button class="modal-close" id="btn-close-modal">✕</button>
06661:     </div>
06662:     <div style="font-size:12.5px;color:var(--text-dim);margin-bottom:14px;">Menu ini berisi data master &amp; koneksi database SQLite, khusus akun ber-role <b>Superadmin</b>. Masukkan username &amp; password akun Superadmin Anda untuk melanjutkan. Akses ini hanya berlaku selama Anda berada di menu ini — begitu pindah menu, Anda perlu memverifikasi ulang untuk masuk ke sini.</div>
06663:     <div class="field"><label>Username</label><input type="text" id="setting-login-username" autocomplete="username"></div>
06664:     <div class="field"><label>Password</label><input type="password" id="setting-login-password" autocomplete="current-password"></div>
06665:     <div id="setting-login-error" style="color:var(--red);font-size:12px;margin-top:4px;display:none;">Username/password salah, atau akun tersebut bukan Superadmin.</div>
06666:     <div style="margin-top:16px;display:flex;gap:10px;">
06667:       <button class="btn btn-sm btn-primary" id="btn-setting-login-submit"><i class="ph-bold ph-sign-in"></i> Masuk</button>
06668:     </div>
06669:   `;
06670:   $('#modal-bg').classList.add('active');
06671:   $('#btn-close-modal').addEventListener('click', closeModal);
06672:   const submit = async ()=>{
06673:     const u = $('#setting-login-username').value.trim();
06674:     const p = $('#setting-login-password').value;
06675:     const errEl = $('#setting-login-error');
06676:     const submitBtn = $('#btn-setting-login-submit');
06677:     errEl.style.display = 'none';
06678:     if(!u || !p) return;
06679:     if(!WEB_APP_URL){
06680:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App).';
06681:       errEl.style.display = 'block';
06682:       return;
06683:     }
06684:     submitBtn.disabled = true;
06685:     const originalLabel = submitBtn.innerHTML;
06686:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06687:     try{
06688:       const res = await fetchWithTimeout_(WEB_APP_URL, {
06689:         method: 'POST',
06690:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
06691:         body: JSON.stringify({ action: 'login', username: u, password: p })
06692:       }, 30000);
06693:       const json = await parseApiResponse_(res);
06694:       if(!json.ok || !json.user){
06695:         errEl.textContent = json.error || 'Username atau password salah.';
06696:         errEl.style.display = 'block';
06697:         return;
06698:       }
06699:       if(json.user.role !== 'Superadmin'){
06700:         if(json.sessionToken){
06701:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06702:         }
06703:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06704:         errEl.style.display = 'block';
06705:         return;
06706:       }
06707:       SETTING_AUTH_OK = true;
06708:       SETTING_SESSION_TOKEN = json.sessionToken || '';
06709:       closeModal();
06710:       if(onSuccess) onSuccess();
06711:     }catch(err){
06712:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06713:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06714:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06715:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06716:       errEl.style.display = 'block';
06717:     }finally{
06718:       submitBtn.disabled = false;
~~~

### Around line 8062
~~~text
08050:     return;
08051:   }
08052:   const tokenToRevoke = SESSION_TOKEN;
08053:   if(tokenToRevoke && WEB_APP_URL){
08054:     fetch(WEB_APP_URL, {
08055:       method:'POST',
08056:       headers:{'Content-Type':'text/plain;charset=utf-8'},
08057:       body:JSON.stringify({action:'logout', sessionToken:tokenToRevoke}),
08058:       keepalive:true
08059:     }).catch(()=>{});
08060:   }
08061:   CURRENT_USER = null;
08062:   SESSION_TOKEN = '';
08063:   SESSION_EXPIRES_AT = '';
08064:   PERMISSIONS = {};
08065:   FEATURE_REGISTRY = [];
08066:   try{ localStorage.removeItem(SS_USER_KEY); localStorage.removeItem(SS_TOKEN_KEY); localStorage.removeItem(SS_TOKEN_EXP_KEY); localStorage.removeItem(LS_PERM_KEY); localStorage.removeItem(LS_FEATURES_KEY); }catch(e){}
08067:   if(typeof resetSettingAuth === 'function') resetSettingAuth();
08068: 
08069:   const gate = document.getElementById('login-gate');
08070:   const appRoot = document.getElementById('app-root');
08071:   if(appRoot) appRoot.classList.remove('unlocked', 'dash-mode', 'menu-visible');
08072:   if(gate){
08073:     gate.style.display = '';
08074:     gate.style.opacity = '1';
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
~~~

## action:'login', username
No match.

## action: 'login', username
### Around line 6691
~~~text
06679:     if(!WEB_APP_URL){
06680:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App).';
06681:       errEl.style.display = 'block';
06682:       return;
06683:     }
06684:     submitBtn.disabled = true;
06685:     const originalLabel = submitBtn.innerHTML;
06686:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
06687:     try{
06688:       const res = await fetchWithTimeout_(WEB_APP_URL, {
06689:         method: 'POST',
06690:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
06691:         body: JSON.stringify({ action: 'login', username: u, password: p })
06692:       }, 30000);
06693:       const json = await parseApiResponse_(res);
06694:       if(!json.ok || !json.user){
06695:         errEl.textContent = json.error || 'Username atau password salah.';
06696:         errEl.style.display = 'block';
06697:         return;
06698:       }
06699:       if(json.user.role !== 'Superadmin'){
06700:         if(json.sessionToken){
06701:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06702:         }
06703:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06704:         errEl.style.display = 'block';
06705:         return;
06706:       }
06707:       SETTING_AUTH_OK = true;
06708:       SETTING_SESSION_TOKEN = json.sessionToken || '';
06709:       closeModal();
06710:       if(onSuccess) onSuccess();
06711:     }catch(err){
06712:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06713:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06714:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06715:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06716:       errEl.style.display = 'block';
06717:     }finally{
06718:       submitBtn.disabled = false;
06719:       submitBtn.innerHTML = originalLabel;
06720:     }
06721:   };
06722:   $('#btn-setting-login-submit').addEventListener('click', submit);
06723:   $('#setting-login-password').addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ ev.preventDefault(); submit(); } });
06724:   setTimeout(()=> $('#setting-login-username') && $('#setting-login-username').focus(), 50);
06725: }
06726: 
06727: /* ======================================================================
06728:    [RBAC] USER MANAGEMENT & ROLE ACCESS MANAGEMENT (khusus Superadmin)
06729:    ----------------------------------------------------------------------
06730:    Mengikuti pola render-ke-container yang sudah dipakai di menu Setting
06731:    lain (renderMachineTable, renderPersonilTable, dst). Semua data
06732:    (user, role, permission) diambil & disimpan lewat code.gs — frontend
06733:    di sini hanya UI, tidak menyimpan apa pun secara lokal.
06734:    ====================================================================== */
06735: function renderRbacAdminSection(){
06736:   const holder = $('#rbac-admin-section');
06737:   if(!holder) return;
06738:   if(!isSettingAuthed()){ holder.innerHTML = ''; return; }
06739:   holder.innerHTML = `
06740:     <div class="card" style="margin-bottom:18px;">
06741:       <div class="section-title"><i class="ph-bold ph-users"></i> User Management <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
06742:       <div class="sub" style="margin-bottom:12px;">Kelola akun aplikasi tanpa bercampur dengan pengaturan role. Setiap aktivitas user dicatat ke Audit Log terpusat.</div>
06743:       <div class="grid3">
06744:         <div class="field"><label>Username</label><input type="text" id="ru-username" placeholder="cth: budi.santoso" autocomplete="off"></div>
06745:         <div class="field"><label>Nama Tampilan</label><input type="text" id="ru-displayname" placeholder="cth: Budi Santoso"></div>
06746:         <div class="field"><label>Role</label>
06747:           <select id="ru-role">
06748:             <option value="Technician">Technician</option>
06749:             <option value="Supervisor">Supervisor</option>
06750:             <option value="Superadmin">Superadmin</option>
06751:           </select>
06752:         </div>
06753:       </div>
06754:       <div class="field"><label>Password (min. 6 karakter)</label><input type="password" id="ru-password" placeholder="Password awal" autocomplete="new-password"></div>
06755:       <button class="btn btn-sm btn-primary" id="btn-add-user"><i class="ph-bold ph-user-plus"></i> Tambah User</button>
~~~

### Around line 21189
~~~text
21177:     if(!WEB_APP_URL){
21178:       errEl.textContent = 'Aplikasi belum terhubung ke database SQLite (URL Web App). Hubungi Superadmin untuk konfigurasi awal.';
21179:       return;
21180:     }
21181: 
21182:     submitBtn.disabled = true;
21183:     const originalLabel = submitBtn.innerHTML;
21184:     submitBtn.innerHTML = '<i class="ph-bold ph-circle-notch ph-spin"></i> Memeriksa...';
21185:     try{
21186:       const res = await fetchWithTimeout_(WEB_APP_URL, {
21187:         method: 'POST',
21188:         headers: { 'Content-Type': 'text/plain;charset=utf-8' },
21189:         body: JSON.stringify({ action: 'login', username: u, password: p })
21190:       }, 30000);
21191:       const json = await parseApiResponse_(res);
21192:       if(!json.ok){
21193:         errEl.textContent = json.error || 'Username atau password salah. Silakan coba lagi.';
21194:         const box = document.querySelector('.login-box');
21195:         box.style.animation = 'none';
21196:         void box.offsetWidth;
21197:         box.style.animation = 'modalIn 320ms cubic-bezier(.4,0,.2,1)';
21198:         return;
21199:       }
21200:       if(!json.sessionToken){
21201:         throw new Error('Backend Cloudflare masih versi lama. Deploy ulang FinalOMODOSRilis.gs terbaru, lalu gunakan URL /exec deployment tersebut.');
21202:       }
21203:       invalidatePreparedReads_();
21204:       activateAccountDataCaches_(json.user&&json.user.username,{claimExisting:false});
21205:       CURRENT_USER = json.user;
21206:       SESSION_TOKEN = json.sessionToken || '';
21207:       SESSION_EXPIRES_AT = json.expiresAt || '';
21208:       PERMISSIONS = json.permissions || {};
21209:       // Gabungkan daftar dari backend dengan hasil scan DOM sidebar saat ini,
21210:       // supaya menu apa pun (baru/lama, terdaftar di code.gs atau tidak)
21211:       // SELALU tergate oleh Role Access Management — tidak ada yang lolos
21212:       // tampil begitu saja hanya karena belum sempat didaftarkan manual.
21213:       FEATURE_REGISTRY = (typeof window.mergeFeatureRegistry === 'function')
21214:         ? window.mergeFeatureRegistry(json.features || [])
21215:         : (json.features || []);
21216:       try{ cacheRbacSession_(); }catch(e){}
21217:       applyRbacToUi();
21218:       // [FIX] Sinkronkan matrix Tampilan Sederhana dari backend (kalau sudah
21219:       // tersedia -- lihat handleSaveLcPermissions_/getLcPermissionMatrix_ di
21220:       // code.gs) supaya perubahan yang diatur Superadmin di satu device ikut
21221:       // berlaku untuk user lain, bukan cuma tersimpan lokal di browser yang
21222:       // dipakai mengatur. Backend lama yang belum di-deploy ulang cukup tidak
21223:       // mengirim field ini (undefined) -- fallback ke localStorage yang sudah
21224:       // dimuat lebih awal, tidak menimbulkan error.
21225:       if(json.lcPermissions && Object.keys(json.lcPermissions).length && typeof lcPermsSaveLocal === 'function'){
21226:         window.LC_PERMISSIONS = json.lcPermissions;
21227:         lcPermsSaveLocal(json.lcPermissions);
21228:         if(typeof applyLcPermissionsToUi === 'function') applyLcPermissionsToUi();
21229:       }
21230:       // Tema preferensi user (code.gs) menang atas localStorage kalau ada
21231:       // & berbeda dari yang sedang aktif, tanpa reload halaman.
21232:       if(json.user.themePref && json.user.themePref !== document.documentElement.getAttribute('data-theme')){
21233:         setAppTheme(json.user.themePref, { persist:false });
21234:       } else {
21235:         renderThemeManager();
21236:       }
21237:       // Gaya tampilan (bentuk) preferensi user, kalau backend sudah punya
21238:       // field stylePref. Kalau belum ada, fallback ke localStorage yang
21239:       // sudah diterapkan lebih awal di <head> — tidak menimbulkan error.
21240:       if(json.user.stylePref && json.user.stylePref !== (document.documentElement.getAttribute('data-style') || 'klasik')){
21241:         setAppStyle(json.user.stylePref, { persist:false });
21242:       } else {
21243:         renderStyleManager();
21244:       }
21245:       // [FIX] Splash screen "Menyiapkan Data...": jangan langsung buka Home
21246:       // begitu login sukses. login-gate disembunyikan LANGSUNG (tanpa fade,
21247:       // supaya tidak ada celah user melihat Home kosong di baliknya), lalu
21248:       // splash tampil menutupi layar SAMBIL loadAll() menyiapkan seluruh
21249:       // data (termasuk logbook) di belakang layar. Home/app-root baru
21250:       // dibuka setelah data benar-benar siap.
21251:       gate.style.display = 'none';
21252:       const splash = document.getElementById('app-splash');
21253:       const splashText = document.getElementById('app-splash-text');
~~~

## login-gate
### Around line 252
~~~text
00240: html:not([data-theme="red-black"]) .btn-primary{
00241:   background:var(--red) !important; box-shadow:none !important; color:#fff !important;
00242: }
00243: html:not([data-theme="red-black"]) .btn-primary:hover{
00244:   filter:brightness(1.08) !important; box-shadow:none !important;
00245: }
00246: html:not([data-theme="red-black"]) .card:hover{
00247:   border-color:var(--line) !important; box-shadow:0 6px 20px -12px rgba(0,0,0,.25) !important;
00248: }
00249: html:not([data-theme="red-black"]) .card::before{
00250:   background:linear-gradient(90deg, transparent, var(--line), transparent) !important; opacity:1 !important;
00251: }
00252: html:not([data-theme="red-black"]) #login-gate{
00253:   background:var(--bg) !important;
00254: }
00255: html:not([data-theme="red-black"]) #login-gate::before,
00256: html:not([data-theme="red-black"]) #login-gate::after{
00257:   display:none !important;
00258: }
00259: html:not([data-theme="red-black"]) .login-box{
00260:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
00261:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00262: }
00263: 
00264: /* ===================================================================
00265:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00266:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00267:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00268:    karena tidak dipakai lagi.
00269:    =================================================================== */
00270: 
00271: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00272:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00273: html[data-theme="omodos"]{
00274:   --bg:#eef0f3; --bg-grid:#e4e7eb; --panel:#ffffff; --panel-2:#f6f7f9;
00275:   --panel-glass:rgba(255,255,255,.9); --line:#dfe2e7; --line-soft:#ebedf0;
00276:   --text:#12141a; --text-dim:#5b6472;
00277:   --red:#7c1420; --red-dim:#f0d5d8; --red-glow:rgba(124,20,32,.14);
00278:   --amber:#8a5a00; --amber-dim:#f0ddb0; --green:#146c43; --green-dim:#c9e8d7;
00279:   --blue:#00AEEF; --holo-2:#8a3a34; --holo-3:#5c130d;
00280:   --focus-ring:#0b5fae;
00281:   --on-accent:#ffffff;
00282: }
00283: 
00284: /* Abu Profesional (Slate Gray) — aksen warna BIRU, bukan merah. */
00285: html[data-theme="abu-profesional"]{
00286:   --bg:#eef0f2; --bg-grid:#e2e5e9; --panel:#ffffff; --panel-2:#e3e6ea;
00287:   --panel-glass:rgba(255,255,255,.9); --line:#b7bcc3; --line-soft:#d6dade;
00288:   --text:#1a1d21; --text-dim:#4d525a;
00289:   --red:#1a4fa0; --red-dim:#cddced; --red-glow:rgba(26,79,160,.18);
00290:   --amber:#7a5200; --amber-dim:#efdcae; --green:#1b6b45; --green-dim:#cae6d6;
00291:   --blue:#1a4fa0; --holo-2:#3a6ea5; --holo-3:#0d3a73;
00292:   --focus-ring:#1a4fa0;
00293:   --on-accent:#ffffff;
00294: }
00295: 
00296: /* Dark (red-black) — aksen warna HITAM & ABU, tanpa merah. */
00297: html[data-theme="red-black"]{
00298:   --red:#a6acb5; --red-dim:#33373c; --red-glow:rgba(166,172,181,.20);
00299:   --holo-2:#c7cbd1; --holo-3:#5b6068;
00300:   --focus-ring:#a6acb5;
00301: }
00302: 
00303: /* ===================================================================
00304:    [STYLE MANAGER] "Gaya Tampilan Aplikasi" — TERPISAH dari Theme Manager
00305:    (palet warna). Theme Manager (html[data-theme]) hanya mengatur WARNA.
00306:    Style Manager (html[data-style]) mengatur BENTUK: sudut card/tombol/
00307:    input/badge, jenis font, ketebalan border, efek bayangan, tekstur
00308:    latar, hingga bentuk sidebar & topbar — TANPA mengubah variabel warna
00309:    sama sekali, supaya kombinasi bebas: gaya apa pun + palet warna apa
00310:    pun dari Theme Manager yang sudah ada. Menambah gaya baru cukup
00311:    tambah satu entri STYLE_REGISTRY (skrip) + satu blok
00312:    `html[data-style="key"]{...}` di sini.
00313:    Selector `[class*="card"]`, `[class*="chip"]`, `[class*="badge"]`,
00314:    `[class*="pill"]`, `[class*="box"]` dipakai supaya efek bentuk
00315:    menjangkau SELURUH modul aplikasi (Logbook, Report, Analitik, People
00316:    Intelligence, dst) tanpa perlu menulis ulang tiap class satu-satu. */
~~~

### Around line 255
~~~text
00243: html:not([data-theme="red-black"]) .btn-primary:hover{
00244:   filter:brightness(1.08) !important; box-shadow:none !important;
00245: }
00246: html:not([data-theme="red-black"]) .card:hover{
00247:   border-color:var(--line) !important; box-shadow:0 6px 20px -12px rgba(0,0,0,.25) !important;
00248: }
00249: html:not([data-theme="red-black"]) .card::before{
00250:   background:linear-gradient(90deg, transparent, var(--line), transparent) !important; opacity:1 !important;
00251: }
00252: html:not([data-theme="red-black"]) #login-gate{
00253:   background:var(--bg) !important;
00254: }
00255: html:not([data-theme="red-black"]) #login-gate::before,
00256: html:not([data-theme="red-black"]) #login-gate::after{
00257:   display:none !important;
00258: }
00259: html:not([data-theme="red-black"]) .login-box{
00260:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
00261:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00262: }
00263: 
00264: /* ===================================================================
00265:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00266:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00267:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00268:    karena tidak dipakai lagi.
00269:    =================================================================== */
00270: 
00271: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00272:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00273: html[data-theme="omodos"]{
00274:   --bg:#eef0f3; --bg-grid:#e4e7eb; --panel:#ffffff; --panel-2:#f6f7f9;
00275:   --panel-glass:rgba(255,255,255,.9); --line:#dfe2e7; --line-soft:#ebedf0;
00276:   --text:#12141a; --text-dim:#5b6472;
00277:   --red:#7c1420; --red-dim:#f0d5d8; --red-glow:rgba(124,20,32,.14);
00278:   --amber:#8a5a00; --amber-dim:#f0ddb0; --green:#146c43; --green-dim:#c9e8d7;
00279:   --blue:#00AEEF; --holo-2:#8a3a34; --holo-3:#5c130d;
00280:   --focus-ring:#0b5fae;
00281:   --on-accent:#ffffff;
00282: }
00283: 
00284: /* Abu Profesional (Slate Gray) — aksen warna BIRU, bukan merah. */
00285: html[data-theme="abu-profesional"]{
00286:   --bg:#eef0f2; --bg-grid:#e2e5e9; --panel:#ffffff; --panel-2:#e3e6ea;
00287:   --panel-glass:rgba(255,255,255,.9); --line:#b7bcc3; --line-soft:#d6dade;
00288:   --text:#1a1d21; --text-dim:#4d525a;
00289:   --red:#1a4fa0; --red-dim:#cddced; --red-glow:rgba(26,79,160,.18);
00290:   --amber:#7a5200; --amber-dim:#efdcae; --green:#1b6b45; --green-dim:#cae6d6;
00291:   --blue:#1a4fa0; --holo-2:#3a6ea5; --holo-3:#0d3a73;
00292:   --focus-ring:#1a4fa0;
00293:   --on-accent:#ffffff;
00294: }
00295: 
00296: /* Dark (red-black) — aksen warna HITAM & ABU, tanpa merah. */
00297: html[data-theme="red-black"]{
00298:   --red:#a6acb5; --red-dim:#33373c; --red-glow:rgba(166,172,181,.20);
00299:   --holo-2:#c7cbd1; --holo-3:#5b6068;
00300:   --focus-ring:#a6acb5;
00301: }
00302: 
00303: /* ===================================================================
00304:    [STYLE MANAGER] "Gaya Tampilan Aplikasi" — TERPISAH dari Theme Manager
00305:    (palet warna). Theme Manager (html[data-theme]) hanya mengatur WARNA.
00306:    Style Manager (html[data-style]) mengatur BENTUK: sudut card/tombol/
00307:    input/badge, jenis font, ketebalan border, efek bayangan, tekstur
00308:    latar, hingga bentuk sidebar & topbar — TANPA mengubah variabel warna
00309:    sama sekali, supaya kombinasi bebas: gaya apa pun + palet warna apa
00310:    pun dari Theme Manager yang sudah ada. Menambah gaya baru cukup
00311:    tambah satu entri STYLE_REGISTRY (skrip) + satu blok
00312:    `html[data-style="key"]{...}` di sini.
00313:    Selector `[class*="card"]`, `[class*="chip"]`, `[class*="badge"]`,
00314:    `[class*="pill"]`, `[class*="box"]` dipakai supaya efek bentuk
00315:    menjangkau SELURUH modul aplikasi (Logbook, Report, Analitik, People
00316:    Intelligence, dst) tanpa perlu menulis ulang tiap class satu-satu. */
00317: 
00318: html[data-style] [class*="card"]:not(.theme-card):not(.style-card):not(.dash-card),
00319: html[data-style] [class*="chip"],
~~~

### Around line 256
~~~text
00244:   filter:brightness(1.08) !important; box-shadow:none !important;
00245: }
00246: html:not([data-theme="red-black"]) .card:hover{
00247:   border-color:var(--line) !important; box-shadow:0 6px 20px -12px rgba(0,0,0,.25) !important;
00248: }
00249: html:not([data-theme="red-black"]) .card::before{
00250:   background:linear-gradient(90deg, transparent, var(--line), transparent) !important; opacity:1 !important;
00251: }
00252: html:not([data-theme="red-black"]) #login-gate{
00253:   background:var(--bg) !important;
00254: }
00255: html:not([data-theme="red-black"]) #login-gate::before,
00256: html:not([data-theme="red-black"]) #login-gate::after{
00257:   display:none !important;
00258: }
00259: html:not([data-theme="red-black"]) .login-box{
00260:   border:1px solid var(--line) !important; box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
00261:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
00262: }
00263: 
00264: /* ===================================================================
00265:    TEMA (Theme Manager): hanya tema yang benar-benar dipakai di
00266:    THEME_REGISTRY — omodos (default terang), red-black (dark), dan
00267:    abu-profesional. Tema lain yang sebelumnya ada di sini sudah dihapus
00268:    karena tidak dipakai lagi.
00269:    =================================================================== */
00270: 
00271: /* OMODOS (Light Neutral) — tema default aplikasi, mengikuti identitas
00272:    brand OMODOS: terang, bersih, tanpa efek glow/blur. */
00273: html[data-theme="omodos"]{
00274:   --bg:#eef0f3; --bg-grid:#e4e7eb; --panel:#ffffff; --panel-2:#f6f7f9;
00275:   --panel-glass:rgba(255,255,255,.9); --line:#dfe2e7; --line-soft:#ebedf0;
00276:   --text:#12141a; --text-dim:#5b6472;
00277:   --red:#7c1420; --red-dim:#f0d5d8; --red-glow:rgba(124,20,32,.14);
00278:   --amber:#8a5a00; --amber-dim:#f0ddb0; --green:#146c43; --green-dim:#c9e8d7;
00279:   --blue:#00AEEF; --holo-2:#8a3a34; --holo-3:#5c130d;
00280:   --focus-ring:#0b5fae;
00281:   --on-accent:#ffffff;
00282: }
00283: 
00284: /* Abu Profesional (Slate Gray) — aksen warna BIRU, bukan merah. */
00285: html[data-theme="abu-profesional"]{
00286:   --bg:#eef0f2; --bg-grid:#e2e5e9; --panel:#ffffff; --panel-2:#e3e6ea;
00287:   --panel-glass:rgba(255,255,255,.9); --line:#b7bcc3; --line-soft:#d6dade;
00288:   --text:#1a1d21; --text-dim:#4d525a;
00289:   --red:#1a4fa0; --red-dim:#cddced; --red-glow:rgba(26,79,160,.18);
00290:   --amber:#7a5200; --amber-dim:#efdcae; --green:#1b6b45; --green-dim:#cae6d6;
00291:   --blue:#1a4fa0; --holo-2:#3a6ea5; --holo-3:#0d3a73;
00292:   --focus-ring:#1a4fa0;
00293:   --on-accent:#ffffff;
00294: }
00295: 
00296: /* Dark (red-black) — aksen warna HITAM & ABU, tanpa merah. */
00297: html[data-theme="red-black"]{
00298:   --red:#a6acb5; --red-dim:#33373c; --red-glow:rgba(166,172,181,.20);
00299:   --holo-2:#c7cbd1; --holo-3:#5b6068;
00300:   --focus-ring:#a6acb5;
00301: }
00302: 
00303: /* ===================================================================
00304:    [STYLE MANAGER] "Gaya Tampilan Aplikasi" — TERPISAH dari Theme Manager
00305:    (palet warna). Theme Manager (html[data-theme]) hanya mengatur WARNA.
00306:    Style Manager (html[data-style]) mengatur BENTUK: sudut card/tombol/
00307:    input/badge, jenis font, ketebalan border, efek bayangan, tekstur
00308:    latar, hingga bentuk sidebar & topbar — TANPA mengubah variabel warna
00309:    sama sekali, supaya kombinasi bebas: gaya apa pun + palet warna apa
00310:    pun dari Theme Manager yang sudah ada. Menambah gaya baru cukup
00311:    tambah satu entri STYLE_REGISTRY (skrip) + satu blok
00312:    `html[data-style="key"]{...}` di sini.
00313:    Selector `[class*="card"]`, `[class*="chip"]`, `[class*="badge"]`,
00314:    `[class*="pill"]`, `[class*="box"]` dipakai supaya efek bentuk
00315:    menjangkau SELURUH modul aplikasi (Logbook, Report, Analitik, People
00316:    Intelligence, dst) tanpa perlu menulis ulang tiap class satu-satu. */
00317: 
00318: html[data-style] [class*="card"]:not(.theme-card):not(.style-card):not(.dash-card),
00319: html[data-style] [class*="chip"],
00320: html[data-style] [class*="badge"],
~~~

### Around line 2371
~~~text
02359:   opacity:.55;transition:opacity var(--trans);pointer-events:none;
02360: }
02361: .card:hover::before{opacity:1;}
02362: .section-title{position:relative;}
02363: .section-title::after{content:"";flex:1;height:1px;background:linear-gradient(90deg, var(--line), transparent);margin-left:6px;}
02364: 
02365: .nav-btn.active::after{
02366:   content:"";position:absolute;right:8px;top:50%;transform:translateY(-50%);
02367:   width:5px;height:5px;background:var(--red);box-shadow:0 0 6px 2px var(--red-glow);
02368:   clip-path:polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
02369: }
02370: 
02371: #login-gate{
02372:   position:fixed;inset:0;z-index:1000;
02373:   display:flex;align-items:center;justify-content:center;
02374:   background:
02375:     radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--red) 10%, transparent), transparent 45%),
02376:     radial-gradient(circle at 85% 85%, rgba(184,16,42,.10), transparent 40%),
02377:     linear-gradient(color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02378:     linear-gradient(90deg, color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02379:     var(--bg);
02380:   background-size:auto,auto,38px 38px,38px 38px;
02381:   padding:20px;
02382: }
02383: #login-gate::before{
02384:   content:"";position:absolute;inset:0;pointer-events:none;
02385:   background:repeating-linear-gradient(0deg, color-mix(in srgb, var(--red) 3%, transparent) 0px, color-mix(in srgb, var(--red) 3%, transparent) 1px, transparent 1px, transparent 3px);
02386:   mix-blend-mode:overlay;
02387: }
02388: #login-gate::after{
02389:   content:"";position:absolute;inset:0;pointer-events:none;
02390:   background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--red) 18%, transparent), transparent 55%);
02391:   animation:loginGlow 10s ease-in-out infinite;
02392: }
02393: @keyframes loginGlow{0%,100%{opacity:.5;}50%{opacity:1;}}
02394: .login-box{
02395:   position:relative;width:100%;max-width:380px;
02396:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
02397:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02398:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02399:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02400:   text-align:center;
02401: }
02402: @keyframes holoBorderPulse{
02403:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02404:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02405: }
02406: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02407:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02408:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02409:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02410: }
02411: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02412:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02413:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02414:   animation:hexSpinCounter 10s linear infinite;}
02415: .login-box h1{
02416:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02417:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02418:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02419:   text-transform:uppercase;
02420: }
02421: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02422: .login-box .field{text-align:left;margin-bottom:16px;}
02423: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02424: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02425: .login-box .login-err{
02426:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02427: }
02428: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02429: 
02430: /* =====================================================================
02431:    OMODOS BRAND IDENTITY
02432:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02433:    and stay consistent regardless of the active color theme / visual
02434:    style, so all the shape/animation rules that other themes apply to
02435:    .mark / .i40-hex are neutralized here with !important.
~~~

### Around line 2383
~~~text
02371: #login-gate{
02372:   position:fixed;inset:0;z-index:1000;
02373:   display:flex;align-items:center;justify-content:center;
02374:   background:
02375:     radial-gradient(circle at 20% 15%, color-mix(in srgb, var(--red) 10%, transparent), transparent 45%),
02376:     radial-gradient(circle at 85% 85%, rgba(184,16,42,.10), transparent 40%),
02377:     linear-gradient(color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02378:     linear-gradient(90deg, color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02379:     var(--bg);
02380:   background-size:auto,auto,38px 38px,38px 38px;
02381:   padding:20px;
02382: }
02383: #login-gate::before{
02384:   content:"";position:absolute;inset:0;pointer-events:none;
02385:   background:repeating-linear-gradient(0deg, color-mix(in srgb, var(--red) 3%, transparent) 0px, color-mix(in srgb, var(--red) 3%, transparent) 1px, transparent 1px, transparent 3px);
02386:   mix-blend-mode:overlay;
02387: }
02388: #login-gate::after{
02389:   content:"";position:absolute;inset:0;pointer-events:none;
02390:   background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--red) 18%, transparent), transparent 55%);
02391:   animation:loginGlow 10s ease-in-out infinite;
02392: }
02393: @keyframes loginGlow{0%,100%{opacity:.5;}50%{opacity:1;}}
02394: .login-box{
02395:   position:relative;width:100%;max-width:380px;
02396:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
02397:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02398:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02399:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02400:   text-align:center;
02401: }
02402: @keyframes holoBorderPulse{
02403:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02404:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02405: }
02406: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02407:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02408:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02409:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02410: }
02411: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02412:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02413:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02414:   animation:hexSpinCounter 10s linear infinite;}
02415: .login-box h1{
02416:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02417:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02418:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02419:   text-transform:uppercase;
02420: }
02421: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02422: .login-box .field{text-align:left;margin-bottom:16px;}
02423: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02424: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02425: .login-box .login-err{
02426:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02427: }
02428: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02429: 
02430: /* =====================================================================
02431:    OMODOS BRAND IDENTITY
02432:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02433:    and stay consistent regardless of the active color theme / visual
02434:    style, so all the shape/animation rules that other themes apply to
02435:    .mark / .i40-hex are neutralized here with !important.
02436:    ===================================================================== */
02437: .omodos-logo{
02438:   background:none !important;box-shadow:none !important;clip-path:none !important;
02439:   border-radius:0 !important;animation:none !important;
02440:   display:flex !important;align-items:center;justify-content:center;
02441: }
02442: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02443:   background:none !important;color:inherit !important;
02444: }
02445: .omodos-logo span{display:none !important;}
02446: .omodos-logo-svg{width:100%;height:100%;display:block;}
02447: .brand .mark.omodos-logo{width:38px;height:38px;}
~~~

### Around line 2388
~~~text
02376:     radial-gradient(circle at 85% 85%, rgba(184,16,42,.10), transparent 40%),
02377:     linear-gradient(color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02378:     linear-gradient(90deg, color-mix(in srgb, var(--red) 6%, transparent) 1px, transparent 1px),
02379:     var(--bg);
02380:   background-size:auto,auto,38px 38px,38px 38px;
02381:   padding:20px;
02382: }
02383: #login-gate::before{
02384:   content:"";position:absolute;inset:0;pointer-events:none;
02385:   background:repeating-linear-gradient(0deg, color-mix(in srgb, var(--red) 3%, transparent) 0px, color-mix(in srgb, var(--red) 3%, transparent) 1px, transparent 1px, transparent 3px);
02386:   mix-blend-mode:overlay;
02387: }
02388: #login-gate::after{
02389:   content:"";position:absolute;inset:0;pointer-events:none;
02390:   background:radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--red) 18%, transparent), transparent 55%);
02391:   animation:loginGlow 10s ease-in-out infinite;
02392: }
02393: @keyframes loginGlow{0%,100%{opacity:.5;}50%{opacity:1;}}
02394: .login-box{
02395:   position:relative;width:100%;max-width:380px;
02396:   background:linear-gradient(180deg, var(--panel-2) 0%, var(--panel) 100%);
02397:   border:1px solid color-mix(in srgb, var(--red) 30%, transparent);border-radius:16px;padding:34px 30px 28px 30px;
02398:   box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 50px -8px var(--red-glow);
02399:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1), holoBorderPulse 4s ease-in-out infinite;
02400:   text-align:center;
02401: }
02402: @keyframes holoBorderPulse{
02403:   0%,100%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 15%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 40px -8px var(--red-glow);}
02404:   50%{box-shadow:0 0 0 1px color-mix(in srgb, var(--red) 30%, transparent) inset, 0 24px 70px rgba(0,0,0,.6), 0 0 65px -6px var(--red-glow);}
02405: }
02406: .login-box .i40-hex{width:64px;height:64px;margin:0 auto 16px auto;
02407:   background:conic-gradient(from 0deg, var(--red), var(--amber), var(--green), var(--blue), var(--red));
02408:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02409:   display:flex;align-items:center;justify-content:center;animation:hexSpin 10s linear infinite;
02410: }
02411: .login-box .i40-hex span{background:var(--bg);width:50px;height:50px;
02412:   clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
02413:   display:flex;align-items:center;justify-content:center;font-family:var(--font-brand);font-weight:900;font-size:18px;color:var(--text);
02414:   animation:hexSpinCounter 10s linear infinite;}
02415: .login-box h1{
02416:   font-family:var(--font-brand);font-size:17px;font-weight:800;letter-spacing:1.4px;margin:0 0 4px 0;
02417:   background:linear-gradient(90deg,#fff,var(--red),#fff);background-size:200% auto;
02418:   -webkit-background-clip:text;background-clip:text;color:transparent;animation:brandShine 5s linear infinite;
02419:   text-transform:uppercase;
02420: }
02421: .login-box .sub-title{font-size:11.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.6px;margin-bottom:26px;text-transform:uppercase;}
02422: .login-box .field{text-align:left;margin-bottom:16px;}
02423: .login-box .field label{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.8px;text-transform:uppercase;}
02424: .login-box .btn-primary{width:100%;justify-content:center;padding:11px 16px;font-family:var(--font-display);letter-spacing:.6px;font-size:14px;margin-top:6px;}
02425: .login-box .login-err{
02426:   font-size:12px;color:var(--red);font-family:var(--font-mono);margin-top:12px;min-height:16px;
02427: }
02428: .login-box .login-foot{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);letter-spacing:.4px;}
02429: 
02430: /* =====================================================================
02431:    OMODOS BRAND IDENTITY
02432:    Logo ring, wordmark, and tagline are part of the fixed brand identity
02433:    and stay consistent regardless of the active color theme / visual
02434:    style, so all the shape/animation rules that other themes apply to
02435:    .mark / .i40-hex are neutralized here with !important.
02436:    ===================================================================== */
02437: .omodos-logo{
02438:   background:none !important;box-shadow:none !important;clip-path:none !important;
02439:   border-radius:0 !important;animation:none !important;
02440:   display:flex !important;align-items:center;justify-content:center;
02441: }
02442: html:not([data-theme="red-black"]) .brand .mark.omodos-logo{
02443:   background:none !important;color:inherit !important;
02444: }
02445: .omodos-logo span{display:none !important;}
02446: .omodos-logo-svg{width:100%;height:100%;display:block;}
02447: .brand .mark.omodos-logo{width:38px;height:38px;}
02448: .i40-banner .i40-hex.omodos-logo{width:50px;height:50px;}
02449: 
02450: /* Tema Dark (red-black): logo cincin otomatis diberi garis putih tipis
02451:    di LUAR dan di DALAM cincin, supaya logo tetap terlihat jelas dan
02452:    kontras di atas latar gelap/abu. */
~~~

### Around line 2514
~~~text
02502:   font-weight:700; letter-spacing:.4px; margin-bottom:8px;
02503: }
02504: .app-splash-sub{
02505:   font-family:var(--font-mono, inherit); color:var(--text-dim, #8b93a0); font-size:11.5px;
02506:   letter-spacing:.3px;
02507: }
02508: .omodos-divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
02509: .omodos-divider span{flex:1;height:1px;background:rgba(0,0,0,.18);}
02510: .omodos-divider i{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.35);flex-shrink:0;}
02511: 
02512: /* Login screen: fixed light brand splash, independent of the active
02513:    dark/alternate theme, matching the OMODOS identity artwork. */
02514: #login-gate{
02515:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02516:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02517: }
02518: #login-gate::before,#login-gate::after{display:none !important;}
02519: .login-box{
02520:   border:1px solid #e4e6ea !important;
02521:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02522:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02523: }
02524: .login-box .sub-title{
02525:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02526: }
02527: .login-box .field label{color:#12141a;}
02528: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02529: .login-box input::placeholder{color:#9aa1ab;}
02530: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02531: .login-box .btn-primary:hover{background:#5f0f18;}
02532: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02533: .app{display:none;}
02534: .app.unlocked{display:grid;}
02535: .rca-doc-title{
02536:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02537:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02538: }
02539: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02540: .rca-section:first-child{margin-top:16px;}
02541: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02542: .rca-section-heading{
02543:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02544:   padding:2px 4px;border-radius:5px;flex:1;
02545: }
02546: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02547: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02548: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02549: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
02550: .rca-why-list li{margin-bottom:4px;font-size:13.5px;}
02551: .btn-why-remove{
02552:   display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;
02553:   border:1px solid var(--line);background:var(--panel-2);color:var(--text-dim);cursor:pointer;font-size:9px;
02554:   vertical-align:middle;margin-left:4px;
02555: }
02556: .btn-why-remove:hover{color:var(--red);border-color:var(--red-dim);}
02557: .btn-why-add{padding:4px 10px;font-size:11.5px;}
02558: body.pdf-capture-mode .btn-why-remove, body.pdf-capture-mode .btn-why-add{display:none !important;}
02559: .rca-fb-table{width:100%;border-collapse:collapse;margin-top:8px;}
02560: .rca-fb-table td{border:1px solid var(--line);padding:10px 12px;font-size:13px;vertical-align:top;line-height:1.6;}
02561: .rca-fb-label{width:180px;font-weight:700;color:var(--red);background:var(--panel-2);}
02562: .fishbone-wrap{
02563:   position:relative;width:900px;max-width:none;height:460px;
02564:   background:#0f1114;border-radius:10px;border:1px solid var(--line);
02565: }
02566: .fb-cat-label{
02567:   position:absolute;background:#232733;color:#fff;font-family:var(--font-display);
02568:   font-size:12px;font-weight:700;letter-spacing:.6px;text-align:center;
02569:   border-radius:5px;padding:5px 6px;
02570: }
02571: .fb-cat-causes{
02572:   position:absolute;color:#c7cbd1;font-size:11px;line-height:1.5;
02573:   white-space:pre-line;text-align:left;min-height:16px;
02574: }
02575: .fb-head-text{
02576:   position:absolute;color:#fff;font-weight:700;font-size:12.5px;line-height:1.4;
02577:   display:flex;align-items:center;text-align:center;justify-content:center;
02578: }
~~~

### Around line 2518
~~~text
02506:   letter-spacing:.3px;
02507: }
02508: .omodos-divider{display:flex;align-items:center;gap:10px;margin:16px 0;}
02509: .omodos-divider span{flex:1;height:1px;background:rgba(0,0,0,.18);}
02510: .omodos-divider i{width:5px;height:5px;border-radius:50%;background:rgba(0,0,0,.35);flex-shrink:0;}
02511: 
02512: /* Login screen: fixed light brand splash, independent of the active
02513:    dark/alternate theme, matching the OMODOS identity artwork. */
02514: #login-gate{
02515:   --bg:#eef0f3;--panel:#ffffff;--panel-2:#ffffff;--text:#12141a;--text-dim:#6b7280;--line:#dfe2e7;
02516:   background:radial-gradient(circle at 30% 20%, rgba(0,0,0,.03), transparent 45%), var(--bg) !important;
02517: }
02518: #login-gate::before,#login-gate::after{display:none !important;}
02519: .login-box{
02520:   border:1px solid #e4e6ea !important;
02521:   box-shadow:0 24px 60px -20px rgba(20,22,30,.25) !important;
02522:   animation:modalIn 320ms cubic-bezier(.4,0,.2,1) !important;
02523: }
02524: .login-box .sub-title{
02525:   font-family:inherit;text-transform:none;letter-spacing:0;font-size:14px;color:#5b6472;margin-bottom:26px;
02526: }
02527: .login-box .field label{color:#12141a;}
02528: .login-box input{background:#f6f7f9;border:1px solid #e2e5ea;color:#12141a;}
02529: .login-box input::placeholder{color:#9aa1ab;}
02530: .login-box .btn-primary{background:#7c1420;border-color:#7c1420;color:#fff;}
02531: .login-box .btn-primary:hover{background:#5f0f18;}
02532: .login-box .login-foot{border-top:1px solid #eceef1;color:#8b93a0;letter-spacing:.8px;}
02533: .app{display:none;}
02534: .app.unlocked{display:grid;}
02535: .rca-doc-title{
02536:   font-family:var(--font-display);font-size:18px;font-weight:700;color:#fff;
02537:   padding:6px 8px;border-radius:6px;letter-spacing:.2px;
02538: }
02539: .rca-section{margin-top:24px;padding-top:18px;border-top:1px dashed var(--line);}
02540: .rca-section:first-child{margin-top:16px;}
02541: .rca-section-title-row{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;}
02542: .rca-section-heading{
02543:   font-family:var(--font-display);font-size:16px;font-weight:700;color:var(--red);
02544:   padding:2px 4px;border-radius:5px;flex:1;
02545: }
02546: .rca-section-sub{font-size:13px;color:var(--text-dim);margin:4px 4px 14px;padding:2px 4px;border-radius:5px;}
02547: .rca-meta-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px;}
02548: @media(max-width:820px){.rca-meta-row{grid-template-columns:1fr 1fr;}}
02549: .rca-why-list{padding-left:20px;line-height:1.8;margin:0 0 4px;}
02550: .rca-why-list li{margin-bottom:4px;font-size:13.5px;}
02551: .btn-why-remove{
02552:   display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:5px;
02553:   border:1px solid var(--line);background:var(--panel-2);color:var(--text-dim);cursor:pointer;font-size:9px;
02554:   vertical-align:middle;margin-left:4px;
02555: }
02556: .btn-why-remove:hover{color:var(--red);border-color:var(--red-dim);}
02557: .btn-why-add{padding:4px 10px;font-size:11.5px;}
02558: body.pdf-capture-mode .btn-why-remove, body.pdf-capture-mode .btn-why-add{display:none !important;}
02559: .rca-fb-table{width:100%;border-collapse:collapse;margin-top:8px;}
02560: .rca-fb-table td{border:1px solid var(--line);padding:10px 12px;font-size:13px;vertical-align:top;line-height:1.6;}
02561: .rca-fb-label{width:180px;font-weight:700;color:var(--red);background:var(--panel-2);}
02562: .fishbone-wrap{
02563:   position:relative;width:900px;max-width:none;height:460px;
02564:   background:#0f1114;border-radius:10px;border:1px solid var(--line);
02565: }
02566: .fb-cat-label{
02567:   position:absolute;background:#232733;color:#fff;font-family:var(--font-display);
02568:   font-size:12px;font-weight:700;letter-spacing:.6px;text-align:center;
02569:   border-radius:5px;padding:5px 6px;
02570: }
02571: .fb-cat-causes{
02572:   position:absolute;color:#c7cbd1;font-size:11px;line-height:1.5;
02573:   white-space:pre-line;text-align:left;min-height:16px;
02574: }
02575: .fb-head-text{
02576:   position:absolute;color:#fff;font-weight:700;font-size:12.5px;line-height:1.4;
02577:   display:flex;align-items:center;text-align:center;justify-content:center;
02578: }
02579: .fishbone-wrap [contenteditable="true"]:hover{outline:1px dashed color-mix(in srgb, var(--red) 60%, transparent);}
02580: .fishbone-wrap [contenteditable="true"]:focus{outline:1.5px dashed var(--red);background:color-mix(in srgb, var(--red) 12%, transparent);}
02581: [contenteditable="true"]{cursor:text;transition:background var(--trans), outline-color var(--trans);}
02582: [contenteditable="true"]:hover{background:color-mix(in srgb, var(--red) 6%, transparent);}
~~~

### Around line 3299
~~~text
03287: <link rel="stylesheet" href="/omodos4/hotfix.css" data-safe-v4="3">
03288: <style id="training-mobile-fix">
03289: @media(max-width:900px){
03290:  #dash-grid .dash-card{min-height:112px!important;height:auto!important;container-type:inline-size;}
03291:  #dash-grid .dc-name,#dash-grid .dc-status{display:block!important;visibility:visible!important;font-size:12px!important;}
03292:  #dash-grid{grid-auto-rows:minmax(112px,auto)!important;overflow-y:auto!important;}
03293: }
03294: </style></head>
03295: <body>
03296: <div class="scanline-overlay"></div>
03297: <div class="scanline-sweep"></div>
03298: 
03299: <div id="login-gate">
03300:   <div class="login-box">
03301:     <div class="omodos-logo">
03302:       <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03303:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03304:         <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03305:         <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03306:         <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03307:         <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03308:       </svg>
03309:     </div>
03310:     <h1 class="omodos-wordmark">OMODOS</h1>
03311:     <div class="omodos-tagline">OUR <b class="c-blue">MOTTO</b>. OUR <b class="c-pink">DUTY</b>. OUR <b class="c-amber">STRATEGY</b>.</div>
03312:     <div class="omodos-divider"><span></span><i></i><span></span></div>
03313:     <div class="sub-title">Smart Maintenance Reporting Platform <br> Packaging Offset BMJ</div>
03314:     <form id="form-login" autocomplete="off">
03315:       <div class="field">
03316:         <label>Username</label>
03317:         <input type="text" id="login-username" name="username" placeholder="Masukkan username" required>
03318:       </div>
03319:       <div class="field">
03320:         <label>Password</label>
03321:         <input type="password" id="login-password" name="password" placeholder="Masukkan password" required>
03322:       </div>
03323:       <button type="submit" class="btn btn-primary" id="btn-login-submit">
03324:         <i class="ph-bold ph-lock-key"></i> Masuk
03325:       </button>
03326:       <div class="login-err" id="login-err"></div>
03327:     </form>
03328:     <div class="login-foot">PT BUKIT MURIA JAYA <br> © 2026 IDJ. All Rights Reserved.</div>
03329:   </div>
03330: </div>
03331: 
03332: <div id="app-splash">
03333:   <div class="app-splash-box">
03334:     <div class="omodos-logo">
03335:       <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03336:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03337:         <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03338:         <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03339:         <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03340:         <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03341:       </svg>
03342:     </div>
03343:     <div class="app-splash-spinner"><i class="ph-bold ph-circle-notch ph-spin"></i></div>
03344:     <div class="app-splash-text" id="app-splash-text">Menyiapkan Data...</div>
03345:     <div class="app-splash-sub">Mohon tunggu sebentar, seluruh data aplikasi sedang dimuat.</div>
03346:   </div>
03347: </div>
03348: 
03349: <div class="app" id="app-root">
03350:   <div class="sidebar-overlay" id="sidebar-overlay"></div>
03351: 
03352:   <div class="dash-hover-zone" id="dash-hover-zone"></div>
03353: 
03354:   <aside class="sidebar" id="sidebar">
03355:     <div class="brand">
03356:       <div class="mark omodos-logo">
03357:         <svg class="omodos-logo-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
03358:           <circle cx="50" cy="50" r="31" fill="#ffffff"/>
03359:           <circle cx="50" cy="50" r="38" fill="none" stroke="#111318" stroke-width="14" stroke-dasharray="96.16 46.42 96.16" transform="rotate(-90 50 50)"/>
03360:           <circle cx="50" cy="50" r="38" fill="none" stroke="#00AEEF" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-96.16" transform="rotate(-90 50 50)"/>
03361:           <circle cx="50" cy="50" r="38" fill="none" stroke="#EC008C" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-111.63" transform="rotate(-90 50 50)"/>
03362:           <circle cx="50" cy="50" r="38" fill="none" stroke="#FFC20E" stroke-width="14" stroke-dasharray="15.47 223.29" stroke-dashoffset="-127.10" transform="rotate(-90 50 50)"/>
03363:         </svg>
~~~

### Around line 6713
~~~text
06701:           fetch(WEB_APP_URL, {method:'POST', headers:{'Content-Type':'text/plain;charset=utf-8'}, body:JSON.stringify({action:'logout',sessionToken:json.sessionToken})}).catch(()=>{});
06702:         }
06703:         errEl.textContent = 'Akun ini valid, tetapi bukan Superadmin — akses ditolak.';
06704:         errEl.style.display = 'block';
06705:         return;
06706:       }
06707:       SETTING_AUTH_OK = true;
06708:       SETTING_SESSION_TOKEN = json.sessionToken || '';
06709:       closeModal();
06710:       if(onSuccess) onSuccess();
06711:     }catch(err){
06712:       // Step-up auth Setting tidak boleh mengunci sesi aplikasi utama.
06713:       // Tampilkan error di modal saja; appRoot/login-gate milik sesi utama
06714:       // berada di scope lain dan memang tidak boleh disentuh dari sini.
06715:       errEl.textContent = err.message || 'Gagal menghubungi server. Periksa koneksi internet Anda.';
06716:       errEl.style.display = 'block';
06717:     }finally{
06718:       submitBtn.disabled = false;
06719:       submitBtn.innerHTML = originalLabel;
06720:     }
06721:   };
06722:   $('#btn-setting-login-submit').addEventListener('click', submit);
06723:   $('#setting-login-password').addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'){ ev.preventDefault(); submit(); } });
06724:   setTimeout(()=> $('#setting-login-username') && $('#setting-login-username').focus(), 50);
06725: }
06726: 
06727: /* ======================================================================
06728:    [RBAC] USER MANAGEMENT & ROLE ACCESS MANAGEMENT (khusus Superadmin)
06729:    ----------------------------------------------------------------------
06730:    Mengikuti pola render-ke-container yang sudah dipakai di menu Setting
06731:    lain (renderMachineTable, renderPersonilTable, dst). Semua data
06732:    (user, role, permission) diambil & disimpan lewat code.gs — frontend
06733:    di sini hanya UI, tidak menyimpan apa pun secara lokal.
06734:    ====================================================================== */
06735: function renderRbacAdminSection(){
06736:   const holder = $('#rbac-admin-section');
06737:   if(!holder) return;
06738:   if(!isSettingAuthed()){ holder.innerHTML = ''; return; }
06739:   holder.innerHTML = `
06740:     <div class="card" style="margin-bottom:18px;">
06741:       <div class="section-title"><i class="ph-bold ph-users"></i> User Management <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
06742:       <div class="sub" style="margin-bottom:12px;">Kelola akun aplikasi tanpa bercampur dengan pengaturan role. Setiap aktivitas user dicatat ke Audit Log terpusat.</div>
06743:       <div class="grid3">
06744:         <div class="field"><label>Username</label><input type="text" id="ru-username" placeholder="cth: budi.santoso" autocomplete="off"></div>
06745:         <div class="field"><label>Nama Tampilan</label><input type="text" id="ru-displayname" placeholder="cth: Budi Santoso"></div>
06746:         <div class="field"><label>Role</label>
06747:           <select id="ru-role">
06748:             <option value="Technician">Technician</option>
06749:             <option value="Supervisor">Supervisor</option>
06750:             <option value="Superadmin">Superadmin</option>
06751:           </select>
06752:         </div>
06753:       </div>
06754:       <div class="field"><label>Password (min. 6 karakter)</label><input type="password" id="ru-password" placeholder="Password awal" autocomplete="new-password"></div>
06755:       <button class="btn btn-sm btn-primary" id="btn-add-user"><i class="ph-bold ph-user-plus"></i> Tambah User</button>
06756:       <span id="ru-status" style="margin-left:10px;font-size:12.5px;color:var(--text-dim);"></span>
06757:       <div style="margin-top:16px;" id="rbac-user-table"></div>
06758:     </div>
06759: 
06760:     <div class="card" style="margin-bottom:18px;">
06761:       <div class="section-title"><i class="ph-bold ph-activity"></i> User Activity Monitor</div>
06762:       <div class="sub">Pantau login, logout, perubahan data/konfigurasi, serta operasi yang gagal. Detail sensitif seperti password, token, API key, hash, dan salt tetap disensor oleh backend.</div>
06763:       <div id="rbac-user-activity"></div>
06764:     </div>
06765: 
06766:     <div class="card" style="margin-bottom:18px;">
06767:       <div class="section-title"><i class="ph-bold ph-broom"></i> Perbaikan Kualitas Data Logbook <span style="font-size:11px;color:var(--text-dim);font-weight:400;text-transform:none;letter-spacing:0;">(khusus Superadmin)</span></div>
06768:       <div class="sub" style="margin-bottom:12px;">Untuk data logbook hasil migrasi/export OneNote yang salah input:
06769:         <b>(1)</b> Tanggal kosong atau tanggal masa depan → dipindah ke tahun <b>2025</b> (bulan/tanggal dipertahankan kalau ada).
06770:         <b>(2)</b> Baris yang kolom "Deskripsi Masalah"-nya hanya berisi "Preventive"/"PM" dipindahkan ke kolom "Jenis Pekerjaan".
06771:         <br><br>⚠️ <b>Selalu pratinjau dulu</b> sebelum menerapkan perubahan.</div>
06772:       <button class="btn btn-sm btn-ghost" id="btn-preview-data-fix"><i class="ph-bold ph-eye"></i> Pratinjau Perubahan</button>
06773:       <div id="data-fix-result" style="margin-top:14px;"></div>
06774:     </div>
06775:   `;
06776:   $('#btn-add-user').addEventListener('click', handleAddUser_);
06777:   renderRbacUserTable();
~~~

## app-root.classList.add('unlocked'
No match.

## async function loadAll(
### Around line 8585
~~~text
08573:   const ripple = document.createElement('span');
08574:   const size = Math.max(rect.width, rect.height);
08575:   ripple.className = 'ripple';
08576:   ripple.style.width = ripple.style.height = size + 'px';
08577:   ripple.style.left = (ev.clientX - rect.left - size/2) + 'px';
08578:   ripple.style.top = (ev.clientY - rect.top - size/2) + 'px';
08579:   btn.appendChild(ripple);
08580:   setTimeout(()=> ripple.remove(), 600);
08581: });
08582: 
08583: /* ---------------- DATA LOADING ---------------- */
08584: let PREPARATION_PROMISE = null;
08585: async function loadAll(){
08586:   if(PREPARATION_PROMISE) return PREPARATION_PROMISE;
08587:   PREPARATION_PROMISE = prepareAllData_();
08588:   try{ return await PREPARATION_PROMISE; }finally{ PREPARATION_PROMISE = null; }
08589: }
08590: async function prepareAllData_(){
08591:   // Yield until all script declarations (including project/meeting state) exist.
08592:   await new Promise(resolve=>setTimeout(resolve,0));
08593:   const token = SESSION_TOKEN;
08594:   if(!WEB_APP_URL || !token) throw new Error('AUTH_REQUIRED');
08595: 
08596:   const manifest = await apiGet('prepareManifest', {fresh:'1'}, 1);
08597:   if(!manifest || !Array.isArray(manifest.actions)) throw new Error('Manifest persiapan backend tidak valid.');
08598: 
08599:   // Backend baru selalu menempatkan bootstrap sebagai sumber minimum untuk
08600:   // membuka Home. Tetap kompatibel dengan backend transisi yang belum
08601:   // mencantumkannya: jalur legacy memakai machines/personil sebagai minimum.
08602:   const hasBootstrap = manifest.actions.includes('bootstrap');
08603:   const pending = manifest.actions.slice();
08604:   const data = {};
08605:   const errors = [];
08606:   let done = 0;
08607:   const progress = ()=>{
08608:     const el = document.getElementById('app-splash-text');
08609:     if(el) el.textContent = 'Menyiapkan data… '+done+' / '+manifest.actions.length;
08610:   };
08611:   progress();
08612: 
08613:   await Promise.all(Array.from({length:Math.min(4,Math.max(1,pending.length))},async()=>{
08614:     while(pending.length){
08615:       const action = pending.shift();
08616:       try{
08617:         data[action] = await apiGet(action, {}, 1);
08618:       }catch(e){
08619:         errors.push({action,message:String(e&&e.message||e)});
08620:       }
08621:       done++;
08622:       progress();
08623:     }
08624:   }));
08625: 
08626:   if(token !== SESSION_TOKEN) throw new Error('SESSION_INVALID');
08627: 
08628:   // Jangan biarkan satu modul opsional (KPI/Meeting/Energy/Report/dll)
08629:   // menggagalkan seluruh login. Yang wajib hanya bootstrap; pada backend
08630:   // legacy, machines+personil menjadi minimum kompatibilitas.
08631:   const criticalActions = hasBootstrap ? ['bootstrap'] : ['machines','personil'];
08632:   const fatal = errors.filter(e=>criticalActions.includes(e.action));
08633:   if(fatal.length){
08634:     throw new Error('Data dasar aplikasi gagal dimuat. Coba masuk kembali. '+fatal.map(e=>e.action+': '+e.message).join('; '));
08635:   }
08636: 
08637:   const bootstrap = (data.bootstrap && typeof data.bootstrap==='object') ? data.bootstrap : {};
08638:   const entriesSource = Array.isArray(data.list)
08639:     ? data.list
08640:     : (Array.isArray(bootstrap.recentEntries) ? bootstrap.recentEntries : (Array.isArray(bootstrap.entries) ? bootstrap.entries : []));
08641:   const machineSource = Array.isArray(data.machines)
08642:     ? data.machines
08643:     : (Array.isArray(bootstrap.machines) ? bootstrap.machines : []);
08644:   const personSource = Array.isArray(data.personil)
08645:     ? data.personil
08646:     : (Array.isArray(bootstrap.personil) ? bootstrap.personil : []);
08647:   const patrolTemplateSource = Array.isArray(data.patrolChecklistTemplate)
08648:     ? data.patrolChecklistTemplate
08649:     : (Array.isArray(bootstrap.patrolTemplate) ? bootstrap.patrolTemplate : []);
~~~

## function loadAll(
### Around line 8585
~~~text
08573:   const ripple = document.createElement('span');
08574:   const size = Math.max(rect.width, rect.height);
08575:   ripple.className = 'ripple';
08576:   ripple.style.width = ripple.style.height = size + 'px';
08577:   ripple.style.left = (ev.clientX - rect.left - size/2) + 'px';
08578:   ripple.style.top = (ev.clientY - rect.top - size/2) + 'px';
08579:   btn.appendChild(ripple);
08580:   setTimeout(()=> ripple.remove(), 600);
08581: });
08582: 
08583: /* ---------------- DATA LOADING ---------------- */
08584: let PREPARATION_PROMISE = null;
08585: async function loadAll(){
08586:   if(PREPARATION_PROMISE) return PREPARATION_PROMISE;
08587:   PREPARATION_PROMISE = prepareAllData_();
08588:   try{ return await PREPARATION_PROMISE; }finally{ PREPARATION_PROMISE = null; }
08589: }
08590: async function prepareAllData_(){
08591:   // Yield until all script declarations (including project/meeting state) exist.
08592:   await new Promise(resolve=>setTimeout(resolve,0));
08593:   const token = SESSION_TOKEN;
08594:   if(!WEB_APP_URL || !token) throw new Error('AUTH_REQUIRED');
08595: 
08596:   const manifest = await apiGet('prepareManifest', {fresh:'1'}, 1);
08597:   if(!manifest || !Array.isArray(manifest.actions)) throw new Error('Manifest persiapan backend tidak valid.');
08598: 
08599:   // Backend baru selalu menempatkan bootstrap sebagai sumber minimum untuk
08600:   // membuka Home. Tetap kompatibel dengan backend transisi yang belum
08601:   // mencantumkannya: jalur legacy memakai machines/personil sebagai minimum.
08602:   const hasBootstrap = manifest.actions.includes('bootstrap');
08603:   const pending = manifest.actions.slice();
08604:   const data = {};
08605:   const errors = [];
08606:   let done = 0;
08607:   const progress = ()=>{
08608:     const el = document.getElementById('app-splash-text');
08609:     if(el) el.textContent = 'Menyiapkan data… '+done+' / '+manifest.actions.length;
08610:   };
08611:   progress();
08612: 
08613:   await Promise.all(Array.from({length:Math.min(4,Math.max(1,pending.length))},async()=>{
08614:     while(pending.length){
08615:       const action = pending.shift();
08616:       try{
08617:         data[action] = await apiGet(action, {}, 1);
08618:       }catch(e){
08619:         errors.push({action,message:String(e&&e.message||e)});
08620:       }
08621:       done++;
08622:       progress();
08623:     }
08624:   }));
08625: 
08626:   if(token !== SESSION_TOKEN) throw new Error('SESSION_INVALID');
08627: 
08628:   // Jangan biarkan satu modul opsional (KPI/Meeting/Energy/Report/dll)
08629:   // menggagalkan seluruh login. Yang wajib hanya bootstrap; pada backend
08630:   // legacy, machines+personil menjadi minimum kompatibilitas.
08631:   const criticalActions = hasBootstrap ? ['bootstrap'] : ['machines','personil'];
08632:   const fatal = errors.filter(e=>criticalActions.includes(e.action));
08633:   if(fatal.length){
08634:     throw new Error('Data dasar aplikasi gagal dimuat. Coba masuk kembali. '+fatal.map(e=>e.action+': '+e.message).join('; '));
08635:   }
08636: 
08637:   const bootstrap = (data.bootstrap && typeof data.bootstrap==='object') ? data.bootstrap : {};
08638:   const entriesSource = Array.isArray(data.list)
08639:     ? data.list
08640:     : (Array.isArray(bootstrap.recentEntries) ? bootstrap.recentEntries : (Array.isArray(bootstrap.entries) ? bootstrap.entries : []));
08641:   const machineSource = Array.isArray(data.machines)
08642:     ? data.machines
08643:     : (Array.isArray(bootstrap.machines) ? bootstrap.machines : []);
08644:   const personSource = Array.isArray(data.personil)
08645:     ? data.personil
08646:     : (Array.isArray(bootstrap.personil) ? bootstrap.personil : []);
08647:   const patrolTemplateSource = Array.isArray(data.patrolChecklistTemplate)
08648:     ? data.patrolChecklistTemplate
08649:     : (Array.isArray(bootstrap.patrolTemplate) ? bootstrap.patrolTemplate : []);
~~~

## function refreshRbacFromServer_(
### Around line 8017
~~~text
08005: 
08006: // [FIX ROOT CAUSE] Sebelumnya PERMISSIONS/FEATURE_REGISTRY di akun yang
08007: // SUDAH login hanya disegarkan SEKALI, tepat saat halaman pertama dibuka
08008: // (restoreRbacSession_ di atas). Kalau tab akun lain dibiarkan terbuka
08009: // lama, atau device-nya dikunci lalu dibuka lagi tanpa reload penuh,
08010: // perubahan yang Superadmin simpan di Role Access Management tidak akan
08011: // pernah terlihat sampai user itu logout+login ulang atau menutup total
08012: // lalu membuka ulang tab-nya -- inilah salah satu sumber laporan "menu
08013: // yang muncul tidak sesuai config admin" di akun lain. Fungsi ini
08014: // diekstrak supaya bisa dipanggil ulang secara berkala DAN setiap kali
08015: // tab kembali terlihat (mis. dibuka lagi setelah di-minimize di HP),
08016: // tanpa mengubah perilaku restoreRbacSession_ di atas sama sekali.
08017: async function refreshRbacFromServer_(){
08018:   if(!CURRENT_USER || !SESSION_TOKEN || !WEB_APP_URL) return;
08019:   try{
08020:     const [features, permissions] = await Promise.all([
08021:       apiGet('features'),
08022:       apiGet('permissions')
08023:     ]);
08024:     FEATURE_REGISTRY = mergeFeatureRegistry(features || []);
08025:     PERMISSIONS = permissions || {};
08026:     cacheRbacSession_();
08027:     applyRbacToUi();
08028:   }catch(e){
08029:     // Biarkan sesi tetap aktif dengan cache terakhir; tidak melakukan apa-apa.
08030:   }
08031: }
08032: // Segarkan tiap 3 menit selagi tab terbuka & terlihat, dan segera saat tab
08033: // kembali aktif (mis. user balik dari aplikasi lain di HP). Ringan karena
08034: // permission/feature di backend sudah di-cache 10 menit (CacheService),
08035: // jadi tidak membebani database SQLite.
08036: setInterval(()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); }, 3*60*1000);
08037: document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState === 'visible') refreshRbacFromServer_(); });
08038: 
08039: /* ---------------- LOGOUT ----------------
08040:    Membersihkan sesi RBAC (CURRENT_USER, permission, feature registry) &
08041:    status login menu Setting, lalu menampilkan kembali login-gate supaya
08042:    pengguna wajib login ulang dengan akun (username/password) untuk
08043:    masuk ke aplikasi lagi. Data yang sudah tersimpan di database SQLite
08044:    tidak terpengaruh sama sekali oleh logout. */
08045: function logoutUser(){
08046:   try{
08047:     deactivateAccountDataCaches_(CURRENT_USER&&CURRENT_USER.username);
08048:   }catch(e){
08049:     toast('Logout dibatalkan karena cache lokal belum berhasil diamankan. Coba kembali setelah ruang penyimpanan browser tersedia.', true);
08050:     return;
08051:   }
08052:   const tokenToRevoke = SESSION_TOKEN;
08053:   if(tokenToRevoke && WEB_APP_URL){
08054:     fetch(WEB_APP_URL, {
08055:       method:'POST',
08056:       headers:{'Content-Type':'text/plain;charset=utf-8'},
08057:       body:JSON.stringify({action:'logout', sessionToken:tokenToRevoke}),
08058:       keepalive:true
08059:     }).catch(()=>{});
08060:   }
08061:   CURRENT_USER = null;
08062:   SESSION_TOKEN = '';
08063:   SESSION_EXPIRES_AT = '';
08064:   PERMISSIONS = {};
08065:   FEATURE_REGISTRY = [];
08066:   try{ localStorage.removeItem(SS_USER_KEY); localStorage.removeItem(SS_TOKEN_KEY); localStorage.removeItem(SS_TOKEN_EXP_KEY); localStorage.removeItem(LS_PERM_KEY); localStorage.removeItem(LS_FEATURES_KEY); }catch(e){}
08067:   if(typeof resetSettingAuth === 'function') resetSettingAuth();
08068: 
08069:   const gate = document.getElementById('login-gate');
08070:   const appRoot = document.getElementById('app-root');
08071:   if(appRoot) appRoot.classList.remove('unlocked', 'dash-mode', 'menu-visible');
08072:   if(gate){
08073:     gate.style.display = '';
08074:     gate.style.opacity = '1';
08075:   }
08076:   const form = document.getElementById('form-login');
08077:   if(form) form.reset();
08078:   const errEl = document.getElementById('login-err');
08079:   if(errEl) errEl.textContent = '';
08080:   const userField = document.getElementById('login-username');
08081:   if(userField) setTimeout(()=> userField.focus(), 50);
~~~

## function activateAccountDataCaches_(
### Around line 6331
~~~text
06319:       if(key && key.startsWith(prefix)) scoped.push(key);
06320:     }
06321:   }catch(e){ return false; }
06322:   let ok=true;
06323:   for(const scopedKey of scoped){
06324:     let original='';
06325:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06326:     if(!isAccountDataCacheKey_(original)) continue;
06327:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06328:   }
06329:   return ok;
06330: }
06331: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06332:   const ownerId=accountCacheOwnerId_(username);
06333:   if(!ownerId) return true;
06334:   let previous='';
06335:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06336:   if(previous && previous!==ownerId){
06337:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06338:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06339:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06340:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06341:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06342:   }
06343:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06344:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06345:   }
06346:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06347:   return true;
06348: }
06349: function deactivateAccountDataCaches_(username){
06350:   let ownerId=accountCacheOwnerId_(username);
06351:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06352:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06353:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06354:   return true;
06355: }
06356: let CURRENT_USER = null;        // { username, role, displayName }
06357: let SESSION_TOKEN = '';
06358: let SESSION_EXPIRES_AT = '';
06359: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06360: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06361: try{
06362:   const cached = localStorage.getItem(SS_USER_KEY);
06363:   if(cached) CURRENT_USER = JSON.parse(cached);
06364:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06365:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06366:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
06367:     CURRENT_USER = null;
06368:     SESSION_TOKEN = '';
06369:     SESSION_EXPIRES_AT = '';
06370:   }
06371:   const cachedPerm = localStorage.getItem(LS_PERM_KEY);
06372:   if(cachedPerm) PERMISSIONS = JSON.parse(cachedPerm);
06373:   const cachedFeat = localStorage.getItem(LS_FEATURES_KEY);
06374:   if(cachedFeat) FEATURE_REGISTRY = JSON.parse(cachedFeat);
06375: }catch(e){}
06376: try{
06377:   if(CURRENT_USER && SESSION_TOKEN) activateAccountDataCaches_(CURRENT_USER.username,{claimExisting:true});
06378: }catch(e){
06379:   CURRENT_USER = null;
06380:   SESSION_TOKEN = '';
06381:   SESSION_EXPIRES_AT = '';
06382:   try{
06383:     localStorage.removeItem(SS_USER_KEY);
06384:     localStorage.removeItem(SS_TOKEN_KEY);
06385:     localStorage.removeItem(SS_TOKEN_EXP_KEY);
06386:   }catch(clearErr){}
06387: }
06388: function cacheRbacSession_(){
06389:   try{
06390:     localStorage.setItem(SS_USER_KEY, JSON.stringify(CURRENT_USER));
06391:     localStorage.setItem(SS_TOKEN_KEY, SESSION_TOKEN || '');
06392:     localStorage.setItem(SS_TOKEN_EXP_KEY, SESSION_EXPIRES_AT || '');
06393:     localStorage.setItem(LS_PERM_KEY, JSON.stringify(PERMISSIONS));
06394:     localStorage.setItem(LS_FEATURES_KEY, JSON.stringify(FEATURE_REGISTRY));
06395:   }catch(e){}
~~~

## function stashAccountDataCachesById_(
### Around line 6302
~~~text
06290:   try{ value=localStorage.getItem(fromKey); }catch(e){ return false; }
06291:   if(value===null) return true;
06292:   try{ localStorage.removeItem(fromKey); }catch(e){ return false; }
06293:   try{
06294:     localStorage.setItem(toKey,value);
06295:     return true;
06296:   }catch(err){
06297:     // Jangan hilangkan data lokal bila namespace baru gagal ditulis.
06298:     try{ localStorage.setItem(fromKey,value); }catch(restoreErr){}
06299:     return false;
06300:   }
06301: }
06302: function stashAccountDataCachesById_(ownerId){
06303:   ownerId=String(ownerId||'').trim();
06304:   if(!ownerId) return true;
06305:   const keys=collectAccountDataCacheKeys_();
06306:   for(const key of keys){
06307:     if(!moveLocalStorageKey_(key,LS_ACCOUNT_CACHE_PREFIX+ownerId+'::'+encodeURIComponent(key))) return false;
06308:   }
06309:   return true;
06310: }
06311: function restoreAccountDataCachesById_(ownerId){
06312:   ownerId=String(ownerId||'').trim();
06313:   if(!ownerId) return true;
06314:   const prefix=LS_ACCOUNT_CACHE_PREFIX+ownerId+'::';
06315:   const scoped=[];
06316:   try{
06317:     for(let i=0;i<localStorage.length;i++){
06318:       const key=localStorage.key(i);
06319:       if(key && key.startsWith(prefix)) scoped.push(key);
06320:     }
06321:   }catch(e){ return false; }
06322:   let ok=true;
06323:   for(const scopedKey of scoped){
06324:     let original='';
06325:     try{ original=decodeURIComponent(scopedKey.slice(prefix.length)); }catch(e){ continue; }
06326:     if(!isAccountDataCacheKey_(original)) continue;
06327:     if(!moveLocalStorageKey_(scopedKey,original)) ok=false;
06328:   }
06329:   return ok;
06330: }
06331: function activateAccountDataCaches_(username,{claimExisting=false}={}){
06332:   const ownerId=accountCacheOwnerId_(username);
06333:   if(!ownerId) return true;
06334:   let previous='';
06335:   try{ previous=localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06336:   if(previous && previous!==ownerId){
06337:     if(!stashAccountDataCachesById_(previous)) throw new Error('CACHE_ISOLATION_FAILED');
06338:   }else if(!previous && !claimExisting && collectAccountDataCacheKeys_().length){
06339:     // Cache lama dari versi sebelum isolasi akun: jangan wariskan ke akun baru.
06340:     // Tetap dipreservasi sebagai legacy agar tidak dihancurkan.
06341:     if(!stashAccountDataCachesById_('legacy')) throw new Error('CACHE_ISOLATION_FAILED');
06342:   }
06343:   if(previous!==ownerId && !restoreAccountDataCachesById_(ownerId)){
06344:     console.warn('[OMODOS] cache akun tersimpan tetapi belum dapat dipulihkan; data server akan dimuat ulang.');
06345:   }
06346:   try{ localStorage.setItem(LS_ACCOUNT_CACHE_OWNER_KEY,ownerId); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06347:   return true;
06348: }
06349: function deactivateAccountDataCaches_(username){
06350:   let ownerId=accountCacheOwnerId_(username);
06351:   try{ ownerId=ownerId||localStorage.getItem(LS_ACCOUNT_CACHE_OWNER_KEY)||''; }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06352:   if(ownerId && !stashAccountDataCachesById_(ownerId)) throw new Error('CACHE_ISOLATION_FAILED');
06353:   try{ localStorage.removeItem(LS_ACCOUNT_CACHE_OWNER_KEY); }catch(e){ throw new Error('CACHE_ISOLATION_FAILED'); }
06354:   return true;
06355: }
06356: let CURRENT_USER = null;        // { username, role, displayName }
06357: let SESSION_TOKEN = '';
06358: let SESSION_EXPIRES_AT = '';
06359: let PERMISSIONS = {};           // { 'view.xxx': { Supervisor:bool, Technician:bool } }
06360: let FEATURE_REGISTRY = [];      // [{ PermissionKey, Label, Group }]
06361: try{
06362:   const cached = localStorage.getItem(SS_USER_KEY);
06363:   if(cached) CURRENT_USER = JSON.parse(cached);
06364:   SESSION_TOKEN = localStorage.getItem(SS_TOKEN_KEY) || '';
06365:   SESSION_EXPIRES_AT = localStorage.getItem(SS_TOKEN_EXP_KEY) || '';
06366:   if(!SESSION_TOKEN || (SESSION_EXPIRES_AT && Date.parse(SESSION_EXPIRES_AT) <= Date.now())){
~~~

## function loadCached
No match.

## function hydrate
### Around line 19179
~~~text
19167: function loadPmReports(){
19168:   if(CURRENT_USER && typeof canAccessView_==='function' && !canAccessView_('patrol')){
19169:     PM_REPORTS = [];
19170:     return PM_REPORTS;
19171:   }
19172:   PM_REPORTS = loadPmReportsLocal();
19173:   return PM_REPORTS;
19174: }
19175: 
19176: // Findings Patrol versi lama dapat menyimpan blob: URL lokal, sedangkan kolom
19177: // Files sudah punya URL permanen Cloudflare. Petakan ulang berdasarkan urutan
19178: // agar data lama langsung pulih di gadget lain tanpa perlu edit ulang record.
19179: function hydratePatrolFindingFiles_(findings, stableFiles){
19180:   const out = Array.isArray(findings) ? JSON.parse(JSON.stringify(findings)) : [];
19181:   const stable = Array.isArray(stableFiles) ? stableFiles.filter(Boolean) : [];
19182:   let cursor = 0;
19183:   out.forEach(f=>{
19184:     if(!Array.isArray(f.files)) return;
19185:     f.files = f.files.map(old=>{
19186:       const candidate = stable.find(x=>old && old.id && x.id===old.id) || stable.find(x=>old && old.name && x.name===old.name) || stable[cursor++];
19187:       if(old && old.viewUrl && !/^(blob:|data:)/.test(String(old.viewUrl))) return parseAttachments([old])[0];
19188:       if(candidate && candidate.viewUrl && !String(candidate.viewUrl).startsWith('blob:')) return candidate;
19189:       if(old && old.viewUrl && !String(old.viewUrl).startsWith('blob:')) return old;
19190:       return { name:(old&&old.name)||'lampiran', mimeType:(old&&old.mimeType)||'', type:(old&&old.type)||'' };
19191:     });
19192:   });
19193:   return out;
19194: }
19195: 
19196: function normalizePmTimestamp_(row){
19197:   row=row||{};
19198:   const raw=row.ts ?? row.Timestamp ?? row['Timestamp Input'] ?? '';
19199:   if(typeof raw==='number' && Number.isFinite(raw) && raw>0) return raw<1e12 ? raw*1000 : raw;
19200:   const numRaw=Number(raw);
19201:   if(Number.isFinite(numRaw) && numRaw>0) return numRaw<1e12 ? numRaw*1000 : numRaw;
19202:   const parsed=Date.parse(String(raw||''));
19203:   if(Number.isFinite(parsed)) return parsed;
19204:   const tanggal=String(row.tanggal ?? row.Tanggal ?? '').slice(0,10);
19205:   const waktu=String(row.waktuPatrol ?? row['Waktu Patrol'] ?? row.Waktu ?? '00:00').slice(0,5);
19206:   const combined=Date.parse(tanggal ? (tanggal+'T'+waktu+':00') : '');
19207:   return Number.isFinite(combined)?combined:0;
19208: }
19209: function sanitizePmReportForLocal_(report){
19210:   const copy = JSON.parse(JSON.stringify(report||{}));
19211:   if(Array.isArray(copy.findings)) copy.findings.forEach(f=>{
19212:     if(Array.isArray(f.files)) f.files = f.files.map(x=>({
19213:       name:x.name||'lampiran', mimeType:x.mimeType||'', type:x.type||'',
19214:       viewUrl:x.viewUrl||'', previewUrl:x.previewUrl||'', thumbUrl:x.thumbUrl||''
19215:     }));
19216:   });
19217:   return copy;
19218: }
19219: 
19220: async function syncPmReportsFromBackend(){
19221:   if(!WEB_APP_URL) return loadPmReportsLocal();
19222:   try{
19223:     const remote = await apiGet('predictiveReports');
19224:     if(Array.isArray(remote)){
19225:       const normalized = remote.map(r=>({
19226:         id: r.id || r.ID, ts: normalizePmTimestamp_(r),
19227:         tanggal: r.tanggal || r.Tanggal || '', shift: r.shift || r.Shift || '',
19228:         petugas: r.petugas || r.Petugas || '', kodeMesin: r.kodeMesin || r['Kode Mesin'] || '',
19229:         namaMesin: r.namaMesin || r['Nama Mesin'] || '', titikInspeksi: r.titikInspeksi || r['Titik Inspeksi'] || '',
19230:         vibrasi: r.vibrasi || r.Vibrasi || '', suhu: r.suhu || r.Suhu || '', suara: r.suara || r.Suara || '',
19231:         kebocoran: r.kebocoran || r.Kebocoran || '', kelistrikan: r.kelistrikan || r.Kelistrikan || '',
19232:         pelumasan: r.pelumasan || r.Pelumasan || '', severity: r.severity || r.Severity || 'Normal',
19233:         deskripsiTemuan: r.deskripsiTemuan || r['Deskripsi Temuan'] || '',
19234:         rekomendasi: r.rekomendasi || r.Rekomendasi || '',
19235:         // Lampiran bisa berupa array objek {name,type,viewUrl} (kalau backend sudah upload ke Drive)
19236:         // atau string/array nama file lama — parseAttachments() menormalkan keduanya supaya foto/video
19237:         // tetap bisa ditampilkan sebagai gambar/video asli, sama seperti Lampiran Logbook.
19238:         files: parseAttachments(r.files || r['Lampiran (JSON)'] || r.Files || []),
19239:         patrolMode: String(r.patrolMode ?? r['Patrol Mode'] ?? '').toLowerCase()==='true' ||
19240:           String(r.patrolMode ?? r['Patrol Mode'] ?? '')==='1' ||
19241:           /^patrol harian/i.test(String(r.titikInspeksi || r['Titik Inspeksi'] || '')),
19242:         checklist: safeJsonParseClient_(r.checklist || r['Checklist (JSON)'], {}),
19243:         counts: safeJsonParseClient_(r.counts || r['Counts (JSON)'], {}),
~~~

