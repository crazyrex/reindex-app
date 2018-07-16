import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchIcon from '@material-ui/icons/Search';
import AutoComplete from 'material-ui/AutoComplete';
import { updateSearchLocation } from 'utils/functions';
import config from 'ReindexConfig';
import arrow from 'assets/img/icon-arrow-down.svg';
import './SearchBar.scss';
import { loadFilterData, loadSubCategories, setActiveTab, loadCategoriesFilterData, updateSearchObj, emptySubCategories, loadHierarchyFilterData } from './actions';
import search from '@material-ui/icons/Search';
const hierarchyFilters = config.hierarchyFilters;

let translate;
if (config.lang == "he")
  translate = require('globalTranslateHE.json');
else
  translate = require('globalTranslate.json');
let listcategories;

class SearchBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleCategoriesRequest = this.handleCategoriesRequest.bind(this);
    this.toggleSelect = this.toggleSelect.bind(this);
    this.closeSelect = this.closeSelect.bind(this);
    this.props.loadCategoriesFilterData('reindex-cities');
    this.props.loadCategoriesFilterData('reindex-categories');
    this.state = {
      selectActive: false,
      TABS_STATE: false
    };
  }
  updateSearchLocation(key, value, tab) {
    updateSearchLocation(key, value, tab);
  }
  toggleSelect() {
    this.setState({ selectActive: !this.state.selectActive });
  }
  closeSelect() {
    this.setState({ selectActive: false });
  }
  componentDidMount() {
    this.setState({ TABS_STATE: (window.location.search.indexOf('test') > -1 || window.location.search.indexOf('terms') > -1) ? true : false })  // eslint-disable-line
  }
  handleCategoriesRequest(searchText, index, tabType) {
    if (index !== -1) this.props.loadSubCategories(searchText, tabType, false);
    if (index === -1) this.props.loadSubCategoriesForText(searchText);
    // this.props.loadHierarchyFilterData(hierarchyFilters.kashrut, 0, hierarchyFilters.kashrut.content, true);
    const key = (index !== -1) ? 'categories' : 'q';
    this.updateSearchLocation(key, searchText, 'businesses', index);
    // this.props.onNewRequest();
  }
  handleSearchBtn = () => {
    const tab = this.props.search.activeTab;
    const key = (tab === 'people') ? 's' : 'q';
    const searchText = this.props.search[tab].value[0];
    if (!searchText) return;
    this.updateSearchLocation(key, searchText, tab);
  }
  render() {
    listcategories = this.props.categories.map((cat) =>
    <span key={cat._id} onClick={()=>this.props.handleInput(cat._source.content, 'businesses', 'categories')}>
      {cat._source.content}
    </span>
    )
    return (
      <div>
        <div className="search-bar">
          <div>
            <div className="full-width">
              <div className="autoComplete">
                <AutoComplete
                  hintText={translate.search}
                  dataSource={this.props.categories}
                  fullWidth={true}
                  onUpdateInput={(searchText) => { this.props.handleInput(searchText, 'businesses', 'categories'); }}
                  onNewRequest={(chosenRequest, index) => { this.closeSelect(); this.props.emptySubCategories(index); this.handleCategoriesRequest(chosenRequest, index, 'businesses'); this.props.loadHierarchyFilterData(hierarchyFilters.kashrut, 0, hierarchyFilters.kashrut.content, true); }}
                />
              </div>
            </div>
            <div className="search-icon-wrapper" onClick={() => { this.closeSelect(); this.handleSearchBtn(); }}>
              <a>
                <i><SearchIcon /></i>
              </a>
            </div>
          </div>
          
        </div>
        {/* <div className="slider-categories">
     {listcategories}
       </div> */}
      </div >
    );
  }
}
SearchBar.propTypes = {
  categories: PropTypes.array,
  onNewRequest: PropTypes.func,
  search: PropTypes.object,
  handleSearchBtn: PropTypes.func,
  loadSubCategories: PropTypes.func,
  loadSubCategoriesForText: PropTypes.func,
  handleInput: PropTypes.func,
  setActiveTab: PropTypes.func,
  updateSearchObj: PropTypes.func,
  emptySubCategories: PropTypes.func,
  loadCategoriesFilterData: PropTypes.func,
  loadHierarchyFilterData: PropTypes.func,
};
export function mapStateToProps(state) {
  return {
    categories: state.search.categories,
    search: state.search.search,
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
    loadSubCategoriesForText: (value) => {
      dispatch(loadSubCategories({ value, children: true }));
    },
    setActiveTab: (activeTab) => {
      window.optimizely = window.optimizely || [];
      window.optimizely.push({
        type: 'event',
        eventName: 'changeType'
      });
      if (activeTab === 'people') dispatch(emptySubCategories());
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
    },
    loadHierarchyFilterData: (categoryObj, index, filter, first) => {
      categoryObj.filter = filter;
      dispatch(loadHierarchyFilterData({ searchText: categoryObj, tabType: 'businesses', updateValue: true, index, filter, first }));
    },
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);