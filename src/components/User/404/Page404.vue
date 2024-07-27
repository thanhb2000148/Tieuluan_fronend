<template>
  <div class="container-fluid py-5">
    <div class="container py-5 text-center">
      <div class="row justify-content-center">
        <div class="col-lg-6">
          <i class="bi bi-exclamation-triangle display-1 text-secondary"></i>
          <h1 class="display-1">404</h1>
          <h1 class="mb-4">Không tìm thấy trang</h1>
          <p class="mb-4">
            Xin lỗi, trang bạn tìm kiếm không tồn tại trong trang của chúng
            tôi,Có thể truy cập trang chủ của chúng tôi hoặc thử sử dụng tìm
            kiếm trang khác?
          </p>
          <router-link to="/"
            ><a class="btn border-secondary rounded-pill py-3 px-5"
              >Trở lại trang chủ</a
            ></router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "404Page",
};
</script>

<style></style>
