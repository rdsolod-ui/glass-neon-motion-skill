import './code-export.js';

const combinations=[['clear','film','Clear / 2D'],['clear','depth','Clear / 3D'],['frost','film','Frost / 2D'],['frost','depth','Frost / 3D']];
const families={ui:'UI',variation:'Варианты',html:'HTML и состояния',typography:'Типографика',motion:'Motion',composition:'Композиции'};
const scenarios={
 'ui-action-save':[['run','Загрузка → успех'],['error','Загрузка → ошибка']],
 'ui-progress-job':[['run','Запустить прогресс']],
 'ui-skeleton-content':[['run','Загрузить содержимое']],
 'ui-empty-state':[['error','Показать ошибку']],
 'ui-validated-form':[['error','Ошибки пустой формы']],
 'ui-edit-dialog':[['open','Открыть диалог']],
 'ui-confirm-dialog':[['open','Открыть подтверждение']],
 'ui-bottom-sheet':[['open','Открыть нижнюю панель']],
};

const panel=document.querySelector('#material-compare')||document.createElement('section');
panel.id='material-compare';panel.className='section wrap mc-lab';panel.setAttribute('aria-labelledby','mc-title');
panel.innerHTML=`<div class="section-head"><div><div class="eyebrow">Сравнение / один компонент</div><h2 id="mc-title">Один фон.<br>Четыре материала.</h2></div><p>Сравните прозрачность и край на одном образце. Поля и действия можно связать, чтобы увидеть одинаковое состояние во всех четырёх окнах.</p></div>
<div class="mc-controls"><label for="mc-search">Найти образец<input id="mc-search" type="search" placeholder="Название или группа" autocomplete="off"></label><label for="mc-component">Компонент<select id="mc-component"></select></label><label for="mc-theme">Тема сравнения<select id="mc-theme"><option value="light">Светлая</option><option value="dark">Тёмная</option></select></label><label for="mc-width">Ширина окна<select id="mc-width"><option value="auto">По ширине ячейки</option><option value="390">Mobile · 390 px</option><option value="768">Tablet · 768 px</option></select></label></div>
<div class="mc-options"><label><input id="mc-linked" type="checkbox" checked> Связать поля и действия</label><label><input id="mc-reduce" type="checkbox" checked> Уменьшить движение</label><label><input id="mc-solid" type="checkbox"> Без прозрачности</label><button type="button" class="btn" data-mc-reset>Сбросить состояние</button><button type="button" class="btn" data-mc-theme>Взять настройки атласа</button></div>
<p id="mc-description" class="mc-note"></p><div class="mc-scenarios" role="group" aria-label="Сценарии компонента"></div>
<p id="mc-status" class="mc-note" role="status" aria-live="polite">Выберите компонент или откройте сравнение из его карточки.</p>
<div class="mc-grid"></div><p class="mc-note">В окнах работает код автономного HTML. Скачивание сохраняет тему и материал, состояние начинается с исходного. Наведение и клавиатурный фокус проверяются в каждом окне отдельно. Файлы, пароли и внешние ссылки не синхронизируются. Широкое окно на телефоне прокручивается внутри ячейки.</p>`;
if(!panel.isConnected)document.querySelector('#theme-studio').before(panel);
const $=selector=>panel.querySelector(selector),records=GlassExport.inventory().filter(r=>r.materialPolicy!=='fixed-study');
let chosen=records.find(r=>r.id==='ui-action-save')?.id||records[0].id;
let snapshot=GlassTheme.getSnapshot(),generation=0,frames=[],rendered=false,linkedBusy=false,events=new AbortController();
const urls=new Set(),pendingLoads=new Set(),pendingFocus=new Set();
function afterClose(restore){const timer=setTimeout(()=>{pendingFocus.delete(timer);restore();},0);pendingFocus.add(timer);}
$('#mc-theme').value=snapshot.appearance.theme;
const say=text=>{$('#mc-status').textContent=text;};
function options(){
 const term=$('#mc-search').value.trim().toLocaleLowerCase('ru');
 const filtered=records.filter(r=>(r.title+' '+families[r.kind]+' '+r.id).toLocaleLowerCase('ru').includes(term));
 const select=$('#mc-component');select.replaceChildren();
 for(const [kind,label] of Object.entries(families)){
  const group=document.createElement('optgroup');group.label=label;
  for(const r of filtered.filter(r=>r.kind===kind))group.append(new Option(r.title,r.id));
  if(group.children.length)select.append(group);
 }
 const found=filtered.some(r=>r.id===chosen);
 if(found)select.value=chosen;
 else if(filtered.length){select.prepend(new Option('Выберите из найденного',''));select.value='';}
 select.disabled=!filtered.length;
 if(!filtered.length)say('Совпадений нет. Текущее сравнение сохранено.');
 else if(!found)say('Найдено '+filtered.length+'. Выберите образец — текущее сравнение пока сохранено.');
}
options();

