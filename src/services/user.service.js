import createApiClient from "./api.service";
class UserService {
  constructor(baseUrl = "/api/v1/user") {
    this.api = createApiClient(baseUrl);
  }
  async getUserLogin() {
    try {
      const response = await this.api.get("/UserLogin");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getUserById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  async getAllUsers() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  // Thêm phương thức để lấy URL đăng nhập Google
  // async getGoogleAuthUrl() {
  //   try {
  //     const response = await this.api.get("/auth/google");
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error fetching Google auth URL:", error);
  //   }
  // }
}
export default new UserService();
