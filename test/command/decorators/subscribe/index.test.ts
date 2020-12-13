import subscribe from '../../../../src/command/decorators/subscribe';
import { SUBSCRIBERS_KEY } from '../../../../src/config/constants';
import { container } from '../../../../src/services';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';
let _container;

describe('💉 Tests of subscribe decorator', () => {
  beforeAll(() => {
    _container = container.create(SUBSCRIBERS_KEY);
  });

  afterAll(() => container.remove(SUBSCRIBERS_KEY));

  test('Subscribe only action name', () => {
    expect(_container.has('TEST_ACTION_1')).toEqual(false);
    const mockClass = jest.fn();
    subscribe('TEST_ACTION_1')({ testActionHandler: mockClass }, 'testActionHandler', {});
    expect(_container.has('TEST_ACTION_1')).toEqual(true);
  });

  test('Subscribe and build observer pipe process', () => {
    expect(_container.has('TEST_ACTION_2')).toEqual(false);
    const mockClass = jest.fn();
    subscribe({
      action: 'TEST_ACTION_2',
      observer(subject) {
        return subject.pipe(filter((user) => user.isVip));
      },
    })({ testActionHandler2: mockClass }, 'testActionHandler2', {});
    expect(_container.has('TEST_ACTION_2')).toEqual(true);

    const action = _container.get('TEST_ACTION_2');
    expect(action.subject.source instanceof Subject).toEqual(true);
  });

  test('Observer pipe with BehaviourSubject', () => {
    expect(_container.has('TEST_ACTION_3')).toEqual(false);
    const mockClass = jest.fn();
    subscribe({
      action: 'TEST_ACTION_3',
      observer() {
        return new BehaviorSubject(null).pipe(filter((user) => user.isVip));
      },
    })({ testActionHandler3: mockClass }, 'testActionHandler3', {});

    const action = _container.get('TEST_ACTION_3');
    expect(action.subject.source instanceof BehaviorSubject).toEqual(true);
  });
});
