/*
* ChildrenData
*
* List all the features
*/
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import HeaderSite from 'components/HeaderSite';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import Mapbox from 'components/Mapbox';
import MapGov from 'components/MapGov';
import { browserHistory } from 'react-router';
import Chip from 'material-ui/Chip';
import _ from 'lodash';
import { getPhone, detectmob, getWebsite, getLocationData } from '../../utils/functions';
import SocialBtns from 'components/SocialBtns';
import Dialog from 'material-ui/Dialog';
import PhoneIcon from 'material-ui/svg-icons/communication/call';
import HomeIcon from 'material-ui/svg-icons/action/home';
import UpdateIcon from 'material-ui/svg-icons/action/update';
import PlaceIcon from 'material-ui/svg-icons/maps/place';
import LaptopIcon from 'material-ui/svg-icons/hardware/laptop';
import EditIcon from 'material-ui/svg-icons/image/edit';
import ShareIcon from 'material-ui/svg-icons/social/share';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { updateRecord, closeUpdateRecordModal } from './actions';
// import businessBgImg from '../../assets/img/business-bg.png';
import { loadData } from './sagas';
import { loadDataAction } from './actions';
import config from 'ReindexConfig';


let translate;
if (config.lang == "he") {
  require('./RecordPage.rtl.scss');
  translate = require('globalTranslateHE.json');
}
else {
  translate = require('globalTranslate.json');
  require('./RecordPage.scss');
}

function catNTagsArr(tagsStr = '', catArr = []) {
  let arr = catArr;
  arr = arr.concat(tagsStr ? tagsStr.split('|') : []);
  arr = arr.map((e) => e.trim());
  arr = _.uniq(arr);
  arr = arr.filter((w) => w.length);
  return arr;
}

function splitTags(tagsStr, catArr, isDetectmob) {
  let arr = catNTagsArr(tagsStr, catArr);
  if (isDetectmob)
    _.reverse(arr);
  return (<div className="wrapper-tags">{arr.map((tag, index) =>
    tag !== '' ? <Chip className="chip" key={index} >
      {tag}
    </Chip> : ''
  )}
  </div>);
}

class RecordPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      detectmob: detectmob(),
      showSocialBtns: false,
      openPopUpPhone: false
    };
    this.handleModalClose = this.handleModalClose.bind(this);
    this.updateRecord = this.updateRecord.bind(this);
    this.getLocation = this.getLocation.bind(this);
    this.updatePageData = this.updatePageData.bind(this);
    if (typeof window !== undefined || typeof window !== 'undefined')
      this.props.loadData(this.props.params.recordId);
    this.geolocationFlag = false;
  }

  componentWillMount() {
    this.updatePageData(this.props.data)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data._id && !this.state.geolocation) {
      this.getLocation(nextProps.data);
    }
    if (nextProps.data._id && !this.strTitle) this.updatePageData(nextProps.data);
    if (nextProps.goToTnxPage) {
      this.props.closeUpdateRecordModal();
      if (nextProps.data.listing_type_1 == 1) {
        browserHistory.push('/updatedPeople');
      }
      else {
        browserHistory.push('/updatedBusiness');
      }
    }
  }
  getLocation(address) {
    if (this.geolocationFlag) return;
    this.geolocationFlag = true;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: `${address.address_street_name} ${address.address_street_number} ${address.address_city}` }, (results) => {
      const obj = {
        lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng(),
      };
      this.setState({ geolocation: obj });
      return obj;
    });
  }
  parseDate(date) {
    const tmpDate = new Date(date || 0);
    return ` ${translate.lastUpdate} - ${tmpDate.getDate()} ${translate.months[tmpDate.getMonth()]} ${tmpDate.getFullYear()}`;
  }
  updateRecord(values, categories) {
    this.handleModalClose();
    this.props.updateRecord(values, categories);
  }
  handleModalClose() {
    this.setState({ modalOpen: false });
    this.props.cleanSelectedRecordData();
  }

  openPopUpPhone = (val) => {
    this.setState({
      openPopUpPhone: true,
      currentPhone: val,
    })
  }

  closePopUpPhone = () => {
    this.setState({ openPopUpPhone: false });
  };

  updatePageData(record) {
    const locationData = getLocationData(this.props.router);
    this.locationData = locationData;
    const data = record;
    if (!data._id) return;

    if (locationData.pathname.indexOf('/biz') > -1) {
      const categories = catNTagsArr(data.tags, data.categories);
      const lastCategory = (categories.length) ? categories[categories.length - 1] : '';
      let categoriesStr = categories.toString();
      categoriesStr = categoriesStr.replace(/,/g, ' > ');
      this.strTitle = 'Reindex - ' + lastCategory + ' - ' + data.reindexTitle + ' in ' + data.address_city;
      this.description = 'Contact information, address, phone and other information ' + 'Reindex | ' + categoriesStr + 'Index Bussines | ' + data.reindexTitle + ' from ' + data.address_city;
    }
    else {
      const name = `${data.first_name} ${data.last_name}`;
      this.strTitle = 'Reindex - ' + name + ' from ' + data.address_city;

      this.description = 'Search for business and find phone numbers. Contact details, address, phone and other information ' + data.address_city + 'from' + name + ' | Reindex.';
    }
  }

  render() {
    return (
      <div className="record-page">
        <Helmet
          title={`${this.strTitle}`}
          meta={[
            { name: 'description', content: `${this.description}`, }
          ]}
        />
        {(typeof window !== undefined || typeof window !== 'undefined') ?
          <div>
            <HeaderSite />
            {this.state.detectmob ?
              <div className="wrapper-titles">
                <IconButton className="editBtn" onClick={() => { this.setState({ modalOpen: !this.state.modalOpen }); }}><EditIcon /></IconButton>
                <div className="name-n-desc">
                  <div>{this.props.data.reindexTitle || `${this.props.data.first_name} ${this.props.data.last_name}`}</div>
                  <div>{this.props.data.reindexDescription}</div>
                </div>
                {this.state.showSocialBtns ?
                  <SocialBtns data={this.props.data} /> : ''}
                <IconButton className="shareBtn" onClick={() => { this.setState({ showSocialBtns: true }); }}><ShareIcon /></IconButton>
              </div>
              : ''}
            <div className="wrapper-record-content">
              <div className="backLink"><span onClick={() => browserHistory.goBack()}>{'<'} {translate.BackToSearchResults}</span></div>
              <div className="wrapper-header">
                {!this.state.detectmob ?
                  <div>
                    <span className="name">{this.props.data.reindexTitle || `${this.props.data.first_name} ${this.props.data.last_name}`}</span>
                    <span>{this.props.data.reindexDescription}</span>
                  </div> : ''}
                <div>
                <div className="wrapper-logo"><img src={this.props.data.Logo} width="90px" height="50px"></img></div>

                  {this.props.data.phone || this.props.data.phone_2 ?
                    <div className="wrapper-icon-content">
                      <IconButton className="icon-phone" ><PhoneIcon /></IconButton>
                    </div>
                    : ''}
                  <div className="wrapper-icon-content">
                    <IconButton className="icon-home" ><HomeIcon /></IconButton>
                    <span className="house">{this.props.data.address_street_name}
                      &nbsp;{this.props.data.address_street_number}
                      &nbsp;{this.props.data.address_street_entrance}
                      &nbsp;{this.props.data.address_neighborhood}
                      &nbsp;{this.props.data.address_city}
                    </span>
                  </div>
                  
                  {this.props.data.business_website ? <div className="wrapper-icon-content">
                    <IconButton className="icon-laptop" ><LaptopIcon /></IconButton>
                    <span className="website">{this.props.data.business_website}</span>
                  </div> : ''}
                </div>
              </div>
              <div className="separate"></div>

              <div>
                {Object.entries(this.props.data).map(([key, v]) =>
                   v ? <div>{key}: {v}</div> : ''
                )}
              </div>

              <div className="tags">
                {(this.props.data.tags || this.props.data.categories) && splitTags(this.props.data.tags, this.props.data.categories, this.state.detectmob)}
              </div>
              <div className="more-details">
               
               {/* <div id="Mapbox">
                {1 !== 1? <MapGov location={this.props.data} /> :<Mapbox location={this.props.data} /> }
                 
                  </div>*/}
                <div id="details">
                  {!this.state.detectmob ? <SocialBtns data={this.props.data} /> : ''}
                  <div className="wrapper-icon-content">
                    <IconButton className="icon-update"> <UpdateIcon /> </IconButton>
                    <span className="updated">{this.parseDate(this.props.data.updated)}</span>
                  </div>
                </div>
              </div>
              <Snackbar
                open={this.props.updateRecordAlert.open}
                message={this.props.updateRecordAlert.text}
                autoHideDuration={4000}
                onRequestClose={this.props.closeUpdateRecordModal}
              />
            </div>
            <div className="footer-actions">
              {this.props.data.phone_2 || this.props.data.phone ? <div>
                <IconButton ><PhoneIcon /></IconButton>
                <span >
                  {translate.call}
                </span>
              </div> : ''}
              {this.state.geolocation && this.state.geolocation.lat && this.state.geolocation.lng ? <div>
                <IconButton target="_blank" href={`waze://?ll=${this.state.geolocation.lat},${this.state.geolocation.lng}`}><PlaceIcon /></IconButton>
                <span>
                  <a target="_blank" href={`waze://?ll=${this.state.geolocation.lat},${this.state.geolocation.lng}`}>
                    {translate.navigataion}
                  </a></span>
              </div> : ''}
              {this.props.data.business_website ? <div>
                <IconButton href={getWebsite(this.props.data.business_website)}><LaptopIcon /></IconButton>
                <span><a href={getWebsite(this.props.data.business_website)}>
                  translate.website
                          </a></span>
              </div> : ''}
             </div>
            <Dialog
              title={<div><IconButton onClick={this.closePopUpPhone}><CloseIcon /></IconButton></div>}
              modal={false}
              autoScrollBodyContent
              open={this.state.openPopUpPhone}
              onRequestClose={this.handleModalClose}
              titleClassName="title"
              contentClassName="dialog-phone"
              bodyStyle={{ padding: '0', 'borderRadius': '20px' }}
            >
              <div className="number">{this.state.currentPhone}</div>
              <div className="text"> This is a link number: a digital system for directing calls from the site to the business, in accordance<a href='/terms' target="_blank"> to site policies.</a></div>
              <a href={`tel:${this.state.currentPhone}`} className="wrapper-in-dialog">
                <IconButton className="icon-phone" ><PhoneIcon /></IconButton>
                <div>{translate.call}</div>
              </a>
            </Dialog>
          </div> : ''}
      </div>
    );
  }
}


RecordPage.propTypes = {
  updateRecord: PropTypes.func,
  loadData: PropTypes.func,
  data: PropTypes.object,
  closeUpdateRecordModal: PropTypes.func,
  updateRecordAlert: PropTypes.object,
  router: PropTypes.object,
  goToTnxPage: PropTypes.bool,
  cleanSelectedRecordData: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    data: state.recordReducer.data,
    updateRecordAlert: state.recordReducer.updateRecordAlert,
    router: state.router,
    goToTnxPage: state.recordReducer.goToTnxPage,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateRecord: (values, categories) => {
      const tmpValues = values;
      tmpValues.categories = categories;
      dispatch(updateRecord({ values: tmpValues, categories }));
    },
    loadData: (record) => {
      dispatch(loadDataAction(record));
    },
    closeUpdateRecordModal: () => {
      dispatch(closeUpdateRecordModal());
    },
    cleanSelectedRecordData: () => {
      dispatch(cleanData([]));
    }
  };
}

function preload(state) {
  return [
    [loadData, { record: state.recordId }]
  ];
}


RecordPage.preload = preload;


export default connect(mapStateToProps, mapDispatchToProps)(RecordPage);