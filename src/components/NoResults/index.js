import React from 'react';
import PropTypes from 'prop-types';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import abroch from 'assets/img/no-results.png';
import { detectmob } from 'utils/functions';
import { NO_RESULTS_TEXT, NO_RESULTS_TEXT_FROM_CAMPAIGN } from './constants';

const styles = require('./NoResults.scss');


class NoResults extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      emailOpen: false,
    };
    this.detectmob = detectmob();
    this.toggleEmail = this.toggleEmail.bind(this);
    this.closeEmail = this.closeEmail.bind(this);
    this.comeFromCampaign = this.props.data && props.data.query && props.data.query.comeFrom && props.data.query.comeFrom.indexOf('campaign') > -1;
    // this.text = this.comeFromCampaign ? NO_RESULTS_TEXT_FROM_CAMPAIGN : NO_RESULTS_TEXT;
    this.text = NO_RESULTS_TEXT_FROM_CAMPAIGN;
  }

  componentDidMount() {
    if(window.location.search && window.location.search !== "") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'no-results',
        'search' : decodeURI(window.location.search)
      });
    }
  }

  toggleEmail() {
    this.setState({ emailOpen: !this.state.emailOpen });
  }
  closeEmail() {
    this.setState({ emailOpen: false });
  }

  render() {
    const { comeFromCampaign, text } = this;
    return (
      <div className={styles["wrapper-no-results"]}>
        <div className={styles["center"]}>
          <div className={styles["abroch"]} style={{ backgroundImage: `url(${abroch})` }}></div>
          <div className={styles["text"]}>{text}</div>
          <CreateForm data={{ campaignLabel: true }} />
        </div>
        {/* {!comeFromCampaign && <div className={styles["bottom"]}>
          {!this.detectmob ? <SendEmailForm src="ABROCH" closeEmailAlertInParent={this.closeEmail} /> : 
          <div>
            <div className={styles["formHeader"]} onClick={this.toggleEmail}>
              {this.state.emailOpen ? <NavigationExpandMore /> : <NavigationExpandLess />}
              <div>שלח מייל</div>
            </div>
            <div className={`${styles.formContent} ${this.state.emailOpen && styles.active}`}>
              <SendEmailForm src="ABROCH" closeEmailAlertInParent={this.closeEmail} />
            </div>
          </div> }
        </div>} */}
      </div>
    );
  }

}

NoResults.propTypes = {
  data: PropTypes.object,
};

export default NoResults;
