import { Action, AnyAction } from 'redux';
import Redux from '..';
import { STORE_KEY } from '../../../config/constants';
import { container } from '../../../services';

const dispatch = (action: AnyAction): Action<any> => {
  const store = container.get<Redux>(STORE_KEY).getStore();
  return store.dispatch(action);
};

export default dispatch;
