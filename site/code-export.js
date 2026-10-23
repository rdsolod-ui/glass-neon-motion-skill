import pack from './export-assets.js';
import {DEFAULT_THEME,buildThemeCSS,runtimeSource} from './theme-studio.js';

const selectors='[data-type-example],[data-ui-example],[data-vx-example],[data-ha-entry],.ha-input-card,.ha-state,.ma-card,.pattern,.finish-card,.optical-study';
const records=[];
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const license='LUMA / Glass Atlas — original specimen.\nhttps://github.com/rdsolod-ui/glass-neon-motion-skill\nFonts: Manrope, SIL Open Font License. Icons retain their embedded source attribution.\n';
const baseCSS=`body{margin:0;padding:clamp(16px,4vw,48px);min-height:100vh}main{max-width:1100px;margin:auto;min-width:0}.export-note{font:14px/1.6 system-ui;margin:0 0 24px}.export-sample{min-width:0}.export-sample>section{padding:0;margin:0;width:100%}.export-sample .wrap{width:100%;margin-inline:0}.export-sample .ui-grid,.export-sample .ha-grid,.export-sample .ma-grid,.export-sample .atlas-grid,.export-sample .finish-grid,.export-sample .optical-grid,.export-sample .vx-grid,.export-sample .ty-grid{grid-template-columns:minmax(0,1fr)}.export-sample .pattern{max-width:700px;margin:auto}.export-sample .ha-state,.export-sample .ha-input-card{min-width:0}img,svg{max-width:100%}#export-status:empty{display:none}`;
const moduleCode=names=>'const modules={};\n'+names.map(n=>pack.modules[n]).join('\n');
const sharedRuntime=`const status=document.querySelector('#export-status');
window.GlassTheme=window.GlassThemeRuntime;
const api={reduced:()=>GlassThemeRuntime.motionOptions().reduced,animate:(el,frames,options={})=>GlassThemeRuntime.animate(el,frames,typeof options==='number'?options:options.duration??220),announce:text=>{status.textContent=text;}};
const sync=()=>{if(api.reduced())document.getAnimations().forEach(a=>a.cancel());document.documentElement.dataset.uiReduced=String(api.reduced());dispatchEvent(new Event('glass-theme-change'));};
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',sync);sync();
addEventListener('pagehide',()=>document.getAnimations().forEach(a=>a.cancel()));`;

