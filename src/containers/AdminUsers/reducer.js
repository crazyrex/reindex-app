import {
    USERS_LOADED,
    USER_UPDATED
  } from './constants';
  
  // The initial state of the App
  const initialState = {
    data: [],
    isUpdated: false
  };
  
  function adminUsersReducer(state = initialState, action) {
    switch (action.type) {
      case USERS_LOADED:
        return Object.assign({}, state, {
          data: action.users,
        });
      case USER_UPDATED:
      return Object.assign({}, state, {
        isUpdated: true,
      });
      default:
        return state;
    }
  }
  
  export default adminUsersReducer;
  