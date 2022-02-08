import BaseComponent from '../../base';
import { pageChenging } from '../../../rooting';
import { createSpan, createDiv, createButton, getRandom, shuffleArray } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
// import { updateState, getState } from '../../../state';
import constants from '../../../app.constants';
import { WordCard } from '../../../api/api.types';

interface IState {
  questionWords: WordCard[];
  translateWords: string[];
}
export default class AudioGame extends BaseComponent {
  test: HTMLElement | undefined;

  wordsFromAPI: Partial<IState> = {};

  page: number | undefined;

  group: number | undefined;

  nextBtn: HTMLButtonElement | undefined;

  questionNumber = 0;

  audio = new Audio();


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public async oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);

    // получаю с АПИ данные
    await this.setAllTranslateWordsToState();
    await this.setAllQuestionWordsToState();
    console.log('this.wordsFromAPI', this.wordsFromAPI);
    // стартую первый раз игру
    this.showNextQuestion();

    return Promise.resolve();
  }

  private definePageAndGroup(): void {
    const options = this.options ? JSON.parse(this.options) : {};
    this.page = getRandom(constants.minWordsPage, constants.maxWordsPage);

    if (options.page) {
      this.page = options.page;
    }
    this.group = getRandom(constants.minWordsGroup, constants.maxWordsGroup);
    if (options.group) {
      this.group = +options.group;
    }

    console.log('options', options);
    console.log('this.page', this.page);
    console.log('this.group', this.group);
  }


  public createHTML(): void {
    this.definePageAndGroup();

    const audioPage = createDiv({ className: 'audio-game' });

    const upperContent = createDiv({
      className: 'audio-game__upperContent',
    });

    const imageDiv = createDiv({
      className: 'audio-game__image',
    });

    const lowerContent = createDiv({
      className: 'audio-game__lowerContent',
    });
    const audioWrapper = createDiv({
      className: 'audio-game__audio-wrapper',
    });
    const audioWord = createSpan({
      className: 'audio-game__word',
      text: 'english word(replace)',
    });

    const answersField = createDiv({
      className: 'audio-game__answers audio-answers',
    });

    this.nextBtn = createButton({
      className: 'audio-game__next',
      text: 'следующий',
    });

    upperContent.append(imageDiv);
    audioPage.append(upperContent);

    lowerContent.append(audioWrapper);
    lowerContent.append(audioWord);

    audioPage.append(lowerContent);
    audioPage.append(answersField);
    audioPage.append(this.nextBtn);

    this.fragment.append(audioPage);
  }

  public listenEvents(): void {
    (this.nextBtn as HTMLElement).addEventListener('click', this.showNextQuestion.bind(this));
  }

  async showNextQuestion() {
    // Проверка на количество вопросов, если 20-е, то модальное окно со статистикой
    const totalQuestions = 19;
    if (this.questionNumber > totalQuestions) {
      console.log('show statistics');
      this.questionNumber = 0;
      return;
    }

    if (!this.wordsFromAPI.questionWords) return;
    const currentQuestionCard = this.wordsFromAPI.questionWords[this.questionNumber];
    console.log('currentQuestionCard', currentQuestionCard);

    // меняем на новую картинку при завершении ответа
    const imageDiv = this.elem.querySelector('.audio-game__image') as HTMLElement;
    const img = new Image();
    img.src = `${baseUrl}/${currentQuestionCard.image}`;
    img.onload = () => {
      imageDiv.style.backgroundImage = `url(${img.src})`;
      imageDiv.classList.add('show');
    };

    // меняем на новый аудио звук
    // при завершении ответа иконку звука уменьшаем
    const audioWrapper = this.elem.querySelector('.audio-game__audio-wrapper') as HTMLElement;
    audioWrapper.innerHTML = '';
    const audioBtn = createButton({
      className: 'audio-game__audio icon-button',
    });
    audioWrapper.append(audioBtn);

    audioBtn.addEventListener('click', () => {
      console.log('audio btn!');
      this.audio.currentTime = 0;
      this.audio.src = `${baseUrl}/${currentQuestionCard.audio}`;
      this.audio.play();
    });

    // меняем на новый англ текст при завершении ответа
    const audioWord = this.elem.querySelector('.audio-game__word') as HTMLElement;
    audioWord.textContent = currentQuestionCard.word;


    // меняем на новые варианты ответов
    const answersField = this.elem.querySelector('.audio-answers') as HTMLElement;
    answersField.innerHTML = '';
    const correctAnswer = 'answer1';
    // перемешивать основную группу уже не нужно, только ответы между собой и 3 неверных ответа
    // const a = this.wordsFromAPI.questionWords;
    // if (a) {
    //   shuffleArray<WordCard>(a);
    //   console.log('a', a);
    // }
    // console.log(this.questionNumber);

    // let answers = [];
    //   answers.push(currentAuthor);
    //   answers.push(uniqueOtherAuthors[0]);
    //   answers.push(uniqueOtherAuthors[1]);
    //   answers.push(uniqueOtherAuthors[2]);

    for (let i = 0; i < constants.answersInAudioGame; i++) {
      const answerDiv = createDiv({
        className: 'audio-answers__answer',
      });
      answerDiv.textContent = `answer${i + 1}`;

      answerDiv.addEventListener('click', () => {
        if (answerDiv.textContent === correctAnswer) {
          console.log('correct');
        } else {
          console.log('wrong');
        }
        this.questionNumber += 1;
        this.showNextQuestion();
        console.log(this.questionNumber);
      });

      answersField.append(answerDiv);
    }

  }

  async setAllTranslateWordsToState(): Promise<void> {
    if (this.group !== undefined) {
      const wordsTranslationGroup = (await apiService.getChunkOfWordsGroup(this.group))
        .map(elem => elem.wordTranslate);
      this.wordsFromAPI.translateWords = wordsTranslationGroup;
    }
  }

  async setAllQuestionWordsToState(): Promise<void> {
    if (this.group !== undefined && this.page !== undefined) {
      const words: WordCard[] = await apiService.getChunkOfWords(this.page, this.group);
      shuffleArray<WordCard>(words);
      this.wordsFromAPI.questionWords = words;
    }
  }

}
