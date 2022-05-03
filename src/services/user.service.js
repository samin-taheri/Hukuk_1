
import axios from 'axios';
import { Global } from 'src/Global';
import authHeader from './auth-header';

const URL = `${Global.API_URL}Users/`;
export default class UserService {
  getAll() {
    return axios.get(`${URL}GetAllUserExceptAlreadyRecordedUsersInLicence`, { headers: authHeader() });
  }
  getAllUsersAsAdmin(pageNumber, pageSize) {
    return axios.post(`${URL}GetAllUsersAsAdmın?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers: authHeader() });
  }
  getByUserIdAsAdmin(id) {
    return axios.get(`${URL}GetByUserIdAsAdmin?id=${id}`, { headers: authHeader() });
  }
}
