import { ApiResponseType } from "../types/ApiResponse";
import { UserAttributes } from "../types/User";
import axiosInstance from "./axios";
import apiEndpoint from "./endpoint";

export const getAllUser = () => {
  return axiosInstance.get<ApiResponseType<UserAttributes[]>>(apiEndpoint.user.index);
};
