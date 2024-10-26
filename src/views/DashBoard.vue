<template>
  <div class="wrapper">
    <Slider />
    <div class="main">
      <Nav />
      <main class="content">
        <div class="container">
          <div class="header">
            <h4 class="title">Tổng quan</h4>
          </div>

          <!-- Stats Cards -->
          <!-- Stats Cards -->
<div class="stats-grid">
  <div class="stat-card orders-card">
    <div class="stat-content">
      <div class="stat-icon">
        <i class="fas fa-shopping-cart"></i>
      </div>
      <div class="stat-details">
        <h5>Đơn hàng</h5>
        <h3>{{ orderCount }}</h3>
        <div class="stat-change increase">
          <i class="fas fa-arrow-up"></i> +12.4%
        </div>
      </div>
    </div>
  </div>

  <div class="stat-card reviews-card">
    <div class="stat-content">
      <div class="stat-icon">
        <i class="fas fa-star"></i>
      </div>
      <div class="stat-details">
        <h5>Đánh giá</h5>
        <h3>{{ totalReviewsCount }}</h3> <!-- Hiển thị tổng số lượng đánh giá -->
        <div class="stat-change increase">
          <i class="fas fa-arrow-up"></i> +8.2%
        </div>
      </div>
    </div>
  </div>

  <div class="stat-card users-card">
    <div class="stat-content">
      <div class="stat-icon">
        <i class="fas fa-users"></i>
      </div>
      <div class="stat-details">
        <h5>Người dùng</h5>
        <h3>{{ userCount }}</h3>
        <div class="stat-change increase">
          <i class="fas fa-arrow-up"></i> +5.9%
        </div>
      </div>
    </div>
  </div>

  <div class="stat-card products-card">
    <div class="stat-content">
      <div class="stat-icon">
        <i class="fas fa-box"></i>
      </div>
      <div class="stat-details">
        <h5>Sản phẩm</h5>
        <h3>{{ totalProductsCount }}</h3>
        <div class="stat-change increase">
          <i class="fas fa-arrow-up"></i> +15.7%
        </div>
      </div>
    </div>
  </div>
</div>
           <!-- Date Range Selector -->
<div class="date-range">
  <input type="date" v-model="fromDate" />
  <input type="date" v-model="toDate" />
  <button @click="fetchRevenueData">Lấy doanh thu</button>
</div>


          <!-- Revenue Chart -->
<div class="chart-container">
  <div class="chart-card">
    <div class="chart-header">
      <h5>Biểu đồ doanh thu</h5>
    </div>
    <div class="chart-body">
      <canvas id="revenueChart"></canvas>
    </div>
    <!-- Hiển thị tổng doanh thu -->
    <div class="total-revenue">
      <h6>Tổng doanh thu của tất cả đơn hàng:</h6>
      <p id="totalRevenueAmount">0 triệu đồng</p> <!-- Phần này sẽ cập nhật tổng doanh thu -->
    </div>
  </div>
</div>



          <!-- bảng các dơn hàng gần đây -->
          <div class="table-card">
            <div class="table-header">
              <h5>Đơn hàng gần đây</h5>
            </div>
            <div class="table-body">
              <table class="orders-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Sản phẩm</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="order in recentOrders" :key="order.id">
                    <td>#{{ order.id }}</td>
                    <td>{{ order.user_name }}</td>
                    <td>
                    <div v-for="product in order.products" :key="product.id">
                      {{ product.name }} <!-- Hiển thị tên sản phẩm -->
                    </div>
          </td>
          <td>
            <div v-for="product in order.products" :key="product.id">
              {{ product.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }} <!-- Hiển thị giá -->
            </div>
          </td>
          <td>
            <span :class="['status-badge', getStatusBadgeClass(order.status)]">
              {{ order.status }}
            </span>
          </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import Slider from "../components/admin/Slider.vue";
