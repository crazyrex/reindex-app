import { take, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request from 'utils/request';
import config from 'ReindexConfig';
import { authSuccess } from './actions';
import { LOGIN, REGISTER } from './constants';

export function* register(data) {
  const requestURL = `${config.apiRoot}register`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.user),
    };
    const user = yield call(request, requestURL, options);
    yield put(authSuccess(user));
  } catch (err) {
    console.log(err);
  }
}

export function* login(data) {
  const requestURL = `${config.apiRoot}login`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.user),
    };
    const user = yield call(request, requestURL, options);
    yield put(authSuccess(user));
  } catch (err) {
    err.then((data) => console.log('Login Err', data));
  }
}


export default [
  takeLatest(LOGIN, login),
  takeLatest(REGISTER, register)
];
