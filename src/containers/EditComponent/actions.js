import {
    LOAD_RECORDS_SUCCESS,
    LOAD_RECORDS,
    LOAD_TOOLTIPS_SUCCESS,
    LOAD_TOOLTIPS,
    SET_TOOLTIP,
    SET_TOOLTIP_SUCCESS,
    UPDATE_TOOLTIP,
    UPDATE_TOOLTIP_SUCCESS,
    DELETE_TOOLTIP,
    DELETE_TOOLTIP_SUCCESS
  } from './constants';
  
  export function loadRecords(data) {
    return {
      type: LOAD_RECORDS,
      data
    };
  }

  export function recordsLoaded(response) {
    return {
        type:LOAD_RECORDS_SUCCESS,
        response
    };
  }


  export function loadTooltips(data) {
    return {
      type: LOAD_TOOLTIPS,
      data
    };
  }

  export function tooltipsLoaded(response) {
    console.log('TOOLTIPS Loaded');
    return {
        type:LOAD_TOOLTIPS_SUCCESS,
        response
    };
  }
  export function deleteTooltip(data) {
    return {
      type: DELETE_TOOLTIP,
      data,
    };
  } 
  export function deleteTooltipSuccess(data,id) {
    console.log('deleteTooltipSuccess action');

    return {
      type: DELETE_TOOLTIP_SUCCESS,
      data,
      id,
    };
  }
  export function setTooltip(data) {
    return {
      type: SET_TOOLTIP,
      data
    };
  }

  export function setTooltipSuccess(response) {
    console.log('setTooltipSuccess action');

    return {
        type:SET_TOOLTIP_SUCCESS,
        response
    };
  }

  export function updateTooltip(response) {
    console.log('updateTooltip action');
    return {
        type:UPDATE_TOOLTIP,
        response
    };
  }

  export function updateTooltipSuccess(response) {
    console.log('updateTooltipSuccess action');
    return {
        type:UPDATE_TOOLTIP_SUCCESS,
        response
    };
  }
  