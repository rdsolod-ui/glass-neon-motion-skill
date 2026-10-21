import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {patterns,sources,motions} from '../site/catalog.js';
const checks=[];
const check=(name,ok)=>{assert.ok(ok,name);checks.push(name)};
check('48 unique pattern IDs',patterns.length===48&&new Set(patterns.map(p=>p.id)).size===48);
check('all source/motion mappings exist',patterns.every(p=>sources[p.source]&&motions[p.motion]));
for(const file of ['site/index.html','site/moodboard.html']){
 const html=await readFile(file,'utf8');check(file+' language and main landmark',html.includes('lang="ru"')&&html.includes('<main'));
 for(const match of html.matchAll(/(?:href|src)="(\.\/[^"#?]+)(?:#[^"]*)?"/g))await stat(path.resolve(path.dirname(file),match[1]));
 check(file+' local assets resolved',true);
}
const walk=async(dir)=>{let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);out.push(...(e.isDirectory()?await walk(p):[p]))}return out};
for(const file of await walk('skill/glass-neon-motion'))if(file.endsWith('.md')){const text=await readFile(file,'utf8');check(file+' no replacement glyphs',!text.includes('\ufffd'));for(const m of text.matchAll(/\]\(([^)]+\.md)\)/g))if(!m[1].includes('://'))await stat(path.resolve(path.dirname(file),m[1]))}
check('skill frontmatter name',(await readFile('skill/glass-neon-motion/SKILL.md','utf8')).startsWith('---\nname: glass-neon-motion')||(await readFile('skill/glass-neon-motion/SKILL.md','utf8')).startsWith('---\r\nname: glass-neon-motion'));
check('font license retained',(await readFile('site/assets/Manrope-OFL.txt','utf8')).includes('SIL OPEN FONT LICENSE'));
console.log(JSON.stringify({passed:checks.length,checks},null,2));
