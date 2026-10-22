# Независимая приёмка данных и правил V5

Дата: 2026-10-22. Reviewer: `compositions_finish`; автор таблиц и графиков — другой агент `data_finish`. Проверены рабочая страница и исходники, `SKILL.md`, `references/ui-atlas.md`, `references/surface-finishes.md`.

## Браузер и данные

Скрипт `tests/ui-v5/peer-data.cjs` запускает собственный контекст Chromium через существующий CDP 9223. Сериализованный запуск: 49/49 проверок, runtime errors 0, receipt `qa/ui-v5/peer-data-serialized.json`.

Проверены 12 SVG-типов: изменение dataset одновременно обновляет геометрию/сводку/доступное описание/таблицу; значения остаются доступны без hover. Дополнительно: bar начинается от нуля и длины пропорциональны таблице; line разрывается в null; Sankey сохраняет сумму 120; inline table отклоняет 1.5 и Escape возвращает фокус. Mobile 390: график имеет фокусируемую прокрутку с ArrowRight, страница не расширяется. Reduced проверен до load с read-back matchMedia и при live изменении.

Первый параллельный запуск дал 6 проваленных reduced checks на поздних диаграммах. Повтор с подробным read-back и без конкурентной media emulation дал 49/49, все 12 matchMedia=true / UIAtlas.reduced=true / animations=0. Поэтому первичный результат не выдается за подтверждённый дефект продукта; для CDP приёмки preference-тесты выполняются последовательно.

Просмотрены реальные изображения: `peer-data-bar-desktop.png`, `peer-data-treemap-desktop.png`, `peer-data-sankey-desktop.png`, `peer-data-control-desktop.png`, `peer-data-line-light-390.png`, `peer-data-line-dark-390.png` в `qa/ui-v5/`. Bar/treemap/Sankey/line читаемы, legend и числовая альтернатива доступны. Обнаружено пересечение подписи «Центр 50» с последним значением control chart B; передано владельцу на исправление.

Владелец вынес Center/UCL/LCL в отдельную легенду под графиком. Повторный реальный снимок `qa/ui-v5/peer-data-control-fixed.png` просмотрен: значения 49/53/50 и линии раздельны, подписи больше не накладываются. Read-back `qa/ui-v5/peer-data-fix.json` подтверждает новую легенду, matchMedia=true и animations=0. Замечание закрыто; открытых блокирующих замечаний к данным и скиллу нет.

## Skill review

Правила 24 групп отделены от статуса фактически реализованных образцов; не обещают «все виды графиков» как готовую универсальную библиотеку. Иконки, tooltip, switch, placeholder, навигация и клавиатура имеют проверяемые контракты. Новые четыре материала определены двумя независимыми осями; прозрачность не приравнена к blur, нет требования декоративной базовой обводки. Читаемая data plane, focus-visible, forced colors и solid fallback сохранены. Live reduced, cleanup, no-JS и отдельные стадии публикации описаны. Существенных противоречий актуальному brief Ивана не найдено.

Границы: Chromium desktop с эмуляцией узкого viewport; физические устройства, Safari и screen-reader voice output отдельно не проверялись. SVG accessibility проверена по DOM-связям и текстовой альтернативе.
