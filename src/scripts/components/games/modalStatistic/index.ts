
import { createDiv, createSpan, createButton, createInput } from '../../../utils';
import constants from '../../../app.constants';
import BaseComponent from '../../base';
import { instances } from '../../components';
import AudioGame, { IStatisticAnswer } from '../audioGame';
import SprintGame from '../sprintGame';
import { baseUrl } from '../../../api/apiMethods';

export default class ModalStatistic extends BaseComponent {
  resultArray: IStatisticAnswer[] = [];

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'modalStatistic';
  }

  public createHTML(): void {
    const parenWidget = instances[this.elem.dataset.parentId as string] as AudioGame;
    // const parenWidget = instances[this.elem.dataset.parentId as string] as AudioGame | SprintGame;
    this.resultArray = parenWidget.giveDataToModalStatistic();

    const rightAnswers = this.resultArray.filter(word => {
      return word.answerCorrectness;
    });
    const wrongAnswers = this.resultArray.filter(word => {
      return !word.answerCorrectness;
    });

    if (parenWidget instanceof AudioGame) {
      console.log('AUDIO GAME');
    }

    // процент правильных ответов
    const totalPercents = 100;
    const percentOfRightAnswers = Math.floor(rightAnswers.length * totalPercents / this.resultArray.length);

    // выходные данные
    // console.log('resultArray', this.resultArray);
    // console.log('rightAnswers', rightAnswers);
    // console.log('wrongAnswers', wrongAnswers);
    // console.log('right Percent', percentOfRightAnswers + '%');
    // самая длинная серия правильных ответов
    // console.log('Sequence length=', this.longestRightRange());

    const modalWindow = createDiv({
      className: 'game-modal',
    });
    const gameInfo = createDiv({
      className: 'game-modal__info',
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

    gameInfo.append(accuracy);
    gameInfo.append(inARow);
    gameInfo.append(totalWords);
    modalWindow.append(gameInfo);

    wordsWrapper.append(correctWordsTitle);
    wordsWrapper.append(correctWordsWrapper);
    wordsWrapper.append(wrongWordsTitle);
    wordsWrapper.append(wrongWordsWrapper);

    modalWindow.append(wordsWrapper);

    this.fragment.append(modalWindow);
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

  // В этот раз не получилось, но продолжай тренироваться!


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

  public listenEvents(): void {

  }


  close() {
    this.dispose();

  }
}
