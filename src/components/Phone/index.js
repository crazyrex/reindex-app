import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { detectmob, getPhone } from 'utils/functions';
import FlatButton from 'material-ui/FlatButton';
import Popover from 'material-ui/Popover';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PhoneIcon from 'material-ui/svg-icons/communication/call';
import CloseIcon from 'material-ui/svg-icons/navigation/close';




import './Phone.scss';

class PhoneView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      openPopUpPhone: false,
      anchorOrigin: {
        horizontal: 'left',
        vertical: 'bottom',
      },
      targetOrigin: {
        horizontal: 'left',
        vertical: 'top',
      },
    };
  }



  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }
  openPopUpPhone = (val) => {
    if (this.state.isVirtual) {
      window.dataLayer.push({
        'event': 'clickPhone',
        'cardname': this.props.cardName
      });
      this.setState({
        openPopUpPhone: true,
        currentPhone: val,
      })
    }

  }
  handleModalClose = () => {
    this.setState({ openPopUpPhone: false });
  };
  handleMouseLeave = (event) => {
    this.setState({
      open: false,
    });
  }


  render() {
    return <div>
      <div>
        {!this.props.detectmob ?
          this.props.data.map((val, key) => {
            return <div onMouseEnter={this.showPopover} onClick={this.handleMouseLeave} key={key}  ><div className="phone" >{val}&nbsp;&nbsp;</div>  </div>
          }) : (!this.props.isVirtual && this.props.footer ? <div><a href={`tel:${this.props.data}`} style={{ "display": "block" }}></a></div> : this.props.data.map((val, key) => {
            return <span key={key} className="phone" onClick={() => this.openPopUpPhone(val)} >{val}&nbsp;&nbsp;</span>
          }))}
      </div>
      <Popover
        className="popover"
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ "horizontal": "middle", "vertical": "top" }}
        targetOrigin={{ "horizontal": "middle", "vertical": "bottom" }}
        onRequestClose={this.handleRequestClose}
      >
      </Popover>
      <Dialog
        title={<div><IconButton onClick={this.handleModalClose}><CloseIcon /></IconButton></div>}
        modal={false}
        autoScrollBodyContent
        open={this.state.openPopUpPhone}
        onRequestClose={this.handleModalClose}
        titleClassName="title"
        contentClassName="dialog-phone"
        bodyStyle={{ padding: '0', 'borderRadius': '20px' }}
      >
        <div className="number">{this.state.currentPhone}</div>
        <div className="text">This is a link number: a digital system for directing calls from the site to the business, in accordance <a href='/terms' target="_blank"> to site policies.</a></div>
        <a href={`tel:${this.state.currentPhone}`} className="wrapper-in-dialog">התקשר
            <IconButton className="icon-phone" ><PhoneIcon /></IconButton>
        </a>

      </Dialog>
    </div>
  }
}


class Phone extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detectmob: detectmob(),
      open: false,
      openPopUpPhone: false
    }

  }

  openPopUpPhone = () => {
    window.dataLayer.push({
      'event': 'clickPhone',
      'cardname': this.props.cardName
    });
    this.setState({
      openPopUpPhone: true,
    })
  }



  handleModalClose = () => {
    this.setState({ openPopUpPhone: false });
  };


  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  }



  render() {
    return (
      <div className="phone-container" onClick={this.showPopover}>
        <PhoneView detectmob={this.state.detectmob} footer={this.props.footer} cardName={this.props.data.business_name} isVirtual={false} data={getPhone([this.props.data.phone, this.props.data.phone_2], this.props.data.virtual_number)} />
        <div>
          {/* {getPhone(this.props.data.phone_2 || this.props.data.phone) ?
            <div><FlatButton className="show-phone-btn" disabled={this.state.disabled} labelStyle={{ paddingRight: 20, paddingLeft: 20, fontSize: 16 }} label="הצג מספר טלפון" /></div> : ''} */}
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ "horizontal": "middle", "vertical": "top" }}
          targetOrigin={{ "horizontal": "middle", "vertical": "bottom" }}
        >
        </Popover>
        <Dialog
          title={<div><IconButton onClick={this.handleModalClose}><CloseIcon /></IconButton></div>}
          modal={false}
          autoScrollBodyContent
          open={this.state.openPopUpPhone}
          onRequestClose={this.handleModalClose}
          titleClassName="title"
          contentClassName="dialog-phone"
          bodyStyle={{ padding: '0', 'borderRadius': '20px' }}
        >

        </Dialog>
      </div>
    );
  }
}

Phone.propTypes = {
  data: PropTypes.object,
};




export default Phone;
