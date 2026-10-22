// Focused independent recheck after composition theme-state repair.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const base=(process.env.BASE_URL||'http://127.0.0.1:4177').replace(/\/$/,'');
(async()=>{const browser=await chromium.connectOverCDP('http://127.0.0.1:9223');const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true});const page=await context.newPage();await page.emulateMedia({reducedMotion:'reduce'});const checks=[],errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(base+'/moodboard.html',{waitUntil:'networkidle'});await page.locator('#ui-atlas[data-ready=true]').waitFor();
 assert.equal(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),true);checks.push('reduced-before-load-readback');
 await page.evaluate(()=>document.querySelector('#ui-group-foundation').open=true);
 for(const requested of ['dark','light']){await page.locator(`[data-uip-action=theme][data-value=${requested}]`).click();const opposite=requested==='dark'?'light':'dark';await page.locator('[data-theme-toggle]').click();assert.equal(await page.locator('html').getAttribute('data-theme'),opposite);assert.equal(await page.locator(`[data-uip-action=theme][data-value=${requested}]`).getAttribute('aria-pressed'),'false');assert.equal(await page.locator(`[data-uip-action=theme][data-value=${opposite}]`).getAttribute('aria-pressed'),'true');}
 checks.push('theme-pressed-sync-both-directions');assert.equal(await page.evaluate(()=>window.UIAtlas.diagnostics().active),0);checks.push('reduced-no-active');
 await page.goto(base+'/index.html',{waitUntil:'networkidle'});await page.locator('.hero a[href="#studio"]').click();assert.equal(await page.evaluate(()=>location.hash),'#studio');checks.push('site-primary-cta-studio');
 await page.locator('[data-menu]').tap();assert.equal(await page.locator('[data-menu]').getAttribute('aria-expanded'),'true');await page.keyboard.press('Escape');assert.equal(await page.locator('[data-menu]').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('[data-menu]').evaluate(e=>e===document.activeElement),true);checks.push('site-touch-menu-escape-focus');
 await page.locator('#open-spec').click();assert.equal(await page.locator('#spec-dialog').getAttribute('open'),'');await page.keyboard.press('Escape');assert.equal(await page.locator('#open-spec').evaluate(e=>e===document.activeElement),true);checks.push('site-dialog-escape-focus');
 assert.deepEqual(errors,[]);const receipt={base,checks,errors,pass:true};fs.writeFileSync('qa/ui-v5/peer-compositions-recheck.json',JSON.stringify(receipt,null,2));
 if(base.includes('127.0.0.1')){const file='qa/ui-v5/peer-compositions.json',previous=JSON.parse(fs.readFileSync(file,'utf8'));previous.originalFindings=previous.findings;previous.findings=[];previous.recheck=receipt;previous.pass=true;fs.writeFileSync(file,JSON.stringify(previous,null,2));}
 console.log(JSON.stringify(receipt));
}catch(e){console.error(e);process.exitCode=1;}finally{await context.close();await browser.close();}})();
