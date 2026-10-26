const {chromium}=require('C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const fs=require('node:fs/promises'),path=require('node:path'),{pathToFileURL}=require('node:url');
const base=process.env.BASE_URL||'http://127.0.0.1:4177/',out='qa/material-compare',checks=[],errors=[];
const check=(name,pass,detail)=>{checks.push({name,pass:!!pass,detail});if(!pass)throw Error(name+': '+JSON.stringify(detail));};
(async()=>{
 await fs.mkdir(out,{recursive:true});const b=await chromium.launch({channel:'chrome',headless:true});
 const c=await b.newContext({viewport:{width:1440,height:1000},acceptDownloads:true}),p=await c.newPage();
 p.on('pageerror',e=>errors.push(e.message));
 const ready=()=>p.waitForFunction(()=>document.querySelector('#material-compare').dataset.ready==='true');
 const open=async id=>{await p.evaluate(id=>GlassCompare.open(id),id);await ready();};
 const frame=i=>p.locator('.mc-viewport iframe').nth(i).contentFrame();
 try{
  await p.goto(base+'moodboard.html');await p.waitForFunction(()=>window.GlassCompare);
  const original=await p.evaluate(()=>JSON.stringify(GlassTheme.getSnapshot()));
  await open('ui-action-buttons');
  check('391 selectable global shells',await p.evaluate(()=>GlassCompare.snapshot().count===391));
  check('four material frames',await p.locator('.mc-viewport iframe').count()===4);
  check('authored disabled state retained',await frame(0).getByRole('button',{name:'Экспорт недоступен'}).isDisabled());
  await frame(0).locator('[data-uic-action="add"]').first().click();
  for(let i=0;i<4;i++)check('linked button '+i,await frame(i).locator('[data-uic-layers] span').count()===2);
  check('linked focus stays in source',await p.locator('.mc-viewport iframe').first().evaluate(el=>el===document.activeElement));
  await p.locator('#mc-linked').uncheck();await frame(0).locator('[data-uic-action="add"]').first().click();
  check('unlinked interaction isolated',await frame(1).locator('[data-uic-layers] span').count()===2);
  await p.locator('#mc-linked').check();await open('ui-field-anatomy');
  await frame(0).locator('input').first().fill('Образец с длинным названием');
  for(let i=0;i<4;i++)check('linked input '+i,await frame(i).locator('input').first().inputValue()==='Образец с длинным названием');
  await p.locator('#mc-search').fill('scroll');
  check('filtered choice requires explicit selection',await p.locator('#mc-component').inputValue()==='');
  const scrollId=await p.locator('#mc-component option').nth(1).getAttribute('value');
  await p.locator('#mc-component').selectOption(scrollId);await ready();
  check('first filtered result selectable',await p.evaluate(id=>GlassCompare.snapshot().id===id,scrollId));
  await open('ui-validated-form');await p.locator('[data-mc-scenario="error"]').click();
  for(let i=0;i<4;i++)check('actual form errors '+i,await frame(i).locator('[aria-invalid="true"]').count()===2);
  await open('ui-edit-dialog');await p.locator('[data-mc-scenario="open"]').click();
  for(let i=0;i<4;i++)check('actual dialog '+i,await frame(i).locator('dialog').evaluate(e=>e.open));
  await frame(0).locator('dialog input').focus();await p.keyboard.press('Escape');
  check('native Escape closes source dialog',await frame(0).locator('dialog').evaluate(e=>!e.open));
  await p.waitForTimeout(100);
  for(let i=1;i<4;i++)check('linked Escape closes peer dialog '+i,await frame(i).locator('dialog').evaluate(e=>!e.open));
  check('Escape retains originating iframe focus',await p.locator('.mc-viewport iframe').first().evaluate(e=>e===document.activeElement));
  check('Escape restores originating trigger',await frame(0).locator('[data-uic-action="open"]').evaluate(e=>e===e.ownerDocument.activeElement));
  await open('ui-action-save');await p.locator('[data-mc-scenario="error"]').click();
  await p.waitForTimeout(1350);
  for(let i=0;i<4;i++)check('actual loading to error '+i,(await frame(i).locator('[data-uic-result]').textContent()).includes('ошибка'));
  await open('ui-progress-job');await p.locator('[data-mc-scenario="run"]').click();await p.waitForTimeout(1900);
  for(let i=0;i<4;i++)check('actual progress complete '+i,await frame(i).locator('progress').evaluate(e=>e.value===5));
  await open('ui-action-buttons');
  for(const theme of ['light','dark']){
   await p.locator('#mc-theme').selectOption(theme);await ready();
   const values=[];
   for(let i=0;i<4;i++)values.push(await frame(i).locator('html').evaluate(e=>{const s=getComputedStyle(e.querySelector('.ui-example-card'),'::before');return{theme:e.dataset.theme,finish:e.dataset.finish,edge:e.dataset.materialEdge,blur:s.backdropFilter,shadow:s.boxShadow,bg:getComputedStyle(e.ownerDocument.body).backgroundColor};}));
   check(theme+' same substrate',new Set(values.map(v=>v.bg)).size===1,values);
   check(theme+' independent finish and edge',values.every((v,i)=>v.theme===theme&&v.finish===(i<2?'clear':'frost')&&v.edge===(i%2?'depth':'film')));
   check(theme+' finish visibly changes blur',values[0].blur!==values[2].blur,values);
   check(theme+' edge visibly changes shadow',values[0].shadow!==values[1].shadow,values);
  }
  check('comparison leaves atlas theme untouched',await p.evaluate(()=>JSON.stringify(GlassTheme.getSnapshot()))===original);
  await p.locator('#mc-solid').check();await ready();
  const downloads=[];
  for(let i=0;i<4;i++){
   check('solid fallback '+i,await frame(i).locator('.ui-example-card').evaluate(e=>getComputedStyle(e,'::before').backdropFilter==='none'));
   const downloadPromise=p.waitForEvent('download');await p.locator(`[data-mc-download="${i}"]`).click();const d=await downloadPromise;
   const file=path.resolve(out,d.suggestedFilename());await d.saveAs(file);downloads.push(file);
   const expected=await p.evaluate(i=>GlassCompare.files()[i].standalone,i);
   check('download byte parity '+i,await fs.readFile(file,'utf8')===expected);
  }
  const off=await b.newContext({offline:true});const q=await off.newPage();q.on('pageerror',e=>errors.push(e.message));
  await q.goto(pathToFileURL(downloads[3]).href);await q.waitForFunction(()=>window.GlassThemeRuntime);
  check('offline retains selected material and fallback',await q.locator('html').evaluate(e=>e.dataset.theme==='dark'&&e.dataset.finish==='frost'&&e.dataset.materialEdge==='depth'&&e.dataset.solid==='true'));
  await q.locator('[data-uic-action="add"]').first().click();check('offline controls work',await q.locator('[data-uic-layers] span').count()===2);await off.close();
  await p.locator('#mc-solid').uncheck();await ready();
  for(const width of [1440,390,320]){
   await p.setViewportSize({width,height:1000});await p.locator('#mc-width').selectOption(width===1440?'auto':'768');await ready();
   check('no page overflow '+width,await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await p.locator('#material-compare').evaluate(e=>window.scrollTo({top:e.offsetTop-100,behavior:'instant'}));
   await p.screenshot({path:path.join(out,'compare-'+width+'.png')});
  }
  await p.locator('#mc-width').selectOption('auto');await ready();await p.emulateMedia({reducedMotion:'reduce'});
  await p.locator('#mc-reduce').uncheck();await ready();
  for(let i=0;i<4;i++)check('system reduced preference '+i,await frame(i).locator('body').evaluate(()=>GlassThemeRuntime.motionOptions().reduced));
  await p.evaluate(()=>{for(let i=0;i<8;i++)GlassCompare.open(i%2?'ui-field-anatomy':'ui-action-buttons');});await ready();
  check('rapid switches leave four frames',await p.locator('.mc-viewport iframe').count()===4);
  check('no browser errors',!errors.length,errors);
 }finally{await fs.writeFile(path.join(out,'result.json'),JSON.stringify({base,checks,errors},null,2));await c.close();await b.close();console.log(JSON.stringify({passed:checks.filter(x=>x.pass).length,total:checks.length,errors}));}
})().catch(e=>{console.error(e);process.exitCode=1;});
