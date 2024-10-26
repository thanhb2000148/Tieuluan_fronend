<template>
  <div class="modal fade" id="searchModal" tabindex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <!-- Header Section -->
        <div class="modal-header border-0 py-3">
          <div class="container-fluid px-4">
            <div class="d-flex align-items-center justify-content-between">
              <h5 class="modal-title fs-3 fw-bold text-primary mb-0" id="searchModalLabel">
                <i class="bi bi-search me-2"></i>Tìm Kiếm
              </h5>
              <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
          </div>
        </div>

        <div class="modal-body px-0 pb-4 pt-0">
          <!-- Search Input Section -->
          <div class="search-container mb-4">
            <div class="container-fluid px-4">
              <div class="search-wrapper">
                <div class="input-group">
                  <span class="input-group-text border-0 bg-transparent">
                    <i class="bi bi-search fs-5 text-primary"></i>
                  </span>
                  <input
                    type="search"
                    class="form-control form-control-lg border-0 py-3 shadow-none"
                    placeholder="Nhập tên sản phẩm bạn muốn tìm..."
                    aria-label="Search products"
                    v-model="keyword"
                    @keyup.enter="searchProducts"
                  />
                  <button 
                    class="btn btn-primary px-4 fw-semibold"
                    @click="searchProducts"
                  >
                    Tìm Kiếm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Section -->
          <div class="container-fluid px-4">
            <div v-if="searchs.length > 0" class="results-info mb-4">
              <h6 class="text-muted mb-0">Tìm thấy {{ searchs.length }} kết quả</h6>
            </div>

            <div class="row g-4">
              <div class="col-6 col-md-4 col-lg-3" v-for="product in searchs" :key="product._id">
                <div class="product-card h-100">
                  <div 
                    class="product-link cursor-pointer"
                    @click="navigateToProduct(product._id)"
                  >
                    <div class="product-image">
                      <img
                        v-if="product.LIST_FILE_ATTACHMENT_DEFAULT?.length"
                        :src="product.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                        class="img-fluid"
                        :alt="product.NAME_PRODUCT"
                      />
                      <div v-else class="no-image">
                        <i class="bi bi-image fs-1"></i>
                      </div>
                    </div>
                    <div class="product-info">
                      <h6 class="product-title">{{ product.NAME_PRODUCT }}</h6>
                      <p class="product-price mb-0">
                        {{ getPrice(product._id).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-if="keyword && searchs.length === 0" class="empty-state text-center py-5">
              <i class="bi bi-search fs-1 text-muted mb-3"></i>
              <h5 class="fw-bold">Không tìm thấy kết quả</h5>
              <p class="text-muted">Vui lòng thử lại với từ khóa khác</p>
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
      prices: {}
    };
  },
  async created() {
    try {
      await this.getPriceProduct();
    } catch (error) {
      console.error("Error during component initialization:", error);
    }
  },
  methods: {
    async searchProducts() {
      if (this.keyword.length > 1) {
        try {
          const response = await productService.searchProducts(this.keyword);
          if (response?.data) {
            this.searchs = response.data;
            await this.getPriceProduct();
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          throw error;
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
          if (response?.data?.[0]) {
            prices[product._id] = response.data[0].PRICE_NUMBER;
          }
        }
        this.prices = prices;
      } catch (error) {
        console.error("Lỗi khi lấy giá:", error);
      }
    },
    getPrice(productId) {
      return this.prices[productId] || "Đang cập nhật giá";
    },
    navigateToProduct(productId) {
      const closeButton = document.querySelector('#searchModal .btn-close');
      if (closeButton) {
        closeButton.click();
      }
      this.$router.push({ 
        name: 'UserDetail', 
        params: { id: productId } 
      });
    }
  }
};
</script>

<style scoped>
.modal-content {
  background-color: #ffffff;
}

.search-container {
  background-color: #f8f9fa;
}

.search-wrapper {
  background: #ffffff;
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.input-group {
  background: #ffffff;
}

.form-control {
  font-size: 1rem;
  background: transparent;
}

.form-control:focus {
  background: transparent;
}

.form-control::placeholder {
  color: #adb5bd;
  font-size: 0.95rem;
}

.btn-primary {
  border-radius: 0.75rem;
  padding: 0.8rem 1.5rem;
  transition: all 0.2s ease;
}

.product-card {
  background: #ffffff;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.08);
  border-color: #e8e8e8;
}

.product-image {
  position: relative;
  padding-top: 100%; /* 1:1 Aspect Ratio */
  background-color: #f8f9fa;
  overflow: hidden;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.no-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dee2e6;
}

.product-info {
  padding: 1rem;
}

.product-title {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
  color: #343a40;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  color: #dc3545;
  font-weight: 600;
  font-size: 1rem;
}

.empty-state i {
  display: block;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .search-wrapper {
    border-radius: 0.75rem;
  }
  
  .btn-primary {
    border-radius: 0.5rem;
  }
  
  .product-card {
    border-radius: 0.75rem;
  }
  
  .product-info {
    padding: 0.75rem;
  }
  
  .product-title {
    font-size: 0.9rem;
  }
  
  .product-price {
    font-size: 0.95rem;
  }
}
</style>