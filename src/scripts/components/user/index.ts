import BaseComponent from '../base';
import { createSpan } from '../../utils';
import '../../api/testingApiMethods';

export default class User extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'user';
  }

  public createHTML(): void {
    const logoUser = createSpan({ text: 'Юзер' });

    logoUser.addEventListener('click', () => {
      console.log('clicked user');
    });
    this.fragment.append(logoUser);
  }

}
