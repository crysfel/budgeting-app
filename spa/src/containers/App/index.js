import React, { Component } from 'react';
import { Router } from "@reach/router";
import Home from '../../pages/Home';
import Dashboard from '../../pages/Dashboard';
import Auth from '../../pages/Auth';
// import styles from './styles.module.scss';

class App extends Component {
  render() {
    return <Router>
        <Home path="/" />
        <Dashboard path="/dashboard" />
        <Auth path="/auth" />
      </Router>;
  }
}

export default App;
