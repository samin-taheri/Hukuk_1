
import axios from 'axios';
import {Global} from "../Global";
import authHeader from "./auth-header";

const URL = `${Global.API_URL}Licences/`;

export default class LicencesService {
    // eslint-disable-next-line class-methods-use-this
    GetAllByUserId(UserId) {
        return axios.get(`${URL}GetAllByUserId?userId=${UserId}`)
    }
    getForUpdating() {
        return axios.get(`${URL}GetForUpdating`, { headers: authHeader() });
    }
    add(licenceId) {
        return axios.post(`${URL}Add`, licenceId, { headers: authHeader() });
    }
    update(licenceId) {
        return axios.post(`${URL}Update`, licenceId, { headers: authHeader() });
    }
}
