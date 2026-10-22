# LUMA / Glass Neon Motion — project agents

Всегда обращайся к пользователю как Иван. Сохраняй существующий HTML/CSS/JS стек, source links, лицензии и accessibility fallback. Сначала прочитай текущий brief и `skill/glass-neon-motion/SKILL.md`.

## Реальная команда

Для полной сборки/редизайна с запросом агентов запускай реальных дочерних исполнителей, а не ограничивайся описанием ролей. Используй native роли `.codex/agents/*.toml`, когда они обнаружены; иначе передай их developer_instructions доступным collaboration agents и отметь fallback. Не создавай пользовательские чаты. Native discovery нельзя выводить из наличия файла.

Роли: `glass_design`, `glass_site`, `glass_moodboard`, `glass_skill`, `glass_qa`, `glass_release`. Подробный порядок: [docs/agent-team.md](docs/agent-team.md), переносимый контракт: [team-workflow](skill/glass-neon-motion/references/team-workflow.md). Точный registry: `agents/ownership.json`.

## Ownership и этапы

- Координатор выполняет design/release и удерживает shared `site/style.css`, `site/theme.js`, package/lockfile, build/check/CI.
- Site builder: `site/index.html`, `site/app.js`, `site/expressive.css`.
- Moodboard builder: generator/previews, `site/moodboard.html`, `site/catalog.js`, `site/board.js`, `site/board-v2.css`.
- Skill maintainer: `skill/**`; role configuration только по явному назначению координатора.
- QA читает артефакты; исправления делает владелец. После handoff возможна смена владения с уведомлением.

Порядок: reference/material brief → parallel static implementation → отдельная peer-приёмка сайта и board → motion/runtime QA → fixes/recheck → разрешённая публикация. При четырёх слотах coordinator + три исполнителя, затем reuse агентов для перекрёстной приёмки. Автор не называет свою проверку независимой.

## Материал: актуальное уточнение Ивана

Стекло без базового outline. 2D film передаёт границу прозрачностью/диффузией, без толщины и bevel. 3D optical edge передаёт толщину локальными затухающими бликами, внутренней тенью и фаской, без равномерного stroke по периметру. Приёмка разделяет оба режима. Keyboard focus-visible и системные контуры forced-colors обязательны по функциональному назначению.

## Gate

Уточнение V5: матовость/прозрачный глянец и 2D/3D край независимы. Проверять четыре сочетания на одинаковом фоне. Clear сохраняет резкость и узкое отражение, Frost рассеивает фон. Без baseline outline; читаемые wells, focus и системные fallback сохраняются. См. `skill/glass-neon-motion/references/surface-finishes.md`.

Проверить light/dark desktop/mobile, материальную глубину, keyboard/touch/dialog, long text, reduced motion до load и при live change, solid fallback, ошибки assets. Не маскировать overflow. Build: `npm run check`, `npm run build`; generator: `node scripts/render-atlas.mjs`. Проверки старой версии не считать доказательством новой.

Публикация только в рамках прямого разрешения; при разрешённом обновлении сохраняй прежние GitHub Pages URL. Не загружай secrets, node_modules, backups или тяжёлые QA. В отчёте различай commit, push, deploy и публичный read-back.
