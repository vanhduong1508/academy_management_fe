import axios from "axios";

const API_URL = "http://localhost:7880/api/certificates";

export const getAllCertificates = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createCertificate = async (payload: { enrollmentId: number; status: string }) => {
  const res = await axios.post(API_URL, payload);
  return res.data;
};

export const revokeCertificate = async (id: number) => {
  const res = await axios.put(`${API_URL}/revoke/${id}`);
  return res.data;
};

export const getCertificateById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
