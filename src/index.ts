import './styles/main.scss';
import { updateContent } from './scripts/rooting';

window.onload = () => {
  const header: HTMLElement = document.querySelector('header') as HTMLElement;

  header.addEventListener('click', (ev: Event): void => {
    const target: HTMLElement | null = (ev.target as HTMLElement).closest('[data-direction]');

    if (target) {
      const direction: string = target.dataset.direction as string;

      updateContent(document.querySelector('#app') as HTMLElement, direction);
    }
  });
};
