import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const source=process.env.SOURCE_COMMIT||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),base='https://rdsolod-ui.github.io/glass-neon-motion-skill/';
const paths=execFileSync('git',['diff','--name-only','bc3ba5b081493fc563f034ecbe4f1806e37d2097',source,'--','site/'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(Boolean);
const normalize=s=>s.replaceAll('\r\n','\n'),hash=s=>createHash('sha256').update(s).digest('hex'),checks=[];
for(let i=0;i<paths.length;i+=6){await Promise.all(paths.slice(i,i+6).map(async file=>{const response=await fetch(base+file.slice(5),{signal:AbortSignal.timeout(20000)}),remote=normalize(await response.text()),local=normalize(await readFile(file,'utf8'));checks.push({file,status:response.status,match:remote===local,sha256:hash(remote)});}));}
const root=await fetch(base,{signal:AbortSignal.timeout(20000)});checks.push({file:'site/ (default index)',status:root.status,match:normalize(await root.text())===normalize(await readFile('site/index.html','utf8'))});
const result={source,base,verifiedAt:new Date().toISOString(),normalization:'CRLF to LF only; deployed Git text bytes compared to the local source',passed:checks.filter(c=>c.status===200&&c.match).length,total:checks.length,checks};await mkdir('qa/ui-v5',{recursive:true});await writeFile('qa/ui-v5/public-bytes.json',JSON.stringify(result,null,2));console.log(JSON.stringify({passed:result.passed,total:result.total,failures:checks.filter(c=>c.status!==200||!c.match)}));if(result.passed!==result.total)process.exitCode=1;
