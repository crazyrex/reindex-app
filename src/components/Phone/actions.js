import {
  GET_VIRTUAL_NUMBER,
  VIRTUAL_NUMBER_CREATED,
} from './constants';

export function getVirtualNumber(data) {
  return {
    type: GET_VIRTUAL_NUMBER,
    data,
  };
}

export function virtualNumberCreated(response) {
  return {
    type: VIRTUAL_NUMBER_CREATED,
    response,
  };
}
