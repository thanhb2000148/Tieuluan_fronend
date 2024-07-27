import createApiClient from "./api.service";

class AddressService {
  constructor(baseUrl = "/api/v1/address") {
    this.api = createApiClient(baseUrl);
  }

  async getAddress() {
    try {
      const response = await this.api.get("/?page=1&limit=10");
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      throw error;
    }
  }

  async createAddress(addressData) {
    try {
      const response = await this.api.post("/", addressData);
      return response.data;
    } catch (error) {
      console.error("Error creating address:", error);
      throw error;
    }
  }

  async updateAddress(id, updatedData) {
    try {
      const response = await this.api.put(`/${id}`, updatedData);
      return response.data;
    } catch (error) {
      console.error(`Error updating address with id ${id}:`, error);
      throw error;
    }
  }

  async deleteAddress(id) {
    try {
      const response = await this.api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting address with id ${id}:`, error);
      throw error;
    }
  }
  async getAddressById(id){
   try {
    const response = await this.api.get(`/${id}`);
    return response.data
   } catch (error) {
    console.error(
      error
    )
   }
  }
}

export default new AddressService();
