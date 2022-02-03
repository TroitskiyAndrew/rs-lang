import './styles/main.scss';
import { updateContent } from './scripts/rooting';
import { getState } from './scripts/state';

window.onload = () => {
  document.addEventListener('click', (ev: Event): void => {
    const target: HTMLElement | null = (ev.target as HTMLElement).closest('[data-direction]');

    if (target) {
      const direction: string = target.dataset.direction as string;

      updateContent(document.querySelector('#page-holder') as HTMLElement, direction);
    }
  });

  updateContent(document.querySelector('#menu') as HTMLElement, 'menu');
  updateContent(document.querySelector('#header') as HTMLElement, 'header');
  const state = getState();
  updateContent(document.querySelector('#page-holder') as HTMLElement, state.currentPage);
};

