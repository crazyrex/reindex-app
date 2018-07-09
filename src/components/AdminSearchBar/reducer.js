import config from 'ReindexConfig';
import {
  LOAD_FILTER_DATA,
  LOAD_FILTER_DATA_SUCCESS,
  LOAD_SUBCATEGORIES,
  LOAD_SUBCATEGORIES_SUCCESS,
  SET_ACTIVE_TAB,
  LOAD_CATEGORIES_FILTER_DATA_SUCCESS,
  UPDATE_SEARCH_OBJ,
  REDUCE_FILTERS,
  EMPTY_SUBCATEGORIES,
  LOAD_HIERARCHY_FILTER_DATA,
  LOAD_HIERARCHY_FILTER_DATA_SUCCESS,
  INIT_SEARCH,
} from './constants';


function spliceArray(array, index) {
  const tmp = array;
  tmp.splice(index);
  return tmp;
}

function initSearchObj() {
  const obj = {};
  Object.keys(config.searchTabs).forEach((key) => {
    obj[key] = {
      city: '',
      value: [],
      type: config.searchTabs[key].type,
    };
  });
  obj.activeTab = 'businesses';
  obj.filtersValue = {};
  return obj;
}

function returnText(searchText) {
  if (typeof searchText === 'string') return searchText;
  return searchText.text || searchText._source.content;
}

function updateSearchObj(search, data) {
  
  const tmp = JSON.parse(JSON.stringify(search));
  if (data.filterType === 'categories') {
    tmp[data.tabType].value = [returnText(data.searchText)];
    if (!tmp[data.tabType].value[0]) tmp[data.tabType].value = [];
    for (var index in tmp.filtersValue) {
      tmp.filtersValue[index] = [];
    }
  } else tmp[data.tabType][config.filtersTypes[data.filterType].queryParam] = returnText(data.searchText);
  if (data.activeTab) tmp.activeTab = data.activeTab;
  tmp.textToSearch = returnText(data.searchText);
  return tmp;
}

function updateCategoriesValue(search, data) {
  if (!data.updateValue) return search;
  const tmp = JSON.parse(JSON.stringify(search));
  if (!data.searchText) {
    if (!data.filter)
      tmp[data.tabType].value = [...spliceArray(tmp[data.tabType].value, data.index + 1)];
    else {
      tmp.filtersValue[data.filter] = [...spliceArray(tmp.filtersValue[data.filter], data.index)];
    }
  } else if (data.filter) {
    if (data.first) tmp.filtersValue[data.filter] = [];
    else {
      tmp.filtersValue[data.filter] = [...spliceArray(tmp.filtersValue[data.filter], data.index), returnText(data.searchText)];
      tmp[data.tabType].value.push(returnText(data.searchText));
    }
  } else tmp[data.tabType].value = [...spliceArray(tmp[data.tabType].value, data.index + 1), returnText(data.searchText)];
  // if (!tmp[data.tabType].value[0]) tmp[data.tabType].value[0] = '';
  
  return tmp;
}

// The initial state of the App
const initialState = {
  search: initSearchObj(),
  cities: [],
  filters: {},
  hierarchyFilters: {},
  categories: [],
  subCategories: [],
  hierarchySubCategories: {},
};

function processFiltersData(data) {
  data.map((o) => {
    const obj = o;
    obj.text = obj._source.content;
    obj.value = obj._id;
    return obj;
  });
  return data;
}

function searchReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_FILTER_DATA:
      return Object.assign({}, state, {
        search: updateSearchObj(state.search, action.data),
      });
    case UPDATE_SEARCH_OBJ:
      return Object.assign({}, state, {
        search: updateSearchObj(state.search, action.data),
      });
    case LOAD_FILTER_DATA_SUCCESS:
      return Object.assign({}, state, {
        [action.data.dataParams.filterType]: processFiltersData(action.data.response),
      });
    case REDUCE_FILTERS:

      if (!action.data.filter)
        return Object.assign({}, state, {
          search: updateCategoriesValue(state.search, action.data),
          subCategories: [...spliceArray(state.subCategories, action.data.index + 1)],
        });
      else
        return Object.assign({}, state, {
          search: updateCategoriesValue(state.search, action.data),
          hierarchySubCategories: Object.assign({}, state.hierarchySubCategories, {
            [action.data.filter]: [...spliceArray(state.hierarchySubCategories[action.data.filter], action.data.index + 1)],
          }),
        });
    case LOAD_SUBCATEGORIES:
      return Object.assign({}, state, {
        search: updateCategoriesValue(state.search, action.data),
        subCategories: [...spliceArray(state.subCategories, action.data.index + 1)],
      });
    case LOAD_SUBCATEGORIES_SUCCESS:
      let filters = {};
      for (var index in action.data.filters) {
        filters[index] = action.data.filters[index];
      }
      return Object.assign({}, state, {
        subCategories: action.data.length === 0 ? state.subCategories : [...state.subCategories, action.data.data],
        filters: Object.assign({}, state.filters, filters),
      });
    case SET_ACTIVE_TAB:
      return Object.assign({}, state, {
        search: Object.assign({}, state.search, {
          activeTab: action.activeTab,
        }),
      });
    case LOAD_CATEGORIES_FILTER_DATA_SUCCESS:
      return Object.assign({}, state, {
        filters: Object.assign({}, state.filters, {
          [action.response.category]: processFiltersData(action.response.data),
        }),
      });
    case EMPTY_SUBCATEGORIES:
      return Object.assign({}, state, {
        subCategories: [],
        hierarchySubCategories: {},
      });
    case LOAD_HIERARCHY_FILTER_DATA:
      return Object.assign({}, state, {
        hierarchySubCategories: Object.assign({}, state.hierarchySubCategories, {
          [action.data.filter]: (state.hierarchySubCategories[action.data.filter]) ? [...spliceArray(state.hierarchySubCategories[action.data.filter], action.data.index + 1)] : [],
        }),
        search: updateCategoriesValue(state.search, action.data),
      });
    case LOAD_HIERARCHY_FILTER_DATA_SUCCESS:
      return Object.assign({}, state, {
        hierarchyFilters: Object.assign({}, state.hierarchyFilters, {
          [action.data.key]: action.data.categories,
        }),
        hierarchySubCategories: Object.assign({}, state.hierarchySubCategories, {
          [action.data.key]: action.data.categories.length === 0 ? state.hierarchySubCategories[action.data.key] : [...state.hierarchySubCategories[action.data.key], action.data.categories]
        })
      });
    case 'INIT':
      if (action.data.cleanSearch && action.data.router.pathname === '/') {
        return Object.assign({}, state, {
          search: initSearchObj()
        });
      }
      return state;
    case INIT_SEARCH:
      return Object.assign({}, state, {
        search: initSearchObj(),
        categories: [],
        subCategories: [],
        hierarchySubCategories: {},
      });
    default:
      return state;
  }
}

export default searchReducer;
