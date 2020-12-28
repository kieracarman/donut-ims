import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import logo from "../../Logo.png";

class Navbar extends Component {
  render() {
    return (
      <div className='navbar-fixed'>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark" style={{marginBottom: "20px"}}>
          <Link to="/" className="navbar-brand"><img src={logo} width="30" height="30" alt="Logo" /></Link>
          <Link to="/" className="navbar-brand">One Ring Donuts IMS</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
             <li className="navbar-item">
                <Link to="/" className="nav-link">Inventory</Link>
              </li>
              <li className="navbar-item">
                <Link to="/manage" className="nav-link">Manage Items</Link>
              </li>
              <li className="navbar-item">
                <Link to="/order" className="nav-link">Order Restock</Link>
              </li>
           </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navbar;
