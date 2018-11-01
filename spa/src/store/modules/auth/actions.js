import generateActions from 'utils/actions';
import { navigate } from '@reach/router';
import { setCookie, getCookie } from 'utils/cookies';
import Config from 'config';

export const LOGIN = generateActions('auth/LOGIN');

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
 * Login the user, creates a cookie with the token
 * and redirects the user to the dashboard.
 */
export function login(email, password) {
  return (dispatch) => {
    dispatch(postLogin(email, password))
      .then((response) => {
        setCookie(Config.cookies.token, response.payload.token);
        navigate('/app/dashboard');
      });
  };
}

/**
 * Load the current user's profile
 */
export function loadCurrentUser() {
  return {

  };
}

/**
 * Checks if there's a token in the cookie and
 * then loads the user's information.
 */
export function bootstrap() {
  return (dispatch) => {
    const token = getCookie(Config.cookies.token);
    
    if (token) {

    }
  };
}
