const API_BASE_URL = 'http://localhost:8080/api';

export default {
  async login(context, payload) {
    let login = {
      email: payload.email,
      password: payload.password
    };
    //const response = await axios.post(API_BASE_URL + '/login', 
    const response = await fetch(API_BASE_URL + '/login', {
      method: 'POST',
      body: JSON.stringify(login),
      headers: {
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
      expirateAt: responseData.expirateAt
    });
  },
  async signup(context, payload) {
    console.log(payload);
    const response = await fetch(API_BASE_URL + '/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
      throw error;
    }

    if (response.ok) {
      console.log(responseData);
    }
    context.commit('setUser', {
      token: responseData.token,
      email: responseData.email,
      createAt: responseData.createAt,
      expirateAt: responseData.expirateAt,
    });
  }
};