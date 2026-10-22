# Рабочая UI-библиотека и полнота карты

## Отдельный слой вариативности

Сохраняй базовую карту семейств; вариации компонента считай отдельно. Для LUMA реализован самостоятельный слой из 44 live-local вариантов в 15 семействах (см. [component-variants.md](component-variants.md)), со своим manifest, стабильными ссылками и единым поиском. Материал Clear/Frost, край film/depth, плотность, форма и состояние — независимые оси; не перемножай число комбинаций и не называй каждую комбинацию новым компонентом.

Native progress означает ход задачи, meter — измеренную величину. Кольцевой/сегментный progress синхронизирует видимое число и aria-valuenow. Скроллбар сохраняет системную прокрутку, keyboard/touch и forced-colors; thin не гарантирует одинаковый вид в разных ОС. Прогресс чтения вычисляется по фактическому scroll range. Для долгих процессов нужны cancel/retry и честный неизвестный объём; учебный finite timeout не выдаётся за реальный upload.

Проверяй прерывание загрузки, bounds количества/шагов, state после persisted remount, фильтр+deep link, noJS, opaque fallback и live reduced. Общие search keywords не должны делать все варианты результатами узкого запроса. HTML recipe должен обозначать необходимые CSS/JS и границу локального сценария.

Применять при расширенном мудборде/каталоге компонентов; не навязывать все группы каждому лендингу. HTML-тег, готовый контрол, композиция страницы и motion-этюд — разные единицы покрытия. Счётчики не складываются.

## 24 группы

1. Основа: typography, grid, colors, 2D/3D, читаемая поверхность и fallback.
2. Иконки: согласованное семейство, regular/fill/duotone и толщины, размеры, назначение.
3. Кнопки: иерархия, icon/split/dropdown actions, loading/pressed/disabled.
4. CTA: hero, inline, banner, closing, sticky/mobile, contact/download/subscription.
5. Выбор: switch, checkbox/mixed, radio, segmented, chips, selection cards.
6. Ввод: label/placeholder/value/help/error, password, OTP, counter, units, textarea.
7. Селекторы: native select, autocomplete/combobox, multiselect, date/range/time/color.
8. Подсказки: inline hint, tooltip, rich popover, validation, coachmark.
9. Header: compact, multirow, floating/sticky, search/account, mobile transformation.
10. Навигация: burger/close, dropdown, drawer, sidebar, breadcrumb, TOC, bottom nav.
11. Footer: compact, multicolumn, contacts/social/legal, subscription, mobile disclosure.
12. Поиск/фильтрация: results, facets, chips, sort, reset, command palette.
13. Контент: cards, lists, avatar, badge, quote, stats, comparison.
14. Медиа/файлы: gallery/lightbox/carousel, playback, upload/preview/fallback.
15. Таблицы: sort/filter, selection/bulk, expandable/inline edit, pagination.
16. Графики: comparison/time/distribution/relationship/part-to-whole/hierarchy/flow/geography/monitoring.
17. Организация: tabs, accordion, tree, collapsible/split panel, master/detail.
18. Overlays: dialog/confirm, drawer/sheet, context menu, popover, fullscreen.
19. Feedback: alert/banner, toast, notification, undo, offline/retry.
20. Loading/empty: progress, spinner, finite skeleton, empty/no-results/error/stale.
21. Формы/сценарии: validation summary, wizard, review/confirm, dirty/save/cancel.
22. Коммерция: pricing/billing, comparison, cart/quantity/coupon, order flow.
23. Аккаунт/настройки: login/reset/OTP, profile, preferences, language/theme/consent.
24. Расширенные рабочие UI: calendar, Kanban/reorder, editor, comments/chat, files.

Группы описывают широту, а не обещают все варианты. Для текущего задания фиксировать точный manifest примеров и действий. Тип без реализации помечать planned, prepared recipe — только при наличии инструкции, visual — статический образец, live-local — проверенное локальное поведение. Не выдавать local auth/cart/message preview за подключённый сервис.

