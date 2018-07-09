import {
  LOAD_SETTING_SUCCESS,  
  CREATE_SETTING_SUCCESS,
  CREATE_SETTING_FAILED,
} from './constants';


// The initial state of the App
const initialState = {
  setting: {}
};

function createFormReducer(state = initialState, action) {
  switch (action.type) {
     case CREATE_SETTING_FAILED:
      return state;
    case CREATE_SETTING_SUCCESS:
      return state;
    case LOAD_SETTING_SUCCESS:
      let obj = {};
      obj[action.dataKey] = action.response.setting ? action.response.setting.value : null;
      return Object.assign({}, state, {
        setting: Object.assign({}, state.settings, obj)
      });
    default:
      return state;
  }
}

export default createFormReducer;
