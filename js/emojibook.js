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

  // Render in small tasks so the browser can paint and respond to input.
  function renderAll() {
    const CHUNK_SIZE = 120;
    let categoryIndex = 0;
    let emojiIndex = 0;
    let listElement = null;

    function scheduleNext() {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(renderChunk, { timeout: 150 });
      } else {
        setTimeout(renderChunk, 0);
      }
    }

    function renderChunk() {
      let added = 0;
      const fragment = document.createDocumentFragment();

      while (added < CHUNK_SIZE && categoryIndex < emojis.length) {
        const group = emojis[categoryIndex];
        if (!listElement) {
          const heading = document.createElement('div');
          heading.className = 'emoji-category';
          heading.textContent = group.category;
          listElement = document.createElement('div');
          listElement.className = 'emoji-list';
          fragment.append(heading, listElement);
        }
        const items = document.createDocumentFragment();
        while (emojiIndex < group.emojis.length && added < CHUNK_SIZE) {
          const value = group.emojis[emojiIndex++];
          const item = document.createElement('div');
          item.className = EMOJI_CLASS;
          item.dataset.emoji = value;
          item.textContent = value;
          items.appendChild(item);
          added++;
        }
        listElement.appendChild(items);
        if (emojiIndex === group.emojis.length) {
          categoryIndex++;
          emojiIndex = 0;
          listElement = null;
        }
      }

      emojiContainer.appendChild(fragment);
      if (categoryIndex < emojis.length) scheduleNext();
    }

    scheduleNext();
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