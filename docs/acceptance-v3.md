# LUMA V3 — приёмка расширенного атласа

Дата: 2026-10-21. Объём: расширить существующий мудборд, опубликовать этюд команды и обновить skill, сохранив 2D/3D без базовой декоративной обводки.

## Реализовано

- 113 conforming HTML-тегов по датированному WHATWG roster; SVG/MathML отдельно. 11 семантических групп, 22 input types, 12 групп состояний. Служебные теги — рецепты, устаревшие и экспериментальные — отдельно.
- 39 motion-образцов в 13 группах. 37 конечных WAAPI-сцен, настоящий локальный scroll и pointer/keyboard slider. Для каждого доступны назначение, триггер, свойства/владелец, время, прерывание, reduced и cleanup.
- Сохранены 48 исходных композиций, 6 материальных этюдов и 23 пользовательских референса. Все новые секции находятся по прежнему moodboard URL.
- Публикуемый `site/study/` переиспользует шрифты, содержит только HTML/CSS/JS. Runtime/session logs, QA-изображения и backups не входят в Pages.
- В skill добавлены `html-atlas.md` и `motion-families.md`; установленная копия обновлена с backup и побайтовой проверкой. Это не утверждение о перезагрузке открытых чатов.

## Фактическая команда

| Исполнитель | Реализация | Независимая приёмка |
|---|---|---|
| html_atlas_v3 | HTML карта, source roster | Motion: 20/20 +4/4, screenshots inspected |
| motion_atlas_v3 | Motion карта и runtime | HTML: 26/26, screenshots inspected |
| desktop_roles_v3 | Штатное открытие проекта до trust prompt | Этюд: 15 критериев +7/7 интеграции; skill forward review |
| Координатор | Интеграция, skill, публикационный build | Итоговый интеграционный прогон29/29 |

В этом Desktop-чате доступен обычный collaboration selector; роли исполнителей переданы явными заданиями. Ранее подтверждены **native CLI6/6** и реальная именованная цепочка design→build→QA: [доказательства](agent-native-smoke.md). Отдельный Desktop project дошёл до запроса доверия: [точный статус](desktop-project-verification.md). Ни наличие TOML, ни fallback-команда не выдаются за native Desktop discovery.

## Проверки и исправления

- HTML author QA30/30; motion author QA61/61. Это собственные проверки, отдельно от peer review.
- [HTML peer](qa/html-v3-peer.md), [motion peer](qa/motion-v3-peer.md), [этюд и skill](qa/study-v3.md).
- Итоговый browser flow29/29,0 JS/asset errors: обе темы,1440/768/390/320, уникальные id, anchors, меню, независимость новых/старых dialog, solid, OS reduced до загрузки и вживую, slider keyboard, no-JS, регрессия главного сайта. [Компактный отчёт](../tests/atlas-v3/evidence/integration.json).
- `npm run generate`, `npm run check`27/27, `npm run build`; синтаксис site/scripts,7 TOML, штатный skill validator — успешно.
- Исправлены: selector3D, специфичность кнопок; local reduced также отменяет CSS hover; ARIA-значение scroll progress; no-JS controls disabled. Source/generated проверка предотвращает публикацию устаревшего HTML при ошибке генератора.
- В одном промежуточном интеграционном прогоне reduced после reload переиспользованной CDP-страницы дал отрицательный результат. В том тесте не было подтверждения действующего media state после reload. Причина не установлена. Финальная проверка старта использует новый context с reduced до navigation и проверяет `matchMedia`, `data-reduce` и реальные Animation объекты; прошла. Live-change проверяется отдельно. Нет вывода об исправлении браузерного движка.

## Границы

Проверен Chromium с desktop/mobile emulation. Физические телефоны, Safari/Firefox, полноценные screen-reader/WCAG и FPS-профиль не проверены. Большая карта не является библиотекой113 production-компонентов; сервер, авторизация, загрузка файлов, платежи и воспроизведение реального media не подключены. Replay показывает эффект; готовая логика компонентов не подразумевается.

Публичный deploy и read-back фиксируются отдельно в [релизе](release-v3.md).
