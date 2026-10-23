// Stable-height, observer-driven glyph book.
// Browser-native scrolling has no scroll listener or DOM recycling on each frame.
export function createVirtualBook({ panel, container, groups, itemKey, mode }) {
  const ROW_HEIGHT = 40;
  const GAP = 6;
  const MIN_CELL = mode === 'emoji' ? 40 : 48;
  const CHUNK_ROWS = 10;
  const ITEM_CLASS = mode === 'emoji' ? 'emoji' : 'symbol';
  const DATA_KEY = mode === 'emoji' ? 'emoji' : 'symbol';
  let columns = 0;
  let observer = null;
  let rows = [];
  let chunks = [];

  container.classList.add('virtual-book');

  function makeRows(count) {
    const result = [];
    for (const group of groups) {
      result.push({ heading: group.category });
      let cells = [];
      let occupied = 0;
      for (const value of group[itemKey]) {
        if (!value) continue;
        const span = mode === 'symbol' && Array.from(value).length > 2
          ? Math.min(count, 2) : 1;
        if (occupied + span > count) {
          result.push({ cells });
          cells = [];
          occupied = 0;
        }
        cells.push({ value, span });
        occupied += span;
      }
      if (cells.length) result.push({ cells });
    }
    return result;
  }

  function makeRow(row) {
    if (row.heading !== undefined) {
      const heading = document.createElement('div');
      heading.className = 'virtual-book-heading ' +
        (mode === 'emoji' ? 'emoji-category' : 'symbol-category');
      heading.textContent = row.heading;
      return heading;
    }
    const line = document.createElement('div');
    line.className = 'virtual-book-row';
    for (const cell of row.cells) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = ITEM_CLASS;
      item.dataset[DATA_KEY] = cell.value;
      item.textContent = cell.value;
      item.title = cell.value;
      if (cell.span > 1) item.style.gridColumn = 'span ' + cell.span;
      line.appendChild(item);
    }
    return line;
  }

  function fillChunk(chunk) {
    if (chunk.dataset.ready === 'true') return;
    chunk.dataset.ready = 'true';
    const slice = rows.slice(Number(chunk.dataset.start), Number(chunk.dataset.end));
    const fragment = document.createDocumentFragment();
    for (const row of slice) fragment.appendChild(makeRow(row));
    chunk.appendChild(fragment);
    observer?.unobserve(chunk);
  }

  function build() {
    if (panel.hidden || !container.clientWidth) return;
    const count = Math.max(1,
      Math.floor((container.clientWidth + GAP) / (MIN_CELL + GAP)));
    if (count === columns) return;

    const previousHeight = rows.length * ROW_HEIGHT;
    const previousScroll = panel.scrollTop;
    observer?.disconnect();
    columns = count;
    container.style.setProperty('--book-cols', String(columns));
    rows = makeRows(columns);
    chunks = [];

    const fragment = document.createDocumentFragment();
    for (let start = 0; start < rows.length; start += CHUNK_ROWS) {
      const end = Math.min(rows.length, start + CHUNK_ROWS);
      const chunk = document.createElement('div');
      chunk.className = 'virtual-book-chunk';
      chunk.style.height = ((end - start) * ROW_HEIGHT) + 'px';
      chunk.dataset.start = String(start);
      chunk.dataset.end = String(end);
      chunks.push(chunk);
      fragment.appendChild(chunk);
    }
    container.replaceChildren(fragment);

    // No JS work on scroll. Fill only chunks approaching the viewport.
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) fillChunk(entry.target);
        }
      }, { root: panel, rootMargin: '900px 0px', threshold: 0 });
      for (const chunk of chunks) observer.observe(chunk);
    } else {
      // Basic fallback for browsers without IntersectionObserver.
      for (const chunk of chunks) fillChunk(chunk);
    }

    // Retain approximate position on device rotation / viewport resizing.
    if (previousHeight && previousScroll > 0) {
      const ratio = Math.min(1, previousScroll / previousHeight);
      panel.scrollTop = ratio * rows.length * ROW_HEIGHT;
    }
  }

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(build);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', build, { passive: true });
  }
  build();
  return { refresh: build };
}
