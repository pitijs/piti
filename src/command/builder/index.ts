import yargs, { Argv } from 'yargs';
import { red, yellow } from 'chalk';
import isFunction from 'lodash.isfunction';
import { List } from 'immutable';
import ICommand from '../types/command';
import { CommandObject } from '../../utils/types';
import { createClass, validateCommand } from '../../utils/helpers';
import { ServiceContainer } from '../../services';
import {
  BLUEPRINTS_KEY,
  COMMAND_BUILDER_KEY,
  COMMAND_CONTAINER_KEY,
  SCRIPT_NAME,
} from '../../config/constants';
import { CommandBlueprint } from '../types';
import { CommandContainer } from '..';

class CommandBuilder {
  private commandContainer: CommandContainer;

  constructor(public container: ServiceContainer) {
    this.commandContainer = container.get<CommandContainer>(COMMAND_CONTAINER_KEY);
  }

  public add(commandObject: CommandObject): Argv {
    const { name: cmd, description, command, inject = [] } = commandObject;
    const CommandClass = command as any;
    const commandInstance = createClass(CommandClass, inject) as ICommand;
    const hasError = validateCommand(commandInstance);

    if (hasError) throw new Error(hasError);

    const yargsBuilder = this.container.get<Argv>(COMMAND_BUILDER_KEY);
    const { before, handle } = commandInstance;

    if (this.hasBlueprint(cmd)) {
      throw new Error(red(`The ${yellow(cmd)} command already added.`));
    }

    this.saveBlueprint(cmd, description);

    const commandBuilderHandler = (builder: Argv) => isFunction(before) && before(builder);
    const commandHandler = (argv: Argv) => {
      try {
        handle.apply(commandInstance, [argv] as any);
      } catch (e) {
        console.error(e);
      }
    };

    return yargsBuilder.command(cmd, description, commandBuilderHandler, commandHandler);
  }

  public run() {
    this.createScript();
    this.addCommands();
    const commandBuilder = this.container.get<Argv>(COMMAND_BUILDER_KEY);
    commandBuilder.help().argv;
  }

  public count(): number {
    return this.getBlueprints().size;
  }

  public getBlueprints(): List<CommandBlueprint> {
    return this.container.get(BLUEPRINTS_KEY, List([]));
  }

  public saveBlueprint(name: string, description: string): void {
    if (this.hasBlueprint(name)) return;
    const newList = this.getBlueprints().push({ name, description });
    this.container.add(BLUEPRINTS_KEY, newList);
  }

  public hasBlueprint(name: string): boolean {
    const index = this.getBlueprints().findIndex((blueprint) => blueprint.name === name);
    return index > -1;
  }

  private createScript() {
    const scriptName = this.container.get<string>(SCRIPT_NAME);
    const commandBuilder = yargs.scriptName(scriptName);
    this.container.singleton(COMMAND_BUILDER_KEY, commandBuilder);
  }

  private addCommands() {
    const commands = this.commandContainer.fetch();
    for (const command of commands.toArray()) {
      this.add(command);
    }
  }
}

export default CommandBuilder;
