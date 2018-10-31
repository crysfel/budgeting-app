import React, { Fragment } from 'react';
import { Link } from "@reach/router";

export default function Auth() {
  return (
    <Fragment>
      <h1>Auth</h1>
      <Link to="/">Home</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link>  |{" "}
      <Link to="/auth">Login</Link>
    </Fragment>
  );
}
