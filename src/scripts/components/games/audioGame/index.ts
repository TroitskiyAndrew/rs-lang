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

  totalQuestions: number | undefined;

  audio = new Audio();


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public async oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);

    // получаю с АПИ данные
    await this.setAllQuestionWordsToState();
    await this.setAllTranslateWordsToState();
    console.log('this.wordsFromAPI', this.wordsFromAPI);

    if (!this.wordsFromAPI.questionWords) return;
    this.totalQuestions = this.wordsFromAPI.questionWords.length - 1;
    const totalQuestionSpan = this.elem.querySelector('.questionsAmount__total') as HTMLElement;
    if (this.totalQuestions) {
      totalQuestionSpan.textContent = `/${this.totalQuestions + 1}`;
    } else {
      totalQuestionSpan.textContent = '/20';
    }
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

    const questionsAmount = createDiv({
      className: 'audio-game__questionsAmount questionsAmount',
    });
    const questionCurrentAmount = createSpan({
      className: 'questionsAmount__current',
      text: '1',
    });
    const questionTotalAmount = createSpan({
      className: 'questionsAmount__total',
    });

    const questionField = createDiv({
      className: 'audio-game__questionField questionField',

    });

    const upperContent = createDiv({
      className: 'questionField__upperContent',
    });

    const imageDiv = createDiv({
      className: 'questionField__image',
    });

    const lowerContent = createDiv({
      className: 'questionField__lowerContent',
    });
    const audioWrapper = createDiv({
      className: 'questionField__audio-wrapper',
    });
    const audioWord = createSpan({
      className: 'questionField__word',
      text: 'english word(replace)',
    });

    const answersField = createDiv({
      className: 'audio-game__answers audio-answers',
    });

    this.nextBtn = createButton({
      className: 'audio-game__next',
      text: 'следующий',
    });

    questionsAmount.append(questionCurrentAmount);
    questionsAmount.append(questionTotalAmount);
    audioPage.append(questionsAmount);

    upperContent.append(imageDiv);
    questionField.append(upperContent);
    audioPage.append(questionField);


    lowerContent.append(audioWrapper);
    lowerContent.append(audioWord);
    questionField.append(lowerContent);

    audioPage.append(questionField);
    audioPage.append(answersField);
    audioPage.append(this.nextBtn);

    this.fragment.append(audioPage);
  }

  public listenEvents(): void {
    (this.nextBtn as HTMLElement).addEventListener('click', this.nextQuestion.bind(this));
  }

  nextQuestion() {
    this.questionNumber++;
    this.showNextQuestion();
  }

  async showNextQuestion() {
    if (!this.totalQuestions) return;
    // Проверка на количество вопросов, если 20-е, то модальное окно со статистикой
    if (this.questionNumber === this.totalQuestions) {
      this.nextBtn!.textContent = 'показать результаты';
    }

    if (this.questionNumber > this.totalQuestions) {
      console.log('show statistics');
      return;
      this.questionNumber = 0;
    }

    const currentQuestionSpan = this.elem.querySelector('.questionsAmount__current') as HTMLElement;
    currentQuestionSpan.textContent = `${this.questionNumber + 1}`;

    if (!this.wordsFromAPI.questionWords) return;
    const currentQuestionCard = this.wordsFromAPI.questionWords[this.questionNumber];
    console.log('currentQuestionCard', currentQuestionCard);

    // меняем на новую картинку при завершении ответа
    const imageDiv = this.elem.querySelector('.questionField__image') as HTMLElement;
    const img = new Image();
    img.src = `${baseUrl}/${currentQuestionCard.image}`;
    img.onload = () => {
      imageDiv.style.backgroundImage = `url(${img.src})`;
      imageDiv.classList.add('show');
    };

    // меняем на новый аудио звук
    // при завершении ответа иконку звука уменьшаем
    const audioWrapper = this.elem.querySelector('.questionField__audio-wrapper') as HTMLElement;
    audioWrapper.innerHTML = '';
    const audioBtn = createButton({
      className: 'questionField__audio icon-button',
    });
    audioWrapper.append(audioBtn);

    audioBtn.addEventListener('click', () => {
      console.log('audio btn!');
      this.audio.currentTime = 0;
      this.audio.src = `${baseUrl}/${currentQuestionCard.audio}`;
      this.audio.play();
    });

    // меняем на новый англ текст при завершении ответа
    const audioWord = this.elem.querySelector('.questionField__word') as HTMLElement;
    audioWord.textContent = currentQuestionCard.word;


    // меняем на новые варианты ответов
    const answersField = this.elem.querySelector('.audio-answers') as HTMLElement;
    answersField.innerHTML = '';

    const correctAnswer = currentQuestionCard.wordTranslate;
    if (!this.wordsFromAPI.translateWords) return;
    const answers = this.getArrOfAnswers(correctAnswer, this.wordsFromAPI.translateWords);

    for (let i = 0; i < constants.answersInAudioGame; i++) {
      const answerDiv = createDiv({
        className: 'audio-answers__answer',
      });
      answerDiv.textContent = `${answers[i]}`;

      answerDiv.addEventListener('click', () => {
        if (answerDiv.textContent === correctAnswer) {
          this.correctAnswer(correctAnswer);
        } else {
          this.wrongAnswer(correctAnswer);
        }
      });

      answersField.append(answerDiv);
    }

  }

  correctAnswer(correctAnswer: string) {
    const allDivAnswers = this.elem.querySelectorAll('.audio-answers__answer');
    allDivAnswers.forEach(divAnswer => {
      if (divAnswer.textContent === correctAnswer) {
        divAnswer.classList.add('correct');
      } else { divAnswer.classList.add('disable'); }
    },
    );

    console.log('correct');
    this.answerResult();
  }

  wrongAnswer(correctAnswer: string) {
    const allDivAnswers = this.elem.querySelectorAll('.audio-answers__answer');
    allDivAnswers.forEach(divAnswer => {
      if (divAnswer.textContent === correctAnswer) {
        divAnswer.classList.add('wrong');
      } else { divAnswer.classList.add('disable'); }
    },
    );

    console.log('wrong');
    this.answerResult();
  }

  answerResult() {
    console.log(this.questionNumber);
    // const allDivAnswers = this.elem.querySelectorAll('.audio-answers__answer');

  }

  async setAllTranslateWordsToState(): Promise<void> {
    if (this.group !== undefined) {
      const wordsTranslationGroup = (await apiService.getChunkOfWordsGroup(this.group))
        .map(elem => elem.wordTranslate);

      const filterWordsOfCurrentGroup = this.wordsFromAPI.questionWords?.map(card => {
        return card.wordTranslate;
      });
      // перевод слов 600 штук - 20 из нашей группы = 580
      const filteredChunk = wordsTranslationGroup.filter(word => {
        if (filterWordsOfCurrentGroup) {
          return !filterWordsOfCurrentGroup.includes(word);
        }
      });

      this.wordsFromAPI.translateWords = filteredChunk;
    }
  }

  async setAllQuestionWordsToState(): Promise<void> {
    if (this.group !== undefined && this.page !== undefined) {
      const words: WordCard[] = await apiService.getChunkOfWords(this.page, this.group);
      shuffleArray<WordCard>(words);
      this.wordsFromAPI.questionWords = words;
    }
  }

  private getArrOfAnswers(correctAnswer: string, fakeArrayAnswers: string[]): string[] {
    shuffleArray(fakeArrayAnswers);
    const answers = [];
    answers.push(correctAnswer);
    for (let i = 0; i < constants.answersInAudioGame - 1; i++) {
      answers.push(fakeArrayAnswers[i]);
    }
    // shuffling 4 answers
    shuffleArray(answers);
    return answers;
  }

}
