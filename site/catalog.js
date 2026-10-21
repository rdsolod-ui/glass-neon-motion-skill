export const sources={
G1:{name:'GlassKit / LUMEN',url:'https://glasskit-web.jungherz.com/demo/',kind:'Стекло · light + dark',note:'Просмотрены обе темы в браузере. Берём принцип независимой настройки плёнки и кромки; создаём собственные элементы.'},
G2:{name:'Remember / Glassmorphism',url:'https://remember.style/glassmorphism',kind:'Стекло · оптика',note:'Просмотрен тёмный hero с кольцами и прозрачной панелью. Наши motion-рецепты самостоятельные, тайминг источника не измерялся.'},
G3:{name:'Microsoft Fluent / Material',url:'https://fluent2.microsoft.design/material',kind:'Первичная документация',note:'Разделение solid, acrylic и smoke. Адаптируем роли материалов для веба, без зависимости от WinUI.'},
G4:{name:'Microsoft / Acrylic',url:'https://learn.microsoft.com/en-us/windows/apps/design/style/acrylic',kind:'Первичная документация',note:'Размытие, тонировка и глубина. Избегаем многократного вложенного blur и сохраняем плотный fallback.'},
G5:{name:'Apple / Liquid Glass',url:'https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/',kind:'Нативный материал · вдохновение',note:'Оптическая иерархия контролов и навигации. CSS blur не воспроизводит нативный движок преломления Apple.'},
H1:{name:'Reflect / Supahero',url:'https://supahero.io/hero/reflect',kind:'Hero · композиция',note:'Просмотрен скриншот: световой горизонт и крупный заголовок. Переносим иерархию, не чужие изображения или анимацию.'},
P1:{name:'Fey / Pricing Pages',url:'https://pricingpages.design/sites/fey',kind:'Тарифы · структура',note:'Просмотрены desktop/mobile. Один главный выбор и FAQ. Не переносим низкий контраст крупной цены.'},
N1:{name:'Supaste / Navbar Gallery',url:'https://www.navbar.gallery/navbar/supaste',kind:'Навигация · desktop + mobile',note:'Компактная шапка и вертикальное мобильное меню. Поведение клавиатуры реализуем и проверяем отдельно.'},
C1:{name:'Eternalblue / CTA Gallery',url:'https://www.cta.gallery/cta/eternalblue',kind:'CTA · структурный ориентир',note:'Контекстная кнопка рядом с продуктом. Это референс композиции, а не стеклянного материала.'},
F1:{name:'Eclipse Space / Footer Design',url:'https://www.footer.design/sites/eclipse-space',kind:'Футер · структурный ориентир',note:'Выразительное завершение и компактные полезные ссылки. Motion по одному изображению не подтверждён.'}
};
export const families=['Основа','Композиция','Навигация','Контент','Формы','Данные','Медиа','Обратная связь','Коммерция','Motion'];
// Each row: title, family index, source, movement, adaptation, real demo destination (empty = visual specimen only).
const rows=[
['Тема и акцент',0,'G1','state','Две самостоятельные палитры и один локальный акцент.','index.html#studio'],
['Плёнка, кромка, глубина',0,'G4','enter','Тонировка держит текст; blur отделяет задний план.','index.html#materials'],
['Типографика и знаки',0,'H1','none','Кириллица, ясная шкала и спокойная поверхность чтения.',''],
['Контейнер и сетка',1,'C1','none','Один ритм полей, адаптивные колонки без скрытого overflow.','index.html#materials'],
['Hero и продукт',1,'H1','enter','Один оптический объект рядом с главным сообщением.','index.html'],
['Features и bento',1,'G1','lift','Контент задаёт размеры; стекло выделяет нужный слой.','index.html#materials'],
['Процесс и timeline',1,'G1','enter','Этапы читаются в естественном порядке без scroll-зависимости.','index.html#motion'],
['Header и sticky nav',2,'N1','enter','Компактная стеклянная панель, видимые текущие действия.','index.html'],
['Мобильное меню',2,'N1','overlay','Вертикальные ссылки, явное раскрытие и закрытие Escape.','index.html'],
['Sidebar и оглавление',2,'G3','overlay','Тонкая граница, активный пункт и стабильная ширина.',''],
['Breadcrumb',2,'N1','none','Местоположение важнее эффектов; последний пункт не ссылка.',''],
['Tabs и segmented',2,'G1','state','Плотный активный индикатор вместо свечения текста.',''],
['Pagination',2,'N1','state','Текущая страница названа; доступен переход без свайпа.',''],
['Footer и utility links',2,'F1','enter','Спокойное завершение с полезными маршрутами.','index.html#main'],
['Статья и код',3,'G3','none','Длинный текст на плотной плоскости, код доступен для копирования.',''],
['Карточка и сетка',3,'G1','lift','Кромка и тень отделяют объект; hover не прячет содержание.','index.html#materials'],
['Accordion и FAQ',3,'P1','expand','Нативный details сохраняет смысл и клавиатурное управление.','index.html#motion'],
['Цитата и testimonial',3,'G1','enter','Только подтверждённая цитата; здесь явно учебный образец.',''],
['Логотипы и аватары',3,'G1','none','Реальные материалы с правами; здесь абстрактные образцы.',''],
['Badge, tag, chip',3,'G1','state','Акцент обозначает состояние, текст объясняет значение.',''],
['Кнопка и icon action',4,'C1','lift','Ясный глагол, контрастная заливка и самостоятельный focus.','index.html#studio'],
['Input и textarea',4,'G1','state','Постоянная подпись, текст от 16 px, плотная внутренняя поверхность.','index.html#studio'],
['Select и combobox',4,'G3','overlay','Для сложного списка — проверенная headless-поведенческая база.',''],
['Checkbox и radio',4,'G5','state','Состояние читается по отметке и подписи, не только по цвету.','index.html#studio'],
['Switch',4,'G5','state','Немедленное изменение настройки; семантика switch или checkbox.',''],
['Slider и range',4,'G5','direct','Нативный input range; значение видно и меняется клавиатурой.','index.html#studio'],
['Дата и время',4,'G3','overlay','Нативный picker или доступная библиотека, локаль и часовой пояс.',''],
['Upload и drop area',4,'G1','lift','Кнопка выбора обязательна; не обещать загрузку без сервера.',''],
['Поиск и фильтр',4,'N1','state','Последний запрос побеждает; пустой результат объясняется.','moodboard.html#atlas'],
['Ошибка и валидация',4,'G1','feedback','Текст рядом с полем и aria-describedby; цвет не единственный сигнал.','index.html#studio'],
['Статистика и KPI',5,'G1','enter','Единицы и период рядом с числом; без выдуманных результатов.',''],
['Таблица и сортировка',5,'G3','state','Плотный фон, табличные цифры, подписи и доступная сортировка.',''],
['Список и activity feed',5,'G1','state','События остаются в порядке чтения; новые записи не крадут фокус.',''],
['График и легенда',5,'G3','enter','Дублировать смысл текстом и таблицей; неон не кодирует всё.',''],
['Изображение и галерея',6,'C1','enter','Подпись вне стеклянного шума; alt передаёт назначение.',''],
['Carousel',6,'C1','layout','Названные кнопки назад/вперёд, без обязательного autoplay.',''],
['Видео и управление',6,'G5','lift','Контролы видимы, есть субтитры; autoplay не нужен.',''],
['Карта и масштаб',6,'G5','direct','Адрес и список рядом с картой; эффекты не блокируют жесты.',''],
['Tooltip и popover',7,'G3','overlay','Открывать с фокуса и pointer; важный текст доступен без hover.',''],
['Dialog и sheet',7,'G3','overlay','Smoke отделяет фон, focus остаётся внутри и возвращается к кнопке.','index.html#open-spec'],
['Toast и alert',7,'G3','feedback','Уведомление подтверждает реальное действие, status без перехвата фокуса.','index.html#studio'],
['Progress и skeleton',7,'G1','feedback','Прогресс отражает реальное состояние; reduced — статический placeholder.',''],
['Empty, error, offline',7,'G3','feedback','Назвать проблему и доступное следующее действие.',''],
['Тариф и billing',8,'P1','state','Период, валюта, условия; только явно демонстрационные числа.',''],
['Сравнение возможностей',8,'P1','none','Читаемая матрица вместо набора светящихся карточек.',''],
['Товар, корзина, количество',8,'C1','state','Цена, количество и итог согласованы; без фиктивной оплаты.',''],
['Reveal и глубина',9,'H1','enter','Декоративный слой появляется один раз; текст уже доступен.','index.html#motion'],
['Optical highlight',9,'G2','light','Блик — отдельный ограниченный слой, без тяжёлой анимации blur.','index.html#motion']
];
export const patterns=rows.map((r,i)=>({id:i+1,title:r[0],family:families[r[1]],source:r[2],motion:r[3],note:r[4],demo:r[5]}));
export const motions={none:{name:'Статика',duration:0,property:'Без анимации',reason:'Сохранить скорость чтения'},enter:{name:'Reveal',duration:420,property:'opacity + translateY',reason:'Объяснить появление слоя'},lift:{name:'Lift / press',duration:360,property:'translateY + scale',reason:'Подтвердить взаимодействие'},state:{name:'State change',duration:240,property:'opacity + translateX',reason:'Сохранить связь между состояниями'},overlay:{name:'Overlay',duration:220,property:'opacity + translateY',reason:'Показать новый контекст'},expand:{name:'Expand',duration:280,property:'scaleY + opacity (только образец)',reason:'Показать раскрытие; в продукте нативный details'},direct:{name:'Direct manipulation',duration:500,property:'translateX (иллюстрация)',reason:'Объяснить смещение; в продукте нативный контроль'},feedback:{name:'Feedback',duration:300,property:'opacity + scale',reason:'Подтвердить смену состояния'},layout:{name:'Layout transition',duration:480,property:'translateX + opacity',reason:'Сохранить пространственную связь'},light:{name:'Specular pass',duration:650,property:'translateX отдельного блика',reason:'Показать оптическую грань один раз'}};
export const userReferences=[
  {
    "n": 1,
    "family": "Неоновое стекло",
    "title": "Объём за панелью",
    "note": "Циановые и розовые формы, тонкие световые края и тёмные полупрозрачные карточки.",
    "url": "https://www.unisender.com/ru/blog/wp-content/uploads-webpc/uploads/2026/04/13-3.png.webp"
  },
  {
    "n": 2,
    "family": "Frost",
    "title": "Круглая матовая линза",
    "note": "Сочная геометрия за матовым кругом. Разница чёткой и размытой формы делает материал видимым.",
    "url": "https://i.pinimg.com/originals/a6/fb/29/a6fb29173881b8c037d937d6244df7e5.jpg"
  },
  {
    "n": 3,
    "family": "Smoke",
    "title": "Графит и лайм",
    "note": "Дымчатая панель на гранёном чёрном фоне; блик по верхней границе и локальный лаймовый акцент.",
    "url": "https://avatars.mds.yandex.net/i?id=72774500a6c0a959090dc8df51c61e6d_l-12538721-images-thumbs&n=13"
  },
  {
    "n": 4,
    "family": "App shell",
    "title": "Прозрачная оболочка",
    "note": "Большое окно приложения пропускает цвет обоев; внутренние зоны получают собственную плотность.",
    "url": "https://www.cyberclick.net/hs-fs/hubfs/04.%20BLOG/glassmorphism-example.webp?width=3600&height=2700&name=glassmorphism-example.webp"
  },
  {
    "n": 5,
    "family": "Слои",
    "title": "Карточки в пространстве",
    "note": "Высокая панель и розовые вложенные карточки образуют несколько планов на сине-фиолетовом фоне.",
    "url": "https://skillbox.ru/upload/setka_images/07091014072021_cece785eb92cd643f5e788e5f37e3d933a76f56c.jpg"
  },
  {
    "n": 6,
    "family": "Smoke",
    "title": "Форма поверх цветной ленты",
    "note": "Прозрачная широкая форма входа, белая типографика и яркая лента за стеклом.",
    "url": "https://img.magnific.com/premium-psd/glassmorphism-login-page-ui-design_492010-256.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    "n": 7,
    "family": "Frost",
    "title": "Стеклянный первый экран",
    "note": "Крупная матовая рамка над красно-голубым фоном. Это изображение макета, не работающий сайт.",
    "url": "https://cdn.creativefabrica.com/2024/06/22/PSD-web-interface-glass-morphism-mockup-Graphics-100163031-1.jpg"
  },
  {
    "n": 8,
    "family": "Light",
    "title": "Светлые мобильные панели",
    "note": "Холодный голубой фон, белые внутренние карточки и мягкая прозрачная внешняя оболочка.",
    "url": "https://onward.justia.com/wp-content/uploads/2023/01/Glassmorphism-Example.png"
  },
  {
    "n": 9,
    "family": "Перекрытия",
    "title": "Три слоя погоды",
    "note": "Тонкие наклонённые карточки: содержимое заднего слоя размывается за передним.",
    "url": "https://i.pinimg.com/originals/5a/09/55/5a0955383d37c6451c20d021c4b22cff.png?nii=t"
  },
  {
    "n": 10,
    "family": "Smoke",
    "title": "Монохромные экраны",
    "note": "Серые дымчатые мобильные экраны и тонкая подсветка элементов; мелкий низкоконтрастный текст не переносим.",
    "url": "https://mir-s3-cdn-cf.behance.net/project_modules/1400/ca03f3193208861.65e81935a7bf2.png"
  },
  {
    "n": 11,
    "family": "Объекты",
    "title": "Оранжевый за стеклом",
    "note": "Смещённые насыщенные формы позади прозрачных кругов и капсул показывают границу материала.",
    "url": "https://www.shutterstock.com/image-vector/three-glass-morphism-shapes-orange-260nw-2744129391.jpg"
  },
  {
    "n": 12,
    "family": "Light",
    "title": "Лавандовый плеер",
    "note": "Светлые панели на лавандовом фоне, круглые белые контролы и оранжевое основное действие.",
    "url": "https://cdn.dribbble.com/userupload/30366005/file/original-94409afe5d3bca66a6e18df05f26f4fe.png?format=webp&resize=400x300&vertical=center"
  },
  {
    "n": 13,
    "family": "Иконки",
    "title": "Неон под дымчатым слоем",
    "note": "Лаймовые объекты выступают из-за тёмных прозрачных иконок; небольшие острые блики.",
    "url": "https://cdn.dribbble.com/userupload/31100471/file/original-b31c3b187f99eb69ffa8b37c0a603728.png?format=webp&resize=400x300&vertical=center"
  },
  {
    "n": 14,
    "family": "Превью видео",
    "title": "Контраст температур",
    "note": "Оранжевый и пурпурный круги за погодной карточкой. Изучен статичный кадр; анимация неизвестна.",
    "url": "https://i.ytimg.com/vi/D97Kq3uZUeM/maxresdefault.jpg"
  },
  {
    "n": 15,
    "family": "Превью видео",
    "title": "Синяя двойная кромка",
    "note": "Прозрачная панель поверх синих объёмных фигур; двойной световой край. Движение не проверено.",
    "url": "https://i.pinimg.com/videos/thumbnails/originals/d9/8e/4e/d98e4e7dc5a6d71903a87f47026b851e.0000000.jpg"
  },
  {
    "n": 16,
    "family": "Smoke",
    "title": "Чёрное стекло чата",
    "note": "Тёмные мобильные экраны с небольшими лаймовыми действиями и локальными бликами.",
    "url": "https://mir-s3-cdn-cf.behance.net/projects/404/e1fb35206354759.Y3JvcCw0ODA3LDM3NjAsODMsMA.png"
  },
  {
    "n": 17,
    "family": "Frost",
    "title": "Фиолетовые сферы",
    "note": "Яркие сферы пересекают границу тонких мобильных панелей: чёткие снаружи, мягкие за стеклом.",
    "url": "https://i.pinimg.com/736x/f8/12/01/f81201c2118e84dbc46dd4af6973ba59.jpg"
  },
  {
    "n": 18,
    "family": "Liquid",
    "title": "Выпуклая кнопка",
    "note": "Графитовая капсула с выпуклым бликом и внутренней тенью; материал читается через край.",
    "url": "https://www.shutterstock.com/image-vector/glass-morphism-user-interface-element-260nw-2695273763.jpg"
  },
  {
    "n": 20,
    "family": "Light / liquid",
    "title": "Светлая библиотека контролов",
    "note": "Объёмные кнопки, поля и переключатели с пастельными бликами; переносим материал, а не текст макета.",
    "url": "https://i.pinimg.com/736x/e7/65/02/e76502e429fbd0d7356f9b6f28f64a1f.jpg"
  },
  {
    "n": 21,
    "family": "Liquid",
    "title": "Оптическая палитра",
    "note": "Цветные образцы и толстое прозрачное тело с радужными бликами; числовые подписи не являются CSS-спецификацией.",
    "url": "https://i.pinimg.com/originals/29/45/bc/2945bc28f65f99bf3a7dae5eaf4adb3c.png"
  },
  {
    "n": 22,
    "family": "Превью видео",
    "title": "Лавандовая линза",
    "note": "Прозрачная капсула деформирует видимую сетку. Статичный кадр After Effects, не доказательство web-реализации.",
    "url": "https://i.ytimg.com/vi/J9MORPelLZk/maxresdefault.jpg"
  },
  {
    "n": 23,
    "family": "Превью видео",
    "title": "Стеклянный сегмент",
    "note": "Скруглённые вкладки и полупрозрачный индикатор на пурпурном фоне. Движение по превью не подтверждено.",
    "url": "https://i.ytimg.com/vi/R0Z3SAL3l4o/maxresdefault.jpg"
  },
  {
    "n": 24,
    "family": "Dark / liquid",
    "title": "Неоновые компоненты",
    "note": "Тёмные поля и карточки, цианово-фиолетовые блики по краю, яркие локальные действия.",
    "url": "https://i.pinimg.com/736x/66/85/00/6685000f4544ef4da8e4ceb58684ccae.jpg"
  }
];
