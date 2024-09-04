import customAxios from "./customApi";
import { toast } from "react-toastify";

class AuthApi {
  async register(data) {
    try {
      const response = await customAxios.post(`/auth/register`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async login(data) {
    try {
      const response = await customAxios.post(`/auth/login`, data);
      return response;
    } catch (error) {
      return error.response;
    }
  }
  async logout() {
    try {
      const response = await customAxios.post(`/auth/logout`, {});
      return response;
    } catch (error) {
      return error.response;
    }
  }

  async update(userId, data) {
    try {
      const response = await customAxios.post(`/auth/update/${userId}`, data);
      return response;
    } catch (error) {
      toast.error("Fail to update information");
      return error.response;
    }
  }
}

export default new AuthApi();
