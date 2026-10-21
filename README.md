# Glass / Neon / Motion

Расширенный Codex skill для glassmorphism-сайтов: две темы, яркие неоновые акценты, осмысленный motion, интерактивный мудборд и независимая приёмка.

## Открыть онлайн

- [Тестовый сайт LUMA](https://rdsolod-ui.github.io/glass-neon-motion-skill/)
- [Мудборд Glass Atlas](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html)

Обе страницы публичны и не требуют входа. GitHub Pages публикует `site/` через `.github/workflows/pages.yml` после изменений сайта в `main`.

## Что входит

- [`skill/glass-neon-motion`](skill/glass-neon-motion/SKILL.md): entrypoint и шесть подробных руководств — материалы, референсы, компоненты, motion, библиотеки, приёмка.
- [`site/moodboard.html`](site/moodboard.html): Glass Atlas, **48 отдельных визуальных образцов**, 10 разделов, 10 проверенных источников, поиск, фильтр, motion replay и рецепты.
- [`site/index.html`](site/index.html): авторский LUMA demo, две темы, три акцента, blur/solid/reduced controls, экспорт частичных CSS-токенов, modal и FAQ.
- [`docs/global-rule-addition.md`](docs/global-rule-addition.md): переносимое дополнение frontend-правил.
- [`docs/references-review.md`](docs/references-review.md): источники, фактические наблюдения и решения арт-директора.
- [`docs/design.md`](docs/design.md): brief, композиция и motion score. [`docs/acceptance.md`](docs/acceptance.md): фактическая приёмка и ограничения.

48 образцов — карта семейств интерфейса, **не библиотека 48 полностью функциональных компонентов**. Карты, платежи, видео, загрузка файлов и другие интеграции представлены визуальными рецептами. В каждой карточке явно указан связанный live-пример или отсутствие реализации поведения.

## Запуск

Node.js 22+; production npm-зависимостей нет. Сайт самодостаточен: CSS/JS и локальные шрифты. Никаких API-ключей, подписок или CDN для работы демо.

```sh
npm ci
npm run check
npm start
```

Открыть `http://127.0.0.1:4177/` и `http://127.0.0.1:4177/moodboard.html`. Другой порт: переменная `PORT`. Сервер слушает только loopback и предназначен для просмотра, не production.

```sh
node scripts/render-atlas.mjs
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
