export function initCompositions(root,api){
 const events=new AbortController(),signal=events.signal,$=id=>root.querySelector(`#uip-${id}`),all=sel=>[...root.querySelectorAll(sel)];
 let page=Number(root.querySelector('[data-uip-action=page][aria-current=page]')?.dataset.page||1),gallery=Number($('gallery-frame')?.querySelector('.uip-art')?.className.match(/uip-art-(\d)/)?.[1]||0),lane=Number($('task')?.closest('[data-lane]')?.dataset.lane||0),previewURL=null,month=Number($('calendar')?.dataset.month??9),year=Number($('calendar')?.dataset.year??2026),selectedDate=$('calendar')?.dataset.selectedDate||null;
 const cart={film:0,glass:0},prices={film:120,glass:240},names={film:'Плёнка',glass:'Стекло'};
 all('[data-uip-cart-key]').forEach(row=>{if(Object.hasOwn(cart,row.dataset.uipCartKey))cart[row.dataset.uipCartKey]=Number(row.querySelector('.uip-cart-count')?.textContent)||0;});
 const report=(id,text)=>{const el=$(id);if(el){el.textContent=text;api.animate(el,[{opacity:.5,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:200});}};
 const listen=(el,type,fn)=>el?.addEventListener(type,fn,{signal});
 all('[data-uip-action],[data-uip-ready]').forEach(el=>el.disabled=false);
 const pulse=el=>api.animate(el,[{opacity:.6},{opacity:1}],{duration:180});
 const renderCart=()=>{
  const box=$('cart-lines');if(!box)return;box.replaceChildren();let total=0;
  for(const key of Object.keys(cart)){if(!cart[key])continue;total+=cart[key]*prices[key];const row=document.createElement('div');row.className='uip-cart-line';row.dataset.uipCartKey=key;const title=document.createElement('strong');title.textContent=`${names[key]} · ${prices[key]} ₽`;
   const count=document.createElement('span');count.textContent=String(cart[key]);count.className='uip-cart-count';
   const controls=document.createElement('div');controls.className='ui-row';
   for(const [label,action,aria] of [['−','cart-less',`Уменьшить количество: ${names[key]}`],['+','cart-more',`Увеличить количество: ${names[key]}`],['Удалить','cart-remove',`Удалить: ${names[key]}`]]){const b=document.createElement('button');b.type='button';b.className='ui-btn';b.dataset.uipAction=action;b.dataset.product=key;b.textContent=label;b.setAttribute('aria-label',aria);controls.append(b);}
   row.append(title,count,controls);box.append(row);
  }
  if(!total){const p=document.createElement('p');p.textContent='Корзина пуста';box.append(p);}
  report('cart-total',`Итого: ${total.toLocaleString('ru-RU')} ₽`);
 };
 const moveTask=delta=>{if(!$('task'))return;lane=Math.max(0,Math.min(2,lane+delta));root.querySelector(`[data-lane="${lane}"]`).append($('task'));report('kanban-state',`Задача в колонке «${['План','В работе','Готово'][lane]}»`);all('[data-uip-action^="kanban-"]').forEach(b=>b.disabled=b.dataset.uipAction==='kanban-prev'?lane===0:lane===2);pulse($('task'));};
 const renderCalendar=(focusDay=null)=>{if(!$('calendar'))return;
  const title=new Intl.DateTimeFormat('ru-RU',{month:'long',year:'numeric'}).format(new Date(year,month,1));$('month-title').textContent=title;
  const grid=$('calendar');grid.dataset.month=month;grid.dataset.year=year;grid.replaceChildren();grid.setAttribute('aria-label',title);
  const offset=(new Date(year,month,1).getDay()+6)%7,count=new Date(year,month+1,0).getDate();
  for(let i=0;i<offset;i++){const spacer=document.createElement('span');spacer.setAttribute('aria-hidden','true');grid.append(spacer);}
  for(let day=1;day<=count;day++){const b=document.createElement('button');b.type='button';b.className='ui-btn';b.dataset.uipAction='calendar-date';b.dataset.day=day;b.textContent=day;b.setAttribute('aria-label',new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric'}).format(new Date(year,month,day)));b.setAttribute('aria-pressed',String(selectedDate===`${year}-${month}-${day}`));b.tabIndex=day===(focusDay||1)?0:-1;grid.append(b);}
  if(focusDay)grid.querySelector(`[data-day="${Math.min(focusDay,count)}"]`)?.focus();
 };
 const renderEditor=()=>{if(!$('editor'))return;
  const text=$('editor').value,box=$('editor-preview');box.replaceChildren();
  for(const line of text.split('\n')){const heading=line.startsWith('# '),el=document.createElement(heading?'h5':'p'),content=heading?line.slice(2):line;
   for(const [i,part] of content.split('**').entries()){if(i%2===1){const strong=document.createElement('strong');strong.textContent=part;el.append(strong);}else el.append(document.createTextNode(part));}box.append(el);}
  report('editor-state',`${text.length} / 1000 символов · локальный preview`);
 };
 const closeBurger=(restore=false)=>{const b=$('burger');if(!b)return;b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','Открыть меню');$('burger-panel').hidden=true;if(restore)b.focus();};
 const syncTheme=()=>{const theme=document.documentElement.dataset.theme;all('[data-uip-action="theme"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===theme)));if($('theme-state'))$('theme-state').textContent=`${theme==='light'?'Светлая':'Тёмная'} тема включена`;};
 const themeObserver=new MutationObserver(syncTheme);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});syncTheme();
 const clearUpload=()=>{if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;const img=$('upload-preview');img.hidden=true;img.removeAttribute('src');$('upload').value='';report('upload-state','Файл не выбран. Ничего не загружается на сервер.');};
 const galleryArt=i=>`<div class="uip-art uip-art-${i}" role="img" aria-label="Авторская абстрактная композиция ${i+1}: цветные сферы за стеклом"><span></span><i></i><b>LUMA / ${String(i+1).padStart(2,'0')}</b></div>`;
 const handlers={
  theme:b=>{const theme=b.dataset.value,toggle=document.querySelector('[data-theme-toggle]');if(document.documentElement.dataset.theme!==theme&&toggle)toggle.click();else if(!toggle){document.documentElement.dataset.theme=theme;try{localStorage.setItem('glass-theme',theme);}catch{}}report('theme-state',`${theme==='light'?'Светлая':'Тёмная'} тема включена`);all('[data-uip-action="theme"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));},
  accent:()=>report('accent-state',`Выбран акцент: ${$('accent').selectedOptions[0].textContent}`),
  'icon-weight':b=>{all('[data-uip-action="icon-weight"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));report('icon-weight-state',`Выбрано: ${b.dataset.value}`);pulse(b);},
  favorite:b=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',on?'Удалить из избранного':'Добавить в избранное');report('favorite-state',on?'Добавлено в избранное':'Не добавлено в избранное');},
  'cart-add':b=>{cart[b.dataset.product]=Math.min(99,cart[b.dataset.product]+1);renderCart();report('favorite-state',`${names[b.dataset.product]} добавлена в локальную корзину`);},
  'cta-palette':()=>report('palette-state','Палитра собрана: cyan / lime / violet. Перейдите к токенам, чтобы изменить акцент.'),
  'banner-close':()=>{$('banner').hidden=true;$('banner-restore').hidden=false;$('banner-restore').focus();report('banner-state','Баннер закрыт');},
  'banner-restore':()=>{$('banner').hidden=false;$('banner-restore').hidden=true;root.querySelector('[data-uip-action="banner-close"]').focus();report('banner-state','Баннер открыт');},
  'save-collection':b=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));report('collection-state',on?'Подборка сохранена в текущей странице':'Подборка не сохранена');},
  burger:b=>{const open=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(open));b.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');$('burger-panel').hidden=!open;if(open)pulse($('burger-panel'));},
  page:b=>{page=Number(b.dataset.page);const list=$('pages');list.replaceChildren();['прозрачная плёнка','матовое стекло','глянцевое стекло'].forEach((name,i)=>{const li=document.createElement('li');li.textContent=`Образец ${(page-1)*3+i+1} — ${name}`;list.append(li);});all('[data-uip-action="page"]').forEach(x=>x===b?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current'));report('page-state',`Страница ${page} из 3`);},
  rail:b=>{const texts={overview:['Обзор','Три локальных раздела без перехода на другой сайт.'],material:['Материалы','Матовая и глянцевая поверхность, прозрачная плёнка и стекло.'],schedule:['План','Сначала композиция, затем состояния, движение и приёмка.']};const [title,body]=texts[b.dataset.value],box=$('rail-content');box.querySelector('h5').textContent=title;box.querySelector('p').textContent=body;all('[data-uip-action="rail"]').forEach(x=>x===b?x.setAttribute('aria-current','page'):x.removeAttribute('aria-current'));pulse(box);},
  'content-favorite':b=>{const on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',String(on));report('content-favorite-state',on?'Карточка добавлена в коллекцию':'Карточка вне коллекции');},
  'gallery-prev':()=>{gallery=(gallery+2)%3;$('gallery-frame').innerHTML=galleryArt(gallery);report('gallery-state',`Композиция ${gallery+1} из 3`);pulse($('gallery-frame'));},
  'gallery-next':()=>{gallery=(gallery+1)%3;$('gallery-frame').innerHTML=galleryArt(gallery);report('gallery-state',`Композиция ${gallery+1} из 3`);pulse($('gallery-frame'));},
  'upload-clear':clearUpload,
  'product-add':()=>{const key=$('product').value;cart[key]=Math.min(99,cart[key]+1);renderCart();report('product-state',`${names[key]} добавлена. Количество: ${cart[key]}.`);},
  'cart-clear':()=>{cart.film=cart.glass=0;renderCart();},
  'cart-more':b=>{cart[b.dataset.product]=Math.min(99,cart[b.dataset.product]+1);const key=b.dataset.product;renderCart();root.querySelector(`[data-uip-action="cart-more"][data-product="${key}"]`)?.focus();},
  'cart-less':b=>{const key=b.dataset.product;cart[key]=Math.max(0,cart[key]-1);renderCart();(root.querySelector(`[data-uip-action="cart-less"][data-product="${key}"]`)||root.querySelector('[data-uip-action="cart-clear"]')).focus();},
  'cart-remove':b=>{cart[b.dataset.product]=0;renderCart();root.querySelector('[data-uip-action="cart-clear"]').focus();},
  'kanban-prev':()=>moveTask(-1),'kanban-next':()=>moveTask(1),
  'calendar-prev':()=>{month--;if(month<0){month=11;year--;}renderCalendar();report('calendar-state',`Показан ${$('month-title').textContent}`);},
  'calendar-next':()=>{month++;if(month>11){month=0;year++;}renderCalendar();report('calendar-state',`Показан ${$('month-title').textContent}`);},
  'calendar-date':b=>{const day=Number(b.dataset.day);selectedDate=`${year}-${month}-${day}`;$('calendar').dataset.selectedDate=selectedDate;all('#uip-calendar button').forEach(x=>{x.setAttribute('aria-pressed',String(x===b));x.tabIndex=x===b?0:-1;});report('calendar-state',`Выбрано: ${b.getAttribute('aria-label')}`);},
  'editor-bold':()=>{const input=$('editor'),start=input.selectionStart,end=input.selectionEnd;if(input.value.length>996)return;const selected=input.value.slice(start,end)||'текст';if(input.value.length+selected.length-(end-start)+4>1000)return;input.setRangeText(`**${selected}**`,start,end,'select');renderEditor();input.focus();},
  'editor-clear':()=>{$('editor').value='';renderEditor();$('editor').focus();}
 };
 listen(root,'click',e=>{const b=e.target.closest('[data-uip-action]');if(b&&!b.disabled&&root.contains(b))handlers[b.dataset.uipAction]?.(b);});
 listen($('accent'),'change',()=>{$('accent-preview').dataset.accent=$('accent').value;report('accent-state',`${$('accent').selectedOptions[0].textContent} выбран`);});
 listen($('density'),'change',()=>{$('density-list').dataset.density=$('density').value;report('density-state',$('density').value==='compact'?'Компактная плотность':'Свободная плотность');});
 listen($('newsletter'),'submit',e=>{e.preventDefault();report('newsletter-state','Формат адреса и согласие проверены. Письмо не отправлено.');});
 listen($('content-filter'),'change',()=>{const selected=$('content-filter').value;let count=0;all('#uip-filter-list li').forEach(el=>{el.hidden=selected!=='all'&&el.dataset.kind!==selected;if(!el.hidden)count++;});report('filter-state',`Показано ${count} материала`);});
 listen($('burger-panel'),'click',e=>{if(e.target.closest('a'))closeBurger();});
 listen(root,'keydown',e=>{if(e.key==='Escape'&&$('burger')?.getAttribute('aria-expanded')==='true'){e.preventDefault();closeBurger(true);}});
 listen($('task'),'keydown',e=>{if(e.altKey&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();moveTask(e.key==='ArrowRight'?1:-1);$('task').focus();}});
 listen($('calendar'),'keydown',e=>{const b=e.target.closest('[data-day]');if(!b)return;const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];if(delta===undefined)return;e.preventDefault();const next=Math.max(1,Math.min(new Date(year,month+1,0).getDate(),Number(b.dataset.day)+delta));all('#uip-calendar button').forEach(x=>x.tabIndex=Number(x.dataset.day)===next?0:-1);$('calendar').querySelector(`[data-day="${next}"]`).focus();});
 listen($('editor'),'input',renderEditor);
 listen($('upload'),'change',()=>{const file=$('upload').files?.[0];if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;$('upload-preview').hidden=true;$('upload-preview').removeAttribute('src');if(!file){report('upload-state','Файл не выбран');return;}if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024){report('upload-state','Выберите PNG, JPEG или WebP не больше 5 МБ.');$('upload').value='';return;}previewURL=URL.createObjectURL(file);$('upload-preview').src=previewURL;$('upload-preview').hidden=false;report('upload-state',`${file.name} · ${Math.round(file.size/1024)} КБ · только локальный preview`);});
 listen($('upload-preview'),'error',()=>{if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;$('upload-preview').hidden=true;$('upload-preview').removeAttribute('src');report('upload-state','Изображение не удалось прочитать. Выберите другой файл.');});
 moveTask(0);renderCalendar();renderEditor();
 return ()=>{events.abort();themeObserver.disconnect();if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;if($('upload-preview')){$('upload-preview').removeAttribute('src');$('upload-preview').hidden=true;$('upload').value='';$('upload-state').textContent='Файл не выбран. Ничего не загружается на сервер.';}closeBurger();};
}
