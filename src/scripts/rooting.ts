import { components, instances } from './components/components';




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

export function updateContent(elem: HTMLElement, name: string): void {
  if (components[name] === undefined) {
    return;
  }
  disposeElem(elem);

  const x = new components[name](elem);

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