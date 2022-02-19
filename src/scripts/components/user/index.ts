import BaseComponent from '../base';
import { createSpan, createDiv, createInput, createButton } from '../../utils';
import { apiService } from '../../api/apiMethods';
import { updateState, getState } from '../../state';
import { updateContent } from '../../rooting';
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
    this.name = 'userRegister';
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
      text: 'Name must contains at least 3 chars',
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
      text: 'Password must contains at least 8 chars',
      className: 'modal-user__warning form-password__warning',
    });
    const togglePasswordBtn = document.createElement('i');
    togglePasswordBtn.classList.add('far', 'fa-eye');
    togglePasswordBtn.id = 'togglePassword';

    const userExistWarning = createSpan({
      text: 'Such user is already exists, sign in',
      className: 'modal-user__warning form-exist__warning',
    });
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

    this.modalWindow.append(userExistWarning);
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

    this.inputName?.addEventListener('input', this.isValidateName.bind(this));
    this.inputMail?.addEventListener('input', this.isValidateMail.bind(this));
    this.inputPassword?.addEventListener('input', this.isValidatePassword.bind(this));
  }

  async registrateAndLoginUser(): Promise<void> {
    if (this.verifyUser(true)) {
      const email = this.verifyUser()?.email as string;
      const password = this.verifyUser()?.password as string;
      const name = this.verifyUser()?.name as string;

      const createUser = await apiService.createUser({ name, email, password });
      // console.log('createUser', createUser);
      if (typeof (createUser) !== 'number') {
        this.loginUser();
      } else {
        const existWarning = this.elem.querySelector('.form-exist__warning') as HTMLElement;
        existWarning.textContent = 'Such user is already exists, sign in';
        existWarning.classList.add('active');
        // console.log('such User exists!!!!');
        return;
      }

    }
  }

  isValidateName(): boolean {
    const namLength = 3;
    const inputName = this.inputName as HTMLInputElement;
    const nameWarning = this.elem.querySelector('.form-name__warning') as HTMLElement;
    const name = inputName.value.trim();
    if (name.length < namLength) {
      inputName.classList.add('active');
      nameWarning.classList.add('active');
      // console.log('Name is required field ЛОГИН');
      return false;
    } else {
      inputName.classList.remove('active');
      nameWarning.classList.remove('active');
      return true;
    }
  }

  isValidateMail(): boolean {
    this.disableExistWarning();

    const inputMail = this.inputMail as HTMLInputElement;
    const email = inputMail.value;
    const reg = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    const mailWarning = this.elem.querySelector('.form-mail__warning') as HTMLElement;
    if (reg.test(email) === false) {
      inputMail.classList.add('active');
      mailWarning.classList.add('active');
      // console.log('Email should have correct format');
      return false;
    } else {
      inputMail.classList.remove('active');
      mailWarning.classList.remove('active');
      return true;
    }
  }

  isValidatePassword(): boolean {
    this.disableExistWarning();

    const inputPassword = this.inputPassword as HTMLInputElement;
    const password = inputPassword.value.trim();
    const minPasswordLength = 8;
    const passwordWarning = this.elem.querySelector('.form-password__warning') as HTMLElement;
    if (password.length < minPasswordLength) {
      // console.log('Password is too short - should be 8 chars minimum.');
      inputPassword.classList.add('active');
      passwordWarning.classList.add('active');
      return false;
    } else {
      inputPassword.classList.remove('active');
      passwordWarning.classList.remove('active');
      return true;
    }
  }

  verifyUser(isRegistration = false): {
    email: string;
    password: string;
    name?: string;
  } | undefined {
    const inputName = this.inputName as HTMLInputElement;
    const email = (this.inputMail as HTMLInputElement).value;
    const password = (this.inputPassword as HTMLInputElement).value.trim();
    let isValid = true;
    const name = inputName.value.trim();
    if (isRegistration) {
      isValid = this.isValidateName();
    }
    if (isValid && this.isValidateMail() && this.isValidatePassword()) {
      return { email, password, name };
    }
  }

  async loginUser(): Promise<void> {
    if (this.verifyUser()) {
      const email = this.verifyUser()?.email as string;
      const password = this.verifyUser()?.password as string;
      const loginStatus = await apiService.loginUser({ email, password });

      if (typeof (loginStatus) !== 'number') {
        updateState({
          userEmail: email,
          userPassword: password,
        });
        this.closeModalWindow();
        this.disableLogo();
        updateContent(document.querySelector('#page-holder') as HTMLElement, 'pageHome');
      } else {
        const existWarning = this.elem.querySelector('.form-exist__warning') as HTMLElement;
        existWarning.textContent = 'Incorrect e-mail or password!';
        existWarning.classList.add('active');
        console.log('Incorrect e-mail or password!');
        return;
      }

    }
  }

  disableExistWarning(): void {
    const existWarning = this.elem.querySelector('.form-exist__warning') as HTMLElement;
    existWarning.classList.remove('active');
  }

  disableLogo(): void {
    if (!this.logoUser) return;
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
    logOutBtn.onclick = User.logOutUser;
  }

  static logOutUser() {
    localStorage.clear();
    updateContent(document.querySelector('.header__user') as HTMLElement, 'user');
    updateContent(document.querySelector('#page-holder') as HTMLElement, 'pageHome');
    console.log('Exit User from REGISTRATION and clear local!!');
  }

  togglePasswordView(e: Event): void {
    if (!this.inputPassword) return;
    const type = this.inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    this.inputPassword.setAttribute('type', type);
    (e.target as HTMLElement).classList.toggle('fa-eye-slash');
  }

  toggleRegisterModal(): void {
    this.disableExistWarning();
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
