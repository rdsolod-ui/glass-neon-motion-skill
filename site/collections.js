import {parseCollection} from './collection-format.js';
import './code-export.js';

const KEY='luma-collections-v1', inventory=window.GlassExport.inventory(),valid=new Set(inventory.map(r=>r.id));
const clean=ids=>Array.isArray(ids)?[...new Set(ids.filter(id=>typeof id==='string'&&valid.has(id)))]:[];
let data={version:1,favorites:[],selected:[],collections:[]},storageError=false;
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved?.version===1){data.favorites=clean(saved.favorites);data.selected=clean(saved.selected);data.collections=Array.isArray(saved.collections)?saved.collections.filter(c=>typeof c.id==='string'&&typeof c.name==='string').slice(0,100).map(c=>({id:c.id,name:c.name.slice(0,80),ids:clean(c.ids),theme:c.theme})):[];}}catch{storageError=true;}
const panel=document.createElement('section');panel.id='collection-studio';panel.className='section wrap cl-studio';
panel.innerHTML='<div class="section-head"><div><p class="eyebrow">Ваш рабочий набор</p><h2>Собрать вместе.</h2></div><p>Избранное и подборки сохраняются в этом браузере. Общий HTML использует текущую тему для всех выбранных примеров и работает без сети.</p></div><div class="cl-controls"><label>Название подборки<input id="cl-name" maxlength="80" placeholder="Например, личный кабинет"></label><button class="btn" data-cl="save">Сохранить как новую</button><label>Сохранённые подборки<select id="cl-saved"><option value="">Выберите подборку</option></select></label><button class="btn" data-cl="load">Открыть</button><button class="btn" data-cl="update">Обновить выбранную</button><button class="btn" data-cl="delete">Удалить выбранную</button></div><div class="cl-controls"><button class="btn" data-cl="favorites">Выбрать всё избранное</button><button class="btn" data-cl="clear">Снять выбор</button><button class="btn primary" data-cl="export">Скачать общий HTML</button></div><div class="cl-controls"><button class="btn" data-cl="json">Скачать JSON с темой</button><label>Импорт подборки JSON<input id="cl-import" type="file" accept=".json,application/json"></label><button class="btn" data-cl="duplicate">Дублировать выбранную</button></div><p>Порядок экспорта: перетащите строку или используйте кнопки ↑ и ↓.</p><p id="cl-status" role="status" aria-live="polite"></p><div class="cl-lists"><div><h3>Выбрано <span id="cl-count">0</span></h3><ul id="cl-selected"></ul></div><div><h3>Избранное</h3><ul id="cl-favorites"></ul></div></div>';
document.querySelector('#typography-atlas').before(panel);
const $=id=>panel.querySelector('#cl-'+id),say=text=>{$('status').textContent=text;};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));storageError=false;return true;}catch{storageError=true;say('Хранилище недоступно. Выбор работает до закрытия страницы; скачайте общий HTML.');return false;}};
const buttons=new Map();
const list=(target,ids,property)=>{target.replaceChildren();if(!ids.length){const li=document.createElement('li');li.textContent='Пока пусто.';target.append(li);return;}for(const id of ids){const record=inventory.find(r=>r.id===id),li=document.createElement('li'),link=document.createElement('a'),remove=document.createElement('button');link.draggable=false;link.href='#'+encodeURIComponent(id);link.textContent=record.title;remove.type='button';remove.className='btn';remove.textContent='Убрать';remove.setAttribute('aria-label','Убрать: '+record.title);remove.onclick=()=>toggle(property,id);li.append(link,remove);if(property==='selected'){
 li.draggable=true;li.dataset.component=id;
 li.addEventListener('dragstart',e=>{e.dataTransfer.setData('text/plain',id);e.dataTransfer.effectAllowed='move';});
 li.addEventListener('dragover',e=>e.preventDefault());li.addEventListener('drop',e=>{e.preventDefault();move(e.dataTransfer.getData('text/plain'),ids.indexOf(id));});
 for(const [step,label] of [[-1,'↑'],[1,'↓']]){const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=label;b.dataset.move=step;b.setAttribute('aria-label',(step<0?'Выше: ':'Ниже: ')+record.title);b.disabled=ids.indexOf(id)+step<0||ids.indexOf(id)+step>=ids.length;b.onclick=()=>move(id,ids.indexOf(id)+step,step);li.append(b);}
 }target.append(li);}};
