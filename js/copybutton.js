// js/copybutton.js
const btnSound = new Audio('sounds/button-fx.mp3');

// 供 emojibook.js 使用
window.btnSound_book = btnSound;

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copybutton');
    if (!btn) return;

    // 取得目標文字
    const targetSel = btn.dataset.clipboardTarget;
    const text = targetSel
      ? (document.querySelector(targetSel)?.value ?? '')
      : (btn.dataset.clipboardText ?? '');

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // fallback for older browsers
      const ta = Object.assign(document.createElement('textarea'), {
        value: text, readOnly: true
      });
      ta.style.cssText = 'position:absolute;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }

    // 音效
    try { btnSound.currentTime = 0; btnSound.play(); } catch {}

    // 按鈕回饋
    btn.textContent = 'Copied';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.disabled = false;
    }, 1000);
  });
});