<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content p-4">
        <div class="container-fluid">
          <h1 class="mb-4 text-primary">Quản lý đơn hàng</h1>
          
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="row g-3 align-items-center">
                <div class="col-auto">
                  <router-link to="/admin" class="btn btn-outline-secondary">
                    <i class="fas fa-arrow-left me-2"></i>Quay lại
                  </router-link>
                </div>
                <div class="col">
                  <div class="input-group">
                    <input
                      class="form-control"
                      type="search"
                      placeholder="Tìm kiếm theo mã đơn hàng"
                      v-model="searchQuery"
                    />
                    <button class="btn btn-outline-primary" type="submit">
                      <i class="fas fa-search"></i>
                    </button>
                  </div>
                </div>
                <div class="col-auto">
                  <select v-model="selectedStatus" class="form-select">
                    <option value="">Tất cả trạng thái</option>
                    <option v-for="status in orderStatuses" :key="status" :value="status">{{ status }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="table-responsive">
              <table class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Mã đơn hàng</th>
                    <th>Ngày đặt</th>
                    <th>Thành tiền</th>
                    <th>Trạng thái thanh toán</th>
                    <th>Trạng thái đơn hàng</th>
                    <th>Phương thức thanh toán</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in paginatedOrders" :key="order._id">
                    <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
                    <td><span class="badge bg-light text-dark">{{ order.ORDER_CODE }}</span></td>
                    <td>{{ formatDateTime(order.TIME_PAYMENT) }}</td>
                    <td>{{ totalPriceOrder(order).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) }}</td>
                    <td><span class="badge bg-info">{{ getLastOrderStatus(order.LIST_STATUS).STATUS_NAME }}</span></td>
                    <td>
                      <span :class="['badge', getStatusBadgeClass(order.ORDER_STATUS)]">
                        {{ order.ORDER_STATUS }}
                      </span>
                      <i v-if="order.ORDER_STATUS === 'Đã hủy'" 
                         @click="showCancellationReason(order)" 
                         class="fas fa-info-circle ms-2 text-muted" 
                         style="cursor: pointer;">
                      </i>
                    </td>
                    <td>{{ order.PAYMENT_METHOD }}</td>
                    <td>
                      <button @click="openEditModal(order)" class="btn btn-sm btn-outline-primary">
                        <i class="fas fa-edit me-1"></i>Sửa
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="card-footer bg-light">
              <nav aria-label="Page navigation">
                <ul class="pagination justify-content-center mb-0">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="currentPage--">
                      <span aria-hidden="true">&laquo;</span>
                    </a>
                  </li>
                  <li class="page-item disabled">
                    <span class="page-link">Trang {{ currentPage }} / {{ totalPages }}</span>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <a class="page-link" href="#" @click.prevent="currentPage++">
                      <span aria-hidden="true">&raquo;</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Modal cập nhật trạng thái -->
  <div v-if="isModalOpen" class="modal fade show" style="display: block;">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Cập nhật trạng thái đơn hàng</h5>
          <button type="button" class="btn-close" @click="closeEditModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="status" class="form-label">Chọn trạng thái:</label>
            <select v-model="selectedOrderStatus" id="status" class="form-select">
              <option value="Đã Duyệt">Đã Duyệt (Đang xử lý)</option>
              <option value="Đang vận chuyển">Giao Hàng (Đang vận chuyển)</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeEditModal">Đóng</button>
          <button type="button" class="btn btn-primary" @click="updateOrderStatus">Cập nhật</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal lý do hủy -->
  <div v-if="isReasonModalOpen" class="modal fade show" style="display: block;">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Lý do hủy đơn hàng</h5>
          <button type="button" class="btn-close" @click="closeReasonModal"></button>
        </div>
        <div class="modal-body">
          <p>{{ cancellationReason }}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeReasonModal">Đóng</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Thông báo thành công -->
  <div v-if="successMessage" class="toast-container position-fixed top-0 end-0 p-3">
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <strong class="me-auto">Thông báo</strong>
        <button type="button" class="btn-close" @click="resetSuccessMessage"></button>
      </div>
      <div class="toast-body">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import orderService from "@/services/order.service";

