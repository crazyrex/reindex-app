/*
 * ChildrenData
 *
 * List all the features
 */
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import HeaderSite from 'components/HeaderSite';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { Link, browserHistory } from 'react-router'
import { push } from 'react-router-redux';
import Button from '@material-ui/core/Button';

import './Admin.scss';

class Admin extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      open: true,
    };
    this.goToHomePage = this.goToHomePage.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      browserHistory.push('/auth/login');
    }
  }

  goToHomePage() {
    browserHistory.push('/');
  }

  render() {
    return (
      <div className="admin full-height-container">
        <Helmet
          title="Admin Page"
          meta={[
            { name: 'description', content: 'Admin page of reindex' },
          ]}
        />
        <HeaderSite logoClicked={this.goToHomePage} />
        <Drawer className="drawer" open={this.state.open}>
          <Link to="/admin/search"><MenuItem className="admin-menu">Search</MenuItem></Link>
          <Link to="/admin/history"><MenuItem className="admin-menu">History</MenuItem></Link>
          <Link to="/admin/categories"><MenuItem className="admin-menu">Categories</MenuItem></Link>
          <Link to="/admin/records"><MenuItem className="admin-menu">Records</MenuItem></Link>
          <Link to="/admin/settings"><MenuItem className="admin-menu">Settings</MenuItem></Link>
          <Link to="/admin/users"><MenuItem className="admin-menu">Users</MenuItem></Link>
          <Link to="/admin/edit"><MenuItem className="admin-menu">Edit</MenuItem></Link>
        </Drawer>
        {this.state.open ?
          <Button className="show-menu" onClick={() => this.setState({ open: false })}>Show menu</Button>
          : <Button className="hide-menu" onClick={() => this.setState({ open: true })}>Hide menu</Button>
        }
        <div className={`children ${!this.state.open ? `close` : ""}`}>{this.props.children}</div>
      </div>
    );
  }
}


Admin.propTypes = {
  children: PropTypes.node,
};

export function mapStateToProps(state) {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    redirect: (location) => {
      dispatch(push(location));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Admin);
