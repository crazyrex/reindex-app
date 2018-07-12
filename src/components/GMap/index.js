import React from 'react';
import PropTypes from 'prop-types';
import { detectmob } from 'utils/functions';

let geocoder, Marker, GoogleMap, GoogleMapLoader, googlemaploader;

class GMap extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      location: {},
      detectmob: detectmob(),
    };
    this.renderMap = this.renderMap.bind(this);
  }
  componentWillMount() {
    this.renderMap(this.props.location.reindexLocationPoints, this.props.location.reindexLocationString);
  }

  renderMap(points, address) {
    if (points && points.length) {
      this.setState({ location: { lat: points[1], lng: points[0] } });
      return;
    }
    if (address) {
      geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results) => {
        if (!results || !results.length) return;
        const obj = {
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        };
        this.setState({ location: obj });
      });
    }
  }
  render() {
    if (typeof window === undefined || typeof window === 'undefined') {
      googlemaploader = (<div></div>);
    } else {
      if (!Marker) Marker = require('react-google-maps').Marker;
      if (!GoogleMap) GoogleMap = require('react-google-maps').GoogleMap;
      if (!GoogleMapLoader) GoogleMapLoader = require('react-google-maps').GoogleMapLoader;

      googlemaploader = (
        <GoogleMapLoader
          containerElement={
            <div
              style={!this.state.detectmob ? {
                height: '350px',
              } : {height: '200px'}}
            />
          }
          googleMapElement={
            <GoogleMap
              defaultZoom={15}
              center={this.state.location}
            >
              <Marker
                position={this.state.location}
              />
            </GoogleMap>
          }
        />
      );

      if (!geocoder) this.renderMap(this.props.location);
    }
    return (
      <section>
        {/* {detectmob() ? <a href={`waze://?ll=${this.state.location.lat},${this.state.location.lng}`}>waze</a> : ''}*/}
        {this.state.location.lat ?
           googlemaploader : ''}
      </section>
    );
  }
}

GMap.propTypes = {
  location: PropTypes.object,
};

export default GMap;
