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
assert.match(hotfix, /factory-home-superadmin\.js\?v=layout-mobile-4/);

console.log('Factory 3D status card click/detail and Superadmin isolation checks passed.');


assert.match(home, /ofh-original-mode \.ofh-title\{display:none!important\}/);
assert.match(home, /function fitMobileViewport_\(\)/);
assert.match(home, /root\.style\.height=available\+'px'/);
assert.match(home, /fitMobileViewport_\(\)/);

assert.match(home, /#dash-grid\{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important/);
