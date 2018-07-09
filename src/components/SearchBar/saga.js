import { take, put, call, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request from 'utils/request';
import config from '../../ReindexConfig';
import { LOAD_FILTER_DATA, LOAD_SUBCATEGORIES, LOAD_CATEGORIES_FILTER_DATA, LOAD_HIERARCHY_FILTER_DATA } from './constants';
import { filterDataLoaded, subCategoriesLoaded, categoriesFilterDataLoaded, hierarchyFilterDataLoaded } from './actions';


export function* loadFilterData(data) {
  const requestURL = `${config.apiRoot}getCategories`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        term: 'content.ac',
        value: data.data.searchText,
        index: config.filtersTypes[data.data.filterType].index,
        type: config.filtersTypes[data.data.filterType].type,
      }),
    };
    const response = yield call(request, requestURL, options);
    yield put(filterDataLoaded({ response, dataParams: data.data }));
  } catch (err) {
    console.log(err);
  }
}

export function* loadSubcategories(data) {
  const requestURL = `${config.apiRoot}getSubCategories?index=${config.categoriesIndex}${data.data.searchText ? `&routing=${data.data.searchText._id}` : ''}${data.data.children ? `&children=true&value=${encodeURI(data.data.value)}` : ''}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const subCategories = yield call(request, requestURL, options);
    yield put(subCategoriesLoaded(subCategories));
  } catch (err) {
    console.log(err);
  }
}

export function* loadHierarchyFilterData(data) {
  const requestURL = `${config.apiRoot}getSubCategories?routing=${data.data.searchText._id}&index=${config.categoriesIndex}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const subCategories = yield call(request, requestURL, options);
    yield put(hierarchyFilterDataLoaded({key: data.data.filter, categories: subCategories.data}));
  } catch (err) {
    console.log(err);
  }
}

export function* loadCategoriesFilterData(data) {
  if (!data.category) return;
  let index;
  if(data.category == 'reindex-cities')
    index = 'cities';
  if(data.category == 'reindex-categories')
    index = 'A';
  const requestURL = `${config.apiRoot}categories?type=${index}&index=${data.category}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const categories = yield call(request, requestURL, options);
    yield put(categoriesFilterDataLoaded({ category: data.category, data: categories }));
  } catch (err) {
    console.log(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
// export default function* SearchData() {
//   const loadFilterDataWatcher = yield takeLatest(LOAD_FILTER_DATA, loadFilterData);
//   const loadSubCategoriesWatcher = yield takeLatest(LOAD_SUBCATEGORIES, loadSubcategories);
//   const loadCategoriesFilterDataWatcher = yield takeLatest(LOAD_CATEGORIES_FILTER_DATA, loadCategoriesFilterData);
//   const loadHierarchyFilterDataWatcher = yield takeLatest(LOAD_HIERARCHY_FILTER_DATA, loadHierarchyFilterData);

//   // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
//   yield cancel(loadFilterDataWatcher);
//   yield cancel(loadSubCategoriesWatcher);
//   yield cancel(loadCategoriesFilterDataWatcher);
//   yield cancel(loadHierarchyFilterDataWatcher);
// }

// Bootstrap sagas
export default [
  takeLatest(LOAD_FILTER_DATA, loadFilterData),
  takeLatest(LOAD_SUBCATEGORIES, loadSubcategories),
  takeLatest(LOAD_CATEGORIES_FILTER_DATA, loadCategoriesFilterData),
  takeLatest(LOAD_HIERARCHY_FILTER_DATA, loadHierarchyFilterData),
];

