import createApiClient from "./api.service";
class CategoryService {
  constructor(baseUrl = "/api/v1/category") {
    this.api = createApiClient(baseUrl);
  }
  // Phương thức tạo danh mục
 async createCategory(data) {
    try {
      const response = await this.api.post("/", data); // Gọi API để tạo danh mục
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
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
   // phương thức cập nhật danh mục
  async updateCategory(id, data) {
    try {
      const response = await this.api.put(`/${id}`, data); // Gọi API để cập nhật danh mục
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // phương thức xóa danh mục
  async deleteCategory(id) {
    try {
      const response = await this.api.delete(`/${id}`); // Gọi API để xóa danh mục
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
export default new CategoryService();
