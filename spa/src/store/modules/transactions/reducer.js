import { GET_LATEST_TRANSACTIONS } from './actions';

const initialState = {
  /**
   * The latest transactions for the current user
   */
  latest: [],
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case GET_LATEST_TRANSACTIONS.SUCCESS:
      return {
        ...state,
        latest: action.payload.transactions,
      };
    default:
      return state;
  }
}