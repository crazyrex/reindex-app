import has from 'lodash/has';
import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, RouterContext } from 'react-router';
import GoogleAnalytics from 'react-ga';

require('../../assets/css/global-styles.scss');

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.onUpdate = this.onUpdate.bind(this);
}

 onUpdate() {
    const that = this;
    const userAgent = navigator.userAgent;
    window.dataLayer = window.dataLayer || [];
    setTimeout(function() {
      if (window.location.search)
          window.dataLayer.push({
          'event': 'pageview',
          'url': decodeURI(window.location.pathname),
          'title': window.document.title,
          'search':decodeURI(window.location.search),
          'platform':userAgent.indexOf('AppName/1.0') > -1 ? 'application':'web'
        });
        else {
          if (window.location.pathname.indexOf('/') > -1) {
            var search = window.location.pathname.split('/')[2];
            window.dataLayer.push({
              'event': 'pageview',
              'url': decodeURI(window.location.pathname),
              'search': decodeURI(search),
              'title': window.document.title,
              'platform': userAgent.indexOf('AppName/1.0') > -1 ? 'application' : 'web'
            });
          }
          else
            window.dataLayer.push({
              'event': 'pageview',
              'url': decodeURI(window.location.pathname),
              'title': window.document.title,
              'platform': userAgent.indexOf('AppName/1.0') > -1 ? 'application' : 'web'
            });
        }
    }, 1000);
    const { store, type } = this.props;
    if (type !== 'server') {
      const state = store.getState();
      // if (has(state, 'router.pathname')) {
      //   GoogleAnalytics.pageview(state.router.pathname);
      // }
    }
  }
  render() {
    const { store, history, routes, type, renderProps } = this.props;
    return (
      <Provider store={store}>
        <div>
          {type === 'server'
            ? <RouterContext {...renderProps} />
            : <Router history={history} routes={routes} onUpdate={this.onUpdate} />}
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  routes: PropTypes.node.isRequired,
  type: PropTypes.object,
  renderProps: PropTypes.object
};
