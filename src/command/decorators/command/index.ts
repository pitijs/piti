import { defineProperty } from '../../../utils/helpers';
import { v4 as uuidv4 } from 'uuid';
import { CommandContainer } from '../../../command';
import { COMMAND_CONTAINER_KEY } from '../../../config/constants';
import { container } from '../../../services';

const commandContainer = () => container.get<CommandContainer>(COMMAND_CONTAINER_KEY);

type Params = { subCommand?: Function[]; inject?: any[]; name: string; description: string };

export default function command(params: Params) {
  return <T extends { new (...args: any[]): {} }>(constructor: T) => {
    const commandIdKey = Symbol.for('command.id');
    const commandMetaKey = Symbol.for('command.meta');
    const uniqueId = uuidv4();
    defineProperty(constructor, commandMetaKey, { value: params });
    defineProperty(constructor, commandIdKey, { value: uniqueId });
    defineProperty(constructor, 'commandId', {
      get() {
        return (constructor as any)[commandIdKey];
      },
    });
    defineProperty(constructor, 'commandMeta', {
      get() {
        return (constructor as any)[commandMetaKey];
      },
    });

    commandContainer().add({ command: constructor, ...params });
    return constructor;
  };
}
