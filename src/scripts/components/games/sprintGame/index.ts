import BaseComponent from '../../base';
import { createButton, createDiv, createSpan, getRandom } from '../../../utils';
import { pageChenging, updateContent } from '../../../rooting';
import { apiService } from '../../../api/apiMethods';
import { WordCard } from '../../../api/api.types';
import { IGameOptions, IWordParams, IScoreCounter } from './sprintGameTypes';
import { IStatisticAnswer } from '../audioGame/index';
import { updateState, getState } from '../../../state';
import constants from '../../../app.constants';
// import WordsCard from '../../pageDictionary/wordCard';

const GROUP_WORDS_NUMBER = 600;
const MIN_SCORE_FOR_CORRECT_ANSWER = 10;
const MAX_SCORE_MULTIPLYER = 8;
const TIME_FOR_GAME_MILISECONDS = 60000;
const MAX_SCORE_MULTIPLYER_INTERMEDIATE_COUNTER = 3;

let options: IGameOptions;
let wordsArrToPlay: IStatisticAnswer[] = [];
let wordsArrToPlayCut: IStatisticAnswer[] = [];
let roundResults: IWordParams[] = [];
let scoreCounter: IScoreCounter = {
  score: 0,
  multiplyer: 1,
  multiplyerIntermediateCounter: 0,
};
let startTimerOnce = true;
let timerId: NodeJS.Timer;
let menuButton: HTMLButtonElement;
let menuModal: HTMLUListElement;
let audioIsPlaying = false;
let coinCounter = 0;
let wordsOnPageLeft: number | null = null;
let cutRoundResults = false;

export default class SprintGame extends BaseComponent {

  group = '';

  page = '';

  startAudioOnce = true;

  paramsScore: HTMLDivElement | undefined;

  paramsTime: HTMLDivElement | undefined;

  gamepadWrapper: HTMLDivElement | undefined;

  itemWrapper: HTMLDivElement | undefined;

  paramsMultiplyerWrapper: HTMLDivElement | undefined;

  paramsCoins: HTMLDivElement | undefined;

  buttonsWrapper: HTMLDivElement | undefined;

  wordsWrapper: HTMLDivElement | undefined;

  controlSound: HTMLButtonElement | undefined;

  controlResume: HTMLButtonElement | undefined;

  buttonB: HTMLButtonElement | undefined;

  buttonA: HTMLButtonElement | undefined;

  mario: HTMLImageElement | undefined;

  audioSprint: HTMLAudioElement = new Audio();

  audioCoin: HTMLAudioElement = new Audio();

