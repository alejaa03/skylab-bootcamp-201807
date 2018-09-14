import { combineReducers } from 'redux';

import authReducer from './authReducer';
import userReducer from './userReducer';
import groupReducer from './groupReducer';
import eventReducer from './eventReducer'
import singleEventReducer from './singleEventReducer';
import alertReducer from './alertReducer';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
  alert:alertReducer,
  auth:authReducer,
  form: formReducer,
  user: userReducer,
  group: groupReducer,
  event: eventReducer,
  singleEvent: singleEventReducer
})