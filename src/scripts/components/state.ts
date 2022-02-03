type State = {
  [name: string]: string
};

const state: State = {
};

export function getState(): State {
  return state;
}

export function updateState(newState: Partial<State>): void {
  Object.assign(state, newState);
}