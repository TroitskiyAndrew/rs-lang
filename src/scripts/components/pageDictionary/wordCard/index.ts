import BaseComponent from '../../base';
import { createButton, createDiv } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { WordCard } from '../../../api/api.types';
import { instances } from '../../components';
import PageDictionary from '..';

export default class WordsCard extends BaseComponent {
  word: HTMLElement = createDiv({ className: 'wordCard__word' });

  wordRu: HTMLElement = createDiv({ className: 'wordCard__wordRu' });

  meaning: HTMLElement = createDiv({ className: 'wordCard__meaning' });

  meaningRu: HTMLElement = createDiv({ className: 'wordCard__meaningRu' });

  example: HTMLElement = createDiv({ className: 'wordCard__example' });

  exampleRu: HTMLElement = createDiv({ className: 'wordCard__exampleRu' });

  transcription: HTMLElement = createDiv({ className: 'wordCard__transcription' });

  img: HTMLImageElement = new Image();

  file: string;


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'wordsCard';
    this.extraClass = 'wordCard';
    this.file = '';
  }

  public oninit(): Promise<void> {
    const wordRequest = apiService.getWord(this.elem.dataset.wordId as string);
    return wordRequest.then((word: WordCard) => {
      const match = word.image.match(/\d*_\d*/);

      if (match) {
        this.file = match[0] as string;
      }

      this.word.innerHTML = word.word;
      this.wordRu.innerHTML = word.wordTranslate;
      this.meaning.innerHTML = word.textMeaning;
      this.meaningRu.innerHTML = word.textMeaningTranslate;
      this.example.innerHTML = word.textExample;
      this.exampleRu.innerHTML = word.textExampleTranslate;
      this.transcription.innerHTML = word.transcription;

      this.img.src = `${baseUrl}/files/${this.file}.jpg`;

      this.word.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayWord' }));
      this.example.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayExample' }));
      this.meaning.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayMeaning' }));
    });
  }

  public createHTML(): void {
    const textHolder = createDiv({ className: 'wordCard__text-holder' });
    const engHolder = createDiv({ className: 'wordCard__text-part _eng' });
    const ruHolder = createDiv({ className: 'wordCard__text-part _ru' });
    const contorls = createDiv({ className: 'wordCard__controls' });
    const contorlsHolder = createDiv({ className: 'wordCard__controls-holder' });

    contorls.append(this.createButtonHolder('visibility'));
    contorls.append(this.createButtonHolder('difficult'));
    contorls.append(this.createButtonHolder('studied'));

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
    this.fragment.append(contorlsHolder);

  }

  private createButtonHolder(type: string): HTMLDivElement {
    const holder = createDiv({ className: `wordCard__button-block button-block ${type}` });
    const overlay = createDiv({ className: 'button-block__overlay' });
    const marker = createDiv({ className: 'button-block__marker' });

    holder.append(marker);
    holder.append(overlay);
    overlay.append(createDiv({ className: 'button-block__circle left-top' }));
    overlay.append(createDiv({ className: 'button-block__circle left-bottom' }));
    overlay.append(createDiv({ className: 'button-block__circle right-top' }));
    overlay.append(createDiv({ className: 'button-block__circle right-bottom' }));
    holder.append(createButton({ className: `button-block__button icon-button btn-${type}`, action: `${type}` }));

    return holder;
  }

  public listenEvents(): void {
    this.elem.addEventListener('click', this.actionHandler.bind(this));
  }

  public setActions(): void {
    this.actions.sayWord = this.sayWord;
    this.actions.sayExample = this.sayExample;
    this.actions.sayMeaning = this.sayMeaning;
  }

  sayWord(): void {
    const url = `${baseUrl}/files/${this.file}.mp3`;

    this.playAudio(url);
  }

  sayExample(): void {
    const url = `${baseUrl}/files/${this.file}_example.mp3`;

    this.playAudio(url);
  }

  sayMeaning(): void {
    const url = `${baseUrl}/files/${this.file}_meaning.mp3`;

    this.playAudio(url);
  }

}