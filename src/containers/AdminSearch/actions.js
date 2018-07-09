import {
  RESULTS_SUCCESS,
  LOAD_RESULTS,
  SET_SELECTED_ROWS,
  LOAD_CATEGORIES_TREE,
  CATEGORIES_TREE_SUCCESS,
  CHANGE_TREE,
  RELATE_TO_CATEGORY,
  RELATION_SUCCESS,
  CLOSE_CONNECT_2_CATEGORY_ALERT,
  LOAD_SCORE_DATA,
  SCORE_DATA_SUCCESS,
  UPDATE_RECORD,
  UPDATE_RECORD_SUCCESS
} from './constants';


export function loadResults(data) {
  return {
    type: LOAD_RESULTS,
    data,
  };
}

export function updateRecord(data) {
  return {
    type: UPDATE_RECORD,
    data,
  };
}

export function recordUpdated(response) {
  return {
    type: UPDATE_RECORD_SUCCESS,
    response,
  };
}

export function resultsLoaded(response) {
  return {
    type: RESULTS_SUCCESS,
    response,
  };
}

export function setSelectedRows(rows) {
  return {
    type: SET_SELECTED_ROWS,
    rows,
  };
}

export function loadCategoriesTree() {
  return {
    type: LOAD_CATEGORIES_TREE,
  };
}

export function categoriesTreeLoaded(categories) {
  return {
    type: CATEGORIES_TREE_SUCCESS,
    categories,
  };
}

export function changeTreeDate(data) {
  return {
    type: CHANGE_TREE,
    data,
  };
}

export function relateToCategory(data) {
  return {
    type: RELATE_TO_CATEGORY,
    data,
  };
}

export function relationSuccess(response) {
  return {
    type: RELATION_SUCCESS,
    response,
  };
}

export function closeConnect2CategoryAlert() {
  return {
    type: CLOSE_CONNECT_2_CATEGORY_ALERT,
  };
}

export function loadScoreData() {
  return {
    type: LOAD_SCORE_DATA,
  };
}

export function scoreDataSuccess(data) {
  return {
    type: SCORE_DATA_SUCCESS,
    data,
  };
}
