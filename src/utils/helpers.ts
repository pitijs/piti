import isFunction from 'lodash.isfunction';
import isPlainObject from 'lodash.isplainobject';
import { red, yellow } from 'chalk';
import { ICommand } from '../command';

export const createClass = (constructor: Function, args: any[]) => {
  const newObject = Object.create(constructor.prototype);
  const result = constructor.apply(newObject, args);
  return isPlainObject(result) ? result : newObject;
};

export const defineProperty = (obj: Object, property: string | symbol, descriptor: Object): any => {
  return Object.defineProperty(obj, property, {
    enumerable: true,
    configurable: false,
    ...descriptor,
  });
};

export const validateCommand = (command: ICommand, { name }: Function): string | null => {
  if (!command.handler || !isFunction(command.handler)) {
    return red(`Missing ${yellow('handler()')} method in ${name}`);
  }
  return null;
};
