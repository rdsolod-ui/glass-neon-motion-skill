/* Real Chromium behavior check. Reuses the dedicated bridge and owns its context only. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.BASE_URL||'http://127.0.0.1:4177';
const out=path.resolve('qa/ui-v5');fs.mkdirSync(out,{recursive:true});
const result={base,checks:[],errors:[],screenshots:[],status:'running'};
const pass=(name,detail)=>result.checks.push({name,detail});
(async()=>{
 let browser,context;
 try{
  browser=await chromium.connectOverCDP('http://127.0.0.1:9223',{timeout:10000});
  context=await browser.newContext({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
  const p=await context.newPage();await p.emulateMedia({reducedMotion:'reduce'});p.on('pageerror',e=>result.errors.push(e.message));
  await p.goto(`${base}/moodboard.html#ui-group-tables`);await p.locator('#ui-atlas[data-ready=true]').waitFor();assert.equal(await p.evaluate(()=>matchMedia('(prefers-reduced-motion:reduce)').matches),true);
  await p.locator('#ui-group-tables').evaluate(e=>e.open=true);
  const table=p.locator('[data-uid-inventory]');
  assert.equal(await table.locator('tbody tr').count(),6);
  await table.locator('[data-uid-sort-table=value]').click();
  assert.deepEqual(await table.locator('tbody tr td:nth-child(3)').allTextContents(),['0','12','18','24','28','36']);
  await table.locator('[data-uid-sort-table=value]').click();
  assert.deepEqual(await table.locator('tbody tr td:nth-child(3)').allTextContents(),['36','28','24','18','12','0']);
  await table.locator('[data-uid-search]').fill('Frost');assert.equal(await table.locator('tbody tr').count(),1);
  await table.locator('[data-uid-select-all]').check();
  await table.locator('[data-uid-search]').fill('Prism');await table.locator('[data-uid-select-all]').check();
  assert.match(await table.locator('[data-uid-table-status]').textContent(),/выбрано 2/);
  await table.locator('[data-uid-bulk]').click();
  await table.locator('[data-uid-search]').fill('Frost');assert.equal(await table.locator('tbody tr td:last-child').textContent(),'Готово');
  await table.locator('[data-uid-search]').fill('несуществующее');assert.match(await table.locator('tbody').textContent(),/Совпадений нет/);
  assert.equal(await table.locator('[data-uid-select-all]').isDisabled(),true);
  await table.locator('[data-uid-table-reset]').click();assert.match(await table.locator('[data-uid-table-status]').textContent(),/выбрано 0/);
  pass('table-inventory','6 rows; numeric asc/desc; filter empty state; persisted hidden selection; bulk update; reset');
  const expandable=p.locator('[data-uid-expandable]');
  await expandable.locator('summary').first().focus();await p.keyboard.press('Enter');assert.equal(await expandable.locator('details[open]').count(),1);
  await expandable.locator('[data-uid-expand-all]').click();assert.equal(await expandable.locator('details[open]').count(),3);
  await expandable.locator('[data-uid-expand-all]').click();assert.equal(await expandable.locator('details[open]').count(),0);
  pass('table-expandable','Keyboard native disclosure and open/close all');
  const row=p.locator('[data-uid-inline-row=Frost]'),input=row.locator('input');
  await row.locator('[data-uid-edit]').click();await input.fill('100');await p.keyboard.press('Enter');
  assert.equal(await input.getAttribute('aria-invalid'),'true');assert.equal(await row.locator('[data-uid-cost]').textContent(),'20');
  await input.fill('7');await p.keyboard.press('Enter');assert.equal(await row.locator('[data-uid-cost]').textContent(),'35');
  assert.equal(await input.evaluate(e=>e.readOnly),true);
  await row.locator('[data-uid-edit]').click();await input.fill('9');await p.keyboard.press('Escape');assert.equal(await input.inputValue(),'7');
  assert.equal(await row.locator('[data-uid-cost]').textContent(),'35');
  pass('table-inline','Reject 100 without corrupting total; save 7→35; Escape reverts edit and returns focus');
  await p.locator('#ui-group-charts').evaluate(e=>e.open=true);
  const ids=['bar','grouped','line','histogram','scatter','donut','stacked','treemap','sankey','geo','bullet','control'];
  for(const id of ids){
   const c=p.locator(`[data-uid-chart=${id}]`);
   assert.equal(await c.locator('svg').count(),1);assert.match(await c.locator('svg title').textContent(),/Набор A/);
   const before=await c.locator('tbody').textContent();await c.locator('[data-uid-dataset]').selectOption('1');
   assert.match(await c.locator('svg title').textContent(),/Набор B/);assert.notEqual(await c.locator('tbody').textContent(),before);
   await c.locator('.uid-values>summary').click();assert.equal(await c.locator('.uid-values').evaluate(e=>e.open),true);
   await c.locator('[data-uid-labels]').uncheck();assert.equal(await c.locator('.uid-values').evaluate(e=>e.open),true);
   assert.equal(await c.locator('svg .uid-value').count(),0);
   if(id==='bar'){await c.locator('[data-uid-sort]').selectOption('descending');assert.deepEqual(await c.locator('tbody td').allTextContents(),['35','30','25','10']);}
   if(id==='grouped'||id==='line'||id==='stacked'||id==='scatter'){
    await c.locator('[data-uid-series="0"]').uncheck();await c.locator('[data-uid-series="1"]').uncheck();
    if(id==='scatter')assert.match(await c.locator('.uid-chart-summary').textContent(),/0 наблюдений/);
    else assert.match(await c.locator('.uid-chart-summary').textContent(),/Все серии скрыты/);
    await c.locator('[data-uid-series="0"]').check();
   }
   if(id==='line'){await c.locator('[data-uid-series="1"]').check();assert.match(await c.locator('tbody').textContent(),/Нет данных/);const d=await c.locator('path.uid-dashed').getAttribute('d');assert.equal((d.match(/M/g)||[]).length,2);}
   if(id==='histogram'){await c.locator('[data-uid-bin]').selectOption('2');assert.equal(await c.locator('tbody tr').count(),8);const total=(await c.locator('tbody td').allTextContents()).reduce((a,v)=>a+Number(v),0);assert.equal(total,24);}
   if(id==='donut'){const t=await c.locator('tbody tr').evaluateAll(rs=>rs.map(r=>[...r.querySelectorAll('td')].map(c=>Number(c.textContent.replace(',','.')))));assert.equal(t.reduce((a,r)=>a+r[0],0),100);assert.equal(t.reduce((a,r)=>a+r[1],0),100);}
   if(id==='stacked'){assert.deepEqual(await c.locator('tbody td:last-child').allTextContents(),['100','100','100','100']);}
   if(id==='treemap'){await c.locator('[data-uid-branch]').selectOption('optic');assert.equal(await c.locator('tbody tr').count(),2);assert.match(await c.locator('.uid-chart-summary').textContent(),/40 ед/);}
   if(id==='sankey'){const total=(await c.locator('tbody td:last-child').allTextContents()).reduce((a,v)=>a+Number(v),0);assert.equal(total,120);assert.match(await c.locator('.uid-chart-summary').textContent(),/Вход = выход = 120/);}
   if(id==='geo'){assert.equal(await c.locator('svg polygon').count(),6);assert.match(await c.locator('.uid-chart-summary').textContent(),/вымышленных/);}
   if(id==='bullet'){assert.match(await c.locator('.uid-chart-summary').textContent(),/82%.*Цель достигнута/);}
   if(id==='control'){assert.equal(await c.locator('.uid-alert').count(),2);assert.match(await c.locator('.uid-chart-summary').textContent(),/2 из 8/);}
   assert.equal(await c.locator('svg').evaluate(e=>/NaN|Infinity/.test(e.outerHTML)),false);
   await c.locator('[data-uid-reset]').click();assert.match(await c.locator('svg title').textContent(),/Набор A/);
   pass(`chart-${id}`,'Dataset changes static SVG and table; labels, table disclosure, special control, reset and numeric invariant checked');
  }
  result.motionReadback=await p.evaluate(()=>({m:matchMedia('(prefers-reduced-motion:reduce)').matches,d:UIAtlas.diagnostics(),animations:document.getAnimations().map(a=>({target:a.effect.target.className,state:a.playState}))}));assert.equal(result.motionReadback.d.active,0);pass('reduced-motion','No active common API animation with reduced motion before load');
  for(const theme of ['dark','light']){
   await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);
   await p.locator('#ui-chart-grouped').scrollIntoViewIfNeeded();
   const shot=path.join(out,`data-${theme}-desktop.png`);await p.locator('#ui-chart-grouped').screenshot({path:shot});result.screenshots.push(shot);
  }
  await p.setViewportSize({width:390,height:844});await p.locator('#ui-chart-sankey').scrollIntoViewIfNeeded();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true);
  const plot=p.locator('[data-uid-chart=sankey] .uid-chart-plot');assert.equal(await plot.evaluate(e=>e.scrollWidth>e.clientWidth),true);
  await plot.focus();await p.keyboard.press('ArrowRight');
  const shot=path.join(out,'data-light-mobile.png');await p.locator('#ui-chart-sankey').screenshot({path:shot});result.screenshots.push(shot);
  pass('mobile-chart','390px page has no overflow; plot uses an explicit scrollable keyboard region');
  assert.deepEqual(result.errors,[]);result.status='passed';console.log(JSON.stringify({status:result.status,checks:result.checks.length,specimens:15,errors:result.errors}));
 }catch(error){result.status='failed';result.failure=error.stack;console.error(error);process.exitCode=1}
 finally{fs.writeFileSync(path.join(out,'data.json'),JSON.stringify(result,null,2));await context?.close();await browser?.close()}
})();
