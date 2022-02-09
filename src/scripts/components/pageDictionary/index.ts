import BaseComponent from '../base';
import { createButton, createDiv, createInput, createSpan } from '../../utils';
import { pageChenging, disposeElem, updateContent } from '../../rooting';
import { getState, updateState } from '../../state';
import { apiService } from '../../api/apiMethods';
import { WordCard } from '../../api/api.types';
import constants from '../../app.constants';
import { instances } from '../components';
import FlagPole from '../flagPole';


export default class PageDictionary extends BaseComponent {
  page: HTMLElement = createDiv({ className: 'page dictionary' });

  wordsHolder: HTMLElement = createDiv({ className: 'dictionary__holder' });

  backGround: HTMLElement = createDiv({ className: 'dictionary__backGround' });

  mario: HTMLElement = createDiv({ className: 'dictionary__mario' });

  gamesButtonsHolder: HTMLElement = createDiv({ className: 'dictionary__games' });

  currentWord: number;

  wordElems: HTMLElement[];

  goInput: HTMLInputElement = createInput({ className: 'paginator__mover', type: 'range' });

  paginator: HTMLDivElement = createDiv({ className: 'dictionary__paginator paginator' });

  pageSelector: HTMLSelectElement = document.createElement('select');

  currGroup = 0;

  currPage = 0;

