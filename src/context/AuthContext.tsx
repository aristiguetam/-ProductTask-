import { createContext, useReducer, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoginData, LoginResponse, RegisterData, Usuario } from '../interfaces/appInterfaces';
import { AuthState, authReducer } from './authReducer';
import productosApi from '../api/productosApi';

type AuthContextProps = {
  errorMessage: string;
  token: string | null;
  user: Usuario | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  signUp: (registerData: RegisterData) => void;
  signIn: (loginData: LoginData) => void;
  logOut: () => void;
  removeError: () => void;
};

const authInitialState: AuthState = {
  status: 'checking',
  token: null,
  user: null,
  errorMessage: '',
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {

  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    checkToken();
  }, [])

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    //No token, no authenticated 
    if (!token) return dispatch({ type: 'notAuthenticated' });

    //hay token
    const resp = await productosApi.get('/auth');

    if (resp.status !== 200) {
      return dispatch({ type: 'notAuthenticated' });
    }

    await AsyncStorage.setItem('token', token)

    dispatch({
      type: 'signUp',
      payload: {
        token: resp.data.token,
        user: resp.data.usuario
      }
    });

  }

  const signIn = async ({ correo, password }: LoginData) => {

    try {
      const { data: { token, usuario } } = await productosApi.post<LoginResponse>('/auth/login', {
        correo,
        password,
      });

      dispatch({
        type: 'signUp',
        payload: { token, user: usuario }
      });

      await AsyncStorage.setItem('token', token);

    } catch (errors: any) {

      dispatch({
        type: 'addError',
        payload: errors.response.data.msg || 'información incorrecta'
      })

    }
  };

  const signUp = async ({ correo, nombre, password }: RegisterData) => {

    try {
      const { data: { token, usuario } } = await productosApi.post<LoginResponse>('/usuarios', {
        nombre,
        correo,
        password
      })

      dispatch({
        type: 'signUp',
        payload: { token, user: usuario }
      });

      await AsyncStorage.setItem('token', token);

    } catch (error: any) {
            
      dispatch({
        type: 'addError',
        payload: error.response.data.errors[0].msg || 'Revisa la información'
      })
    }
  };

  const logOut = async () => {

    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' })

  };

  const removeError = () => {
    dispatch({ type: 'removeError' })
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        logOut,
        removeError,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
