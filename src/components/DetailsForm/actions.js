import {
  DATA_SUCCESS,
  CLEAN_DATA,
} from './constants';


export function receiveData(data) {
  return {
    type: DATA_SUCCESS,
    data,
  };
}

export function cleanData() {
  return {
    type: CLEAN_DATA,
  };
}
