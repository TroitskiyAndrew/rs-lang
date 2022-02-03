
import PageHome from './pageHome';
import PageGames from './pageGames';
import PageDictionary from './pageDictionary';
import PageStatistics from './pageStatistics';
import Menu from './menu';
import Header from './header';
import SprintGame from './games/sprintGame';
import AudioGame from './games/audioGame';
import WordCard from './pageDictionary/wordCard'



export const components: {
  [n: string]: { new(elem: HTMLElement): PageHome | PageGames | PageDictionary | PageStatistics | Menu | Header | SprintGame | AudioGame | WordCard}
} = {
};

export const instances: {
  [name: string]: PageHome | PageGames | PageDictionary | PageStatistics | Menu | Header | SprintGame | AudioGame | WordCard,
} = {

};