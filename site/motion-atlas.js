// One owner per animated property. Static CSS is the readable resting state.
export function initMotionAtlas(root=document.querySelector('#motion-atlas')){
 if(!root)return ()=>{};
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const cards=[...root.querySelectorAll('[data-ma-id]')];
 const search=root.querySelector('#ma-search'),group=root.querySelector('#ma-group');
 const status=root.querySelector('#ma-status')||{textContent:''},manual=root.querySelector('#ma-reduce');
 const signalController=new AbortController(),signal=signalController.signal;
 const listen=(el,event,fn,options={})=>el?.addEventListener(event,fn,{...options,signal});
 const reduced=()=>media.matches||manual?.checked||document.documentElement.dataset.reduce==='true'||window.GlassTheme?.motionOptions(220).reduced;
 let current=null,timer=null,pointer=null,disposed=false;
 const scroll=root.querySelector('.ma-scroll'),scrollFill=root.querySelector('.ma-scroll-fill');
 const knob=root.querySelector('.ma-drag-knob'),track=root.querySelector('.ma-drag-track');
 root.querySelectorAll('button:disabled,input:disabled,select:disabled').forEach(el=>el.disabled=false);if(knob){knob.removeAttribute('aria-disabled');knob.tabIndex=0;}
 const updateScroll=()=>{if(!scroll||!scrollFill)return;const max=scroll.scrollHeight-scroll.clientHeight;const value=max>0?Math.max(0,Math.min(1,scroll.scrollTop/max)):0;scrollFill.style.transform=`scaleX(${value})`;scrollFill.parentElement.setAttribute('aria-valuenow',String(Math.round(value*100)))};
 const setDrag=value=>{if(!knob||!track)return;const v=Math.max(0,Math.min(100,Math.round(value)));knob.setAttribute('aria-valuenow',String(v));knob.style.transform=`translateX(${Math.max(0,track.clientWidth-knob.offsetWidth)*v/100}px)`};
 function releasePointer(){if(pointer!==null){try{if(knob.hasPointerCapture(pointer))knob.releasePointerCapture(pointer)}catch{}pointer=null}}
 function stop(message){clearTimeout(timer);timer=null;const old=current;current=null;old?.animations.forEach(animation=>animation.cancel());if(old?.id==='scroll-progress')scroll.scrollTo({top:scroll.scrollTop,behavior:'instant'});releasePointer();root.removeAttribute('data-ma-playing');if(message)status.textContent=message}
 function syncPreference(){root.dataset.maReduced=String(reduced());if(reduced())stop('Уменьшение движения: статичные кадры; прямое управление доступно.');else status.textContent='Движение доступно · выберите образец'}
 function filter(){stop();const query=(search?.value||'').trim().toLocaleLowerCase('ru');let count=0;cards.forEach(card=>{const visible=(!group||group.value==='all'||card.closest('[data-ma-group]')?.dataset.maGroup===group.value)&&card.dataset.maSearch.toLocaleLowerCase('ru').includes(query);card.hidden=!visible;if(visible)count++});root.querySelectorAll('[data-ma-group]').forEach(section=>section.hidden=![...section.querySelectorAll('[data-ma-id]')].some(card=>!card.hidden));const countLabel=root.querySelector('#ma-count');if(countLabel)countLabel.textContent=`${count} из 39 образцов`;const empty=root.querySelector('.ma-empty');if(empty)empty.hidden=count>0;status.textContent=reduced()?'Статичные кадры':'Выберите образец'}
 const durations={press:220,check:540,error:360,rise:480,exit:1100,mask:720,reorder:800,expand:650,shared:1000,tab:600,breadcrumb:900,drawer:650,parallax:1600,sticky:1500,words:1000,underline:750,replace:1000,path:1200,orbit:1500,morph:900,bars:1000,number:900,ring:1100,skeleton:1400,dots:1400,progress:1700,snap:1100,swipe:1200,light:1400,diffusion:1800,prism:1300,tilt:1400,stack:1500,focus:1200,stagger:1100,flow:1600,hero:1800};
 const ease='cubic-bezier(.22,1,.36,1)';
 async function play(id){
  stop();const card=cards.find(c=>c.dataset.maId===id);if(!card||card.hidden)return;
  if(id==='drag'){setDrag(50);status.textContent='Маркер в центре. Тяните или используйте ← →, Home, End.';return}
  if(id==='scroll-progress'){
   const to=scroll.scrollTop>10?0:scroll.scrollHeight-scroll.clientHeight;
   if(reduced()){scroll.scrollTo({top:to,behavior:'instant'});updateScroll();status.textContent='Прокрутка выполнена без анимации.';return}
   current={id,card,animations:[]};root.dataset.maPlaying=id;scroll.scrollTo({top:to,behavior:'smooth'});status.textContent='Настоящая прокрутка управляет шкалой.';
   timer=setTimeout(()=>{if(current?.id===id)stop('Прокрутка завершена. Можно прокручивать вручную.')},1200);return;
  }
  if(reduced()||!Element.prototype.animate){status.textContent='Показан статичный кадр: движение выключено или WAAPI недоступен.';return}
  const run={id,card,animations:[]};current=run;root.dataset.maPlaying=id;status.textContent=`Воспроизводится: ${card.querySelector('h4').textContent}`;
  const a=(selector,frames,options={})=>{card.querySelectorAll(selector).forEach((el,i)=>{const config={duration:durations[id],easing:ease,...(typeof options==='function'?options(i):options)};const motion=window.GlassTheme?.motionOptions(config.duration);if(motion){if(motion.reduced)return;config.duration=motion.duration;config.easing=motion.easing;if(config.delay)config.delay=window.GlassTheme.motionOptions(config.delay).duration;}const animation=el.animate(typeof frames==='function'?frames(i):frames,config);run.animations.push(animation)})};
  const tr=values=>values.map(transform=>({transform}));
  try{switch(id){
   case 'press':a('.ma-target',tr(['scale(1)','scale(.92)','scale(1)']));break;
   case 'check':a('.ma-target',[{strokeDashoffset:1},{strokeDashoffset:0}]);break;
   case 'error':a('.ma-target',tr(['translateX(0)','translateX(-6px)','translateX(5px)','translateX(-3px)','translateX(0)']),{easing:'ease-in-out'});break;
   case 'rise':a('.ma-target',[{opacity:0,transform:'translateY(24px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}]);break;
   case 'exit':a('.ma-target',[{opacity:1,transform:'translateX(0)'},{opacity:0,transform:'translateX(45px)',offset:.4},{opacity:0,transform:'translateX(-15px)',offset:.55},{opacity:1,transform:'translateX(0)'}]);break;
   case 'mask':a('.ma-target',[{clipPath:'inset(0 100% 0 0 round 20px)'},{clipPath:'inset(0 0% 0 0 round 20px)'}]);break;
   case 'reorder':a('.ma-a',tr(['translateX(0)','translateX(144px)','translateX(0)']));a('.ma-b,.ma-c',tr(['translateX(0)','translateX(-72px)','translateX(0)']));break;
   case 'expand':a('.ma-target',[{transform:'scaleY(.1)',opacity:0},{transform:'scaleY(1)',opacity:1}]);break;
   case 'shared':a('.ma-target',[{transform:'scale(.5) translateX(-80px)',borderRadius:'50%'},{transform:'scale(1)',borderRadius:'25px'}]);break;
   case 'tab':a('.ma-target',tr(['translateX(0)','translateX(280%)','translateX(140%)']));break;
   case 'breadcrumb':a('.ma-a',[{opacity:0,transform:'translateX(-10px)'},{opacity:1,transform:'translateX(0)'}],{duration:450});a('.ma-b',[{opacity:0,transform:'translateX(-10px)'},{opacity:1,transform:'translateX(0)'}],{duration:450,delay:300,fill:'backwards'});break;
   case 'drawer':a('.ma-target',tr(['translateX(105%)','translateX(0)']));break;
   case 'parallax':a('.ma-a',tr(['translateY(0)','translateY(-15px)','translateY(0)']));a('.ma-b',tr(['translateY(0) rotate(-20deg)','translateY(-30px) rotate(-20deg)','translateY(0) rotate(-20deg)']));a('.ma-c',tr(['translateY(0)','translateY(-48px)','translateY(0)']));break;
   case 'sticky':a('.ma-a',tr(['translateY(28px)','translateY(0)','translateY(0)']));a('.ma-b',tr(['translateY(15px)','translateY(-60px)']));break;
   case 'words':a('.ma-words span',[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],i=>({duration:550,delay:i*150,fill:'backwards'}));break;
   case 'underline':a('.ma-target',tr(['scaleX(0)','scaleX(1)']));break;
   case 'replace':a('.ma-a',[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-30px)'}],{duration:500});a('.ma-b',[{opacity:0,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,delay:400,fill:'backwards'});break;
   case 'path':a('.ma-target',[{strokeDashoffset:1},{strokeDashoffset:0}]);break;
   case 'orbit':a('.ma-target',tr(['rotate(0deg)','rotate(360deg)']),{easing:'linear'});break;
   case 'morph':a('.ma-target',[{rx:'5px',transform:'rotate(-45deg) scale(.8)'},{rx:'32px',transform:'rotate(0deg) scale(1)'}]);break;
   case 'bars':a('.ma-bars i',tr(['scaleY(.05)','scaleY(1)']),i=>({duration:700,delay:i*90,fill:'backwards'}));break;
   case 'number':a('.ma-target',tr(['translateY(0)','translateY(-73px)']));break;
   case 'ring':a('.ma-target',[{strokeDashoffset:1},{strokeDashoffset:.25}]);break;
   case 'skeleton':a('.ma-a',[{opacity:.9},{opacity:.5,offset:.4},{opacity:0}],{duration:1000});a('.ma-b',[{opacity:0},{opacity:1}],{duration:500,delay:800,fill:'backwards'});break;
   case 'dots':a('.ma-dots i',[{opacity:.4,transform:'translateY(0)'},{opacity:1,transform:'translateY(-13px)',offset:.3},{opacity:.4,transform:'translateY(0)',offset:.6},{opacity:1,transform:'translateY(0)'}],i=>({duration:1000,delay:i*130,fill:'backwards'}));break;
   case 'progress':a('.ma-target',tr(['scaleX(.04)','scaleX(.45)','scaleX(.6)','scaleX(1)']),{easing:'ease-in-out'});break;
   case 'snap':a('.ma-target',tr(['translateX(-58px)','translateX(10px)','translateX(-4px)','translateX(0)']));break;
   case 'swipe':a('.ma-target',[{opacity:1,transform:'translateX(0) rotate(0)'},{opacity:0,transform:'translateX(130px) rotate(9deg)',offset:.55},{opacity:0,transform:'translateX(-20px) rotate(0)',offset:.75},{opacity:1,transform:'translateX(0) rotate(0)'}]);break;
   case 'light':a('.ma-target',[{opacity:0,transform:'translateX(-130px) rotate(25deg)'},{opacity:.8,transform:'translateX(0) rotate(25deg)',offset:.5},{opacity:0,transform:'translateX(130px) rotate(25deg)'}]);break;
   case 'diffusion':a('.ma-target',tr(['translateX(0)','translateX(145px)','translateX(0)']));break;
   case 'prism':a('.ma-a',[{opacity:.2,transform:'translateX(0)'},{opacity:1,transform:'translateX(-18px)',offset:.5},{opacity:1,transform:'translateX(-9px)'}]);a('.ma-b',[{opacity:.2,transform:'translateX(0)'},{opacity:1,transform:'translateX(18px)',offset:.5},{opacity:1,transform:'translateX(9px)'}]);break;
   case 'tilt':a('.ma-target',tr(['rotateY(-12deg) rotateX(6deg)','rotateY(16deg) rotateX(-7deg)','rotateY(-12deg) rotateX(6deg)']));break;
   case 'stack':a('.ma-a',tr(['translate(0,0)','translate(-16px,-14px)','translate(0,0)']));a('.ma-b',tr(['translate(0,0)','translate(0,-4px)','translate(0,0)']));a('.ma-c',tr(['translate(0,0)','translate(16px,14px)','translate(0,0)']));break;
   case 'focus':a('.ma-a',[{opacity:.65,transform:'scale(1)'},{opacity:1,transform:'translate(15px,15px) scale(1.1)',offset:.5},{opacity:.65,transform:'scale(1)'}]);a('.ma-b',[{opacity:1,transform:'scale(1)'},{opacity:.3,transform:'scale(.9)',offset:.5},{opacity:1,transform:'scale(1)'}]);break;
   case 'stagger':a('.ma-cell',[{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],i=>({duration:650,delay:i*180,fill:'backwards'}));break;
   case 'flow':a('.ma-flow span',[{opacity:.4,transform:'scale(.95)'},{opacity:1,transform:'scale(1.12)',offset:.5},{opacity:1,transform:'scale(1)'}],i=>({duration:700,delay:i*400,fill:'backwards'}));a('.ma-flow i',tr(['scaleX(0)','scaleX(1)']),i=>({duration:450,delay:350+i*400,fill:'backwards'}));break;
   case 'hero':a('.ma-a',[{opacity:0,transform:'scale(.7) translateX(25px)'},{opacity:1,transform:'scale(1) translateX(0)'}],{duration:1000});a('.ma-b',[{opacity:0,transform:'translateY(15px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:350,fill:'backwards'});a('.ma-c',[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:550,delay:850,fill:'backwards'});break;
   default:throw new Error(`Unknown specimen: ${id}`);
  }
  await Promise.all(run.animations.map(animation=>animation.finished.catch(()=>{})));
  if(current===run){run.animations.forEach(animation=>animation.cancel());current=null;root.removeAttribute('data-ma-playing');status.textContent='Этюд завершён · показан статичный кадр'}
  }catch(error){stop('Этот браузер не воспроизвёл эффект. Статичный образец доступен.');console.warn('Motion Atlas specimen:',id,error.message)}
 }
 listen(root,'click',event=>{const button=event.target.closest('[data-ma-play]');if(button)play(button.dataset.maPlay);const jump=event.target.closest('[data-ma-jump]');if(jump&&group&&search){group.value='all';search.value='';filter()}});
 listen(root.querySelector('#ma-stop'),'click',()=>stop('Остановлено · показан статичный кадр'));
 listen(search,'input',filter);listen(group,'change',filter);listen(manual,'change',syncPreference);listen(media,'change',syncPreference);
 listen(scroll,'scroll',()=>{if(current&&current.id!=='scroll-progress')stop();updateScroll()},{passive:true});
 listen(knob,'pointerdown',event=>{if(event.button!==0)return;stop();pointer=event.pointerId;knob.setPointerCapture(pointer);knob.focus({preventScroll:true});status.textContent='Перетаскивание: прямое управление, без инерции.'});
 listen(knob,'pointermove',event=>{if(pointer!==event.pointerId)return;const bounds=track.getBoundingClientRect();const range=bounds.width-knob.offsetWidth;setDrag(range>0?(event.clientX-bounds.left-knob.offsetWidth/2)/range*100:0)});
 listen(knob,'pointerup',()=>releasePointer());listen(knob,'pointercancel',()=>releasePointer());listen(knob,'lostpointercapture',()=>{pointer=null});
 listen(knob,'keydown',event=>{const step=event.shiftKey?10:5;let value=Number(knob.getAttribute('aria-valuenow'));if(event.key==='ArrowRight')value+=step;else if(event.key==='ArrowLeft')value-=step;else if(event.key==='Home')value=0;else if(event.key==='End')value=100;else return;event.preventDefault();stop();setDrag(value);status.textContent='Положение изменено с клавиатуры.'});
 const resize=typeof ResizeObserver==='function'?new ResizeObserver(()=>{setDrag(Number(knob?.getAttribute('aria-valuenow')||50));updateScroll()}):null;if(track)resize?.observe(track);if(scroll)resize?.observe(scroll);
 const offscreen=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting&&current?.card===entry.target)stop('Этюд остановлен за пределами экрана.');if(!entry.isIntersecting&&entry.target.dataset.maId==='drag')releasePointer()}},{threshold:0}):null;
 cards.forEach(card=>offscreen?.observe(card));
 const attributes=new MutationObserver(syncPreference);attributes.observe(document.documentElement,{attributes:true,attributeFilter:['data-reduce']});
 listen(document,'visibilitychange',()=>{if(document.hidden)stop()});
 listen(window,'glass-theme-change',()=>{stop();syncPreference()});
 listen(window,'pagehide',()=>{stop();offscreen?.disconnect();resize?.disconnect()});
 listen(window,'pageshow',()=>{cards.forEach(card=>offscreen?.observe(card));if(track)resize?.observe(track);if(scroll)resize?.observe(scroll);setDrag(Number(knob?.getAttribute('aria-valuenow')||50));updateScroll();syncPreference()});
 setDrag(50);updateScroll();syncPreference();
 return ()=>{if(disposed)return;disposed=true;stop();signalController.abort();offscreen?.disconnect();resize?.disconnect();attributes.disconnect()};
}
initMotionAtlas();
