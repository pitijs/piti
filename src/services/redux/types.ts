import { Dispatch } from 'redux';

export type CommandRedux = {
  state: Record<string, any>;
  dispatch: Dispatch;
};
