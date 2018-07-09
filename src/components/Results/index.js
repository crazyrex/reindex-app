import React from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import _ from 'lodash';
import { Link } from 'react-router';
import { detectmob } from 'utils/functions';
import { ReCAPTCHA } from 'react-google-recaptcha';
import { requestNoParse } from 'utils/request';
import HomeIcon from 'material-ui/svg-icons/action/home';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import BusinessIcon from 'material-ui/svg-icons/places/business-center';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import config from 'ReindexConfig';

let translate;
let unit;
if (config.lang == "he") {
  require('./Results.rtl.scss');
  translate = require('globalTranslateHE.json');
  unit = 'K';
}
else {
  translate = require('globalTranslate.json');
  require('./Results.scss');
  unit = 'M';
}

function splitTags(tagsStr, catArr, isDetectmob) {
  let arr = tagsStr ? tagsStr.split('|') : [];
  arr = arr.concat(catArr);
  arr = arr.map((e) => { if (e) return e.trim(); return e; });
  arr = _.uniq(arr);
  if (isDetectmob)
    _.reverse(arr);
  return (<div className="wrapper-tags">{arr.map((tag, index) =>
    (tag !== '' ? <Chip className="chip" key={index} onTouchTap={() => this.onTouchTap(tag)}>
      {tag}
    </Chip> : '')
  )}
  </div>);
}

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showResults: false,
      modalOpen: false,
      showCaptcha: false,
      results: {},
      detectmob: detectmob(),
    };

    this.updateRecord = this.updateRecord.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.getDistanceFromLatLonInKm = this.getDistanceFromLatLonInKm.bind(this);

    this.d = null;
    //this.handleExpandChange = this.handleExpandChange.bind(this);
  }

  getDataGTM(data) {
    let topArr = [];
    for (let i = 0; i < 5; i++) {
      if (data[i]) {
        let tmp = data[i]._source.reindexTitle ? data[i]._source.reindexTitle : data[i]._source.first_name + ' ' + data[i]._source.last_name;
        if (data[i]._source.score_value)
          tmp += ' - top5'
        topArr.push(tmp);
      }

    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'load Data',
      'top': topArr
    });
  }

  componentWillReceiveProps(nextProps) {
    this.getDataGTM(nextProps.data);
  }

  componentDidMount() {
    this.getDataGTM(this.props.data);
  }

  scroll2Bottom() {
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 50);
  }

  register2MailingList(values) {
    const email = values.sender.email;
    const fname = values.sender.fname;
    const lname = values.sender.lname;
    const requestURL = `${config.apiRoot}registerToMailingList?email=${email}&&fname=${fname}&&lname=${lname}`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    requestNoParse(requestURL, options)
  }

  updateRecord(values, categories) {
    if (values.sender && values.sender.is_agreed_to_receive_data)
      this.register2MailingList(values);
    this.handleModalClose();
    this.props.updateRecord(values, categories);
  }
  handleModalClose() {
    this.props.cleanSelectedRecordData();
    this.setState({ modalOpen: false });
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  getDistanceFromLatLonInKm(pos1, pos2, unit) {
    let lat1 = this.props.lat;
    let lon1 = this.props.lon;
    let lat2 = pos1;
    let lon2 = pos2;
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    if (unit == 'M')
      d = d * 0.62137;
    return d.toFixed(2);
  }



  handlePageClick(value) {
    this.setState({ showCaptcha: false });
    if (this.props.offset === Math.ceil(this.props.total / this.props.limit)) return;
    if (value) this.props.handlePageClick(this.props.offset + 1, value, this.props.location);
  }
  handleExpandChange = (val, index) => {
    if (val) {
      this.x = new Date().getMilliseconds();
      if (!this.d || (this.d && Math.abs(this.d - this.x > 100))) {
        window.dataLayer.push({
          'event': 'click',
          'cardname': this.props.data[index]._source.reindexTitle
        });
        if (this.d && Math.abs(this.d - this.x > 100)) {
          this.d = null;
        }
        else this.d = this.x;
      }
    }
    const tmp = this.state.results;
    tmp[index] = val;
    this.setState({ results: tmp });
  }
  parseDate(date) {
    const tmpDate = new Date(date || 0);
    //TO-DO 
    // add if to he translate
    return ` ${translate.lastUpdate} - ${tmpDate.getDate()}  ${translate.months[tmpDate.getMonth()]} 
    ${tmpDate.getFullYear()}`;
  }

  clickUpdateRecoed(index) {
    const record = this.props.data[index];
    window.dataLayer.push({
      'event': 'click Update',
      'type': record._source.listing_type_1 === 1 ? 'people' : 'business',
      'name': record._source.listing_type_1 === 1 ? record._source.first_name + ' ' + record._source.last_name : record._source.reindexTitle,
      'status': 'open'
    });
  }
  render() {
    return (
      <div>
        {this.props.data.map((res, index) =>
          <Card
            key={index}
            onExpandChange={(val) => this.handleExpandChange(val, index)}
            className={`card ${res._source.score_value && res._source.score_value > 0 ? 'top' : ''}`}
          >
            <CardHeader
              showExpandableButton={!this.state.detectmob ||
                config.searchTabs[res._source.listing_type_1] === 'people'}
              className={`card-header ${this.state.results[index] ? '' : ''}`}
              actAsExpander={!this.state.detectmob}
            >
              <div className="wrapper-header">
                <div className="wrapper-details">
                  <div className={`${this.state.results[index] ? '' : ''}`}>
                    <div>
                      {this.props.lat && this.props.lon && res._source.location && res._source.location[0] && res._source.location[1] ?
                        <div className="km" >
                          <IconButton ><PlaceIcon /></IconButton>
                          {/*if send "K" get distance in  kilometers*/}
                          <span >{this.getDistanceFromLatLonInKm(res._source.location[1], res._source.location[0])} km</span>
                        </div>
                        : ''}
                      <span className="name">
                        {res._source.reindexTitle ||
                          `${res._source.first_name} ${res._source.last_name}`}
                      </span>
                      <div className="desc">{res._source.reindexDescription}</div>
                    </div>
                    <div>
                  
                      <div className="wrapper-icon-content">
                        <IconButton className="icon-home" ><HomeIcon /></IconButton>
                        <span className="house">{res._source.address_street_name}
                          &nbsp;{res._source.address_street_number}
                          &nbsp;{res._source.address_street_entrance}
                          &nbsp;{res._source.address_neighborhood}
                          &nbsp;{res._source.address_city}
                        </span>
                        <div className="wrapper-logo"><img src={res._source.Logo} width="90px" height="50px"></img></div>
                      </div>
                      {this.state.detectmob ?
                        <div className="wrapper-icon-content">
                          <IconButton className="icon-businesspage"><BusinessIcon /></IconButton>
                          <span className="businesspage">
                            <Link to={res._source.link}>{translate.businessesPage}</Link>
                          </span>
                        </div> : ''}

                    </div>
                  </div>
                </div>
                <div className="separate"></div>
                <div className="tags">
                  {splitTags(res._source.tags, res._source.categories, this.state.detectmob)}
                </div>
              </div>
            </CardHeader>
            <CardText expandable>
              <div className="wrapper-expand">
                <div className="expand-mobile">
                  { /* <div className="name-wrapper">
                    <span className="name">{res._source.reindexTitle ||
                      `${res._source.first_name} ${res._source.last_name}`}</span>
                    <span>{res._source.reindexDescription}</span>
                  </div>
                  <div className="tags">
                    {splitTags(res._source.tags, res._source.categories)}
                  </div>
                  <div className="separate"></div>
                  <div>
                    <IconButton className="icon-phone" ><PhoneIcon /></IconButton>
                    <Phone
                      data={res._source}
                      recordId={res._id}
                      isVirtual={config.searchTabs[res._source.listing_type_1 === 'businesses']}
                    />
                  </div>
                  <div>
                    <IconButton className="icon-home"><HomeIcon /></IconButton>
                    <span className="house">{res._source.address_street_name}
                      &nbsp;{res._source.address_street_number}
                      &nbsp;{res._source.address_street_entrance}
                      &nbsp;{res._source.address_neighborhood}
                      &nbsp;{res._source.address_city}
                    </span>
                  </div>*/}
                </div>
                <div className="wrapper-map">
                  { /*<GMap location={res._source} />*/}
                </div>
                <div className="wrapper-actions">
                  <div style={{ margin: '10px 0' }}>
                    <Link to={res._source.link}> {translate.goToBusinessPage}</Link>
                  </div>
                  <div className="wrapper-icon-content">
                    <IconButton className="icon-update" ><UpdateIcon /></IconButton>
                    <span className="updated">{this.parseDate(res._source.updated)}</span>
                  </div>
                </div>
              </div>
            </CardText>
          </Card>
        )}

        {this.props.offset !== Math.ceil(this.props.total / this.props.limit)
          && this.props.data.length < 200 ?
          <div
            className="wrapper-paginate"
            onClick={() => {
              this.setState({ showCaptcha: true }); this.scroll2Bottom();
            }}
          ><FlatButton
              labelStyle={{ paddingRight: 44, paddingLeft: 44, fontSize: 18 }}
              label="הצג תוצאות נוספות"
            /></div>
          : ''}
        {this.state.showCaptcha ?
          <ReCAPTCHA
            ref="recaptcha"
            sitekey={config.recaptcha.key}
            onChange={this.handlePageClick}
          /> : ''}
        {this.state.modalOpen && this.state.selectedRes ?
          <DetailsForm
            open={this.state.modalOpen}
            handleClose={this.handleModalClose}
            onSubmit={this.updateRecord}
            id={this.state.selectedRes._id}
            type={this.state.selectedRes._source.listing_type_1}
          /> : ''}
      </div>

    );
  }

}

Results.propTypes = {
  data: React.PropTypes.array,
  updateRecord: React.PropTypes.func,
  total: React.PropTypes.number,
  limit: React.PropTypes.number,
  offset: React.PropTypes.number,
  handlePageClick: React.PropTypes.func,
  location: React.PropTypes.object,
  cleanSelectedRecordData: React.PropTypes.func,
};

export function mapStateToProps() {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    cleanSelectedRecordData: () => {
      dispatch(cleanData([]));
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Results);
