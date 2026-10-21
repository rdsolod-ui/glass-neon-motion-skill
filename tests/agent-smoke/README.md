# LUMA material smoke

Изолированный этюд: две темы, 2D-плёнка / 3D-кромка и плотная поверхность. Основной сайт не изменяется. Никаких новых npm-зависимостей.

Из корня репозитория:

```powershell
node tests/agent-smoke/serve.mjs
```

Откройте http://127.0.0.1:4189. Сервер доступен только на loopback; остановка — Ctrl+C в его терминале. Для автономной копии:

```powershell
node tests/agent-smoke/build.mjs
node tests/agent-smoke/serve.mjs --built
```

Результат находится в ignored `qa/agent-smoke/build/` вместе со шрифтами и лицензией; built-сервер использует http://127.0.0.1:4190. Исходный index.html рассчитан на сервер (он подключает существующие assets проекта); для открытия без сервера используйте собранную копию.

Проверки: основной `npm.cmd run check` — 17/17, сборки успешны; независимая Chromium QA — 50/50. `node tests/agent-smoke/qa.mjs` использует существующий локальный Playwright runtime и выделенный CDP bridge 127.0.0.1:9223; требует запущенную built-версию, не устанавливает браузер. Это машинно-зависимый QA runner, не зависимость демо.

- [Бриф и handoff](design.md)
- [Независимая приёмка](qa.md)
- [Переносимый рецепт](recipe.md)
- [Native discovery и запуск шести ролей](../../docs/agent-native-smoke.md)
- [Реальные collaboration исполнители](evidence/collaboration.json)

Native CLI smoke и первоначальное создание этого блока — разные проверки: шесть настроенных ролей выполнили диагностические ответы в repo-scoped CLI; разработка блока разделена между реальными Desktop collaboration agents с fallback назначением инструкций. Затем именованные `glass_design` → `glass_site` → `glass_qa` выполнили отдельную настоящую приёмку дизайна, сборку (6/6 hash match) и браузерную проверку (50/50); receipts сохранены в `evidence/`.

Для публичной лаборатории `node scripts/publish-study.mjs` собирает только HTML/CSS/JS в `site/study/`, переиспользует шрифты `site/assets/` и добавляет ссылку в мудборд. Runtime traces и screenshots туда не копируются.
