import createApiClient from "./api.service";
class PriceService {
  constructor(baseUrl = "/api/v1/price") {
    this.api = createApiClient(baseUrl);
  }
  async getAllPrices() {
    try {
      const response = await this.api.get(`/all`); // Assuming the API endpoint to get all prices is just the base URL
      return response.data; // Ensure it returns the data you need
    } catch (error) {
      console.error("Error fetching all prices:", error);
    }
  }

  async getDefaultPrice(id) {
    try {
      const response = await this.api.get(`/defaultPrice/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async getPriceKeyValue(id, payload) {
    try {
      const response = await this.api.get(`/${id}`, payload);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
  async getPriceProduct(id_product, keys, values) {
  try {
    const response = await this.api.post(`/${id_product}/key`, {
      key: keys,
      value: values,
    });
    return response.data;  // Đảm bảo trả về response.data
  } catch (error) {
    console.log(error);
    }
  }
  // async updatePrice(id_product, id_list_price, payload) {
  // try {
  //   const response = await this.api.put(`/${id_product}/${id_list_price}`, payload);
  //   return response.data;
  // } catch (error) {
  //   console.log(error);
  // }
  // }
  async updatePrice(idProduct, idListPrice = null, payload) {
  try {
    const url = idListPrice ? `/${idProduct}/${idListPrice}` : `/${idProduct}/default`;
    const response = await this.api.put(url, payload);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật giá:", error);
  }
}





}
export default new PriceService();
