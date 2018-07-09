import {
  CLOSE_ALERT,
  UPLOAD_RECORDS_SUCCESS,
} from './constants';


// The initial state of the App
const initialState = {
  recordsAlert: {
    open: false,
    text: ''
  }
};

function AdminRecordsReducer(state = initialState, action) {
  switch (action.type) {
    case UPLOAD_RECORDS_SUCCESS:
      return Object.assign({}, state, {
        recordsAlert: Object.assign({}, state.recordsAlert, {
          open: true,
          text: action.response,
        }),
      });
    case CLOSE_ALERT:
      return Object.assign({}, state, {
        recordsAlert: Object.assign({}, state.recordsAlert, {
          open: false,
          text: '',
        }),
      });
    default:
      return state;
  }
}

export default AdminRecordsReducer;
