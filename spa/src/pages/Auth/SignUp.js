import React, { useCallback, useState } from 'react';
import { useDispatch } from 'redux-react-hook';
import { Link } from '@reach/router';

import { signup as signupAction } from 'store/modules/auth/actions';

import Button from 'components/Button';
import Panel from 'components/Panel';
import TextField from 'components/TextField';
import styles from './Login.module.scss';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const signup = useCallback(() => dispatch(signupAction(name, email, password)), [name, email, password]);

  return (
    <Panel title="Sign App">
      <TextField
        label="Name"
        placeholder="Your full name"
        classes={{ input: styles.input }}
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
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
      <Button onClick={signup}>Submit</Button>
      <p className="mt-4 text-grey-darker">Already a member? <Link to="/auth/login" className="text-orange">Login</Link></p>
    </Panel>
  );
}
