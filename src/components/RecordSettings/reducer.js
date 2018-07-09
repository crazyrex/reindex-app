import {
  SCORE_UPDATE_SUCCESS,
  CLOSE_ALERT,
} from './constants';

// The initial state of the App
const initialState = {
  recordSettingsAlert: {
    open: false,
    text: '',
  },
};

function recordSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case SCORE_UPDATE_SUCCESS:
      return Object.assign({}, state, {
        recordSettingsAlert: Object.assign({}, state.recordSettingsAlert, {
          open: true,
          text: action.data,
        }),
      });
    case CLOSE_ALERT:
      return Object.assign({}, state, {
        recordSettingsAlert: Object.assign({}, state.recordSettingsAlert, {
          open: false,
          text: '',
        }),
      });
    default:
      return state;
  }
}

export default recordSettingsReducer;
