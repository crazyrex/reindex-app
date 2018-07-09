import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import config from '../../ReindexConfig';
import { LOAD_USERS, USERS_LOADED, UPDATE_USER } from './constants';
import { usersLoaded, userUpdated } from './actions';

export function* loadUsers(data) {
  const requestURL = `${config.apiRoot}getUsers`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
         Authorization: localStorage.getItem('token'),
      },
    };
    const response = yield call(request, requestURL, options);
    yield put(usersLoaded(response));
  } catch (err) {
    console.log(err);
  }
}

export function* updateUser(data) {
  const requestURL = `${config.apiRoot}user/${data.userId}`;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };
    const response = yield call(requestNoParse, requestURL, options);
    console.log('jkyiuijyk',response)
    if (response == 'ok')
       yield put(userUpdated(response));
  } catch (err) {
    console.log(err);
  }
}


export default [
  takeLatest(LOAD_USERS, loadUsers),
  takeLatest(UPDATE_USER, updateUser)
];
