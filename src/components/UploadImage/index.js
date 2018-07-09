import React, { Component } from 'react';
import { connect } from 'react-redux';
import { uploadImage } from './actions';
import UploadFile from 'rc-upload';
import config from 'ReindexConfig';
import FlatButton from 'material-ui/FlatButton';



class UploadImage extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      uploaderProps: ''
    };
  }

  componentDidMount() {
    this.handleChange();    
  }

  handleChange(e) {
    let self = this;
    let uploaderProps = {
        action: `${config.apiRoot}${this.props.url}`,
        beforeUpload(file) {
          console.log('beforeUpload', file.name);
        },
        onStart: (file) => {
          console.log('onStart', file.name);
          // this.refs.inner.abort(file);
        },
        onSuccess(file) {
          console.log('onSuccess', file);
          if(self.props.onSuccess) {
            self.props.onSuccess(`${config.apiUrl}${file}`);
          }
        },
        onProgress(step, file) {
          console.log('onProgress', Math.round(step.percent), file.name);
        },
        onError(err) {
          console.log('onError', err);
        },
      };
      this.setState({
        uploaderProps: uploaderProps
      })
  }

  
  
  render() {
    return (
      <div>
        <UploadFile {...this.state.uploaderProps} >
          <a>
            <FlatButton label='Upload Image' />
          </a>
        </UploadFile>
      </div>
    );
  }
}


export default UploadImage;


  