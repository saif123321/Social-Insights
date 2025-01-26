// reduxStore.js
import { store } from '.';
export const getToken = () => {
  return store.getState().authReducer.token;
};

export const getDateInfo = () => {
  return store.getState().authReducer.info;
};

export const getLogsInfo = () => {
  return store.getState().authReducer.logs;
};

export const getDispatch = () => {
  return store.dispatch;
};
