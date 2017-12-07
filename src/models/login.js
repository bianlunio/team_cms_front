import { routerRedux } from 'dva/router';
import { accountLogin } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      yield put({
        type: 'changeSubmitting',
        payload: false,
      });
    },
    // *mobileSubmit(_, { call, put }) {
    //   yield put({
    //     type: 'changeSubmitting',
    //     payload: true,
    //   });
    //   const response = yield call(fakeMobileLogin);
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: response,
    //   });
    //   yield put({
    //     type: 'changeSubmitting',
    //     payload: false,
    //   });
    // },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      if (payload.status === false) {
        window.localStorage.removeItem('token');
        return {
          ...state,
          status: payload.status,
        };
      } else if (payload.success) {
        window.localStorage.setItem('token', payload.token);
        return {
          ...state,
          status: 'ok',
          type: 'account',
        };
      } else {
        return {
          ...state,
          status: 'error',
          type: 'account',
        };
      }
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
