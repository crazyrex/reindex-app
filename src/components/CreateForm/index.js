import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import TextField from 'material-ui/TextField';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { Checkbox } from 'redux-form-material-ui';
import Snackbar from 'material-ui/Snackbar';
import validate from './validate';
import CategoriesTree from '../CategoriesTree';
import config from '../../config';
import { createRecord, closeCreateRecordModal, register2MailingList } from './actions';
import { detectmob } from 'utils/functions';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Home';

const styles = require('./CreateForm.scss');
const hstyles = require('../HeaderSite/HeaderSite.scss');
const selector = formValueSelector('create');

const renderField = ({ input, label, meta: { touched, error } }) => (
  <div>
    <TextField
      fullWidth
      floatingLabelStyle={{ color: '#707070', fontFamily: 'Heebo-Light' }}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
    />
  </div>
);

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
};

let CreateForm = class CreateForm extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 2,
      modalOpen: false,
      detectmob: detectmob()
    };
    this.categories = [];

    this.renderSelectField = this.renderSelectField.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.createRecord = this.createRecord.bind(this);
    this.updateSelectedCategories = this.updateSelectedCategories.bind(this);
    this.comeFromCampaign = props.router.query && props.router.query.comeFrom && props.router.query.comeFrom.indexOf('campaign') > -1;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.goToTnxPage) {
      this.props.closeCreateRecordModal();
      browserHistory.push('/newUpdateMain');
    }
  }

  handleModalClose() {
    this.setState({ modalOpen: false });
  }

  clickCreateRecord() {
    window.dataLayer.push({
      'event': 'click Create',
      'status': 'open'
    });
  }
  
  getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// Usage



  createRecord(values) {
    window.dataLayer.push({
      'event': 'click Create',
      'type': values.listing_type_1 === 1 ? 'people' : 'business',
      'name': values.listing_type_1 === 1 ? values.first_name + ' ' + values.last_name : values.business_name,
      'status': 'success'
    });
    let ip;
    this.handleModalClose();
    const that = this;
    this.getUserIP(function(ip){
      ip = ip;
      that.props.createRecord(values, that.categories, ip);
      that.props.reset();
  });
   
  }

  updateSelectedCategories(categories) {
    this.categories = categories;
  }


  renderSelectField({ input, label, meta: { touched, error }, children, ...custom }) {
    return (
      <SelectField
        fullWidth
        floatingLabelText={label}
        floatingLabelStyle={{ color: '#707070', fontFamily: 'Heebo-Light' }}
        iconStyle={{ padding: 0, textAlign: 'left', fill: '#818181' }}
        errorText={touched && error}
        {...input}
        onChange={(event, index, value) => { this.setState({ type: value }); input.onChange(value); }}
        {...custom}
      >
        {children}
      </SelectField>
    );
  }
  render() {
    const { comeFromCampaign } = this;
    let openPopuplabel;
    let labelStyle;
    openPopuplabel = (comeFromCampaign && this.props.router.pathname !== '/' && this.props.data && this.props.data.campaignLabel) ? 'יש, לא מצאתי! רוצה לעדכן' : 'עדכן את המדריך';
    labelStyle = { paddingRight: 44, paddingLeft: 44, fontSize: 18 };
    const updateBtnLabel = comeFromCampaign ? 'קבלו עדכון, הלכתי לארוז!' : 'שלח עדכון';

    return (
      <div>
        <div className={hstyles['wrapper-createBtn']} onClick={() => { this.clickCreateRecord(); this.setState({ modalOpen: !this.state.modalOpen }); }}>
          {!this.state.detectmob ?
            <Button label={openPopuplabel} labelStyle={labelStyle}>{openPopuplabel}</Button> :
            <div className="create-btn">
              <IconButton><CloseIcon /></IconButton>
              <span>הוסף</span>
            </div>
          }
        </div>
        <Dialog
          title={<div><span>צור תוצאת חיפוש חדשה</span><span>הוסף עסק או אדם חדש למאגר</span></div>}
          modal={false}
          autoScrollBodyContent
          open={this.state.modalOpen}
          onRequestClose={this.handleModalClose}
          titleClassName="title"
          contentClassName="create-content"
          bodyClassName="create-body"
          bodyStyle={{ padding: '0' }}
          paperClassName="create-paper"
        >
          <form onSubmit={this.props.handleSubmit(this.createRecord)}>
            <div className={styles['wrapper-fields']}>
              <div>
                <Field name="listing_type_1" component={this.renderSelectField} label="סווג">
                  <MenuItem value={1} primaryText="אנשים" />
                  <MenuItem value={2} primaryText="עסקים" />
                </Field>
                {(this.state.type && config.searchTabs.type.indexOf(this.state.type.toString()) > -1) ?
                  <div>
                    <Field name="business_name" type="text" component={renderField} label="שם העסק" />
                    <Field name="business_description" type="text" component={renderField} label="תאור" />
                    <Field name="business_website" type="text" component={renderField} label="אתר הבית" />
                  </div> :
                  <div className={`${styles['wrapper-two-fields']} ${styles.name}}`}>
                    <Field name="first_name" type="text" component={renderField} label="שם פרטי" />
                    <Field name="last_name" type="text" component={renderField} label="שם משפחה" />
                  </div>
                }
                <div className="wrapper-two-fields tel">
                  <Field name="phone" type="text" component={renderField} label="טלפון" />
                  <Field name="phone_2" type="text" component={renderField} label="נייד" />
                </div>
                <div className="wrapper-two-fields street">
                  <Field name="address_street_name" type="text" component={renderField} label="רחוב" />
                  <Field name="address_street_number" type="text" component={renderField} label="בית" />
                </div>
                <Field name="address_city" type="text" component={renderField} label="עיר" />
                <Field name="email" type="email" component={renderField} label='דוא"ל' />
              </div>
              <div>
                <Field name="sender.fname" type="text" component={renderField} label="שם פרטי של המעדכן" />
                <Field name="sender.lname" type="text" component={renderField} label="שם משפחה של המעדכן" />
                <Field name="sender.email" type="email" component={renderField} label='דוא"ל' />
                <Field name="sender.phone" type="email" component={renderField} label='טלפון' />
                <Field name="sender.is_agreed_to_receive_data" component={Checkbox} label="אשר לנו לעדכן אותך על חדשות ואפשרויות נוספות במדריך" labelPosition="left" className="wrapper-checkbox" />
              </div>
            </div>
            {(this.state.type && config.searchTabs.type.indexOf(this.state.type.toString()) > -1) ?
              <CategoriesTree onUpdate={this.updateSelectedCategories} /> : ''}
            <div className="wrapper-actions">
              <div onClick={this.handleModalClose}><Button label="ביטול" labelStyle={{ color: '#b3b3b3', fontSize: 16 }} >Cancel</Button></div>
              <Button variant="contained" className="submitBtn" type="submit" label={updateBtnLabel} labelStyle={{ fontSize: 16 }} overlayStyle={{ backgroundColor: 'transparent' }} >{updateBtnLabel}</Button>
            </div>
          </form>
        </Dialog>
        <Snackbar
          open={this.props.createRecordAlert.open}
          message={this.props.createRecordAlert.text}
          autoHideDuration={4000}
          onRequestClose={this.props.closeCreateRecordModal}
        />
      </div>
    );
  }
};

