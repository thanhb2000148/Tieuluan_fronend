<template>
  <nav class="navbar navbar-expand px-3 border-bottom">
    <button class="btn" id="sidebar-toggle" type="button">
      <span class="navbar-toggler-icon"> <i class="bi bi-list-task"></i></span>
    </button>
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
            <a href="#" class="dropdown-item">Profile</a>
            <a href="#" class="dropdown-item">Setting</a>
            <a href="#" class="dropdown-item">Logout</a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "NavBarDashboard",
};
</script>

<style></style>
