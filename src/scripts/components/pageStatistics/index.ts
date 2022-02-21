import BaseComponent from '../base';
import { createDiv, createSpan, getTodayCount, updateObjDate } from '../../utils';
import { pageChenging } from '../../rooting';
import c3, { Primitive } from 'c3';
import { apiService } from '../../api/apiMethods';
import { Statistics } from '../../api/api.types';
import { getState } from '../../state';
import constants from '../../app.constants';

export default class PageStatistics extends BaseComponent {
  statistic: Statistics | undefined;

  userId = '';

  constructor(elem: HTMLElement) {
    super(elem);
    this.name = 'pageStatistics';
    this.statistic = undefined;
    this.userId = getState().userId;
  }

  public async oninit(): Promise<void> {
    pageChenging(createSpan({ text: 'Статистика' }), this.name);

    const apiStatistic = await apiService.getUserStatistics(this.userId);
    const defaultStatistic: Statistics = {
      learnedWords: 0,
      optional: {
        learnedWordsPerDate: updateObjDate(undefined, 0),
        newWordsPerDayAudio: updateObjDate(undefined, 0),
        newWordsPerDaySprint: updateObjDate(undefined, 0),
      },
    };
    this.statistic = typeof apiStatistic !== 'number' ? apiStatistic : defaultStatistic;
    this.drawDayStatistic();
    this.drawAllStatistic();

    return Promise.resolve();
  }

  public createHTML(): void {
    const page = createDiv({ className: 'page statistics' });
    const holder = createDiv({ className: 'statistics__holder' });

    holder.append(createSpan({ className: 'statistics__text', text: 'Результаты дня' }));
    holder.append(createDiv({ className: 'statistics__chart day-statistic' }));
    holder.append(createSpan({ className: 'statistics__text', text: 'Общие результаты' }));
    holder.append(createDiv({ className: 'statistics__chart all-statistic' }));
    page.append(holder);
    this.fragment.append(page);
  }

  private drawDayStatistic(): void {
    const rightAnswerColumn: [string, ...Primitive[]] = ['Правильные ответы, %'];
    const allAudioAnswers = getTodayCount(this.statistic?.optional.answersAudio);
    const correctAudioAnswers = getTodayCount(this.statistic?.optional.correctAnswersAudio);
    const allSprintAnswers = getTodayCount(this.statistic?.optional.answersSprint);
    const correctSprintAnswers = getTodayCount(this.statistic?.optional.correctAnswersSprint);
    if (allAudioAnswers === 0) {
      rightAnswerColumn.push(0);
    } else {
      rightAnswerColumn.push(Math.floor((correctAudioAnswers / allAudioAnswers) * constants.hundred));
    }
    if (allSprintAnswers === 0) {
      rightAnswerColumn.push(0);
    } else {
      rightAnswerColumn.push(Math.floor((correctSprintAnswers / allSprintAnswers) * constants.hundred));
    }
    if (allSprintAnswers + allAudioAnswers === 0) {
      rightAnswerColumn.push(0);
    } else {
      rightAnswerColumn.push(Math.floor(((correctSprintAnswers + correctAudioAnswers) / (allSprintAnswers + allAudioAnswers)) * constants.hundred));
    }

    const newWordsAudio = getTodayCount(this.statistic?.optional.newWordsPerDayAudio);
    const newWordsSprint = getTodayCount(this.statistic?.optional.newWordsPerDaySprint);


    c3.generate({
      bindto: '.day-statistic',
      data: {
        x: 'x',
        columns: [
          ['Изучено слов, шт', null, null, getTodayCount(this.statistic?.optional.learnedWordsPerDate)],
          ['x', 'игра Аудио', 'игра Спринт', 'Итоги дня'],
          ['Новые слова, шт', newWordsAudio, newWordsSprint, newWordsAudio + newWordsSprint],
          rightAnswerColumn,
          ['Серия правильных ответов, max', this.statistic?.optional.correctAnswersRangeAudio || 0, this.statistic?.optional.correctAnswersRangeSprint || 0, null],
        ],
        type: 'bar',
      },
      axis: {
        x: {
          type: 'category',
        },
      },
    });
  }

  private drawAllStatistic(): void {
    const learnedWords = updateObjDate(this.statistic?.optional.learnedWordsPerDate, 0);
    const newdWordsAudio = updateObjDate(this.statistic?.optional.newWordsPerDayAudio, 0);
    const newdWordsSprint = updateObjDate(this.statistic?.optional.newWordsPerDaySprint, 0);
    const allDays: string[] = Array.from(new Set([...Object.keys(learnedWords), ...Object.keys(newdWordsAudio), ...Object.keys(newdWordsSprint)].sort((a: string, b: string) => new Date(a).valueOf() - new Date(b).valueOf())));
    c3.generate({
      bindto: '.all-statistic',
      data: {
        x: 'x',
        columns: [
          ['x', ...allDays],
          ['Новые слова', ...allDays.map((day: string) => (newdWordsAudio[day] || 0) + (newdWordsSprint[day] || 0))],
          ['Выученные слова', ...allDays.map((day: string) => learnedWords[day] || 0)],
        ],
        type: 'line',
      },
      axis: {
        x: {
          type: 'category',
        },
      },
    });
  }

}