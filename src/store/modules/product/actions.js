//const uri2blob = require('datauritoblob');

export default {
  async loadProduct(context, payload) {
    const productId = payload;
    const response = await fetch(`${process.env.VUE_APP_API_REST_BASE_URL}/product/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(e => {
      let error_message = 'Fallo de autenticación. Intentelo de nuevo mas tarde.';
      const error = new Error(error_message + '.(' + e.message + ')');
      throw error;
    });

    const responseData = await response.json();
    if (!response.ok) {
      let error_message = '';
      switch (response.status) {
        case 401:
          error_message = 'Fallo de autenticación. Revise los datos introducidos.';
          break;
        case 404:
          error_message = 'Producto no encontrado.';
          break;
        default:
          error_message = 'Fallo al intentar obtener los datos. Intentelo de nuevo mas tarde.';
          break;
      }
      const error = new Error(error_message);
      throw error;
    }

    context.commit('setProduct', {
      productId: responseData.productId,
      categoryId: responseData.categoryId,
      name: responseData.name,
      description: responseData.description,
      createAt: responseData.createAt,
      updatedAt: responseData.updatedAt,
      price: responseData.price,
      owner: responseData.owner,
      status: responseData.status
    });
  },

  async updateProduct(context, payload) {
    const token = context.rootGetters.token;
    const productId = payload.productId;

    const response = await fetch(`${process.env.VUE_APP_API_REST_BASE_URL}/product/${productId}`, {
      method: 'PUT',
      body: payload,
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }).catch(e => {
      let error_message = 'Fallo de autenticación. Intentelo de nuevo mas tarde.';
      const error = new Error(error_message + '.(' + e.message + ')');
      throw error;
    });

    const responseData = await response.json();

    if (!response.ok) {
      let error_message = '';
      switch (response.status) {
        case 401:
          error_message = 'Fallo de autenticación. Revise los datos introducidos.';
          break;
        case 404:
          error_message = 'Categoría no encontrada. Registrese primero para autenticarse en el sistema.';
          break;
        default:
          error_message = 'Fallo al intentar obtener los datos. Intentelo de nuevo mas tarde.';
          break;
      }
      const error = new Error(error_message);
      throw error;
    }

    context.commit('setCategory', {
      productId: responseData.productId,
      categoryId: responseData.categoryId,
      name: responseData.name,
      description: responseData.description,
      createAt: responseData.createAt,
      updatedAt: responseData.updatedAt,
      price: responseData.price,
      owner: responseData.owner,
      status: responseData.status
    });
  },
  async createProduct(context, payload) {

    const token = context.rootGetters.token;

    

    const response = await fetch(`${process.env.VUE_APP_API_REST_BASE_URL}/product`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: new Headers({
        'Authorization': `Bearer ${token}`

      })
    }).catch(e => {
      let error_message = 'Fallo de autenticación. Intentelo de nuevo mas tarde.';
      const error = new Error(error_message + '.(' + e.message + ')');
      throw error;
    });
    const responseData = await response.json();

    if (!response.ok) {
      let error_message = '';
      switch (response.status) {
        case 401:
          error_message = 'Fallo de autenticación. Revise los datos introducidos.';
          break;
        default:
          error_message = 'Fallo al intentar obtener los datos. Intentelo de nuevo mas tarde.';
          break;
      }
      const error = new Error(error_message);
      throw error;
    }

    context.commit('setProduct', {
      productId: responseData.productId,
      categoryId: responseData.categoryId,
      name: responseData.name,
      description: responseData.description,
      createAt: responseData.createAt,
      updatedAt: responseData.updatedAt,
      price: responseData.price,
      owner: responseData.owner,
      status: responseData.status
    });
  },
  async loadProducts(context) {

    const response = await fetch(`${process.env.VUE_APP_API_REST_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
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
          error_message = 'No se encontraron productos.';
          break;
        default:
          error_message = 'Fallo al intentar obtener los datos. Intentelo de nuevo mas tarde.';
          break;
      }
      const error = new Error(error_message);
      throw error;
    }

    const products = [];

    for (const key in responseData) {
      const product = {
        id: key,
        productId: responseData[key].productId,
        categoryId: responseData[key].categoryId,
        name: responseData[key].name,
        description: responseData[key].description,
        createAt: responseData[key].createAt,
        updatedAt: responseData[key].updatedAt,
        price: responseData[key].price,
        owner: responseData[key].owner,

      };
      products.push(product);
    }
    context.commit('setProducts', products);
    context.commit('setFetchTimestamp');
  }
};