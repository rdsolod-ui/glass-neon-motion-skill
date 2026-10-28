import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pageSchema,defaultSiteUrl,atlasSections} from './structured-data.mjs';
for(const file of ['index.html','moodboard.html']) {
 const html=await readFile('site/'+file,'utf8');
 const blocks=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
 assert.equal(blocks.length,1,'One JSON-LD block per page');
 const data=JSON.parse(blocks[0][1]);
 const description=html.match(/<meta name="description" content="([^"]*)"/)[1];
 assert.deepEqual(data,pageSchema(file,description),'Static schema must match generator');
 const nodes=data['@graph'];
 assert.equal(new Set(nodes.map(n=>n['@id'])).size,nodes.length);
 assert.equal(nodes[1].name,html.match(/<title>([^<]*)<\/title>/)[1]);
 if(file==='moodboard.html')for(const [id] of atlasSections)assert.ok(html.includes('id="'+id+'"'),'Section anchor exists: '+id);
 const vps=pageSchema(file,description,'https://marketing.parkskazka.ru/glass-neon-motion/');
 assert.ok(!JSON.stringify(vps).includes(defaultSiteUrl),'VPS graph must not refer to the Pages host');
}
console.log(JSON.stringify({structuredData:'pass',pages:2,absoluteUrls:true,staticJsonLd:true,atlasAnchors:atlasSections.length}));
