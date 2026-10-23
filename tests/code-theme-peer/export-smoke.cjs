const {chromium}=require('C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const fs=require('node:fs/promises');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true}),context=await browser.newContext({viewport:{width:390,height:844}}),out='qa/code-export';await fs.mkdir(out,{recursive:true});
 try{
  const source=await context.newPage();await source.goto(process.env.BASE_URL||'http://127.0.0.1:4177/moodboard.html');await source.waitForFunction(()=>window.GlassExport);
  const inventory=await source.evaluate(()=>GlassExport.inventory().map(record=>({...record,html:GlassExport.build(record.id).standalone})));await source.close();
  const offline=await browser.newContext({viewport:{width:390,height:844}});let requests=[];await offline.route('**/*',route=>{requests.push(route.request().url());return route.abort();});
  const results=[],p=await offline.newPage();
  for(const record of inventory){
   const html=record.html,errors=[];requests=[];await p.goto('about:blank');p.removeAllListeners('pageerror');p.on('pageerror',e=>errors.push(e.message));
   await p.setContent(html,{waitUntil:'load'});await p.waitForTimeout(15);
   const state=await p.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+1,cards:document.querySelectorAll('[data-type-example],[data-ui-example],[data-vx-example],[data-ha-entry],.ha-input-card,.ha-state,.ma-card,.pattern,.finish-card,.optical-study').length,images:[...document.images].filter(i=>i.hasAttribute('src')&&!i.complete).length}));
   results.push({id:record.id,kind:record.kind,errors,requests:[...requests],...state});
   if(errors.length||requests.length||state.overflow)console.log(JSON.stringify(results.at(-1)));
   if(results.length%50===0)console.log('Checked '+results.length+' / '+inventory.length);
  }
  await offline.close();await fs.writeFile(out+'/smoke.json',JSON.stringify(results,null,2));console.log(JSON.stringify({count:results.length,errors:results.filter(r=>r.errors.length).length,network:results.filter(r=>r.requests.length).length,overflow:results.filter(r=>r.overflow).length,cardCount:results.filter(r=>r.cards!==1).length}));
 }finally{await context.close();await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
