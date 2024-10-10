<template>
  <aside id="sidebar" class="js-sidebar">
    <!-- Content For Sidebar -->
    <div class="h-100">
      <div class="sidebar-logo text-center mb-4">
        <a href="#" class="font-weight-bold">Admin</a>
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
            data-bs-target="#product-pages"
            data-bs-toggle="collapse"
            aria-expanded="false"
            ><i class="fa-solid fa-boxes pe-2"></i>
            Quản lý Sản phẩm
          </a>
          <ul
            id="product-pages"
            class="sidebar-dropdown list-unstyled collapse"
            data-bs-parent="#sidebar"
          >
            <!-- <li class="sidebar-item">
              <router-link to="/admin/products">
                <a class="sidebar-link">Danh sách Sản phẩm</a>
              </router-link>
            </li> -->
            <li class="sidebar-item">
              <router-link to="/admin/addProducts">
                <a class="sidebar-link">Thêm Sản phẩm</a>
              </router-link>
            </li>
            <li class="sidebar-item">
              <router-link to="/admin/productDetails">
                <a class="sidebar-link">Chi tiết Sản phẩm</a>
              </router-link>
            </li>
          </ul>
        </li>

        <li class="sidebar-item">
          <router-link to="/admin/products">
            <a class="sidebar-link">Quản lý Kho</a>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/admin/addprices">
            <a class="sidebar-link">Quản lý Giá</a>
          </router-link>
        </li>
        <li class="sidebar-item">
          <router-link to="/admin/category">
            <a class="sidebar-link">Quản lý Danh Mục</a>
          </router-link>
        </li>
         <li class="sidebar-item">
          <router-link to="/admin/user">
            <a class="sidebar-link">Quản lý người dùng</a>
          </router-link>
        </li>
      </ul>
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
  background-color: #343a40;
  color: #fff;
  min-height: 100vh;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  transition: width 0.3s;
}

.sidebar-logo {
  font-size: 24px;
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
}

.sidebar-nav {
  list-style-type: none;
  padding: 0;
}

.sidebar-item {
  position: relative;
  margin-bottom: 10px;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #fff;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s;
}

.sidebar-link:hover,
.sidebar-link:focus {
  background-color: #495057;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.sidebar-link i {
  min-width: 20px; /* Giúp biểu tượng có độ rộng đều nhau */
  transition: transform 0.3s;
}

.sidebar-link:hover i {
  transform: scale(1.1); /* Tăng kích thước biểu tượng */
}

</style>
