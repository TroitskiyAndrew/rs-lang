import BaseComponent from '../base';
import { createSpan, createDiv, createInput, createButton } from '../../utils';
import { apiService } from '../../api/apiMethods';
import { getState } from '../../state';
// import '../../api/testingApiMethods';

export default class User extends BaseComponent {
  modalWindow: HTMLDivElement | undefined;

  modalOverlay: HTMLDivElement | undefined;

  inputName: HTMLInputElement | undefined;

  inputMail: HTMLInputElement | undefined;

  inputPassword: HTMLInputElement | undefined;

  checkLabel: HTMLLabelElement | undefined;

  checkBox: HTMLInputElement | undefined;

  submitBtn: HTMLButtonElement | undefined;

  changeModalBtnL: HTMLButtonElement | undefined;

  changeModalBtnR: HTMLButtonElement | undefined;


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


    const modalTitleR = createSpan({
      text: 'Registration',
      className: 'modal-user__title registration',
    });
    const modalTitleL = createSpan({
      text: 'Log in',
      className: 'modal-user__title login',
    });
    this.inputName = createInput({
      className: 'modal-user__input registration',
      type: 'text',
      placeholder: 'Name*',
    });
    this.inputMail = createInput({
      className: 'modal-user__input',
      type: 'email',
      placeholder: 'Email*',
    });
    this.inputPassword = createInput({
      className: 'modal-user__input',
      type: 'password',
      placeholder: 'Password*',
    });
    this.checkLabel = document.createElement('label');
    this.checkLabel.classList.add('modal-user__label');
    this.checkLabel.textContent = 'Show password';
    this.checkBox = createInput({
      className: 'modal-user__checkbox',
      type: 'checkbox',
    });
    this.submitBtn = createButton({
      className: 'modal-user__submit',
      text: 'SIGN IN',
      action: 'submit-user',
    });

    this.changeModalBtnR = createButton({
      className: 'modal-user__change-modal registration',
      text: 'Do you have an account? Sign In',
      action: 'change-modal',
    });
    this.changeModalBtnL = createButton({
      className: 'modal-user__change-modal login',
      text: 'Don\'t have an account? Sign Up',
      action: 'change-modal',
    });


    this.modalWindow.append(modalTitleR);
    this.modalWindow.append(modalTitleL);
    this.modalWindow.append(this.inputName);
    this.modalWindow.append(this.inputMail);
    this.modalWindow.append(this.inputPassword);
    this.modalWindow.append(this.checkLabel);
    this.checkLabel.append(this.checkBox);
    this.modalWindow.append(this.submitBtn);
    this.modalWindow.append(this.changeModalBtnL);
    this.modalWindow.append(this.changeModalBtnR);


    document.body.append(this.modalOverlay);
    this.fragment.append(this.modalWindow);
    this.fragment.append(logoUser);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.logoUser') as HTMLElement).addEventListener('click', this.openModalWindow.bind(this));
    (this.modalOverlay as HTMLElement).addEventListener('click', this.closeModalWindow.bind(this));
    (this.changeModalBtnR as HTMLButtonElement).addEventListener('click', this.toggleRegisterModal.bind(this));
    (this.changeModalBtnL as HTMLButtonElement).addEventListener('click', this.toggleRegisterModal.bind(this));
    (this.checkBox as HTMLInputElement).addEventListener('change', this.togglePasswordView.bind(this));
    (this.submitBtn as HTMLInputElement).addEventListener('click', this.createOrSignInUser.bind(this));
  }

  async createOrSignInUser() {
    console.log('creating user....');

    const name = 'd';
    const email = 'dd@mail.com';
    const password = '11111111';
    const user = { name, email, password };
    await apiService.createUser(user);

    const userFromBase = await apiService.getUser(getState().userId);
    console.log('back answers....');
    console.log(userFromBase);

    // failed to connect
  }

  SignInUser() {

  }

  togglePasswordView() {
    if (this.checkBox && this.inputPassword) {
      if (this.checkBox.checked) {
        this.inputPassword.type = 'text';
      } else {
        this.inputPassword.type = 'password';
      }
    }
  }

  toggleRegisterModal() {
    const registrationElems = this.elem.querySelectorAll('.registration');
    const loginElems = this.elem.querySelectorAll('.login');
    registrationElems.forEach(el => el.classList.toggle('show'));
    loginElems.forEach(el => el.classList.toggle('show'));
  }

  openModalWindow() {
    this.modalWindow?.classList.add('show');
    this.modalOverlay?.classList.add('show');
  }

  closeModalWindow() {
    this.modalWindow?.classList.remove('show');
    this.modalOverlay?.classList.remove('show');
    (this.inputName as HTMLInputElement).value = '';
    (this.inputMail as HTMLInputElement).value = '';
    (this.inputPassword as HTMLInputElement).value = '';
    (this.inputPassword as HTMLInputElement).type = 'password';
    (this.checkBox as HTMLInputElement).checked = false;
  }

}
