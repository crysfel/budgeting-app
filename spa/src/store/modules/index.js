import { combineReducers } from 'redux';
import app from './app/reducer';
import auth from './auth/reducer';
import transactions from './transactions/reducer';

export default combineReducers({
  app,
  auth,
  transactions,
});
