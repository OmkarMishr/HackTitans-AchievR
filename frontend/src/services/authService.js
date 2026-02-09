import apiClient from "../api/apiClient";

export const loginUser = (credentials) => {
  return apiClient.post("/auth/login", credentials);
};

export const registerUser = (data) => {
  return apiClient.post("/auth/register", data);
};
