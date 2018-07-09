import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Explore } from 'components';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CopyRightIcon from 'material-ui/svg-icons/action/copyright';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { getLocationData } from 'utils/functions';
import { detectmob } from '../../utils/functions';
import config from 'ReindexConfig';

let isRtl;
config.lang == "he" ? isRtl = true : false;
const muiTheme = getMuiTheme({ isRtl: isRtl, fontFamily: 'Heebo' });

import {
  navigate,
  updateRouterState,
  resetErrorMessage
} from '../../actions';

import { loadResults } from '../ResultsPage/actions';

import styles from './App.scss'; // eslint-disable-line
import 'assets/css/global-styles.scss';


class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      detectmob: detectmob(),
    };
  }


  componentWillMount() {
    this.props.updateRouterState({
      pathname: this.props.location.pathname,
      params: this.props.params,
      query: this.props.location.query,
    });
  }

  loadResults(location, locationData) {
    if (locationData.tab === 'businesses' || locationData.tab === 'people') {
      this.props.loadResults({ page: 1, location: location });
    }
  }

  componentWillReceiveProps(nextProps) {
    const locationData = getLocationData(nextProps.location);
    if (nextProps.errorMessage) {
      // handle error here
    }
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.props.updateRouterState({
        pathname: nextProps.location.pathname,
        params: nextProps.params,
        query: nextProps.location.query,
      });
      return this.loadResults(nextProps.location, locationData);
    }
    if (this.props.location.search !== nextProps.location.search) {
      this.loadResults(nextProps.location, locationData);
    }
  }

  handleDismissClick(e) {
    this.props.resetErrorMessage();
    e.preventDefault();
  }

  handleChange(nextValue) {
    this.props.navigate(`/${nextValue}`);
  }

  render() {
    const { children, inputValue, location } = this.props;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className={`app ${(location.pathname.split('/')[1]) ? location.pathname.split('/')[1] : 'home'}`}>
          <div className="content">
            {children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {
  errorMessage: PropTypes.string,
  inputValue: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  updateRouterState: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  children: PropTypes.node,
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  params: PropTypes.object
};

// function preload() {
//   return [
//     [sagaName]
//   ];
// }
// App.preload = preload;

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    inputValue: state.router.pathname.substring(1)
  };
}

export default connect(mapStateToProps, {
  navigate,
  updateRouterState,
  resetErrorMessage,
  loadResults,
})(App);
