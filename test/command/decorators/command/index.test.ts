import command from '../../../../src/command/decorators/command';
import { COMMANDS_KEY } from '../../../../src/config/constants';
import { container } from '../../../../src/services';
import { CommandType } from '../../../../src/utils/types';

const hasCommand = (name: string) =>
  container
    .get<CommandType[]>(COMMANDS_KEY, [])
    .findIndex(({ command }: any) => command.getMockName() === name) !== -1;

describe('💉 Tests of Command Decorator', () => {
  afterAll(() => container.add(COMMANDS_KEY, []));

  test('Add command', () => {
    expect(hasCommand('test-1')).toEqual(false);
    const TestCommand = jest.fn();
    TestCommand.mockName('test-1');
    command()(TestCommand);
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
      inject: [depFunction, depNumber, depString, depBoolean, depArray, depPlainObject],
    })(TestCommand);
    expect(hasCommand('test-2')).toEqual(true);

    const mockCommand = container
      .get<CommandType[]>(COMMANDS_KEY, [])
      .find(({ command }: any) => command.getMockName() === 'test-2');

    expect(mockCommand.inject[0]).toEqual(depFunction);
    expect(mockCommand.inject[1]).toEqual(1);
    expect(mockCommand.inject[2]).toEqual('2');
    expect(mockCommand.inject[3]).toEqual(true);
    expect(mockCommand.inject[4]).toEqual(depArray);
    expect(mockCommand.inject[5]).toEqual(depPlainObject);
  });
});
