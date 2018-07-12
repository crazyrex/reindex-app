import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Filters from 'components/Filters';
import HeaderSite from 'components/HeaderSite';
// import NoResults from 'components/NoResults';
import Results from 'components/Results';
import config from 'ReindexConfig';
import SearchBar from 'components/SearchBar';
import Snackbar from 'material-ui/Snackbar';
import DrawerFilter from 'components/DrawerFilter';
import { Tabs, Tab } from 'material-ui/Tabs';
import LocationChange from 'components/LocationChange';
import { detectmob, updateSearchLocation, str2spc, getLocationData } from 'utils/functions';
import { browserHistory } from 'react-router';
import { loadResults } from './sagas';
import { loadResults as loadResultsAction } from './actions';
import { loadSubcategories } from 'components/SearchBar/saga';
import { updateSearchObj } from 'components/SearchBar/actions';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import Drawer from 'material-ui/Drawer';
import translate from 'globalTranslate.json';
import { updateRecord, closeUpdateRecordModal } from './actions';
import MapBox from 'components/Mapbox';
export class ResultsPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detectmob: detectmob(),
      showSideBarNearMe: false,
      changeLocation: false,
      slider: 10,
      openLocation: false,
      index: 0,
      activeIndex: 0,
      tabStyle: {
        active_tab: {
          backgroundColor: "#F2F2F2",
          fontSize: "14px",
          fontFamily: "Roboto",
          color: "#0A4BF2"
        },
        default_tab: {
          backgroundColor: "#F2F2F2",
          fontSize: "14px",
          fontFamily: "Roboto",
          color: "#6E6E6E"
        }

      }
    };
    this.updateSearchLocation = updateSearchLocation;
    this.updateSearchObject = this.updateSearchObject.bind(this);
    this.showSideBarNearMe = this.showSideBarNearMe.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.transform = this.transform.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.openChangeLocation = this.openChangeLocation.bind(this);
    this.updateLocation = this.updateLocation.bind(this);
  }
  min = 0;
  max = Math.pow(10, 6);
  power = 12;

  handleSlider = (event, value) => {
    this.setState({ slider: this.transform(value) });
    // this.props.handleGetNearMe({ GPS: { 'lat': 34.8248983, 'lon': 32.092226 } });
  };
  transform(value) {
    return Math.round((Math.exp(this.power * value / this.max) - 1) / (Math.exp(this.power) - 1) * this.max);
  }

  reverse(value) {
    return (1 / this.power) * Math.log(((Math.exp(this.power) - 1) * value / this.max) + 1) * this.max;
  }

  componentWillMount() {
    if (this.props.location.search.includes("lat") && this.props.location.search.includes("lon")) {
      this.setState({
        showSideBarNearMe: true,
        changeLocation: true
      })
      this.lat = this.props.location.query.lat;
      this.lon = this.props.location.query.lon;
    }

    const locationData = getLocationData(this.props.location);
    const catName = (this.props.catName) ? str2spc(this.props.catName) : null;
    const city = (locationData.search.location) ? str2spc(locationData.search.location) : null;
    const q = (locationData.search.q) ? str2spc(locationData.search.q) : null;
    const s = (locationData.search.s) ? str2spc(locationData.search.s) : null;

    this.updateSearchObject(locationData);

  }
  //   componentDidMount() {

  //   var mapboxgl = require('mapbox-gl');
  //     mapboxgl.accessToken = 'pk.eyJ1IjoieWVodWRpdGciLCJhIjoiY2pkc3Eza2k1MHBneDMzcDcxbm9wY3h5cSJ9.QqvDmAmAvsRZdx3VUzb-eg';
  //     var map = new mapboxgl.Map({
  //       container: 'mapboxres',
  //       style: 'mapbox://styles/mapbox/streets-v10',
  //       zoom: 15,
  //  });
  // }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.location.query.lat) {
      this.lat = null;
      this.lat = null;
      this.setState({
        showSideBarNearMe: false,
        changeLocation: false
      })
    }
    if (nextProps.goToTnxPage) {
      this.props.closeUpdateRecordModal();
      if (window.location.pathname.indexOf('cat') > -1)
        browserHistory.push('/updatedBusiness');
      else browserHistory.push('/updatedPeople');
    }
  }

  getStyle(isActive) {
    console.log('getStyle isActive ', isActive);
    return isActive ? this.state.tabStyle.active_tab : this.state.tabStyle.default_tab;
  }
  openChangeLocation() {
    this.setState({
      openLocation: true
    })
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject('error get coords');
      navigator.geolocation.getCurrentPosition(function (pos, err) {
        resolve(pos.coords);
      }, function (error) {
        reject(error);
      });
    });
  }

  updateLocation(bool) {
    if (bool) {
      this.setState({
        showSideBarNearMe: false,
        changeLocation: false
      })
    }
  }

  showSideBarNearMe() {
    this.setState({
      showSideBarNearMe: true,
      changeLocation: true
    });
    window.dataLayer.push({
      'event': 'nearme',
      'search': this.props.search.textToSearch
    });
    this.getLocation().then((data) => {
      this.lat = data.latitude;
      this.lon = data.longitude;
      updateSearchLocation('lat', data.latitude);
      updateSearchLocation('lon', data.longitude);

      this.props.handleGetNearMe();
    }).catch((error) => {
      console.log('err', error)
      // alert('geo location error');
      // this.setState({
      //   showSideBarNearMe: false,
      //   changeLocation: false
      // });
    });
  }

  updateSearchObject(locationData) {
    const tabType = locationData.tab;
    if (typeof window === undefined || typeof window === 'undefined') return;
    if (this.props.results.length && this.props.search[tabType].value.length) return;

    let searchText = (locationData.tab === 'businesses') ?
      ((locationData.lastCategory) ? decodeURI(locationData.lastCategory.val) : decodeURI(locationData.search.q)) :
      decodeURI(locationData.search.s);
    searchText = str2spc(searchText);

    const filterType = 'categories';
    const activeTab = tabType;
    this.props.updateSearchObj({ searchText, tabType, filterType, activeTab });
  }

  render() {
    return (
      <div className="main-search full-height-container search">
        {/* <Helmet
          title={`${this.strTitle}`}
          meta={[
            { name: 'description', content: `${this.description}`, }
          ]}
        /> */}
        <HeaderSite />
        <div className="wrapper-autocomplete">
          <SearchBar
            onNewRequest={this.props.handleNewRequest}
            handleSearchBtn={this.props.handleSearchBtn}
            data={this.props.searchBarData}
          />
        </div>
        <div className="wrapper-tabs">
          <Tabs inkBarStyle={{background: '#0A4BF2'}}>
            <Tab label="List View" onActive={(tab) => { this.setState({ index: tab.props.index }) }} style={this.getStyle(this.state.index === 0)}>
              {this.state.detectmob && this.props.results.length > 0 ?
                <DrawerFilter onNewRequest={this.updateSearchLocation} pageState={this.props.state} location={this.props.location} /> : ''}
              {this.props.results.length > 0 ? <div className={`wrapper-results ${this.state.showSideBarNearMe ? 'geo' : ''}`}>
                <div className="results-count"> {this.props.totalResults} {translate.resultsFound} </div>
                {(this.state.detectmob && !this.state.changeLocation && this.props.location.pathname.indexOf(config.searchTabs.businesses.route) > -1) && this.state.index == 0 ?
                  <div onClick={this.showSideBarNearMe} className='wrapper-nearme' >
                    <FlatButton label={translate.businessesNearby} labelStyle={{ paddingRight: 11, paddingLeft: 11, fontSize: 18, textTransform: 'lowercase' }} />
                  </div> : ''}
                {this.state.detectmob && this.state.changeLocation ?
                  <div onClick={this.openChangeLocation} className='change-loc' >
                    <LocationChange open={true} handleClose={this.updateLocation} />
                  </div> : ''}
                <Results
                  data={this.props.results}
                  total={this.props.totalResults}
                  limit={this.props.limitResults}
                  offset={this.props.offsetResults}
                  updateRecord={this.props.updateRecord}
                  handlePageClick={this.props.handleResultsPageClick}
                  lat={this.lat}
                  lon={this.lon}
                />
              </div> : ''}
            </Tab>
            <Tab label="Map View" onActive={(tab) => { this.setState({ index: tab.props.index }); }} style={this.getStyle(this.state.index === 1)}>
              {this.props.results.length && <MapBox data={this.props.results} />}
            </Tab>
          </Tabs>
        </div>


        {/* {this.state.detectmob && this.state.showSideBarNearMe ?
          <div className="wrapper-slider">
            <span>{translate.closer}</span>
            <Slider
              min={this.min}
              max={this.max}
              step={this.max / 100}
              value={this.reverse(this.state.slider)}
              onChange={this.handleSlider}
            />
            <span>{translate.further}</span>
          </div> : ''} */}
        {/* {!this.state.detectmob ?
          <div className={`wrapper-filters`}>
            <Filters onNewRequest={this.updateSearchLocation} pageState={this.props.state} location={this.props.location} />
          </div> : ''} */}
        {/* {!this.props.loading ? 
           <NoResults data={{ query: this.props.query }} />
           : <span>Loading...</span>} */}
        {/*<Snackbar
            open={this.props.updateRecordAlert.open}
            message={this.props.updateRecordAlert.text}
            autoHideDuration={4000}
            onRequestClose={this.props.closeUpdateRecordModal}
        />*/}
      </div >
    );
  }
}


