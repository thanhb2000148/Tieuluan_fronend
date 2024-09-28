<template>
  <Search />
  <NavBar />
 <div class="container light-style flex-grow-1 container-p-y">
    <h4 class="font-weight-bold py-3 mb-4">Hồ Sơ Của Tôi</h4>
    <p class="text-muted">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
    
    <div v-if="message" :class="['alert', alertClass]" role="alert">
      {{ message }}
    </div>

    <div class="card overflow-hidden">
      <div class="row no-gutters row-bordered row-border-light">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links">
            <a class="list-group-item list-group-item-action" :class="{ 'active': selectedTab === 'general' }" href="#account-general" @click="selectTab('general')">Thông tin tài khoản</a>
            <a class="list-group-item list-group-item-action" :class="{ 'active': selectedTab === 'shipping-address' }" href="#shipping-address" @click="selectTab('shipping-address')">Địa chỉ giao hàng</a>
            <a class="list-group-item list-group-item-action" :class="{ 'active': selectedTab === 'order' }" href="#order" @click="selectTab('order')">Đơn hàng</a>
            <button type="button" class="btn btn-danger mt-3 my-3" @click="logout">Đăng xuất</button>
          </div>
        </div>
        <div class="col-md-9">
          <div class="tab-content">
            <div class="tab-pane fade" :class="{ 'active show': selectedTab === 'general' }" id="account-general">
              <div class="card-body">
                <div class="d-flex align-items-start align-items-sm-center gap-4">
                  <img :src="userById.AVT_URL || previewUrl || 'https://bootdey.com/img/Content/avatar/avatar1.png'" alt="Avatar" class="d-block rounded" height="100" width="100" id="uploadedAvatar"/>
                  <div class="button-wrapper">
                    <label for="upload" class="btn btn-primary me-2 mb-4" tabindex="0">
                      <span class="d-none d-sm-block">Chọn Ảnh</span>
                      <i class="bx bx-upload d-block d-sm-none"></i>
                      <input type="file" id="upload" class="account-file-input" hidden accept="image/png, image/jpeg" @change="handleFileChange"/>
                    </label>
                    <p class="text-muted mb-0">Dụng lượng file tối đa 1 MB</p>
                    <p class="text-muted mb-0">Định dạng:.JPEG, .PNG</p>
                  </div>
                </div>
              </div>
              <hr class="my-0" />
              <div class="card-body">
                <form id="formAccountSettings" @submit.prevent="saveUser">
                  <div class="row">
                    <div class="mb-3 col-md-6">
                      <label for="email" class="form-label">Email</label>
                      <input class="form-control" type="email" id="email" v-model="userById.EMAIL_USER" readonly />
                      <!-- <a href="#" class="text-primary">Thay Đổi</a> -->
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="lastName" class="form-label">Tên</label>
                      <input class="form-control" type="text" id="lastName" v-model="userById.LAST_NAME" :readonly="!isEditing" />
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="phone" class="form-label">Số điện thoại</label>
                      <input type="text" class="form-control" id="phone" v-model="userById.PHONE_NUMBER" :readonly="!isEditing" />
                      <!-- <a href="#" class="text-primary" v-if="!userById.PHONE_NUMBER">Thêm</a> -->
                    </div>
                   <div class="mb-3 col-md-6">
                      <label for="birthday" class="form-label">Ngày sinh</label>
                      <input class="form-control" type="date" id="birthday" v-model="userById.BIRTHDAY" :readonly="!isEditing" />
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="gender" class="form-label">Giới tính</label>
                      <div>
                        <label class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" v-model="userById.GENGER_USER" value="Nam" :disabled="!isEditing">
                          <span class="form-check-label">Nam</span>
                        </label>
                        <label class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" v-model="userById.GENGER_USER" value="Nữ" :disabled="!isEditing">
                          <span class="form-check-label">Nữ</span>
                        </label>
                        <label class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" v-model="userById.GENGER_USER" value="Khác" :disabled="!isEditing">
                          <span class="form-check-label">Khác</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <button type="submit" class="btn btn-primary me-2" v-if="isEditing">Lưu</button>
                    <button type="button" class="btn btn-outline-secondary" @click="toggleEdit">{{ isEditing ? 'Hủy' : 'Chỉnh sửa' }}</button>
                  </div>
                </form>
              </div>
            </div>
            
            <!-- Địa chỉ giao hàng -->
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

            <!-- Thông tin đơn hàng -->
            <div class="tab-pane fade" :class="{ 'active show': selectedTab === 'order' }" id="order">
              <div class="card-body pb-2">
                <h1 class="text-center">Danh sách đơn hàng mới nhất</h1>
                <div class="container mt-5">
                  <div class="table-responsive">
                    <table class="table table-bordered table-striped">
                      <thead class="thead-dark">
                        <tr>
                          <th class="text-center">STT</th>
                          <th class="text-center">Mã đơn hàng</th>
                          <th class="text-center">Ngày đặt</th>
                          <th class="text-center">Thành tiền</th>
                          <th class="text-center">Trạng thái thanh toán</th>
                          <th class="text-center">Phương thức thanh toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(order, index) in filteredOrders" :key="order._id">
                          <td class="text-center">{{ index + 1 }}</td>
                          <td class="text-center">{{ order.ORDER_CODE }}</td>
                          <td class="text-center">{{ formatDateTime(order.TIME_PAYMENT) }}</td>
                          <td class="text-center">{{ totalPriceOrder(order).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) }}</td>
                          <td class="text-center">{{ getLastOrderStatus(order.LIST_STATUS).STATUS_NAME }}</td>
                          <td class="text-center">{{ order.PAYMENT_METHOD }}</td>
                        </tr>
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
import axios from 'axios';
import VueCookies from "vue-cookies";
import AddressService from "@/services/addresses.service";
import userService from "@/services/user.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import orderService from "@/services/order.service";
import Search from "@/components/User/Home/Search.vue";
// import { uploadImage } from '@/services/imageService';
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
      // editedUser: {
      //   lastName: "",
      //   // middleName: "",
      //   // firstName: "",
      //   phone: "",
      //   email: "",
      //   // gender: "male",
      //   addresses: [],
      // },
      selectedTab: "general",
      message: "",
      alertClass: "",
      isEditing: false, // trạng thái cho chế độ chỉnh sửa
      selectedFile: null, // Biến để lưu tệp được chọn
      previewUrl: null, // Biến để lưu đường dẫn ảnh xem trước
    };
  },
  async created() {
    await this.fetchUserLogin();
    console.log("lấy user login", this.user);
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
          if (this.userById.BIRTHDAY) {
            const date = new Date(this.userById.BIRTHDAY);
            this.userById.BIRTHDAY = date.toISOString().split('T')[0]; // Chỉ lấy phần ngày theo định dạng YYYY-MM-DD
          }
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
    toggleEdit() {
      this.isEditing = !this.isEditing; // Chuyển đổi chế độ chỉnh sửa
    },
    // handleFileChange(event) {
    //   this.selectedFile = event.target.files[0]; // Lưu file đã chọn
    //   this.previewUrl = URL.createObjectURL(this.selectedFile); // Cập nhật đường dẫn xem trước
    // },
    async handleFileChange(event) {
    this.selectedFile = event.target.files[0]; // Lưu file đã chọn

    // Cập nhật đường dẫn xem trước
    if (this.selectedFile) {
      this.previewUrl = URL.createObjectURL(this.selectedFile); // Xem trước ảnh đã chọn

      // Gọi hàm lưu người dùng, hàm saveUser sẽ tự xử lý việc upload ảnh nếu có file
      await this.saveUser(); // Lưu người dùng và upload ảnh
    }
  },
    async uploadImage() {
      try {
        const formData = new FormData();
        formData.append('image', this.selectedFile); // selectedFile là file ảnh đã chọn

        // Gọi API upload ảnh
        const response = await axios.post('http://localhost:8000/v1/upload/', formData);
        return response.data.data.url; // URL ảnh từ Cloudinary

      } catch (error) {
        console.error('Lỗi khi tải ảnh lên:', error);
        return null; // Trả về null nếu có lỗi
      }
    },

    async saveUser() {
      try {
        let imageUrl = null;
        // Nếu có tệp đã chọn, gọi uploadImage
        if (this.selectedFile) {
          imageUrl = await this.uploadImage();
          if (!imageUrl) {
            this.message = "Lỗi khi tải ảnh lên.";
            this.alertClass = "alert-danger";
            return; // Dừng lại nếu không tải ảnh thành công
          }
        }

        const updatedUser = {
          LAST_NAME: this.userById.LAST_NAME,
          PHONE_NUMBER: this.userById.PHONE_NUMBER,
          AVT_URL: imageUrl || this.userById.AVT_URL, // Gửi URL ảnh vào API updateUser nếu có
          BIRTHDAY: this.userById.BIRTHDAY, // Thêm trường ngày sinh
          GENGER_USER: this.userById.GENGER_USER, // Thêm trường giới tính
          EMAIL_USER: this.userById.EMAIL_USER

        };

       const response = await userService.updateUser(this.user.USER_ID, updatedUser);

        if (response) {
        // Cập nhật lại thông tin người dùng và URL ảnh trong `this.userById`
        this.userById.AVT_URL = imageUrl || this.userById.AVT_URL;
        this.isEditing = false; // Đóng chế độ chỉnh sửa sau khi lưu
        this.message = "Cập nhật thông tin thành công.";
        this.alertClass = "alert-success";
      }
        // // Gọi API cập nhật thông tin người dùng
        // await userService.updateUser(this.user.USER_ID, updatedUser);
        // this.isEditing = false; // Đóng chế độ chỉnh sửa sau khi lưu
        // this.message = "Cập nhật thông tin thành công.";
        // this.alertClass = "alert-success";

      } catch (error) {
        console.error("Lỗi khi cập nhật thông tin người dùng:", error);
        this.message = "Có lỗi xảy ra khi cập nhật thông tin.";
        this.alertClass = "alert-danger";
      }
    },
  
    async createAddress() {
      try {
        // eslint-disable-next-line no-unused-vars
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
          // eslint-disable-next-line no-unused-vars
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
