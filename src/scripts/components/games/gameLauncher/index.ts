import BaseComponent from '../../base';
import { createDiv, createSpan, createButton, createInput } from '../../../utils';
import { pageChenging } from '../../../rooting';
import constants from '../../../app.constants';

export default class GameLauncher extends BaseComponent {

  flagPole: HTMLInputElement | undefined;


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'gameLauncher';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'game Launch' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'launcher-games' });
    const backBtn = createDiv({
      className: 'launcher-games__link games__link ',
      dataSet: {
        direction: 'pageGames',
      },
    });
    const description = createDiv({
      className: 'launcher-games__description game-description',
    });
    const titleDescription = createDiv({
      className: 'game-description__title',
    });
    const textDescription = createSpan({
      className: 'game-description__text',
    });


    const flagZone = createDiv({
      className: 'flagPole-zone',
    });
    const flagZoneNumbers = createDiv({
      className: 'flagPole-zone__numbers',
    });
    const flagPoleWrapper = createDiv({
      className: 'flagPole-wrapper',
    });
    this.flagPole = createInput({
      className: 'flagPole',
      type: 'range',
    });
    this.flagPole.min = '-1';
    this.flagPole.max = '5';
    this.flagPole.step = '1';
    this.flagPole.value = '-1';

    for (let i = 0; i <= constants.maxWordsGroup; i++) {
      const groupNumber = createDiv({
        className: `flagPole__number flagPole__number${i}`,
      });
      groupNumber.textContent = `${i + 1}`;
      flagZoneNumbers.append(groupNumber);
    }

    if (this.options === 'audio-game') {
      titleDescription.textContent = '«Аудиовызов»';
      textDescription.innerText = `«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.
      Используйте мышь, чтобы выбрать.
      Используйте цифровые клавиши от 1 до 4 для выбора ответа
      Используйте пробел для подсказки или для перехода к следующему слову.
      Для выбора уровня сложности подымите флаг)`;

      const gameAudio = createDiv({
        className: 'launcher-games__link games__link start-game',
        dataSet: {
          direction: 'audioGame',
        },
      });
      gameAudio.append(createSpan({ text: 'Начать игру Аудиовызов' }));
      page.append(gameAudio);
    } else if (this.options === 'sprint-game') {
      titleDescription.textContent = '«Спринт»';
      textDescription.innerText = `«Спринт» - Тренирует навык быстрого перевода с английского языка на русский. Вам нужно выбрать соответствует ли перевод предложенному слову.
      Используйте мышь, чтобы выбрать.
      Используйте цифровые клавиши 1 или 2 для выбора ответа.
      Для выбора уровня сложности подымите флаг)`;

      const gameSprint = createDiv({
        className: 'launcher-games__link games__link start-game',
        dataSet: {
          direction: 'sprintGame',
        },
      });
      gameSprint.append(createSpan({ text: 'Начать игру Спринт' }));
      page.append(gameSprint);
    }

    backBtn.append(createSpan({ text: 'back' }));
    page.append(backBtn);
    description.append(titleDescription);
    description.append(textDescription);
    page.append(description);
    flagPoleWrapper.append(this.flagPole);
    flagZone.append(flagPoleWrapper);
    flagZone.append(flagZoneNumbers);
    page.append(flagZone);
    this.fragment.append(page);
  }

  public listenEvents(): void {
    (this.flagPole as HTMLInputElement).addEventListener('input', this.groupChangeFromFlag.bind(this));
  }

  groupChangeFromFlag() {
    const numbers = this.elem.querySelectorAll('.flagPole__number');
    numbers.forEach(el => {
      const isSelected = el.classList.contains(`flagPole__number${this.flagPole?.value}`);
      if (isSelected) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const startGameBtn = this.elem.querySelector('.start-game') as HTMLDivElement;
    if (this.flagPole?.value !== '-1') {
      startGameBtn.classList.add('enable');
    } else {
      startGameBtn.classList.remove('enable');
    }
    startGameBtn.dataset.options = JSON.stringify({
      'group': this.flagPole?.value,
    });
  }
}
