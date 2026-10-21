// Original miniature wireframes, not third-party screenshots or functioning controls.
const pill=s=>`<span class="mini-pill">${s}</span>`;
const line=(w=90)=>`<div class="mini-line" style="--w:${w}%"></div>`;
const input=s=>`<div class="mini-input">${s}</div>`;
const row=(a,b)=>`<div class="mini-row">${a}${b}</div>`;
const bars='<div class="mini-bars"><i style="--h:35%"></i><i style="--h:65%"></i><i style="--h:48%"></i><i style="--h:90%"></i><i style="--h:72%"></i></div>';
const tiles='<div class="mini-grid"><div class="mini-block"></div><div class="mini-block"></div></div>';
const samples={
1:`<b>Цветовая система</b>${row(pill('Light'),'Dark')}<div class="mini-swatches"><i></i><i></i><i></i></div>`,
2:'<div class="layer-demo"><span></span><span></span><span></span></div><b>Fill → frost → edge</b>',
3:'<b class="mini-large">Aa / Яя</b><span>Заголовок · текст · подпись</span><span class="mini-glyphs">↗　✓　＋　−</span>',
4:'<b>Responsive grid</b><div class="mini-grid grid-three"><div class="mini-block"></div><div class="mini-block"></div><div class="mini-block"></div><div class="mini-block"></div><div class="mini-block"></div><div class="mini-block"></div></div>',
5:`<div class="mini-hero"><div><b>Форма<br>света.</b>${pill('Открыть ↗')}</div><div class="mini-circle"></div></div>`,
6:'<div class="mini-bento"><div>Материал</div><div>Цвет</div><div>Движение ↗</div></div>',
7:'<div class="mini-steps"><span>● Идея</span><i></i><span>● Форма</span><i></i><span>○ Запуск</span></div>',
8:`${row('<b>LUMA</b>','Материал　↗')}<div class="mini-nav">Стекло　 Motion　 Атлас</div>${line(70)}`,
9:`${row('<b>Меню</b>','✕')}<div class="mini-menu"><span>Материалы ↗</span><span>Движение ↗</span><span>Атлас ↗</span></div>`,
10:'<div class="mini-sidebar"><div><b>◎</b><span>Обзор</span><strong>Слои</strong><span>Экспорт</span></div><div><b>Материал</b>'+line(80)+line(65)+line(90)+'</div></div>',
11:'<div class="mini-crumb">Главная / Атлас /</div><b>Материал</b>'+line(80)+line(60),
12:`<div class="mini-nav">${pill('Frost')}<span>Smoke</span><span>Prism</span></div><b>Текущая вкладка</b>${line(75)}`,
13:`<b>Страница 2 из 8</b><div class="mini-nav"><span>‹</span><span>1</span>${pill('2')}<span>3</span><span>…</span><span>8</span><span>›</span></div>`,
14:`<b class="mini-large">LUMA.</b><div class="mini-nav">Атлас　Документы　↗</div><span>Контакты · условия</span>`,
15:`<b>Текст на стекле</b>${line(100)}${line(85)}<div class="mini-code">--surface: frost;</div>`,
16:`<div class="mini-grid"><div class="mini-content-card"><span class="mini-circle"></span><b>Frost</b></div><div class="mini-content-card"><span class="mini-square"></span><b>Smoke</b></div></div>`,
17:'<div class="mini-accordion"><b>Как устроено стекло? −</b><span>Плёнка, край и глубина.</span><b>Что с доступностью? +</b></div>',
18:'<span class="mini-large">“</span><b>Содержание важнее эффекта.</b><span>Учебная цитата / не отзыв</span>',
19:'<div class="mini-avatars"><span>A</span><span>B</span><span>C</span><span>+2</span></div><span>Условные участники</span>',
20:`<div class="mini-nav">${pill('Готово ✓')}<span class="mini-input">Дизайн ×</span></div><span class="mini-input">Glassmorphism #</span>`,
21:`<b>Иерархия действий</b>${row(pill('Сохранить ↗'),'<span class="mini-input">＋</span>')}<span>Отменить</span>`,
22:`<b>Имя материала</b>${input('Northern light |')}<div class="mini-input">Описание поверхности<br><br>↘</div>`,
23:`<b>Тип поверхности</b>${input('Frosted glass　⌄')}<div class="mini-options"><b>✓ Frosted</b><span>Smoke</span></div>`,
24:'<b>Выбор материала</b><span>☑ Прозрачность</span><span>☐ Отражение</span><span>◉ Светлая　○ Тёмная</span>',
25:`${row('<b>Уведомления</b>','<span class="mini-switch on"></span>')}${row('<span>Автозапуск</span>','<span class="mini-switch"></span>')}`,
26:`${row('<b>Размытие</b>',pill('20 px'))}<div class="mini-range"><span></span></div>${row('<span>0</span>','<span>28</span>')}`,
27:`${row('<b>Октябрь 2026</b>','‹　›')}<div class="mini-calendar"><span>19</span><span>20</span><b>21</b><span>22</span><span>23</span><span>24</span><span>25</span></div>${input('14:30　◷')}`,
28:'<div class="mini-drop"><b>↑</b><span>Перетащите файл</span><span class="mini-pill">Выбрать файл</span></div>',
29:`${input('⌕　glass')}${row(pill('Все'),'<span>Материалы　×</span>')}${line(85)}`,
30:'<b>Название *</b><div class="mini-input mini-invalid">!</div><span class="mini-error">Введите название материала</span>',
31:`<span>Учебные данные / сегодня</span><b class="mini-large">128</b>${row('<span>Просмотры демо</span>',pill('Пример'))}`,
32:'<div class="mini-table"><b>Материал ↑</b><b>Blur</b><span>☑ Frost</span><span>20 px</span><span>☐ Smoke</span><span>16 px</span><span>☐ Solid</span><span>0 px</span></div>',
33:'<div class="mini-feed"><span>● Материал создан <small>12:20</small></span><span>● Цвет изменён <small>12:21</small></span><span>○ Экспорт готов <small>12:22</small></span></div>',
34:`${row('<b>Учебная серия</b>','● A　○ B')}${bars}`,
35:'<div class="mini-photo"><span class="mini-sun"></span><span class="mini-hill"></span></div><span>Авторский пейзаж / CSS-этюд</span>',
36:'<div class="mini-carousel"><span>‹</span><div class="mini-photo"><span class="mini-sun"></span><span class="mini-hill"></span></div><span>›</span></div><div class="mini-dots">● ○ ○</div>',
37:'<div class="mini-video"><span>▶</span></div><div class="mini-nav"><span>▶</span><div class="mini-range"><span></span></div><span>CC</span></div>',
38:'<div class="mini-map"><span class="mini-pin">●</span><span class="mini-map-controls">＋<br>−</span></div><span>Схема, не подключённая карта</span>',
39:'<div class="mini-tooltip">Плотная поверхность</div><div class="mini-nav"><span>Материал</span><span class="mini-info">i</span></div>',
40:`${row('<b>Сохранить материал?</b>','✕')}<span>Подтвердите действие</span>${row('<span>Отмена</span>',pill('Сохранить'))}`,
41:'<div class="mini-toast"><b>✓</b><span>Токены готовы<br><small>Локальный экспорт</small></span><span>×</span></div>',
42:`${row('<b>Учебный прогресс</b>','60%')}<div class="mini-progress"><span></span></div>${line(80)}${line(55)}`,
43:'<div class="mini-empty"><span>⌕</span><b>Ничего не найдено</b><small>Измените запрос</small></div>',
44:`${row('<b>Demo plan</b>',pill('Месяц'))}<b class="mini-large">1 200 ₽</b><span>Учебная цена / не оферта</span>`,
45:'<div class="mini-table compare"><b>Функции</b><b>A</b><b>B</b><span>Тема</span><span>✓</span><span>✓</span><span>Экспорт</span><span>−</span><span>✓</span></div>',
46:`${row('<div class="mini-circle"></div>','<div><b>Glass kit</b><br>Учебный товар</div>')}<div class="mini-nav"><span>−</span>${pill('1')}<span>＋</span><b>120 ₽</b></div>`,
47:'<div class="mini-reveal"><div>Содержание</div><div>Материал</div><div>Движение</div></div>',
48:'<div class="mini-prism"><span class="specular"></span></div><b>Один световой проход</b>'
};
export function preview(p){return `<div class="pattern-preview" aria-hidden="true"><div class="mini-ui">${samples[p.id]}</div></div>`}
