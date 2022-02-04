import BaseComponent from '../base';
import { createSpan, createDiv } from '../../utils';
// import '../../api/testingApiMethods';

export default class User extends BaseComponent {
  modalWindow: HTMLDivElement | undefined;

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




    this.fragment.append(this.modalWindow);
    this.fragment.append(logoUser);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.logoUser') as HTMLElement).addEventListener('click', this.openModalWindow.bind(this));
  }

  openModalWindow() {
    document.body.addEventListener('click', this.toggleModalWindow.bind(this));
  }

  toggleModalWindow(event: Event) {
    console.log(this.modalWindow);

    // const modalWindow = (document.querySelector('.modal-user') as HTMLElement);
    if ((event.target as Element).closest('.logoUser')) {
      if (this.modalWindow?.classList.contains('show')) {
        console.log('remove 1');

        this.modalWindow?.classList.remove('show');
      } else {
        console.log('show 1');

        this.modalWindow?.classList.add('show');
      }
    }

    if (!(event.target as Element).closest('.modal-user')) {
      if (!(event.target as Element).classList.contains('logoUser')) {
        console.log('remove 2');

        this.modalWindow?.classList.remove('show');
      }
    }
    document.body.removeEventListener('click', this.toggleModalWindow.bind(this));

  }

}
