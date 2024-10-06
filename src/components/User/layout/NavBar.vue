<template>
  <div class="container px-0 ">
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
              <i class="fas fa-envelope"></i> Liên hệ
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
          <router-link to="/cart" class="position-relative me-4 my-auto">
            <i class="fa fa-shopping-bag fa-2x"></i>
            <span
              class="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
              style="top: -5px; left: 15px; height: 20px; min-width: 20px"
              >{{ cart.length }}</span
            >
          </router-link>
          <!-- <router-link to="/userinformation" class="my-auto">
            <i class="fas fa-user fa-2x"></i>
          </router-link> -->
           <div class="dropdown my-auto">
            <router-link to="/userinformation" class="d-flex align-items-center dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fas fa-user fa-2x"></i>
            </router-link>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <router-link to="/userinformation" class="dropdown-item">Thông tin người dùng</router-link>
              </li>
              <li v-if="isAdmin">
                <router-link to="/admin" class="dropdown-item">Quản trị viên</router-link>
              </li>
              <li>
                <button class="dropdown-item" @click="logout">Đăng xuất</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import cartService from "@/services/cart.service";
import VueCookies from "vue-cookies";
import userService from "@/services/user.service";


export default {
  name: "NavBar",
  data() {
    return {
      cart: [],
       user: [],
      isAdmin: false, // Thêm biến để lưu trạng thái admin
    };
  },
  async created() {
     await this.fetchUserLogin();
    console.log("lấy user login", this.user);
    await this.getCart();
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
          }
        } else {
          console.log("Không có dữ liệu người dùng đăng nhập.");
        }
      } catch (error) {
        console.error(error);
      }
    },

    async getCart() {
      try {
        const response = await cartService.getCart();
        if (response && response.data) {
          this.cart = response.data; // Đặt dữ liệu giỏ hàng vào biến cục bộ
        }
      } catch (error) {
        console.error(error);
      }
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
  },
};
</script>

<style>
.color1{
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
</style>
