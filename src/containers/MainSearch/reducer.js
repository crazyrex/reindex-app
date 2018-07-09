import {
  LOAD_RESULTS,
  RESULTS_SUCCESS,
  CHANGE_STATE,
  UPDATE_RECORD_SUCCESS,
  CLOSE_UPDATE_RECORD_MODAL,
  DISPLAY_ICONS,
  ISDATA_RESULT
} from './constants';

// The initial state of the App
const initialState = {
  state: 'main',
  results: [],
  totalResults: 0,
  limitResults: 0,
  offsetResults: 1,
  updateRecordAlert: {
    text: '',
    open: false,
  },
  displayIcons: true,
};

function processResults(results) {
  results.map((res) => {
    const lastCat = res._source.categories[res._source.categories.length - 1];
    let lastTag;
    if (res._source.tags) {
      lastTag = res._source.tags.split('|')[res._source.tags.split('|').length - 1] || res._source.tags.split('|')[res._source.tags.split('|').length - 2];
      lastTag = lastTag.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    res._source.link = `/biz/${res._source.address_city}/${lastCat || lastTag || ''}?id=${res._id}`;
    res._source.link = res._source.link.replace(/ /g, '_');
    res.expanded = false;
    return res;
  });
  return results;
}

function mainSearchReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_RESULTS:
      return Object.assign({}, state, {
        offsetResults: action.data.page,
      });
    case ISDATA_RESULT:
    console.log('111111',action)
      return Object.assign({}, state, {
        isData: action.result,
      });
    case RESULTS_SUCCESS:
      return Object.assign({}, state, {
        state: 'search',
        results: state.offsetResults > 1 ? [...state.results, ...processResults(action.response.data)] : processResults(action.response.data),
        totalResults: action.response.totalCount,
        limitResults: action.response.limit,
      });
    case CHANGE_STATE:
      return Object.assign({}, state, {
        state: 'main',
        categories: [],
        subCategories: [],
        selectedSub: [],
        results: [],
      });
    case UPDATE_RECORD_SUCCESS:
      return Object.assign({}, state, {
        updateRecordAlert: Object.assign({}, state.updateRecordAlert, {
          open: true,
          text: action.response,
        }),
      });
    case CLOSE_UPDATE_RECORD_MODAL:
      return Object.assign({}, state, {
        createRecordAlert: Object.assign({}, state.updateRecordAlert, {
          open: false,
          text: '',
        }),
      });
    case DISPLAY_ICONS:
      return Object.assign({}, state, {
        displayIcons: action.data.displayIcons,
      });
    default:
      return state;
  }
}

export default mainSearchReducer;
