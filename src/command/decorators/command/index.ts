import { CommandContainer } from '../../../command';
import { COMMAND_CONTAINER_KEY } from '../../../config/constants';
import { container } from '../../../services';

const commandContainer = () => container.get<CommandContainer>(COMMAND_CONTAINER_KEY);

export default function command(params: { inject: any[]; name: string; description: string }) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const command = { command: constructor, ...params };
    commandContainer().add(command);
    return constructor;
  };
}
