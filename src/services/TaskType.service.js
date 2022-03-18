import axios from 'axios';
import { Global } from "../Global";
import authHeader from "./auth-header";

const URL = `${Global.API_URL}TaskTypes/`;

export default class TaskTypeService {
    // eslint-disable-next-line class-methods-use-this
    getAll() {
        return axios.get(`${URL}GetAll`, { headers: authHeader() });
    }
    // eslint-disable-next-line class-methods-use-this
    getAllActive() {
        return axios.get(`${URL}GetAllActive`, { headers: authHeader() });
    }
    getById(id) {
        return axios.get(`${URL}GetById?id=${id}`, { headers: authHeader() });
    }

    // eslint-disable-next-line class-methods-use-this
    add(taskType) {
        return axios.post(`${URL}Add`, taskType, { headers: authHeader() });
    }
    update(taskType) {
        return axios.post(`${URL}Update`, taskType, { headers: authHeader() });
    }
    changeActivity2(taskTypeId) {
        return axios.get(`${URL}ChangeActivity?id=${taskTypeId}`, { headers: authHeader() });
    }
}
