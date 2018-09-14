import {
  FETCH_GROUP_SUCCESS,
  FETCH_GROUP_ERROR,
  JOIN_GROUP_SUCCESS,
  LEAVE_GROUP_SUCCESS,
  ADD_EVENT_SUCCESS,
  ACCEPT_MEMBER_SUCCESS,
  REJECT_MEMBER_SUCCESS,
  KICK_MEMBER_SUCCESS,
  UPDATE_ROLE_SUCCESS,
  CREATE_GROUP_SUCCESS
} from '../actions/types';

const initialState = {
  group: {},
  error: '',
  success: ''
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_GROUP_SUCCESS:
    return {
        group: action.payload,
        error: '',
        success: ''
    };
    case FETCH_GROUP_ERROR:
    return {
        group: state.group,
        error: '',
        success: ''
    };
    case JOIN_GROUP_SUCCESS:
    return {
        group: {data:{...state.group.data,pendings:[...action.payload.data.pendings]},status:action.payload.status},
        error: '',
        success: ''
    };
    case LEAVE_GROUP_SUCCESS:
    return {
        group: {data:{...state.group.data,users:[...action.payload.users]}},
        error: '',
        success: ''
    };
    case ADD_EVENT_SUCCESS:
    return {
        group: {data:{...state.group.data,events:[...action.payload.events]}},
        error: '',
        success: ''
    };
    case ACCEPT_MEMBER_SUCCESS:
    return {
        group: {data:{...state.group.data,users:[...action.payload.users],pendings:[...action.payload.pendings]}},
        error: '',
        success: ''
    };
    case REJECT_MEMBER_SUCCESS:
    return {
        group: {data:{...state.group.data,pendings:[...action.payload.pendings]}},
        error: '',
        success: ''
    };
    case KICK_MEMBER_SUCCESS:
    return {
        group: {data:{...state.group.data,users:[...action.payload.users]}},
        error: '',
        success: ''
    };
    case UPDATE_ROLE_SUCCESS:
    return {
        group: {data:{...state.group.data,users:[...action.payload.users]}},
        error: '',
        success: ''
    };
    case CREATE_GROUP_SUCCESS:
    return {
        ...state
    };
    default:
    return {
        group: state.group,
        error: '',
        success: ''
    };
  }
};