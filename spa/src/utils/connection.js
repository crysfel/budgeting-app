import Humps from 'humps';

/**
 * Parse the server response to JSON, for success or failure http responses
 */
const parseResponse = (response) => {
  const json = response.text().then((text) => {
    try {
      return JSON.parse(text);
    } catch (error) {
      // In case the response is not JSON
      return {
        statusCode: response.status,
        ...error,
      };
    }
  });

  if (response.status >= 400) {
    // When the server response contains important JSON data for errors
    return json.then(errors => ({
      response: errors,
      endpoint: response.url,
      statusCode: response.status,
    })).then(Promise.reject.bind(Promise));
  }

  return json;
};

/**
 * This function process the error when the server is down or there's not
 * connectivity available. It also process all other errors, but doesn't do anything special for those.
 */
function handleConnectionErrors(error, { method, url }) {
  return Promise.reject({
    ...error,
    statusCode: error.statusCode || 0,
    method,
    url,
  });
}

// Adding the REST methods to Connection object
const methods = ['delete', 'get', 'post', 'put'];

export default class Connection {
  // default option values
  defaults = {
    method: 'GET',
    timeout: 20000,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  // The access token
  token = '';

  constructor() {
    methods.forEach((method) => {
      this[method] = (options) => {
        const opts = {
          ...options,
          method: method.toUpperCase(),
        };

        return this.fetchCall(opts);
      };
    });
  }

  fetchCall(options) {
    // Assign the authorization token if available
    const result = {
      ...this.defaults,
      ...options,
      headers: {
        ...this.defaults.headers,
        ...options.headers,
      },
    };

    if (this.token) {
      result.headers.Authorization = `Bearer ${this.token}`;
    } else {
      delete result.headers.Authorization;
    }

    // Transform params to underscore
    result.data = Humps.decamelizeKeys(result.data);

    // Stringify params
    if (result.method !== 'POST' && result.method !== 'PUT') {
      if (result.method === 'GET' && result.data) {
        const params = Object.keys(result.data).map(name => `${name}=${result.data[name]}`);
        options.url = `${options.url}${params.length > 0 ? `?${params.join('&')}` : ''}`;
      } else {
        result.params = JSON.stringify(result.data);
      }
    } else if (result.form) {
      const form = new FormData();

      Object.keys(result.form).forEach((key) => {
        form.append(key, result.form[key]);
      });

      delete result.form;
      delete result.data;
      delete result.headers['Content-Type'];

      result.body = form;
    } else {
      result.body = JSON.stringify(result.data);
    }

    const conn = fetch(`${options.host}${options.url}`, result);

    // Handle timeout
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject({
          success: false,
          timeout: true,
          message: 'Looks like there is no internet connection',
        });
      }, result.timeout);

      conn.then(
        (res) => {
          clearTimeout(timeoutId);
          resolve(res);
        },
        (err) => {
          clearTimeout(timeoutId);
          reject(err);
        },
      );
    })
    .then(parseResponse)
    .catch(error => handleConnectionErrors(error, { method: result.method, url: options.url }));
  }

  getToken() {
    return this.token;
  }

  setToken(tkn) {
    this.token = tkn;
  }
}