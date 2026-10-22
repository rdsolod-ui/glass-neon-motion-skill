# Glass Atlas — отдельный слой вариативности

Дата: 2026-10-22. Запрос Ивана: расширить готовые решения (включая progress/scroll bars) и отдельно увеличить вариативность существующих элементов. Существующие 24 группы / 76 примеров, HTML, motion, визуальные композиции и пользовательская blur-лаборатория сохранены.

## Реализованная карта

| Семейство | Рабочие локальные варианты |
|---|---|
| Прогресс | линейный, тонкий, кольцевой, сегментный |
| Прокрутка | системный окрашенный, тонкий, горизонтальная snap-лента, прогресс чтения |
| Загрузка | spinner, dots, skeleton, empty → ready |
| Шаги | горизонтальные, вертикальные, компактные |
| Кнопки | иерархия, выбор/pressed, масштабы, доступность/намерение |
| Поля | единица измерения, количество, textarea/counter, email/validation |
| Карточки | показатель, выбор, раскрытие |
| Статусы | badge, chips, meter, inline notice |
| Пагинация | numbered, load more |
| Таймлайны | vertical, horizontal |
| Очереди файлов | list, cards |
| Уведомления | unread center, remove/undo |
| Рейтинг | radio stars, numeric score |
| Диапазоны | price, percent (два связанных native range) |
| Панели | columns, rows (пропорции через native range) |

Всего 44 варианта в 15 семействах; точный manifest: `site/variation-manifest.json`. Статус live-local означает локальный сценарий, а не серверную интеграцию. Счётчик не смешивается с 76 прежними UI или 48 визуальными композициями.

Вход: `moodboard.html#variation-atlas`; стабильные ссылки `#vx-*`. Единый поиск находит русские/английские названия, раскрывает предков образца. Пятнадцать групп имеют собственный фильтр и якорный индекс. HTML каждого образца доступен в раскрытии; ему нужны CSS и обработчики этого слоя, отдельная production-библиотека не заявлена.

## Независимые оси

- Материал: Clear/Frost и film/depth из общих настроек «Стекло». Старт остаётся clear+depth в HTML и runtime.
- Плотность: свободная/компактная; зоны интерактивных действий не меньше 44 px.
- Форма: мягкая/строгая, локальные радиусы без замены материала.
- Семантическое состояние: value, busy, pressed, current step, invalid, selected, disabled.
- Светлая/тёмная тема наследует существующие токены; плотные внутренние зоны сохраняют читаемость.

Approved art direction сохранена из docs/design-v5.md и прежних референсов; новая подборка hero/pricing/footer не нужна для расширения контролов. Оригинальные HTML/CSS/JS, новых icon assets или библиотек нет; существующие Manrope/OFL и Phosphor/MIT сохранены.

## Поведение и motion

Кнопки и поля немедленно меняют состояние, прогресс обновляет числовую и доступную семантику. Сегменты округляют вниз до десятых; точное значение доступно рядом и в aria-valuenow. Meter показывает измеренную заполненность, progress — выполнение. Области прокрутки нативные, фокусируемые; используются реальные scrollTop/scrollHeight, без drag-only заменителей.

Загрузка запускается только пользователем, завершается через 2 секунды или отменяется. Только WAAPI владеет transform/opacity spinner/dots, два цикла по 650 ms; максимальная задержка 200 ms. Повторный запуск отменяет прежние таймеры/анимации. При hidden, OS reduced motion или ручном reduced отменяется движение; конечное текстовое состояние сохраняется. pagehide очищает timers/listeners/observer, persisted pageshow восстанавливает обработчики и кнопки по сохранённому шагу. Пользовательский scroll не сглаживается скриптом.

NoJS: весь HTML, code, details, inputs/checkbox и native scroll доступны. Изменения демонстрационных результатов требуют JS, о чём говорит noscript. Solid/reduced transparency/no-backdrop используют непрозрачный --solid; forced colors сохраняет функциональные контуры. Декоративного baseline outline нет.

## Технические источники

Проверены 2026-10-22; адаптирована семантика, сторонний код не копировался:
- [MDN progress](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/progress).
- [MDN meter](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter).
- [MDN scrollbar-color](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/scrollbar-color): оформление нативной полосы зависит от браузера/ОС, forced-colors возвращает системный вариант.

## Дальнейшие семейства — предложения, не реализованы здесь

Breadcrumbs/TOC, avatar groups, drag/drop with keyboard alternative, command palette variants, data-grid density/sticky columns и mini-chart variants. Для каждого расширения нужен собственный контракт действий и приёмка; не считать эти названия готовыми решениями.

## Проверка

Повторяемая проверка: `node tests/variations/qa.cjs`, существующие material/fallback/legacy suites, `npm run check`, `npm run build`. Итог и границы — в `docs/qa/variation-layer.md`.
