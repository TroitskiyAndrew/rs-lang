
import { createDiv, createSpan, createButton, createInput } from '../../../utils';
import constants from '../../../app.constants';
import BaseComponent from '../../base';
import { instances } from '../../components';
import AudioGame, { IStatisticAnswer } from '../audioGame';
import SprintGame from '../sprintGame';

export default class ModalStatistic extends BaseComponent {

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'modalStatistic';
  }

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

  public createHTML(): void {
    const parenWidget = instances[this.elem.dataset.parentId as string] as AudioGame;
    // const parenWidget = instances[this.elem.dataset.parentId as string] as AudioGame | SprintGame;

    const resultArray = parenWidget.giveDataToModalStatistic();

    const rightAnswers = resultArray.filter(word => {
      return word.answerCorrectness;
    });
    const wrongAnswers = resultArray.filter(word => {
      return !word.answerCorrectness;
    });

    // процент правильных ответов
    const totalPercents = 100;
    const percentOfRightAnswers = Math.floor(rightAnswers.length * totalPercents / resultArray.length);

    // выходные данные
    console.log('resultArray', resultArray);
    console.log('rightAnswers', rightAnswers);
    console.log('wrongAnswers', wrongAnswers);
    console.log('right Percent', percentOfRightAnswers + '%');

    // самая длинная серия правильных ответов
    // const array = [false, false, true, true, false, true, true, true, true, false, false, true, true];
    this.checkLongestRightRange(resultArray);

    const modalWindow = createDiv({
      className: 'game__modal-window',
    });

    this.fragment.append(modalWindow);
  }

  checkLongestRightRange(resultArray: IStatisticAnswer[]) {
    const array = resultArray.map(word => word.answerCorrectness);
    let length: number;
    if (!array.some(e => e === true)) {
      length = 0;
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

    console.log('Sequence length=', length);
    return length;
  }

  public listenEvents(): void {

  }


  close() {
    this.dispose();

  }
}
