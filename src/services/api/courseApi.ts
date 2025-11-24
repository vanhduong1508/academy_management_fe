import axios from "axios";
import {
  Course,
  CourseCreateRequest,
  CourseUpdateRequest,
} from "../../types/course";

const API_URL = "http://localhost:7880/api/courses";

export const courseApi = {
  // GET all
  getAll: async (): Promise<Course[]> => {
    const res = await axios.get(API_URL);
    return res.data;
  },

  // GET by id
  getById: async (id: number): Promise<Course> => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  },

  // CREATE
  create: async (data: CourseCreateRequest): Promise<void> => {
    await axios.post(API_URL, data);
  },

  // UPDATE
  update: async (id: number, data: CourseUpdateRequest): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, data);
  },

  // DELETE
  delete: async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};
