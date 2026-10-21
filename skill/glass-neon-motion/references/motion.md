# Motion-score и рецепты

## Формат решения

Запиши для каждого эффекта: `element → purpose → trigger → start/end → engine/property owner → duration/easing → interruption → reduced substitute → cleanup → evidence`.

Приведённые значения — стартовые настройки, а не обязательная «идеальная» скорость. У частого действия feedback должен быть быстрым; фокус никогда не ждёт анимацию. Выбирай один характер движения для страницы.

| Паттерн | Триггер и эффект | Стартовое время | Прерывание / reduced |
|---|---|---|---|
| Entrance | Viewport; translateY 12→0, opacity .7→1 | 350–550 ms; ease-out | Один раз; при reduce сразу конечное состояние |
| Hover lift | Fine pointer; card translateY 0→-3 px | 160–220 ms | Pointer leave возвращает; touch не зависит от hover; reduce без lift |
| Press | Activation; scale 1→.98→1 | 100–160 ms | Повтор не копит очередь; reduce меняет тон |
| Focus | Keyboard; outline | Немедленно | Никогда не прятать outline; без отдельной анимации |
| Selected indicator | Tab/filter; маленький marker меняет положение | 160–240 ms | Последний state побеждает; reduce сразу новый marker |
| Expand | Accordion; высота по фактическому контенту | 180–260 ms | Не обрезать текст при resize; reduce без transition |
| Dialog/sheet | Open; scale .98→1 и небольшой offset | 180–280 ms | Escape действует сразу; reduce конечный state; focus не задерживать |
| Layout | Перестановка/фильтр; FLIP или layout primitive | 200–350 ms | Сохранить focus; reduce без movement |
| Progress | Изменение реального значения | 150–250 ms | Последнее значение; reduce сразу; текстовые проценты |
| Theme | Явное переключение; surfaces/text | 0–180 ms | Быстрый toggle отменяет предыдущее; reduce мгновенно |
| Specular | Однократное декоративное прохождение блика | 600–1200 ms | Не больше одного вступления; reduce без блика |
| Parallax | Scroll; декоративный plane на малой амплитуде | Зависит от scroll | Отключить на narrow/reduce; content scroll обычный |
| Drag | Pointer; прямое следование | Без искусственного lag | Есть кнопки/keyboard alternative; reduce без инерции |
| Skeleton | Реальная загрузка; нежный opacity pulse | Только пока оправдано | Static placeholder при reduce; demo конечный |

## CSS для короткого feedback

```css
.action { transition: background-color 160ms ease, transform 160ms ease; }
@media (hover: hover) and (pointer: fine) {
  .action:hover { transform: translateY(-2px); }
}
.action:active { transform: translateY(0) scale(.98); }
@media (prefers-reduced-motion: reduce) {
  .action { transition: none; }
  .action:hover, .action:active { transform: none; }
}
```

Не используй `transition: all`; за transform элемента отвечает CSS либо JS, не оба одновременно. Для совмещения hover и reveal используй внешнюю и внутреннюю обёртки с разным владением.

## WAAPI: конечное движение и живой reduce

Функция предназначена для декоративных reveal-элементов, чьё исходное CSS уже является читаемым конечным состоянием. Она не управляет открытием/закрытием dialog или semantic state.

```js
export function createRevealController(root) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Map();
  function cancelAll() {
    for (const animation of running.values()) animation.cancel();
    running.clear(); // CSS is the readable final state; no fill: forwards
  }
  const onPreference = () => { if (preference.matches) cancelAll(); };
  preference.addEventListener('change', onPreference);
  return {
    play(element, duration = 420) {
      if (!root.contains(element)) return;
      running.get(element)?.cancel();
      if (preference.matches || typeof element.animate !== 'function') return;
      const ms = Number.isFinite(duration) && duration > 0 ? Math.min(duration, 1200) : 420;
      const animation = element.animate([
        { opacity: .75, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: ms, easing: 'cubic-bezier(.2,.7,.2,1)' });
      running.set(element, animation);
      const remove = () => { if (running.get(element) === animation) running.delete(element); };
      animation.addEventListener('finish', remove, { once: true });
      animation.addEventListener('cancel', remove, { once: true });
    },
    destroy() {
      cancelAll();
      preference.removeEventListener('change', onPreference);
    }
  };
}
```

Для page visibility: прекращай декоративное движение при скрытии страницы; не перезапускай бесконечно при возвращении. Для SPA вызывай `destroy()` в lifecycle cleanup. Для ручного «без движения» вычисляй reduce как `OS preference || explicit reduction`; пользовательский replay не должен обходить системное ограничение.

## Когда нужны Motion / GSAP

- **React Motion:** state/layout/exit, springs, gestures. `MotionConfig reducedMotion="user"` — полезная основа, но opacity/filter/stagger и собственные loops надо отключать отдельно. При reduced motion рендери статический читаемый вариант; проверь изменение предпочтения в живой странице.
- **GSAP:** хореография и ScrollTrigger. Scope через context/matchMedia; cleanup `revert()`, собственные listeners/observers тоже убираются. Не создавай pin/scrub на reduced motion. Reserve geometry для pinned sections, проверяй keyboard anchor navigation.
- **Lenis:** только по конкретной цели; обычный scroll — базовый вариант. Не требуется для glassmorphism.
- **Text:** не дроби кириллицу, emoji и составные графемы через `split('')`; `Intl.Segmenter` или whole-word/whole-line fallback. Screen reader получает связный текст, а декоративная копия скрыта.
- **Refraction/WebGL:** не требуется. Если выбран, graceful fallback при отсутствии API/context loss, ограничение DPR/размера, pause offscreen и измерения на целевом устройстве.

Источники, проверены 2026-10-21: [MDN Element.animate](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate), [Motion accessibility](https://motion.dev/docs/react-accessibility), [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/). Рецепты здесь оригинальные; версия пакета проекта и реальное выполнение важнее давнего примера.
