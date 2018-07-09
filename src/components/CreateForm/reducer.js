import {
  CREATE_RECORD_SUCCESS,
  CLOSE_CREATE_RECORD_MODAL,
  CREATE_RECORD_FAILED,
} from './constants';


// The initial state of the App
const initialState = {
  goToTnxPage: false,
  createRecordAlert: {
    text: '',
    open: false,
  },
};

function createFormReducer(state = initialState, action) {
  switch (action.type) {
     case CREATE_RECORD_FAILED:
      return Object.assign({}, state, {
        createRecordAlert: Object.assign({}, state.createRecordAlert, {
          open: true,
          text: 'הבקשה נכשלה',
        })
      });
    case CREATE_RECORD_SUCCESS:
      return Object.assign({}, state, {
        createRecordAlert: Object.assign({}, state.createRecordAlert, {
          open: true,
          text: action.response,
        }),
        goToTnxPage: true,
      });
    case CLOSE_CREATE_RECORD_MODAL:
      return Object.assign({}, state, {
        createRecordAlert: Object.assign({}, state.createRecordAlert, {
          open: false,
          text: '',
        }),
        goToTnxPage: false,
      });
    default:
      return state;
  }
}

export default createFormReducer;
