// Independent axes: surface finish and optical edge. No continuous animation.
const names={'frost-film':'Матовая плёнка','frost-depth':'Матовое стекло','clear-film':'Глянцевая плёнка','clear-depth':'Глянцевое стекло'};
const presets={'frost-film':['frost','film'],'frost-glass':['frost','depth'],'clear-film':['clear','film'],'clear-glass':['clear','depth']};
let dispose=()=>{},mounted=false;
function mount(){
 if(mounted)return;mounted=true;
 const controller=new AbortController(),signal=controller.signal,html=document.documentElement;
 function apply(finish=html.dataset.finish||'frost',edge=html.dataset.materialEdge||'film'){
  html.dataset.finish=finish;html.dataset.materialEdge=edge;
  const atlas=document.querySelector('#ui-atlas');if(atlas)atlas.dataset.uiEdge=edge;
  document.querySelectorAll('[data-material-preset]').forEach(b=>{const p=presets[b.dataset.materialPreset];b.disabled=false;b.setAttribute('aria-pressed',String(p[0]===finish&&p[1]===edge));});
  document.querySelectorAll('[data-finish-select]').forEach(s=>s.value=finish);
  document.querySelectorAll('[name=ui-edge]').forEach(r=>r.checked=r.value===edge);
  document.querySelectorAll('[data-material-status]').forEach(s=>s.textContent=`${names[finish+'-'+edge]} · ${edge==='film'?'2D':'3D'}. CSS-имитация, без физической рефракции.`);
  document.querySelectorAll('[data-current-blur]').forEach(s=>s.textContent=finish==='clear'?'0.8 px / clear':'20 px / frost');
 }
 document.querySelectorAll('[data-material-preset]').forEach(b=>b.addEventListener('click',()=>apply(...presets[b.dataset.materialPreset]),{signal}));
 document.querySelectorAll('[data-finish-select]').forEach(s=>s.addEventListener('change',()=>apply(s.value),{signal}));
 document.querySelectorAll('[name=ui-edge]').forEach(r=>r.addEventListener('change',()=>{if(r.checked)apply(undefined,r.value);},{signal}));
 apply();dispose=()=>{controller.abort();mounted=false;};
}
mount();addEventListener('pagehide',()=>dispose());addEventListener('pageshow',e=>{if(e.persisted)mount();});
