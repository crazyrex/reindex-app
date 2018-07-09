/* eslint-disable */
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import config from '../config';

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
class Html extends Component {
  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToStaticMarkup(component) : '';
    const head = Helmet.rewind();

    return (
      <html lang="en-us" dir="rtl">
        <head>
          <script src="https://cdn.optimizely.com/js/8593670089.js"></script>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link href='https://api.mapbox.com/mapbox-gl-js/v0.44.1/mapbox-gl.css' rel='stylesheet' />
          {/* <link rel="shortcut icon" href="/favicon.ico" /> */}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          
          {/* styles (will be present only in production with webpack extract text plugin) */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection" rel="stylesheet" type="text/css" charSet="UTF-8" />
          )}
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
        <script src="https://new.govmap.gov.il/govmap/api/govmap.api.js"></script>  

          {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDhTI0krUB7cDYMDYDxuXV1aSAFQ25w7Lw" async defer></script> */}
          {/* <script id='pixel-script-poptin' src='https://cdn.popt.in/pixel.js?id=f90ba10596814' async='true'></script> */}

        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{ __html: content }}/>
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
          <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} charSet="UTF-8" />
          <script src={assets.javascript.main} charSet="UTF-8" />          
          <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBMbSKyjyjhm6x_6UQvHP1rJ-LGDF7Ac6o" async defer></script>
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object
};

export default Html;
