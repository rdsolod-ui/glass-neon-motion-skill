# Прозрачное глянцевое стекло по умолчанию — приёмка сайта

Дата: 2026-10-22. Независимый reviewer: `controls_finish`, явно переданная роль `glass_qa` из `.codex/agents/glass_qa.toml`. Текущий collaboration API не имеет `agent_type`; это не новый тест native discovery. Автор исходных изменений — координатор. Reviewer меняет только этот отчёт и локальные ignored-файлы `qa/default-clear-site/`.

## Brief

Основной стиль главной страницы: прозрачная глянцевая поверхность (`clear`) с объёмным краем (`depth`). Все четыре материала остаются выбираемыми; светлая/тёмная темы, reduced motion, Solid и forced colors сохраняются. Личная лаборатория `#custom-material` остаётся самостоятельным образцом с собственным ползунком blur.

Прочитаны AGENTS, проектный skill, surface-finishes/acceptance, relevant better-ui, текущие theme/material scripts и CSS. Существующие правила first-paint, compositor repair и доступности учитываются; новые библиотеки не требуются.

## Concept/code review перед реализацией

| Риск | Требуемый результат |
|---|---|
| Runtime fallback пока frost/film; чистый HTML не задаёт clear/depth | Материал задан в статическом `<html>` и в runtime fallback: first paint и no-JS согласованы |
| Первый preset, status и hero badge пока подписаны как матовые | Статические aria-pressed/status/badge соответствуют clear+depth до enhancement |
| Глобальная замена базовых frost-токенов может уничтожить матовые варианты | Меняется выбор default, сохраняются четыре реализации и переходы между ними |
| Glossy override может снова размывать host и текст | Эффект `#motion-target` остаётся на `::before`; host без backdrop-filter |
| Clear light имеет высокую специфичность и прозрачную подложку | Solid/forced-colors/reduced-transparency сохраняют непрозрачный читаемый fallback |

Все перечисленные риски default устранены автором до browser handoff. Исходные файлы reviewer не редактировал.

## Реальная браузерная приёмка

Локальный URL: `http://127.0.0.1:4177/index.html`. Chromium через существующий выделенный CDP9223; отдельный контекст, проверка выполнялась последовательно без параллельных browser suites. Контекст после завершения закрыт.

**29/29 проверок PASS, pageerrors 0.** Тест и receipt: `qa/default-clear-site/review.cjs`, `qa/default-clear-site/receipt.json` (локальные ignored-файлы).

- Статический HTML содержит `clear`/`depth`; при намеренно заблокированных JS-файлах CSS уже рисует clear 0,8 px, выбран clear-glass, status согласован. Это CSS-only first-render проверка; измерение filmstrip первого paint не выполнялось.
- После обычной загрузки runtime сохраняет clear/depth; hero badge соответствует 0,8 px. Theme переключается без потери материала.
- Light/dark × 1440, 768, 390, 320 px: no document overflow, actual clear filter, border 0 и направленная inset-тень.
- В обеих темах keyboard Enter выбирает все четыре материала; state и `aria-pressed` синхронны. Матовые и плоские варианты сохранены.
- Solid: непрозрачный host, blur выключен, motion pseudo скрыт. Forced colors и reduced transparency проверены реальной media emulation с `matchMedia` read-back, а не только изменением класса.
- Reduced motion установлен до загрузки с read-back; live смена останавливает активный motion. Touch-меню закрывается Escape с возвратом фокуса, modal сохраняет Tab внутри и возвращает focus инициатору.
- Введённое длинное название сохраняется при смене материала. Персональный slider задаёт 6 px только своему preview; motion sample остаётся clear 0,8 px, host без backdrop-filter.

## Визуальная проверка

Просмотрены `hero-{light,dark}-{1440,390}.png`, `motion-{light,dark}-{1440,390}.png`, `studio-long-label.png` в `qa/default-clear-site/`. Прозрачная оболочка, отражение и объёмная грань видны; основные тексты/кнопки читаемы, длинная подпись остаётся внутри прокручиваемого preview. Малые материалы сравниваются на одном фоне; эффект не называется физической рефракцией.

| Severity | Место / Before | Корректировка | Evidence / status |
|---|---|---|---|
| P3 | Desktop hero: `.float-chip` частично перекрывал декоративную подпись «Сквозь поверхность» в `.instrument-footer` | Автор сместил chip до `bottom:-32px` при ширине от 761 px | Исправлено. Final receipt проверяет непересечение даже осевых bounding boxes в обеих темах на 1440/1100/900/768 px; просмотрены новые кадры |
| P3 | После смещения chip на 768 px пересекал нижнюю `.scene-caption` | Автор перенёс caption под chip: `bottom:-64px` при 761–1100 px | Исправлено. `final-hero-{light,dark}-{768,900,1100}.png`: подпись, chip и rail разделены; геометрия и реальные снимки согласованы |
| P3 | В clear dark за кнопкой темы просвечивали яркий CTA и крупный hero-текст; wells первоначально защищали только brand/nav | Автор распространил непрозрачную подложку на `.topbar .actions .btn`, сохранил forced-colors override | Исправлено. Кнопки, brand и ссылки проверены на сайте и мудборде в обеих темах, desktop/mobile; текст читаем независимо от контента за шапкой |

## Финальный read-back после исправлений

**24/24 целевых проверок PASS, pageerrors 0.** Script/receipt: `qa/default-clear-site/recheck-final.cjs` и `recheck-final.json`. Проверены light/dark × 1440, 1100, 900, 768, 390 px: нет горизонтального overflow или пересечения chip с rail; на desktop отдельно проверены footer-label и scene-caption. На сайте и мудборде computed background всех видимых текстовых элементов шапки, включая кнопки, непрозрачен. Контекст закрыт; браузерный baton передан координатору.

Визуально просмотрены 14 финальных кадров: `final-hero-{light,dark}-{768,900,1100}.png`, `final-header-{light,dark}-{1440,390}.png`, `final-board-header-{light,dark}-{1440,390}.png`. До них просмотрены исходные desktop/mobile кадры и промежуточные снимки. Первый узкий recheck при `bottom:-16px` не прошёл консервативную проверку label-overlap на 1100 px; его failed receipt сохранён как `recheck-before-gap-32.json`, результат не переобъявлен успешным. Промежуточные 16/16 геометрических проверок не заменили визуальную проверку: именно просмотр обнаружил caption и оставшиеся прозрачные кнопки. Все три замечания закрыты последующим авторским исправлением и независимым read-back.

**Итоговый gate: принято в проверенном объёме, открытых замечаний по этому изменению нет.** Исходники reviewer не менял. Физический телефон, Safari/Firefox, скринридер, производительность/FPS и публикация не подтверждаются этой приёмкой.
