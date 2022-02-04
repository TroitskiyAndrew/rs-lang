import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';
import { getState } from '../../state';
import { apiService } from '../../api/apiMethods';
import { WordCard } from '../../api/api.types';


export default class PageDictionary extends BaseComponent {
  wordsHolder: HTMLElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageDictionary';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Словарь' }), this.name);
    const state = getState();
    const wordsList = apiService.getChunkOfWords(state.dictionaryPage, state.dictionaryGroup);

    return wordsList.then((list: WordCard[]): void => {
      const words = new DocumentFragment;
      for (const word of list) {
        words.append(createDiv({ className: 'dictionary__word', dataSet: { widget: 'wordsCard', wordId: word.id } }));
      }
      this.wordsHolder?.append(words);
    });
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page dictionary' });
    const levels = createDiv({ className: 'dictionary__levels' });
    const wordsList = createDiv({ className: 'dictionary__list' });
    const paginator = createDiv({ className: 'dictionary__paginator' });
    this.wordsHolder = createDiv({ className: 'dictionary__holder' });


    page.append(levels);
    page.append(wordsList);
    wordsList.append(this.wordsHolder);
    wordsList.append(paginator);

    this.fragment.append(page);
  }
}