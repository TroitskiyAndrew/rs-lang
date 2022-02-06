import BaseComponent from '../../base';
import { createDiv } from '../../../utils';
import { apiService } from '../../../api/apiMethods';
import { WordCard } from '../../../api/api.types';

export default class WordsCard extends BaseComponent {
  word: HTMLElement | undefined;

  wordRu: HTMLElement | undefined;

  meaning: HTMLElement | undefined;

  meaningRu: HTMLElement | undefined;

  example: HTMLElement | undefined;

  exampleRu: HTMLElement | undefined;

  transcription: HTMLElement | undefined;

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

      (this.word as HTMLElement).innerHTML = word.word;
      (this.wordRu as HTMLElement).innerHTML = word.wordTranslate;
      (this.meaning as HTMLElement).innerHTML = word.textMeaning;
      (this.meaningRu as HTMLElement).innerHTML = word.textMeaningTranslate;
      (this.example as HTMLElement).innerHTML = word.textExample;
      (this.exampleRu as HTMLElement).innerHTML = word.textExampleTranslate;
      (this.transcription as HTMLElement).innerHTML = word.transcription;
    });
  }

  public createHTML(): void {
    this.word = createDiv({ className: 'wordCard__word' });
    this.wordRu = createDiv({ className: 'wordCard__wordRu' });
    this.meaning = createDiv({ className: 'wordCard__meaning' });
    this.meaningRu = createDiv({ className: 'wordCard__meaningRu' });
    this.example = createDiv({ className: 'wordCard__example' });
    this.exampleRu = createDiv({ className: 'wordCard__exampleRu' });
    this.transcription = createDiv({ className: 'wordCard__transcription' });

    this.fragment.append(this.word);
    this.fragment.append(this.transcription);
    this.fragment.append(this.meaning);
    this.fragment.append(this.example);
    this.fragment.append(this.wordRu);
    this.fragment.append(this.meaningRu);
    this.fragment.append(this.exampleRu);

  }
}