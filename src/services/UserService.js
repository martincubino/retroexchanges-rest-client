import axios from 'axios'

const USERS_API_BASE_URL = 'http://193.168.1.3:8080/api/users'

class UserService{
    getUsers(){
        return axios.get(USERS_API_BASE_URL);
    }

}

export default new UserService()
