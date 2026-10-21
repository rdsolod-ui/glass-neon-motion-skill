# Приёмка мудборда, сайта и навыка

## Доказательства по этапам

| Этап | Что сдаётся | Критерий перехода |
|---|---|---|
| Brief/reference | Источники, observed/adapted, границы coverage | Нет выдуманной динамики, понятное направление и самостоятельная композиция |
| Static | Desktop/mobile двух тем, typography/material tokens | Читаемо, ясная иерархия, реальный контент, без JS основной смысл доступен |
| Motion | Motion-score, running examples, static substitutes | Эффекты объясняют действия, конечны, прерываемы, один owner |
| Runtime | Build + реальные browser сценарии | Нет blocking defects; ограничения названы |
| Delivery | Skill/source, команды, manifest, report | Все ссылки/файлы доступны; подготовка, installation и publication различаются |

## Browser checklist

- Реальные screenshots light/dark на desktop, tablet и mobile; ориентиры 1440/768/390 px, stress 320 px. Проверить 200% zoom, длинные строки и отсутствие глобального horizontal overflow. Не маскировать дефект `overflow-x:hidden` на body.
- Пройти Tab/Shift+Tab, Enter/Space, Escape, arrows где требуют patterns. Видимый focus, нет traps кроме открытого modal. Диалог закрывается и возвращает focus к trigger; modal scroll не ломает страницу.
- Touch: нет обязательного hover, drag-only действия имеют альтернативы. Проверить размер/расстояние целей, точные active/disabled состояния.
- Контраст обеих тем на реальных composite backgrounds; явно проверить мелкие captions, placeholder/help/error, neon action text и focus. Одних hex-токенов недостаточно.
- Reduced motion до load и во время активной анимации: всё читаемо сразу; нет оставшейся opacity 0, blur, stagger, transform, scrub или очереди replay. Быстро переключить тему/компонент несколько раз.
- Reduced transparency и ручной dense mode; fallback без backdrop-filter; forced colors. В отчёте различать эмуляцию CSS-класса, реальное media emulation и проверку OS.
- Form: ошибки связаны с полем, повторная отправка разумна, успех соответствует реальному backend. Demo не обещает отправку, если она только локальная.
- Console/network, asset loading, кириллица и реальные fonts. Проверять собранный output, а не только dev source.
- Repeated mount/unmount для SPA, отмена listeners/observers/timers/animations. Для обычной страницы проверить init/destroy применяемых контроллеров и отсутствие бесконечного декора после ожидания.
- Профилировать большие blur-поверхности, если заявляется производительность. Не писать «60 FPS», «все устройства» или «WCAG certified» по результату нескольких screenshots.

## Независимые агенты

Использовать при прямом разрешении пользователя на агентов/делегирование или применимых инструкциях. Иначе выполнить эти роли последовательно самому и не называть проверку независимой. Если слоты ограничены, повторно использовать уже созданных reviewer agents; не создавать новые чаты пользователя.

**Арт-директор мудборда — этапы reference и static**

> Проверь brief, карту источников и реальный мудборд. Если доступны, примени website-reference-pack и профильный design/typography skill. Не меняй brief. Проверь оригинальность композиции, оптическую глубину, различие light/dark, роли неона, широту и честность карты компонентов. Для каждого замечания укажи место, влияние и конкретную корректировку. Сравни источники и адаптацию; не приписывай screenshot анимацию. Верни Block/Approve for inspected scope и непроверенное.

**Motion/accessibility reviewer — этапы static, motion и runtime**

> Проверь сайт через реальные browser interaction и screenshots, применяя доступные website-motion-design, better-ui/review-animations. Проверь responsive, keyboard/touch/dialog/focus, контраст composite surfaces, reduced motion до load и при live toggle, transparency fallback, forced colors, cleanup и rapid interruption. Укажи доказательства, дефекты с приоритетами, шаги воспроизведения и ограничения. Не объявляй весь сайт проверенным по одной странице.

**Skill reviewer — перед delivery**

> Получи только skill и реалистичный brief: «Сделай glassmorphism лендинг на существующем React-проекте, светлая/тёмная темы, neon CTA, работающая форма». Составь план и небольшой isolated prototype без внешней публикации. Проверь, не навязывает ли skill все библиотеки, выдуманные цифры, платные assets, скрытый контент/reduced motion или авто-публикацию. Оцени маршрутизацию references и достаточность инструкций. Верни проверенные результаты и необходимые правки, не переписывай source без согласованного ownership.

Review table: `severity | artifact/location | before | correction | evidence/status`. Исполнитель применяет пакет исправлений; reviewer проверяет затронутые места. Review не заменяет конечного решения пользователя и не расширяет scope публикации.

## Формат отчёта

Указать версии и среду, URL/build commit, viewport/theme matrix, выполненные сценарии, screenshots/log paths, найденные/исправленные дефекты, непроверенные browser/device/backend слои. Статусы: prepared → built → browser-tested → visually-reviewed → published/read-back; не перескакивать между ними по наличию файла.
