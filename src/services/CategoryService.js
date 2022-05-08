import axios from 'axios'

import API_BASE_URL from '../main.js'

//const token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzb2Z0dGVrSldUIiwic3ViIjoiZmptYXJ0aW5jdWJpbm9AZ21haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE2NTE1MTUwNDAsImV4cCI6MTY1MTYwMTQ0MH0.WtcxXs4EXTLcXDBpygNu1Sr2pREoLb3PQ1K7l-PG4IcdvvCojefZ6KxcwwvPEBkbGU6zkSn47WeB43pyIUErfg'

class CategoryService {

  fortmatResponse(res) {
    return JSON.stringify(res, null, 2);
  }

  getCategory(id) {
    return axios.get(API_BASE_URL + '/categories/'+id, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getCategories() {
    return axios.get(API_BASE_URL + '/categories', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export default new CategoryService()