import { IStatisticAnswer } from '../audioGame/index'

export interface IGameOptions {
  group: string;
  page?: string;
}

export interface IWordParams extends IStatisticAnswer {
  translateCorrectness?: boolean,
}

export interface IScoreCounter {
  score: number;
  multiplyer: number;
  multiplyerIntermediateCounter: number; 
}