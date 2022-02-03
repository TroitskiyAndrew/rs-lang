import BaseComponent from '../base';
import { createSpan } from '../../utils';
import { Link } from '../../common.types';

export default class Menu extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'menu';
    this.extraClass = 'menu';
  }

  public createHTML(): void {
    const navigation: HTMLElement = document.createElement('nav');
    const listLisnks = document.createElement('ul');
    listLisnks.classList.add('menu__list');
    navigation.classList.add('menu__navigation');
    navigation.append(listLisnks);
    const links: Link[] = [
      { direction: 'pageHome', caption: 'Главная страница' },
      { direction: 'pageDictionary', caption: 'Словарь' },
      { direction: 'pageGames', caption: 'Игры' },
      { direction: 'pageStatistics', caption: 'Статистика' }];
    for (const link of links) {
      const newLink = document.createElement('li');
      newLink.classList.add('menu__link');
      newLink.dataset.direction = link.direction;
      newLink.append(createSpan({ className: 'menu__name', text: link.caption }));
      listLisnks.append(newLink);
    }
    this.fragment.append(navigation);
  }

}