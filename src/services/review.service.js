import createApiClient from "./api.service";

class ReviewService {
  constructor(baseUrl = "http://localhost:8000/v1/review/") {
    this.api = createApiClient(baseUrl);
  }

  // Tạo mới một đánh giá và cập nhật tổng số sao trung bình
  async createReview(productId, review) {
    try {
       console.log('Review gửi đi:', review);
      const response = await this.api.post(`/${productId}/reviews`, review);
      
      // Sau khi tạo đánh giá thành công, tính toán tổng số sao trung bình
      // await this.updateAverageRating(productId);

      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  // Hàm tính tổng số sao trung bình của sản phẩm
  async updateAverageRating(productId) {
    try {
      const response = await this.api.get(`/average-rating/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error calculating average rating:", error);
      throw error;
    }
  }

  // Lấy tất cả các đánh giá của một sản phẩm
  async getProductReviews(productId) {
    try {
      const response = await this.api.get(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting product reviews:", error);
      throw error;
    }
  }

  // Lấy tất cả các đánh giá
  async getAllReviews() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error("Error getting all reviews:", error);
      throw error;
    }
  }

  // Cập nhật đánh giá
  async updateReview(reviewId, updatedData) {
    try {
      const response = await this.api.put(`/${reviewId}`, updatedData);
      await this.updateAverageRating(updatedData.productId); // Cập nhật tổng số sao khi có đánh giá được thay đổi
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  }

  // Xóa đánh giá (nếu cần)
  async deleteReview(reviewId) {
    try {
      const response = await this.api.delete(`/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }
  // Lấy đánh giá theo số sao
  async getReviewsByRating(productId, rating) {
    console.log(`productId: ${productId}, rating: ${rating}`);
    try {
      const response = await this.api.get(`/${productId}/${rating}`); // Gọi API với URL
      return response.data; // Giả định rằng response.data chứa dữ liệu bạn cần
    } catch (error) {
      console.error("Error getting reviews by rating:", error);
      throw error; // Ném lỗi để xử lý ở nơi khác
    }
  }
  // Lấy đánh giá của người dùng theo userId
  async getReviewsByUser(userId) {
    try {
        const response = await this.api.get(`/user/${userId}`); // Gọi API với URL để lấy đánh giá theo userId
        return response.data; // Giả định rằng response.data chứa dữ liệu bạn cần
    } catch (error) {
        console.error("Error getting reviews by user:", error);
        throw error; // Ném lỗi để xử lý ở nơi khác
    }
  }
  // Lấy đánh giá theo productId
async getReviewsByProductId(productId) {
  try {
    const response = await this.api.get(`/${productId}/user`); // Gọi API với URL đúng
    return response.data; // Giả định rằng response.data chứa dữ liệu bạn cần
  } catch (error) {
    console.error("Error getting reviews by product ID:", error);
    throw error; // Ném lỗi để xử lý ở nơi khác
  }
}




}

export default new ReviewService();
