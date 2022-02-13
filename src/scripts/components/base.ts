
import { initChildren } from '../rooting';
import { createDiv, getRandom } from '../utils';
import constants from '../app.constants';
import { instances } from './components';

export default class BaseComponent {
  public name: string;

  private position: string;

  public elem: HTMLElement;

  public extraClass: string;

  public fragment: DocumentFragment;

  public actions: {
    [name: string]: (ev?: Event) => void,
  };

  private isDisposed: boolean;

  public id: string;

  public options = '';

  public audioPlayer = new Audio();

  constructor(elem: HTMLElement) {
    this.name = '';
    this.position = '';
    this.elem = elem;
    this.extraClass = '';
    this.fragment = new DocumentFragment;
    this.actions = {};
    this.isDisposed = false;
    this.id = String(getRandom(0, constants.widgetIdMax));
    this.elem.dataset.widgetId = this.id;
    instances[this.id] = this;

  }

  public init(): void {
    this.elem.innerHTML = '';
    this.elem.dataset.inited = 'true';
    this.addLoading();
    this.setActions();
    this.createHTML();
    this.pasteHTML();
    const initialization = this.oninit();

    initialization.then(() => {
      this.listenEvents();
      this.removeLoading();
      initChildren(this.elem);
    });

  }

  public createHTML(): void {
  }

  public addLoading(): void {
    const loading = createDiv({ className: 'loading' });

    this.position = this.elem.style.position;
    this.elem.style.position = 'relative';
    loading.innerHTML = '<i class="loading__spinner fas fa-spinner fa-spin"></i>Загрузка...';
    this.elem.prepend(loading);
  }

  private pasteHTML(): void {
    if (this.extraClass) {
      this.elem.classList.add(this.extraClass);
    }
    this.elem.append(this.fragment);
  }

  public removeLoading(): void {
    this.elem.style.position = this.position;
    const loading = this.elem.querySelector('.loading') as HTMLElement;
    loading.remove();
  }

  public oninit(): Promise<void> {
    return Promise.resolve();
  }

  public dispose(): void {
    this.isDisposed = true;
    delete instances[this.id];
    this.ondispose();
  }

  public ondispose(): void {

  }

  public disableLinks(): void {
    if (this.name) {
      const allLinks: NodeListOf<HTMLButtonElement> = document.querySelectorAll('[data-direction]');

      for (const link of allLinks) {
        link.disabled = link.dataset.direction === this.name ? true : false;
      }
    }
  }

  public listenEvents(): void {

  }

  public sendEvent(name: string): void {
    const event = new Event(name, { bubbles: true });
    this.elem.dispatchEvent(event);
  }

  public actionHandler(ev: Event): void {
    const target = ev.target as HTMLElement;

    const action = target.dataset.action;
    if (action && this.actions[action]) {
      this.actions[action].call(this, ev);
    }


  }

  public setActions(): void {

  }

  public remoteControle(): void {

  }

  public playAudio(src: string): void {
    this.audioPlayer.src = src;
    this.audioPlayer.currentTime = 0;
    this.audioPlayer.play();
  }

}