  audioMushroom: HTMLAudioElement = new Audio();

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'sprintGame';
  }

  public oninit(): Promise<void> {
    (document.querySelector('footer') as HTMLElement).classList.remove('hidden');
    this.setActions();
    this.addLoading();
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page sprint' });
    const sprintWrapper = createDiv({ className: 'sprint-wrapper' });
    const paramsWrapper = createDiv({ className: 'params-wrapper' });
    const marioWrapper = createDiv({ className: 'mario-wrapper' });
    const pipeWrapper = createDiv({ className: 'pipe-wrapper' });
    const gamepadWrapper = createDiv({ className: 'gamepad-wrapper' });
    const wordsWrapper = createDiv({ className: 'words-wrapper' });
    this.gamepadWrapper = gamepadWrapper;
    this.wordsWrapper = wordsWrapper;

    this.clearGameParams();
    this.getGroupAndPage();

    this.renderParams(paramsWrapper);
    this.renderMario(marioWrapper);
    this.renderPipe(pipeWrapper);
    this.renderGamepad(gamepadWrapper);
    this.renderWords(wordsWrapper);
    this.getWordsArray();

    this.playAudioSprint(this.audioSprint, '../../../../assets/sounds/1 - Title Bgm.mp3', audioIsPlaying);

    sprintWrapper.append(paramsWrapper);
    sprintWrapper.append(wordsWrapper);
    sprintWrapper.append(gamepadWrapper);
    sprintWrapper.append(marioWrapper);
    sprintWrapper.append(pipeWrapper);

    page.append(sprintWrapper);
    this.fragment.append(page);
  }

  private getCoin(size: string) {
    const coin = document.createElement('img');
    coin.className = `coin-img_${size}`;
    coin.src = '/../../../../assets/img/sprintGame/gif/CoinSMW.gif';
    return coin;
  }

  private getMushroom() {
    const mushroom = document.createElement('img');
    mushroom.className = 'mushroom-img';
    mushroom.src = '/../../../../assets/img/sprintGame/png/MushroomSMW.png';
    return mushroom;
  }

  private getFeather() {
    const feather = document.createElement('img');
    feather.className = 'feather-img';
    feather.src = '/../../../../assets/img/sprintGame/png/Feather.png';
    return feather;
  }

  private getEgg() {
    const egg = document.createElement('img');
    egg.className = 'egg-img';
    egg.src = '/../../../../assets/img/sprintGame/png/SMW_YoshiEgg_Green.png';
    return egg;
  }

  private async getMenuButton(): Promise<HTMLButtonElement> {
    return await document.getElementsByClassName('menu__button icon-button')[0] as HTMLButtonElement;
  }

  private async getMenuModal(): Promise<HTMLUListElement> {
    return await document.getElementsByClassName('menu__list')[0] as HTMLUListElement;
  }

  private renderParams(paramsWrapper: HTMLDivElement) {
    const paramsLevelWrapper = createDiv({ className: 'params-wrapper__level' });
    const paramsMultiplyerWrapper = createDiv({ className: 'params-wrapper__multiplyer' });
    const paramsTime = createDiv({ className: 'params-wrapper__time' });
    const paramsCoinsWrapper = createDiv({ className: 'params-wrapper__coins-wrapper' });
    const paramsCoins = createDiv({ className: 'params-wrapper__coins' });
    const paramsScore = createDiv({ className: 'params-wrapper__score' });
    this.paramsMultiplyerWrapper = paramsMultiplyerWrapper;
    this.paramsTime = paramsTime;
    this.paramsCoins = paramsCoins;
    this.paramsScore = paramsScore;

    const star = document.createElement('img');
    star.className = 'group-img';
    star.src = '/../../../../assets/img/sprintGame/png/pixel_star_50px.png';

    paramsLevelWrapper.append(star);
    paramsLevelWrapper.innerHTML += '&#215;';
    paramsLevelWrapper.append(this.group);

    paramsTime.innerHTML = 'time<br> 60';

    paramsCoins.append(this.getCoin('params'));
    paramsCoins.innerHTML += '&#215; 0';
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
    mario.className = 'mario-img';
    this.mario = mario;
    mario.src = '/../../../../assets/img/sprintGame/png/SMWSmallMarioSprite.png';

    marioWrapper.append(mario);
  }

  private renderPipe(pipeWrapper: HTMLDivElement) {
    const block = document.createElement('img');
    const pipe = document.createElement('img');

    const blocksWrapper = createDiv({ className: 'blocks-wrapper' });
    const itemWrapper = createDiv({ className: 'item-wrapper' });
    this.itemWrapper = itemWrapper;

    block.className = 'block-img';
    block.src = '/../../../../assets/img/sprintGame/png/SMW_Hard_Block.png';
    for (let i = 0; i < Number('3'); i++) {
      const newBlock = block.cloneNode();
      blocksWrapper.append(newBlock);
    }
    pipe.className = 'pipe-img';
    pipe.src = '/../../../../assets/img/sprintGame/png/Warp_Pipe_SMW.png';

    pipeWrapper.append(blocksWrapper);
    pipeWrapper.append(pipe);
    pipeWrapper.append(itemWrapper);

  }

  private renderGamepad(gamepadWrapper: HTMLDivElement) {
    const buttonsWrapper = createDiv({ className: 'buttons-wrapper' });
    const controlsWrapper = createDiv({ className: 'controls-wrapper' });
    this.buttonsWrapper = buttonsWrapper;

    const buttonBWrapper = createDiv({ className: 'buttons-wrapper__button-wrapper' });
    const buttonBBack = createDiv({ className: 'buttons-wrapper__back' });
    const buttonBCapture = createDiv({ className: 'buttons-wrapper__capture' });
    const buttonB = createButton({ className: 'buttons-wrapper__button-b', action: 'getNextRandomWords' });
    this.buttonB = buttonB;
    buttonB.innerHTML = '&#215;';

    const buttonAWrapper = createDiv({ className: 'buttons-wrapper__button-wrapper' });
    const buttonABack = createDiv({ className: 'buttons-wrapper__back' });
    const buttonACapture = createDiv({ className: 'buttons-wrapper__capture' });
    const buttonA = createButton({ className: 'buttons-wrapper__button-a', action: 'getNextRandomWords' });
    buttonA.innerHTML = '	&#10004;';
    this.buttonA = buttonA;

    const controlsBack = createDiv({ className: 'controls-wrapper__back' });
    const controlsCapture = createDiv({ className: 'controls-wrapper__capture' });
    const controlSound = createButton({ className: 'controls-wrapper__select' });
    const controlResume = createButton({ className: 'controls-wrapper__start' });
    this.controlSound = controlSound;
    this.controlResume = controlResume;

    controlsWrapper.append(controlsCapture);
    controlsCapture.innerHTML = 'sound&nbsp;&nbsp;resume';
    controlsWrapper.append(controlsBack);
    controlsBack.append(controlSound);
    controlsBack.append(controlResume);

    controlsWrapper.append(buttonsWrapper);

    buttonsWrapper.append(buttonBWrapper);
    buttonBWrapper.append(buttonBBack);
    buttonBWrapper.append(buttonBCapture);
    buttonBCapture.innerHTML = '&larr;';
    buttonBBack.append(buttonB);

    buttonsWrapper.append(buttonAWrapper);
    buttonAWrapper.append(buttonABack);
    buttonAWrapper.append(buttonACapture);
    buttonACapture.innerHTML = '&rarr;';
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

  private getGroupAndPage() {
    console.log(this.options);
    if (this.options) {
      options = JSON.parse(this.options);
      updateState({ optionsSprint: this.options });
    }
    if (options) {
      this.group = options.group;
      if (options.page !== undefined) this.page = options.page;
    } else {
      this.group = JSON.parse(getState().optionsSprint).group;
      //if (JSON.parse (getState().optionsSprint).page) this.page = JSON.parse (getState().optionsSprint).page;
    }
  }

  private startTimer() {
    if (startTimerOnce) {
      const start = Date.now();
      const getSecondsLeft = () => {
        const delta = TIME_FOR_GAME_MILISECONDS - (Date.now() - start);
        if (Math.round(delta / Number('1000')) <= 0) {
          (this.paramsTime as HTMLElement).innerHTML = 'time<br> 0';
          cutRoundResults = true;
          this.stopTimer();
          this.showModalStatistics();
        } else {
          (this.paramsTime as HTMLElement).innerHTML = `time<br> ${Math.round(delta / Number('1000'))}`;
        }
      };

      timerId = setInterval(getSecondsLeft, Number('1000'));
    }
    startTimerOnce = false;
  }

  private stopTimer() {
    clearInterval(timerId);
  }

  private getWordsArray() {
    if (getState().userId) {
      if (Number(this.group) === Number('6')) {
        this.getDifficultWordsArray();
      } else if (this.page === '') {
        this.getWordsArrayFromGroup();
      } else {
        this.getWordsArrayFromPages(true);
      }
    } else if (this.page === '') {
      this.getWordsArrayFromGroup();
    } else {
      this.getWordsArrayFromPages(false);
    }

  }

  private async getDifficultWordsArray() {
    await apiService.getAllUserAggregatedWords(getState().userId, '{"userWord.difficulty":"difficult"}').then(words => {
      (words as WordCard[]).forEach((el) => {
        this.addElToArray(el);
      });
    });
    wordsArrToPlayCut = wordsArrToPlay.slice();
    wordsOnPageLeft = wordsArrToPlay.length;
    this.removeLoading();
    this.getRandomWords(wordsArrToPlay, wordsOnPageLeft);
  }

  private async getWordsArrayFromGroup() {
    await apiService.getChunkOfWordsGroup(Number(this.group)).then(words => {
      words.forEach((el) => this.addElToArray(el));
    });
    this.removeLoading();
    this.getRandomWords(wordsArrToPlay, GROUP_WORDS_NUMBER);
  }

  private async getWordsArrayFromPages(authorized: boolean) {
    let currentPageToArray: string = this.page;
    const addPageToArr = async () => {
      if (authorized) {
        await apiService.getAllUserAggregatedWords(getState().userId, '{"userWord.optional.learned":false}', constants.maxWordsOnPage, Number(this.group), Number(currentPageToArray)).then(words => {
          (words as WordCard[]).forEach((el) => this.addElToArray(el));
        });
      } else {
        await apiService.getChunkOfWords(Number(currentPageToArray), Number(this.group)).then(words => {
          (words as WordCard[]).forEach((el) => this.addElToArray(el));
        });
      }

      currentPageToArray = String(Number(currentPageToArray) - 1);
      if (Number(currentPageToArray) >= 0) {
        addPageToArr();
      } else {
        wordsArrToPlayCut = wordsArrToPlay.slice();
        wordsOnPageLeft = this.getWordsOnPageNumber();
        this.getRandomWords(wordsArrToPlay, wordsOnPageLeft);
        this.removeLoading();
      }
    };
    addPageToArr();
  }

  private getWordsOnPageNumber() {
    let prevEl: number | null = null;
    let wordsOnPageNumber = 0;
    wordsArrToPlayCut.forEach((el, index) => {
      if (index === 0) {
        wordsOnPageNumber = 1;
      } else if (el.page === prevEl) {
        wordsOnPageNumber += 1;
      } else return;
      prevEl = el.page;
    });
    return wordsOnPageNumber;
  }

  private addElToArray(el: WordCard) {
    if (el._id) el.id = el._id;
    const elMod: IWordParams = {
      id: `${el.id}`,
      group: el.group,
      image: `${el.image}`,
      page: el.page,
      word: `${el.word}`,
      wordTranslate: `${el.wordTranslate}`,
      audio: `${el.audio}`,
      answerCorrectness: false,
    };
    wordsArrToPlay.push(elMod);
  }

  private getRandomWords(wordsArr: IWordParams[], wordsNumber: number) {
    const word = this.elem.querySelector('.eng-word') as HTMLDivElement;
    const wordTranslate = this.elem.querySelector('.translated-word') as HTMLDivElement;
    const randomWordNumber = getRandom(0, wordsNumber);
    function getWrongTranslate() {
      const randomWordAnotherNumber = getRandom(0, wordsNumber);
      if (randomWordNumber === randomWordAnotherNumber) {
        getWrongTranslate();
      }
      return randomWordAnotherNumber;
    }

    word.textContent = wordsArr[randomWordNumber].word;
    if (Math.random() < (1 / 2) || wordsNumber === 1) {
      wordTranslate.textContent = wordsArr[randomWordNumber].wordTranslate;
      this.addElementToRoundResults(wordsArr, randomWordNumber, true);
    } else {
      wordTranslate.textContent = wordsArr[getWrongTranslate()].wordTranslate;
      this.addElementToRoundResults(wordsArr, randomWordNumber, false);
    }


    wordsArrToPlayCut.splice(randomWordNumber, 1);
    if (wordsOnPageLeft) wordsOnPageLeft -= 1;
    this.startTimer();
  }

  private addElementToRoundResults(wordsArr: IWordParams[], randomWordNumber: number, translateCorrectness: boolean) {
    roundResults[roundResults.length] = {
      id: `${wordsArr[randomWordNumber].id}`,
      group: wordsArr[randomWordNumber].group,
      image: `${wordsArr[randomWordNumber].image}`,
      page: wordsArr[randomWordNumber].page,
      word: `${wordsArr[randomWordNumber].word}`,
      wordTranslate: `${wordsArr[randomWordNumber].wordTranslate}`,
      audio: `${wordsArr[randomWordNumber].audio}`,
      translateCorrectness: translateCorrectness,
      answerCorrectness: false,
    };
  }

  private checkAnswer(answer: boolean) {
    this.elem.querySelector('.params-wrapper__score');
    if (answer === roundResults[roundResults.length - 1].translateCorrectness) {
      roundResults[roundResults.length - 1].answerCorrectness = true;
      scoreCounter.score += scoreCounter.multiplyer * MIN_SCORE_FOR_CORRECT_ANSWER;
      scoreCounter.multiplyerIntermediateCounter += 1;

      if (scoreCounter.multiplyerIntermediateCounter === MAX_SCORE_MULTIPLYER_INTERMEDIATE_COUNTER
        && scoreCounter.multiplyer !== MAX_SCORE_MULTIPLYER) {
        scoreCounter.multiplyer = scoreCounter.multiplyer * 2;
        scoreCounter.multiplyerIntermediateCounter = 0;
        this.playAudioSprint(this.audioMushroom, '../../../../assets/sounds/smw_1-up.wav', audioIsPlaying);
        this.addItem(scoreCounter.multiplyer);
      } else {
        this.addCoin();
        this.playAudioSprint(this.audioCoin, '../../../../assets/sounds/smw_coin.wav', audioIsPlaying);
      }

    } else {
      if (scoreCounter.multiplyer > 1) {
        scoreCounter.multiplyer /= 2;
        scoreCounter.multiplyerIntermediateCounter = 0;
        this.deleteItem(scoreCounter.multiplyer);
      }
      roundResults[roundResults.length - 1].answerCorrectness = false;
    }

    (this.paramsScore as HTMLElement).textContent = `${scoreCounter.score}`;
    if (this.page !== '' && Number(this.group) !== Number('6')) {
      if (wordsArrToPlayCut.length && wordsOnPageLeft) {
        this.getRandomWords(wordsArrToPlayCut, wordsOnPageLeft);
      } else if (!wordsArrToPlayCut.length) {
        this.stopTimer();
        this.showModalStatistics();
      } else {
        wordsOnPageLeft = this.getWordsOnPageNumber();
        this.getRandomWords(wordsArrToPlayCut, wordsOnPageLeft);
      }
    } else if (wordsOnPageLeft) {
      this.getRandomWords(wordsArrToPlayCut, wordsOnPageLeft);
    } else if (wordsOnPageLeft === 0) {
      this.stopTimer();
      this.showModalStatistics();
    } else {
      this.getRandomWords(wordsArrToPlay, GROUP_WORDS_NUMBER);
    }
  }

  public listenEvents(): void {
    const menuButtonHandler = () => {
      this.getMenuModal().then(val => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        val.addEventListener('click', menuModalHandler);
        menuModal = val;
      });

    };

    this.getMenuButton().then(val => {
      val.addEventListener('click', menuButtonHandler);
      menuButton = val;
    });


    const keyupHandler = (ev: KeyboardEvent) => {
      if (ev.code === 'ArrowRight') {
        this.checkAnswer(true);
      } else if (ev.code === 'ArrowLeft') {
        this.checkAnswer(false);
      }
    };

    const menuModalHandler = () => {
      menuButton.removeEventListener('click', menuButtonHandler);
      menuModal.removeEventListener('click', menuModalHandler);
      document.removeEventListener('keyup', keyupHandler);
      this.clearGameParams();
      this.audioSprint.pause();
    };

    this.buttonB?.addEventListener('click', this.checkAnswer.bind(this, false));
    this.buttonA?.addEventListener('click', this.checkAnswer.bind(this, true));
    if (this.elem.children[2].className === 'page sprint') {
      document.addEventListener('keyup', keyupHandler);
    }

    this.controlSound?.addEventListener('click', this.switchAudio.bind(this));
    this.controlResume?.addEventListener('click', this.resume.bind(this));
  }

  private resume() {
    this.stopTimer();
    this.playAgain();
  }

  private switchAudio() {
    if (this.startAudioOnce) {
      this.playAudioSprint(this.audioSprint, '../../../../assets/sounds/1 - Title Bgm.mp3', true);
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
    wordsArrToPlay = [];
    startTimerOnce = true;
    scoreCounter = {
      score: 0,
      multiplyer: 1,
      multiplyerIntermediateCounter: 0,
    };
    roundResults = [];
    cutRoundResults = false;
    wordsOnPageLeft = null;
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
    cutRoundResults = false;
    (this.gamepadWrapper as HTMLElement).style.visibility = 'visible';
    (this.wordsWrapper as HTMLElement).style.visibility = 'visible';
    wordsArrToPlayCut = wordsArrToPlay.slice();

    (this.mario as HTMLImageElement).src = '/../../../../assets/img/sprintGame/png/SMWSmallMarioSprite.png';
    (this.mario as HTMLImageElement).onload = () => {
      (this.mario as HTMLImageElement).style.height = '3.6rem';
      (this.mario as HTMLImageElement).classList.remove('yoshi');
      (this.mario as HTMLImageElement).classList.remove('small');
      (this.mario as HTMLImageElement).classList.remove('up');
      (this.mario as HTMLImageElement).classList.remove('down');
    };
    (this.itemWrapper as HTMLElement).innerHTML = '';
    (this.paramsMultiplyerWrapper as HTMLElement).innerHTML = '';
    (this.paramsCoins as HTMLElement).innerHTML = (this.paramsCoins as HTMLElement).innerHTML.replace(/\d+/g, '0');
    (this.paramsScore as HTMLElement).textContent = '0';
    this.startAudioOnce = true;
    if (this.group === '6') {
      wordsOnPageLeft = wordsArrToPlayCut.length;
      this.getRandomWords(wordsArrToPlayCut, wordsOnPageLeft);
    } else if (this.page === '') {
      this.getRandomWords(wordsArrToPlayCut, GROUP_WORDS_NUMBER);
    } else {
      wordsOnPageLeft = this.getWordsOnPageNumber();
      this.getRandomWords(wordsArrToPlayCut, wordsOnPageLeft);
    }
    this.playAudioSprint(this.audioSprint, '../../../../assets/sounds/1 - Title Bgm.mp3', audioIsPlaying);
  }

  public setActions(): void {

  }

  private addCoin() {
    const newCoin = this.getCoin('small').cloneNode() as HTMLImageElement;
    (this.itemWrapper as HTMLElement).append(newCoin);
    coinCounter += 1;
    (this.paramsCoins as HTMLElement).innerHTML = (this.paramsCoins as HTMLElement).innerHTML.replace(/\d+/g, String(coinCounter));
  }

  private addItem(itemNumber: number) {
    switch (itemNumber) {
      case 2:
        this.addItemHandler(this.getMushroom(), 'Mario_SMW', '-1');
        break;
      case Number('4'):
        this.addItemHandler(this.getFeather(), 'Navmario', '1');
        break;
      case Number('8'):
        this.addItemHandler(this.getEgg(), 'SMW_MarioCapeSpin', '1');
        break;
    }
  }

  private deleteItem(itemNumber: number) {
    switch (itemNumber) {
      case 1:
        this.deleteItemHandler(null, 'SMWSmallMarioSprite', '3.6');
        break;
      case 2:
        this.deleteItemHandler(this.getMushroom(), 'SMW_Mario', '4.6');
        break;
      case Number('4'):
        this.deleteItemHandler(this.getFeather(), 'SMWCapeMarioSprite', '4.6');
        break;
    }
  }

  private addItemHandler(item: HTMLImageElement, gifName: string, scaleNum: string) {
    const newItem = item.cloneNode();
    const newItemParams = item.cloneNode() as HTMLImageElement;

    newItemParams.classList.add('params');

    (this.paramsMultiplyerWrapper as HTMLElement).innerHTML = '';
    (this.itemWrapper as HTMLElement).append(newItem);
    this.paramsMultiplyerWrapper?.append(newItemParams);

    (this.mario as HTMLImageElement).src = `/../../../../assets/img/sprintGame/gif/${gifName}.gif`;
    (this.mario as HTMLImageElement).onload = () => {
      (this.mario as HTMLImageElement).style.transform = `scale(${scaleNum}, 1)`;
      this.mario?.classList.remove('down');
      this.mario?.classList.remove('small');
      this.mario?.classList.add('up');
    };
    setTimeout(() => {
      this.getDownItem();
    }, Number('3000'));
  }

  private getDownItem() {
    switch (scoreCounter.multiplyer) {
      case 1:
        this.getDownItemHandler('SMWSmallMarioSprite', '3.6');
        break;
      case 2:
        this.getDownItemHandler('SMW_Mario', '4.6');
        break;
      case Number('4'):
        this.getDownItemHandler('SMWCapeMarioSprite', '4.6');
        break;
      case Number('8'):
        this.getDownItemHandler('Green_Yoshi_SMW', '5.6');
        break;
    }
  }

  private getDownItemHandler(pngName: string, imgSize: string) {
    (this.mario as HTMLImageElement).src = `/../../../../assets/img/sprintGame/png/${pngName}.png`;
    (this.mario as HTMLImageElement).onload = () => {
      (this.mario as HTMLImageElement).style.transform = 'scale(1, 1)';
      (this.mario as HTMLImageElement).style.height = `${imgSize}rem`;
      this.mario?.classList.remove('up');
      this.mario?.classList.add('down');
      if (imgSize === '5.6') {
        this.mario?.classList.add('yoshi');
      } else if (imgSize === '3.6') {
        this.mario?.classList.add('small');
      }
      (this.itemWrapper as HTMLElement).innerHTML = '';
    };
  }

  private deleteItemHandler(item: HTMLImageElement | null, pngName: string, imgSize: string) {
    //this.mario?.classList.remove('up');
    this.mario?.classList.remove('yoshi');

    if (item === null) {
      (this.paramsMultiplyerWrapper as HTMLElement).innerHTML = '';
    } else {
      const newItemParams = item.cloneNode() as HTMLImageElement;
      newItemParams.classList.add('params');
      (this.paramsMultiplyerWrapper as HTMLElement).innerHTML = '';
      this.paramsMultiplyerWrapper?.append(newItemParams);
    }

    (this.mario as HTMLImageElement).src = `/../../../../assets/img/sprintGame/png/${pngName}.png`;
    (this.mario as HTMLImageElement).onload = () => {
      (this.mario as HTMLImageElement).style.transform = 'scale(1, 1)';
      (this.mario as HTMLImageElement).style.height = `${imgSize}rem`;
      if (imgSize === '4.6') {
        (this.mario as HTMLImageElement).style.height = '4.6rem';
      } else {
        (this.mario as HTMLImageElement).style.height = '3.6rem';
        this.mario?.classList.add('small');
      }
    };

  }

  private showModalStatistics(): void {
    const modalStatistic = createDiv({
      className: '',
      dataSet: {
        widget: 'modalStatistic',
        parentId: this.id,
        audioIsPlaying: String(audioIsPlaying),
      },
    });
    this.elem.append(modalStatistic);
    updateContent(modalStatistic, modalStatistic.getAttribute('data-widget') as string);
    (this.gamepadWrapper as HTMLElement).style.visibility = 'hidden';
    (this.wordsWrapper as HTMLElement).style.visibility = 'hidden';
  }

  public giveDataToModalStatistic(): IStatisticAnswer[] {
    roundResults = roundResults.map(el => {
      delete el.translateCorrectness;
      return el;
    });
    if (cutRoundResults) roundResults = roundResults.slice(0, roundResults.length - 1);
    this.audioSprint.pause();
    return roundResults;
  }

  public giveScoreToModalStatistic(): number {
    return scoreCounter.score;
  }
}

//TODO:
// 1) LOADER