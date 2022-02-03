import BaseComponent from '../../base';
import { createDiv, createSpan } from '../../../utils';
import { pageChenging } from '../../../rooting';

export default class AudioGame extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);
    return Promise.resolve();
  }
}