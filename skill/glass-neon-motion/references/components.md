# Карта покрытия компонентов

Это taxonomy для выбора и приёмки, а не обещание, что каждый элемент реализован в прилагаемой демонстрации. Для выбранных строк добавь точный источник, preview URL/anchor, тему, состояния и статус: `live` — реально работает; `visual` — только макет; `recipe` — описан; `out-of-scope` — исключён. Карточка с кнопкой не доказывает keyboard/focus или backend.

| Семья | Элементы | Light / dark материал | Motion-рецепт | Обязательные состояния |
|---|---|---|---|---|
| Foundation | Grid, spacing, typography, icon, divider, surface, palette | Светлый плотный tint / тёмный smoked tint; декоративные неоны отдельно | Не требуется; смена темы по желанию | Узкий экран, 200% zoom, fallback |
| Shell | Header, desktop nav, mobile menu, sidebar, breadcrumb, footer | Glass только для навигационного слоя; footer может быть solid | Drawer/overlay, active indicator | Текущий пункт, длинные пункты, Escape, focus restore |
| Hero | Заголовок, subhead, primary/secondary CTA, optical object, trust note | Читаемый текст рядом с материалом, не внутри блика | Однократный вход объекта, конечный specular | Без JS, reduced motion, mobile crop |
| Content | Feature, bento, article, quote, testimonial, logo strip, statistic | Плотное чтение; glass у одного акцента | Мягкий reveal, без ожидания для основного текста | Длинный текст, отсутствующее изображение, источники фактов |
| Narrative | Process, timeline, steps, comparison, FAQ | Текстовая иерархия важнее декора | Expand, progress без scroll hijack | Keyboard, открытый/закрытый, мобильный порядок |
| Commerce | Pricing, plan comparison, product card, cart summary | Выбранный план имеет border/text/state, не только glow | Выбор тарифа, обновление суммы | Валюта/период, disabled, ошибки; demo без настоящей оплаты |
| Actions | Button, icon button, text link, split action | Контрастный solid action / яркий fill с тёмным text | Press, hover, finite success | Default, hover, focus, active, disabled, busy |
| Text input | Input, textarea, search, password | Плотное поле, различимая граница | Focus без задержки, clear feedback | Label, help, error, readonly, autocomplete |
| Choice | Checkbox, radio, switch, select, segmented control | Видимая форма и selected marker | Thumb/indicator shift | Keyboard, focus, checked, mixed если нужен |
| Range/date/files | Slider, date input, file input/dropzone | Native control допустим; glass снаружи | Progress/feedback | Клавиатура и alternative to dragging, ограничения файлов |
| Organization | Tabs, chips, filter, accordion, pagination, tree/list | Selected не только цветом; плотные labels | State/layout/expand | Correct semantics, arrows для tabs, focus сохранён |
| Data | Table, list, KPI, chart, legend, map | Плотный фон данных; glass не под плотной сеткой | Только осмысленное обновление данных | Подписи, таблица-альтернатива chart, overflow локально |
| Media | Image, video, gallery, carousel, product preview | Материал как рамка, не подмена содержимого | Crossfade, manual navigation | Alt/caption, pause, no autoplay audio, touch/key |
| Context | Tooltip, popover, dropdown, command menu | Плотнее родителя, достаточный z-index | Origin-aware enter/exit | Escape/outside click, focus, pointer crossing |
| Overlay | Dialog, sheet/drawer, confirmation | Scrim отдельно; диалог читаемый solid/glass | Overlay enter 180–280 ms как старт | Trap, Escape, close name, focus return, scroll |
| Feedback | Toast, inline alert, banner, validation, success/error | Tone + icon/text, не только neon | Короткое появление, без тряски формы | Live region по назначению, dismiss, читаемый срок |
| Async | Progress, loading, skeleton, empty/offline/error/retry | Стабильные размеры; skeleton необязателен | Конечный preview, реальный busy не декоративный | Reduced motion, timeout/retry, aria-busy |
| Motion atlas | Entrance, hover, press, focus, state, layout, expand, overlay, scroll, parallax, drag, progress, theme | Все эффекты показывать на обоих материалах | См. motion.md | Replay, interruption, static substitute, cleanup |

## Критичные детали по паттернам

- **Tabs:** либо действительно `tablist/tab/tabpanel` с клавишами, либо обычные кнопки-фильтры с `aria-pressed`. Не присваивай tabs-role декоративному ряду.
- **Dialog:** предпочитай native `<dialog>` или уже принятые accessible primitives. Проверяй focus trap/restore и Escape в реальном браузере. Не держи закрытый overlay кликабельным через одну opacity.
- **Forms:** label связан с полем; ошибка связана через `aria-describedby`; отправка отражает реальный результат. Demo пишет «локальная проверка, данные не отправлены».
- **Tooltip:** не единственное место важной информации; keyboard/touch имеют эквивалент. Hover-подсказка не должна исчезать при переходе указателя в неё.
- **Chart:** цветовой акцент не единственный код; есть подписи/легенда/доступные значения. Не называй декоративные полосы реальной аналитикой.
- **Carousel:** кнопки и клавиатура вместо drag-only; автопрокрутка по умолчанию выключена. Если разрешена, pause и предпочтения пользователя обязательны.
- **Loading:** busy связан с реальной операцией. Демо-анимация не симулирует отправленную заявку или успешную оплату.
- **Media:** размытие и свет не скрывают необходимый product detail. Отсутствующее изображение имеет понятный fallback и фиксированную геометрию.

Приёмка карты проверяет широту и честность статусов; приёмка сайта проверяет только реально реализованные элементы. Это отдельные результаты.
