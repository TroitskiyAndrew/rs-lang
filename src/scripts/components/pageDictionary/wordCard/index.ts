import BaseComponent from '../../base';
import { createButton, createDiv } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { WordCard } from '../../../api/api.types';
import { getState } from '../../../state';

export default class WordsCard extends BaseComponent {
  wordId = '';

  userId = '';

  word: HTMLElement = createDiv({ className: 'wordCard__word' });

  wordRu: HTMLElement = createDiv({ className: 'wordCard__word' });

  meaning: HTMLElement = createDiv({ className: 'wordCard__meaning' });

  meaningRu: HTMLElement = createDiv({ className: 'wordCard__meaning' });

  example: HTMLElement = createDiv({ className: 'wordCard__example' });

  exampleRu: HTMLElement = createDiv({ className: 'wordCard__example' });

  transcription: HTMLElement = createDiv({ className: 'wordCard__transcription' });

  img: HTMLImageElement = new Image();

  file: string;

  visibility = false;

  difficult = false;

  studied = false;


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'wordsCard';
    this.extraClass = 'wordCard';
    this.file = '';
    this.wordId = this.elem.dataset.wordId as string;
    this.userId = getState().userId;
  }

  public async oninit(): Promise<void> {
    const wordRequest = apiService.getWord(this.wordId);

    return wordRequest.then((word: WordCard) => {
      const match = word.image.match(/\d*_\d*/);

      if (match) {
        this.file = match[0] as string;
      }

      this.word.innerHTML += word.word;
      this.wordRu.innerHTML += word.wordTranslate;
      this.meaning.innerHTML += word.textMeaning;
      this.meaningRu.innerHTML += word.textMeaningTranslate;
      this.example.innerHTML += word.textExample;
      this.exampleRu.innerHTML += word.textExampleTranslate;
      this.transcription.innerHTML += word.transcription;

      this.img.src = `${baseUrl}/files/${this.file}.jpg`;

      this.changeStatus();
    });
  }

  public createHTML(): void {
    const textHolder = createDiv({ className: 'wordCard__text-holder' });
    const engHolder = createDiv({ className: 'wordCard__text-part _eng' });
    const ruHolder = createDiv({ className: 'wordCard__text-part _ru' });
    const contorls = createDiv({ className: 'wordCard__controls' });
    const contorlsHolder = createDiv({ className: 'wordCard__controls-holder' });

    contorls.append(this.createButtonBlock('visibility', 'Показать/скрыть перевод'));
    contorls.append(this.createButtonBlock('difficult', 'Добавить/убрать из списка сложных слов'));
    contorls.append(this.createButtonBlock('studied', 'Добавить/убрать из списка выученных слов'));

    this.img.classList.add('wordCard__img');
    ruHolder.append(createDiv({ className: 'bricks' }));
    engHolder.append(this.word);
    engHolder.append(this.transcription);
    engHolder.append(this.meaning);
    engHolder.append(this.example);
    ruHolder.append(this.wordRu);
    ruHolder.append(this.meaningRu);
    ruHolder.append(this.exampleRu);
    textHolder.append(engHolder);
    textHolder.append(ruHolder);
    this.fragment.append(textHolder);
    contorlsHolder.append(this.img);
    contorlsHolder.append(contorls);
    this.word.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayWord' }));
    this.example.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayExample' }));
    this.meaning.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayMeaning' }));
    this.fragment.append(contorlsHolder);

  }

  private createButtonBlock(type: string, hint: string): HTMLDivElement {
    const block = createDiv({ className: `wordCard__button-block button-block ${type}` });
    block.setAttribute('title', hint);

    block.append(createDiv({ className: 'button-block__circle left-top' }));
    block.append(createDiv({ className: 'button-block__circle left-bottom' }));
    block.append(createDiv({ className: 'button-block__circle right-top' }));
    block.append(createDiv({ className: 'button-block__circle right-bottom' }));
    block.append(createButton({ className: `button-block__button icon-button btn-${type}`, action: `${type}` }));

    return block;
  }

  public listenEvents(): void {
    this.elem.addEventListener('click', this.actionHandler.bind(this));
  }

  public setActions(): void {
    this.actions.sayWord = this.sayWord;
    this.actions.sayExample = this.sayExample;
    this.actions.sayMeaning = this.sayMeaning;
    this.actions.visibility = this.toggleVisibility;
    this.actions.difficult = this.toggleDifficult;
    this.actions.studied = this.toggleStudied;
  }

  private sayWord(): void {
    const url = `${baseUrl}/files/${this.file}.mp3`;

    this.playAudio(url);
  }

  private sayExample(): void {
    const url = `${baseUrl}/files/${this.file}_example.mp3`;

    this.playAudio(url);
  }

  private sayMeaning(): void {
    const url = `${baseUrl}/files/${this.file}_meaning.mp3`;

    this.playAudio(url);
  }

  private toggleVisibility(): void {
    this.visibility = !this.visibility;
    // this.changeStatus();
    if (this.visibility) {
      this.sendEvent('button-pressed');
      setTimeout(this.changeStatus.bind(this), Number('500'));
    } else {
      this.changeStatus();
    }
  }

  private toggleDifficult(): void {
    this.difficult = !this.difficult;
    if (this.difficult) {
      apiService.createUserWord(this.userId, this.wordId, {
        difficulty: 'difficult',
      });
    } else {
      apiService.deleteUserWord(this.userId, this.wordId);
    }
    this.changeStatus();
  }

  private toggleStudied(): void {
    this.studied = !this.studied;
    if (this.studied) {
      apiService.createUserWord(this.userId, this.wordId, {
        difficulty: 'studied',
      });
    } else {
      apiService.deleteUserWord(this.userId, this.wordId);
    }
    this.changeStatus();
  }

  private changeStatus(): void {
    if (this.visibility) {
      this.elem.classList.add('_visible-translate');
      (this.elem.querySelector('.button-block.visibility') as HTMLElement).classList.add('_active');
    } else {
      this.elem.classList.remove('_visible-translate');
      (this.elem.querySelector('.button-block.visibility') as HTMLElement).classList.remove('_active');
    }
    if (this.difficult) {
      this.elem.classList.add('_difficult');
      (this.elem.querySelector('.button-block.difficult') as HTMLElement).classList.add('_active');
    } else {
      this.elem.classList.remove('_difficult');
      (this.elem.querySelector('.button-block.difficult') as HTMLElement).classList.remove('_active');
    }
    if (this.studied) {
      this.elem.classList.add('_studied');
      (this.elem.querySelector('.button-block.studied') as HTMLElement).classList.add('_active');
    } else {
      this.elem.classList.remove('_studied');
      (this.elem.querySelector('.button-block.studied') as HTMLElement).classList.remove('_active');
    }
  }

}