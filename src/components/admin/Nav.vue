<template>
  <nav class="navbar navbar-expand px-3 border-bottom">
    <!-- <button class="btn" id="sidebar-toggle" type="button">
      <span class="navbar-toggler-icon"> <i class="bi bi-list-task"></i></span>
    </button> -->
    <div class="navbar-collapse navbar">
      <ul class="navbar-nav">
        <li class="nav-item dropdown">
          <a href="#" data-bs-toggle="dropdown" class="nav-icon pe-md-0">
            <img
              src="../../../public/img/profile.jpg"
              class="avatar img-fluid rounded"
              alt=""
            />
          </a>
          <div class="dropdown-menu dropdown-menu-end">
            <router-link to="/userinformation" class="dropdown-item">Profile</router-link>
            <!-- <a href="#" class="dropdown-item">Setting</a> -->
            <a href="#" class="dropdown-item" @click="logout">Logout</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import VueCookies from "vue-cookies";

export default {
  name: "NavBarDashboard",
  methods: {
    logout() {
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
  }
};

</script>

<style></style>
