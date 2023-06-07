import axios from "axios";
import requestConfig from "./config/requestConfig";
import requestConfigJson from "./config/requestConfigJson";
import { AdminBasic, AdminUpdate } from "../interfaces";
import { getCurrentAdminId } from "../utils";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL + "/admin";

export const getAdmins = async () => {
  const response = await axios.get(BASE_URL, requestConfig);
  return response.data.data;
};

export const createAdmin = async (adminData: AdminBasic) => {
  const adminId = getCurrentAdminId();
  const payload = {
    ...adminData,
    addedBy: adminId,
  };
  const response = await axios.post(BASE_URL, payload, requestConfigJson);
  return response.data.data;
};

export const updateAdmin = async (adminData: AdminUpdate) => {
  const adminId = getCurrentAdminId();
  const payload = {
    ...adminData,
    lastUpdatedBy: adminId,
  };
  const response = await axios.put(
    `${BASE_URL}/${adminData._id}`,
    payload,
    requestConfigJson
  );
  return response.data.data;
};

export const deleteAdmin = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, requestConfig);
  return response.data.data;
};

const AdminService = {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
};

export default AdminService;
