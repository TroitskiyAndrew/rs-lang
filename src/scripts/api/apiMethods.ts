import { IUser, Authorization, WordCard, UserId, UserWord, PaginatedResults, Statistics, APISStatus, Settings } from './api.types';
import { updateState, getState } from '../state';
import constants from '../app.constants';
import User from '../components/user';

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
  async createUser(user: IUser): Promise<void | number> {
    const rawResponse = await fetch(`${users}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (rawResponse.status === APISStatus['200']) {
      return rawResponse.json();
    } else {
      return rawResponse.status;
    }
  }

  async loginUser(user: IUser): Promise<Authorization | number> {
    const rawResponse = await fetch(`${signIn}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });

    if (rawResponse.status === APISStatus['200']) {
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
    if (rawResponse.status === APISStatus['200']) {
      const user: UserId = await rawResponse.json();
      return user;
    } else {
      return rawResponse.status;
    }
  }

  async updateUser(userId: string, user: IUser): Promise<IUser | number> {
    const rawResponse = await fetch(`${users}/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (rawResponse.status === APISStatus['200']) {
      const updatedUser: IUser = await rawResponse.json();
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
        'Authorization': `Bearer ${getState().refreshToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus['403']) {
      // exit from current user, show login? refresh page
      console.log('REFRESH TOKEN EXPIRED 403 error');
    }

    if (rawResponse.status === APISStatus['200']) {
      console.log('changing token , status ok "getNewUserTokens"');

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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.getAllUserWords(userId);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.createUserWord(userId, wordId, wordBody);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.getUserWord(userId, wordId);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.updateUserWord(userId, wordId, wordBody);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
      const updatedUserWord: UserWord = await rawResponse.json();
      return updatedUserWord;
    } else {
      return rawResponse.status;
    }
  }

  async deleteUserWord(userId: string, wordId: string): Promise<void> {
    const rawResponse = await fetch(`${users}/${userId}/words/${wordId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.deleteUserWord(userId, wordId);
      } else {
        this.whenRefreshTokenExpired();
      }
    }
  }

  // !Users/AggregatedWords
  async getAllUserAggregatedWords(userId: string, filters: string, wordsPerPage?: number, group?: number, page?: number): Promise<WordCard[] | number> {
    let pageQuery = '';
    if (page !== undefined) {
      pageQuery = `{"page": ${page}},`;
    }
    let groupQuery = '';
    if (group !== undefined) {
      groupQuery = `{"group": ${group}},`;
    }
    let perPageQuery = '';
    if (wordsPerPage !== undefined) {
      perPageQuery = `wordsPerPage=${wordsPerPage}`;
    }

    const rawResponse = await fetch(`${users}/${userId}/aggregatedWords?${perPageQuery}&filter={"$and": [${groupQuery} ${pageQuery} ${filters}]}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.getAllUserAggregatedWords(userId, filters, wordsPerPage, group, page);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
      const userWordsPagination: PaginatedResults[] = await rawResponse.json();
      const userWords = userWordsPagination[0].paginatedResults;
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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.getAggregatedWord(userId, wordId);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.getUserStatistics(userId);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
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

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.updateUserStatistics(userId, statisticsBody);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
      const updatedUserStatistics: Statistics = await rawResponse.json();
      return updatedUserStatistics;
    } else {
      return rawResponse.status;
    }
  }

  // !Users/Settings
  async getUserSettings(userId: string): Promise<Settings | number> {
    const rawResponse = await fetch(`${users}/${userId}/settings`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.getUserSettings(userId);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
      const userSettings: Settings = await rawResponse.json();
      return userSettings;
    } else {
      return rawResponse.status;
    }
  }

  async updateUserSettings(userId: string, settingsBody: Settings): Promise<Settings | number> {
    const rawResponse = await fetch(`${users}/${userId}/settings`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getState().token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settingsBody),
    });

    if (rawResponse.status === APISStatus['401'] || rawResponse.status === APISStatus['402']) {
      const tokenResponse = await this.getNewUserTokens(getState().userId);
      if (typeof (tokenResponse) !== 'number') {
        console.log('token updated!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        await this.updateUserSettings(userId, settingsBody);
      } else {
        this.whenRefreshTokenExpired();
      }
    }

    if (rawResponse.status === APISStatus['200']) {
      const updatedUserSettings: Settings = await rawResponse.json();
      return updatedUserSettings;
    } else {
      return rawResponse.status;
    }
  }

  async whenRefreshTokenExpired() {
    localStorage.clear();
    User.logOutUser();
    console.log('token didn\'t update! Exit User from REGISTRATION and clear local!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }

}

export const apiService = new ApiResourceService();
