import { CREATE_RECORD, CREATE_RECORD_FAILED, CREATE_RECORD_SUCCESS, CLOSE_CREATE_RECORD_MODAL ,REGISTER_TO_MAILING_LIST} from './constants';

export function createRecord(record) {
  return {
    type: CREATE_RECORD,
    record,
  };
}

export function recordCreated(response) {
  return {
    type: CREATE_RECORD_SUCCESS,
    response,
  };
}

export function recordFailed(response) {
  return {
    type: CREATE_RECORD_FAILED,
    response,
  };
}

export function closeCreateRecordModal() {
  return {
    type: CLOSE_CREATE_RECORD_MODAL,
  };
}

export function register2MailingList(values) {
  return {
    type: REGISTER_TO_MAILING_LIST,
    values,
  };
}

