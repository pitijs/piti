import yargs, { Argv } from 'yargs';
import { red, yellow } from 'chalk';
import isFunction from 'lodash.isfunction';
import ICommand from '../types/command';
import { CommandObject, CommandType } from '../../utils/types';
import { createClass } from '../../utils/helpers';
import { ServiceContainer } from '../../services';
import { COMMANDS_KEY, COMMAND_BUILDER_KEY, SCRIPT_NAME } from '../../config/constants';

class CommandBuilder {
  constructor(public container: ServiceContainer) {}

  public add(command: CommandType) {
    const commandBuilder = this.container.get<Argv>(COMMAND_BUILDER_KEY);
    let inject: [] = [];
    const { command: _command, inject: _inject = [] } = command as CommandObject;
    command = _command as any;
    inject = _inject as [];

    if (!isFunction(command)) throw red(`Incorret command -> ${command}.`);

    const CommandClass = command as any;
    const commandInstance = createClass(CommandClass, inject) as ICommand;
    const { name: cmd, description, before, handle } = commandInstance;

    if (!isFunction(handle))
      throw new Error(red(`Missing the handle() method at ${yellow(CommandClass.name)} class.`));

    const commandBuilderHandler = (builder: Argv) => {
      if (isFunction(before)) before(builder);
    };

    const commandHandler = (argv: Argv) => {
      try {
        handle.apply(commandInstance, [argv] as any);
      } catch (e) {
        console.error(e);
      }
    };

    commandBuilder.command(cmd, description, commandBuilderHandler, commandHandler);
  }

  public run() {
    this.createScript();
    this.saveCommands();
    const commandBuilder = this.container.get<Argv>(COMMAND_BUILDER_KEY);
    commandBuilder.help().argv;
  }

  private createScript() {
    const scriptName = this.container.get<string>(SCRIPT_NAME);
    const commandBuilder = yargs.scriptName(scriptName);
    this.container.singleton(COMMAND_BUILDER_KEY, commandBuilder);
  }

  private saveCommands() {
    const commands = this.container.get<CommandType[]>(COMMANDS_KEY);

    for (const command of commands) {
      this.add(command);
    }
  }
}

export default CommandBuilder;
