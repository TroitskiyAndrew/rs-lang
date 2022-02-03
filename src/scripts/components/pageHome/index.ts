import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';

export default class PageHome extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageHome';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Главная страница' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page home' });

    page.append(createSpan({ text: 'Содержание главной страницы' }));

    this.fragment.append(page);
  }

}