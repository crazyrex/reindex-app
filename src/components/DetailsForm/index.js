import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, change } from 'redux-form';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import { Checkbox } from 'redux-form-material-ui';
import { connect } from 'react-redux';
import request from 'utils/request';
import config from '../../ReindexConfig';
import { getPhone } from 'utils/functions';
import { receiveData, cleanData } from './actions';
import validate from './validate';
import CategoriesTree from '../CategoriesTree';

import './DetailsForm.scss';


const renderTextArea = ({ input, label, rows, multiLine, meta: { touched, error, warning } }) => (
  <TextField
    fullWidth
    floatingLabelText={label}
    floatingLabelStyle={{ color: '#707070', fontFamily: 'Heebo-Light' }}
    errorText={touched && error}
    rows={rows}
    multiLine={multiLine}
    maxLength="40"
    {...input}
  />
);

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

let DetailsForm = class DetailsForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
    };
    this.flagInit = false;
    this.renderSelectField = this.renderSelectField.bind(this);
    this.updateSelectedCategories = this.updateSelectedCategories.bind(this);
    this.cleanData = this.cleanData.bind(this);
    this.cleanData();
  }

  flagChange = false;

  cleanData() {
    this.props.cleanData();
  }

  updateSelectedCategories(categories) {
    this.categories = categories;
  }
  updateRecord(values) {
    window.dataLayer.push({
      'event': 'click Update',
      'type': values.listing_type_1 === 1 ? 'people' : 'business',
      'name': values.listing_type_1 === 1 ? values.first_name + ' ' + values.last_name : values.business_name,
      'status': 'success'
    });
    this.props.onSubmit(values, this.categories || this.props.initialValues.categories || []);
  }

  saveDataInLS(key, val) {
    localStorage.setItem(key, val);
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
        onChange={(event, index, value) => {
          this.setState({ type: value });
          input.onChange(value);
          if (!this.flagChange) {
            this.type = this.props.initialValues.listing_type_1;
            this.flagChange = true;
          }
          else this.type = this.type === 2 ? 1 : 2;
          this.props.changeFieldValue(this.props.initialValues, this.type);
        }}
        {...custom}
      >
        {children}
      </SelectField>
    );
  }

  componentDidMount() {
    this.props.loadData(this.props.id, this.props.adminUpdate);
  }
  componentWillMount() {
    this.isPpl = config.searchTabs[this.state.type] === 'businesses' ? false : true;
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.initialValues && nextProps.initialValues.categories && nextProps.initialValues.categories.length && !this.flagInit)
      this.categories = nextProps.initialValues.categories;
    this.flagInit = true;
  }


  render() {
    return (
      <Dialog
        title={<div>{!this.isPpl ? <span>Update business information</span> : <span>Update information</span>}
          <span>Help us fill out missing details and enrich the database</span></div>}
        modal={false}
        autoScrollBodyContent
        open={this.props.open}
        onRequestClose={this.props.handleClose}
        titleClassName="title"
        contentClassName="details-content"
        bodyClassName="details-body"
        bodyStyle={{ padding: '0' }}
        paperClassName="details-paper"
      >
        <form onSubmit={this.props.handleSubmit(this.updateRecord.bind(this))}>
          <div className="wrapper-fields">
            <div>
              <Field name="listing_type_1" component={this.renderSelectField} label="סווג">
                <MenuItem value={1} primaryText="אנשים" />
                <MenuItem value={2} primaryText="עסקים" />
              </Field>
              {config.searchTabs[this.state.type] === 'businesses' ?
                <div>
                  <Field name="business_name" type="text" component={renderField} label="שם העסק" />
                  <Field name="business_description" type="text" component={renderField} label="תאור" />
                  <Field name="business_website" type="text" component={renderField} label="אתר הבית" /> </div> :
                <div className="wrapper-two-fields name">
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
              <Field name="is_deleted_checked" component={Checkbox} label="רשומה לא רלוונטית" labelPosition="left" className="wrapper-checkbox" />
              {(this.props.detailsValues && this.props.detailsValues.is_deleted_checked) ?
                <Field name="reason_not_relevant" type="text" rows={2} component={renderTextArea} multiLine={true} label="הסבר מדוע הרשימה לא רלוונטית"
                /> : null
              }
            </div>
            <div>
              <Field name="sender.fname" type="text" component={renderField} label="שם פרטי של המעדכן" onBlur={(event, newValue, previousValue) => this.saveDataInLS('sender.fname', newValue)} />
              <Field name="sender.lname" type="text" component={renderField} label="שם משפחה של המעדכן" onBlur={(event, newValue, previousValue) => this.saveDataInLS('sender.lname', newValue)} />
              <Field name="sender.email" type="email" component={renderField} label='דוא"ל' onBlur={(event, newValue, previousValue) => this.saveDataInLS('sender.email', newValue)} />
              <Field name="sender.is_agreed_to_receive_data" component={Checkbox} label="אשר לנו לעדכן אותך על חדשות ואפשרויות נוספות במדריך" labelPosition="left" onBlur={(event, newValue, previousValue) => this.saveDataInLS('sender.is_agreed_to_receive_data', newValue)} className="wrapper-checkbox" />
            </div>
          </div>
          {config.searchTabs[this.state.type] === 'businesses' ?
            <CategoriesTree onUpdate={this.updateSelectedCategories} initialValues={this.props.initialValues.categories} /> : ''}
          <div className="wrapper-actions">
            <div onClick={this.props.handleClose}><FlatButton label="Cancel changes" labelStyle={{ color: '#b3b3b3', fontSize: 16 }} /></div>
            {config.searchTabs[this.state.type] === 'businesses' ?
              <RaisedButton className="submitBtn" type="submit" label="עדכן פרטי עסק" labelStyle={{ fontSize: 16 }} overlayStyle={{ backgroundColor: 'transparent' }} /> : <RaisedButton className="submitBtn" type="submit" label="עדכן פרטים " labelStyle={{ fontSize: 16 }} overlayStyle={{ backgroundColor: 'transparent' }} />
            }
          </div>
        </form>
      </Dialog>
    );
  }
};

