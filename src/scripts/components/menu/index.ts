import BaseComponent from '../base';
import { createDiv } from '../../utils';

export default class Menu extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'menu';
  }

  public createHTML(): void {
  }

}