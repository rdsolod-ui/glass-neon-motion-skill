# LUMA / Glass Atlas

Brief: расширенный навык glassmorphism для светлых/тёмных сайтов с яркими акцентами, интерактивный мудборд, тестовый сайт, GitHub и независимая приёмка. Дата: 2026-10-21.

## Решения

Аудитория — дизайнер/разработчик, выбирающий материал и motion-паттерн. Основное действие сайта — настройка материала и экспорт частичных CSS-токенов. Атлас помогает найти компонент, источник и рецепт поведения. LUMA — вымышленная демонстрационная марка, не коммерческое предложение.

Ведущая композиционная база — design-taste-frontend-v2 с явным brief-override запретов glass/gradient/glow. Светлый frosted alabaster и тёмный smoked obsidian, один доминирующий локальный акцент. Продуктовая оптика сделана CSS, без чужих изображений. Манипуляции с blur не создают физически точную рефракцию. Типографика — локальный Manrope Latin/Cyrillic, SIL OFL; только нужные subsets. Иконографический слой — текстовые глифы и авторский знак LUMA, без несуществующих имён icon-library.

Сетка: контейнер до 1320 px; поля 36 px desktop / 18 px mobile. Header → asymmetrical hero → rail → material library → interactive form → motion laboratory → process → FAQ → contextual CTA → footer. Мудборд: парные материалы → карта 10 разделов → 48 семейств → источники. Одинаковые миниатюры внутри семейства — намеренно схематические материальные этюды, а не 48 готовых компонентов.

## Motion score реализованного демо

| Элемент | Смысл / триггер | Владелец / свойства | Время | Прерывание / reduce / cleanup |
|---|---|---|---|---|
| Hero decorative layers | Открыть глубину / один раз при загрузке | WAAPI opacity + transform | 650–850 ms | cancel → читаемое CSS; media change/pagehide |
| Buttons | Feedback / fine pointer + press | CSS transform, border-color | 180 ms | pointer release; reduce без transform |
| Theme | Смена условия просмотра / кнопка | DOM data-theme + CSS tokens | сразу | Последний выбор; localStorage с catch |
| Material controls | Прямое редактирование / input | DOM + CSS variables | сразу | Нативные элементы; никакой очереди |
| Enter/lift/layout specimens | Объяснить motion / кнопка | WAAPI transform + opacity | 360–560 ms | Предыдущий эффект отменяется; reduced статичен |
| Dialog | Смена контекста / кнопка | native dialog + WAAPI | 220 ms | Escape, Tab wrap, focus restore; cancel on reduce |
| Atlas specimen | Рецепт семейства / replay | WAAPI отдельного specimen | 220–650 ms | latest wins; no fill forwards; cancel on reduce/pagehide |
| Search/filter | Найти нужный компонент / input | hidden attribute + status | сразу | Не прячет результат за анимацией |

Режим уменьшения движения отслеживается при загрузке и live. Ручное уменьшение добавляется к системному, не отменяет его. Плотный режим — доступная альтернатива прозрачности. Не используются scroll hijack, infinite shimmer, canvas/WebGL, cursor tracking и animation-driven typography.

## Scope и доказательства

[Референсы](references-review.md) содержат наблюдения агента, точные URL и карту 48 семейств. У каждого элемента атласа есть source, адаптация, тема, motion и статус покрытия. График, загрузка файлов, платежи и карты — визуальные рецепты, не подключённые сервисы. Desktop Chromium — базовая среда проверки; другие движки/реальные телефоны требуют отдельной приёмки. Проверки и ограничения записываются в [acceptance.md](acceptance.md).
