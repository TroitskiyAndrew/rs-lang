
import { createDiv, createSpan, createButton } from '../../../utils';
import constants from '../../../app.constants';
import BaseComponent from '../../base';
import { instances } from '../../components';
import AudioGame, { IStatisticAnswer } from '../audioGame';
import SprintGame from '../sprintGame';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { getState, updateState } from '../../../state';
import { UserWord } from '../../../api/api.types';

export default class ModalStatistic extends BaseComponent {
  resultArray: IStatisticAnswer[] = [];

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'modalStatistic';
  }

  public createHTML(): void {
    const parenWidget = instances[this.elem.dataset.parentId as string] as AudioGame | SprintGame;
    this.resultArray = parenWidget.giveDataToModalStatistic();

    const rightAnswers = this.resultArray.filter(word => {
      return word.answerCorrectness;
    });
    const wrongAnswers = this.resultArray.filter(word => {
      return !word.answerCorrectness;
    });

    // процент правильных ответов
    const totalPercents = constants.hundred;
    let percentOfRightAnswers: number;
    if (this.resultArray.length) {
      percentOfRightAnswers = Math.floor(rightAnswers.length * totalPercents / this.resultArray.length);
    } else {
      percentOfRightAnswers = 0;
    }

    const modalWindow = createDiv({
      className: 'game-modal',
    });
    const gameContent = createDiv({
      className: 'game-modal__content',
    });
    const gameInfo = createDiv({
      className: 'game-modal__info',
    });
    const gameInfoLeft = createDiv({
      className: 'game-modal__info-left',
    });
    const gameInfoRight = createDiv({
      className: 'game-modal__info-right',
    });
    const headerGif = createDiv({
      className: 'game-modal__logo-gif',
    });
    const accuracy = createSpan({
      text: `Точность ответов - ${percentOfRightAnswers}%`,
    });
    const inARow = createSpan({
      text: `Правильно подряд - ${this.longestRightRange()}`,
    });
    const totalWords = createSpan({
      text: `Всего слов - ${this.resultArray.length}`,
    });

    if (parenWidget instanceof AudioGame) {
      console.log('AUDIO GAME');
    } else if (parenWidget instanceof SprintGame) {
      const totalScore = createSpan({
        text: `К-во баллов - ${parenWidget.giveScoreToModalStatistic()}`,
      });
      gameInfoRight.append(totalScore);
    }

    const wordsWrapper = createDiv({
      className: 'game-modal__words-wrapper',
    });
    const correctWordsWrapper = createDiv({
      className: 'game-modal__correct-words',
    });
    const correctWordsTitle = createSpan({
      className: 'game-modal__words-title',
      text: `Знаю - ${rightAnswers.length}`,
    });

    const wrongWordsWrapper = createDiv({
      className: 'game-modal__wrong-words',
    });
    const wrongWordsTitle = createSpan({
      className: 'game-modal__words-title',
      text: `Ошибок - ${wrongAnswers.length}`,
    });
    for (let i = 0; i < rightAnswers.length; i++) {
      const wordRow = this.drawWord(rightAnswers[i]);
      correctWordsWrapper.append(wordRow);
    }
    for (let i = 0; i < wrongAnswers.length; i++) {
      const wordRow = this.drawWord(wrongAnswers[i]);
      wrongWordsWrapper.append(wordRow);
    }

    gameContent.append(headerGif);

    gameInfoRight.append(accuracy);
    gameInfoRight.append(inARow);
    gameInfoRight.append(totalWords);
    gameInfoLeft.append(this.createProgress(percentOfRightAnswers));
    gameInfo.append(gameInfoLeft);
    gameInfo.append(gameInfoRight);
    gameContent.append(gameInfo);

    modalWindow.append(gameContent);

    wordsWrapper.append(correctWordsTitle);
    wordsWrapper.append(correctWordsWrapper);
    wordsWrapper.append(wrongWordsTitle);
    wordsWrapper.append(wrongWordsWrapper);

    const navigationModal = createDiv({
      className: 'game-modal__navigation',
    });
    const againBtn = createButton({
      className: 'game-modal__button game-modal__play-again games__link',
      text: 'повторить',
    });
    againBtn.onclick = () => {
      this.close(parenWidget.elem);
      parenWidget.playAgain();
    };

    const toGamesBtn = createButton({
      className: 'game-modal__button game-modal__to-games games__link',
      text: 'к играм',
      dataSet: {
        direction: 'pageGames',
      },
    });

    navigationModal.append(againBtn);
    navigationModal.append(toGamesBtn);


    gameContent.append(wordsWrapper);
    modalWindow.append(gameContent);
    modalWindow.append(navigationModal);

    // todo
    this.updateUserWords();

    this.fragment.append(modalWindow);
  }

  async updateUserWords() {
    const userID = getState().userId;
    // const wordObjID = '5e9f5ee35eb9e72bc21af643';
    // const userWordResponse = await apiService.getUserWord(userID, wordObjID);
    // если его нет в базе (ошибка 404), то создаем слово
    // console.log('userWordResponse', userWordResponse);
    const textObjWords = [
      { id: '620a393f84610d0016232546', difficulty: 'common', wordId: '5e9f5ee35eb9e72bc21af69a' },
      { id: '620a3e2284610d0016232547', difficulty: 'common', wordId: '5e9f5ee35eb9e72bc21af5c5' },
      { id: '620a425a84610d0016232548', difficulty: 'common', wordId: '5e9f5ee35eb9e72bc21af637' },
      {
        difficulty: 'fake',
        id: '620a393f84610d0016232546',
        optional: { new: true, learned: false },
        wordId: '5e9f5ee35eb9e72bc21af691',
      },
    ];
    for await (const word of textObjWords) {
      // let userWordResponse1: number | UserWord;
      const userWordResponse1 = await apiService.getUserWord(userID, word.wordId);

      if (typeof (userWordResponse1) !== 'number') {
        console.log('userWordResponse1RESPONSE', userWordResponse1);
      } else {
        // если его нет в базе (ошибка 404), то создаем слово
        console.log('userWordResponse1NUMBER', userWordResponse1);
      }
    }




    // todo down
    /*     const userID = getState().userId;
        this.resultArray.forEach(async wordObj => {

          try {
            // получаем каждое слово

            const userWordResponse = await apiService.getUserWord(userID, wordObj.id);
            // если его нет в базе (ошибка 404), то создаем слово
            // console.log('userWordResponse', userWordResponse);
            // Couldn't find a(an) user word with: {"wordId":"5e9f5ee35eb9e72bc21af4ae","userId":"620a968d4c676f00163750eb"}

            if (typeof (userWordResponse) == 'number') return;
            // если оно есть в базе, то обновляем слово
            const userWord = userWordResponse;

            const wordBody: Partial<UserWord> = {
              difficulty: userWord.difficulty,
              optional: {},
            };

            if (!wordBody.optional) return;
            if (!wordObj.answerCorrectness) {
              wordBody.optional.rightRange = 0;
              wordBody.optional.learned = false;
            } else if (userWord.optional && wordObj.answerCorrectness) {
              let rightWordRange = userWord.optional.rightRange as number;
              wordBody.optional.rightRange = rightWordRange++;

              if (userWord.difficulty === 'common' && wordBody.optional.rightRange >= constants.wordCommonRightRange) {
                wordBody.optional.learned = true;
              } else if (userWord.difficulty === 'difficult' && wordBody.optional.rightRange >= constants.wordDifficultRightRange) {
                wordBody.optional.learned = true;
              }
            }

            await apiService.updateUserWord(userID, wordObj.id, wordBody);

          } catch (error) {
            console.log('bad request');
            const wordBody = {
              difficulty: 'common',
              optional: {
                new: true,
                learned: false,
                rightRange: wordObj.answerCorrectness ? 1 : 0,
              },
            };
            await apiService.createUserWord(userID, wordObj.id, wordBody);
          }
        }); */
    // todo up
    /*
      export interface UserWord {
        difficulty: 'common' | 'difficult' | string,
        optional?: {
          new?: boolean,
          learned?: boolean,
          rightRange?: number,
        };
      }
        difficulty: "common";
        id: "620a393f84610d0016232546";
        optional: { new: true, learned: false; }
        wordId: "5e9f5ee35eb9e72bc21af69a"; */

    // const crateWord = await apiService.createUserWord(userID, this.resultArray[0].id, wordBody);

    // const newWords =;

    // this.resultArray

    const allUserWords = await apiService.getAllUserWords(userID);
    console.log('userWords', allUserWords);
  }

  drawWord(card: IStatisticAnswer) {
    /*
    interface IStatisticAnswer {
    id: string,
    audio: string,
    group: number,
    image: string,
    page: number,
    word: string,
    wordTranslate: string,
    answerCorrectness: boolean;
  } */
    const wordRow = createDiv({
      className: 'game-modal__word-row modal-row',
    });

    const audioBtn = createButton({
      className: 'modal-row__audio icon-button',
    });
    const audio = new Audio();
    audio.src = `${baseUrl}/${card.audio}`;
    audioBtn.addEventListener('click', () => {
      audio.currentTime = 0;
      audio.play();
    });

    const wordText = createSpan({
      className: 'modal-row__word',
      text: card.word,
    });

    const wordSplit = createSpan({
      className: 'modal-row__split',
      text: '-',
    });

    const wordTranslation = createSpan({
      className: 'modal-row__translation',
      text: card.wordTranslate,
    });

    wordRow.append(audioBtn);
    wordRow.append(wordText);
    wordRow.append(wordSplit);
    wordRow.append(wordTranslation);

    return wordRow;
  }

  longestRightRange() {
    const array = this.resultArray.map(word => word.answerCorrectness);
    let length: number;
    if (!array.some(e => e === true)) {
      return length = 0;
    }

    const res: boolean[] = array.reduce((a, c) => {
      if (a.length && a[a.length - 1][0] === c) {
        a[a.length - 1].push(c);
      } else {
        a.push([c]);
      }
      return a;
    }, [] as boolean[][])
      .filter(arr => arr[0] === true)
      .reduce(function (a, c) {
        return c.length > a.length ? c : a;
      });
    length = res.length;
    return length;
  }

  createProgress(percent: number): HTMLElement {
    const width = 120;
    const height = width;
    const strokeWidth = 4;
    const cx = width / 2;
    const cy = cx;
    const radius = width / 2 - strokeWidth * 2;
    const strokeColor = '#64B5F6';

    const progressBar = createDiv({
      className: 'progress-ring',
    });
    const progressText = createSpan({
      className: 'progress-ring__text',
      text: `${percent}%`,
    });
    const circumference = 2 * Math.PI * radius;
    const fullPercent = constants.hundred;
    const offset = circumference - (percent / fullPercent) * circumference;

    progressBar.innerHTML = `<svg width='${width}' height='${height}'>
      <circle class="progress-ring__circle" stroke="${strokeColor}" stroke-width="${strokeWidth}" cx="${cx}" cy="${cy}" r="${radius}" fill="transparent" stroke-dasharray="${circumference} ${circumference}" stroke-dashoffset="${offset}" />
      </svg>`;

    progressBar.append(progressText);

    return progressBar;
  }

  public listenEvents(): void {

  }


  close(parent: HTMLElement) {
    this.dispose();
    parent.removeChild(this.elem);
  }
}
