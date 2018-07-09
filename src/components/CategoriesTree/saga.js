import { take, put, call, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import config from '../../ReindexConfig';
import { LOAD_CATEGORIES, GET_ALL_PARENTS, UPDATE_TREE } from './constants';
import { categoriesLoaded, categoriesParentsLoaded } from './actions';
import { treeUpdated } from '../../containers/AdminCategories/actions';

export function* loadCategories() {
  const requestURL = `${config.apiRoot}categories?index=${config.filtersTypes.categories.index}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const categories = yield call(request, requestURL, options);
    yield put(categoriesLoaded(categories));
  } catch (err) {
    console.log(err);
  }
}

export function* getParents(data) {
  const requestURL = `${config.apiRoot}getCategoryParents/${data.data.title}/${data.data.id}`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        node: data.data,
      }),
    };
    const parents = yield call(request, requestURL, options);
    yield put(categoriesParentsLoaded(parents));
  } catch (err) {
    console.log(err);
  }
}

export function* updateTree(data) {
  const methods = {
    add: 'post',
    changeLocation: 'put',
    delete: 'delete'
  };
  let requestURL = `${config.apiRoot}category`;
  if (data.data.action !== 'add') requestURL = `${requestURL}/${data.data.node.id}`;
  try {
    const newParent = data.data.newParent;
    if (newParent && newParent.children) delete newParent.children;
    const options = {
      method: methods[data.data.action],
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        node: data.data.node,
        newParent,
      }),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(treeUpdated(response));
  } catch (err) {
    err.then((_data) => alert(_data));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
// export default function* CategoriesTreeData() {
//   const loadDataWatcher = yield takeLatest(LOAD_CATEGORIES, loadCategories);
//   const getParentsWatcher = yield takeLatest(GET_ALL_PARENTS, getParents);
//   const updateTreeWatcher = yield takeLatest(UPDATE_TREE, updateTree);

//   // Suspend execution until location changes
//   yield take(LOCATION_CHANGE);
//   yield cancel(updateTreeWatcher);
//   // yield cancel(loadDataWatcher);
//   // yield cancel(getParentsWatcher);
// }

export default [
  takeLatest(LOAD_CATEGORIES, loadCategories),
  takeLatest(GET_ALL_PARENTS, getParents),
  takeLatest(UPDATE_TREE, updateTree),
];