import Nav from "../components/admin/Nav.vue";
import Footer from "../components/admin/Footer.vue";
import Chart from 'chart.js/auto';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Dashboard",
  components: {
    Slider,
    Nav,
    Footer,
  },
  data() {
    return {
      fromDate: '', // Ngày bắt đầu
    toDate: '',   // Ngày kết thúc
      recentOrders: [],
      orderCount: 0,
      totalReviewsCount: 0, // Thêm biến để lưu tổng số lượng đánh giá
      totalProductsCount: 0,
      revenueData: [], // Dữ liệu doanh thu từ API
      revenueChart: null, // Đối tượng biểu đồ
      totalRevenue: 0, // Tổng doanh thu
      monthlyRevenueData: [], // Dữ liệu doanh thu theo tháng

    }
  },
   mounted() {
    this.initRevenueChart();
    this.fetchOrderCount(); // Gọi API để cập nhật recentOrders
    this.fetchRecentOrders(); // Gọi API để lấy các đơn hàng mới nhất (nếu cần)
    this.fetchTotalReviewsCount(); // Gọi API để lấy tổng số đánh giá
    this.fetchUserCount();
     this.fetchTotalProductsCount()
     this.fetchTotalRevenue();//tong doanh thu  


  },
  methods: {

    //biểu đồ
     initRevenueChart() {
    const ctx = document.getElementById('revenueChart');
    // Dữ liệu biểu đồ mẫu
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        datasets: [{
          label: 'Doanh thu (triệu đồng)',
          data: [150, 200, 180, 250, 220, 300, 280, 350, 330, 400, 380, 450],
          fill: false,
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  },




    async fetchUserCount() {
  try {
    const response = await axios.get('http://localhost:8000/v1/user/user-count'); // Thay đổi URL nếu cần
    if (response.data.success) {
      this.userCount = response.data.count; // Lưu số lượng người dùng vào state
    } else {
      console.error(response.data.message);
    }
  } catch (error) {
    console.error("Lỗi khi lấy số lượng người dùng:", error);
  }
},
  // tổng số đánh giá
    async fetchTotalReviewsCount() { 
      try {
        const response = await axios.get('http://localhost:8000/v1/review/reviews/total'); // URL API để lấy tổng số đánh giá
        if (response.data.success) {
          this.totalReviewsCount = response.data.totalReviewsCount; // Lưu tổng số đánh giá từ phản hồi
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tổng số đánh giá:", error);
      }
    },
    // Phương thức để lấy tổng số sản phẩm
    async fetchTotalProductsCount() { 
      try {
        const response = await axios.get('http://localhost:8000/v1/product/products/count'); // URL API để lấy tổng số đánh giá
        if (response.data.success) {
          this.totalProductsCount = response.data.total; // Lưu tổng số đánh giá từ phản hồi
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tổng số đánh giá:", error);
      }
    },
    //Lấy số lượng đơn hàng
      async fetchOrderCount() {
        try {
          const response = await axios.get('http://localhost:8000/v1/order/orders/count');
          // Lưu số lượng đơn hàng từ phản hồi
          if (response.data.success) {
            this.orderCount = response.data.data; // Lấy số lượng đơn hàng từ data
          } else {
            console.error(response.data.message); // In ra thông báo lỗi nếu có
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        }
      },
      //lấy các đơn hàng gần nhất
      async fetchRecentOrders() {
        try {
          const response = await axios.get('http://localhost:8000/v1/order/orders/recent'); 
          if (response.data.success) {
            this.recentOrders = response.data.data.map(order => ({
              id: order.ORDER_CODE,
              user_name: order.account.USER_NAME, // Lấy USER_NAME từ account
              products: order.products.map(product => ({
                id: product.id, // ID sản phẩm
                name: product.name, // Tên sản phẩm
                unitPrice: product.unitPrice // Giá sản phẩm
              })), // Hiển thị danh sách sản phẩm
              status: order.ORDER_STATUS,
            }));
          } else {
            console.error(response.data.message); // In ra thông báo lỗi nếu có
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        }
      },
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
    async fetchTotalRevenue() {
      try {
        const response = await axios.get('http://localhost:8000/v1/order/total-revenue');
        if (response.data.success) {
          this.totalRevenue = response.data.data;
          
          // Cập nhật hiển thị tổng doanh thu
          document.getElementById('totalRevenueAmount').innerText = 
            `${this.totalRevenue.toLocaleString('vi-VN')} triệu đồng`;
          
          // Cập nhật biểu đồ
          this.updateRevenueChart(this.totalRevenue);
        }
      } catch (error) {
        console.error("Lỗi khi lấy tổng doanh thu:", error);
      }
    },
 
  },
 
}
</script>

<style scoped>
@import '../style.css/dasboard.css';

</style>