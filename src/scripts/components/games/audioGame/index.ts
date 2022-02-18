import BaseComponent from '../../base';
import { updateContent } from '../../../rooting';
import { createSpan, createDiv, createButton, getRandom, shuffleArray } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
// import { updateState, getState } from '../../../state';
import constants from '../../../app.constants';
import { WordCard } from '../../../api/api.types';
import { getState } from '../../../state';


interface IState {
  questionWords: WordCard[];
  translateWords: string[];
}
export interface IStatisticAnswer {
  id: string,
  audio: string,
  group: number,
  image: string,
  page: number,
  word: string,
  wordTranslate: string,
  answerCorrectness: boolean;
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

  nextTextBtn = 'следующий вопрос';

  showResultTextBtn = 'показать ответ';

  showStatisticsTextBtn = 'показать статистику';

  isChangeablePage = false;

  enableKeyAnswer = false;

  focusedGame = false;

  currentQuestionCard: Partial<WordCard> = {};

  answersArray: IStatisticAnswer[] = [];


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public async oninit(): Promise<void> {
    // pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);
    // pageChenging(createSpan({}), this.name);

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
    this.showNextQuestion();

    // todo testing aggregateWords
    // const aggregatedWords = await apiService.getAllUserAggregatedWords(getState().userId, 0, 0, 30, '{"userWord.optional.learned":false}');
    // console.log('aggregatedWords 0 0 30 NOT learned', aggregatedWords);
    const statistics = await apiService.getUserStatistics(getState().userId);
    console.log('UserStatistics', statistics);

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
    // todo delete
    this.page = 0;
    this.group = 0;

    console.log('this.page', this.page);
    console.log('this.group', this.group);
  }


  public createHTML(): void {
    this.definePageAndGroup();
    const audioPage = createDiv({ className: 'audio-game' });

    const audioGameContainer = createDiv({ className: 'audio-game__container' });

    const audioGameContent = createDiv({ className: 'audio-game__content' });

    const questionsAmount = createDiv({
      className: 'audio-game__questionsAmount questionsAmount',
    });
    const questionCurrentAmount = createSpan({
      className: 'questionsAmount__current',
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
    });
    const answersField = createDiv({
      className: 'audio-game__answers audio-answers',
    });
    this.nextBtn = createButton({
      className: 'audio-game__next games__link',
    });

    questionsAmount.append(questionCurrentAmount);
    questionsAmount.append(questionTotalAmount);
    audioGameContainer.append(questionsAmount);

    questionField.append(imageDiv);
    questionField.append(audioWrapper);
    questionField.append(audioWord);

    audioGameContent.append(questionField);
    audioGameContent.append(answersField);
    audioGameContent.append(this.nextBtn);
    audioGameContainer.append(audioGameContent);

    audioPage.append(audioGameContainer);

    // todo temporary show modal
    // this.showModalStatistics();

    this.fragment.append(audioPage);
  }

  public listenEvents(): void {
    (this.nextBtn as HTMLElement).addEventListener('click', this.nextQuestion.bind(this));
    // Ивенты клавиш
    document.addEventListener('keyup', this.keyFunctionality.bind(this));
    document.onpointerdown = e => {
      if ((e.target as HTMLElement).closest('.audio-game')) {
        this.focusedGame = true;
      } else {
        this.focusedGame = false;
      }
    };
  }


  private keyFunctionality(e: KeyboardEvent): void {
    if (this.focusedGame) {
      if (!this.totalQuestions) return;
      if (this.questionNumber > this.totalQuestions) return;
      if (e.code === 'Space') {
        e.preventDefault();
        this.nextQuestion();
      }
      for (let i = 1; i <= constants.answersInAudioGame; i++) {
        if (e.code === `Digit${i}`) {
          e.preventDefault();
          this.checkAnswerByKey(i);
        }
      }
    }
  }

