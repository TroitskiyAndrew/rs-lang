import { IStatisticAnswer } from '../audioGame/index'

export interface IGameOptions {
  group: string;
  page?: string;
}

// export interface IWordAndTranslation {
//   word: string;
//   wordTranslate: string;
//   audio: string;
// }

export interface IWordParams extends IStatisticAnswer {
  // id: string,
  // audio: string,
  // group: number,
  // image: string,
  // page: number,
  // word: string,
  // wordTranslate: string,
  // answerCorrectness: boolean,
  translateCorrectness?: boolean,
}



export interface IScoreCounter {
  score: number;
  multiplyer: number;
  multiplyerIntermediateCounter: number; 
}