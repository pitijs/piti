import { Store } from 'redux';

const applyMiddleware = (store: Store, middlewares: CallableFunction[]) => {
  middlewares = middlewares.slice();
  middlewares.reverse();
  let dispatch = store.dispatch;
  middlewares.forEach((middleware) => (dispatch = middleware(store)(dispatch)));
  return Object.assign({}, store, { dispatch });
};

export default applyMiddleware;
