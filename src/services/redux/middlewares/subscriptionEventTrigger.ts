import { Action, Store } from 'redux';
import { SubscribeItem } from '../../../command/decorators/subscribe/types';
import { ServiceContainer } from 'src/services/container';
import { container } from '../../../services';

const subscriptionEventTrigger = (storeAPI: Store) => (next: CallableFunction) => (action: Action) => {
  const result = next(action);
  const subscriberContainer = container.get<ServiceContainer>('fw.subscribers');
  const hasSubscriber = subscriberContainer.has(action.type);

  if (hasSubscriber) {
    const { subject } = subscriberContainer.get<SubscribeItem>(action.type);
    subject.next(result);
  }

  return result;
};

export default subscriptionEventTrigger;
