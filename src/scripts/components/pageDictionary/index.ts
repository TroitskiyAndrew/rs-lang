import BaseComponent from '../base';
import { createButton, createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';
import { getState } from '../../state';
import { apiService } from '../../api/apiMethods';
import { WordCard } from '../../api/api.types';


export default class PageDictionary extends BaseComponent {
  wordsHolder: HTMLElement | undefined;

  backGround = createDiv({ className: 'dictionary__backGround' });

  currentWord: number;

  wordElems: HTMLElement[];

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageDictionary';
    this.currentWord = 0;
    this.wordElems = [];
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Словарь' }), this.name);
    const state = getState();
    const wordsList = apiService.getChunkOfWords(state.dictionaryPage, state.dictionaryGroup);

    return wordsList.then((list: WordCard[]): void => {
      const words = new DocumentFragment;
      for (const word of list) {
        const newWord = createDiv({ className: 'dictionary__word', dataSet: { widget: 'wordsCard', wordId: word.id } });
        this.wordElems.push(newWord);
        words.append(newWord);
      }
      const hundred = 100;
      this.backGround.style.width = `${this.wordElems.length * hundred}%`;
      this.wordsHolder?.append(words);
      this.move(0);
    });
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page dictionary' });
    const levels = createDiv({ className: 'dictionary__levels' });
    const wordsList = createDiv({ className: 'dictionary__list' });
    const paginator = createDiv({ className: 'dictionary__paginator paginator' });
    paginator.append(createButton({ className: 'paginator__move icon-button move-left', action: 'moveLeft' }));
    paginator.append(createButton({ className: 'paginator__move icon-button move-right', action: 'moveRight' }));
    this.wordsHolder = createDiv({ className: 'dictionary__holder' });

    this.wordsHolder.append(this.backGround);
    page.append(levels);
    page.append(wordsList);
    wordsList.append(this.wordsHolder);
    wordsList.append(paginator);

    this.fragment.append(page);
  }

  public listenEvents(): void {
    this.elem.addEventListener('click', this.actionHandler.bind(this));
  }

  public setActions(): void {
    this.actions.moveLeft = this.moveLeft;
    this.actions.moveRight = this.moveRight;
  }

  public move(position: number): void {
    const wordsCount = this.wordElems.length;
    (this.elem.querySelector('[data-action="moveRight"]') as HTMLButtonElement).disabled = position === wordsCount;
    (this.elem.querySelector('[data-action="moveLeft"]') as HTMLButtonElement).disabled = this.currentWord === 0;
    if (position >= wordsCount || position < 0) {
      return;
    }
    this.currentWord = position;
    const hundred = 100;
    const fifty = 50;

    for (let i = 0; i < wordsCount; i += 1) {

      this.wordElems[i].style.left = `${((i - this.currentWord) * hundred + fifty)}%`;
    }
    this.backGround.style.left = `${-1 * hundred * this.currentWord}%`;
  }

  public moveLeft(): void {
    this.move(this.currentWord - 1);
  }

  public moveRight(): void {
    this.move(this.currentWord + 1);
  }
}