  private checkAnswerByKey(pos: number): void {
    if (!this.enableKeyAnswer) return;
    const answerDiv = document.querySelector(`[data-audio="answer-${pos}"]`) as HTMLElement;
    if (!answerDiv.textContent) return;
    const answerFromDiv = answerDiv.textContent.split('. ');
    const correctAnswer = this.currentQuestionCard.wordTranslate;
    if (!correctAnswer) return;
    if (answerFromDiv[1] === correctAnswer) {
      this.answerResult(true);
      this.enableKeyAnswer = false;
    } else {
      this.answerResult(false);
      this.enableKeyAnswer = false;
    }
  }

  private nextQuestion(): void {
    if (!this.totalQuestions) return;
    if (this.questionNumber > this.totalQuestions) return;
    if (this.isChangeablePage) {
      this.questionNumber++;
      this.enableKeyAnswer = false;
      this.showNextQuestion();
      this.isChangeablePage = false;
    } else {
      (this.nextBtn as HTMLElement).textContent = this.nextTextBtn;
      this.enableKeyAnswer = false;
      this.answerResult(false);
      this.isChangeablePage = true;
    }
  }

  private async showNextQuestion(): Promise<void> {
    this.focusedGame = true;
    this.enableKeyAnswer = true;

    if (!this.totalQuestions || !this.nextBtn) return;
    // модальное окно со статистикой
    if (this.questionNumber > this.totalQuestions) {
      this.nextBtn.style.pointerEvents = 'none';
      this.showModalStatistics();
      return;
    }
    this.nextBtn.textContent = this.showResultTextBtn;

    const currentQuestionSpan = this.elem.querySelector('.questionsAmount__current') as HTMLElement;
    currentQuestionSpan.textContent = `${this.questionNumber + 1}`;

    if (!this.wordsFromAPI.questionWords) return;
    this.currentQuestionCard = this.wordsFromAPI.questionWords[this.questionNumber];

    console.log('currentQuestionCard', this.currentQuestionCard);
    // картинка
    this.implementPicture();
    // аудио звук
    this.implementAudio();
    // варианты ответов
    this.implementAnswers();
  }

  private implementPicture(): void {
    const imageDiv = this.elem.querySelector('.questionField__image') as HTMLElement;
    const img = new Image();
    img.src = `${baseUrl}/${this.currentQuestionCard.image}`;
    img.onload = () => {
      imageDiv.style.backgroundImage = `url(${img.src})`;
    };
    const questionDiv = this.elem.querySelector('.questionField') as HTMLElement;
    questionDiv.classList.remove('show');
  }

  private implementAudio(): void {
    const audioWrapper = this.elem.querySelector('.questionField__audio-wrapper') as HTMLElement;
    audioWrapper.innerHTML = '';
    const audioBtn = createButton({
      className: 'questionField__audio icon-button',
    });
    audioWrapper.append(audioBtn);
    this.audio.src = `${baseUrl}/${this.currentQuestionCard.audio}`;
    this.audio.play();
    audioBtn.addEventListener('click', () => {
      this.audio.currentTime = 0;
      this.audio.play();
    });
  }

  private implementAnswers(): void {
    const answersField = this.elem.querySelector('.audio-answers') as HTMLElement;
    answersField.innerHTML = '';
    const correctAnswer = this.currentQuestionCard.wordTranslate;
    if (!correctAnswer || !this.wordsFromAPI.translateWords) return;
    const answers = this.getArrOfAnswers(correctAnswer, this.wordsFromAPI.translateWords);
    for (let i = 0; i < constants.answersInAudioGame; i++) {
      const answerDiv = createDiv({
        className: 'audio-answers__answer',
        dataSet: { audio: `answer-${i + 1}` },
      });
      answerDiv.textContent = `${i + 1}. ${answers[i]}`;
      const answerFromDiv = answerDiv.textContent.split('. ');

      answerDiv.addEventListener('click', () => {
        if (answerFromDiv[1] === correctAnswer) {
          this.answerResult(true);
        } else {
          this.answerResult(false);
        }
      });
      answersField.append(answerDiv);
    }
  }

