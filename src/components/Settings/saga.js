import { take, put, call, cancel, takeLatest } from 'redux-saga/effects';
import request, { requestNoParse } from 'utils/request';
import config from 'config';
import { CREATE_SETTING ,GET_SETTING } from './constants';
import { settingCreated, settingsFailed, settingLoaded } from './actions';


export function* createSetting(data) {
  const requestURL = `${config.apiRoot}settings`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify(data.setting),
    };
    const response = yield call(requestNoParse, requestURL, options);
    // yield put(settingCreated(response));
    yield put(settingLoaded(data.setting.key, {setting: data.setting}));
  } catch (err) {
    console.log(err);
    yield put(settingsFailed(err));
  }
}

export function* loadSetting(data) {
  const requestURL = `${config.apiRoot}settings/${data.key}`;
  try {
    const options = {
      method: 'get'
    };
    const response = yield call(request, requestURL, options);
    yield put(settingLoaded(data.key, response));
  } catch (err) {
  }
}

export default [
  takeLatest(CREATE_SETTING, createSetting),
  takeLatest(GET_SETTING, loadSetting),
];