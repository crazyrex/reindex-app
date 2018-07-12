import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { change } from 'redux-form';
import DelIcon from 'material-ui/svg-icons/action/delete';
import AddIcon from 'material-ui/svg-icons/content/add';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import './CategoriesTree.scss';

import { loadCategories, getAllParents, deleteTag, deleteTags, initCategories, updateTree } from './actions';


class CategoriesTree extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      searchFocusIndex: 0,
      openDialog: false,
    };

    this.flagInit = false;

    this.check = this.check.bind(this);
    this.handleRequestDelete = this.handleRequestDelete.bind(this);
    this.initCategories = this.initCategories.bind(this);
    this.updateTreeData = this.updateTreeData.bind(this);
    this.add = this.add.bind(this);
    this.openAddCategoryDialog = this.openAddCategoryDialog.bind(this);
    this.del = this.del.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleMoveNode = this.handleMoveNode.bind(this);
    this.isAdmin = this.props.src === 'admin';
    this.initCategories([]);
  }
  arrTmpCategories = [];
  findAllChildrenRecurse(node) {
    if (this.props.selectedCategories.indexOf(node.title) > -1) {
      this.arrTmpCategories.push(node.title)
    }
    if(node.children)
      node.children.forEach(function(n) {
      this.findAllChildrenRecurse(n)
      }, this);
   } 

  check(rowInfo, TreeFuncs) {
    let node = rowInfo.node;
    if (this.props.selectedCategories.indexOf(node.title) > -1){
      this.findAllChildrenRecurse(node);
      this.props.deleteTags(this.arrTmpCategories);
      this.props.onUpdate(this.props.selectedCategories);
    }
    else {
      node.expanded = true;
      const treeData = TreeFuncs.changeNodeAtPath({
      treeData: this.state.treeData || this.props.categories,
      path: rowInfo.path,
      newNode: node,
      getNodeKey: (rowInfo) => {
        const treeIndex = (rowInfo.node, rowInfo.treeIndex);
        return treeIndex;
       },
      });
      this.updateTreeData(treeData);
      this.props.getAllParents(rowInfo.node);
    }
  }

  openAddCategoryDialog(rowInfo, TreeFuncs) {
    this.setState({
      openDialog: true,
      addCategoryRowInfo: rowInfo,
      TreeFuncs: TreeFuncs,
    });
  }

  add() {
    const TreeFuncs = this.state.TreeFuncs;
    const newCategory = this.state.newCategory;
    if (!newCategory) return;

    const rowInfo = this.state.addCategoryRowInfo,
      parentId = (rowInfo.parentNode) ? rowInfo.parentNode.id : null,
      newNode = {
        id: newCategory,
        parentId: parentId,
        title: newCategory,
        label: newCategory,
        value: newCategory,
      },
      result = TreeFuncs.addNodeUnderParent({
        treeData: this.state.treeData || this.props.categories,
        newNode,
        parentKey: this.state.addCategoryRowInfo.treeIndex,
        getNodeKey: (rowInfo) => {
          const treeIndex = (rowInfo.node, rowInfo.treeIndex);
          return treeIndex;
        },
        expandParent: true,
      });
      this.updateTreeData(result.treeData);
      this.props.updateTree({
        action: 'add',
        node: newNode,
        newParent: rowInfo.node,
      });
  }

  del(rowInfo, TreeFuncs) {
    if (rowInfo.node.children) return alert('You can not remove category with children');
    const treeData = TreeFuncs.removeNodeAtPath({
      treeData: this.state.treeData || this.props.categories,
      path: rowInfo.path,
      getNodeKey: (rowInfo) => {
        const treeIndex = (rowInfo.node, rowInfo.treeIndex);
        return treeIndex;
      },
    });
    this.updateTreeData(treeData);
    this.props.updateTree({
      action: 'delete',
      node: rowInfo.node,
    });
  }

  handleRequestDelete(tag) {
    this.props.deleteTag(tag);
    this.props.onUpdate(this.props.selectedCategories);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.parentsLoaded) {
      this.props.onUpdate(nextProps.selectedCategories);
    }
    return true;
  }

  initCategories(categories) {
    this.props.initCategories(categories);
  }

  updateTreeData(treeData) {
    this.setState({ treeData });
  }

  handleDialogClose(action) {
    this.setState({
      openDialog: false,
    });
    if (action === 'submit') this.add();
  }

  handleMoveNode(rowInfo, TreeFuncs) {
    const parentPath = rowInfo.path;
    parentPath.pop();
    const parentNode = TreeFuncs.getNodeAtPath({
      treeData: this.state.treeData || this.props.categories,
      path: parentPath,
      getNodeKey: (rowInfo) => {
        const treeIndex = (rowInfo.node, rowInfo.treeIndex);
        return treeIndex;
      },
    });
    this.props.updateTree({
      action: 'changeLocation',
      node: rowInfo.node,
      parent: parentNode,
      newParent: parentNode.node,
    });
  }

   componentDidMount() {
     this.props.loadCategories();
     this.props.initCategories([]);
   }

  componentWillReceiveProps(props) {
    if (props.initialValues &&  props.initialValues.length && !this.flagInit) {
      this.initCategories(props.initialValues);
      this.flagInit = true;
    }
  }

  render() {
      let categoriestree;

      if (typeof window === undefined || typeof window === 'undefined') {
        categoriestree = (<div></div>);
      } else {
        const TreeFuncs = require('./TreeFuncsVars');
        const SortableTree = TreeFuncs.default;
        categoriestree = (<SortableTree 
                canDrag={this.isAdmin}
                rowHeight={30}
                scaffoldBlockPxWidth={25}
                treeData={this.state.treeData || this.props.categories}
                onChange={this.updateTreeData}
                searchQuery={this.state.searchString}
                searchFocusOffset={this.state.searchFocusIndex}
                searchFinishCallback={(matches) =>
                    this.setState({
                      searchFocusIndex: matches.length > 0 ? this.state.searchFocusIndex % matches.length : 0,
                    })
                }
                generateNodeProps={(rowInfo) => {return {
                  buttons: [
                    <div className={!this.isAdmin ? 'check' : ''}></div>,
                    <div className={!this.isAdmin ? 'wrapper-check' : ''} onClick={() => this.check(rowInfo, TreeFuncs)}></div>,
                    <div className="add" onClick={() => this.openAddCategoryDialog(rowInfo, TreeFuncs)}><AddIcon/></div>,
                    <div className="del" onClick={() => this.del(rowInfo, TreeFuncs)}>{!rowInfo.node.children ? <DelIcon/> : ''}</div>,
                  ],
                  className: this.props.selectedCategories.indexOf(rowInfo.node.title) > -1 ? 'selected-node': '',
                }}}
                onMoveNode = {(rowInfo) => this.handleMoveNode(rowInfo, TreeFuncs)}
            />)
      }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={() => this.handleDialogClose('cancel')}
      />,
      <FlatButton
        label="OK"
        primary={true}
        keyboardFocused={true}
        onTouchTap={() => this.handleDialogClose('submit')}
      />,
    ];
    return (
        <div className="categories-tree-component">
          <br/>
          <div>
          {this.props.selectedCategories.length ? <span className="label">category</span> : ''}
            <div className="wrapper-tags">{this.props.selectedCategories.map((tag, index) =>
              tag !== '' ?  <div className="chip" key={index}> 
              <span className="text">{tag}</span>
              <span className="x" onClick={() => this.handleRequestDelete(tag)}><IconButton><CloseIcon/></IconButton></span>
          </div>: ''
          )}
          </div>
          </div>
          <div className="wrapper-search-and-tags">
            <TextField className="search-category" floatingLabelText="Search for a category" onChange={(event) => this.setState({ searchString: event.target.value })} />
            <div className="wrapper-tree">
              {categoriestree}
            </div>
          </div>
           <Dialog
            title="Add Category"
            actions={actions}
            modal={false}
            open={this.state.openDialog}
            onRequestClose={this.handleDialogClose}
          >
            <TextField floatingLabelText="Category content" onBlur={(event) => this.setState({ newCategory: event.target.value })} />
        </Dialog>
        </div>
    );
  }
}

