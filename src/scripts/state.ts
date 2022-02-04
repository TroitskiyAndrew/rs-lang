type State = {
  [name: string]: string
};

const defaultState: State = {
  currentPage: 'pageHome',
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