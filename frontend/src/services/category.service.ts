import axios from "axios";
import requestConfig from "./config/requestConfig";
import requestConfigJson from "./config/requestConfigJson";
import { CategoryBasic, CategoryUpdate } from "../interfaces";
import { getCurrentAdminId } from "../utils";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL + "/category";

//get all categories
const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/`, requestConfig);
  return response.data.data;
};

//create category
const createCategory = async (categoryData: CategoryBasic) => {
  const adminId = getCurrentAdminId();
  const payload = {
    ...categoryData,
    addedBy: adminId,
  };
  const response = await axios.post(`${BASE_URL}/`, payload, requestConfigJson);
  return response.data.data;
};

//update category
const updateCategory = async (categoryData: CategoryUpdate) => {
  const adminId = getCurrentAdminId();
  const payload = {
    name: categoryData.name,
    description: categoryData.description,
    lastUpdatedBy: adminId,
  };
  const response = await axios.put(
    `${BASE_URL}/${categoryData._id}`,
    payload,
    requestConfigJson
  );
  return response.data.data;
};

//delete category
const deleteCategory = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, requestConfig);
  return response.data.data;
};

const CategoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryService;
