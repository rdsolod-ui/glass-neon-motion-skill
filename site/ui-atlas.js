import {initControls} from './ui-controls.js';
import {initCompositions} from './ui-compositions.js';
import {initData} from './ui-data.js';
const root=document.querySelector('#ui-atlas');
const normalize=s=>String(s).normalize('NFKC').toLocaleLowerCase('ru').replaceAll('ё','е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const synonyms=[['свитчер','свитч','switch','переключатель'],['хинт','hint','tooltip','подсказка'],['placeholder','плейсхолдер','заполнитель'],['бургер','burger','hamburger'],['header','хедер','шапка'],['footer','футер','подвал'],['cta','призыв'],['chart','charts','график','графики','диаграмма','диаграммы'],['icons','icon','иконки','иконка','solid','regular'],['button','кнопка','кнопки'],['select','selector','селект','селектор'],['motion','animation','анимация','движение'],['gloss','glossy','глянец','глянцевый','глянцевая'],['clear','transparent','прозрачный','прозрачное','прозрачная']].map(a=>a.map(normalize));
const terms=q=>normalize(q).split(' ').filter(Boolean).map(t=>synonyms.find(group=>group.includes(t))||[t]);
let teardown=()=>{},mounted=false;
function mount(){
 if(!root||mounted)return; mounted=true;
 const controller=new AbortController(),signal=controller.signal,active=new Set(),cleanups=[];
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const search=root.querySelector('#ui-search'),family=root.querySelector('#ui-family'),reduce=root.querySelector('#ui-reduce');
 const results=root.querySelector('#ui-search-results'),links=root.querySelector('#ui-result-links');
 const groups=[...root.querySelectorAll('[data-ui-group]')],cards=[...root.querySelectorAll('[data-ui-example]')];
 const reduced=()=>media.matches||reduce.checked||Boolean(window.GlassTheme?.motionOptions().reduced);
 const stop=()=>{for(const a of active)a.cancel();active.clear();};
 const api={animate(el,frames,options={}){if(!el)return;el.getAnimations().forEach(a=>a.cancel());if(reduced()||!el.animate||document.hidden)return;const duration=typeof options==='number'?options:options.duration??220;if(!Number.isFinite(duration)||duration<0)return;const settings=window.GlassTheme?.motionOptions(duration);const a=el.animate(frames,{duration:settings?.duration??Math.min(duration,5000),easing:settings?.easing??'cubic-bezier(.22,1,.36,1)',fill:'none'});active.add(a);a.onfinish=a.oncancel=()=>active.delete(a);return a;},announce(text){root.querySelector('#ui-announcement').textContent=text;},reduced};
 const syncReduce=()=>{document.documentElement.dataset.uiReduced=String(reduced());if(reduced())stop();};
 window.addEventListener('glass-theme-change',()=>{stop();syncReduce();},{signal});media.addEventListener('change',syncReduce,{signal});reduce.addEventListener('change',()=>{syncReduce();const ma=document.querySelector('#ma-reduce');if(ma){ma.checked=reduce.checked;ma.dispatchEvent(new Event('change',{bubbles:true}));}},{signal});syncReduce();
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal});
 for(const init of [initControls,initCompositions,initData]){const cleanup=init(root,api);if(typeof cleanup==='function')cleanups.push(cleanup);}
 root.querySelectorAll('[name=ui-edge]').forEach(radio=>radio.addEventListener('change',()=>{if(radio.checked)root.dataset.uiEdge=radio.value;},{signal}));
 const entries=[];
 function add(selector,kind,tag=''){document.querySelectorAll(selector).forEach((el,i)=>{if(!el.id)el.id=`ui-index-${normalize(tag||kind).replaceAll(" ","-")}-${i}`;const heading=el.querySelector('h3,h4,summary,code');entries.push({el,id:el.id,title:el.dataset.title||heading?.textContent?.trim()||el.textContent.trim().slice(0,70),text:normalize(`${el.dataset.search||''} ${el.dataset.haQuery||''} ${el.textContent} ${tag}`),kind,group:el.closest('[data-ui-group]')?.dataset.uiGroup});});}
 add('[data-ui-example]','Рабочий UI','component');add('[data-vx-example]','Вариант компонента','variation вариант');add('[data-ha-entry]','HTML','html');add('.ha-input-card','Тип input','input');add('.ha-state','HTML-состояние','state');add('.ma-card','Motion-этюд','motion animation анимация');add('.pattern','Визуальная композиция','composition');add('.user-reference','Референс','reference');add('#sources .source-card','Источник','source');add('.optical-study','Материал','glass material стекло');add('.finish-card','Материал','gloss clear transparent глянец прозрачный плёнка стекло');
 const matches=(entry,tokens)=>tokens.every(options=>options.some(t=>entry.text.includes(t)));
 function filter(){
  const tokens=terms(search.value),selected=family.value;
  const found=entries.filter(e=>(selected==='all'||e.group===selected)&&matches(e,tokens));
  const ids=new Set(found.map(e=>e.id));let count=0;
  cards.forEach(c=>{c.hidden=!ids.has(c.id);if(!c.hidden)count++;});
  groups.forEach(g=>{g.hidden=![...g.querySelectorAll('[data-ui-example]')].some(c=>!c.hidden);if(tokens.length||selected!=='all')g.open=!g.hidden;});
  root.querySelector('#ui-empty').hidden=count>0;
  root.querySelector('#ui-count').textContent=tokens.length?`${found.length} совпадений во всей коллекции · ${count} рабочих UI-примеров`:`${count} рабочих примеров · ${groups.filter(g=>!g.hidden).length} групп`;
  results.hidden=!tokens.length;links.replaceChildren();
  if(tokens.length){for(const entry of found){const li=document.createElement('li'),a=document.createElement('a'),name=document.createElement('span'),kind=document.createElement('small');a.href=`#${entry.id}`;name.textContent=entry.title;kind.textContent=entry.kind;a.append(name,kind);li.append(a);links.append(li);}if(!found.length){const p=document.createElement('li');p.textContent='Ничего не найдено. Попробуйте другое название или сбросьте фильтры.';links.append(p);}}
  root.querySelectorAll('[data-ui-jump]').forEach(a=>a.setAttribute('aria-current',String(a.dataset.uiJump===selected)));
 }
 search.addEventListener('input',filter,{signal});family.addEventListener('change',filter,{signal});
 root.querySelector('#ui-clear').addEventListener('click',()=>{search.value='';family.value='all';filter();search.focus();},{signal});
 const reveal=(id,focus=false)=>{const el=document.getElementById(id);if(!el)return;if(el.closest('.ui-group')&&(el.hidden||el.closest('.ui-group').hidden)){search.value='';family.value='all';filter();}let p=el;while(p&&p!==document.body){p.hidden=false;if(p.matches('details'))p.open=true;p=p.parentElement;}requestAnimationFrame(()=>{el.scrollIntoView({block:'start',behavior:reduced()?'instant':'auto'});if(focus){if(!el.hasAttribute('tabindex'))el.tabIndex=-1;el.focus({preventScroll:true});}});};
 root.querySelectorAll('[data-ui-jump]').forEach(a=>a.addEventListener('click',()=>{search.value='';family.value='all';filter();reveal(a.hash.slice(1));},{signal}));
 links.addEventListener('click',event=>{const a=event.target.closest('a');if(a)reveal(decodeURIComponent(a.hash.slice(1)),true);},{signal});
 document.addEventListener('click',event=>{const a=event.target.closest('a[href^="#"]');if(!a)return;const id=decodeURIComponent(a.hash.slice(1));const target=document.getElementById(id);if(target?.closest('.ui-group'))reveal(id);},{signal});
 const onHash=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}if(id)reveal(id);};
 addEventListener('hashchange',onHash,{signal});filter();if(location.hash)onHash();
 root.dataset.ready='true';
 window.UIAtlas={diagnostics:()=>({groups:groups.length,examples:cards.length,index:entries.length,active:active.size,reduced:reduced(),mounted}),dispose:()=>teardown()};
 teardown=()=>{if(!mounted)return;stop();cleanups.forEach(fn=>fn());controller.abort();mounted=false;root.dataset.ready='false';};
}
mount();addEventListener('pagehide',()=>teardown());addEventListener('pageshow',event=>{if(event.persisted)mount();});
