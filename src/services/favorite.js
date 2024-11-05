import createApiClient from "./api.service";

class FavoriteService {
  constructor(baseUrl = "http://localhost:8000/v1/favorite") {
    this.api = createApiClient(baseUrl);
    }

    // Thêm sản phẩm vào yêu thích
  async addFavorite(productId) {
    try {
      const response = await this.api.post("/", { productId });
      return response.data;
    } catch (error) {
      console.error(`Error adding product with ID ${productId} to favorites:`, error);
      throw error;
    }
    }
     // Lấy toàn bộ danh sách sản phẩm yêu thích
  async getAllFavorites() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error("Error fetching favorite products:", error);
      throw error;
    }
    }
    // Lấy danh sách sản phẩm yêu thích theo ID người dùng
  async getFavoritesByUserId(userId) {
    try {
      const response = await this.api.get(`/user/${userId}`); // Cập nhật đường dẫn API tùy thuộc vào cấu trúc
      return response.data;
    } catch (error) {
      console.error(`Error fetching favorite products for user ${userId}:`, error);
      throw error;
    }
    }
    // Xóa sản phẩm khỏi danh sách yêu thích
async removeFavorite(userId, productId) {
    try {
        const response = await this.api.delete(`/user/${userId}/${productId}`);
        return response.data;
    } catch (error) {
        console.error(`Error removing product with ID ${productId} from favorites:`, error);
        throw error;
    }
}
}

export default new FavoriteService();