function move(id,to,step){const from=data.selected.indexOf(id);if(from<0||to<0||to>=data.selected.length)return;data.selected.splice(from,1);data.selected.splice(to,0,id);const persisted=save();render();const row=[...$('selected').children].find(e=>e.dataset.component===id);(row?.querySelector(`[data-move="${step}"]:not(:disabled)`)||row?.querySelector('a'))?.focus();if(persisted)say('Порядок сохранён. Позиция '+(to+1)+'.');}
function render(){
 for(const [id,pair] of buttons){pair.favorite.setAttribute('aria-pressed',String(data.favorites.includes(id)));pair.select.setAttribute('aria-pressed',String(data.selected.includes(id)));pair.favorite.textContent=data.favorites.includes(id)?'В избранном':'В избранное';pair.select.textContent=data.selected.includes(id)?'Выбрано':'В подборку';}
 $('count').textContent=data.selected.length;list($('selected'),data.selected,'selected');list($('favorites'),data.favorites,'favorites');
 const selected=$('saved').value;$('saved').replaceChildren(new Option('Выберите подборку',''),...data.collections.map(c=>new Option(c.name+' · '+c.ids.length,c.id)));if(data.collections.some(c=>c.id===selected))$('saved').value=selected;
 panel.querySelector('[data-cl=export]').disabled=!data.selected.length;
}
function toggle(property,id){data[property]=data[property].includes(id)?data[property].filter(x=>x!==id):[...data[property],id];save();render();}
for(const record of inventory){const card=document.getElementById(record.id);if(!card)continue;const group=document.createElement('div');group.className='cl-card-actions';const pair={};for(const [key,property,label] of [['favorite','favorites','В избранное'],['select','selected','В подборку']]){const button=document.createElement('button');button.type='button';button.className='btn';button.textContent=label;button.setAttribute('aria-label',label+': '+record.title);button.addEventListener('click',()=>toggle(property,record.id));pair[key]=button;group.append(button);}buttons.set(record.id,pair);card.append(group);}
const urls=new Set();
panel.addEventListener('click',e=>{
 const action=e.target.closest('[data-cl]')?.dataset.cl;if(!action)return;
 const collection=data.collections.find(c=>c.id===$('saved').value),name=$('name').value.trim();
 if(action==='duplicate'){if(!collection){say('Выберите подборку.');return;}if(data.collections.length>=100){say('Достигнут предел: 100 подборок.');return;}const copy={...structuredClone(collection),id:crypto.randomUUID(),name:(collection.name+' — копия').slice(0,80)};data.collections.push(copy);save();render();$('saved').value=copy.id;return;}
 if(action==='json'){if(!data.selected.length){say('Выберите компоненты.');return;}downloadJSON({schema:'luma-collection',version:1,name:name||'Моя подборка',ids:[...data.selected],theme:GlassTheme.getSnapshot()});return;}
 if(action==='clear')data.selected=[];
 if(action==='favorites')data.selected=[...data.favorites];
 if(['save','update'].includes(action)){
  if(!name){say('Введите название подборки.');$('name').focus();return;}
  if(!data.selected.length){say('Добавьте хотя бы один компонент.');return;}
  if(action==='update'&&!collection){say('Выберите сохранённую подборку для обновления.');return;}
  if(action==='save'){if(data.collections.length>=100){say('Достигнут предел: 100 подборок.');return;}const entry={id:crypto.randomUUID(),name,ids:[...data.selected],theme:GlassTheme.getSnapshot()};data.collections.push(entry);render();$('saved').value=entry.id;}
  else Object.assign(collection,{name,ids:[...data.selected],theme:GlassTheme.getSnapshot()});
 }
 if(['load','delete'].includes(action)){if(!collection){say('Сначала выберите сохранённую подборку.');return;}if(action==='load'){if(collection.theme&&!GlassTheme.setSnapshot(collection.theme)){say('Тема подборки некорректна.');return;}data.selected=[...collection.ids];$('name').value=collection.name;}else data.collections=data.collections.filter(c=>c!==collection);}
 if(action==='export'){
  try{const result=window.GlassExport.buildCollection(data.selected,name||'Моя подборка'),url=URL.createObjectURL(new Blob([result.standalone],{type:'text/html;charset=utf-8'}));urls.add(url);const a=document.createElement('a');a.href=url;a.download='luma-collection.html';a.click();setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},2000);say('Общий HTML подготовлен: '+result.count+' компонентов. Текущая тема зафиксирована.');}catch(error){say(error.message);}return;
 }
 const persisted=save();render();if(persisted)say(action==='delete'?'Подборка удалена из этого браузера.':'Готово. Выбрано компонентов: '+data.selected.length+'.');
});
addEventListener('pagehide',()=>{urls.forEach(URL.revokeObjectURL);urls.clear();});
render();if(storageError)say('Сохранённые данные недоступны. Можно собрать и скачать новую подборку.');
window.GlassCollections={snapshot:()=>structuredClone(data)};

function downloadJSON(value){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));urls.add(url);const a=document.createElement('a');a.href=url;a.download='luma-collection.json';a.click();setTimeout(()=>{URL.revokeObjectURL(url);urls.delete(url);},2000);say('JSON с порядком компонентов и темой подготовлен.');}
$('import').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{
 if(file.size>1000000)throw new Error('Файл превышает 1 МБ.');const parsed=parseCollection(await file.text(),valid);
 if(data.collections.length>=100)throw new Error('Достигнут предел: 100 подборок.');
 if(!GlassTheme.setSnapshot(parsed.theme))throw new Error('Не удалось применить тему.');
 const entry={id:crypto.randomUUID(),name:parsed.name,ids:parsed.ids,theme:parsed.theme};data.collections.push(entry);data.selected=[...entry.ids];$('name').value=entry.name;const persisted=save();render();$('saved').value=entry.id;if(persisted)say('Подборка импортирована. Пропущено неизвестных компонентов: '+parsed.skipped+'.');
 }catch(error){say('Импорт отменён: '+error.message);}finally{e.target.value='';}});
