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
                  <!-- Trạng thái upload ảnh -->
                  <div class="upload-status d-flex align-items-center">
                    <div v-if="isUploading" class="text-muted mb-0">
                      <p class="mb-0">Đang tải ảnh lên...</p>
                      <div class="spinner-border spinner-border-sm ms-2" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-muted mb-0">Dụng lượng file tối đa 1 MB</p>
                  <p class="text-muted mb-0">Định dạng: .JPEG, .PNG</p>
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
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="lastName" class="form-label">Tên</label>
                      <input class="form-control" type="text" id="lastName" v-model="userById.LAST_NAME" :readonly="!isEditing" />
                    </div>
                    <div class="mb-3 col-md-6">
                      <label for="phone" class="form-label">Số điện thoại</label>
                      <input type="text" class="form-control" id="phone" v-model="userById.PHONE_NUMBER" :readonly="!isEditing" />
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
    <div class="card">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Danh sách đơn hàng</h2>
        
        <!-- Nút lọc trạng thái -->
        <div class="d-flex justify-content-center mb-4">
          <div class="btn-group" role="group">
            <button 
              v-for="status in orderStatuses" 
              :key="status"
              type="button" 
              class="btn btn-outline-primary" 
              :class="{ active: selectedStatus === status }"
              @click="selectOrderStatus(status)"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <!-- Bảng đơn hàng -->
<div class="table-responsive">
  <table class="table table-hover">
    <thead class="table-light">
      <tr>
        <th class="text-center">STT</th>
        <th class="text-center">Thông tin sản phẩm</th>
        <th class="text-center">Thành tiền</th>
        <th class="text-center">Thanh toán</th>
        <th class="text-center">Chi tiết</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(order, index) in paginatedOrders" :key="order._id">
        <td class="text-center">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
        <td class="text-center">
          <div v-if="order.PRODUCT_DETAILS && order.PRODUCT_DETAILS.length > 0">
            <div v-for="(product, idx) in order.PRODUCT_DETAILS" :key="idx" class="product-info">
              <img 
                :src="product.attachment[0]?.FILE_URL" 
                alt="Product Image" 
                class="product-image" 
                v-if="product.attachment && product.attachment.length > 0" 
              />
              <div class="product-name">
                {{ product.name }} <!-- Hiển thị tên sản phẩm -->
              </div >
              <div class="product-key" v-for="(attribute, attrIdx) in product.listMatchKey" :key="attrIdx">
                {{ attribute.KEY }} : {{ attribute.VALUE }} <!-- Hiển thị các thuộc tính sản phẩm -->
              </div>
              
              <div class="product-quantity" >
                X{{ product.quantity }} <!-- Hiển thị số lượng -->
              </div>
            </div>
          </div>
          <div v-else>
            <p>Không có sản phẩm nào.</p> <!-- Hiển thị thông báo nếu không có sản phẩm -->
          </div>
        </td>
        <td class="text-center">{{ formatCurrency(totalPriceOrder(order)) }}</td>
        <td class="text-center">{{ order.PAYMENT_METHOD }}</td>
        <td class="text-center">
          <button class="btn btn-sm btn-info" @click="showOrderDetails(order)">
            <i class="bi bi-eye"></i> Xem
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>


        <!-- Phân trang -->
        <nav aria-label="Page navigation" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Trước</a>
            </li>
            <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Sau</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

  
      <!-- modal chi tiết đơn hàng -->
      <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="orderDetailsModalLabel">Chi tiết đơn hàng</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body" v-if="selectedOrder">
              <!-- Thanh trạng thái đơn hàng -->
            <div class="order-status">
        <div class="stepper">
          <!-- Duyệt qua từng trạng thái trong STATUS_HISTORY -->
          <div v-for="(status, index) in selectedOrder.STATUS_HISTORY" :key="index" class="stepper__step" 
          :class="{ 'stepper__step--finish': index <= getLastOrderStatusIndex(selectedOrder.STATUS_HISTORY) }">
        <div class="stepper__step-icon">
          <!-- Icon SVG -->
        </div>
        <div class="stepper__step-text">{{ status.STATUS_NAME }}</div>
        <div class="stepper__step-date">{{ formatDateTime(status.TIME) }}</div>
      </div>

        </div>
        
        <!-- Thanh tiến trình -->
        <div class="stepper__line">
          <div class="stepper__line-background"></div>
          <div class="stepper__line-foreground" :style="{ width: progressPercentage(selectedOrder.STATUS_HISTORY) }"></div>
        </div>
      </div>


        <!-- Thông tin đơn hàng -->
        <div class="order-info mt-4">
          <h6>Mã đơn hàng: {{ selectedOrder.ORDER_CODE }}</h6>
          <p>Ngày đặt: {{ formatDateTime(selectedOrder.TIME_PAYMENT) }}</p>
          <p>Trạng thái: {{ getLastOrderStatus(selectedOrder.LIST_STATUS).STATUS_NAME }}</p>
          <p>Phương thức thanh toán: {{ selectedOrder.PAYMENT_METHOD }}</p>
          <p>Địa chỉ nhận hàng: {{ selectedOrder.ADDRESS }}</p>
        </div>

        <!-- Danh sách sản phẩm -->
        <h6 class="mt-4">Sản phẩm:</h6>
        <div class="product-list">
          <div v-for="product in selectedOrder.LIST_PRODUCT" :key="product._id" class="product-item">
            <img :src="product.IMAGE" alt="Product Image" class="product-image">
            <div class="product-details">
              <h6>{{ product.NAME_PRODUCT }}</h6>
              <p>Số lượng: {{ product.QLT }}</p>
              <p>Đơn giá: {{ formatCurrency(product.UNITPRICES) }}</p>
            </div>
          </div>
        </div>

        <!-- Tổng kết đơn hàng -->
        <div class="order-summary mt-3">
          <p><strong>Tổng tiền hàng:</strong> {{ formatCurrency(totalPriceOrder(selectedOrder)) }}</p>
          <p><strong>Phí vận chuyển:</strong> {{ formatCurrency(selectedOrder.SHIPPING_FEE || 0) }}</p>
          <p><strong>Giảm giá:</strong> {{ formatCurrency(selectedOrder.DISCOUNT || 0) }}</p>
          <h5><strong>Thành tiền:</strong> {{ formatCurrency(totalPriceOrder(selectedOrder) + (selectedOrder.SHIPPING_FEE || 0) - (selectedOrder.DISCOUNT || 0)) }}</h5>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
      </div>
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
import { Modal } from 'bootstrap';

