import BaseComponent from '../../base';
import { createDiv } from '../../../utils';

export default class WordCard extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'wordCard';
  }

  public createHTML(): void {
  }
}