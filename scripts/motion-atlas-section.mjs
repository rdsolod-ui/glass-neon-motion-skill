const esc=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export const motionGroups=[
 ['feedback','Обратная связь','Действие получает понятный ответ.'],['presence','Вход и выход','Появление объясняет иерархию.'],['layout','Перестройка','Сохраняем положение и контекст.'],['navigation','Навигация','Показываем выбранное направление.'],['scroll','Прокрутка','Движение связано с чтением.'],['type','Типографика','Слова сохраняют смысл и целостность.'],['vector','SVG и траектории','Линия становится рассказом.'],['data','Данные','Изменение видно, число остаётся доступным.'],['loading','Ожидание','Конечные этюды состояний загрузки.'],['gesture','Жесты','Прямое управление и его альтернативы.'],['optics','Свет и стекло','Материал раскрывается движением света.'],['depth','Объём','Слои показывают расстояние.'],['sequence','Хореография','Несколько действий в одном ритме.']
];
// Original specimens. Durations are design choices, not universal performance targets.
export const motionExamples=[
 ['press','feedback','Тактильное нажатие','Подтверждает контакт, не смещая соседей.','button · :active',220,'transform','Нажатие кнопки'],
 ['check','feedback','Подтверждение','Рисует понятный знак завершения.','input checkbox · status',540,'stroke-dashoffset','Успешное действие'],
 ['error','feedback','Мягкая коррекция','Короткое отклонение привлекает внимание к ошибке.','input · aria-invalid',360,'transform','Ошибка валидации'],
 ['rise','presence','Вход с подъёмом','Связывает новый слой с точкой появления.','dialog · popover',480,'transform + opacity','Открытие слоя'],
 ['exit','presence','Выход и возврат','Показывает уход без внезапного обрыва.','toast · dialog',1100,'transform + opacity','Закрытие; здесь полный цикл'],
 ['mask','presence','Раскрытие окна','Открывает композицию от опорной стороны.','figure · section',720,'clip-path','Первое появление'],
 ['reorder','layout','Смена порядка','Сохраняет идентичность элементов при сортировке.','ol · li',800,'transform','Сортировка; схема перестановки'],
 ['expand','layout','Раскрытие содержимого','Поясняет связь заголовка и дополнительных строк.','details · summary',650,'transform + opacity','Раскрытие; визуальная схема'],
 ['shared','layout','Общий элемент','Один объект связывает компактное и подробное состояние.','article · dialog',1000,'transform + border-radius','Переход карточка → деталь; схема'],
 ['tab','navigation','Активный раздел','Сдвигает индикатор к новому выбору.','tablist · button',600,'transform','Переключение вкладки; схема'],
 ['breadcrumb','navigation','Путь назад','Последовательно восстанавливает контекст.','nav · ol · a',900,'transform + opacity','Переход по иерархии'],
 ['drawer','navigation','Боковая панель','Показывает направление появления меню.','nav · dialog',650,'transform','Открытие панели; схема'],
 ['scroll-progress','scroll','Прогресс чтения','Настоящая прокрутка внутри образца управляет шкалой.','article · progress',0,'scrollTop → scaleX','Колесо, touch, клавиши; live'],
 ['parallax','scroll','Разная скорость слоёв','Разделяет ближний и дальний планы.','figure · decorative layers',1600,'transform','Сценарий прокрутки моделируется replay'],
 ['sticky','scroll','Закрепление раздела','Иллюстрирует остановку заголовка при движении текста.','section · heading',1500,'transform','Сценарий sticky моделируется replay'],
 ['words','type','Последовательность слов','Ведёт взгляд по фразе без разбивки графем.','h2 · span',1000,'transform + opacity','Первое появление заголовка'],
 ['underline','type','Смысловое подчёркивание','Выделяет одну важную часть фразы.','a · strong',750,'transform','Выбор или фокус; схема'],
 ['replace','type','Смена подписи','Сохраняет место при замене короткого сообщения.','output · status',1000,'transform + opacity','Изменение подписи; схема'],
 ['path','vector','Рисование маршрута','Последовательно открывает связь между точками.','svg · path',1200,'stroke-dashoffset','Раскрытие схемы'],
 ['orbit','vector','Движение по пути','Проводит маркер по конечной траектории.','svg · circle',1500,'transform','Объяснение направления'],
 ['morph','vector','Изменение силуэта','Связывает два состояния простой формы.','svg · rect',900,'transform + rx','Смена состояния; CSS/WAAPI'],
 ['bars','data','Рост столбцов','Делает соотношение величин видимым.','figure · figcaption',1000,'transform','Обновление данных'],
 ['number','data','Роллер числа','Сохраняет позицию цифр при изменении значения.','output · data',900,'transform','Изменение показателя; демоданные'],
 ['ring','data','Кольцевая шкала','Выделяет завершённую долю.','svg · progress',1100,'stroke-dashoffset','Обновление прогресса'],
 ['skeleton','loading','Скелет → содержание','Меняет ожидание на готовые строки без сдвига.','article · aria-busy',1400,'opacity','Завершение загрузки; схема'],
 ['dots','loading','Ритм ожидания','Даёт короткий сигнал активного процесса.','status · span',1400,'transform + opacity','Один конечный цикл'],
 ['progress','loading','Определённый прогресс','Показывает завершение измеряемой операции.','progress · output',1700,'transform','Демонстрационный прогресс'],
 ['drag','gesture','Прямое перетаскивание','Настоящий горизонтальный slider: pointer и клавиатура.','slider · input range',0,'pointer → translateX','Тянуть; ← → Home End; live'],
 ['snap','gesture','Возврат к позиции','Поясняет выбор ближайшего устойчивого состояния.','carousel · list',1100,'transform','Отпускание; replay траектории'],
 ['swipe','gesture','Смахивание карточки','Показывает направление завершения действия.','article · list',1200,'transform + opacity','Смахивание; replay траектории'],
 ['light','optics','Блик на 3D-кромке','Локальный свет показывает толщину без общего outline.','3D glass surface',1400,'transform + opacity','Короткое световое раскрытие'],
 ['diffusion','optics','Цвет за 2D-плёнкой','Объект меняет положение за матовой поверхностью.','2D glass surface',1800,'transform','Материальный этюд'],
 ['prism','optics','Разделение спектра','Два цветных отсвета отделяются у края.','3D optical accent',1300,'transform + opacity','Акцент материала'],
 ['tilt','depth','Наклон плоскости','Небольшой поворот объясняет ориентацию поверхности.','article · figure',1400,'transform','Replay пространственного наклона'],
 ['stack','depth','Разбор слоёв','Разводит перекрывающиеся плоскости по глубине.','layered UI',1500,'transform','Объяснение структуры'],
 ['focus','depth','Смена переднего плана','Переводит внимание между слоями без анимации blur.','figure · layered UI',1200,'transform + opacity','Выбор приоритетного слоя'],
 ['stagger','sequence','Каскад карточек','Обозначает порядок нескольких равнозначных объектов.','ul · li',1100,'transform + opacity','Открытие группы'],
 ['flow','sequence','Процесс по шагам','Передаёт импульс от одного этапа к следующему.','ol · progress',1600,'transform + opacity','Объяснение процесса'],
 ['hero','sequence','Сборка композиции','Соединяет материал, заголовок и действие.','section · h1 · button',1800,'transform + opacity','Однократное вступление']
].map(([id,group,title,purpose,html,duration,property,trigger])=>({id,group,title,purpose,html,duration,property,trigger}));
const panel=(content,cls='')=>`<div class="ma-pane ${cls}">${content}</div>`;
const lines='<i class="ma-line"></i><i class="ma-line"></i><i class="ma-line ma-short"></i>';
const cells='<span class="ma-cell ma-a">01</span><span class="ma-cell ma-b">02</span><span class="ma-cell ma-c">03</span>';
function specimen(id){switch(id){
 case 'press':return '<span class="ma-press ma-target">Готово <b>↗</b></span>';
 case 'check':return panel('<svg viewBox="0 0 100 60" class="ma-check"><path class="ma-target" pathLength="1" d="M24 30 43 46 78 12"/></svg><span>Сохранено</span>');
 case 'error':return panel('<span class="ma-field ma-target">email@</span><small>Укажите полный адрес</small>');
 case 'rise':return panel('<strong>Новый слой</strong>'+lines,'ma-target');
 case 'exit':return panel('<span class="ma-dot"></span><strong>Готово к работе</strong>','ma-target ma-row');
 case 'mask':return '<div class="ma-window ma-target"><span class="ma-disc"></span><b>Открытие.</b></div>';
 case 'reorder':return '<div class="ma-cells">'+cells+'</div>';
 case 'expand':return panel('<b>Подробнее <span>−</span></b><div class="ma-target ma-expand">'+lines+'</div>');
 case 'shared':return '<div class="ma-shared ma-target"><span class="ma-dot"></span><b>L</b></div>';
 case 'tab':return panel('<div class="ma-tabs"><span>Обзор</span><span>Слои</span><span>Свет</span><i class="ma-target"></i></div>');
 case 'breadcrumb':return '<div class="ma-crumb"><span>Атлас</span><i>›</i><span class="ma-a">Стекло</span><i>›</i><strong class="ma-b">3D</strong></div>';
 case 'drawer':return '<div class="ma-shell">'+lines+panel('<b>Меню</b>'+lines,'ma-target ma-drawer')+'</div>';
 case 'scroll-progress':return '<div class="ma-scroll-wrap"><div class="ma-track" role="progressbar" aria-label="Прогресс чтения образца" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i class="ma-scroll-fill"></i></div><div class="ma-scroll" tabindex="0" role="region" aria-label="Образец прокрутки: используйте колесо, касание или клавиши"><p>01 / Начало</p><p>Прокрутите этот<br>небольшой текст.</p><p>Шкала следует<br>за чтением.</p><p>02 / Середина</p><p>Движением<br>управляете вы.</p><p>03 / Конец</p></div></div>';
 case 'parallax':return '<div class="ma-landscape"><span class="ma-disc ma-a"></span><div class="ma-mountain ma-b"></div>'+panel('Ближе к свету','ma-c')+'</div>';
 case 'sticky':return '<div class="ma-sticky-shell"><strong class="ma-a">Глава 02</strong><div class="ma-b">'+lines+lines+lines+'</div></div>';
 case 'words':return '<p class="ma-words"><span>Свет.</span> <span>Форма.</span> <span>Движение.</span></p>';
 case 'underline':return '<p class="ma-word">Больше <strong>смысла<i class="ma-target"></i></strong></p>';
 case 'replace':return '<div class="ma-replace"><span class="ma-a">В процессе</span><strong class="ma-b">Всё готово</strong></div>';
 case 'path':return '<svg viewBox="0 0 240 130" class="ma-svg"><path class="ma-route" d="M18 100 C55 100 40 24 93 32 S135 112 180 70 S200 28 225 28"/><path class="ma-target" pathLength="1" d="M18 100 C55 100 40 24 93 32 S135 112 180 70 S200 28 225 28"/></svg>';
 case 'orbit':return '<div class="ma-orbit"><span class="ma-target"><i></i></span><b>L</b></div>';
 case 'morph':return '<svg viewBox="0 0 240 130" class="ma-svg"><rect class="ma-target ma-shape" x="82" y="27" width="76" height="76" rx="32"/></svg>';
 case 'bars':return '<div class="ma-bars"><i style="--bar:42%"></i><i style="--bar:75%"></i><i style="--bar:56%"></i><i style="--bar:95%"></i></div>';
 case 'number':return '<div class="ma-metric"><span>Демо / показатель</span><div class="ma-number"><div class="ma-target"><b>128</b><b>256</b></div></div></div>';
 case 'ring':return '<svg viewBox="0 0 120 120" class="ma-ring"><circle class="ma-route" cx="60" cy="60" r="44"/><circle class="ma-target" pathLength="1" cx="60" cy="60" r="44"/><text x="60" y="65">75%</text></svg>';
 case 'skeleton':return panel('<div class="ma-skeleton ma-a">'+lines+'</div><div class="ma-content ma-b"><b>Материал готов</b><span>Новый слой добавлен</span></div>','ma-loading');
 case 'dots':return '<div class="ma-dots"><i></i><i></i><i></i></div>';
 case 'progress':return panel('<span>Загрузка образца</span><div class="ma-track"><i class="ma-target"></i></div><small>100% · демонстрация</small>');
 case 'drag':return '<div class="ma-drag-wrap"><div class="ma-drag-track"><span class="ma-drag-knob" role="slider" tabindex="-1" aria-disabled="true" aria-label="Положение стеклянного маркера" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-orientation="horizontal">↔</span></div><small>Тяните · ← → · Home / End</small></div>';
 case 'snap':return '<div class="ma-snap"><i></i><i></i><i></i><span class="ma-target">02</span></div>';
 case 'swipe':return '<div class="ma-swipe"><span>Действие завершено</span>'+panel('Карточка ↗','ma-target')+'</div>';
 case 'light':return panel('<strong>3D край</strong><span class="ma-shine ma-target"></span>','ma-glass-3d');
 case 'diffusion':return '<span class="ma-optic-disc ma-target"></span>'+panel('<strong>2D плёнка</strong>','ma-glass-2d');
 case 'prism':return '<div class="ma-prism"><span class="ma-a"></span><span class="ma-b"></span>'+panel('Призма','ma-glass-3d')+'</div>';
 case 'tilt':return panel('<span class="ma-label">DEPTH / 01</span><strong>Плоскость.</strong>','ma-target ma-glass-3d');
 case 'stack':return '<div class="ma-stack"><span class="ma-a"></span><span class="ma-b"></span><span class="ma-c">Слои</span></div>';
 case 'focus':return '<div class="ma-focus">'+panel('Дальний','ma-a')+panel('Ближний','ma-b ma-glass-3d')+'</div>';
 case 'stagger':return '<div class="ma-stagger">'+cells+'</div>';
 case 'flow':return '<div class="ma-flow"><span>Идея</span><i></i><span>Сборка</span><i></i><span>Готово</span></div>';
 case 'hero':return '<div class="ma-hero"><span class="ma-disc ma-a"></span><b class="ma-b">Свет<br>в движении.</b><span class="ma-press ma-c">Смотреть ↗</span></div>';
 default:throw new Error(`Missing motion specimen: ${id}`);
}}
export function motionAtlasSection(){return `<section class="section wrap ma-lab" id="motion-atlas" aria-labelledby="ma-title"><div class="section-head"><div><div class="eyebrow">Motion library / 13 направлений</div><h2 id="ma-title">Движение<br>со смыслом.</h2></div><div><p>39 авторских этюдов: от одного нажатия до композиции из нескольких слоёв. Прокрутка и slider работают напрямую. Остальные образцы показывают движение; они не заменяют готовые компоненты.</p><p class="small">Один активный образец. Без фоновых циклов. 2D-плёнка и 3D-кромка — разные материалы.</p></div></div><div class="ma-tools"><label for="ma-search">Найти движение<input type="search" id="ma-search" disabled placeholder="Например, SVG, кнопка или глубина" autocomplete="off"></label><label for="ma-group">Группа<select id="ma-group" disabled><option value="all">Все 13 групп</option>${motionGroups.map(([id,title])=>`<option value="${id}">${title}</option>`).join('')}</select></label><label class="ma-reduce-label"><input id="ma-reduce" type="checkbox" disabled>Без движения</label><button type="button" disabled class="btn" id="ma-stop">Остановить</button></div><div class="ma-summary"><span id="ma-count" role="status">39 образцов / 13 групп</span><span id="ma-status" role="status">Выберите образец</span></div><div class="ma-map" aria-label="Группы движения">${motionGroups.map(([id,title,note],i)=>`<a href="#ma-group-${id}" data-ma-jump="${id}"><span>${String(i+1).padStart(2,'0')}</span><strong>${title}</strong><small>${note}</small></a>`).join('')}</div><div class="ma-groups">${motionGroups.map(([group,title,note],i)=>`<section class="ma-group" id="ma-group-${group}" data-ma-group="${group}" aria-labelledby="ma-heading-${group}"><div class="ma-group-heading"><span>${String(i+1).padStart(2,'0')}</span><h3 id="ma-heading-${group}">${title}</h3><p>${note}</p></div><div class="ma-grid">${motionExamples.filter(m=>m.group===group).map(m=>`<article class="ma-card" data-ma-id="${m.id}" data-ma-search="${esc(m.title+' '+m.purpose+' '+m.html+' '+title)}"><div class="ma-stage ma-stage-${m.id}"${m.id==='drag'||m.id==='scroll-progress'?'':' aria-hidden="true"'}>${specimen(m.id)}</div><div class="ma-card-body"><span class="ma-kicker">${m.duration?'WAAPI · '+m.duration+' мс':'Прямое управление · live'}</span><h4>${m.title}</h4><p>${m.purpose}</p><button class="btn ma-play" type="button" disabled data-ma-play="${m.id}" aria-label="${m.id==='drag'?'Сбросить положение':m.id==='scroll-progress'?'Прокрутить образец':'Воспроизвести'}: ${esc(m.title)}">${m.id==='drag'?'В центр':m.id==='scroll-progress'?'Прокрутить ↓':'Воспроизвести ↗'}</button><details class="ma-recipe"><summary>Рецепт движения</summary><dl><dt>HTML / применение</dt><dd>${esc(m.html)}</dd><dt>Триггер в продукте</dt><dd>${esc(m.trigger)}</dd><dt>В образце</dt><dd>${m.duration?'Кнопка replay; визуальный сценарий, не полная логика компонента.':'Прямое взаимодействие; кнопка задаёт конечную позицию.'}</dd><dt>Владелец / свойства</dt><dd>${m.duration?'WAAPI':'DOM listener'} · ${m.property}</dd><dt>Ритм</dt><dd>${m.duration?m.duration+' мс; cubic-bezier(.22,1,.36,1); конечный этюд.':'Следует вводу пользователя, без инерции и autoplay.'}</dd><dt>Прерывание</dt><dd>Новый replay, фильтр, stop, уход с экрана, скрытие вкладки и смена reduced отменяют активный этюд.</dd><dt>Reduced substitute</dt><dd>Читаемый статичный кадр без opacity, stagger и перемещения. Прямой slider и шкала остаются функциональными.</dd><dt>Cleanup</dt><dd>Animation.cancel(), снятие pointer capture, остановка прокрутки; observer отключается на pagehide и возвращается на pageshow.</dd></dl></details></div></article>`).join('')}</div></section>`).join('')}</div><p class="ma-empty" hidden>Подходящих движений нет. Измените запрос или группу.</p><p class="ma-footnote">Примеры используют CSS, Web Animations API и нативные события. Физическая рефракция, полноценная spring-физика, scroll pinning и gesture recognizer не заявлены. <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element/animate" target="_blank" rel="noopener noreferrer">Web Animations API ↗</a></p><noscript><p>Все группы и статичные образцы видны. Для фильтров и replay нужен JavaScript.</p></noscript></section>`;}
