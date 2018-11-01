import Config from 'config';
import Connection from 'utils/connection';

const client = new Connection();

const fetchMiddleware = ({ dispatch, getState }) => next => (action) => {
  if (typeof action === 'function') {
    return action(dispatch, getState);
  }

  const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare

  if (!promise) {
    return next(action);
  }

  const token = getState().auth && getState().auth.token;

  client.setToken(token);
  next({ ...rest, type: types.REQUEST });

  promise.method = (promise.method && promise.method.toLowerCase()) || 'get';
  promise.host = promise.host || Config.api.url;
  const actionPromise = client[promise.method](promise)
    .then(payload => Promise.resolve({
        payload
      })
    );

  actionPromise.then(data => next({ ...rest, ...data, type: types.SUCCESS }))
    .catch((error) => {
      if (Config.environment === 'development') {
        console.error(error); // eslint-disable-line no-console
      }
      next({ ...rest, payload: error.response, type: types.FAIL });
    });

  return actionPromise;
};

export default fetchMiddleware;
