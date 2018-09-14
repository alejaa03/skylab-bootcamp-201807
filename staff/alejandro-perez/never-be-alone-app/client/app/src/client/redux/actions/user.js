import logic from '../../../logic'

import {
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  FETCH_ME_SUCCESS,
  FETCH_USER_SUCCESS,
  FETCH_GROUP_SUCCESS,
  FETCH_GROUP_ERROR,
  FETCH_EVENTS_SUCCESS,
  JOIN_GROUP_SUCCESS,
  LEAVE_GROUP_SUCCESS,
  ADD_EVENT_SUCCESS,
  ACCEPT_MEMBER_SUCCESS,
  REJECT_MEMBER_SUCCESS,
  KICK_MEMBER_SUCCESS,
  UPDATE_ROLE_SUCCESS,
  LOGOUT_USER,
  ATTEND_EVENT_SUCCESS,
  FETCH_EVENT_SUCCESS,
  CREATE_GROUP_SUCCESS,
} from './types'

import {alertActions} from './alert'

/**
*
* Registers a user
*
* @param {object}  - all register params
* @param {string} password
*/

export const registerUser = ({name, surname, email, password,photoProfile, history}) => {
  return dispatch => {
      return logic
          .registerUser({ name, surname, email, password,photoProfile })
          .then(() => {
              dispatch({
                  type: REGISTER_USER_SUCCESS
              });
              dispatch(alertActions.clear());

              history.push('/login');
          })
          .catch(error => {
                dispatch(alertActions.error(error.response.data.message))
          });
  };
};

/**
*
* Authenticates a user
*
* @param {string} email
* @param {string} password
*/
export const authUser = (email, password, history, ref, id) => {
  return dispatch => {
      return logic
          .login( email, password )
          .then((data) => {
            dispatch({
                  type: UPDATE_USER_SUCCESS,
                  payload: Promise.resolve().then(() => data)
              })
              .then(() => {
                if (ref === 'group' && id !== '') {
                        history.push(`/group/${id}`);
                } else if(ref === 'event' && id !== '' ){
                        history.push(`/event/${id}`)
                } else {
                    history.push(`/profile/${data.id}`);
                }
              })
          })
          .catch(error => {
            dispatch(alertActions.error(error.response.data.message))
      });
  };
};

export const logout = history => {
    return dispatch => {
        return logic.logout().then(() => {
            dispatch({ type: LOGOUT_USER });
        });
    };
};

/**
 * FETCH USER
 */
export const fetchUser = () => dispatch => {
  return logic
      .getUser()
      .then(user => {
          if(user){
            dispatch({
                type: FETCH_ME_SUCCESS,
                payload: user
            });
          }
      })
      .catch(error => {
          dispatch({
              type: UPDATE_USER_ERROR,
              payload: error
          });
      });
};

export const fetchUserById = (id) => dispatch => {
    return logic
        .getUserById(id)
        .then(user => {
            if(user){
              dispatch({
                  type: FETCH_USER_SUCCESS,
                  payload: user
              });
            }
        })
        .catch(error => {
            dispatch({
                type: UPDATE_USER_ERROR,
                payload: error
            });
        });
  };


export const fetchGroupById = (id) => dispatch => {
    return logic
        .getGroupById(id)
        .then(group => {
            if(group){
              dispatch({
                  type: FETCH_GROUP_SUCCESS,
                  payload: group
              });
            }
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };


export const listEventsByDate = (groupId = undefined,date,userId = undefined) => dispatch => {
    return logic
        .getEventByDate(groupId,date,userId)
        .then(events => {
            if(events){
              dispatch({
                  type: FETCH_EVENTS_SUCCESS,
                  payload: events.data
              });
            }
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };


export const joinGroup = (groupId,userId) => dispatch => {
    return logic
        .joinGroup(groupId,userId)
        .then(group => {
              dispatch({
                  type: JOIN_GROUP_SUCCESS,
                  payload: group
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const leaveGroup = (groupId,userId) => dispatch => {
    return logic
        .leaveGroup(groupId,userId)
        .then(group => {
              dispatch({
                  type: LEAVE_GROUP_SUCCESS,
                  payload: group.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const createEvent = (...args) => dispatch => {
    return logic
        .createEvent(...args)
        .then(group => {
              dispatch({
                  type: ADD_EVENT_SUCCESS,
                  payload: group.data
              })
        }).then(() => dispatch(alertActions.clear()))
        .catch(error => {
            dispatch(alertActions.error(error.message))
        });
  };

export const acceptUser = (targetId,groupId) => dispatch => {
    return logic
        .acceptUser(targetId,groupId)
        .then(group => {
              dispatch({
                  type: ACCEPT_MEMBER_SUCCESS,
                  payload: group.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const rejectUser = (targetId,groupId) => dispatch => {
    return logic
        .rejectUser(targetId,groupId)
        .then(group => {
              dispatch({
                  type: REJECT_MEMBER_SUCCESS,
                  payload: group.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const kickUser = (targetId,groupId) => dispatch => {
    return logic
        .kickUser(targetId,groupId)
        .then(group => {
              dispatch({
                  type: KICK_MEMBER_SUCCESS,
                  payload: group.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const updateRole = (targetId,groupId) => dispatch => {
    return logic
        .updateRole(targetId,groupId)
        .then(group => {
              dispatch({
                  type: UPDATE_ROLE_SUCCESS,
                  payload: group.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const attendEvent = eventId => dispatch => {
    return logic
        .attendEvent(eventId)
        .then(event => {
              dispatch({
                  type: ATTEND_EVENT_SUCCESS,
                  payload: event.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const fetchEventById = eventId => dispatch => {
    return logic
        .fetchEventById(eventId)
        .then(event => {
              dispatch({
                  type: FETCH_EVENT_SUCCESS,
                  payload: event.data
              });
        })
        .catch(error => {
            dispatch({
                type: FETCH_GROUP_ERROR,
                payload: error
            });
        });
  };

export const createGroup = (name,description,history) => dispatch => {
    return logic
        .createGroup(name,description)
        .then(data => {
              dispatch({
                  type: CREATE_GROUP_SUCCESS,
              });
              history.push(`/group/${data.data.data._id}`)
        })
        .catch(error => {
          dispatch(alertActions.error(error.response.data.message))
        });
  };


