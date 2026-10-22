// Pure render functions are also used by the static generator. No DOM access at import time.
export const escapeData = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const e=escapeData, n=value=>Number(value.toFixed(2)), fmt=value=>value==null?'Нет данных':new Intl.NumberFormat('ru-RU',{maximumFractionDigits:1}).format(value);
const text=(x,y,value,anchor='start',cls='')=>`<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" class="${cls}">${e(value)}</text>`;
const line=(x1,y1,x2,y2,cls='uid-grid')=>`<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" class="${cls}"/>`;
const rect=(x,y,w,h,cls='uid-c0')=>`<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0,w))}" height="${n(Math.max(0,h))}" class="${cls}"/>`;
const point=(x,y,cls='uid-c0',r=5)=>`<circle cx="${n(x)}" cy="${n(y)}" r="${r}" class="${cls}"/>`;
const path=(d,cls='uid-line uid-s0')=>`<path d="${d}" class="${cls}"/>`;
const seriesPath=(values,x,y)=>{let started=false;return values.map((v,i)=>{if(v==null){started=false;return ''}const p=`${started?'L':'M'}${n(x(i))},${n(y(v))}`;started=true;return p}).join(' ')};
const colors=['uid-c0','uid-c1','uid-c2','uid-c3'];
const names=['Frost','Smoke','Prism','Solid'];
export const chartDefinitions=[
 {id:'bar',title:'Сортируемые столбцы',family:'Сравнение',tags:'bar столбчатый сортировка comparison',unit:'ед.',note:'Длина от нуля; сортировка меняет порядок, а не значения.'},
 {id:'grouped',title:'Сравнение двух серий',family:'Сравнение',tags:'grouped bar series группы сравнение',unit:'ед.',series:['План','Факт'],note:'Общая линейная шкала. Серии различаются цветом и узором.'},
 {id:'line',title:'Линия с пропуском',family:'Время',tags:'line time null линия время динамика',unit:'ед.',series:['План','Факт'],note:'Разрыв — отсутствие наблюдения, не ноль. Пропуск не интерполируется.'},
 {id:'histogram',title:'Распределение по интервалам',family:'Распределение',tags:'histogram bins гистограмма распределение',unit:'наблюдений',note:'Равные интервалы [a, b), последний включает правую границу. Исходная выборка доступна ниже.'},
 {id:'scatter',title:'Связь двух величин',family:'Связи',tags:'scatter correlation диаграмма рассеяния корреляция',unit:'мин / баллы',series:['Команда A','Команда B'],note:'Каждая точка — отдельное учебное наблюдение; связь не доказывает причинность.'},
 {id:'donut',title:'Доли целого',family:'Доли',tags:'donut pie доли круговая кольцевая',unit:'ед. / %',note:'Сектора рассчитаны от общей суммы. Точные значения и доли есть в таблице.'},
 {id:'stacked',title:'Нормированные группы',family:'Доли',tags:'100 stacked percent доли нормировка',unit:'%',series:['План','Факт'],note:'Каждая строка нормируется до 100% выбранных серий. Абсолютные значения не теряются в таблице.'},
 {id:'treemap',title:'Иерархия площадей',family:'Иерархия',tags:'treemap hierarchy дерево карта иерархия',unit:'ед.',note:'Два уровня, алгоритм slice-and-dice. Площадь пропорциональна величине; можно раскрыть ветвь.'},
 {id:'sankey',title:'Потоки между этапами',family:'Потоки',tags:'sankey flow санки потоки связи',unit:'ед.',note:'Двухэтапный Sankey: ширина ленты пропорциональна потоку. Суммы входов и выходов равны.'},
 {id:'geo',title:'Схематическая хороплетная карта',family:'География',tags:'choropleth geography карта регионы география',unit:'%',note:'Авторская условная география из шести областей; не реальные территории, границы или статистика.'},
 {id:'bullet',title:'Цель и история показателя',family:'Мониторинг',tags:'bullet sparkline KPI target цель спарклайн',unit:'%',note:'Bullet со шкалой 0–100, целью 70 и историей из восьми учебных периодов.'},
 {id:'control',title:'Контрольные границы',family:'Мониторинг',tags:'control chart limits мониторинг контрольные границы',unit:'ед.',note:'Учебные фиксированные границы 35/65 и центр 50; это не статистически оценённые нормативы процесса.'}
];
const totals=[[42,28,18,12],[25,35,30,10]];
const groups=[[[30,50],[45,35],[60,70],[55,40]],[[40,65],[55,30],[70,80],[40,55]]];
const histograms=[[1,2,2,3,4,4,5,5,6,6,7,8,8,9,10,11,11,12,13,14,14,15,16,16],[0,1,2,3,4,7,7,8,8,8,9,9,10,10,10,11,12,12,13,13,14,15,15,16]];
const scatterSets=[[[1,25,0],[2,36,0],[4,55,0],[6,62,0],[3,20,1],[5,45,1],[7,70,1],[9,88,1]],[[1,35,0],[3,42,0],[5,58,0],[7,80,0],[2,18,1],[4,55,1],[6,65,1],[9,72,1]]];
const flows=[[[20,10,10],[5,25,10],[15,5,20]],[[10,20,20],[10,15,5],[20,10,10]]];
const histories=[[35,40,38,50,52,58,61,64],[45,48,55,60,58,68,75,82]];
const controlSets=[[48,52,50,47,51,49,53,50],[48,52,72,47,28,49,53,50]];
function axes({x0=58,x1=520,y0=238,y1=42,max=100,step=25,unit='ед.'}={}){
 let s='';for(let v=0;v<=max;v+=step){const y=y0-(y0-y1)*v/max;s+=line(x0,y,x1,y)+text(x0-10,y+5,fmt(v),'end')}
 return s+line(x0,y0,x1,y0,'uid-axis')+text(x0,23,unit);
}
function tableHTML(headers,rows,caption){return `<div class="uid-table-scroll" tabindex="0" role="region" aria-label="${e(caption)}"><table class="uid-table"><caption>${e(caption)}</caption><thead><tr>${headers.map(h=>`<th scope="col">${e(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((v,i)=>i?`<td>${e(v)}</td>`:`<th scope="row">${e(v)}</th>`).join('')}</tr>`).join('')}</tbody></table></div>`}
function legend(items){return `<ul class="uid-legend" aria-label="Легенда">${items.map((label,i)=>`<li><span class="uid-key ${colors[i%4]}" aria-hidden="true"></span>${e(label)}</li>`).join('')}</ul>`}
export function renderDataChart(id,options={}){
 const def=chartDefinitions.find(d=>d.id===id);if(!def)throw new Error(`Unknown chart ${id}`);
 const set=options.dataset===1?1:0, labels=options.labels!==false, active=Array.isArray(options.series)?options.series:[0,1];
 const value=(x,y,v,anchor='middle')=>labels?text(x,y,fmt(v),anchor,'uid-value'):'';
 let shapes='',headers=[],rows=[],summary='',extra='',keys=[],dataCount=0;
 if(id==='bar'){
  let data=names.map((name,i)=>({name,value:totals[set][i],index:i}));if(options.sort==='descending')data.sort((a,b)=>b.value-a.value);if(options.sort==='ascending')data.sort((a,b)=>a.value-b.value);
  for(let tick=0;tick<=50;tick+=10){let x=100+tick*8;shapes+=line(x,35,x,245)+text(x,266,tick,'middle')}
  data.forEach((d,i)=>{const y=47+i*49;shapes+=text(88,y+21,d.name,'end')+rect(100,y,d.value*8,30,colors[d.index])+value(108+d.value*8,y+21,d.value,'start')});
  shapes+=text(500,287,'ед.','end');headers=['Материал','Количество, ед.'];rows=data.map(d=>[d.name,d.value]);summary=`Сумма ${totals[set].reduce((a,b)=>a+b,0)} ед. ${options.sort==='descending'?'Сначала большие значения.':options.sort==='ascending'?'Сначала меньшие значения.':'Исходный порядок.'}`;keys=names;
 }else if(id==='grouped'||id==='stacked'){
  const data=groups[set];keys=def.series;headers=['Материал',...active.map(i=>`${keys[i]}, ед.`),...(id==='stacked'?active.map(i=>`${keys[i]}, %`):[])];
  if(id==='grouped'){
   shapes=axes();data.forEach((d,i)=>{const base=90+i*112;active.forEach((s,j)=>{const x=base+j*28,h=d[s]*1.96;shapes+=rect(x,238-h,24,h,s?'uid-series-b':'uid-c0')+value(x+12,232-h,d[s])});shapes+=text(base+26,264,names[i],'middle')});
  }else{
   for(let t=0;t<=100;t+=25)shapes+=line(100+t*4,35,100+t*4,245)+text(100+t*4,267,`${t}%`,'middle');
   data.forEach((d,i)=>{const total=active.reduce((a,s)=>a+d[s],0);let x=100;shapes+=text(88,68+i*49,names[i],'end');active.forEach(s=>{const pct=total?d[s]/total*100:0,w=pct*4;shapes+=rect(x,47+i*49,w,30,s?'uid-series-b':'uid-c0')+value(x+w/2,68+i*49,pct);x+=w})});
  }
  rows=data.map((d,i)=>{const total=active.reduce((a,s)=>a+d[s],0);return[names[i],...active.map(s=>d[s]),...(id==='stacked'?active.map(s=>fmt(total?d[s]/total*100:0)):[])]});summary=active.length?`Показаны серии: ${active.map(i=>keys[i]).join(', ')}.${id==='stacked'?' Сумма каждой строки — 100% выбранных серий.':''}`:'Все серии скрыты. Включите серию в легенде.';
 }else if(id==='line'){
  const data=set?[[32,48,55,61,65,72],[28,41,49,null,59,67]]:[[30,36,48,56,60,68],[24,32,null,47,55,64]];
  const x=i=>62+i*89,y=v=>238-v*1.96;shapes=axes();keys=def.series;
  active.forEach(s=>{shapes+=path(seriesPath(data[s],x,y),`uid-line uid-s${s}${s?' uid-dashed':''}`);data[s].forEach((v,i)=>{if(v!=null)shapes+=point(x(i),y(v),colors[s],4)+value(x(i),y(v)+(s?21:-10),v);else shapes+=text(x(i),270,'нет','middle','uid-muted-svg')})});
  for(let i=0;i<6;i++)shapes+=text(x(i),290,['Май','Июн','Июл','Авг','Сен','Окт'][i],'middle');
  headers=['Месяц',...active.map(s=>`${keys[s]}, ед.`)];rows=data[0].map((_,i)=>[['Май','Июнь','Июль','Август','Сентябрь','Октябрь'][i],...active.map(s=>fmt(data[s][i]))]);summary=active.length?'Шкала 0–100 ед.; пропуск показан разрывом. Май—октябрь, учебный период.':'Все серии скрыты. Включите серию в легенде.';
 }else if(id==='histogram'){
  const raw=histograms[set],width=[2,4,8].includes(Number(options.bin))?Number(options.bin):4,bins=Array.from({length:16/width},(_,i)=>({lo:i*width,hi:(i+1)*width,count:0}));raw.forEach(v=>bins[Math.min(bins.length-1,Math.floor(v/width))].count++);
  const max=24,x=i=>62+i*448/bins.length,w=448/bins.length;shapes=axes({max,step:6,unit:'наблюдений'});
  bins.forEach((b,i)=>{const h=b.count/max*196;shapes+=rect(x(i)+1,238-h,w-2,h)+value(x(i)+w/2,230-h,b.count)+text(x(i),263,b.lo,'middle')});shapes+=text(510,263,16,'middle')+text(510,289,'Длительность, мин','end');
  headers=['Интервал, мин','Наблюдений'];rows=bins.map((b,i)=>[`[${b.lo}; ${b.hi}${i===bins.length-1?']':')'}`,b.count]);summary=`${raw.length} наблюдения. Ширина интервала ${width} мин. Сумма частот ${bins.reduce((a,b)=>a+b.count,0)}.`;extra=`<p class="uid-raw">Исходные значения, мин: ${raw.join(', ')}.</p>`;keys=['Частота'];
 }else if(id==='scatter'){
  const data=scatterSets[set].map((d,i)=>({x:d[0],y:d[1],s:d[2],id:`P${i+1}`})).filter(d=>active.includes(d.s));shapes=axes({unit:'Баллы'});keys=def.series;
  for(let t=0;t<=10;t+=2)shapes+=text(58+t*46.2,264,t,'middle');shapes+=text(520,288,'Время, мин','end');
  data.forEach(d=>{let x=58+d.x*46.2,y=238-d.y*1.96;shapes+=d.s?`<path d="M${x} ${y-6}l6 6 -6 6 -6 -6Z" class="uid-c1"/>`:point(x,y);if(labels)shapes+=text(x+9,y-8,d.id)});
  headers=['Наблюдение','Команда','Время, мин','Баллы'];rows=data.map(d=>[d.id,keys[d.s],d.x,d.y]);summary=`${data.length} наблюдений. Круг — A; ромб — B. Значения доступны в таблице.`;
 }else if(id==='donut'){
  const data=totals[set],sum=data.reduce((a,b)=>a+b,0),r=85,c=2*Math.PI*r;let offset=0;keys=names;
  data.forEach((v,i)=>{const length=v/sum*c;shapes+=`<circle cx="280" cy="140" r="${r}" fill="none" class="uid-ring uid-s${i}" stroke-width="40" stroke-dasharray="${n(length)} ${n(c-length)}" stroke-dashoffset="${n(-offset)}" transform="rotate(-90 280 140)"/>`;offset+=length});
  shapes+=text(280,139,sum,'middle','uid-big-value')+text(280,164,'ед. всего','middle');if(labels)shapes+=text(280,280,data.map((v,i)=>`${names[i]} ${fmt(v/sum*100)}%`).join(' · '),'middle');
  headers=['Материал','Количество, ед.','Доля, %'];rows=data.map((v,i)=>[names[i],v,fmt(v/sum*100)]);summary=`Всего ${sum} ед. Четыре доли образуют 100%.`;
 }else if(id==='treemap'){
  const data=totals[set],branch=['all','core','optic'].includes(options.branch)?options.branch:'all',groupsTree=[{name:'Базовые',ids:[0,1]},{name:'Оптические',ids:[2,3]}],visible=branch==='all'?groupsTree:[groupsTree[branch==='core'?0:1]],sum=visible.flatMap(g=>g.ids).reduce((a,i)=>a+data[i],0);let x=55;
  visible.forEach(g=>{const subtotal=g.ids.reduce((a,i)=>a+data[i],0),w=450*subtotal/sum;let y=42;g.ids.forEach(i=>{const h=190*data[i]/subtotal;shapes+=rect(x,y,w,h,`${colors[i]} uid-map-cell`)+text(x+w/2,y+h/2,names[i],'middle','uid-cell-label');if(labels)shapes+=text(x+w/2,y+h/2+20,`${data[i]} ед.`,'middle','uid-cell-label');y+=h});shapes+=text(x+w/2,263,g.name,'middle');x+=w});
  headers=['Ветвь','Материал','Количество, ед.'];rows=visible.flatMap(g=>g.ids.map(i=>[g.name,names[i],data[i]]));summary=`${branch==='all'?'Вся иерархия':visible[0].name}: ${sum} ед. Площади пропорциональны долям выбранной ветви.`;keys=names;
 }else if(id==='sankey'){
  const matrix=flows[set],source=['Прямой','Поиск','Письмо'],target=['Обзор','Пример','Экспорт'],left=matrix.map(a=>a.reduce((s,v)=>s+v,0)),right=matrix[0].map((_,j)=>matrix.reduce((s,r)=>s+r[j],0)),total=left.reduce((a,b)=>a+b,0),k=174/total;
  const positions=values=>{let y=45;return values.map(v=>{const start=y;y+=v*k+18;return start})},ys=positions(left),yt=positions(right),from=[...ys],to=[...yt];
  matrix.forEach((r,i)=>r.forEach((v,j)=>{const h=v*k,a=from[i],b=to[j];shapes+=`<path d="M148 ${n(a)} C240 ${n(a)},320 ${n(b)},412 ${n(b)} L412 ${n(b+h)} C320 ${n(b+h)},240 ${n(a+h)},148 ${n(a+h)}Z" class="${colors[i]} uid-flow"/>`;from[i]+=h;to[j]+=h}));
  left.forEach((v,i)=>{shapes+=rect(132,ys[i],16,v*k,colors[i])+text(122,ys[i]+v*k/2+5,source[i],'end');if(labels)shapes+=text(122,ys[i]+v*k/2+22,v,'end')});right.forEach((v,j)=>{shapes+=rect(412,yt[j],16,v*k,'uid-node')+text(438,yt[j]+v*k/2+5,target[j]);if(labels)shapes+=text(438,yt[j]+v*k/2+22,v)});
  headers=['Источник','Назначение','Поток, ед.'];rows=matrix.flatMap((r,i)=>r.map((v,j)=>[source[i],target[j],v]));summary=`Вход = выход = ${total} ед. Толщина каждого потока использует общий масштаб.`;keys=source;
 }else if(id==='geo'){
  const data=set?[30,70,55,15,90,45]:[65,35,80,20,55,95],polygons=['85,45 210,45 220,135 75,145','210,45 350,35 360,125 220,135','350,35 480,60 490,145 360,125','75,145 220,135 205,240 90,225','220,135 360,125 350,240 205,240','360,125 490,145 470,235 350,240'],centers=[[145,90],[285,85],[420,90],[145,185],[280,185],[420,185]];
  data.forEach((v,i)=>{shapes+=`<polygon points="${polygons[i]}" class="uid-map-${Math.min(3,Math.floor(v/25))} uid-map-cell"/>`+text(...centers[i],`R${i+1}`,'middle','uid-cell-label');if(labels)shapes+=text(centers[i][0],centers[i][1]+20,`${v}%`,'middle','uid-cell-label')});
  headers=['Условная область','Доля, %'];rows=data.map((v,i)=>[`R${i+1}`,v]);summary='Шесть вымышленных областей; цвет кодирует процент, не площадь региона. Границы шкалы 0 / 25 / 50 / 75 / 100%.';
  extra='<ul class="uid-legend" aria-label="Легенда долей">'+['0–<25%','25–<50%','50–<75%','75–100%'].map((s,i)=>`<li><span class="uid-key uid-map-${i}" aria-hidden="true"></span>${s}</li>`).join('')+'</ul>';
 }else if(id==='bullet'){
  const data=histories[set],last=data.at(-1);shapes=rect(60,65,180,45,'uid-band-a')+rect(240,65,135,45,'uid-band-b')+rect(375,65,135,45,'uid-band-c')+rect(60,78,last*4.5,20)+line(375,55,375,121,'uid-target');
  [0,40,70,100].forEach(v=>{shapes+=text(60+v*4.5,144,`${v}%`,'middle')});shapes+=text(60,38,'Факт / цель 70%')+value(510,38,last,'end');
  const x=i=>60+i*450/7,y=v=>263-(v/100)*90;shapes+=path(seriesPath(data,x,y))+data.map((v,i)=>point(x(i),y(v),colors[0],3)).join('')+text(60,290,'История · периоды 1–8 · шкала 0–100%');
  headers=['Период','Значение, %','Цель, %'];rows=data.map((v,i)=>[i+1,v,70]);summary=`Последнее значение ${last}%. Цель 70%. ${last>=70?'Цель достигнута.':`До цели ${70-last} п. п.`}`;keys=['Факт'];
 }else if(id==='control'){
  const data=controlSets[set],x=i=>62+i*445/7,y=v=>238-v*1.96;shapes=axes();[35,50,65].forEach(v=>{shapes+=line(58,y(v),520,y(v),v===50?'uid-target':'uid-limit')});shapes+=path(seriesPath(data,x,y));
  data.forEach((v,i)=>{const outside=v<35||v>65;shapes+=outside?`<path d="M${x(i)} ${y(v)-7}l7 7 -7 7 -7 -7Z" class="uid-alert"/>`:point(x(i),y(v),colors[0],4);shapes+=value(x(i),y(v)-12,v)+text(x(i),267,i+1,'middle')});shapes+=text(520,290,'Номер наблюдения','end');
  headers=['Наблюдение','Значение, ед.','Статус'];rows=data.map((v,i)=>[i+1,v,v<35?'Ниже LCL':v>65?'Выше UCL':'Внутри границ']);summary=`${data.filter(v=>v<35||v>65).length} из ${data.length} точек вне учебных границ. Ромб обозначает выход.`;keys=['Значение'];extra='<ul class="uid-legend uid-bounds" aria-label="Учебные контрольные границы"><li><span class="uid-line-key uid-center-key" aria-hidden="true"></span>Центр 50 ед.</li><li><span class="uid-line-key uid-limit-key" aria-hidden="true"></span>LCL 35 / UCL 65 ед.</li></ul>';
 }
 dataCount=rows.length;
 const patternId=`uid-${id}-hatch`;
 const svg=`<svg class="uid-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 310" role="img" aria-labelledby="uid-${id}-svg-title uid-${id}-svg-desc"><title id="uid-${id}-svg-title">${e(def.title)}. Набор ${set?'B':'A'}.</title><desc id="uid-${id}-svg-desc">${e(summary)} Значения приведены в таблице после графика.</desc><defs><pattern id="${patternId}" patternUnits="userSpaceOnUse" width="8" height="8"><rect width="8" height="8" class="uid-c1"/><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" class="uid-hatch"/></pattern></defs><g style="--uid-series-pattern:url(#${patternId})">${shapes}</g></svg>`;
 return {svg,summary,rows,headers,dataCount,html:`<div class="uid-chart-plot" tabindex="0" role="region" aria-label="${e(def.title)} — прокручиваемый график">${svg}</div><p class="uid-plot-hint">На узком экране график прокручивается; точные значения — в таблице ниже.</p>${keys.length?legend(keys):''}<p class="uid-chart-summary">${e(summary)}</p>${extra}<details class="uid-values"><summary>Таблица значений · ${dataCount} строк</summary>${tableHTML(headers,rows,`${def.title} — набор ${set?'B':'A'}, демоданные`)}</details>`};
}
export function chartSpecimenHTML(def){
 const series=def.series?`<fieldset class="uid-series"><legend>Серии</legend>${def.series.map((s,i)=>`<label><input type="checkbox" data-uid-series="${i}" checked disabled> ${e(s)}</label>`).join('')}</fieldset>`:'';
 const special=def.id==='bar'?'<label class="ui-label">Порядок<select class="ui-field" data-uid-sort disabled><option value="original">Исходный</option><option value="descending">По убыванию</option><option value="ascending">По возрастанию</option></select></label>':def.id==='histogram'?'<label class="ui-label">Интервал<select class="ui-field" data-uid-bin disabled><option value="2">2 мин</option><option value="4" selected>4 мин</option><option value="8">8 мин</option></select></label>':def.id==='treemap'?'<label class="ui-label">Ветвь<select class="ui-field" data-uid-branch disabled><option value="all">Вся иерархия</option><option value="core">Базовые</option><option value="optic">Оптические</option></select></label>':'';
 return `<div class="uid-chart" data-uid-chart="${def.id}"><p class="uid-kicker">${e(def.family)} / ${e(def.unit)} / демоданные</p><div class="uid-toolbar"><label class="ui-label">Набор данных<select class="ui-field" data-uid-dataset disabled><option value="0">Набор A</option><option value="1">Набор B</option></select></label>${special}<label class="uid-check"><input type="checkbox" data-uid-labels checked disabled> Значения на графике</label><button class="ui-btn" type="button" data-uid-reset disabled>Сбросить</button></div>${series}<div data-uid-chart-output>${renderDataChart(def.id).html}</div><p class="ui-muted uid-chart-note">${e(def.note)}</p><output class="ui-result" data-uid-status aria-live="polite">Набор A · учебный пример</output></div>`;
}
export const inventoryRows=[{id:'a',name:'Frost',value:24,status:'Черновик'},{id:'b',name:'Smoke',value:18,status:'Готово'},{id:'c',name:'Prism',value:36,status:'Черновик'},{id:'d',name:'Solid',value:0,status:'Готово'},{id:'e',name:'Aurora',value:12,status:'Черновик'},{id:'f',name:'Clear',value:28,status:'Готово'}];
export function inventoryBody(rows,selected=new Set()){return rows.length?rows.map(r=>`<tr data-uid-row="${r.id}"><td><input type="checkbox" data-uid-select="${r.id}" aria-label="Выбрать ${e(r.name)}"${selected.has(r.id)?' checked':''}></td><th scope="row">${e(r.name)}</th><td>${r.value}</td><td>${e(r.status)}</td></tr>`).join(''):'<tr><td colspan="4">Совпадений нет. Очистите фильтр.</td></tr>'}
export function initData(root,api){
 const listeners=[],animations=new Set();const on=(el,event,fn)=>{el?.addEventListener(event,fn);if(el)listeners.push(()=>el.removeEventListener(event,fn))};
 function pulse(el){if(!el)return;for(const a of el.getAnimations?.()||[])a.cancel();const a=api.animate(el,[{backgroundColor:'var(--uid-update)'},{backgroundColor:'transparent'}],{duration:240});if(a){animations.add(a);a.finished?.then(()=>animations.delete(a)).catch(()=>animations.delete(a))}}
 root.querySelectorAll('[data-uid-chart]').forEach(card=>{
  const output=card.querySelector('[data-uid-chart-output]'),status=card.querySelector('[data-uid-status]');
  card.querySelectorAll('input,select,button').forEach(c=>c.disabled=false);
  const update=()=>{const opened=output.querySelector('details')?.open;const result=renderDataChart(card.dataset.uidChart,{dataset:Number(card.querySelector('[data-uid-dataset]').value),labels:card.querySelector('[data-uid-labels]').checked,series:[...card.querySelectorAll('[data-uid-series]:checked')].map(c=>Number(c.dataset.uidSeries)),sort:card.querySelector('[data-uid-sort]')?.value,bin:Number(card.querySelector('[data-uid-bin]')?.value),branch:card.querySelector('[data-uid-branch]')?.value});output.innerHTML=result.html;if(opened)output.querySelector('details').open=true;status.textContent=`Набор ${card.querySelector('[data-uid-dataset]').value==='1'?'B':'A'} · ${result.summary}`;pulse(card.querySelector('.uid-chart-summary'))};
  on(card,'change',event=>{if(event.target.matches('input,select'))update()});
  on(card.querySelector('[data-uid-reset]'),'click',()=>{card.querySelector('[data-uid-dataset]').value='0';card.querySelector('[data-uid-labels]').checked=true;card.querySelectorAll('[data-uid-series]').forEach(c=>c.checked=true);const sort=card.querySelector('[data-uid-sort]'),bin=card.querySelector('[data-uid-bin]'),branch=card.querySelector('[data-uid-branch]');if(sort)sort.value='original';if(bin)bin.value='4';if(branch)branch.value='all';update()});
 });
 const table=root.querySelector('[data-uid-inventory]');if(table){
  let data=inventoryRows.map(r=>({...r})),sort='name',direction=1;const selected=new Set(),search=table.querySelector('[data-uid-search]'),body=table.querySelector('tbody'),all=table.querySelector('[data-uid-select-all]'),status=table.querySelector('[data-uid-table-status]'),bulk=table.querySelector('[data-uid-bulk]');
  table.querySelectorAll('[disabled]').forEach(c=>c.disabled=false);
  const visible=()=>data.filter(r=>`${r.name} ${r.status}`.toLocaleLowerCase('ru').includes(search.value.trim().toLocaleLowerCase('ru'))).sort((a,b)=>direction*(sort==='value'?a.value-b.value:a.name.localeCompare(b.name,'ru')));
  function sync(){const rows=visible(),count=rows.filter(r=>selected.has(r.id)).length;all.checked=rows.length>0&&count===rows.length;all.indeterminate=count>0&&count<rows.length;all.disabled=rows.length===0;bulk.disabled=selected.size===0;status.textContent=`Показано ${rows.length} из ${data.length} · выбрано ${selected.size}`}
  function render(){body.innerHTML=inventoryBody(visible(),selected);table.querySelectorAll('[data-uid-sort-table]').forEach(b=>{b.closest('th').setAttribute('aria-sort',b.dataset.uidSortTable===sort?(direction===1?'ascending':'descending'):'none');b.querySelector('span').textContent=b.dataset.uidSortTable===sort?(direction===1?' ↑':' ↓'):''});sync()}
  on(search,'input',render);on(table,'change',event=>{const c=event.target;if(c.matches('[data-uid-select]')){c.checked?selected.add(c.dataset.uidSelect):selected.delete(c.dataset.uidSelect);sync()}if(c===all){visible().forEach(r=>all.checked?selected.add(r.id):selected.delete(r.id));render();all.focus()}});
  on(table,'click',event=>{const b=event.target.closest('[data-uid-sort-table]');if(b){direction=sort===b.dataset.uidSortTable?-direction:1;sort=b.dataset.uidSortTable;render();pulse(body)}});
  on(bulk,'click',()=>{data.forEach(r=>{if(selected.has(r.id))r.status='Готово'});render();status.textContent+=` · отмечено готовыми ${selected.size}`;api.announce(`Готово: ${selected.size} учебных материалов`);pulse(body)});
  on(table.querySelector('[data-uid-table-reset]'),'click',()=>{data=inventoryRows.map(r=>({...r}));selected.clear();search.value='';sort='name';direction=1;render()});render();
 }
 root.querySelectorAll('[data-uid-expand-all]').forEach(button=>{button.disabled=false;on(button,'click',()=>{const box=button.closest('[data-uid-expandable]'),next=button.getAttribute('aria-pressed')!=='true';box.querySelectorAll('details').forEach(d=>d.open=next);button.setAttribute('aria-pressed',String(next));button.textContent=next?'Свернуть строки':'Раскрыть строки';api.announce(next?'Раскрыты все строки':'Строки свёрнуты')})});
 root.querySelectorAll('[data-uid-inline-row]').forEach(row=>{
  const input=row.querySelector('input'),edit=row.querySelector('[data-uid-edit]'),cancel=row.querySelector('[data-uid-cancel]'),out=row.closest('[data-uid-inline]').querySelector('[data-uid-inline-status]');let previous=input.value;edit.disabled=false;cancel.disabled=false;
  function close(save){if(save){if(!input.checkValidity()){input.setAttribute('aria-invalid','true');out.textContent='Введите целое количество от 0 до 99.';input.reportValidity();return false}previous=input.value;row.querySelector('[data-uid-cost]').textContent=String(Number(input.value)*5);out.textContent=`${row.dataset.uidInlineRow}: сохранено ${input.value} ед.; ${Number(input.value)*5} условных баллов.`;pulse(row)}else{input.value=previous;out.textContent='Изменение отменено.'}input.removeAttribute('aria-invalid');input.readOnly=true;edit.textContent='Изменить';edit.setAttribute('aria-expanded','false');cancel.hidden=true;edit.focus();return true}
  on(edit,'click',()=>{if(input.readOnly){input.readOnly=false;previous=input.value;edit.textContent='Сохранить';edit.setAttribute('aria-expanded','true');cancel.hidden=false;input.focus();input.select()}else close(true)});on(cancel,'click',()=>close(false));on(input,'keydown',event=>{if(event.key==='Escape'&&!input.readOnly){event.preventDefault();close(false)}if(event.key==='Enter'&&!input.readOnly){event.preventDefault();close(true)}});
 });
 return()=>{listeners.forEach(fn=>fn());animations.forEach(a=>a.cancel());animations.clear()};
}
