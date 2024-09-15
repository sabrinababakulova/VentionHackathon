import axios from "axios";

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
    "Content-Type": "blob",
    Accept: "*/*",
    "response-type": "arraybuffer",
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
