import { List } from 'immutable';
import { CommandObject } from 'src/utils/types';
import { COMMANDS_KEY } from '../../config/constants';
import { ServiceContainer } from '../../services';

class CommandContainer {
  container: ServiceContainer = new ServiceContainer;

  fetch(): List<CommandObject> {
    return this.container.get(COMMANDS_KEY, List([]));
  }

  add(command: CommandObject) {
    const commands = this.fetch();
    const newCommandList = commands.push(command);
    this.container.add(COMMANDS_KEY, newCommandList);
  }
}

export default CommandContainer;
