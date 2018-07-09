const validate = (values) => {
  const errors = { sender: {} };
  if (!values.sender) {
    errors.sender.fname = 'Required';
    errors.sender.lname = 'Required';
    errors.sender.email = 'Required';
  } else {
    if (!values.sender.fname) {
      errors.sender.fname = 'Required';
    } else if (values.sender && values.sender.fname.length > 15) {
      errors.sender.fname = 'Must be 15 characters or less';
    }
    if (!values.sender.lname) {
      errors.sender.lname = 'Required';
    } else if (values.sender.lname.length > 15) {
      errors.sender.lname = 'Must be 15 characters or less';
    }
    if (!values.sender.email) {
      errors.sender.email = 'Required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.sender.email)) {
      errors.sender.email = 'Invalid email address';
    }
  }
  // if (!values.address_street_name) {
  //   errors.address_street_name = 'Required';
  // }
  // if (!values.address_street_number) {
  //   errors.address_street_number = 'Required';
  // }
    if (!values.business_name) {
      errors.business_name = 'Required';
    }
    if (!values.first_name ) {
      errors.first_name = 'Required';
    }
    if (!values.last_name ) {
      errors.first_name = 'Required';
    }
  return errors;
};

export default validate;
