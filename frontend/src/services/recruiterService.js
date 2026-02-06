import apiClient from "../api/apiClient";

export const fetchMyRecruiterProfile = () => {
  return apiClient.get("/recruiter/my-profile");
};

export const fetchStudentRecruiterView = (studentId) => {
  return apiClient.get(`/recruiter/student/${studentId}`);
};
