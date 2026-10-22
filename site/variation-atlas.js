import {initAdvancedVariations} from './variation-advanced.js';
const root=document.querySelector('#variation-atlas');
let dispose=()=>{};
function mount(){
 if(!root||root.dataset.ready==='true')return;
 const controller=new AbortController(),{signal}=controller,media=matchMedia('(prefers-reduced-motion: reduce)'),timers=new Map(),animations=new Set();
 const reduced=()=>media.matches||document.documentElement.dataset.uiReduced==='true'||document.documentElement.dataset.reduce==='true';
 const on=(el,type,fn)=>el.addEventListener(type,fn,{signal});
 const stopMotion=()=>{animations.forEach(a=>a.cancel());animations.clear();};
 on(media,'change',()=>{if(reduced())stopMotion();});
 const observer=new MutationObserver(()=>{if(reduced())stopMotion();});observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-ui-reduced','data-reduce']});
 on(document,'visibilitychange',()=>{if(document.hidden)stopMotion();});
 const animate=(el,keyframes,delay=0)=>{if(reduced()||document.hidden)return;const a=el.animate(keyframes,{duration:650,iterations:2,delay});animations.add(a);a.onfinish=a.oncancel=()=>animations.delete(a);};
 for(const axis of ['density','shape'])on(root.querySelector('#vx-'+axis),'change',e=>{root.dataset['vx'+axis[0].toUpperCase()+axis.slice(1)]=e.target.value;});
 const family=root.querySelector('#vx-family');on(family,'change',()=>{root.querySelectorAll('[data-vx-group]').forEach(g=>{g.hidden=family.value!=='all'&&family.value!==g.dataset.vxGroup;if(!g.hidden&&family.value!=='all')g.open=true;});});
 const reveal=()=>{let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const target=document.getElementById(id);if(!target||!root.contains(target))return;const group=target.closest('[data-vx-group]');if(group){if(group.hidden){family.value='all';family.dispatchEvent(new Event('change'));}group.hidden=false;group.open=true;}requestAnimationFrame(()=>target.scrollIntoView({block:'start',behavior:'instant'}));};on(window,'hashchange',reveal);
 root.querySelectorAll('[data-vx-range]').forEach(input=>on(input,'input',()=>{
  const stage=input.closest('.vx-stage'),value=Number(input.value);stage.querySelector('output').textContent=value+'%';
  stage.querySelectorAll('progress,meter').forEach(p=>{p.value=value;p.textContent=value+'%';});
  const ring=stage.querySelector('.vx-ring');if(ring){ring.style.setProperty('--value',value);ring.setAttribute('aria-valuenow',value);ring.querySelector('span').textContent=value+'%';}
  const segments=stage.querySelector('.vx-segments');if(segments){segments.setAttribute('aria-valuenow',value);[...segments.children].forEach((el,i)=>el.classList.toggle('on',i<Math.floor(value/10)));}
 }));
 const syncReading=el=>{const demo=el.closest('.vx-scroll-demo'),p=demo.querySelector('progress');if(p){const max=el.scrollHeight-el.clientHeight,value=max>0?Math.round(el.scrollTop/max*100):100;p.value=value;demo.querySelector('output').textContent=value+'%';}};
 root.querySelectorAll('.vx-scroll').forEach(el=>on(el,'scroll',()=>syncReading(el)));
 const stopLoad=(demo,text)=>{clearTimeout(timers.get(demo));timers.delete(demo);demo.querySelector('.vx-load-surface').setAttribute('aria-busy','false');demo.querySelector('.vx-load-status').textContent=text;demo.querySelectorAll('*').forEach(el=>el.getAnimations().forEach(a=>a.cancel()));};
 const updateQuantity=(box,value)=>{const input=box.querySelector('input'),v=Math.max(1,Math.min(12,Number(value)||1));input.value=v;box.querySelector('[role=status]').textContent='Выбрано: '+v;box.querySelector('[data-vx-action=minus]').disabled=v===1;box.querySelector('[data-vx-action=plus]').disabled=v===12;};
 on(root,'click',e=>{
  const btn=e.target.closest('[data-vx-action]');if(!btn)return;const action=btn.dataset.vxAction,stage=btn.closest('.vx-stage');
  if(action.startsWith('scroll-')){const el=stage.querySelector('.vx-scroll');el.scrollTo({top:action==='scroll-end'?el.scrollHeight:0,left:action==='scroll-end'?el.scrollWidth:0,behavior:'instant'});}
  else if(action==='load'||action==='cancel-load'){
   const demo=btn.closest('.vx-load-demo');stopLoad(demo,action==='load'?'Подготовка…':'Загрузка отменена');
   if(action==='load'){demo.querySelector('.vx-load-surface').setAttribute('aria-busy','true');const spinner=demo.querySelector('.vx-spinner');if(spinner)animate(spinner,[{transform:'rotate(0deg)'},{transform:'rotate(360deg)'}]);demo.querySelectorAll('.vx-dots i').forEach((el,i)=>animate(el,[{opacity:1},{opacity:.35},{opacity:1}],i*100));timers.set(demo,setTimeout(()=>stopLoad(demo,'Готово · 3 образца подготовлены локально'),2000));}
  } else if(action.startsWith('step-')){const demo=btn.closest('.vx-step-demo'),value=Math.max(1,Math.min(3,Number(demo.dataset.step)+(action==='step-next'?1:-1)));demo.dataset.step=value;demo.querySelectorAll('li').forEach((el,i)=>{if(i===value-1)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');el.dataset.done=String(i<value-1);});demo.querySelector('[role=status]').textContent=`Шаг ${value} из 3 · ${['Материал','Композиция','Проверка'][value-1]}`;demo.querySelector('[data-vx-action=step-back]').disabled=value===1;demo.querySelector('[data-vx-action=step-next]').disabled=value===3;
  } else if(action==='choose')stage.querySelector('[role=status]').textContent='Локальное действие: '+btn.textContent+'. Данные не отправлены.';
  else if(action==='toggle'){const selected=btn.getAttribute('aria-pressed')!=='true';btn.setAttribute('aria-pressed',String(selected));btn.textContent=selected?'В избранном':'В избранное';stage.querySelector('[role=status]').textContent=selected?'Образец добавлен в локальную подборку.':'Образец убран из подборки.';}
  else if(action==='plus'||action==='minus'){const box=btn.closest('.vx-quantity');updateQuantity(box,Number(box.querySelector('input').value)+(action==='plus'?1:-1));}
  else if(action==='metric'){const el=stage.querySelector('.vx-metric');el.textContent=Number(el.textContent)+1;}
  else if(action==='chip'){btn.setAttribute('aria-pressed',String(btn.getAttribute('aria-pressed')!=='true'));const names=[...stage.querySelectorAll('[aria-pressed=true]')].map(el=>el.textContent);stage.querySelector('[role=status]').textContent=names.length?'Выбрано: '+names.join(', '):'Ничего не выбрано';}
  else if(action==='notice'){const el=stage.querySelector('[role=status]');el.textContent=el.textContent.startsWith('Изменения')?'Нет соединения · демонстрационное состояние.':'Изменения сохранены локально.';}
 });
 root.querySelectorAll('.vx-step-demo').forEach(el=>{const step=Number(el.dataset.step);el.querySelector('[data-vx-action=step-back]').disabled=step===1;el.querySelector('[data-vx-action=step-next]').disabled=step===3;});
 root.querySelectorAll('[data-vx-count]').forEach(el=>on(el,'input',()=>{el.closest('.vx-stage').querySelector('output').textContent=el.value.length+' / 160';}));
 root.querySelectorAll('[data-vx-unit]').forEach(el=>on(el,'input',()=>{el.closest('.vx-stage').querySelector('[role=status]').textContent=el.validity.valid&&el.value!==''?'Ширина: '+el.value+' px':'Введите число от 160 до 1200 px';}));
 root.querySelectorAll('.vx-quantity input').forEach(el=>on(el,'change',()=>updateQuantity(el.closest('.vx-quantity'),el.value)));
 root.querySelectorAll('[data-vx-email]').forEach(form=>{on(form,'submit',e=>{e.preventDefault();const input=form.querySelector('input'),valid=input.checkValidity();input.setAttribute('aria-invalid',String(!valid));form.querySelector('[role=status]').textContent=valid?'Формат верный. Ничего не отправлено.':'Введите email в формате name@example.com';if(!valid)input.focus();});on(form.querySelector('input'),'input',()=>form.querySelector('input').removeAttribute('aria-invalid'));});
 root.querySelectorAll('.vx-selection input').forEach(el=>on(el,'change',()=>{el.closest('.vx-stage').querySelector('[role=status]').textContent=el.checked?'Материал выбран':'Материал не выбран';}));
 root.querySelectorAll('[data-vx-status]').forEach(el=>on(el,'change',()=>{el.closest('.vx-stage').querySelector('[data-vx-badge]').textContent='● '+el.value;}));
 initAdvancedVariations(root,signal);
 root.dataset.ready='true';reveal();
 dispose=()=>{timers.forEach((_,demo)=>stopLoad(demo,'Демонстрация остановлена'));stopMotion();observer.disconnect();controller.abort();root.dataset.ready='false';};
 window.VariationAtlas={dispose,diagnostics:()=>({mounted:root.dataset.ready==='true',timers:timers.size,animations:animations.size,reduced:reduced()})};
}
mount();addEventListener('pagehide',()=>dispose());addEventListener('pageshow',e=>{if(e.persisted)mount();});
