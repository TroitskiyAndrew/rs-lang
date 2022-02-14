import BaseComponent from '../../base';
import { createButton, createDiv, createSpan, getRandom } from '../../../utils';
import { pageChenging, updateContent } from '../../../rooting';
import { apiService } from '../../../api/apiMethods';
import { IGameOptions, IWordParams, IScoreCounter } from './sprintGameTypes';
import { IStatisticAnswer } from '../audioGame/index'
import { updateState, getState } from '../../../state';

const GROUP_WORDS_NUMBER = 600;
const MIN_SCORE_FOR_CORRECT_ANSWER = 10;
const MAX_SCORE_MULTIPLYER = 8;
const TIME_FOR_GAME_MILISECONDS = 20000;
const MAX_SCORE_MULTIPLYER_INTERMEDIATE_COUNTER = 3;

let options: IGameOptions;
let groupWordsArr: IStatisticAnswer[] =[];
let roundResults: IWordParams[] = [];
let scoreCounter: IScoreCounter = {
  score: 0,
  multiplyer: 1,
  multiplyerIntermediateCounter: 0,
};
let startTimerOnce: boolean = true;
let timerId: NodeJS.Timer;
let menuButton: HTMLButtonElement
let menuModal: HTMLUListElement
let audioIsPlaying = false;
// let startAudioOnce = true;

export default class SprintGame extends BaseComponent {

  // groupsWrapper: HTMLElement | undefined;
  // groupsWrapperButton: HTMLButtonElement | undefined;
  group: string = '';
  page: string = '';
  buttonB: HTMLButtonElement | undefined;
  buttonA: HTMLButtonElement | undefined;
  paramsScore: HTMLDivElement | undefined;
  paramsTime: HTMLDivElement | undefined;
  gamepadWrapper: HTMLDivElement | undefined;
  controlSelect: HTMLButtonElement | undefined;
  startAudioOnce: boolean = true;
  audioSprint: HTMLAudioElement = new Audio();
  audioModal: HTMLAudioElement = new Audio();
  audioCoin: HTMLAudioElement = new Audio();
  audioMushroom: HTMLAudioElement = new Audio();

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
    this.gamepadWrapper = gamepadWrapper;
    const wordsWrapper = createDiv({ className: 'words-wrapper' });

    this.clearGameParams();
    this.getGroupAndPage();

    this.renderParams(paramsWrapper);
    this.renderMario(marioWrapper);
    this.renderGamepad(gamepadWrapper);
    this.renderWords(wordsWrapper);
    this.getWordsArray();

