export interface User {
  name?: string,
  email: string,
  password: string;
}
export interface UserId {
  id: string,
  email: string,
}
export interface Authorization {
  message: string,
  refreshToken: string,
  token: string,
  userId: string,
}
export interface WordCard {
  audio: string,
  audioExample: string,
  audioMeaning: string,
  group: number,
  id: string,
  image: string,
  page: number,
  textExample: string,
  textExampleTranslate: string,
  textMeaning: string,
  textMeaningTranslate: string,
  transcription: string,
  word: string,
  wordTranslate: string,
}
export interface UserWord {
  difficulty: string,
  optional?: {
    [key: string]: string | boolean;
  };
}
export interface State {
  page: number,
  group: number,
  aggregatedWords: {
    page: number,
    group: number,
    wordsPerPage: number,
    filter: string,
  },
  userId: string,
  token: string,
  refreshToken: string,
}
export interface PaginatedResults {
  paginatedResults: WordCard[],
  totalCount: [
    {
      count: number,
    },
  ];
}
export interface Statistics {
  learnedWords: number,
  optional?: {
    [key: string]: string | boolean;
  };
}

/* export enum EEngineStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
} */
