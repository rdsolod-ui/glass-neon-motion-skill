# Материалы, свет и две темы

## Система глубины

| Слой | Назначение | Материал | Чего избегать |
|---|---|---|---|
| Canvas | Общая сцена | Спокойный непрозрачный фон, локальные цветовые поля | Сильный движущийся фон под абзацами |
| Decorative plane | Свет и оптическая глубина | Статический градиент, mesh, исходная геометрия | Имитировать реальный продукт без маркировки |
| Reading surface | Контент и формы | Непрозрачный или почти непрозрачный tint | Считать прозрачный hex отдельным контрастным цветом |
| Glass control | Навигация и небольшая карточка | Tint + backdrop blur + rim + restrained shadow | Три и более вложенных blur-плоскости без причины |
| Overlay | Диалог/меню | Более плотный материал и отдельный scrim | Размывать текст самого диалога |

Назначай blur по площади и уровню, не один большой blur на всё. Предварительный диапазон 12–24 px годится для небольших поверхностей; уменьшай по результатам профилирования. Не анимируй blur, filter или огромную тень непрерывно. Не делай `will-change` постоянным на каждой карточке.

## Стартовые токены

Ниже — рецепт, не сертификат контраста для произвольного фонового изображения. Проверяй реальные композиции.

```css
:root {
  color-scheme: light;
  --canvas: #edf2f4;
  --ink: #14242c;
  --muted: #425660;
  --solid: #f8fbfc;
  --glass: rgb(248 251 252 / 88%);
  --rim: rgb(255 255 255 / 92%);
  --control-edge: #667d87;
  --action: #006878;
  --on-action: #fff;
  --neon-cyan: #36e8ef;
  --neon-lime: #d3fb59;
  --neon-pink: #f981de;
  --focus: #005a99;
  --shadow: 0 16px 48px rgb(30 65 80 / 12%);
  --blur: 18px;
  --radius-control: .8rem;
  --radius-panel: 1.6rem;
}
[data-theme="dark"] {
  color-scheme: dark;
  --canvas: #0b131b;
  --ink: #f1f8fb;
  --muted: #bbcbd4;
  --solid: #14212b;
  --glass: rgb(20 33 43 / 90%);
  --rim: rgb(205 240 255 / 25%);
  --control-edge: #7e9aa8;
  --action: #70eaf2;
  --on-action: #082127;
  --focus: #d3fb59;
  --shadow: 0 20px 60px rgb(0 0 0 / 32%);
}
.glass {
  color: var(--ink);
  background: var(--solid); /* readable baseline */
  border: 1px solid var(--rim);
  border-radius: var(--radius-panel);
  box-shadow: var(--shadow);
}
@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass {
    background: var(--glass);
    -webkit-backdrop-filter: blur(var(--blur));
    backdrop-filter: blur(var(--blur));
  }
}
:focus-visible { outline: 3px solid var(--focus); outline-offset: 4px; }
[data-transparency="reduce"] .glass {
  background: var(--solid);
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
}
@media (prefers-reduced-transparency: reduce) {
  .glass { background: var(--solid); -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@media (forced-colors: active) {
  .glass { color: CanvasText; background: Canvas; border: 1px solid CanvasText; box-shadow: none; }
  button, input, select, textarea { border: 1px solid ButtonText; }
  :focus-visible { outline: 3px solid Highlight; }
}
```

`prefers-reduced-transparency` имеет ограниченную совместимость. При заметной зависимости от прозрачности дай ручной режим «Плотные поверхности». Его значение сохраняй безопасно; блокировка localStorage не должна ломать страницу. Forced colors не отключай ради сохранения декора.

## Контраст в прозрачной сцене

1. Найди реальные самые светлые и тёмные участки под текстом, включая scroll, hover и обе темы.
2. Композитинг для одного однородного слоя оценивается по каналам `C = alpha * foreground + (1-alpha) * background`; для contrast ratio затем переводятся полученные sRGB-каналы в линейную яркость. Не усредняй ratio двух фонов.
3. Проверяй текст с результирующим цветом фона. Для обычного текста цель минимум 4.5:1, для крупного — 3:1. Определение крупного текста берётся из WCAG, а не из имени CSS-класса.
4. Границы/состояния функциональных контролов оценивай отдельно: необходимые для распознавания нетекстовые признаки — минимум 3:1 относительно соседних цветов с применимыми исключениями WCAG. Декоративный rim может быть слабым, но не может быть единственным обозначением поля. Цвет не должен единолично передавать успех/ошибку/выбор.
5. Для фотографии, blur и динамического света простая формула не является полной проверкой. Зафиксируй допустимые фоны или добавь плотный reading scrim. Измерь фактический screenshot sample и осмотри крайние состояния.

## Композиция и типографика

- Используй стекло как отдельный оптический герой, а не как сетку одинаковых карточек. Чередуй большой образ, спокойный текстовый блок, материальные образцы и функциональную секцию.
- Шкала проекта: body обычно 1–1.125 rem / 1.5–1.65; заголовки с `clamp()` и отдельной mobile-композицией. Это исходные диапазоны, не жёсткий стандарт.
- Ограничь абзацы примерно 60–75 знаками. Длинные русские слова и ссылки должны переноситься. Поля на мобильном не меньше 16 px.
- Сохраняй геометрию при загрузке шрифта. Проверяй наличный файл, лицензию, кириллицу, начертания и фактическую загрузку; system-font — допустимый честный вариант.
- Выбери единое семейство иконок. Декоративные SVG скрывай от accessibility tree; icon-only button получает понятное имя. Не заменяй рабочие контролы декоративными SVG.

Источники, проверены 2026-10-21: [MDN backdrop-filter](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter), [MDN reduced transparency](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-transparency), [W3C contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Пример токенов оригинальный; источники не утверждают его автоматическую пригодность для каждого сайта.
