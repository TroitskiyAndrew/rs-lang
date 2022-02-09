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

  isChangeablePage = false;

  correctAnswer = '';

  nextTextBtn = 'следующий вопрос';

  showResultTextBtn = 'показать ответ';

  showStatisticsTextBtn = 'показать статистику';



  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public async oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);

    // получаю с АПИ данные
    // todo новые слова перезаписать ТУТ!, которые придут не связанные с группой
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
      text: '',
    });
    const questionTotalAmount = createSpan({
      className: 'questionsAmount__total',
    });

    const questionField = createDiv({
      className: 'audio-game__questionField questionField',

    });

    const imageDiv = createDiv({
      className: 'questionField__image',
    });

    const audioWrapper = createDiv({
      className: 'questionField__audio-wrapper',
    });
    const audioWord = createSpan({
      className: 'questionField__word',
      text: '',
    });

    const answersField = createDiv({
      className: 'audio-game__answers audio-answers',
    });

    this.nextBtn = createButton({
      className: 'audio-game__next',
    });

    questionsAmount.append(questionCurrentAmount);
    questionsAmount.append(questionTotalAmount);
    audioPage.append(questionsAmount);

    questionField.append(imageDiv);
    questionField.append(audioWrapper);
    questionField.append(audioWord);

    audioPage.append(questionField);
    audioPage.append(answersField);
    audioPage.append(this.nextBtn);

    this.fragment.append(audioPage);
  }

  public listenEvents(): void {
    (this.nextBtn as HTMLElement).addEventListener('click', this.nextQuestion.bind(this));
  }

  nextQuestion() {
    if (this.isChangeablePage) {
      this.questionNumber++;
      this.showNextQuestion();
      this.isChangeablePage = false;
    } else {
      (this.nextBtn as HTMLElement).textContent = this.nextTextBtn;
      this.answerResult(false);
      this.isChangeablePage = true;
    }
  }

  async showNextQuestion() {
    if (!this.totalQuestions || !this.nextBtn) return;
    // Проверка на количество вопросов, если 20-е, то модальное окно со статистикой
    if (this.questionNumber > this.totalQuestions) {
      console.log('STATISTICS!');
      this.nextBtn.style.pointerEvents = 'none';
      return;
    }

    this.nextBtn.textContent = this.showResultTextBtn;

    const currentQuestionSpan = this.elem.querySelector('.questionsAmount__current') as HTMLElement;
    currentQuestionSpan.textContent = `${this.questionNumber + 1}`;

    if (!this.wordsFromAPI.questionWords) return;
    const currentQuestionCard = this.wordsFromAPI.questionWords[this.questionNumber];
    console.log('currentQuestionCard', currentQuestionCard);

    // картинка
    const imageDiv = this.elem.querySelector('.questionField__image') as HTMLElement;
    const img = new Image();
    img.src = `${baseUrl}/${currentQuestionCard.image}`;
    img.onload = () => {
      imageDiv.style.backgroundImage = `url(${img.src})`;
    };

    const questionDiv = this.elem.querySelector('.questionField') as HTMLElement;
    questionDiv.classList.remove('show');

    // аудио звук
    const audioWrapper = this.elem.querySelector('.questionField__audio-wrapper') as HTMLElement;
    audioWrapper.innerHTML = '';
    const audioBtn = createButton({
      className: 'questionField__audio icon-button',
    });
    audioWrapper.append(audioBtn);
    this.audio.src = `${baseUrl}/${currentQuestionCard.audio}`;
    this.audio.play();

    audioBtn.addEventListener('click', () => {
      this.audio.currentTime = 0;
      this.audio.play();
    });

    // варианты ответов
    const answersField = this.elem.querySelector('.audio-answers') as HTMLElement;
    answersField.innerHTML = '';

    this.correctAnswer = currentQuestionCard.wordTranslate;
    if (!this.wordsFromAPI.translateWords) return;
    const answers = this.getArrOfAnswers(this.correctAnswer, this.wordsFromAPI.translateWords);

    for (let i = 0; i < constants.answersInAudioGame; i++) {
      const answerDiv = createDiv({
        className: 'audio-answers__answer',
      });
      answerDiv.textContent = `${i + 1}. ${answers[i]}`;
      const answerFromDiv = answerDiv.textContent.split('. ');

      answerDiv.addEventListener('click', () => {
        if (answerFromDiv[1] === this.correctAnswer) {
          this.answerResult(true);
        } else {
          this.answerResult(false);
        }
      });

      answersField.append(answerDiv);
    }

  }

  answerResult(answer: boolean) {
    const allDivAnswers = this.elem.querySelectorAll('.audio-answers__answer');
    allDivAnswers.forEach(divAnswer => {
      if (divAnswer.textContent) {
        const answerFromDiv = divAnswer.textContent.split('. ');
        if (answerFromDiv[1] === this.correctAnswer) {
          if (answer) {
            divAnswer.classList.add('correct');
          } else {
            divAnswer.classList.add('wrong');
          }

        } else { divAnswer.classList.add('disable'); }
      }
    },
    );

    console.log(this.questionNumber);
    this.isChangeablePage = true;
    (this.nextBtn as HTMLElement).textContent = this.nextTextBtn;

    // меняем на новый англ текст при завершении ответа
    if (!this.wordsFromAPI.questionWords) return;
    const currentQuestionCard = this.wordsFromAPI.questionWords[this.questionNumber];
    const audioWord = this.elem.querySelector('.questionField__word') as HTMLElement;
    audioWord.textContent = currentQuestionCard.word;

    const questionDiv = this.elem.querySelector('.questionField') as HTMLElement;
    questionDiv.classList.add('show');

    if (this.questionNumber === this.totalQuestions) {
      (this.nextBtn as HTMLElement).textContent = this.showStatisticsTextBtn;
    }
  }

  async setAllTranslateWordsToState(): Promise<void> {
    if (this.group !== undefined) {
      const wordsTranslationGroup = (await apiService.getChunkOfWordsGroup(this.group))
        .map(elem => elem.wordTranslate);

      // todo новые слова перепроверить ТУТ!, которые придут не связанные с группой
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
