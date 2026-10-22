# Вариативность готовых компонентов

Расширяй готовые решения отдельным слоем поверх базовой карты, а не переименованием существующих примеров. Семейство отвечает на вопрос «какую задачу решает», вариант — «какая композиция и поведение», состояние — «что сейчас происходит». Clear/Frost, film/depth, светлая/тёмная тема, плотность и форма — независимые оси. Не перемножай оси ради счётчика компонентов.

## Практическая карта

| Семейство | Варианты | Проверяемое действие |
|---|---|---|
| Progress | linear, slim, ring, segments | value, видимое число, aria-valuenow |
| Scroll | native, thin, horizontal snap, reading progress | keyboard/touch, края диапазона |
| Loading | spinner, dots, skeleton, empty→ready | finite run, cancel, повтор, reduced |
| Steps | horizontal, vertical, compact | next/back, bounds, remount |
| Buttons | hierarchy, pressed, sizes, disabled/danger | результат, pressed, доступность |
| Fields | units, quantity, counter, validation | границы, подпись, ошибка/focus |
| Cards | metric, selection, disclosure | обновление, checkbox, details |
| Status | badge, chips, meter, inline notice | текстовый смысл независимо от цвета |
| Pagination | numbered, load more | состав выдачи, current, конец |
| Timeline | vertical, horizontal | текущий этап и пояснение |
| File queue | list, cards | добавить, предел, обработка, удалить, очистить |
| Notifications | unread center, remove/undo | счётчик, восстановление, focus |
| Rating | radio stars, numeric score | keyboard radio, диапазон, доступное имя |
| Range | price, percentage | две нативные границы, запрет пересечения |
| Split panes | columns, rows | пропорции, reset, keyboard scroll |

Проектный manifest LUMA содержит 44 live-local варианта в 15 семействах. Общая UI-карта 24 групп / 76 примеров и визуальные рецепты считаются отдельно. Служебные счётчики должны выводиться из manifest, а не из числа тем и комбинаций.

## Контракты и границы

- Native progress — ход задачи, meter — измеренная величина. Не показывай выдуманный процент неизвестной загрузки. Для кольца/сегментов нужны точное число и семантика progressbar.
- Системные scrollbars сохраняют native scroll, Tab, стрелки, touch и forced colors. Явно фокусируй прокручиваемые текстовые области через tabindex=0 и давай доступное имя. Оформление и толщина зависят от платформы.
- Диапазон из двух native range — честный вариант с двумя дорожками, не полноценный custom dual-thumb slider. Ограничивай пересечение, сохраняй подписи единиц и клавиатуру.
- Изменение split pane можно управлять native range вместо drag-only separator. Прокручиваемые панели должны иметь собственный фокус и имя. Не объявляй реализованным drag-resize, если доступен только ползунок.
- Очередь файлов может быть metadata-only demo. Выводи file.name через textContent, ограничивай размер списка. Не читай, не отправляй и не сохраняй содержимое без необходимости задачи. Ручное изменение demo progress не выдаётся за upload.
- При удалении, отключении активной кнопки, достижении границы и undo оставляй фокус в понятном месте; aria-live не заменяет focus management.
- После persisted pageshow синхронизируй кнопки с сохранённым состоянием, а не стартовыми константами. Cleanup должен отменять timers/animations/listeners; dispose не должен оставлять скрытые операции.
- Предоставляй код с явными зависимостями. HTML образца с внешним CSS/JS не называй автономным файлом. Текст рецепта не исполняется как HTML.

## Приёмка расширения

Проверяй реальные действия, direct links после фильтра, RU/EN search без общих предметных тегов, длинные имена файлов, 0/max, повтор/отмена, light/dark, 320/390/768/1440, четыре материала, noJS, reduced до load и live, opaque/forced-colors fallback. Не выдавай desktop touch emulation за физический телефон или отсутствие console errors за accessibility certification.

Приоритет следующего расширения задаёт brief: breadcrumbs/TOC, avatar groups, command palettes, data-grid density, chart miniatures, drag/drop с keyboard alternative. Сами названия не являются готовыми решениями; для каждого нужен manifest и тест поведения.
