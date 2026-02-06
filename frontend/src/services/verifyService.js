import apiClient from "../api/apiClient";

export const verifyPublicHash = (hash) => {
  return apiClient.get(`/verify/${hash}`);
};
