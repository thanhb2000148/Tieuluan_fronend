<template>
  <NavBar />
  <Search />
  <SinglePageHeader />
  <div class="container py-5">
    <h1 class="text-center mb-5">Thông tin giao hàng</h1>
    <div class="row">
      <div class="col-lg-8">
        <div class="card shadow-sm mb-4">
          <div class="card-body">
            <div class="d-flex align-items-center mb-4">
              <img :src="avatarUrl" alt="Avatar" class="avatar-img me-3" />
              <div>
                <h5 class="mb-0">{{ userById?.EMAIL_USER || 'Loading...' }}</h5>
                <small class="text-muted">Thông tin người dùng</small>
              </div>
            </div>
            <div class="mb-4">
              <label for="select-address" class="form-label">Địa chỉ đã lưu</label>
              <select
                @change="HandleSelect"
                id="select-address"
                class="form-select"
              >
                <option value="">Chọn địa chỉ</option>
                <option
                  v-for="(item, index) in address"
                  :key="index._id"
                  :value="item._id"
                >
                  {{ `${item.DESC}, ${item.COMMUNE}, ${item.DISTRICT}, ${item.PROVINCE}` }}
                </option>
              </select>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Tỉnh/Thành Phố</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="selectedAddress.PROVINCE"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Quận/Huyện</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="selectedAddress.DISTRICT"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Xã/Phường</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="selectedAddress.COMMUNE"
                  readonly
                />
              </div>
              <div class="col-md-6">
                <label class="form-label">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="selectedAddress.DESC"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>
        <button
          @click="addOrder()"
          type="button"
          class="btn btn-primary btn-lg w-100"
        >
          Tiến hành thanh toán
        </button>
      </div>
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="card-title mb-4">Đơn hàng của bạn</h5>
            <div class="order-summary">
              <div v-for="(item, index) in cart" :key="index" class="d-flex align-items-center mb-3 position-relative">
                <div class="product-image-wrapper" @mouseover="showProductDetails(index)" @mouseleave="hideProductDetails">
                  <img
                    :src="item.ITEM.PRODUCT_DETAILS.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL"
                    class="img-fluid rounded"
                    style="width: 60px; height: 60px; object-fit: cover;"
                    alt=""
                  />
                  <div v-if="hoveredProduct === index" class="product-details-popup">
                    <h6>{{ item.ITEM.PRODUCT_DETAILS.NAME_PRODUCT }}</h6>
                    <p>Giá: {{ formatPrice(item.ITEM.PRICE) }}</p>
                    <p>Số lượng: {{ item.ITEM.QUANTITY }}</p>
                    <p>Tổng cộng: {{ formatPrice(totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY)) }}</p>
                  </div>
                </div>
                <div class="ms-3 flex-grow-1">
                  <h6 class="mb-0">{{ item.ITEM.PRODUCT_DETAILS.NAME_PRODUCT }}</h6>
                  <small class="text-muted">{{ item.ITEM.QUANTITY }} x {{ formatPrice(item.ITEM.PRICE) }}</small>
                </div>
                <span class="text-primary">{{ formatPrice(totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY)) }}</span>
              </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between mt-4">
              <h5>Tổng cộng</h5>
              <h5 class="text-primary">{{ formatPrice(calculateTotalCart()) }}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>

<script>
import orderService from "@/services/order.service";
import cartService from "@/services/cart.service";
import productService from "@/services/product.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import SinglePageHeader from "../components/User/checkout/SinglePageHeader.vue";
import userService from "@/services/user.service";
import addressesService from "@/services/addresses.service";
import formatUtils from "../utils/format";
import Swal from "sweetalert2";
import Search from "@/components/User/Home/Search.vue";

