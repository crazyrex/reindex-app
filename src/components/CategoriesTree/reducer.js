import _ from 'lodash';

import {
  LOAD_CATEGORIES_SUCCESS,
  GET_ALL_PARENTS_SUCCESS,
  DELETE_TAG,
  DELETE_TAGS,
  INIT_CATEGORIES,
} from './constants';

function getKey(node) {
  return node.id;
}

function getParentKey(node) {
  return node.parentId;
}

const getTree = (data) => {
  const getTreeFromFlatData = require('react-sortable-tree').getTreeFromFlatData;

  let flatData = [];
  const first = {
    _index: 'cat1',
    _type: 'A',
    _id: 'Z:Z1',
    _score: 1,
    _routing: '0',
    _parent: '0',
    _source: {
      content: 'קטגוריות',
    }
  };
  flatData = data;
  flatData.unshift(first);
  flatData = flatData.map((d) => ({
    id: d._id,
    parentId: d._parent,
    title: d._source.content,
    label: d._source.content,
    value: d._id,
    expanded: (d._parent === '0') ? true : false,
    index: d._index,
    type: d._type,
  }));

  const rootKey = '0';
  const treeData = getTreeFromFlatData({
    flatData,
    getKey,
    getParentKey,
    rootKey
  });
  return treeData;
}


// The initial state of the App
const initialState = {
  categories: [],
  selectedCategories: [],
};

function categoriesTreeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_CATEGORIES_SUCCESS:
      if (state.categories.length) return state;
      const categories = getTree(action.data);
      return Object.assign({}, state, {
        categories: categories,
      });
    case GET_ALL_PARENTS_SUCCESS:
      return Object.assign({}, state, {
        selectedCategories: _.uniq([...state.selectedCategories, ...action.data]),
        parentsLoaded: true,
      });
    case INIT_CATEGORIES:
      return Object.assign({}, state, {
        selectedCategories: action.data,
      });
    case DELETE_TAG:
      return Object.assign({}, state, {
        selectedCategories: [..._.pull(state.selectedCategories, action.tag)],
      });
    case DELETE_TAGS:
     return Object.assign({}, state, {
       selectedCategories: [... _.pullAll(state.selectedCategories, action.tag)],
      });
     default:
    return state;
  }
}

export default categoriesTreeReducer;
