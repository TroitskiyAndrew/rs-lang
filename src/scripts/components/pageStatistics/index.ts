import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';

export default class PageStatistics extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageStatistics';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Статистика' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page statistics' });
    page.append(createSpan({ text: 'Статистика' }));

    this.fragment.append(page);
  }
}