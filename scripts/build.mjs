import {cp,mkdir} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await cp('site','dist',{recursive:true});
console.log('Static site copied to dist. No external runtime dependencies.');
