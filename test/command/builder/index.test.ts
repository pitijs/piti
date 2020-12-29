import {
  COMMAND_BUILDER_KEY,
  COMMAND_CONTAINER_KEY,
  SCRIPT_NAME,
} from '../../../src/config/constants';
import { container, ServiceContainer } from '../../../src/services';
import { Argv } from 'yargs';
import CommandBuilder from '../../../src/command/builder';
import { CommandContainer } from '../../../src/command';

describe('💉 Tests of Command Builder', () => {
  let _container: ServiceContainer, yargsBuilder: Argv, commandBuilder: CommandBuilder;
  const scriptName = 'test-script';

  beforeEach(() => {
    _container = container.create('test');
    _container.add(SCRIPT_NAME, scriptName);

    const commandContainer = new CommandContainer();
    _container.add(COMMAND_CONTAINER_KEY, commandContainer);

    commandBuilder = new CommandBuilder(_container);
    commandBuilder.run();
    yargsBuilder = _container.get<Argv>(COMMAND_BUILDER_KEY);
  });

  afterEach(() => container.remove('test'));

  describe('run()', () => {
    test('Create script', () => {
      expect(yargsBuilder.argv.$0).toEqual(scriptName);
    });

    test('Add Commands', () => {
      const mockCommand = jest.fn();
      mockCommand.prototype.handle = () => {};

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
      mockCommand.prototype.handle = () => {};

      const result = commandBuilder.add({
        command: mockCommand,
        inject: [],
        name: 'test',
        description: 'description',
      });

      expect(result).toEqual(yargsBuilder);
    });

    test('The same command should not be added', () => {
      const mockCommand = jest.fn();
      mockCommand.prototype.handle = () => {};

      commandBuilder.add({
        command: mockCommand,
        inject: [],
        name: 'test',
        description: 'description',
      });
      expect(commandBuilder.count()).toEqual(1);

      function addCommand() {
        commandBuilder.add({
          command: mockCommand,
          inject: [],
          name: 'test',
          description: 'description',
        });
      }
      expect(addCommand).toThrow(/The .+(test).+ command already added/);
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

    test('Catch the exceptions when added missing property to command', () => {
      const mockCommand = jest.fn();
      function addCommand() {
        commandBuilder.add({
          command: mockCommand,
          inject: [],
          name: 'test',
          description: 'description',
        });
      }
      expect(addCommand).toThrow(/Missing .+(handle()).+ method in command class/);

      mockCommand.prototype.handle = function () {};
      expect(addCommand).not.toThrowError();
    });
  });

  describe('count()', () => {
    test('Get total commands count', () => {
      expect(commandBuilder.count()).toEqual(0);
      const mockCommand = jest.fn();
      mockCommand.prototype.handle = () => {};
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
      commandBuilder.saveBlueprint('test-3', 'description');
      expect(has()).toEqual({ name: 'test-3', description: 'description' });
    });
    test('Not add duplicated command', () => {
      commandBuilder.saveBlueprint('test-4', 'description');
      expect(commandBuilder.count()).toEqual(1);
      commandBuilder.saveBlueprint('test-4', 'description');
      expect(commandBuilder.count()).toEqual(1);
    });
  });

  describe('hasBlueprint()', () => {
    test('Check the command in blueprints whether has or not', () => {
      expect(commandBuilder.hasBlueprint('test-5')).toEqual(false);
      commandBuilder.saveBlueprint('test-5', 'description');
      expect(commandBuilder.hasBlueprint('test-5')).toEqual(true);
    });
  });

  describe('getBlueprints()', () => {
    test('Get all blueprints', () => {
      let has = (bp: any[]) => bp.find(({ name }) => name === 'test-6');
      expect(has(commandBuilder.getBlueprints().toArray())).toEqual(undefined);
      commandBuilder.saveBlueprint('test-6', 'description');
      expect(has(commandBuilder.getBlueprints().toArray())).toEqual({
        name: 'test-6',
        description: 'description',
      });
    });
  });
});
