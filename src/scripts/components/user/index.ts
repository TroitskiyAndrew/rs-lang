import BaseComponent from '../base';
import { createSpan, createDiv, createInput, createButton } from '../../utils';
import { apiService } from '../../api/apiMethods';
import { updateState, getState } from '../../state';
// import '../../api/testingApiMethods';

export default class User extends BaseComponent {
  logoUser: HTMLElement | undefined;

  modalWindow: HTMLDivElement | undefined;

  modalOverlay: HTMLDivElement | undefined;

  inputName: HTMLInputElement | undefined;

  inputMail: HTMLInputElement | undefined;

  inputPassword: HTMLInputElement | undefined;

  checkLabel: HTMLLabelElement | undefined;

  checkBox: HTMLInputElement | undefined;

  registrationBtn: HTMLButtonElement | undefined;

  loginBtn: HTMLButtonElement | undefined;

  changeModalBtnL: HTMLButtonElement | undefined;

  changeModalBtnR: HTMLButtonElement | undefined;


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'user';
  }

  public createHTML(): void {
    this.logoUser = createSpan({
      text: 'Юзер',
      className: 'logoUser',
    });
    if (getState().userEmail) {
      this.disableLogo();
    }
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
    this.registrationBtn = createButton({
      className: 'modal-user__submit-registration registration',
      text: 'REGISTRATION',
      action: 'registrate-user',
    });
    this.loginBtn = createButton({
      className: 'modal-user__submit-login login',
      text: 'SIGN IN',
      action: 'login-user',
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
    this.modalWindow.append(this.registrationBtn);
    this.modalWindow.append(this.loginBtn);
    this.modalWindow.append(this.changeModalBtnL);
    this.modalWindow.append(this.changeModalBtnR);


    document.body.append(this.modalOverlay);
    this.fragment.append(this.modalWindow);
    this.fragment.append(this.logoUser);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.logoUser') as HTMLElement).addEventListener('click', this.openModalWindow.bind(this));
    (this.modalOverlay as HTMLElement).addEventListener('click', this.closeModalWindow.bind(this));
    (this.changeModalBtnR as HTMLButtonElement).addEventListener('click', this.toggleRegisterModal.bind(this));
    (this.changeModalBtnL as HTMLButtonElement).addEventListener('click', this.toggleRegisterModal.bind(this));
    (this.checkBox as HTMLInputElement).addEventListener('change', this.togglePasswordView.bind(this));
    (this.registrationBtn as HTMLInputElement).addEventListener('click', this.registrateAndLoginUser.bind(this));
    (this.loginBtn as HTMLInputElement).addEventListener('click', this.loginUser.bind(this, undefined));
  }

  async registrateAndLoginUser() {
    let isValid = true;
    const name = (this.inputName as HTMLInputElement).value.trim();

    if (!name.length) {
      console.log('Name is required field');
      isValid = false;
    }

    if (isValid && this.verifyUser()) {
      const email = this.verifyUser()?.email as string;
      const password = this.verifyUser()?.password as string;

      try {
        await apiService.createUser({ name, email, password });
      } catch (error) {
        console.log('such User exists!!!!');
        return;
      }
      this.loginUser(name);
    }
  }

  verifyUser() {
    const email = (this.inputMail as HTMLInputElement).value;
    const password = (this.inputPassword as HTMLInputElement).value.trim();
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    const minPasswordLength = 8;
    let isValid = true;

    if (reg.test(email) === false) {
      console.log('Email should have correct format');
      isValid = false;
    }

    if (password.length < minPasswordLength) {
      console.log('Password is too short - should be 8 chars minimum.');
      isValid = false;
    }

    if (isValid) {
      return { email, password };
    }
  }

  async loginUser(name?: string) {
    if (this.verifyUser()) {
      const email = this.verifyUser()?.email as string;
      const password = this.verifyUser()?.password as string;

      try {
        await apiService.loginUser({ email, password });

        if (name) {
          updateState({
            userName: name,
            userEmail: email,
            userPassword: password,
          });
        } else {
          updateState({
            userEmail: email,
            userPassword: password,
          });
        }

        this.closeModalWindow();
        // todo change logoUser
        this.disableLogo();
      } catch (error) {
        console.log('Incorrect e-mail or password!!!!');
        return;
      }
    }
  }

  disableLogo() {
    console.log('changing logo');
    if (this.logoUser) {
      this.logoUser.textContent = getState().userName + ' ' + getState().userEmail;
      this.logoUser.style.pointerEvents = 'none';
    }
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
