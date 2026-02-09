import apiClient from "../api/apiClient";

export const verifyCertificateById = (certificateId) => {
  return apiClient.get(`/certificates/verify/${certificateId}`);
};

export const downloadCertificatePdf = (certificateId) => {
  return apiClient.get(`/certificates/download/${certificateId}`, {
    responseType: "blob",
  });
};