function kindOf(card){if(card.matches('[data-type-example]'))return'typography';if(card.matches('[data-ui-example]'))return'ui';if(card.matches('[data-vx-example]'))return'variation';if(card.matches('.ma-card'))return'motion';if(card.matches('.pattern'))return'composition';if(card.matches('.finish-card,.optical-study'))return'material';return'html';}
function capture(card,index){
 const kind=kindOf(card),copy=card.cloneNode(true);
 copy.hidden=false;copy.removeAttribute('data-ready');
 copy.querySelectorAll('[data-inspect]').forEach(e=>e.remove());
 // Preserve only the specimen's ancestor shells, never sibling specimens or atlas controls.
 let node=copy,parent=card.parentElement;
 while(parent&&!parent.matches('main,body')){
  let shell=parent.cloneNode(false);if(shell.matches('details')){const div=document.createElement('div');for(const a of shell.attributes)if(a.name!=='open')div.setAttribute(a.name,a.value);shell=div;}shell.hidden=false;shell.removeAttribute('aria-labelledby');shell.removeAttribute('data-ready');if(shell.matches('details'))shell.open=true;shell.append(node);node=shell;parent=parent.parentElement;
 }
 for(const image of node.querySelectorAll('[src]')){const src=image.getAttribute('src').replace(/^\.\//,'');if(pack.assets[src])image.setAttribute('src',pack.assets[src]);}
 // Document-local fragment references stay local. Authored reference links remain explicit URLs.
 for(const link of node.querySelectorAll('a[href^="./"]'))link.href=new URL(link.getAttribute('href'),'https://rdsolod-ui.github.io/glass-neon-motion-skill/').href;
 const title=card.dataset.title||card.querySelector('h3,h4,code')?.textContent.trim()||`Образец ${index+1}`;
 const type=kind==='composition'||kind==='material'?'Визуальный образец':kind==='motion'?'Motion-этюд':kind==='html'?'HTML-пример; ограничения и статус указаны в карточке':'Рабочий локальный пример; без серверной интеграции';
 return{id:card.id||`specimen-${index+1}`,title,kind,type,html:node.outerHTML,pattern:card.dataset.id};
}
function scriptFor(record,state,shared=true){
 let code=shared?runtimeSource(state)+'\n'+sharedRuntime+'\n':'const api=window.__exportAPI;\n';
 if(record.kind==='typography')code+=moduleCode(['typography']);
 if(record.kind==='ui')code+=moduleCode(['ui-controls','ui-compositions','ui-data'])+`\nconst root=document.querySelector('#ui-atlas');const cleanups=['ui-controls','ui-compositions','ui-data'].map((n,i)=>modules[n][['initControls','initCompositions','initData'][i]](root,api));addEventListener('pagehide',()=>cleanups.forEach(fn=>fn?.()));`;
 if(record.kind==='variation')code+=moduleCode(['variation-advanced','variation-atlas']);
 if(record.kind==='html')code+=moduleCode(['html-atlas']);
 if(record.kind==='motion')code+=moduleCode(['motion-atlas']);
 if(record.kind==='composition'){
  const p=pack.patterns.find(p=>String(p.id)===record.pattern),m=p&&pack.motions[p.motion];
  code+=`const frames=${pack.frames};document.querySelector('[data-play]')?.addEventListener('click',()=>{const key=${JSON.stringify(p?.motion||'none')};if(frames[key])api.animate(document.querySelector(key==='light'?'.specular':'.mini-ui'),frames[key],${m?.duration||220});if(api.reduced())api.announce('Показан статичный образец: уменьшение движения включено.');});`;
 }
 if(record.kind==='material')code+=`document.querySelectorAll('[data-material-preset]').forEach(b=>{b.disabled=false;b.addEventListener('click',()=>{api.announce('Это автономный образец выбранного материала. Настройте другой материал в исходном атласе.');});});`;
 return'/* '+license+'*/\n(()=>{\n'+code+'\n})();\n';
}
function build(record,state=window.GlassTheme?.getSnapshot?.()||structuredClone(DEFAULT_THEME)){
 const specific={typography:[],ui:['ui-atlas','ui-controls','ui-compositions','ui-data'],variation:['variation-advanced','variation-atlas'],html:['html-atlas'],motion:['motion-atlas'],composition:[],material:[]}[record.kind];
 const css='/* '+license+pack.license.replaceAll('*/','* /')+'*/\n'+['style','board-v2','material-finishes',...specific,'typography'].map(n=>pack.css[n]).join('\n')+'\n'+buildThemeCSS(state)+'\n'+baseCSS;
 const js=scriptFor(record,state);
 const body=`<main><p class="export-note">${escape(record.title)} · ${escape(record.type)}<br><a href="https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html#${encodeURIComponent(record.id)}">Исходный атлас</a> · LUMA · Manrope / OFL</p><div class="export-sample">${record.html}</div><p id="export-status" role="status" aria-live="polite"></p></main>`;
 const head=`<!doctype html>\n<html lang="ru" data-glass-theme="exported" data-theme="${state.appearance.theme}" data-finish="${state.material.finish}" data-material-edge="${state.material.edge}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(record.title)} — LUMA</title><link rel="icon" href="data:,">`;
 const html=head+'<link rel="stylesheet" href="sample.css"></head><body class="atlas-page">'+body+'<script src="sample.js" defer></script></body></html>';
 const standalone=head+'<style>'+css.replace(/<\/style/gi,'<\\/style')+'</style></head><body class="atlas-page">'+body+'<script>'+js.replace(/<\/script/gi,'<\\/script')+'</script></body></html>';
 return{html,css,js,standalone};
}

const dialog=document.createElement('dialog');dialog.className='ce-dialog';dialog.id='code-export-dialog';dialog.setAttribute('aria-labelledby','ce-title');
dialog.innerHTML='<div class="ce-head"><h2 id="ce-title">Код образца</h2><button type="button" class="btn" data-ce-close aria-label="Закрыть код">Закрыть</button></div><p class="ce-note" id="ce-description"></p><div class="ce-tabs" role="group" aria-label="Формат кода"><button type="button" class="btn" data-ce-tab="html" aria-pressed="true">HTML</button><button type="button" class="btn" data-ce-tab="css" aria-pressed="false">CSS</button><button type="button" class="btn" data-ce-tab="js" aria-pressed="false">JavaScript</button></div><label for="ce-code" id="ce-label">HTML · sample.html</label><textarea class="ce-code" id="ce-code" readonly spellcheck="false"></textarea><div class="ce-actions"><button type="button" class="btn primary" data-ce-copy>Копировать HTML</button><button type="button" class="btn" data-ce-download>Скачать автономный HTML</button></div><p class="ce-status" role="status" aria-live="polite"></p><p class="ce-note">Три вкладки — файлы sample.html, sample.css и sample.js одного примера. Скачанный HTML объединяет их вместе со шрифтами и иконками и работает без сети. Снимок настроек темы фиксируется при открытии кода. Исходное состояние примера сохранено; введённые вами данные не экспортируются.</p>';
document.body.append(dialog);
let selected=null,parts=null,tab='html',revision=0,opener=null;
const code=dialog.querySelector('#ce-code'),status=dialog.querySelector('.ce-status');
const showTab=key=>{tab=key;revision++;code.value=parts[key];dialog.querySelector('#ce-label').textContent=key.toUpperCase()+' · sample.'+(key==='html'?'html':key);dialog.querySelector('[data-ce-copy]').textContent='Копировать '+key.toUpperCase();dialog.querySelectorAll('[data-ce-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.ceTab===key)));status.textContent='';};
let legacyIndex=0;
document.querySelectorAll(selectors).forEach((card,index)=>{
 const record=capture(card,card.matches('[data-type-example]')?index:legacyIndex++);if(!card.id)card.id=record.id;records.push(record);
 const button=document.createElement('button');button.type='button';button.className='btn ce-launch';button.textContent='Код и экспорт';button.setAttribute('aria-label',`Код и экспорт: ${record.title}`);
 button.addEventListener('click',()=>{selected=record;parts=build(record);opener=button;dialog.querySelector('#ce-title').textContent=record.title;dialog.querySelector('#ce-description').textContent=record.type;showTab('html');dialog.showModal();});card.append(button);
});
dialog.querySelector('[data-ce-close]').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{revision++;opener?.focus();});
dialog.querySelectorAll('[data-ce-tab]').forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.ceTab)));
dialog.querySelector('[data-ce-copy]').addEventListener('click',async()=>{
 const request=++revision,payload=code.value,format=tab;status.textContent='Копирование…';
 try{await navigator.clipboard.writeText(payload);if(request===revision&&dialog.open)status.textContent=format.toUpperCase()+' скопирован.';}
 catch{if(request!==revision||!dialog.open)return;code.focus();code.select();status.textContent='Автокопирование недоступно. Код выделен — нажмите Ctrl+C или используйте команду копирования.';}
});
const urls=new Set();
dialog.querySelector('[data-ce-download]').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([parts.standalone],{type:'text/html;charset=utf-8'}));urls.add(url);const a=document.createElement('a');a.href=url;a.download='luma-'+selected.id.replace(/[^a-z0-9_-]/gi,'-')+'.html';a.click();status.textContent='Автономный HTML подготовлен к скачиванию.';setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},1500);});
addEventListener('pagehide',()=>{revision++;urls.forEach(url=>URL.revokeObjectURL(url));urls.clear();});
// Deterministic inspection API for coverage and offline regression checks.
window.GlassExport={buildCollection,inventory:()=>records.map(({html,...r})=>r),build:id=>{const r=records.find(r=>r.id===id);if(!r)throw new Error('Unknown specimen');return build(r);}};

