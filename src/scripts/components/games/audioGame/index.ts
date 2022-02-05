import BaseComponent from '../../base';
import { pageChenging } from '../../../rooting';
import { createSpan, createDiv, createInput, createButton } from '../../../utils';
import { apiService } from '../../../api/apiMethods';
import { updateState, getState } from '../../../state';

export default class AudioGame extends BaseComponent {
  test: HTMLElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {

    this.test = createSpan({
      text: 'test span Audio game',
    });

    this.fragment.append(this.test);
  }
}
