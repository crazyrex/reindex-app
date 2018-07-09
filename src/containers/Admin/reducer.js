import _ from 'lodash';
import {
  LOAD_CATEGORIES_SUCCESS,
  LOAD_SUBCATEGORIES_SUCCESS,
  RESET_SUBCATEGORIES,
  LOAD_SUBCATEGORIES,
  RESULTS_SUCCESS,
} from './constants';

const ICONS = [{
  title: 'נותני שירותים',
  icon: 'arrange-bring-forward',
}, {
  title: 'חנויות',
  icon: 'shopping',
}, {
  title: 'אוכל',
  icon: 'food',
}, {
  title: 'תיירות ונופש',
  icon: 'airplane',
}, {
  title: 'בריאות',
  icon: 'medical-bag',
}, {
  title: 'לימודים',
  icon: 'book-open-page-variant',
}, {
  title: 'אירועים',
  icon: 'calendar',
}, {
  title: 'מידע',
  icon: 'information',
}, {
  title: 'רכב ותחבורה',
  icon: 'car',
}, {
  title: 'ילדים ותינוקות',
  icon: 'baby',
}];

function processCategories(categories) {
  return categories.map((obj) => {
    const rObj = obj;
    rObj['_source'] = obj['_source'].content;
    return rObj;
  });
}

function spliceArray(array, index) {
  const tmp = array;
  tmp.splice(index);
  return tmp;
}

function processSelected(state, params) {
  if (state.subCategories.length === 0) {
    return [];
  }
  const tmp = [...spliceArray(state.selectedSub, params.index)];
  tmp.push(state.subCategories[params.index][params.key]);
  return tmp;
}


// The initial state of the App
const initialState = {
  state: 'main',
  categories: [],
  subCategories: [],
  selectedSub: [],
  results: [],
  searchIcons: ICONS,
};

function adminReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CATEGORIES_SUCCESS:
      return Object.assign({}, state, {
        categories: processCategories(action.categories),
      });
    case RESET_SUBCATEGORIES:
      return Object.assign({}, state, {
        subCategories: [],
      });
    case LOAD_SUBCATEGORIES:
      return Object.assign({}, state, {
        subCategories: [...spliceArray(state.subCategories, action.params.index + 1)],
        selectedSub: processSelected(state, action.params),
      });
    case LOAD_SUBCATEGORIES_SUCCESS:
      return Object.assign({}, state, {
        state: 'search',
        selectedSub: [...state.selectedSub, action.categories[0]],
        subCategories: action.categories.length === 0 ? state.subCategories : [...state.subCategories, action.categories],
      });
    case RESULTS_SUCCESS:
      return Object.assign({}, state, {
        results: action.results,
      });
    default:
      return state;
  }
}

export default adminReducer;
