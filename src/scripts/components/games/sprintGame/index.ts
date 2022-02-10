import BaseComponent from '../../base';
import { createButton, createDiv, createSpan, getRandom } from '../../../utils';
import { pageChenging } from '../../../rooting';
import { apiService } from '../../../api/apiMethods';
import { IGameOptions, IWordAndTranslation, IRoundResult, IScoreCounter } from './sprintGameTypes';
// import GameLauncher from '../gameLauncher';

const GROUP_WORDS_NUMBER = 600;
const MIN_SCORE_FOR_CORRECT_ANSWER = 10;
const MAX_SCORE_MULTIPLYER = 8;
const TIME_FOR_GAME_MILISECONDS = 60000;
const MAX_SCORE_MULTIPLYER_INTERMEDIATE_COUNTER = 3;

let options: IGameOptions;
let groupWordsArr: IWordAndTranslation[];
let roundResults: IRoundResult[] = [];
let scoreCounter: IScoreCounter = {
  score: 0,
  multiplyer: 1,
  multiplyerIntermediateCounter: 0,
};
// let roundScore: number = 0;
// let multiplyer: number = 1;
//let translateCorrectness: boolean;

export default class SprintGame extends BaseComponent {

  // groupsWrapper: HTMLElement | undefined;
  // groupsWrapperButton: HTMLButtonElement | undefined;
  group: string = '';
  page: string = '';
  buttonB: HTMLButtonElement | undefined;
  buttonA: HTMLButtonElement | undefined;
  paramsScore: HTMLDivElement | undefined;
  paramsTime: HTMLDivElement | undefined;
  
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'sprintGame';
  }

  public oninit(): Promise<void> {
    this.setActions();
    //this.addLoading();
    pageChenging(createSpan({ text: 'Спринт Игра' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page sprint' });
    const sprintWrapper = createDiv({ className: 'sprint-wrapper' });
    const paramsWrapper = createDiv({ className: 'params-wrapper' });
    const marioWrapper = createDiv({ className: 'mario-wrapper' });
    const gamepadWrapper = createDiv({ className: 'gamepad-wrapper' });
    const wordsWrapper = createDiv({ className: 'words-wrapper' });

    //this.getApi();

    this.getGroupAndPage();

    this.renderParams(paramsWrapper);
    this.renderMario(marioWrapper);
    this.renderGamepad(gamepadWrapper);
    this.renderWords(wordsWrapper);
    
    this.getWordsArray();
    
    
    sprintWrapper.append(paramsWrapper);
    sprintWrapper.append(wordsWrapper);
    sprintWrapper.append(marioWrapper);
    sprintWrapper.append(gamepadWrapper);

    page.append(sprintWrapper);
    this.fragment.append(page);
    
    // window.onload = () => {
    //   console.log('111')
    //   this.startTimer()
    // };
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
    this.paramsScore = paramsScore;
    this.paramsTime = paramsTime;

    const star = document.createElement('img');
    star.className = 'group-img'
    star.src = '/../../../../assets/img/sprintGame/png/pixel_star_50px.png';
    
    const multiplyerItem = document.createElement('img');
    multiplyerItem.className = 'params-wrapper__multiplyer-item';
    multiplyerItem.src = '/../../../../assets/img/sprintGame/png/MushroomSMW.png';

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

  private getGroupAndPage() {
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
    const buttonB = createButton({className: 'buttons-wrapper__button-b', action: 'getNextRandomWords'})
    this.buttonB = buttonB;

    const buttonAWrapper = createDiv({ className: 'buttons-wrapper__button-wrapper' });
    const buttonABack = createDiv({ className: 'buttons-wrapper__back' });
    const buttonACapture = createDiv({ className: 'buttons-wrapper__capture' });
    const buttonA = createButton({className: 'buttons-wrapper__button-a', action: 'getNextRandomWords'})
    this.buttonA = buttonA;

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

    // this.getNextRandomWords(buttonB, buttonA);
  }

  private renderWords(wordsWrapper: HTMLDivElement) {
    const engWord = createDiv({ className: 'eng-word' });
    const translatedWord = createDiv({ className: 'translated-word' });

    engWord.textContent = '';
    translatedWord.textContent = '';
    wordsWrapper.append(engWord);
    wordsWrapper.append(translatedWord);
  }

  private startTimer(startOnce: boolean) {
    
    const getSecondsLeft = () => {
      const delta = TIME_FOR_GAME_MILISECONDS - (Date.now() - start)
      if (Math.round(delta / 1000) === 0) {
        console.log(0)
        this.paramsTime!.innerHTML = `time<br> 0`;
        clearInterval (timerId)
      } else {
        console.log(Math.round(delta / 1000))
        this.paramsTime!.innerHTML = `time<br> ${Math.round(delta / 1000)}`;
      }
    }

    const start = Date.now();
    const timerId = setInterval(getSecondsLeft, 1000)
  }

  private async getWordsArray() {
    if (options.page === undefined) {
      groupWordsArr = [];
      
      await apiService.getChunkOfWordsGroup(Number(this.group)).then(words => {
        words.forEach((el) => {
          const elMod: IWordAndTranslation =  {
            word: `${el.word}`, 
            wordTranslate: `${el.wordTranslate}`, 
            audio: `${el.audio}`,
          };
           groupWordsArr.push(elMod);
        })
      });
      console.log(groupWordsArr)
      
    }
    this.getRandomWords(groupWordsArr);
  }

  private getRandomWords(groupWordsArr: IWordAndTranslation[]) {
    const word = this.elem.querySelector('.eng-word') as HTMLDivElement;
    const wordTranslate = this.elem.querySelector('.translated-word') as HTMLDivElement;
    const randomWordNumber = getRandom(0, GROUP_WORDS_NUMBER);

    word!.textContent = groupWordsArr[randomWordNumber].word;
    if (Math.random() < 0.5) {
      wordTranslate!.textContent = groupWordsArr[randomWordNumber].wordTranslate;
      this.addElementToRoundResults(randomWordNumber, true);
    } else {
      wordTranslate!.textContent = groupWordsArr[getWrongTranslate()].wordTranslate;
      this.addElementToRoundResults(randomWordNumber, false);
    }

    function getWrongTranslate() {
      const randomWordAnotherNumber = getRandom(0, GROUP_WORDS_NUMBER);
      if (randomWordNumber === randomWordAnotherNumber) {
        getWrongTranslate();
      }
      return randomWordAnotherNumber;
    }
    this.startTimer(true);
  }

  private addElementToRoundResults(randomWordNumber: number, translateCorrectness: boolean) {
    roundResults[roundResults.length] = {
      word: `${groupWordsArr[randomWordNumber].word}`,
      wordTranslate: `${groupWordsArr[randomWordNumber].wordTranslate}`,
      audio: `${groupWordsArr[randomWordNumber].audio}`,
      translateCorrectness: translateCorrectness,
    };
  }

  public listenEvents(): void {
    this.buttonB?.addEventListener('click', this.checkAnswer.bind(this, false));
    this.buttonA?.addEventListener('click', this.checkAnswer.bind(this, true));
  }

  public setActions(): void {

  }

  private checkAnswer(answer: boolean) {
    this.elem.querySelector('.params-wrapper__score')
    if (answer === roundResults[roundResults.length - 1].translateCorrectness) {
      roundResults[roundResults.length - 1].answerCorrectness = true;
      scoreCounter.score += scoreCounter.multiplyer * MIN_SCORE_FOR_CORRECT_ANSWER;
      scoreCounter.multiplyerIntermediateCounter += 1;
      
      if (scoreCounter.multiplyerIntermediateCounter === MAX_SCORE_MULTIPLYER_INTERMEDIATE_COUNTER 
        && scoreCounter.multiplyer !== MAX_SCORE_MULTIPLYER) {
        scoreCounter.multiplyer = scoreCounter.multiplyer * 2;
        scoreCounter.multiplyerIntermediateCounter = 0;
      }
      
    } else {
      if (scoreCounter.multiplyer > 1) {
        scoreCounter.multiplyer /= 2;
        scoreCounter.multiplyerIntermediateCounter = 0;
      }
      roundResults[roundResults.length - 1].answerCorrectness = false;
    }
    this.paramsScore!.textContent = `${scoreCounter.score}`;
    console.log(roundResults)
    console.log(scoreCounter)
    this.getRandomWords(groupWordsArr);
  }

  private getApi() {
    apiService.getUserStatistics(`1`).then(value => console.log(value))
  }


  // private getNextRandomWords() {
  //   console.log('buttonB')
  // }



}

//TODO:
// 1) LOADER




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