ResultsPage.propTypes = {
  results: React.PropTypes.array,
  updateRecord: React.PropTypes.func,
  handleNewRequest: React.PropTypes.func,
  handleSearchBtn: React.PropTypes.func,
  updateRecordAlert: React.PropTypes.object,
  closeUpdateRecordModal: React.PropTypes.func,
  totalResults: React.PropTypes.number,
  limitResults: React.PropTypes.number,
  handleResultsPageClick: React.PropTypes.func,
  searchBarData: React.PropTypes.object,
  offsetResults: React.PropTypes.number,
  loading: React.PropTypes.bool,
  query: React.PropTypes.object,
  goToTnxPage: React.PropTypes.bool,
};

export function mapStateToProps(state) {
  return {
    results: state.results.results,
    totalResults: state.results.totalResults,
    limitResults: state.results.limitResults,
    offsetResults: state.results.offsetResults,
    searchIcons: state.results.searchIcons,
    updateRecordAlert: state.results.updateRecordAlert,
    searchBarData: state.results.searchBarData,
    search: state.search.search,
    loading: state.results.loading,
    catName: state.router.params.catName,
    query: state.router.query,
    goToTnxPage: state.results.goToTnxPage,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateRecord: (values, categories) => {
      values.categories = categories;
      dispatch(updateRecord({ values: values, categories }));
    },
    handleResultsPageClick: (offset, captcha) => {
      const location = window.location;
      dispatch(loadResults({ page: offset, captcha, location }));
    },
    updateSearchObj: (data) => {
      dispatch(updateSearchObj(data));
    },
    handleGetNearMe: (points) => {
      var location = window.location;
      dispatch(loadResults({ page: 1, location }));
    },
    closeUpdateRecordModal: () => {
      dispatch(closeUpdateRecordModal());
    },
  };
}

function preload(state, req) {
  const loaders = [];
  loaders.push([loadResults, {
    data: {
      page: 1,
      location: {
        state: state,
        pathname: req.originalUrl,
        query: req.query,
        search: req.originalUrl.split('?')[1]
      }
    }
  }]);
  if (state.catName || (req.query && req.query.q)) {
    const value = state.catName || req.query.q;
    loaders.push([
      loadSubcategories, {
        data: {
          value: value.replace(/-/g, ' ').replace(/_/g, '-'),
          children: true
        }
      }]);
  }
  return loaders;
}

ResultsPage.preload = preload;

export default connect(mapStateToProps, mapDispatchToProps)(ResultsPage);