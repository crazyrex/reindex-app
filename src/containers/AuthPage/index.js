import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
 import HeaderSite from 'components/HeaderSite';
 import LoginForm from 'components/LoginForm';
 import RegisterForm from 'components/RegisterForm';
import { browserHistory } from 'react-router';
import { login, register } from './actions';
import './AuthPage.scss';

export class AuthPage extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.loggedIn) {
      browserHistory.push('/admin');
    }
  }

  render() {
    if (this.props.loggedIn) {
      browserHistory.push('/admin');
    }
    return (
      <div>
        <Helmet
          title="Feature Page"
          meta={[
            { name: 'description', content: 'Feature page of React.js Boilerplate application' },
          ]}
        />
        {/* <HeaderSite logoClicked={this.props.changeState} /> */}
        <div className="wrapper-form">
          {this.props.routeParams.loginType === 'register' ?
            <RegisterForm onSubmit={this.props.register} />
            : <LoginForm onSubmit={this.props.login} />
          }
        </div>
      </div>
    );
  }
}


AuthPage.propTypes = {
  changeState: PropTypes.func,
  login: PropTypes.func,
  register: PropTypes.func,
  routeParams: PropTypes.object,
  loggedIn: PropTypes.bool,
  redirect: PropTypes.func,
};

export function mapStateToProps(state) {
  return {
    loggedIn: state.authPage.loggedIn,
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    login: (values) => {
      dispatch(login(values));
    },
    register: (values) => {
      dispatch(register(values));
    },
    redirect: (location) => {
      dispatch(push(location));
    },
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(AuthPage);

