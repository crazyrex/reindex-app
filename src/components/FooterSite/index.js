
import React from 'react';
import PropTypes from 'prop-types';

import './FooterSite.scss';

class FooterSite extends React.Component { // eslint-disable-line react/prefer-stateless-function

  render() {
    return (
      <div className="footer-site">
        <div className="date">
          { new Date().toLocaleDateString() }
        </div>
        <copyright>
         © כל הזכויות שמורות לאו.פי בע"מ  {new Date().getFullYear()}
        </copyright>
      </div>
    );
  }
}

export default FooterSite;
