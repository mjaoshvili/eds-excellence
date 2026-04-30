import { createOptimizedPicture, decorateIcons } from '../../scripts/aem.js';

/**
 * First column is an image when it contains only a picture.
 * First column is an icon when it holds only span.icon (or one <p> wrapping span.icon).
 * @param {HTMLElement} div Block column cell
 * @returns {'image' | 'icon' | null}
 */
function getVisualColumnKind(div) {
  if (div.children.length !== 1) return null;
  const only = div.firstElementChild;
  if (only.matches('picture')) return 'image';
  if (only.matches('span.icon')) return 'icon';
  if (only.tagName === 'P' && only.childElementCount === 1 && only.firstElementChild.matches('span.icon')) {
    return 'icon';
  }
  return null;
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      const kind = getVisualColumnKind(div);
      if (kind === 'image') div.className = 'cards-card-image';
      else if (kind === 'icon') div.className = 'cards-card-icon';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  decorateIcons(ul);
  block.replaceChildren(ul);
}
