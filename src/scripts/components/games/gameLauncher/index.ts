import BaseComponent from '../../base';
import { createDiv, createSpan, createButton, createInput } from '../../../utils';
import { pageChenging } from '../../../rooting';
import constants from '../../../app.constants';
import { instances } from '../../components';
import FlagPole from '../../flagPole';

export default class GameLauncher extends BaseComponent {

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
      gameAudio.dataset.options = JSON.stringify({
        'group': '0',
      });
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
      gameSprint.dataset.options = JSON.stringify({
        'group': '0',
      });
      page.append(gameSprint);
    }

    backBtn.append(createSpan({ text: 'back' }));
    page.append(backBtn);
    description.append(titleDescription);
    description.append(textDescription);
    page.append(description);

    page.append(createDiv({
      className: '',
      dataSet: { widget: 'flagPole' },
    }));
    this.fragment.append(page);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.launcher-games') as HTMLDivElement).addEventListener('change-flag', this.groupChangeFromFlag.bind(this));
  }

  private groupChangeFromFlag(event: Event) {
    const target = event.target as HTMLElement;
    const widgetId = target.dataset.widgetId as string;
    const widget = instances[widgetId] as FlagPole;

    const startGameBtn = this.elem.querySelector('.start-game') as HTMLDivElement;
    startGameBtn.dataset.options = JSON.stringify({
      'group': widget.value,
    });
  }
}
