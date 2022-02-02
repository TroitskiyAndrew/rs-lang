
import BaseComponent from './base';
import PageOne from './pageOne';
import PageTwo from './pageTwo';
import Sample from './pageOne/sample';
import PageDictionary from './pageDictionary';
import WordCard from './pageDictionary/wordCard';

export const components: {
  [n: string]: { new(elem: HTMLElement): PageOne | PageTwo | Sample | PageDictionary | WordCard }
} = {
  pageOne: PageOne,
  pageTwo: PageTwo,
  sample: Sample,
  pageDictionary: PageDictionary,
  wordCard: WordCard,
};

export const instances: {
  [name: string]: BaseComponent | PageOne | PageTwo | Sample | PageDictionary | WordCard,
} = {

};