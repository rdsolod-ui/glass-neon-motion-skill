import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {patterns,sources,motions} from '../site/catalog.js';
import {htmlElements,inputTypes,htmlAtlasSection} from './html-atlas-section.mjs';
import {motionGroups,motionExamples,motionAtlasSection} from './motion-atlas-section.mjs';
const checks=[];
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name)};
check('48 unique pattern IDs',patterns.length===48&&new Set(patterns.map(p=>p.id)).size===48);
check('all source/motion mappings exist',patterns.every(p=>sources[p.source]&&motions[p.motion]));
check('HTML element IDs and tags are unique',new Set(htmlElements.map(x=>x.id)).size===htmlElements.length&&new Set(htmlElements.map(x=>x.tag)).size===htmlElements.length);
const roster=JSON.parse(await readFile('docs/html-atlas-source-roster.json','utf8'));
check('HTML inventory equals dated WHATWG source roster',htmlElements.filter(x=>!['svg','math'].includes(x.tag)).map(x=>x.tag).sort().join(' ')===roster.tags.slice().sort().join(' '));
check('all 22 native input types', [...inputTypes].sort().join(' ')==='button checkbox color date datetime-local email file hidden image month number password radio range reset search submit tel text time url week');
check('motion IDs unique with valid group and bounded timing',new Set(motionExamples.map(x=>x.id)).size===motionExamples.length&&motionExamples.every(x=>motionGroups.some(g=>g[0]===x.group)&&Number.isFinite(x.duration)&&x.duration>=0&&x.duration<=5000));
const board=await readFile('site/moodboard.html','utf8');
check('published HTML section matches generator',board.includes(htmlAtlasSection()));
check('published motion section matches generator',board.includes(motionAtlasSection()));
for(const file of ['site/index.html','site/moodboard.html','site/study/index.html']){
 const html=await readFile(file,'utf8');check(file+' language and main landmark',html.includes('lang="ru"')&&html.includes('<main'));
 for(const match of html.matchAll(/(?:href|src)="(\.\.?\/[^"#?]+)(?:#[^"]*)?"/g))await stat(path.resolve(path.dirname(file),match[1]));
 check(file+' local assets resolved',true);
}
const walk=async(dir)=>{let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);out.push(...(e.isDirectory()?await walk(p):[p]))}return out};
for(const file of await walk('skill/glass-neon-motion'))if(file.endsWith('.md')){const text=await readFile(file,'utf8');check(file+' no replacement glyphs',!text.includes('\ufffd'));for(const m of text.matchAll(/\]\(([^)]+\.md)\)/g))if(!m[1].includes('://'))await stat(path.resolve(path.dirname(file),m[1]))}
check('skill frontmatter name',(await readFile('skill/glass-neon-motion/SKILL.md','utf8')).startsWith('---\nname: glass-neon-motion')||(await readFile('skill/glass-neon-motion/SKILL.md','utf8')).startsWith('---\r\nname: glass-neon-motion'));
check('font license retained',(await readFile('site/assets/Manrope-OFL.txt','utf8')).includes('SIL OPEN FONT LICENSE'));
console.log(JSON.stringify({passed:checks.length,checks},null,2));

await import('./check-ui.mjs');
