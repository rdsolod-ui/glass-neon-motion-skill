# Motion Atlas — 39 этюдов в 13 группах

Дата: 2026-10-21. Автор реализации: `/root/motion_atlas_v3`, профиль `glass_site` через collaboration fallback. Независимая приёмка оформляется отдельно; собственная проверка не равна независимой.

## Состав и границы

Интеграция: `motionAtlasSection()` из `scripts/motion-atlas-section.mjs`; `site/motion-atlas.css` и module `site/motion-atlas.js`. Секция `#motion-atlas`, namespace `ma-`. Источники данных: `motionGroups` и `motionExamples` в генераторе секции.

| Группа | Три самостоятельных образца |
|---|---|
| Обратная связь | нажатие, SVG-подтверждение, коррекция ошибки |
| Вход и выход | подъём, выход/возврат, clip-path раскрытие |
| Перестройка | смена порядка, раскрытие, общий элемент |
| Навигация | индикатор вкладки, breadcrumbs, drawer |
| Прокрутка | **настоящий scroll box и прогресс**, parallax-сценарий, sticky-сценарий |
| Типографика | слова целиком, underline, замена подписи |
| SVG / пути | draw path, оборот маркера, изменение прямоугольника |
| Данные | столбцы, роллер значения, кольцевая доля |
| Ожидание | skeleton→content, конечный ритм точек, progress |
| Жесты | **настоящий pointer slider с клавиатурой**, snap-сценарий, swipe-сценарий |
| Свет и стекло | локальный блик 3D, объект за 2D-плёнкой, спектр |
| Объём | tilt, разбор слоёв, перевод переднего плана |
| Хореография | stagger, последовательность процесса, hero-композиция |

37 этюдов воспроизводят конечный визуальный сценарий через WAAPI. Два — прямое DOM-взаимодействие. Это **не** готовая библиотека dialog/tablist/carousel/validation, не физическая рефракция, не измеренная spring-модель и не scroll-framework. Карточки явно обозначают границы схемы и нативного live-управления. Семантические компоненты изучаются отдельно в HTML Atlas.

Каждый рецепт содержит назначение, HTML-применение, продуктовый trigger, реальный trigger образца, владельца свойств, длительность, прерывание, reduced substitute и cleanup. Длительности — локальное дизайнерское решение, не универсальные нормативы. Статический HTML содержит все примеры и рецепты; JavaScript добавляет поиск, фильтр и движение. Данные в графиках демонстрационные.

## Жизненный цикл и доступность

- Один WAAPI-этюд одновременно; новый replay отменяет предыдущий. Все сценарии конечны, длительность до 1800 мс. Автозапуска нет.
- `#ma-reduce`, OS `prefers-reduced-motion` и проектный `html[data-reduce=true]` объединяются через OR. Смена любого источника отменяет transform, opacity, stagger и остальные активные WAAPI, возвращая статичный CSS-кадр. Прямые scroll/slider остаются доступны без инерции; кнопка прокрутки в reduced использует мгновенный переход.
- Отмена на фильтр, Stop, уход активной карточки из viewport, `visibilitychange`, `pagehide`. Возврат `pageshow` восстанавливает observers для BFCache. Возвращаемый из `initMotionAtlas` disposer отменяет эффекты, удаляет listeners и отключает observers.
- Scroll `.ma-scroll`: колесо/touch/клавиши в ограниченной области; listener владеет scaleX шкалы. Никакого глобального перехвата прокрутки.
- Slider `.ma-drag-knob`: pointer capture, горизонтальная координата, `touch-action: pan-y`, диапазон 0–100, ARIA value; ←/→ по 5, Shift по 10, Home/End. На cancel/скрытие capture освобождается. Resize пересчитывает пиксельную координату.
- 2D-плёнка не имеет декоративной обводки; 3D использует локальные inset-свет/тень. Focus-visible и forced-colors контуры функциональны и сохраняются.
- `html[data-solid=true]`, `prefers-reduced-transparency`, отсутствие backdrop-filter задают непрозрачные поверхности; обе темы используют собственный stage/ink.

## Проверенные первичные источники

На 2026-10-21 открыты [Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [Animation.cancel](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel), [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion). Исходные образцы написаны самостоятельно. Новые npm-зависимости не добавлены.

## Проверки

`node --check` для обоих JS-модулей прошёл. Генератор возвращает 13 групп и 39 примеров. Собственная браузерная проверка `qa/motion-v3/report.json`: **61/61**, включая запуск каждого из 37 WAAPI, завершение/отмену, нативную прокрутку, pointer и keyboard slider, 1440/768/390/320 px в обеих темах, solid/forced-colors и reduced. Исправлена локальная настройка reduced: теперь она подавляет также CSS-hover кнопок. Скриншоты desktop/mobile просмотрены.

В первом reused-page прогоне получен непостоянный результат OS-before-load; отдельный fresh context с `reducedMotion: reduce` до navigation показал `match=true`, `data-reduce=true`, 0 анимаций; повтор полного прогона прошёл. Причина первого расхождения не установлена; итоговая интеграционная проверка проводится отдельно, без параллельной смены media.

Независимая перекрёстная проверка HTML Atlas этим исполнителем: **26/26**, в `qa/html-cross-v3/report.json`: все раскрытые preview на четырёх ширинах/двух темах без overflow; native select, label/focus, local form, output, dialog Escape/focus return, toggle/loading, поиск, фильтр и 2D/3D/solid/forced-colors. Исполнитель не является автором HTML Atlas. Это Chromium-проверка, не сертификат WCAG и не физический телефон.
