# V5 — независимая приёмка композиционных групп и сайта

Дата: 2026-10-22. Reviewer `controls_finish`, автор `compositions_finish`. Координатор отвечает за общий сайт и материал. Reviewer не редактировал проверяемые composition/material/site modules.

Воспроизводимый сценарий: `tests/ui-v5/peer-compositions.cjs`. Настоящий Chromium через выделенный CDP, отдельный browser context. Проверены все 25 composition specimens: foundation, icons, CTA, header, navigation, footer, content, media, commerce, workspace. Проверка не подменяет production auth/payment/subscription; эти сервисы не подключены.

## Фактическая проверка

- Переключение темы/акцента/плотности; шесть SVG начертаний Phosphor; favorite и связанная корзина.
- Hero CTA, закрытие и восстановление баннера, contextual CTA; реальные якоря шапки/подвала/breadcrumb; burger по клику, Escape и touch tap на 390 px.
- Пагинация меняет набор записей, rail меняет текст; newsletter проверяет учебные данные локально; FAQ раскрывается и список фильтруется.
- Галерея вперёд/назад без autoplay. Upload принимает реальный PNG-буфер, браузер декодирует ширину 1 px, очистка удаляет preview.
- Корзина считает 120 + 240 = 360 ₽, увеличение количества → 480 ₽, очистка → 0 ₽. Цены демонстрационные.
- Kanban: Alt+стрелки и кнопки действительно перемещают карточку. Календарь переключает на ноябрь 2026 (30 дней), ArrowDown и Enter выбирают 8 ноября. Редактор создаёт DOM-заголовок и `strong`, очистка удаляет текст.
- Все четыре материала на главной проверены в светлой/тёмной темах. Фактический `backdrop-filter`: frosted 16 px, clear 0,8 px; у 2D/3D различные `box-shadow`, базовый border — 0 px.
- Mobile 390×844 без горизонтального overflow; desktop 1440×1000. Reduced-before-load выставлен через `page.emulateMedia` и проверен `matchMedia`. Live reduced отменяет активные анимации главной.
- 25 сценариев поведения пройдены; pageerrors — 0. Обнаружено одно замечание состояния темы (ниже).

## Визуально просмотренные кадры

Локальные ignored-файлы `qa/ui-v5/peer-compositions-icons.png`, `peer-site-finishes-desktop.png`, `peer-site-clear-mobile.png`, `peer-compositions-burger-mobile.png`. Шесть начертаний визуально различаются; оттенки и подписи читаемы. На четырёх одинаковых оптических сценах различимы размытие, прозрачность, отражение и край. Глянцевая плёнка сохраняет резкость сетки и формы; у глянцевого стекла добавлена направленная грань. Основные подписи защищены спокойной подложкой.

## Finding и recheck

| Before | After | Why |
|---|---|---|
| После глобального theme-toggle карточка foundation сохраняла `aria-pressed=true` у прежней тёмной темы | Автор добавил начальную синхронизацию и MutationObserver для `data-theme`, disconnect в cleanup | Объявленное состояние кнопок должно соответствовать фактической теме |

Целевой сериализованный браузерный recheck: **PASS, 6 проверок**. Глобальная тема и `aria-pressed` синхронны в обоих направлениях. Reduced motion до загрузки подтверждён `matchMedia=true`, active=0. Дополнительно независимо проверены main-site CTA → studio, touch-меню/Escape/возврат фокуса и spec-dialog/Escape/возврат фокуса.

Recheck: `tests/ui-v5/peer-compositions-recheck.cjs`; локальные receipts `qa/ui-v5/peer-compositions-recheck.json` и `peer-compositions.json`. Итоговый receipt содержит `pass:true`, первоначальное замечание сохранено в `originalFindings`, а новый read-back — в `recheck`. Незакрытых замечаний по проверенному объёму нет.

Реальный телефон, Safari/Firefox и скринридер не проверялись. Это browser peer QA, не факт GitHub push/Pages deployment.