    this.playAudioSprint(this.audioSprint, '../../../../assets/sounds/1 - Title Bgm.mp3', audioIsPlaying);
    
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
      // localStorage.setItem ('options', this.options);
      updateState({optionsSprint: this.options})
    } 
    if (options) {
      this.group = options.group;
      if (options.page) this.page = options.page;
    } else {
      //localStorage.getItem ('options') ? options = JSON.parse (localStorage.getItem ('options') as string) : options = {group: '0'};
      this.group = JSON.parse (getState().optionsSprint).group;
      // this.group = options.group;
      if (JSON.parse (getState().optionsSprint).page) this.page = JSON.parse (getState().optionsSprint).page;
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
    this.controlSelect = controlSelect;
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

    engWord.textContent = '';
    translatedWord.textContent = '';
    wordsWrapper.append(engWord);
    wordsWrapper.append(translatedWord);
  }

  private startTimer() {
    if (startTimerOnce) {
      const getSecondsLeft = () => {
        const delta = TIME_FOR_GAME_MILISECONDS - (Date.now() - start)
        if (Math.round(delta / 1000) === 0) {
          console.log(0)
          this.paramsTime!.innerHTML = `time<br> 0`;
          this.stopTimer()
          // this.giveScoreToModalStatistic()
          this.showModalStatistics()
        } else {
          console.log(Math.round(delta / 1000))
          this.paramsTime!.innerHTML = `time<br> ${Math.round(delta / 1000)}`;
        }
      }
      const start = Date.now();
      timerId = setInterval(getSecondsLeft, 1000)
    }
    startTimerOnce = false;
  }

  private stopTimer() {
    console.log(`timerId`+timerId)
    clearInterval (timerId)
  }

  private async getWordsArray() {
    // if (options && options.page === undefined) {
    if (this.page === '') {
      await apiService.getChunkOfWordsGroup(Number(this.group)).then(words => {
        words.forEach((el) => {
          const elMod: IWordParams =  {
            id: `${el.id}`,
            group: el.group,
            image: `${el.image}`,
            page: el.page,
            word: `${el.word}`, 
            wordTranslate: `${el.wordTranslate}`, 
            audio: `${el.audio}`,
            answerCorrectness: false,
          };
           groupWordsArr.push(elMod);
        })
      });
      console.log(groupWordsArr)
    }
    this.getRandomWords(groupWordsArr);
  }

  private getRandomWords(groupWordsArr: IWordParams[]) {
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
    this.startTimer();
  }

  private addElementToRoundResults(randomWordNumber: number, translateCorrectness: boolean) {
    roundResults[roundResults.length] = {
      id: `${groupWordsArr[randomWordNumber].id}`,
      group: groupWordsArr[randomWordNumber].group,
      image: `${groupWordsArr[randomWordNumber].image}`,
      page: groupWordsArr[randomWordNumber].page,
      word: `${groupWordsArr[randomWordNumber].word}`,
      wordTranslate: `${groupWordsArr[randomWordNumber].wordTranslate}`,
      audio: `${groupWordsArr[randomWordNumber].audio}`,
      translateCorrectness: translateCorrectness,
      answerCorrectness: false,
    };
  }

  public listenEvents(): void {

    this.buttonB?.addEventListener('click', this.checkAnswer.bind(this, false));
    this.buttonA?.addEventListener('click', this.checkAnswer.bind(this, true));
    this.getMenuButton().then(val => {
      val.addEventListener('click', menuButtonHandler);
      menuButton = val;
    });
    let menuButtonHandler = () => {
      this.getMenuModal().then(val => {
        val.addEventListener('click', menuModalHandler)
        menuModal = val;
      })
      
    }
    let menuModalHandler = () => {
      menuButton.removeEventListener('click', menuButtonHandler);
      menuModal.removeEventListener('click', menuModalHandler);
      this.clearGameParams()
      this.audioSprint.pause();
    }
    this.controlSelect?.addEventListener('click', this.switchAudio.bind(this))
  }

  private switchAudio() {
    if (this.startAudioOnce) {
      this.playAudioSprint(this.audioSprint, '../../../../assets/sounds/1 - Title Bgm.mp3', true)
      this.startAudioOnce = false;
    }
    if (audioIsPlaying) {
      this.audioSprint.pause();
      audioIsPlaying = false;
    } else {
      this.audioSprint.play();
      audioIsPlaying = true;
    }
  }

  private playAudioSprint(player: HTMLAudioElement, src: string, status: boolean) {
    if (status) {
      player.src = src;
      player.play();
    }

  }

  private clearGameParams() {
    groupWordsArr = [];
    startTimerOnce = true;
    scoreCounter = {
      score: 0,
      multiplyer: 1,
      multiplyerIntermediateCounter: 0,
    };
    roundResults = [];
    this.stopTimer();
  }

  public playAgain() {
    startTimerOnce = true;
    scoreCounter = {
      score: 0,
      multiplyer: 1,
      multiplyerIntermediateCounter: 0,
    };
    roundResults = [];
    this.gamepadWrapper!.style.display = "flex";
    this.getRandomWords(groupWordsArr);
    this.startAudioOnce = true;
    this.audioModal.pause();
    this.playAudioSprint(this.audioSprint, '../../../../assets/sounds/1 - Title Bgm.mp3', audioIsPlaying);
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
        this.playAudioSprint(this.audioMushroom, '../../../../assets/sounds/smw_1-up.wav', audioIsPlaying);
      } else {
        this.playAudioSprint(this.audioCoin, '../../../../assets/sounds/smw_coin.wav', audioIsPlaying);
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

  private async getMenuButton(): Promise<HTMLButtonElement> {
    return await document.getElementsByClassName('menu__button icon-button')[0] as HTMLButtonElement;
  }

  private async getMenuModal(): Promise<HTMLUListElement> {
    return await document.getElementsByClassName('menu__list')[0] as HTMLUListElement;
  } 

  private showModalStatistics(): void {
    const modalStatistic = createDiv({
      className: '',
      dataSet: {
        widget: 'modalStatistic',
        parentId: this.id,
      },
    });
    this.elem.append(modalStatistic);
    updateContent(modalStatistic, modalStatistic.getAttribute('data-widget') as string);
    this.playAudioSprint(this.audioModal, '../../../../assets/sounds/22 - Course Clear Fanfare.mp3', audioIsPlaying);
    this.gamepadWrapper!.style.display = "none";
  }

  public giveDataToModalStatistic(): IStatisticAnswer[] {
    roundResults = roundResults.map(el =>  {
      delete el.translateCorrectness;
      return el
    })
    console.log(roundResults)
    roundResults = roundResults.slice(0, roundResults.length - 1);
    this.audioSprint.pause();
    return roundResults;
  }

  public giveScoreToModalStatistic(): number {
    return scoreCounter.score;
  }
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