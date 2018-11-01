import generateActions from 'utils/actions';

export const SAVE_TRANSACTION = generateActions('transactions/SAVE_TRANSACTION');

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

export function saveTransaction(data) {
  return (dispatch) => {
    return dispatch(postTransaction(data));
  };
}