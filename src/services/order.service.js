import createApiClient from "./api.service";
class OrderService {
  constructor(baseUrl = "/api/v1/order") {
    this.api = createApiClient(baseUrl);
  }
  async addOrder(address) {
    try {
      const response = await this.api.post("/", address);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async getOrderUser() {
    try {
      const response = await this.api.get("/");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
  // API để lấy danh sách tất cả đơn hàng
  async getOrdersAll() {
    try {
      const response = await this.api.get("/all"); // Sử dụng URL lấy tất cả đơn hàng
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
 async updateOrderStatusToProcessing(orderId) {
    try {
        const response = await this.api.put(`/orders/${orderId}/proceed`);
        console.log("Phản hồi cập nhật trạng thái 'Đang xử lý':", response); // Thêm log này
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái 'Đang xử lý':", error);
        throw error;
    }
}


  async updateOrderToShipping(orderId) {
    try {
      const response = await this.api.put(`/orders/${orderId}/shipping`);
              console.log("Phản hồi cập nhật trạng thái 'Đang van chuyen':", response); // Thêm log này

        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái 'Đang vận chuyển':", error);
        throw new Error("Cập nhật trạng thái 'Đang vận chuyển' thất bại!"); // Thêm thông tin lỗi
    }
  }   
  async updateOrderStatusSuccess(orderId) {
    try {
      const response = await this.api.patch(`/orders/${orderId}/success`);
      console.log("Phản hồi cập nhật trạng thái 'Đã giao':", response);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái 'Đã giao':", error);
      throw new Error("Cập nhật trạng thái 'Đã giao' thất bại!"); // Thêm thông tin lỗi
    }
  }
}

export default new OrderService();
