import { List } from 'immutable';
import { COMMANDS_KEY } from '../../config/constants';
import { ServiceContainer } from '../../services';
import { CommandType } from 'src/utils/types';

class CommandContainer {
  container: ServiceContainer = new ServiceContainer;

  fetch(): List<CommandType> {
    return this.container.get(COMMANDS_KEY, List([]));
  }

  add(command: CommandType) {
    const commands = this.fetch();
    const newCommandList = commands.push(command);
    this.container.add(COMMANDS_KEY, newCommandList);
  }
}

export default CommandContainer;
