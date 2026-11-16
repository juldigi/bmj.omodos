const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('src/worker.js','utf8');
const start=source.indexOf('function getPersonilList_() {');
const end=source.indexOf('  __name(getPersonilList_, "getPersonilList_");',start);
assert(start>=0&&end>start,'production getPersonilList_ function exists');
const functionSource=source.slice(start,end);

function makeContext(initialRows){
  let rows=initialRows.map(r=>r.slice());
  let cachedRows=null, cacheRemovals=0;
  const headers=rows[0];
  const sheet={
    getDataRange(){return {getValues(){return rows.map(r=>r.slice());}};},
    appendRow(row){rows.push(row.slice());},
    getRange(row,col){return {setValue(value){rows[row-1][col-1]=value;}};}
  };
  const context={
    SHEET_PERSONIL:'Master_Personil',
    PERSONIL_HEADERS:['Nama Personil','Grouping Team','Jabatan','Foto URL'],
    getOrCreateSheet_(name){assert.equal(name,'Master_Personil');return sheet;},
    getCache_(){return {remove(key){if(key==='rows_Master_Personil'){cachedRows=null;cacheRemovals++;}}};},
    getGenericRows_(name){
      assert.equal(name,'Master_Personil');
      if(cachedRows)return cachedRows;
      const header=rows[0];
      const nameIndex=header.indexOf('Nama Personil');
      const deletedIndex=header.indexOf('DeletedAt');
      cachedRows=rows.slice(1).filter(row=>
        String(row[0]||'')!=='' &&
        (deletedIndex<0||!String(row[deletedIndex]||'').trim())
      ).map(row=>Object.fromEntries(header.map((h,i)=>[h,row[i]])));
      return cachedRows;
    }
  };
  vm.createContext(context);
  vm.runInContext(functionSource+'\nthis.runGetPersonilList=getPersonilList_;',context);
  return {context,get rows(){return rows;},get cacheRemovals(){return cacheRemovals;}};
}

const baseHeaders=['Nama Personil','Grouping Team','Jabatan','Foto URL'];
const empty=makeContext([baseHeaders]);
let result=empty.context.runGetPersonilList();
assert.equal(result.filter(r=>String(r['Nama Personil']).trim().toLowerCase()==='jamhuriyat').length,1);
assert.equal(result.find(r=>r['Nama Personil']==='Jamhuriyat')['Grouping Team'],'');
assert.equal(result.find(r=>r['Nama Personil']==='Jamhuriyat')['Jabatan'],'');
assert.equal(empty.rows.length,2);
assert.equal(empty.cacheRemovals,1);
empty.context.runGetPersonilList();
assert.equal(empty.rows.length,2,'repeated reads do not create a duplicate');

const existing=makeContext([
  [...baseHeaders,'Employee ID'],
  ['  jamhuriyat  ','Team B','Technician','photo.jpg','EMP-01']
]);
result=existing.context.runGetPersonilList();
assert.equal(existing.rows.length,2,'existing person is not duplicated');
assert.equal(existing.rows[1][0],'Jamhuriyat','canonical capitalization and whitespace are corrected');
assert.equal(existing.rows[1][1],'Team B');
assert.equal(existing.rows[1][2],'Technician');
assert.equal(existing.rows[1][3],'photo.jpg');
assert.equal(existing.rows[1][4],'EMP-01');

const deleted=makeContext([
  [...baseHeaders,'DeletedAt'],
  ['Jamhuriyat','Old Team','Old Role','', '2026-11-10']
]);
result=deleted.context.runGetPersonilList();
assert.equal(deleted.rows.length,3,'a soft-deleted record is not silently reactivated');
assert.equal(result.filter(r=>r['Nama Personil']==='Jamhuriyat').length,1,'only the active canonical record is returned');
assert.equal(deleted.rows[2][0],'Jamhuriyat');
assert.equal(deleted.rows[2][4],'');

console.log('Jamhuriyat Master_Personil seed: PASS (insert, no-duplicate repeat, canonicalize existing, cache invalidation, preserve metadata, do not reactivate deleted row).');
