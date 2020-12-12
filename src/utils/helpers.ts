import isFunction from 'lodash.isfunction';
import isPlainObject from 'lodash.isplainobject';
import { red, yellow } from 'chalk';
import { ICommand } from '../command';

export const createClass = (constructor: Function, args: any[]) => {
  const newObject = Object.create(constructor.prototype);
  const result = constructor.apply(newObject, args);
  return isPlainObject(result) ? result : newObject;
};

export const validateCommand = (command: ICommand) => {
  if (!command.name) {
    return red(`Missing command ${yellow('name')} property in command class.`);
  } else if (!command.description) {
    return red(`Missing command ${yellow('description')} property in command class.`);
  } else if (!command.handle || !isFunction(command.handle)) {
    return red(`Missing ${yellow('handle()')} method in command class`);
  }
};
