
import { createDiv, createSpan, createButton, updateObjDate, updateLearnedCounterDate } from '../../../utils';
import constants from '../../../app.constants';
import BaseComponent from '../../base';
import { instances } from '../../components';
import AudioGame, { IStatisticAnswer } from '../audioGame';
import SprintGame from '../sprintGame';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { getState } from '../../../state';
import { Statistics, UserWord, DateNumber } from '../../../api/api.types';

export default class ModalStatistic extends BaseComponent {

  resultArray: IStatisticAnswer[] = [];

  rightAnswers: IStatisticAnswer[] = [];

  audioModalStatistic: HTMLAudioElement = new Audio();

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

    let isEnableSound = false;

    if (parenWidget instanceof AudioGame) {
      // from audio-game
    } else if (parenWidget instanceof SprintGame) {
      const totalScore = createSpan({
        text: `К-во баллов - ${parenWidget.giveScoreToModalStatistic()}`,
      });
      gameInfoRight.append(totalScore);
      isEnableSound = JSON.parse(this.elem.dataset.audioIsPlaying as string);
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
      className: 'game-modal__button game-modal__play-again games__link common-button',
      text: 'повторить',
    });
    againBtn.onclick = () => {
      this.close(parenWidget.elem);
      this.audioModalStatistic.pause();
      parenWidget.playAgain();
    };

    const toGamesBtn = createButton({
      className: 'game-modal__button game-modal__to-games games__link common-button',
      text: 'к играм',
      dataSet: {
        direction: 'pageGames',
      },
    });
    toGamesBtn.onclick = () => {
      this.audioModalStatistic.pause();
    };

    navigationModal.append(againBtn);
    navigationModal.append(toGamesBtn);

    gameContent.append(wordsWrapper);
    modalWindow.append(gameContent);
    modalWindow.append(navigationModal);

    // if user log in
    if (getState().userId) {
      this.updateUserWordsAndStatistic(parenWidget);
    }

    this.playAudioModalStatistic(isEnableSound);

    this.fragment.append(modalWindow);
  }

  private async updateUserWordsAndStatistic(game: AudioGame | SprintGame): Promise<void> {
    await this.updateOrCreateUserWords(game);
    await this.updateOrCreateStatistic(game);
  }

  private updateObjDateLearnedNew(dateObj: DateNumber | undefined, date: string, dateValue: number): DateNumber {
    if (!dateObj) {
      dateObj = {};
    }
    dateObj[date] = dateValue;
    return dateObj;
  }

  private updateGameRightRange(rightRangeAPI: number | undefined): number {
    let rightRange: number;
    // если значения нет, то возвращаем самую длинную серию с текущей игры
    if (!rightRangeAPI) {
      rightRange = this.longestRightRange();
      return rightRange;
    } else {
      rightRange = rightRangeAPI > this.longestRightRange() ? rightRangeAPI : this.longestRightRange();
    }
    return rightRange;
  }


  private async updateOrCreateStatistic(game: AudioGame | SprintGame): Promise<void> {
    const userID = getState().userId;
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];
    const userStatisticApi = await apiService.getUserStatistics(userID);
    const allUserWords = await apiService.getAllUserWords(userID);

    if (typeof (allUserWords) === 'number') return;
    const learnedWords = allUserWords.filter(word => word.optional?.learned).length;
    const newWordsPerDayArray = allUserWords.filter(word => word.optional?.newAtDay === date);
    const newWordsPerDayAudio = newWordsPerDayArray.filter(word => word.optional?.newFrom === 'audioGame').length;
    const newWordsPerDaySprint = newWordsPerDayArray.filter(word => word.optional?.newFrom === 'sprintGame').length;

    if (typeof (userStatisticApi) !== 'number') {
      const statistics: Statistics = {
        learnedWords: learnedWords,
        optional: {},
      };
      // update Statistic
      if (!userStatisticApi.optional || !statistics.optional) return;

      const learnedWordsPerDate = userStatisticApi.optional.learnedWordsPerDate;
      statistics.optional.learnedWordsPerDate = learnedWordsPerDate;

      const newWordsPerDayAudioObj = userStatisticApi.optional.newWordsPerDayAudio;
      statistics.optional.newWordsPerDayAudio = this.updateObjDateLearnedNew(newWordsPerDayAudioObj, date, newWordsPerDayAudio);

      const newWordsPerDaySprintObj = userStatisticApi.optional.newWordsPerDaySprint;
      statistics.optional.newWordsPerDaySprint = this.updateObjDateLearnedNew(newWordsPerDaySprintObj, date, newWordsPerDaySprint);

      if (game instanceof AudioGame) {
        // correctAnswersAudio per Day
        const currentDateCorrectAnswersAudio = userStatisticApi.optional.correctAnswersAudio;
        statistics.optional.correctAnswersAudio = updateObjDate(currentDateCorrectAnswersAudio, this.rightAnswers.length);

        statistics.optional.correctAnswersSprint = userStatisticApi.optional.correctAnswersSprint || {};
        // answersAudio per Day
        const currentDateAnswersAudio = userStatisticApi.optional.answersAudio;
        statistics.optional.answersAudio = updateObjDate(currentDateAnswersAudio, this.resultArray.length);

        statistics.optional.answersSprint = userStatisticApi.optional.answersSprint || {};
        // самая длинная серия правильных ответов
        const rightRangeAllTimeAudio = userStatisticApi.optional.correctAnswersRangeAudio;
        const rightRange = this.updateGameRightRange(rightRangeAllTimeAudio);
        statistics.optional.correctAnswersRangeAudio = rightRange;

        statistics.optional.correctAnswersRangeSprint = userStatisticApi.optional.correctAnswersRangeSprint || 0;
      } else if (game instanceof SprintGame) {
        // correctAnswersSprint per Day
        const currentDateInCorrectAnswersSprint = userStatisticApi.optional.correctAnswersSprint;
        statistics.optional.correctAnswersSprint = updateObjDate(currentDateInCorrectAnswersSprint, this.rightAnswers.length);

        statistics.optional.correctAnswersAudio = userStatisticApi.optional.correctAnswersAudio || {};
        // answersSprint per Day
        const currentDateAnswersSprint = userStatisticApi.optional.answersSprint;
        statistics.optional.answersSprint = updateObjDate(currentDateAnswersSprint, this.resultArray.length);

        statistics.optional.answersAudio = userStatisticApi.optional.answersAudio || {};
        // самая длинная серия правильных ответов
        const rightRangeAllTimeSprint = userStatisticApi.optional.correctAnswersRangeSprint;
        const rightRange = this.updateGameRightRange(rightRangeAllTimeSprint);
        statistics.optional.correctAnswersRangeSprint = rightRange;

        statistics.optional.correctAnswersRangeAudio = userStatisticApi.optional.correctAnswersRangeAudio || 0;
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

      const statistics: Statistics = {
        learnedWords: learnedWords,
        optional: {
          correctAnswersSprint: correctAnswersPerDaySprint,
          correctAnswersAudio: correctAnswersPerDayAudio,
          answersSprint: answersPerDaySprint,
          answersAudio: answersPerDayAudio,
          correctAnswersRangeSprint: rightRangeSprint,
          correctAnswersRangeAudio: rightRangeAudio,
          learnedWordsPerDate: { date: learnedWords },
        },
      };
      if (!statistics.optional) return;

      const newWordsPerDayAudioObj = {};
      statistics.optional.newWordsPerDayAudio = this.updateObjDateLearnedNew(newWordsPerDayAudioObj, date, newWordsPerDayAudio);

      const newWordsPerDaySprintObj = {};
      statistics.optional.newWordsPerDaySprint = this.updateObjDateLearnedNew(newWordsPerDaySprintObj, date, newWordsPerDaySprint);

      await apiService.updateUserStatistics(userID, statistics);
    }
  }

  private async updateOrCreateUserWords(game: AudioGame | SprintGame): Promise<void> {
    const userID = getState().userId;
    const currentDate = new Date();
    const date = currentDate.toISOString().split('T')[0];

    const apiStatistic = await apiService.getUserStatistics(userID);
    const defaultStatistic: Statistics = {
      learnedWords: 0,
      optional: {
        learnedWordsPerDate: updateObjDate(undefined, 0),
      },
    };
    const statistic = typeof apiStatistic !== 'number' ? apiStatistic : defaultStatistic;

    await Promise.all(this.resultArray.map(async (wordObj) => {
      // получаем каждое слово
      const userWordResponse = await apiService.getUserWord(userID, wordObj.id);
      let gameFrom: 'audioGame' | 'sprintGame' = 'audioGame';
      if (game instanceof AudioGame) {
        gameFrom = 'audioGame';
      } else if (game instanceof SprintGame) {
        gameFrom = 'sprintGame';
      }

      if (typeof (userWordResponse) !== 'number') {
        // обновляем слово
        const userWord = userWordResponse;
        const wordBody: UserWord = {
          difficulty: userWord.difficulty,
          optional: {
            new: true,
            word: wordObj.word,
            newAtDay: userWord.optional?.newAtDay ? userWord.optional?.newAtDay : date,
            newFrom: userWord.optional?.newFrom ? userWord.optional?.newFrom : gameFrom,
          },
        };

        if (!wordBody.optional || !userWord.optional) return;
        const isLearnedBefore = userWord.optional?.learned ? userWord.optional?.learned : false;
        let change = 0;

        if (!wordObj.answerCorrectness) {
          wordBody.optional.rightRange = 0;
          wordBody.optional.learned = false;
          change = updateLearnedCounterDate(isLearnedBefore, false);
        } else if (wordObj.answerCorrectness) {
          let rightWordRange = userWord.optional.rightRange as number;
          wordBody.optional.rightRange = ++rightWordRange;

          if (userWord.difficulty === 'common' && wordBody.optional.rightRange >= constants.wordCommonRightRange) {
            wordBody.optional.learned = true;
            change = updateLearnedCounterDate(isLearnedBefore, true);
          } else if (userWord.difficulty === 'difficult' && wordBody.optional.rightRange >= constants.wordDifficultRightRange) {
            wordBody.difficulty = 'common';
            wordBody.optional.learned = true;
            change = updateLearnedCounterDate(isLearnedBefore, true);
          } else if (userWord.optional?.learned) {
            wordBody.optional.learned = true;
            change = updateLearnedCounterDate(isLearnedBefore, true);
          } else {
            wordBody.optional.learned = false;
            change = updateLearnedCounterDate(isLearnedBefore, false);
          }

          let answersCorrectAllTime = userWord.optional.correctAnswersAllTime;
          if (answersCorrectAllTime) {
            wordBody.optional.correctAnswersAllTime = ++answersCorrectAllTime;
          } else {
            wordBody.optional.correctAnswersAllTime = 1;
          }
        }

        statistic.optional.learnedWordsPerDate = updateObjDate(statistic.optional.learnedWordsPerDate, change);
        if (statistic.id) {
          delete statistic.id;
        }
        await apiService.updateUserStatistics(userID, statistic);

        let answersAmountAllTime = userWord.optional.answersAllTime;
        if (answersAmountAllTime) {
          wordBody.optional.answersAllTime = ++answersAmountAllTime;
        } else {
          wordBody.optional.answersAllTime = 1;
        }
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
            newAtDay: date,
            newFrom: gameFrom,
          },
        };
        await apiService.createUserWord(userID, wordObj.id, defaultWordBody);
      }
    }));
  }

  private drawWord(card: IStatisticAnswer): HTMLElement {
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

  private longestRightRange(): number {
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

  private createProgress(percent: number): HTMLElement {
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

  private close(parent: HTMLElement): void {
    this.dispose();
    parent.removeChild(this.elem);
  }

  private playAudioModalStatistic(status: boolean): void {
    if (status) {
      this.audioModalStatistic.src = '../../../../assets/sounds/22 - Course Clear Fanfare.mp3';
      this.audioModalStatistic.play();
    }
  }

}
