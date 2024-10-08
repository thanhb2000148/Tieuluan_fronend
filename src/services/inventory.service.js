import createApiClient from "./api.service";

class InventoryService {
  constructor(baseUrl = "/api/v1/inventory") {
    this.api = createApiClient(baseUrl);
  }

  async addInventoryEntries(id_product, quantity, keys, values) {
    try {
      const payload = {
        quantity: quantity,
        key: keys,
        value: values,
      };
      const response = await this.api.post(`/${id_product}`, payload);
      return response.data; // Trả về dữ liệu nhận được từ server
    } catch (error) {
      console.error("Lỗi khi thêm phiếu nhập kho:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi
    }
  }
}

export default new InventoryService();
