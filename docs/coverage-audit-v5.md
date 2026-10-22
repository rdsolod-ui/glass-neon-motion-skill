# Glass Atlas: аудит покрытия и карта расширения V5

Дата: 2026-10-21. Статус: **предложение к реализации, не опубликованный релиз**.

Основание: замечание Ивана о переключателях, подсказках, плейсхолдерах, графиках, CTA, header/footer, burger и семействах иконок. Проверены исходники и публичный мудборд V4. Базовый HEAD: `bc3ba5b081493fc563f034ecbe4f1806e37d2097`; исходники сайта V4: `0745ae776192d9c9d259f093de871db7b74f4791`.

## 1. Вывод аудита

Текущий атлас шире справочника материалов, но ещё не является полной библиотекой UI. 113 HTML-тегов, SVG/MathML, 22 типа input, 12 групп состояний, 48 композиций и 39 motion-этюдов измеряют разные вещи. Эти числа нельзя складывать в показатель полноты интерфейсных компонентов. Успешные проверки V4 подтверждают проверенные сценарии, а не отсутствие пробелов в каталоге.

Обнаружены две отдельные проблемы: часть компонентов отсутствует как рабочее семейство; часть одиночных примеров существует, но спрятана в других разделах и не находится общим поиском.

| Запрос Ивана | Что есть в V4 | Чего не хватает |
| --- | --- | --- |
| Свитчеры | Один native checkbox с `role="switch"` в HTML states; выглядит как checkbox и меняет только собственное состояние. Есть отдельные переключатели оболочки | Выделенная семья с настоящим switch-оформлением и понятным результатом; on/off, disabled, focus, busy; подпись/описание; размеры; RU/EN поиск |
| Хинты | Helper/error text; native popover «О материале» | Отдельные tooltip по hover и focus, inline hint, rich popover, coachmark; правила touch/Escape и позиционирования |
| Плейсхолдеры | Текстовые placeholders внутри нескольких полей | Самостоятельная карта: empty field, маска, prefix/suffix, skeleton, image/content placeholder; связи с label/helper/error |
| Графики | Визуальная схема и рецепт «График и легенда» с условными CSS-столбцами; motion bars/number/ring | Рабочие datasets, шкалы, оси, легенда, выбор диапазона, альтернативная таблица и библиотеки типов |
| CTA | Кнопки и hero/actions сайта; отдельные композиции | CTA как самостоятельный раздел: hero, inline, banner, closing, sticky/mobile, subscription/contact/download |
| Header | Композиция pattern-8 и один настоящий header сайта | Варианты структуры, sticky/floating, двухуровневый, centered/split, поиск/аккаунт, мобильная трансформация |
| Footer | Композиция pattern-14 и footer сайта | Compact, multi-column, newsletter, contact/social/legal, mobile accordion; точная ссылка на демо вместо `index.html#main` |
| Burger | Композиция pattern-9; мобильное меню сайта с текстовой кнопкой | Burger/close, menu-button, drawer, fullscreen, bottom sheet; открыто/закрыто, клавиатура, focus return |
| Иконки | Текстовые символы, CSS-фигуры, отдельная SVG-галочка | Одно согласованное SVG-семейство с regular/fill/duotone и толщинами; назначение, размеры, состояния, подписи |

Браузерное подтверждение поиска: запрос «свитчер» в `#ha-search` дал «0 элементов», хотя одиночный switch присутствует в states. После проверки поиск очищен, список восстановлен до 115 элементов. Поиск HTML ограничен своим реестром; input- и state-карточки в него не входят. Три раздельных поиска не заменяют индекс всего мудборда. Наличие placeholder или ARIA-роли само по себе не доказывает законченный компонент.

Все 48 миниатюр исходного каталога — схемы из span/div с `aria-hidden`. Связанный live-пример по ссылке нужно оценивать отдельно: он может не реализовывать все варианты схемы. Состояниям нужны собственные anchor, а deep links HTML-элементов должны раскрывать соответствующий details.

