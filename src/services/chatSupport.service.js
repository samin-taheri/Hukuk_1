import axios from 'axios';
import { Global } from "../Global";
import authHeader from "./auth-header";

const URL = `${Global.API_URL}ChatSupports/`;

export default class ChatSupportService {
    getAllMessegaAsUser() {
        return axios.get(`${URL}GetAllMessegaAsUser`, { headers: authHeader() });
    }
    addMessegaAsUser(message) {
        return axios.post(`${URL}AddMessegaAsUser`, message, { headers: authHeader() });
    }
    makeItReadAsUser() {
        return axios.get(`${URL}MakeItReadAsUser`, { headers: authHeader() });
    }
}
