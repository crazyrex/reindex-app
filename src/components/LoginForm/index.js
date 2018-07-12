import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import RaisedButton from 'material-ui/RaisedButton';
import {
  TextField,
} from 'redux-form-material-ui';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
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

const LoginForm = (props) => (
  <form onSubmit={props.handleSubmit}>
    <Field name="email" type="email" component={renderField} label="email" />
    <Field name="password" type="password" component={renderField} label="password" />
    <div><RaisedButton type="submit" label="login" /></div>
  </form>
);

LoginForm.propTypes = {
  handleSubmit: PropTypes.func,
};

export default reduxForm({
  form: 'login',
})(LoginForm);
