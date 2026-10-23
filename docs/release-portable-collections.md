# Переносимые подборки — 2026-10-23

Опубликованы JSON import/export с темой, порядок мышью/клавиатурой, дублирование и восстановление темы подборки. Source 11199545e518c437ca4842c73317232f4196fdd2; Pages39984827266 success. Независимые локальные и публичные targeted checks 10/10; check/build pass. Chrome headless, без полной межбраузерной сертификации. Исправлено перетаскивание ссылки внутри строки. Global installed skill не менялся.

[Мудборд](https://rdsolod-ui.github.io/glass-neon-motion-skill/moodboard.html#collection-studio)

Формат luma-collection v1; импорт добавляет новую подборку. Неизвестные ID пропускаются с сообщением, поврежденные файлы отклоняются. Исходники: site/collections.js, site/collection-format.js, site/theme-studio.js; skill reference collections-typography.md. Проверка tests/portable-peer.cjs поддерживает BASE_URL.
