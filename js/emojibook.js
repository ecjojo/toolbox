// js/emojibook.js
import { emojis, defaultEmojis } from './emojidata.js';

(() => {
  // === DOM ===
  const panel = document.querySelector('section[aria-label="emoji book"]');
  const recentEmojiContainer = document.getElementById('recent-emojis');
  const emojiContainer = document.getElementById('emoji-book');
  if (!panel || !recentEmojiContainer || !emojiContainer) return;
  if (emojiContainer.dataset.inited === 'true') return; // 防多次初始化
  emojiContainer.dataset.inited = 'true';

  // === 常數 ===
  const STORAGE_KEY   = 'recentEmojis';
  const MAX_RECENT    = 24;
  const INITIAL_CATS  = 2;  // 首批渲染的分類數
  const BATCH_CATS    = 2;  // 每次追加的分類數
  const KEEP_CATS_WHEN_HIDDEN = 2; // 面板隱藏時保留的分類數
  const EMOJI_CLASS   = 'emoji';

  // === 狀態 ===
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (!Array.isArray(recent)) recent = [];
  } catch { recent = []; }

  // === Util ===
  async function copyToClipboard(text) {
    try {
      if (navigator.clipboard && isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly','');
        ta.style.position='absolute'; ta.style.left='-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      }
    } catch {}
  }
  function playClickSound(){
    if (window.btnSound_book?.play) {
      try { window.btnSound_book.currentTime = 0; window.btnSound_book.play(); } catch {}
    }
  }
  function updateRecent(ch){
    const i = recent.indexOf(ch);
    if (i !== -1) recent.splice(i,1);
    recent.unshift(ch);
    if (recent.length > MAX_RECENT) recent.length = MAX_RECENT;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(recent)); } catch {}
  }
  function renderRecentStrip(){
    const frag = document.createDocumentFragment();

    // 最近
    for (let i=0;i<recent.length;i++){
      const el = document.createElement('div');
      el.className = EMOJI_CLASS;
      el.textContent = recent[i];
      el.dataset.emoji = recent[i];
      frag.appendChild(el);
    }

    // 預設補齊
    const need = Math.max(0, MAX_RECENT - recent.length);
    const used = new Set(recent); let added = 0;
    for (let i=0;i<defaultEmojis.length && added<need;i++){
      const e = defaultEmojis[i];
      if (used.has(e)) continue;
      const el = document.createElement('div');
      el.className = EMOJI_CLASS;
      el.textContent = e;
      el.dataset.emoji = e;
      frag.appendChild(el);
      added++;
    }

    recentEmojiContainer.replaceChildren(frag);
  }

  // === 分批渲染 ===
  let nextCatIndex = 0;
  const sentinel = document.createElement('div');
  sentinel.id = 'emoji-sentinel';
  sentinel.style.height = '1px';

  function renderCategoryChunk(count){
    const frag = document.createDocumentFragment();
    const end = Math.min(nextCatIndex + count, emojis.length);
    for (let i=nextCatIndex; i<end; i++){
      const { category, emojis: list } = emojis[i];

      const title = document.createElement('div');
      title.className = 'emoji-category';
      title.textContent = category;
      frag.appendChild(title);

      const wrapper = document.createElement('div');
      wrapper.className = 'emoji-list';
      let html = '';
      for (let j=0; j<list.length; j++){
        const e = list[j];
        html += `<div class="${EMOJI_CLASS}" data-emoji="${e}">${e}</div>`;
      }
      wrapper.innerHTML = html;
      frag.appendChild(wrapper);
    }
    nextCatIndex = end;
    emojiContainer.insertBefore(frag, sentinel);
  }

  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    if (nextCatIndex >= emojis.length) return;
    renderCategoryChunk(BATCH_CATS);
    if (nextCatIndex >= emojis.length) io.unobserve(sentinel);
  }, {
    root: panel,              // 觀測「可滾動的面板」
    rootMargin: '200px 0px',
    threshold: 0
  });

  // === 事件委派 ===
  const clickHandler = async (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;
    if (!t.classList.contains(EMOJI_CLASS)) return;
    const ch = t.dataset.emoji || t.textContent || '';
    if (!ch) return;
    await copyToClipboard(ch);
    updateRecent(ch);
    playClickSound();
    renderRecentStrip();
  };
  recentEmojiContainer.addEventListener('click', clickHandler, { passive:true });
  emojiContainer.addEventListener('click', clickHandler, { passive:true });

  // === 初始化 ===
  function init(){
    renderRecentStrip();
    emojiContainer.innerHTML = '';
    emojiContainer.appendChild(sentinel);
    requestAnimationFrame(() => {
      renderCategoryChunk(INITIAL_CATS);
      io.observe(sentinel);
    });
  }

  // === mount / unmount（切頁時用） ===
  function unmountEmojiBook(){
    io.disconnect();

    // 只保留前 KEEP_CATS_WHEN_HIDDEN 個分類
    const titles = emojiContainer.querySelectorAll('.emoji-category');
    const lists  = emojiContainer.querySelectorAll('.emoji-list');
    const keep   = Math.min(KEEP_CATS_WHEN_HIDDEN, titles.length);

    for (let i = keep; i < titles.length; i++) titles[i].remove();
    for (let i = keep; i < lists.length;  i++) lists[i].remove();

    if (!emojiContainer.contains(sentinel)) emojiContainer.appendChild(sentinel);

    // ★ 關鍵修正：把 nextCatIndex 重設為「目前仍存在的分類數」
    const renderedCats = emojiContainer.querySelectorAll('.emoji-category').length;
    nextCatIndex = renderedCats;
  }

  function mountEmojiBook(){
    // 重新觀測，需時會繼續載入
    if (!emojiContainer.contains(sentinel)) emojiContainer.appendChild(sentinel);
    if (nextCatIndex < emojis.length) {
      io.observe(sentinel);
    }
  }

  // 暴露給外部
  window.emojiBook = { mount: mountEmojiBook, unmount: unmountEmojiBook };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
