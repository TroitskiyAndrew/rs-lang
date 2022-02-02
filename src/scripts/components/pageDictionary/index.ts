import BaseComponent from '../base';
import { createDiv, createInput, createButton } from '../../utils';
import { updateContent } from '../../rooting';
import { instances } from '../components';
import WordCard from './wordCard';

export default class PageDictionary extends BaseComponent {
  input: HTMLInputElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageDictionary';
  }

  public createHTML(): void {
    const wodsList = createDiv({ className: 'words-list' });
    const inputGroup = createDiv({ className: 'inputGroup' });
    this.input = createInput({ className: 'newWord', type: 'text' });
    const button = createButton({ className: 'wordCreate', action: 'createWord', text: 'Создать слово' });
    inputGroup.append(this.input);
    inputGroup.append(button);
    this.fragment.append(inputGroup);
    this.fragment.append(wodsList);
  }

  public listenEvents(): void {
    (this.input as HTMLInputElement).addEventListener('change', this.changeInput.bind(this));
    (this.elem.querySelector('.inputGroup') as HTMLElement).addEventListener('click', this.actionHandler.bind(this));
    (this.elem.querySelector('.words-list') as HTMLElement).addEventListener('spanAffected', this.spanAffected.bind(this));
  }

  public setActions(): void {
    this.actions.createWord = this.createWord;
  }

  public createWord(): void {
    const word = (this.input as HTMLInputElement).value;
    const newCard = createDiv({ className: '', dataSet: { word: word } });
    (this.elem.querySelector('.words-list') as HTMLElement).append(newCard);
    updateContent(newCard, 'wordCard');
  }

  private changeInput(ev: Event): void {
    console.log('input changed');
  }

  private spanAffected(ev: Event): void {
    const target = ev.target as HTMLSpanElement;
    const word = target.textContent as string;
    (this.input as HTMLInputElement).value = word;
    console.log(instances[target.dataset.widgetId as string]);
    const widget = instances[target.dataset.widgetId as string] as WordCard;
    widget.colorSpan();
  }
}