CategoriesTree.propTypes = {
  categories: PropTypes.array,
  selectedCategories: PropTypes.array,
  onUpdate: PropTypes.func,
  parentsLoaded: PropTypes.bool,
  changeFieldValue: PropTypes.func,
  deleteTag: PropTypes.func,
  deleteTags: PropTypes.func,
  initCategories: PropTypes.func,
  initialValues: PropTypes.array,
  src: PropTypes.string,
  updateTree: PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    categories: state.categoriesTree.categories,
    selectedCategories: state.categoriesTree.selectedCategories,
    parentsLoaded: state.categoriesTree.parentsLoaded,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => {
      dispatch(loadCategories());
    },
    getAllParents: (node) => {
      dispatch(getAllParents(node));
    },
    changeFieldValue: (categories) => {
      dispatch(change('create', 'categories', categories))
    },
    deleteTag: (tag) => {
      dispatch(deleteTag(tag));
    },
    deleteTags: (tags) => {
      dispatch(deleteTags(tags));
    },
    initCategories: (categories) => {
      dispatch(initCategories(categories));
    },
    updateTree: (data) => {
      const confirmText = (data.action === 'changeLocation') ? `Are you sure you want to move
      ${data.node.label} below ${data.parent.node.label} ?`
        : (data.action === 'delete') ? `Are you sure you want to delete ${data.node.label} ?` : `Are you sure you want to add ${data.node.label} ?`
      const update = confirm(confirmText);
      if (update) dispatch(updateTree(data));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CategoriesTree);