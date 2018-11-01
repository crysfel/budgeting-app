import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'redux-react-hook';

import { login as loginAction } from 'store/modules/auth/actions';

import TextField from 'components/TextField';
import styles from './Login.module.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const login = useCallback(() => dispatch(loginAction(email, password)), [email, password]);

  return (
    <div className="bg-white p-8 border-t-4 border-orange">
      <h1 className="mb-8">Login</h1>
      <TextField
        type="email"
        label="Email"
        placeholder="user@example.com"
        classes={{ input: styles.input }}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        type="password"
        label="Password"
        placeholder="Secret password"
        classes={{ input: styles.input }}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button onClick={login} className="py-2 px-4 bg-orange text-white">Submit</button>
    </div>
  );
}
