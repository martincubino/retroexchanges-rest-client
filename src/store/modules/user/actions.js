const url = require('url');

export default {
  async loadUser(context, payload) {
    console.log(payload);
    /*if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }*/
    const token = context.rootGetters.token;
    const email = context.rootGetters.email;

    console.log(email);

    const response = await fetch(`${process.env.VUE_APP_API_REST_BASE_URL}/user/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    const responseData = await response.json();

    if (!response.ok) {
      let error_message = '';
      switch (response.status) {
        case 401:
          error_message = 'Fallo de autenticación. Revise los datos introducidos.';
          break;
        case 404:
          error_message = 'Usuario no registrado. Registrese primero para autenticarse en el sistema.';
          break;
        default:
          error_message = 'Fallo al intentar autenticar. Intentelo de nuevo mas tarde.';
          break;
      }
      const error = new Error(error_message);
      throw error;
    }

    context.commit('setUser', {
      name: responseData.name,
      surname: responseData.surname,
      email: responseData.email,
      nif: responseData.nif,
      address: responseData.address,
      isAdmin: responseData.isAdmin,
      status: responseData.status,
      password: responseData.password
    });
  },
  async getUserLocation(context, payload) {
    console.log(payload);
    /*if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }*/

    let u = url.parse(process.env.VUE_APP_API_NOMINATIM_BASE_URL + payload.address + '&format=jsonv2');

    const response = await fetch(u.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const responseData = await response.json();
    console.log(responseData);
    if (!response.ok) {
      let error_message = 'Fallo al intentar obterner ubicacion. Intentelo de nuevo mas tarde.';
      const error = new Error(error_message);
      throw error;
    }
    if (typeof responseData != "undefined") {
      if (responseData.length > 0) {
        context.commit('setUserLocation', {
          latitude: responseData[0].lat,
          longitude: responseData[0].lon
        });
      }
    }
  },
  async getLocationAddress(context, payload) {
    console.log(payload);
    /*if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }*/

    let u = url.parse(process.env.VUE_APP_API_NOMINATIM_REVERSE_BASE_URL + 'lat=' + payload.latitude + '&lon=' + payload.longitude + '&format=json&addressdetails=1&zoom=16');

    const response = await fetch(u.href, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const responseData = await response.json();
    console.log(responseData);
    if (!response.ok) {
      let error_message = 'Fallo al intentar obterner ubicacion. Intentelo de nuevo mas tarde.';
      const error = new Error(error_message);
      throw error;
    }
    if (typeof responseData != "undefined") {
      let nominatim_response = responseData.display_name.split(",");
      context.commit('setLocationAddress', {
        address: nominatim_response[0]+','+nominatim_response[3],
      });
    }
  },
};