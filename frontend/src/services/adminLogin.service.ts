import axios from "axios";
import requestConfig from "./config/requestConfig";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL + "/admin";

//Admin Login
const adminLogin = (email: string, password: string) => {
  const credentials = {
    email: email,
    password: password,
  };

  return axios.post(`${BASE_URL}/login`, credentials);
};

//get all admins
const getAdmins = () => {
  return axios.get(`${BASE_URL}/`, requestConfig);
};

//get TOTP by student id
const getTOTPByAdminId = (id: string) => {
  const config = {
    headers: {
      "Content-type": "multipart/form-data",
    },
  };
  return axios.get(`${BASE_URL}/${id}/verification/status`, config);
};

//choose TOTP method by student id
const chooseTOTPMethodByAdminId = (id: string, method: string) => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  return axios.post(
    `${BASE_URL}/${id}/verification/choose-method`,
    { method: method },
    config
  );
};

//verify TOTP by student id
const verifyTOTPByAdminId = (
  adminData: {
    _id: string;
    id: string;
    email: string;
    role: string;
  },
  code: string
) => {
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };
  const data = {
    email: adminData.email,
    token: code,
    role: adminData.role,
  };
  return axios.post(`${BASE_URL}/${adminData._id}/verification`, data, config);
};

const AdminLoginService = {
  adminLogin,
  getAdmins,
  getTOTPByAdminId,
  chooseTOTPMethodByAdminId,
  verifyTOTPByAdminId,
};

export default AdminLoginService;
