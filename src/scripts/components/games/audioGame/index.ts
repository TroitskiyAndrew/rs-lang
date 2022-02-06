import BaseComponent from '../../base';
import { pageChenging } from '../../../rooting';
import { createSpan, createDiv, createInput, createButton } from '../../../utils';
import { apiService } from '../../../api/apiMethods';
// import { updateState, getState } from '../../../state';

export default class AudioGame extends BaseComponent {
  test: HTMLElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {

    this.test = createButton({
      text: 'test span Audio game',
    });


    this.fragment.append(this.test);
  }

  // plaGame(arr[]){
  // []1,[]2,[]3 = 30/ []=> wordTranslate
  // sun
  // wordTranslate 1 слово + солнце
  // перемешать
  // да нет
  // }


  public listenEvents(): void {
    (this.test as HTMLElement).addEventListener('click', this.showQuestion.bind(this));
  }

  async showQuestion() {
    const words = await apiService.getChunkOfWords(0, 0);
    console.log(words);

  }

}
