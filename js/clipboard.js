document.querySelectorAll('.copybutton').forEach(btn => {
  btn.addEventListener('click', async () => {
    const targetId = btn.dataset.clipboardTarget;
    const text = document.querySelector(targetId)?.value || '';
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    } catch {
      // fallback
    }
  });
});