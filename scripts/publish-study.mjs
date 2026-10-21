import {mkdir, readFile, writeFile} from 'node:fs/promises';

// Publish only the standalone specimen, never its runtime/session evidence.
await mkdir('site/study', {recursive:true});
for (const file of ['index.html', 'style.css', 'app.js']) {
  let content = await readFile(`tests/agent-smoke/${file}`, 'utf8');
  if (file === 'style.css') content = content.replaceAll("./assets/", "../assets/");
  if (file === 'index.html') content = content.replace('<footer>', '<footer><p><a href="../moodboard.html#html-atlas">← Вернуться в Glass Atlas</a></p>');
  await writeFile(`site/study/${file}`, content, 'utf8');
}
console.log('Published specimen source to site/study/; shared fonts retained in site/assets/.');
