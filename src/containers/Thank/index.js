import React from 'react';
import { connect } from 'react-redux';
import { detectmob } from 'utils/functions';
import Helmet from 'react-helmet';
// import shcoach from '../../assets/img/shcoach.png';
// import hand from '../../assets/img/hand.png';
// import thank from '../../assets/img/thank.png';

import SearchBar from 'components/SearchBar';



import './Thank.scss';

class ThanksPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.detectmob = detectmob();
  }


  render() {
    return (
      <div className="thank-page full-height-container">
          <Helmet
            title="Thank Page"
            meta={[
              { name: 'description', content: 'Thank page of reindex' },
            ]}
          />
         {/* <div className="shcoach" style={{backgroundImage: `url(${shcoach})`}}></div> */}
         {/* <div className="hand" style={{backgroundImage: `url(${hand})`}}></div> */}
         {/* <div className="thank" style={{backgroundImage: `url(${thank})`}}></div>        */}
        <SearchBar
            onNewRequest={this.props.handleNewRequest}
            handleSearchBtn={this.props.handleSearchBtn}
            data={this.props.searchBarData}
            txt='Who are you looking for?'
          />

      </div>
    );  
  }
}

ThanksPage.propTypes = {
};


export default connect()(ThanksPage);
