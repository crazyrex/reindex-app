import {
  RESULTS_SUCCESS,
  LOAD_RESULTS,
  CHANGE_STATE,
  UPDATE_RECORD,
  UPDATE_RECORD_SUCCESS,
  CLOSE_UPDATE_RECORD_MODAL,
  DISPLAY_ICONS,
  ISDATA_RESULT,
  CHECK_DATA
} from './constants';

export function isDataResult(result) {
  return {
    type: ISDATA_RESULT,
    result
  }
}

export function checkData(result) {
  return {
    type: CHECK_DATA
  }
}

export function resultsLoaded(response) {
  return {
    type: RESULTS_SUCCESS,
    response,
  };
}

export function loadResults(data) {
  return {
    type: LOAD_RESULTS,
    data,
  };
}

export function changeState() {
  return {
    type: CHANGE_STATE,
  };
}

export function updateRecord(record) {
  return {
    type: UPDATE_RECORD,
    record,
  };
}

export function recordUpdated(response) {
  return {
    type: UPDATE_RECORD_SUCCESS,
    response,
  };
}

export function closeUpdateRecordModal() {
  return {
    type: CLOSE_UPDATE_RECORD_MODAL,
  };
}

export function displayIcons(data) {
  return {
    type: DISPLAY_ICONS ,
    data,
  }
}