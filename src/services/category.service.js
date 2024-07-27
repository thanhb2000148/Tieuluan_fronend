import createApiClient from "./api.service";
class CategoryService {
  constructor(baseUrl = "/api/v1/category") {
    this.api = createApiClient(baseUrl);
  }
  async getAll() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getById(id) {
    try {
      const response = await this.api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export default new CategoryService();
