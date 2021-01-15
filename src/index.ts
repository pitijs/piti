#!/usr/bin/env node

import { CommandBuilder, CommandContainer } from './command';
import { container, Redux } from './services';
import { Options } from './utils/types';
import { BUILDER_KEY, COMMAND_CONTAINER_KEY, SCRIPT_NAME, STORE_KEY, SUBSCRIBERS_KEY } from './config/constants';
export type { ICommand } from './exports';
export * from './exports';

process.on('unhandledRejection', (reason: string, promise: Promise<any>) => {
  console.error(reason);
});

let initialized = false;

class Piti {
  static builder: CommandBuilder;

  static init() {
    if (initialized) return;
    const commandContainer = new CommandContainer;
    container.add(COMMAND_CONTAINER_KEY, commandContainer);

    const commandBuilder = new CommandBuilder(container);
    container.singleton(BUILDER_KEY, commandBuilder);

    container.create(SUBSCRIBERS_KEY);
    Piti.builder = commandBuilder;
    initialized = true;
  }

  static async run(options: Options) {
    try {
      Piti.createContainers(options);
      const { commands } = options;
      Piti.builder.run(commands);
    } catch (e) {
      console.log(e);
    } finally {

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

Piti.init();

export default Piti;
