import { Store } from 'redux';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

export type Options = {
  scriptName: string;
  store?: Store;
};

export type CommandObject = {
  command: Function | Promise<{ default: Function }>;
  inject?: any[];
  name: string;
  description: string;
};

export type SubjectsCombine<T> =
  | Subject<T>
  | ReplaySubject<T>
  | BehaviorSubject<T>
  | AsyncSubject<T>;
