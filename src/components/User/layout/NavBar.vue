<template>
  <div class="container px-0">
    <nav class="navbar navbar-light bg-white navbar-expand-xl fixed-top shadow">
      <router-link to="/" class="navbar-brand">
        <h1 class="text-dark color1 display-6">BAD HABBITS STORE</h1>
      </router-link>
      <button
        class="navbar-toggler py-2 px-3"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarCollapse"
      >
        <span class="fa fa-bars text-primary"></span>
      </button>
      <div class="collapse navbar-collapse bg-white" id="navbarCollapse">
        <ul class="navbar-nav mx-auto">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="active">
              <i class="fas fa-home"></i> Trang chủ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/shop" class="nav-link" active-class="active">
              <i class="fas fa-store"></i> Cửa hàng
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/contact" class="nav-link" active-class="active">
              <i class="fas fa-phone-alt"></i> Liên hệ
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/new" class="nav-link" active-class="active">
              <i class="fas  fa-file-alt "></i> Bài Viết
            </router-link>
          </li>
        </ul>
        <div class="d-flex m-3 me-0">
          <button
            class="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
            data-bs-toggle="modal"
            data-bs-target="#searchModal"
          >
            <i class="fas fa-search text-primary"></i>
          </button>
           <!-- Nút yêu thích với icon trái tim nằm sau nút tìm kiếm -->
<router-link to="/favorite" class="btn btn-favorite border border-secondary btn-md-square rounded-circle bg-white me-4">
  <i class="fas fa-heart"></i>
</router-link>

          <router-link to="/cart" class="position-relative me-4 my-auto">
            <i class="fa fa-shopping-bag fa-2x"></i>
            <span
              class="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
              style="top: -5px; left: 15px; height: 20px; min-width: 20px"
              >{{ cart.length }}</span>
          </router-link>
          
          <!-- Dropdown menu cải tiến -->
          <div class="dropdown my-auto">
            <a 
              href="#" 
              class="d-flex align-items-center text-dark text-decoration-none"
              @click.prevent="toggleDropdown"
              ref="dropdownToggle"
            >
              <i class="fas fa-user fa-2x"></i>
            </a>
            <ul 
              class="dropdown-menu dropdown-menu-end shadow"
              :class="{ 'show': isDropdownOpen }"
              ref="dropdownMenu"
            >
              <li>
                <router-link to="/userinformation" class="dropdown-item">
                  <i class="fas fa-user-circle me-2"></i>Thông tin người dùng
                </router-link>
              </li>
              <li v-if="isAdmin">
                <router-link to="/admin" class="dropdown-item">
                  <i class="fas fa-cog me-2"></i>Quản trị viên
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a href="#" class="dropdown-item text-danger" @click.prevent="logout">
                  <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import cartService from "@/services/cart.service";
import VueCookies from "vue-cookies";
import userService from "@/services/user.service";

export default {
  name: "NavBar",
  data() {
    return {
      cart: [],
      user: [],
      isAdmin: false,
      isDropdownOpen: false
    };
  },
  async created() {
    await this.fetchUserLogin();
    await this.getCart();
    // Thêm event listener để đóng dropdown khi click outside
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() { // Đã được sửa từ beforeDestroy thành beforeUnmount
    // Cleanup event listener khi component bị hủy
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    handleClickOutside(event) {
      // Kiểm tra xem click có nằm ngoài dropdown không
      if (this.$refs.dropdownToggle && 
          this.$refs.dropdownMenu && 
          !this.$refs.dropdownToggle.contains(event.target) && 
          !this.$refs.dropdownMenu.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
    // async fetchUserLogin() {
    //   try {
    //     const response = await userService.getUserLogin();
    //     if (response && response.data) {
    //       this.user = response.data;
    //       this.isAdmin = this.user.OBJECT_ROLE?.IS_ADMIN === true;
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // },
    async fetchUserLogin() {
      try {
        const response = await userService.getUserLogin();
        if (response && response.data) {
          this.user = response.data;
          this.isAdmin = this.user.OBJECT_ROLE?.IS_ADMIN === true;

          // Kiểm tra trạng thái IS_LOCK
          if (this.user.IS_LOCK) {
            await Swal.fire({
              icon: "error",
              title: "Tài khoản bị khóa",
              text: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ bộ phận hỗ trợ.",
              confirmButtonText: "OK",
            });
            this.logout(); // Gọi hàm logout để điều hướng về trang đăng nhập
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    async getCart() {
      try {
        const response = await cartService.getCart();
        if (response && response.data) {
          this.cart = response.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async logout() {
      try {
        VueCookies.remove("access_token");
        VueCookies.remove("refresh_token");
        this.isDropdownOpen = false; // Đóng dropdown khi logout
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    }
  }
};
</script>

<style scoped>
.color1 {
  color: black !important;
}

.fixed-top {
  position: fixed;
  top: 0 !important;
  right: 0;
  left: 0;
  z-index: 1030;
}

.shadow {
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}

/* Thay đổi styles cho navbar */
.navbar {
  padding: 1rem 1.5rem; /* Tăng padding cho thanh navbar */
}

.navbar-brand {
  font-size: 1.5rem; /* Điều chỉnh kích thước chữ cho tên thương hiệu */
}

.nav-link {
  padding: 0.75rem 1rem; /* Thay đổi padding cho các liên kết */
}

/* Thêm styles cho dropdown */
.dropdown-menu {
  min-width: 200px;
  padding: 0.5rem 0;
  margin: 0;
  border: none;
  border-radius: 0.5rem;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #333;
  transition: all 0.2s;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
}

.dropdown-divider {
  margin: 0.5rem 0;
}

.text-danger:hover {
  color: #dc3545 !important;
}

/* Animation cho dropdown */
.dropdown-menu {
  display: block;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition: all 0.2s ease;
}

.dropdown-menu.show {
  right: 3px;
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Thêm margin-top cho body để không bị đè lên bởi navbar */
body {
  margin-top: 56px; /* Điều chỉnh theo chiều cao của navbar */
}

.btn-favorite {
  background-color: #ffffff; /* Màu nền trắng */
  border: 1px solid #dc3545; /* Viền đỏ */
  color: #dc3545; /* Màu chữ đỏ */
  transition: background-color 0.3s, color 0.3s; /* Hiệu ứng chuyển đổi mượt mà */
  padding: 10px; /* Thêm padding cho nút */
  font-size: 1.2em; /* Kích thước font chữ */
}

.btn-favorite:hover {
  
  color: #dc3545; /* Giữ màu chữ đỏ khi di chuột */
  cursor: pointer; /* Hiển thị con trỏ như nút bấm */
}

.btn-favorite:hover i {
  color: #dc3545; /* Giữ màu đỏ cho icon trái tim khi di chuột */
}

.nav-link {
  color: #333; /* Màu chữ mặc định */
  transition: color 0.3s; /* Hiệu ứng chuyển đổi màu */
}

.nav-link:hover {
  color: #dc3545; /* Màu chữ khi di chuột */
  cursor: pointer; /* Hiển thị con trỏ khi di chuột */
}

.nav-link i {
  font-size: 1.2em; /* Kích thước biểu tượng */
  transition: transform 0.3s; /* Hiệu ứng chuyển đổi cho biểu tượng */
}

.nav-link:hover i {
  transform: scale(1.1); /* Phóng to biểu tượng khi di chuột */
}

</style>