function buildCollection(ids,title='Моя подборка',state=window.GlassTheme?.getSnapshot?.()||structuredClone(DEFAULT_THEME)){
 const chosen=[...new Set(ids)].map(id=>records.find(r=>r.id===id)).filter(Boolean);
 if(!chosen.length)throw new Error('Выберите хотя бы один компонент.');
 const cssNames=new Set(['style','board-v2','material-finishes']);
 const byKind={ui:['ui-atlas','ui-controls','ui-compositions','ui-data'],variation:['variation-advanced','variation-atlas'],html:['html-atlas'],motion:['motion-atlas'],typography:[],composition:[],material:[]};
 chosen.forEach(r=>byKind[r.kind].forEach(n=>cssNames.add(n)));cssNames.add('typography');
 const css='/* '+license+pack.license.replaceAll('*/','* /')+'*/\n'+[...cssNames].map(n=>pack.css[n]).join('\n')+'\n'+buildThemeCSS(state)+'\n'+baseCSS;
 const core='(()=>{'+runtimeSource(state)+'\n'+sharedRuntime+'\nwindow.__exportAPI=api;})();';
 const scripts={},items=chosen.map(r=>{const key=r.kind==='composition'?r.id:r.kind;scripts[key]??=scriptFor(r,state,false);return{id:r.id,title:r.title,type:r.type,html:r.html,key};});
 const payload=JSON.stringify({title,state,items,css,core,scripts});
 const js=`(()=>{const data=${payload};const urls=[];const blob=(text,type)=>{const url=URL.createObjectURL(new Blob([text],{type}));urls.push(url);return url;};
 const cssURL=blob(data.css,'text/css'),coreURL=blob(data.core,'text/javascript'),scripts=Object.fromEntries(Object.entries(data.scripts).map(([k,v])=>[k,blob(v,'text/javascript')]));
 Object.assign(document.documentElement.dataset,{glassTheme:'exported',theme:data.state.appearance.theme,finish:data.state.material.finish,materialEdge:data.state.material.edge});
 const link=document.createElement('link');link.rel='stylesheet';link.href=cssURL;document.head.append(link);
 const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
 for(const item of data.items){const section=document.createElement('section'),heading=document.createElement('h2'),frame=document.createElement('iframe');heading.textContent=item.title;section.append(heading,frame);document.querySelector('#collection-items').append(section);frame.title=item.title;frame.setAttribute('sandbox','allow-scripts allow-same-origin');frame.style.cssText='width:100%;border:0;display:block;height:600px';
 frame.addEventListener('load',()=>{const doc=frame.contentDocument;if(!doc)return;const measure=()=>{frame.style.height=Math.ceil(doc.body.getBoundingClientRect().height+32)+'px';};const observer=new ResizeObserver(measure);observer.observe(doc.body);measure();addEventListener('pagehide',()=>observer.disconnect(),{once:true});});
 const s=data.state;frame.srcdoc='<!doctype html><html lang="ru" data-glass-theme="exported" data-theme="'+s.appearance.theme+'" data-finish="'+s.material.finish+'" data-material-edge="'+s.material.edge+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="'+cssURL+'"><style>body{min-height:0;padding:16px}main{max-width:none}</style></head><body class="atlas-page"><main><p class="export-note">'+esc(item.type)+'</p><div class="export-sample">'+item.html+'</div><p id="export-status" role="status"></p></main><script src="'+coreURL+'"><\/script><script src="'+scripts[item.key]+'"><\/script></body></html>';}
 addEventListener('pagehide',()=>urls.forEach(URL.revokeObjectURL),{once:true});})();`;
 const standalone='<!doctype html><html lang="ru" data-theme="'+state.appearance.theme+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(title)+' — LUMA</title><style>'+'body{padding:24px}#collection-items>section{margin:32px 0}h1{font-size:clamp(2rem,6vw,4rem)}h2{font-size:1.25rem}</style></head><body><main><h1>'+escape(title)+'</h1><p>'+chosen.length+' компонентов · одна тема · LUMA</p><div id="collection-items"></div><noscript>Для отображения изолированных компонентов включите JavaScript.</noscript></main><script>'+js.replace(/<\/script/gi,'<\\/script')+'</script></body></html>';
 const html=standalone.replace(/<script>[\s\S]*<\/script>/,'<script src="collection.js" defer></script>');
 const fileJS=js.replace(JSON.stringify(css),'null').replace("blob(data.css,'text/css')","'collection.css'");
 const files={'index.html':html,'collection.js':fileJS,'collection.css':css,'theme.json':JSON.stringify(state,null,2),'LICENSES.txt':license+pack.license,'README.txt':'LUMA collection. Open index.html in a browser. Shared styles and scripts; isolated iframe components. No backend. Original examples retain their stated limitations.'};
 return{standalone,count:chosen.length,state,files};
}
