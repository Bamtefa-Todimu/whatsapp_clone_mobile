// AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { Axios } from 'axios';
import { base_url } from '../constants/server';

const AuthContext = createContext();

const initialState = {
  token: null,
  user: null,
  isLoading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          dispatch({ type: 'SET_TOKEN', payload: token });
        }
      } catch (error) {
        console.error('Error checking token from AsyncStorage:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkToken();
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

    function getCookies(headers)
    {
      const setCookies = [];
    for (const [name, value] of headers) {
          if (name === "set-cookie") {
              setCookies.push(value);
              cookie = JSON.parse(JSON.stringify(value))
              if(cookie[0].split('=')[0] === "XSRF-TOKEN")
              {
                cookie = cookie[0].split('=')[1].split(';')[0]
              }
          }
      }
      return decodeURIComponent(cookie);
    }
      // const csrfResponse = await axios.get(`${base_url}/sanctum/csrf-cookie`, {
      //       headers: {
      //           'content-type': 'application/json',
      //           'accept': 'application/json'
      //       },
      //       withCredentials: true,
      //   })
        // const csrfToken = getCookies(csrfResponse.headers);        
        
      const response = await axios.post(`${base_url}/api/login`,
       ({ email, password:"password" }),
      {
        headers:{
          'content-type':'application/json',
          'accept':'application/json',
        },
        withCredentials:true,
      }
      );

      const token = response.data.data.token

      console.log('TOKENNNN ---> ',token);
      await AsyncStorage.setItem('user_id', response.data.data.user_id.toString());

      await AsyncStorage.setItem('token', token);
      dispatch({ type: 'SET_TOKEN', payload: token });
     
      await getUserDetails(token);
    } catch (error) {
      console.log('Request Details:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Invalid Credentials' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  const register = async (name, email, password, password_confirmation) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await axios.post(`${base_url}/api/register`,
       { name, email, password,password_confirmation },
       {
        headers:{
          'content-type':'application/json',
          'accept':'application/json',
        },
        withCredentials:true,
      }
      );

      const token = response.data.data.token
      await AsyncStorage.setItem('user_id', response.data.data.user_id);

      // dispatch({ type: 'SET_TOKEN', token });
      await AsyncStorage.setItem('token', token);

     
      console.log("register success")
      await getUserDetails(token);

    } catch (error) {
      console.error('Registration failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getUserDetails = async (token) => {
    try {
      const response = await axios.get(`${base_url}/api/user`,{
        headers:{
          'content-type':'application/json',
          'accept':'application/json',
          'authorization': `Bearer ${token}`
        },
        withCredentials:true,
      });
      console.log(response.data);
      
      dispatch({ type: 'SET_USER', payload: response.data.id });
      dispatch({ type: 'SET_TOKEN', token });

    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(`${base_url}/api/logout`,{},{
        headers:{
          'content-type':'application/json',
          'accept':'application/json',
          'authorization':`Bearer ${token}`
        },
        withCredentials:true,
        // withXSRFToken:true
      })
      await AsyncStorage.removeItem('token');

      dispatch({ type: 'SET_TOKEN', payload: null });
      dispatch({ type: 'SET_USER', payload: null });
      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
