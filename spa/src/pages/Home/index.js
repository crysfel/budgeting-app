import React, { Fragment } from 'react';
import { Link } from "@reach/router";

export default function Home() {
  return (
    <Fragment>
      <h1 className="text-grey-lighter mb-8">Home</h1>
      <Link to="/">Home</Link> |{" "}
      <Link to="/app/dashboard">Dashboard</Link>  |{" "}
      <Link to="/auth/login">Login</Link> |{" "}
      <Link to="/auth/signup">Sign up</Link>
    </Fragment>
  );
}
