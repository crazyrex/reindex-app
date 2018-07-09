import { VIRTUAL_NUMBER_CREATED } from './constants';


// The initial state of the App
const initialState = {
  newVirtualNumbers: {},
};

function PhoneReducer(state = initialState, action) {
  switch (action.type) {
    case VIRTUAL_NUMBER_CREATED:
      return Object.assign({}, state, {
        newVirtualNumbers: Object.assign({}, state.newVirtualNumbers, {
          [action.response.recordId] : action.response.number,
        })
      });
   
    default:
      return state;
  }
}

export default PhoneReducer;
