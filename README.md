# Glass / Neon / Motion

Расширенный Codex skill для glassmorphism-сайтов: две темы, яркие неоновые акценты, осмысленный motion, интерактивный мудборд и независимая приёмка.

## Открыть онлайн

- [Тестовый сайт LUMA](https://rdsolod-ui.github.io/glass-neon-motion-skill/)
- [Мудборд Glass Atlas](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html)
- [Этюд команды: 2D / 3D](https://rdsolod-ui.github.io/glass-neon-motion-skill/study/index.html)

Страницы публичны и не требуют входа. GitHub Pages публикует `site/` через `.github/workflows/pages.yml` после изменений сайта в `main`.

## Версия 5 — 24 группы с рабочими примерами

[Открыть UI-библиотеку](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html#ui-atlas). Переключатели, поля, hints/tooltip/popover, header/footer/burger, CTA, иконки, таблицы, 12 SVG-графиков и расширенные рабочие интерфейсы разделены на 24 группы. Точный состав — [manifest](site/ui-manifest.json). Единый поиск объединяет рабочие UI, HTML/input/states, motion, прежние визуальные композиции и референсы; понимает русские и английские названия.

В каждой группе несколько локальных примеров с настоящими изменениями состояния, прямыми ссылками и motion-контрактами. Светлая/тёмная тема и 2D/3D края сохраняются. Формы/аккаунт/корзина — учебные локальные сценарии, без отправки, платежей и backend-auth. Графики используют демонстрационные данные и доступные таблицы.

[Дизайн V5](docs/design-v5.md) · [Карта задания](docs/coverage-audit-v5.md) · [Правила расширенной UI-библиотеки](skill/glass-neon-motion/references/ui-atlas.md).

## Версия 4 — стеклянный сайт и оболочка атласа

Главная страница и сам мудборд получили сквозную стеклянную композицию: цветная подложка видна через навигацию, панели, фильтры и карточки. Светлая тема использует молочное стекло, тёмная — дымчатое. Базовая 2D-плёнка не имеет декоративной обводки; объёмные края выделены в отдельный 3D-материал. Плотные зоны сохраняют читаемость текста и полей. Новых production-зависимостей нет.

[Дизайн V4](docs/design-v4.md) · [Приёмка V4](docs/acceptance-v4.md) · [Визуальный review](docs/qa/visual-v4.md) · [Публикация V4](docs/release-v4.md).

## Сохранённые HTML и motion-лаборатории

Обновление по референсам Ивана: видимая цветная подложка, перекрывающиеся слои и раздельные 2D-плёнки / 3D-кромки без базовой равномерной обводки. Текст получает устойчивые зоны чтения, а keyboard focus сохраняется. Новое движение — авторская интерпретация статичных изображений.

Шесть проектных ролей в [`.codex/agents`](.codex/agents): design, site, moodboard, skill, QA, release. [Работа команды](docs/agent-team.md) · [Границы файлов](agents/ownership.json) · [Правила проекта](AGENTS.md) · [Приёмка V2](docs/acceptance-v2.md) · [Приёмка V3](docs/acceptance-v3.md) · [Публикация V3](docs/release-v3.md). В сборке реальные агенты реализовали отдельные части и выполнили перекрёстный review. Все шесть ролей обнаружены и запущены через native `agent_type` как в CLI, так и в новом Desktop-чате отдельного проекта. CLI design/site/QA отдельно выполнили сборку и браузерную приёмку. [Desktop 6/6](docs/desktop-project-verification.md) · [CLI и тестовый блок](docs/agent-native-smoke.md).

Карта расширена двумя самостоятельными разделами: [HTML и состояния](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html#html-atlas) и [Motion](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html#motion-atlas). **113 HTML-тегов**, SVG/MathML отдельно, **22 типа input**, **12 групп состояний**, **39 motion-образцов в13 группах**. Нативные теги, типы полей и составные паттерны считаются отдельно. Служебные элементы показаны рецептами, медиа и серверные интеграции не выдаются за подключённые сервисы.

## Что входит

- [`skill/glass-neon-motion`](skill/glass-neon-motion/SKILL.md): entrypoint и руководства по материалам, референсам, компонентам, motion, библиотекам, приёмке и работе команды.
- [`site/moodboard.html`](site/moodboard.html): Glass Atlas, **48 отдельных визуальных композиций**, расширенные HTML/motion карты, 10 исходных разделов, 6 живых материальных этюдов, 23 референса Ивана и 10 исходных источников; поиск, фильтр, motion replay и рецепты.
- [`site/index.html`](site/index.html): авторский LUMA demo, две темы, три акцента, blur/solid/reduced controls, экспорт частичных CSS-токенов, modal и FAQ.
- [`docs/global-rule-addition.md`](docs/global-rule-addition.md): переносимое дополнение frontend-правил.
- [`docs/references-review.md`](docs/references-review.md): источники, фактические наблюдения и решения арт-директора.
- [`docs/design.md`](docs/design.md): brief, композиция и motion score. [`docs/acceptance.md`](docs/acceptance.md): фактическая приёмка и ограничения.

Исходные 48 композиций остаются визуальными схемами и рецептами. Рабочая UI-библиотека V5 — отдельный раздел с собственным manifest. Локальный preview загрузки файла не означает серверное хранение; учебная корзина не принимает оплату. Статусы не смешиваются.

## Запуск

Node.js 22+; production npm-зависимостей нет. Сайт самодостаточен: CSS/JS и локальные шрифты. Никаких API-ключей, подписок или CDN для работы демо.

```sh
npm ci
npm run check
npm start
```

Открыть `http://127.0.0.1:4177/` и `http://127.0.0.1:4177/moodboard.html`. Другой порт: переменная `PORT`. Сервер слушает только loopback и предназначен для просмотра, не production.

```sh
npm run generate
npm run check
npm run build
```

Готовый статический сайт — `dist/`. Публикация репозитория не равна размещению сайта на публичном домене. Для хостинга достаточно static hosting с MIME types и HTTPS. Перед production подключить реальные данные/действия и проверить целевые браузеры.

## Установка навыка

Из корня репозитория:

```sh
node scripts/install-skill.mjs
```

Создаёт `$CODEX_HOME/skills/glass-neon-motion` или `~/.codex/skills/glass-neon-motion`. Существующий каталог не перезаписывается: для обновления сначала сравнить файлы и сохранить резервную копию. Не меняет PATH, MCP, backend или конфигурацию приложения. Можно передать явный путь назначения первым аргументом. Проверка после установки — прочитать SKILL.md и проверить доступность в следующем чате; сохранённые файлы не доказывают reload уже открытых чатов.

Пример запроса: «Используй `$glass-neon-motion`: создай glass-сайт в двух темах, составь карту референсов и motion-score, проверь мобильную версию и reduced motion».

## Какие библиотеки нужны

| Уровень | Инструмент | Когда нужен |
|---|---|---|
| Базовое стекло | CSS custom properties, `backdrop-filter`, `@supports` | Материал; в демо реализовано |
| Простая обратная связь | CSS transitions | Hover/press/focus; в демо реализовано |
| Конечные сцены | Web Animations API + `matchMedia` + cleanup | Вступление, replay и modal; в демо реализовано |
| React-приложение | React + Motion | Состояния, layout, exit, gestures; **опционально, не установлено в демо** |
| Сложная хореография | GSAP + нужные plugins, в React `@gsap/react` | Scroll/timeline; **опционально** |
| Сложные контролы | Существующая база или shadcn/ui / Radix | Доступные menu/combobox/dialog; **опционально** |
| Сборка приложения | Vite или текущий framework | Нужен приложению, не CSS-стеклу |
| Проверка | Playwright / реальный браузер | E2E и скриншоты; отдельно от runtime |

Подробные маршруты, точная установка выбранных версий, лицензии и ограничения: [stack.md](skill/glass-neon-motion/references/stack.md). Не устанавливать весь список одновременно. Motion+ / премиальные шаблоны не требуются. Blur не является физической рефракцией; WebGL — отдельная необязательная задача.

## Проверки и происхождение

Два независимых reviewer-агента проверяли мудборд и сайт; третий подготовил и валидировал skill. Найденные дефекты исправлены перед итоговой приёмкой. [Подробный результат](docs/acceptance.md). Большие screenshots и локальные резервные копии исключены из Git; переносимая сводка и скрипты сохранены.

HTML/CSS/JS и оптические этюды написаны для проекта. Manrope — `@fontsource-variable/manrope` 5.3.0, Latin/Cyrillic; [SIL OFL](site/assets/Manrope-OFL.txt), [upstream](https://github.com/sharanda/manrope), [Fontsource](https://fontsource.org/fonts/manrope). Внешние страницы — референсы, их изображения/логотипы не переупакованы. Поиск навыков нашёл существующий glassmorphism-скилл; он не копировался и не устанавливался вместо оригинального расширения. Код сторонних component libraries не включён.

Репозиторий публичный по запросу владельца; отсутствие отдельной лицензии на оригинальные материалы не предоставляет третьим лицам права на распространение. Лицензия приложенного шрифта сохраняет силу.

Материалы V5: матовая плёнка, матовое стекло, прозрачная глянцевая плёнка и прозрачное глянцевое стекло. [Сравнение на сайте](https://rdsolod-ui.github.io/glass-neon-motion-skill/#finish-lab) и [правила](skill/glass-neon-motion/references/surface-finishes.md). Переключатели поверхности и 2D/3D края независимы.

[Приёмка V5](docs/acceptance-v5.md) · [Публикация V5](docs/release-v5.md) · [Повторяемые browser-проверки](tests/ui-v5/README.md).
