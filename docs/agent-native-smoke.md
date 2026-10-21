# Native agent smoke — 2026-10-21

Иван, все шесть проектных ролей **обнаружены и запущены в новой обычной CLI-сессии с cwd репозитория**. В новом Desktop-чате с cwd `C:/CodexWork` именованный selector не был доступен. Это разные проверенные поверхности; успех CLI не означает исправление Desktop routing или перезагрузку других чатов.

## Контракт и воспроизведение

- Desktop preflight сделан до чтения role prompts: `collaboration.spawn_agent` имел только `task_name`, `message`, `fork_turns`, `model`, `reasoning_effort`. Native role discovery: **unverified**, selector отсутствует. [Receipt](../tests/agent-smoke/evidence/native-desktop-preflight.json).
- Исполняемый файл: `C:/Users/admin/AppData/Local/OpenAI/Codex/bin/6257d9e8f63c0f2b/codex.exe`; `codex-cli 0.163.0-alpha.11`.
- Обычный запуск `codex exec -C C:/CodexWork/glass-neon-motion-skill --json <bounded-read-only-smoke-prompt>` завершился с exit 0. Не применялись bypass, смена trust/security/backend, глобальные настройки или разрешения.
- CLI session: `01a15e23-ae6e-7df1-a452-3530eb953700`, 14:06:00–14:06:51 Europe/Moscow. До ручного чтения файлов CLI сообщил native selector `agent_type` и шесть проектных имён. Затем реально вызвал `collaboration.spawn_agent` с каждым `agent_type`, `fork_turns: none`, без model/effort override.
- Проверены не только итоговые слова модели: из точного parent rollout извлечены шесть вызовов и ответов; из шести дочерних session metadata — `agent_role`, `agent_path`, `parent_thread_id`, UUID и события завершения. [Компактный проверенный receipt](../tests/agent-smoke/evidence/native-cli-receipt.json). Исходный CLI stream оставлен локально и исключён из публикации.

## Результат по ролям

| Native type | Child UUID | Verdict |
|---|---|---|
| glass_design | 01a15e23-e763-74c2-8f55-27efce982dc6 | discovered / launched / completed |
| glass_site | 01a15e23-f4f9-7002-9dd8-c4dd3806ae48 | discovered / launched / completed |
| glass_moodboard | 01a15e23-ff40-7053-a1d6-d03378510d9b | discovered / launched / completed |
| glass_skill | 01a15e24-2715-7dc2-981e-b41d13c79388 | discovered / launched / completed |
| glass_qa | 01a15e24-3f55-7a51-af67-d2109ed32143 | discovered / launched / completed |
| glass_release | 01a15e24-4b55-7ff1-b54a-2b6c4990ba45 | discovered / launched / completed |

Возвращённые инструментом task IDs — `/root/smoke_<role>`; UUID получены отдельно из metadata. CLI smoke проверял запуск и краткий ответ об обязанностях, не браузерную или производственную работу ролей. Идентификаторы полномасштабных исполнителей и их handoff относятся к отдельной Desktop collaboration сборке.

## Конфигурация и источники

