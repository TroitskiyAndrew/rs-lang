import BaseComponent from '../../base';
import { createButton, createDiv, createSpan, updateObjDate } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
import { getState } from '../../../state';
import { Statistics, UserWord } from '../../../api/api.types';
import constants from '../../../app.constants';

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

  wordBody: UserWord = {
    difficulty: 'common',
    optional: {
      new: false,
      learned: false,
      rightRange: 0,
      word: '',
      correctAnswersAllTime: 0,
      answersAllTime: 0,
    },
  };


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'wordsCard';
    this.extraClass = 'wordCard';
    this.file = '';
    this.wordId = this.elem.dataset.wordId as string;
    this.userId = getState().userId;
  }

  public async oninit(): Promise<void> {
    const word = await apiService.getWord(this.wordId);
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


    if (this.userId) {
      this.elem.classList.add('_authorized');
      const userWord = await apiService.getUserWord(this.userId, this.wordId);

      if (typeof userWord !== 'number') {
        this.wordBody.difficulty = userWord.difficulty;
        this.wordBody.optional = userWord.optional;
        (this.elem.querySelector('.text-statistic') as HTMLSpanElement).textContent = `${this.wordBody.optional.correctAnswersAllTime || 0}/${this.wordBody.optional.answersAllTime || 0}`;
        this.changeStatus();

      } else {
        this.wordBody.optional.word = word.word;
        apiService.createUserWord(this.userId, this.wordId, this.wordBody).then();
      }

      if (this.wordBody.optional.learned) {
        this.wordStatusChange(true);
      }
    }
    return Promise.resolve();
  }

  public createHTML(): void {
    const textHolder = createDiv({ className: 'wordCard__text-holder' });
    const engHolder = createDiv({ className: 'wordCard__text-part _eng' });
    const ruHolder = createDiv({ className: 'wordCard__text-part _ru' });
    const contorls = createDiv({ className: 'wordCard__controls' });
    const contorlsHolder = createDiv({ className: 'wordCard__controls-holder' });

    contorls.append(this.createButtonBlock('visibility', 'Показать/скрыть перевод'));
    contorls.append(this.createButtonBlock('difficult', 'Добавить/убрать из списка сложных слов'));
    contorls.append(this.createButtonBlock('learned', 'Добавить/убрать из списка выученных слов'));
    contorls.append(this.createButtonBlock('statistic', 'Количество правильных ответов в играх', '0/0'));

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

  private createButtonBlock(type: string, hint: string, text?: string): HTMLDivElement {
    const block = createDiv({ className: `wordCard__button-block button-block ${type}` });
    block.setAttribute('title', hint);

    block.append(createDiv({ className: 'button-block__circle left-top' }));
    block.append(createDiv({ className: 'button-block__circle left-bottom' }));
    block.append(createDiv({ className: 'button-block__circle right-top' }));
    block.append(createDiv({ className: 'button-block__circle right-bottom' }));
    if (text) {
      block.append(createSpan({ className: `button-block__text icon-button text-${type}`, text: text }));
    } else {
      block.append(createButton({ className: `button-block__button icon-button btn-${type}`, action: `${type}` }));
    }

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
    this.actions.learned = this.togglelearned;
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
      setTimeout(this.changeStatus.bind(this), constants.junmpAnimationTimeDictionary / 2);
    } else {
      this.changeStatus();
    }
  }

  private toggleDifficult(): void {
    this.wordBody.difficulty = this.wordBody.difficulty === 'common' ? 'difficult' : 'common';
    if (this.wordBody.difficulty === 'difficult') {
      this.wordBody.optional.learned = false;
    }
    apiService.updateUserWord(this.userId, this.wordId, this.wordBody);
    this.changeStatus();
  }

  private togglelearned(): void {
    this.wordBody.optional.learned = !this.wordBody.optional.learned;
    if (this.wordBody.optional.learned) {
      this.wordBody.difficulty = 'common';
    }
    this.updateStatistic(this.wordBody.optional.learned);
    apiService.updateUserWord(this.userId, this.wordId, this.wordBody);
    this.changeStatus();
    this.wordStatusChange(this.wordBody.optional.learned);
  }

  private async updateStatistic(learned: boolean): Promise<void> {
    const apiStatistic = await apiService.getUserStatistics(this.userId);
    const defaultStatistic: Statistics = {
      learnedWords: 0,
      optional: {
        learnedWordsPerDate: updateObjDate(undefined, 0),
      },
    };
    const statistic = typeof apiStatistic !== 'number' ? apiStatistic : defaultStatistic;
    console.log(statistic);
    const change = learned ? 1 : -1;
    statistic.learnedWords = statistic.learnedWords as number + change;
    statistic.optional.learnedWordsPerDate = updateObjDate(statistic.optional.learnedWordsPerDate, change);
    if (statistic.id) {
      delete statistic.id;
    }
    console.log(statistic);
    return apiService.updateUserStatistics(this.userId, statistic).then();
  }

  private wordStatusChange(add: boolean): void {
    const eventName = `wordSet${add ? '' : 'Not'}Lerned`;

    this.sendEvent(eventName);
  }

  private changeStatus(): void {
    if (this.visibility) {
      this.elem.classList.add('_visible-translate');
      (this.elem.querySelector('.button-block.visibility') as HTMLElement).classList.add('_active');
    } else {
      this.elem.classList.remove('_visible-translate');
      (this.elem.querySelector('.button-block.visibility') as HTMLElement).classList.remove('_active');
    }
    if (this.wordBody.difficulty === 'difficult') {
      this.elem.classList.add('_difficult');
      (this.elem.querySelector('.button-block.difficult') as HTMLElement).classList.add('_active');
    } else {
      this.elem.classList.remove('_difficult');
      (this.elem.querySelector('.button-block.difficult') as HTMLElement).classList.remove('_active');
    }
    if (this.wordBody.optional.learned) {
      this.elem.classList.add('_learned');
      (this.elem.querySelector('.button-block.learned') as HTMLElement).classList.add('_active');
    } else {
      this.elem.classList.remove('_learned');
      (this.elem.querySelector('.button-block.learned') as HTMLElement).classList.remove('_active');
    }
  }

}