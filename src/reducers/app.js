// @flow

import { combineReducers } from 'redux';

function alert(state: string = '', action) {
  switch (action.type) {
    case 'SET_ALERT':
      return action.message;
    case 'CLEAR_ALERT':
      return '';
    default:
      return state;
  }
}

function update(state: boolean = false, action) {
  switch (action.type) {
    case 'UPDATE_AVAILABLE':
      return true;
    default:
      return state;
  }
}

function syncing(state: boolean = false, action) {
  switch (action.type) {
    case 'SYNC_FAILED':
    case 'SYNC_SUCCESS':
      return false;
    case 'SYNC':
      return true;
    default:
      return state;
  }
}

export default combineReducers({
  alert,
  update,
  syncing,
});
