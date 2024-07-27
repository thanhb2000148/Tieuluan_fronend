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
}
export default new OrderService();
