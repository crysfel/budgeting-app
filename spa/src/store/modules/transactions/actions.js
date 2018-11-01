import generateActions from 'utils/actions';

export const GET_LATEST_TRANSACTIONS = generateActions('transactions/GET_LATEST_TRANSACTIONS');
export const SAVE_TRANSACTION = generateActions('transactions/SAVE_TRANSACTION');

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