Исходные точки проверки: [catalog.js](../site/catalog.js), [HTML generator](../scripts/html-atlas-section.mjs), [visual previews](../scripts/atlas-previews.mjs), [motion generator](../scripts/motion-atlas-section.mjs), [motion runtime](../site/motion-atlas.js), [опубликованный мудборд](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html).

## 2. Новая структура: 24 группы UI

Это целевая карта с тремя уровнями: **основа → компоненты → композиции и сценарии**. Название в таблице не означает, что компонент уже собран. Подварианты разделяют конкретные задачи; одинаковый компонент получает теги, а не дублируется ради счётчика. Placeholder, маска и prefix/suffix — отдельные аспекты поля; skeleton относится к ожиданию, а CTA — к композициям. Их связываем тегами, не объявляя вариантами одного компонента.

| № | Группа | Подгруппы и примеры |
| --- | --- | --- |
| 01 | Основа и материал | Typography, headings, body, links, lists, code, spacing/grid, dividers, color roles; light/dark; 2D film и 3D edge; solid/forced-colors fallback |
| 02 | Иконки и знаки | Regular, fill/solid, duotone, thin/light/bold; navigation/action/status/media/data/commerce; icon-only, icon+label, badge; 16/20/24/32 |
| 03 | Кнопки и действия | Primary, secondary, quiet/ghost, link, destructive, icon button, split button, dropdown action, group, FAB; loading/success/disabled |
| 04 | CTA-блоки | Hero CTA, inline action, promo banner, section/closing CTA, sticky CTA, mobile bottom CTA, download/contact/subscribe, price CTA |
| 05 | Переключение и выбор | Switch, checkbox, mixed checkbox, radio, toggle button, segmented control, choice chips, selectable card, rating; single/multi selection |
| 06 | Поля и ввод | Text, textarea/autogrow, search/clear, password/reveal, OTP, numeric/stepper, units, mask, prefix/suffix, counter, readonly; placeholder и заполненное состояние |
| 07 | Селекторы | Native select, custom listbox/combobox, autocomplete, multiselect chips, grouped/async options, cascader/tree select, date/time/range/color picker, slider/range slider |
| 08 | Подсказки и объяснения | Inline hint, helper text, validation message, tooltip, rich popover, info label, character counter, coachmark/spotlight; длинный текст и края viewport |
| 09 | Header | Compact, centered/split, двухуровневый, sticky, floating glass, contextual; logo/nav/search/account/language; desktop → mobile |
| 10 | Навигация и меню | Burger/menu button, dropdown/mega menu, drawer/fullscreen menu, bottom navigation, sidebar/rail, breadcrumbs, TOC, anchor navigation, back-to-top |
| 11 | Footer | Minimal, multi-column, newsletter, contact/social/legal, product/app footer, sitemap; mobile accordion и compact |
| 12 | Поиск и фильтрация | Global search, command palette, autocomplete results, facets, filter chips, sort, filter drawer, saved view; no results, reset, count |
| 13 | Контент и карточки | Text/image/product/profile/article cards, feature grids, list items, testimonial/quote, stats, comparison, timeline, avatar/group, badge/tag/chip |
| 14 | Медиа и файлы | Image/figure/caption, gallery/lightbox, carousel, video/audio controls, file item/preview, upload/dropzone, crop/preview; fallback/broken/loading |
| 15 | Таблицы и списки данных | Static table, sortable/filterable table, selection/bulk actions, pagination/load more, expandable row, inline edit, pinned columns, tree table; long/empty/loading/error |
| 16 | Графики и дашборды | Девять семейств ниже; KPI/sparkline, chart card, shared filters, comparison; actual dataset, legend, units и доступная таблица |
| 17 | Организация содержимого | Tabs, accordion/disclosure, tree, collapsible panel, split panel/resizer, card/list switch, master/detail; раскрытие и сохранение контекста |
| 18 | Наложения и окна | Dialog, alert dialog, confirmation, drawer, bottom sheet, popover, context menu, fullscreen view; backdrop, dismiss, focus trap/return по назначению |
| 19 | Обратная связь | Alert/banner, toast/snackbar, notification center, inline status, success/error, undo, offline/reconnect, retry; объявление статуса без захвата фокуса |
| 20 | Ожидание и отсутствие данных | Spinner, progress determinate/indeterminate, skeleton, shimmer с остановкой, empty/no-results/error states, image/content placeholder, optimistic/pending/stale |
| 21 | Формы и сценарии | Fieldset/legend, validation summary, multistep form/wizard, stepper, review/confirm, save/cancel/dirty state, onboarding; корректные label/help/error связи |
| 22 | Коммерческие блоки | Pricing, billing switch, comparison, product/options, quantity/cart, coupon, checkout steps, order/status; демонстрация без ложных платежей/отправки |
| 23 | Аккаунт и настройки | Login/register/reset/OTP/SSO layouts, profile/avatar menu, preferences, theme/language, privacy/consent, session states; явно local demo без настоящей auth |
| 24 | Расширенные рабочие интерфейсы | Calendar/scheduler, Kanban, drag-and-drop/reorder с альтернативой, comments/chat, rich-text editor, activity feed, file manager; отдельный необязательный слой |

