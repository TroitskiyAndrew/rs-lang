import BaseComponent from '../base';
import { createDiv } from '../../utils';

export default class Header extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'header';
  }

  public createHTML(): void {
  }

}