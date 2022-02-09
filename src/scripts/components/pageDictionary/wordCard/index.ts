import BaseComponent from '../../base';
import { createButton, createDiv } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { WordCard } from '../../../api/api.types';

export default class WordsCard extends BaseComponent {
  word: HTMLElement = createDiv({ className: 'wordCard__word' });

  wordRu: HTMLElement = createDiv({ className: 'wordCard__wordRu' });

  meaning: HTMLElement = createDiv({ className: 'wordCard__meaning' });

  meaningRu: HTMLElement = createDiv({ className: 'wordCard__meaningRu' });

  example: HTMLElement = createDiv({ className: 'wordCard__example' });

  exampleRu: HTMLElement = createDiv({ className: 'wordCard__exampleRu' });

  transcription: HTMLElement = createDiv({ className: 'wordCard__transcription' });

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

      this.word.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayWord' }));
      this.example.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayExample' }));
      this.meaning.append(createButton({ className: 'wordCard__audio-button icon-button volume', action: 'sayMeaning' }));
    });
  }

  public createHTML(): void {

    this.fragment.append(this.word);
    this.fragment.append(this.transcription);
    this.fragment.append(this.meaning);
    this.fragment.append(this.example);
    this.fragment.append(this.wordRu);
    this.fragment.append(this.meaningRu);
    this.fragment.append(this.exampleRu);

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