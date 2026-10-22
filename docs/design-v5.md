# Glass Atlas V5 — рабочая библиотека

Дата: 2026-10-22. Brief: все 24 группы согласованной карты, рабочие локальные примеры, единый поиск, связанные motion-состояния, обновление skill и публикация по прежним URL.

## Композиция и источники

Сохраняется утверждённая V4 art direction и 23 референса Ивана, оригинальные optical studies и Manrope с кириллицей/OFL. Новая эстетическая подборка не нужна: задача расширяет уже выбранный материал. Источники hero/pricing/nav/CTA/footer остаются в site/catalog.js; новая библиотека добавляет собственные композиции и семантическое поведение, не копирует gallery assets.

Главный вход теперь 24 UI-группы перед справочником тегов. Один поиск покрывает UI, HTML, input/state, motion, визуальные композиции и референсы. Группы раскрываются отдельно; постоянные ссылки открывают нужный пример. Одиночные старые поиски скрыты, фильтры по категориям сохранены. Счётчики UI/HTML/motion раздельны.

## Материал и типографика

2D — без декоративного outline/bevel; отдельный 3D-режим добавляет направленные края. Blur вынесен на ::before ниже содержимого, чтобы избежать регрессии V4 с пропадающим текстом. Длинные подписи и данные получают плотную внутреннюю поверхность. Dark/light имеют самостоятельные fills; функциональный focus и forced-colors контуры сохраняются.

Существующие Manrope/Segoe UI, inputs 16px, line-height 1.6, tabular-nums для значений. Desktop — 4 колонки индекса и 2 specimen, mobile — 2 колонки индекса и 1 specimen. Контролы не менее44px где применимо. Никакого внешнего icon font; выбранные лицензированные SVG локально.

## Motion контракт

Действие меняет состояние сразу. Короткий 160–300ms CSS/WAAPI отклик объясняет изменение. Root api.animate отменяет прежние анимации элемента, учитывает reduced при загрузке и изменении, выключает их при pagehide/hidden; модули возвращают cleanup listeners/timers/blob URLs. Нет infinite drift/shimmer. Keyboard/touch не ждут окончания анимации. Графики не проигрывают рост с нуля при каждом обновлении.

Технические первоисточники: [APG](https://www.w3.org/WAI/ARIA/apg/patterns/), [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API), [native modal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal). Наличие ARIA само по себе не доказывает доступность.

## Ownership и приёмка

Coordinator: generator интеграция, ui-atlas оболочка/поиск/lifecycle, shared tokens, checks, skill и release. Controls agent: ui-controls generator/runtime/CSS, 12групп. Composition agent: ui-compositions + selected iconassets, 10групп. Data agent: ui-data, таблицы и12SVG charts, 2группы. Последующая взаимная приёмка — другой исполнитель; текущий collaboration fallback контрактов отдельно от ранее доказанных native6roles.

Gate: не только счётчик, но реальные изменения switch/tooltip/input/menu/dialog/forms/table/chart/cart/workspace; RU/EN search и deep links; 320/390/768/1440; light/dark/2D/3D; live reduced, solid/forced colors; noJS static; errors/assets; источник, push, deploy и public read-back отдельно. Конечный результат и ограничения фиксируются после QA, не заранее.

## Уточнение материала, 22 октября

По просьбе Ивана добавлены прозрачная глянцевая плёнка и прозрачное глянцевое стекло. Рассеивание и край — независимые оси. Четыре авторских сравнительных этюда используют одинаковый фон. Clear: 0.8px diffusion, слабый tint и узкое направленное отражение; Frost:16px diffusion. Плёнка без фаски; стекло с локальной внутренней гранью. Это CSS-имитация, не физическая рефракция. Читаемые wells сохраняются в обеих темах.
