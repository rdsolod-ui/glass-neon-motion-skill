// Independent review by data_finish: controls, unified search and glass materials.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path');
const out=path.resolve('qa/ui-v5');fs.mkdirSync(out,{recursive:true});
const base=process.env.BASE_URL||'http://127.0.0.1:4177';
const report={base,reviewer:'data_finish',scope:'controls + global search + materials',checks:[],errors:[],screenshots:[]};
const check=(name,pass,detail)=>{report.checks.push({name,pass,detail});if(!pass)console.log('FAIL',name,JSON.stringify(detail));};
(async()=>{const b=await chromium.connectOverCDP('http://127.0.0.1:9223');const c=await b.newContext({viewport:{width:1440,height:1000}});const p=await c.newPage();p.setDefaultTimeout(7000);p.on('pageerror',e=>report.errors.push(e.message));
try{
 await p.emulateMedia({reducedMotion:'reduce'});await p.goto(`${base}/moodboard.html`);await p.locator('#ui-atlas[data-ready=true]').waitFor();
 check('reduced before load',await p.evaluate(()=>matchMedia('(prefers-reduced-motion:reduce)').matches&&UIAtlas.diagnostics().reduced));
 await p.locator('#ui-group-selectors').evaluate(e=>e.open=true);
 const combo=p.locator('[data-uic=combobox] [role=combobox]');await combo.fill('');await combo.focus();await combo.press('ArrowUp');
 const active=await combo.getAttribute('aria-activedescendant'),label=await p.locator('#'+active).textContent();
 check('combobox ArrowUp starts at last item',label.startsWith('Obsidian'),label);
 await combo.press('Escape');check('combobox Escape closes',await combo.getAttribute('aria-expanded')==='false');
 await combo.fill('Prism');await combo.press('ArrowDown');await combo.press('Enter');check('combobox Enter selects',await combo.inputValue()==='Prism');
 await p.locator('#ui-search').fill('свитчер');const switchLink=p.locator('#ui-result-links a[href="#ui-switches"]');check('Russian switch alias resolves working example',await switchLink.count()===1);await switchLink.click();
 check('search result reveals exact card',await p.locator('#ui-switches').isVisible());
 const toggle=p.locator('[data-uic=switches] [data-uic-light]');await toggle.focus();await toggle.press('Space');check('switch keyboard changes visible content',await p.locator('[data-uic=switches] [data-uic-lit]').getAttribute('data-uic-lit')==='false');
 await p.locator('#ui-clear').click();await p.locator('#ui-group-hints').evaluate(e=>e.open=true);
 const tipTrigger=p.locator('[data-uic=tooltip] [data-uic-action=tooltip]'),tip=p.locator('[data-uic=tooltip] [role=tooltip]');await tipTrigger.focus();await tip.waitFor({state:'visible'});await tipTrigger.press('Escape');check('tooltip keyboard dismisses',!(await tip.isVisible()));
 await p.locator('#ui-group-overlays').evaluate(e=>e.open=true);const dialogDemo=p.locator('[data-uic=edit-dialog]'),open=dialogDemo.locator('[data-uic-action=open]');await open.click();
 check('native dialog receives focus',await dialogDemo.locator('dialog').evaluate(d=>d.contains(document.activeElement)));
 await p.keyboard.press('Shift+Tab');await p.keyboard.press('Tab');check('modal traps keyboard',await dialogDemo.locator('dialog').evaluate(d=>d.contains(document.activeElement)));
 await p.keyboard.press('Escape');check('dialog restores focus',await open.evaluate(e=>e===document.activeElement));
 await p.locator('#ui-group-organization').evaluate(e=>e.open=true);const tabs=p.locator('[data-uic=tabs]');await tabs.locator('#uic-tab-0').focus();await p.keyboard.press('End');check('tabs End focus',await tabs.locator('#uic-tab-2').evaluate(e=>e===document.activeElement));await p.keyboard.press('Enter');check('tabs activate one panel',await tabs.locator('.uic-tab-panel:visible').count()===1&&await tabs.locator('#uic-panel-2').isVisible());
 const finishes=[];for(const finish of ['frost','clear']){await p.locator('#ui-finish').selectOption(finish);for(const edge of ['film','depth']){await p.locator(`[name=ui-edge][value=${edge}]`).check();finishes.push(await p.locator('#ui-switches').evaluate(e=>({finish:document.documentElement.dataset.finish,edge:document.documentElement.dataset.materialEdge,blur:getComputedStyle(e,'::before').backdropFilter,shadow:getComputedStyle(e,'::before').boxShadow,border:getComputedStyle(e).borderTopWidth})));}}
 check('four materials select independently',finishes.map(s=>s.finish+'/'+s.edge).join(',')==='frost/film,frost/depth,clear/film,clear/depth',finishes);
 check('clear retains background sharpness',finishes[2].blur.includes('0.8px')&&!finishes[0].blur.includes('0.8px'));
 check('2D and 3D differ without outline',finishes.every(s=>s.border==='0px')&&finishes[2].shadow!==finishes[3].shadow);
 await p.locator('#solid-mode').check();check('solid fallback in glossy state',await p.locator('#ui-switches').evaluate(e=>getComputedStyle(e,'::before').backdropFilter==='none'));await p.locator('#solid-mode').uncheck();
 for(const theme of ['light','dark']){await p.evaluate(t=>document.documentElement.dataset.theme=t,theme);await p.locator('#ui-switches').scrollIntoViewIfNeeded();const file=path.join(out,`peer-controls-${theme}-desktop.png`);await p.locator('#ui-switches').screenshot({path:file});report.screenshots.push(file);}
 await p.setViewportSize({width:390,height:844});await p.locator('#ui-switches').scrollIntoViewIfNeeded();check('390 no page overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 const file=path.join(out,'peer-controls-dark-mobile.png');await p.locator('#ui-switches').screenshot({path:file});report.screenshots.push(file);
 await p.emulateMedia({forcedColors:'active'});check('forced colors keeps visible switch boundary',await p.locator('.uic-track').first().evaluate(e=>getComputedStyle(e).borderTopWidth!=='0px'));await p.emulateMedia({forcedColors:'none'});
 await p.emulateMedia({reducedMotion:'no-preference'});await p.waitForFunction(()=>!UIAtlas.diagnostics().reduced);await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>UIAtlas.diagnostics().reduced);check('live reduced cancels feedback',await p.evaluate(()=>UIAtlas.diagnostics().active===0));
 check('no browser errors',report.errors.length===0,report.errors);
}catch(e){report.errors.push(e.stack)}finally{await c.close();await b.close();report.passed=report.checks.filter(c=>c.pass).length;report.total=report.checks.length;fs.writeFileSync(path.join(out,'peer-controls.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,total:report.total,errors:report.errors}));if(report.passed!==report.total||report.errors.length)process.exitCode=1;}})();
