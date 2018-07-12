/*
 * ChildrenData
 *
 * List all the features
 */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
//import AdminSearchBar from 'components/AdminSearchBar';
//import AdminFilters from 'components/AdminFilters';
import logo from 'assets/img/logo.png';
//import ResultsTable from 'components/ResultsTable';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import CategoriesTree from 'components/CategoriesTree';
import Snackbar from 'material-ui/Snackbar';
import { loadResults, setSelectedRows, loadCategoriesTree, changeTreeDate, relateToCategory, closeConnect2CategoryAlert, loadScoreData, updateRecord } from './actions';

import './AdminSearch.scss';
export class AdminSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      isSort: false,
      changedOrder: false,
      selected: [],
      unSelected: [],
      isPaging: false,
      actionType: '',
    };
    this.handleModalClose = this.handleModalClose.bind(this);
    this.openModal = this.openModal.bind(this);
    this.relateToCategory = this.relateToCategory.bind(this);
    this.updateSelectedCategories = this.updateSelectedCategories.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.showLast = this.showLast.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.categories = [];
    this.savedSelectedRows = [];
    this.props.loadScoreData();
  }

  componentWillReceiveProps(nextProps) {
    const rows = nextProps.selectedRows;
    if (rows && ['none', 'all'].indexOf(rows) > -1) this.handleCellClick(rows);
  }

  handleCheckClick = (id) => {
    const { selected, unSelected } = this.state;
    if (this.state.selected === 'ALL') {
      const unSelectedIndex = unSelected.indexOf(id);
      let unNewSelected = [];
      if (unSelectedIndex === -1) {
        unNewSelected = unNewSelected.concat(unSelected, id);
      }
      else if (unSelectedIndex === 0) {
        unNewSelected = unNewSelected.concat(unSelected.slice(1));
      }
      else if (unSelectedIndex === unSelected.length - 1) {
        unNewSelected = unNewSelected.concat(unSelected.slice(0, -1));
      } else if (selectedIndex > 0) {
        unNewSelected = unNewSelected.concat(
          unNewSelected.slice(0, unSelectedIndex),
          unNewSelected.slice(unSelectedIndex + 1),
        );
      }
      this.setState({ unSelected: unNewSelected });
    }
    else {
      const selectedIndex = selected.indexOf(id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1),
        );
      }
      this.setState({ selected: newSelected });
    }
  }

  handleModalClose(action) {
    const actionType = this.state.actionType;
    this.setState({ modalOpen: false, actionType: '' });
    if (action !== 'submit') {
      this.savedSelectedRows = [];
      return;
    }
    this.relateToCategory(actionType);
  }

  openModal(actionType) {
    this.props.loadCategoriesTree();
    this.setState({ modalOpen: true, actionType });
  }
  showLast(actionType) {
    this.props.showEndList(this.categories, 'all', [], this.props.totalResults, actionType);
  }
  relateToCategory(actionType) {
    let i;
    let exceptIds = [];
    let rows;
    if (this.state.selected === 'ALL') {
      rows = 'all';
      if (this.state.unSelected.length) {
        exceptIds = this.state.unSelected;
      }
    }
    else {
      rows = [];
      rows = this.state.selected;
    }
    this.setState({ selected: [], unSelected: [] });
    if (this.categories.length === 0) return alert('You have not selected a category');
    this.props.relateToCategory(this.categories, rows, exceptIds, this.props.totalResults, actionType);
  }

  updateSelectedCategories(categories) {
    this.categories = categories;
  }

  handleCellClick(cell) {
    if (cell === 'none') this.savedSelectedRows = [];
    else if (cell === 'all') this.savedSelectedRows = ['all'];
    else {
      const i = this.savedSelectedRows.indexOf(cell);
      const iAll = this.savedSelectedRows.indexOf('all');
      if (i > -1) this.savedSelectedRows.splice(i, 1);
      else this.savedSelectedRows.push(cell);

      if (iAll > -1) this.savedSelectedRows.splice(iAll, 1);
    }
  }
  handleNewRequest = () => {
    this.setState({
      isSort: false,
      changedOrder: false,
      unSelected: [],
      selected: []
    });
    this.props.handleNewRequest();
  }

  handleSearchBtn = () => {
    this.setState({
      isSort: false,
      changedOrder: false,
    });
    this.props.handleSearchBtn();
  }

  handleRowSelection = (a, b) => {
    this.setState({
      selected: a,
      unSelected: b,
    });
  }

  handlePageClick = (page, isSort, order) => {
    this.props.handleResultsPageClick(page, isSort, order);
  }

  handleSortClick = (page, isSort, order) => {
    this.setState({ isSort: true, changedOrder: true });
    this.props.handleResultsSortClick(1, isSort, order);
  }

  handleSelectAllClick = (checked) => {
    if (checked) {
      this.setState({ selected: 'ALL', unSelected: [] });
    }
    else this.setState({ selected: [] });
  }
  updateRecord(data) {
    this.props.updateRecord(data);
  }


  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={() => this.handleModalClose('cancel')}
      />,
      <FlatButton
        label="Submit"
        primary
        keyboardFocused
        onTouchTap={() => this.handleModalClose('submit')}
      />,
    ];

    const resultsActions =
      <div className="wrapper-selected-results-actions">
        <div onClick={() => this.openModal('add category')}><RaisedButton label="קשר לקטגוריה" style={{ width: '200px' }} /></div>
        <div onClick={() => this.openModal('remove category')}><RaisedButton label="הסר קטגוריה" style={{ width: '200px' }} /></div>
        <div onClick={() => this.showLast('score')}><RaisedButton label="הצג בסוף הרשימה" style={{ width: '200px' }} /></div>

      </div>;

    return (
      <div className="admin-search full-height-container">
        <Helmet
          title="Admin Search Page"
          meta={[
            { name: 'description', content: 'Admin search page of Reindex' },
          ]}
        />
        <div className="wrapper-autocomplete">
          {/* <AdminSearchBar
            onNewRequest={this.handleNewRequest}
            handleSearchBtn={this.handleSearchBtn}
            data={this.props.searchBarData}
          /> */}
        </div>
        <div className="wrapper-filters">
          {/* <AdminFilters onNewRequest
            ={this.props.handleNewRequest} pageState="search" />*/}
        </div>
        {this.state.selected.length > 0 ? resultsActions : ''}
        {this.props.results.length > 0 ? <div className="wrapper-results">
          {/* <ResultsTable
            data={this.props.results}
            total={this.props.totalResults}
            limit={this.props.limitResults}
            handleSortClick={this.handleSortClick}
            handlePageClick={this.handlePageClick}
            handleRowSelection={this.handleRowSelection}
            handleCellClick={this.handleCellClick}
            isSort={this.state.isSort}
            unSelected={this.state.unSelected}
            selected={this.state.selected}
            changedOrder={this.state.changedOrder}
            isPaging={this.state.isPaging}
            handleCheckClick={this.handleCheckClick}
            handleSelectAllClick={this.handleSelectAllClick}
            handleUpdateRecord={this.updateRecord}

          /> */}
        </div> : ''}
        <Dialog
          title="קשר\הסר קטגוריה"
          modal
          open={this.state.modalOpen}
          onRequestClose={this.handleModalClose}
          actions={actions}
          autoDetectWindowHeight
          autoScrollBodyContent
          className="connect-2-category-dialog"
        >
          <CategoriesTree onUpdate={this.updateSelectedCategories} />
        </Dialog>
        <Snackbar
          open={this.props.connect2CategoryAlert.open}
          message={this.props.connect2CategoryAlert.text}
          autoHideDuration={4000}
          onRequestClose={this.props.closeConnect2Category}
        />
      </div>
    );
  }
}


