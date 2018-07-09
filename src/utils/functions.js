import _ from 'lodash';
import config from 'ReindexConfig';
import {
  browserHistory
} from 'react-router';
import { delay } from 'redux-saga';

function splice(str, index, count, add) {
  let _index = index;
  if (index < 0) {
    _index = str.length + index;
    if (index < 0) {
      _index = 0;
    }
  }
  return str.slice(0, index) + (add || '') + str.slice(index + count);
}

export function getPhone(arr, virtualNumber) {
  const phoneArr = [];
  arr = _.isArray(arr) ?
    arr : [arr];
  arr.forEach((str) => {
    str = (str) ?
      `${str}` :
      '';
    const _phoneArr = (str.indexOf('|') > -1) ?
      str.split('|') : [str];
    for (let i = 0; i < _phoneArr.length; i++) {
      let tmp = `${_phoneArr[i]}`;
      if (!tmp) continue;
      const first = tmp.charAt(0);
      tmp = ['*', '0', '1'].indexOf(first) === -1 ?
        `0${tmp}` :
        tmp;

      if (virtualNumber && tmp === virtualNumber.rtpn) tmp = virtualNumber.value;
      if (tmp.charAt(0) === '0') {
        if (tmp.indexOf('undefined') > -1) tmp = '';
        if (tmp.length === 9) tmp = splice(tmp, 2, 0, '-');
        else if (tmp.length === 10) tmp = splice(tmp, 3, 0, '-');
      }
      phoneArr.push(tmp);
    }
  });
  return phoneArr;
}

export function detectmob() {
  const userAgent = navigator.userAgent || '';
  if (userAgent.match(/Android/i) ||
    userAgent.match(/webOS/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPod/i) ||
    userAgent.match(/BlackBerry/i) ||
    userAgent.match(/Windows Phone/i)) {
    return true;
  }
  return false;
}

export function getWebsite(website) {
  let url = website;
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }
  return url;
}


function searchToObject(location) {
  if (!location.search || location.search === '') return {};
  if (Object.keys(location.search).length >= 0 && location.search.constructor === Object) return location.search;
  if (location.search.charAt(0) !== '?') location.search = `?${location.search}`;
  let pairs = location.search.substring(1).split('&'),
    obj = {},
    pair,
    i;

  for (i in pairs) {
    if (pairs[i] === '') continue;

    pair = pairs[i].split("=");
    obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return obj;
}

export function getLocationData(location) {
  const pathnameArray = location.pathname.split('?')[0].split('/');
  if (pathnameArray[0] === '') pathnameArray.shift();
  const obj = {};
  obj.search = searchToObject(location);
  obj.tab = pathnameArray[0] === config.searchTabs.businesses.route ? 'businesses' :
    (pathnameArray[0] === config.searchTabs.people.route ? 'people' : '');
  obj.tabRoute = (obj.tab === 'businesses' || obj.tab === 'people') ? config.searchTabs[obj.tab].route : '';
  obj.pathname = location.pathname;
  if (obj.tab === 'businesses' && pathnameArray[1]) {
    obj.lastCategory = {
      val: pathnameArray[1].replace(/-/g, ' ').replace(/_/g, '-')
    };
  }

  return obj;
}

export function toQueryString(paramsObject) {
  return Object
    .keys(paramsObject)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`)
    .join('&');
}

export function updateSearchLocation(key, value, tab, bool) {
  let path;
  const locationData = getLocationData(window.location);
  let val = (typeof value === 'object') ? value.text || value._source.content : value;
  if (['s', 'q', 'categories'].indexOf(key) !== -1) val = val.replace(/-/g, '_');
  if (tab) {
    path = config.searchTabs[tab].route;
    for (const index of Object.keys(locationData.search)) {
      delete locationData.search[index];
    }
  } else {
    path = locationData.pathname;
  }
  if (key === 'categories') {
    path += `/${val}`;
  } else {
    locationData.search[key] = val;
  }
  if (locationData.search.lat == '' && locationData.search.lon == '') {
    delete locationData.search.lat;
    delete locationData.search.lon;
  }
  if (locationData.search.lat && locationData.search.location && !bool) {
    delete locationData.search.location;
  }
  else if (locationData.search.lat && locationData.search.lon && locationData.search.location && bool) {
    delete locationData.search.lat;
    delete locationData.search.lon;
  }
  const queryString = toQueryString(locationData.search);
  path = (queryString) ? `${path}?${toQueryString(locationData.search)}` : path;
  if (path.charAt(0) !== '/') path = `/${path}`;
  path = decodeURI(path);
  path = path.replace(/ /g, '-');
  browserHistory.push(`${path}`);
}

export function str2dash(str) {
  return str.replace(/-/g, '_').replace(/ /g, '-');
}

export function str2spc(str) {
  return str.replace(/-/g, ' '); // .replace(/_/g, '-') */;
}

export default [
  getPhone,
  detectmob,
  getWebsite,
  searchToObject,
  toQueryString,
  updateSearchLocation,
  str2dash,
  str2spc,
];