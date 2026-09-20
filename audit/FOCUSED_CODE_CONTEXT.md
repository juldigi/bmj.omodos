# OMODOS Focused Code Context

## function switchToView(
### Around line 8098
~~~text
08086: function invokeViewRenderer_(view, renderer, label){
08087:   try{
08088:     const result = renderer();
08089:     if(result && typeof result.then === 'function'){
08090:       result.catch(err=>handleViewRenderError_(view,label,err));
08091:     }
08092:     return result;
08093:   }catch(err){
08094:     handleViewRenderError_(view,label,err);
08095:     return null;
08096:   }
08097: }
08098: function switchToView(enteringView){
08099:   enteringView = String(enteringView||'').trim();
08100:   if(!enteringView){ toast('Tujuan halaman tidak valid.', true); return false; }
08101:   if(typeof canAccessView_ === 'function' && !canAccessView_(enteringView)){
08102:     showAccessDenied();
08103:     return false;
08104:   }
08105:   const enteringViewEl = document.getElementById('view-' + enteringView);
08106:   if(!enteringViewEl){
08107:     console.error('[OMODOS] View target tidak ditemukan:', enteringView);
08108:     toast('Halaman "' + enteringView + '" belum tersedia. Muat ulang aplikasi lalu coba lagi.', true);
08109:     return false;
08110:   }
08111: 
08112:   const leavingView = PREVIOUS_ACTIVE_VIEW;
08113: 
08114:   $$('.nav-btn').forEach(b=>b.classList.remove('active'));
08115:   $$('.nav-btn').forEach(b=>{ if(b.dataset.view===enteringView) b.classList.add('active'); });
08116:   $$('.bottom-nav-btn').forEach(b=>{ b.classList.remove('active'); b.classList.remove('group-active'); });
08117:   $$('.bottom-nav-btn').forEach(b=>{
08118:     if(b.dataset.view===enteringView){ b.classList.add('active'); return; }
08119:     if(b.dataset.group){
08120:       const submenu = $(`.nav-submenu[data-submenu="${b.dataset.group}"]`);
08121:       if(submenu && $(`.nav-btn[data-view="${enteringView}"]`, submenu)) b.classList.add('group-active');
08122:     }
08123:   });
08124:   $$('.view').forEach(v=>v.classList.remove('active'));
08125:   enteringViewEl.classList.add('active');
08126: 
08127:   // Fitur AI harus selalu kembali ke kondisi default setiap kali pengguna
08128:   // meninggalkan halaman ini — supaya tidak ada hasil analisa "nyangkut"
08129:   // dari sesi sebelumnya saat pengguna kembali lagi ke menu AI.
08130:   if(leavingView === 'ai' && enteringView !== 'ai'){ resetAiView(); }
08131: 
08132:   // Menu Setting: begitu pengguna meninggalkan menu ini ke menu lain,
08133:   // status login direset — supaya kembali ke menu Setting nanti wajib
08134:   // login ulang. Koneksi Cloudflare (WEB_APP_URL) TIDAK terpengaruh
08135:   // sama sekali oleh reset ini, tetap tersambung seperti biasa.
08136:   if(leavingView === 'setting' && enteringView !== 'setting'){ resetSettingAuth(); }
08137: 
08138:   // Hentikan interval jam berjalan Visual Dashboard saat berpindah halaman,
08139:   // supaya tidak terus berjalan di background dan membuang resource.
08140:   if(leavingView === 'dashboard' && enteringView !== 'dashboard' && DASHBOARD_TIMER_INTERVAL){
08141:     clearInterval(DASHBOARD_TIMER_INTERVAL); DASHBOARD_TIMER_INTERVAL = null;
08142:   }
08143: 
08144:   // Visual Dashboard tampil fullscreen: menu kiri disembunyikan dan hanya
08145:   // muncul saat tombol "Tampilkan Menu" diklik.
08146:   if(enteringView === 'dashboard'){
08147:     $('#app-root').classList.add('dash-mode');
08148:     closeDashMenu();
08149:   } else if(leavingView === 'dashboard'){
08150:     $('#app-root').classList.remove('dash-mode');
08151:     closeDashMenu();
08152:   }
08153: 
08154:   if(enteringView === 'utama') invokeViewRenderer_(enteringView, renderUtama, 'renderUtama');
08155:   if(enteringView === 'mesin') invokeViewRenderer_(enteringView, renderMesinView, 'renderMesinView');
08156:   if(enteringView === 'tanggal') invokeViewRenderer_(enteringView, renderTanggalView, 'renderTanggalView');
08157:   if(enteringView === 'pelapor') invokeViewRenderer_(enteringView, renderPelaporView, 'renderPelaporView');
08158:   if(enteringView === 'group') invokeViewRenderer_(enteringView, renderGroupView, 'renderGroupView');
08159:   if(enteringView === 'dashboard') invokeViewRenderer_(enteringView, renderDashboardView, 'renderDashboardView');
08160:   if(enteringView === 'durasi') invokeViewRenderer_(enteringView, renderDurasiView, 'renderDurasiView');
08161:   if(enteringView === 'correlation') invokeViewRenderer_(enteringView, renderCorrelationView, 'renderCorrelationView');
08162:   if(enteringView === 'diagnostic') invokeViewRenderer_(enteringView, renderDiagnosticView, 'renderDiagnosticView');
~~~

## function attachSparepartPaginationHandlers(
### Around line 14877
~~~text
14865:     if(totalPages>9 && p!==1 && p!==totalPages && Math.abs(p-page)>2) continue;
14866:     if(last && p-last>1) nav += '<span style="padding:0 3px;color:var(--text-dim);">…</span>';
14867:     nav += '<button type="button" data-pg="'+p+'" class="'+(p===page?'active':'')+'">'+p+'</button>';
14868:     last=p;
14869:   }
14870:   nav += '<button type="button" data-sp-pg-action="next" '+(page>=totalPages?'disabled':'')+'>Halaman Selanjutnya</button>'+
14871:     '<button type="button" data-sp-pg-action="last" '+(page>=totalPages?'disabled':'')+'>Halaman Akhir</button>';
14872:   const from=totalRows ? (SP_COLLECT_PAGE_SIZE===0?1:(page-1)*SP_COLLECT_PAGE_SIZE+1) : 0;
14873:   const to=SP_COLLECT_PAGE_SIZE===0?totalRows:Math.min(totalRows,page*SP_COLLECT_PAGE_SIZE);
14874:   return '<div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:center;">'+sizeHtml+
14875:     '<span style="color:var(--text-dim);font-size:11.5px;">Menampilkan '+from+'–'+to+' dari '+totalRows+' data</span>'+nav+'</div>';
14876: }
14877: function attachSparepartPaginationHandlers(pager){
14878:   $$('button[data-pg]', pager).forEach(btn=> btn.addEventListener('click', ()=>{
14879:     const pg = Number(btn.dataset.pg);
14880:     if(!pg || btn.disabled) return;
14881:     SP_COLLECT_PAGE = pg;
14882:     renderSparepartCollectTable();
14883:   }));
14884:   $$('button[data-sp-pg-action]', pager).forEach(btn=>btn.addEventListener('click',()=>{
14885:     if(btn.disabled)return;
14886:     const rows=sparepartCollectFilteredSorted();
14887:     const pages=SP_COLLECT_PAGE_SIZE===0?1:Math.max(1,Math.ceil(rows.length/SP_COLLECT_PAGE_SIZE));
14888:     const action=btn.dataset.spPgAction;
14889:     if(action==='first')SP_COLLECT_PAGE=1;
14890:     if(action==='prev')SP_COLLECT_PAGE=Math.max(1,SP_COLLECT_PAGE-1);
14891:     if(action==='next')SP_COLLECT_PAGE=Math.min(pages,SP_COLLECT_PAGE+1);
14892:     if(action==='last')SP_COLLECT_PAGE=pages;
14893:     renderSparepartCollectTable();
14894:   }));
14895:   const sizeSel=$('select[data-sp-page-size]',pager);
14896:   if(sizeSel) sizeSel.addEventListener('change',()=>{
14897:     SP_COLLECT_PAGE_SIZE=Number(sizeSel.value);
14898:     SP_COLLECT_PAGE=1;
14899:     renderSparepartCollectTable();
14900:   });
14901: }
14902: 
14903: async function setDailyCollectionStatus(id, collected){
14904:   const nextStatus = collected ? 'COMPLETED' : 'PENDING';
14905:   const actor = (CURRENT_USER && (CURRENT_USER.displayName || CURRENT_USER.username)) || '';
14906:   if(!WEB_APP_URL) throw new Error('Backend Cloudflare belum terhubung. Status collection tidak diubah agar data lintas perangkat tetap konsisten.');
14907:   await apiPost({ action:'updateSparepartSap', id, status:nextStatus, sapDoc:'', pic:actor });
14908:   setSparepartSapEntry(id, { status:nextStatus, sapDoc:'', pic:actor, updatedAt:new Date().toISOString() });
14909: }
14910: 
14911: function attachSparepartHandlers(root){
14912:   $$('.sp-detail', root).forEach(btn=>{
14913:     btn.addEventListener('click', (ev)=>{ ev.stopPropagation(); openDetail(btn.dataset.id); });
14914:   });
14915:   $$('.sp-collect-toggle', root).forEach(cb=>{
14916:     cb.addEventListener('change', async ()=>{
14917:       const id = cb.dataset.id;
14918:       const wanted = cb.checked;
14919:       cb.disabled = true;
14920:       const row = cb.closest('tr');
14921:       try{
14922:         await setDailyCollectionStatus(id, wanted);
14923:         if(row) row.classList.toggle('is-collected', wanted);
14924:         const label = cb.closest('.sp-collect-check')?.querySelector('.sp-collect-check-label');
14925:         const ico = cb.closest('.sp-collect-check')?.querySelector('i');
14926:         if(label) label.textContent = wanted ? 'Sudah' : 'Belum';
14927:         if(ico) ico.className = `ph-bold ${wanted?'ph-check':'ph-package'}`;
14928:         renderSparepartCollectDash();
14929:         toast(wanted ? 'Ditandai: sudah dicollect Warehouse dan diinput ke SAP.' : 'Status dikembalikan menjadi belum dicollect.');
14930:         // Jika filter hanya menampilkan salah satu status, refresh list agar record
14931:         // langsung pindah dari antrian pending ke hasil completed (atau sebaliknya).
14932:         if($('#filter-sparepart-collection')?.value) renderSparepartCollectTable();
14933:       }catch(e){
14934:         cb.checked = !wanted;
14935:         toast(e.message || 'Gagal menyimpan status Daily Collection.', true);
14936:       }finally{
14937:         cb.disabled = false;
14938:       }
14939:     });
14940:   });
14941: }
~~~

