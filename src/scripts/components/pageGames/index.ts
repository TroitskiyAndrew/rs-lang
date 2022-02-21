import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';

export default class PageGames extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageGames';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Игры' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page games' });
    const pageContainer = createDiv({ className: 'games__container' });
    const gameAudio = createDiv({
      className: 'games__link common-button', dataSet: {
        direction: 'gameLauncher',
        options: 'audio-game',
      },
    });
    const gameSprint = createDiv({
      className: 'games__link common-button', dataSet: {
        direction: 'gameLauncher',
        options: 'sprint-game',
      },
    });

    gameAudio.append(createSpan({ text: 'Игра Аудио' }));
    gameSprint.append(createSpan({ text: 'Игра Спринт' }));
    pageContainer.append(gameAudio);
    pageContainer.append(gameSprint);

    page.append(pageContainer);
    this.fragment.append(page);
  }
}
