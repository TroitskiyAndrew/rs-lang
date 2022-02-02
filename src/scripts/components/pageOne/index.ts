import BaseComponent from '../base';
import { createDiv } from '../../utils';
import { instances } from '../components';

export default class PageOne extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageOne';
  }

  public createHTML(): void {
    const wrapper = createDiv({ className: 'page page_one' });
    const component = createDiv({ className: 'component', dataSet: { widget: 'sample' } });
    wrapper.append(component);
    this.fragment.append(wrapper);
  }

  public oninit(): Promise<void> {
    this.disableLinks();
    return Promise.resolve();
  }

  public listenEvents(): void {
    (this.elem.querySelector('.page') as HTMLElement).addEventListener('testEvent', (ev: Event) => {
      const target = ev.target as HTMLElement;
      const widget = instances[target.dataset.widgetId as string];
      widget.remoteControle();
    });
  }

}