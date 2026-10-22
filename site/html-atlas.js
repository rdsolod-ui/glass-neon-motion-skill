export function initHTMLAtlas(root=document.querySelector('#html-atlas')){
 if(!root)return ()=>{};
 const search=root.querySelector('#ha-search');
 const filterButtons=[...root.querySelectorAll('[data-ha-filter]')];
 const groups=[...root.querySelectorAll('[data-ha-group]')];
 let filter='all';
 function update(){
  const query=(search?.value||'').trim().toLocaleLowerCase('ru');
  let count=0;
  for(const group of groups){
   let visible=0;
   for(const entry of group.querySelectorAll('[data-ha-entry]')){
    const match=(filter==='all'||filter===group.dataset.haGroup)&&entry.dataset.haQuery.toLocaleLowerCase('ru').includes(query);
    entry.hidden=!match;if(match){visible++;count++;}
   }
   group.hidden=visible===0;
   if(query||filter!=='all')group.open=visible>0;
  }
  const countLabel=root.querySelector('#ha-count');if(countLabel)countLabel.textContent=`${count} элементов`;
  const empty=root.querySelector('#ha-empty');if(empty)empty.hidden=count!==0;
 }
 if(search){search.disabled=false;search.addEventListener('input',update);}
 filterButtons.forEach(button=>{
  button.disabled=false;
  button.addEventListener('click',()=>{filter=button.dataset.haFilter;filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();});
 });
 root.querySelectorAll('[name="ha-edge"]').forEach(radio=>radio.addEventListener('change',()=>{if(radio.checked)root.dataset.haEdge=radio.value;}));
 function feedback(control,message){const scope=control.closest('.ha-demo');const output=scope?.querySelector('[data-ha-feedback]');if(output)output.textContent=message;}
 root.querySelectorAll('[data-ha-action]').forEach(button=>button.addEventListener('click',()=>feedback(button,'Действие выполнено в локальном примере.')));
 root.querySelectorAll('[data-ha-form]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();feedback(form,'Проверка пройдена. Данные никуда не отправлены.');}));
 root.querySelectorAll('[data-ha-toggle]').forEach(button=>button.addEventListener('click',()=>{const active=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(active));feedback(button,active?'Образец закреплён.':'Образец откреплён.');}));
 root.querySelectorAll('[data-ha-mixed]').forEach(input=>{input.indeterminate=true;});
 const range=root.querySelector('[data-ha-output]');range?.addEventListener('input',()=>root.querySelector('[data-ha-range-value]').value=`${range.value} px`);
 const dialog=root.querySelector('#ha-native-dialog');
 const openDialog=root.querySelector('[data-ha-dialog-open]');
 openDialog?.addEventListener('click',()=>{if(typeof dialog?.showModal==='function')dialog.showModal();});
 dialog?.addEventListener('close',()=>openDialog?.focus());
 const timers=new Map();
 root.querySelectorAll('[data-ha-load]').forEach(button=>button.addEventListener('click',()=>{
  if(timers.has(button))clearTimeout(timers.get(button));
  button.disabled=true;button.setAttribute('aria-busy','true');button.textContent='Подготовка…';feedback(button,'Локальная подготовка образца.');
  timers.set(button,setTimeout(()=>{button.disabled=false;button.removeAttribute('aria-busy');button.textContent='Подготовить ещё раз';feedback(button,'Готово. Учебный переход завершён.');timers.delete(button);},700));
 }));
 function cleanup(){for(const [button,timer] of timers){clearTimeout(timer);button.disabled=false;button.removeAttribute('aria-busy');button.textContent='Подготовить образец';}timers.clear();if(dialog?.open)dialog.close();}
 window.addEventListener('pagehide',cleanup);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cleanup();});
 root.querySelectorAll('[data-ha-canvas]').forEach(canvas=>{const ctx=canvas.getContext('2d');if(!ctx)return;ctx.fillStyle='#123b4c';ctx.fillRect(0,0,240,100);ctx.fillStyle='#b1ff70';ctx.beginPath();ctx.arc(80,50,32,0,Math.PI*2);ctx.fill();ctx.fillStyle='#86eaff99';ctx.fillRect(100,22,110,58);});
 update();
}
initHTMLAtlas();
