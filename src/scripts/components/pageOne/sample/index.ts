import BaseComponent from '../../base';
import { createButton, createDiv, createSpan } from '../../../utils';

export default class Sample extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'sample';
  }

  public createHTML(): void {
    const button = createButton({ className: 'component__button', action: 'testAction', text: 'Кнопка' });
    this.fragment.append(button);
  }

  public oninit(): Promise<void> {
    const button = this.elem.querySelector('.component__button') as HTMLButtonElement;
    button.textContent = 'Поменяли подпись';

    return Promise.resolve();
  }

  public listenEvents(): void {
    this.elem.addEventListener('click', this.actionHandler.bind(this));
  }

  public setActions(): void {
    this.actions.testAction = this.testActionHndler;
  }

  public testActionHndler(): void {
    this.sendEvent('testEvent');
  }

  public remoteControle(): void {
    const newDiv = createDiv({ className: 'component__new-div' });
    const newSpan = createSpan({ className: 'component__new-span', text: 'new span' });

    newDiv.append(newSpan);
    this.elem.append(newDiv);
  }

}
