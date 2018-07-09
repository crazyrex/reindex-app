import {
  CHANGE_STATE,
  DATA_SUCCESS,
  UPDATE_RECORD_SUCCESS,
  CLOSE_UPDATE_RECORD_MODAL,
} from './constants';

// The initial state of the App
const initialState = {
  state: 'main',
  data: {},
  goToTnxPage: false,
  updateRecordAlert: {
    text: '',
    open: false,
  },
};

function recordReducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_STATE:
      return Object.assign({}, state, {
        state: 'main',
      });
    case DATA_SUCCESS:
      return Object.assign({}, state, {
        data: action.data,
      });
    case UPDATE_RECORD_SUCCESS:
      return Object.assign({}, state, {
        updateRecordAlert: Object.assign({}, state.updateRecordAlert, {
          open: true,
          text: action.response,
        }),
        goToTnxPage: true,
      });
    case CLOSE_UPDATE_RECORD_MODAL:
      return Object.assign({}, state, {
        updateRecordAlert: Object.assign({}, state.updateRecordAlert, {
          open: false,
          text: '',
        }),
        goToTnxPage: false,
      });
    default:
      return state;
  }
}

export default recordReducer;
