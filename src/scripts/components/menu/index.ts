import BaseComponent from '../base';
import { createSpan, createDiv, createButton } from '../../utils';
import { Link } from '../../common.types';
import { getState } from '../../state';

export default class Menu extends BaseComponent {
  modal: HTMLElement | undefined;

  overlay: HTMLElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'menu';
    this.extraClass = 'menu';
  }

  public createHTML(): void {
    const listLinks = document.createElement('ul');
    const menuButton = createButton({ className: 'menu__button icon-button', action: 'showMenu' });
    listLinks.classList.add('menu__list');
    const menuTitle = createSpan({ className: 'menu__title', text: 'меню' });
    this.modal = createDiv({ className: 'menu__modal' });
    this.overlay = createDiv({ className: 'menu__overlay' });

    this.modal.append(menuTitle);
    this.modal.append(listLinks);


    const links: Link[] = [
      { direction: 'pageHome', caption: 'Главная страница' },
      { direction: 'pageDictionary', caption: 'Словарь' },
      { direction: 'pageGames', caption: 'Игры' },
      { direction: 'pageStatistics', caption: 'Статистика' }];
    for (const link of links) {
      const newLink = document.createElement('li');
      newLink.classList.add('menu__link');
      newLink.dataset.direction = link.direction;

      const headerTitle = document.querySelector('.header__page span');
      if (headerTitle && headerTitle.textContent === link.caption) {
        newLink.classList.add('active');
      }

      newLink.addEventListener('click', () => {
        const linksElements = document.querySelectorAll('.menu__link') as NodeListOf<Element>;
        linksElements.forEach(linkEl => linkEl.classList.remove('active'));
        newLink.classList.add('active');
      });

      newLink.append(createSpan({ className: 'menu__name', text: link.caption }));
      listLinks.append(newLink);
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
    const isAuthorized = !!getState().userId;
    const statisticLink = this.modal?.querySelector('[data-direction="pageStatistics"]') as HTMLElement;
    if (isAuthorized) {
      statisticLink.classList.remove('hidden');
    } else {
      statisticLink.classList.add('hidden');
    }
    this.overlay?.classList.add('show');
    this.modal?.classList.add('show');
  }

  public hideMenu(): void {
    this.overlay?.classList.remove('show');
    this.modal?.classList.remove('show');
  }
}
