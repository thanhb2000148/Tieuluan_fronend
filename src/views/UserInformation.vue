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
                      :style="{ color: '#000', borderColor: '#000' }"
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
                          <th>THÔNG TIN SẢN PHẨM</th>
                          <th class="text-center">Thành tiền</th>
                          <th class="text-center">Thanh toán</th>
                          <th class="text-center">Chi tiết</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(order, index) in paginatedOrders" :key="order._id">
                          <td class="text-center align-middle">{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                          <td>
                            <div v-if="order.PRODUCT_DETAILS && order.PRODUCT_DETAILS.length > 0">
                              <div v-for="(product, idx) in order.PRODUCT_DETAILS" :key="idx" class="product-info">
                                <img 
                                  v-if="product.attachment && product.attachment.length > 0" 
                                  :src="product.attachment[0]?.FILE_URL" 
                                  alt="Product Image" 
                                  class="product-image" 
                                />
                                <div class="product-details">
                                  <div class="product-name">{{ product.name }}</div>
                                  <div class="product-attributes">
                                    <span v-for="(attribute, attrIdx) in product.listMatchKey" :key="attrIdx" class="product-attribute">
                                      {{ attribute.KEY }}: {{ attribute.VALUE }}
                                    </span>
                                  </div>
                                  <div class="product-quantity">x{{ product.quantity }}</div>
                                </div>
                              </div>
                            </div>
                            <div v-else>
                              <p>Không có sản phẩm nào.</p>
                            </div>
                          </td>
                          <td class="text-center align-middle">{{ formatCurrency(totalPriceOrder(order)) }}</td>
                          <td class="text-center align-middle">{{ order.PAYMENT_METHOD }}</td>
                          <td class="text-center align-middle">
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
                    <div class="order-status">
                  <div class="stepper">
                  <div class="stepper__line">
                    <div class="stepper__line-background"></div>
                    <div class="stepper__line-foreground" :style="{ width: progressPercentage }"></div>
                  </div>
                  <div v-for="(status, index) in allPossibleStatuses" :key="index" class="stepper__step" 
                    :class="{ 
                        'stepper__step--active': isStatusActive(status), 
                        'stepper__step--completed': isStatusCompleted(status) 
                    }">
                    <div class="stepper__step-icon">
                      <svg v-if="status === 'Chờ Duyệt'" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                      </svg>
                      <svg v-else-if="status === 'Đang xử lý'" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
                      </svg>
                      <svg v-else-if="status === 'Đang vận chuyển'" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                     <svg v-else-if="status === 'Đã hủy'" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                      <svg v-else-if="status === 'Đã giao'" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      <svg v-else-if="status === 'Đơn Hàng Đã Hoàn Thành'" viewBox="0 0 24 24" width="24" height="24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div class="stepper__step-text">{{ status }}</div>
                    <div v-if="isStatusActive(status)" class="stepper__step-date">
                      {{ getStatusDate(status) }}
                    </div>
                  </div>
                </div>


                    </div>
                    <!-- Thông tin đơn hàng -->
                    <div class="order-info mt-4">
                      <h6>Mã đơn hàng: {{ selectedOrder.ORDER_CODE }}</h6>
                      <p>Ngày đặt: {{ formatDateTime(selectedOrder.TIME_PAYMENT) }}</p>
                      <p>Trạng thái: {{ selectedOrder.ORDER_STATUS }}</p>
                      <p>Phương thức thanh toán: {{ selectedOrder.PAYMENT_METHOD }}</p>
                      <p>Địa chỉ nhận hàng: 
                        {{ selectedOrder.ADDRESS_USER.DESC }}, 
                        {{ selectedOrder.ADDRESS_USER.COMMUNE }}, 
                        {{ selectedOrder.ADDRESS_USER.DISTRICT }}, 
                        {{ selectedOrder.ADDRESS_USER.PROVINCE }}
                      </p>
                      <p>Số điện thoại: {{ selectedOrder.PHONE_USER }}</p>
                      <div v-if="selectedOrder.ORDER_STATUS === 'Đã hủy'">
                        <strong style="color: red;">Lý do hủy:</strong> {{ selectedOrder.CANCEL_REASON }}
                      </div>
                    </div>
                    <!-- Danh sách sản phẩm -->
                    <h6 class="mt-4">Sản phẩm:</h6>
                    <div class="product-list">
                      <div v-for="product in selectedOrder.LIST_PRODUCT" :key="product._id" class="product-item">
                        <img 
                          v-if="selectedOrder.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT?.length > 0" 
                          :src="selectedOrder.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0].FILE_URL" 
                          alt="Product Image" 
                          class="product-image"
                        />
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
                      <h5><strong>Thành tiền:</strong> {{ formatCurrency(totalPriceOrder(selectedOrder) + (selectedOrder.SHIPPING_FEE || 0) - (selectedOrder.DISCOUNT || 0)) }}</h5>
                    </div>
                    <!-- Nút nhận hàng -->
                    <div v-if="selectedOrder.ORDER_STATUS === 'Đang vận chuyển'" class="text-center mt-4">
                      <button class="btn btn-success" @click=" confirmSucess(selectedOrder)">
                        Nhận hàng
                      </button>
                    </div>
                     <!-- Nút hủy đơn hàng -->
                      <div v-if="selectedOrder && (selectedOrder.ORDER_STATUS === 'Chờ Duyệt' || selectedOrder.ORDER_STATUS === 'Đang xử lý')" class="text-center mt-4">
                        <button class="btn btn-danger" @click="openCancelModal(selectedOrder)">
                          Hủy đơn hàng
                        </button>
                      </div>
                     <!-- Modal Nhập Lý Do Hủy -->
                      <div v-if="showCancelModal" class="modal fade show" tabindex="-1" role="dialog" aria-labelledby="cancelModalLabel" aria-hidden="false" style="display: block;">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="cancelModalLabel">Chọn lý do hủy đơn hàng</h5>
                              <button type="button" class="close" @click="showCancelModal = false" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div class="modal-body">
                              <div class="form-group">
                                <label for="cancelReason">Lý do hủy:</label>
                                <select v-model="selectedReason" class="form-control" id="cancelReason">
                                  <option disabled value="">Chọn lý do...</option>
                                  <option v-for="reason in cancelReasons" :key="reason" :value="reason">
                                    {{ reason }}
                                  </option>
                                </select>
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" @click="showCancelModal = false">Hủy</button>
                              <button type="button" class="btn btn-danger" @click="confirmCancel">Xác nhận hủy</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="closeOrderDetails">Đóng</button>
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
      orderStatuses: ['Tất cả', 'Chờ Duyệt', 'Đang xử lý', 'Đang vận chuyển', 'Đã giao', 'Đã hủy'],
      allPossibleStatuses: ['Chờ Duyệt', 'Đang xử lý', 'Đang vận chuyển', 'Đã giao','Đã hủy',],
      currentPage: 1,
      itemsPerPage: 3, // các đơn hàng thoe trang
      cancelReason: "", // Lý do hủy
      showCancelModal: false, // Hiển thị modal
      selectedOrder: null,
      selectedReason: '', // Lý do đã chọn
      cancelReasons: [
        "Không còn nhu cầu",
        "Tôi muốn mua sản phẩm khác",
        "Đặt nhầm",
        "Lý do khác"
      ],
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
  mounted() {
    this.fetchProductImages();
    this.fetchAddresses();
  },

  computed: {
     progressPercentage() {
    // Kiểm tra nếu selectedOrder hoặc STATUS_HISTORY không tồn tại
      if (!this.selectedOrder || !this.selectedOrder.STATUS_HISTORY) {
        return '0%'; // Hoặc giá trị mặc định khác
      }
    
    const activeIndex = this.getLastOrderStatusIndex(this.selectedOrder.STATUS_HISTORY);
    return `${(activeIndex / (this.allPossibleStatuses.length - 1)) * 100}%`;
  },
  filteredOrders() {
    if (this.selectedStatus === 'Tất cả') {
      return this.orderUser; // Nếu chọn 'Tất cả', trả về tất cả đơn hàng
    }
    return this.orderUser.filter(order => 
      order.ORDER_STATUS === this.selectedStatus // Lọc theo ORDER_STATUS
    );
  },
  paginatedOrders() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredOrders.slice(start, end); // Phân trang trên danh sách đã lọc
  },
  totalPages() {
    return Math.ceil(this.filteredOrders.length / this.itemsPerPage); // Tính tổng số trang
  },
},

  methods: {
   async confirmSucess(order) {
    try {
      const orderId = order._id; // Lấy ID đơn hàng từ đối tượng order
      const updatedOrder = await orderService.updateOrderStatusSuccess(orderId);
      // Cập nhật trạng thái trong selectedOrder
      this.selectedOrder.ORDER_STATUS = updatedOrder.ORDER_STATUS;
      this.selectedOrder.LIST_STATUS = updatedOrder.LIST_STATUS; // Cập nhật LIST_STATUS mới


      Swal.fire({
        icon: 'success',
        title: 'Nhận đơn hàng thành công!',
        showConfirmButton: true,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Có lỗi xảy ra!',
        text: error.message || 'Cập nhật trạng thái đơn hàng thất bại!',
      });
    }
    },
    async cancelOrder(order) {
      if (!order || !order._id) {
        console.error('Đơn hàng không hợp lệ:', order);
        Swal.fire({
          icon: 'error',
          title: 'Đơn hàng không hợp lệ!',
          text: 'Vui lòng thử lại sau.',
        });
        return;
      }

        try {
          await orderService.cancelOrder(order._id); // Gọi API hủy đơn hàng
          await this.fetchOrderUser(); // Cập nhật danh sách đơn hàng
          Swal.fire({
            icon: 'success',
            title: 'Hủy đơn hàng thành công!',
            showConfirmButton: true,
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Hủy đơn hàng thất bại!',
            text: error.message || 'Có lỗi xảy ra trong quá trình hủy đơn hàng.',
          });
        }
      },
      openCancelModal(order) {
          this.selectedOrder = order; // Lưu đơn hàng đang chọn
          this.cancelReason = ''; // Reset lý do hủy
          this.showCancelModal = true; // Mở modal
        },
        async confirmCancel() {
        // Kiểm tra xem người dùng đã chọn lý do chưa
        if (!this.selectedReason) {
          Swal.fire({
            icon: 'warning',
            title: 'Chưa chọn lý do',
            text: 'Vui lòng chọn lý do hủy đơn hàng.',
          });
          return;
        }

        try {
          // Gọi dịch vụ hủy đơn hàng với lý do đã chọn
          await orderService.cancelOrder(this.selectedOrder._id, this.selectedReason);
          await this.fetchOrderUser(); // Cập nhật danh sách đơn hàng sau khi hủy
          this.showCancelModal = false; // Đóng modal
          Swal.fire({
            icon: 'success',
            title: 'Hủy đơn hàng thành công!',
          });
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: 'error',
            title: 'Có lỗi xảy ra!',
            text: error.message || 'Hủy đơn hàng thất bại.',
          });
        }
      },
          selectOrderStatus(status) {
          this.selectedStatus = status;
          this.currentPage = 1; // Reset về trang đầu tiên khi thay đổi trạng thái
          },

          getLastOrderStatusIndex(statusHistory) {
            // Kiểm tra nếu statusHistory không tồn tại hoặc không có phần tử
            if (!statusHistory || statusHistory.length === 0) {
              return -1; // Hoặc giá trị mặc định khác
            }

        // Lấy trạng thái cuối cùng trong STATUS_HISTORY
        const lastStatus = statusHistory[statusHistory.length - 1].status;
        
        return this.allPossibleStatuses.findIndex(status => 
          status === lastStatus
        );
      },

          getStatusDate(status) {
            const statusObj = this.selectedOrder.STATUS_HISTORY.find(s => s.STATUS_NAME === status);
            return statusObj ? this.formatDateTime(statusObj.updatedAt) : '';
          },
        isStatusActive(status) {
          return this.selectedOrder.ORDER_STATUS === status;
          },
        isStatusCompleted(status) {
          return this.selectedOrder.STATUS_HISTORY.some(s => s.status === status);
      },


      async fetchProductImages() {
        try {
          for (let product of this.selectedOrder.LIST_PRODUCT) {
            // Không cần gọi API nữa nếu bạn đã có thông tin trong selectedOrder
            product.IMAGE = this.selectedOrder.PRODUCT.LIST_FILE_ATTACHMENT_DEFAULT[0]?.FILE_URL; // Lấy URL của ảnh mặc định
            product.NAME_PRODUCT = this.selectedOrder.PRODUCT.NAME_PRODUCT; // Lưu tên sản phẩm
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        }
      },
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
        Swal.fire({
          title: 'Lỗi',
          text: 'Lỗi khi tải ảnh lên.',
          icon: 'error',
          confirmButtonText: 'Đóng'
        });
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
      Swal.fire({
        title: 'Thành công',
        text: 'Cập nhật thông tin thành công.',
        icon: 'success',
        confirmButtonText: 'Đóng'
      });
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    Swal.fire({
      title: 'Có lỗi xảy ra',
      text: 'Có lỗi xảy ra khi cập nhật thông tin.',
      icon: 'error',
      confirmButtonText: 'Đóng'
    });
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
    // showOrderDetails(order) {
    //   this.selectedOrder = order;
    //   const modal = new Modal(document.getElementById('orderDetailsModal'));
    //   modal.show();
    // },
    showOrderDetails(order) {
    this.selectedOrder = order;
    // Kiểm tra nếu chưa khởi tạo modal
    if (!this.orderModalInstance) {
      this.orderModalInstance = new Modal(document.getElementById('orderDetailsModal'), {
        backdrop: 'static', // để ngăn việc đóng modal khi click bên ngoài
        keyboard: false     // ngăn việc đóng modal khi nhấn phím ESC
      });
    }
    this.orderModalInstance.show();
  },
  closeOrderDetails() {
    if (this.orderModalInstance) {
      this.orderModalInstance.hide();
    }
  },
    closeModal() {
    this.showModal = false;
   },
 
  },
  
  
};
</script>

<style scoped>
@import '../style.css/userinfomation.css';
</style>

