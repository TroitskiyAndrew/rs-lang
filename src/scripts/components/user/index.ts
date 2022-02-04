import BaseComponent from '../base';
import { createSpan } from '../../utils';

export default class User extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'user';
  }

  public createHTML(): void {
    this.fragment.append(createSpan({ text: 'Юзер' }));
  }

}