import BaseComponent from '../base';
import { createDiv } from '../../utils';

export default class PageStatistics extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageStatistics';
  }

  public createHTML(): void {
  }
}