import BaseComponent from '../base';
import { createDiv } from '../../utils';

export default class PageDictionary extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageDictionary';
  }

  public createHTML(): void {
  }
}