HTML-реестр сохраняется как техническая вкладка. Он не должен быть основным способом поиска кнопки, tooltip или footer.

## 3. Карта графиков и чартов

«Все существующие графики» — открытое множество вариантов. Покрытие лучше определять задачами, именованным списком и статусами реализации.

| Семейство / задача | Типы |
| --- | --- |
| Сравнение | Bar/column, grouped bar, dot/lollipop, dumbbell, slope, ranked small multiples |
| Время и динамика | Line, step, area, stacked area, range/band, event timeline, small multiples |
| Распределение | Histogram, box plot, violin, strip/beeswarm, ECDF, density |
| Связь переменных | Scatter, bubble, correlation heatmap, parallel coordinates; scatterplot matrix |
| Доли и вклад | Pie/donut, stacked/100% stacked bar, waffle, waterfall; ограничения сравнения площадей |
| Иерархия | Tree, treemap, sunburst, icicle |
| Потоки и связи | Sankey, alluvial, chord, node-link/network |
| География | Choropleth, proportional symbols, density map, flow map; источник геометрии и легенда |
| Мониторинг и цели | KPI + sparkline, bullet, control chart, status timeline, gauge с явно указанной шкалой |

Специализированные варианты получают отдельные теги: funnel/conversion, cohort и calendar heatmap, Gantt/resource timeline, candlestick/OHLC, radar/polar/rose, contour. Они не должны исчезать из карты, но не обязаны все входить в первую рабочую поставку. Настоящие 3D/scientific charts — отдельное расширение с обоснованием задачи; 3D-кромка карточки не означает 3D-кодирование данных.

Первый законченный набор предлагается ограничить 12 рабочими образцами: sortable bar, grouped bar, line с пропусками, histogram, scatter, donut, 100% stacked bar, treemap, Sankey, choropleth, bullet + sparkline, control chart. Вариант без подготовленной инструкции имеет статус «запланировано»; с конкретной инструкцией сборки — «рецепт»; после реализации и проверки — «рабочий пример».

Для каждого рабочего графика обязательны:

- Назначение, единицы, период, тип шкалы, легенда, источник либо явная метка «демоданные».
- Управление сериями/набором, reset и таблица значений; zoom/brush/drilldown только там, где полезны.
- Различие нуля, `null` и отсутствующих данных; одна точка, длинные подписи, плотный набор и выбросы. Отрицательные и крайние значения проверяются по применимости типа, включая понятный отказ для недопустимого набора.
- Loading, updating, empty, partial/stale, error/retry; видимое время обновления для live-сценариев.
- Смысловое текстовое описание и доступ к значениям без hover; keyboard/touch и различение серий не только цветом.
- Спокойная плоская область данных. Стекло применяется к оболочке/toolbar/popover; blur, блики и толщина не искажают длину, площадь и цветовую шкалу.

## 4. Иконки: два независимых измерения

