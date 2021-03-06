export const APISStatus = {
  '200': 200,
  '401': 401,
  '402': 402,
  '403': 403,
};
export interface IUser {
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
  userWord?: UserWord,
  _id?: string,
}

export interface UserWord {
  difficulty?: 'common' | 'difficult' | string,
  optional: {
    new?: boolean,
    learned?: boolean,
    rightRange?: number,
    word?: string,
    correctAnswersAllTime?: number,
    answersAllTime?: number,
    newAtDay?: string,
    newFrom?: 'audioGame' | 'sprintGame';
  },
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
  optional: {
    correctAnswersSprint?: DateNumber,
    correctAnswersAudio?: DateNumber,
    answersSprint?: DateNumber,
    answersAudio?: DateNumber,
    correctAnswersRangeSprint?: number,
    correctAnswersRangeAudio?: number,
    rangeMultiplyAudio?: boolean,
    rangeMultiplySprint?: boolean,
    learnedWordsPerDate?: DateNumber,
    newWordsPerDayAudio?: DateNumber,
    newWordsPerDaySprint?: DateNumber,
  },
  id?: string,
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
