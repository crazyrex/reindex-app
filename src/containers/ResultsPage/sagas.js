import { take, put, call, cancel, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import request, { requestNoParse } from 'utils/request';
import { getLocationData, str2spc } from 'utils/functions';
import config from '../../ReindexConfig';
import { LOAD_RESULTS, UPDATE_RECORD } from './constants';
import { resultsLoaded, recordUpdated } from './actions';
import { updateSearchObj } from 'components/SearchBar/actions';

// const filtersOutOfValue = ['location', 'kashrut', 'test' , 'comeFrom'];
const filtersInValue = ['q', 's'];

export function* loadResults(data) {
  const locationData = getLocationData(data.data.location);
  const tabType =  config.searchTabs[locationData.tab].type;
  let value = [];
  for (let index in locationData.search) {
    if (filtersInValue.indexOf(index) >= 0) value.push(decodeURI(locationData.search[index]).replace(/-/g, ' ').replace(/_/g, '-'));
  }
  if (locationData.lastCategory) value.push(decodeURI(locationData.lastCategory.val));
  const requestURL = encodeURI(`${config.apiRoot}getResults?type=${tabType}&offset=${data.data.page}${locationData.search.location ? `&city=${locationData.search.location}`: ''}${locationData.search.phone ? `&phone=${locationData.search.phone}`: ''}${locationData.search.kashrut ? `&kashrut=${locationData.search.kashrut}`: ''}`);
  try {
    const options = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        value,
        lat :locationData.search.lat ? locationData.search.lat:null,
        lon :locationData.search.lon ? locationData.search.lon:null,
        captcha: data.data.captcha,
        onlyCategoriesFilter: locationData.lastCategory ? true : false,
      }),
    };
    const response = yield call(request, requestURL, options);
    yield put(resultsLoaded(response));
  } catch (err) {
    console.log(err);
  }
}

export function* updateRecord(data) {
  const requestURL = `${config.apiRoot}records/${data.record.values._id}`;
  data.record.values.categories = data.record.categories;
  try {
    const options = {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data.record.values),
    };
    const response = yield call(requestNoParse, requestURL, options);
    yield put(recordUpdated(response));
  } catch (err) {
    console.log(err);
  }
}

// Bootstrap sagas
export default [
  takeLatest(LOAD_RESULTS, loadResults),
  takeLatest(UPDATE_RECORD, updateRecord)
];
