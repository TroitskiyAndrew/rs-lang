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
    const gameAudio = createDiv({ className: 'games__link', dataSet: { direction: 'gameLauncher' } });
    const gameSprint = createDiv({ className: 'games__link', dataSet: { direction: 'sprintGame' } });

    gameAudio.append(createSpan({ text: 'Игра Аудио' }));
    gameSprint.append(createSpan({ text: 'Игра Спринт' }));
    page.append(gameAudio);
    page.append(gameSprint);
    this.fragment.append(page);
  }
}
