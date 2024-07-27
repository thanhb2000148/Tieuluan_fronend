<template>
  <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content rounded-0">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Tìm Kiếm Sản Phẩm</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body d-flex align-items-center flex-column">
          <div class="input-group w-75 mx-auto d-flex mb-4">
            <input
              type="search"
              class="form-control p-3"
              placeholder="Enter keywords"
              aria-describedby="search-icon-1"
              v-model="keyword"
              @keyup.enter="searchProducts"
            />
            <button id="search-icon-1" class="btn btn-primary p-3" @click="searchProducts">Search</button>
          </div>
          
          <div class="row g-4 ">
            <div class="col-md-4" v-for="product in searchs" :key="product._id">
              <div class="card h-100">
                <router-link :to="{ name: 'UserDetail', params: { id: product._id } }">
                  <div class="fruite-imga">
                    <img
                      v-if="product.LIST_FILE_ATTACHMENT_DEFAULT && product.LIST_FILE_ATTACHMENT_DEFAULT.length > 0"
                      :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                      class="img-fluid rounded-top"
                      :alt="product.NAME_PRODUCT"
                    />
                  </div>
                  <div class="card-body d-flex flex-column">
                    <h5 class="card-title">{{ product.NAME_PRODUCT }}</h5>
                    <p class="product-price fw-bold a">
                      {{
                        getPrice(product._id).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      }}
                    </p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import productService from "@/services/product.service";
import PriceService from "@/services/price.service";


export default {
  name: "HomeSearch",
  data() {
    return {
      keyword: "",
      searchs: [],
      prices: []
    };
  },
  async created() {
    try {
      await this.getPriceProduct();
      console.log('mảng price',this.prices)
      console.log('da nhap vao', this.keyword);
    } catch (error) {
      console.error("Error during component initialization:", error);
    }
  },
    
  
  methods: {
    async searchProducts() {
      if (this.keyword.length > 1) {
        try {
          const response = await productService.searchProducts(this.keyword);
           console.log('da nhap vao', this.keyword);
          if (response && response.data) {
            this.searchs = response.data;
            await this.getPriceProduct();
          } else {
            console.error("Unexpected response structure:", response);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          throw error; // Re-throw error to be caught by the caller
        }
      } else {
        this.searchs = [];
      }
    },
      async getPriceProduct() {
      try {
        const prices = {};
        for (const product of this.searchs) {
          const response = await PriceService.getDefaultPrice(product._id);
          if (response && response.data && response.data[0]) {
            prices[product._id] = response.data[0].PRICE_NUMBER;
          } else {
            console.error("Unexpected response structure:", response);
          }
        }
        this.prices = prices;
      } catch (error) {
        console.error("lỗi khi lấy giá:", error);
      }
    },
    getPrice(productId) {
      const price = this.prices[productId];
      if (price) {
        return price;
      } else {
        return "Đang cập nhật giá";
      }
    },
    // getPrice(product) {
    //   return product.PRICE_NUMBER || "N/A";
    // },
  },
};
</script>

<style>
.search-result-item {
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}
/* hình ảnh đổ ra*/
.fruite-imga {
  overflow: hidden;
  width: 100%;
  height: 250px; /* Điều chỉnh chiều cao tùy ý */
  border-radius: 10px;
}

.fruite-imga img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.fruite-imga:hover img {
  transform: scale(1.1);
}

.card-body {
  padding: 10px;
  flex-direction: column;
  align-items: center; /* Đảm bảo các phần tử được căn giữa */
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.product-price {
  font-size: 1rem;
  margin-top: auto; /* Đẩy giá xuống dưới */
}

.search-result-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.a {
    color: #000000;

}

</style>
