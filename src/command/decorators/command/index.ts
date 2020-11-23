import { COMMANDS_KEY } from '../../../config/constants';
import { container } from '../../../services';
import { CommandType } from '../../../utils/types';

export default function command(params?: { inject: any[] }) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const commands = container.get<CommandType[]>(COMMANDS_KEY, []);
    const command = params ? { command: constructor, inject: params.inject } : constructor;
    commands.push(command);
    container.add(COMMANDS_KEY, commands);
    return constructor;
  };
}
