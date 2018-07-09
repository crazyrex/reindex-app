import React from 'react';
import { Field, reduxForm } from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';
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
  input: React.PropTypes.object,
  label: React.PropTypes.string,
  meta: React.PropTypes.object,
  type: React.PropTypes.string,
};

const RegisterForm = (props) => (
  <form onSubmit={props.handleSubmit}>
    <Field name="email" type="email" component={renderField} label="email" />
    <Field name="firstName" type="text" component={renderField} label="fiest name" />
    <Field name="lastName" type="text" component={renderField} label="last name" />
    <Field name="password" type="password" component={renderField} label="password" />
    <div><RaisedButton type="submit" label="register" /></div>
  </form>
);

RegisterForm.propTypes = {
  handleSubmit: React.PropTypes.func,
};

export default reduxForm({
  form: 'register',
})(RegisterForm);
