
import { createDiv, createSpan, createButton, createInput } from '../../../utils';
import constants from '../../../app.constants';
import BaseComponent from '../../base';
import { instances } from '../../components';
import AudioGame from '../audioGame';
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

    console.log(resultArray);

    const modalWindow = createDiv({
      className: 'game__modal-window',
    });

    this.fragment.append(modalWindow);
  }

  public listenEvents(): void {

  }

}
