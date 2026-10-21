# Интеграционная проверка V3

Из корня репозитория, при запущенном `npm start` и существующем QA Chrome CDP:

```sh
node tests/atlas-v3/qa.cjs
```

Нужен существующий Playwright (`PLAYWRIGHT_MODULE` — путь к модулю; иначе локальный `playwright`, затем документированный Windows runtime). Runner не устанавливает браузер и не меняет профиль. `QA_CDP` по умолчанию `http://127.0.0.1:9223`, `QA_BASE` — `http://127.0.0.1:4177/`, `QA_LABEL` — `v3-integration`. Создаются отдельные contexts, в конце закрываются только они и CDP client.

Скриншоты и подробный отчёт пишутся в ignored `qa/`. Для initial reduced создаётся отдельный context с предпочтением до загрузки; live change проверяется независимо. `evidence/integration.json` — компактный итог реального финального локального прогона, а не обещание результата в другом браузере.

Проект не имеет production npm dependencies. QA tooling не входит в Pages.
