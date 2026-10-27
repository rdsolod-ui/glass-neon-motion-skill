import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {typeSamples,typographySection} from './typography.mjs';
import pack from '../site/export-assets.js';
const manifest=JSON.parse(await readFile('docs/typography-font-sources.json','utf8'));
assert.equal(new Set(typeSamples.map(r=>r[0])).size,typeSamples.length,'Stable type IDs must be unique');
assert.equal(typeSamples.filter(r=>r[0].startsWith('editorial-')).length,12);
assert.ok((await readFile('site/moodboard.html','utf8')).includes(typographySection()),'Regenerate typography markup');
for(const font of manifest.fonts){
 const license=(await readFile(`site/assets/fonts/editorial/${font.family}-OFL.txt`,'utf8')).replaceAll('\r\n','\n');
 assert.ok(license.includes('SIL OPEN FONT LICENSE'));
 assert.ok(pack.license.includes(license),'Font license must travel with export');
 for(const file of font.files){
  const bytes=await readFile('site/assets/fonts/editorial/'+file.file);
  assert.equal(bytes.subarray(0,4).toString(),'wOF2');
  assert.equal(bytes.length,file.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256);
  assert.ok(pack.css.typography.includes(bytes.toString('base64')),'Font must be embedded offline');
 }
}
console.log(JSON.stringify({typography:typeSamples.length,editorial:12,verifiedFontFiles:manifest.fonts.reduce((n,f)=>n+f.files.length,0)}));
