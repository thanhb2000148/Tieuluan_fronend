<template>
  <aside id="sidebar" class="js-sidebar">
    <div class="sidebar-wrapper">
      <div class="sidebar-header">
        <div class="logo-container">
          <!-- Hiển thị spinner khi đang tải ảnh -->
          <div v-if="isLoading" class="spinner-container">
            <div class="spinner"></div>
          </div>
          <!-- Hiển thị ảnh logo khi không còn loading -->
          <img 
            v-if="!isLoading && avatarUrl" 
            :src="avatarUrl" 
            alt="Admin Logo" 
            class="sidebar-logo">
        </div>
        <h1 class="sidebar-title">Admin</h1>
      </div>

      <nav class="sidebar-nav">
        <ul>
          <li class="sidebar-item">
            <router-link to="/admin" class="sidebar-link">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li class="sidebar-item has-submenu">
            <a href="#" class="sidebar-link" data-bs-toggle="collapse" data-bs-target="#product-pages" aria-expanded="false">
              <i class="fas fa-box-open"></i>
              <span>Quản lý Sản phẩm</span>
              <i class="fas fa-chevron-down submenu-icon"></i>
            </a>
            <ul id="product-pages" class="submenu collapse" data-bs-parent="#sidebar">
              <li class="sidebar-item">
                <router-link to="/admin/addProducts" class="sidebar-link">
                  <i class="fas fa-plus-circle"></i>
                  <span>Thêm Sản phẩm</span>
                </router-link>
              </li>
              <li class="sidebar-item">
                <router-link to="/admin/productDetails" class="sidebar-link">
                  <i class="fas fa-info-circle"></i>
                  <span>Chi tiết Sản phẩm</span>
                </router-link>
              </li>
            </ul>
          </li>
          <li class="sidebar-item">
            <router-link to="/admin/products" class="sidebar-link">
              <i class="fas fa-warehouse"></i>
              <span>Quản lý Kho</span>
            </router-link>
          </li>
          <li class="sidebar-item">
            <router-link to="/admin/addprices" class="sidebar-link">
              <i class="fas fa-tags"></i>
              <span>Quản lý Giá</span>
            </router-link>
          </li>
          <li class="sidebar-item">
            <router-link to="/admin/category" class="sidebar-link">
              <i class="fas fa-list-ul"></i>
              <span>Quản lý Danh Mục</span>
            </router-link>
          </li>
          <li class="sidebar-item">
            <router-link to="/admin/productOder" class="sidebar-link">
              <i class="fas fa-shopping-cart"></i>
              <span>Quản lý Đơn Hàng</span>
            </router-link>
          </li>
          <li class="sidebar-item">
            <router-link to="/admin/user" class="sidebar-link">
              <i class="fas fa-users"></i>
              <span>Quản lý người dùng</span>
            </router-link>
          </li>
          <li class="sidebar-item">
            <router-link to="/admin/news" class="sidebar-link">
              <i class="fas fa-newspaper"></i>
              <span>Quản lý Tin Tức</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script>
import userService from "@/services/user.service";
import Swal from 'sweetalert2';


export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Slider",
  data() {
    return {
      user: [],
      isAdmin: false, // Thêm biến để lưu trạng thái admin
      avatarUrl: "", // Biến để lưu URL ảnh đại diện
      isLoading: true, // Biến để theo dõi trạng thái loading
    };
  },
  async created() {
    await this.fetchUserLogin();
    console.log("lấy user login", this.user);
  },
  methods: {
    async fetchUserLogin() {
      try {
        const response = await userService.getUserLogin();
         console.log("Response từ getUserLogin:", response); // Debugging
        if (response && response.data) {
          this.user = response.data;
          const userId = this.user.USER_ID;
          await this.getUserById(userId); // Lấy thông tin chi tiết người dùng, bao gồm AVT_URL 

          // Kiểm tra quyền admin
          if (this.user.OBJECT_ROLE && this.user.OBJECT_ROLE.IS_ADMIN === true) {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
            this.redirectToHome(); // Chuyển hướng nếu không phải admin
          }
        } else {
          // Nếu không có dữ liệu, coi như token không hợp lệ
        this.handleTokenError({ response: { data: { message: "Token không hợp lệ" } } });
        }
      } catch (error) {
         console.error("Lỗi khi gọi API:", error); // Debugging
        // this.redirectToHome(); 
        this.handleTokenError(error); // Chuyển hướng nếu có lỗi

      }
    },
    redirectToHome() {
      this.$router.push("/"); // Chuyển hướng về trang chủ
    },
     handleTokenError(error) {
    // Kiểm tra thông báo lỗi từ phản hồi
    if (error.response && error.response.data && error.response.data.message === 'Token không hợp lệ') {
      console.log("Token không hợp lệ đã được phát hiện."); // Debugging
      Swal.fire({
        icon: 'error',
        title: 'Phiên đăng nhập đã hết hạn',
        text: 'Vui lòng đăng nhập lại.',
        confirmButtonText: 'OK'
      }).then(() => {
        localStorage.removeItem('token'); // Xóa token
        this.redirectToLogin(); // Chuyển hướng về trang đăng nhập
      });
    } else {
      console.log("Không có dữ liệu người dùng đăng nhập.");
    }
  },

  redirectToLogin() {
    this.$router.push("/login"); // Chuyển hướng về trang đăng nhập
  },

    async getUserById(id) {
      try {
        this.isLoading = true; // Bắt đầu loading
        const response = await userService.getUserById(id);
        console.log("Response từ getUserById:", response); // In toàn bộ response ra để kiểm tra
        if (response && response.data && response.data.AVT_URL) {
          this.avatarUrl = response.data.AVT_URL; // Gán AVT_URL từ response.data
          console.log("Avatar URL:", this.avatarUrl); // Kiểm tra URL trong console
        } else {
          console.error("Không tìm thấy AVT_URL");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      } finally {
        this.isLoading = false; // Kết thúc loading
      }
    }
  },
};
</script>

