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

