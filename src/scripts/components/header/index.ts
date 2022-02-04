import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';

export default class Header extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'header';
    this.extraClass = 'header';
  }

  public createHTML(): void {
    const menu = createDiv({ className: 'header__menu', dataSet: { widget: 'menu' } });
    const pageInfo = createDiv({ className: 'header__page' });
    const userInfo = createDiv({ className: 'header__user', dataSet: { widget: 'user' } });

    pageInfo.append(createSpan({ text: 'Текущая страница' }));

    this.fragment.append(menu);
    this.fragment.append(pageInfo);
    this.fragment.append(userInfo);
  }

}