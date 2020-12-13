import { AnyAction } from 'redux';
import { SUBSCRIBERS_KEY } from '../../../../src/config/constants';
import { container } from '../../../../src/services';
import subscriptionEventTrigger from '../../../../src/services/redux/middlewares/subscriptionEventTrigger';

let subscriberContainer;
const next = subscriptionEventTrigger({
  dispatch(action: AnyAction) {
    return action;
  },
  getState() {
    return {};
  },
  subscribe() {},
  replaceReducer() {},
} as any);

describe('💉 Tests of subscription event trigger', () => {
  beforeAll(() => {
    subscriberContainer = container.create(SUBSCRIBERS_KEY);
  });

  afterAll(() => {
    container.remove(SUBSCRIBERS_KEY);
  });

  test('Trigger the event if exists in subscriber container', () => {
    const action = {
      type: 'TEST_ACTION_1',
      data: 'Hello World',
    };

    const subject = { next: () => {} };
    const spy = jest.spyOn(subject, 'next');
    const mockFunc = jest.fn().mockReturnValue(action);
    const dispatch = next(mockFunc);
    expect(dispatch(action)).toEqual(action);
    expect(spy).not.toHaveBeenCalled();
    subscriberContainer.add('TEST_ACTION_1', { subject });
    expect(dispatch(action)).toEqual(action);
    expect(spy).toHaveBeenCalled();
  });
});
