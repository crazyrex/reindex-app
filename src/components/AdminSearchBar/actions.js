import {
  LOAD_FILTER_DATA, // for autocomplete
  LOAD_FILTER_DATA_SUCCESS,
  LOAD_SUBCATEGORIES,
  LOAD_SUBCATEGORIES_SUCCESS,
  SET_ACTIVE_TAB,
  LOAD_CATEGORIES_FILTER_DATA,
  LOAD_CATEGORIES_FILTER_DATA_SUCCESS,
  UPDATE_SEARCH_OBJ,
  REDUCE_FILTERS,
  EMPTY_SUBCATEGORIES,
  LOAD_HIERARCHY_FILTER_DATA,
  LOAD_HIERARCHY_FILTER_DATA_SUCCESS,
} from './constants';

export function loadFilterData(data) {
  return {
    type: LOAD_FILTER_DATA,
    data,
  };
}

export function filterDataLoaded(data) {
  return {
    type: LOAD_FILTER_DATA_SUCCESS,
    data,
  };
}

export function loadSubCategories(data) {
  return {
    type: LOAD_SUBCATEGORIES,
    data,
  };
}

export function subCategoriesLoaded(data) {
  return {
    type: LOAD_SUBCATEGORIES_SUCCESS,
    data,
  };
}

export function setActiveTab(activeTab) {
  return {
    type: SET_ACTIVE_TAB,
    activeTab,
  };
}

export function loadCategoriesFilterData(category) {
  return {
    type: LOAD_CATEGORIES_FILTER_DATA,
    category,
  };
}

export function categoriesFilterDataLoaded(response) {
  return {
    type: LOAD_CATEGORIES_FILTER_DATA_SUCCESS,
    response,
  }
}

export function updateSearchObj(data) {
  return {
    type: UPDATE_SEARCH_OBJ,
    data,
  }
}

export function reduceFilters(data) {
  return {
    type: REDUCE_FILTERS,
    data,
  };
}

export function emptySubCategories() {
  return {
    type: EMPTY_SUBCATEGORIES,
  }
}

export function loadHierarchyFilterData(data) {
  return {
    type: LOAD_HIERARCHY_FILTER_DATA,
    data,
  }
}

export function hierarchyFilterDataLoaded(data) {
  return {
    type: LOAD_HIERARCHY_FILTER_DATA_SUCCESS,
    data,
  }
}