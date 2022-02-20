import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';
import c3 from 'c3';

export default class PageStatistics extends BaseComponent {
  // statistic: Statistics;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageStatistics';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Статистика' }), this.name);
    c3.generate({
      bindto: '.testChart',
      data: {
        columns: [
          ['data1', 1, 2, 1, 2, 0],
          ['data2', 0, 2, 1, 2, 0],
        ],
      },
    });
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page statistics' });
    page.append(createDiv({ className: 'testChart' }));

    this.fragment.append(page);
  }
}