Геометрия: одно согласованное семейство, regular, fill (solid), duotone; thin/light/bold для сравнения. Кандидат — локальные выбранные SVG Phosphor, без загрузки всего icon font. Фактические лицензия и версия фиксируются при реализации.

Материал носителя: flat, прозрачная 2D-плёнка без контура, 3D-плитка с локальной кромкой, неоновый акцент. Значимый знак остаётся чётким и не размывается ради стекла. Regular/stroke внутри иконки не нарушает запрет базового outline вокруг стеклянной панели; keyboard focus и системные forced-colors контуры также сохраняются. Размер, optical alignment, focus, disabled, selected и подпись проверяются отдельно. Для icon-only control требуется доступное имя; декоративный значок не дублирует текст для скринридера.

## 5. Матрица состояний и motion

Не нужен механический полный декартов продукт каждого компонента. Для семейства выбираются применимые состояния и объясняются исключения.

Состояния: default, hover, focus-visible, pressed, selected/checked, expanded, disabled, readonly, loading, empty, error, success. Switch двоичный; mixed относится к checkbox. Placeholder — пример ввода, а не замена label. Tooltip и интерактивный popover — разные компоненты.

Контексты: light/dark; 2D/3D при применимости; desktop/mobile; keyboard/touch; reduced motion до загрузки и при живом изменении; reduced transparency/solid fallback; forced colors; длинные русские/латинские подписи; zoom и узкий экран.

Существующие 13 motion-групп сохраняются. Расширение привязывается к настоящим состояниям компонентов:

| Сценарий | Что показываем | Прерывание / reduced substitute |
| --- | --- | --- |
| Кнопка и действие | Press, busy → success/error, иконка состояния | Короткий feedback; состояние обновляется и без движения |
| Switch и выбор | Thumb, track, selection indicator | Последний ввод побеждает; без движения сразу новое состояние |
| Hint/popover | Появление по focus/hover/click, разные стороны | Корректное закрытие; touch не зависит от hover |
| Навигация | Burger ↔ close, drawer/fullscreen, active section | Повторный toggle не ломает состояние; focus return |
| Контент | Однократный reveal, accordion/tab content | Видимый контент без JS/reduced; отмена вне страницы |
| Layout и сортировка | Reorder, master/detail, card/list, row movement | Стабильные ID, сохранённый focus, мгновенный reduced |
| Окна | Dialog/sheet transition, backdrop | Dismiss во время входа; focus/scroll lock освобождены |
| Форма | Step transition, validation, save status | Сохранение введённого; ошибка не только цветом/тряской |
| Асинхронность | Progress, skeleton → content, retry, undo | Статический reduced; нет бесконечного декоративного shimmer |
| Данные | Update, filter/legend, sort, drilldown | Не «рост с нуля» при каждом обновлении; latest data wins |
| Прямой ввод | Drag, slider, brush/zoom, resizer | Без декоративного отставания; keyboard alternative |
| Оптический акцент | Локальный блик/глубина на взаимодействие | Ограниченная длительность; убрать в reduced, без вечного дрейфа |

Каждая анимация описывает purpose, trigger, state, engine/property owner, timing, interruption, reduced substitute и cleanup. Один движок владеет одним свойством. Replay-этюд не получает статус законченного компонента только из-за сходного движения.

## 6. Как сделать карту действительно находимой

1. Первый экран — индекс UI-групп, включая явно видимые «Переключатели», «Подсказки», «Графики», «Header», «Footer», «Иконки».
2. Один глобальный поиск по группам, вариантам и состояниям, с RU/EN синонимами: switch/свитчер/переключатель; hint/tooltip/подсказка; chart/график/диаграмма; burger/меню.
3. Отдельные вкладки: UI-компоненты, графики, иконки, motion, HTML/семантика, референсы. Счётчики не смешиваются.
4. Карточка ведёт к реальному specimen по постоянному anchor. Ссылки проверяются на конкретный блок, а не просто главную страницу.
5. Фильтры: группа, light/dark, 2D/3D, interactive/visual/recipe/planned, desktop/mobile, engine. Контекст не сбрасывается после закрытия детали.
6. Пустой результат предлагает синонимы/сброс, а найденный существующий specimen не скрывается из-за поиска только в тегах.

