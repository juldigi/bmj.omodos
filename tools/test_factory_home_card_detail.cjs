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

assert.ok(home.includes(".ofh-original-mode .ofh-title,#'+ROOT_ID+'.ofh-original-mode .ofh-stage"));
assert.match(home, /function fitMobileViewport_\(\)/);
assert.match(home, /const rootHeight=Math\.max\(mobile\?300:360,Math\.min\(mobile\?560:760,available\)\)/);
assert.doesNotMatch(home, /view\.style\.height=available\+'px'/);
assert.doesNotMatch(home, /view\.style\.overflowY='auto'/);
assert.match(home, /restoreViewSizing_\(view\)/);
assert.match(home, /const previous=document\.getElementById\('omodos-superadmin-factory-home-style'\)/);
assert.match(home, /if\(previous\)previous\.remove\(\)/);
assert.doesNotMatch(home, /z-index:20!important;isolation:isolate!important/);
assert.match(home, /function syncResumePath_\(view,keep\)\{[\s\S]*?clearResumePath_\(view\);/);
assert.match(home, /function syncCompactResume_\(view,show3d\)/);
assert.match(home, /function syncCompactResume_\(view,show3d\)\{[\s\S]*?<strong>Smart Resume<\/strong>[\s\S]*?Buka Detail[\s\S]*?insertAdjacentElement\('afterend',compact\)/);
assert.doesNotMatch(home, /#omodos-smart-resume-compact\{display:none!important\}/);
assert.ok(home.includes("grid-column:1/-1!important"));
assert.ok(home.includes("ofh-original-mode .ofh-heading{display:flex!important;position:static!important"));
assert.ok(home.includes("Buka Detail"));
assert.match(hotfix, /factory-home-superadmin\.js\?v=smart-resume-(18|19)/);
assert.ok(home.includes("'.view.'+VIEW_CLASS+'>:not(#'+ROOT_ID+'):not(#omodos-smart-resume-compact){display:none!important}',"));
assert.match(home, /ofh-fullscreen-toggle/);
assert.match(home, /stage\.requestFullscreen/);
assert.match(home, /root\.classList\.add\('ofh-fullscreen'\)/);
assert.match(home, /if\(!show3d\)root\?\.classList\.remove\('ofh-fullscreen'\)/);
assert.match(home, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(home, /@media\(max-width:420px\)/);

assert.doesNotMatch(home, /Buka Detail Smart Resume/);
assert.match(home, /document\.querySelectorAll\('#omodos-smart-resume-compact'\)\.forEach\(node=>node\.remove\(\)\)/);
assert.match(home, /syncCompactResume_\(view,currentMode==='3d'\)/);

console.log('Factory home responsive toolbar, compact Smart Resume, fullscreen and card-detail checks passed.');
