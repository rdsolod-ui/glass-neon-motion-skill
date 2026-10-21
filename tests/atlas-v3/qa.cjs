// Optional QA dependency. Never part of the published runtime.
let playwright;
try { playwright=require(process.env.PLAYWRIGHT_MODULE||'playwright'); }
catch(error) {
 if(process.platform==='win32'&&!process.env.PLAYWRIGHT_MODULE) playwright=require('C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
 else throw new Error('Set PLAYWRIGHT_MODULE to an existing Playwright installation. '+error.message);
}
const {chromium}=playwright;
const fs=require('node:fs');
fs.mkdirSync('qa',{recursive:true});
const base=process.env.QA_BASE||'http://127.0.0.1:4177/';
const prefix=process.env.QA_LABEL||'v3-integration';
(async()=>{
 const browser=await chromium.connectOverCDP(process.env.QA_CDP||'http://127.0.0.1:9223');
 const context=await browser.newContext({viewport:{width:1440,height:960}});
 context.setDefaultTimeout(10000);const page=await context.newPage();const checks=[],errors=[];
 const check=(name,pass,detail)=>checks.push({name,pass,detail});
 page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>errors.push(r.url()));
 page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
 try{
  const response=await page.goto(base+'moodboard.html',{waitUntil:'networkidle'});
  check('board HTTP200',response.status()===200);
  check('integrated inventories',await page.locator('[data-ha-entry]').count()===115&&await page.locator('[data-ha-input]').count()===22&&await page.locator('[data-ma-id]').count()===39&&await page.locator('.pattern').count()===48);
  const duplicates=await page.evaluate(()=>{const seen=new Set();return [...document.querySelectorAll('[id]')].flatMap(e=>seen.has(e.id)?[e.id]:(seen.add(e.id),[]))});
  check('no duplicate DOM ids',duplicates.length===0,duplicates);
  check('one visible main',await page.locator('main:visible').count()===1);
  const missing=await page.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].map(e=>e.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(decodeURIComponent(h.slice(1)))));
  check('all page anchors resolve',missing.length===0,missing);
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-theme')!==theme)await page.locator('[data-theme-toggle]').click();
   for(const width of [1440,768,390,320]){
    await page.setViewportSize({width,height:960});
    const overflow=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
    check(`all sections fit ${theme} ${width}`,overflow.scroll<=width,overflow);
   }
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('[data-menu]').click();await page.locator('#navigation a[href="#html-atlas"]').click();
  check('mobile nav closes on HTML selection',await page.locator('[data-menu]').getAttribute('aria-expanded')==='false');
  await page.locator('#ha-search').fill('dialog');await page.locator('#ha-tag-dialog>summary').click();
  await page.locator('[data-ha-dialog-open]').click();
  check('HTML native dialog opens',await page.locator('#ha-native-dialog').evaluate(e=>e.open));
  await page.keyboard.press('Escape');check('HTML dialog restores focus',await page.locator('[data-ha-dialog-open]').evaluate(e=>e===document.activeElement));
  await page.locator('#ha-search').fill('');
  await page.locator('#search').fill('dialog');
  await page.locator('.pattern:visible [data-inspect]').click();
  check('original recipe dialog still works',await page.locator('#recipe-dialog').evaluate(e=>e.open));await page.keyboard.press('Escape');await page.locator('#search').fill('');
  await page.locator('#solid-mode').check();
  const solid=await page.locator('.ha-surface,.ma-glass').evaluateAll(es=>es.map(e=>getComputedStyle(e).backdropFilter));
  check('manual solid reaches new labs',solid.length>0&&solid.every(x=>x==='none'),[...new Set(solid)]);await page.locator('#solid-mode').uncheck();
  await page.locator('#ma-group').selectOption('optics');
  check('motion group filter independent of HTML',await page.locator('[data-ma-id]:visible').count()===3&&await page.locator('#ha-count').textContent()==='115 элементов');
  await page.locator('#ma-group').selectOption('all');
  const hero=page.locator('[data-ma-play="hero"]');await hero.click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>matchMedia('(prefers-reduced-motion: reduce)').matches&&document.documentElement.dataset.reduce==='true');
  check('live reduce cancels new animations',await page.locator('#motion-atlas').evaluate(e=>e.getAnimations({subtree:true}).length===0));
  await hero.click();check('replay respects system reduce',await page.locator('#motion-atlas').evaluate(e=>e.getAnimations({subtree:true}).length===0));
  const reducedContext=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}});
  try{const rp=await reducedContext.newPage();await rp.goto(base+'moodboard.html',{waitUntil:'networkidle'});await rp.locator('[data-ma-play="press"]').click();const rd=await rp.evaluate(()=>({media:matchMedia('(prefers-reduced-motion: reduce)').matches,root:document.documentElement.dataset.reduce,animations:document.querySelector('#motion-atlas').getAnimations({subtree:true}).map(a=>({state:a.playState,property:a.effect.getKeyframes()}))}));check('reduced before load in fresh context',rd.media&&rd.root==='true'&&rd.animations.length===0,rd)}finally{await reducedContext.close()}
  await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#ma-group').selectOption('gesture');
  await page.locator('.ma-drag-knob').focus();await page.keyboard.press('End');
  check('drag keyboard alternative',await page.locator('.ma-drag-knob').getAttribute('aria-valuenow')==='100');await page.keyboard.press('Home');
  check('drag keyboard Home',await page.locator('.ma-drag-knob').getAttribute('aria-valuenow')==='0');
  await page.locator('#ma-group').selectOption('all');
  for(const [label,width,anchor] of [['html-desktop',1440,'#html-atlas'],['motion-desktop',1440,'#motion-atlas'],['html-mobile',390,'#ha-states'],['motion-mobile',390,'#ma-group-optics']]){
   await page.setViewportSize({width,height:960});await page.locator(anchor).evaluate(e=>e.scrollIntoView({block:'start',behavior:'instant'}));await page.screenshot({path:`qa/${prefix}-${label}.png`});
  }
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
  try{const p=await nojs.newPage();await p.goto(base+'moodboard.html');check('no JS content retained',await p.locator('[data-ha-entry]').count()===115&&await p.locator('[data-ma-id]').count()===39);await p.locator('#ha-tag-select>summary').click();check('native details without JS',await p.locator('#ha-tag-select select').isVisible())}finally{await nojs.close()}
  const site=await page.goto(base);check('original site HTTP200',site.status()===200);await page.locator('#open-spec').click();check('original site dialog regression',await page.locator('#spec-dialog').evaluate(e=>e.open));await page.keyboard.press('Escape');
  check('no JS or asset errors',errors.length===0,errors);
 }catch(e){errors.push(e.message);check('runner complete',false,e.message)}finally{
  await context.close();await browser.close();const report={base,checkedAt:new Date().toISOString(),checks,errors,passed:checks.filter(c=>c.pass).length,failed:checks.filter(c=>!c.pass).length};fs.writeFileSync(`qa/${prefix}.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failed:report.failed,failures:checks.filter(c=>!c.pass),errors}));if(report.failed||errors.length)process.exitCode=1;
 }
})();