## function renderSparepartCollectTable(
### Around line 14796
~~~text
14784:     return true;
14785:   });
14786: 
14787:   rows.sort((a,b)=>{
14788:     if(sortBy==='date-asc') return sparepartEntryTime(a.entry) - sparepartEntryTime(b.entry);
14789:     if(sortBy==='material-asc') return String(a.entry['Nama Material']||'').localeCompare(String(b.entry['Nama Material']||''));
14790:     if(sortBy==='qty-desc') return sparepartEntryTotalQty(b.entry) - sparepartEntryTotalQty(a.entry);
14791:     return sparepartEntryTime(b.entry) - sparepartEntryTime(a.entry);
14792:   });
14793:   return rows;
14794: }
14795: 
14796: function renderSparepartCollectTable(){
14797:   const tbody = $('#sp-collect-tbody');
14798:   const empty = $('#sp-collect-empty');
14799:   const pager = $('#sp-collect-pagination');
14800:   if(!tbody) return;
14801: 
14802:   const rows = sparepartCollectFilteredSorted();
14803:   if(!rows.length){
14804:     tbody.innerHTML = '';
14805:     empty.style.display = 'block';
14806:     pager.innerHTML = '';
14807:     return;
14808:   }
14809:   empty.style.display = 'none';
14810: 
14811:   const totalPages = SP_COLLECT_PAGE_SIZE===0 ? 1 : Math.max(1, Math.ceil(rows.length / SP_COLLECT_PAGE_SIZE));
14812:   if(SP_COLLECT_PAGE > totalPages) SP_COLLECT_PAGE = totalPages;
14813:   const startIdx = SP_COLLECT_PAGE_SIZE===0 ? 0 : (SP_COLLECT_PAGE-1) * SP_COLLECT_PAGE_SIZE;
14814:   const pageRows = SP_COLLECT_PAGE_SIZE===0 ? rows : rows.slice(startIdx, startIdx + SP_COLLECT_PAGE_SIZE);
14815: 
14816:   tbody.innerHTML = pageRows.map(({entry:e, sap})=>{
14817:     const id = e['ID'];
14818:     const detail = parseSparepartDetail(e);
14819:     const materialHtml = detail.length
14820:       ? detail.filter(d=>d.nama).map(d=> wikiLinkHtml('sparepart', d.nama, d.nama)).join(', ')
14821:       : escapeHtml(e['Nama Material']||'(Tanpa nama material)');
14822:     const mesinKey = e['Kode Mesin'] || e['Nama Mesin'];
14823:     const mesinHtml = mesinKey ? wikiLinkHtml('mesin', mesinKey, e['Nama Mesin']||'-') : escapeHtml(e['Nama Mesin']||'-');
14824:     const teknisiHtml = e['Nama Pelapor'] ? splitPelaporNames(e['Nama Pelapor']).map(n=>wikiLinkHtml('personil', n, n)).join(', ') : '-';
14825:     const wo = e['Nomor WO'] || e['No WO'] || e['WO'] || '-';
14826:     const qty = sparepartEntryTotalQty(e);
14827:     const collected = (sap.status||'PENDING') === 'COMPLETED';
14828:     return `
14829:     <tr class="${collected?'is-collected':''}" data-id="${escapeHtml(id)}">
14830:       <td class="sp-collect-mark-cell">
14831:         <label class="sp-collect-check" title="${collected?'Sudah dicollect Warehouse dan diinput ke SAP':'Tandai jika Warehouse sudah meng-collect dan menginput ke SAP'}">
14832:           <input type="checkbox" class="sp-collect-toggle" data-id="${escapeHtml(id)}" ${collected?'checked':''}>
14833:           <span class="sp-collect-check-ui"><i class="ph-bold ${collected?'ph-check':'ph-package'}"></i></span>
14834:           <span class="sp-collect-check-label">${collected?'Sudah':'Belum'}</span>
14835:         </label>
14836:       </td>
14837:       <td>${fmtDate(e['Tanggal'])}</td>
14838:       <td style="font-family:var(--font-mono);">${escapeHtml(id)}</td>
14839:       <td>${mesinHtml}</td>
14840:       <td>${escapeHtml(wo)}</td>
14841:       <td>${teknisiHtml}</td>
14842:       <td class="cell-material">${materialHtml || '(Tanpa nama material)'}<div style="font-size:10.5px;color:var(--text-dim);font-family:var(--font-mono);">SAP: ${escapeHtml(e['Material Number SAP']||'-')}</div></td>
14843:       <td style="text-align:center;">${qty}</td>
14844:       <td>
14845:         <div style="display:flex;gap:4px;">
14846:           <button type="button" class="btn btn-sm btn-ghost sp-detail" data-id="${escapeHtml(id)}" title="Lihat Detail Logbook"><i class="ph-bold ph-eye"></i><span class="sp-detail-label"> Detail</span></button>
14847:         </div>
14848:       </td>
14849:     </tr>`;
14850:   }).join('');
14851: 
14852:   pager.innerHTML = renderSparepartPaginationHtml(SP_COLLECT_PAGE, totalPages, rows.length);
14853:   attachSparepartHandlers(tbody);
14854:   attachSparepartPaginationHandlers(pager);
14855: }
14856: 
14857: function renderSparepartPaginationHtml(page, totalPages, totalRows){
14858:   const sizeOptions=[10,25,50,100,0];
14859:   const sizeHtml='<label style="font-size:11.5px;color:var(--text-dim);">Tampilkan</label><select data-sp-page-size style="height:32px;min-width:82px;">'+
14860:     sizeOptions.map(v=>'<option value="'+v+'" '+(SP_COLLECT_PAGE_SIZE===v?'selected':'')+'>'+(v===0?'Semua':v)+'</option>').join('')+'</select>';
~~~

## function applySparepartFilters(
### Around line 14763
~~~text
14751:       <div class="l" style="margin-top:6px;">${completed} sudah dicollect &amp; diinput SAP · ${pending} masih menunggu dari ${rows.length} record pemakaian</div>
14752:     </div>`;
14753:   const strip = $('#sparepart-stat-strip');
14754:   if(strip){
14755:     strip.innerHTML = `
14756:       <div class="stat-chip"><div class="n">${rows.length}</div><div class="l">Record Pemakaian</div></div>
14757:       <div class="stat-chip"><div class="n" style="color:var(--green)">${completed}</div><div class="l">Sudah Collect + SAP</div></div>
14758:       <div class="stat-chip"><div class="n" style="color:var(--amber)">${pending}</div><div class="l">Belum Collect</div></div>
14759:     `;
14760:   }
14761: }
14762: 
14763: function applySparepartFilters(){
14764:   SP_COLLECT_PAGE = 1;
14765:   renderSparepartCollectTable();
14766: }
14767: 
14768: function sparepartCollectFilteredSorted(){
14769:   const q = ($('#search-sparepart').value || '').toLowerCase();
14770:   const collectionF = $('#filter-sparepart-collection') ? $('#filter-sparepart-collection').value : '';
14771:   const sortBy = $('#sort-sparepart') ? $('#sort-sparepart').value : 'date-desc';
14772:   let rows = sparepartRows();
14773: 
14774:   rows = rows.filter(({entry:e, sap})=>{
14775:     const collectionStatus = (sap.status||'PENDING') === 'COMPLETED' ? 'COMPLETED' : 'PENDING';
14776:     if(collectionF && collectionStatus !== collectionF) return false;
14777:     if(q){
14778:       const hay = [
14779:         e['Nama Material'], e['Material Number SAP'], e['Nama Mesin'], e['Kode Mesin'],
14780:         e['ID'], e['Nomor WO'], e['No WO'], e['Nama Pelapor'], e['Nama Unit'],
14781:       ].join(' ').toLowerCase();
14782:       if(!hay.includes(q)) return false;
14783:     }
14784:     return true;
14785:   });
14786: 
14787:   rows.sort((a,b)=>{
14788:     if(sortBy==='date-asc') return sparepartEntryTime(a.entry) - sparepartEntryTime(b.entry);
14789:     if(sortBy==='material-asc') return String(a.entry['Nama Material']||'').localeCompare(String(b.entry['Nama Material']||''));
14790:     if(sortBy==='qty-desc') return sparepartEntryTotalQty(b.entry) - sparepartEntryTotalQty(a.entry);
14791:     return sparepartEntryTime(b.entry) - sparepartEntryTime(a.entry);
14792:   });
14793:   return rows;
14794: }
14795: 
14796: function renderSparepartCollectTable(){
14797:   const tbody = $('#sp-collect-tbody');
14798:   const empty = $('#sp-collect-empty');
14799:   const pager = $('#sp-collect-pagination');
14800:   if(!tbody) return;
14801: 
14802:   const rows = sparepartCollectFilteredSorted();
14803:   if(!rows.length){
14804:     tbody.innerHTML = '';
14805:     empty.style.display = 'block';
14806:     pager.innerHTML = '';
14807:     return;
14808:   }
14809:   empty.style.display = 'none';
14810: 
14811:   const totalPages = SP_COLLECT_PAGE_SIZE===0 ? 1 : Math.max(1, Math.ceil(rows.length / SP_COLLECT_PAGE_SIZE));
14812:   if(SP_COLLECT_PAGE > totalPages) SP_COLLECT_PAGE = totalPages;
14813:   const startIdx = SP_COLLECT_PAGE_SIZE===0 ? 0 : (SP_COLLECT_PAGE-1) * SP_COLLECT_PAGE_SIZE;
14814:   const pageRows = SP_COLLECT_PAGE_SIZE===0 ? rows : rows.slice(startIdx, startIdx + SP_COLLECT_PAGE_SIZE);
14815: 
14816:   tbody.innerHTML = pageRows.map(({entry:e, sap})=>{
14817:     const id = e['ID'];
14818:     const detail = parseSparepartDetail(e);
14819:     const materialHtml = detail.length
14820:       ? detail.filter(d=>d.nama).map(d=> wikiLinkHtml('sparepart', d.nama, d.nama)).join(', ')
14821:       : escapeHtml(e['Nama Material']||'(Tanpa nama material)');
14822:     const mesinKey = e['Kode Mesin'] || e['Nama Mesin'];
14823:     const mesinHtml = mesinKey ? wikiLinkHtml('mesin', mesinKey, e['Nama Mesin']||'-') : escapeHtml(e['Nama Mesin']||'-');
14824:     const teknisiHtml = e['Nama Pelapor'] ? splitPelaporNames(e['Nama Pelapor']).map(n=>wikiLinkHtml('personil', n, n)).join(', ') : '-';
14825:     const wo = e['Nomor WO'] || e['No WO'] || e['WO'] || '-';
14826:     const qty = sparepartEntryTotalQty(e);
14827:     const collected = (sap.status||'PENDING') === 'COMPLETED';
~~~

## const $ = (sel
### Around line 7207
~~~text
07195:     console.error('[RBAC SAVE FAILED]', {stage, error:err, backend:WEB_APP_URL});
07196:     return false;
07197:   }finally{
07198:     if(saveBtn) saveBtn.disabled = false;
07199:   }
07200: }
07201: // Penanda agar patch Tampilan Sederhana lama di bagian bawah file TIDAK membungkus
07202: // fungsi ini lagi. Fungsi di atas sudah menyimpan RBAC + LC secara atomik.
07203: handleSavePermissions_.__lcAtomic = true;
07204: 
07205: let SPAREPART_STATUS = {}; // {entryId: 'DONE' | 'PENDING'} — status validasi collect admin gudang
07206: 
07207: const $ = (sel, root=document) => root.querySelector(sel);
07208: const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
07209: 
07210: /* ---------------- PAGINATION STANDAR GLOBAL ----------------
07211:    Dipakai oleh halaman/list/table yang dapat berisi banyak data.
07212:    Pilihan: 10 / 25 / 50 / 100 / Semua.
07213:    Tidak mengubah data sumber; hanya mengatur item yang tampil di browser. */
07214: const UNIVERSAL_PAGE_SIZE_OPTIONS = [10,25,50,100,0];
07215: const UNIVERSAL_PAGINATION_TARGETS = [
07216:   'list-utama','list-mesin','list-tanggal','list-pelapor','list-group','list-durasi',
07217:   'database-grid','list-patrol-temuan','list-patrol-riwayat','kb-list','kb-suggest-list',
07218:   'list-rca-saved','list-project-report','list-sparepart-eta','list-sparepart-opname',
07219:   'list-sparepart-warehouse','sparepart-lokasi-table','mbd-tbody','ryt-tbody','rhc-tbody',
07220:   'ect-tbody','cr-tbody','eng-tbody','machine-list-table','personil-list-table','pct-list-table',
07221:   'rbac-user-table','pmc-list-wrap','mtg-list-wrap','ipal-saved-list','list-expert-finder',
07222:   'pi-personnel-grid','pi-sr-grid','pi-ss-history','pi-hs-history','pi-dash-gap-table','kd-grid',
07223:   'an-machine-grid','kpi-kerja-table','corr-pairs-table','pareto-table','imp-preview-table','sp-opname-checklist'
07224: ];
07225: const UNIVERSAL_PAGINATION_STATE = new Map();
07226: 
07227: (function injectUniversalPaginationStyle(){
07228:   if(document.getElementById('universal-pagination-style')) return;
07229:   const style=document.createElement('style');
07230:   style.id='universal-pagination-style';
07231:   style.textContent=`
07232:     .universal-pager{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:12px 0 18px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}
07233:     .universal-pager .up-left,.universal-pager .up-right{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
07234:     .universal-pager label,.universal-pager .up-info{font-size:11.5px;color:var(--text-dim);font-weight:600}
07235:     .universal-pager select{min-width:86px;height:34px}
07236:     .universal-pager button{min-width:34px;height:34px;padding:0 9px;border:1px solid var(--line);border-radius:8px;background:var(--panel-2);color:var(--text);font:700 11px/1 var(--font-body);cursor:pointer}
07237:     .universal-pager button:hover:not(:disabled){border-color:var(--red);color:var(--red)}
07238:     .universal-pager button.active{background:var(--red);border-color:var(--red);color:var(--on-accent)}
07239:     .universal-pager button:disabled{opacity:.4;cursor:not-allowed}
07240:     @media(max-width:640px){.universal-pager{align-items:stretch}.universal-pager .up-left,.universal-pager .up-right{width:100%}.universal-pager .up-right{justify-content:center}.universal-pager .up-info{width:100%}}
07241:   `;
07242:   document.head.appendChild(style);
07243: })();
07244: function universalPaginationItems_(container,id){
07245:   if(!container) return [];
07246:   if(id==='list-tanggal' || id==='list-durasi') return Array.from(container.querySelectorAll('.entry'));
07247:   if(container.tagName==='TBODY') return Array.from(container.children).filter(x=>x.tagName==='TR');
07248:   if(container.tagName==='TABLE'){
07249:     const tb=container.tBodies && container.tBodies[0];
07250:     return tb ? Array.from(tb.rows) : [];
07251:   }
07252:   const table=container.querySelector(':scope > table');
07253:   if(table && table.tBodies && table.tBodies[0]) return Array.from(table.tBodies[0].rows);
07254:   const direct=Array.from(container.children).filter(x=>!x.classList.contains('empty-state'));
07255:   if(direct.length===1){
07256:     const wrap=direct[0];
07257:     if(wrap.tagName==='TABLE' && wrap.tBodies && wrap.tBodies[0]) return Array.from(wrap.tBodies[0].rows);
07258:     const nestedTable=wrap.querySelector(':scope > table');
07259:     if(nestedTable && nestedTable.tBodies && nestedTable.tBodies[0]) return Array.from(nestedTable.tBodies[0].rows);
07260:     const nested=Array.from(wrap.children).filter(x=>!x.classList.contains('group-header')&&!x.classList.contains('section-title')&&!x.classList.contains('empty-state'));
07261:     if(nested.length>1) return nested;
07262:   }
07263:   return direct;
07264: }
07265: function universalPagerAnchor_(container){
07266:   if(container.tagName==='TBODY') return container.closest('table') || container;
07267:   return container;
07268: }
07269: function universalPaginationState_(id){
07270:   if(!UNIVERSAL_PAGINATION_STATE.has(id)) UNIVERSAL_PAGINATION_STATE.set(id,{page:1,size:10,total:-1,observer:null,scheduled:false});
07271:   return UNIVERSAL_PAGINATION_STATE.get(id);
~~~

## const $$ =
### Around line 7208
~~~text
07196:     return false;
07197:   }finally{
07198:     if(saveBtn) saveBtn.disabled = false;
07199:   }
07200: }
07201: // Penanda agar patch Tampilan Sederhana lama di bagian bawah file TIDAK membungkus
07202: // fungsi ini lagi. Fungsi di atas sudah menyimpan RBAC + LC secara atomik.
07203: handleSavePermissions_.__lcAtomic = true;
07204: 
07205: let SPAREPART_STATUS = {}; // {entryId: 'DONE' | 'PENDING'} — status validasi collect admin gudang
07206: 
07207: const $ = (sel, root=document) => root.querySelector(sel);
07208: const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
07209: 
07210: /* ---------------- PAGINATION STANDAR GLOBAL ----------------
07211:    Dipakai oleh halaman/list/table yang dapat berisi banyak data.
07212:    Pilihan: 10 / 25 / 50 / 100 / Semua.
07213:    Tidak mengubah data sumber; hanya mengatur item yang tampil di browser. */
07214: const UNIVERSAL_PAGE_SIZE_OPTIONS = [10,25,50,100,0];
07215: const UNIVERSAL_PAGINATION_TARGETS = [
07216:   'list-utama','list-mesin','list-tanggal','list-pelapor','list-group','list-durasi',
07217:   'database-grid','list-patrol-temuan','list-patrol-riwayat','kb-list','kb-suggest-list',
07218:   'list-rca-saved','list-project-report','list-sparepart-eta','list-sparepart-opname',
07219:   'list-sparepart-warehouse','sparepart-lokasi-table','mbd-tbody','ryt-tbody','rhc-tbody',
07220:   'ect-tbody','cr-tbody','eng-tbody','machine-list-table','personil-list-table','pct-list-table',
07221:   'rbac-user-table','pmc-list-wrap','mtg-list-wrap','ipal-saved-list','list-expert-finder',
07222:   'pi-personnel-grid','pi-sr-grid','pi-ss-history','pi-hs-history','pi-dash-gap-table','kd-grid',
07223:   'an-machine-grid','kpi-kerja-table','corr-pairs-table','pareto-table','imp-preview-table','sp-opname-checklist'
07224: ];
07225: const UNIVERSAL_PAGINATION_STATE = new Map();
07226: 
07227: (function injectUniversalPaginationStyle(){
07228:   if(document.getElementById('universal-pagination-style')) return;
07229:   const style=document.createElement('style');
07230:   style.id='universal-pagination-style';
07231:   style.textContent=`
07232:     .universal-pager{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:12px 0 18px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}
07233:     .universal-pager .up-left,.universal-pager .up-right{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
07234:     .universal-pager label,.universal-pager .up-info{font-size:11.5px;color:var(--text-dim);font-weight:600}
07235:     .universal-pager select{min-width:86px;height:34px}
07236:     .universal-pager button{min-width:34px;height:34px;padding:0 9px;border:1px solid var(--line);border-radius:8px;background:var(--panel-2);color:var(--text);font:700 11px/1 var(--font-body);cursor:pointer}
07237:     .universal-pager button:hover:not(:disabled){border-color:var(--red);color:var(--red)}
07238:     .universal-pager button.active{background:var(--red);border-color:var(--red);color:var(--on-accent)}
07239:     .universal-pager button:disabled{opacity:.4;cursor:not-allowed}
07240:     @media(max-width:640px){.universal-pager{align-items:stretch}.universal-pager .up-left,.universal-pager .up-right{width:100%}.universal-pager .up-right{justify-content:center}.universal-pager .up-info{width:100%}}
07241:   `;
07242:   document.head.appendChild(style);
07243: })();
07244: function universalPaginationItems_(container,id){
07245:   if(!container) return [];
07246:   if(id==='list-tanggal' || id==='list-durasi') return Array.from(container.querySelectorAll('.entry'));
07247:   if(container.tagName==='TBODY') return Array.from(container.children).filter(x=>x.tagName==='TR');
07248:   if(container.tagName==='TABLE'){
07249:     const tb=container.tBodies && container.tBodies[0];
07250:     return tb ? Array.from(tb.rows) : [];
07251:   }
07252:   const table=container.querySelector(':scope > table');
07253:   if(table && table.tBodies && table.tBodies[0]) return Array.from(table.tBodies[0].rows);
07254:   const direct=Array.from(container.children).filter(x=>!x.classList.contains('empty-state'));
07255:   if(direct.length===1){
07256:     const wrap=direct[0];
07257:     if(wrap.tagName==='TABLE' && wrap.tBodies && wrap.tBodies[0]) return Array.from(wrap.tBodies[0].rows);
07258:     const nestedTable=wrap.querySelector(':scope > table');
07259:     if(nestedTable && nestedTable.tBodies && nestedTable.tBodies[0]) return Array.from(nestedTable.tBodies[0].rows);
07260:     const nested=Array.from(wrap.children).filter(x=>!x.classList.contains('group-header')&&!x.classList.contains('section-title')&&!x.classList.contains('empty-state'));
07261:     if(nested.length>1) return nested;
07262:   }
07263:   return direct;
07264: }
07265: function universalPagerAnchor_(container){
07266:   if(container.tagName==='TBODY') return container.closest('table') || container;
07267:   return container;
07268: }
07269: function universalPaginationState_(id){
07270:   if(!UNIVERSAL_PAGINATION_STATE.has(id)) UNIVERSAL_PAGINATION_STATE.set(id,{page:1,size:10,total:-1,observer:null,scheduled:false});
07271:   return UNIVERSAL_PAGINATION_STATE.get(id);
07272: }
~~~

## function latestLogbookForMachine_
### Around line 16267
~~~text
16255:   return !!(rn && mn && rn===mn);
16256: }
16257: function latestEntryPerMachine(){
16258:   const map = {};
16259:   sotEntries(ENTRIES).forEach(e=>{
16260:     const keys=[String(e['Nama Mesin']||''),String(e['Kode Mesin']||'')].filter(Boolean);
16261:     keys.forEach(k=>{
16262:       if(!map[k] || machineEventTs_(e)>machineEventTs_(map[k])) map[k]=e;
16263:     });
16264:   });
16265:   return map;
16266: }
16267: function latestLogbookForMachine_(machine){
16268:   let best=null,bestTs=-Infinity;
16269:   sotEntries(ENTRIES).forEach(e=>{
16270:     if(!machineMatchRecord_(e,machine))return;
16271:     const t=machineEventTs_(e);if(t>bestTs){best=e;bestTs=t;}
16272:   });
16273:   return best;
16274: }
16275: 
16276: // [FIX] HOME_PRIORITY_KODE_MESIN & HOME_MACHINE_FILTER dipindah ke atas
16277: // (dekat deklarasi PREVIOUS_ACTIVE_VIEW/DASHBOARD_TIMER_INTERVAL) — lihat
16278: // catatan di sana. Jangan dideklarasikan ulang di sini.
16279: function dashboardMachineList(){
16280:   if(!Array.isArray(MACHINES)) return [];
16281:   let list = MACHINES
16282:     .slice()
16283:     .sort((a,b)=> String(a['Nama Mesin']||'').localeCompare(String(b['Nama Mesin']||'')))
16284:     .map(m=> ({ kode: m['Kode Mesin']||'', nama: m['Nama Mesin']||'' }))
16285:     .filter(m=> m.nama);
16286:   if(HOME_MACHINE_FILTER === 'priority'){
16287:     list = list.filter(m=> HOME_PRIORITY_KODE_MESIN.includes(m.kode));
16288:   }
16289:   return list;
16290: }
16291: 
16292: function dashTimerStartIso(e){
16293:   const tgl = e['Tanggal'];
16294:   if(!tgl) return '';
16295:   const wkt = fmtTime(e['Waktu']) || '00:00';
16296:   const d = new Date(`${String(tgl).slice(0,10)}T${wkt}:00`);
16297:   return isNaN(d) ? '' : d.toISOString();
16298: }
16299: 
16300: function pmSeverityKey(sev){
16301:   if(sev === 'Kritikal') return 'kritikal';
16302:   if(sev === 'Perlu Perhatian') return 'perhatian';
16303:   if(sev === 'Normal') return 'normal';
16304:   return 'none';
16305: }
16306: function healthStatusKey(hs){
16307:   if(!hs || hs.label === 'Belum Ada Data') return 'none';
16308:   if(hs.label === 'Excellent' || hs.label === 'Good') return 'normal';
16309:   if(hs.label === 'Perlu Perhatian') return 'perhatian';
16310:   return 'kritikal'; // Critical
16311: }
16312: // [EDIT] Statistik MTBF/MTTR/Lost Time per mesin, dihitung HANYA dari entri
16313: // breakdown 24 jam terakhir (dipakai untuk mengisi deskripsi card Home,
16314: // menggantikan teks deskripsi masalah/temuan patrol yang lama).
16315: function machine24hStats(nama){
16316:   const now = Date.now();
16317:   // [FIX] Sama seperti bug di renderHomeSmartResume(): clampToSot() di sini
16318:   // memaksa cutoff jadi 1 Sept 2026 selama tanggal sistem masih SEBELUM itu,
16319:   // sehingga "cutoff > now" dan filter di bawah mustahil terpenuhi -- deskripsi
16320:   // kartu mesin (MTBF/MTTR/Lost Time) di Beranda selalu kosong. Jendela
16321:   // rolling 24 jam tidak perlu clamp ke SOT_CUTOFF_DATE (itu untuk menyaring
16322:   // data historis OneNote berbasis field 'Tanggal', bukan aktivitas real-time).
16323:   const cutoff = now - 24*60*60*1000;
16324:   const entries = (typeof ENTRIES !== 'undefined' && Array.isArray(ENTRIES)) ? ENTRIES.filter(e=>{
16325:     if(e['Nama Mesin'] !== nama) return false;
16326:     const t = new Date(e['Timestamp Input']).getTime();
16327:     return !isNaN(t) && t >= cutoff && t <= now;
16328:   }) : [];
16329:   const breakdownEntries = entries.filter(anIsBreakdown);
16330:   const bkDates = breakdownEntries.map(e=>new Date(e['Tanggal'])).filter(d=>!isNaN(d)).sort((a,b)=>a-b);
16331:   let mtbfJam = null;
~~~

## function latestPatrolForMachine_
### Around line 19137
~~~text
19125:   return summary.concat(full);
19126: }
19127: function latestPmStatusPerMachine(){
19128:   const map = {};
19129:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19130:     const keys=[String(r.namaMesin||''),String(r.kodeMesin||'')].filter(Boolean);
19131:     keys.forEach(key=>{
19132:       if(!map[key] || patrolEventTs_(r)>patrolEventTs_(map[key])) map[key]=r;
19133:     });
19134:   });
19135:   return map;
19136: }
19137: function latestPatrolForMachine_(machine){
19138:   let best=null,bestTs=-Infinity;
19139:   homePatrolRecords_().filter(isSotPatrolRecord_).forEach(r=>{
19140:     if(!machineMatchRecord_(r,machine))return;
19141:     const t=patrolEventTs_(r);if(t>bestTs){best=r;bestTs=t;}
19142:   });
19143:   return best;
19144: }
19145: function machineLatestStatusSnapshot_(machine){
19146:   const log=latestLogbookForMachine_(machine), patrol=latestPatrolForMachine_(machine);
19147:   const logTs=machineEventTs_(log), patrolTs=patrolEventTs_(patrol);
19148:   if(!log && !patrol) return {key:'none',source:'none',sourceLabel:'Belum Ada Data',ts:-Infinity,record:null,description:'Belum ada data Logbook atau Patrol sejak 1 September 2026.'};
19149:   if(patrol && patrolTs>=logTs){
19150:     return {key:pmSeverityKey(patrol.severity),source:'patrol',sourceLabel:'Patrol',ts:patrolTs,record:patrol,
19151:       description:patrol.deskripsiTemuan||patrol.titikInspeksi||'Patrol tersimpan tanpa catatan temuan.'};
19152:   }
19153:   return {key:dashStatusKey(log && log['Status']),source:'logbook',sourceLabel:'Logbook',ts:logTs,record:log,
19154:     description:(log&&log['Deskripsi Masalah'])||'Logbook tersimpan tanpa deskripsi masalah.'};
19155: }
19156: function formatMachineStatusTime_(ts){
19157:   if(!Number.isFinite(ts)||ts<=0)return 'Belum ada waktu tercatat';
19158:   return new Date(ts).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
19159: }
19160: /* ---------------- PATROL HARIAN (checklist tablet-first) ---------------- */
19161: // Menggantikan form Predictive Maintenance lama, tapi tetap memakai data
19162: // layer yang sama (PM_REPORTS / LS_PM_KEY / apiGet('predictiveReports') /
19163: // apiPost({action:'savePredictiveReport'|'deletePredictiveReport'})) supaya
19164: // Visual Dashboard, Copilot, dan backend Cloudflare TIDAK perlu diubah.
19165: const PATROL_CHECKLIST_DEF = {
19166:   'Elektrikal': ['Panel bersih','Lampu indikator normal','Tidak ada alarm','Tidak ada bau gosong','Kabel aman','Fan panel normal','Suhu panel normal','E-Stop berfungsi normal'],
19167:   'Mekanikal': ['Suara normal','Getaran normal','Bearing normal','Coupling normal','Belt normal','Gear normal','Safety guard normal','Baut/mur kencang'],
19168:   'Pneumatic': ['Tekanan normal','Tidak ada kebocoran','Selang dalam kondisi baik','FRL (Filter-Regulator-Lubricator) normal'],
19169:   'Lubrikasi': ['Level oli normal','Tidak ada kebocoran oli','Grease cukup'],
19170:   'Housekeeping': ['Area bersih','Tidak ada tumpahan','Jalur aman/tidak terhalang','Petugas memakai APD','Guard/pelindung lengkap']
19171: };
19172: // [FITUR BARU] Toggle tampil/sembunyi per kategori General Checking (Elektrikal,
19173: // Mekanikal, Pneumatic, Lubrikasi, Housekeeping) di menu Patrol Harian, diatur
19174: // dari Master Koneksi > "Kategori General Checking — Patrol Harian". Disimpan
19175: // localStorage (biar langsung kepakai offline) + disinkron ke backend Apps
19176: // Script (Script Properties) via action 'patrolCategoryConfig' (GET) /
19177: // 'savePatrolCategoryConfig' (POST) -- pola sama persis dengan ANALITIK_CONFIG.
19178: // Key object HARUS sama persis dengan key di PATROL_CHECKLIST_DEF di atas.
19179: // Kategori yang belum pernah diatur (key tidak ada di object) dianggap AKTIF
19180: // (tampil) secara default -- lihat renderPatrolChecklist().
19181: let PATROL_CATEGORY_CONFIG = {};
19182: function loadPatrolCategoryConfigLocal(){
19183:   try{ return JSON.parse(localStorage.getItem(LS_PATROL_CATEGORY_CONFIG_KEY)||'{}') || {}; }
19184:   catch(e){ return {}; }
19185: }
19186: function savePatrolCategoryConfigLocal(cfg){
19187:   localStorage.setItem(LS_PATROL_CATEGORY_CONFIG_KEY, JSON.stringify(cfg));
19188:   PATROL_CATEGORY_CONFIG = cfg;
19189: }
19190: async function syncPatrolCategoryConfigFromBackend(){
19191:   PATROL_CATEGORY_CONFIG = loadPatrolCategoryConfigLocal();
19192:   if(!WEB_APP_URL) return PATROL_CATEGORY_CONFIG;
19193:   try{
19194:     const remote = await apiGet('patrolCategoryConfig');
19195:     if(remote && typeof remote === 'object') savePatrolCategoryConfigLocal(remote);
19196:   }catch(e){ /* action belum tersedia di backend; pakai cache lokal */ }
19197:   return PATROL_CATEGORY_CONFIG;
19198: }
19199: 
19200: // [FITUR BARU] Sebelumnya menu Setting "Kategori General Checking" cuma bisa
19201: // nyala/matikan kategori (Elektrikal/Mekanikal/dst), ISI ITEM di dalam tiap
~~~

## function currentMachineStatusSnapshot_
No match.

## omodos4.view
No match.

## Bantuan
### Around line 12026
~~~text
12014:   a.href = url;
12015:   a.download = `RCA_${String(machineName).replace(/[^a-z0-9]+/gi,'_')}_${new Date().toISOString().slice(0,10)}.doc`;
12016:   document.body.appendChild(a); a.click(); document.body.removeChild(a);
12017:   setTimeout(()=> URL.revokeObjectURL(url), 4000);
12018: }
12019: 
12020: /* =========================================================
12021:    INPUT REPORT (kategori: IPAL, RCA, dll)
12022:    ========================================================= */
12023: const REPORT_CATEGORIES = [
12024:   { key:'ipal',           icon:'💧', title:'Laporan IPAL', sub:'Catat pemeriksaan dan bahan kimia pengolahan air limbah.', enabled:true },
12025:   { key:'rca',            icon:'▦',  title:'RCA', sub:'Cari akar penyebab masalah dan catat tindakan perbaikan.', enabled:true },
12026:   { key:'ai',             icon:'✦',  title:'Analisa AI', sub:'Minta bantuan AI membaca data dan memberi saran. Tetap periksa hasilnya.', enabled:true },
12027:   { key:'report-hub',     icon:'🗂', title:'Riwayat Laporan', sub:'Lihat laporan yang sudah pernah disimpan.', enabled:true },
12028: ];
12029: let IPAL_CURRENT = null; // draft object sedang diedit
12030: 
12031: function renderReportView(){
12032:   $('#btn-report-back-cat').style.display = 'none';
12033:   $('#ipal-form-wrap').style.display = 'none';
12034:   $('#ipal-form-wrap').innerHTML = '';
12035:   const grid = $('#report-cat-grid');
12036:   grid.style.display = 'grid';
12037:   grid.innerHTML = REPORT_CATEGORIES.map(c => `
12038:     <div class="report-cat-card" data-cat="${c.key}">
12039:       <div class="report-cat-icon">${c.icon}</div>
12040:       <div class="report-cat-title">${escapeHtml(c.title)}${c.key==='report-hub' ? ' <span class="count" id="cnt-report-hub">0</span>' : ''}</div>
12041:       <div class="report-cat-sub">${escapeHtml(c.sub)}</div>
12042:     </div>
12043:   `).join('');
12044:   $$('.report-cat-card[data-cat]').forEach(card=>{
12045:     card.addEventListener('click', ()=>{
12046:       const key = card.dataset.cat;
12047:       const cat = REPORT_CATEGORIES.find(c=>c.key===key);
12048:       if(!cat || !cat.enabled) return;
12049:       if(key === 'rca'){ goToView('rca'); return; }
12050:       if(key === 'ipal'){ openIpalCategory(); return; }
12051:       if(key === 'ai'){ goToView('ai'); return; }
12052:       if(key === 'report-hub'){ goToView('report-hub'); return; }
12053:     });
12054:   });
12055: }
12056: 
12057: $('#btn-report-back-cat').addEventListener('click', ()=>{
12058:   $('#report-cat-grid').style.display = 'grid';
12059:   $('#ipal-form-wrap').style.display = 'none';
12060:   $('#btn-report-back-cat').style.display = 'none';
12061: });
12062: 
12063: function openIpalCategory(){
12064:   $('#report-cat-grid').style.display = 'none';
12065:   $('#btn-report-back-cat').style.display = '';
12066:   renderIpalLanding();
12067: }
12068: 
12069: function loadIpalReportsLocal(){
12070:   try{ return JSON.parse(localStorage.getItem(LS_IPAL_KEY) || '[]'); }
12071:   catch(e){ return []; }
12072: }
12073: function saveIpalReportsLocal(list){
12074:   localStorage.setItem(LS_IPAL_KEY, JSON.stringify(list));
12075: }
12076: // Kompatibilitas nama lama
12077: function loadIpalReports(){ return loadIpalReportsLocal(); }
12078: function saveIpalReports(list){ saveIpalReportsLocal(list); }
12079: 
12080: async function syncIpalReportsFromBackend(){
12081:   if(!WEB_APP_URL) return loadIpalReportsLocal();
12082:   try{
12083:     const remote = await apiGet('ipalReports');
12084:     if(Array.isArray(remote)){
12085:       const normalized = remote.map(r=>({
12086:         id: r.id || r.ID,
12087:         pelapor: r.pelapor || r.Pelapor || '',
12088:         bulan: r.bulan || r.Bulan || '',
12089:         outletLabel: r.outletLabel || r.OutletLabel || '',
12090:         daily: typeof r.daily === 'string' ? JSON.parse(r.daily || '{}') : (r.daily || (typeof r.DailyJSON === 'string' ? JSON.parse(r.DailyJSON||'{}') : {})),
~~~

### Around line 24066
~~~text
24054:         </div>
24055:       </div>
24056:     </div>
24057:     <div class="pi-profile-section">
24058:       <h4><i class="ph-bold ph-sparkle"></i> Smart Resume (Ringkasan Otomatis)</h4>
24059:       <p style="line-height:1.6;">${narrative}</p>
24060:     </div>
24061:     <div class="pi-profile-section">
24062:       <h4><i class="ph-bold ph-lightbulb"></i> Rekomendasi</h4>
24063:       <ul style="margin:0;padding-left:18px;line-height:1.7;">
24064:         ${rec.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}
24065:       </ul>
24066:       <div class="sub" style="margin-top:10px;">Rekomendasi dihasilkan 100% lokal dari data Logbook, Hard Skill/Soft Skill Assessment, Kaizen/Project Improvement, dan Meeting Action Item yang sudah tersimpan di aplikasi ini (tanpa API/LLM eksternal) — gunakan sebagai bantuan pengambilan keputusan, tetap verifikasi di lapangan.</div>
24067:     </div>
24068:   `;
24069:   $('#modal-bg').classList.add('active');
24070:   $('#btn-close-modal').addEventListener('click', closeModal);
24071: }
24072: 
24073: 
24074: function generatePiAiRecommendation(nama, tech, techScore, softScore, itemAvgs){
24075:   const belum = piBelumKompetenList(tech);
24076:   const softEntries = Object.entries(itemAvgs).filter(([,v])=>v!=null);
24077:   const weakSoft = softEntries.filter(([,v])=>v<=3).sort((a,b)=>a[1]-b[1]).map(([k])=>k);
24078:   const strongSoft = softEntries.filter(([,v])=>v>=4).map(([k])=>k);
24079: 
24080:   const strengths = [];
24081:   if(techScore!=null && techScore>=80) strengths.push('Kompetensi teknis kuat (' + techScore + '% unit kompetensi kompeten).');
24082:   if(strongSoft.length) strengths.push('Soft skill unggul pada: ' + strongSoft.join(', ') + '.');
24083:   if(!strengths.length) strengths.push('Belum cukup data untuk menyimpulkan kekuatan utama.');
24084: 
24085:   const gapSummary = [];
24086:   if(belum.length) gapSummary.push('Unit kompetensi teknis yang belum dikuasai: ' + belum.join('; ') + '.');
24087:   if(weakSoft.length) gapSummary.push('Aspek soft skill dengan skor rendah (≤3): ' + weakSoft.join(', ') + '.');
24088:   if(!belum.length && !weakSoft.length) gapSummary.push('Tidak ditemukan gap signifikan berdasarkan data yang tersedia.');
24089: 
24090:   const priorities = [];
24091:   belum.slice(0,3).forEach(b=>priorities.push('Teknis: ' + b));
24092:   weakSoft.slice(0,3).forEach(s=>priorities.push('Soft Skill: ' + s));
24093:   if(!priorities.length) priorities.push('Pertahankan performa saat ini, arahkan ke pengembangan lanjutan (stretch assignment).');
24094: 
24095:   const dev = [];
24096:   if(tech && tech.selfLearning && tech.selfLearning!=='-') dev.push('Self-Learning/Training (teknis): ' + tech.selfLearning.replace(/\n/g,' '));
24097:   if(tech && tech.mentoring && tech.mentoring!=='-') dev.push('Mentoring (teknis): ' + tech.mentoring.replace(/\n/g,' '));
24098:   if(tech && tech.coaching && tech.coaching!=='-') dev.push('Coaching (teknis): ' + tech.coaching.replace(/\n/g,' '));
24099:   if(weakSoft.length) dev.push('Coaching soft skill difokuskan pada: ' + weakSoft.join(', ') + ', melalui bimbingan langsung supervisor dan on-the-job feedback berkala.');
24100:   if(!dev.length) dev.push('Tidak ada rekomendasi pengembangan spesifik dari data saat ini.');
24101: 
24102:   return { gapSummary, strengths, priorities, dev };
24103: }
24104: 
24105: 
24106: function piRadarChart(canvasId, labels, values, datasetLabel, maxVal){
24107:   const safeLabels = Array.isArray(labels) ? labels : [];
24108:   const safeValues = Array.isArray(values) ? values : [];
24109:   if(!safeLabels.length || !safeValues.length){
24110:     piDestroyChart('radar_'+canvasId);
24111:     const canvas = document.getElementById(canvasId);
24112:     if(canvas){
24113:       const wrap = canvas.parentElement;
24114:       if(wrap) wrap.innerHTML = '<div class="wiki-empty">Belum ada data untuk ditampilkan.</div>';
24115:     }
24116:     return;
24117:   }
24118:   piRadarMulti(canvasId, safeLabels, safeValues, datasetLabel || 'Score', maxVal || 5);
24119: }
24120: 
24121: function openEmployeeProfile(nama){
24122:   const tech = piFindTech(nama);
24123:   const techScore = piTechScore(tech);
24124:   const softScore = piSoftskillLatestScore(nama);
24125:   const itemAvgs = piSoftskillItemAverages(nama);
24126:   const hist = piSoftskillHistory(nama);
24127:   const belum = piBelumKompetenList(tech);
24128:   const hardItems = piHardSkillFullItems(nama);
24129:   const hardRadar = piHardSkillRadarData(nama);
24130:   const photo = piPhotoUrl(nama);
~~~

### Around line 28088
~~~text
28076:     'energy-cost-toe':['Biaya energi','Lihat biaya energi dan TOE berdasarkan data yang tercatat.','Pilih periode atau tambahkan data.','Periksa angka sebelum menyimpan.'],
28077:     'corrective-report':['Laporan perbaikan','Catat tindakan perbaikan setelah masalah ditemukan.','Pilih tambah atau ubah data.','Isi tindakan dan hasilnya lalu simpan.'],
28078:     'energy-utility':['Energi dan air','Catat serta lihat pemakaian listrik, air, dan utilitas.','Pilih periode atau ambil data dari Excel.','Periksa hasil lalu simpan.'],
28079:     correlation:['Cari hubungan data','Bandingkan dua kelompok data untuk melihat apakah bergerak bersama.','Pilih data yang ingin dibandingkan.','Gunakan hasil sebagai petunjuk, bukan bukti penyebab.'],
28080:     diagnostic:['Panduan cari penyebab','Masukkan gejala agar sistem membantu mencari kemungkinan penyebab.','Pilih mesin atau gejala.','Baca saran dan periksa mesin sebelum bertindak.'],
28081:     knowledge:['Pusat pengetahuan','Simpan dan cari solusi, pelajaran, serta cara kerja yang pernah dicatat.','Cari topik atau tambah pengetahuan baru.','Buka artikel untuk membaca detail.'],
28082:     rca:['Analisa akar masalah','Susun RCA untuk mencari penyebab utama masalah.','Isi masalah dan bukti yang diketahui.','Periksa analisa lalu simpan laporan.'],
28083:     database:['Data mesin','Lihat informasi dasar setiap mesin.','Cari atau pilih mesin.','Buka mesin untuk membaca detailnya.'],
28084:     sparepart:['Suku cadang','Lihat stok, lokasi, PO, opname, dan data material.','Pilih bagian yang ingin dilihat.','Cari material lalu periksa data sebelum mengubahnya.'],
28085:     'expert-finder':['Cari teknisi berpengalaman','Cari orang yang pernah menangani mesin atau masalah tertentu.','Pilih konteks mesin atau masalah.','Baca bukti pengalaman yang tercatat.'],
28086:     'knowledge-graph':['Peta hubungan pengetahuan','Lihat hubungan antara mesin, orang, suku cadang, dan masalah.','Pilih titik yang ingin dilihat.','Baca hubungan sebelum membuka detail.'],
28087:     wiki:['Wikipedia Maintenance','Cari penjelasan mesin, personel, suku cadang, dan riwayat.','Ketik kata yang ingin dicari.','Pilih hasil untuk membaca detail.'],
28088:     ai:['Bantuan AI','Gunakan AI sebagai alat bantu membaca data, bukan pengganti keputusan manusia.','Tulis masalah atau pertanyaan.','Periksa jawaban dan data pendukung sebelum bertindak.'],
28089:     setting:['Pengaturan utama','Atur koneksi, pengguna, hak akses, mesin, Patrol, dan personel.','Pilih tab pengaturan.','Ubah hanya bagian yang diperlukan lalu simpan.'],
28090:     tema:['Tampilan aplikasi','Pilih tampilan yang paling nyaman dibaca.','Pilih tema atau mode sederhana.','Lihat hasilnya; data aplikasi tidak berubah.'],
28091:     'pi-dashboard':['Ringkasan kemampuan personel','Lihat ringkasan kemampuan seluruh personel.','Pilih kelompok atau orang bila tersedia.','Buka detail untuk melihat bukti penilaian.'],
28092:     'pi-personnel':['Data personel','Lihat profil pekerjaan dan data personel.','Cari nama orang.','Buka profil untuk membaca detail.'],
28093:     'pi-smart-resume':['Ringkasan personel','Buat ringkasan dari data personel yang sudah tercatat.','Pilih personel.','Periksa ringkasan sebelum menggunakannya.'],
28094:     'pi-softskill':['Penilaian perilaku','Lihat penilaian kemampuan perilaku personel.','Pilih personel atau periode.','Baca hasil sebagai bahan pengembangan.'],
28095:     'pi-hardskill':['Penilaian teknis','Lihat kemampuan teknis yang sudah dinilai.','Pilih personel atau unit kompetensi.','Baca bagian yang sudah mampu dan yang masih perlu belajar.']
28096:   });
28097: 
28098:   const VIEW_NAMES=Object.freeze({
28099:     dashboard:'Beranda',input:'Catat Logbook',utama:'Lihat Logbook','project-center':'Proyek & Perbaikan',
28100:     patrol:'Pemeriksaan Harian',sparepart:'Suku Cadang','corrective-report':'Laporan Perbaikan',report:'Buat Laporan',
28101:     'energy-utility':'Energi & Air','insights-hub':'Analisis & Pengetahuan','kpi-department':'Target Kerja Departemen',
28102:     'kpi-input':'Isi Target Kerja','machine-breakdown':'Riwayat Kerusakan Mesin','record-ytd':'Riwayat Mesin Tahunan',
28103:     'run-hour-comparison':'Bandingkan Jam Operasi','energy-cost-toe':'Biaya Energi','people-hub':'Orang & Rapat',
28104:     database:'Data Mesin',tema:'Tampilan Aplikasi',setting:'Pengaturan Utama'
28105:   });
28106: 
28107:   const GROUP_NAMES=Object.freeze({
28108:     report:'Laporan & Pekerjaan Lapangan',wtp:'Pengolahan Air',energy:'Energi & Utilitas',
28109:     kpidept:'Target Kerja Departemen',pengaturan:'Pengaturan'
28110:   });
28111: 
28112:   const SIMPLE_TEXT=Object.freeze({
28113:     'Home':'Beranda','Project Center':'Pusat Proyek','Corrective Report':'Laporan Perbaikan',
28114:     'Dashboard KPI Department':'Target Kerja Departemen','Breakdown Mesin (MTD/YTD)':'Riwayat Kerusakan Mesin',
28115:     'Database Mesin':'Data Mesin','Reports & Field Work':'Laporan & Pekerjaan Lapangan','Water Treatment Plant':'Pengolahan Air',
28116:     'Energy & Utility':'Energi & Utilitas','Insights':'Analisis & Pengetahuan','KPI Department':'Target Kerja Departemen',
28117:     'People & Meetings':'Orang & Rapat','Input Report':'Buat Laporan','Dashboard & Analytics':'Ringkasan & Grafik',
28118:     'Factory Project':'Proyek Pabrik','Filter':'Saring Data','Tambah Project':'Tambah Proyek',
28119:     'PI Dashboard':'Ringkasan Kemampuan','Personnel':'Data Personel','Meeting Management':'Kelola Rapat',
28120:     'Meeting Analytics':'Ringkasan Rapat','Meeting Baru':'Buat Rapat','Open':'Belum Selesai',
28121:     'Download Excel Hasil Analisa':'Unduh Hasil Excel','Download Excel Resume':'Unduh Ringkasan Excel',
28122:     'Refresh':'Muat Ulang','Dashboard Analitik':'Ringkasan Analisis','Correlation Analysis':'Cari Hubungan Data',
28123:     'Diagnostic Wizard':'Panduan Cari Penyebab','Knowledge Base':'Pusat Pengetahuan',
28124:     'Knowledge Center':'Pusat Pengetahuan','Expert Finder':'Cari Teknisi Berpengalaman',
28125:     'Knowledge Graph':'Peta Hubungan Pengetahuan','Import Excel':'Ambil dari Excel',
28126:     'Import Excel (Upload File)':'Ambil dari File Excel','Tambah / Update Data':'Tambah / Ubah Data',
28127:     'Export Excel':'Unduh Excel','Export PDF':'Unduh PDF','Export Word':'Unduh Word',
28128:     'Reset':'Atur Ulang','Reset Konteks':'Kosongkan Pilihan','Reset Tampilan':'Atur Ulang Tampilan',
28129:     'User Management':'Kelola Pengguna','Role Access':'Hak Akses','Template Patrol':'Daftar Pemeriksaan Patrol',
28130:     'Tambah User':'Tambah Pengguna','Simpan Role Access':'Simpan Hak Akses','Edit':'Ubah','Batal Edit':'Batal Mengubah',
28131:     'Simpan Report RCA':'Simpan Laporan RCA','Buat Report IPAL Baru':'Buat Laporan IPAL Baru','Simpan Report':'Simpan Laporan',
28132:     'Import Semua Baris':'Ambil Semua Baris','Update Progress':'Tambah Perkembangan','Simpan Update':'Simpan Perkembangan',
28133:     'Edit Data':'Ubah Data','Tambah File (lewat Edit Data)':'Tambah File','Tambah Update Progress':'Tambah Perkembangan',
28134:     'Edit Meeting Ini':'Ubah Rapat Ini','Simpan Meeting':'Simpan Rapat','Tambah Action Item':'Tambah Tugas',
28135:     'Soft Skill Assessment':'Penilaian Perilaku','Hard Skill Assessment':'Penilaian Teknis',
28136:     'Smart Recognition & Resume Personil':'Ringkasan Otomatis Personel','Smart Recognition':'Pengenalan Otomatis',
28137:     'Smart Resume (Ringkasan Otomatis)':'Ringkasan Otomatis','Radar Chart — Soft Skill':'Grafik Penilaian Perilaku',
28138:     'Radar Chart — Hard Skill':'Grafik Penilaian Teknis','Hard Skill Detail':'Detail Kemampuan Teknis',
28139:     'Hard Skill Competency — Detail':'Detail Kompetensi Teknis','Soft Skill Summary (Penilaian Terbaru)':'Ringkasan Penilaian Perilaku Terbaru',
28140:     'Generate Report RCA':'Buat Laporan RCA','Sparepart Management':'Kelola Suku Cadang',
28141:     'Auto-Sync Knowledge Base':'Sinkronkan Pengetahuan Otomatis','Scan Ulang':'Periksa Ulang',
28142:     'Card View':'Tampilan Kartu','Table View':'Tampilan Tabel','Status Project':'Status Proyek',
28143:     'Progress per Bulan (rata-rata update)':'Perkembangan Rata-rata per Bulan','Jumlah Project per Jenis':'Jumlah Proyek per Jenis',
28144:     'Laporan Proyek — Project Status Report':'Laporan Status Proyek','Update Action Item':'Ubah Tugas',
28145:     'Analisa Downtime Elektrikal & Mekanikal':'Analisa Waktu Berhenti Elektrikal & Mekanikal',
28146:     'Analisa Downtime E&M':'Analisa Waktu Berhenti E&M','People Intelligence Dashboard':'Ringkasan Kemampuan Personel',
28147:     '+ Simpan KPI':'Simpan Target Kerja','Sinkron Data Aktual KPI Department':'Ambil Data Target Terbaru',
28148:     'Muat Data dari Excel':'Ambil Data Excel','Simpan PO':'Simpan Pesanan','Simpan Hasil Opname':'Simpan Hasil Cek Stok',
28149:     '+ Simpan Data Sparepart':'Simpan Suku Cadang','Impor Data Elektrikal Standar':'Ambil Daftar Pemeriksaan Elektrikal',
28150:     'Impor Data Mekanikal Standar':'Ambil Daftar Pemeriksaan Mekanikal','Simpan Formula':'Simpan Rumus',
28151:     'Impor Data Personil (Packaging Offset Technical)':'Ambil Data Personel Packaging Offset',
28152:     'Simpan Assessment Manual':'Simpan Penilaian Manual','Tanya Internal':'Tanya Data OMODOS','AI External hanya digunakan bila Anda memilih tombolnya. Konteks yang dikirim dibatasi pada data internal yang relevan dengan pertanyaan.':'AI luar hanya dipakai jika Anda menekan tombolnya. Data yang dikirim dibatasi pada bagian yang berhubungan dengan pertanyaan.',
~~~

