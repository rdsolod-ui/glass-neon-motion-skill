# Schema.org: LUMA и Glass Atlas

В HTML встроен JSON-LD, без выполнения JavaScript. LUMA: WebSite и WebPage; Glass Atlas: WebSite, CollectionPage и ItemList из восьми видимых основных разделов. Язык ru, названия и описания соответствуют HTML, все якоря проверяются.

Organization, авторы, адреса, рейтинги, цены, лицензия на весь проект и даты публикации не добавлены: для них нет достаточного подтверждения. Это описание демонстрационного сайта и коллекции, а не разметка коммерческого продукта. Валидность Schema.org не гарантирует расширенный результат Google.

## Хостинги

Исходный site/ содержит адреса GitHub Pages. scripts/render-atlas.mjs обновляет обе страницы через scripts/structured-data.mjs, не теряя разметку при генерации мудборда.

npm run build копирует сайт в dist и генерирует JSON-LD для заданного хостинга. Без переменной используется GitHub Pages. Для VPS в PowerShell:

```powershell
$env:SCHEMA_SITE_URL='https://marketing.parkskazka.ru/glass-neon-motion/'
npm.cmd run build
Remove-Item Env:SCHEMA_SITE_URL
```

Публиковать на VPS HTML из dist/, на GitHub Pages — site/. Разметка содержит абсолютные @id и URL соответствующего хостинга. Междоменная canonical-политика не менялась.

## Проверки

npm run check проверяет JSON, единственный блок на страницу, соответствие генератору, заголовки, уникальные @id и наличие восьми якорей. Изменён только JSON-LD в head; видимый HTML совпадает с production baseline.

2026-10-28: оба JSON-LD проверены в https://validator.schema.org/ через «Фрагмент кода». LUMA: WebPage с вложенным WebSite; Glass Atlas: CollectionPage с WebSite и ItemList. Для обоих результатов: НЕТ ОШИБОК, НЕТ ПРЕДУПРЕЖДЕНИЙ. Скриншоты и снимки результата сохранены в qa/schema-20261028/validator-*-pass.*. Проверенные графы соответствуют сборке VPS. Варианты хостингов дополнительно проверены по актуальному словарю Schema.org: 90 свойств, нет ошибок domain/range.
