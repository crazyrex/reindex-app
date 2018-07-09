import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import request, { requestNoParse } from 'utils/request';
import config from '../../ReindexConfig';
import { LOAD_LANDSCAPES } from './constants';
import { landscapesLoaded} from './actions';

export function* loadLandscapes(data) {
    const requestURL = `${config.apiRoot}landscape/tooltip`;
    try {
      const options = {
        method: 'get'
      };
      const response = yield call(request, requestURL, options);
      yield put(landscapesLoaded(response));
    } catch (err) {
      console.log(err);
    }
}

// Bootstrap sagas
export default [
  takeLatest(LOAD_LANDSCAPES, loadLandscapes)
];
