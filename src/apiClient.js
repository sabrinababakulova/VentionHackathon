import axios from "axios";

export const baseURL = "https://inventionhack-akfge2hbanfudabb.eastus2-01.azurewebsites.net";

export const apiClient = axios.create({
  baseURL:
    "https://inventionhack-akfge2hbanfudabb.eastus2-01.azurewebsites.net",
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "text/plain",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return config;
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const apiClientBlob = axios.create({
  baseURL:
    "https://inventionhack-akfge2hbanfudabb.eastus2-01.azurewebsites.net",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});
apiClientBlob.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      return config;
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
