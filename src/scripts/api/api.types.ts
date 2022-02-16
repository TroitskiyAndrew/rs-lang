export const APISStatus = {
  'ok': 200,
  '401': 401,
  '402': 402,
};
export interface User {
  name?: string,
  email: string,
  password: string;
}
export interface UserId {
  name: string,
  id: string,
  email: string,
}
export interface Authorization {
  message: string,
  name: string,
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
  difficulty?: 'common' | 'difficult' | string,
  optional?: {
    new?: boolean,
    learned?: boolean,
    rightRange?: number,
    word?: string,
    correctAnswersAllTime?: number,
    answersAllTime?: number,
  };
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
  learnedWords?: number,
  optional?: {
    correctAnswersSprint?: DateNumber,
    correctAnswersAudio?: DateNumber,
    answersSprint?: DateNumber,
    answersAudio?: DateNumber,
    correctAnswersRangeSprint?: number,
    correctAnswersRangeAudio?: number,
    // [key: string]: string | boolean | { [x: string]: number; }[];
  };
}
export interface DateNumber {
  [x: string]: number;
}
export interface DateBoolean {
  [x: string]: boolean;
}

export interface Settings {
  wordsPerDay?: number,
  optional?: {
    [key: string]: string | boolean | number;
  };
}
