import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import 'react-select/dist/react-select.css';
import Select from 'react-select';

import Snackbar from 'material-ui/Snackbar';

import { connect } from 'react-redux';

import { updateScore, closeRecordSettingsAlert ,deleteRecord} from './actions';
import './RecordSettings.scss';

class RecordSettings extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { open: false, scoreValue: [], setVirtual: this.props.record._source.constant_virtual_number };
  }

  handleOpen = () => {
    let score = this.props.record._source.score;
    if (score && score.options.indexOf('top') > -1) {
      score = score.options.map((item) => ({ key: item, name: this.props.scoreObj[item].name }));
    } else score = [];
    this.setState({ open: true, scoreValue: score });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  setVirtual = () => {
    this.setState({
      setVirtual: !this.state.setVirtual,
    })
  }

  updateScore = () => {
    this.handleClose();
    this.props.updateScore(this.state.scoreValue, this.props.record._id, this.state.setVirtual);
  }

  handleSelectChange = (value) => {
    this.setState({ scoreValue: value });
  }
 
  render() {
    const actions = [
      <FlatButton
        label="ביטול"
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="אישור"
        primary
        keyboardFocused
        onTouchTap={this.updateScore}
      />,
    ];
    return (
      <div>
        <RaisedButton label="ערוך" onTouchTap={this.handleOpen} />
        <RaisedButton label="מחק" onTouchTap={() => this.props.deleteRecord(this.props.record._id)} />
        <Dialog
          title="עריכה"
          modal={false}
          open={this.state.open}
          actions={actions}

          onRequestClose={this.handleClose}
        >
          <div className="record-dialog-content">
            <Select
              multi
              name="form-field-name"
              valueKey="key"
              labelKey="name"
              value={this.state.scoreValue}
              placeholder="דרג"
              options={this.props.scoreData}
              onChange={this.handleSelectChange}
            />
          </div>                                                        
          <input type="checkbox" defaultChecked={this.props.record._source.constant_virtual_number || false} placeholder="קבע מספר וירטואלי כקבוע"  onChange={this.setVirtual} />
          <span style={{'margin-right': '14px'}}>קבע מספר וירטואלי כקבוע</span>
        </Dialog>
        <Snackbar
          open={this.props.recordSettingsAlert.open}
          message={this.props.recordSettingsAlert.text}
          autoHideDuration={4000}
          onRequestClose={this.props.closeRecordSettingsAlert}
        />
      </div>
    );
  }
}

RecordSettings.propTypes = {
  updateScore: PropTypes.func,
  scoreData: PropTypes.array,
  record: PropTypes.object,
  scoreObj: PropTypes.object,
  recordSettingsAlert: PropTypes.object,
  closeRecordSettingsAlert: PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    scoreData: state.adminSearch.scoreData,
    scoreObj: state.adminSearch.scoreObj,
    recordSettingsAlert: state.recordSettings.recordSettingsAlert,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    updateScore: (score, id ,setVirtual) => {
      dispatch(updateScore({ id, score, setVirtual }));
    },
    closeRecordSettingsAlert: () => {
      dispatch(closeRecordSettingsAlert());
    },
    deleteRecord: (id) => {
      const approve = confirm('Are you sure you want to move to archives?');
      if (approve) dispatch(deleteRecord(id))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordSettings);
