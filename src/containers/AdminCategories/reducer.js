import {
  UPDATE_TREE_SUCCESS,
  CLOSE_RESPONSE_ALERT,
} from './constants';


// The initial state of the App
const initialState = {
  actionResponseAlert: {
    open: false,
    text: ''
  }
};

function adminCategoriesReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TREE_SUCCESS:
      return Object.assign({}, state, {
        actionResponseAlert: Object.assign({}, state.actionResponseAlert, {
          open: true,
          text: action.response,
        }),
      });
    case CLOSE_RESPONSE_ALERT:
      return Object.assign({}, state, {
        actionResponseAlert: Object.assign({}, state.actionResponseAlert, {
          open: false,
          text: '',
        }),
      });
    default:
      return state;
  }
}

export default adminCategoriesReducer;
