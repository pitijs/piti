import yargs, { Argv } from 'yargs';
import isFunction from 'lodash.isfunction';
import ICommand from '../types/command';
import { CommandObject, CommandType } from '../../utils/types';
import { createClass, validateCommand } from '../../utils/helpers';
import { ServiceContainer } from '../../services';
import { COMMANDS, COMMANDS_KEY, COMMAND_BUILDER_KEY, SCRIPT_NAME } from '../../config/constants';
import { CommandBlueprint } from '../types';

class CommandBuilder {
  constructor(public container: ServiceContainer) {}

  public add(command: CommandType): Argv {
    const commandBuilder = this.container.get<Argv>(COMMAND_BUILDER_KEY);
    let inject: [] = [];
    const { command: _command, inject: _inject = [] } = command as CommandObject;
    command = _command as any;
    inject = _inject as [];

    const CommandClass = command as any;
    const commandInstance = createClass(CommandClass, inject) as ICommand;
    const hasError = validateCommand(commandInstance);

    if (hasError) throw new Error(hasError);

    const { name: cmd, description, before, handle } = commandInstance;

    this.saveBlueprint(cmd, description);

    const commandBuilderHandler = (builder: Argv) => isFunction(before) && before(builder);
    const commandHandler = (argv: Argv) => {
      try {
        handle.apply(commandInstance, [argv] as any);
      } catch (e) {
        console.error(e);
      }
    };

    return commandBuilder.command(cmd, description, commandBuilderHandler, commandHandler);
  }

  public run() {
    this.createScript();
    this.addCommands();
    this.container.add(COMMANDS, []);
    const commandBuilder = this.container.get<Argv>(COMMAND_BUILDER_KEY);
    commandBuilder.help().argv;
  }

  public count(): number {
    return this.getBlueprints().length;
  }

  public getBlueprints(): Array<CommandBlueprint> {
    return this.container.get(COMMANDS, []);
  }

  public saveBlueprint(name: string, description: string): void {
    if (this.hasBlueprint(name)) return;
    const blueprints = this.getBlueprints();
    blueprints.push({ name, description });
    this.container.add(COMMANDS, blueprints);
  }

  public hasBlueprint(name: string) {
    const blueprints = this.getBlueprints();
    return !!blueprints.find(({ name: cmd }) => cmd === name);
  }

  private createScript() {
    const scriptName = this.container.get<string>(SCRIPT_NAME);
    const commandBuilder = yargs.scriptName(scriptName);
    this.container.singleton(COMMAND_BUILDER_KEY, commandBuilder);
  }

  private addCommands() {
    const commands = this.container.get<CommandType[]>(COMMANDS_KEY, []);

    for (const command of commands) {
      this.add(command);
    }
  }
}

export default CommandBuilder;
