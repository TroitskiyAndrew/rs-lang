import { User, Authorization, WordCard, UserId, UserWord, PaginatedResults, Statistics, APISStatus } from './api.types';
import { updateState, getState } from '../state';
import constants from '../app.constants';

// export const baseUrl = 'http://127.0.0.1:3000';
export const baseUrl = 'https://rs-learning-words.herokuapp.com';
const signIn = `${baseUrl}/signin`;
const users = `${baseUrl}/users`;
const words = `${baseUrl}/words`;

class ApiResourceService {

  // !Words
  // Всего 6 групп(от 0 до 5) и в каждой группе по 30 страниц(от 0 до 29). В каждой странице по 20 слов. Группы разбиты по сложности от самой простой(0) до самой сложной(5)
  async getChunkOfWords(page: number, group: number): Promise<WordCard[]> {
    const response = await fetch(
      `${words}?page=${page}&group=${group}`,
    );
    const wordsResult: WordCard[] = await response.json();
    return wordsResult;
  }

  async getChunkOfWordsGroup(group: number): Promise<WordCard[]> {
    const minPage = constants.minWordsPage;
    const maxPage = constants.maxWordsPage;

    const allPromises: Promise<WordCard[]>[] = [];
    for (let i = minPage; i <= maxPage; i++) {
      allPromises.push(this.getChunkOfWords(i, group));
    }
    return (await Promise.all(allPromises)).flat();
  }

  // Get word by Id
  async getWord(id: string): Promise<WordCard> {
    const response = await fetch(
      `${words}/${id}`,
    );
    const wordResult = await response.json();
    return wordResult;
  }

