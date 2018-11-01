import React, { useEffect } from 'react';
import { Router } from "@reach/router";
import { StoreProvider } from 'redux-react-hook';

import { bootstrap } from 'store/modules/auth/actions';

import Home from 'pages/Home';
import Dashboard from 'pages/Dashboard';
import TransactionAdd from 'pages/Transactions/Add';
import Login from 'pages/Auth/Login';
import SignUp from 'pages/Auth/SignUp';
import Main from 'containers/Layouts/Main';
import Full from 'containers/Layouts/Full';
import store from 'store';

export default function App() {
  useEffect(() => {
    store.dispatch(bootstrap());
  });

  return (
    <StoreProvider value={store}>
      <Router>
        <Home path="/" />
        <Main path="/app">
          <Dashboard path="dashboard" />
          <TransactionAdd path="transactions/add/expense" isExpense />
          <TransactionAdd path="transactions/add/income" isExpense={false} />
        </Main>
        <Full path="/auth">
          <Login path="login" />
          <SignUp path="signup" />
        </Full>
      </Router>
    </StoreProvider>
  );
}
