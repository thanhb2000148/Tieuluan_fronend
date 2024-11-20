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
            <!-- Hiển thị số điện thoại -->
            <div class="mb-4">
              <label for="phone" class="form-label">Số điện thoại</label>
              <div class="d-flex align-items-center">
                <input 
                  type="text" 
                  id="phone" 
                  v-model="phoneNumber" 
                  class="form-control me-2" 
                  :readonly="!isEditingPhone" 
                />
                <!-- <button 
                  v-if="!isEditingPhone" 
                  @click="startEditingPhone" 
                  class="btn btn-outline-primary">Thay đổi</button>
                <button 
                  v-if="isEditingPhone" 
                  @click="savePhone" 
                  class="btn btn-primary">Lưu</button>
                <button 
                  v-if="isEditingPhone" 
                  @click="cancelEditingPhone" 
                  class="btn btn-secondary">Hủy</button> -->
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
            <div class="mb-4">
              <button @click="showAddAddressModal" class="btn btn-outline-primary w-100">
                <i class="bi bi-plus-circle me-2"></i>Thêm địa chỉ mới
              </button>
            </div>
                <!-- Modal Thêm Địa Chỉ Mới -->
                  <div v-if="showModal" class="modal-overlay">
                    <div class="modal-content">
                      <h2>Thêm Địa Chỉ Mới</h2>
                      <form @submit.prevent="addNewAddress">
                        <div class="form-group">
                          <label for="newProvince">Tỉnh/Thành Phố</label>
                          <input type="text" id="newProvince" v-model="newAddress.provide" required>
                        </div>
                        <div class="form-group">
                          <label for="newDistrict">Quận/Huyện</label>
                          <input type="text" id="newDistrict" v-model="newAddress.district" required>
                        </div>
                        <div class="form-group">
                          <label for="newCommune">Xã/Phường</label>
                          <input type="text" id="newCommune" v-model="newAddress.commune" required>
                        </div>
                        <div class="form-group">
                          <label for="newDesc">Địa chỉ chi tiết</label>
                          <input type="text" id="newDesc" v-model="newAddress.desc" required>
                        </div>
                        <div class="button-group">
                          <button type="submit" class="btn-primary">Lưu địa chỉ</button>
                          <button type="button" class="btn-secondary" @click="closeModal">Hủy</button>
                        </div>
                      </form>
                    </div>
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
                    <!-- Hiển thị thuộc tính phân loại -->
                  <div v-if="item.ITEM.LIST_MATCH_KEY && item.ITEM.LIST_MATCH_KEY.length" class="product-attributes">
                    <h6>Phân loại:</h6>
                    <ul>
                      <li v-for="(keyValue, keyIndex) in item.ITEM.LIST_MATCH_KEY" :key="keyIndex">
                      {{ keyValue.KEY }}: {{ keyValue.VALUE }}
                      </li>
                    </ul>
                  <div class="divider"></div>
                  </div>
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
      phoneNumber: '',  // Số điện thoại
      isEditingPhone: false,  // Trạng thái chỉnh sửa số điện thoại
      selectedAddress: {
        DESC: "",
        COMMUNE: "",
        DISTRICT: "",
        PROVINCE: "",
      },
      newAddress: {
        provide: "",
        district: "",
        commune: "",
        desc: "",
      },
      addressSelected: false,
      hoveredProduct: null,
      showModal: false,
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
    showAddAddressModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.newAddress = { provide: "", district: "", commune: "", desc: "" };
    },
    async addNewAddress() {
      try {
        const response = await addressesService.createAddress(this.newAddress);
        if (response && response.data) {
          this.address.push(response.data);
          this.closeModal();
          this.fetchAddresses();
          Swal.fire({
            icon: "success",
            title: "Thêm địa chỉ thành công",
            text: "Địa chỉ mới đã được thêm vào danh sách.",
          });
        }
     } catch (error) {
      console.error("Error adding new address:", error);
        Swal.fire({
          icon: "error",
          title: "Có lỗi xảy ra",
          text: "Không thể thêm địa chỉ mới.",
        });
     }
    },
    async fetchAddresses() {
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
      // Bắt đầu chỉnh sửa số điện thoại
    // startEditingPhone() {
    //   this.isEditingPhone = true;
    // },
    // // Lưu số điện thoại mới
    // async savePhone() {
    //   try {
    //     const response = await userService.updatePhoneNumber(this.phoneNumber);
    //     if (response && response.data) {
    //       this.isEditingPhone = false;
    //       Swal.fire({
    //         icon: "success",
    //         title: "Cập nhật thành công",
    //         text: "Số điện thoại đã được cập nhật.",
    //       });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     Swal.fire({
    //       icon: "error",
    //       title: "Có lỗi xảy ra",
    //       text: "Không thể cập nhật số điện thoại.",
    //     });
    //   }
    // },


    async getUser() {
      try {
        const response = await userService.getUserLogin();
        if (response && response.data) {
          this.user = response.data;
          this.phoneNumber = this.user.PHONE_USER || '';  // Gán số điện thoại hiện tại

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
         // Gán số điện thoại từ dữ liệu trả về
      this.phoneNumber = this.userById.PHONE_NUMBER || ''; // Gán số điện thoại nếu có
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
.divider {
  height: 1px; /* Độ cao của đường kẻ */
  background-color: #ccc; /* Màu sắc của đường kẻ */
  margin: 20px 0; /* Khoảng cách trên và dưới đường kẻ */
  width: 100%; /* Độ rộng của đường kẻ */
}
.product-attributes {
  margin: 0; /* Loại bỏ khoảng cách bên ngoài */
  padding: 0; /* Loại bỏ khoảng cách bên trong */
}

.product-attributes ul {
  list-style-type: none; /* Loại bỏ dấu chấm đầu dòng mặc định */
  padding-left: 0; /* Loại bỏ thụt lùi cho danh sách */
}

.product-attributes li {
  margin: 0; /* Loại bỏ khoảng cách trên và dưới cho từng mục */
  padding: 0; /* Loại bỏ khoảng cách bên trong cho từng mục */
}





.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary, .btn-secondary {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>
