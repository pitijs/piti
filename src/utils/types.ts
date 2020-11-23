import { Store } from 'redux';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

export type Options = {
  scriptName: string;
  commands: CommandType[];
  store?: Store;
};

export type CommandObject = { command: Function | Promise<{ default: Function }>; inject: any[] };
export type CommandType = CommandObject | Function | Promise<{ default: Function }>;

export type SubjectsCombine<T> =
  | Subject<T>
  | BehaviorSubject<T>
  | AsyncSubject<T>
  | ReplaySubject<T>;
