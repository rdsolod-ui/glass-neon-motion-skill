# Отдельный Desktop-проект — проверка 2026-10-21

Иван, в новом Desktop-чате отдельного проекта **обнаружены, запущены и завершены все шесть native ролей**. Это проверка реального `agent_type`, а не назначение роли через текст задания. [Компактное runtime evidence](../tests/agent-smoke/evidence/native-desktop-project-receipt.json).

## Проверенная поверхность

- Проект: `glass-neon-motion-skill`, native `projectId: 1c4d1a0b-608b-4fb5-bda3-16eb4f69f8de`.
- Фактический cwd: `C:/CodexWork/glass-neon-motion-skill`.
- Новый чат: **«Проверка glass-ролей в отдельном Desktop-проекте»**, `01a15e9e-8197-7960-91d0-ae8b86e1cb45`, host `local`.
- Parent runtime metadata: `originator: codex_work_desktop`.
- До ручного чтения `.codex/agents` схема `collaboration.spawn_agent` предоставила `task_name`, `message`, `agent_type`, `fork_turns`, `model`, `reasoning_effort`; в native selector уже были все шесть `glass_*`.

## Реальные запуски

| Переданный agent_type | Возвращённый task ID | Статус / подтверждённая обязанность |
|---|---|---|
| glass_design | /root/smoke_1 | completed; материальный brief и источники |
| glass_site | /root/smoke_2 | completed; реализация сайта |
| glass_moodboard | /root/smoke_3 | completed; карта материалов и компонентов |
| glass_skill | /root/smoke_4 | completed; сопровождение skill и рецептов |
| glass_qa | /root/smoke_5 | completed; независимая приёмка |
| glass_release | /root/smoke_6 | completed; интеграция, сборка и разрешённый релиз |

Каждому передавалось одинаковое короткое read-only задание: проверить cwd и наличие `AGENTS.md`, назвать свою обязанность и источник role identity. Все подтвердили папку проекта, файл и native developer-инструкции своей роли. `fork_turns: none`; модель и reasoning effort не переопределялись. Тексты role definitions в prompts не копировались, CLI fallback не использовался.

Независимая проверка сопоставляет настоящие вызовы `agent_type`, результаты инструмента, UUID дочерних сессий, `agent_role`, `agent_path`, `parent_thread_id` и события завершения. В receipt сохранены SHA-256 текущих role files. Исходные runtime logs и зашифрованные prompts не публикуются.

## Доверие и промежуточная ошибка

Ранее штатное открытие папки остановилось на «Доверять этой папке?». Иван затем прямо разрешил доверие. При свежем наблюдении диалог уже отсутствовал, а проект был виден и в интерфейсе, и в native `list_projects`. Агент не нажимал доверие повторно и не приписывает себе не наблюдавшееся действие. [Receipt регистрации](../tests/agent-smoke/evidence/desktop-trust.json).

Первый turn завершился ошибкой `workspace routing discovery timed out` после запуска первых четырёх ролей. Их результаты сохранены. Одно продолжение в том же чате проверило завершение этих агентов и последовательно запустило оставшиеся `glass_qa` и `glass_release`. Второй turn завершился успешно. Причина routing timeout не установлена; успешное продолжение не объявляется исправлением сервисного слоя.

## Использование и границы

Для воспроизведения открыть именно проект `C:/CodexWork/glass-neon-motion-skill` и создать в нём новый чат. Ранее в чате родительской папки `C:/CodexWork` native selector отсутствовал; сохранение TOML не перезагружает старые чаты. [Роли и распределение работы](agent-team.md).

Smoke подтверждает discovery и выполнение коротких заданий текущими ролями в указанном Desktop-чате. Реальная сборка тестового блока, браузерная приёмка и публичная публикация подтверждены отдельно в [native smoke](agent-native-smoke.md), [приёмке V3](acceptance-v3.md) и [релизе V3](release-v3.md). Конфигурация, backend, модель, сайт и глобальные настройки в этой проверке не менялись.
