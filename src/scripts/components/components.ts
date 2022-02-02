
import BaseComponent from './base';
import PageOne from './pageOne';
import PageTwo from './pageTwo';
import Sample from './pageOne/sample';

export const components: {
  [n: string]: { new(elem: HTMLElement): PageOne | PageTwo | Sample }
} = {
  pageOne: PageOne,
  pageTwo: PageTwo,
  sample: Sample,
};

export const instances: {
  [name: string]: BaseComponent | PageOne | PageTwo | Sample,
} = {

};