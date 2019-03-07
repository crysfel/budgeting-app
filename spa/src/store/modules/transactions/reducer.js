import { GET_LATEST_TRANSACTIONS, GET_TOTALS, GET_TOTALS_BY_DAY, GET_TOTALS_BY_TAGS, GET_POPULAR_TAGS, SET_ACTIVE_TRANSACTION } from './actions';

const initialState = {
  /**
   * Set the transaction to edit
   */
  active: {},

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

  /**
   * Totals grouped by day
   */
  grouped: {
    expenses: [],
    income: [],
  },

  /**
   * Totals grouped by tags
   */
  tags: {
    expenses: [],
    income: [],
    popular: [],
  },
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_LATEST_TRANSACTIONS.SUCCESS:
      return {
        ...state,
        latest: action.payload.transactions,
      };
    case GET_TOTALS_BY_DAY.SUCCESS:
      return {
        ...state,
        grouped: {
          expenses: action.payload.expenses,
          income: action.payload.income,
        },
      };
    case GET_TOTALS.SUCCESS:
      return {
        ...state,
        totals: action.payload.totals,
      };
    case GET_TOTALS_BY_TAGS.SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          expenses: action.payload.expenses,
          income: action.payload.income,
        },
      };
    case GET_POPULAR_TAGS.SUCCESS:
      return {
        ...state,
        tags: {
          ...state.tags,
          popular: action.payload.tags,
        },
      };
    case SET_ACTIVE_TRANSACTION:
      return {
        ...state,
        active: action.payload.transaction,
      };
    default:
      return state;
  }
}