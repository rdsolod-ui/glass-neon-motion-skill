# Независимая приёмка controls, поиска и материалов V5

Дата: 2026-10-22. Reviewer `data_finish` не писал controls, поиск и материал. Исполнение: реальный Chromium через существующий CDP 9223, отдельный контекст. Скрипт `tests/ui-v5/peer-controls.cjs`, локальный receipt `qa/ui-v5/peer-controls.json`.

**21/21 PASS**, ошибок JavaScript нет. Проверены:

- Combobox: ArrowUp выбирает последний пункт, Enter подтверждает, Escape закрывает.
- Единый поиск «свитчер» находит именно рабочий пример, переход раскрывает карточку; Space меняет видимую подсветку.
- Tooltip доступен с клавиатуры и закрывается Escape.
- Native modal удерживает клавиатуру и возвращает фокус; tabs поддерживают End и активацию одного panel.
- Четыре сочетания frosted/clear × film/depth переключаются независимо. Clear имеет blur 0.8 px, матовый — отдельное рассеивание; 2D/3D различаются тенями без базовой обводки.
- Плотная подложка отменяет blur даже в clear; forced colors сохраняет границу переключателя.
- Reduced motion проверен до load и при live change; после отмены feedback active=0.
- При 390 px ширина документа не превышает viewport.

В source review найдена ошибка ArrowUp при начальном index=-1 (переход на предпоследний пункт). Автор исправил её до независимого браузерного прогона; реальный read-back подтвердил Obsidian как последний пункт. Аналогичная арифметика исправлена автором command palette.

Вручную просмотрены `peer-controls-light-desktop.png`, `peer-controls-dark-desktop.png`, `peer-controls-dark-mobile.png`: кириллица, переносы, enabled/disabled состояния и стеклянный блик читаемы; базового outline нет, управляющий focus остаётся функциональным. Это Chromium viewport-проверка, не приёмка физического iOS/Android устройства. Touch в этом скрипте пока не заявлен.