<style scoped>
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Chiều cao đầy đủ */
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3); /* Màu nền */
  border-radius: 50%;
  border-top: 4px solid #fff; /* Màu cho phần đỉnh */
  width: 30px; /* Chiều rộng của spinner */
  height: 30px; /* Chiều cao của spinner */
  animation: spin 1s linear infinite; /* Hiệu ứng xoay */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>


<style scoped>
#sidebar {
  background-color: #2c3e50; /* Màu nền của sidebar */
  color: #ecf0f1; /* Màu chữ trong sidebar */
  min-height: 100vh; /* Chiều cao tối thiểu của sidebar là 100% chiều cao viewport */
  width: 250px; /* Chiều rộng của sidebar */
  transition: all 0.3s ease; /* Hiệu ứng chuyển tiếp mượt mà khi thay đổi kích thước */
}

.sidebar-wrapper {
  padding: 20px 0; /* Khoảng cách trên và dưới trong wrapper của sidebar */
}

.sidebar-header {
  padding: 20px; /* Khoảng cách trong phần header của sidebar */
  text-align: center; /* Canh giữa nội dung trong header */
}

.sidebar-logo {
  width: 60px; /* Chiều rộng của logo */
  height: auto; /* Chiều cao tự động để giữ tỉ lệ khung hình */
  margin-bottom: 10px; /* Khoảng cách dưới logo */
}

.sidebar-title {
  font-size: 1.8rem; /* Tăng kích thước chữ của tiêu đề */
  font-weight: 700; /* Độ đậm của chữ, tăng độ đậm lên 700 */
  margin: 0; /* Không có khoảng cách bên ngoài cho tiêu đề */
  color: #ecf0f1; /* Màu chữ sáng hơn để nổi bật trên nền tối */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* Thêm bóng chữ để tạo chiều sâu */
  letter-spacing: 1px; /* Khoảng cách giữa các ký tự */
  text-transform: uppercase; /* Chữ hoa tất cả */
  transition: color 0.3s ease; /* Hiệu ứng chuyển màu khi hover */
}

.sidebar-title:hover {
  color: #3498db; /* Màu chữ chuyển thành xanh lam khi hover */
}


.sidebar-nav ul {
  list-style-type: none; /* Bỏ dấu chấm ở đầu các mục danh sách */
  padding: 0; /* Không có khoảng cách bên trong cho danh sách */
  margin: 0; /* Không có khoảng cách bên ngoài cho danh sách */
}

.sidebar-item {
  margin-bottom: 5px; /* Khoảng cách giữa các mục sidebar */
}

.sidebar-link {
  display: flex; /* Sử dụng flexbox để sắp xếp các mục */
  align-items: center; /* Canh giữa các mục theo chiều dọc */
  padding: 12px 20px; /* Khoảng cách bên trong cho các liên kết */
  color: #ecf0f1; /* Màu chữ cho các liên kết */
  text-decoration: none; /* Bỏ gạch chân cho các liên kết */
  transition: all 0.3s ease; /* Hiệu ứng chuyển tiếp mượt mà khi hover */
}

.sidebar-link:hover, .sidebar-link:focus {
  background-color: #34495e; /* Màu nền khi hover hoặc focus */
  color: #3498db; /* Màu chữ khi hover hoặc focus */
}

.sidebar-link i {
  margin-right: 10px; /* Khoảng cách bên phải cho biểu tượng */
  font-size: 1.1rem; /* Kích thước chữ cho biểu tượng */
  width: 20px; /* Chiều rộng của biểu tượng */
  text-align: center; /* Canh giữa biểu tượng */
}

.has-submenu > .sidebar-link {
  justify-content: space-between; /* Đặt khoảng cách giữa liên kết và biểu tượng submenu */
}

.submenu-icon {
  transition: transform 0.3s ease; /* Hiệu ứng chuyển tiếp cho biểu tượng submenu */
}

.has-submenu > .sidebar-link[aria-expanded="true"] .submenu-icon {
  transform: rotate(180deg); /* Quay biểu tượng submenu khi mở */
}

.submenu {
  padding-left: 20px; /* Khoảng cách bên trái cho submenu */
}

.submenu .sidebar-link {
  padding: 10px 15px; /* Khoảng cách bên trong cho các liên kết submenu */
}

@media (max-width: 768px) {
  #sidebar {
    width: 0; /* Đặt chiều rộng của sidebar là 0 khi nhỏ hơn 768px */
    overflow: hidden; /* Ẩn nội dung bên trong */
  }
  
  #sidebar.active {
    width: 250px; /* Mở rộng chiều rộng khi sidebar được kích hoạt */
  }
}

.sidebar-logo {
  width: 125px; /* Tăng kích thước logo */
  height: 125px; /* Đặt chiều cao logo */
  border-radius: 50%; /* Làm tròn góc để tạo hình tròn */
  margin-bottom: 10px; /* Khoảng cách dưới logo */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Thêm bóng đổ */
  transition: transform 0.3s ease; /* Hiệu ứng chuyển động khi hover */
}

.sidebar-logo:hover {
  transform: scale(1.05); /* Phóng to logo một chút khi hover */
}

</style>
