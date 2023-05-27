import axios from "axios";
import requestConfig from "./config/requestConfig";
import { UserBasic } from "../interfaces";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL + "/user";

//User Login
const userLogin = (email: string, password: string) => {
  const credentials = {
    email: email,
    password: password,
  };

  return axios.post(`${BASE_URL}/login`, credentials);
};

//User Register
const userRegister = (user: UserBasic) => {
  return axios.post(`${BASE_URL}/register`, user);
};

//Get User By Id
const getUserById = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/${id}`, requestConfig);
  return response.data.data;
};

const UserService = {
  userLogin,
  userRegister,
  getUserById,
};

export default UserService;
