import axios from "axios";
import requestConfig from "./config/requestConfig";
import requestConfigJson from "./config/requestConfigJson";
import { JobBasic, JobUpdate } from "../interfaces";
import { getCurrentAdminId } from "../utils";

const BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL + "/job";

// Get all jobs
const getJobs = async () => {
  const response = await axios.get(BASE_URL, requestConfig);
  return response.data.data;
};

// Create a new job
const createJob = async (job: JobBasic) => {
  const adminId = getCurrentAdminId();
  const payload = new FormData();
  payload.append("title", job.title);
  payload.append("description", job.description);
  payload.append("category", job.category);
  payload.append("image", job.image);
  payload.append("addedBy", adminId);
  const response = await axios.post(BASE_URL, payload, requestConfigJson);
  return response.data.data;
};

// Update a job
const updateJob = async (job: JobUpdate) => {
  const adminId = getCurrentAdminId();
  const payload = new FormData();
  payload.append("title", job.title);
  payload.append("description", job.description);
  payload.append("category", job.category);
  payload.append("image", job.image);
  payload.append("lastUpdatedBy", adminId);
  const response = await axios.put(
    `${BASE_URL}/${job._id}`,
    payload,
    requestConfigJson
  );
  return response.data.data;
};

// Delete a job
const deleteJob = async (id: string) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, requestConfig);
  return response.data.data;
};

//get job by category id
const getJobsByCategory = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/category/${id}`, requestConfig);
  return response.data.data;
};

const JobService = {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobsByCategory,
};

export default JobService;
