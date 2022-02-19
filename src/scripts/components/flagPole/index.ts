
import { createDiv, createSpan, createButton, createInput } from '../../utils';
import constants from '../../app.constants';
import BaseComponent from '../base';

export default class FlagPole extends BaseComponent {

  value = '';

  flagPole: HTMLInputElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'flagPole';
  }

  public createHTML(): void {
    const flagZone = createDiv({
      className: 'flagPole-zone',
    });
    const flagZoneNumber = createDiv({
      className: 'flagPole-zone__number',
    });

    const flagPoleWrapper = createDiv({
      className: 'flagPole-wrapper',
    });
    this.flagPole = createInput({
      className: 'flagPole',
      type: 'range',
    });
    this.flagPole.min = constants.minWordsGroup.toString();
    this.flagPole.max = constants.maxWordsGroup.toString();
    this.flagPole.step = '1';
    this.flagPole.value = '0';

    flagZoneNumber.textContent = +this.flagPole.value + 1 + '';


    flagPoleWrapper.append(this.flagPole);
    flagZone.append(flagPoleWrapper);
    flagZone.append(flagZoneNumber);
    this.fragment.append(flagZone);
  }

  public listenEvents(): void {
    (this.flagPole as HTMLInputElement).addEventListener('input', this.moveFlag.bind(this));
    (this.flagPole as HTMLInputElement).addEventListener('change', this.valueSelected.bind(this));
  }

  moveFlag() {
    const number = this.elem.querySelector('.flagPole-zone__number') as HTMLDivElement;
    const flagPole = this.flagPole as HTMLInputElement;
    const basicBottomPosition = 40;
    const numberValue = +flagPole.value;
    this.value = flagPole.value;

    const flagHeight = flagPole.offsetWidth;
    const flagDeadZone = 100;
    const flagWorkHeight = flagHeight - flagDeadZone;
    const flagSection = flagWorkHeight / constants.maxWordsGroup;

    for (let i = 0; i <= constants.maxWordsGroup; i++) {
      if (numberValue === i) {
        number.textContent = numberValue + 1 + '';
        number.style.bottom = basicBottomPosition + flagSection * (i) + 'px';
      }
    }

  }

  valueSelected() {
    this.sendEvent('change-flag');
  }

}
