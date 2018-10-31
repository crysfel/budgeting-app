import React, { Fragment } from 'react';
import { Link } from "@reach/router";
import styles from './Login.module.scss';

export default function Login() {
  return (
    <div className="bg-white p-8 border-t-4 border-orange">
      <h1>Login</h1>
      <div className="my-4">
        <label className="mb-2 block text-grey-darkest">Email</label>
        <input type="email" placeholder="user@example.com" className={`${styles.input} p-2 bg-grey-lightest text-grey-darkest border-2 border-grey-light`} />
      </div>
      <div className="my-4">
        <label className="mb-2 block text-grey-darkest">Password</label>
        <input type="password" placeholder="Secret password" className={`${styles.input} p-2 bg-grey-lightest text-grey-darkest border-2 border-grey-light`} />
      </div>
      <button className="py-2 px-4 bg-orange text-white">Submit</button>
    </div>
  );
}
