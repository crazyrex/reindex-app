import {
  DATA_SUCCESS,
  CLEAN_DATA,
} from './constants';

function processData(data) {
  return Object.assign({}, data, {
    sender: Object.assign({}, data.sender, {
      fname: localStorage.getItem('sender.fname') || '',
      lname: localStorage.getItem('sender.lname') || '',
      email: localStorage.getItem('sender.email') || '',
      is_agreed_to_receive_data: localStorage.getItem('sender.is_agreed_to_receive_data') || '',
    }),
  });
}

const initialState = {
  data: {},
};

function detailsFormReducer(state = initialState, action) {
  switch (action.type) {
    case DATA_SUCCESS:
      return {
        data: processData(action.data),
      };
    case CLEAN_DATA: {
      return {
        data: {}
      };
    }
    default:
      return state;
  }
}

export default detailsFormReducer;
