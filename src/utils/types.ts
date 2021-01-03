import { Store } from 'redux';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

export type Options = {
  scriptName: string;
  store?: Store;
  commands: CommandClass[];
};

export type CommandClass = Function;
export type CommandObject = {
  command: Function | Promise<{ default: Function }>;
  subCommand?: CommandClass[];
  inject?: any[];
  name: string;
  description: string;
};

export type SubjectsCombine<T> =
  | Subject<T>
  | ReplaySubject<T>
  | BehaviorSubject<T>
  | AsyncSubject<T>;
