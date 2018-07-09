import {
  LOGIN,
  REGISTER,
  AUTH_SUCCESS,
} from './constants';

export function login(user) {
  return {
    type: LOGIN,
    user,
  };
}

export function register(user) {
  return {
    type: REGISTER,
    user,
  };
}

export function authSuccess(user) {
  return {
    type: AUTH_SUCCESS,
    user,
  };
}
