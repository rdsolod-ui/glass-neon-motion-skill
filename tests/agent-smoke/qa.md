# Независимая приёмка agent smoke

**Approve for inspected scope — 2026-10-21.** Иван, финальный изолированный блок прошёл 50 из 50 проверок в настоящем Chrome 155.0.8059.85. Ошибок console/page/network: 0. Screenshot evidence: 21 PNG в ignored `qa/agent-smoke/`. Основной сайт и публикация в эту приёмку не входят.

Reviewer `/root/design` после design handoff получил отдельное назначение `glass_qa`. Реализация принадлежит `/root/site`; reviewer не писал и не исправлял HTML/CSS/JS блока. Это независимость от реализации, не независимость от design brief. Оба назначения выполнены через реальные collaboration agents как **fallback**; ручное чтение `.codex/agents/glass_qa.toml` не считается native запуском роли.

Проверен **собранный output** `http://127.0.0.1:4190`, а не только source server4189. Использован существующий Chrome CDP9223: executable `C:/Program Files/Google/Chrome/Application/chrome.exe`, профиль `C:/Users/admin/.codex/browser-bridge/profile`, PID44624 на момент проверки. Создавались только временные task-owned browser contexts/pages; они закрыты, пользовательские вкладки и bridge сохранены.

## Что проверено

- Матрица 1440,768,390,320 px × light/dark × 2D/3D: 16 layout и 16 material checks. Нет горизонтального overflow или маскировки через body overflow hidden. Локальные Latin/Cyrillic Manrope загружены.
- 2D: border/outline отсутствуют, box-shadow none, edge-элементы скрыты. 3D: локальные edge-элементы видны, есть внутренняя/опорная тень. Визуально подтверждены резкая подложка снаружи, диффузия внутри и затухающие направленные блики без равномерного stroke.
- Keyboard Space для темы, ArrowRight для radio, Tab к checkbox, Space для solid. Focus-visible реально виден. Touch emulation активирует тему и 3D.
- Reduced motion до загрузки и live: 0 активных анимаций, transition0s, весь текст виден. Быстрые повторные переключения сохраняют последнее состояние.
- Solid mode: blur none, aria-label/figcaption соответствуют плотному режиму, описание возвращается при отключении. Реальная CDP media emulation reduced-transparency с matches=true даёт blur none. Forced colors: видимые системные границы, без декоративного blur/shadow.
- Длинный текст и очень длинное слово на320px; CSS zoom200% на320px после исправления. JavaScript disabled: заголовок и noscript доступны.
- Contrast reading surfaces в обеих темах: вычислен по реальным computed colors и ближайшему непрозрачному фону; минимум 6.48:1. Текст расположен на плотных поверхностях, а не на меняющемся glass substrate.

## Findings и исправление

| Severity | Before | After | Evidence/status |
| --- | --- | --- | --- |
| P2 | CSS zoom200% при viewport320: scrollWidth373 | Владелец добавил перенос masthead/segments/caption и min-width/heading wrapping. Финальный overflow check проходит. | Начальный `evidence/browser-qa-initial.json`:47/48. Финальный `evidence/browser-qa.json`:50/50, с двумя добавленными проверками описания solid. |

Первое узкое исправление через media<=300 не решило CSS zoom, потому что breakpoint оставался320. Reviewer подтвердил повторное воспроизведение, владелец перенёс нужный flex wrapping в общие правила. Финальный screenshot zoom показывает доступные элементы в одной колонке; длинная страница является ожидаемым результатом stress test.

## Реально просмотренные кадры

Просмотрены `1440-light-2d`, `1440-dark-3d`, `390-light-3d`, `768-light-2d`, `390-dark-2d`, `forced-colors`, `keyboard-focus`, финальные `320-light-2d` и `zoom-200`. Остальные кадры записаны автоматикой, их индивидуальный просмотр не заявляется. Родитель отдельно просмотрел1440-light-3d и390-dark-3d.

Материальный результат принят: светлая плёнка отделяется только светопропусканием/диффузией; dark smoke не закрывает cyan/lime фон полностью; 3D добавляет только направленные фрагменты и глубину. Основной текст читаем, mobile layout не обрезает контролы.

## Воспроизведение и границы

После `node tests/agent-smoke/build.mjs` и запуска build server4190: `node tests/agent-smoke/qa.mjs`. Скрипт использует существующий Windows Playwright runtime и CDP9223, сохраняет компактный JSON и screenshots. Зависимости проекта не добавлены.

Финальный SHA256 CSS: `0003e1c38431e46c25736b271471b59474a85f36f9636410c30383c631d65974`.
Финальный SHA256 app.js: `0307bf91858651f255c2cf24f610959703f92ca891504774a699822dbc7854b6`.

Пределы: только Chromium, touch emulation вместо физического телефона; CSS zoom stress вместо browser-menu zoom; media emulation вместо изменения настроек ОС. Нет проверки движка без поддержки backdrop-filter, реального screen reader, Safari/Firefox, FPS или полной WCAG-сертификации. Native modal отсутствует в scope. Страница без SPA mount lifecycle, бесконечных таймеров или декоративных циклов. Публикация не выполнялась.
