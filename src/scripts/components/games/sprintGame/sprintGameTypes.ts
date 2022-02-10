export interface IGameOptions {
  group: string;
  page?: string;
}

export interface IWordAndTranslation {
  word: string;
  wordTranslate: string;
  audio: string;
}

export interface IRoundResult {
  word: string;
  wordTranslate?: string;
  audio?: string;
  translateCorrectness?: boolean;
  answerCorrectness?: boolean;
}
