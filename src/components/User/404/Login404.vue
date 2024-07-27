<template>
    <div class="error-page">
      <div class="error-container">
        <h2 class="error-title">Đăng nhập không thành công</h2>
        <p class="error-message">Tên người dùng hoặc mật khẩu không chính xác. Vui lòng thử lại.</p>
        <router-link to="/login" class="error-link">Quay lại trang đăng nhập</router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "404Login"
  };
  </script>
  
  <style scoped>
  </style>
  