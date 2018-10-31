import React, { Component } from 'react';
import { Router } from "@reach/router";
import Home from '../../pages/Home';
import Dashboard from '../../pages/Dashboard';
import Login from '../../pages/Auth/Login';
import SignUp from '../../pages/Auth/SignUp';
import Main from '../Layouts/Main';
import Full from '../Layouts/Full';
// import styles from './styles.module.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <Home path="/" />
        <Main path="/app">
          <Dashboard path="dashboard" />
        </Main>
        <Full path="/auth">
          <Login path="login" />
          <SignUp path="signup" />
        </Full>
      </Router>
    );
  }
}

export default App;
