import axios from "axios";

const baseURL: string = "http://localhost:6001";
const API = axios.create({ baseURL, withCredentials: true });

export default API;
