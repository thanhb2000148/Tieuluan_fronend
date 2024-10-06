<template>
  <aside id="sidebar" class="js-sidebar">
    <!-- Content For Sidebar -->
    <div class="h-100">
      <div class="sidebar-logo">
        <a href="#">Admin</a>
      </div>
      <ul class="sidebar-nav">
        <li class="sidebar-item">
          <a href="#" class="sidebar-link">
            <i class="fa-solid fa-list pe-2"></i>
            Dashboard
          </a>
        </li>
        <li class="sidebar-item">
          <a
            href="#"
            class="sidebar-link collapsed"
            data-bs-target="#pages"
            data-bs-toggle="collapse"
            aria-expanded="false"
            ><i class="fa-solid fa-file-lines pe-2"></i>
            Trang
          </a>
          <ul
            id="pages"
            class="sidebar-dropdown list-unstyled collapse"
            data-bs-parent="#sidebar"
          >
            <li class="sidebar-item">
              <router-link to="/admin/products"
                ><a class="sidebar-link">Quản lý Kho</a></router-link
              >
            </li>
            <li class="sidebar-item">
              <router-link to="/admin/user">
                <a class="sidebar-link">Quản lý người dùng</a></router-link
              >
            </li>
            <li class="sidebar-item">
              <router-link to="/admin/addProducts" class="sidebar-link">
                Quản lý sản phẩm
              </router-link>
            </li>
             <li class="sidebar-item">
              <router-link to="/admin/category" class="sidebar-link">
                Quản lý Danh Mục
              </router-link>
            </li>

            <li class="sidebar-item">
              <router-link to="/admin/addprices" class="sidebar-link">
                Quản lý Giá 
              </router-link>
            </li>

          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
import userService from "@/services/user.service";
// import VueCookies from "vue-cookies";


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
  }
};
</script>

<style></style>
