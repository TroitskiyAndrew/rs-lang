import BaseComponent from '../../base';
import { createDiv, createSpan } from '../../../utils';
import { pageChenging } from '../../../rooting';

export default class SprintGame extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'sprintGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Спринт Игра' }), this.name);
    return Promise.resolve();
  }
}