import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import Button from '@material-ui/core/Button';
import {
  TextField,
} from 'redux-form-material-ui';

const renderField = ({ input, type, label, meta: { touched, error } }) => (
  <div>
    <TextField
      hintText={label}
      type={type}
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
  type: PropTypes.string,
};

const RegisterForm = (props) => (
  <form onSubmit={props.handleSubmit}>
    <Field name="email" type="email" component={renderField} label="email" />
    <Field name="firstName" type="text" component={renderField} label="fiest name" />
    <Field name="lastName" type="text" component={renderField} label="last name" />
    <Field name="password" type="password" component={renderField} label="password" />
    <div><Button variant="contained" type="submit" >register</Button></div>
  </form>
);

RegisterForm.propTypes = {
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'register',
})(RegisterForm);
