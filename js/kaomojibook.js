import { kaomojis, defaultKaomojis } from './kaomojidata.js';

(() => {
  const recentContainer = document.getElementById('recent-kaomojis');
  const bookContainer   = document.getElementById('kaomoji-book');
  if (!recentContainer || !bookContainer) return;
  if (bookContainer.dataset.inited === 'true') return;
  bookContainer.dataset.inited = 'true';

  const STORAGE_KEY = 'recentKaomojis';
  const MAX_RECENT  = 10;
  const ITEM_CLASS  = 'kaomoji';

  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!Array.isArray(recent)) recent = [];
  } catch { recent = []; }

  function updateRecent(k) {
    const i = recent.indexOf(k);
    if (i !== -1) recent.splice(i, 1);
    recent.unshift(k);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recent)); } catch {}
  }

  function makeItem(k) {
    return `<button class="${ITEM_CLASS}" data-kaomoji="${encodeURIComponent(k)}">${k}</button>`;
  }

  function renderRecentStrip() {
    const shown = recent.length >= MAX_RECENT
      ? recent
      : [...recent, ...defaultKaomojis.filter(k => !recent.includes(k)).slice(0, MAX_RECENT - recent.length)];
    recentContainer.innerHTML = shown.map(makeItem).join('');
  }

function renderAll() {
  let html = '';
  for (const { category, list } of kaomojis) {
    html += `<div class="emoji-category">${category}</div><div class="kaomoji-list">`;
    for (const k of list) {
      html += `<button class="${ITEM_CLASS}" data-kaomoji="${encodeURIComponent(k)}">${k}</button>`;
    }
    html += '</div>';
  }
  bookContainer.innerHTML = html;
}

  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
        ta.style.cssText = 'position:absolute;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
    } catch {}
  }

  function playSound() {
    if (window.btnSound_book?.play) {
      try { window.btnSound_book.currentTime = 0; window.btnSound_book.play(); } catch {}
    }
  }

  const clickHandler = async (e) => {
    const t = e.target.closest(`.${ITEM_CLASS}`);
    if (!t) return;
    const k = decodeURIComponent(t.dataset.kaomoji || '');
    if (!k) return;
    await copyToClipboard(k);
    updateRecent(k);
    playSound();
    renderRecentStrip();
  };

  recentContainer.addEventListener('click', clickHandler);
  bookContainer.addEventListener('click', clickHandler);

  renderRecentStrip();
  requestAnimationFrame(() => requestAnimationFrame(renderAll));
})();