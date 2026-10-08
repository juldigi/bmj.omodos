
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('public/index.html','utf8');
const nodes={'patrol-nama-pelapor':{value:'Person A'},'patrol-temuan-deskripsi':{value:''},'btn-patrol-add-temuan':{focus(){this.focused=true;},scrollIntoView(){} }};
const yes={click(){c.selectedYes=true;}};
const c={Set,Error,String,PATROL_FINDING_FILES:[],PATROL_STATE:{findings:[]},selectedYes:false,$:id=>nodes[id.slice(1)],document:{querySelector:s=>s.endsWith('.active')?(c.selectedYes?yes:null):yes},toast:()=>{}};
vm.createContext(c);
vm.runInContext(html.slice(html.indexOf('function patrolPersonilNames_'),html.indexOf("$('#btn-patrol-add-personil').addEventListener")),c);
vm.runInContext("let PATROL_ADDITIONAL_PERSONIL=['Person B','Person C'];",c);
assert.deepEqual(Array.from(c.patrolPersonilNames_()),['Person A','Person B','Person C']);
vm.runInContext("PATROL_ADDITIONAL_PERSONIL=['person a'];",c);assert.throws(()=>c.patrolPersonilNames_(),/sekali/);
vm.runInContext("PATROL_ADDITIONAL_PERSONIL=[''];",c);assert.throws(()=>c.patrolPersonilNames_(),/kosong/);
assert.equal(c.patrolRequireAddedFindings_(),true);
nodes['patrol-temuan-deskripsi'].value='Draft';assert.equal(c.patrolRequireAddedFindings_(),false);assert(nodes['btn-patrol-add-temuan'].focused);
nodes['patrol-temuan-deskripsi'].value='';c.PATROL_FINDING_FILES=[{name:'photo'}];assert.equal(c.patrolRequireAddedFindings_(),false);
c.PATROL_FINDING_FILES=[];c.PATROL_STATE.findings=[{id:'F1'}];assert.equal(c.patrolRequireAddedFindings_(),true);
for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(m[1]);
console.log('Patrol revisions: PASS (multiple personil, duplicate/empty rows, pending text/photo guard, added finding save).');
