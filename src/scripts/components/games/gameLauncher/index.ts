import BaseComponent from '../../base';
import { createDiv, createSpan, createButton, createInput } from '../../../utils';
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
    const backBtn = createDiv({ className: 'games__link', dataSet: { direction: 'pageGames' } });

    const flagPole = createInput({
      className: 'flagPole slider',
      type: 'range',

    });
    flagPole.min = '0';
    flagPole.max = '7';
    flagPole.step = '1';
    const showText = createSpan({ text: 'value from range' });

    flagPole.oninput = () => {
      showText.textContent = flagPole.value;
    };

    if (this.options === 'audio-game') {
      const gameAudio = createDiv({
        className: 'games__link',
        dataSet: {
          direction: 'audioGame',
        },
      });
      gameAudio.append(createSpan({ text: 'Игра Аудио' }));
      page.append(gameAudio);
    } else if (this.options === 'sprint-game') {
      const gameSprint = createDiv({
        className: 'games__link',
        dataSet: {
          direction: 'sprintGame',
        },
      });
      gameSprint.append(createSpan({ text: 'Игра Спринт' }));
      page.append(gameSprint);
    }


    backBtn.append(createSpan({ text: 'back' }));


    page.append(backBtn);
    page.append(flagPole);
    page.append(showText);
    this.fragment.append(page);
  }
}
