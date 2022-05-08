import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api';

export default {
  async login(context, payload) {
    let login = {
      email: payload.email,
      password: payload.password
    };
    console.log(login);
    const response = await axios.post(API_BASE_URL + '/login', 
      login,
      { headers: {
        'Content-Type': 'application/json',
      }
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.log(responseData);
      const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
      throw error;
    }
    
    context.commit('setUser', {
      token: responseData.token,
      email: responseData.email,
      createAt: responseData.createAt,
      expirationAt: responseData.expirationAt
    });
  },
  async signup(context, payload) {
    console.log(payload);
    const response = await axios.post(API_BASE_URL+'/register', payload,
      { headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
      throw error;
    }

    console.log(responseData);
    context.commit('setUser', {
    //  token: responseData.token,
      email: responseData.email
      //tokenCreation: responseData.createAt,
      //tokenExpiration: responseData.expiresAt
    });
  }
};