
import axios from 'axios';
import { Global } from "../Global";
import authHeader from "./auth-header";

const URL = `${Global.API_URL}LicenceUsers/`;

export default class LicenceUsersService {
    // eslint-disable-next-line class-methods-use-this
    GetAllByUserId(UserId) {
        return axios.get(`${URL}GetAllAcceptedByUserId?userId=${UserId}`)
    }
    GetAllByUserIdWithNotAccept() {
        return axios.get(`${URL}GetAllAuthUser`, { headers: authHeader() })
    }
    add(userId) {
        return axios.post(`${URL}Add`, { userId }, { headers: authHeader() });
    }
    ChangeAcceptence(id) {
        return axios.get(`${URL}ChangeAcceptence?id=${id}`)
    }
}
