import {
  COMMAND_BUILDER_KEY,
  COMMAND_CONTAINER_KEY,
  SCRIPT_NAME,
} from '../../../src/config/constants';
import { container } from '../../../src/services';
import { Argv } from 'yargs';
import CommandBuilder from '../../../src/command/builder';
import { CommandContainer } from '../../../src/command';
import command from '../../../src/command/decorators/command';

describe('💉 Tests of Command Builder', () => {
  let yargsBuilder: Argv, commandBuilder: CommandBuilder;
  const scriptName = 'test-script';

  beforeEach(() => {
    container.add(SCRIPT_NAME, scriptName);

    const commandContainer = new CommandContainer();
    container.add(COMMAND_CONTAINER_KEY, commandContainer);

    commandBuilder = new CommandBuilder(container);
    commandBuilder.run([]);
    yargsBuilder = container.get<Argv>(COMMAND_BUILDER_KEY);
  });

  afterEach(() => container.removeAll());

  describe('run()', () => {
    test('Create script', () => {
      expect(yargsBuilder.argv.$0).toEqual(scriptName);
    });

    test('Add parent commands', () => {
      const TestCommand = jest.fn();
      command({
        name: 'test',
        description: 'Test command description'
      })(TestCommand);

      commandBuilder.run([
        TestCommand
      ]);
      expect(TestCommand.mock.instances.length).toEqual(1);
    });

    test('Add Commands', () => {
      const mockCommand = jest.fn();
      mockCommand.prototype.handler = () => {};

      commandBuilder.add({
        command: mockCommand,
        inject: [],
        name: 'test',
        description: 'description',
      });
      expect(commandBuilder.count()).toEqual(1);
    });
  });

  describe('add()', () => {
    test('add command successfuly', () => {
      const mockCommand = jest.fn();
      mockCommand.prototype.handler = () => {};

      const result = commandBuilder.add({
        command: mockCommand,
        inject: [],
        name: 'test',
        description: 'description',
      });

      expect(result).toEqual(yargsBuilder);
    });

    test('Catch the exceptions when added anything instead of function as command', () => {
      function addCommand() {
        commandBuilder.add({
          command: '' as any,
          inject: [],
          name: 'test',
          description: 'description',
        });
      }
      expect(addCommand).toThrow(/Object prototype may/);
    });

    test('Add sub commands', () => {
      const instance = jest.fn() as any;
      instance.prototype.builder = yargsBuilder;

      const sub1 = jest.fn();
      command({
        name: 'testSub',
        description: 'testSub description',
      })(sub1);

      commandBuilder.builderHandler(
        instance,
        {
          inject: [],
          command: jest.fn(),
          name: 'test',
          description: 'description',
          subCommand: [sub1],
        },
        yargsBuilder,
      );
    });
  });

  describe('count()', () => {
    test('Get total commands count', () => {
      expect(commandBuilder.count()).toEqual(0);
      const mockCommand = jest.fn();
      mockCommand.prototype.handler = () => {};
      commandBuilder.add({
        command: mockCommand,
        inject: [],
        name: 'test-2',
        description: 'any command description',
      });
      expect(commandBuilder.count()).toEqual(1);
    });
  });

  describe('saveBlueprint()', () => {
    test('Save to blue prints', () => {
      let has = () => commandBuilder.getBlueprints().find(({ name }) => name === 'test-3');
      expect(has()).toEqual(undefined);
      commandBuilder.saveBlueprint('qwq23', 'test-3', 'description');
      expect(has()).toEqual({ id: 'qwq23', name: 'test-3', description: 'description' });
    });
    test('Not add duplicated command', () => {
      commandBuilder.saveBlueprint('qwq24', 'test-4', 'description');
      expect(commandBuilder.count()).toEqual(1);
      commandBuilder.saveBlueprint('qwq24', 'test-4', 'description');
      expect(commandBuilder.count()).toEqual(1);
    });
  });

  describe('hasBlueprint()', () => {
    test('Check the command in blueprints whether has or not', () => {
      expect(commandBuilder.hasBlueprint('test-5')).toEqual(false);
      commandBuilder.saveBlueprint('qwq23', 'test-5', 'description');
      expect(commandBuilder.hasBlueprint('qwq23')).toEqual(true);
    });
  });

  describe('getBlueprints()', () => {
    test('Get all blueprints', () => {
      let has = (bp: any[]) => bp.find(({ name }) => name === 'test-6');
      expect(has(commandBuilder.getBlueprints().toArray())).toEqual(undefined);
      commandBuilder.saveBlueprint('qwq24', 'test-6', 'description');
      expect(has(commandBuilder.getBlueprints().toArray())).toEqual({
        id: 'qwq24',
        name: 'test-6',
        description: 'description',
      });
    });
  });

  test('Catch the exceptions when added missing property to command', () => {
    const mockCommand = {} as any;
    function addCommand() {
      commandBuilder.commandHandler(mockCommand, { name: 'TestCommand' } as Function, {} as any);
    }
    expect(addCommand).toThrow(/Missing .+(handler()).+/);
    mockCommand.handler = function () {};
    expect(addCommand).not.toThrowError();
  });
});
