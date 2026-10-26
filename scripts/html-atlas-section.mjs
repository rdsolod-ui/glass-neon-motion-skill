// Original, build-time HTML specimens. No remote assets or runtime dependencies.
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="100" viewBox="0 0 240 100"><rect width="240" height="100" rx="18" fill="#15374b"/><circle cx="80" cy="50" r="34" fill="#a8ff62"/><rect x="95" y="22" width="110" height="58" rx="14" fill="#90eaff" fill-opacity=".55"/></svg>`;
const art = `data:image/svg+xml,${encodeURIComponent(svg)}`;
const image = `<img src="${art}" width="240" height="100" alt="Лаймовый круг за голубой стеклянной панелью">`;
const choices = '<option>Frost</option><option>Smoke</option><option>Liquid</option>';
const select = '<label>Материал<select>'+choices+'</select></label>';
const table = '<table><caption>Оптические слои</caption><colgroup><col class="ha-tint"><col></colgroup><thead><tr><th scope="col">Слой</th><th scope="col">Размытие</th></tr></thead><tbody><tr><th scope="row">Плёнка</th><td>14 px</td></tr></tbody><tfoot><tr><th scope="row">Режим</th><td>2D</td></tr></tfoot></table>';
const ruby = '<ruby>光<rp>(</rp><rt>свет</rt><rp>)</rp></ruby>';
const rows=[];
function add(group, tag, title, sample, note='', kind='Живой HTML') { rows.push({group,tag,title,sample,note,kind,id:'tag-'+tag}); }
function recipe(group, tag, title, code, note) { add(group,tag,title,code,note,'Рецепт'); }

// Stable primitives first. Source descriptions are original Russian implementation notes.
add('Управление','button','Кнопка действия','<button type="button" data-ha-action>Применить материал</button><output data-ha-feedback aria-live="polite"></output>','Клавиши Enter и Space. Текст объясняет действие; type задаётся явно.');
add('Управление','input','Однострочное поле','<label>Название материала<input type="text" placeholder="Например, Arctic" maxlength="60"></label>','Все 22 типа разобраны отдельно ниже. Placeholder не заменяет label.');
add('Управление','select','Нативный селектор',select,'Список и его клавиатура принадлежат браузеру. На телефоне интерфейс может отличаться.');
add('Управление','option','Вариант выбора','<label>Отделка<select><option value="matte">Матовая</option><option value="clear" selected>Прозрачная</option><option disabled>Недоступная</option></select></label>','value — данные; выбранное и недоступное состояния задаются явно.');
add('Управление','optgroup','Группа вариантов','<label>Семейство<select><optgroup label="2D плёнка"><option>Frost</option><option>Smoke</option></optgroup><optgroup label="3D край"><option>Liquid</option></optgroup></select></label>','Группа подписывается label; это не отдельное выбираемое значение.');
add('Управление','datalist','Поле с подсказками','<label>Акцент<input list="ha-colors" placeholder="Введите цвет"></label><datalist id="ha-colors"><option value="Лаймовый"><option value="Циановый"><option value="Розовый"></datalist>','Подсказки допускают произвольный ввод. Это не обязательный выбор из списка.');
add('Управление','textarea','Многострочный ввод','<label>Комментарий<textarea rows="3" placeholder="Опишите материал"></textarea></label>','Высота изменяется пользователем. Длинный текст переносится.');
add('Управление','label','Связь подписи с полем','<label for="ha-label-sample">Нажмите на эту подпись</label><input id="ha-label-sample" placeholder="Фокус перейдёт сюда">','Используйте вложение либо точную связь for/id.');
add('Управление','fieldset','Группа контролов','<fieldset><legend>Толщина стекла</legend><label><input type="radio" name="ha-thickness" checked> 2D плёнка</label><label><input type="radio" name="ha-thickness"> 3D край</label></fieldset>','Общий смысл группы передаётся через legend.');
add('Управление','legend','Название группы','<fieldset><legend>Экспортировать слои</legend><label><input type="checkbox" checked> Поверхность</label><label><input type="checkbox"> Блики</label></fieldset>','Подпись остаётся видимой, даже когда значение ещё не выбрано.');
add('Управление','form','Форма и проверка','<form data-ha-form method="dialog"><label>Демо-почта<input type="email" required placeholder="name@example.com"></label><button type="submit">Проверить</button><output data-ha-feedback aria-live="polite"></output></form>','Локальная демо-валидация. Данные не отправляются и не сохраняются.');
add('Управление','output','Вычисленное значение','<label>Диффузия<input id="ha-output-range" type="range" min="0" max="24" value="14" data-ha-output></label><output for="ha-output-range" data-ha-range-value>14 px</output>','Обновляется по input; связь output for сохраняет смысл результата.');
add('Управление','meter','Измеренная величина','<label>Заполнение слоя <meter min="0" max="100" low="25" high="80" optimum="60" value="62">62%</meter></label>','Известная шкала с границами. Это не процесс загрузки.');
add('Управление','progress','Ход задачи','<label>Подготовка образца <progress max="100" value="68">68%</progress></label><span>68 из 100 · статический пример</span>','Число — учебное состояние, а не текущая загрузка.');
recipe('Управление','selectedcontent','Настраиваемый select','<select>\n  <button><selectedcontent></selectedcontent></button>\n  <option>Frost</option>\n</select>','Есть в текущем стандарте, но поддержка отдельных возможностей ограничена. Нужны проверка браузера, appearance: base-select и обычный select как fallback.');

add('Раскрытие','details','Нативное раскрытие','<details><summary>Что делает стекло выразительным?</summary><p>Цвет под поверхностью, диффузия и локальный свет на 3D-краю.</p></details>','Клавиатура работает без JavaScript. Содержимое раскрывается без анимации высоты.');
add('Раскрытие','summary','Заголовок раскрытия','<details><summary>Показать свойства</summary><dl><dt>Материал</dt><dd>2D Frost</dd></dl></details>','Первый summary внутри details; не вкладывайте в него другие кнопки.');
add('Раскрытие','dialog','Модальный диалог','<button type="button" data-ha-dialog-open>Открыть диалог</button><dialog class="ha-modal" id="ha-native-dialog" aria-labelledby="ha-dialog-title"><h4 id="ha-dialog-title">Сохранить материал?</h4><p>Это локальный учебный диалог.</p><form method="dialog"><button value="cancel">Закрыть</button><button value="save">Готово</button></form></dialog>','showModal, Escape, возврат фокуса и блокировка фона. Без JS показан рецепт.');

add('Секции','header','Вступление секции','<header><small>ОПТИЧЕСКАЯ ЛАБОРАТОРИЯ</small><p><strong>Поверхности со светом</strong></p></header>','Содержательное вступление; материал не меняет семантику.');
add('Секции','nav','Навигация','<nav aria-label="Учебная навигация"><a href="#html-atlas">Элементы</a><a href="#ha-states">Состояния</a></nav>','Ссылки ведут в разделы страницы.');
recipe('Секции','main','Основное содержимое','<main id="content">\n  <h1>Название страницы</h1>\n  <section>…</section>\n</main>','Одна видимая основная область страницы. В атласе не создаём вложенный main.');
add('Секции','section','Тематический раздел','<section><h4>Оптика</h4><p>Самостоятельная тема с явным заголовком.</p></section>');
add('Секции','article','Самостоятельная карточка','<article><h4>Frost / 01</h4><p>Матовая поверхность с мягкой диффузией.</p><small>Образец коллекции</small></article>');
add('Секции','aside','Сопутствующая информация','<aside aria-label="Подсказка к образцу"><strong>На заметку</strong><p>Blur без цветного фона почти незаметен.</p></aside>');
add('Секции','footer','Завершение секции','<footer><small>LUMA · авторский образец</small><a href="#html-atlas">К карте ↑</a></footer>');
add('Секции','address','Контактная информация','<address>Демо-студия LUMA<br><a href="mailto:studio@example.com">studio@example.com</a></address>','Демонстрационный адрес на example.com, не контакт проекта.');
add('Секции','search','Область поиска','<search><label>Поиск в образце<input type="search" placeholder="Название слоя"></label></search>','Семантическая область; фильтрация требует отдельной логики и здесь не подключена.');
add('Секции','hgroup','Заголовок с подзаголовком','<hgroup><p>Коллекция / 01</p><h4>Арктический свет</h4><p>Серия матовых поверхностей</p></hgroup>');
for(let n=1;n<=6;n++) add('Заголовки','h'+n,'Заголовок уровня '+n,`<h${n} class="ha-heading-example">${['Главная идея','Раздел коллекции','Семейство материала','Вариант поверхности','Деталь образца','Примечание к детали'][n-1]}</h${n}>`,'Уровень отражает структуру документа, а размер задаётся CSS.');

add('Блоки текста','p','Абзац','<p>Стекло становится видимым там, где свет встречается с цветом. Текст остаётся на спокойной поверхности.</p>');
add('Блоки текста','div','Универсальный контейнер','<div class="ha-stack"><span>Слой света</span><span>Слой материала</span><span>Слой содержания</span></div>','Используйте, когда у группы нет более точной семантики.');
add('Блоки текста','blockquote','Отдельная цитата','<blockquote><p>«Сначала ясная композиция, затем движение».</p><footer>Учебная фраза LUMA</footer></blockquote>','Авторский пример, не приписанная кому-либо цитата.');
add('Блоки текста','pre','Форматированный блок','<pre>surface\n  light → diffusion\n  edge  → thickness</pre>','Пробелы сохраняются; длинная строка имеет собственную прокрутку.');
add('Блоки текста','hr','Тематический разрыв','<p>Материал</p><hr><p>Поведение</p>','Разделение темы, не способ нарисовать любой декоративный бордер.');
add('Блоки текста','figure','Иллюстрация с подписью',`<figure>${image}<figcaption>Цветная форма за плёнкой</figcaption></figure>`);
add('Блоки текста','figcaption','Подпись иллюстрации',`<figure>${image}<figcaption>01 · Направление света слева</figcaption></figure>`);
add('Списки','ul','Неупорядоченный список','<ul><li>Прозрачность</li><li>Диффузия</li><li>Направленный свет</li></ul>');
add('Списки','ol','Последовательность','<ol><li>Выбрать материал</li><li>Настроить свет</li><li>Проверить текст</li></ol>');
add('Списки','li','Элемент списка','<ul><li><strong>Frost</strong> — плоская плёнка</li><li><strong>Liquid</strong> — объёмный край</li></ul>');
add('Списки','menu','Список команд','<menu><li><button type="button" data-ha-action>Дублировать образец</button></li><li><button type="button" data-ha-action>Сбросить свет</button></li></menu><output data-ha-feedback aria-live="polite"></output>','Нативный список не создаёт ARIA menu и его стрелочную навигацию автоматически.');
add('Списки','dl','Пары термин — значение','<dl><dt>Frost</dt><dd>Матовая плёнка</dd><dt>Liquid</dt><dd>Оптическая толщина</dd></dl>');
add('Списки','dt','Термин','<dl><dt>Диффузия</dt><dd>Рассеивание фона под поверхностью.</dd></dl>');
add('Списки','dd','Описание термина','<dl><dt>Контраст</dt><dd>Проверяется на итоговом составном фоне.</dd></dl>');

const inline = [
['a','Ссылка','<a href="#ha-states">Перейти к состояниям ↗</a>'],
['abbr','Сокращение','<abbr title="Web Animations API">WAAPI</abbr> — Web Animations API'],
['b','Ключевое слово','Материал <b>Frost</b> в новой коллекции.'],
['strong','Важность','<strong>Не теряйте видимый фокус.</strong>'],
['em','Смысловое ударение','Сначала <em>читаемость</em>, затем эффект.'],
['i','Иной голос','Эффект <i lang="en">glassmorphism</i> в интерфейсе.'],
['u','Аннотация','В макете: <u>несогласованое</u> написание.'],
['s','Неактуальное','Режим: <s>полная прозрачность</s> → матовая плёнка.'],
['small','Второстепенный текст','<small>Учебный образец. Значения условные.</small>'],
['mark','Выделение совпадения','Поиск: <mark>стекло</mark> в светлой теме.'],
['span','Строчная группа','Состояние: <span class="ha-badge">готово</span>'],
['br','Смысловой перенос','Линия света<br>на матовой поверхности'],
['wbr','Возможный перенос','glass<wbr>material<wbr>collection<wbr>preview'],
['code','Фрагмент кода','<code>backdrop-filter: blur(14px)</code>'],
['kbd','Клавиатурный ввод','Нажмите <kbd>Tab</kbd>, затем <kbd>Enter</kbd>.'],
['samp','Ответ программы','<samp>Образец готов · 0 ошибок</samp>'],
['var','Переменная','Толщина: <var>t</var> = 3'],
['sub','Нижний индекс','H<sub>2</sub>O'],
['sup','Верхний индекс','Площадь: 16 м<sup>2</sup>'],
['q','Строчная цитата','Правило: <q>Один владелец свойства</q>.'],
['cite','Название произведения','<cite>Оптическая лаборатория LUMA</cite>'],
['dfn','Определяемый термин','<dfn>2D-плёнка</dfn> — поверхность без оптической толщины.'],
['data','Машинное значение','<data value="frost-01">Арктический свет</data>'],
['time','Дата или время','<time datetime="2026-10-21">21 октября 2026</time>'],
['bdi','Изоляция направления','Автор: <bdi>نور</bdi> · слой 01'],
['bdo','Направление текста','<bdo dir="rtl">ABC 123</bdo>'],
['ruby','Аннотация над текстом',ruby],['rt','Текст аннотации',ruby],['rp','Резервные скобки',ruby],
['ins','Добавленный текст','<ins datetime="2026-10-21">Добавлен локальный блик.</ins>'],
['del','Удалённый текст','<del datetime="2026-10-21">Равномерная обводка</del>']
];
inline.forEach(([tag,title,sample])=>add('Строчная семантика',tag,title,sample));

for (const [tag,title] of [['table','Таблица данных'],['caption','Название таблицы'],['thead','Шапка таблицы'],['tbody','Основные строки'],['tfoot','Итоговые строки'],['tr','Строка'],['th','Заголовочная ячейка'],['td','Ячейка данных'],['colgroup','Группа столбцов'],['col','Оформление столбца']]) add('Таблицы',tag,title,table,'Один связный табличный образец показывает контекст тега. Не использовать таблицу для раскладки страницы.');

add('Медиа','img','Изображение',image,'Оригинальный векторный образец внутри data URL. Смысловой alt и явные размеры.');
add('Медиа','picture','Адаптивное изображение',`<picture><source media="(min-width: 700px)" srcset="${art}">${image}</picture>`,'Один авторский asset в двух точках выбора; отдельный art direction — задача проекта.');
add('Медиа','source','Источник медиа',`<picture><source type="image/svg+xml" srcset="${art}">${image}</picture>`,'Не рисует самостоятельную поверхность; работает внутри picture/audio/video.');
add('Медиа','audio','Аудиоплеер','<audio controls preload="none" aria-label="Учебный аудиоплеер"></audio><p class="ha-hint">Контролы браузера; аудиофайл не подключён.</p>','Визуальный образец контролов, не воспроизведение готового аудио.','Контролы без медиа');
add('Медиа','video','Видеоплеер',`<video controls preload="none" width="240" height="100" poster="${art}" aria-label="Учебный видеоплеер"></video><p class="ha-hint">Постер; видеофайл не подключён.</p>`,'Не запускайте автозвук. Подготовьте субтитры и доступный fallback.','Контролы без медиа');
recipe('Медиа','track','Субтитры','<video controls>\n  <source src="film.webm" type="video/webm">\n  <track kind="captions" src="captions.vtt" srclang="ru" label="Русский">\n</video>','Рецепт подключения WebVTT. Файлов film.webm/captions.vtt в демо нет.');
add('Медиа','map','Карта ссылок изображения',`${image.replace('alt="','usemap="#ha-map" alt="')}<map name="ha-map"><area shape="circle" coords="80,50,34" href="#ha-states" alt="К состояниям элементов"></map>`,'Активна область круга; нужна текстовая альтернатива.');
add('Медиа','area','Интерактивная область',`${image.replace('alt="','usemap="#ha-area" alt="')}<map name="ha-area"><area shape="rect" coords="95,22,205,80" href="#ha-states" alt="К состояниям элементов"></map>`,'Активна область панели. Геометрия зависит от реального размера изображения.');
add('Встраивание','iframe','Изолированный документ','<iframe title="Изолированный учебный документ" sandbox srcdoc="<html lang=ru><body style=\'font:16px sans-serif;background:#d9f4ef;color:#15233c;padding:18px\'><strong>Отдельный документ</strong><p>Без сети и скриптов</p></body></html>"></iframe>','Учебный srcdoc с sandbox; доступ к внешним сервисам не нужен.');
add('Встраивание','object','Встроенный объект',`<object type="image/svg+xml" data="${art}" width="240" height="100" aria-label="Векторный образец"><p>Цветная форма за плёнкой.</p></object>`,'Встроенное SVG собственного авторства; fallback остаётся в разметке.');
recipe('Встраивание','embed','Внешний встроенный ресурс','<embed src="document.pdf" type="application/pdf" title="Описание материала">','PDF не подключён. Предоставьте обычную ссылку на документ и проверьте просмотрщик.');
add('Встраивание','canvas','Растровая сцена','<canvas width="240" height="100" data-ha-canvas role="img" aria-label="Два пересекающихся оптических слоя">Два пересекающихся оптических слоя.</canvas>','Скрипт рисует статичный образец один раз. Текстовая альтернатива не зависит от canvas.');
add('Встраивание','svg','Векторная графика',svg.replace('<svg ','<svg role="img" aria-label="Лаймовый круг и голубая панель" '),'Корень SVG — отдельное пространство имён, не HTML-тег. Полный словарь SVG здесь не перечисляется.','Другой namespace');
add('Встраивание','math','Математическая разметка','<math aria-label="x в квадрате плюс y в квадрате"><mrow><msup><mi>x</mi><mn>2</mn></msup><mo>+</mo><msup><mi>y</mi><mn>2</mn></msup></mrow></math>','Корень MathML — отдельное пространство имён, не HTML-тег.','Другой namespace');

const documentRecipes = [
['html','Корень документа','<!doctype html>\n<html lang="ru">…</html>','Укажите язык и корректный doctype.'],
['head','Метаданные','<head>\n  <meta charset="utf-8">\n  <title>LUMA</title>\n</head>','Содержит настройки документа; не карточка интерфейса.'],
['body','Содержимое документа','<body>\n  <header>…</header>\n  <main>…</main>\n  <footer>…</footer>\n</body>','Один body, без вложения второго body для компонента.'],
['title','Название вкладки','<title>Glass Atlas — элементы</title>','Название страницы, не визуальный заголовок.'],
['meta','Настройки и описание','<meta name="viewport" content="width=device-width, initial-scale=1">','Масштабирование пользователем остаётся доступным.'],
['link','Связанный ресурс','<link rel="stylesheet" href="./style.css">','Проверяйте пути относительно опубликованной страницы.'],
['style','Встроенный CSS','<style>\n  .surface { border: 0; }\n</style>','Не подменяйте стили всей страницы из примера компонента.'],
['base','Базовый URL','<base href="https://example.com/catalog/">','Меняет разрешение всех относительных URL. В живой атлас не вставляется.'],
['script','Поведение','<script type="module" src="./interaction.js"></script>','Скрипты не должны быть условием чтения основной информации.'],
['noscript','Резерв без JavaScript','<noscript>Фильтрация недоступна; элементы перечислены ниже.</noscript>','Содержимое проверяется с реально выключенным JS.'],
['template','Инертный шаблон','<template id="material-template">\n  <article>Frost</article>\n</template>','Не отображается до клонирования content; это не скрытая интерактивная карточка.'],
['slot','Точка вставки Web Component','<slot name="title">Материал</slot>','Работает внутри shadow root. Нужен host-компонент и проверка доступного имени.']
];
documentRecipes.forEach(([tag,title,code,note])=>recipe('Документ и шаблоны',tag,title,code,note));

export const htmlElements=rows;
export const inputTypes=['button','checkbox','color','date','datetime-local','email','file','hidden','image','month','number','password','radio','range','reset','search','submit','tel','text','time','url','week'];
// WHATWG defines 22 input states, including the default Text state.
const inputLabels={button:'Команда',checkbox:'Флажок',color:'Цвет',date:'Дата','datetime-local':'Локальная дата и время',email:'Почта',file:'Файл',hidden:'Скрытое значение',image:'Кнопка-изображение',month:'Месяц',number:'Число',password:'Пароль',radio:'Один из вариантов',range:'Диапазон',reset:'Сброс формы',search:'Поиск',submit:'Отправка формы',tel:'Телефон',text:'Текст',time:'Время',url:'Адрес сайта',week:'Неделя'};
function inputSample(type){
 if(type==='hidden') return '<input type="hidden" name="material" value="frost"><p>Значение frost не видно. Hidden не является защитой данных.</p>';
 if(type==='image') return `<form data-ha-form method="dialog"><input type="image" src="${art}" width="180" height="75" alt="Выбрать материал"><output data-ha-feedback aria-live="polite"></output></form>`;
 if(type==='button') return '<input type="button" value="Применить" data-ha-action><output data-ha-feedback aria-live="polite"></output>';
 if(type==='reset'||type==='submit') return `<form data-ha-form method="dialog"><label>Образец<input value="Frost" name="sample"></label><input type="${type}" value="${type==='reset'?'Вернуть Frost':'Проверить локально'}"><output data-ha-feedback aria-live="polite"></output></form>`;
 if(type==='radio') return '<fieldset><legend>Радиокнопки</legend><label><input type="radio" name="ha-type-radio" checked> Frost</label><label><input type="radio" name="ha-type-radio"> Smoke</label></fieldset>';
 if(type==='checkbox') return '<label><input type="checkbox" checked> Включить цветную подложку</label>';
 const extra={color:' value="#a8ff62"',date:' value="2026-10-21"','datetime-local':' value="2026-10-21T14:30"',email:' placeholder="name@example.com"',file:' accept="image/*"',month:' value="2026-10"',number:' min="0" max="24" value="14"',password:' autocomplete="new-password" placeholder="Учебное поле"',range:' min="0" max="24" value="14"',search:' placeholder="Найти поверхность"',tel:' placeholder="+7 000 000-00-00"',text:' placeholder="Название слоя"',time:' value="14:30"',url:' placeholder="https://example.com"',week:' value="2026-W43"'};
 return `<label>${inputLabels[type]}<input type="${type}"${extra[type]||''}></label>`;
}
export const obsoleteElements='acronym applet basefont bgsound big blink center content dir font frame frameset image isindex keygen listing marquee menuitem multicol nextid nobr noembed noframes param plaintext rb rtc shadow spacer strike tt xmp'.split(' ');
const groups=[...new Set(rows.map(r=>r.group))];
function elementRow(r,index){
 const html=r.kind==='Рецепт'?`<div class="ha-recipe-mark"><span aria-hidden="true">&lt;/&gt;</span><p>${esc(r.title)}</p><small>Код без встраивания в документ</small></div>`:r.sample;
 return `<details class="ha-entry" data-ha-entry data-ha-query="${esc(r.tag+' '+r.title+' '+r.note)}" id="ha-${r.id}"${index===0&&r.group==='Управление'?' open':''}><summary><code>&lt;${r.tag}&gt;</code><span>${r.title}</span><small>${r.kind}</small></summary><div class="ha-entry-body"><div class="ha-scene"><div class="ha-demo ha-surface">${html}</div></div><div class="ha-spec"><p>${esc(r.note||'Семантический элемент в авторском образце. Стекло задаётся CSS и не меняет назначение тега.')}</p><pre><code>${esc(r.sample)}</code></pre><a href="https://developer.mozilla.org/en-US/docs/${r.tag==='svg'?'Web/SVG/Element/svg':r.tag==='math'?'Web/MathML/Element/math':'Web/HTML/Reference/Elements/'+(/^h[1-6]$/.test(r.tag)?'Heading_Elements':r.tag)}" target="_blank" rel="noopener noreferrer">Документация ${r.tag} ↗</a></div></div></details>`;
}
const states = [
['Кнопки','Primary · secondary · quiet','<div class="ha-actions"><button class="ha-primary" type="button" data-ha-action>Создать образец</button><button type="button" data-ha-action>Сохранить</button><button class="ha-quiet" type="button" data-ha-action>Подробнее</button></div><output data-ha-feedback aria-live="polite"></output>','Иерархия действия определяется смыслом. Neon — один главный акцент.'],
['Кнопки','Toggle · icon · disabled','<div class="ha-actions"><button type="button" aria-pressed="false" data-ha-toggle>Закрепить</button><button type="button" aria-label="Добавить слой" data-ha-action>＋</button><button type="button" disabled>Недоступно</button></div><output data-ha-feedback aria-live="polite"></output>','Toggle сохраняет имя и меняет aria-pressed. У icon-only есть доступная подпись.'],
['Кнопки','Подготовка → готово','<button type="button" data-ha-load>Подготовить образец</button><output data-ha-feedback aria-live="polite"></output>','Реальный локальный конечный переход состояния; никакой сетевой операции.'],
['Селекторы','Сегменты / один выбор','<fieldset class="ha-segments"><legend>Режим материала</legend><label><input type="radio" name="ha-segment" checked> 2D плёнка</label><label><input type="radio" name="ha-segment"> 3D край</label></fieldset>','Нативные radio дают Tab + стрелки; обе подписи доступны на телефоне.'],
['Селекторы','Несколько вариантов','<label>Слои<select multiple size="3"><option selected>Поверхность</option><option>Свет</option><option>Тень</option></select></label>','Нативный multiple; при сложном поиске нужен отдельный combobox/listbox с полным клавиатурным контрактом.'],
['Селекторы','Switch / on–off','<label class="ha-switch"><input type="checkbox" role="switch" checked> Подложка включена</label>','Switch — два состояния; radio выбирает один вариант из набора.'],
['Селекторы','Mixed checkbox','<label><input type="checkbox" data-ha-mixed> Выбрать все слои</label><p class="ha-hint">Начальное indeterminate задаётся JS.</p>','Смешанное состояние — свойство DOM, не атрибут checked. После клика элемент становится обычным checkbox.'],
['Поля','Required · readonly · disabled','<label>Название *<input required placeholder="Обязательно"></label><label>Код<input readonly value="FROST-01"></label><label>Архив<input disabled value="Недоступно"></label>','Readonly остаётся доступным для фокуса и копирования; disabled — нет.'],
['Поля','Ошибка и помощь','<label for="ha-invalid">Название</label><input id="ha-invalid" aria-invalid="true" aria-describedby="ha-error" value=""><p id="ha-error" class="ha-error">Введите название, чтобы продолжить. Учебное состояние ошибки.</p>','Ошибка передаётся текстом и связью aria-describedby, а не только цветом.'],
['Раскрытие','Popover / подсказка','<button type="button" popovertarget="ha-help">О материале</button><div id="ha-help" popover class="ha-popover"><strong>2D Frost</strong><p>Плёнка без оптической толщины. Закрыть: Escape или касание снаружи.</p><button type="button" popovertarget="ha-help" popovertargetaction="hide">Закрыть</button></div>','Нативный popover доступен через click/touch/keyboard. Это не tooltip только на hover.'],
['Навигация','Текущая страница','<nav aria-label="Пример страниц"><a href="#html-atlas" aria-current="page">01 · Элементы</a><a href="#ha-states">02 · Состояния</a></nav>','aria-current обозначает место; ссылки сохраняют обычную навигацию.'],
['Фокус','Keyboard / hover / active','<button type="button" data-ha-action>Наведите · нажмите · Tab</button><output data-ha-feedback aria-live="polite"></output>','Hover — только при наличии указателя. Focus-visible имеет функциональный контур и не нарушает запрет декоративной обводки стекла.']
];
export function htmlAtlasSection(){
 const tagCount=rows.filter(r=>!['svg','math'].includes(r.tag)).length;
 return `<section class="section wrap ha-root" id="html-atlas" data-ha-edge="3d" aria-labelledby="ha-title"><div class="section-head"><div><div class="eyebrow">HTML / семантика / состояния</div><h2 id="ha-title">Анатомия<br>интерфейса.</h2></div><p>От тега до рабочего контрола. ${tagCount} HTML-элементов, 2 соседних пространства имён, ${inputTypes.length} типа input и ${states.length} групп состояний. Раскройте строку: слева образец, справа рецепт.</p></div><div class="ha-toolbar"><label>Найти тег или назначение<input type="search" id="ha-search" placeholder="button, селектор, дата…" disabled></label><fieldset class="ha-material"><legend>Материал образцов</legend><label><input type="radio" name="ha-edge" value="2d"> 2D плёнка</label><label><input type="radio" name="ha-edge" value="3d" checked> 3D край</label></fieldset><output id="ha-count" role="status">${tagCount+2} элементов</output></div><div class="ha-map" role="group" aria-label="Раздел HTML-карты"><button type="button" data-ha-filter="all" aria-pressed="true" disabled>Вся карта <small>${rows.length}</small></button>${groups.map((g,i)=>`<button type="button" data-ha-filter="${esc(g)}" aria-pressed="false" disabled><span>${String(i+1).padStart(2,'0')} / ${g}</span><small>${rows.filter(r=>r.group===g).length}</small></button>`).join('')}</div><div class="ha-groups">${groups.map((g,i)=>`<details class="ha-group" data-ha-group="${esc(g)}"${i===0?' open':''}><summary><span>${String(i+1).padStart(2,'0')}</span><h3>${g}</h3><small>${rows.filter(r=>r.group===g).length} элементов</small></summary><div class="ha-entries">${rows.filter(r=>r.group===g).map(elementRow).join('')}</div></details>`).join('')}<p id="ha-empty" hidden>Совпадений нет. Очистите поиск или выберите «Вся карта».</p></div><div class="ha-subhead"><h3>Каждый тип input.</h3><p>${inputTypes.length} нативных типа: форма и выбор, данные и время, действия. Пикеры зависят от браузера; файлы остаются на устройстве.</p></div><div class="ha-input-grid">${inputTypes.map(type=>`<details class="ha-input-card" data-ha-input="${type}"><summary><code>${type}</code><span>${inputLabels[type]}</span></summary><div class="ha-demo ha-input-demo">${inputSample(type)}</div><pre><code>${esc(inputSample(type))}</code></pre></details>`).join('')}</div><div class="ha-subhead" id="ha-states"><h3>Не только default.</h3><p>Кнопки, селекторы и поля проверяются в состояниях: действие, выбор, фокус, ошибка и недоступность. Все действия ниже локальные.</p></div><div class="ha-state-grid">${states.map(([family,title,html,note])=>`<article class="ha-state"><span class="ha-kicker">${family}</span><h4>${title}</h4><div class="ha-scene"><div class="ha-demo ha-surface">${html}</div></div><p>${note}</p></article>`).join('')}</div><details class="ha-legacy"><summary>Границы карты · новые возможности и устаревшие теги</summary><div><p>Основа — список conforming elements HTML Living Standard, сверенный 21.10.2026. <code>selectedcontent</code> показан как рецепт с проверкой поддержки. SVG и MathML вынесены отдельно; произвольные custom elements не образуют конечного списка.</p><p>Теги прошлого перечислены для распознавания старого кода, без живого исполнения: ${obsoleteElements.map(t=>`<code>${t}</code>`).join(' ')}. Не используйте их как новые компоненты.</p><p>Не включены в базовый счёт экспериментальные или нестандартные элементы <code>fencedframe</code>, <code>geolocation</code>, <code>permission</code>, <code>portal</code>. Перед применением проверяйте актуальный статус и поддержку.</p><p>Tabs, combobox, tree, grid, menu-button, date-range и drag-select — составные паттерны, не новые HTML-теги. Их наличие в карте элементов не означает реализацию полного ARIA-поведения.</p></div></details><p class="ha-sources">Основание карты: <a href="https://html.spec.whatwg.org/multipage/indices.html#elements-3" target="_blank" rel="noopener noreferrer">WHATWG · элементы</a> · <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" target="_blank" rel="noopener noreferrer">MDN · HTML</a> · <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input" target="_blank" rel="noopener noreferrer">MDN · input</a>. Дата сверки: 21.10.2026. Превью и тексты созданы для LUMA.</p><noscript><p>Карта и раскрытие строк работают без JavaScript. Поиск, тестовые кнопки, canvas и модальный диалог требуют JS.</p></noscript></section>`;
}
