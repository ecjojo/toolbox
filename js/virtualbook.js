// A fixed-height, windowed grid. Only visible rows and an overscan buffer enter the DOM.
// Every item remains reachable by scrolling, without keeping thousands of glyphs rendered.
export function createVirtualBook({ panel, container, groups, itemKey, mode }) {
  const ROW_HEIGHT = 40;
  const GAP = 6;
  const MIN_CELL = mode === 'emoji' ? 40 : 48;
  const ITEM_CLASS = mode === 'emoji' ? 'emoji' : 'symbol';
  const DATA_KEY = mode === 'emoji' ? 'emoji' : 'symbol';

  container.classList.add('virtual-book');
  const before = document.createElement('div');
  before.className = 'virtual-book-spacer';
  before.setAttribute('aria-hidden', 'true');
  const visible = document.createElement('div');
  visible.className = 'virtual-book-visible';
  const after = document.createElement('div');
  after.className = 'virtual-book-spacer';
  after.setAttribute('aria-hidden', 'true');
  container.replaceChildren(before, visible, after);

  let rows = [];
  let columns = 0;
  let renderedStart = -1;
  let renderedEnd = -1;
  let listOffset = 0;
  let pendingFrame = 0;

  function buildRows(nextColumns) {
    columns = nextColumns;
    container.style.setProperty('--book-cols', String(columns));
    rows = [];
    for (const group of groups) {
      rows.push({ title: group.category });
      let current = [];
      let used = 0;
      for (const value of group[itemKey]) {
        if (!value) continue;
        const span = mode === 'symbol' && Array.from(value).length > 2
          ? Math.min(columns, 2) : 1;
        if (used + span > columns) {
          rows.push({ items: current });
          current = [];
          used = 0;
        }
        current.push({ value, span });
        used += span;
      }
      if (current.length) rows.push({ items: current });
    }
    renderedStart = -1;
    renderedEnd = -1;
  }

  function createRow(row) {
    if (row.title !== undefined) {
      const heading = document.createElement('div');
      heading.className = 'virtual-book-heading ' +
        (mode === 'emoji' ? 'emoji-category' : 'symbol-category');
      heading.textContent = row.title;
      return heading;
    }
    const line = document.createElement('div');
    line.className = 'virtual-book-row';
    for (const { value, span } of row.items) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = ITEM_CLASS;
      item.dataset[DATA_KEY] = value;
      item.textContent = value;
      item.title = value;
      if (span > 1) item.style.gridColumn = 'span ' + span;
      line.appendChild(item);
    }
    return line;
  }

  function render(force = false) {
    if (panel.hidden || !columns) return;
    const total = rows.length * ROW_HEIGHT;
    const scrollTop = panel.scrollTop;
    const viewTop = Math.max(0, scrollTop - listOffset);
    const viewBottom = Math.min(total, viewTop + panel.clientHeight);
    const buffer = Math.max(300, panel.clientHeight * 0.8);

    if (!force && renderedStart >= 0) {
      const safeTop = renderedStart === 0 ? -Infinity
        : renderedStart * ROW_HEIGHT + buffer * 0.35;
      const safeBottom = renderedEnd === rows.length ? Infinity
        : renderedEnd * ROW_HEIGHT - buffer * 0.35;
      if (viewTop >= safeTop && viewBottom <= safeBottom) return;
    }

    const start = Math.max(0, Math.floor(Math.max(0, viewTop - buffer) / ROW_HEIGHT));
    const end = Math.min(rows.length,
      Math.ceil(Math.min(total, viewBottom + buffer) / ROW_HEIGHT));
    if (start === renderedStart && end === renderedEnd) return;

    // Reuse previously mounted rows when possible.
    const old = new Map();
    if (renderedStart >= 0) {
      let index = renderedStart;
      for (const child of visible.children) old.set(index++, child);
    }
    const fragment = document.createDocumentFragment();
    for (let i = start; i < end; i++) {
      fragment.appendChild(old.get(i) || createRow(rows[i]));
    }
    before.style.height = (start * ROW_HEIGHT) + 'px';
    after.style.height = ((rows.length - end) * ROW_HEIGHT) + 'px';
    visible.replaceChildren(fragment);
    renderedStart = start;
    renderedEnd = end;
  }

  function refresh() {
    if (panel.hidden || !container.clientWidth) return;
    const width = container.clientWidth;
    const nextColumns = Math.max(1, Math.floor((width + GAP) / (MIN_CELL + GAP)));
    const changed = columns !== nextColumns;
    if (changed) {
      const previousHeight = rows.length * ROW_HEIGHT;
      const previousOffset = listOffset;
      buildRows(nextColumns);
      // Preserve approximate scroll position when the viewport width changes.
      if (previousHeight && panel.scrollTop > previousOffset) {
        const ratio = (panel.scrollTop - previousOffset) / previousHeight;
        panel.scrollTop = Math.max(0, previousOffset +
          ratio * rows.length * ROW_HEIGHT);
      }
    }
    listOffset = container.getBoundingClientRect().top -
      panel.getBoundingClientRect().top + panel.scrollTop;
    render(changed);
  }

  function onScroll() {
    if (pendingFrame || panel.hidden) return;
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = 0;
      render();
    });
  }

  panel.addEventListener('scroll', onScroll, { passive: true });
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(refresh);
    observer.observe(container);
    observer.observe(panel);
  } else {
    window.addEventListener('resize', refresh, { passive: true });
  }
  refresh();
  return { refresh };
}
