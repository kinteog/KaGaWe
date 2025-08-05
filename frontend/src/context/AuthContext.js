import { createContext, useEffect, useReducer } from 'react';

// Initial state
const initial_state = {
  user: localStorage.getItem('user') !== 'undefined'
    ? JSON.parse(localStorage.getItem('user'))
    : null,
  loading: false,
  error: null
};

// Create Context
export const AuthContext = createContext(initial_state);

// Reducer
const AuthReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        loading: true,
        error: null
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        loading: false,
        error: null
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        loading: false,
        error: action.payload
      };
    case 'REGISTER_SUCCESS':
      return {
        user: null,
        loading: false,
        error: null
      };
    case 'LOGOUT':
      return {
        user: null,
        loading: false,
        error: null
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload // only update changed fields
        }
      };
    default:
      return state;
  }
};

// Context Provider
export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initial_state);

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
