# Целевая независимая проверка оптического слоя

2026-10-22. Reviewer: `controls_finish`. Проверял изменение координатора в `site/material-finishes.css`; реализацию не редактировал.

Реальный Chromium, отдельный контекст выделенного CDP. Локальный URL: `http://127.0.0.1:4177/index.html`. Тест: `tests/ui-v5/peer-optical-layer.cjs`; receipt: `qa/ui-v5/peer-optical-layer.json` (ignored).

**11/11 PASS, pageerrors 0.** В обеих темах на 1440 и 390 px у `#motion-target` host `backdrop-filter:none`, единственный оптический слой `::before` имеет blur 0,8 px. Border 0 px; заголовок и пояснение не перекрывают друг друга и находятся в границах карточки. Document overflow отсутствует.

В Solid режиме псевдослой скрыт, host непрозрачен и без backdrop-filter. В персональном preview ползунок устанавливает blur 6 px на его псевдослое; clear motion sample остаётся 0,8 px. Reduced preference задана до загрузки и подтверждена через `matchMedia`.

Визуально просмотрены четыре кадра `qa/ui-v5/peer-optical-{light,dark}-{1440,390}.png`: текст больше не попадает в размывающий слой, глянцевый блик и прозрачность видны, кнопки и подписи читаемы. Замечаний по этому исправлению нет. Контекст закрыт. Публикация данного уточнения этой проверкой не подтверждается.
