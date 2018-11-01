import React from 'react';
import { Link } from "@reach/router";
import { useMappedState } from 'redux-react-hook';

import Full from 'containers//Layouts/Full';
import Login from 'pages/Auth/Login';

const mapState = state => ({
  isAuthenticated: !!state.auth.token,
})

export default function Main({ children }) {
  const { isAuthenticated } = useMappedState(mapState);

  if (isAuthenticated) {
    return (
      <div className="h-screen flex flex-col">
        <div className="bg-orange-light flex">
          <Link to="/app/dashboard" className="block text-center no-underline flex-1 p-4 text-sm text-white">Dashboard</Link>
          <Link to="/app/transactions/add/expense" className="block text-center no-underline flex-1 p-4 text-sm text-white">Add Expense</Link>
          <Link to="/app/transactions/add/income" className="block text-center no-underline flex-1 p-4 text-sm text-white">Add Income</Link>
        </div>
        <div className="flex-1 p-4 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <Full>
      <Login />
    </Full>
  );
}
