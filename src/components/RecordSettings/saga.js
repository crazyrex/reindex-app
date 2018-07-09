import { take, put, call, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { requestNoParse } from 'utils/request';
import config from 'ReindexConfig';
import { UPDATE_SCORE , DELETE_RECORD} from './constants';
import { scoreUpdateSuccess } from './actions';
import { loadResults } from 'containers/AdminSearch/actions';


export function* updateScoreData(data) {
  const requestURL = `${config.apiRoot}records/${data.data.id}/settings`;
  let keys;
  if (data.data.score.length)
    keys = data.data.score.map((item) => item.key);
    else keys = null;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        rating: keys,
        constant_virtual_number: data.data.setVirtual
      }),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(scoreUpdateSuccess(response));
    yield put(loadResults({ page: 1 }));
  } catch (err) {
    console.log(err);
  }
}

export function* deleteRecord(data) {
  const requestURL = `${config.apiRoot}moveRecordToArchives/${data.data}`;
  try {  
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(scoreUpdateSuccess(response));
  } catch (err) {
    console.log(err);
  }
}


/**
 * Root saga manages watcher lifecycle
 */
// export default function* RecordData() {
//   const updateScore = yield takeLatest(UPDATE_SCORE, updateScoreData);

//   // // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
//   yield cancel(updateScore);
// }

export default [
  takeLatest(UPDATE_SCORE, updateScoreData),
  takeLatest(DELETE_RECORD, deleteRecord)
];
