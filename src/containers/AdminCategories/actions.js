import {
 UPDATE_TREE_SUCCESS,
 CLOSE_RESPONSE_ALERT,
} from './constants';

export function treeUpdated(response) {
  return {
    type: UPDATE_TREE_SUCCESS,
    response,
  }
}
export function closeActionResponseAlert() {
    return {
        type: CLOSE_RESPONSE_ALERT, 
    }
}