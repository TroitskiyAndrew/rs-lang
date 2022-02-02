import BaseComponent from '../../base';
import { createDiv, createInput, createButton, createSpan } from '../../../utils';

export default class WordCard extends BaseComponent {
  input: HTMLInputElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'wordCard';
    this.extraClass = 'card-item';
  }

  public createHTML(): void {
    const word = this.elem.dataset.word as string;
    const span = createSpan({ className: 'word', text: word });
    this.fragment.append(span);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.word') as HTMLElement).addEventListener('click', () => {
      this.sendEvent('spanAffected');
    });
  }

}