// A DOM path is resolved only inside the identical, trusted authored specimen.
function pathTo(node,root){const path=[];while(node&&node!==root){const parent=node.parentElement;if(!parent)return null;path.unshift([...parent.children].indexOf(node));node=parent;}return node===root?path:null;}
function atPath(root,path){return path?.reduce((node,index)=>node?.children[index],root);}
function wire(entry,signal){
 const doc=entry.frame.contentDocument,root=doc.querySelector('.export-sample');
 if(!root)return;
 const restoreFor=dialog=>{
  const trigger=[...(dialog.closest('[data-uic]')||root).querySelectorAll('[data-uic-action]')].find(el=>el.dataset.uicAction===(dialog.dataset.uicTrigger||'open'))||doc.activeElement;
  return()=>{if(entry.frame.isConnected&&trigger?.isConnected)trigger.focus({preventScroll:true});};
 };
 for(const type of ['input','change','click'])root.addEventListener(type,event=>{
  if(!event.isTrusted||linkedBusy||!$('#mc-linked').checked)return;
  const target=type==='click'?event.target.closest('button,summary,[role="button"]'):event.target;
  if(!target||!root.contains(target)||target.matches('input[type="file"],input[type="password"],input[id*="password"],input[autocomplete="current-password"],input[autocomplete="new-password"]'))return;
  const path=pathTo(target,root);if(!path)return;
  const dialog=type==='click'?target.closest('dialog[open]'):null;
  const method=(target.getAttribute('formmethod')||target.form?.getAttribute('method')||'').trim().toLowerCase();
  const closeFocus=dialog&&method==='dialog'?restoreFor(dialog):null;
  if(closeFocus)entry.restoreCloseFocus=closeFocus;
  const active=doc.activeElement;linkedBusy=true;
  try{for(const other of frames){if(other===entry)continue;const dest=atPath(other.frame.contentDocument?.querySelector('.export-sample'),path);if(!dest||dest.tagName!==target.tagName)continue;
   if(type==='click'){if(closeFocus)other.restoreCloseFocus=closeFocus;dest.click();continue;}
   if(target.tagName==='SELECT'&&target.multiple)[...dest.options].forEach((o,i)=>o.selected=target.options[i].selected);
   else if('value' in target)dest.value=target.value;
   if('checked' in target)dest.checked=target.checked;
   dest.dispatchEvent(new Event(type,{bubbles:true}));
  }}finally{linkedBusy=false;if(active?.isConnected)active.focus({preventScroll:true});}
 },{signal});
 root.addEventListener('close',event=>{
  // Each specimen restores its own trigger on close. A mirrored close must
  // return focus to the originating iframe after those local listeners run.
  if(entry.restoreCloseFocus){const restore=entry.restoreCloseFocus;entry.restoreCloseFocus=null;afterClose(restore);return;}
  if(!$('#mc-linked').checked||event.target.tagName!=='DIALOG')return;
  const path=pathTo(event.target,root);
  const restore=restoreFor(event.target);
  for(const other of frames){if(other===entry)continue;const dialog=atPath(other.frame.contentDocument?.querySelector('.export-sample'),path);if(dialog?.open){other.restoreCloseFocus=restore;dialog.close(event.target.returnValue);}}
  afterClose(restore);
 },{capture:true,signal});
}
function applyEnvironment(entry){
 const doc=entry.frame.contentDocument;if(!doc)return;
 doc.documentElement.dataset.solid=String($('#mc-solid').checked);
}
function scenario(id,doc){
 const click=name=>doc.querySelector(`[data-uic-action="${name}"]`)?.click();
 if(chosen==='ui-action-save'){
  const fail=doc.querySelector('[data-uic-fail]');fail.checked=id==='error';click('save');
 }else if(chosen==='ui-progress-job')click('start');
 else if(chosen==='ui-skeleton-content')click('load');
 else if(chosen==='ui-validated-form'){
  doc.querySelectorAll('.export-sample input').forEach(input=>input.value='');doc.querySelector('.export-sample form')?.requestSubmit();
 }else if(id==='scroll-end')doc.querySelector('[data-vx-action="scroll-end"]')?.click();
 else click(id);
}
function updateScenarios(record){
 const rows=[...(scenarios[record.id]||[])];
 if(record.id.startsWith('vx-scroll-'))rows.push(['scroll-end','Прокрутить до конца']);
 const host=$('.mc-scenarios');host.replaceChildren();
 for(const [id,label] of rows){const button=document.createElement('button');button.type='button';button.className='btn';button.disabled=true;button.dataset.mcScenario=id;button.textContent=label;button.addEventListener('click',()=>{frames.forEach(e=>scenario(id,e.frame.contentDocument));say('Сценарий запущен во всех окнах: '+label+'. Действия остаются локальными.');});host.append(button);}
}
async function render(){
 rendered=true;const revision=++generation;pendingLoads.forEach(cancel=>cancel());pendingFocus.forEach(clearTimeout);pendingFocus.clear();events.abort();events=new AbortController();
 frames.forEach(e=>e.frame.remove());frames=[];$('.mc-grid').replaceChildren();
 const record=records.find(r=>r.id===chosen);if(!record)return;
 snapshot.appearance.theme=$('#mc-theme').value;snapshot.motion.reduce=$('#mc-reduce').checked;
 $('#mc-description').textContent=record.title+' · '+record.type;
 updateScenarios(record);say('Загружаются четыре варианта…');panel.dataset.ready='false';
 const loads=combinations.map(([finish,edge,label],index)=>{
  const state=structuredClone(snapshot);Object.assign(state.material,{finish,edge});
  const parts=GlassExport.build(chosen,state,{solid:$('#mc-solid').checked}),tile=document.createElement('article');tile.className='mc-tile';tile.dataset.finish=finish;tile.dataset.edge=edge;
  const head=document.createElement('header'),title=document.createElement('h3');title.textContent=label;
  const download=document.createElement('button');download.type='button';download.className='btn';download.textContent='Скачать HTML';download.dataset.mcDownload=index;download.setAttribute('aria-label','Скачать '+record.title+' · '+label);
  const focus=document.createElement('button');focus.type='button';focus.className='btn';focus.textContent='Войти в пример';focus.dataset.mcFocus=index;focus.setAttribute('aria-label','Перейти к первому действию · '+label);
  head.append(title,focus,download);const stage=document.createElement('div');stage.className='mc-viewport';
  const frame=document.createElement('iframe');frame.title=record.title+' · '+label;frame.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms');
  frame.style.width=$('#mc-width').value==='auto'?'100%':$('#mc-width').value+'px';
  const entry={frame,parts,state};frames.push(entry);stage.append(frame);tile.append(head,stage);$('.mc-grid').append(tile);
  download.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([parts.standalone],{type:'text/html;charset=utf-8'}));urls.add(url);const a=document.createElement('a');a.href=url;a.download=`luma-${chosen}-${finish}-${edge}.html`;a.click();setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},1500);say('Скачан '+label+' — исходное состояние, выбранные тема и материал.');});
  focus.addEventListener('click',()=>{const doc=frame.contentDocument;const target=[...doc.querySelectorAll('.export-sample button:not(:disabled),.export-sample input:not(:disabled):not([type="hidden"]),.export-sample select:not(:disabled),.export-sample textarea:not(:disabled),.export-sample summary,.export-sample [tabindex="0"]')].find(el=>el.getClientRects().length);(target||doc.body).focus();});
  return new Promise(resolve=>{
   let timer;const cancel=()=>finish(false);const finish=ok=>{clearTimeout(timer);pendingLoads.delete(cancel);resolve(ok);};
   pendingLoads.add(cancel);timer=setTimeout(cancel,10000);
   frame.addEventListener('load',()=>{if(revision!==generation)return finish(false);applyEnvironment(entry);wire(entry,events.signal);finish(true);},{once:true});frame.srcdoc=parts.standalone;
  });
 });
 const loaded=await Promise.all(loads);if(revision!==generation)return;
 if(loaded.some(ok=>!ok)){say('Не все окна загрузились. Нажмите «Сбросить состояние», чтобы повторить.');return;}
 panel.dataset.ready='true';panel.querySelectorAll('[data-mc-scenario]').forEach(button=>button.disabled=false);say('Готово: '+record.title+'. Четыре сочетания на одинаковом фоне.');
}
$('#mc-search').addEventListener('input',options);
$('#mc-component').addEventListener('change',()=>{if(!$('#mc-component').value)return;chosen=$('#mc-component').value;render();});
for(const selector of ['#mc-theme','#mc-width','#mc-reduce','#mc-solid'])$(selector).addEventListener('change',render);
$('[data-mc-reset]').addEventListener('click',render);
$('[data-mc-theme]').addEventListener('click',()=>{snapshot=GlassTheme.getSnapshot();$('#mc-theme').value=snapshot.appearance.theme;render();});
function open(id){
 if(!records.some(r=>r.id===id))return false;chosen=id;$('#mc-search').value='';options();render();
 panel.scrollIntoView({behavior:'instant',block:'start'});$('#mc-component').focus({preventScroll:true});return true;
}
for(const record of records){const card=document.getElementById(record.id);if(!card)continue;const button=document.createElement('button');button.type='button';button.className='btn mc-launch';button.textContent='Сравнить материал';button.setAttribute('aria-label','Сравнить материал: '+record.title);button.addEventListener('click',()=>open(record.id));card.append(button);}
const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)&&!rendered){render();observer.disconnect();}},{rootMargin:'500px'});observer.observe(panel);
window.GlassCompare={open,snapshot:()=>({id:chosen,state:structuredClone(snapshot),count:records.length,ready:panel.dataset.ready==='true'}),files:()=>frames.map(e=>({state:structuredClone(e.state),standalone:e.parts.standalone}))};
addEventListener('pagehide',()=>{generation++;pendingLoads.forEach(cancel=>cancel());pendingFocus.forEach(clearTimeout);pendingFocus.clear();events.abort();observer.disconnect();urls.forEach(URL.revokeObjectURL);urls.clear();frames.forEach(e=>e.frame.remove());frames=[];rendered=false;});
addEventListener('pageshow',e=>{if(e.persisted)render();});
