<template>
  <aside id="sidebar" class="js-sidebar">
    <div class="sidebar-wrapper">
      <div class="sidebar-header">
        <img src="/path-to-your-logo.png" alt="Admin Logo" class="sidebar-logo">
        <h1 class="sidebar-title">Admin</h1>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li class="sidebar-item">
            <a href="#" class="sidebar-link">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </a>
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
        </ul>
      </nav>
    </div>
  </aside>
</template>

<script>
import userService from "@/services/user.service";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Slider",
  data() {
    return {
      user: [],
      isAdmin: false, // Thêm biến để lưu trạng thái admin
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
        if (response && response.data) {
          this.user = response.data;
          console.log("User data:", this.user); // Thêm dòng này để kiểm tra

          // Kiểm tra quyền admin
          if (this.user.OBJECT_ROLE && this.user.OBJECT_ROLE.IS_ADMIN === true) {
            this.isAdmin = true;
          } else {
            this.isAdmin = false;
            this.redirectToHome(); // Chuyển hướng nếu không phải admin
          }
        } else {
          console.log("Không có dữ liệu người dùng đăng nhập.");
        }
      } catch (error) {
        console.error(error);
        this.redirectToHome(); // Chuyển hướng nếu có lỗi
      }
    },
    redirectToHome() {
      this.$router.push("/"); // Chuyển hướng về trang chủ
    },
  },
};
</script>

<style scoped>
#sidebar {
  background-color: #2c3e50;
  color: #ecf0f1;
  min-height: 100vh;
  width: 250px;
  transition: all 0.3s ease;
}

.sidebar-wrapper {
  padding: 20px 0;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
}

.sidebar-logo {
  width: 60px;
  height: auto;
  margin-bottom: 10px;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.sidebar-nav ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidebar-item {
  margin-bottom: 5px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
}

.sidebar-link:hover, .sidebar-link:focus {
  background-color: #34495e;
  color: #3498db;
}

.sidebar-link i {
  margin-right: 10px;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.has-submenu > .sidebar-link {
  justify-content: space-between;
}

.submenu-icon {
  transition: transform 0.3s ease;
}

.has-submenu > .sidebar-link[aria-expanded="true"] .submenu-icon {
  transform: rotate(180deg);
}

.submenu {
  padding-left: 20px;
}

.submenu .sidebar-link {
  padding: 10px 15px;
}

@media (max-width: 768px) {
  #sidebar {
    width: 0;
    overflow: hidden;
  }
  
  #sidebar.active {
    width: 250px;
  }
}

</style>
