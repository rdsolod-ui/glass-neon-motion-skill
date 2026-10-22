import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import pack from '../site/export-assets.js';
import {DEFAULT_THEME,validateTheme,buildThemeCSS,runtimeSource} from '../site/theme-studio.js';
import {themeStudioSection} from './theme-studio.mjs';
for(const [file,hash] of Object.entries(pack.hashes))assert.equal(createHash('sha256').update((await readFile(file,'utf8')).replaceAll('\r\n','\n')).digest('hex'),hash,'Regenerate export pack: '+file);
assert.ok((await readFile('site/moodboard.html','utf8')).includes(themeStudioSection()));
for(const theme of ['light','dark'])for(const finish of ['clear','frost'])for(const edge of ['film','depth']){
 const s=structuredClone(DEFAULT_THEME);s.appearance.theme=theme;s.material.finish=finish;s.material.edge=edge;
 assert.equal(validateTheme(s).valid,true);assert.ok(!buildThemeCSS(s).includes('undefined'));assert.ok(runtimeSource(s).includes('prefers-reduced-motion'));
}
assert.equal(validateTheme({...DEFAULT_THEME,layout:{radius:-1,density:1}}).valid,false);
assert.equal(validateTheme({...DEFAULT_THEME,motion:{...DEFAULT_THEME.motion,duration:Infinity}}).valid,false);
assert.ok(pack.license.includes('SIL OPEN FONT LICENSE'));assert.ok(pack.license.includes('MIT'));
console.log(JSON.stringify({exportSourceHashes:Object.keys(pack.hashes).length,themeCombinations:8,themeValidation:'pass'}));
