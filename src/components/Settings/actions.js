import { CREATE_SETTING, CREATE_SETTING_SUCCESS, CREATE_SETTING_FAILED, GET_SETTING, LOAD_SETTING_SUCCESS} from './constants';

export function createSetting(setting) {
  return {
    type: CREATE_SETTING,
    setting,
  };
}

export function getSetting(key) {
  return {
    type: GET_SETTING,
    key,
  };
}

export function settingLoaded(dataKey, response) {
  return {
      type: LOAD_SETTING_SUCCESS,
      dataKey,
      response
  };
}

export function settingCreated(response) {
  return {
    type: CREATE_SETTING_SUCCESS,
    response,
  };
}

export function settingsFailed(response) {
  return {
    type: CREATE_SETTING_FAILED,
    response,
  };
}