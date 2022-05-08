import axios from 'axios'


export default {
  async login(context, payload) {
    const response = await axios.post('https://nibbler.zapto.org/api/' + '/login', 
      payload,
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
      token: responseData.idToken,
      userId: responseData.localId,
      tokenExpiration: responseData.expiresIn
    });
  },
  async signup(context, payload) {
    const response = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        password: payload.password
      })
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.log(responseData);
      const error = new Error(responseData.message || 'Failed to authenticate. Check your login data.');
      throw error;
    }

    console.log(responseData);
    context.commit('setUser', {
      token: responseData.token,
      email: responseData.email,
      tokenCreation: responseData.createAt,
      tokenExpiration: responseData.expiresAt
    });
  }
};