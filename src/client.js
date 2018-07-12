import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
// import GoogleAnalytics from 'react-ga';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { Root } from 'containers';
import rootSaga from './sagas';
import getRoutes from './routes';
import { history } from './services';
import configureStore from './store/configureStore';
// import config from './config';


injectTapEventPlugin();
const dest = document.getElementById('content');
const store = configureStore(window.__data); // eslint-disable-line

store.dispatch({ type: 'INIT', data: {cleanSearch: true , router: window.__data.router}}); // eslint-disable-line

// GoogleAnalytics.initialize(config.app.googleAnalytics.appId);


store.runSaga(rootSaga);

render(
  <Root
    store={store}
    history={history}
    routes={getRoutes(store)}
  />,
  dest
);

if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
}
