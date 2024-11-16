<template>
  <NavBar />
  <Search />
  <SinglePageHeaderVue />
  
  <div class="cart-view bg-light py-5">
    <div class="container">
      <h1 class="mb-4 text-center cart-title">Giỏ hàng của bạn</h1>
      
      <div v-if="cart.length === 0" class="text-center py-5 empty-cart">
        <img src="../../public/img/cart_empty.png" alt="" class="mb-4" style="max-width: 200px;" />
        <p class="lead text-muted">
          Hiện tại không có sản phẩm nào trong giỏ hàng của Anh/Chị.
        </p>
        <router-link to="/shop" class="btn btn-primary btn-lg">Tiếp tục mua sắm</router-link>
      </div>
      
      <div v-else class="row">
        <div class="col-lg-8">
          <div class="card shadow-sm mb-4 cart-items">
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-borderless mb-0">
                  <thead class="bg-primary text-white">
                    <tr>
                      <th scope="col" class="py-3 px-4">Sản phẩm</th>
                      <th scope="col" class="py-3 px-4">Giá</th>
                      <th scope="col" class="py-3 px-4">Số lượng</th>
                      <th scope="col" class="py-3 px-4">Tổng cộng</th>
                      <th scope="col" class="py-3 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in cart" :key="item.ITEM._id" class="cart-item">
                      <td class="py-3 px-4">
                        <div class="d-flex align-items-center">
                          <img
                            v-if="item.ITEM.PRODUCT_DETAILS && item.ITEM.PRODUCT_DETAILS.imageUrl"
                            :src="item.ITEM.PRODUCT_DETAILS.imageUrl"
                            class="img-fluid me-3 rounded product-image"
                            alt=""
                          />
                          <div>
                            <h6 class="mb-0 product-name" v-if="item.ITEM.PRODUCT_DETAILS">
                              {{ item.ITEM.PRODUCT_DETAILS.name }}
                            </h6>
                            <small class="text-muted" v-else>Thông tin sản phẩm không có sẵn</small>
                            <div class="mt-1 product-details">
                              <small class="text-muted" v-if="item.ITEM.LIST_MATCH_KEY && item.ITEM.LIST_MATCH_KEY[0]">
                                {{ item.ITEM.LIST_MATCH_KEY[0].KEY }}: {{ item.ITEM.LIST_MATCH_KEY[0].VALUE }}
                              </small>
                              <br v-if="item.ITEM.LIST_MATCH_KEY && item.ITEM.LIST_MATCH_KEY[1]" />
                              <small class="text-muted" v-if="item.ITEM.LIST_MATCH_KEY && item.ITEM.LIST_MATCH_KEY[1]">
                                {{ item.ITEM.LIST_MATCH_KEY[1].KEY }}: {{ item.ITEM.LIST_MATCH_KEY[1].VALUE }}
                              </small>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="py-3 px-4 product-price">{{ formatPrice(item.ITEM.PRICE) }}</td>
                      <td class="py-3 px-4">
                        <div class="input-group input-group-sm quantity-control">
                          <button
                            @click="updateNumberCartMinus(item.ITEM.ID_PRODUCT, item.ITEM._id, item.ITEM.QUANTITY - 1, item.ITEM._id)"
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            <i class="fa fa-minus"></i>
                          </button>
                          <input
                            type="text"
                            class="form-control text-center"
                            :value="item.ITEM.QUANTITY"
                            readonly
                          />
                          <button
                            @click="updateNumberCartPlus(item.ITEM.ID_PRODUCT, item.ITEM._id, item.ITEM.QUANTITY + 1, item.ITEM._id)"
                            class="btn btn-outline-secondary"
                            type="button"
                          >
                            <i class="fa fa-plus"></i>
                          </button>
                        </div>
                      </td>
                      <td class="py-3 px-4 product-total">
                        <strong>{{ formatPrice(totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY)) }}</strong>
                      </td>
                      <td class="py-3 px-4">
                        <button
                          class="btn btn-sm btn-outline-danger remove-item"
                          @click="deleteCart(item.ITEM._id)"
                        >
                          <i class="fa fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <router-link to="/products" class="btn btn-outline-primary btn-lg">
              <i class="fa fa-arrow-left me-2"></i>Tiếp tục mua sắm
            </router-link>
          </div>
        </div>
        
        <div class="col-lg-4">
          <div class="card shadow-sm order-summary">
            <div class="card-body">
              <h5 class="card-title mb-4">Tổng đơn hàng</h5>
              <div class="d-flex justify-content-between mb-3">
                <span>Tạm tính:</span>
                <strong>{{ formatPrice(calculateTotalCart()) }}</strong>
              </div>
              <hr>
              <div class="d-flex justify-content-between mb-4">
                <span class="h5">Tổng cộng:</span>
                <strong class="h5 text-primary">{{ formatPrice(calculateTotalCart()) }}</strong>
              </div>
              <button
                @click="checkLenghtCart()"
                class="btn btn-primary btn-lg w-100"
                type="button"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <AppFooter />
