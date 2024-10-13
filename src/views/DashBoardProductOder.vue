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
            <form class="form-inline">
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
                  <th class="space-status">Trạng thái đơn hàng</th>
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
              <label for="status">Chọn trạng thái:</label>
              <select v-model="selectedOrderStatus" id="status">
                <option v-for="status in orderStatuses" :key="status" :value="status">{{ status }}</option>
              </select>
              <button @click="updateOrderStatus" class="btn btn-primary">Cập nhật</button>
            </div>
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
      selectedStatus: "",
      isModalOpen: false,
      selectedOrderStatus: "",
      orderStatuses: ["Chuẩn bị đơn hàng", "Đã giao hàng"], // Trạng thái đơn hàng cho admin
    };
  },
  async created() {
    await this.fetchAdminOrders();
  },
  methods: {
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
      this.selectedOrderStatus = this.getLastOrderStatus(order.LIST_STATUS).STATUS_NAME; // Lấy trạng thái hiện tại
      this.selectedOrderCode = order.ORDER_CODE; // Lưu mã đơn hàng để cập nhật
      this.isModalOpen = true; // Mở modal
    },
    closeEditModal() {
      this.isModalOpen = false; // Đóng modal
    },
   async updateOrderStatus() {
  try {
    // Kiểm tra trạng thái hiện tại để gọi đúng API
    const lastStatus = this.getLastOrderStatus(this.adminOrders.find(order => order.ORDER_CODE === this.selectedOrderCode).LIST_STATUS);
    
    if (lastStatus.STATUS_NAME === "Chuẩn bị đơn hàng" && this.selectedOrderStatus === "Đã giao hàng") {
      // Nếu đang chuẩn bị đơn hàng và chọn "Đã giao hàng"
      await orderService.markOrderAsDelivered(this.selectedOrderCode);
    } else if (lastStatus.STATUS_NAME === "Chờ xác nhận" && this.selectedOrderStatus === "Chuẩn bị đơn hàng") {
      // Nếu đang chờ xác nhận và chọn "Chuẩn bị đơn hàng"
      await orderService.confirmOrder(this.selectedOrderCode);
    } else {
      this.$toast.error("Trạng thái không hợp lệ!");
      return;
    }

    await this.fetchAdminOrders(); // Tải lại danh sách đơn hàng
    this.closeEditModal(); // Đóng modal
    this.$toast.success("Trạng thái đơn hàng đã được cập nhật!"); // Thông báo thành công
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    this.$toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!"); // Thông báo lỗi
  }
}

  },
  computed: {
   filteredAdminOrders() {
    return this.adminOrders.filter(order => {
      // Kiểm tra nếu ORDER_CODE không phải là null
      const orderCode = order.ORDER_CODE || ""; // Nếu null thì gán thành chuỗi rỗng
      const matchesSearch = orderCode.toLowerCase().includes(this.searchQuery.toLowerCase());

      const lastStatus = this.getLastOrderStatus(order.LIST_STATUS);
      const matchesStatus = this.selectedStatus ? lastStatus && lastStatus.STATUS_NAME === this.selectedStatus : true;

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
  background-color: rgb(0,0,0); /* Màu nền */
  background-color: rgba(0,0,0,0.4); /* Nền trong suốt */
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
</style>
