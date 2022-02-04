import { User, Authorization, WordCard, UserId, UserWord, PaginatedResults, Statistics, State } from './api.types';

export const baseUrl = 'http://127.0.0.1:3000';
// export const baseUrl = 'https://rs-learning-words.herokuapp.com';
const signIn = `${baseUrl}/signin`;
const users = `${baseUrl}/users`;
const words = `${baseUrl}/words`;

class ApiResourceService {

  private _state: State = {
    page: 0,
    group: 0,
    aggregatedWords: {
      page: 0,
      group: 1,
      wordsPerPage: 3,
      filter: '{"$or":[{"userWord.difficulty":"easy"},{"userWord":null}]}',
    },
    userId: '',
    token: '',
    refreshToken: '',
  };

  get state(): State {
    return this._state;
  }

  set state(newState: State) {
    this._state = newState;
  }

  // !Words
  // Всего 6 групп(от 0 до 5) и в каждой группе по 30 страниц(от 0 до 29). В каждой странице по 20 слов. Группы разбиты по сложности от самой простой(0) до самой сложной(5)
  async getChunkOfWords(page: number, group: number): Promise<WordCard[]> {
    const response = await fetch(
      `${words}?page=${page}&group=${group}`,
    );
    const wordsResult = await response.json();
    // console.log(wordsResult);
    return wordsResult;
  }

  // Get word by Id
  async getWord(id: string): Promise<WordCard> {
    const response = await fetch(
      `${words}/${id}`,
    );
    const wordResult = await response.json();
    // console.log(wordResult);
    return wordResult;
  }

  // !User
  async createUser(user: User): Promise<void> {
    const rawResponse = await fetch(`${users}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const content = await rawResponse.json();

    // console.log(content);
  }

  async loginUser(user: User): Promise<Authorization> {
    const rawResponse = await fetch(`${signIn}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const authorization: Authorization = await rawResponse.json();
    const { refreshToken, token, userId } = authorization;
    this.state.token = token;
    this.state.refreshToken = refreshToken;
    this.state.userId = userId;

    return authorization;
  }

  async getUser(userId: string): Promise<UserId> {
    const rawResponse = await fetch(`${users}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
      },
    });
    const userResult: UserId = await rawResponse.json();
    return userResult;
  }

  async updateUser(userId: string, user: User): Promise<User> {
    const rawResponse = await fetch(`${users}/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    const updatedUser: User = await rawResponse.json();
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    await fetch(`${users}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
      },
    });

    this.state.userId = '';
    this.state.token = '';
    this.state.refreshToken = '';
  }

  async getNewUserTokens(userId: string): Promise<Authorization> {
    const rawResponse = await fetch(`${users}/${userId}/tokens`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const authorization: Authorization = await rawResponse.json();
    const { refreshToken, token } = authorization;
    this.state.token = token;
    this.state.refreshToken = refreshToken;

    return authorization;
  }

  // !Users/Words
  async getAllUserWords(userId: string): Promise<UserWord[]> {
    const rawResponse = await fetch(`${users}/${userId}/words`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userWords: UserWord[] = await rawResponse.json();

    // console.log(userWords);
    return userWords;
  }

  async createUserWord(userId: string, wordId: string, wordBody: UserWord) {
    const rawResponse = await fetch(`${users}//${userId}/words/${wordId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordBody),
    });
    const content = await rawResponse.json();

    // console.log(content);
  }

  async getUserWord(userId: string, wordId: string): Promise<UserWord> {
    const rawResponse = await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userWord = await rawResponse.json();

    // console.log(userWord);
    return userWord;
  }

  async updateUserWord(userId: string, wordId: string, wordBody: UserWord): Promise<UserWord> {
    const rawResponse = await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wordBody),
    });
    const updatedUserWord: UserWord = await rawResponse.json();
    return updatedUserWord;
  }

  async deleteUserWord(userId: string, wordId: string): Promise<void> {
    await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
      },
    });
  }

  // !Users/AggregatedWords
  async getAllUserAggregatedWords(userId: string): Promise<PaginatedResults> {
    const group = this.state.aggregatedWords.group ? `&group=${this.state.aggregatedWords.group}` : '';
    const page = this.state.aggregatedWords.page ? `&page=${this.state.aggregatedWords.page}` : '';
    const wordsPerPage = this.state.aggregatedWords.wordsPerPage ? `&wordsPerPage=${this.state.aggregatedWords.wordsPerPage}` : '';
    const filters = this.state.aggregatedWords.filter ? `&filter=${this.state.aggregatedWords.filter}` : '';
    const rawResponse = await fetch(`${users}/${userId}/aggregatedWords?${group}${page}${wordsPerPage}${filters}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userWords: PaginatedResults = await rawResponse.json();

    // console.log(userWords);
    return userWords;
  }

  async getAggregatedWord(userId: string, wordId: string): Promise<UserWord> {
    const rawResponse = await fetch(`${users}/${userId}/aggregatedWords/${wordId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userWord = await rawResponse.json();

    // console.log(userWord);
    return userWord;
  }

  // !Users/Statistic
  async getUserStatistics(userId: string): Promise<Statistics> {
    const rawResponse = await fetch(`${users}/${userId}/statistics`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const userStatistics: Statistics = await rawResponse.json();

    // console.log(userStatistics);
    return userStatistics;
  }

  async updateUserStatistics(userId: string, statisticsBody: Statistics): Promise<Statistics> {
    const rawResponse = await fetch(`${users}/${userId}/statistics`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.state.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statisticsBody),
    });
    const updatedUserStatistics: Statistics = await rawResponse.json();
    return updatedUserStatistics;
  }
}

export const apiService = new ApiResourceService();
