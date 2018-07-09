import { take, put, call, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { requestNoParse } from 'utils/request';
import config from 'config';
import { CREATE_RECORD ,CREATE_RECORD_FAILED, REGISTER_TO_MAILING_LIST} from './constants';
import { recordCreated ,recordFailed } from './actions';


export function* createRecord(data) {
  data.record.values.categories = data.record.categories;
  const requestURL = `${config.apiRoot}records`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.record.values),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(recordCreated(response));
  } catch (err) {
    console.log(err);
    yield put(recordFailed(err));
  }
}

export function* register2MailingList(data) {
  let type;
  if (data.values.values.listing_type_1 != 1)
    type = 'bis';
  else type = 'ppl';
  const firstName = data.values.values.first_name?data.values.values.last_name:null;
  const lastName = data.values.values.last_name?data.values.values.last_name:null;
  const bisName = data.values.values.business_name ? data.values.values.business_name:null;
  const eMail = data.values.values.email ? data.values.values.email:null;
  const ip = data.values.ip;
  const phone = data.values.values.phone_2 ? data.values.values.phone_2:data.values.values.phone?data.values.values.phone:null;
  let obj = {
    firstName:firstName,
    lastName: lastName,
    bisName: bisName,
    ip: ip,
    phone: phone,
    email: eMail
  };
  const senderEmail = data.values.values.sender.email;
  const fname = data.values.values.sender.fname;
  const lname = data.values.values.sender.lname;
  const senderPhone = data.values.values.sender.phone || null;
  const requestURL = `${config.apiRoot}registerToMailingList?email=${senderEmail}&&fname=${fname}&&lname=${lname}&&phone=${phone}&&ip=${ip}&&type=${type}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  };
  requestNoParse(requestURL, options);
}

/**
 * Root saga manages watcher lifecycle
 */
// export default function* CreateFormData() {
//   const createWatcher = yield takeLatest(CREATE_RECORD, createRecord);

//   // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
//   yield cancel(createWatcher);
// }

export default [
  takeLatest(CREATE_RECORD, createRecord),
  takeLatest(REGISTER_TO_MAILING_LIST,register2MailingList)
];

