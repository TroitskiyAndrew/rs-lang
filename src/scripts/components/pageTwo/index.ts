import BaseComponent from '../base';
import { createDiv } from '../../utils';

export default class PageTwo extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageTwo';
  }

  public createHTML(): void {
    const wrapper = createDiv({ className: 'page page_two' });
    this.fragment.append(wrapper);
  }

  public oninit(): Promise<void> {
    this.disableLinks();

    return Promise.resolve();
  }

}