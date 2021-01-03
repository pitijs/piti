import { List } from 'immutable';
import { CommandContainer } from '../../../../src/command';
import command from '../../../../src/command/decorators/command';
import { COMMANDS_KEY, COMMAND_CONTAINER_KEY } from '../../../../src/config/constants';
import { container } from '../../../../src/services';

const commandContainer = new CommandContainer();
const hasCommand = (name: string) => {
  return (
    commandContainer.fetch().findIndex(({ command }: any) => command.getMockName() === name) !== -1
  );
};

describe('💉 Tests of Command Decorator', () => {
  afterAll(() => container.add(COMMANDS_KEY, List([])));
  beforeEach(() => {
    container.add(COMMAND_CONTAINER_KEY, commandContainer);
  });

  test('Add command', () => {
    expect(hasCommand('test-1')).toEqual(false);
    const TestCommand = jest.fn();
    TestCommand.mockName('test-1');

    command({
      name: 'test-1',
      description: 'Test 1 description',
      inject: [1,2,3,4]
    })(TestCommand);

    expect(hasCommand('test-1')).toEqual(true);
  });

  test('Add command with dependencies', () => {
    expect(hasCommand('test-2')).toEqual(false);
    const TestCommand = jest.fn();
    TestCommand.mockName('test-2');

    const depFunction = jest.fn();
    const depNumber = 1;
    const depString = '2';
    const depBoolean = true;
    const depArray = [1];
    const depPlainObject = { name: 'test-2' };
    command({
      name: 'test-2',
      description: 'Test 2 description',
      inject: [depFunction, depNumber, depString, depBoolean, depArray, depPlainObject],
    })(TestCommand);
    expect(hasCommand('test-2')).toEqual(true);

    const mockCommand = commandContainer
      .fetch()
      .find(({ command }: any) => command.getMockName() === 'test-2');

    expect(mockCommand.inject[0]).toEqual(depFunction);
    expect(mockCommand.inject[1]).toEqual(1);
    expect(mockCommand.inject[2]).toEqual('2');
    expect(mockCommand.inject[3]).toEqual(true);
    expect(mockCommand.inject[4]).toEqual(depArray);
    expect(mockCommand.inject[5]).toEqual(depPlainObject);
  });

  test('Add command meta data into command class with a global symbol', () => {
    const TestCommand = jest.fn();
    TestCommand.mockName('test-3');
    const meta = {
      name: 'test-3',
      description: 'Test 3 description',
      inject: [1, 2, 3]
    };

    command(meta)(TestCommand);
    expect(TestCommand[Symbol.for('command.meta')]).toEqual(meta);
  });
});