  // !User
  async createUser(user: User): Promise<void | number> {
    const rawResponse = await fetch(`${users}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (rawResponse.status === APISStatus.ok) {
      return rawResponse.json();
    } else {
      return rawResponse.status;
    }
  }

  async loginUser(user: User): Promise<Authorization | number> {
    const rawResponse = await fetch(`${signIn}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (rawResponse.status === APISStatus.ok) {
      const authorization: Authorization = await rawResponse.json();
      const { refreshToken, token, userId, name } = authorization;
      updateState({
        token: token,
        refreshToken: refreshToken,
        userId: userId,
        userName: name,
      });
      return authorization;
    } else {
      return rawResponse.status;
    }
  }

  async getUser(userId: string): Promise<UserId | number> {
    const rawResponse = await fetch(`${users}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
      },
    });
    if (rawResponse.status === APISStatus.ok) {
      const user: UserId = await rawResponse.json();
      return user;
    } else {
      return rawResponse.status;
    }
  }

  async updateUser(userId: string, user: User): Promise<User | number> {
    const rawResponse = await fetch(`${users}/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (rawResponse.status === APISStatus.ok) {
      const updatedUser: User = await rawResponse.json();
      return updatedUser;
    } else {
      return rawResponse.status;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    await fetch(`${users}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
      },
    });

    updateState({
      token: '',
      refreshToken: '',
      userId: '',
    });
  }

  async getNewUserTokens(userId: string): Promise<Authorization | number> {
    const rawResponse = await fetch(`${users}/${userId}/tokens`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus.ok) {
      const authorization: Authorization = await rawResponse.json();
      const { refreshToken, token } = authorization;

      updateState({
        token: token,
        refreshToken: refreshToken,
      });
      return authorization;
    } else {
      return rawResponse.status;
    }
  }

  // !Users/Words
  async getAllUserWords(userId: string): Promise<UserWord[] | number> {
    const rawResponse = await fetch(`${users}/${userId}/words`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus.ok) {
      const userWords: UserWord[] = await rawResponse.json();
      return userWords;
    } else {
      return rawResponse.status;
    }
  }

  async createUserWord(userId: string, wordId: string, wordBody: UserWord): Promise<UserWord | number> {
    const rawResponse = await fetch(`${users}//${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordBody),
    });

    if (rawResponse.status === APISStatus.ok) {
      const createdWord: UserWord = await rawResponse.json();
      return createdWord;
    } else {
      return rawResponse.status;
    }
  }

  async getUserWord(userId: string, wordId: string): Promise<UserWord | number> {
    const rawResponse = await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus.ok) {
      const userWord: UserWord = await rawResponse.json();
      return userWord;
    } else {
      return rawResponse.status;
    }
  }

  async updateUserWord(userId: string, wordId: string, wordBody: UserWord): Promise<UserWord | number> {
    const rawResponse = await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordBody),
    });

    if (rawResponse.status === APISStatus.ok) {
      const updatedUserWord: UserWord = await rawResponse.json();
      return updatedUserWord;
    } else {
      return rawResponse.status;
    }
  }

  async deleteUserWord(userId: string, wordId: string): Promise<void> {
    await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
      },
    });
  }

  // !Users/AggregatedWords
  async getAllUserAggregatedWords(userId: string): Promise<PaginatedResults | number> {
    const group = getState().aggregatedWords.group ? `&group=${getState().aggregatedWords.group}` : '';
    const page = getState().aggregatedWords.page ? `&page=${getState().aggregatedWords.page}` : '';
    const wordsPerPage = getState().aggregatedWords.wordsPerPage ? `&wordsPerPage=${getState().aggregatedWords.wordsPerPage}` : '';
    const filters = getState().aggregatedWords.filter ? `&filter=${getState().aggregatedWords.filter}` : '';
    const rawResponse = await fetch(`${users}/${userId}/aggregatedWords?${group}${page}${wordsPerPage}${filters}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus.ok) {
      const userWords: PaginatedResults = await rawResponse.json();
      return userWords;
    } else {
      return rawResponse.status;
    }
  }

  async getAggregatedWord(userId: string, wordId: string): Promise<UserWord | number> {
    const rawResponse = await fetch(`${users}/${userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus.ok) {
      const userWord: UserWord = await rawResponse.json();
      return userWord;
    } else {
      return rawResponse.status;
    }
  }

  // !Users/Statistic
  async getUserStatistics(userId: string): Promise<Statistics | number> {
    const rawResponse = await fetch(`${users}/${userId}/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus.ok) {
      const userStatistics: Statistics = await rawResponse.json();
      return userStatistics;
    } else {
      return rawResponse.status;
    }
  }

  async updateUserStatistics(userId: string, statisticsBody: Statistics): Promise<Statistics | number> {
    const rawResponse = await fetch(`${users}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statisticsBody),
    });

    if (rawResponse.status === APISStatus.ok) {
      const updatedUserStatistics: Statistics = await rawResponse.json();
      return updatedUserStatistics;
    } else {
      return rawResponse.status;
    }
  }
}

export const apiService = new ApiResourceService();


/*
import BaseComponent from '../../base';
import { pageChenging } from '../../../rooting';
import { createSpan, createDiv, createInput, createButton, getRandom } from '../../../utils';
import { apiService, baseUrl } from '../../../api/apiMethods';
// import { updateState, getState } from '../../../state';
import constants from '../../../app.constants';
import { WordCard } from '../../../api/api.types';
import { getState } from '../../../state';

interface IState {
  questionWords: WordCard[];
  translateWords: string[];
}
export default class AudioGame extends BaseComponent {
  test: HTMLElement | undefined;

  wordsFromAPI: Partial<IState> = {};

  page: number | undefined;

  group: number | undefined;


  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'audioGame';
  }

  public oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Аудио Игра' }), this.name);

    return Promise.resolve();
  }

  public createHTML(): void {
    this.test = createButton({
      text: 'test span Audio game',
    });
    const test2 = createButton({
      text: 'test 2',
      className: 'first-answer',
    });
    test2.onclick = async () => {
      const tokens = await apiService.getNewUserTokens(getState().userId);
      console.log('refresh tokens', tokens);
    };

    this.fragment.append(this.test);
    this.fragment.append(test2);
  }

  public listenEvents(): void {
    // (this.test as HTMLElement).addEventListener('click', this.showQuestion.bind(this, undefined));
  }
}

*/
