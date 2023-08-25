import axios from "axios";

const api = axios.create({
  baseURL: "https://my-home-ec4e5f81e228.herokuapp.com",
  timeout: 5000,
});

export default api;
