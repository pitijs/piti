import { Store } from 'redux';
import { subscriptionEventTrigger } from './middlewares';
import applyMiddleware from './tools/applyMiddleware';

class Redux {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.applyInternalMiddlewares(store);
  }

  public getStore(): Store {
    if (!this.isActive()) {
      throw new Error('no config');
    }

    return this.store;
  }

  public isActive(): boolean {
    return !!this.store;
  }

  private applyInternalMiddlewares(store: Store) {
    this.store = applyMiddleware(store, [subscriptionEventTrigger]);
  }
}

export default Redux;