  private answerResult(answer: boolean): void {
    const allDivAnswers = this.elem.querySelectorAll('.audio-answers__answer');
    const answerToStatistic = Object.assign(this.currentQuestionCard);
    delete answerToStatistic.audioExample;
    delete answerToStatistic.audioMeaning;
    delete answerToStatistic.textExample;
    delete answerToStatistic.textExampleTranslate;
    delete answerToStatistic.textMeaning;
    delete answerToStatistic.textMeaningTranslate;
    delete answerToStatistic.transcription;
    if (answer) {
      answerToStatistic.answerCorrectness = true;
      this.answersArray.push(answerToStatistic);
    } else {
      answerToStatistic.answerCorrectness = false;
      this.answersArray.push(answerToStatistic);
    }
    allDivAnswers.forEach(divAnswer => {
      if (divAnswer.textContent) {
        const answerFromDiv = divAnswer.textContent.split('. ');
        const correctAnswer = this.currentQuestionCard.wordTranslate;
        if (!correctAnswer) return;
        if (answerFromDiv[1] === correctAnswer) {
          if (answer) {
            divAnswer.classList.add('correct');
          } else {
            divAnswer.classList.add('wrong');
          }

        } else { divAnswer.classList.add('disable'); }
      }
    });

    this.isChangeablePage = true;
    if (this.questionNumber === this.totalQuestions) {
      (this.nextBtn as HTMLElement).textContent = this.showStatisticsTextBtn;
    } else {
      (this.nextBtn as HTMLElement).textContent = this.nextTextBtn;
    }
    // меняем на новый англ текст при завершении ответа
    const audioWord = this.elem.querySelector('.questionField__word') as HTMLElement;
    if (!this.currentQuestionCard.word) return;
    audioWord.textContent = this.currentQuestionCard.word;

    const questionDiv = this.elem.querySelector('.questionField') as HTMLElement;
    questionDiv.classList.add('show');
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
    shuffleArray(answers);
    return answers;
  }


  private showModalStatistics(): void {
    const modalStatistic = createDiv({
      className: '',
      dataSet: {
        widget: 'modalStatistic',
        parentId: this.id,
      },
    });
    this.elem.append(modalStatistic);
    updateContent(modalStatistic, modalStatistic.getAttribute('data-widget') as string);
  }

  giveDataToModalStatistic(): IStatisticAnswer[] {
    // return this.fake();
    return this.answersArray;
  }

  public playAgain() {
    this.questionNumber = 0;
    this.currentQuestionCard = {};
    this.answersArray = [];
    (this.nextBtn as HTMLElement).style.pointerEvents = 'auto';
    this.showNextQuestion();
  }

  private fake() {
    return [
      {
        answerCorrectness: false,
        audio: 'files/10_0192.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0192.jpg',
        page: 9,
        word: 'immediate',
        wordTranslate: 'немедленно',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0191.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0191.jpg',
        page: 9,
        word: 'unknown_2',
        wordTranslate: 'неизвестно_2',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0191.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0191.jpg',
        page: 9,
        word: 'unknown_2',
        wordTranslate: 'неизвестно_2',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0191.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0191.jpg',
        page: 9,
        word: 'unknown_2',
        wordTranslate: 'неизвестно_2',
      },
      {
        answerCorrectness: false,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
      {
        answerCorrectness: false,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
      {
        answerCorrectness: true,
        audio: 'files/10_0190.mp3',
        group: 0,
        id: '5e9f5ee35eb9e72bc21af55f',
        image: 'files/10_0190.jpg',
        page: 9,
        word: 'unknown_3',
        wordTranslate: 'неизвестно_3',
      },
    ];
  }
}
