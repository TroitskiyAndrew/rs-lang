import BaseComponent from '../../base';
import { pageChenging } from '../../../rooting';
import { createSpan, createDiv, createInput, createButton, getRandom } from '../../../utils';
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


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);

    // получаю с АПИ данные
    // стартую первый раз игру
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

    // this.setAllTranslateWordsToState();
    // console.log('this.wordsFromAPI.translateWords', this.wordsFromAPI.translateWords);
    console.log('this.wordsFromAPI', this.wordsFromAPI);



    this.test = createButton({
      text: 'test span Audio game',
    });
    const test2 = createButton({
      text: 'first-answer',
      className: 'first-answer',
    });
    test2.onclick = () => {
      console.log('this.wordsFromAPI333', this.wordsFromAPI);
      if (this.wordsFromAPI.questionWords) {
        console.log('first if');

        const audio = new Audio();
        audio.src = baseUrl + '/' + this.wordsFromAPI.questionWords[0].audio;
        audio.play();
        const img = createDiv({});
        img.style.background = `url(${baseUrl}/${this.wordsFromAPI.questionWords[0].image})`;
        img.style.width = '200px';
        img.style.height = '200px';
        img.style.borderRadius = '50%';

        const question = createSpan({
          text: `${this.wordsFromAPI.questionWords[0].word}`,
        });

        // img.onload = () => {
        //   console.log('this.elem', this.elem);
        // };
        this.elem.append(img);
        this.elem.append(question);
      }

      if (this.wordsFromAPI.translateWords) {
        console.log('second if');

        const answer1 = createDiv({});
        answer1.textContent = this.wordsFromAPI.translateWords[1];
        // const answer2 = createDiv({});
        // answer2.textContent = this.wordsFromAPI.translateWords[2];
        // const answer3 = createDiv({});
        // answer3.textContent = this.wordsFromAPI.translateWords[3];
        // const answer4 = createDiv({});
        // answer4.textContent = this.wordsFromAPI.translateWords[4];
        // this.elem.append(answer4);
        // this.elem.append(answer3);
        // this.elem.append(answer2);
        this.elem.append(answer1);
      }
    };


    this.fragment.append(this.test);
    this.fragment.append(test2);
  }

  public listenEvents(): void {
    (this.test as HTMLElement).addEventListener('click', this.showQuestion.bind(this, undefined));
  }

  async showQuestion() {
    // todo сохранить в переменную, и тягать оттуда слова, а не каждый раз делать запрос.Аналогично с запросом из getChunkOfWords
    await this.setAllTranslateWordsToState();
    await this.setAllQuestionWordsToState();
    console.log('this.wordsFromAPI222', this.wordsFromAPI);
    /*       const words: WordCard[] = await apiService.getChunkOfWords(this.page, this.group);
          console.log(words);

          const wordsTranslationGroup: string[] = (await apiService.getChunkOfWordsGroup(this.group)).flat().map(elem => elem.wordTranslate);
          // 600 слов перевод
          console.log('all group words', wordsTranslationGroup); */

  }

  async setAllTranslateWordsToState(): Promise<void> {
    if (this.group) {
      const wordsTranslationGroup = (await apiService.getChunkOfWordsGroup(this.group))
        .map(elem => elem.wordTranslate);
      this.wordsFromAPI.translateWords = wordsTranslationGroup;
    }
  }

  async setAllQuestionWordsToState(): Promise<void> {
    if (this.group && this.page) {
      const words: WordCard[] = await apiService.getChunkOfWords(this.page, this.group);
      this.wordsFromAPI.questionWords = words;
    }
  }

  /*   async setQuestionWordsToState(group: number): Promise<string[]> {
      const wordsTranslationGroup = (await apiService.getChunkOfWordsGroup(group))
        .flat()
        .map(elem => elem.wordTranslate);
      return wordsTranslationGroup;
    } */

}
