import Redux from '..';
import { STORE_KEY } from '../../../config/constants';
import { container } from '../../../services';

const getState = () => {
  const store = container.get<Redux>(STORE_KEY).getStore();
  return store.getState();
};

export default getState;
