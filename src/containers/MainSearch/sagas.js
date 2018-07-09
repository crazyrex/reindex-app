import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import config from '../../ReindexConfig';
import { LOAD_RESULTS, UPDATE_RECORD, CHECK_DATA } from './constants';
import { resultsLoaded, recordUpdated , isDataResult} from './actions';

export function* loadResults(data) {
  const state = yield select();
  const searchState = state.search.search;
  const tabType = searchState.activeTab;
  const searchData = searchState[tabType];
  let value = searchData.value;

  for (const index in searchState.filtersValue) {
    value = (tabType === 'businesses') ? value.concat(searchState.filtersValue[index]) : value;
  }
  const requestURL = `${config.apiRoot}getResults?type=${searchData.type}&offset=${data.data.page}${searchData.city ? `&city=${searchData.city}`: ''}${searchData.phone ? `&phone=${searchData.phone}`: ''}`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        captcha: data.data.captcha,
      }),
    };
    const response = yield call(request, requestURL, options);
    yield put(resultsLoaded(response));
  } catch (err) {
    console.log(err);
  }
}

export function* updateRecord(data) {
  const requestURL = `${config.apiRoot}records/${data.record.values._id}`;
  data.record.values.categories = data.record.categories;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.record.values),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(recordUpdated(response));
  } catch (err) {
    console.log(err);
  }
}

export function* checkData(){
  const requestURL = `${config.apiRoot}checkData`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const response = yield call(request, requestURL, options);
    yield put(isDataResult(response));
  } catch (err) {
    console.log(err);
  }
}


/**
 * Root saga manages watcher lifecycle
 */
// export function* mainSearchData() {
//   const loadResultsWatcher = yield takeLatest(LOAD_RESULTS, loadResults);
//   const updateWatcher = yield takeLatest(UPDATE_RECORD, updateRecord);

//   // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
//   yield cancel(loadResultsWatcher);
//   yield cancel(updateWatcher);
// }

// Bootstrap sagas
export default [
  takeLatest(LOAD_RESULTS, loadResults),
  takeLatest(CHECK_DATA, checkData),
  takeLatest(UPDATE_RECORD, updateRecord)
];
