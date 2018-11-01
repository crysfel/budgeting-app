import { getCookie } from 'utils/cookies';
import { loadCurrentUser, setToken } from '../auth/actions';
import { getLatestTransactions } from '../transactions/actions';
import Config from 'config';

/**
 * Bootstrap the APP!! All initial requirements
 * 
 * - Checks if there's a token in the cookie and
 * then loads the user's information.
 * - Load latest transactions if logged in user
 */
export function bootstrap() {
  return (dispatch) => {
    const token = getCookie(Config.cookies.token);

    if (token) {
      dispatch(setToken(token));
      dispatch(loadCurrentUser());
      dispatch(getLatestTransactions());
    }
  };
}