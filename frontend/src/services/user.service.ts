import axios from "axios";
import requestConfig from "./config/requestConfig";
import { UserBasic } from "../interfaces";
import requestConfigJson from "./config/requestConfigJson";

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

//get roadmaps by user id and job title
const getRoadmapsByUserIdAndJobTitle = async (id: string, jobTitle: string) => {
  const payload = {
    jobRole: jobTitle,
  };
  return axios.post(`${BASE_URL}/${id}/roadmap`, payload, requestConfigJson);
};

const forgotPassword = async (email: string) => {
  return axios.post(`${BASE_URL}/forgot-password`, { email });
};

const UserService = {
  userLogin,
  userRegister,
  getUserById,
  getRoadmapsByUserIdAndJobTitle,
  forgotPassword,
};

export default UserService;
