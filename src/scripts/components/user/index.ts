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

  registrationBtn: HTMLButtonElement | undefined;

  loginBtn: HTMLButtonElement | undefined;

  changeModalBtnL: HTMLButtonElement | undefined;

  changeModalBtnR: HTMLButtonElement | undefined;


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'user';
  }

  public createHTML(): void {
    this.logoUser = createDiv({
      className: 'logoUser',
    });
    this.logoUser.innerHTML = '<i class="fas fa-user logo-user"></i>';
    if (getState().userEmail) {
      this.disableLogo();
    }
    this.modalWindow = createDiv({ className: 'modal-user' });
    this.modalOverlay = createDiv({ className: 'modal-overlay' });

    const lockLogo = document.createElement('i');
    lockLogo.classList.add('fas', 'fa-lock', 'modal-user__lock');
    const modalTitleR = createSpan({
      text: 'Registration',
      className: 'modal-user__title registration',
    });
    const modalTitleL = createSpan({
      text: 'Log in',
      className: 'modal-user__title login',
    });
    const formName = createDiv({
      className: 'modal-user__form form-name registration',
    });
    this.inputName = createInput({
      className: 'modal-user__input',
      type: 'text',
      placeholder: 'Name*',
    });
    const nameWarning = createSpan({
      text: 'Name is required field',
      className: 'modal-user__warning form-name__warning',
    });

    const formMail = createDiv({
      className: 'modal-user__form form-mail',
    });
    this.inputMail = createInput({
      className: 'modal-user__input',
      type: 'email',
      placeholder: 'Email*',
    });
    const mailWarning = createSpan({
      text: 'Email should have correct format',
      className: 'modal-user__warning form-mail__warning',
    });

    const formPassword = createDiv({
      className: 'modal-user__form form-password',
    });
    this.inputPassword = createInput({
      className: 'modal-user__input',
      type: 'password',
      placeholder: 'Password*',
    });
    const passwordWarning = createSpan({
      text: 'Password is too short - should be 8 chars minimum',
      className: 'modal-user__warning form-password__warning',
    });
    const togglePasswordBtn = document.createElement('i');
    togglePasswordBtn.classList.add('far', 'fa-eye');
    togglePasswordBtn.id = 'togglePassword';

    this.registrationBtn = createButton({
      className: 'modal-user__submit registration',
      text: 'REGISTRATION',
      action: 'registrate-user',
    });
    this.loginBtn = createButton({
      className: 'modal-user__submit login',
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

    this.modalWindow.append(lockLogo);
    this.modalWindow.append(modalTitleR);
    this.modalWindow.append(modalTitleL);
    this.modalWindow.append(formName);
    formName.append(this.inputName);
    formName.append(nameWarning);
    this.modalWindow.append(formMail);
    formMail.append(this.inputMail);
    formMail.append(mailWarning);
    this.modalWindow.append(formPassword);
    formPassword.append(this.inputPassword);
    formPassword.append(passwordWarning);
    formPassword.append(togglePasswordBtn);

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
    (this.elem.querySelector('#togglePassword') as HTMLElement).addEventListener('click', this.togglePasswordView.bind(this));

    (this.registrationBtn as HTMLInputElement).addEventListener('click', this.registrateAndLoginUser.bind(this));
    (this.loginBtn as HTMLInputElement).addEventListener('click', this.loginUser.bind(this));
  }

  async registrateAndLoginUser(): Promise<void> {
    if (this.verifyUser(true)) {
      const email = this.verifyUser()?.email as string;
      const password = this.verifyUser()?.password as string;
      const name = this.verifyUser()?.name as string;
      try {
        await apiService.createUser({ name, email, password });
      } catch (error) {
        console.log('such User exists!!!!');
        return;
      }
      this.loginUser();
    }
  }

  verifyUser(isRegistration = false): {
    email: string;
    password: string;
    name?: string;
  } | undefined {
    const email = (this.inputMail as HTMLInputElement).value;
    const password = (this.inputPassword as HTMLInputElement).value.trim();
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    const minPasswordLength = 8;
    let isValid = true;

    const name = (this.inputName as HTMLInputElement).value.trim();
    if (isRegistration) {
      if (!name.length) {
        // todo
        console.log('Name is required field ЛОГИН');
        isValid = false;
      }
    }

    if (reg.test(email) === false) {
      // todo

      console.log('Email should have correct format');
      isValid = false;
    }
    if (password.length < minPasswordLength) {
      // todo

      console.log('Password is too short - should be 8 chars minimum.');
      isValid = false;
    }
    if (isValid) {
      return { email, password, name };
    }
  }

  async loginUser(): Promise<void> {
    if (this.verifyUser()) {
      const email = this.verifyUser()?.email as string;
      const password = this.verifyUser()?.password as string;

      try {
        await apiService.loginUser({ email, password });
        updateState({
          userEmail: email,
          userPassword: password,
        });

        this.closeModalWindow();
        this.disableLogo();
      } catch (error) {
        // todo

        console.log('Incorrect e-mail or password!');
        return;
      }
    }
  }

  disableLogo(): void {
    if (this.logoUser) {
      this.logoUser.innerHTML = '';
      const userName = createSpan({
        className: 'modal-user__userName',
        text: getState().userName,
      });
      this.logoUser.style.pointerEvents = 'none';
      this.logoUser.append(userName);

      const logOutBtn = createButton({
        className: 'modal-user__logoutBtn icon-button',
      });

      this.elem.prepend(logOutBtn);
      logOutBtn.onclick = () => {
        localStorage.clear();
        location.reload();
      };

    }
  }

  togglePasswordView(e: Event): void {
    if (this.inputPassword) {
      const type = this.inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      this.inputPassword.setAttribute('type', type);
      (e.target as HTMLElement).classList.toggle('fa-eye-slash');
    }
  }

  toggleRegisterModal(): void {
    const registrationElems = this.elem.querySelectorAll('.registration');
    const loginElems = this.elem.querySelectorAll('.login');
    registrationElems.forEach(el => el.classList.toggle('show'));
    loginElems.forEach(el => el.classList.toggle('show'));
  }

  openModalWindow(): void {
    this.modalWindow?.classList.add('show');
    this.modalOverlay?.classList.add('show');
  }

  closeModalWindow(): void {
    this.modalWindow?.classList.remove('show');
    this.modalOverlay?.classList.remove('show');
    (this.inputName as HTMLInputElement).value = '';
    (this.inputMail as HTMLInputElement).value = '';
    (this.inputPassword as HTMLInputElement).value = '';
    (this.inputPassword as HTMLInputElement).type = 'password';
    (this.elem.querySelector('#togglePassword') as HTMLElement).classList.remove('fa-eye-slash');
  }

}
