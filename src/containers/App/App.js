import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; // v1.x
import { MuiThemeProvider as V0MuiThemeProvider} from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { getLocationData } from 'utils/functions';
import { detectmob } from 'utils/functions';
import config from 'ReindexConfig';

let isRtl;
config.lang == "he" ? isRtl = true : false;

const theme = createMuiTheme({ isRtl: isRtl, fontFamily: 'Heebo' });
const themeV0 = getMuiTheme({ isRtl: isRtl, fontFamily: 'Heebo' });

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
    this.props.loadResults({ page: 1, location: location });
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


  handleChange(nextValue) {
    this.props.navigate(`/${nextValue}`);
  }

  render() {
    const { children, inputValue, location } = this.props;
    return (
      <MuiThemeProvider theme={theme}>
        <V0MuiThemeProvider muiTheme={themeV0}>
        <div className={`app ${(location.pathname.split('/')[1]) ? location.pathname.split('/')[1] : 'home'}`}>
          <div className="content">
            {children}
          </div>
        </div>
        </V0MuiThemeProvider>
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
