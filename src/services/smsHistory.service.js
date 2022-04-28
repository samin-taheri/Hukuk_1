import axios from 'axios';
import { Global } from "../Global";
import authHeader from "./auth-header";

const URL = `${Global.API_URL}SmsHistories/`;

export default class SmsHistoryService {
    getAll(pageNumber, pageSize) {
        return axios.get(`${URL}GetAll?pageNumber=${pageNumber}&pageSize=${pageSize}`, { headers: authHeader() });
    }
}