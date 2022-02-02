
import BaseComponent from './base';

export const components: {
  [n: string]: { new(elem: HTMLElement): BaseComponent }
} = {
};

export const instances: {
  [name: string]: BaseComponent
} = {

};