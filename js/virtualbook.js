// Stable native page scrolling. DOM is created once per viewport width,
// and offscreen chunks are skipped by the browser using content-visibility.
// No scroll listeners, intersection callbacks or incremental blank sections.
export function createVirtualBook({ panel, container, groups, itemKey, mode }) {
  const ROW_HEIGHT = 40;
  const GAP = 6;
  const MIN_CELL = mode === 'emoji' ? 40 : 48;
  const CHUNK_ROWS = 12;
  const ITEM_CLASS = mode === 'emoji' ? 'emoji' : 'symbol';
  const DATA_KEY = mode === 'emoji' ? 'emoji' : 'symbol';
  let columns = 0;

  container.classList.add('virtual-book');

  function createRow(row) {
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
      if (cell.span > 1) item.style.gridColumn = 'span ' + cell.span;
      line.appendChild(item);
    }
    return line;
  }

  function calculateRows(count) {
    const rows = [];
    for (const group of groups) {
      rows.push({ heading: group.category });
      let cells = [];
      let used = 0;
      for (const value of group[itemKey]) {
        if (!value) continue;
        const span = mode === 'symbol' && Array.from(value).length > 2
          ? Math.min(count, 2) : 1;
        if (used + span > count) {
          rows.push({ cells });
          cells = [];
          used = 0;
        }
        cells.push({ value, span });
        used += span;
      }
      if (cells.length) rows.push({ cells });
    }
    return rows;
  }

  function refresh() {
    if (panel.hidden) return;
    const width = container.clientWidth;
    if (!width) return;
    const nextColumns = Math.max(1, Math.floor((width + GAP) / (MIN_CELL + GAP)));
    if (nextColumns === columns) return;
    columns = nextColumns;
    container.style.setProperty('--book-cols', String(columns));

    const rows = calculateRows(columns);
    const fragment = document.createDocumentFragment();
    for (let start = 0; start < rows.length; start += CHUNK_ROWS) {
      const end = Math.min(start + CHUNK_ROWS, rows.length);
      const chunk = document.createElement('div');
      chunk.className = 'virtual-book-chunk';
      // Exact height prevents layout shifts when offscreen content is skipped.
      chunk.style.height = ((end - start) * ROW_HEIGHT) + 'px';
      const rowFragment = document.createDocumentFragment();
      for (let i = start; i < end; i++) rowFragment.appendChild(createRow(rows[i]));
      chunk.appendChild(rowFragment);
      fragment.appendChild(chunk);
    }
    container.replaceChildren(fragment);
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
