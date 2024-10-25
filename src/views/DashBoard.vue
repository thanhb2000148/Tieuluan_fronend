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
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <i class="fas fa-shopping-cart"></i>
                </div>
                <div class="stat-details">
                  <h5>Đơn hàng</h5>
                  <h3>245</h3>
                  <div class="stat-change increase">
                    <i class="fas fa-arrow-up"></i> +12.4%
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <i class="fas fa-star"></i>
                </div>
                <div class="stat-details">
                  <h5>Đánh giá</h5>
                  <h3>128</h3>
                  <div class="stat-change increase">
                    <i class="fas fa-arrow-up"></i> +8.2%
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-details">
                  <h5>Người dùng</h5>
                  <h3>1,245</h3>
                  <div class="stat-change increase">
                    <i class="fas fa-arrow-up"></i> +5.9%
                  </div>
                </div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-content">
                <div class="stat-icon">
                  <i class="fas fa-box"></i>
                </div>
                <div class="stat-details">
                  <h5>Sản phẩm</h5>
                  <h3>450</h3>
                  <div class="stat-change increase">
                    <i class="fas fa-arrow-up"></i> +15.7%
                  </div>
                </div>
              </div>
            </div>
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
            </div>
          </div>

          <!-- Recent Orders Table -->
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
                    <td>{{ order.customer }}</td>
                    <td>{{ order.product }}</td>
                    <td>{{ order.total }}</td>
                    <td>
                      <span :class="['status-badge', getStatusClass(order.status)]">
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
      recentOrders: [
        { id: '1234', customer: 'Nguyễn Văn A', product: 'iPhone 13', total: '25,990,000đ', status: 'Đã giao' },
        { id: '1235', customer: 'Trần Thị B', product: 'Samsung S21', total: '20,490,000đ', status: 'Đang giao' },
        { id: '1236', customer: 'Lê Văn C', product: 'iPad Pro', total: '22,990,000đ', status: 'Chờ xử lý' },
      ]
    }
  },
  methods: {
    getStatusClass(status) {
      switch(status) {
        case 'Đã giao': return 'status-success';
        case 'Đang giao': return 'status-primary';
        case 'Chờ xử lý': return 'status-warning';
        default: return '';
      }
    },
    initRevenueChart() {
      const ctx = document.getElementById('revenueChart');
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
    }
  },
  mounted() {
    this.initRevenueChart();
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #f8f9fa;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.stat-icon i {
  font-size: 20px;
  color: #4CAF50;
}

.stat-details h5 {
  color: #6c757d;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.stat-details h3 {
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 24px;
}

.stat-change {
  font-size: 12px;
}

.increase {
  color: #4CAF50;
}

/* Chart Container */
.chart-container {
  margin-bottom: 24px;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-header {
  margin-bottom: 16px;
}

.chart-header h5 {
  margin: 0;
  color: #2c3e50;
}

.chart-body {
  height: 300px;
}

/* Table Styles */
.table-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.table-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.table-header h5 {
  margin: 0;
  color: #2c3e50;
}

.table-body {
  overflow-x: auto;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px 20px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.orders-table th {
  font-weight: 600;
  color: #6c757d;
  background: #f8f9fa;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background: #e8f5e9;
  color: #4CAF50;
}

.status-primary {
  background: #e3f2fd;
  color: #2196F3;
}

.status-warning {
  background: #fff3e0;
  color: #ff9800;
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .orders-table {
    min-width: 600px;
  }
}
</style>