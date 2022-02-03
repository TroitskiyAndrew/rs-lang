import { apiService } from './apiMethods';
import { createButton, createSpan } from '../utils';

// todo
const btnTest = createButton({ text: 'Test method API' });
const outSpan = createSpan({ text: '"______"' });

// document.body.append(btnTest);
// document.body.append(outSpan);
btnTest.onclick = async () => {
  // createUser пароль не менее 8 символов
  // console.log('creating...');
  // await apiService.createUser({ 'email': 'hello6@user.com', 'password': 'hello111' });

  // loginUser
  // console.log('log in...');
  // await apiService.loginUser({ 'email': 'hello6@user.com', 'password': 'hello111' });

  // const user = await apiService.getUser(apiService.state.userId);
  // console.log(apiService.state);

  // console.log('deleting...');
  // await apiService.deleteUser(apiService.state.userId);
  // console.log(apiService.state);

  // console.log('updating UserInfo...');
  // await apiService.updateUser(apiService.state.userId, {
  //   email: 'testEmail@mail.com',
  //   password: 'stringString',
  // });

  // getWords(on page\group)
  // await apiService.getChunkOfWords(apiService.state.page, apiService.state.group);

  // getWord
  // const WordNumberExample = '5e9f5ee35eb9e72bc21af4a0';
  // const word1 = await apiService.getWord(WordNumberExample);
  // outSpan.innerHTML = word1.textMeaning;

  // {
  //   "id": "61fbde05b8642c14341588c5",
  //   "difficulty": "vey hard",
  //   "wordId": "5e9f5ee35eb9e72bc21af4a0"
  // }

  // create UserWord
  // await apiService.createUserWord(
  //   apiService.state.userId,
  //   '61fbde05b8642c14341588c5',
  //   { difficulty: 'vey hard' });

  // get UserWord
  // await apiService.getUserWord(apiService.state.userId, '61fbde05b8642c14341588c5');

  // get AllUserWords
  // await apiService.getAllUserWords(apiService.state.userId);

  // update UserWord
  // await apiService.updateUserWord(
  //   apiService.state.userId,
  //   '61fbde05b8642c14341588c5',
  //   {
  //     difficulty: 'not hard',
  //     optional:
  //       { isRepeated: true },
  //   },
  // );

  // get UserWord
  // await apiService.getUserWord(apiService.state.userId, '61fbde05b8642c14341588c5');

  // delete UserWord
  // await apiService.deleteUserWord(apiService.state.userId, '61fbde05b8642c14341588c5');

  // await apiService.getAllUserAggregatedWords('61fbea36b8642c14341588ce');

  // await apiService.getAggregatedWord('61fbea36b8642c14341588ce', '5e9f5ee35eb9e72bc21af6f8');

  // set statistics
  // await apiService.updateUserStatistics(apiService.state.userId,
  //   {
  //     learnedWords: 23,
  //     optional: {
  //       'learn more': 'one more day',
  //     },
  //   });
  // get statistics
  // await apiService.getUserStatistics(apiService.state.userId);

};
