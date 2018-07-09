import React from 'react';
import { connect } from 'react-redux';
import Autocomplete from 'components/Autocomplete';
import SearchIcon from 'material-ui/svg-icons/action/search';

import arrow from 'assets/img/icon-arrow-down.svg';

import './SearchBar.scss';

import { loadFilterData, loadSubCategories, setActiveTab, loadCategoriesFilterData, updateSearchObj, emptySubCategories } from './actions';


const translate = {
  businesses: 'עסקים',
  people: 'אנשים',
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleCategoriesRequest = this.handleCategoriesRequest.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
    this.props.loadCategoriesFilterData('cities');
    this.state = {
      selectActive: false,
    };
  }

  componentDidMount() {
    this.TABS_STATE = (window.location.search.indexOf('test') > -1) ? true : false; // eslint-disable-line
  }

  handleCategoriesRequest(searchText, index, tabType) {
    if (index !== -1) this.props.loadSubCategories(searchText, tabType, false);
    this.props.onNewRequest();
  }
  toggleSelect() {
    this.setState({ selectActive: !this.state.selectActive });
  }
  closeSelect() {
    this.setState({ selectActive: false });
  }

  render() {
    return (
      <div>
        <div className={`search-bar ${this.TABS_STATE ? 'tabs-state' : ''}`}>
          <div className={`select ${this.TABS_STATE ? 'active' : ''}`}>
            <div onClick={() => { this.props.setActiveTab('businesses'); }} className={`tab ${this.props.search.activeTab === 'businesses' ? 'active' : ''}`}>עסקים</div>
            <div onClick={() => { this.props.setActiveTab('people'); }} className={`tab ${this.props.search.activeTab === 'people' ? 'active' : ''}`}>אנשים</div>
          </div>
          <div className={`select ${!this.TABS_STATE ? 'active' : ''}`}>
            <div onClick={this.toggleSelect} className="selectBtn"><span>{translate[this.props.search.activeTab]}</span><div style={{ backgroundImage: `url(${arrow})` }}></div></div>
            <ul className={`selectList ${this.state.selectActive ? 'active' : ''}`}>
              <li onClick={() => { this.closeSelect(); this.props.setActiveTab('businesses'); }}><span>עסקים</span></li>
              <li onClick={() => { this.closeSelect(); this.props.setActiveTab('people'); }}><span>אנשים</span></li>
            </ul>
          </div>
          <div>
            <div className="full-width">
              {this.props.search.activeTab === 'businesses' ?
                <Autocomplete
                  text={this.props.search.businesses.value[0]}
                  hintText="Search..."
                  dataSource={this.props.categories}
                  handleUpdateInput={(searchText) => this.props.handleInput(searchText, 'businesses', 'categories')}
                  onNewRequest={(chosenRequest, index) => { this.closeSelect(); this.props.emptySubCategories(index); this.handleCategoriesRequest(chosenRequest, index, 'businesses')}}
                /> :
                <Autocomplete
                  text={this.props.search.people.value[0]}
                  hintText="Search ..."
                  dataSource={[]}
                  handleUpdateInput={(searchText) => this.props.updateSearchObj(searchText, 'people', 'categories')}
                  onNewRequest={() => { this.closeSelect(); this.props.onNewRequest(); }}
                />}
            </div>
            <div className="search-icon-wrapper" onClick={() => { this.closeSelect(); this.props.handleSearchBtn(); }}>
              <a>
                <i><SearchIcon /></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  categories: React.PropTypes.array,
  onNewRequest: React.PropTypes.func,
  search: React.PropTypes.object,
  handleSearchBtn: React.PropTypes.func,
  loadSubCategories: React.PropTypes.func,
  handleInput: React.PropTypes.func,
  setActiveTab: React.PropTypes.func,
  updateSearchObj: React.PropTypes.func,
  emptySubCategories: React.PropTypes.func,
  loadCategoriesFilterData: React.PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    categories: state.adminSearchBar.categories,
    search: state.adminSearchBar.search,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    handleInput: (searchText, tabType, filterType) => {
      dispatch(loadFilterData({ searchText, tabType, filterType }));
    },
    loadSubCategories: (searchText, tabType, updateValue) => {
      dispatch(loadSubCategories({ searchText, tabType, updateValue }));
    },
    setActiveTab: (activeTab) => {
      dispatch(setActiveTab(activeTab));
    },
    loadCategoriesFilterData: (category) => {
      dispatch(loadCategoriesFilterData(category));
    },
    updateSearchObj: (searchText, tabType, filterType) => {
      dispatch(updateSearchObj({ searchText, tabType, filterType }));
    },
    emptySubCategories: (index) => {
      if (index === -1) dispatch(emptySubCategories());
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
