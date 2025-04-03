import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Clear token if unauthorized
      localStorage.removeItem("token");
      // Redirect can be handled by the app router
    }
    return Promise.reject(error);
  }
);

// Auth services
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Todo services
export const getTodos = async () => {
  const response = await api.get("/todos");
  return response.data;
};

export const getTodo = async (id) => {
  const response = await api.get(`/todos/${id}`);
  return response.data;
};

export const createTodo = async (todoData) => {
  const response = await api.post("/todos", todoData);
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await api.put(`/todos/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

export const sendReminder = async (id) => {
  const response = await api.post(`/todos/${id}/send-reminder`);
  return response.data;
};

// Notification services
export const getNotifications = async () => {
  const response = await api.get("/notifications");
  return response.data;
};

export const markNotificationsAsRead = async (notificationIds) => {
  const response = await api.post("/notifications/read", { notificationIds });
  return response.data;
};

export default api;
