import { LOAD_CURRENT_USER, LOGIN, SET_TOKEN } from './actions';

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
    case LOAD_CURRENT_USER.SUCCESS:
      return {
        ...state,
        user: action.payload.user,
      };
    case LOGIN.SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
      };
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload.token,
      };
    default:
      return state;
  }
}
