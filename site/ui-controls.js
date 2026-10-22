// Native-first controls. Everything stays local to its specimen and this page.
const mounted = new WeakMap();
export function initControls(root, api) {
  mounted.get(root)?.();
  const controller = new AbortController(), timers = new Set(), animations = new Set(), restorers = [];
  const on = (el, event, fn, options = {}) => el?.addEventListener(event, fn, {...options, signal: controller.signal});
  const later = (fn, delay) => { const id = setTimeout(() => { timers.delete(id); fn(); }, delay); timers.add(id); return id; };
  const cancel = id => { clearTimeout(id); timers.delete(id); };
  const motion = (el, frames, event, duration = 180) => {
    if (!el || event?.detail === 0 || api.reduced?.()) return;
    const anim = api.animate(el, frames, {duration});
    if (anim?.cancel) { animations.add(anim); anim.finished?.catch(() => {}).finally(() => animations.delete(anim)); }
  };
  const reveal = (el, event) => motion(el, [{opacity: .55, transform: 'translateY(5px)'}, {opacity: 1, transform: 'translateY(0)'}], event);
  const announce = text => api.announce?.(text);
  const norm = value => value.trim().toLocaleLowerCase('ru');
  root.querySelectorAll('[data-uic-enhance]').forEach(el => el.disabled = false);
  root.querySelectorAll('.uic-popover').forEach(el=>restorers.push(()=>{if(el.matches(':popover-open'))el.hidePopover();}));
  const scenes = [...root.querySelectorAll('[data-uic]')];
  for (const scene of scenes) {
    const q = selector => scene.querySelector(selector), all = selector => [...scene.querySelectorAll(selector)];
    const action = name => q(`[data-uic-action="${name}"]`);
    const say = text => { const out=q('[data-uic-result]'); if(out) out.textContent=text; };
    const click = (name, fn) => on(action(name), 'click', fn);
    const openDialog = (dialog, trigger, event) => { dialog.returnValue=''; dialog.showModal(); reveal(dialog, event); dialog.dataset.uicTrigger=trigger?.dataset.uicAction||'open'; };
    const dialog = q('dialog');
    if (dialog) {
      on(dialog, 'close', () => action(dialog.dataset.uicTrigger || 'open')?.focus({preventScroll:true}));
      on(dialog, 'click', e => { if (e.target !== dialog) return; const b=dialog.getBoundingClientRect(); if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom) dialog.close('cancel'); });
      restorers.push(()=>{if(dialog.open) dialog.close('cancel');});
    }
    switch (scene.dataset.uic) {
      case 'action-buttons': {
        let count=1; const stack=q('[data-uic-layers]');
        all('[data-uic-action="add"]').forEach(btn=>on(btn,'click',e=>{if(count>=5){say('Предел образца — 5 слоёв. Сбросьте композицию.');return;}const item=document.createElement('span');item.textContent=`Frost / ${String(++count).padStart(2,'0')}`;stack.append(item);reveal(item,e);say(`Слоёв: ${count} из 5.`);}));
        click('reset',()=>{count=1;stack.replaceChildren(Object.assign(document.createElement('span'),{textContent:'Frost / 01'}));say('Сброшено: 1 слой.');}); break;
      }
      case 'action-save': {
        let job; const save=action('save'), stop=action('cancel'); stop.disabled=true;
        const idle=()=>{save.disabled=false;save.removeAttribute('aria-busy');save.textContent='Собрать локально';stop.disabled=true;};
        click('save',()=>{cancel(job);save.disabled=true;save.setAttribute('aria-busy','true');save.textContent='Собираем…';stop.disabled=false;say('Идёт учебная сборка…');const fail=q('[data-uic-fail]').checked;job=later(()=>{idle();say(fail?'Учебная ошибка. Измените настройку и повторите.':'Готово: локальный материал собран. Ничего не отправлено.');reveal(q('[data-uic-result]'));},1200);});
        click('cancel',()=>{cancel(job);idle();say('Сборка отменена.');});restorers.push(idle);break;
      }
      case 'action-split': {
        let format='Карточка', count=0;all('[data-uic-action="format"]').forEach(btn=>on(btn,'click',()=>{format=btn.dataset.value;q('details').open=false;action('create').textContent=`Создать: ${format.toLowerCase()}`;q('[data-uic-created]').textContent=`Формат: ${format}`;say(`Выбран формат «${format}».`);action('create').focus();}));
        click('create',e=>{q('[data-uic-created]').textContent=`${format} / ${++count} — создано локально`;reveal(q('[data-uic-created]'),e);say(`Создан элемент ${count}.`);});break;
      }
      case 'switches': {
        const input=q('[data-uic-light]'), thumb=q('.uic-track i'), card=q('[data-uic-lit]');
        on(input,'change',e=>{card.dataset.uicLit=String(input.checked);say(input.checked?'Подсветка включена.':'Подсветка выключена.');motion(thumb,[{transform:`translateX(${input.checked?0:22}px)`},{transform:`translateX(${input.checked?22:0}px)`}],e);});break;
      }
      case 'selection-bulk': {
        const parent=q('[data-uic-all]'), children=all('[data-uic-child]');const update=()=>{const n=children.filter(el=>el.checked).length;parent.checked=n===children.length;parent.indeterminate=n>0&&n<children.length;say(`Выбрано ${n} из ${children.length}: ${children.filter(el=>el.checked).map(el=>el.value).join(', ')||'ничего'}.`);};
        on(parent,'change',()=>{children.forEach(el=>el.checked=parent.checked);update();});children.forEach(el=>on(el,'change',update));update();break;
      }
      case 'selection-choice': on(scene,'change',()=>say(`${q('[name="uic-material-choice"]:checked').value} · оценка ${q('[name="uic-rating"]:checked').value} из 5.`));break;
      case 'field-anatomy': {
        const update=()=>{const width=q('#uic-width');say(`${q('#uic-project-name').value.trim()||'Проект ещё не назван'} · ${width.validity.valid&&width.value?`${width.value} px`:'ширина должна быть 240–1920 px с шагом 10'}.`);};on(scene,'input',update);break;
      }
      case 'textarea-counter': {
        const field=q('textarea');const update=()=>{q('[data-uic-count]').textContent=[...field.value].length;q('[data-uic-preview]').textContent=field.value||'Здесь появится ваше описание.';field.style.height='auto';field.style.height=`${Math.min(field.scrollHeight,230)}px`;};on(field,'input',update);
        click('sample',()=>{field.value='Прозрачная плёнка мягко рассеивает голубую форму. Текст остаётся на спокойной читаемой поверхности.';update();});click('clear',()=>{field.value='';update();field.focus();});break;
      }
      case 'password-otp': {
        const pass=q('#uic-password'), otp=q('#uic-otp');click('reveal',()=>{const visible=pass.type==='password';pass.type=visible?'text':'password';action('reveal').setAttribute('aria-pressed',String(visible));action('reveal').textContent=visible?'Скрыть':'Показать';});
        on(otp,'input',()=>{otp.value=otp.value.replace(/[^0-9]/g,'').slice(0,6);otp.removeAttribute('aria-invalid');});click('check',()=>{const ok=/^[0-9]{6}$/.test(otp.value);otp.setAttribute('aria-invalid',String(!ok));say(ok?'Формат корректен: 6 цифр. Это не проверка подлинности.':'Введите ровно 6 цифр.');if(!ok)otp.focus();});break;
      }
      case 'native-select': on(scene,'change',()=>{const chosen=all('input:checked').map(el=>el.value);say(`${q('select').value} · ${chosen.join(', ')||'без дополнительных слоёв'}.`);});break;
      case 'combobox': {
        const input=q('[role="combobox"]'), list=q('[role="listbox"]');const items=[['Frost','матовый'],['Pearl','жемчужный'],['Smoke','дымчатый'],['Prism','призма'],['Obsidian','обсидиан']];let filtered=[],index=-1;
        const close=()=>{list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');index=-1;};
        const active=()=>{all('[role="option"]').forEach((el,i)=>el.setAttribute('aria-selected',String(i===index)));if(index>=0){input.setAttribute('aria-activedescendant',`uic-combo-option-${index}`);q(`#uic-combo-option-${index}`)?.scrollIntoView({block:'nearest'});}else input.removeAttribute('aria-activedescendant');};
        const choose=i=>{if(!filtered[i])return;input.value=filtered[i][0];say(`Выбран ${filtered[i][0]}.`);close();input.focus();};
        const show=()=>{filtered=items.filter(v=>norm(v.join(' ')).includes(norm(input.value)));index=-1;list.replaceChildren();for(const [i,v]of filtered.entries()){const li=document.createElement('li');li.id=`uic-combo-option-${i}`;li.setAttribute('role','option');li.setAttribute('aria-selected','false');li.dataset.index=i;li.textContent=`${v[0]} · ${v[1]}`;list.append(li);}list.hidden=!filtered.length;input.setAttribute('aria-expanded',String(Boolean(filtered.length)));input.removeAttribute('aria-activedescendant');say(filtered.length?`Вариантов: ${filtered.length}.`:'Совпадений нет. Попробуйте другой запрос.');};
        on(input,'input',show);on(input,'focus',show);on(list,'pointerdown',e=>e.preventDefault());on(list,'click',e=>{const item=e.target.closest('[role="option"]');if(item)choose(Number(item.dataset.index));});
        on(input,'keydown',e=>{if(e.key==='Escape'){close();return;}if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(list.hidden)show();if(!filtered.length)return;index=index<0?(e.key==='ArrowDown'?0:filtered.length-1):(index+(e.key==='ArrowDown'?1:-1)+filtered.length)%filtered.length;active();}else if(e.key==='Enter'&&!list.hidden&&index>=0){e.preventDefault();choose(index);}else if(e.key==='Tab')close();});on(scene,'focusout',e=>{if(!scene.contains(e.relatedTarget))close();});on(document,'pointerdown',e=>{if(!scene.contains(e.target))close();});restorers.push(close);break;
      }
      case 'range-pickers': {
        const min=q('[data-uic-min]'),max=q('[data-uic-max]'),range=q('[type="range"]');const update=e=>{let lo=Number(min.value),hi=Number(max.value);if(!Number.isFinite(lo)||!Number.isFinite(hi)||min.value===''||max.value===''){say('Введите обе границы диапазона.');return;}lo=Math.max(0,Math.min(90,lo));hi=Math.max(10,Math.min(100,hi));if(lo>=hi){if(e?.target===min)hi=Math.min(100,lo+10);else lo=Math.max(0,hi-10);}min.value=lo;max.value=hi;range.min=lo;range.max=hi;range.value=Math.max(lo,Math.min(hi,Number(range.value)));q('[data-uic-level-output]').value=`${range.value}%`;q('[data-uic-preview]').style.setProperty('--uic-accent',q('[data-uic-color]').value);q('[data-uic-preview] span').textContent=`Диапазон ${lo}–${hi} · ${range.value}%`;say(`Допустимое значение: ${lo}–${hi}. Дата: ${q('[data-uic-date]').value||'не выбрана'}.`);};on(scene,'input',update);break;
      }
      case 'tooltip': {
        const host=q('.uic-tooltip-host'),tip=q('[role="tooltip"]'),trigger=action('tooltip');let timer,dismissed=false;const hide=()=>{cancel(timer);tip.hidden=true;};const show=(e,delay=0)=>{cancel(timer);if(dismissed)return;timer=later(()=>{tip.hidden=false;reveal(tip,e);},delay);};
        on(host,'pointerenter',e=>{if(e.pointerType==='mouse'){dismissed=false;show(e,250);}});on(host,'pointerleave',()=>{if(document.activeElement!==trigger){hide();dismissed=false;}});on(trigger,'focus',e=>{dismissed=false;show(e);});on(trigger,'blur',()=>{hide();dismissed=false;});on(trigger,'click',e=>{dismissed=false;if(tip.hidden)show(e);else if(e.detail>0)hide();});on(host,'keydown',e=>{if(e.key==='Escape'){dismissed=true;hide();e.stopPropagation();}});restorers.push(hide);break;
      }
      case 'rich-popover': on(q('[data-uic-help-always]'),'change',e=>{q('#uic-inline-help').hidden=!e.target.checked;q('#uic-help-field').setAttribute('aria-describedby',e.target.checked?'uic-inline-help':'');say(`Inline-помощь ${e.target.checked?'включена':'выключена'}.`);});break;
      case 'coachmark': {
        let step=-1;const copy=[['Выберите материал','Frost рассеивает фон; Smoke защищает контраст на насыщенной подложке.'],['Настройте акцент','Цвет помогает найти главное действие. Подпись остаётся читаемой.'],['Проверьте результат','Посмотрите светлую и тёмную темы, клавиатуру и режим без прозрачности.']];const update=e=>{all('[data-uic-coach-target]').forEach((el,i)=>el.dataset.active=String(i===step));q('[data-uic-coach-title]').textContent=step<0?'Обзор завершён':copy[step][0];q('[data-uic-coach-copy]').textContent=step<0?'Можно начать заново в любой момент.':copy[step][1];action('next').disabled=step<0;say(step<0?'Обзор не активен.':`Шаг ${step+1} из 3.`);reveal(q('[data-uic-coach]'),e);};click('start',e=>{step=0;update(e);});click('next',e=>{step=step===2?-1:step+1;update(e);});click('finish',e=>{step=-1;update(e);});action('next').disabled=true;break;
      }
      case 'faceted-search': {
        const data=[{name:'Frost',theme:'light'},{name:'Pearl',theme:'light'},{name:'Prism',theme:'light'},{name:'Smoke',theme:'dark'}];const update=()=>{const term=norm(q('input').value),theme=q('[data-uic-theme]').value;const found=data.filter(v=>norm(v.name).includes(term)&&(theme==='all'||v.theme===theme)).sort((a,b)=>a.name.localeCompare(b.name)*(q('[data-uic-sort]').value==='asc'?1:-1));const list=q('[data-uic-results]');list.replaceChildren();found.forEach(v=>{const li=document.createElement('li');li.textContent=`${v.name} · ${v.theme==='light'?'светлый':'тёмный'}`;list.append(li);});say(found.length?`${found.length} материала. Запрос и тема применены вместе.`:'Ничего не найдено. Измените запрос или сбросьте фильтры.');};on(scene,'input',update);on(scene,'change',update);click('reset',()=>{q('input').value='';q('[data-uic-theme]').value='all';q('[data-uic-sort]').value='asc';update();});break;
      }
      case 'command-palette': {
        const input=q('input');click('open',e=>{input.value='';all('.uic-command-list li').forEach(el=>el.hidden=false);q('[data-uic-command-empty]').hidden=true;openDialog(dialog,action('open'),e);});click('close',()=>dialog.close('cancel'));
        on(input,'input',()=>{const term=norm(input.value);all('.uic-command-list li').forEach(el=>el.hidden=!norm(el.textContent).includes(term));q('[data-uic-command-empty]').hidden=all('.uic-command-list li:not([hidden])').length>0;});
        let layers=1;const preview=q('[data-uic-command-preview]');
        all('[data-uic-action="command"]').forEach(btn=>on(btn,'click',()=>{if(btn.dataset.value==='create')layers=Math.min(5,layers+1);if(btn.dataset.value==='reset'){layers=1;preview.dataset.contrast='normal';}if(btn.dataset.value==='contrast')preview.dataset.contrast=preview.dataset.contrast==='strong'?'normal':'strong';preview.textContent=`Слоёв: ${layers} · ${preview.dataset.contrast==='strong'?'плотная подложка':'обычная подложка'}`;say(`Выполнена локальная команда: ${btn.textContent}.`);dialog.close('command');}));on(dialog,'keydown',e=>{const buttons=all('.uic-command-list li:not([hidden]) button');if(!buttons.length)return;const idx=buttons.indexOf(document.activeElement);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();buttons[idx<0?(e.key==='ArrowDown'?0:buttons.length-1):(idx+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length].focus();}else if(e.key==='Enter'&&e.target===input){e.preventDefault();buttons[0].click();}});break;
      }
      case 'saved-view': {
        const boxes=all('input');let saved=['2D','3D'];const update=()=>{const selected=boxes.filter(el=>el.checked).map(el=>el.value);all('[data-uic-view-item]').forEach(el=>el.hidden=!selected.includes(el.dataset.uicViewItem));say(`Выбрано: ${selected.join(', ')||'ничего'}. Сохранено: ${saved.join(', ')||'ничего'}.`);};on(scene,'change',update);click('save',()=>{saved=boxes.filter(el=>el.checked).map(el=>el.value);update();});click('restore',()=>{boxes.forEach(el=>el.checked=saved.includes(el.value));update();});click('all',()=>{boxes.forEach(el=>el.checked=true);update();});break;
      }
      case 'tabs': {
        const tabs=all('[data-uic-action="tab"]'),panels=all('.uic-tab-panel');q('[data-uic-tablist]').setAttribute('role','tablist');const choose=(index,e)=>{tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;panels[i].hidden=i!==index;});reveal(panels[index],e);};tabs.forEach((tab,i)=>{tab.setAttribute('role','tab');panels[i].setAttribute('role','tabpanel');panels[i].tabIndex=0;on(tab,'click',e=>choose(i,e));on(tab,'keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();}});});choose(0,{detail:0});restorers.push(()=>{panels.forEach(el=>el.hidden=false);});break;
      }
      case 'disclosure-tree': on(q('[data-uic-edge]'),'change',e=>{q('[data-uic-edge-preview]').classList.toggle('uic-edge-off',!e.target.checked);say(`Кромка ${e.target.checked?'включена':'выключена'}.`);});break;
      case 'master-detail': {
        const text={Frost:'Мягкое рассеивание для фоновых панелей.',Smoke:'Плотная дымчатая плоскость для насыщенного заднего плана.',Prism:'Локальный цветовой акцент для главного объекта.'};all('[data-uic-action="select"]').forEach(btn=>on(btn,'click',e=>{all('[data-uic-action="select"]').forEach(el=>el.setAttribute('aria-pressed',String(el===btn)));q('[data-uic-detail-title]').textContent=btn.dataset.value;q('[data-uic-detail-copy]').textContent=text[btn.dataset.value];say(`Выбран ${btn.dataset.value}.`);reveal(q('.uic-master-detail'),e);}));on(q('input'),'input',e=>{q('.uic-master').style.setProperty('--uic-master-width',`${e.target.value}%`);say(`Ширина списка: ${e.target.value}%. На мобильном панели остаются вертикальными.`);});break;
      }
      case 'edit-dialog': {
        const field=q('input'), preview=q('[data-uic-name]');click('open',e=>{field.value=preview.textContent;openDialog(dialog,action('open'),e);});on(dialog,'close',()=>{if(dialog.returnValue==='save'){const value=field.value.trim();if(value){preview.textContent=value;say(`Применено название «${value}».`);}else say('Пустое название не применено.');}else say('Изменения отменены.');});break;
      }
      case 'confirm-dialog': {
        click('open',e=>openDialog(dialog,action('open'),e));on(dialog,'close',()=>{if(dialog.returnValue==='delete'){q('[data-uic-record]').hidden=true;action('open').disabled=true;say('Учебный слой удалён. Доступно восстановление.');action('restore').focus();}else say('Слой оставлен.');});click('restore',()=>{q('[data-uic-record]').hidden=false;action('open').disabled=false;say('Слой восстановлен.');});break;
      }
      case 'bottom-sheet': {
        let chosen='Frost';click('open',e=>{all('input').forEach(el=>el.checked=el.value===chosen);openDialog(dialog,action('open'),e);});on(dialog,'close',()=>{if(dialog.returnValue==='apply'){chosen=q('input:checked').value;q('[data-uic-sheet-preview]').textContent=chosen;q('[data-uic-sheet-preview]').dataset.material=chosen;say(`Применён ${chosen}.`);}else say(`Выбор не изменён: ${chosen}.`);});break;
      }
      case 'toast-undo': {
        click('remove',e=>{q('[data-uic-record]').hidden=true;q('[data-uic-toast]').hidden=false;action('remove').disabled=true;say('Образец убран из локальной коллекции. Доступна отмена.');reveal(q('[data-uic-toast]'),e);action('undo').focus();});click('undo',()=>{q('[data-uic-record]').hidden=false;q('[data-uic-toast]').hidden=true;action('remove').disabled=false;action('remove').focus();say('Образец возвращён в коллекцию.');});break;
      }
      case 'offline-retry': {
        let job;click('retry',()=>{cancel(job);action('retry').disabled=true;q('[data-uic-alert-title]').textContent='Проверка…';q('[data-uic-alert-copy]').textContent='Выполняется учебный таймер, не сетевой запрос.';say('Локальный retry запущен.');job=later(()=>{action('retry').disabled=false;q('[data-uic-alert-title]').textContent='Учебное соединение восстановлено';q('[data-uic-alert-copy]').textContent='Состояние Ready. Фактическая сеть не проверялась.';say('Симуляция завершена.');},800);});click('offline',()=>{cancel(job);action('retry').disabled=false;q('[data-uic-alert-title]').textContent='Демонстрационный offline';q('[data-uic-alert-copy]').textContent='Последняя локальная копия доступна. Можно повторить.';say('Учебный offline включён.');});break;
      }
      case 'notifications': {
        const list=q('.uic-notifications');let count=2;const update=()=>{const n=all('[data-uic-notification]:not([data-read="true"])').length;q('[data-uic-unread]').textContent=n;say(`Непрочитанных уведомлений: ${n}.`);};const read=item=>{item.dataset.read='true';const btn=item.querySelector('button');btn.textContent='Прочитано';btn.disabled=true;};on(list,'click',e=>{const btn=e.target.closest('button');if(btn){read(btn.closest('li'));update();}});click('all',()=>{all('[data-uic-notification]').forEach(read);update();});click('add',e=>{if(all('li').length>=6){say('В образце не больше 6 записей.');return;}const li=document.createElement('li');li.dataset.uicNotification='';const text=document.createElement('span');text.textContent=`Учебное уведомление ${++count}`;const btn=document.createElement('button');btn.type='button';btn.className='ui-btn';btn.textContent='Прочитано';btn.setAttribute('aria-label',`Отметить прочитанным: ${text.textContent}`);li.append(text,btn);list.append(li);update();reveal(li,e);});break;
      }
      case 'progress-job': {
        let job,step=0;const progress=q('progress');const finish=()=>{action('start').disabled=false;action('cancel').disabled=true;};action('cancel').disabled=true;
        const tick=()=>{progress.value=++step;progress.textContent=`${step} из 5`;say(step===5?'Готово: обработаны все 5 учебных слоёв.':`Обработано ${step} из 5.`);if(step<5)job=later(tick,350);else finish();};click('start',()=>{cancel(job);step=0;progress.value=0;action('start').disabled=true;action('cancel').disabled=false;say('Начата учебная сборка.');job=later(tick,350);});click('cancel',()=>{cancel(job);finish();say(`Остановлено на ${step} из 5.`);});restorers.push(finish);break;
      }
      case 'skeleton-content': {
        let job;const slot=q('[data-uic-slot]'),skeleton=q('[data-uic-skeleton]'),content=q('[data-uic-content]');const done=text=>{slot.setAttribute('aria-busy','false');skeleton.hidden=true;content.hidden=false;action('load').disabled=false;action('cancel').disabled=true;say(text);};action('cancel').disabled=true;
        click('load',e=>{cancel(job);slot.setAttribute('aria-busy','true');skeleton.hidden=false;content.hidden=true;action('load').disabled=true;action('cancel').disabled=false;say('Учебная загрузка…');motion(skeleton,[{opacity:.45},{opacity:1},{opacity:.6}],e,700);job=later(()=>{done('Содержимое готово. Симуляция завершена.');reveal(content);},1000);});click('cancel',()=>{cancel(job);done('Загрузка отменена; предыдущая копия восстановлена.');});restorers.push(()=>done('Предыдущая копия восстановлена.'));break;
      }
      case 'empty-state': {
        let n=0;const list=q('[data-uic-empty-list]');const draw=()=>{q('[data-uic-empty-title]').textContent=n?'Ваша коллекция':'Коллекция пуста';q('[data-uic-empty-copy]').textContent=n?'Учебные материалы доступны ниже.':'Создайте первый материал — он появится здесь.';action('create').textContent='Создать образец';say(`Материалов: ${n}.`);};click('create',e=>{if(n>=4){say('В образце не больше 4 материалов.');return;}const li=document.createElement('li');li.textContent=`Aurora / ${++n}`;list.append(li);draw();reveal(li,e);});click('error',()=>{q('[data-uic-empty-title]').textContent='Учебная ошибка';q('[data-uic-empty-copy]').textContent='Коллекция сохранена. Повтор создаст новый локальный образец.';action('create').textContent='Повторить';say('Симуляция ошибки: ни один материал не потерян.');});click('reset',()=>{n=0;list.replaceChildren();draw();});break;
      }
      case 'validated-form': {
        const form=q('form'),title=q('#uic-form-title'),email=q('#uic-form-email'),summary=q('[data-uic-errors]');
        const validate=()=>{const problems=[];[[title,title.value.trim().length<3?'Введите минимум 3 символа.':''],[email,!email.value||!email.validity.valid?'Введите адрес вида demo@example.com.':'']].forEach(([field,error])=>{field.setAttribute('aria-invalid',String(Boolean(error)));q(`#${field.id}-error`).textContent=error;if(error)problems.push([field,error]);});summary.replaceChildren();summary.hidden=!problems.length;if(problems.length){const titleEl=document.createElement('strong');titleEl.textContent=`Исправьте ${problems.length} поля:`;summary.append(titleEl);const ul=document.createElement('ul');problems.forEach(([field,error])=>{const li=document.createElement('li'),link=document.createElement('a');link.href=`#${field.id}`;link.textContent=error;on(link,'click',e=>{e.preventDefault();field.focus();});li.append(link);ul.append(li);});summary.append(ul);}return !problems.length;};
        on(form,'submit',e=>{e.preventDefault();if(validate())say(`Форма корректна. «${title.value.trim()}» осталось только на странице.`);else {say('Форма содержит ошибки.');summary.focus();}});on(form,'input',()=>{if(!summary.hidden)validate();});break;
      }
      case 'wizard': {
        let step=0;const steps=all('[data-uic-step]'),markers=all('.uic-steps li'),next=q('[data-uic-next]'),name=q('#uic-wizard-name');const update=e=>{steps.forEach((el,i)=>el.hidden=i!==step);markers.forEach((el,i)=>{if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});action('back').disabled=step===0;next.textContent=step===2?'Создать локально':'Далее';q('[data-uic-review]').textContent=`${name.value.trim()||'Без названия'} · ${q('select').value}`;say(`Шаг ${step+1} из 3.`);reveal(steps[step],e);};on(q('form'),'submit',e=>{e.preventDefault();if(!name.value.trim()){name.setAttribute('aria-invalid','true');step=0;update(e);name.focus();say('Введите название образца.');return;}name.removeAttribute('aria-invalid');if(step<2){step++;update(e);steps[step].querySelector('input,select')?.focus();}else{say(`Создан локальный образец: ${name.value.trim()} / ${q('select').value}.`);announce('Локальный образец создан.');}});click('back',e=>{step=Math.max(0,step-1);update(e);});click('reset',e=>{step=0;name.value='Aurora';q('select').selectedIndex=0;update(e);});update({detail:0});restorers.push(()=>steps.forEach(el=>el.hidden=false));break;
      }
      case 'dirty-form': {
        const field=q('textarea');let saved=field.value;const update=()=>q('[data-uic-dirty]').textContent=field.value===saved?'Нет изменений':'Есть несохранённые изменения';on(field,'input',update);on(q('form'),'submit',e=>{e.preventDefault();saved=field.value;update();say('Черновик сохранён только в памяти страницы.');});click('cancel',()=>{field.value=saved;update();say('Возвращено последнее локальное сохранение.');});break;
      }
      case 'local-login': {
        const email=q('[type="email"]'),pass=q('[type="password"]'),profile=q('[data-uic-profile]');on(q('form'),'submit',e=>{e.preventDefault();const okEmail=email.value&&email.validity.valid,okPass=pass.value.length>=6;email.setAttribute('aria-invalid',String(!okEmail));pass.setAttribute('aria-invalid',String(!okPass));if(!okEmail||!okPass){say('Проверьте email и учебный пароль из 6 символов.');(!okEmail?email:pass).focus();return;}profile.hidden=false;pass.value='';say('Демо-профиль открыт локально. Авторизация не выполнялась.');reveal(profile,e);});click('logout',()=>{profile.hidden=true;pass.value='';say('Демо-профиль закрыт. Учебный пароль очищен.');});break;
      }
      case 'local-preferences': {
        const preview=q('[data-uic-pref-preview]');on(scene,'change',()=>{preview.dataset.look=q('[data-uic-pref-theme]').value;preview.dataset.density=q('[data-uic-pref-density]').value;q('[data-uic-pref-copy]').hidden=!q('[data-uic-pref-description]').checked;say('Предпочтения применены только к карточке образца.');});break;
      }
      case 'consent': {
        const boxes=all('[data-uic-consent]');const apply=()=>say(`Учебный выбор: необходимые${boxes.filter(el=>el.checked).map(el=>`, ${el.value.toLocaleLowerCase('ru')}`).join('')}. Cookie не установлены.`);click('apply',apply);click('essential',()=>{boxes.forEach(el=>el.checked=false);apply();});click('all',()=>{boxes.forEach(el=>el.checked=true);apply();});break;
      }
    }
  }
  const cleanup=()=>{
    controller.abort();timers.forEach(clearTimeout);timers.clear();animations.forEach(a=>a.cancel());animations.clear();
    restorers.forEach(fn=>fn());root.querySelectorAll('[data-uic-enhance]').forEach(el=>el.disabled=true);mounted.delete(root);
  };
  mounted.set(root,cleanup);return cleanup;
}
