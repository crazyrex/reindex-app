import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

/**
 * Root saga manages watcher lifecycle
 */
export function* thanksPageData() {
  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
}

// Bootstrap sagas
export default [
  thanksPageData,
];
