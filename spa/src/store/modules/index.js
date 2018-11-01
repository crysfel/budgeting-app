import { combineReducers } from 'redux';
import auth from './auth/reducer';
import transactions from './transactions/reducer';

export default combineReducers({
  auth,
  transactions,
});
