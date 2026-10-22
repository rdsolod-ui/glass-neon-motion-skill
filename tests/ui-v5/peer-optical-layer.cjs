// Independent narrow recheck of clear-glass optical-layer repair; local review only.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{const b=await chromium.connectOverCDP('http://127.0.0.1:9223');const c=await b.newContext({viewport:{width:1440,height:1000}});const p=await c.newPage();await p.emulateMedia({reducedMotion:'reduce'});const checks=[],errors=[];p.on('pageerror',e=>errors.push(e.message));
 const record=(name,details)=>checks.push({name,pass:true,details});
 try{
 await p.goto('http://127.0.0.1:4177/index.html',{waitUntil:'networkidle'});await p.locator('[data-material-preset=clear-glass]:enabled').waitFor();await p.locator('[data-material-preset=clear-glass]').click();
 assert.equal(await p.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);
 for(const theme of ['light','dark']){
  if(await p.locator('html').getAttribute('data-theme')!==theme)await p.locator('[data-theme-toggle]').click();
  for(const width of [1440,390]){
   await p.setViewportSize({width,height:width===390?844:1000});
   const optics=await p.locator('#motion-target').evaluate(el=>{const host=getComputedStyle(el),pseudo=getComputedStyle(el,'::before');const a=el.querySelector('strong').getBoundingClientRect(),z=el.querySelector('small').getBoundingClientRect(),tile=el.getBoundingClientRect();return{host:host.backdropFilter,pseudo:pseudo.backdropFilter,display:pseudo.display,overlap:a.bottom>z.top,contained:a.left>=tile.left&&a.right<=tile.right+1&&z.left>=tile.left&&z.right<=tile.right+1,border:host.borderWidth};});
   assert.equal(optics.host,'none');assert.ok(optics.pseudo.includes('0.8px'));assert.equal(optics.overlap,false);assert.equal(optics.contained,true);assert.equal(optics.border,'0px');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));record(`${theme}/${width} clear target single optical layer`,optics);
   await p.locator('#motion-target').scrollIntoViewIfNeeded();await p.screenshot({path:`qa/ui-v5/peer-optical-${theme}-${width}.png`});
   await p.locator('#solid-mode').check();const solid=await p.locator('#motion-target').evaluate(el=>({host:getComputedStyle(el).backdropFilter,background:getComputedStyle(el).backgroundColor,pseudo:getComputedStyle(el,'::before').display}));assert.equal(solid.host,'none');assert.equal(solid.pseudo,'none');assert.match(solid.background,/^rgb\(/);record(`${theme}/${width} solid target`,solid);await p.locator('#solid-mode').uncheck();
  }
  const slider=p.locator('#frost');await slider.fill('6');const studio=await p.locator('#custom-material').evaluate(el=>({host:getComputedStyle(el).backdropFilter,pseudo:getComputedStyle(el,'::before').backdropFilter}));assert.equal(studio.host,'none');assert.ok(studio.pseudo.includes('6px'));assert.ok(await p.locator('#motion-target').evaluate(el=>getComputedStyle(el,'::before').backdropFilter.includes('0.8px')));record(`${theme} custom preview owns slider independently`,studio);
 }
 assert.deepEqual(errors,[]);record('no page errors',errors);fs.writeFileSync('qa/ui-v5/peer-optical-layer.json',JSON.stringify({url:'http://127.0.0.1:4177/index.html',pass:true,checks,errors},null,2));console.log(JSON.stringify({pass:true,checks:checks.length,errors}));
 }catch(e){fs.writeFileSync('qa/ui-v5/peer-optical-layer.json',JSON.stringify({pass:false,checks,errors,failure:e.stack},null,2));console.error(e);process.exitCode=1;}finally{await c.close();await b.close();}
})();
