import { createStore, applyMiddleware, compose } from 'redux';
import fetchMiddleware from './middlewares/fetchMiddleware';
import reducers from './modules';

const middlewares = [
  fetchMiddleware,
];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers, /* preloadedState, */
  composeEnhancers(applyMiddleware(...middlewares))
);

export default store;