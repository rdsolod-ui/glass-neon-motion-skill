const root = document.documentElement;
const themeButton = document.querySelector('#theme-toggle');
const solidToggle = document.querySelector('#solid-toggle');
const modes = {
  '2d': ['Плёнка без толщины', 'Граница возникает из прозрачности и рассеивания. Без обводки, фаски и объёмной тени.', '2D FILM'],
  '3d': ['Кромка с направленным светом', 'Локальный блик слева сверху и мягкая тень справа снизу создают ощущение толщины. Без равномерного контура.', '3D OPTICAL EDGE']
};
themeButton.addEventListener('click', () => {
  const dark = root.dataset.theme !== 'dark';
  root.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
});
document.querySelectorAll('[name="material"]').forEach(input => input.addEventListener('change', () => {
  if (!input.checked || !modes[input.value]) return;
  root.dataset.mode = input.value;
  const [title, copy, label] = modes[input.value];
  document.querySelector('#mode-title').textContent = title;
  document.querySelector('#mode-copy').textContent = copy;
  document.querySelector('#stage-label').textContent = label;
}));
const reducedTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
const forcedColors = matchMedia('(forced-colors: active)');
const blurSupported = CSS.supports('backdrop-filter', 'blur(1px)') || CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
function syncSurfaceDescription() {
  const solid = solidToggle.checked || reducedTransparency.matches || forcedColors.matches || !blurSupported;
  document.querySelector('.stage').setAttribute('aria-label', solid
    ? 'Плотная поверхность без прозрачности закрывает цветные ленты. Режим доступности сохраняет геометрию образца.'
    : 'Цветные ленты пересекают прозрачную плоскость: снаружи контуры чёткие, внутри размыты.');
  document.querySelector('figcaption span').textContent = solid ? 'Плотный режим · без прозрачности.' : 'Чётко снаружи. Мягко внутри.';
}
solidToggle.addEventListener('change', () => { root.dataset.solid = String(solidToggle.checked); syncSurfaceDescription(); });
reducedTransparency.addEventListener('change', syncSurfaceDescription);
forcedColors.addEventListener('change', syncSurfaceDescription);
syncSurfaceDescription();
