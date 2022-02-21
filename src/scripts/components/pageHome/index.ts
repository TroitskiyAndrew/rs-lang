import BaseComponent from '../base';
import { createDiv, createSpan } from '../../utils';
import { pageChenging } from '../../rooting';

const TEAM_MEMBERS_NUMBER = 3;

export default class PageHome extends BaseComponent {

  descrirtionWrapper: HTMLDivElement | undefined;

  memberGithub: HTMLDivElement | undefined;

  descriptionWrapperParagraph: HTMLParagraphElement | undefined;

  memberGithubLink: HTMLAnchorElement | undefined;

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageHome';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Главная страница' }), this.name);
    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page home' });

    this.renderMainView(page);
    this.renderTeam(page);
    this.fragment.append(page);
  }

  private renderMainView(page: HTMLDivElement) {
    const mainViewContainer = createDiv({ className: 'main-view-container' });
    const homeTitleWrapper = createDiv({ className: 'main-view-container__title' });
    const descrirtionWrapper = createDiv({ className: 'main-view-container__description-wrapper' });
    const descrirtionSubWrapper = createDiv({ className: 'description-sub-wrapper' });
    const star = document.createElement('img');
    const descriptionWrapperParagraph = document.createElement('p');
    this.descrirtionWrapper = descrirtionWrapper;
    this.descriptionWrapperParagraph = descriptionWrapperParagraph;

    star.className = 'star-img';
    descriptionWrapperParagraph.className = 'description-sub-wrapper_p';

    star.src = '/../../../assets/img/homePage/SMW_Star.gif';

    homeTitleWrapper.innerHTML =
      `<h1>
        <span class="main-view-container__title_red">s</span><span
        class="main-view-container__title_blue">u</span><span
        class="main-view-container__title_yellow">p</span><span
        class="main-view-container__title_blue">e</span><span
        class="main-view-container__title_green">r </span><span
        class="main-view-container__title_green">m</span><span
        class="main-view-container__title_blue">a</span><span
        class="main-view-container__title_yellow">r</span><span
        class="main-view-container__title_red">i</span><span
        class="main-view-container__title_green">o </span><span
        class="main-view-container__title_yellow">l</span><span
        class="main-view-container__title_blue">a</span><span
        class="main-view-container__title_green">n</span><span
        class="main-view-container__title_red">g</span><span
        class="main-view-container__title_green">.</span>
      </h1>`;

    descriptionWrapperParagraph.innerHTML = `Онлайн сервис для изучения английского языка.<br>Вместе с любимыми героями культовой игры Марио и Луиджи
    вы будете изучать слова на бескрайних просторах Грибного королевства, услышите много нового в загадочном подземелье,
    а также добудете морские сокровища за хорошее знание языка!`;

    descrirtionSubWrapper.append(descriptionWrapperParagraph);
    descrirtionSubWrapper.append(star);
    descrirtionWrapper.append(descrirtionSubWrapper);
    mainViewContainer.append(homeTitleWrapper);
    mainViewContainer.append(descrirtionWrapper);

    page.append(mainViewContainer);
  }

  private renderTeam(page: HTMLDivElement) {
    const teamContainer = createDiv({ className: 'team-container' });
    const teamTitle = createDiv({ className: 'team-container__title' });
    const teamMembersWrapper = createDiv({ className: 'team-container__members-wrapper' });

    const memberWrapper = createDiv({ className: 'member-wrapper' });
    const memberAvatar = createDiv({ className: 'member-wrapper__avatar' });
    const memberGithub = createDiv({ className: 'member-wrapper__github' });
    const memberName = createDiv({ className: 'member-wrapper__name' });
    const memberPosition = createDiv({ className: 'member-wrapper__position' });
    const memberContribution = createDiv({ className: 'member-wrapper__contribution' });
    const memberGithubLink = document.createElement('a');
    this.memberGithub = memberGithub;
    this.memberGithubLink = memberGithubLink;

    memberGithubLink.className = 'github-link';

    teamTitle.innerHTML = '<h2 class="team-container__title">Наша команда.</h2>';

    memberGithubLink.innerHTML = this.getGithubSvg('#ffdb73');
    memberGithub.append(memberGithubLink);

    memberWrapper.append(memberAvatar);
    memberWrapper.append(memberGithub);
    memberWrapper.append(memberName);
    memberWrapper.append(memberPosition);
    memberWrapper.append(memberContribution);

    for (let i = 0; i < TEAM_MEMBERS_NUMBER; i++) {
      const newMember = memberWrapper.cloneNode(true) as HTMLDivElement;
      newMember.dataset.memberSequence = `member-${i}`;
      teamMembersWrapper.append(newMember);
    }
    this.fillMemberContent(teamMembersWrapper.children);

    teamContainer.append(teamTitle);
    teamContainer.append(teamMembersWrapper);
    page.append(teamContainer);

  }

  private fillMemberContent(teamMembersWrapper: HTMLCollection) {


    Array.from(teamMembersWrapper, (el, index) => {
      let githubLink: HTMLAnchorElement;
      const person = 2;
      const role = 3;
      const contribution = 4;
      switch (index) {
        case 0:
          el.children[0].append(this.getAvatar('/../../../assets/img/homePage/Troitskiy.jpg', 'Andrew'));
          githubLink = el.children[1].children[0] as HTMLAnchorElement;
          githubLink.href = 'https://github.com/TroitskiyAndrew';
          el.children[person].textContent = 'Андрей Троицкий';
          el.children[role].innerHTML = 'Frontend Engineer<br>Team lead';
          el.children[contribution].innerHTML = `
          <ul>
            <li>Структура приложения, все основные компоненты</li>
            <li>Страница словаря с карточками</li>
            <li>Страница статистики</li>
          </ul>`;
          break;
        case 1:
          el.children[0].append(this.getAvatar('/../../../assets/img/homePage/zozuliak.jpg', 'dmytro'));
          githubLink = el.children[1].children[0] as HTMLAnchorElement;
          githubLink.href = 'https://github.com/dmytrozozuliak';
          el.children[person].textContent = 'Дмитрий Зозуляк';
          el.children[role].textContent = 'Frontend Engineer';
          el.children[contribution].innerHTML = `
          <ul>
            <li>Авторизация пользователя</li>
            <li>Методы API</li>
            <li>Игра "Аудиовызов"</li>
          </ul>`;
          break;
        case 2:
          el.children[0].append(this.getAvatar('/../../../assets/img/homePage/essonti.png', 'sergei'));
          githubLink = el.children[1].children[0] as HTMLAnchorElement;
          githubLink.href = 'https://github.com/Essonti';
          el.children[person].textContent = 'Сергей Трофимченко';
          el.children[role].textContent = 'Frontend Engineer';
          el.children[contribution].innerHTML = `
          <ul>
            <li>Дизайн</li>
            <li>Игра "Спринт"</li>
            <li>Главная страница</li>
          </ul>`;
          break;
      }
    });
  }


  private getAvatar(path: string, name: string) {
    const avatarImg = document.createElement('img');
    avatarImg.src = `${path}`;
    avatarImg.onload = () => {
      avatarImg.alt = `teem member ${name}`;
      avatarImg.className = `member-wrapper__avatar_${name}`;
    };
    return avatarImg;
  }

  private getGithubSvg(color: string) {
    const githubSvg = `
    <svg class="github-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 1000 1000" enable-background="new 0 0 1000 1000" xml:space="preserve">
      <g><path fill="${color}" d="M984.3,512c0,106.8-31.2,202.8-93.5,288.1C828.5,885.3,748,944.3,649.3,977.1c-11.5,2.1-19.9,0.6-25.2-4.5s-8-11.5-8-19.1V818.9c0-41.3-11.1-71.5-33.2-90.6c24.2-2.6,46-6.4,65.4-11.5c19.4-5.1,39.3-13.4,60-24.9c20.6-11.5,37.9-25.6,51.7-42.4c13.8-16.8,25.1-39.1,33.8-67c8.7-27.9,13.1-59.9,13.1-96c0-51.5-16.8-95.3-50.4-131.4c15.7-38.7,14-82.1-5.1-130.2c-11.9-3.8-29.1-1.5-51.7,7c-22.5,8.5-42.1,17.9-58.7,28.1l-24.2,15.3c-39.6-11.1-80.4-16.6-122.5-16.6c-42.1,0-82.9,5.5-122.5,16.6c-6.8-4.7-15.8-10.4-27.1-17.2c-11.3-6.8-29-15-53.3-24.6c-24.2-9.6-42.5-12.4-54.9-8.6c-18.7,48.1-20.2,91.4-4.5,130.2c-33.6,36.2-50.4,80-50.4,131.4c0,36.2,4.4,68.1,13.1,95.7c8.7,27.6,19.9,50,33.5,67c13.6,17,30.7,31.3,51.4,42.7c20.6,11.5,40.6,19.8,60,24.9c19.4,5.1,41.2,8.9,65.4,11.5c-17,15.3-27.4,37.2-31.3,65.7c-8.9,4.3-18.5,7.4-28.7,9.6c-10.2,2.1-22.3,3.2-36.4,3.2c-14,0-28-4.6-41.8-13.7c-13.8-9.1-25.6-22.4-35.4-39.9c-8.1-13.6-18.4-24.7-30.9-33.2c-12.5-8.5-23.1-13.6-31.6-15.3l-12.8-1.9c-8.9,0-15.1,1-18.5,2.9c-3.4,1.9-4.5,4.4-3.2,7.3c1.3,3,3.2,6,5.7,8.9c2.6,3,5.3,5.5,8.3,7.7l4.5,3.2c9.4,4.3,18.6,12.3,27.8,24.2c9.1,11.9,15.8,22.8,20.1,32.5l6.4,14.7c5.5,16.2,14.9,29.2,28.1,39.2c13.2,10,27.4,16.4,42.7,19.1c15.3,2.8,30.1,4.3,44.3,4.5s26.1-0.5,35.4-2.2l14.7-2.6c0,16.2,1.1,35.1,3.2,56.8c2.1,21.7,3.2,33.2,3.2,34.5c0,7.7-2.8,14-8.3,19.1c-5.5,5.1-14,6.6-25.5,4.5c-98.7-32.8-179.2-91.8-241.5-177.1S10,618.7,10,512c0-88.9,21.9-170.9,65.7-246C119.5,190.9,179,131.5,254,87.7C329.1,43.9,411.1,22,500,22c88.9,0,170.9,21.9,246,65.7C821,131.5,880.5,190.9,924.3,266c43.8,75.1,65.7,157.1,65.7,246H984.3z"/></g>
    </svg>
    `;
    return githubSvg;
    // #ff0000 - красный цвет при наведении
  }

  public listenEvents(): void {

  }

}