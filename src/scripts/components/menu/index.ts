import BaseComponent from '../base';
import { createSpan, createDiv, createButton } from '../../utils';
import { Link } from '../../common.types';

export default class Menu extends BaseComponent {
  modal: HTMLElement | undefined;

  overlay: HTMLElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'menu';
    this.extraClass = 'menu';
  }

  public createHTML(): void {
    const listLisnks = document.createElement('ul');
    const menuButton = createButton({ className: 'menu__button icon-button', action: 'showMenu' });
    listLisnks.classList.add('menu__list');
    this.modal = createDiv({ className: 'menu__modal' });
    this.overlay = createDiv({ className: 'menu__overlay' });
    this.modal.append(listLisnks);

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
    document.body.append(this.overlay);
    document.body.append(this.modal);
    this.fragment.append(menuButton);
  }

  public listenEvents(): void {
    this.elem.addEventListener('click', this.actionHandler.bind(this));
    this.overlay?.addEventListener('click', this.hideMenu.bind(this));
  }

  public setActions(): void {
    this.actions.showMenu = this.showMenu;
  }

  public showMenu(): void {
    this.overlay?.classList.add('show');
    this.modal?.classList.add('show');
  }

  public hideMenu(): void {
    this.overlay?.classList.remove('show');
    this.modal?.classList.remove('show');
  }
}