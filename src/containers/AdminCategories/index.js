/*
 * ChildrenData
 *
 * List all the features
 */
import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import CategoriesTree from 'components/CategoriesTree';
import { closeActionResponseAlert } from './actions';

import './AdminCategories.scss';

export class AdminCategories extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.updateSelectedCategories = this.updateSelectedCategories.bind(this);
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      browserHistory.push('/auth/login');
    }
  }



  updateSelectedCategories(categories) {
  }

  render() {
    return (
      <div className="admin-categories full-height-container">
        <CategoriesTree src="admin" onUpdate={this.updateSelectedCategories} />
        <Snackbar
          open={this.props.actionResponseAlert.open}
          message={this.props.actionResponseAlert.text}
          autoHideDuration={4000}
          onRequestClose={this.props.closeActionResponseAlert}
        />
      </div>
    );
  }
}


AdminCategories.propTypes = {
  actionResponseAlert: React.PropTypes.object,
  closeActionResponseAlert: React.PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    actionResponseAlert: state.adminCategories.actionResponseAlert,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    closeActionResponseAlert: () => {
      dispatch(closeActionResponseAlert());
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AdminCategories);
