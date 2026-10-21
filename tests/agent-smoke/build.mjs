import {mkdir, copyFile, readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root = path.dirname(fileURLToPath(import.meta.url));
const project = path.resolve(root, '../..');
const output = path.join(project, 'qa/agent-smoke/build');
await mkdir(path.join(output, 'assets'), {recursive:true});
for (const file of ['index.html', 'style.css', 'app.js']) {
  await copyFile(path.join(root, file), path.join(output, file));
  const bytes = await readFile(path.join(output, file));
  console.log(`${file} ${bytes.length} ${createHash('sha256').update(bytes).digest('hex')}`);
}
for (const file of ['manrope-latin.woff2', 'manrope-cyrillic.woff2', 'Manrope-OFL.txt']) await copyFile(path.join(project, 'site/assets', file), path.join(output, 'assets', file));
console.log(`Built isolated output: ${output}`);
