import BaseComponent from '../../base';
import { createButton, createDiv, createSpan } from '../../../utils';
import { pageChenging } from '../../../rooting';

export default class SprintGame extends BaseComponent {
  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'sprintGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Спринт Игра' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page sprint' });
    const groupsWrapper = createDiv({ className: 'sprint__groups-wrapper'});
    const groupsWrapperText = createDiv({ className: 'sprint__groups-wrapper_text' });
    const groupsWrapperButtons = createDiv({ className: 'sprint__groups-wrapper_buttons' });
    
    groupsWrapperText.innerHTML =  `
    <h3>Спринт</h3>
    <p class = "sprint__groups-wrapper_paragraph">Тренирует навык быстрого перевода с английского языка на русский. 
    Вам нужно выбрать соответствует ли перевод предложенному слову.</p>
    `;

    for (let i=0; i < 6; i++) {
      groupsWrapperButtons.append(createButton({ text: `${i + 1}`, className: `group-${i}`, action: 'showSprintGame'}));
    }
    
    groupsWrapper.append(groupsWrapperText);
    groupsWrapper.append(groupsWrapperButtons);

    page.append(groupsWrapper);
    this.fragment.append(page);
  }

  private chooseGroup(): void {
    createDiv({className: "groups-wrapper"});

  }
}