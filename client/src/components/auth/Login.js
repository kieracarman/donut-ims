import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';
import classnames from 'classnames';

import logo from '../../Logo.png';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      errors: {}
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to home
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push('/'); // push user to home when they login
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter'
  };

  render() {
    const { errors } = this.state;

    return (
      <div className='bg-dark'>
        <div className='row justify-content-center align-items-center text-center' style={{height: '100vh'}}>
          <div className=''>
            <form noValidate onSubmit={this.onSubmit}>
              <div className='form-group'>
                <img src={logo} width='100' height='100' alt='Logo' />
              </div>
              <div className='form-group'>
                <input
                  autoFocus
                  onChange={this.onChange}
                  value={this.state.username}
                  error={errors.username}
                  id='username'
                  type='username'
                  placeholder='Username'
                  className={classnames('form-control', {
                    invalid: errors.username || errors.usernameNotFound
                  })}
                />
                <span className='text-danger'>
                  {errors.username}
                  {errors.usernameNotFound}
                </span>
              </div>
              <div className='form-group'>
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id='password'
                  type='password'
                  placeholder='Password'
                  className={classnames('form-control', {
                    invalid: errors.password || errors.incorrectPassword
                  })}
                />
                <span className='text-danger'>
                  {errors.password}
                  {errors.incorrectPassword}
                </span>
              </div>
              <button type='submit' className='btn btn-light'>Login</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
