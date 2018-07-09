import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton'
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Divider from 'material-ui/Divider';
import IconsStyle from '../../utils/iconsStyle';
import config from 'ReindexConfig';

import { loadSubCategories, updateSearchObj, reduceFilters, loadHierarchyFilterData } from 'components/AdminSearchBar/actions';

import './Filters.scss';

const hierarchyFilters = config.hierarchyFilters;

class Filters extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.reduceFilters = this.reduceFilters.bind(this);
    this.loadHierarchyFilterData = this.loadHierarchyFilterData.bind(this);
    this.hierarchyFilters = hierarchyFilters;
    this.state = {
      kashrutKey: hierarchyFilters.kashrut.content,
    };
  }

  componentWillMount() {
    this.props.loadHierarchyFilterData(hierarchyFilters.kashrut, 0, hierarchyFilters.kashrut.content, true);
  }

  loadHierarchyFilterData(searchText, filter) {
    this.props.loadHierarchyFilterData(searchText, this.props.search.filtersValue[filter].length, filter, false);
    this.props.onNewRequest();
  }

  reduceFilters(index, filter) {
    this.props.reduceFilters(index, filter);
    this.props.onNewRequest();
  }

  handleChange(searchText) {
    this.props.handleChange(searchText, this.props.search[this.props.search.activeTab].value.length - 1);
    this.props.onNewRequest();
  }
  render() {
    return (
      this.props.pageState === 'search' ?
        <div>
          {this.props.categories.length && this.props.search.activeTab === 'businesses' ?
            <div className="wrapper-categories">
              <div className="filters-header">
                {this.props.search[this.props.search.activeTab].value.map((cat, key) =>
                  <span key={key}><span className="category-filter-header" onClick={() => this.reduceFilters(key)}>{cat}</span>
                    <span>
                      <IconButton
                        iconStyle={IconsStyle.smallIcon}
                        style={IconsStyle.small}
                      ><BackIcon />
                      </IconButton>
                    </span>
                  </span>
                 )}
              </div>
              <div className="filters-list">
                {this.props.categories[this.props.search[this.props.search.activeTab].value.length - 1] && this.props.categories[this.props.search[this.props.search.activeTab].value.length - 1].map((sub, key) =>
                  <div key={key} onClick={() => this.handleChange(sub)}>{sub._source.content}</div>
              )}
              </div>
              <Divider />

            </div>
      : <div></div> }
          {this.props.filters.cities ?
            <div className="wrapper-auto-complete">
              <div className="filters-header">ישראל</div>
              <AutoComplete
                fullWidth
                hintText="חפש לפי אזור/ישוב"
                dataSource={this.props.filters.cities}
                filter={AutoComplete.fuzzyFilter}
                onUpdateInput={(searchText) => this.props.updateSearchObj(searchText, this.props.search.activeTab, 'cities')}
                onNewRequest={this.props.onNewRequest}
                maxSearchResults={10}
                menuStyle={{ maxHeight: '300px' }}
                openOnFocus
              /> </div> : '' }

          {this.props.filters.kashrut && this.props.hierarchyFiltersCategories && this.props.hierarchyFiltersCategories[this.state.kashrutKey].length ? 
            <div className="wrapper-categories">
              <br />
              <div className="filters-header">
              <div onClick={() => this.reduceFilters(0, this.state.kashrutKey)}>{this.state.kashrutKey}</div>
                <br />
                {this.props.search.filtersValue[this.state.kashrutKey].map((cat, key) =>
                  <span key={key}><span className="category-filter-header" onClick={() => this.reduceFilters(key + 1, this.state.kashrutKey)}>{cat}</span>
                    <span>
                      <IconButton
                        iconStyle={IconsStyle.smallIcon}
                        style={IconsStyle.small}
                      ><BackIcon />
                      </IconButton>
                    </span>
                  </span>
                 )}
              </div>
              <div className="filters-list">
                {this.props.hierarchyFiltersCategories[this.state.kashrutKey][this.props.search.filtersValue[this.state.kashrutKey].length] && this.props.hierarchyFiltersCategories[this.state.kashrutKey][this.props.search.filtersValue[this.state.kashrutKey].length].map((sub, key) =>
                  <div key={key} onClick={() => this.loadHierarchyFilterData(sub, this.state.kashrutKey)}>{sub._source.content}</div>
              )}
              </div>
              <Divider />
            </div>
          : '' }

        </div> : <div></div>
    );
  }
}

Filters.propTypes = {
  categories: React.PropTypes.array,
  onNewRequest: React.PropTypes.func,
  search: React.PropTypes.object,
  handleChange: React.PropTypes.func,
  pageState: React.PropTypes.string,
  filters: React.PropTypes.object,
  updateSearchObj: React.PropTypes.func,
  reduceFilters: React.PropTypes.func,
  hierarchyFiltersCategories: React.PropTypes.object,
  loadHierarchyFilterData: React.PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    categories: state.adminSearchBar.subCategories,
    search: state.adminSearchBar.search,
    filters: state.adminSearchBar.filters,
    hierarchyFiltersCategories: state.adminSearchBar.hierarchySubCategories,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    handleChange: (searchText, index) => {
      dispatch(loadSubCategories({ searchText, tabType: 'businesses', updateValue: true, index }));
    },
    updateSearchObj: (searchText, tabType, filterType) => {
      dispatch(updateSearchObj({ searchText, tabType, filterType }));
    },
    reduceFilters: (index, filter) => {
      dispatch(reduceFilters({ tabType: 'businesses', updateValue: true, index, filter }));
    },
    loadHierarchyFilterData: (categoryObj, index, filter, first) => {
      categoryObj.filter = filter;
      dispatch(loadHierarchyFilterData({ searchText: categoryObj, tabType: 'businesses', updateValue: true, index, filter, first }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