import axios from 'axios';
import VueCookies from "vue-cookies";
import AddressService from "@/services/addresses.service";
import userService from "@/services/user.service";
import NavBar from "@/components/User/layout/NavBar.vue";
import AppFooter from "@/components/User/layout/AppFooter.vue";
import orderService from "@/services/order.service";
import Search from "@/components/User/Home/Search.vue";
import productService from '@/services/product.service';
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
      selectedTab: "general",
      message: "",
      alertClass: "",
      isEditing: false, // trạng thái cho chế độ chỉnh sửa
      selectedFile: null, // Biến để lưu tệp được chọn
      previewUrl: null, // Biến để lưu đường dẫn ảnh xem trước
      isUploading: false,
      selectedStatus: 'Tất cả',
      orderStatuses: ['Tất cả', 'Chờ Duyệt', 'Đang xử lý', 'Đang vận chuyển', 'Đã giao','Đã hủy', 'Chưa hoàn thành thanh toán'],
      currentPage: 1,
      itemsPerPage: 10,
      selectedOrder: null,
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
   computed: {
   filteredOrders() {
      if (this.selectedStatus === 'Tất cả') {
        return this.orderUser;
      }
      return this.orderUser.filter(order => 
        this.getLastOrderStatus(order.LIST_STATUS).STATUS_NAME === this.selectedStatus
      );
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOrders.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    },
  },
  methods: {
    getLastOrderStatusIndex(statusList) {
    return statusList.length - 1;
    },
    progressPercentage(statusHistory) {
    const totalSteps = statusHistory.length;
    const completedSteps = statusHistory.filter(step => step.completed).length; 
    return `${(completedSteps / totalSteps) * 100}%`;
  },
     getStatusClass(status) {
      switch (status) {
        case 'Đã giao':
          return 'text-success';
        case 'Đang xử lý':
          return 'text-warning';
        case 'Đã Duyệt':
        case 'Chờ Duyệt':
          return 'text-danger';
        case 'Đang vận chuyển':
          return 'text-primary';
        default:
          return '';
      }
    },
    // async fetchOrderUser() {
    //   try {
    //     const response = await orderService.getOrderUser();
    //     if (response && response.data) {
    //       this.orderUser = response.data;
    //       console.log(this.orderUser);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    async fetchOrderUser() {
        try {
            const response = await orderService.getOrderUser();
            if (response && response.data) {
                this.orderUser = response.data;

                // Lặp qua từng đơn hàng để lấy thông tin sản phẩm
                for (let order of this.orderUser) {
                    order.PRODUCT_DETAILS = []; // Tạo một mảng để lưu thông tin sản phẩm
                    for (let product of order.LIST_PRODUCT) {
                        const productData = await productService.getById(product.ID_PRODUCT);
                        if (productData && productData.data) {
                            // Thêm thông tin sản phẩm vào mảng
                            order.PRODUCT_DETAILS.push({
                                name: productData.data.NAME_PRODUCT,
                                attachment: productData.data.LIST_FILE_ATTACHMENT_DEFAULT,
                                quantity: product.QLT, // Lấy số lượng từ LIST_PRODUCT
                            listMatchKey: product.LIST_MATCH_KEY // Truy cập các thuộc tính từ LIST_PRODUCT
                            });
                        }
                    }
                }

                console.log(this.orderUser); // Kiểm tra thông tin đơn hàng đã được cập nhật
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
         this.isUploading = true; 
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
           this.isUploading = false;
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
        // Gọi API để tạo địa chỉ mới
        const addAddress = await AddressService.createAddress(this.newAddress);
        
        // Hiển thị thông báo thành công khi tạo địa chỉ mới
        await Swal.fire({
          icon: "success",
          title: "Thêm địa chỉ thành công",
          text: addAddress.message,
        });

        // Tải lại danh sách địa chỉ
        this.fetchAddresses();
      } catch (error) {
        console.error("Lỗi khi thêm địa chỉ:", error);
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi thêm địa chỉ.",
        });
      }
    },

      async deleteAddress(id) {
      try {
        const result = await Swal.fire({
          title: "Bạn có chắc chắn xóa địa chỉ này không?",
          showDenyButton: false,
          showCancelButton: true,
          confirmButtonText: "Có",
          denyButtonText: "Không",
        });

        if (result.isConfirmed) {
          // Gọi API từ AddressService để xóa địa chỉ
          const deletedAddress = await AddressService.deleteAddress(id);
          
          // Hiển thị thông báo thành công khi xóa địa chỉ
          await Swal.fire({
            icon: "success",
            title: "Xóa địa chỉ thành công",
            text: deletedAddress.message, // Sử dụng thông báo trả về
          });

          // Cập nhật danh sách địa chỉ sau khi xóa thành công
          this.address = this.address.filter((item) => item._id !== id);
        }
      } catch (error) {
        console.error("Lỗi khi xóa địa chỉ:", error);
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi xóa địa chỉ.",
        });
      }
    },


    async saveUpdateAddress(id) {
      try {
        const response = await AddressService.updateAddress(id, this.updateAddress);
        if (response) {
          this.showModal = false;
          this.fetchAddresses();
          
          // Hiển thị thông báo thành công khi cập nhật địa chỉ
          await Swal.fire({
            icon: "success",
            title: "Cập nhật địa chỉ thành công",
            text: "Địa chỉ đã được cập nhật thành công.",
          });
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật địa chỉ:", error);
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Có lỗi xảy ra khi cập nhật địa chỉ.",
        });
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
    selectTab(tab) {
      this.selectedTab = tab;
    },
    selectOrderStatus(status) {
      this.selectedStatus = status;
      this.currentPage = 1;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    },
    getStatusBadgeClass(status) {
      const classes = {
        'Đã giao': 'badge bg-success',
        'Đang xử lý': 'badge bg-warning text-dark',
        'Đang vận chuyển': 'badge bg-info text-dark',
        'Chờ duyệt': 'badge bg-secondary',
        'Chưa hoàn thành thanh toán': 'badge bg-danger'
      };
      return classes[status] || 'badge bg-primary';
    },
    showOrderDetails(order) {
      this.selectedOrder = order;
      const modal = new Modal(document.getElementById('orderDetailsModal'));
      modal.show();
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
@import '../style.css/userinfomation.css';
</style>

