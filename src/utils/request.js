import 'whatwg-fetch';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * 
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  try {
    return response.json();
  } catch (e) {
    return response.message || response.text(); // for case response is not a json
  }
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw response.json() || response.text();
  // try {
  //   throw response.json();
  // } catch (e) {
  //   throw response.text();
  // }
}

function checkStatusNoParse(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw response.text();
}


/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export function requestNoParse(url, options) {
  return fetch(url, options)
    .then(checkStatusNoParse)
    .then((res) => res.message || res.text());
}

export function fullRequest(url, options) {
  return fetch(url, options)
    .then(checkStatus);
}
