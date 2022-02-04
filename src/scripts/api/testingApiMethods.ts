import { apiService, baseUrl } from './apiMethods';
import { getState } from '../state';

import { createButton, createSpan, createDiv } from '../utils';

// todo
const main = document.querySelector('main');
const btnTest = createButton({ text: 'Test method API' });
document.body.append(btnTest);

btnTest.onclick = async () => {
  // createUser пароль не менее 8 символов
  // console.log('creating...');
  // await apiService.createUser({ 'email': 'hello6@user.com', 'password': 'hello111' });

  // loginUser
  console.log('log in...');
  await apiService.loginUser({ 'email': 'hello6@user.com', 'password': 'hello111' });

  // const user = await apiService.getUser(apiService.state.userId);
  console.log(getState());

  // console.log('getting NewUserTokens...');
  // await apiService.getNewUserTokens(apiService.state.userId);

  // console.log('deleting...');
  // await apiService.deleteUser(apiService.state.userId);
  // console.log(apiService.state);

  // console.log('updating UserInfo...');
  // await apiService.updateUser(apiService.state.userId, {
  //   email: 'testEmail@mail.com',
  //   password: 'stringString',
  // });

  // getWords(on page\group)
  await apiService.getChunkOfWords(getState().dictionaryPage, getState().dictionaryGroup);

  // getWord
  const WordNumberExample = '5e9f5ee35eb9e72bc21af4a0';
  const word1 = await apiService.getWord(WordNumberExample);
  // show Word
  const outSpan = createSpan({ text: '"______"' });
  outSpan.innerHTML = word1.textMeaning;
  main?.append(outSpan);
  const image = createDiv({});
  // const image = document.createElement('img');


  image.classList.add('TestImg');
  image.style.width = '200px';
  image.style.height = '200px';
  image.style.backgroundImage = `url(${baseUrl}/${word1.image})`;
  main?.append(image);

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
  console.log('getting user word...');
  const userWord = await apiService.getUserWord(getState().userId, '61fbde05b8642c14341588c5');
  console.log(userWord);


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
  console.log('getting statistics...');
  const statistics = await apiService.getUserStatistics(getState().userId);
  console.log(statistics);

};
