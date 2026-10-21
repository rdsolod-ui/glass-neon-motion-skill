# Библиотеки, scripts и воспроизводимая сборка

## Выбор по задаче

| Слой | Минимальный вариант | Когда расширять | Что проверить |
|---|---|---|---|
| Разметка и material | Semantic HTML + CSS variables + backdrop-filter | Existing React/Vue/Svelte сохраняется | Fallback, nesting/stacking context, обе темы |
| Короткий motion | CSS transitions + Web Animations API | Motion для React state/layout/exit; GSAP для choreography/scroll | Ownership, live reduced motion, cleanup |
| Accessible controls | Native button/input/select/details/dialog | Принятые в проекте Radix/Base UI/shadcn primitives для сложного поведения | Focus, keys, ARIA, portal, framework compatibility |
| Layout/styles | Обычный CSS или существующий Tailwind | shadcn/ui для нового React/Tailwind; подходящие Tailark blocks | aliases, components.json, base primitive и лицензия |
| Декоративные компоненты | Собственные CSS/SVG | Выбранный Magic UI/Motion Primitives component | Не считать его автоматическую доступность доказанной |
| Icons/fonts | System font и выбранные локальные SVG | Лицензированный self-hosted font/icon package | Кириллица, weights, атрибуция, asset license |
| Build | Для статического demo Node scripts; build может быть копированием и проверкой | Vite в новом app или имеющийся Next/build | Lockfile, actual runtime, paths, base URL |
| QA | Браузер и task-local screenshot/check script | Playwright + axe-core, профилировщик по задаче | Это dev tooling, не production runtime |
| 3D/refraction | Не требуется | Three.js/React Three Fiber только для настоящей 3D/интерактивной сцены | Размер, context loss, GPU, fallback, лицензии assets |

Ни React, ни Tailwind, ни GSAP не являются обязательными условиями glassmorphism. Native CSS/WAAPI демо может работать без runtime npm dependencies. `<dialog>` и современные CSS-эффекты всё равно требуют проверки целевых браузеров; «без зависимостей» не значит «работает в любом браузере».

## Скрипты, которые нужны проекту

- `dev`: локальный HTTP server, loopback по умолчанию. Не запускай public tunnel для просмотра без необходимости.
- `build`: создаёт отдельный output; не перезаписывает source. Для статического проекта копирует разрешённые HTML/CSS/JS/assets, проверяет ссылки и обязательные файлы.
- `check`: syntax/types и содержательные инварианты — локальные ссылки, manifest, конечные значения токенов, отсутствие незавершённых placeholders. Проверка наличия слова «accessible» ничего не доказывает.
- `qa`: реальный browser flow — темы, narrow layout, keyboard/dialog, формы, reduce до/после load, fallback, errors. Путь evidence задаётся явно, screenshots не входят в runtime bundle.
- `serve`: просмотр именно собранного output, чтобы обнаружить проблемы относительных путей.

Используй существующие команды/инструменты проекта. Эти имена — контракт результата, а не требование создать лишний CLI. Не запускай произвольные remote shell snippets.

## Установка и версии

1. Прочитать package.json, lockfile, Node/package-manager version, config aliases и текущую систему компонентов.
2. Проверить актуальные API в официальной документации или Context7. Зафиксировать точную испытанную версию, а не `latest` в CDN.
3. Установить только выбранное локально с существующим package manager. Для npm: `npm install --save-exact <package>@<verified-version>`; значения в угловых скобках надо заменить после проверки, это не команда для слепого копирования.
4. Commit lockfile. В CI воспроизводить через `npm ci` или эквивалент. При нуле зависимостей не добавлять node_modules ради формальности.
5. Проверить build и dependency audit. Не применять force-обновления, скрывающие несовместимость. Записать advisory, affected path и решение; ноль advisories не доказывает всю безопасность сайта.
6. Отделить production dependencies от dev tools и примеров, которые только описаны. README не должен говорить «используется GSAP», если на странице работает только WAAPI.

## License/source manifest

Для каждого использованного внешнего ресурса: name, source URL, exact version/commit, license path, local modifications, runtime/dev/reference status. Исходный код и demo-media могут иметь разные права. Не переносить чужие фотографии, логотипы или платные шаблоны из каталога автоматически. У Motion+ отдельные платные возможности; GSAP и другие библиотеки проверяй по актуальной лицензии, не называй все пакеты MIT по привычке.

Официальные маршруты: [Motion docs](https://motion.dev/docs), [GSAP docs](https://gsap.com/docs/v3/), [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog), [shadcn/ui](https://ui.shadcn.com/docs), [Vite](https://vite.dev/guide/), [Playwright](https://playwright.dev/docs/intro). Перечень — выбор инструментов, а не подтверждение установки или тестирования всех библиотек.
