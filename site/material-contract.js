// One material state for page, components and portable exports.
export function syncMaterialDOM(doc=document){
 const html=doc.documentElement,finish=html.dataset.finish==='frost'?'frost':'clear',edge=html.dataset.materialEdge==='film'?'film':'depth';
 for(const el of doc.querySelectorAll('.ui-atlas'))if(el.dataset.uiEdge!==edge)el.dataset.uiEdge=edge;
 for(const el of doc.querySelectorAll('.ha-root'))if(el.dataset.haEdge!==(edge==='depth'?'3d':'2d'))el.dataset.haEdge=edge==='depth'?'3d':'2d';
 for(const el of doc.querySelectorAll('[name="ui-edge"]'))el.checked=el.value===edge;
 for(const el of doc.querySelectorAll('[name="ha-edge"]'))el.checked=el.value===(edge==='depth'?'3d':'2d');
 for(const button of doc.querySelectorAll('[data-theme-toggle]')){button.textContent=html.dataset.theme==='dark'?'Светлая тема':'Тёмная тема';button.setAttribute('aria-label',html.dataset.theme==='dark'?'Включить светлую тему':'Включить тёмную тему');}
 const labels={'clear-film':'Прозрачная плёнка','clear-depth':'Прозрачное стекло','frost-film':'Матовая плёнка','frost-depth':'Матовое стекло'};
 for(const el of doc.querySelectorAll('[data-material-status]'))el.textContent=labels[finish+'-'+edge]+' · '+(edge==='depth'?'3D':'2D')+'. CSS-имитация, без физической рефракции.';
 for(const el of doc.querySelectorAll('[data-current-edge]'))el.textContent=edge==='depth'?'3D':'2D';
 const filter=doc.defaultView?.getComputedStyle(html).getPropertyValue('--glass-filter')||'',blur=filter.match(/blur\(([\d.]+)px\)/);
 for(const el of doc.querySelectorAll('[data-current-blur]'))el.textContent=(blur?Number(blur[1]):0)+' px / '+finish;
}

let cleanup=()=>{};
function mount(){
 cleanup();syncMaterialDOM();
 const observer=new MutationObserver(()=>syncMaterialDOM());observer.observe(document.documentElement,{attributes:true,attributeFilter:['data-finish','data-material-edge','data-theme']});
 const onChange=e=>{if(e.target.matches('[name="ha-edge"],[name="ui-edge"]')&&e.target.checked){document.documentElement.dataset.materialEdge=['3d','depth'].includes(e.target.value)?'depth':'film';syncMaterialDOM();}};
 document.addEventListener('change',onChange);cleanup=()=>{observer.disconnect();document.removeEventListener('change',onChange);};
}
if(typeof document!=='undefined'){mount();addEventListener('pagehide',()=>cleanup());addEventListener('pageshow',e=>{if(e.persisted)mount();});}
