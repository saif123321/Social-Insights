import * as types from '../types';
// import initialStates from './initialStates';
import { initialStates } from './initialStates';
const initialState = initialStates.authReducer;
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_LOGIN:
      return {
        ...state,
        token: action?.payload?.token,
        auth: action?.payload?.user,
        info: action?.payload?.date_array,
        logs: action?.payload?.logs_arr
      };
    case types.GET_LOGOUT:
      return initialState;
    case types.UPDATES_DATES:
      return { ...state, info: action?.payload };
    
    case types.LOGS:
      return { ...state, logs: action?.payload };
    default:
      return state;
  }
};
export default authReducer;

