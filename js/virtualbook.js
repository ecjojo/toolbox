// Kept under the existing module name for compatibility with both books.
// Each panel is built once. CSS handles resizing; scrolling never mutates it.
const controllers = new WeakMap();

export function createVirtualBook({ panel, container, groups, itemKey, mode }) {
  const existing = controllers.get(container);
  if (existing) return existing;

  const itemClass = mode === 'emoji' ? 'emoji' : 'symbol';
  let initialized = false;

  function refresh() {
    if (initialized || panel.hidden) return;
    const fragment = document.createDocumentFragment();

    for (const group of groups) {
      const section = document.createElement('div');
      section.className = 'persistent-book-section';
      const heading = document.createElement('div');
      heading.className = 'persistent-book-heading ' +
        (mode === 'emoji' ? 'emoji-category' : 'symbol-category');
      heading.textContent = group.category;
      const grid = document.createElement('div');
      grid.className = 'persistent-book-grid';

      for (const value of group[itemKey]) {
        if (!value) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = itemClass;
        button.dataset[itemClass] = value;
        button.textContent = value;
        if (mode === 'symbol' && Array.from(value).length > 2) {
          button.classList.add('book-cell-wide');
        }
        grid.appendChild(button);
      }
      section.append(heading, grid);
      fragment.appendChild(section);
    }

    container.classList.add('persistent-book');
    container.dataset.bookMode = mode;
    container.replaceChildren(fragment);
    initialized = true;
  }

  const controller = { refresh };
  controllers.set(container, controller);
  refresh();
  return controller;
}
