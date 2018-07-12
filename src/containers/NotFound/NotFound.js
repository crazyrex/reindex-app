import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Link } from 'react-router';


export default function NotFound() {
  return (
    <div className="container">
      <Helmet
        title="404"
        meta={[
          { name: 'description', content: 'Page not found' },
        ]}
      />
      <p>page not found</p>
    </div>
  );
}
