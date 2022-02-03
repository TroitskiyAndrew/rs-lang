import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';


export default class PageDictionary extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageDictionary';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Словарь' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page dictionary' });
    page.append(createSpan({ text: 'Словарь' }));

    this.fragment.append(page);
  }
}