export default {
  name: "CheckOutView",
  components: {
    NavBar,
    AppFooter,
    SinglePageHeader,
    Search,
  },
  data() {
    return {
      cart: [],
      user: [],
      userById: [],
      address: [],
      avatarUrl: '',
      selectedAddress: {
        DESC: "",
        COMMUNE: "",
        DISTRICT: "",
        PROVINCE: "",
      },
      addressSelected: false,
      hoveredProduct: null,
    };
  },
  async created() {
    await this.getCart();
    await this.getUser();
    await this.populateProducts();
    await this.getAddresses();
    await this.fetchUserById();
    console.log("lấy user theo ID", this.userById);
  },
  methods: {
    async getCart() {
      try {
        const response = await cartService.getCart();
        if (response && response.data) {
          this.cart = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async populateProducts() {
      for (let item of this.cart) {
        const productDetails = await this.getProduct(item.ITEM.ID_PRODUCT);
        if (productDetails) {
          item.productDetails = productDetails;
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
          };
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    formatPrice(price) {
      if (typeof price !== "undefined") {
        const formatter = formatUtils.formatNumber();
        return formatter(price);
      } else {
        return "0";
      }
    },
    totalPrice(price, quantity) {
      return price * quantity;
    },
    checkLenghtCart() {
      if (this.cart.length > 0) {
        this.$router.push("/checkout");
      } else {
        alert("bạn chưa có hàng trong giỏ");
      }
    },
    async addOrder() {
      try {
        const response = await orderService.addOrder(this.selectedAddress);
        if (!this.addressSelected) {
          Swal.fire({
            icon: "error",
            title: "Chưa có địa chỉ giao hàng",
            text: "bạn cần chọn địa chỉ giao hàng để tiếp tục",
            footer: "Nếu chưa có bạn hãy cập nhật ở thông tin người dùng",
          });
          return;
        }
        if (response && response.success) {
          this.$router.push("/checkout/paymentMethods");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getUser() {
      try {
        const response = await userService.getUserLogin();
        if (response && response.data) {
          this.user = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchUserById() {
      try {
        const response = await userService.getUserById(this.user.USER_ID);
        if (response && response.data) {
          this.userById = response.data;
          console.log("AVT_URL:", this.user.AVT_URL);
          this.avatarUrl = this.userById.AVT_URL ? this.userById.AVT_URL : '/img/avatar.jpg';
        } else {
          console.log("Không có dữ liệu người dùng đăng nhập.");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getAddresses() {
      try {
        const response = await addressesService.getAddress();
        if (response && response.data) {
          this.address = response.data;
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        this.message = "Có lỗi xảy ra khi tải danh sách địa chỉ.";
        this.alertClass = "alert-danger";
      }
    },
    getIdSelect() {
      var e = document.getElementById("select-address");
      var value = e.value;
      return value;
    },
    HandleSelect(event) {
      const selectedId = event.target.value;
      const selectedAddress = this.address.find(
        (item) => item._id === selectedId
      );
      if (selectedAddress) {
        this.selectedAddress = selectedAddress;
        this.addressSelected = true;
      }
    },
    calculateTotalCart() {
      return this.cart.reduce((total, item) => {
        return total + this.totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY);
      }, 0);
    },
    // Hiễn thị phần xem nhanh sản phẩm
    showProductDetails(index) {
      this.hoveredProduct = index;
    },
    hideProductDetails() {
      this.hoveredProduct = null;
    },
  },
};
</script>

<style>
.avatar-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #f0f0f0;
}

.card {
  border: none;
  border-radius: 15px;
}

.btn-primary {
  border-radius: 30px;
  padding: 12px 30px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.order-summary {
  max-height: 300px;
  overflow-y: auto;
}

/*css phần xem nhanh*/
.product-image-wrapper {
  position: relative;
  cursor: pointer;
}

.product-details-popup {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  min-width: 200px;
}

.product-details-popup h6 {
  margin-bottom: 5px;
  font-weight: bold;
}

.product-details-popup p {
  margin-bottom: 3px;
  font-size: 0.9em;
}

</style>
