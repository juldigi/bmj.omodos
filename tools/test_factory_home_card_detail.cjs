'use strict';
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

const read = path => readFileSync(path, 'utf8');
const home = read('public/omodos4/factory-home-superadmin.js');
const hotfix = read('public/omodos4/hotfix.js');

assert.match(home, /TWIN_ORIGIN='https:\/\/digitaltwin\.juldigi\.workers\.dev'/);
assert.match(home, /payload\?\.type==='OMODOS_FACTORY_STATUS_CARD_CLICK'&&payload\?\.version===1/);
assert.match(home, /event\.origin!==TWIN_ORIGIN\|\|!iframe\|\|event\.source!==iframe\.contentWindow/);
assert.match(home, /if\(!isSuperadmin\(\)\|\|currentMode!=='3d'\)return/);
assert.match(home, /function openStatusDetailFromFactoryCard_\(/);
assert.match(home, /const byName=master\.filter\(row=>normalizeKey\(machineName\(row\)\)===wantedName\)/);
assert.match(home, /if\(byCode\.length===1\)selected=byCode\[0\]/);
assert.match(home, /window\.openMachineCurrentStatus\(identity\)/);
assert.match(home, /OMODOS_FACTORY_STATUS_READY/);
assert.match(hotfix, /factory-home-superadmin\.js\?v=smart-resume-10/);

console.log('Factory 3D status card click/detail and Superadmin isolation checks passed.');


assert.match(home, /ofh-original-mode \.ofh-title\{display:none!important\}/);
assert.match(home, /function fitMobileViewport_\(\)/);
assert.match(home, /root\.style\.height=available\+'px'/);
assert.match(home, /fitMobileViewport_\(\)/);



assert.doesNotMatch(home, /#dash-grid\{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important/);
assert.doesNotMatch(home, /view:not\(\.'\+VIEW_CLASS\+'\) \.ofh-resume-root\{position:relative!important;z-index:20!important/);
assert.match(home, /function syncResumePath_\(view,keep\)\{[\s\S]*?clearResumePath_\(view\);/);
assert.match(home, /function syncCompactResume_\(view,show3d\)/);
assert.match(home, /Buka Detail Smart Resume/);
assert.ok(home.includes("'.view.'+VIEW_CLASS+'>:not(#'+ROOT_ID+'):not(#omodos-smart-resume-compact){display:none!important}',"));
assert.match(home, /ofh-fullscreen-toggle/);
assert.match(home, /stage\.requestFullscreen/);
assert.match(home, /root\.classList\.add\('ofh-fullscreen'\)/);
assert.match(home, /if\(!show3d\)root\?\.classList\.remove\('ofh-fullscreen'\)/);
assert.ok(hotfix.includes('factory-home-superadmin.js?v=smart-resume-10'));
