import BaseComponent from '../../base';
import { createDiv } from '../../../utils';
import { apiService } from '../../../api/apiMethods';
import { WordCard } from '../../../api/api.types';

export default class WordsCard extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'wordsCard';
    this.extraClass = 'wordCard';
  }

  public oninit(): Promise<void> {
    const wordRequest = apiService.getWord(this.elem.dataset.wordId as string);
    return wordRequest.then((word: WordCard) => {

    });
  }

  public createHTML(): void {

  }
}