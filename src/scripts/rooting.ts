import { components, instances } from './components/components';
import { updateState } from './state';




export function disposeElem(elem: HTMLElement): void {
  const elems: NodeListOf<HTMLElement> = elem.querySelectorAll('[data-instance]');

  for (const child of elems) {
    const widget = instances[child.dataset.widgetId as string];

    widget.dispose();
  }
  if (elem.dataset.widgetId) {
    instances[elem.dataset.widgetId as string].dispose();
  }
}

export function updateContent(elem: HTMLElement, name: string, options?: string): void {
  if (components[name] === undefined) {
    return;
  }
  disposeElem(elem);

  const x = new components[name](elem);

  if (options) {
    x.options = options;
  }
  x.init();
}


export function initChildren(elem: HTMLElement): void {
  const children: NodeListOf<HTMLElement> = elem.querySelectorAll('[data-widget]');

  for (const child of children) {
    if (child.dataset.inited) {
      continue;
    }
    updateContent(child, child.getAttribute('data-widget') as string);
  }
}

export function pageChenging(elem: HTMLElement, page: string): void {
  const container = document.querySelector('.header__page') as HTMLElement;

  updateState({ currentPage: page });
  container.innerHTML = '';
  container.append(elem);
}