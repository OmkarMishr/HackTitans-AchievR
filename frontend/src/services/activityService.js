import apiClient from "../api/apiClient";

export const fetchMyActivities = () => {
  return apiClient.get("/activities/my-activities");
};

export const submitActivity = (formData) => {
  return apiClient.post("/activities/submit", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
