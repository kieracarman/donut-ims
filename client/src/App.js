import React from 'react';
import {BrowserRouter as Router, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import List from "./components/modify-list"
import Manage from "./components/manage-items"

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
         </ul>
        </div>
      </nav>
      <Route path="/" exact component={List} />
      <Route path="/manage/" component={Manage} />
    </Router>
  );
}

export default App;
