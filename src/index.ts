#!/usr/bin/env node

import { CommandBuilder } from './command';
import { container, Redux } from './services';
import { Options } from './utils/types';
import { BUILDER_KEY, SCRIPT_NAME, STORE_KEY, SUBSCRIBERS_KEY } from './config/constants';
import * as internalExports from './exports';
export type { ICommand } from './exports';

process.on('unhandledRejection', (reason: string, promise: Promise<any>) => {
  console.error(reason);
});

let initialized = false;

class Konsole {
  static builder: CommandBuilder;

  static init() {
    if (initialized) return;
    Konsole.builder = new CommandBuilder(container);
    container.singleton(BUILDER_KEY, Konsole.builder);
    container.create(SUBSCRIBERS_KEY);
    initialized = true;
  }

  static async run(options: Options) {
    try {
      Konsole.createContainers(options);
      Konsole.builder.run();
    } catch (e) {
      console.log(e);
    }
  }

  static createContainers(options: Options) {
    const { scriptName, store } = options;

    // Script name to be used throughout the entire application
    container.singleton(SCRIPT_NAME, scriptName);

    if (store) {
      // Redux store instance wraps up to manage across the entire app.
      container.singleton(STORE_KEY, new Redux(store));
    }
  }
}

Konsole.init();

export const dispatch = internalExports.dispatch;
export const getState = internalExports.getState;
export const Subscribe = internalExports.Subscribe;
export const Command = internalExports.Command;

export default Konsole;
