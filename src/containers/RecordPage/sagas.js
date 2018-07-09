import { call, put, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import config from '../../ReindexConfig';
import { UPDATE_RECORD, LOAD_DATA, UPDATE_RECORD_SUCCESS } from './constants';
import { receiveData, recordUpdated } from './actions';


export function* updateRecord(data) {
  const tmpData = data;
  const requestURL = `${config.apiRoot}records/${tmpData.record.values._id}`;
  tmpData.record.values.categories = tmpData.record.categories;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tmpData.record.values),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(recordUpdated(response));
  } catch (err) {
    console.log(err);
  }
}

export function* loadData(data) {
  const requestURL = `${config.apiRoot}records/${data.record}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const rec = yield call(request, requestURL, options);
    yield put(receiveData(rec));
  } catch (err) {
    console.log(err);
  }
}
/**
 * Root saga manages watcher lifecycle
 */
// export function* recordData() {
//   const updateWatcher = yield takeLatest(UPDATE_RECORD, updateRecord);
//   const loadDataWatcher = yield takeLatest(LOAD_DATA, loadData);
//   const recordUpdatedWatcher = yield takeLatest(UPDATE_RECORD_SUCCESS, recordUpdated);

//   // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
//   yield cancel(updateWatcher);
//   yield cancel(loadDataWatcher);
//   yield cancel(recordUpdatedWatcher);
// }

// Bootstrap sagas
export default [
  takeLatest(UPDATE_RECORD, updateRecord),
  takeLatest(LOAD_DATA, loadData),
  takeLatest(UPDATE_RECORD_SUCCESS, recordUpdated)
];
