import {
  LOAD_CATEGORIES,
  LOAD_CATEGORIES_SUCCESS,
  GET_ALL_PARENTS,
  GET_ALL_PARENTS_SUCCESS,
  DELETE_TAG,
  DELETE_TAGS,
  INIT_CATEGORIES,
  UPDATE_TREE,
} from './constants';

export function loadCategories(data) {
  return {
    type: LOAD_CATEGORIES,
    data,
  }
}

export function categoriesLoaded(data) {
  return {
    type: LOAD_CATEGORIES_SUCCESS,
    data,
  }
}

export function getAllParents(data) {
  return {
    type: GET_ALL_PARENTS,
    data,
  }
}

export function categoriesParentsLoaded(data) {
  return {
    type: GET_ALL_PARENTS_SUCCESS,
    data,
  }
}

export function deleteTag(tag) {
  return {
    type: DELETE_TAG,
    tag,
  }
}

export function deleteTags(tag) {
  return {
    type: DELETE_TAGS,
    tag,
  }
}

export function initCategories(data) {
  return {
    type: INIT_CATEGORIES,
    data,
  }
}

export function updateTree(data) {
  return {
    type: UPDATE_TREE,
    data,
  }
}