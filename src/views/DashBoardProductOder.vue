<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content px-3 py-2">
        <div class="container-fluid">
          <h1 class="mb-4 text-center">Quản lý đơn hàng</h1>
          <div class="d-flex justify-content-between align-items-center mb-4">
            <!-- Nút Quay lại -->
            <router-link to="/admin" class="btn btn-info button-add">
              <i class="fas fa-arrow-left"></i> Quay lại
            </router-link>

            <!-- Thanh Tìm kiếm -->
            <form class="form-inline" @submit.prevent>
              <div class="input-group">
                <input
                  class="form-control"
                  type="search"
                  placeholder="Tìm kiếm theo mã đơn hàng"
                  aria-label="Search"
                  v-model="searchQuery"
                />
                <div class="input-group-append">
                  <button class="btn btn-outline-success" type="submit">
                    <i class="fas fa-search"></i>
                  </button>
                </div>
              </div>
            </form>

            <!-- Lọc theo Trạng thái -->
            <select v-model="selectedStatus" class="form-control" style="width: 200px;">
              <option value="">Tất cả trạng thái</option>
              <option v-for="status in orderStatuses" :key="status" :value="status">{{ status }}</option>
            </select>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-hover">
              <thead>
                <tr class="text-center">
                  <th class="space-order">STT</th>
                  <th class="space-code">Mã đơn hàng</th>
                  <th class="space-date">Ngày đặt</th>
                  <th class="space-total">Thành tiền</th>
                  <th class="space-status">Trạng thái thanh toán</th>
                  <th class="space-statusoder">Trạng thái đơn hàng</th>
                  <th class="space-payment">Phương thức thanh toán</th>
                  <th class="space-action">Hành động</th>
                </tr>
              </thead>
              <tbody v-if="filteredAdminOrders.length > 0" class="text-center">
                <tr v-for="(order, index) in filteredAdminOrders" :key="order._id">
                  <td>{{ index + 1 }}</td>
                  <td>{{ order.ORDER_CODE }}</td>
                  <td>{{ formatDateTime(order.TIME_PAYMENT) }}</td>
                  <td>{{ totalPriceOrder(order).toLocaleString("vi-VN", { style: "currency", currency: "VND" }) }}</td>
                  <td>{{ getLastOrderStatus(order.LIST_STATUS).STATUS_NAME }}</td>
                  <td :class="getStatusClass(order.ORDER_STATUS)">
                    {{ order.ORDER_STATUS }}
                  </td>
                  <td>{{ order.PAYMENT_METHOD }}</td>
                  <td>
                    <button @click="openEditModal(order)" class="btn btn-secondary btn-sm">Sửa</button>
                  </td>
                </tr>
              </tbody>
              <tfoot v-else>
                <tr>
                  <td colspan="7" class="non-order">Không có đơn hàng nào!</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Modal Edit Order Status -->
          <div v-if="isModalOpen" class="modal">
            <div class="modal-content">
              <span class="close" @click="closeEditModal">&times;</span>
              <h2>Chỉnh sửa trạng thái đơn hàng</h2>

              <!-- Chọn trạng thái đơn hàng -->
              <label for="status">Chọn trạng thái:</label>
              <select v-model="selectedOrderStatus" id="status">
                <option value="Đã Duyệt">Đã Duyệt (Đang xử lý)</option>
                <option value="Đang vận chuyển">Giao Hàng (Đang vận chuyển)</option>
              </select>

              <!-- Nút cập nhật -->
              <button @click="updateOrderStatus" class="btn btn-primary">Cập nhật</button>
            </div>
          </div>

          <!-- Hiển thị thông báo -->
          <div v-if="successMessage" class="alert alert-success" role="alert">
            {{ successMessage }}
            <button @click="resetSuccessMessage" class="btn btn-sm btn-outline-success">OK</button>
          </div>
        </div>
      </main>
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
      selectedStatus: "", // Biến để lưu trạng thái được chọn
      isModalOpen: false,
      selectedOrderStatus: "",
      selectedOrderId: "",
      orderStatuses: [
      "Đang xử lý", 
      "Đang vận chuyển", 
      "Chờ Duyệt", 
      "Đã giao", 
      "Chưa hoàn thành thanh toán"
    ], // Cập nhật danh sách trạng thái đơn hàng
      successMessage: "",
    };
  },
  async created() {
    await this.fetchAdminOrders();
  },
  methods: {
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
    async fetchAdminOrders() {
      try {
        const response = await orderService.getOrdersAll();
        console.log("Dữ liệu từ server:", response);

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
      return dateTimeStr ? new Date(dateTimeStr).toLocaleString() : "";
    },
    totalPriceOrder(order) {
      let totalPriceOrder = 0;
      order.LIST_PRODUCT.forEach((product) => {
        totalPriceOrder += product.UNITPRICES * product.QLT;
      });
      return totalPriceOrder;
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
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      }
    },
    resetSuccessMessage() {
      this.successMessage = "";
      this.selectedOrderStatus = "";
      this.selectedOrderId = "";
    },
  },
  computed: {
   filteredAdminOrders() {
    return this.adminOrders.filter((order) => {
      const orderCode = order.ORDER_CODE || "";
      const matchesSearch = orderCode
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus
        ? order.ORDER_STATUS === this.selectedStatus
        : true;

      return matchesSearch && matchesStatus;
    });
  },
  },
};
</script>


<style>
.modal {
  display: block; /* Hiện modal */
  position: fixed;
  z-index: 1; /* Đặt trên cùng */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Bỏ qua thanh cuộn */
  background-color: rgb(0, 0, 0); /* Màu nền */
  background-color: rgba(0, 0, 0, 0.4); /* Nền trong suốt */
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto; /* Đặt ở giữa */
  padding: 20px;
  border: 1px solid #888;
  width: 80%; /* Có thể điều chỉnh kích thước */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.text-success {
  color: green;
}

.text-warning {
  color: orange;
}

.text-danger {
  color: red;
}
.alert {
  position: fixed; /* Đặt vị trí cố định */
  top: 20px; /* Khoảng cách từ trên cùng */
  left: 50%; /* Đặt ở giữa theo chiều ngang */
  transform: translateX(-50%); /* Căn giữa thông báo */
  z-index: 999; /* Đặt ở trên cùng */
  width: 80%; /* Đặt chiều rộng thông báo */
  max-width: 600px; /* Đặt chiều rộng tối đa */
  padding: 15px; /* Khoảng cách bên trong */
  border-radius: 5px; /* Bo tròn góc */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Thêm bóng đổ */
  transition: all 0.3s ease; /* Hiệu ứng chuyển động mượt mà */
  display: flex; /* Để dễ dàng canh chỉnh các thành phần bên trong */
  justify-content: space-between; /* Giữa các thành phần */
  align-items: center; /* Căn giữa theo chiều dọc */
}

.alert-success {
  background-color: #d4edda; /* Màu nền cho thông báo thành công */
  color: #155724; /* Màu chữ */
}

.alert button {
  border: none; /* Bỏ viền */
  background: none; /* Bỏ nền */
  color: #155724; /* Màu chữ của nút */
  cursor: pointer; /* Hiển thị con trỏ khi di chuột */
}

.alert button:hover {
  text-decoration: underline; /* Gạch chân khi di chuột */
}

</style>
