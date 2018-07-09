import {
    LANDSCAPES_SUCCESS,
    LOAD_LANDSCAPES
  } from './constants';
  
  export function loadLandscapes(data) {
    return {
      type: LOAD_LANDSCAPES,
      data
    };
  }

  export function landscapesLoaded(response) {
    return {
        type: LANDSCAPES_SUCCESS,
        response
    };
  }