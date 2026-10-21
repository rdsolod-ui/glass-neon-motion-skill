import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/admin/.codex/playwright-runtime/node_modules/playwright');
const root=path.dirname(fileURLToPath(import.meta.url));
const shots=path.resolve(root,'../../qa/agent-smoke');
await mkdir(shots,{recursive:true});
await mkdir(path.join(root,'evidence'),{recursive:true});
const browser=await chromium.connectOverCDP('http://127.0.0.1:9223');
const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
const page=await context.newPage();
const url=process.env.SMOKE_URL || 'http://127.0.0.1:4190';
const receipt={date:new Date().toISOString(),reviewer:'/root/design -> fallback glass_qa',implementationAuthor:'/root/site',browser:browser.version(),url,checks:[],screenshots:[],errors:[],limits:['Chromium only; no physical phone or OS setting test','Contrast computed on opaque reading surfaces; no WCAG certification','No performance/FPS claim']};
page.on('pageerror',e=>receipt.errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')receipt.errors.push(m.text());});
page.on('response',r=>{if(r.status()>=400)receipt.errors.push(`${r.status()} ${r.url()}`)});
function check(name,pass,detail){receipt.checks.push({name,pass:Boolean(pass),detail});}
async function shot(name){const f=path.join(shots,`${name}.png`);await page.screenshot({path:f,fullPage:true});receipt.screenshots.push(f);}
async function theme(value){if(await page.getAttribute('html','data-theme')!==value)await page.locator('#theme-toggle').click();}
async function mode(value){await page.locator(`input[value="${value}"]`).check();}
async function layout(){return page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,bodyOverflow:getComputedStyle(document.body).overflowX,fonts:document.fonts.check('16px Manrope','Плёнка'),loaded:[...document.fonts].filter(f=>f.status==='loaded').length}));}
try{
 await page.goto(url);await page.evaluate(()=>document.fonts.ready);
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:1000});
  for(const t of ['light','dark'])for(const m of ['2d','3d']){
   await theme(t);await mode(m);
   const l=await layout();check(`layout-${width}-${t}-${m}`,l.scroll<=l.width && l.bodyOverflow!=='hidden' && l.fonts,l);
   const surface=await page.locator('.glass-panel').evaluate(e=>{const s=getComputedStyle(e);return {border:s.borderTopWidth,outline:s.outlineWidth,shadow:s.boxShadow,blur:s.backdropFilter,edges:[...e.querySelectorAll('.edge')].map(x=>getComputedStyle(x).display)}});
   check(`material-${width}-${t}-${m}`,m==='2d'?surface.border==='0px'&&surface.outline==='0px'&&surface.shadow==='none'&&surface.edges.every(x=>x==='none'):surface.edges.every(x=>x==='block')&&surface.shadow!=='none',surface);
   await shot(`${width}-${t}-${m}`);
  }
 }
 await page.setViewportSize({width:1440,height:1000});await theme('light');await mode('2d');
 await page.locator('#theme-toggle').focus();await page.keyboard.press('Space');check('keyboard-theme-space',await page.getAttribute('html','data-theme')==='dark');
 await page.locator('input[value="2d"]').focus();await page.keyboard.press('ArrowRight');check('keyboard-radio-arrow',await page.getAttribute('html','data-mode')==='3d');
 const focus=await page.locator('input[value="3d"]+span').evaluate(e=>({outline:getComputedStyle(e).outlineStyle,width:getComputedStyle(e).outlineWidth}));check('focus-visible',focus.outline==='solid'&&focus.width==='3px',focus);await shot('keyboard-focus');
 await page.keyboard.press('Tab');check('keyboard-tab-next',await page.locator('#solid-toggle').evaluate(e=>e===document.activeElement));await page.keyboard.press('Space');
 const dense=await page.locator('.glass-panel').evaluate(e=>({blur:getComputedStyle(e).backdropFilter,bg:getComputedStyle(e).backgroundColor}));check('solid-toggle',dense.blur==='none',dense);check('solid-description',/Плотная поверхность/.test(await page.locator('.stage').getAttribute('aria-label'))&&/Плотный режим/.test(await page.locator('figcaption').textContent()));await shot('solid');await page.locator('#solid-toggle').uncheck();check('transparent-description-restored',/внутри размыты/.test(await page.locator('.stage').getAttribute('aria-label')));
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 const reduced=()=>page.evaluate(()=>({animations:document.getAnimations().length,transition:getComputedStyle(document.querySelector('#theme-toggle')).transitionDuration,visible:[...document.querySelectorAll('h1,h2,p')].every(e=>getComputedStyle(e).opacity==='1')}));
 const before=await reduced();check('reduced-before-load',before.animations===0&&before.transition==='0s'&&before.visible,before);
 await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#theme-toggle').click();await page.emulateMedia({reducedMotion:'reduce'});const live=await reduced();check('reduced-live',live.animations===0&&live.transition==='0s'&&live.visible,live);
 for(let i=0;i<8;i++){await page.locator('#theme-toggle').click();await mode(i%2?'2d':'3d');}check('rapid-toggles',await page.getAttribute('html','data-mode')==='2d');
 await page.emulateMedia({forcedColors:'active'});const forced=await page.locator('.glass-panel').evaluate(e=>{const s=getComputedStyle(e);return {blur:s.backdropFilter,border:s.borderTopWidth,shadow:s.boxShadow}});check('forced-colors',forced.blur==='none'&&forced.border==='1px'&&forced.shadow==='none',forced);await shot('forced-colors');await page.emulateMedia({forcedColors:'none',reducedMotion:'no-preference'});
 const cdp=await context.newCDPSession(page);await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});const transparency=await page.locator('.glass-panel').evaluate(e=>({matches:matchMedia('(prefers-reduced-transparency: reduce)').matches,blur:getComputedStyle(e).backdropFilter}));check('reduced-transparency-media',transparency.matches&&transparency.blur==='none',transparency);await cdp.send('Emulation.setEmulatedMedia',{features:[]});await cdp.detach();
 await page.setViewportSize({width:320,height:900});await page.locator('#mode-copy').evaluate(e=>e.textContent='Длинный текст материала проверяет переносы и читаемость. '.repeat(18)+'ОченьДлинноеСловоБезПробелов'.repeat(8));const long=await layout();check('long-content-320',long.scroll<=320,long);await shot('long-content-320');await page.reload();
 await page.evaluate(()=>document.documentElement.style.zoom='2');const zoom=await layout();check('zoom-200-320',zoom.scroll<=zoom.width,zoom);await shot('zoom-200');await page.evaluate(()=>document.documentElement.style.zoom='');
 const contrast=[];
 for(const t of ['light','dark']){await theme(t);contrast.push(...await page.evaluate(t=>{
  const rgb=s=>s.match(/[\d.]+/g)?.map(Number);const lum=c=>c.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
  return [...document.querySelectorAll('h1,h2,p,figcaption,legend,.stage-label,.stage-mark,.masthead button,.segments span,.solid-control span')].map(e=>{const s=getComputedStyle(e);let n=e,b;while(n){b=rgb(getComputedStyle(n).backgroundColor);if(b&&(b.length===3||b[3]===1))break;n=n.parentElement;}if(!b)return null;const a=lum(rgb(s.color)),z=lum(b),ratio=(Math.max(a,z)+.05)/(Math.min(a,z)+.05);const size=parseFloat(s.fontSize),large=size>=24||(size>=18.66&&parseInt(s.fontWeight)>=700);return {theme:t,element:e.className||e.tagName,text:e.textContent.slice(0,35),ratio,required:large?3:4.5};}).filter(Boolean);
 },t));}
 check('opaque-reading-contrast',contrast.every(c=>c.ratio>=c.required),contrast);
 const touch=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});const tp=await touch.newPage();await tp.goto(url);await tp.locator('#theme-toggle').tap();await tp.locator('input[value="3d"]').tap();check('touch-controls',await tp.getAttribute('html','data-theme')==='dark'&&await tp.getAttribute('html','data-mode')==='3d');await touch.close();
 const nojs=await browser.newContext({javaScriptEnabled:false});const np=await nojs.newPage();await np.goto(url);check('no-javascript-readable',await np.locator('h1').isVisible()&&await np.locator('noscript').isVisible());await nojs.close();
 check('console-network',receipt.errors.length===0,receipt.errors);
}catch(e){receipt.errors.push(e.stack);check('uncaught-run',false,e.message);}finally{await context.close();await browser.close();receipt.passed=receipt.checks.filter(x=>x.pass).length;receipt.failed=receipt.checks.filter(x=>!x.pass).length;await writeFile(path.join(root,'evidence/browser-qa.json'),JSON.stringify(receipt,null,2));console.log(JSON.stringify({passed:receipt.passed,failed:receipt.failed,errors:receipt.errors,screenshots:receipt.screenshots.length}));}
