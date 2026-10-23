// Once a chunk has been mounted it remains in the DOM until the page closes
// or the responsive grid's column count actually changes.
export function createVirtualBook({ panel, container, groups, itemKey, mode }) {
  const ROW_HEIGHT = 40;
  const GAP = 6;
  const MIN_CELL = mode === 'emoji' ? 40 : 48;
  const CHUNK_ROWS = 8;
  const ITEM_CLASS = mode === 'emoji' ? 'emoji' : 'symbol';
  const DATA_KEY = mode === 'emoji' ? 'emoji' : 'symbol';
  let columns = 0;
  let chunks = [];
  let observer = null;

  container.classList.add('virtual-book');

  function makeRows(count) {
    const rows = [];
    for (const group of groups) {
      rows.push({ heading: group.category });
      let cells = [];
      let occupied = 0;
      for (const value of group[itemKey]) {
        if (!value) continue;
        const span = mode === 'symbol' && Array.from(value).length > 2
          ? Math.min(count, 2) : 1;
        if (occupied + span > count) {
          rows.push({ cells });
          cells = [];
          occupied = 0;
        }
        cells.push({ value, span });
        occupied += span;
      }
      if (cells.length) rows.push({ cells });
    }
    return rows;
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
    for (const { value, span } of row.cells) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = ITEM_CLASS;
      button.dataset[DATA_KEY] = value;
      button.textContent = value;
      if (span > 1) button.style.gridColumn = 'span ' + span;
      line.appendChild(button);
    }
    return line;
  }

  function fillChunk(chunk) {
    if (chunk.dataset.loaded === 'true') return;
    const start = Number(chunk.dataset.start);
    const end = Number(chunk.dataset.end);
    const fragment = document.createDocumentFragment();
    for (let index = start; index < end; index++) {
      fragment.appendChild(makeRow(rows[index]));
    }
    chunk.appendChild(fragment);
    chunk.dataset.loaded = 'true';
    observer?.unobserve(chunk);
  }

  let rows = [];

  function refresh() {
    if (panel.hidden || !container.clientWidth) return;
    const nextColumns = Math.max(1,
      Math.floor((container.clientWidth + GAP) / (MIN_CELL + GAP)));
    if (nextColumns === columns) return;

    observer?.disconnect();
    observer = null;
    columns = nextColumns;
    container.style.setProperty('--book-cols', String(columns));
    rows = makeRows(columns);
    chunks = [];

    const fragment = document.createDocumentFragment();
    for (let start = 0; start < rows.length; start += CHUNK_ROWS) {
      const chunk = document.createElement('div');
      chunk.className = 'virtual-book-chunk';
      chunk.dataset.start = String(start);
      chunk.dataset.end = String(Math.min(rows.length, start + CHUNK_ROWS));
      chunk.style.height = ((Number(chunk.dataset.end) - start) * ROW_HEIGHT) + 'px';
      chunks.push(chunk);
      fragment.appendChild(chunk);
    }
    container.replaceChildren(fragment);

    // Render the first part immediately. All other chunks are loaded once when near.
    const firstCount = Math.min(chunks.length,
      Math.max(2, Math.ceil(((window.innerHeight || 640) + 400) / (ROW_HEIGHT * CHUNK_ROWS))));
    for (let i = 0; i < firstCount; i++) fillChunk(chunks[i]);

    if ('IntersectionObserver' in window) {
      // Root is the viewport because the entire document is the scroll container.
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) fillChunk(entry.target);
        }
      }, { root: null, rootMargin: '1400px 0px', threshold: 0 });
      for (const chunk of chunks) {
        if (chunk.dataset.loaded !== 'true') observer.observe(chunk);
      }
    } else {
      // Keep the fallback simple and complete for older browsers.
      for (const chunk of chunks) fillChunk(chunk);
    }
  }

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(container);
  } else {
    window.addEventListener('resize', refresh, { passive: true });
  }
  refresh();
  return { refresh };
}
