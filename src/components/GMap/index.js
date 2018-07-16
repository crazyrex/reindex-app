import React from 'react';
import { detectmob } from 'utils/functions';
import { withGoogleMap, GoogleMap, Marker } from "react-google-maps"

const GMap = withGoogleMap((props) => {
  if (!props.points) return (<div>no points</div>);
  return (
    <GoogleMap
      defaultZoom={15}
      defaultCenter={{ lat: props.points[1], lng: props.points[0] }}>
        <Marker position={{ lat: props.points[1], lng: props.points[0] }} />
    </GoogleMap>
  )
});

export default GMap;
