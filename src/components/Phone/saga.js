import { take, put, call, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request , { requestNoParse } from 'utils/request';
import config from 'ReindexConfig';
import { GET_VIRTUAL_NUMBER } from './constants';
import { virtualNumberCreated } from './actions';


export function* getVirtualNumber(data) {
  const requestURL = `${config.apiRoot}getVirtualNumber/${data.data}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response = yield call(request, requestURL, options);
    yield put(virtualNumberCreated(response));
  } catch (err) {
    console.log(err);
  }
}


/**
 * Root saga manages watcher lifecycle
 */
// export default function* PhoneData() {
//   const getNumWatcher = yield takeLatest(GET_VIRTUAL_NUMBER, getVirtualNumber);

//   // // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
// //   yield cancel(sendWatcher);
// }

export default [
  takeLatest(GET_VIRTUAL_NUMBER, getVirtualNumber),
];

