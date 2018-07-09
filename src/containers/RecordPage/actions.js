import {
  CHANGE_STATE,
  UPDATE_RECORD,
  LOAD_DATA,
  DATA_SUCCESS,
  UPDATE_RECORD_SUCCESS,
  CLOSE_UPDATE_RECORD_MODAL,
} from './constants';

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

export function loadDataAction(record) {
  return {
    type: LOAD_DATA,
    record,
  };
}
export function receiveData(data) {
  return {
    type: DATA_SUCCESS,
    data,
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

