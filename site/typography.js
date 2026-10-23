export function initTypography(root=document){
 const active=new Map(),events=new AbortController(),media=matchMedia('(prefers-reduced-motion: reduce)');
 const reduced=()=>media.matches||window.GlassTheme?.motionOptions?.().reduced||window.GlassThemeRuntime?.motionOptions?.().reduced;
 const stop=()=>{active.forEach(a=>a.cancel());active.clear();};
 function play(stage){
  [...stage.children].forEach((el,i)=>{
   active.get(el)?.cancel();if(reduced())return;
   const mode=stage.dataset.cinema;
   const from=mode==='mask'?{clipPath:'inset(0 0 100% 0)',transform:'translateY(12px)'}:mode==='scale'?{opacity:.25,transform:'scale(.96)'}:{opacity:.15,transform:'translateY(20px)'};
   const a=el.animate([from,{opacity:1,transform:'none',clipPath:'inset(0)'}],{duration:900,delay:Math.min(i,5)*90,easing:'cubic-bezier(.22,1,.36,1)',fill:'none'});
   active.set(el,a);a.onfinish=a.oncancel=()=>{if(active.get(el)===a)active.delete(el);};
  });
 }
 const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){observer.unobserve(e.target);play(e.target);}});},{threshold:.25});
 root.querySelectorAll('[data-cinema]').forEach(e=>observer.observe(e));
 root.addEventListener('click',e=>{const button=e.target.closest('[data-type-play]');if(button)play(button.closest('[data-type-example]').querySelector('[data-cinema]'));},{signal:events.signal});
 media.addEventListener('change',stop,{signal:events.signal});addEventListener('glass-theme-change',()=>{if(reduced())stop();},{signal:events.signal});
 const dispose=()=>{stop();observer.disconnect();events.abort();};addEventListener('pagehide',dispose,{once:true});return dispose;
}
if(typeof document!=='undefined'){initTypography();addEventListener('pageshow',e=>{if(e.persisted)initTypography();});}
