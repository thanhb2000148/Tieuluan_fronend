<template>
  <NavBar />
  <Search />
  <SinglePageHeader />
  <div class="container-fluid py-5">
    <div class="container py-5">
      <h1 class="mb-4">Thông tin giao hàng</h1>
      <form action="#">
        <div class="row g-5">
          <div class="col-md-12 col-lg-6 col-xl-7">
            <div class="row">
              <div class="col-md-12">
                <div class="row">
                  <div class="col-md-2 text-center p-0">
                    <div class="avatar my-5">
                      <img src="../../public/img/avatar.jpg" alt="" />
                      <div v-if="user && user.USER_ID">
                        {{ user.USER_NAME }}
                      </div>
                      <div v-else>Loading...</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                <div class="form-control bg-white my-3">
                  <select
                    @change="HandleSelect"
                    name=""
                    id="select-address"
                    class="w-100 border-0 bg-white"
                  >
                    <option value="">Địa chỉ đã lưu</option>
                    <option
                      v-for="(item, index) in address"
                      :key="index._id"
                      :value="item._id"
                    >
                      {{
                        item.DESC +
                        " " +
                        item.COMMUNE +
                        " " +
                        item.DISTRICT +
                        " " +
                        item.PROVINCE
                      }}
                    </option>
                  </select>
                </div>
                <div class="col-md-12 col-lg-6 w-100">
                  <div class="form-item">
                    <label class="form-label my-3">Tỉnh/Thành Phố</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="selectedAddress.PROVINCE"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 w-100">
                  <div class="form-item">
                    <label class="form-label my-3">Quận/Huyện</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="selectedAddress.DISTRICT"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 w-100">
                  <div class="form-item">
                    <label class="form-label my-3">Xã/Phường</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="selectedAddress.COMMUNE"
                      readonly
                    />
                  </div>
                </div>
                <div class="col-md-12 col-lg-6 w-100">
                  <div class="form-item">
                    <label class="form-label my-3">Địa chỉ chi tiết</label>
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
              class="btn border-secondary py-3 px-4 text-uppercase w-100 text-primary my-5"
            >
              Tiến hành thanh toán
            </button>
          </div>
          <div class="col-md-12 col-lg-6 col-xl-5">
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Sản phẩm</th>
                    <th scope="col">Tên</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Tổng cộng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cart" :key="index">
                    <th scope="row">
                      <div class="d-flex align-items-center mt-2">
                        <img
                          :src="
                            item.ITEM.PRODUCT_DETAILS
                              .LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL
                          "
                          class="img-fluid rounded-circle"
                          style="width: 90px; height: 90px"
                          alt=""
                        />
                      </div>
                    </th>
                    <td class="py-5">
                      {{ item.ITEM.PRODUCT_DETAILS.NAME_PRODUCT }}
                    </td>
                    <td class="py-5">{{ formatPrice(item.ITEM.PRICE) }}</td>
                    <td class="py-5">x {{ item.ITEM.QUANTITY }}</td>
                    <td class="py-5">
                      {{
                        formatPrice(
                          totalPrice(item.ITEM.PRICE, item.ITEM.QUANTITY)
                        )
                      }}
                    </td>
                  </tr>

                  <tr>
                    <th scope="row"></th>
                    <td class="py-5">
                      <p class="mb-0 text-dark text-uppercase py-3">
                        Tổng đơn hàng
                      </p>
                    </td>
                    <td class="py-5"></td>
                    <td class="py-5"></td>
                    <td class="py-5">
                      <div class="py-3 border-bottom border-top">
                        <p class="mb-0 text-dark">
                          {{ formatPrice(calculateTotalCart()) }}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              class="row g-4 text-center align-items-center justify-content-center pt-4"
            ></div>
          </div>
        </div>
      </form>
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
      address: [],
      selectedAddress: {
        DESC: "",
        COMMUNE: "",
        DISTRICT: "",
        PROVINCE: "",
      },
      addressSelected: false,
    };
  },
  async created() {
    await this.getCart();
    await this.getUser();
    await this.populateProducts();
    await this.getAddresses();
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
          item.productDetails = productDetails; // Giả sử bạn muốn thêm productDetails cho mỗi mục
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
    formatPrice(price) {
      if (typeof price !== "undefined") {
        const formatter = formatUtils.formatNumber(); // Initialize the formatter function
        return formatter(price); // Format the price using the formatter function
      } else {
        return "0"; // Hoặc giá trị mặc định khác tùy vào yêu cầu của bạn
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
  },
};
</script>

<style></style>
