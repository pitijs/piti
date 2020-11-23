import { SubscriptionLike } from 'rxjs';
import { SubjectsCombine } from 'src/utils/types';

export type SubscribeType =
  | string
  | {
      action: string;
      observer: (observer: SubjectsCombine<any>) => SubjectsCombine<any>;
    };

export type SubscribeItem = {
  subject: SubjectsCombine<any>;
  subscribers: { [prop: string]: SubscriptionLike };
};
