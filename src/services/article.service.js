import createApiClient from "./api.service";

class ArticleService {
  constructor(baseUrl = "/api/v1/news") {
    this.api = createApiClient(baseUrl);
  }

  // Phương thức tạo bài viết
  async createArticle(data) {
    try {
      const response = await this.api.post("/", data); // Gọi API để tạo bài viết
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      throw error;
    }
  }

  // Phương thức lấy tất cả bài viết
  async getAll() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách bài viết:", error);
      throw error;
    }
  }

  // Phương thức lấy bài viết theo ID
  async getById(id) {
    try {
      const response = await this.api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy bài viết:", error);
      throw error;
    }
  }

  // Phương thức cập nhật bài viết
  async updateArticle(id, data) {
    try {
      const response = await this.api.put(`/news/${id}`, data); // Gọi API để cập nhật bài viết
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật bài viết:", error);
      throw error;
    }
  }

  // Phương thức xóa bài viết
  async deleteArticle(id) {
    try {
      const response = await this.api.delete(`/news/${id}`); // Gọi API để xóa bài viết
      return response.data;
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
      throw error;
    }
  }
}

export default new ArticleService();
