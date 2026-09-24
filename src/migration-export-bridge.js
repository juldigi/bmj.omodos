const HTML = `<!doctype html><html lang="id"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cadangan OMODOS</title><style>body{font:16px system-ui;max-width:640px;margin:4rem auto;padding:0 1.2rem}label{display:block;margin:1rem 0}input{display:block;width:100%;box-sizing:border-box;padding:.7rem}button{padding:.75rem;margin:.4rem}#status{white-space:pre-wrap}</style>
<h1>Cadangan OMODOS</h1><p>Masuk dengan akun Superadmin. Unduhan tersimpan di perangkat ini.</p>
<form id="login"><label>Username<input name="username" autocomplete="username" required></label><label>Password<input name="password" type="password" autocomplete="current-password" required></label><button type="submit">Masuk</button></form>
<section id="exports" hidden><button id="database">Unduh database</button><button id="inventory">Daftar lampiran</button><button id="metadata">Unduh metadata migrasi</button><div id="files"></div></section><pre id="status" role="status"></pre><script src="/export.js" defer></script></html>`;

const JS = `let token = '';
const status = document.getElementById('status');
async function request(path, options = {}) {
  const response = await fetch(path, {...options, headers: {...(options.headers || {}), ...(token ? {Authorization:'Bearer '+token} : {})}, cache:'no-store'});
  if (!response.ok) throw Error('HTTP '+response.status);
  return response;
}
function save(blob, name) {
  const link = document.createElement('a'); const url = URL.createObjectURL(blob);
  link.href = url; link.download = name; link.click(); setTimeout(()=>URL.revokeObjectURL(url),60000);
}
document.getElementById('login').addEventListener('submit', async event => {
  event.preventDefault(); const form=event.currentTarget; status.textContent='Memeriksa akun…';
  try {
    const response=await request('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'login',username:form.elements.username.value,password:form.elements.password.value})});
    const result=await response.json(); if(!result.ok||!result.sessionToken) throw Error('Login ditolak.');
    token=result.sessionToken;
    const check=await request('/api/backup/config'); if(!(await check.json()).ok) throw Error('Akses Superadmin diperlukan.');
    form.reset(); form.hidden=true; document.getElementById('exports').hidden=false;
    status.textContent='Superadmin terverifikasi. Siap mengunduh cadangan.';
  } catch(error) {token='';status.textContent=error.message;}
});
document.getElementById('database').addEventListener('click', async () => {
  status.textContent='Menyiapkan database…';
  try {
    const response=await request('/api/backup'); const blob=await response.blob();
    const sheets=Object.keys(JSON.parse(await blob.text())); if(!sheets.length) throw Error('Cadangan kosong.');
    save(blob,'omodos-database-backup.json');
    status.textContent='Database: '+sheets.length+' tabel, '+blob.size+' byte. Lampiran: '+response.headers.get('X-Backup-File-Count')+' file.';
  } catch(error) {status.textContent='Unduhan gagal: '+error.message;}
});
document.getElementById('inventory').addEventListener('click', async () => {
  status.textContent='Memeriksa lampiran…';
  try {
    const result=await (await request('/api/backup/files')).json(); if(!result.ok) throw Error('Akses ditolak.');
    const {files,fileCount,totalBytes}=result.data; const holder=document.getElementById('files'); holder.replaceChildren();
    for(const file of files) {
      const button=document.createElement('button'); button.type='button'; button.textContent='Unduh '+file.name+' ('+file.size+' byte)';
      button.addEventListener('click',async()=>{try{const res=await request('/api/backup/file/'+encodeURIComponent(file.id));save(await res.blob(),file.name||file.id);}catch(error){status.textContent='Lampiran gagal: '+error.message;}});
      holder.append(button);
    }
    status.textContent=fileCount+' lampiran; total '+totalBytes+' byte.';
  } catch(error) {status.textContent=error.message;}
});
document.getElementById('metadata').addEventListener('click', async () => {
  status.textContent='Menyiapkan metadata…';
  try {
    const config=await (await request('/api/backup/config')).json();
    const inventory=await (await request('/api/backup/files')).json();
    if(!config.ok||!inventory.ok) throw Error('Akses ditolak.');
    save(new Blob([JSON.stringify({config:config.data,files:inventory.data.files},null,2)],{type:'application/json'}),'omodos-migration-metadata.json');
    status.textContent='Metadata migrasi siap.';
  } catch(error) {status.textContent=error.message;}
});`;

const ALLOWED = new Set(['/api/login','/api/backup','/api/backup/config','/api/backup/files']);
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/' && request.method === 'GET') return new Response(HTML, {headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','Content-Security-Policy':"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'self'; form-action 'self'; base-uri 'none'"}});
    if (url.pathname === '/export.js' && request.method === 'GET') return new Response(JS, {headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-store'}});
    const file = url.pathname.startsWith('/api/backup/file/');
    if (!ALLOWED.has(url.pathname) && !file) return new Response('Not found',{status:404});
    if ((url.pathname === '/api/login' && request.method !== 'POST') || (url.pathname !== '/api/login' && !['GET','HEAD'].includes(request.method))) return new Response('Method not allowed',{status:405});
    if (url.pathname !== '/api/login' && !request.headers.get('Authorization')?.startsWith('Bearer ')) return new Response('Unauthorized',{status:401});
    const target = new URL(url.pathname === '/api/login' ? '/api' : url.pathname, request.url);
    return env.MAINTENANCE.get(env.MAINTENANCE.idFromName('maintenance-production')).fetch(new Request(target,request));
  }
};
