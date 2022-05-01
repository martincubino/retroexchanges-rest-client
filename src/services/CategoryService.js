import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const token = 'eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJzb2Z0dGVrSldUIiwic3ViIjoiZmptYXJ0aW5jdWJpbm9AZ21haWwuY29tIiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9BRE1JTiJdLCJpYXQiOjE2NTE0MjEyOTMsImV4cCI6MTY1MTUwNzY5M30.zPOv8u2HEGIy1gzFjWhHaqtH3cEbB1oDlZw4jBhY-UWibgnLhB8axN_htnMK7HuQbRiioRIs2labPkYQo5JEPA'

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