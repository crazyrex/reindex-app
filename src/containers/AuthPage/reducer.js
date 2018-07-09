import { AUTH_SUCCESS } from './constants';
// The initial state of the App
const initialState = {
  loggedIn: false,
};

function authReducer(state = initialState, action) {
  switch (action.type) {
    case AUTH_SUCCESS: {
      let loggedIn = false;
      if(action.user.token){
        localStorage.setItem('token', action.user.token);
        loggedIn = true
      }
      return Object.assign({}, state, {
        loggedIn: loggedIn,
      });
    }
    default:
    return state;
  }
}

export default authReducer;
