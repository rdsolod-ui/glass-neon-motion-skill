const installStatus = document.querySelector('.install-status');
for (const button of document.querySelectorAll('[data-copy-install]')) {
  button.hidden = false;
  button.addEventListener('click', async () => {
    const code = document.getElementById(button.dataset.copyInstall);
    try {
      await navigator.clipboard.writeText(code.textContent);
      installStatus.textContent = 'Команда скопирована. Вставьте её в терминал.';
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(code);
      selection.removeAllRanges();
      selection.addRange(range);
      code.closest('pre').focus();
      installStatus.textContent = 'Команда выделена. Скопируйте её вручную: Ctrl+C или ⌘C.';
    }
  });
}