AdminSearch.propTypes = {
  results: PropTypes.array,
  setSelectedRows: PropTypes.func,
  loadCategoriesTree: PropTypes.func,
  relateToCategory: PropTypes.func,
  handleNewRequest: PropTypes.func,
  handleSearchBtn: PropTypes.func,
  handleSortClick: PropTypes.func,
  totalResults: PropTypes.number,
  limitResults: PropTypes.number,
  handleResultsPageClick: PropTypes.func,
  searchBarData: PropTypes.object,
  connect2CategoryAlert: PropTypes.object,
  closeConnect2Category: PropTypes.func,
  loadScoreData: PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    results: state.adminSearch.results,
    selectedRows: state.adminSearch.selectedRows,
    categoriesTree: state.adminSearch.categoriesTree,
    totalResults: state.adminSearch.totalResults,
    limitResults: state.adminSearch.limitResults,
    searchBarData: state.adminSearch.searchBarData,
    connect2CategoryAlert: state.adminSearch.connect2CategoryAlert,
    closeConnect2Category: state.adminSearch.closeConnect2Category,

  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadScoreData: () => {
      dispatch(loadScoreData());
    },
    setSelectedRows: (rows) => {
      dispatch(setSelectedRows(rows));
    },
    updateRecord: (data) => {
      dispatch(updateRecord(data));
    },
    loadCategoriesTree: () => {
      dispatch(loadCategoriesTree());
    },
    changeTreeData: (data) => {
      dispatch(changeTreeDate(data));
    },
    relateToCategory: (categories, rows, exceptIds, total, actionType) => {
      const number = (rows.indexOf('all') === -1) ? rows.length : total;
      const exceptIdsNumber = exceptIds.length ? exceptIds.length : null;
      let relate;
      if (rows.indexOf('all') > -1 && exceptIdsNumber) {
        relate = confirm(`  האם אתה בטוח שאתה רוצה ${actionType === 'add category' ? 'לקשר ל' : 'להסיר מ'} הכל חוץ מ- ${exceptIdsNumber} תוצאות קטגוריות ${categories.toString()} ?`);
      }
      else relate = confirm(`האם אתה בטוח שאתה רוצה ${actionType === 'add category' ? 'לקשר ל' : 'להסיר מ'} ${number} תוצאות קטגוריות ${categories.toString()} ?`);
      if (relate) dispatch(relateToCategory({ categories, rows, exceptIds, actionType }));
    },
    showEndList: (categories, rows, exceptIds, total, actionType) => {
      const number = (rows.indexOf('all') === -1) ? rows.length : total;
      let relate;
      relate = confirm(`האם אתה בטוח שאתה רוצה להציג בסוף הרשימה ${number} תוצאות קטגוריות ${categories.toString()} ?`);
      if (relate) dispatch(relateToCategory({ categories, rows, exceptIds, actionType }));
    },
    handleNewRequest: () => {
      dispatch(loadResults({ page: 1 }));
    },
    handleSearchBtn: () => {
      dispatch(loadResults({ page: 1 }));
    },
    handleResultsPageClick: (data, isSort, order) => {
      dispatch(loadResults({ sortBy: 'name', page: data.selected + 1, isSort: isSort, order: order }));
    },
    handleResultsSortClick: (page, isSort, order) => {
      dispatch(loadResults({ sortBy: 'name', page: page, isSort: isSort, order: order }));
    },
    closeConnect2Category: () => {
      dispatch(closeConnect2CategoryAlert());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminSearch);





