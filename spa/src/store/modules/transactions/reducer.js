import { GET_LATEST_TRANSACTIONS, GET_TOTALS } from './actions';

const initialState = {
  /**
   * The latest transactions for the current user
   */
  latest: [],

  /**
   * The totals for the current month
   */
  totals: {
    income: {},
    expense: {},
    current: {},
  },
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_LATEST_TRANSACTIONS.SUCCESS:
      return {
        ...state,
        latest: action.payload.transactions,
      };
    case GET_TOTALS.SUCCESS:
      return {
        ...state,
        totals: action.payload.totals,
      };
    default:
      return state;
  }
}