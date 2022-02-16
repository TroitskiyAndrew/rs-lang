
import { createDiv, createSpan, createButton } from '../../../utils';
import constants from '../../../app.constants';
import BaseComponent from '../../base';
import { instances } from '../../components';
import AudioGame, { IStatisticAnswer } from '../audioGame';
import SprintGame from '../sprintGame';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { getState, updateState } from '../../../state';
import { Statistics, UserWord, DateNumber } from '../../../api/api.types';

export default class ModalStatistic extends BaseComponent {
  resultArray: IStatisticAnswer[] = [];

  rightAnswers: IStatisticAnswer[] = [];

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'modalStatistic';
  }

  public async oninit(): Promise<void> {
    return Promise.resolve();
  }

  public createHTML(): void {
    const parenWidget = instances[this.elem.dataset.parentId as string] as AudioGame | SprintGame;
    this.resultArray = parenWidget.giveDataToModalStatistic();

    this.rightAnswers = this.resultArray.filter(word => {
      return word.answerCorrectness;
    });
    const wrongAnswers = this.resultArray.filter(word => {
      return !word.answerCorrectness;
    });

    // процент правильных ответов
    const totalPercents = constants.hundred;
    let percentOfRightAnswers: number;
    if (this.resultArray.length) {
      percentOfRightAnswers = Math.floor(this.rightAnswers.length * totalPercents / this.resultArray.length);
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
      console.log('Sprint Game');
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
      text: `Знаю - ${this.rightAnswers.length}`,
    });

    const wrongWordsWrapper = createDiv({
      className: 'game-modal__wrong-words',
    });
    const wrongWordsTitle = createSpan({
      className: 'game-modal__words-title',
      text: `Ошибок - ${wrongAnswers.length}`,
    });
    for (let i = 0; i < this.rightAnswers.length; i++) {
      const wordRow = this.drawWord(this.rightAnswers[i]);
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

    // todo if user log in
    if (getState().userId) {
      this.updateUserWordsAndStatistic(parenWidget);
    }

    this.fragment.append(modalWindow);
  }

  async updateUserWordsAndStatistic(game: AudioGame | SprintGame) {
    await this.updateOrCreateUserWords(game);

    await this.updateOrCreateStatistic(game);
  }

  updateObjDate(dateObj: DateNumber | undefined, date: string, dateValue: number): DateNumber {
    if (!dateObj) {
      dateObj = {};
    }

    if (date in dateObj) {
      // такая дата есть в массиве с АПИ, обновляем
      dateObj[date] = dateValue + dateObj[date];
    } else {
      dateObj[date] = dateValue;
    }
    return dateObj;
  }

  updateGameRightRange(rightRangeAudio: number | undefined): number {
    // если значения нет, то возвращаем самую длинную серию с текущей игры
    if (!rightRangeAudio) return this.longestRightRange();
    //  если серия есть, то проверяем ответил юзер на все вопросы верно, если да, то прибавляем все вопросы к существующей цифре
    if (this.rightAnswers.length === this.resultArray.length) {
      return rightRangeAudio = this.rightAnswers.length + rightRangeAudio;
    } else {
      // если не на все вопросы, то сравниваем со значением из АПИ
      return rightRangeAudio > this.longestRightRange() ? rightRangeAudio : this.longestRightRange();
    }
  }

  async updateOrCreateStatistic(game: AudioGame | SprintGame) {
    const userID = getState().userId;
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];
    const userStatisticApi = await apiService.getUserStatistics(userID);
    const allUserWords = await apiService.getAllUserWords(userID);
    if (typeof (allUserWords) === 'number') return;
    const learnedWords = allUserWords.filter(word => word.optional?.learned).length;

    if (typeof (userStatisticApi) !== 'number') {
      const statistics: Partial<Statistics> = {
        learnedWords: learnedWords,
        optional: {},
      };

      // update Statistic
      if (!userStatisticApi.optional || !statistics.optional) return;
      if (game instanceof AudioGame) {
        // correctAnswersAudio per Day
        const currentDateCorrectAnswersAudio = userStatisticApi.optional.correctAnswersAudio;
        statistics.optional.correctAnswersAudio = this.updateObjDate(currentDateCorrectAnswersAudio, date, this.rightAnswers.length);

        statistics.optional.correctAnswersSprint = userStatisticApi.optional.correctAnswersSprint || {};
        // answersAudio per Day
        const currentDateAnswersAudio = userStatisticApi.optional.answersAudio;
        statistics.optional.answersAudio = this.updateObjDate(currentDateAnswersAudio, date, this.resultArray.length);

        statistics.optional.answersSprint = userStatisticApi.optional.answersSprint || {};
        // самая длинная серия правильных ответов
        const rightRangeAllTimeAudio = userStatisticApi.optional.correctAnswersRangeAudio;
        statistics.optional.correctAnswersRangeAudio = this.updateGameRightRange(rightRangeAllTimeAudio);

        statistics.optional.correctAnswersRangeSprint = userStatisticApi.optional.correctAnswersRangeSprint || 0;

        console.log('update Statistic Audio!', statistics);
      } else if (game instanceof SprintGame) {
        // correctAnswersSprint per Day
        const currentDateInCorrectAnswersSprint = userStatisticApi.optional.correctAnswersSprint;
        statistics.optional.correctAnswersSprint = this.updateObjDate(currentDateInCorrectAnswersSprint, date, this.rightAnswers.length);

        statistics.optional.answersAudio = userStatisticApi.optional.answersAudio || {};
        // answersSprint per Day
        const currentDateAnswersSprint = userStatisticApi.optional.answersSprint;
        statistics.optional.answersSprint = this.updateObjDate(currentDateAnswersSprint, date, this.resultArray.length);

        statistics.optional.answersAudio = userStatisticApi.optional.answersAudio || {};
        // самая длинная серия правильных ответов
        const rightRangeAllTimeSprint = userStatisticApi.optional.correctAnswersRangeSprint;
        statistics.optional.correctAnswersRangeSprint = this.updateGameRightRange(rightRangeAllTimeSprint);

        statistics.optional.correctAnswersRangeAudio = userStatisticApi.optional.correctAnswersRangeAudio || 0;

        console.log('update Statistic Sprint!', statistics);
      }

      await apiService.updateUserStatistics(userID, statistics);
    } else {
      // create Statistic
      const correctAnswersPerDayAudio: DateNumber = {};
      const correctAnswersPerDaySprint: DateNumber = {};
      const answersPerDayAudio: DateNumber = {};
      const answersPerDaySprint: DateNumber = {};
      let rightRangeSprint = 0;
      let rightRangeAudio = 0;

      if (game instanceof AudioGame) {
        correctAnswersPerDayAudio[date] = this.rightAnswers.length;
        answersPerDayAudio[date] = this.resultArray.length;
        rightRangeAudio = this.longestRightRange();
      } else if (game instanceof SprintGame) {
        correctAnswersPerDaySprint[date] = this.rightAnswers.length;
        answersPerDaySprint[date] = this.resultArray.length;
        rightRangeSprint = this.longestRightRange();
      }
      const statistics: Partial<Statistics> = {
        learnedWords: learnedWords,
        optional: {
          correctAnswersSprint: correctAnswersPerDaySprint,
          correctAnswersAudio: correctAnswersPerDayAudio,
          answersSprint: answersPerDaySprint,
          answersAudio: answersPerDayAudio,
          correctAnswersRangeSprint: rightRangeSprint,
          correctAnswersRangeAudio: rightRangeAudio,
        },
      };
      console.log('create Statistic', statistics);
      await apiService.updateUserStatistics(userID, statistics);
    }

    const userStatisticAFTER = await apiService.getUserStatistics(userID);
    console.log('userStatisticAFTER', userStatisticAFTER);

  }


  async updateOrCreateUserWords(game: AudioGame | SprintGame): Promise<void> {
    const userID = getState().userId;
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];
    console.log(date);
    // 2022 - 02 - 15; (string)

    await Promise.all(this.resultArray.map(async (wordObj) => {
      // получаем каждое слово
      const userWordResponse = await apiService.getUserWord(userID, wordObj.id);

      if (typeof (userWordResponse) !== 'number') {
        // если оно есть в базе, то обновляем слово
        const userWord = userWordResponse;

        // todo new words/ learned words per date
        // const answersPerDayAudio: DateValue = {};
        // const answersPerDaySprint: DateValue = {};
        // let rightRangeSprint = 0;
        // let rightRangeAudio = 0;

        // if (game instanceof AudioGame) {
        //   correctAnswersPerDayAudio[date] = this.rightAnswers.length;
        //   answersPerDayAudio[date] = this.resultArray.length;
        //   rightRangeAudio = this.longestRightRange();
        // } else if (game instanceof SprintGame) {
        //   correctAnswersPerDaySprint[date] = this.rightAnswers.length;
        //   answersPerDaySprint[date] = this.resultArray.length;
        //   rightRangeSprint = this.longestRightRange();
        // }
        // todo end

        const wordBody: Partial<UserWord> = {
          optional: {
            new: true,
            word: wordObj.word,
          },
        };

        if (!wordBody.optional || !userWord.optional) return;
        if (!wordObj.answerCorrectness) {
          wordBody.optional.rightRange = 0;
          wordBody.optional.learned = false;


        } else if (wordObj.answerCorrectness) {
          let rightWordRange = userWord.optional.rightRange as number;
          wordBody.optional.rightRange = ++rightWordRange;

          if (userWord.difficulty === 'common' && wordBody.optional.rightRange >= constants.wordCommonRightRange) {
            wordBody.optional.learned = true;
          } else if (userWord.difficulty === 'difficult' && wordBody.optional.rightRange >= constants.wordDifficultRightRange) {
            wordBody.difficulty = 'common';
            wordBody.optional.learned = true;
          } else {
            wordBody.optional.learned = false;
          }

          let answersCorrectAllTime = userWord.optional.correctAnswersAllTime;
          if (answersCorrectAllTime) {
            wordBody.optional.correctAnswersAllTime = ++answersCorrectAllTime;
          } else {
            wordBody.optional.correctAnswersAllTime = 1;
          }
        }

        let answersAmountAllTime = userWord.optional.answersAllTime;
        if (answersAmountAllTime) {
          wordBody.optional.answersAllTime = ++answersAmountAllTime;
        } else {
          wordBody.optional.answersAllTime = 1;
        }

        console.log('wordBody', wordBody);
        /*
        id: "620beda78c949d0016735d50"
        wordId: "5e9f5ee35eb9e72bc21af4b1"
        difficulty: "common"
        optional:
            new: true
            learned: false
            rightRange: 0
            word: "weather"
            correctAnswersAllTime: 0
            answersAllTime: 1
        */

        await apiService.updateUserWord(userID, wordObj.id, wordBody);

      } else {
        // createUserWord
        const defaultWordBody = {
          difficulty: 'common',
          optional: {
            new: true,
            learned: false,
            rightRange: wordObj.answerCorrectness ? 1 : 0,
            word: wordObj.word,
            correctAnswersAllTime: wordObj.answerCorrectness ? 1 : 0,
            answersAllTime: 1,
          },
        };
        await apiService.createUserWord(userID, wordObj.id, defaultWordBody);
      }

    }));

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
