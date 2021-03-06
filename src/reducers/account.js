// @flow

import { combineReducers } from 'redux';

function jwt(state: string | null = null, action) {
  switch (action.type) {
    case 'LOG_OUT':
      return null;
    case 'ACCOUNT_UPDATE_TOKEN':
    case 'ACCOUNT_REGISTER':
    case 'ACCOUNT_LOGIN':
      return action.token;
    default:
      return state;
  }
}

export default combineReducers({
  jwt,
});
