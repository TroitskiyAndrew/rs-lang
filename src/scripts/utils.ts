import { DateNumber } from './api/api.types';
import { TableHeader, DivOptions, SpanOptions, ButtonOptions, InputOptions } from './common.types';
import { instances } from './components/components';
import Menu from './components/menu';

export function createDiv(options: DivOptions): HTMLDivElement {
  const div: HTMLDivElement = document.createElement('div');

  if (options.className) {
    div.className = options.className;
  }
  if (options.dataSet) {
    for (const key of Object.keys(options.dataSet)) {
      div.dataset[key] = options.dataSet[key];
    }
  }

  return div;
}
export function createSpan(options: SpanOptions): HTMLSpanElement {
  const span: HTMLSpanElement = document.createElement('span');

  if (options.className) {
    span.className = options.className;
  }
  if (options.text) {
    span.textContent = options.text;
  }

  return span;
}
export function createButton(options: ButtonOptions): HTMLButtonElement {
  const button: HTMLButtonElement = document.createElement('button');

  button.textContent = options.text || '';
  if (options.className) {
    button.className = options.className;
  }
  if (options.action) {
    button.dataset.action = options.action;
  }
  if (options.dataSet) {
    for (const key of Object.keys(options.dataSet)) {
      button.dataset[key] = options.dataSet[key];
    }
  }
  if (options.disabled) {
    button.disabled = true;
  }

  return button;
}
export function createInput(options: InputOptions): HTMLInputElement {
  const input: HTMLInputElement = document.createElement('input');

  if (options.className) {
    input.className = options.className;
  }
  if (options.type) {
    input.type = options.type;
  }
  if (options.placeholder) {
    input.placeholder = options.placeholder;
  }
  if (options.value) {
    input.value = options.value;
  }
  if (options.required) {
    input.required = options.required;
  }
  return input;
}

export function createTable(headers: TableHeader[], className?: string): HTMLTableElement {
  const table: HTMLTableElement = document.createElement('table');
  const colGroup: HTMLElement = document.createElement('colgroup');
  const body: HTMLElement = document.createElement('tbody');
  const headersRow: HTMLTableRowElement = document.createElement('tr');
  headersRow.classList.add('head');

  if (className) {
    table.className = className;
  }
  table.append(colGroup);
  body.append(headersRow);
  table.append(body);

  for (const header of headers) {
    const headerElem: HTMLElement = document.createElement('th');

    colGroup.append(document.createElement('col'));
    headerElem.textContent = header.header;
    if (header.sort) {
      headerElem.dataset.sort = header.sort;
    }
    headersRow.append(headerElem);

  }
  return table;
}

export function addRow(table: HTMLTableElement, cells: HTMLElement[]): void {
  const newRow: HTMLTableRowElement = document.createElement('tr');

  table.append(newRow);
  for (const cell of cells) {
    const cellElem: HTMLElement = document.createElement('td');

    cellElem.append(cell);
    newRow.append(cellElem);
  }
}

export function getRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

export function closeMenu(): void {
  const menuElem = document.querySelector('[data-widget="menu"]') as HTMLElement;
  const widgetId = menuElem.dataset.widgetId as string;
  const widget = instances[widgetId] as Menu;
  widget.hideMenu();
}

export function shuffleArray<T>(array: Array<T>) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export function updateObjDate(dateObj: DateNumber | undefined, dateValue: number): DateNumber {
  const currentDate = new Date();
  const date = currentDate.toISOString().split('T')[0];
  if (!dateObj) {
    dateObj = {};
  }
  if (date in dateObj) {
    // ?????????? ???????? ???????? ?? ?????????????? ?? ??????, ??????????????????
    dateObj[date] = dateValue + dateObj[date];
  } else {
    dateObj[date] = dateValue;
  }
  return dateObj;
}

export function getTodayCount(dateObj: DateNumber | undefined): number {
  const currentDate = new Date();
  const date = currentDate.toISOString().split('T')[0];
  if (!dateObj) {
    return 0;
  }
  if (date in dateObj) {
    return dateObj[date];
  }
  return 0;
}

export function updateLearnedCounterDate(isLearnedBefore: boolean, currentLearned: boolean): 0 | 1 | -1 {
  if (isLearnedBefore === true && currentLearned === false) return -1;
  if (isLearnedBefore === false && currentLearned === true) return 1;
  return 0;
}
