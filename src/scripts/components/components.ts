
import PageHome from './pageHome';
import PageGames from './pageGames';
import PageDictionary from './pageDictionary';
import PageStatistics from './pageStatistics';
import Menu from './menu';
import Header from './header';
import SprintGame from './games/sprintGame';
import AudioGame from './games/audioGame';
import WordsCard from './pageDictionary/wordCard';
import User from './user';



export const components: {
  [n: string]: { new(elem: HTMLElement): PageHome | PageGames | PageDictionary | PageStatistics | Menu | Header | SprintGame | AudioGame | WordsCard | User }
} = {
  pageHome: PageHome,
  pageGames: PageGames,
  pageDictionary: PageDictionary,
  pageStatistics: PageStatistics,
  menu: Menu,
  header: Header,
  sprintGame: SprintGame,
  audioGame: AudioGame,
  wordsCard: WordsCard,
  user: User,
};

export const instances: {
  [name: string]: PageHome | PageGames | PageDictionary | PageStatistics | Menu | Header | SprintGame | AudioGame | WordsCard | User
} = {

};