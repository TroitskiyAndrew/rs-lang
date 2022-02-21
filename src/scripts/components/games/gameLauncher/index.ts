import BaseComponent from '../../base';
import { createDiv, createSpan } from '../../../utils';
import { pageChenging } from '../../../rooting';
import { instances } from '../../components';
import FlagPole from '../../flagPole';
import { getState, updateState } from '../../../state';
import { apiService } from '../../../api/apiMethods';
export default class GameLauncher extends BaseComponent {

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'gameLauncher';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'game Launch' }), this.name);

    updateState({ launchGame: this.options });

    // if user log in
    if (getState().userId) {
      this.checkAuthorization();
    }

    return Promise.resolve();
  }

  private async checkAuthorization() {
    await apiService.getUserStatistics(getState().userId);
  }

  public createHTML(): void {
    const page = createDiv({ className: 'launcher-games' });
    const pageContainer = createDiv({ className: 'launcher-games__container' });

    const pageNavigation = createDiv({
      className: 'launcher-games__navigation',
    });
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
    const textDescription = createDiv({
      className: 'game-description__text',
    });
    const textDescription1 = createSpan({});
    const textDescription2 = createSpan({});
    const textDescription3 = createSpan({});
    const textDescription4 = createSpan({});
    const textDescription5 = createSpan({});

    if (!this.options) {
      this.options = getState().launchGame;
    }

    if (this.options === 'audio-game') {
      titleDescription.textContent = '«Аудиовызов»';
      textDescription1.innerText = '«Аудиовызов» - это тренировка, которая улучшает восприятие речи на слух.';
      textDescription2.innerText = 'Используйте мышь, чтобы выбрать правильный вариант ответа.';
      textDescription3.innerText = 'Используйте цифровые клавиши от 1 до 4 для выбора ответа.';
      textDescription4.innerText = 'Используйте пробел для подсказки и перехода к следующему слову.';
      textDescription5.innerText = 'Для выбора уровня сложности подымите флаг)';

      const gameAudio = createDiv({
        className: 'launcher-games__link games__link common-button start-game',
        dataSet: {
          direction: 'audioGame',
        },
      });
      gameAudio.append(createSpan({ text: 'Начать игру' }));
      gameAudio.dataset.options = JSON.stringify({
        'group': '0',
      });
      pageNavigation.append(gameAudio);
    } else if (this.options === 'sprint-game') {
      titleDescription.textContent = '«Спринт»';
      textDescription1.innerText = '«Спринт» - Тренирует навык быстрого перевода с английского языка на русский. Вам нужно выбрать соответствует ли перевод предложенному слову.';
      textDescription2.innerText = 'Используйте мышь, чтобы выбрать правильный вариант ответа.';
      textDescription3.innerText = 'Используйте цифровые клавиши 1 или 2 для выбора ответа.';
      textDescription4.innerText = 'Для выбора уровня сложности подымите флаг)';

      const gameSprint = createDiv({
        className: 'launcher-games__link games__link common-button start-game',
        dataSet: {
          direction: 'sprintGame',
        },
      });
      gameSprint.append(createSpan({ text: 'Начать игру' }));
      gameSprint.dataset.options = JSON.stringify({
        'group': '0',
      });
      pageNavigation.append(gameSprint);
    }

    backBtn.append(createSpan({ text: 'Назад' }));
    pageNavigation.append(backBtn);

    description.append(titleDescription);
    textDescription.append(textDescription1);
    textDescription.append(textDescription2);
    textDescription.append(textDescription3);
    textDescription.append(textDescription4);
    textDescription.append(textDescription5);
    description.append(textDescription);
    description.append(pageNavigation);
    pageContainer.append(description);

    pageContainer.append(createDiv({
      className: 'launcher-games__flagPole',
      dataSet: { widget: 'flagPole' },
    }));

    page.append(pageContainer);
    this.fragment.append(page);
  }

  public listenEvents(): void {
    (this.elem.querySelector('.launcher-games') as HTMLDivElement).addEventListener('change-flag', this.groupChangeFromFlag.bind(this));
  }

  private groupChangeFromFlag(event: Event): void {
    const target = event.target as HTMLElement;
    const widgetId = target.dataset.widgetId as string;
    const widget = instances[widgetId] as FlagPole;

    const startGameBtn = this.elem.querySelector('.start-game') as HTMLDivElement;
    startGameBtn.dataset.options = JSON.stringify({
      'group': widget.value,
    });
  }
}