  updating = false;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageDictionary';
    this.currentWord = 0;
    this.wordElems = [];
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Словарь' }), this.name);
    return this.updateDictionary();
  }

  public createHTML(): void {
    const stepControl = createDiv({ className: 'dictionary__stepControl stepControl' });
    const contorol = createDiv({ className: 'dictionary__control' });
    const level = createDiv({ className: 'dictionary__level', dataSet: { widget: 'flagPole' } });

    this.setPageSelector();
    this.paginator.append(createButton({ className: 'paginator__button icon-button prevPage', action: 'prevPage' }));
    this.paginator.append(this.pageSelector);
    this.paginator.append(createButton({ className: 'paginator__button icon-button nextPage', action: 'nextPage' }));

    this.gamesButtonsHolder.append(createButton({ className: 'dictionary__game-button', text: 'АудиоСпринт', dataSet: { direction: 'audioGame' } }));
    this.gamesButtonsHolder.append(createButton({ className: 'dictionary__game-button', text: 'Спринт', dataSet: { direction: 'sprintGame' } }));

    stepControl.append(createButton({ className: 'stepControl__step icon-button step-back', action: 'stepBack' }));
    stepControl.append(this.goInput);
    stepControl.append(createButton({ className: 'stepControl__step icon-button step-forward', action: 'stepForward' }));

    contorol.append(this.paginator);
    contorol.append(level);
    contorol.append(this.gamesButtonsHolder);
    this.wordsHolder.append(createDiv({ className: 'dictionary__wall' }));
    this.wordsHolder.append(this.mario);
    this.wordsHolder.append(this.backGround);
    this.wordsHolder.append(stepControl);
    this.page.append(contorol);
    this.page.append(this.wordsHolder);
    this.fragment.append(this.page);
  }

  public listenEvents(): void {
    this.page.addEventListener('click', this.actionHandler.bind(this));
    this.goInput.addEventListener('change', this.goComand.bind(this));
    this.pageSelector.addEventListener('input', this.changePage.bind(this));
    this.page.addEventListener('change-flag', this.groupChangeFromFlag.bind(this));
  }

  public setActions(): void {
    this.actions.stepBack = this.stepBack;
    this.actions.stepForward = this.stepForward;
    this.actions.prevPage = this.prevPage;
    this.actions.nextPage = this.nextPage;
  }

  private updateDictionary(): Promise<void> {
    this.updating = true;
    this.removeWords();
    const state = getState();
    this.currGroup = state.dictionaryGroup;
    this.currPage = state.dictionaryPage;
    const wordsList = apiService.getChunkOfWords(this.currPage, this.currGroup);

    this.updateButtons();

    return wordsList.then((list: WordCard[]): void => {
      const words = new DocumentFragment;
      for (const word of list) {
        const newWord = createDiv({ className: 'dictionary__word', dataSet: { widget: 'wordsCard', wordId: word.id } });
        updateContent(newWord, newWord.getAttribute('data-widget') as string);
        this.wordElems.push(newWord);
        words.append(newWord);
      }
      this.setGoInput();
      this.setPaginator();
      this.backGround.style.width = `${this.wordElems.length * constants.hundred}%`;
      this.wordsHolder?.append(words);
      this.go(0);

      this.updating = false;
    });
  }

  private removeWords(): void {
    disposeElem(this.wordsHolder);
    for (const word of this.wordElems) {
      this.wordsHolder.removeChild(word);
    }
    this.wordElems = [];
  }

  private updateButtons(): void {
    const buttons: NodeListOf<HTMLButtonElement> = this.gamesButtonsHolder.querySelectorAll('button');
    for (const button of buttons) {
      button.dataset.options = JSON.stringify({
        group: this.currGroup,
        page: this.currPage,
      });
    }
  }

  public go(position: number): void {
    const wordsCount = this.wordElems.length;
    (this.elem.querySelector('[data-action="stepBack"]') as HTMLButtonElement).disabled = position === 0;
    (this.elem.querySelector('[data-action="stepForward"]') as HTMLButtonElement).disabled = position >= wordsCount - 1;
    if (position >= wordsCount || position < 0) {
      return;
    }
    if (position > this.currentWord) {
      this.marioTurn(true);
    } else {
      this.marioTurn(false);
    }
    if (position !== this.currentWord) {
      this.marioJump();
    }

    this.currentWord = position;
    this.goInput.value = String(position);
    for (let i = 0; i < wordsCount; i += 1) {

      this.wordElems[i].style.left = `${((i - this.currentWord) * constants.hundred + constants.hundred / 2)}%`;
    }
    this.backGround.style.left = `${-1 * constants.hundred * this.currentWord}%`;


  }

  public stepBack(): void {
    this.go(this.currentWord - 1);
  }

  public stepForward(): void {
    this.go(this.currentWord + 1);
  }

  private setGoInput(): void {
    this.goInput.step = String(1);
    this.goInput.min = String(0);
    this.goInput.max = String(this.wordElems.length - 1);
    this.goInput.value = String(0);
  }

  private goComand(): void {
    const value = Number(this.goInput.value);

    this.go(value);
  }

  private setPageSelector(): void {
    this.pageSelector.classList.add('paginator__selector');
    this.pageSelector.id = 'pageSelector';
    for (let i = 0; i <= constants.maxWordsPage; i += 1) {
      const newOption = document.createElement('option') as HTMLOptionElement;
      newOption.value = String(i);
      newOption.textContent = `Страница #${i + 1}`;
      this.pageSelector.append(newOption);
    }

  }

  private setPaginator(): void {
    if (String(this.currGroup) === '6') {
      this.paginator.classList.add('hidden');
    } else {
      this.paginator.classList.remove('hidden');
      this.pageSelector.value = String(this.currPage);
      (this.elem.querySelector('[data-action="prevPage"]') as HTMLButtonElement).disabled = this.currPage === 0;
      (this.elem.querySelector('[data-action="nextPage"]') as HTMLButtonElement).disabled = this.currPage === constants.maxWordsPage;
    }
  }

  private prevPage(): void {
    this.goToPage(this.currPage - 1);
  }

  private nextPage(): void {
    this.goToPage(this.currPage + 1);
  }

  private goToPage(page: number): void {
    if (page < 0 || page > constants.maxWordsPage || this.updating) {
      return;
    }

    this.pageSelector.value = String(page);
    updateState({ dictionaryPage: page });
    this.updateDictionary();
  }

  private changePage(): void {
    const newPage = Number(this.pageSelector.value);
    this.goToPage(newPage);
  }

  private groupChangeFromFlag(ev: Event): void {
    if (this.updating) {
      return;
    }
    const target = ev.target as HTMLElement;
    const widgetId = target.dataset.widgetId as string;
    const widget = instances[widgetId] as FlagPole;
    updateState({ dictionaryGroup: Number(widget.value), dictionaryPage: 0 });
    this.updateDictionary();
  }

  private marioJump() {
    this.mario.classList.add('_moving');
    setTimeout((): void => { this.mario.classList.remove('_moving'); }, Number('1000'));
  }

  private marioTurn(forward: boolean): void {
    if (forward) {
      this.mario.classList.remove('_reversed');
    } else {
      this.mario.classList.add('_reversed');
    }
  }
}