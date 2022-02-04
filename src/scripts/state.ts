type State = {
  currentPage: string,
  dictionaryPage: number,
  dictionaryGroup: number,
  userId: string,
  token: string,
  refreshToken: string,
  aggregatedWords: AggregatedWords;
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
  userId: '',
  token: '',
  refreshToken: '',
  aggregatedWords: {
    page: 0,
    group: 1,
    wordsPerPage: 3,
    filter: '{"$or":[{"userWord.difficulty":"easy"},{"userWord":null}]}',
  },
};

export function getState(): State {
  const state = localStorage.getItem('rs-lang') ? JSON.parse(localStorage.getItem('rs-lang') as string) : defaultState;
  return state;
}

export function updateState(newState: Partial<State>): void {
  const state = getState();
  Object.assign(state, newState);
  localStorage.setItem('rs-lang', JSON.stringify(state));
}
