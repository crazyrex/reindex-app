import {
  RESULTS_SUCCESS,
  SET_SELECTED_ROWS,
  CATEGORIES_TREE_SUCCESS,
  CHANGE_TREE,
  RELATION_SUCCESS,
  CLOSE_CONNECT_2_CATEGORY_ALERT,
  SCORE_DATA_SUCCESS,
} from './constants';


// The initial state of the App
const initialState = {
  results: [],
  scoreData: [],
  scoreObj: {},
  totalResults: 0,
  limitResults: 0,
  selectedRows: [],
  categoriesTree: [],
  connect2CategoryAlert: {
    open: false,
    text: '',
  },
  searchBarData: {},
};

function adminSearchReducer(state = initialState, action) {
  switch (action.type) {
    case RESULTS_SUCCESS:
      return Object.assign({}, state, {
        state: 'search',
        results: action.response.data,
        totalResults: action.response.totalCount,
        limitResults: action.response.limit,
      });
    case SET_SELECTED_ROWS:
      return Object.assign({}, state, {
        selectedRows: action.rows,
      });
    case CATEGORIES_TREE_SUCCESS:
      return Object.assign({}, state, {
        categoriesTree: action.categories,
      });
    case CHANGE_TREE:
      return Object.assign({}, state, {
        categoriesTree: action.data,
      });
    case RELATION_SUCCESS:
      return Object.assign({}, state, {
        connect2CategoryAlert: Object.assign({}, state.connect2CategoryAlert, {
          open: true,
          text: action.response,
        }),
      });
    case CLOSE_CONNECT_2_CATEGORY_ALERT:
      return Object.assign({}, state, {
        connect2CategoryAlert: Object.assign({}, state.connect2CategoryAlert, {
          open: false,
          text: '',
        }),
      });
    case SCORE_DATA_SUCCESS:
      return Object.assign({}, state, {
        scoreData: action.data,
        scoreObj: _.keyBy(action.data, 'key'),
      });
    default:
      return state;
  }
}

export default adminSearchReducer;
