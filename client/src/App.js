import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import Update from "./components/update"
import Manage from "./components/manage"
import Order from "./components/order"

// Import logo
import logo from "./Logo.png"

function App() {
  return (
    <Router>
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
      <Route path="/" exact component={Update} />
      <Route path="/manage/" component={Manage} />
      <Route path="/order/" component={Order} />
    </Router>
  );
}

export default App;
