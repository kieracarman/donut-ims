import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { List, Edit, Truck, LogOut } from 'react-feather';

import logo from '../../oneringlogo.svg';

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    return (
      <div>
        <nav className='cd-navbar'>
          <div className='cd-navbar-brand'>
            <NavLink to='/'><img src={logo} width='100%' alt='Logo' /></NavLink>
            <NavLink to='/'>IMS</NavLink>
          </div>
          <ul className='cd-navbar-list'>
            <li className='cd-navbar-item'>
              <NavLink exact to='/' className='cd-navbar-link' activeClassName='cd-navbar-link-active'><List className='cd-navbar-link-icon' /><div className='cd-navbar-link-text'>Inventory</div></NavLink>
            </li>
            <li className='cd-navbar-item'>
              <NavLink to='/manage' className='cd-navbar-link' activeClassName='cd-navbar-link-active'><Edit className='cd-navbar-link-icon' /><div className='cd-navbar-link-text'>Manage Items</div></NavLink>
            </li>
            <li className='cd-navbar-item'>
              <NavLink to='/order' className='cd-navbar-link' activeClassName='cd-navbar-link-active'><Truck className='cd-navbar-link-icon' /><div className='cd-navbar-link-text'>Order Restock</div></NavLink>
            </li>
          </ul>
          <ul className='cd-navbar-footer'>
            <li className='cd-navbar-item'>
              <NavLink to='/logout' className='cd-navbar-link' onClick={this.onLogoutClick}><LogOut className='cd-navbar-link-icon' /><div className='cd-navbar-link-text'>Logout</div></NavLink>
            </li>
          </ul>
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
