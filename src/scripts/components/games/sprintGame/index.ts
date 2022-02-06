import BaseComponent from '../../base';
import { createButton, createDiv, createSpan } from '../../../utils';
import { pageChenging } from '../../../rooting';

export default class SprintGame extends BaseComponent {

  // groupsWrapper: HTMLElement | undefined;
  // groupsWrapperButton: HTMLButtonElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'sprintGame';
  }

  public oninit(): Promise<void> {
    this.setActions();
    pageChenging(createSpan({ text: 'Спринт Игра' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page sprint' });
    const sprintWrapper = createDiv({ className: 'sprint-wrapper' });

    const paramsWrapper = createDiv({ className: 'params-wrapper' });
    const paramsLevelWrapper = createDiv({ className: 'params-wrapper__level' });
    const paramsMultiplyerWrapper = createDiv({ className: 'params-wrapper__multiplyer' });
    const paramsTimeWrapper = createDiv({ className: 'params-wrapper__time' });

    const marioWrapper = createDiv({ className: 'mario-wrapper' });
    const marioGifWrapper = createDiv({ className: 'mario-wrapper__gif' });
    
    const wordsWrapper = createDiv({ className: 'words-wrapper' });
    const buttonsWrapper = createDiv({ className: 'buttons-wrapper' });

    const star = document.createElement('img');
    star.src = '/../../../../assets/img/sprintGame/png/pixel_star_50px.png';
    console.log(star)

    paramsLevelWrapper.append(star);
    paramsWrapper.append(paramsLevelWrapper);
    sprintWrapper.append(paramsWrapper);

    page.append(sprintWrapper);
    this.fragment.append(page);
    


    // const groupsWrapperText = createDiv({ className: 'sprint__groups-wrapper_text' });
    // const groupsWrapperButtons = createDiv({ className: 'sprint__groups-wrapper_buttons' });
    
    // groupsWrapperText.innerHTML =  `
    // <h3>Спринт</h3>
    // <p class = "sprint__groups-wrapper_paragraph">Тренирует навык быстрого перевода с английского языка на русский. 
    // Вам нужно выбрать соответствует ли перевод предложенному слову.</p>
    // `;

    // for (let i=0; i < 6; i++) {
    //   this.groupsWrapperButton = createButton({ text: `${i + 1}`, className: `group-${i}`, action: 'showSprintGame'});
    //   groupsWrapperButtons.append(this.groupsWrapperButton);
    // }
    
    // this.groupsWrapper.append(groupsWrapperText);
    // this.groupsWrapper.append(groupsWrapperButtons);

    // page.append(this.groupsWrapper);
    // this.fragment.append(page);
  }

  // public listenEvents(): void {
  //   this.groupsWrapper!.addEventListener('click', this.actionHandler.bind(this));
  // }

  // public setActions(): void {
  //   this.actions.showSprintGame = this.showSprintGame;
  // }

  // public showSprintGame(): void {
  //   console.log(this.groupsWrapperButton?.className.slice(-1))
  //   //this.groupsWrapper!.style.display = 'none';
  // }
}