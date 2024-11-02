import createApiClient from "./api.service";
class ProductService {
  constructor(baseUrl = "/api/v1/product") {
    this.api = createApiClient(baseUrl);
  }
  async getAll(page, limit) {
    try {
      const response = await this.api.get(`/?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async getAllProduct() {
    try {
      const response = await this.api.get("/getAll");
      return response.data;
    } catch (error) {
      console.error(error);
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
  async create(product) {
    return (await this.api.post("/fashion", product)).data;
  }
  async getProductByIdCategory(id) {
    try {
      const response = await this.api.get(`/category/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async searchProducts(keyword) {
    try {
      const response = await this.api.get(`/search?query=${keyword}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching products with keyword ${keyword}:`, error);
      throw error;
    }
  }
 async update(id, product) {
  try {
    const response = await this.api.put(`/${id}`, product);
    console.log("Dữ liệu trả về từ server:", response.data); // Log dữ liệu trả về
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
  }
  async getActiveProducts() {
    try {
      const response = await this.api.get("/delete_true"); // Gọi đến API để lấy sản phẩm không bị xóa
      return response.data; // Đảm bảo server trả về danh sách sản phẩm không bị xóa
    } catch (error) {
      console.error("Error fetching active products:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  }
  async deleteImage(productId, imageId) {
  try {
    const response = await this.api.delete(`/${productId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting image with ID ${imageId} from product ${productId}:`, error);
    throw error;
  }
}



   
}
export default new ProductService();
