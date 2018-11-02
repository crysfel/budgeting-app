import { SET_APP_UPDATED } from './actions';

const initialState = {
  /**
   * Whether the app has been updated or not
   */
  updated: false,
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case SET_APP_UPDATED:
      return {
        ...state,
        updated: true,
      };
    default:
      return state;
  }
}