## Находимость — часть приёмки

Один глобальный индекс покрывает все разделы, включая input/state вне HTML-таблицы. Добавлять русские и английские названия и синонимы, стабильный ID и deep link. Ссылка должна раскрыть details и показать целевой элемент, даже после фильтрации. Пустой результат имеет reset; фильтры разных разделов не должны незаметно конфликтовать. Проверять реальные запросы «свитчер», «хинт», «плейсхолдер», «бургер», «footer», «chart», «solid».

## Контракты компонентов

- Switch имеет видимое двухпозиционное состояние и понятный результат. Mixed — checkbox, не третья позиция switch.
- Placeholder не заменяет label. Mask/prefix/suffix — отдельные аспекты поля; skeleton — ожидание.
- Tooltip показывает неинтерактивное пояснение по focus/hover, закрывается Escape; touch получает доступ к той же информации. Popover с интерактивным содержимым имеет отдельную модель управления.
- Burger — доступная button с expanded/controls, закрытие и возврат фокуса; не декоративные полоски без меню.
- Tabs связаны с панелями и имеют клавиатурную модель. Native controls предпочтительны там, где решают задачу; роли не заменяют поведение.
- CTA ведёт к конкретному результату; демонстрационные формы явно говорят, что данные не отправлены.
- Иконки берутся из проверенного семейства и сохраняют лицензию. Regular/stroke знака разрешён независимо от запрета декоративного outline стеклянной панели. Icon-only требует доступное имя.
- Для drag/reorder есть keyboard/touch альтернатива. После удаления, отмены, закрытия и изменения набора фокус остаётся в понятном месте.

## Графики

Проверять datasets, единицы/период/шкалы, легенду и числовую альтернативу. Различать 0, null и отсутствие данных. Изменение серии/набора обновляет и график, и таблицу. Отрицательные значения, пропуски, одну точку и большие диапазоны проверять по применимости типа; недопустимый набор получает понятное сообщение. Схематическая география называется схематической.

Стекло — контейнер, toolbar и tooltip; область кодирования данных плоская и читаемая. Толщина края карточки не даёт права искажать длину/площадь/цветовую шкалу. Заливка, штриховка/подписи и таблица дополняют цвет. Значения доступны без hover. Native SVG подходит небольшим учебным данным; ECharts/D3 — возможный выбор при потребности в масштабе и дополнительных типах, не обязательная зависимость навыка.

## Motion и lifecycle

Purpose → trigger → state → owner → timing → interruption → reduced substitute → cleanup. Действие меняет состояние сразу; один движок владеет свойством. Обновление графика сохраняет идентичность и не требует постоянного роста с нуля. У loading есть конец/отмена, не бесконечный декоративный цикл.

Системный reduced и ручное отключение учитываются до запуска и при изменении. Отмена анимации оставляет конечное семантическое состояние. При pagehide/dispose удалить listeners, timers, animations, object URLs; повторный mount/BFCache не удваивает обработчики. Читать статический пример можно до JS. Несуществующие без JS действия явно отключены.

## Приёмка

Матрица: семейство → stable ID → действие → ожидаемый результат → фактическая проверка. Минимум один реальный сценарий каждого заявленного рабочего примера; существенные варианты проверять отдельно. Затем desktop/mobile light/dark, 2D/3D, keyboard/touch, long text/zoom, reduced live, solid/forced colors, assets/errors. Автор проверяет собственную реализацию, другой агент делает независимую приёмку; не смешивать эти результаты. Исправления перепроверяются по affected scope. Git push, Pages deployment и внешний browser read-back — отдельные ворота.

Первичные ориентиры: [W3C APG](https://www.w3.org/WAI/ARIA/apg/patterns/), [сложные изображения](https://www.w3.org/WAI/tutorials/images/complex/), [Web Animations](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
