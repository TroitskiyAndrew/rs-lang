// ToDo-1 Временно зачищаем localStorage при каждом запуске приложения, чтобы не хватать проблем с изменением состава state
// Убрать, когда окончательно финализируем состава state
// localStorage.clear();

type State = {
  currentPage: string,
  dictionaryPage: number,
  dictionaryGroup: number,
  userName: string,
  userEmail: string,
  userPassword: string,
  userId: string,
  token: string,
  refreshToken: string,
  launchGame: string,
  aggregatedWords: AggregatedWords;
  optionsSprint: string;
  learnedPages: string[];
};
interface AggregatedWords {
  page: number;
  group: number;
  wordsPerPage: number;
  filter: string;
}

export const defaultState: State = {
  currentPage: 'pageHome',
  dictionaryPage: 0,
  dictionaryGroup: 0,
  userName: '',
  userEmail: '',
  userPassword: '',
  userId: '',
  token: '',
  refreshToken: '',
  launchGame: '',
  aggregatedWords: {
    page: 0,
    group: 1,
    wordsPerPage: 3,
    filter: '{"$or":[{"userWord.difficulty":"easy"},{"userWord":null}]}',
  },
  optionsSprint: '',
  learnedPages: [],
};

export function getState(): State {
  const state = localStorage.getItem('rs-lang-12341') ? JSON.parse(localStorage.getItem('rs-lang-12341') as string) : defaultState;
  return state;
}

export function updateState(newState: Partial<State>): void {
  const state = getState();
  Object.assign(state, newState);
  localStorage.setItem('rs-lang-12341', JSON.stringify(state));
}
