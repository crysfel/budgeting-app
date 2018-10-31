import React, { Fragment } from 'react';
import { Link } from "@reach/router";

export default function Home() {
  return (
    <Fragment>
      <h1>Home</h1>
      <Link to="/">Home</Link> |{" "}
      <Link to="/dashboard">Dashboard</Link>  |{" "}
      <Link to="/auth">Login</Link>
    </Fragment>
  );
}
