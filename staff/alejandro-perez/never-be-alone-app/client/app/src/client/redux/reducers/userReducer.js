import {
  FETCH_USER_SUCCESS,
  UPDATE_USER_ERROR
} from '../actions/types';

const initialState = {
  user: {},
  error: '',
  success: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_SUCCESS:
    return {
        user: action.payload,
        error: '',
        success: ''
    };
    case UPDATE_USER_ERROR:
    return {
        user: state.user,
        error: '',
        success: ''
    };
    default:
    return {
        user: state.user,
        error: '',
        success: ''
    };
  }
};