CreateForm.propTypes = {
  handleSubmit: PropTypes.func,
  createRecord: PropTypes.func,
  createRecordAlert: PropTypes.object,
  closeCreateRecordModal: PropTypes.func,
  register2MailingList: PropTypes.func,
  router: PropTypes.object,
  goToTnxPage: PropTypes.bool,
  data: PropTypes.object,
};

export function mapStateToProps(state) {
  return {
    createRecordAlert: state.createForm.createRecordAlert,
    goToTnxPage: state.createForm.goToTnxPage,
    senderEmailValue: selector(state, 'sender.email'),
    router: state.router,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    createRecord: (values, categories, ip) => {
      if (values && values.sender && values.sender.email && values.sender.is_agreed_to_receive_data && values.sender.is_agreed_to_receive_data === true) {
        dispatch(register2MailingList({ values, ip }));
      }
      dispatch(createRecord({ values, categories }));
    },
    closeCreateRecordModal: () => {
      dispatch(closeCreateRecordModal());
    },
  };
}
function getErrorFieldNames(obj, name = '') {
  const errorArr = [];
  errorArr.push(Object.keys(obj).map((key) => {
    const next = obj[key];
    if (next) {
      if (typeof next === 'string') {
        return name + key;
      }
      // Keep looking
      if (next.map) {
        errorArr.push(next.map((item, index) => getErrorFieldNames(item, `${name}${key}[${index}].`)).filter(o => o));
      }
    }
    return null;
  }).filter(o => o));
  return flatten(errorArr);
}

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten), []);
}
export function scrollToFirstError(errors) {
  if (errors) {
    let errorFields = getErrorFieldNames(errors);
    let flag = false;
    if (!errorFields.length) {
      errorFields = getErrorFieldNames(errors.sender);
      flag = true;
    }

    // Using breakable for loop
    for (let i = 0; i < errorFields.length; i++) {
      let fieldName;
      if (flag) fieldName = `sender.${errorFields[i]}`;
      else fieldName = `${errorFields[i]}`;
      if (document.querySelectorAll(`[name="${fieldName}"]`).length) {
        document.getElementsByName(`${fieldName}`)[0].focus();
        break;
      }
    }
  }
}

CreateForm = reduxForm({
  form: 'create',
  onSubmitFail: (errors) => scrollToFirstError(errors),
  validate,
  initialValues: { listing_type_1: 2, sender: { is_agreed_to_receive_data: true } },
})(CreateForm);

CreateForm = connect(
  mapStateToProps, mapDispatchToProps
)(CreateForm);

export default { CreateForm }.CreateForm;
