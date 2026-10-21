import {cp,access,mkdir} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const target=process.argv[2]?path.resolve(process.argv[2]):path.join(process.env.CODEX_HOME||path.join(os.homedir(),'.codex'),'skills','glass-neon-motion');
try{await access(target);throw new Error('Destination exists; compare and back up before updating: '+target)}catch(e){if(e.code!=='ENOENT')throw e}
await mkdir(path.dirname(target),{recursive:true});
await cp(path.resolve('skill/glass-neon-motion'),target,{recursive:true,errorOnExist:true,force:false});
console.log('Installed files: '+target+'\nNative discovery and already-open chats are separate checks.');
