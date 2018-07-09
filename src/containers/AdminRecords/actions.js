import {
  UPLOAD_RECORDS_SUCCESS,
} from './constants';

export function recordsUploaded() {
  return {
    type: UPLOAD_RECORDS_SUCCESS,
  };
}
