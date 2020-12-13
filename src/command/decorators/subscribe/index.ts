import { Subject, SubscriptionLike } from 'rxjs';
import isString from 'lodash.isstring';
import isPlainObject from 'lodash.isplainobject';
import { container, ServiceContainer } from '../../../services';
import { SubscribeItem, SubscribeType } from './types';
import { SUBSCRIBERS_KEY } from '../../../config/constants';

const subscribe = (value: SubscribeType) => {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const subscriberContainer = container.get<ServiceContainer>(SUBSCRIBERS_KEY);
    let subscribers = {} as { [prop: string]: SubscriptionLike },
      subject,
      action;

    if (isString(value)) {
      const item = subscriberContainer.get<SubscribeItem>(value, {});
      const { subject: _subject = new Subject(), subscribers: _subscribers = subscribers } = item;
      action = value;
      subject = _subject;
      subscribers = _subscribers;
    } else if (isPlainObject(value)) {
      action = value.action;
      subject = new Subject();
      subject = value.observer(subject);
    }

    if (action && subject) {
      subscribers[propertyKey] = subject.subscribe(target[propertyKey].bind(target));
      subscriberContainer.add(action, {
        subject,
        subscribers,
      });
    }
  };
};

export default subscribe;
