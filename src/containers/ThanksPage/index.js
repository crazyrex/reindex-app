import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { detectmob } from 'utils/functions';
import Helmet from 'react-helmet';


import './ThanksPage.scss';

class ThanksPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.detectmob = detectmob();
  }

  componentWillMount() {
    // const script = document.createElement("script");
    // script.text = `fbq('track', 'Lead', {
    //   value: 10.00,
    //   currency: 'USD'
    //   });`;
    // document.body.appendChild(script);

    // const script1 = document.createElement("script");
    // script1.text = `/* <![CDATA[ */
    //   var google_conversion_id = 954411219;
    //   var google_conversion_language = "en";
    //   var google_conversion_format = "3";
    //   var google_conversion_color = "ffffff";
    //   var google_conversion_label = "a42vCPDn_XEQ09GMxwM";
    //   var google_remarketing_only = false;
    //   /* ]]> */`;
    // document.body.appendChild(script1);

    // const script2 = document.createElement("script");
    // script2.src = '//www.googleadservices.com/pagead/conversion.js';
    // document.body.appendChild(script2);

    // const script3 = document.createElement("noscript");
    // script3.innerHTML = `<div style="display:inline;">
    //   <img height="1" width="1" style="border-style:none;" alt="" src="//www.googleadservices.com/pagead/conversion/954411219/?label=a42vCPDn_XEQ09GMxwM&amp;guid=ON&amp;script=0"/>
    //   </div>`;
    // document.body.appendChild(script3);
  }

  render() {
    return (
      <div className="thanks-page full-height-container">
          <Helmet
            title="Thanks Page"
            meta={[
              { name: 'description', content: 'Thanks page of reindex' },
            ]}
          />
          <div className="wrapper-img">
      
          </div>
      </div>
    );  
  }
}

ThanksPage.propTypes = {
};


export default connect()(ThanksPage);
