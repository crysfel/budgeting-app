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
      <div>
        {children}
      </div>
    );
  }

  return (
    <Full>
      <Login />
    </Full>
  );
}
