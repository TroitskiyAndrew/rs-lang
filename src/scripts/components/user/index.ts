import BaseComponent from '../base';
import { createSpan, createDiv } from '../../utils';
import '../../api/testingApiMethods';

export default class User extends BaseComponent {
  modalWindow: HTMLDivElement | undefined;

  modalOverlay: HTMLDivElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'user';
  }

  public createHTML(): void {
    const logoUser = createSpan({
      text: 'Юзер',
      className: 'logoUser',
    });
    this.modalWindow = createDiv({ className: 'modal-user' });
    this.modalOverlay = createDiv({ className: 'modal-overlay' });


    document.body.append(this.modalOverlay);
    this.fragment.append(this.modalWindow);
    this.fragment.append(logoUser);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.logoUser') as HTMLElement).addEventListener('click', this.openModalWindow.bind(this));
    (this.modalOverlay as HTMLElement).addEventListener('click', this.closeModalWindow.bind(this));

  }

  openModalWindow() {
    this.modalWindow?.classList.add('show');
    this.modalOverlay?.classList.add('show');
  }

  closeModalWindow() {
    this.modalWindow?.classList.remove('show');
    this.modalOverlay?.classList.remove('show');
  }

}
