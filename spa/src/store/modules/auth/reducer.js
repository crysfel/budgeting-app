import { LOGIN } from './actions';

const initialState = {
  /**
   * The JWT token
   */
  token: undefined,

  /**
   * The current user's information
   */
  user: undefined
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case LOGIN.SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    default:
      return state;
  }
}
