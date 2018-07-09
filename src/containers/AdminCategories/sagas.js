import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import config from 'ReindexConfig';
import {  } from './constants';
import {  } from './actions';

export function* loadRequests() {
  const requestURL = `${config.apiRoot}requests`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };
    const requests = yield call(request, requestURL, options);
    yield put(requestsLoaded(requests));
  } catch (err) {
    console.log(err);
  }
}


export function* adminCategoriesData() {
//   const loadRequestsWatcher = yield takeLatest(LOAD_REQUESTS, loadRequests);
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
//   yield cancel(loadRequestsWatcher);
}

// Bootstrap sagas
export default [
  adminCategoriesData,
];