Статусы строго различаются: **рабочий пример** (поведение реализовано и проверено), **визуальный образец** (внешний вид), **рецепт** (описание сборки), **запланировано** (карта). Статус задаётся отдельному образцу, не всей семье по одному удачному примеру.

## 7. Приоритет реализации и команда

**P0 — замечания Ивана и находимость:** глобальный индекс/поиск; switches, hints, placeholders; header/footer/burger; CTA; иконки; первые базовые chart-примеры. Сразу добавить состояния, light/dark и keyboard/touch, не откладывать их до конца.

**P1 — полноценная библиотека сайта:** поля/селекторы, forms, search/filters, tables, overlays, feedback/empty/loading, content/media, весь первый набор из 12 графиков, связанная motion-матрица.

**P2 — расширенные рабочие сценарии:** Kanban/calendar/editor/chat, сложные picker/tree-grid, специализированные chart-рецепты. Выделять самостоятельно, чтобы не перегружать базовый сайт.

Распределение существующих ролей при реализации: `glass_design` — таксономия и материал; `glass_moodboard` — индекс и specimens; `glass_site` — переиспользуемые контролы/поведение и примеры в LUMA; `glass_skill` — правила покрытия и использования; `glass_qa` — независимая приёмка по семействам; `glass_release` — только принятые изменения и публикация по прежним URL. При четырёх слотах задачи идут пакетами с явным владением файлами; автор не принимает собственную работу как независимый рецензент.

В текущем аудите два реальных collaboration-исполнителя отдельно проверили UI/находимость и charts/icons/motion; это не новая проверка native discovery и не создание новых ролей.

Критерий готовности следующей поставки: каждый заявленный рабочий specimen найден глобальным поиском, имеет правильный anchor, реальные состояния, проверенный сценарий и честный статус. Отдельно принимаются полнота карты, визуальное стекло, поведение, адаптивность и публикация. Документированная группа не считается собранной.

## 8. Библиотеки: кандидаты, не установленные зависимости

Текущий HTML/CSS/JS/WAAPI стек сохраняется. Для простых UI достаточно native controls, CSS и имеющегося lifecycle. Кандидат основной аналитики — Apache ECharts с dataset и обновлением setOption; D3 — только при конкретной потребности в нестандартной геометрии. Выбранные SVG и chart-модули подключаются локально с закреплённой версией и лицензией. Chart engine владеет геометрией данных, CSS/WAAPI — внешней оболочкой. ARIA-режим графической библиотеки не заменяет keyboard/touch и таблицу значений.

## 9. Источники и пределы

Таксономия — проектное предложение, сопоставленное с первичными источниками; это не копирование компонентной библиотеки и не обещание их готовности:

- [W3C APG patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) — модели поведения составных контролов; применение требует конкретной проверки.
- [Atlassian components](https://atlassian.design/components/) — сверка пропущенных групп UI, без выбора этой библиотеки как зависимости.
- [W3C: complex images](https://www.w3.org/WAI/tutorials/images/complex/) — краткие и расширенные альтернативы сложным изображениям/графикам.
- [Phosphor weights](https://github.com/phosphor-icons/web#weights), [SVG sources](https://github.com/phosphor-icons/core) — реальные варианты семейства.
- [ECharts dataset](https://echarts.apache.org/handbook/en/concepts/dataset/), [dynamic data](https://echarts.apache.org/handbook/en/how-to/data/dynamic-data/), [accessibility](https://echarts.apache.org/handbook/en/best-practices/aria/) — кандидаты для реализации данных.
- [D3](https://d3js.org/what-is-d3) — модульная работа с данными/визуализацией, не готовый набор доступных UI-компонентов.

На этом этапе подготовлены аудит и карта. Новые компоненты, библиотеки, skill-правила и сайт не изменялись; сборка/деплой не выполнялись. Публичные URL продолжают показывать V4. Физические устройства и полный accessibility-аудит в этой работе не проверялись.
