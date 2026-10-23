// One lazy player shared by Emoji, Kaomoji, Symbol and the font tool.
// Merely opening the page or switching tabs never requests the audio file.
(() => {
  let audio = null;
  window.btnSound_book = {
    get currentTime() { return audio?.currentTime ?? 0; },
    set currentTime(value) {
      if (audio) { try { audio.currentTime = value; } catch {} }
    },
    play() {
      try {
        if (!audio) {
          audio = new Audio();
          audio.preload = 'none';
          audio.src = new URL('sounds/button-fx.mp3', document.baseURI).href;
        }
        audio.currentTime = 0;
        // Playback rejection must never break copying or generate an unhandled promise.
        return Promise.resolve(audio.play()).catch(() => {});
      } catch {
        return Promise.resolve();
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (event) => {
      const button = event.target.closest('.copybutton');
      if (!button || button.disabled) return;
      const selector = button.dataset.clipboardTarget;
      const text = selector
        ? (document.querySelector(selector)?.value ?? '')
        : (button.dataset.clipboardText ?? '');
      if (!text) return;

      void window.btnSound_book.play();
      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        const textarea = Object.assign(document.createElement('textarea'), {
          value: text, readOnly: true
        });
        textarea.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try { copied = document.execCommand('copy'); } catch {}
        textarea.remove();
        button.focus({ preventScroll: true });
      }
      const original = button.textContent;
      button.textContent = copied ? 'Copied' : 'Try again';
      button.disabled = true;
      setTimeout(() => {
        button.textContent = original;
        button.disabled = false;
      }, 1000);
    });
  }, { once: true });
})();
