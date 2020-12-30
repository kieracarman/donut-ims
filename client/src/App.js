import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import { Provider } from 'react-redux';
import store from './store';

import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Update from "./components/inventory/update";
import Manage from "./components/inventory/manage";
import Order from "./components/inventory/order";
import PrivateRoute from "./components/private-route/PrivateRoute";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Decode token and get user info and exp
  const decoded = jwt_decode(token);

  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Route exact path='/login' component={Login} />
            <PrivateRoute path="/" component={Navbar} />
            <PrivateRoute path="/" exact component={Update} />
            <PrivateRoute path="/manage/" component={Manage} />
            <PrivateRoute path="/order/" component={Order} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
