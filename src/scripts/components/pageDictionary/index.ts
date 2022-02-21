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

  goInput: HTMLInputElement = createInput({ className: 'stepControl__mover', type: 'range' });

  paginator: HTMLDivElement = createDiv({ className: 'dictionary__paginator paginator' });

  pageSelector: HTMLSelectElement = document.createElement('select');

  currGroup = 0;

  currPage = 0;

  wordsOnPage = 0;

  learnedWordsCount = 0;

  pageCode = '';

  updating = false;

  userId = '';

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
    const level = createDiv({ className: 'dictionary__level', dataSet: { widget: 'flagPole', fromDictionary: 'true' } });

    this.pageSelector.classList.add('paginator__selector');
    this.pageSelector.id = 'pageSelector';
    this.paginator.append(createButton({ className: 'paginator__button icon-button sega-button prevPage', action: 'prevPage' }));
    this.paginator.append(this.pageSelector);
    this.paginator.append(createButton({ className: 'paginator__button icon-button sega-button nextPage', action: 'nextPage' }));

    this.gamesButtonsHolder.append(createButton({ className: 'dictionary__game-button common-button', text: 'Аудио', dataSet: { direction: 'audioGame' } }));
    this.gamesButtonsHolder.append(createButton({ className: 'dictionary__game-button common-button', text: 'Спринт', dataSet: { direction: 'sprintGame' } }));

    stepControl.append(createButton({ className: 'stepControl__step icon-button sega-button step-back', action: 'stepBack' }));
    stepControl.append(this.goInput);
    stepControl.append(createButton({ className: 'stepControl__step icon-button sega-button step-forward', action: 'stepForward' }));

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
    this.page.addEventListener('button-pressed', this.marioJump.bind(this));
    this.page.addEventListener('wordSetLerned', this.wordSetLerned.bind(this));
    this.page.addEventListener('wordSetNotLerned', this.wordSetNotLerned.bind(this));
  }

  public setActions(): void {
    this.actions.stepBack = this.stepBack;
    this.actions.stepForward = this.stepForward;
    this.actions.prevPage = this.prevPage;
    this.actions.nextPage = this.nextPage;
  }

  private updateDictionary(): Promise<void> {
    this.updating = true;
    this.wordsOnPage = 0;
    this.learnedWordsCount = 0;
    this.removeWords();
    const state = getState();
    this.userId = state.userId;
    this.currGroup = state.dictionaryGroup;
    this.currPage = state.dictionaryPage;
    this.pageCode = `g${this.currGroup}p${this.currPage}`;
    this.updateSelectOption();
    this.gamesButtonsControl(this.currGroup == constants.learnedGroup);
    const ms = 1000;
    const stepTime = `${constants.junmpAnimationTimeDictionary / ms}s`;

    this.mario.style.animationDuration = stepTime;
    this.backGround.style.transitionDuration = stepTime;

    this.updateButtons();

    const wordsList = this.currGroup <= constants.maxWordsGroup ? apiService.getChunkOfWords(this.currPage, this.currGroup) :
      apiService.getAllUserAggregatedWords(this.userId, this.currGroup === constants.difficultGroup ? '{"userWord.difficulty":"difficult"}' : '{"userWord.optional.learned":true}');
    return wordsList.then((list: WordCard[] | number): void => {
      if (typeof list === 'number') {
        return;
      }
      const words = new DocumentFragment;

      this.wordsOnPage = list.length;
      for (const word of list) {
        const newWord = createDiv({ className: 'dictionary__word', dataSet: { widget: 'wordsCard', wordId: word.id || word._id as string } });
        newWord.style.transitionDuration = stepTime;
        updateContent(newWord, newWord.getAttribute('data-widget') as string);
        this.wordElems.push(newWord);
        words.append(newWord);
      }
      this.setGoInput();
      this.setPaginator();
      this.backGround.style.width = `${(this.wordElems.length) * constants.hundred}%`;
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
        fromDictionary: true,
      });
    }
  }

  private wordSetLerned(): void {
    this.learnedWordsCount += 1;
    if (this.learnedWordsCount === this.wordsOnPage) {
      const learnedPages = getState().learnedPages;
      if (!learnedPages.includes(this.pageCode)) {
        learnedPages.push(this.pageCode);
        updateState({ learnedPages: learnedPages });
      }
      this.gamesButtonsControl(true);
      (this.paginator.querySelector(`[value="${this.currPage}"]`) as HTMLElement).classList.add('_learned');
    }
  }

  private wordSetNotLerned(): void {
    if (this.learnedWordsCount === this.wordsOnPage) {
      const learnedPages = getState().learnedPages;
      const index = learnedPages.indexOf(this.pageCode);
      learnedPages.splice(index, 1);
      updateState({ learnedPages: learnedPages });
      this.gamesButtonsControl(false);
    }
    (this.paginator.querySelector(`[value="${this.currPage}"]`) as HTMLElement).classList.remove('_learned');
    this.learnedWordsCount -= 1;
  }

  private gamesButtonsControl(disable: boolean): void {
    const buttons: NodeListOf<HTMLButtonElement> = this.gamesButtonsHolder.querySelectorAll('button');
    for (const button of buttons) {
      button.disabled = disable;
    }
  }

  private updateSelectOption(): void {
    this.pageSelector.innerHTML = '';
    for (let i = 0; i <= constants.maxWordsPage; i += 1) {
      const newOption = document.createElement('option') as HTMLOptionElement;
      const learnedPages = getState().learnedPages;
      if (learnedPages.includes(`g${this.currGroup}p${i}`)) {
        newOption.classList.add('_learned');
      }
      newOption.value = String(i);
      newOption.textContent = `Стр. #${i + 1}`;
      this.pageSelector.append(newOption);

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

  private setPaginator(): void {
    if (this.currGroup > constants.maxWordsGroup) {
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
    setTimeout((): void => { this.mario.classList.remove('_moving'); }, constants.junmpAnimationTimeDictionary);
  }

  private marioTurn(forward: boolean): void {
    if (forward) {
      this.mario.classList.remove('_reversed');
    } else {
      this.mario.classList.add('_reversed');
    }
  }

  public giveMeData(): string {
    return 'some Data';
  }
}