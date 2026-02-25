// js/emojibook.js
import { emojis, defaultEmojis } from './emojidata.js';

(() => {
  const panel = document.querySelector('section[aria-label="emoji book"]');
  const recentEmojiContainer = document.getElementById('recent-emojis');
  const emojiContainer = document.getElementById('emoji-book');
  if (!panel || !recentEmojiContainer || !emojiContainer) return;
  if (emojiContainer.dataset.inited === 'true') return;
  emojiContainer.dataset.inited = 'true';

  const STORAGE_KEY = 'recentEmojis';
  const MAX_RECENT  = 24;
  const EMOJI_CLASS = 'emoji';

  // === 最近使用 ===
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!Array.isArray(recent)) recent = [];
  } catch { recent = []; }

  function updateRecent(ch) {
    const i = recent.indexOf(ch);
    if (i !== -1) recent.splice(i, 1);
    recent.unshift(ch);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recent)); } catch {}
  }

  function renderRecentStrip() {
    const shown = recent.length >= MAX_RECENT
      ? recent
      : [
          ...recent,
          ...defaultEmojis.filter(e => !recent.includes(e)).slice(0, MAX_RECENT - recent.length)
        ];
    recentEmojiContainer.innerHTML = shown
      .map(e => `<div class="${EMOJI_CLASS}" data-emoji="${e}">${e}</div>`)
      .join('');
  }

  // === 全量渲染（一次性） ===
  function renderAll() {
    let html = '';
    for (const { category, emojis: list } of emojis) {
      html += `<div class="emoji-category">${category}</div><div class="emoji-list">`;
      for (const e of list) {
        html += `<div class="${EMOJI_CLASS}" data-emoji="${e}">${e}</div>`;
      }
      html += '</div>';
    }
    emojiContainer.innerHTML = html;
  }

  // === Clipboard ===
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = Object.assign(document.createElement('textarea'), {
          value: text, readOnly: true
        });
        ta.style.cssText = 'position:absolute;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    } catch {}
  }

  function playClickSound() {
    if (window.btnSound_book?.play) {
      try { window.btnSound_book.currentTime = 0; window.btnSound_book.play(); } catch {}
    }
  }

  // === 事件委派 ===
  const clickHandler = async (e) => {
    const t = e.target;
    if (!t?.classList.contains(EMOJI_CLASS)) return;
    const ch = t.dataset.emoji || t.textContent || '';
    if (!ch) return;
    await copyToClipboard(ch);
    updateRecent(ch);
    playClickSound();
    renderRecentStrip();
  };
  recentEmojiContainer.addEventListener('click', clickHandler);
  emojiContainer.addEventListener('click', clickHandler);

  // === 初始化 ===
  function init() {
    renderRecentStrip();
    // 讓瀏覽器先 paint 一幀再塞大量 DOM，避免白屏
    requestAnimationFrame(() => {
      requestAnimationFrame(() => renderAll());
    });
  }

  // 保留 mount/unmount 介面（tooldisplay.js 可能有呼叫）
  window.emojiBook = { mount: () => {}, unmount: () => {} };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();