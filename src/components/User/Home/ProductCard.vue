<template>
  <div class="rounded border position-relative fruite-item">
    <div class="fruite-img">
      <img :src="productImage" class="img-fluid w-100 rounded-top" alt="" />
    </div>
    <!-- <div
      class="text-white bg-secondary px-3 py-1 rounded position-absolute"
      style="top: 10px; left: 10px"
    >
      {{ product.CATEGORY_ID }}
    </div> -->
    <div class="p-4 border-top-0 rounded-bottom">
      <h4>{{ product.NAME_PRODUCT }}</h4>
      <p>{{ product.SHORT_DESC }}</p>
      <div class="d-flex justify-content-between flex-lg-wrap">
        <p class="text-dark fs-5 fw-bold mb-0">
          {{
            getPrice().toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })
          }}
        </p>
        <a
          href="#"
          class="btn border border-secondary rounded-pill px-3 text-primary"
        >
          <i class="fa fa-shopping-bag me-2 text-primary"></i> Thêm Vào Giỏ Hàng
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import PriceService from "../../../services/price.service";
export default {
  name: "ProductCard",
  props: {
    product: Object,
  },
  data() {
    return {
      prices: null,
    };
  },
  computed: {
    productImage() {
      return this.product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL; // Cập nhật tùy thuộc vào cấu trúc thực tế
    },
  },
  async created() {
    try {
      await this.getPriceProduct();
      console.log("Mãng prices:", this.prices);
    } catch (error) {
      console.error("Error during component initialization:", error);
    }
  },
  methods: {
    async getPriceProduct() {
      try {
        const response = await PriceService.getDefaultPrice(this.product._id);
        if (response && response.data && response.data[0]) {
          this.prices = response.data[0].PRICE_NUMBER;
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("lỗi khi lấy giá:", error);
        throw error; // Re-throw error to be caught by the caller
      }
    },
    getPrice() {
      const price = this.prices;
      if (price) {
        return price;
      } else {
        return "Đang cập nhật giá";
      }
    },
  },
};
</script>

<style scoped>
/* Add any specific styles for ProductCard if needed */
</style>
