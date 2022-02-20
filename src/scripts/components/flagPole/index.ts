
import { createDiv, createInput } from '../../utils';
import constants from '../../app.constants';
import BaseComponent from '../base';
import { getState } from '../../state';

export default class FlagPole extends BaseComponent {

  value = '';

  groupsCount = 0;

  flagPole: HTMLInputElement = createInput({
    className: 'flagPole',
    type: 'range',
  });

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'flagPole';
  }

  public oninit(): Promise<void> {
    if (this.elem.dataset.fromDictionary) {
      this.flagPole.value = String(getState().dictionaryGroup);
      this.moveFlag();
    }

    return Promise.resolve();
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
    const state = getState();
    this.groupsCount = constants.maxWordsGroup + ((this.elem.dataset.fromDictionary && state.userId) ? 2 : 0);

    this.flagPole.min = constants.minWordsGroup.toString();
    this.flagPole.max = String(this.groupsCount);
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
    const flagSection = flagWorkHeight / this.groupsCount;

    for (let i = 0; i <= this.groupsCount; i++) {
      if (numberValue === i) {
        let text = '';
        if (numberValue <= constants.maxWordsGroup) {
          text = String(numberValue + 1);
        } else if (numberValue == constants.maxWordsGroup + 1) {
          text = 'С';
        } else {
          text = 'В';
        }
        number.textContent = text;
        number.style.bottom = basicBottomPosition + flagSection * (i) + 'px';
      }
    }

  }

  valueSelected() {
    this.sendEvent('change-flag');
  }

}