</template>

<script>
import cartService from "@/services/cart.service";
import productService from "@/services/product.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import SinglePageHeaderVue from "@/components/User/cart/SinglePageHeader.vue";
import formatUtils from "../utils/format";
import Swal from "sweetalert2";
import Search from "@/components/User/Home/Search.vue";
export default {
  name: "CartView",
  components: {
    NavBar,
    AppFooter,
    SinglePageHeaderVue,
    Search,
  },
  data() {
    return {
      cart: [],
          shippingFee: 30000, // Giả sử phí vận chuyển là 30,000 VND

    };
  },
  async created() {
    await this.getCart(); // Lấy dữ liệu giỏ hàng
    console.log("giỏ hàng:", this.cart);
    console.log("số lượng sp trong giỏ", this.getNumberCart);
    await this.populateProducts(); // Lấy chi tiết sản phẩm cho từng mục trong giỏ hàng
    await this.updateNumberCartPlus();
  },

  methods: {
    async getCart() {
      try {
        const response = await cartService.getCart();
        if (response && response.data) {
          this.cart = response.data; // Đặt dữ liệu giỏ hàng vào biến cục bộ
        }
      } catch (error) {
        console.error(error);
      }
    },

    async populateProducts() {
      for (let item of this.cart) {
        // Duyệt qua từng mục trong giỏ hàng và lấy chi tiết sản phẩm sử dụng `getProduct`
        const productDetails = await this.getProduct(item.ITEM.ID_PRODUCT);
        if (productDetails) {
          item.ITEM.PRODUCT_DETAILS = productDetails;
        } else {
          // Xử lý khi không tìm thấy sản phẩm, ví dụ gán một giá trị mặc định
          item.ITEM.PRODUCT_DETAILS = {
            NAME_PRODUCT: "Sản phẩm không tồn tại",
            LIST_FILE_ATTACHMENT_DEFAULT: [
              { FILE_URL: "default-image-url.jpg" },
            ],
          };
        }
      }
    },
    async getProduct(productId) {
      try {
        const response = await productService.getById(productId);
        if (response && response.data) {
          return {
            name: response.data.NAME_PRODUCT,
            imageUrl: response.data.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL,
            // Thêm các trường khác nếu cần
          };
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    totalPrice(price, quantity) {
      return price * quantity;
    },
    formatPrice(price) {
      if (typeof price !== "undefined") {
        const formatter = formatUtils.formatNumber(); // Initialize the formatter function
        return formatter(price); // Format the price using the formatter function
      } else {
        return "0"; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
      }
    },
    checkLenghtCart() {
      if (this.cart.length > 0) {
        this.$router.push("/checkout");
      } else {
        alert("bạn chưa có hàng trong giỏ");
      }
    },
    async updateNumberCartPlus(
      id_product,
      id_list_product,
      newNumber,
      item_id
    ) {
      try {
        // Tìm sản phẩm trong giỏ hàng
        const itemIndex = this.cart.findIndex(
          (item) => item.ITEM._id === item_id
        );
        if (itemIndex !== -1) {
          const productInCart = this.cart[itemIndex];

          // Kiểm tra nếu số lượng mới vượt quá số lượng sản phẩm trong kho
          if (newNumber > productInCart.ITEM.NUMBER_PRODUCT) {
            Swal.fire({
              icon: "error",
              title: "Số lượng vượt quá số lượng trong kho",
              text: `Sản phẩm này chỉ còn ${productInCart.ITEM.NUMBER_PRODUCT} trong kho.`,
            });
            return;
          }

          const response = await cartService.updateCart({
            id_product: id_product,
            id_list_product: id_list_product,
            numberCart: newNumber,
          });

          if (response && response.success) {
            // Cập nhật số lượng trong giỏ hàng cục bộ
            if (newNumber === 0) {
              const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Có",
                denyButtonText: `Không`,
              });
              if (result.isConfirmed) {
                await cartService.deleteCart(item_id);
                this.cart.splice(itemIndex, 1);
              }
            } else {
              // Update QUANTITY trong ITEM
              this.cart[itemIndex].ITEM.QUANTITY = newNumber;
            }
          } else {
            console.error("Cập nhật giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    async updateNumberCartMinus(
      id_product,
      id_list_product,
      newNumber,
      item_id
    ) {
      try {
        if (newNumber >= 0) {
          const response = await cartService.updateCart({
            id_product: id_product,
            id_list_product: id_list_product,
            numberCart: newNumber,
          });
          if (response && response.success) {
            const itemIndex = this.cart.findIndex(
              (item) => item.ITEM._id === item_id
            );
            if (newNumber === 0) {
              const result = await Swal.fire({
                title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
                showDenyButton: false,
                showCancelButton: true,
                confirmButtonText: "Có",
                denyButtonText: `Không`,
              });
              if (result.isConfirmed) {
                await cartService.deleteCart(item_id);
                this.cart.splice(itemIndex, 1);
              }
            } else {
              // Update QUANTITY trong ITEM
              this.cart[itemIndex].ITEM.QUANTITY = newNumber;
            }
          } else {
            console.error("Cập nhật giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCart(id) {
      try {
        const result = await Swal.fire({
          title: "Bạn có muốn xóa sản phẩm ra khỏi giỏ hàng",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });

        if (result.isConfirmed) {
          const response = await cartService.deleteCart(id);
          if (response && response.success) {
            const itemIndex = this.cart.findIndex(
              (item) => item.ITEM._id === id
            );
            if (itemIndex !== -1) {
              this.cart.splice(itemIndex, 1);
            }
          } else {
            console.error("Xóa giỏ hàng thất bại", response.message);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    calculateTotalCart() {
      return this.cart.reduce((total, item) => {
        return total + this.totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY);
      }, 0);
    },
  },
};
</script>

<style scoped>
.cart-view {
  background-color: #f8f9fa;
}

.cart-title {
  
  font-size: 2.5rem;
  font-weight: 300;
  color: #343a40;
  margin-bottom: 2rem;
}

.card {
  border: none;
  border-radius: 0.5rem;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.cart-items .table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.cart-item {
  transition: background-color 0.3s ease;
}

.cart-item:hover {
  background-color: #f8f9fa;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
}

.product-name {
  font-weight: 500;
  color: #343a40;
}

.product-details {
  font-size: 0.85rem;
}

.product-price, .product-total {
  font-weight: 500;
  color: #495057;
}

.quantity-control {
  width: 120px;
}

.quantity-control .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.quantity-control input {
  font-weight: 500;
}

.remove-item {
  transition: all 0.3s ease;
}

.remove-item:hover {
  background-color: #dc3545;
  color: white;
}

.order-summary {
  background-color: #ffffff;
}

.order-summary .card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #343a40;
}

.btn-primary, .bg-primary {
  background-color: #4A90E2 !important;
  border-color: #4A90E2 !important;
  transition: all 0.3s ease;
}

.btn-primary:hover, .btn-outline-primary:hover {
  opacity: 0.9;
}

.btn-outline-primary {
  color: #4A90E2;
  border-color: #4A90E2;
}

.text-primary {
  color: #4A90E2 !important;
}

.empty-cart p {
  font-size: 1.1rem;
  color: #6c757d;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .cart-title {
    font-size: 2rem;
  }
  
  .product-image {
    width: 60px;
    height: 60px;
  }
  
  .quantity-control {
    width: 100px;
  }
}
</style>
