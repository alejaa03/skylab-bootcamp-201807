import { FETCH_EVENT_SUCCESS, ATTEND_EVENT_SUCCESS } from "./../actions/types";

const initialState = {
  event: {},
  error: "",
  success: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case FETCH_EVENT_SUCCESS:
    return {
        event: action.payload.data,
        error: '',
        success: ''
    };
    case ATTEND_EVENT_SUCCESS:
    return {
        event: action.payload.data,
        error: '',
        success: ''
    };
    default:
      return {
        event: state.event,
        error: "",
        success: ""
      };
  }
};