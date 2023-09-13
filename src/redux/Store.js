import {configureStore} from '@reduxjs/toolkit';

const initialState = {
  jwt: '',
  isLogged: false,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {...state, jwt: action.payload, isLogged: true};
    case 'LOGOUT':
      return {...state, jwt: '', isLogged: false};
    default:
      return {...state};
  }
};

const store = configureStore({
  reducer,
});
export default store;
