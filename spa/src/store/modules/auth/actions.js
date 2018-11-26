import generateActions from 'utils/actions';
import { navigate } from '@reach/router';
import { setCookie } from 'utils/cookies';
import Config from 'config';
import { getLatestTransactions, getTotals, getTotalsByDay, getTotalsByTags } from '../transactions/actions';

export const LOGIN = generateActions('auth/LOGIN');
export const LOAD_CURRENT_USER = generateActions('auth/LOAD_CURRENT_USER');
export const SIGNUP = generateActions('auth/SIGNUP');
export const SET_TOKEN = 'auth/SET_TOKEN';

/**
 * Request to the server to validate credentials
 * and receive a token.
 */
export function postLogin(email, password) {
  return {
    types: LOGIN,
    promise: {
      url: '/auth/login',
      method: 'post',
      data: {
        email,
        password
      },
    },
  };
}

/**
 * Creates a new user
 */
export function postSignup(name, email, password) {
  return {
    types: SIGNUP,
    promise: {
      url: '/auth/signup',
      method: 'post',
      data: {
        name,
        email,
        password
      },
    },
  };
}

/**
 * Create a new user, set a cookie with the token
 * and redirects the user to the dashboard.
 */
export function signup(name, email, password) {
  return (dispatch) => {
    dispatch(postSignup(name, email, password))
      .then((response) => {
        if (response.payload.success) {
          setCookie(Config.cookies.token, response.payload.token, 30);
          dispatch(getLatestTransactions());
          dispatch(getTotals());
          navigate('/app/dashboard');
        }
      });
  };
}

/**
 * Login the user, creates a cookie with the token
 * and redirects the user to the dashboard.
 */
export function login(email, password) {
  return (dispatch) => {
    dispatch(postLogin(email, password))
      .then((response) => {
        setCookie(Config.cookies.token, response.payload.token, 30);
        dispatch(getLatestTransactions());
        dispatch(getTotals());
        dispatch(getTotalsByDay());
        dispatch(getTotalsByTags());
        navigate('/app/dashboard');
      });
  };
}

/**
 * Load the current user's profile
 */
export function loadCurrentUser() {
  return {
    types: LOAD_CURRENT_USER,
    promise: {
      url: '/users/current',
    },
  };
}

export function setToken(token) {
  return {
    type: SET_TOKEN,
    payload: {
      token,
    },
  };
}
