'use strict';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import Filters from 'components/Filters';
import logo from 'assets/img/logo.png';
import beta from 'assets/img/logo.png';
import HeaderSite from 'components/HeaderSite';
//import SearchIcons from 'components/SearchIcons';
// import NoResults from 'components/NoResults';
// import Results from 'components/Results';
import SearchBar from 'components/SearchBar';
// import Snackbar from 'material-ui/Snackbar';
import DrawerFilter from 'components/DrawerFilter';
import { detectmob } from '../../utils/functions';
import config from '../../ReindexConfig';
// import Tabs from 'components/Tabs';
import { loadResults, changeState, updateRecord, displayIcons, closeUpdateRecordModal, checkData } from './actions';
// import { spacing } from 'material-ui/styles';
// const seoImage = require('assets/img/hp.png');
// import IconButton from 'material-ui/IconButton';
// import PlaceIcon from '@material-ui/icons/navigation/cancel';
let styles;
if (config.lang == "he")
  styles = require('./MainSearch.rtl.scss');
else
  styles = require('./MainSearch.scss');
let ifApp = true;
let listcategories;

export class MainSearch extends React.PureComponent {
  constructor(props) {
    super(props);
    if (typeof window === 'object' && window.test === undefined) {
      window.test = window.innerHeight;
    }
    this.state = {
      modalOpen: false,
      detectmob: detectmob(),
      is_keyboard: false,
      initial_screen_size: '',
      displayIcons: true,
      goToApp: true,
      ifApp: true,
      isData: false
    };

    this.handleModalClose = this.handleModalClose.bind(this);
    this.changeState = this.changeState.bind(this);
    this.toggleIcons = this.toggleIcons.bind(this);
    this.onResize = this.onResize.bind(this);
    this.handleClose = this.handleClose.bind(this);   
    this.props.checkData();

    }
  componentDidMount() {
    // this.domain = window.location.origin;
   
    const that = this;
    that.setState({ initial_screen_size: window.innerHeight });
    that.setState({ is_keyboard: (window.innerHeight < window.test) });
    that.toggleIcons();
    if (window.innerHeight < 450) {
      this.setState({ displayIcons: false });
    }
    if (!this.props.displayIcons) {
      this.setState({ displayIcons: this.props.displayIcons })
    }
    window.addEventListener('resize', this.onResize, false);
    ifApp = window.navigator.appVersion.indexOf('AppName/1') == -1 ? false : true;
    this.setState({ ifApp: ifApp });
  }


  onResize() {
    const that = this;
    that.setState({ is_keyboard: (window.innerHeight < window.test) });
    if (!this.props.isDisplayIcons)
      if (window.innerHeight < window.test) {
        this.props.displayIcons(false);
      }
      else this.props.displayIcons(true);
    that.toggleIcons();
  }

   componentWillMount(){
  }

  componentWillUnmount() {
   
    // you need to unbind the same listener that was binded.
    window.removeEventListener('resize', this.onResize, false);

  }

  toggleIcons() {
    if (this.state.is_keyboard) {
      this.setState({ displayIcons: false });
    } else {
      this.setState({ displayIcons: true });
    }
  }
  handleModalClose() {
    this.setState({ modalOpen: false });
  }

  changeState() {
    this.forceUpdate();
    this.props.changeState();
  }

  handleClose() {
    ifApp = true;
    this.setState({ goToApp: false, ifApp: true });
  }

  render() {
    return (
      <div className={`main-search full-height-container main ${this.props.state === 'main' ? 'main' : 'search'} ${!this.state.ifApp ? 'gotoapp' : ''}`}>
        <Helmet
          title="Reindex"
          meta={[
            { name: 'description', content: 'Reindexי' },
          ]}
        />
        <HeaderSite logoClicked={this.changeState} />
        <div className={'wrapper-autocomplete'}>
          {/*<div className="header">
            <img src={logo} role="presentation" />
          </div>*/}
          <div id="mapTab"></div>
          <SearchBar
            onNewRequest={this.props.handleNewRequest}
            handleSearchBtn={this.props.handleSearchBtn}
            data={this.props.searchBarData}
          />
        </div>
    
        {/*{!this.props.isData?
           <div className="init">explain.........</div>
        :'' }*/}


        {/*  {!this.state.detectmob ?
          <div className="wrapper-filters">
            <Filters onNewRequest={this.props.handleNewRequest} pageState={this.props.state} />
          </div> : ''}
        {this.props.isDisplayIcons && this.state.displayIcons && <div className="bottom-icons"><SearchIcons /></div>}
        {this.state.detectmob && this.props.results.length > 0 ?
          <DrawerFilter onNewRequest={this.props.handleNewRequest} pageState={this.props.state} /> : ''}
        {this.props.results.length > 0 ? <div className={styles["wrapper-results"]}>
          <div className={styles["results-count"]}>נמצאו {this.props.totalResults} תוצאות </div>
           <Results
            data={this.props.results}
            total={this.props.totalResults}
            limit={this.props.limitResults}
            offset={this.props.offsetResults}
            updateRecord={this.props.updateRecord}
            handlePageClick={this.props.handleResultsPageClick}
          /></div> : <NoResults />} 
        <Snackbar
          open={this.props.updateRecordAlert.open}
          message={this.props.updateRecordAlert.text}
          autoHideDuration={4000}
          onRequestClose={this.props.closeUpdateRecordModal}
        />*/}
      </div>
    );
  }
}


MainSearch.propTypes = {
  state: PropTypes.string,
  results: PropTypes.array,
  changeState: PropTypes.func,
  updateRecord: PropTypes.func,
  handleNewRequest: PropTypes.func,
  handleSearchBtn: PropTypes.func,
  updateRecordAlert: PropTypes.object,
  closeUpdateRecordModal: PropTypes.func,
  totalResults: PropTypes.number,
  limitResults: PropTypes.number,
  handleResultsPageClick: PropTypes.func,
  searchBarData: PropTypes.object,
  offsetResults: PropTypes.number,
  height: PropTypes.number,
  isDisplayIcons: PropTypes.bool,
};

export function mapStateToProps(state) {
  return {
    state: state.mainSearch.state,
    results: state.mainSearch.results,
    totalResults: state.mainSearch.totalResults,
    limitResults: state.mainSearch.limitResults,
    offsetResults: state.mainSearch.offsetResults,
    updateRecordAlert: state.mainSearch.updateRecordAlert,
    searchBarData: state.mainSearch.searchBarData,
    search: state.search.search,
    categories: state.search.categories,
    isDisplayIcons: state.mainSearch.displayIcons,
    isData :state.mainSearch.isData
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changeState: () => {
      dispatch(changeState());
    },
    checkData: () => {
      dispatch(checkData());
    },
    updateRecord: (values, categories) => {
      values.categories = categories;
      dispatch(updateRecord({ values: values, categories }));
    },
    handleNewRequest: () => {
      // dispatch(loadResults({ page: 1 }));
    },
    handleSearchBtn: () => {
      // dispatch(loadResults({ page: 1 }));
    },
    closeUpdateRecordModal: () => {
      dispatch(closeUpdateRecordModal());
    },
    handleResultsPageClick: (offset, captcha) => {
      // dispatch(loadResults({ page: offset, captcha }));
    },
    displayIcons: (isDisplay) => {
      dispatch(displayIcons({ displayIcons: isDisplay }))
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(MainSearch);
