(()=>{
const root=document.documentElement;
const media=matchMedia('(prefers-reduced-motion: reduce)');
const cleanups=[];const active=new Set();let manualReduce=false;let toastTimer;
const reduced=()=>media.matches||manualReduce||Boolean(window.GlassTheme?.motionOptions().reduced);
function animate(el,frames,duration=460){
 if(!el)return;for(const a of el.getAnimations())a.cancel();
 if(reduced()||!el.animate)return;
 const settings=window.GlassTheme?.motionOptions(duration);const a=el.animate(frames,{duration:settings?.duration??duration,easing:settings?.easing??'cubic-bezier(.22,1,.36,1)',fill:'none'});active.add(a);
 a.onfinish=a.oncancel=()=>active.delete(a);return a;
}
const onGlassTheme=()=>{for(const a of active)a.cancel();active.clear();syncMotion();};
window.addEventListener('glass-theme-change',onGlassTheme);cleanups.push(()=>window.removeEventListener('glass-theme-change',onGlassTheme));
function syncMotion(){root.dataset.reduce=String(reduced());if(reduced()){for(const a of active)a.cancel();active.clear();}document.querySelectorAll('[data-motion-status]').forEach(e=>e.textContent=reduced()?'Движение уменьшено':'Движение включено')}
media.addEventListener('change',syncMotion);cleanups.push(()=>media.removeEventListener('change',syncMotion));syncMotion();
function themeLabels(){document.querySelectorAll('[data-theme-toggle]').forEach(b=>{b.textContent=root.dataset.theme==='dark'?'Светлая тема':'Тёмная тема';b.setAttribute('aria-label',`Включить ${root.dataset.theme==='dark'?'светлую':'тёмную'} тему`)})}
themeLabels();document.querySelectorAll('[data-theme-toggle]').forEach(b=>b.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('glass-theme',root.dataset.theme)}catch{}themeLabels()}));
const menu=document.querySelector('[data-menu]');const nav=document.querySelector('#navigation');
function closeMenu(restore=false){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false');if(restore)menu?.focus()}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open))});
document.addEventListener('click',e=>{if(nav&&!nav.contains(e.target)&&!menu?.contains(e.target))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open'))closeMenu(true)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
function toast(text){const t=document.querySelector('.toast');if(!t)return;t.textContent=text;clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.textContent='',4000)}
function openDialog(dialog,trigger){if(!dialog)return;dialog.showModal();dialog.scrollTop=0;dialog._trigger=trigger;animate(dialog,[{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],220)}
document.querySelectorAll('dialog').forEach(d=>{d.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>d.close()));d.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const nodes=[...d.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled),select,textarea,[tabindex="0"]')].filter(n=>n.getClientRects().length);const first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}});d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}});d.addEventListener('close',()=>d._trigger?.focus())});
document.querySelector('#open-spec')?.addEventListener('click',e=>openDialog(document.querySelector('#spec-dialog'),e.currentTarget));
document.querySelector('#reduce-motion')?.addEventListener('change',e=>{manualReduce=e.target.checked;syncMotion()});
document.querySelector('#solid-mode')?.addEventListener('change',e=>root.dataset.solid=String(e.target.checked));
document.querySelector('#frost')?.addEventListener('input',e=>{const value=Number(e.target.value);root.style.setProperty('--blur',value+'px');document.querySelector('#frost-value').textContent=value+' px'});
const accents={lime:'#a8ff62',cyan:'#63edff',pink:'#ffa2ea'};let accent='lime';
document.querySelectorAll('[data-accent]').forEach(b=>b.addEventListener('click',()=>{accent=b.dataset.accent;root.style.setProperty('--accent',accents[accent]);document.querySelectorAll('[data-accent]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
document.querySelector('#material-name')?.addEventListener('input',e=>document.querySelector('#custom-material strong').textContent=e.target.value.trim()||'Личный материал');
document.querySelector('#material-form')?.addEventListener('submit',e=>{e.preventDefault();const text=`/* LUMA material tokens; compose with the full theme tokens. */\n:root {\n  --accent: ${accents[accent]};\n  --accent-ink: #112009;\n  --blur: ${document.querySelector('#frost').value}px;\n}\n/* Solid surface requested: ${root.dataset.solid==='true'} */\n`;const url=URL.createObjectURL(new Blob([text],{type:'text/css'}));const a=document.createElement('a');a.href=url;a.download='luma-material.css';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('CSS-токены подготовлены. Скачивание началось.')});
const recipes={enter:{title:'Появление',text:'Иерархия · 460 мс · opacity + translateY · WAAPI. При уменьшении движения — сразу конечное состояние.',frames:[{opacity:0,transform:'translateY(24px)'},{opacity:1,transform:'translateY(0)'}]},lift:{title:'Отклик',text:'Подтверждение · 360 мс · scale + translateY · WAAPI. Повторный запуск отменяет предыдущий.',frames:[{transform:'translateY(0) scale(1)'},{transform:'translateY(-10px) scale(1.025)',offset:.45},{transform:'translateY(0) scale(1)'}]},layout:{title:'Переход',text:'Смена состояния · 560 мс · translateX · WAAPI. Контент остаётся видимым; декоративного зацикливания нет.',frames:[{transform:'translateX(-45px)',opacity:.5},{transform:'translateX(0)',opacity:1}]}};let current='enter';
function play(kind=current){current=kind;const r=recipes[kind];animate(document.querySelector('#motion-target'),r.frames,kind==='layout'?560:kind==='lift'?360:460);const desc=document.querySelector('#motion-description');if(desc){desc.replaceChildren();const strong=document.createElement('strong');strong.textContent=r.title+'. ';desc.append(strong,document.createTextNode(reduced()?'Движение уменьшено: показано конечное состояние.':r.text))}document.querySelectorAll('[data-motion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.motion===kind)))}
document.querySelectorAll('[data-motion]').forEach(b=>b.addEventListener('click',()=>play(b.dataset.motion)));document.querySelector('#replay')?.addEventListener('click',()=>play());
if(document.querySelector('#motion-target')){const desc=document.querySelector('#motion-description');desc.textContent=recipes.enter.text}
// One WAAPI owner for the glass segment lens; semantic state updates immediately.
const surfaceCopy={frost:['Мягкий свет','2D-плёнка без обводки рассеивает цвет, сохраняя силуэт за стеклом.','Frost · 2D-плёнка'],smoke:['Глубокий тон','Тонированная 2D-плёнка без обводки удерживает контраст на насыщенном фоне.','Smoke · 2D-тонировка'],prism:['Световая грань','Двойной блик и цветной край создают ощущение толщины. Это CSS-имитация оптики.','Prism · 3D-грань']};
const surfaceButtons=[...document.querySelectorAll('[data-surface]')];
surfaceButtons.forEach((button,index)=>button.addEventListener('click',()=>{const lens=document.querySelector('.segment-lens');const old=lens.getBoundingClientRect().left;const group=button.parentElement;const step=(group.clientWidth-14)/3;const target=index*step;lens.style.transform=`translateX(${target}px)`;const delta=old-lens.getBoundingClientRect().left;animate(lens,[{transform:`translateX(${target+delta}px)`},{transform:`translateX(${target}px)`}],320);surfaceButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));const kind=button.dataset.surface;document.querySelector('[data-surface-preview]').dataset.surfacePreview=kind;document.querySelector('#surface-title').textContent=surfaceCopy[kind][0];document.querySelector('#surface-copy').textContent=surfaceCopy[kind][1];document.querySelector('#surface-status').textContent='Выбран '+surfaceCopy[kind][2];}));
// Recalculate the selected lens after a responsive resize without animating layout.
const syncLens=()=>{const index=surfaceButtons.findIndex(b=>b.getAttribute('aria-pressed')==='true');if(index<0)return;const lens=document.querySelector('.segment-lens');for(const a of lens.getAnimations())a.cancel();lens.style.transform=`translateX(${index*(surfaceButtons[0].parentElement.clientWidth-14)/3}px)`};
addEventListener('resize',syncLens);cleanups.push(()=>removeEventListener('resize',syncLens));
document.querySelectorAll('[data-intro]').forEach((el,i)=>{const end=getComputedStyle(el).transform;animate(el,[{opacity:0,transform:`translateY(${16+i*8}px) ${end==='none'?'':end}`},{opacity:1,transform:end}],650+i*100)});
function dispose(){for(const a of active)a.cancel();active.clear();clearTimeout(toastTimer);cleanups.forEach(fn=>fn())}
addEventListener('pagehide',dispose);addEventListener('pageshow',e=>{if(e.persisted){window.addEventListener('glass-theme-change',onGlassTheme);media.addEventListener('change',syncMotion);addEventListener('resize',syncLens);syncMotion();syncLens()}});
window.GlassLab={animate,openDialog,toast,reduced,diagnostics:()=>({active:active.size,reduced:reduced(),theme:root.dataset.theme}),dispose};
})();