export default {
  name: "DashboardProductOrder",
  components: {
    Slider,
    Nav,
  },
  data() {
    return {
      adminOrders: [],
      searchQuery: "",
      selectedStatus: "",
      isReasonModalOpen: false,
      isModalOpen: false,
      selectedOrderStatus: "",
      selectedOrderId: "",
      orderStatuses: [
        "Đang xử lý",
        "Đang vận chuyển",
        "Chờ Duyệt",
        "Đã giao",
        "Chưa hoàn thành thanh toán",
        "Đã hủy"
      ],
      successMessage: "",
      currentPage: 1,
      itemsPerPage: 10,
      cancellationReason: "",
    };
  },
  async created() {
    await this.fetchAdminOrders();
  },
  methods: {
    getStatusBadgeClass(status) {
      const statusClasses = {
        'Đã giao': 'bg-success',
        'Đang xử lý': 'bg-warning text-dark',
        'Đã Duyệt': 'bg-info',
        'Chờ Duyệt': 'bg-secondary',
        'Đã hủy': 'bg-danger',
        'Đang vận chuyển': 'bg-primary',
        'Chưa hoàn thành thanh toán': 'bg-dark'
      };
      return statusClasses[status] || 'bg-secondary';
    },
    async fetchAdminOrders() {
      try {
        const response = await orderService.getOrdersAll();
        if (response && Array.isArray(response.data)) {
          this.adminOrders = response.data;
        } else {
          console.error("Dữ liệu không phải là một mảng:", response);
        }
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      }
    },
    getLastOrderStatus(statusList) {
      return statusList && statusList.length > 0 ? statusList[statusList.length - 1] : null;
    },
    formatDateTime(dateTimeStr) {
      return dateTimeStr ? new Date(dateTimeStr).toLocaleString('vi-VN') : "";
    },
    totalPriceOrder(order) {
      return order.LIST_PRODUCT.reduce((total, product) => total + product.UNITPRICES * product.QLT, 0);
    },
    openEditModal(order) {
      this.selectedOrderStatus = order.ORDER_STATUS;
      this.selectedOrderId = order._id;
      this.isModalOpen = true;
    },
    closeEditModal() {
      this.isModalOpen = false;
    },
    async updateOrderStatus() {
      try {
        if (this.selectedOrderStatus === "Đã Duyệt") {
          await orderService.updateOrderStatusToProcessing(this.selectedOrderId);
        } else if (this.selectedOrderStatus === "Đang vận chuyển") {
          await orderService.updateOrderToShipping(this.selectedOrderId);
        } else {
          console.error("Trạng thái không hợp lệ!");
          return;
        }
        this.successMessage = "Cập nhật trạng thái đơn hàng thành công!";
        await this.fetchAdminOrders();
        this.closeEditModal();
        setTimeout(() => this.resetSuccessMessage(), 3000);
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      }
    },
    showCancellationReason(order) {
      this.cancellationReason = order.CANCEL_REASON || "Không có lý do nào được cung cấp.";
      this.isReasonModalOpen = true;
    },
    closeReasonModal() {
      this.isReasonModalOpen = false;
    },
    resetSuccessMessage() {
      this.successMessage = "";
    },
  },
  computed: {
    filteredAdminOrders() {
      return this.adminOrders.filter((order) => {
        const orderCode = order.ORDER_CODE || "";
        const matchesSearch = orderCode.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesStatus = this.selectedStatus ? order.ORDER_STATUS === this.selectedStatus : true;
        return matchesSearch && matchesStatus;
      });
    },
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredAdminOrders.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredAdminOrders.length / this.itemsPerPage);
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
.toast-container {
  z-index: 1100;
}
</style>