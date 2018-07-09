import {
  RESULTS_SUCCESS,
  LOAD_RESULTS,
  CHANGE_STATE,
  UPDATE_RECORD,
  UPDATE_RECORD_SUCCESS,
  CLOSE_UPDATE_RECORD_MODAL,
} from './constants';

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