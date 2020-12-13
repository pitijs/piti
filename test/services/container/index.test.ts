import { container } from '../../../src/services';

describe('💉 Tests of service container', () => {
  afterAll(() => {
    container.remove('myObject2');
    container.remove('addToCart');
    container.remove('items');1
  });

  describe('get()', () => {
    test('Get an item if exists', () => {
      const myObject = {
        name: 'John',
        surname: 'Doe',
      };
      container.add('myObject', myObject);
      const item = container.get<any>('myObject');
      expect(item.name).toEqual('John');
      expect(item).toEqual(myObject);
    });

    test('Return default value if not exists', () => {
      expect(container.has('myObject2')).toEqual(false);
      expect(container.get('myObject2', 'defaultValue')).toEqual('defaultValue');
    });
  });

  describe('add()', () => {
    test('Add an item to container', () => {
      container.add('addToCart', jest.fn().mockReturnValue('added'));
      expect(container.has('addToCart')).toEqual(true);
      const addToCart = container.get('addToCart') as Function;
      expect(addToCart()).toEqual('added');

      container.add('addToCart', jest.fn().mockReturnValue('not added'));
      const addToCart2 = container.get('addToCart') as Function;
      expect(addToCart2()).not.toEqual('added');
      expect(addToCart2()).toEqual('not added');
    });

    test('Add to container as singleton', () => {
      const items = {
        name: 'product 1',
        quantity: 2,
        variants: [{ name: 'variant 1' }, { name: 'variant 1' }],
      };

      container.singleton('items', items);
      expect(container.has('items')).toEqual(true);
      expect(container.get('items')).toEqual(items);

      const otherItems = {
        name: 'product 2',
        quantity: 1,
        variants: [],
      };

      container.singleton('items', otherItems);
      expect(container.get('items')).not.toEqual(otherItems);
      expect(container.get('items')).toEqual(items);
    });
  });

  describe('remove()', () => {
    test('Remove an item from container', () => {
      container.add('addToCart', jest.fn().mockReturnValue('added'));
      expect(container.has('addToCart')).toEqual(true);
      container.remove('addToCart');
      expect(container.has('addToCart')).toEqual(false);
    });
  });

  describe('has()', () => {
    test('Check item in container', () => {
      container.add('addToCart', jest.fn().mockReturnValue('added'));
      expect(container.has('addToCart')).toEqual(true);

      container.remove('addToCart');
      expect(container.has('addToCart')).toEqual(false);
      expect(container.get('addToCart')).toEqual(undefined);
    });
  });
});
