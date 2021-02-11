import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';

import logo from '../../Logo.png';

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <div>
        <nav className='cd-navbar bg-dark'>
          <div className='cd-navbar-brand'>
            <Link to='/'><img src={logo} width='100%' alt='Logo' /></Link>
            <Link to='/'>IMS</Link>
          </div>
          <div>
            <ul className='cd-navbar-list'>
              <li className='cd-navbar-item'>
                <Link to='/' className='cd-navbar-link'>Inventory</Link>
              </li>
              <li className='cd-navbar-item'>
                <Link to='/manage' className='cd-navbar-link'>Manage Items</Link>
              </li>
              <li className='cd-navbar-item'>
                <Link to='/order' className='cd-navbar-link'>Order Restock</Link>
              </li>
            </ul>
            <ul className='cd-navbar-footer'>
              <li className='cd-navbar-item'>
                <Link to='/logout' className='cd-navbar-link' onClick={this.onLogoutClick}>Logout</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
