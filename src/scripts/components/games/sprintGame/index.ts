import BaseComponent from '../../base';
import { createButton, createDiv, createSpan } from '../../../utils';
import { pageChenging } from '../../../rooting';
// import GameLauncher from '../gameLauncher';

interface IGameOptions {
  group: string;
  page?: string;
}
let options: IGameOptions;

export default class SprintGame extends BaseComponent {

  // groupsWrapper: HTMLElement | undefined;
  // groupsWrapperButton: HTMLButtonElement | undefined;
  group: string = '';
  page: string = '';
  
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
    const marioWrapper = createDiv({ className: 'mario-wrapper' });
    const gamepadWrapper = createDiv({ className: 'gamepad-wrapper'});
    const wordsWrapper = createDiv({ className: 'words-wrapper' });

    this.renderParams(paramsWrapper);
    this.renderMario(marioWrapper);
    this.renderGamepad(gamepadWrapper);
    this.renderWords(wordsWrapper);
    
    sprintWrapper.append(paramsWrapper);
    sprintWrapper.append(wordsWrapper);
    sprintWrapper.append(marioWrapper);
    sprintWrapper.append(gamepadWrapper);

    page.append(sprintWrapper);
    this.fragment.append(page);
  }

  private getCoin(size: string) {
    const coin = document.createElement('img');
    coin.className = `coin-img_${size}`
    coin.src = '/../../../../assets/img/sprintGame/gif/CoinSMW.gif';
    return coin;
  }

  private renderParams(paramsWrapper: HTMLDivElement) {
    const paramsLevelWrapper = createDiv({ className: 'params-wrapper__level' });
    const paramsMultiplyerWrapper = createDiv({ className: 'params-wrapper__multiplyer' });
    const paramsTime = createDiv({ className: 'params-wrapper__time' });
    const paramsCoinsWrapper = createDiv({ className: 'params-wrapper__coins-wrapper' });
    const paramsCoins = createDiv({ className: 'params-wrapper__coins' });
    const paramsScore = createDiv({ className: 'params-wrapper__score' });

    const star = document.createElement('img');
    star.className = 'group-img'
    star.src = '/../../../../assets/img/sprintGame/png/pixel_star_50px.png';
    
    const multiplyerItem = document.createElement('img');
    multiplyerItem.className = 'params-wrapper__multiplyer-item';
    multiplyerItem.src = '/../../../../assets/img/sprintGame/png/MushroomSMW.png';
    
    if (this.options) {
      options = JSON.parse (this.options);
      localStorage.setItem ('options', this.options);
    } 
    
    if (options) {
      this.group = options.group;
      if (options.page) this.page = options.page;
    } else {
      localStorage.getItem ('options') ? options = JSON.parse (localStorage.getItem ('options') as string) : options = {group: '0'};
      this.group = options.group;
      if (options.page) this.page = options.page;
    }

    console.log('group ' + this.group)

    paramsLevelWrapper.append(star);
    paramsLevelWrapper.innerHTML += `&#215;`;
    paramsLevelWrapper.append(this.group);

    paramsMultiplyerWrapper.append(multiplyerItem);

    paramsTime.innerHTML = `time<br> 60`;
    
    paramsCoins.append(this.getCoin('small'))
    paramsCoins.innerHTML += `&#215; ${'1'}`
    paramsScore.textContent = '0';
    paramsCoinsWrapper.append(paramsCoins);
    paramsCoinsWrapper.append(paramsScore);
    
    paramsWrapper.append(paramsLevelWrapper);
    paramsWrapper.append(paramsMultiplyerWrapper);
    paramsWrapper.append(paramsTime);
    paramsWrapper.append(paramsCoinsWrapper);
  }

  private renderMario(marioWrapper: HTMLDivElement) {
    const mario = document.createElement('img');
    mario.className = 'mario-img'
    mario.src = '/../../../../assets/img/sprintGame/gif/Mario_SMW.gif';

    marioWrapper.append(mario);
    marioWrapper.append(this.getCoin('medium'));
  }

  private renderGamepad(gamepadWrapper: HTMLDivElement) {
    const buttonsWrapper = createDiv({ className: 'buttons-wrapper' });
    const controlsWrapper = createDiv({ className: 'controls-wrapper' });

    const buttonBWrapper = createDiv({ className: 'buttons-wrapper__button-wrapper' });
    const buttonBBack = createDiv({ className: 'buttons-wrapper__back' });
    const buttonBCapture = createDiv({ className: 'buttons-wrapper__capture' });
    const buttonB = createButton({className: 'buttons-wrapper__button'})

    const buttonAWrapper = createDiv({ className: 'buttons-wrapper__button-wrapper' });
    const buttonABack = createDiv({ className: 'buttons-wrapper__back' });
    const buttonACapture = createDiv({ className: 'buttons-wrapper__capture' });
    const buttonA = createButton({className: 'buttons-wrapper__button'})

    const controlsBack = createDiv({ className: 'controls-wrapper__back' });
    const controlsCapture = createDiv({ className: 'controls-wrapper__capture' });
    const controlSelect = createButton({ className: 'controls-wrapper__select' });
    const controlStart = createButton({ className: 'controls-wrapper__start' }); 

    controlsWrapper.append(controlsCapture);
    controlsCapture.innerHTML = 'select&nbsp;&nbsp;&nbsp;&nbsp;start';
    controlsWrapper.append(controlsBack);
    controlsBack.append(controlSelect);
    controlsBack.append(controlStart);

    controlsWrapper.append(buttonsWrapper);
    
    buttonsWrapper.append(buttonBWrapper);
    buttonBWrapper.append(buttonBBack);
    buttonBWrapper.append(buttonBCapture);
    buttonBCapture.textContent = 'B';
    buttonBBack.append(buttonB);

    buttonsWrapper.append(buttonAWrapper);
    buttonAWrapper.append(buttonABack);
    buttonAWrapper.append(buttonACapture);
    buttonACapture.textContent = 'A';
    buttonABack.append(buttonA);

    gamepadWrapper.append(controlsWrapper);
    gamepadWrapper.append(buttonsWrapper);
  }

  private renderWords(wordsWrapper: HTMLDivElement) {
    const engWord = createDiv({ className: 'eng-word' });
    const translatedWord = createDiv({ className: 'translated-word' });

    engWord.textContent = 'word';
    translatedWord.textContent = 'слово';
    wordsWrapper.append(engWord);
    wordsWrapper.append(translatedWord);
  }


}



  // const multiplyerBorderImg = document.createElement('img');
  // multiplyerBorderImg.className = 'params-wrapper__multiplyer-border';
  // multiplyerBorderImg.src = '/../../../../assets/img/sprintGame/png/ItemStock-cut.png';

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

  // private definePageAndGroup(): void {
  //   const options = this.options ? JSON.parse(this.options) : {};
  //   this.page = getRandom(constants.minWordsPage, constants.maxWordsPage);

  //   if (options.page) {
  //     this.page = options.page;
  //   }
  //   this.group = getRandom(constants.minWordsGroup, constants.maxWordsGroup);
  //   if (options.group) {
  //     this.group = +options.group;
  //   }

  //   console.log('options', options);
  //   console.log('this.page', this.page);
  //   console.log('this.group', this.group);
  // }


    // const multiplyerItem = new Image;
  // multiplyerItem.src = '/../../../../assets/img/sprintGame/png/MushroomSMW.png';
  // multiplyerItem.className = 'params-wrapper__multiplyer-item'
  // multiplyerItem.onload = () => {
  //   paramsMultiplyerWrapper.append(multiplyerItem);
  // }
  // // TEST