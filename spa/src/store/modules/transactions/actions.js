import generateActions from 'utils/actions';

export const GET_LATEST_TRANSACTIONS = generateActions('transactions/GET_LATEST_TRANSACTIONS');
export const GET_POPULAR_TAGS = generateActions('transactions/GET_POPULAR_TAGS');
export const GET_TOTALS = generateActions('transactions/GET_TOTALS');
export const GET_TOTALS_BY_DAY = generateActions('transactions/GET_TOTALS_BY_DAY');
export const GET_TOTALS_BY_TAGS = generateActions('transactions/GET_TOTALS_BY_TAGS');
export const SAVE_TRANSACTION = generateActions('transactions/SAVE_TRANSACTION');

export const SET_ACTIVE_TRANSACTION = 'transactions/SET_ACTIVE_TRANSACTION';

/**
 * Creates a new transaction
 * @param {Object} data 
 */
export function postTransaction(data) {
  return {
    types: SAVE_TRANSACTION,
    promise: {
      url: '/transactions',
      method: 'post',
      data,
    },
  };
}

/**
 * Updates an existing transaction
 * @param {Object} data 
 */
export function putTransaction(data) {
  return {
    types: SAVE_TRANSACTION,
    promise: {
      url: `/transactions/${data.id}`,
      method: 'put',
      data,
    },
  };
}

/**
 * Get the latest transactions for the current user
 */
export function getLatestTransactions() {
  return {
    types: GET_LATEST_TRANSACTIONS,
    promise: {
      url: '/transactions',
    },
  };
}

/**
 * Get the current's months totals
 */
export function getTotals() {
  return {
    types: GET_TOTALS,
    promise: {
      url: '/transactions/totals',
    },
  };
}

/**
 * Get the current's months totals
 */
export function getTotalsByDay() {
  return {
    types: GET_TOTALS_BY_DAY,
    promise: {
      url: '/dashboard/grouped',
    },
  };
}

/**
 * Get the current's months totals
 */
export function getTotalsByTags() {
  return {
    types: GET_TOTALS_BY_TAGS,
    promise: {
      url: '/dashboard/categories',
    },
  };
}

/**
 * Get the most used tags for the current user
 */
export function getPopularTags() {
  return {
    types: GET_POPULAR_TAGS,
    promise: {
      url: '/tags/popular',
      data: { namespace: 'App\\Transaction' },
    },
  };
}

/**
 * Set the active transaction to edit in the form
 * @param {Object} transaction 
 */
export function setActiveTransaction(transaction) {
  return {
    type: SET_ACTIVE_TRANSACTION,
    payload: {
      transaction: {
        ...transaction,
        amount: `${transaction.amount}`,
        tags: transaction.tags.join(','),
      },
    },
  };
}

/**
 * Refreshes the dashbaord widgets all at once!
 */
export function refreshDashboard() {
  return (dispatch) => {
    return Promise.all([
      dispatch(getLatestTransactions()),
      dispatch(getTotalsByTags()),
      dispatch(getTotalsByDay()),
      dispatch(getTotals()),
    ]);
  };
}