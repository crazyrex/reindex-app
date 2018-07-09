import {
  LOAD_RESULTS,
  RESULTS_SUCCESS,
  UPDATE_RECORD_SUCCESS,
  CLOSE_UPDATE_RECORD_MODAL,
} from './constants';


// The initial state of the App
const initialState = {
  results: [],
  totalResults: 0,
  limitResults: 0,
  offsetResults: 1,
  loading: false,
  updateRecordAlert: {
    text: '',
    open: false,
  },
  goToTnxPage: false,
};

function processResults(results) {
  results.map((res) => {
    if (res._source.listing_type_1 === 1) res._source.link = `/ppl/${res._id}/${res._source.first_name}_${res._source.last_name}`;
    else res._source.link = `/biz/${res._id}/${res._source.reindexTitle}`;
    res._source.link = res._source.link.replace(/ /g, '-');
    res.expanded = false;
    return res;
  });

  return results;
}

function resultsPageReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_RESULTS:
      return Object.assign({}, state, {
        offsetResults: action.data.page,
        loading: true,
      });
    case RESULTS_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        state: 'search',
        results: state.offsetResults > 1 ? [...state.results, ...processResults(action.response.data)] : processResults(action.response.data),
        totalResults: action.response.totalCount,
        limitResults: action.response.limit,
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
        createRecordAlert: Object.assign({}, state.updateRecordAlert, {
          open: false,
          text: '',
        }),
        goToTnxPage: false,
      });
    default:
      return state;
  }
}

export default resultsPageReducer;
