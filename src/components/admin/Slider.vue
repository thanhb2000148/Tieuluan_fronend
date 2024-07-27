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
                ><a class="sidebar-link">Quản lý sản phẩm</a></router-link
              >
            </li>
            <li class="sidebar-item">
              <router-link to="/admin/user">
                <a class="sidebar-link">Quản lý người dùng</a></router-link
              >
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: "Slider",
};
</script>

<style></style>
