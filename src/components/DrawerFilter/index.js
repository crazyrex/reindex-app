import React from 'react';
import PropTypes from 'prop-types';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import FilterListIcon from 'material-ui/svg-icons/content/filter-list';
import Filters from 'components/Filters';
import config from 'ReindexConfig';

import './DrawerFilter.scss';
let translate;
if (config.lang == "he")
  translate = require('globalTranslateHE.json');
else
  translate = require('globalTranslate.json');
class DrawerFilter extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div className={`drawer-filter ${this.state.open ? 'active' : ''}`}>
       <div className={`wrapper-filterBtn ${this.state.open ? 'open' : ''}`} onClick={this.handleToggle}>
          {this.state.open ? <IconButton><CloseIcon /></IconButton> : <IconButton><FilterListIcon /></IconButton> }
          <span>{this.state.open ? `${translate.close}` : `${translate.filter}`}</span>
        </div>
        <Drawer
          docked={false}
          width={275}
          overlayClassName="overlay"
          containerClassName="container"
          open={this.state.open}
          openSecondary
          onRequestChange={(open) => this.setState({ open })}
        >
          <Filters onNewRequest={this.props.onNewRequest} pageState={this.props.pageState} location={this.props.location}/>
        </Drawer>
      </div>
    );
  }
}

DrawerFilter.propTypes = {
  onNewRequest: PropTypes.func,
  pageState: PropTypes.string,
};

export default DrawerFilter;
