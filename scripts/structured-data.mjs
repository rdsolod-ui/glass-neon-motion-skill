import {readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
export const defaultSiteUrl = 'https://rdsolod-ui.github.io/glass-neon-motion-skill/';
export const atlasSections = [
 ['install-skill', 'Установка скилла для Codex и Claude Code'],
 ['ui-atlas', 'Рабочие компоненты'],
 ['finish-lab', 'Стекло'],
 ['material-compare', 'Сравнение материалов'],
 ['html-atlas', 'HTML и состояния'],
 ['motion-atlas', 'Движение'],
 ['atlas', '48 композиций'],
 ['user-references', 'Референсы']
];
export function pageSchema(file, description, siteUrl = defaultSiteUrl) {
 const base = new URL(siteUrl);
 if (base.protocol !== 'https:' || base.search || base.hash || !base.pathname.endsWith('/')) throw new Error('Schema site URL must be an HTTPS directory URL');
 const root = base.href;
 const board = file === 'moodboard.html';
 const url = board ? new URL(file, root).href : root;
 const website = {'@type':'WebSite','@id':root+'#website',url:root,name:'LUMA — Glass Neon Motion',inLanguage:'ru'};
 const page = {'@type':board?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:board?'Glass Atlas — мудборд и карта элементов':'LUMA — форма света',description,inLanguage:'ru',isPartOf:{'@id':website['@id']}};
 const graph = [website, page];
 if(board) {
  page.mainEntity = {'@id':url+'#sections'};
  graph.push({'@type':'ItemList','@id':url+'#sections',name:'Основные разделы Glass Atlas',numberOfItems:atlasSections.length,itemListElement:atlasSections.map(([id,name],i)=>({'@type':'ListItem',position:i+1,name,url:url+'#'+id}))});
 } else page.relatedLink = new URL('moodboard.html',root).href;
 return {'@context':'https://schema.org','@graph':graph};
}
export async function writeStructuredData(directory, siteUrl = defaultSiteUrl) {
 for(const file of ['index.html','moodboard.html']) {
  const target = path.join(directory,file);
  const source = await readFile(target,'utf8');
  const clean = source.replace(/<script id="page-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>\n?/g,'');
  const description = clean.match(/<meta name="description" content="([^"]*)"/)[1];
  const json = JSON.stringify(pageSchema(file,description,siteUrl),null,2).replaceAll('<','\\u003c');
  const result = clean.replace('</head>',`<script id="page-structured-data" type="application/ld+json">${json}</script>\n</head>`);
  if(result === clean) throw new Error('Missing head: '+file);
  await writeFile(target,result);
 }
}
