import BaseComponent from '../../base';
import { createDiv, createSpan, createButton } from '../../../utils';
import { pageChenging } from '../../../rooting';

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
    const gameAudio = createDiv({ className: 'games__link', dataSet: { direction: 'audioGame' } });
    const backBtn = createDiv({ className: 'games__link', dataSet: { direction: 'pageGames' } });


    gameAudio.append(createSpan({ text: 'Игра Аудио' }));
    backBtn.append(createSpan({ text: 'back' }));

    page.append(gameAudio);
    page.append(backBtn);
    this.fragment.append(page);
  }
}
