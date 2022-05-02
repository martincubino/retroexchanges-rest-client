import axios from 'axios'

const API_BASE_URL = 'http://192.168.1.3:8080/api'

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzb2Z0dGVrSldUIiwic3ViIjoiZmptYXJ0aW5jdWJpbm9AZ21haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE2NTE1MTUwNDAsImV4cCI6MTY1MTYwMTQ0MH0.WtcxXs4EXTLcXDBpygNu1Sr2pREoLb3PQ1K7l-PG4IcdvvCojefZ6KxcwwvPEBkbGU6zkSn47WeB43pyIUErfg'

class CategoryService {

  fortmatResponse(res) {
    return JSON.stringify(res, null, 2);
  }

  getCategory(id) {
    return axios.get(API_BASE_URL + '/categories/'+id, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      }
    });
  }

  getCategories() {
    return axios.get(API_BASE_URL + '/categories', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      }
    });
  }
}

export default new CategoryService()