DetailsForm.propTypes = {
  handleSubmit: PropTypes.func,
  loadData: PropTypes.func,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  adminUpdate: PropTypes.bool,
  cleanData: PropTypes.func,
};

export function mapStateToProps(state) {
  if (state.detailsForm && state.detailsForm.data && state.detailsForm.data.sender) {
    state.detailsForm.data.sender.is_agreed_to_receive_data = true;
  }
  return {
    initialValues: state.detailsForm.data,
    detailsValues: state.form.details ? state.form.details.values : null
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    loadData: (id, adminUpdate) => {
      const requestURL = (adminUpdate) ? `${config.apiRoot}requests/${id}` : `${config.apiRoot}records/${id}`;
      try {
        const options = {
          method: 'get',
          headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('token'),
          },
        };
        request(requestURL, options).then((res) => {
          let tmp = (adminUpdate) ? res.data : res;
          tmp._id = res._id;
          tmp.phone = getPhone(tmp.phone)[0];
          tmp.phone_2 = getPhone(tmp.phone_2)[0];
          tmp.listing_type_1 = (tmp.listing_type_1 === 3) ? 2 : tmp.listing_type_1;
          dispatch(receiveData(tmp));
        });
      } catch (err) {
        console.log(err);
      }
    },
    cleanData: () => {
      dispatch(cleanData());
    },
    changeFieldValue: function (data, type) {
      let field, value;
      if (type === 2) {
        field = 'last_name';
        value = data.business_name;
        data.last_name = data.business_name;
        data.first_name = '';
        dispatch(change('details', 'business_name', ''))

      }
      else {
        field = 'business_name';
        value = data.first_name + ' ' + data.last_name;
        data.business_name = data.last_name ? data.first_name + ' ' + data.last_name : '';
      }
      dispatch(receiveData(data));
      dispatch(change('details', field, value))
    }
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
  let errorFields = getErrorFieldNames(errors);
  let flag = false;
  if (!errorFields.length) {
    errorFields = getErrorFieldNames(errors.sender);
    flag = true;
  }
  // Using breakable for loop
  for (let i = 0; i < errorFields.length; i++) {
    let fieldName;
    if (flag)
      fieldName = `sender.${errorFields[i]}`;
    else fieldName = `${errorFields[i]}`;
    if (document.querySelectorAll(`[name="${fieldName}"]`).length) {
      document.getElementsByName(`${fieldName}`)[0].focus()
      break;
    }
  }
}

DetailsForm = reduxForm({
  form: 'details',
  enableReinitialize: true,
  onSubmitFail: (errors) => scrollToFirstError(errors),
  validate,
})(DetailsForm);

DetailsForm = connect(
  mapStateToProps, mapDispatchToProps
)(DetailsForm);

export default { DetailsForm }.DetailsForm;
