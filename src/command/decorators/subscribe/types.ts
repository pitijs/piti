import { Observable, Subject, SubscriptionLike } from 'rxjs';
import { SubjectsCombine } from 'src/utils/types';

export type SubscribeType =
  | string
  | {
      action: string;
      observer: (subject: Subject<any>) => Observable<any>;
    };

export type SubscribeItem = {
  subject: SubjectsCombine<any>;
  subscribers: { [prop: string]: SubscriptionLike };
};
