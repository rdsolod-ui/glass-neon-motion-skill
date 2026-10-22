# V5 — нативные controls и сценарии

Дата: 2026-10-22. Исполнитель: `controls_finish` через collaboration (проектный контракт `glass_site`).

## Состав

12 групп, 36 образцов: кнопки, выбор, ввод, селекторы, подсказки, поиск, организация содержимого, наложения, обратная связь, загрузка, формы, аккаунт. HTML/CSS/ES modules, без production-зависимостей и сетевых операций. Все данные учебные, состояние ограничено страницей.

Материал наследуется от общей библиотеки (`--ui-fill`, `--ui-control`). Текстовые поля, пояснения и диалоги используют читаемую подложку. Матовая и прозрачная глянцевая оболочки не меняют семантику компонента. Нет базовой декоративной обводки. Keyboard focus и системные границы forced-colors сохранены.

Короткий WAAPI-отклик принадлежит `api.animate`; ввод и checked применяются сразу. Escape, Cancel и повторные операции отменяют предыдущую работу. Таймеры ограничены 0,8–1,75 секунды; Undo не исчезает по таймеру. Нативный `dialog` удерживает фокус; после закрытия фокус возвращается к инициатору. Палитра команд изменяет локальный preview.

## Сценарии приёмки

Корневой селектор каждого примера — `[data-uic="ID"]`; кнопки — `[data-uic-action="имя"]`. Воспроизводимый тест: `node tests/ui-v5/controls.cjs`, внешний URL задаётся через `BASE_URL`.

| ID | Действие | Ожидаемый результат |
|---|---|---|
| action-buttons | add → reset | Два слоя → один |
| action-save | save/cancel; fail; success | Старый таймер отменён, ошибка/успех различимы |
| action-split | format → create | Создан элемент выбранного формата |
| switches | Space дважды | checked и подсветка меняются вместе |
| selection-bulk | all → снять один | 3 из 3 → 2 из 3, mixed |
| selection-choice | Smoke, rating 5 | Подтверждены материал и оценка |
| field-anatomy | Название, ширина | Значения отражены, readonly сохранён |
| textarea-counter | sample → clear | Preview и счётчик синхронны |
| password-otp | reveal; 2 → 6 цифр | Формат invalid → valid |
| native-select | Smoke + Блик | Оба выбора отражены |
| combobox | «дым», ArrowDown, Enter; Escape | Smoke, active descendant, закрытие |
| range-pickers | minimum 85, дата, цвет | Границы 85–95 согласованы, preview обновлён |
| tooltip | Focus → Escape | Пояснение видно → скрыто |
| rich-popover | Открыть → снять помощь → Escape | Inline-помощь отключена |
| coachmark | start → next → finish | Шаги 1,2, завершение |
| faceted-search | dark + Frost → reset | Нет совпадений → 4 материала |
| command-palette | create → усилить | Два слоя, плотная подложка |
| saved-view | save → all → restore | Восстановлен сохранённый фильтр |
| tabs | ArrowRight → Enter | Ручная активация второй панели |
| disclosure-tree | Раскрыть → убрать край | Preview без локальной кромки |
| master-detail | Prism, ширина 50 | Детали и доля списка обновлены |
| edit-dialog | save → новое значение → Escape | Сохранение применено, отмена не применена |
| confirm-dialog | delete → restore | Запись скрыта → возвращена |
| bottom-sheet | Smoke/apply → Solid/Escape | Smoke сохранён |
| toast-undo | remove → undo | Запись возвращена |
| offline-retry | retry/offline → retry | Прежний таймер не перезаписывает состояние |
| notifications | all → add → read | Счётчик 0 → 1 → 0 |
| progress-job | start/cancel → start | Остановка стабильна, повтор достигает 5 |
| skeleton-content | load/cancel → load | Предыдущий контент восстановлен; затем ready |
| empty-state | create/error/retry/reset | Коллекция сохраняется при ошибке |
| validated-form | Пустая → заполненная | Summary получает focus, valid-поля принимаются |
| wizard | Вперёд/назад/подтвердить | Выбранный материал не теряется |
| dirty-form | edit/save/edit/cancel | Возвращено последнее сохранение |
| local-login | submit → logout | Демо-профиль открыт/закрыт; пароль очищен |
| local-preferences | dark/compact/description off | Изменён только локальный preview |
| consent | all → essential | Настройки отражены без cookie |

## Исправления source review

| Before | After | Why |
|---|---|---|
| CSS модуля отсутствовал | Адаптивные controls, sheet, dialog, состояния | Существующий HTML должен быть читаемым и управляемым |
| Палитра только выводила название команды | Create/reset и плотность меняют локальный preview | Рабочий пример должен иметь наблюдаемый результат |
| Cleanup не закрывал native popover | Открытый popover закрывается при dispose | Повторный mount не оставляет top-layer состояние |
| Программный focus summary не был заметен | Видимый focus для summary ошибок | Ошибки доступны с клавиатуры |

## Проверки

Syntax checks трёх модулей прошли. Реальный Chromium через выделенный CDP: все 36 сценариев PASS, pageerrors 0; mobile 390×844 без document overflow, sheet в пределах viewport, закрытие Escape и возврат фокуса. Reduced motion задан page.emulateMedia до загрузки и подтверждён matchMedia, после сценариев нет running animations. Dispose отключает JS-кнопки. Receipt: `qa/ui-v5/controls.json` (локальный, ignored); воспроизводимый тест хранится в репозитории.

Визуально просмотрены `qa/ui-v5/controls-mobile.png` и `controls-mobile-sheet.png`: подписи и управление читаемы, thumb соответствует checked, подсветка видна, нижняя панель и кнопки не обрезаны. Исправлен найденный независимым data-reviewer ArrowUp: из начального состояния combobox и command palette теперь выбирается последний вариант.

Это авторская проверка, не независимая peer-приёмка и не подтверждение публикации. Физический телефон, Safari и Firefox не проверялись.
