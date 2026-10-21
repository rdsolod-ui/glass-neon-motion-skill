# Настроенная команда сборки LUMA

Дата: 2026-10-21. Шесть project-scoped native role definitions находятся в `.codex/agents/`; `.codex/config.toml` не переопределяет модель, права, MCP или глобальные настройки.

| Роль | Функция |
|---|---|
| glass_design | Референсы, арт-дирекция, токены и композиция |
| glass_site | Реализация страниц и их взаимодействий |
| glass_moodboard | Реализация атласа, образцов и рецептов |
| glass_skill | Поддержка переносимого навыка и рецептов |
| glass_qa | Независимая визуальная/motion/accessibility приёмка |
| glass_release | Интеграция, сборка, разрешённый release и read-back |

Роли выполняют работу, а не только дают замечания. В текущем обновлении фактически запущены site_builder_v2, board_builder_v2 и skill_team_v2 через collaboration; координатор держит integration/release. Последующая перекрёстная приёмка оформляется отдельным заданием и evidence. Этот факт не подтверждает загрузку новых native TOML в уже открытом чате.

## Использование

Открой репозиторий в Codex и поручай: «Собери проект командой glass_design, glass_site, glass_moodboard и glass_skill; перед релизом передай glass_qa независимую приёмку, затем glass_release интеграцию». Координатор сначала фиксирует brief, потом запускает независимые работы с непересекающимися файлами. При недоступном native selector он читает role TOML и передаёт инструкции обычному subagent. Полный [протокол](../skill/glass-neon-motion/references/team-workflow.md), [ownership registry](../agents/ownership.json) и [project rules](../AGENTS.md).

## Формат роли и проверки

Standalone TOML содержит `name`, `description`, `developer_instructions`, согласно [официальным subagents docs](https://learn.chatgpt.com/docs/agent-configuration/subagents), просмотренным 2026-10-21. [Config schema](https://raw.githubusercontent.com/openai/codex/main/codex-rs/core/config.schema.json) дополнительно описывает старый маршрут `agents.<role>.config_file`; он не дублируется здесь, чтобы не создать два источника роли.

Проверено Python tomllib: все 7 TOML читаются, шесть имён уникальны; role files не содержат model/security/provider/MCP overrides. На этапе V2 runtime ещё не проверялся; последующие CLI и Desktop результаты приведены ниже. Установка skill и копирование repository role configs в другие проекты — отдельные операции; installer навыка не меняет конфигурацию чужого проекта.


## Runtime-проверка 2026-10-21

В новой CLI-сессии из корня репозитория все6 ролей обнаружены и запущены через native agent_type. Затем design/site/QA выполнили реальный handoff, build и50/50 browser checks. В новом Desktop-чате проекта C:/CodexWork native selector отсутствовал. [Точные доказательства и ограничения](agent-native-smoke.md). Предыдущая запись о непроверенной native discovery выше относится к моменту публикации V2.

## Распределение V3

`html_atlas_v3` реализовал113 HTML-тегов/22input/12states и независимо принял motion. `motion_atlas_v3` реализовал39 motion-примеров/13групп и независимо принял HTML. `desktop_roles_v3` проверил публикационный этюд и применение скилла; отдельно дошёл до штатного запроса доверия папке в Desktop. Координатор интегрировал, обновил skill, выполнил29/29 local и29/29 public и опубликовал V3. Это реальные collaboration jobs с fallback инструкциями ролей; их нельзя путать с ранее доказанными native CLI-запусками. [Приёмка V3](acceptance-v3.md) · [релиз](release-v3.md).

## Desktop native 6/6 — завершённая проверка

В отдельном проекте `C:/CodexWork/glass-neon-motion-skill` новый чат обнаружил все шесть имён непосредственно в описании `agent_type`; каждый native запуск завершился ответом. Координатор и независимый агент сверили вызовы, дочерние metadata и completion. Для новых задач использовать именно этот проект; уже открытые чаты родительской папки автоматически не обновляются. [Отчёт, receipt и ограничение routing timeout](desktop-project-verification.md).
