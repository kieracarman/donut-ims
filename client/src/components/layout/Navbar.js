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
      <div className='cd-navbar bg-dark'>
        <Link to='/'><img src={logo} width='30' height='30' alt='Logo' /></Link>
        <Link to='/'>One Ring Donuts IMS</Link>
        <div>
          <ul>
            <li>
              <Link to='/'>Inventory</Link>
            </li>
            <li>
              <Link to='/manage'>Manage Items</Link>
            </li>
            <li>
              <Link to='/order'>Order Restock</Link>
            </li>
          </ul>
          <ul>
            <li>
              <Link to='/logout' onClick={this.onLogoutClick}>Logout</Link>
            </li>
          </ul>
        </div>
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
