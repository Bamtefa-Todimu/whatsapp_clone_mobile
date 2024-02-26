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
          // Fetch user details after setting the token
          await getUserDetails(token);
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

      function getCookie(name) {
        const value = `; ${document.cookie}`;
        console.log(value);
        const parts = value.split(`; ${name}=`);
        console.log(parts);
        if (parts.length === 2) {
            return parts.pop().split(';').shift();
        }
    }
      console.log(email);
      console.log(password);
    //   const csrfResponse = await fetch(`${base_url}/sanctum/csrf-cookie`, {
    //         headers: {
    //             'content-type': 'application/json',
    //             'accept': 'application/json'
    //         },
    //         credentials: 'include'
    //     })
    //     const csrfToken = getCookie('XSRF-TOKEN');
    //     console.log('tokrn --- ',csrfToken);
    //     console.log(csrfResponse);
    // axios.defaults.headers.common['X-CSRF-TOKEN'] = decodeURIComponent('eyJpdiI6IlFOWkN3WnhCU0p2d29YRXNKZGIxSUE9PSIsInZhbHVlIjoib3g4cWhUTWhrSytyTnZvRWdkWk1SeXFSSVU5TzhIWHVEVWplT2xzQ21jQVhpRzFrSUJRLzdMV3JwaHhMZjhFNjUvTnJEc0NoL1M0bkx4QjdhVFRBNU9yL1c0MzUrSklLTFJQRFNObkVrMlBpYTAyOGwyU2pJeEVnbGxiT0Z5VlAiLCJtYWMiOiI5ZTI1ZDBjZDUxOWU2NjYzNzJjNTk4YjRiZjA1MDliZWFhM2NlOTI0OGU3ZWFhNjhiN2NiODRlOTgzYjJkNzYzIiwidGFnIjoiIn0%3D')
        const options  = {
            method:'POST',
            body: JSON.stringify({email:"todimu@example.net",password:"password"}),
        }
        
        // const response  = await fetch(`${base_url}/login`,{
        //     ...options,
        //     headers: {
        //         'content-type': 'application/json',
        //         'accept': 'application/json',
        //         'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        //     },
        //     credentials: 'include',
        // })

        const response = await axios.get(`${base_url}/api/user/1`)

    //    const response =  await fetch(`${base_url}/api/user`, {
    //         headers: {
    //             'content-type': 'application/json',
    //             'accept': 'application/json',
    //             'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
    //         },
    //         credentials: 'include',
    //         ...options,
    //     })


    //   const response = await axios.post(`http://localhost:8000/login`, JSON.stringify({ email, password }),
    //   {
    //     headers:{
    //         'X-CSRF-TOKEN':decodeURIComponent('eyJpdiI6IlFOWkN3WnhCU0p2d29YRXNKZGIxSUE9PSIsInZhbHVlIjoib3g4cWhUTWhrSytyTnZvRWdkWk1SeXFSSVU5TzhIWHVEVWplT2xzQ21jQVhpRzFrSUJRLzdMV3JwaHhMZjhFNjUvTnJEc0NoL1M0bkx4QjdhVFRBNU9yL1c0MzUrSklLTFJQRFNObkVrMlBpYTAyOGwyU2pJeEVnbGxiT0Z5VlAiLCJtYWMiOiI5ZTI1ZDBjZDUxOWU2NjYzNzJjNTk4YjRiZjA1MDliZWFhM2NlOTI0OGU3ZWFhNjhiN2NiODRlOTgzYjJkNzYzIiwidGFnIjoiIn0%3D')
    //     }
    //   }
    //   );
    
      console.log(response.data);
    //   await AsyncStorage.setItem('token', response.data.token);
     

    //   dispatch({ type: 'SET_TOKEN', payload: response.data.token });
     
    //   await getUserDetails(response.data.token);
    } catch (error) {
      console.log('Request Details:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Login failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = () => {

  }

//   const register = async (firstname, lastname, phoneNumber, email, password) => {
//     try {
//       dispatch({ type: 'SET_LOADING', payload: true });

//       const response = await axios.post(`${base_url}/register`, { name, email, password,password_confirmation });


//       dispatch({ type: 'SET_TOKEN', payload: response.data.token });
//       await AsyncStorage.setItem('token', response.data.token);

     
//       console.log("register success")
//     } catch (error) {
//       console.error('Registration failed:', error);
//       dispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
//     } finally {
//       dispatch({ type: 'SET_LOADING', payload: false });
//     }
//   };

  const getUserDetails = async (token) => {
    try {
      const response = await axios.get(`${base_url}/api/user/g`);

      dispatch({ type: 'SET_USER', payload: response.data });
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      dispatch({ type: 'SET_TOKEN', payload: null });
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
