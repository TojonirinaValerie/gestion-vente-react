import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_API_URL}`,
  timeout: 60000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  response => {
    if (
      response.status !== 200 &&
      response.status !== 201 &&
      response.status !== 203 &&
      response.status !== 204
    ) {
      return Promise.reject(new Error("Error"));
    } else {
      return response;
    }
  },
  error => {
    return Promise.reject(error);
  }
);

export const checkConnexion = () => {
  return axiosInstance.get("/api");
};

export default axiosInstance;
