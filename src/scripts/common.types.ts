// Здесь все типы и интерфейсы

export type DataSet = {
  [name: string]: string,
};

export type TableHeader = {
  header: string,
  sort?: string,
};

export interface HTMLElementOptions {
  className?: string,
}

export interface DivOptions extends HTMLElementOptions {
  dataSet?: DataSet
}

export interface SpanOptions extends HTMLElementOptions {
  text?: string
}

export interface ButtonOptions extends HTMLElementOptions {
  text?: string,
  action?: string,
  disabled?: boolean
}

export interface InputOptions extends HTMLElementOptions {
  type?: string
}