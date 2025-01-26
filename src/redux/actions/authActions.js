import * as types from '../types';
import {endpoints} from '../../api/configs';
import {useSelector} from 'react-redux';


export const login = (email, password) => {
  return async (dispatch) => {
    try {
      const rawResponse = await fetch(endpoints.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'signature': 'abcdefghijklmnopQRSTUVWXYz!@#$%&*()0987654321',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          deviceId: 'aa',
        }),
      });
      const response = await rawResponse.json();
      dispatch({ type: types.GET_LOGIN, payload: response });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const signup = (email, password , fullname) => {
  return async (dispatch) => {
    try {
      const rawResponse = await fetch(endpoints.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'signature': 'abcdefghijklmnopQRSTUVWXYz!@#$%&*()0987654321',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          fullname : fullname,
          deviceId: 'aa',
        }),
      });
      const response = await rawResponse.json();
      // dispatch({ type: types.GET_LOGIN, payload: response });
      // dispatch({ type: types.USER_ENROLLMENT, payload: response?.batch });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
};

export const PostAnalyticsData = (token, date , analytic_data , hourly_data) => {
  return async (dispatch) => {
    try {
      const rawResponse = await fetch(endpoints.shareDailyAnalytics, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          date : date ,
          analytics_data : analytic_data, 
          hourly_data : hourly_data,
        }),
      });
      // console.log(JSON.stringify({
      //   token: token,
      //   date : date ,
      //   analytics_data : analytic_data, 
      // }));
      const response = await rawResponse.json();
      // dispatch({ type: types.UPDATES_DATES, payload: [date] });
      
      // dispatch({ type: types.UPDATES_DATES, payload: [date] });
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  };
}