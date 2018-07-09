import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import BackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import Divider from 'material-ui/Divider';
import IconsStyle from 'utils/iconsStyle';
import config from 'ReindexConfig';
import { updateSearchLocation } from 'utils/functions';
import { loadSubCategories, updateSearchObj, reduceFilters, loadHierarchyFilterData } from 'components/SearchBar/actions';

const styles = require('./Filters.scss');

const hierarchyFilters = config.hierarchyFilters;

class Filters extends React.PureComponent {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.reduceFilters = this.reduceFilters.bind(this);
    this.loadHierarchyFilterData = this.loadHierarchyFilterData.bind(this);
    this.updateSearch = this.updateSearch.bind(this);
    this.hierarchyFilters = hierarchyFilters;
    this.state = {
      kashrutKey: hierarchyFilters.kashrut.content,
      searchText: ''
    };
  }

  componentWillMount() {
    this.props.loadHierarchyFilterData(hierarchyFilters.kashrut, 0, hierarchyFilters.kashrut.content, true);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location && nextProps.location.query && nextProps.location.query.location)
      this.setState({ searchText: nextProps.location.query.location });
    else this.setState({ searchText: '' });
  }


  loadHierarchyFilterData(searchText, filter, filterKey) {
    this.props.loadHierarchyFilterData(searchText, this.props.search.filtersValue[filter].length, filter, false);
    updateSearchLocation(filterKey, `${searchText._type}-T-${searchText._id}`);
    // this.props.onNewRequest();
  }

  reduceFilters(index, cat, filter) {
    this.props.reduceFilters(index, filter);
    if (!filter) updateSearchLocation('categories', cat, 'businesses');
    // make it generic !!!
    else updateSearchLocation('kashrut', `${cat._type}-T-${cat._id}`);
    // this.props.onNewRequest();
  }

  handleChange(searchText) {
    let lat =null ,lon =null;
    if (this.props.location && this.props.location.query && this.props.location.query.lat && this.props.location.query.lon) {
      lat = this.props.location.query.lat;
      lon = this.props.location.query.lon;
    }
    this.setState({ searchText: searchText });
    this.props.handleChange(searchText, this.props.search[this.props.search.activeTab].value.length - 1);
    updateSearchLocation('categories', searchText, 'businesses');
    if (lat && lon) {
      updateSearchLocation('lat', this.props.location.query.lat);
      updateSearchLocation('lon', this.props.location.query.lon);
    }
    // this.props.onNewRequest();
  }

  updateSearch(searchText) {
    this.setState({
      searchText,
    }, function () {
      // this.props.updateSearchObj(searchText, this.props.search.activeTab, 'cities')
    });
  }

  onNewRequest(loc, chosenRequest) {
     if (typeof chosenRequest !== 'object')
      return;
    this.setState({ searchText: chosenRequest.text }, function () {
      this.props.onNewRequest('location', chosenRequest, null, true)
    });
  }


  render() {
    return (
      <div>
        {this.props.categories.length && this.props.search.activeTab === 'businesses' ?
          <div className={styles["wrapper-categories"]}>
            <div className={styles["filters-header"]}>
              {this.props.search[this.props.search.activeTab].value.map((cat, key) =>
                <span key={key}><span className={styles["category-filter-header"]} onClick={() => this.reduceFilters(key, cat)}>{cat}</span>
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
            <div className={styles["filters-list"]}>
              {this.props.categories[this.props.search[this.props.search.activeTab].value.length - 1] && this.props.categories[this.props.search[this.props.search.activeTab].value.length - 1].map((sub, key) =>
                <div key={key} onClick={() => this.handleChange(sub)}>{sub._source.content}</div>
              )}
            </div>
            <Divider />

          </div>
          : <div></div>}
        {this.props.filters.cities ?
          <div className={styles["wrapper-auto-complete"]}>
            <div className={styles["filters-header"]}>ישראל</div>
            <AutoComplete
              fullWidth
              searchText={this.state.searchText}
              hintText="חפש לפי אזור/ישוב"
              dataSource={this.props.filters.cities}
              onUpdateInput={(searchText) => this.updateSearch(searchText, this.props.search.activeTab, 'cities')}
              onNewRequest={(chosenRequest) => this.onNewRequest('location', chosenRequest)}
              maxSearchResults={10}
              menuStyle={{ maxHeight: '300px' }}
              openOnFocus
            /> </div> : ''}

        {this.props.filters.kashrut && this.props.hierarchyFiltersCategories[this.state.kashrutKey] && this.props.search.activeTab === 'businesses' ?
          <div className={styles["wrapper-categories"]}>
            <br />
            <div className={styles["filters-header"]}>
              <div onClick={() => this.reduceFilters(0, this.hierarchyFilters.kashrut, this.state.kashrutKey)}>{this.state.kashrutKey}</div>
              <br />
              {this.props.search.filtersValue[this.state.kashrutKey].map((cat, key) =>
                <span key={key}><span className={styles["category-filter-header"]} onClick={() => this.reduceFilters(key + 1, cat, this.state.kashrutKey)}>{cat._source.content}</span>
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
            <div className={styles["filters-list"]}>
              {this.props.hierarchyFiltersCategories[this.state.kashrutKey][this.props.search.filtersValue[this.state.kashrutKey].length] && this.props.hierarchyFiltersCategories[this.state.kashrutKey][this.props.search.filtersValue[this.state.kashrutKey].length].map((sub, key) =>
                <div key={key} onClick={() => this.loadHierarchyFilterData(sub, this.state.kashrutKey, 'kashrut')}>{sub._source.content}</div>
              )}
            </div>
            <Divider />
          </div>
          : ''}
      </div>
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
    categories: state.search.subCategories,
    search: state.search.search,
    filters: state.search.filters,
    hierarchyFiltersCategories: state.search.hierarchySubCategories,
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
