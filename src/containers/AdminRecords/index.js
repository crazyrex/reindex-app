import React from 'react';
import { connect } from 'react-redux';
import UploadFile from 'rc-upload';
import Snackbar from 'material-ui/Snackbar';
import config from 'ReindexConfig';
import FlatButton from 'material-ui/FlatButton';

import './AdminRecords.scss';

export class AdminRecords extends React.PureComponent {

  constructor(props) {
    super(props);
    this.fields = ['id', 'title', 'description', 'tags', 'locationString', 'locationPoints'];
    const initialState = {
      uploaderProps: {}
    };
    this.fields.map(field => (initialState[field] = ''));
    this.state = initialState;
  }

  inputChange = (event) => {
    this.setState({ [event.target.name]: event.target.value }, () => {
      this.handleChange();
    });
  }

  handleChange = () => {
    let str = '';
    this.fields.map(el => (str += `${el}=${this.state[el]}&`));

    const uploaderProps = {
      action: `${config.apiRoot}import/records?${str}`,
      headers: { Authorization: localStorage.getItem('token') },

      beforeUpload(file) {
        console.log('beforeUpload', file.name);
      },

      onStart: (file) => {
        console.log('onStart', file.name);
        // this.refs.inner.abort(file);
      },
      onSuccess(file) {
        console.log('onSuccess', file);
      },
      onProgress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      onError(err) {
        console.log('onError', err);
      },
    };

    this.setState({ uploaderProps });
  }

  render() {
    return (
      <div className="admin-records full-height-container">
        <div>
        {this.fields.map((field, key) => (
          <div key={key}>
            <div className="field-label">{field}:</div>
            <input type="text" value={this.state[field]} placeholder={`your ${field} field`} name={field} onChange={this.inputChange} />
          </div>
        ))}
          <UploadFile {...this.state.uploaderProps} disabled={!this.state.uploaderProps.action}>
            <a>
              <FlatButton label={'Upload Records CSV File'} disabled={!this.state.uploaderProps.action} />
            </a>
          </UploadFile>
        </div>
      </div>
    );
  }
}


AdminRecords.propTypes = {
  // actionResponseAlert: React.PropTypes.object,
  // closeActionResponseAlert: React.PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    // actionResponseAlert: state.AdminRecords.actionResponseAlert,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    // closeActionResponseAlert: () => {
    //   dispatch(closeActionResponseAlert());
    // },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminRecords);
