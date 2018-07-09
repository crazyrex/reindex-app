
import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import config from 'ReindexConfig';
import { LOAD_RESULTS, LOAD_CATEGORIES_TREE, RELATE_TO_CATEGORY, LOAD_SCORE_DATA , UPDATE_RECORD} from './constants';
import { resultsLoaded, categoriesTreeLoaded, relationSuccess, scoreDataSuccess  } from './actions';

export function* loadResults(data) {
  const state = yield select();
  
  const searchState = state.adminSearchBar.search;
  const tabType = searchState.activeTab;
  const searchData = searchState[tabType];
  let value = searchData.value;
  for (const index in state.adminSearchBar.search.filtersValue) {
    value = (tabType === 'businesses') ? value.concat(state.adminSearchBar.search.filtersValue[index]) : value;
  }
  const requestURL = `${config.apiRoot}getResults?type=${searchData.type}&offset=${data.data.page}${searchData.city ? `&city=${searchData.city}` : ''}${data.data.isSort ? `&sortBy=${data.data.sortBy}&order=${data.data.order}` : ''}`;
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({
        value,
      }),
    };
    const response = yield call(request, requestURL, options);
    yield put(resultsLoaded(response));
  } catch (err) {
    console.log(err);
  }
}


export function* loadCategoriesTree() {
  const requestURL = `${config.apiRoot}categories?index=${config.filtersTypes.categories.index}`;
  try {
    const options = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const categories = yield call(request, requestURL, options);
    yield put(categoriesTreeLoaded(categories));
  } catch (err) {
    console.log(err);
  }
}

export function* updateRecord(data) {
  const requestURL = `${config.apiRoot}record/${data.data._id}`;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
         Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify(data.data),
    };
    const response = yield call(requestNoParse, requestURL, options);
    if (typeof response === 'string') alert(response);
    // yield put(recordUpdated(response));
  } catch (err) {
    console.log(err);
  }
}

export function* relateToCat(data) {
  const state = yield select();
  const tabType = state.adminSearchBar.search.activeTab;
  const searchData = state.adminSearchBar.search[tabType];
  const requestURL = `${config.apiRoot}records/connect2category?type=${searchData.type}&action=${data.data.actionType.split(' ')[0]}${searchData.city ? `&city=${searchData.city}` : ''}`;
  let body = {};
  body.value = searchData.value;
  body.categories = data.data.categories;
  body.exceptIds = data.data.exceptIds.length?data.data.exceptIds:null;
  const rows = data.data.rows;
  if (rows && rows.length && rows.indexOf('all') === -1) body.ids = rows;
  if (body.exceptIds && body.exceptIds.length) body.exceptIds = data.data.exceptIds;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify(body),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(relationSuccess(response));
  } catch (err) {
    console.log(err);
  }
}

export function* getScoreData() {
  //   const requestURL = `${config.apiRoot}rating`;
  try {
    // const options = {
      //   method: 'get',
      //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // };
        // const response = yield call(request, requestURL, options);
        const response = [
        {
          key: 'top3',
          name: 'Top 3',
        },
        {
          key: 'top5',
          name: 'Top 5',
        },
        {
          key: 'top10',
          name: 'Top 10',
        },
        ];
        yield put(scoreDataSuccess(response));
      } catch (err) {
        console.log(err);
      }
    }
    
    /**
    * Root saga manages watcher lifecycle
    */
    // export function* adminSearchData() {
      //   const loadResultsWatcher = yield takeLatest(LOAD_RESULTS, loadResults);
      //   const loadCategoriesTreeWatcher = yield takeLatest(LOAD_CATEGORIES_TREE, loadCategoriesTree);
      //   const relateToCatWatcher = yield takeLatest(RELATE_TO_CATEGORY, relateToCat);
      //   const loadScoreData = yield takeLatest(LOAD_SCORE_DATA, getScoreData);
      
      
      //   // Suspend execution until location changes
      //   yield take(LOCATION_CHANGE);
      //   yield cancel(loadResultsWatcher);
      //   yield cancel(loadCategoriesTreeWatcher);
      //   yield cancel(relateToCatWatcher);
      //   yield cancel(loadScoreData);
      // }
      
      // Bootstrap sagas
      export default [
      takeLatest(LOAD_RESULTS, loadResults),
      takeLatest(LOAD_CATEGORIES_TREE, loadCategoriesTree),
      takeLatest(RELATE_TO_CATEGORY, relateToCat),
      takeLatest(LOAD_SCORE_DATA, getScoreData),
      takeLatest(UPDATE_RECORD, updateRecord)

      ];
      