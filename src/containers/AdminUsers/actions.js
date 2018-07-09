import {
    LOAD_USERS,
    USERS_LOADED,
    UPDATE_USER,
    USER_UPDATED
  } from './constants';
  
export function loadUsers() {
    return {
        type: LOAD_USERS
    }
}

export function usersLoaded(users) {
   return {
    type: USERS_LOADED,
    users
  }
}

export function updateUser(userId) {
    return {
        type: UPDATE_USER,
        userId
      }
}

export function userUpdated(){
    return {
        type: USER_UPDATED,
    }
}
  
  