Текущая [официальная документация custom agents](https://learn.chatgpt.com/docs/agent-configuration/subagents) описывает standalone TOML в `.codex/agents/` с `name`, `description`, `developer_instructions`. [Официальная schema](https://learn.chatgpt.com/docs/config-schema.json) также содержит `AgentsToml` и `AgentRoleToml`. Файлы проекта соответствуют standalone контракту; пустая таблица `[agents]` не требует дублирующего registry. Runtime подтвердил совместимость. Проектные role files **не изменялись**, их SHA-256 зафиксированы после smoke в receipt.

## Тестовая сборка и границы

Изолированный блок: [index.html](../tests/agent-smoke/index.html). Проектирование: [design.md](../tests/agent-smoke/design.md). Реальная сборка выполняется доступными Desktop collaboration agents с переданными обязанностями: это **fallback role assignment**, не native selection. Независимая приёмка и окончательные browser результаты: [qa.md](../tests/agent-smoke/qa.md), [browser-qa.json](../tests/agent-smoke/evidence/browser-qa.json). Их статусы нужно читать по итоговым файлам; native smoke сам по себе не доказывает visual QA.

CLI сообщил превышение skills context budget: описания skills убраны, ещё 145 skills не включены. Были сторонние MCP auth/startup warnings; они не помешали шести native запускам и не устранялись в этой задаче. Raw stderr сохранён только в ignored `qa/agent-smoke/native-cli-first.stderr.txt`. Нет утверждения о доступности всех MCP или автоматической загрузке всех навыков.

Не выполнялись публикация, push, изменение основного сайта или глобальной конфигурации. Проверка ограничена текущей версией CLI, указанным cwd и этой сессией.

## Финальная интеграция

Изолированная сборка завершена. `npm.cmd run check`: 17/17; `npm.cmd run build`: exit 0. `node tests/agent-smoke/build.mjs`: exit 0, автономный результат в ignored `qa/agent-smoke/build/` со шрифтами и OFL. [Запуск и исходники](../tests/agent-smoke/README.md). Локальный просмотр собранной версии: http://127.0.0.1:4190.

Независимый от автора реализации reviewer `/root/design` выполнил реальную Chromium-приёмку: **50/50**, 21 screenshot, 0 console/network errors. Первая проверка сохранена отдельно: выявленный overflow при zoom 200% / 320 px исправлен владельцем и перепроверен. Пропущенная в build лицензия Manrope добавлена и сверена по SHA-256. Root дополнительно просмотрел desktop light 3D и mobile dark 3D снимки. [Release review](../tests/agent-smoke/evidence/release-review.json), [handoffs](../tests/agent-smoke/evidence/collaboration.json).

Финальный source SHA-256: HTML `a8861d0c8682a4935348e741c3b1ce9d0827dcacc578393d5ca24fa05423834e`, CSS `0003e1c38431e46c25736b271471b59474a85f36f9636410c30383c631d65974`, JS `0307bf91858651f255c2cf24f610959703f92ca891504774a699822dbc7854b6`. Git diff для site/package/lock/scripts/CI/.codex пуст. Новые docs/tests оставлены локальными, без commit/push. QA и backups исключены существующим gitignore. Три проектные заметки Codex Config дополнены с backup/hash guard и read-back; native Obsidian rendering не проверялся. Browser limits: Chromium и эмуляция, без физических устройств, Safari/Firefox, полного WCAG-аудита или FPS-замеров.

## Дополнительная реальная сборка именованными ролями

После завершения Desktop-подготовки координатор возобновил проверенную native CLI-сессию и поручил конкретную работу через agent_type. glass_design (/root/native_design_work) принял source/design и передал handoff; glass_site (/root/native_site_work) выполнил build.mjs, exit0,6/6 файлов source/output совпали по SHA-256; glass_qa (/root/native_qa_work) независимо выполнил qa.mjs на собранном сервере4190,50/50, ошибок0,21 screenshot. Все три native вызова и ответа повторно проверены координатором в runtime журнале. Это реальные действия именованных ролей, а не только acknowledgement или ручной role prompt.

- [Native design handoff](../tests/agent-smoke/evidence/native-design-handoff.md)
- [Native build](../tests/agent-smoke/evidence/native-build-receipt.json)
- [Native QA](../tests/agent-smoke/evidence/native-qa-receipt.json)
- [Проверенные вызовы трёх ролей](../tests/agent-smoke/evidence/parent-native-work-receipt.json)

Ранее описанная Desktop fallback-подготовка остаётся отдельным историческим этапом. Дополнительная native цепочка подтверждает сборку/приёмку в CLI, но не добавляет selector в Desktop-чате родительского проекта.

## Публикационное обновление — 2026-10-21, V3

По следующему прямому поручению Ивана исходники этюда, компактные проверенные receipts и этот отчёт опубликованы commit `17e84d8fe63f8e7e34e69932d509922b1ac7d201`. [Этюд доступен публично](https://rdsolod-ui.github.io/glass-neon-motion-skill/study/index.html). Ранее записанные «локально / без push» относятся к исходному smoke-этапу. Raw CLI stream, screenshots и backups остаются локальными. [Результат публикации](release-v3.md). Открытие отдельного Desktop-проекта дошло до запроса доверия; [новая проверка](desktop-project-verification.md) пока не подтверждает Desktop native selector.
