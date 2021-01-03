import yargs, { Argv, BuilderCallback } from 'yargs';
import isFunction from 'lodash.isfunction';
import { List } from 'immutable';
import ICommand from '../types/command';
import { CommandObject, CommandClass } from '../../utils/types';
import { CommandError, ValidationError } from '../../exceptions';
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

  get yargsBuilder() {
    return this.container.get<Argv>(COMMAND_BUILDER_KEY);
  }

  public add(commandObject: CommandObject, builder: Argv = this.yargsBuilder): Argv {
    const { command, inject = [] } = commandObject;
    const CommandClass = command as any;
    const commandInstance = createClass(CommandClass, inject) as ICommand;
    const { commandId } = CommandClass;
    const { name: cmd, description } = commandObject;

    this.saveBlueprint(commandId, cmd, description);

    const builderHandler = this.builderHandler.bind(this, commandInstance, commandObject);
    const commandHandler = this.commandHandler.bind(this, commandInstance, CommandClass);

    return builder.command(
      cmd,
      description,
      builderHandler as BuilderCallback<Object, any>,
      commandHandler,
    );
  }

  public builderHandler(commandInstance: ICommand, commandObject: CommandObject, builder: Argv) {
    const { builder: builderHanler } = commandInstance;
    if (isFunction(builderHanler)) builderHanler(builder);
    const { subCommand = [] } = commandObject;
    this.addCommands.call(this, subCommand, builder);
  }

  public commandHandler(commandInstance: ICommand, CommandClass: Function, argv: Argv) {
    const error = validateCommand(commandInstance, CommandClass);
    if (error) throw new ValidationError(error);
    const { handler } = commandInstance;
    handler.apply(commandInstance, [argv] as any);
  }

  public run(commands: CommandClass[]) {
    this.createScript();
    this.addCommands(commands);
    this.yargsBuilder.help().argv;
  }

  public count(): number {
    return this.getBlueprints().size;
  }

  public getBlueprints(): List<CommandBlueprint> {
    return this.container.get(BLUEPRINTS_KEY, List([]));
  }

  public saveBlueprint(commandId: string, name: string, description: string): void {
    if (this.hasBlueprint(commandId)) return;
    const newList = this.getBlueprints().push({ id: commandId, name, description });
    this.container.add(BLUEPRINTS_KEY, newList);
  }

  public hasBlueprint(commandId: string): boolean {
    const index = this.getBlueprints().findIndex((blueprint) => blueprint.id === commandId);
    return index > -1;
  }

  private createScript() {
    const scriptName = this.container.get<string>(SCRIPT_NAME);
    const commandBuilder = yargs.scriptName(scriptName);
    this.container.singleton(COMMAND_BUILDER_KEY, commandBuilder);
  }

  private addCommands(commandClasses: CommandClass[] = [], builder = this.yargsBuilder) {
    for (const commandClass of commandClasses) {
      const { commandMeta } = commandClass as any;

      if (!commandMeta) {
        throw new CommandError(`Missing the meta data in ${commandClass.name} command.`);
      }

      const commandObject = {
        command: commandClass,
        ...commandMeta,
      };
      this.add(commandObject, builder);
    }
  }
}

export default CommandBuilder;
