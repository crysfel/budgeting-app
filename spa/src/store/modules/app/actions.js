import { getCookie } from 'utils/cookies';
import { loadCurrentUser, setToken } from '../auth/actions';
import { getLatestTransactions, getTotals, getTotalsByDay, getTotalsByTags } from '../transactions/actions';
import Config from 'config';

export const SET_APP_UPDATED = 'app/SET_APP_UPDATED';

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
      dispatch(getTotals());
      dispatch(getTotalsByDay());
      dispatch(getTotalsByTags());
    }
  };
}

/**
 * Set the updated as true
 */
export function setAppUpdated() {
  return {
    type: SET_APP_UPDATED,
  };
}