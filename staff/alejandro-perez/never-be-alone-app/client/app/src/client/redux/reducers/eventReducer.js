import { FETCH_EVENTS_SUCCESS } from "./../actions/types";

const initialState = {
  events: [],
  error: "",
  success: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    
    case FETCH_EVENTS_SUCCESS:
    return {
        events: action.payload,
        error: '',
        success: ''
    };
    default:
      return {
        events: state.events,
        error: "",
        success: ""
      };
  }
};
