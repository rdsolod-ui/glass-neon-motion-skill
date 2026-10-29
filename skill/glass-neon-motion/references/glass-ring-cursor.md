# Glass ring cursor — approved pattern, 2026-10-29

Базовый курсор: круглое кольцо 48 px, прозрачная стеклянная середина, backdrop blur3. На ссылках, кнопках, summary, checkbox/radio и label сохранять форму/размер; пульсировать только opacity неонового halo (0.2 →0.9 →0.2),1.8s ease-in-out infinite. Loop разрешён явным brief только пока hover активного доступного элемента; остановка при выходе, blur, скрытии документа, смене reduced motion/forced colors или native cursor.

Нажатие primary pointer: scale2/3 за100ms, то есть48→32px; отпускание возврат за220–250ms. Никаких капсул, подписей внутри и расходящейся click wave. CSS владеет opacity halo на ::after, JS/GSAP/WAAPI — scale самого кольца; не анимировать один transform двумя движками. pointer-events:none, aria-hidden; контент/кнопки не сдвигаются, click не задерживается. Текстовые поля/select/contenteditable сохраняют системный курсор. Fine pointer only; touch/reduced/forced colors/native preference — обычный курсор. Нужны cleanup listeners/tweens и прерывание на pointercancel/blur.

Рабочие исходники рецепта: `glass-ring-cursor.css`, `glass-ring-cursor.js` (без зависимостей). В GSAP-проекте позиционирование и scale может обслуживать существующий GSAP cursor controller. Live specimen: https://marketing.parkskazka.ru/glass-neon-motion/moodboard.html#glass-ring-cursor .

QA: idle/active без изменения48px, press32px, отпускание48px, обе темы, pointerleave/blur, initial/live reduced, disabled, native inputs и touch. Скриншот не доказывает loop — проверять animation state и ход opacity во времени.
