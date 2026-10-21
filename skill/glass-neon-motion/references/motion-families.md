# Расширенные семейства движения

Это карта выбора; не нужно помещать все эффекты на один сайт. Для каждого выбранного эффекта используй motion-score из [motion.md](motion.md). Лабораторный replay допустим для изучения; в продукте запуск следует смысловому событию пользователя/состояния.

| Группа | Примеры | Смысловой триггер и границы |
|---|---|---|
| Отклик действия | press, confirmation, validation | Реальное действие; немедленный статичный сигнал |
| Вход / выход | reveal, dissolve, sheet | Появление/удаление; семантика и focus не ждут timeline |
| Layout continuity | FLIP, resize, reorder | Изменение списка/геометрии; focus сохраняется |
| Навигация | tab marker, breadcrumb, page transition | Новая секция; route/ARIA state раньше декоративного перехода |
| Прокрутка | progress, reveal once, depth offset | Настоящий scroll; обычное чтение, без scroll hijack |
| Типографика | word reveal, line reveal, emphasis | Редкое вступление; цельный accessible текст и grapheme-safe разбиение |
| SVG | path draw, stroke dash, shape transition | Пояснение графики; viewBox/геометрия и статичный конечный кадр |
| Данные | progress value, bars, counter | Проверенные данные; численное значение доступно без анимации |
| Ожидание | skeleton, determinate progress, pending | Реальная операция; в демо явно обозначенная симуляция, конечный цикл |
| Жест | drag, snap, swipe | Настоящий pointer плюс кнопки/стрелки; отмена и release capture |
| Свет на стекле | specular sweep, caustic accent, tint | Редкий локальный акцент; не постоянное переливание рядом с текстом |
| Глубина | perspective, layer separation, parallax | Объясняет слои; 3D CSS-иллюзия, не физическая рефракция |
| Хореография | stagger, sequence, handoff | Связанная история; общий ритм, предел общей длительности |

## Движок и владение

Простой feedback — CSS; конечная независимая сцена — WAAPI. Нативные scroll/pointer события подходят небольшим примерам, когда есть cleanup и управление частотой. Motion для сложных React state/layout/gestures, GSAP для согласованных timeline/scroll сцен; не добавляй оба только ради широты карты. Ссылки и зависимости — в [stack.md](stack.md).

У каждого образца укажи, является ли trigger настоящим. Перемещение карточки по replay не доказывает реализацию drag или FLIP. Анимация ширины полосы не подключает настоящую аналитику или загрузку. Визуальное сходство не доказывает одинаковую производительность.

## Lifecycle

- Повторный запуск отменяет старую сцену, не создаёт очередь. Удаляй законченные Animation объекты из registry; не копи fill-forwards.
- Уход за viewport, скрытие вкладки и pagehide останавливают декоративные сцены. BFCache pageshow восстанавливает observers/listeners ровно один раз, без автоматического повторного шоу.
- Reduced = системное предпочтение **или** явное сокращение пользователя. Оно действует до загрузки и меняется вживую. Отключай также opacity/filter/stagger, если обещан неподвижный режим.
- При reduce сохраняй значение/выбор и конечный читаемый кадр. Drag может менять положение по непосредственному вводу без инерции; scroll не скрывает контент.
- Отключение прозрачности не должно ломать логику движения; forced-colors не должен оставлять контент без границ и подписей.

## Проверка

Проверить каждый исполнитель, прерывание повтором/сменой фильтра, быстрые переключения, offscreen/hidden, загрузку и live reduced, keyboard/touch, no-JS. Инспектировать промежуточные и конечные кадры. Сравнивать CSS/script property owners. Не объявлять FPS или измеренное ускорение без профилирования.

Официальные опорные источники: [WAAPI](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API), [Pointer events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), [prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion).
