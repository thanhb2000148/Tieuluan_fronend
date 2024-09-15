<template>
  <Search />
  <NavBar />
  <div class="container light-style flex-grow-1 container-p-y">
    <h4 class="font-weight-bold py-3 mb-4">Thông tin tài khoản</h4>
    <div v-if="message" :class="['alert', alertClass]" role="alert">
      {{ message }}
    </div>
    <div class="card overflow-hidden">
      <div class="row no-gutters row-bordered row-border-light">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links">
            <a
              class="list-group-item list-group-item-action"
              href="#account-general"
              @click="selectTab('general')"
              >Thông tin tài khoản</a
            >
            <a
              class="list-group-item list-group-item-action"
              href="#shipping-address"
              @click="selectTab('shipping-address')"
              >Địa chỉ giao hàng</a
            >
            <a
              class="list-group-item list-group-item-action"
              href="#order"
              @click="selectTab('order')"
              >Đơn hàng</a
            >
            <button
              type="button"
              class="btn btn-danger mt-3 my-3"
              @click="logout"
            >
              Đăng xuất
            </button>
          </div>
        </div>
        <div class="col-md-9">
          <div class="tab-content">
            <!-- Tab Thông tin tài khoản -->
            <div
              class="tab-pane fade"
              :class="{ 'active show': selectedTab === 'general' }"
              id="account-general"
            >
              <div class="card-body media align-items-center">
                <img
                  src="https://bootdey.com/img/Content/avatar/avatar1.png"
                  alt="Avatar"
                  class="d-block ui-w-80"
                />
                <div class="media-body ml-4">
                  <label class="btn btn-outline-primary">
                    Tải ảnh mới
                    <input type="file" class="account-settings-fileinput" />
                  </label>
                  &nbsp;
                  <button type="button" class="btn btn-default md-btn-flat">
                    Đặt lại
                  </button>
                  <div class="text-light small mt-1">
                    Cho phép JPG, GIF hoặc PNG. Kích thước tối đa 800K
                  </div>
                </div>
              </div>
              <hr class="border-light m-0" />
              <div class="card-body">
                <div class="form-group">
                  <label for="lastName" class="form-label">Họ và Tên</label>
                  <input
                    id="lastName"
                    type="text"
                    class="form-control"
                    v-model="userById.LAST_NAME"
                    readonly
                  />
                </div>
                <!-- <div class="form-group">
                  <label for="middleName" class="form-label">Tên đệm</label>
                  <input
                    id="middleName"
                    type="text"
                    class="form-control"
                    v-model="userById.MIDDLE_NAME"
                    readonly
                  />
                </div> -->
                <!-- <div class="form-group">
                  <label for="firstName" class="form-label">Tên</label>
                  <input
                    id="firstName"
                    type="text"
                    class="form-control"
                    v-model="userById.FIRST_NAME"
                    readonly
                  />
                </div> -->
                <div class="form-group">
                  <label for="phone" class="form-label">Số điện thoại</label>
                  <input
                    id="phone"
                    type="text"
                    class="form-control"
                    v-model="userById.PHONE_NUMBER"
                    readonly
                  />
                </div>
                <div class="form-group">
                  <label for="email" class="form-label">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    v-model="userById.EMAIL_USER"
                    readonly
                  />
                </div>
                <!-- <div class="form-group">
                  <label for="email" class="form-label">Giới tính</label>
                  <input
                    id="gender"
                    type="text"
                    class="form-control"
                    v-model="userById.GENGER_USER"
                    readonly
                  />
                </div> -->
              </div>
            </div>
            <!-- Tab Địa chỉ giao hàng -->
            <div
              class="tab-pane fade"
              :class="{ 'active show': selectedTab === 'shipping-address' }"
              id="shipping-address"
            >
              <div class="row">
                <div class="col-md-12">
                  <div class="text-center border py-3 my-4">
                    <div class="icon-plus">
                      <i class="bi bi-plus-circle-fill"></i>
                    </div>
                    <button
                      type="button"
                      class="btn btn-primary"
                      data-toggle="modal"
                      data-target="#exampleModal"
                    >
                      thêm địa chỉ
                    </button>
                  </div>
                </div>
              </div>
              <!-- Modal -->
              <div
                class="modal fade"
                id="exampleModal"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog" role="document">
                  <form>
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          Thêm địa chỉ
                        </h5>
                        <button
                          type="button"
                          class="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="form-group">
                          <label for="">Tỉnh/Thành Phố</label>
                          <input
                            type="text"
                            v-model="newAddress.provide"
                            class="form-control"
                            placeholder="Tỉnh"
                          />
                        </div>
                        <div class="form-group">
                          <label for="">Quận/Huyện</label>
                          <input
                            type="text"
                            v-model="newAddress.district"
                            class="form-control"
                            placeholder="Huyện"
                          />
                        </div>
                        <div class="form-group">
                          <label for="">Xã/Phường</label>
                          <input
                            type="text"
                            v-model="newAddress.commune"
                            class="form-control"
                            placeholder="Xã"
                          />
                        </div>
                        <div class="form-group">
                          <label for="">Địa chỉ chi tiết</label>
                          <input
                            type="text"
                            v-model="newAddress.desc"
                            class="form-control"
                            placeholder="Địa chỉ chi tiết"
                          />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          data-dismiss="modal"
                          aria-label="Close"
                          type="button"
                          class="btn btn-primary close"
                          @click="createAddress()"
                        >
                          <span aria-hidden="true"></span>
                          Lưu
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div
                class="modal fade"
                id="exampleModal1"
                tabindex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog" role="document">
                  <form>
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">
                          sửa địa chỉ
                        </h5>
                        <button
                          type="button"
                          class="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div class="modal-body">
                        <div class="form-group">
                          <label for="">Tỉnh/Thành Phố</label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="updateAddress.PROVINCE"
                          />
                        </div>
                        <div class="form-group">
                          <label for="">Quận/Huyện </label>
                          <input
                            type="text"
                            class="form-control"
                            v-model="updateAddress.DISTRICT"
                          />
                        </div>
                        <div class="form-group">
                          <label for="">Xã/Phường</label>
                          <input
                            type="text"
                            v-model="updateAddress.COMMUNE"
                            class="form-control"
                          />
                        </div>
                        <div class="form-group">
                          <label for="">Địa chỉ chi tiết</label>
                          <input
                            type="text"
                            v-model="updateAddress.DESC"
                            class="form-control"
                          />
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button
                          data-dismiss="modal"
                          aria-label="Close"
                          type="button"
                          class="btn btn-primary close"
                          @click="saveUpdateAddress(updateAddress._id)"
                        >
                          <span aria-hidden="true"></span>
                          Lưu
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div
                class="row border my-4"
                v-for="item in address"
                :key="item._id"
              >
                <div class="text-end">
                  <button @click="deleteAddress(item._id)">
                    <i class="text-danger bi bi-x-circle-fill"></i>
                  </button>
                </div>
                <div class="col-md-6">
                  <p>
                    <b>Địa chỉ:</b
                    >{{
                      " " +
                      item.DESC +
                      " " +
                      item.COMMUNE +
                      " " +
                      item.DISTRICT +
                      " " +
                      item.PROVINCE
                    }}
                  </p>
                  <p><b>số điện thoại:</b> {{ userById.PHONE_NUMBER }}</p>
                  <p><b>email:</b> {{ userById.EMAIL_USER }}</p>
                </div>
                <div class="col-md-6 pt-2" style="text-align: end">
                  <button
                    type="button"
                    class="btn btn-primary"
                    data-toggle="modal"
                    data-target="#exampleModal1"
                    @click="fetchAddressById(item._id)"
                  >
                    chỉnh sửa
                  </button>
                </div>
              </div>
            </div>
            <!-- tab thông tin đơn hàng -->
            <div
              class="tab-pane fade"
              :class="{ 'active show': selectedTab === 'order' }"
              id="order"
            >
              <div class="card-body pb-2">
                <h1 class="text-center">Danh sách đơn hàng mới nhất</h1>
                <div class="container mt-5">
                  <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                      <thead class="thead-dark">
                        <tr>
                          <th class="col text-center">STT</th>
                          <th class="col text-center">Mã đơn hàng</th>
                          <th class="col text-center">Ngày đặt</th>
                          <th class="col text-center">Thành tiền</th>
                          <th class="col text-center">Trạng thái thanh toán</th>
                          <th class="col text-center">
                            Phương thức thanh toán
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(order, index) in filteredOrders"
                          :key="order._id"
                        >
                          <td class="text-center">{{ index + 1 }}</td>
                          <td class="text-center">{{ order.ORDER_CODE }}</td>
                          <td class="text-center">
                            {{ formatDateTime(order.TIME_PAYMENT) }}
                          </td>
                          <td class="text-center">
                            {{
                              totalPriceOrder(order).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })
                            }}
                          </td>
                          <td class="text-center">
                            {{
                              getLastOrderStatus(order.LIST_STATUS).STATUS_NAME
                            }}
                          </td>
                          <td class="text-center">
                            {{ order.PAYMENT_METHOD }}
                          </td>
                        </tr>
                        <!-- Các dòng dữ liệu khác có thể thêm vào đây -->
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>
<script>
import VueCookies from "vue-cookies";
import AddressService from "@/services/addresses.service";
import userService from "@/services/user.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import orderService from "@/services/order.service";
import Search from "@/components/User/Home/Search.vue";
import Swal from "sweetalert2";
export default {
  name: "UserInformation",
  components: {
    NavBar,
    AppFooter,
    Search,
  },
  data() {
    return {
      orderUser: [],
      is_loading: true,
      showModal: false,
      showModalEdit: false,
      address: [],
      current_address: [],
      user: [],
      userById: [],
      updateAddress: {
        COMMUNE: "",
        DESC: "",
        DISTRICT: "",
        PROVINCE: "",
      },
      newAddress: {
        provide: "",
        district: "",
        commune: "",
        desc: "",
      },
      editedUser: {
        lastName: "",
        // middleName: "",
        // firstName: "",
        phone: "",
        email: "",
        // gender: "male",
        addresses: [],
      },
      selectedTab: "general",
      message: "",
      alertClass: "",
    };
  },
  async created() {
    await this.fetchUserLogin();
    console.log("lấy user login",this.user);
    await this.fetchUserById();
    console.log("lấy user theo ID", this.userById);
    await this.fetchOrderUser();
    console.log("lấy order theo user", this.orderUser[0]);
  },
  methods: {
    async fetchOrderUser() {
      try {
        const response = await orderService.getOrderUser();
        if (response && response.data) {
          this.orderUser = response.data;
          console.log(this.orderUser);
        }
      } catch (error) {
        console.log(error);
      }
    },
    getLastOrderStatus(statusList) {
      // Lấy trạng thái đơn hàng cuối cùng từ danh sách trạng thái
      return statusList[statusList.length - 1];
    },
    formatDateTime(dateTimeStr) {
      // Hàm format ngày giờ theo định dạng mong muốn
      // Bạn có thể sử dụng thư viện moment.js hoặc native JavaScript
      return dateTimeStr ? new Date(dateTimeStr).toLocaleString() : "";
    },
    totalPriceOrder(order) {
      let totalPriceOrder = 0;
      order.LIST_PRODUCT.forEach((product) => {
        totalPriceOrder += product.UNITPRICES * product.QLT;
      });
      return totalPriceOrder;
    },
    async fetchUserById() {
      try {
        const response = await userService.getUserById(this.user.USER_ID);
        if (response && response.data) {
          this.userById = response.data;
        } else {
          console.log("Không có dữ liệu người dùng đăng nhập.");
        }
      } catch (error) {
        console.error(error);
      }
    },

    async fetchUserLogin() {
      try {
        const response = await userService.getUserLogin();
        if (response && response.data) {
          this.user = response.data;
          console.log("User data:", this.user); // Thêm dòng này để kiểm tra
        } else {
          console.log("Không có dữ liệu người dùng đăng nhập.");
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createAddress() {
      try {
        const addAddress = await AddressService.createAddress(this.newAddress);
        this.fetchAddresses();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteAddress(id) {
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn xóa địa chỉ này không?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: `Không`,
        });
        if (result.isConfirmed) {
          const deleteAddres = await AddressService.deleteAddress(id);
          this.address = this.address.filter((item) => item._id !== id);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async fetchAddressById(id) {
      try {
        const getAddressResponse = await AddressService.getAddressById(id);
        if (getAddressResponse && getAddressResponse.data) {
          this.updateAddress = getAddressResponse.data.LIST_ADDRESS[0];
          console.log("Địa chỉ đã được lấy thành công:", this.updateAddress);
        } else {
          console.log("Không có dữ liệu địa chỉ cho id này.");
        }
      } catch (error) {
        console.error("Lỗi khi gọi service lấy địa chỉ:", error);
      }
    },

    async fetchAddresses() {
      try {
        const response = await AddressService.getAddress();
        if (response && response.data) {
          this.address = response.data;
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        this.message = "Có lỗi xảy ra khi tải danh sách địa chỉ.";
        this.alertClass = "alert-danger";
      }
    },

    async saveChanges() {
      try {
        this.message = "Đã lưu thay đổi thành công.";
        this.alertClass = "alert-success";
      } catch (error) {
        console.error("Error saving changes:", error);
        this.message = "Có lỗi xảy ra khi lưu thay đổi.";
        this.alertClass = "alert-danger";
      }
    },

    cancelEdit() {
      this.resetEditedUser();
      this.message = "";
      this.alertClass = "";
    },

    resetEditedUser() {
      this.editedUser = {
        lastName: "",
        // middleName: "",
        // firstName: "",
        phone: "",
        email: "",
        gender: "male",
        addresses: [],
      };
    },

    async logout() {
      try {
        VueCookies.remove("access_token");
        VueCookies.remove("refresh_token");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
        this.message = "Có lỗi xảy ra khi đăng xuất.";
        this.alertClass = "alert-danger";
      }
    },

    async saveUpdateAddress(id) {
      const response = await AddressService.updateAddress(
        id,
        this.updateAddress
      );
      if (response) {
        this.showModal = false;
        this.fetchAddresses();
      }
    },

    selectTab(tab) {
      this.selectedTab = tab;
    },
  },
  computed: {
    filteredOrders() {
      const uniqueOrders = {};
      this.orderUser.forEach((order) => {
        if (!uniqueOrders[order.ORDER_CODE]) {
          uniqueOrders[order.ORDER_CODE] = order;
        }
      });
      return Object.values(uniqueOrders);
    },
  },
  closeModal() {
    this.showModal = false;
  },
  mounted() {
    this.fetchAddresses();
  },
};
</script>

<style scoped>
body {
  background: #f5f5f5;
  margin-top: 20px;
}

.ui-w-80 {
  width: 80px !important;
  height: auto;
}

.btn-default {
  border-color: rgba(24, 28, 33, 0.1);
  background: rgba(0, 0, 0, 0);
  color: #4e5155;
}

label.btn {
  margin-bottom: 0;
}

.btn-outline-primary {
  border-color: #26b4ff;
  background: transparent;
  color: #26b4ff;
}

.btn {
  cursor: pointer;
}

.text-light {
  color: #babbbc !important;
}

.btn-facebook {
  border-color: rgba(0, 0, 0, 0);
  background: #3b5998;
  color: #fff;
}

.btn-instagram {
  border-color: rgba(0, 0, 0, 0);
  background: #000;
  color: #fff;
}

.card {
  background-clip: padding-box;
  box-shadow: 0 1px 4px rgba(24, 28, 33, 0.012);
}

.row-bordered {
  overflow: hidden;
}

.account-settings-fileinput {
  position: absolute;
  visibility: hidden;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.account-settings-links .list-group-item.active {
  font-weight: bold !important;
}

html:not(.dark-style) .account-settings-links .list-group-item.active {
  background: transparent !important;
}

.account-settings-multiselect ~ .select2-container {
  width: 100% !important;
}

.light-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}

.light-style .account-settings-links .list-group-item.active {
  color: #4e5155 !important;
}

.material-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}

.material-style .account-settings-links .list-group-item.active {
  color: #4e5155 !important;
}

.dark-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(255, 255, 255, 0.03) !important;
}

.dark-style .account-settings-links .list-group-item.active {
  color: #fff !important;
}

.light-style .account-settings-links .list-group-item.active {
  color: #4e5155 !important;
}

.light-style .account-settings-links .list-group-item {
  padding: 0.85rem 1.5rem;
  border-color: rgba(24, 28, 33, 0.03) !important;
}
.icon-plus i {
  font-size: 30px;
}
</style>
